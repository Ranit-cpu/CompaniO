import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import "./VideoCall.css";

export default function VideoCall() {
  const location = useLocation();
  const navigate = useNavigate();
  const { companionName, companionGender, uploadedPhoto } = location.state || {};

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [listening, setListening] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [status, setStatus] = useState("Connected");
  const audioRef = useRef(null);

  // 🎬 Start timer on mount
  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format timer as MM:SS
  const formatTime = (t) =>
    `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

  // 🎤 Setup SpeechRecognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setListening(true);
        setStatus("Listening...");
      };
      rec.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setUserTranscript(text);
        sendToAI(text);
      };
      rec.onerror = (e) => {
        console.error("SpeechRecognition error:", e);
        setStatus("Mic error");
        setListening(false);
      };
      rec.onend = () => setListening(false);
      recognitionRef.current = rec;
    } else {
      setStatus("SpeechRecognition not supported");
    }
  }, []);

  // 🎙️ Start & stop mic
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // 🚀 Send user text to AI backend and play reply
  const sendToAI = async (text) => {
    setStatus("Thinking...");
    try {
      const res = await fetch("http://localhost:8000/api/ai/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setAiReply(data.text);
      setStatus("Speaking...");

      if (data.audio_base64) {
        const audioBlob = base64ToBlob(data.audio_base64, "audio/mpeg");
        const url = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = url;
          await audioRef.current.play();
        } else {
          const a = new Audio(url);
          await a.play();
        }
      }
      setStatus("Connected");
    } catch (err) {
      console.error(err);
      setStatus("Error communicating with AI");
    }
  };

  // Utility: base64 → Blob
  const base64ToBlob = (b64Data, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i);
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  };

  const endCall = () => navigate(-1);

  return (
    <div className="video-call-overlay">
      <div className="video-call-header">
        <div>
          <h3>Video Call with {companionName || "CompaniO"}</h3>
          <p>
            {status} • {formatTime(seconds)}
          </p>
        </div>
      </div>

      <div className="video-call-content">
        {/* Avatar / Video Display */}
        {uploadedPhoto ? (
          <img src={uploadedPhoto} alt={companionName} className="video-avatar" />
        ) : (
          <div
            className="video-avatar"
            style={{
              background:
                companionGender === "female"
                  ? "linear-gradient(45deg, #ff9a9e, #fecfef)"
                  : "linear-gradient(45deg, #667eea, #764ba2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "4rem",
            }}
          >
            {companionGender === "female" ? "👩" : "👨"}
          </div>
        )}

        {/* AI Text Reply Section */}
        <div className="ai-chat-bubble">
          <strong>You:</strong> {userTranscript || <i>Say something...</i>}
          <br />
          <strong>CompaniO:</strong> {aiReply || <i>Listening...</i>}
        </div>

        {/* Controls */}
        <div className="video-controls">
          <button
            className={`control-btn ${isAudioEnabled ? "active" : "inactive"}`}
            onClick={() => {
              setIsAudioEnabled(!isAudioEnabled);
              toggleListening();
            }}
          >
            {isAudioEnabled && listening ? (
              <MicOff size={24} />
            ) : (
              <Mic size={24} />
            )}
          </button>

          <button
            className={`control-btn ${isVideoEnabled ? "active" : "inactive"}`}
            onClick={() => setIsVideoEnabled(!isVideoEnabled)}
          >
            {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
          </button>

          <button className="control-btn end-call-btn" onClick={endCall}>
            <PhoneOff size={24} />
          </button>
        </div>
      </div>

      <audio ref={audioRef} hidden />
    </div>
  );
}