import React, { useEffect, useState, useRef } from 'react';

interface CinematicLoaderProps {
  children: React.ReactNode;
  headline?: string;
  subheadline?: string;
  duration?: number; // curtain duration in ms
}

const DEFAULT_HEADLINE = 'CONTENT CREATORS FOR THE NEW ERA';
const DEFAULT_SUBHEADLINE = 'Film, TV & Commercial';
const DEFAULT_DURATION = 1000;

const CinematicLoader: React.FC<CinematicLoaderProps> = ({
  children,
  headline = DEFAULT_HEADLINE,
  subheadline = DEFAULT_SUBHEADLINE,
  duration = DEFAULT_DURATION
}) => {
  const [lineProgress, setLineProgress] = useState(0);
  const [showHeadline, setShowHeadline] = useState(false);
  const [showSubheadline, setShowSubheadline] = useState(false);
  const [showPercentage, setShowPercentage] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const [showCurtain, setShowCurtain] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [loaderFadeOut, setLoaderFadeOut] = useState(false);

  // Loader + curtain sequence
  useEffect(() => {
    setLineProgress(0);
    setShowHeadline(false);
    setShowSubheadline(false);
    setShowPercentage(false);
    setShowMainContent(false);
    setShowCurtain(false);
    setShowLoader(true);
    setLoaderFadeOut(false);
    // Animate line
    const lineDuration = 500;
    const startTime = Date.now();
    const animateLine = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / lineDuration, 1);
      setLineProgress(progress);
      if (progress < 1) {
        requestAnimationFrame(animateLine);
      } else {
        setTimeout(() => setShowHeadline(true), 100);
        setTimeout(() => setShowSubheadline(true), 350);
        setTimeout(() => setShowPercentage(true), 600);
        setTimeout(() => {
          setShowCurtain(true);
          setTimeout(() => {
            setShowMainContent(true);
          }, 100);
          setTimeout(() => {
            setLoaderFadeOut(true);
          }, duration - 100);
          setTimeout(() => {
            setShowLoader(false);
            setShowCurtain(false);
          }, duration + 100);
        }, 1400);
      }
    };
    requestAnimationFrame(animateLine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Loader stays visible and fades out as curtain animates */}
      {showLoader && (
        <div
          id="loader"
          className={`fixed inset-0 z-[2000] bg-black/0 flex justify-center items-center transition-opacity duration-1000 ${
            loaderFadeOut ? 'opacity-0' : 'opacity-100'
          }`}>
          <div className="w-full px-2 md:px-8">
            <div className="grid grid-cols-1 lg:[grid-template-columns:auto_1fr_auto] items-end w-full gap-x-12">
              {/* Left: Headline */}
              <div
                className={`py-5 text-white font-bold uppercase overflow-hidden text-ellipsis min-w-0 max-w-[60vw] text-left justify-self-start transition-all duration-700 ${
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
                {headline}
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
                  {subheadline}
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
      {/* Curtain Reveal Animation */}
      <div
        className={`fixed inset-0 z-[1500] bg-black transition-transform duration-1000 ease-in-out pointer-events-none ${
          showCurtain ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ willChange: 'transform' }}
      />
      {/* Main Content Animation */}
      <div
        id="main-content"
        className={`transition-opacity duration-1000 ease-out ${
          showMainContent ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
        {children}
      </div>
    </div>
  );
};

export default CinematicLoader;
