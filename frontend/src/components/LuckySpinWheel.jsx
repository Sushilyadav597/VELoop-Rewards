import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw, Gem, Clock, CheckCircle } from 'lucide-react';
import { getSpinStatus, executeSpin } from '../services/platformApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LuckySpinWheel = ({ onPointsEarned, onOpenWallet }) => {
  const { wallet, refreshWallet } = useAuth();
  const toast = useToast();

  const [spinStatus, setSpinStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [winningReward, setWinningReward] = useState(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const wheelRef = useRef(null);

  const fetchStatus = async () => {
    try {
      const data = await getSpinStatus();
      if (data && data.success) {
        setSpinStatus(data);
      }
    } catch (err) {
      console.warn('Spin status fetch failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const segments = spinStatus?.segments || [
    { index: 0, label: '25 VEs', amount: 25, currency: 'VES', color: '#8B5CF6', icon: '🪙' },
    { index: 1, label: '50 VEs', amount: 50, currency: 'VES', color: '#6366F1', icon: '🪙' },
    { index: 2, label: '₹10 Amazon', amount: 10, currency: 'INR', color: '#F59E0B', icon: '🎟️' },
    { index: 3, label: '10 VEs', amount: 10, currency: 'VES', color: '#10B981', icon: '🪙' },
    { index: 4, label: '100 VEs', amount: 100, currency: 'VES', color: '#EC4899', icon: '💎' },
    { index: 5, label: '20 Gems', amount: 20, currency: 'GEMS', color: '#3B82F6', icon: '💎' },
    { index: 6, label: '₹25 Voucher', amount: 25, currency: 'INR', color: '#EAB308', icon: '🎟️' },
    { index: 7, label: '250 Jackpot', amount: 250, currency: 'VES', color: '#A855F7', icon: '👑' }
  ];

  const numSegments = segments.length;
  const segmentAngle = 360 / numSegments;

  const handleSpinClick = async (useGems = false) => {
    if (isSpinning) return;
    setErrorMsg(null);
    setIsSpinning(true);

    try {
      // 1. Authoritative request to backend
      const res = await executeSpin({ useGems });
      if (!res || !res.success) {
        throw new Error(res?.message || 'Failed to execute spin');
      }

      const { winningIndex, reward, nextFreeSpinAt } = res;

      // 2. Physics-based calculation: spin at least 5-6 full turns, and land precisely on winning segment
      // Top pointer points at 270 deg or 90 deg. With standard rotation where pointer is at top (270 deg / -90 deg):
      const extraRounds = 360 * 5;
      const targetSegmentCenter = winningIndex * segmentAngle + segmentAngle / 2;
      // We want targetSegmentCenter to rotate to top pointer (270 degrees)
      const targetAngle = extraRounds + (360 - targetSegmentCenter) + 270;
      const finalAngle = rotationAngle + (360 - (rotationAngle % 360)) + targetAngle;

      setRotationAngle(finalAngle);

      // 3. Wait for wheel rotation animation to complete (4.2 seconds)
      setTimeout(() => {
        setIsSpinning(false);
        setWinningReward(reward);
        setShowWinModal(true);

        // Celebration Confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F59E0B', '#8B5CF6', '#10B981', '#EC4899']
          });
        } catch {}

        // Toast feedback
        toast.reward(reward.amount, reward.currency, `🎉 YOU WON! ${reward.label}`);

        // Callback & wallet update
        if (onPointsEarned) {
          onPointsEarned(reward.amount, reward.currency);
        }
        refreshWallet();
        fetchStatus();
      }, 4200);
    } catch (err) {
      setIsSpinning(false);
      const msg = err.message || 'Error occurred while spinning. Please try again.';
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  const canFreeSpin = spinStatus?.canFreeSpin ?? true;
  const canGemSpin = (wallet?.gemsBalance || 0) >= (spinStatus?.costPerGemSpin || 10);

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(20, 14, 48, 0.7) 0%, rgba(12, 8, 30, 0.9) 100%)',
        border: '1.5px solid rgba(139, 92, 246, 0.28)',
        borderRadius: '24px',
        padding: '2rem 1.5rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', color: '#FBBF24', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
          <Sparkles size={14} /> VELoop Daily Lucky Spin
        </div>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
          Spin & Win Big Rewards
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.92rem', marginTop: '0.35rem', maxWidth: '480px', margin: '0.35rem auto 0' }}>
          1 Free Spin every 24 hours. Extra spins available with Gems. All winnings are verified and credited instantly to your vault.
        </p>
      </div>

      {errorMsg && (
        <div style={{ maxWidth: '420px', margin: '0 auto 1.5rem', padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', color: '#FCA5A5', fontSize: '0.86rem', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}

      {/* Wheel Stage Container */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {/* Pointer Pin (Top) */}
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            zIndex: 30,
            filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.6))'
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '16px solid transparent',
              borderRight: '16px solid transparent',
              borderTop: '32px solid #F59E0B'
            }}
          />
        </div>

        {/* The Rotating Wheel */}
        <div
          style={{
            position: 'relative',
            width: 'clamp(280px, 75vw, 360px)',
            height: 'clamp(280px, 75vw, 360px)',
            borderRadius: '50%',
            padding: '8px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.6) 0%, rgba(139, 92, 246, 0.8) 100%)',
            boxShadow: '0 0 40px rgba(139, 92, 246, 0.35), inset 0 0 20px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div
            ref={wheelRef}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'relative',
              overflow: 'hidden',
              transform: `rotate(${rotationAngle}deg)`,
              transition: isSpinning ? 'transform 4.2s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
              boxShadow: 'inset 0 0 25px rgba(0, 0, 0, 0.8)'
            }}
          >
            {/* SVG Wheel Segments */}
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              {segments.map((seg, idx) => {
                const angle = idx * segmentAngle;
                const nextAngle = (idx + 1) * segmentAngle;
                const x1 = 50 + 50 * Math.cos((Math.PI * angle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * angle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * nextAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * nextAngle) / 180);

                const d = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                return (
                  <path
                    key={seg.id || idx}
                    d={d}
                    fill={seg.color}
                    stroke="rgba(255, 255, 255, 0.18)"
                    strokeWidth="0.8"
                  />
                );
              })}
            </svg>

            {/* Segment Labels Overlay */}
            {segments.map((seg, idx) => {
              const midAngle = idx * segmentAngle + segmentAngle / 2;
              return (
                <div
                  key={`label-${idx}`}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '50%',
                    height: '24px',
                    marginTop: '-12px',
                    transformOrigin: '0% 50%',
                    transform: `rotate(${midAngle}deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '18px',
                    pointerEvents: 'none'
                  }}
                >
                  <span
                    style={{
                      transform: 'rotate(90deg)',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                      letterSpacing: '0.02em',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {seg.icon} {seg.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Center Hub & Action Button */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '82px',
              height: '82px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #2A1B6A 0%, #110B29 100%)',
              border: '3px solid #F59E0B',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20
            }}
          >
            <button
              onClick={() => handleSpinClick(false)}
              disabled={isSpinning || (!canFreeSpin && !canGemSpin)}
              className="btn-press"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                cursor: isSpinning || (!canFreeSpin && !canGemSpin) ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px'
              }}
              aria-label="Spin the lucky rewards wheel"
            >
              <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isSpinning ? 'SPINNING' : 'SPIN'}
              </span>
              <span style={{ fontSize: '0.62rem', color: '#E2E8F0', fontWeight: 700 }}>
                {canFreeSpin ? 'FREE' : '10 GEMS'}
              </span>
            </button>
          </div>
        </div>

        {/* Action Controls & Cooldown Details */}
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', width: '100%', maxWidth: '380px' }}>
          <button
            onClick={() => handleSpinClick(false)}
            disabled={isSpinning || (!canFreeSpin && !canGemSpin)}
            className="btn-press"
            style={{
              width: '100%',
              padding: '14px 24px',
              borderRadius: '14px',
              border: 'none',
              background: canFreeSpin
                ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                : canGemSpin
                ? 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1rem',
              boxShadow: canFreeSpin ? '0 8px 24px rgba(245, 158, 11, 0.35)' : 'none',
              cursor: isSpinning || (!canFreeSpin && !canGemSpin) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {isSpinning ? (
              <>⏳ Wheel is Spinning...</>
            ) : canFreeSpin ? (
              <>⚡ [ SPIN NOW — FREE ]</>
            ) : canGemSpin ? (
              <>
                <Gem size={18} /> Spin Again (10 Gems)
              </>
            ) : (
              <>
                <Clock size={18} /> Daily Free Spin Claimed
              </>
            )}
          </button>

          {!canFreeSpin && spinStatus?.nextFreeSpinAt && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '0.82rem' }}>
              <Clock size={14} color="#F59E0B" />
              <span>Next Free Spin Available in ~24h</span>
            </div>
          )}
        </div>
      </div>

      {/* 🎉 YOU WON! Celebration Modal */}
      {showWinModal && winningReward && (
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
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem', animation: 'floatAnimation 3s ease-in-out infinite' }}>
              🎉
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
              LUCKY SPIN REWARD
            </div>

            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
              YOU WON!
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
                +{winningReward.amount} {winningReward.currency}
              </div>
              <div style={{ color: '#CBD5E1', fontSize: '0.88rem', marginTop: '4px' }}>
                {winningReward.label}
              </div>
            </div>

            <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Your reward has been cryptographically recorded and deposited directly into your VELoop wallet.
            </p>

            <button
              onClick={() => setShowWinModal(false)}
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
              Continue Playing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckySpinWheel;
