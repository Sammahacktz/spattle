from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import User
from app.schemas.schemas import (
    Battle,
    BattleCreate,
    BattleParty,
    Challenge,
    ChallengeCreate,
    Reward,
    RewardCreate,
    UserSummary,
)
from app.services.battle_service import (
    create_battle,
    get_all_challenges_for_battle,
    get_battle,
    get_battles_for_user,
    add_user_to_battle,
    create_challenge,
    create_reward,
    delete_battle,
    get_battles_where_user_is_member,
    get_battle_members,
    get_challenge,
)
from app.services.auth_service import get_current_user

router = APIRouter()


@router.post("/", response_model=Battle, status_code=status.HTTP_201_CREATED)
def create_battle_endpoint(battle: BattleCreate, db: Session = Depends(get_db)):
    return create_battle(db=db, battle=battle)


@router.get("/{battle_id}/members/", response_model=List[UserSummary])
def list_battle_members(
    battle_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    return get_battle_members(db, battle_id)


@router.get("/user/{user_id}", response_model=List[Battle])
def list_battles_endpoint(
    user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    params = {"db": db, "user_id": user_id, "skip": skip, "limit": limit}
    return [
        *get_battles_for_user(**params),
        *get_battles_where_user_is_member(**params),
    ]


@router.get("/{battle_id}", response_model=Battle)
def read_battle(battle_id: int, db: Session = Depends(get_db)):
    db_battle = get_battle(db, battle_id=battle_id)
    if db_battle is None:
        raise HTTPException(status_code=404, detail="Battle not found")
    return db_battle


@router.post("/join/{partycode}", response_model=Battle)
def join_battle(
    partycode: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return add_user_to_battle(db, partycode, user.id)


@router.post("/challenge/create", response_model=Challenge)
def create_challenge_endpoint(
    challenge: ChallengeCreate, db: Session = Depends(get_db)
):
    # battle_id is required in challenge
    # TODO combine creation process
    empty_challenge = create_challenge(db, challenge)
    for reward in challenge.rewards:
        create_reward(db, reward, empty_challenge.id)
    return get_challenge(db, empty_challenge.id)


@router.get("/{partycode}/challenges/", response_model=list[Challenge])
def create_challenge_endpoint(partycode: str, db: Session = Depends(get_db)):
    return get_all_challenges_for_battle(db, partycode)


# @router.post("/challenge/{challenge_id}/reward", response_model=Reward)
# def create_reward_endpoint(
#     challenge_id: int, reward: RewardCreate, db: Session = Depends(get_db)
# ):
#     # challenge_id is required in reward
#     return create_reward(db, reward)


# @router.delete("/{battle_id}")
# def delete_battle_endpoint(battle_id: int, db: Session = Depends(get_db)):
#     success = delete_battle(db=db, battle_id=battle_id)
#     if not success:
#         raise HTTPException(status_code=404, detail="Battle not found")
#     return {"message": "Battle deleted successfully"}
