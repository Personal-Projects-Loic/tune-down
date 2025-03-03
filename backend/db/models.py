from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey
from sqlalchemy.orm import mapped_column, relationship
from db.database import Base


class BaseModel(Base):
    __abstract__ = True
    id = mapped_column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class User(BaseModel):
    __tablename__ = "users"

    # basic user infos
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)

    # XRPL infos
    wallet_id = Column(String, nullable=True, index=True)

    nfts = relationship("NFT", back_populates="user")


class NFT(BaseModel):
    __tablename__ = "nfts"

    # basic nft infos
    nft_id = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    collection = Column(String, index=True)
    user_id = mapped_column(Integer, ForeignKey('users.id'))
    wallet_id = Column(String, nullable=True)
    price = Column(Integer, nullable=True)

    user = relationship("User", back_populates="nfts")
