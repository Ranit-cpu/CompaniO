import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const AnimatedBackground = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: {
          color: "#1a002b"
        },
        particles: {
          color: { value: "#ffffff" },
          move: { enable: true, speed: 1 },
          number: { value: 60 },
          size: { value: 3 },
          links: {
            enable: true,
            color: "#ffffff",
            distance: 150,
            opacity: 0.4
          }
        }
      }}
    />
  );
};

export default AnimatedBackground;
