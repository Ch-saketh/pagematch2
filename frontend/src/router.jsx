import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Books from "./pages/Books";
import Manga from "./pages/Manga";
import Settings from "./pages/Settings";
import BookAssistant from "./pages/BookAssistant";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root path to login */}
        <Route path="/" element={<Navigate to="/login" />} />
      
        {/* Login page first */}
        <Route path="/login" element={<Login />} />
        
        {/* After login - Main pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/books" element={<Books />} />
        <Route path="/manga" element={<Manga />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/book-assistant" element={<BookAssistant />} />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;