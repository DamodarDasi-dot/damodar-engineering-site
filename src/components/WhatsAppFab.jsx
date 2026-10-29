import { useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { site } from '../content/site.js'
import { ease } from '../lib/motion.js'
import './WhatsAppFab.css'

// Phones only (CSS). Hidden over the hero, the contact section and the footer,
// where its own channels and full-width buttons already sit.
function WhatsAppFab() {
  const [blocked, setBlocked] = useState({ hero: true, contact: false, footer: false })

  useEffect(() => {
    const targets = {
      hero: document.querySelector('.hero'),
      contact: document.getElementById('contact'),
      footer: document.querySelector('.site-footer'),
    }
    const io = new IntersectionObserver((entries) => {
      setBlocked((b) => {
        const next = { ...b }
        for (const e of entries) {
          const key = Object.keys(targets).find((k) => targets[k] === e.target)
          if (key) next[key] = e.isIntersecting
        }
        return next
      })
    })
    Object.values(targets).forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const visible = !blocked.hero && !blocked.contact && !blocked.footer

  return (
    <AnimatePresence>
      {visible && (
        <m.a
          className="wa-fab"
          href={site.whatsappHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp (opens in a new tab)"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease } }}
          exit={{ opacity: 0, y: 8, transition: { duration: 0.15, ease } }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
            <path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.8z" strokeLinejoin="round" />
            <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-1.8-1-.9.8a4 4 0 0 1-2.4-2.4l.8-.9-1-1.8z" strokeLinejoin="round" />
          </svg>
        </m.a>
      )}
    </AnimatePresence>
  )
}

export default WhatsAppFab
