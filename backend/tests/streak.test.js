/**
 * Automated Verification Suite for VELoop Rewards Daily Streak System
 * Verifies core security, anti-cheat, concurrency, and streak rules.
 */

const assert = require('assert');

const BASE_URL = 'http://localhost:5001/api';

async function runTests() {
  console.log('🧪 Starting Automated Backend Verification Suite...\n');

  try {
    // 1. Health check
    const healthRes = await fetch('http://localhost:5001/health');
    const health = await healthRes.json();
    assert.strictEqual(health.status, 'healthy', 'Health check failed');
    console.log('✔ Health Check: OK');

    // 2. Auth: Demo Login for Day 2 User
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'demo_day2', password: 'password123' })
    });
    const loginData = await loginRes.json();
    assert.strictEqual(loginData.success, true, 'Login failed');
    const token = loginData.token;
    console.log('✔ User Authentication (JWT): OK');

    // 3. Get Streak Status
    const streakRes = await fetch(`${BASE_URL}/daily-streak`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const streakData = await streakRes.json();
    assert.strictEqual(streakData.success, true, 'Get streak failed');
    assert.strictEqual(typeof streakData.streak.currentStreak, 'number', 'Streak count missing');
    assert.strictEqual(streakData.rewards.length, 7, 'Must return 7 daily reward cards');
    console.log(`✔ Streak Status retrieval: Day ${streakData.streak.currentDay} is actionable. Total rewards: ${streakData.streak.totalRewards}`);

    // 4. Anti-Cheat: Fake Reward Injection Test (Section 36, 98)
    const fakeRewardRes = await fetch(`${BASE_URL}/daily-streak/claim`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ day: 2, reward: 999999, currency: 'VES' })
    });
    const fakeRewardData = await fakeRewardRes.json();
    if (fakeRewardData.success) {
      // If success, verify the reward credited was the SERVER CONFIGURED amount (10 VEs), NOT 999999!
      assert.strictEqual(fakeRewardData.claimedReward.amount, 10, 'CRITICAL: Server allowed fake reward!');
      console.log('✔ Anti-Cheat [Reward Injection]: Server ignored fake 999999 reward and awarded authoritative 10 VEs.');
    } else {
      console.log(`✔ Anti-Cheat [Reward Injection]: Handled gracefully (${fakeRewardData.error})`);
    }

    // 5. Anti-Cheat: Day Jump Test (Section 14, 99)
    const dayJumpRes = await fetch(`${BASE_URL}/daily-streak/claim`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ day: 7 })
    });
    const dayJumpData = await dayJumpRes.json();
    assert.strictEqual(dayJumpRes.status >= 400, true, 'Server must reject Day 7 jump when not eligible');
    console.log('✔ Anti-Cheat [Day Jump]: Illegal jump to Day 7 rejected successfully.');

    // 6. Concurrency & Double-Click Test (Section 41, 42, 101, 102)
    const concurrencyRes = await fetch(`${BASE_URL}/dev/test-concurrency`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const concurrencyData = await concurrencyRes.json();
    assert.strictEqual(concurrencyData.success, true, 'Concurrency test failed');
    console.log('✔ Concurrency & Double-Click Protection:', concurrencyData.description);

    // 7. Dev Time Advance (Section 48, 103)
    const advanceRes = await fetch(`${BASE_URL}/dev/advance-time`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hours: 24 })
    });
    const advanceData = await advanceRes.json();
    assert.strictEqual(advanceData.success, true, 'Time advance failed');
    console.log(`✔ Virtual Clock Simulation: Advanced by 24 hours. Server time: ${advanceData.serverTime}`);

    // Reset clock back
    await fetch(`${BASE_URL}/dev/reset-clock`, { method: 'POST' });
    console.log('✔ Virtual Clock reset back to real time.');

    // 8. Audit Logs inspection (Section 64, 104)
    const auditRes = await fetch(`${BASE_URL}/dev/audit-logs?limit=10`);
    const auditData = await auditRes.json();
    assert.strictEqual(auditData.success, true, 'Audit log retrieval failed');
    assert.ok(auditData.logs.length > 0, 'Audit logs must be populated');
    console.log(`✔ Audit Trail: ${auditData.count} security events recorded.`);

    console.log('\n=========================================');
    console.log('🎉 ALL BACKEND VERIFICATION TESTS PASSED!');
    console.log('=========================================\n');
  } catch (err) {
    console.error('❌ Verification Test Failed:', err.message);
    process.exit(1);
  }
}

runTests();
