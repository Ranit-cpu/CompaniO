import React from 'react'
import "./Hero.css"
import heroImg from "../../assets/chat_robot.png"; 
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
   <section className="hero">
      <div className="hero-text">
        <h1>Your Virtual Companion</h1>
        <p>
          Chat, explore, and grow with your AI-powered friend. <br />
          Always there to listen, guide, and make your day brighter.
        </p>
        {/* <a href="#" className="btn">Get Started</a> */}
         <Link to="/NamePage" className="btn">
        Get Started
      </Link>
      </div>

      <div>
        <img
          src={heroImg}
          alt="Virtual Companion"
          className="hero-img"
        />
      </div>
    </section>
  )
}

export default Hero
