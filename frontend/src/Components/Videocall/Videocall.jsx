import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VideoCall.css";

export default function VideoCall() {
  const location = useLocation();
  const navigate = useNavigate();
  const { companionName, companionGender, uploadedPhoto } = location.state || {};

  const [isRecording, setIsRecording] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState("Connected");
  const [aiReply, setAiReply] = useState("");
  const [userTranscript, setUserTranscript] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const audioRef = useRef(null);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (t) =>
    `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

  // 🎙️ Start/Stop recording
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      setStatus("Processing...");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Pick a MIME type that is widely supported
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm; codecs=opus"
          : "audio/webm";

        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = mediaRecorder;
        audioChunks.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          if (audioChunks.current.length === 0) {
            console.error("⚠️ Empty recording detected");
            setStatus("Recording failed, try again");
            return;
          }

          const audioBlob = new Blob(audioChunks.current, { type: mimeType });
          console.log("🎧 Recorded Blob Size:", audioBlob.size);

          await sendAudioToBackend(audioBlob);
        };

        mediaRecorder.start();
        setIsRecording(true);
        setStatus("Listening...");
      } catch (err) {
        console.error("🎤 Mic error:", err);
        setStatus("Mic access denied");
      }
    }
  };

  // 🚀 Send audio to backend
  const sendAudioToBackend = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "user_audio.webm");

      const res = await fetch("http://localhost:8000/api/ai/voice", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const audioURL = URL.createObjectURL(await res.blob());
      if (audioRef.current) {
        audioRef.current.src = audioURL;
        await audioRef.current.play();
      }

      setStatus("Connected");
      setAiReply("🎧 AI is speaking...");
    } catch (err) {
      console.error("Error sending audio:", err);
      setStatus("Error communicating with AI");
    }
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
        {/* Avatar */}
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

        {/* Chat bubbles */}
        <div className="ai-chat-bubble">
          <strong>You:</strong> {isRecording ? "🎤 Recording..." : userTranscript || "Say something..."}
          <br />
          <strong>{companionName || "CompaniO"}</strong> {aiReply || "Waiting for input..."}
        </div>

        {/* Controls */}
        <div className="video-controls">
          <button
            className={`control-btn ${isRecording ? "active" : "inactive"}`}
            onClick={toggleRecording}
          >
            {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
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