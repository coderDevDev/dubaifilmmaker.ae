'use client';

import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showPlayTooltip, setShowPlayTooltip] = useState(true);
  const [overNav, setOverNav] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Hide custom cursor if hovering navigation
      const nav = document.querySelector('.navigation');
      if (
        nav &&
        nav.contains(document.elementFromPoint(e.clientX, e.clientY))
      ) {
        setOverNav(true);
      } else {
        setOverNav(false);
      }
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);
    const handleMouseOut = () => setIsVisible(false);

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseout', handleMouseOut);

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"]'
    );
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Add hover for video sections
    const videoSections = document.querySelectorAll('.video-section');
    const handleVideoEnter = () => {
      setIsHovering(true);
      setShowPlayTooltip(true);
    };
    const handleVideoLeave = () => {
      setIsHovering(false);
      setShowPlayTooltip(false);
    };
    videoSections.forEach(el => {
      el.addEventListener('mouseenter', handleVideoEnter);
      el.addEventListener('mouseleave', handleVideoLeave);
    });

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseout', handleMouseOut);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      videoSections.forEach(el => {
        el.removeEventListener('mouseenter', handleVideoEnter);
        el.removeEventListener('mouseleave', handleVideoLeave);
      });
    };
  }, []);

  // Set browser cursor to default when overNav, otherwise reset
  useEffect(() => {
    if (overNav) {
      document.body.style.cursor = 'default';
    } else {
      document.body.style.cursor = '';
    }
    return () => {
      document.body.style.cursor = '';
    };
  }, [overNav]);

  if (!isVisible || overNav) return null;

  return (
    <>
      {/* Main cursor as hand icon */}
      <svg
        className={`fixed top-0 left-0 pointer-events-none z-50 transition-transform duration-100${
          isHovering ? 'pointer' : ''
        }`}
        style={{
          width: isHovering ? 32 : 24,
          height: isHovering ? 32 : 24,
          transform: `translate(${position.x - (isHovering ? 16 : 12)}px, ${
            position.y - (isHovering ? 16 : 12)
          }px)`,
          mixBlendMode: 'difference'
        }}
        viewBox="0 0 24 24"
        fill="white"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round">
        <polygon points="6,4 20,12 6,20" />
      </svg>

      {/* Trailing cursor */}
      <div
        className={`fixed top-0 left-0 w-8 h-8 border border-white/30 rounded-full pointer-events-none z-40 transition-all duration-300 ${
          isHovering ? 'scale-200 opacity-50 pointer' : 'scale-100 opacity-100'
        }`}
        style={{
          transform: `translate(${position.x - 16}px, ${position.y - 16}px)`
        }}
      />

      {/* Tooltip for Play on video hover */}
      {showPlayTooltip && (
        <div
          className="fixed z-[100] px-3 py-1 rounded bg-black text-white text-xs pointer-events-none shadow-lg"
          style={{
            top: position.y + 24,
            left: position.x,
            transform: 'translateX(-50%)'
          }}>
          PLAY
        </div>
      )}
    </>
  );
}
