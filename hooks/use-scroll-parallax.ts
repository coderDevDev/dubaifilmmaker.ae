"use client"

import { useEffect, useState, useCallback } from "react"

export function useScrollParallax() {
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const progress = Math.min(currentScrollY / maxScroll, 1)

    // Smooth the scroll values for better parallax
    setScrollY(currentScrollY)
    setScrollProgress(progress)
  }, [])

  useEffect(() => {
    // Use requestAnimationFrame for 60fps smooth scrolling
    let ticking = false

    const updateScroll = () => {
      handleScroll()
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll)
        ticking = true
      }
    }

    // Use passive listeners for better performance
    window.addEventListener("scroll", onScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener("scroll", onScroll)
  }, [handleScroll])

  return { scrollY, scrollProgress }
}
