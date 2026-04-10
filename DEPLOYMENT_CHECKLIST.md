# Deployment Preparation Checklist

## ✅ COMPLETED - Code Changes

- [x] Backend: Added dynamic PORT handling comments and deployment notes
- [x] Frontend: Updated API service to use `VITE_API_URL` environment variable
- [x] Frontend: Vite config updated with deployment notes
- [x] Backend: CORS configuration prepared for production
- [x] Created `backend/.env.example` with all required variables
- [x] Created `frontend/.env.example` with production setup instructions
- [x] Created `DEPLOYMENT_GUIDE.md` with step-by-step instructions

---

## 📋 NEXT STEPS - What YOU Need to Do

### 1. MongoDB Atlas Setup (5 minutes)

- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Create free account
- [ ] Create M0 cluster
- [ ] Get connection string
- [ ] Copy `MONGO_URI` value

### 2. Render Deployment (15 minutes)

- [ ] Create account at https://render.com
- [ ] Connect GitHub repository
- [ ] Create new Web Service
- [ ] Configure: Node.js, main branch, `npm install`, `node backend/server.js`
- [ ] Add all environment variables from `backend/.env.example`
- [ ] Deploy and copy backend URL (e.g., `https://volunteer-backend.onrender.com`)

### 3. Vercel Deployment (10 minutes)

- [ ] Create account at https://vercel.com
- [ ] Connect GitHub repository
- [ ] Set Root Directory to `frontend`
- [ ] Add environment variable: `VITE_API_URL=<your-render-backend-url>`
- [ ] Deploy and get frontend URL

### 4. Configure CORS (5 minutes)

- [ ] CORS is already configured in `backend/server.js` to support multiple origins
- [ ] Add `FRONTEND_URL` to Render environment variables (your Vercel URL)
- [ ] For multiple domains: `FRONTEND_URL=https://app1.vercel.app,https://app2.vercel.app`
- [ ] Redeploy backend on Render

### 5. Email Setup (5 minutes)

- [ ] Generate Gmail App Password OR use SendGrid/Mailgun/Brevo
- [ ] Add SMTP variables to Render environment

### 6. Testing (5 minutes)

- [ ] Test backend API direct access
- [ ] Test frontend login/signup
- [ ] Check browser console for errors
- [ ] Check Render & Vercel logs

---

## 📁 Important Files Modified

1. `backend/server.js` - Added CORS configuration & deployment notes
2. `frontend/src/services/api.js` - Updated to use env variable for API URL
3. `frontend/vite.config.ts` - Added deployment notes
4. `backend/.env.example` - NEW - Environment variable reference
5. `frontend/.env.example` - NEW - Environment variable reference
6. `DEPLOYMENT_GUIDE.md` - NEW - Complete deployment instructions

---

## 🔧 Environment Variables Reference

### Backend (Render)

```
MONGO_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<long-random-string>
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASSWORD=<app-specific-password>
SMTP_FROM=noreply@volunteersystem.com
FRONTEND_URL=<your-vercel-url>
```

### Frontend (Vercel)

```
VITE_API_URL=<your-render-backend-url>
```

---

## 🎯 Time Estimate

- Total setup time: **~45 minutes** (including account creation)
- Most time is spent waiting for builds

---

## ⚠️ Local Development Still Works

Nothing changed for local development - `npm run dev` works exactly as before!

---

## 💡 Tips

- Save all URLs after deployment
- Check logs immediately if something breaks
- Free tier databases/servers may be slow initially
- Remember to add `FRONTEND_URL` to backend CORS after getting Vercel URL
