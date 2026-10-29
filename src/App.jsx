import { LazyMotion, MotionConfig } from 'motion/react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import StatsStrip from './components/StatsStrip.jsx'
import Services from './components/Services.jsx'
import Projects from './components/Projects.jsx'
import Codes from './components/Codes.jsx'
import Process from './components/Process.jsx'
import Engagement from './components/Engagement.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import WhatsAppFab from './components/WhatsAppFab.jsx'

const loadFeatures = () => import('./lib/motion-features.js').then((res) => res.default)

function App() {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div id="top">
          <Navbar />
          <main id="main" tabIndex={-1}>
            <Hero />
            <StatsStrip />
            <Services />
            <Projects />
            <Codes />
            <Process />
            <Engagement />
            <About />
            <Contact />
          </main>
          <SiteFooter />
          <WhatsAppFab />
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}

export default App
