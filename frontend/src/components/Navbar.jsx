import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LINKS = ['About','Projects','Systems','Skills','Devlog','Contact']

export default function Navbar({ onResume }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 44)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = id => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-[5%] py-3.5 transition-all duration-300 ${
          scrolled ? 'glass shadow-2xl' : ''
        }`}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-head text-xl font-bold tracking-[3px] uppercase bg-transparent border-0 cursor-pointer"
          style={{ color: 'var(--c1)' }}
        >
          YK<span style={{ color: 'var(--c2)' }}>.</span>
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-7 list-none m-0 p-0">
          {LINKS.map(l => (
            <li key={l}>
              <button onClick={() => go(l)} className="nav-link">{l}</button>
            </li>
          ))}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button onClick={onResume} className="btn btn-or hidden md:flex" style={{ fontSize: '0.62rem', padding: '8px 18px' }}>
            ↓ Resume
          </button>
          <button
            onClick={() => setOpen(v => !v)}
            className="md:hidden p-1 bg-transparent border-0 cursor-pointer"
            style={{ color: 'var(--muted)', fontSize: '1.4rem', lineHeight: 1 }}
            aria-label="Menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="fixed top-[56px] left-0 right-0 z-[190] glass py-5 px-[5%] flex flex-col gap-4 md:hidden"
          >
            {LINKS.map(l => (
              <button key={l} onClick={() => go(l)} className="nav-link text-left py-1">{l}</button>
            ))}
            <button onClick={() => { onResume(); setOpen(false) }} className="btn btn-or mt-1 w-fit">↓ Resume</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
