import React, { useEffect, useState, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE_URL from '../config';
import { getEditorialCover } from '../utils/coverHelper';
import '../styles/Manga.css';
import '../styles/HomepageRecommendations.css';

const MangaRow = ({ section, onSelect }) => {
  const scrollRef = useRef(null);

  const handleScroll = (dir) => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: dir === 'left' ? scrollRef.current.scrollLeft - amount : scrollRef.current.scrollLeft + amount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="pm-row-wrapper">
      <div className="pm-row-header">
        <div className="pm-row-title-group">
          <span className="pm-row-meta-eyebrow">{section.indexStr} // GRAPHIC & ILLUSTRATED INDEX</span>
          <h2 className="pm-row-title">{section.title}</h2>
        </div>
        <div className="pm-row-controls">
          <button className="pm-scroll-btn" onClick={() => handleScroll('left')} aria-label="Scroll left">
            <FiChevronLeft />
          </button>
          <button className="pm-scroll-btn" onClick={() => handleScroll('right')} aria-label="Scroll right">
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div className="pm-carousel-track" ref={scrollRef}>
        {section.items.map((manga) => {
          const author = manga.authors?.[0] || 'Unknown Author';
          const coverUrl = manga.thumbnail || getEditorialCover(manga.title, author);

          return (
            <article
              key={manga.id}
              className="pm-book-card"
              onClick={() => onSelect(manga)}
            >
              <div className="pm-card-cover-wrap">
                <img
                  src={coverUrl}
                  alt={manga.title}
                  className="pm-card-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = getEditorialCover(manga.title, author);
                  }}
                />
                <span className="pm-card-badge">{manga.categories?.[0] || 'COMICS'}</span>
              </div>

              <div className="pm-card-body">
                <h3 className="pm-card-title">{manga.title}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
                  {author}
                </p>
                <div className="pm-card-meta-row">
                  <span className="pm-card-rating">★ {manga.averageRating || '4.8'}</span>
                  <span>[RECORD →]</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

const Manga = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/catalog/manga`);
        if (res.ok) {
          const data = await res.json();
          if (data.sections && data.sections.length > 0) {
            setSections(data.sections);
          }
        }
      } catch (err) {
        console.error("Failed to load manga catalog", err);
      } finally {
        setLoading(false);
      }
    };
    fetchManga();
  }, []);

  const handleSelect = (manga) => {
    navigate(`/search?q=${encodeURIComponent(manga.title)}`);
  };

  return (
    <div className="pm-manga-page">
      <Navbar />

      <section className="pm-manga-hero">
        <div className="pm-manga-hero-content">
          <span className="mono-tag font-mono" style={{ marginBottom: '1rem' }}>
            // 01 · GRAPHIC & ILLUSTRATED
          </span>
          <h1 className="pm-hero-title">Serialized Works & Graphic Serials</h1>
          <p className="pm-hero-summary">
            Curated archive of visual narratives, indexed directly from the cs22/book-engine ML model repository.
          </p>
        </div>
      </section>

      <section className="pm-manga-sections">
        {loading && sections.length === 0 ? (
          <div style={{ padding: '3rem var(--container-pad)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            // QUERYING CS22/BOOK-ENGINE GRAPHIC NOVEL CATALOG...
          </div>
        ) : (
          sections.map((sec, idx) => (
            <MangaRow key={idx} section={sec} onSelect={handleSelect} />
          ))
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Manga;