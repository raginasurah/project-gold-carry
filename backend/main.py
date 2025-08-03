# backend/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

from config import settings
from middleware.rate_limit import RateLimiter
from middleware.auth import AuthMiddleware
from exceptions import (
    http_exception_handler,
    validation_exception_handler,
    general_exception_handler
)
from routers import transactions_router
from routers.ai_coach import ai_coach_router

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.debug else logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events"""
    # Startup
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    logger.info("Validating configuration...")
    
    # Add any startup tasks here (e.g., database connections, cache setup)
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")
    # Add any cleanup tasks here

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
    debug=settings.debug
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add rate limiting middleware
app.add_middleware(
    RateLimiter,
    requests_per_minute=settings.rate_limit_requests
)

# Add authentication middleware
app.add_middleware(AuthMiddleware)

# Register exception handlers
app.add_exception_handler(404, http_exception_handler)
app.add_exception_handler(422, validation_exception_handler)
app.add_exception_handler(500, general_exception_handler)

# Include routers
app.include_router(transactions_router, prefix="/api/transactions", tags=["Transactions"])
app.include_router(ai_coach_router, prefix="/api/ai", tags=["AI Coach"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": f"Welcome to {settings.app_name}",
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info" if not settings.debug else "debug"
    )