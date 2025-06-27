import React from "react";
import { HashRouterRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile"; // ✅ Import the Profile page
import SearchBar from './pages/SearchBar';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root path to login */}
        <Route path="/" element={<Navigate to="/login" />} />
      
        {/* Login page first */}
        <Route path="/login" element={<Login />} />
        <Route path="/login" element={<Navigate to="/profile" replace />} />
        {/* After login */}
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SearchBar />} />
        <Route path="/profile" element={<Profile />} /> {/* ✅ Profile route added */}
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;