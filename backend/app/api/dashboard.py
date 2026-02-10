from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.task import Task
from app.models.transaction import Transaction
from app.models.wallet import Wallet
from app.models.user import User, UserRole

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Filter tasks based on role
    task_query = db.query(Task)

    if current_user.role == UserRole.parent:
        task_query = task_query.filter(Task.parent_id == current_user.id)
    else:
        task_query = task_query.filter(Task.child_id == current_user.id)

    total_tasks = task_query.count()

    pending = task_query.filter(Task.status == "pending").count()
    completed = task_query.filter(Task.status == "completed").count()
    approved = task_query.filter(Task.status == "approved").count()

    # Wallet balance
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()

    balance = wallet.balance if wallet else 0

    # Transaction summary
    wallet_id = wallet.id if wallet else None

    total_credits = db.query(func.sum(Transaction.amount)).filter(
        Transaction.wallet_id == wallet_id,
        Transaction.txn_type == "credit"
    ).scalar() or 0

    total_debits = db.query(func.sum(Transaction.amount)).filter(
        Transaction.wallet_id == wallet_id,
        Transaction.txn_type == "debit"
    ).scalar() or 0

    return {
        "tasks": {
            "total": total_tasks,
            "pending": pending,
            "completed": completed,
            "approved": approved,
        },
        "wallet_balance": balance,
        "transactions": {
            "credits": total_credits,
            "debits": total_debits
        }
    }
