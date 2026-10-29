import * as m from 'motion/react-m'
import { codeGroups, tools } from '../content/codes.js'
import { reveal, revealStagger, viewportOnce } from '../lib/motion.js'
import TitleBlock from './TitleBlock.jsx'
import './Codes.css'

function Codes() {
  return (
    <section id="codes" className="section codes" aria-labelledby="codes-title">
      <div className="container codes__inner">
        <m.header
          className="section-head"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="dwg-no">DWG DED-COD-001 · CODES</p>
          <h2 id="codes-title" className="section-title">
            CAD stack and governing codes
          </h2>
          <p className="muted">Codes are applied as set by each project’s design basis.</p>
        </m.header>

        <div className="codes__layout">
          <m.ul
            className="codes__tools"
            aria-label="CAD stack"
            variants={revealStagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {tools.map((t) => (
              <m.li key={t.title} className="tool" variants={reveal}>
                <span className="tool__tag">{t.tag}</span>
                <div className="tool__body">
                  <h3 className="tool__title">{t.title}</h3>
                  <p className="tool__text">{t.text}</p>
                </div>
              </m.li>
            ))}
          </m.ul>

          <m.div
            className="codes__groups sheet"
            variants={revealStagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {codeGroups.map((g) => (
              <m.div key={g.title} className="code-group" variants={reveal}>
                <h3 className="code-group__title">{g.title}</h3>
                <ul className="code-group__chips">
                  {g.codes.map((c) => (
                    <li key={c} className="chip">
                      {c}
                    </li>
                  ))}
                </ul>
              </m.div>
            ))}
          </m.div>
        </div>

        <TitleBlock
          className="section-tb"
          rows={[
            ['TITLE', 'CODES & CAD STACK'],
            ['DWG NO.', 'DED-COD-001'],
            ['REV', 'A'],
            ['SCALE', 'NTS'],
          ]}
        />
      </div>
    </section>
  )
}

export default Codes
