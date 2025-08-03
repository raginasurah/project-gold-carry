# AI Finance Manager

A comprehensive financial management application with AI-powered insights, built with FastAPI backend and React frontend.

## 🚀 Features

### Core Features
- **Transaction Management**: Track income and expenses with categories
- **Budget Planning**: Multiple budgeting methods (50/30/20, Zero-based, etc.)
- **Financial Goals**: Set and track savings goals
- **AI Financial Coach**: Get personalized financial advice
- **Analytics & Reports**: Detailed spending analysis and insights
- **Subscription Tracking**: Monitor recurring expenses
- **Export & Import**: CSV export and bulk transaction import

### Technical Features
- **Secure Authentication**: JWT-based auth with Supabase
- **Rate Limiting**: API protection against abuse
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Docker Support**: Containerized deployment
- **Database Security**: Row Level Security (RLS) policies

## 🏗️ Architecture

```
project-gold-carry/
├── backend/                 # FastAPI backend
│   ├── config.py           # Application configuration
│   ├── main.py             # FastAPI application
│   ├── middleware/         # Custom middleware
│   ├── models/             # Pydantic models
│   ├── routers/            # API endpoints
│   ├── services/           # Business logic
│   └── tests/              # Test suite
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── config/         # Configuration files
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── pages/          # Page components
│   └── public/             # Static assets
├── database/               # Database schema
└── docker-compose.yml      # Docker configuration
```

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Supabase**: Database and authentication
- **Pydantic**: Data validation and serialization
- **Redis**: Caching and rate limiting
- **OpenAI**: AI-powered financial coaching

### Frontend
- **React**: UI framework
- **Tailwind CSS**: Styling
- **React Query**: Data fetching and caching
- **React Router**: Navigation
- **Axios**: HTTP client

### Infrastructure
- **Docker**: Containerization
- **Nginx**: Reverse proxy
- **PostgreSQL**: Database (via Supabase)

## 📦 Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- Docker & Docker Compose
- Supabase account
- OpenAI API key

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-gold-carry
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   
   # Frontend
   cd ../frontend
   npm install
   ```

4. **Set up database**
   - Create a Supabase project
   - Run the schema from `database/schema.sql`
   - Update environment variables with Supabase credentials

5. **Run the application**
   ```bash
   # Development
   # Backend
   cd backend
   uvicorn main:app --reload
   
   # Frontend (in another terminal)
   cd frontend
   npm start
   ```

   ```bash
   # Production with Docker
   docker-compose up --build
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_KEY` | Supabase service key | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `JWT_SECRET_KEY` | JWT signing key | Yes |
| `CORS_ORIGINS` | Allowed CORS origins | No |
| `DEBUG` | Debug mode | No |

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql`
3. Enable Row Level Security (RLS) on all tables
4. Configure authentication providers
5. Get your project URL and API keys

## 🚀 Deployment

### Railway (Backend)
```bash
cd backend
railway login
railway link
railway up
```

### Vercel (Frontend)
```bash
cd frontend
vercel --prod
```

### Docker
```bash
docker-compose up --build -d
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

#### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction
- `GET /api/transactions/summary` - Get summary statistics

#### AI Coach
- `POST /api/ai-coach/chat` - Chat with AI financial coach

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest -v
pytest --cov=. --cov-report=html
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🔒 Security

- **Authentication**: JWT tokens with secure signing
- **Authorization**: Row Level Security (RLS) policies
- **Rate Limiting**: API protection against abuse
- **CORS**: Configured for specific origins
- **Input Validation**: Pydantic models with strict validation
- **SQL Injection**: Protected via Supabase client

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- `user_profiles` - User profile information
- `transactions` - Financial transactions
- `budgets` - Budget categories and limits
- `goals` - Financial goals and progress
- `subscriptions` - Recurring expenses
- `ai_conversations` - AI chat history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API docs at `/docs`

## 🗺️ Roadmap

- [ ] Multi-currency support
- [ ] Investment portfolio tracking
- [ ] Family/shared budgets
- [ ] Mobile app
- [ ] Advanced AI insights
- [ ] Integration with banks
- [ ] Tax reporting
- [ ] Financial planning tools

---

Built with ❤️ using FastAPI and React