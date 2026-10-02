import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Coins,
  Flame,
  Star,
  Trophy,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Gift,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { useStreak } from '../context/StreakContext';
import { useToast } from '../context/ToastContext';
import { getWalletStats, getTasks, completeTask } from '../services/platformApi';
import Navbar from '../components/Navbar';
import WeeklyStreakBar from '../components/WeeklyStreakBar';
import AnimatedCounter from '../components/AnimatedCounter';
import TaskCard from '../components/TaskCard';
import LuckySpinWheel from '../components/LuckySpinWheel';
import LoadingState from '../components/LoadingState';
import Countdown from '../components/Countdown';

export const Dashboard = () => {
  const { user, wallet, refreshWallet } = useAuth();
  const {
    streak,
    rewards,
    serverTime,
    isClaiming,
    claimToday,
    refreshStreak,
    claimSuccessData,
    closeSuccessModal
  } = useStreak();
  const toast = useToast();
  const navigate = useNavigate();

  const [statsData, setStatsData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [claimRewardModalOpen, setClaimRewardModalOpen] = useState(false);
  const [claimedRewardInfo, setClaimedRewardInfo] = useState(null);
  const [isClaimButtonLoading, setIsClaimButtonLoading] = useState(false);

  // Fetch wallet stats & tasks on mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.allSettled([
          getWalletStats(),
          getTasks()
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
          setStatsData(statsRes.value.stats);
        }
        if (tasksRes.status === 'fulfilled' && tasksRes.value?.success) {
          setTasks(tasksRes.value.tasks || []);
        }
      } catch (e) {
        console.warn('Dashboard data fetch warning:', e.message);
      } finally {
        setLoadingTasks(false);
      }
    };

    loadDashboardData();
  }, []);

  const totalPoints = wallet?.vesBalance ?? statsData?.availableBalance ?? 2450;
  const currentStreak = streak?.currentStreak ?? 7;
  const currentLevel = statsData?.level ?? 5;
  const levelProgress = statsData?.levelProgressPercent ?? 72;
  const userRank = statsData?.rank ?? 18;
  const rankPercentile = statsData?.rankPercentile ?? 'Top 5%';
  const monthlyGrowth = statsData?.monthlyGrowth ?? '+12.5%';

  // Authoritative streak claim status from backend
  const canClaimToday = Boolean(streak?.isEligibleToday && !isClaiming);
  const todayReward = rewards.find((r) => r.isToday || r.day === streak?.currentDay) || rewards[0] || {
    amount: 100,
    currency: 'VES'
  };

  // Handle Daily Streak Check-in Claim
  const handleDailyClaim = async () => {
    if (!canClaimToday || isClaimButtonLoading) return;
    setIsClaimButtonLoading(true);

    try {
      // 1. API request made to backend
      const res = await claimToday();
      const amountClaimed = todayReward?.amount || 100;
      const currencyClaimed = todayReward?.currency || 'VES';

      // 2. Confetti micro celebration
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#8B5CF6', '#10B981', '#FBBF24']
        });
      } catch {}

      // 3. Open celebration popup
      setClaimedRewardInfo({
        amount: amountClaimed,
        currency: currencyClaimed,
        title: `Day ${streak?.currentDay || 1} Daily Check-In`
      });
      setClaimRewardModalOpen(true);

      // 4. Toast notification
      toast.reward(amountClaimed, currencyClaimed, 'Reward claimed successfully!');

      // 5. Update wallet & streak
      await refreshWallet();
      await refreshStreak(false);
    } catch (err) {
      toast.error(err.message || 'Check-in claim failed');
    } finally {
      setIsClaimButtonLoading(false);
    }
  };

  // Handle task completion from dashboard
  const handleTaskComplete = async (taskId) => {
    try {
      const res = await completeTask(taskId);
      if (res && res.success) {
        toast.reward(res.earnedPoints, res.currency, res.message || 'Task completed successfully!');
        if (res.tasks) {
          setTasks(res.tasks);
        } else {
          setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, isCompleted: true, progress: t.target } : t))
          );
        }
        await refreshWallet();
        const statsRes = await getWalletStats();
        if (statsRes && statsRes.success) setStatsData(statsRes.stats);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to complete task');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% -10%, #1e1346 0%, #0c0822 45%, #070514 100%)' }}>
      <Navbar />

      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
        {/* =========================================================================
            1. TOP WELCOME SECTION
            ========================================================================= */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 14px',
                borderRadius: '999px',
                background: 'rgba(139, 92, 246, 0.15)',
                border: '1px solid rgba(139, 92, 246, 0.35)',
                color: '#C4B5FD',
                fontSize: '0.8rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.5rem'
              }}
            >
              <Sparkles size={14} color="#F59E0B" /> VELoop Rewards Dashboard
            </div>
            <h1
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.6rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '-0.025em'
              }}
            >
              Welcome back 👋 {user?.name ? user.name.split(' ')[0] : 'Explorer'}
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.96rem', marginTop: '0.35rem', margin: '0.35rem 0 0' }}>
              Your daily rewards, streak status, and booster milestones are synchronized in real-time.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/daily-streak')}
              className="btn-press"
              style={{
                padding: '11px 20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)'
              }}
            >
              <Flame size={18} fill="#FFFFFF" /> Check-In Streak
            </button>

            <button
              onClick={() => navigate('/lucky-spin')}
              className="btn-press"
              style={{
                padding: '11px 20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.35)'
              }}
            >
              <Sparkles size={18} /> Lucky Spin
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. FOUR FLAGSHIP STATS CARDS (Exact Specs)
            ┌──────────────────────┐
            │ 🪙 Total Points      │
            │                      │
            │ 2,450                │
            │ +12.5% this month ↑  │
            └──────────────────────┘
            ========================================================================= */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem'
          }}
        >
          {/* 1. Total Points Card with Animated Number Counter */}
          <div
            className="card-lift"
            style={{
              background: 'linear-gradient(145deg, rgba(28, 20, 68, 0.75) 0%, rgba(14, 9, 36, 0.9) 100%)',
              border: '1.2px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '20px',
              padding: '1.6rem 1.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(245, 158, 11, 0.1)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: '#FBBF24', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
                🪙 Total Points
              </span>
              <span style={{ fontSize: '1.4rem' }}>🪙</span>
            </div>

            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              <AnimatedCounter value={totalPoints} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.65rem', color: '#34D399', fontSize: '0.84rem', fontWeight: 700 }}>
              <TrendingUp size={15} />
              <span>{monthlyGrowth} this month ↑</span>
            </div>
          </div>

          {/* 2. Streak Card */}
          <div
            className="card-lift"
            style={{
              background: 'linear-gradient(145deg, rgba(28, 20, 68, 0.75) 0%, rgba(14, 9, 36, 0.9) 100%)',
              border: '1.2px solid rgba(245, 158, 11, 0.45)',
              borderRadius: '20px',
              padding: '1.6rem 1.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(245, 158, 11, 0.15)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: '#F59E0B', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
                🔥 Streak
              </span>
              <Flame size={22} fill="#F59E0B" color="#F59E0B" />
            </div>

            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#FBBF24', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.65rem', color: '#CBD5E1', fontSize: '0.84rem', fontWeight: 600 }}>
              <span>Keep it going!</span>
            </div>
          </div>

          {/* 3. Level Card with Mini Progress Bar */}
          <div
            className="card-lift"
            style={{
              background: 'linear-gradient(145deg, rgba(28, 20, 68, 0.75) 0%, rgba(14, 9, 36, 0.9) 100%)',
              border: '1.2px solid rgba(139, 92, 246, 0.35)',
              borderRadius: '20px',
              padding: '1.6rem 1.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: '#A78BFA', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
                ⭐ Level
              </span>
              <Star size={20} fill="#A78BFA" color="#A78BFA" />
            </div>

            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Level {currentLevel}
            </div>

            <div style={{ marginTop: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px' }}>
                <span>{levelProgress}% to next level</span>
                <span style={{ color: '#A78BFA', fontWeight: 700 }}>Lvl {currentLevel + 1}</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${levelProgress}%`, height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)', borderRadius: '999px' }} />
              </div>
            </div>
          </div>

          {/* 4. Rank Card */}
          <div
            className="card-lift"
            style={{
              background: 'linear-gradient(145deg, rgba(28, 20, 68, 0.75) 0%, rgba(14, 9, 36, 0.9) 100%)',
              border: '1.2px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '20px',
              padding: '1.6rem 1.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: '#34D399', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
                🏆 Rank
              </span>
              <Trophy size={20} color="#34D399" />
            </div>

            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              #{userRank}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.65rem', color: '#34D399', fontSize: '0.84rem', fontWeight: 700 }}>
              <span>{rankPercentile} of participants</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. WEEKLY STREAK STRIP & CLAIM BANNER
            ========================================================================= */}
        <div style={{ marginBottom: '2.5rem' }}>
          <WeeklyStreakBar
            currentStreak={currentStreak}
            longestStreak={14}
            nextMilestone="10 Days (+250 VEs)"
            activeDay={streak?.currentDay || 1}
          />

          {/* Today's Actionable Check-In Strip */}
          <div
            className="card-lift"
            style={{
              marginTop: '1rem',
              padding: '1.25rem 1.5rem',
              background: canClaimToday
                ? 'linear-gradient(145deg, rgba(245, 158, 11, 0.16) 0%, rgba(20, 14, 46, 0.85) 100%)'
                : 'linear-gradient(145deg, rgba(20, 14, 46, 0.6) 0%, rgba(10, 7, 26, 0.8) 100%)',
              border: canClaimToday ? '1.5px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: canClaimToday ? '0 0 25px rgba(245, 158, 11, 0.2)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: canClaimToday ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: canClaimToday ? '1.5px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem'
                }}
              >
                {canClaimToday ? '⚡' : '🔒'}
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: canClaimToday ? '#FBBF24' : '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {canClaimToday ? "TODAY'S CHECK-IN AVAILABLE" : 'CHECK-IN SECURED TODAY'}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {canClaimToday
                    ? `Claim Day ${streak?.currentDay || 1} Reward: +${todayReward.amount} ${todayReward.currency}`
                    : `Day ${streak?.currentDay || 1} reward claimed. Next check-in in countdown:`}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {!canClaimToday && streak?.nextClaimAt && (
                <Countdown
                  serverTime={serverTime}
                  nextClaimAt={streak.nextClaimAt}
                  onCountdownZero={() => refreshStreak(false)}
                />
              )}

              <button
                onClick={handleDailyClaim}
                disabled={!canClaimToday || isClaimButtonLoading}
                className="btn-press"
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: canClaimToday
                    ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                    : 'rgba(255, 255, 255, 0.08)',
                  color: canClaimToday ? '#FFFFFF' : '#94A3B8',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: canClaimToday ? 'pointer' : 'not-allowed',
                  boxShadow: canClaimToday ? '0 4px 18px rgba(245, 158, 11, 0.4)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isClaimButtonLoading ? (
                  <>⏳ Claiming...</>
                ) : canClaimToday ? (
                  <>⚡ Claim Reward Now</>
                ) : (
                  <>✓ Check-In Done</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. TWO-COLUMN INTERACTIVE SHOWCASE:
               Left: Active Interactive Tasks (Complete with animated points)
               Right: Lucky Spin Widget
            ========================================================================= */}
        <div className="row g-4 mb-4 align-items-stretch">
          {/* Left Column: Active Tasks */}
          <div className="col-12 col-lg-7 d-flex flex-column">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                  Active Tasks & Activities
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.84rem', margin: '2px 0 0' }}>
                  Complete activities to instantly earn extra VEs coins.
                </p>
              </div>

              <button
                onClick={() => navigate('/tasks')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#A78BFA',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                View All Tasks <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
              {tasks.slice(0, 3).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleTaskComplete}
                  isCompact={true}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Lucky Spin Interactive Widget */}
          <div className="col-12 col-lg-5 d-flex flex-column">
            <LuckySpinWheel
              onPointsEarned={() => {
                refreshWallet();
              }}
              onOpenWallet={() => navigate('/wallet')}
            />
          </div>
        </div>

        {/* =========================================================================
            5. LEADERBOARD PREVIEW & REWARDS DESTINATIONS
            ========================================================================= */}
        <div
          className="card-lift"
          style={{
            background: 'linear-gradient(145deg, rgba(20, 14, 46, 0.7) 0%, rgba(10, 7, 26, 0.85) 100%)',
            border: '1.2px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '24px',
            padding: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', color: '#FBBF24', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>
              WEEKLY PRIZE POOL
            </div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#FFFFFF', margin: '0.2rem 0 0.4rem' }}>
              Climb to Top 3 for Exclusive Amazon Vouchers
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: 0, maxWidth: '540px' }}>
              You are currently ranked <strong>#{userRank}</strong> in the global leaderboard sprint. Complete daily tasks and check-ins to unlock podium bonuses.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/leaderboard')}
              className="btn-press"
              style={{
                padding: '12px 22px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.35)'
              }}
            >
              <Trophy size={16} color="#FBBF24" /> Open Leaderboard
            </button>

            <button
              onClick={() => navigate('/badges')}
              className="btn-press"
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer'
              }}
            >
              View Badges
            </button>
          </div>
        </div>

        {/* =========================================================================
            6. CELEBRATION MODAL (Exact User Spec)
            🎉
            REWARD CLAIMED
            +100 POINTS
            Your reward has been added successfully.
            [ Continue ]
            ========================================================================= */}
        {claimRewardModalOpen && claimedRewardInfo && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(4, 2, 16, 0.85)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px'
            }}
          >
            <div
              className="card-lift"
              style={{
                background: 'linear-gradient(145deg, #1A123E 0%, #0E0924 100%)',
                border: '2px solid #F59E0B',
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                maxWidth: '420px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(245, 158, 11, 0.35)',
                animation: 'toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
            >
              <div style={{ fontSize: '3.5rem', marginBottom: '0.4rem', animation: 'floatAnimation 3s ease-in-out infinite' }}>
                🎉
              </div>

              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
                DAILY STREAK BONUS
              </div>

              <h3 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                REWARD CLAIMED
              </h3>

              <div
                style={{
                  margin: '1.25rem 0',
                  padding: '1.25rem',
                  background: 'rgba(245, 158, 11, 0.12)',
                  borderRadius: '16px',
                  border: '1px solid rgba(245, 158, 11, 0.35)'
                }}
              >
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FBBF24' }}>
                  +{claimedRewardInfo.amount} {claimedRewardInfo.currency}
                </div>
                <div style={{ color: '#CBD5E1', fontSize: '0.88rem', marginTop: '4px' }}>
                  {claimedRewardInfo.title}
                </div>
              </div>

              <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Your reward has been added successfully to your vault.
              </p>

              <button
                onClick={() => setClaimRewardModalOpen(false)}
                className="btn-press"
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)'
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
