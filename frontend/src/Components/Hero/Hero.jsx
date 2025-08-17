import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useNavigate } from "react-router-dom";
import robot from "../../assets/chat_robot.png";
import "./Hero.css";



const Hero = () => {
  const navigate = useNavigate();

  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const handleStart = () => navigate("/namepage");

  return (
    <div className="hero-container">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: true, zIndex: -1 },
          background: { color: "#0f0f2d" },
          particles: {
            number: { value: 25 },
            shape: {
              type: "char",
              character: [
                { value: "🤖" },
                { value: "⚙️" },
                { value: "🔧" },
                { value: "💡" }
              ]
            },
            color: { value: "#00f6ff" },
            opacity: { value: 0.8 },
            size: { value: 20, random: true },
            move: { enable: true, speed: 1, outModes: { default: "out" } }
          },
          detectRetina: true
        }}
      />

      <div className="hero-content">
        <h1 className="hero-title">Your Virtual Companion</h1>
        <p className="hero-tagline">Your trusted virtual friend, connecting hearts and minds every day.</p>
        <button className="get-started-btn" onClick={handleStart}>Get Started</button>
      </div>

      <div className="robot-wrapper">
        <img src={robot} alt="Robot" className="robot-img" />
        <div className="hello-bubble">👋 Hello!</div>
      </div>
    </div>
  );
};

export default Hero;
