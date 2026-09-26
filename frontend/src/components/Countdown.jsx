import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/globals.module.css';

/**
 * Countdown Component (Step 9 Polish):
 * Visual presentation timer using serverTime offset and nextClaimAt.
 * When reaching zero, calls onCountdownZero to let the backend authoritatively decide claimability.
 * NEVER locally decides canClaim = true.
 */
export const Countdown = ({ serverTime, nextClaimAt, onCountdownZero, label = 'Next Check-in In' }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const firedZeroRef = useRef(false);

  useEffect(() => {
    if (!nextClaimAt) {
      setTimeLeft(null);
      return;
    }

    // Compute server clock skew: initial server time vs client epoch at receipt
    const initialServerEpoch = serverTime ? new Date(serverTime).getTime() : Date.now();
    const clientEpochAtSync = Date.now();
    const serverClientOffset = initialServerEpoch - clientEpochAtSync;

    const targetEpoch = new Date(nextClaimAt).getTime();
    firedZeroRef.current = false;

    const calculateRemaining = () => {
      // Current estimated authoritative server time
      const estimatedServerNow = Date.now() + serverClientOffset;
      const diff = targetEpoch - estimatedServerNow;

      if (diff <= 0) {
        setTimeLeft(0);
        if (!firedZeroRef.current) {
          firedZeroRef.current = true;
          // Re-fetch backend status to let backend decide if claim is active
          if (typeof onCountdownZero === 'function') {
            onCountdownZero();
          }
        }
      } else {
        setTimeLeft(diff);
      }
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);

    return () => clearInterval(interval);
  }, [serverTime, nextClaimAt, onCountdownZero]);

  if (timeLeft === null) {
    return null;
  }

  if (timeLeft <= 0) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--success-color)' }}>
        <span style={{ fontSize: '1rem' }}>⚡</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Ready to Check In</span>
      </div>
    );
  }

  const totalSeconds = Math.floor(timeLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
        ⏱️ {label}:
      </span>
      <div
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '1.05rem',
          fontWeight: 800,
          color: 'var(--reward-gold)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          padding: '0.3rem 0.75rem',
          borderRadius: '8px',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          letterSpacing: '0.05em',
          boxShadow: '0 0 10px rgba(245, 158, 11, 0.15)'
        }}
      >
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </div>
    </div>
  );
};

export default Countdown;
