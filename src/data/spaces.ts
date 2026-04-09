// Rentable stand definitions – inspired by MICO Milano trade fair layout
export interface RentalSpace {
  id: string;
  name: string;
  zone: string;
  sqm: number;
  x: number;       // SVG coordinate
  y: number;
  width: number;
  height: number;
  type: 'premium' | 'standard' | 'corner' | 'anchor';
  basePrice: number; // €/day
  features: string[];
}

export const SPACES: RentalSpace[] = [
  // === NORTH ENTRANCE (high visibility) ===
  { id: 'N1', name: 'Stand N1 – North Entrance', zone: 'north_entrance', sqm: 24, x: 80, y: 120, width: 80, height: 60, type: 'premium', basePrice: 1800, features: ['first impression', 'double frontage'] },
  { id: 'N2', name: 'Stand N2 – North Entrance', zone: 'north_entrance', sqm: 18, x: 180, y: 120, width: 60, height: 60, type: 'standard', basePrice: 1200, features: ['corridor frontage'] },
  { id: 'N3', name: 'Stand N3 – North Corner', zone: 'north_entrance', sqm: 30, x: 260, y: 80, width: 90, height: 80, type: 'corner', basePrice: 2000, features: ['corner', '270° visibility'] },

  // === WEST WING ===
  { id: 'W1', name: 'Stand W1', zone: 'west_wing', sqm: 20, x: 80, y: 240, width: 70, height: 55, type: 'standard', basePrice: 900, features: ['side corridor'] },
  { id: 'W2', name: 'Stand W2', zone: 'west_wing', sqm: 20, x: 80, y: 310, width: 70, height: 55, type: 'standard', basePrice: 900, features: ['side corridor'] },
  { id: 'W3', name: 'Stand W3', zone: 'west_wing', sqm: 20, x: 80, y: 380, width: 70, height: 55, type: 'standard', basePrice: 900, features: ['side corridor'] },
  { id: 'W4', name: 'Stand W4 – Corner', zone: 'west_wing', sqm: 35, x: 80, y: 450, width: 70, height: 70, type: 'corner', basePrice: 1400, features: ['corner', 'break area'] },

  // === EAST WING ===
  { id: 'E1', name: 'Stand E1', zone: 'east_wing', sqm: 20, x: 650, y: 240, width: 70, height: 55, type: 'standard', basePrice: 950, features: ['side corridor'] },
  { id: 'E2', name: 'Stand E2', zone: 'east_wing', sqm: 20, x: 650, y: 310, width: 70, height: 55, type: 'standard', basePrice: 950, features: ['side corridor'] },
  { id: 'E3', name: 'Stand E3', zone: 'east_wing', sqm: 20, x: 650, y: 380, width: 70, height: 55, type: 'standard', basePrice: 950, features: ['side corridor'] },
  { id: 'E4', name: 'Stand E4 – Corner', zone: 'east_wing', sqm: 35, x: 650, y: 450, width: 70, height: 70, type: 'corner', basePrice: 1450, features: ['corner', 'near plenary hall'] },

  // === CENTRAL AREA (peak footfall) ===
  { id: 'C1', name: 'Island C1 – Central', zone: 'central', sqm: 48, x: 240, y: 270, width: 100, height: 80, type: 'anchor', basePrice: 3200, features: ['island', '4-side frontage', 'lounge area'] },
  { id: 'C2', name: 'Island C2 – Central', zone: 'central', sqm: 36, x: 380, y: 270, width: 80, height: 80, type: 'anchor', basePrice: 2800, features: ['island', '4-side frontage'] },
  { id: 'C3', name: 'Island C3 – Central', zone: 'central', sqm: 36, x: 510, y: 270, width: 80, height: 80, type: 'premium', basePrice: 2400, features: ['island', '4-side frontage'] },

  // === FOOD & BREAK AREA ===
  { id: 'F1', name: 'Food Corner F1', zone: 'food_area', sqm: 15, x: 240, y: 400, width: 60, height: 50, type: 'premium', basePrice: 1600, features: ['catering zone', 'high dwell time'] },
  { id: 'F2', name: 'Food Corner F2', zone: 'food_area', sqm: 15, x: 320, y: 400, width: 60, height: 50, type: 'premium', basePrice: 1600, features: ['catering zone', 'high dwell time'] },
  { id: 'F3', name: 'Food Corner F3', zone: 'food_area', sqm: 15, x: 400, y: 400, width: 60, height: 50, type: 'standard', basePrice: 1200, features: ['catering zone'] },

  // === SOUTH EXIT (bidirectional flow) ===
  { id: 'S1', name: 'Stand S1 – South', zone: 'south_exit', sqm: 22, x: 260, y: 510, width: 80, height: 60, type: 'standard', basePrice: 1000, features: ['plenary exit'] },
  { id: 'S2', name: 'Stand S2 – South', zone: 'south_exit', sqm: 22, x: 380, y: 510, width: 80, height: 60, type: 'standard', basePrice: 1000, features: ['plenary exit'] },
  { id: 'S3', name: 'Stand S3 – South', zone: 'south_exit', sqm: 22, x: 500, y: 510, width: 80, height: 60, type: 'standard', basePrice: 1000, features: ['plenary exit'] },
];

export const ZONES: Record<string, { label: string; color: string }> = {
  north_entrance: { label: 'North Entrance', color: '#6366f1' },
  west_wing: { label: 'West Wing', color: '#3b82f6' },
  east_wing: { label: 'East Wing', color: '#06b6d4' },
  central: { label: 'Central Area', color: '#f59e0b' },
  food_area: { label: 'Food & Break', color: '#10b981' },
  south_exit: { label: 'South Exit', color: '#8b5cf6' },
};
