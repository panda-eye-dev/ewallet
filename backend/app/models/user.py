import enum
from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import text
from sqlalchemy.sql.sqltypes import TIMESTAMP
from app.core.database import Base


class UserRole(str, enum.Enum):
    parent = "parent"
    child = "child"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    role = Column(
        Enum(UserRole, name="user_role", create_type=False),
        nullable=False
    )

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=text("now()"),
        nullable=False
    )

    # Parent–Child relation
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    parent = relationship(
        "User",
        remote_side=[id],
        back_populates="children"
    )

    children = relationship(
        "User",
        back_populates="parent"
    )

    wallet = relationship(
        "Wallet",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )
