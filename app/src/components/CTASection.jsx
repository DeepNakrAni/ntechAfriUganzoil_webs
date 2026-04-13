import { useEffect, useRef } from 'react';

export default function CTASection() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="cta" id="contact" ref={ref}>
      <h2 className="cta-title">
        Ready to Extract<br /><em>Liquid Gold?</em>
      </h2>
      <p className="cta-body">
        Join the next generation of premium avocado oil producers. 
        From fruit to pure golden oil — perfected.
      </p>
      <a href="mailto:info@voil.com" className="cta-btn">
        <span>Get in Touch</span>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3.5 8h9M8.5 4l4 4-4 4"/>
        </svg>
      </a>
    </section>
  );
}
