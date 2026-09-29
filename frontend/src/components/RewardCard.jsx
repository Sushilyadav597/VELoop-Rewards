import React from 'react';
import { Check, Lock, ChevronRight, Clock } from 'lucide-react';
import GoldCoins from '../assets/GoldCoins';
import GiftBox from '../assets/GiftBox';
import AmazonCard from '../assets/AmazonCard';
import RoyalCrown from '../assets/RoyalCrown';
import useCountdown from '../hooks/useCountdown';

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

  // Determine badge styling matching reference image (Page 62 & 63)
  const getBadgeConfig = () => {
    if (isClaimed) {
      return { type: 'claimed' };
    }
    if (badge === 'Today' || (isToday && isAvailable)) {
      return { text: 'Today', bg: '#F59E0B', color: '#0F0A2A', isPill: true };
    }
    if (badge === 'VIP' || day === 7) {
      return { text: 'VIP', bg: '#D97706', color: '#FFFFFF', isPill: true };
    }
    if (badge === 'Gift Card' || day === 4 || day === 5) {
      return { text: 'Gift Card', bg: '#8B5CF6', color: '#FFFFFF', isPill: true };
    }
    if (badge === 'Coin' || day === 6) {
      return { text: 'Coin', bg: '#3B82F6', color: '#FFFFFF', isPill: true };
    }
    return null;
  };

  const badgeConfig = getBadgeConfig();

  // Render 3D illustration based on assetType
  const renderAsset = () => {
    switch (assetType) {
      case 'gift-box':
        return <GiftBox size={50} className="anim-float" />;
      case 'amazon-card':
        return <AmazonCard size={48} />;
      case 'crown':
        return <RoyalCrown size={52} className="anim-float" />;
      case 'coin-stack':
      case 'coin':
      default:
        return (
          <GoldCoins
            size={50}
            className={isAvailable ? 'anim-float' : ''}
          />
        );
    }
  };

  // Value color styling based on state
  const getValueColor = () => {
    if (isClaimed) return '#10B981'; // Green
    if (isAvailable) return '#FBBF24'; // Bright Gold
    if (day === 7) return '#FBBF24'; // Day 7 VIP Gold
    if (currency === 'INR') return '#C4B5FD'; // Light Lavender
    return '#E2E8F0'; // Crisp White
  };

  return (
    <div
      className={`card h-100 border-0 text-center position-relative hover-lift ${
        isAvailable ? 'anim-glow-gold' : ''
      }`}
      style={{
        background: isAvailable
          ? 'linear-gradient(180deg, #251758 0%, #170e3c 100%)'
          : isClaimed
          ? 'linear-gradient(180deg, #111a2e 0%, #0d1222 100%)'
          : 'linear-gradient(180deg, #150e38 0%, #0d0824 100%)',
        borderRadius: '16px',
        border: isAvailable
          ? '2px solid #F59E0B'
          : isClaimed
          ? '1.2px solid rgba(16, 185, 129, 0.45)'
          : '1px solid rgba(139, 92, 246, 0.22)',
        boxShadow: isAvailable
          ? '0 0 28px rgba(245, 158, 11, 0.35), 0 8px 25px rgba(0, 0, 0, 0.5)'
          : '0 6px 18px rgba(0, 0, 0, 0.35)',
        transform: isAvailable ? 'scale(1.02)' : 'none',
        zIndex: isAvailable ? 2 : 1,
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Top Header of Card: Day label & Badge */}
      <div className="d-flex align-items-center justify-content-between p-2 pb-1">
        <span
          className="fw-bold"
          style={{
            fontSize: 'clamp(0.72rem, 1.8vw, 0.8rem)',
            color: isAvailable ? '#FBBF24' : isClaimed ? '#10B981' : '#94A3B8'
          }}
        >
          Day {day}
        </span>

        {/* Dynamic Badge */}
        {badgeConfig?.type === 'claimed' ? (
          <span
            className="d-inline-flex align-items-center justify-content-center text-white"
            style={{
              width: '18px',
              height: '18px',
              backgroundColor: '#10B981',
              borderRadius: '50%',
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)'
            }}
            title="Claimed"
          >
            <Check size={12} strokeWidth={3.5} />
          </span>
        ) : badgeConfig?.isPill ? (
          <span
            className="badge fw-bold"
            style={{
              backgroundColor: badgeConfig.bg,
              color: badgeConfig.color,
              fontSize: '0.62rem',
              borderRadius: '999px',
              padding: '2px 7px',
              lineHeight: '1.2',
              letterSpacing: '0.3px',
              boxShadow: `0 0 8px ${badgeConfig.bg}66`
            }}
          >
            {badgeConfig.text}
          </span>
        ) : null}
      </div>

      {/* Visual Artwork Center */}
      <div
        className="d-flex align-items-center justify-content-center py-1 position-relative"
        style={{ minHeight: '64px' }}
      >
        <div
          style={{
            opacity: isClaimed ? 0.75 : 1,
            filter: isAvailable
              ? 'drop-shadow(0 0 14px rgba(245, 158, 11, 0.45))'
              : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35))',
            transition: 'all 0.3s ease'
          }}
        >
          {renderAsset()}
        </div>
      </div>

      {/* Title & Amount Info */}
      <div className="px-1.5 py-1">
        <span
          className="d-block text-truncate"
          style={{
            color: '#8E8EA0',
            fontSize: 'clamp(0.64rem, 1.4vw, 0.7rem)',
            fontWeight: 500
          }}
        >
          {day === 7 ? 'Ultimate Reward' : title}
        </span>

        <div
          className="fw-extrabold my-0.5"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.05rem, 2.5vw, 1.28rem)',
            lineHeight: '1.2',
            color: getValueColor(),
            textShadow: isAvailable ? '0 0 12px rgba(251, 191, 36, 0.4)' : 'none'
          }}
        >
          {currency === 'INR' ? `₹${amount}` : `+${amount}`}
        </div>

        <span
          className="d-block text-truncate"
          style={{
            color: '#94A3B8',
            fontSize: 'clamp(0.64rem, 1.4vw, 0.72rem)',
            fontWeight: 500
          }}
        >
          {subtitle || `${amount} ${currency}`}
        </span>
      </div>

      {/* Bottom Action Button / Status Badge */}
      <div className="p-1.5 pt-2 mt-auto">
        {isClaimed ? (
          <div
            className="w-100 py-1 px-1.5 d-flex align-items-center justify-content-center gap-1 text-success fw-bold"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '999px',
              fontSize: '0.72rem',
              height: '30px'
            }}
          >
            <Check size={13} strokeWidth={3} />
            <span>Claimed</span>
          </div>
        ) : isAvailable ? (
          <button
            onClick={() => onClaim(day)}
            disabled={isClaiming}
            className="btn w-100 py-1 px-1.5 d-flex align-items-center justify-content-center gap-1 fw-bold text-dark border-0 anim-shine"
            style={{
              background: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
              borderRadius: '999px',
              fontSize: '0.78rem',
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.5)',
              height: '30px',
              cursor: isClaiming ? 'not-allowed' : 'pointer'
            }}
          >
            <span>{isClaiming ? 'Claiming...' : 'Claim Now'}</span>
            <ChevronRight size={14} strokeWidth={2.5} />
          </button>
        ) : isToday && !countdown.isExpired ? (
          <div
            className="w-100 py-1 px-1 d-flex align-items-center justify-content-center gap-1 text-warning fw-semibold"
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '999px',
              fontSize: '0.7rem',
              height: '30px'
            }}
            title="Next check-in unlocks in"
          >
            <Clock size={12} />
            <span>{countdown.formatted}</span>
          </div>
        ) : (
          <div
            className="w-100 py-1 px-1.5 d-flex align-items-center justify-content-center gap-1"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '999px',
              color: '#94A3B8',
              fontSize: '0.72rem',
              height: '30px'
            }}
          >
            <Lock size={12} />
            <span>Locked</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardCard;
