"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { FireworksBackground } from "./animate-ui/components/backgrounds/fireworks";
import { WeddingInformationDrawer } from "./wedding-information-drawer";

// The blessed moment — October 22, 2025 at 9 PM
const WEDDING_MOMENT = new Date("2025-10-22T21:00:00").getTime();

function getTimeDiff(target: number) {
  const diff = Math.abs(Date.now() - target);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export default function WeddingCountdown() {
  const weddingPassed = useRef(Date.now() > WEDDING_MOMENT).current;

  const [phase, setPhase] = useState<"finale" | "flash" | "live">(
    weddingPassed ? "finale" : "live"
  );
  const [finaleCount, setFinaleCount] = useState(3);
  const [isMarried, setIsMarried] = useState(false);
  const [time, setTime] = useState(getTimeDiff(WEDDING_MOMENT));

  const boxesRef = useRef<(HTMLDivElement | null)[]>([]);
  const finaleBoxesRef = useRef<(HTMLDivElement | null)[]>([]);
  const finaleOverlayRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const marriedTextRef = useRef<HTMLDivElement>(null);
  const sinceTextRef = useRef<HTMLDivElement>(null);

  // ── Finale: cinematic last-second countdown ──
  useEffect(() => {
    if (phase !== "finale") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      const boxes = finaleBoxesRef.current.filter(Boolean);
      const secBox = finaleBoxesRef.current[3];

      // Boxes entrance (staggered, blurred → sharp)
      tl.fromTo(
        boxes,
        { opacity: 0, scale: 0, y: 40, filter: "blur(10px)" },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "back.out(1.7)",
          stagger: 0.12,
        }
      );

      // Countdown ticks: 3 → 2 → 1 → 0
      const ticks = [
        { value: 2, at: 1.3 },
        { value: 1, at: 2.0 },
        { value: 0, at: 2.7 },
      ];

      ticks.forEach(({ value, at }) => {
        tl.call(() => setFinaleCount(value), [], at);
        if (secBox) {
          tl.fromTo(
            secBox,
            { scale: value === 0 ? 1.3 : 1.2 },
            { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" },
            at
          );
        }
      });

      // Golden glow on all boxes at zero
      tl.to(
        boxes,
        {
          borderColor: "rgba(255, 215, 0, 0.8)",
          boxShadow: "0 0 40px rgba(255, 215, 0, 0.5)",
          color: "#ffd700",
          duration: 0.4,
        },
        3.0
      );

      // Transition to flash
      tl.call(() => setPhase("flash"), [], 3.5);
    });

    return () => ctx.revert();
  }, [phase]);

  // ── Flash: golden burst + reveal married state ──
  useEffect(() => {
    if (phase !== "flash") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.to(flashRef.current, { opacity: 1, duration: 0.4, ease: "power2.in" })
        .call(() => setIsMarried(true), [], 0.5)
        .to(
          finaleOverlayRef.current,
          { opacity: 0, duration: 0.6, ease: "power2.out" },
          0.6
        )
        .to(
          flashRef.current,
          { opacity: 0, duration: 1.2, ease: "power2.out" },
          0.8
        )
        .call(() => setPhase("live"), [], 1.8);
    });

    return () => ctx.revert();
  }, [phase]);

  // ── Live timer (counts down before wedding, counts up after) ──
  useEffect(() => {
    const tick = () => {
      if (Date.now() >= WEDDING_MOMENT && !isMarried && phase === "live") {
        setIsMarried(true);
      }
      setTime(getTimeDiff(WEDDING_MOMENT));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [phase, isMarried]);

  // ── Live-phase entrance animations ──
  useEffect(() => {
    if (phase !== "live") return;

    const ctx = gsap.context(() => {
      const boxes = boxesRef.current.filter(Boolean);

      gsap.set(boxes, { opacity: 0, scale: 0, y: 50, filter: "blur(10px)" });

      gsap.to(boxes, {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.2,
        delay: 0.3,
      });

      // Heartbeat on seconds box
      const secBox = boxesRef.current[3];
      if (secBox) {
        gsap.fromTo(secBox, { scale: 1 }, {
          scale: 1.05,
          duration: 0.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1.5,
        });
      }

      // Married label entrance
      if (isMarried && marriedTextRef.current) {
        gsap.fromTo(
          marriedTextRef.current,
          { opacity: 0, y: 20, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out", delay: 0.6 }
        );
      }

      // "Since" label entrance
      if (isMarried && sinceTextRef.current) {
        gsap.fromTo(
          sinceTextRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: "power2.out", delay: 1.0 }
        );
      }

      // Golden glow pulse on married counter boxes
      if (isMarried) {
        boxes.forEach((box, i) => {
          if (!box) return;
          gsap.fromTo(
            box,
            { boxShadow: "0 0 8px rgba(255, 215, 0, 0.05)" },
            {
              boxShadow: "0 0 20px rgba(255, 215, 0, 0.15)",
              duration: 2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: 1.5 + i * 0.2,
            }
          );
        });
      }
    });

    return () => ctx.revert();
  }, [phase, isMarried]);

  const memoizedFireworks = useMemo(
    () => (
      <FireworksBackground
        className="absolute inset-0 flex items-center justify-center rounded-xl"
        color="#FFBCAB"
        population={1}
      />
    ),
    []
  );

  const timeItems = [
    { value: time.days, label: "DAYS" },
    { value: time.hours, label: "HOURS" },
    { value: time.minutes, label: "MINUTES" },
    { value: time.seconds, label: "SECONDS" },
  ];

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-4 py-8">
      {/* ── Backgrounds ── */}
      <div className="absolute inset-0 bg-[#d87558]" />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "url(/paperboard-texture\\ 1.png) lightgray 50% / cover no-repeat",
          mixBlendMode: "multiply",
        }}
      />
      {memoizedFireworks}

      {/* ── Golden flash overlay ── */}
      <div
        ref={flashRef}
        className="fixed inset-0 z-[60] pointer-events-none opacity-0"
        style={{
          background:
            "radial-gradient(circle, rgba(255,223,100,0.95) 0%, rgba(255,180,100,0.6) 50%, transparent 100%)",
        }}
      />

      {/* ── Finale overlay: cinematic last-second countdown ── */}
      {(phase === "finale" || phase === "flash") && (
        <div
          ref={finaleOverlayRef}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#d87558]"
        >
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                "url(/paperboard-texture\\ 1.png) lightgray 50% / cover no-repeat",
              mixBlendMode: "multiply",
            }}
          />

          <div className="flex flex-col items-center gap-8 z-10">
            <h2 className="text-[#ffbcab]/50 text-xs sm:text-sm font-mono tracking-[0.3em] uppercase">
              The countdown ends
            </h2>

            <div className="flex gap-3 sm:gap-5">
              {[
                { value: 0, label: "DAYS" },
                { value: 0, label: "HOURS" },
                { value: 0, label: "MINUTES" },
                { value: finaleCount, label: "SECONDS" },
              ].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    finaleBoxesRef.current[i] = el;
                  }}
                  className="flex flex-col items-center justify-center w-16 h-20 sm:w-24 sm:h-32 border border-[#ffbcab]/30 text-[#ffbcab]"
                >
                  <span className="text-3xl sm:text-5xl font-serif leading-none">
                    {item.value.toString().padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono tracking-wider mt-2 opacity-50">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex flex-col items-center gap-4 sm:gap-6 z-10 w-full max-w-4xl">
        {/* Date header */}
        <div className="flex flex-col items-center gap-2 relative">
          <h2 className="text-[#c91b21] text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-center">
            October 22
          </h2>
          <div className="absolute -top-8 -right-40 sm:-top-12 sm:-right-64 w-36 h-36 sm:w-40 sm:h-40">
            <Image
              src="/Circular Outer.png"
              alt="Decorative rotating element"
              width={160}
              height={160}
              className="absolute inset-0 w-full h-full animate-spin origin-center"
              style={{ animation: "spin 15s linear infinite" }}
            />
            <Image
              src="/Circular Inner.png"
              alt="Decorative inner element"
              width={160}
              height={160}
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#c91b21] rounded-full" />
            <span className="text-[#c91b21] text-xl sm:text-2xl font-serif">
              2025
            </span>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#c91b21] rounded-full" />
          </div>
        </div>

        {/* Names */}
        <div className="text-center px-4 w-[90%] sm:w-auto">
          <h1 className="text-[#c91b21] text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-normal leading-tight">
            Afifa{" "}
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              {isMarried ? "&" : "weds"}
            </span>{" "}
            Rehan
          </h1>
        </div>

        {/* Happily Married label with golden shimmer */}
        {isMarried && (
          <div ref={marriedTextRef} style={{ opacity: 0 }}>
            <span
              className="text-xl sm:text-2xl md:text-3xl font-serif italic tracking-wide inline-block animate-shiny-text bg-clip-text"
              style={
                {
                  "--shiny-width": "100px",
                  backgroundImage:
                    "linear-gradient(120deg, #ffbcab 40%, #ffd700 50%, #ffbcab 60%)",
                  backgroundSize: "250% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                } as React.CSSProperties
              }
            >
              Happily Married
            </span>
          </div>
        )}

        {/* Counter */}
        {phase === "live" && (
          <div className="flex flex-col items-center gap-3">
            {isMarried && (
              <div ref={sinceTextRef} style={{ opacity: 0 }}>
                <span className="text-[#ffbcab]/50 text-xs sm:text-sm font-mono tracking-[0.15em]">
                  since 9 PM · October 22, 2025
                </span>
              </div>
            )}

            <div className="flex gap-2 sm:gap-4 w-full sm:w-auto justify-center">
              {timeItems.map((item, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    boxesRef.current[index] = el;
                  }}
                  className={`flex flex-col items-center justify-center flex-1 sm:w-24 h-16 sm:h-24 px-1 sm:px-4 py-2 sm:py-3 border text-[#ffbcab] min-w-0 ${
                    isMarried
                      ? "border-[#ffd700]/20"
                      : "border-[#ffbcab]/30"
                  }`}
                >
                  <span className="text-2xl sm:text-4xl font-serif leading-none tabular-nums">
                    {item.value.toString().padStart(2, "0")}
                  </span>
                  <span className="text-xs font-mono font-normal tracking-wider mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Wedding Information Drawer */}
      <WeddingInformationDrawer />
    </div>
  );
}
