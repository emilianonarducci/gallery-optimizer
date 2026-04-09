'use client';

import { TrafficSample } from '@/data/traffic';

interface Props {
  samples: TrafficSample[];
  currentMinute: number;
  onChange: (minute: number) => void;
}

export default function TimeSlider({ samples, currentMinute, onChange }: Props) {
  const times = [...new Set(samples.map(s => s.minuteOfDay))].sort((a, b) => a - b);
  const minMin = Math.min(...times);
  const maxMin = Math.max(...times);

  function minuteToLabel(m: number): string {
    const h = Math.floor(m / 60);
    const min = m % 60;
    return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  }

  // Aggregate devices per time slot for sparkline
  const totalPerTime = times.map(t => {
    const ss = samples.filter(s => s.minuteOfDay === t);
    return { t, v: ss.reduce((a, s) => a + s.devices, 0) };
  });
  const maxTotal = Math.max(...totalPerTime.map(d => d.v));

  const barW = 480 / times.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700">Event day timeline</span>
        <span className="text-lg font-bold text-indigo-600 tabular-nums">{minuteToLabel(currentMinute)}</span>
      </div>

      {/* Total traffic sparkline */}
      <svg viewBox="0 0 480 40" className="w-full mb-2">
        {totalPerTime.map(({ t, v }, i) => {
          const h = (v / maxTotal) * 32;
          const isActive = t === currentMinute;
          return (
            <rect
              key={t}
              x={i * barW} y={40 - h} width={Math.max(barW - 1, 1)} height={h}
              fill={isActive ? '#6366f1' : v / maxTotal > 0.7 ? '#fbbf24' : '#c7d2fe'}
              rx="1"
              style={{ cursor: 'pointer' }}
              onClick={() => onChange(t)}
            />
          );
        })}
      </svg>

      <input
        type="range"
        min={minMin}
        max={maxMin}
        step={15}
        value={currentMinute}
        onChange={e => {
          const v = Number(e.target.value);
          // Snap to nearest available sample
          const closest = times.reduce((a, b) => Math.abs(b - v) < Math.abs(a - v) ? b : a);
          onChange(closest);
        }}
        className="w-full accent-indigo-500"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>{minuteToLabel(minMin)}</span>
        <span className="text-slate-500 text-xs">← drag to explore traffic over time</span>
        <span>{minuteToLabel(maxMin)}</span>
      </div>
    </div>
  );
}
