import React from 'react';

export const GemIcon = ({ size = 20, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="50%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#6B21A8" />
        </linearGradient>
      </defs>
      <path
        d="M6 3 L18 3 L22 9 L12 21 L2 9 Z"
        fill="url(#gemGradient)"
        stroke="#E9D5FF"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M2 9 L22 9" stroke="#E9D5FF" strokeWidth="0.8" />
      <path d="M12 21 L8 9 L6 3" stroke="#E9D5FF" strokeWidth="0.8" />
      <path d="M12 21 L16 9 L18 3" stroke="#E9D5FF" strokeWidth="0.8" />
      <circle cx="12" cy="7" r="1" fill="#FFFFFF" />
    </svg>
  );
};

export default GemIcon;
