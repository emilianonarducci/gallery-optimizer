import { RentalSpace, SPACES } from './spaces';

export interface LayoutConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  spaces: RentalSpace[];
}

// ─── LAYOUT 2: Revenue Max ───────────────────────────────────────────────────
// Fewer stands, larger footprints, all anchor/premium, pushed into prime zones.
// Wings stripped down; central dominates. Max yield, max bottleneck pressure.
const REVENUE_MAX_SPACES: RentalSpace[] = [
  // North entrance – 2 large anchors, N2 removed
  { id: 'N1', name: 'Stand N1 – North Entrance', zone: 'north_entrance', sqm: 32, x: 80,  y: 98,  width: 102, height: 78, type: 'anchor',  basePrice: 2800, features: ['first impression', 'anchor', 'double frontage'] },
  { id: 'N3', name: 'Stand N3 – North Corner',   zone: 'north_entrance', sqm: 40, x: 265, y: 66,  width: 115, height: 88, type: 'anchor',  basePrice: 3200, features: ['corner', '270° visibility', 'anchor'] },

  // West wing – 1 tall premium + 1 large anchor (W2/W3 removed)
  { id: 'W1', name: 'Stand W1',         zone: 'west_wing', sqm: 30, x: 82, y: 228, width: 72, height: 118, type: 'premium', basePrice: 1600, features: ['side corridor', 'double height'] },
  { id: 'W4', name: 'Stand W4 – Anchor',zone: 'west_wing', sqm: 42, x: 82, y: 430, width: 72, height: 88,  type: 'anchor',  basePrice: 2800, features: ['corner', 'anchor', 'break area'] },

  // East wing – mirror of west
  { id: 'E1', name: 'Stand E1',         zone: 'east_wing', sqm: 30, x: 646, y: 228, width: 72, height: 118, type: 'premium', basePrice: 1700, features: ['side corridor', 'double height'] },
  { id: 'E4', name: 'Stand E4 – Anchor',zone: 'east_wing', sqm: 42, x: 646, y: 430, width: 72, height: 88,  type: 'anchor',  basePrice: 2900, features: ['corner', 'anchor', 'near plenary'] },

  // Central – 3 large anchor islands (wider, taller than balanced)
  { id: 'C1', name: 'Island C1 – Central', zone: 'central', sqm: 64, x: 215, y: 220, width: 132, height: 108, type: 'anchor', basePrice: 4200, features: ['island', '4-side frontage', 'lounge'] },
  { id: 'C2', name: 'Island C2 – Central', zone: 'central', sqm: 55, x: 364, y: 220, width: 115, height: 108, type: 'anchor', basePrice: 3800, features: ['island', '4-side frontage'] },
  { id: 'C3', name: 'Island C3 – Central', zone: 'central', sqm: 48, x: 490, y: 220, width: 102, height: 108, type: 'anchor', basePrice: 3400, features: ['island', '4-side frontage'] },

  // Food area – 2 large anchors (F3 removed, more space between stands)
  { id: 'F1', name: 'Food Stand F1', zone: 'food_area', sqm: 30, x: 215, y: 378, width: 100, height: 82, type: 'anchor', basePrice: 2600, features: ['catering zone', 'anchor', 'high dwell'] },
  { id: 'F2', name: 'Food Stand F2', zone: 'food_area', sqm: 30, x: 328, y: 378, width: 100, height: 82, type: 'anchor', basePrice: 2400, features: ['catering zone', 'anchor', 'high dwell'] },

  // South – 2 larger premium (S3 removed)
  { id: 'S1', name: 'Stand S1 – South', zone: 'south_exit', sqm: 28, x: 215, y: 493, width: 128, height: 68, type: 'premium', basePrice: 1700, features: ['plenary exit', 'double frontage'] },
  { id: 'S2', name: 'Stand S2 – South', zone: 'south_exit', sqm: 28, x: 360, y: 493, width: 128, height: 68, type: 'premium', basePrice: 1700, features: ['plenary exit', 'double frontage'] },
];

// ─── LAYOUT 3: Flow First ────────────────────────────────────────────────────
// All stands pushed to perimeter walls. Central area completely open corridor.
// C1/C2/C3 relocated to the north edge of the central zone (wall-mounted).
// More stands, smaller, standard/corner types.
const FLOW_FIRST_SPACES: RentalSpace[] = [
  // North entrance
  { id: 'N1', name: 'Stand N1', zone: 'north_entrance', sqm: 18, x: 82,  y: 108, width: 78, height: 60, type: 'standard', basePrice: 1200, features: ['corridor frontage'] },
  { id: 'N2', name: 'Stand N2', zone: 'north_entrance', sqm: 14, x: 175, y: 108, width: 62, height: 60, type: 'standard', basePrice: 900,  features: ['corridor frontage'] },
  { id: 'N3', name: 'Stand N3 – Corner', zone: 'north_entrance', sqm: 24, x: 262, y: 68, width: 100, height: 78, type: 'corner', basePrice: 1600, features: ['corner', '270° visibility'] },

  // West wing – all 4 stands, narrow, against left wall
  { id: 'W1', name: 'Stand W1', zone: 'west_wing', sqm: 16, x: 82, y: 226, width: 68, height: 50, type: 'standard', basePrice: 780, features: ['wall-mounted'] },
  { id: 'W2', name: 'Stand W2', zone: 'west_wing', sqm: 16, x: 82, y: 284, width: 68, height: 50, type: 'standard', basePrice: 780, features: ['wall-mounted'] },
  { id: 'W3', name: 'Stand W3', zone: 'west_wing', sqm: 16, x: 82, y: 342, width: 68, height: 50, type: 'standard', basePrice: 780, features: ['wall-mounted'] },
  { id: 'W4', name: 'Stand W4 – Corner', zone: 'west_wing', sqm: 22, x: 82, y: 410, width: 68, height: 60, type: 'corner', basePrice: 1100, features: ['corner', 'break area'] },

  // East wing – mirror, against right wall
  { id: 'E1', name: 'Stand E1', zone: 'east_wing', sqm: 16, x: 650, y: 226, width: 68, height: 50, type: 'standard', basePrice: 780, features: ['wall-mounted'] },
  { id: 'E2', name: 'Stand E2', zone: 'east_wing', sqm: 16, x: 650, y: 284, width: 68, height: 50, type: 'standard', basePrice: 780, features: ['wall-mounted'] },
  { id: 'E3', name: 'Stand E3', zone: 'east_wing', sqm: 16, x: 650, y: 342, width: 68, height: 50, type: 'standard', basePrice: 780, features: ['wall-mounted'] },
  { id: 'E4', name: 'Stand E4 – Corner', zone: 'east_wing', sqm: 22, x: 650, y: 410, width: 68, height: 60, type: 'corner', basePrice: 1100, features: ['corner', 'near plenary'] },

  // Central – stands along NORTH WALL only (no islands, center is open corridor)
  { id: 'C1', name: 'Wall C1', zone: 'central', sqm: 22, x: 200, y: 212, width: 98,  height: 52, type: 'standard', basePrice: 900, features: ['wall-mounted', 'open corridor view'] },
  { id: 'C2', name: 'Wall C2', zone: 'central', sqm: 22, x: 312, y: 212, width: 98,  height: 52, type: 'standard', basePrice: 900, features: ['wall-mounted', 'open corridor view'] },
  { id: 'C3', name: 'Wall C3', zone: 'central', sqm: 18, x: 424, y: 212, width: 82,  height: 52, type: 'standard', basePrice: 800, features: ['wall-mounted'] },

  // Food area
  { id: 'F1', name: 'Food Stand F1', zone: 'food_area', sqm: 14, x: 215, y: 402, width: 74, height: 55, type: 'premium', basePrice: 1300, features: ['catering zone'] },
  { id: 'F2', name: 'Food Stand F2', zone: 'food_area', sqm: 14, x: 303, y: 402, width: 74, height: 55, type: 'premium', basePrice: 1300, features: ['catering zone'] },
  { id: 'F3', name: 'Food Stand F3', zone: 'food_area', sqm: 14, x: 391, y: 402, width: 74, height: 55, type: 'standard', basePrice: 1000, features: ['catering zone'] },

  // South
  { id: 'S1', name: 'Stand S1', zone: 'south_exit', sqm: 18, x: 215, y: 490, width: 84, height: 58, type: 'standard', basePrice: 850, features: ['plenary exit'] },
  { id: 'S2', name: 'Stand S2', zone: 'south_exit', sqm: 18, x: 313, y: 490, width: 84, height: 58, type: 'standard', basePrice: 850, features: ['plenary exit'] },
  { id: 'S3', name: 'Stand S3', zone: 'south_exit', sqm: 18, x: 411, y: 490, width: 84, height: 58, type: 'standard', basePrice: 850, features: ['plenary exit'] },
];

// ─── LAYOUT 4: Central Cluster ───────────────────────────────────────────────
// All premium/anchor mass concentrated in central core + food zone.
// Wings and entrance/exit completely empty. High local density = high bottleneck in center.
const CENTRAL_CLUSTER_SPACES: RentalSpace[] = [
  // Central – large cluster of islands (2 rows)
  { id: 'C1', name: 'Island C1',    zone: 'central', sqm: 58, x: 205, y: 216, width: 140, height: 108, type: 'anchor',  basePrice: 3800, features: ['island', '4-side frontage', 'lounge'] },
  { id: 'C2', name: 'Island C2',    zone: 'central', sqm: 50, x: 360, y: 216, width: 122, height: 108, type: 'anchor',  basePrice: 3400, features: ['island', '4-side frontage'] },
  { id: 'C3', name: 'Island C3',    zone: 'central', sqm: 44, x: 492, y: 216, width: 105, height: 108, type: 'anchor',  basePrice: 3000, features: ['island', '4-side frontage'] },
  { id: 'C4', name: 'Cluster C4',   zone: 'central', sqm: 26, x: 218, y: 338, width: 110, height: 44,  type: 'premium', basePrice: 2000, features: ['second row', 'premium'] },
  { id: 'C5', name: 'Cluster C5',   zone: 'central', sqm: 26, x: 342, y: 338, width: 110, height: 44,  type: 'anchor',  basePrice: 2400, features: ['second row', 'anchor'] },

  // Food area – all large anchors
  { id: 'F1', name: 'Food Stand F1', zone: 'food_area', sqm: 30, x: 218, y: 390, width: 90, height: 78, type: 'anchor',  basePrice: 3000, features: ['catering zone', 'anchor', 'high dwell'] },
  { id: 'F2', name: 'Food Stand F2', zone: 'food_area', sqm: 30, x: 322, y: 390, width: 90, height: 78, type: 'anchor',  basePrice: 2800, features: ['catering zone', 'anchor'] },
  { id: 'F3', name: 'Food Stand F3', zone: 'food_area', sqm: 22, x: 420, y: 390, width: 60, height: 78, type: 'premium', basePrice: 2200, features: ['catering zone', 'premium'] },
];

// ─── Layout registry ─────────────────────────────────────────────────────────
export const LAYOUTS: LayoutConfig[] = [
  {
    id: 'balanced',
    name: 'Balanced',
    tagline: 'Default baseline',
    description: 'Original configuration: 21 stands spread across all zones with mixed types. The reference layout to compare against.',
    accent: '#6366f1',
    spaces: SPACES,
  },
  {
    id: 'revenue_max',
    name: 'Revenue Max',
    tagline: 'Fewer, larger, premium stands',
    description: '13 large anchor/premium stands placed in the highest-traffic zones. Wider stand footprints maximise yield per sqm at the cost of heavy congestion in central areas.',
    accent: '#f59e0b',
    spaces: REVENUE_MAX_SPACES,
  },
  {
    id: 'flow_first',
    name: 'Flow First',
    tagline: 'Stands on walls, center open',
    description: '20 smaller wall-mounted stands clear the central corridor entirely. Bottleneck risk drops sharply; revenue and efficiency take a hit.',
    accent: '#10b981',
    spaces: FLOW_FIRST_SPACES,
  },
  {
    id: 'central_cluster',
    name: 'Central Cluster',
    tagline: 'All premium mass in core',
    description: '8 large stands concentrated in the central area and food zone only. Wings and entrance are empty. Very high local congestion pressure, very low peripheral noise.',
    accent: '#ef4444',
    spaces: CENTRAL_CLUSTER_SPACES,
  },
];

export function applyLayout(layout: LayoutConfig): RentalSpace[] {
  return layout.spaces;
}
