import React from 'react';

export const CalendarHero = ({ size = 110, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="calBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient id="calTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="calCoin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <filter id="heroDrop" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Ambient background glow */}
      <circle cx="70" cy="70" r="55" fill="#8B5CF6" opacity="0.2" filter="url(#heroDrop)" />

      {/* Main 3D Calendar Body */}
      <g filter="url(#heroDrop)">
        {/* Calendar Page Base */}
        <rect
          x="30"
          y="26"
          width="74"
          height="82"
          rx="14"
          fill="url(#calBg)"
          stroke="#C4B5FD"
          strokeWidth="1.5"
        />

        {/* Top Header of Calendar */}
        <path
          d="M30 40 C30 32 36 26 44 26 L90 26 C98 26 104 32 104 40 L104 48 L30 48 Z"
          fill="url(#calTop)"
        />

        {/* Rings at top */}
        <rect x="46" y="20" width="6" height="12" rx="3" fill="#D97706" stroke="#FEF3C7" strokeWidth="1" />
        <rect x="82" y="20" width="6" height="12" rx="3" fill="#D97706" stroke="#FEF3C7" strokeWidth="1" />

        {/* Golden Checkmark Inside Calendar */}
        <path
          d="M48 72 L60 84 L88 56"
          stroke="#F59E0B"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M48 72 L60 84 L88 56"
          stroke="#FEF3C7"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Floating Gold Coin Left */}
      <g transform="translate(14, 72) rotate(-15)">
        <ellipse cx="14" cy="14" rx="14" ry="14" fill="url(#calCoin)" stroke="#FFFBEB" strokeWidth="1.5" />
        <ellipse cx="14" cy="14" rx="10" ry="10" fill="none" stroke="#FEF3C7" strokeWidth="1.2" />
        <text x="10" y="18" fill="#FFFBEB" fontSize="11" fontWeight="bold" fontFamily="sans-serif">₹</text>
      </g>

      {/* Floating Gift Box Right */}
      <g transform="translate(98, 70) rotate(12)">
        <rect x="0" y="8" width="24" height="20" rx="3" fill="#7C3AED" stroke="#C4B5FD" strokeWidth="0.8" />
        <rect x="0" y="4" width="24" height="6" rx="2" fill="#9333EA" />
        <rect x="9" y="4" width="6" height="24" fill="#FBBF24" />
        <path d="M12 4 C8 -1 5 1 10 4 Z" fill="#FDE68A" />
        <path d="M12 4 C16 -1 19 1 14 4 Z" fill="#FDE68A" />
      </g>

      {/* Sparkles */}
      <circle cx="28" cy="20" r="2" fill="#FBBF24" />
      <circle cx="114" cy="28" r="2.5" fill="#FBBF24" />
      <path d="M112 18 L114 22 L118 23 L114 24 L112 28 L110 24 L106 23 L110 22 Z" fill="#FFFBEB" opacity="0.95" />
    </svg>
  );
};

export default CalendarHero;
