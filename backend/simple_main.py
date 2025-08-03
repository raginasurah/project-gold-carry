#!/usr/bin/env python3
"""Simple FastAPI application for Railway deployment"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import jwt
from datetime import datetime, timedelta

# Pydantic models for requests
class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str

class ChatRequest(BaseModel):
    message: str

app = FastAPI(
    title="AI Finance Manager",
    version="1.0.0",
    debug=False
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://project-gold-carry-izdy.vercel.app", "https://project-gold-carry-izdy-aua97jo43-raginasurahs-projects.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT settings
JWT_SECRET = os.environ.get('JWT_SECRET_KEY', 'your-super-secret-jwt-key-change-this-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

def create_access_token(data: dict):
    """Create JWT token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Finance Manager API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": "AI Finance Manager",
        "version": "1.0.0"
    }

@app.post("/auth/login")
async def login(request: LoginRequest):
    """Login endpoint"""
    try:
        # Demo authentication - in production, you'd verify against a database
        if request.email == "demo@example.com" and request.password == "demo123":
            # Create user data
            user_data = {
                "id": "demo-user-123",
                "email": request.email,
                "first_name": "Demo",
                "last_name": "User"
            }
            
            # Create access token
            access_token = create_access_token(data={"sub": user_data["email"]})
            
            return {
                "token": access_token,
                "user": user_data,
                "message": "Login successful"
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@app.post("/auth/signup")
async def signup(request: SignupRequest):
    """Signup endpoint"""
    try:
        # Demo signup - in production, you'd save to a database
        user_data = {
            "id": f"user-{datetime.utcnow().timestamp()}",
            "email": request.email,
            "first_name": request.first_name,
            "last_name": request.last_name
        }
        
        # Create access token
        access_token = create_access_token(data={"sub": user_data["email"]})
        
        return {
            "token": access_token,
            "user": user_data,
            "message": "Signup successful"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")

@app.post("/api/ai/chat")
async def chat_with_ai(request: ChatRequest):
    """Simple AI chat endpoint"""
    try:
        from openai import OpenAI
        
        # Get API key from environment
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key or api_key == 'your-openai-api-key-here':
            return {
                "message": "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.",
                "conversation_id": "error",
                "timestamp": "2025-08-03T12:00:00Z"
            }
        
        client = OpenAI(api_key=api_key)
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful financial advisor."},
                {"role": "user", "content": request.message}
            ],
            max_tokens=200,
            temperature=0.7
        )
        
        return {
            "message": response.choices[0].message.content,
            "conversation_id": "test-123",
            "timestamp": "2025-08-03T12:00:00Z"
        }
        
    except Exception as e:
        return {
            "message": f"Error: {str(e)}",
            "conversation_id": "error",
            "timestamp": "2025-08-03T12:00:00Z"
        }

if __name__ == "__main__":
    import uvicorn
    print("Starting AI Finance Manager API...")
    print("OpenAI API Key configured:", bool(os.environ.get('OPENAI_API_KEY')))
    uvicorn.run(
        "simple_main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info"
    ) 