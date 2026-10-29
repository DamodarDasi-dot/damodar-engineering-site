import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { navLinks, site } from '../content/site.js'
import { ease } from '../lib/motion.js'
import './Navbar.css'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu when the layout switches to the desktop nav.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => e.matches && setOpen(false)
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    // Keep keyboard and screen-reader focus inside the open menu.
    const behind = [document.getElementById('main'), document.querySelector('.site-footer')]
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    behind.forEach((el) => el && (el.inert = true))
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      behind.forEach((el) => el && (el.inert = false))
    }
  }, [open])

  const close = () => setOpen(false)
  const solid = scrolled || open

  return (
    <header className={`navbar${solid ? ' navbar--solid' : ''}`}>
      <div className="container navbar__inner">
        <a className="navbar__brand" href="#top" onClick={close}>
          <span className="navbar__name">{site.brand}</span>
          <span className="navbar__tagline mono">{site.tagline}</span>
        </a>

        <nav className="navbar__desktop" aria-label="Main">
          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a className="navbar__link" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          <a className="btn btn--primary navbar__cta" href="#contact" onClick={close}>
            Request quote
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="navbar__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`navbar__burger${open ? ' is-open' : ''}`} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.nav
            id="mobile-menu"
            className="navbar__mobile"
            aria-label="Main"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15, ease } }}
          >
            <div className="container">
              <ul className="navbar__mobile-links">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a className="navbar__mobile-link" href={link.href} onClick={close}>
                      <span>{link.label}</span>
                      <span className="navbar__code" aria-hidden="true">
                        DED-{link.code}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <a className="btn btn--primary navbar__mobile-cta" href="#contact" onClick={close}>
                Request quote
              </a>
              <p className="navbar__mobile-contact">
                <a href={`mailto:${site.email}`}>{site.email}</a>
                <a href={site.phoneHref}>{site.phoneDisplay}</a>
              </p>
            </div>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
