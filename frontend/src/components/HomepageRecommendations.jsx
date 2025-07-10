import React, { useEffect, useState } from 'react';
import '../styles/HomepageRecommendations.css';

const HomepageRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await fetch("https://n4sglb3w-5000.inc1.devtunnels.ms/homepage-recommendations");
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      } catch (error) {
        console.error("Failed to fetch homepage recs:", error);
      }
    };
    fetchRecs();
  }, []);

  const sections = {
    Trending: recommendations.slice(0, 6),
    Manga: recommendations.filter((b) => b.type === 'Manga'),
    Books: recommendations.filter((b) => b.type === 'Book')
  };

  return (
    <div className="homepage-recommendations">
      {Object.entries(sections).map(([sectionTitle, items]) => (
        <div key={sectionTitle} className="rec-section">
          <h2 className="section-title">
            {sectionTitle === 'Trending' ? 'Picked for You' : sectionTitle}
          </h2>
          <div className="rec-row">
            {items.map((book) => (
              <div key={book.book_id} className="rec-card">
                <div
                  className="rec-image"
                  style={{ backgroundImage: `url(${book.image_url})` }}
                />
                <div className="rec-info">
                  <h3>{book.title}</h3>
                  <p>{book.rating} ⭐</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomepageRecommendations;
