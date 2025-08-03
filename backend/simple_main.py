#!/usr/bin/env python3
"""Simple FastAPI application for Railway deployment"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="AI Finance Manager",
    version="1.0.0",
    debug=False
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://project-gold-carry-izdy.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.post("/api/ai/chat")
async def chat_with_ai(message: dict):
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
                {"role": "user", "content": message.get("message", "Hello")}
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