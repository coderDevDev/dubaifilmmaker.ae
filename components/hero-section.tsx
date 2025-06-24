"use client"

import { useEffect, useRef } from "react"

interface HeroSectionProps {
  isLoaded: boolean
  scrollY: number
  scrollProgress: number
}

export function HeroSection({ isLoaded, scrollY, scrollProgress }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        console.log("Autoplay prevented")
      })
    }
  }, [])

  // Calculate parallax values
  const heroProgress = Math.min(scrollProgress * 5, 1) // First section progress
  const parallaxBg = scrollY * 0.5
  const parallaxContent = scrollY * 0.3
  const fadeOut = Math.max(1 - heroProgress * 2, 0)
  const scale = 1 + heroProgress * 0.2

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Background Video Layer */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translate3d(0, ${parallaxBg}px, 0) scale(${scale})`,
        }}
      >
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted loop playsInline>
          <source src="/placeholder.mp4" type="video/mp4" />
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url(/placeholder.svg?height=1080&width=1920)",
            }}
          />
        </video>
        <div
          className="absolute inset-0 bg-black/40 transition-opacity duration-300"
          style={{ opacity: 0.4 + heroProgress * 0.3 }}
        />
      </div>

      {/* Floating Particles Layer */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `translate3d(0, ${scrollY * (0.1 + Math.random() * 0.3)}px, 0)`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content Layer */}
      <div
        className="relative z-10 h-full flex flex-col justify-between p-6 md:p-12 will-change-transform"
        style={{
          transform: `translate3d(0, ${parallaxContent}px, 0)`,
          opacity: fadeOut,
        }}
      >
        {/* Main Title */}
        <div className="flex-1 flex items-center">
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Left Title */}
              <div className="md:col-span-1">
                <h1
                  className={`text-6xl md:text-8xl font-light text-white tracking-wider transform transition-all duration-1500 ${
                    isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                  }`}
                  style={{
                    transform: `translateY(${isLoaded ? -scrollY * 0.1 : 20}px)`,
                  }}
                >
                  FORÉT
                </h1>
                <div
                  className={`w-full h-px bg-white/30 mt-4 transform transition-all duration-1500 delay-300 origin-left ${
                    isLoaded ? "scale-x-100" : "scale-x-0"
                  }`}
                  style={{
                    transform: `scaleX(${isLoaded ? Math.max(1 - heroProgress, 0) : 0})`,
                  }}
                />
                <p
                  className={`text-white/60 text-sm mt-2 transform transition-all duration-1500 delay-500 ${
                    isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                >
                  Film
                </p>
              </div>

              {/* Center Title */}
              <div className="md:col-span-1 text-center">
                <h2
                  className={`text-4xl md:text-6xl font-light text-white tracking-wide transform transition-all duration-1500 delay-200 ${
                    isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                  }`}
                  style={{
                    transform: `translateY(${isLoaded ? -scrollY * 0.15 : 20}px) scale(${1 - heroProgress * 0.1})`,
                  }}
                >
                  Forét SS25
                </h2>
              </div>

              {/* Right Indicator */}
              <div className="md:col-span-1 flex justify-end">
                <div
                  className={`text-white/60 text-sm transform transition-all duration-1500 delay-700 ${
                    isLoaded ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
                  }`}
                >
                  01 <span className="mx-2">/</span> 05
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Content */}
        <div
          className="flex justify-between items-end"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        >
          <div
            className={`transform transition-all duration-1500 delay-800 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <p className="text-white/80 text-sm md:text-base font-light">Inspiring brands to be creative</p>
          </div>

          <div
            className={`max-w-xs text-right transform transition-all duration-1500 delay-1000 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <p className="text-white/80 text-sm font-light leading-relaxed">
              A Copenhagen based film production company where trust and integrity comes first.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        style={{
          opacity: Math.max(1 - heroProgress * 3, 0),
          transform: `translate(-50%, ${scrollY * 0.1}px)`,
        }}
      >
        <div
          className={`flex flex-col items-center transform transition-all duration-1500 delay-1200 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="w-px h-16 bg-white/30 relative">
            <div className="w-1 h-1 bg-white rounded-full animate-bounce absolute top-0 left-1/2 transform -translate-x-1/2" />
          </div>
          <p className="text-white/60 text-xs mt-2 tracking-wider">SCROLL</p>
        </div>
      </div>
    </section>
  )
}
