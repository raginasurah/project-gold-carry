# backend/middleware/auth.py
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from jose import JWTError, jwt
from config import settings
import logging

logger = logging.getLogger(__name__)

class AuthMiddleware(BaseHTTPMiddleware):
    """Authentication middleware to extract user info from JWT tokens"""
    
    async def dispatch(self, request: Request, call_next):
        # Skip auth for public endpoints
        if request.url.path in ["/health", "/docs", "/openapi.json", "/", "/api/auth/login", "/api/auth/register"]:
            return await call_next(request)
        
        # Extract token from Authorization header
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            
            try:
                # Decode JWT token
                payload = jwt.decode(
                    token,
                    settings.jwt_secret_key,
                    algorithms=[settings.jwt_algorithm]
                )
                
                # Add user info to request state
                request.state.user_id = payload.get("sub")
                request.state.user_email = payload.get("email")
                
            except JWTError as e:
                logger.warning(f"Invalid JWT token: {e}")
                # Continue without user info - let individual endpoints handle auth
        
        return await call_next(request) 