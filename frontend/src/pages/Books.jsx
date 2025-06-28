import React from 'react';
import '../styles/Books.css';
import Navbar from '../components/Navbar';

const Books = () => {
  return (
    <>
      <Navbar />
      <div className="books-page">
        {/* Featured Book Banner */}
        <div 
          className="featured-banner"
          style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}
        >
          <div className="featured-content">
            <h1 className="featured-title">The Midnight Library</h1>
            <p className="featured-description">
              Between life and death there is a library, and within that library, the shelves go on forever. 
              Every book provides a chance to try another life you could have lived.
            </p>
            <div className="featured-meta">
              <span>4.8 ★</span>
              <span>2020</span>
              <span>Fiction</span>
            </div>
            <div className="featured-buttons">
              <button className="btn btn-primary">
                <i className="fas fa-book-open"></i> Read Now
              </button>
              <button className="btn btn-secondary">
                <i className="fas fa-info-circle"></i> More Info
              </button>
            </div>
          </div>
        </div>

        {/* Books Sections */}
        <div className="books-sections">
          {/* Trending Now Section */}
          <div className="section">
            <h2 className="section-title">Trending Now</h2>
            <div className="books-row">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div className="book-card" key={item}>
                  <div 
                    className="book-cover"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}
                  >
                    <div className="book-hover-info">
                      <h3>Book Title {item}</h3>
                      <p>Author Name</p>
                      <div className="hover-buttons">
                        <button>
                          <i className="fas fa-book-open"></i> Read
                        </button>
                        <button>
                          <i className="fas fa-plus"></i> List
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="book-info">
                    <h3>Book Title {item}</h3>
                    <p>4.{(item + 3)} ★</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Fiction Section */}
          <div className="section">
            <h2 className="section-title">Popular Fiction</h2>
            <div className="books-row">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div className="book-card" key={item}>
                  <div 
                    className="book-cover"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}
                  >
                    <div className="book-hover-info">
                      <h3>Fiction Book {item}</h3>
                      <p>Author Name</p>
                      <div className="hover-buttons">
                        <button>
                          <i className="fas fa-book-open"></i> Read
                        </button>
                        <button>
                          <i className="fas fa-plus"></i> List
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="book-info">
                    <h3>Fiction Book {item}</h3>
                    <p>4.{(item + 2)} ★</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Books;