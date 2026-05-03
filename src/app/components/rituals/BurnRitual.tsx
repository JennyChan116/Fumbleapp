import { useState } from "react";
import { motion } from "motion/react";

interface Props { onComplete: () => void; }

/** 情绪·其他 — 写一封烧给自己的信：写字 → 点燃 → 化为灰 */
export function BurnRitual({ onComplete }: Props) {
  const [text, setText] = useState("");
  const [lit, setLit] = useState(false);
  const [burnRatio, setBurnRatio] = useState(0);
  const [done, setDone] = useState(false);

  const ignite = () => {
    if (lit) return;
    setLit(true);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 2200);
      setBurnRatio(t);
      if (t < 1) requestAnimationFrame(tick);
      else { setDone(true); setTimeout(onComplete, 400); }
    };
    requestAnimationFrame(tick);
  };

  return (
    <div className="absolute inset-0 rounded-[6px] overflow-hidden flex flex-col items-center justify-center px-5"
         style={{ background: "radial-gradient(circle at 50% 60%, #2a1408, #0a0402 80%)", touchAction: "none" }}>
      <div className="absolute top-3 left-0 right-0 text-center stamp-font pointer-events-none"
           style={{ color: "rgba(241,213,122,0.7)", fontSize: 11, letterSpacing: "0.15em" }}>
        {!lit ? "写下说不出口的 · WRITE & BURN" : "让火带走它 · LET IT GO"}
      </div>

      <motion.div
        animate={lit ? { y: -burnRatio * 60, rotate: burnRatio * 3, opacity: 1 - burnRatio * 0.7 } : {}}
        className="relative"
        style={{ width: 240 }}
      >
        {/* paper */}
        <div className="paper-texture relative"
          style={{
            background: "var(--bone)",
            padding: "16px 14px",
            border: "1px solid var(--ink)",
            borderRadius: 2,
            minHeight: 160,
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
            // burn from top: mask hides upper portion progressively
            WebkitMaskImage: lit
              ? `linear-gradient(to bottom, transparent 0%, transparent ${burnRatio * 70}%, rgba(0,0,0,0.5) ${burnRatio * 70 + 5}%, black ${burnRatio * 70 + 12}%)`
              : "none",
            maskImage: lit
              ? `linear-gradient(to bottom, transparent 0%, transparent ${burnRatio * 70}%, rgba(0,0,0,0.5) ${burnRatio * 70 + 5}%, black ${burnRatio * 70 + 12}%)`
              : "none",
          }}
        >
          <div className="stamp-font" style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--ink-faint)" }}>
            DEAR ME,
          </div>
          {!lit ? (
            <textarea
              value={text}
              onChange={e => setText(e.target.value.slice(0, 80))}
              rows={5}
              autoFocus
              placeholder="把心里的话写下来…"
              className="mt-2 w-full bg-transparent outline-none resize-none"
              style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.6, fontFamily: "var(--font-serif-cn)" }}
            />
          ) : (
            <div className="mt-2" style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink)", whiteSpace: "pre-wrap", minHeight: 80 }}>
              {text || "（一片留白也是回信）"}
            </div>
          )}
          <div className="mt-2 text-right serial">— {new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" })}</div>

          {/* burning edge */}
          {lit && burnRatio < 0.95 && (
            <div className="absolute left-0 right-0 pointer-events-none" style={{ top: `${burnRatio * 70}%`, height: 12, background: "linear-gradient(to bottom, transparent, #ff7a18, #c0392b)", filter: "blur(4px)" }} />
          )}
        </div>

        {/* embers */}
        {lit && Array.from({ length: 14 }).map((_, i) => (
          <motion.div key={i}
            className="absolute"
            style={{ left: `${10 + (i * 7) % 80}%`, top: `${burnRatio * 60}%`, width: 4, height: 4, borderRadius: 9999, background: i % 2 ? "#ff7a18" : "#f1d57a" }}
            animate={{ y: [-10, -120 - i * 8], opacity: [1, 0], x: (i % 2 ? -1 : 1) * (i * 3) }}
            transition={{ duration: 1.5 + (i % 5) * 0.2, ease: "easeOut" }}
          />
        ))}
      </motion.div>

      {/* match / ignite button */}
      {!lit && (
        <button onClick={ignite}
          disabled={!text.trim()}
          className="mt-5 flex items-center gap-2 px-5 py-2"
          style={{
            background: text.trim() ? "linear-gradient(to bottom, #c0392b, #7a1f15)" : "rgba(120,60,40,0.3)",
            color: "#fff5e0",
            borderRadius: 3,
            border: "1px solid #2a0a04",
            opacity: text.trim() ? 1 : 0.5,
            boxShadow: text.trim() ? "0 0 20px rgba(255,140,40,0.4)" : "none",
          }}
        >
          <span style={{ fontSize: 16 }}>🔥</span>
          <span className="stamp-font" style={{ fontSize: 11, letterSpacing: "0.2em" }}>IGNITE · 点燃</span>
        </button>
      )}

      {done && (
        <div className="absolute bottom-6 left-0 right-0 text-center stamp-font" style={{ color: "rgba(241,213,122,0.6)", fontSize: 10, letterSpacing: "0.2em" }}>
          已 化 为 灰
        </div>
      )}
    </div>
  );
}
