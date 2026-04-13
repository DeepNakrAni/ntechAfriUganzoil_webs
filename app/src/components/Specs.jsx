import { useEffect, useRef } from 'react';

const SPECS = [
  { value: '500',  unit: 'kg/hr',  name: 'Processing Capacity' },
  { value: '99.7', unit: '%',      name: 'Extraction Efficiency' },
  { value: '<27',  unit: '°C',     name: 'Cold Press Temp' },
  { value: '316L', unit: 'Grade',  name: 'Stainless Steel' },
];

export default function Specs() {
  const gridRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.spec-card');
            cards.forEach((card, i) => {
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.style.transition = `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)`;
              }, i * 120);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="specs-section" id="specs">
      <div className="specs-header">
        <p className="specs-label">Specifications</p>
        <h2 className="specs-title">Built for <em>Scale</em></h2>
      </div>

      <div className="specs-grid" ref={gridRef}>
        {SPECS.map((s, i) => (
          <div className="spec-card" key={i}>
            <div className="spec-value">{s.value}</div>
            <div className="spec-unit">{s.unit}</div>
            <div className="spec-line" />
            <div className="spec-name">{s.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
