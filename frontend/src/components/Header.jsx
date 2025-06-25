import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="main-header">
      <h1 className="header-logo">BookFlix</h1>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/login">Logout</Link>
      </nav>
    </header>
  );
};

export default Header;