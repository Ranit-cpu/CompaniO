
import React, { useState, useEffect } from 'react';
import "./Header.css";
import SignIn from "../SignIn/SignIn.jsx";
import { Link } from 'react-router-dom';

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // This should come from your auth context/state management
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Change this based on actual auth state
  const [userName, setUserName] = useState("John Doe"); // User's name from auth state

  // Close dropdown when clicking outside
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
    // Add your logout logic here
    setIsLoggedIn(false);
    setShowProfileDropdown(false);
    // Clear user data, tokens, etc.
    console.log("User logged out");
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <>
      <header className="navbar">
        <div className="logo-container">
  <div className="logo">CompaniO</div>
  <p className="logo-tagline">Connection Beyond Words</p>
</div>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/know more">Know More</Link>
        </nav>
        
        <div className="auth-buttons">
          {isLoggedIn ? (
            <div className="profile-container">
              <button 
                className="profile-btn"
                onClick={toggleProfileDropdown}
              >
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
                  <button 
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setShowSignIn(true)}>
              Sign Up/LogIn
            </button>
          )}
        </div>
      </header>

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