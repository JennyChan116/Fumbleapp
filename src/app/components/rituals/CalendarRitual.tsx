import { useRef, useState } from "react";
import { motion } from "motion/react";

interface Props { onComplete: () => void; }

/** 拖延 — 一页过期日历，向下拖拽撕掉 */
export function CalendarRitual({ onComplete }: Props) {
  const [drag, setDrag] = useState(0); // 0..1 normalized
  const [torn, setTorn] = useState(false);
  const startY = useRef<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const onDown = (e: React.PointerEvent) => {
    startY.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (startY.current == null) return;
    const r = wrapRef.current!.getBoundingClientRect();
    const dy = (e.clientY - startY.current) / r.height;
    setDrag(Math.max(0, Math.min(1.2, dy)));
  };
  const onUp = () => {
    if (drag > 0.55 && !torn) {
      setTorn(true);
      setTimeout(onComplete, 700);
    } else {
      setDrag(0);
    }
    startY.current = null;
  };

  const today = new Date();
  const month = today.toLocaleString("en-US", { month: "long" }).toUpperCase();
  const day = today.getDate();
  const weekday = today.toLocaleString("en-US", { weekday: "long" }).toUpperCase();

  return (
    <div ref={wrapRef}
         className="absolute inset-0 rounded-[6px] overflow-hidden flex items-center justify-center"
         style={{ background: "linear-gradient(180deg, #2a1810 0%, #1a0e08 100%)", touchAction: "none" }}>
      <div className="absolute top-3 left-0 right-0 text-center stamp-font pointer-events-none"
           style={{ color: "rgba(241,213,122,0.7)", fontSize: 11, letterSpacing: "0.15em" }}>
        向下拖拽 撕掉这一页 · DRAG DOWN TO TEAR
      </div>

      <motion.div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        animate={torn ? { y: 500, rotate: 18, opacity: 0 } : { y: drag * 60, rotate: drag * 4 }}
        transition={torn ? { duration: 0.7, ease: "easeIn" } : { type: "spring", stiffness: 300, damping: 20 }}
        className="relative"
        style={{ cursor: "grab", touchAction: "none" }}
      >
        {/* binding */}
        <div className="absolute -top-2 left-0 right-0 flex justify-center gap-12 pointer-events-none">
          <div style={{ width: 6, height: 14, borderRadius: 3, background: "#666", border: "1px solid #222" }} />
          <div style={{ width: 6, height: 14, borderRadius: 3, background: "#666", border: "1px solid #222" }} />
        </div>
        {/* page */}
        <div className="paper-texture relative"
          style={{
            width: 180, padding: "20px 18px 24px", background: "var(--bone)",
            border: "1px solid #2a1810", borderRadius: 4,
            boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
          }}>
          <div className="text-center stamp-font" style={{ fontSize: 11, letterSpacing: "0.2em", color: "var(--ink-soft)", borderBottom: "1px solid var(--ink-faint)", paddingBottom: 6 }}>
            {month}
          </div>
          <div className="en-serif text-center" style={{ fontSize: 84, fontWeight: 700, lineHeight: 1, color: "var(--ink)", marginTop: 10 }}>
            {day}
          </div>
          <div className="text-center stamp-font" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-faint)", marginTop: 4 }}>
            {weekday}
          </div>
          {/* expired stamp */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ink-stamp" style={{ fontSize: 14, padding: "4px 10px", transform: "translate(-50%,-50%) rotate(-14deg)" }}>
            EXPIRED
          </div>

          {/* tear hint at bottom */}
          {!torn && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center" style={{ transform: "translateY(60%)" }}>
              <div style={{
                width: "70%", height: 6,
                background: "repeating-linear-gradient(45deg, var(--paper-edge), var(--paper-edge) 4px, transparent 4px, transparent 8px)",
                opacity: 0.5,
              }} />
            </div>
          )}
        </div>
      </motion.div>

      {/* progress */}
      {!torn && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
          <div className="h-full" style={{ width: `${Math.min(100, drag / 0.55 * 100)}%`, background: "rgba(241,213,122,0.85)" }} />
        </div>
      )}
    </div>
  );
}
