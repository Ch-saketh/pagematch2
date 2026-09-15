import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import BecauseYouClicked from "../components/BecauseYouClicked";
import HomepageRecommendations from "../components/HomepageRecommendations";  
import Footer from "../components/Footer";
import API_BASE_URL from "../config";
import { getEditorialCover } from "../utils/coverHelper";
import { recordBookClick } from "../utils/interactionTracker";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [pipeline, setPipeline] = useState([]);
  const [loadingPipeline, setLoadingPipeline] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('selectedProfile')) {
      localStorage.setItem('selectedProfile', 'user-default');
    }

    const fetchPipeline = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/reading-pipeline`);
        if (res.ok) {
          const data = await res.json();
          if (data.pipeline && data.pipeline.length > 0) {
            setPipeline(data.pipeline);
          }
        }
      } catch (err) {
        console.error("Failed to load reading pipeline", err);
      } finally {
        setLoadingPipeline(false);
      }
    };

    fetchPipeline();
  }, [navigate]);

  return (
    <div className="pm-page-container">
      <Navbar />

      <main className="pm-main-content">
        <Banner />

        {/* Real-Time "Because You Clicked / Explored" Section (Adapts on every click) */}
        <div id="because-you-clicked-section">
          <BecauseYouClicked />
        </div>

        {/* Continue Reading Shelf */}
        <section className="pm-featured-section">
          <div className="pm-section-header">
            <div className="pm-section-title-group">
              <span className="pm-section-eyebrow">02 // READING PIPELINE</span>
              <h2 className="pm-section-title">In Progress & Rapid Access</h2>
            </div>
            <span className="mono-tag font-mono">[ACTIVE SHELF]</span>
          </div>

          <div className="pm-trending-grid">
            {pipeline.map((item, idx) => {
              const author = item.authors?.[0] || 'Unknown Author';
              const rating = item.averageRating ? `★ ${item.averageRating}` : '★ 4.5';
              const coverSrc = item.thumbnail || getEditorialCover(item.title, author);

              return (
                <article 
                  className="pm-trending-card" 
                  key={item.id || idx}
                  onClick={() => {
                    recordBookClick(item, 'pipeline_shelf');
                    const el = document.getElementById('because-you-clicked-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  title={`Click to shift recommendations to "${item.title}"`}
                >
                  <div className="pm-trending-thumb-wrap">
                    <img
                      src={coverSrc}
                      alt={item.title}
                      className="pm-trending-thumb"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = getEditorialCover(item.title, author);
                      }}
                    />
                    <span className="pm-trending-tag">{item.categories?.[0] || "SHELF"}</span>
                    {idx === 0 && (
                      <div className="pm-progress-strip" style={{ width: `75%` }}></div>
                    )}
                    {idx === 1 && (
                      <div className="pm-progress-strip" style={{ width: `30%` }}></div>
                    )}
                  </div>

                  <div className="pm-trending-body">
                    <h3 className="pm-trending-title">{item.title}</h3>
                    <div className="pm-trending-meta">
                      <span>{author}</span>
                      <span>{rating}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Dynamic Categorized Carousels from ML Model */}
        <HomepageRecommendations />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
