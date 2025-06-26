import React, { useState } from "react";
import "../styles/Search.css";
import mockBooks from "../utils/mockBooks";
import Header from "../components/Header"; // ✅ Add this
import SearchBar from "../components/SearchBar"; // ✅ Use this

const Search = () => {
  const [query, setQuery] = useState("");

  const allBooks = Object.values(mockBooks).flat();
  const filteredBooks = allBooks.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-page">
      <Header /> {/* ✅ Add */}
      <SearchBar query={query} setQuery={setQuery} /> {/* ✅ Add */}
      <div className="search-results">
        {filteredBooks.map((book, index) => (
          <div key={index} className="search-card">
            <img src={book.cover} alt={book.title} className="search-cover" />
            <div className="search-info">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;