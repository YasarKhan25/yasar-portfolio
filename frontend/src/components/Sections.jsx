import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SKILLS, EXPERIENCE, CERTS, DEVLOGS, REPOS } from '../data/data'

/* ─── FADE-IN WRAPPER ──────────────────────────── */
export function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef()
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(22px)', transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      {children}
    </div>
  )
}

/* ─── SECTION WRAPPER ──────────────────────────── */
function Sec({ id, alt, children }) {
  return (
    <section id={id} style={{ padding: '100px 5%', background: alt ? 'var(--bg2)' : 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>{children}</div>
    </section>
  )
}

function SecHead({ tag, title, sub, center }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 50 }}>
      <div className="stag" style={{ justifyContent: center ? 'center' : 'flex-start', marginBottom: 12 }}>{tag}</div>
      <h2 className="font-head" style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, letterSpacing: 1, lineHeight: 1.1, marginBottom: 10 }}
        dangerouslySetInnerHTML={{ __html: title }} />
      {sub && <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.75, maxWidth: sub.length > 80 ? 580 : 'none', margin: center ? '0 auto' : 0 }}>{sub}</p>}
    </div>
  )
}

/* ─── ABOUT ────────────────────────────────────── */
export function About({ onResume }) {
  const highlights = [
    { icon: '⚙️', t: 'Gameplay Systems', d: 'Player controllers, enemy AI, physics, state machines, inventory & quest logic' },
    { icon: '🧪', t: 'QA & Testing', d: 'Structured test cases, bug tracking, regression testing, Unity Profiler' },
    { icon: '🧠', t: 'Technical Depth', d: 'Unity architecture, Scriptable Objects, clean OOP, coroutines, event-driven design' },
    { icon: '🚀', t: 'Shipping Mindset', d: 'Agile collaboration, deadline-driven delivery, rapid prototyping & iteration' },
  ]
  return (
    <Sec id="about" alt>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 320px) 1fr', gap: 60, alignItems: 'start' }}>
        {/* Card */}
        <FadeIn>
          <div style={{ background: 'var(--card2)', border: '1px solid var(--border)', padding: 28, position: 'sticky', top: 90 }}>
            <div style={{ width: '100%', aspectRatio: 1, background: 'linear-gradient(135deg, rgba(0,210,255,.08), rgba(168,85,247,.08))', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', marginBottom: 20 }}>🕹️</div>
            {[['Role','Unity Developer'],['Secondary','QA / Game Tester'],['Location','Chennai, India'],['Company','Huntdown Gaming'],['Status','Open to Work ●'],['Target','Zynga · Kwalee · Brewed']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.8rem' }}>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>{k}</span>
                <span style={{ color: k === 'Status' ? '#22c55e' : k === 'Target' ? 'var(--c2)' : 'var(--c1)', fontWeight: 600, fontSize: '0.75rem' }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="https://github.com/YasarKhan25" target="_blank" rel="noreferrer" className="btn btn-o" style={{ justifyContent: 'center', fontSize: '0.6rem' }}>🐙 GitHub</a>
              <a href="https://www.linkedin.com/in/yasarkhan42/" target="_blank" rel="noreferrer" className="btn btn-g" style={{ justifyContent: 'center', fontSize: '0.6rem' }}>💼 LinkedIn</a>
            </div>
          </div>
        </FadeIn>

        {/* Text */}
        <div>
          <FadeIn delay={0.1}>
            <div className="stag" style={{ marginBottom: 12 }}>Who I Am</div>
            <h2 className="font-head" style={{ fontSize: 'clamp(1.9rem,4vw,3rem)', fontWeight: 700, marginBottom: 20, lineHeight: 1.1 }}>
              Building Games That <span style={{ color: 'var(--c1)' }}>Feel Right</span>
            </h2>
            <div style={{ color: 'var(--muted)', lineHeight: 1.88, fontSize: '0.92rem' }}>
              <p style={{ marginBottom: 14 }}>I'm <strong style={{ color: 'var(--text)' }}>Mohammed Shaheer Yasar Khan</strong> — a Unity game developer based in Chennai with a deep focus on the systems that make games tick. Not just graphics or UI, but the <strong style={{ color: 'var(--text)' }}>physics that feel weighty</strong>, the <strong style={{ color: 'var(--text)' }}>AI that feels intelligent</strong>, and the <strong style={{ color: 'var(--text)' }}>controllers that feel responsive</strong>.</p>
              <p style={{ marginBottom: 14 }}>At <strong style={{ color: 'var(--text)' }}>Huntdown Gaming Solutions</strong> (Bengaluru), I shipped gameplay features in Agile sprints that improved player interaction flow by <strong style={{ color: 'var(--c1)' }}>25%</strong> and boosted runtime performance by <strong style={{ color: 'var(--c1)' }}>30%</strong>. I resolved <strong style={{ color: 'var(--c1)' }}>50+ bugs</strong> using structured profiling — not guesswork.</p>
              <p>My goal is to contribute to a studio like <strong style={{ color: 'var(--text)' }}>Zynga</strong>, <strong style={{ color: 'var(--text)' }}>Kwalee</strong>, or <strong style={{ color: 'var(--text)' }}>Brewed Games</strong> where gameplay systems and player experience are taken seriously.</p>
            </div>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 28 }}>
            {highlights.map((h, i) => (
              <FadeIn key={h.t} delay={0.15 + i * 0.08}>
                <div style={{ background: 'var(--card2)', border: '1px solid var(--border)', borderLeft: '2px solid var(--c1)', padding: 14, transition: '0.3s', cursor: 'default' }}
                  onMouseEnter={e => e.currentTarget.style.borderLeftColor = 'var(--c2)'}
                  onMouseLeave={e => e.currentTarget.style.borderLeftColor = 'var(--c1)'}>
                  <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{h.icon}</div>
                  <div className="font-head" style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>{h.t}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--muted)', lineHeight: 1.5 }}>{h.d}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </Sec>
  )
}

/* ─── SKILLS ───────────────────────────────────── */
function SkillBar({ n, p, color = 'var(--c1)' }) {
  const ref = useRef()
  const fillRef = useRef()
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => { if (fillRef.current) fillRef.current.style.width = p + '%' }, 80); obs.disconnect() }
    }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [p])
  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.8rem' }}>
        <span style={{ fontWeight: 600 }}>{n}</span>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', color: 'var(--c1)' }}>{p}%</span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)' }}>
        <div ref={fillRef} className="skill-fill" style={{ width: 0, background: `linear-gradient(90deg, ${color}, var(--c3))`, height: '100%' }} />
      </div>
    </div>
  )
}

const SKILL_COLORS = { 'Game Dev': 'var(--c1)', 'QA & Testing': 'var(--c2)', Languages: 'var(--c3)', Tools: 'var(--c4)' }
const SKILL_ICONS = { 'Game Dev': '🎮', 'QA & Testing': '🧪', Languages: '💻', Tools: '🛠️' }

export function Skills() {
  return (
    <Sec id="skills">
      <SecHead tag="Arsenal" title='Technical <span style="color:var(--c3)">Skills</span>' sub="Tools and technologies used to build, test, and ship games." center />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 1, background: 'var(--border)' }}>
        {Object.entries(SKILLS).map(([cat, items], i) => (
          <FadeIn key={cat} delay={i * 0.08}>
            <div style={{ background: 'var(--card)', padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 36, height: 36, background: 'rgba(0,210,255,0.07)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{SKILL_ICONS[cat]}</div>
                <div className="font-head" style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{cat}</div>
              </div>
              {items.map(s => <SkillBar key={s.n} n={s.n} p={s.p} color={SKILL_COLORS[cat]} />)}
            </div>
          </FadeIn>
        ))}
      </div>
    </Sec>
  )
}

/* ─── EXPERIENCE ────────────────────────────────── */
export function Experience() {
  return (
    <Sec id="experience" alt>
      <SecHead tag="Background" title='Experience <span style="color:var(--c1)">&amp; Education</span>' center />
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <div style={{ position: 'relative', paddingLeft: 28, borderLeft: '1px solid var(--border)' }}>
          {EXPERIENCE.map((e, i) => (
            <FadeIn key={i} delay={i * 0.1} style={{ marginBottom: 32, position: 'relative' }}>
              <div className="tl-dot" style={{ position: 'absolute', left: -33, top: 4, background: e.color }} />
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: e.color, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>{e.period}</div>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: 22 }}>
                <h4 className="font-head" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>{e.role}</h4>
                <div style={{ color: 'var(--c2)', fontSize: '0.82rem', marginBottom: 14 }}>{e.company} · {e.location}</div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {e.bullets.map((b, j) => (
                    <li key={j} style={{ display: 'flex', gap: 8, color: 'var(--muted)', fontSize: '0.82rem', lineHeight: 1.75 }}>
                      <span style={{ color: 'var(--c1)', flexShrink: 0 }}>▸</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}

          {/* Certs */}
          <FadeIn delay={0.4}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 14 }}>Certifications</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 1, background: 'var(--border)' }}>
              {CERTS.map(c => (
                <a key={c.name} href="https://www.linkedin.com/in/yasarkhan42/" target="_blank" rel="noreferrer"
                  style={{ background: 'var(--card)', padding: 16, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit', transition: '0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--card2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--card)'}>
                  <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.56rem', color: 'var(--c1)', marginTop: 2 }}>{c.sub} ↗</div>
                  </div>
                </a>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </Sec>
  )
}

/* ─── GITHUB ────────────────────────────────────── */
export function GitHub() {
  return (
    <Sec id="github">
      <SecHead tag="Open Source" title='GitHub <span style="color:var(--c1)">Repositories</span>' sub="Unity systems, game prototypes, and tools — all open source and documented." center />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: 'var(--border)', maxWidth: 1100, margin: '0 auto' }}>
        {REPOS.map((r, i) => (
          <FadeIn key={r.name} delay={i * 0.06}>
            <a href="https://github.com/YasarKhan25" target="_blank" rel="noreferrer"
              style={{ background: 'var(--card)', padding: 22, display: 'block', textDecoration: 'none', color: 'inherit', transition: '0.3s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--card2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--card)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.95rem', fontWeight: 700, color: 'var(--c1)' }}>{r.name}</span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.56rem', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>{r.lang}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.65, marginBottom: 12 }}>{r.desc}</p>
              <div style={{ display: 'flex', gap: 14, fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: 'var(--muted)' }}>
                <span>⭐ {r.stars}</span><span>🍴 {r.forks}</span><span>🔤 C#</span>
              </div>
            </a>
          </FadeIn>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <a href="https://github.com/YasarKhan25" target="_blank" rel="noreferrer" className="btn btn-o">🐙 View All on GitHub</a>
      </div>
    </Sec>
  )
}

/* ─── DEVLOG ────────────────────────────────────── */
export function Devlog() {
  const [active, setActive] = useState(null)
  return (
    <Sec id="devlog" alt>
      <SecHead tag="Engineering Insights" title='Dev<span style="color:var(--c2)">log</span> &amp; Breakdowns'
        sub="Behind the code — how I approach game engineering problems and debug complex systems." center />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 1, background: 'var(--border)', maxWidth: 1100, margin: '0 auto' }}>
        {DEVLOGS.map((l, i) => (
          <FadeIn key={i} delay={i * 0.06}>
            <div onClick={() => setActive(i)} style={{ background: 'var(--card)', padding: 28, cursor: 'pointer', transition: '0.3s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--card2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--card)'}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>{l.tag}</div>
              <h3 className="font-head" style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{l.title}</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.75, marginBottom: 16 }}>{l.excerpt}</p>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: 'var(--c1)', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                Read Breakdown <span style={{ display: 'inline-block', transition: '0.3s' }}>→</span>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Modal */}
      {active !== null && (
        <div onClick={() => setActive(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(2,5,12,0.94)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(8px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', maxWidth: 700, width: '100%', animation: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.66rem', color: 'var(--c1)', letterSpacing: '2px', textTransform: 'uppercase' }}>// DEVLOG</span>
              <button onClick={() => setActive(null)} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', width: 28, height: 28, cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px', maxHeight: '70vh', overflowY: 'auto' }}>
              <h3 className="font-head" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>{DEVLOGS[active].title}</h3>
              <pre style={{ fontFamily: 'Exo 2, sans-serif', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.9, whiteSpace: 'pre-wrap', margin: 0 }}>{DEVLOGS[active].body}</pre>
            </div>
          </div>
        </div>
      )}
    </Sec>
  )
}

/* ─── FOOTER ────────────────────────────────────── */
export function Footer() {
  return (
    <footer style={{ padding: '32px 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, borderTop: '1px solid var(--border)' }}>
      <div className="font-head" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--c1)', letterSpacing: '3px', textTransform: 'uppercase' }}>Yasar Portfolio</div>
      <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '1px' }}>© 2026 Mohammed Shaheer Yasar Khan · Unity 3D Game Developer · Chennai</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {[['🐙', 'https://github.com/YasarKhan25'],['💼', 'https://www.linkedin.com/in/yasarkhan42/'],['📧','mailto:msym5556@gmail.com']].map(([icon, href]) => (
          <a key={icon} href={href} target="_blank" rel="noreferrer"
            style={{ width: 34, height: 34, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', color: 'var(--muted)', transition: '0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c1)'; e.currentTarget.style.color = 'var(--c1)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
            {icon}
          </a>
        ))}
      </div>
    </footer>
  )
}
