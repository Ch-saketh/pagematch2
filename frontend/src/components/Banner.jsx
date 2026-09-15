import React, { useEffect, useState } from "react";
import { FiArrowUpRight, FiBookOpen } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import { getEditorialCover } from "../utils/coverHelper";
import { recordBookClick } from "../utils/interactionTracker";
import "../styles/Banner.css";

const Banner = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/featured-book`);
        if (res.ok) {
          const data = await res.json();
          if (data.book) {
            setFeatured(data.book);
          }
        }
      } catch (e) {
        console.error("Failed to load featured book", e);
      }
    };
    fetchFeatured();
  }, []);

  const title = featured?.title || "Brave New World";
  const author = featured?.authors?.join(", ") || "Aldous Huxley";
  const category = featured?.categories?.join(" / ") || "Fiction / Dystopian";
  const rating = featured?.averageRating ? `★ ${featured.averageRating}` : "★ 4.5";
  const summary = featured?.description || "A masterwork of speculative fiction exploring social conditioning, technological dominance, and human identity in a structured society.";
  const coverUrl = featured?.thumbnail || getEditorialCover(title, author);

  const handleHeroExplore = () => {
    recordBookClick({
      title,
      authors: [author],
      thumbnail: coverUrl,
      categories: [category],
      averageRating: rating.replace('★ ', '')
    }, 'hero_explore');
    const el = document.getElementById('because-you-clicked-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/search?q=${encodeURIComponent(title)}`);
    }
  };

  return (
    <section className="pm-hero-section">
      <div className="grid-bg-overlay"></div>

      <div className="pm-hero-inner">
        {/* Left Column: Title, Metadata, Telemetry */}
        <div className="pm-hero-content">
          <div className="pm-hero-eyebrow">
            <span className="pm-hero-tag">MODEL FEATURED</span>
            <span className="pm-hero-index">// CS22/BOOK-ENGINE</span>
          </div>

          <h1 className="pm-hero-title">{title}</h1>

          <p className="pm-hero-summary">{summary}</p>

          {/* Technical Specs Grid */}
          <div className="pm-hero-specs">
            <div className="pm-spec-item">
              <span className="pm-spec-label">AUTHOR / CREATOR</span>
              <span className="pm-spec-val">{author}</span>
            </div>
            <div className="pm-spec-item">
              <span className="pm-spec-label">MODEL ARCHITECTURE</span>
              <span className="pm-spec-val">TF-IDF + Cosine Similarity</span>
            </div>
            <div className="pm-spec-item">
              <span className="pm-spec-label">GENRE CLASSIFICATION</span>
              <span className="pm-spec-val">{category}</span>
            </div>
            <div className="pm-spec-item">
              <span className="pm-spec-label">RATING RECEPTIVITY</span>
              <span className="pm-spec-val">{rating} / 5.0</span>
            </div>
          </div>

          <div className="pm-hero-actions">
            <button
              className="btn-editorial btn-editorial-primary"
              onClick={handleHeroExplore}
              title="Compute real-time recommendations for this masterpiece"
            >
              <span>EXPLORE RECOMMENDATIONS</span>
              <FiArrowUpRight />
            </button>
            <button
              className="btn-editorial"
              onClick={() => navigate('/books')}
            >
              <FiBookOpen />
              <span>EXPLORE BOOKS CATALOG</span>
            </button>
          </div>
        </div>

        {/* Right Column: Architectural Framed Cover */}
        <div className="pm-hero-visual" onClick={handleHeroExplore} style={{ cursor: 'pointer' }}>
          <div className="pm-hero-cover-frame">
            <img
              src={coverUrl}
              alt={title}
              onError={(e) => {
                e.target.src = getEditorialCover(title, author);
              }}
            />
            <div className="pm-cover-caption">
              <span className="pm-caption-meta">[CLICK TO INFER]</span>
              <span className="mono-tag">{rating}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;