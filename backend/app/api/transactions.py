from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.transaction import Transaction
from app.models.wallet import Wallet
from app.core.security import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])

# Get transactions for current user
@router.get("/", summary="List all transactions for current user")
def get_transactions(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet:
        return {"transactions": []}

    transactions = db.query(Transaction).filter(Transaction.wallet_id == wallet.id).order_by(Transaction.created_at.desc()).all()
    return transactions
