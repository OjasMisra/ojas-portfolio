import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { metrics } from '../data/resume'
import { useCountUp } from '../hooks/useCountUp'

function Tile({
  value,
  prefix,
  suffix,
  context,
  active,
  delay,
}: {
  value: number
  prefix: string
  suffix: string
  context: string
  active: boolean
  delay: number
}) {
  const n = useCountUp(value, active)
  const display = value >= 1000 ? Math.round(n).toLocaleString() : Math.round(n).toString()
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      className="card-surface p-5"
    >
      <div className="font-mono text-3xl font-bold tabular-nums text-accent-dim dark:text-accent sm:text-4xl">
        {prefix}
        {display}
        {suffix}
      </div>
      <p className="mt-2 text-sm leading-snug text-ink-600 dark:text-slate-400">{context}</p>
    </motion.div>
  )
}

export default function MetricsBand() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section aria-label="Impact metrics" className="container-x py-10">
      <p className="section-eyebrow mb-4">// SELECT metric, value FROM ojas.metrics</p>
      <div ref={ref} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {metrics.map((m, i) => (
          <Tile
            key={m.metric}
            value={m.value}
            prefix={m.prefix}
            suffix={m.suffix}
            context={m.context}
            active={inView}
            delay={i * 0.08}
          />
        ))}
      </div>
    </section>
  )
}
