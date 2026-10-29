import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { projectFilters, projects } from '../content/projects.js'
import { ease, reveal, viewportOnce } from '../lib/motion.js'
import ProjectSketch from './ProjectSketch.jsx'
import TitleBlock from './TitleBlock.jsx'
import './Projects.css'

const countFor = (id) => (id === 'all' ? projects.length : projects.filter((p) => p.category === id).length)

function ProjectCard({ project }) {
  return (
    <m.li
      layout
      className="project-card"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.3, ease } }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15, ease } }}
    >
      <article className="project-card__sheet" aria-labelledby={`${project.dwg}-title`}>
        <header className="project-card__head">
          <span className="dwg-no">DWG {project.dwg}</span>
          <span className="rev-tag">REV {project.rev}</span>
        </header>

        <div className="project-card__art blueprint">
          <ProjectSketch name={project.sketch} />
        </div>

        <div className="project-card__body">
          <div className="project-card__titles">
            <h3 id={`${project.dwg}-title`} className="project-card__title">
              {project.title}
            </h3>
            <p className="project-card__loc">{project.location}</p>
          </div>

          <dl className="project-card__facts">
            <div>
              <dt>SCOPE</dt>
              <dd>{project.scope}</dd>
            </div>
            <div>
              <dt>KEY SPECS</dt>
              <dd>
                <ul className="project-card__specs">
                  {project.specs.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          {project.codes.length > 0 && (
            <ul className="project-card__codes" aria-label="Codes and standards">
              {project.codes.map((c) => (
                <li key={c} className="chip">
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="project-card__status">
          <span className="project-card__status-label">STATUS</span>
          <span className="project-card__status-value">{project.status}</span>
        </footer>
      </article>
    </m.li>
  )
}

function Projects() {
  const [filter, setFilter] = useState('all')
  const shown = filter === 'all' ? projects : projects.filter((p) => p.category === filter)
  const activeLabel = projectFilters.find((f) => f.id === filter).label

  return (
    <section id="projects" className="section projects" aria-labelledby="projects-title">
      <div className="container projects__inner">
        <m.header
          className="section-head"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="dwg-no">DWG DED-PRJ-001 · PROJECTS</p>
          <h2 id="projects-title" className="section-title">
            Work delivered across the GCC and beyond
          </h2>
        </m.header>

        <div className="projects__filters" role="group" aria-label="Filter projects by type">
          {projectFilters.map((f) => {
            const active = f.id === filter
            return (
              <button
                key={f.id}
                type="button"
                className={`projects__filter${active ? ' is-active' : ''}`}
                aria-pressed={active}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
                <span className="projects__count">{countFor(f.id)}</span>
                {active && (
                  <m.span
                    layoutId="projects-filter-indicator"
                    className="projects__indicator"
                    transition={{ duration: 0.25, ease }}
                  />
                )}
              </button>
            )
          })}
        </div>
        <p className="visually-hidden" aria-live="polite">
          Showing {shown.length} {shown.length === 1 ? 'project' : 'projects'}: {activeLabel}
        </p>

        <m.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <m.ul layout className="projects__grid">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((p) => (
                <ProjectCard key={p.dwg} project={p} />
              ))}
            </AnimatePresence>
          </m.ul>
        </m.div>

        <TitleBlock
          className="section-tb"
          rows={[
            ['TITLE', 'PROJECTS'],
            ['DWG NO.', 'DED-PRJ-001'],
            ['REV', 'A'],
            ['SCALE', 'NTS'],
          ]}
        />
      </div>
    </section>
  )
}

export default Projects
