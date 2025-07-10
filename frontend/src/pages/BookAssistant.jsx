import React, { useState, useEffect, useRef } from 'react';
import Navbar from "../components/Navbar";
import '../styles/BookAssistant.css';
import { FaPlus, FaMicrophone, FaBars, FaPaperPlane } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

const BookAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [persistentHistory, setPersistentHistory] = useState([]);
  const chatBoxRef = useRef(null);

  const API_BASE_URL = "https://n4sglb3w-5000.inc1.devtunnels.ms";

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const loadPersistentHistory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/history`);
        const data = await res.json();
        setPersistentHistory(data);
      } catch (err) {
        console.error("History load failed:", err);
        setPersistentHistory([{ query: "Error loading history.", answer: "", timestamp: null, isError: true }]);
      }
    };
    loadPersistentHistory();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { from: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/gemini-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage })
      });

      const data = await res.json();
      const botReply = data.reply || "Sorry, I didn’t get that.";
      setMessages(prev => [...prev, { from: 'bot', text: botReply }]);

      const historyRes = await fetch(`${API_BASE_URL}/api/history`);
      if (historyRes.ok) {
        const updatedHistory = await historyRes.json();
        setPersistentHistory(updatedHistory);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessages(prev => [...prev, { from: 'bot', text: 'Server error. Try again later.' }]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setLoading(false);
    setSidebarOpen(false);
  };

  const handleHistoryItemClick = (item) => {
    setMessages([
      { from: 'user', text: item.query },
      { from: 'bot', text: item.answer }
    ]);
    setSidebarOpen(false);
    setInput('');
  };

  const isImageUrl = (text) => typeof text === 'string' && (
    text.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || (text.startsWith("http") && text.includes("images"))
  );

  return (
    <div className="main-container">
      <Navbar />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header"><h2>Search History</h2></div>
        <ul className="search-history">
          {persistentHistory.length ? (
            persistentHistory.map((item, index) => {
              const key = `${item.timestamp}-${index}`;
              return (
                <li key={key}
                    title={`Query: ${item.query}\nAnswer: ${item.answer}\nDate: ${item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Unknown'}`}
                    onClick={() => handleHistoryItemClick(item)}
                >
                  {item.query?.substring(0, 30)}{item.query?.length > 30 ? '...' : ''}
                </li>
              );
            })
          ) : (
            <li className="no-history">No history available</li>
          )}
        </ul>
        <button className="new-chat-button" onClick={handleNewChat}><FaPlus /> New Chat</button>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <div className="assistant-container">
        <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}><FaBars /></button>

        {!messages.length && !loading && (
          <div className="center-welcome">
            <h1 className="gradient-text">Hello, Reader</h1>
          </div>
        )}

        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble ${msg.from}`}>
              <span className="avatar">{msg.from === 'bot' ? '🤖' : '🧑‍💻'}</span>
              {isImageUrl(msg.text) ? (
                <img src={msg.text} alt="Visual" className="chat-image" />
              ) : (
                <ReactMarkdown
  children={msg.text}
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeHighlight]}
  components={{
    img: ({ node, ...props }) => (
      <img {...props} className="chat-image" />
    )
  }}
/>

              )}
            </div>
          ))}
          {loading && <div className="chat-bubble bot typing">...</div>}
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Ask anything about books, topics, etc."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()}><FaPaperPlane /></button>
          <button className="mic-button" disabled={loading}><FaMicrophone /></button>
        </div>
      </div>
    </div>
  );
};

export default BookAssistant;
