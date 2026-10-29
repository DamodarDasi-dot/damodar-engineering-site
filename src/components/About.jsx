import * as m from 'motion/react-m'
import { site } from '../content/site.js'
import { reveal, revealStagger, viewportOnce } from '../lib/motion.js'
import TitleBlock from './TitleBlock.jsx'
import './About.css'

const focus = ['Skids & packages', 'Compressors', 'PSA nitrogen', 'Tanks & vessels', 'Fuelling systems']

const profile = [
  ['NAME', 'Damodar Dasi'],
  ['ROLE', 'Senior Mechanical Design Engineer'],
  ['BASE', site.location],
  ['EXPERIENCE', '6+ years UAE/GCC project execution'],
  ['SERVING', 'UAE · GCC · India'],
  ['CAD', 'SolidWorks · AutoCAD · Inventor'],
]

function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container about__inner">
        <m.header
          className="section-head"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="dwg-no">DWG DED-ABT-001 · ABOUT</p>
          <h2 id="about-title" className="section-title">
            Drawings written for the people who build from them
          </h2>
        </m.header>

        <m.div
          className="about__layout"
          variants={revealStagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <m.div className="about__copy" variants={reveal}>
            <p className="about__lede">
              I’m Damodar Dasi, a Senior Mechanical Design Engineer based in Sharjah, UAE, with 6+
              years of project execution across the UAE and GCC. I serve clients in the UAE, the GCC
              and India.
            </p>
            <p>
              I take packaged equipment from concept to 3D model to fabrication drawings, then stay
              on through fabrication queries and FAT/SAT. Every design is checked for fit-up, weld
              access, lifting and transport before it reaches the shop.
            </p>

            <div className="about__focus">
              <h3 className="about__focus-title">Areas of focus</h3>
              <ul className="about__focus-list">
                {focus.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>

            <a className="btn btn--secondary about__linkedin" href={site.linkedinHref} target="_blank" rel="noreferrer">
              View LinkedIn profile <span aria-hidden="true">↗</span>
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </m.div>

          <m.dl className="about__card sheet" variants={reveal} aria-label="Engineer profile">
            {profile.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </m.dl>
        </m.div>

        <TitleBlock
          className="section-tb"
          rows={[
            ['TITLE', 'ABOUT'],
            ['DWG NO.', 'DED-ABT-001'],
            ['REV', 'A'],
            ['SCALE', 'NTS'],
          ]}
        />
      </div>
    </section>
  )
}

export default About
