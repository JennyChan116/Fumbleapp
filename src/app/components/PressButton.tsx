import { motion, type HTMLMotionProps } from "motion/react";
import { SPRING_THUMP } from "../motion-presets";

type Variant = "ink" | "paper" | "ghost";

interface Props extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: Variant;
  shadow?: boolean;
  fullWidth?: boolean;
}

/**
 * Press-able button with paper-being-stamped feel:
 * on tap it sinks down, the offset shadow collapses, then springs back.
 */
export function PressButton({ variant = "ink", shadow = true, fullWidth, style, children, ...rest }: Props) {
  const palette =
    variant === "ink"
      ? { bg: "var(--ink)", color: "var(--bone)", border: "var(--ink)" }
      : variant === "paper"
      ? { bg: "var(--bone)", color: "var(--ink)", border: "var(--ink)" }
      : { bg: "transparent", color: "var(--ink)", border: "rgba(42,24,16,0.3)" };

  return (
    <motion.button
      whileTap={{ y: shadow ? 4 : 1, scale: 0.985, boxShadow: shadow ? "0 0 0 #1a0e08" : undefined }}
      transition={SPRING_THUMP}
      {...rest}
      style={{
        background: palette.bg,
        color: palette.color,
        border: `1.5px solid ${palette.border}`,
        borderRadius: 4,
        boxShadow: shadow && variant === "ink" ? "0 4px 0 #1a0e08" : "none",
        width: fullWidth ? "100%" : undefined,
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
}
