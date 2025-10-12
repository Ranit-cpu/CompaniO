import React, { Suspense, useEffect, useState } from "react";
import "./Hero.css";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Html } from "@react-three/drei";
import SignInComponent from "../SignIn/SignIn.jsx";

// 3D Model component for girl with animation
function RobotModel() {
  const { scene, animations } = useGLTF("/models/girl.glb");
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions["Idle"]) actions["Idle"].play();
  }, [actions]);

  return <primitive object={scene} scale={2.5} position={[-1.5, -1, 0]} />;
}

// 3D Model component for boy with animation
function RobotModel1() {
  const { scene, animations } = useGLTF("/models/boy.glb");
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions["Idle"]) actions["Idle"].play();
  }, [actions]);

  return <primitive object={scene} scale={2.5} position={[1.5, -1, 0]} />;
}

const Hero = ({ isAuthenticated, setActiveModal, onAuthSuccess }) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const navigate = useNavigate();

  // ⭐ Add stars effect on mount
  // useEffect for stars
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


  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/namepage");
    } else {
      if (setActiveModal) {
        setActiveModal("login");
      } else {
        setShowSignIn(true);
      }
    }
  };

  const handleAuthSuccess = (realToken) => {
    if (realToken && realToken !== "dummyToken") {
      localStorage.setItem("token", realToken);
      setShowSignIn(false);

      if (onAuthSuccess) {
        onAuthSuccess(realToken);
      }
      navigate("/namepage");
    } else {
      console.error("Authentication failed - no valid token received");
      alert("Authentication failed. Please try again.");
    }
  };

  const handleCloseSignIn = () => {
    setShowSignIn(false);
  };

  return (
    <>
      <section className="hero">
        {/* ⭐ Stars background */}
        <div className="hero-stars"></div>

        <div className="hero-text">
          <h1>Your Virtual Companion</h1>
          <p>Your trusted virtual friend, connecting hearts and minds everyday.</p>
          <button onClick={handleGetStarted} className="btn1">
            {isAuthenticated ? "Continue" : "Get Started"}
          </button>
        </div>

        <div className="hero-3d">
          <Canvas style={{ height: "550px", width: "550px" }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[-5, 5, 5]} intensity={1} color="#00aaff" />
            <directionalLight position={[5, 5, 5]} intensity={1} color="#ff429e" />
            <OrbitControls />
            <Suspense
              fallback={
                <Html center>
                  <p style={{ color: "white" }}>Loading Models...</p>
                </Html>
              }
            >
              <RobotModel />
              <RobotModel1 />
            </Suspense>
          </Canvas>
        </div>
      </section>

      {/* Local Sign In Modal */}
      {showSignIn && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target.classList.contains("modal-overlay") && handleCloseSignIn()}
        >
          <div className="modal-content">
            <SignInComponent
              onAuthSuccess={handleAuthSuccess}
              onClose={handleCloseSignIn}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
