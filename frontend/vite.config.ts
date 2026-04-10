import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // DEPLOYMENT NOTE: When frontend is deployed to Vercel separately,
  // set VITE_API_URL environment variable in Vercel dashboard
  // to point to your Render backend URL (e.g., https://volunteer-backend.onrender.com)
});
