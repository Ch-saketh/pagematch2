// src/components/SearchGrid.jsx
import React from "react";
import SearchResultCard from "./SearchResultCard";

const SearchGrid = ({ books }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {books.map((book) => (
        <SearchResultCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default SearchGrid;
