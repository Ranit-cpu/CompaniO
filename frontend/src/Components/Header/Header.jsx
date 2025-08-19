import React,{ useState } from 'react'
import "./Header.css"; 
import SignIn from "../SignIn/SignIn.jsx";
import { Link } from 'react-router-dom'; 


const Header = () => {
    const [showSignIn, setShowSignIn] = useState(false);
    const [showLogIn, setShowLogIn] = useState(false);

  return (
    <>
   <header className="navbar">
      <div className="logo">CompaniO</div>
      {/* <nav className="nav-links">
        <a href="#">Home</a>
        <a href="#">About Us</a>
        <a href="#">Know More</a>
      </nav> */}
       <nav className="nav-links">
          <Link to="/">Home</Link>        {/* ✅ Goes to Home page */}
          <Link to="/about">About Us</Link> {/* (you can add this route later) */}
          <Link to="/know more">Know More</Link> {/* ✅ Goes to Upload page */}
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
