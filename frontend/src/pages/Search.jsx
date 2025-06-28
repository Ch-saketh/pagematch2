import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const dummyData = [
    {
      id: 1,
      title: "Harry Potter",
      genre: "Fantasy",
      image_url: "https://m.media-amazon.com/images/I/81YOuOGFCJL.jpg",
    },
    {
      id: 2,
      title: "Percy Jackson",
      genre: "Adventure",
      image_url: "https://m.media-amazon.com/images/I/91N3wP1Ww3L.jpg",
    },
  ];

  useEffect(() => {
  setLoading(true);

  setTimeout(() => {
    if (query.toLowerCase() === "nothing") {
      setResults([]);
    } else {
      setResults(dummyData);
    }
    setLoading(false);
  }, 1000);
}, [query]);


  return (
    <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", padding: "2rem" }}>
      <h1 className="text-3xl mb-6">Results for “{query}”</h1>

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
          {results.map((book) => (
            <div key={book.id} style={{ backgroundColor: "#222", padding: "1rem", borderRadius: "8px" }}>
              <img src={book.image_url} alt={book.title} style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "8px" }} />
              <h2 style={{ marginTop: "1rem", fontSize: "1.1rem" }}>{book.title}</h2>
              <p style={{ color: "#ccc" }}>{book.genre}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
