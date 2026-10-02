import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight, ShieldCheck, RefreshCw, Send, Gift, CreditCard, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import useWallet from '../hooks/useWallet';
import { getWalletStats } from '../services/platformApi';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import TransactionDetailModal from '../components/TransactionDetailModal';
import WithdrawModal from '../components/WithdrawModal';
import Navbar from '../components/Navbar';
import AnimatedCounter from '../components/AnimatedCounter';

export const Wallet = () => {
  const [selectedTx, setSelectedTx] = useState(null);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [statsData, setStatsData] = useState(null);

  const { wallet, transactions, loading, error, refreshAll, fetchTransactions } = useWallet(true);

  const fetchStats = async () => {
    try {
      const res = await getWalletStats();
      if (res && res.success) {
        setStatsData(res.stats);
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    fetchStats();
  }, [wallet]);

  if (loading && !wallet) {
    return (
      <div>
        <Navbar />
        <LoadingState message="Loading your rewards vault..." fullPage />
      </div>
    );
  }

  const vesBalance = wallet?.vesBalance ?? 100;
  const amazonVouchersTotal = wallet?.amazonVouchersTotal ?? 0;
  const gemsBalance = wallet?.gemsBalance ?? 120;

  // Calculate approximate total available valuation in INR (e.g. ₹ vouchers + VEs value)
  const approxInrValuation = (amazonVouchersTotal + (vesBalance / 2)).toFixed(2);

  const totalEarned = statsData?.totalEarned ?? 2450;
  const totalWithdrawn = statsData?.totalWithdrawn ?? 0;
  const pending = statsData?.pending ?? 0;

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% -10%, #1e1346 0%, #0c0822 45%, #070514 100%)' }}>
      <Navbar />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', color: '#FBBF24', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
              <ShieldCheck size={14} /> VELoop Cryptographic Vault
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
              Rewards Wallet & Ledger
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', margin: '0.35rem 0 0' }}>
              Real-time balance records, instant redemption options, and immutable transaction timeline.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => { refreshAll(); fetchStats(); }}
              className="btn-press"
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#CBD5E1',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={15} /> Refresh
            </button>

            <button
              onClick={() => setIsWithdrawOpen(true)}
              className="btn-press"
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(245, 158, 11, 0.35)'
              }}
            >
              <Gift size={16} /> Redeem / Cashout
            </button>
          </div>
        </div>

        {error && <ErrorState error={error} onRetry={refreshAll} />}

        {/* 1. Primary Available Balance Hero Card */}
        <div
          className="card-lift"
          style={{
            background: 'linear-gradient(145deg, rgba(30, 20, 72, 0.8) 0%, rgba(15, 10, 38, 0.95) 100%)',
            border: '1.5px solid rgba(139, 92, 246, 0.4)',
            borderRadius: '24px',
            padding: '2rem 2.25rem',
            marginBottom: '2rem',
            boxShadow: '0 16px 45px rgba(0, 0, 0, 0.4), 0 0 30px rgba(139, 92, 246, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div>
            <span style={{ fontSize: '0.82rem', color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
              AVAILABLE REWARDS VALUATION
            </span>
            <div style={{ fontSize: 'clamp(2.4rem, 5vw, 3.2rem)', fontWeight: 900, color: '#FFFFFF', margin: '0.35rem 0', letterSpacing: '-0.03em' }}>
              ₹{approxInrValuation}
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: 0 }}>
              Instant redemption available via Amazon vouchers or bank transfer.
            </p>
          </div>

          {/* Sub-currencies Breakdown */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {/* VEs Coins */}
            <div style={{ background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '16px', padding: '12px 18px', minWidth: '130px' }}>
              <div style={{ fontSize: '0.74rem', color: '#A78BFA', textTransform: 'uppercase', fontWeight: 700 }}>
                VEs Coins
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#FFFFFF', marginTop: '2px' }}>
                🪙 <AnimatedCounter value={vesBalance} />
              </div>
            </div>

            {/* Amazon Vouchers Total (INR ₹) */}
            <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '16px', padding: '12px 18px', minWidth: '130px' }}>
              <div style={{ fontSize: '0.74rem', color: '#FBBF24', textTransform: 'uppercase', fontWeight: 700 }}>
                Amazon Gift Cards
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#FBBF24', marginTop: '2px' }}>
                🎟️ ₹<AnimatedCounter value={amazonVouchersTotal} />
              </div>
            </div>

            {/* Gems */}
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '16px', padding: '12px 18px', minWidth: '110px' }}>
              <div style={{ fontSize: '0.74rem', color: '#34D399', textTransform: 'uppercase', fontWeight: 700 }}>
                Reward Gems
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#34D399', marginTop: '2px' }}>
                💎 <AnimatedCounter value={gemsBalance} />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Three Summary Cards: Total Earned, Total Withdrawn, Pending */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem'
          }}
        >
          {/* Total Earned */}
          <div
            className="card-lift"
            style={{
              background: 'linear-gradient(145deg, rgba(20, 14, 46, 0.7) 0%, rgba(10, 7, 26, 0.85) 100%)',
              border: '1.2px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#34D399', textTransform: 'uppercase', fontWeight: 800 }}>
                Total Points Earned
              </span>
              <span style={{ fontSize: '1.5rem' }}>📈</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF' }}>
              +{totalEarned.toLocaleString()} 🪙
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '4px 0 0' }}>
              Cumulative earnings from check-ins & tasks
            </p>
          </div>

          {/* Total Withdrawn */}
          <div
            className="card-lift"
            style={{
              background: 'linear-gradient(145deg, rgba(20, 14, 46, 0.7) 0%, rgba(10, 7, 26, 0.85) 100%)',
              border: '1.2px solid rgba(139, 92, 246, 0.25)',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#A78BFA', textTransform: 'uppercase', fontWeight: 800 }}>
                Total Withdrawn
              </span>
              <span style={{ fontSize: '1.5rem' }}>💳</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF' }}>
              ₹{totalWithdrawn.toFixed(2)}
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '4px 0 0' }}>
              Successfully claimed vouchers & cashouts
            </p>
          </div>

          {/* Pending */}
          <div
            className="card-lift"
            style={{
              background: 'linear-gradient(145deg, rgba(20, 14, 46, 0.7) 0%, rgba(10, 7, 26, 0.85) 100%)',
              border: '1.2px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#FBBF24', textTransform: 'uppercase', fontWeight: 800 }}>
                Pending Redemptions
              </span>
              <span style={{ fontSize: '1.5rem' }}>⏳</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF' }}>
              ₹{pending.toFixed(2)}
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '4px 0 0' }}>
              Currently in digital dispatch queue
            </p>
          </div>
        </div>

        {/* 3. Transaction Timeline Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                Transaction Timeline
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.86rem', margin: '0.2rem 0 0' }}>
                Click any record to inspect audit logs, before/after balances, and cryptokeys.
              </p>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#A78BFA', fontWeight: 700 }}>
              {transactions.length} Records
            </span>
          </div>

          {transactions.length === 0 ? (
            <div
              style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                background: 'rgba(20, 14, 46, 0.4)',
                border: '1.5px dashed rgba(139, 92, 246, 0.25)',
                borderRadius: '20px'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.6rem' }}>💳</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.3rem' }}>
                No Transactions Yet
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: 0 }}>
                Check in on the Daily Streak or complete a task to create your first ledger transaction.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {transactions.map((tx, idx) => {
                const isCredit = tx.type === 'CREDIT';
                const isINR = tx.currency === 'INR';
                const dateObj = tx.createdAt ? new Date(tx.createdAt) : new Date();
                const timeStr = dateObj.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <div
                    key={tx.transactionId || tx._id || idx}
                    onClick={() => setSelectedTx(tx)}
                    className="card-lift"
                    style={{
                      background: 'linear-gradient(145deg, rgba(22, 16, 50, 0.6) 0%, rgba(12, 8, 30, 0.75) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: isCredit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          border: isCredit ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isCredit ? '#10B981' : '#EF4444'
                        }}
                      >
                        {isCredit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                      </div>

                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#FFFFFF' }}>
                          {tx.source === 'DAILY_STREAK'
                            ? `Daily Reward (Day ${tx.streakDay || 1})`
                            : tx.source === 'LUCKY_SPIN'
                            ? 'Lucky Spin Reward'
                            : tx.source === 'TASK_COMPLETION'
                            ? 'Task Completed'
                            : tx.source === 'WITHDRAWAL'
                            ? 'Redemption Cashout'
                            : tx.source || 'Daily Reward'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                          {timeStr} • <span style={{ color: '#A78BFA' }}>{tx.status || 'COMPLETED'}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: isCredit ? '#10B981' : '#EF4444' }}>
                        {isCredit ? '+' : '-'}{isINR ? `₹${tx.amount}` : `${tx.amount} ${tx.currency || 'VEs'}`}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        Click for audit details &rarr;
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Transaction Detail Modal */}
        <TransactionDetailModal
          isOpen={Boolean(selectedTx)}
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />

        {/* Withdraw / Redeem Modal */}
        <WithdrawModal
          isOpen={isWithdrawOpen}
          onClose={() => setIsWithdrawOpen(false)}
          onSuccess={() => { refreshAll(); fetchStats(); }}
        />
      </main>
    </div>
  );
};

export default Wallet;
