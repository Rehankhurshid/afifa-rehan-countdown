"use client";

import { useEffect, useRef, useState } from "react";
import { WISHES } from "@/config/wishes";

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

  const label = "text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase text-[#ffbcab]/70";
  const field =
    "w-full bg-transparent border border-[#ffbcab]/30 px-4 py-3 text-[#fbf1e6] placeholder:text-[#ffbcab]/40 font-serif text-lg focus:outline-none focus:border-[#c91b21] transition-colors";

  return (
    <main className="relative min-h-screen overflow-x-hidden text-[#ffbcab]">
      <div className="fixed inset-0 bg-[#d87558]" />
      <div
        className="fixed inset-0 opacity-50"
        style={{ background: "url(/paperboard-texture\\ 1.png) lightgray 50% / cover no-repeat" }}
      />
      <div className="relative z-10 mx-auto max-w-2xl px-5 py-16 sm:py-24">
        <p className="text-center text-[#ffbcab]/60 text-xs font-mono tracking-[0.3em] uppercase">
          Afifa &amp; Rehan
        </p>
        <h1 className="mt-4 text-center text-[#c91b21] text-5xl sm:text-7xl font-serif leading-tight">
          Wedding Wishes
        </h1>
        <p className="mt-4 text-center font-serif italic text-xl text-[#fbf1e6]/90">
          Leave a little love for the two of us.
        </p>

        <form onSubmit={submit} className="mt-12 border border-[#ffbcab]/30 p-5 sm:p-8 space-y-5">
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
            <span className="mt-1 block text-right text-[10px] font-mono text-[#ffbcab]/50">
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
            className="w-full bg-[#c91b21] py-3 font-mono text-xs tracking-[0.3em] uppercase text-[#fbf1e6] hover:bg-[#a8161b] transition-colors disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send your wish"}
          </button>
          {status === "sent" && (
            <p className="text-center font-serif italic text-lg text-[#fbf1e6]">Thank you, it means the world. ♥</p>
          )}
          {note && <p className="text-center font-mono text-xs text-[#fbf1e6]">{note}</p>}
        </form>

        <section className="mt-16">
          <p className="text-center text-[#ffbcab]/60 text-xs font-mono tracking-[0.3em] uppercase">
            {loading ? "Gathering wishes…" : `${wishes.length} ${wishes.length === 1 ? "wish" : "wishes"}`}
          </p>
          {!loading && wishes.length === 0 && (
            <p className="mt-6 text-center font-serif italic text-xl text-[#fbf1e6]/80">
              Be the first to leave a wish.
            </p>
          )}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {wishes.map((w, i) => (
              <article key={`${w.time}-${i}`} className="border border-[#ffbcab]/30 p-5 bg-[#d87558]/30">
                <p className="font-serif text-lg leading-relaxed text-[#fbf1e6] whitespace-pre-line break-words">
                  “{w.wish}”
                </p>
                <p className="mt-4 text-[#c91b21] font-serif text-xl">— {w.name}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
