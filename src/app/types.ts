export type CategoryId =
  | "spill"        // 洒了
  | "drop"         // 摔了
  | "forget"       // 忘了
  | "lose"         // 丢了
  | "misspeak"     // 说错话
  | "other_daily"  // 日常·其他
  | "shamed"       // 社死了
  | "rejected"     // 被拒了
  | "procrast"     // 拖延了
  | "emo"          // emo 了
  | "broken"       // 破防了
  | "other_emo";   // 情绪·其他

export type Tier = "common" | "rare" | "epic" | "legendary";

export type RitualKind =
  | "wipe"      // 洒了 — 擦水渍
  | "puzzle"    // 摔了 — 拼图还原
  | "fog"       // 忘了 — 拨开迷雾
  | "rummage"   // 丢了 — 翻箱倒柜
  | "blow"      // 说错话 — 吹散尴尬云
  | "smash"     // 日常·其他 — 盲盒砸开
  | "wax"       // 社死 — 火漆封条
  | "plane"     // 被拒 — 折纸飞机扔走
  | "calendar"  // 拖延 — 撕掉过期日历
  | "umbrella"  // emo — 撑伞接落雨彩票
  | "kintsugi"  // 破防 — 金缮裂痕
  | "burn"      // 情绪·其他 — 烧信
  | "scratch";  // fallback

export interface CategoryDef {
  id: CategoryId;
  label: string;
  layer: "daily" | "emotion";
  ritual: RitualKind;
  iconName: string;
  blurb: string;     // shown in record screen
  ticketTitle: string; // printed on ticket
  accentVar: string; // css var for accent color
}

export interface Ticket {
  id: string;
  serial: string;        // FB-2026-0001
  category: CategoryId;
  description: string;
  mood: number;          // 0-4
  tier: Tier;
  message: string;       // the comfort line
  poem?: string;         // secondary line
  createdAt: number;
  scratched: boolean;
  motif: string;         // small visual motif id
}