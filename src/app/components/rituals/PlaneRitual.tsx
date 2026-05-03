import { useRef, useState } from "react";
import { motion } from "motion/react";

interface Props { onComplete: () => void; }

/** 被拒了 — 把退件信折成纸飞机，然后向上甩出去 */
export function PlaneRitual({ onComplete }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [folded, setFolded] = useState(false);
  const [flying, setFlying] = useState(false);
  const startRef = useRef<{ x: number; y: number; t: number } | null>(null);

  const onDown = (e: React.PointerEvent) => {
    startRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onUp = (e: React.PointerEvent) => {
    if (!startRef.current) return;
    const dy = e.clientY - startRef.current.y;
    const dt = performance.now() - startRef.current.t;
    const upSwipe = dy < -40 && dt < 600;
    if (!folded && upSwipe) {
      setFolded(true);
    } else if (folded && upSwipe) {
      setFlying(true);
      setTimeout(onComplete, 900);
    }
    startRef.current = null;
  };

  return (
    <div ref={wrapRef}
         className="absolute inset-0 rounded-[6px] overflow-hidden flex items-center justify-center"
         style={{ background: "linear-gradient(180deg, #1f2a3e 0%, #14192a 100%)", touchAction: "none" }}>
      <div className="absolute top-3 left-0 right-0 text-center stamp-font pointer-events-none"
           style={{ color: "rgba(241,213,122,0.7)", fontSize: 11, letterSpacing: "0.15em" }}>
        {folded ? "再向上一甩 · SWIPE UP TO RELEASE" : "向上滑动 折成纸飞机 · SWIPE UP TO FOLD"}
      </div>

      <motion.div
        onPointerDown={onDown}
        onPointerUp={onUp}
        animate={
          flying
            ? { y: -400, x: 100, rotate: -25, opacity: 0 }
            : folded
            ? { rotate: 0, scale: 1 }
            : { rotate: 0, scale: 1 }
        }
        transition={flying ? { duration: 0.9, ease: "easeOut" } : { type: "spring", stiffness: 200, damping: 18 }}
        style={{ touchAction: "none", cursor: "grab" }}
      >
        {folded ? <PaperPlane /> : <RejectionLetter />}
      </motion.div>

      {/* clouds in distance */}
      {flying && (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div key={i} className="absolute"
              style={{ left: `${10 + i * 18}%`, top: `${20 + (i % 2) * 30}%`, opacity: 0.35 }}
              initial={{ y: 0 }} animate={{ y: 40 }} transition={{ duration: 0.9 }}>
              <svg width="36" height="20" viewBox="0 0 36 20">
                <ellipse cx="18" cy="14" rx="16" ry="6" fill="rgba(241,213,122,0.5)" />
                <ellipse cx="12" cy="11" rx="8" ry="5" fill="rgba(241,213,122,0.5)" />
                <ellipse cx="22" cy="10" rx="7" ry="5" fill="rgba(241,213,122,0.5)" />
              </svg>
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}

function RejectionLetter() {
  return (
    <svg width="180" height="120" viewBox="0 0 180 120">
      <rect x="6" y="6" width="168" height="108" fill="#f4ebd0" stroke="#2a1810" strokeWidth="1.5" />
      <path d="M6 6 L90 64 L174 6" stroke="#2a1810" strokeWidth="1" fill="none" />
      <text x="90" y="86" textAnchor="middle" fontFamily="Special Elite" fontSize="14" fill="#c0392b" letterSpacing="3" transform="rotate(-8 90 86)">REJECTED</text>
      <rect x="60" y="74" width="60" height="20" fill="none" stroke="#c0392b" strokeWidth="1.5" transform="rotate(-8 90 84)" />
      {/* postage stamp */}
      <rect x="140" y="14" width="22" height="26" fill="#8b1e3f" stroke="#2a1810" />
      <rect x="142" y="16" width="18" height="22" fill="none" stroke="#f4ebd0" strokeDasharray="1.5 1" />
    </svg>
  );
}

function PaperPlane() {
  return (
    <svg width="160" height="100" viewBox="0 0 160 100">
      <defs>
        <linearGradient id="pp" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff8e0" />
          <stop offset="1" stopColor="#d4c89a" />
        </linearGradient>
      </defs>
      <path d="M10 50 L150 10 L90 56 L150 90 Z" fill="url(#pp)" stroke="#2a1810" strokeWidth="1.2" />
      <path d="M90 56 L150 10 M90 56 L150 90" stroke="#2a1810" strokeWidth="0.8" fill="none" />
      <path d="M10 50 L90 56" stroke="#2a1810" strokeWidth="0.6" strokeDasharray="2 2" fill="none" />
    </svg>
  );
}