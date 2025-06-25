import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={`navbar ${isScrolled ? "navbar-black" : "navbar-transparent"}`}>
      <div className="logo" onClick={() => navigate("/")}>
        <span className="logo-light">Page</span>
        <span className="logo-bold">Match</span>
      </div>

      <div className="navbar-icons">
        <img
          src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
          alt="Profile"
          className="navbar-icon"
          onClick={goToProfile}
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/1828/1828490.png"
          alt="Logout"
          className="navbar-icon"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Navbar;
