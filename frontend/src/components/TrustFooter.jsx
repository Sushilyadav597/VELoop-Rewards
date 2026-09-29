import React from 'react';
import { ChevronRight } from 'lucide-react';

export const TrustFooter = () => {
  return (
    <footer className="pt-2 pb-5 mb-4">
      <div
        className="d-flex align-items-center justify-content-between p-3 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #160e3a 0%, #0e0826 100%)',
          border: '1.2px solid rgba(139, 92, 246, 0.28)',
          borderRadius: '16px',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Left Side: Hexagon VR Badge + Official Domain */}
        <div className="d-flex align-items-center gap-2.5">
          {/* Hexagonal VR Icon Badge */}
          <div
            className="d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%)',
              border: '1.5px solid rgba(245, 158, 11, 0.45)',
              borderRadius: '10px'
            }}
          >
            <span
              className="fw-extrabold text-warning"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.82rem',
                letterSpacing: '0.5px'
              }}
            >
              VR
            </span>
          </div>

          <div>
            <span
              className="d-block text-white fw-bold"
              style={{ fontSize: 'clamp(0.76rem, 1.8vw, 0.84rem)', letterSpacing: '0.2px' }}
            >
              Official rewards only on VeLoopRewards.in
            </span>
            <span
              style={{ color: '#94A3B8', fontSize: 'clamp(0.68rem, 1.5vw, 0.74rem)' }}
            >
              Stay active, stay rewarded!
            </span>
          </div>
        </div>

        {/* Right Arrow */}
        <div className="text-secondary ps-2 flex-shrink-0">
          <ChevronRight size={18} color="#A78BFA" />
        </div>
      </div>
    </footer>
  );
};

export default TrustFooter;

