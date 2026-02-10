from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float
from sqlalchemy.sql.sqltypes import TIMESTAMP 
from app.core.database import Base
from sqlalchemy.sql.expression import null, text
from sqlalchemy.orm import relationship

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    wallet_id = Column(Integer, ForeignKey("wallets.id"))
    amount = Column(Float)
    txn_type = Column(String)  # "credit" or "debit"
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))

    wallet = relationship(
        "Wallet",
        back_populates="transactions" 
    )
