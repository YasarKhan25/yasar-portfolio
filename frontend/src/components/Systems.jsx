import { SYSTEMS } from '../data/data'
import { FadeIn } from './Sections'

export default function Systems() {
  return (
    <section id="systems" style={{ padding: '100px 5%', background: 'var(--bg2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div className="stag" style={{ justifyContent: 'center', marginBottom: 12 }}>Engineering</div>
          <h2 className="font-head" style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: 10 }}>
            Gameplay Systems <span style={{ color: 'var(--c2)' }}>I Built</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.75 }}>
            Core systems that power gameplay — engineered with Unity &amp; C#, built for performance and scalability.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 1, background: 'var(--border)' }}>
          {SYSTEMS.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.07}>
              <div style={{ background: 'var(--card)', padding: 28, transition: '0.3s', height: '100%' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--card2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--card)'}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: 14 }}>{s.icon}</span>
                <div className="font-head" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', color: 'var(--c1)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>{s.tech}</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.8, marginBottom: 14 }}>{s.desc}</p>
                <pre className="code-block">{s.code}</pre>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
