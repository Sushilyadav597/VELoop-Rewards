# VELoop Rewards — API Documentation

This document describes all REST API endpoints for the VELoop Daily Streak & Rewards System.

**Base URL**: `http://localhost:5001/api`  
**Authentication**: Bearer JWT Token in `Authorization` header (`Authorization: Bearer <token>`)

---

## 1. Authentication Endpoints

### 1.1 User Login
- **Endpoint**: `POST /auth/login`
- **Description**: Authenticates user credentials and returns JWT session token.
- **Request Body**:
```json
{
  "username": "demo_day2",
  "password": "password123"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "66f1...",
    "username": "demo_day2",
    "name": "Jordan (Day 2 Active)",
    "role": "USER"
  },
  "wallet": {
    "vesBalance": 110,
    "gemsBalance": 120,
    "amazonVouchersTotal": 0
  }
}
```

### 1.2 User Registration
- **Endpoint**: `POST /auth/register`
- **Request Body**:
```json
{
  "username": "newuser",
  "email": "user@veloop.io",
  "password": "securepassword",
  "name": "Test User"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": { "id": "...", "username": "newuser", "email": "user@veloop.io" },
  "wallet": { "vesBalance": 100, "gemsBalance": 120, "amazonVouchersTotal": 0 }
}
```

### 1.3 Demo Login (Instant Evaluation)
- **Endpoint**: `POST /auth/demo-login`
- **Request Body**:
```json
{
  "accountType": "day2" // Options: "new", "day2", "vip"
}
```

---

## 2. Daily Streak Endpoints

### 2.1 Get Daily Streak State (Section 55, 56, 94)
- **Endpoint**: `GET /daily-streak`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Authoritative backend calculation of user streak, target actionable day, countdown timer, and 7-card status.
- **Response `200 OK`**:
```json
{
  "success": true,
  "serverTime": "2026-09-23T18:00:00.000Z",
  "streak": {
    "cycleId": "CYC-day2-1-INITIAL",
    "cycleNumber": 1,
    "currentStreak": 1,
    "currentDay": 2,
    "checkedIn": 1,
    "totalRewards": 7,
    "status": "ACTIVE",
    "isEligibleToday": true,
    "nextClaimAt": null,
    "cooldownRemainingMs": 0,
    "nextReward": {
      "day": 2,
      "amount": 10,
      "currency": "VES",
      "title": "Daily Reward",
      "subtitle": "10 VEs",
      "rewardType": "VES",
      "assetType": "coin"
    }
  },
  "rewards": [
    {
      "day": 1,
      "status": "CLAIMED",
      "badge": null,
      "title": "Daily Reward",
      "subtitle": "5 VEs",
      "rewardType": "VES",
      "currency": "VES",
      "amount": 5,
      "assetType": "coin",
      "isToday": false,
      "nextClaimAt": null
    },
    {
      "day": 2,
      "status": "AVAILABLE",
      "badge": "Today",
      "title": "Daily Reward",
      "subtitle": "10 VEs",
      "rewardType": "VES",
      "currency": "VES",
      "amount": 10,
      "assetType": "coin",
      "isToday": true,
      "nextClaimAt": null
    },
    {
      "day": 3,
      "status": "LOCKED",
      "badge": null,
      "title": "Daily Reward",
      "subtitle": "15 VEs",
      "rewardType": "VES",
      "currency": "VES",
      "amount": 15,
      "assetType": "coin",
      "isToday": false,
      "nextClaimAt": null
    }
  ]
}
```

### 2.2 Lightweight Streak Status (Section 48, 55)
- **Endpoint**: `GET /daily-streak/status`
- **Description**: Returns quick server timestamp and availability status.
- **Response `200 OK`**:
```json
{
  "success": true,
  "serverTime": "2026-09-23T18:00:00.000Z",
  "currentStreak": 1,
  "currentDay": 2,
  "checkedIn": 1,
  "isEligibleToday": true,
  "nextClaimAt": null,
  "cooldownRemainingMs": 0
}
```

### 2.3 Claim Daily Reward (Section 35, 91)
- **Endpoint**: `POST /daily-streak/claim`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body** *(Optional - backend derives day and reward authoritatively)*:
```json
{
  "day": 2
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Day 2 claimed successfully!",
  "serverTime": "2026-09-23T18:00:00.000Z",
  "claimedReward": {
    "day": 2,
    "title": "Daily Reward",
    "amount": 10,
    "currency": "VES",
    "rewardType": "VES"
  },
  "wallet": {
    "vesBalance": 120,
    "gemsBalance": 120,
    "amazonVouchersTotal": 0
  },
  "transaction": {
    "transactionId": "TX-1727114400-A9B8",
    "currency": "VES",
    "type": "CREDIT",
    "amount": 10,
    "source": "DAILY_STREAK",
    "referenceId": "STREAK-CYC-day2-1-D2"
  },
  "nextClaimAt": "2026-09-24T18:00:00.000Z"
}
```
- **Error Response `400 Bad Request` (Cooldown still active)**:
```json
{
  "success": false,
  "error": "Reward is still locked. Next claim available at 2026-09-24T18:00:00.000Z",
  "nextClaimAt": "2026-09-24T18:00:00.000Z",
  "cooldownRemainingMs": 86395001
}
```
- **Error Response `409 Conflict` (Duplicate claim)**:
```json
{
  "success": false,
  "error": "This reward has already been claimed."
}
```

### 2.4 Streak History (Section 58)
- **Endpoint**: `GET /daily-streak/history`
- **Response `200 OK`**:
```json
{
  "success": true,
  "history": [
    {
      "claimId": "CLM-SEED-DAY1",
      "day": 1,
      "rewardSnapshot": { "amount": 5, "currency": "VES" },
      "transactionId": "TX-SEED-1",
      "claimedAt": "2026-09-22T17:00:00.000Z"
    }
  ]
}
```

---

## 3. Wallet Endpoints

### 3.1 Get User Wallet
- **Endpoint**: `GET /wallet`
- **Response `200 OK`**:
```json
{
  "success": true,
  "wallet": {
    "vesBalance": 120,
    "gemsBalance": 120,
    "amazonVouchersTotal": 0,
    "updatedAt": "2026-09-23T18:00:00.000Z"
  }
}
```

### 3.2 Get Wallet Transactions (Section 63)
- **Endpoint**: `GET /wallet/transactions`
- **Response `200 OK`**:
```json
{
  "success": true,
  "transactions": [
    {
      "transactionId": "TX-1727114400-A9B8",
      "amount": 10,
      "currency": "VES",
      "type": "CREDIT",
      "source": "DAILY_STREAK",
      "balanceBefore": 110,
      "balanceAfter": 120,
      "createdAt": "2026-09-23T18:00:00.000Z"
    }
  ]
}
```

---

## 4. Evaluator Simulation Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/dev/advance-time` | Fast-forwards server clock by `{ hours: 24 }` to simulate timer expiry. |
| `POST` | `/dev/reset-clock` | Resets virtual server clock back to real system time. |
| `POST` | `/dev/reset-user-streak` | Resets active user streak back to Day 1. |
| `POST` | `/dev/test-concurrency` | Dispatches 2 simultaneous claim requests and verifies only 1 succeeds. |
| `GET` | `/dev/audit-logs` | Inspects live MongoDB security audit trail. |
