import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { STATS } from '../data/data'

const WORDS = ['Unity Game Developer', 'Gameplay Systems Builder', 'C# Programmer', 'QA & Game Tester', 'Pixel Blasters Creator']

function useTypewriter() {
  const [text, setText] = useState('')
  const state = useRef({ wi: 0, ci: 0, del: false })
  useEffect(() => {
    let t
    function tick() {
      const { wi, ci, del } = state.current
      const word = WORDS[wi]
      if (!del && ci < word.length) {
        setText(word.slice(0, ci + 1)); state.current.ci++; t = setTimeout(tick, 72)
      } else if (!del && ci === word.length) {
        state.current.del = true; t = setTimeout(tick, 2200)
      } else if (del && ci > 0) {
        setText(word.slice(0, ci - 1)); state.current.ci--; t = setTimeout(tick, 36)
      } else {
        state.current.del = false; state.current.wi = (wi + 1) % WORDS.length; t = setTimeout(tick, 280)
      }
    }
    t = setTimeout(tick, 600)
    return () => clearTimeout(t)
  }, [])
  return text
}

function ParticleCanvas() {
  const ref = useRef()
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d')
    let W, H, nodes, mx, my, raf
    function init() {
      W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight
      mx = W / 2; my = H / 2
      nodes = Array.from({ length: 80 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
        r: Math.random() * 1.4 + .4,
        c: Math.random() > .7 ? '#00d2ff' : Math.random() > .5 ? '#ff6b35' : '#a855f7',
        o: Math.random() * .4 + .08,
      }))
    }
    function draw() {
      ctx.clearRect(0, 0, W, H)
      nodes.forEach(n => {
        n.x = (n.x + n.vx + W) % W; n.y = (n.y + n.vy + H) % H
        const dx = n.x - mx, dy = n.y - my, d = Math.hypot(dx, dy)
        if (d < 120) { n.x += dx / d * .7; n.y += dy / d * .7 }
        ctx.globalAlpha = n.o; ctx.fillStyle = n.c
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill()
      })
      ctx.globalAlpha = 1
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y)
          if (d < 110) {
            ctx.globalAlpha = (1 - d / 110) * .09
            ctx.strokeStyle = '#00d2ff'; ctx.lineWidth = .5
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    const onMove = e => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top }
    const onResize = () => init()
    init(); draw()
    cv.addEventListener('mousemove', onMove)
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); cv.removeEventListener('mousemove', onMove); window.removeEventListener('resize', onResize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}

export default function Hero({ onResume }) {
  const typed = useTypewriter()

  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '120px 5% 80px' }}>
      <ParticleCanvas />

      {/* Grid overlay */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.45 }} />

      {/* Radial vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 35%, var(--bg) 100%)' }} />

      {/* Blobs */}
      <div style={{ position: 'absolute', top: '20%', left: '60%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '30%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(0,210,255,0.06) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 820 }}>
        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(0,210,255,0.05)', border: '1px solid rgba(0,210,255,0.2)', padding: '6px 14px', marginBottom: 28, fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '2px', color: 'var(--c1)', textTransform: 'uppercase' }}
        >
          <span className="status-pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          Available · Open to Game Dev & QA Roles
        </motion.div>

        {/* Name */}
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="font-head" style={{ fontSize: 'clamp(3rem, 9vw, 7rem)', fontWeight: 700, letterSpacing: '2px', lineHeight: 0.92, textTransform: 'uppercase', marginBottom: 8 }}>
            <div style={{ color: 'var(--text)' }}>Yasar</div>
            <div style={{ color: 'var(--c1)', textShadow: '0 0 50px rgba(0,210,255,0.4)' }}>Khan.</div>
          </div>
        </motion.div>

        {/* Role typewriter */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ fontFamily: 'Space Mono, monospace', fontSize: 'clamp(0.72rem, 1.8vw, 1rem)', color: 'var(--c2)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 18 }}>
          {typed}<span className="cursor-blink">_</span>
        </motion.div>

        {/* Tagline */}
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ fontSize: 'clamp(1.05rem, 2.4vw, 1.45rem)', fontWeight: 300, color: 'var(--muted)', marginBottom: 10, maxWidth: 580, lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--text)', fontWeight: 600 }}>Unity Game Developer & Gameplay Systems Builder</strong>
        </motion.p>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', color: 'var(--muted)', borderLeft: '2px solid var(--c2)', paddingLeft: 14, marginBottom: 36, lineHeight: 1.8, maxWidth: 560 }}>
          Building gameplay systems that make games feel alive — enemy AI, player controllers,<br className="hide-sm"/>
          physics interactions, and QA pipelines that ship production-ready code.
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 52 }}>
          <button onClick={() => go('projects')} className="btn btn-p">▶ View Projects</button>
          <a href="https://github.com/YasarKhan25" target="_blank" rel="noreferrer" className="btn btn-o">🐙 GitHub</a>
          <button onClick={onResume} className="btn btn-or">↓ Download Resume</button>
          <button onClick={() => go('contact')} className="btn btn-g">📨 Contact</button>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', maxWidth: 560 }}>
          {STATS.map(s => (
            <div key={s.l} style={{ background: 'var(--bg)', padding: '16px 12px', textAlign: 'center' }}>
              <div className="font-head" style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--c1)', lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.56rem', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 5 }}>{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-bounce" style={{ position: 'absolute', bottom: 28, left: '5%', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase', zIndex: 2 }}>
        <div style={{ width: 36, height: 1, background: 'var(--c1)', opacity: 0.5 }} />
        scroll to explore
      </div>
    </section>
  )
}
