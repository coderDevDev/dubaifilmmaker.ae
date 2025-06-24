"use client"

import { useRef, useEffect, useState } from "react"

interface AboutSectionProps {
  scrollY: number
  scrollProgress: number
}

export function AboutSection({ scrollY, scrollProgress }: AboutSectionProps) {
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
  const sectionProgress = Math.max(0, Math.min(scrollProgress * 5 - 3, 1)) // Fourth section
  const parallaxBg = (scrollY - window.innerHeight * 3) * 0.6
  const parallaxContent = (scrollY - window.innerHeight * 3) * 0.3

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Background Layers */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-gray-800 via-black to-gray-900 will-change-transform"
        style={{
          transform: `translate3d(0, ${parallaxBg}px, 0)`,
        }}
      />

      {/* Radial Background */}
      <div
        className="absolute inset-0 opacity-30 will-change-transform"
        style={{
          transform: `translate3d(0, ${parallaxBg * 0.4}px, 0) scale(${1 + sectionProgress * 0.2})`,
        }}
      >
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 h-full flex items-center justify-center p-6 md:p-12 will-change-transform"
        style={{
          transform: `translate3d(0, ${parallaxContent}px, 0)`,
        }}
      >
        <div className="text-center max-w-4xl">
          <h2
            className={`text-6xl md:text-8xl font-light text-white mb-12 tracking-wider transform transition-all duration-1000 ${
              isVisible ? "scale-100 opacity-100" : "scale-110 opacity-0"
            }`}
            style={{
              transform: `scale(${isVisible ? 1 - sectionProgress * 0.1 : 1.1})`,
            }}
          >
            ABOUT
          </h2>

          <div
            className={`space-y-8 transform transition-all duration-1000 delay-300 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
            style={{
              transform: `translateY(${isVisible ? -sectionProgress * 10 : 20}px)`,
            }}
          >
            <p className="text-2xl md:text-3xl text-white/90 font-light leading-relaxed">
              A Copenhagen based film production company where trust and integrity comes first.
            </p>

            <p className="text-lg text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
              We believe in the power of authentic storytelling. Our team combines creative vision with technical
              expertise to deliver films that not only look beautiful but also connect with audiences on a deeper level.
            </p>

            {/* Stats */}
            <div className="flex justify-center space-x-12 mt-16">
              {[
                { value: "2018", label: "FOUNDED" },
                { value: "50+", label: "PROJECTS" },
                { value: "15+", label: "AWARDS" },
              ].map((stat, index) => (
                <div
                  key={stat.value}
                  className={`text-center transform transition-all duration-1000 will-change-transform ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                  style={{
                    transitionDelay: `${(index + 5) * 100}ms`,
                    transform: `translateY(${isVisible ? sectionProgress * (index + 1) * 5 : 10}px)`,
                  }}
                >
                  <div className="text-3xl md:text-4xl font-light text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-white/60 tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orbiting Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-white/5 rounded-full"
            style={{
              left: `${50 + Math.cos((i * Math.PI) / 3) * 30}%`,
              top: `${50 + Math.sin((i * Math.PI) / 3) * 30}%`,
              transform: `translate3d(0, 0, 0) rotate(${scrollY * 0.1 + i * 60}deg) translateX(${20 + i * 5}px)`,
            }}
          />
        ))}
      </div>
    </section>
  )
}
