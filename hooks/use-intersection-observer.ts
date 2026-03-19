'use client'

import { useRef, useEffect, useCallback } from 'react'

interface UseIntersectionObserverOptions {
  enabled?: boolean
  rootMargin?: string
  threshold?: number
}

export function useIntersectionObserver(
  onIntersect: () => void,
  {
    enabled = true,
    rootMargin = '200px',
    threshold = 0.1,
  }: UseIntersectionObserverOptions = {},
) {
  const targetRef = useRef<HTMLDivElement>(null)
  const isFetchingRef = useRef(false)

  const stableOnIntersect = useCallback(() => {
    if (isFetchingRef.current) return
    isFetchingRef.current = true
    onIntersect()
  }, [onIntersect])

  // Reset the guard when enabled flips back to true (fetch completed)
  useEffect(() => {
    if (enabled) {
      isFetchingRef.current = false
    }
  }, [enabled])

  useEffect(() => {
    const el = targetRef.current
    if (!el || !enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          stableOnIntersect()
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [stableOnIntersect, enabled, rootMargin, threshold])

  return targetRef
}
