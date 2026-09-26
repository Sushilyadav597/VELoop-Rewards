import React from 'react';
import styles from '../styles/globals.module.css';

/**
 * ClaimModal (Step 9 Polish):
 * Displays the authoritative reward returned by the backend after successful claim.
 * Formats INR gift cards with ₹ (never $).
 * Never fabricates or alters rewards locally.
 */
export const ClaimModal = ({ isOpen, claimData, onClose }) => {
  if (!isOpen || !claimData) return null;

  // Extract authoritative backend payload
  const payload = claimData.data || claimData;
  const reward = payload.reward || payload.claimedReward;
  const wallet = payload.wallet;
  const transactionId = payload.transactionId || payload.transaction?.transactionId;

  const isGiftCard = reward?.currency === 'INR' || (reward?.rewardType && reward.rewardType.includes('GIFT_CARD'));

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 4, 15, 0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1.25rem'
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-modal-title"
    >
      <div
        className={styles.glassCard}
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '2.5rem 2.25rem',
          textAlign: 'center',
          border: '2px solid var(--reward-gold)',
          boxShadow: '0 0 45px rgba(245, 158, 11, 0.3)',
          animation: 'fadeInScale 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration Header Icon */}
        <div style={{ fontSize: '3.6rem', marginBottom: '0.8rem', filter: 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.5))' }}>
          {isGiftCard ? '🎁' : '🎉'}
        </div>

        <h2
          id="claim-modal-title"
          style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}
        >
          Check-In Verified!
        </h2>
        
        <p style={{ color: 'var(--success-color)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1.6rem' }}>
          {claimData.message || `Day ${reward?.day} streak successfully recorded!`}
        </p>

        {/* Backend Confirmed Reward Highlight */}
        <div
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '14px',
            padding: '1.4rem 1rem',
            marginBottom: '1.6rem'
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
            Day {reward?.day} Confirmed Reward
          </div>
          
          <div
            style={{
              fontSize: '2.4rem',
              fontWeight: 900,
              color: 'var(--reward-gold)',
              margin: '0.35rem 0',
              letterSpacing: '-0.02em'
            }}
          >
            {isGiftCard ? (
              <>₹{reward?.amount} <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Amazon Voucher</span></>
            ) : (
              <>+{reward?.amount} <span style={{ fontSize: '1.15rem', fontWeight: 700 }}>{reward?.currency || 'VEs'}</span></>
            )}
          </div>

          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {reward?.title}
          </div>
        </div>

        {/* Updated Authoritative Wallet Balances from Backend */}
        {wallet && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem',
              padding: '0.85rem',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '10px',
              marginBottom: '1.4rem',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block' }}>
                Updated VEs
              </span>
              <strong style={{ color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 800 }}>
                🪙 {wallet.vesBalance ?? 0}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block' }}>
                Amazon Vouchers
              </span>
              <strong style={{ color: 'var(--reward-gold)', fontSize: '1.15rem', fontWeight: 800 }}>
                🎟️ ₹{wallet.amazonVouchersTotal ?? 0}
              </strong>
            </div>
          </div>
        )}

        {/* Transaction Reference ID from Backend */}
        {transactionId && (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '1.6rem', fontFamily: 'monospace' }}>
            Reference TX: {transactionId}
          </div>
        )}

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className={styles.goldButton}
          style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
          autoFocus
        >
          Continue Streaking! ⚡
        </button>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.93);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ClaimModal;
