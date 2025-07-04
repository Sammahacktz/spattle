from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import User
from app.schemas.schemas import UserSummary, UserCreate
from app.services.auth_service import get_current_user
from app.services.user_service import (
    create_user,
    get_user,
    get_users,
    update_user,
    delete_user,
)

router = APIRouter()


@router.post("/", response_model=UserSummary, status_code=status.HTTP_201_CREATED)
def create_user_endpoint(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    db_user = create_user(db=db, user=user)
    if not db_user:
        raise HTTPException(
            status_code=400, detail="Email or username already registered"
        )
    return db_user


@router.get("/", response_model=List[UserSummary])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not user:
        raise HTTPException(400, "Login required")
    users = get_users(db, skip=skip, limit=limit)
    return users


# @router.get("/{user_id}", response_model=UserSummary)
# def read_user(user_id: int, db: Session = Depends(get_db)):
#     db_user = get_user(db, user_id=user_id)
#     if db_user is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return db_user


# @router.put("/{user_id}", response_model=UserSummary)
# def update_user_endpoint(
#     user_id: int, user: UserSummary, db: Session = Depends(get_db)
# ):
#     db_user = update_user(db=db, user_id=user_id, user=user)
#     if db_user is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return db_user


# @router.delete("/{user_id}")
# def delete_user_endpoint(user_id: int, db: Session = Depends(get_db)):
#     success = delete_user(db=db, user_id=user_id)
#     if not success:
#         raise HTTPException(status_code=404, detail="User not found")
#     return {"message": "User deleted successfully"}
