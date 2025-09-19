# Render Deployment Guide

## 🚀 Deploy JobX AI Platform to Render

### Prerequisites
- Render account
- GitHub repository with your code

### Deployment Steps

#### 1. Backend Deployment

1. **Create New Web Service** on Render
2. **Connect Repository** to your GitHub repo
3. **Configure Settings:**
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Python Version**: 3.11

#### 2. Environment Variables

Add these environment variables in Render dashboard:

```bash
# Redis (if using external Redis)
REDIS_URL=redis://your-redis-url:6379

# Ollama (if using external Ollama)
OLLAMA_HOST=your-ollama-host

# Optional: VibeVoice API Key
VIBEVOICE_API_KEY=your-vibevoice-key
```

#### 3. Frontend Deployment

1. **Create New Static Site** on Render
2. **Connect Repository** to your GitHub repo
3. **Configure Settings:**
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

#### 4. Environment Variables for Frontend

```bash
# Backend URL
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

### 🎯 Render Configuration

#### Backend Service Settings:
- **Instance Type**: Starter (Free) or Standard ($7/month)
- **Auto-Deploy**: Yes
- **Health Check**: `/api/v1/health`

#### Frontend Static Site Settings:
- **Framework**: React
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`

### 🔧 Custom Domain (Optional)

1. **Add Custom Domain** in Render dashboard
2. **Configure DNS** to point to Render
3. **Update Environment Variables** with new domain

### 📊 Monitoring

- **Health Checks**: Automatic health monitoring
- **Logs**: View real-time logs in Render dashboard
- **Metrics**: Monitor performance and usage

### 💰 Cost Estimation

- **Backend**: Free (Starter) or $7/month (Standard)
- **Frontend**: Free (Static Site)
- **Total**: $0-7/month (vs $500+/month for competitors)

### 🚨 Troubleshooting

#### Common Issues:

1. **Build Fails**: Check Python version (3.11+)
2. **Import Errors**: Verify file structure
3. **Health Check Fails**: Check `/api/v1/health` endpoint
4. **CORS Issues**: Update CORS settings in backend

#### Debug Commands:

```bash
# Check if app starts locally
cd backend
python -c "from app import app; print('App loaded successfully')"

# Test health endpoint
curl https://your-backend-url.onrender.com/api/v1/health
```

### 🎉 Success!

Once deployed, your JobX AI platform will be available at:
- **Frontend**: `https://your-frontend-url.onrender.com`
- **Backend**: `https://your-backend-url.onrender.com`
- **API Docs**: `https://your-backend-url.onrender.com/docs`

**Zero ongoing costs with professional-grade AI interview platform!** 🚀
