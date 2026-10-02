import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Sparkles, User, Flame } from 'lucide-react';
import { getLeaderboard } from '../services/platformApi';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LoadingState from '../components/LoadingState';

export const LeaderboardPage = () => {
  const { user, wallet } = useAuth();
  const [timeframe, setTimeframe] = useState('weekly');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getLeaderboard(timeframe);
        if (res && res.success) {
          setData(res);
        }
      } catch (e) {
        console.warn('Leaderboard fetch error:', e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeframe]);

  if (loading && !data) {
    return (
      <div>
        <Navbar />
        <LoadingState message="Loading leaderboard rankings..." fullPage />
      </div>
    );
  }

  const podium = data?.podium || [];
  const leaders = data?.leaders || [];
  const currentUser = data?.currentUser;

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% -10%, #1e1346 0%, #0c0822 45%, #070514 100%)' }}>
      <Navbar />

      <main style={{ maxWidth: '1080px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', color: '#FBBF24', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
            <Trophy size={14} /> Global Rewards Standings
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            Community Leaderboard
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginTop: '0.4rem', maxWidth: '520px', margin: '0.4rem auto 0' }}>
            Compete with members worldwide. Earn points from streaks, tasks, and booster drops to climb the tiers.
          </p>

          {/* Timeframe Filter Buttons */}
          <div style={{ display: 'inline-flex', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '1.5rem' }}>
            <button
              onClick={() => setTimeframe('weekly')}
              className="btn-press"
              style={{
                padding: '8px 20px',
                borderRadius: '9px',
                border: 'none',
                background: timeframe === 'weekly' ? 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' : 'transparent',
                color: timeframe === 'weekly' ? '#FFFFFF' : '#94A3B8',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer'
              }}
            >
              Weekly Sprint
            </button>
            <button
              onClick={() => setTimeframe('alltime')}
              className="btn-press"
              style={{
                padding: '8px 20px',
                borderRadius: '9px',
                border: 'none',
                background: timeframe === 'alltime' ? 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' : 'transparent',
                color: timeframe === 'alltime' ? '#FFFFFF' : '#94A3B8',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer'
              }}
            >
              All-Time Legends
            </button>
          </div>
        </div>

        {/* 🥇 🥈 🥉 TOP 3 PODIUM PRESENTATION */}
        {podium.length >= 3 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              alignItems: 'flex-end',
              marginBottom: '3rem',
              maxWidth: '820px',
              margin: '0 auto 3rem'
            }}
          >
            {/* Rank 2 (Silver) */}
            <div
              className="card-lift"
              style={{
                background: 'linear-gradient(145deg, rgba(203, 213, 225, 0.1) 0%, rgba(13, 9, 32, 0.9) 100%)',
                border: '1.5px solid rgba(203, 213, 225, 0.4)',
                borderRadius: '20px',
                padding: '1.5rem 1rem',
                textAlign: 'center',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
                order: 1
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>🥈</div>
              <img
                src={podium[1].avatar}
                alt={podium[1].name}
                style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #CBD5E1', margin: '0 auto 0.5rem', objectFit: 'cover' }}
              />
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {podium[1].name}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginBottom: '0.5rem' }}>
                Level {podium[1].level}
              </div>
              <div style={{ background: 'rgba(203, 213, 225, 0.15)', border: '1px solid rgba(203, 213, 225, 0.3)', borderRadius: '999px', padding: '4px 10px', display: 'inline-block', fontWeight: 900, color: '#E2E8F0', fontSize: '0.88rem' }}>
                {podium[1].points.toLocaleString()} 🪙
              </div>
            </div>

            {/* Rank 1 (Gold - Taller Podium Center) */}
            <div
              className="card-lift"
              style={{
                background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.18) 0%, rgba(18, 11, 46, 0.95) 100%)',
                border: '2px solid #F59E0B',
                borderRadius: '24px',
                padding: '2rem 1.25rem',
                textAlign: 'center',
                boxShadow: '0 20px 45px rgba(245, 158, 11, 0.25), 0 0 35px rgba(245, 158, 11, 0.2)',
                order: 2,
                transform: 'scale(1.05)',
                zIndex: 2
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.2rem', animation: 'floatAnimation 3.5s ease-in-out infinite' }}>🥇</div>
              <img
                src={podium[0].avatar}
                alt={podium[0].name}
                style={{ width: '68px', height: '68px', borderRadius: '50%', border: '2.5px solid #F59E0B', margin: '0 auto 0.5rem', objectFit: 'cover' }}
              />
              <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {podium[0].name}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#FBBF24', fontWeight: 700, marginBottom: '0.6rem' }}>
                Level {podium[0].level} • 28d Streak 🔥
              </div>
              <div style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', borderRadius: '999px', padding: '6px 14px', display: 'inline-block', fontWeight: 900, color: '#FFFFFF', fontSize: '1rem', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)' }}>
                {podium[0].points.toLocaleString()} 🪙
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div
              className="card-lift"
              style={{
                background: 'linear-gradient(145deg, rgba(217, 119, 6, 0.1) 0%, rgba(13, 9, 32, 0.9) 100%)',
                border: '1.5px solid rgba(217, 119, 6, 0.4)',
                borderRadius: '20px',
                padding: '1.5rem 1rem',
                textAlign: 'center',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
                order: 3
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>🥉</div>
              <img
                src={podium[2].avatar}
                alt={podium[2].name}
                style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #D97706', margin: '0 auto 0.5rem', objectFit: 'cover' }}
              />
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {podium[2].name}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginBottom: '0.5rem' }}>
                Level {podium[2].level}
              </div>
              <div style={{ background: 'rgba(217, 119, 6, 0.15)', border: '1px solid rgba(217, 119, 6, 0.3)', borderRadius: '999px', padding: '4px 10px', display: 'inline-block', fontWeight: 900, color: '#FBBF24', fontSize: '0.88rem' }}>
                {podium[2].points.toLocaleString()} 🪙
              </div>
            </div>
          </div>
        )}

        {/* Current User Row Highlight */}
        {currentUser && (
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.22) 0%, rgba(18, 12, 44, 0.95) 100%)',
              border: '2px solid #8B5CF6',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 8px 30px rgba(139, 92, 246, 0.3)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  color: '#FFFFFF'
                }}
              >
                #{currentUser.rank}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#FFFFFF' }}>
                    {user?.name || 'You (Current User)'}
                  </span>
                  <span style={{ padding: '2px 8px', borderRadius: '999px', background: '#8B5CF6', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800 }}>
                    YOU
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#A78BFA' }}>
                  Level {currentUser.level} • {currentUser.percentile} of all reward hunters
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FBBF24' }}>
                {wallet ? (wallet.vesBalance ?? currentUser.points).toLocaleString() : currentUser.points.toLocaleString()} 🪙
              </div>
              <div style={{ fontSize: '0.74rem', color: '#34D399', fontWeight: 700 }}>
                {currentUser.change} positions this week ↑
              </div>
            </div>
          </div>
        )}

        {/* Full Ranked Table */}
        <div
          style={{
            background: 'linear-gradient(145deg, rgba(20, 14, 46, 0.7) 0%, rgba(10, 7, 26, 0.85) 100%)',
            border: '1.2px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.35)'
          }}
        >
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Ranked Participants
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
              Resets every Sunday at 00:00 UTC
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Rank</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Member</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Level</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Streak</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Total Points</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((item) => (
                <tr
                  key={item.rank}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ fontWeight: 800, color: item.rank <= 3 ? '#FBBF24' : '#94A3B8', fontSize: '0.95rem' }}>
                      #{item.rank}
                    </span>
                  </td>

                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={item.avatar}
                        alt={item.name}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFFFFF' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                          {item.badge}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.88rem', color: '#CBD5E1', fontWeight: 600 }}>
                    Lvl {item.level}
                  </td>

                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.88rem', color: '#F59E0B', fontWeight: 700 }}>
                    🔥 {item.streak}d
                  </td>

                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right', fontWeight: 800, color: '#FBBF24', fontSize: '1rem' }}>
                    {item.points.toLocaleString()} 🪙
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;
