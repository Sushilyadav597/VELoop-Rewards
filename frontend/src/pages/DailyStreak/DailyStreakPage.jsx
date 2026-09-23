import React, { useState } from 'react';
import { useStreak } from '../../context/StreakContext';
import { useAuth } from '../../context/AuthContext';
import StreakHeader from '../../components/StreakHeader';
import HeroBanner from '../../components/HeroBanner';
import StreakStats from '../../components/StreakStats';
import UltimateReward from '../../components/UltimateReward';
import RewardGrid from '../../components/RewardGrid';
import WhyStreak from '../../components/WhyStreak';
import TrustFooter from '../../components/TrustFooter';
import CpaDemo from '../../components/CpaDemo';
import ClaimModal from '../../components/ClaimModal';
import AuthModal from '../../components/AuthModal';
import HistoryModal from '../../components/HistoryModal';
import EvaluatorToolbar from '../../components/EvaluatorToolbar';
import StreakLoader from '../../components/StreakLoader';
import StreakSkeleton from '../../components/StreakSkeleton';
import styles from './DailyStreak.module.css';

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

  const { user } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

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

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        {/* Navigation Bar / Header */}
        <StreakHeader
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenHistory={() => setHistoryModalOpen(true)}
        />

        {/* Error message banner if any (Section 92: friendly messages, no raw errors) */}
        {error && (
          <div className={styles.errorBanner}>
            <span>{error}</span>
            <button
              onClick={() => refreshStreak(false)}
              className="btn btn-sm btn-outline-danger ms-2"
            >
              Refresh
            </button>
          </div>
        )}

        {/* Hero Banner Section */}
        <HeroBanner
          streak={streak}
          onOpenHistory={() => setHistoryModalOpen(true)}
        />

        {/* 3 Metric Stats Cards */}
        <StreakStats streak={streak} />

        {/* Ultimate Day 7 Crown Showcase Card */}
        <UltimateReward
          ultimateReward={ultimateReward}
          currentStreak={streak?.currentStreak || 0}
        />

        {/* 7 Daily Reward Cards Responsive Grid */}
        <RewardGrid
          rewards={rewards}
          isClaiming={isClaiming}
          serverTime={serverTime}
          onClaim={(day) => initiateClaim(day)}
          onCountdownExpire={() => refreshStreak(false)}
        />

        {/* Supporting Benefits Information Section */}
        <WhyStreak />

        {/* Official Trust Strip */}
        <TrustFooter />
      </div>

      {/* CPA Advertisement Demo Modal (Section 7, 68) */}
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
