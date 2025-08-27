import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NamePage.css";
import robo2 from "../../assets/pink.png";
import bubblemsg2 from "../../assets/ladyrob.png";

const NamePage = () => {
  const [companionName, setCompanionName] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  // ⭐ Star background effect
  useEffect(() => {
    const starsContainer = document.querySelector(".stars");
    if (!starsContainer) return;

    for (let i = 0; i < 150; i++) {
      const star = document.createElement("div");
      star.classList.add("star");

      const x0 = Math.random() * window.innerWidth;
      const y0 = Math.random() * window.innerHeight;
      const x1 = Math.random() * window.innerWidth;
      const y1 = Math.random() * window.innerHeight;

      star.style.setProperty("--x0", x0 + "px");
      star.style.setProperty("--y0", y0 + "px");
      star.style.setProperty("--x1", x1 + "px");
      star.style.setProperty("--y1", y1 + "px");

      star.style.animationDuration = 5 + Math.random() * 15 + "s";
      star.style.transform = `scale(${0.5 + Math.random() * 1.5})`;

      starsContainer.appendChild(star);
    }
  }, []);

  // Continue button logic
  const handleContinue = () => {
    if (!companionName.trim()) {
      alert("Please enter your companion's name");
      return;
    }
    if (!gender) {
      alert("Please select your companion's gender");
      return;
    }

    navigate("/upload", {
      state: {
        companionName: companionName.trim(),
        companionGender: gender,
      },
    });
  };

  return (
    <div className="namepage-container">
      {/* Stars background */}
      <div className="stars"></div>

      {/* Floating Images */}
      <img src={bubblemsg2} alt="Chat Bubble" className="floating-icon bubble" />
      <img src={robo2} alt="Robot" className="floating-icon robot" />

      {/* Form Section */}
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
            type="button"
            className={`gender-btn ${gender === "male" ? "active" : ""}`}
            onClick={() => setGender("male")}
          >
            👦 Male
          </button>
          <button
            type="button"
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
