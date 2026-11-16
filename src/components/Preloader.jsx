import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const icons = ['fa-film', 'fa-clapperboard', 'fa-ticket', 'fa-star', 'fa-video'];

export default function Preloader({ onDone }) {
  const ref = useRef(null);
  const [iconIndex, setIconIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const cycle = window.setInterval(() => {
      setIconIndex((index) => (index + 1) % icons.length);
    }, 520);
    return () => window.clearInterval(cycle);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const counter = { value: 0 };
      const tl = gsap.timeline();
      tl.to(counter, {
        value: 100,
        duration: 2.5,
        ease: 'power1.inOut',
        onUpdate: () => {
          setProgress(Math.round(counter.value));
          gsap.set('.ld-bar span', { width: `${counter.value}%` });
        },
      })
        .to('.ld-reel', { rotate: 360, duration: 1.1, ease: 'power2.inOut' }, 0)
        .to('.preloader-inner', { y: -36, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 2.55)
        .to(ref.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power4.inOut' }, 2.85)
        .add(() => onDone());
    }, ref);
    return () => ctx.revert();
  }, [onDone]);

  return (
    <div className="preloader" ref={ref} style={{ clipPath: 'inset(0 0 0 0)' }} aria-hidden="true">
      <div className="preloader-inner">
        <div className="ld-reel">
          <div className="ld-ring">
            {icons.map((icon, index) => (
              <i key={icon} className={`fa-solid ${icon} ld-icon ${index === iconIndex ? 'is-on' : ''}`} />
            ))}
          </div>
          <span className="ld-center"><i className="fa-solid fa-film" /></span>
        </div>
        <div className="ld-brand">STACKLY</div>
        <p className="ld-tag">Curating cinematic worlds</p>
        <div className="ld-bar"><span /></div>
        <div className="ld-foot">
          <span>Loading the archive</span>
          <b>{progress}%</b>
        </div>
      </div>
    </div>
  );
}
