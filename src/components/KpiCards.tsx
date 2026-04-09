'use client';

import { useState, useEffect } from 'react';
import { SpaceScore } from '@/lib/scoring';
import { ZoneTrafficSummary } from '@/data/traffic';
import { RentalSpace } from '@/data/spaces';
import { computeKpiSummary } from './LayoutSelector';

// Arc geometry constants
const R = 46;
const CX = 60;
const CY = 60;
const CIRC = 2 * Math.PI * R;          // ≈ 289.03
const ARC_LEN = CIRC * (270 / 360);    // 270° arc ≈ 216.77

function useCountUp(target: number, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let rafId: number;
    let startTime: number | null = null;
    const duration = 1600;

    const timerId = setTimeout(() => {
      const step = (ts: number) => {
        if (startTime === null) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        setVal(Math.round(eased * target));
        if (progress < 1) rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timerId);
      cancelAnimationFrame(rafId);
    };
  }, [target, delay]);
  return val;
}

function ArcCard({
  id, value, gaugePercent, colorA, colorB, tintBg,
  label, formatValue, delay = 0,
}: {
  id: string;
  value: number;
  gaugePercent?: number;
  colorA: string;
  colorB: string;
  tintBg: string;
  label: string;
  formatValue?: (n: number) => string;
  delay?: number;
}) {
  const [filled, setFilled] = useState(false);
  const displayVal = useCountUp(value, delay + 180);

  useEffect(() => {
    const t = setTimeout(() => setFilled(true), delay + 80);
    return () => clearTimeout(t);
  }, [delay]);

  const arcFill = gaugePercent ?? value;
  const fillLen = filled ? (arcFill / 100) * ARC_LEN : 0.01;
  const gapLen = CIRC - fillLen;

  return (
    <div className="relative flex-1 min-w-0 bg-white rounded-2xl border border-slate-200 shadow-sm">
      {/* Colored tint strip behind the gauge */}
      <div
        className="absolute inset-x-0 top-0 h-36 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${tintBg} 0%, transparent 80%)` }}
      />

      <div className="relative flex flex-col items-center gap-2 p-5">
        {/* SVG arc gauge */}
        <div className="relative" style={{ width: 120, height: 120 }}>
          <svg viewBox="0 0 120 120" width="120" height="120">
            <defs>
              <linearGradient
                id={`lg-${id}`}
                x1={CX - R} y1={CY}
                x2={CX + R} y2={CY}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor={colorA} />
                <stop offset="100%" stopColor={colorB} />
              </linearGradient>

              <filter id={`gf-${id}`} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Track ring */}
            <circle
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${ARC_LEN} ${CIRC - ARC_LEN}`}
              transform={`rotate(-135 ${CX} ${CY})`}
            />

            {/* Value arc */}
            <circle
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke={`url(#lg-${id})`}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${fillLen.toFixed(2)} ${gapLen.toFixed(2)}`}
              transform={`rotate(-135 ${CX} ${CY})`}
              filter={`url(#gf-${id})`}
              style={{
                transition: filled
                  ? 'stroke-dasharray 1.8s cubic-bezier(0.34, 1.2, 0.64, 1)'
                  : 'none',
              }}
            />
          </svg>

          {/* Center value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
            <span
              className="font-black tabular-nums"
              style={{
                fontSize: 22,
                background: `linear-gradient(135deg, ${colorA}, ${colorB})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {formatValue ? formatValue(displayVal) : `${displayVal}%`}
            </span>
          </div>
        </div>

        {/* Label */}
        <span className="text-slate-600 font-semibold text-xs leading-tight text-center">{label}</span>
      </div>
    </div>
  );
}

interface KpiCardsProps {
  scores: SpaceScore[];
  spaces: RentalSpace[];
  zoneSummaries: ZoneTrafficSummary[];
}

export default function KpiCards({ scores, spaces, zoneSummaries }: KpiCardsProps) {
  const { efficiency: layoutEfficiency, risk: bottleneckRisk, avgPrice: avgStandPrice } =
    computeKpiSummary(scores, spaces, zoneSummaries);

  // Gauge position: where avg price sits within the min–max range of this layout
  const suggestedPrices = spaces.map(s => {
    const score = scores.find(sc => sc.spaceId === s.id);
    return score ? Math.round((s.basePrice * score.revenueIndex) / 50) * 50 : s.basePrice;
  });
  const maxStandPrice = Math.max(...suggestedPrices);
  const minStandPrice = Math.min(...suggestedPrices);
  const avgPriceGauge = Math.round(
    ((avgStandPrice - minStandPrice) / (maxStandPrice - minStandPrice)) * 100,
  );

  return (
    <div className="flex gap-3">
      <ArcCard
        id="ler"
        value={layoutEfficiency}
        colorA="#818cf8"
        colorB="#6366f1"
        tintBg="#eef2ff"
        label="Layout Efficiency Rate"
        delay={0}
      />
      <ArcCard
        id="brr"
        value={bottleneckRisk}
        colorA="#fb923c"
        colorB="#ef4444"
        tintBg="#fff7ed"
        label="Bottleneck Risk Rate"
        delay={220}
      />
      <ArcCard
        id="asp"
        value={avgStandPrice}
        gaugePercent={avgPriceGauge}
        colorA="#34d399"
        colorB="#0891b2"
        tintBg="#ecfdf5"
        label="Avg Stand Price"
        formatValue={n =>
          n >= 1000
            ? `€${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
            : `€${n}`
        }
        delay={440}
      />
    </div>
  );
}
