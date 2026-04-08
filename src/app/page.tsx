'use client';

import { useState, useMemo } from 'react';
import { SPACES } from '@/data/spaces';
import { TRAFFIC_DATA, ZONE_SUMMARIES } from '@/data/traffic';
import { scoreSpaces, TIER_COLORS } from '@/lib/scoring';
import FloorPlan from '@/components/FloorPlan';
import TimeSlider from '@/components/TimeSlider';
import SpaceDetail from '@/components/SpaceDetail';
import RankingList from '@/components/RankingList';
import { BarChart2, Flame, MapPin, Info } from 'lucide-react';

const ALL_SCORES = scoreSpaces(SPACES, ZONE_SUMMARIES);

const totalRevenue = SPACES.reduce((acc, s) => {
  const score = ALL_SCORES.find(sc => sc.spaceId === s.id);
  if (!score) return acc;
  return acc + Math.round(s.basePrice * score.revenueIndex / 50) * 50;
}, 0);

const avgScore = Math.round(ALL_SCORES.reduce((a, s) => a + s.totalScore, 0) / ALL_SCORES.length);

export default function Home() {
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [currentMinute, setCurrentMinute] = useState(570); // 09:30

  const trafficByZone = useMemo<Record<string, number>>(() => {
    const snapshot = TRAFFIC_DATA.filter(s => s.minuteOfDay === currentMinute);
    const maxDevices = Math.max(...snapshot.map(s => s.devices), 1);
    return Object.fromEntries(snapshot.map(s => [s.zone, s.devices / maxDevices]));
  }, [currentMinute]);

  const selectedSpaceData = selectedSpace ? SPACES.find(s => s.id === selectedSpace) : null;
  const selectedScore = selectedSpace ? ALL_SCORES.find(s => s.spaceId === selectedSpace) : null;
  const selectedZoneSummary = selectedSpace ? ZONE_SUMMARIES.find(z => z.zone === selectedSpaceData?.zone) : null;

  const tierCounts = ALL_SCORES.reduce((acc, s) => {
    acc[s.tier] = (acc[s.tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Gallery Space Optimizer</h1>
            <p className="text-xs text-slate-500 mt-0.5">IAB Forum · MICO Milano · WiFi counting footfall analysis</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              {(['S','A','B','C'] as const).map(t => (
                <div key={t} className="flex items-center gap-1">
                  <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: TIER_COLORS[t] + '22', color: TIER_COLORS[t] }}>
                    {t}
                  </span>
                  <span className="text-xs font-bold text-slate-600">{tierCounts[t] ?? 0}</span>
                </div>
              ))}
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-right">
              <div className="text-xs text-slate-500">Potential revenue</div>
              <div className="text-base font-black text-slate-800">€{totalRevenue.toLocaleString()}/day</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Avg score</div>
              <div className="text-base font-black text-indigo-600">{avgScore}/100</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${showHeatmap ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <Flame size={14} />
            Traffic heatmap
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-500">
            <Info size={13} />
            Click a space for details · Drag the slider to explore traffic over time
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <div className="xl:col-span-3 space-y-4">
            <FloorPlan
              spaces={SPACES}
              scores={ALL_SCORES}
              selectedSpace={selectedSpace}
              onSelectSpace={setSelectedSpace}
              showHeatmap={showHeatmap}
              trafficByZone={trafficByZone}
            />
            <TimeSlider
              samples={TRAFFIC_DATA}
              currentMinute={currentMinute}
              onChange={setCurrentMinute}
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total spaces', value: SPACES.length, icon: <MapPin size={16} className="text-indigo-400" /> },
                { label: 'Est. attendees', value: '~1,500', icon: <BarChart2 size={16} className="text-emerald-400" /> },
                { label: 'Total impressions/day', value: ALL_SCORES.reduce((a,s) => a + s.estimatedImpressions, 0).toLocaleString(), icon: <Flame size={16} className="text-amber-400" /> },
                { label: 'Top tier spaces (S+A)', value: (tierCounts['S'] ?? 0) + (tierCounts['A'] ?? 0), icon: <BarChart2 size={16} className="text-rose-400" /> },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">{stat.icon}<span className="text-xs text-slate-500">{stat.label}</span></div>
                  <div className="text-xl font-black text-slate-800">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-1 space-y-4">
            {selectedSpaceData && selectedScore && selectedZoneSummary ? (
              <SpaceDetail
                space={selectedSpaceData}
                score={selectedScore}
                zoneSummary={selectedZoneSummary}
                onClose={() => setSelectedSpace(null)}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
                <MapPin size={24} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Select a space on the floor plan to view details and the optimised price</p>
              </div>
            )}
            <RankingList
              spaces={SPACES}
              scores={ALL_SCORES}
              selectedSpace={selectedSpace}
              onSelect={id => setSelectedSpace(prev => prev === id ? null : id)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
