import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Share2, Twitter, Copy, Check } from 'lucide-react'

const ShareButton = ({ score, walletAddress, nftMinted }) => {
  const [copied, setCopied] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  // Generate share text
  const generateShareText = () => {
    const baseText = `🎮 Just scored ${score} points in ScoreQuest NFT!`
    const nftText = nftMinted ? ' 🏆 And minted my achievement NFT!' : ''
    const gameText = ' 🚀 A Web3 leaderboard game on Monad Testnet.'
    const hashtags = ' #ScoreQuest #Web3Gaming #NFT #Monad'
    
    return baseText + nftText + gameText + hashtags
  }

  // Share to Twitter/X
  const shareToTwitter = () => {
    const text = generateShareText()
    const url = window.location.href
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    
    window.open(twitterUrl, '_blank', 'width=550,height=420')
  }

  // Copy to clipboard
  const copyToClipboard = async () => {
    const text = generateShareText() + ` ${window.location.href}`
    
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Share via Web Share API (mobile)
  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ScoreQuest NFT - My Score',
          text: generateShareText(),
          url: window.location.href
        })
      } catch (error) {
        console.log('Share cancelled or failed:', error)
      }
    }
  }

  if (score === 0) return null

  return (
    <div className="relative">
      <Button
        onClick={() => setShowOptions(!showOptions)}
        variant="outline"
        size="sm"
        className="glow-button"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share Score
      </Button>

      {showOptions && (
        <div className="absolute top-full mt-2 right-0 bg-card border border-border rounded-lg shadow-lg p-2 space-y-2 z-50 min-w-48">
          {/* Twitter/X Share */}
          <Button
            onClick={shareToTwitter}
            variant="ghost"
            size="sm"
            className="w-full justify-start hover:bg-accent"
          >
            <Twitter className="w-4 h-4 mr-2" />
            Share on X/Twitter
          </Button>

          {/* Copy to Clipboard */}
          <Button
            onClick={copyToClipboard}
            variant="ghost"
            size="sm"
            className="w-full justify-start hover:bg-accent"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </>
            )}
          </Button>

          {/* Native Share (mobile) */}
          {navigator.share && (
            <Button
              onClick={shareNative}
              variant="ghost"
              size="sm"
              className="w-full justify-start hover:bg-accent"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share...
            </Button>
          )}

          {/* Close button */}
          <div className="border-t border-border pt-2">
            <Button
              onClick={() => setShowOptions(false)}
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  )
}

export default ShareButton

