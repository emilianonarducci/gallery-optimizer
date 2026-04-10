'use client';

import { RentalSpace, ZONES } from '@/data/spaces';
import { SpaceScore, TIER_COLORS } from '@/lib/scoring';

interface Props {
  spaces: RentalSpace[];
  scores: SpaceScore[];
  selectedSpace: string | null;
  onSelectSpace: (id: string | null) => void;
  showHeatmap: boolean;
  trafficByZone: Record<string, number>; // 0-1 normalized
}

// ─── Fixed non-allocatable fixtures ──────────────────────────────────────────
// These are structural constraints of the venue; they appear on every layout.
interface Fixture {
  id: string;
  label: string;
  sublabel?: string;
  x: number; y: number; w: number; h: number;
  fill: string;
  stroke: string;
  textColor: string;
  vertical?: boolean; // true → rotate label 90° (for narrow strips)
  hatch?: 'grey' | 'red';
}

const FIXTURES: Fixture[] = [
  // Toilets: narrow vertical strips on west and east walls
  { id: 'wc_w',    label: 'WC',          x: 63,  y: 222, w: 16, h: 96,  fill: '#f1f5f9', stroke: '#94a3b8', textColor: '#64748b', vertical: true,  hatch: 'grey' },
  { id: 'wc_e',    label: 'WC',          x: 721, y: 222, w: 16, h: 96,  fill: '#f1f5f9', stroke: '#94a3b8', textColor: '#64748b', vertical: true,  hatch: 'grey' },
  // Emergency fire exits: lower section of east/west walls
  { id: 'fire_sw', label: 'EXIT',        x: 63,  y: 480, w: 16, h: 55,  fill: '#fee2e2', stroke: '#ef4444', textColor: '#ef4444', vertical: true,  hatch: 'red'  },
  { id: 'fire_se', label: 'EXIT',        x: 721, y: 480, w: 16, h: 55,  fill: '#fee2e2', stroke: '#ef4444', textColor: '#ef4444', vertical: true,  hatch: 'red'  },
  // Emergency exit sign at north wall (above entrance)
  { id: 'fire_n',  label: '🚪 Emergency Exit', x: 490, y: 52,  w: 68,  h: 28,  fill: '#fee2e2', stroke: '#ef4444', textColor: '#ef4444' },
  // Technical / service room (cables, AV, logistics)
  { id: 'tech',    label: '⚙ Technical Room',  x: 492, y: 390, w: 78,  h: 80,  fill: '#f8fafc', stroke: '#94a3b8', textColor: '#94a3b8', hatch: 'grey' },
  // Info desk near north entrance
  { id: 'info',    label: 'ℹ Info Point',       x: 373, y: 52,  w: 76,  h: 28,  fill: '#eff6ff', stroke: '#3b82f6', textColor: '#3b82f6' },
  // First aid station
  { id: 'aid',     label: '✚ First Aid',         x: 165, y: 52,  w: 58,  h: 28,  fill: '#f0fdf4', stroke: '#22c55e', textColor: '#16a34a' },
];

export default function FloorPlan({ spaces, scores, selectedSpace, onSelectSpace, showHeatmap, trafficByZone }: Props) {
  const scoreMap = Object.fromEntries(scores.map(s => [s.spaceId, s]));

  const tierCounts = scores.reduce((acc, s) => {
    acc[s.tier] = (acc[s.tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  function heatmapColor(intensity: number): string {
    // Blue → Cyan → Green → Yellow → Orange → Red
    const stops: [number, [number, number, number]][] = [
      [0.00, [0,   0,   255]],
      [0.20, [0,   100, 255]],
      [0.40, [0,   220, 150]],
      [0.55, [0,   200, 0  ]],
      [0.70, [200, 255, 0  ]],
      [0.85, [255, 140, 0  ]],
      [1.00, [255, 0,   0  ]],
    ];
    let lo = stops[0], hi = stops[stops.length - 1];
    for (let i = 0; i < stops.length - 1; i++) {
      if (intensity >= stops[i][0] && intensity <= stops[i + 1][0]) {
        lo = stops[i]; hi = stops[i + 1]; break;
      }
    }
    const range = hi[0] - lo[0];
    const t = range === 0 ? 0 : (intensity - lo[0]) / range;
    const r = Math.round(lo[1][0] + t * (hi[1][0] - lo[1][0]));
    const g = Math.round(lo[1][1] + t * (hi[1][1] - lo[1][1]));
    const b = Math.round(lo[1][2] + t * (hi[1][2] - lo[1][2]));
    return `rgb(${r},${g},${b})`;
  }

  function spaceColor(space: RentalSpace): string {
    const score = scoreMap[space.id];
    if (!score) return '#e2e8f0';
    if (selectedSpace === space.id) return TIER_COLORS[score.tier];
    return `${TIER_COLORS[score.tier]}55`;
  }

  const zoneAreas = [
    { zone: 'north_entrance', x: 60,  y: 60,  w: 320, h: 120 },
    { zone: 'west_wing',      x: 60,  y: 210, w: 120, h: 340 },
    { zone: 'east_wing',      x: 620, y: 210, w: 120, h: 340 },
    { zone: 'central',        x: 200, y: 210, w: 460, h: 170 },
    { zone: 'food_area',      x: 200, y: 370, w: 280, h: 110 },
    { zone: 'south_exit',     x: 200, y: 480, w: 430, h: 110 },
  ];

  return (
    <div className="relative w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <svg viewBox="0 0 800 640" className="w-full" style={{ maxHeight: 520 }}>
        <defs>
          {/* Diagonal hatch patterns for non-allocatable fixtures */}
          <pattern id="hatch-grey" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
          </pattern>
          <pattern id="hatch-red" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#ef4444" strokeWidth="1" opacity="0.5" />
          </pattern>
          {/* Heatmap blur filter */}
          <filter id="heatblur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          {/* Heatmap legend gradient */}
          <linearGradient id="heatLegendGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgb(0,0,255)" />
            <stop offset="20%"  stopColor="rgb(0,100,255)" />
            <stop offset="40%"  stopColor="rgb(0,220,150)" />
            <stop offset="55%"  stopColor="rgb(0,200,0)" />
            <stop offset="70%"  stopColor="rgb(200,255,0)" />
            <stop offset="85%"  stopColor="rgb(255,140,0)" />
            <stop offset="100%" stopColor="rgb(255,0,0)" />
          </linearGradient>
        </defs>

        {/* Venue shell */}
        <rect x="50" y="50" width="700" height="560" rx="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />

        {/* Zone backgrounds */}
        {zoneAreas.map(area => (
          <g key={area.zone}>
            <rect
              x={area.x} y={area.y} width={area.w} height={area.h}
              rx="6"
              fill={showHeatmap ? 'transparent' : `${ZONES[area.zone]?.color ?? '#94a3b8'}18`}
              stroke={`${ZONES[area.zone]?.color ?? '#94a3b8'}44`}
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <text x={area.x + 8} y={area.y + 15} fontSize="9" fill={ZONES[area.zone]?.color ?? '#64748b'} fontFamily="system-ui" fontWeight="600" opacity="0.7">
              {ZONES[area.zone]?.label}
            </text>
          </g>
        ))}

        {/* ── Heatmap blobs (blurred radial ellipses) ── */}
        {showHeatmap && (
          <g filter="url(#heatblur)" opacity="0.82">
            {zoneAreas.map(area => {
              const intensity = trafficByZone[area.zone] ?? 0;
              if (intensity < 0.02) return null;
              const color = heatmapColor(intensity);
              const cx = area.x + area.w / 2;
              const cy = area.y + area.h / 2;
              return (
                <ellipse
                  key={area.zone}
                  cx={cx} cy={cy}
                  rx={area.w * 0.58} ry={area.h * 0.6}
                  fill={color}
                  opacity={0.25 + intensity * 0.6}
                />
              );
            })}
          </g>
        )}

        {/* Corridor guides */}
        <line x1="190" y1="60"  x2="190" y2="580" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 4" />
        <line x1="640" y1="60"  x2="640" y2="580" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 4" />
        <line x1="60"  y1="390" x2="740" y2="390" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 4" />

        {/* Entrance / exit labels */}
        <text x="375" y="42"  fontSize="10" fill="#64748b" textAnchor="middle" fontFamily="system-ui">↓ MAIN ENTRANCE ↓</text>


        {/* Plenary hall reference */}
        <rect x="200" y="590" width="400" height="28" rx="4" fill="#e0e7ff" stroke="#a5b4fc" strokeWidth="1.5" />
        <text x="400" y="608" fontSize="10" fill="#4f46e5" textAnchor="middle" fontFamily="system-ui" fontWeight="600">PLENARY HALL</text>

        {/* ── Non-allocatable fixtures ── */}
        {FIXTURES.map(f => {
          const cx = f.x + f.w / 2;
          const cy = f.y + f.h / 2;
          return (
            <g key={f.id}>
              {/* Background fill */}
              <rect x={f.x} y={f.y} width={f.w} height={f.h} rx="3" fill={f.fill} stroke={f.stroke} strokeWidth="1.5" strokeDasharray="3 2" />
              {/* Hatch overlay */}
              {f.hatch && (
                <rect x={f.x} y={f.y} width={f.w} height={f.h} rx="3" fill={`url(#hatch-${f.hatch})`} />
              )}
              {/* Label */}
              {f.vertical ? (
                <text
                  x={cx} y={cy}
                  fontSize="8"
                  fill={f.textColor}
                  textAnchor="middle"
                  fontFamily="system-ui"
                  fontWeight="700"
                  transform={`rotate(-90 ${cx} ${cy})`}
                >
                  {f.label}
                </text>
              ) : (
                <text x={cx} y={cy + 4} fontSize="8" fill={f.textColor} textAnchor="middle" fontFamily="system-ui" fontWeight="700">
                  {f.label}
                </text>
              )}
            </g>
          );
        })}

        {/* ── Rentable stands ── */}
        {spaces.map(space => {
          const score = scoreMap[space.id];
          const isSelected = selectedSpace === space.id;
          const bx = space.x + space.width - 18;
          const by = space.y + 4;
          return (
            <g key={space.id} onClick={() => onSelectSpace(isSelected ? null : space.id)} style={{ cursor: 'pointer' }}>
              <rect
                x={space.x} y={space.y} width={space.width} height={space.height}
                rx="4"
                fill={spaceColor(space)}
                stroke={isSelected ? TIER_COLORS[score?.tier ?? 'C'] : '#94a3b8'}
                strokeWidth={isSelected ? 2.5 : 1.5}
                className="transition-all duration-200"
              />
              <text x={space.x + space.width / 2} y={space.y + space.height / 2 - 4} fontSize="11" textAnchor="middle" fill="#1e293b" fontFamily="system-ui" fontWeight="700">
                {space.id}
              </text>
              <text x={space.x + space.width / 2} y={space.y + space.height / 2 + 9} fontSize="8" textAnchor="middle" fill="#475569" fontFamily="system-ui">
                {space.sqm}m²
              </text>
              {score && (
                <>
                  <rect x={bx} y={by} width="16" height="16" rx="3" fill={TIER_COLORS[score.tier]} />
                  <text x={bx + 8} y={by + 11} fontSize="9" textAnchor="middle" fill="white" fontFamily="system-ui" fontWeight="800">
                    {score.tier}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Fixture legend */}
        <rect x="52" y="597" width="10" height="10" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 1" />
        <rect x="52" y="597" width="10" height="10" rx="2" fill="url(#hatch-grey)" />
        <text x="66" y="606" fontSize="8" fill="#64748b" fontFamily="system-ui">Non-allocatable</text>

      </svg>

      {/* Bottom bar — tier distribution + heatmap legend */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-400 mr-1">Stand distribution</span>
        {(['S', 'A', 'B', 'C'] as const).map(t => (
          <div key={t} className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded text-white text-xs font-black" style={{ background: TIER_COLORS[t] }}>{t}</span>
            <span className="text-sm font-bold text-slate-700">{tierCounts[t] ?? 0}</span>
            <span className="text-xs text-slate-400 mr-1">stands</span>
          </div>
        ))}

        {showHeatmap && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Visitor Traffic</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400">Low</span>
              <div
                className="w-24 h-2.5 rounded-full"
                style={{ background: 'linear-gradient(to right, rgb(0,0,255), rgb(0,100,255), rgb(0,220,150), rgb(0,200,0), rgb(200,255,0), rgb(255,140,0), rgb(255,0,0))' }}
              />
              <span className="text-[10px] text-slate-400">High</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
