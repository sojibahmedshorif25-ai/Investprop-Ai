<div align="center">

# 🏠 InvestProp AI — Property Investment Intelligence

### *AI-Powered Real Estate Analysis & Investment Platform*

![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude_AI-3.5_Sonnet-D97757?style=for-the-badge&logo=anthropic&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://investprop-ai.vercel.app)
[![Server API](https://img.shields.io/badge/Server_API-Render-4D6E4F?style=for-the-badge&logo=render&logoColor=white)](https://investprop-ai.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 📖 Overview

**InvestProp AI** is a production-ready SaaS platform that leverages **Claude 3.5 Sonnet** to provide property investors with intelligent market analysis, smart recommendations, risk assessment, document intelligence, and an AI chat assistant. Make data-driven investment decisions with the power of AI.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🧠 **AI Investment Scoring** | 0-100 score with market analysis, location quality, financial potential |
| 🎯 **Smart Recommendations** | Personalized property matching based on your portfolio & preferences |
| ⚠️ **Risk Analysis & Alerts** | Identify red flags and investment risks |
| 📈 **Market Trend Analysis** | ROI projections (conservative/moderate/optimistic) |
| 📁 **Document Intelligence** | AI-powered document analysis with key dates & red flags |
| 💬 **AI Chat Assistant** | Streaming SSE-powered conversational AI |
| 📊 **Portfolio Management** | Track total value, monthly income, average ROI |
| ⭐ **Reviews & Ratings** | Community-driven property reviews |
| 🔐 **Google OAuth** | One-click sign-in with Google |
| 📱 **Responsive Design** | Works beautifully on all devices |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | App Router + SSR |
| **React 18** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI primitives (Radix) |
| **TanStack Query v5** | Server state management |
| **React Hook Form + Zod** | Forms & validation |
| **Recharts** | Data visualizations |
| **Framer Motion** | Animations |
| **Lucide React** | Icons |
| **react-dropzone** | File uploads |
| **socket.io-client** | Real-time updates |

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | HTTP framework |
| **TypeScript** | Type safety |
| **MongoDB + Mongoose** | Database & ODM |
| **Claude API (Anthropic)** | AI intelligence |
| **JWT + bcryptjs** | Authentication |
| **Passport.js** | Google OAuth |
| **Socket.IO** | Real-time notifications |
| **Sharp** | Image processing |
| **Multer** | File uploads |
| **Helmet** | Security headers |
| **Morgan + Pino** | Logging |
| **Joi + Zod** | Input validation |

---

## 📁 Project Structure

```
Investprop-Ai/
├── frontend/                              # 🎨 Next.js 14 Frontend
│   └── src/
│       ├── app/                           # App Router pages
│       │   ├── about/                     # About page
│       │   ├── auth/callback/             # OAuth callback
│       │   ├── contact/                   # Contact page
│       │   ├── dashboard/                 # User dashboard
│       │   ├── explore/                   # Browse properties
│       │   ├── properties/[id]/           # Property detail
│       │   ├── login/                     # Login page
│       │   ├── register/                  # Register page
│       │   └── page.tsx                   # Homepage
│       ├── components/                    # UI components
│       │   ├── ChatAssistant.tsx          # AI Chat interface
│       │   ├── Navbar.tsx
│       │   ├── Footer.tsx
│       │   └── ui/                        # shadcn components
│       ├── lib/                           # Utilities
│       └── types/                         # TypeScript types
│
├── backend/                               # ⚙️ Express + TypeScript Backend
│   └── src/
│       ├── app.ts                         # Server entry
│       ├── config/                        # DB, env, passport
│       ├── controllers/                   # Route handlers
│       │   ├── ai.controller.ts           # AI endpoints
│       │   ├── auth.controller.ts         # Authentication
│       │   ├── property.controller.ts     # Property CRUD
│       │   └── product.controller.ts      # Products
│       ├── services/
│       │   └── ai.service.ts              # Claude API integration
│       ├── middleware/                     # auth, errorHandler, validate
│       ├── models/                        # 8 Mongoose schemas
│       ├── routes/                        # API routes
│       ├── data/                          # Seed data
│       └── utils/
│
└── README.md
```

---

## 🧠 AI Integration (Claude 3.5 Sonnet)

### Property Investment Analysis
```
Input: Property data + market conditions
Output: {
  score: 85/100,
  breakdown: {
    marketAnalysis: "...",
    locationQuality: "...",
    financialPotential: "...",
    legalRiskAssessment: "..."
  },
  roiProjections: {
    conservative: "8% annually",
    moderate: "12% annually",
    optimistic: "18% annually"
  },
  recommendation: "Strong Buy"
}
```

### Smart Recommendations
- Matches user preferences + portfolio against available properties
- Returns top 5 with matchScore, reasoning, projectedROI
- Context-aware: considers existing holdings

### AI Chat Assistant
- **Streaming:** Server-Sent Events (SSE) for real-time responses
- Context: last 10 messages, current property, user profile
- Conversation persistence in MongoDB

### Document Intelligence
- Extracts: document type, key dates, parties, property details
- Identifies red flags and legal issues
- Generates action items and recommendations

---

## 🗃️ Database Models

| Model | Key Fields |
|-------|------------|
| **User** | name, email, avatar, investmentGoals, preferredLocations, budgetRange, role |
| **Property** | title, type, price, location, bedrooms, bathrooms, sqft, investmentScore, ROI |
| **ChatConversation** | user, messages[], title |
| **Document** | user, property, filename, analysis{} |
| **Portfolio** | user, properties[], totalValue, totalMonthlyIncome, averageROI |
| **Preference** | user, investmentGoals, budgetRange, riskTolerance |
| **Review** | property, author, rating, title, content |
| **Product** | title, price, description, category |

---

## 📡 API Endpoints

<details>
<summary><b>🔐 Authentication</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Email/password login |
| GET | `/api/auth/google` | No | Google OAuth redirect |
| GET | `/api/auth/google/callback` | No | Google OAuth callback |
| GET | `/api/auth/profile` | Yes | Get profile |
| PUT | `/api/auth/profile` | Yes | Update profile |

</details>

<details>
<summary><b>🏠 Properties</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/properties` | No | List with filters/pagination |
| GET | `/api/properties/:id` | Optional | Property detail |
| POST | `/api/properties` | Yes | Create property |
| PUT | `/api/properties/:id` | Yes | Update property |
| DELETE | `/api/properties/:id` | Yes | Delete property |
| POST | `/api/properties/:id/save` | Yes | Save/unsave |
| POST | `/api/properties/:id/reviews` | Yes | Add review |

</details>

<details>
<summary><b>🤖 AI Features</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/ai/analyze-property` | Yes | AI investment scoring |
| GET | `/api/ai/recommendations` | Yes | Smart recommendations |
| POST | `/api/ai/chat` | Yes | Streaming AI chat (SSE) |
| POST | `/api/ai/analyze-document` | Yes | Document intelligence |

</details>

---

## 🔒 Security Features

| Feature | Implementation |
|---------|---------------|
| JWT Auth | Access (1h) + Refresh (7d) tokens |
| Password Hashing | bcrypt (12 rounds) |
| Google OAuth | passport-google-oauth20 |
| Rate Limiting | 100 req/min |
| CORS | Whitelisted origins |
| Helmet | HTTP security headers |
| Input Validation | Joi + Zod schemas |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0
- **MongoDB Atlas** account
- **Anthropic API Key** (for Claude AI)

### Installation

```bash
# Clone
git clone https://github.com/sojibahmedshorif25-ai/Investprop-Ai.git

# Install Frontend
cd frontend && npm install

# Install Backend
cd ../backend && npm install
```

### Environment Variables

```env
# Backend
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/investprop
JWT_SECRET=your_jwt_secret
ANTHROPIC_API_KEY=sk-ant-xxxxx
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Run Development

```bash
# Frontend (http://localhost:3000)
cd frontend && npm run dev

# Backend (http://localhost:5000)
cd backend && npm run dev
```

### Demo Credentials

| Email | Password |
|-------|----------|
| demo@investor.com | Demo@12345 |

---

## 🌐 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | **Vercel** | [investprop-ai.vercel.app](https://investprop-ai.vercel.app) |
| Backend | **Render** | [investprop-ai.onrender.com](https://investprop-ai.onrender.com) |
| Database | **MongoDB Atlas** | Cloud |

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Sojib Ahmed**

[![GitHub](https://img.shields.io/badge/GitHub-sojibahmedshorif25--ai-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sojibahmedshorif25-ai)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Sojib_Ahmed-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sojib-ahmed-shorif)

---

<div align="center">

**⭐ Star this repo if you find it impressive!**

</div>
