import { useEffect, useRef } from 'react';

export default function Showcase({ imageSrc, label }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target.querySelector('.showcase-image');
            if (img) {
              img.style.opacity = '1';
              img.style.transform = 'scale(1)';
              img.style.transition = 'opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1), transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="showcase-section">
      <div className="showcase-image-wrapper" ref={wrapperRef}>
        <div className="showcase-glow" />
        <img 
          src={imageSrc}
          alt={label || 'VOIL Extraction System'}
          className="showcase-image"
          loading="lazy"
        />
      </div>
    </section>
  );
}
