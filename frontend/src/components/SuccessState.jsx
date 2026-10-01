import React from 'react';
import { CheckCircle2, Flame, Wallet, X } from 'lucide-react';
import styles from './SuccessState.module.css';

/**
 * SuccessState Component (Section 8 & Section 17):
 * Displays confirmation state:
 * - Success icon
 * - Reward received
 * - Updated balance
 * - Updated streak
 * - Confirmation message
 */
export const SuccessState = ({
  rewardReceived = '+30 VEs',
  updatedBalance,
  updatedStreak,
  message = 'Reward Claimed Successfully! Added to your wallet.',
  onDismiss
}) => {
  return (
    <div className={styles.successContainer} role="status" aria-live="polite">
      <div className={styles.innerFlex}>
        <div className={styles.leftSide}>
          <div className={styles.iconCircle}>
            <CheckCircle2 size={28} strokeWidth={2.5} />
          </div>

          <div>
            <h4 className={styles.heading}>Reward Claimed Successfully!</h4>
            <p className={styles.message}>
              {rewardReceived ? `${rewardReceived} added to your wallet.` : message}
            </p>
          </div>
        </div>

        <div className={styles.statPills}>
          {updatedStreak !== undefined && (
            <div className={`${styles.pill} ${styles.pillHighlight}`}>
              <Flame size={15} color="#F59E0B" fill="#F59E0B" />
              <span>{updatedStreak} Day Streak</span>
            </div>
          )}

          {updatedBalance !== undefined && (
            <div className={styles.pill}>
              <Wallet size={15} color="#A78BFA" />
              <span>{updatedBalance} VEs</span>
            </div>
          )}

          {onDismiss && (
            <button
              onClick={onDismiss}
              className={styles.dismissBtn}
              aria-label="Dismiss success message"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessState;
