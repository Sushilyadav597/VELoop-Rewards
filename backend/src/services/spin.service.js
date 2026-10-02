const { creditPoints, getOrCreateWallet } = require('./wallet.service');
const { getServerTime } = require('../utils/time.utils');

// Wheel segments with weights and rewards
const SPIN_SEGMENTS = [
  { id: 'seg-1', label: '25 VEs', amount: 25, currency: 'VES', probability: 0.28, color: '#8B5CF6', icon: '🪙' },
  { id: 'seg-2', label: '50 VEs', amount: 50, currency: 'VES', probability: 0.20, color: '#6366F1', icon: '🪙' },
  { id: 'seg-3', label: '₹10 Amazon', amount: 10, currency: 'INR', probability: 0.08, color: '#F59E0B', icon: '🎟️' },
  { id: 'seg-4', label: '10 VEs', amount: 10, currency: 'VES', probability: 0.24, color: '#10B981', icon: '🪙' },
  { id: 'seg-5', label: '100 VEs', amount: 100, currency: 'VES', probability: 0.08, color: '#EC4899', icon: '💎' },
  { id: 'seg-6', label: '20 Gems', amount: 20, currency: 'GEMS', probability: 0.06, color: '#3B82F6', icon: '💎' },
  { id: 'seg-7', label: '₹25 Voucher', amount: 25, currency: 'INR', probability: 0.04, color: '#EAB308', icon: '🎟️' },
  { id: 'seg-8', label: '250 Jackpot', amount: 250, currency: 'VES', probability: 0.02, color: '#A855F7', icon: '👑' }
];

// Track last spin timestamps per user
const userSpinTimestamps = new Map();

const getSpinStatus = async (userId) => {
  const userIdStr = (userId || 'guest').toString();
  const now = getServerTime().getTime();
  const lastSpin = userSpinTimestamps.get(userIdStr) || 0;
  const cooldownMs = 24 * 60 * 60 * 1000; // 24 hours for daily free spin
  const elapsed = now - lastSpin;
  const canFreeSpin = elapsed >= cooldownMs || lastSpin === 0;
  const remainingCooldownMs = canFreeSpin ? 0 : cooldownMs - elapsed;

  const wallet = await getOrCreateWallet(userIdStr);

  return {
    canFreeSpin,
    remainingCooldownMs,
    nextFreeSpinAt: canFreeSpin ? null : new Date(lastSpin + cooldownMs).toISOString(),
    segments: SPIN_SEGMENTS.map((s, index) => ({
      index,
      id: s.id,
      label: s.label,
      amount: s.amount,
      currency: s.currency,
      color: s.color,
      icon: s.icon
    })),
    costPerGemSpin: 10,
    canGemSpin: (wallet.gemsBalance || 0) >= 10
  };
};

const executeSpin = async ({ userId, useGems = false }) => {
  const userIdStr = (userId || 'guest').toString();
  const now = getServerTime().getTime();
  const lastSpin = userSpinTimestamps.get(userIdStr) || 0;
  const cooldownMs = 24 * 60 * 60 * 1000;
  const elapsed = now - lastSpin;
  const canFreeSpin = elapsed >= cooldownMs || lastSpin === 0;

  const wallet = await getOrCreateWallet(userIdStr);

  if (!canFreeSpin && !useGems) {
    const error = new Error('Daily free spin already claimed. You can spin again with 10 Gems or wait for the cooldown.');
    error.statusCode = 429;
    throw error;
  }

  if (useGems && !canFreeSpin) {
    if ((wallet.gemsBalance || 0) < 10) {
      const error = new Error('Insufficient gems for an extra spin (requires 10 Gems).');
      error.statusCode = 400;
      throw error;
    }
  }

  // Authoritative weighted random selection on backend
  const rand = Math.random();
  let cumulative = 0;
  let winningIndex = 0;

  for (let i = 0; i < SPIN_SEGMENTS.length; i++) {
    cumulative += SPIN_SEGMENTS[i].probability;
    if (rand <= cumulative) {
      winningIndex = i;
      break;
    }
  }

  const winningSegment = SPIN_SEGMENTS[winningIndex];

  // If using gems, deduct 10 gems first
  if (useGems && !canFreeSpin) {
    const { debitPoints } = require('./wallet.service');
    await debitPoints({
      userId: userIdStr,
      amount: 10,
      currency: 'GEMS',
      source: 'SPIN_FEE',
      description: 'Used 10 Gems for extra Lucky Spin'
    });
  } else {
    // Record free spin usage
    userSpinTimestamps.set(userIdStr, now);
  }

  // Credit winning reward to wallet
  const creditResult = await creditPoints({
    userId: userIdStr,
    amount: winningSegment.amount,
    currency: winningSegment.currency,
    source: 'LUCKY_SPIN',
    referenceId: `SPIN-${Date.now()}`,
    description: `Won ${winningSegment.label} on Lucky Spin Wheel`
  });

  return {
    success: true,
    winningIndex,
    reward: {
      id: winningSegment.id,
      label: winningSegment.label,
      amount: winningSegment.amount,
      currency: winningSegment.currency,
      icon: winningSegment.icon
    },
    wallet: creditResult.wallet,
    transaction: creditResult.transaction,
    nextFreeSpinAt: new Date(now + cooldownMs).toISOString()
  };
};

module.exports = {
  SPIN_SEGMENTS,
  getSpinStatus,
  executeSpin
};
