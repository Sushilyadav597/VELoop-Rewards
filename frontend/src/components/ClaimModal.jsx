import React from 'react';
import { CheckCircle2, X, Sparkles, ArrowRight, Wallet } from 'lucide-react';
import GoldCoins from '../assets/GoldCoins';
import RoyalCrown from '../assets/RoyalCrown';
import GiftBox from '../assets/GiftBox';
import AmazonCard from '../assets/AmazonCard';

export const ClaimModal = ({ claimData, onClose }) => {
  if (!claimData) return null;

  const reward = claimData.claimedReward || {};
  const wallet = claimData.wallet || {};

  const renderRewardAsset = () => {
    if (reward.rewardType === 'ULTIMATE_GIFT_CARD' || reward.day === 7) {
      return <RoyalCrown size={70} className="anim-float" />;
    }
    if (reward.rewardType === 'GIFT_CARD') {
      return reward.day === 4 ? <GiftBox size={65} className="anim-float" /> : <AmazonCard size={65} />;
    }
    return <GoldCoins size={65} />;
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{
        backgroundColor: 'rgba(5, 3, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1060
      }}
    >
      <div
        className="card border-0 text-center p-4 position-relative overflow-hidden anim-glow-gold"
        style={{
          maxWidth: '420px',
          width: '100%',
          backgroundColor: '#150f38',
          border: '1.5px solid #F59E0B',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
        }}
      >
        <button
          onClick={onClose}
          className="btn btn-sm text-secondary position-absolute top-0 end-0 m-3 p-1 border-0"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Success Icon */}
        <div className="d-flex justify-content-center mb-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid #10B981'
            }}
          >
            <CheckCircle2 size={32} className="text-success" />
          </div>
        </div>

        <h4 className="fw-bold text-white mb-1">
          Reward Claimed!
        </h4>
        <p className="text-secondary small mb-3">
          Your Day {reward.day} reward has been verified and added to your wallet.
        </p>

        {/* Reward Asset Preview */}
        <div className="my-2 d-flex justify-content-center">
          {renderRewardAsset()}
        </div>

        {/* Claimed Amount Banner */}
        <div
          className="py-2 px-3 my-2 d-inline-block mx-auto"
          style={{
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.25) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '14px'
          }}
        >
          <span className="fs-3 fw-bolder text-warning">
            {reward.currency === 'INR' ? `₹${reward.amount}` : `+${reward.amount}`}
          </span>
          <span className="ms-2 text-white fw-bold">
            {reward.currency === 'INR' ? 'Amazon Gift Card' : 'VEs'}
          </span>
        </div>

        {/* Wallet Balance Summary Card */}
        <div
          className="p-3 my-3 text-start"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '14px'
          }}
        >
          <div className="d-flex align-items-center gap-2 mb-2 text-muted small">
            <Wallet size={15} />
            <span>Updated Wallet Balance</span>
          </div>
          <div className="d-flex justify-content-between text-white small">
            <span>VEs Balance:</span>
            <span className="fw-bold text-warning">{wallet.vesBalance ?? '---'} VEs</span>
          </div>
          {wallet.amazonVouchersTotal > 0 && (
            <div className="d-flex justify-content-between text-white small mt-1">
              <span>Amazon Vouchers:</span>
              <span className="fw-bold text-success">₹{wallet.amazonVouchersTotal}</span>
            </div>
          )}
          <div className="text-muted mt-2 pt-2 border-top border-secondary border-opacity-25" style={{ fontSize: '0.7rem' }}>
            Ref: {claimData.transaction?.referenceId || 'STREAK-CONFIRMED'}
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn w-100 py-2 fw-bold text-dark border-0 mt-2"
          style={{
            background: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
            borderRadius: '12px'
          }}
        >
          Awesome, Continue!
        </button>
      </div>
    </div>
  );
};

export default ClaimModal;
