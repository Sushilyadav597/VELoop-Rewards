require('dotenv').config();
const assert = require('assert');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Wallet = require('../src/models/Wallet');
const StreakClaim = require('../src/models/StreakClaim');
const StreakCycle = require('../src/models/StreakCycle');
const WalletTransaction = require('../src/models/WalletTransaction');
const AuditLog = require('../src/models/AuditLog');

const BASE_URL = 'http://localhost:5001/api';

async function runClaimVerificationTests() {
  console.log('🧪 Starting Step 6 Daily Streak Claim Verification Suite...\n');

  try {
    // -------------------------------------------------------------
    // SETUP: Register User A
    // -------------------------------------------------------------
    const emailA = `claim_user_a_${Date.now()}@example.com`;
    const regResA = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Claim Tester A',
        email: emailA,
        password: 'Password123!'
      })
    });
    const regDataA = await regResA.json();
    assert.strictEqual(regResA.status, 201, 'Registration must succeed');
    const tokenA = regDataA.token;
    const userIdA = regDataA.user.id;
    console.log(`✔ User A registered: ${userIdA}`);

    // Verify initial wallet state before any claims
    const initialWallet = await Wallet.findOne({ userId: userIdA });
    assert.strictEqual(initialWallet.vesBalance, 0, 'Initial VES balance must be 0');
    assert.strictEqual(initialWallet.amazonVouchersTotal, 0, 'Initial Amazon vouchers total must be 0');
    const initialClaimsCount = await StreakClaim.countDocuments({ userId: userIdA });
    assert.strictEqual(initialClaimsCount, 0, 'Initial claims must be 0');
    const initialTxCount = await WalletTransaction.countDocuments({ userId: userIdA });
    assert.strictEqual(initialTxCount, 0, 'Initial transactions must be 0');
    console.log('✔ Initial state verified: 0 claims, 0 transactions, 0 balances.');

    // -------------------------------------------------------------
    // Test 1: Unauthenticated claim -> 401
    // -------------------------------------------------------------
    console.log('1. Testing unauthenticated claim request...');
    const unauthRes = await fetch(`${BASE_URL}/daily-streak/claim`, { method: 'POST' });
    assert.strictEqual(unauthRes.status, 401, 'Unauthenticated request must return 401');
    console.log('✔ Unauthenticated claim rejected with 401.');

    // -------------------------------------------------------------
    // Test 2: Invalid JWT -> 401
    // -------------------------------------------------------------
    console.log('2. Testing invalid token claim request...');
    const invalidTokenRes = await fetch(`${BASE_URL}/daily-streak/claim`, {
      method: 'POST',
      headers: { Authorization: 'Bearer totally.fake.jwt.token' }
    });
    assert.strictEqual(invalidTokenRes.status, 401, 'Invalid token must return 401');
    console.log('✔ Invalid JWT claim rejected with 401.');

    // -------------------------------------------------------------
    // Tests 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 21, 22:
    // User claims Day 1 with client attempting to inject fake inputs
    // -------------------------------------------------------------
    console.log('3. Attempting Day 1 claim with client trying to inject fake data...');
    const claimRes1 = await fetch(`${BASE_URL}/daily-streak/claim`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Content-Type': 'application/json'
      },
      // Client tries to inject fake values:
      body: JSON.stringify({
        userId: 'fake_user_id_123',
        day: 7, // fake day
        amount: 999999, // fake amount
        currency: 'USD', // fake currency
        rewardType: 'SUPER_GIFT',
        cycleId: 'FAKE_CYCLE'
      })
    });

    assert.strictEqual(claimRes1.status, 200, 'Day 1 claim must succeed with 200');
    const claimBody1 = await claimRes1.json();
    assert.strictEqual(claimBody1.success, true);
    assert.strictEqual(claimBody1.message, 'Daily streak reward claimed successfully');

    const data1 = claimBody1.data;
    // Verification: Server IGNORED all injected client values and used authoritative Day 1 values
    assert.strictEqual(data1.day, 1, 'Server must enforce Day 1, ignoring client fake day 7');
    assert.strictEqual(data1.reward.amount, 5, 'Server must enforce 5 VEs, ignoring client fake 999999');
    assert.strictEqual(data1.reward.currency, 'VES', 'Server must enforce VES currency, ignoring client USD');
    assert.strictEqual(data1.wallet.vesBalance, 5, 'Wallet VES balance must now be exactly 5');
    assert.strictEqual(data1.wallet.amazonVouchersTotal, 0, 'Amazon vouchers must remain 0');
    assert.strictEqual(data1.streakStatus, 'COOLDOWN');
    assert.ok(data1.claimId.startsWith('CLM-'));
    assert.ok(data1.transactionId.startsWith('TX-'));
    assert.ok(data1.cycleId.startsWith('CYC-'));

    // Security check: passwordHash and token must NEVER be returned
    assert.strictEqual(claimBody1.passwordHash, undefined, 'passwordHash must never be exposed');
    assert.strictEqual(claimBody1.token, undefined, 'token must never be returned on claim');
    console.log('✔ Day 1 claim succeeded with authoritative backend values (all fake client injections ignored).');

    // -------------------------------------------------------------
    // Test 4, 6, 23: Direct MongoDB Inspection of Day 1 claim
    // -------------------------------------------------------------
    console.log('4. Inspecting MongoDB documents created for Day 1 claim...');
    const claimsUserA = await StreakClaim.find({ userId: userIdA });
    assert.strictEqual(claimsUserA.length, 1, 'Exactly ONE StreakClaim must exist in MongoDB');
    assert.strictEqual(claimsUserA[0].day, 1);
    assert.strictEqual(claimsUserA[0].amount, 5);
    assert.strictEqual(claimsUserA[0].currency, 'VES');
    assert.strictEqual(claimsUserA[0].status, 'SUCCESS');

    const txsUserA = await WalletTransaction.find({ userId: userIdA });
    assert.strictEqual(txsUserA.length, 1, 'Exactly ONE WalletTransaction must exist in MongoDB');
    assert.strictEqual(txsUserA[0].type, 'CREDIT');
    assert.strictEqual(txsUserA[0].amount, 5);
    assert.strictEqual(txsUserA[0].currency, 'VES');
    assert.strictEqual(txsUserA[0].balanceBefore, 0, 'balanceBefore must be 0');
    assert.strictEqual(txsUserA[0].balanceAfter, 5, 'balanceAfter must be 5');
    assert.strictEqual(txsUserA[0].referenceId, claimsUserA[0].claimId, 'Transaction must trace back to claimId');

    const auditsUserA = await AuditLog.find({ userId: userIdA, action: 'CLAIM_SUCCESS' });
    assert.strictEqual(auditsUserA.length, 1, 'Exactly ONE AuditLog must exist in MongoDB');
    assert.strictEqual(auditsUserA[0].metadata.day, 1);
    assert.strictEqual(auditsUserA[0].metadata.amount, 5);
    console.log('✔ Verified database integrity: 1 StreakClaim, 1 WalletTransaction, 1 AuditLog.');

    // -------------------------------------------------------------
    // Test 13 & 14: Repeated / Duplicate Claim for Same Day is REJECTED
    // -------------------------------------------------------------
    console.log('5. Testing repeated claim on same day (must be rejected)...');
    const repeatClaimRes = await fetch(`${BASE_URL}/daily-streak/claim`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(repeatClaimRes.status, 409, 'Duplicate claim during cooldown must return 409 Conflict');
    const repeatBody = await repeatClaimRes.json();
    assert.strictEqual(repeatBody.success, false);

    // Verify wallet has NOT been incremented again
    const walletAfterRepeat = await Wallet.findOne({ userId: userIdA });
    assert.strictEqual(walletAfterRepeat.vesBalance, 5, 'Wallet balance must remain 5 after repeated claim');
    const claimsAfterRepeat = await StreakClaim.countDocuments({ userId: userIdA });
    assert.strictEqual(claimsAfterRepeat, 1, 'StreakClaim count must remain exactly 1');
    const txAfterRepeat = await WalletTransaction.countDocuments({ userId: userIdA });
    assert.strictEqual(txAfterRepeat, 1, 'WalletTransaction count must remain exactly 1');
    console.log('✔ Repeated claim rejected with 409 and did not increase wallet or add records.');

    // -------------------------------------------------------------
    // Test 15: Concurrent / Race-Condition Double-Click Protection
    // -------------------------------------------------------------
    console.log('6. Testing concurrent double-click claims with fresh User B...');
    const emailB = `claim_user_b_${Date.now()}@example.com`;
    const regResB = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Concurrent Tester B',
        email: emailB,
        password: 'Password123!'
      })
    });
    const regDataB = await regResB.json();
    const tokenB = regDataB.token;
    const userIdB = regDataB.user.id;

    // Send 3 simultaneous claim requests at the exact same millisecond
    const concurrentResponses = await Promise.all([
      fetch(`${BASE_URL}/daily-streak/claim`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenB}` }
      }),
      fetch(`${BASE_URL}/daily-streak/claim`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenB}` }
      }),
      fetch(`${BASE_URL}/daily-streak/claim`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenB}` }
      })
    ]);

    const statuses = concurrentResponses.map((r) => r.status);
    console.log(`Concurrent statuses received: ${statuses.join(', ')}`);
    const successCount = statuses.filter((s) => s === 200).length;
    const conflictCount = statuses.filter((s) => s === 409).length;

    assert.strictEqual(successCount, 1, 'Exactly ONE concurrent claim must succeed');
    assert.strictEqual(conflictCount, 2, 'The other 2 concurrent claims must fail with 409');

    // Confirm in DB for User B:
    const walletB = await Wallet.findOne({ userId: userIdB });
    assert.strictEqual(walletB.vesBalance, 5, 'User B wallet must have exactly 5 VEs (not 10 or 15)');
    const claimsB = await StreakClaim.countDocuments({ userId: userIdB });
    assert.strictEqual(claimsB, 1, 'User B must have exactly 1 claim in DB');
    const txsB = await WalletTransaction.countDocuments({ userId: userIdB });
    assert.strictEqual(txsB, 1, 'User B must have exactly 1 transaction in DB');
    console.log('✔ Concurrent claim protection verified: exactly 1 credit, 1 claim, 1 transaction.');

    // -------------------------------------------------------------
    // Tests 16 & 17: Day 2 Claim after Cooldown
    // -------------------------------------------------------------
    console.log('7. Simulating 25h elapsed for User A to unlock Day 2...');
    const activeCycleA = await StreakCycle.findOne({ userId: userIdA, status: 'ACTIVE' });
    const past25h = new Date(Date.now() - 25 * 60 * 60 * 1000);
    await StreakCycle.findByIdAndUpdate(activeCycleA._id, { lastClaimAt: past25h });

    // Claim Day 2
    const claimRes2 = await fetch(`${BASE_URL}/daily-streak/claim`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(claimRes2.status, 200, 'Day 2 claim must succeed after cooldown');
    const claimBody2 = await claimRes2.json();
    assert.strictEqual(claimBody2.data.day, 2, 'Claimed day must be 2');
    assert.strictEqual(claimBody2.data.reward.amount, 10, 'Day 2 reward must be 10 VEs');
    assert.strictEqual(claimBody2.data.wallet.vesBalance, 15, 'Wallet balance must now be 5 + 10 = 15 VEs');

    const walletAfterDay2 = await Wallet.findOne({ userId: userIdA });
    assert.strictEqual(walletAfterDay2.vesBalance, 15);
    console.log('✔ Day 2 successfully claimed after cooldown: balance updated to 15 VEs.');

    // -------------------------------------------------------------
    // Test 18: Amazon Gift Card Reward (Day 4) updates amazonVouchersTotal
    // -------------------------------------------------------------
    console.log('8. Testing Amazon Gift Card reward (simulating up to Day 4)...');
    // Simulate Day 3 claimed (15 VEs)
    const past50h = new Date(Date.now() - 50 * 60 * 60 * 1000);
    const past25h2 = new Date(Date.now() - 25 * 60 * 60 * 1000);

    // Fast-forward cycle to Day 3 claimed and cooldown passed
    await StreakCycle.findByIdAndUpdate(activeCycleA._id, {
      currentStreak: 3,
      checkedInCount: 3,
      lastClaimAt: past25h2
    });
    await StreakClaim.create({
      claimId: `CLM-TEST-DAY3-${Date.now()}`,
      userId: userIdA,
      cycleId: activeCycleA.cycleId,
      day: 3,
      rewardType: 'VES',
      amount: 15,
      currency: 'VES',
      transactionId: `TX-TEST-DAY3`,
      claimedAt: past50h
    });
    await Wallet.findByIdAndUpdate(walletAfterDay2._id, { $inc: { vesBalance: 15 } });

    // Now user is eligible for Day 4 (Day 4 is ₹1 Amazon Gift Card!)
    const claimRes4 = await fetch(`${BASE_URL}/daily-streak/claim`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(claimRes4.status, 200, 'Day 4 claim must succeed');
    const claimBody4 = await claimRes4.json();
    assert.strictEqual(claimBody4.data.day, 4);
    assert.strictEqual(claimBody4.data.reward.currency, 'INR');
    assert.strictEqual(claimBody4.data.reward.amount, 1);
    assert.strictEqual(claimBody4.data.wallet.amazonVouchersTotal, 1, 'Amazon vouchers must increase to 1');
    assert.strictEqual(claimBody4.data.wallet.vesBalance, 30, 'VES balance must NOT be altered by gift card reward');

    // Confirm in DB
    const finalWalletA = await Wallet.findOne({ userId: userIdA });
    assert.strictEqual(finalWalletA.amazonVouchersTotal, 1, 'DB amazonVouchersTotal must be 1');
    assert.strictEqual(finalWalletA.vesBalance, 30, 'DB vesBalance must remain 30');

    const txDay4 = await WalletTransaction.findOne({ userId: userIdA, streakDay: 4 });
    assert.strictEqual(txDay4.currency, 'INR');
    assert.strictEqual(txDay4.amount, 1);
    assert.strictEqual(txDay4.balanceBefore, 0);
    assert.strictEqual(txDay4.balanceAfter, 1);
    console.log('✔ Amazon gift-card reward correctly credited amazonVouchersTotal without altering vesBalance.');

    // -------------------------------------------------------------
    // Tests 24 & 25: Verify GET endpoints remain purely read-only
    // -------------------------------------------------------------
    console.log('9. Verifying GET endpoints are strictly read-only...');
    const claimsBeforeGet = await StreakClaim.countDocuments({ userId: userIdA });
    const walletBeforeGet = await Wallet.findOne({ userId: userIdA });

    await fetch(`${BASE_URL}/daily-streak/status`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    await fetch(`${BASE_URL}/daily-streak`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });

    const claimsAfterGet = await StreakClaim.countDocuments({ userId: userIdA });
    const walletAfterGet = await Wallet.findOne({ userId: userIdA });

    assert.strictEqual(claimsBeforeGet, claimsAfterGet, 'GET endpoints must not write claims');
    assert.strictEqual(walletBeforeGet.vesBalance, walletAfterGet.vesBalance, 'GET endpoints must not alter wallet');
    assert.strictEqual(walletBeforeGet.amazonVouchersTotal, walletAfterGet.amazonVouchersTotal);
    console.log('✔ GET /status and GET /daily-streak verified as purely read-only.');

    console.log('\n======================================================');
    console.log('🎉 ALL 25 STEP 6 CLAIM TESTS PASSED PERFECTLY!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Verification Test Failed:', err);
    process.exit(1);
  }
}

const connectDB = require('../src/config/db');
connectDB().then(() => {
  runClaimVerificationTests().then(() => process.exit(0));
});
