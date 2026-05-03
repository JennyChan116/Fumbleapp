import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { Ticket as TicketType, Tier } from "../types";
import { CATEGORIES, TIER_META } from "../data";
import { Ticket } from "./Ticket";

interface Props {
  tickets: TicketType[];
  onOpen: (id: string) => void;
}

type Filter = "all" | "daily" | "emotion" | Tier;

export function TicketBook({ tickets, onOpen }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    let arr = tickets;
    if (filter === "daily" || filter === "emotion") {
      const ids = CATEGORIES.filter(c => c.layer === filter).map(c => c.id);
      arr = arr.filter(t => ids.includes(t.category));
    } else if (filter !== "all") {
      arr = arr.filter(t => t.tier === filter);
    }
    return [...arr].sort((a, b) => b.createdAt - a.createdAt);
  }, [tickets, filter]);

  const stats = useMemo(() => ({
    common: tickets.filter(t => t.tier === "common").length,
    rare: tickets.filter(t => t.tier === "rare").length,
    epic: tickets.filter(t => t.tier === "epic").length,
    legendary: tickets.filter(t => t.tier === "legendary").length,
  }), [tickets]);

  const filters: Array<{ id: Filter; label: string; en: string }> = [
    { id: "all", label: "全部", en: "ALL" },
    { id: "daily", label: "日常", en: "DAILY" },
    { id: "emotion", label: "情绪", en: "HEART" },
    { id: "legendary", label: "传奇", en: "LGD" },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 pt-8 pb-3">
        <div className="text-center">
          <div className="stamp-font" style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--ink-faint)" }}>
            COLLECTION VOLUME 01
          </div>
          <h1 className="en-serif" style={{ fontSize: 32, fontWeight: 700, letterSpacing: "0.04em" }}>
            Ticket Book
          </h1>
          <div style={{ fontSize: 12, color: "var(--ink-soft)", letterSpacing: "0.15em" }}>失 手 纪 念 册</div>
        </div>

        {/* tier counters */}
        <div className="mt-4 flex justify-center gap-3">
          <TierBadge tier="common" count={stats.common} />
          <TierBadge tier="rare" count={stats.rare} />
          <TierBadge tier="epic" count={stats.epic} />
          <TierBadge tier="legendary" count={stats.legendary} />
        </div>

        {/* filter row */}
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="shrink-0 px-3 py-1 stamp-font transition"
              style={{
                background: filter === f.id ? "var(--ink)" : "transparent",
                color: filter === f.id ? "var(--bone)" : "var(--ink-soft)",
                border: "1px solid " + (filter === f.id ? "var(--ink)" : "rgba(42,24,16,0.3)"),
                borderRadius: 2,
                fontSize: 10,
                letterSpacing: "0.15em",
              }}
            >
              {f.en} · {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-28">
        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: "var(--ink-faint)" }}>
            <div style={{ fontSize: 14 }}>这一类还没有票券</div>
            <div className="mt-1 stamp-font" style={{ fontSize: 10 }}>EMPTY VOLUME</div>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            {filtered.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
                onClick={() => onOpen(t.id)}
                className="cursor-pointer flex justify-center"
                style={{
                  filter: t.tier === "common" ? "none" : "drop-shadow(0 6px 14px rgba(42,24,16,0.18))",
                }}
              >
                <Ticket ticket={t} size="lg" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TierBadge({ tier, count }: { tier: Tier; count: number }) {
  const meta = TIER_META[tier];
  const isLgd = tier === "legendary";
  return (
    <div className="text-center">
      <div
        className="ink-stamp-circle"
        style={{
          width: 48, height: 48, fontSize: 9,
          borderColor: meta.ring, color: meta.ring,
          background: isLgd && count > 0 ? "rgba(241,213,122,0.15)" : "transparent",
        }}
      >
        <div className="en-serif" style={{ fontSize: 14, fontWeight: 700 }}>{count}</div>
      </div>
      <div className="mt-1 stamp-font" style={{ fontSize: 8, letterSpacing: "0.15em", color: "var(--ink-faint)" }}>
        {meta.en}
      </div>
    </div>
  );
}
