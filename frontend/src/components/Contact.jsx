import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { FadeIn } from './Sections'

// ─── PASTE YOUR EMAILJS CREDENTIALS HERE ─────────────
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID'   // service_2q0czut
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'  // template_udvc8ev
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'   // XNcZn4I-kSYZvXJJk
// ─────────────────────────────────────────────────────

const TOAST = {
  style: {
    background: 'var(--card)', color: 'var(--text)',
    border: '1px solid var(--c1)',
    fontFamily: 'Space Mono, monospace', fontSize: '0.72rem',
  }
}

const LINKS = [
  { icon: '📧', label: 'Email',    val: 'msym5556@gmail.com', href: 'mailto:msym5556@gmail.com' },
  { icon: '💼', label: 'LinkedIn', val: 'in/yasarkhan42',     href: 'https://www.linkedin.com/in/yasarkhan42/' },
  { icon: '🐙', label: 'GitHub',   val: 'YasarKhan25',        href: 'https://github.com/YasarKhan25' },
]

export default function Contact({ onResume }) {
  const [form, setForm]       = useState({ name: '', email: '', company: '', type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [ready, setReady]     = useState(false)

  // Load EmailJS SDK once from CDN
  useEffect(() => {
    if (window.emailjs) { window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); setReady(true); return }
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'
    s.onload = () => { window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); setReady(true) }
    s.onerror = () => setReady(false)
    document.head.appendChild(s)
  }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:  form.name,
        from_email: form.email,
        company:    form.company || 'Not specified',
        type:       form.type    || 'Not specified',
        message:    form.message,
        reply_to:   form.email,
      })
      toast.success("Message sent! I'll reply within 24hrs 🎮", TOAST)
      setForm({ name: '', email: '', company: '', type: '', message: '' })
    } catch (err) {
      console.error('EmailJS error:', err)
      // Fallback — open Gmail compose so no message is ever lost
      const sub  = encodeURIComponent(`[Portfolio] ${form.type || 'Inquiry'} from ${form.name}`)
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nOpportunity: ${form.type}\n\nMessage:\n${form.message}`)
      window.open(`https://mail.google.com/mail/?view=cm&to=msym5556@gmail.com&su=${sub}&body=${body}`, '_blank')
      toast.success('Opening Gmail as fallback — please send from there.', TOAST)
    }
    setLoading(false)
  }

  return (
    <section id="contact" style={{ padding: '100px 5%', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div className="stag" style={{ justifyContent: 'center', marginBottom: 12 }}>Hire Me</div>
          <h2 className="font-head" style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: 10 }}>
            Let's Build Something <span style={{ color: 'var(--c1)' }}>Great</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 24 }}>Open to Game Developer and Game QA opportunities at innovative studios.</p>
          <span className="badge bc" style={{ fontSize: '0.65rem', padding: '6px 16px' }}>▶ Available for Full-Time &amp; Freelance</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, maxWidth: 1000, margin: '48px auto 0' }}>

          {/* ── Left — contact info ── */}
          <FadeIn>
            <h3 className="font-head" style={{ fontSize: '1.55rem', fontWeight: 700, marginBottom: 14 }}>Get In Touch</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: 28 }}>
              Whether you're building the next hit mobile game or need a developer who thinks deeply
              about gameplay systems and player experience — I'd love to talk.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LINKS.map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'var(--card2)', border: '1px solid var(--border)', textDecoration: 'none', color: 'inherit', transition: '0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c1)'; e.currentTarget.style.color = 'var(--c1)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'inherit' }}>
                  <div style={{ width: 34, height: 34, background: 'rgba(0,210,255,0.07)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', flexShrink: 0 }}>{l.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{l.label}</div>
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', color: 'var(--muted)', marginTop: 2 }}>{l.val}</div>
                  </div>
                </a>
              ))}
              <button onClick={onResume}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'var(--card2)', border: '1px solid var(--border)', cursor: 'pointer', color: 'inherit', transition: '0.3s', width: '100%', textAlign: 'left' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c1)'; e.currentTarget.style.color = 'var(--c1)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'inherit' }}>
                <div style={{ width: 34, height: 34, background: 'rgba(0,210,255,0.07)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', flexShrink: 0 }}>📄</div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Resume</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', color: 'var(--muted)', marginTop: 2 }}>Download PDF</div>
                </div>
              </button>
            </div>
          </FadeIn>

          {/* ── Right — form ── */}
          <FadeIn delay={0.15}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['name','Name','Your name'],['email','Email','your@email.com']].map(([k,l,p]) => (
                  <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>{l}</label>
                    <input type={k === 'email' ? 'email' : 'text'} className="fi" placeholder={p} value={form[k]} onChange={set(k)} required />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>Studio / Company</label>
                <input type="text" className="fi" placeholder="Zynga / Kwalee / Indie Studio..." value={form.company} onChange={set('company')} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>Opportunity Type</label>
                <select className="fi" value={form.type} onChange={set('type')}>
                  <option value="">Select...</option>
                  <option>Game Developer (Unity)</option>
                  <option>Game QA Tester</option>
                  <option>Gameplay Programmer</option>
                  <option>Freelance Project</option>
                  <option>Other</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>Message</label>
                <textarea className="fi" rows={4} placeholder="Tell me about the role or project..." value={form.message} onChange={set('message')} required style={{ resize: 'none' }} />
              </div>
              <button type="submit" disabled={loading}
                style={{ background: loading ? 'rgba(0,210,255,0.5)' : 'var(--c1)', color: '#000', border: 'none', padding: 13, fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: '0.3s' }}>
                {loading ? '⏳ Sending...' : '▶ Send Message'}
              </button>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6 }}>
                Message goes directly to my inbox · I reply within 24hrs
              </p>
            </form>
          </FadeIn>

        </div>
      </div>
    </section>
  )
}
