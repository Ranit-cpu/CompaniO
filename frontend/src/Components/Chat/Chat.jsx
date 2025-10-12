// /frontend/src/Components/Chat/Chat.jsx
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { Video, Send, Smile, Camera, Settings } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import "./Chat.css";

export default function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
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
    if (companionGender) context += `, a ${companionGender} AI companion`;
    if (moonSign) context += ` with ${moonSign} moon sign characteristics`;
    if (personalityTraits && personalityTraits.length > 0)
      context += `. Your personality traits include: ${personalityTraits.join(', ')}`;
    context += `. You are chatting with ${userName || 'your user'}. Be personalized, engaging, and embody these characteristics naturally in your responses.`;
    return context;
  };

  // Connect WebSocket
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/sessions/${sessionId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      ws.send(JSON.stringify({
        type: "personality_context",
        context: createPersonalityContext(),
        companionName,
        companionGender,
        moonSign,
        personalityTraits
      }));

      let welcomeMessage = `Hi ${userName || "friend"}! `;
      if (moonSign && personalityTraits.length > 0) {
        welcomeMessage += `I'm ${companionName}, your ${personalityTraits[0].toLowerCase()} companion! ✨😊`;
      } else {
        welcomeMessage += `I'm ${companionName}, so excited to chat with you! 😊✨`;
      }

      setMessages(prev => [...prev, { id: Date.now(), sender: "companion", text: welcomeMessage, timestamp: new Date() }]);
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
        if (data.tts_path) new Audio(`http://localhost:8000/${data.tts_path}`).play();
        setTyping(false);
      }
    };

    ws.onclose = () => console.log("❌ WebSocket closed");
    return () => ws.close();
  }, [sessionId, userName, companionName, companionGender, moonSign, personalityTraits]);

  // Auto scroll
  useEffect(() => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage = { id: Date.now(), sender: "user", text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setTyping(true);
    wsRef.current?.send(JSON.stringify({ type: "user_message", text: userMessage.text }));
  };

  const onEmojiClick = (emojiObject) => setInput(prev => prev + emojiObject.emoji);
  const formatTime = (date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const getPersonalityBadge = () => {
    if (moonSign && personalityTraits.length > 0) return `${moonSign} • ${personalityTraits[0]}`;
    else if (moonSign) return moonSign;
    else if (personalityTraits.length > 0) return personalityTraits[0];
    return null;
  };

  return (
    <div ref={containerRef} className="chat-container">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {uploadedPhoto ? <img src={uploadedPhoto} alt={companionName} /> : <div className="default-avatar">{companionGender === 'female' ? '👩' : '👨'}</div>}
            {onlineStatus && <div className="online-indicator"></div>}
          </div>
          <div className="profile-details">
            <h2>{companionName || "Virtual Companion"}</h2>
            <p className="status-text">
              {onlineStatus ? "Online • Active now" : "Last seen recently"}
              {getPersonalityBadge() && <span className="personality-badge">✨ {getPersonalityBadge()}</span>}
            </p>
          </div>
        </div>
        <div className="call-actions">
          <button className="action-btn video-btn"
            onClick={() => navigate("/video-call", { state: location.state })}>
            <Video size={20} />
          </button>
          <button className="action-btn settings-btn"><Settings size={20} /></button>
        </div>
      </div>

      {/* Messages */}
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

      {/* Input */}
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
            <button className="input-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <Smile size={18} />
            </button>
            <button className="input-btn"><Camera size={18} /></button>
            <button className="input-btn send-btn" onClick={sendMessage}>
              <Send size={18} />
            </button>
          </div>
        </div>

        {showEmojiPicker && (
          <div ref={pickerRef} className="emoji-picker-container">
            <EmojiPicker onEmojiClick={onEmojiClick} width={350} height={400} />
          </div>
        )}
      </div>
    </div>
  );
}