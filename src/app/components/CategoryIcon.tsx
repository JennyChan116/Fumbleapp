import {
  BrainCircuit, Coffee, MessageCircle, Wallet, Package,
  AlarmClock, CloudRain, HeartCrack, Ghost, HeartOff, Flame,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "../types";

/** 火柴人跌倒 — 人体向右倒地，一腿踢起，双臂散开 */
function PersonFalling({ size = 24, color = "currentColor", strokeWidth = 2 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 头 */}
      <circle cx="17" cy="4.5" r="2.2" />
      {/* 躯干（向左下方倒） */}
      <line x1="15.5" y1="6.5" x2="9" y2="13" />
      {/* 左臂（向右上甩出） */}
      <line x1="13.5" y1="8.5" x2="19" y2="6" />
      {/* 右臂（向左撑地） */}
      <line x1="11.5" y1="10.5" x2="7" y2="8" />
      {/* 左腿（踢起在空中） */}
      <line x1="9" y1="13" x2="5" y2="10.5" />
      {/* 右腿（斜向地面） */}
      <line x1="9" y1="13" x2="11" y2="19" />
      {/* 地面撞击小星星/冲击线 */}
      <line x1="4" y1="18" x2="6" y2="16.5" />
      <line x1="3" y1="15.5" x2="5.5" y2="15" />
      <line x1="5.5" y1="20" x2="7" y2="18" />
    </svg>
  );
}

// Lucide 图标 map（drop 单独处理）
const ICON_MAP: Partial<Record<CategoryId, LucideIcon>> = {
  forget:      BrainCircuit,
  spill:       Coffee,
  misspeak:    MessageCircle,
  lose:        Wallet,
  other_daily: Package,
  procrast:    AlarmClock,
  emo:         CloudRain,
  broken:      HeartCrack,
  shamed:      Ghost,
  rejected:    HeartOff,
  other_emo:   Flame,
};

interface CategoryIconProps {
  id: CategoryId;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function CategoryIcon({ id, size = 24, color = "currentColor", strokeWidth = 2 }: CategoryIconProps) {
  if (id === "drop") {
    return <PersonFalling size={size} color={color} strokeWidth={strokeWidth} />;
  }
  const Icon = ICON_MAP[id];
  if (!Icon) return null;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}
