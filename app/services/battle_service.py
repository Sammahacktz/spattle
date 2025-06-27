from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.models import Battle
from app.schemas.schemas import BattleCreate, BattleUpdate


def get_battle(db: Session, battle_id: int) -> Optional[Battle]:
    return db.query(Battle).filter(Battle.id == battle_id).first()


def get_battles(db: Session, skip: int = 0, limit: int = 100) -> List[Battle]:
    return (
        db.query(Battle)
        .filter(Battle.is_active == True)
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_battle(db: Session, battle: BattleCreate) -> Battle:
    db_battle = Battle(**battle.dict())
    db.add(db_battle)
    db.commit()
    db.refresh(db_battle)
    return db_battle


def update_battle(
    db: Session, battle_id: int, battle: BattleUpdate
) -> Optional[Battle]:
    db_battle = get_battle(db, battle_id)
    if not db_battle:
        return None

    update_data = battle.dict(exclude_unset=True)
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
