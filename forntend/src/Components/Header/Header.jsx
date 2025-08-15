import React,{ useState } from 'react'
import "./Header.css"; 
import SignIn from "../SignIn/SignIn.jsx";


const Header = () => {
    const [showSignIn, setShowSignIn] = useState(false);
    const [showLogIn, setShowLogIn] = useState(false);

  return (
    <>
   <header className="navbar">
      <div className="logo">CompaniO</div>
      <nav className="nav-links">
        <a href="#">Home</a>
        <a href="#">About Us</a>
        <a href="#">Know More</a>
      </nav>
      <div className="auth-buttons">
        
        <button  onClick={() => setShowSignIn(true)}>Sign Up/LogIn</button>
        
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
  )
}

export default Header
