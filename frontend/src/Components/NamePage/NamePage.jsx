// import React, { useState } from "react";
// import "./NamePage.css";
// import robo2 from "../../assets/robo2.png";
// import bubblemsg2 from "../../assets/bubblemsg2.png";

// const NamePage = () => {
//   const [gender, setGender] = useState("");

//   return (
//     <div className="namepage-container">
//       {/* Floating Bubble Left */}
//       <img src={bubblemsg2} alt="Chat Bubble" className="floating-icon bubble" />

//       {/* Floating Robot Right */}
//       <img src={robo2} alt="Robot" className="floating-icon robot" />

//       {/* Center Input Section */}
//       <div className="form-container">
//         <h2 className="input-label">Enter Your Name</h2>
//         <input type="text" placeholder="Enter" className="name-input" />

//         {/* Gender Selection */}
//         <div className="gender-container">
//           <button 
//             className={`gender-btn ${gender === "male" ? "active" : ""}`} 
//             onClick={() => setGender("male")}
//           >
//             👦 Male
//           </button>
//           <button 
//             className={`gender-btn ${gender === "female" ? "active" : ""}`} 
//             onClick={() => setGender("female")}
//           >
//             👧 Female
//           </button>
//         </div>

//         <button className="continue-btn">Continue</button>
//       </div>
//     </div>
//   );
// };

// export default NamePage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./NamePage.css";
import robo2 from "../../assets/robo2.png";
import bubblemsg2 from "../../assets/bubblemsg2.png";

const NamePage = () => {
  const [name, setName] = useState(""); // Add state for name
  const [gender, setGender] = useState("");
  const navigate = useNavigate(); // Initialize navigate hook

  // Handle continue button click
  const handleContinue = () => {
    // Validate that both name and gender are selected
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    
    if (!gender) {
      alert("Please select your gender");
      return;
    }

    // You can pass the user data to the next page if needed
    // Option 1: Navigate with state
    navigate("/upload", { 
      state: { 
        userName: name, 
        userGender: gender 
      } 
    });

    // Option 2: Just navigate to upload page
    // navigate("/upload");
  };

  return (
    <div className="namepage-container">
      {/* Floating Bubble Left */}
      <img src={bubblemsg2} alt="Chat Bubble" className="floating-icon bubble" />

      {/* Floating Robot Right */}
      <img src={robo2} alt="Robot" className="floating-icon robot" />

      {/* Center Input Section */}
      <div className="form-container">
        <h2 className="input-label">Enter Your Name</h2>
        <input 
          type="text" 
          placeholder="Enter" 
          className="name-input" 
          value={name}
          onChange={(e) => setName(e.target.value)}
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