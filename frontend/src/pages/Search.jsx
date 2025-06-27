import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/SearchBar.css';

const SearchPage = () => {
  const [scroll, setScroll] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Get query from URL if coming from navbar search
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }

    const handleScroll = () => {
      setScroll(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const performSearch = (query) => {
    // Mock search results - replace with actual API call
    const mockResults = [
      { id: 1, title: 'Stranger Things', type: 'TV Show', image: 'https://via.placeholder.com/300x450', year: 2016 },
      { id: 2, title: 'The Witcher', type: 'TV Show', image: 'https://via.placeholder.com/300x450', year: 2019 },
      // Add more mock results
    ];
    setSearchResults(mockResults.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase())
    ));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  return (
    <div className="search-page">
      <Navbar scroll={scroll} />
      
      <div className="search-content">
        <h1>Search Page Break</h1>
        <form onSubmit={handleSearch} className="search-box">
          <input
            type="text"
            placeholder="Search for movies, TV shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button type="submit">Search</button>
        </form>
        
        {searchResults.length > 0 ? (
          <div className="search-results">
            <h2>Results for "{searchQuery}"</h2>
            <div className="results-grid">
              {searchResults.map(item => (
                <div key={item.id} className="result-item">
                  <img src={item.image} alt={item.title} />
                  <div className="result-info">
                    <h3>{item.title}</h3>
                    <p>{item.type} • {item.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : searchQuery ? (
          <div className="no-results">
            <h2>No results found for "{searchQuery}"</h2>
            <p>Try searching for something else</p>
          </div>
        ) : (
          <div className="search-suggestions">
            <h2>Popular Searches</h2>
            <div className="suggestions-grid">
              {['Action', 'Comedy', 'Horror', 'Romance', 'Sci-Fi', 'Documentaries'].map((genre, index) => (
                <div key={index} className="suggestion-card">
                  <h3>{genre}</h3>
                  <button onClick={() => setSearchQuery(genre)}>Explore</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;