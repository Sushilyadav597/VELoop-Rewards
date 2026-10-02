import React, { useState } from 'react';
import { X, CheckCircle2, Copy, Check, ExternalLink, ShieldCheck, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const TransactionDetailModal = ({ transaction, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !transaction) return null;

  const isCredit = transaction.type === 'CREDIT';
  const isINR = transaction.currency === 'INR';
  const dateFormatted = transaction.createdAt
    ? new Date(transaction.createdAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'medium'
      })
    : 'Just now';

  const handleCopy = () => {
    navigator.clipboard.writeText(transaction.transactionId || transaction._id || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 3, 18, 0.82)',
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
          border: '1.5px solid rgba(139, 92, 246, 0.35)',
          borderRadius: '24px',
          padding: '2rem',
          maxWidth: '460px',
          width: '100%',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(139, 92, 246, 0.25)',
          animation: 'toastSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
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
          aria-label="Close transaction details"
        >
          <X size={18} />
        </button>

        {/* Modal Header Icon & Amount */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: isCredit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: isCredit ? '1.5px solid rgba(16, 185, 129, 0.5)' : '1.5px solid rgba(239, 68, 68, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              color: isCredit ? '#10B981' : '#EF4444'
            }}
          >
            {isCredit ? <ArrowDownLeft size={28} /> : <ArrowUpRight size={28} />}
          </div>

          <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>
            TRANSACTION DETAILS
          </div>

          <div
            style={{
              fontSize: '2.2rem',
              fontWeight: 900,
              color: isCredit ? '#10B981' : '#EF4444',
              marginTop: '0.2rem',
              letterSpacing: '-0.02em'
            }}
          >
            {isCredit ? '+' : '-'}{isINR ? `₹${transaction.amount}` : `${transaction.amount} ${transaction.currency || 'VEs'}`}
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '0.5rem', padding: '3px 10px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#34D399', fontSize: '0.76rem', fontWeight: 700 }}>
            <CheckCircle2 size={13} /> {transaction.status || 'COMPLETED'}
          </div>
        </div>

        {/* Ledger Details Grid */}
        <div
          style={{
            background: 'rgba(10, 6, 26, 0.7)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem' }}>
            <span style={{ color: '#94A3B8' }}>Source / Activity</span>
            <strong style={{ color: '#FFFFFF' }}>{transaction.source || 'Daily Streak'}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem' }}>
            <span style={{ color: '#94A3B8' }}>Timestamp</span>
            <span style={{ color: '#CBD5E1' }}>{dateFormatted}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem' }}>
            <span style={{ color: '#94A3B8' }}>Balance Shift</span>
            <span style={{ color: '#CBD5E1' }}>
              {transaction.balanceBefore ?? 0} &rarr; <strong style={{ color: '#FBBF24' }}>{transaction.balanceAfter ?? 0}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem' }}>
            <span style={{ color: '#94A3B8' }}>Transaction ID</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#A78BFA', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                {transaction.transactionId ? `${transaction.transactionId.substring(0, 14)}...` : 'N/A'}
              </span>
              <button
                onClick={handleCopy}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: copied ? '#10B981' : '#94A3B8',
                  cursor: 'pointer',
                  padding: '2px'
                }}
                title="Copy Transaction ID"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Security / Verification Strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.76rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <ShieldCheck size={14} color="#10B981" />
          <span>Cryptographically validated by VELoop ledger engine</span>
        </div>

        <button
          onClick={onClose}
          className="btn-press"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
