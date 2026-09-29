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
        {/* Soft atmospheric glow */}
        <filter id="calGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="calSheet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="calHeaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333EA" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <linearGradient id="coinGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Atmospheric purple glow backdrop */}
      <circle cx="70" cy="70" r="50" fill="#8B5CF6" opacity="0.25" filter="url(#calGlow)" />

      {/* 3D Tilted Calendar Block */}
      <g transform="rotate(-6 70 70)">
        {/* Calendar Drop Shadow */}
        <rect x="30" y="28" width="80" height="84" rx="18" fill="#000000" opacity="0.35" />

        {/* White Calendar Page Body */}
        <rect
          x="28"
          y="24"
          width="80"
          height="84"
          rx="18"
          fill="url(#calSheet)"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />

        {/* Top Purple Binding Header */}
        <path
          d="M28 42 C28 32 36 24 46 24 L90 24 C100 24 108 32 108 42 L108 48 L28 48 Z"
          fill="url(#calHeaderGrad)"
        />

        {/* Golden Ring Clips at Top */}
        <rect x="44" y="16" width="8" height="16" rx="4" fill="url(#coinGoldGrad)" stroke="#FFFBEB" strokeWidth="1" />
        <rect x="84" y="16" width="8" height="16" rx="4" fill="url(#coinGoldGrad)" stroke="#FFFBEB" strokeWidth="1" />

        {/* Big Golden 3D Checkmark Inside Calendar */}
        <path
          d="M48 72 L62 86 L90 56"
          stroke="#B45309"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M48 71 L62 85 L90 55"
          stroke="url(#checkGrad)"
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M48 70 L62 84 L90 54"
          stroke="#FFFBEB"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Floating 3D Gold Coin on Left */}
      <g transform="translate(12, 74) rotate(-18)">
        <ellipse cx="16" cy="16" rx="16" ry="16" fill="url(#coinGoldGrad)" stroke="#FEF3C7" strokeWidth="1.5" />
        <ellipse cx="16" cy="16" rx="12" ry="12" fill="none" stroke="#FEF9C3" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="12" y="21" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif">₹</text>
      </g>

      {/* Floating 3D Small Gold Coin on Right */}
      <g transform="translate(104, 76) rotate(15)">
        <circle cx="12" cy="12" r="12" fill="url(#coinGoldGrad)" stroke="#FEF3C7" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="9" fill="none" stroke="#FEF9C3" strokeWidth="1" />
        <text x="9" y="16" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="sans-serif">★</text>
      </g>

      {/* Sparkling Stars & Glints */}
      <path d="M22 22 L24 27 L29 29 L24 31 L22 36 L20 31 L15 29 L20 27 Z" fill="#FDE68A" />
      <path d="M118 26 L120 30 L124 31 L120 32 L118 36 L116 32 L112 31 L116 30 Z" fill="#FFFBEB" />
      <circle cx="32" cy="116" r="2.5" fill="#F59E0B" />
      <circle cx="112" cy="112" r="2" fill="#FDE68A" />
    </svg>
  );
};

export default CalendarHero;

