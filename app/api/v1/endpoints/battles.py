from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.schemas import Battle, BattleCreate, BattleUpdate
from app.services.battle_service import (
    create_battle,
    get_battle,
    get_battles,
    update_battle,
    delete_battle,
)

router = APIRouter()


@router.post("/", response_model=Battle, status_code=status.HTTP_201_CREATED)
def create_battle_endpoint(battle: BattleCreate, db: Session = Depends(get_db)):
    return create_battle(db=db, battle=battle)


@router.get("/", response_model=List[Battle])
def read_battles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    battles = get_battles(db, skip=skip, limit=limit)
    return battles


@router.get("/{battle_id}", response_model=Battle)
def read_battle(battle_id: int, db: Session = Depends(get_db)):
    db_battle = get_battle(db, battle_id=battle_id)
    if db_battle is None:
        raise HTTPException(status_code=404, detail="Battle not found")
    return db_battle


@router.put("/{battle_id}", response_model=Battle)
def update_battle_endpoint(
    battle_id: int, battle: BattleUpdate, db: Session = Depends(get_db)
):
    db_battle = update_battle(db=db, battle_id=battle_id, battle=battle)
    if db_battle is None:
        raise HTTPException(status_code=404, detail="Battle not found")
    return db_battle


@router.delete("/{battle_id}")
def delete_battle_endpoint(battle_id: int, db: Session = Depends(get_db)):
    success = delete_battle(db=db, battle_id=battle_id)
    if not success:
        raise HTTPException(status_code=404, detail="Battle not found")
    return {"message": "Battle deleted successfully"}
