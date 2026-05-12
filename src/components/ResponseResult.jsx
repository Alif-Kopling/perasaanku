import { motion } from 'framer-motion'

const results = {
  yes: {
    emoji: '💖',
    title: 'Aku juga suka kamu!',
    message: 'Aku senang banget… rasanya kayak mimpi. Makasih udah mau nerima aku apa adanya. Aku janji bakal jadi yang terbaik buat kamu. 💕',
    gradient: 'from-rose via-pink-500 to-rose-deep',
    bgGlow: 'from-rose/20 via-pink-500/10 to-transparent',
    icon: '🎉',
  },
  unsure: {
    emoji: '😳',
    title: 'Aku hargai itu.',
    message: 'Nggak apa-apa, aku paham. Kamu berhak ambil waktu buat mikir. Aku akan tunggu dengan sabar, dan nggak akan kemana-mana. Yang penting kamu tau perasaanku. 🌙',
    gradient: 'from-lavender via-purple-400 to-lavender-deep',
    bgGlow: 'from-lavender/20 via-purple-400/10 to-transparent',
    icon: '🌷',
  },
  no: {
    emoji: '💛',
    title: 'Makasih buat kejujurannya.',
    message: 'Aku hargai banget kamu bilang terus terang. Mungkin ini bukan waktunya, dan itu nggak apa-apa. Aku tetep bersyukur pernah kenal kamu. Semoga kamu bahagia selalu. 🌅',
    gradient: 'from-amber-400 via-orange-400 to-amber-500',
    bgGlow: 'from-amber-400/20 via-orange-400/10 to-transparent',
    icon: '🌻',
  },
}

export default function ResponseResult({ response, name, onRestart, onFlowerField }) {
  const result = results[response]

  if (!result) return null

  return (
    <div className={`relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-night via-night-light to-rose-deep/30 overflow-hidden`}>
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${result.bgGlow}`} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-xl mx-auto text-center px-6"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="text-7xl md:text-8xl mb-8"
        >
          {result.icon}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {name && (
            <p className="text-white/50 text-base md:text-lg font-sans tracking-wider uppercase mb-3">
              {response === 'yes' ? `Untuk ${name}` : `Terima kasih, ${name}`}
            </p>
          )}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mb-6 bg-gradient-to-r ${result.gradient} bg-clip-text text-transparent`}
        >
          {result.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-white/70 text-lg md:text-xl lg:text-2xl font-sans font-light leading-relaxed mb-12"
        >
          {result.message}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-col items-center gap-3"
        >
          <button
            onClick={onFlowerField}
            className="px-10 py-4 md:px-12 md:py-5 rounded-full bg-gradient-to-r from-rose to-lavender text-white font-semibold text-lg md:text-xl shadow-lg shadow-rose/30 hover:shadow-xl hover:shadow-rose/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Lanjut ke Ladang Bunga 🌸
          </button>
          <button
            onClick={onRestart}
            className="text-white/40 text-sm md:text-base font-sans hover:text-white/60 transition-colors duration-300 cursor-pointer underline underline-offset-2"
          >
            Mulai dari Awal ↩
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 text-white/20 text-sm font-sans"
      >
        {response === 'yes' ? 'selamat! 💖' : response === 'unsure' ? 'semoga harimu menyenangkan 🌷' : 'tetap semangat ya 🌻'}
      </motion.div>
    </div>
  )
}
