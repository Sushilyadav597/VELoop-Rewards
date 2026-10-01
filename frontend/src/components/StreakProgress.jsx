import React from 'react';
import { Check, Lock, Flame, Crown, Gift, Sparkles } from 'lucide-react';
import styles from './StreakProgress.module.css';

/**
 * StreakProgress Component (Section 5):
 * Renders the visually attractive 7-day streak progression:
 * Day 1 → Day 2 → Day 3 → Day 4 → Day 5 → Day 6 → Day 7
 * Clearly displays: Day number, Reward preview, Icon, Completed/Current/Locked states.
 */
export const StreakProgress = ({ rewards = [], streak, onSelectDay }) => {
  const currentStreak = streak?.currentStreak ?? 0;
  const currentDay = streak?.currentDay ?? 1;
  const isEligibleToday = streak?.isEligibleToday ?? false;

  // Calculate overall streak progression percentage (1 to 7)
  const completedCount = rewards.filter((r) => r.status === 'CLAIMED').length;
  const progressPercent = Math.min(100, Math.max(0, (completedCount / 7) * 100));

  return (
    <section className={styles.progressSection} aria-label="7-Day Streak Progression">
      <div className={styles.cardContainer}>
        <div className={styles.ambientGlow} />

        <div className={styles.headerRow}>
          <div className={styles.titleArea}>
            <Flame size={20} color="#F59E0B" fill="#F59E0B" />
            <div>
              <h3 className={styles.title}>7-Day Streak Progression</h3>
              <p className={styles.subtitle}>Check in consecutively to reach the Day 7 Ultimate Reward</p>
            </div>
          </div>

          <div className={styles.badge}>
            <Sparkles size={14} color="#FBBF24" />
            <span>
              {completedCount} of 7 Days Completed ({Math.round(progressPercent)}%)
            </span>
          </div>
        </div>

        {/* Horizontal Visual Progression Track */}
        <div className={styles.stepperTrack}>
          {/* Background Track Line */}
          <div className={styles.connectingLineBackground}>
            <div
              className={styles.connectingLineProgress}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 7 Days Stepper Nodes */}
          {rewards.map((r) => {
            const isCompleted = r.status === 'CLAIMED';
            const isCurrent = r.isToday || r.day === currentDay;
            const isLocked = r.status === 'LOCKED' && !isCurrent;
            const isDay7 = r.day === 7;

            let stepClass = styles.stepItem;
            if (isCompleted) stepClass += ` ${styles.stepCompleted}`;
            else if (isCurrent) stepClass += ` ${styles.stepCurrent}`;
            else stepClass += ` ${styles.stepLocked}`;

            if (isDay7) stepClass += ` ${styles.stepUltimate}`;

            return (
              <div
                key={r.day}
                className={stepClass}
                onClick={() => onSelectDay && onSelectDay(r.day)}
                title={`Day ${r.day}: ${r.title} - ${r.currency === 'INR' ? '₹' : '+'}${r.amount} ${r.currency === 'INR' ? 'Amazon Card' : r.currency}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectDay && onSelectDay(r.day);
                  }
                }}
              >
                <div className={styles.stepCircle}>
                  {isCompleted ? (
                    <Check size={18} strokeWidth={3} />
                  ) : isDay7 ? (
                    <Crown size={19} color={isCurrent ? '#0B0720' : '#FBBF24'} fill={isCurrent ? '#0B0720' : '#FBBF24'} />
                  ) : isCurrent ? (
                    <Flame size={18} color="#FFFFFF" fill="#F59E0B" />
                  ) : isLocked ? (
                    <Lock size={15} color="#64748B" />
                  ) : (
                    <span>{r.day}</span>
                  )}
                </div>

                <div className={styles.dayLabel}>
                  {isDay7 ? 'Day 7 ★' : `Day ${r.day}`}
                </div>

                <div className={styles.rewardPreview}>
                  {r.currency === 'INR' ? `₹${r.amount}` : `+${r.amount}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StreakProgress;
