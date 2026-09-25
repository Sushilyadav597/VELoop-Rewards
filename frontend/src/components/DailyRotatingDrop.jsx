import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Clock,
  Gift,
  Zap,
  Calendar,
  ChevronDown,
  ChevronUp,
  Check,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import streakApi from '../services/streakApi';
import { useAuth } from '../context/AuthContext';
import GoldCoins from '../assets/GoldCoins';
import GiftBox from '../assets/GiftBox';
import AmazonCard from '../assets/AmazonCard';
import RoyalCrown from '../assets/RoyalCrown';
import GemIcon from '../assets/GemIcon';

export const DailyRotatingDrop = () => {
  const { token, refreshWallet } = useAuth();

  const [dropData, setDropData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);

  // Live countdown state
  const [timeRemaining, setTimeRemaining] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
    totalMs: 0
  });

  const fetchDrop = useCallback(async () => {
    try {
      const res = await streakApi.getRotatingDrop();
      if (res && res.success) {
        setDropData(res);
      }
    } catch (err) {
      console.warn('[RotatingDrop fetch error]:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrop();
  }, [fetchDrop, token]);

  // Live countdown to next midnight rotation
  useEffect(() => {
    if (!dropData || !dropData.nextRotationAt) return;

    const updateTimer = () => {
      const targetTime = new Date(dropData.nextRotationAt).getTime();
      const now = Date.now();
      const diff = Math.max(0, targetTime - now);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
        totalMs: diff
      });

      // When countdown reaches zero, auto-fetch the new rotated drop
      if (diff <= 0) {
        fetchDrop();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [dropData, fetchDrop]);

  const handleClaimDrop = async () => {
    if (isClaiming || !dropData || dropData.isClaimedToday) return;

    setIsClaiming(true);
    setError(null);

    try {
      const res = await streakApi.claimRotatingDrop();
      if (res && res.success) {
        // Confetti celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        setSuccessNotice(`🎉 Unlocked today's surprise: ${res.reward?.subtitle || 'Reward'}!`);
        await refreshWallet();
        await fetchDrop();
        setTimeout(() => setSuccessNotice(null), 6000);
      }
    } catch (err) {
      setError(err.message || "Failed to claim today's rotating drop");
    } finally {
      setIsClaiming(false);
    }
  };

  if (isLoading || !dropData) {
    return null; // Gracefully stay hidden while loading
  }

  const { todayDrop, isClaimedToday, schedule = [], dayOfWeek } = dropData;

  const renderIcon = (assetType, size = 64) => {
    switch (assetType) {
      case 'gift-box':
        return <GiftBox size={size} className="anim-float" />;
      case 'amazon-card':
        return <AmazonCard size={size} />;
      case 'crown':
        return <RoyalCrown size={size} className="anim-float" />;
      case 'coin-stack':
      case 'coin':
      default:
        return <GoldCoins size={size} />;
    }
  };

  return (
    <section className="mb-4">
      {/* Main Container Card */}
      <div
        className="p-3 p-md-4 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 20, 70, 0.95) 0%, rgba(18, 12, 45, 0.98) 100%)',
          borderRadius: '20px',
          border: '1.5px solid rgba(245, 158, 11, 0.45)',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45), 0 0 25px rgba(245, 158, 11, 0.15)'
        }}
      >
        {/* Ambient background glow orb */}
        <div
          className="position-absolute"
          style={{
            top: '-40px',
            right: '-40px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Top Header Row */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <div className="d-flex align-items-center gap-2">
            <span
              className="badge px-3 py-2 d-inline-flex align-items-center gap-1.5 fw-bold"
              style={{
                background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
                color: '#18181B',
                fontSize: '0.78rem',
                borderRadius: '999px',
                letterSpacing: '0.5px'
              }}
            >
              <Zap size={14} fill="#18181B" /> DAILY ROTATING SURPRISE DROP
            </span>
            <span className="text-secondary small d-none d-md-inline">
              Changes every 24 hours at midnight
            </span>
          </div>

          {/* Live Countdown Badge */}
          <div
            className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              fontSize: '0.8rem',
              color: '#FBBF24'
            }}
          >
            <Clock size={14} className="text-warning" />
            <span className="text-white-50">Next Reward In:</span>
            <strong className="font-monospace text-warning">
              {timeRemaining.hours}h : {timeRemaining.minutes}m : {timeRemaining.seconds}s
            </strong>
          </div>
        </div>

        {/* Success Notice if Claimed */}
        {successNotice && (
          <div
            className="alert alert-success py-2 px-3 mb-3 d-flex align-items-center gap-2 border-0"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: '#34D399',
              borderRadius: '12px'
            }}
          >
            <Check size={18} />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Error Notice */}
        {error && (
          <div
            className="alert alert-danger py-2 px-3 mb-3 d-flex align-items-center gap-2 border-0"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#F87171',
              borderRadius: '12px'
            }}
          >
            <span>{error}</span>
          </div>
        )}

        {/* Hero Body: Reward Spotlight Card */}
        <div className="row align-items-center g-3">
          {/* Left: 3D Animated Illustration */}
          <div className="col-auto text-center">
            <div
              className="p-3 d-inline-flex align-items-center justify-content-center position-relative"
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '20px',
                background: todayDrop.gradient || 'linear-gradient(135deg, #FF8008 0%, #FFC837 100%)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)'
              }}
            >
              {renderIcon(todayDrop.assetType, 58)}
              {isClaimedToday && (
                <div
                  className="position-absolute top-0 end-0 translate-middle-y me-1 bg-success text-white rounded-circle p-1"
                  style={{ width: '24px', height: '24px', display: 'grid', placeItems: 'center' }}
                  title="Claimed today"
                >
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </div>
          </div>

          {/* Middle: Details & Perks */}
          <div className="col">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span
                className="badge fw-semibold"
                style={{
                  backgroundColor: 'rgba(139, 92, 246, 0.3)',
                  color: '#C4B5FD',
                  fontSize: '0.72rem',
                  border: '1px solid rgba(139, 92, 246, 0.4)'
                }}
              >
                {todayDrop.dayName?.toUpperCase()} SPECIAL • {todayDrop.badge}
              </span>
              <span className="text-secondary small">• Active Today</span>
            </div>

            <h4 className="fw-bold mb-1 text-white">
              {todayDrop.theme}
            </h4>

            <p className="text-secondary small mb-2" style={{ lineHeight: '1.4' }}>
              {todayDrop.description}
            </p>

            {/* Perks Badges */}
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span
                className="px-2 py-1 rounded fw-bold small text-warning"
                style={{ background: 'rgba(245, 158, 11, 0.15)', fontSize: '0.82rem' }}
              >
                🎁 {todayDrop.subtitle}
              </span>

              {todayDrop.bonusGems > 0 && (
                <span
                  className="px-2 py-1 rounded small d-inline-flex align-items-center gap-1"
                  style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontSize: '0.8rem' }}
                >
                  <GemIcon size={14} /> +{todayDrop.bonusGems} Rare Gems
                </span>
              )}

              {todayDrop.bonusVes > 0 && (
                <span
                  className="px-2 py-1 rounded small"
                  style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#C084FC', fontSize: '0.8rem' }}
                >
                  ⚡ +{todayDrop.bonusVes} Bonus VEs
                </span>
              )}
            </div>
          </div>

          {/* Right: Claim Action Button */}
          <div className="col-12 col-md-auto text-md-end mt-3 mt-md-0">
            {isClaimedToday ? (
              <div className="d-inline-flex flex-column align-items-md-end gap-1">
                <button
                  disabled
                  className="btn btn-sm px-4 py-2.5 fw-bold d-inline-flex align-items-center gap-2 text-white"
                  style={{
                    backgroundColor: '#10B981',
                    borderRadius: '12px',
                    cursor: 'default',
                    border: 'none',
                    opacity: 0.95
                  }}
                >
                  <Check size={18} strokeWidth={2.5} /> Claimed for Today!
                </button>
                <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                  Next surprise drops in {timeRemaining.hours}h {timeRemaining.minutes}m
                </span>
              </div>
            ) : (
              <button
                onClick={handleClaimDrop}
                disabled={isClaiming}
                className="btn px-4 py-2.5 fw-bold d-inline-flex align-items-center gap-2 text-dark transition-all"
                style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 18px rgba(245, 158, 11, 0.4)',
                  border: 'none',
                  fontSize: '0.92rem'
                }}
              >
                {isClaiming ? (
                  <>
                    <span className="spinner-border spinner-border-sm" /> Claiming...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Claim Today's Surprise <ArrowRight size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer: Expandable 7-Day Drop Schedule */}
        <div className="mt-3 pt-3 border-top border-secondary border-opacity-25 d-flex flex-wrap align-items-center justify-content-between gap-2">
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="btn btn-sm p-0 text-white-50 d-inline-flex align-items-center gap-1.5"
            style={{ fontSize: '0.8rem', background: 'none', border: 'none' }}
          >
            <Calendar size={14} className="text-warning" />
            <span className="text-decoration-underline">
              {showSchedule ? 'Hide 7-Day Drop Schedule' : 'View What Rewards Change Daily (7-Day Schedule)'}
            </span>
            {showSchedule ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>
            ⚡ 100% Guaranteed Daily Drop • Automatically rotates every 24h
          </span>
        </div>

        {/* Expanded Schedule Grid */}
        {showSchedule && (
          <div className="mt-3 pt-2">
            <div className="row g-2">
              {schedule.map((item) => {
                const isCurrent = item.dayOfWeek === dayOfWeek;
                return (
                  <div key={item.dayOfWeek} className="col-12 col-sm-6 col-md-4 col-lg">
                    <div
                      className="p-2.5 rounded-3 text-center h-100 transition-all"
                      style={{
                        background: isCurrent
                          ? 'linear-gradient(180deg, rgba(245, 158, 11, 0.2) 0%, rgba(20, 15, 45, 0.8) 100%)'
                          : 'rgba(255, 255, 255, 0.03)',
                        border: isCurrent
                          ? '1.5px solid #F59E0B'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: isCurrent ? '0 0 15px rgba(245, 158, 11, 0.2)' : 'none'
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span
                          className="fw-bold small"
                          style={{ color: isCurrent ? '#FBBF24' : '#94A3B8', fontSize: '0.72rem' }}
                        >
                          {item.dayName}
                        </span>
                        {isCurrent && (
                          <span
                            className="badge bg-warning text-dark fw-bold"
                            style={{ fontSize: '0.62rem', padding: '2px 6px' }}
                          >
                            TODAY
                          </span>
                        )}
                      </div>

                      <div className="my-1.5">{renderIcon(item.assetType, 36)}</div>

                      <div
                        className="fw-bold text-truncate text-white small"
                        style={{ fontSize: '0.75rem' }}
                        title={item.theme}
                      >
                        {item.theme}
                      </div>

                      <div
                        className="text-warning fw-semibold text-truncate small"
                        style={{ fontSize: '0.72rem' }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DailyRotatingDrop;
