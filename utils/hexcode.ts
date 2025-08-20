/**
 * Generates a hex color code with opacity.
 * 
 * @param color - The base hex color (e.g., '#ff5733').
 * @param opacity - The opacity value (0 to 1).
 * @returns The hex color with opacity (e.g., '#ff573380' for 50% opacity).
 */
export const generateHexWithOpacity = (color: string, opacity: number): string => {
  if (!/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(color)) {
    throw new Error('Invalid hex color format. Provide a valid hex color like #RRGGBB or #RGB.');
  }
  if (opacity < 0 || opacity > 1) {
    throw new Error('Opacity must be a value between 0 and 1.');
  }

  // Convert opacity to a two-digit hex value
  const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');

  // Handle shorthand hex colors (#RGB) by expanding to full format (#RRGGBB)
  if (color.length === 4) {
    color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }

  return `${color}${alpha}`;
};