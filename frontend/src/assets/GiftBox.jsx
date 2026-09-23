import React from 'react';

export const GiftBox = ({ size = 64, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="boxPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="50%" stopColor="#6D28D9" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id="lidPurple" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#6B21A8" />
        </linearGradient>
        <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <filter id="giftGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g filter="url(#giftGlow)">
        {/* Main Box Body */}
        <rect x="22" y="38" width="56" height="46" rx="6" fill="url(#boxPurple)" />
        
        {/* Vertical Ribbon Body */}
        <rect x="44" y="38" width="12" height="46" fill="url(#goldRibbon)" />

        {/* Box Lid */}
        <rect x="18" y="28" width="64" height="14" rx="4" fill="url(#lidPurple)" stroke="#A855F7" strokeWidth="0.8" />
        {/* Lid Vertical Ribbon */}
        <rect x="44" y="28" width="12" height="14" fill="url(#goldRibbon)" />

        {/* 3D Ribbon Bow Top */}
        {/* Left Loop */}
        <path
          d="M48 28 C35 15 28 20 40 28 Z"
          fill="url(#goldRibbon)"
          stroke="#FDE68A"
          strokeWidth="1"
        />
        {/* Right Loop */}
        <path
          d="M52 28 C65 15 72 20 60 28 Z"
          fill="url(#goldRibbon)"
          stroke="#FDE68A"
          strokeWidth="1"
        />
        {/* Center Bow Knot */}
        <ellipse cx="50" cy="27" rx="5" ry="4" fill="#FDE68A" />

        {/* Shimmer Highlight Line */}
        <path d="M26 42 L26 78" stroke="#A855F7" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
      </g>

      {/* Sparkles */}
      <circle cx="20" cy="25" r="1.5" fill="#FDE68A" />
      <circle cx="80" cy="35" r="2" fill="#FDE68A" />
      <path d="M78 20 L80 23 L83 24 L80 25 L78 28 L76 25 L73 24 L76 23 Z" fill="#FFFBEB" opacity="0.9" />
    </svg>
  );
};

export default GiftBox;
