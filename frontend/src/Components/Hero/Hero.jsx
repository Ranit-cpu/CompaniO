

// import React, { Suspense, useEffect } from "react";
// import "./Hero.css";
// import { Link } from "react-router-dom";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, useGLTF, useAnimations, Html } from "@react-three/drei";

// // 3D Model component for girl with animation
// function RobotModel() {
//   const { scene, animations } = useGLTF("/models/girl.glb");
//   const { actions } = useAnimations(animations, scene);

//   // Play a specific animation clip on component mount
//   useEffect(() => {
//     // Check if the "Idle" animation exists and play it
//     if (actions["Idle"]) {
//       actions["Idle"].play();
//     }
//   }, [actions]);

//   return (
//     <primitive
//       object={scene}
//       scale={2.5}
//       position={[-1.5, -1, 0]} // Repositioned to the left
//     />
//   );
// }

// // 3D Model component for boy with animation
// function RobotModel1() {
//   const { scene, animations } = useGLTF("/models/boy.glb");
//   const { actions } = useAnimations(animations, scene);

//   // Play a specific animation clip on component mount
//   useEffect(() => {
//     // Check if the "Idle" animation exists and play it
//     if (actions["Idle"]) {
//       actions["Idle"].play();
//     }
//   }, [actions]);

//   return (
//     <primitive
//       object={scene}
//       scale={2.5}
//       position={[1.5, -1, 0]} // Repositioned to the right
//     />
//   );
// }

// const Hero = () => {
//   return (
//     <section className="hero">
//       <div className="hero-text">
//         <h1>Your Virtual Companion</h1>
//         <p>
//           Chat, explore, and grow with your AI-powered friend. <br />
//           Always there to listen, guide, and make your day brighter.
//         </p>
//         <Link to="/upload" className="btn">
//           Get Started
//         </Link>
//       </div>

//       {/* 3D Model Canvas */}
//       <div className="hero-3d">
//         <Canvas style={{ height: "550px", width: "550px" }}>
//           {/* Ambient light for base illumination */}
//           <ambientLight intensity={0.5} />

//           {/* Blueish light from the left */}
//           <directionalLight 
//             position={[-5, 5, 5]} 
//             intensity={1} 
//             color="#00aaff" // A vibrant blue
//           />

//           {/* Pinkish-red light from the right */}
//           <directionalLight 
//             position={[5, 5, 5]} 
//             intensity={1} 
//             color="#ff429e" // A bright pink
//           />
//           <OrbitControls />
//           <Suspense fallback={<Html center><p style={{color: "white"}}>Loading Models...</p></Html>}>
//             <RobotModel />
//             <RobotModel1 />
//           </Suspense>
//         </Canvas>
//       </div>
//     </section>
//   );
// };

// export default Hero;

import React, { Suspense, useEffect, useState } from "react";
import "./Hero.css";
import { Link, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Html } from "@react-three/drei";
import SignInComponent from "../SignIn/SignIn.jsx"; // Import your SignIn component

// 3D Model component for girl with animation
function RobotModel() {
  const { scene, animations } = useGLTF("/models/girl.glb");
  const { actions } = useAnimations(animations, scene);

  // Play a specific animation clip on component mount
  useEffect(() => {
    // Check if the "Idle" animation exists and play it
    if (actions["Idle"]) {
      actions["Idle"].play();
    }
  }, [actions]);

  return (
    <primitive
      object={scene}
      scale={2.5}
      position={[-1.5, -1, 0]} // Repositioned to the left
    />
  );
}

// 3D Model component for boy with animation
function RobotModel1() {
  const { scene, animations } = useGLTF("/models/boy.glb");
  const { actions } = useAnimations(animations, scene);

  // Play a specific animation clip on component mount
  useEffect(() => {
    // Check if the "Idle" animation exists and play it
    if (actions["Idle"]) {
      actions["Idle"].play();
    }
  }, [actions]);

  return (
    <primitive
      object={scene}
      scale={2.5}
      position={[1.5, -1, 0]} // Repositioned to the right
    />
  );
}

const isLoggedIn = localStorage.getItem("token") ? true : false;

const Hero = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  

  const handleGetStarted = () => {
    console.log("Get Started clicked, isLoggedIn:", isLoggedIn);
    if (isLoggedIn) {
      // User is logged in, navigate to name page
      navigate("/namepage");
    } else {
      // User is not logged in, show sign in modal
      console.log("Setting showSignIn to true");
      setShowSignIn(true);
    }
  };

  const handleAuthSuccess = () => {
    // Called when user successfully logs in or signs up
    setIsLoggedIn(true);
    setShowSignIn(false);
    // Navigate to name page after successful authentication
    navigate("/namepage");
  };

  const handleCloseSignIn = () => {
    setShowSignIn(false);
  };

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>Your Virtual Companion</h1>
          <p>
            Chat, explore, and grow with your AI-powered friend. <br />
            Always there to listen, guide, and make your day brighter.
          </p>
          <button onClick={handleGetStarted} className="btn1">
            Get Started
          </button>
        </div>

        {/* 3D Model Canvas */}
        <div className="hero-3d">
          <Canvas style={{ height: "550px", width: "550px" }}>
            {/* Ambient light for base illumination */}
            <ambientLight intensity={0.5} />

            {/* Blueish light from the left */}
            <directionalLight 
              position={[-5, 5, 5]}
              intensity={1}
              color="#00aaff" // A vibrant blue
            />

            {/* Pinkish-red light from the right */}
            <directionalLight 
              position={[5, 5, 5]}
              intensity={1}
              color="#ff429e" // A bright pink
            />
            <OrbitControls />
            <Suspense fallback={<Html center><p style={{color: "white"}}>Loading Models...</p></Html>}>
              <RobotModel />
              <RobotModel1 />
            </Suspense>
          </Canvas>
        </div>
      </section>

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="modal-overlay" onClick={(e) => e.target.classList.contains('modal-overlay') && handleCloseSignIn()}>
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