import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { 
  Video, 
  VideoOff, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Send, 
  Smile,
  Camera,
  Settings
} from "lucide-react";
import "./Chat.css";

export default function Chat() {
  const location = useLocation();
  const { userName, userGender, uploadedPhoto } = location.state || {};
  const containerRef = useRef(null);
  const chatBoxRef = useRef(null);

  const [messages, setMessages] = useState([
    { 
      id: 1,
      sender: "companion", 
      text: `Hi ${userName || "friend"}! I'm so excited to chat with you! 😊✨`,
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState("");
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [typing, setTyping] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(true);

  // Animated background particles
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'animated-particle';
      const size = Math.random() * 6 + 3;
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight + 10}px;
        position: absolute;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        animation: floatUp 12s ease-out infinite;
      `;
      container.appendChild(particle);
      setTimeout(() => particle.remove(), 12000);
    };

    const createOrb = () => {
      const orb = document.createElement('div');
      const size = Math.random() * 80 + 40;
      orb.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * (window.innerWidth - size)}px;
        top: ${Math.random() * (window.innerHeight - size)}px;
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 215, 0, 0.25) 0%, transparent 70%);
        z-index: 1;
        animation: pulseGlow 6s ease-in-out infinite;
        pointer-events: none;
      `;
      container.appendChild(orb);
      setTimeout(() => orb.remove(), 6000);
    };

    const particleInterval = setInterval(createParticle, 300);
    const orbInterval = setInterval(createOrb, 4000);

    return () => {
      clearInterval(particleInterval);
      clearInterval(orbInterval);
    };
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const emojis = ["😊", "✨", "🌸", "💖", "🥰", "🌟", "💕", "🔥"];

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

    setTimeout(() => {
      const replyMessage = {
        id: Date.now() + 1,
        sender: "companion",
        text: generateReply(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, replyMessage]);
      setTyping(false);
    }, 1500 + Math.random() * 2000);
  };

  const generateReply = (userText) => {
    const responses = {
      greetings: [
        "Hey there! So lovely to hear from you",
        "Hi! I've been waiting to chat with you",
        "Hello! How's your day going"
      ],
      questions: [
        "I'm doing great! What about you?",
        "I'm fantastic! Talking with you makes me happy",
        "All good here! Thanks for asking"
      ],
      compliments: [
        "Aww, you're so sweet! That means a lot",
        "Thank you! You always make me smile",
        "You're amazing! I'm lucky to know you"
      ],
      default: [
        "That's so interesting! Tell me more",
        "I love hearing your thoughts! What else is on your mind?",
        "You always have such cool ideas",
        "This is fun! Keep going"
      ]
    };

    const text = userText.toLowerCase();
    let reply;

    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
      reply = responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
    } else if (text.includes('how are you') || text.includes('how do you feel')) {
      reply = responses.questions[Math.floor(Math.random() * responses.questions.length)];
    } else if (text.includes('beautiful') || text.includes('cute') || text.includes('love')) {
      reply = responses.compliments[Math.floor(Math.random() * responses.compliments.length)];
    } else {
      reply = responses.default[Math.floor(Math.random() * responses.default.length)];
    }

    // Add a fun emoji at the end
    return `${reply} ${emojis[Math.floor(Math.random() * emojis.length)]}`;
  };

  const startVideoCall = () => {
    setIsVideoCall(true);
    setIsVideoEnabled(true);
    setIsAudioEnabled(true);
  };

  const endVideoCall = () => setIsVideoCall(false);

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
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
            <h2 
              style={{
                background: "linear-gradient(45deg, #FFD700, #FFB700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {userName ? `${userName}'s Companio` : "Virtual Companio"}
            </h2>
            <p>{onlineStatus ? " Active now" : "Last seen recently"}</p>
          </div>
        </div>

        <div className="call-actions">
          <button 
            className="action-btn video-btn"
            style={{
              background: "linear-gradient(135deg, #28a745, #34d058)",
              color: "white",
              boxShadow: "0 4px 10px rgba(40,167,69,0.4)"
            }}
            onClick={startVideoCall}
          >
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
            <button className="input-btn"><Smile size={18} /></button>
            <button className="input-btn"><Camera size={18} /></button>
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
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "4rem"
                }}
              >
                💕
              </div>
            )}
            <div className="video-controls">
              <button 
                className={`control-btn ${isAudioEnabled ? "active" : "inactive"}`}
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              >
                {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
              </button>
              <button 
                className={`control-btn ${isVideoEnabled ? "active" : "inactive"}`}
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
  );
}
