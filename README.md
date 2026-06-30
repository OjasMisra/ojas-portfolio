# Ojas Misra — Interactive Data Portfolio

A personal portfolio that behaves like **a live analytics product**. The hero is a real,
client-side **SQL console** — visitors run queries against `ojas.*` tables (my résumé modeled as
data) and watch the results render as typed-out cards, tables, and bar charts. Below it, the page
reads like a BI dashboard: career as an **Extract → Transform → Load** pipeline, animated metric
counters, and "data product" project cards.

Built with **React + Vite + TypeScript + Tailwind + Framer Motion**. No backend, no UI kit — the
query engine runs entirely in the browser.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

Build & preview a production bundle:

```bash
npm run build      # type-checks (tsc -b) then builds to dist/
npm run preview
```

---

## The SQL console

A small, dependency-free SQL engine (`src/lib/queryEngine.ts`) tokenizes and executes real
statements — it doesn't pattern-match a few strings:

```sql
SELECT <cols | *> FROM ojas.<table>
  [WHERE <col> <op> <value> [AND ...]]
  [ORDER BY <col> [ASC | DESC]]
  [LIMIT <n>]
```

- **Operators:** `=  !=  >  <  >=  <=  LIKE`
- **Literals:** numbers, `TRUE` / `FALSE`, `'quoted strings'`
- **Tables:** `experience`, `projects`, `skills`, `education`, `awards`, `metrics`, `fuel`
- Friendly errors for unknown tables/columns, rendered inline in the console.

Try:

```sql
SELECT * FROM ojas.experience WHERE impact_pct > 40;
SELECT skill, level FROM ojas.skills ORDER BY level DESC LIMIT 8;
SELECT project, stack FROM ojas.projects WHERE has_llm = TRUE;
SELECT coffee FROM ojas.fuel;   -- 🥚 easter egg
```

The **✦ surprise me** button runs a random query.

---

## Editing content

**All content lives in one typed file: [`src/data/resume.ts`](src/data/resume.ts).**
Nothing on the page is hard-coded elsewhere. Each export is a typed array:

| Export        | Powers                                   |
| ------------- | ---------------------------------------- |
| `profile`     | name, title, contact, status            |
| `experience`  | the ETL career pipeline (+ `ojas.experience`) |
| `projects`    | project cards (+ `ojas.projects`)        |
| `skills`      | proficiency bars + filter (+ `ojas.skills`) |
| `metrics`     | animated KPI tiles (+ `ojas.metrics`)    |
| `education` / `awards` | the About section               |
| `fuel`        | the easter-egg table                     |

Add a skill, bump a `level`, or add a project — the console, the charts, and the sections all
update automatically. To add a **new queryable table**, add the array to `resume.ts` and register
it in the `TABLES` map in `src/lib/queryEngine.ts`.

---

## Deploy

### GitHub Pages (configured)

This repo ships with `.github/workflows/deploy.yml`. To go live:

1. Push to `main` on a repo named **`ojas-portfolio`** (the `base` path is `/ojas-portfolio/`).
2. In the repo: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
3. Every push to `main` builds and deploys automatically. URL: `https://<user>.github.io/ojas-portfolio/`.

**Renamed the repo?** Update `BASE_PATH` in `deploy.yml` *and* the default `base` in
`vite.config.ts` to `/<your-repo-name>/`.

### Vercel / custom domain

No base path needed — build with `base: '/'`:

```bash
BASE_PATH=/ npm run build
```

On Vercel, import the repo and set the build command to `npm run build`, output dir `dist`, and an
env var `BASE_PATH=/`. Or use a custom domain on Pages and set `base` to `/`.

---

## Project structure

```
src/
├─ data/resume.ts        # ← single source of truth for ALL content
├─ lib/queryEngine.ts    # client-side SQL parser/executor
├─ hooks/useCountUp.ts    # rAF metric counter (reduced-motion aware)
├─ components/
│  ├─ SqlConsole.tsx      # hero: prompt, chips, typed results, surprise, easter eggs
│  ├─ ResultRenderer.tsx  # renders a result set as table / cards / bars
│  ├─ MetricCounter.tsx   # animated KPI tiles
│  ├─ Pipeline.tsx        # career as expandable ETL stages
│  ├─ Projects.tsx        # FinSage (flagship) + AQI data-product cards
│  ├─ Skills.tsx          # category filter + proficiency bars
│  ├─ About.tsx, Contact.tsx, Nav.tsx, ThemeToggle.tsx
├─ App.tsx                # below-the-fold sections lazy-loaded
└─ index.css              # Tailwind layers, theme, reduced-motion
```

## Notes

- **Dark mode** is the default; toggle persists to `localStorage` and applies before paint (no flash).
- **Accessibility:** semantic landmarks, skip link, keyboard-focusable controls with visible focus
  rings, `prefers-reduced-motion` disables animation and the typewriter.
- **Performance:** below-the-fold sections are code-split; no heavy UI kit; fonts preconnected.
