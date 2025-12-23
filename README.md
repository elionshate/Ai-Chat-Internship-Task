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

This will:
1. Build the backend Docker image (Node.js app)
2. Build the frontend Docker image (React app compiled + Nginx server)
3. Start both containers and connect them

### Access the App

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### Stop and Cleanup

```bash
docker compose down
```

### Configuration

Docker Compose sets these environment variables by default:

**Backend** (port 5000):
- `PORT=5000`
- `CORS_ORIGIN=http://localhost:3000`

**Frontend** (port 3000):
- `REACT_APP_API_URL=http://localhost:5000`

To customize, edit `docker-compose.yml` or create a `.env.local` file in the project root with:
```env
PORT=5000
CORS_ORIGIN=http://localhost:3000
REACT_APP_API_URL=http://localhost:5000
```

### Docker Architecture

**Backend Dockerfile** (`backend/Dockerfile`):
- Node.js 20 Alpine image
- Production dependencies only (`npm install --omit=dev`)
- Exposes port 5000

**Frontend Dockerfile** (`frontend/Dockerfile`):
- Multi-stage build: Node 20 for React build → Nginx Alpine to serve
- React production build optimized
- Nginx configured for SPA routing (`try_files` → `index.html`)
- Exposes port 80 (mapped to 3000 in compose)

## Notes
- Backend security headers enabled via `helmet`
- CORS is configurable through `CORS_ORIGIN` (comma-separated origins)
- Health check endpoint available at `GET /health`
- Backend auto-restarts on file changes with `npm run dev` (local dev only)
- Frontend uses CRA proxy for seamless local API calls