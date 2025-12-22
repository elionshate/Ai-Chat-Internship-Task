import React, { useState } from "react";
import { sendMessage } from "./api";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setTyping(true);
    setError(null);

    try {
      const data = await sendMessage(input);

      const botMessage = {
        text: data.reply,
        sender: "bot",
        timestamp: new Date(data.timestamp).toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch {
      setError("Unable to send message. Please try again.");
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="chat-container">
      <h2>AI Support Chat</h2>

      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <div>{msg.text}</div>
            <small>{msg.timestamp}</small>
        </div>
        ))}
        {typing && <div className="typing">AI is typing...</div>}
      </div>

      {error && <div className="error">{error}</div>}

      <div className="input-area">
        <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
            if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            if (input.trim()) {
                handleSend();
            }
            }
        }}
        placeholder="Type your message..."
        rows={3}
        />

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
