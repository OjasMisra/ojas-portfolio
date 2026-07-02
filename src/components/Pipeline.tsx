import { useState } from 'react'
import { motion } from 'framer-motion'
import { experience, type Experience, type Stage } from '../data/resume'
import TechIcon from './TechIcon'

const STAGE_ORDER: Stage[] = ['Extract', 'Transform', 'Load']
const STAGE_BLURB: Record<Stage, string> = {
  Extract: 'raw data in — automation & ingestion',
  Transform: 'shape it — ETL, modeling, pipelines',
  Load: 'serve it — semantic models & BI',
}

function StageNode({ stage, role, index }: { stage: Stage; role: Experience; index: number }) {
  const [open, setOpen] = useState(index === 0)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative"
    >
      {/* stage label */}
      <div className="mb-3 flex items-center gap-2">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent-dim dark:text-accent">
          {stage}
        </span>
        <span className="hidden font-mono text-[11px] text-slate-500 sm:inline">{STAGE_BLURB[stage]}</span>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group w-full rounded-xl border border-slate-200 bg-white/70 p-4 text-left transition
                   hover:border-accent/60 dark:border-ink-600 dark:bg-ink-800/70"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              style={{ backgroundColor: role.brand.bg, color: role.brand.fg }}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg font-mono text-sm font-bold tracking-tight shadow-sm"
            >
              {role.brand.mark}
            </span>
            <div>
              <h3 className="font-sans text-lg font-semibold text-ink-900 dark:text-white">{role.company}</h3>
              <p className="text-sm text-ink-600 dark:text-slate-400">{role.role}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-slate-500">{role.period}</p>
            {role.impact_pct > 0 && (
              <p className="mt-1 font-mono text-sm font-bold text-accent-dim dark:text-accent">
                ↑ {role.impact_pct}%
              </p>
            )}
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <ul className="mt-3 space-y-1.5 border-t border-slate-200 pt-3 dark:border-ink-600">
            {role.highlights.map((h, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-600 dark:text-slate-300">
                <span className="mt-1 text-accent-dim dark:text-accent">▹</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {role.stack.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 rounded border border-accent/20 bg-accent/5 px-1.5 py-0.5 font-mono text-[10px] text-accent-dim dark:text-accent-soft"
              >
                <TechIcon name={s} className="h-3 w-3 shrink-0" />
                {s}
              </span>
            ))}
          </div>
        </motion.div>

        <span className="mt-3 inline-block font-mono text-[11px] text-slate-500 group-hover:text-accent-dim dark:group-hover:text-accent">
          {open ? '− collapse' : '+ expand impact'}
        </span>
      </button>
    </motion.div>
  )
}

export default function Pipeline() {
  // roles ordered Extract → Transform → Load (chronological)
  const ordered = [...experience].sort(
    (a, b) => STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage),
  )

  return (
    <section id="pipeline" className="container-x scroll-mt-16 py-16">
      <div className="mb-8">
        <p className="section-eyebrow mb-2">career.pipeline</p>
        <h2 className="font-sans text-2xl font-bold text-ink-900 dark:text-white sm:text-3xl">
          My career, as an ETL job
        </h2>
        <p className="mt-2 max-w-2xl text-ink-600 dark:text-slate-400">
          Three roles, one pipeline: raw automation at Orange, heavy transformation at EY, and
          serving trusted data at Fidelity. Tap a stage to expand the impact.
        </p>
      </div>

      <div className="grid items-start gap-4 md:grid-cols-3">
        {ordered.map((role, i) => (
          <div key={role.company} className="relative">
            <StageNode stage={role.stage} role={role} index={i} />
            {i < ordered.length - 1 && (
              <div
                aria-hidden
                className="absolute -right-3 top-1/2 hidden -translate-y-1/2 font-mono text-accent/50 md:block"
              >
                →
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
