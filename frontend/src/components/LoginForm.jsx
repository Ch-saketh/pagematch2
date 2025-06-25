import React from "react";
import "../styles/LoginForm.css"; // optional, for form-specific styles

const LoginForm = () => {
  return (
    <form className="login-form">
      <input
        type="email"
        placeholder="Email address"
        className="email-input"
      />
      <button type="submit" className="get-started-button">
        Get Started
      </button>
    </form>
  );
};

export default LoginForm;
