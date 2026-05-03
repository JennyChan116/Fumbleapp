import { motion } from "motion/react";
import { ArrowLeft, Trash2, Share2 } from "lucide-react";
import type { Ticket as TicketType } from "../types";
import { getCategory, TIER_META } from "../data";
import { Ticket } from "./Ticket";
import { CategoryIcon } from "./CategoryIcon";

interface Props {
  ticket: TicketType;
  onBack: () => void;
  onDelete: () => void;
  onShare: () => void;
}

export function TicketDetail({ ticket, onBack, onDelete, onShare }: Props) {
  const cat = getCategory(ticket.category);
  const tier = TIER_META[ticket.tier];
  const moodLabels = ["糟透", "不爽", "尚可", "释然", "轻盈"];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <button onClick={onBack} style={{ color: "var(--ink-soft)" }}><ArrowLeft size={20} /></button>
        <div className="stamp-font" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-faint)" }}>
          ARCHIVE ENTRY
        </div>
        <div style={{ width: 20 }} />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 16 }}
          className="flex justify-center mt-4"
        >
          <Ticket ticket={ticket} size="lg" />
        </motion.div>

        {/* meta */}
        <div className="mt-8 paper-texture" style={{ background: "var(--bone)", border: "1px solid rgba(42,24,16,0.2)", borderRadius: 4, padding: 16 }}>
          <Row label="发行编号" value={`№ ${ticket.serial}`} />
          <RowWithIcon
            label="事件类别"
            icon={<CategoryIcon id={ticket.category} size={14} strokeWidth={1.5} color="var(--ink)" />}
            value={`${cat.label} · ${cat.ticketTitle}`}
          />
          <Row label="稀有度" value={`${tier.label} · ${tier.en}`} stamp />
          <Row label="发生时间" value={new Date(ticket.createdAt).toLocaleString("zh-CN")} />
          <Row label="心情指数" value={`${moodLabels[ticket.mood]} · ${ticket.mood + 1}/5`} last />
        </div>

        <div className="mt-4 paper-texture" style={{ background: "var(--bone)", border: "1px solid rgba(42,24,16,0.2)", borderRadius: 4, padding: 16 }}>
          <div className="stamp-font" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-faint)" }}>
            INCIDENT REPORT
          </div>
          <div className="mt-2" style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink)" }}>
            「{ticket.description}」
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onShare}
            className="flex-1 flex items-center justify-center gap-2"
            style={{ background: "var(--ink)", color: "var(--bone)", padding: "12px 16px", borderRadius: 4, boxShadow: "0 3px 0 #1a0e08" }}
          >
            <Share2 size={16} />
            <span>分享票券</span>
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center"
            style={{ background: "transparent", border: "1px solid rgba(42,24,16,0.3)", padding: "12px 16px", borderRadius: 4, color: "var(--crimson)" }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, last, stamp }: { label: string; value: string; last?: boolean; stamp?: boolean }) {
  return (
    <div
      className="flex justify-between items-center py-2"
      style={{ borderBottom: last ? "none" : "1px dashed rgba(42,24,16,0.2)" }}
    >
      <div className="stamp-font" style={{ fontSize: 10, letterSpacing: "0.15em", color: "var(--ink-faint)" }}>{label}</div>
      <div style={{ fontSize: 13, color: "var(--ink)", fontWeight: stamp ? 600 : 400 }}>{value}</div>
    </div>
  );
}

function RowWithIcon({ label, icon, value }: { label: string; icon: React.ReactNode; value: string }) {
  return (
    <div
      className="flex justify-between items-center py-2"
      style={{ borderBottom: "1px dashed rgba(42,24,16,0.2)" }}
    >
      <div className="stamp-font" style={{ fontSize: 10, letterSpacing: "0.15em", color: "var(--ink-faint)" }}>{label}</div>
      <div className="flex items-center gap-1.5" style={{ fontSize: 13, color: "var(--ink)" }}>
        {icon}
        <span>{value}</span>
      </div>
    </div>
  );
}