# AI Finance - Personal Finance Management App

A full-stack, AI-powered personal finance web application built with React, FastAPI, and Supabase.

## 🚀 Features

### Core Features
- **Secure Authentication** - User registration and login with Supabase
- **Smart Budgeting** - Multiple budgeting methods (50/30/20, Zero-based, 70/20/10, 60% rules)
- **Transaction Management** - Track income and expenses with categorization
- **AI Financial Coach** - OpenAI-powered chat interface for financial advice
- **Dashboard Analytics** - Visual charts and insights
- **Goal Tracking** - Set and monitor financial goals
- **Subscription Management** - Track recurring payments
- **Investment Portfolio** - Monitor investments and performance

### AI Features
- **Natural Language Financial Coach** - Chat with AI for personalized advice
- **Smart Insights** - Automated financial analysis and recommendations
- **Scenario Simulation** - Test different financial scenarios
- **Risk Alerts** - Unusual activity detection

### UX Features
- **Responsive Design** - Mobile-friendly interface
- **Privacy Mode** - Hide sensitive financial information
- **Quick Stats Bar** - Real-time financial overview
- **Gamified Elements** - Savings challenges and progress tracking

## 🛠 Tech Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **FastAPI** - Python web framework
- **OpenAI API** - AI integration
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Database
- **Supabase** - PostgreSQL database with real-time features
- **Row Level Security** - Data protection
- **Authentication** - Built-in auth system

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **Supabase** - Database hosting

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Supabase account
- OpenAI API key

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   ```

5. **Run the backend:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

The app will be available at `http://localhost:3000`

## 🗄 Database Setup

1. **Create Supabase project** at [supabase.com](https://supabase.com)

2. **Run the schema** from `database/schema.sql` in your Supabase SQL editor

3. **Configure authentication** in Supabase dashboard

4. **Update environment variables** with your Supabase credentials

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
OPENAI_API_KEY=sk-your-openai-api-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
```

#### Frontend
Update API endpoints in `src/contexts/AuthContext.js` and other API calls to match your backend URL.

## 🚀 Deployment

### Backend Deployment (Render)

1. **Connect your GitHub repository** to Render
2. **Create a new Web Service**
3. **Configure build settings:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Add environment variables** in Render dashboard
5. **Deploy**

### Frontend Deployment (Vercel)

1. **Connect your GitHub repository** to Vercel
2. **Configure build settings:**
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
3. **Add environment variables** if needed
4. **Deploy**

### Database (Supabase)

1. **Database is automatically deployed** with Supabase
2. **Configure Row Level Security** policies
3. **Set up authentication** providers
4. **Configure real-time subscriptions** if needed

## 📱 Usage

### Getting Started

1. **Register an account** or use demo credentials:
   - Email: `demo@example.com`
   - Password: `password123`

2. **Set up your profile** and financial information

3. **Create your first budget** using one of the available methods

4. **Start tracking transactions** and get AI insights

### AI Assistant

- **Ask financial questions** in natural language
- **Get personalized advice** based on your data
- **Receive spending insights** and recommendations
- **Plan financial goals** with AI guidance

### Budgeting Methods

- **50/30/20 Rule**: 50% needs, 30% wants, 20% savings
- **Zero-Based Budgeting**: Every dollar has a purpose
- **70/20/10 Rule**: 70% living, 20% savings, 10% debt
- **60% Solution**: 60% committed expenses, 40% flexible

## 🔒 Security

- **Row Level Security** in Supabase
- **JWT authentication** tokens
- **Password hashing** (bcrypt)
- **CORS protection**
- **Input validation** with Pydantic
- **Environment variable** protection

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@aifinance.com or create an issue in the GitHub repository.

## 🔮 Roadmap

- [ ] Plaid integration for bank account aggregation
- [ ] Advanced investment tracking
- [ ] Family/shared budgeting features
- [ ] Mobile app (React Native)
- [ ] Advanced AI features (predictive analytics)
- [ ] Tax optimization tools
- [ ] Cryptocurrency tracking
- [ ] International currency support

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- Supabase for backend services
- Tailwind CSS for styling
- React community for excellent tools and libraries