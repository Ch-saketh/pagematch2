// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth listener...');
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('Auth state changed:', user);
      
      if (user) {
        // Force refresh to get latest emailVerified status
        await user.reload();
        const updatedUser = auth.currentUser;
        
        if (updatedUser.providerData[0]?.providerId === 'password' && !updatedUser.emailVerified) {
          console.log('Email not verified - forcing logout');
          await auth.signOut();
          setUser(null);
          alert('Please verify your email first');
        } else {
          console.log('User authenticated:', updatedUser.uid);
          setUser(updatedUser);
        }
      } else {
        console.log('No user detected');
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  if (loading) {
    console.log('Showing loading state');
    return <div>Loading...</div>;
  }

  console.log('Rendering routes, user:', user ? user.uid : 'null');
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            !user ? (
              <Login />
            ) : (
              <Navigate to="/home" replace state={{ from: '/' }} />
            )
          } 
        />
        <Route 
          path="/home" 
          element={
            user ? (
              <Home />
            ) : (
              <Navigate to="/" replace state={{ from: '/home' }} />
            )
          } 
        />
        <Route 
          path="/profile" 
          element={
            user ? (
              <Profile />
            ) : (
              <Navigate to="/" replace state={{ from: '/profile' }} />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;