import * as m from 'motion/react-m'
import { engagements } from '../content/engagement.js'
import { reveal, revealStagger, viewportOnce } from '../lib/motion.js'
import TitleBlock from './TitleBlock.jsx'
import './Engagement.css'

function Engagement() {
  return (
    <section id="engagement" className="section engagement" aria-labelledby="engagement-title">
      <div className="container engagement__inner">
        <m.header
          className="section-head"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="dwg-no">DWG DED-ENG-001 · ENGAGEMENT</p>
          <h2 id="engagement-title" className="section-title">
            Ways to work together
          </h2>
        </m.header>

        <m.ul
          className="engagement__grid"
          variants={revealStagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {engagements.map((e) => (
            <m.li key={e.title} className="engage-card" variants={reveal}>
              <span className="engage-card__kicker">{e.kicker}</span>
              <h3 className="engage-card__title">{e.title}</h3>
              <p className="engage-card__text">{e.text}</p>
              <p className="engage-card__best">
                <span>BEST FOR</span>
                {e.bestFor}
              </p>
              <a className="engage-card__link" href="#contact">
                Discuss this <span aria-hidden="true">→</span>
                <span className="visually-hidden"> ({e.title.toLowerCase()})</span>
              </a>
            </m.li>
          ))}
        </m.ul>

        <TitleBlock
          className="section-tb"
          rows={[
            ['TITLE', 'ENGAGEMENT MODELS'],
            ['DWG NO.', 'DED-ENG-001'],
            ['REV', 'A'],
            ['SCALE', 'NTS'],
          ]}
        />
      </div>
    </section>
  )
}

export default Engagement
