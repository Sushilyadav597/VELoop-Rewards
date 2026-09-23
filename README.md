# VELoop Rewards — Daily Streak & Rewards System

[![Full-Stack MERN](https://img.shields.io/badge/Stack-MERN-8B5CF6.svg)](https://github.com)
[![Status](https://img.shields.io/badge/Status-Internship%20Complete-10B981.svg)](https://github.com)
[![License](https://img.shields.io/badge/License-ISC-F59E0B.svg)](https://github.com)

A complete, secure, backend-driven Daily Streak and Rewards system built for **VELoop Rewards**. The system allows authenticated members to check in daily, maintain an unbroken streak across 7 reward milestones, and unlock increasingly valuable rewards—culminating in the **Day 7 Ultimate Reward (₹5 Amazon Gift Card)**.

---

## 🌟 Visual Preview & Design Language

The frontend matches the supplied VELoop Rewards design language:
- **Theme**: Deep space luxury (`#070514`, `#150F38`, `#1C154A`)
- **Accents**: Imperial Gold (`#F59E0B`), Royal Violet (`#8B5CF6`), and Success Emerald (`#10B981`)
- **Typography**: Google Fonts (*Outfit* for bold headings, *Inter* for crisp body text)
- **Visuals**: Dynamic 3D assets for Gold Coins, Purple Satin Gift Box, Amazon Gift Card, and Imperial Crown with gentle levitation micro-animations
- **Responsive Layouts**: Pixel-perfect viewports for Desktop (7 columns), Tablet (4/3 columns), and Mobile (2x4 grid).

---

## 🏛️ System Architecture & Backend Authority

### The Fundamental Rule
> **"React controls the presentation. The backend controls the streak."**

The browser and DevTools can be manipulated by malicious actors. Therefore, **the frontend is never the source of truth**.

```
  ┌────────────────────────────────────────────────────────┐
  │                 REACT FRONTEND (CLIENT)                │
  │  - Presentation, Micro-Animations & Sound              │
  │  - Visual Countdown (calculated from server offset)    │
  │  - CPA Advertisement Demo Modal                        │
  └───────────────────────────┬────────────────────────────┘
                              │ JWT Bearer Authentication
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │                 EXPRESS REST API & NODE.JS             │
  │  - Token Verification (User ID derived from JWT)       │
  │  - Atomic Concurrency & In-Flight Request Locking      │
  │  - Rate Limiting & Input Sanitization                  │
  └───────────────────────────┬────────────────────────────┘
                              │
  ┌───────────────────────────┴────────────────────────────┐
  │                 BACKEND SERVICE LAYER                  │
  │  ├── streak.service.js    (Eligibility, Missed Check)  │
  │  ├── reward.service.js    (Config-driven values)       │
  │  ├── wallet.service.js    (Atomic balance increment)   │
  │  └── audit.service.js     (Anti-cheat & event trail)   │
  └───────────────────────────┬────────────────────────────┘
                              │
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │                 MONGODB DATA LAYER                     │
  │  ├── Users              (Credentials & Identity)       │
  │  ├── Wallets            (VES, Gems & Amazon Balances)  │
  │  ├── StreakConfigs      (Intervals & Grace Windows)    │
  │  ├── StreakRewards      (7-Day Milestones)             │
  │  ├── StreakCycles       (Active & Completed Cycles)    │
  │  ├── StreakClaims       (Unique: userId+cycleId+day)   │
  │  ├── WalletTransactions (Immutable Financial Ledger)   │
  │  └── AuditLogs          (Security Trail)               │
  └────────────────────────────────────────────────────────┘
```

---

## 🛡️ Anti-Cheat & Security Features

| Attack Vector | Vulnerability Attempt | Backend Defense & Protection |
| :--- | :--- | :--- |
| **DevTools Tampering** | Changing `streak = 7` or `claimed = true` in React DevTools | State is re-fetched and validated against MongoDB on every action. Client state has zero authority. |
| **Client Clock Manipulation** | Advancing phone / PC clock by 24h to unlock rewards early | Cooldown is calculated against authoritative `serverTime`. Frontend countdown uses `nextClaimAt - serverTime`. |
| **Fake Reward Injection** | Sending `{ day: 2, reward: 999999, currency: 'VES' }` in POST body | Request body reward parameters are completely ignored. The reward amount is strictly loaded from backend database configuration. |
| **Illegal Day Jumping** | Submitting `{ day: 7 }` while only eligible for Day 2 | Backend checks previous-day completion and verifies `nextDayToClaim === eligibleDay`. Request is rejected with `400 Bad Request`. |
| **Cross-User Attack** | Sending `{ userId: 'other_user' }` in body | Identity is extracted exclusively from the cryptographically verified JWT token header. Client `userId` is ignored. |
| **Double-Click & Race Conditions** | Spamming claim button simultaneously | Concurrency locks and MongoDB compound unique index `(userId, cycleId, day)` guarantee **exactly one claim** succeeds. The second receives `409 Conflict`. |

---

## 📅 Streak Logic & 7-Day Cycle

1. **Cycle Milestones**:
   - **Day 1**: +5 VEs (Coins)
   - **Day 2**: +10 VEs (Coins)
   - **Day 3**: +15 VEs (Coins)
   - **Day 4**: ₹1 Amazon Gift Card (Gift Box)
   - **Day 5**: ₹2 Amazon Gift Card (Amazon Card)
   - **Day 6**: +30 VEs (Big Coins)
   - **Day 7**: ₹5 Amazon Gift Card (Imperial Crown - Ultimate Milestone)
2. **24-Hour Cooldown**:
   - After claiming Day $N$, Day $N+1$ unlocks after the configured cooldown (default 24h).
   - Time calculations are driven by `claimCooldownMs` stored in `StreakConfig` (never hardcoded `86400000`).
3. **Missed Day Detection & Reset**:
   - If a user fails to claim within the required window (`cooldown + gracePeriod`), their streak is marked as **MISSED**.
   - Current cycle transitions to `RESET`, user streak resets to 0, and Day 1 becomes actionable again.
4. **Cycle Looping**:
   - Claiming Day 7 marks the cycle as `COMPLETED`. The subsequent check-in starts Cycle 2 Day 1 seamlessly.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/veloop_rewards`) or free cloud MongoDB Atlas cluster. *(Note: Backend includes in-memory persistence fallback for immediate zero-config testing if MongoDB is not running).*

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/veloop-daily-streak.git
cd veloop-daily-streak

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

#### Backend (`backend/.env`):
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/veloop_rewards
JWT_SECRET=veloop_super_secure_jwt_secret_key_2026_internship_production
CLIENT_URL=http://localhost:5173
```

#### Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5001
```

### 3. Database Seeding

Initialize standard 7-day reward configuration, system settings, and demo accounts:
```bash
cd backend
npm run seed
```

Pre-seeded Demo Accounts (password: `password123`):
- `demo_new`: New user starting at Day 1
- `demo_day2`: Active user with Day 1 claimed, Day 2 eligible
- `demo_day7`: VIP user ready for Day 7 Ultimate Reward

### 4. Running Locally

Open two terminal windows:

```bash
# Terminal 1: Start Backend Server (runs on http://localhost:5001)
cd backend
npm run dev

# Terminal 2: Start Frontend Dev Server (runs on http://localhost:5173)
cd frontend
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧪 Testing & Interactive Evaluator Suite

An **Internship Evaluator & Anti-Cheat Toolbar** is docked at the bottom of the UI:

1. **Time Machine (+24h / +48h)**: Fast-forward virtual server time to test cooldown completion or trigger missed streak reset without waiting 24 real hours.
2. **Concurrency Test**: Fires 2 simultaneous claim requests over network; verifies exactly 1 succeeds and only single reward is credited.
3. **Fake Reward Injection**: Dispatches `{ reward: 999999 }` payload; verifies backend rejects tampering and grants authoritative reward.
4. **Live MongoDB Audit Trail**: Opens real-time modal inspecting `AuditLog` security events (`STREAK_CLAIM_SUCCESS`, `DUPLICATE_CLAIM`, `STREAK_RESET`).
5. **Instant Account Switcher**: Test Day 1 New, Day 2 Active, or Day 7 VIP in 1 click.

### Automated Test Suite
Run the automated verification suite:
```bash
cd backend
npm test
```

---

## 📁 Repository Structure

```
veloop-daily-streak/
├── backend/
│   ├── src/
│   │   ├── config/          # db.js, streakConfig.js
│   │   ├── controllers/     # streak.controller.js, auth.controller.js, dev.controller.js
│   │   ├── middleware/      # auth.middleware.js, errorHandler.middleware.js, rateLimiter.middleware.js
│   │   ├── models/          # User, Wallet, StreakConfig, StreakReward, StreakCycle, StreakClaim, WalletTransaction, AuditLog
│   │   ├── routes/          # streak.routes.js, auth.routes.js, wallet.routes.js, dev.routes.js
│   │   ├── services/        # streak.service.js, reward.service.js, wallet.service.js, audit.service.js
│   │   └── utils/           # time.utils.js
│   ├── seed/                # seed.js (database seeder)
│   ├── tests/               # streak.test.js (automated verification)
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── assets/          # 3D GoldCoins, GiftBox, AmazonCard, RoyalCrown, CalendarHero, GemIcon
│   │   ├── components/      # StreakHeader, HeroBanner, StreakStats, UltimateReward, RewardGrid, RewardCard, CpaDemo, ClaimModal, EvaluatorToolbar
│   │   ├── context/         # AuthContext.jsx, StreakContext.jsx
│   │   ├── hooks/           # useCountdown.js
│   │   ├── pages/DailyStreak/ # DailyStreakPage.jsx, DailyStreak.module.css
│   │   ├── services/        # api.js, streakApi.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE.md
│   ├── SECURITY.md
│   └── TESTING.md
├── postman/
│   └── VELoop_Rewards.postman_collection.json
└── README.md
```

---

## 🌐 Deployment Recommendations

- **Frontend**: Deploy on [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variable: `VITE_API_URL=https://your-backend.onrender.com`
- **Backend**: Deploy on [Render](https://render.com) or [Railway](https://railway.app)
  - Start command: `npm start`
  - Environment variables: `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) Free Tier M0 Cluster

---

## 📄 License
Project developed for the VELoop Rewards Full-Stack MERN Internship. All rights reserved.
