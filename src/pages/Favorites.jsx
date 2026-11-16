import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../components/ui/SplitText';
import Magnetic from '../components/ui/Magnetic';
import MovieModal from '../components/MovieModal';
import { movies, popularMovies } from '../data/movies';
import { useFavorites } from '../context/FavoritesContext';
import { useFavoriteAction } from '../hooks/useFavoriteAction';
import { useAppReady } from '../context/AppReadyContext';

gsap.registerPlugin(ScrollTrigger);

export default function Favorites() {
  const pageRef = useRef(null);
  const listRef = useRef(null);
  const ready = useAppReady();
  const { favoriteIds } = useFavorites();
  const { toggle, isFavorite } = useFavoriteAction();
  const [selected, setSelected] = useState(null);

  const favorites = useMemo(() => movies.filter((movie) => favoriteIds.includes(movie.id)), [favoriteIds]);
  const fallback = popularMovies.slice(0, 4);
  const heroPosters = favorites.length ? favorites.slice(0, 4) : fallback;
  const heroBackdrop = heroPosters[0]?.backdrop;
  const genreCount = new Set(favorites.flatMap((movie) => movie.genre)).size;
  const castCount = favorites.reduce((total, movie) => total + movie.cast.length, 0);
  const averageRating = favorites.length
    ? (favorites.reduce((total, movie) => total + movie.rating, 0) / favorites.length).toFixed(1)
    : '0.0';

  useLayoutEffect(() => {
    if (!ready) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.fav-fan-item', { y: 70, rotate: (index) => (index - 1.5) * 7, autoAlpha: 0, stagger: 0.1, duration: 1, ease: 'power4.out' });
      gsap.from('.fav-hero-copy > *:not(.fav-title)', { y: 32, autoAlpha: 0, stagger: 0.08, delay: 0.2, duration: 0.8, ease: 'power3.out' });
      gsap.from('.fav-badge', { scale: 0, rotate: -120, autoAlpha: 0, duration: 0.9, ease: 'back.out(1.8)', delay: 0.75 });
      gsap.from('.fav-stat-card', { y: 40, autoAlpha: 0, stagger: 0.09, duration: 0.7, delay: 0.5, ease: 'power3.out' });
      gsap.to('.fav-fan-item', {
        yPercent: (index) => (index % 2 ? -6 : 6),
        ease: 'none',
        scrollTrigger: { trigger: '.fav-hero', start: 'top top', end: 'bottom top', scrub: true },
      });
    }, pageRef);
    return () => ctx.revert();
  }, [ready]);

  useLayoutEffect(() => {
    if (!ready || !listRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.save-ticket',
        { y: 60, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity,visibility' },
      );
    }, listRef);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [ready, favorites.length]);

  return (
    <div className="favorites-page" ref={pageRef}>
      <section className="fav-hero">
        <div className="fav-hero-bg" style={{ backgroundImage: `url(${heroBackdrop})` }} aria-hidden="true" />
        <div className="fav-hero-scrim" aria-hidden="true" />
        <div className="fav-hero-glow" />
        <div className="container fav-hero-layout">
          <div className="fav-hero-copy">
            <span className="eyebrow"><i className="fa-solid fa-heart" /> Your private screening room</span>
            <SplitText as="h1" text="Favourites" className="fav-title" trigger="load" play={ready} stagger={0.04} />
            <p className="lead">
              A handpicked reel kept in your browser. Save any film, return any time, and let the room remember exactly what moved you.
            </p>
            <div className="fav-actions">
              <Magnetic>
                <Link to="/explore" className="btn btn-red">
                  <span>Find more films</span>
                  <i className="fa-solid fa-arrow-right" />
                </Link>
              </Magnetic>
              <Link to="/" className="btn btn-ghost">
                <i className="fa-solid fa-house" /> Back home
              </Link>
            </div>
            <div className="fav-stats">
              <div className="fav-stat-card">
                <i className="fa-solid fa-heart" />
                <b>{favorites.length}</b>
                <span>Saved films</span>
              </div>
              <div className="fav-stat-card">
                <i className="fa-solid fa-layer-group" />
                <b>{genreCount}</b>
                <span>Genres loved</span>
              </div>
              <div className="fav-stat-card">
                <i className="fa-solid fa-masks-theater" />
                <b>{castCount}</b>
                <span>Cast faces</span>
              </div>
              <div className="fav-stat-card">
                <i className="fa-solid fa-star" />
                <b>{averageRating}</b>
                <span>Avg. rating</span>
              </div>
            </div>
          </div>

          <div className="fav-fan">
            {heroPosters.map((movie, index) => (
              <div className={`fav-fan-item fav-fan-${index + 1}`} key={movie.id}>
                <img src={movie.poster} alt={movie.title} />
                <span>{movie.title}</span>
              </div>
            ))}
            <div className="fav-badge">
              <span>Saved by you</span>
              <i className="fa-solid fa-bookmark" />
            </div>
            <div className="fav-count">
              <b>{String(favorites.length).padStart(2, '0')}</b>
              <span>titles in the reel</span>
            </div>
          </div>
        </div>
      </section>

      <div className="reel-strip">
        <div className="reel-strip-inner">
          {[...Array(18)].map((_, index) => <span key={index} style={{ animationDelay: `${index * -0.18}s` }} />)}
        </div>
      </div>

      <section className="fav-shelf">
        <div className="container" ref={listRef}>
          {favorites.length === 0 ? (
            <>
              <div className="fav-empty">
                <div className="fav-empty-visual">
                  {movies.slice(4, 9).map((movie) => (
                    <img key={movie.id} src={movie.poster} alt={movie.title} />
                  ))}
                  <span className="fav-empty-heart"><i className="fa-regular fa-heart" /></span>
                </div>
                <div className="fav-empty-copy">
                  <span className="eyebrow">The reel is empty</span>
                  <h2>No favourites saved yet.</h2>
                  <p>
                    Your collection is a blank reel. Explore the archive and tap the heart on any film to keep it here — even after you refresh.
                  </p>
                  <div className="fav-actions">
                    <Link to="/explore" className="btn btn-red"><i className="fa-solid fa-compass" /> Explore movies</Link>
                    <Link to="/" className="btn btn-ghost"><i className="fa-solid fa-film" /> Tonight’s feature</Link>
                  </div>
                </div>
              </div>

              <div className="quick-picks">
                <div className="section-head quick-head">
                  <div>
                    <span className="eyebrow"><i className="fa-solid fa-wand-magic-sparkles" /> Start here</span>
                    <h2>Four films worth saving</h2>
                  </div>
                  <Link to="/explore" className="lnk">See everything <i className="fa-solid fa-arrow-right-long" /></Link>
                </div>
                <div className="quick-grid">
                  {fallback.map((movie) => (
                    <article className="quick-pick" key={movie.id}>
                      <button type="button" className="quick-pick-media" onClick={() => setSelected(movie)}>
                        <img src={movie.poster} alt={movie.title} />
                        <span><i className="fa-solid fa-circle-play" /> View</span>
                      </button>
                      <div className="quick-pick-body">
                        <div>
                          <h3>{movie.title}</h3>
                          <p>{movie.year} · {movie.genre[0]} · <i className="fa-solid fa-star" /> {movie.rating.toFixed(1)}</p>
                        </div>
                        <button
                          type="button"
                          className={`fav-bubble quick-heart ${isFavorite(movie.id) ? 'is-active' : ''}`}
                          onClick={() => toggle(movie)}
                          aria-label="Save to favourites"
                        >
                          <i className={`${isFavorite(movie.id) ? 'fa-solid' : 'fa-regular'} fa-heart`} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="section-head shelf-head">
                <div>
                  <span className="eyebrow"><i className="fa-solid fa-bookmark" /> Curated by you</span>
                  <h2>The saved shelf</h2>
                </div>
                <p className="section-note">Tap a ticket to reopen the dossier, or remove a film to free the reel.</p>
              </div>

              <div className="save-list">
                {favorites.map((movie, index) => (
                  <article className="save-ticket" key={movie.id}>
                    <div className="save-stub">
                      <span className="save-stub-label">Stackly Cinema</span>
                      <span className="save-stub-no">No. {String(index + 1).padStart(3, '0')}</span>
                      <span className="save-stub-year">{movie.year}</span>
                      <i className="fa-solid fa-scissors" />
                    </div>
                    <button type="button" className="save-poster" onClick={() => setSelected(movie)} aria-label={`Open ${movie.title}`}>
                      <img src={movie.poster} alt={movie.title} />
                      <span className="save-poster-play"><i className="fa-solid fa-circle-play" /></span>
                    </button>
                    <div className="save-body">
                      <div className="save-head">
                        <div>
                          <span className="eyebrow">Saved title</span>
                          <h3>{movie.title}</h3>
                        </div>
                        <span className="save-score"><i className="fa-solid fa-star" /> {movie.rating.toFixed(1)}</span>
                      </div>
                      <div className="save-meta">
                        <span><i className="fa-solid fa-clapperboard" /> {movie.director}</span>
                        <span><i className="fa-regular fa-clock" /> {movie.duration}</span>
                        <span>{movie.certificate}</span>
                        {movie.genre.map((genre) => <span key={genre}>{genre}</span>)}
                      </div>
                      <p>{movie.description}</p>
                      <div className="save-foot">
                        <div className="save-cast">
                          {movie.cast.slice(0, 4).map((actor) => (
                            <div key={actor.id} className="save-cast-person" title={`${actor.name} as ${actor.role}`}>
                              <img src={actor.image} alt={actor.name} />
                              <span>{actor.name}</span>
                            </div>
                          ))}
                        </div>
                        <div className="save-actions">
                          <button type="button" className="btn btn-ghost save-view" onClick={() => setSelected(movie)}>
                            <i className="fa-solid fa-arrow-up-right-from-square" /> Dossier
                          </button>
                          <button
                            type="button"
                            className="btn btn-red save-remove"
                            onClick={() => toggle(movie)}
                            aria-label={`Remove ${movie.title} from favourites`}
                          >
                            <i className="fa-solid fa-heart-crack" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
