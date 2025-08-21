import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NamePage.css";
import robo2 from "../../assets/robo2.png";
import bubblemsg2 from "../../assets/bubblemsg2.png";

const NamePage = () => {
  const [companionName, setCompanionName] = useState(""); // Changed to companionName
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  // Handle continue button click
  const handleContinue = () => {
    // Validate that both name and gender are selected
    if (!companionName.trim()) {
      alert("Please enter your companion's name");
      return;
    }

    if (!gender) {
      alert("Please select your companion's gender");
      return;
    }

    // Navigate to upload page with companion data
    navigate("/upload", {
      state: {
        companionName: companionName.trim(),
        companionGender: gender
      }
    });
  };

  return (
    <div className="namepage-container">
      {/* Floating Bubble Left */}
      <img src={bubblemsg2} alt="Chat Bubble" className="floating-icon bubble" />

      {/* Floating Robot Right */}
      <img src={robo2} alt="Robot" className="floating-icon robot" />

      {/* Center Input Section */}
      <div className="form-container">
        <h2 className="input-label">Enter Your Companion Name</h2>
        <input
          type="text"
          placeholder="Enter companion name"
          className="name-input"
          value={companionName}
          onChange={(e) => setCompanionName(e.target.value)}
        />

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

        <button className="continue-btn" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default NamePage;