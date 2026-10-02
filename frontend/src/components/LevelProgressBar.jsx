import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Star, ArrowRight } from 'lucide-react';

export const LevelProgressBar = ({ level = 5, xp = 7200, xpNeeded = 10000, progressPercent = 72 }) => {
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [celebratedLevel, setCelebratedLevel] = useState(level);

  const triggerLevelUp = (newLevel) => {
    setCelebratedLevel(newLevel);
    setShowLevelUpModal(true);
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#8B5CF6', '#10B981', '#3B82F6']
      });
    } catch {}
  };

  const nextLevel = level + 1;

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(25, 18, 58, 0.6) 0%, rgba(13, 9, 32, 0.8) 100%)',
        border: '1.2px solid rgba(139, 92, 246, 0.25)',
        borderRadius: '18px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
      }}
    >
      {/* Top row: Current Level & Next Level */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 0 12px rgba(139, 92, 246, 0.4)'
            }}
          >
            <Star size={18} fill="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#A78BFA', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>
              CURRENT TIER
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF' }}>
              LEVEL {level}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            NEXT MILESTONE
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
            <span>LEVEL {nextLevel}</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '10px',
          borderRadius: '999px',
          background: 'rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: `${Math.min(100, progressPercent)}%`,
            height: '100%',
            borderRadius: '999px',
            background: 'linear-gradient(90deg, #8B5CF6 0%, #A855F7 50%, #F59E0B 100%)',
            boxShadow: '0 0 14px rgba(168, 85, 247, 0.6)',
            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </div>

      {/* Progress text and percentage */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.82rem', color: '#CBD5E1' }}>
        <span>
          <strong style={{ color: '#FFFFFF' }}>{xp.toLocaleString()}</strong> / {xpNeeded.toLocaleString()} XP
        </span>
        <span style={{ fontWeight: 700, color: '#A78BFA' }}>
          {progressPercent}% to next level
        </span>
      </div>

      {/* Level Up Celebration Modal */}
      {showLevelUpModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(5, 3, 18, 0.85)',
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
              background: 'linear-gradient(145deg, #1C1242 0%, #0E0924 100%)',
              border: '2px solid #8B5CF6',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              maxWidth: '420px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(139, 92, 246, 0.4)',
              animation: 'toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: '0.4rem', animation: 'floatAnimation 3s ease-in-out infinite' }}>
              ⭐
            </div>

            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
              MILESTONE ACHIEVED
            </div>

            <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
              🎉 LEVEL UP!
            </h3>

            <div
              style={{
                margin: '1.25rem 0',
                padding: '1.25rem',
                background: 'rgba(139, 92, 246, 0.12)',
                borderRadius: '16px',
                border: '1px solid rgba(139, 92, 246, 0.35)'
              }}
            >
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FBBF24' }}>
                Welcome to Level {celebratedLevel}
              </div>
              <div style={{ color: '#CBD5E1', fontSize: '0.88rem', marginTop: '4px' }}>
                You have unlocked enhanced reward tiers and higher voucher pools.
              </div>
            </div>

            <button
              onClick={() => setShowLevelUpModal(false)}
              className="btn-press"
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)'
              }}
            >
              Continue Earning
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelProgressBar;
