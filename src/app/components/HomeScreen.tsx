import { motion } from "motion/react";
import type { Ticket } from "../types";
import { TIER_META } from "../data";

interface Props {
  tickets: Ticket[];
  onRecord: () => void;
  onOpenTicket: (id: string) => void;
}

export function HomeScreen({ tickets, onRecord, onOpenTicket }: Props) {
  const today = new Date();
  const todayStr = today.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
  const stamp = today.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }).toUpperCase();

  const todayCount = tickets.filter(t =>
    new Date(t.createdAt).toDateString() === today.toDateString()
  ).length;

  const recent = [...tickets].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);
  const legendaryCount = tickets.filter(t => t.tier === "legendary").length;

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-28 px-5 pt-8">
      {/* masthead */}
      <header className="text-center">
        <div className="stamp-font" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-faint)" }}>
          EST · 2026 · DAILY EDITION
        </div>
        <h1 className="en-serif" style={{ fontSize: 44, fontWeight: 700, letterSpacing: "0.04em", lineHeight: 1, marginTop: 6 }}>
          Fumble
        </h1>
        <div className="mt-1" style={{ fontSize: 12, color: "var(--ink-soft)", letterSpacing: "0.15em" }}>
          失 · 手 · 录
        </div>
        <div className="mt-2 mx-auto w-32 h-px" style={{ background: "linear-gradient(to right, transparent, var(--ink-faint), transparent)" }} />
        <div className="mt-2 stamp-font" style={{ fontSize: 10, color: "var(--ink-faint)" }}>
          {stamp}
        </div>
      </header>

      {/* date / quote */}
      <section className="mt-6 text-center">
        <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.7 }}>
          「倒霉，是限量发行的礼物。」
        </p>
        <p className="mt-1" style={{ fontSize: 11, color: "var(--ink-faint)" }}>{todayStr}</p>
      </section>

      {/* big record button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onRecord}
        className="relative mt-7 w-full overflow-hidden paper-texture"
        style={{
          background: "var(--ink)",
          color: "var(--bone)",
          padding: "26px 20px",
          borderRadius: 4,
          boxShadow: "0 6px 0 #1a0e08, 0 12px 24px rgba(42,24,16,0.3)",
          border: "1.5px solid var(--ink)",
        }}
      >
        <div className="absolute inset-2 rounded pointer-events-none" style={{ border: "1px dashed rgba(241,213,122,0.4)" }} />
        <div className="relative">
          <div className="stamp-font" style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--gold-light)" }}>
            TAP TO ENTER
          </div>
          <div className="en-serif mt-1" style={{ fontSize: 32, fontWeight: 700, letterSpacing: "0.04em" }}>
            I JUST FUMBLED
          </div>
          <div className="mt-1" style={{ fontSize: 13, color: "rgba(250,243,224,0.75)" }}>
            我刚刚翻车了 — 把它变成一张彩票
          </div>
        </div>
      </motion.button>

      {/* stats row */}
      <section className="mt-6 grid grid-cols-3 gap-2">
        <Stat label="今日翻车" value={String(todayCount)} suffix="次" />
        <Stat label="累计票券" value={String(tickets.length)} suffix="张" />
        <Stat label="传奇典藏" value={String(legendaryCount)} suffix="张" gold />
      </section>

      {/* recent */}
      <section className="mt-7">
        <div className="flex items-baseline justify-between">
          <h3 className="en-serif" style={{ fontSize: 18, letterSpacing: "0.04em" }}>Recent Issues</h3>
          <span className="stamp-font" style={{ fontSize: 10, color: "var(--ink-faint)" }}>近期发行</span>
        </div>
        <div className="mt-3 space-y-2">
          {recent.length === 0 && (
            <div className="text-center py-8" style={{ color: "var(--ink-faint)", fontSize: 13 }}>
              还没有发行任何彩票<br />
              <span style={{ fontSize: 11 }}>下次翻车，记得来这里。</span>
            </div>
          )}
          {recent.map(t => (
            <RecentRow key={t.id} ticket={t} onClick={() => onOpenTicket(t.id)} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, suffix, gold }: { label: string; value: string; suffix: string; gold?: boolean }) {
  return (
    <div
      className="text-center px-2 py-3 paper-texture"
      style={{
        background: "var(--bone)",
        borderRadius: 4,
        border: "1px solid rgba(42,24,16,0.2)",
        boxShadow: "0 2px 6px rgba(42,24,16,0.08)",
      }}
    >
      <div className="en-serif" style={{ fontSize: 24, fontWeight: 600, color: gold ? "var(--gold-deep)" : "var(--ink)", lineHeight: 1 }}>
        {value}
      </div>
      <div className="mt-1 stamp-font" style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.1em" }}>
        {label} · {suffix}
      </div>
    </div>
  );
}

function RecentRow({ ticket, onClick }: { ticket: any; onClick: () => void }) {
  const tier = TIER_META[ticket.tier as keyof typeof TIER_META];
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 paper-texture text-left"
      style={{
        background: "var(--bone)",
        borderRadius: 3,
        border: "1px solid rgba(42,24,16,0.18)",
      }}
    >
      <div className="ink-stamp-circle" style={{ width: 38, height: 38, fontSize: 8, padding: 2, borderColor: tier.ring, color: tier.ring }}>
        {tier.label}
      </div>
      <div className="flex-1 min-w-0">
        <div className="serial">№ {ticket.serial}</div>
        <div className="truncate" style={{ fontSize: 13, color: "var(--ink)" }}>{ticket.message}</div>
      </div>
      <div className="stamp-font" style={{ fontSize: 9, color: "var(--ink-faint)" }}>
        {new Date(ticket.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit" })}
      </div>
    </button>
  );
}
