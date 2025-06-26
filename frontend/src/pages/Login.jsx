import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isNewUser) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        alert('Verification email sent. Please verify before logging in.');
        
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name,
          email,
          joinedAt: serverTimestamp(),
        });
        
        setIsNewUser(false);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await userCredential.user.reload();
        const updatedUser = auth.currentUser;
        
        if (!updatedUser.emailVerified) {
          await sendEmailVerification(updatedUser);
          alert('Please verify your email first. New verification email sent.');
          await auth.signOut();
          return;
        }
        
        navigate('/home', { replace: true });
      }
    } catch (err) {
      const errorMap = {
        'auth/invalid-email': 'Please enter a valid email address',
        'auth/user-not-found': 'Email not found',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'Email already in use',
        'auth/too-many-requests': 'Too many attempts. Please try again later.'
      };
      setError(errorMap[err.code] || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay">
        <div className="login-header">
          <div className="logo">
            <span className="logo-text">PAGEMATCH</span>
          </div>
        </div>

        <div className="login-content">
          <div className="login-card">
            <h1 className="login-title">{isNewUser ? "Create Account" : "Sign In"}</h1>
            <p className="login-subtitle">
              {isNewUser ? "Start your reading journey" : "Continue your reading journey"}
            </p>
            
            <form className="login-form" onSubmit={handleSubmit}>
              {isNewUser && (
                <div className="input-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    className="login-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {error && <div className="error-message">
                <svg className="error-icon" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {error}
              </div>}
              
              <button 
                type="submit" 
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner"></span>
                ) : (
                  isNewUser ? "Sign Up" : "Sign In"
                )}
              </button>
            </form>

            <div className="login-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="need-help">Need help signing in?</a>
            </div>

            <div className="login-footer">
              <p className="auth-toggle">
                {isNewUser ? "Already have an account? " : "New to PageMatch? "}
                <button 
                  className="auth-toggle-button"
                  onClick={() => setIsNewUser(!isNewUser)}
                >
                  {isNewUser ? "Sign in" : "Create an account"}
                </button>
              </p>
              <p className="recaptcha-notice">
                This page is protected by Google reCAPTCHA to ensure you're not a bot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;