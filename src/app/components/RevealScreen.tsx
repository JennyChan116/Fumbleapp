import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { ArrowRight, Share2 } from "lucide-react";
import type { Ticket as TicketType } from "../types";
import { getCategory, TIER_META } from "../data";
import { Ticket } from "./Ticket";
import { PressButton } from "./PressButton";
import { SPRING_SOFT, SPRING_THUMP } from "../motion-presets";
import { ScratchRitual } from "./rituals/ScratchRitual";
import { WipeRitual } from "./rituals/WipeRitual";
import { UmbrellaRitual } from "./rituals/UmbrellaRitual";
import { WaxSealRitual } from "./rituals/WaxSealRitual";
import { KintsugiRitual } from "./rituals/KintsugiRitual";
import { PuzzleRitual } from "./rituals/PuzzleRitual";
import { FogRitual } from "./rituals/FogRitual";
import { RummageRitual } from "./rituals/RummageRitual";
import { BlowRitual } from "./rituals/BlowRitual";
import { SmashRitual } from "./rituals/SmashRitual";
import { PlaneRitual } from "./rituals/PlaneRitual";
import { CalendarRitual } from "./rituals/CalendarRitual";
import { BurnRitual } from "./rituals/BurnRitual";
import { QuickCompleteOverlay } from "./rituals/QuickCompleteOverlay";

interface Props {
  ticket: TicketType;
  onSave: () => void;
  onShare: () => void;
}

type Phase = "intro" | "ritual" | "revealing" | "stamping" | "revealed";

export function RevealScreen({ ticket, onSave, onShare }: Props) {
  const cat = getCategory(ticket.category);
  const tier = TIER_META[ticket.tier];
  const isHigh = ticket.tier === "epic" || ticket.tier === "legendary";
  const isLgd = ticket.tier === "legendary";
  const [phase, setPhase] = useState<Phase>("intro");

  // intro auto-advance
  useEffect(() => {
    if (phase === "intro") {
      const t = setTimeout(() => setPhase("ritual"), 1700);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const onRitualDone = () => {
    setPhase("revealing");
    setTimeout(() => setPhase("stamping"), 600);
    setTimeout(() => {
      setPhase("revealed");
      if (isLgd) {
        confetti({
          particleCount: 160, spread: 90, origin: { y: 0.4 },
          colors: ["#f1d57a", "#b8860b", "#fff2b3", "#8b1e3f"], ticks: 280,
        });
        setTimeout(() => confetti({
          particleCount: 90, spread: 130, origin: { y: 0.35 },
          colors: ["#f1d57a", "#fff2b3"], scalar: 0.8,
        }), 280);
      } else if (ticket.tier === "epic") {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.4 }, colors: ["#7a3b8e", "#b8860b", "#f1d57a"] });
      }
    }, 1100);
  };

  const renderRitual = () => {
    switch (cat.ritual) {
      case "wipe":      return <WipeRitual onComplete={onRitualDone} />;
      case "puzzle":    return <PuzzleRitual onComplete={onRitualDone} />;
      case "fog":       return <FogRitual onComplete={onRitualDone} />;
      case "rummage":   return <RummageRitual onComplete={onRitualDone} />;
      case "blow":      return <BlowRitual onComplete={onRitualDone} />;
      case "smash":     return <SmashRitual onComplete={onRitualDone} />;
      case "wax":       return <WaxSealRitual onComplete={onRitualDone} />;
      case "plane":     return <PlaneRitual onComplete={onRitualDone} />;
      case "calendar":  return <CalendarRitual onComplete={onRitualDone} />;
      case "umbrella":  return <UmbrellaRitual onComplete={onRitualDone} />;
      case "kintsugi":  return <KintsugiRitual onComplete={onRitualDone} />;
      case "burn":      return <BurnRitual onComplete={onRitualDone} />;
      default:          return <ScratchRitual onComplete={onRitualDone} />;
    }
  };

  // spotlight intensifies for higher tiers on reveal
  const spotlightOpacity =
    phase === "revealed" || phase === "stamping"
      ? isLgd ? 0.7 : isHigh ? 0.45 : 0.25
      : 0;

  return (
    <div className="relative h-full flex flex-col items-center px-5 pt-8 pb-8 overflow-hidden">
      {/* spotlight backdrop */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: spotlightOpacity }}
        transition={{ duration: 0.6 }}
        style={{
          background: "radial-gradient(circle at 50% 42%, transparent 0%, transparent 30%, rgba(20,12,8,0.85) 100%)",
        }}
      />

      {/* legendary gold halo */}
      {isLgd && phase === "revealed" && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0.35] }}
          transition={{ duration: 1.2 }}
          style={{
            background: "radial-gradient(circle at 50% 42%, rgba(245,200,80,0.55) 0%, transparent 55%)",
          }}
        />
      )}

      <AnimatePresence mode="wait">
        {/* ─── INTRO ─── */}
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center w-full relative z-10"
          >
            <motion.div
              initial={{ scale: 0.4, rotate: -30, opacity: 0 }}
              animate={{ scale: 1, rotate: -6, opacity: 1 }}
              transition={SPRING_THUMP}
              className="text-center"
            >
              <div className="ink-stamp" style={{ fontSize: 18, padding: "6px 18px", letterSpacing: "0.25em" }}>
                NOW ISSUING
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, ...SPRING_SOFT }}
              className="mt-6 text-center"
            >
              <div className="en-serif" style={{ fontSize: 40, fontWeight: 700, letterSpacing: "0.04em", lineHeight: 1 }}>
                {cat.ticketTitle}
              </div>
              <div className="mt-2 mx-auto w-16 h-px" style={{ background: "var(--gold)" }} />
              <div className="mt-2 serial">№ {ticket.serial}</div>
              <div className="mt-3 stamp-font" style={{ fontSize: 11, letterSpacing: "0.25em", color: "var(--ink-faint)" }}>
                FUMBLE TICKETS · 失手券正在发行
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ─── RITUAL ─── large portrait canvas */}
        {phase === "ritual" && (
          <motion.div
            key="ritual-stage"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={SPRING_SOFT}
            className="flex-1 flex flex-col items-center justify-center w-full relative z-10"
          >
            {/* status label */}
            <div
              className="text-center mb-4 stamp-font"
              style={{ fontSize: 11, letterSpacing: "0.2em", color: "var(--ink-faint)" }}
            >
              OPEN THE TICKET · 开启
            </div>

            {/* ── Portrait ritual container ── */}
            <div
              className="relative w-full rounded-[8px] overflow-hidden"
              style={{
                height: "clamp(340px, 52vh, 460px)",
                boxShadow: "0 0 0 1px rgba(241,213,122,0.18), 0 12px 40px rgba(0,0,0,0.55)",
              }}
            >
              {renderRitual()}
            </div>

            {/* hint + 一键完成 — fully outside the ritual area, zero overlap */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-5 w-full flex flex-col items-center gap-4"
            >
              <div
                className="text-center"
                style={{ fontSize: 12, color: "var(--ink-faint)" }}
              >
                <RitualHint ritual={cat.ritual} />
              </div>
              <QuickCompleteOverlay onComplete={onRitualDone} />
            </motion.div>
          </motion.div>
        )}

        {/* ─── REVEALING / STAMPING / REVEALED — ticket phase ─── */}
        {(phase === "revealing" || phase === "stamping" || phase === "revealed") && (
          <motion.div
            key="ticket-stage"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={SPRING_SOFT}
            className="flex-1 flex flex-col items-center justify-center w-full relative z-10"
          >
            {/* status label */}
            <div
              className="text-center mb-3 stamp-font"
              style={{
                fontSize: 11, letterSpacing: "0.2em",
                color: phase === "revealed"
                  ? (isLgd ? "var(--gold-deep)" : "var(--ink)")
                  : "var(--ink-faint)",
              }}
            >
              {phase === "revealing"
                ? "REVEALING · 揭晓中"
                : phase === "stamping"
                ? "ISSUING · 盖戳中"
                : `${tier.en} · ${tier.label}`}
            </div>

            {/* ticket with tier animations */}
            <motion.div
              className="relative"
              animate={
                phase === "revealed"
                  ? { scale: isLgd ? 1.06 : 1.02, rotate: 0 }
                  : phase === "stamping"
                  ? { scale: 0.97, rotate: 0 }
                  : { scale: 1, rotate: 0 }
              }
              transition={SPRING_SOFT}
            >
              <Ticket ticket={ticket} size="lg" />

              {/* revealing white veil that fades */}
              {phase === "revealing" && (
                <motion.div
                  className="absolute inset-0 rounded-[6px]"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  style={{ background: "var(--bone)" }}
                />
              )}

              {/* tier stamp slamming down */}
              {(phase === "stamping" || phase === "revealed") && (
                <motion.div
                  className="absolute pointer-events-none"
                  style={{ top: "8%", right: "-12%", transformOrigin: "center" }}
                  initial={{ scale: 4, rotate: -25, opacity: 0 }}
                  animate={{ scale: 1, rotate: -14, opacity: 0.85 }}
                  transition={SPRING_THUMP}
                >
                  <div
                    className="ink-stamp-circle"
                    style={{
                      width: 78, height: 78,
                      fontSize: 10, lineHeight: 1.1, padding: 4,
                      borderColor: tier.ring, color: tier.ring,
                      borderWidth: 3,
                      background: "rgba(255,250,240,0.05)",
                    }}
                  >
                    <div>
                      <div className="en-serif" style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.05em" }}>{tier.en}</div>
                      <div className="stamp-font" style={{ fontSize: 9, marginTop: 2, letterSpacing: "0.15em" }}>{tier.label}券</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* legendary spinning gold ring */}
              {isLgd && phase === "revealed" && (
                <motion.div
                  className="absolute -inset-6 pointer-events-none"
                  initial={{ rotate: 0, opacity: 0 }}
                  animate={{ rotate: 360, opacity: 0.4 }}
                  transition={{ rotate: { duration: 16, repeat: Infinity, ease: "linear" }, opacity: { duration: 1 } }}
                  style={{
                    border: "1px dashed var(--gold)",
                    borderRadius: 12,
                  }}
                />
              )}
            </motion.div>

            {/* save / share buttons */}
            <AnimatePresence>
              {phase === "revealed" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.25, ...SPRING_SOFT }}
                  className="mt-7 w-full flex gap-2"
                >
                  <PressButton variant="paper" onClick={onShare} style={{ padding: "13px 14px", flex: 1 }}>
                    <span className="flex items-center justify-center gap-2">
                      <Share2 size={16} /><span style={{ fontSize: 14 }}>分享</span>
                    </span>
                  </PressButton>
                  <PressButton variant="ink" onClick={onSave} style={{ padding: "13px 16px", flex: 2 }}>
                    <span className="flex items-center justify-center gap-2">
                      <span className="en-serif" style={{ fontSize: 16, letterSpacing: "0.04em" }}>FILE TO BOOK</span>
                      <ArrowRight size={16} />
                    </span>
                  </PressButton>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RitualHint({ ritual }: { ritual: string }) {
  const map: Record<string, string> = {
    wipe:     "用手指擦干屏幕上的水渍",
    puzzle:   "把碎片拖回各自的位置",
    fog:      "用手指拨开眼前的迷雾",
    rummage:  "点击杂物把它们一件件拨开",
    blow:     "快速左右划动 让尴尬云散去",
    smash:    "长按砸开盲盒",
    wax:      "长按按住火漆封条直到破开",
    plane:    "向上滑动 折成飞机再扔出去",
    calendar: "向下拖拽 撕掉过期的一页",
    umbrella: "移动伞 接住下落的票券",
    kintsugi: "沿着裂痕描金 缝合每一处",
    burn:     "写下心里话 然后点燃它",
    scratch:  "用手指刮开银色涂层",
  };
  return <>{map[ritual] || ""}</>;
}
