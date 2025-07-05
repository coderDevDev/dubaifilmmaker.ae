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
        className="fixed inset-0 w-screen h-screen overflow-hidden"
        style={{
          zIndex: isActive ? 10 : index,
          visibility: isActive || isTransitioning ? "visible" : "hidden",
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
              {/* Content Overlay */}
      <div
        className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-12"
        style={{
          transform: 'translateY(0)' // Content stays fixed like the video
        }}>
        {/* Main Content */}
        <div className="flex-1 flex items-center">
          <div className="w-full">
            <div className="grid grid-cols-1 md:[grid-template-columns:auto_1fr_auto] items-end w-full gap-x-8">
              {/* Left: Headline */}
              <div className="flex items-end">
                <div
                  className="px-2 py-5 border-b  border-white/30" /* remove border for prod */
                >
                  <span
                    className="text-white font-bold uppercase"
                    style={{
                      fontFamily: `'Oswald', 'Impact', 'Arial Narrow', Arial, sans-serif`,
                      fontWeight: 700,
                      fontSize: 'clamp(1.5rem, 3.5vw, 2.8rem)',
                      lineHeight: 1.05,
                      letterSpacing: '-0.04em',
                      whiteSpace: 'nowrap'
                    }}>
                    {title}
                  </span>
                </div>
              </div>
              {/* Center: Category above Subheadline */}
              <div className="flex flex-col items-start gap-1">
                <div className="px-2 py-0.5 " /* remove border for prod */>
                  <span
                    className="text-white font-bold uppercase"
                    style={{
                      fontFamily: `'Oswald', 'Arial Narrow', Arial, sans-serif`,
                      fontWeight: 700,
                      fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
                      letterSpacing: '0.02em'
                    }}>
                    {category}
                  </span>
                </div>
                <div
                  className="px-2 py-5 border-b border-white/50" /* remove border for prod */
                >
                  <span
                    className="text-white"
                    style={{
                      fontFamily: `'Playfair Display', 'Georgia', 'Times New Roman', serif`,
                      fontWeight: 700,
                      fontSize: 'clamp(1.1rem, 2.5vw, 2.2rem)',
                      lineHeight: 1.1,
                      textAlign: 'left',
                      whiteSpace: 'nowrap'
                    }}>
                    {subtitle}
                  </span>
                </div>
              </div>
              {/* Right: Section Indicator */}
              <div className="flex items-center justify-center">
                <div className="px-6 py-3 border-b border-white/20">
                  <span
                    className="text-white font-bold flex items-center gap-10"
                    style={{
                      fontFamily: `'Oswald', 'Arial Narrow', Arial, sans-serif`,
                      fontWeight: 700,
                      fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                      letterSpacing: '0.1em'
                    }}>
                    <span>{String(index).padStart(2, '0')}</span>
                    <span className="text-white/60">/</span>
                    <span>{String(index).padStart(2, '0')}</span>
                  </span>
                </div>
              </div>
            </div>
            {/* Horizontal line below */}
          </div>
        </div>
        </div>     </div>
      </section>
    )
  },
)

VideoSection.displayName = "VideoSection"

export default VideoSection
