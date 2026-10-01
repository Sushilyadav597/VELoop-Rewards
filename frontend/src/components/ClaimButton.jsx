import React from 'react';
import { Sparkles, Check, Clock, Lock, ChevronRight } from 'lucide-react';
import styles from './ClaimButton.module.css';

/**
 * ClaimButton Component (Section 4 & Section 8):
 * Interactive primary CTA with distinct states:
 * - Available: "Claim Today's Reward" / "Claim Reward" (Dominant CTA)
 * - Loading: Branded spinner with "Claiming Reward..."
 * - Claimed: Success badge "Claimed Today"
 * - Cooldown: Countdown indicator "Next Reward in HH:MM:SS"
 * - Locked: "Locked"
 */
export const ClaimButton = ({
  status = 'AVAILABLE', // 'AVAILABLE' | 'LOADING' | 'CLAIMED' | 'COOLDOWN' | 'LOCKED'
  rewardText = '',
  cooldownText = '',
  onClick,
  disabled = false,
  size = 'lg', // 'sm' | 'md' | 'lg'
  fullWidth = false,
  className = '',
  ariaLabel
}) => {
  const isAvailable = status === 'AVAILABLE';
  const isLoading = status === 'LOADING';
  const isClaimed = status === 'CLAIMED';
  const isCooldown = status === 'COOLDOWN';
  const isLocked = status === 'LOCKED';

  let stateClass = styles.stateAvailable;
  if (isLoading) stateClass = styles.stateLoading;
  else if (isClaimed) stateClass = styles.stateClaimed;
  else if (isCooldown) stateClass = styles.stateCooldown;
  else if (isLocked) stateClass = styles.stateLocked;

  let sizeClass = styles.sizeLg;
  if (size === 'md') sizeClass = styles.sizeMd;
  else if (size === 'sm') sizeClass = styles.sizeSm;

  const handleClick = (e) => {
    if (!isAvailable || isLoading || disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };

  return (
    <button
      type="button"
      className={`${styles.claimBtn} ${stateClass} ${sizeClass} ${fullWidth ? styles.fullWidth : ''} ${className} anim-shine`}
      onClick={handleClick}
      disabled={disabled || isLoading || isLocked}
      aria-label={ariaLabel || (isAvailable ? `Claim Today's Reward ${rewardText}` : status)}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <div className={styles.spinner} />
          <span>Claiming Reward...</span>
        </>
      ) : isClaimed ? (
        <>
          <Check size={size === 'lg' ? 20 : 16} strokeWidth={3} />
          <span>Reward Claimed Today</span>
        </>
      ) : isCooldown ? (
        <>
          <Clock size={size === 'lg' ? 18 : 14} />
          <span>{cooldownText ? `Next Reward in ${cooldownText}` : 'Reward Cooldown Active'}</span>
        </>
      ) : isLocked ? (
        <>
          <Lock size={size === 'lg' ? 18 : 14} />
          <span>Reward Locked</span>
        </>
      ) : (
        <>
          <Sparkles size={size === 'lg' ? 20 : 16} color="#0B0720" fill="#0B0720" />
          <span>{rewardText ? `Claim Today's Reward (${rewardText})` : `Claim Today's Reward`}</span>
          <ChevronRight size={size === 'lg' ? 20 : 16} strokeWidth={3} />
        </>
      )}
    </button>
  );
};

export default ClaimButton;
