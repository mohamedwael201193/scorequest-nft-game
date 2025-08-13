import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const ScoreAnimation = ({ score, onAnimationComplete }) => {
  const scoreRef = useRef(null)
  const previousScore = useRef(0)

  useEffect(() => {
    if (score !== previousScore.current && scoreRef.current) {
      const element = scoreRef.current
      const scoreDiff = score - previousScore.current

      if (scoreDiff > 0) {
        // Score increase animation
        gsap.fromTo(element, 
          {
            scale: 1,
            color: 'oklch(0.7 0.2 200)'
          },
          {
            scale: 1.3,
            color: 'oklch(0.8 0.25 320)',
            duration: 0.2,
            ease: "back.out(1.7)",
            onComplete: () => {
              gsap.to(element, {
                scale: 1,
                color: 'oklch(0.7 0.2 200)',
                duration: 0.3,
                ease: "power2.out"
              })
            }
          }
        )

        // Create floating score indicator
        const floatingScore = document.createElement('div')
        floatingScore.textContent = `+${scoreDiff}`
        floatingScore.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: oklch(0.8 0.25 320);
          font-size: 1.5rem;
          font-weight: bold;
          text-shadow: 0 0 10px oklch(0.8 0.25 320);
          pointer-events: none;
          z-index: 1000;
        `
        
        element.parentElement.appendChild(floatingScore)

        gsap.fromTo(floatingScore,
          {
            y: 0,
            opacity: 1,
            scale: 0.5
          },
          {
            y: -50,
            opacity: 0,
            scale: 1.2,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
              floatingScore.remove()
              if (onAnimationComplete) onAnimationComplete()
            }
          }
        )
      }

      previousScore.current = score
    }
  }, [score, onAnimationComplete])

  return (
    <div className="relative">
      <span 
        ref={scoreRef}
        className="score-display text-4xl font-bold"
        style={{
          background: 'linear-gradient(135deg, oklch(0.7 0.2 200), oklch(0.8 0.25 320))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 20px oklch(0.7 0.2 200 / 0.5)'
        }}
      >
        {score}
      </span>
    </div>
  )
}

export default ScoreAnimation

