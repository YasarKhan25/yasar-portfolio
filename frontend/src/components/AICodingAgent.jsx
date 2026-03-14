import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeIn } from './Sections'

// ── Config ──────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ── Demo answers shown when backend is not configured ──────────────
const DEMO_ANSWERS = {
  default: `\`\`\`csharp
// Example: Unity enemy state machine
public class EnemyAI : MonoBehaviour {
    enum State { Patrol, Chase, Attack }
    State _state = State.Patrol;

    void Update() {
        switch (_state) {
            case State.Patrol:  Patrol();  break;
            case State.Chase:   Chase();   break;
            case State.Attack:  Attack();  break;
        }
    }

    void Patrol()  { /* move between waypoints */ }
    void Chase()   { /* NavMesh toward player   */ }
    void Attack()  { /* play anim + deal damage  */ }
}
\`\`\`
I'm running in **demo mode** — connect the Flask backend with a valid \`ANTHROPIC_API_KEY\` to get live AI responses for any coding question.`,
}

// ── Starter prompts ─────────────────────────────────────────────────
const STARTERS = [
  { icon: '🎮', text: 'Write a Unity C# player controller with jump and dash' },
  { icon: '🤖', text: 'Build an enemy AI with patrol, chase, and attack states' },
  { icon: '🐍', text: 'Create a Flask REST API with JWT authentication' },
  { icon: '⚛️', text: 'Build a React component with infinite scroll' },
  { icon: '🔧', text: 'Optimise this Unity script for better performance' },
  { icon: '🧪', text: 'Write unit tests for a C# inventory system' },
]

// ── Pricing tiers ───────────────────────────────────────────────────
const TIERS = [
  {
    name: 'Starter',
    price: '$29',
    period: '/mo',
    color: 'var(--c4)',
    features: [
      '100 AI queries / month',
      'Unity & C# support',
      'Code review & bug fix',
      'Community Discord',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/mo',
    color: 'var(--c1)',
    badge: '⚡ Most Popular',
    features: [
      'Unlimited AI queries',
      'All languages + engines',
      'Streaming responses',
      'Priority support',
      'Team access (3 seats)',
      'Code generation API',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    color: 'var(--c2)',
    features: [
      'Unlimited everything',
      'Custom system prompt',
      'Private deployment',
      'SLA + dedicated support',
      'Unlimited team seats',
      'White-label option',
    ],
    cta: 'Contact Us',
  },
]

// ── Tiny markdown → HTML renderer (code blocks + bold + inline code)
function renderMarkdown(text) {
  // Fenced code blocks
  text = text.replace(
    /```(\w*)\n?([\s\S]*?)```/g,
    (_, lang, code) =>
      `<pre class="ai-pre"><span class="ai-lang">${lang || 'code'}</span><code>${escHtml(code.trim())}</code></pre>`,
  )
  // Inline code
  text = text.replace(/`([^`]+)`/g, '<code class="ai-inline">$1</code>')
  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Bullet lists
  text = text.replace(/^• (.+)$/gm, '<li>$1</li>')
  text = text.replace(/(<li>[\s\S]*?<\/li>)+/g, m => `<ul>${m}</ul>`)
  // Line breaks
  text = text.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br/>')
  return `<p>${text}</p>`
}

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// ── Message bubble ───────────────────────────────────────────────────
function Bubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 14,
      }}
    >
      {!isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,var(--c1),var(--c3))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.85rem', flexShrink: 0, marginRight: 10, marginTop: 2,
        }}>🤖</div>
      )}
      <div
        style={{
          maxWidth: '80%',
          padding: isUser ? '10px 16px' : '14px 18px',
          background: isUser
            ? 'linear-gradient(135deg,rgba(0,210,255,0.18),rgba(0,210,255,0.08))'
            : 'var(--card2)',
          border: `1px solid ${isUser ? 'rgba(0,210,255,0.35)' : 'var(--border)'}`,
          fontSize: '0.84rem',
          lineHeight: 1.7,
          color: 'var(--text)',
          wordBreak: 'break-word',
        }}
        dangerouslySetInnerHTML={{ __html: isUser ? escHtml(msg.content) : renderMarkdown(msg.content) }}
      />
      {isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: '50%', background: 'var(--card2)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.85rem', flexShrink: 0, marginLeft: 10, marginTop: 2,
        }}>👤</div>
      )}
    </motion.div>
  )
}

// ── Typing indicator ─────────────────────────────────────────────────
function Typing() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,var(--c1),var(--c3))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0,
      }}>🤖</div>
      <div style={{ display: 'flex', gap: 5, padding: '12px 16px', background: 'var(--card2)', border: '1px solid var(--border)' }}>
        {[0, 0.2, 0.4].map(d => (
          <motion.div key={d}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: d }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c1)' }}
          />
        ))}
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────
export default function AICodingAgent() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm **CodeCraft AI** — your specialized coding assistant powered by Claude claude-sonnet-4-5.\n\nI'm expert in Unity/C#, Python, JavaScript, React, and software architecture. Ask me to write code, review your scripts, explain patterns, or debug issues.\n\nWhat can I build for you today?`,
    },
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()
  const textareaRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const userText = (text || input).trim()
    if (!userText || loading) return
    setInput('')

    const history = [...messages, { role: 'user', content: userText }]
    setMessages(history)
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(m => ({ role: m.role, content: m.content })),
          stream: false,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (e) {
      // Demo mode fallback
      const demo = DEMO_ANSWERS.default
      setMessages(prev => [...prev, { role: 'assistant', content: demo }])
    }

    setLoading(false)
  }

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <section id="agent" style={{ padding: '100px 5%', background: 'var(--bg2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Header ── */}
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="stag" style={{ justifyContent: 'center', marginBottom: 12 }}>AI Product</div>
            <h2 className="font-head" style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: 12 }}>
              CodeCraft AI — <span style={{ color: 'var(--c1)' }}>Coding Agent</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', maxWidth: 560, margin: '0 auto 20px' }}>
              A specialized AI coding assistant powered by Claude claude-sonnet-4-5. Expert in Unity, C#,
              Python, React, and software architecture — built to accelerate developer productivity.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
              {['Claude claude-sonnet-4-5','Unity / C#','Python','React / JS','Code Review','Architecture'].map(t => (
                <span key={t} className="badge bc" style={{ fontSize: '0.6rem', padding: '5px 12px' }}>{t}</span>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── Chat Window ── */}
        <FadeIn delay={0.1}>
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            marginBottom: 72, overflow: 'hidden',
            boxShadow: '0 0 60px rgba(0,210,255,0.05)',
          }}>
            {/* Titlebar */}
            <div style={{
              padding: '12px 20px', background: 'var(--card2)', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ff5f56','#ffbd2e','#27c93f'].map(c => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                ))}
              </div>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '1px' }}>
                CODECRAFT AI  ·  claude-sonnet-4-5  ·  coding-specialist
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#27c93f', boxShadow: '0 0 8px #27c93f' }} />
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: '#27c93f' }}>ONLINE</span>
              </div>
            </div>

            {/* Messages */}
            <div style={{ height: 420, overflowY: 'auto', padding: '20px 20px 8px', scrollbarWidth: 'thin' }}>
              <AnimatePresence initial={false}>
                {messages.map((m, i) => <Bubble key={i} msg={m} />)}
              </AnimatePresence>
              {loading && <Typing />}
              <div ref={bottomRef} />
            </div>

            {/* Starter prompts */}
            {messages.length <= 1 && (
              <div style={{ padding: '0 20px 14px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {STARTERS.map(s => (
                  <button key={s.text} onClick={() => send(s.text)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px', background: 'var(--card2)',
                      border: '1px solid var(--border)', cursor: 'pointer',
                      color: 'var(--muted)', fontSize: '0.7rem',
                      fontFamily: 'Space Mono, monospace', transition: '0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c1)'; e.currentTarget.style.color = 'var(--c1)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
                  >
                    {s.icon} {s.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input bar */}
            <div style={{
              padding: '12px 16px', borderTop: '1px solid var(--border)',
              display: 'flex', gap: 10, alignItems: 'flex-end',
            }}>
              <textarea
                ref={textareaRef}
                rows={2}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything about code… (Shift+Enter for new line)"
                style={{
                  flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)',
                  color: 'var(--text)', padding: '10px 14px', resize: 'none',
                  fontFamily: 'Space Mono, monospace', fontSize: '0.8rem', lineHeight: 1.6,
                  outline: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--c1)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
              <button onClick={() => send()} disabled={loading || !input.trim()}
                style={{
                  background: loading || !input.trim() ? 'rgba(0,210,255,0.25)' : 'var(--c1)',
                  color: '#000', border: 'none', padding: '10px 22px',
                  fontFamily: 'Space Mono, monospace', fontSize: '0.7rem',
                  letterSpacing: '1.5px', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  transition: '0.25s', fontWeight: 700, height: 44, whiteSpace: 'nowrap',
                }}
              >
                {loading ? '⏳' : '▶ Send'}
              </button>
            </div>
          </div>
        </FadeIn>

        {/* ── Pricing ── */}
        <FadeIn delay={0.15}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="stag" style={{ justifyContent: 'center', marginBottom: 10 }}>Pricing</div>
            <h3 className="font-head" style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700, marginBottom: 10 }}>
              License CodeCraft AI for Your <span style={{ color: 'var(--c2)' }}>Business</span>
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
              White-label or API access — deploy a branded coding agent for your team or product.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
            {TIERS.map((tier, i) => (
              <motion.div key={tier.name}
                whileHover={{ y: -4 }}
                style={{
                  background: 'var(--card)', border: `1px solid ${tier.name === 'Pro' ? tier.color : 'var(--border)'}`,
                  padding: '30px 26px', position: 'relative', transition: 'border-color 0.3s',
                  boxShadow: tier.name === 'Pro' ? `0 0 40px rgba(0,210,255,0.1)` : 'none',
                }}
              >
                {tier.badge && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: tier.color, color: '#000',
                    fontFamily: 'Space Mono, monospace', fontSize: '0.6rem',
                    padding: '4px 14px', fontWeight: 700, letterSpacing: '1px', whiteSpace: 'nowrap',
                  }}>{tier.badge}</div>
                )}
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', color: tier.color, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 10 }}>{tier.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
                  <span className="font-head" style={{ fontSize: '2.6rem', fontWeight: 700, color: tier.color }}>{tier.price}</span>
                  {tier.period && <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{tier.period}</span>}
                </div>
                <ul style={{ listStyle: 'none', marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {tier.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text)' }}>
                      <span style={{ color: tier.color, fontSize: '0.7rem' }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="mailto:msym5556@gmail.com?subject=CodeCraft AI - " className="btn"
                  style={{
                    display: 'flex', justifyContent: 'center', width: '100%',
                    background: tier.name === 'Pro' ? tier.color : 'transparent',
                    color: tier.name === 'Pro' ? '#000' : tier.color,
                    borderColor: tier.color, fontSize: '0.65rem',
                  }}
                >
                  {tier.cta} →
                </a>
              </motion.div>
            ))}
          </div>
        </FadeIn>

      </div>

      {/* Inline CSS for markdown rendering */}
      <style>{`
        .ai-pre { background: var(--bg3); border: 1px solid var(--border); padding: 14px 16px; margin: 10px 0; overflow-x: auto; position: relative; font-size: 0.78rem; line-height: 1.6; }
        .ai-pre code { font-family: 'Space Mono', monospace; color: var(--c4); white-space: pre; }
        .ai-lang { position: absolute; top: 6px; right: 10px; font-family: 'Space Mono', monospace; font-size: 0.55rem; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; }
        .ai-inline { background: rgba(0,210,255,0.1); border: 1px solid rgba(0,210,255,0.2); padding: 1px 5px; font-family: 'Space Mono', monospace; font-size: 0.8em; color: var(--c1); }
        #agent p { margin-bottom: 6px; }
        #agent ul { padding-left: 18px; margin: 6px 0; }
        #agent li { margin-bottom: 3px; }
      `}</style>
    </section>
  )
}
