export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-image-wrapper">
        <img src="/hero-premium.png" alt="Premium Avocado" />
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        <p className="hero-eyebrow">Premium Avocado Oil Extraction</p>
        <h1 className="hero-title">
          Pure. <em>Natural.</em><br />Perfected.
        </h1>
        <p className="hero-subtitle">
          From hand-selected Hass avocados to crystal-clear golden oil — 
          precision-engineered extraction for uncompromised purity.
        </p>
        <a href="#assembly" className="hero-cta">
          <span>Discover the Process</span>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.5 8h9M8.5 4l4 4-4 4"/>
          </svg>
        </a>
      </div>

      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  );
}
