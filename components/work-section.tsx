"use client"

import { useRef, useEffect, useState } from "react"

interface WorkSectionProps {
  scrollY: number
  scrollProgress: number
}

export function WorkSection({ scrollY, scrollProgress }: WorkSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Calculate section-specific parallax
  const sectionProgress = Math.max(0, Math.min(scrollProgress * 5 - 1, 1)) // Second section
  const parallaxBg = (scrollY - window.innerHeight) * 0.3
  const parallaxContent = (scrollY - window.innerHeight) * 0.1
  const fadeIn = Math.min(sectionProgress * 2, 1)

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Background Layers */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 will-change-transform"
        style={{
          transform: `translate3d(0, ${parallaxBg}px, 0)`,
        }}
      />

      {/* Animated Background Pattern */}
      <div
        className="absolute inset-0 opacity-20 will-change-transform"
        style={{
          transform: `translate3d(0, ${parallaxBg * 0.5}px, 0) rotate(${sectionProgress * 5}deg)`,
        }}
      >
        <div className="w-full h-full bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      {/* Content Layer */}
      <div
        className="relative z-10 h-full flex items-center justify-center p-6 md:p-12 will-change-transform"
        style={{
          transform: `translate3d(0, ${parallaxContent}px, 0)`,
          opacity: fadeIn,
        }}
      >
        <div className="text-center max-w-4xl">
          <h2
            className={`text-6xl md:text-8xl font-light text-white mb-8 tracking-wider transform transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
            style={{
              transform: `translateY(${isVisible ? -sectionProgress * 20 : 20}px)`,
            }}
          >
            OUR WORK
          </h2>

          <div
            className={`w-32 h-px bg-white/30 mx-auto mb-8 transform transition-all duration-1000 delay-300 ${
              isVisible ? "scale-x-100" : "scale-x-0"
            }`}
            style={{
              transform: `scaleX(${isVisible ? 1 - sectionProgress * 0.3 : 0})`,
            }}
          />

          <p
            className={`text-xl md:text-2xl text-white/80 font-light leading-relaxed transform transition-all duration-1000 delay-500 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            Crafting visual stories that inspire and connect with audiences worldwide
          </p>

          {/* Project Grid */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 transform transition-all duration-1000 delay-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            {["Fashion Films", "Brand Stories", "Commercial Work"].map((item, index) => (
              <div
                key={item}
                className="group cursor-pointer will-change-transform"
                style={{
                  transform: `translateY(${sectionProgress * (index + 1) * 10}px)`,
                }}
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105">
                  <h3 className="text-white text-lg font-medium mb-2">{item}</h3>
                  <p className="text-white/60 text-sm">Discover our latest projects</p>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            style={{
              left: `${20 + i * 10}%`,
              top: `${30 + i * 5}%`,
              transform: `translate3d(0, ${scrollY * (0.05 + i * 0.02)}px, 0)`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </section>
  )
}
