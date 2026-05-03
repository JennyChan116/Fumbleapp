import { useEffect, useRef, useState } from "react";

interface Props { onComplete: () => void; }

/**
 * 破防 — 屏幕显示一道破碎的裂痕，用户用手指沿着裂缝描金，缝合即完成。
 */
export function KintsugiRitual({ onComplete }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState<{ x: number; y: number }[]>([]);
  const [done, setDone] = useState(false);

  // pre-defined crack path (relative coords)
  const crack = [
    { x: 0.15, y: 0.2 }, { x: 0.28, y: 0.3 }, { x: 0.36, y: 0.42 },
    { x: 0.5, y: 0.5 }, { x: 0.6, y: 0.62 }, { x: 0.72, y: 0.7 },
    { x: 0.85, y: 0.82 },
  ];

  const [hits, setHits] = useState<boolean[]>(crack.map(() => false));

  useEffect(() => {
    if (done) return;
    if (hits.every(Boolean)) {
      setDone(true);
      setTimeout(onComplete, 900);
    }
  }, [hits, done, onComplete]);

  const trackPos = (e: React.PointerEvent) => {
    const r = wrapRef.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setPath(p => [...p.slice(-50), { x: px, y: py }]);
    setHits(h => h.map((hit, i) => hit || (Math.hypot(px - crack[i].x, py - crack[i].y) < 0.07)));
  };

  return (
    <div
      ref={wrapRef}
      onPointerDown={trackPos}
      onPointerMove={(e) => { if (e.buttons || (e as any).pointerType === "touch") trackPos(e); }}
      className="absolute inset-0 rounded-[6px] overflow-hidden"
      style={{
        background: "radial-gradient(circle at 50% 50%, #1a1410 0%, #0a0805 100%)",
        touchAction: "none",
      }}
    >
      <div className="absolute top-3 left-0 right-0 text-center stamp-font pointer-events-none"
           style={{ color: "rgba(241,213,122,0.7)", fontSize: 11, letterSpacing: "0.15em" }}>
        以金缮裂痕 · TRACE WITH GOLD
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* base crack — dim */}
        <path
          d={`M ${crack[0].x * 100} ${crack[0].y * 100} ` + crack.slice(1).map(p => `L ${p.x * 100} ${p.y * 100}`).join(" ")}
          stroke="rgba(180,180,180,0.25)"
          strokeWidth="0.4"
          fill="none"
          strokeDasharray="1.5 1"
        />
        {/* hit nodes */}
        {crack.map((p, i) => (
          <g key={i}>
            <circle cx={p.x * 100} cy={p.y * 100} r="1.4" fill={hits[i] ? "#f1d57a" : "rgba(241,213,122,0.25)"} />
            {hits[i] && (
              <circle cx={p.x * 100} cy={p.y * 100} r="2.4" fill="none" stroke="#f1d57a" strokeWidth="0.3" opacity="0.6" />
            )}
          </g>
        ))}
        {/* gold path being drawn */}
        {path.length > 1 && (
          <polyline
            points={path.map(p => `${p.x * 100},${p.y * 100}`).join(" ")}
            stroke="url(#gold)"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        )}
        {/* connecting gold over hit nodes */}
        <polyline
          points={crack.filter((_, i) => hits[i]).map(p => `${p.x * 100},${p.y * 100}`).join(" ")}
          stroke="url(#gold)"
          strokeWidth="0.9"
          fill="none"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff2b3" />
            <stop offset="0.5" stopColor="#f1d57a" />
            <stop offset="1" stopColor="#b8860b" />
          </linearGradient>
        </defs>
      </svg>

      {/* progress */}
      <div className="absolute bottom-3 left-0 right-0 text-center stamp-font pointer-events-none"
           style={{ color: "rgba(241,213,122,0.6)", fontSize: 9, letterSpacing: "0.2em" }}>
        {hits.filter(Boolean).length} / {crack.length}
      </div>
    </div>
  );
}
