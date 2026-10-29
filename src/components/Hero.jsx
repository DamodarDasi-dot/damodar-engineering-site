import * as m from 'motion/react-m'
import { site } from '../content/site.js'
import { reveal, revealStagger } from '../lib/motion.js'
import SkidDrawing from './SkidDrawing.jsx'
import TitleBlock from './TitleBlock.jsx'
import './Hero.css'

function Hero() {
  return (
    <section className="hero blueprint" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <m.div className="hero__copy" variants={revealStagger} initial="hidden" animate="visible">
          <m.p className="dwg-no" variants={reveal}>
            DWG DED-000-001 · {site.location.toUpperCase()}
          </m.p>
          <m.p className="hero__tagline" variants={reveal}>
            {site.tagline}
          </m.p>
          <m.h1 id="hero-title" className="hero__title" variants={reveal}>
            Fabrication-ready design for packaged equipment
          </m.h1>
          <m.p className="hero__lede" variants={reveal}>
            3D models, GA and fabrication drawings for fabricators, EPC contractors and OEMs across
            the UAE, GCC and India, with support through FAT and SAT.
          </m.p>
          <m.div className="hero__actions" variants={reveal}>
            <a className="btn btn--primary" href="#contact">
              Send an enquiry
            </a>
            <a className="btn btn--secondary" href="#projects">
              View projects
            </a>
          </m.div>
          <m.p className="hero__byline" variants={reveal}>
            <strong>Damodar Dasi</strong>
            <span>Sr. Mechanical Design Engineer · 6+ years in UAE/GCC</span>
          </m.p>
        </m.div>

        <m.figure
          className="hero__figure sheet"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
        >
          <div className="hero__drawing">
            <SkidDrawing />
          </div>
          <TitleBlock
            className="hero__tb"
            rows={[
              ['TITLE', 'TYPICAL FUEL SKID · GA'],
              ['DWG NO.', 'DED-000-002'],
              ['REV', 'A'],
              ['SCALE', 'NTS'],
            ]}
          />
        </m.figure>
      </div>
    </section>
  )
}

export default Hero
