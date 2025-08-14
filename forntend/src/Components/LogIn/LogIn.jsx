import React from 'react'
import "./LogIn.css";
import { Link } from 'react-router-dom';

const LogIn = () => {
  return (
    <div className="login-container">
      

      {/* Right side form */}
      <div className="login-form-container">
        <h2>Log In</h2>
        <p className="login-subtext">
          Don't have an account? <Link to="/signin">Sign up</Link>
          </p>

        <form className="login-form">
         
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Enter your password" />

          <label className="checkbox">
            <input type="checkbox" />
            I agree to the <a href="#">terms & conditions</a>
          </label>

          <button type="submit" className="create-account-btn">
            Log In
          </button>

          

          
        </form>
      </div>
    </div>
  )
}

export default LogIn
