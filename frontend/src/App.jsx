import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Settings from './pages/Settings'; 
import Manga from './pages/Manga';
import Books from './pages/Books';
import Search from './pages/Search';
function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings/:id" element={<Settings />} />
        {/* Content Routes */}
        <Route path="/manga" element={<Manga />} />
        <Route path="/books" element={<Books />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;