import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const COLORS = [
  { petal: '#f472b6', center: '#fde68a', stem: '#4ade80' },
  { petal: '#a78bfa', center: '#fde68a', stem: '#22c55e' },
  { petal: '#f9a8d4', center: '#fef9c3', stem: '#16a34a' },
  { petal: '#67e8f9', center: '#fde68a', stem: '#65a30d' },
  { petal: '#fb923c', center: '#fef9c3', stem: '#4ade80' },
  { petal: '#e879f9', center: '#fde68a', stem: '#22c55e' },
  { petal: '#fbbf24', center: '#fef9c3', stem: '#16a34a' },
]

export default function FlowerField({ onRestart }) {
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

      bgGradient = ctx.createRadialGradient(w / 2, h * 0.5, 0, w / 2, h * 0.5, h * 0.8)
      bgGradient.addColorStop(0, '#1e1b4b')
      bgGradient.addColorStop(1, '#0f0d2e')

      groundGradient = ctx.createLinearGradient(0, h - 80, 0, h)
      groundGradient.addColorStop(0, 'transparent')
      groundGradient.addColorStop(1, '#14532d')

      const spacing = Math.max(60, Math.min(90, w / 14))
      const cols = Math.ceil(w / spacing) + 1
      const rows = Math.ceil(h / spacing) + 1
      const offsetX = (w - (cols - 1) * spacing) / 2
      flowers = []

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const color = COLORS[Math.floor(Math.random() * COLORS.length)]
          const stemH = 60 + Math.random() * 90 + (1 - r / rows) * 50
          const scale = 0.5 + Math.random() * 0.4

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
            swaySpeed: 0.3 + Math.random() * 0.4,
            swayAmp: 0.3 + Math.random() * 0.4,
            z: (r / rows + Math.random() * 0.1),
          })
        }
      }

      flowers.sort((a, b) => a.z - b.z)
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
      ctx.fillStyle = groundGradient
      ctx.fillRect(0, h - 80, w, 80)

      const heartX = w / 2
      const heartY = h * 0.42
      const heartSize = Math.min(w, h) * 0.22
      const pulse = 1 + Math.sin(time * 0.8) * 0.02

      ctx.save()
      ctx.shadowColor = '#f472b6'
      ctx.shadowBlur = 40 + Math.sin(time * 0.8) * 15

      const heartGrad = ctx.createRadialGradient(heartX, heartY - heartSize * 0.15, 0, heartX, heartY, heartSize)
      heartGrad.addColorStop(0, '#fbcfe8')
      heartGrad.addColorStop(0.3, '#f472b6')
      heartGrad.addColorStop(0.7, '#ec4899')
      heartGrad.addColorStop(1, '#be185d')
      ctx.fillStyle = heartGrad

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

      ctx.shadowBlur = 0
      ctx.strokeStyle = '#fbcfe8'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.restore()

      const pedX = heartX
      const pedY = heartY + heartSize * 0.65
      const pedW = heartSize * 0.3
      const pedH = heartSize * 0.08

      const pedGrad = ctx.createLinearGradient(pedX - pedW, pedY, pedX + pedW, pedY)
      pedGrad.addColorStop(0, '#475569')
      pedGrad.addColorStop(0.3, '#94a3b8')
      pedGrad.addColorStop(0.7, '#94a3b8')
      pedGrad.addColorStop(1, '#475569')
      ctx.fillStyle = pedGrad
      ctx.beginPath()
      ctx.ellipse(pedX, pedY, pedW, pedH, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#334155'
      ctx.beginPath()
      ctx.ellipse(pedX, pedY + pedH * 0.5, pedW * 0.8, pedH * 1.2, 0, 0, Math.PI * 2)
      ctx.fill()

      for (let i = 0; i < flowers.length; i++) {
        const f = flowers[i]
        const headX = f.x + f.bendX
        const headY = f.baseY - f.stemH * f.scale + f.bendY

        const sway = Math.sin(time * f.swaySpeed + f.swayPhase) * f.swayAmp

        const dx = mouseX - f.x
        const dy = mouseY - (f.baseY - f.stemH * f.scale * 0.5)
        const dist = Math.sqrt(dx * dx + dy * dy)
        const threshold = 120

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
  }, [])

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
          <div className="pointer-events-auto">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-white/40 text-sm font-sans text-center mb-4"
            >
              gerakkan kursor ke ladang bunga ✦
            </motion.p>

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
