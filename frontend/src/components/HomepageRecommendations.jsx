import React, { useEffect, useState, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import { getEditorialCover } from '../utils/coverHelper';
import { recordBookClick } from '../utils/interactionTracker';
import '../styles/HomepageRecommendations.css';

const EditorialRow = ({ indexStr, title, items, onSelect }) => {
  const scrollRef = useRef(null);

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

  return (
    <div className="pm-row-wrapper">
      <div className="pm-row-header">
        <div className="pm-row-title-group">
          <span className="pm-row-meta-eyebrow">{indexStr} // SELECTION CLUSTER</span>
          <h2 className="pm-row-title">{title}</h2>
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
        {items.map((item, idx) => {
          const coverUrl = item.image_url || getEditorialCover(item.title, item.author);

          return (
            <article
              key={item.book_id || idx}
              className="pm-book-card"
              onClick={() => onSelect(item)}
              title={`Click to shift recommendations to "${item.title}"`}
            >
              <div className="pm-card-cover-wrap">
                <img
                  src={coverUrl}
                  alt={item.title}
                  className="pm-card-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = getEditorialCover(item.title, item.author);
                  }}
                />
                <span className="pm-card-badge">{item.type || 'MODEL'}</span>
              </div>

              <div className="pm-card-body">
                <h3 className="pm-card-title">{item.title}</h3>
                <div className="pm-card-meta-row">
                  <span className="pm-card-rating">★ {item.rating || '4.8'}</span>
                  <span style={{ color: 'var(--accent)', fontSize: '9px', fontWeight: 600 }}>[INFER →]</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

const HomepageRecommendations = () => {
  const navigate = useNavigate();
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/homepage-recommendations`);
        if (res.ok) {
          const data = await res.json();
          if (data.clusters && data.clusters.length > 0) {
            setClusters(data.clusters);
          }
        }
      } catch (err) {
        console.error("Failed to load homepage recommendations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  const handleSelectBook = (book) => {
    recordBookClick(book, 'cluster_select');
    const el = document.getElementById('because-you-clicked-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/search?q=${encodeURIComponent(book.title)}`);
    }
  };

  if (loading && clusters.length === 0) {
    return (
      <div className="pm-recs-container" style={{ padding: '2rem 0', opacity: 0.6 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          // QUERYING CS22/BOOK-ENGINE VECTOR CLUSTERS...
        </div>
      </div>
    );
  }

  return (
    <div className="pm-recs-container">
      {clusters.map((cluster, idx) => {
        const clusterItems = cluster.books.map((b) => ({
          book_id: b.id,
          title: b.title,
          author: b.authors?.[0] || 'Unknown Author',
          type: 'MODEL MATCH',
          rating: b.averageRating,
          description: b.description,
          image_url: b.thumbnail
        }));

        return (
          <EditorialRow
            key={idx}
            indexStr={`0${idx + 2}`}
            title={cluster.category}
            items={clusterItems}
            onSelect={handleSelectBook}
          />
        );
      })}
    </div>
  );
};

export default HomepageRecommendations;
