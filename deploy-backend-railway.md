# 🚀 Deploy Backend to Railway

## Quick Setup Guide

### Step 1: Create Railway Project

1. **Go to Railway**: [https://railway.app/dashboard](https://railway.app/dashboard)
2. **Click "New Project"**
3. **Choose "Deploy from GitHub repo"**
4. **Select your repository** (or create a new one)

### Step 2: Configure Backend

1. **Set the root directory** to `backend/`
2. **Set the build command** to: `pip install -r requirements-minimal.txt`
3. **Set the start command** to: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 3: Add Environment Variables

In Railway project settings, add:

```
OPENAI_API_KEY=your-openai-api-key-here
CORS_ORIGINS=http://localhost:3000,https://project-gold-carry-izdy.vercel.app
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
DEBUG=false
```

### Step 4: Deploy

1. **Railway will automatically deploy** your backend
2. **Get the deployment URL** from the "Domains" section
3. **Test the backend**: Visit `https://your-backend-url.up.railway.app/health`

### Step 5: Update Frontend

Once you have your backend URL, update your Vercel environment variables:

```
REACT_APP_API_URL=https://your-backend-url.up.railway.app
```

## Alternative: Manual Deployment

If you prefer to deploy manually:

```bash
# Login to Railway
railway login

# Link to your project
railway link

# Deploy
railway up
```

## Troubleshooting

- **Backend not starting?** Check the logs in Railway dashboard
- **Environment variables not working?** Make sure they're set in Railway project settings
- **CORS errors?** Add your Vercel domain to CORS_ORIGINS

## Your Backend URL Format

Your backend will be available at:
`https://[project-name]-[service-name]-[hash].up.railway.app`

Example: `https://project-gold-backend-production-3d89.up.railway.app` 