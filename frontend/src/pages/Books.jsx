import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import { getEditorialCover } from '../utils/coverHelper';
import '../styles/Books.css';
import '../styles/HomepageRecommendations.css';

const BooksRow = ({ collection, onSelect }) => {
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
          <span className="pm-row-meta-eyebrow">{collection.indexStr} // CATEGORY INDEX</span>
          <h2 className="pm-row-title">{collection.title}</h2>
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
        {collection.books.map((book) => {
          const author = book.authors?.[0] || 'Unknown Author';
          const coverUrl = book.thumbnail || getEditorialCover(book.title, author);

          return (
            <article
              key={book.id}
              className="pm-book-card"
              onClick={() => onSelect(book)}
            >
              <div className="pm-card-cover-wrap">
                <img
                  src={coverUrl}
                  alt={book.title}
                  className="pm-card-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = getEditorialCover(book.title, author);
                  }}
                />
                <span className="pm-card-badge">{book.categories?.[0] || 'BOOK'}</span>
              </div>

              <div className="pm-card-body">
                <h3 className="pm-card-title">{book.title}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
                  {author}
                </p>
                <div className="pm-card-meta-row">
                  <span className="pm-card-rating">★ {book.averageRating || '4.5'}</span>
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

const Books = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/catalog/books`);
        if (res.ok) {
          const data = await res.json();
          if (data.collections && data.collections.length > 0) {
            setCollections(data.collections);
          }
        }
      } catch (err) {
        console.error("Failed to load books catalog", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleBookSelect = (book) => {
    navigate(`/search?q=${encodeURIComponent(book.title)}`);
  };

  return (
    <div className="pm-books-page">
      <Navbar />

      <section className="pm-books-hero">
        <div className="pm-books-hero-content">
          <span className="mono-tag font-mono" style={{ marginBottom: '1rem' }}>
            // 01 · CURATED SELECTION
          </span>
          <h1 className="pm-hero-title">Literature & Analytical Works</h1>
          <p className="pm-hero-summary">
            Explorations across speculative fiction, systems thinking, and human psychology. Indexed directly from the cs22/book-engine ML model repository.
          </p>
        </div>
      </section>

      <section className="pm-books-sections">
        {loading && collections.length === 0 ? (
          <div style={{ padding: '3rem var(--container-pad)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            // QUERYING CS22/BOOK-ENGINE CATALOG...
          </div>
        ) : (
          collections.map((col, idx) => (
            <BooksRow key={idx} collection={col} onSelect={handleBookSelect} />
          ))
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Books;