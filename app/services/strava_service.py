from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.models import Challenge
from app.schemas.validators import parse_comma_string
from app.services.user_service import get_user
from app.services.crypto_service import encrypt_token, decrypt_token
from app.schemas.schemas import StravaModel
import os
import httpx
from datetime import datetime


CLIENT_ID = os.environ.get("STRAVA_CLIENT_ID")
CLIENT_SECRET = os.environ.get("STRAVA_CLIENT_SECRET")
REDIRECT_URI = os.environ.get("STRAVA_REDIRECT_URI")
SCOPES = "read,activity:read_all"


def sync_activities(db: Session, user_id: int, strava_models: list[StravaModel]):
    """syncs activities, only adds activities within challenge date range"""

    def activity_in_timeframe(challenge: Challenge, activity: StravaModel):
        # Make all datetimes timezone naive
        def to_naive(dt):
            if (
                dt is not None
                and hasattr(dt, "replace")
                and getattr(dt, "tzinfo", None)
            ):
                return dt.replace(tzinfo=None)
            return dt

        challenge_start = to_naive(challenge.start_datetime)
        challenge_end = to_naive(challenge.end_datetime)
        activity_start = to_naive(activity.start_date)

        if challenge_start <= activity_start <= challenge_end:
            return True
        return False

    challenges = db.query(Challenge).filter(Challenge.assigned_user_id == user_id).all()
    for challenge in challenges:
        activity_ids = parse_comma_string(challenge.activity_ids)
        for activity in strava_models:
            if (
                activity_in_timeframe(challenge, activity)
                and activity.id not in activity_ids
            ):
                activity_ids.append(activity.id)
                distance_in_km = (activity.distance / 1000) + challenge.value
                challenge.value = (
                    distance_in_km
                    if distance_in_km <= challenge.max_value
                    else challenge.max_value
                )
        challenge.activity_ids = ",".join([str(a) for a in activity_ids])
    db.commit()


def exchange_code_for_tokens(db: Session, user_id: int, code: str):
    response = httpx.post(
        "https://www.strava.com/api/v3/oauth/token",
        data={
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": REDIRECT_URI,
        },
    )
    if response.status_code == 200:
        tokens = response.json()
        access_token = tokens["access_token"]
        refresh_token = tokens["refresh_token"]
        user = get_user(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user.strava_access_token = encrypt_token(access_token)
        user.strava_refresh_token = encrypt_token(refresh_token)
        db.commit()
        return True
    else:
        raise HTTPException(
            status_code=400, detail="Failed to exchange code for tokens."
        )


def refresh_access_token(db: Session, user_id: int):
    user = get_user(db, user_id)
    if not user or not user.strava_refresh_token:
        raise HTTPException(status_code=404, detail="No Strava refresh token found.")
    refresh_token = decrypt_token(user.strava_refresh_token)
    response = httpx.post(
        "https://www.strava.com/api/v3/oauth/token",
        data={
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
        },
    )
    if response.status_code == 200:
        tokens = response.json()
        access_token = tokens["access_token"]
        refresh_token = tokens["refresh_token"]
        user.strava_access_token = encrypt_token(access_token)
        user.strava_refresh_token = encrypt_token(refresh_token)
        db.commit()
        return access_token
    else:
        raise HTTPException(
            status_code=400, detail="Failed to refresh Strava access token."
        )


def get_strava_profile(db: Session, user_id: int):
    user = get_user(db, user_id)
    if not user or not user.strava_access_token:
        raise HTTPException(status_code=404, detail="No Strava account linked.")
    access_token = decrypt_token(user.strava_access_token)
    url = "https://www.strava.com/api/v3/athlete"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = httpx.get(url, headers=headers)
    if response.status_code == 401:
        # Token expired, refresh and retry
        access_token = refresh_access_token(db, user_id)
        headers = {"Authorization": f"Bearer {access_token}"}
        response = httpx.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(status_code=400, detail="Failed to fetch Strava profile.")
