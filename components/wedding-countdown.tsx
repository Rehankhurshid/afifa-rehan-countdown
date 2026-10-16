"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { FireworksBackground } from "./animate-ui/components/backgrounds/fireworks";
import { WeddingInformationDrawer } from "./wedding-information-drawer";

// The blessed moment — October 22, 2025 at 9 PM
const WEDDING_MOMENT = new Date("2025-10-22T21:00:00").getTime();

function getTimeSince() {
  const diff = Math.abs(Date.now() - WEDDING_MOMENT);
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  const months = Math.floor(totalDays / 30.44);
  const daysAfterMonths = Math.floor(totalDays - months * 30.44);
  const weeks = Math.floor(totalDays / 7);
  const daysAfterWeeks = totalDays % 7;

  return { totalDays, totalHours, hours, minutes, seconds, months, daysAfterMonths, weeks, daysAfterWeeks };
}

type Format = { parts: { value: string; label: string }[] };

function getFormats(t: ReturnType<typeof getTimeSince>): Format[] {
  return [
    {
      parts: [
        { value: String(t.totalDays), label: t.totalDays === 1 ? "day" : "days" },
        { value: String(t.hours), label: t.hours === 1 ? "hour" : "hours" },
        { value: String(t.minutes), label: t.minutes === 1 ? "min" : "mins" },
      ],
    },
    {
      parts: [
        { value: String(t.months), label: t.months === 1 ? "month" : "months" },
        { value: String(t.daysAfterMonths), label: t.daysAfterMonths === 1 ? "day" : "days" },
        { value: String(t.hours), label: t.hours === 1 ? "hour" : "hours" },
      ],
    },
    {
      parts: [
        { value: String(t.weeks), label: t.weeks === 1 ? "week" : "weeks" },
        { value: String(t.daysAfterWeeks), label: t.daysAfterWeeks === 1 ? "day" : "days" },
        { value: String(t.hours), label: t.hours === 1 ? "hour" : "hours" },
      ],
    },
    {
      parts: [
        { value: t.totalHours.toLocaleString(), label: "hours" },
        { value: String(t.minutes), label: t.minutes === 1 ? "min" : "mins" },
        { value: String(t.seconds), label: "sec" },
      ],
    },
  ];
}

const FORMAT_INTERVAL = 5000;

export default function WeddingCountdown() {
  const weddingPassed = useRef(Date.now() > WEDDING_MOMENT).current;

  const [phase, setPhase] = useState<"finale" | "flash" | "live">(
    weddingPassed ? "finale" : "live"
  );
  const [finaleCount, setFinaleCount] = useState(3);
  const [isMarried, setIsMarried] = useState(false);
  const [timeSince, setTimeSince] = useState(getTimeSince);
  const [formatIndex, setFormatIndex] = useState(0);

  const finaleBoxesRef = useRef<(HTMLDivElement | null)[]>([]);
  const finaleOverlayRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const marriedTextRef = useRef<HTMLDivElement>(null);
  const sinceAreaRef = useRef<HTMLDivElement>(null);
  const formatLineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Pre-compute formats
  const formats = useMemo(() => getFormats(timeSince), [timeSince]);

  // Safety net: never let the intro overlay trap the page (slow phones,
  // background tabs where animations pause, in-app browsers).
  useEffect(() => {
    if (phase === "live") return;
    const t = setTimeout(() => {
      setIsMarried(true);
      setPhase("live");
    }, phase === "finale" ? 6000 : 2500);
    return () => clearTimeout(t);
  }, [phase]);

  const skipIntro = useCallback(() => {
    setIsMarried(true);
    setPhase("live");
  }, []);

  // ── Finale: cinematic last-second countdown ──
  useEffect(() => {
    if (phase !== "finale") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      const boxes = finaleBoxesRef.current.filter(Boolean);
      const secBox = finaleBoxesRef.current[3];

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

      [
        { value: 2, at: 1.3 },
        { value: 1, at: 2.0 },
        { value: 0, at: 2.7 },
      ].forEach(({ value, at }) => {
        tl.call(() => setFinaleCount(value), [], at);
        if (secBox) {
          tl.fromTo(
            secBox,
            { scale: value === 0 ? 1.3 : 1.15 },
            { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" },
            at
          );
        }
      });

      tl.to(
        boxes,
        {
          borderColor: "rgba(255, 188, 171, 0.6)",
          boxShadow: "0 0 30px rgba(255, 188, 171, 0.2)",
          duration: 0.5,
          ease: "power2.out",
        },
        3.0
      );

      tl.call(() => setPhase("flash"), [], 3.6);
    });

    return () => ctx.revert();
  }, [phase]);

  // ── Flash: warm burst + reveal married state ──
  useEffect(() => {
    if (phase !== "flash") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.to(flashRef.current, { opacity: 1, duration: 0.3, ease: "power2.in" })
        .call(() => setIsMarried(true), [], 0.4)
        .to(
          finaleOverlayRef.current,
          { opacity: 0, duration: 0.8, ease: "power2.out" },
          0.5
        )
        .to(
          flashRef.current,
          { opacity: 0, duration: 1.4, ease: "power3.out" },
          0.7
        )
        .call(() => setPhase("live"), [], 1.8);
    });

    return () => ctx.revert();
  }, [phase]);

  // ── Live timer ──
  useEffect(() => {
    const tick = () => {
      if (Date.now() >= WEDDING_MOMENT && !isMarried && phase === "live") {
        setIsMarried(true);
      }
      setTimeSince(getTimeSince());
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [phase, isMarried]);

  // ── Rotate formats every 5s ──
  useEffect(() => {
    if (phase !== "live" || !isMarried) return;

    const id = setInterval(() => {
      setFormatIndex((prev) => (prev + 1) % formats.length);
    }, FORMAT_INTERVAL);

    return () => clearInterval(id);
  }, [phase, isMarried, formats.length]);

  // ── Crossfade on format change ──
  const prevFormatIndex = useRef(formatIndex);
  useEffect(() => {
    if (phase !== "live" || !isMarried) return;
    if (prevFormatIndex.current === formatIndex) return;
    prevFormatIndex.current = formatIndex;

    const lines = formatLineRefs.current.filter(Boolean);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06 }
      );
    });

    return () => ctx.revert();
  }, [formatIndex, phase, isMarried]);

  // ── Live entrance ──
  useEffect(() => {
    if (phase !== "live") return;

    const ctx = gsap.context(() => {
      if (isMarried && marriedTextRef.current) {
        gsap.fromTo(
          marriedTextRef.current,
          { opacity: 0, y: 16, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power2.out", delay: 0.3 }
        );
      }

      if (isMarried && sinceAreaRef.current) {
        gsap.fromTo(
          sinceAreaRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.7 }
        );
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

  const activeFormat = formats[formatIndex];

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

      {/* ── Flash overlay ── */}
      <div
        ref={flashRef}
        className="fixed inset-0 z-[60] pointer-events-none opacity-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,240,235,0.9) 0%, rgba(216,117,88,0.4) 60%, transparent 100%)",
        }}
      />

      {/* ── Finale overlay ── */}
      {(phase === "finale" || phase === "flash") && (
        <div
          ref={finaleOverlayRef}
          onClick={skipIntro}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#d87558] cursor-pointer ${
            phase === "flash" ? "pointer-events-none" : ""
          }`}
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
            <h2 className="text-[#ffbcab]/40 text-xs sm:text-sm font-mono tracking-[0.3em] uppercase">
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
                  <span className="text-[10px] sm:text-xs font-mono tracking-wider mt-2 opacity-40">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main content — always rendered, no conditional mount ── */}
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

        {/* Happily Married */}
        <div
          ref={marriedTextRef}
          className="h-8 sm:h-10"
          style={{ opacity: isMarried ? 0 : 0, visibility: isMarried ? "visible" : "hidden" }}
        >
          <span className="text-xl sm:text-2xl md:text-3xl font-serif italic tracking-wide text-[#ffbcab]">
            Happily Married
          </span>
        </div>

        {/* ── Time since — flowing text, not boxes ── */}
        <div
          ref={sinceAreaRef}
          className="flex flex-col items-center gap-4 min-h-[80px]"
          style={{ opacity: isMarried ? 0 : 0, visibility: isMarried ? "visible" : "hidden" }}
        >
          {/* Rotating format display */}
          <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap justify-center">
            {activeFormat.parts.map((part, i) => (
              <div
                key={`${formatIndex}-${i}`}
                ref={(el) => {
                  formatLineRefs.current[i] = el;
                }}
                className="flex items-baseline gap-1 sm:gap-1.5"
              >
                {i > 0 && (
                  <span className="text-[#ffbcab]/20 text-lg sm:text-xl font-serif mr-1 sm:mr-2">
                    ·
                  </span>
                )}
                <span className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#ffbcab] tabular-nums leading-none">
                  {part.value}
                </span>
                <span className="text-xs sm:text-sm font-mono text-[#ffbcab]/40 tracking-wider">
                  {part.label}
                </span>
              </div>
            ))}
          </div>

          {/* Static since line */}
          <span className="text-[#ffbcab]/30 text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase">
            since 9 PM · October 22, 2025
          </span>
        </div>
        {/* Quiet links: wishes and the letter */}
        <nav className="flex items-center gap-3 sm:gap-5 mt-2 sm:mt-4" aria-label="More">
          <a
            href="/wishes"
            className="text-[#ffbcab]/70 hover:text-[#ffbcab] text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase border-b border-[#ffbcab]/30 hover:border-[#ffbcab] pb-0.5 transition-colors"
          >
            Leave a wish
          </a>
          <span className="text-[#ffbcab]/30" aria-hidden="true">·</span>
          <a
            href="/for-rehan"
            className="text-[#ffbcab]/70 hover:text-[#ffbcab] text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase border-b border-[#ffbcab]/30 hover:border-[#ffbcab] pb-0.5 transition-colors"
          >
            A letter for Rehan
          </a>
        </nav>
      </div>

      {/* Wedding Information Drawer */}
      <WeddingInformationDrawer />
    </div>
  );
}
