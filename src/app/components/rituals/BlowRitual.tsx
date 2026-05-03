import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface Props { onComplete: () => void; }

/** 说错话 — 一团粉色尴尬云遮住票券，左右快速划动把它吹散 */
export function BlowRitual({ onComplete }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [intensity, setIntensity] = useState(0); // 0..1, accumulates with horizontal swipe velocity
  const lastRef = useRef<{ x: number; t: number } | null>(null);
  const [dispersed, setDispersed] = useState(false);

  // decay
  useEffect(() => {
    if (dispersed) return;
    const id = setInterval(() => {
      setIntensity(v => Math.max(0, v - 0.012));
    }, 60);
    return () => clearInterval(id);
  }, [dispersed]);

  useEffect(() => {
    if (intensity >= 1 && !dispersed) {
      setDispersed(true);
      setTimeout(onComplete, 700);
    }
  }, [intensity, dispersed, onComplete]);

  const onMove = (e: React.PointerEvent) => {
    if (!(e.buttons || (e as any).pointerType === "touch")) return;
    const r = wrapRef.current!.getBoundingClientRect();
    const x = e.clientX - r.left;
    const t = performance.now();
    if (lastRef.current) {
      const dx = Math.abs(x - lastRef.current.x);
      const dt = t - lastRef.current.t;
      const v = dt > 0 ? dx / dt : 0; // px/ms
      setIntensity(prev => Math.min(1, prev + v * 0.012));
    }
    lastRef.current = { x, t };
  };

  return (
    <div ref={wrapRef}
         onPointerDown={onMove}
         onPointerMove={onMove}
         className="absolute inset-0 rounded-[6px] overflow-hidden flex items-center justify-center"
         style={{ background: "linear-gradient(135deg, #2a1810, #3a2418)", touchAction: "none" }}>
      <div className="absolute top-3 left-0 right-0 text-center stamp-font pointer-events-none"
           style={{ color: "rgba(241,213,122,0.7)", fontSize: 11, letterSpacing: "0.15em" }}>
        快速左右划散尴尬云 · SWIPE TO DISPERSE
      </div>

      {/* embarrassment cloud */}
      <motion.div
        animate={dispersed
          ? { scale: [1, 2.8], opacity: [0.95, 0] }
          : { x: [0, intensity * 8 - 4, 0], scale: 1 - intensity * 0.4, opacity: 1 - intensity * 0.7 }}
        transition={dispersed ? { duration: 0.7 } : { duration: 0.4, repeat: Infinity }}
        className="relative"
      >
        <Cloud />
      </motion.div>

      {/* progress */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
        <div className="h-full" style={{ width: `${intensity * 100}%`, background: "rgba(241,213,122,0.85)", transition: "width 80ms linear" }} />
      </div>
    </div>
  );
}

function Cloud() {
  return (
    <svg width="180" height="120" viewBox="0 0 180 120">
      <defs>
        <radialGradient id="cl" cx="0.4" cy="0.4">
          <stop offset="0" stopColor="#f3a6b8" />
          <stop offset="1" stopColor="#c45a78" />
        </radialGradient>
      </defs>
      <g fill="url(#cl)" stroke="rgba(80,15,30,0.5)" strokeWidth="0.6">
        <circle cx="50" cy="68" r="28" />
        <circle cx="86" cy="50" r="32" />
        <circle cx="124" cy="58" r="26" />
        <circle cx="148" cy="76" r="22" />
        <circle cx="74" cy="86" r="22" />
        <circle cx="110" cy="84" r="22" />
      </g>
      {/* embarrassed face */}
      <circle cx="86" cy="56" r="2" fill="#3a0814" />
      <circle cx="116" cy="56" r="2" fill="#3a0814" />
      <path d="M88 72 Q102 64 118 72" stroke="#3a0814" strokeWidth="1.5" fill="none" />
      <path d="M70 44 Q72 38 76 40 M126 44 Q128 38 132 40" stroke="rgba(80,15,30,0.5)" strokeWidth="0.8" fill="none" />
    </svg>
  );
}
