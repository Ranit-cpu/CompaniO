// /frontend/src/Components/Chat/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Video, VideoOff, PhoneOff, Mic, MicOff,
  Send, Smile, Camera, Settings
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";   // ✅ import picker
import "./Chat.css";

export default function Chat() {
  const location = useLocation();
  const { userName, uploadedPhoto } = location.state || {};
  const containerRef = useRef(null);
  const chatBoxRef = useRef(null);
  const wsRef = useRef(null);
  const pickerRef = useRef(null); // ✅ ref for closing picker outside

  const sessionId = userName || "guest";
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // ✅ Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Connect WebSocket
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${sessionId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: "companion",
        text: `Hi ${userName || "friend"}! I'm so excited to chat with you! 😊✨`,
        timestamp: new Date()
      }]);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "bot_message") {
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: "companion",
          text: data.text,
          timestamp: new Date()
        }]);

        if (data.tts_path) {
          const audio = new Audio(`http://localhost:8000/${data.tts_path}`);
          audio.play().catch(err => console.warn("Audio play failed:", err));
        }
        setTyping(false);
      }
    };

    ws.onclose = () => console.log("❌ WebSocket closed");

    return () => ws.close();
  }, [sessionId, userName]);

  // Auto scroll
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    wsRef.current?.send(JSON.stringify({
      type: "user_message",
      text: userMessage.text
    }));
  };

  const startVideoCall = () => {
    setIsVideoCall(true);
    setIsVideoEnabled(true);
    setIsAudioEnabled(true);
  };

  const endVideoCall = () => setIsVideoCall(false);

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // ✅ Handle emoji select
  const onEmojiClick = (emojiObject) => {
    setInput(prev => prev + emojiObject.emoji);
  };

  return (
    <>
      <div ref={containerRef} className="chat-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-avatar">
              {uploadedPhoto ? (
                <img src={uploadedPhoto} alt="Companion" />
              ) : (
                <div className="default-avatar">💕</div>
              )}
              {onlineStatus && <div className="online-indicator"></div>}
            </div>
            <div className="profile-details">
              <h2>{userName ? `${userName}'s Companion` : "Virtual Companion"}</h2>
              <p>{onlineStatus ? "Online • Active now" : "Last seen recently"}</p>
            </div>
          </div>
          <div className="call-actions">
            <button className="action-btn video-btn" onClick={startVideoCall}>
              <Video size={20} />
            </button>
            <button className="action-btn settings-btn">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div ref={chatBoxRef} className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div>{msg.text}</div>
              <div className="message-time">{formatTime(msg.timestamp)}</div>
            </div>
          ))}

          {typing && (
            <div className="typing-indicator">
              <span>Typing</span>
              <div className="typing-dots">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="chat-input-area">
          <div className="input-container">
            <input
              type="text"
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <div className="input-actions">
              <button className="input-btn">
                <Smile size={18} />
              </button>
              <button className="input-btn">
                <Camera size={18} />
              </button>
              <button className="input-btn send-btn" onClick={sendMessage}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Video Call Overlay */}
        {isVideoCall && (
          <div className="video-call-overlay">
            <div className="video-call-header">
              <div>
                <h3>Video Call with {userName || "Companion"}</h3>
                <p>Connected • 00:00</p>
              </div>
            </div>

            <div className="video-call-content">
              {uploadedPhoto ? (
                <img src={uploadedPhoto} alt="Companion" className="video-avatar" />
              ) : (
                <div
                  className="video-avatar"
                  style={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem'
                  }}
                >
                  💕
                </div>
              )}

              <div className="video-controls">
                <button
                  className={`control-btn ${isAudioEnabled ? 'active' : 'inactive'}`}
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                >
                  {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
                </button>

                <button
                  className={`control-btn ${isVideoEnabled ? 'active' : 'inactive'}`}
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                >
                  {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
                </button>

                <button className="control-btn end-call-btn" onClick={endVideoCall}>
                  <PhoneOff size={24} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
