require('dotenv').config();
const assert = require('assert');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const StreakCycle = require('../src/models/StreakCycle');
const StreakClaim = require('../src/models/StreakClaim');
const { advanceServerTimeMs, resetVirtualServerTime } = require('../src/utils/time.utils');

const BASE_URL = 'http://localhost:5001/api';

async function runStreakTests() {
  console.log('🧪 Starting Step 5 Daily Streak Engine Verification Suite...\n');

  try {
    resetVirtualServerTime();

    // 1. Create a fresh test user
    const testEmail = `streak_tester_${Date.now()}@example.com`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Streak Tester',
        email: testEmail,
        password: 'Password123!'
      })
    });
    const regData = await regRes.json();
    assert.strictEqual(regRes.status, 201, 'Registration should succeed');
    const token = regData.token;
    const userId = regData.user.id;
    console.log(`✔ Registered test user (${userId})`);

    // 2. Test JWT protection
    console.log('2. Testing endpoint protection...');
    const unauthRes = await fetch(`${BASE_URL}/daily-streak/status`);
    assert.strictEqual(unauthRes.status, 401, 'Unauthenticated status request must return 401');

    const badTokenRes = await fetch(`${BASE_URL}/daily-streak/status`, {
      headers: { Authorization: 'Bearer bad.token.here' }
    });
    assert.strictEqual(badTokenRes.status, 401, 'Bad token must return 401');
    console.log('✔ Streak endpoints are strictly protected by JWT authentication.');

    // 3. Test First-Time User Status on GET /api/daily-streak/status
    console.log('3. Testing first-time user status on GET /api/daily-streak/status...');
    const statusRes = await fetch(`${BASE_URL}/daily-streak/status`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    assert.strictEqual(statusRes.status, 200, 'Status request should succeed');
    const statusBody = await statusRes.json();
    assert.strictEqual(statusBody.success, true);
    const data = statusBody.data;

    assert.strictEqual(data.currentDay, 1, 'First-time user must be on Day 1');
    assert.strictEqual(data.currentStreak, 0, 'First-time user streak must be 0');
    assert.strictEqual(data.canClaim, true, 'First-time user must be eligible to claim Day 1');
    assert.strictEqual(data.lastClaimAt, null, 'First-time user must have lastClaimAt = null');
    assert.strictEqual(data.nextClaimAt, null, 'First-time user must have nextClaimAt = null');
    assert.strictEqual(data.streakStatus, 'READY', 'Status should be READY');
    assert.ok(data.cycleId.startsWith('CYC-'), 'Cycle ID must start with CYC-');
    assert.ok(data.serverTime, 'Server time must be provided');

    // Verify Day 1 reward details from DB
    assert.strictEqual(data.currentReward.day, 1);
    assert.strictEqual(data.currentReward.amount, 5);
    assert.strictEqual(data.currentReward.currency, 'VES');

    // Verify Day 2 reward details from DB
    assert.strictEqual(data.nextReward.day, 2);
    assert.strictEqual(data.nextReward.amount, 10);
    assert.strictEqual(data.nextReward.currency, 'VES');
    console.log('✔ First-time user status verified with authoritative Day 1 rewards and READY state.');

    // 4. Confirm NO claim record was created by requesting status
    console.log('4. Confirming no claim record was created simply by requesting status...');
    const claimCount = await StreakClaim.countDocuments({ userId });
    assert.strictEqual(claimCount, 0, 'Status check must NOT create a claim record');
    console.log('✔ Verified zero claims exist in DB.');

    // 5. Test GET /api/daily-streak endpoint
    console.log('5. Testing complete streak data on GET /api/daily-streak...');
    const fullRes = await fetch(`${BASE_URL}/daily-streak`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    assert.strictEqual(fullRes.status, 200);
    const fullData = await fullRes.json();
    assert.strictEqual(fullData.success, true);
    assert.strictEqual(fullData.rewards.length, 7, 'Must return 7 daily reward cards');

    // Check card statuses
    assert.strictEqual(fullData.rewards[0].day, 1);
    assert.strictEqual(fullData.rewards[0].status, 'AVAILABLE', 'Day 1 card must be AVAILABLE');
    for (let i = 1; i < 7; i++) {
      assert.strictEqual(fullData.rewards[i].status, 'LOCKED', `Day ${i + 1} card must be LOCKED`);
    }
    console.log('✔ GET /api/daily-streak verified: 7 cards returned with Day 1 AVAILABLE and Days 2-7 LOCKED.');

    // 6. Test Cooldown Logic Simulation (User claims Day 1)
    console.log('6. Simulating Day 1 claim in DB to test backend cooldown evaluation...');
    const activeCycle = await StreakCycle.findOne({ userId, status: 'ACTIVE' });
    const claimTime = new Date();
    await StreakCycle.findByIdAndUpdate(activeCycle._id, {
      currentStreak: 1,
      checkedInCount: 1,
      lastClaimAt: claimTime
    });

    await StreakClaim.create({
      claimId: `CLM-TEST-${Date.now()}`,
      userId,
      cycleId: activeCycle.cycleId,
      day: 1,
      rewardType: 'VES',
      amount: 5,
      currency: 'VES',
      transactionId: `TX-TEST-1`,
      claimedAt: claimTime
    });

    // Check status immediately after claim (during 24h cooldown)
    const cooldownRes = await fetch(`${BASE_URL}/daily-streak/status`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const cooldownData = (await cooldownRes.json()).data;
    assert.strictEqual(cooldownData.canClaim, false, 'User must not be able to claim while in cooldown');
    assert.strictEqual(cooldownData.streakStatus, 'COOLDOWN', 'Status must be COOLDOWN');
    assert.ok(cooldownData.nextClaimAt, 'nextClaimAt must be set to future timestamp');
    assert.strictEqual(cooldownData.currentDay, 2, 'Target day should now be Day 2');
    console.log('✔ Cooldown verified: canClaim is false, streakStatus is COOLDOWN, nextClaimAt is populated.');

    // 7. Test Cooldown Expiry (Simulating 25 hours elapsed since claim)
    console.log('7. Simulating 25 hours elapsed since claim in DB...');
    const past25h = new Date(Date.now() - 25 * 60 * 60 * 1000);
    await StreakCycle.findByIdAndUpdate(activeCycle._id, { lastClaimAt: past25h });

    const eligibleRes = await fetch(`${BASE_URL}/daily-streak/status`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const eligibleData = (await eligibleRes.json()).data;
    assert.strictEqual(eligibleData.canClaim, true, 'User must be eligible to claim Day 2 after cooldown');
    assert.strictEqual(eligibleData.currentDay, 2, 'Current actionable day must be Day 2');
    assert.strictEqual(eligibleData.streakStatus, 'READY');
    console.log('✔ Post-cooldown eligibility verified: Day 2 is READY and canClaim is true.');

    // 8. Test Missed Day Evaluation (Simulating 55 hours elapsed > 48h deadline)
    console.log('8. Simulating missed claim window (55 hours elapsed > 48h deadline)...');
    const past55h = new Date(Date.now() - 55 * 60 * 60 * 1000);
    await StreakCycle.findByIdAndUpdate(activeCycle._id, { lastClaimAt: past55h });

    const missedRes = await fetch(`${BASE_URL}/daily-streak/status`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const missedData = (await missedRes.json()).data;
    assert.strictEqual(missedData.currentStreak, 0, 'Streak must reset to 0 upon missing window');
    assert.strictEqual(missedData.currentDay, 1, 'Actionable day must reset to Day 1');
    assert.strictEqual(missedData.canClaim, true, 'User can start fresh on Day 1');
    assert.notStrictEqual(missedData.cycleId, activeCycle.cycleId, 'A new cycleId must be generated');

    // Verify in DB that old cycle is marked RESET
    const oldCycle = await StreakCycle.findById(activeCycle._id);
    assert.strictEqual(oldCycle.status, 'RESET', 'Old cycle status must be RESET in DB');
    console.log(`✔ Missed day detection verified: Old cycle (${oldCycle.cycleId}) marked RESET, new cycle (${missedData.cycleId}) created with Day 1.`);
    console.log('\n======================================================');
    console.log('🎉 ALL STEP 5 STREAK ENGINE TESTS PASSED PERFECTLY!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
}

const connectDB = require('../src/config/db');
connectDB().then(() => {
  runStreakTests().then(() => process.exit(0));
});
