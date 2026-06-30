import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle'

const LINKS = [
  { href: '#console', label: 'console' },
  { href: '#pipeline', label: 'career' },
  { href: '#projects', label: 'projects' },
  { href: '#skills', label: 'skills' },
  { href: '#about', label: 'about' },
  { href: '#contact', label: 'contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled
          ? 'border-b border-slate-200 bg-white/80 backdrop-blur dark:border-ink-700 dark:bg-ink-900/80'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="container-x flex h-14 items-center justify-between" aria-label="Primary">
        <a href="#top" className="group flex items-center gap-2 font-mono text-sm font-bold">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent/15 text-accent">
            &gt;_
          </span>
          <span className="text-ink-800 dark:text-white">ojas.misra</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-md px-3 py-1.5 font-mono text-sm text-ink-600 transition
                           hover:bg-accent/10 hover:text-accent-dim
                           dark:text-slate-400 dark:hover:text-accent"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="ml-2">
            <ThemeToggle />
          </li>
        </ul>

        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
