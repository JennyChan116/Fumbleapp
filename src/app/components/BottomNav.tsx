import { Home, BookMarked, User } from "lucide-react";
import { motion } from "motion/react";
import { SPRING_SOFT } from "../motion-presets";

export type NavTab = "home" | "book" | "me";

interface Props {
  active: NavTab;
  onChange: (tab: NavTab) => void;
}

export function BottomNav({ active, onChange }: Props) {
  const items: Array<{ id: NavTab; icon: React.ReactNode; label: string }> = [
    { id: "home", icon: <Home size={20} />, label: "今日" },
    { id: "book", icon: <BookMarked size={20} />, label: "彩票册" },
    { id: "me", icon: <User size={20} />, label: "我" },
  ];

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 px-4 pt-2 pb-3 flex items-center justify-around"
      style={{
        background: "linear-gradient(to top, var(--paper) 60%, transparent)",
        borderTop: "1px solid rgba(42,24,16,0.18)",
      }}
    >
      {items.map(it => {
        const isActive = active === it.id;
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            className="relative flex flex-col items-center gap-0.5 px-4 py-1"
            style={{ color: isActive ? "var(--ink)" : "var(--ink-faint)" }}
          >
            {isActive && (
              <motion.span
                layoutId="nav-indicator"
                className="absolute -top-2 left-1/2 -translate-x-1/2"
                style={{
                  width: 22, height: 3, borderRadius: 2,
                  background: "var(--ink)",
                }}
                transition={SPRING_SOFT}
              />
            )}
            <motion.span
              animate={{ scale: isActive ? 1.05 : 1, opacity: isActive ? 1 : 0.55 }}
              transition={SPRING_SOFT}
              className="flex flex-col items-center gap-0.5"
            >
              {it.icon}
              <span className="stamp-font" style={{ fontSize: 10, letterSpacing: "0.1em" }}>{it.label}</span>
            </motion.span>
            {isActive && (
              <motion.span
                layoutId="nav-stamp-dot"
                className="absolute -bottom-0.5"
                style={{ width: 3, height: 3, borderRadius: 9999, background: "var(--gold)" }}
                transition={SPRING_SOFT}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
