import { motion } from 'framer-motion'
import { education, awards } from '../data/resume'

export default function About() {
  return (
    <section id="about" className="container-x scroll-mt-16 py-16">
      <div className="grid gap-10 md:grid-cols-[1.1fr_1fr]">
        {/* voice */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
        >
          <p className="section-eyebrow mb-2">about</p>
          <h2 className="font-sans text-2xl font-bold text-ink-900 dark:text-white sm:text-3xl">
            I make data trustworthy, fast, and a little bit fun.
          </h2>
          <div className="mt-4 space-y-4 text-ink-600 dark:text-slate-300">
            <p>
              I&apos;m a data engineer and analyst who likes the whole stack — from the messy
              extraction at the top of a pipeline down to the polished KPI someone actually makes a
              decision with. I&apos;ve standardized metrics at Fidelity, sped up ETL by 80% at EY,
              and built a multi-agent equity-research platform for fun.
            </p>
            <p>
              Lately I&apos;m most excited about LLM-powered data products — putting models to work
              inside the warehouse, not bolted on the side. If it involves Snowflake, dbt, a
              dashboard that loads fast, or an agent that writes its own charts, I&apos;m in.
            </p>
          </div>
        </motion.div>

        {/* education + awards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="space-y-6"
        >
          <div>
            <p className="section-eyebrow mb-3">education</p>
            <ul className="space-y-3">
              {education.map((e) => (
                <li key={e.degree} className="card-surface p-4">
                  <p className="font-sans font-semibold text-ink-900 dark:text-white">{e.degree}</p>
                  <p className="text-sm text-ink-600 dark:text-slate-400">{e.school}</p>
                  <p className="font-mono text-xs text-slate-500">
                    {e.year} · {e.note}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="section-eyebrow mb-3">awards</p>
            <ul className="flex flex-wrap gap-2">
              {awards.map((a) => (
                <li
                  key={a.award}
                  title={a.detail}
                  className="rounded-lg border border-slate-200 bg-white/70 px-3 py-1.5 text-sm text-ink-700 dark:border-ink-600 dark:bg-ink-800/70 dark:text-slate-300"
                >
                  <span className="text-accent-dim dark:text-accent">◆</span> {a.award}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
