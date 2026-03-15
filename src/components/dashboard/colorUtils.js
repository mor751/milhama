export const clampColor = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(255, Math.round(n)));
};

export const rgbToHex = (r, g, b) => {
  const toHex = (v) => clampColor(v).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

export const hexToRgb = (hex) => {
  if (!hex) return null;
  const cleaned = hex.toString().trim().replace("#", "");
  if (cleaned.length !== 6) return null;
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  if ([r, g, b].some((v) => Number.isNaN(v))) return null;
  return { r, g, b };
};

export const extractHex = (color) => {
  if (!color) return null;
  if (color.startsWith("#")) return color.toUpperCase();
  const match = color.match(/#([0-9a-fA-F]{6})/);
  return match ? `#${match[1].toUpperCase()}` : null;
};

export const toRgba = (hex, alpha) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(0,0,0,${alpha})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};
