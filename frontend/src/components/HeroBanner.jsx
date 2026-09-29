import React from 'react';
import { Flame, Calendar, ChevronRight } from 'lucide-react';
import CalendarHero from '../assets/CalendarHero';
import GiftBox from '../assets/GiftBox';

export const HeroBanner = ({ streak, onOpenHistory }) => {
  const currentStreakDays = streak?.currentStreak ?? 1;

  return (
    <div className="mb-3 mb-md-4">
      {/* Main Hero Card Container */}
      <div
        className="card border-0 overflow-hidden position-relative hover-lift anim-shine"
        style={{
          background: 'linear-gradient(135deg, #181045 0%, #110a2e 50%, #0a061c 100%)',
          borderRadius: '22px',
          border: '1.2px solid rgba(139, 92, 246, 0.4)',
          boxShadow: '0 16px 45px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
        }}
      >
        {/* Ambient background glow orbs */}
        <div
          className="position-absolute"
          style={{
            width: '260px',
            height: '260px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)',
            top: '-50px',
            left: '-20px',
            pointerEvents: 'none'
          }}
        />
        <div
          className="position-absolute"
          style={{
            width: '240px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, transparent 70%)',
            bottom: '-40px',
            right: '-20px',
            pointerEvents: 'none'
          }}
        />

        <div className="card-body p-3 p-md-4 position-relative z-1">
          <div className="row align-items-center justify-content-between g-2 g-md-3">
            {/* Left Column: 3D Calendar Hero Illustration */}
            <div className="col-auto col-md-auto text-start d-flex justify-content-start">
              <div
                className="anim-float"
                style={{
                  transformOrigin: 'center bottom',
                  filter: 'drop-shadow(0 6px 16px rgba(139, 92, 246, 0.35))'
                }}
              >
                <CalendarHero size={92} className="d-none d-sm-block" />
                <CalendarHero size={74} className="d-block d-sm-none" />
              </div>
            </div>

            {/* Middle Column: Hero Titles & Description */}
            <div className="col text-center px-1 px-md-3">
              <h2
                className="fw-extrabold mb-1 text-white tracking-tight"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.2rem, 3.4vw, 1.75rem)',
                  lineHeight: '1.2'
                }}
              >
                Login Daily &amp; Earn <br />
                <span
                  style={{
                    background: 'linear-gradient(90deg, #FFFBEB 0%, #FDE68A 25%, #FBBF24 60%, #F59E0B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 2px 10px rgba(245, 158, 11, 0.35))'
                  }}
                >
                  Bigger Rewards!
                </span>
              </h2>
              <p
                className="small mb-0 mx-auto"
                style={{
                  color: '#94A3B8',
                  fontSize: 'clamp(0.74rem, 1.8vw, 0.86rem)',
                  maxWidth: '380px',
                  lineHeight: '1.4'
                }}
              >
                Maintain your streak and unlock exciting rewards every day.
              </p>
            </div>

            {/* Right Column: 3D Gift Box Illustration */}
            <div className="col-auto col-md-auto text-end d-flex justify-content-end">
              <div
                className="anim-float"
                style={{
                  animationDelay: '1.8s',
                  transformOrigin: 'center bottom',
                  filter: 'drop-shadow(0 6px 16px rgba(245, 158, 11, 0.35))'
                }}
              >
                <GiftBox size={86} className="d-none d-sm-block" />
                <GiftBox size={70} className="d-block d-sm-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row of 2 Distinct Streak Action Pills (matching Page 63 directly below Hero) */}
      <div className="d-flex align-items-center justify-content-between gap-2 mt-2 mt-md-3">
        {/* Left: Amber Streak Pill */}
        <div
          className="d-flex align-items-center gap-2 px-3 py-1.5 hover-lift"
          style={{
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.16) 0%, rgba(217, 119, 6, 0.25) 100%)',
            border: '1.2px solid rgba(245, 158, 11, 0.55)',
            borderRadius: '999px',
            boxShadow: '0 0 16px rgba(245, 158, 11, 0.15)'
          }}
        >
          <Flame size={16} fill="#F59E0B" color="#F59E0B" style={{ filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.6))' }} />
          <span className="fw-bold text-warning small" style={{ fontSize: '0.84rem' }}>
            {currentStreakDays} Day Streak
          </span>
        </div>

        {/* Right: Purple Streak Calendar Button */}
        <button
          onClick={onOpenHistory}
          className="btn btn-sm d-flex align-items-center gap-1.5 px-3 py-1.5 border-0 hover-lift"
          style={{
            background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.18) 0%, rgba(99, 102, 241, 0.25) 100%)',
            border: '1.2px solid rgba(139, 92, 246, 0.45)',
            borderRadius: '999px',
            color: '#C4B5FD',
            fontSize: '0.84rem',
            boxShadow: '0 0 14px rgba(139, 92, 246, 0.15)'
          }}
        >
          <Calendar size={14} className="text-purple-300" />
          <span className="fw-semibold">Streak Calendar</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
