import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap } from "lucide-react";

interface Props {
  onComplete: () => void;
  /** seconds before the button fades in (default: 4) */
  delay?: number;
}

/**
 * Accessibility fallback rendered **below** the ritual container (normal flow).
 * Fades in after `delay` seconds so it reads as an optional exit, not a skip.
 */
export function QuickCompleteOverlay({ onComplete, delay = 4 }: Props) {
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  const handlePress = () => {
    if (pressed) return;
    setPressed(true);
    setTimeout(onComplete, 360);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="qc"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center gap-1.5"
        >
          <div
            className="stamp-font"
            style={{
              fontSize: 9,
              letterSpacing: "0.2em",
              color: "rgba(241,213,122,0.38)",
            }}
          >
            ACCESSIBILITY · 无障碍
          </div>

          <motion.button
            onClick={handlePress}
            disabled={pressed}
            whileTap={{ scale: 0.93 }}
            animate={
              pressed
                ? { scale: [1, 1.1, 0.88], opacity: [1, 1, 0] }
                : {}
            }
            transition={pressed ? { duration: 0.36 } : {}}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full"
            style={{
              background: "rgba(16,9,4,0.55)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(241,213,122,0.4)",
              color: "rgba(241,213,122,0.82)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
              cursor: pressed ? "default" : "pointer",
            }}
          >
            <Zap size={12} strokeWidth={2.5} />
            <span
              className="stamp-font"
              style={{ fontSize: 11, letterSpacing: "0.22em" }}
            >
              一键完成
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
