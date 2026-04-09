'use client';

import { LayoutConfig } from '@/data/layouts';
import { SpaceScore } from '@/lib/scoring';
import { RentalSpace } from '@/data/spaces';
import { ZoneTrafficSummary } from '@/data/traffic';

// Compute the three headline KPI values for a given set of spaces+scores
export function computeKpiSummary(
  scores: SpaceScore[],
  spaces: RentalSpace[],
  zoneSummaries: ZoneTrafficSummary[],
): { efficiency: number; risk: number; avgPrice: number } {
  const efficiency = Math.round(
    scores.reduce((acc, s) => acc + s.trafficScore * 0.5 + s.visibilityScore * 0.5, 0) /
      scores.length,
  );

  // Layout-sensitive bottleneck: zones with high peak spikes AND high-visibility stands = more risk
  const risk = Math.round(
    Math.min(
      100,
      Math.max(
        0,
        (zoneSummaries.reduce((acc, z) => {
          const congestion = Math.max(0, (z.peakDevices / z.avgDevices - 1) / 3);
          const zoneScores = scores.filter(
            s => spaces.find(sp => sp.id === s.spaceId)?.zone === z.zone,
          );
          const avgVis =
            zoneScores.length > 0
              ? zoneScores.reduce((a, s) => a + s.visibilityScore, 0) /
                zoneScores.length /
                100
              : 0.4;
          return acc + congestion * avgVis * avgVis; // squared to amplify trade-off
        }, 0) /
          zoneSummaries.length) *
          200, // scale to [0,100]
      ),
    ),
  );

  const suggestedPrices = spaces.map(s => {
    const score = scores.find(sc => sc.spaceId === s.id);
    return score ? Math.round((s.basePrice * score.revenueIndex) / 50) * 50 : s.basePrice;
  });
  const avgPrice = Math.round(
    suggestedPrices.reduce((a, p) => a + p, 0) / suggestedPrices.length,
  );

  return { efficiency, risk, avgPrice };
}

interface KpiSummary {
  efficiency: number;
  risk: number;
  avgPrice: number;
}

interface LayoutSelectorProps {
  layouts: LayoutConfig[];
  activeId: string;
  summaries: Record<string, KpiSummary>; // layoutId → kpi values
  onChange: (id: string) => void;
}

function MiniBar({
  value,
  max,
  color,
  invert = false,
}: {
  value: number;
  max: number;
  color: string;
  invert?: boolean; // for risk: low is green
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

export default function LayoutSelector({
  layouts,
  activeId,
  summaries,
  onChange,
}: LayoutSelectorProps) {
  const allSummaries = Object.values(summaries);
  const maxEfficiency = Math.max(...allSummaries.map(s => s.efficiency));
  const maxRisk = Math.max(...allSummaries.map(s => s.risk));
  const maxPrice = Math.max(...allSummaries.map(s => s.avgPrice));

  function formatPrice(p: number) {
    return p >= 1000 ? `€${(p / 1000).toFixed(p % 1000 === 0 ? 0 : 1)}k` : `€${p}`;
  }

  return (
    <div className="flex gap-2">
      {layouts.map(layout => {
        const summary = summaries[layout.id];
        const isActive = layout.id === activeId;

        return (
          <button
            key={layout.id}
            onClick={() => onChange(layout.id)}
            className="group relative flex-1 min-w-0 text-left rounded-xl border transition-all duration-150"
            style={{
              borderColor: isActive ? layout.accent : '#e2e8f0',
              background: isActive ? `${layout.accent}0d` : '#fff',
              boxShadow: isActive ? `0 0 0 1px ${layout.accent}` : undefined,
            }}
          >
            <div className="p-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-1 mb-2.5">
                <div>
                  <div className="flex items-center gap-1.5">
                    {/* Active dot */}
                    <span
                      className="inline-block w-2 h-2 rounded-full shrink-0 transition-all"
                      style={{ background: isActive ? layout.accent : '#cbd5e1' }}
                    />
                    <span
                      className="text-xs font-black"
                      style={{ color: isActive ? layout.accent : '#475569' }}
                    >
                      {layout.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 ml-3.5 mt-0.5">{layout.tagline}</p>
                </div>
              </div>

              {/* KPI mini bars */}
              <div className="space-y-1.5">
                {/* Efficiency */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-slate-400 w-7 shrink-0">EFF</span>
                  <MiniBar value={summary.efficiency} max={maxEfficiency} color="#6366f1" />
                  <span className="text-[9px] font-bold text-slate-500 w-7 text-right shrink-0">
                    {summary.efficiency}%
                  </span>
                </div>
                {/* Risk */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-slate-400 w-7 shrink-0">RISK</span>
                  <MiniBar
                    value={summary.risk}
                    max={maxRisk}
                    color={summary.risk > 55 ? '#ef4444' : summary.risk > 30 ? '#f59e0b' : '#10b981'}
                  />
                  <span className="text-[9px] font-bold text-slate-500 w-7 text-right shrink-0">
                    {summary.risk}%
                  </span>
                </div>
                {/* Avg Price */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-slate-400 w-7 shrink-0">€/s</span>
                  <MiniBar value={summary.avgPrice} max={maxPrice} color="#0891b2" />
                  <span className="text-[9px] font-bold text-slate-500 w-7 text-right shrink-0">
                    {formatPrice(summary.avgPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tooltip on hover */}
            <div className="absolute bottom-full mb-2 left-0 w-52 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150">
              <p className="text-xs text-white font-semibold mb-1">{layout.name}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{layout.description}</p>
              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-700" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
