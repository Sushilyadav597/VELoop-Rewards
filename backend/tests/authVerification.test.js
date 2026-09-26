require('dotenv').config();
const assert = require('assert');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Wallet = require('../src/models/Wallet');

const BASE_URL = 'http://localhost:5001/api/auth';
const TEST_EMAIL = `test_${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPassword123';
const TEST_NAME = 'Test User';

async function runAuthTests() {
  console.log('🧪 Starting Step 4 Authentication Verification Suite...\n');

  try {
    // 1. Register new user
    console.log('1. Testing registration with valid data...');
    const regRes = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: TEST_NAME,
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      })
    });

    const regData = await regRes.json();
    assert.strictEqual(regRes.status, 201, `Expected status 201, got ${regRes.status}`);
    assert.strictEqual(regData.success, true, 'Registration success should be true');
    assert.ok(regData.token, 'Token should be returned');
    assert.ok(regData.user, 'User object should be returned');
    assert.strictEqual(regData.user.email, TEST_EMAIL.toLowerCase(), 'Email should match');
    assert.strictEqual(regData.user.name, TEST_NAME, 'Name should match');
    assert.strictEqual(regData.passwordHash, undefined, 'passwordHash must NEVER be in response');
    assert.strictEqual(regData.user.passwordHash, undefined, 'passwordHash must NEVER be in user object');
    assert.ok(regData.wallet, 'Wallet should be returned');
    assert.strictEqual(typeof regData.wallet.vesBalance, 'number', 'Wallet must have vesBalance');
    console.log('✔ Registration API passed (returned token, user, wallet, no passwordHash).');

    const authToken = regData.token;
    const userId = regData.user.id;

    // 2. Check MongoDB user record
    console.log('2. Checking MongoDB user record directly in database...');
    const dbUser = await User.findOne({ email: TEST_EMAIL.toLowerCase() });
    assert.ok(dbUser, 'User must exist in MongoDB');
    console.log(`✔ User found in MongoDB (_id: ${dbUser._id}).`);

    // 3. Confirm password is hashed
    console.log('3. Confirming password is encrypted/hashed in MongoDB...');
    assert.notStrictEqual(dbUser.passwordHash, TEST_PASSWORD, 'Password must NOT be plain text');
    assert.ok(dbUser.passwordHash.startsWith('$2'), 'Password hash must be a bcrypt hash');
    console.log(`✔ Password in MongoDB is properly hashed: ${dbUser.passwordHash.substring(0, 15)}...`);

    // 4. Confirm passwordHash is never returned (already asserted in API response above)
    console.log('✔ Confirmed passwordHash is never returned in HTTP response.');

    // 5. Confirm wallet is created
    console.log('5. Confirming exactly one Wallet exists for user in MongoDB...');
    const userWallets = await Wallet.find({ userId: dbUser._id });
    assert.strictEqual(userWallets.length, 1, 'Exactly one wallet must exist for this user');
    console.log(`✔ Exactly 1 Wallet created for user with balances (VES: ${userWallets[0].vesBalance}, Vouchers: ${userWallets[0].amazonVouchersTotal}).`);

    // 6. Login with correct credentials
    console.log('6. Testing login with correct credentials...');
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      })
    });
    const loginData = await loginRes.json();
    assert.strictEqual(loginRes.status, 200, `Expected status 200, got ${loginRes.status}`);
    assert.strictEqual(loginData.success, true);
    assert.ok(loginData.token, 'Token must be present on login');
    assert.strictEqual(loginData.user.email, TEST_EMAIL.toLowerCase());
    assert.strictEqual(loginData.user.passwordHash, undefined, 'passwordHash must never be returned on login');
    console.log('✔ Login with correct credentials passed.');

    // 7. Login with wrong credentials
    console.log('7. Testing login with wrong password...');
    const wrongLoginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: 'WrongPassword999'
      })
    });
    assert.strictEqual(wrongLoginRes.status, 401, 'Should reject invalid credentials with 401');
    const wrongLoginData = await wrongLoginRes.json();
    assert.strictEqual(wrongLoginData.success, false);
    console.log('✔ Login with wrong credentials rejected with 401 Unauthorized.');

    // 8. Register duplicate email
    console.log('8. Testing registration with duplicate email...');
    const dupRes = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Another User',
        email: TEST_EMAIL,
        password: 'AnotherPassword123'
      })
    });
    assert.strictEqual(dupRes.status, 409, `Expected 409 Conflict, got ${dupRes.status}`);
    const dupData = await dupRes.json();
    assert.strictEqual(dupData.success, false);
    console.log('✔ Duplicate email registration rejected with 409 Conflict.');

    // 9. Call /api/auth/me without token
    console.log('9. Calling /api/auth/me without token...');
    const noTokenRes = await fetch(`${BASE_URL}/me`);
    assert.strictEqual(noTokenRes.status, 401, `Expected 401 Unauthorized, got ${noTokenRes.status}`);
    console.log('✔ Request without token rejected with 401.');

    // 10. Call /api/auth/me with invalid token
    console.log('10. Calling /api/auth/me with invalid token...');
    const invalidTokenRes = await fetch(`${BASE_URL}/me`, {
      headers: { Authorization: 'Bearer this.is.an.invalid.token' }
    });
    assert.strictEqual(invalidTokenRes.status, 401, `Expected 401 Unauthorized, got ${invalidTokenRes.status}`);
    console.log('✔ Request with invalid token rejected with 401.');

    // 11. Call /api/auth/me with valid token
    console.log('11. Calling /api/auth/me with valid token...');
    const validMeRes = await fetch(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert.strictEqual(validMeRes.status, 200, `Expected 200 OK, got ${validMeRes.status}`);
    const validMeData = await validMeRes.json();
    assert.strictEqual(validMeData.success, true);
    assert.strictEqual(validMeData.user.id, userId);
    assert.strictEqual(validMeData.user.email, TEST_EMAIL.toLowerCase());
    assert.strictEqual(validMeData.user.passwordHash, undefined, 'passwordHash must never be exposed');
    console.log('✔ /api/auth/me returned correct safe user identity:');
    console.log(JSON.stringify(validMeData, null, 2));

    console.log('\n======================================================');
    console.log('🎉 ALL 11 STEP 4 AUTHENTICATION TESTS PASSED PERFECTLY!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
}

// Connect to MongoDB directly to verify DB records during test
const connectDB = require('../src/config/db');
connectDB().then(() => {
  runAuthTests().then(() => process.exit(0));
});
