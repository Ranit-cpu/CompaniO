import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UploadCloud, X } from 'lucide-react';
import "./Upload.css";
import introVideo from "../../assets/avatar2.mp4";

export default function Upload() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get both user data (from login) and companion data (from NamePage)
  const getUserAndCompanionData = () => {
    // Get companion data from navigation state
    const companionData = location.state || {};

    // Get user data from localStorage (stored during login/signup)
    const userData = {
      userName: localStorage.getItem('userName'),  // ✅ fixed
      userEmail: localStorage.getItem('userEmail') // ✅ fixed
    };

    return {
      // User info (from login)
      userName: userData.userName,
      userEmail: userData.userEmail,
      // Companion info (from NamePage)
      companionName: companionData.companionName,
      companionGender: companionData.companionGender
    };
  };

  const [allData, setAllData] = useState(getUserAndCompanionData());
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  // Debug: Log all data to see what we're getting
  useEffect(() => {
    console.log('Upload page - All data:', allData);
    console.log('Location state:', location.state);
  }, [allData, location.state]);

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
      // Create object URL for uploaded image
      const imageURL = URL.createObjectURL(file);

      // Navigate to Chat.jsx and pass all data
      navigate("/chat", {
        state: {
          userName: allData.userName,
          userEmail: allData.userEmail, // ✅ include email too
          companionName: allData.companionName,
          companionGender: allData.companionGender,
          uploadedPhoto: imageURL
        }
      });
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
        {/* 🎥 Video section */}
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

        {/* Header */}
        <div className="header-section">
          <h1 className="main-title">
            {allData.userName && allData.companionName ?
              `Hi ${allData.userName}! Meet ${allData.companionName}!` :
              allData.companionName ?
                `Welcome ${allData.companionName}!` :
                allData.userName ?
                  `Welcome ${allData.userName}!` :
                  'Your Virtual Companion Awaits'
            }
          </h1>
          <p className="upload-prompt">
            Upload a photo, transform and meet your personalized AI humanoid model
          </p>
        </div>

        {/* Upload Area */}
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

        {/* Button navigates to Chat */}
        <button
          onClick={handleUpload}
          className="generate-btn"
          disabled={!file}
        >
          Let's Connect
        </button>
      </div>
    </div>
  );
}
