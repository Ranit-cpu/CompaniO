
import React, { useState } from 'react';
import "./SignIn.css";

export default function App() {
  const [isSignUpView, setIsSignUpView] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  // States for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const toggleView = () => {
    setIsSignUpView(!isSignUpView);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  // Main function to handle Sign Up / Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const url = isSignUpView
        ? "http://localhost:8000/auth/signup" // Change to your backend signup endpoint
        : "http://localhost:8000/auth/login"; // Change to your backend login endpoint

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Handle success
      setSuccessMsg(isSignUpView ? "Account created successfully!" : "Logged in successfully!");

      if (!isSignUpView && data.token) {
        // Save token to localStorage for authentication
        localStorage.setItem("token", data.token);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="page-container">
      <div className="auth-card">
       

        <div className="header-section">
          <h1 className="header-title">
            {isSignUpView ? "Create an account" : "Welcome Back!"}
          </h1>
          <p className="header-subtitle">
            {isSignUpView ? (
              <span>Already have an account? <span onClick={toggleView} className="link">Log in</span></span>
            ) : (
              <span>Don't have an account? <span onClick={toggleView} className="link">Sign up</span></span>
            )}
          </p>
        </div>

        {errorMsg && <p className="error-message">{errorMsg}</p>}
        {successMsg && <p className="success-message">{successMsg}</p>}

        <form className="form-container" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={isSignUpView ? "Enter your password" : "Password"}
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isSignUpView && (
            <div className="checkbox-label">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <a href="#" className="link">terms & conditions</a>
              </label>
            </div>
          )}

          {!isSignUpView && (
            <div className="checkbox-label">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
          )}

          <button type="submit" className="main-btn" disabled={loading}>
            {loading ? "Processing..." : isSignUpView ? "Sign Up" : "Log In"}
          </button>

          {!isSignUpView && (
            <p className="header-subtitle" style={{ textAlign: 'center', marginTop: '1rem' }}>
              <span className="link">Forgot password?</span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

