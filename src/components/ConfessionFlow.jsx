import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const steps = [
  {
    emoji: '🌙',
    text: 'Setiap malam aku memandang bulan…',
    subtext: 'dan selalu ada satu nama yang terlintas.',
  },
  {
    emoji: '☕',
    text: 'Hal-hal kecil jadi terasa berbeda…',
    subtext: 'karena semuanya mengingatkanku padamu.',
  },
  {
    emoji: '💭',
    text: 'Aku gak pernah berani bilang sebelumnya…',
    subtext: 'tapi malam ini, aku ingin kamu tahu.',
  },
  {
    emoji: '🌅',
    text: 'Kamu itu kayak matahari pagi…',
    subtext: 'datang dan bikin semuanya terasa hangat.',
  },
  {
    emoji: '✨',
    text: 'Dan aku udah gak bisa pungkiri lagi…',
    subtext: 'kalau…',
  },
]

export default function ConfessionFlow({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)

  const next = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setDirection(1)
      setCurrentStep(s => s + 1)
    } else {
      onComplete()
    }
  }, [currentStep, onComplete])

  const step = steps[currentStep]
  const isLast = currentStep === steps.length - 1

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-night via-night-light to-rose-deep/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-soft/5 via-transparent to-transparent" />

      <div className="relative z-10 w-full max-w-xl mx-auto text-center px-4">
        <div className="mb-10">
          <div className="flex justify-center gap-2 mb-10">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentStep
                    ? 'w-8 bg-gradient-to-r from-rose to-lavender'
                    : i < currentStep
                    ? 'w-2 bg-rose/50'
                    : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: direction > 0 ? 30 : -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction > 0 ? -30 : 30 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="min-h-[320px] flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
              className="text-6xl md:text-7xl mb-8"
            >
              {step.emoji}
            </motion.div>

            <h2 className="text-white/90 text-2xl md:text-3xl lg:text-4xl font-serif font-light leading-relaxed mb-4">
              {step.text}
            </h2>

            <p className="text-white/50 text-base md:text-lg font-sans font-light">
              {step.subtext}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <button
            onClick={next}
            className="group px-10 py-4 md:px-12 md:py-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-sans font-medium text-base md:text-lg tracking-wide hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isLast ? 'Lanjut…' : 'Lanjut'}
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}
