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
  totalSections
}: VideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

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

  // Calculate section position and transforms for immediate curtain effect
  const getTransform = () => {
    if (sectionIndex === currentSection) {
      // Current section - stays in place
      return 'translateY(0)';
    } else if (sectionIndex === currentSection + 1) {
      // Next section (scrolling down) - slides up from bottom
      const translateY = 100 - transitionProgress * 100;
      return `translateY(${translateY}%)`;
    } else if (sectionIndex === currentSection - 1) {
      // Previous section (scrolling up) - slides down from top
      const translateY = -(100 - transitionProgress * 100);
      return `translateY(${translateY}%)`;
    } else if (sectionIndex > currentSection) {
      // Future sections - stay below
      return 'translateY(100%)';
    } else {
      // Past sections - stay above
      return 'translateY(-100%)';
    }
  };

  // Get z-index for proper layering (no opacity changes)
  const getZIndex = () => {
    if (
      sectionIndex === currentSection + 1 ||
      sectionIndex === currentSection - 1
    ) {
      // Transitioning section should be on top
      return 30;
    } else if (sectionIndex === currentSection) {
      // Current section in middle
      return 20;
    } else {
      // Other sections below
      return 10;
    }
  };

  // Subtle parallax scale for depth (reduced effect)
  const getScale = () => {
    if (sectionIndex === currentSection) {
      return 1 + transitionProgress * 0.02; // Very subtle scale
    } else if (
      sectionIndex === currentSection + 1 ||
      sectionIndex === currentSection - 1
    ) {
      return 0.98 + transitionProgress * 0.02; // Subtle scale up
    }
    return 1;
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

  return (
    <section
      className="absolute inset-0 h-screen min-h-screen overflow-hidden"
      style={{
        transform: getTransform(),
        zIndex: getZIndex(),
        opacity: 1 // Always fully opaque - no fade effects
      }}>
      {/* Video Background Layer */}
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${getScale()})`
        }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto" // Changed to auto for immediate loading
          onLoadedData={() => setVideoLoaded(true)}
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
          transform: `translateY(${
            transitionProgress * (sectionIndex === currentSection ? -10 : 10)
          }px)`
        }}>
        {/* Main Content */}
        <div className="flex-1 flex items-center">
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Left Title */}
              <div className="md:col-span-1">
                <h2
                  className={`text-4xl md:text-1xl font-bold text-white tracking-wide transform transition-all duration-1500 delay-200 ${
                    isActive && isLoaded
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-20 opacity-0'
                  }`}>
                  {title}
                </h2>
                <div
                  className={`w-full h-px bg-white/30 mt-4 transform transition-all duration-1500 delay-300 origin-left ${
                    isActive && isLoaded ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />

                {/* <p
                  className={`text-white/60 text-sm mt-2 transform transition-all duration-1500 delay-500 ${
                    isActive && isLoaded
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-10 opacity-0'
                  }`}>
                  {category}
                </p> */}
              </div>

              {/* Center Title */}
              <div className="md:col-span-1 text-center">
                <h2
                  className={`text-1xl md:text-1xl font-light text-white tracking-wide transform transition-all duration-1500 delay-200 ${
                    isActive && isLoaded
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-20 opacity-0'
                  }`}>
                  {subtitle}
                </h2>

                <div
                  className={`w-full h-px bg-white/30 mt-4 transform transition-all duration-1500 delay-300 origin-left ${
                    isActive && isLoaded ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </div>

              {/* Right Indicator */}
              <div className="md:col-span-1 flex justify-end">
                <div
                  className={`text-white/60 text-sm transform transition-all duration-1500 delay-700 ${
                    isActive && isLoaded
                      ? 'translate-x-0 opacity-100'
                      : 'translate-x-10 opacity-0'
                  }`}>
                  {String(sectionIndex + 1).padStart(2, '0')}{' '}
                  <span className="mx-2">/</span>{' '}
                  {String(totalSections).padStart(2, '0')}
                  <div
                    className={`w-full h-px bg-white/30 mt-4 transform transition-all duration-1500 delay-300 origin-left ${
                      isActive && isLoaded ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>
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
