import { useEffect, useRef, useState, useCallback } from 'react';

export default function ScrollAssembly({ totalFrames, images }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRef = useRef(null);
  const glowRef = useRef(null);
  const currentFrameRef = useRef(-1);
  const rafRef = useRef(null);
  const [progressVisible, setProgressVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [overlayStage, setOverlayStage] = useState(0); // 0=exploded, 1=mid, 2=assembled

  // Draw a frame on the canvas
  const drawFrame = useCallback((frameIndex) => {
    if (frameIndex === currentFrameRef.current) return;
    if (frameIndex < 0 || frameIndex >= totalFrames) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = images[frameIndex];
    
    if (!canvas || !ctx || !img) return;
    
    currentFrameRef.current = frameIndex;
    
    // Clear and draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate aspect-ratio-preserving dimensions
    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    
    let drawW, drawH, drawX, drawY;
    
    if (imgAspect > canvasAspect) {
      drawW = canvas.width;
      drawH = canvas.width / imgAspect;
      drawX = 0;
      drawY = (canvas.height - drawH) / 2;
    } else {
      drawH = canvas.height;
      drawW = canvas.height * imgAspect;
      drawX = (canvas.width - drawW) / 2;
      drawY = 0;
    }
    
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, [images, totalFrames]);

  // Resize canvas to fill viewport
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    
    // Redraw current frame after resize
    if (currentFrameRef.current >= 0) {
      const idx = currentFrameRef.current;
      currentFrameRef.current = -1; // Force redraw
      drawFrame(idx);
    }
  }, [drawFrame]);

  // Scroll handler
  const handleScroll = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    
    // Calculate raw progress
    let rawProgress = scrolled / sectionHeight;
    rawProgress = Math.max(0, Math.min(1, rawProgress));
    
    // Apply easing for smoother feel
    // Using a smoothstep function
    const eased = rawProgress * rawProgress * (3 - 2 * rawProgress);
    
    // The frames go from assembled (1) to exploded (240)
    // We want scroll to go from exploded to assembled
    // So we reverse: frame = totalFrames - 1 - (progress * (totalFrames - 1))
    const frameIndex = Math.round((1 - eased) * (totalFrames - 1));
    
    // Show/hide progress indicator
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    setProgressVisible(inView && rawProgress > 0 && rawProgress < 1);
    setScrollProgress(rawProgress);
    
    // Determine overlay stage
    if (rawProgress < 0.3) setOverlayStage(0);
    else if (rawProgress < 0.7) setOverlayStage(1);
    else setOverlayStage(2);
    
    // Show glow when assembly completes
    if (glowRef.current) {
      if (rawProgress > 0.95) {
        glowRef.current.classList.add('active');
      } else {
        glowRef.current.classList.remove('active');
      }
    }
    
    drawFrame(frameIndex);
  }, [totalFrames, drawFrame]);

  // Smooth scroll with RAF
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(handleScroll);
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resizeCanvas);
    
    // Initial setup
    resizeCanvas();
    // Draw the first frame (exploded view = last frame = 239)
    setTimeout(() => {
      drawFrame(totalFrames - 1);
      handleScroll();
    }, 100);
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resizeCanvas);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll, resizeCanvas, drawFrame, totalFrames]);

  return (
    <>
      {/* Progress indicator */}
      <div className={`assembly-progress ${progressVisible ? 'visible' : ''}`}>
        <div className="assembly-progress-track">
          <div 
            className="assembly-progress-fill"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
        <span className="assembly-progress-label">Assembly</span>
      </div>

      <section 
        ref={sectionRef} 
        className="scroll-canvas-section" 
        id="assembly"
        style={{ height: '500vh' }}
      >
        <div className="scroll-canvas-sticky">
          <canvas 
            ref={canvasRef} 
            className="scroll-canvas"
          />
          
          {/* Assembly completion glow */}
          <div ref={glowRef} className="assembly-complete-glow" />

          {/* Contextual text overlays that appear at different scroll stages */}
          <div 
            className="scroll-text-overlay scroll-text-left"
            style={{ 
              opacity: overlayStage === 0 ? 1 : 0, 
              transition: 'opacity 0.8s ease',
              transform: `translateY(${overlayStage === 0 ? '-50%' : '-40%'})` 
            }}
          >
            <div className="scroll-overlay-label">Exploded View</div>
            <div className="scroll-overlay-heading">Every Component<br />Revealed</div>
            <div className="scroll-overlay-body">
              Five precision modules working in<br />
              perfect harmony. Scroll to assemble.
            </div>
          </div>

          <div 
            className="scroll-text-overlay scroll-text-right"
            style={{ 
              opacity: overlayStage === 1 ? 1 : 0, 
              transition: 'opacity 0.8s ease',
              transform: `translateY(${overlayStage === 1 ? '-50%' : '-40%'})` 
            }}
          >
            <div className="scroll-overlay-label">Assembling</div>
            <div className="scroll-overlay-heading">Precision<br />Integration</div>
            <div className="scroll-overlay-body">
              Each module locks into place with<br />
              sub-millimeter accuracy.
            </div>
          </div>

          <div 
            className="scroll-text-overlay scroll-text-left"
            style={{ 
              opacity: overlayStage === 2 ? 1 : 0, 
              transition: 'opacity 0.8s ease',
              transform: `translateY(${overlayStage === 2 ? '-50%' : '-40%'})` 
            }}
          >
            <div className="scroll-overlay-label">Complete</div>
            <div className="scroll-overlay-heading">Ready to<br /><em style={{ color: 'var(--avocado-light)', fontStyle: 'italic' }}>Extract</em></div>
            <div className="scroll-overlay-body">
              The complete extraction system.<br />
              From fruit to liquid gold.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
