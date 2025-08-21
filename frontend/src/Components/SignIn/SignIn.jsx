import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./SignIn.css";

export default function SignInComponent({ onAuthSuccess, onClose }) {
  const [isSignUpView, setIsSignUpView] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const toggleView = () => {
    setIsSignUpView(!isSignUpView);
    setErrorMsg("");
    setSuccessMsg("");
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const url = isSignUpView
        ? "http://127.0.0.1:8000/auth/signup"
        : "http://127.0.0.1:8000/auth/login";

      const requestBody = isSignUpView
        ? { name, email, password }
        : { email, password };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      if (data.token) {
        // store user info
        if (data.user?.name) {
          localStorage.setItem("userName", data.user.name);
        }
        if (data.user?.email) {
          localStorage.setItem("userEmail", data.user.email);
        }
        localStorage.setItem("token", data.token);

        // notify parent if needed
        if (onAuthSuccess) {
          onAuthSuccess(data.token);
        }
        navigate("/namepage");
      } else if (isSignUpView) {
        // signup success but no token
        setSuccessMsg("Account created! Please log in.");
        setTimeout(() => {
          setIsSignUpView(false);
        }, 1000);
      } else {
        throw new Error("Login successful but no token received");
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="auth-card">
        {/* Close button */}
        <button
          className="close-btn"
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>

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
          {isSignUpView && (
            <input
              type="text"
              placeholder="Full Name"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

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
