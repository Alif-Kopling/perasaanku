import { motion } from 'framer-motion'

export default function BackButton({ onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className="fixed top-4 left-4 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/60 text-sm font-sans hover:bg-white/20 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
    >
      ← Kembali
    </motion.button>
  )
}
