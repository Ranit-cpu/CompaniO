import React from "react";
import "./About.css";

// Placeholder images (replace with your actual images)
import member1 from "../../assets/SnehaGhosh.jpeg";
import member2 from "../../assets/JishnuPaul.JPG";
import member3 from "../../assets/RanitSaha.jpg";
import member4 from "../../assets/AvinandanB.JPG";
import member5 from "../../assets/Rima.jpeg";

const teamMembers = [
  {
    name: "Sneha Ghosh",
    role: "Frontend Developer & UI/UX Designer",
    img: member1,
  },
  {
    name: "Ranit Saha",
    role: "Backend Developer",
    img: member3,
  },
  {
    name: "Jishnu Paul",
    role: "Data Scientist",
    img: member2,
  },
  {
    name: "Avinandan Bhattacharjee",
    role: "Cloud Engineer",
    img: member4,
  },
  {
    name: "Rima Paul",
    role: "Frontend Developer",
    img: member5,
  },
];

const AboutUs = () => {
  return (
    <div className="knowmore-page">
      {/* Animated Star Background */}
      <div className="hero-stars"></div>

      {/* CompaniO Intro Section */}
      <section className="intro-section">
        <div className="intro-content">
          <h1>CompaniO</h1>
          <p>
            CompaniO is a personalized AI companion platform that blends emotional support, entertainment
            and productivity. It adapts to your preferences and provides a safe space for interaction.
            Our mission is to make digital companionship intelligent, engaging and fun for everyone.
          </p>
        </div>
      </section>

      {/* Team Members Slider */}
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-slider">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <img src={member.img} alt={member.name} className="team-img" />
              <h3>{member.name}</h3>
              <h4>{member.role}</h4>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
