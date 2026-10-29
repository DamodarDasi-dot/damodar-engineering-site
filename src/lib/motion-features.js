// Motion feature bundle, loaded async by LazyMotion in App.jsx so it stays out of the first chunk.
// domMax (not domAnimation) because Projects uses layout and layoutId.
import { domMax } from 'motion/react'

export default domMax
