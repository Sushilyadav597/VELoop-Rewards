import React from 'react';

const SkeletonBox = ({ width = '100%', height = '20px', borderRadius = '8px', className = '' }) => (
  <div
    className={className}
    style={{
      width,
      height,
      borderRadius,
      backgroundColor: '#161038',
      backgroundImage: 'linear-gradient(90deg, #161038 0%, #231a54 50%, #161038 100%)',
      backgroundSize: '200% 100%',
      animation: 'shimmerEffect 1.8s infinite linear',
      border: '1px solid rgba(139, 92, 246, 0.12)'
    }}
  />
);

export const StreakSkeleton = () => {
  return (
    <div className="container py-3">
      {/* Header Skeleton */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <SkeletonBox width="140px" height="32px" borderRadius="16px" />
        <SkeletonBox width="90px" height="32px" borderRadius="999px" />
      </div>

      {/* Hero Banner Skeleton */}
      <div
        className="p-4 mb-4"
        style={{
          backgroundColor: '#120d2e',
          borderRadius: '20px',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}
      >
        <div className="row align-items-center g-3">
          <div className="col-auto">
            <SkeletonBox width="90px" height="90px" borderRadius="20px" />
          </div>
          <div className="col">
            <SkeletonBox width="60%" height="24px" className="mb-2" />
            <SkeletonBox width="40%" height="16px" />
          </div>
          <div className="col-auto">
            <SkeletonBox width="120px" height="42px" borderRadius="12px" />
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="row g-3 mb-4">
        <div className="col-4">
          <SkeletonBox height="64px" borderRadius="14px" />
        </div>
        <div className="col-4">
          <SkeletonBox height="64px" borderRadius="14px" />
        </div>
        <div className="col-4">
          <SkeletonBox height="64px" borderRadius="14px" />
        </div>
      </div>

      {/* Ultimate Reward Skeleton */}
      <div className="mb-4">
        <SkeletonBox height="110px" borderRadius="20px" />
      </div>

      {/* 7 Daily Cards Skeleton */}
      <div className="row g-2 mb-4">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <div key={n} className="col">
            <SkeletonBox height="190px" borderRadius="16px" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreakSkeleton;
