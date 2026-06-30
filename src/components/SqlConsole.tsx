import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { profile } from '../data/resume'
import {
  run,
  QueryError,
  SAMPLE_QUERIES,
  SURPRISE_QUERIES,
  type QueryResult,
} from '../lib/queryEngine'
import ResultRenderer from './ResultRenderer'

interface HistoryEntry {
  id: number
  query: string
  result?: QueryResult
  error?: string
}

const PROMPT = 'ojas@portfolio:~$'

const WELCOME =
  "// Welcome. This résumé is a database. Run a query, or tap a chip below.\n// Try: SELECT * FROM ojas.experience WHERE impact_pct > 40;"

export default function SqlConsole() {
  const reduce = useReducedMotion()
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [busy, setBusy] = useState(false)
  const idRef = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const typer = useRef<number>()

  const execute = useCallback((raw: string) => {
    const query = raw.trim()
    if (!query) return
    const id = ++idRef.current
    try {
      const result = run(query)
      setHistory((h) => [...h, { id, query, result }])
    } catch (err) {
      const message = err instanceof QueryError ? err.message : 'unexpected error'
      setHistory((h) => [...h, { id, query, error: message }])
    }
    setInput('')
  }, [])

  // Type a query into the input char-by-char, then execute it.
  const typeAndRun = useCallback(
    (query: string) => {
      if (typer.current) window.clearInterval(typer.current)
      if (reduce) {
        execute(query)
        return
      }
      setBusy(true)
      setInput('')
      let i = 0
      typer.current = window.setInterval(() => {
        i++
        setInput(query.slice(0, i))
        if (i >= query.length) {
          window.clearInterval(typer.current)
          setBusy(false)
          // small beat so the finished line is visible before results pop in
          window.setTimeout(() => execute(query), 180)
        }
      }, 18)
    },
    [execute, reduce],
  )

  useEffect(() => {
    return () => {
      if (typer.current) window.clearInterval(typer.current)
    }
  }, [])

  // keep the console scrolled to the latest result
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [history, input])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    execute(input)
  }

  const surprise = () => {
    const q = SURPRISE_QUERIES[Math.floor(Math.random() * SURPRISE_QUERIES.length)]
    typeAndRun(q)
  }

  return (
    <section id="console" className="relative scroll-mt-16">
      <div className="grid-backdrop pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <div className="container-x pb-10 pt-12 sm:pt-16">
        {/* Identity */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-7"
        >
          <p className="section-eyebrow mb-3">{profile.title}</p>
          <h1 className="font-sans text-4xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-ink-600 dark:text-slate-400 sm:text-lg">
            {profile.tagline}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-accent-dim dark:text-accent">
              ◍ {profile.location}
            </span>
            <span className="rounded-full border border-slate-200 px-3 py-1 text-ink-600 dark:border-ink-600 dark:text-slate-400">
              {profile.status}
            </span>
          </div>
        </motion.div>

        {/* Console */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-hidden rounded-xl border border-ink-600 bg-ink-800/90 shadow-glow backdrop-blur"
        >
          {/* title bar */}
          <div className="flex items-center gap-2 border-b border-ink-600 bg-ink-900/80 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
            <span className="h-3 w-3 rounded-full bg-green-400/80" />
            <span className="ml-3 font-mono text-xs text-slate-500">ojas.db — query console</span>
            <span className="ml-auto font-mono text-[10px] text-slate-600">read-only · client-side</span>
          </div>

          {/* output */}
          <div ref={scrollRef} className="scroll-thin max-h-[42vh] min-h-[180px] overflow-y-auto px-4 py-3 font-mono text-sm sm:max-h-[40vh]">
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-slate-500">{WELCOME}</pre>

            {history.map((entry) => (
              <div key={entry.id} className="mt-4">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-accent-dim">{PROMPT}</span>
                  <span className="text-slate-200">{entry.query}</span>
                </div>
                <div className="mt-2">
                  {entry.error ? (
                    <p className="text-rose-400">
                      <span className="text-rose-500">✗ error: </span>
                      {entry.error}
                    </p>
                  ) : (
                    entry.result && <ResultRenderer result={entry.result} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* input line */}
          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-ink-600 bg-ink-900/60 px-4 py-3">
            <label htmlFor="sql-input" className="font-mono text-sm text-accent-dim">
              {PROMPT}
            </label>
            <div className="relative flex-1">
              <input
                id="sql-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                placeholder="type a SELECT…"
                aria-label="SQL query input"
                className="w-full bg-transparent font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
              />
              {!input && !busy && (
                <span className="pointer-events-none absolute left-[6.5rem] top-1/2 hidden -translate-y-1/2 sm:block">
                  <span className="inline-block h-4 w-2 animate-blink bg-accent/80 align-middle" />
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={busy}
              className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-xs text-accent transition hover:bg-accent/20 disabled:opacity-40"
            >
              run ⏎
            </button>
          </form>
        </motion.div>

        {/* chips */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-slate-500">queries:</span>
          {SAMPLE_QUERIES.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => typeAndRun(s.query)}
              disabled={busy}
              title={s.query}
              className="rounded-full border border-slate-200 px-3 py-1 font-mono text-xs text-ink-600 transition
                         hover:border-accent hover:bg-accent/10 hover:text-accent-dim disabled:opacity-40
                         dark:border-ink-600 dark:text-slate-400 dark:hover:text-accent"
            >
              {s.label}
            </button>
          ))}
          <button
            type="button"
            onClick={surprise}
            disabled={busy}
            className="rounded-full border border-accent bg-accent/15 px-3 py-1 font-mono text-xs font-medium text-accent transition hover:bg-accent/25 disabled:opacity-40"
          >
            ✦ surprise me
          </button>
          <button
            type="button"
            onClick={() => typeAndRun('SELECT coffee FROM ojas.fuel;')}
            disabled={busy}
            className="font-mono text-xs text-slate-500 underline-offset-4 transition hover:text-accent-dim hover:underline dark:hover:text-accent"
          >
            psst — there's an easter egg
          </button>
        </div>
      </div>
    </section>
  )
}
