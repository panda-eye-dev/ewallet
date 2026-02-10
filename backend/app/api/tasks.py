# app/routers/tasks.py

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.task import Task
from app.models.user import User, UserRole
from app.models.transaction import Transaction
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.services.wallet_service import get_or_create_wallet
from app.services.notification_service import send_push_notification

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("/create", response_model=TaskResponse)
def create_task(
    background_tasks: BackgroundTasks,
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if current_user.role != UserRole.parent:
        raise HTTPException(403, "Only parents can create tasks")

    child = db.query(User).filter(
        User.id == task.child_id,
        User.parent_id == current_user.id,
        User.role == UserRole.child
    ).first()

    if not child:
        raise HTTPException(400, "Invalid child for this parent")

    new_task = Task(
        title=task.title,
        description=task.description,
        reward_amount=task.reward_amount,
        parent_id=current_user.id,
        child_id=child.id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    background_tasks.add_task(
        send_push_notification,
        child.id,
        "New Task Assigned",
        f"You have a new task: {task.title}"
    )

    return new_task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(404, "Task not found")

    if task.parent_id != current_user.id:
        raise HTTPException(403, "Not authorized")

    for field, value in task_data.dict(exclude_unset=True).items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)

    return task


@router.delete("/{task_id}")
def delete_task(
    background_tasks: BackgroundTasks,
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(404, "Task not found")

    if current_user.id != task.parent_id:
        raise HTTPException(403, "Not authorized")

    if task.status == "approved":
        raise HTTPException(
            status_code=400,
            detail="Cannot delete an approved task"
        )

    db.delete(task)
    db.commit()

    background_tasks.add_task(
        send_push_notification,
        task.parent_id,
        "Task Deleted",
        f"This task was deleted: {task.title}"
    )

    return {"message": "Task deleted successfully"}


@router.get("/", response_model=list[TaskResponse])
def get_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if current_user.role == UserRole.parent:
        return db.query(Task).filter(Task.parent_id == current_user.id).all()

    return db.query(Task).filter(Task.child_id == current_user.id).all()


@router.patch("/{task_id}/complete", response_model=TaskResponse)
def complete_task(
    background_tasks: BackgroundTasks,
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if current_user.role != UserRole.child:
        raise HTTPException(403, "Only child can complete task")

    task = db.query(Task).filter(
        Task.id == task_id,
        Task.child_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(404, "Task not found")

    if task.status != "pending":
        raise HTTPException(409, "Task already completed")

    task.status = "completed"
    db.commit()
    db.refresh(task)

    background_tasks.add_task(
        send_push_notification,
        task.parent_id,
        "Task Completed",
        f"{task.title} was completed"
    )

    return task


@router.patch("/{task_id}/approve", response_model=TaskResponse)
def approve_task(
    background_tasks: BackgroundTasks,
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if current_user.role != UserRole.parent:
        raise HTTPException(403, "Only parent can approve")

    task = db.query(Task).filter(
        Task.id == task_id,
        Task.parent_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(404, "Task not found")

    if task.status != "completed":
        raise HTTPException(400, "Task not completed yet")

    parent_wallet = get_or_create_wallet(db, task.parent_id)
    child_wallet = get_or_create_wallet(db, task.child_id)

    if parent_wallet.balance < task.reward_amount:
        raise HTTPException(400, "Insufficient balance")

    parent_wallet.balance -= task.reward_amount
    child_wallet.balance += task.reward_amount

    db.add_all([
        Transaction(wallet_id=parent_wallet.id, amount=task.reward_amount, txn_type="debit"),
        Transaction(wallet_id=child_wallet.id, amount=task.reward_amount, txn_type="credit"),
    ])

    task.status = "approved"
    db.commit()
    db.refresh(task)

    background_tasks.add_task(
        send_push_notification,
        task.child_id,
        "Task Approved",
        f"You earned ₹{task.reward_amount}"
    )

    return task
