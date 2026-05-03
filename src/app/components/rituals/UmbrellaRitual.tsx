import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface Props { onComplete: () => void; }

/**
 * emo — 屏幕下雨，用户控制一把伞接住下落的彩票
 * 完成条件：彩票落入伞下方区域
 */
export function UmbrellaRitual({ onComplete }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [umbX, setUmbX] = useState(0.5); // ratio
  const [ticketY, setTicketY] = useState(-0.05); // ratio
  const [ticketX] = useState(() => 0.3 + Math.random() * 0.4);
  const [caught, setCaught] = useState(false);
  const [done, setDone] = useState(false);

  // animate ticket falling
  useEffect(() => {
    if (done) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      setTicketY(y => Math.min(1.1, y + dt * 0.18));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [done]);

  // detect catch
  useEffect(() => {
    if (caught || done) return;
    if (ticketY > 0.58 && ticketY < 0.72 && Math.abs(umbX - ticketX) < 0.14) {
      setCaught(true);
      setDone(true);
      setTimeout(onComplete, 700);
    }
    if (ticketY >= 1.05) {
      // missed — reset (gentle)
      setTicketY(-0.05);
    }
  }, [ticketY, umbX, ticketX, caught, done, onComplete]);

  const onMove = (e: React.PointerEvent) => {
    const r = wrapRef.current!.getBoundingClientRect();
    setUmbX(Math.max(0.08, Math.min(0.92, (e.clientX - r.left) / r.width)));
  };

  return (
    <div
      ref={wrapRef}
      onPointerMove={onMove}
      onPointerDown={onMove}
      className="absolute inset-0 rounded-[6px] overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #2a3a52 0%, #3d4d6b 40%, #4a5a7a 100%)",
        cursor: "none",
        touchAction: "none",
      }}
    >
      {/* rain */}
      <Rain />

      {/* hint */}
      <div
        className="absolute top-3 left-0 right-0 text-center stamp-font pointer-events-none"
        style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, letterSpacing: "0.15em" }}
      >
        移动接住票券 · CATCH IT
      </div>

      {/* falling ticket */}
      {!caught && (
        <div
          className="absolute"
          style={{
            left: `calc(${ticketX * 100}% - 22px)`,
            top: `calc(${ticketY * 100}% - 14px)`,
            width: 44, height: 28,
            background: "var(--bone)",
            border: "1px solid var(--ink)",
            borderRadius: 2,
            boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
            transform: `rotate(${(ticketY - 0.5) * 30}deg)`,
          }}
        >
          <div className="serial absolute inset-0 flex items-center justify-center" style={{ fontSize: 8 }}>
            FUMBLE
          </div>
        </div>
      )}

      {/* umbrella */}
      <Umbrella x={umbX} caught={caught} />

      {/* puddle */}
      <div className="absolute bottom-0 left-0 right-0 h-12" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))" }} />
    </div>
  );
}

function Rain() {
  const drops = Array.from({ length: 50 }, (_, i) => ({
    x: (i * 7.3) % 100,
    delay: (i * 0.13) % 1.4,
    dur: 0.8 + ((i * 0.07) % 0.7),
    len: 14 + (i % 3) * 6,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none">
      {drops.map((d, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${d.x}%`,
            top: -20,
            width: 1,
            height: d.len,
            background: "linear-gradient(to bottom, transparent, rgba(180,200,230,0.5))",
          }}
          animate={{ y: ["0vh", "120vh"] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

function Umbrella({ x, caught }: { x: number; caught: boolean }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x * 100}%`, bottom: "22%", transform: "translateX(-50%)" }}
      animate={caught ? { y: [0, -12, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      <svg width="120" height="80" viewBox="0 0 120 80">
        <defs>
          <linearGradient id="umb-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8b1e3f" />
            <stop offset="1" stopColor="#5e1029" />
          </linearGradient>
        </defs>
        {/* canopy */}
        <path d="M10 36 Q60 -8 110 36 Q90 36 80 32 Q70 36 60 32 Q50 36 40 32 Q30 36 10 36 Z" fill="url(#umb-g)" stroke="#2a1810" strokeWidth="1" />
        {/* ribs */}
        <path d="M60 4 L20 36 M60 4 L40 34 M60 4 L80 34 M60 4 L100 36 M60 4 L60 36" stroke="rgba(0,0,0,0.3)" strokeWidth="0.6" />
        {/* handle */}
        <path d="M60 36 L60 70 Q60 78 52 78" stroke="#2a1810" strokeWidth="2.5" fill="none" />
        <circle cx="60" cy="4" r="2" fill="#b8860b" />
      </svg>
    </motion.div>
  );
}