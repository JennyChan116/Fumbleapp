import { useEffect, useRef, useState } from "react";

interface Props { onComplete: () => void; }

/**
 * 洒了 — 屏幕模拟咖啡渍 + 雾化水珠，手指擦过擦干露出彩票
 */
export function WipeRitual({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const rect = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // coffee stain base — warm wet sepia
    const g = ctx.createRadialGradient(rect.width * 0.5, rect.height * 0.5, 20, rect.width * 0.5, rect.height * 0.5, rect.width * 0.7);
    g.addColorStop(0, "rgba(82,42,18,0.85)");
    g.addColorStop(0.5, "rgba(118,72,32,0.78)");
    g.addColorStop(1, "rgba(70,38,16,0.92)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // splash blobs
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      const r = 10 + Math.random() * 40;
      const a = 0.2 + Math.random() * 0.4;
      const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, `rgba(40,20,8,${a})`);
      rg.addColorStop(1, "rgba(40,20,8,0)");
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }

    // condensation droplets (highlights)
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      const r = 2 + Math.random() * 4;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,240,210,0.35)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fill();
    }

    ctx.fillStyle = "rgba(255,235,200,0.7)";
    ctx.font = "500 13px 'Noto Serif SC', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("擦干水渍", rect.width / 2, rect.height / 2);
    ctx.font = "10px 'Special Elite', monospace";
    ctx.fillText("WIPE TO REVEAL", rect.width / 2, rect.height / 2 + 20);

    ctx.globalCompositeOperation = "destination-out";
  }, []);

  const check = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const img = ctx.getImageData(0, 0, c.width, c.height);
    let cleared = 0;
    let total = 0;
    for (let i = 3; i < img.data.length; i += 4 * 16) {
      total++;
      if (img.data[i] < 30) cleared++;
    }
    if (cleared / total > 0.5 && !done) {
      setDone(true);
      const start = performance.now();
      const fade = (now: number) => {
        const t = Math.min(1, (now - start) / 600);
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = `rgba(0,0,0,${0.05 + t * 0.2})`;
        ctx.fillRect(0, 0, c.width, c.height);
        if (t < 1) requestAnimationFrame(fade);
        else onComplete();
      };
      requestAnimationFrame(fade);
    }
  };

  const getPos = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onDown = (e: React.PointerEvent) => {
    drawingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    paint(e);
  };
  const onMove = (e: React.PointerEvent) => { if (drawingRef.current) paint(e); };
  const onUp = () => { drawingRef.current = false; check(); };
  const paint = (e: React.PointerEvent) => {
    const { x, y } = getPos(e);
    const ctx = canvasRef.current!.getContext("2d")!;
    // wipe with soft brush
    const grad = ctx.createRadialGradient(x, y, 0, x, y, 32);
    grad.addColorStop(0, "rgba(0,0,0,1)");
    grad.addColorStop(0.7, "rgba(0,0,0,0.6)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(x, y, 32, 0, Math.PI * 2); ctx.fill();
  };

  return (
    <div ref={wrapRef} className="absolute inset-0 rounded-[6px] overflow-hidden">
      <canvas
        ref={canvasRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{ touchAction: "none" }}
        className="w-full h-full block"
      />
    </div>
  );
}
