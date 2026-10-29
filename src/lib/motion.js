// Shared Motion presets. Every section uses these (see CLAUDE.md "Motion rules").
// MotionConfig reducedMotion="user" in App.jsx turns the movement off for reduced-motion users.

export const ease = [0.2, 0, 0, 1]

export const viewportOnce = { once: true, amount: 0.2 }

export const reveal = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
}

export const revealStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
