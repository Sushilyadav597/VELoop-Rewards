import React from 'react';
import { Flame, Sparkles } from 'lucide-react';

export const StreakLoader = () => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center p-5 min-vh-50"
      style={{ minHeight: '60vh' }}
    >
      {/* Glowing animated orb with fire flame */}
      <div className="position-relative mb-4">
        <div
          className="rounded-circle anim-glow-purple d-flex align-items-center justify-content-center"
          style={{
            width: '90px',
            height: '90px',
            background: 'linear-gradient(135deg, #1C134E 0%, #0F092A 100%)',
            border: '2px solid rgba(139, 92, 246, 0.5)'
          }}
        >
          <div className="anim-float">
            <Flame size={44} fill="#F59E0B" color="#F59E0B" />
          </div>
        </div>

        {/* Orbiting sparkle */}
        <div
          className="position-absolute top-0 end-0"
          style={{ animation: 'floatAnimation 2s infinite ease-in-out' }}
        >
          <Sparkles size={20} className="text-warning" />
        </div>
      </div>

      {/* Brand title */}
      <h3 className="h5 fw-bold text-white mb-2 tracking-wide">
        VELoop <span className="text-warning">Rewards</span>
      </h3>
      <p className="text-secondary small mb-3">
        Loading your streak...
      </p>

      {/* Sleek animated progress track */}
      <div
        style={{
          width: '180px',
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '999px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: '60%',
            height: '100%',
            background: 'linear-gradient(90deg, #8B5CF6 0%, #F59E0B 100%)',
            borderRadius: '999px',
            animation: 'shimmerEffect 1.5s infinite linear',
            backgroundSize: '200% 100%'
          }}
        />
      </div>
    </div>
  );
};

export default StreakLoader;
