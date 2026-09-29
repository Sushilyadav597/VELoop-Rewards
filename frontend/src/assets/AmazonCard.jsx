import React from 'react';

export const AmazonCard = ({ size = 60, className = '' }) => {
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
        <linearGradient id="amazonCardBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient id="amazonSmileGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FF9900" />
        </linearGradient>
        <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.35" />
        </filter>
      </defs>

      <g filter="url(#cardShadow)">
        {/* Crisp Card Body (matching Page 63 Day 5 asset) */}
        <rect
          x="14"
          y="18"
          width="72"
          height="64"
          rx="12"
          fill="url(#amazonCardBg)"
          stroke="#E2E8F0"
          strokeWidth="1.2"
        />

        {/* Amazon Lowercase 'a' */}
        <text
          x="50"
          y="54"
          textAnchor="middle"
          fill="#111827"
          fontSize="36"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-1.5"
        >
          a
        </text>

        {/* Amazon Curved Smile Arrow */}
        <path
          d="M32 58 C42 67 58 67 68 58"
          stroke="url(#amazonSmileGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Smile Arrow Head */}
        <path
          d="M66 54.5 L72 57 L69 61.5 Z"
          fill="url(#amazonSmileGrad)"
        />
      </g>

      {/* Subtle sparkle */}
      <circle cx="82" cy="22" r="2" fill="#F59E0B" opacity="0.8" />
    </svg>
  );
};

export default AmazonCard;

