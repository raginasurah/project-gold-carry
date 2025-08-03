# backend/config.py
import os
from typing import Optional, List
from pydantic_settings import BaseSettings
from pydantic import validator

class Settings(BaseSettings):
    """Application settings with validation"""
    
    # API Keys
    openai_api_key: str
    supabase_url: Optional[str] = None
    supabase_key: Optional[str] = None
    
    # CORS Settings
    cors_origins: List[str] = ["http://localhost:3000"]
    
    # App Settings
    debug: bool = False
    app_name: str = "AI Finance Manager"
    app_version: str = "1.0.0"
    
    # Rate Limiting
    rate_limit_requests: int = 60
    rate_limit_period: int = 60  # seconds
    
    # JWT Settings
    jwt_secret_key: str = "your-secret-key-here"  # Change in production
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    @validator('openai_api_key')
    def validate_openai_key(cls, v):
        if not v.startswith("sk-"):
            raise ValueError("Invalid OpenAI API key format")
        return v
    
    @validator('supabase_url')
    def validate_supabase_url(cls, v):
        if v is None:
            return v
        if not v.startswith("https://"):
            raise ValueError("Supabase URL must use HTTPS")
        if not v.endswith(".supabase.co"):
            raise ValueError("Invalid Supabase URL format")
        return v
    
    @validator('cors_origins', pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',')]
        return v

# Create settings instance
settings = Settings()

# Validate settings on startup
try:
    # Basic validation
    if not settings.openai_api_key:
        raise ValueError("OpenAI API key is required")
    # Supabase is optional for now
    if settings.supabase_url and not settings.supabase_key:
        print("Warning: Supabase URL provided but no key")
    if settings.supabase_key and not settings.supabase_url:
        print("Warning: Supabase key provided but no URL")
except Exception as e:
    print(f"Configuration error: {e}")
    raise 