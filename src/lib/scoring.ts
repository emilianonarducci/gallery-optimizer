import { RentalSpace } from '@/data/spaces';
import { ZoneTrafficSummary } from '@/data/traffic';

export interface SpaceScore {
  spaceId: string;
  trafficScore: number;    // 0-100: average zone traffic
  peakScore: number;       // 0-100: peak device count
  dwellScore: number;      // 0-100: average dwell time
  visibilityScore: number; // 0-100: stand type position (corner, island, etc.)
  totalScore: number;      // 0-100 weighted
  tier: 'S' | 'A' | 'B' | 'C';
  estimatedImpressions: number; // estimated daily contacts
  revenueIndex: number;    // multiplier on base price
}

const TIER_THRESHOLDS = { S: 80, A: 65, B: 45 };

const VISIBILITY_BONUS: Record<string, number> = {
  anchor: 100,
  corner: 80,
  premium: 70,
  standard: 40,
};

export function scoreSpaces(spaces: RentalSpace[], summaries: ZoneTrafficSummary[]): SpaceScore[] {
  const maxAvg = Math.max(...summaries.map(s => s.avgDevices));
  const maxPeak = Math.max(...summaries.map(s => s.peakDevices));
  const maxDwell = Math.max(...summaries.map(s => s.dwellMinutes));
  const maxPassBy = Math.max(...summaries.map(s => s.totalPassBy));

  return spaces.map(space => {
    const summary = summaries.find(s => s.zone === space.zone);
    if (!summary) return null;

    const trafficScore = Math.round((summary.avgDevices / maxAvg) * 100);
    const peakScore = Math.round((summary.peakDevices / maxPeak) * 100);
    const dwellScore = Math.round((summary.dwellMinutes / maxDwell) * 100);
    const visibilityScore = VISIBILITY_BONUS[space.type] ?? 40;

    // Weights: traffic 35%, peak 25%, visibility 25%, dwell 15%
    const totalScore = Math.round(
      trafficScore * 0.35 +
      peakScore * 0.25 +
      visibilityScore * 0.25 +
      dwellScore * 0.15
    );

    const tier: SpaceScore['tier'] =
      totalScore >= TIER_THRESHOLDS.S ? 'S' :
      totalScore >= TIER_THRESHOLDS.A ? 'A' :
      totalScore >= TIER_THRESHOLDS.B ? 'B' : 'C';

    // Estimated impressions (daily pass-by proportional to zone traffic)
    const estimatedImpressions = Math.round(
      (summary.totalPassBy / maxPassBy) * 3500 * (visibilityScore / 100)
    );

    // Revenue index: suggested multiplier on base price
    const revenueIndex = 0.5 + (totalScore / 100) * 1.5;

    return { spaceId: space.id, trafficScore, peakScore, dwellScore, visibilityScore, totalScore, tier, estimatedImpressions, revenueIndex: Math.round(revenueIndex * 100) / 100 };
  }).filter(Boolean) as SpaceScore[];
}

export const TIER_COLORS: Record<string, string> = {
  S: '#f59e0b',
  A: '#10b981',
  B: '#3b82f6',
  C: '#94a3b8',
};

export const TIER_BG: Record<string, string> = {
  S: '#fef3c7',
  A: '#d1fae5',
  B: '#dbeafe',
  C: '#f1f5f9',
};
