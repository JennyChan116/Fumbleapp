import { useRef, useState } from "react";
import { motion } from "motion/react";

interface Props { onComplete: () => void; }

/**
 * 社死 — 长按红色火漆封条，封条裂开，彩票露出
 */
export function WaxSealRitual({ onComplete }: Props) {
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [broken, setBroken] = useState(false);
  const pressingRef = useRef(false);

  const start = () => {
    if (broken) return;
    setPressing(true);
    pressingRef.current = true;
    const startT = performance.now();
    const tick = (now: number) => {
      if (!pressingRef.current) return;
      const p = Math.min(1, (now - startT) / 1400);
      setProgress(p);
      if (p >= 1) {
        setBroken(true);
        setTimeout(onComplete, 800);
      } else {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  };
  const end = () => {
    pressingRef.current = false;
    setPressing(false);
    if (!broken) setProgress(0);
  };

  return (
    <div
      className="absolute inset-0 rounded-[6px] overflow-hidden flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #1a0f0a 0%, #2a1810 100%)",
        touchAction: "none",
      }}
    >
      {/* envelope back lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 120" preserveAspectRatio="none">
        <path d="M0 0 L100 60 L200 0" stroke="#f1d57a" fill="none" strokeWidth="0.5" />
        <path d="M0 120 L100 60 L200 120" stroke="#f1d57a" fill="none" strokeWidth="0.5" />
      </svg>

      <div
        className="absolute top-3 left-0 right-0 text-center stamp-font pointer-events-none"
        style={{ color: "rgba(241,213,122,0.7)", fontSize: 11, letterSpacing: "0.15em" }}
      >
        长按破封 · HOLD TO BREAK SEAL
      </div>

      {/* wax seal */}
      <div className="relative">
        <motion.button
          onPointerDown={start}
          onPointerUp={end}
          onPointerLeave={end}
          className="relative"
          animate={broken ? { scale: [1, 1.3, 0], rotate: [0, 0, 30] } : pressing ? { scale: [1, 0.96, 1.02, 0.96] } : { scale: 1 }}
          transition={broken ? { duration: 0.7 } : pressing ? { duration: 0.4, repeat: Infinity } : {}}
          style={{ touchAction: "none" }}
        >
          <WaxSeal progress={progress} />
        </motion.button>

        {/* progress ring */}
        {pressing && !broken && (
          <svg className="absolute -inset-2 pointer-events-none" width="124" height="124" viewBox="0 0 124 124">
            <circle cx="62" cy="62" r="58" stroke="rgba(241,213,122,0.2)" strokeWidth="2" fill="none" />
            <circle
              cx="62" cy="62" r="58"
              stroke="#f1d57a" strokeWidth="2" fill="none"
              strokeDasharray={364} strokeDashoffset={364 * (1 - progress)}
              transform="rotate(-90 62 62)"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* shatter pieces */}
        {broken && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ left: "50%", top: "50%", width: 18, height: 14, background: "#8b1e3f", borderRadius: 4 }}
                  initial={{ x: -9, y: -7, opacity: 1 }}
                  animate={{ x: Math.cos(angle) * 120 - 9, y: Math.sin(angle) * 120 - 7, opacity: 0, rotate: 360 }}
                  transition={{ duration: 0.7 }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function WaxSeal({ progress }: { progress: number }) {
  const cracks = progress > 0.3;
  return (
    <svg width="108" height="108" viewBox="0 0 108 108">
      <defs>
        <radialGradient id="wax" cx="0.4" cy="0.35">
          <stop offset="0" stopColor="#c0392b" />
          <stop offset="0.6" stopColor="#8b1e3f" />
          <stop offset="1" stopColor="#3d0a18" />
        </radialGradient>
      </defs>
      {/* drip blobs */}
      <path d="M54 6 L62 16 L72 12 L78 22 L92 22 L92 36 L102 44 L96 56 L102 70 L92 82 L80 92 L66 96 L54 102 L42 96 L28 92 L16 82 L6 70 L12 56 L6 44 L16 36 L16 22 L30 22 L36 12 L46 16 Z" fill="url(#wax)" stroke="#2a0a14" strokeWidth="0.6" />
      {/* center seal: F monogram */}
      <circle cx="54" cy="54" r="22" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <text x="54" y="62" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="28" fontWeight="700" fill="rgba(255,255,255,0.85)">
        F
      </text>
      {cracks && (
        <g stroke="#1a0408" strokeWidth="1.2" fill="none" opacity={Math.min(1, (progress - 0.3) * 1.6)}>
          <path d="M54 14 L48 30 L56 44 L46 60 L52 78" />
          <path d="M20 40 L36 50 L30 64" />
          <path d="M88 50 L72 56 L78 70" />
        </g>
      )}
      {/* highlight */}
      <ellipse cx="42" cy="38" rx="14" ry="6" fill="rgba(255,200,180,0.25)" />
    </svg>
  );
}
