import React from 'react';
import { Check, Lock, ChevronRight, Clock } from 'lucide-react';
import vesCoinImg from '../assets/images/VEs_Coin.png';
import day4GiftImg from '../assets/images/Day-4.png';
import day5CardImg from '../assets/images/Day-5.png';
import day7CrownImg from '../assets/images/Day-7.png';
import useCountdown from '../hooks/useCountdown';
import styles from './RewardCard.module.css';

export const RewardCard = ({
  reward,
  isClaiming,
  serverTime,
  onClaim,
  onCountdownExpire,
  isFeatured = false
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

  // Determine badge styling matching reference image (Page 62 & 63)
  // "Today" badge is strictly dynamic: ONLY the active & available day
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

  // Render Official 3D Asset matching task design
  const renderAsset = (sizeOverride = null) => {
    let imgSrc = vesCoinImg;
    let altText = 'Reward Coins';

    if (day === 4 || assetType === 'gift-box') {
      imgSrc = day4GiftImg;
      altText = 'Amazon Gift Card Box';
    } else if (day === 5 || assetType === 'amazon-card') {
      imgSrc = day5CardImg;
      altText = 'Amazon Gift Voucher';
    } else if (day === 7 || assetType === 'crown') {
      imgSrc = day7CrownImg;
      altText = 'VIP Crown Ultimate Reward';
    } else {
      imgSrc = vesCoinImg;
      altText = 'VEs Coins Stack';
    }

    return (
      <img
        src={imgSrc}
        alt={altText}
        className={`${styles.cardAssetImg} ${isAvailable ? 'anim-float' : ''}`}
        style={sizeOverride ? { maxHeight: `${sizeOverride}px` } : undefined}
        loading="lazy"
      />
    );
  };

  // Value color styling based on state
  const getValueColor = () => {
    if (isClaimed) return '#10B981'; // Green
    if (isAvailable) return '#FBBF24'; // Bright Gold
    if (day === 7) return '#FBBF24'; // Day 7 VIP Gold
    if (currency === 'INR') return '#C4B5FD'; // Light Lavender
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

  // Day 7 Full-Width Featured Layout for Mobile
  if (isFeatured && day === 7) {
    return (
      <div
        className={`${styles.cardFeaturedDay7} ${isAvailable ? styles.cardAvailable : ''}`}
      >
        <div className={styles.featuredLeft}>
          <div className={styles.featuredAssetWrapper}>
            {renderAsset(54)}
          </div>
          <div className={styles.featuredInfo}>
            <div className={styles.featuredHeaderRow}>
              <span className={styles.dayTitle} style={{ color: '#FBBF24', fontSize: '0.9rem' }}>
                Day 7
              </span>
              <span
                className={styles.badgePill}
                style={{ backgroundColor: '#D97706', color: '#FFFFFF' }}
              >
                VIP ULTIMATE
              </span>
            </div>
            <div
              className={styles.rewardAmount}
              style={{ color: '#FBBF24', fontSize: '1.4rem' }}
            >
              ₹{amount} Amazon Voucher
            </div>
            <span className={styles.rewardSubtitle} style={{ color: '#E2E8F0', fontSize: '0.78rem' }}>
              {subtitle || 'Guaranteed Amazon Gift Card'}
            </span>
          </div>
        </div>

        <div className={styles.featuredRight}>
          {renderActionButton()}
        </div>
      </div>
    );
  }

  // Standard Card Layout
  const cardStateClass = isAvailable
    ? styles.cardAvailable
    : isClaimed
    ? styles.cardClaimed
    : styles.cardLocked;

  return (
    <div className={`${styles.card} ${cardStateClass}`}>
      {/* Ambient background glow */}
      <div
        className={`${styles.ambientGlow} ${
          isAvailable ? styles.glowGold : isClaimed ? styles.glowGreen : styles.glowPurple
        }`}
      />

      {/* Top Header of Card: Day label & Badge */}
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

      {/* Visual Artwork Center */}
      <div className={styles.assetContainer}>
        <div
          style={{
            opacity: isClaimed ? 0.8 : 1,
            filter: isAvailable
              ? 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.5))'
              : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4))'
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
          {subtitle || `${amount} ${currency}`}
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
