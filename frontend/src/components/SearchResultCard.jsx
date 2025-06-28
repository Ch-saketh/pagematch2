// src/components/SearchResultCard.jsx
import React from "react";
import { motion } from "framer-motion";

const SearchResultCard = ({ book }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer"
    >
      <img
        src={book.image_url}
        alt={book.title}
        className="w-full h-60 object-cover"
      />
      <div className="p-3">
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <p className="text-sm text-gray-400">{book.genre}</p>
      </div>
    </motion.div>
  );
};

export default SearchResultCard;
