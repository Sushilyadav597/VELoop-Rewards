import React, { useState, useEffect, useCallback } from 'react';
import * as streakApi from '../services/streakApi';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import styles from '../styles/globals.module.css';

/**
 * StreakHistory Page (Step 9 Polish):
 * Renders immutable check-in ledger records from backend GET /api/daily-streak/history.
 * Strictly adheres to PDF requirement: INR gift cards display ₹ (never $).
 * Includes pagination controls, empty state, and refresh action.
 */
export const StreakHistory = () => {
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await streakApi.getStreakHistory({ page: pageNum, limit: 20 });
      const list = res?.history || res?.data?.history || (Array.isArray(res?.data) ? res.data : []);
      setHistory(list);

      const pag = res?.data?.pagination || res?.pagination;
      if (pag) {
        setPagination(pag);
      }
    } catch (err) {
      setError(err.message || 'Failed to load streak claim history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(1);
  }, [fetchHistory]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchHistory(newPage);
    }
  };

  if (loading && history.length === 0) {
    return <LoadingState message="Loading your streak claim history..." fullPage />;
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.75rem 1.25rem 3.5rem' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--accent-glow)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
          ⚡ VERIFIED AUDIT TRAIL
        </span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.35rem 0', letterSpacing: '-0.02em' }}>
          Streak Claim History
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
          Immutable ledger of all verified daily streak rewards credited to your account.
        </p>
      </div>

      {error && (
        <ErrorState
          error={error}
          onRetry={() => fetchHistory(pagination.page || 1)}
        />
      )}

      {history.length === 0 ? (
        <div
          className={styles.glassCard}
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            border: '1px dashed var(--border-subtle)'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>📜</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            No Claim History Yet
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
            You haven't claimed any daily streak rewards yet. Visit your Dashboard and check in today to get started!
          </p>
        </div>
      ) : (
        <div
          className={styles.glassCard}
          style={{
            overflowX: 'auto',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '0.5rem'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                <th style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cycle</th>
                <th style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Streak Day</th>
                <th style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Reward</th>
                <th style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Reward Type</th>
                <th style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Amount</th>
                <th style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Transaction Reference</th>
                <th style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Claimed At</th>
                <th style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => {
                const dateStr = item.claimedAt ? new Date(item.claimedAt).toLocaleString() : 'N/A';
                const rewardObj = item.reward || item.rewardSnapshot;
                const rewardTitle = rewardObj?.title || `Day ${item.day} Reward`;
                const amount = item.amount ?? rewardObj?.amount ?? 0;
                const currency = item.currency ?? rewardObj?.currency ?? 'VEs';
                const rewardType = item.rewardType ?? rewardObj?.rewardType ?? 'VES';
                const isINR = currency === 'INR' || rewardType.includes('GIFT_CARD');

                return (
                  <tr
                    key={item.claimId || item._id || idx}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                      {item.cycleId || 'Active'}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 800, color: 'var(--reward-gold)' }}>
                      Day {item.day}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {rewardTitle}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={isINR ? styles.badgeGold : styles.badgePurple}>
                        {rewardType}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.95rem', fontWeight: 800, color: 'var(--success-color)' }}>
                      +{isINR ? `₹${amount}` : `${amount} ${currency}`}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {item.transactionId || 'N/A'}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {dateStr}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={item.status === 'SUCCESS' ? styles.badgeGreen : styles.badgeMuted}>
                        {item.status || 'SUCCESS'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination UI */}
          {pagination.totalPages > 1 && (
            <div className={styles.paginationBar}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} claims total)
              </span>
              <button
                className={styles.pageButton}
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                &larr; Previous
              </button>
              <button
                className={styles.pageButton}
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StreakHistory;
