import { useEffect, useRef } from 'react';

const ICON_COLD = (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
    <path d="M10 2v16M10 2l-3 3M10 2l3 3M10 18l-3-3M10 18l3-3M2 10h16M2 10l3-3M2 10l3 3M18 10l-3-3M18 10l-3 3"/>
  </svg>
);

const ICON_STEEL = (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="14" height="14" rx="2"/>
    <path d="M3 10h14M10 3v14"/>
  </svg>
);

const ICON_FLOW = (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
    <path d="M6 4v5a4 4 0 004 4h0a4 4 0 004-4V4M4 16h12"/>
  </svg>
);

const ICON_LAB = (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v6L3 16a1 1 0 001 1h12a1 1 0 001-1l-5-8V2M6 2h8"/>
  </svg>
);

const ICON_CPU = (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
    <rect x="5" y="5" width="10" height="10" rx="1.5"/>
    <path d="M8 2v3M12 2v3M8 15v3M12 15v3M2 8h3M2 12h3M15 8h3M15 12h3"/>
  </svg>
);

const ICON_LEAF = (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
    <path d="M4 16c0-6 4-12 12-12-2 8-6 12-12 12zM4 16l4-4"/>
  </svg>
);

const FEATURES = [
  { icon: ICON_COLD, title: 'Cold-Press Extraction', desc: 'Sub-ambient processing preserves all natural nutrients, antioxidants, and flavor compounds.' },
  { icon: ICON_STEEL, title: 'Medical-Grade Steel',  desc: '316L stainless steel construction — zero contamination, pharmaceutical-grade purity.' },
  { icon: ICON_FLOW, title: 'Continuous Flow',       desc: 'From whole avocado to pure oil in one uninterrupted process. No oxidation risk.' },
  { icon: ICON_LAB, title: 'Smart Centrifugation',   desc: '99.7% separation efficiency via precision decanter centrifuge technology.' },
  { icon: ICON_CPU, title: 'Automated Control',      desc: 'PLC-driven monitoring of temperature, pressure, and flow in real time.' },
  { icon: ICON_LEAF, title: 'Zero Waste',            desc: 'Every byproduct — pulp, seed, skin — is captured and processed. Nothing wasted.' },
];

export default function Features() {
  const gridRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.feature-card');
            cards.forEach((card, i) => {
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`;
              }, i * 80);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="features-section" id="features">
      <div className="features-header">
        <p className="features-label">Technology</p>
        <h2 className="features-title">Engineered <em>Without</em> Compromise</h2>
      </div>

      <div className="features-grid" ref={gridRef}>
        {FEATURES.map((f, i) => (
          <div className="feature-card" key={i}>
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
