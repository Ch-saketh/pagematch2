    import React from "react";
import "../styles/LoginForm.css";

const LoginForm = () => {
  return (
    <form className="login-form">
      <input type="email" placeholder="Email" className="login-input" />
      <input type="password" placeholder="Password" className="login-input" />
      <button type="submit" className="login-button">Sign In</button>
      <p className="login-text">
        New to BookFlix? <span className="signup-link">Sign up now.</span>
      </p>
    </form>
  );
};

export default LoginForm;
