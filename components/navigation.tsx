'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { cn } from '@/lib/utils';
import { gsap } from "gsap";

const HamburgerIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect y="6" width="28" height="2.5" rx="1.25" fill="white" />
    <rect y="13" width="28" height="2.5" rx="1.25" fill="white" />
    <rect y="20" width="28" height="2.5" rx="1.25" fill="white" />
  </svg>
);

interface NavigationProps {
  currentSection: number;
  totalSections: number;
  onNavigate: (sectionIndex: number) => void;
}

export function LettersRevealUp({
  text,
  className = ''
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className="text-wrapper">
      <div className="text-container">
        <span className={cn('hover-text', className)}>{text}</span>
        <span className={cn('hover-text', className)}>{text}</span>
      </div>
    </div>
  );
}

export function Navigation({
  currentSection,
  totalSections,
  onNavigate
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isOverlayTransitioning, setIsOverlayTransitioning] = useState(false);
  const curtainRef = useRef(null);

  useEffect(() => {
    // Show background after first section
    setIsScrolled(currentSection > 0);
  }, [currentSection]);

  const navItems = ['Work', 'About', 'Contact'];

  const letterVariants = {
    initial: { y: 0, opacity: 0.8, scale: 1 },
    hover: (i: number) => ({
      y: -8,
      opacity: 1,
      scale: 1.1,
      transition: {
        delay: i * 0.03,
        duration: 0.2,
        ease: 'easeOut'
      }
    }),
    exit: (i: number) => ({
      y: 0,
      opacity: 0.8,
      scale: 1,
      transition: {
        delay: i * 0.01,
        duration: 0.15,
        ease: 'easeInOut'
      }
    })
  };

  const openOverlay = () => {
    setIsOverlayVisible(true);
    setIsOverlayTransitioning(true);
  };

  const closeOverlay = () => {
    setIsOverlayTransitioning(true);
    // Animate curtain down to cover video, then hide overlay
    gsap.to(curtainRef.current, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete: () => {
        setIsOverlayVisible(false);
        setIsOverlayTransitioning(false);
        gsap.set(curtainRef.current, { clipPath: 'inset(100% 0% 0% 0%)' }); // reset for next open
      }
    });
  };

  // Curtain reveal on open
  useEffect(() => {
    if (isOverlayTransitioning && isOverlayVisible) {
      gsap.fromTo(
        curtainRef.current,
        { clipPath: 'inset(0% 0% 0% 0%)' },
        {
          clipPath: 'inset(100% 0% 0% 0%)',
          duration: 0.7,
          ease: 'power2.inOut',
          onComplete: () => setIsOverlayTransitioning(false)
        }
      );
    }
  }, [isOverlayTransitioning, isOverlayVisible]);

  return (
    <nav className="navigation fixed top-0 left-0 right-0 z-[1000] transition-all duration-1000 bg-transparent">
      <div className="mx-auto px-6 py-6 relative ">
        <div className="flex items-center justify-between relative">
          {/* Logo (left) */}
          <div
            className="text-white font-bold text-xl tracking-wider cursor-pointer hover:opacity-70 transition-all duration-300"
            onClick={() => onNavigate(0)}>
            <svg
              preserveAspectRatio="xMidYMid meet"
              data-bbox="0 1 118.076 67.392"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 119 70"
              height="70"
              width="119"
              data-type="ugc"
              role="presentation"
              aria-hidden="true"
              aria-label="">
              <g>
                <g clipPath="url(#55eb1042-e59e-461a-b021-5e641edd1e33_comp-mbcftg1n_r_comp-m9x6l3t8)">
                  <path
                    strokeWidth="1.6"
                    stroke="#ffffff"
                    d="m48.204 68.368 59.802.024s10.07 0 10.07-10.212V11.22s0-10.22-10.07-10.22H0"
                    fill="none"></path>
                  <path
                    strokeWidth=".2"
                    stroke="#ffffff"
                    fill="#ffffff"
                    d="M42.366 59.534V45.868h-1.438l-4.275 9.69-4.387-9.69h-1.438v13.666h1.438V49.148l3.748 8.236h1.231l3.689-8.236v10.386h1.438zm13.28 0-4.938-13.666h-1.207l-4.956 13.666h1.533l1.078-3.087h5.885l1.077 3.087h1.534zm-3.031-4.355h-5.033l2.534-7.214zM67.9 59.534l-4.843-8.385 4.24-5.28h-1.76l-6.28 7.85v-7.85h-1.44v13.665h1.44v-3.82l2.835-3.454 4.103 7.274zm10.574 0v-1.303h-6.921v-4.932h5.903v-1.304h-5.903v-4.817h6.92v-1.304h-8.359V59.54h8.36zm12.409 0-3.197-6.2c1.74-.366 2.93-1.669 2.93-3.663 0-2.36-1.645-3.803-3.99-3.803h-5.162v13.666h1.438v-6.067h3.233l3.067 6.067zm-1.705-9.845c0 1.67-1.113 2.493-2.688 2.493h-3.594v-5.01h3.594c1.569 0 2.688.847 2.688 2.517Z"></path>
                  <path
                    strokeWidth=".2"
                    stroke="#ffffff"
                    fill="#ffffff"
                    d="M29.786 29.794v-1.303h-8.36v13.665h1.439v-6.025h5.902v-1.303h-5.902V29.8h6.92zm4.05 12.356V28.485h-1.44V42.15zm12.219 0v-1.303h-6.886V28.49h-1.438v13.665h8.324zm13.108 0V28.485h-1.44l-4.274 9.689-4.387-9.69h-1.438V42.15h1.438V31.764L52.81 40h1.231l3.689-8.236V42.15h1.438z"></path>
                  <path
                    strokeWidth=".2"
                    stroke="#ffffff"
                    fill="#ffffff"
                    d="M17.21 17.78c0-1.898.078-3.988-1.326-5.412-.81-.823-2.007-1.267-3.404-1.267H7.862v13.665h4.618c1.397 0 2.593-.444 3.404-1.267 1.398-1.418 1.327-3.82 1.327-5.719Zm-1.438 0c0 1.67.035 3.707-.888 4.686-.699.726-1.604.997-2.646.997H9.307V12.41h2.93c1.043 0 1.948.27 2.647.997.93.98.888 2.71.888 4.373Zm14.031 2.481v-9.154h-1.438v9.04c0 2.072-1.303 3.436-3.274 3.436s-3.25-1.364-3.25-3.436v-9.04H20.4v9.154c0 2.727 1.966 4.625 4.69 4.625 2.723 0 4.712-1.898 4.712-4.625Zm12.96.727c0-1.634-.906-2.763-2.196-3.244 1.136-.42 1.983-1.555 1.983-2.991 0-2.283-1.628-3.646-3.973-3.646H33.51v13.665h5.239c2.386 0 4.008-1.303 4.008-3.778zm-1.646-6.217c0 1.634-1.154 2.379-2.646 2.379h-3.517v-4.74h3.517c1.492 0 2.646.727 2.646 2.36Zm.207 6.18c0 1.539-1.042 2.512-2.705 2.512h-3.67v-5.01h3.67c1.663 0 2.705.961 2.705 2.493zm14.21 3.815-4.938-13.665h-1.214l-4.955 13.665h1.533l1.078-3.087h5.884L54 24.766zm-3.032-4.355H47.47l2.534-7.214zm6.643 4.355V11.101h-1.439v13.665z"></path>
                </g>
                <defs fill="none">
                  <clipPath id="55eb1042-e59e-461a-b021-5e641edd1e33_comp-mbcftg1n_r_comp-m9x6l3t8">
                    <path fill="#ffffff" d="M119 0v70H0V0z"></path>
                  </clipPath>
                </defs>
              </g>
            </svg>
          </div>

          {/* Desktop Navigation (center) */}
          <div className="cursor-pointer gap-40 hidden md:flex items-center space-x-12 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {navItems.map((item, index) => (
              <span  key={index} className="text-white font-bold text-sm ">{item}</span>
            ))}
          </div>

          {/* Hamburger Menu (right, always visible) */}
          <button
            onClick={() => {
              if (!isOverlayVisible) openOverlay();
              else closeOverlay();
            }}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors ml-4"
            style={{ zIndex: 1100 }}
          >
            {isOverlayVisible ? <X size={24} /> : <HamburgerIcon />}
          </button>
        </div>

        {/* Full-screen Overlay Menu */}
        {isOverlayVisible && (
          <div className="fixed inset-0 z-[2001] bg-black text-white flex flex-row">
            {/* Overlay Logo (top-left, absolute, above curtain) */}
            <div className="absolute top-8 left-8 z-50">
              <svg
                preserveAspectRatio="xMidYMid meet"
                data-bbox="0 1 118.076 67.392"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 119 70"
                height="70"
                width="119"
                data-type="ugc"
                role="presentation"
                aria-hidden="true"
                aria-label=""
              >
                <g>
                  <g clipPath="url(#55eb1042-e59e-461a-b021-5e641edd1e33_comp-mbcftg1n_r_comp-m9x6l3t8)">
                    <path
                      strokeWidth="1.6"
                      stroke="#ffffff"
                      d="m48.204 68.368 59.802.024s10.07 0 10.07-10.212V11.22s0-10.22-10.07-10.22H0"
                      fill="none"
                    ></path>
                    <path
                      strokeWidth=".2"
                      stroke="#ffffff"
                      fill="#ffffff"
                      d="M42.366 59.534V45.868h-1.438l-4.275 9.69-4.387-9.69h-1.438v13.666h1.438V49.148l3.748 8.236h1.231l3.689-8.236v10.386h1.438zm13.28 0-4.938-13.666h-1.207l-4.956 13.666h1.533l1.078-3.087h5.885l1.077 3.087h1.534zm-3.031-4.355h-5.033l2.534-7.214zM67.9 59.534l-4.843-8.385 4.24-5.28h-1.76l-6.28 7.85v-7.85h-1.44v13.665h1.44v-3.82l2.835-3.454 4.103 7.274zm10.574 0v-1.303h-6.921v-4.932h5.903v-1.304h-5.903v-4.817h6.92v-1.304h-8.359V59.54h8.36zm12.409 0-3.197-6.2c1.74-.366 2.93-1.669 2.93-3.663 0-2.36-1.645-3.803-3.99-3.803h-5.162v13.666h1.438v-6.067h3.233l3.067 6.067zm-1.705-9.845c0 1.67-1.113 2.493-2.688 2.493h-3.594v-5.01h3.594c1.569 0 2.688.847 2.688 2.517Z"
                    ></path>
                    <path
                      strokeWidth=".2"
                      stroke="#ffffff"
                      fill="#ffffff"
                      d="M29.786 29.794v-1.303h-8.36v13.665h1.439v-6.025h5.902v-1.303h-5.902V29.8h6.92zm4.05 12.356V28.485h-1.44V42.15zm12.219 0v-1.303h-6.886V28.49h-1.438v13.665h8.324zm13.108 0V28.485h-1.44l-4.274 9.689-4.387-9.69h-1.438V42.15h1.438V31.764L52.81 40h1.231l3.689-8.236V42.15h1.438z"
                    ></path>
                    <path
                      strokeWidth=".2"
                      stroke="#ffffff"
                      fill="#ffffff"
                      d="M17.21 17.78c0-1.898.078-3.988-1.326-5.412-.81-.823-2.007-1.267-3.404-1.267H7.862v13.665h4.618c1.397 0 2.593-.444 3.404-1.267 1.398-1.418 1.327-3.82 1.327-5.719Zm-1.438 0c0 1.67.035 3.707-.888 4.686-.699.726-1.604.997-2.646.997H9.307V12.41h2.93c1.043 0 1.948.27 2.647.997.93.98.888 2.71.888 4.373Zm14.031 2.481v-9.154h-1.438v9.04c0 2.072-1.303 3.436-3.274 3.436s-3.25-1.364-3.25-3.436v-9.04H20.4v9.154c0 2.727 1.966 4.625 4.69 4.625 2.723 0 4.712-1.898 4.712-4.625Zm12.96.727c0-1.634-.906-2.763-2.196-3.244 1.136-.42 1.983-1.555 1.983-2.991 0-2.283-1.628-3.646-3.973-3.646H33.51v13.665h5.239c2.386 0 4.008-1.303 4.008-3.778zm-1.646-6.217c0 1.634-1.154 2.379-2.646 2.379h-3.517v-4.74h3.517c1.492 0 2.646.727 2.646 2.36Zm.207 6.18c0 1.539-1.042 2.512-2.705 2.512h-3.67v-5.01h3.67c1.663 0 2.705.961 2.705 2.493zm14.21 3.815-4.938-13.665h-1.214l-4.955 13.665h1.533l1.078-3.087h5.884L54 24.766zm-3.032-4.355H47.47l2.534-7.214zm6.643 4.355V11.101h-1.439v13.665z"
                    ></path>
                  </g>
                  <defs fill="none">
                    <clipPath id="55eb1042-e59e-461a-b021-5e641edd1e33_comp-mbcftg1n_r_comp-m9x6l3t8">
                      <path fill="#ffffff" d="M119 0v70H0V0z"></path>
                    </clipPath>
                  </defs>
                </g>
              </svg>
            </div>
            {/* Left column */}

            <div className="flex flex-col justify-between w-full md:w-1/2 p-8 md:p-12 pt-48">
              <div>
               
                <div className="space-y-4 mb-12">
                  <div className="text-7xl font-extrabold">WORK</div>
                  <div className="text-7xl font-extrabold">SERVICES</div>
                  <div className="text-7xl font-extrabold">ABOUT</div>
                  <div className="text-7xl font-extrabold">CONTACT</div>
                </div>
                <div className="mt-8 mb-8 border-t border-white/20" />
                <div className="space-y-2 mb-8">
                  <div className="font-bold">All Work</div>
                  <div className="font-bold">Film</div>
                  <div className="font-bold">Animation</div>
                  <div className="font-bold">Music Video</div>
                </div>
              </div>
              <div>
                <div className="mb-2">Dubai, United Arab Emirates<br /></div>
                <div className="mb-2">E: hello@dubaifilmmaker.ae</div>
                <div>P: +971 50 969 96839</div>
              </div>
            </div>
            {/* Right column (video) */}
            <div className="hidden md:flex items-center justify-center w-1/2 p-8 relative overflow-hidden">
              <video
                src="https://video.wixstatic.com/video/8c2c22_5b3e10b6dc95423fb7773b5c77649ad6/480p/mp4/file.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="rounded-xl w-full h-full object-cover"
                style={{ background: '#000' }}
              />
              {/* Curtain overlay for transition */}
             
            </div>
            {/* Close button */}
            <button
              onClick={closeOverlay}
              className="absolute top-8 right-8 text-white text-3xl z-[2002]"
              aria-label="Close menu"
            >
              <X size={32} />
            </button>
            <div
                ref={curtainRef}
                className="absolute inset-0 bg-black rounded-xl pointer-events-none"
                style={{ clipPath: 'inset(0% 0% 0% 0%)', zIndex: 10 }}
              />
          </div>
        )}
      </div>
    </nav>
  );
}
