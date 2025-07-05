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
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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
      id: "showcase",
      videoUrl: "https://video.wixstatic.com/video/8c2c22_be8c6399dae342ad85c57a9ae6401857/1080p/mp4/file.mp4",
      title: "THE ABU DHABI PLAN - FAISAL",
      subtitle: "Abu Dhabi Executive Council",
      category: "Film",
      description: "Strategic Vision 2030",
      details: "Building a sustainable economy and ensuring long-term prosperity.",
    },
  ]

  

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
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection, isScrolling, videoSections.length, isLoaded]);

  // Section transition function must be defined before handlers that use it
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

  // React touch handlers for mobile swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || isScrolling) return;
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > 50; // Minimum swipe distance
    const isDownSwipe = distance < -50;
    if (isUpSwipe && currentSection < videoSections.length - 1) {
      setScrollDirection('down');
      triggerTransition(currentSection + 1);
    } else if (isDownSwipe && currentSection > 0) {
      setScrollDirection('up');
      triggerTransition(currentSection - 1);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

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


  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  
  const getNextIndex = (currentIndex: number) => {
    return currentIndex >= videoSections.length - 1 ? 0 : currentIndex + 1
  }

  const getPreviousIndex = (currentIndex: number) => {
    return currentIndex <= 0 ? videoSections.length - 1 : currentIndex - 1
  }

  const animateToNext = () => {
    if (isTransitioning) return

    const nextIndex = getNextIndex(currentSectionIndex)
    setIsTransitioning(true)

    const currentSection = sectionsRef.current[currentSectionIndex]
    const nextSection = sectionsRef.current[nextIndex]

    if (currentSection && nextSection) {
      const currentOverlay = currentSection.querySelector('[data-overlay="current"]')
      const nextOverlay = nextSection.querySelector('[data-overlay="current"]')

      // Make next section visible and set initial state
      gsap.set(nextSection, { visibility: "visible", zIndex: 20 })
      gsap.set(nextOverlay, { clipPath: "inset(100% 0 0 0)" })

      // Animate curtain transition down
      gsap.to(currentOverlay, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.8,
        ease: "power2.inOut",
      })

      gsap.to(nextOverlay, {
        clipPath: "inset(0% 0 0 0)",
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          // Clean up after transition
          gsap.set(currentSection, { visibility: "hidden", zIndex: currentSectionIndex + 1 })
          gsap.set(nextSection, { zIndex: nextIndex + 1 })
          setCurrentSectionIndex(nextIndex)
          setIsTransitioning(false)
        },
      })
    }
  }

  const animateToPrevious = () => {
    if (isTransitioning) return

    const prevIndex = getPreviousIndex(currentSectionIndex)
    setIsTransitioning(true)

    const currentSection = sectionsRef.current[currentSectionIndex]
    const prevSection = sectionsRef.current[prevIndex]

    if (currentSection && prevSection) {
      const currentOverlay = currentSection.querySelector('[data-overlay="current"]')
      const prevOverlay = prevSection.querySelector('[data-overlay="current"]')

      // Make previous section visible and set it to be fully visible underneath
      gsap.set(prevSection, { visibility: "visible", zIndex: 15 })
      gsap.set(prevOverlay, { clipPath: "inset(0% 0 0 0)" }) // Previous section fully visible

      // Current section starts fully visible and will be wiped upward
      gsap.set(currentSection, { zIndex: 20 })
      gsap.set(currentOverlay, { clipPath: "inset(0% 0 0 0)" })

      // Animate curtain transition up - wipe current section upward to reveal previous
      gsap.to(currentOverlay, {
        clipPath: "inset(100% 0 0 0)", // Wipe upward
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          // Clean up after transition
          gsap.set(currentSection, { visibility: "hidden", zIndex: currentSectionIndex + 1 })
          gsap.set(prevSection, { zIndex: prevIndex + 1 })
          setCurrentSectionIndex(prevIndex)
          setIsTransitioning(false)
        },
      })
    }
  }

  // Global navigation handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        animateToNext()
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        animateToPrevious()
      }
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      if (e.deltaY > 0) {
        // Scroll down - go to next section (or loop to first)
        animateToNext()
      } else if (e.deltaY < 0) {
        // Scroll up - go to previous section (or loop to last)
        animateToPrevious()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("wheel", handleWheel)
    }
  }, [currentSectionIndex, isTransitioning])


  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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
        <div
          className={`fixed inset-0 z-[1500] bg-black transition-transform duration-1000 ease-in-out pointer-events-none
            ${showCurtain ? 'translate-y-0' : '-translate-y-full'}`}
          style={{ willChange: 'transform' }}
        />
        {/* Main Content Animation */}
        {videoSections.map((section, index) => (
        <VideoSection
          key={section.id}
          ref={(el) => {
            sectionsRef.current[index] = el
          }}
          videoSrc={section.videoUrl}
          index={index + 1}
          title={section.title}
          subtitle={section.subtitle}
          category={section.category}
          description={section.description}
          details={section.details}
          isActive={index === currentSectionIndex}
          isTransitioning={isTransitioning}
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
