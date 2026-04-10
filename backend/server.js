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
// For production (Render): restrict to Vercel frontend domain
// const corsOptions = {
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true,
// };
// app.use(cors(corsOptions));

// Currently allowing all origins - UPDATE THIS FOR PRODUCTION
app.use(cors());

// Serve static files from the React app (works both before/after monorepo split)
const distCandidates = [
  path.join(__dirname, 'frontend/dist'),          
  path.join(__dirname, '../frontend/dist')         
];
const distPath = distCandidates.find(p => fs.existsSync(p)) || distCandidates[0];
app.use(express.static(distPath));

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
    const indexCandidates = [
      path.join(__dirname, 'frontend/dist', 'index.html'),
      path.join(__dirname, '../frontend/dist', 'index.html')
    ];
    const indexPath = indexCandidates.find(p => fs.existsSync(p)) || indexCandidates[0];
    res.sendFile(indexPath);
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

