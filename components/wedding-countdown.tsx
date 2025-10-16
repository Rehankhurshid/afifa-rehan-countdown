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
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
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
      <div className="flex flex-col items-center gap-6 z-10">
        {/* Date header */}
        <div className="flex flex-col items-center gap-2 relative">
          <h2 className="text-[#c91b21] text-5xl font-serif font-normal">
            October 22
          </h2>
          {/* Overlapping Circular Elements - Replacing Group 4 */}
          <div className="absolute -top-20 -right-48 w-32 h-32">
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
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#c91b21] rounded-full" />
            <span className="text-[#c91b21] text-2xl font-serif">2025</span>
            <div className="w-2 h-2 bg-[#c91b21] rounded-full" />
          </div>
        </div>

        {/* Names */}
        <div className="text-center">
          <h1 className="text-[#c91b21] text-8xl font-serif font-normal">
            Afifa <span className="text-6xl">&</span> Rehan
          </h1>
        </div>

        {/* Countdown */}
        <div className="flex gap-4">
          {[
            { value: timeLeft.days, label: 'DAYS' },
            { value: timeLeft.hours, label: 'HOURS' },
            { value: timeLeft.minutes, label: 'MINUTES' },
            { value: timeLeft.seconds, label: 'SECONDS' }
          ].map((item, index) => (
            <div 
              key={index}
              ref={(el) => { countdownBoxesRef.current[index] = el; }}
              className="flex flex-col items-center justify-center w-20 h-24 px-4 py-3 border border-[#ffbcab]/30 text-[#ffbcab]"
            >
              <span className="text-4xl font-serif">
                {item.value.toString().padStart(2, '0')}
              </span>
              <span className="text-xs font-mono font-normal tracking-wider">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}