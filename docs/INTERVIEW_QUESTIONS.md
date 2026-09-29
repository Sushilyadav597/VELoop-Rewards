# VELoop Rewards — Project Submission & Technical Interview Guide

This guide contains the most critical and frequently asked interview/viva questions for the **VELoop Rewards (Daily Streak & Rewards System)** project, complete with high-scoring, technically rigorous answers directly reflecting the codebase architecture.

---

## 📑 Table of Contents
1. [60-Second Elevator Pitch](#1-60-second-elevator-pitch)
2. [High-Level Architecture & System Design](#2-high-level-architecture--system-design)
3. [Core Streak Mechanics & State Machine](#3-core-streak-mechanics--state-machine)
4. [Security & Anti-Cheat Safeguards](#4-security--anti-cheat-safeguards)
5. [Concurrency & Race Condition Handling](#5-concurrency--race-condition-handling)
6. [Database Schema & Data Modeling](#6-database-schema--data-modeling)
7. [Frontend Engineering & UX](#7-frontend-engineering--ux)
8. [Live Demonstration & Submission Strategy](#8-live-demonstration--submission-strategy)
9. [Examiner "Trap" & Scalability Questions](#9-examiner-trap--scalability-questions)

---

## 1. 60-Second Elevator Pitch

**Q: Can you briefly introduce your project and what problem it solves?**

> **Sample Answer:**
> *"VELoop Rewards is a production-grade, backend-authoritative Daily Streak and Rewards web application built on the MERN stack (MongoDB, Express.js, React, Node.js). It motivates daily user engagement through a gamified 7-day milestone ladder culminating in an ultimate Day 7 ₹5 Amazon Gift Card reward.*
>
> *Unlike naive streak apps where the client dictates the streak count or timer, VELoop Rewards follows the fundamental rule: **'React controls the presentation; the backend controls the streak.'** We engineered enterprise-grade defenses against client clock manipulation, DevTools state tampering, arbitrary payload injection, and concurrent double-click race conditions using in-flight memory locks and MongoDB compound unique indexes. The project also features an interactive Evaluator Toolbar for real-time testing of time progression and attack simulations."*

---

## 2. High-Level Architecture & System Design

### Q1: What is the core architectural philosophy of this application?
**Answer:**
The system is built on **Backend Authority**. In consumer gamification applications, rewards hold real economic value (e.g., currency, Amazon Gift Cards). Therefore, the client browser is treated as an **untrusted, hostile environment**.
- The client cannot tell the server what day it is on, what reward it should receive, or how much time has passed.
- The client simply sends an authenticated `POST /api/daily-streak/claim` request with a Bearer JWT.
- The backend evaluates eligibility from authoritative server time and database history, assigns the reward from database configuration, updates the wallet atomically, and creates an immutable audit trail.

### Q2: Walk me through the lifecycle of a `POST /api/daily-streak/claim` request.
**Answer:**
1. **Authentication (`auth.middleware.js`)**: Decodes and verifies the HMAC SHA-256 JWT header, extracting `req.user.id`.
2. **In-Flight Concurrency Guard (`streakClaimService.js`)**: Checks if `userId` already exists in the `inFlightClaims` `Set`. If yes, rejects immediately with `409 Conflict`.
3. **Account & Wallet Verification**: Ensures the user exists and is active, and retrieves their wallet record.
4. **State & Missed Day Evaluation (`streakService.js`)**: Evaluates `serverTime` against `lastClaimAt`, `claimCooldownMs`, and `claimGracePeriodMs`. If the user missed their window, the cycle is reset before proceeding.
5. **Reward Lookup**: Authoritatively loads the reward for `nextDayToClaim` from the `StreakReward` collection (ignoring any parameters sent in the client body).
6. **Atomic Persistence**:
   - Creates a `StreakClaim` record (enforced by a compound unique index `{ userId: 1, cycleId: 1, day: 1 }`).
   - Updates `StreakCycle` (increments streak, advances `lastClaimAt` and `nextClaimAt`).
   - Atomically updates `Wallet` balances and inserts an immutable `WalletTransaction` ledger entry.
   - Logs `STREAK_CLAIM_SUCCESS` in `AuditLog`.
7. **Cleanup & Response**: Removes `userId` from `inFlightClaims` in a `finally` block and returns the updated state to the client.

---

## 3. Core Streak Mechanics & State Machine

### Q1: How does the 7-day streak cycle work?
**Answer:**
- A user starts at Day 1 (Cycle 1).
- Claiming Day 1 awards +5 VEs and activates a 24-hour cooldown (`claimCooldownMs`).
- Once cooldown passes, the user enters the **ELIGIBLE** claim window for Day 2 (+10 VEs).
- This continues through Day 6 (+30 VEs) to Day 7 (Ultimate Reward: ₹5 Amazon Gift Card).
- Upon claiming Day 7, the cycle status transitions to `COMPLETED`, and the next claim automatically starts Cycle 2 Day 1 seamlessly.

### Q2: How do you detect and handle a missed day?
**Answer:**
- In `streakService.js`, the missed-day deadline is calculated as:
  $$\text{Deadline} = \text{lastClaimAt} + \text{claimCooldownMs} + \text{claimGracePeriodMs}$$
- When any status check or claim request arrives, the backend evaluates if $\text{serverTime} > \text{Deadline}$.
- If expired:
  1. The active cycle status transitions to `RESET`.
  2. The user's streak resets to `0`.
  3. A new cycle is initialized where Day 1 becomes actionable again.
  4. An audit event `STREAK_RESET` is recorded.

---

## 4. Security & Anti-Cheat Safeguards

### Q1: What happens if a user sets their PC or phone clock forward by 24 hours?
**Answer:**
- **Defense**: Device clock manipulation has zero effect.
- The server computes all cooldowns using `getServerTime()` on the server machine.
- The frontend countdown hook (`useCountdown.js`) calculates remaining time relative to the server offset (`serverTime - Date.now()`). Even if the user alters local time, the backend checks `serverTime < nextClaimAt` and rejects the request with `400 Bad Request` or `409 Conflict`.

### Q2: What if someone modifies React state using Chrome DevTools?
**Answer:**
- **Defense**: React state is strictly a presentation cache.
- If an attacker opens DevTools and changes `canClaim = true` or `currentStreak = 7`, clicking "Claim" simply triggers the standard endpoint.
- The backend ignores client state, recalculates the true state from MongoDB, detects that the user is on cooldown or on Day 1, and rejects the unauthorized claim.

### Q3: What if an attacker sends `{ day: 7, reward: 999999 }` in Postman?
**Answer:**
- **Defense**: The controller and claim service do not extract `day`, `amount`, or `currency` from `req.body`.
- All reward parameters are retrieved from the backend `StreakReward.findOne({ day: eligibleDay })`. The injected payload is completely discarded.

### Q4: How do you prevent cross-user account hijacking?
**Answer:**
- If User A sends `{ userId: "User_B_ID" }`, the backend completely ignores it.
- Identity is derived strictly from the cryptographically signed JWT token verified by `jwt.verify(token, JWT_SECRET)`.

---

## 5. Concurrency & Race Condition Handling

### Q1: What happens if a user double-clicks the "Claim" button or scripts simultaneous API calls?
**Answer:**
We implemented **Defense-in-Depth Concurrency Protection**:
1. **Client-Side Debouncing / Locking**: The React button immediately enters a disabled `isProcessing` state with visual loading spinners.
2. **Application-Level In-Flight Lock**: Node.js maintains an in-memory `Set` of active user claims (`inFlightClaims`). If a second request arrives while the first is still awaiting database I/O, it is immediately rejected with `409 Conflict`.
3. **Database-Level Compound Unique Index**:
   - `StreakClaim` collection has a compound unique index:
     `{ userId: 1, cycleId: 1, day: 1 }`
   - Even in multi-threaded/clustered servers, MongoDB guarantees atomic uniqueness at the storage engine level. If two requests slip through the memory lock, MongoDB throws error code `11000 (Duplicate Key Error)`.

### Q2: Does this project support MongoDB Transactions?
**Answer:**
Yes. In `streakClaimService.js`, the code inspects the MongoDB topology:
- If connected to a **Replica Set** (like MongoDB Atlas), it initializes a multi-document ACID transaction session (`session.startTransaction()`), guaranteeing all writes (claim record, cycle update, wallet balance, transaction ledger) commit together or rollback on failure.
- If running on a standalone single-node development instance where transactions aren't supported, it executes an atomic sequential fallback with duplicate key rollback protection.

---

## 6. Database Schema & Data Modeling

### Q1: Why separate `StreakCycle` and `StreakClaim` into their own collections instead of embedding them into `User`?
**Answer:**
- **Unbounded Document Growth**: Embedding hundreds of daily claims into the `User` document violates the 16MB MongoDB BSON limit over time and degrades query performance.
- **Auditing & Reporting**: Having individual `StreakClaim` documents allows efficient date-range queries, streak leaderboard aggregations, and historical analytics without loading user credentials.
- **Concurrency Isolation**: Updating a `StreakClaim` does not lock or compete with profile updates or auth changes on the `User` document.

### Q2: What is the purpose of `WalletTransaction`?
**Answer:**
`WalletTransaction` is an **immutable financial ledger**. In financial and reward systems, updating `wallet.balance += 5` without recording a transaction log makes reconciling discrepancies impossible.
Each transaction records:
- `balanceBefore` and `balanceAfter`
- `amount` and `currency` (VES or Amazon Gift Card)
- `referenceModel` ('StreakClaim') and `referenceId`
- Timestamp and description

---

## 7. Frontend Engineering & UX

### Q1: How does the countdown timer prevent drift without polling the server every second?
**Answer:**
- When the page loads, the server returns both `nextClaimAt` and authoritative `serverTime`.
- The frontend computes the clock offset:
  $$\text{serverOffset} = \text{serverTime} - \text{Date.now()}$$
- The `useCountdown` hook runs a 1-second `setInterval`, deriving the estimated server time by applying the offset:
  $$\text{currentEstimatedServerTime} = \text{Date.now()} + \text{serverOffset}$$
- This guarantees zero drift, zero redundant network polling, and immunity to local system clock changes.

### Q2: What design system and libraries were chosen for the UI?
**Answer:**
- **Design System**: Deep space luxury aesthetic (`#070514`, royal violet `#8B5CF6`, imperial gold `#F59E0B`).
- **Typography**: Google Fonts (*Outfit* for bold headings and badges, *Inter* for legible stats and counts).
- **Styling Architecture**: Vanilla CSS and scoped CSS Modules (`DailyStreak.module.css`) to ensure modularity, zero CSS bloat, and fast render performance without heavy CSS utility frameworks.
- **Icons**: `lucide-react` for clean, scalable vector icons.
- **Animations**: Custom CSS keyframes for levitation micro-animations and confetti burst celebration upon claiming.

---

## 8. Live Demonstration & Submission Strategy

**Q: If you have 3 minutes to impress an examiner, how should you demo the project?**

> **Demonstration Script:**
> 1. **Initial Impression (30s)**:
>    - Show the sleek UI, glowing Day 7 Ultimate Reward card, active streak counter, and current wallet balances on the navbar.
>    - Click "Claim Today's Reward" on Day 1. Show the confetti celebration, real-time balance increment (+5 VEs), and immediate transition into the 24-hour countdown state.
> 2. **Evaluator Toolbar & Time Machine (60s)**:
>    - Open the docked **Evaluator Toolbar** at the bottom of the screen.
>    - Click **"+24 Hours"**: Show the countdown timer immediately expire and Day 2 card become unlocked and eligible in real time without refreshing!
>    - Click **"+48 Hours"**: Show the missed-day detection trigger, resetting the streak back to 0 and explaining the backend grace period logic.
> 3. **Live Anti-Cheat Proof (60s)**:
>    - Click **"Test Race Condition (2x Claim)"**: Evaluator toolbar fires two simultaneous requests. Show that exactly one succeeds and the other is blocked with `409 Conflict`.
>    - Click **"Test Fake Reward (+999,999)"**: Show that the backend discards the fake payload and logs the attempt.
>    - Open the **"View Audit Logs"** modal to display the live immutable MongoDB security trail.

---

## 9. Examiner "Trap" & Scalability Questions

### Q1: How would you scale this system from 1,000 to 1,000,000 daily active users?
**Answer:**
1. **Distributed Caching & Locking with Redis**: Replace the single-node `inFlightClaims` `Set` with Redis distributed locks (**Redlock**) so multiple load-balanced Express servers share atomic locking.
2. **Read/Write Database Separation**: Use MongoDB read replicas for read-heavy operations (`getStatus`) and route writes (`claim`) to the primary replica.
3. **Asynchronous Message Queue**: For high-traffic peak hours (e.g., midnight resets), offload notification dispatch and complex audit analysis to BullMQ or Apache Kafka.
4. **Edge CDN Caching**: Cache static assets and the React SPA on Cloudflare/Vercel edge networks.

### Q2: What happens if MongoDB crashes halfway through a reward claim?
**Answer:**
- In replica set environments, the MongoDB multi-document transaction automatically rolls back all partial writes, ensuring no "half-claimed" state occurs.
- The user can safely retry claiming once connectivity is restored, as the unique index prevents duplicate claims.

### Q3: Why didn't you use SQL/PostgreSQL for financial transactions?
**Answer:**
While PostgreSQL is excellent for ACID ledgers, MongoDB 4.0+ provides full multi-document ACID transactions alongside the schema flexibility needed for rapidly iterating on varied reward types (VES points, coupon codes, physical merchant vouchers, tier multipliers). By applying compound unique constraints and an immutable transaction ledger collection, we achieved banking-grade data integrity within a flexible document database.

---
*Created for VELoop Rewards Full-Stack MERN Project Defense and Technical Evaluation.*
