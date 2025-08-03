#!/usr/bin/env python3
"""Simple FastAPI application for testing"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Set environment variables
os.environ['OPENAI_API_KEY'] = 'your-openai-api-key-here'

app = FastAPI(
    title="AI Finance Manager",
    version="1.0.0",
    debug=True
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
        
        client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
        
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
        reload=True,
        log_level="info"
    ) 