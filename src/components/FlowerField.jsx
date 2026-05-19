import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getWaUrl } from '../constants'

const COLORS = [
  { petal: '#f472b6', center: '#fde68a', stem: '#4ade80' },
  { petal: '#a78bfa', center: '#fde68a', stem: '#22c55e' },
  { petal: '#f9a8d4', center: '#fef9c3', stem: '#16a34a' },
  { petal: '#67e8f9', center: '#fde68a', stem: '#65a30d' },
  { petal: '#fb923c', center: '#fef9c3', stem: '#4ade80' },
  { petal: '#e879f9', center: '#fde68a', stem: '#22c55e' },
  { petal: '#fbbf24', center: '#fef9c3', stem: '#16a34a' },
]

export default function FlowerField({ onRestart, status = 'suka' }) {
  const canvasRef = useRef(null)
  const [showUI, setShowUI] = useState(false)
  const stateRef = useRef({
    mouseX: -9999,
    mouseY: -9999,
    time: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let running = true
    let flowers = []
    let stars = []
    let fireflies = []
    let fallingPetals = []
    let sparkles = []

    const size = { w: 0, h: 0 }
    let bgGradient = null
    let groundGradient = null

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      size.w = w
      size.h = h
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.scale(dpr, dpr)

      const isGagal = status === 'gagal'
      bgGradient = ctx.createRadialGradient(w / 2, h * 0.5, 0, w / 2, h * 0.5, h * 0.8)
      bgGradient.addColorStop(0, isGagal ? '#333' : '#1e1b4b')
      bgGradient.addColorStop(1, isGagal ? '#111' : '#0f0d2e')

      groundGradient = ctx.createLinearGradient(0, h - 80, 0, h)
      groundGradient.addColorStop(0, 'transparent')
      groundGradient.addColorStop(1, isGagal ? '#262626' : '#14532d')

      const spacing = Math.max(60, Math.min(90, w / 14))
      const cols = Math.ceil(w / spacing) + 1
      const rows = Math.ceil(h / spacing) + 1
      const offsetX = (w - (cols - 1) * spacing) / 2
      flowers = []

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const color = isGagal 
            ? { petal: '#525252', center: '#262626', stem: '#404040' } 
            : COLORS[Math.floor(Math.random() * COLORS.length)]
          const stemH = 60 + Math.random() * 90 + (1 - r / rows) * 50
          const scale = (isGagal ? 0.3 : 0.5) + Math.random() * 0.4

          flowers.push({
            x: offsetX + c * spacing + (Math.random() - 0.5) * spacing * 0.3,
            baseY: h - 10 + (Math.random() - 0.5) * 30,
            stemH,
            scale,
            color,
            petalCount: 4 + Math.floor(Math.random() * 3),
            bendX: 0,
            bendY: 0,
            targetBendX: 0,
            targetBendY: 0,
            swayPhase: Math.random() * Math.PI * 2,
            swaySpeed: isGagal ? 0.1 : (0.3 + Math.random() * 0.4),
            swayAmp: isGagal ? 0.05 : (0.3 + Math.random() * 0.4),
            z: (r / rows + Math.random() * 0.1),
          })
        }
      }

      flowers.sort((a, b) => a.z - b.z)

      const starCount = isGagal ? 30 : 80
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.65,
        size: 0.5 + Math.random() * 1.5,
        twinkleSpeed: 0.5 + Math.random() * 2,
        twinklePhase: Math.random() * Math.PI * 2,
      }))

      const fireflyCount = isGagal ? 0 : 15
      fireflies = Array.from({ length: fireflyCount }, () => ({
        x: Math.random() * w,
        y: h * 0.15 + Math.random() * h * 0.5,
        size: 1.5 + Math.random() * 2.5,
        speed: 0.2 + Math.random() * 0.3,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        glowPhase: Math.random() * Math.PI * 2,
        glowSpeed: 0.5 + Math.random() * 1.5,
      }))

      const petalCount = isGagal ? 0 : 10
      fallingPetals = Array.from({ length: petalCount }, () => ({
        x: Math.random() * (w + 100) - 50,
        y: Math.random() * -h * 0.5,
        size: 5 + Math.random() * 6,
        speed: 15 + Math.random() * 25,
        swayAmp: 20 + Math.random() * 30,
        swaySpeed: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: 0.005 + Math.random() * 0.015,
        color: COLORS[Math.floor(Math.random() * COLORS.length)].petal,
        alpha: 0.3 + Math.random() * 0.4,
      }))

      sparkles = []
    }

    init()
    window.addEventListener('resize', init)

    const handleMouse = (e) => {
      stateRef.current.mouseX = e.clientX
      stateRef.current.mouseY = e.clientY
    }
    const handleTouch = (e) => {
      const t = e.touches[0]
      if (t) {
        stateRef.current.mouseX = t.clientX
        stateRef.current.mouseY = t.clientY
      }
    }
    const handleLeave = () => {
      stateRef.current.mouseX = -9999
      stateRef.current.mouseY = -9999
    }

    window.addEventListener('mousemove', handleMouse)
    window.addEventListener('touchmove', handleTouch)
    window.addEventListener('touchstart', handleTouch)
    window.addEventListener('mouseleave', handleLeave)

    const loop = (timestamp) => {
      if (!running) return
      const { w, h } = size
      const { mouseX, mouseY } = stateRef.current
      const time = timestamp / 1000
      stateRef.current.time = time

      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, w, h)

      for (const star of stars) {
        const twinkle = 0.2 + Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.8
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, twinkle)})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.fillStyle = groundGradient
      ctx.fillRect(0, h - 80, w, 80)

      const heartX = w / 2
      const heartY = h * 0.42
      const heartSize = Math.min(w, h) * 0.22
      const pulse = status === 'suka' ? 1 + Math.sin(time * 0.8) * 0.02 : 1

      ctx.save()

      if (status === 'suka') {
        ctx.shadowColor = '#f472b6'
        ctx.shadowBlur = 40 + Math.sin(time * 0.8) * 15
        const heartGrad = ctx.createRadialGradient(heartX, heartY - heartSize * 0.15, 0, heartX, heartY, heartSize)
        heartGrad.addColorStop(0, '#fbcfe8')
        heartGrad.addColorStop(0.3, '#f472b6')
        heartGrad.addColorStop(0.7, '#ec4899')
        heartGrad.addColorStop(1, '#be185d')
        ctx.fillStyle = heartGrad
      } else if (status === 'pikir') {
        ctx.fillStyle = '#94a3b8'
      } else {
        ctx.fillStyle = '#404040'
      }

      ctx.beginPath()
      for (let t = 0; t <= Math.PI * 2; t += 0.04) {
        const sinT = Math.sin(t)
        const x = 16 * sinT * sinT * sinT
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
        const px = heartX + x * heartSize * pulse / 18
        const py = heartY - y * heartSize * pulse / 18
        t === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
      
      if (status === 'gagal') {
        ctx.strokeStyle = '#262626'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(heartX, heartY - heartSize * 0.3)
        ctx.lineTo(heartX + heartSize * 0.2, heartY + heartSize * 0.1)
        ctx.moveTo(heartX - heartSize * 0.1, heartY + heartSize * 0.2)
        ctx.lineTo(heartX + heartSize * 0.1, heartY + heartSize * 0.4)
        ctx.stroke()
      }

      ctx.restore()

      for (let i = 0; i < flowers.length; i++) {
        const f = flowers[i]
        const headX = f.x + f.bendX
        const headY = f.baseY - f.stemH * f.scale + f.bendY

        const sway = Math.sin(time * f.swaySpeed + f.swayPhase) * f.swayAmp

        const dx = mouseX - f.x
        const dy = mouseY - (f.baseY - f.stemH * f.scale * 0.5)
        const dist = Math.sqrt(dx * dx + dy * dy)
        const threshold = status === 'gagal' ? 50 : 120

        if (dist < threshold) {
          const strength = (1 - dist / threshold) * 40
          const pushX = -(dx / (dist || 1)) * strength
          const pushY = -(dy / (dist || 1)) * strength * 0.3
          f.targetBendX += (pushX - f.targetBendX) * 0.2
          f.targetBendY += (pushY - f.targetBendY) * 0.2
        } else {
          f.targetBendX *= 0.9
          f.targetBendY *= 0.9
        }

        f.bendX += (f.targetBendX + sway - f.bendX) * 0.1
        f.bendY += (f.targetBendY - f.bendY) * 0.1

        const dx2 = f.x - headX
        const dy2 = f.baseY - headY
        const ctrlX = f.x - dx2 * 0.3 + f.bendX * 0.2
        const ctrlY = f.baseY - dy2 * 0.4 - f.bendY * 0.2

        ctx.strokeStyle = f.color.stem
        ctx.lineWidth = 2 * f.scale
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(f.x, f.baseY)
        ctx.quadraticCurveTo(ctrlX, ctrlY, headX, headY)
        ctx.stroke()

        const ps = 10 * f.scale
        const pl = 14 * f.scale

        for (let j = 0; j < f.petalCount; j++) {
          const a = (Math.PI * 2 / f.petalCount) * j - Math.PI / 2
          const px = headX + Math.cos(a) * ps * 0.25
          const py = headY + Math.sin(a) * ps * 0.25
          const spread = Math.cos(j * 2.5) * 0.2 + 1

          ctx.fillStyle = f.color.petal
          ctx.beginPath()
          ctx.ellipse(px, py - pl * 0.3 * spread, ps * 0.35, pl * 0.45 * spread, a, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = f.color.center
        ctx.beginPath()
        ctx.arc(headX, headY, ps * 0.25, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const ff of fireflies) {
        const glow = 0.3 + Math.sin(time * ff.glowSpeed + ff.glowPhase) * 0.7
        const ffx = ff.x + Math.sin(time * ff.speed + ff.phaseX) * 40
        const ffy = ff.y + Math.cos(time * ff.speed * 0.7 + ff.phaseY) * 25

        const grad = ctx.createRadialGradient(ffx, ffy, 0, ffx, ffy, ff.size * 5)
        grad.addColorStop(0, `rgba(255, 255, 210, ${glow * 0.5})`)
        grad.addColorStop(1, 'rgba(255, 255, 210, 0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(ffx, ffy, ff.size * 5, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(255, 255, 230, ${glow})`
        ctx.beginPath()
        ctx.arc(ffx, ffy, ff.size, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const p of fallingPetals) {
        p.x += Math.sin(time * p.swaySpeed + p.phase) * 0.6
        p.y += p.speed * 0.008
        p.rotation += p.rotSpeed
        if (p.y > h + 20) {
          p.y = -20
          p.x = Math.random() * (w + 100) - 50
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size * 0.35, p.size * 0.7, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      if (status === 'suka') {
        if (Math.random() < 0.3) {
          const angle = Math.random() * Math.PI * 2
          const dist = heartSize * 0.2 + Math.random() * heartSize * 0.5
          sparkles.push({
            x: heartX + Math.cos(angle) * dist,
            y: heartY - Math.sin(angle) * dist * 0.6,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -0.3 - Math.random() * 1,
            life: 1,
            size: 1.5 + Math.random() * 2.5,
            color: ['#fbcfe8', '#f472b6', '#fde68a', '#ffffff'][Math.floor(Math.random() * 4)],
          })
        }

        for (let i = sparkles.length - 1; i >= 0; i--) {
          const s = sparkles[i]
          s.x += s.vx
          s.y += s.vy
          s.vy += 0.01
          s.life -= 0.008
          if (s.life <= 0) {
            sparkles.splice(i, 1)
            continue
          }
          ctx.globalAlpha = s.life
          ctx.fillStyle = s.color
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }

      animFrameRef.current = requestAnimationFrame(loop)
    }

    const animFrameRef = { current: requestAnimationFrame(loop) }

    setTimeout(() => setShowUI(true), 1500)

    return () => {
      running = false
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', init)
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('touchmove', handleTouch)
      window.removeEventListener('touchstart', handleTouch)
      window.removeEventListener('mouseleave', handleLeave)
    }
  }, [status])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0f0d2e]">
      <canvas ref={canvasRef} className="block w-full h-full" />

      {showUI && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 flex flex-col items-center justify-end pb-16 pointer-events-none"
        >
          <div className="pointer-events-auto flex flex-col items-center gap-4">
            {status !== 'gagal' && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-white/40 text-sm font-sans text-center mb-4"
              >
                gerakkan kursor ke ladang bunga ✦
              </motion.p>
            )}

            {status === 'suka' && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-rose-soft/80 text-lg md:text-xl font-serif text-center mb-2"
              >
                Untuk kamu, ladang bunga ini… 💕
              </motion.p>
            )}
            {status === 'pikir' && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-lavender/80 text-lg md:text-xl font-serif text-center mb-2"
              >
                Semoga suatu hari nanti… 🌷
              </motion.p>
            )}
            {status === 'gagal' && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-white/50 text-lg md:text-xl font-serif text-center mb-2"
              >
                Terima kasih untuk semuanya… 🌻
              </motion.p>
            )}

            <motion.a
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              href={getWaUrl(status)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Balas di WhatsApp 💬
            </motion.a>

            {onRestart && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-center"
              >
                <button
                  onClick={onRestart}
                  className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/60 text-sm font-sans hover:bg-white/20 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  Mulai dari Awal ↩
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
