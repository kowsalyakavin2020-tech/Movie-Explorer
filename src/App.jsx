import { useEffect, useLayoutEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Layout from './layouts/Layout';
import Preloader from './components/Preloader';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';
import { AppReadyProvider } from './context/AppReadyContext';

gsap.registerPlugin(ScrollTrigger);

function PageTransition({ children }) {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.page-shell',
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out', clearProps: 'transform,opacity,visibility' },
      );
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [location.pathname]);

  return <div className="page-shell" key={location.pathname}>{children}</div>;
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('is-loading', loading);
    if (!loading) {
      const timer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [loading]);

  return (
    <>
      {loading && <Preloader onDone={() => setLoading(false)} />}
      <AppReadyProvider ready={!loading}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/explore" element={<PageTransition><Explore /></PageTransition>} />
            <Route path="/favorites" element={<PageTransition><Favorites /></PageTransition>} />
          </Route>
          <Route path="/404" element={<PageTransition><NotFound /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AppReadyProvider>
    </>
  );
}
