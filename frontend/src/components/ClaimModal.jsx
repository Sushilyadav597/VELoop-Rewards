import React from 'react';
import { Check, Sparkles, X } from 'lucide-react';
import GoldCoins from '../assets/GoldCoins';
import AmazonCard from '../assets/AmazonCard';
import RoyalCrown from '../assets/RoyalCrown';
import GiftBox from '../assets/GiftBox';

/**
 * ClaimModal:
 * Displays the authoritative reward returned by the backend after successful claim.
 * Formats INR gift cards with ₹ (never $).
 * Utilizes high-definition 3D assets to make the celebration feel ultra-premium.
 */
export const ClaimModal = ({ isOpen = true, claimData, onClose }) => {
  const visible = isOpen && Boolean(claimData);
  if (!visible) return null;

  // Extract authoritative backend payload
  const payload = claimData.data || claimData;
  const reward = payload.reward || payload.claimedReward;
  const wallet = payload.wallet;
  const transactionId = payload.transactionId || payload.transaction?.transactionId;

  const isGiftCard = reward?.currency === 'INR' || (reward?.rewardType && reward.rewardType.includes('GIFT_CARD'));
  const isUltimate = reward?.day === 7 || reward?.rewardType?.includes('ULTIMATE');

  const renderCelebrationAsset = () => {
    if (isUltimate) {
      return <RoyalCrown size={90} className="anim-float" />;
    }
    if (isGiftCard) {
      return reward?.amount >= 2 ? (
        <AmazonCard size={86} className="anim-float" />
      ) : (
        <GiftBox size={86} className="anim-float" />
      );
    }
    return <GoldCoins size={86} className="anim-float" />;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 3, 16, 0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '1.25rem'
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-modal-title"
    >
      <div
        className="card border-0 text-center p-4 position-relative overflow-hidden anim-shine"
        style={{
          maxWidth: '460px',
          width: '100%',
          backgroundColor: '#140c34',
          border: '1.5px solid rgba(245, 158, 11, 0.65)',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(245, 158, 11, 0.25)',
          animation: 'fadeInScale 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glow Orb */}
        <div
          className="position-absolute"
          style={{
            width: '240px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none'
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="btn btn-sm text-secondary position-absolute top-0 end-0 m-3 p-1 border-0"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* 3D Celebration Asset Illustration */}
        <div
          className="d-flex justify-content-center my-2 position-relative z-1"
          style={{ filter: 'drop-shadow(0 10px 20px rgba(245, 158, 11, 0.35))' }}
        >
          {renderCelebrationAsset()}
        </div>

        <h2
          id="claim-modal-title"
          className="fw-extrabold text-white mb-1"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.5rem, 3.5vw, 1.85rem)',
            letterSpacing: '-0.02em'
          }}
        >
          Check-In Verified!
        </h2>

        <p
          className="fw-bold mb-3"
          style={{ color: '#34D399', fontSize: '0.92rem' }}
        >
          {claimData.message || `Day ${reward?.day} streak successfully recorded!`}
        </p>

        {/* Confirmed Reward Highlight */}
        <div
          className="p-3 mb-3 position-relative z-1"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
            border: '1.2px solid rgba(245, 158, 11, 0.45)',
            borderRadius: '16px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div
            className="fw-bold text-uppercase mb-1"
            style={{ fontSize: '0.74rem', color: '#CBD5E1', letterSpacing: '0.8px' }}
          >
            Day {reward?.day} Confirmed Reward
          </div>

          <div
            className="fw-extrabold my-1"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              color: '#FBBF24',
              lineHeight: '1.1',
              textShadow: '0 0 16px rgba(245, 158, 11, 0.4)'
            }}
          >
            {isGiftCard ? (
              <>₹{reward?.amount} <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Amazon Voucher</span></>
            ) : (
              <>+{reward?.amount} <span style={{ fontSize: '1.15rem', fontWeight: 700 }}>{reward?.currency || 'VEs'}</span></>
            )}
          </div>

          <div style={{ fontSize: '0.86rem', color: '#94A3B8', fontWeight: 500 }}>
            {reward?.title}
          </div>
        </div>

        {/* Updated Authoritative Wallet Balances from Backend */}
        {wallet && (
          <div
            className="d-flex align-items-center justify-content-around p-2 mb-3 rounded-3"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(139, 92, 246, 0.25)'
            }}
          >
            <div>
              <span className="d-block text-secondary small" style={{ fontSize: '0.72rem' }}>
                Updated VEs
              </span>
              <strong className="text-white" style={{ fontSize: '1.1rem' }}>
                🪙 {wallet.vesBalance ?? 0}
              </strong>
            </div>

            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

            <div>
              <span className="d-block text-secondary small" style={{ fontSize: '0.72rem' }}>
                Amazon Vouchers
              </span>
              <strong className="text-warning" style={{ fontSize: '1.1rem' }}>
                🎟️ ₹{wallet.amazonVouchersTotal ?? 0}
              </strong>
            </div>
          </div>
        )}

        {/* Transaction Reference ID from Backend */}
        {transactionId && (
          <div
            className="small mb-3 text-muted font-monospace"
            style={{ fontSize: '0.72rem', letterSpacing: '0.3px' }}
          >
            Ref TX: {transactionId}
          </div>
        )}

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="btn w-100 py-2.5 fw-bold text-dark border-0 hover-lift anim-shine"
          style={{
            background: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
            borderRadius: '999px',
            fontSize: '1rem',
            boxShadow: '0 4px 18px rgba(245, 158, 11, 0.5)'
          }}
          autoFocus
        >
          Continue Streaking! ⚡
        </button>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.92);
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
