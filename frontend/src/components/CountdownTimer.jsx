import React, { useState, useEffect, useRef } from 'react';
import { Clock, Zap } from 'lucide-react';
import styles from './CountdownTimer.module.css';

/**
 * CountdownTimer Component (Section 9):
 * Visual presentation timer calculated from authoritative backend timestamps.
 * When countdown reaches zero, DO NOT automatically assume the reward is claimable.
 * Refetches the backend status and updates the UI. Backend remains source of truth.
 */
export const CountdownTimer = ({
  serverTime,
  nextClaimAt,
  onCountdownExpire,
  label = 'Next reward in',
  className = ''
}) => {
  const [remainingMs, setRemainingMs] = useState(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!nextClaimAt) {
      setRemainingMs(null);
      return;
    }

    // Offset between server timestamp and client clock
    const initialServerEpoch = serverTime ? new Date(serverTime).getTime() : Date.now();
    const clientEpoch = Date.now();
    const serverSkew = initialServerEpoch - clientEpoch;
    const targetEpoch = new Date(nextClaimAt).getTime();

    hasTriggeredRef.current = false;

    const tick = () => {
      const estimatedServerNow = Date.now() + serverSkew;
      const diff = targetEpoch - estimatedServerNow;

      if (diff <= 0) {
        setRemainingMs(0);
        if (!hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          // Refetch backend status so backend authoritatively validates claimability
          if (typeof onCountdownExpire === 'function') {
            onCountdownExpire();
          }
        }
      } else {
        setRemainingMs(diff);
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [serverTime, nextClaimAt, onCountdownExpire]);

  if (remainingMs === null) {
    return null;
  }

  if (remainingMs <= 0) {
    return (
      <div className={`${styles.timerContainer} ${className}`} aria-live="polite">
        <div className={styles.readyBadge}>
          <Zap size={14} color="#34D399" fill="#34D399" />
          <span>Reward Ready to Claim!</span>
        </div>
      </div>
    );
  }

  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className={`${styles.timerContainer} ${className}`} aria-live="polite">
      <div className={styles.label}>
        <Clock size={13} color="#F59E0B" />
        <span>{label}</span>
      </div>

      <div className={styles.digits}>
        <span className={styles.digitUnit}>{pad(hours)}</span>
        <span className={styles.colon}>:</span>
        <span className={styles.digitUnit}>{pad(minutes)}</span>
        <span className={styles.colon}>:</span>
        <span className={styles.digitUnit}>{pad(seconds)}</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
