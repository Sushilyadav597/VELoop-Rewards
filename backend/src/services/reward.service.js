const StreakReward = require('../models/StreakReward');
const { getDBStatus } = require('../config/db');
const { DEFAULT_REWARDS } = require('../config/streakConfig');

let inMemoryRewards = [...DEFAULT_REWARDS];

const getAllRewards = async () => {
  if (getDBStatus()) {
    try {
      const rewards = await StreakReward.find({ active: true }).sort({ day: 1 }).lean();
      if (rewards && rewards.length > 0) return rewards;
    } catch (err) {
      console.warn('[Reward Service DB fallback]:', err.message);
    }
  }
  return inMemoryRewards.filter(r => r.active);
};

const getRewardByDay = async (day) => {
  const dayNum = Number(day);
  if (getDBStatus()) {
    try {
      const reward = await StreakReward.findOne({ day: dayNum, active: true }).lean();
      if (reward) return reward;
    } catch (err) {
      console.warn('[Reward Service DB fallback]:', err.message);
    }
  }
  return inMemoryRewards.find(r => r.day === dayNum && r.active) || null;
};

const getUltimateReward = async () => {
  const rewards = await getAllRewards();
  return rewards.find(r => r.day === 7) || rewards[rewards.length - 1];
};

const updateRewardConfig = async (day, updates) => {
  const dayNum = Number(day);
  if (getDBStatus()) {
    await StreakReward.findOneAndUpdate({ day: dayNum }, { $set: updates }, { new: true, upsert: true });
  }
  const index = inMemoryRewards.findIndex(r => r.day === dayNum);
  if (index !== -1) {
    inMemoryRewards[index] = { ...inMemoryRewards[index], ...updates };
  } else {
    inMemoryRewards.push({ day: dayNum, ...updates });
  }
  return getRewardByDay(dayNum);
};

module.exports = {
  getAllRewards,
  getRewardByDay,
  getUltimateReward,
  updateRewardConfig
};
