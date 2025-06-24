"use client"

import { useRef, useEffect, useState } from "react"

interface ContactSectionProps {
  scrollY: number
  scrollProgress: number
}

export function ContactSection({ scrollY, scrollProgress }: ContactSectionProps) {
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
  const sectionProgress = Math.max(0, Math.min(scrollProgress * 5 - 4, 1)) // Fifth section
  const parallaxBg = (scrollY - window.innerHeight * 4) * 0.2
  const parallaxContent = (scrollY - window.innerHeight * 4) * 0.1

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black will-change-transform"
        style={{
          transform: `translate3d(0, ${parallaxBg}px, 0)`,
        }}
      />

      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-5 will-change-transform"
        style={{
          transform: `translate3d(0, ${parallaxBg * 0.5}px, 0)`,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

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
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                }`}
                style={{
                  transform: `translateY(${isVisible ? -sectionProgress * 20 : 20}px)`,
                }}
              >
                LET'S TALK
              </h2>

              <p
                className={`text-xl text-white/80 font-light leading-relaxed mb-12 transform transition-all duration-1000 delay-300 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                }`}
              >
                Ready to bring your vision to life? We'd love to hear about your project and explore how we can create
                something extraordinary together.
              </p>

              <div
                className={`space-y-6 transform transition-all duration-1000 delay-500 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                }`}
              >
                <div>
                  <p className="text-white/60 text-sm mb-1">EMAIL</p>
                  <p className="text-white text-lg">hello@curbcph.tv</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">LOCATION</p>
                  <p className="text-white text-lg">Copenhagen, Denmark</p>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div
              className={`transform transition-all duration-1000 delay-700 will-change-transform ${
                isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
              }`}
              style={{
                transform: `translateX(${isVisible ? sectionProgress * 10 : 20}px)`,
              }}
            >
              <form className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-300"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-300"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Tell us about your project"
                    rows={4}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-300 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-black py-4 rounded-lg font-medium hover:bg-white/90 hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
