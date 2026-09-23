# VELoop Rewards — Comprehensive Testing Guide

This guide details the exact procedures for reproducing and verifying all 12 core test scenarios specified in the internship evaluation rubric (Sections 96–104 & 111).

---

## 🚀 Quick Automated Test Run

Execute the automated test script covering core anti-cheat and concurrency validations:
```bash
cd backend
npm test
```

---

## 📋 Manual & Interactive Evaluation Test Cases

You can test every scenario directly from the browser using the **Internship Evaluator & Anti-Cheat Suite** toolbar at the bottom of the screen (`http://localhost:5173`).

---

### Test 1: Normal Check-In & Reward Grant (Section 91)
1. In the header account switcher, select **Day 2 Active** (Jordan).
2. Observe that Day 1 is marked as **✓ Claimed** and Day 2 has the golden **Claim Reward >** button.
3. Click **Claim Reward >**.
4. Observe the **CPA Advertisement Demo** modal ("Preparing your reward... Advertisement / Reward Verification").
5. Upon completion, observe the **Celebration Modal** displaying:
   - Claimed: `+10 VEs`
   - Updated Wallet: Balance credited by +10 VEs.
   - Database Reference: `STREAK-CYC-...-D2`
6. Close the modal: Day 2 is now marked as **✓ Claimed** and Day 3 shows a live **24:00:00 countdown**.

---

### Test 2: Double-Click & Duplicate Claim (Section 41, 101)
1. Attempt to claim Day 2 immediately again while it is already claimed or in progress.
2. **Expected Result**: Frontend disables the button immediately; any duplicate HTTP request sent to `POST /api/daily-streak/claim` is rejected with `409 Conflict`: *"This reward has already been claimed."*
3. No duplicate VEs are credited to the wallet.

---

### Test 3: Concurrent Claim Protection (Section 42, 102)
1. Click the **Internship Evaluator** toolbar at the bottom of the screen to expand it.
2. Click the **Concurrency Test** button.
3. The server fires two simultaneous claim requests (`Promise.all([claimReq1, claimReq2])`) for the active user.
4. **Expected Result**:
   - Request 1: `SUCCESS` (+10 VEs awarded)
   - Request 2: `REJECTED` (409 Conflict: *"A claim request is already in progress / already claimed"*)
   - Wallet balance increases by exactly +10 VEs, **never +20 VEs**.

---

### Test 4: Fake Reward Injection Attack (Section 36, 98)
1. In the Evaluator toolbar, click **Fake Reward Attack**.
2. This sends a malicious cURL/Postman equivalent payload:
   ```json
   { "day": 2, "reward": 999999, "currency": "VES" }
   ```
3. **Expected Result**: The backend disregards the client-provided 999,999 amount. It queries the server's `StreakReward` configuration and credits only the legitimate 10 VEs.

---

### Test 5: Illegal Day Jump Attack (Section 14, 99)
1. Using Postman or cURL, send a claim for Day 7 while only Day 2 is eligible:
   ```bash
   curl -X POST http://localhost:5001/api/daily-streak/claim \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"day": 7}'
   ```
2. **Expected Result**: Backend returns `400 Bad Request`: *"Invalid claim request for Day 7. You are currently eligible for Day 2."*
3. The unauthorized jump is blocked and logged in `AuditLog` as `INVALID_CLAIM`.

---

### Test 6: Clock Manipulation / Timer Cheat Test (Section 11, 46, 47, 97)
1. Change your local computer or phone time forward by 24 hours.
2. Refresh the browser at `http://localhost:5173`.
3. **Expected Result**: The reward remains locked because the backend determines eligibility using its authoritative server timestamp. If a claim request is dispatched, the server responds with:
   *"Reward is still locked. Next claim available at [server timestamp]"*.

---

### Test 7: Time Machine Fast-Forward (Section 48)
1. Instead of tampering with the client clock, open the Evaluator Toolbar.
2. Click **+24 Hours**.
3. **Expected Result**: The backend virtual clock is advanced by 24 hours. The page refreshes, the previous countdown expires, and the next day seamlessly transitions from **Locked** to **Claim Reward >**!

---

### Test 8: Missed Day & Streak Reset (Section 15, 16, 49, 50, 103)
1. Select an account with Day 1 or Day 2 claimed.
2. In the Evaluator Toolbar, click **+48h (Missed)** to simulate skipping past the required claim window.
3. Observe the UI:
   - **Expected Result**: The backend detects that the user missed the claim deadline.
   - Streak cycle is marked as `RESET`.
   - Current Streak resets to `0`.
   - The user is returned to **Day 1**, which becomes available for check-in again.
   - An audit event `STREAK_RESET` is recorded in MongoDB.

---

### Test 9: React DevTools Tampering (Section 96)
1. Open Chrome DevTools -> Components tab.
2. Select `RewardCard` or `DailyStreakPage` and change `streak = 7`.
3. Click "Claim".
4. **Expected Result**: The action has zero effect on the backend. The backend retrieves the actual streak from MongoDB and processes only the legitimate record.

---

### Test 10: Multi-Tab Concurrency (Section 52)
1. Open `http://localhost:5173` in two different browser tabs (Tab A and Tab B) logged into the same account.
2. Click "Claim Reward" in Tab A.
3. Immediately switch to Tab B and click "Claim Reward".
4. **Expected Result**: Tab A completes the claim successfully. Tab B is rejected with a duplicate notification and prompts to refresh state.

---

### Test 11: Refresh & Persistence (Section 53, 54)
1. Claim a reward.
2. Refresh the browser page (`F5`).
3. **Expected Result**: The claimed state persists intact from MongoDB. React does not revert to unclaimed.
4. Log out and log back in: the exact same state is restored.

---

### Test 12: Database Integrity Audit (Section 64, 104)
1. In the Evaluator Toolbar, click **Audit Trail (DB)**.
2. Inspect the live security log table.
3. Verify that every event (`STREAK_CLAIM_REQUEST`, `STREAK_CLAIM_SUCCESS`, `DEV_TIME_ADVANCE`, etc.) is logged with timestamp, user ID, and parameters.
