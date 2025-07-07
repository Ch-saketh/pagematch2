import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";


const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);

  // Prevent multiple logging due to React.StrictMode
  const hasLogged = useRef(false);
  const logOnce = useRef({}); 

// ...

const loggedQueries = useRef(new Set());  // ✅ Keeps track of queries already logged


  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // ✅ Only log ONCE per query
        if (!logOnce.current[query]) {
          await axios.post("http://localhost:5000/log-search", {
            query,
            user_id: "guest",
          });
          logOnce.current[query] = true;
        }

        const res = await axios.get("http://localhost:5000/search", {
          params: { query },
        });

        const data = res.data.results.map((item, index) => ({
          id: index,
          title: item.title,
          authors: item.authors || ["Unknown"],
          rating: item.averageRating || "Not rated",
          description: item.description || "No description available.",
          thumbnail: item.thumbnail || "https://via.placeholder.com/200x250?text=No+Image",
        }));

        setResults(data);
      } catch (error) {
        console.error("Search failed:", error.message);
        setResults([]);
      }
      setLoading(false);
    };

    if (query.trim()) {
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  const closeModal = () => setSelectedBook(null);

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h1 className="text-3xl mb-6">Results for “{query}”</h1>

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {results.map((book) => (
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              style={{
                backgroundColor: "#222",
                padding: "1rem",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <img
                src={book.thumbnail}
                alt={book.title}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <h2 style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
                {book.title}
              </h2>
              <p style={{ color: "#ccc" }}>{book.authors.join(", ")}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedBook && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#111",
              color: "#fff",
              padding: "2rem",
              borderRadius: "12px",
              maxWidth: "600px",
              width: "90%",
              boxShadow: "0 0 10px rgba(255,255,255,0.2)",
              overflowY: "auto",
              maxHeight: "80vh",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                background: "#444",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                padding: "0.5rem 1rem",
                float: "right",
                cursor: "pointer",
              }}
            >
              Close
            </button>
            <img
              src={selectedBook.thumbnail}
              alt={selectedBook.title}
              style={{
                width: "150px",
                float: "left",
                marginRight: "1rem",
                borderRadius: "8px",
              }}
            />
            <div>
              <h2>{selectedBook.title}</h2>
              <p>
                <strong>Author(s):</strong> {selectedBook.authors.join(", ")}
              </p>
              <p>
                <strong>Rating:</strong> {selectedBook.rating}
              </p>
              <p style={{ marginTop: "1rem", color: "#ccc" }}>
                {selectedBook.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
