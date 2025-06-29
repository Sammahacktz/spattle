from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Boolean,
    Float,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import secrets


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    distance_overall = Column(Float, default=0.0)
    created_at = Column(DateTime, default=func.now())

    # Relationships
    battles_created = relationship(
        "Battle", back_populates="creator", cascade="all, delete-orphan"
    )
    participations = relationship(
        "BattleParty", back_populates="user", cascade="all, delete-orphan"
    )
    gained_rewards = relationship(
        "Reward", back_populates="user", cascade="all, delete-orphan"
    )


class Battle(Base):
    __tablename__ = "battles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    partycode = Column(
        String(32),
        unique=True,
        nullable=False,
        index=True,
        default=lambda: secrets.token_urlsafe(8),
    )
    description = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_active = Column(Boolean, default=True)

    # Relationships
    creator = relationship("User", back_populates="battles_created")
    party = relationship(
        "BattleParty", back_populates="battle", cascade="all, delete-orphan"
    )
    challenges = relationship(
        "Challenge", back_populates="battle", cascade="all, delete-orphan"
    )


class BattleParty(Base):
    __tablename__ = "battle_parties"
    id = Column(Integer, primary_key=True, index=True)
    battle_id = Column(Integer, ForeignKey("battles.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    joined_at = Column(DateTime, default=func.now())

    # Relationships
    battle = relationship("Battle", back_populates="party")
    user = relationship("User", back_populates="participations")


class Challenge(Base):
    __tablename__ = "challenges"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())
    icon = Column(String(255), nullable=True)
    value = Column(Float, nullable=False)
    max_value = Column(Float, nullable=True)
    start_datetime = Column(DateTime, nullable=False)
    end_datetime = Column(DateTime, nullable=False)
    battle_id = Column(Integer, ForeignKey("battles.id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_user_id = Column(
        Integer, ForeignKey("users.id"), nullable=False
    )  # The user this challenge is for

    # Relationships
    battle = relationship("Battle", back_populates="challenges")
    creator = relationship("User", foreign_keys=[creator_id])
    assigned_user = relationship("User", foreign_keys=[assigned_user_id])
    rewards = relationship(
        "Reward", back_populates="challenge", cascade="all, delete-orphan"
    )


class Reward(Base):
    __tablename__ = "rewards"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    target = Column(Float, nullable=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # who gained it

    # Relationships
    challenge = relationship("Challenge", back_populates="rewards")
    user = relationship("User", back_populates="gained_rewards")
