import { useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/resume'

// Sign up free at https://formspree.io, create a form, and paste its endpoint here.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'

type Status = 'idle' | 'sending' | 'sent' | 'error'

function MessageForm() {
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })
      if (res.ok) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <p className="mt-6 rounded-xl border border-accent/40 bg-accent/10 px-5 py-4 font-mono text-sm text-accent">
        ✓ Message sent — I&apos;ll get back to you soon.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          name="name"
          required
          placeholder="Your name"
          className="rounded-xl border border-slate-200 bg-transparent px-4 py-3 font-mono text-sm text-ink-900 placeholder:text-slate-500 focus:border-accent/60 focus:outline-none dark:border-ink-600 dark:text-white"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Your email"
          className="rounded-xl border border-slate-200 bg-transparent px-4 py-3 font-mono text-sm text-ink-900 placeholder:text-slate-500 focus:border-accent/60 focus:outline-none dark:border-ink-600 dark:text-white"
        />
      </div>
      <textarea
        name="message"
        required
        rows={4}
        placeholder="Say hello..."
        className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 font-mono text-sm text-ink-900 placeholder:text-slate-500 focus:border-accent/60 focus:outline-none dark:border-ink-600 dark:text-white"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-xl border border-accent/40 bg-accent/10 px-5 py-3 font-mono text-sm text-accent transition hover:bg-accent/20 disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        {status === 'error' && (
          <span className="font-mono text-xs text-red-500">
            Something went wrong — try again.
          </span>
        )}
      </div>
    </form>
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
            Open to data engineering / analytics roles starting Fall 2026. Drop a message below and
            it&apos;ll land straight in my inbox.
          </p>

          <MessageForm />

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
