import React, { useState, useEffect } from 'react';
import { FiPlay, FiPlus, FiChevronRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import '../styles/Manga.css';

const Manga = () => {
  const [featuredManga, setFeaturedManga] = useState(null);
  const [sections, setSections] = useState([]);

  // Dummy manga data - replace with API calls later
  useEffect(() => {
    // Featured manga (randomized selection)
    const featured = {
      id: 'manga-101',
      title: 'Demon Slayer: Kimetsu no Yaiba',
      description: 'Tanjiro Kamado, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon. To make matters worse, his younger sister Nezuko has been transformed into a demon herself.',
      bannerImage: 'https://wallpapercave.com/wp/wp8973826.jpg',
      genres: ['Action', 'Demons', 'Historical'],
      rating: 4.9,
      chapters: 205,
      status: 'Completed'
    };
    setFeaturedManga(featured);

    // Manga sections
    setSections([
      {
        title: '⭐ Trending Manga',
        data: [
          { id: 'manga-102', title: 'Jujutsu Kaisen', coverImage: 'https://wallpapercave.com/wp/wp10953682.jpg', genre: 'Supernatural', rating: 4.8 },
          { id: 'manga-103', title: 'Chainsaw Man', coverImage: 'https://wallpapercave.com/wp/wp8650334.jpg', genre: 'Action', rating: 4.7 },
          { id: 'manga-104', title: 'Spy x Family', coverImage: 'https://wallpapercave.com/wp/wp11159148.jpg', genre: 'Comedy', rating: 4.6 },
          { id: 'manga-105', title: 'One Piece', coverImage: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg', genre: 'Adventure', rating: 4.9 },
          { id: 'manga-106', title: 'Attack on Titan', coverImage: 'https://cdn.myanimelist.net/images/manga/2/37846.jpg', genre: 'Dark Fantasy', rating: 4.8 }
        ]
      },
      {
        title: '📚 Editor\'s Picks',
        data: [
          { id: 'manga-107', title: 'Berserk', coverImage: 'https://cdn.myanimelist.net/images/manga/1/157897.jpg', genre: 'Dark Fantasy', rating: 4.9 },
          { id: 'manga-108', title: 'Vinland Saga', coverImage: 'https://cdn.myanimelist.net/images/manga/2/188925.jpg', genre: 'Historical', rating: 4.8 },
          { id: 'manga-109', title: 'Monster', coverImage: 'https://wallpapercave.com/wp/wp3084750.jpg', genre: 'Psychological', rating: 4.9 }
        ]
      },
      {
        title: '🔥 Most Popular',
        data: [
          { id: 'manga-110', title: 'Death Note', coverImage: 'https://wallpapercave.com/wp/wp14132784.jpg', genre: 'Thriller', rating: 4.8 },
          { id: 'manga-111', title: 'Tokyo Ghoul', coverImage: 'https://wallpapercave.com/wp/wp8039243.jpg', genre: 'Horror', rating: 4.3 },
          { id: 'manga-112', title: 'My Hero Academia', coverImage: 'https://wallpapercave.com/wp/wp4983068.jpg', genre: 'Superhero', rating: 4.5 }
        ]
      },
      {
        title: '🎨 Top Art Style',
        data: [
          { id: 'manga-113', title: 'Vagabond', coverImage: 'https://cdn.myanimelist.net/images/manga/2/181787.jpg', genre: 'Historical', rating: 4.9 },
          { id: 'manga-114', title: 'Blame!', coverImage: 'https://cdn.myanimelist.net/images/manga/3/157897.jpg', genre: 'Cyberpunk', rating: 4.4 },
          { id: 'manga-115', title: 'One Punch Man', coverImage: 'https://cdn.myanimelist.net/images/manga/3/207244.jpg', genre: 'Action', rating: 4.6 }
        ]
      },
      {
        title: '🧠 Psychological Thrillers',
        data: [
          { id: 'manga-116', title: 'Oyasumi Punpun', coverImage: 'https://cdn.myanimelist.net/images/manga/5/163238.jpg', genre: 'Drama', rating: 4.8 },
          { id: 'manga-117', title: '20th Century Boys', coverImage: 'https://cdn.myanimelist.net/images/manga/3/54525.jpg', genre: 'Mystery', rating: 4.7 },
          { id: 'manga-118', title: 'Parasyte', coverImage: 'https://cdn.myanimelist.net/images/manga/1/145431.jpg', genre: 'Sci-Fi', rating: 4.4 }
        ]
      }
    ]);
  }, []);

  const handleReadNow = (mangaId) => {
    console.log(`Reading manga ${mangaId}`);
    // Navigate to reader page
  };

  const handleAddToList = (mangaId) => {
    console.log(`Added manga ${mangaId} to list`);
    // Add to user's list
  };

  if (!featuredManga) return <div className="loading">Loading...</div>;

  return (
    <div className="manga-page">
      {/* Integrated Navbar */}
      <Navbar />

      {/* Featured Manga Banner */}
      <div 
        className="featured-banner"
        style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%), url(${featuredManga.bannerImage})` }}
      >
        <div className="featured-content">
          <h1 className="featured-title">{featuredManga.title}</h1>
          <p className="featured-description">{featuredManga.description}</p>
          <div className="featured-meta">
            <span>{featuredManga.rating} ★</span>
            <span>{featuredManga.chapters} Chapters</span>
            <span>{featuredManga.status}</span>
          </div>
          <div className="featured-buttons">
            <button className="btn btn-primary" onClick={() => handleReadNow(featuredManga.id)}>
              <FiPlay /> Read Now
            </button>
            <button className="btn btn-secondary" onClick={() => handleAddToList(featuredManga.id)}>
              <FiPlus /> My Manga List
            </button>
          </div>
        </div>
      </div>

      {/* Manga Recommendation Rows */}
      <div className="manga-sections">
        {sections.map((section, index) => (
          <div key={index} className="section">
            <h2 className="section-title">{section.title}</h2>
            <div className="manga-row">
              {section.data.map((manga) => (
                <div key={manga.id} className="manga-card">
                  <div 
                    className="manga-cover"
                    style={{ backgroundImage: `url(${manga.coverImage})` }}
                  >
                    <div className="manga-hover-info">
                      <h3>{manga.title}</h3>
                      <p>{manga.genre} • {manga.rating} ★</p>
                      <div className="hover-buttons">
                        <button onClick={() => handleReadNow(manga.id)}>
                          <FiPlay /> Read
                        </button>
                        <button onClick={() => handleAddToList(manga.id)}>
                          <FiPlus /> List
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Manga;