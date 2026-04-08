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

export default function FloorPlan({ spaces, scores, selectedSpace, onSelectSpace, showHeatmap, trafficByZone }: Props) {
  const scoreMap = Object.fromEntries(scores.map(s => [s.spaceId, s]));

  function heatColor(intensity: number): string {
    // blue → yellow → red
    if (intensity < 0.33) {
      const t = intensity / 0.33;
      return `rgba(59,130,246,${0.15 + t * 0.25})`;
    } else if (intensity < 0.66) {
      const t = (intensity - 0.33) / 0.33;
      return `rgba(245,158,11,${0.2 + t * 0.3})`;
    } else {
      const t = (intensity - 0.66) / 0.34;
      return `rgba(239,68,68,${0.3 + t * 0.4})`;
    }
  }

  function spaceColor(space: RentalSpace): string {
    const score = scoreMap[space.id];
    if (!score) return '#e2e8f0';
    if (selectedSpace === space.id) return TIER_COLORS[score.tier];
    return `${TIER_COLORS[score.tier]}55`;
  }

  function tierBadgeX(space: RentalSpace): number {
    return space.x + space.width - 18;
  }
  function tierBadgeY(space: RentalSpace): number {
    return space.y + 4;
  }

  // Zone background rectangles (aree logiche)
  const zoneAreas = [
    { zone: 'north_entrance', x: 60, y: 60, w: 320, h: 120 },
    { zone: 'west_wing',      x: 60, y: 210, w: 120, h: 340 },
    { zone: 'east_wing',      x: 620, y: 210, w: 120, h: 340 },
    { zone: 'central',        x: 200, y: 210, w: 460, h: 170 },
    { zone: 'food_area',      x: 200, y: 370, w: 280, h: 110 },
    { zone: 'south_exit',     x: 200, y: 480, w: 430, h: 110 },
  ];

  return (
    <div className="relative w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <svg viewBox="0 0 800 640" className="w-full" style={{ maxHeight: 520 }}>
        {/* Sfondo venue */}
        <rect x="50" y="50" width="700" height="560" rx="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />

        {/* Zone logiche con heatmap opzionale */}
        {zoneAreas.map(area => {
          const intensity = trafficByZone[area.zone] ?? 0;
          return (
            <g key={area.zone}>
              <rect
                x={area.x} y={area.y} width={area.w} height={area.h}
                rx="6"
                fill={showHeatmap ? heatColor(intensity) : `${ZONES[area.zone]?.color ?? '#94a3b8'}18`}
                stroke={`${ZONES[area.zone]?.color ?? '#94a3b8'}44`}
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text
                x={area.x + 8} y={area.y + 16}
                fontSize="9" fill={ZONES[area.zone]?.color ?? '#64748b'}
                fontFamily="system-ui" fontWeight="600" opacity="0.7"
              >
                {ZONES[area.zone]?.label}
              </text>
            </g>
          );
        })}

        {/* Corridoi principali */}
        <line x1="190" y1="60" x2="190" y2="580" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 4" />
        <line x1="640" y1="60" x2="640" y2="580" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 4" />
        <line x1="60" y1="390" x2="740" y2="390" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 4" />

        {/* Entrance arrows */}
        <text x="375" y="42" fontSize="10" fill="#64748b" textAnchor="middle" fontFamily="system-ui">↓ MAIN ENTRANCE ↓</text>
        <text x="375" y="622" fontSize="10" fill="#64748b" textAnchor="middle" fontFamily="system-ui">↑ EXIT / PLENARY HALL ↑</text>

        {/* Plenary hall (reference) */}
        <rect x="200" y="590" width="400" height="30" rx="4" fill="#e0e7ff" stroke="#a5b4fc" strokeWidth="1.5" />
        <text x="400" y="610" fontSize="10" fill="#4f46e5" textAnchor="middle" fontFamily="system-ui" fontWeight="600">PLENARY HALL</text>

        {/* Spazi affittabili */}
        {spaces.map(space => {
          const score = scoreMap[space.id];
          const isSelected = selectedSpace === space.id;
          return (
            <g key={space.id} onClick={() => onSelectSpace(isSelected ? null : space.id)} style={{ cursor: 'pointer' }}>
              <rect
                x={space.x} y={space.y} width={space.width} height={space.height}
                rx="4"
                fill={spaceColor(space)}
                stroke={isSelected ? TIER_COLORS[score?.tier ?? 'C'] : '#94a3b8'}
                strokeWidth={isSelected ? 2.5 : 1.5}
                className="transition-all duration-150"
              />
              {/* ID spazio */}
              <text
                x={space.x + space.width / 2} y={space.y + space.height / 2 - 4}
                fontSize="11" textAnchor="middle" fill="#1e293b"
                fontFamily="system-ui" fontWeight="700"
              >
                {space.id}
              </text>
              <text
                x={space.x + space.width / 2} y={space.y + space.height / 2 + 9}
                fontSize="8" textAnchor="middle" fill="#475569"
                fontFamily="system-ui"
              >
                {space.sqm}m²
              </text>
              {/* Tier badge */}
              {score && (
                <>
                  <rect
                    x={tierBadgeX(space)} y={tierBadgeY(space)}
                    width="16" height="16" rx="3"
                    fill={TIER_COLORS[score.tier]}
                  />
                  <text
                    x={tierBadgeX(space) + 8} y={tierBadgeY(space) + 11}
                    fontSize="9" textAnchor="middle" fill="white"
                    fontFamily="system-ui" fontWeight="800"
                  >
                    {score.tier}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Legenda tier */}
        {['S','A','B','C'].map((t, i) => (
          <g key={t}>
            <rect x={620 + i * 26} y={56} width="20" height="14" rx="3" fill={TIER_COLORS[t]} />
            <text x={630 + i * 26} y={67} fontSize="8" textAnchor="middle" fill="white" fontFamily="system-ui" fontWeight="800">{t}</text>
          </g>
        ))}
        <text x="620" y="50" fontSize="8" fill="#64748b" fontFamily="system-ui">Tier:</text>

      </svg>
    </div>
  );
}
