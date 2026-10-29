import { useRef, useState } from 'react'
import * as m from 'motion/react-m'
import { services } from '../content/services.js'
import { site } from '../content/site.js'
import { reveal, revealStagger, viewportOnce } from '../lib/motion.js'
import TitleBlock from './TitleBlock.jsx'
import './Contact.css'

const locations = ['UAE', 'Saudi Arabia', 'Oman', 'Qatar', 'Kuwait', 'Bahrain', 'India', 'Other']

const empty = { name: '', email: '', company: '', location: '', package: '', codes: '', scope: '' }
const fieldOrder = ['name', 'email', 'location', 'package', 'scope']

function validate(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Enter your full name.'
  if (!v.email.trim()) e.email = 'Enter your business email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    e.email = 'Enter an email address like name@company.com.'
  if (!v.location) e.location = 'Choose the project location.'
  if (!v.package) e.package = 'Choose a package type.'
  if (!v.scope.trim()) e.scope = 'Describe the scope and target schedule.'
  else if (v.scope.trim().length < 15) e.scope = 'Add a little more detail on scope and schedule.'
  return e
}

function buildMailto(v) {
  const subject = `Enquiry: ${v.package} · ${v.company.trim() || v.name.trim()}`
  const body = [
    `Name: ${v.name.trim()}`,
    `Email: ${v.email.trim()}`,
    `Company: ${v.company.trim() || '-'}`,
    `Project location: ${v.location}`,
    `Package type: ${v.package}`,
    `Governing codes: ${v.codes.trim() || '-'}`,
    '',
    'Scope & target schedule:',
    v.scope.trim(),
    '',
    '(Drawings / specs attached)',
  ].join('\n')
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function Field({ id, label, optional, error, children }) {
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label htmlFor={id} className="field__label">
        {label}
        {optional && <span className="field__opt"> (optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="field__error">
          {error}
        </p>
      )}
    </div>
  )
}

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const textRef = useRef(null)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const range = document.createRange()
      range.selectNodeContents(textRef.current)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }

  return (
    <div className="channel__row">
      <a ref={textRef} className="channel__value" href={`mailto:${site.email}`}>
        {site.email}
      </a>
      <button type="button" className="copy-btn" onClick={copy}>
        {copied ? 'Copied' : 'Copy'}
      </button>
      <span className="visually-hidden" aria-live="polite">
        {copied ? 'Email address copied' : ''}
      </span>
    </div>
  )
}

function Contact() {
  const [values, setValues] = useState(empty)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState('')
  const formRef = useRef(null)

  const errors = validate(values)
  const show = (k) => (submitted || touched[k]) && errors[k]

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    setStatus('')
  }
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }))

  const aria = (k) => ({
    'aria-invalid': show(k) ? true : undefined,
    'aria-describedby': show(k) ? `${k}-error` : undefined,
  })

  const onSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    const bad = fieldOrder.filter((k) => errors[k])
    if (bad.length) {
      setStatus(`Check ${bad.length === 1 ? '1 field' : `${bad.length} fields`} marked below.`)
      formRef.current.querySelector(`#${bad[0]}`)?.focus()
      return
    }
    window.location.assign(buildMailto(values))
    setStatus(
      `Your email app should open with this enquiry filled in. Attach your drawings there and send. If nothing opens, email ${site.email} directly.`,
    )
  }

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container contact__inner">
        <m.header
          className="section-head"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="dwg-no">DWG DED-CON-001 · CONTACT</p>
          <h2 id="contact-title" className="section-title">
            Send me your spec or tender
          </h2>
        </m.header>

        <m.div
          className="contact__layout"
          variants={revealStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <m.form
            ref={formRef}
            className="enquiry sheet"
            noValidate
            onSubmit={onSubmit}
            variants={reveal}
            aria-label="Enquiry"
          >
            <div className="enquiry__grid">
              <Field id="name" label="Full name" error={show('name')}>
                <input id="name" name="name" type="text" autoComplete="name" value={values.name} onChange={set('name')} onBlur={blur('name')} {...aria('name')} />
              </Field>
              <Field id="email" label="Business email" error={show('email')}>
                <input id="email" name="email" type="email" autoComplete="email" inputMode="email" value={values.email} onChange={set('email')} onBlur={blur('email')} {...aria('email')} />
              </Field>
              <Field id="company" label="Company" optional>
                <input id="company" name="company" type="text" autoComplete="organization" value={values.company} onChange={set('company')} />
              </Field>
              <Field id="location" label="Project location" error={show('location')}>
                <select id="location" name="location" value={values.location} onChange={set('location')} onBlur={blur('location')} {...aria('location')}>
                  <option value="">Select a location</option>
                  {locations.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </Field>
              <Field id="package" label="Package type" error={show('package')}>
                <select id="package" name="package" value={values.package} onChange={set('package')} onBlur={blur('package')} {...aria('package')}>
                  <option value="">Select a package type</option>
                  {services.map((s) => (
                    <option key={s.code}>{s.title}</option>
                  ))}
                </select>
              </Field>
              <Field id="enquiry-codes" label="Governing codes" optional>
                <input id="enquiry-codes" name="codes" type="text" placeholder="e.g. ASME VIII Div 1, API 650" value={values.codes} onChange={set('codes')} />
              </Field>
              <div className="enquiry__full">
                <Field id="scope" label="Scope & target schedule" error={show('scope')}>
                  <textarea id="scope" name="scope" rows={5} value={values.scope} onChange={set('scope')} onBlur={blur('scope')} {...aria('scope')} />
                </Field>
              </div>
            </div>

            <div className="enquiry__actions">
              <button type="submit" className="btn btn--primary">
                Prepare enquiry email
              </button>
              <p className="enquiry__note">
                Drawings are treated as confidential. NDA available. Attach files in the email that
                opens.
              </p>
              <p className="enquiry__status" role="status">
                {status}
              </p>
            </div>
          </m.form>

          <m.aside className="channels" variants={reveal} aria-label="Direct channels">
            <div className="channel">
              <span className="channel__label">EMAIL</span>
              <CopyEmail />
            </div>
            <div className="channel">
              <span className="channel__label">PHONE / WHATSAPP</span>
              <div className="channel__row">
                <a className="channel__value" href={site.phoneHref}>
                  {site.phoneDisplay}
                </a>
                <a className="copy-btn" href={site.whatsappHref} target="_blank" rel="noreferrer">
                  WhatsApp
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </div>
            </div>
            <div className="channel">
              <span className="channel__label">LINKEDIN</span>
              <a className="channel__value" href={site.linkedinHref} target="_blank" rel="noreferrer">
                {site.linkedinName}
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </div>
            <div className="channel">
              <span className="channel__label">LOCATION</span>
              <p className="channel__text">{site.location} · serving UAE, GCC &amp; India</p>
            </div>
          </m.aside>
        </m.div>

        <TitleBlock
          className="section-tb"
          rows={[
            ['TITLE', 'CONTACT'],
            ['DWG NO.', 'DED-CON-001'],
            ['REV', 'A'],
            ['SCALE', 'NTS'],
          ]}
        />
      </div>
    </section>
  )
}

export default Contact
