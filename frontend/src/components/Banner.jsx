import React from "react";
import "../styles/Banner.css";

const Banner = () => {
  return (
    <header className="banner">
      <div className="banner-contents">
        <h1 className="banner-title">The Alchemist</h1>
        <p className="banner-desc">
          A fable about following your dream – a journey of a shepherd boy to discover a treasure.
        </p>
        <div className="banner-buttons">
          <button className="banner-btn">Read Now</button>
          <button className="banner-btn">More Info</button>
        </div>
      </div>
      <div className="banner-fadeBottom"></div>
    </header>
  );
};

export default Banner;
