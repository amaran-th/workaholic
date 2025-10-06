export type Color = "blue" | "green" | "white";

export const colorMap: Record<
  Color,
  { bg: string; primary: string; sub: string }
> = {
  green: { bg: "#EFFFF2", primary: "#007C27", sub: "#CCEFD2" },
  blue: { bg: "#EFFAFF", primary: "#004AB1", sub: "#D2F2FF" },
  white: { bg: "#FFFFFF", primary: "#7B7B7B", sub: "#E7E7E7" },
};

export const HEADER_HEIGHT = 48;
