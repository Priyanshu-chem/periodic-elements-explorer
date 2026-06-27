'use client'

import { useRef, useEffect } from 'react'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
  twinklePhase: number
}

interface ShootingStar {
  x: number
  y: number
  dx: number
  dy: number
  length: number
  opacity: number
  life: number
  maxLife: number
}

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const shootingStarsRef = useRef<ShootingStar[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight
    let frame = 0
    let animId = 0

    const initStars = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
      const stars: Star[] = []
      for (let i = 0; i < 200; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 2.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.15,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
        })
      }
      starsRef.current = stars
    }

    const spawnShootingStar = () => {
      if (shootingStarsRef.current.length >= 3) return
      const angle = Math.PI / 3 + Math.random() * Math.PI / 6
      const speed = 6 + Math.random() * 8
      shootingStarsRef.current.push({
        x: Math.random() * w * 1.5 - w * 0.25,
        y: Math.random() * h * 0.3,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length: 60 + Math.random() * 80,
        opacity: 0.7 + Math.random() * 0.3,
        life: 0,
        maxLife: 50 + Math.random() * 40,
      })
    }

    const onResize = () => initStars()

    const onMouse = (e: MouseEvent) => {
      const mx = (e.clientX / w - 0.5) * 2
      const my = (e.clientY / h - 0.5) * 2
      mouseRef.current = { x: mx, y: my }
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate(${mx * 15}px, ${my * 15}px)`
      }
    }

    initStars()
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouse)

    const animate = () => {
      ctx.clearRect(0, 0, w, h)
      const { x: mx, y: my } = mouseRef.current

      for (const star of starsRef.current) {
        const twinkle = Math.sin(frame * star.twinkleSpeed + star.twinklePhase)
        const alpha = star.opacity * (0.5 + 0.5 * twinkle)
        const parallax = star.size / 3
        const px = star.x + mx * 10 * parallax
        const py = star.y + my * 10 * parallax

        ctx.beginPath()
        ctx.arc(px, py, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.fill()

        if (star.size > 2) {
          ctx.beginPath()
          ctx.arc(px, py, star.size * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200,220,255,${alpha * 0.12})`
          ctx.fill()
        }
      }

      const ss = shootingStarsRef.current
      for (let i = ss.length - 1; i >= 0; i--) {
        const s = ss[i]
        s.x += s.dx
        s.y += s.dy
        s.life++
        if (s.life > s.maxLife || s.x > w + 200 || s.y > h + 200) {
          ss.splice(i, 1)
          continue
        }
        const lifeRatio = s.life / s.maxLife
        const alpha = s.opacity * (1 - lifeRatio)
        const speed = Math.sqrt(s.dx * s.dx + s.dy * s.dy)
        const nx = s.dx / speed
        const ny = s.dy / speed
        const tx = s.x - nx * s.length
        const ty = s.y - ny * s.length

        const grad = ctx.createLinearGradient(tx, ty, s.x, s.y)
        grad.addColorStop(0, `rgba(255,255,255,0)`)
        grad.addColorStop(1, `rgba(255,255,255,${alpha})`)
        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(s.x, s.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.6})`
        ctx.fill()
      }

      if (frame % 120 === 0) {
        spawnShootingStar()
      }

      frame++
      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  const nebulaClouds = [
    { size: 600, color: '100,60,200', opacity: 0.12, top: '10%', left: '20%', blur: 60, delay: '0s', reverse: false },
    { size: 500, color: '200,80,150', opacity: 0.1, top: 'auto', bottom: '15%', left: 'auto', right: '10%', blur: 60, delay: '0s', reverse: true },
    { size: 400, color: '50,150,220', opacity: 0.08, top: '50%', left: '60%', blur: 50, delay: '5s', reverse: false },
    { size: 350, color: '180,120,60', opacity: 0.06, top: '20%', right: '25%', blur: 50, delay: '10s', reverse: false },
    { size: 450, color: '80,200,180', opacity: 0.06, bottom: '30%', left: '40%', blur: 60, delay: '15s', reverse: false },
  ]

  const lightRays = [
    { top: '30%', rotate: -15, color: '100,150,255', dur: 20, delay: '0s' },
    { top: '60%', rotate: 10, color: '200,150,255', dur: 25, delay: '5s' },
    { top: '45%', rotate: -5, color: '150,200,255', dur: 30, delay: '10s' },
  ]

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0a2e 0%, #1a0a2e 30%, #0d0d3a 60%, #0a0a2e 100%)',
      }}
    >
      <div
        ref={parallaxRef}
        style={{
          transition: 'transform 0.15s ease-out',
        }}
      >
        {nebulaClouds.map((n, i) => (
          <div
            key={`nebula-${i}`}
            style={{
              position: 'absolute',
              width: n.size,
              height: n.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(${n.color},${n.opacity}) 0%, rgba(${n.color},0) 70%)`,
              top: n.top,
              bottom: n.bottom,
              left: n.left,
              right: n.right,
              filter: `blur(${n.blur}px)`,
              translate: '0px 0px',
              animation: `driftSlow ${35 + i * 5}s ease-in-out infinite ${n.delay}${n.reverse ? ' reverse' : ''}`,
            }}
          />
        ))}

        <div
          style={{
            position: 'absolute',
            width: 300,
            height: 120,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(150,100,255,0.04) 0%, rgba(150,100,255,0) 70%)',
            top: '25%',
            left: '5%',
            transform: 'rotate(-30deg)',
            filter: 'blur(30px)',
            scale: 1,
            animation: 'galaxyPulse 60s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 250,
            height: 100,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(100,180,255,0.03) 0%, rgba(100,180,255,0) 70%)',
            bottom: '20%',
            right: '5%',
            transform: 'rotate(45deg)',
            filter: 'blur(25px)',
            scale: 1,
            animation: 'galaxyPulse 70s ease-in-out infinite reverse',
          }}
        />

        {lightRays.map((r, i) => (
          <div
            key={`ray-${i}`}
            style={{
              position: 'absolute',
              width: '200%',
              height: '1px',
              background: `linear-gradient(90deg, transparent 0%, rgba(${r.color},0.03) 50%, transparent 100%)`,
              top: r.top,
              transform: `rotate(${r.rotate}deg)`,
              translate: '-50% 0',
              animation: `raySlide ${r.dur}s linear infinite ${r.delay}`,
            }}
          />
        ))}
      </div>

      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
        }}
      />

      <style>{`
        @keyframes driftSlow {
          0%, 100% { translate: 0px 0px; }
          25% { translate: 30px -20px; }
          50% { translate: -20px 30px; }
          75% { translate: 15px 15px; }
        }
        @keyframes galaxyPulse {
          0%, 100% { scale: 1; }
          50% { scale: 1.08; }
        }
        @keyframes raySlide {
          0% { translate: -50% 0; }
          100% { translate: 0% 0; }
        }
      `}</style>
    </div>
  )
}
