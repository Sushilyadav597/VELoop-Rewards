/**
 * Default Backend Streak System Configuration
 * All intervals, thresholds, and rewards are configurable.
 */

const DEFAULT_STREAK_CONFIG = {
  cycleDays: 7,
  totalRewards: 7,
  // Claim interval: 24 hours (86,400,000 ms) in normal operation.
  // Can be adjusted via environment or admin settings.
  claimCooldownMs: parseInt(process.env.CLAIM_COOLDOWN_MS, 10) || 24 * 60 * 60 * 1000,
  // Grace period before streak is considered missed: 24 hours after cooldown (total 48h from claim)
  claimGracePeriodMs: parseInt(process.env.CLAIM_GRACE_PERIOD_MS, 10) || 24 * 60 * 60 * 1000,
  autoResetOnMissed: true,
  allowCycleLooping: true
};

const DEFAULT_REWARDS = [
  {
    day: 1,
    title: 'Daily Reward',
    subtitle: '5 VEs',
    rewardType: 'VES',
    currency: 'VES',
    amount: 5,
    assetType: 'coin',
    badge: null,
    active: true,
    metadata: {
      description: 'Day 1 starter streak reward'
    }
  },
  {
    day: 2,
    title: 'Daily Reward',
    subtitle: '10 VEs',
    rewardType: 'VES',
    currency: 'VES',
    amount: 10,
    assetType: 'coin',
    badge: 'Today',
    active: true,
    metadata: {
      description: 'Day 2 streak reward'
    }
  },
  {
    day: 3,
    title: 'Daily Reward',
    subtitle: '15 VEs',
    rewardType: 'VES',
    currency: 'VES',
    amount: 15,
    assetType: 'coin',
    badge: null,
    active: true,
    metadata: {
      description: 'Day 3 streak reward'
    }
  },
  {
    day: 4,
    title: 'Daily Reward',
    subtitle: 'Amazon Gift Card',
    rewardType: 'GIFT_CARD',
    currency: 'INR',
    amount: 1,
    assetType: 'gift-box',
    badge: 'Gift Card',
    active: true,
    metadata: {
      provider: 'Amazon',
      denomination: 1
    }
  },
  {
    day: 5,
    title: 'Daily Reward',
    subtitle: 'Amazon Gift Card',
    rewardType: 'GIFT_CARD',
    currency: 'INR',
    amount: 2,
    assetType: 'amazon-card',
    badge: 'Gift Card',
    active: true,
    metadata: {
      provider: 'Amazon',
      denomination: 2
    }
  },
  {
    day: 6,
    title: 'Daily Reward',
    subtitle: '30 VEs',
    rewardType: 'VES',
    currency: 'VES',
    amount: 30,
    assetType: 'coin-stack',
    badge: 'Coin',
    active: true,
    metadata: {
      description: 'Day 6 streak booster'
    }
  },
  {
    day: 7,
    title: 'Ultimate Reward',
    subtitle: 'Amazon Gift Card',
    rewardType: 'ULTIMATE_GIFT_CARD',
    currency: 'INR',
    amount: 5,
    assetType: 'crown',
    badge: 'VIP',
    active: true,
    metadata: {
      provider: 'Amazon',
      denomination: 5,
      isUltimate: true
    }
  }
];

module.exports = {
  DEFAULT_STREAK_CONFIG,
  DEFAULT_REWARDS
};
