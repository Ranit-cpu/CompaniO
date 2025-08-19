

// import React, { useState, useRef } from 'react';
// import { UploadCloud, X } from 'lucide-react';
// import "./Upload.css";
// import introVideo from "../../assets/avatar2.mp4"; // your video file

// export default function App() {
//   const [file, setFile] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isMuted, setIsMuted] = useState(true); // track mute state
//   const videoRef = useRef(null);

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => setIsDragging(false);

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const uploadedFile = e.dataTransfer.files[0];
//     if (uploadedFile && uploadedFile.type.startsWith("image/")) {
//       setFile(uploadedFile);
//     }
//   };

//   const handleFileChange = (e) => {
//     const uploadedFile = e.target.files[0];
//     if (uploadedFile && uploadedFile.type.startsWith("image/")) {
//       setFile(uploadedFile);
//     }
//   };

//   const handleUpload = () => {
//     if (file) {
//       alert(`Uploading file: ${file.name}`);
//     } else {
//       alert("Please select a file to upload.");
//     }
//   };

//   const clearFile = () => setFile(null);

//   const toggleSound = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !isMuted;
//       setIsMuted(!isMuted);
//       videoRef.current.play(); // ensure playback resumes
//     }
//   };

//   return (
//     <div className="upload-page-container">
//       <div className="upload-card">

//         {/* 🎥 Video section at the top of card */}
//         <div className="video-section">
//           <video
//             ref={videoRef}
//             src={introVideo}
//             autoPlay
//             loop
//             muted={isMuted}
//             playsInline
//             className="card-video"
//           />
//           {/* Overlay button */}
//           <button onClick={toggleSound} className="sound-toggle-btn">
//             {isMuted ? "🔊 Enable Sound" : "🔇 Mute"}
//           </button>
//         </div>

//         {/* Header section */}
//         <div className="header-section">
//           <h1 className="main-title">Your Virtual Companion Awaits</h1>
//           <p className="upload-prompt">
//             Upload a photo, and our AI will transform it into your personal humanoid model.
//           </p>
//         </div>

//         {/* File upload area */}
//         <div
//           className={`upload-area ${isDragging ? "dragging" : ""}`}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//         >
//           {file ? (
//             <div className="file-preview">
//               <img
//                 src={URL.createObjectURL(file)}
//                 alt="Uploaded"
//                 className="preview-image"
//               />
//               <button
//                 onClick={clearFile}
//                 className="remove-image-btn"
//                 aria-label="Remove image"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//           ) : (
//             <>
//               <UploadCloud size={64} className="upload-icon" />
//               <p className="drag-text">Drag and drop your image here</p>
//               <p className="or-text">or</p>
//               <label htmlFor="file-upload" className="browse-btn">
//                 Browse Files
//               </label>
//               <input
//                 id="file-upload"
//                 type="file"
//                 className="file-input"
//                 accept="image/*"
//                 onChange={handleFileChange}
//               />
//             </>
//           )}
//         </div>

//         {/* Upload button */}
//         <button
//           onClick={handleUpload}
//           className="generate-btn"
//           disabled={!file}
//         >
//           Generate AI Model
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation to access passed state
import { UploadCloud, X } from 'lucide-react';
import "./Upload.css";
import introVideo from "../../assets/avatar2.mp4";

export default function Upload() {
  const location = useLocation(); // Get location object
  const { userName, userGender } = location.state || {}; // Extract user data from state

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile && uploadedFile.type.startsWith("image/")) {
      setFile(uploadedFile);
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith("image/")) {
      setFile(uploadedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      // You can now use userName and userGender in your upload logic
      alert(`Uploading file: ${file.name} for ${userName} (${userGender})`);
      // Your upload logic here...
    } else {
      alert("Please select a file to upload.");
    }
  };

  const clearFile = () => setFile(null);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      videoRef.current.play();
    }
  };

  return (
    <div className="upload-page-container">
      <div className="upload-card">
        {/* 🎥 Video section at the top of card */}
        <div className="video-section">
          <video
            ref={videoRef}
            src={introVideo}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="card-video"
          />
          <button onClick={toggleSound} className="sound-toggle-btn">
            {isMuted ? "🔊 Enable Sound" : "🔇 Mute"}
          </button>
        </div>

        {/* Header section with personalized greeting */}
        <div className="header-section">
          <h1 className="main-title">
            {userName ? `Welcome ${userName}!` : 'Your Virtual Companion Awaits'}
          </h1>
          <p className="upload-prompt">
            Upload a photo, and our AI will transform it into your personal humanoid model.
          </p>
        </div>

        {/* File upload area */}
        <div
          className={`upload-area ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="file-preview">
              <img
                src={URL.createObjectURL(file)}
                alt="Uploaded"
                className="preview-image"
              />
              <button
                onClick={clearFile}
                className="remove-image-btn"
                aria-label="Remove image"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <>
              <UploadCloud size={64} className="upload-icon" />
              <p className="drag-text">Drag and drop your image here</p>
              <p className="or-text">or</p>
              <label htmlFor="file-upload" className="browse-btn">
                Browse Files
              </label>
              <input
                id="file-upload"
                type="file"
                className="file-input"
                accept="image/*"
                onChange={handleFileChange}
              />
            </>
          )}
        </div>

        <button
          onClick={handleUpload}
          className="generate-btn"
          disabled={!file}
        >
          Generate AI Model
        </button>
      </div>
    </div>
  );
}