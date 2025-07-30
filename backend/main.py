from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import httpx
import os
from datetime import datetime, timedelta
import json
import uuid

app = FastAPI(title="AI Finance API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "https://*.vercel.app", 
        "https://*.onrender.com",
        "https://project-gold-carry-izdy-ks2uwwirl-raginasurahs-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Pydantic models
class UserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    created_at: datetime

class BudgetCreate(BaseModel):
    name: str
    amount: float
    category: str
    budget_type: str  # 50/30/20, Zero-based, 70/20/10, 60%

class TransactionCreate(BaseModel):
    amount: float
    description: str
    category: str
    date: datetime

class AIChatMessage(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class SubscriptionCreate(BaseModel):
    name: str
    amount: float
    billing_cycle: str
    category: str

class GoalCreate(BaseModel):
    name: str
    target_amount: float
    current_amount: float
    target_date: datetime
    category: str

# Mock database (replace with Supabase)
users_db = {}
budgets_db = {}
transactions_db = {}
subscriptions_db = {}
goals_db = {}

@app.get("/")
async def root():
    return {"message": "AI Finance API is running"}

@app.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate):
    user_id = str(uuid.uuid4())
    users_db[user_id] = {
        "id": user_id,
        "email": user.email,
        "password": user.password,  # In production, hash this
        "first_name": user.first_name,
        "last_name": user.last_name,
        "created_at": datetime.now()
    }
    return users_db[user_id]

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/auth/login")
async def login(login_data: LoginRequest):
    for user in users_db.values():
        if user["email"] == login_data.email and user["password"] == login_data.password:
            return {"access_token": f"mock_token_{user['id']}", "user": user}
    raise HTTPException(status_code=401, detail="Invalid credentials")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user_id = token.replace("mock_token_", "")
    if user_id not in users_db:
        raise HTTPException(status_code=401, detail="Invalid token")
    return users_db[user_id]

@app.get("/user/profile", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return current_user

@app.post("/budgets", response_model=BudgetCreate)
async def create_budget(budget: BudgetCreate, current_user: dict = Depends(get_current_user)):
    budget_id = str(uuid.uuid4())
    budgets_db[budget_id] = {
        "id": budget_id,
        "user_id": current_user["id"],
        **budget.dict(),
        "created_at": datetime.now()
    }
    return budgets_db[budget_id]

@app.get("/budgets")
async def get_budgets(current_user: dict = Depends(get_current_user)):
    user_budgets = [b for b in budgets_db.values() if b["user_id"] == current_user["id"]]
    return user_budgets

@app.post("/transactions")
async def create_transaction(transaction: TransactionCreate, current_user: dict = Depends(get_current_user)):
    transaction_id = str(uuid.uuid4())
    transactions_db[transaction_id] = {
        "id": transaction_id,
        "user_id": current_user["id"],
        **transaction.dict(),
        "created_at": datetime.now()
    }
    return transactions_db[transaction_id]

@app.get("/transactions")
async def get_transactions(current_user: dict = Depends(get_current_user)):
    user_transactions = [t for t in transactions_db.values() if t["user_id"] == current_user["id"]]
    return user_transactions

@app.post("/ai/chat")
async def ai_chat(message: AIChatMessage, current_user: dict = Depends(get_current_user)):
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    
    # Get user's financial context
    user_transactions = [t for t in transactions_db.values() if t["user_id"] == current_user["id"]]
    user_budgets = [b for b in budgets_db.values() if b["user_id"] == current_user["id"]]
    
    context = {
        "transactions": user_transactions,
        "budgets": user_budgets,
        "user": current_user
    }
    
    # Prepare OpenAI API call
    system_prompt = """You are an AI financial coach. Help users with budgeting, saving, investing, and financial planning. 
    Be encouraging, practical, and provide actionable advice. Use the user's financial data to give personalized recommendations."""
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
            json={
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"User context: {json.dumps(context)}\n\nUser message: {message.message}"}
                ],
                "max_tokens": 500
            }
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="OpenAI API error")
        
        ai_response = response.json()["choices"][0]["message"]["content"]
        return {"response": ai_response}

@app.post("/subscriptions")
async def create_subscription(subscription: SubscriptionCreate, current_user: dict = Depends(get_current_user)):
    subscription_id = str(uuid.uuid4())
    subscriptions_db[subscription_id] = {
        "id": subscription_id,
        "user_id": current_user["id"],
        **subscription.dict(),
        "created_at": datetime.now()
    }
    return subscriptions_db[subscription_id]

@app.get("/subscriptions")
async def get_subscriptions(current_user: dict = Depends(get_current_user)):
    user_subscriptions = [s for s in subscriptions_db.values() if s["user_id"] == current_user["id"]]
    return user_subscriptions

@app.post("/goals")
async def create_goal(goal: GoalCreate, current_user: dict = Depends(get_current_user)):
    goal_id = str(uuid.uuid4())
    goals_db[goal_id] = {
        "id": goal_id,
        "user_id": current_user["id"],
        **goal.dict(),
        "created_at": datetime.now()
    }
    return goals_db[goal_id]

@app.get("/goals")
async def get_goals(current_user: dict = Depends(get_current_user)):
    user_goals = [g for g in goals_db.values() if g["user_id"] == current_user["id"]]
    return user_goals

@app.get("/analytics/spending")
async def get_spending_analytics(current_user: dict = Depends(get_current_user)):
    user_transactions = [t for t in transactions_db.values() if t["user_id"] == current_user["id"]]
    
    # Calculate spending by category
    category_spending = {}
    for transaction in user_transactions:
        category = transaction["category"]
        if category not in category_spending:
            category_spending[category] = 0
        category_spending[category] += transaction["amount"]
    
    return {
        "category_spending": category_spending,
        "total_spending": sum(t["amount"] for t in user_transactions),
        "transaction_count": len(user_transactions)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)