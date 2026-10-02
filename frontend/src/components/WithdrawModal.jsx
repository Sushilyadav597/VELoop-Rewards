import React, { useState } from 'react';
import { X, Gift, CreditCard, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { withdrawFunds } from '../services/platformApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const WithdrawModal = ({ isOpen, onClose, onSuccess }) => {
  const { wallet, refreshWallet } = useAuth();
  const toast = useToast();

  const [method, setMethod] = useState('AMAZON_VOUCHER');
  const [amount, setAmount] = useState('50');
  const [targetAccount, setTargetAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const currentVes = wallet?.vesBalance || 0;
  const currentINR = wallet?.amazonVouchersTotal || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const numAmount = Number(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (method === 'AMAZON_VOUCHER') {
      if (numAmount > currentVes) {
        setError(`Insufficient VEs balance (You have ${currentVes} VEs)`);
        return;
      }
    } else {
      if (numAmount > currentINR) {
        setError(`Insufficient INR voucher balance (You have ₹${currentINR})`);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await withdrawFunds({
        amount: numAmount,
        currency: method === 'AMAZON_VOUCHER' ? 'VES' : 'INR',
        method,
        accountDetails: targetAccount || 'Instant Digital Delivery'
      });

      if (res && res.success) {
        toast.success(res.message || 'Redemption successful!');
        await refreshWallet();
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Redemption failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 3, 18, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="card-lift"
        style={{
          background: 'linear-gradient(145deg, #181139 0%, #0D0824 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '24px',
          padding: '2rem',
          maxWidth: '460px',
          width: '100%',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(245, 158, 11, 0.2)',
          animation: 'toastSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94A3B8',
            cursor: 'pointer'
          }}
          aria-label="Close redemption modal"
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1.5px solid rgba(245, 158, 11, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              color: '#F59E0B'
            }}
          >
            <Gift size={26} />
          </div>

          <div style={{ fontSize: '0.78rem', color: '#FBBF24', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>
            REDEEM REWARDS
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', margin: '0.2rem 0 0', letterSpacing: '-0.02em' }}>
            Withdraw / Convert Points
          </h3>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#FCA5A5', fontSize: '0.84rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Method selector */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px', display: 'block' }}>
              Redemption Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div
                onClick={() => { setMethod('AMAZON_VOUCHER'); setAmount('50'); }}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: method === 'AMAZON_VOUCHER' ? '1.5px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: method === 'AMAZON_VOUCHER' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.3rem', marginBottom: '2px' }}>🎟️</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>Amazon Voucher</div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>From VEs Coins</div>
              </div>

              <div
                onClick={() => { setMethod('UPI_TRANSFER'); setAmount('10'); }}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: method === 'UPI_TRANSFER' ? '1.5px solid #10B981' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: method === 'UPI_TRANSFER' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.3rem', marginBottom: '2px' }}>⚡</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>UPI / INR Cash</div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>From ₹ Vouchers</div>
              </div>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1' }}>Amount</label>
              <span style={{ fontSize: '0.76rem', color: '#FBBF24' }}>
                Available: {method === 'AMAZON_VOUCHER' ? `${currentVes} VEs` : `₹${currentINR}`}
              </span>
            </div>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(10, 6, 26, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '1.1rem',
                fontWeight: 700
              }}
              required
            />
          </div>

          {/* Delivery destination (email or UPI ID) */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px', display: 'block' }}>
              {method === 'AMAZON_VOUCHER' ? 'Voucher Delivery Email' : 'UPI ID (e.g. yourname@okhdfcbank)'}
            </label>
            <input
              type="text"
              placeholder={method === 'AMAZON_VOUCHER' ? 'name@example.com' : 'username@bank'}
              value={targetAccount}
              onChange={(e) => setTargetAccount(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(10, 6, 26, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '0.9rem'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-press"
            style={{
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(245, 158, 11, 0.35)',
              marginTop: '0.5rem'
            }}
          >
            {loading ? 'Processing Redemption...' : 'Confirm Redemption'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawModal;
