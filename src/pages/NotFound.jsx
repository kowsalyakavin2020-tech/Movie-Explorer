import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  return (
    <div className="err-page">
      <div className="err-grid" aria-hidden="true" />
      <div className="err-glow" aria-hidden="true" />
      <a href="/" className="brand err-brand" aria-label="Stackly home">
        <span className="brand-mark"><img src="/images/logo-red.png" alt="Stackly" width="91" height="28" /></span>
      </a>
      <main className="err-main">
        <div className="err-code-wrap">
          <span className="err-orbit err-orbit-a" aria-hidden="true" />
          <span className="err-orbit err-orbit-b" aria-hidden="true" />
          <span className="err-code" data-text="404" aria-label="404">404</span>
        </div>
        <div className="err-copy">
          <span className="err-kicker"><i className="fa-solid fa-film" /> Scene not found</span>
          <h1>This page left the frame.</h1>
          <p>The scene you followed isn&apos;t on this reel. The cinema is still open, so pick a path and keep watching.</p>
          <div className="err-actions">
            <Link to="/" className="btn btn-red">
              <i className="fa-solid fa-house" /> Back to Home
            </Link>
            <button type="button" className="btn btn-ghost" onClick={goBack}>
              <i className="fa-solid fa-arrow-left" /> Go Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
