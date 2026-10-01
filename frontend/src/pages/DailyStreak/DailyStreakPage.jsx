import React, { useState } from 'react';
import { useStreak } from '../../context/StreakContext';
import { useAuth } from '../../context/AuthContext';
import StreakHeader from '../../components/StreakHeader';
import HeroBanner from '../../components/HeroBanner';
import StreakStats from '../../components/StreakStats';
import StreakProgress from '../../components/StreakProgress';
import UltimateReward from '../../components/UltimateReward';
import RewardGrid from '../../components/RewardGrid';
import WhyStreak from '../../components/WhyStreak';
import Footer from '../../components/Footer';
import SuccessState from '../../components/SuccessState';
import ErrorState from '../../components/ErrorState';
import CpaDemo from '../../components/CpaDemo';
import ClaimModal from '../../components/ClaimModal';
import AuthModal from '../../components/AuthModal';
import HistoryModal from '../../components/HistoryModal';
import EvaluatorToolbar from '../../components/EvaluatorToolbar';
import StreakLoader from '../../components/StreakLoader';
import StreakSkeleton from '../../components/StreakSkeleton';
import DailyRotatingDrop from '../../components/DailyRotatingDrop';
import styles from './DailyStreak.module.css';

/**
 * DailyStreakPage Component (Section 17):
 * Main production-grade daily streak orchestrator.
 * Follows the required component hierarchy:
 * DailyStreakPage
 * ├── StreakHeader
 * ├── HeroBanner
 * ├── StreakStats
 * ├── StreakProgress
 * ├── RewardGrid
 * │   └── RewardCard
 * ├── UltimateReward
 * ├── ClaimButton
 * ├── ClaimModal
 * ├── CountdownTimer
 * ├── SuccessState
 * ├── ErrorState
 * ├── StreakLoader
 * ├── StreakSkeleton
 * ├── WhyStreak
 * └── Footer
 */
export const DailyStreakPage = () => {
  const {
    streak,
    rewards,
    serverTime,
    isLoading,
    error,
    isClaiming,
    cpaModalOpen,
    setCpaModalOpen,
    pendingClaimDay,
    claimSuccessData,
    initiateClaim,
    finalizeAuthoritativeClaim,
    closeSuccessModal,
    refreshStreak
  } = useStreak();

  const { user, wallet } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [showInlineSuccess, setShowInlineSuccess] = useState(true);

  // If initial load in progress, show branded loader
  if (isLoading && !streak) {
    return (
      <div className={styles.pageContainer}>
        <StreakLoader
          onRetry={() => refreshStreak(true)}
          onContinue={() => refreshStreak(false)}
          error={error}
        />
      </div>
    );
  }

  // Get Day 7 reward definition for Ultimate Reward card
  const ultimateReward = rewards.find((r) => r.day === 7) || {
    amount: 5,
    subtitle: 'Amazon Gift Card'
  };

  // Find today's reward
  const todayReward = rewards.find((r) => r.isToday || r.day === streak?.currentDay) || rewards[0];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        {/* Navigation Bar / Header */}
        <StreakHeader
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenHistory={() => setHistoryModalOpen(true)}
        />

        {/* Context-aware friendly error alert */}
        {error && (
          <ErrorState
            error={error}
            onRetry={() => refreshStreak(false)}
            onDismiss={() => {}}
            title="Notice"
          />
        )}

        {/* Inline celebratory confirmation message if recently claimed */}
        {claimSuccessData && showInlineSuccess && (
          <SuccessState
            rewardReceived={
              claimSuccessData.claimedReward?.currency === 'INR'
                ? `₹${claimSuccessData.claimedReward?.amount} Amazon Voucher`
                : `+${claimSuccessData.claimedReward?.amount || todayReward?.amount || 10} VEs`
            }
            updatedBalance={wallet?.vesBalance}
            updatedStreak={streak?.currentStreak}
            message="Reward Claimed Successfully! Added to your wallet."
            onDismiss={() => setShowInlineSuccess(false)}
          />
        )}

        {/* Hero & Ultimate Reward Section: Responsive 2-Col on Desktop/Tablet, Stacked on Mobile */}
        <div className="row g-2 g-md-3 mb-2 mb-md-3 align-items-stretch">
          <div className="col-12 col-lg-7 d-flex flex-column justify-content-between">
            <HeroBanner
              streak={streak}
              todayReward={todayReward}
              serverTime={serverTime}
              isClaiming={isClaiming}
              onClaim={(day) => initiateClaim(day)}
              onOpenHistory={() => setHistoryModalOpen(true)}
              onCountdownExpire={() => refreshStreak(false)}
            />
            <StreakStats streak={streak} />
          </div>

          <div className="col-12 col-lg-5 mb-2 mb-md-3 mb-lg-0">
            <UltimateReward
              ultimateReward={ultimateReward}
              currentStreak={streak?.currentStreak || 0}
            />
          </div>
        </div>

        {/* 7-Day Streak Progression Bar / Stepper (Section 5) */}
        <StreakProgress
          rewards={rewards}
          streak={streak}
          onSelectDay={(day) => {
            const target = rewards.find((r) => r.day === day);
            if (target?.status === 'AVAILABLE') {
              initiateClaim(day);
            }
          }}
        />

        {/* 7 Daily Reward Cards Responsive Grid (Desktop: 7-Row, Mobile: 4+3 Grid) */}
        <RewardGrid
          rewards={rewards}
          isClaiming={isClaiming}
          serverTime={serverTime}
          onClaim={(day) => initiateClaim(day)}
          onCountdownExpire={() => refreshStreak(false)}
        />

        {/* Supporting Benefits Information Section */}
        <WhyStreak />

        {/* 24-Hour Rotating Surprise Drop Bonus Showcase */}
        <DailyRotatingDrop />

        {/* SaaS Platform Footer with Trust Strip */}
        <Footer />
      </div>

      {/* CPA Advertisement Demo Modal */}
      <CpaDemo
        isOpen={cpaModalOpen}
        day={pendingClaimDay}
        isClaiming={isClaiming}
        error={error}
        onComplete={() => finalizeAuthoritativeClaim()}
        onCancel={() => setCpaModalOpen(false)}
      />

      {/* Claim Confirmed Celebration Modal */}
      <ClaimModal
        isOpen={Boolean(claimSuccessData)}
        claimData={claimSuccessData}
        onClose={closeSuccessModal}
      />

      {/* Auth Modal (Login/Register/Switch) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Check-In History Modal */}
      <HistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
      />

      {/* Evaluator Anti-Cheat & Simulation Floating Panel */}
      <EvaluatorToolbar />
    </div>
  );
};

export default DailyStreakPage;
