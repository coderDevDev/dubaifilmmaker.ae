'use client';

import { useEffect, useState, useRef } from 'react';
import { Navigation } from '@/components/navigation';
import { CustomCursor } from '@/components/custom-cursor';
import { VideoSection } from '@/components/video-section';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isInitialCurtain, setIsInitialCurtain] = useState(false);
  const [curtainProgress, setCurtainProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  const containerRef = useRef<HTMLDivElement>(null);

  // CURB-style loader animation states
  const [lineProgress, setLineProgress] = useState(0); // 0 to 1
  const [showHeadline, setShowHeadline] = useState(false);
  const [showSubheadline, setShowSubheadline] = useState(false);
  const [showPercentage, setShowPercentage] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false); // For animating main content
  const [showCurtain, setShowCurtain] = useState(false); // For curtain reveal
  const [showLoader, setShowLoader] = useState(true); // Loader stays mounted until curtain is done
  const [loaderFadeOut, setLoaderFadeOut] = useState(false); // Loader opacity

  const videoSections = [
    {
      id: 'hero',
      videoUrl:
        'https://video.wixstatic.com/video/8c2c22_13c6aa4d9ebb4e6d9e591dcaaa7cb89e/720p/mp4/file.mp4',
      title: 'THE ABU DHABI PLAN',
      subtitle: 'Abu Dhabi Executive Council',
      category: 'Film',
      description: 'Strategic Vision 2030',
      details: 'A comprehensive development plan for the future of Abu Dhabi.'
    },
    {
      id: 'showcase',
      videoUrl: 'https://assets.curbcph.tv/Click%20Click_Cutdown_3%202.mp4',
      title: 'THE ABU DHABI PLAN - REEM',
      subtitle: 'Abu Dhabi Economic Vision',
      category: 'Strategy',
      description: 'Building a Sustainable Economy',
      details:
        "Transforming Abu Dhabi's economic base and ensuring long-term prosperity."
    },
    {
      id: 'showcase',
      videoUrl: 'https://assets.curbcph.tv/Hermes%202.mp4',
      title: 'THE ABU DHABI PLAN - REEM',
      subtitle: 'Abu Dhabi Economic Vision',
      category: 'Strategy',
      description: 'Building a Sustainable Economy',
      details:
        "Transforming Abu Dhabi's economic base and ensuring long-term prosperity."
    }
  ];

  // Animate the progress line first, then text, then fade out loader
  useEffect(() => {
    if (isLoading) {
      setLineProgress(0);
      setShowHeadline(false);
      setShowSubheadline(false);
      setShowPercentage(false);
      setShowMainContent(false);
      setShowCurtain(false);
      setShowLoader(true);
      setLoaderFadeOut(false);
      // Animate line
      const duration = 500; // 0.5s (as per your last edit)
      const startTime = Date.now();
      const animateLine = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setLineProgress(progress);
        if (progress < 1) {
          requestAnimationFrame(animateLine);
        } else {
          // Staggered text reveal after line is complete
          setTimeout(() => setShowHeadline(true), 100);
          setTimeout(() => setShowSubheadline(true), 350);
          setTimeout(() => setShowPercentage(true), 600);
          // Start curtain and fade out loader after all text is visible
          setTimeout(() => {
            setIsLoading(false);
            setIsInitialCurtain(true);
            setShowCurtain(true); // Start curtain reveal
            setLoaderFadeOut(true); // Start fading out loader
            setTimeout(() => {
              setShowMainContent(true); // Fade in main content as curtain animates
            }, 100); // slight delay for overlap
            setTimeout(() => {
              setShowLoader(false); // Unmount loader after fade out
              setShowCurtain(false); // Remove curtain after animation
            }, 1100); // curtain animates for 1s
          }, 1400);
        }
      };
      requestAnimationFrame(animateLine);
    }
  }, [isLoading]);

  // Curtain effect for homepage after loading
  useEffect(() => {
    if (!isInitialCurtain) return;
    let progress = 0;
    const duration = 1000;
    const startTime = Date.now();
    const animateCurtain = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 2);
      setCurtainProgress(easedProgress);
      if (progress < 1) {
        requestAnimationFrame(animateCurtain);
      } else {
        setCurtainProgress(0);
        setIsInitialCurtain(false);
        setIsLoaded(true);
        setTimeout(() => setShowCurtain(false), 100);
      }
    };
    requestAnimationFrame(animateCurtain);
  }, [isInitialCurtain]);

  useEffect(() => {
    if (!isLoaded) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling) return;
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextSection = currentSection + direction;
      if (nextSection >= 0 && nextSection < videoSections.length) {
        setScrollDirection(direction > 0 ? 'down' : 'up');
        triggerTransition(nextSection);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentSection < videoSections.length - 1) {
          setScrollDirection('down');
          triggerTransition(currentSection + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentSection > 0) {
          setScrollDirection('up');
          triggerTransition(currentSection - 1);
        }
      }
    };
    const triggerTransition = (targetSection: number) => {
      setIsScrolling(true);
      let progress = 0;
      const duration = 1000;
      const startTime = Date.now();
      const animateTransition = () => {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 2);
        setTransitionProgress(easedProgress);
        if (progress < 1) {
          requestAnimationFrame(animateTransition);
        } else {
          setCurrentSection(targetSection);
          setTransitionProgress(0);
          setIsScrolling(false);
        }
      };
      requestAnimationFrame(animateTransition);
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection, isScrolling, videoSections.length, isLoaded]);

  // Handle navigation clicks
  const navigateToSection = (sectionIndex: number) => {
    if (!isScrolling && sectionIndex !== currentSection) {
      setScrollDirection(sectionIndex > currentSection ? 'down' : 'up');
      setIsScrolling(true);
      let progress = 0;
      const duration = 1000;
      const startTime = Date.now();
      const animateTransition = () => {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 2);
        setTransitionProgress(easedProgress);
        if (progress < 1) {
          requestAnimationFrame(animateTransition);
        } else {
          setCurrentSection(sectionIndex);
          setTransitionProgress(0);
          setIsScrolling(false);
        }
      };
      requestAnimationFrame(animateTransition);
    }
  };

  const getTransform = () => {
    if (sectionIndex === currentSection) {
      // Outgoing section
      if (isScrolling) {
        return scrollDirection === 'down'
          ? `translateY(-${transitionProgress * 100}%)`
          : `translateY(${transitionProgress * 100}%)`;
      }
      return 'translateY(0)';
    }
    if (
      (scrollDirection === 'down' && sectionIndex === currentSection + 1) ||
      (scrollDirection === 'up' && sectionIndex === currentSection - 1)
    ) {
      // Incoming section
      return scrollDirection === 'down'
        ? `translateY(${100 - transitionProgress * 100}%)`
        : `translateY(-${100 - transitionProgress * 100}%)`;
    }
    // All other sections are hidden
    return 'translateY(100%)';
  };

  const getZIndex = () => {
    if (
      (scrollDirection === 'down' && sectionIndex === currentSection + 1) ||
      (scrollDirection === 'up' && sectionIndex === currentSection - 1)
    ) {
      return 30; // Incoming section on top
    }
    if (sectionIndex === currentSection) {
      return 20; // Outgoing section below
    }
    return 0;
  };

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Loader stays visible and fades out as curtain animates */}
      {showLoader && (
        <div
          className={`fixed inset-0 z-[2000] bg-black flex justify-center items-center transition-opacity duration-1000 ${
            loaderFadeOut ? 'opacity-0' : 'opacity-100'
          }`}>
          <div className="w-full px-2 md:px-8">
            <div className="grid grid-cols-1 lg:[grid-template-columns:auto_1fr_auto] items-end w-full gap-x-12">
              {/* Left: Headline */}
              <div
                className={`py-5 text-white font-bold uppercase overflow-hidden text-ellipsis min-w-0 max-w-[60vw] text-left justify-self-start transition-all duration-700
                  ${
                    showHeadline
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-8'
                  }`}
                style={{
                  fontFamily: `'Oswald', 'Impact', 'Arial Narrow', Arial, sans-serif`,
                  fontWeight: 700,
                  fontSize: 'clamp(1.2rem, 3.5vw, 2.8rem)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.04em',
                  whiteSpace: 'nowrap',
                  marginBottom: 0
                }}>
                CONTENT CREATORS FOR THE NEW ERA
              </div>
              {/* Center: Subheadline */}
              <div className="py-5 flex flex-col items-center text-center flex-shrink-0 min-w-0 overflow-hidden text-ellipsis text-nowrap mt-2 lg:mt-0 justify-self-center lg:ml-12">
                <div
                  className={`text-white transition-all duration-700 ${
                    showSubheadline
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    fontFamily: `'Playfair Display', 'Georgia', 'Times New Roman', serif`,
                    fontWeight: 700,
                    fontSize: 'clamp(1.1rem, 2.5vw, 3.2rem)',
                    lineHeight: 1.1,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    marginBottom: '0.2em'
                  }}>
                  Film, TV & Commercial
                </div>
              </div>
              {/* Right: Percentage */}
              <div className="flex flex-col items-end text-right flex-shrink-0 min-w-0 text-nowrap mt-2 lg:mt-0 justify-self-end">
                <div
                  className={`py-5 text-white transition-all duration-700 ${
                    showPercentage
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-8'
                  }`}
                  style={{
                    fontFamily: `'Oswald', 'Arial Narrow', Arial, sans-serif`,
                    fontWeight: 700,
                    fontSize: 'clamp(0.8rem, 1vw, 1.1rem)',
                    textAlign: 'right',
                    letterSpacing: '0.04em',
                    marginBottom: '0.1em'
                  }}>
                  100%
                </div>
              </div>
            </div>
            {/* Animated border bottom */}
            <div className="w-full mt-2 relative h-px">
              {/* Static faint line */}
              <div className="absolute inset-0 h-px bg-white/20 w-full" />
              {/* Animated progress line */}
              <div
                className="absolute inset-0 h-px bg-white transition-all duration-200"
                style={{
                  width: `${Math.round(lineProgress * 100)}%`
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Animation */}
      <div className="relative">
        {/* Curtain Reveal Animation */}
        <div
          className={`fixed inset-0 z-[1500] bg-black transition-transform duration-1000 ease-in-out pointer-events-none
            ${showCurtain ? 'translate-y-0' : '-translate-y-full'}`}
          style={{ willChange: 'transform' }}
        />
        {/* Main Content Animation */}
        <div
          id="main-content"
          className={`transition-opacity duration-1000 ease-out ${
            showMainContent ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
          <nav
            className={`navigation fixed top-0 left-0 right-0 z-[1000] transition-all duration-1000 bg-transparent ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}>
            <Navigation
              currentSection={currentSection}
              totalSections={videoSections.length}
              onNavigate={navigateToSection}
            />
          </nav>
          <main
            className={`relative w-full h-full transition-opacity duration-1000 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}>
            <CustomCursor />
            {videoSections.map((section, index) => (
              <VideoSection
                key={`${section.id}-${index}`} // Add index to key
                {...section}
                sectionIndex={index}
                currentSection={currentSection}
                transitionProgress={
                  isInitialCurtain && index === 0
                    ? curtainProgress
                    : transitionProgress
                }
                isActive={index === currentSection}
                isLoaded={isLoaded}
                totalSections={videoSections.length}
                scrollDirection={scrollDirection}
                isScrolling={isScrolling}
                getTransform={getTransform}
                getZIndex={getZIndex}
              />
            ))}
          </main>
          {/* Section Indicators */}
          <div
            className={`fixed right-8 top-1/2 transform -translate-y-1/2 z-50 space-y-4 transition-opacity duration-1000 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}>
            {videoSections.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateToSection(index)}
                className={`w-2 h-8 rounded-full transition-all duration-500 ${
                  index === currentSection
                    ? 'bg-white shadow-lg'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          {/* Current Section Indicator */}
          <div
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 text-white/60 text-sm font-light transition-opacity duration-1000 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}>
            {String(currentSection + 1).padStart(2, '0')} /{' '}
            {String(videoSections.length).padStart(2, '0')}
          </div>
          {/* Progress Indicator */}
          <div
            className={`fixed top-0 left-0 w-full h-1 bg-white/10 z-50 transition-opacity duration-1000 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}>
            <div
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{
                width: `${((currentSection + 1) / videoSections.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
