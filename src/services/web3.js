import { ethers } from 'ethers'

// Monad Testnet configuration
const MONAD_TESTNET_CONFIG = {
  chainId: '0x27A7', // 10143 in hex
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'Monad Token',
    symbol: 'tMON', // Changed from MON to avoid MetaMask warning
    decimals: 18,
  },
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  blockExplorerUrls: ['https://testnet.monadexplorer.com'],
}

// NFT Contract configuration
const NFT_CONTRACT_ADDRESS = '0x16FAb074954D2eE5A5Dbc4Be8781638612C57250'

// Basic NFT contract ABI (you'll need to replace this with the actual ABI)
const NFT_CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "player", "type": "address"},
      {"internalType": "uint256", "name": "score", "type": "uint256"},
      {"internalType": "string", "name": "tokenURI", "type": "string"}
    ],
    "name": "mintNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
]

class Web3Service {
  constructor() {
    this.provider = null
    this.signer = null
    this.contract = null
    this.account = null
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
  }

  // Add Monad Testnet to MetaMask
  async addMonadTestnet() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed')
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [MONAD_TESTNET_CONFIG],
      })
    } catch (error) {
      console.error('Failed to add Monad Testnet:', error)
      throw error
    }
  }

  // Switch to Monad Testnet
  async switchToMonadTestnet() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed')
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET_CONFIG.chainId }],
      })
    } catch (error) {
      // If the chain hasn't been added to MetaMask, add it
      if (error.code === 4902) {
        await this.addMonadTestnet()
      } else {
        console.error('Failed to switch to Monad Testnet:', error)
        throw error
      }
    }
  }

  // Connect to MetaMask
  async connectWallet() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.')
    }

    try {
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' })

      // If not on Monad Testnet, try to switch
      if (currentChainId !== MONAD_TESTNET_CONFIG.chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: MONAD_TESTNET_CONFIG.chainId }],
          })
        } catch (switchError) {
          // If the chain is not added, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [MONAD_TESTNET_CONFIG],
            })
          } else {
            throw switchError
          }
        }
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      // Set up provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()
      this.account = accounts[0]

      // Initialize contract
      this.contract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        this.signer
      )

      console.log(`Connected wallet: ${this.account}`)
      
      return {
        account: this.account,
        chainId: await this.provider.getNetwork().then(n => n.chainId),
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  // Disconnect wallet
  disconnect() {
    this.provider = null
    this.signer = null
    this.contract = null
    this.account = null
  }

  // Get current account
  getCurrentAccount() {
    return this.account
  }

  // Check if wallet is connected
  isConnected() {
    return this.account !== null
  }

  // Mint NFT
  async mintNFT(score) {
    if (!this.isConnected()) {
      throw new Error('Wallet not connected')
    }

    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      // Generate custom NFT metadata based on score
      const getRankTitle = (playerScore) => {
        if (playerScore >= 100) return 'Legendary Master'
        if (playerScore >= 50) return 'Expert Player'
        if (playerScore >= 30) return 'Skilled Gamer'
        if (playerScore >= 20) return 'Rising Star'
        return 'Achievement Unlocked'
      }

      const getRankColor = (playerScore) => {
        if (playerScore >= 100) return '#8B5CF6' // Purple
        if (playerScore >= 50) return '#10B981' // Green
        if (playerScore >= 30) return '#3B82F6' // Blue
        if (playerScore >= 20) return '#06B6D4' // Cyan
        return '#F59E0B' // Yellow
      }

      const getRarity = (playerScore) => {
        if (playerScore >= 100) return 'Legendary'
        if (playerScore >= 50) return 'Epic'
        if (playerScore >= 30) return 'Rare'
        if (playerScore >= 20) return 'Uncommon'
        return 'Common'
      }

      const rankTitle = getRankTitle(score)
      const rankColor = getRankColor(score)
      const rarity = getRarity(score)

      // Create dynamic SVG image
      const svgImage = `data:image/svg+xml;base64,${btoa(`
        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#0a0a0f;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${rankColor};stop-opacity:1" />
              <stop offset="100%" style="stop-color:#ff0080;stop-opacity:1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <!-- Background -->
          <rect width="400" height="400" fill="url(#bg)"/>
          
          <!-- Border -->
          <rect x="10" y="10" width="380" height="380" fill="none" stroke="url(#accent)" stroke-width="2" filter="url(#glow)"/>
          
          <!-- Title -->
          <text x="200" y="80" text-anchor="middle" fill="url(#accent)" font-family="Arial, sans-serif" font-size="24" font-weight="bold" filter="url(#glow)">
            ScoreQuest NFT
          </text>
          
          <!-- Score Circle -->
          <circle cx="200" cy="180" r="60" fill="none" stroke="url(#accent)" stroke-width="4" filter="url(#glow)"/>
          <text x="200" y="190" text-anchor="middle" fill="${rankColor}" font-family="Arial, sans-serif" font-size="36" font-weight="bold">
            ${score}
          </text>
          
          <!-- Rank Title -->
          <text x="200" y="280" text-anchor="middle" fill="#00d4ff" font-family="Arial, sans-serif" font-size="18" font-weight="bold">
            ${rankTitle}
          </text>
          
          <!-- Rarity -->
          <text x="200" y="320" text-anchor="middle" fill="${rankColor}" font-family="Arial, sans-serif" font-size="14">
            ${rarity} Achievement
          </text>
          
          <!-- Date -->
          <text x="200" y="360" text-anchor="middle" fill="#94a3b8" font-family="Arial, sans-serif" font-size="12">
            ${new Date().toLocaleDateString()}
          </text>
        </svg>
      `)}`

      // Generate comprehensive token URI
      const tokenURI = `data:application/json,${encodeURIComponent(JSON.stringify({
        name: `ScoreQuest Achievement #${score}`,
        description: `A ${rarity} achievement NFT earned by scoring ${score} points in ScoreQuest, the Web3 leaderboard game on Monad Testnet. This NFT represents the player's skill level as a ${rankTitle}.`,
        image: svgImage,
        external_url: "https://scorequest.game",
        attributes: [
          {
            trait_type: "Score",
            value: score,
            display_type: "number"
          },
          {
            trait_type: "Rank Title",
            value: rankTitle
          },
          {
            trait_type: "Rarity",
            value: rarity
          },
          {
            trait_type: "Game",
            value: "ScoreQuest"
          },
          {
            trait_type: "Network",
            value: "Monad Testnet"
          },
          {
            trait_type: "Achievement Date",
            value: new Date().toISOString().split('T')[0]
          },
          {
            trait_type: "Player Address",
            value: this.account
          }
        ],
        properties: {
          category: "Gaming Achievement",
          creator: "ScoreQuest Team",
          difficulty: rarity.toLowerCase()
        }
      }))}`

      // Call the mintNFT function
      const tx = await this.contract.mintNFT(this.account, score, tokenURI)
      
      console.log('Transaction sent:', tx.hash)
      
      // Wait for transaction confirmation
      const receipt = await tx.wait()
      
      console.log('Transaction confirmed:', receipt)
      
      return {
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        tokenURI: tokenURI,
        metadata: {
          rankTitle,
          rarity,
          score
        }
      }
    } catch (error) {
      console.error('Failed to mint NFT:', error)
      throw error
    }
  }

  // Check if user has NFTs
  async getNFTBalance() {
    if (!this.isConnected()) {
      throw new Error('Wallet not connected')
    }

    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      const balance = await this.contract.balanceOf(this.account)
      return Number(balance)
    } catch (error) {
      console.error('Failed to get NFT balance:', error)
      throw error
    }
  }

  // Listen for account changes
  onAccountsChanged(callback) {
    if (this.isMetaMaskInstalled()) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          this.disconnect()
        } else {
          this.account = accounts[0]
        }
        callback(accounts)
      })
    }
  }

  // Listen for chain changes
  onChainChanged(callback) {
    if (this.isMetaMaskInstalled()) {
      window.ethereum.on('chainChanged', (chainId) => {
        callback(chainId)
      })
    }
  }
}

// Create and export a singleton instance
const web3Service = new Web3Service()
export default web3Service

