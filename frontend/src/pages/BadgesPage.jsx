import React, { useState, useEffect } from 'react';
import { Award, Lock, CheckCircle2, Sparkles, X, ArrowRight } from 'lucide-react';
import { getBadges } from '../services/platformApi';
import Navbar from '../components/Navbar';
import LoadingState from '../components/LoadingState';

export const BadgesPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);

  useEffect(() => {
    const fetchAllBadges = async () => {
      try {
        const res = await getBadges();
        if (res && res.success) {
          setData(res);
        }
      } catch (err) {
        console.warn('Failed to load badges:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBadges();
  }, []);

  if (loading && !data) {
    return (
      <div>
        <Navbar />
        <LoadingState message="Loading your achievement gallery..." fullPage />
      </div>
    );
  }

  const badges = data?.badges || [];
  const stats = data?.stats || { total: 7, unlocked: 3, completionRate: 43 };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% -10%, #1e1346 0%, #0c0822 45%, #070514 100%)' }}>
      <Navbar />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
        {/* Header with Stats Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', color: '#FBBF24', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
              <Award size={14} /> VELoop Hall of Fame
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
              Achievements & Badges
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', margin: '0.35rem 0 0' }}>
              Unlock permanent accolades, earn bonus XP, and showcase your milestones.
            </p>
          </div>

          {/* Stats Bar */}
          <div style={{ display: 'flex', gap: '12px', background: 'rgba(20, 14, 46, 0.7)', padding: '12px 18px', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.25)' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>UNLOCKED</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10B981' }}>
                {stats.unlocked} <span style={{ fontSize: '0.9rem', color: '#64748B' }}>/ {stats.total}</span>
              </div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>COMPLETION</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FBBF24' }}>
                {stats.completionRate}%
              </div>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {badges.map((badge) => {
            const isUnlocked = badge.isUnlocked;

            return (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className="card-lift"
                style={{
                  background: isUnlocked
                    ? 'linear-gradient(145deg, rgba(28, 20, 68, 0.75) 0%, rgba(14, 9, 36, 0.85) 100%)'
                    : 'linear-gradient(145deg, rgba(16, 12, 34, 0.5) 0%, rgba(10, 7, 24, 0.7) 100%)',
                  border: isUnlocked
                    ? '1.5px solid rgba(245, 158, 11, 0.45)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: isUnlocked ? 1 : 0.65,
                  boxShadow: isUnlocked
                    ? '0 10px 30px rgba(0, 0, 0, 0.35), 0 0 20px rgba(245, 158, 11, 0.1)'
                    : 'none',
                  filter: isUnlocked ? 'none' : 'grayscale(0.65)'
                }}
              >
                {/* Top Badge strip */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: isUnlocked
                        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: isUnlocked
                        ? '1.5px solid rgba(245, 158, 11, 0.6)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.75rem',
                      boxShadow: isUnlocked ? '0 0 16px rgba(245, 158, 11, 0.3)' : 'none'
                    }}
                  >
                    {badge.icon}
                  </div>

                  <div>
                    {isUnlocked ? (
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: '999px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          color: '#34D399',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <CheckCircle2 size={12} /> Unlocked
                      </span>
                    ) : (
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: '999px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#94A3B8',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Lock size={12} /> Locked
                      </span>
                    )}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.35rem' }}>
                  {badge.title}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#94A3B8', margin: '0 0 1rem', lineHeight: 1.45 }}>
                  {badge.description}
                </p>

                {/* Progress bar or unlock status */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                  <span style={{ color: '#C4B5FD', fontWeight: 600 }}>+{badge.xpReward} XP</span>
                  <span style={{ color: '#94A3B8' }}>{badge.requirement}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Badge Detail Modal */}
        {selectedBadge && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(5, 3, 18, 0.85)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '16px'
            }}
            onClick={() => setSelectedBadge(null)}
          >
            <div
              className="card-lift"
              style={{
                background: 'linear-gradient(145deg, #1A123E 0%, #0E0924 100%)',
                border: selectedBadge.isUnlocked ? '2px solid #F59E0B' : '1.5px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                maxWidth: '420px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
                animation: 'toastSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedBadge(null)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94A3B8',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
                {selectedBadge.icon}
              </div>

              <div style={{ fontSize: '0.78rem', color: selectedBadge.isUnlocked ? '#FBBF24' : '#94A3B8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>
                {selectedBadge.category} • {selectedBadge.rarity}
              </div>

              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', margin: '0.3rem 0 0.5rem' }}>
                {selectedBadge.title}
              </h3>

              <p style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {selectedBadge.description}
              </p>

              <div style={{ background: 'rgba(10, 6, 26, 0.7)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1rem', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.86rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>Requirement:</span>
                  <strong style={{ color: '#FFFFFF' }}>{selectedBadge.requirement}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>XP Reward:</span>
                  <span style={{ color: '#A78BFA', fontWeight: 700 }}>+{selectedBadge.xpReward} XP</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Status:</span>
                  <span style={{ color: selectedBadge.isUnlocked ? '#10B981' : '#F59E0B', fontWeight: 800 }}>
                    {selectedBadge.isUnlocked ? '✓ Unlocked' : '🔒 Locked'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedBadge(null)}
                className="btn-press"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: selectedBadge.isUnlocked ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BadgesPage;
