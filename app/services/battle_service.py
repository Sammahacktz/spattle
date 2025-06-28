from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.models import Battle, BattleParty, Challenge, Reward, User
from app.schemas.schemas import (
    BattleCreate,
    ChallengeBase,
    RewardBase,
    Battle as SchemaBattle,
)


def get_battle(db: Session, battle_id: int) -> Optional[Battle]:
    return db.query(Battle).filter(Battle.id == battle_id).first()


def get_battles_for_user(
    db: Session, user_id: int, skip: int = 0, limit: int = 100
) -> List[Battle]:
    return (
        db.query(Battle)
        .filter(Battle.creator_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_battles_where_user_is_member(
    db: Session, user_id: int, skip: int = 0, limit: int = 100
) -> List[Battle]:
    return (
        db.query(Battle)
        .join(BattleParty)
        .filter(BattleParty.user_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_battle(db: Session, battle: BattleCreate) -> Battle:
    db_battle = Battle(**battle.model_dump())
    db.add(db_battle)
    db.commit()
    db.refresh(db_battle)
    return db_battle


def add_user_to_battle(db: Session, party_code: int, user_id: int) -> Battle:
    battle = db.query(Battle).filter(Battle.partycode == party_code).first()
    print(battle.title)
    party = BattleParty(battle_id=battle.id, user_id=user_id)
    db.add(party)
    db.commit()
    db.refresh(party)
    return battle


def create_challenge(db: Session, challenge: ChallengeBase) -> Challenge:
    db_challenge = Challenge(**challenge.model_dump())
    db.add(db_challenge)
    db.commit()
    db.refresh(db_challenge)
    return db_challenge


def create_reward(db: Session, reward: RewardBase) -> Reward:
    db_reward = Reward(**reward.model_dump())
    db.add(db_reward)
    db.commit()
    db.refresh(db_reward)
    return db_reward


def update_battle(
    db: Session, battle_id: int, battle: SchemaBattle
) -> Optional[Battle]:
    db_battle = get_battle(db, battle_id)
    if not db_battle:
        return None

    update_data = battle.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_battle, field, value)

    db.commit()
    db.refresh(db_battle)
    return db_battle


def delete_battle(db: Session, battle_id: int) -> bool:
    db_battle = get_battle(db, battle_id)
    if not db_battle:
        return False

    db_battle.is_active = False
    db.commit()
    return True


def get_battle_members(db: Session, battle_id: int) -> list[User]:
    return (
        db.query(User)
        .join(BattleParty, BattleParty.user_id == User.id)
        .filter(BattleParty.battle_id == battle_id)
        .all()
    )
