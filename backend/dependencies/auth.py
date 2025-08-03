# backend/dependencies/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from config import settings
from exceptions import AuthenticationError

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Dependency to get current authenticated user"""
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm]
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise AuthenticationError()
        return {"id": user_id, "email": payload.get("email")}
    except JWTError:
        raise AuthenticationError() 