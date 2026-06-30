import { motion } from 'framer-motion'
import type { QueryResult } from '../lib/queryEngine'

function Cell({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {value.map((v, i) => (
          <span
            key={i}
            className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-mono text-[11px] text-accent-dim dark:text-accent-soft"
          >
            {String(v)}
          </span>
        ))}
      </div>
    )
  }
  if (typeof value === 'boolean') {
    return <span className={value ? 'text-accent' : 'text-slate-500'}>{value ? 'TRUE' : 'FALSE'}</span>
  }
  if (value === undefined || value === null) return <span className="text-slate-500">NULL</span>
  return <span>{String(value)}</span>
}

/** A horizontal bar viz for numeric "level"/"value" result sets. */
function Bars({ result }: { result: QueryResult }) {
  const numCol = result.columns.includes('level') ? 'level' : 'value'
  const labelCol = result.columns.find((c) => c !== numCol) ?? result.columns[0]
  const max = Math.max(...result.rows.map((r) => Number(r[numCol]) || 0), 1)

  return (
    <div className="space-y-2">
      {result.rows.map((row, i) => {
        const val = Number(row[numCol]) || 0
        const pct = (val / max) * 100
        return (
          <div key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <div className="mb-1 truncate font-mono text-xs text-slate-300">{String(row[labelCol])}</div>
              <div className="h-2 overflow-hidden rounded-full bg-ink-600/60">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent-dim to-accent-soft"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: i * 0.05, ease: 'easeOut' }}
                />
              </div>
            </div>
            <span className="w-12 text-right font-mono text-xs tabular-nums text-accent">{val}</span>
          </div>
        )
      })}
    </div>
  )
}

function Cards({ result }: { result: QueryResult }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {result.rows.map((row, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.06 }}
          className="rounded-lg border border-ink-600 bg-ink-900/60 p-3"
        >
          {result.columns.map((col) => (
            <div key={col} className="mb-2 last:mb-0">
              <div className="font-mono text-[10px] uppercase tracking-wider text-accent-dim">{col}</div>
              <div className="text-sm text-slate-200">
                <Cell value={row[col]} />
              </div>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

function Table({ result }: { result: QueryResult }) {
  return (
    <div className="overflow-x-auto scroll-thin">
      <table className="w-full border-collapse text-left font-mono text-xs">
        <thead>
          <tr className="border-b border-ink-600">
            {result.columns.map((c) => (
              <th key={c} className="whitespace-nowrap px-3 py-2 text-accent-dim">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row, i) => (
            <motion.tr
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="border-b border-ink-700/60 last:border-0 hover:bg-accent/5"
            >
              {result.columns.map((c) => (
                <td key={c} className="px-3 py-2 align-top text-slate-300">
                  <Cell value={row[c]} />
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ResultRenderer({ result }: { result: QueryResult }) {
  if (result.rows.length === 0) {
    return <p className="font-mono text-xs text-slate-500">{result.note}</p>
  }
  return (
    <div>
      {result.shape === 'bars' && <Bars result={result} />}
      {result.shape === 'cards' && <Cards result={result} />}
      {result.shape === 'table' && <Table result={result} />}
      <div className="mt-3 flex items-center gap-3 font-mono text-[11px] text-slate-500">
        <span>
          {result.rows.length} row{result.rows.length === 1 ? '' : 's'}
        </span>
        <span>·</span>
        <span>{result.ms} ms</span>
        <span>·</span>
        <span>ojas.{result.table}</span>
        {result.note && <span className="text-accent-dim">{result.note}</span>}
      </div>
    </div>
  )
}
