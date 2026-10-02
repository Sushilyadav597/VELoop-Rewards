const { creditPoints, getOrCreateWallet } = require('./wallet.service');

// Curated interactive tasks
const DEFAULT_TASKS = [
  {
    id: 'task-watch',
    title: 'Watch & Earn: Rewards Tour',
    description: 'Learn how to maximize your daily streak multipliers and unlock Amazon vouchers.',
    category: 'Activity',
    icon: '🎬',
    reward: 100,
    currency: 'VES',
    progress: 80,
    target: 100,
    difficulty: 'Easy',
    estimatedTime: '2 mins'
  },
  {
    id: 'task-social-x',
    title: 'Follow VELoop on X',
    description: 'Stay updated on daily flash drops, booster codes, and weekly leaderboard prizes.',
    category: 'Social',
    icon: '📱',
    reward: 50,
    currency: 'VES',
    progress: 0,
    target: 1,
    difficulty: 'Quick',
    estimatedTime: '30 secs'
  },
  {
    id: 'task-survey',
    title: 'Rewards Experience Survey',
    description: 'Provide quick feedback on the daily check-in UI to earn instant bonus coins.',
    category: 'Feedback',
    icon: '📋',
    reward: 200,
    currency: 'VES',
    progress: 100,
    target: 100,
    difficulty: 'Medium',
    estimatedTime: '3 mins'
  },
  {
    id: 'task-referral',
    title: 'Invite Your First Teammate',
    description: 'Share your invite link with a peer. Earn 150 VEs coins when they complete Day 1.',
    category: 'Growth',
    icon: '👥',
    reward: 150,
    currency: 'VES',
    progress: 1,
    target: 3,
    difficulty: 'Rewarding',
    estimatedTime: '5 mins'
  },
  {
    id: 'task-streak-booster',
    title: 'Check-in 3 Days in a Row',
    description: 'Build your streak momentum to level up faster and unlock higher tier voucher pools.',
    category: 'Streak',
    icon: '🔥',
    reward: 75,
    currency: 'VES',
    progress: 3,
    target: 3,
    difficulty: 'Daily',
    estimatedTime: '10 secs'
  },
  {
    id: 'task-lucky-spin',
    title: 'Spin the Lucky Wheel',
    description: 'Try your luck on the interactive prize wheel for a shot at the 250 VEs jackpot.',
    category: 'Minigame',
    icon: '🎡',
    reward: 35,
    currency: 'VES',
    progress: 0,
    target: 1,
    difficulty: 'Fun',
    estimatedTime: '15 secs'
  }
];

// Per-user completed task IDs map: userId -> Set of completed task IDs
const userCompletedTasks = new Map();

const getUserTasks = async (userId) => {
  const userIdStr = (userId || 'guest').toString();
  const completedSet = userCompletedTasks.get(userIdStr) || new Set();

  return DEFAULT_TASKS.map((task) => {
    const isCompleted = completedSet.has(task.id);
    return {
      ...task,
      isCompleted,
      progress: isCompleted ? task.target : task.progress
    };
  });
};

const completeTask = async ({ userId, taskId }) => {
  const userIdStr = (userId || 'guest').toString();
  const task = DEFAULT_TASKS.find((t) => t.id === taskId);

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  if (!userCompletedTasks.has(userIdStr)) {
    userCompletedTasks.set(userIdStr, new Set());
  }

  const completedSet = userCompletedTasks.get(userIdStr);
  if (completedSet.has(taskId)) {
    const error = new Error('Task already completed');
    error.statusCode = 400;
    throw error;
  }

  // Mark task completed
  completedSet.add(taskId);

  // Credit reward to wallet
  const creditResult = await creditPoints({
    userId: userIdStr,
    amount: task.reward,
    currency: task.currency,
    source: 'TASK_COMPLETION',
    referenceId: `TASK-${taskId}-${Date.now()}`,
    description: `Completed task: ${task.title}`
  });

  const updatedTasks = await getUserTasks(userIdStr);

  return {
    success: true,
    message: `Completed "${task.title}"! Earned +${task.reward} ${task.currency}`,
    earnedPoints: task.reward,
    currency: task.currency,
    task: { ...task, isCompleted: true, progress: task.target },
    tasks: updatedTasks,
    wallet: creditResult.wallet,
    transaction: creditResult.transaction
  };
};

module.exports = {
  getUserTasks,
  completeTask
};
