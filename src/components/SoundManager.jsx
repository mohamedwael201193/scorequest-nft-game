import { useRef, useEffect } from 'react'

const SoundManager = ({ gameActive, score, combo, onSoundLoad }) => {
  const audioContextRef = useRef(null)
  const soundsRef = useRef({})

  // Initialize Web Audio API
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      createSounds()
    }
  }, [])

  // Create synthetic sounds using Web Audio API
  const createSounds = () => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current

    // Hit sound - short beep
    const createHitSound = () => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.setValueAtTime(800, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1)
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.1)
    }

    // Combo sound - ascending notes
    const createComboSound = (comboLevel) => {
      const frequencies = [440, 554, 659, 784, 880] // A, C#, E, G, A
      const frequency = frequencies[Math.min(comboLevel - 1, 4)]
      
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
      oscillator.type = 'triangle'
      
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.3)
    }

    // Power-up sound - rising sweep
    const createPowerUpSound = () => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.setValueAtTime(200, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5)
      oscillator.type = 'sawtooth'
      
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.5)
    }

    // Game start sound
    const createGameStartSound = () => {
      const frequencies = [440, 554, 659]
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = ctx.createOscillator()
          const gainNode = ctx.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(ctx.destination)
          
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime)
          oscillator.type = 'square'
          
          gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
          
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.2)
        }, index * 100)
      })
    }

    // Game end sound
    const createGameEndSound = () => {
      const frequencies = [659, 554, 440]
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = ctx.createOscillator()
          const gainNode = ctx.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(ctx.destination)
          
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime)
          oscillator.type = 'sine'
          
          gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
          
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.3)
        }, index * 150)
      })
    }

    soundsRef.current = {
      hit: createHitSound,
      combo: createComboSound,
      powerUp: createPowerUpSound,
      gameStart: createGameStartSound,
      gameEnd: createGameEndSound
    }

    if (onSoundLoad) {
      onSoundLoad(soundsRef.current)
    }
  }

  // Play sound with user interaction check
  const playSound = (soundName, ...args) => {
    if (!audioContextRef.current || !soundsRef.current[soundName]) return

    // Resume audio context if suspended (required by browsers)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }

    try {
      soundsRef.current[soundName](...args)
    } catch (error) {
      console.warn('Could not play sound:', error)
    }
  }

  // Expose play function to parent
  useEffect(() => {
    if (window) {
      window.playGameSound = playSound
    }
  }, [])

  return null // This component doesn't render anything
}

export default SoundManager

