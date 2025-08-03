# backend/routers/ai_coach.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
import logging

from models.ai_coach import (
    AICoachMessage,
    AICoachResponse,
    AICoachConversation,
    AICoachConversationList
)
from services.ai_coach_service import AICoachService
from dependencies.auth import get_current_user

logger = logging.getLogger(__name__)

ai_coach_router = APIRouter()

@ai_coach_router.post("/chat", response_model=AICoachResponse)
async def chat_with_ai(
    message: AICoachMessage,
    current_user = Depends(get_current_user),
    ai_service: AICoachService = Depends()
):
    """Chat with AI financial coach"""
    try:
        response = await ai_service.chat_with_user(
            user_id=current_user.id,
            message=message.message,
            context=message.context
        )
        return response
    except Exception as e:
        logger.error(f"AI chat error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get AI response"
        )

@ai_coach_router.get("/conversations", response_model=AICoachConversationList)
async def get_conversations(
    current_user = Depends(get_current_user),
    ai_service: AICoachService = Depends(),
    limit: int = 10,
    offset: int = 0
):
    """Get user's AI conversation history"""
    try:
        conversations = await ai_service.get_user_conversations(
            user_id=current_user.id,
            limit=limit,
            offset=offset
        )
        return conversations
    except Exception as e:
        logger.error(f"Get conversations error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get conversations"
        )

@ai_coach_router.get("/conversations/{conversation_id}", response_model=AICoachConversation)
async def get_conversation(
    conversation_id: str,
    current_user = Depends(get_current_user),
    ai_service: AICoachService = Depends()
):
    """Get specific conversation"""
    try:
        conversation = await ai_service.get_conversation(
            conversation_id=conversation_id,
            user_id=current_user.id
        )
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        return conversation
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get conversation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get conversation"
        )

@ai_coach_router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    current_user = Depends(get_current_user),
    ai_service: AICoachService = Depends()
):
    """Delete a conversation"""
    try:
        success = await ai_service.delete_conversation(
            conversation_id=conversation_id,
            user_id=current_user.id
        )
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        return {"message": "Conversation deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete conversation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete conversation"
        )

@ai_coach_router.post("/analyze-spending")
async def analyze_spending(
    current_user = Depends(get_current_user),
    ai_service: AICoachService = Depends()
):
    """Get AI analysis of user's spending patterns"""
    try:
        analysis = await ai_service.analyze_user_spending(current_user.id)
        return analysis
    except Exception as e:
        logger.error(f"Spending analysis error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze spending"
        )

@ai_coach_router.post("/budget-recommendations")
async def get_budget_recommendations(
    current_user = Depends(get_current_user),
    ai_service: AICoachService = Depends()
):
    """Get AI-powered budget recommendations"""
    try:
        recommendations = await ai_service.get_budget_recommendations(current_user.id)
        return recommendations
    except Exception as e:
        logger.error(f"Budget recommendations error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get budget recommendations"
        ) 