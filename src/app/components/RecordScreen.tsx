import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Frown, Meh, Smile, Sun, Sparkles } from "lucide-react";
import { CATEGORIES } from "../data";
import type { CategoryDef, CategoryId } from "../types";
import { CategoryIcon } from "./CategoryIcon";

interface Props {
  onCancel: () => void;
  onSubmit: (data: { category: CategoryId; description: string; mood: number }) => void;
}

export function RecordScreen({ onCancel, onSubmit }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [category, setCategory] = useState<CategoryDef | null>(null);
  const [desc, setDesc] = useState("");
  const [mood, setMood] = useState(2);

  const daily = CATEGORIES.filter(c => c.layer === "daily");
  const emotion = CATEGORIES.filter(c => c.layer === "emotion");

  const moodIcons = [
    { icon: Frown,    label: "糟透", color: "#8b1e3f" },
    { icon: Meh,      label: "不爽", color: "#a0522d" },
    { icon: Smile,    label: "尚可", color: "#8a6b52" },
    { icon: Sun,      label: "释然", color: "#b8860b" },
    { icon: Sparkles, label: "轻盈", color: "#3a6e8f" },
  ];

  return (
    <div className="h-full flex flex-col px-5 pt-6 pb-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <button onClick={step === 1 ? onCancel : () => setStep(1)} style={{ color: "var(--ink-soft)" }}>
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <div className="stamp-font" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-faint)" }}>
            STEP {step} / 2
          </div>
          <div className="en-serif" style={{ fontSize: 18, letterSpacing: "0.04em" }}>
            {step === 1 ? "Choose Mishap" : "Describe It"}
          </div>
        </div>
        <div style={{ width: 20 }} />
      </div>

      <div className="mt-2 mx-auto w-24 h-px" style={{ background: "var(--ink-faint)" }} />

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mt-6 flex-1 overflow-y-auto no-scrollbar"
          >
            <SectionHeader cn="日常层" en="DAILY" />
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {daily.map(c => (
                <CategoryCard key={c.id} cat={c} selected={category?.id === c.id} onClick={() => setCategory(c)} />
              ))}
            </div>

            <SectionHeader cn="情绪层" en="HEART" className="mt-7" />
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {emotion.map(c => (
                <CategoryCard key={c.id} cat={c} selected={category?.id === c.id} onClick={() => setCategory(c)} />
              ))}
            </div>

            <div className="h-4" />
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="mt-6 flex-1 flex flex-col"
          >
            <div className="text-center">
              <div className="flex items-center justify-center" style={{ color: category?.layer === "emotion" ? "var(--crimson)" : "var(--gold-deep)" }}>
                <CategoryIcon id={category!.id} size={40} strokeWidth={1.5} />
              </div>
              <div className="mt-1 en-serif" style={{ fontSize: 22, fontWeight: 600 }}>{category?.ticketTitle}</div>
              <div style={{ fontSize: 12, color: "var(--ink-faint)" }}>{category?.label} · {category?.blurb}</div>
            </div>

            <div
              className="mt-6 paper-texture"
              style={{
                background: "var(--bone)",
                border: "1px solid rgba(42,24,16,0.25)",
                borderRadius: 4,
                padding: 14,
                boxShadow: "inset 0 0 0 1px rgba(42,24,16,0.08)",
              }}
            >
              <label className="stamp-font" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-faint)" }}>
                INCIDENT REPORT · 事发陈述
              </label>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value.slice(0, 60))}
                rows={3}
                placeholder="一句话讲讲怎么翻的车…"
                className="mt-2 w-full bg-transparent outline-none resize-none"
                style={{ fontSize: 16, color: "var(--ink)", lineHeight: 1.6 }}
                autoFocus
              />
              <div className="text-right serial">{desc.length}/60</div>
            </div>

            <div className="mt-6">
              <div className="stamp-font text-center" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-faint)" }}>
                MOOD INDEX · 心情指数
              </div>
              <div className="mt-3 flex justify-between items-center px-2">
                {moodIcons.map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => setMood(i)}
                      className="flex flex-col items-center gap-1 transition"
                      style={{ opacity: mood === i ? 1 : 0.32, transform: mood === i ? "scale(1.18)" : "scale(1)" }}
                    >
                      <Icon
                        size={28}
                        color={mood === i ? m.color : "var(--ink-faint)"}
                        strokeWidth={mood === i ? 2 : 1.5}
                      />
                      <span style={{ fontSize: 10, color: mood === i ? m.color : "var(--ink-faint)" }}>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1" />

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={!desc.trim()}
              onClick={() => onSubmit({ category: category!.id, description: desc.trim(), mood })}
              className="mt-6 w-full flex items-center justify-center gap-2"
              style={{
                background: desc.trim() ? "var(--ink)" : "var(--paper-edge)",
                color: "var(--bone)",
                padding: "16px 20px",
                borderRadius: 4,
                opacity: desc.trim() ? 1 : 0.5,
                boxShadow: "0 4px 0 #1a0e08",
              }}
            >
              <span className="en-serif" style={{ fontSize: 18, letterSpacing: "0.04em" }}>ISSUE TICKET</span>
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {step === 1 && category && (
        <motion.button
          initial={{ y: 60 }} animate={{ y: 0 }}
          onClick={() => setStep(2)}
          className="mt-3 w-full flex items-center justify-center gap-2"
          style={{
            background: "var(--ink)",
            color: "var(--bone)",
            padding: "14px 20px",
            borderRadius: 4,
            boxShadow: "0 4px 0 #1a0e08",
          }}
        >
          <span className="en-serif" style={{ fontSize: 16, letterSpacing: "0.04em" }}>CONTINUE · {category.ticketTitle}</span>
          <ArrowRight size={16} />
        </motion.button>
      )}
    </div>
  );
}

function SectionHeader({ cn, en, className }: { cn: string; en: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className || ""}`}>
      <div className="flex-1 h-px" style={{ background: "var(--ink-faint)" }} />
      <div className="text-center">
        <div className="en-serif" style={{ fontSize: 14, letterSpacing: "0.2em", fontWeight: 600 }}>{en}</div>
        <div className="stamp-font" style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.15em" }}>{cn}</div>
      </div>
      <div className="flex-1 h-px" style={{ background: "var(--ink-faint)" }} />
    </div>
  );
}

function CategoryCard({ cat, selected, onClick }: { cat: CategoryDef; selected: boolean; onClick: () => void }) {
  const isEmotion = cat.layer === "emotion";
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="relative aspect-[1/1.15] paper-texture flex flex-col items-center justify-center gap-1 px-1"
      style={{
        background: selected ? "var(--ink)" : "var(--bone)",
        color: selected ? "var(--bone)" : "var(--ink)",
        border: `1.5px ${selected ? "solid" : isEmotion ? "double" : "solid"} ${selected ? "var(--ink)" : isEmotion ? "var(--crimson)" : "rgba(42,24,16,0.3)"}`,
        borderRadius: 3,
        boxShadow: selected ? "0 4px 0 #1a0e08" : "0 2px 4px rgba(42,24,16,0.08)",
      }}
    >
      <div style={{ color: selected ? "rgba(250,243,224,0.9)" : isEmotion ? "var(--crimson)" : "var(--gold-deep)" }}>
        <CategoryIcon id={cat.id} size={22} strokeWidth={1.5} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{cat.label}</div>
      <div className="stamp-font" style={{ fontSize: 8, opacity: 0.6, letterSpacing: "0.1em" }}>
        {cat.ticketTitle}
      </div>
      {isEmotion && !selected && (
        <div className="absolute top-1 right-1" style={{ width: 4, height: 4, borderRadius: 9999, background: "var(--crimson)" }} />
      )}
    </motion.button>
  );
}