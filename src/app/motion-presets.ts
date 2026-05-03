import type { Transition } from "motion/react";

export const SPRING_SOFT: Transition = { type: "spring", stiffness: 220, damping: 26, mass: 0.9 };
export const SPRING_TIGHT: Transition = { type: "spring", stiffness: 380, damping: 28, mass: 0.6 };
export const SPRING_THUMP: Transition = { type: "spring", stiffness: 520, damping: 16, mass: 1.1 };
export const EASE_PAPER = [0.32, 0.72, 0.24, 1] as const;
