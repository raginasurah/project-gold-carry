# Deployment Guide

## Render Backend Deployment Fix

### Issue: "Could not open requirements file: [Errno 2] No such file or directory: 'requirements.txt'"

### Solution Steps:

1. **Use the render.yaml file (Recommended)**
   - In Render dashboard, when creating a new service, choose "Use render.yaml"
   - Upload your repository or connect GitHub
   - Render will automatically use the `render.yaml` configuration

2. **Manual Configuration (Alternative)**
   If not using render.yaml, configure manually:
   - **Name:** `project-gold-backend`
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory:** `backend` (This is crucial!)

3. **Environment Variables**
   Add these in Render dashboard:
   ```
   OPENAI_API_KEY=your_openai_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret
   ```

### File Structure Verification
Ensure your repository has this structure:
```
project-root/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── runtime.txt
│   └── Procfile
├── frontend/
├── database/
├── render.yaml
└── README.md
```

### Common Issues & Solutions:

1. **"requirements.txt not found"**
   - Make sure Root Directory is set to `backend`
   - Verify requirements.txt exists in backend folder

2. **"Module not found"**
   - Check that all dependencies are in requirements.txt
   - Ensure Python version compatibility

3. **"Port binding error"**
   - Use `$PORT` environment variable in start command
   - Ensure uvicorn is configured correctly

### Testing Deployment:
Once deployed, test your API at:
`https://your-app-name.onrender.com/`

You should see: `{"message": "AI Finance API is running"}`

### Next Steps:
1. Deploy backend to Render
2. Update frontend API URLs
3. Deploy frontend to Vercel
4. Configure Supabase 