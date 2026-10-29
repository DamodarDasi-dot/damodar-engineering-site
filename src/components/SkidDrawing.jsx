import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { ease } from '../lib/motion.js'
import './SkidDrawing.css'

// Lines draw in one group after another; tags, centrelines and arrowheads fade in last.
const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay, duration: 0.6, ease },
      opacity: { delay, duration: 0.01 },
    },
  }),
}

const fade = {
  hidden: { opacity: 0 },
  visible: (delay) => ({ opacity: 1, transition: { delay, duration: 0.3, ease } }),
}

const T = { base: 0.2, tank: 0.35, pump: 0.55, filter: 0.7, pipe: 0.9, dim: 1.1, text: 1.4 }

function Tag({ x, y, label, leader }) {
  return (
    <m.g variants={fade} custom={T.text}>
      <path className="drw-leader" d={leader} />
      <rect className="drw-tag" x={x} y={y} width="80" height="30" />
      <text className="drw-tag-text" x={x + 40} y={y + 22} textAnchor="middle">
        {label}
      </text>
    </m.g>
  )
}

function SkidDrawing() {
  const reduce = useReducedMotion()

  return (
    <m.svg
      className="skid-drawing"
      viewBox="0 52 560 312"
      role="img"
      aria-labelledby="skid-title"
      initial={reduce ? false : 'hidden'}
      animate="visible"
    >
      <title id="skid-title">
        General arrangement of a typical fuel skid: tank T-101, pump P-101 and filter F-101 on a
        base frame, overall length 12,192 mm.
      </title>

      {/* Base frame */}
      <m.rect className="drw-line" x="30" y="280" width="500" height="20" variants={draw} custom={T.base} />
      <m.path className="drw-thin" d="M30 285 H530" variants={draw} custom={T.base + 0.1} />

      {/* Tank T-101 with saddles, manway and top nozzle */}
      <m.path
        className="drw-line"
        d="M110 130 H230 A60 60 0 0 1 230 250 H110 A60 60 0 0 1 110 130 Z"
        variants={draw}
        custom={T.tank}
      />
      <m.path className="drw-line" d="M96 280 L104 250 H136 L144 280" variants={draw} custom={T.tank + 0.1} />
      <m.path className="drw-line" d="M196 280 L204 250 H236 L244 280" variants={draw} custom={T.tank + 0.1} />
      <m.path className="drw-line" d="M150 130 V116 H182 V130" variants={draw} custom={T.tank + 0.2} />
      <m.path className="drw-thin" d="M144 116 H188" variants={draw} custom={T.tank + 0.2} />
      <m.path className="drw-center" d="M34 190 H306 M170 120 V262" variants={fade} custom={T.text} />

      {/* Pump P-101: casing, coupling, motor, baseplate */}
      <m.circle className="drw-line" cx="360" cy="250" r="22" variants={draw} custom={T.pump} />
      <m.rect className="drw-line" x="382" y="243" width="18" height="14" variants={draw} custom={T.pump + 0.05} />
      <m.rect className="drw-line" x="400" y="226" width="72" height="46" variants={draw} custom={T.pump + 0.1} />
      <m.path className="drw-thin" d="M412 226 V272 M424 226 V272 M436 226 V272 M448 226 V272 M460 226 V272" variants={draw} custom={T.pump + 0.2} />
      <m.rect className="drw-line" x="336" y="272" width="140" height="8" variants={draw} custom={T.pump + 0.1} />

      {/* Filter F-101 */}
      <m.path className="drw-line" d="M485 272 V140 A20 20 0 0 1 525 140 V272 Z" variants={draw} custom={T.filter} />
      <m.path className="drw-thin" d="M485 150 H525" variants={draw} custom={T.filter + 0.1} />
      <m.path className="drw-line" d="M490 272 V280 M520 272 V280" variants={draw} custom={T.filter + 0.1} />

      {/* Piping: tank outlet → pump suction, pump discharge → filter, filter outlet */}
      <m.path className="drw-pipe" d="M279 225 H322 V250 H338" variants={draw} custom={T.pipe} />
      <m.path className="drw-pipe" d="M360 228 V170 H485" variants={draw} custom={T.pipe + 0.1} />
      <m.path className="drw-pipe" d="M505 120 V100 H540" variants={draw} custom={T.pipe + 0.2} />
      <m.path className="drw-line" d="M540 91 V109 M300 218 V232 M420 163 V177" variants={draw} custom={T.pipe + 0.3} />

      {/* Overall dimension 12,192 mm */}
      <m.path className="drw-dim" d="M30 304 V352 M530 304 V352" variants={draw} custom={T.dim} />
      <m.path className="drw-dim" d="M30 340 H530" variants={draw} custom={T.dim + 0.1} />
      <m.g variants={fade} custom={T.text}>
        <path className="drw-arrow" d="M30 340 l12 -4.5 v9 z M530 340 l-12 -4.5 v9 z" />
        <text className="drw-dim-text" x="280" y="331" textAnchor="middle">
          12,192 mm
        </text>
      </m.g>

      {/* Equipment tags */}
      <Tag x={176} y={62} label="T-101" leader="M215 90 V130" />
      <Tag x={398} y={186} label="P-101" leader="M437 214 V226" />
      <Tag x={396} y={92} label="F-101" leader="M474 106 L486 128" />
    </m.svg>
  )
}

export default SkidDrawing
