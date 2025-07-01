'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoManagerProps {
  videos: Array<{
    id: string;
    url: string;
    title: string;
    subtitle: string;
    category: string;
    description: string;
    details: string;
  }>;
  currentSection: number;
  transitionProgress: number;
  isLoaded: boolean;
}

export function VideoManager({
  videos,
  currentSection,
  transitionProgress,
  isLoaded
}: VideoManagerProps) {
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());

  // Preload all videos immediately
  useEffect(() => {
    videos.forEach(video => {
      const videoElement = videoRefs.current[video.id];
      if (videoElement && !loadedVideos.has(video.id)) {
        videoElement.load();
        setLoadedVideos(prev => new Set(prev).add(video.id));
      }
    });
  }, [videos, loadedVideos]);

  // Start playing all videos as soon as they're loaded
  useEffect(() => {
    videos.forEach(video => {
      const videoElement = videoRefs.current[video.id];
      if (
        videoElement &&
        loadedVideos.has(video.id) &&
        !playingVideos.has(video.id)
      ) {
        videoElement
          .play()
          .then(() => {
            setPlayingVideos(prev => new Set(prev).add(video.id));
          })
          .catch(() => {
            console.log('Autoplay prevented for', video.id);
          });
      }
    });
  }, [videos, loadedVideos, playingVideos]);

  // Ensure all videos keep playing continuously
  useEffect(() => {
    const interval = setInterval(() => {
      videos.forEach(video => {
        const videoElement = videoRefs.current[video.id];
        if (videoElement && loadedVideos.has(video.id)) {
          // Keep video playing even when not visible
          if (videoElement.paused) {
            videoElement.play().catch(() => {
              console.log('Video playback interrupted for', video.id);
            });
          }
        }
      });
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [videos, loadedVideos]);

  // Register video ref
  const registerVideoRef = (id: string, element: HTMLVideoElement | null) => {
    videoRefs.current[id] = element;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {videos.map((video, index) => (
        <VideoSection
          key={video.id}
          id={video.id}
          videoUrl={video.url}
          title={video.title}
          subtitle={video.subtitle}
          category={video.category}
          description={video.description}
          details={video.details}
          sectionIndex={index}
          currentSection={currentSection}
          transitionProgress={transitionProgress}
          isActive={index === currentSection}
          isLoaded={isLoaded && loadedVideos.has(video.id)}
          totalSections={videos.length}
          registerVideoRef={registerVideoRef}
        />
      ))}
    </div>
  );
}

// Updated VideoSection component with ref registration
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
  registerVideoRef: (id: string, element: HTMLVideoElement | null) => void;
}

function VideoSection({
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
  registerVideoRef
}: VideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Register video ref with parent
  useEffect(() => {
    registerVideoRef(id, videoRef.current);
  }, [id, registerVideoRef]);

  // Calculate section position and transforms for immediate curtain effect
  const getTransform = () => {
    // During initial loading, first section starts below viewport
    if (!isLoaded && sectionIndex === 0) {
      return 'translateY(100%)';
    }

    if (sectionIndex === currentSection) {
      return 'translateY(0)';
    } else if (sectionIndex === currentSection + 1) {
      const translateY = 100 - transitionProgress * 100;
      return `translateY(${translateY}%)`;
    } else if (sectionIndex === currentSection - 1) {
      const translateY = -(100 - transitionProgress * 100);
      return `translateY(${translateY}%)`;
    } else if (sectionIndex > currentSection) {
      return 'translateY(100%)';
    } else {
      return 'translateY(-100%)';
    }
  };

  const getZIndex = () => {
    if (
      sectionIndex === currentSection + 1 ||
      sectionIndex === currentSection - 1
    ) {
      return 30;
    } else if (sectionIndex === currentSection) {
      return 20;
    } else {
      return 10;
    }
  };

  // Video stays fixed - no scale effect
  const getVideoTransform = () => {
    // Video background stays completely fixed in position
    return 'translateY(0) scale(1)';
  };

  // Pre-calculated positions for consistent rendering
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
        opacity: 1
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
          preload="auto"
          onError={() => console.log('Video failed to load:', videoUrl)}
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}>
          <source src={videoUrl} type="video/mp4" />
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/placeholder.svg?height=1080&width=1920)'
            }}
          />
        </video>

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Left Title */}
              <div className="md:col-span-1">
                <h1
                  className={`text-6xl md:text-8xl font-light text-white tracking-wider transform transition-all duration-1500 ${
                    isActive && isLoaded
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-20 opacity-0'
                  }`}>
                  {title}
                </h1>

                <div
                  className={`w-full h-px bg-white/30 mt-4 transform transition-all duration-1500 delay-300 origin-left ${
                    isActive && isLoaded ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />

                <p
                  className={`text-white/60 text-sm mt-2 transform transition-all duration-1500 delay-500 ${
                    isActive && isLoaded
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-10 opacity-0'
                  }`}>
                  {category}
                </p>
              </div>

              {/* Center Title */}
              <div className="md:col-span-1 text-center">
                <h2
                  className={`text-4xl md:text-6xl font-light text-white tracking-wide transform transition-all duration-1500 delay-200 ${
                    isActive && isLoaded
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-20 opacity-0'
                  }`}>
                  {subtitle}
                </h2>
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
