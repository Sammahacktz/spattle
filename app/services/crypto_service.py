import os
from cryptography.fernet import Fernet

# Get encryption key from environment variable
FERNET_KEY = os.environ.get("STRAVA_ENCRYPTION_KEY")
if not FERNET_KEY:
    raise RuntimeError("STRAVA_ENCRYPTION_KEY env variable not set!")
fernet = Fernet(FERNET_KEY.encode())


def encrypt_token(token: str) -> str:
    return fernet.encrypt(token.encode()).decode()


def decrypt_token(token: str) -> str:
    return fernet.decrypt(token.encode()).decode()
