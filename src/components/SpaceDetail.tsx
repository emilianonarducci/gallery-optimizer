'use client';

import { RentalSpace, ZONES } from '@/data/spaces';
import { SpaceScore, TIER_COLORS, TIER_BG } from '@/lib/scoring';
import { ZoneTrafficSummary } from '@/data/traffic';
import { X, Euro, Activity, Crosshair } from 'lucide-react';

interface Props {
  space: RentalSpace;
  score: SpaceScore;
  zoneSummary: ZoneTrafficSummary;
  onClose: () => void;
}

export default function SpaceDetail({ space, score, zoneSummary, onClose }: Props) {
  const suggestedPrice = Math.round(space.basePrice * score.revenueIndex / 50) * 50;
  const zone = ZONES[space.zone];
  const paxPerHour = Math.round(zoneSummary.avgDevices * (60 / Math.max(zoneSummary.dwellMinutes, 5)));
  const visColor = score.visibilityScore >= 70 ? '#10b981' : score.visibilityScore >= 50 ? '#f59e0b' : '#94a3b8';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: TIER_BG[score.tier], color: TIER_COLORS[score.tier] }}
            >
              Tier {score.tier}
            </span>
            <span className="text-xs font-medium" style={{ color: zone?.color }}>{zone?.label}</span>
          </div>
          <h2 className="text-sm font-bold text-slate-800 leading-tight">{space.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{space.sqm} m² · {space.type}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors shrink-0">
          <X size={15} className="text-slate-400" />
        </button>
      </div>

      {/* KPIs — sized to content */}
      <div className="flex flex-col gap-3">

        {/* Est. Price */}
        <div className="rounded-2xl p-4" style={{ background: TIER_BG[score.tier] }}>
          <div className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: TIER_COLORS[score.tier] }}>
            <Euro size={13} />
            Estimated Stand Price
          </div>
          <div className="text-3xl font-black text-slate-800 leading-none">
            €{suggestedPrice.toLocaleString()}
          </div>
        </div>

        {/* Pax / hour */}
        <div className="rounded-2xl p-4 bg-indigo-50">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 mb-2">
            <Activity size={13} />
            Estimated Pax / hour
          </div>
          <div className="text-3xl font-black text-slate-800 leading-none">{paxPerHour}</div>
        </div>

        {/* Visibility Index */}
        <div className="rounded-2xl p-4 bg-slate-50">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
            <Crosshair size={13} />
            Visibility Index
          </div>
          <div className="flex items-end gap-1 leading-none">
            <span className="text-3xl font-black" style={{ color: visColor }}>{score.visibilityScore}</span>
            <span className="text-sm font-semibold text-slate-300 mb-0.5">/100</span>
          </div>
          <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score.visibilityScore}%`, background: visColor }} />
          </div>
        </div>

      </div>
    </div>
  );
}
