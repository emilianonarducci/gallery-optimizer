'use client';

import { RentalSpace } from '@/data/spaces';
import { SpaceScore, TIER_COLORS, TIER_BG } from '@/lib/scoring';

interface Props {
  spaces: RentalSpace[];
  scores: SpaceScore[];
  selectedSpace: string | null;
  onSelect: (id: string) => void;
}

export default function RankingList({ spaces, scores, selectedSpace, onSelect }: Props) {
  const spaceMap = Object.fromEntries(spaces.map(s => [s.id, s]));
  const sorted = [...scores].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-700">Space Ranking</h3>
        <p className="text-xs text-slate-400">sorted by optimisation score</p>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: 340 }}>
        {sorted.map((score, idx) => {
          const space = spaceMap[score.spaceId];
          if (!space) return null;
          const isSelected = selectedSpace === space.id;
          const suggestedPrice = Math.round(space.basePrice * score.revenueIndex / 50) * 50;

          return (
            <button
              key={score.spaceId}
              onClick={() => onSelect(space.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${isSelected ? 'bg-indigo-50' : ''}`}
            >
              {/* Rank */}
              <span className="text-xs font-bold text-slate-400 w-5 text-center">{idx + 1}</span>

              {/* Tier badge */}
              <span
                className="text-xs font-black w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ background: TIER_BG[score.tier], color: TIER_COLORS[score.tier] }}
              >
                {score.tier}
              </span>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-800 truncate">{space.name}</div>
                <div className="text-xs text-slate-400">{space.sqm}m² · {score.estimatedImpressions.toLocaleString()} impr.</div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-slate-800">{score.totalScore}</div>
                <div className="text-xs text-slate-400">€{suggestedPrice.toLocaleString()}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
