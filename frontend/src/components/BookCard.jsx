import React from "react";
import "../styles/BookRow.css";
import mockBooks from "../utils/mockBooks";
import BookCard from "./BookCard"; // ✅ import BookCard

const BookRow = ({ title, fetchKey }) => {
  const books = mockBooks[fetchKey] || [];

  return (
    <div className="book-row">
      <h2 className="row-title">{title}</h2>
      <div className="book-slider">
        {books.map((book, index) => (
          <BookCard
            key={index}
            title={book.title}
            author={book.author}
            cover={book.cover}
          />
        ))}
      </div>
    </div>
  );
};

export default BookRow;
