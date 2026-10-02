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
        background: 'linear-gradient(145deg, rgba(26, 17, 60, 0.7) 0%, rgba(13, 9, 32, 0.85) 100%)',
        border: '1.2px solid rgba(245, 158, 11, 0.35)',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3), 0 0 25px rgba(245, 158, 11, 0.12)'
      }}
    >
      {/* Top Banner: Title and Streak Counters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.2) 100%)',
              border: '1.5px solid rgba(245, 158, 11, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.35)'
            }}
          >
            <Flame size={24} fill="#F59E0B" color="#F59E0B" />
          </div>

          <div>
            <div style={{ fontSize: '0.74rem', color: '#FBBF24', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>
              DAILY CHECK-IN SYSTEM
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.01em' }}>
              🔥 {currentStreak} DAY STREAK
            </h3>
          </div>
        </div>

        {/* Milestone & Longest Streak Pills */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.78rem',
              color: '#CBD5E1',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Trophy size={14} color="#FBBF24" />
            <span>Longest: <strong style={{ color: '#FFFFFF' }}>{longestStreak} Days</strong></span>
          </div>

          <div
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(139, 92, 246, 0.12)',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              fontSize: '0.78rem',
              color: '#C4B5FD',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Award size={14} color="#A78BFA" />
            <span>Next: <strong style={{ color: '#FFFFFF' }}>{nextMilestone}</strong></span>
          </div>
        </div>
      </div>

      {/* 7-Day Stepper Strip: MON ✓ TUE ✓ WED ✓ THU ✓ FRI ✓ SAT ✓ SUN ✓ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          padding: '12px 8px',
          background: 'rgba(10, 6, 26, 0.65)',
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
                padding: '10px 4px',
                borderRadius: '12px',
                background: isDone
                  ? 'linear-gradient(145deg, rgba(245, 158, 11, 0.18) 0%, rgba(217, 119, 6, 0.1) 100%)'
                  : isToday
                  ? 'rgba(139, 92, 246, 0.15)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: isDone
                  ? '1.2px solid rgba(245, 158, 11, 0.5)'
                  : isToday
                  ? '1.2px solid #8B5CF6'
                  : '1px solid rgba(255, 255, 255, 0.06)',
                boxShadow: isDone ? '0 0 12px rgba(245, 158, 11, 0.2)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: isDone ? '#FBBF24' : isToday ? '#A78BFA' : '#64748B',
                  letterSpacing: '0.04em',
                  marginBottom: '6px'
                }}
              >
                {item.label}
              </span>

              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isDone
                    ? '#F59E0B'
                    : isToday
                    ? 'rgba(139, 92, 246, 0.3)'
                    : 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                {isDone ? (
                  <Check size={16} strokeWidth={3} />
                ) : isToday ? (
                  <Flame size={14} color="#A78BFA" />
                ) : (
                  <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>
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
