import React, { useState } from 'react';
import "./SignIn.css";

export default function App() {
  // State to determine which form to display: true for Sign Up, false for Login
  const [isSignUpView, setIsSignUpView] = useState(true);
  // State to control the visibility of the entire form card
  const [isVisible, setIsVisible] = useState(true);

  // Function to switch between the sign-up and login views
  const toggleView = () => {
    setIsSignUpView(!isSignUpView);
  };

  // Function to hide the entire form card
  const handleClose = () => {
    setIsVisible(false);
  };

  // If the form is not visible, return null or an empty div.
  if (!isVisible) {
    return null;
  }

  return (
    <>
      
      <div className="page-container">
        {/* Background with robot image (using a placeholder for now) */}
        

        <div className="auth-card">
          
          {/* Cross button to close the form */}
          <button
            onClick={handleClose}
            className="close-btn"
            aria-label="Close form"
          >
            
          </button>

          {/* Header section with title and switch link */}
          <div className="header-section">
            <h1 className="header-title">
              {isSignUpView ? "Create an account" : "Welcome Back!"}
            </h1>
            <p className="header-subtitle">
              {isSignUpView ? (
                <span>
                  Already have an account? 
                  <span onClick={toggleView} className="link">
                    Log in
                  </span>
                </span>
              ) : (
                <span>
                  Don't have an account? 
                  <span onClick={toggleView} className="link">
                    Sign up
                  </span>
                </span>
              )}
            </p>
          </div>

          {/* Conditional rendering of the form based on state */}
          {isSignUpView ? (
            // Sign Up Form
            <form className="form-container">
              
              <input 
                type="email" 
                placeholder="Email" 
                className="input-field" 
              />
              <input 
                type="password" 
                placeholder="Enter your password" 
                className="input-field" 
              />
              <div className="checkbox-label">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">I agree to the <a href="#" className="link">terms & conditions</a></label>
              </div>
              <button type="submit" className="main-btn">
                Sign Up
              </button>
              
              
            </form>
          ) : (
            // Login Form
            <form className="form-container">
              <input 
                type="email" 
                placeholder="Email" 
                className="input-field" 
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="input-field" 
              />
              <div className="checkbox-label">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <button type="submit" className="main-btn">
                Log In
              </button>
              <p className="header-subtitle" style={{ textAlign: 'center', marginTop: '1rem' }}>
                <span className="link">
                  Forgot password?
                </span>
              </p>
            </form>
          )}

        </div>
      </div>
    </>
  );
}
