'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoSectionProps {
  id: string;
  videoUrl: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  details: string;
  sectionIndex: number;
  currentSection: number;
  transitionProgress: number;
  isActive: boolean;
  isLoaded: boolean;
  totalSections: number;
  scrollDirection: 'down' | 'up';
}

export function VideoSection({
  id,
  videoUrl,
  title,
  subtitle,
  category,
  description,
  details,
  sectionIndex,
  currentSection,
  transitionProgress,
  isActive,
  isLoaded,
  totalSections,
  scrollDirection
}: VideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Start video playback immediately when loaded, regardless of active state
  useEffect(() => {
    if (videoRef.current && videoLoaded && !hasStartedPlaying) {
      videoRef.current
        .play()
        .then(() => {
          setHasStartedPlaying(true);
        })
        .catch(() => {
          console.log('Autoplay prevented for', id);
        });
    }
  }, [videoLoaded, hasStartedPlaying, id]);

  // Keep video playing continuously - never pause it
  useEffect(() => {
    if (videoRef.current && videoLoaded && hasStartedPlaying) {
      // Ensure video keeps playing even when not active
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {
          console.log('Video playback interrupted for', id);
        });
      }
    }
  }, [videoLoaded, hasStartedPlaying, id]);

  // Calculate section position and transforms for pinned background effect
  const getTransform = () => {
    // During initial loading, first section starts below viewport
    if (!isLoaded && sectionIndex === 0) {
      return 'translateY(100%)';
    }

    if (sectionIndex === currentSection) {
      // Current section - stays in place or slides away
      if (scrollDirection === 'up' && transitionProgress > 0) {
        // When scrolling up, current section slides down to reveal previous section
        return `translateY(${transitionProgress * 100}%)`;
      }
      return 'translateY(0)';
    } else if (
      scrollDirection === 'down' &&
      sectionIndex === currentSection + 1
    ) {
      // Next section (scrolling down) - slides up from bottom
      const translateY = 100 - transitionProgress * 100;
      return `translateY(${translateY}%)`;
    } else if (
      scrollDirection === 'up' &&
      sectionIndex === currentSection - 1
    ) {
      // Previous section (scrolling up) - stays pinned in place (already there)
      return 'translateY(0)';
    } else if (sectionIndex > currentSection) {
      // Future sections - stay below
      return 'translateY(100%)';
    } else {
      // Past sections - stay pinned in place (background)
      return 'translateY(0)';
    }
  };

  // Get z-index for proper layering (current: 30, previous: 20, others: 10)
  const getZIndex = () => {
    if (sectionIndex === currentSection) {
      // Current section - on top, will slide away
      return 30;
    } else if (
      scrollDirection === 'down' &&
      sectionIndex === currentSection + 1
    ) {
      // Next section (scrolling down) - slides up from bottom
      return 30;
    } else if (
      scrollDirection === 'up' &&
      sectionIndex === currentSection - 1
    ) {
      // Previous section (scrolling up) - stays pinned in background
      return 20;
    } else if (sectionIndex < currentSection) {
      // Past sections - stay pinned in background
      return 20;
    } else {
      // Future sections - below
      return 10;
    }
  };

  // Video stays fixed - no scale effect
  const getVideoTransform = () => {
    // Video background stays completely fixed in position
    return 'translateY(0) scale(1)';
  };

  // Pre-calculated positions for consistent rendering (prevents hydration issues)
  const particlePositions = [
    { left: '12%', top: '15%', delay: 0 },
    { left: '67%', top: '25%', delay: 0.5 },
    { left: '17%', top: '45%', delay: 1 },
    { left: '97%', top: '35%', delay: 1.5 },
    { left: '60%', top: '65%', delay: 2 },
    { left: '79%', top: '85%', delay: 2.5 },
    { left: '25%', top: '75%', delay: 3 },
    { left: '85%', top: '55%', delay: 3.5 },
    { left: '45%', top: '85%', delay: 4 },
    { left: '95%', top: '15%', delay: 4.5 },
    { left: '35%', top: '25%', delay: 5 },
    { left: '75%', top: '75%', delay: 5.5 },
    { left: '55%', top: '35%', delay: 6 },
    { left: '15%', top: '65%', delay: 6.5 },
    { left: '65%', top: '45%', delay: 7 }
  ];

  const triggerInitialTransition = () => {
    setIsScrolling(true);

    let progress = 0;
    const duration = 1000;
    const startTime = Date.now();

    const animateTransition = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(elapsed / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 2);

      if (progress < 1) {
        requestAnimationFrame(animateTransition);
      } else {
        setIsScrolling(false);
      }
    };

    requestAnimationFrame(animateTransition);
  };

  // Refined visibility logic: only outgoing and incoming sections are visible
  const isVisible =
    sectionIndex === currentSection ||
    (scrollDirection === 'down' && sectionIndex === currentSection + 1) ||
    (scrollDirection === 'up' && sectionIndex === currentSection - 1);

  return (
    <section
      className="absolute inset-0 h-screen min-h-screen overflow-hidden"
      style={{
        transform: getTransform(),
        zIndex: getZIndex(),
        display: isVisible ? 'block' : 'none',
        opacity: 1 // Always fully opaque - no fade effects
      }}>
      {/* Video Background Layer */}
      <div
        className="absolute inset-0"
        style={{
          transform: getVideoTransform()
        }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto" // Changed to auto for immediate loading
          onLoadedData={() => {
            setVideoLoaded(true);
            // setIsLoading(false);
            // setIsLoaded(true);
            triggerInitialTransition();
          }}
          onError={() => console.log('Video failed to load:', videoUrl)}
          // Ensure video keeps playing even when not visible
          style={{
            willChange: 'transform', // Optimize for animations
            backfaceVisibility: 'hidden' // Prevent flickering
          }}>
          <source src={videoUrl} type="video/mp4" />
          {/* Fallback image */}
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/placeholder.svg?height=1080&width=1920)'
            }}
          />
        </video>

        {/* Video Overlay */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Floating Particles Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particlePositions.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${2 + (i % 3)}s`,
              transform: `translateY(${transitionProgress * ((i % 10) - 5)}px)`
            }}
          />
        ))}
      </div>

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
                    <span>{String(sectionIndex + 1).padStart(2, '0')}</span>
                    <span className="text-white/60">/</span>
                    <span>{String(totalSections).padStart(2, '0')}</span>
                  </span>
                </div>
              </div>
            </div>
            {/* Horizontal line below */}
          </div>
        </div>

        {/* Bottom Content */}
        <div className="flex justify-between items-end">
          <div
            className={`transform transition-all duration-1500 delay-800 ${
              isActive && isLoaded
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}>
            <p className="text-white/80 text-sm md:text-base font-light">
              {description}
            </p>
          </div>

          <div
            className={`max-w-xs text-right transform transition-all duration-1500 delay-1000 ${
              isActive && isLoaded
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}>
            <p className="text-white/80 text-sm font-light leading-relaxed">
              {details}
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Hint (only on first section) */}
      {sectionIndex === 0 && (
        <div
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1500 delay-1200 ${
            isActive && isLoaded
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }`}>
          <div className="flex flex-col items-center">
            <div className="w-px h-16 bg-white/30 relative">
              <div className="w-1 h-1 bg-white rounded-full animate-bounce absolute top-0 left-1/2 transform -translate-x-1/2" />
            </div>
            <p className="text-white/60 text-xs mt-2 tracking-wider">SCROLL</p>
          </div>
        </div>
      )}
    </section>
  );
}
