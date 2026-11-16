import { useFavoriteAction } from '../hooks/useFavoriteAction';

export default function MovieCard({ movie, index = 0, onDetails }) {
  const { toggle, isFavorite } = useFavoriteAction();
  const favorite = isFavorite(movie.id);

  return (
    <article className="film-card" id={`movie-${movie.id}`} style={{ '--card-index': index }}>
      <div className="film-card-media">
        <img src={movie.poster} alt={`${movie.title} poster`} loading="lazy" />
        <span className="film-rank">{String(index + 1).padStart(2, '0')}</span>
        <span className="film-cert">{movie.certificate}</span>
        <button
          type="button"
          className={`fav-bubble ${favorite ? 'is-active' : ''}`}
          onClick={(event) => toggle(movie, event)}
          aria-label={favorite ? `Remove ${movie.title} from favourites` : `Add ${movie.title} to favourites`}
        >
          <i className={`${favorite ? 'fa-solid' : 'fa-regular'} fa-heart`} />
        </button>
        <div className="film-card-overlay">
          <span className="film-score"><i className="fa-solid fa-star" /> {movie.rating.toFixed(1)}</span>
          <button type="button" className="film-details" onClick={() => onDetails?.(movie)}>
            <i className="fa-solid fa-circle-play" /> View dossier
          </button>
        </div>
      </div>
      <div className="film-card-body">
        <div className="film-card-head">
          <h3>{movie.title}</h3>
          <span>{movie.year}</span>
        </div>
        <div className="film-card-meta">
          <span><i className="fa-regular fa-clock" /> {movie.duration}</span>
          <span><i className="fa-solid fa-clapperboard" /> {movie.director}</span>
        </div>
        <div className="genre-row">
          {movie.genre.map((genre) => <span key={genre}>{genre}</span>)}
        </div>
        <div className="film-cast-row">
          {movie.cast.slice(0, 3).map((actor) => (
            <img key={actor.id} src={actor.image} alt={actor.name} title={`${actor.name} as ${actor.role}`} />
          ))}
          <span className="film-cast-count">{movie.cast.length} cast</span>
        </div>
      </div>
    </article>
  );
}
