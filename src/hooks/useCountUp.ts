import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Counts from 0 to `target` with an ease-out curve once `active` is true.
 * Respects prefers-reduced-motion (jumps straight to the value).
 */
export function useCountUp(target: number, active: boolean, durationMs = 1400): number {
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)
  const raf = useRef<number>()

  useEffect(() => {
    if (!active) return
    if (reduce) {
      setValue(target)
      return
    }

    let start: number | null = null
    const step = (ts: number) => {
      if (start === null) start = ts
      const progress = Math.min((ts - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setValue(target * eased)
      if (progress < 1) raf.current = requestAnimationFrame(step)
      else setValue(target)
    }
    raf.current = requestAnimationFrame(step)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [target, active, durationMs, reduce])

  return value
}
