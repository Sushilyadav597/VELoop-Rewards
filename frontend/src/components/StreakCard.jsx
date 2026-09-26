import React from 'react';
import styles from '../styles/globals.module.css';

/**
 * StreakCard Component (Step 9 Polish):
 * Pure presentation component that renders a single day's reward card from backend response.
 * Strictly adheres to PDF requirement: INR gift cards display ₹ (never $).
 * Visually distinguishes Claimed, Available, Current/Today, and Locked states.
 */
export const StreakCard = ({ reward }) => {
  if (!reward) return null;

  const {
    day,
    status = 'LOCKED',
    badge,
    title,
    subtitle,
    amount,
    currency,
    rewardType,
    assetType,
    isToday
  } = reward;

  const isClaimed = status === 'CLAIMED';
  const isAvailable = status === 'AVAILABLE';
  const isLocked = status === 'LOCKED';
  const isGiftCard = currency === 'INR' || (rewardType && rewardType.includes('GIFT_CARD'));
  const isUltimate = day === 7 || assetType === 'crown' || (rewardType && rewardType.includes('ULTIMATE'));

  // Asset icon mapping based on backend assetType
  const getAssetIcon = () => {
    if (isUltimate) return '👑';
    if (assetType === 'amazon-card' || assetType === 'gift-box' || isGiftCard) return '🎁';
    if (assetType === 'coin-stack') return '💰';
    if (assetType === 'GEMS') return '💎';
    return '🪙';
  };

  // Format display amount & currency (PDF Requirement: INR displays ₹, never $)
  const renderAmount = () => {
    if (isGiftCard) {
      return (
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isClaimed ? 'var(--text-muted)' : 'var(--reward-gold)', letterSpacing: '-0.01em' }}>
          ₹{amount}
          <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
            Amazon Voucher
          </span>
        </div>
      );
    }

    return (
      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isClaimed ? 'var(--text-muted)' : isAvailable ? 'var(--reward-gold)' : 'var(--text-primary)', letterSpacing: '-0.01em' }}>
        +{amount} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{currency || 'VEs'}</span>
        <span style={{ fontSize: '0.78rem', fontWeight: 500, display: 'block', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
          {subtitle || title || 'Streak Reward'}
        </span>
      </div>
    );
  };

  // Status Badge Component
  const renderStatusBadge = () => {
    if (isClaimed) {
      return <span className={styles.badgeGreen}>✓ CLAIMED</span>;
    }
    if (isAvailable) {
      return <span className={styles.badgePurple} style={{ border: '1px solid var(--primary-accent)' }}>⚡ READY</span>;
    }
    if (isToday) {
      return <span className={styles.badgeGold}>TODAY</span>;
    }
    return <span className={styles.badgeMuted}>🔒 LOCKED</span>;
  };

  // Card border and container state
  const getCardStyle = () => {
    if (isAvailable) {
      return {
        border: '2px solid var(--primary-accent)',
        boxShadow: '0 0 20px rgba(139, 92, 246, 0.35)',
        transform: 'translateY(-3px)',
        backgroundColor: 'rgba(30, 22, 68, 0.85)'
      };
    }
    if (isClaimed) {
      return {
        border: '1px solid rgba(16, 185, 129, 0.35)',
        backgroundColor: 'rgba(16, 185, 129, 0.04)',
        opacity: 0.85
      };
    }
    if (isToday) {
      return {
        border: '2px solid rgba(245, 158, 11, 0.55)',
        boxShadow: '0 0 16px rgba(245, 158, 11, 0.2)',
        backgroundColor: 'rgba(245, 158, 11, 0.04)'
      };
    }
    return {
      border: '1px solid var(--border-subtle)',
      opacity: 0.65
    };
  };

  return (
    <div
      className={styles.glassCard}
      style={{
        padding: '1.25rem 0.85rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        minHeight: '215px',
        justifyContent: 'space-between',
        borderRadius: '14px',
        ...getCardStyle()
      }}
      aria-label={`Day ${day}: ${isGiftCard ? `₹${amount} Amazon Voucher` : `+${amount} ${currency}`}, Status: ${status}`}
    >
      {/* Top Header: Day & Status */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            color: isToday ? 'var(--reward-gold)' : isAvailable ? 'var(--accent-glow)' : 'var(--text-secondary)'
          }}
        >
          DAY {day}
        </span>
        {renderStatusBadge()}
      </div>

      {/* Asset Icon */}
      <div style={{ margin: '0.6rem 0' }}>
        <div
          style={{
            fontSize: '2.5rem',
            lineHeight: 1,
            filter: isLocked
              ? 'grayscale(0.85) opacity(0.6)'
              : isUltimate
              ? 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.6))'
              : 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.3))'
          }}
        >
          {getAssetIcon()}
        </div>
      </div>

      {/* Reward Amount & Subtitle */}
      <div style={{ width: '100%' }}>
        {renderAmount()}
      </div>

      {/* Special Badge (e.g. Gift Card, VIP, Ultimate) */}
      {(badge || isUltimate) && (
        <div
          style={{
            marginTop: '0.4rem',
            fontSize: '0.68rem',
            fontWeight: 700,
            color: isUltimate ? 'var(--reward-gold)' : 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {isUltimate ? '★ ULTIMATE REWARD ★' : badge}
        </div>
      )}
    </div>
  );
};

export default StreakCard;
