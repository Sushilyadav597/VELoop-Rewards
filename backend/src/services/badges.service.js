const { getOrCreateWallet } = require('./wallet.service');

const ALL_BADGES = [
  {
    id: 'badge-first-reward',
    title: 'First Reward',
    category: 'Daily Streak',
    description: 'Claim your very first daily streak check-in reward.',
    icon: '🏆',
    rarity: 'Common',
    xpReward: 50,
    requirement: 'Claim 1 Daily Reward',
    unlockedAt: '2026-09-26T10:15:00Z',
    isUnlocked: true,
    progress: 1,
    target: 1
  },
  {
    id: 'badge-7-streak',
    title: '7 Day Streak',
    category: 'Consistency',
    description: 'Maintain check-ins for 7 continuous days without resetting.',
    icon: '🔥',
    rarity: 'Rare',
    xpReward: 200,
    requirement: 'Reach 7-day streak',
    unlockedAt: '2026-10-02T12:00:00Z',
    isUnlocked: true,
    progress: 7,
    target: 7
  },
  {
    id: 'badge-1000-points',
    title: '1,000 Points',
    category: 'Wealth',
    description: 'Amass over 1,000 total rewards points in your vault.',
    icon: '💰',
    rarity: 'Rare',
    xpReward: 250,
    requirement: 'Earn 1,000 Points',
    unlockedAt: '2026-10-01T15:30:00Z',
    isUnlocked: true,
    progress: 2450,
    target: 1000
  },
  {
    id: 'badge-10-tasks',
    title: '10 Tasks',
    category: 'Activities',
    description: 'Complete 10 activities and partner tasks on VELoop.',
    icon: '🎯',
    rarity: 'Epic',
    xpReward: 300,
    requirement: 'Complete 10 Tasks',
    unlockedAt: null,
    isUnlocked: false,
    progress: 6,
    target: 10
  },
  {
    id: 'badge-first-referral',
    title: 'First Referral',
    category: 'Social',
    description: 'Invite a verified friend who completes their first streak check-in.',
    icon: '👥',
    rarity: 'Rare',
    xpReward: 150,
    requirement: 'Invite 1 Friend',
    unlockedAt: null,
    isUnlocked: false,
    progress: 0,
    target: 1
  },
  {
    id: 'badge-lucky-spinner',
    title: 'Lucky Spinner',
    category: 'Minigames',
    description: 'Spin the Lucky Wheel 5 times and score bonus points.',
    icon: '🎡',
    rarity: 'Common',
    xpReward: 100,
    requirement: 'Spin Wheel 5 times',
    unlockedAt: null,
    isUnlocked: false,
    progress: 3,
    target: 5
  },
  {
    id: 'badge-ultimate-voucher',
    title: 'Amazon Legend',
    category: 'Milestone',
    description: 'Unlock and claim the Day 7 Ultimate Amazon Voucher jackpot.',
    icon: '👑',
    rarity: 'Legendary',
    xpReward: 500,
    requirement: 'Claim Day 7 Voucher',
    unlockedAt: null,
    isUnlocked: false,
    progress: 0,
    target: 1
  }
];

const getUserBadges = async (userId) => {
  const userIdStr = (userId || 'guest').toString();
  const wallet = await getOrCreateWallet(userIdStr);

  const totalPoints = (wallet.vesBalance || 0) + (wallet.amazonVouchersTotal ? wallet.amazonVouchersTotal * 100 : 0);

  // Dynamically verify points condition
  const badges = ALL_BADGES.map((b) => {
    if (b.id === 'badge-1000-points') {
      const unlocked = totalPoints >= 1000 || b.isUnlocked;
      return {
        ...b,
        isUnlocked: unlocked,
        progress: Math.max(totalPoints, b.progress)
      };
    }
    return b;
  });

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return {
    badges,
    stats: {
      total: badges.length,
      unlocked: unlockedCount,
      completionRate: Math.round((unlockedCount / badges.length) * 100),
      totalBadgeXP: badges.filter((b) => b.isUnlocked).reduce((acc, curr) => acc + curr.xpReward, 0)
    }
  };
};

module.exports = {
  getUserBadges
};
