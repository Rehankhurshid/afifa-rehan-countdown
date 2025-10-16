"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { FireworksBackground } from './animate-ui/components/backgrounds/fireworks';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function WeddingCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const countdownBoxesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Wedding date: October 22, 2025 at 8PM
  const weddingDate = new Date('2025-10-22T20:00:00').getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = weddingDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  // GSAP animation for staggered entrance with blur
  useEffect(() => {
    // Set initial state for boxes (invisible, scaled down, and blurred)
    gsap.set(countdownBoxesRef.current, {
      opacity: 0,
      scale: 0,
      y: 50,
      filter: "blur(10px)"
    });

    // Animate boxes in from left to right with stagger and blur-in
    gsap.to(countdownBoxesRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.8,
      ease: "back.out(1.7)",
      stagger: 0.2, // 0.2 second delay between each box
      delay: 0.5 // Initial delay before animation starts
    });

    // Heartbeat animation for seconds box (index 3) - scale from 1 to 1.05
    gsap.fromTo(countdownBoxesRef.current[3], 
      { scale: 1 }, // Starting state (normal size)
      {
        scale: 1.05,
        duration: 0.5,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.3 // Start after the stagger animation completes
      }
    );
  }, []);

  // Memoize FireworksBackground to prevent re-rendering every second
  const memoizedFireworks = useMemo(() => (
    <FireworksBackground
      className="absolute inset-0 flex items-center justify-center rounded-xl"
      color="#FFBCAB"
      population={1}
    />
  ), []); // Empty dependency array - only renders once

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-4 py-8">
      {/* Background Color */}
      <div className="absolute inset-0 bg-[#d87558]" />
      
      {/* Paperboard Texture */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: 'url(/paperboard-texture\\ 1.png) lightgray 50% / cover no-repeat',
          mixBlendMode: 'multiply'
        }}
      />

      {/* Fireworks Background - Memoized to prevent restart */}
      {memoizedFireworks}


      {/* Main content */}
      <div className="flex flex-col items-center gap-4 sm:gap-6 z-10 w-full max-w-4xl">
        {/* Date header */}
        <div className="flex flex-col items-center gap-2 relative">
          <h2 className="text-[#c91b21] text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-center">
            October 22
          </h2>
          {/* Overlapping Circular Elements - Replacing Group 4 */}
          <div className="absolute -top-12 -right-24 sm:-top-20 sm:-right-48 w-20 h-20 sm:w-32 sm:h-32 hidden sm:block">
            {/* Circular Outer - Rotating */}
            <Image 
              src="/Circular Outer.png" 
              alt="Circular outer rotating element" 
              width={128}
              height={128}
              className="absolute inset-0 w-full h-full animate-spin origin-center"
              style={{ animation: 'spin 15s linear infinite' }}
            />
            {/* Circular Inner - Static, overlapping */}
            <Image 
              src="/Circular Inner.png" 
              alt="Circular inner static element" 
              width={128}
              height={128}
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#c91b21] rounded-full" />
            <span className="text-[#c91b21] text-xl sm:text-2xl font-serif">2025</span>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#c91b21] rounded-full" />
          </div>
        </div>

        {/* Names */}
        <div className="text-center px-4">
          <h1 className="text-[#c91b21] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-normal leading-tight">
            Afifa <span className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl">&</span> Rehan
          </h1>
        </div>

        {/* Countdown */}
        <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-4 w-full sm:w-auto justify-center">
          {[
            { value: timeLeft.days, label: 'DAYS' },
            { value: timeLeft.hours, label: 'HOURS' },
            { value: timeLeft.minutes, label: 'MINUTES' },
            { value: timeLeft.seconds, label: 'SECONDS' }
          ].map((item, index) => (
            <div 
              key={index}
              ref={(el) => { countdownBoxesRef.current[index] = el; }}
              className="flex flex-col items-center justify-center w-full sm:w-20 h-16 sm:h-24 px-2 sm:px-4 py-2 sm:py-3 border border-[#ffbcab]/30 text-[#ffbcab] min-w-0"
            >
              <span className="text-2xl sm:text-4xl font-serif leading-none">
                {item.value.toString().padStart(2, '0')}
              </span>
              <span className="text-xs font-mono font-normal tracking-wider mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}