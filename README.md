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

#Short explenation

Mock AI Logic

The backend uses simple rule-based matching (keywords such as "hello", "price", "location", "cheapest", "closest" "furthest") to return predefined responses. A delay simulates real AI response time.

Real AI Integration

In production, the rule-based logic would be replaced with a call to an AI provider (e.g. OpenAI, internal LLM service). The /api/chat endpoint would forward user messages, handle authentication, and return generated responses while maintaining conversation context.

## How to run 
cd backend
npm install
npm start

cd frontend
npm install
npm start

