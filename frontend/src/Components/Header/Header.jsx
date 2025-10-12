import React, { useState, useEffect } from 'react';
import "./Header.css";
import SignIn from "../SignIn/SignIn.jsx";
import { Link } from 'react-router-dom';

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Mock auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("John Doe");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-container')) {
        setShowProfileDropdown(false);
      }
    };
    if (showProfileDropdown) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowProfileDropdown(false);
    console.log("User logged out");
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <>
      <header className="navbar">
        {/* Logo */}
        <div className="logo-container">
          <div className="logo">CompaniO</div>
          <p className="logo-tagline">Connection Beyond Words</p>
        </div>

        {/* Navigation */}
        <nav className="nav-links">
          <Link to="/" className="nav-btn">Home</Link>
          <Link to="/know-more" className="nav-btn">About Us</Link>
          <Link to="/about" className="nav-btn">Know More</Link>
        </nav>

        {/* Auth/Profile */}
        <div className="auth-buttons">
          {isLoggedIn ? (
            <div className="profile-container">
              <button className="profile-btn" onClick={toggleProfileDropdown}>
                <div className="profile-icon">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </button>

              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <span className="user-name">{userName}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn1" onClick={() => setShowSignIn(true)}>
              Sign Up / Log In
            </button>
          )}
        </div>
      </header>

      {/* Modal */}
      {showSignIn && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setShowSignIn(false)}
            >
              ✖
            </button>
            <SignIn />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

