import React from 'react';
import { Flame, Check, Sparkles, Trophy, Award } from 'lucide-react';

const DAYS_OF_WEEK = [
  { key: 'MON', label: 'MON', dayIndex: 1 },
  { key: 'TUE', label: 'TUE', dayIndex: 2 },
  { key: 'WED', label: 'WED', dayIndex: 3 },
  { key: 'THU', label: 'THU', dayIndex: 4 },
  { key: 'FRI', label: 'FRI', dayIndex: 5 },
  { key: 'SAT', label: 'SAT', dayIndex: 6 },
  { key: 'SUN', label: 'SUN', dayIndex: 7 }
];

export const WeeklyStreakBar = ({
  currentStreak = 7,
  longestStreak = 14,
  nextMilestone = '10 Days (+250 VEs)',
  activeDay = 7,
  onCheckInClick
}) => {
  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(26, 17, 60, 0.75) 0%, rgba(13, 9, 32, 0.9) 100%)',
        border: '1.2px solid rgba(245, 158, 11, 0.35)',
        borderRadius: '20px',
        padding: 'clamp(1rem, 2.5vw, 1.5rem)',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3), 0 0 25px rgba(245, 158, 11, 0.12)'
      }}
    >
      {/* Top Banner: Title and Streak Counters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.15rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.2) 100%)',
              border: '1.5px solid rgba(245, 158, 11, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.35)',
              flexShrink: 0
            }}
          >
            <Flame size={22} fill="#F59E0B" color="#F59E0B" />
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: '#FBBF24', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>
              DAILY CHECK-IN SYSTEM
            </div>
            <h3 style={{ fontSize: 'clamp(1.15rem, 3vw, 1.45rem)', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.01em' }}>
              🔥 {currentStreak} DAY STREAK
            </h3>
          </div>
        </div>

        {/* Milestone & Longest Streak Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '5px 12px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.75rem',
              color: '#CBD5E1',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Trophy size={13} color="#FBBF24" />
            <span>Longest: <strong style={{ color: '#FFFFFF' }}>{longestStreak}d</strong></span>
          </div>

          <div
            style={{
              padding: '5px 12px',
              borderRadius: '999px',
              background: 'rgba(139, 92, 246, 0.14)',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              fontSize: '0.75rem',
              color: '#C4B5FD',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Award size={13} color="#A78BFA" />
            <span>Next: <strong style={{ color: '#FFFFFF' }}>{nextMilestone}</strong></span>
          </div>
        </div>
      </div>

      {/* 7-Day Stepper Strip: MON ✓ TUE ✓ WED ✓ THU ✓ FRI ✓ SAT ✓ SUN ✓ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: 'clamp(4px, 1.2vw, 8px)',
          padding: 'clamp(8px, 1.5vw, 12px) clamp(6px, 1.2vw, 10px)',
          background: 'rgba(10, 6, 26, 0.7)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        {DAYS_OF_WEEK.map((item) => {
          // Completed if dayIndex <= currentStreak % 7 or if 7-day streak achieved
          const isDone = currentStreak >= 7 ? true : item.dayIndex <= (currentStreak % 7 || (currentStreak > 0 ? 7 : 0));
          const isToday = item.dayIndex === activeDay;

          return (
            <div
              key={item.key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(6px, 1.2vw, 10px) 2px',
                borderRadius: '12px',
                background: isDone
                  ? 'linear-gradient(145deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.12) 100%)'
                  : isToday
                  ? 'rgba(139, 92, 246, 0.18)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: isDone
                  ? '1.2px solid rgba(245, 158, 11, 0.55)'
                  : isToday
                  ? '1.5px solid #8B5CF6'
                  : '1px solid rgba(255, 255, 255, 0.06)',
                boxShadow: isDone ? '0 0 12px rgba(245, 158, 11, 0.25)' : isToday ? '0 0 14px rgba(139, 92, 246, 0.35)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span
                style={{
                  fontSize: 'clamp(0.62rem, 1.5vw, 0.74rem)',
                  fontWeight: 800,
                  color: isDone ? '#FBBF24' : isToday ? '#C4B5FD' : '#64748B',
                  letterSpacing: '0.03em',
                  marginBottom: '4px'
                }}
              >
                {item.label}
              </span>

              <div
                style={{
                  width: 'clamp(20px, 4.5vw, 26px)',
                  height: 'clamp(20px, 4.5vw, 26px)',
                  borderRadius: '50%',
                  background: isDone
                    ? '#F59E0B'
                    : isToday
                    ? 'rgba(139, 92, 246, 0.35)'
                    : 'rgba(255, 255, 255, 0.07)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                {isDone ? (
                  <Check size={14} strokeWidth={3} />
                ) : isToday ? (
                  <Flame size={13} color="#C4B5FD" />
                ) : (
                  <span style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: 700 }}>
                    {item.dayIndex}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyStreakBar;
