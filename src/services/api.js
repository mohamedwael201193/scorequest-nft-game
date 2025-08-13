import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Leaderboard API functions
export const leaderboardAPI = {
  // Get the current leaderboard
  getLeaderboard: async () => {
    try {
      const response = await api.get('/leaderboard')
      return response.data
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      throw error
    }
  },

  // Submit a new score
  submitScore: async (walletAddress, score) => {
    try {
      const response = await api.post('/leaderboard/submit', {
        wallet_address: walletAddress,
        score: score
      })
      return response.data
    } catch (error) {
      console.error('Error submitting score:', error)
      throw error
    }
  },

  // Mark NFT as minted
  markNFTMinted: async (walletAddress) => {
    try {
      const response = await api.post('/leaderboard/nft-minted', {
        wallet_address: walletAddress
      })
      return response.data
    } catch (error) {
      console.error('Error marking NFT as minted:', error)
      throw error
    }
  },

  // Get player stats
  getPlayerStats: async (walletAddress) => {
    try {
      const response = await api.get(`/leaderboard/player/${walletAddress}`)
      return response.data
    } catch (error) {
      console.error('Error fetching player stats:', error)
      throw error
    }
  }
}

export default api

