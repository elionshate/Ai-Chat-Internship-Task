# Simple AI Chat Interface (Mocked Backend)

## Tech Stack
- Frontend: React
- Backend: Node.js (Express)

## Features
- Chat UI with message history
- Rule-based mock AI responses
- Typing indicator
- Message timestamps
- Basic error handling
- Mobile-friendly layout

## AI Chat Logic

### How It Works

The bot uses **rule-based matching** to simulate AI responses. Here's the conversation flow:

1. **Initial Greeting** ("hello", "hi")
   - Bot asks: "Which city or location are you looking for hotels in?"
   - Requires user to specify a location before providing pricing

2. **Location Detection**
   - Bot extracts the **first non-keyword word** from the message
   - Recognizes patterns like "in [city]" or standalone city names
   - Remembers the last location for follow-up queries
   - Examples: "berlin cheapest" → extracts "berlin"; "hotels in paris" → extracts "paris"

3. **Pricing Queries** (require a location)
   - **"cheapest"**: Shows budget hotels (€45–55/night, 6–8 km from center)
   - **"closest"**: Shows hotels near city center (€115–140/night, 0.5–1 km)
   - **"furthest"**: Shows hotels far from center (€55–65/night, 12–15 km)
   - **"price" / "pricing"**: Shows general price ranges by category
   - If no location is set, bot prompts: "Please tell me which city first"

4. **Smart Responses**
   - Bot confirms detected location: "Got it! Looking for hotels in [city]..."
   - All responses include hotel names, prices, and distances
   - 1-second simulated delay before each response

### Example Conversation
```
User: hello
Bot: Which city or location are you looking for hotels in?

User: berlin cheapest
Bot: Cheapest hotels in berlin:
     • Budget Stay – €45/night (7 km from center)
     • City Saver – €50/night (6 km)
     • Economy Lodge – €55/night (8 km)

User: closest
Bot: Closest hotels to the city center in berlin:
     • Central Plaza – €140/night (0.5 km)
     • Downtown Suites – €125/night (0.8 km)
     • City Heart Hotel – €115/night (1 km)
```

### Real AI Integration

In production, replace the rule-based logic with calls to an AI provider (OpenAI, internal LLM, etc.). The `/api/chat` endpoint would:
- Forward user messages with conversation context
- Handle authentication tokens
- Return dynamically generated responses
- Query a real hotel database instead of mock data

## Local Development

### Backend
```bash
cd backend
npm install
npm run dev # auto-restarts with nodemon
```

Environment (optional): create `backend/.env` from `backend/.env.example`.

### Frontend
```bash
cd frontend
npm install
npm start
```

Environment (optional): create `frontend/.env` from `frontend/.env.example`.

By default, the frontend calls `http://localhost:5000/api/chat`. You can override via `REACT_APP_API_URL`.

## Docker

### Run Both Services

Build and run the entire app (frontend + backend) with one command:

```bash
docker compose up --build
```

### Access the App

**On the same machine:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

**From mobile device (same WiFi network):**
1. Get your machine's local IP:
   ```bash
   ipconfig | Select-String "IPv4 Address"
   ```
   Example: `192.168.125.100`

2. Open on mobile:
   ```
   http://192.168.125.100:3000
   ```

**Requirements for mobile access:**
- Mobile device must be on the same WiFi network as your computer
- Windows Firewall must allow incoming connections on ports 3000 and 5000
- If connection fails, check firewall settings or temporarily disable Windows Defender Firewall for testing

### Stop and Cleanup

```bash
docker compose down
```
