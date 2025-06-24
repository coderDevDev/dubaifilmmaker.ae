'use client';

import { useEffect, useState, useRef } from 'react';
import { Navigation } from '@/components/navigation';
import { CustomCursor } from '@/components/custom-cursor';
import { VideoSection } from '@/components/video-section';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  const containerRef = useRef<HTMLDivElement>(null);

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
    }
  ];

  useEffect(() => {
    setIsLoaded(true);

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
      const duration = 1000; // Faster for more immediate effect
      const startTime = Date.now();

      const animateTransition = () => {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / duration, 1);

        // More immediate easing - less smooth, more curtain-like
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

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection, isScrolling, videoSections.length]);

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

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      <nav
        className={`navigation fixed top-0 left-0 right-0 z-[1000] transition-all duration-1000 bg-transparent`}>
        <Navigation
          currentSection={currentSection}
          totalSections={videoSections.length}
          onNavigate={navigateToSection}
        />
      </nav>

      <main className="relative w-full h-full">
        <CustomCursor />
        {videoSections.map((section, index) => (
          <VideoSection
            key={section.id}
            {...section}
            sectionIndex={index}
            currentSection={currentSection}
            transitionProgress={transitionProgress}
            isActive={index === currentSection}
            isLoaded={isLoaded}
            totalSections={videoSections.length}
          />
        ))}
      </main>

      {/* Section Indicators */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 space-y-4">
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
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 text-white/60 text-sm font-light">
        {String(currentSection + 1).padStart(2, '0')} /{' '}
        {String(videoSections.length).padStart(2, '0')}
      </div>

      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
        <div
          className="h-full bg-white transition-all duration-300 ease-out"
          style={{
            width: `${((currentSection + 1) / videoSections.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
}
