import type { CategoryDef, CategoryId, Tier } from "./types";

export const CATEGORIES: CategoryDef[] = [
  // 日常层 — 按频率从高到低排列
  { id: "forget",      label: "忘了",   layer: "daily",   ritual: "fog",      iconName: "BrainCircuit",  blurb: "钥匙 / 带伞 / 约会",  ticketTitle: "FORGET",   accentVar: "--ink-soft" },
  { id: "spill",       label: "洒了",   layer: "daily",   ritual: "wipe",     iconName: "Coffee",        blurb: "咖啡 / 汤 / 水",      ticketTitle: "SPILL",    accentVar: "--gold" },
  { id: "misspeak",    label: "说错话", layer: "daily",   ritual: "blow",     iconName: "MessageCircle", blurb: "口误 / 失言",         ticketTitle: "SLIP",     accentVar: "--ink-soft" },
  { id: "drop",        label: "摔了",   layer: "daily",   ritual: "puzzle",   iconName: "PersonFalling", blurb: "手机 / 碗 / 杯",      ticketTitle: "DROP",     accentVar: "--ink-soft" },
  { id: "lose",        label: "丢了",   layer: "daily",   ritual: "rummage",  iconName: "Wallet",        blurb: "钱包 / 快递 / 东西",  ticketTitle: "LOST",     accentVar: "--ink-soft" },
  { id: "other_daily", label: "其他",   layer: "daily",   ritual: "smash",    iconName: "Package",       blurb: "说不上类别的小事",     ticketTitle: "MISC",     accentVar: "--ink-soft" },
  // 情绪层 — 按频率从高到低排列
  { id: "procrast",   label: "又拖了", layer: "emotion", ritual: "calendar", iconName: "AlarmClock",    blurb: "deadline 又炸了",     ticketTitle: "DELAYED",  accentVar: "--crimson" },
  { id: "emo",        label: "emo 了", layer: "emotion", ritual: "umbrella", iconName: "CloudRain",     blurb: "无来由的低落",         ticketTitle: "BLUE HOUR",accentVar: "--crimson" },
  { id: "broken",     label: "破防了", layer: "emotion", ritual: "kintsugi", iconName: "HeartCrack",    blurb: "被一句话戳中",         ticketTitle: "KINTSUGI", accentVar: "--gold" },
  { id: "shamed",     label: "社死了", layer: "emotion", ritual: "wax",      iconName: "Ghost",         blurb: "群里发错 / 当众出糗", ticketTitle: "DISGRACE", accentVar: "--crimson" },
  { id: "rejected",   label: "被拒了", layer: "emotion", ritual: "plane",    iconName: "HeartOff",      blurb: "表白 / 面试 / 提案",  ticketTitle: "REJECTED", accentVar: "--crimson" },
  { id: "other_emo",  label: "其他",   layer: "emotion", ritual: "burn",     iconName: "Flame",         blurb: "说不出口的情绪",      ticketTitle: "UNSAID",   accentVar: "--crimson" },
];

export function getCategory(id: CategoryId): CategoryDef {
  return CATEGORIES.find(c => c.id === id)!;
}

const TIER_WEIGHTS: Array<[Tier, number]> = [
  ["common", 60], ["rare", 25], ["epic", 12], ["legendary", 3],
];
export function rollTier(): Tier {
  const total = TIER_WEIGHTS.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [t, w] of TIER_WEIGHTS) {
    if ((r -= w) <= 0) return t;
  }
  return "common";
}

export const TIER_META: Record<Tier, { label: string; en: string; ring: string }> = {
  common:    { label: "寻常", en: "COMMON",    ring: "#8a6b52" },
  rare:      { label: "稀有", en: "RARE",      ring: "#3a6e8f" },
  epic:      { label: "珍奇", en: "EPIC",      ring: "#7a3b8e" },
  legendary: { label: "传奇", en: "LEGENDARY", ring: "#b8860b" },
};

type Pool = { messages: string[]; poems: string[] };

const POOLS: Record<CategoryId, Pool> = {
  spill: {
    messages: ["万物皆有裂痕，那是咖啡进来的地方。", "桌面今日已盖戳：到此一洒。", "请收下今日份的液态艺术。"],
    poems: ["——洒落是世界的另一种签收。", "——湿润，是给清醒的小费。"],
  },
  drop: {
    messages: ["重力今天选了你做朋友。", "听这一声，是地心引力的告白。", "屏幕碎了，世界碎了一点点。"],
    poems: ["——脆是一种诚实。", "——掉落是地面对你的拥抱。"],
  },
  forget: {
    messages: ["你的记忆今天放假了。", "钥匙陪你练习关门技巧。", "遗忘也是一种节能模式。"],
    poems: ["——记忆是漏的，月光也是。", "——空白处自有花开。"],
  },
  lose: {
    messages: ["它先去看了世界，等你赶上。", "丢失是另一种慷慨。", "缘分以东西为单位结算。"],
    poems: ["——失物保留待领。", "——空袋子里装着自由。"],
  },
  misspeak: {
    messages: ["话已出口，江湖不收。", "舌头比脑子勇敢。", "今日金句：嘴，倒戈了。"],
    poems: ["——失言一句，得歉一打。", "——风把话吹回原处。"],
  },
  other_daily: {
    messages: ["今日份的混沌已签收。", "命名困难也是一种翻车。", "盲盒人生，每一格都是惊喜。"],
    poems: ["——无名也无妨。", "——抽中就是缘分。"],
  },
  shamed: {
    messages: ["此刻地球若裂开，请代我致谢。", "群聊已封存为本世纪奇观。", "脸红是一种昂贵的颜料。"],
    poems: ["——社死之后，皆为佳话。", "——尴尬是青春的盐。"],
  },
  rejected: {
    messages: ["不被选中，不等于不被珍贵。", "今天的‘不’，是日后转身的角度。", "退件邮戳，限量发行。"],
    poems: ["——拒绝是另一种地图。", "——不被收下的，自己开花。"],
  },
  procrast: {
    messages: ["今日的你已成功越狱。", "拖延是为灵感留出的座位。", "deadline 是一种很美的烟花。"],
    poems: ["——明天，是温柔的远方。", "——拖延中藏着完整的自己。"],
  },
  emo: {
    messages: ["难过是身体在悄悄换季。", "今日多云，心情也如是。", "你不是低落，你只是在地下生根。"],
    poems: ["——落雨的人，自带屋檐。", "——蓝色之后是更深的蓝。"],
  },
  broken: {
    messages: ["碎处填金，伤痕成纹。", "破防是心还活着的证明。", "金缮一次，胜过完美十年。"],
    poems: ["——裂缝，是光的入口。", "——以金为线，缝住此刻。"],
  },
  other_emo: {
    messages: ["说不出口的，就让火带走。", "有些话，烧给自己听。", "灰烬也是一种回信。"],
    poems: ["——火是最沉默的倾听者。", "——烧成灰，也是一种轻。"],
  },
};

export function pickMessage(c: CategoryId): string {
  const arr = POOLS[c].messages;
  return arr[Math.floor(Math.random() * arr.length)];
}
export function pickPoem(c: CategoryId): string {
  const arr = POOLS[c].poems;
  return arr[Math.floor(Math.random() * arr.length)];
}

const MOTIFS = ["sun", "moon", "rain", "key", "envelope", "cup", "heart", "feather", "anchor", "flame"];
export function pickMotif(): string {
  return MOTIFS[Math.floor(Math.random() * MOTIFS.length)];
}

import type { Ticket } from "./types";

const STORAGE_KEY = "fumble.tickets.v1";
const SERIAL_KEY = "fumble.serial.v1";

export function loadTickets(): Ticket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch { return []; }
}
export function saveTickets(t: Ticket[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(t));
}
export function nextSerial(): string {
  const n = (Number(localStorage.getItem(SERIAL_KEY) || "0") + 1);
  localStorage.setItem(SERIAL_KEY, String(n));
  return `FB-2026-${String(n).padStart(4, "0")}`;
}