# backend/models/transaction.py
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional, Literal, List
from decimal import Decimal
from enum import Enum

class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"

class TransactionCategory(str, Enum):
    # Expense categories
    FOOD = "food"
    TRANSPORT = "transport"
    UTILITIES = "utilities"
    ENTERTAINMENT = "entertainment"
    HEALTHCARE = "healthcare"
    EDUCATION = "education"
    SHOPPING = "shopping"
    RENT = "rent"
    INSURANCE = "insurance"
    OTHER_EXPENSE = "other_expense"
    
    # Income categories
    SALARY = "salary"
    INVESTMENT = "investment"
    GIFT = "gift"
    BONUS = "bonus"
    FREELANCE = "freelance"
    OTHER_INCOME = "other_income"

class TransactionBase(BaseModel):
    """Base transaction model with validation"""
    amount: Decimal = Field(
        ...,
        gt=0,
        le=1000000,
        decimal_places=2,
        description="Transaction amount (must be positive)"
    )
    category: TransactionCategory
    description: Optional[str] = Field(
        None,
        max_length=200,
        description="Optional transaction description"
    )
    transaction_type: TransactionType
    date: datetime = Field(
        default_factory=datetime.now,
        description="Transaction date"
    )
    tags: Optional[List[str]] = Field(
        default_factory=list,
        max_items=5,
        description="Optional tags for categorization"
    )
    
    @validator('amount')
    def validate_amount(cls, v):
        """Validate transaction amount"""
        if v <= 0:
            raise ValueError('Amount must be positive')
        if v > Decimal('1000000'):
            raise ValueError('Amount exceeds maximum limit of 1,000,000')
        # Round to 2 decimal places
        return round(v, 2)
    
    @validator('category')
    def validate_category_type_match(cls, v, values):
        """Ensure category matches transaction type"""
        if 'transaction_type' in values:
            income_categories = [
                TransactionCategory.SALARY,
                TransactionCategory.INVESTMENT,
                TransactionCategory.GIFT,
                TransactionCategory.BONUS,
                TransactionCategory.FREELANCE,
                TransactionCategory.OTHER_INCOME
            ]
            
            if values['transaction_type'] == TransactionType.INCOME:
                if v not in income_categories:
                    raise ValueError(f'Category {v} is not valid for income transactions')
            else:
                if v in income_categories:
                    raise ValueError(f'Category {v} is not valid for expense transactions')
        
        return v
    
    @validator('tags')
    def validate_tags(cls, v):
        """Validate and clean tags"""
        if v:
            # Remove duplicates and clean
            cleaned_tags = list(set(tag.strip().lower() for tag in v if tag.strip()))
            # Limit tag length
            return [tag[:20] for tag in cleaned_tags[:5]]
        return []
    
    @validator('date')
    def validate_date(cls, v):
        """Ensure date is not in the future"""
        if v > datetime.now():
            raise ValueError('Transaction date cannot be in the future')
        return v

class TransactionCreate(TransactionBase):
    """Model for creating a new transaction"""
    pass

class TransactionUpdate(BaseModel):
    """Model for updating a transaction"""
    amount: Optional[Decimal] = Field(None, gt=0, le=1000000, decimal_places=2)
    category: Optional[TransactionCategory] = None
    description: Optional[str] = Field(None, max_length=200)
    transaction_type: Optional[TransactionType] = None
    date: Optional[datetime] = None
    tags: Optional[List[str]] = Field(None, max_items=5)
    
    @validator('amount')
    def validate_amount(cls, v):
        if v is not None:
            if v <= 0:
                raise ValueError('Amount must be positive')
            if v > Decimal('1000000'):
                raise ValueError('Amount exceeds maximum limit')
            return round(v, 2)
        return v

class TransactionResponse(TransactionBase):
    """Model for transaction response"""
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class TransactionListResponse(BaseModel):
    """Model for paginated transaction list"""
    transactions: List[TransactionResponse]
    total: int
    page: int
    per_page: int
    total_pages: int

class TransactionSummary(BaseModel):
    """Model for transaction summary statistics"""
    total_income: Decimal
    total_expenses: Decimal
    net_balance: Decimal
    transaction_count: int
    average_transaction: Decimal
    largest_expense: Optional[TransactionResponse]
    largest_income: Optional[TransactionResponse]
    category_breakdown: dict[str, Decimal]
    daily_average: Decimal
    monthly_trend: List[dict] 