/**
 * A tiny, dependency-free SQL engine that runs entirely in the browser against
 * the resume data. It is not a toy that pattern-matches three strings — it
 * tokenizes and executes real SELECT statements:
 *
 *   SELECT <cols | *> FROM ojas.<table>
 *     [WHERE <col> <op> <value> [AND ...]]
 *     [ORDER BY <col> [ASC | DESC]]
 *     [LIMIT <n>]
 *
 * Operators: = != > < >= <= LIKE   ·   Literals: numbers, TRUE/FALSE, 'strings'
 */

import {
  experience,
  projects,
  skills,
  education,
  awards,
  metrics,
  fuel,
  life,
} from '../data/resume'

export type Shape = 'table' | 'cards' | 'bars'

export interface QueryResult {
  columns: string[]
  rows: Record<string, unknown>[]
  shape: Shape
  table: string
  ms: number
  note?: string
}

export class QueryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'QueryError'
  }
}

interface TableDef {
  rows: Record<string, unknown>[]
  defaultShape: Shape
  /** numeric column that, when present, makes the result render as bars */
  vizColumn?: string
  note?: string
}

const TABLES: Record<string, TableDef> = {
  experience: { rows: experience as unknown as Record<string, unknown>[], defaultShape: 'cards' },
  projects: { rows: projects as unknown as Record<string, unknown>[], defaultShape: 'cards' },
  skills: { rows: skills as unknown as Record<string, unknown>[], defaultShape: 'bars', vizColumn: 'level' },
  metrics: { rows: metrics as unknown as Record<string, unknown>[], defaultShape: 'bars', vizColumn: 'value' },
  education: { rows: education as unknown as Record<string, unknown>[], defaultShape: 'table' },
  awards: { rows: awards as unknown as Record<string, unknown>[], defaultShape: 'table' },
  life: {
    rows: life as unknown as Record<string, unknown>[],
    defaultShape: 'cards',
    note: '// the human layer. hype is self-reported and completely unaudited.',
  },
  fuel: {
    rows: fuel as unknown as Record<string, unknown>[],
    defaultShape: 'cards',
    note: '// you found the easter egg. this is what actually powers the pipeline.',
  },
}

type Op = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE'
const OPS: Op[] = ['>=', '<=', '!=', '=', '>', '<', 'LIKE']

interface Condition {
  column: string
  op: Op
  value: string | number | boolean
}

interface ParsedQuery {
  columns: string[] // ['*'] or explicit
  table: string
  where: Condition[]
  orderBy?: { column: string; dir: 'ASC' | 'DESC' }
  limit?: number
}

/** Split a WHERE value token into a typed JS literal. */
function coerceLiteral(raw: string): string | number | boolean {
  const t = raw.trim()
  if (/^'.*'$/.test(t) || /^".*"$/.test(t)) return t.slice(1, -1)
  if (/^true$/i.test(t)) return true
  if (/^false$/i.test(t)) return false
  const n = Number(t)
  if (!Number.isNaN(n) && t !== '') return n
  return t // bareword string (e.g. unquoted value)
}

function likeToRegExp(pattern: string): RegExp {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const sql = escaped.replace(/%/g, '.*').replace(/_/g, '.')
  return new RegExp(`^${sql}$`, 'i')
}

function compare(left: unknown, op: Op, right: string | number | boolean): boolean {
  // Arrays (e.g. stack[]) are matched as their joined string for = / LIKE.
  const lv = Array.isArray(left) ? left.join(', ') : left

  switch (op) {
    case '=':
      if (typeof right === 'boolean') return Boolean(lv) === right
      // eslint-disable-next-line eqeqeq
      return String(lv).toLowerCase() == String(right).toLowerCase()
    case '!=':
      return String(lv).toLowerCase() !== String(right).toLowerCase()
    case '>':
    case '<':
    case '>=':
    case '<=': {
      const a = typeof lv === 'number' ? lv : Number(lv)
      const b = typeof right === 'number' ? right : Number(right)
      if (Number.isNaN(a) || Number.isNaN(b)) {
        const sa = String(lv)
        const sb = String(right)
        if (op === '>') return sa > sb
        if (op === '<') return sa < sb
        if (op === '>=') return sa >= sb
        return sa <= sb
      }
      if (op === '>') return a > b
      if (op === '<') return a < b
      if (op === '>=') return a >= b
      return a <= b
    }
    case 'LIKE':
      return likeToRegExp(String(right)).test(String(lv))
  }
}

function parseWhere(clause: string, validCols: string[]): Condition[] {
  return clause
    .split(/\bAND\b/i)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const op = OPS.find((candidate) => {
        const re = new RegExp(`\\s${candidate}\\s|^${candidate}\\s|\\s${candidate}$`, 'i')
        // ensure word-ish operators (LIKE) match on boundaries
        if (candidate === 'LIKE') return /\bLIKE\b/i.test(part)
        return re.test(` ${part} `)
      })
      if (!op) throw new QueryError(`couldn't parse condition: "${part}"`)

      const splitRe =
        op === 'LIKE' ? /\bLIKE\b/i : new RegExp(op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      const [rawCol, ...rest] = part.split(splitRe)
      const column = rawCol.trim()
      const value = coerceLiteral(rest.join(op).trim())

      if (!validCols.includes(column)) {
        throw new QueryError(
          `unknown column "${column}". try: ${validCols.join(', ')}`,
        )
      }
      return { column, op, value }
    })
}

export function parse(input: string): ParsedQuery {
  let q = input.trim().replace(/;+\s*$/, '')
  if (!q) throw new QueryError('empty query — type a SELECT, or tap a chip below.')
  if (!/^select\b/i.test(q)) {
    throw new QueryError('only SELECT is supported here (this is a read-only career).')
  }

  // LIMIT
  let limit: number | undefined
  const limitMatch = q.match(/\bLIMIT\s+(\d+)\s*$/i)
  if (limitMatch) {
    limit = Number(limitMatch[1])
    q = q.slice(0, limitMatch.index).trim()
  }

  // ORDER BY
  let orderBy: ParsedQuery['orderBy']
  const orderMatch = q.match(/\bORDER\s+BY\s+([a-z_][\w]*)\s*(ASC|DESC)?\s*$/i)
  if (orderMatch) {
    orderBy = { column: orderMatch[1], dir: (orderMatch[2]?.toUpperCase() as 'ASC' | 'DESC') || 'ASC' }
    q = q.slice(0, orderMatch.index).trim()
  }

  // WHERE
  let whereClause = ''
  const whereMatch = q.match(/\bWHERE\b/i)
  if (whereMatch) {
    whereClause = q.slice(whereMatch.index! + 5).trim()
    q = q.slice(0, whereMatch.index).trim()
  }

  // SELECT ... FROM ojas.table
  const core = q.match(/^select\s+(.+?)\s+from\s+(?:ojas\.)?([a-z_][\w]*)\s*$/i)
  if (!core) {
    throw new QueryError('syntax: SELECT <cols> FROM ojas.<table> [WHERE ...] [ORDER BY ...] [LIMIT n]')
  }
  const columns = core[1].trim() === '*' ? ['*'] : core[1].split(',').map((c) => c.trim())
  const table = core[2].toLowerCase()

  const def = TABLES[table]
  if (!def) {
    throw new QueryError(
      `unknown table "ojas.${table}". available: ${Object.keys(TABLES)
        .map((t) => `ojas.${t}`)
        .join(', ')}`,
    )
  }
  const tableCols = Object.keys(def.rows[0] ?? {})

  // validate explicit columns
  if (columns[0] !== '*') {
    for (const c of columns) {
      if (!tableCols.includes(c)) {
        throw new QueryError(`unknown column "${c}" in ojas.${table}. columns: ${tableCols.join(', ')}`)
      }
    }
  }

  const where = whereClause ? parseWhere(whereClause, tableCols) : []
  if (orderBy && !tableCols.includes(orderBy.column)) {
    throw new QueryError(`cannot ORDER BY unknown column "${orderBy.column}".`)
  }

  return { columns, table, where, orderBy, limit }
}

export function run(input: string): QueryResult {
  const startedNow =
    typeof performance !== 'undefined' && performance.now ? performance.now() : 0
  const parsed = parse(input)
  const def = TABLES[parsed.table]

  let rows = def.rows.filter((row) =>
    parsed.where.every((c) => compare(row[c.column], c.op, c.value)),
  )

  if (parsed.orderBy) {
    const { column, dir } = parsed.orderBy
    rows = [...rows].sort((a, b) => {
      const av = a[column]
      const bv = b[column]
      let cmp: number
      if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv
      else cmp = String(av).localeCompare(String(bv))
      return dir === 'DESC' ? -cmp : cmp
    })
  }

  if (parsed.limit !== undefined) rows = rows.slice(0, parsed.limit)

  const tableCols = Object.keys(def.rows[0] ?? {})
  const columns = parsed.columns[0] === '*' ? tableCols : parsed.columns

  const projected = rows.map((row) => {
    const out: Record<string, unknown> = {}
    for (const c of columns) out[c] = row[c]
    return out
  })

  // Shape: bars only when the table's viz column survived the projection.
  let shape: Shape = def.defaultShape
  if (def.vizColumn && !columns.includes(def.vizColumn)) shape = 'table'

  const endedNow =
    typeof performance !== 'undefined' && performance.now ? performance.now() : 0

  return {
    columns,
    rows: projected,
    shape,
    table: parsed.table,
    ms: Math.max(1, Math.round(endedNow - startedNow)),
    note: projected.length === 0 ? '// 0 rows — no records matched that predicate.' : def.note,
  }
}

/** Seeded chips shown under the prompt. */
export const SAMPLE_QUERIES: { label: string; query: string }[] = [
  { label: 'high-impact roles', query: 'SELECT * FROM ojas.experience WHERE impact_pct > 40;' },
  { label: 'top skills', query: 'SELECT skill, level FROM ojas.skills ORDER BY level DESC LIMIT 8;' },
  { label: 'LLM projects', query: 'SELECT project, stack FROM ojas.projects WHERE has_llm = TRUE;' },
  { label: 'the numbers', query: 'SELECT metric, value FROM ojas.metrics ORDER BY value DESC;' },
  { label: 'off the clock', query: 'SELECT * FROM ojas.life ORDER BY hype DESC;' },
  { label: 'education', query: 'SELECT * FROM ojas.education;' },
]

/** "Surprise me" pool — a mix of real insight and one easter egg. */
export const SURPRISE_QUERIES: string[] = [
  'SELECT skill, level FROM ojas.skills WHERE level >= 90 ORDER BY level DESC;',
  'SELECT company, role, impact_pct FROM ojas.experience ORDER BY impact_pct DESC;',
  'SELECT project, stack FROM ojas.projects WHERE featured = TRUE;',
  'SELECT skill FROM ojas.skills WHERE category LIKE \'%AI%\';',
  'SELECT metric, value FROM ojas.metrics WHERE value > 50;',
  'SELECT thing, vibe FROM ojas.life WHERE hype >= 90;',
  'SELECT coffee FROM ojas.fuel;',
]

/** Easter eggs surfaced as a hint on demand. */
export const EASTER_EGGS: string[] = [
  'SELECT coffee FROM ojas.fuel;',
  'SELECT * FROM ojas.fuel;',
]
