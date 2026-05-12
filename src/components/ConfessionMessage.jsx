import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const revealLines = [
  { text: 'Aku suka kamu.', delay: 1500 },
  { text: 'Bukan hanya hari ini.', delay: 2500 },
  { text: 'Tapi sejak lama.', delay: 2500 },
  { text: 'Dan aku ingin kamu tahu…', delay: 3000 },
  { text: 'kalau aku selalu ada di sini.', delay: 3000 },
  { text: 'Untuk kamu.', delay: 2000 },
]

export default function ConfessionMessage({ name, onComplete }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [showButton, setShowButton] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    if (currentLineIndex >= revealLines.length) {
      setTimeout(() => {
        setIsRevealed(true)
        setTimeout(() => setShowButton(true), 600)
      }, 1000)
      return
    }

    const line = revealLines[currentLineIndex]
    const timer = setTimeout(() => {
      setVisibleLines(prev => [...prev, currentLineIndex])
      setCurrentLineIndex(i => i + 1)
    }, line.delay)

    return () => clearTimeout(timer)
  }, [currentLineIndex])

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-night via-night-light to-rose-deep/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-soft/8 via-transparent to-transparent" />

      <div className="relative z-10 w-full max-w-2xl mx-auto text-center px-6">
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-10"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-rose/30 to-lavender/30 backdrop-blur-md border border-rose/20">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 md:w-12 md:h-12 text-rose">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </motion.div>
        )}

        {name && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-rose-soft/80 text-base md:text-lg font-sans font-medium tracking-wider uppercase mb-8"
          >
            Untuk {name}
          </motion.p>
        )}

        <div className="min-h-[320px] md:min-h-[360px] flex flex-col items-center justify-center gap-3">
          <AnimatePresence>
            {visibleLines.map((lineIndex, i) => (
              <motion.div
                key={lineIndex}
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <p className="text-white/90 text-2xl md:text-3xl lg:text-4xl font-serif font-light leading-relaxed">
                  {revealLines[lineIndex].text}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
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
                onClick={onComplete}
                className="group px-10 py-4 md:px-12 md:py-5 rounded-full bg-gradient-to-r from-rose to-lavender text-white font-semibold text-lg md:text-xl shadow-lg shadow-rose/30 hover:shadow-xl hover:shadow-rose/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                Lanjut
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
