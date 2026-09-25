/**
 * Rotating Daily Drops Configuration
 * Each day of the week (0 = Sunday to 6 = Saturday) has a distinct, exciting reward theme.
 * The active reward automatically changes every 24 hours at 00:00:00 server time.
 */

const ROTATING_DROPS = [
  {
    dayOfWeek: 0,
    dayName: 'Sunday',
    theme: 'Mega Jackpot Sunday',
    badge: 'Mega Jackpot',
    title: 'Grand Weekend Crate',
    subtitle: '₹10 Amazon Gift Voucher',
    description: 'Cap off your week with the ultimate prize! A guaranteed ₹10 Amazon Gift Voucher.',
    rewardType: 'GIFT_CARD',
    currency: 'INR',
    amount: 10,
    bonusVes: 25,
    bonusGems: 10,
    assetType: 'crown',
    gradient: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)',
    accentColor: '#FF512F'
  },
  {
    dayOfWeek: 1,
    dayName: 'Monday',
    theme: 'Mystery Multiplier Monday',
    badge: '2X Multiplier',
    title: 'Power Multiplier Drop',
    subtitle: '+30 VEs Coins + 15 Gems',
    description: 'Start your week supercharged! Receive +30 VEs coins and 15 rare gems to power up your balance.',
    rewardType: 'VES',
    currency: 'VES',
    amount: 30,
    bonusVes: 0,
    bonusGems: 15,
    assetType: 'coin-stack',
    gradient: 'linear-gradient(135deg, #4E65FF 0%, #92EFFD 100%)',
    accentColor: '#4E65FF'
  },
  {
    dayOfWeek: 2,
    dayName: 'Tuesday',
    theme: 'Turbo Tuesday Surprise',
    badge: 'Mystery Spin',
    title: 'Lucky Mystery Crate',
    subtitle: '+25 VEs + 25 Rare Gems',
    description: 'Crack open the Tuesday mystery crate filled with 25 VEs and 25 sparkling gems!',
    rewardType: 'VES',
    currency: 'VES',
    amount: 25,
    bonusVes: 0,
    bonusGems: 25,
    assetType: 'gift-box',
    gradient: 'linear-gradient(135deg, #B92B27 0%, #1565C0 100%)',
    accentColor: '#1565C0'
  },
  {
    dayOfWeek: 3,
    dayName: 'Wednesday',
    theme: 'Wild Voucher Wednesday',
    badge: 'Amazon Voucher',
    title: 'Mid-Week Shopping Treat',
    subtitle: '₹5 Amazon Gift Voucher',
    description: 'Celebrate mid-week with an instant ₹5 Amazon shopping voucher added straight to your wallet.',
    rewardType: 'GIFT_CARD',
    currency: 'INR',
    amount: 5,
    bonusVes: 10,
    bonusGems: 0,
    assetType: 'amazon-card',
    gradient: 'linear-gradient(135deg, #FF8008 0%, #FFC837 100%)',
    accentColor: '#FF8008'
  },
  {
    dayOfWeek: 4,
    dayName: 'Thursday',
    theme: 'Thunder Gem Thursday',
    badge: 'Gem Vault',
    title: 'Rare Gem Vault Surge',
    subtitle: '+50 Rare Gems + 15 VEs',
    description: 'Massive gem refill day! Stock up with 50 rare gems to redeem premium rewards in the store.',
    rewardType: 'VES',
    currency: 'VES',
    amount: 15,
    bonusVes: 0,
    bonusGems: 50,
    assetType: 'coin-stack',
    gradient: 'linear-gradient(135deg, #11998E 0%, #38EF7D 100%)',
    accentColor: '#11998E'
  },
  {
    dayOfWeek: 5,
    dayName: 'Friday',
    theme: 'Flash Fortune Friday',
    badge: 'Fortune Box',
    title: 'Weekend Warmup Surprise',
    subtitle: '+40 VEs Coins + Fortune Box',
    description: 'Kickstart your weekend excitement with a fortune box loaded with 40 VEs and 20 gems!',
    rewardType: 'VES',
    currency: 'VES',
    amount: 40,
    bonusVes: 0,
    bonusGems: 20,
    assetType: 'gift-box',
    gradient: 'linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)',
    accentColor: '#E94057'
  },
  {
    dayOfWeek: 6,
    dayName: 'Saturday',
    theme: 'Super Saturday Jackpot',
    badge: 'Weekend Grand',
    title: 'Saturday Double Delight',
    subtitle: '₹5 Amazon Voucher + 35 VEs',
    description: 'A double reward Saturday! Enjoy both a ₹5 Amazon gift voucher and +35 bonus VEs.',
    rewardType: 'GIFT_CARD',
    currency: 'INR',
    amount: 5,
    bonusVes: 35,
    bonusGems: 0,
    assetType: 'crown',
    gradient: 'linear-gradient(135deg, #F37335 0%, #FDC830 100%)',
    accentColor: '#F37335'
  }
];

module.exports = {
  ROTATING_DROPS
};
