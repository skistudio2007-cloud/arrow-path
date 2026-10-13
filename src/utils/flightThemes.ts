export interface FlightPalette {
  name: string;
  light: string; // Soft luminous tone at the tail (offset 0%)
  mid: string;   // Saturated vibrant tone in the middle (offset 50%)
  dark: string;  // Deep rich tone at the arrow head (offset 100%)
  halo: string;  // Translucent glowing tint for premium dot ripple
}

// Curated vibrant flight palettes (Strictly excluding black and red)
export const FLIGHT_PALETTES: FlightPalette[] = [
  // 1. Electric Royal Blue
  {
    name: 'blue',
    light: '#3b82f6', // Vivid Electric Blue (saturated tail)
    mid: '#1d4ed8',   // Royal Blue
    dark: '#1e3a8a',  // Deep Navy Head
    halo: 'rgba(59, 130, 246, 0.4)',
  },
  // 2. Cosmic Purple / Violet
  {
    name: 'purple',
    light: '#a855f7', // Vivid Electric Purple (saturated tail)
    mid: '#7e22ce',   // Royal Violet
    dark: '#4c1d95',  // Deep Violet Head
    halo: 'rgba(168, 85, 247, 0.4)',
  },
  // 3. Hot Pink / Neon Rose
  {
    name: 'pink',
    light: '#ec4899', // Vivid Hot Pink / Rose (saturated tail)
    mid: '#be185d',   // Deep Berry Magenta
    dark: '#831843',  // Deep Wine Magenta Head
    halo: 'rgba(236, 72, 153, 0.4)',
  },
  // 4. Emerald / Mint Green
  {
    name: 'green',
    light: '#10b981', // Vivid Emerald Green (saturated tail)
    mid: '#047857',   // Deep Forest Green
    dark: '#064e3b',  // Deep Pine Head
    halo: 'rgba(16, 185, 129, 0.4)',
  },
  // 5. Electric Cyan / Aqua
  {
    name: 'cyan',
    light: '#06b6d4', // Vivid Electric Cyan (saturated tail)
    mid: '#0e7490',   // Deep Ocean Cyan
    dark: '#164e63',  // Deep Midnight Cyan Head
    halo: 'rgba(6, 182, 212, 0.4)',
  },
  // 6. Golden Amber / Tangerine
  {
    name: 'amber',
    light: '#f59e0b', // Vivid Golden Amber (saturated tail)
    mid: '#d97706',   // Rich Deep Amber
    dark: '#78350f',  // Deep Caramel Head
    halo: 'rgba(245, 158, 11, 0.4)',
  },
  // 7. Vivid Indigo / Deep Iris
  {
    name: 'indigo',
    light: '#6366f1', // Vivid Electric Indigo (saturated tail)
    mid: '#4338ca',   // Royal Indigo
    dark: '#312e81',  // Midnight Indigo Head
    halo: 'rgba(99, 102, 241, 0.4)',
  },
  // 8. Ocean Teal / Lagoon
  {
    name: 'teal',
    light: '#14b8a6', // Vivid Tropical Teal (saturated tail)
    mid: '#0f766e',   // Rich Deep Teal
    dark: '#134e4a',  // Deep Forest Teal Head
    halo: 'rgba(20, 184, 166, 0.4)',
  },
];

export function getArrowFlightPalette(arrowId: string, index = 0): FlightPalette {
  let hash = 0;
  for (let i = 0; i < arrowId.length; i++) {
    hash = (hash * 31 + arrowId.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash + index) % FLIGHT_PALETTES.length;
  return FLIGHT_PALETTES[idx];
}
