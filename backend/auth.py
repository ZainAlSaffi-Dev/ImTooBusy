import os
from dotenv import load_dotenv # NEW IMPORT
from datetime import datetime, timedelta
from jose import jwt, JWTError

# 1. LOAD SECRETS
load_dotenv() 

# 2. GET VARIABLES (With a default fallback just in case)
SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_for_dev_only") 
ALGORITHM = os.getenv("ALGORITHM", "HS256")

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "fallback_password_if_env_fails")

def verify_admin_password(plain_password: str):
    """Checks if the provided password matches the hidden ENV password."""
    # simple string comparison (sufficient for MVP)
    return plain_password == ADMIN_PASSWORD

def create_friend_token():
    """Generates a token that expires at 11:59 PM tonight."""
    now = datetime.now()
    expiration = now.replace(hour=23, minute=59, second=59, microsecond=0)
    
    to_encode = {
        "sub": "friend_access",
        "exp": expiration,
        "type": "vip"
    }
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_friend_token(token: str):
    """Returns True if token is valid and not expired."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") == "vip":
            return True
        return False
    except JWTError:
        return False