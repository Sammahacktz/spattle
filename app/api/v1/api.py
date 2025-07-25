from fastapi import APIRouter
from app.api.v1.endpoints import users, battles, auth, strava

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(battles.router, prefix="/battles", tags=["battles"])
api_router.include_router(strava.router, prefix="/strava", tags=["strava"])
