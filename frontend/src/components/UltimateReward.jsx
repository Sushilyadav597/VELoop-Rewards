import React from 'react';
import { Lock, Check, Sparkles, ChevronRight } from 'lucide-react';
import crownImg from '../assets/images/Top_right.png';
import styles from './UltimateReward.module.css';

/**
 * UltimateReward Component:
 * Features the Royal Crown on illuminated pedestal (Top_right.png),
 * large ₹5 amount, Amazon Gift Card pill, and status badge.
 */
export const UltimateReward = ({
  ultimateReward,
  currentStreak = 0,
  isEligibleToday = false,
  onClaim,
  isClaiming = false
}) => {
  const isClaimed = currentStreak >= 7;
  const rewardAmount = ultimateReward?.amount ?? 5;
  const rewardSubtitle = ultimateReward?.subtitle || 'Amazon Gift Card';

  return (
    <div className={`${styles.ultimateCard} anim-shine`}>
      {/* Radiant Golden & Purple Glow Orbs */}
      <div className={styles.glowGold} />
      <div className={styles.glowPurple} />

      <div className="card-body p-3 p-sm-3.5 p-md-4 position-relative z-1 d-flex flex-column justify-content-center h-100">
        <div className="d-flex align-items-center justify-content-between gap-2 gap-sm-3">
          {/* Left: 3D Royal Crown with Golden Aura */}
          <div className="d-flex align-items-center gap-2.5 gap-sm-3 flex-grow-1 min-w-0">
            <div
              className="anim-float flex-shrink-0"
              style={{
                filter: 'drop-shadow(0 0 24px rgba(245, 158, 11, 0.65)) drop-shadow(0 8px 20px rgba(0, 0, 0, 0.65))'
              }}
            >
              <img
                src={crownImg}
                alt="VIP Royal Crown Ultimate Reward"
                className={styles.crownImg}
                loading="lazy"
              />
            </div>

            {/* Center Info: Ultimate Reward, ₹5, Amazon Gift Card */}
            <div className="flex-grow-1 min-w-0">
              <div className="d-flex align-items-center gap-1.5 mb-0.5">
                <span className={styles.ultimateTag}>
                  Ultimate Reward
                </span>
                <Sparkles size={13} color="#FBBF24" />
              </div>

              <div className={styles.rewardAmount}>
                ₹{rewardAmount}
              </div>

              {/* Amazon Gift Card Brand Pill */}
              <div className={styles.amazonPill}>
                <span className={styles.amazonLogoBadge}>
                  <span className={styles.amazonLetterA}>a</span>
                </span>
                <span className={styles.amazonText}>
                  {rewardSubtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Status Indicator (Lock / Claimed / Claim Now) */}
          <div className="text-end flex-shrink-0 ps-1">
            {isClaimed ? (
              <div className={styles.statusClaimed}>
                <div className={styles.claimedCircle}>
                  <Check size={18} strokeWidth={3.5} />
                </div>
                <span className="fw-bold small text-success">Claimed</span>
              </div>
            ) : currentStreak === 7 && isEligibleToday ? (
              <button
                onClick={() => onClaim && onClaim(7)}
                disabled={isClaiming}
                className={styles.btnClaimDay7}
                title="Claim Ultimate Day 7 Reward"
              >
                <span>{isClaiming ? 'Claiming...' : 'Claim Now'}</span>
                <ChevronRight size={15} strokeWidth={2.8} />
              </button>
            ) : (
              <div className={styles.statusLocked}>
                <div className={styles.lockedCircle}>
                  <Lock size={17} color="#E9D5FF" />
                </div>
                <span className={styles.statusLockedText}>
                  Unlock on Day 7
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltimateReward;
