"use client";

import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { WISHES } from "@/config/wishes";

// Wishes stay sealed until our anniversary: 22 Oct 2026, 00:00 IST.
const REVEAL_AT = Date.UTC(2026, 9, 21, 18, 30);

type Wish = { name: string; wish: string; time: number };

const SHEET_URL = `https://docs.google.com/spreadsheets/d/${WISHES.sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
  WISHES.sheetTab
)}`;

function parseGviz(text: string): Wish[] {
  const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
  const rows: { c: ({ v: unknown; f?: string } | null)[] }[] = json?.table?.rows ?? [];
  return rows
    .map((r) => {
      const ts = r.c?.[0]?.v;
      let time = 0;
      if (typeof ts === "string") {
        const m = ts.match(/Date\((\d+),(\d+),(\d+),?(\d+)?,?(\d+)?,?(\d+)?\)/);
        if (m) time = new Date(+m[1], +m[2], +m[3], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0)).getTime();
      }
      return {
        name: String(r.c?.[1]?.v ?? "").trim(),
        wish: String(r.c?.[2]?.v ?? "").trim(),
        time,
      };
    })
    .filter((w) => w.name && w.wish && !(w.name === "Name" && w.wish === "Wish"))
    .sort((a, b) => b.time - a.time);
}

export default function WeddingWishes() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [wish, setWish] = useState("");
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [note, setNote] = useState("");
  const opened = useRef(Date.now());
  const [now, setNow] = useState<number | null>(null);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);
  const revealed = now !== null && now >= REVEAL_AT;
  const writers = Array.from(new Set(wishes.map((w) => w.name.trim()))).filter(Boolean);
  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => setShown(wishes.length), 250);
    return () => clearTimeout(t);
  }, [loading, wishes.length]);

  useEffect(() => {
    fetch(SHEET_URL)
      .then((r) => r.text())
      .then((t) => setWishes(parseGviz(t)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    const w = wish.trim();
    if (!n || !w) return setNote("Please add your name and a wish.");
    if (trap.trim().length > 3 || Date.now() - opened.current < 1500) {
      setStatus("sent");
      return;
    }
    setStatus("sending");
    setNote("");
    const body = new URLSearchParams();
    body.set(WISHES.nameEntry, n.slice(0, WISHES.maxName));
    body.set(WISHES.wishEntry, w.slice(0, WISHES.maxWish));
    try {
      await fetch(WISHES.formResponseUrl, { method: "POST", mode: "no-cors", body });
      setWishes((cur) => [{ name: n, wish: w, time: Date.now() }, ...cur]);
      setName("");
      setWish("");
      setStatus("sent");
    } catch {
      setStatus("error");
      setNote("That didn't go through. Please try once more.");
    }
  }

  const label = "text-xs font-mono tracking-[0.15em] uppercase text-[#6b2a20]";
  const field =
    "w-full rounded-md bg-white/70 border border-[#c9a99a] px-4 py-3 text-[#3b1612] placeholder:text-[#7d5a4f] font-serif text-lg focus:outline-none focus:border-[#c91b21] focus:bg-white transition-colors";
  const tilts = ["-rotate-[1.2deg]", "rotate-[0.8deg]", "-rotate-[0.4deg]", "rotate-[1.4deg]", "rotate-0", "-rotate-[1deg]"];

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 bg-[#d87558]" />
      <div
        className="fixed inset-0 opacity-50"
        style={{
          background: "url(/paperboard-texture\\ 1.png) lightgray 50% / cover no-repeat",
          mixBlendMode: "multiply",
        }}
      />
      <div className="relative z-10 mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <p className="text-center text-[#3b1612] text-sm font-mono tracking-[0.25em] uppercase">
          Afifa &amp; Rehan
        </p>
        <h1 className="mt-3 text-center text-[#fbf1e6] text-5xl sm:text-7xl font-serif leading-tight drop-shadow-[0_1px_0_rgba(120,30,20,0.25)]">
          Wedding Wishes
        </h1>
        <p className="mt-3 text-center font-serif italic text-xl sm:text-2xl text-[#3b1612]">
          Leave a little love for the two of us.
        </p>

        <form
          onSubmit={submit}
          className="mx-auto mt-10 max-w-xl rounded-xl bg-[#fbf1e6] p-5 sm:p-8 space-y-5 shadow-[0_12px_40px_-12px_rgba(90,25,15,0.45)]"
        >
          <label className="block">
            <span className={label}>Your name</span>
            <input
              className={`${field} mt-2`}
              value={name}
              maxLength={WISHES.maxName}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className={label}>Your wish</span>
            <textarea
              className={`${field} mt-2 min-h-[140px] resize-y`}
              value={wish}
              maxLength={WISHES.maxWish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="Write something sweet…"
            />
            <span className="mt-1 block text-right text-xs font-mono text-[#6b2a20]">
              {wish.length}/{WISHES.maxWish}
            </span>
          </label>
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            data-lpignore="true"
            data-1p-ignore="true"
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            name="hp_extra_field"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-md bg-[#c91b21] py-3.5 font-mono text-sm tracking-[0.2em] uppercase text-[#fbf1e6] hover:bg-[#a8161b] transition-colors disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send your wish"}
          </button>
          {status === "sent" && (
            <p className="text-center font-serif italic text-lg text-[#c91b21]">{revealed ? "Thank you, it means the world. ♥" : "Thank you! We\u2019ll open it on our anniversary. ♥"}</p>
          )}
          {note && <p className="text-center font-mono text-xs text-[#8a3a2c]">{note}</p>}
        </form>

        <section className="mt-16">
          {!revealed ? (
            <div className="text-center">
              <p className="text-[#3b1612] text-sm font-mono tracking-[0.25em] uppercase">Sealed until October 22</p>
              <div className="mt-4 flex items-baseline justify-center gap-3 text-[#fbf1e6]">
                <NumberFlow
                  value={shown}
                  className="font-serif text-8xl sm:text-9xl leading-none tabular-nums"
                  transformTiming={{ duration: 900, easing: "cubic-bezier(.2,.9,.3,1.2)" }}
                />
              </div>
              <p className="mt-2 font-serif italic text-2xl text-[#3b1612]">
                {loading
                  ? "gathering the love…"
                  : wishes.length === 0
                  ? "Be the first to leave a wish."
                  : `${wishes.length === 1 ? "wish is" : "wishes are"} waiting for us`}
              </p>
              {writers.length > 0 && (
                <div className="mx-auto mt-8 max-w-xl">
                  <p className="text-[#3b1612] text-sm font-mono tracking-[0.2em] uppercase">With love from</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                    {writers.map((n, i) => (
                      <span
                        key={n + i}
                        className="wish-chip inline-flex items-center gap-2 rounded-full bg-[#fbf1e6] pl-1.5 pr-4 py-1.5 shadow-[0_6px_16px_-10px_rgba(90,25,15,0.6)]"
                        style={{ animationDelay: `${300 + i * 90}ms` }}
                      >
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#c91b21] font-serif text-base text-[#fbf1e6]">
                          {n.charAt(0).toUpperCase()}
                        </span>
                        <span className="font-serif text-lg text-[#3b1612]">{n}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <p className="mt-10 font-serif italic text-lg text-[#3b1612]">
                Every wish opens on our anniversary. ♥
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-4">
                <span className="h-px w-10 bg-[#4a1610]/40" />
                <p className="text-[#3b1612] text-sm font-mono tracking-[0.25em] uppercase">
                  {loading ? "Gathering wishes…" : (
                    <>
                      <NumberFlow value={shown} /> {wishes.length === 1 ? "wish" : "wishes"}
                    </>
                  )}
                </p>
                <span className="h-px w-10 bg-[#4a1610]/40" />
              </div>
              {!loading && wishes.length === 0 && (
                <p className="mt-6 text-center font-serif italic text-xl text-[#3b1612]">
                  Be the first to leave a wish.
                </p>
              )}
              <div className="mt-8 columns-1 sm:columns-2 gap-5">
                {wishes.map((w, i) => (
                  <div
                    key={`${w.time}-${i}`}
                    className={`mb-5 break-inside-avoid rounded-lg bg-[#fbf1e6] px-6 pt-6 pb-5 shadow-[0_8px_24px_-12px_rgba(90,25,15,0.5)] ${tilts[i % tilts.length]}`}
                  >
                    <p className="font-serif text-[1.2rem] leading-relaxed text-[#3b1612] whitespace-pre-line break-words">
                      {w.wish}
                    </p>
                    <p className="mt-4 text-right font-serif italic text-lg text-[#c91b21]">{w.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
