import { useNavigate } from 'react-router-dom';
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import "../styles/Home.css";



const Home = () => {

  const navigate = useNavigate();
  
  // Add this effect to check for selected profile
  useEffect(() => {
    if (!localStorage.getItem('selectedProfile')) {
      navigate('/Profile');
    }
  }, [navigate]);
  const trendingContent = [
    { id: 1, title: "Demon Slayer", type: "M", progress: 35, image: "https://wallpapercave.com/wp/wp11053404.jpg" },
    { id: 2, title: "Jujutsu Kaisen", type: "N", progress: 0, image: "https://wallpapers.com/images/hd/gojo-satoru-skyscrapers-jujutsu-kaisen-iphone-2ok7ncrjsl54g5jk.jpg"},
    { id: 3, title: "Attack on Titan", type: "M", progress: 70, image: "https://cdn.wallpapersafari.com/0/42/2jGTiK.jpg" },
    { id: 4, title: "Death Note", type: "C", progress: 0, image: "https://wallpapercave.com/wp/wp7035224.jpg" },
    { id: 5, title: "Chainsaw Man", type: "H", progress: 15, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX598QzsoGxex1OMQNugCwZEv0XW9akDs3Rg&s" }
  ];

  return (
    <div className="page-container">
      {/* Navbar with fixed positioning */} 
      <Navbar />
      
      {/* Main content with proper spacing */}
      <main className="main-content">
        {/* Banner with margin to avoid navbar overlap */}
        <Banner />
        
        {/* Trending Now Section */}
        <section className="content-section">
          <h2 className="section-title">Trending Now</h2>
          <div className="card-grid">
            {trendingContent.map(item => (
              <div className="content-card" key={item.id}>
                <div className={`content-badge ${item.type === 'N' ? 'new' : 
                              item.type === 'C' ? 'classic' : 
                              item.type === 'H' ? 'hot' : 'manga'}`}>
                  {item.type}
                </div>
                {item.progress > 0 && (
                  <div className="progress-bar" style={{ width: `${item.progress}%` }}></div>
                )}
                <div 
                  className="card-image"
                  style={{ backgroundImage: `url(${item.image})` }}
                ></div>
                <h3 className="card-title">{item.title}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};



export default Home;