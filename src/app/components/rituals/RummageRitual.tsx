import { useState } from "react";
import { motion } from "motion/react";
import {
  BookOpen, CreditCard, Plug, Newspaper, Paperclip,
  Key, Package, Glasses, Watch, Headphones, Scissors, Wallet,
  type LucideIcon,
} from "lucide-react";

interface Props { onComplete: () => void; }

const ITEM_ICONS: LucideIcon[] = [
  BookOpen, CreditCard, Plug, Newspaper, Paperclip,
  Key, Package, Glasses, Watch, Headphones, Scissors, Wallet,
];

/** 丢了 — 一堆杂物盖住票券，逐个点击/拨开找到它 */
export function RummageRitual({ onComplete }: Props) {
  const [items, setItems] = useState(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      IconComponent: ITEM_ICONS[i % ITEM_ICONS.length],
      x: 8 + Math.random() * 84,
      y: 18 + Math.random() * 72,
      rot: -30 + Math.random() * 60,
      cleared: false,
      flyTo: { x: -30 + Math.random() * 160 - 30, y: 120 },
    }))
  );

  const remove = (id: number) => {
    setItems(prev => {
      const next = prev.map(it => it.id === id ? { ...it, cleared: true } : it);
      const remaining = next.filter(it => !it.cleared).length;
      if (remaining <= 4) {
        setTimeout(onComplete, 500);
      }
      return next;
    });
  };

  return (
    <div className="absolute inset-0 rounded-[6px] overflow-hidden"
         style={{ background: "linear-gradient(180deg, #3b2618 0%, #2a1810 100%)", touchAction: "none" }}>
      <div className="absolute top-3 left-0 right-0 text-center stamp-font pointer-events-none"
           style={{ color: "rgba(241,213,122,0.7)", fontSize: 11, letterSpacing: "0.15em" }}>
        翻找它去了哪儿 · TAP TO MOVE ASIDE
      </div>

      {/* hint of ticket beneath */}
      <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)", fontSize: 11, color: "rgba(241,213,122,0.3)", letterSpacing: "0.2em" }}>
        FUMBLE
      </div>

      {items.map(it => {
        const Icon = it.IconComponent;
        return (
          <motion.button
            key={it.id}
            onClick={() => !it.cleared && remove(it.id)}
            className="absolute select-none flex items-center justify-center"
            style={{
              left: `${it.x}%`,
              top: `${it.y}%`,
              transform: `translate(-50%,-50%) rotate(${it.rot}deg)`,
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))",
              cursor: "pointer",
              color: "rgba(241,213,122,0.85)",
            }}
            animate={it.cleared ? { x: it.flyTo.x, y: it.flyTo.y, opacity: 0, rotate: it.rot + 90 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Icon size={28} strokeWidth={1.5} />
          </motion.button>
        );
      })}
    </div>
  );
}
