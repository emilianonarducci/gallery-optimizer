'use client';

import { RentalSpace, ZONES } from '@/data/spaces';
import { SpaceScore, TIER_COLORS, TIER_BG } from '@/lib/scoring';
import { ZoneTrafficSummary } from '@/data/traffic';
import { X, TrendingUp, Users, Clock, Eye, Tag } from 'lucide-react';

interface Props {
  space: RentalSpace;
  score: SpaceScore;
  zoneSummary: ZoneTrafficSummary;
  onClose: () => void;
}

function ScoreBar({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="flex items-center gap-1 text-slate-600">{icon}{label}</span>
        <span className="font-bold text-slate-800">{value}/100</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, background: value > 70 ? '#10b981' : value > 45 ? '#f59e0b' : '#3b82f6' }}
        />
      </div>
    </div>
  );
}

export default function SpaceDetail({ space, score, zoneSummary, onClose }: Props) {
  const suggestedPrice = Math.round(space.basePrice * score.revenueIndex / 50) * 50;
  const zone = ZONES[space.zone];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: TIER_BG[score.tier], color: TIER_COLORS[score.tier] }}
            >
              Tier {score.tier}
            </span>
            <span className="text-xs text-slate-500" style={{ color: zone?.color }}>{zone?.label}</span>
          </div>
          <h2 className="text-base font-bold text-slate-800">{space.name}</h2>
          <p className="text-sm text-slate-500">{space.sqm} m² · type: <span className="font-medium">{space.type}</span></p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
          <X size={16} className="text-slate-400" />
        </button>
      </div>

      {/* Score breakdown */}
      <div className="space-y-3 mb-4">
        <ScoreBar label="Avg traffic" value={score.trafficScore} icon={<Users size={12} />} />
        <ScoreBar label="Peak traffic" value={score.peakScore} icon={<TrendingUp size={12} />} />
        <ScoreBar label="Position visibility" value={score.visibilityScore} icon={<Eye size={12} />} />
        <ScoreBar label="Zone dwell time" value={score.dwellScore} icon={<Clock size={12} />} />
      </div>

      <div className="h-px bg-slate-100 my-3" />

      {/* KPI zona */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-xs text-slate-500 mb-0.5">Avg devices</div>
          <div className="text-xl font-bold text-slate-800">{zoneSummary.avgDevices}</div>
          <div className="text-xs text-slate-400">peak {zoneSummary.peakDevices} @ {zoneSummary.peakTime}</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-xs text-slate-500 mb-0.5">Impressions/day</div>
          <div className="text-xl font-bold text-indigo-600">{score.estimatedImpressions.toLocaleString()}</div>
          <div className="text-xs text-slate-400">estimated contacts</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-xs text-slate-500 mb-0.5">Dwell time</div>
          <div className="text-xl font-bold text-slate-800">{zoneSummary.dwellMinutes} min</div>
          <div className="text-xs text-slate-400">zone average</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-xs text-slate-500 mb-0.5">Total score</div>
          <div className="text-xl font-bold" style={{ color: TIER_COLORS[score.tier] }}>{score.totalScore}/100</div>
          <div className="text-xs text-slate-400">optimisation index</div>
        </div>
      </div>

      {/* Prezzo suggerito */}
      <div className="rounded-xl p-3 border-2 mb-3" style={{ borderColor: TIER_COLORS[score.tier], background: TIER_BG[score.tier] }}>
        <div className="flex items-center gap-2 mb-1">
          <Tag size={14} style={{ color: TIER_COLORS[score.tier] }} />
          <span className="text-xs font-semibold" style={{ color: TIER_COLORS[score.tier] }}>Suggested price</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800">€{suggestedPrice.toLocaleString()}</span>
          <span className="text-xs text-slate-500">/ day</span>
          <span className="text-xs text-slate-400 ml-auto">base €{space.basePrice.toLocaleString()} × {score.revenueIndex}x</span>
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-1.5">
        {space.features.map(f => (
          <span key={f} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{f}</span>
        ))}
      </div>
    </div>
  );
}
