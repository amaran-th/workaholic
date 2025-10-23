export type Color =
  | "white"
  | "green"
  | "blue"
  | "pink"
  | "violet"
  | "yellow"
  | "brown";

export const colorMap: Record<
  Color,
  { bg: string; primary: string; sub: string }
> = {
  white: { bg: "#FFFFFF", primary: "#7B7B7B", sub: "#E7E7E7" },
  green: { bg: "#EFFFF2", primary: "#007C27", sub: "#CCEFD2" },
  blue: { bg: "#EFFAFF", primary: "#004AB1", sub: "#D2F2FF" },
  pink: { bg: "#FFEFFB", primary: "#7C0051", sub: "#EFCCEB" },
  violet: { bg: "#F5E7FF", primary: "#7614FF", sub: "#C472FF" },
  yellow: { bg: "#FDFFE7", primary: "#CE9700", sub: "#FFF3B7" },
  brown: { bg: "#EBE6D4", primary: "#A87B00", sub: "#E4CCB1" },
};

export const HEADER_HEIGHT = 48;
