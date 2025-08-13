import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { leaderboardAPI } from './services/api.js'
import web3Service from './services/web3.js'
import AnimatedBackground from './components/AnimatedBackground.jsx'
import ScoreAnimation from './components/ScoreAnimation.jsx'
import GameEffects from './components/GameEffects.jsx'
import SoundManager from './components/SoundManager.jsx'
import ShareButton from './components/ShareButton.jsx'
import RankBadge from './components/RankBadge.jsx'
import './App.css'

function App() {
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [targets, setTargets] = useState([])
  const [combo, setCombo] = useState(0)
  const [lastHitTime, setLastHitTime] = useState(0)
  const [walletAddress, setWalletAddress] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [canMintNFT, setCanMintNFT] = useState(false)
  const [nftMinted, setNftMinted] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [connectionError, setConnectionError] = useState('')
  const gameAreaRef = useRef(null)
  const soundsRef = useRef(null)
  const [gameStarted, setGameStarted] = useState(false)

  // Real leaderboard data from backend
  const [leaderboard, setLeaderboard] = useState([])
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false)
  const [playerStats, setPlayerStats] = useState({
    currentScore: 0,
    bestScore: 0,
    nftStatus: 'Not Claimed'
  })

  // Load leaderboard from backend
  const loadLeaderboard = async () => {
    try {
      setIsLoadingLeaderboard(true)
      const data = await leaderboardAPI.getLeaderboard()
      setLeaderboard(data.leaderboard || [])
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setIsLoadingLeaderboard(false)
    }
  }

  // Load player stats
  const loadPlayerStats = async (address) => {
    try {
      const stats = await leaderboardAPI.getPlayerStats(address)
      setPlayerStats({
        currentScore: score,
        bestScore: stats.best_score || 0,
        nftStatus: stats.nft_minted ? 'Claimed ✅' : 'Not Claimed'
      })
      setNftMinted(stats.nft_minted || false)
    } catch (error) {
      console.error('Error loading player stats:', error)
      console.log('Player not found in leaderboard (new player)')
    }
  }

  // Submit score to backend
  const submitScore = async () => {
    if (!walletAddress || score === 0) return

    try {
      await leaderboardAPI.submitScore(walletAddress, score)
      await loadLeaderboard() // Refresh leaderboard
      await loadPlayerStats(walletAddress) // Refresh player stats
    } catch (error) {
      console.error('Failed to submit score:', error)
    }
  }

  // Load leaderboard on component mount
  useEffect(() => {
    loadLeaderboard()
  }, [])

  // Load player stats when wallet connects
  useEffect(() => {
    if (isConnected && walletAddress) {
      loadPlayerStats(walletAddress)
    }
  }, [isConnected, walletAddress])

  // Set up Web3 event listeners
  useEffect(() => {
    // Listen for account changes
    web3Service.onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        setIsConnected(false)
        setWalletAddress('')
        setNftMinted(false)
      } else {
        setWalletAddress(accounts[0])
      }
    })

    // Listen for chain changes
    web3Service.onChainChanged((chainId) => {
      console.log('Chain changed to:', chainId)
      // You might want to check if it's still Monad Testnet
    })

    return () => {
      // Cleanup if needed
    }
  }, [])

  // Start game
  const startGame = () => {
    setGameActive(true)
    setGameStarted(true)
    setScore(0)
    setCombo(0)
    setLastHitTime(0)
    setTimeLeft(30)
    setTargets([])
    
    // Play game start sound
    if (soundsRef.current && soundsRef.current.gameStart) {
      soundsRef.current.gameStart()
    }
  }

  // End game
  const endGame = async () => {
    setGameActive(false)
    setTargets([])
    setCombo(0)
    
    // Play game end sound
    if (soundsRef.current && soundsRef.current.gameEnd) {
      soundsRef.current.gameEnd()
    }
    
    // Submit score to backend if connected
    if (score > 0) {
      await submitScore()
    }
  }

  // Generate random target
  const generateTarget = () => {
    if (!gameActive || !gameAreaRef.current) return

    const gameArea = gameAreaRef.current
    const rect = gameArea.getBoundingClientRect()
    const targetSize = 50
    const maxX = rect.width - targetSize
    const maxY = rect.height - targetSize

    const newTarget = {
      id: Date.now() + Math.random(),
      x: Math.random() * maxX,
      y: Math.random() * maxY,
      createdAt: Date.now()
    }

    setTargets(prevTargets => [...prevTargets, newTarget])

    // Remove target after 2 seconds if not hit
    setTimeout(() => {
      setTargets(prevTargets => prevTargets.filter(t => t.id !== newTarget.id))
    }, 2000)
  }

  // Hit target function with enhanced effects
  const hitTarget = (targetId, event) => {
    const target = targets.find(t => t.id === targetId)
    if (!target) return

    const currentTime = Date.now()
    const timeSinceLastHit = currentTime - lastHitTime

    // Calculate combo
    let newCombo = combo
    if (timeSinceLastHit < 1000) { // Within 1 second for combo
      newCombo = combo + 1
    } else {
      newCombo = 1
    }
    setCombo(newCombo)
    setLastHitTime(currentTime)

    // Calculate score with combo multiplier
    const baseScore = 1
    const comboMultiplier = Math.min(newCombo, 5) // Max 5x multiplier
    const scoreGain = baseScore * comboMultiplier
    
    setScore(prevScore => prevScore + scoreGain)

    // Play hit sound
    if (soundsRef.current && soundsRef.current.hit) {
      soundsRef.current.hit()
    }

    // Play combo sound for streaks
    if (newCombo >= 2 && soundsRef.current && soundsRef.current.combo) {
      soundsRef.current.combo(newCombo)
    }

    // Play power-up sound for high scores
    if (score + scoreGain >= 20 && score < 20 && soundsRef.current && soundsRef.current.powerUp) {
      soundsRef.current.powerUp()
    }

    // Create hit effect at target position
    if (gameAreaRef.current && gameAreaRef.current.createHitEffect) {
      const rect = gameAreaRef.current.getBoundingClientRect()
      const x = target.x + 25 // Center of target (50px width / 2)
      const y = target.y + 25 // Center of target (50px height / 2)
      gameAreaRef.current.createHitEffect(x, y)
    }

    // Create combo effect for streaks
    if (newCombo >= 3 && gameAreaRef.current && gameAreaRef.current.createComboEffect) {
      gameAreaRef.current.createComboEffect(newCombo)
    }

    // Remove the hit target
    setTargets(prevTargets => prevTargets.filter(t => t.id !== targetId))

    // Add hit effect class to target element for visual feedback
    const targetElement = document.getElementById(`target-${targetId}`)
    if (targetElement) {
      targetElement.classList.add('hit-effect')
    }
  }

  // Connect wallet (real MetaMask integration)
  const connectWallet = async () => {
    setIsConnecting(true)
    setConnectionError('')
    
    try {
      if (!web3Service.isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.')
      }

      const result = await web3Service.connectWallet()
      setWalletAddress(result.account)
      setIsConnected(true)
      
      console.log('Connected to wallet:', result.account)
      console.log('Chain ID:', result.chainId)
      
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      setConnectionError(error.message)
    } finally {
      setIsConnecting(false)
    }
  }

  // Mint NFT (real contract interaction)
  const mintNFT = async () => {
    setIsMinting(true)
    
    try {
      if (!web3Service.isConnected()) {
        throw new Error('Wallet not connected')
      }

      if (score < 20) {
        throw new Error('Score must be at least 20 to mint NFT')
      }

      console.log('Minting NFT with score:', score)
      
      const result = await web3Service.mintNFT(score)
      
      console.log('NFT minted successfully:', result)
      
      setNftMinted(true)
      
      // Mark NFT as minted in backend
      if (walletAddress) {
        await leaderboardAPI.markNFTMinted(walletAddress)
        await loadLeaderboard() // Refresh leaderboard to show NFT status
      }
      
      alert(`NFT Minted Successfully! 🎉\nTransaction: ${result.transactionHash}`)
    } catch (error) {
      console.error('Error minting NFT:', error)
      alert(`Failed to mint NFT: ${error.message}`)
    } finally {
      setIsMinting(false)
    }
  }

  // Game timer
  useEffect(() => {
    let interval
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameActive, timeLeft])

  // Target generation
  useEffect(() => {
    let interval
    if (gameActive) {
      interval = setInterval(generateTarget, 800)
    }
    return () => clearInterval(interval)
  }, [gameActive])

  // Check NFT minting eligibility
  useEffect(() => {
    setCanMintNFT(score >= 20 && isConnected && !nftMinted)
  }, [score, isConnected, nftMinted])

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <AnimatedBackground />
      <SoundManager 
        gameActive={gameActive}
        score={score}
        combo={combo}
        onSoundLoad={(sounds) => { soundsRef.current = sounds }}
      />
      
      {/* Header */}
      <header className="border-b border-border p-4 relative z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold neon-text">ScoreQuest NFT</h1>
          <div className="flex items-center gap-4">
            {gameStarted && <ShareButton score={score} walletAddress={walletAddress} nftMinted={nftMinted} />}
            {isConnected ? (
              <Badge variant="outline" className="neon-glow">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </Badge>
            ) : (
              <div className="flex flex-col items-end gap-2">
                <Button 
                  onClick={connectWallet} 
                  className="glow-button"
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </Button>
                {connectionError && (
                  <p className="text-destructive text-sm max-w-xs text-right">
                    {connectionError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Game Area */}
        <div className="lg:col-span-2">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Game Area</span>
                <div className="flex items-center gap-4">
                  <ScoreAnimation score={score} />
                  <span className={`timer-display ${timeLeft <= 10 ? 'timer-warning' : ''} ${timeLeft <= 5 ? 'timer-critical' : ''}`}>
                    Time: {timeLeft}s
                  </span>
                  {combo > 1 && (
                    <Badge variant="outline" className="neon-glow">
                      {combo}x Combo!
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                {!gameActive ? (
                  <Button onClick={startGame} className="glow-button">
                    Start Game
                  </Button>
                ) : (
                  <Button onClick={endGame} className="glow-button">
                    End Game
                  </Button>
                )}
                
                {canMintNFT && (
                  <Button 
                    onClick={mintNFT} 
                    className="glow-button pulse-animation ml-4"
                    disabled={isMinting}
                  >
                    {isMinting ? 'Minting...' : 'Mint NFT Reward! 🏆'}
                  </Button>
                )}
              </div>

              {/* Game Area */}
              <div 
                ref={gameAreaRef}
                className="game-area relative w-full h-96 rounded-lg overflow-hidden"
              >
                <GameEffects gameAreaRef={gameAreaRef} />
                
                {gameActive && (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Click the glowing targets!
                  </div>
                )}

                {/* Targets */}
                {targets.map(target => (
                  <div
                    key={target.id}
                    id={`target-${target.id}`}
                    className="target-circle w-12 h-12"
                    style={{
                      left: `${target.x}px`,
                      top: `${target.y}px`
                    }}
                    onClick={(e) => hitTarget(target.id, e)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Player Stats */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle>Player Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Current Score:</span>
                <span className="text-primary font-bold">{playerStats.currentScore}</span>
              </div>
              <div className="flex justify-between">
                <span>Best Score:</span>
                <span className="text-primary font-bold">{playerStats.bestScore}</span>
              </div>
              <div className="flex justify-between">
                <span>NFT Status:</span>
                <span className={nftMinted ? 'text-green-400' : 'text-muted-foreground'}>
                  {playerStats.nftStatus}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingLeaderboard ? (
                <div className="flex items-center justify-center py-4">
                  <div className="loading-spinner"></div>
                  <span className="ml-2">Loading...</span>
                </div>
              ) : leaderboard.length > 0 ? (
                <div className="space-y-2">
                  {leaderboard.map((player, index) => (
                    <div key={player.address} className="leaderboard-item">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : ''}`}>
                            #{index + 1}
                          </span>
                          <span className="text-sm">
                            {player.address.slice(0, 6)}...{player.address.slice(-4)}
                          </span>
                          <RankBadge rank={index + 1} score={player.score} />
                          {player.nft_minted && (
                            <Badge variant="outline" className="text-xs">
                              NFT ✅
                            </Badge>
                          )}
                        </div>
                        <span className="font-bold text-primary">{player.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No players yet. Be the first!
                </p>
              )}
            </CardContent>
          </Card>

          {/* How to Play */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle>How to Play</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>1. Click "Start Game" to begin</p>
              <p>2. Click on the glowing targets as they appear</p>
              <p>3. Each target hit = 1 point</p>
              <p>4. Hit targets quickly for combo multipliers!</p>
              <p>5. Reach 20 points to unlock NFT minting</p>
              <p>6. Connect your wallet and mint your reward!</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default App

