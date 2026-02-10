from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.wallet import Wallet
from app.core.security import get_current_user
from fastapi import HTTPException
from app.schemas.wallet import TopUpRequest
from app.models.transaction import Transaction
from app.services.notification_service import send_push_notification
from app.services.currency_service import get_exchange_rates


router = APIRouter(prefix="/wallet", tags=["Wallet"])

# Get wallet balance
@router.get("/", summary="Get wallet balance")
def get_wallet(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet:
        wallet = Wallet(user_id=current_user.id, balance=0)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    return {"balance": wallet.balance}

# Top-up
@router.post("/top-up")
def top_up_wallet(request: TopUpRequest, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="Only parent can top-up wallet")
    
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()

    wallet.balance += request.amount

    transaction = Transaction(
        wallet_id=wallet.id,
        amount=request.amount,
        txn_type="credit"   # top-up is always credit
    )

    db.add(transaction)

    db.commit()
    db.refresh(wallet)


    return {
        "message": "Wallet topped up successfully!",
        "balance": wallet.balance
    }
from fastapi import Query
from app.services.currency_service import get_exchange_rates

@router.get("/convert")
def convert_wallet(
    currency: str = Query("USD"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()

    if not wallet:
        return {"converted_balance": 0}

    rates = get_exchange_rates()

    if currency not in rates:
        return {"error": "Currency not supported"}

    converted = wallet.balance * rates[currency]

    return {
        "inr_balance": wallet.balance,
        "currency": currency,
        "converted_balance": round(converted, 2)
    }
