import { useMemo, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { skills } from '../data/resume'

export default function Skills() {
  const categories = useMemo(() => {
    const set: string[] = []
    for (const s of skills) if (!set.includes(s.category)) set.push(s.category)
    return ['All', ...set]
  }, [])

  const [active, setActive] = useState('All')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const filtered = useMemo(
    () =>
      [...skills]
        .filter((s) => active === 'All' || s.category === active)
        .sort((a, b) => b.level - a.level),
    [active],
  )

  return (
    <section id="skills" className="container-x scroll-mt-16 py-16">
      <div className="mb-8">
        <p className="section-eyebrow mb-2">// SELECT skill, level FROM ojas.skills ORDER BY level DESC</p>
        <h2 className="font-sans text-2xl font-bold text-ink-900 dark:text-white sm:text-3xl">
          The stack I work in
        </h2>
      </div>

      {/* category filter */}
      <div className="mb-7 flex flex-wrap gap-2" role="tablist" aria-label="Skill categories">
        {categories.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={active === c}
            onClick={() => setActive(c)}
            className={`rounded-full border px-3 py-1 font-mono text-xs transition ${
              active === c
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-slate-200 text-ink-600 hover:border-accent/50 hover:text-accent-dim dark:border-ink-600 dark:text-slate-400 dark:hover:text-accent'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* proficiency bars */}
      <div ref={ref} className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {filtered.map((s, i) => (
          <div key={s.skill}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="text-sm text-ink-800 dark:text-slate-200">{s.skill}</span>
              <span className="font-mono text-xs tabular-nums text-slate-500">{s.level}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-ink-600">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-dim to-accent-soft"
                initial={{ width: 0 }}
                animate={inView ? { width: `${s.level}%` } : {}}
                transition={{ duration: 0.7, delay: i * 0.03, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
