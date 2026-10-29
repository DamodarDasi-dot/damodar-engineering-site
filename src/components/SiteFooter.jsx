import { navLinks, site } from '../content/site.js'
import './SiteFooter.css'

const year = new Date().getFullYear()

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <nav className="site-footer__nav" aria-label="Footer">
          <ul>
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <dl className="footer-tb">
          <div className="footer-tb__title">
            <dt>TITLE</dt>
            <dd>{site.brand}</dd>
          </div>
          <div>
            <dt>DWG NO.</dt>
            <dd>DED-000-001</dd>
          </div>
          <div>
            <dt>REV</dt>
            <dd>A · {year}</dd>
          </div>
          <div>
            <dt>SCALE</dt>
            <dd>NTS</dd>
          </div>
          <div>
            <dt>LOCATION</dt>
            <dd>{site.location}</dd>
          </div>
          <div className="footer-tb__contact">
            <dt>CONTACT</dt>
            <dd>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={site.phoneHref}>{site.phoneDisplay}</a>
            </dd>
          </div>
        </dl>

        <p className="site-footer__copy">
          © {year} {site.brand} · {site.tagline}
        </p>
      </div>
    </footer>
  )
}

export default SiteFooter
