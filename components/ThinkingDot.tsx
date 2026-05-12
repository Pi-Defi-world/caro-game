"use client"

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface ThinkingDotsProps {
  className?: string
}

const ThinkingDots: React.FC<ThinkingDotsProps> = ({ className = '' }) => {
  const dotsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (dotsRef.current) {
      gsap.to(dotsRef.current.children, {
        y: -3,
        stagger: 0.2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      })
    }
  }, [])

  return (
    <div ref={dotsRef} className={`flex space-x-[1px] ${className}`}>
      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
    </div>
  )
}

export default ThinkingDots

