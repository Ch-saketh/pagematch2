import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { FiMail, FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isNewUser) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        try {
          await sendEmailVerification(userCredential.user);
        } catch {
          // optional
        }
        
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name,
          email,
          joinedAt: serverTimestamp(),
        });

        localStorage.setItem("selectedProfileName", name || email.split("@")[0]);
        navigate("/profile", { replace: true });
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const updatedUser = userCredential.user;

        localStorage.setItem("selectedProfileName", updatedUser.displayName || email.split("@")[0]);
        navigate("/profile", { replace: true });
      }
    } catch (err) {
      console.warn("Auth note:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("Invalid email or password credentials.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Email already exists. Proceed to Sign In.");
      } else {
        setError(err.message || "Authentication attempt encountered an issue.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccess = () => {
    localStorage.setItem("selectedProfileName", "Saketh");
    if (!localStorage.getItem("selectedProfile")) {
      localStorage.setItem("selectedProfile", "user-default");
    }
    navigate("/home");
  };

  return (
    <div className="pm-login-page">
      <div className="grid-bg-overlay"></div>

      {/* Header */}
      <div className="pm-login-header">
        <div className="pm-login-brand-title">
          <span>PAGEMATCH</span>
          <span className="pm-login-brand-dot"></span>
        </div>
        <span className="pm-login-eyebrow font-mono">
          // REPOSITORY AUTHENTICATION GATEWAY
        </span>
      </div>

      {/* Editorial Card */}
      <div className="pm-login-card">
        <div className="pm-auth-tabs">
          <button
            type="button"
            className={`pm-auth-tab ${!isNewUser ? "pm-auth-tab--active" : ""}`}
            onClick={() => {
              setIsNewUser(false);
              setError("");
            }}
          >
            [ SIGN IN ]
          </button>
          <button
            type="button"
            className={`pm-auth-tab ${isNewUser ? "pm-auth-tab--active" : ""}`}
            onClick={() => {
              setIsNewUser(true);
              setError("");
            }}
          >
            [ REGISTER ]
          </button>
        </div>

        <h1 className="pm-login-title">
          {isNewUser ? "Create Account" : "Access Console"}
        </h1>
        <p className="pm-login-subtitle">
          {isNewUser
            ? "Initialize your reading preference vectors and dataset mapping."
            : "Sign in to synchronize your reading profile."}
        </p>

        {error && (
          <div className="pm-auth-error">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isNewUser && (
            <div className="pm-form-group">
              <label className="pm-form-label" htmlFor="pm-name">[OPERATOR_NAME]</label>
              <div className="pm-input-wrapper">
                <FiUser className="pm-input-icon" />
                <input
                  id="pm-name"
                  type="text"
                  className="pm-input-field"
                  placeholder="e.g. Saketh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="pm-form-group">
            <label className="pm-form-label" htmlFor="pm-email">[IDENTIFIER_EMAIL]</label>
            <div className="pm-input-wrapper">
              <FiMail className="pm-input-icon" />
              <input
                id="pm-email"
                type="email"
                className="pm-input-field"
                placeholder="operator@pagematch.internal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pm-form-group">
            <label className="pm-form-label" htmlFor="pm-password">[ACCESS_SECRET]</label>
            <div className="pm-input-wrapper">
              <FiLock className="pm-input-icon" />
              <input
                id="pm-password"
                type={showPassword ? "text" : "password"}
                className="pm-input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="pm-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="pm-auth-submit font-mono"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>AUTHENTICATING...</span>
            ) : (
              <>
                <span>{isNewUser ? "[ EXECUTE REGISTRATION ]" : "[ AUTHENTICATE SESSION ]"}</span>
                <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="pm-login-options">
          <label className="pm-remember-me font-mono">
            <input type="checkbox" defaultChecked />
            <span>PERSIST SESSION</span>
          </label>
          <span style={{ color: 'var(--text-muted)' }}>[SSL SECURE]</span>
        </div>

        <button
          type="button"
          className="pm-quick-guest-btn font-mono"
          onClick={handleDemoAccess}
        >
          [ BYPASS AUTH · EXPLORE DEMO INSTANCE → ]
        </button>
      </div>
    </div>
  );
};

export default Login;