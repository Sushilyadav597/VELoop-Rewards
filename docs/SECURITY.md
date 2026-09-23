# VELoop Rewards — Security & Anti-Cheat Architecture

This document outlines the security controls, anti-cheat implementations, concurrency mechanisms, and identity protection safeguards implemented across the Daily Streak system.

---

## 1. Threat Matrix & Countermeasures

### 1.1 DevTools State Manipulation (Section 96)
- **Threat**: User opens Chrome/React DevTools and manually sets `streak = 7` or changes card states to `AVAILABLE`.
- **Defense**: The client UI is purely a display layer. When the user clicks "Claim", the client simply dispatches `POST /api/daily-streak/claim`. The backend recalculates the user's eligible day strictly from stored database records. Frontend values have zero influence on claim execution.

### 1.2 Device Clock Forward Shift (Section 11, 46, 47, 97)
- **Threat**: User sets phone or computer clock forward by 24 hours to skip the countdown.
- **Defense**: All timestamps (`serverTime`, `nextClaimAt`) originate from the server. The frontend countdown calculates visual progress relative to the server offset (`nextClaimAt - estimatedServerTime`). If the client modifies their clock, the server timestamp remains unchanged. When the claim request hits the API, the backend evaluates `now < nextClaimAt` using its own server clock and rejects the attempt with `400 Bad Request`.

### 1.3 Arbitrary Reward Injection (Section 36, 98)
- **Threat**: An attacker dispatches `{ day: 2, reward: 1000000, currency: "VES" }` via cURL or Postman.
- **Defense**: Any `reward`, `amount`, `currency`, or `streak` values supplied in the request body are disregarded. The backend retrieves the reward configuration strictly from `StreakReward.findOne({ day: eligibleDay })`.

### 1.4 Sequential Day Jumping (Section 14, 99)
- **Threat**: A user eligible for Day 2 submits `{ day: 7 }` to jump directly to the ₹5 Amazon Gift Card.
- **Defense**: The backend verifies that `Day N - 1` has a completed claim record in the active cycle. If `day != nextDayToClaim`, the request is logged in `AuditLog` as `INVALID_CLAIM` and rejected with `400 Bad Request`.

### 1.5 Cross-User Account Hijacking (Section 44, 45, 100)
- **Threat**: User A sends `{ userId: "USER_B" }` in the POST request to claim User B's milestone.
- **Defense**: The user identity is extracted solely from the cryptographically verified JWT token in the `Authorization: Bearer` header. Any client-sent `userId` in the body or URL query is ignored.

### 1.6 Double-Click & Concurrent Race Conditions (Section 40, 41, 42, 101, 102)
- **Threat**: User clicks "Claim" twice rapidly or scripts two simultaneous `POST /claim` requests across multiple browser tabs to claim double rewards.
- **Defense Multi-Layering**:
  1. **Frontend Button Locking**: Button immediately disables and enters processing state.
  2. **In-Flight Lock**: Backend maintains an active memory set lock per `userId`. Concurrent requests for the same user trigger an immediate `409 Conflict`.
  3. **Database Unique Constraint**: `StreakClaim` collection enforces a compound unique index on `{ userId: 1, cycleId: 1, day: 1 }`. MongoDB rejects duplicate insertions at the database engine level with duplicate key code `11000`.

---

## 2. Cryptographic Authentication & JWT Configuration

- **Algorithm**: HMAC SHA-256 (`HS256`)
- **Payload**:
  ```json
  {
    "userId": "66f1c4...",
    "username": "alex",
    "role": "USER",
    "exp": 1727719200
  }
  ```
- **Expiration**: 7 Days
- Protected routes validate the bearer token via `auth.middleware.js` before invoking any business logic.

---

## 3. Audit Logging (Section 64)

All security-sensitive operations are immutably logged into the `AuditLog` collection:
- `STREAK_CLAIM_REQUEST`: Initial claim trigger
- `STREAK_CLAIM_SUCCESS`: Successfully verified & credited claim
- `STREAK_CLAIM_REJECTED`: Cooldown violation or eligibility rejection
- `STREAK_RESET`: Missed window detection trigger
- `DUPLICATE_CLAIM`: Concurrency collision or double-click attempt blocked
- `INVALID_CLAIM`: Tampered payload or day jump detected

Evaluators can inspect logs in real time via the Evaluator Toolbar in the UI or by calling `GET /api/dev/audit-logs`.
