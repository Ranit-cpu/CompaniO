import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UploadCloud, X } from "lucide-react";
import "./Upload.css";
import robo2 from "../../assets/pink.png";
import bubblemsg2 from "../../assets/ladyrob.png";
import introVideo from "../../assets/avatar2.mp4";

export default function UploadPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const getUserAndCompanionData = () => {
    const companionData = location.state || {};
    const userData = {
      userName: localStorage.getItem("userName"),
      userEmail: localStorage.getItem("userEmail"),
    };
    return {
      userName: userData.userName,
      userEmail: userData.userEmail,
      companionName: companionData.companionName,
      companionGender: companionData.companionGender,
      moonSign: companionData.moonSign,
      personalityTraits: companionData.personalityTraits || [],
    };
  };

  const [allData] = useState(getUserAndCompanionData());
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const uploadedFile = e.dataTransfer.files?.[0];
    if (uploadedFile && uploadedFile.type.startsWith("image/")) setFile(uploadedFile);
  };
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.type.startsWith("image/")) setFile(uploadedFile);
  };
  const clearFile = () => setFile(null);

  const handleUpload = () => {
    if (!file) return alert("Please select a file to upload.");
    const imageURL = URL.createObjectURL(file);
    navigate("/chat", {
      state: { ...allData, uploadedPhoto: imageURL },
    });
  };

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      videoRef.current.play().catch(() => {});
    }
  };

  const getPersonalityPreview = () => {
    let preview = "";
    if (allData.moonSign) preview += `${allData.moonSign} moon sign`;
    if (allData.personalityTraits?.length > 0) {
      const traitsText = allData.personalityTraits.slice(0, 3).join(", ");
      preview += preview ? ` • ${traitsText}` : traitsText;
      if (allData.personalityTraits.length > 3)
        preview += ` +${allData.personalityTraits.length - 3} more`;
    }
    return preview;
  };

  return (
    <div className="upload-page-container">
      {/* Stars */}
      <div className="stars">
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
      </div>

      {/* Floating Images */}
      <img src={bubblemsg2} alt="Chat Bubble" className="floating-icon bubble" />
      <img src={robo2} alt="Robot" className="floating-icon robot" />

      {/* Upload Card */}
      <div className="upload-card" role="region" aria-label="Upload card">
        {/* Video */}
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
          <button onClick={toggleSound} className="sound-toggle-btn" type="button">
            {isMuted ? "🔊 Enable Sound" : "🔇 Mute"}
          </button>
        </div>

        {/* Header */}
        <div className="header-section">
          <h1 className="main-title">
            {allData.userName && allData.companionName
              ? `Hi ${allData.userName}! Meet ${allData.companionName}!`
              : allData.companionName
              ? `Meet ${allData.companionName}!`
              : allData.userName
              ? `Welcome ${allData.userName}!`
              : "Your Virtual Companion Awaits"}
          </h1>

          {(allData.moonSign || (allData.personalityTraits && allData.personalityTraits.length > 0)) && (
            <p className="personality-preview">✨ {getPersonalityPreview()}</p>
          )}

          <p className="upload-prompt">
            Upload a photo, transform and meet your personalized AI humanoid model
          </p>
        </div>

        {/* Upload area */}
        <div
          className={`upload-area ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="file-preview">
              <img src={URL.createObjectURL(file)} alt="Uploaded preview" className="preview-image" />
              <button onClick={clearFile} className="remove-image-btn" aria-label="Remove image">
                <X size={18} />
              </button>
            </div>
          ) : (
            <>
              <UploadCloud size={64} className="upload-icon" />
              <p className="drag-text">Drag and drop your image here</p>
              <p className="or-text">or</p>
              <label htmlFor="file-upload" className="browse-btn" aria-hidden="false">
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

        {/* Generate button */}
        <button
          onClick={handleUpload}
          className="generate-btn"
          disabled={!file}
          type="button"
        >
          Let's Connect with {allData.companionName || "Your Companion"}
        </button>
      </div>
    </div>
  );
}