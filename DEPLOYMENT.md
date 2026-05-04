# Deployment Guide - Kasthamandap Ghar

## Deployment Architecture
- **Frontend (React + Vite)** → Vercel
- **Backend (Node.js + Express)** → Render
- **Database (MongoDB)** → MongoDB Atlas (Cloud)

---

## Step 1: Backend Deployment (Render)

### Option 1: Manual Deployment via Render Dashboard
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository (Shijal1/kg)
4. Configure:
   - **Name**: kasthamandap-ghar-backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: production
   - `FRONTEND_URL`: Your Vercel frontend URL (add after deploying frontend)
6. Click "Create Web Service"

### Option 2: Via Render.yaml (Automated)
The `render.yaml` file is already configured. Just add your environment variables in the Render dashboard.

### Get Backend URL
After deployment, you'll get a URL like: `https://kasthamandap-ghar-backend.onrender.com`
Save this for Step 3.

---

## Step 2: Frontend Deployment (Vercel)

### Prerequisites
- Vercel account linked with GitHub ✅ (You already did this!)

### Deploy via Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your GitHub repository: `Shijal1/kg`
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: ./frontend
5. Add Environment Variables:
   - `VITE_API_URL`: Your Render backend URL from Step 1
   - Example: `https://kasthamandap-ghar-backend.onrender.com`
6. Click "Deploy"

### Alternative: Deploy via CLI
```powershell
cd c:\Users\Lenovo\Desktop\kasthamandap-ghar\kasthamandap-ghar
vercel --prod
```

---

## Step 3: Final Configuration

### Update CORS in Backend (if needed)
Edit `backend/server.js` and add your Vercel frontend URL to the `allowedOrigins` array if not already there.

### Environment Variables Summary
**Backend (.env on Render)**:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Frontend (.env on Vercel)**:
```
VITE_API_URL=https://your-render-backend.onrender.com
```

---

## Health Check
1. Open your Vercel frontend URL
2. Check browser console for any API errors
3. Test login/authentication endpoints
4. Visit `https://your-render-backend.onrender.com/api/health` to verify backend is running

---

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` is set correctly on Render
- Verify frontend URL is in the `allowedOrigins` array in `server.js`

### MongoDB Connection Issues
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas firewall allows Render IP

### API Calls Failing
- Make sure `VITE_API_URL` is set in Vercel environment
- Check that backend API routes are correct

### Build Failures
- Check Render/Vercel build logs in dashboard
- Ensure all dependencies are installed (`npm install`)

---

## Useful Links
- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
