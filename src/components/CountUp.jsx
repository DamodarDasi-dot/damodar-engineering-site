import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'
import { ease } from '../lib/motion.js'

// Counts 0 → `to` once when scrolled into view. Shows the final value with reduced motion.
// Visual only: give the full value to screen readers separately.
function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, to, {
      duration: 1.2,
      ease,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, reduce, to, suffix])

  return (
    <span ref={ref} aria-hidden="true">
      {reduce ? `${to}${suffix}` : `0${suffix}`}
    </span>
  )
}

export default CountUp
