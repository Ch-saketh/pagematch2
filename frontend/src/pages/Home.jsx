import React from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import BookRow from "../components/BookRow";
import "../styles/Home.css"; // ✅ Ensure this contains .homepage styles

const dummyBooks = Array(10).fill().map((_, i) => ({
  title: `Book ${i + 1}`,
  cover: "https://via.placeholder.com/150x220?text=Book",
}));

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="homepage"> {/* ✅ This margin keeps content below navbar */}
        <Banner />
        <BookRow title="🔥 Trending Books" books={dummyBooks} />
        <BookRow title="⭐ Top Picks" books={dummyBooks} />
        <BookRow title="📚 Continue Reading" books={dummyBooks} />
        <BookRow title="🆕 New Arrivals" books={dummyBooks} />
      </div>
    </>
  );
};

export default Home;
