// /frontend/src/Components/Chat/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Video, VideoOff, PhoneOff, Mic, MicOff,
  Send, Smile, Camera, Settings
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import "./Chat.css";

export default function Chat() {
  const location = useLocation();
  const { 
    userName, 
    companionName, 
    companionGender,
    moonSign,
    personalityTraits = [],
    uploadedPhoto 
  } = location.state || {};
  
  const containerRef = useRef(null);
  const chatBoxRef = useRef(null);
  const wsRef = useRef(null);
  const pickerRef = useRef(null);

  const sessionId = userName || "guest";
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Create personality context for AI
  const createPersonalityContext = () => {
    let context = `You are ${companionName || 'a virtual companion'}`;
    
    if (companionGender) {
      context += `, a ${companionGender} AI companion`;
    }
    
    if (moonSign) {
      context += ` with ${moonSign} moon sign characteristics`;
    }
    
    if (personalityTraits && personalityTraits.length > 0) {
      context += `. Your personality traits include: ${personalityTraits.join(', ')}`;
    }
    
    context += `. You are chatting with ${userName || 'your user'}. Be personalized, engaging, and embody these characteristics naturally in your responses. Don't mention that you're an AI unless specifically asked.`;
    
    return context;
  };

  // Connect WebSocket
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/sessions/${sessionId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      
      // Send personality context to backend for AI customization
      const personalityContext = createPersonalityContext();
      ws.send(JSON.stringify({
        type: "personality_context",
        context: personalityContext,
        companionName: companionName,
        companionGender: companionGender,
        moonSign: moonSign,
        personalityTraits: personalityTraits
      }));

      // Create personalized welcome message
      let welcomeMessage = `Hi ${userName || "friend"}! `;
      
      if (moonSign && personalityTraits.length > 0) {
        welcomeMessage += `I'm ${companionName}, your ${personalityTraits[0].toLowerCase()} companion! As a ${moonSign}, I'm excited to connect with you! ✨😊`;
      } else if (moonSign) {
        welcomeMessage += `I'm ${companionName}! With my ${moonSign} energy, I'm so excited to chat with you! 🌙✨`;
      } else if (personalityTraits.length > 0) {
        welcomeMessage += `I'm ${companionName}, and I'm feeling quite ${personalityTraits[0].toLowerCase()} today! Can't wait to get to know you better! 😊`;
      } else {
        welcomeMessage += `I'm ${companionName}, so excited to chat with you! 😊✨`;
      }

      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: "companion",
        text: welcomeMessage,
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

        // Play TTS if available
        if (data.tts_path) {
          const audio = new Audio(`http://localhost:8000/${data.tts_path}`);
          audio.play().catch(err => console.warn("Audio play failed:", err));
        }
        
        setTyping(false);
      }
    };

    ws.onclose = () => console.log("❌ WebSocket closed");

    return () => ws.close();
  }, [sessionId, userName, companionName, companionGender, moonSign, personalityTraits]);

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

  // Handle emoji select
  const onEmojiClick = (emojiObject) => {
    setInput(prev => prev + emojiObject.emoji);
  };

  // Get personality badge text
  const getPersonalityBadge = () => {
    if (moonSign && personalityTraits.length > 0) {
      return `${moonSign} • ${personalityTraits[0]}`;
    } else if (moonSign) {
      return moonSign;
    } else if (personalityTraits.length > 0) {
      return personalityTraits[0];
    }
    return null;
  };

  return (
    <>
      <div ref={containerRef} className="chat-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-avatar">
              {uploadedPhoto ? (
                <img src={uploadedPhoto} alt={companionName} />
              ) : (
                <div className="default-avatar">
                  {companionGender === 'female' ? '👩' : '👨'}
                </div>
              )}
              {onlineStatus && <div className="online-indicator"></div>}
            </div>
            <div className="profile-details">
              <h2>{companionName || "Virtual Companion"}</h2>
              <p className="status-text">
                {onlineStatus ? "Online • Active now" : "Last seen recently"}
                {getPersonalityBadge() && (
                  <span className="personality-badge">✨ {getPersonalityBadge()}</span>
                )}
              </p>
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
              <span>{companionName || "Companion"} is typing</span>
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
              placeholder={`Message ${companionName || "your companion"}...`}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <div className="input-actions">
              <button 
                className="input-btn"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
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

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div ref={pickerRef} className="emoji-picker-container">
              <EmojiPicker 
                onEmojiClick={onEmojiClick}
                width={350}
                height={400}
              />
            </div>
          )}
        </div>

        {/* Video Call Overlay */}
        {isVideoCall && (
          <div className="video-call-overlay">
            <div className="video-call-header">
              <div>
                <h3>Video Call with {companionName || "Companion"}</h3>
                <p>Connected • 00:00</p>
              </div>
            </div>

            <div className="video-call-content">
              {uploadedPhoto ? (
                <img src={uploadedPhoto} alt={companionName} className="video-avatar" />
              ) : (
                <div
                  className="video-avatar"
                  style={{
                    background: companionGender === 'female' 
                      ? 'linear-gradient(45deg, #ff9a9e, #fecfef)' 
                      : 'linear-gradient(45deg, #667eea, #764ba2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem'
                  }}
                >
                  {companionGender === 'female' ? '👩' : '👨'}
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