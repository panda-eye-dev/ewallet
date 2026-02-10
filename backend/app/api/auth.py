from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.wallet import Wallet
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token, ChildCreate
from app.core.security import hash, verify, create_access_token, get_current_user
from fastapi.security.oauth2 import OAuth2PasswordRequestForm

router = APIRouter(
    prefix="/auth",
    tags=['Authentication']
)

@router.post('/register', response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists"
        )

    hashed_pw = hash(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_pw,
        role=user.role
    )

    db.add(new_user)
    wallet = Wallet(user_id=new_user.id, balance=0)
    db.add(wallet)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.post('/login', response_model=Token)
def login(user_credentials:OAuth2PasswordRequestForm = Depends(),
          db: Session = Depends(get_db)):
    
    user = db.query(User).filter(User.email == user_credentials.username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid credentials"
        )
    
    access_token = create_access_token(
        data={"user_id": user.id}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/children")
def create_child(
    child: ChildCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="Only parents can create child accounts")

    existing_user = db.query(User).filter(User.email == child.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash(child.password)

    new_child = User(
        name=child.child_name,
        email=child.email,
        hashed_password=hashed_password,
        role="child",
        parent_id=current_user.id
    )

    db.add(new_child)
    db.commit()
    db.refresh(new_child)

    # Create wallet for child
    wallet = Wallet(user_id=new_child.id, balance=0)
    db.add(wallet)
    db.commit()

    return {"message": "Child account created successfully",
            "Child id": new_child.id}
