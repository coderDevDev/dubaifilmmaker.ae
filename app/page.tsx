'use client';

import { useEffect, useState, useRef } from 'react';
import { Navigation } from '@/components/navigation';
import { CustomCursor } from '@/components/custom-cursor';
import VideoSection from "@/components/video-section"
import { gsap } from "gsap"
export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isInitialCurtain, setIsInitialCurtain] = useState(false);
  const [curtainProgress, setCurtainProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  // CURB-style loader animation states
  const [lineProgress, setLineProgress] = useState(0); // 0 to 1
  const [showHeadline, setShowHeadline] = useState(false);
  const [showSubheadline, setShowSubheadline] = useState(false);
  const [showPercentage, setShowPercentage] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false); // For animating main content
  const [showCurtain, setShowCurtain] = useState(false); // For curtain reveal
  const [showLoader, setShowLoader] = useState(true); // Loader stays mounted until curtain is done
  const [loaderFadeOut, setLoaderFadeOut] = useState(false); // Loader opacity

  const [pointerStartY, setPointerStartY] = useState<number | null>(null);
  const [pointerEndY, setPointerEndY] = useState<number | null>(null);

  const videoSections = [
    {
      id: "hero",
      videoUrl: "https://video.wixstatic.com/video/8c2c22_13c6aa4d9ebb4e6d9e591dcaaa7cb89e/720p/mp4/file.mp4",
      title: "THE ABU DHABI PLAN",
      subtitle: "Abu Dhabi Executive Council",
      category: "Film",
      description: "THE ABU DHABI PLAN",
      details: "A comprehensive development plan for the future of Abu Dhabi.",
    },
    {
      id: "showcase",
      videoUrl: "https://video.wixstatic.com/video/8c2c22_be8c6399dae342ad85c57a9ae6401857/1080p/mp4/file.mp4",
      title: "THE ABU DHABI PLAN - REEM",
      subtitle: "Abu Dhabi Executive Council",
      category: "Film",
      description: "Strategic Vision 2030",
      details: "Building a sustainable economy and ensuring long-term prosperity.",
    },
    {
      id: "showcase111",
      videoUrl: "https://video.wixstatic.com/video/8c2c22_be8c6399dae342ad85c57a9ae6401857/1080p/mp4/file.mp4",
      title: "THE ABU DHABI PLAN - FAISAL",
      subtitle: "Abu Dhabi Executive Council",
      category: "Film",
      description: "Strategic Vision 2030",
      details: "Building a sustainable economy and ensuring long-term prosperity.",
    },
  ]



  // Helper functions for navigation
  const getNextIndex = (currentIndex: number) => {
    return currentIndex < videoSections.length - 1 ? currentIndex + 1 : 0;
  };

  const getPreviousIndex = (currentIndex: number) => {
    return currentIndex > 0 ? currentIndex - 1 : videoSections.length - 1;
  };

  const animateToNext = () => {
    if (isScrolling) return;

    const nextIndex = getNextIndex(currentSection);
    setIsScrolling(true);

    const currentSectionElement = sectionsRef.current[currentSection];
    const nextSectionElement = sectionsRef.current[nextIndex];

    if (currentSectionElement && nextSectionElement) {
      const currentOverlay = currentSectionElement.querySelector('[data-overlay="current"]') as HTMLElement;
      const nextOverlay = nextSectionElement.querySelector('[data-overlay="current"]') as HTMLElement;

      // Make next section visible and set initial state
      gsap.set(nextSectionElement, { visibility: "visible", zIndex: 20 });
      gsap.set(nextOverlay, { clipPath: "inset(100% 0 0 0)" });

      // Animate curtain transition down
      gsap.to(currentOverlay, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.8,
        ease: "power2.inOut",
      });

      gsap.to(nextOverlay, {
        clipPath: "inset(0% 0 0 0)",
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          // Clean up after transition
          gsap.set(currentSectionElement, { visibility: "hidden", zIndex: currentSection + 1 });
          gsap.set(nextSectionElement, { zIndex: nextIndex + 1 });
          setCurrentSection(nextIndex);
          setIsScrolling(false);
        },
      });
    }
  };

  const animateToPrevious = () => {
    if (isScrolling) return;

    const prevIndex = getPreviousIndex(currentSection);
    setIsScrolling(true);

    const currentSectionElement = sectionsRef.current[currentSection];
    const prevSectionElement = sectionsRef.current[prevIndex];

    if (currentSectionElement && prevSectionElement) {
      const currentOverlay = currentSectionElement.querySelector('[data-overlay="current"]') as HTMLElement;
      const prevOverlay = prevSectionElement.querySelector('[data-overlay="current"]') as HTMLElement;

      // Make previous section visible and set it to be fully visible underneath
      gsap.set(prevSectionElement, { visibility: "visible", zIndex: 15 });
      gsap.set(prevOverlay, { clipPath: "inset(0% 0 0 0)" }); // Previous section fully visible

      // Current section starts fully visible and will be wiped upward
      gsap.set(currentSectionElement, { zIndex: 20 });
      gsap.set(currentOverlay, { clipPath: "inset(0% 0 0 0)" });

      // Animate curtain transition up - wipe current section upward to reveal previous
      gsap.to(currentOverlay, {
        clipPath: "inset(100% 0 0 0)", // Wipe upward
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          // Clean up after transition
          gsap.set(currentSectionElement, { visibility: "hidden", zIndex: currentSection + 1 });
          gsap.set(prevSectionElement, { zIndex: prevIndex + 1 });
          setCurrentSection(prevIndex);
          setIsScrolling(false);
        },
      });
    }
  };

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
      if (direction > 0) {
        setScrollDirection('down');
        animateToNext();
      } else {
        setScrollDirection('up');
        animateToPrevious();
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        setScrollDirection('down');
        animateToNext();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        setScrollDirection('up');
        animateToPrevious();
      }
    };

    // Prevent pull-to-refresh on mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const startY = touch.clientY;
        
        const handleTouchMove = (e: TouchEvent) => {
          if (e.touches.length === 1) {
            const touch = e.touches[0];
            const currentY = touch.clientY;
            const deltaY = currentY - startY;
            
            // Prevent pull-to-refresh when swiping down at the top
            if (deltaY > 0 && window.scrollY === 0) {
              e.preventDefault();
            }
          }
        };
        
        const handleTouchEnd = () => {
          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
        };
        
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
      }
    };

    // Prevent scroll events that could trigger refresh
    const handleScroll = (e: Event) => {
      if (window.scrollY === 0) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentSection, isScrolling, videoSections.length, isLoaded]);



  // React touch handlers for mobile swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    console.log('touch start');
    setIsScrolling(false); // Reset scrolling state on new touch
    setTouchStart(e.targetTouches[0].clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
    console.log('touch move', e.targetTouches[0].clientY);
  };
  const handleTouchEnd = () => {
    console.log('touch end', { touchStart, touchEnd, isScrolling });
    if (!touchStart || !touchEnd || isScrolling) return;
    const distance = touchStart - touchEnd;
    console.log('swipe distance', distance);
    const isUpSwipe = distance > 20; // Lowered for testing
    const isDownSwipe = distance < -20;
    if (isUpSwipe) {
      setScrollDirection('down');
      console.log('animateToNext: down');
      animateToNext();
    } else if (isDownSwipe) {
      setScrollDirection('up');
      console.log('animateToPrevious: up');
      animateToPrevious();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Handle navigation clicks
  const navigateToSection = (sectionIndex: number) => {
    if (!isScrolling && sectionIndex !== currentSection) {
      setScrollDirection(sectionIndex > currentSection ? 'down' : 'up');
      setIsScrolling(true);

      const currentSectionElement = sectionsRef.current[currentSection];
      const targetSectionElement = sectionsRef.current[sectionIndex];

      if (currentSectionElement && targetSectionElement) {
        const currentOverlay = currentSectionElement.querySelector('[data-overlay="current"]') as HTMLElement;
        const targetOverlay = targetSectionElement.querySelector('[data-overlay="current"]') as HTMLElement;

        // Make target section visible and set initial state
        gsap.set(targetSectionElement, { visibility: "visible", zIndex: 20 });
        
        // Determine animation direction
        const isGoingDown = sectionIndex > currentSection;
        const initialClipPath = isGoingDown ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)";
        const currentClipPath = isGoingDown ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)";
        
        gsap.set(targetOverlay, { clipPath: initialClipPath });

        // Animate curtain transition
        gsap.to(currentOverlay, {
          clipPath: currentClipPath,
          duration: 0.8,
          ease: "power2.inOut",
        });

        gsap.to(targetOverlay, {
          clipPath: "inset(0% 0 0 0)",
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            // Clean up after transition
            gsap.set(currentSectionElement, { visibility: "hidden", zIndex: currentSection + 1 });
            gsap.set(targetSectionElement, { zIndex: sectionIndex + 1 });
            setCurrentSection(sectionIndex);
            setIsScrolling(false);
          },
        });
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only respond to left mouse button or touch
    if ((e.pointerType === 'mouse' && e.button !== 0)) return;
    setPointerStartY(e.clientY);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointerStartY !== null) {
      setPointerEndY(e.clientY);
    }
  };
  const handlePointerUp = () => {
    if (pointerStartY === null || pointerEndY === null || isScrolling) return;
    const distance = pointerStartY - pointerEndY;
    const isUpSwipe = distance > 50;
    const isDownSwipe = distance < -50;
    if (isUpSwipe) {
      setScrollDirection('down');
      animateToNext();
    } else if (isDownSwipe) {
      setScrollDirection('up');
      animateToPrevious();
    }
    setPointerStartY(null);
    setPointerEndY(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Loader stays visible and fades out as curtain animates */}
      {showLoader && (
        <div
          className={`fixed inset-0 z-[2000] bg-black flex justify-center items-center transition-opacity duration-1000 ${
            loaderFadeOut ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ pointerEvents: loaderFadeOut ? 'none' : 'auto' }}
        >
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



            {/* Navigation - moved outside main content */}
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

      {/* Main Content Animation */}
      <div className="relative">
        {/* Curtain Reveal Animation */}
          <div
          className={`fixed inset-0 z-[1500] bg-black transition-transform duration-1000 ease-in-out pointer-events-none
            ${showCurtain ? 'translate-y-0' : '-translate-y-full'}`}
          style={{ willChange: 'transform' }}
        />
        {/* Main Content Animation */}
        {videoSections.map((section, index) => (
          <VideoSection
          ref={(el) => {
            sectionsRef.current[index] = el
          }}
            key={section.id}
            videoSrc={section.videoUrl}
            index={index + 1}
            title={section.title}
            subtitle={section.subtitle}
            category={section.category}
            description={section.description}
            details={section.details}
            isActive={index === currentSection}
            isTransitioning={isScrolling}
            totalSections={videoSections.length}
          />
        ))}
       {/* <div className="fixed bottom-8 left-8 text-white z-50" id="lowerDesc">
        <div className="text-sm font-light">
          <span className="mb-1 font-bold">Inspiring brands to be creative</span>
         
        </div>
      </div> */}
      {/* <div className="fixed bottom-8 right-8 text-white z-50">
        <div className="text-right text-xs">
          <div className="mb-1 font-bold">A Copenhagen based film production company where trust and integrity comes first.</div>
         
        </div>
      </div> */}
      </div>
    </div>
  );
}
