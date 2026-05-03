import { motion } from "motion/react";
import { X } from "lucide-react";
import type { Ticket as TicketType } from "../types";
import { Ticket } from "./Ticket";

interface Props {
  ticket: TicketType;
  onClose: () => void;
}

export function ShareCard({ ticket, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex items-center justify-center px-6"
      style={{ background: "rgba(20,12,8,0.85)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-[340px] paper-texture"
        style={{
          background: "var(--paper)",
          padding: 22,
          borderRadius: 6,
          border: "1.5px solid var(--ink)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 rounded-full"
          style={{ width: 32, height: 32, background: "var(--ink)", color: "var(--bone)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <X size={16} />
        </button>

        <div className="text-center">
          <div className="stamp-font" style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--ink-faint)" }}>
            SHARED FROM FUMBLE
          </div>
          <div className="en-serif mt-1" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.04em" }}>
            Fumble
          </div>
          <div style={{ fontSize: 10, color: "var(--ink-faint)", letterSpacing: "0.2em" }}>失 · 手 · 录</div>
        </div>

        <div className="mt-4 flex justify-center">
          <Ticket ticket={ticket} size="md" />
        </div>

        <div className="mt-4 text-center" style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.7 }}>
          「我又翻车了，但我换来一张限量发行的票券。」
        </div>

        <div className="mt-3 mx-auto w-20 h-px" style={{ background: "var(--ink-faint)" }} />

        <div className="mt-3 text-center stamp-font" style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.2em" }}>
          长按截图保存 · SCREENSHOT TO SAVE
        </div>
      </motion.div>
    </motion.div>
  );
}
