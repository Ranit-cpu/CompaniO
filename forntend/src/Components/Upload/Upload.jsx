import React, { useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import "./Upload.css";


const robotImage = "https://placehold.co/192x192/8a2be2/ffffff?text=ROBOT";


export default function App() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile && uploadedFile.type.startsWith('image/')) {
      setFile(uploadedFile);
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith('image/')) {
      setFile(uploadedFile);
    }
  };
  
  const handleUpload = () => {
    if (file) {
      alert(`Uploading file: ${file.name}`);
    } else {
      alert("Please select a file to upload.");
    }
  };
  
  const clearFile = () => {
    setFile(null);
  };

  return (
    <>
      
      <div className="upload-page-container">
        <div className="upload-card">
          
          {/* Header section with the robot image and text */}
          <div className="header-section">
            <img 
              src={robotImage} 
              alt="Humanoid Robot" 
              className="robot-image"
            />
            <h1 className="main-title">Your Virtual Companion Awaits</h1>
            <p className="upload-prompt">
              Upload a photo, and our AI will transform it into your personal humanoid model.
            </p>
          </div>

          {/* File upload area */}
          <div
            className={`upload-area ${isDragging ? 'dragging' : ''}`}
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
                <p className="drag-text">
                  Drag and drop your image here
                </p>
                <p className="or-text">or</p>
                <label
                  htmlFor="file-upload"
                  className="browse-btn"
                >
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

          {/* Upload button */}
          <button
            onClick={handleUpload}
            className="generate-btn"
            disabled={!file}
          >
            Generate AI Model
          </button>
        </div>
      </div>
    </>
  );
}
