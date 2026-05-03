import { useState, useRef } from "react";
import { motion } from "motion/react";

interface Props { onComplete: () => void; }

/** 摔了 — 4 块碎片散落，拖回各自原位拼好 */
export function PuzzleRitual({ onComplete }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // 4 quadrants: target positions are (0,0),(1,0),(0,1),(1,1) of a 2x2 grid (in % of half)
  const [pieces, setPieces] = useState(() =>
    [
      { id: 0, tx: 0, ty: 0, x: -0.28, y: -0.22, rot: -18, locked: false },
      { id: 1, tx: 1, ty: 0, x:  0.28, y: -0.26, rot:  22, locked: false },
      { id: 2, tx: 0, ty: 1, x: -0.30, y:  0.24, rot:  16, locked: false },
      { id: 3, tx: 1, ty: 1, x:  0.26, y:  0.28, rot: -24, locked: false },
    ]
  );

  const onDragEnd = (i: number, dx: number, dy: number) => {
    setPieces(prev => {
      const p = prev[i];
      const newX = p.x + dx;
      const newY = p.y + dy;
      // target offset from center for each tile (in normalized half-units)
      const targetX = (p.tx === 0 ? -0.5 : 0.5) * 0.5; // -0.25 / 0.25
      const targetY = (p.ty === 0 ? -0.5 : 0.5) * 0.5;
      const close = Math.hypot(newX - targetX, newY - targetY) < 0.08;
      const next = [...prev];
      next[i] = close
        ? { ...p, x: targetX, y: targetY, rot: 0, locked: true }
        : { ...p, x: newX, y: newY };
      // check all locked
      if (next.every(pp => pp.locked)) {
        setTimeout(onComplete, 400);
      }
      return next;
    });
  };

  return (
    <div ref={wrapRef} className="absolute inset-0 rounded-[6px] overflow-hidden"
         style={{ background: "radial-gradient(circle at 50% 50%, #2a1a12, #0e0805)", touchAction: "none" }}>
      <div className="absolute top-3 left-0 right-0 text-center stamp-font pointer-events-none"
           style={{ color: "rgba(241,213,122,0.7)", fontSize: 11, letterSpacing: "0.15em" }}>
        拼回原状 · DRAG TO MEND
      </div>

      {/* target outline */}
      <div className="absolute" style={{ left: "50%", top: "50%", width: "55%", aspectRatio: "1.5/1", transform: "translate(-50%,-50%)", border: "1px dashed rgba(241,213,122,0.3)", borderRadius: 4 }} />

      {pieces.map((p, i) => (
        <motion.div
          key={p.id}
          drag={!p.locked}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            const r = wrapRef.current!.getBoundingClientRect();
            onDragEnd(i, info.offset.x / r.width, info.offset.y / r.height);
          }}
          animate={{ x: `${p.x * 100}%`, y: `${p.y * 100}%`, rotate: p.rot }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="absolute"
          style={{
            left: "50%", top: "50%",
            width: "27.5%", aspectRatio: "1.5/1",
            marginLeft: "-13.75%", marginTop: "-9.16%",
            background: p.locked ? "var(--bone)" : "#f3e3bf",
            border: `1px solid ${p.locked ? "var(--gold)" : "rgba(42,24,16,0.5)"}`,
            borderRadius: 2,
            boxShadow: p.locked ? "0 0 12px rgba(241,213,122,0.4)" : "0 4px 8px rgba(0,0,0,0.5)",
            cursor: p.locked ? "default" : "grab",
            // small inner ornament hint
            backgroundImage: `linear-gradient(${p.tx === p.ty ? 135 : 45}deg, transparent 60%, rgba(184,134,11,0.15))`,
          }}
        >
          <div className="absolute inset-1 pointer-events-none" style={{ border: "1px dashed rgba(42,24,16,0.3)", borderRadius: 1 }} />
        </motion.div>
      ))}
    </div>
  );
}