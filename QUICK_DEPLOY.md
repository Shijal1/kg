# Quick Deployment Commands

## One-Command Deployment (using Vercel CLI)

### Prerequisites
- Vercel CLI installed (you have it ✅)
- MongoDB Atlas connection string
- JWT secret

### Terminal Commands

```powershell
# Navigate to your project
cd "c:\Users\Lenovo\Desktop\kasthamandap-ghar\kasthamandap-ghar"

# 1. Deploy Frontend to Vercel (easiest if connected to GitHub)
vercel --prod

# 2. For Backend on Render (requires Render account)
# Go to https://dashboard.render.com and use the web UI
# OR follow the render.yaml configuration
```

## If You Need to Set Environment Variables via CLI

```powershell
# For Render (backend):
# Set these in Render dashboard under Environment variables

# For Vercel (frontend):
vercel env add VITE_API_URL
# Then enter your Render backend URL when prompted

# Redeploy after adding env vars:
vercel --prod
```

## Check Deployment Status

```powershell
# View deployed projects
vercel list

# View logs
vercel logs [deployment-url]
```
