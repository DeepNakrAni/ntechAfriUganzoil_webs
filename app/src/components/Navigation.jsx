import { useEffect, useState, useRef } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      setScrolled(currentY > 80);

      // Hide on scroll down, show on scroll up
      if (currentY > lastScrollY.current && currentY > 120) {
        setHidden(true);  // scrolling down
      } else {
        setHidden(false); // scrolling up
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`nav ${scrolled ? 'scrolled' : ''}`}
      id="main-nav"
      style={{
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
      }}
    >
      <a href="#" className="nav-logo">VOIL</a>
      <ul className="nav-links">
        <li><a href="#hero" className="nav-link">Home</a></li>
        <li><a href="#assembly" className="nav-link">Process</a></li>
        <li><a href="#features" className="nav-link">Technology</a></li>
        <li><a href="#specs" className="nav-link">Specifications</a></li>
        <li><a href="#contact" className="nav-link">Contact</a></li>
      </ul>
    </nav>
  );
}
