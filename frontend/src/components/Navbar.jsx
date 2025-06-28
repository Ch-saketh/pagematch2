import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";


const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <div className="navbar__logo">
          <span className="logo-page">Page</span>
          <span className="logo-match">Match</span>
          <span className="navbar__badge">NEW</span>
        </div>

        {/* Navigation Links */}
        <div className="navbar__links">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `navbar__link ${isActive ? "navbar__link--active" : ""}`
            }
          >
          </NavLink>
          <NavLink to="/manga" className="navbar__link">Manga</NavLink>
          <NavLink to="/books" className="navbar__link">Books</NavLink>
          <NavLink to="/reviews" className="navbar__link">Reviews</NavLink> {/* Fixed: Changed from /movies to /reviews */}
        </div>

        {/* Right Section: Search + Profile */}
        <div className="navbar__right">
          {/* Search Input (always rendered, toggled with class) */}
          <div className={`navbar__search ${showSearch ? "navbar__search--active" : ""}`}>
            <form onSubmit={handleSearchSubmit}>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anime, manga or books" 
                className="navbar__search-input"
              />
            </form>
            <button 
              className="navbar__search-button" 
              aria-label="Search"
              onClick={() => {
                setShowSearch(!showSearch);
                if (showSearch && searchQuery.trim()) {
                  navigate(`/search?q=${searchQuery}`);
                  setSearchQuery("");
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path 
                  d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 
                  0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 
                  6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 
                  5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 
                  4.25c.41.41 1.08.41 1.49 0 
                  .41-.41.41-1.08 0-1.49L15.5 14zm-6 
                  0C7.01 14 5 11.99 5 9.5S7.01 5 
                  9.5 5 14 7.01 14 9.5 11.99 
                  14 9.5 14z" 
                  fill="currentColor" 
                />
              </svg>
            </button>
          </div>

          {/* Profile */}
          <div className="profile-container">
            <button 
              className="profile-button" 
              onClick={() => navigate('/profile')}
            >
              <img 
                src="https://pngfre.com/wp-content/uploads/1000113207.png" 
                alt="Profile" 
                className="profile-pic" 
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;