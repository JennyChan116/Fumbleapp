import { useRef, useState } from "react";
import { motion } from "motion/react";

interface Props { onComplete: () => void; }

/** 日常·其他 — 长按盲盒蓄力，盒子震动至破碎 */
export function SmashRitual({ onComplete }: Props) {
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [smashed, setSmashed] = useState(false);
  const pressingRef = useRef(false);

  const start = () => {
    if (smashed) return;
    setPressing(true);
    pressingRef.current = true;
    const startT = performance.now();
    const tick = (now: number) => {
      if (!pressingRef.current) return;
      const p = Math.min(1, (now - startT) / 1100);
      setProgress(p);
      if (p >= 1) {
        setSmashed(true);
        setTimeout(onComplete, 700);
      } else {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  };
  const end = () => {
    pressingRef.current = false;
    setPressing(false);
    if (!smashed) setProgress(0);
  };

  const shake = pressing ? Math.min(8, progress * 12) : 0;

  return (
    <div className="absolute inset-0 rounded-[6px] overflow-hidden flex items-center justify-center"
         style={{ background: "linear-gradient(135deg, #1a0e08 0%, #2a1810 100%)", touchAction: "none" }}>
      <div className="absolute top-3 left-0 right-0 text-center stamp-font pointer-events-none"
           style={{ color: "rgba(241,213,122,0.7)", fontSize: 11, letterSpacing: "0.15em" }}>
        长按砸开盲盒 · HOLD TO CRACK
      </div>

      <motion.button
        onPointerDown={start} onPointerUp={end} onPointerLeave={end}
        animate={smashed ? { scale: [1, 1.2, 0], rotate: 14 } : pressing ? { x: [-shake, shake, -shake] } : {}}
        transition={smashed ? { duration: 0.6 } : { duration: 0.08, repeat: Infinity }}
        style={{ touchAction: "none" }}
      >
        <BlindBox progress={progress} />
      </motion.button>

      {pressing && !smashed && (
        <svg className="absolute pointer-events-none" width="160" height="160" viewBox="0 0 160 160" style={{ top: "calc(50% - 80px)" }}>
          <circle cx="80" cy="80" r="74" stroke="rgba(241,213,122,0.2)" strokeWidth="2" fill="none" />
          <circle cx="80" cy="80" r="74" stroke="#f1d57a" strokeWidth="2" fill="none"
                  strokeDasharray={465} strokeDashoffset={465 * (1 - progress)}
                  transform="rotate(-90 80 80)" strokeLinecap="round" />
        </svg>
      )}

      {smashed && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return (
              <motion.div key={i}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ x: Math.cos(a) * 160, y: Math.sin(a) * 160, opacity: 0, rotate: 360 }}
                transition={{ duration: 0.7 }}
                className="absolute"
                style={{ width: 16, height: 12, background: "#b8860b", borderRadius: 2 }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function BlindBox({ progress }: { progress: number }) {
  const cracks = progress > 0.4;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="bb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d4a017" />
          <stop offset="1" stopColor="#8a6508" />
        </linearGradient>
      </defs>
      {/* box */}
      <path d="M16 36 L60 16 L104 36 L104 96 L60 116 L16 96 Z" fill="url(#bb)" stroke="#2a1810" strokeWidth="1.2" />
      {/* lid line */}
      <path d="M16 36 L60 56 L104 36 M60 56 L60 116" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
      {/* ribbon */}
      <path d="M40 26 L80 26 L80 106 L40 106 Z" fill="rgba(255,235,180,0.25)" />
      <path d="M60 16 L60 116 M16 36 L104 36" stroke="rgba(0,0,0,0.3)" strokeWidth="0.6" />
      {/* '?' mark */}
      <text x="60" y="78" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="36" fontWeight="700" fill="rgba(255,250,220,0.9)">?</text>
      {cracks && (
        <g stroke="#1a0408" strokeWidth="1.2" fill="none" opacity={Math.min(1, (progress - 0.4) * 2)}>
          <path d="M40 30 L46 50 L42 70" />
          <path d="M80 30 L74 52 L82 72" />
          <path d="M30 80 L50 76 L46 96" />
          <path d="M90 80 L70 76 L74 96" />
        </g>
      )}
    </svg>
  );
}
