import React from "react";
import "../styles/BookRow.css";

const BookRow = ({ title, books }) => {
  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row-posters">
        {books.map((book, index) => (
          <img key={index} className="row-poster" src={book.cover} alt={book.title} />
        ))}
      </div>
    </div>
  );
};

export default BookRow;
