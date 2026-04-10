# Deployment Guide: Vercel (Frontend) + Render (Backend)

## ✅ PREPARATION COMPLETED

Your project has been configured for separate deployments:

### Changes Made:

1. **Backend (backend/server.js)**
   - ✅ PORT handling already configured: `process.env.PORT || 5000`
   - ✅ CORS configuration prepared with comments for production setup
   - ✅ Added deployment notes

2. **Frontend (frontend/src/services/api.js)**
   - ✅ Updated to use `VITE_API_URL` environment variable
   - ✅ Falls back to `/api` for local development
   - ✅ Comments added for production usage

3. **Frontend Config (frontend/vite.config.ts)**
   - ✅ Added deployment notes about environment variables

4. **Environment Files**
   - ✅ `backend/.env.example` - Reference for backend environment variables
   - ✅ `frontend/.env.example` - Reference for frontend environment variables

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### STEP 1: PREPARE MONGODB (REQUIRED)

**Current Issue**: Using localhost MongoDB won't work in production.

**Solution**: Use MongoDB Atlas (free cloud database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new cluster (M0 - Free tier)
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/volunteer-system?retryWrites=true&w=majority`
5. Save this - you'll need it for Render

---

### STEP 2: DEPLOY BACKEND TO RENDER

1. **Create Render Account**
   - Go to https://render.com
   - Sign up (use GitHub recommended)

2. **Create New Service**
   - Click "New Web Service"
   - Connect your GitHub repository
   - Select `volunteer-system-main` repo

3. **Configure Service**
   - **Name**: `volunteer-backend` (or your choice)
   - **Environment**: Node.js
   - **Region**: Choose closest to your users
   - **Branch**: main (or your deploy branch)
   - **Build Command**: `npm install`
   - **Start Command**: `node backend/server.js`
   - **Plan**: Free (sufficient for testing)

4. **Add Environment Variables** (in Render Dashboard → Environment)

   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/volunteer-system?retryWrites=true&w=majority
   JWT_SECRET=your_long_random_secret_key_here
   NODE_ENV=production
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_specific_password
   SMTP_FROM=noreply@volunteersystem.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Get your backend URL: `https://volunteer-backend.onrender.com` (example)
   - Save this URL for frontend configuration

---

### STEP 3: DEPLOY FRONTEND TO VERCEL

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up (use GitHub recommended)

2. **Import Project**
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Vercel will auto-detect it's a Vite project

3. **Configure Project**
   - **Project Name**: volunteer-system-frontend
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (IMPORTANT!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables** (in Vercel Dashboard → Settings → Environment Variables)

   ```
   Variable Name: VITE_API_URL
   Value: https://volunteer-backend.onrender.com (use your Render URL from Step 2)
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Vercel will give you your frontend URL: `https://volunteer-system-frontend.vercel.app` (example)

---

### STEP 4: CONFIGURE CORS (IMPORTANT!)

Update backend CORS to only allow your Vercel domain:

1. CORS is now configured in `backend/server.js` to support multiple origins
2. In Render Dashboard, add environment variable:

   ```
   FRONTEND_URL=https://volunteer-system-frontend.vercel.app
   ```

   **For multiple domains** (staging, production, etc.):

   ```
   FRONTEND_URL=https://staging-app.vercel.app,https://production-app.vercel.app
   ```

3. Redeploy backend

---

### STEP 5: UPDATE EMAIL CONFIGURATION

For nodemailer in production:

1. **Gmail Setup** (recommended)
   - Enable 2-factor authentication on your Gmail
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Use App Password in `SMTP_PASSWORD`

   Alternative: Use services like SendGrid, Mailgun, or Brevo (free tier available)

---

## 🔍 TESTING AFTER DEPLOYMENT

1. **Test Backend Health**

   ```
   curl https://volunteer-recommendation-system.onrender.com/api/health
   ```

   Should return JSON with server status and database connection state

2. **Test API Endpoints**

   ```
   curl -X POST https://volunteer-recommendation-system.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"test"}'
   ```

   Should return proper JSON response (even if login fails)

3. **Check Logs**
   - **Render**: Dashboard → Logs
   - Look for "MongoDB connected successfully" or connection errors

---

## 🐛 COMMON ISSUES & SOLUTIONS

### API returns 404 or HTML instead of JSON

- ✅ Check `/api/health` endpoint first to verify server is running
- ✅ Check Render logs for database connection errors
- ✅ Verify `MONGO_URI` is correct in Render environment variables
- ✅ Server continues running even if DB connection fails (won't crash anymore)

### Frontend shows "Failed to connect to API"

- ✅ Check `VITE_API_URL` is set correctly in Vercel
- ✅ Verify backend URL is accessible (not in "suspended" state on Render)
- ✅ Check CORS settings in backend

### Cold starts (first request is slow)

- Normal on free tier of both services (services spin down after inactivity)
- Upgrade to paid plans to prevent this

### Build fails on Vercel

- ✅ Check "Root Directory" is set to `frontend`
- ✅ Verify `package.json` in frontend has proper build script
- ✅ Check build logs for specific errors

### Build fails on Render

- ✅ Verify `backend/server.js` exists
- ✅ Check all environment variables are set
- ✅ Ensure MongoDB URI is correct

---

## 📝 LOCAL DEVELOPMENT (UNCHANGED)

```bash
npm install              # Install all dependencies
npm run dev             # Runs both backend and frontend concurrently
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

---

## ✨ WHAT'S READY

- ✅ Backend can handle dynamic PORT from Render
- ✅ Frontend correctly configured to use backend URL from environment
- ✅ CORS configuration prepared for production
- ✅ Environment variable examples provided
- ✅ Comments added for future production adjustments

**Next Action**: Create accounts on Render and Vercel, then follow steps 2-3 above!
