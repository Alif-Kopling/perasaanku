import { motion } from 'framer-motion'

const choices = [
  {
    id: 'yes',
    emoji: '💖',
    title: 'Iya, aku juga suka kamu!',
    description: 'Halaman ini bakal penuh sama kebahagiaan~',
    gradient: 'from-rose to-pink-500',
    shadow: 'shadow-rose/30',
  },
  {
    id: 'unsure',
    emoji: '😳',
    title: 'Aku butuh waktu…',
    description: 'Halaman ini penuh pengertian dan hangat',
    gradient: 'from-lavender to-purple-400',
    shadow: 'shadow-lavender/30',
  },
  {
    id: 'no',
    emoji: '💛',
    title: 'Maaf…',
    description: 'Halaman ini tetap manis dan dewasa',
    gradient: 'from-amber-400 to-orange-400',
    shadow: 'shadow-amber-400/30',
  },
]

export default function ResponseChoices({ onChoose }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-night via-night-light to-rose-deep/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-soft/5 via-transparent to-transparent" />

      <div className="relative z-10 w-full max-w-lg mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-white/90 text-3xl md:text-4xl font-serif mb-4">
            Dan… jawaban kamu?
          </h2>
          <p className="text-white/50 text-base md:text-lg font-sans">
            Pilih salah satu dengan hati yang tenang
          </p>
        </motion.div>

        <div className="space-y-4 md:space-y-5">
          {choices.map((choice, i) => (
            <motion.button
              key={choice.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 + 0.3 }}
              onClick={() => onChoose(choice.id)}
              className="group w-full text-left p-5 md:p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-4 md:gap-5">
                <span className="text-4xl md:text-5xl">{choice.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white/90 font-sans font-semibold text-lg md:text-xl mb-1">
                    {choice.title}
                  </h3>
                  <p className="text-white/40 text-sm md:text-base font-sans">
                    {choice.description}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${choice.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
