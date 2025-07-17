import os
import json
import time
from fastapi import HTTPException, APIRouter, Depends, Request
from fastapi.responses import RedirectResponse
import httpx
from sqlalchemy.orm import Session
import urllib.parse
from app.schemas.schemas import StravaModel
from app.services.crypto_service import decrypt_token, encrypt_token
from app.services.strava_service import (
    exchange_code_for_tokens,
    get_challenge_assigne,
    refresh_access_token,
    sync_activities,
)
from app.db.database import get_db
from app.services.auth_service import get_current_user
from app.models.models import User

router = APIRouter()

CLIENT_ID = os.environ.get("STRAVA_CLIENT_ID")
CLIENT_SECRET = os.environ.get("STRAVA_CLIENT_SECRET")
REDIRECT_URI = os.environ.get("STRAVA_REDIRECT_URI")
SCOPES = "read,activity:read_all"
APP_URI = os.environ.get("REACT_APP_API_URL")


@router.get("/callback")
def strava_callback(
    request: Request,
    code: str,
    state: str,
    db: Session = Depends(get_db),
):
    # Decrypt and validate state (user_id + timestamp)
    try:
        payload = json.loads(decrypt_token(state))
        user_id = payload.get("user_id")
        ts = payload.get("ts")
        now = int(time.time())

        if not user_id or not ts:
            raise ValueError("Invalid state payload")
        if abs(now - int(ts)) > 60:
            raise HTTPException(
                status_code=400, detail="OAuth state expired. Please try again."
            )
    except Exception:
        raise HTTPException(
            status_code=400, detail="Invalid or expired state parameter."
        )
    try:
        exchange_code_for_tokens(db, int(user_id), code)
        return RedirectResponse(url=f"{APP_URI}/battles#strava-success")

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/auth-url")
def build_auth_url(request: Request, user: User = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=400, detail="User ID required")
    # Add timestamp to state for replay protection
    state_payload = json.dumps({"user_id": user.id, "ts": int(time.time())})
    state = encrypt_token(state_payload)
    return {
        "link": (
            f"https://www.strava.com/oauth/authorize"
            f"?client_id={CLIENT_ID}"
            f"&response_type=code"
            f"&redirect_uri={urllib.parse.quote(REDIRECT_URI)}"
            f"&scope={SCOPES}"
            f"&approval_prompt=auto"
            f"&state={state}"
        )
    }


@router.get("/run/last/{username}", response_model=list[StravaModel])
def get_last_strava_run(
    username: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not user:
        raise HTTPException(status_code=400, detail="User ID required")

    challenge_assignee = get_challenge_assigne(db, username, user)

    if not challenge_assignee:
        raise HTTPException(status_code=403, detail="Invalid Request")

    access_token = decrypt_token(challenge_assignee.strava_access_token)
    url = "https://www.strava.com/api/v3/athlete/activities"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = httpx.get(url, headers=headers)
    if response.status_code == 401:
        # Token expired, refresh and retry
        access_token = refresh_access_token(db, challenge_assignee.id)
        headers = {"Authorization": f"Bearer {access_token}"}
        response = httpx.get(url, headers=headers)
    if response.status_code == 200:
        test = response.json()
        if test:
            sync_activities(
                db, challenge_assignee.id, [StravaModel.model_validate(a) for a in test]
            )
        return test
    else:
        raise HTTPException(
            status_code=400, detail="Failed to fetch Strava activities."
        )
