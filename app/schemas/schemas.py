from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime


# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# UserReward schemas
class UserRewardBase(BaseModel):
    user_id: int
    battle_id: int
    reward_id: int
    participation_id: int


class UserRewardCreate(UserRewardBase):
    pass


class UserReward(UserRewardBase):
    id: int
    earned_at: datetime

    # Optionally, you can nest reward info here
    class Config:
        from_attributes = True


# BattleReward schemas
class BattleRewardBase(BaseModel):
    distance_required: float
    reward_title: str
    reward_description: Optional[str] = None
    reward_points: int = 0


class BattleRewardCreate(BattleRewardBase):
    battle_id: int


class BattleReward(BattleRewardBase):
    id: int
    battle_id: int

    # Optionally, you can nest battle info here
    class Config:
        from_attributes = True


# BattleParticipation schemas
class BattleParticipationBase(BaseModel):
    distance: float = 0.0


class BattleParticipationCreate(BattleParticipationBase):
    user_id: int
    battle_id: int


class BattleParticipationUpdate(BaseModel):
    distance: Optional[float] = None
    completed_at: Optional[datetime] = None


class BattleParticipation(BattleParticipationBase):
    id: int
    user_id: int
    battle_id: int
    joined_at: datetime
    completed_at: Optional[datetime] = None
    # Optionally, you can nest user and battle info here
    earned_rewards: List[UserReward] = []

    class Config:
        from_attributes = True


# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class User(BaseModel):
    id: int
    username: str
    email: EmailStr
    distance_overall: float
    created_at: datetime
    battles_created: list["Battle"] = []
    participations: list["BattleParty"] = []
    gained_rewards: list["Reward"] = []

    class Config:
        from_attributes = True


# BattleParty schemas
class BattlePartyBase(BaseModel):
    battle_id: int
    user_id: int


class BattleParty(BattlePartyBase):
    id: int
    joined_at: datetime
    user: Optional[User] = None

    class Config:
        from_attributes = True


# Battle schemas
class BattleBase(BaseModel):
    title: str
    description: Optional[str] = None


class BattleCreate(BattleBase):
    creator_id: int


class Battle(BaseModel):
    id: int
    title: str
    partycode: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    creator_id: int
    party: list["BattleParty"] = []
    challenges: list["Challenge"] = []
    is_active: bool

    class Config:
        from_attributes = True
        orm_mode = True


# Challenge schemas
class ChallengeBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    value: float
    max_value: Optional[float] = None
    battle_id: int
    creator_id: int
    assigned_user_id: int


class ChallengeCreate(ChallengeBase):
    pass


class Challenge(ChallengeBase):
    id: int
    created_at: datetime
    battle: Optional[Battle] = None
    creator: Optional[User] = None
    assigned_user: Optional[User] = None
    rewards: list["Reward"] = []

    class Config:
        from_attributes = True


# Reward schemas
class RewardBase(BaseModel):
    title: str
    description: Optional[str] = None
    target: Optional[float] = None
    challenge_id: int
    user_id: Optional[int] = None


class RewardCreate(RewardBase):
    pass


class Reward(RewardBase):
    id: int
    challenge: Optional[Challenge] = None
    user: Optional[User] = None

    class Config:
        from_attributes = True
