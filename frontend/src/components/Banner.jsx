import React from "react";
import "../styles/Banner.css";

const Banner = () => {
  return (
    <div className="banner">
      <div className="banner__content">
        <h1 className="banner__title">KIMETSU NO YAIBA</h1>
        <p className="banner__description">
          Tanjiro Kamado's peaceful life is shattered when his family is slaughtered by demons. 
          Now he must become a demon slayer to avenge them and save his sister Nezuko.
        </p>
        <div className="banner__buttons">
          <button className="banner__button banner__button--primary">
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Read Now
          </button>
          <button className="banner__button banner__button--secondary">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;