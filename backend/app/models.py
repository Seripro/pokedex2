from sqlalchemy import Column, Integer, String, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from .database import Base

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    pokemon_id = Column(Integer, index=True, nullable=False)
    memo = Column(String, index=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 💡 実務テクニック: 同じユーザーが同じポケモンを2回重複して登録できないようにするユニーク制約
    __table_args__ = (
        UniqueConstraint('user_id', 'pokemon_id', name='_user_pokemon_uc'),
    )