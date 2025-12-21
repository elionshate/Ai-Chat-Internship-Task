const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

function getMockReply(message) {
  const text = message.toLowerCase();

  if (text.includes("hello") || text.includes("hi")) {
    return "Hello! How can I help you today?";
  }
  if (text.includes("price")) {
    return "Our pricing depends on your usage. A sales representative can assist you.";
  }
  if (text.includes("help")) {
    return "Sure — please describe your issue and I will assist.";
  }

  return "Thank you for your message. A support agent will respond shortly.";
}

app.post("/api/chat", (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = getMockReply(message);

    setTimeout(() => {
      res.json({
        reply,
        timestamp: new Date().toISOString()
      });
    }, 1000); // Simulated AI thinking time
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
