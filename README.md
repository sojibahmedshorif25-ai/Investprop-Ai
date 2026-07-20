# 🏢 InvestProp AI - AI-Powered Property Investment Intelligence Platform

A production-ready, full-stack SaaS application that leverages AI to provide property investors with intelligent market analysis, personalized recommendations, risk assessment, and investment guidance.

## 🌐 Live Demo

- **Frontend:** [https://investprop-ai.vercel.app](https://investprop-ai.vercel.app)
- **Backend API:** [https://investprop-ai.onrender.com](https://investprop-ai.onrender.com/api/health)

### Demo Credentials
- **Email:** `demo@investor.com`
- **Password:** `Demo@12345`

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** TanStack Query v5
- **Charts:** Recharts
- **Form Validation:** React Hook Form + Zod

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js with TypeScript
- **Database:** MongoDB (Atlas / In-Memory fallback)
- **Authentication:** JWT + Google OAuth 2.0
- **AI/LLM:** Claude API (Anthropic) - Claude 3.5 Sonnet
- **Rate Limiting:** express-rate-limit
- **Deployment:** Render (Backend) + Vercel (Frontend)

## Features

- 🤖 **AI Investment Scoring** - Automated property analysis and scoring
- 🎯 **Smart Recommendations** - Personalized property matching
- ⚠️ **Risk Analysis & Alerts** - Identify potential investment risks
- 📈 **Market Trend Analysis** - Real-time market data and predictions
- 📁 **Portfolio Management** - Track and optimize your portfolio
- 📄 **Document Intelligence** - AI-powered document analysis
- 💬 **AI Chat Assistant** - Context-aware investment advisor
- 🔐 **Secure Authentication** - JWT + Google OAuth

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Anthropic API key (for AI features)

### Environment Variables

Copy `.env.example` to `.env` in the backend directory and fill in the required values:

```bash
cp backend/.env.example backend/.env
```

### Installation

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Development

```bash
# Run backend (from backend directory)
npm run dev

# Run frontend (from frontend directory)
npm run dev
```

### Seed Database

```bash
cd backend
npm run seed
```

### Demo Account

- **Email:** demo@investor.com
- **Password:** Demo@12345
- Pre-populated with 6 sample properties and investment data

## Project Structure

```
project-root/
├── frontend/          # Next.js 14 application
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/# React components
│   │   ├── lib/       # Utilities and API client
│   │   └── types/     # TypeScript types
│   └── ...
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── models/     # Mongoose models
│   │   ├── routes/     # API routes
│   │   ├── services/   # Business logic & AI
│   │   └── middleware/ # Auth, validation, errors
│   └── ...
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh-token`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

### Properties
- `GET /api/properties` - List with filters and pagination
- `POST /api/properties` - Create property
- `GET /api/properties/:id` - Get details
- `PUT /api/properties/:id` - Update
- `DELETE /api/properties/:id` - Delete
- `GET /api/properties/:id/reviews` - Get reviews
- `POST /api/properties/:id/reviews` - Add review
- `POST /api/properties/:id/save` - Save/unsave

### AI Features
- `POST /api/ai/analyze-property` - AI investment scoring
- `GET /api/ai/recommendations` - Smart recommendations
- `POST /api/ai/chat` - Chat with AI (streaming)
- `POST /api/ai/analyze-document` - Document analysis

## License

MIT
