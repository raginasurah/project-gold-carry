#!/bin/bash

# AI Finance Manager - Deployment Script
# This script deploys the entire application stack

set -e  # Exit on any error

echo "🚀 AI Finance Manager - Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found!"
    print_status "Please copy env.example to .env and configure your environment variables"
    exit 1
fi

# Load environment variables
source .env

print_status "Environment variables loaded"

# Check required environment variables
required_vars=("OPENAI_API_KEY" "SUPABASE_URL" "SUPABASE_KEY" "SUPABASE_ANON_KEY")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_error "Required environment variable $var is not set!"
        exit 1
    fi
done

print_success "All required environment variables are set"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists python3; then
    print_error "Python 3 is not installed"
    exit 1
fi

if ! command_exists pip; then
    print_error "pip is not installed"
    exit 1
fi

if ! command_exists node; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed"
    exit 1
fi

print_success "All prerequisites are installed"

# Backend deployment
print_status "Deploying backend..."

cd backend

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install -r requirements.txt

# Run tests
print_status "Running backend tests..."
if command_exists pytest; then
    pytest -v || print_warning "Some tests failed, but continuing deployment"
else
    print_warning "pytest not found, skipping tests"
fi

# Start backend server
print_status "Starting backend server..."
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Check if backend is running
if curl -f http://localhost:8000/health >/dev/null 2>&1; then
    print_success "Backend is running on http://localhost:8000"
else
    print_error "Backend failed to start"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

cd ..

# Frontend deployment
print_status "Deploying frontend..."

cd frontend

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install

# Run tests
print_status "Running frontend tests..."
npm test -- --watchAll=false || print_warning "Some tests failed, but continuing deployment"

# Build frontend
print_status "Building frontend..."
npm run build

# Start frontend server
print_status "Starting frontend server..."
npm start &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 10

# Check if frontend is running
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    print_success "Frontend is running on http://localhost:3000"
else
    print_error "Frontend failed to start"
    kill $FRONTEND_PID 2>/dev/null || true
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

cd ..

# Docker deployment (optional)
if command_exists docker && command_exists docker-compose; then
    print_status "Docker detected. Would you like to deploy with Docker? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Deploying with Docker..."
        
        # Stop existing containers
        docker-compose down 2>/dev/null || true
        
        # Build and start containers
        docker-compose up --build -d
        
        print_success "Docker deployment completed"
        print_status "Backend: http://localhost:8000"
        print_status "Frontend: http://localhost:3000"
        print_status "API Docs: http://localhost:8000/docs"
    fi
else
    print_warning "Docker not found, skipping Docker deployment"
fi

# Final status
echo ""
echo "🎉 Deployment completed successfully!"
echo "====================================="
echo "Backend API: http://localhost:8000"
echo "Frontend App: http://localhost:3000"
echo "API Documentation: http://localhost:8000/docs"
echo "Health Check: http://localhost:8000/health"
echo ""
echo "To stop the servers, press Ctrl+C"

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    print_success "Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
wait 