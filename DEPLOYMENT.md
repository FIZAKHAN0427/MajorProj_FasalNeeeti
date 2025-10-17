# Deployment Guide

## 🚀 Production Deployment Options

### Frontend Deployment

#### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

#### Option 2: Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### Backend Deployment

#### Option 1: Railway
1. Connect GitHub repo to Railway
2. Set environment variables:
   - `MONGODB_URI`
   - `OPENWEATHER_API_KEY`
   - `JWT_SECRET`

#### Option 2: Render
1. Connect GitHub repo to Render
2. Set build command: `npm install`
3. Set start command: `npm start`

#### Option 3: AWS/Heroku
```bash
# Heroku
heroku create fasalneeti-api
heroku config:set MONGODB_URI=your_uri
heroku config:set OPENWEATHER_API_KEY=your_key
git push heroku main
```

### Database

#### MongoDB Atlas (Recommended)
1. Create cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Whitelist deployment server IPs
3. Update connection string in environment variables

### Environment Variables for Production

```env
# Backend (.env)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fasalneeti
OPENWEATHER_API_KEY=your_openweather_key
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=production
PORT=5000

# Frontend (update API_BASE_URL in services)
REACT_APP_API_URL=https://your-backend-url.com/api
```

### SSL/HTTPS Setup

Most platforms (Vercel, Netlify, Railway) provide automatic HTTPS.

### Performance Optimizations

1. **Frontend:**
   - Code splitting
   - Image optimization
   - Bundle analysis

2. **Backend:**
   - Database indexing
   - API rate limiting
   - Caching strategies

### Monitoring

- Use MongoDB Atlas monitoring
- Set up error tracking (Sentry)
- Monitor API performance