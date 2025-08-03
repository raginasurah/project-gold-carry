@echo off
echo Setting up environment variables for AI Finance Manager...
echo.

echo Creating backend .env file...
(
echo # Backend Configuration
echo OPENAI_API_KEY=your-openai-api-key-here
echo.
echo # Supabase Configuration ^(to be filled later^)
echo SUPABASE_URL=https://your-project.supabase.co
echo SUPABASE_KEY=your-supabase-service-key
echo SUPABASE_ANON_KEY=your-supabase-anon-key
echo.
echo # CORS Configuration
echo CORS_ORIGINS=http://localhost:3000,http://localhost:80
echo.
echo # Security
echo JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
echo JWT_ALGORITHM=HS256
echo JWT_EXPIRATION_HOURS=24
echo.
echo # Rate Limiting
echo RATE_LIMIT_REQUESTS=60
echo RATE_LIMIT_PERIOD=60
echo.
echo # Redis Configuration
echo REDIS_URL=redis://localhost:6379
echo.
echo # Application Settings
echo DEBUG=true
echo APP_NAME="AI Finance Manager"
echo APP_VERSION=1.0.0
echo.
echo # Database ^(if not using Supabase^)
echo DATABASE_URL=postgresql://user:password@localhost/dbname
echo.
echo # Monitoring ^(Optional^)
echo SENTRY_DSN=
echo.
echo # Email ^(Optional^)
echo SMTP_HOST=smtp.gmail.com
echo SMTP_PORT=587
echo SMTP_USER=your-email@gmail.com
echo SMTP_PASSWORD=your-app-password
) > backend\.env

echo Creating frontend .env.local file...
(
echo # Frontend Configuration
echo REACT_APP_API_URL=http://localhost:8000
echo REACT_APP_SUPABASE_URL=https://your-project.supabase.co
echo REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
) > frontend\.env.local

echo.
echo Environment files created successfully!
echo.
echo Next steps:
echo 1. Set up your Supabase project and update the SUPABASE_* variables
echo 2. Change the JWT_SECRET_KEY to a secure random string
echo 3. Run 'npm install' in the frontend directory
echo 4. Run 'pip install -r requirements.txt' in the backend directory
echo 5. Start the backend with 'python main.py'
echo 6. Start the frontend with 'npm start'
echo.
pause 