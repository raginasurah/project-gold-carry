# backend/services/ai_coach_service.py
import uuid
import logging
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
import openai
from openai import OpenAI

from config import settings
from models.ai_coach import (
    AICoachResponse,
    AICoachConversation,
    AICoachConversationList,
    AICoachMessageModel,
    MessageRole,
    SpendingAnalysis,
    BudgetRecommendation,
    BudgetRecommendations
)

logger = logging.getLogger(__name__)

class AICoachService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.openai_api_key)
        self.system_prompt = """You are an expert financial coach and advisor. Your role is to help users with:
1. Budgeting and financial planning
2. Spending analysis and optimization
3. Debt management and reduction strategies
4. Investment advice and portfolio management
5. Financial goal setting and tracking
6. Emergency fund planning
7. Retirement planning
8. Tax optimization strategies

Always provide practical, actionable advice. Be encouraging but realistic. 
Ask clarifying questions when needed to provide better personalized advice.
Use examples and break down complex financial concepts into simple terms."""

    async def chat_with_user(
        self, 
        user_id: str, 
        message: str, 
        context: Optional[Dict[str, Any]] = None
    ) -> AICoachResponse:
        """Chat with AI financial coach"""
        try:
            # For now, we'll use a simple approach without conversation history
            # In a full implementation, you'd fetch conversation history from database
            
            # Prepare the conversation
            messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": message}
            ]
            
            # Add context if provided
            if context:
                context_message = f"Additional context: {context}"
                messages.insert(1, {"role": "system", "content": context_message})
            
            # Get AI response
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=500,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content
            
            # Generate conversation ID
            conversation_id = str(uuid.uuid4())
            
            # Generate suggestions based on the response
            suggestions = self._generate_suggestions(message, ai_response)
            
            return AICoachResponse(
                message=ai_response,
                conversation_id=conversation_id,
                suggestions=suggestions,
                analysis=self._extract_financial_insights(ai_response)
            )
            
        except Exception as e:
            logger.error(f"AI chat error: {e}")
            # Fallback response
            return AICoachResponse(
                message="I'm experiencing technical difficulties right now. Please try again in a moment, or contact support if the issue persists.",
                conversation_id=str(uuid.uuid4()),
                suggestions=["Try asking about budgeting", "Ask about saving strategies", "Get debt management advice"]
            )

    async def get_user_conversations(
        self, 
        user_id: str, 
        limit: int = 10, 
        offset: int = 0
    ) -> AICoachConversationList:
        """Get user's conversation history"""
        # This would typically query the database
        # For now, return empty list
        return AICoachConversationList(
            conversations=[],
            total=0,
            limit=limit,
            offset=offset
        )

    async def get_conversation(
        self, 
        conversation_id: str, 
        user_id: str
    ) -> Optional[AICoachConversation]:
        """Get specific conversation"""
        # This would typically query the database
        # For now, return None
        return None

    async def delete_conversation(
        self, 
        conversation_id: str, 
        user_id: str
    ) -> bool:
        """Delete a conversation"""
        # This would typically delete from database
        # For now, return True
        return True

    async def analyze_user_spending(self, user_id: str) -> SpendingAnalysis:
        """Analyze user's spending patterns"""
        try:
            # This would typically fetch user's transaction data
            # For now, provide a sample analysis
            
            # Generate AI analysis prompt
            analysis_prompt = f"""
            Analyze the following spending data and provide insights:
            - Total spending: $2,500 (last 30 days)
            - Categories: Food ($800), Transportation ($400), Entertainment ($300), Shopping ($600), Bills ($400)
            
            Provide:
            1. Key insights about spending patterns
            2. Areas for potential savings
            3. Recommendations for improvement
            4. Budget suggestions
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a financial analyst. Provide clear, actionable insights."},
                    {"role": "user", "content": analysis_prompt}
                ],
                max_tokens=400,
                temperature=0.5
            )
            
            analysis_text = response.choices[0].message.content
            
            return SpendingAnalysis(
                total_spending=2500.0,
                spending_by_category={
                    "Food": 800.0,
                    "Transportation": 400.0,
                    "Entertainment": 300.0,
                    "Shopping": 600.0,
                    "Bills": 400.0
                },
                spending_trends={"trend": "increasing", "change_percent": 5.2},
                insights=analysis_text.split("\n")[:3],  # First 3 lines as insights
                recommendations=["Reduce dining out", "Use public transport", "Set entertainment budget"],
                period="Last 30 days"
            )
            
        except Exception as e:
            logger.error(f"Spending analysis error: {e}")
            return SpendingAnalysis(
                total_spending=0.0,
                spending_by_category={},
                spending_trends={},
                insights=["Unable to analyze spending at this time"],
                recommendations=["Please try again later"],
                period="Unknown"
            )

    async def get_budget_recommendations(self, user_id: str) -> BudgetRecommendations:
        """Get AI-powered budget recommendations"""
        try:
            # Generate recommendations prompt
            recommendations_prompt = """
            Based on typical spending patterns, provide budget recommendations for:
            - Housing (30% of income)
            - Food (15% of income)
            - Transportation (10% of income)
            - Entertainment (5% of income)
            - Savings (20% of income)
            - Other expenses (20% of income)
            
            Assume monthly income of $5,000. Provide specific amounts and reasoning.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a financial planner. Provide specific, actionable budget recommendations."},
                    {"role": "user", "content": recommendations_prompt}
                ],
                max_tokens=500,
                temperature=0.5
            )
            
            recommendations_text = response.choices[0].message.content
            
            return BudgetRecommendations(
                recommendations=[
                    BudgetRecommendation(
                        category="Housing",
                        current_amount=1800.0,
                        recommended_amount=1500.0,
                        reasoning="Should not exceed 30% of income",
                        priority="high",
                        potential_savings=300.0
                    ),
                    BudgetRecommendation(
                        category="Food",
                        current_amount=800.0,
                        recommended_amount=750.0,
                        reasoning="15% of income allows for healthy eating",
                        priority="medium",
                        potential_savings=50.0
                    ),
                    BudgetRecommendation(
                        category="Entertainment",
                        current_amount=300.0,
                        recommended_amount=250.0,
                        reasoning="5% of income for leisure activities",
                        priority="low",
                        potential_savings=50.0
                    )
                ],
                total_potential_savings=400.0,
                overall_advice="Focus on reducing housing costs and increasing savings rate"
            )
            
        except Exception as e:
            logger.error(f"Budget recommendations error: {e}")
            return BudgetRecommendations(
                recommendations=[],
                total_potential_savings=0.0,
                overall_advice="Unable to generate recommendations at this time"
            )

    def _generate_suggestions(self, user_message: str, ai_response: str) -> List[str]:
        """Generate follow-up suggestions based on the conversation"""
        suggestions = [
            "How can I create a budget?",
            "What's the best way to save money?",
            "How much should I save for emergencies?",
            "What are good investment options for beginners?"
        ]
        
        # Customize suggestions based on the conversation
        if "budget" in user_message.lower():
            suggestions = [
                "How do I track my expenses?",
                "What percentage should I allocate to different categories?",
                "How often should I review my budget?",
                "What tools can help me stick to my budget?"
            ]
        elif "debt" in user_message.lower():
            suggestions = [
                "Which debt should I pay off first?",
                "How can I negotiate lower interest rates?",
                "Should I consolidate my debts?",
                "How long will it take to become debt-free?"
            ]
        
        return suggestions[:3]  # Return top 3 suggestions

    def _extract_financial_insights(self, ai_response: str) -> Dict[str, Any]:
        """Extract financial insights from AI response"""
        # Simple keyword extraction - in a real implementation, you'd use more sophisticated NLP
        insights = {
            "topics": [],
            "sentiment": "neutral",
            "action_items": []
        }
        
        response_lower = ai_response.lower()
        
        # Extract topics
        topics = []
        if "budget" in response_lower:
            topics.append("budgeting")
        if "save" in response_lower:
            topics.append("saving")
        if "debt" in response_lower:
            topics.append("debt management")
        if "invest" in response_lower:
            topics.append("investing")
        
        insights["topics"] = topics
        
        # Extract action items (simple approach)
        action_items = []
        if "create" in response_lower:
            action_items.append("Create a budget")
        if "track" in response_lower:
            action_items.append("Track expenses")
        if "save" in response_lower:
            action_items.append("Increase savings")
        
        insights["action_items"] = action_items
        
        return insights 