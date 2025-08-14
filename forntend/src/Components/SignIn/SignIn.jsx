import React from 'react'
import "./SignIn.css";
import { Link } from 'react-router-dom';

const SignIn = () => {
  return (
     <div className="signin-container">
      

      {/* Right side form */}
      <div className="signin-form-container">
        <h2>Create an account</h2>
        <p className="signin-subtext">
          Already have an account? <Link to ="/login">Log in</Link>
        </p>

        <form className="signin-form">
          <div className="input-group">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
          </div>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Enter your password" />

          <label className="checkbox">
            <input type="checkbox" />
            I agree to the <a href="#">terms & conditions</a>
          </label>

          <button type="submit" className="create-account-btn">
            Create account
          </button>

          <div className="divider">
            <span>Or register with</span>
          </div>

          <div className="social-buttons">
            <button className="google-btn">Google</button>
            
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn
