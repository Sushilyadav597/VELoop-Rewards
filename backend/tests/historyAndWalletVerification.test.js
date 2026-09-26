require('dotenv').config();
const assert = require('assert');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Wallet = require('../src/models/Wallet');
const StreakClaim = require('../src/models/StreakClaim');
const WalletTransaction = require('../src/models/WalletTransaction');

const BASE_URL = 'http://localhost:5001/api';

async function runHistoryAndWalletTests() {
  console.log('🧪 Starting Step 7 History & Wallet Verification Suite...\n');

  try {
    // -------------------------------------------------------------
    // SETUP: Register User A & User B
    // -------------------------------------------------------------
    console.log('Setup: Registering User A and User B...');
    const emailA = `hist_user_a_${Date.now()}@example.com`;
    const regResA = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'History User A', email: emailA, password: 'Password123!' })
    });
    const regDataA = await regResA.json();
    const tokenA = regDataA.token;
    const userIdA = regDataA.user.id;

    const emailB = `hist_user_b_${Date.now()}@example.com`;
    const regResB = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'History User B', email: emailB, password: 'Password123!' })
    });
    const regDataB = await regResB.json();
    const tokenB = regDataB.token;
    const userIdB = regDataB.user.id;
    console.log(`✔ Registered User A (${userIdA}) and User B (${userIdB})`);

    // User A claims Day 1
    const claimResA = await fetch(`${BASE_URL}/daily-streak/claim`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(claimResA.status, 200, 'User A claim Day 1 should succeed');
    const claimDataA = await claimResA.json();
    const claimIdA = claimDataA.data.claimId;
    const txIdA = claimDataA.data.transactionId;

    // User B claims Day 1
    const claimResB = await fetch(`${BASE_URL}/daily-streak/claim`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.strictEqual(claimResB.status, 200, 'User B claim Day 1 should succeed');
    const claimDataB = await claimResB.json();
    const claimIdB = claimDataB.data.claimId;
    const txIdB = claimDataB.data.transactionId;
    console.log(`✔ User A and User B each claimed Day 1 successfully.`);

    // -------------------------------------------------------------
    // Test 1: Daily Streak History API - Authentication & Structure
    // -------------------------------------------------------------
    console.log('\n1. Testing GET /api/daily-streak/history authentication...');
    const unauthHistory = await fetch(`${BASE_URL}/daily-streak/history`);
    assert.strictEqual(unauthHistory.status, 401, 'Unauthenticated history must return 401');

    const badTokenHistory = await fetch(`${BASE_URL}/daily-streak/history`, {
      headers: { Authorization: 'Bearer bad.token' }
    });
    assert.strictEqual(badTokenHistory.status, 401, 'Invalid token must return 401');
    console.log('✔ History endpoint protected with 401 on missing/invalid token.');

    // -------------------------------------------------------------
    // Test 2: User A retrieves their history
    // -------------------------------------------------------------
    console.log('\n2. User A retrieves history...');
    const histResA = await fetch(`${BASE_URL}/daily-streak/history`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(histResA.status, 200);
    const histBodyA = await histResA.json();
    assert.strictEqual(histBodyA.success, true);
    assert.ok(histBodyA.data.history, 'History array must exist');
    assert.strictEqual(histBodyA.data.history.length, 1, 'User A should have exactly 1 history record');

    const itemA = histBodyA.data.history[0];
    assert.strictEqual(itemA.claimId, claimIdA, 'claimId must match User A');
    assert.strictEqual(itemA.day, 1, 'day must be 1');
    assert.strictEqual(itemA.amount, 5, 'amount must be 5');
    assert.strictEqual(itemA.currency, 'VES', 'currency must be VES');
    assert.strictEqual(itemA.transactionId, txIdA, 'transactionId must match');
    assert.strictEqual(itemA.status, 'SUCCESS');
    assert.ok(itemA.reward, 'reward snapshot must be present');
    assert.ok(itemA.claimedAt, 'claimedAt must be present');
    assert.strictEqual(histBodyA.passwordHash, undefined, 'passwordHash must never be exposed');
    assert.strictEqual(itemA.passwordHash, undefined);
    console.log('✔ User A history payload verified with accurate reward snapshot and fields.');

    // -------------------------------------------------------------
    // Test 3: Pagination on History
    // -------------------------------------------------------------
    console.log('\n3. Testing history pagination with limit & page...');
    const pagedHistRes = await fetch(`${BASE_URL}/daily-streak/history?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const pagedHist = await pagedHistRes.json();
    assert.strictEqual(pagedHist.data.pagination.page, 1);
    assert.strictEqual(pagedHist.data.pagination.limit, 1);
    assert.strictEqual(pagedHist.data.pagination.total, 1);
    assert.strictEqual(pagedHist.data.pagination.totalPages, 1);

    // Test huge limit clamped to 100
    const hugeLimitRes = await fetch(`${BASE_URL}/daily-streak/history?page=-5&limit=999`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const hugeLimit = await hugeLimitRes.json();
    assert.strictEqual(hugeLimit.data.pagination.page, 1, 'Negative page normalized to 1');
    assert.strictEqual(hugeLimit.data.pagination.limit, 100, 'Limit above 100 clamped to 100');
    console.log('✔ Pagination and safe input normalization verified.');

    // -------------------------------------------------------------
    // Test 4: Wallet API (GET /api/wallet)
    // -------------------------------------------------------------
    console.log('\n4. Testing GET /api/wallet authentication and structure...');
    const unauthWallet = await fetch(`${BASE_URL}/wallet`);
    assert.strictEqual(unauthWallet.status, 401, 'Unauthenticated wallet must return 401');

    const walletResA = await fetch(`${BASE_URL}/wallet`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(walletResA.status, 200);
    const walletBodyA = await walletResA.json();
    assert.strictEqual(walletBodyA.success, true);
    assert.strictEqual(walletBodyA.data.vesBalance, 5, 'User A wallet must have 5 VEs');
    assert.strictEqual(walletBodyA.data.amazonVouchersTotal, 0, 'Amazon vouchers must be 0');
    assert.ok(walletBodyA.data.id, 'Wallet id must be exposed');
    assert.strictEqual(walletBodyA.data.userId, undefined, 'Raw internal Mongo userId should not be exposed');
    console.log('✔ Wallet API verified: returns safe wallet balances.');

    // -------------------------------------------------------------
    // Test 5: Wallet Transactions API (GET /api/wallet/transactions)
    // -------------------------------------------------------------
    console.log('\n5. Testing GET /api/wallet/transactions...');
    const unauthTx = await fetch(`${BASE_URL}/wallet/transactions`);
    assert.strictEqual(unauthTx.status, 401, 'Unauthenticated transactions must return 401');

    const txResA = await fetch(`${BASE_URL}/wallet/transactions`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(txResA.status, 200);
    const txBodyA = await txResA.json();
    assert.strictEqual(txBodyA.success, true);
    assert.strictEqual(txBodyA.data.transactions.length, 1, 'User A should have exactly 1 transaction');

    const txA = txBodyA.data.transactions[0];
    assert.strictEqual(txA.transactionId, txIdA);
    assert.strictEqual(txA.type, 'CREDIT');
    assert.strictEqual(txA.amount, 5);
    assert.strictEqual(txA.currency, 'VES');
    assert.strictEqual(txA.source, 'DAILY_STREAK');
    assert.strictEqual(txA.streakDay, 1);
    assert.strictEqual(txA.referenceId, claimIdA);
    assert.strictEqual(txA.balanceBefore, 0);
    assert.strictEqual(txA.balanceAfter, 5);
    assert.strictEqual(txA.status, 'COMPLETED');
    assert.ok(txA.createdAt);
    console.log('✔ Wallet transactions verified with complete traceable audit fields.');

    // -------------------------------------------------------------
    // Test 6: Strict User Isolation / Anti-Spoofing
    // -------------------------------------------------------------
    console.log('\n6. Testing strict user isolation and query-parameter spoofing resistance...');

    // User B tries to spy on User A's history using ?userId=userIdA
    const spoofHistRes = await fetch(`${BASE_URL}/daily-streak/history?userId=${userIdA}`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    const spoofHist = await spoofHistRes.json();
    assert.strictEqual(spoofHist.data.history.length, 1);
    assert.strictEqual(
      spoofHist.data.history[0].claimId,
      claimIdB,
      'Server MUST return User B records, completely ignoring spoofed ?userId= parameter'
    );

    // User B tries to spy on User A's wallet using ?userId=userIdA
    const spoofWalletRes = await fetch(`${BASE_URL}/wallet?userId=${userIdA}`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    const spoofWallet = await spoofWalletRes.json();
    const actualWalletB = await Wallet.findOne({ userId: userIdB });
    assert.strictEqual(
      spoofWallet.data.id,
      actualWalletB._id.toString(),
      'Server MUST return User B wallet, completely ignoring spoofed ?userId='
    );

    // User B tries to spy on User A's transactions using ?userId=userIdA
    const spoofTxRes = await fetch(`${BASE_URL}/wallet/transactions?userId=${userIdA}`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    const spoofTx = await spoofTxRes.json();
    assert.strictEqual(
      spoofTx.data.transactions[0].transactionId,
      txIdB,
      'Server MUST return User B transactions, completely ignoring spoofed ?userId='
    );

    console.log('✔ Strict user isolation verified: user parameters completely ignored; authenticated JWT identity enforced.');

    console.log('\n======================================================');
    console.log('🎉 ALL STEP 7 HISTORY & WALLET TESTS PASSED PERFECTLY!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Verification Test Failed:', err);
    process.exit(1);
  }
}

const connectDB = require('../src/config/db');
connectDB().then(() => {
  runHistoryAndWalletTests().then(() => process.exit(0));
});
