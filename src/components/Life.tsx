import { motion } from 'framer-motion'
import { life, lifeTagline } from '../data/resume'

/**
 * The human section — pinboard of taped-up cards, big friendly type,
 * deliberately warmer and less "console" than the rest of the site.
 */

// per-card personality: pastel surface + a slight tilt, straightened on hover
const CARD_LOOKS = [
  { tilt: -2, classes: 'bg-rose-50 border-rose-200 dark:bg-rose-400/10 dark:border-rose-400/25' },
  { tilt: 1.5, classes: 'bg-orange-50 border-orange-200 dark:bg-orange-400/10 dark:border-orange-400/25' },
  { tilt: -1, classes: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-400/10 dark:border-emerald-400/25' },
  { tilt: 2, classes: 'bg-sky-50 border-sky-200 dark:bg-sky-400/10 dark:border-sky-400/25' },
  { tilt: -1.5, classes: 'bg-violet-50 border-violet-200 dark:bg-violet-400/10 dark:border-violet-400/25' },
]

export default function Life() {
  return (
    <section id="life" className="container-x scroll-mt-16 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.45 }}
      >
        <p className="section-eyebrow mb-3">life</p>
        <h2 className="max-w-2xl font-sans text-3xl font-bold leading-tight text-ink-900 dark:text-white sm:text-5xl">
          When the laptop closes, the fun keeps running.
        </h2>
        <p className="mt-4 max-w-xl text-lg text-ink-600 dark:text-slate-300 sm:text-xl">
          {lifeTagline}
        </p>
      </motion.div>

      {/* pinboard */}
      <ul className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
        {life.map((item, i) => {
          const look = CARD_LOOKS[i % CARD_LOOKS.length]
          return (
            <motion.li
              key={item.thing}
              initial={{ opacity: 0, y: 24, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: look.tilt }}
              whileHover={{ rotate: 0, y: -6, scale: 1.02 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`relative rounded-2xl border p-6 shadow-sm sm:p-7 ${look.classes}`}
            >
              {/* tape strip */}
              <span
                className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 rounded-sm
                           bg-amber-200/80 shadow-sm dark:bg-amber-300/25"
                aria-hidden
              />
              <span className="block text-5xl sm:text-6xl" aria-hidden>
                {item.vibe}
              </span>
              <h3 className="mt-4 font-sans text-2xl font-bold text-ink-900 dark:text-white">
                {item.thing}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-ink-600 dark:text-slate-300 sm:text-lg">
                {item.detail}
              </p>
            </motion.li>
          )
        })}

        {/* invitation card, fills the 6th slot */}
        <motion.li
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0, rotate: 1 }}
          whileHover={{ rotate: 0, y: -6, scale: 1.02 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: life.length * 0.08 }}
          className="relative rounded-2xl border-2 border-dashed border-slate-300 p-6 sm:p-7
                     dark:border-ink-500"
        >
          <span className="block text-5xl sm:text-6xl" aria-hidden>
            👋
          </span>
          <h3 className="mt-4 font-sans text-2xl font-bold text-ink-900 dark:text-white">
            your idea here
          </h3>
          <p className="mt-2 text-base leading-relaxed text-ink-600 dark:text-slate-300 sm:text-lg">
            Got a trail, a pickup game, or a wild project in mind?{' '}
            <a href="#contact" className="font-semibold text-accent-dim underline underline-offset-4 dark:text-accent">
              Say hi
            </a>
            .
          </p>
        </motion.li>
      </ul>
    </section>
  )
}
