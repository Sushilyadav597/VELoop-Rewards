import React from 'react';
import { Flame, Calendar, ChevronRight } from 'lucide-react';
import CalendarHero from '../assets/CalendarHero';

export const HeroBanner = ({ streak, onOpenHistory }) => {
  const currentStreakDays = streak?.currentStreak ?? 1;

  return (
    <div
      className="card border-0 mb-4 overflow-hidden position-relative"
      style={{
        background: 'linear-gradient(135deg, #18113c 0%, #110c2e 50%, #0a071c 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(139, 92, 246, 0.28)',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45)'
      }}
    >
      {/* Background ambient lighting */}
      <div
        className="position-absolute"
        style={{
          width: '260px',
          height: '260px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, transparent 70%)',
          top: '-60px',
          left: '20px',
          pointerEvents: 'none'
        }}
      />
      <div
        className="position-absolute"
        style={{
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
          bottom: '-50px',
          right: '50px',
          pointerEvents: 'none'
        }}
      />

      <div className="card-body p-3 p-md-4">
        <div className="row align-items-center g-3">
          {/* Left Column: 3D Calendar Hero Illustration */}
          <div className="col-12 col-md-auto text-center text-md-start d-flex justify-content-center">
            <div className="anim-float">
              <CalendarHero size={110} />
            </div>
          </div>

          {/* Middle/Center Column: Hero Titles */}
          <div className="col-12 col-md text-center text-md-start">
            <h2 className="h4 h3-md fw-bold mb-1 text-white">
              Daily Check-In{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Rewards
              </span>
            </h2>
            <p className="text-secondary small mb-2 mb-md-0" style={{ maxWidth: '440px' }}>
              Check in every day and earn exciting rewards! Maintain your streak to unlock the ultimate gift.
            </p>
          </div>

          {/* Right Column: Streak Badges */}
          <div className="col-12 col-md-auto d-flex flex-row flex-md-column justify-content-center align-items-center align-items-md-end gap-2">
            {/* Streak Pill */}
            <div
              className="d-flex align-items-center gap-2 px-3 py-2"
              style={{
                background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.18) 0%, rgba(217, 119, 6, 0.28) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '12px'
              }}
            >
              <Flame size={18} fill="#F59E0B" color="#F59E0B" />
              <div>
                <div className="fw-bold text-warning small line-height-1">
                  {currentStreakDays} Day Streak
                </div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                  Keep it going!
                </div>
              </div>
            </div>

            {/* Streak Calendar / History Button */}
            <button
              onClick={onOpenHistory}
              className="btn btn-sm d-flex align-items-center gap-1 text-secondary px-3 py-1 border-0"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderRadius: '8px',
                fontSize: '0.78rem'
              }}
            >
              <Calendar size={13} className="text-info" />
              <span>Streak Calendar</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
