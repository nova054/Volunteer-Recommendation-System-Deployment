const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require ('./routes/authRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const tagRoutes = require('./routes/tagRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
dotenv.config();
require('dotenv').config({ path: path.join(__dirname, '.env') });// changed here
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// CORS Configuration
// For development: allow all origins
// For production (Render): restrict to Vercel frontend domain(s)
// Supports multiple URLs: FRONTEND_URL=https://app1.vercel.app,https://app2.vercel.app
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Get allowed origins from environment variable (comma-separated)
    const allowedOrigins = process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
      : ['http://localhost:5173', 'http://localhost:5174','https://volunteer-recommendation-system-dun.vercel.app/']; // Default for development

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Serve static files from the React app (ONLY in local development when frontend exists)
const distCandidates = [
  path.join(__dirname, 'frontend/dist'),
  path.join(__dirname, '../frontend/dist')
];
const distPath = distCandidates.find(p => fs.existsSync(p));

// Only serve static files if frontend dist directory exists (local development)
if (distPath) {
  app.use(express.static(distPath));
}

app.use('/api/auth', authRoutes);

app.use('/api/opportunities', opportunityRoutes);

app.use('/api/tags', tagRoutes);

app.use('/api/user', userRoutes);

app.use('/api/contact', contactRoutes);

app.use('/api/admin', adminRoutes);

// DEPLOYMENT NOTE: When deploying separately to Render, static file serving below won't be used
// Frontend will be served separately from Vercel
app.use((req, res, next) => {
  if (
    req.method === 'GET' &&
    !req.path.startsWith('/api') &&
    !req.path.includes('.')
  ) {
    // In production (Render), redirect to frontend URL or return API-only message
    if (process.env.NODE_ENV === 'production') {
      return res.status(200).json({
        message: 'Volunteer System API',
        frontend: process.env.FRONTEND_URL || 'https://your-frontend-url.vercel.app',
        docs: '/api/docs' // Add this if you have API docs
      });
    }

    // In development, serve the React app if it exists
    const indexCandidates = [
      path.join(__dirname, 'frontend/dist', 'index.html'),
      path.join(__dirname, '../frontend/dist', 'index.html')
    ];
    const indexPath = indexCandidates.find(p => fs.existsSync(p));
    if (indexPath) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ message: 'Frontend not built. Run npm run build in frontend directory.' });
    }
  } else {
    next();
  }
});

// PORT environment variable is set by Render (or use 5000 for local development)
// Render automatically assigns a PORT, so process.env.PORT is crucial for production
const port = process.env.PORT || 5000;

app.listen(port ,()=>{
    console.log(`Server running at http://localhost:${port}`);
});

