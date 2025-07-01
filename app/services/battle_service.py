from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.models import Battle, BattleParty, Challenge, Reward, User
from app.schemas.schemas import (
    BattleCreate,
    ChallengeBase,
    RewardBase,
    Battle as SchemaBattle,
)


def update_value_for_all_challenges_on_user(
    db: Session, user_id: int, distance: float
) -> bool:
    """
    Add the given distance to the value of all challenges assigned to the user.
    """
    challenges = db.query(Challenge).filter(Challenge.assigned_user_id == user_id).all()
    if not challenges:
        return True
    for challenge in challenges:
        challenge.value = (challenge.value or 0) + distance
        db.add(challenge)
    db.commit()
    return True


def get_battle_with_partycode(db: Session, partycode) -> Battle:
    battle = db.query(Battle).filter(Battle.partycode == partycode).first()
    if not battle:
        raise Exception("No Battle found")
    return battle


def get_all_challenges_for_battle(db: Session, partycode: str) -> list[Challenge]:
    battle = get_battle_with_partycode(db, partycode)
    if not battle:
        return []
    return db.query(Challenge).filter(Challenge.battle_id == battle.id).all()


def get_challenge(db: Session, challenge_id: int) -> Challenge:
    return db.query(Challenge).filter(Challenge.id == challenge_id).first()


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


def add_user_to_battle(db: Session, partycode: int, user_id: int) -> Battle:
    battle = get_battle_with_partycode(db, partycode)
    party = BattleParty(battle_id=battle.id, user_id=user_id)
    db.add(party)
    db.commit()
    db.refresh(party)
    return battle


def create_challenge(db: Session, challenge: ChallengeBase) -> Challenge:
    battle = get_battle_with_partycode(db, challenge.partycode)

    if not battle:
        raise ValueError("Battle with the given partycode does not exist.")
    data = challenge.model_dump(exclude={"partycode", "rewards"}) | {
        "battle_id": battle.id
    }
    db_challenge = Challenge(**data)
    db.add(db_challenge)
    db.commit()
    db.refresh(db_challenge)
    return db_challenge


def create_reward(db: Session, reward: RewardBase, challenge_id: int) -> Reward:
    db_reward = Reward(**reward.model_dump() | {"challenge_id": challenge_id})
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


def get_battle_members(db: Session, partycode: str) -> list[User]:
    # Get users who are members via BattleParty
    battle = get_battle_with_partycode(db, partycode)
    if not battle:
        return []
    # Get all users in the party (BattleParty)
    party_members = (
        db.query(BattleParty).filter(BattleParty.battle_id == battle.id).all()
    )
    users = [pm.user for pm in party_members if pm.user is not None]
    # Also include the creator if not already in the party
    if battle.creator and all(u.id != battle.creator.id for u in users):
        users.append(battle.creator)
    return users
