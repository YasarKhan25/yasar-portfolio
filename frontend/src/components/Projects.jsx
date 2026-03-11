import { useState, useRef, useEffect, useCallback } from 'react'
import { PROJECTS } from '../data/data'
import { RUNNERS, stopGame } from '../games/engines'
import { FadeIn } from './Sections'

const CATS = ['all', 'action', 'runner', 'puzzle', 'racing']

/* ─── GAME CANVAS PANEL ───────────────────────── */
function GamePanel({ id, info, onClose }) {
  const cvRef = useRef()
  useEffect(() => {
    stopGame()
    const cv = cvRef.current
    if (!cv) return
    cv.width = 700; cv.height = 394
    setTimeout(() => RUNNERS[id]?.(cv), 60)
    return () => stopGame()
  }, [id])
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,5,12,0.95)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(10px)' }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', maxWidth: 760, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.66rem', color: 'var(--c1)', letterSpacing: '2px', textTransform: 'uppercase' }}>
            🎮 GAME DEMO — USE KEYBOARD TO PLAY
          </span>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', width: 28, height: 28, cursor: 'pointer', fontSize: '0.9rem', transition: '0.3s' }}>✕</button>
        </div>
        <div style={{ background: '#000', lineHeight: 0 }}>
          <canvas ref={cvRef} className="game-cv" style={{ display: 'block', width: '100%', height: 'auto', cursor: 'crosshair' }} />
        </div>
        <div style={{ padding: '10px 16px', fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', color: 'var(--muted)', textAlign: 'center', letterSpacing: '1px' }}>{info}</div>
      </div>
    </div>
  )
}

/* ─── PROJECT CARD ────────────────────────────── */
function ProjCard({ p, idx }) {
  const [demo, setDemo] = useState(false)
  const thumbClass = `th-${p.id}`
  return (
    <>
      <FadeIn delay={idx * 0.06} className="proj-card" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        {/* Thumbnail */}
        <div className={thumbClass} style={{ height: 148, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', cursor: 'pointer', fontSize: '3.5rem' }}
          onClick={() => setDemo(true)}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, background: 'rgba(0,0,0,0.45)', transition: '0.3s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--c1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: '#000', transition: '0.3s' }}>▶</div>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: 'var(--c1)', letterSpacing: '2px', textTransform: 'uppercase' }}>Click to Play</span>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: 'rgba(0,210,255,0.3)', letterSpacing: '2px' }}>{String(idx+1).padStart(2,'0')}</span>
            <div style={{ display: 'flex', gap: 5 }}>
              {p.featured && <span className="badge bo">Featured</span>}
              <span className="badge bc">Live Demo</span>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
            {p.tags.map(t => <span key={t} className="badge bc">{t}</span>)}
          </div>

          {/* Title */}
          <div className="font-head" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 4, lineHeight: 1.2 }}>{p.title}</div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: 'var(--c2)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>{p.sub} · {p.genre}</div>

          {/* Meta */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16, padding: 12, background: 'var(--bg3, #050c18)', border: '1px solid var(--border)' }}>
            {[['Engine', p.engine], ['Platform', p.platform]].map(([k,v]) => (
              <div key={k} style={{ fontSize: '0.74rem' }}>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.56rem', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Mechanics */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', color: 'var(--c1)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>Key Mechanics</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {p.mechanics.map((m, i) => (
                <span key={m} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', color: i < 2 ? 'var(--c1)' : 'var(--muted)', background: i < 2 ? 'rgba(0,210,255,0.07)' : 'rgba(255,255,255,0.03)', border: `1px solid ${i < 2 ? 'rgba(0,210,255,0.18)' : 'rgba(255,255,255,0.07)'}`, padding: '3px 8px', letterSpacing: '0.5px' }}>{m}</span>
              ))}
            </div>
          </div>

          {/* Tech Breakdown */}
          <div style={{ background: '#020810', border: '1px solid var(--border)', borderLeft: '2px solid var(--c3)', padding: 14, marginBottom: 16 }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', color: 'var(--c3)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>🔧 Tech Breakdown</div>
            <p style={{ fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.75 }}>{p.breakdown}</p>
          </div>

          {/* Desc */}
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.75, marginBottom: 16 }}>{p.desc}</p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => setDemo(true)} className="btn btn-p" style={{ fontSize: '0.62rem', padding: '9px 18px' }}>▶ Full Demo</button>
            <a href={p.github} target="_blank" rel="noreferrer" className="btn btn-o" style={{ fontSize: '0.62rem', padding: '9px 18px' }}>🐙 GitHub</a>
          </div>
        </div>
      </FadeIn>

      {demo && <GamePanel id={p.id} info={p.info} onClose={() => setDemo(false)} />}
    </>
  )
}

/* ─── PROJECTS SECTION ────────────────────────── */
export default function Projects() {
  const [cat, setCat] = useState('all')
  const filtered = cat === 'all' ? PROJECTS : PROJECTS.filter(p => p.cat === cat)

  return (
    <section id="projects" style={{ padding: '100px 5%', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div className="stag" style={{ justifyContent: 'center', marginBottom: 12 }}>Portfolio</div>
          <h2 className="font-head" style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: 10 }}>
            Game Projects <span style={{ color: 'var(--c1)' }}>&amp; Prototypes</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: 32 }}>
            Each project includes a playable in-browser demo, tech breakdown, and key systems explained.
          </p>

          {/* Filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                style={{ background: cat === c ? 'rgba(0,210,255,0.06)' : 'transparent', border: `1px solid ${cat === c ? 'var(--c1)' : 'var(--border)'}`, color: cat === c ? 'var(--c1)' : 'var(--muted)', padding: '6px 16px', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: '0.3s' }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 1, background: 'var(--border)' }}>
          {filtered.map((p, i) => <ProjCard key={p.id} p={p} idx={i} />)}
        </div>
      </div>
    </section>
  )
}
