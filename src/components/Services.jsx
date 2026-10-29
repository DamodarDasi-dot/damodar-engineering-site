import * as m from 'motion/react-m'
import { services } from '../content/services.js'
import { reveal, revealStagger, viewportOnce } from '../lib/motion.js'
import ServiceIcon from './ServiceIcon.jsx'
import TitleBlock from './TitleBlock.jsx'
import './Services.css'

function Services() {
  return (
    <section id="services" className="section services" aria-labelledby="services-title">
      <div className="container services__inner">
        <m.header
          className="section-head"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="dwg-no">DWG DED-SVC-001 · SERVICES</p>
          <h2 id="services-title" className="section-title">
            What I can take off your desk
          </h2>
        </m.header>

        <m.ul
          className="services__grid"
          variants={revealStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((s) => (
            <m.li key={s.code} className="service-card" variants={reveal}>
              <div className="service-card__top">
                <ServiceIcon name={s.icon} />
                <span className="service-card__code">{s.code}</span>
              </div>
              <h3 className="service-card__title">{s.title}</h3>
              <ul className="service-card__points">
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <a className="service-card__link" href="#contact">
                Enquire <span aria-hidden="true">→</span>
                <span className="visually-hidden"> about {s.title}</span>
              </a>
            </m.li>
          ))}
        </m.ul>

        <TitleBlock
          className="section-tb"
          rows={[
            ['TITLE', 'SERVICES'],
            ['DWG NO.', 'DED-SVC-001'],
            ['REV', 'A'],
            ['SCALE', 'NTS'],
          ]}
        />
      </div>
    </section>
  )
}

export default Services
