import { useState, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LandingPage from './components/LandingPage'
import ConfessionFlow from './components/ConfessionFlow'
import MiniGame from './components/MiniGame'
import ConfessionMessage from './components/ConfessionMessage'
import ResponseChoices from './components/ResponseChoices'
import ResponseResult from './components/ResponseResult'
import FlowerField from './components/FlowerField'
import MusicToggle from './components/MusicToggle'
import './App.css'

export default function App() {
  const [step, setStep] = useState('landing')
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const musicRef = useRef(null)

  const handleStart = useCallback(() => {
    setNameError('')
    musicRef.current?.play()
    setStep('input-name')
  }, [])

  const handleNameSubmit = useCallback((e) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.querySelector('input')
    const val = input?.value.trim()
    if (!val) {
      setNameError('Nama tidak boleh kosong ya~')
      input?.focus()
      return
    }
    setName(val)
    setStep('confession-flow')
  }, [])

  const handleFlowComplete = useCallback(() => {
    setStep('minigame')
  }, [])

  const handleGameComplete = useCallback(() => {
    setStep('confession-message')
  }, [])

  const handleMessageComplete = useCallback(() => {
    setStep('response-choices')
  }, [])

  const handleChoose = useCallback((response) => {
    setStep(`result-${response}`)
  }, [])

  const [fieldStatus, setFieldStatus] = useState('suka')

  const handleFlowerField = useCallback((status) => {
    setFieldStatus(status)
    setStep('flower-field')
  }, [])

  const handleRestart = useCallback(() => {
    setName('')
    setStep('landing')
  }, [])

  return (
    <div className="relative">
      <MusicToggle ref={musicRef} />

      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onStart={handleStart} />
          </motion.div>
        )}

        {step === 'input-name' && (
          <motion.div
            key="input-name"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-night via-night-light to-rose-deep/30"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-soft/5 via-transparent to-transparent" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10 w-full max-w-md mx-auto text-center px-4"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl md:text-6xl mb-8"
              >
                ✨
              </motion.div>

              <h2 className="text-white/90 text-2xl md:text-3xl font-serif mb-3">
                Siapa nama kamu?
              </h2>
              <p className="text-white/40 text-base md:text-lg font-sans mb-10">
                Biar pesannya lebih personal, wanjay personal ga tuh wkwkwk...
              </p>

              <form onSubmit={handleNameSubmit} className="space-y-4" noValidate>
                <input
                  type="text"
                  placeholder="Tulis namanya..."
                  maxLength={50}
                  autoFocus
                  aria-label="Nama yang dituju"
                  aria-invalid={!!nameError}
                  className={`w-full px-6 py-4 md:px-8 md:py-5 rounded-full bg-white/10 backdrop-blur-md border text-white placeholder-white/30 font-sans text-base md:text-lg outline-none transition-all duration-300 ${
                    nameError
                      ? 'border-rose/60 focus:border-rose focus:ring-2 focus:ring-rose/40'
                      : 'border-white/20 focus:border-rose/50 focus:ring-2 focus:ring-rose/30'
                  }`}
                />
                {nameError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-soft/80 text-sm font-sans"
                  >
                    {nameError}
                  </motion.p>
                )}
                <button
                  type="submit"
                  className="w-full px-10 py-4 md:px-12 md:py-5 rounded-full bg-gradient-to-r from-rose to-lavender text-white font-semibold text-lg md:text-xl shadow-lg shadow-rose/30 hover:shadow-xl hover:shadow-rose/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Lanjut →
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {step === 'confession-flow' && (
          <motion.div
            key="confession-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ConfessionFlow onComplete={handleFlowComplete} />
          </motion.div>
        )}

        {step === 'minigame' && (
          <motion.div
            key="minigame"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MiniGame onComplete={handleGameComplete} />
          </motion.div>
        )}

        {step === 'confession-message' && (
          <motion.div
            key="confession-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ConfessionMessage name={name} onComplete={handleMessageComplete} />
          </motion.div>
        )}

        {step === 'response-choices' && (
          <motion.div
            key="response-choices"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResponseChoices onChoose={handleChoose} />
          </motion.div>
        )}

        {step === 'flower-field' && (
          <motion.div
            key="flower-field"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FlowerField onRestart={handleRestart} status={fieldStatus} />
          </motion.div>
        )}

        {step.startsWith('result-') && (
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResponseResult
              response={step.replace('result-', '')}
              name={name}
              onRestart={handleRestart}
              onFlowerField={handleFlowerField}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
