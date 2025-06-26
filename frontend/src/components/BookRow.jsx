import React from "react";
import "../styles/BookRow.css";

const BookRow = ({ title, books }) => {
  return (
    <div className="book-row">
      <h2 className="row-title">{title}</h2>
      <div className="book-row-container">
        {books.map((book, index) => (
          <div className="book-card" key={index}>
            <div className="book-card-inner">
              {book.badge && (
                <div className={`content-badge ${book.badge.toLowerCase()}`}>
                  {book.badge}
                </div>
              )}
              <img
                className="book-cover"
                src={book.cover}
                alt={book.title}
                loading="lazy"
              />
              <div className="book-overlay">
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                  <div className="book-rating">
                    <span className="rating-stars">
                      {'★'.repeat(Math.floor(book.rating))}
                      {'☆'.repeat(5 - Math.floor(book.rating))}
                    </span>
                    <span className="rating-value">{book.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="book-actions">
                  <button className="quick-action">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/>
                    </svg>
                  </button>
                  <button className="quick-action play">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path d="M8 5v14l11-7z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookRow;