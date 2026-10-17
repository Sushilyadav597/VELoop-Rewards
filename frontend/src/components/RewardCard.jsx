import React from 'react';
import { Check, Lock, ChevronRight, Clock } from 'lucide-react';
import vesCoinImg from '../assets/images/VEs_Coin.png';
import day4GiftBoxImg from '../assets/images/Day-4.png';
import amazonCardImg from '../assets/images/Day-5.png';
import day7CrownImg from '../assets/images/Day-7.png';
import crownPedestalImg from '../assets/images/Top_right.png';
import useCountdown from '../hooks/useCountdown';
import styles from './RewardCard.module.css';

/**
 * RewardCard Component:
 * Renders individual Daily Streak cards for Days 1 to 7 using official assets:
 * - Days 1, 2, 3, 6: VEs_Coin.png (3D Gold coins stack)
 * - Day 4: Day-4.png (3D Open Purple Gift Box with Amazon card, gold coins, and confetti - high visual impact!)
 * - Day 5: Day-5.png (3D Amazon Gift Card)
 * - Day 7: Day-7.png (VIP Royal Crown on pedestal with 'Ultimate Reward' plate & Amazon card)
 */
export const RewardCard = ({
  reward,
  isClaiming,
  serverTime,
  onClaim,
  onCountdownExpire
}) => {
  const {
    day,
    status,
    badge,
    title = 'Daily Reward',
    subtitle,
    amount,
    currency,
    assetType,
    isToday,
    nextClaimAt
  } = reward;

  // Countdown timer for cooling down cards
  const countdown = useCountdown(
    status === 'LOCKED' && isToday ? nextClaimAt : null,
    serverTime,
    onCountdownExpire
  );

  const isClaimed = status === 'CLAIMED';
  const isAvailable = status === 'AVAILABLE';
  const isLocked = status === 'LOCKED';

  // Determine badge styling matching reference design
  const getBadgeConfig = () => {
    if (isClaimed) {
      return { type: 'claimed' };
    }
    if (isToday && isAvailable) {
      return { text: 'Today', bg: '#F59E0B', color: '#0F0A2A', isPill: true };
    }
    if (day === 7 || badge === 'VIP') {
      return { text: 'VIP', bg: '#D97706', color: '#FFFFFF', isPill: true };
    }
    if (day === 4 || day === 5 || badge === 'Gift Card') {
      return { text: 'Gift Card', bg: '#8B5CF6', color: '#FFFFFF', isPill: true };
    }
    if (day === 6 || badge === 'Coin') {
      return { text: 'Coin', bg: '#3B82F6', color: '#FFFFFF', isPill: true };
    }
    return null;
  };

  const badgeConfig = getBadgeConfig();

  // Render Official 3D Asset matching task design specifications
  const renderAsset = () => {
    let imgSrc = vesCoinImg;
    let altText = 'Reward Coins';
    let assetClass = styles.assetCoins;

    if (day === 4 || assetType === 'gift-box') {
      imgSrc = day4GiftBoxImg;
      altText = 'Day 4 Surprise Gift Box with Amazon Voucher';
      assetClass = styles.assetGiftBox;
    } else if (day === 5 || assetType === 'amazon-card') {
      imgSrc = amazonCardImg;
      altText = 'Amazon Gift Card';
      assetClass = styles.assetAmazonCard;
    } else if (day === 7 || assetType === 'crown') {
      imgSrc = day7CrownImg;
      altText = 'VIP Crown Ultimate Reward';
      assetClass = styles.assetCrown;
    }

    return (
      <img
        src={imgSrc}
        alt={altText}
        className={`${styles.cardAssetImg} ${assetClass} ${isAvailable ? 'anim-float' : ''}`}
        loading="lazy"
      />
    );
  };

  // Value color styling based on state
  const getValueColor = () => {
    if (isClaimed) return '#10B981'; // Green
    if (isAvailable) return '#FBBF24'; // Bright Gold
    if (day === 7) return '#FBBF24'; // Day 7 VIP Gold
    if (currency === 'INR') return '#C4B5FD'; // Lavender
    return '#FFFFFF'; // Crisp White
  };

  // Render Action Button
  const renderActionButton = () => {
    if (isClaimed) {
      return (
        <div className={styles.btnClaimed}>
          <Check size={14} strokeWidth={3} />
          <span>Claimed</span>
        </div>
      );
    }
    if (isAvailable) {
      return (
        <button
          onClick={() => onClaim(day)}
          disabled={isClaiming}
          className={`${styles.btnClaim} anim-shine`}
          title={`Claim Day ${day} reward`}
        >
          <span>{isClaiming ? 'Claiming...' : 'Claim Now'}</span>
          <ChevronRight size={15} strokeWidth={2.8} />
        </button>
      );
    }
    if (isToday && !countdown.isExpired) {
      return (
        <div className={styles.btnCountdown} title="Next check-in unlocks in">
          <Clock size={13} />
          <span>{countdown.formatted}</span>
        </div>
      );
    }
    return (
      <div className={styles.btnLocked}>
        <Lock size={13} />
        <span>Locked</span>
      </div>
    );
  };

  // Card State Styling
  const cardStateClass = isAvailable
    ? styles.cardAvailable
    : isClaimed
    ? styles.cardClaimed
    : day === 7
    ? styles.cardDay7
    : styles.cardLocked;

  return (
    <div className={`${styles.card} ${cardStateClass}`}>
      {/* Ambient background glow inside card */}
      <div
        className={`${styles.ambientGlow} ${
          isAvailable ? styles.glowGold : isClaimed ? styles.glowGreen : styles.glowPurple
        }`}
      />

      {/* Top Header of Card: Day label & Dynamic Badge */}
      <div className={styles.cardHeader}>
        <span
          className={styles.dayTitle}
          style={{
            color: isAvailable ? '#FBBF24' : isClaimed ? '#10B981' : '#CBD5E1'
          }}
        >
          Day {day}
        </span>

        {/* Dynamic Badge */}
        {badgeConfig?.type === 'claimed' ? (
          <span className={styles.claimedCheckBadge} title="Claimed">
            <Check size={12} strokeWidth={3.5} />
          </span>
        ) : badgeConfig?.isPill ? (
          <span
            className={styles.badgePill}
            style={{
              backgroundColor: badgeConfig.bg,
              color: badgeConfig.color
            }}
          >
            {badgeConfig.text}
          </span>
        ) : null}
      </div>

      {/* Visual Artwork Center (Enlarged and visually prominent) */}
      <div className={styles.assetContainer}>
        <div
          style={{
            opacity: isClaimed ? 0.8 : 1,
            transition: 'transform 0.3s ease'
          }}
        >
          {renderAsset()}
        </div>
      </div>

      {/* Title & Amount Info */}
      <div className={styles.infoSection}>
        <span className={styles.rewardTitle}>
          {day === 7 ? 'Ultimate Reward' : title}
        </span>

        <div
          className={styles.rewardAmount}
          style={{
            color: getValueColor(),
            textShadow: isAvailable ? '0 0 14px rgba(251, 191, 36, 0.45)' : 'none'
          }}
        >
          {currency === 'INR' ? `₹${amount}` : `+${amount}`}
        </div>

        <span className={styles.rewardSubtitle}>
          {subtitle || (currency === 'INR' ? 'Amazon Gift Card' : `${amount} ${currency}`)}
        </span>
      </div>

      {/* Bottom Action Button */}
      <div className={styles.actionSection}>
        {renderActionButton()}
      </div>
    </div>
  );
};

export default RewardCard;
