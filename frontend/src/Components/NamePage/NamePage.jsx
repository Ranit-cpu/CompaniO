import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NamePage.css";
import robo2 from "../../assets/pink.png";
import bubblemsg2 from "../../assets/ladyrob.png";

const NamePage = () => {
  const [companionName, setCompanionName] = useState("");
  const [gender, setGender] = useState("");
  const [moonSign, setMoonSign] = useState("");
  const [personalityTraits, setPersonalityTraits] = useState([]);
  const [customTrait, setCustomTrait] = useState("");
  const [showTraits, setShowTraits] = useState(false);

  const navigate = useNavigate();

  const availableTraits = [
    "Friendly", "Adventurous", "Creative", "Calm", "Energetic",
    "Romantic", "Intellectual", "Funny", "Caring", "Confident",
    "Mysterious", "Playful", "Wise", "Ambitious", "Loyal"
  ];

  const moonSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  // Star background
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

  const toggleTrait = (trait) => {
    setPersonalityTraits(prev =>
      prev.includes(trait)
        ? prev.filter(t => t !== trait)
        : [...prev, trait]
    );
  };

  const addCustomTrait = () => {
    if (customTrait.trim() && !personalityTraits.includes(customTrait.trim())) {
      setPersonalityTraits(prev => [...prev, customTrait.trim()]);
      setCustomTrait("");
    }
  };

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
        moonSign: moonSign,
        personalityTraits: personalityTraits,
      },
    });
  };

  return (
    <div className="namepage-container">
      <div className="stars"></div>

      <img src={bubblemsg2} alt="Chat Bubble" className="floating-icon bubble" />
      <img src={robo2} alt="Robot" className="floating-icon robot" />

      {/* Scrollable form box */}
      <div className="form-container">
        <h2 className="input-label">Create Your AI Companion</h2>

        <input
          type="text"
          placeholder="Enter companion name"
          className="name-input"
          value={companionName}
          onChange={(e) => setCompanionName(e.target.value)}
        />

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

        <button
          type="button"
          className="traits-toggle-btn"
          onClick={() => setShowTraits(!showTraits)}
        >
          {showTraits ? "Hide" : "Add"} Personality Traits (Optional) ✨
        </button>

        {showTraits && (
          <div className="traits-section">
            <div className="moon-sign-container">
              <label className="trait-label">Moon Sign (Optional):</label>
              <select
                className="moon-sign-select"
                value={moonSign}
                onChange={(e) => setMoonSign(e.target.value)}
              >
                <option value="">Select Moon Sign</option>
                {moonSigns.map(sign => (
                  <option key={sign} value={sign}>{sign}</option>
                ))}
              </select>
            </div>

            <div className="personality-container">
              <label className="trait-label">Personality Traits:</label>
              <div className="traits-grid">
                {availableTraits.map(trait => (
                  <button
                    key={trait}
                    type="button"
                    className={`trait-btn ${personalityTraits.includes(trait) ? 'selected' : ''}`}
                    onClick={() => toggleTrait(trait)}
                  >
                    {trait}
                  </button>
                ))}
              </div>

              <div className="custom-trait-container">
                <input
                  type="text"
                  placeholder="Add custom trait..."
                  className="custom-trait-input"
                  value={customTrait}
                  onChange={(e) => setCustomTrait(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomTrait()}
                />
                <button type="button" className="add-trait-btn" onClick={addCustomTrait}>
                  Add
                </button>
              </div>

              {personalityTraits.length > 0 && (
                <div className="selected-traits">
                  <p>Selected traits:</p>
                  <div className="selected-traits-list">
                    {personalityTraits.map(trait => (
                      <span key={trait} className="selected-trait">
                        {trait}
                        <button onClick={() => toggleTrait(trait)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <button className="continue-btn" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default NamePage;
