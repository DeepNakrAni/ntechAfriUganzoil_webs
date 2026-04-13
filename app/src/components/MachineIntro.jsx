import { useEffect, useRef } from 'react';

export default function MachineIntro() {
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
    <section className="machine-intro" id="assembly" ref={ref}>
      <p className="machine-label">The Machine</p>
      <h2 className="machine-heading">
        Precision <em>Engineering</em><br />Meets Nature
      </h2>
      <p className="machine-body">
        Scroll to witness the assembly of our extraction system. 
        Every component engineered for a single purpose — the purest oil.
      </p>
    </section>
  );
}
