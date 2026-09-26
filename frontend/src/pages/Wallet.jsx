import React, { useState } from 'react';
import useWallet from '../hooks/useWallet';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import styles from '../styles/globals.module.css';

/**
 * Wallet Page (Step 9 Polish):
 * Renders authoritative balance cards and transaction ledger strictly from backend values.
 * Strictly adheres to PDF requirement: INR gift cards display ₹ (never $).
 * Never calculates or alters balances locally.
 */
export const Wallet = () => {
  const [page, setPage] = useState(1);
  const { wallet, transactions, loading, error, refreshAll, fetchTransactions } = useWallet(true);

  const handlePageChange = async (newPage) => {
    if (newPage < 1) return;
    setPage(newPage);
    try {
      await fetchTransactions({ page: newPage, limit: 10 });
    } catch (e) {
      // Handled in hook
    }
  };

  if (loading && !wallet) {
    return <LoadingState message="Loading your rewards wallet..." fullPage />;
  }

  const hasGems = wallet && wallet.gemsBalance !== undefined && wallet.gemsBalance !== null;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.75rem 1.25rem 3.5rem' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--accent-glow)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
          ⚡ ASSET VAULT
        </span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.35rem 0', letterSpacing: '-0.02em' }}>
          My Rewards Wallet
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
          Authoritative balance records and immutable transaction ledger backed by the VELoop reward engine.
        </p>
      </div>

      {error && (
        <ErrorState
          error={error}
          onRetry={refreshAll}
        />
      )}

      {/* 1. Authoritative Wallet Balance Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}
      >
        {/* VEs Coin Balance */}
        <div
          className={styles.glassCard}
          style={{
            padding: '1.75rem 2rem',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            boxShadow: '0 6px 24px rgba(139, 92, 246, 0.15)',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--accent-glow)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              VEs Coin Balance
            </span>
            <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))' }}>🪙</span>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {wallet ? (wallet.vesBalance ?? 0) : 0}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.4rem', margin: 0 }}>
            Earned from daily streak check-ins and booster milestones.
          </p>
        </div>

        {/* Amazon Voucher Total (INR ₹ — PDF Requirement: never $) */}
        <div
          className={styles.glassCard}
          style={{
            padding: '1.75rem 2rem',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            boxShadow: '0 6px 24px rgba(245, 158, 11, 0.15)',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--reward-gold)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Amazon Gift Vouchers
            </span>
            <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.4))' }}>🎟️</span>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--reward-gold)', letterSpacing: '-0.02em' }}>
            ₹{wallet ? (wallet.amazonVouchersTotal ?? 0) : 0}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.4rem', margin: 0 }}>
            Accumulated Amazon vouchers unlocked through 7-day milestone streaks.
          </p>
        </div>

        {/* Gems Balance (if supported/returned by backend) */}
        {hasGems && (
          <div
            className={styles.glassCard}
            style={{
              padding: '1.75rem 2rem',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              boxShadow: '0 6px 24px rgba(16, 185, 129, 0.15)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--success-color)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                Reward Gems
              </span>
              <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))' }}>💎</span>
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {wallet.gemsBalance}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.4rem', margin: 0 }}>
              Special streak currency for exclusive platform perks.
            </p>
          </div>
        )}
      </div>

      {/* 2. Transaction Ledger */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Transaction History
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.2rem 0 0' }}>
              Every streak credit creates an immutable, cryptographically verifiable ledger record.
            </p>
          </div>
          <button
            onClick={refreshAll}
            className={styles.pageButton}
            title="Refresh transactions"
          >
            🔄 Refresh
          </button>
        </div>

        {transactions.length === 0 ? (
          <div
            className={styles.glassCard}
            style={{
              padding: '3.5rem 2rem',
              textAlign: 'center',
              border: '1px dashed var(--border-subtle)'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>💳</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              No Transactions Recorded Yet
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
              Transactions will automatically appear here when you claim streak rewards from your Dashboard.
            </p>
          </div>
        ) : (
          <div
            className={styles.glassCard}
            style={{
              overflowX: 'auto',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px'
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                  <th style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>TX Reference</th>
                  <th style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Source</th>
                  <th style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Type</th>
                  <th style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Amount</th>
                  <th style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Balance (Before &rarr; After)</th>
                  <th style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Timestamp</th>
                  <th style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => {
                  const dateStr = tx.createdAt ? new Date(tx.createdAt).toLocaleString() : 'N/A';
                  const isCredit = tx.type === 'CREDIT';
                  const isINR = tx.currency === 'INR';

                  return (
                    <tr
                      key={tx.transactionId || tx._id || idx}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {tx.transactionId || 'N/A'}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        {tx.source === 'DAILY_STREAK' && tx.streakDay
                          ? `Day ${tx.streakDay} Daily Check-In`
                          : tx.source || 'Daily Streak Reward'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={isCredit ? styles.badgeGreen : styles.badgeMuted}>
                          {tx.type}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.95rem', fontWeight: 800, color: isCredit ? 'var(--success-color)' : 'var(--danger-color)' }}>
                        {isCredit ? '+' : '-'}{isINR ? `₹${tx.amount}` : `${tx.amount} ${tx.currency}`}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        {tx.balanceBefore ?? 0} &rarr; <strong style={{ color: 'var(--text-primary)' }}>{tx.balanceAfter ?? 0}</strong>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {dateStr}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={styles.badgeGreen}>
                          {tx.status || 'COMPLETED'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
