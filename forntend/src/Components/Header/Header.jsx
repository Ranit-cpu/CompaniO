import React,{ useState } from 'react'
import "./Header.css"; 
import SignIn from "../SignIn/SignIn.jsx";
import LogIn from "../LogIn/LogIn.jsx";

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
        {/* // <a href="#">Sign In</a> */}
        <button  onClick={() => setShowSignIn(true)}>Sign In</button>
        <button  onClick={() => setShowLogIn(true)}>Log In</button>
        {/* <a href="#">Login</a> */}
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

      {showLogIn && (
        <div className="modal-overlayL">
          <div className="modal-contentL">
            <button
              className="close-btnL"
              onClick={() => setShowLogIn(false)}
            >
              ✖
            </button>
            <LogIn />
          </div>
        </div>
      )}
  </>
  )
}

export default Header
