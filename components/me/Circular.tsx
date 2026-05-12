"use client";

import React from "react";

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  percentage: number;
  remainingTime: string;
}

export function CircularProgress({
  size = 120,
  strokeWidth = 8,
  percentage,
  remainingTime,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#ffffff20"
          fill="none"
        />
    
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="white"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: "stroke-dashoffset 0.5s ease",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* <Image
          src="/coin.png"
          alt="Coin"
          width={150}
          height={150}
          className="mb-1"
        /> */}
        {/* <span className="text-sm -translate-y-8 font-bold text-white">{remainingTime}</span> */}
        <span className="text-sm  font-bold text-white">{remainingTime}</span>
      </div>

          {/* <PrizweWheel/> */}
    </div>
  );
}

