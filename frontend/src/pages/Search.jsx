import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API_BASE_URL from "../config";
import { FiX, FiArrowUpRight, FiBookmark } from "react-icons/fi";
import { getEditorialCover } from "../utils/coverHelper";
import "../styles/Search.css";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [engineInfo, setEngineInfo] = useState("cs22/book-engine");
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const logOnce = useRef({});

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        if (query && !logOnce.current[query]) {
          try {
            await axios.post(`${API_BASE_URL}/log-search`, {
              query,
              user_id: localStorage.getItem("selectedProfileName") || "guest",
            });
            logOnce.current[query] = true;
          } catch {
            // optional
          }
        }

        const res = await axios.get(`${API_BASE_URL}/search`, {
          params: { query }
        });

        if (res.data.engine) {
          setEngineInfo(res.data.engine);
        }

        const rawResults = res.data.results || [];
        const data = rawResults.map((item, index) => ({
          id: item.id || index,
          title: item.title || "Untitled Record",
          authors: item.authors?.length ? item.authors : ["Unknown Author"],
          rating: item.averageRating ? `${item.averageRating}` : "4.8",
          description: item.description || "A notable record matched via hybrid metadata indexing.",
          thumbnail: item.thumbnail || getEditorialCover(item.title, item.authors?.[0]),
          similarityScore: item.similarityScore,
          matchType: item.matchType || "semantic",
          categories: item.categories || [],
          publishedYear: item.publishedYear || ""
        }));

        setResults(data);
      } catch (error) {
        // Fallback local results
        setResults([]);
      }
      setLoading(false);
    };

    if (query.trim()) {
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  const handleOpenBook = async (book) => {
    setSelectedBook(book);
    setLoadingSimilar(true);
    setSimilarBooks([]);
    try {
      const res = await axios.get(`${API_BASE_URL}/similar-books`, {
        params: { book: book.title }
      });
      if (res.data.recommendations) {
        setSimilarBooks(res.data.recommendations.slice(0, 4));
      }
    } catch {
      // ignore
    }
    setLoadingSimilar(false);
  };

  const closeModal = () => setSelectedBook(null);

  const filteredResults = results.filter((book) => {
    if (activeFilter === "rated") {
      return parseFloat(book.rating) >= 4.8;
    }
    return true;
  });

  return (
    <div className="pm-search-page">
      <Navbar />

      <div className="pm-search-container">
        <header className="pm-search-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="pm-search-eyebrow font-mono">// 01 · QUERY RESULTS</span>
            <span className="mono-tag-subtle font-mono" style={{ color: 'var(--accent)' }}>
              MODEL: {engineInfo.toUpperCase()}
            </span>
          </div>

          <div className="pm-search-title-row">
            <h1 className="pm-search-title">
              Query: <span className="pm-search-highlight font-mono">“{query || 'All Records'}”</span>
            </h1>
            <span className="pm-search-count font-mono">
              [MATCHED: {filteredResults.length} RECORD{filteredResults.length === 1 ? '' : 'S'}]
            </span>
          </div>

          <div className="pm-search-filters">
            <button
              className={`pm-filter-chip font-mono ${activeFilter === "all" ? "pm-filter-chip--active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              [ ALL MATCHES ]
            </button>
            <button
              className={`pm-filter-chip font-mono ${activeFilter === "rated" ? "pm-filter-chip--active" : ""}`}
              onClick={() => setActiveFilter("rated")}
            >
              [ RATED 4.5+ ]
            </button>
          </div>
        </header>

        {loading ? (
          <div className="pm-search-grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="pm-search-card" style={{ opacity: 0.4 }}>
                <div className="pm-search-card-img-wrapper" style={{ background: 'var(--surface-subtle)' }} />
                <div className="pm-search-card-info">
                  <div style={{ height: '14px', background: 'var(--surface-interactive)', borderRadius: '2px', marginBottom: '8px' }} />
                  <div style={{ height: '10px', background: 'var(--surface-interactive)', borderRadius: '2px', width: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredResults.length === 0 ? (
          <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p className="font-mono">[NO RECORDS MATCHED THE GIVEN QUERY STRING IN CS22/BOOK-ENGINE]</p>
          </div>
        ) : (
          <div className="pm-search-grid">
            {filteredResults.map((book) => (
              <article
                key={book.id}
                className="pm-search-card"
                onClick={() => handleOpenBook(book)}
              >
                <div className="pm-search-card-img-wrapper">
                  <img
                    src={book.thumbnail}
                    alt={book.title}
                    className="pm-search-card-img"
                    onError={(e) => {
                      e.target.src = getEditorialCover(book.title, book.authors?.[0]);
                    }}
                  />
                </div>

                <div className="pm-search-card-info">
                  <h2 className="pm-search-card-title">{book.title}</h2>
                  <p className="pm-search-card-author">{book.authors.join(", ")}</p>

                  <div className="pm-search-card-meta font-mono">
                    <span className="pm-search-rating">★ {book.rating}</span>
                    {book.similarityScore ? (
                      <span style={{ color: 'var(--accent)', fontSize: '11px' }}>
                        SIM: {book.similarityScore}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                        [{book.matchType.toUpperCase()}]
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="pm-modal-overlay" onClick={closeModal}>
          <div className="pm-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="pm-modal-close-btn" onClick={closeModal} title="Close">
              <FiX />
            </button>

            <div className="pm-modal-cover-col">
              <img
                src={selectedBook.thumbnail}
                alt={selectedBook.title}
                onError={(e) => { e.target.src = getEditorialCover(selectedBook.title, selectedBook.authors?.[0]); }}
              />
            </div>

            <div className="pm-modal-info-col">
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span className="mono-tag font-mono">
                  MODEL RECORD
                </span>
                <span className="mono-tag-subtle font-mono" style={{ color: 'var(--accent)' }}>
                  {selectedBook.matchType.toUpperCase()}
                </span>
                {selectedBook.similarityScore && (
                  <span className="mono-tag-subtle font-mono">
                    SIMILARITY: {selectedBook.similarityScore}
                  </span>
                )}
              </div>

              <h2 className="pm-modal-title">{selectedBook.title}</h2>
              <p className="pm-modal-author">BY {selectedBook.authors.join(", ").toUpperCase()}</p>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <span className="mono-tag font-mono">★ {selectedBook.rating} SCORE</span>
                {selectedBook.publishedYear && (
                  <span className="mono-tag-subtle font-mono">YEAR: {selectedBook.publishedYear}</span>
                )}
                <span className="mono-tag-subtle font-mono">DATASET: CS22 / 6.5K+ BOOKS</span>
              </div>

              <p className="pm-modal-desc">{selectedBook.description}</p>

              {/* Similar titles from model's pairwise matrix */}
              {similarBooks.length > 0 && (
                <div style={{ marginTop: '1rem', marginBottom: '1.25rem' }}>
                  <span className="font-mono field-label" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    PAIRWISE MODEL RECOMMENDATIONS:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {similarBooks.map((sim, sIdx) => (
                      <button
                        key={sIdx}
                        className="pm-filter-chip font-mono"
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                        onClick={() => handleOpenBook(sim)}
                      >
                        {sim.title} (★ {sim.averageRating})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pm-modal-actions font-mono">
                <button
                  className="btn-editorial btn-editorial-primary"
                  onClick={() => alert(`Opening volume "${selectedBook.title}"`)}
                >
                  <span>[ ACCESS VOLUME ]</span>
                  <FiArrowUpRight />
                </button>
                <button
                  className="btn-editorial"
                  onClick={() => alert(`Saved "${selectedBook.title}" to reading pipeline!`)}
                >
                  <FiBookmark />
                  <span>[ BOOKMARK ]</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
