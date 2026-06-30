import { lazy, Suspense } from 'react'
import Nav from './components/Nav'
import SqlConsole from './components/SqlConsole'

// Below-the-fold sections are code-split to keep the hero bundle lean.
const MetricsBand = lazy(() => import('./components/MetricCounter'))
const Pipeline = lazy(() => import('./components/Pipeline'))
const Projects = lazy(() => import('./components/Projects'))
const Skills = lazy(() => import('./components/Skills'))
const About = lazy(() => import('./components/About'))
const Contact = lazy(() => import('./components/Contact'))

const Loading = () => <div className="container-x py-16" aria-hidden />

export default function App() {
  return (
    <div id="top" className="min-h-screen">
      <a
        href="#console"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:font-mono focus:text-sm focus:text-ink-900"
      >
        Skip to query console
      </a>

      <Nav />

      <main>
        <SqlConsole />
        <Suspense fallback={<Loading />}>
          <MetricsBand />
          <Pipeline />
          <Projects />
          <Skills />
          <About />
          <Contact />
        </Suspense>
      </main>
    </div>
  )
}
