import { motion } from 'framer-motion'
import { projects, type Project } from '../data/resume'
import TechIcon from './TechIcon'

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const featured = project.featured
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white/70 p-6 transition
                  dark:bg-ink-800/70 ${
                    featured
                      ? 'border-accent/40 shadow-glow lg:col-span-2'
                      : 'border-slate-200 hover:border-accent/40 dark:border-ink-600'
                  }`}
    >
      {featured && (
        <span className="absolute right-5 top-5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
          ★ flagship
        </span>
      )}

      <div className="flex items-center gap-2">
        <h3 className="font-sans text-xl font-bold text-ink-900 dark:text-white">{project.project}</h3>
        {project.has_llm && (
          <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] text-accent-dim dark:text-accent">
            LLM
          </span>
        )}
      </div>
      <p className="mt-2 max-w-2xl text-sm text-ink-600 dark:text-slate-300">{project.blurb}</p>

      {/* metric chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {project.metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 dark:border-ink-600 dark:bg-ink-900/60"
          >
            <div className="font-mono text-sm font-bold text-accent-dim dark:text-accent">{m.value}</div>
            <div className="font-mono text-[10px] uppercase tracking-wide text-slate-500">{m.label}</div>
          </div>
        ))}
      </div>

      {/* architecture "diagram" */}
      <div className="mt-5">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-slate-500">architecture</div>
        <div className="flex flex-wrap items-center gap-2">
          {project.architecture.map((stage, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="rounded-md border border-accent/20 bg-accent/5 px-2.5 py-1 font-mono text-[11px] text-accent-dim dark:text-accent-soft">
                {stage}
              </span>
              {i < project.architecture.length - 1 && <span className="font-mono text-accent/50">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* featured detail bullets */}
      {featured && (
        <ul className="mt-5 grid gap-2 border-t border-slate-200 pt-4 dark:border-ink-600 sm:grid-cols-2">
          {project.details.map((d, i) => (
            <li key={i} className="flex gap-2 text-sm text-ink-600 dark:text-slate-300">
              <span className="mt-1 shrink-0 text-accent-dim dark:text-accent">▹</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-1 flex-col justify-end">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded border border-slate-200 px-1.5 py-0.5 font-mono text-[10px] text-ink-600 dark:border-ink-600 dark:text-slate-400"
            >
              <TechIcon name={s} className="h-3 w-3 shrink-0 text-slate-400 dark:text-slate-500" />
              {s}
            </span>
          ))}
        </div>
        <a
          href={project.repo}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-xs text-accent transition hover:bg-accent/20"
        >
          <GitHubIcon />
          view repo
        </a>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const ordered = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured))
  return (
    <section id="projects" className="container-x scroll-mt-16 py-16">
      <div className="mb-8">
        <p className="section-eyebrow mb-2">// SELECT * FROM ojas.projects</p>
        <h2 className="font-sans text-2xl font-bold text-ink-900 dark:text-white sm:text-3xl">
          Data products I&apos;ve shipped
        </h2>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {ordered.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  )
}
