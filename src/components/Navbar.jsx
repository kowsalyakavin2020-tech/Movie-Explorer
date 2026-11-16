import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { featuredMovie } from '../data/movies';
import { assetPath } from '../utils/asset';
import { useToast } from '../context/ToastContext';

const links = [
  { to: '/', label: 'Home', index: '01' },
  { to: '/explore', label: 'Explore Movies', index: '02' },
  { to: '/favorites', label: 'Favourites', index: '03' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const linksRef = useRef(null);
  const { pathname } = useLocation();
  const { showToast } = useToast();

  const handleLogin = () => {
    showToast('Login is coming soon. Stay tuned.', 'info');
  };

  const handleLogoClick = (event) => {
    setOpen(false);
    if (pathname === '/') {
      event.preventDefault();
      window.location.assign(import.meta.env.BASE_URL);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);

    if (open) {
      document.body.classList.add('menu-open');
      gsap.set(menu, { visibility: 'visible' });
      gsap.to(menu, { clipPath: 'circle(150% at 92% 6%)', duration: 0.85, ease: 'power4.inOut' });
      gsap.fromTo(
        linksRef.current?.querySelectorAll('.mm-link, .mm-meta') ?? [],
        { y: 42, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.07, delay: 0.3, duration: 0.7, ease: 'power3.out' },
      );
      gsap.fromTo(
        menu.querySelectorAll('.mm-poster'),
        { scale: 0.6, rotate: -18, autoAlpha: 0 },
        { scale: 1, rotate: 0, autoAlpha: 1, stagger: 0.08, delay: 0.45, duration: 0.8, ease: 'back.out(1.5)' },
      );
    } else {
      document.body.classList.remove('menu-open');
      gsap.to(menu, {
        clipPath: 'circle(0% at 92% 6%)',
        duration: 0.6,
        ease: 'power4.inOut',
        onComplete: () => gsap.set(menu, { visibility: 'hidden' }),
      });
    }

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('menu-open');
    };
  }, [open]);

  return (
    <>
      <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container nav-inner">
          <Link to="/" className="brand" aria-label="Stackly home" onClick={handleLogoClick}>
            <span className="brand-mark"><img src={assetPath('/images/logo-red.png')} alt="Stackly" width="91" height="28" /></span>
          </Link>

          <nav className="nav-links desktop" aria-label="Main navigation">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            <button type="button" className="nav-cta nav-login" onClick={handleLogin}>
              <i className="fa-solid fa-user" />
              <span>Login</span>
            </button>
            <button className="nav-burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
              <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars-staggered'}`} />
            </button>
          </div>
        </div>
      </header>

      <div className="mobile-menu" ref={menuRef} aria-hidden={!open} style={{ visibility: 'hidden', clipPath: 'circle(0% at 92% 6%)' }}>
        <img className="mobile-menu-bg" src={featuredMovie.backdrop} alt="" />
        <div className="mm-top">
          <Link to="/" className="brand" aria-label="Stackly home" onClick={handleLogoClick}>
            <span className="brand-mark"><img src={assetPath('/images/logo-red.png')} alt="Stackly" width="91" height="28" /></span>
          </Link>
          <button className="nav-burger is-light" aria-label="Close menu" onClick={() => setOpen(false)}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <nav className="mm-links" ref={linksRef} aria-label="Mobile navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `mm-link ${isActive ? 'active' : ''}`}
            >
              <span className="mm-index">{link.index}</span>
              <span>{link.label}</span>
              <i className="fa-solid fa-arrow-up-right-from-square" />
            </NavLink>
          ))}
        </nav>
        <div className="mm-meta">
          <div className="mm-posters">
            <img className="mm-poster" src={featuredMovie.poster} alt={featuredMovie.title} />
            <img className="mm-poster" src={assetPath('/images/posters/oppenheimer.webp')} alt="Oppenheimer" />
            <img className="mm-poster" src={assetPath('/images/posters/barbie.webp')} alt="Barbie" />
          </div>
          <p>Real posters. Real performers. A film archive curated for the way you watch.</p>
          <button
            type="button"
            className="mm-login"
            onClick={() => {
              setOpen(false);
              handleLogin();
            }}
          >
            <i className="fa-solid fa-user" />
            <span>Login</span>
            <small>Coming soon</small>
          </button>
          <div className="mm-social">
            <a href="#footer" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
            <a href="#footer" aria-label="X"><i className="fa-brands fa-x-twitter" /></a>
            <a href="#footer" aria-label="YouTube"><i className="fa-brands fa-youtube" /></a>
          </div>
        </div>
      </div>
    </>
  );
}
