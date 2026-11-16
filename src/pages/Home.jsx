import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../components/ui/SplitText';
import Magnetic from '../components/ui/Magnetic';
import MovieModal from '../components/MovieModal';
import { movies, featuredMovie, trendingMovies, popularMovies } from '../data/movies';
import { getActor } from '../data/actors';
import { useFavoriteAction } from '../hooks/useFavoriteAction';
import { useAppReady } from '../context/AppReadyContext';

gsap.registerPlugin(ScrollTrigger);

const performerIds = ['a1', 'a9', 'a18', 'a28', 'a34', 'a40'];
const performers = performerIds.map(getActor);

export default function Home() {
  const pageRef = useRef(null);
  const marqueeRef = useRef(null);
  const trendSectionRef = useRef(null);
  const trackRef = useRef(null);
  const wrapRef = useRef(null);
  const ready = useAppReady();
  const { toggle, isFavorite } = useFavoriteAction();

  const [activePerformer, setActivePerformer] = useState(0);
  const [spotlight, setSpotlight] = useState(popularMovies[0]);
  const [selected, setSelected] = useState(null);

  const heroCast = featuredMovie.cast;
  const circlePoster = trendingMovies[1] || movies[5];
  const widePoster = trendingMovies[2] || movies[13];
  const spotlightSmall = popularMovies[(popularMovies.findIndex((movie) => movie.id === spotlight.id) + 1) % popularMovies.length];

  useLayoutEffect(() => {
    if (!ready) return undefined;

    const mq = gsap.matchMedia();

    const ctx = gsap.context(() => {
      /* Hero intro */
      gsap.from('.hero-copy > *:not(.hero-title)', {
        y: 36,
        autoAlpha: 0,
        stagger: 0.08,
        delay: 0.15,
        duration: 0.85,
        ease: 'power3.out',
      });
      gsap.from('.hc-main', { x: 70, rotate: 5, autoAlpha: 0, duration: 1.15, ease: 'power4.out', delay: 0.35 });
      gsap.from('.hc-circle', { scale: 0, rotate: -90, autoAlpha: 0, duration: 1, ease: 'back.out(1.6)', delay: 0.7 });
      gsap.from('.hc-wide', { x: 100, autoAlpha: 0, duration: 1, ease: 'power4.out', delay: 0.9 });
      gsap.from('.hc-badge', { scale: 0, autoAlpha: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)', delay: 1.15 });
      gsap.from('.hc-reel', { scale: 0, rotate: 90, autoAlpha: 0, duration: 0.8, ease: 'back.out(2)', delay: 1.25 });

      /* Hero parallax */
      gsap.to('.hero-atmos', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hc-main', {
        yPercent: -7,
        ease: 'none',
        scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hc-circle', {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hc-wide', {
        yPercent: -28,
        ease: 'none',
        scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: true },
      });

      /* Marquee drift */
      const marqueeTracks = gsap.utils.toArray('.marquee-track');
      marqueeTracks.forEach((track, index) => {
        const tween = index % 2
          ? gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: 34, ease: 'none', repeat: -1 })
          : gsap.to(track, { xPercent: -50, duration: 34, ease: 'none', repeat: -1 });

        ScrollTrigger.create({
          trigger: marqueeRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            gsap.to(tween, {
              timeScale: 1 + Math.abs(self.getVelocity()) / 420,
              duration: 0.3,
              overwrite: true,
              onComplete: () => gsap.to(tween, { timeScale: 1, duration: 1 }),
            });
          },
        });
      });

      /* Trending rail */
      mq.add('(min-width: 981px)', () => {
        const track = trackRef.current;
        const wrap = wrapRef.current;
        const distance = () => Math.max(0, track.scrollWidth - wrap.clientWidth + 24);

        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top top+=84',
            end: () => `+=${distance()}`,
            pin: wrap,
            pinSpacing: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        gsap.from('.trend-card', {
          y: 90,
          rotate: (index) => (index % 2 ? 4 : -4),
          autoAlpha: 0,
          stagger: 0.09,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: { trigger: trendSectionRef.current, start: 'top 72%' },
        });
      });

      mq.add('(max-width: 980px)', () => {
        gsap.from('.trend-card', {
          x: 90,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: wrapRef.current, start: 'top 88%' },
        });
      });

      /* Performers */
      gsap.from('.cast-panel', {
        yPercent: 18,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: { trigger: '.cast-panels', start: 'top 84%' },
      });

      /* Spotlight */
      gsap.from('.spotlight-visual', {
        clipPath: 'inset(0 100% 0 0)',
        duration: 1.3,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: '.spotlight-section', start: 'top 78%' },
      });
      gsap.from('.spotlight-copy > *', {
        y: 34,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.spotlight-copy', start: 'top 82%' },
      });
      gsap.from('.spotlight-pick', {
        x: 50,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 0.7,
        scrollTrigger: { trigger: '.spotlight-picks', start: 'top 88%' },
      });

    }, pageRef);

    return () => {
      mq.revert();
      ctx.revert();
    };
  }, [ready]);

  useLayoutEffect(() => {
    if (!ready) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo('.spotlight-poster-main', { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 0.65, ease: 'power3.out' });
      gsap.fromTo('.spotlight-title, .spotlight-meta, .spotlight-description', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.05, ease: 'power3.out' });
    }, pageRef);
    return () => ctx.revert();
  }, [spotlight, ready]);

  return (
    <div className="home-page" ref={pageRef}>
      <section className="home-hero">
        <div className="hero-atmos" style={{ backgroundImage: `url(${featuredMovie.backdrop})` }} />
        <div className="hero-grain" />
        <div className="hero-scrim" />
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow"><i className="fa-solid fa-fire" /> Featured premiere</span>
            <SplitText as="h1" text={featuredMovie.title} className="hero-title" trigger="load" play={ready} stagger={0.032} />
            <p className="hero-tagline">“{featuredMovie.tagline}”</p>
            <p className="lead hero-lead">
              Paul Atreides rises with the Fremen, torn between love and destiny as a war for Arrakis reshapes the universe.
            </p>
            <div className="hero-actions">
              <Magnetic>
                <Link to="/explore" className="btn btn-red">
                  <span>Explore all movies</span>
                  <i className="fa-solid fa-arrow-right" />
                </Link>
              </Magnetic>
              <Link to="/favorites" className="btn btn-ghost">
                <i className="fa-solid fa-heart" /> My favourites
              </Link>
            </div>
            <div className="hero-meta">
              <span><i className="fa-solid fa-star" /> {featuredMovie.rating.toFixed(1)}</span>
              <span><i className="fa-regular fa-calendar" /> {featuredMovie.year}</span>
              <span><i className="fa-regular fa-clock" /> {featuredMovie.duration}</span>
              <span>{featuredMovie.certificate}</span>
              {featuredMovie.genre.map((genre) => <span key={genre}>{genre}</span>)}
            </div>
            <div className="hero-cast">
              <span className="hero-cast-label">Starring</span>
              <div className="hero-cast-list">
                {heroCast.map((actor) => (
                  <div className="hero-cast-chip" key={actor.id}>
                    <img src={actor.image} alt={actor.name} />
                    <div>
                      <strong>{actor.name}</strong>
                      <span>{actor.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-collage">
            <div className="hc hc-main">
              <img src={featuredMovie.poster} alt={`${featuredMovie.title} poster`} />
              <button
                type="button"
                className={`hc-fav ${isFavorite(featuredMovie.id) ? 'is-active' : ''}`}
                onClick={() => toggle(featuredMovie)}
                aria-label="Toggle favourite"
              >
                <i className={`${isFavorite(featuredMovie.id) ? 'fa-solid' : 'fa-regular'} fa-heart`} />
              </button>
              <div className="hc-caption">
                <strong>Directed by {featuredMovie.director}</strong>
                <span>{featuredMovie.genre.join(' · ')}</span>
              </div>
            </div>
            <div className="hc hc-circle">
              <img src={circlePoster.poster} alt={circlePoster.title} />
            </div>
            <div className="hc hc-wide">
              <img src={widePoster.poster} alt={widePoster.title} />
            </div>
            <div className="hc-badge">
              <i className="fa-solid fa-star" />
              <b>{featuredMovie.rating.toFixed(1)}</b>
              <small>viewer score</small>
            </div>
            <div className="hc-reel"><i className="fa-solid fa-film" /></div>
          </div>
        </div>
        <a href="#marquee" className="scroll-cue" aria-label="Scroll to explore">
          <span>Scroll</span>
          <i className="fa-solid fa-chevron-down" />
        </a>
      </section>

      <section className="marquee-band" id="marquee" ref={marqueeRef}>
        <div className="marquee-row">
          <div className="marquee-track">
            {[...movies, ...movies].map((movie, index) => (
              <span className="marquee-item" key={`${movie.id}-${index}`}>
                {movie.title}
                <i className="fa-solid fa-star" />
              </span>
            ))}
          </div>
        </div>
        <div className="marquee-row is-alt">
          <div className="marquee-track">
            {[...Array(2)].flatMap((_, pass) =>
              ['Sci-Fi', 'Drama', 'Action', 'Crime', 'Animation', 'Romance', 'Mystery', 'History', 'Adventure', 'Thriller'].map((genre, index) => (
                <span className="marquee-item" key={`${genre}-${pass}-${index}`}>
                  {genre}
                  <i className="fa-solid fa-circle" />
                </span>
              )),
            )}
          </div>
        </div>
        <div className="marquee-badge"><i className="fa-solid fa-clapperboard" /></div>
      </section>

      <section className="trending-section" ref={trendSectionRef}>
        <div className="container section-head">
          <div>
            <span className="eyebrow"><i className="fa-solid fa-fire-flame-curved" /> On fire now</span>
            <SplitText as="h2" text="Trending Reels" />
          </div>
          <p className="section-note">A living shelf of the films everyone is talking about. Scroll sideways and let one pull you in.</p>
          <Link to="/explore" className="btn btn-outline">
            <span>Explore the archive</span>
            <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
        <div className="poster-track-wrap" ref={wrapRef}>
          <div className="poster-track" ref={trackRef}>
            {trendingMovies.map((movie, index) => (
              <article className="trend-card" key={movie.id}>
                <button type="button" className="trend-card-hit" onClick={() => setSelected(movie)} aria-label={`Open ${movie.title} details`}>
                  <img src={movie.poster} alt={`${movie.title} poster`} loading="lazy" />
                  <span className="trend-index">{String(index + 1).padStart(2, '0')}</span>
                  <div className="trend-overlay">
                    <span className="trend-rating"><i className="fa-solid fa-star" /> {movie.rating.toFixed(1)}</span>
                    <h3>{movie.title}</h3>
                    <p>{movie.year} · {movie.genre.join(' / ')}</p>
                    <span className="trend-more">Open dossier <i className="fa-solid fa-arrow-up-right-from-square" /></span>
                  </div>
                </button>
                <button
                  type="button"
                  className={`fav-bubble trend-fav ${isFavorite(movie.id) ? 'is-active' : ''}`}
                  onClick={() => toggle(movie)}
                  aria-label="Toggle favourite"
                >
                  <i className={`${isFavorite(movie.id) ? 'fa-solid' : 'fa-regular'} fa-heart`} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cast-section">
        <div className="container">
          <div className="section-head cast-head">
            <div>
              <span className="eyebrow"><i className="fa-solid fa-masks-theater" /> Faces of cinema</span>
              <SplitText as="h2" text="Performer Constellation" />
            </div>
            <p className="section-note">Six performers who define the frame. Hover a panel and the room makes space for them.</p>
            <Link to="/explore" className="lnk">Explore the cast wall <i className="fa-solid fa-arrow-right-long" /></Link>
          </div>
          <div className="cast-panels">
            {performers.map((actor, index) => (
              <button
                type="button"
                key={actor.id}
                className={`cast-panel ${activePerformer === index ? 'is-on' : ''}`}
                onMouseEnter={() => setActivePerformer(index)}
                onFocus={() => setActivePerformer(index)}
                onClick={() => setActivePerformer(index)}
              >
                <img src={actor.image} alt={actor.name} loading="lazy" />
                <span className="cast-number">{String(index + 1).padStart(2, '0')}</span>
                <div className="cast-panel-body">
                  <span className="cast-icon"><i className="fa-solid fa-star" /></span>
                  <div>
                    <h3>{actor.name}</h3>
                    <span className="cast-known">{actor.knownFor}</span>
                    <p>{actor.role}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="spotlight-section">
        <div className="container">
          <div className="spotlight-slab">
            <div className="spotlight-visual">
              <div className="spotlight-poster-main">
                <img src={spotlight.poster} alt={spotlight.title} />
              </div>
              <div className="spotlight-poster-small">
                <img src={spotlightSmall.poster} alt={spotlightSmall.title} />
              </div>
              <div className="spotlight-spin">
                <span>Editor’s pick</span>
                <i className="fa-solid fa-star" />
              </div>
            </div>
            <div className="spotlight-copy">
              <span className="eyebrow"><i className="fa-solid fa-crown" /> Audience favourites</span>
              <h2 className="spotlight-title">{spotlight.title}</h2>
              <p className="spotlight-tagline">“{spotlight.tagline}”</p>
              <div className="spotlight-meta">
                <span><i className="fa-solid fa-star" /> {spotlight.rating.toFixed(1)}</span>
                <span>{spotlight.year}</span>
                <span>{spotlight.duration}</span>
                <span>{spotlight.certificate}</span>
              </div>
              <p className="spotlight-description">{spotlight.description}</p>
              <div className="spotlight-insight">
                <span><i className="fa-solid fa-quote-left" /> Why audiences return</span>
                <p>
                  Directed by {spotlight.director}, {spotlight.title} brings {spotlight.genre.join(' and ')} together with standout turns from{' '}
                  {spotlight.cast.slice(0, 2).map((actor) => actor.name).join(' and ')}. Its {spotlight.rating.toFixed(1)} audience score keeps it among the archive&apos;s most rewatched favourites.
                </p>
              </div>
              <div className="spotlight-picks">
                {popularMovies.slice(0, 5).map((movie) => (
                  <button
                    key={movie.id}
                    type="button"
                    className={`spotlight-pick ${spotlight.id === movie.id ? 'is-active' : ''}`}
                    onClick={() => setSpotlight(movie)}
                  >
                    <img src={movie.poster} alt="" />
                    <div>
                      <strong>{movie.title}</strong>
                      <span>{movie.year} · {movie.genre[0]}</span>
                    </div>
                    <i className="fa-solid fa-star" />
                    <b>{movie.rating.toFixed(1)}</b>
                  </button>
                ))}
              </div>
              <div className="spotlight-actions">
                <button type="button" className="btn btn-red" onClick={() => setSelected(spotlight)}>
                  <i className="fa-solid fa-circle-play" /> Open dossier
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => toggle(spotlight)}>
                  <i className={`${isFavorite(spotlight.id) ? 'fa-solid' : 'fa-regular'} fa-heart`} /> Favourite
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
