// src/components/BecauseYouClicked.jsx - Dynamic Recommendations Based on Every Click/Like
import React, { useState, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight, FiZap, FiHeart, FiArrowRight, FiRotateCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import { getEditorialCover } from '../utils/coverHelper';
import {
  getLastClickedBook,
  getInteractionHistory,
  recordBookClick,
  toggleLikeBook,
  isBookLiked
} from '../utils/interactionTracker';
import '../styles/BecauseYouClicked.css';

const BecauseYouClicked = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [sourceBook, setSourceBook] = useState(getLastClickedBook());
  const [history, setHistory] = useState(getInteractionHistory());
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likedMap, setLikedMap] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Load recommendations whenever sourceBook changes
  useEffect(() => {
    let isMounted = true;
    const fetchSimilar = async () => {
      if (!sourceBook || !sourceBook.title) return;
      setLoading(true);
      setIsUpdating(true);
      try {
        const res = await fetch(`${API_BASE_URL}/similar-books?book=${encodeURIComponent(sourceBook.title)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.recommendations) {
            setRecommendations(data.recommendations);
          }
        }
      } catch (err) {
        console.error("Failed to query similar books", err);
      } finally {
        if (isMounted) {
          setLoading(false);
          setTimeout(() => setIsUpdating(false), 400);
        }
      }
    };

    fetchSimilar();
    return () => { isMounted = false; };
  }, [sourceBook?.title]);

  // Listen to global interaction events (every click across entire site)
  useEffect(() => {
    const handleInteraction = (e) => {
      if (e.detail?.book) {
        setSourceBook(e.detail.book);
        setHistory(getInteractionHistory());
      }
    };

    window.addEventListener('pagematch:interaction-changed', handleInteraction);
    return () => window.removeEventListener('pagematch:interaction-changed', handleInteraction);
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleBookClick = (book) => {
    // Record click -> triggers instant recalculation for this book!
    recordBookClick(book, 'click');
  };

  const handleLikeToggle = (e, book) => {
    e.stopPropagation();
    const isNowLiked = toggleLikeBook(book);
    setLikedMap(prev => ({ ...prev, [book.title]: isNowLiked }));
  };

  const handleQuickSwitch = (book) => {
    recordBookClick(book, 'history_select');
  };

  const author = sourceBook?.authors?.[0] || 'Author';
  const sourceCover = sourceBook?.thumbnail || getEditorialCover(sourceBook?.title || 'Book', author);

  return (
    <section className="pm-because-section">
      <div className="pm-section-header">
        <div className="pm-section-title-group">
          <div className="pm-inference-pill font-mono">
            <span className="inference-dot"></span>
            <span>REAL-TIME INFERENCE // WARP VECTOR ENGINE</span>
          </div>
          <h2 className="pm-section-title">
            Because You Explored <span className="pm-title-highlight">"{sourceBook.title}"</span>
          </h2>
          <p className="pm-section-subtitle">
            Cosine similarity matrix nearest-neighbors recalculated from your latest operator interaction.
          </p>
        </div>

        {/* Real-Time Model Status Badge */}
        <div className="pm-model-active-badge font-mono">
          <FiZap className="zap-icon" />
          <span>LIVE TF-IDF ADAPTATION</span>
        </div>
      </div>

      {/* Operator History Strip: Click any past book to immediately adapt recommendations */}
      {history.length > 1 && (
        <div className="pm-history-strip font-mono">
          <span className="pm-history-label">// RECENT EXPLORATIONS:</span>
          <div className="pm-history-chips">
            {history.map((h, i) => {
              const isActive = h.title?.toLowerCase() === sourceBook.title?.toLowerCase();
              return (
                <button
                  key={i}
                  className={`pm-history-chip ${isActive ? 'active' : ''}`}
                  onClick={() => handleQuickSwitch(h)}
                  title={`Shift recommendation vector to "${h.title}"`}
                >
                  <span>{h.title}</span>
                  {isActive && <span className="active-pip">●</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic Recommendation Layout */}
      <div className={`pm-dynamic-recs-layout ${isUpdating ? 'updating' : ''}`}>
        {/* Source Anchor Card */}
        <div className="pm-source-anchor-card">
          <div className="pm-anchor-cover-wrap">
            <img
              src={sourceCover}
              alt={sourceBook.title}
              onError={(e) => { e.target.src = getEditorialCover(sourceBook.title, author); }}
            />
            <span className="pm-anchor-badge font-mono">ACTIVE VECTOR</span>
          </div>
          <div className="pm-anchor-meta font-mono">
            <span className="pm-anchor-sub">// INPUT REFERENCE</span>
            <h4 className="pm-anchor-title">{sourceBook.title}</h4>
            <span className="pm-anchor-author">{author}</span>
            <button
              className="pm-anchor-like-btn"
              onClick={(e) => handleLikeToggle(e, sourceBook)}
            >
              <FiHeart fill={isBookLiked(sourceBook.title) ? '#ef4444' : 'none'} color={isBookLiked(sourceBook.title) ? '#ef4444' : 'var(--text-secondary)'} />
              <span>{isBookLiked(sourceBook.title) ? 'FAVORITED' : 'SAVE TO VAULT'}</span>
            </button>
          </div>
        </div>

        {/* Carousel of Real-Time Model Recommendations */}
        <div className="pm-recs-carousel-wrapper">
          <div className="pm-carousel-controls">
            <span className="pm-recs-count font-mono">
              {recommendations.length} MATCHED NEIGHBORS
            </span>
            <div className="pm-scroll-arrows">
              <button className="pm-scroll-btn" onClick={() => handleScroll('left')} aria-label="Scroll left">
                <FiChevronLeft />
              </button>
              <button className="pm-scroll-btn" onClick={() => handleScroll('right')} aria-label="Scroll right">
                <FiChevronRight />
              </button>
            </div>
          </div>

          <div className="pm-carousel-track" ref={scrollRef}>
            {loading ? (
              <div className="pm-recs-loading font-mono">
                <FiRotateCw className="spin-icon" />
                <span>INFERRING 6,511 COSINE NEIGHBORS...</span>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="pm-recs-empty font-mono">
                // NO HIGH-CONFIDENCE VECTORS FOUND FOR THIS ITEM
              </div>
            ) : (
              recommendations.map((rec, idx) => {
                const recAuthor = rec.authors?.[0] || 'Unknown Author';
                const recCover = rec.thumbnail || getEditorialCover(rec.title, recAuthor);
                const score = rec.similarityScore ? `SIM: ${rec.similarityScore}` : `RANK #${idx + 1}`;
                const isLiked = isBookLiked(rec.title) || likedMap[rec.title];

                return (
                  <article
                    key={rec.id || idx}
                    className="pm-rec-book-card"
                    onClick={() => handleBookClick(rec)}
                    title={`Click to shift recommendation model to "${rec.title}"`}
                  >
                    <div className="pm-card-cover-wrap">
                      <img
                        src={recCover}
                        alt={rec.title}
                        className="pm-card-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = getEditorialCover(rec.title, recAuthor);
                        }}
                      />
                      <span className="pm-card-badge font-mono">{score}</span>
                      
                      <button
                        className={`pm-card-heart-btn ${isLiked ? 'liked' : ''}`}
                        onClick={(e) => handleLikeToggle(e, rec)}
                        title="Favorite and add to profile vector"
                      >
                        <FiHeart fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : '#ffffff'} size={13} />
                      </button>
                    </div>

                    <div className="pm-card-body">
                      <h3 className="pm-card-title">{rec.title}</h3>
                      <p className="pm-card-author font-mono">{recAuthor}</p>
                      <div className="pm-card-meta-row font-mono">
                        <span className="pm-card-rating">★ {rec.averageRating || '4.8'}</span>
                        <span className="pm-shift-vector-tag">
                          ADAPT VECTOR →
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecauseYouClicked;
