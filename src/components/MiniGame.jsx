import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GAME_DURATION = 15
const HEART_SPAWN_INTERVAL = 800

function createHeart() {
  return {
    id: crypto.randomUUID(),
    x: Math.random() * 80 + 10,
    delay: Math.random() * 2,
    size: Math.random() * 16 + 20,
    rotation: Math.random() * 360,
  }
}

export default function MiniGame({ onComplete, onBack }) {
  const [hearts, setHearts] = useState([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [started, setStarted] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const intervalRef = useRef(null)
  const timerRef = useRef(null)

  const startGame = useCallback(() => {
    setStarted(true)
    setScore(0)
    setTimeLeft(GAME_DURATION)

    intervalRef.current = setInterval(() => {
      setHearts(prev => [...prev, createHeart()])
    }, HEART_SPAWN_INTERVAL)

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current)
      clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (started && timeLeft === 0) {
      setHearts([])
      setTimeout(() => setShowResult(true), 500)
    }
  }, [timeLeft, started])

  const catchHeart = useCallback((id) => {
    setHearts(prev => prev.filter(h => h.id !== id))
    setScore(s => s + 1)
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-night via-night-light to-rose-deep/30 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-soft/5 via-transparent to-transparent" />

      {!started && !showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center max-w-md mx-auto px-4"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl md:text-8xl mb-8"
          >
            💖
          </motion.div>
          <h2 className="text-white/90 text-3xl md:text-4xl font-serif mb-4">Catch the Hearts!</h2>
          <p className="text-white/50 text-base md:text-lg font-sans mb-10 leading-relaxed">
            Klik hati yang berjatuhan sebelum waktunya habis.<br />
            Kumpulkan sebanyak mungkin!
          </p>
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={startGame}
              className="px-10 py-4 md:px-12 md:py-5 rounded-full bg-gradient-to-r from-rose to-lavender text-white font-semibold text-lg md:text-xl shadow-lg shadow-rose/30 hover:shadow-xl hover:shadow-rose/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Mulai Game
            </button>
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="text-white/40 text-sm md:text-base font-sans hover:text-white/60 transition-colors duration-300 cursor-pointer underline underline-offset-2"
                >
                  ← Kembali
                </button>
              )}
              <button
                onClick={onComplete}
                className="text-white/40 text-sm md:text-base font-sans hover:text-white/60 transition-colors duration-300 cursor-pointer underline underline-offset-2"
              >
                Skip →
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {started && !showResult && (
        <>
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30 flex gap-6 items-center">
            <div className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-base md:text-lg">
              ❤️ {score}
            </div>
            <div className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-base md:text-lg">
              ⏱️ {timeLeft}s
            </div>
          </div>

          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-20 w-64 md:w-80 h-2 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose to-lavender transition-all duration-1000"
              style={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }}
            />
          </div>

          <div className="absolute inset-0 z-10">
            <AnimatePresence>
              {hearts.map(h => (
                <motion.button
                  key={h.id}
                  initial={{ y: -50, opacity: 0, rotate: h.rotation }}
                  animate={{ y: '100vh', opacity: [0, 1, 1, 0] }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 5, ease: 'linear', delay: h.delay }}
                  onClick={() => catchHeart(h.id)}
                  className="absolute cursor-pointer"
                  style={{ left: `${h.x}%`, width: h.size, height: h.size }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="text-rose-soft drop-shadow-lg w-full h-full">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {showResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative z-10 text-center max-w-md mx-auto px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-6xl md:text-7xl mb-8"
          >
            {score >= 10 ? '🎉' : score >= 5 ? '💕' : '🥰'}
          </motion.div>
          <h2 className="text-white/90 text-3xl md:text-4xl font-serif mb-4">
            {score >= 10 ? 'Luar Biasa!' : score >= 5 ? 'Bagus!' : 'Manis~'}
          </h2>
          <p className="text-white/50 text-base md:text-lg mb-3">
            Kamu mengumpulkan <span className="text-rose-soft font-semibold">{score}</span> hati!
          </p>
          <p className="text-white/40 text-sm md:text-base mb-10">
            {score >= 10
              ? 'Hatimu penuh cinta! 💖'
              : score >= 5
              ? 'Cukup untuk lanjut ke pesan spesial~'
              : 'Yang penting udah berusaha! ✨'}
          </p>
          <button
            onClick={onComplete}
            className="px-10 py-4 md:px-12 md:py-5 rounded-full bg-gradient-to-r from-rose to-lavender text-white font-semibold text-lg md:text-xl shadow-lg shadow-rose/30 hover:shadow-xl hover:shadow-rose/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Lanjut ke Pesan ✨
          </button>
        </motion.div>
      )}
    </div>
  )
}
