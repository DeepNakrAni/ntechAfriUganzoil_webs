import { useEffect, useRef } from 'react';

export default function TextSection({ label, heading, body }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.section-label, .section-heading, .section-body');
            elements.forEach((el, i) => {
              setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.style.transition = `opacity 1s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.15}s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.15}s`;
              }, 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="text-section" ref={sectionRef}>
      <div className="text-section-bg" />
      <div className="text-section-content">
        <div className="section-label">{label}</div>
        <h2 className="section-heading">{heading}</h2>
        <p className="section-body">{body}</p>
      </div>
    </section>
  );
}
