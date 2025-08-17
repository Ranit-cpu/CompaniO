import React, { useEffect, useRef } from 'react';
import './NamePage.css';

import brainIcon from '../../assets/brain.png';
import chatIcon from '../../assets/chat.png';
import robotIcon from '../../assets/robot.png';
import heartIcon from '../../assets/heart.png';
import pinBackground from '../../assets/pin.webp';
// import { Link } from 'react-router-dom';

const NamePage = () => {
  const bgRef = useRef(null);
  const inputRef = useRef(null);
  const placeholderText = "Enter your name";
  let index = 0;

  useEffect(() => {
    const typePlaceholder = () => {
      if (inputRef.current) {
        inputRef.current.setAttribute("placeholder", placeholderText.substring(0, index));
        index++;
        if (index <= placeholderText.length) {
          setTimeout(typePlaceholder, 100);
        } else {
          setTimeout(() => {
            index = 0;
            typePlaceholder();
          }, 2000);
        }
      }
    };
    typePlaceholder();

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      if (bgRef.current) {
        bgRef.current.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="container">
      <img src={pinBackground} alt="Background" className="background-img" ref={bgRef} />

      <img src={chatIcon} className="icon floating fade" style={{ top: '30px', left: '30px' }} alt="Chat" />
      <img src={robotIcon} className="icon floating fade" style={{ top: '30px', right: '30px' }} alt="Robot" />
      <img src={brainIcon} className="icon floating fade" style={{ bottom: '30px', left: '30px' }} alt="Brain" />
      <img src={heartIcon} className="icon floating fade" style={{ bottom: '30px', right: '30px' }} alt="Heart" />

      <div className="content">
        <h1 className="logo">COMPANIO</h1>
        <p className="subtitle">Connection Beyond Words</p>
        <div className="input-group">
          <label htmlFor="name">Your Name</label>
          <input id="name" type="text" ref={inputRef} />
        </div>
        <button className="btn">Continue</button>
      </div>
    </div>
  );
};

export default NamePage;
