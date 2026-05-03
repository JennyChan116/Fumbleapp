import { useEffect, useRef, useState } from "react";

interface Props { onComplete: () => void; }

/** 忘了 — 灰白迷雾，手指拨动散开（雾会缓慢回流） */
export function FogRitual({ onComplete }: Props) {
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

    const drawFog = () => {
      const g = ctx.createRadialGradient(rect.width / 2, rect.height / 2, 20, rect.width / 2, rect.height / 2, rect.width * 0.7);
      g.addColorStop(0, "rgba(230,225,215,0.95)");
      g.addColorStop(1, "rgba(180,175,165,0.98)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, rect.width, rect.height);
      // wisps
      for (let i = 0; i < 18; i++) {
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        const r = 30 + Math.random() * 60;
        const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
        rg.addColorStop(0, "rgba(255,255,255,0.4)");
        rg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = "rgba(42,24,16,0.45)";
      ctx.font = "500 13px 'Noto Serif SC', serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("拨开迷雾", rect.width / 2, rect.height / 2);
      ctx.font = "10px 'Special Elite', monospace";
      ctx.fillText("PARTING THE MIST", rect.width / 2, rect.height / 2 + 20);
    };
    drawFog();
  }, []);

  const reflowRef = useRef(0);
  // gentle re-fog
  useEffect(() => {
    if (done) return;
    let raf = 0;
    const tick = () => {
      reflowRef.current++;
      // every ~1.5s re-add slight haze
      if (reflowRef.current % 90 === 0) {
        const c = canvasRef.current!;
        const ctx = c.getContext("2d")!;
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(220,215,205,0.06)";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.globalCompositeOperation = "destination-out";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [done]);

  const check = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const img = ctx.getImageData(0, 0, c.width, c.height);
    let cleared = 0; let total = 0;
    for (let i = 3; i < img.data.length; i += 4 * 16) {
      total++; if (img.data[i] < 40) cleared++;
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
  const onDown = (e: React.PointerEvent) => { drawingRef.current = true; e.currentTarget.setPointerCapture(e.pointerId); paint(e); };
  const onMove = (e: React.PointerEvent) => { if (drawingRef.current) paint(e); };
  const onUp = () => { drawingRef.current = false; check(); };
  const paint = (e: React.PointerEvent) => {
    const { x, y } = getPos(e);
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    const grad = ctx.createRadialGradient(x, y, 0, x, y, 38);
    grad.addColorStop(0, "rgba(0,0,0,1)");
    grad.addColorStop(0.6, "rgba(0,0,0,0.5)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(x, y, 38, 0, Math.PI * 2); ctx.fill();
  };

  return (
    <div ref={wrapRef} className="absolute inset-0 rounded-[6px] overflow-hidden">
      <canvas ref={canvasRef}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        className="w-full h-full block" style={{ touchAction: "none" }} />
    </div>
  );
}
