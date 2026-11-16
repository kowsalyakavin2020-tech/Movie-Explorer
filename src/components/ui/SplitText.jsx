import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SplitText({
  text,
  as: Tag = 'h2',
  className = '',
  trigger = 'scroll',
  play = true,
  delay = 0,
  stagger = 0.022,
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray('.st-char', ref.current);
      gsap.set(chars, { yPercent: 120, rotate: 6, autoAlpha: 0 });

      if (trigger === 'load') {
        if (!play) return;
        gsap.to(chars, {
          yPercent: 0,
          rotate: 0,
          autoAlpha: 1,
          duration: 0.95,
          ease: 'power4.out',
          stagger,
          delay,
        });
        return;
      }

      gsap.to(chars, {
        yPercent: 0,
        rotate: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: 'power4.out',
        stagger,
        delay,
        scrollTrigger: { trigger: ref.current, start: 'top 86%', toggleActions: 'play none none none' },
      });
    }, ref);
    return () => ctx.revert();
  }, [text, trigger, play, delay, stagger]);

  return (
    <Tag ref={ref} className={`split-text ${className}`} aria-label={text}>
      <span aria-hidden="true">
        {text.split(' ').map((word, wi) => (
          <span className="st-word" key={`${word}-${wi}`}>
            {[...word].map((char, ci) => (
              <span className="st-char" key={`${char}-${ci}`}>
                {char}
              </span>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  );
}
