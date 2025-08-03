# backend/models/__init__.py
from .transaction import *
from .ai_coach import *

__all__ = [
    # Transaction models
    "TransactionType",
    "TransactionCategory", 
    "TransactionBase",
    "TransactionCreate",
    "TransactionUpdate",
    "TransactionResponse",
    "TransactionListResponse",
    "TransactionSummary",
    
    # AI Coach models
    "MessageRole",
    "AICoachMessage",
    "AICoachResponse",
    "AICoachMessageModel",
    "AICoachConversation",
    "AICoachConversationList",
    "SpendingAnalysis",
    "BudgetRecommendation",
    "BudgetRecommendations"
] 