import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Flame,
  Star,
  Trophy,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Clock,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { useStreak } from '../context/StreakContext';
import { useToast } from '../context/ToastContext';
import { getWalletStats, getTasks, completeTask } from '../services/platformApi';
import Navbar from '../components/Navbar';
import AnimatedCounter from '../components/AnimatedCounter';
import TaskCard from '../components/TaskCard';
import Countdown from '../components/Countdown';
import DailyRotatingDrop from '../components/DailyRotatingDrop';

// Official 3D High-Fidelity Assets
import giftBoxMain from '../assets/images/Top_Left.png';
import day4GiftBox from '../assets/images/Day-4.png';
import crownVIP from '../assets/images/Top_right.png';
import day7Crown from '../assets/images/Day-7.png';
import coins3D from '../assets/images/VEs_Coin.png';
import flame3D from '../assets/images/Flame.png';
import calendar3D from '../assets/images/Stay_Active.png';
import chart3D from '../assets/images/Bigger_Streak.png';
import exclusiveReward3D from '../assets/images/Exclusive-reward.png';
import shield3D from '../assets/images/Trust.png';
import amazonCard3D from '../assets/images/Day-5.png';

import styles from './Dashboard.module.css';

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
  const currentStreak = streak?.currentStreak ?? 1;
  const currentLevel = statsData?.level ?? 5;
  const levelProgress = statsData?.levelProgressPercent ?? 72;
  const userRank = statsData?.rank ?? 18;
  const rankPercentile = statsData?.rankPercentile ?? 'Top 5%';
  const monthlyGrowth = statsData?.monthlyGrowth ?? '+14.5%';

  // Authoritative streak claim status from backend
  const canClaimToday = Boolean(streak?.isEligibleToday && !isClaiming);
  const todayReward = rewards.find((r) => r.isToday || r.day === streak?.currentDay) || rewards[0] || {
    amount: 10,
    currency: 'VES'
  };

  // Handle Daily Streak Check-in Claim
  const handleDailyClaim = async () => {
    if (!canClaimToday || isClaimButtonLoading) return;
    setIsClaimButtonLoading(true);

    try {
      const res = await claimToday();
      const amountClaimed = res?.claimedReward?.amount || todayReward?.amount || 10;
      const currencyClaimed = res?.claimedReward?.currency || todayReward?.currency || 'VES';

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#8B5CF6', '#10B981', '#FBBF24']
        });
      } catch {}

      setClaimedRewardInfo({
        amount: amountClaimed,
        currency: currencyClaimed,
        title: res?.claimedReward?.title || `Day ${streak?.currentDay || 1} Daily Check-In`,
        day: streak?.currentDay || 1
      });
      setClaimRewardModalOpen(true);

      toast.reward(amountClaimed, currencyClaimed, 'Reward claimed successfully!');
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

  // Get asset for roadmap day card
  const getRoadmapAsset = (day) => {
    if (day === 4) return { src: day4GiftBox, alt: 'Day 4 Gift Box' };
    if (day === 5) return { src: amazonCard3D, alt: 'Day 5 Amazon Card' };
    if (day === 7) return { src: day7Crown, alt: 'Day 7 Ultimate Crown' };
    return { src: coins3D, alt: 'Reward Coins' };
  };

  const benefitsList = [
    {
      img: calendar3D,
      title: 'Stay Active',
      desc: 'Keep your streak alive & earn more!'
    },
    {
      img: chart3D,
      title: 'Bigger Streak',
      desc: 'More consecutive logins, bigger rewards!'
    },
    {
      img: exclusiveReward3D,
      title: 'Exclusive Rewards',
      desc: 'Get coins, gift cards & special bonuses!'
    },
    {
      img: shield3D,
      title: "Don't Miss Out",
      desc: 'Come back every day & unlock all rewards!'
    }
  ];

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.main}>
        {/* =========================================================================
            1. FLAGSHIP FRONT PAGE HERO SECTION WITH LARGE 3D GIFT BOX
            ========================================================================= */}
        <section className={styles.heroContainer}>
          <div className={styles.heroAmbientPurple} />
          <div className={styles.heroAmbientGold} />

          {/* Left Hero Content */}
          <div className={styles.heroContent}>
            <div className={styles.brandPill}>
              <Sparkles size={13} color="#FBBF24" />
              <span>VELoop Rewards • Daily Streak System</span>
            </div>

            <h1 className={styles.heroTitle}>
              Login Daily &amp; Earn{' '}
              <span className={styles.goldGradient}>Bigger Rewards!</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Maintain your daily consecutive login streak to claim bonus VEs Coins,
              Amazon Gift Cards, and the Day 7 Royal Crown.
            </p>

            <div className={styles.heroActions}>
              {canClaimToday ? (
                <button
                  onClick={handleDailyClaim}
                  disabled={isClaimButtonLoading}
                  className={`${styles.btnHeroClaim} anim-shine btn-press`}
                >
                  <Zap size={18} fill="#FFFFFF" />
                  <span>
                    {isClaimButtonLoading
                      ? 'Claiming...'
                      : `Claim Day ${streak?.currentDay || 1} (+${todayReward.amount} ${todayReward.currency})`}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/daily-streak')}
                  className={`${styles.btnHeroClaim} btn-press`}
                  style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
                >
                  <CheckCircle2 size={18} />
                  <span>Check-In Secured Today</span>
                </button>
              )}

              <button
                onClick={() => navigate('/daily-streak')}
                className={`${styles.btnHeroStreakRoom} btn-press`}
              >
                <Flame size={17} color="#F59E0B" fill="#F59E0B" />
                <span>Full Daily Streak Hub</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right 3D Visual Asset Showcase (Large Attractive 3D Gift Box) */}
          <div className={styles.heroShowcaseWrapper}>
            <div
              className="anim-float position-relative"
              style={{
                transformOrigin: 'center bottom',
                filter: 'drop-shadow(0 18px 40px rgba(139, 92, 246, 0.6))'
              }}
            >
              <img
                src={giftBoxMain}
                alt="VELoop Rewards 3D Gift Box"
                className={styles.heroGiftBoxMain}
              />
              <img
                src={coins3D}
                alt="Orbiting Coins"
                className={styles.floatingCoinOrbiter}
              />
              <img
                src={crownVIP}
                alt="VIP Crown"
                className={styles.floatingCrownOrbiter}
              />
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. FOUR 3D STATS CARDS (Points, Streak, Tier, Rank)
            ========================================================================= */}
        <section className={styles.statsGrid}>
          {/* 1. Total Points Card with 3D Coin Stack */}
          <div className={`${styles.statCard} ${styles.statCardPoints}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel} style={{ color: '#FBBF24' }}>
                Total Points
              </span>
              <img
                src={coins3D}
                alt="Coins"
                className={styles.card3DAssetBadge}
              />
            </div>

            <div className={styles.cardValue}>
              <AnimatedCounter value={totalPoints} />
            </div>

            <div className={styles.cardFooter} style={{ color: '#34D399' }}>
              <span>{monthlyGrowth} growth this month ↑</span>
            </div>
          </div>

          {/* 2. Streak Card with 3D Glossy Flame */}
          <div className={`${styles.statCard} ${styles.statCardStreak}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel} style={{ color: '#F59E0B' }}>
                Active Streak
              </span>
              <img
                src={flame3D}
                alt="Flame"
                className={styles.card3DAssetBadge}
              />
            </div>

            <div className={styles.cardValue} style={{ color: '#FBBF24' }}>
              {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
            </div>

            <div className={styles.cardFooter} style={{ color: '#FDE68A' }}>
              <span>Keep it going! 🔥</span>
            </div>
          </div>

          {/* 3. VIP Tier Card with 3D Crown */}
          <div className={`${styles.statCard} ${styles.statCardLevel}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel} style={{ color: '#C4B5FD' }}>
                Explorer Tier
              </span>
              <img
                src={crownVIP}
                alt="Crown"
                className={styles.card3DAssetBadge}
              />
            </div>

            <div className={styles.cardValue}>
              Level {currentLevel}
            </div>

            <div style={{ marginTop: '0.45rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#CBD5E1', marginBottom: '3px' }}>
                <span>{levelProgress}% next</span>
                <span style={{ color: '#A78BFA', fontWeight: 700 }}>Lvl {currentLevel + 1}</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${levelProgress}%`, height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)', borderRadius: '999px' }} />
              </div>
            </div>
          </div>

          {/* 4. Global Leaderboard Rank with 3D Gold Chart */}
          <div className={`${styles.statCard} ${styles.statCardRank}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel} style={{ color: '#34D399' }}>
                Podium Rank
              </span>
              <img
                src={chart3D}
                alt="Chart"
                className={styles.card3DAssetBadge}
              />
            </div>

            <div className={styles.cardValue}>
              #{userRank}
            </div>

            <div className={styles.cardFooter} style={{ color: '#34D399' }}>
              <span>{rankPercentile} top performers</span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. INTERACTIVE 7-DAY DAILY STREAK ROADMAP (Immediate Visual Fidelity)
            ========================================================================= */}
        <section className={styles.roadmapCard}>
          <div className={styles.roadmapHeader}>
            <div>
              <h2 className={styles.roadmapTitle}>
                <Flame size={22} color="#F59E0B" fill="#F59E0B" />
                7-Day Streak Reward Roadmap
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.84rem', margin: '3px 0 0' }}>
                Log in each day to unlock consecutively higher rewards.
              </p>
            </div>

            <button
              onClick={() => navigate('/daily-streak')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#A78BFA',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Open Daily Streak Room <ArrowRight size={14} />
            </button>
          </div>

          {/* 7 Daily Cards Grid */}
          <div className={styles.roadmapGrid}>
            {rewards.map((r) => {
              const isClaimed = r.status === 'CLAIMED';
              const isToday = r.isToday || r.day === streak?.currentDay;
              const isAvailable = isToday && streak?.isEligibleToday;
              const isDay7 = r.day === 7;
              const asset = getRoadmapAsset(r.day);

              let itemClass = styles.roadmapDayItem;
              if (isAvailable) itemClass += ` ${styles.roadmapDayActive}`;
              else if (isClaimed) itemClass += ` ${styles.roadmapDayClaimed}`;
              else if (isDay7) itemClass += ` ${styles.roadmapDayDay7}`;

              return (
                <div
                  key={r.day}
                  className={itemClass}
                  onClick={() => navigate('/daily-streak')}
                  style={{ cursor: 'pointer' }}
                  title={`Day ${r.day}: ${r.title || 'Daily Reward'}`}
                >
                  <div className={styles.roadmapDayLabel}>
                    Day {r.day}
                  </div>

                  <img
                    src={asset.src}
                    alt={asset.alt}
                    className={`${styles.roadmapAssetImg} ${isAvailable ? 'anim-float' : ''}`}
                    style={
                      r.day === 4
                        ? { height: '62px', filter: 'drop-shadow(0 6px 14px rgba(139, 92, 246, 0.6))' }
                        : r.day === 7
                        ? { height: '58px', filter: 'drop-shadow(0 6px 16px rgba(245, 158, 11, 0.65))' }
                        : { filter: 'drop-shadow(0 4px 10px rgba(245, 158, 11, 0.4))' }
                    }
                  />

                  <div>
                    <div
                      className={styles.roadmapDayValue}
                      style={{
                        color: isClaimed ? '#10B981' : isAvailable ? '#FBBF24' : '#FFFFFF'
                      }}
                    >
                      {r.currency === 'INR' ? `₹${r.amount}` : `+${r.amount}`}
                    </div>
                    <div className={styles.roadmapDaySubtitle}>
                      {r.subtitle || (r.currency === 'INR' ? 'Amazon Card' : `${r.currency}`)}
                    </div>
                  </div>

                  {isClaimed ? (
                    <span className={styles.roadmapStatusBadge} style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399' }}>
                      <CheckCircle2 size={11} /> Done
                    </span>
                  ) : isAvailable ? (
                    <span className={styles.roadmapStatusBadge} style={{ background: '#F59E0B', color: '#11092A' }}>
                      Claim Now
                    </span>
                  ) : (
                    <span className={styles.roadmapStatusBadge} style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#94A3B8' }}>
                      <Lock size={10} /> Locked
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            4. DAILY ROTATING SURPRISE DROP SECTION (Official 3D Assets & Countdown)
            ========================================================================= */}
        <DailyRotatingDrop />

        {/* =========================================================================
            5. "WHY MAINTAIN YOUR STREAK?" SUPPORTING BENEFITS (Page 62 & 63 Spec)
            ========================================================================= */}
        <section className="mb-4">
          <div className="text-center mb-3">
            <span
              className="fw-bold text-uppercase d-inline-flex align-items-center gap-2"
              style={{
                color: '#C4B5FD',
                fontSize: 'clamp(0.74rem, 1.8vw, 0.84rem)',
                letterSpacing: '1.2px'
              }}
            >
              <span style={{ color: '#A78BFA' }}>✦</span>
              <span>Why Maintain Your Streak?</span>
              <span style={{ color: '#A78BFA' }}>✦</span>
            </span>
          </div>

          <div className="row g-2 g-sm-3">
            {benefitsList.map((item, idx) => (
              <div key={idx} className="col-6 col-md-3">
                <div
                  className="p-3 text-center h-100 d-flex flex-column align-items-center justify-content-start hover-lift"
                  style={{
                    background: 'linear-gradient(180deg, rgba(22, 14, 58, 0.72) 0%, rgba(13, 8, 36, 0.88) 100%)',
                    border: '1.2px solid rgba(139, 92, 246, 0.28)',
                    borderRadius: '18px',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)'
                  }}
                >
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-2 flex-shrink-0 anim-float"
                    style={{
                      filter: 'drop-shadow(0 8px 16px rgba(139, 92, 246, 0.45))'
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{
                        width: 'clamp(50px, 8vw, 62px)',
                        height: 'clamp(50px, 8vw, 62px)',
                        objectFit: 'contain'
                      }}
                      loading="lazy"
                    />
                  </div>

                  <h3
                    className="fw-bold text-white mb-1"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(0.82rem, 1.8vw, 0.94rem)'
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="mb-0"
                    style={{
                      color: '#94A3B8',
                      fontSize: 'clamp(0.68rem, 1.4vw, 0.76rem)',
                      lineHeight: '1.4'
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            6. ACTIVE TASKS & REWARDS ACTIVITIES
            ========================================================================= */}
        <section className="mb-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                Active Tasks &amp; Activities
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

          <div className="row g-3 align-items-stretch">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="col-12 col-md-4 d-flex">
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <TaskCard
                    task={task}
                    onComplete={handleTaskComplete}
                    isCompact={true}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            7. OFFICIAL TRUST STRIP (Page 62 / 63 Specification)
            ========================================================================= */}
        <footer className="pt-2 pb-4">
          <div
            className="d-flex align-items-center justify-content-between p-3 position-relative overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, #160e3a 0%, #0e0826 100%)',
              border: '1.2px solid rgba(139, 92, 246, 0.28)',
              borderRadius: '16px',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: '38px',
                  height: '38px',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.12) 100%)',
                  border: '1.5px solid rgba(245, 158, 11, 0.45)',
                  borderRadius: '10px'
                }}
              >
                <span
                  className="fw-extrabold text-warning"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.85rem'
                  }}
                >
                  VR
                </span>
              </div>

              <div>
                <span
                  className="d-block text-white fw-bold"
                  style={{ fontSize: 'clamp(0.78rem, 1.8vw, 0.86rem)' }}
                >
                  Official rewards only on VeLoopRewards.in
                </span>
                <span
                  style={{ color: '#94A3B8', fontSize: 'clamp(0.7rem, 1.5vw, 0.76rem)' }}
                >
                  Stay active, stay rewarded!
                </span>
              </div>
            </div>

            <div className="text-secondary ps-2 flex-shrink-0">
              <ChevronRight size={18} color="#A78BFA" />
            </div>
          </div>
        </footer>

        {/* =========================================================================
            8. 3D CELEBRATION MODAL WITH HIGH-DEFINITION ASSETS
            ========================================================================= */}
        {claimRewardModalOpen && claimedRewardInfo && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(5, 3, 16, 0.88)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px'
            }}
            onClick={() => setClaimRewardModalOpen(false)}
          >
            <div
              className="card-lift"
              style={{
                background: 'linear-gradient(145deg, #1C1242 0%, #0E0926 100%)',
                border: '2px solid #F59E0B',
                borderRadius: '26px',
                padding: '2.5rem 2rem',
                maxWidth: '430px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(245, 158, 11, 0.4)',
                position: 'relative',
                animation: 'toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 3D Celebration Asset */}
              <div
                className="anim-float d-flex justify-content-center mb-2"
                style={{
                  filter: 'drop-shadow(0 14px 30px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 25px rgba(245, 158, 11, 0.45))'
                }}
              >
                <img
                  src={
                    claimedRewardInfo.day === 4
                      ? day4GiftBox
                      : claimedRewardInfo.day === 7
                      ? day7Crown
                      : claimedRewardInfo.currency === 'INR'
                      ? amazonCard3D
                      : coins3D
                  }
                  alt="Claimed Reward"
                  style={{
                    height: '120px',
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </div>

              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
                DAILY STREAK BONUS
              </div>

              <h3 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                REWARD CLAIMED!
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
                  {claimedRewardInfo.currency === 'INR'
                    ? `₹${claimedRewardInfo.amount}`
                    : `+${claimedRewardInfo.amount} ${claimedRewardInfo.currency}`}
                </div>
                <div style={{ color: '#CBD5E1', fontSize: '0.88rem', marginTop: '4px' }}>
                  {claimedRewardInfo.title}
                </div>
              </div>

              <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Your reward has been added successfully to your wallet vault.
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
