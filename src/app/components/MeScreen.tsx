import type { Ticket } from "../types";
import { CATEGORIES } from "../data";
import { Coffee, Heart } from "lucide-react";
import { CategoryIcon } from "./CategoryIcon";

interface Props { tickets: Ticket[]; }

export function MeScreen({ tickets }: Props) {
  const total = tickets.length;
  const byCat = CATEGORIES.map(c => ({
    cat: c,
    count: tickets.filter(t => t.category === c.id).length,
  })).sort((a, b) => b.count - a.count);

  const top = byCat[0];
  const moodAvg = total ? (tickets.reduce((s, t) => s + t.mood, 0) / total).toFixed(1) : "—";

  // weekday histogram
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const weekdayCounts = Array(7).fill(0);
  tickets.forEach(t => { weekdayCounts[new Date(t.createdAt).getDay()]++; });
  const maxWd = Math.max(1, ...weekdayCounts);

  return (
    <div className="h-full overflow-y-auto no-scrollbar px-5 pt-8 pb-28">
      <div className="text-center">
        <div className="stamp-font" style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--ink-faint)" }}>
          MEMBERSHIP CARD
        </div>
        <h1 className="en-serif" style={{ fontSize: 28, fontWeight: 700, letterSpacing: "0.04em" }}>
          The Fumbler
        </h1>
        <div style={{ fontSize: 12, color: "var(--ink-soft)", letterSpacing: "0.15em" }}>翻 · 车 · 履 · 历</div>
      </div>

      <div className="mt-6 paper-texture" style={{ background: "var(--bone)", border: "1.5px solid var(--ink)", borderRadius: 4, padding: 18 }}>
        <div className="flex items-center gap-3">
          <div className="ink-stamp-circle" style={{ width: 56, height: 56, fontSize: 11 }}>
            <div className="en-serif" style={{ fontSize: 18, fontWeight: 700 }}>{total}</div>
          </div>
          <div className="flex-1">
            <div className="en-serif" style={{ fontSize: 18, fontWeight: 600 }}>第 {total} 次失手</div>
            <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>已发行票券 · 限量典藏</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat label="最常翻车" value={top?.cat.label || "—"} />
          <Stat label="心情指数" value={moodAvg} />
        </div>
      </div>

      {/* weekday heatmap */}
      <div className="mt-5">
        <div className="stamp-font" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-faint)" }}>
          WEEKLY PATTERN · 一周翻车热力图
        </div>
        <div className="mt-3 flex items-end justify-between gap-1.5 h-24">
          {weekdayCounts.map((c, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full"
                style={{
                  height: `${(c / maxWd) * 80}px`,
                  background: c === maxWd && c > 0 ? "var(--crimson)" : "var(--ink)",
                  borderRadius: 1,
                  opacity: c === 0 ? 0.15 : 1,
                  minHeight: 4,
                }}
              />
              <div className="stamp-font" style={{ fontSize: 9, color: "var(--ink-faint)" }}>{weekdays[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* category collection */}
      <div className="mt-6">
        <div className="stamp-font" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-faint)" }}>
          COLLECTION PROGRESS · 各类集齐进度
        </div>
        <div className="mt-3 space-y-2">
          {byCat.map(({ cat, count }) => (
            <div key={cat.id} className="flex items-center gap-3">
              <span style={{ color: cat.layer === "emotion" ? "var(--crimson)" : "var(--gold-deep)" }}>
                <CategoryIcon id={cat.id} size={18} strokeWidth={1.5} />
              </span>
              <div className="flex-1">
                <div className="flex justify-between" style={{ fontSize: 12 }}>
                  <span>{cat.label}</span>
                  <span className="serial">{count}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full" style={{ background: "rgba(42,24,16,0.1)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, count * 10)}%`,
                      background: cat.layer === "emotion" ? "var(--crimson)" : "var(--ink)",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center stamp-font" style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.2em" }}>
        FUMBLE © 2026 · MADE WITH <Heart size={9} style={{ display: "inline", verticalAlign: "middle" }} /> AND <Coffee size={9} style={{ display: "inline", verticalAlign: "middle" }} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center" style={{ background: "var(--paper)", padding: 8, borderRadius: 3 }}>
      <div className="en-serif" style={{ fontSize: 16, fontWeight: 600 }}>{value}</div>
      <div className="stamp-font" style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.1em" }}>{label}</div>
    </div>
  );
}