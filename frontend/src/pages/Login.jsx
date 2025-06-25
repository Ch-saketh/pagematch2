// src/pages/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For new users only
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isNewUser) {
        // Sign up flow
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await sendEmailVerification(user);
        alert("Verification email sent. Please verify before logging in.");

        await setDoc(doc(db, "users", user.uid), {
          name,
          email,
          joinedAt: serverTimestamp(),
        });

        setIsNewUser(false); // Switch to login
      } else {
        // Sign in flow
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
          alert("Please verify your email before logging in.");
          return;
        }

        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userUID", user.uid);
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay">
        <div className="login-header">
          <div className="logo">
            <span className="logo-light">Page</span>
            <span className="logo-bold">Match</span>
          </div>
        </div>

        <div className="login-content">
          <h1 className="main-title">Unlimited Books, Reviews and More</h1>
          <h2 className="sub-title">Read anywhere. Cancel anytime.</h2>
          <p className="description">Enter your credentials to continue.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            {isNewUser && (
              <input
                type="text"
                placeholder="Full Name"
                className="email-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              className="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="email-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="get-started-button">
              {isNewUser ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <p className="toggle-auth">
            {isNewUser ? "Already have an account?" : "New here?"}
            <span
              onClick={() => setIsNewUser(!isNewUser)}
              style={{ color: "#00f", cursor: "pointer", marginLeft: "5px" }}
            >
              {isNewUser ? "Sign In" : "Create Account"}
            </span>
          </p>

          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
