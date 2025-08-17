import React, { useState } from "react";
import "./NamePage.css";
import robo2 from "../../assets/robo2.png";
import bubblemsg2 from "../../assets/bubblemsg2.png";

const NamePage = () => {
  const [gender, setGender] = useState("");

  return (
    <div className="namepage-container">
      {/* Floating Bubble Left */}
      <img src={bubblemsg2} alt="Chat Bubble" className="floating-icon bubble" />

      {/* Floating Robot Right */}
      <img src={robo2} alt="Robot" className="floating-icon robot" />

      {/* Center Input Section */}
      <div className="form-container">
        <h2 className="input-label">Enter Your Name</h2>
        <input type="text" placeholder="Enter" className="name-input" />

        {/* Gender Selection */}
        <div className="gender-container">
          <button 
            className={`gender-btn ${gender === "male" ? "active" : ""}`} 
            onClick={() => setGender("male")}
          >
            👦 Male
          </button>
          <button 
            className={`gender-btn ${gender === "female" ? "active" : ""}`} 
            onClick={() => setGender("female")}
          >
            👧 Female
          </button>
        </div>

        <button className="continue-btn">Continue</button>
      </div>
    </div>
  );
};

export default NamePage;
