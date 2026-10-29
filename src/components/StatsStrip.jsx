import * as m from 'motion/react-m'
import { reveal, revealStagger, viewportOnce } from '../lib/motion.js'
import CountUp from './CountUp.jsx'
import './StatsStrip.css'

const stats = [
  { to: 6, suffix: '+', sr: '6+', label: 'years of UAE & GCC execution' },
  { to: 25, suffix: '+', sr: '25+', label: 'tanks designed, 500 L–60 kL' },
  { to: 7, suffix: '', sr: '7', label: 'fuel stations, up to 42,600 L gross' },
]

const codes = ['ASME', 'API', 'UL', 'ISO', 'IEC', 'ADR']

// Value framed by a dimension line: |◄──── value ────►|
function DimValue({ children, wide = false }) {
  return (
    <div className={`dimv${wide ? ' dimv--wide' : ''}`}>
      <span className="dimv__line dimv__line--l" aria-hidden="true" />
      <span className="dimv__value">{children}</span>
      <span className="dimv__line dimv__line--r" aria-hidden="true" />
    </div>
  )
}

function StatsStrip() {
  return (
    <section className="stats" aria-label="Key figures">
      <m.ul
        className="container stats__grid"
        variants={revealStagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {stats.map((s) => (
          <m.li key={s.label} className="stats__item" variants={reveal}>
            <DimValue>
              <CountUp to={s.to} suffix={s.suffix} />
              <span className="visually-hidden">{s.sr}</span>
            </DimValue>
            <p className="stats__label">{s.label}</p>
          </m.li>
        ))}
        <m.li className="stats__item stats__item--codes" variants={reveal}>
          <DimValue wide>
            <span className="stats__codes">{codes.join(' · ')}</span>
          </DimValue>
          <p className="stats__label">design codes and standards</p>
        </m.li>
      </m.ul>
    </section>
  )
}

export default StatsStrip
