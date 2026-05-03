import type { Ticket as TicketType } from "../types";
import { getCategory, TIER_META } from "../data";
import { TicketMotif } from "./TicketMotif";

interface Props {
  ticket: TicketType;
  size?: "lg" | "md" | "sm";
  showStub?: boolean;
}

/**
 * Retro票券. Two-part: main body (left) + stub (right) divided by perforation.
 */
export function Ticket({ ticket, size = "lg", showStub = true }: Props) {
  const cat = getCategory(ticket.category);
  const tier = TIER_META[ticket.tier];
  const isLegendary = ticket.tier === "legendary";
  const isEpic = ticket.tier === "epic";

  const dateStr = new Date(ticket.createdAt).toLocaleDateString("zh-CN", {
    year: "numeric", month: "2-digit", day: "2-digit",
  });

  const dimClass = size === "lg" ? "w-full max-w-[360px]" : size === "md" ? "w-[280px]" : "w-[220px]";

  return (
    <div
      className={`relative ${dimClass} select-none`}
      style={{ aspectRatio: showStub ? "1.7 / 1" : "1.5 / 1" }}
    >
      {/* glow for high tiers */}
      {isLegendary && (
        <div className="absolute -inset-4 rounded-2xl pointer-events-none"
             style={{ background: "radial-gradient(circle, rgba(245,200,80,0.55), transparent 70%)", filter: "blur(8px)" }} />
      )}

      <div
        className="relative w-full h-full flex overflow-hidden paper-texture vignette"
        style={{
          background: isLegendary
            ? "linear-gradient(135deg, #fff4c2 0%, #f1d57a 50%, #d4a017 100%)"
            : isEpic
            ? "linear-gradient(135deg, #f3e6cc 0%, #e9d3a5 100%)"
            : "var(--bone)",
          borderRadius: 6,
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.6) inset, 0 0 0 1px rgba(42,24,16,0.15), 0 8px 22px rgba(42,24,16,0.18), 0 2px 4px rgba(42,24,16,0.12)",
          border: `1.5px solid ${isLegendary ? "#b8860b" : "rgba(42,24,16,0.45)"}`,
        }}
      >
        {/* outer ornate frame */}
        <div className="absolute inset-1.5 rounded pointer-events-none"
             style={{ border: `1px ${isLegendary ? "solid" : "dashed"} ${isLegendary ? "#8a6508" : "rgba(42,24,16,0.35)"}` }} />

        {/* MAIN BODY */}
        <div className="relative flex-1 flex flex-col px-4 py-3">
          {/* header */}
          <div className="flex items-center justify-between" style={{ borderBottom: "1px solid rgba(42,24,16,0.25)", paddingBottom: 4 }}>
            <div className="flex items-center gap-2">
              <span className="serial">№ {ticket.serial}</span>
            </div>
            <span className="stamp-font" style={{ fontSize: 10, color: "var(--ink-faint)" }}>
              FUMBLE · 失手券
            </span>
          </div>

          {/* title */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="en-serif" style={{ fontSize: size === "lg" ? 32 : 24, fontWeight: 700, color: "var(--ink)", letterSpacing: "0.04em", lineHeight: 1 }}>
              {cat.ticketTitle}
            </span>
            <span style={{ fontSize: size === "lg" ? 13 : 11, color: "var(--ink-faint)" }}>· {cat.label}</span>
          </div>

          {/* motif + message */}
          <div className="flex-1 flex items-center gap-3 mt-2">
            <div className="shrink-0">
              <TicketMotif motif={ticket.motif} category={ticket.category} size={size === "lg" ? 56 : 44} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={isLegendary ? "gold-foil" : ""}
                style={{
                  fontSize: size === "lg" ? 15 : 13,
                  lineHeight: 1.5,
                  color: isLegendary ? undefined : "var(--ink)",
                  fontWeight: 500,
                }}
              >
                {ticket.message}
              </p>
              {ticket.poem && (
                <p className="mt-1" style={{ fontSize: size === "lg" ? 11 : 10, color: "var(--ink-faint)", fontStyle: "italic" }}>
                  {ticket.poem}
                </p>
              )}
            </div>
          </div>

          {/* footer */}
          <div className="flex items-end justify-between mt-2" style={{ borderTop: "1px solid rgba(42,24,16,0.2)", paddingTop: 4 }}>
            <div className="serial" style={{ fontSize: 10 }}>{dateStr}</div>
            <div className="ink-stamp" style={{ fontSize: 9, padding: "1px 5px" }}>{tier.en}</div>
          </div>
        </div>

        {showStub && (
          <>
            {/* perforation */}
            <div className="ticket-perf-v" style={{ width: 1 }} />

            {/* STUB */}
            <div
              className="relative flex flex-col items-center justify-between py-3 px-2"
              style={{ width: size === "lg" ? 70 : 56, background: "rgba(42,24,16,0.04)" }}
            >
              <div className="serial" style={{ fontSize: 9, transform: "rotate(180deg)", writingMode: "vertical-rl" as const }}>
                FUMBLE TICKET
              </div>
              <div
                className="ink-stamp-circle"
                style={{ width: size === "lg" ? 50 : 40, height: size === "lg" ? 50 : 40, fontSize: 9, lineHeight: 1.05, padding: 4 }}
              >
                {tier.label}
                <br />
                券
              </div>
              <div className="serial" style={{ fontSize: 9, writingMode: "vertical-rl" as const }}>
                № {ticket.serial.split("-").pop()}
              </div>
            </div>

            {/* perforation holes (top/bottom on the seam) */}
            <div className="absolute" style={{ left: `calc(100% - ${size === "lg" ? 70 : 56}px - 4px)`, top: -4, width: 8, height: 8, borderRadius: 9999, background: "var(--paper)", border: "1px solid rgba(42,24,16,0.2)" }} />
            <div className="absolute" style={{ left: `calc(100% - ${size === "lg" ? 70 : 56}px - 4px)`, bottom: -4, width: 8, height: 8, borderRadius: 9999, background: "var(--paper)", border: "1px solid rgba(42,24,16,0.2)" }} />
          </>
        )}

        {/* legendary corner ornaments */}
        {isLegendary && (
          <>
            <CornerFlourish className="absolute top-1 left-1" />
            <CornerFlourish className="absolute top-1 right-1" flip />
            <CornerFlourish className="absolute bottom-1 left-1" flipV />
            <CornerFlourish className="absolute bottom-1 right-1" flip flipV />
          </>
        )}
      </div>
    </div>
  );
}

function CornerFlourish({ className, flip, flipV }: { className?: string; flip?: boolean; flipV?: boolean }) {
  return (
    <svg
      className={className}
      width="22" height="22" viewBox="0 0 22 22"
      style={{ transform: `scale(${flip ? -1 : 1}, ${flipV ? -1 : 1})` }}
    >
      <path d="M1 1 L8 1 M1 1 L1 8 M3 3 Q10 3 10 10" stroke="#8a6508" strokeWidth="1" fill="none" />
      <circle cx="11" cy="11" r="1.2" fill="#8a6508" />
    </svg>
  );
}
