import React from "react";
import "./About.css";
import robo2 from "../../assets/robo2.png";
import bubblemsg2 from "../../assets/bubblemsg2.png";

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      {/* Floating Bubble */}
      <img src={bubblemsg2} alt="Chat Bubble" className="floating-icon bubble" />

      {/* Floating Robot */}
      <img src={robo2} alt="Robot" className="floating-icon robot" />

      {/* About Content */}
      <div className="aboutus-content">
        <h1 className="about-title">About Companio</h1>
        <p className="about-text">
          Welcome to <span className="highlight">Companio</span>, your AI-powered
          virtual companion designed to bring connection, support and positivity
          into your daily life. Whether you’re looking for a friendly chat,
          motivation simply someone who listens, Companio is always here for
          you.  
        </p>
        <p className="about-text">
          Built with cutting-edge AI and a human touch, our mission is to create
          a companion that adapts to your mood, learns your preferences and
          makes every conversation meaningful. With glowing energy, creativity
          and empathy. Companio ensures you never feel alone in your journey.
        </p>
        <p className="about-text">
          Together, we’re shaping a future where technology connects hearts,
          supports minds and spreads positivity,one conversation at a time. 💙
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
