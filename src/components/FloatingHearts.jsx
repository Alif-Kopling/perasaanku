import { useEffect, useState } from 'react'

const createHeart = () => ({
  id: crypto.randomUUID(),
  x: Math.random() * 100,
    size: Math.random() * 24 + 14,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 5,
  opacity: Math.random() * 0.5 + 0.3,
  rotation: Math.random() * 360,
})

export default function FloatingHearts({ count = 15 }) {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    setHearts(Array.from({ length: count }, createHeart))
    const interval = setInterval(() => {
      setHearts(prev => prev.map(h => h.id === prev[Math.floor(Math.random() * prev.length)].id ? createHeart() : h))
    }, 3000)
    return () => clearInterval(interval)
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map(h => (
        <div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.x}%`,
            bottom: '-5%',
            width: h.size,
            height: h.size,
            opacity: h.opacity,
            animation: `float-up ${h.duration}s ease-in ${h.delay}s infinite`,
            transform: `rotate(${h.rotation}deg)`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-rose-soft/60 w-full h-full">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      ))}
    </div>
  )
}
