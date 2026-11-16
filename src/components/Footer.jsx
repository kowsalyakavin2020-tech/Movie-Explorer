import { Link, useLocation } from 'react-router-dom';
import { movies } from '../data/movies';
import { assetPath } from '../utils/asset';

const strip = movies.slice(9, 13);

export default function Footer() {
  const { pathname } = useLocation();
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleLogoClick = (event) => {
    if (pathname === '/') {
      event.preventDefault();
      window.location.assign(import.meta.env.BASE_URL);
    }
  };

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-strip">
          {strip.map((movie, index) => (
            <Link to="/explore" key={movie.id} className={`footer-poster fp-${index + 1}`} aria-label={movie.title}>
              <img src={movie.poster} alt={movie.title} loading="lazy" />
              <span>{movie.title}</span>
            </Link>
          ))}
        </div>

        <div className="footer-cta">
          <div>
            <span className="eyebrow"><i className="fa-solid fa-film" /> Build your watchlist</span>
            <h2>Every great film deserves a second look.</h2>
            <p>Save the titles that stay with you, revisit the performances you love, and keep your own cinema shelf close.</p>
          </div>
          <Link to="/explore" className="btn btn-ink">
            <span>Explore the archive</span>
            <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>

        <div className="footer-cols">
          <div className="footer-brand">
            <Link to="/" className="brand" aria-label="Stackly home" onClick={handleLogoClick}>
              <span className="brand-mark"><img src={assetPath('/images/logo-red.png')} alt="Stackly" width="91" height="28" /></span>
            </Link>
            <p>A cinematic explorer built around real posters, real performers and a collection that belongs to you.</p>
            <div className="footer-social">
              <Link to="/404" aria-label="Instagram"><i className="fa-brands fa-instagram" /></Link>
              <Link to="/404" aria-label="X"><i className="fa-brands fa-x-twitter" /></Link>
              <Link to="/404" aria-label="YouTube"><i className="fa-brands fa-youtube" /></Link>
              <Link to="/404" aria-label="Letterboxd"><i className="fa-brands fa-letterboxd" /></Link>
            </div>
          </div>

          <div>
            <h4>Navigate</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/explore">Explore Movies</Link></li>
              <li><Link to="/favorites">Favourites</Link></li>
            </ul>
          </div>

          <div>
            <h4>Browse genres</h4>
            <ul>
              {['Sci-Fi', 'Drama', 'Action', 'Crime', 'Animation'].map((genre) => (
                <li key={genre}><Link to="/404">{genre}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Now showing</h4>
            <div className="footer-showing">
              {movies.slice(0, 4).map((movie) => (
                <Link key={movie.id} to={`/explore#movie-${movie.id}`} className="footer-showing-item" aria-label={movie.title}>
                  <img src={movie.poster} alt={movie.title} loading="lazy" />
                  <span className="footer-showing-copy">
                    <strong>{movie.title}</strong>
                    <small>{movie.year} &middot; {movie.genre[0]}</small>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <ul className="footer-contact-list">
              <li>
                <i className="fa-solid fa-location-dot" />
                <span>MMR Complex, Chinna Thirupathi, near Chinna Muniyappan Kovil, Salem, Tamil Nadu 636008</span>
              </li>
              <li>
                <i className="fa-solid fa-envelope" />
                <Link to="/404">info@thestackly.com</Link>
              </li>
              <li>
                <i className="fa-solid fa-phone" />
                <Link to="/404">+91 9745673456</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; 2026 Stackly &bull; All Rights Reserved.</span>
          <div className="footer-legal">
            <Link to="/404">Privacy Policy</Link>
            <Link to="/404">Terms</Link>
            <Link to="/404">Cookies</Link>
          </div>
          <button type="button" className="footer-top" onClick={scrollTop} aria-label="Back to top">
            <i className="fa-solid fa-arrow-up" />
          </button>
        </div>
      </div>
    </footer>
  );
}
