import React, { Suspense, useEffect, useState } from "react";
import "./knowmore.css";
import robo2 from "../../assets/robo2.png";
import bubblemsg2 from "../../assets/bubblemsg2.png";

const AboutUs = () => {

    useEffect(() => {
      const starsContainer = document.querySelector(".hero-stars");
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
          Welcome to <span className="highlight">CompaniO</span>, your AI-powered
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
