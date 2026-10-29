import { useLayoutEffect, useRef } from 'react'
import { useReducedMotion, useScroll, useSpring } from 'motion/react'
import * as m from 'motion/react-m'
import { steps } from '../content/process.js'
import { reveal, revealStagger, viewportOnce } from '../lib/motion.js'
import TitleBlock from './TitleBlock.jsx'
import './Process.css'

function Process() {
  const trackRef = useRef(null)
  const lastRef = useRef(null)
  const reduce = useReducedMotion()

  // End the vertical rail at the last step's node instead of the bottom of its text.
  useLayoutEffect(() => {
    const track = trackRef.current
    const last = lastRef.current
    if (!track || !last) return
    const update = () => track.style.setProperty('--rail-end', `${track.offsetHeight - last.offsetTop}px`)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(track)
    return () => ro.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 85%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  // The same progress drives a horizontal rail (desktop) and a vertical rail (phones); CSS shows one.
  const lineX = reduce ? { scaleX: 1 } : { scaleX: progress }
  const lineY = reduce ? { scaleY: 1 } : { scaleY: progress }

  return (
    <section id="process" className="section process" aria-labelledby="process-title">
      <div className="container process__inner">
        <m.header
          className="section-head"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="dwg-no">DWG DED-PRC-001 · PROCESS</p>
          <h2 id="process-title" className="section-title">
            From enquiry to issued drawings
          </h2>
        </m.header>

        <div ref={trackRef} className="process__track">
          <div className="process__rail" aria-hidden="true">
            <m.span className="process__line process__line--x" style={lineX} />
            <m.span className="process__line process__line--y" style={lineY} />
          </div>

          <m.ol
            className="process__steps"
            variants={revealStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {steps.map((s, i) => (
              <m.li
                key={s.title}
                ref={i === steps.length - 1 ? lastRef : undefined}
                className="step"
                variants={reveal}
              >
                <span className="step__node" aria-hidden="true" />
                <span className="step__seq">SEQ {String(i + 1).padStart(2, '0')}</span>
                <h3 className="step__title">{s.title}</h3>
                <p className="step__text">{s.text}</p>
              </m.li>
            ))}
          </m.ol>
        </div>

        <TitleBlock
          className="section-tb"
          rows={[
            ['TITLE', 'EXECUTION SEQUENCE'],
            ['DWG NO.', 'DED-PRC-001'],
            ['REV', 'A'],
            ['SCALE', 'NTS'],
          ]}
        />
      </div>
    </section>
  )
}

export default Process
