import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useFavoriteAction } from '../hooks/useFavoriteAction';

export default function MovieModal({ movie, onClose }) {
  const ref = useRef(null);
  const { toggle, isFavorite } = useFavoriteAction();
  const favorite = isFavorite(movie.id);

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onClose();
    document.body.classList.add('modal-open');
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.film-modal', { y: 60, scale: 0.96, autoAlpha: 0, duration: 0.55, ease: 'power3.out' });
      gsap.from('.modal-copy > *', { y: 24, autoAlpha: 0, stagger: 0.07, delay: 0.18, duration: 0.6, ease: 'power3.out' });
      gsap.from('.modal-cast-card', { y: 18, autoAlpha: 0, stagger: 0.06, delay: 0.35, duration: 0.5 });
    }, ref);
    return () => ctx.revert();
  }, [movie.id]);

  return (
    <div className="film-modal-backdrop" ref={ref} onClick={onClose}>
      <div className="film-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`${movie.title} details`}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close details">
          <i className="fa-solid fa-xmark" />
        </button>
        <img className="modal-atmosphere" src={movie.backdrop} alt="" />
        <div className="modal-poster-wrap">
          <img className="modal-poster" src={movie.poster} alt={`${movie.title} poster`} />
          <span className="modal-cert">{movie.certificate}</span>
        </div>
        <div className="modal-copy">
          <span className="eyebrow"><i className="fa-solid fa-film" /> Film dossier</span>
          <h2>{movie.title}</h2>
          <p className="modal-tagline">“{movie.tagline}”</p>
          <div className="modal-pills">
            <span><i className="fa-solid fa-star" /> {movie.rating.toFixed(1)}</span>
            <span><i className="fa-regular fa-calendar" /> {movie.year}</span>
            <span><i className="fa-regular fa-clock" /> {movie.duration}</span>
            {movie.genre.map((genre) => <span key={genre}>{genre}</span>)}
          </div>
          <p className="modal-description">{movie.description}</p>
          <div className="modal-director">
            <i className="fa-solid fa-clapperboard" />
            <span>Directed by</span>
            <strong>{movie.director}</strong>
          </div>
          <h4>Cast</h4>
          <div className="modal-cast">
            {movie.cast.map((actor) => (
              <div className="modal-cast-card" key={actor.id}>
                <img src={actor.image} alt={actor.name} />
                <div>
                  <strong>{actor.name}</strong>
                  <span>{actor.role}</span>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className={`btn ${favorite ? 'btn-wine' : 'btn-red'} modal-fav`} onClick={() => toggle(movie)}>
            <i className={`${favorite ? 'fa-solid' : 'fa-regular'} fa-heart`} />
            {favorite ? 'Saved to favourites' : 'Add to favourites'}
          </button>
        </div>
      </div>
    </div>
  );
}
