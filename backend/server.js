const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
let lastLocation = null;


function getMockReply(message) {
  const text = message.toLowerCase().trim();

  // Greeting
  if (text === "hello" || text === "hi") {
    return "Hello! I can help you find hotels by location, price, or distance from the city center.";
  }

  // Intent keywords
  const isCheapest = text.includes("cheapest");
  const isClosest = text.includes("closest");
  const isFurthest = text.includes("furthest");

  // Extract location ("rome" OR "in rome")
  let location = null;
  const inMatch = text.match(/in\s+([a-z]+)/);

  if (inMatch) {
    location = inMatch[1];
    lastLocation = location;
  } else if (text.split(" ").length === 1 && !isCheapest && !isClosest && !isFurthest) {
    location = text;
    lastLocation = location;
  }

  // Cheapest
  if (isCheapest) {
    const loc = lastLocation || "this area";
    return `Cheapest hotels in ${loc}:
• Budget Stay – €45/night (7 km from center)
• City Saver – €50/night (6 km)
• Economy Lodge – €55/night (8 km)`;
  }

  // Closest
  if (isClosest) {
    const loc = lastLocation || "this area";
    return `Closest hotels to the city center in ${loc}:
• Central Plaza – €140/night (0.5 km)
• Downtown Suites – €125/night (0.8 km)
• City Heart Hotel – €115/night (1 km)`;
  }

  // Furthest
  if (isFurthest) {
    const loc = lastLocation || "this area";
    return `Hotels furthest from the city center in ${loc}:
• Highway Motel – €55/night (15 km)
• Airport View – €60/night (12 km)
• Suburban Comfort – €65/night (14 km)`;
  }

  // Pricing request
  if (text.includes("price") || text.includes("pricing")) {
    const loc = location || lastLocation || "this area";
    return `Hotel prices in ${loc} typically range:
• €45–70 (budget, outside center)
• €80–120 (mid-range)
• €130+ (central hotels)`;
  }

  // Location only
  if (location) {
    return `Looking for hotels in ${location}. Would you like the cheapest, closest, or furthest options?`;
  }

  // Fallback
  return "Please provide a location or ask for cheapest, closest, or furthest hotels.";
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
