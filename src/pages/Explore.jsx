import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../components/ui/SplitText';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import { movies, allGenres, actors } from '../data/movies';
import { useAppReady } from '../context/AppReadyContext';

gsap.registerPlugin(ScrollTrigger);

const sortOptions = [
  { value: 'default', label: 'Curated order' },
  { value: 'rating', label: 'Highest rating' },
  { value: 'newest', label: 'Newest release' },
  { value: 'title', label: 'Title A–Z' },
];

export default function Explore() {
  const pageRef = useRef(null);
  const gridRef = useRef(null);
  const ready = useAppReady();
  const { hash } = useLocation();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const genreParam = params.get('genre');
  const genre = genreParam && allGenres.includes(genreParam) ? genreParam : 'All';
  const [sort, setSort] = useState('default');
  const [actorFilter, setActorFilter] = useState(null);
  const [selected, setSelected] = useState(null);

  const setGenre = (value) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (value === 'All') next.delete('genre');
      else next.set('genre', value);
      return next;
    }, { replace: true });
  };

  const filtered = useMemo(() => {
    let list = [...movies];
    const query = search.trim().toLowerCase();
    if (query) {
      list = list.filter((movie) =>
        movie.title.toLowerCase().includes(query) ||
        movie.director.toLowerCase().includes(query) ||
        movie.genre.some((item) => item.toLowerCase().includes(query)),
      );
    }
    if (genre !== 'All') list = list.filter((movie) => movie.genre.includes(genre));
    if (actorFilter) list = list.filter((movie) => movie.cast.some((actor) => actor.id === actorFilter));
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (sort === 'newest') list.sort((a, b) => b.year - a.year);
    if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [search, genre, sort, actorFilter]);

  useLayoutEffect(() => {
    if (!ready || !hash) return undefined;
    const target = document.getElementById(hash.slice(1));
    if (!target) return undefined;
    const timer = window.setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
    return () => window.clearTimeout(timer);
  }, [ready, hash, filtered.length]);

  const activeActor = actors.find((actor) => actor.id === actorFilter);
  const clearAll = () => {
    setSearch('');
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.delete('genre');
      return next;
    }, { replace: true });
    setSort('default');
    setActorFilter(null);
  };

  useLayoutEffect(() => {
    if (!ready) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.ex-hero-wall img', { scale: 1.2, autoAlpha: 0, stagger: 0.06, duration: 1.1, ease: 'power3.out' });
      gsap.from('.ex-hero-copy > *:not(.ex-title)', { y: 34, autoAlpha: 0, stagger: 0.08, delay: 0.2, duration: 0.8, ease: 'power3.out' });
      gsap.from('.filter-console', { y: 44, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.filter-console', start: 'top 88%' } });
      gsap.from('.cast-rail-btn', { y: 26, autoAlpha: 0, stagger: 0.05, duration: 0.6, scrollTrigger: { trigger: '.cast-rail', start: 'top 92%' } });
      gsap.from('.results-head > *', { y: 26, autoAlpha: 0, stagger: 0.07, duration: 0.7, scrollTrigger: { trigger: '.results-head', start: 'top 90%' } });
    }, pageRef);
    return () => ctx.revert();
  }, [ready]);

  useLayoutEffect(() => {
    if (!ready || !gridRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.film-card',
        { y: 36, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.045, duration: 0.6, ease: 'power2.out', clearProps: 'transform,opacity,visibility' },
      );
    }, gridRef);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [ready, filtered.length, search, genre, sort, actorFilter]);

  return (
    <div className="explore-page" ref={pageRef}>
      <section className="explore-hero">
        <div className="ex-hero-wall">
          {movies.slice(0, 8).map((movie) => <img key={movie.id} src={movie.poster} alt="" />)}
        </div>
        <div className="ex-hero-scrim" />
        <div className="container ex-hero-copy">
          <span className="eyebrow"><i className="fa-solid fa-compass" /> Discovery lab</span>
          <SplitText as="h1" text="Explore Movies" className="ex-title" trigger="load" play={ready} stagger={0.036} />
          <p className="lead">Search real titles, tune by genre, sort the vault, and open film dossiers with cast imagery. Your next favourite is already in frame.</p>
          <div className="ex-stat-row">
            <span><i className="fa-solid fa-film" /> {movies.length} films</span>
            <span><i className="fa-solid fa-masks-theater" /> {actors.length} performers</span>
            <span><i className="fa-solid fa-layer-group" /> {allGenres.length} genres</span>
          </div>
        </div>
        <div className="ex-hero-stamp">
          <i className="fa-solid fa-clapperboard" />
          <span>24 frames</span>
        </div>
      </section>

      <section className="explore-tools">
        <div className="container">
          <div className="filter-console">
            <div className="filter-main">
              <div className="field ex-search">
                <i className="fa-solid fa-magnifying-glass" />
                <input
                  type="search"
                  placeholder="Search by title, director or genre..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search movies"
                />
              </div>
              <div className="filter-controls">
                <div className="field">
                  <i className="fa-solid fa-layer-group" />
                  <select value={genre} onChange={(event) => setGenre(event.target.value)} aria-label="Filter by genre">
                    <option value="All">All genres</option>
                    {allGenres.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div className="field">
                  <i className="fa-solid fa-arrow-down-wide-short" />
                  <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort movies">
                    {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>
                <div className="field filter-count">
                  <i className="fa-solid fa-clapperboard" />
                  <span>{filtered.length} results</span>
                </div>
                <button type="button" className="btn btn-ghost filter-clear" onClick={clearAll}>
                  <i className="fa-solid fa-rotate-left" /> Reset
                </button>
              </div>
              <div className="genre-chips">
                <button type="button" className={`chip-btn ${genre === 'All' ? 'is-active' : ''}`} onClick={() => setGenre('All')}>All</button>
                {allGenres.map((item) => (
                  <button type="button" key={item} className={`chip-btn ${genre === item ? 'is-active' : ''}`} onClick={() => setGenre(item)}>{item}</button>
                ))}
              </div>
              {activeActor && (
                <div className="active-filter">
                  <img src={activeActor.image} alt={activeActor.name} />
                  <span>Films with <strong>{activeActor.name}</strong></span>
                  <button type="button" onClick={() => setActorFilter(null)} aria-label="Clear performer filter"><i className="fa-solid fa-xmark" /></button>
                </div>
              )}
            </div>
            <div className="filter-side">
              <span className="eyebrow"><i className="fa-solid fa-users" /> Cast wall</span>
              <div className="cast-rail">
                {actors.slice(0, 12).map((actor) => (
                  <button
                    type="button"
                    key={actor.id}
                    className={`cast-rail-btn ${actorFilter === actor.id ? 'is-active' : ''}`}
                    onClick={() => setActorFilter(actorFilter === actor.id ? null : actor.id)}
                    title={`Show films with ${actor.name}`}
                  >
                    <img src={actor.image} alt={actor.name} />
                    <span>{actor.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="explore-results">
        <div className="container">
          <div className="results-head">
            <div>
              <span className="eyebrow">The vault</span>
              <h2>{activeActor ? `Films with ${activeActor.name}` : genre === 'All' ? 'All films' : `${genre} films`}</h2>
            </div>
            <p>{filtered.length} titles in view · sorted by {sortOptions.find((option) => option.value === sort)?.label.toLowerCase()}</p>
          </div>

          {filtered.length === 0 ? (
            <div className="explore-empty">
              <div className="empty-visual">
                {movies.slice(3, 7).map((movie) => <img key={movie.id} src={movie.poster} alt={movie.title} />)}
              </div>
              <div className="empty-copy">
                <span className="eyebrow">Nothing in this frame</span>
                <h2>No titles match that search.</h2>
                <p>Try another title, clear the performer filter, or reset the genre chips to bring the archive back into view.</p>
                <button type="button" className="btn btn-red" onClick={clearAll}>
                  <i className="fa-solid fa-rotate-left" /> Reset filters
                </button>
              </div>
            </div>
          ) : (
            <div className="film-grid" ref={gridRef}>
              {filtered.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} onDetails={setSelected} />
              ))}
            </div>
          )}
        </div>
      </section>

      {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
