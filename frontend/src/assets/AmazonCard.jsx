import React from 'react';

export const AmazonCard = ({ size = 64, className = '' }) => {
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
        <linearGradient id="cardDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E163B" />
          <stop offset="100%" stopColor="#0F0B24" />
        </linearGradient>
        <linearGradient id="amazonSmile" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <filter id="cardGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g filter="url(#cardGlow)">
        {/* Card Body */}
        <rect
          x="12"
          y="22"
          width="76"
          height="52"
          rx="7"
          fill="url(#cardDark)"
          stroke="#4C358A"
          strokeWidth="1.5"
        />

        {/* Amazon Lowercase 'a' */}
        <text
          x="44"
          y="48"
          fill="#FFFFFF"
          fontSize="26"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          letterSpacing="-1"
        >
          a
        </text>

        {/* Amazon Iconic Curved Smile Arrow */}
        <path
          d="M32 54 C40 60 54 60 62 53"
          stroke="url(#amazonSmile)"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Arrow Tip */}
        <path
          d="M60 50 L65 52 L62 56 Z"
          fill="url(#amazonSmile)"
        />

        {/* Top Accent Strip */}
        <rect x="13" y="23" width="74" height="4" rx="2" fill="url(#amazonSmile)" opacity="0.8" />
      </g>

      {/* Sparkles */}
      <circle cx="20" cy="30" r="1.5" fill="#FBBF24" />
      <circle cx="82" cy="65" r="1.5" fill="#FBBF24" />
    </svg>
  );
};

export default AmazonCard;
