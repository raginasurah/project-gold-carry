# backend/exceptions.py
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging
from typing import Union

logger = logging.getLogger(__name__)

class AppException(Exception):
    """Base application exception"""
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        details: dict = None
    ):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)

class AuthenticationError(AppException):
    """Authentication related errors"""
    def __init__(self, message: str = "Authentication required"):
        super().__init__(message, status_code=401)

class AuthorizationError(AppException):
    """Authorization related errors"""
    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(message, status_code=403)

class NotFoundError(AppException):
    """Resource not found errors"""
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            f"{resource} with id '{identifier}' not found",
            status_code=404
        )

class ValidationError(AppException):
    """Custom validation errors"""
    def __init__(self, message: str, field: str = None):
        details = {"field": field} if field else {}
        super().__init__(message, status_code=422, details=details)

class RateLimitError(AppException):
    """Rate limit exceeded error"""
    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(message, status_code=429)

class ExternalServiceError(AppException):
    """External service errors (e.g., OpenAI, Supabase)"""
    def __init__(self, service: str, message: str):
        super().__init__(
            f"External service error ({service}): {message}",
            status_code=503,
            details={"service": service}
        )

async def app_exception_handler(request: Request, exc: AppException):
    """Handle custom application exceptions"""
    logger.error(
        f"Application error: {exc.message}",
        extra={
            "status_code": exc.status_code,
            "details": exc.details,
            "path": request.url.path
        }
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.message,
            "details": exc.details,
            "request_id": request.headers.get("X-Request-ID", "unknown")
        }
    )

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle HTTP exceptions"""
    logger.warning(
        f"HTTP exception: {exc.detail}",
        extra={
            "status_code": exc.status_code,
            "path": request.url.path
        }
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.detail,
            "status_code": exc.status_code
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation exceptions with detailed error messages"""
    errors = exc.errors()
    
    # Format validation errors
    formatted_errors = []
    for error in errors:
        field_path = " -> ".join(str(loc) for loc in error['loc'])
        formatted_errors.append({
            "field": field_path,
            "message": error['msg'],
            "type": error['type']
        })
    
    logger.warning(
        f"Validation error on {request.url.path}",
        extra={"errors": formatted_errors}
    )
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": True,
            "message": "Validation error",
            "details": formatted_errors
        }
    )

async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions"""
    logger.exception(
        f"Unexpected error on {request.url.path}: {str(exc)}",
        exc_info=True
    )
    
    # Don't expose internal errors in production
    from config import settings
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": True,
            "message": "Internal server error",
            "details": str(exc) if settings.debug else "An unexpected error occurred"
        }
    )

def register_exception_handlers(app):
    """Register all exception handlers"""
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler) 