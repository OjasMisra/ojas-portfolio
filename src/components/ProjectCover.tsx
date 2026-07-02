/**
 * Generative SVG cover art — one motif per project, drawn from primitives so it
 * stays crisp at any size, themes with the palette, and adds ~0 bytes/requests.
 * Teal-on-charcoal to match the site; Color ID intentionally uses real colors.
 */

const TEAL = '#2DD4BF'
const TEAL_DIM = '#14B8A6'
const TEAL_SOFT = '#5EEAD4'
const GRID = '#1E2733'
const NODE_BG = '#0F141C'

function Frame({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 400 160"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      role="img"
    >
      <defs>
        <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.45" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.14" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="160" fill="#0B0F16" />
      <rect width="400" height="160" fill={`url(#${id}-glow)`} />
      {children}
    </svg>
  )
}

function HGrid() {
  return (
    <g stroke={GRID} strokeWidth="1">
      <line x1="0" y1="40" x2="400" y2="40" />
      <line x1="0" y1="80" x2="400" y2="80" />
      <line x1="0" y1="120" x2="400" y2="120" />
    </g>
  )
}

function FinSage({ id }: { id: string }) {
  const pts = '20,128 60,108 100,116 140,78 180,90 220,52 260,64 300,34 340,44 372,30'
  const dots = [
    [60, 108],
    [140, 78],
    [220, 52],
    [300, 34],
    [372, 30],
  ]
  return (
    <Frame id={id}>
      <HGrid />
      <polygon points={`20,150 ${pts} 372,150`} fill={`url(#${id}-area)`} />
      <polyline points={pts} fill="none" stroke={TEAL} strokeWidth="2.5" strokeLinejoin="round" />
      {dots.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="6" fill={TEAL} opacity="0.18" />
          <circle cx={x} cy={y} r="3" fill={TEAL_SOFT} />
        </g>
      ))}
    </Frame>
  )
}

function StarSchema({ id }: { id: string }) {
  const cx = 200
  const cy = 80
  const dims: [number, number][] = [
    [200, 22],
    [70, 80],
    [330, 80],
    [200, 138],
  ]
  const box = (x: number, y: number, w: number, h: number, accent: boolean) => (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx="5"
        fill={NODE_BG}
        stroke={accent ? TEAL : TEAL_DIM}
        strokeWidth={accent ? '2' : '1.5'}
      />
      <rect x={x - w / 2} y={y - h / 2} width={w} height="9" rx="5" fill={accent ? TEAL : TEAL_DIM} opacity="0.5" />
    </g>
  )
  return (
    <Frame id={id}>
      {dims.map(([x, y], i) => (
        <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={TEAL_DIM} strokeWidth="1.5" opacity="0.6" />
      ))}
      {dims.map(([x, y], i) => (
        <g key={i}>{box(x, y, 74, 40, false)}</g>
      ))}
      {box(cx, cy, 92, 54, true)}
    </Frame>
  )
}

function Streaming({ id }: { id: string }) {
  return (
    <Frame id={id}>
      {/* Kafka partitions */}
      {[46, 74, 102].map((y, i) => (
        <g key={i}>
          <rect x="24" y={y} width="86" height="18" rx="3" fill={NODE_BG} stroke={TEAL_DIM} strokeWidth="1.5" />
          {[34, 52, 70, 88].map((x) => (
            <line key={x} x1={x} y1={y} x2={x} y2={y + 18} stroke={TEAL_DIM} strokeWidth="1" opacity="0.5" />
          ))}
        </g>
      ))}
      {/* flow arrows + packets */}
      <line x1="118" y1="80" x2="176" y2="80" stroke={TEAL} strokeWidth="1.5" />
      <circle cx="140" cy="80" r="3" fill={TEAL_SOFT} />
      <circle cx="162" cy="80" r="3" fill={TEAL_SOFT} opacity="0.6" />
      {/* Spark node */}
      <polygon
        points="200,54 226,68 226,92 200,106 174,92 174,68"
        fill={NODE_BG}
        stroke={TEAL}
        strokeWidth="2"
      />
      <circle cx="200" cy="80" r="7" fill={TEAL} opacity="0.8" />
      <line x1="226" y1="80" x2="286" y2="80" stroke={TEAL} strokeWidth="1.5" />
      <circle cx="250" cy="80" r="3" fill={TEAL_SOFT} />
      {/* sink (store) */}
      <g stroke={TEAL_DIM} strokeWidth="1.5" fill={NODE_BG}>
        <ellipse cx="330" cy="60" rx="34" ry="9" />
        <path d="M296,60 v40 a34 9 0 0 0 68 0 v-40" fill={NODE_BG} />
        <ellipse cx="330" cy="60" rx="34" ry="9" fill={NODE_BG} />
      </g>
    </Frame>
  )
}

function ERDiagram({ id }: { id: string }) {
  const table = (x: number, y: number, w: number, rows: number) => (
    <g>
      <rect x={x} y={y} width={w} height={14 + rows * 12} rx="4" fill={NODE_BG} stroke={TEAL_DIM} strokeWidth="1.5" />
      <rect x={x} y={y} width={w} height="14" rx="4" fill={TEAL} opacity="0.45" />
      {Array.from({ length: rows }).map((_, r) => (
        <line
          key={r}
          x1={x + 8}
          y1={y + 22 + r * 12}
          x2={x + w - 8}
          y2={y + 22 + r * 12}
          stroke={TEAL_DIM}
          strokeWidth="1.5"
          opacity="0.55"
        />
      ))}
    </g>
  )
  return (
    <Frame id={id}>
      <line x1="95" y1="55" x2="180" y2="95" stroke={TEAL_DIM} strokeWidth="1.5" opacity="0.6" />
      <line x1="270" y1="55" x2="230" y2="95" stroke={TEAL_DIM} strokeWidth="1.5" opacity="0.6" />
      <circle cx="180" cy="95" r="3.5" fill={TEAL_SOFT} />
      <circle cx="230" cy="95" r="3.5" fill={TEAL_SOFT} />
      {table(30, 28, 96, 3)}
      {table(272, 24, 96, 3)}
      {table(158, 92, 104, 3)}
    </Frame>
  )
}

function AQI({ id }: { id: string }) {
  const line = '20,120 70,96 120,104 170,70 220,84 270,52 320,66 372,40'
  const scatter = [
    [55, 84],
    [95, 118],
    [150, 92],
    [200, 60],
    [245, 96],
    [300, 44],
    [345, 74],
  ]
  return (
    <Frame id={id}>
      <HGrid />
      <polygon points={`20,150 ${line} 372,150`} fill={`url(#${id}-area)`} />
      <polyline points={line} fill="none" stroke={TEAL} strokeWidth="2.5" strokeLinejoin="round" />
      {scatter.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill={TEAL_SOFT} opacity="0.65" />
      ))}
    </Frame>
  )
}

function Clusters({ id }: { id: string }) {
  // KMeans — intentionally real colors (the project filters images by color).
  const clusters: { color: string; cx: number; cy: number; pts: [number, number][] }[] = [
    { color: '#2DD4BF', cx: 90, cy: 60, pts: [[70, 44], [104, 50], [82, 74], [110, 70], [96, 58]] },
    { color: '#F59E0B', cx: 300, cy: 55, pts: [[282, 40], [316, 46], [296, 68], [322, 64], [306, 54]] },
    { color: '#A78BFA', cx: 190, cy: 116, pts: [[168, 102], [208, 106], [180, 128], [210, 126], [192, 114]] },
  ]
  return (
    <Frame id={id}>
      {clusters.map((c, i) => (
        <g key={i}>
          {c.pts.map(([x, y], j) => (
            <circle key={j} cx={x} cy={y} r="4" fill={c.color} opacity="0.75" />
          ))}
          <circle cx={c.cx} cy={c.cy} r="13" fill="none" stroke={c.color} strokeWidth="2" opacity="0.9" />
          <circle cx={c.cx} cy={c.cy} r="3" fill={c.color} />
        </g>
      ))}
    </Frame>
  )
}

const MOTIFS: Record<string, (p: { id: string }) => JSX.Element> = {
  finsage: FinSage,
  imdb: StarSchema,
  streaming: Streaming,
  rail: ERDiagram,
  aqi: AQI,
  color: Clusters,
}

export default function ProjectCover({ id }: { id: string }) {
  const Motif = MOTIFS[id] ?? FinSage
  return <Motif id={id} />
}
