# backend/routers/transactions.py
from fastapi import APIRouter, Depends, Query, Path, Body
from typing import List, Optional
from datetime import datetime, date
from decimal import Decimal

from models.transaction import (
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
    TransactionListResponse,
    TransactionSummary,
    TransactionType,
    TransactionCategory
)
from services.transaction_service import TransactionService
from dependencies.auth import get_current_user
from exceptions import NotFoundError, ValidationError

router = APIRouter()

@router.get("/", response_model=TransactionListResponse)
async def list_transactions(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page"),
    start_date: Optional[date] = Query(None, description="Filter by start date"),
    end_date: Optional[date] = Query(None, description="Filter by end date"),
    category: Optional[TransactionCategory] = Query(None, description="Filter by category"),
    transaction_type: Optional[TransactionType] = Query(None, description="Filter by type"),
    search: Optional[str] = Query(None, description="Search in description"),
    sort_by: str = Query("date", description="Sort field"),
    sort_order: str = Query("desc", regex="^(asc|desc)$", description="Sort order"),
    current_user: dict = Depends(get_current_user)
):
    """Get paginated list of user transactions with filtering and sorting"""
    service = TransactionService()
    
    filters = {
        "user_id": current_user["id"],
        "start_date": start_date,
        "end_date": end_date,
        "category": category,
        "transaction_type": transaction_type,
        "search": search
    }
    
    # Remove None values
    filters = {k: v for k, v in filters.items() if v is not None}
    
    result = await service.list_transactions(
        filters=filters,
        page=page,
        per_page=per_page,
        sort_by=sort_by,
        sort_order=sort_order
    )
    
    return result

@router.get("/summary", response_model=TransactionSummary)
async def get_transaction_summary(
    start_date: date = Query(..., description="Summary start date"),
    end_date: date = Query(..., description="Summary end date"),
    current_user: dict = Depends(get_current_user)
):
    """Get transaction summary statistics for a date range"""
    service = TransactionService()
    
    summary = await service.get_summary(
        user_id=current_user["id"],
        start_date=start_date,
        end_date=end_date
    )
    
    return summary

@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: int = Path(..., description="Transaction ID"),
    current_user: dict = Depends(get_current_user)
):
    """Get a specific transaction by ID"""
    service = TransactionService()
    
    transaction = await service.get_transaction(
        transaction_id=transaction_id,
        user_id=current_user["id"]
    )
    
    if not transaction:
        raise NotFoundError("Transaction", transaction_id)
    
    return transaction

@router.post("/", response_model=TransactionResponse, status_code=201)
async def create_transaction(
    transaction: TransactionCreate = Body(...),
    current_user: dict = Depends(get_current_user)
):
    """Create a new transaction"""
    service = TransactionService()
    
    # Additional validation
    if transaction.date > datetime.now():
        raise ValidationError("Transaction date cannot be in the future", "date")
    
    created_transaction = await service.create_transaction(
        user_id=current_user["id"],
        transaction_data=transaction
    )
    
    return created_transaction

@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: int = Path(..., description="Transaction ID"),
    transaction_update: TransactionUpdate = Body(...),
    current_user: dict = Depends(get_current_user)
):
    """Update an existing transaction"""
    service = TransactionService()
    
    # Check if transaction exists and belongs to user
    existing = await service.get_transaction(
        transaction_id=transaction_id,
        user_id=current_user["id"]
    )
    
    if not existing:
        raise NotFoundError("Transaction", transaction_id)
    
    updated_transaction = await service.update_transaction(
        transaction_id=transaction_id,
        user_id=current_user["id"],
        transaction_data=transaction_update
    )
    
    return updated_transaction

@router.delete("/{transaction_id}", status_code=204)
async def delete_transaction(
    transaction_id: int = Path(..., description="Transaction ID"),
    current_user: dict = Depends(get_current_user)
):
    """Delete a transaction"""
    service = TransactionService()
    
    # Check if transaction exists and belongs to user
    existing = await service.get_transaction(
        transaction_id=transaction_id,
        user_id=current_user["id"]
    )
    
    if not existing:
        raise NotFoundError("Transaction", transaction_id)
    
    await service.delete_transaction(
        transaction_id=transaction_id,
        user_id=current_user["id"]
    )
    
    return None

@router.post("/bulk", response_model=List[TransactionResponse])
async def create_bulk_transactions(
    transactions: List[TransactionCreate] = Body(..., max_items=100),
    current_user: dict = Depends(get_current_user)
):
    """Create multiple transactions at once"""
    service = TransactionService()
    
    # Validate all transactions
    for idx, transaction in enumerate(transactions):
        if transaction.date > datetime.now():
            raise ValidationError(
                f"Transaction {idx + 1}: date cannot be in the future",
                f"transactions[{idx}].date"
            )
    
    created_transactions = await service.create_bulk_transactions(
        user_id=current_user["id"],
        transactions_data=transactions
    )
    
    return created_transactions

@router.get("/export/csv")
async def export_transactions_csv(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    """Export transactions as CSV file"""
    from fastapi.responses import StreamingResponse
    import csv
    import io
    
    service = TransactionService()
    
    transactions = await service.get_all_transactions(
        user_id=current_user["id"],
        start_date=start_date,
        end_date=end_date
    )
    
    # Create CSV in memory
    output = io.StringIO()
    writer = csv.DictWriter(
        output,
        fieldnames=[
            "id", "date", "type", "category", 
            "amount", "description", "tags"
        ]
    )
    
    writer.writeheader()
    for transaction in transactions:
        writer.writerow({
            "id": transaction.id,
            "date": transaction.date.strftime("%Y-%m-%d"),
            "type": transaction.transaction_type,
            "category": transaction.category,
            "amount": float(transaction.amount),
            "description": transaction.description or "",
            "tags": ", ".join(transaction.tags) if transaction.tags else ""
        })
    
    output.seek(0)
    
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=transactions_{date.today()}.csv"
        }
    )

@router.get("/analytics/categories")
async def get_category_analytics(
    period: str = Query("month", regex="^(week|month|quarter|year)$"),
    current_user: dict = Depends(get_current_user)
):
    """Get spending analytics by category"""
    service = TransactionService()
    
    analytics = await service.get_category_analytics(
        user_id=current_user["id"],
        period=period
    )
    
    return analytics

@router.get("/recurring")
async def get_recurring_transactions(
    current_user: dict = Depends(get_current_user)
):
    """Get all recurring transactions"""
    service = TransactionService()
    
    recurring = await service.get_recurring_transactions(
        user_id=current_user["id"]
    )
    
    return recurring 