'use client';

import { useState, useMemo } from 'react';
import { SPACES } from '@/data/spaces';
import { TRAFFIC_DATA, ZONE_SUMMARIES } from '@/data/traffic';
import { scoreSpaces } from '@/lib/scoring';
import { LAYOUTS, applyLayout } from '@/data/layouts';
import FloorPlan from '@/components/FloorPlan';
import TimeSlider from '@/components/TimeSlider';
import SpaceDetail from '@/components/SpaceDetail';
import KpiCards from '@/components/KpiCards';
import { computeKpiSummary } from '@/components/LayoutSelector';
import { ChevronDown, Flame, Info } from 'lucide-react';

// Precompute scores and KPI summaries for every layout (static data, runs once)
const LAYOUT_DATA = LAYOUTS.map(layout => {
  const spaces = applyLayout(layout);
  const scores = scoreSpaces(spaces, ZONE_SUMMARIES);
  const kpi = computeKpiSummary(scores, spaces, ZONE_SUMMARIES);
  return { layout, spaces, scores, kpi };
});

const KPI_SUMMARIES = Object.fromEntries(
  LAYOUT_DATA.map(({ layout, kpi }) => [layout.id, kpi]),
);

export default function Home() {
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [currentMinute, setCurrentMinute] = useState(570); // 09:30
  const [activeLayoutId, setActiveLayoutId] = useState('balanced');

  const { spaces: activeSpaces, scores: activeScores } = useMemo(
    () => LAYOUT_DATA.find(d => d.layout.id === activeLayoutId)!,
    [activeLayoutId],
  );

  const trafficByZone = useMemo<Record<string, number>>(() => {
    const snapshot = TRAFFIC_DATA.filter(s => s.minuteOfDay === currentMinute);
    // Normalize each zone against its own daily max so zones can show independent colors
    return Object.fromEntries(snapshot.map(s => {
      const zoneMax = Math.max(...TRAFFIC_DATA.filter(d => d.zone === s.zone).map(d => d.devices), 1);
      return [s.zone, s.devices / zoneMax];
    }));
  }, [currentMinute]);

  const selectedSpaceData = selectedSpace ? activeSpaces.find(s => s.id === selectedSpace) : null;
  const selectedScore = selectedSpace ? activeScores.find(s => s.spaceId === selectedSpace) : null;
  const selectedZoneSummary = selectedSpace
    ? ZONE_SUMMARIES.find(z => z.zone === selectedSpaceData?.zone)
    : null;

  // Clear selection when switching layouts
  const handleLayoutChange = (id: string) => {
    setSelectedSpace(null);
    setActiveLayoutId(id);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Gallery Space Optimizer</h1>
            <p className="text-xs text-slate-500 mt-0.5">IAB Forum · MICO Milano · WiFi counting footfall analysis</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          {/* Layout dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Floor plan layout</span>
            <div className="relative">
              <select
                value={activeLayoutId}
                onChange={e => handleLayoutChange(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-sm font-semibold text-slate-700 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                {LAYOUTS.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.name} — {l.tagline}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="h-5 w-px bg-slate-200" />

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

        <div className="space-y-3">
          <KpiCards
            scores={activeScores}
            spaces={activeSpaces}
            zoneSummaries={ZONE_SUMMARIES}
          />

          {/* Floor plan + detail side by side */}
          <div className={`grid grid-cols-1 gap-4 items-stretch ${selectedSpace ? 'lg:grid-cols-4' : ''}`}>
            <div className={selectedSpace ? 'lg:col-span-3' : ''}>
              <FloorPlan
                spaces={activeSpaces}
                scores={activeScores}
                selectedSpace={selectedSpace}
                onSelectSpace={setSelectedSpace}
                showHeatmap={showHeatmap}
                trafficByZone={trafficByZone}
              />
            </div>
            {selectedSpaceData && selectedScore && selectedZoneSummary && (
              <div className="lg:col-span-1 h-full">
                <SpaceDetail
                  space={selectedSpaceData}
                  score={selectedScore}
                  zoneSummary={selectedZoneSummary}
                  onClose={() => setSelectedSpace(null)}
                />
              </div>
            )}
          </div>

          <TimeSlider
            samples={TRAFFIC_DATA}
            currentMinute={currentMinute}
            onChange={setCurrentMinute}
          />
        </div>
      </main>
    </div>
  );
}
