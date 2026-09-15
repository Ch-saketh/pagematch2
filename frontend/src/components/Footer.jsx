import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowUp, FiExternalLink, FiGlobe, FiShield } from 'react-icons/fi';
import '../styles/Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="pm-footer">
      <div className="pm-footer__container">
        {/* Top Architectural Telemetry Bar */}
        <div className="pm-footer__top">
          <div className="pm-footer__brand-block">
            <div className="pm-footer__prompt font-mono" onClick={() => navigate('/home')}>
              <span className="prompt-host">pagematch@engine</span>
              <span className="prompt-colon"> : </span>
              <span className="prompt-path">~</span>
              <span className="prompt-cursor"> $ </span>
              <span className="prompt-cmd">status --telemetry</span>
            </div>
            <div className="pm-footer__status-badge font-mono">
              <span className="status-dot"></span>
              <span>ENGINE: NOMINAL</span>
              <span className="badge-sep">/</span>
              <span>WARP P@5: 0.1688</span>
              <span className="badge-sep">/</span>
              <span>LATENT DIM: 64</span>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="pm-footer__back-top font-mono"
            aria-label="Back to top"
          >
            <span>TOP</span>
            <FiArrowUp size={12} />
          </button>
        </div>

        {/* 4-Column Technical Hierarchy with Generous Spacing */}
        <div className="pm-footer__grid font-mono">
          {/* Column 1: System Catalog */}
          <div className="pm-footer__col">
            <h4 className="pm-footer__col-title">
              <span className="col-num">01 //</span>
              <span className="col-title-text">CATALOG</span>
            </h4>
            <ul className="pm-footer__list">
              <li>
                <button onClick={() => navigate('/home')} className="pm-footer__link">
                  Feed &amp; Pipelines
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/books')} className="pm-footer__link">
                  Books Archive
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/manga')} className="pm-footer__link">
                  Manga Vault
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/search')} className="pm-footer__link">
                  Semantic Search
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/profile')} className="pm-footer__link">
                  Operator Profiles
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Recommendation Engine Algorithms */}
          <div className="pm-footer__col">
            <h4 className="pm-footer__col-title">
              <span className="col-num">02 //</span>
              <span className="col-title-text">ALGORITHMS</span>
            </h4>
            <ul className="pm-footer__list">
              <li>
                <span className="pm-footer__static">LightFM Hybrid Matrix</span>
              </li>
              <li>
                <span className="pm-footer__static">WARP Loss Factorization</span>
              </li>
              <li>
                <span className="pm-footer__static">TF-IDF Vector Space</span>
              </li>
              <li>
                <span className="pm-footer__static">Cosine Similarity Rerank</span>
              </li>
              <li>
                <span className="pm-footer__static">Cold-Start Feature Fusion</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Engineering Stack */}
          <div className="pm-footer__col">
            <h4 className="pm-footer__col-title">
              <span className="col-num">03 //</span>
              <span className="col-title-text">STACK</span>
            </h4>
            <ul className="pm-footer__list">
              <li>
                <span className="pm-footer__static">React 18 &amp; Vite</span>
              </li>
              <li>
                <span className="pm-footer__static">Python 3.11 &amp; PyTorch</span>
              </li>
              <li>
                <span className="pm-footer__static">LightFM &amp; SciPy</span>
              </li>
              <li>
                <span className="pm-footer__static">MongoDB Atlas Cloud</span>
              </li>
              <li>
                <span className="pm-footer__static">JetBrains Mono &amp; Jakarta</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Architectural Attribution & Links */}
          <div className="pm-footer__col">
            <h4 className="pm-footer__col-title">
              <span className="col-num">04 //</span>
              <span className="col-title-text">OPERATOR</span>
            </h4>
            <ul className="pm-footer__list">
              <li>
                <a
                  href="https://huggingface.co/cs22/book-engine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pm-footer__link pm-footer__link--accent"
                >
                  <span>Model: cs22/book-engine</span>
                  <FiExternalLink size={11} />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/SakethChokkapu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pm-footer__link"
                >
                  <span>GitHub Repository</span>
                  <FiExternalLink size={11} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/saketh-chokkapu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pm-footer__link"
                >
                  <span>LinkedIn Profile</span>
                  <FiExternalLink size={11} />
                </a>
              </li>
              <li>
                <span className="pm-footer__static pm-footer__static--muted">
                  Lead: Saketh Chokkapu
                </span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('pagematch:open-compliance-modal'))}
                  className="pm-footer__link pm-footer__link--accent"
                  title="Read Fair Dealing & Indian Copyright Act (Sec 52) Notice"
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <FiShield size={11} />
                  <span>§ 52 Fair Dealing Notice</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Statutory Bar */}
        <div className="pm-footer__statutory-bar font-mono">
          <div className="statutory-content">
            <span className="statutory-badge">[STATUTORY FAIR DEALING NOTICE]</span>
            <span className="statutory-text">
              Engineered from scratch by Saketh Chokkapu. Operating strictly under <strong>Section 52(1)(a) of the Indian Copyright Act, 1957</strong> (Fair Dealing for private study, research, and review). Full-text copyrighted literary manuscripts or e-books are strictly not hosted or reproduced.
            </span>
          </div>
        </div>

        {/* Bottom Editorial Copyright & Locale */}
        <div className="pm-footer__bottom font-mono">
          <div className="pm-footer__copy">
            <span>&copy; {currentYear} PAGEMATCH.</span>
            <span className="copy-sep">&nbsp;&middot;&nbsp;</span>
            <span className="copy-sub">Architectural Book &amp; Manga Discovery System.</span>
          </div>

          <div className="pm-footer__meta">
            <span className="meta-locale">
              <FiGlobe size={12} />
              <span>Hyd, IN &middot; UTC+5:30</span>
            </span>
            <span className="meta-sep">&bull;</span>
            <span className="meta-status">SYS_STATUS: 200 OK</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
