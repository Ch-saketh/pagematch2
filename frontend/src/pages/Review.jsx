import React, { useState, useRef, useEffect } from 'react';
import { 
  FaRegComment, FaRetweet, FaHeart, FaRegHeart, 
  FaBookmark, FaRegBookmark, FaShare, 
  FaEllipsisH, FaCheck, FaVideo, FaImage 
} from 'react-icons/fa';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import Navbar from '../components/Navbar';
import '../styles/Review.css';

const Review = () => {
  // State management
  const [reviews, setReviews] = useState([]);
  const [tweetText, setTweetText] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [characterCount, setCharacterCount] = useState(0);
  const [activeTab, setActiveTab] = useState('forYou');
  const [likedTweets, setLikedTweets] = useState(new Set());
  const [bookmarkedTweets, setBookmarkedTweets] = useState(new Set());
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Load sample data
  useEffect(() => {
    const sampleReviews = [
      {
        id: 1,
        username: 'BookCriticPro',
        handle: '@bookcritic',
        verified: true,
        bookTitle: 'The Midnight Library',
        caption: 'Just finished The Midnight Library by Matt Haig. A profound exploration of regret and the roads not taken. The concept of being able to try different versions of your life is executed brilliantly. #BookReview #MustRead',
        videoUrl: 'https://example.com/sample1.mp4',
        likes: 1242,
        comments: 328,
        retweets: 512,
        timestamp: '2h ago',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        views: '24.5K'
      },
      {
        id: 2,
        username: 'SciFiEnthusiast',
        handle: '@scifireader',
        verified: false,
        bookTitle: 'Project Hail Mary',
        caption: 'Andy Weir outdoes himself with Project Hail Mary. The scientific problem-solving is even more engaging than in The Martian, and the character development is superb. The audiobook version is particularly excellent. #SciFi #BookReview',
        videoUrl: 'https://example.com/sample2.mp4',
        likes: 3891,
        comments: 421,
        retweets: 1215,
        timestamp: '5h ago',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        views: '87.3K'
      }
    ];
    setReviews(sampleReviews);
  }, []);

  // Character counter
  useEffect(() => {
    setCharacterCount(tweetText.length);
  }, [tweetText]);

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type)) {
      setVideoFile(file);
      setPreviewVideo(URL.createObjectURL(file));
    } else {
      alert('Please upload a valid video file (MP4, WebM, or MOV)');
    }
  };

  // Submit new review
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tweetText || !bookTitle || characterCount > 280) return;

    const newReview = {
      id: reviews.length + 1,
      username: 'BookReviewPro',
      handle: '@bookpro',
      verified: true,
      bookTitle,
      caption: tweetText,
      videoUrl: previewVideo || null,
      likes: 0,
      comments: 0,
      retweets: 0,
      timestamp: 'Just now',
      avatar: 'https://randomuser.me/api/portraits/lego/5.jpg',
      views: '0'
    };

    setReviews([newReview, ...reviews]);
    setTweetText('');
    setBookTitle('');
    setVideoFile(null);
    setPreviewVideo(null);
    if (textareaRef.current) textareaRef.current.focus();
  };

  // Toggle like
  const toggleLike = (id) => {
    const newLikedTweets = new Set(likedTweets);
    if (newLikedTweets.has(id)) {
      newLikedTweets.delete(id);
    } else {
      newLikedTweets.add(id);
    }
    setLikedTweets(newLikedTweets);
  };

  // Toggle bookmark
  const toggleBookmark = (id) => {
    const newBookmarkedTweets = new Set(bookmarkedTweets);
    if (newBookmarkedTweets.has(id)) {
      newBookmarkedTweets.delete(id);
    } else {
      newBookmarkedTweets.add(id);
    }
    setBookmarkedTweets(newBookmarkedTweets);
  };

  // Format numbers
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  return (
    <div className="twitter-pro">
      <Navbar />
      
      <div className="twitter-pro-container">
        {/* Left Sidebar */}
        <div className="twitter-pro-sidebar">
          <div className="sidebar-logo">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="twitter-icon">
              <g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g>
            </svg>
          </div>
          <nav className="sidebar-nav">
            <a href="#" className="nav-item active">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
                <g><path d="M22.46 7.57L12.357 2.115c-.223-.12-.49-.12-.713 0L1.543 7.57c-.364.197-.5.652-.303 1.017.135.25.394.393.66.393.12 0 .243-.03.356-.09l.815-.44L4.7 19.963c.214 1.215 1.308 2.062 2.658 2.062h9.282c1.352 0 2.445-.848 2.663-2.087l1.626-11.49.818.442c.364.193.82.06 1.017-.304.196-.363.06-.818-.304-1.016zm-4.638 12.133c-.107.606-.703.822-1.18.822H7.36c-.48 0-1.075-.216-1.178-.798L4.48 7.69 12 3.628l7.522 4.06-1.7 12.015z"></path></g>
              </svg>
              <span>Home</span>
            </a>
            <a href="#" className="nav-item">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
                <g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g>
              </svg>
              <span>Explore</span>
            </a>
            <a href="#" className="nav-item">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
                <g><path d="M21.697 16.468c-.02-.016-2.14-1.64-2.103-6.03.02-2.532-.812-4.782-2.347-6.335C15.872 2.71 14.01 1.94 12.005 1.93h-.013c-2.004.01-3.866.78-5.242 2.174-1.534 1.553-2.368 3.802-2.346 6.334.037 4.33-2.02 5.967-2.102 6.03-.26.193-.366.53-.265.838.102.308.39.515.712.515h4.92c.102 2.31 1.997 4.16 4.33 4.16s4.226-1.85 4.327-4.16h4.922c.322 0 .61-.206.71-.514.103-.307-.003-.645-.263-.838zM12 20.478c-1.505 0-2.73-1.177-2.828-2.658h5.656c-.1 1.48-1.323 2.66-2.828 2.66zM4.38 16.32c.74-1.132 1.548-3.028 1.524-5.896-.018-2.16.644-3.982 1.913-5.267C8.91 4.05 10.397 3.437 12 3.43c1.603.008 3.087.62 4.18 1.728 1.27 1.285 1.933 3.106 1.915 5.267-.024 2.868.785 4.765 1.525 5.896H4.38z"></path></g>
              </svg>
              <span>Notifications</span>
            </a>
            <a href="#" className="nav-item">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
                <g><path d="M19.25 3.018H4.75C3.233 3.018 2 4.252 2 5.77v12.495c0 1.518 1.233 2.753 2.75 2.753h14.5c1.517 0 2.75-1.235 2.75-2.753V5.77c0-1.518-1.233-2.752-2.75-2.752zm-14.5 1.5h14.5c.69 0 1.25.56 1.25 1.25v.714l-8.05 5.367c-.273.18-.626.182-.9-.002L3.5 6.482v-.714c0-.69.56-1.25 1.25-1.25zm14.5 14.998H4.75c-.69 0-1.25-.56-1.25-1.25V8.24l7.24 4.83c.383.256.822.384 1.26.384.44 0 .877-.128 1.26-.383l7.24-4.83v10.022c0 .69-.56 1.25-1.25 1.25z"></path></g>
              </svg>
              <span>Messages</span>
            </a>
            <a href="#" className="nav-item">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
                <g><path d="M19.9 23.5c-.157 0-.312-.05-.442-.144L12 17.928l-7.458 5.43c-.228.164-.53.19-.782.06-.25-.127-.41-.385-.41-.667V5.6c0-1.24 1.01-2.25 2.25-2.25h12.798c1.24 0 2.25 1.01 2.25 2.25v17.15c0 .282-.158.54-.41.668-.106.055-.223.082-.34.082zM12 16.25c.155 0 .31.048.44.144l6.71 4.883V5.6c0-.412-.337-.75-.75-.75H5.6c-.413 0-.75.338-.75.75v15.677l6.71-4.883c.13-.096.285-.144.44-.144z"></path></g>
              </svg>
              <span>Bookmarks</span>
            </a>
            <a href="#" className="nav-item">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
                <g><path d="M12 11.816c1.355 0 2.872-.15 3.84-1.256.814-.93 1.078-2.368.806-4.392-.38-2.825-2.117-4.512-4.646-4.512S7.734 3.343 7.354 6.168c-.272 2.024-.008 3.46.806 4.39.968 1.107 2.485 1.258 3.84 1.258zM8.84 6.368c.162-1.2.787-3.212 3.16-3.212s2.998 2.013 3.16 3.212c.207 1.55.057 2.627-.45 3.205-.455.52-1.266.743-2.71.743s-2.255-.223-2.71-.743c-.507-.578-.657-1.656-.45-3.205zm11.44 12.868c-.877-3.526-4.282-5.99-8.28-5.99s-7.403 2.464-8.28 5.99c-.172.692-.028 1.4.395 1.94.408.52 1.04.82 1.733.82h12.304c.693 0 1.325-.3 1.733-.82.424-.54.567-1.247.394-1.94zm-1.576 1.016c-.126.16-.316.246-.552.246H5.848c-.235 0-.426-.085-.552-.246-.137-.174-.18-.412-.12-.654.71-2.855 3.517-4.85 6.824-4.85s6.114 1.994 6.824 4.85c.06.242.017.48-.12.654z"></path></g>
              </svg>
              <span>Profile</span>
            </a>
            <button className="tweet-button-sidebar">
              <span>Post</span>
            </button>
          </nav>
          <div className="user-profile">
            <img src="https://randomuser.me/api/portraits/lego/5.jpg" alt="Profile" />
            <div className="user-info">
              <span className="username">BookReviewPro</span>
              <span className="handle">@bookpro</span>
            </div>
            <div className="more-options">
              <FaEllipsisH />
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="twitter-pro-main">
          {/* Header */}
          <div className="main-header">
            <h1>Book Reviews</h1>
            <div className="header-tabs">
              <button 
                className={`tab ${activeTab === 'forYou' ? 'active' : ''}`}
                onClick={() => setActiveTab('forYou')}
              >
                For you
              </button>
              <button 
                className={`tab ${activeTab === 'following' ? 'active' : ''}`}
                onClick={() => setActiveTab('following')}
              >
                Following
              </button>
            </div>
          </div>
          
          {/* Tweet Composer */}
          <div className="tweet-composer-pro">
            <div className="composer-avatar">
              <img src="https://randomuser.me/api/portraits/lego/5.jpg" alt="You" />
            </div>
            <div className="composer-content">
              <input
                type="text"
                placeholder="Book Title"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                className="book-title-input"
              />
              <textarea
                ref={textareaRef}
                placeholder="Share your thoughts about this book..."
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
                rows="3"
                maxLength="280"
              />
              
              {previewVideo && (
                <div className="video-preview">
                  <video src={previewVideo} controls />
                  <button 
                    onClick={() => setPreviewVideo(null)}
                    className="remove-video"
                  >
                    ×
                  </button>
                </div>
              )}
              
              <div className="composer-actions">
                <div className="action-icons">
                  <label htmlFor="video-upload" className="icon-button">
                    <FaVideo />
                    <input
                      id="video-upload"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="video/mp4,video/webm,video/quicktime"
                      className="hidden"
                    />
                  </label>
                  <button className="icon-button">
                    <FaImage />
                  </button>
                </div>
                <div className="action-right">
                  {characterCount > 0 && (
                    <span className={`character-count ${characterCount > 260 ? 'warning' : ''} ${characterCount > 280 ? 'error' : ''}`}>
                      {280 - characterCount}
                    </span>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={!tweetText || !bookTitle || characterCount > 280}
                    className="tweet-button-pro"
                  >
                    Review
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Reviews Feed */}
          <div className="reviews-feed-pro">
            {reviews.map((review) => (
              <div key={review.id} className="review-tweet-pro">
                <div className="tweet-avatar">
                  <img src={review.avatar} alt={review.username} />
                </div>
                <div className="tweet-content">
                  <div className="tweet-header">
                    <div className="user-info">
                      <span className="tweet-username">{review.username}</span>
                      {review.verified && <RiVerifiedBadgeFill className="verified-badge" />}
                      <span className="tweet-handle">{review.handle}</span>
                      <span className="tweet-timestamp">· {review.timestamp}</span>
                    </div>
                    <button className="more-options">
                      <FaEllipsisH />
                    </button>
                  </div>
                  <div className="book-title">{review.bookTitle}</div>
                  <p className="tweet-text">{review.caption}</p>
                  
                  {review.videoUrl && (
                    <div className="tweet-video">
                      <video controls poster="https://via.placeholder.com/300x169?text=Book+Review">
                        <source src={review.videoUrl} type="video/mp4" />
                      </video>
                      <div className="video-views">{review.views} views</div>
                    </div>
                  )}
                  
                  <div className="tweet-actions">
                    <button className="action-btn">
                      <FaRegComment />
                      <span>{formatNumber(review.comments)}</span>
                    </button>
                    <button className="action-btn">
                      <FaRetweet />
                      <span>{formatNumber(review.retweets)}</span>
                    </button>
                    <button 
                      className={`action-btn ${likedTweets.has(review.id) ? 'liked' : ''}`}
                      onClick={() => toggleLike(review.id)}
                    >
                      {likedTweets.has(review.id) ? <FaHeart className="liked" /> : <FaRegHeart />}
                      <span>{formatNumber(review.likes + (likedTweets.has(review.id) ? 1 : 0))}</span>
                    </button>
                    <button 
                      className={`action-btn ${bookmarkedTweets.has(review.id) ? 'bookmarked' : ''}`}
                      onClick={() => toggleBookmark(review.id)}
                    >
                      {bookmarkedTweets.has(review.id) ? <FaBookmark className="bookmarked" /> : <FaRegBookmark />}
                    </button>
                    <button className="action-btn">
                      <FaShare />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="twitter-pro-right-sidebar">
          <div className="search-box">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="search-icon">
              <g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g>
            </svg>
            <input type="text" placeholder="Search Book Reviews" />
          </div>
          
          <div className="trending-books">
            <h2>What's happening</h2>
            <div className="trending-item">
              <div className="trending-meta">
                <span>Trending in Books</span>
                <button className="more-options">
                  <FaEllipsisH />
                </button>
              </div>
              <div className="trending-title">#MidnightLibrary</div>
              <div className="trending-count">24.5K reviews</div>
            </div>
            <div className="trending-item">
              <div className="trending-meta">
                <span>Trending in Books</span>
                <button className="more-options">
                  <FaEllipsisH />
                </button>
              </div>
              <div className="trending-title">Project Hail Mary</div>
              <div className="trending-count">18.3K reviews</div>
            </div>
            <div className="trending-item">
              <div className="trending-meta">
                <span>Literature · Trending</span>
                <button className="more-options">
                  <FaEllipsisH />
                </button>
              </div>
              <div className="trending-title">#BookTok</div>
              <div className="trending-count">152K reviews</div>
            </div>
            <a href="#" className="show-more">Show more</a>
          </div>
          
          <div className="who-to-follow">
            <h2>Who to follow</h2>
            <div className="follow-item">
              <img src="https://randomuser.me/api/portraits/women/63.jpg" alt="Profile" />
              <div className="follow-info">
                <div className="follow-name">
                  <span>Literary Hub</span>
                  <RiVerifiedBadgeFill className="verified-badge" />
                </div>
                <span className="follow-handle">@lithub</span>
              </div>
              <button className="follow-button">Follow</button>
            </div>
            <div className="follow-item">
              <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Profile" />
              <div className="follow-info">
                <div className="follow-name">
                  <span>Book Riot</span>
                  <RiVerifiedBadgeFill className="verified-badge" />
                </div>
                <span className="follow-handle">@BookRiot</span>
              </div>
              <button className="follow-button">Follow</button>
            </div>
            <div className="follow-item">
              <img src="https://randomuser.me/api/portraits/women/33.jpg" alt="Profile" />
              <div className="follow-info">
                <div className="follow-name">
                  <span>NYT Books</span>
                  <RiVerifiedBadgeFill className="verified-badge" />
                </div>
                <span className="follow-handle">@nytimesbooks</span>
              </div>
              <button className="follow-button">Follow</button>
            </div>
            <a href="#" className="show-more">Show more</a>
          </div>
          
          <div className="footer-links">
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Accessibility</a>
            <a href="#">Ads info</a>
            <a href="#">More</a>
            <span>© 2023 BookReviewPro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;