# backend/tests/test_transactions.py
import pytest
from fastapi.testclient import TestClient
from datetime import datetime, date, timedelta
from decimal import Decimal
from unittest.mock import patch, MagicMock

from main import app
from models.transaction import TransactionType, TransactionCategory

client = TestClient(app)

# Test fixtures
@pytest.fixture
def auth_headers():
    """Mock authentication headers"""
    return {"Authorization": "Bearer test-token"}

@pytest.fixture
def mock_user():
    """Mock authenticated user"""
    return {
        "id": "test-user-123",
        "email": "test@example.com"
    }

@pytest.fixture
def valid_transaction_data():
    """Valid transaction data for testing"""
    return {
        "amount": 100.50,
        "category": "food",
        "description": "Grocery shopping",
        "transaction_type": "expense",
        "date": datetime.now().isoformat(),
        "tags": ["groceries", "weekly"]
    }

class TestTransactionCreate:
    """Test transaction creation"""
    
    @patch('dependencies.auth.get_current_user')
    @patch('services.transaction_service.TransactionService.create_transaction')
    async def test_create_transaction_success(
        self, 
        mock_create, 
        mock_auth, 
        auth_headers, 
        mock_user, 
        valid_transaction_data
    ):
        """Test successful transaction creation"""
        # Setup mocks
        mock_auth.return_value = mock_user
        mock_create.return_value = {
            "id": 1,
            "user_id": mock_user["id"],
            **valid_transaction_data,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        
        # Make request
        response = client.post(
            "/api/transactions",
            json=valid_transaction_data,
            headers=auth_headers
        )
        
        # Assertions
        assert response.status_code == 201
        assert response.json()["amount"] == 100.50
        assert response.json()["category"] == "food"
    
    async def test_create_transaction_invalid_amount(self, auth_headers):
        """Test transaction creation with invalid amount"""
        invalid_data = {
            "amount": -50,  # Negative amount
            "category": "food",
            "transaction_type": "expense",
            "date": datetime.now().isoformat()
        }
        
        response = client.post(
            "/api/transactions",
            json=invalid_data,
            headers=auth_headers
        )
        
        assert response.status_code == 422
        assert "Amount must be positive" in str(response.json())
    
    async def test_create_transaction_future_date(self, auth_headers, valid_transaction_data):
        """Test transaction creation with future date"""
        future_data = valid_transaction_data.copy()
        future_data["date"] = (datetime.now() + timedelta(days=1)).isoformat()
        
        response = client.post(
            "/api/transactions",
            json=future_data,
            headers=auth_headers
        )
        
        assert response.status_code == 422
        assert "future" in response.json()["message"].lower()
    
    async def test_create_transaction_category_mismatch(self, auth_headers):
        """Test transaction with mismatched category and type"""
        invalid_data = {
            "amount": 100,
            "category": "salary",  # Income category
            "transaction_type": "expense",  # But marked as expense
            "date": datetime.now().isoformat()
        }
        
        response = client.post(
            "/api/transactions",
            json=invalid_data,
            headers=auth_headers
        )
        
        assert response.status_code == 422
        assert "category" in response.json()["message"].lower()

class TestTransactionList:
    """Test transaction listing and filtering"""
    
    @patch('dependencies.auth.get_current_user')
    @patch('services.transaction_service.TransactionService.list_transactions')
    async def test_list_transactions_success(
        self, 
        mock_list, 
        mock_auth, 
        auth_headers, 
        mock_user
    ):
        """Test successful transaction listing"""
        # Setup mocks
        mock_auth.return_value = mock_user
        mock_list.return_value = {
            "transactions": [
                {
                    "id": 1,
                    "amount": 100.50,
                    "category": "food",
                    "transaction_type": "expense",
                    "date": datetime.now().isoformat()
                }
            ],
            "total": 1,
            "page": 1,
            "per_page": 20,
            "total_pages": 1
        }
        
        response = client.get("/api/transactions", headers=auth_headers)
        
        assert response.status_code == 200
        assert len(response.json()["transactions"]) == 1
        assert response.json()["total"] == 1
    
    async def test_list_transactions_with_filters(self, auth_headers):
        """Test transaction listing with filters"""
        params = {
            "category": "food",
            "transaction_type": "expense",
            "start_date": date.today().isoformat(),
            "end_date": date.today().isoformat(),
            "page": 1,
            "per_page": 10
        }
        
        response = client.get(
            "/api/transactions",
            params=params,
            headers=auth_headers
        )
        
        assert response.status_code == 200
    
    async def test_list_transactions_pagination(self, auth_headers):
        """Test transaction pagination"""
        response = client.get(
            "/api/transactions?page=2&per_page=5",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        assert "page" in response.json()
        assert "per_page" in response.json()

class TestTransactionUpdate:
    """Test transaction updates"""
    
    @patch('dependencies.auth.get_current_user')
    @patch('services.transaction_service.TransactionService.get_transaction')
    @patch('services.transaction_service.TransactionService.update_transaction')
    async def test_update_transaction_success(
        self,
        mock_update,
        mock_get,
        mock_auth,
        auth_headers,
        mock_user
    ):
        """Test successful transaction update"""
        # Setup mocks
        mock_auth.return_value = mock_user
        mock_get.return_value = {"id": 1, "user_id": mock_user["id"]}
        mock_update.return_value = {
            "id": 1,
            "amount": 200.00,
            "category": "transport"
        }
        
        update_data = {
            "amount": 200.00,
            "category": "transport"
        }
        
        response = client.put(
            "/api/transactions/1",
            json=update_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        assert response.json()["amount"] == 200.00
    
    async def test_update_nonexistent_transaction(self, auth_headers):
        """Test updating non-existent transaction"""
        response = client.put(
            "/api/transactions/99999",
            json={"amount": 100},
            headers=auth_headers
        )
        
        assert response.status_code == 404

class TestTransactionDelete:
    """Test transaction deletion"""
    
    @patch('dependencies.auth.get_current_user')
    @patch('services.transaction_service.TransactionService.get_transaction')
    @patch('services.transaction_service.TransactionService.delete_transaction')
    async def test_delete_transaction_success(
        self,
        mock_delete,
        mock_get,
        mock_auth,
        auth_headers,
        mock_user
    ):
        """Test successful transaction deletion"""
        # Setup mocks
        mock_auth.return_value = mock_user
        mock_get.return_value = {"id": 1, "user_id": mock_user["id"]}
        mock_delete.return_value = None
        
        response = client.delete("/api/transactions/1", headers=auth_headers)
        
        assert response.status_code == 204

class TestTransactionSummary:
    """Test transaction summary endpoint"""
    
    @patch('dependencies.auth.get_current_user')
    @patch('services.transaction_service.TransactionService.get_summary')
    async def test_get_summary_success(
        self,
        mock_summary,
        mock_auth,
        auth_headers,
        mock_user
    ):
        """Test getting transaction summary"""
        # Setup mocks
        mock_auth.return_value = mock_user
        mock_summary.return_value = {
            "total_income": 5000.00,
            "total_expenses": 3000.00,
            "net_balance": 2000.00,
            "transaction_count": 50,
            "average_transaction": 80.00
        }
        
        params = {
            "start_date": date.today().isoformat(),
            "end_date": date.today().isoformat()
        }
        
        response = client.get(
            "/api/transactions/summary",
            params=params,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        assert response.json()["net_balance"] == 2000.00

# Integration tests
class TestTransactionIntegration:
    """Integration tests for transaction flow"""
    
    @pytest.mark.integration
    async def test_complete_transaction_flow(self, auth_headers):
        """Test complete transaction lifecycle"""
        # Create transaction
        create_data = {
            "amount": 50.00,
            "category": "food",
            "transaction_type": "expense",
            "date": datetime.now().isoformat()
        }
        
        create_response = client.post(
            "/api/transactions",
            json=create_data,
            headers=auth_headers
        )
        assert create_response.status_code == 201
        transaction_id = create_response.json()["id"]
        
        # Read transaction
        get_response = client.get(
            f"/api/transactions/{transaction_id}",
            headers=auth_headers
        )
        assert get_response.status_code == 200
        
        # Update transaction
        update_response = client.put(
            f"/api/transactions/{transaction_id}",
            json={"amount": 75.00},
            headers=auth_headers
        )
        assert update_response.status_code == 200
        assert update_response.json()["amount"] == 75.00
        
        # Delete transaction
        delete_response = client.delete(
            f"/api/transactions/{transaction_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 204 