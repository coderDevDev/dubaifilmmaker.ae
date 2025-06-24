"use client"

import { useRef, useEffect, useState } from "react"

interface ServicesSectionProps {
  scrollY: number
  scrollProgress: number
}

export function ServicesSection({ scrollY, scrollProgress }: ServicesSectionProps) {
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

  const services = [
    { title: "Film Production", description: "End-to-end film production services" },
    { title: "Creative Direction", description: "Strategic creative guidance for your brand" },
    { title: "Brand Storytelling", description: "Compelling narratives that resonate" },
    { title: "Post Production", description: "Professional editing and finishing" },
  ]

  // Calculate section-specific parallax
  const sectionProgress = Math.max(0, Math.min(scrollProgress * 5 - 2, 1)) // Third section
  const parallaxBg = (scrollY - window.innerHeight * 2) * 0.4
  const parallaxContent = (scrollY - window.innerHeight * 2) * 0.2

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Background Layers */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black will-change-transform"
        style={{
          transform: `translate3d(0, ${parallaxBg}px, 0)`,
        }}
      />

      {/* Geometric Background */}
      <div
        className="absolute inset-0 opacity-10 will-change-transform"
        style={{
          transform: `translate3d(0, ${parallaxBg * 0.3}px, 0) scale(${1 + sectionProgress * 0.1})`,
        }}
      >
        <div className="w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,rgba(255,255,255,0.1),transparent_120deg,rgba(255,255,255,0.05),transparent_240deg)]" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 h-full flex items-center p-6 md:p-12 will-change-transform"
        style={{
          transform: `translate3d(0, ${parallaxContent}px, 0)`,
        }}
      >
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <h2
                className={`text-6xl md:text-7xl font-light text-white mb-8 tracking-wider transform transition-all duration-1000 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
                }`}
                style={{
                  transform: `translateX(${isVisible ? -sectionProgress * 30 : -20}px)`,
                }}
              >
                SERVICES
              </h2>

              <p
                className={`text-xl text-white/80 font-light leading-relaxed mb-12 transform transition-all duration-1000 delay-300 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
                }`}
              >
                We offer comprehensive film production services, from concept to completion, ensuring every project
                meets the highest standards of creativity and professionalism.
              </p>
            </div>

            {/* Right Services Grid */}
            <div className="space-y-6">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className={`group cursor-pointer transform transition-all duration-1000 will-change-transform ${
                    isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
                  }`}
                  style={{
                    transitionDelay: `${(index + 1) * 200}ms`,
                    transform: `translateX(${isVisible ? sectionProgress * (index + 1) * 15 : 20}px)`,
                  }}
                >
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                    <h3 className="text-white text-xl font-medium mb-2 group-hover:text-white/90">{service.title}</h3>
                    <p className="text-white/60 text-sm group-hover:text-white/70">{service.description}</p>
                    <div className="w-0 group-hover:w-full h-px bg-gradient-to-r from-white/20 to-transparent mt-4 transition-all duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Parallax Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            style={{
              top: `${20 + i * 15}%`,
              transform: `translate3d(${scrollY * (0.1 + i * 0.05)}px, 0, 0)`,
            }}
          />
        ))}
      </div>
    </section>
  )
}
