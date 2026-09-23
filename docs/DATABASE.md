# VELoop Rewards — Database Schema & Architecture

This document defines the MongoDB schemas, indexing strategies, relationships, and transaction flow for the VELoop Daily Streak & Rewards System.

---

## 1. Entity Relationship Model

```
       ┌──────────────────┐
       │      User        │
       └────────┬─────────┘
                │ 1:1
                ├─────────────────────────────┐
                │                             │
                ▼                             ▼
       ┌──────────────────┐          ┌──────────────────┐
       │     Wallet       │          │   StreakCycle    │
       └────────┬─────────┘          └────────┬─────────┘
                │ 1:N                         │ 1:N
                ▼                             ▼
  ┌───────────────────────────┐  ┌───────────────────────────┐
  │     WalletTransaction     │  │        StreakClaim        │
  │ (balanceBefore/After, tx) │  │  (unique: user+cycle+day) │
  └───────────────────────────┘  └────────────┬──────────────┘
                                              │ Snapshot
                                              ▼
                                 ┌───────────────────────────┐
                                 │       StreakReward        │
                                 │    (7-Day Config Store)   │
                                 └───────────────────────────┘
```

---

## 2. Collections & Schema Details

### 2.1 `User`
Stores user profile, authentication hashes, and roles.
```javascript
{
  _id: ObjectId,
  username: { type: String, unique: true, index: true },
  email: { type: String, unique: true, index: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: 'VELoop Member' },
  role: { type: String, enum: ['USER', 'ADMIN', 'TESTER'], default: 'USER' },
  isActive: { type: Boolean, default: true },
  createdAt: Date,
  updatedAt: Date
}
```

### 2.2 `Wallet`
Maintains user balances. Updated atomically during reward credit.
```javascript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User', unique: true, required: true },
  vesBalance: { type: Number, default: 100, min: 0 },
  gemsBalance: { type: Number, default: 120, min: 0 }, // Initial Gems on Navbar
  amazonVouchersTotal: { type: Number, default: 0, min: 0 },
  createdAt: Date,
  updatedAt: Date
}
```

### 2.3 `StreakReward`
Defines the 7-day streak rewards. Configurable via backend.
```javascript
{
  _id: ObjectId,
  day: { type: Number, unique: true, min: 1, max: 30 },
  title: { type: String, default: 'Daily Reward' },
  subtitle: { type: String, default: '' },
  rewardType: { type: String, enum: ['VES', 'GIFT_CARD', 'ULTIMATE_GIFT_CARD', 'SPECIAL'] },
  currency: { type: String, default: 'VES' },
  amount: { type: Number, required: true },
  assetType: { type: String, enum: ['coin', 'coin-stack', 'gift-box', 'amazon-card', 'crown'] },
  badge: { type: String, default: null }, // 'Today', 'VIP', 'Gift Card', 'Coin'
  active: { type: Boolean, default: true },
  metadata: { type: Object, default: {} }
}
```

### 2.4 `StreakCycle`
Represents an active or completed 7-day streak progression.
```javascript
{
  _id: ObjectId,
  cycleId: { type: String, unique: true, index: true },
  userId: { type: ObjectId, ref: 'User', required: true, index: true },
  cycleNumber: { type: Number, default: 1 },
  status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'RESET'], default: 'ACTIVE' },
  currentStreak: { type: Number, default: 0 },
  checkedInCount: { type: Number, default: 0 },
  lastClaimAt: { type: Date, default: null },
  nextClaimAt: { type: Date, default: null },
  resetReason: { type: String, default: null },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
}
```

### 2.5 `StreakClaim` (Section 62)
Immutable record of each check-in.
```javascript
{
  _id: ObjectId,
  claimId: { type: String, unique: true, index: true },
  userId: { type: ObjectId, ref: 'User', required: true, index: true },
  cycleId: { type: String, required: true, index: true },
  day: { type: Number, required: true, min: 1, max: 30 },
  rewardSnapshot: {
    title: String,
    subtitle: String,
    rewardType: String,
    currency: String,
    amount: Number,
    assetType: String
  },
  status: { type: String, enum: ['SUCCESS', 'FAILED'], default: 'SUCCESS' },
  transactionId: { type: String, required: true },
  claimedAt: { type: Date, default: Date.now },
  ipAddress: { type: String, default: '' }
}
```
**Compound Unique Index**:
```javascript
streakClaimSchema.index({ userId: 1, cycleId: 1, day: 1 }, { unique: true });
```
*Enforces database-level protection against race conditions and concurrent double-claims.*

### 2.6 `WalletTransaction` (Section 63)
Immutable financial audit ledger tracking every balance change.
```javascript
{
  _id: ObjectId,
  transactionId: { type: String, unique: true, index: true },
  userId: { type: ObjectId, ref: 'User', required: true, index: true },
  currency: { type: String, required: true },
  type: { type: String, enum: ['CREDIT', 'DEBIT'], default: 'CREDIT' },
  amount: { type: Number, required: true },
  source: { type: String, default: 'DAILY_STREAK' },
  referenceId: { type: String, required: true },
  streakDay: { type: Number, default: null },
  balanceBefore: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  status: { type: String, enum: ['COMPLETED', 'PENDING', 'FAILED'], default: 'COMPLETED' },
  createdAt: { type: Date, default: Date.now }
}
```

### 2.7 `AuditLog` (Section 64)
Logs all security actions and anti-cheat triggers for forensic inspection.
```javascript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User', index: true },
  event: {
    type: String,
    enum: [
      'STREAK_CLAIM_REQUEST',
      'STREAK_CLAIM_SUCCESS',
      'STREAK_CLAIM_REJECTED',
      'STREAK_RESET',
      'DUPLICATE_CLAIM',
      'INVALID_CLAIM',
      'USER_LOGIN',
      'USER_REGISTER',
      'DEV_TIME_ADVANCE'
    ]
  },
  details: { type: Object, default: {} },
  ipAddress: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now }
}
```

---

## 3. Database Integrity & Traceability (Section 104)

After every successful claim, a fully traceable relationship is established:
```
Streak Claim (CLM-...)
  └── Reward Snapshot (+10 VEs)
       └── Wallet Transaction (TX-...)
            ├── balanceBefore: 100
            ├── balanceAfter: 110
            └── Updated User Wallet (vesBalance: 110)
```
Evaluators can query `db.streakclaims.find({ userId })` and `db.wallettransactions.find({ userId })` to audit the entire check-in history.
