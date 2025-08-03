# backend/models/ai_coach.py
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class AICoachMessage(BaseModel):
    message: str = Field(..., description="User's message to AI coach")
    context: Optional[Dict[str, Any]] = Field(None, description="Additional context for the AI")
    conversation_id: Optional[str] = Field(None, description="Conversation ID for continuing chat")

class AICoachResponse(BaseModel):
    message: str = Field(..., description="AI coach's response")
    conversation_id: str = Field(..., description="Conversation ID")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    suggestions: Optional[List[str]] = Field(None, description="Suggested follow-up questions")
    analysis: Optional[Dict[str, Any]] = Field(None, description="Financial analysis insights")

class AICoachMessageModel(BaseModel):
    id: str
    conversation_id: str
    role: MessageRole
    content: str
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None

class AICoachConversation(BaseModel):
    id: str
    user_id: str
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[AICoachMessageModel]
    summary: Optional[str] = None
    tags: Optional[List[str]] = None

class AICoachConversationList(BaseModel):
    conversations: List[AICoachConversation]
    total: int
    limit: int
    offset: int

class SpendingAnalysis(BaseModel):
    total_spending: float
    spending_by_category: Dict[str, float]
    spending_trends: Dict[str, Any]
    insights: List[str]
    recommendations: List[str]
    period: str

class BudgetRecommendation(BaseModel):
    category: str
    current_amount: float
    recommended_amount: float
    reasoning: str
    priority: str  # "high", "medium", "low"
    potential_savings: float

class BudgetRecommendations(BaseModel):
    recommendations: List[BudgetRecommendation]
    total_potential_savings: float
    overall_advice: str
    generated_at: datetime = Field(default_factory=datetime.utcnow) 