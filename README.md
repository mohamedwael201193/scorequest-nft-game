# 🎮 ScoreQuest NFT - Web3 Leaderboard Game

A cyberpunk-themed Web3 game where players compete for high scores and mint NFT rewards on the Monad Testnet.

![ScoreQuest NFT](https://img.shields.io/badge/Web3-Game-purple) ![React](https://img.shields.io/badge/React-18-blue) ![Monad](https://img.shields.io/badge/Monad-Testnet-green)

## 🚀 Live Demo

**Frontend:** [Deploy to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/mohamedwael201193/scorequest-nft-game)

## ✨ Features

### 🎯 Game Mechanics
- **Target Clicking Game**: 30-second rounds with glowing cyberpunk targets
- **Combo System**: Hit targets quickly for up to 5x score multipliers
- **Real-time Scoring**: Live score updates with animations
- **Sound Effects**: Web Audio API-powered game sounds

### 🏆 Web3 Integration
- **MetaMask Connection**: Seamless wallet integration
- **Monad Testnet**: Built for the Monad blockchain
- **NFT Rewards**: Mint unique achievement NFTs for scores 20+
- **Custom NFT Art**: Dynamic SVG generation based on player performance

### 📊 Leaderboard System
- **Real-time Rankings**: Live leaderboard with player scores
- **Player Stats**: Track current and best scores
- **Rank Badges**: Visual achievement indicators
- **NFT Status**: Show which players have minted rewards

### 🎨 Design & UX
- **Cyberpunk Theme**: Neon colors, glowing effects, and futuristic UI
- **GSAP Animations**: Smooth transitions and particle effects
- **Responsive Design**: Works on desktop and mobile
- **Social Sharing**: Share scores on Twitter/X

## 🛠 Tech Stack

### Frontend
- **React 18** + **Vite** - Modern React development
- **Tailwind CSS** + **shadcn/ui** - Styling and components
- **GSAP** - Advanced animations and effects
- **ethers.js** - Ethereum/Monad blockchain interaction
- **Web Audio API** - Game sound effects

### Backend
- **Flask** - Python web framework
- **SQLite** - Lightweight database
- **Flask-CORS** - Cross-origin resource sharing

### Blockchain
- **Monad Testnet** - Layer 1 blockchain
- **Custom NFT Contract** - ERC-721 compatible
- **MetaMask** - Wallet connection

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- Python 3.11+ (for backend)
- MetaMask browser extension
- Monad Testnet setup

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/mohamedwael201193/scorequest-nft-game.git
cd scorequest-nft-game

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python src/main.py
```

## 📦 Deployment

### Deploy to Netlify (Recommended)

1. **Fork this repository** to your GitHub account

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" -> "Import an existing project"
   - Connect your GitHub account and select your forked repository

3. **Configure Build Settings:**
   - **Branch to deploy:** `master` (or your main branch)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

4. **Deploy:**
   - Click "Deploy site"
   - Your app will be live at `https://your-site-name.netlify.app`

### Deploy Backend (Optional)

For full functionality, deploy the Flask backend to:
- **Railway** - Easy Python deployment
- **Heroku** - Classic platform
- **DigitalOcean App Platform** - Simple and scalable

Update the API base URL in `src/services/api.js` to point to your deployed backend.

## 🎮 How to Play

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Start Game**: Click "Start Game" to begin a 30-second round
3. **Hit Targets**: Click on glowing pink targets as they appear
4. **Build Combos**: Hit targets quickly for score multipliers
5. **Reach 20 Points**: Unlock NFT minting capability
6. **Mint NFT**: Click "Mint NFT Reward" to claim your achievement
7. **Share Score**: Use the share button to post on social media

## 🔧 Configuration

### Monad Testnet Setup

Add Monad Testnet to MetaMask:
- **Network Name**: Monad Testnet
- **RPC URL**: `https://testnet-rpc.monad.xyz`
- **Chain ID**: `666`
- **Currency Symbol**: `MON`
- **Block Explorer**: `https://testnet-explorer.monad.xyz`

### NFT Contract

The game uses a deployed NFT contract on Monad Testnet:
- **Contract Address**: `0x16FAb074954D2eE5A5Dbc4Be8781638612C57250`
- **Network**: Monad Testnet (Chain ID: 666)

## 🎨 NFT Rewards

Players can mint unique NFT rewards based on their performance:

### Rarity Tiers
- **Common** (20+ points): Rising Star
- **Uncommon** (30+ points): Skilled Gamer  
- **Rare** (50+ points): Expert Player
- **Epic** (100+ points): Legendary Master

### NFT Features
- **Dynamic Artwork**: SVG generated based on score
- **Rich Metadata**: Score, rank, rarity, and achievement date
- **Unique Colors**: Different color schemes for each tier
- **On-chain Storage**: Metadata stored directly on blockchain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monad Labs** - For the innovative blockchain platform
- **React Team** - For the amazing frontend framework
- **GSAP** - For powerful animation capabilities
- **shadcn/ui** - For beautiful UI components

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/mohamedwael201193/scorequest-nft-game/issues)
- **Twitter**: Share your high scores with #ScoreQuest

---

**Built with ❤️ for the Web3 gaming community**

