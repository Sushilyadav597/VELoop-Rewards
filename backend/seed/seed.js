require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../src/models/User');
const Wallet = require('../src/models/Wallet');
const StreakConfig = require('../src/models/StreakConfig');
const StreakReward = require('../src/models/StreakReward');
const StreakCycle = require('../src/models/StreakCycle');
const StreakClaim = require('../src/models/StreakClaim');
const WalletTransaction = require('../src/models/WalletTransaction');

const { DEFAULT_STREAK_CONFIG, DEFAULT_REWARDS } = require('../src/config/streakConfig');

const seedDatabase = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/veloop_rewards';
  console.log(`Connecting to MongoDB at: ${mongoURI}`);

  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5001 });
    console.log('MongoDB connected successfully for seeding.');

    // 1. Seed Streak Configuration
    await StreakConfig.deleteMany({});
    await StreakConfig.create({
      configKey: 'DEFAULT',
      ...DEFAULT_STREAK_CONFIG,
      isActive: true
    });
    console.log('✔ Streak configuration seeded.');

    // 2. Seed 7 Daily Streak Rewards
    await StreakReward.deleteMany({});
    await StreakReward.insertMany(DEFAULT_REWARDS);
    console.log('✔ 7-Day Streak Rewards configuration seeded.');

    // 3. Seed Demo Users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const demoUsers = [
      {
        username: 'demo_new',
        email: 'new@veloop.io',
        passwordHash,
        name: 'Alex (New Member)',
        role: 'USER'
      },
      {
        username: 'demo_day2',
        email: 'day2@veloop.io',
        passwordHash,
        name: 'Jordan (Day 2 Active)',
        role: 'USER'
      },
      {
        username: 'demo_day7',
        email: 'vip@veloop.io',
        passwordHash,
        name: 'Taylor (VIP Day 7)',
        role: 'USER'
      }
    ];

    for (const u of demoUsers) {
      let existing = await User.findOne({ username: u.username });
      if (!existing) {
        existing = await User.create(u);
      }

      // Ensure Wallet
      let wallet = await Wallet.findOne({ userId: existing._id });
      if (!wallet) {
        wallet = await Wallet.create({
          userId: existing._id,
          vesBalance: 100,
          gemsBalance: 120,
          amazonVouchersTotal: 0
        });
      }
    }
    console.log('✔ Demo accounts seeded (password: password123).');

    // Pre-populate demo_day2 with Day 1 claimed
    const day2User = await User.findOne({ username: 'demo_day2' });
    if (day2User) {
      await StreakCycle.deleteMany({ userId: day2User._id });
      await StreakClaim.deleteMany({ userId: day2User._id });

      const cycle = await StreakCycle.create({
        cycleId: `CYC-${day2User._id.toString().slice(-4)}-1-INITIAL`,
        userId: day2User._id,
        cycleNumber: 1,
        status: 'ACTIVE',
        currentStreak: 1,
        checkedInCount: 1,
        lastClaimAt: new Date(Date.now() - 25 * 60 * 60 * 1000) // claimed 25h ago -> now ready for Day 2!
      });

      await StreakClaim.create({
        claimId: `CLM-SEED-DAY1`,
        userId: day2User._id,
        cycleId: cycle.cycleId,
        day: 1,
        rewardSnapshot: DEFAULT_REWARDS[0],
        status: 'SUCCESS',
        transactionId: `TX-SEED-1`,
        claimedAt: new Date(Date.now() - 25 * 60 * 60 * 1000)
      });

      console.log('✔ Demo user "demo_day2" prepared with Day 1 claimed and Day 2 eligible.');
    }

    console.log('\n=========================================');
    console.log('🎉 Seeding completed successfully!');
    console.log('=========================================\n');
    process.exit(0);
  } catch (err) {
    console.error('Seeding notice:', err.message);
    console.log('Note: If MongoDB is not yet running on your computer, the backend also has an in-memory auto-seeder!');
    process.exit(0);
  }
};

seedDatabase();
