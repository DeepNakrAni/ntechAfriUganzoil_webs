import { useEffect, useRef } from 'react';

export default function SplitSection({ imgSrc, imgAlt, label, heading, body, reverse }) {
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
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`split ${reverse ? 'reverse' : ''}`} ref={ref}>
      <div className="split-media">
        <img src={imgSrc} alt={imgAlt} loading="lazy" />
      </div>
      <div className="split-content">
        <p className="split-label">{label}</p>
        <h2 className="split-heading">{heading}</h2>
        <p className="split-body">{body}</p>
      </div>
    </section>
  );
}
