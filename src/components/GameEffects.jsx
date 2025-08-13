import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const GameEffects = ({ gameAreaRef }) => {
  const effectsRef = useRef(null)

  // Create hit effect at specific coordinates
  const createHitEffect = (x, y) => {
    if (!effectsRef.current) return

    const effect = document.createElement('div')
    effect.className = 'hit-explosion'
    effect.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: radial-gradient(circle, oklch(0.8 0.25 320), transparent);
      box-shadow: 0 0 30px oklch(0.8 0.25 320);
      pointer-events: none;
      z-index: 100;
    `

    effectsRef.current.appendChild(effect)

    // Explosion animation
    gsap.fromTo(effect,
      {
        scale: 0,
        opacity: 1,
        rotation: 0
      },
      {
        scale: 3,
        opacity: 0,
        rotation: 360,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          effect.remove()
        }
      }
    )

    // Create particles
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div')
      particle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: oklch(0.8 0.25 320);
        border-radius: 50%;
        pointer-events: none;
        z-index: 99;
      `

      effectsRef.current.appendChild(particle)

      const angle = (i / 8) * Math.PI * 2
      const distance = 50 + Math.random() * 30

      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          particle.remove()
        }
      })
    }
  }

  // Create miss effect
  const createMissEffect = (x, y) => {
    if (!effectsRef.current) return

    const effect = document.createElement('div')
    effect.textContent = 'MISS'
    effect.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      color: oklch(0.7 0.25 0);
      font-size: 1rem;
      font-weight: bold;
      text-shadow: 0 0 10px oklch(0.7 0.25 0);
      pointer-events: none;
      z-index: 100;
      transform: translate(-50%, -50%);
    `

    effectsRef.current.appendChild(effect)

    gsap.fromTo(effect,
      {
        y: 0,
        opacity: 1,
        scale: 0.5
      },
      {
        y: -30,
        opacity: 0,
        scale: 1,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          effect.remove()
        }
      }
    )
  }

  // Create combo effect
  const createComboEffect = (combo) => {
    if (!effectsRef.current || combo < 2) return

    const effect = document.createElement('div')
    effect.textContent = `${combo}x COMBO!`
    effect.style.cssText = `
      position: absolute;
      left: 50%;
      top: 30%;
      color: oklch(0.8 0.2 60);
      font-size: 2rem;
      font-weight: bold;
      text-shadow: 0 0 20px oklch(0.8 0.2 60);
      pointer-events: none;
      z-index: 100;
      transform: translate(-50%, -50%);
    `

    effectsRef.current.appendChild(effect)

    gsap.fromTo(effect,
      {
        scale: 0,
        opacity: 1,
        rotation: -10
      },
      {
        scale: 1.5,
        opacity: 0,
        rotation: 10,
        duration: 1.5,
        ease: "back.out(1.7)",
        onComplete: () => {
          effect.remove()
        }
      }
    )
  }

  // Create power-up effect
  const createPowerUpEffect = () => {
    if (!effectsRef.current) return

    const effect = document.createElement('div')
    effect.textContent = 'POWER UP!'
    effect.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      color: oklch(0.8 0.25 320);
      font-size: 2.5rem;
      font-weight: bold;
      text-shadow: 0 0 30px oklch(0.8 0.25 320);
      pointer-events: none;
      z-index: 100;
      transform: translate(-50%, -50%);
    `

    effectsRef.current.appendChild(effect)

    gsap.fromTo(effect,
      {
        scale: 0,
        opacity: 1,
        y: 0
      },
      {
        scale: 2,
        opacity: 0,
        y: -50,
        duration: 2,
        ease: "power2.out",
        onComplete: () => {
          effect.remove()
        }
      }
    )
  }

  // Expose methods to parent component
  useEffect(() => {
    if (gameAreaRef && gameAreaRef.current) {
      gameAreaRef.current.createHitEffect = createHitEffect
      gameAreaRef.current.createMissEffect = createMissEffect
      gameAreaRef.current.createComboEffect = createComboEffect
      gameAreaRef.current.createPowerUpEffect = createPowerUpEffect
    }
  }, [gameAreaRef])

  return (
    <div 
      ref={effectsRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 50 }}
    />
  )
}

export default GameEffects

