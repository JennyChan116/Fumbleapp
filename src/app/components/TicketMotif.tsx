import type { CategoryId } from "../types";

interface Props {
  motif: string;
  category: CategoryId;
  size?: number;
}

/**
 * Tiny engraved-style SVG illustration printed on the ticket.
 * Single-color line art that reads like an old etching.
 */
export function TicketMotif({ category, size = 56 }: Props) {
  const ink = "#2a1810";
  const faint = "rgba(42,24,16,0.4)";

  const common = {
    width: size,
    height: size,
    viewBox: "0 0 64 64",
    fill: "none" as const,
    stroke: ink,
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const glyph = (() => {
    switch (category) {
      case "spill":
        return (
          <g>
            <path d="M22 18 L22 38 Q22 44 32 44 Q42 44 42 38 L42 18 Z" />
            <path d="M22 22 L42 22" stroke={faint} />
            <path d="M42 24 Q50 24 50 30 Q50 34 44 34" />
            <path d="M28 50 Q30 54 32 56 Q34 54 36 50 Q34 52 32 52 Q30 52 28 50 Z" fill={ink} stroke="none" />
            <path d="M14 52 Q16 56 18 58" stroke={faint} />
          </g>
        );
      case "drop":
        return (
          <g>
            <rect x="22" y="14" width="20" height="36" rx="3" />
            <path d="M22 28 L42 28" stroke={faint} />
            <path d="M14 50 L24 36 M40 36 L50 50 M30 38 L34 50" stroke={ink} />
            <circle cx="32" cy="44" r="0.8" fill={ink} />
          </g>
        );
      case "forget":
        return (
          <g>
            <circle cx="24" cy="32" r="6" />
            <path d="M30 32 L48 32 L48 38 M42 32 L42 36" />
            <path d="M22 30 L26 30" />
          </g>
        );
      case "lose":
        return (
          <g>
            <path d="M20 28 Q20 22 26 22 L38 22 Q44 22 44 28 L46 48 L18 48 Z" />
            <path d="M26 22 Q26 16 32 16 Q38 16 38 22" />
            <path d="M28 38 L36 38" stroke={faint} />
          </g>
        );
      case "misspeak":
        return (
          <g>
            <path d="M14 22 Q14 16 20 16 L44 16 Q50 16 50 22 L50 34 Q50 40 44 40 L26 40 L18 48 L18 40 Q14 40 14 34 Z" />
            <path d="M22 26 L42 26 M22 30 L36 30" stroke={faint} />
          </g>
        );
      case "shamed":
        return (
          <g>
            <circle cx="32" cy="30" r="14" />
            <circle cx="26" cy="28" r="1.2" fill={ink} />
            <circle cx="38" cy="28" r="1.2" fill={ink} />
            <path d="M26 36 Q32 32 38 36" />
            <path d="M22 18 L18 12 M42 18 L46 12" stroke={faint} />
          </g>
        );
      case "rejected":
        return (
          <g>
            <rect x="14" y="20" width="36" height="24" rx="1" />
            <path d="M14 20 L32 34 L50 20" />
            <path d="M18 44 L26 36 M46 44 L38 36" stroke={faint} />
            <circle cx="48" cy="22" r="6" stroke="#c0392b" />
            <path d="M44 18 L52 26 M52 18 L44 26" stroke="#c0392b" />
          </g>
        );
      case "other_daily":
        return (
          <g>
            <rect x="16" y="22" width="32" height="26" />
            <path d="M16 22 L32 14 L48 22" />
            <path d="M32 14 L32 48 M16 30 L48 30" stroke={faint} />
            <text x="32" y="44" textAnchor="middle" fontSize="10" fontFamily="Cormorant Garamond" fill={ink} stroke="none">?</text>
          </g>
        );
      case "other_emo":
        return (
          <g>
            <rect x="22" y="32" width="20" height="20" />
            <path d="M28 32 L28 22 Q28 18 32 18 Q36 18 36 22 L36 32" />
            <path d="M30 14 Q32 10 32 8 Q33 10 32 14" stroke="#c0392b" fill="#c0392b" />
            <path d="M22 38 L42 38" stroke={faint} />
          </g>
        );
      case "procrast":
        return (
          <g>
            <circle cx="32" cy="32" r="16" />
            <path d="M32 22 L32 32 L42 36" />
            <path d="M32 14 L32 18 M32 46 L32 50 M14 32 L18 32 M46 32 L50 32" stroke={faint} />
          </g>
        );
      case "emo":
        return (
          <g>
            <path d="M16 28 Q22 18 32 18 Q42 18 48 28" />
            <path d="M14 30 L50 30" />
            <path d="M22 36 L20 46 M30 36 L28 48 M38 36 L36 46 M44 36 L42 46" stroke={faint} />
          </g>
        );
      case "broken":
        return (
          <g>
            <path d="M32 14 Q42 14 46 24 Q50 34 42 44 Q34 52 26 50 Q14 48 14 36 Q14 22 26 16 Q30 14 32 14 Z" />
            <path d="M32 14 L28 28 L36 32 L30 44" stroke="#b8860b" strokeWidth="1.5" />
            <path d="M28 28 L20 26 M36 32 L42 30" stroke="#b8860b" strokeWidth="1.5" />
          </g>
        );
    }
  })();

  return (
    <svg {...common}>
      {/* circular frame */}
      <circle cx="32" cy="32" r="29" stroke={faint} />
      <circle cx="32" cy="32" r="27" stroke={faint} strokeDasharray="2 2" />
      {glyph}
    </svg>
  );
}
