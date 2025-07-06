"use client"
import { useEffect, useRef, useState, forwardRef } from "react"
import { gsap } from "gsap"

interface VideoSectionProps {
  videoSrc: string
  index: number
  title?: string
  subtitle?: string
  category?: string
  description?: string
  details?: string
  isActive?: boolean
  isTransitioning?: boolean
  totalSections?: number
}

const VideoSection = forwardRef<HTMLElement, VideoSectionProps>(
  (
    {
      videoSrc,
      index,
      title = `Section ${index}`,
      subtitle,
      category,
      description,
      details,
      isActive = false,
      isTransitioning = false,
      totalSections,
    },
    ref,
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [currentVideoLoaded, setCurrentVideoLoaded] = useState(false)
    const [currentVideoError, setCurrentVideoError] = useState(false)
    const [isClient, setIsClient] = useState(false)

    // Ensure client-side rendering to prevent hydration mismatch
    useEffect(() => {
      setIsClient(true)
    }, [])

    useEffect(() => {
      const video = videoRef.current

      // Auto-play videos when active or during transitions
      if ((isActive || isTransitioning) && video) {
        video.play().catch(() => {})

        // Initial content animation only when becoming active (not during transitions)
        if (isActive && !isTransitioning) {
          gsap.fromTo(
            ".current-content",
            {
              opacity: 0,
              y: 30,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              delay: 0.2,
            },
          )
        }
      } else if (video && !isTransitioning) {
        video.pause()
      }
    }, [isActive, isTransitioning])

    // Don't render until client-side to prevent hydration mismatch
    if (!isClient) {
      return (
        <section
          ref={ref}
          className="fixed inset-0 w-screen h-screen overflow-hidden"
          style={{
            zIndex: isActive ? 10 : index,
            visibility: "hidden",
          }}
        >
          {/* Placeholder to prevent layout shift */}
          <div className="absolute inset-0 bg-black" />
        </section>
      )
    }

    return (
      <section
        ref={ref}
        className="fixed inset-0 w-full h-full overflow-hidden"
        style={{
          zIndex: isActive ? 10 : index,
          visibility: isActive || isTransitioning ? "visible" : "hidden",
          height: '100vh',
          width: '100vw',
        }}
      >
        {/* Current Section Overlay */}
        <div data-overlay="current" className="absolute inset-0" style={{ clipPath: "inset(0 0 0% 0)" }}>
          {/* Loading/Error Overlay for Current Video */}
          {(!currentVideoLoaded || currentVideoError) && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-white z-10">
              {currentVideoError ? (
                <div className="text-center">
                  <div className="text-xl mb-2">Video Error</div>
                  <div className="text-sm opacity-60">Failed to load: {videoSrc}</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mb-4"></div>
                  <div className="text-sm opacity-60">Loading video...</div>
                </div>
              )}
            </div>
          )}

          {/* Current Video Background */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={() => setCurrentVideoLoaded(true)}
            onError={() => setCurrentVideoError(true)}
            onCanPlay={() => setCurrentVideoLoaded(true)}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* Current Dark Overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Current Content */}
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 sm:p-6 md:p-12"
          >
            <div className="w-full max-w-lg mx-auto">
              {/* Subtitle/Category (top left) */}
              <div className="text-xs sm:text-sm font-bold text-white mb-1 drop-shadow">
                {subtitle}
              </div>
              {/* Title (large, bold, responsive, split after 3 words) */}
              {(() => {
                const words = title.split(' ');
                const firstLine = words.slice(0, 3).join(' ');
                const secondLine = words.slice(3).join(' ');
                return (
                  <div
                    className="font-extrabold text-white leading-tight mb-2 drop-shadow"
                    style={{
                      fontSize: 'clamp(1.5rem, 6vw, 3.5rem)',
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {firstLine}
                    {secondLine && <><br />{secondLine}</>}
                  </div>
                );
              })()}
              {/* Divider */}
        
              {/* Bottom row: genre/category and section counter */}
              <div className="flex flex-row w-full">
                {/* Left: Category with divider above */}
                <div className="flex-1 flex flex-col">
                  <div className="h-px w-2/3 bg-white/60 mb-4" />
                  <div className="text-sm sm:text-base font-semibold text-white/90">
                    {category}
                  </div>
                </div>
                {/* Right: Section Index with divider above */}
                <div className="flex flex-col items-end">
                  <div className="h-px w-full bg-white/60 mb-4" />
                  <div className="text-sm sm:text-base font-bold text-white/90 flex items-center gap-5 justify-end">
                    <span>{String(index).padStart(2, '0')}</span>
                    <span className="text-white/60">/</span>
                    <span>{String(totalSections ).padStart(2, '0')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  },
)

VideoSection.displayName = "VideoSection"

export default VideoSection