import React from 'react';

export const GoldCoins = ({ size = 64, className = '' }) => {
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
        {/* Gold Gradients */}
        <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3B0" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="goldFace" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#F59E0B" stopOpacity="0" />
          <stop offset="100%" stopColor="#FFFBEB" stopOpacity="0.4" />
        </linearGradient>
        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Bottom Coin */}
      <g transform="translate(15, 48)">
        <path d="M5 16 C5 8 20 2 35 2 C50 2 65 8 65 16 L65 24 C65 32 50 38 35 38 C20 38 5 32 5 24 Z" fill="url(#goldRim)" />
        <ellipse cx="35" cy="16" rx="30" ry="12" fill="url(#goldFace)" />
        <ellipse cx="35" cy="16" rx="25" ry="9.5" fill="none" stroke="#FDE68A" strokeWidth="1.5" strokeOpacity="0.7" />
      </g>

      {/* Middle Coin */}
      <g transform="translate(18, 36)">
        <path d="M5 16 C5 8 20 2 35 2 C50 2 65 8 65 16 L65 24 C65 32 50 38 35 38 C20 38 5 32 5 24 Z" fill="url(#goldRim)" />
        <ellipse cx="35" cy="16" rx="30" ry="12" fill="url(#goldFace)" />
        <ellipse cx="35" cy="16" rx="25" ry="9.5" fill="none" stroke="#FDE68A" strokeWidth="1.5" strokeOpacity="0.7" />
      </g>

      {/* Top Main Coin */}
      <g transform="translate(15, 18)" filter="url(#goldGlow)">
        {/* Thickness base */}
        <path d="M5 18 C5 9 20 2 35 2 C50 2 65 9 65 18 L65 26 C65 35 50 42 35 42 C20 42 5 35 5 26 Z" fill="url(#goldRim)" />
        {/* Coin face */}
        <ellipse cx="35" cy="18" rx="30" ry="13" fill="url(#goldFace)" />
        {/* Inner engraved border */}
        <ellipse cx="35" cy="18" rx="24" ry="10" fill="none" stroke="#FFF7ED" strokeWidth="1.8" />
        {/* Star Emboss */}
        <path
          d="M35 11 L37 15 L41.5 15.5 L38 18.5 L39 23 L35 20.5 L31 23 L32 18.5 L28.5 15.5 L33 15 Z"
          fill="#FFFBEB"
          opacity="0.9"
        />
        {/* Specular shine */}
        <ellipse cx="35" cy="18" rx="28" ry="11" fill="url(#goldShine)" />
      </g>

      {/* Sparkle glints */}
      <circle cx="20" cy="22" r="2" fill="#FFFFFF" />
      <circle cx="75" cy="26" r="1.5" fill="#FFFFFF" />
      <path d="M72 15 L74 19 L78 20 L74 21 L72 25 L70 21 L66 20 L70 19 Z" fill="#FFFBEB" opacity="0.85" />
    </svg>
  );
};

export default GoldCoins;
