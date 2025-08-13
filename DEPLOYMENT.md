# 🚀 ScoreQuest NFT - Deployment Guide

This guide covers deploying both the frontend and backend components of ScoreQuest NFT.

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Python 3.11+ (for backend)
- Git
- Vercel account (for frontend)
- Railway/Heroku account (for backend, optional)

## 🎯 Frontend Deployment (Vercel)

### Option 1: One-Click Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mohamedwael201193/scorequest-nft-game)

### Option 2: Manual Deployment

1. **Fork the Repository**
   ```bash
   # Clone your fork
   git clone https://github.com/YOUR_USERNAME/scorequest-nft-game.git
   cd scorequest-nft-game
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Build for Production**
   ```bash
   npm run build
   # or
   pnpm build
   ```

4. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect React and use optimal settings

### Build Configuration

The project includes optimized Vercel configuration:

```json
{
  "name": "scorequest-nft-game",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🔧 Backend Deployment (Optional)

The frontend works with a mock backend by default. For full functionality, deploy the Flask backend:

### Railway Deployment

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Navigate to backend directory
   cd backend
   
   # Deploy
   railway deploy
   ```

3. **Configure Environment**
   - Set Python version: `3.11`
   - Set start command: `python src/main.py`

### Heroku Deployment

1. **Create Heroku App**
   ```bash
   # Install Heroku CLI
   # Create app
   heroku create your-app-name
   
   # Navigate to backend
   cd backend
   
   # Create Procfile
   echo "web: python src/main.py" > Procfile
   
   # Deploy
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Update Frontend API URL

After deploying the backend, update the API URL in the frontend:

```javascript
// src/services/api.js
const API_BASE_URL = 'https://your-backend-url.railway.app'
// or
const API_BASE_URL = 'https://your-app.herokuapp.com'
```

## 🌐 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=https://your-backend-url.com
VITE_NFT_CONTRACT_ADDRESS=0x16FAb074954D2eE5A5Dbc4Be8781638612C57250
VITE_CHAIN_ID=666
```

### Backend (.env)
```env
FLASK_ENV=production
DATABASE_URL=sqlite:///leaderboard.db
CORS_ORIGINS=https://your-frontend-url.vercel.app
```

## 🔍 Testing Deployment

### Frontend Testing
1. Visit your Vercel URL
2. Test game functionality
3. Connect MetaMask to Monad Testnet
4. Play a game and check scoring
5. Test NFT minting (requires 20+ points)

### Backend Testing
```bash
# Test API endpoints
curl https://your-backend-url.com/api/leaderboard
curl -X POST https://your-backend-url.com/api/leaderboard/submit \
  -H "Content-Type: application/json" \
  -d '{"address":"0x123...","score":25}'
```

## 🐛 Troubleshooting

### Common Issues

**Build Errors:**
- Ensure Node.js 18+ is used
- Clear node_modules and reinstall
- Check for TypeScript errors

**MetaMask Connection:**
- Verify Monad Testnet configuration
- Check contract address is correct
- Ensure user has test tokens

**API Errors:**
- Verify backend URL is correct
- Check CORS configuration
- Ensure backend is running

### Performance Optimization

**Frontend:**
- Images are optimized
- Code splitting implemented
- Bundle size under 1MB

**Backend:**
- SQLite for lightweight database
- Efficient API endpoints
- CORS properly configured

## 📊 Monitoring

### Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor page views and performance
- Track user engagement

### Backend Monitoring
- Use Railway/Heroku logs
- Monitor API response times
- Track database performance

## 🔄 Updates and Maintenance

### Frontend Updates
```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel auto-deploys from main branch
```

### Backend Updates
```bash
# For Railway
railway deploy

# For Heroku
git push heroku main
```

## 🚀 Production Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed (optional)
- [ ] Environment variables configured
- [ ] MetaMask integration tested
- [ ] NFT minting verified
- [ ] Leaderboard functionality working
- [ ] Social sharing tested
- [ ] Mobile responsiveness verified
- [ ] Performance optimized
- [ ] Analytics enabled

## 📞 Support

If you encounter issues:
1. Check the [GitHub Issues](https://github.com/mohamedwael201193/scorequest-nft-game/issues)
2. Review the troubleshooting section
3. Create a new issue with detailed information

---

**Happy Deploying! 🎮**

