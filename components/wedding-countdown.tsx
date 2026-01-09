"use client";

import React, { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { FireworksBackground } from './animate-ui/components/backgrounds/fireworks';

export default function WeddingCountdown() {
  const containerRef = useRef<HTMLDivElement>(null);
  const weAreRef = useRef<HTMLDivElement>(null);
  const marriedRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLDivElement>(null);
  const heartsRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  // GSAP animation for exciting entrance
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Set initial states
    gsap.set([weAreRef.current, marriedRef.current, namesRef.current, dateRef.current], {
      opacity: 0,
      y: 60,
      scale: 0.8,
      filter: "blur(15px)"
    });

    gsap.set(heartsRef.current, {
      opacity: 0,
      scale: 0
    });

    // Animate "We Are" first
    tl.to(weAreRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 1,
      delay: 0.3
    })
    // Then "MARRIED!" with a bigger, more dramatic entrance
    .to(marriedRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.2,
      ease: "elastic.out(1, 0.5)"
    }, "-=0.3")
    // Floating hearts burst
    .to(heartsRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.5")
    // Names reveal
    .to(namesRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.8
    }, "-=0.4")
    // Date reveal
    .to(dateRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.8
    }, "-=0.3");

    // Continuous subtle pulse animation on "MARRIED!"
    gsap.to(marriedRef.current, {
      scale: 1.02,
      duration: 1.5,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      delay: 3
    });

    // Floating hearts animation
    gsap.to(heartsRef.current?.querySelectorAll('.floating-heart'), {
      y: -15,
      duration: 2,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.3
    });

  }, []);

  // Memoize FireworksBackground to prevent re-rendering
  const memoizedFireworks = useMemo(() => (
    <FireworksBackground
      className="absolute inset-0 flex items-center justify-center rounded-xl"
      color="#FFBCAB"
      population={3}
    />
  ), []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-4 py-8">
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

      {/* Fireworks Background - More frequent for celebration! */}
      {memoizedFireworks}

      {/* Main content */}
      <div className="flex flex-col items-center gap-4 sm:gap-6 z-10 w-full max-w-4xl">

        {/* Overlapping Circular Elements */}
        <div className="absolute top-8 right-4 sm:top-12 sm:right-12 md:right-24 w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40">
          {/* Circular Outer - Rotating */}
          <Image
            src="/Circular Outer.png"
            alt="Circular outer rotating element"
            width={160}
            height={160}
            className="absolute inset-0 w-full h-full animate-spin origin-center"
            style={{ animation: 'spin 15s linear infinite' }}
          />
          {/* Circular Inner - Static, overlapping */}
          <Image
            src="/Circular Inner.png"
            alt="Circular inner static element"
            width={160}
            height={160}
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* "We Are" text */}
        <div ref={weAreRef} className="text-center">
          <span className="text-[#ffbcab] text-2xl sm:text-3xl md:text-4xl font-serif tracking-widest">
            We Are
          </span>
        </div>

        {/* "MARRIED!" text - The star of the show */}
        <div ref={marriedRef} className="text-center relative">
          <h1 className="text-[#c91b21] text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-serif font-normal leading-none tracking-tight"
              style={{
                textShadow: '0 4px 30px rgba(201, 27, 33, 0.3), 0 0 60px rgba(255, 188, 171, 0.2)'
              }}>
            MARRIED!
          </h1>

          {/* Decorative sparkles around MARRIED */}
          <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 text-2xl sm:text-3xl animate-pulse">✨</div>
          <div className="absolute -top-2 -right-4 sm:-top-4 sm:-right-6 text-2xl sm:text-3xl animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
          <div className="absolute -bottom-2 left-1/4 text-xl sm:text-2xl animate-pulse" style={{ animationDelay: '0.3s' }}>💫</div>
          <div className="absolute -bottom-4 right-1/4 text-xl sm:text-2xl animate-pulse" style={{ animationDelay: '0.7s' }}>💫</div>
        </div>

        {/* Floating Hearts */}
        <div ref={heartsRef} className="flex items-center justify-center gap-3 sm:gap-6 py-2">
          <span className="floating-heart text-3xl sm:text-4xl">💕</span>
          <span className="floating-heart text-4xl sm:text-5xl" style={{ animationDelay: '0.2s' }}>❤️</span>
          <span className="floating-heart text-3xl sm:text-4xl" style={{ animationDelay: '0.4s' }}>💕</span>
        </div>

        {/* Names */}
        <div ref={namesRef} className="text-center px-4 w-[90%] sm:w-auto">
          <h2 className="text-[#c91b21] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-normal leading-tight">
            Afifa <span className="text-[#ffbcab] text-2xl sm:text-3xl md:text-4xl">&</span> Rehan
          </h2>
        </div>

        {/* Wedding Date */}
        <div ref={dateRef} className="flex flex-col items-center gap-2 mt-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-12 h-[1px] bg-[#ffbcab]/50" />
            <span className="text-[#ffbcab] text-lg sm:text-xl font-mono tracking-widest">
              October 22, 2025
            </span>
            <div className="w-8 sm:w-12 h-[1px] bg-[#ffbcab]/50" />
          </div>
          <p className="text-[#ffbcab]/80 text-sm sm:text-base font-serif italic">
            Forever begins now
          </p>
        </div>

      </div>
    </div>
  );
}
