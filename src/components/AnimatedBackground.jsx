import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const AnimatedBackground = () => {
  const containerRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create floating particles
    const createParticles = () => {
      const particleCount = 50
      particlesRef.current = []

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        particle.style.cssText = `
          position: absolute;
          width: ${Math.random() * 4 + 1}px;
          height: ${Math.random() * 4 + 1}px;
          background: ${Math.random() > 0.5 ? 'oklch(0.7 0.2 200)' : 'oklch(0.8 0.25 320)'};
          border-radius: 50%;
          opacity: ${Math.random() * 0.8 + 0.2};
          box-shadow: 0 0 10px currentColor;
        `
        
        // Random starting position
        gsap.set(particle, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          scale: Math.random() * 0.5 + 0.5
        })

        container.appendChild(particle)
        particlesRef.current.push(particle)
      }
    }

    // Animate particles
    const animateParticles = () => {
      particlesRef.current.forEach((particle, index) => {
        gsap.to(particle, {
          x: `+=${Math.random() * 200 - 100}`,
          y: `+=${Math.random() * 200 - 100}`,
          duration: Math.random() * 10 + 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.1
        })

        // Pulsing effect
        gsap.to(particle, {
          opacity: Math.random() * 0.8 + 0.2,
          scale: Math.random() * 0.8 + 0.6,
          duration: Math.random() * 3 + 2,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut"
        })
      })
    }

    // Create grid lines
    const createGridLines = () => {
      const gridContainer = document.createElement('div')
      gridContainer.className = 'grid-lines'
      gridContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.1;
      `

      // Vertical lines
      for (let i = 0; i < 20; i++) {
        const line = document.createElement('div')
        line.style.cssText = `
          position: absolute;
          left: ${(i / 20) * 100}%;
          top: 0;
          width: 1px;
          height: 100%;
          background: linear-gradient(180deg, transparent, oklch(0.7 0.2 200), transparent);
        `
        gridContainer.appendChild(line)
      }

      // Horizontal lines
      for (let i = 0; i < 15; i++) {
        const line = document.createElement('div')
        line.style.cssText = `
          position: absolute;
          top: ${(i / 15) * 100}%;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, oklch(0.7 0.2 200), transparent);
        `
        gridContainer.appendChild(line)
      }

      container.appendChild(gridContainer)

      // Animate grid
      gsap.to(gridContainer, {
        opacity: 0.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      })
    }

    // Create energy waves
    const createEnergyWaves = () => {
      for (let i = 0; i < 3; i++) {
        const wave = document.createElement('div')
        wave.className = 'energy-wave'
        wave.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 100px;
          border: 2px solid oklch(0.8 0.25 320 / 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        `
        
        container.appendChild(wave)

        // Animate waves
        gsap.fromTo(wave, 
          {
            scale: 0,
            opacity: 1
          },
          {
            scale: 8,
            opacity: 0,
            duration: 4,
            repeat: -1,
            delay: i * 1.3,
            ease: "power2.out"
          }
        )
      }
    }

    createParticles()
    animateParticles()
    createGridLines()
    createEnergyWaves()

    // Cleanup function
    return () => {
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `
          radial-gradient(circle at 20% 80%, oklch(0.6 0.15 280 / 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, oklch(0.7 0.2 200 / 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, oklch(0.8 0.25 320 / 0.05) 0%, transparent 50%)
        `
      }}
    />
  )
}

export default AnimatedBackground

