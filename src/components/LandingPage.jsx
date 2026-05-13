import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TypingText from './TypingText'
import FloatingHearts from './FloatingHearts'

export default function LandingPage({ onStart }) {
  const [typingDone, setTypingDone] = useState(false)
  const [showButton, setShowButton] = useState(false)

  const handleTypingComplete = useCallback(() => {
    setTypingDone(true)
    setTimeout(() => setShowButton(true), 400)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-night via-night-light to-rose-deep/30">
      <FloatingHearts count={20} />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-soft/10 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative z-10 text-center max-w-xl mx-auto px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          className="mb-8"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 md:w-20 md:h-20 mx-auto text-rose-soft drop-shadow-lg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </motion.div>

        <div className="text-white/90 text-xl md:text-3xl lg:text-4xl font-sans font-medium leading-relaxed min-h-[4rem] max-w-2xl mx-auto">
          <TypingText
            text="Ada sesuatu yang pengen aku bilang…"
            speed={45}
            onComplete={handleTypingComplete}
          />
        </div>

        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mt-12"
            >
              <button
                onClick={onStart}
                className="group px-12 py-5 md:px-16 md:py-6 rounded-full bg-gradient-to-r from-rose to-lavender text-white font-bold text-lg md:text-2xl shadow-xl shadow-rose/20 hover:shadow-2xl hover:shadow-rose/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
              >
                <span className="relative z-10">Mulai</span>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-deep to-lavender-deep opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-6 text-white/40 text-sm font-medium tracking-widest uppercase"
      >
        ✦ klik mulai ✦
      </motion.p>
    </div>
  )
}
