# backend/middleware/rate_limit.py
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict
from datetime import datetime, timedelta
import asyncio
from typing import Dict, List

class RateLimiter(BaseHTTPMiddleware):
    """Rate limiting middleware to prevent API abuse"""
    
    def __init__(self, app, requests_per_minute: int = 60):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, List[datetime]] = defaultdict(list)
        self._lock = asyncio.Lock()
    
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for health check and docs
        if request.url.path in ["/health", "/docs", "/openapi.json", "/"]:
            return await call_next(request)
        
        # Get client identifier (IP address or user ID if authenticated)
        client_id = self._get_client_id(request)
        
        # Check rate limit
        if not await self._check_rate_limit(client_id):
            return JSONResponse(
                status_code=429,
                content={
                    "error": True,
                    "message": "Rate limit exceeded",
                    "detail": f"Maximum {self.requests_per_minute} requests per minute allowed"
                },
                headers={
                    "X-RateLimit-Limit": str(self.requests_per_minute),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int((datetime.now() + timedelta(minutes=1)).timestamp()))
                }
            )
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers
        remaining = await self._get_remaining_requests(client_id)
        response.headers["X-RateLimit-Limit"] = str(self.requests_per_minute)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        
        return response
    
    def _get_client_id(self, request: Request) -> str:
        """Get client identifier from request"""
        # Try to get user ID from JWT token if authenticated
        if hasattr(request.state, "user_id"):
            return f"user:{request.state.user_id}"
        
        # Fall back to IP address
        client_ip = request.client.host if request.client else "unknown"
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0].strip()
        
        return f"ip:{client_ip}"
    
    async def _check_rate_limit(self, client_id: str) -> bool:
        """Check if client has exceeded rate limit"""
        async with self._lock:
            now = datetime.now()
            minute_ago = now - timedelta(minutes=1)
            
            # Clean old requests
            self.requests[client_id] = [
                req_time for req_time in self.requests[client_id]
                if req_time > minute_ago
            ]
            
            # Check limit
            if len(self.requests[client_id]) >= self.requests_per_minute:
                return False
            
            # Record request
            self.requests[client_id].append(now)
            return True
    
    async def _get_remaining_requests(self, client_id: str) -> int:
        """Get remaining requests for client"""
        async with self._lock:
            now = datetime.now()
            minute_ago = now - timedelta(minutes=1)
            
            # Count recent requests
            recent_requests = [
                req_time for req_time in self.requests[client_id]
                if req_time > minute_ago
            ]
            
            return max(0, self.requests_per_minute - len(recent_requests)) 