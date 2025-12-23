require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
// Security headers
app.use(helmet());

// CORS configuration via env (default: allow all)
const corsOrigin = process.env.CORS_ORIGIN;
const corsOptions = corsOrigin
  ? { origin: corsOrigin.split(",").map(s => s.trim()) }
  : {};
app.use(cors(corsOptions));
app.use(express.json());
let lastLocation = null;


function getMockReply(message) {
  const text = message.toLowerCase().trim();

  // Greeting - ask for location first
  if (text === "hello" || text === "hi") {
    return "Hello! Which city or location are you looking for hotels in?";
  }

  const isCheapest = text.includes("cheapest");
  const isClosest = text.includes("closest");
  const isFurthest = text.includes("furthest");

  // Extract location more robustly:
  // 1. Try "in [location]" pattern
  // 2. Try to extract first word if it's not a keyword
  // 3. Fall back to lastLocation
  let location = null;
  const inMatch = text.match(/in\s+([a-z]+)/);

  if (inMatch) {
    location = inMatch[1];
    lastLocation = location;
  } else {
    // Extract the first non-keyword word as location
    const words = text.split(/\s+/);
    const keywords = ["cheapest", "closest", "furthest", "price", "pricing"];
    
    for (const word of words) {
      if (!keywords.includes(word)) {
        location = word;
        lastLocation = location;
        break;
      }
    }
  }

  // Only provide pricing if location is specified
  if (isCheapest) {
    if (!location && !lastLocation) {
      return "Please tell me which city or location you're interested in, then I can show you the cheapest hotels.";
    }
    const loc = location || lastLocation;
    return `Cheapest hotels in ${loc}:
          • Budget Stay – €45/night (7 km from center)
          • City Saver – €50/night (6 km)
          • Economy Lodge – €55/night (8 km)`;
  }

  if (isClosest) {
    if (!location && !lastLocation) {
      return "Please tell me which city or location you're interested in, then I can show you the closest hotels to the center.";
    }
    const loc = location || lastLocation;
    return `Closest hotels to the city center in ${loc}:
            • Central Plaza – €140/night (0.5 km)
            • Downtown Suites – €125/night (0.8 km)
          • City Heart Hotel – €115/night (1 km)`;
  }

  if (isFurthest) {
    if (!location && !lastLocation) {
      return "Please tell me which city or location you're interested in, then I can show you the furthest hotels.";
    }
    const loc = location || lastLocation;
    return `Hotels furthest from the city center in ${loc}:
            • Highway Motel – €55/night (15 km)
            • Airport View – €60/night (12 km)
            • Suburban Comfort – €65/night (14 km)`;
  }

  if (text.includes("price") || text.includes("pricing")) {
    if (!location && !lastLocation) {
      return "Please tell me which city or location you're interested in for pricing information.";
    }
    const loc = location || lastLocation;
    return `Hotel prices in ${loc} typically range:
            • €45–70 (budget, outside center)
            • €80–120 (mid-range)
            • €130+ (central hotels)`;
  }

  // If we detected a location, confirm it
  if (location) {
    return `Got it! Looking for hotels in ${location}. Would you like the cheapest, closest, or furthest options?`;
  }

  return "Please provide a location (e.g., 'Berlin', 'Paris') or ask for cheapest, closest, or furthest hotels.";
}



// Healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

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
    }, 1000);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
