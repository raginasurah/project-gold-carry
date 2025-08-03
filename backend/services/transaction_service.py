# backend/services/transaction_service.py
from typing import List, Dict, Optional, Any
from datetime import datetime, date, timedelta
from decimal import Decimal
import logging

from supabase import create_client, Client
from fastapi import HTTPException

from config import settings
from models.transaction import (
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
    TransactionListResponse,
    TransactionSummary,
    TransactionType,
    TransactionCategory
)
from exceptions import NotFoundError, ValidationError, ExternalServiceError

logger = logging.getLogger(__name__)

class TransactionService:
    """Service for handling transaction operations"""
    
    def __init__(self):
        self.supabase: Client = create_client(
            settings.supabase_url,
            settings.supabase_key
        )
    
    async def list_transactions(
        self,
        filters: Dict[str, Any],
        page: int = 1,
        per_page: int = 20,
        sort_by: str = "date",
        sort_order: str = "desc"
    ) -> TransactionListResponse:
        """Get paginated list of transactions with filters"""
        try:
            # Build query
            query = self.supabase.table("transactions").select("*")
            
            # Apply filters
            if "user_id" in filters:
                query = query.eq("user_id", filters["user_id"])
            
            if "start_date" in filters and filters["start_date"]:
                query = query.gte("date", filters["start_date"].isoformat())
            
            if "end_date" in filters and filters["end_date"]:
                query = query.lte("date", filters["end_date"].isoformat())
            
            if "category" in filters and filters["category"]:
                query = query.eq("category", filters["category"])
            
            if "transaction_type" in filters and filters["transaction_type"]:
                query = query.eq("transaction_type", filters["transaction_type"])
            
            if "search" in filters and filters["search"]:
                query = query.ilike("description", f"%{filters['search']}%")
            
            # Get total count
            count_query = query
            count_result = count_query.execute()
            total = len(count_result.data)
            
            # Apply sorting
            ascending = sort_order == "asc"
            query = query.order(sort_by, desc=not ascending)
            
            # Apply pagination
            offset = (page - 1) * per_page
            query = query.range(offset, offset + per_page - 1)
            
            # Execute query
            result = query.execute()
            
            # Convert to response models
            transactions = [
                TransactionResponse(**transaction)
                for transaction in result.data
            ]
            
            return TransactionListResponse(
                transactions=transactions,
                total=total,
                page=page,
                per_page=per_page,
                total_pages=(total + per_page - 1) // per_page
            )
            
        except Exception as e:
            logger.error(f"Failed to list transactions: {str(e)}")
            raise ExternalServiceError("Supabase", str(e))
    
    async def get_transaction(
        self,
        transaction_id: int,
        user_id: str
    ) -> Optional[TransactionResponse]:
        """Get a single transaction by ID"""
        try:
            result = self.supabase.table("transactions")\
                .select("*")\
                .eq("id", transaction_id)\
                .eq("user_id", user_id)\
                .single()\
                .execute()
            
            if result.data:
                return TransactionResponse(**result.data)
            return None
            
        except Exception as e:
            logger.error(f"Failed to get transaction {transaction_id}: {str(e)}")
            return None
    
    async def create_transaction(
        self,
        user_id: str,
        transaction_data: TransactionCreate
    ) -> TransactionResponse:
        """Create a new transaction"""
        try:
            # Prepare data
            data = {
                "user_id": user_id,
                **transaction_data.model_dump()
            }
            
            # Convert Decimal to float for database
            data["amount"] = float(data["amount"])
            
            # Execute insert
            result = self.supabase.table("transactions")\
                .insert(data)\
                .execute()
            
            if result.data:
                return TransactionResponse(**result.data[0])
            
            raise HTTPException(status_code=500, detail="Failed to create transaction")
            
        except Exception as e:
            logger.error(f"Failed to create transaction: {str(e)}")
            raise ExternalServiceError("Supabase", str(e))
    
    async def update_transaction(
        self,
        transaction_id: int,
        user_id: str,
        transaction_data: TransactionUpdate
    ) -> TransactionResponse:
        """Update an existing transaction"""
        try:
            # Prepare update data (exclude None values)
            update_data = transaction_data.model_dump(exclude_unset=True)
            
            # Convert Decimal to float if present
            if "amount" in update_data and update_data["amount"] is not None:
                update_data["amount"] = float(update_data["amount"])
            
            # Execute update
            result = self.supabase.table("transactions")\
                .update(update_data)\
                .eq("id", transaction_id)\
                .eq("user_id", user_id)\
                .execute()
            
            if result.data:
                return TransactionResponse(**result.data[0])
            
            raise NotFoundError("Transaction", transaction_id)
            
        except Exception as e:
            logger.error(f"Failed to update transaction {transaction_id}: {str(e)}")
            raise ExternalServiceError("Supabase", str(e))
    
    async def delete_transaction(
        self,
        transaction_id: int,
        user_id: str
    ) -> None:
        """Delete a transaction"""
        try:
            result = self.supabase.table("transactions")\
                .delete()\
                .eq("id", transaction_id)\
                .eq("user_id", user_id)\
                .execute()
            
            if not result.data:
                raise NotFoundError("Transaction", transaction_id)
                
        except Exception as e:
            logger.error(f"Failed to delete transaction {transaction_id}: {str(e)}")
            raise ExternalServiceError("Supabase", str(e))
    
    async def get_summary(
        self,
        user_id: str,
        start_date: date,
        end_date: date
    ) -> TransactionSummary:
        """Get transaction summary statistics"""
        try:
            # Get all transactions in date range
            result = self.supabase.table("transactions")\
                .select("*")\
                .eq("user_id", user_id)\
                .gte("date", start_date.isoformat())\
                .lte("date", end_date.isoformat())\
                .execute()
            
            transactions = result.data
            
            # Calculate summary statistics
            total_income = Decimal('0')
            total_expenses = Decimal('0')
            category_breakdown = {}
            largest_expense = None
            largest_income = None
            
            for transaction in transactions:
                amount = Decimal(str(transaction['amount']))
                category = transaction['category']
                
                if transaction['transaction_type'] == 'income':
                    total_income += amount
                    if not largest_income or amount > Decimal(str(largest_income['amount'])):
                        largest_income = transaction
                else:
                    total_expenses += amount
                    if not largest_expense or amount > Decimal(str(largest_expense['amount'])):
                        largest_expense = transaction
                
                # Category breakdown
                if category not in category_breakdown:
                    category_breakdown[category] = Decimal('0')
                category_breakdown[category] += amount
            
            # Calculate additional metrics
            net_balance = total_income - total_expenses
            transaction_count = len(transactions)
            average_transaction = (
                (total_income + total_expenses) / transaction_count
                if transaction_count > 0 else Decimal('0')
            )
            
            # Calculate daily average
            days_in_period = (end_date - start_date).days + 1
            daily_average = net_balance / days_in_period if days_in_period > 0 else Decimal('0')
            
            # Monthly trend calculation
            monthly_trend = await self._calculate_monthly_trend(user_id, start_date, end_date)
            
            return TransactionSummary(
                total_income=total_income,
                total_expenses=total_expenses,
                net_balance=net_balance,
                transaction_count=transaction_count,
                average_transaction=average_transaction,
                largest_expense=TransactionResponse(**largest_expense) if largest_expense else None,
                largest_income=TransactionResponse(**largest_income) if largest_income else None,
                category_breakdown=category_breakdown,
                daily_average=daily_average,
                monthly_trend=monthly_trend
            )
            
        except Exception as e:
            logger.error(f"Failed to get transaction summary: {str(e)}")
            raise ExternalServiceError("Supabase", str(e))
    
    async def create_bulk_transactions(
        self,
        user_id: str,
        transactions_data: List[TransactionCreate]
    ) -> List[TransactionResponse]:
        """Create multiple transactions at once"""
        try:
            # Prepare bulk data
            bulk_data = []
            for transaction in transactions_data:
                data = {
                    "user_id": user_id,
                    **transaction.model_dump()
                }
                data["amount"] = float(data["amount"])
                bulk_data.append(data)
            
            # Execute bulk insert
            result = self.supabase.table("transactions")\
                .insert(bulk_data)\
                .execute()
            
            if result.data:
                return [
                    TransactionResponse(**transaction)
                    for transaction in result.data
                ]
            
            raise HTTPException(status_code=500, detail="Failed to create transactions")
            
        except Exception as e:
            logger.error(f"Failed to create bulk transactions: {str(e)}")
            raise ExternalServiceError("Supabase", str(e))
    
    async def get_all_transactions(
        self,
        user_id: str,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> List[TransactionResponse]:
        """Get all transactions for export"""
        try:
            query = self.supabase.table("transactions")\
                .select("*")\
                .eq("user_id", user_id)\
                .order("date", desc=True)
            
            if start_date:
                query = query.gte("date", start_date.isoformat())
            if end_date:
                query = query.lte("date", end_date.isoformat())
            
            result = query.execute()
            
            return [
                TransactionResponse(**transaction)
                for transaction in result.data
            ]
            
        except Exception as e:
            logger.error(f"Failed to get all transactions: {str(e)}")
            raise ExternalServiceError("Supabase", str(e))
    
    async def get_category_analytics(
        self,
        user_id: str,
        period: str = "month"
    ) -> Dict[str, Any]:
        """Get spending analytics by category"""
        try:
            # Calculate date range based on period
            end_date = date.today()
            if period == "week":
                start_date = end_date - timedelta(days=7)
            elif period == "month":
                start_date = end_date - timedelta(days=30)
            elif period == "quarter":
                start_date = end_date - timedelta(days=90)
            else:  # year
                start_date = end_date - timedelta(days=365)
            
            # Get transactions
            result = self.supabase.table("transactions")\
                .select("category, amount, transaction_type")\
                .eq("user_id", user_id)\
                .gte("date", start_date.isoformat())\
                .lte("date", end_date.isoformat())\
                .execute()
            
            # Analyze by category
            analytics = {
                "income_by_category": {},
                "expenses_by_category": {},
                "total_by_category": {},
                "top_categories": [],
                "period": period,
                "date_range": {
                    "start": start_date.isoformat(),
                    "end": end_date.isoformat()
                }
            }
            
            for transaction in result.data:
                category = transaction['category']
                amount = Decimal(str(transaction['amount']))
                
                if transaction['transaction_type'] == 'income':
                    if category not in analytics['income_by_category']:
                        analytics['income_by_category'][category] = Decimal('0')
                    analytics['income_by_category'][category] += amount
                else:
                    if category not in analytics['expenses_by_category']:
                        analytics['expenses_by_category'][category] = Decimal('0')
                    analytics['expenses_by_category'][category] += amount
                
                if category not in analytics['total_by_category']:
                    analytics['total_by_category'][category] = Decimal('0')
                analytics['total_by_category'][category] += amount
            
            # Get top categories
            sorted_categories = sorted(
                analytics['total_by_category'].items(),
                key=lambda x: x[1],
                reverse=True
            )
            analytics['top_categories'] = [
                {"category": cat, "amount": float(amt)}
                for cat, amt in sorted_categories[:5]
            ]
            
            # Convert Decimal to float for JSON serialization
            analytics['income_by_category'] = {
                k: float(v) for k, v in analytics['income_by_category'].items()
            }
            analytics['expenses_by_category'] = {
                k: float(v) for k, v in analytics['expenses_by_category'].items()
            }
            analytics['total_by_category'] = {
                k: float(v) for k, v in analytics['total_by_category'].items()
            }
            
            return analytics
            
        except Exception as e:
            logger.error(f"Failed to get category analytics: {str(e)}")
            raise ExternalServiceError("Supabase", str(e))
    
    async def get_recurring_transactions(
        self,
        user_id: str
    ) -> List[Dict[str, Any]]:
        """Get recurring transactions"""
        try:
            result = self.supabase.table("transactions")\
                .select("*")\
                .eq("user_id", user_id)\
                .eq("is_recurring", True)\
                .execute()
            
            # Group by recurring_id
            recurring_groups = {}
            for transaction in result.data:
                recurring_id = transaction.get('recurring_id')
                if recurring_id:
                    if recurring_id not in recurring_groups:
                        recurring_groups[recurring_id] = []
                    recurring_groups[recurring_id].append(transaction)
            
            # Analyze recurring patterns
            recurring_transactions = []
            for recurring_id, transactions in recurring_groups.items():
                if len(transactions) >= 2:
                    # Sort by date
                    transactions.sort(key=lambda x: x['date'])
                    
                    # Calculate frequency
                    dates = [datetime.fromisoformat(t['date']) for t in transactions]
                    intervals = [
                        (dates[i+1] - dates[i]).days
                        for i in range(len(dates)-1)
                    ]
                    avg_interval = sum(intervals) / len(intervals) if intervals else 0
                    
                    # Determine frequency
                    if 25 <= avg_interval <= 35:
                        frequency = "monthly"
                    elif 12 <= avg_interval <= 16:
                        frequency = "bi-weekly"
                    elif 6 <= avg_interval <= 8:
                        frequency = "weekly"
                    elif 85 <= avg_interval <= 95:
                        frequency = "quarterly"
                    elif 360 <= avg_interval <= 370:
                        frequency = "yearly"
                    else:
                        frequency = f"every {int(avg_interval)} days"
                    
                    recurring_transactions.append({
                        "recurring_id": recurring_id,
                        "description": transactions[0]['description'],
                        "category": transactions[0]['category'],
                        "amount": transactions[0]['amount'],
                        "frequency": frequency,
                        "last_transaction": transactions[-1]['date'],
                        "transaction_count": len(transactions),
                        "next_expected": (
                            dates[-1] + timedelta(days=int(avg_interval))
                        ).isoformat() if avg_interval > 0 else None
                    })
            
            return recurring_transactions
            
        except Exception as e:
            logger.error(f"Failed to get recurring transactions: {str(e)}")
            raise ExternalServiceError("Supabase", str(e))
    
    async def _calculate_monthly_trend(
        self,
        user_id: str,
        start_date: date,
        end_date: date
    ) -> List[Dict[str, Any]]:
        """Calculate monthly spending trend"""
        try:
            # Get transactions grouped by month
            result = self.supabase.table("transactions")\
                .select("date, amount, transaction_type")\
                .eq("user_id", user_id)\
                .gte("date", start_date.isoformat())\
                .lte("date", end_date.isoformat())\
                .execute()
            
            # Group by month
            monthly_data = {}
            for transaction in result.data:
                trans_date = datetime.fromisoformat(transaction['date'])
                month_key = trans_date.strftime("%Y-%m")
                
                if month_key not in monthly_data:
                    monthly_data[month_key] = {
                        "income": Decimal('0'),
                        "expenses": Decimal('0'),
                        "net": Decimal('0')
                    }
                
                amount = Decimal(str(transaction['amount']))
                if transaction['transaction_type'] == 'income':
                    monthly_data[month_key]['income'] += amount
                else:
                    monthly_data[month_key]['expenses'] += amount
            
            # Calculate net for each month
            trend = []
            for month, data in sorted(monthly_data.items()):
                data['net'] = data['income'] - data['expenses']
                trend.append({
                    "month": month,
                    "income": float(data['income']),
                    "expenses": float(data['expenses']),
                    "net": float(data['net'])
                })
            
            return trend
            
        except Exception as e:
            logger.error(f"Failed to calculate monthly trend: {str(e)}")
            return [] 