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

  // Countdown timer for locked cooling down cards
  const countdown = useCountdown(
    status === 'LOCKED' && isToday ? nextClaimAt : null,
    serverTime,
    onCountdownExpire
  );

  const isClaimed = status === 'CLAIMED';
  const isAvailable = status === 'AVAILABLE';
  const isLocked = status === 'LOCKED';

  // Render the appropriate 3D illustration based on backend assetType
  const renderAsset = () => {
    switch (assetType) {
      case 'gift-box':
        return <GiftBox size={58} className="anim-float" />;
      case 'amazon-card':
        return <AmazonCard size={58} />;
      case 'crown':
        return <RoyalCrown size={60} className="anim-float" />;
      case 'coin-stack':
      case 'coin':
      default:
        return <GoldCoins size={58} />;
    }
  };

  return (
    <div
      className={`card h-100 border-0 text-center position-relative transition-all ${
        isAvailable ? 'anim-glow-gold' : ''
      }`}
      style={{
        background: isAvailable
          ? 'linear-gradient(180deg, #22164f 0%, #150d36 100%)'
          : isClaimed
          ? 'linear-gradient(180deg, #111a2d 0%, #0d1222 100%)'
          : 'linear-gradient(180deg, #150f38 0%, #0e0925 100%)',
        borderRadius: '16px',
        border: isAvailable
          ? '1.8px solid #F59E0B'
          : isClaimed
          ? '1px solid rgba(16, 185, 129, 0.4)'
          : '1px solid rgba(139, 92, 246, 0.22)',
        boxShadow: isAvailable
          ? '0 8px 25px rgba(245, 158, 11, 0.25)'
          : '0 4px 14px rgba(0, 0, 0, 0.3)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        opacity: isLocked && !isToday ? 0.75 : 1
      }}
    >
      {/* Top Header Row of Card: Day label & Badge */}
      <div className="d-flex align-items-center justify-content-between p-2 pb-0">
        <span
          className="fw-bold small"
          style={{
            fontSize: '0.8rem',
            color: isAvailable ? '#FBBF24' : isClaimed ? '#10B981' : '#94A3B8'
          }}
        >
          Day {day}
        </span>

        {/* Dynamic Badge */}
        {isClaimed ? (
          <span
            className="d-inline-flex align-items-center justify-content-center text-white"
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#10B981',
              borderRadius: '50%'
            }}
            title="Claimed"
          >
            <Check size={13} strokeWidth={3} />
          </span>
        ) : badge ? (
          <span
            className="badge fw-semibold"
            style={{
              backgroundColor:
                badge === 'Today'
                  ? '#F59E0B'
                  : badge === 'VIP'
                  ? '#D97706'
                  : 'rgba(139, 92, 246, 0.45)',
              color: badge === 'Today' || badge === 'VIP' ? '#18181B' : '#FFFFFF',
              fontSize: '0.68rem',
              borderRadius: '999px',
              padding: '3px 8px'
            }}
          >
            {badge}
          </span>
        ) : null}
      </div>

      {/* Visual Artwork */}
      <div className="d-flex align-items-center justify-content-center py-2" style={{ minHeight: '68px' }}>
        {renderAsset()}
      </div>

      {/* Title & Subtitle */}
      <div className="px-2">
        <span className="d-block text-muted" style={{ fontSize: '0.72rem' }}>
          {title}
        </span>
        <div
          className="fw-extrabold my-1"
          style={{
            fontSize: '1.25rem',
            color: isClaimed ? '#10B981' : isAvailable ? '#FBBF24' : '#FFFFFF'
          }}
        >
          {currency === 'INR' ? `₹${amount}` : `+${amount}`}
        </div>
        <span className="d-block text-secondary text-truncate small" style={{ fontSize: '0.74rem' }}>
          {subtitle || `${amount} ${currency}`}
        </span>
      </div>

      {/* Bottom Action / Status Button */}
      <div className="p-2 pt-3 mt-auto">
        {isClaimed ? (
          <div
            className="w-100 py-1 px-2 d-flex align-items-center justify-content-center gap-1 text-white fw-semibold small"
            style={{
              backgroundColor: '#10B981',
              borderRadius: '999px',
              fontSize: '0.8rem',
              height: '34px'
            }}
          >
            <Check size={14} strokeWidth={3} />
            <span>Claimed</span>
          </div>
        ) : isAvailable ? (
          <button
            onClick={() => onClaim(day)}
            disabled={isClaiming}
            className="btn w-100 py-1 px-2 d-flex align-items-center justify-content-center gap-1 fw-bold text-dark border-0 transition-all"
            style={{
              background: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
              borderRadius: '999px',
              fontSize: '0.82rem',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
              height: '34px'
            }}
          >
            <span>{isClaiming ? 'Processing...' : 'Claim Reward'}</span>
            <ChevronRight size={15} />
          </button>
        ) : isToday && !countdown.isExpired ? (
          /* Live 24h countdown calculated against server timestamp */
          <div
            className="w-100 py-1 px-1 d-flex align-items-center justify-content-center gap-1 text-warning fw-semibold small"
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '999px',
              fontSize: '0.75rem',
              height: '34px'
            }}
            title="Next check-in unlocks in"
          >
            <Clock size={13} />
            <span>{countdown.formatted}</span>
          </div>
        ) : (
          <div
            className="w-100 py-1 px-2 d-flex align-items-center justify-content-center gap-1 text-muted small"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '999px',
              fontSize: '0.78rem',
              height: '34px'
            }}
          >
            <Lock size={13} />
            <span>Locked</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardCard;
