// Each kid's color, by their place in the kids list set up in Home Assistant.

export interface KidColor {
  /** Borders, dots and links. */
  color: string;
  /** "18,135,122", for tints. */
  rgb: string;
  /** Text on a tinted card. */
  ink: string;
}

const PALETTE: KidColor[] = [
  { color: "#12877A", rgb: "18,135,122", ink: "#0B5E55" },
  { color: "#2D5FC4", rgb: "45,95,196", ink: "#1E4594" },
  { color: "#B83E8A", rgb: "184,62,138", ink: "#8A2A66" },
  { color: "#B35C00", rgb: "179,92,0", ink: "#7F4100" },
  { color: "#6B4FBB", rgb: "107,79,187", ink: "#4C3590" },
  { color: "#3F7D20", rgb: "63,125,32", ink: "#2C5916" },
];

export function kidColor(index: number): KidColor {
  return PALETTE[((index % PALETTE.length) + PALETTE.length) % PALETTE.length]!;
}

export const DRIVER_DOT = "#23272E";
