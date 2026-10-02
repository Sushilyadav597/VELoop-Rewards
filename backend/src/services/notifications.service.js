// User notification store
const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Points Credited',
    message: '🎉 You earned 100 points from Daily Streak check-in',
    type: 'POINTS',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    isRead: false,
    icon: '🎉'
  },
  {
    id: 'notif-2',
    title: 'Milestone Unlocked',
    message: '🔥 7-day streak achieved! You unlocked a 2x bonus multiplier.',
    type: 'STREAK',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: false,
    icon: '🔥'
  },
  {
    id: 'notif-3',
    title: 'Leaderboard Climb',
    message: '🏆 Rank increased! You moved up to #18 in the global leaderboard.',
    type: 'RANK',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    icon: '🏆'
  },
  {
    id: 'notif-4',
    title: 'Rotating Drop Ready',
    message: '🎁 Daily rotating drop is available! Claim your surprise bonus.',
    type: 'REWARD',
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    icon: '🎁'
  },
  {
    id: 'notif-5',
    title: 'Referral Bonus',
    message: '👥 Referral reward received: +150 VEs added to your wallet.',
    type: 'REFERRAL',
    timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    icon: '👥'
  }
];

const userNotificationsMap = new Map();

const getUserNotifications = async (userId) => {
  const userIdStr = (userId || 'guest').toString();
  if (!userNotificationsMap.has(userIdStr)) {
    userNotificationsMap.set(userIdStr, JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS)));
  }
  const notifs = userNotificationsMap.get(userIdStr);
  const unreadCount = notifs.filter((n) => !n.isRead).length;

  return {
    notifications: notifs,
    unreadCount
  };
};

const markAsRead = async (userId, notificationId) => {
  const userIdStr = (userId || 'guest').toString();
  if (!userNotificationsMap.has(userIdStr)) {
    userNotificationsMap.set(userIdStr, JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS)));
  }
  const notifs = userNotificationsMap.get(userIdStr);
  if (notificationId === 'all') {
    notifs.forEach((n) => (n.isRead = true));
  } else {
    const item = notifs.find((n) => n.id === notificationId);
    if (item) item.isRead = true;
  }

  const unreadCount = notifs.filter((n) => !n.isRead).length;
  return {
    success: true,
    notifications: notifs,
    unreadCount
  };
};

const addNotification = async (userId, { title, message, type = 'INFO', icon = '🔔' }) => {
  const userIdStr = (userId || 'guest').toString();
  if (!userNotificationsMap.has(userIdStr)) {
    userNotificationsMap.set(userIdStr, JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS)));
  }
  const notifs = userNotificationsMap.get(userIdStr);
  const newNotif = {
    id: `notif-${Date.now()}`,
    title,
    message,
    type,
    timestamp: new Date().toISOString(),
    isRead: false,
    icon
  };
  notifs.unshift(newNotif);
  return newNotif;
};

module.exports = {
  getUserNotifications,
  markAsRead,
  addNotification
};
