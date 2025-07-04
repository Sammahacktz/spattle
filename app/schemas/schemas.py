from typing import Optional, List
from pydantic import BaseModel, EmailStr, field_validator, model_validator
from datetime import datetime

from app.schemas.validators import parse_comma_string


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
    strava_access_token: bool = False
    strava_refresh_token: bool = False

    @field_validator("strava_access_token", "strava_refresh_token", mode="before")
    def set_strava_token_bools(cls, value: str | None) -> bool:
        return bool(value)


class UserCreate(UserBase):
    password: str


class UserSummary(UserBase):
    id: int
    distance_overall: float
    created_at: datetime

    class Config:
        from_attributes = True


# BattleParty schemas
class BattlePartyBase(BaseModel):
    battle_id: int
    user_id: int


class BattleParty(BattlePartyBase):
    id: int
    joined_at: datetime
    user: Optional[UserSummary] = None

    class Config:
        from_attributes = True


# Battle schemas
class BattleBase(BaseModel):
    title: str
    description: Optional[str] = None


class BattleCreate(BattleBase):
    creator_id: int


class BattleSummary(BattleBase):
    id: int
    partycode: str
    created_at: datetime
    updated_at: datetime
    is_active: bool

    class Config:
        from_attributes = True


class Battle(BattleBase):
    id: int
    title: str
    partycode: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    creator_id: int
    creator: Optional[UserSummary] = None
    party: list[BattleParty] = []
    challenges: list["ChallengeSummary"] = []
    is_active: bool

    class Config:
        from_attributes = True


# Challenge schemas
class ChallengeBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    value: float
    max_value: Optional[float] = None
    partycode: str | None = None
    creator_id: int
    assigned_user_id: int
    start_datetime: datetime
    end_datetime: datetime


class ChallengeCreate(ChallengeBase):
    rewards: list["RewardCreate"]


class ChallengeSummary(ChallengeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class Challenge(ChallengeBase):
    id: int
    created_at: datetime
    battle: Optional[BattleSummary] = None
    creator: Optional[UserSummary] = None
    assigned_user: Optional[UserSummary] = None
    rewards: list["RewardSummary"] = []
    activity_ids: list[int] = []

    @field_validator("activity_ids", mode="before")
    def validate_comma_string(cls, v: str | None) -> list[int]:
        """validates comma seperated strings to list of int"""
        return parse_comma_string(v)

    class Config:
        from_attributes = True


# Reward schemas
class RewardBase(BaseModel):
    title: str
    description: Optional[str] = None
    target: Optional[float] = None
    challenge_id: int


class RewardCreate(RewardBase):
    pass


class RewardSummary(RewardBase):
    id: int

    class Config:
        from_attributes = True


class Reward(RewardBase):
    id: int
    challenge: Optional[ChallengeSummary] = None
    user: Optional[UserSummary] = None

    class Config:
        from_attributes = True


class StravaModel(BaseModel):
    id: int
    name: str
    distance: float  # in meters
    moving_time: int  # in seconds
    elapsed_time: int  # in seconds
    type: str
    start_date: datetime
    average_speed: Optional[float] = None  # m/s
    max_speed: Optional[float] = None  # m/s
    total_elevation_gain: Optional[float] = None  # meters
    map: Optional[dict] = None
    external_id: Optional[str] = None
    upload_id: Optional[int] = None
    kudos_count: Optional[int] = None
    average_heartrate: Optional[float] = None
    max_heartrate: Optional[float] = None
    calories: Optional[float] = None

    class Config:
        from_attributes = True
