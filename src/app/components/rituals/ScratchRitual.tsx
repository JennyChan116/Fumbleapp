import { useEffect, useRef, useState } from "react";

interface Props {
  onComplete: () => void;
  threshold?: number; // 0..1 percent cleared
  coverLabel?: string;
}

/**
 * Default scratch-card ritual. Canvas overlay that user scratches with finger/mouse.
 */
export function ScratchRitual({ onComplete, threshold = 0.45, coverLabel = "刮 开 此 处" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const container = containerRef.current!;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // metallic silver foil
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, "#bfbfbf");
    grad.addColorStop(0.4, "#e0dfdb");
    grad.addColorStop(0.5, "#f4f1e8");
    grad.addColorStop(0.6, "#d8d6cf");
    grad.addColorStop(1, "#a09e96");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // noise grain
    const img = ctx.getImageData(0, 0, rect.width, rect.height);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 28;
      img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
    }
    ctx.putImageData(img, 0, 0);

    // label
    ctx.fillStyle = "rgba(42,24,16,0.55)";
    ctx.font = "600 14px 'Noto Serif SC', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(coverLabel, rect.width / 2, rect.height / 2);
    ctx.font = "10px 'Special Elite', monospace";
    ctx.fillStyle = "rgba(42,24,16,0.4)";
    ctx.fillText("SCRATCH HERE", rect.width / 2, rect.height / 2 + 22);

    ctx.globalCompositeOperation = "destination-out";
  }, [coverLabel]);

  const checkProgress = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    const total = img.data.length / 4;
    for (let i = 3; i < img.data.length; i += 4 * 12) {
      if (img.data[i] < 30) cleared++;
    }
    const ratio = cleared / (total / 12);
    if (ratio > threshold && !done) {
      setDone(true);
      // fade remainder
      const c = ctx.canvas;
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
  const onMove = (e: React.PointerEvent) => {
    if (!drawingRef.current) return;
    paint(e);
  };
  const onUp = () => {
    drawingRef.current = false;
    checkProgress();
  };

  const paint = (e: React.PointerEvent) => {
    const { x, y } = getPos(e);
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div ref={containerRef} className="absolute inset-0 rounded-[6px] overflow-hidden">
      <canvas
        ref={canvasRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{ touchAction: "none", cursor: "grab" }}
        className="w-full h-full block"
      />
    </div>
  );
}
