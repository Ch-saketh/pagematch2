import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiX, FiMenu, FiUser, FiTerminal } from "react-icons/fi";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileName, setProfileName] = useState("Reader");
  const [profileAvatar, setProfileAvatar] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    try {
      const storedProfiles = JSON.parse(localStorage.getItem("profiles")) || [];
      const selectedId = localStorage.getItem("selectedProfile");
      const active = storedProfiles.find((p) => p.id === selectedId);
      if (active) {
        setProfileName(active.name || "Reader");
        if (!active.avatar || active.avatar.includes("unsplash.com") || active.avatar.includes("// ARCH") || active.avatar.includes("data:image/svg+xml")) {
          const cleanAvatar = '/avatars/avatar-1.svg';
          active.avatar = cleanAvatar;
          localStorage.setItem("profiles", JSON.stringify(storedProfiles));
          setProfileAvatar(cleanAvatar);
        } else {
          setProfileAvatar(active.avatar);
        }
      } else {
        setProfileName(localStorage.getItem("selectedProfileName") || "Reader");
      }
    } catch {
      // ignore
    }
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
    }
  };

  return (
    <header className={`pm-navbar ${scrolled ? "pm-navbar--scrolled" : ""}`}>
      <div className="pm-navbar__inner">
        {/* Left: Brand & Telemetry */}
        <div className="pm-navbar__left" onClick={() => navigate("/home")}>
          <div className="pm-navbar__brand">
            <span className="pm-brand-title">PAGEMATCH</span>
            <span className="pm-brand-dot"></span>
          </div>
          <div className="pm-brand-telemetry font-mono">
            <span>ENGINE: HYBRID</span>
            <span className="telemetry-separator">/</span>
            <span className="telemetry-highlight">WARP P@5: 0.1688</span>
          </div>
        </div>

        {/* Center: Monospace Navigation Links */}
        <nav className="pm-navbar__nav font-mono">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `pm-nav-link ${isActive ? "pm-nav-link--active" : ""}`
            }
          >
            <span className="nav-index">01</span>
            <span>FEED</span>
          </NavLink>
          <NavLink
            to="/books"
            className={({ isActive }) =>
              `pm-nav-link ${isActive ? "pm-nav-link--active" : ""}`
            }
          >
            <span className="nav-index">02</span>
            <span>BOOKS</span>
          </NavLink>
          <NavLink
            to="/manga"
            className={({ isActive }) =>
              `pm-nav-link ${isActive ? "pm-nav-link--active" : ""}`
            }
          >
            <span className="nav-index">03</span>
            <span>MANGA</span>
          </NavLink>
        </nav>

        {/* Right Actions: Search + Profile Monospace Tag */}
        <div className="pm-navbar__actions">
          {/* Architectural Search Bar */}
          <div className={`pm-search-wrap ${showSearch ? "pm-search-wrap--open" : ""}`}>
            <form onSubmit={handleSearchSubmit} className="pm-search-form">
              <FiSearch className="pm-search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog or author..."
                className="pm-search-input font-mono"
                autoFocus={showSearch}
              />
              <span className="pm-search-hint font-mono">[↵]</span>
              {searchQuery && (
                <button
                  type="button"
                  className="pm-search-clear"
                  onClick={() => setSearchQuery("")}
                >
                  <FiX />
                </button>
              )}
            </form>
            <button
              type="button"
              className="pm-search-trigger font-mono"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Toggle Search"
            >
              <FiSearch />
              <span className="pm-key-shortcut">/</span>
            </button>
          </div>

          {/* Minimalist Profile Button */}
          <button
            className="pm-profile-pill font-mono"
            onClick={() => navigate("/profile")}
            title="Manage profile"
          >
            {profileAvatar ? (
              <img src={profileAvatar} alt="" className="pm-profile-thumb" />
            ) : (
              <div className="pm-profile-thumb-fallback">
                <FiUser />
              </div>
            )}
            <span className="pm-profile-name">{profileName}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="pm-mobile-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="pm-mobile-nav font-mono">
          <NavLink to="/home" className="pm-mobile-item" onClick={() => setMobileMenuOpen(false)}>
            <span className="nav-index">01</span> FEED
          </NavLink>
          <NavLink to="/books" className="pm-mobile-item" onClick={() => setMobileMenuOpen(false)}>
            <span className="nav-index">02</span> BOOKS
          </NavLink>
          <NavLink to="/manga" className="pm-mobile-item" onClick={() => setMobileMenuOpen(false)}>
            <span className="nav-index">03</span> MANGA
          </NavLink>
          <NavLink to="/profile" className="pm-mobile-item" onClick={() => setMobileMenuOpen(false)}>
            <span className="nav-index">04</span> PROFILE [{profileName}]
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Navbar;
