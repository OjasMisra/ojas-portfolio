import { useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/resume'

function CopyEmail() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="group inline-flex items-center gap-3 rounded-xl border border-accent/40 bg-accent/10 px-5 py-3 font-mono text-sm text-accent transition hover:bg-accent/20"
      aria-label={`Copy email ${profile.email} to clipboard`}
    >
      <span>{profile.email}</span>
      <span className="text-xs text-accent-dim dark:text-accent-soft">
        {copied ? '✓ copied' : '⧉ copy'}
      </span>
    </button>
  )
}

const SOCIALS = [
  { label: 'LinkedIn', href: profile.linkedin, handle: 'in/ojas-misra' },
  { label: 'GitHub', href: profile.github, handle: 'OjasMisra' },
]

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 border-t border-slate-200 py-16 dark:border-ink-700">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
        >
          <p className="section-eyebrow mb-2">// SELECT * FROM ojas.contact</p>
          <h2 className="font-sans text-2xl font-bold text-ink-900 dark:text-white sm:text-3xl">
            Let&apos;s build a pipeline together
          </h2>
          <p className="mt-2 max-w-xl text-ink-600 dark:text-slate-400">
            Open to data engineering / analytics roles starting Fall 2026. The fastest way to reach
            me is email.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <CopyEmail />
            <a
              href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}
              className="rounded-xl border border-slate-200 px-5 py-3 font-mono text-sm text-ink-700 transition hover:border-accent/50 dark:border-ink-600 dark:text-slate-300"
            >
              {profile.phone}
            </a>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-mono text-sm text-ink-600 transition hover:text-accent-dim dark:text-slate-400 dark:hover:text-accent"
              >
                <span className="text-accent-dim dark:text-accent">↗</span>
                {s.label} <span className="text-slate-500">/ {s.handle}</span>
              </a>
            ))}
          </div>
        </motion.div>

        <footer className="mt-14 flex flex-col gap-1 border-t border-slate-200 pt-6 font-mono text-xs text-slate-500 dark:border-ink-700 sm:flex-row sm:items-center sm:justify-between">
          <span>© {profile.name} — built with React, Vite & a lot of SQL.</span>
          <span className="text-slate-600">SELECT * FROM portfolio; -- you reached the end ✦</span>
        </footer>
      </div>
    </section>
  )
}
