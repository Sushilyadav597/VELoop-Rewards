const { getOrCreateWallet } = require('./wallet.service');

const BASE_LEADERBOARD_USERS = [
  { rank: 1, name: 'Aarav Sharma', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face', level: 14, points: 8940, streak: 28, badge: 'Grandmaster 🥇', change: '+1' },
  { rank: 2, name: 'Priya Patel', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', level: 12, points: 7420, streak: 21, badge: 'Master 🥈', change: '0' },
  { rank: 3, name: 'Rohan Mehta', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face', level: 11, points: 6810, streak: 19, badge: 'Elite 🥉', change: '+3' },
  { rank: 4, name: 'Ananya Iyer', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face', level: 9, points: 5120, streak: 14, badge: 'Diamond', change: '-1' },
  { rank: 5, name: 'Vikram Singh', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', level: 8, points: 4350, streak: 12, badge: 'Platinum', change: '+2' },
  { rank: 6, name: 'Neha Gupta', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', level: 8, points: 4180, streak: 11, badge: 'Platinum', change: '0' },
  { rank: 7, name: 'Kabir Verma', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', level: 7, points: 3820, streak: 9, badge: 'Gold', change: '-2' },
  { rank: 8, name: 'Tanvi Nair', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', level: 6, points: 3490, streak: 8, badge: 'Gold', change: '+1' },
  { rank: 9, name: 'Devendra Rao', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=face', level: 6, points: 3100, streak: 8, badge: 'Gold', change: '0' },
  { rank: 10, name: 'Sneha Deshmukh', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', level: 5, points: 2850, streak: 7, badge: 'Silver', change: '+4' }
];

const getLeaderboard = async (userId, timeframe = 'weekly') => {
  const userIdStr = (userId || 'guest').toString();
  const wallet = await getOrCreateWallet(userIdStr);

  const userPoints = (wallet.vesBalance || 0) + (wallet.amazonVouchersTotal ? wallet.amazonVouchersTotal * 100 : 0);
  const userEffectivePoints = Math.max(userPoints, 2450);

  // User rank row
  const currentUserRow = {
    rank: 18,
    name: 'You (Current User)',
    isCurrentUser: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    level: Math.max(1, Math.floor(Math.sqrt(userEffectivePoints / 25)) + 1),
    points: userEffectivePoints,
    streak: 7,
    badge: 'Silver ⭐',
    change: '+2',
    percentile: 'Top 5%'
  };

  return {
    timeframe,
    podium: BASE_LEADERBOARD_USERS.slice(0, 3),
    leaders: BASE_LEADERBOARD_USERS,
    currentUser: currentUserRow,
    totalParticipants: 1248,
    nextResetInHours: 36
  };
};

module.exports = {
  getLeaderboard
};
