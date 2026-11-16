import { useRef } from 'react';
import gsap from 'gsap';

export default function Magnetic({ children, className = '', strength = 0.28 }) {
  const ref = useRef(null);

  const handleMove = (event) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    gsap.to(el, {
      x: (event.clientX - rect.left - rect.width / 2) * strength,
      y: (event.clientY - rect.top - rect.height / 2) * strength,
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  const handleLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <span ref={ref} className={`magnetic ${className}`} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </span>
  );
}
