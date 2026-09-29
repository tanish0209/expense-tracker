import React from "react";

export const SkeletonCard = ({ className = "" }) => (
  <div className={`animate-pulse bg-white/10 rounded-2xl p-6 border border-white/10 ${className}`}>
    <div className="h-4 bg-white/20 rounded w-1/3 mb-4"></div>
    <div className="h-8 bg-white/20 rounded w-2/3 mb-2"></div>
    <div className="h-3 bg-white/10 rounded w-1/2"></div>
  </div>
);

export const SkeletonChart = () => (
  <div className="animate-pulse bg-white/10 rounded-2xl p-6 border border-white/10 h-[400px] flex flex-col justify-between">
    <div className="flex justify-between items-center">
      <div className="h-6 bg-white/20 rounded w-1/4"></div>
      <div className="h-8 bg-white/20 rounded w-1/6"></div>
    </div>
    <div className="h-[250px] bg-white/10 rounded flex items-end justify-between p-4 gap-2">
      <div className="w-1/12 h-1/3 bg-white/20 rounded"></div>
      <div className="w-1/12 h-2/3 bg-white/20 rounded"></div>
      <div className="w-1/12 h-1/2 bg-white/20 rounded"></div>
      <div className="w-1/12 h-3/4 bg-white/20 rounded"></div>
      <div className="w-1/12 h-2/5 bg-white/20 rounded"></div>
      <div className="w-1/12 h-4/5 bg-white/20 rounded"></div>
      <div className="w-1/12 h-1/4 bg-white/20 rounded"></div>
    </div>
  </div>
);

export const SkeletonList = () => (
  <div className="animate-pulse bg-white/10 rounded-2xl p-6 border border-white/10 space-y-4">
    <div className="h-5 bg-white/20 rounded w-1/4 mb-4"></div>
    {[1, 2, 3, 4].map((n) => (
      <div key={n} className="flex justify-between items-center py-2 border-b border-white/5">
        <div className="flex items-center gap-3 w-1/2">
          <div className="w-10 h-10 bg-white/20 rounded-full"></div>
          <div className="space-y-1 w-full">
            <div className="h-4 bg-white/20 rounded w-2/3"></div>
            <div className="h-3 bg-white/10 rounded w-1/3"></div>
          </div>
        </div>
        <div className="h-5 bg-white/20 rounded w-1/5"></div>
      </div>
    ))}
  </div>
);
