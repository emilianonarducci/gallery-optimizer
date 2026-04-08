'use client';

import { useEffect } from 'react';

// ─── Slide wrapper ───────────────────────────────────────────────────────────
function Slide({ children, bg = 'white', className = '' }: { children: React.ReactNode; bg?: string; className?: string }) {
  return (
    <section
      className={`slide ${className}`}
      style={{ background: bg }}
    >
      {children}
    </section>
  );
}

function Tag({ children, color = '#6366f1' }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ background: color + '18', color, border: `1px solid ${color}44`, borderRadius: 6, padding: '2px 10px', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
      {children}
    </span>
  );
}

function KpiBlock({ label, formula, weight, color, description, example }: {
  label: string; formula: string; weight: string; color: string; description: string; example: string;
}) {
  return (
    <div style={{ borderLeft: `4px solid ${color}`, background: color + '08', borderRadius: '0 12px 12px 0', padding: '16px 20px', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontWeight: 800, fontSize: 15, color: '#1e293b' }}>{label}</span>
        <span style={{ background: color, color: 'white', borderRadius: 20, padding: '2px 12px', fontSize: 11, fontWeight: 700 }}>weight {weight}</span>
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: 12, background: '#f1f5f9', borderRadius: 6, padding: '6px 12px', marginBottom: 8, color: '#334155' }}>
        {formula}
      </div>
      <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>{description}</div>
      <div style={{ fontSize: 11, color: color, fontStyle: 'italic' }}>→ {example}</div>
    </div>
  );
}

function ScoreRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
        <span style={{ color: '#475569' }}>{label}</span>
        <span style={{ fontWeight: 700, color: '#1e293b' }}>{value}/100</span>
      </div>
      <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 4 }} />
      </div>
    </div>
  );
}

// ─── Main deck ───────────────────────────────────────────────────────────────
export default function DeckPage() {
  useEffect(() => {
    document.title = 'Gallery Space Optimizer – KPI Deck';
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Inter', system-ui, sans-serif;
          background: #0f172a;
          color: #1e293b;
        }

        .slide {
          width: 297mm;
          min-height: 210mm;
          margin: 0 auto 12px;
          padding: 48px 56px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 32px rgba(0,0,0,0.3);
        }

        .print-btn {
          position: fixed;
          bottom: 32px;
          right: 32px;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(99,102,241,0.5);
          z-index: 100;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.1s, box-shadow 0.1s;
        }
        .print-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(99,102,241,0.6); }

        .slide-num {
          position: absolute;
          bottom: 20px;
          right: 28px;
          font-size: 11px;
          color: #94a3b8;
          font-weight: 600;
        }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; }

        .card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }

        h1 { font-size: 40px; font-weight: 900; line-height: 1.15; color: white; }
        h2 { font-size: 26px; font-weight: 800; color: #1e293b; margin-bottom: 6px; }
        h3 { font-size: 17px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
        p  { font-size: 13px; color: #64748b; line-height: 1.6; }

        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background: #1e293b; color: white; padding: 10px 14px; text-align: left; font-weight: 700; }
        td { padding: 9px 14px; border-bottom: 1px solid #f1f5f9; color: #334155; }
        tr:nth-child(even) td { background: #f8fafc; }

        @media print {
          @page { size: A4 landscape; margin: 0; }
          body { background: white; }
          .print-btn { display: none !important; }
          .slide {
            margin: 0;
            page-break-after: always;
            break-after: page;
            box-shadow: none;
            width: 100%;
            height: 100vh;
          }
        }
      `}</style>

      {/* ── SLIDE 1: Cover ── */}
      <Slide bg="linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Tag color="#a5b4fc">KPI METHODOLOGY</Tag>
          <div style={{ marginTop: 24, marginBottom: 16 }}>
            <h1>Gallery Space<br />Optimizer</h1>
          </div>
          <p style={{ color: '#a5b4fc', fontSize: 16, maxWidth: 480 }}>
            How we measure, score and price rental spaces in event venues using WiFi counting footfall data.
          </p>
          <div style={{ marginTop: 40, display: 'flex', gap: 32 }}>
            {[
              { label: 'KPIs', value: '4' },
              { label: 'Scoring tiers', value: 'S / A / B / C' },
              { label: 'Data source', value: 'WiFi counting' },
              { label: 'Reference event', value: 'IAB Forum · MICO' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>{item.value}</div>
                <div style={{ fontSize: 11, color: '#818cf8', marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="slide-num" style={{ color: '#4f46e5' }}>01 / 09</div>
        {/* decorative circles */}
        <div style={{ position: 'absolute', right: -60, top: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -80, width: 200, height: 200, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', pointerEvents: 'none' }} />
      </Slide>

      {/* ── SLIDE 2: Data Source ── */}
      <Slide bg="white">
        <Tag color="#0ea5e9">DATA SOURCE</Tag>
        <h2 style={{ marginTop: 12 }}>WiFi Counting — How It Works</h2>
        <p style={{ marginBottom: 24 }}>Access points capture probe requests from mobile devices to estimate the number of unique visitors in each zone, even without explicit network connection.</p>

        <div className="grid-3">
          {[
            {
              icon: '📡', title: 'Probe Requests',
              text: 'Every smartphone with WiFi enabled broadcasts probe requests every 15–30 s. APs capture these to count devices in range.',
              color: '#0ea5e9',
            },
            {
              icon: '🗺️', title: 'Zone Mapping',
              text: 'Each AP covers a defined floor-plan zone. Multiple APs per zone are deduplicated to avoid double-counting the same device.',
              color: '#6366f1',
            },
            {
              icon: '⏱️', title: '15-min Sampling',
              text: 'Counts are aggregated every 15 minutes. This resolution captures intra-day dynamics: registration peak, lunch, breaks, exit flow.',
              color: '#10b981',
            },
          ].map(card => (
            <div className="card" key={card.title} style={{ borderTop: `3px solid ${card.color}` }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{card.icon}</div>
              <h3 style={{ color: card.color }}>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, background: '#f8fafc', borderRadius: 12, padding: '14px 20px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: 40 }}>
            {[
              { label: 'Event reference', value: 'IAB Forum @ MICO Milano' },
              { label: 'Estimated attendees', value: '~1,500' },
              { label: 'Sampling interval', value: '15 minutes' },
              { label: 'Event duration', value: '08:00 – 20:00' },
              { label: 'Zones monitored', value: '6' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="slide-num">02 / 09</div>
      </Slide>

      {/* ── SLIDE 3: The 4 KPIs Overview ── */}
      <Slide bg="#f8fafc">
        <Tag color="#f59e0b">SCORING MODEL</Tag>
        <h2 style={{ marginTop: 12 }}>The 4 KPIs — Overview</h2>
        <p style={{ marginBottom: 24 }}>Each rental space receives a composite 0–100 score built from four independent signals. The weights reflect commercial relevance for exhibitors.</p>

        <div className="grid-2">
          {[
            { kpi: 'Traffic Score', weight: '35%', icon: '👥', color: '#6366f1', desc: 'Average number of unique devices in the zone throughout the event day. Proxy for foot traffic volume and brand exposure.' },
            { kpi: 'Peak Score', weight: '25%', icon: '📈', color: '#f59e0b', desc: 'Maximum device count in any single 15-minute window. Measures the ability to capture attention during high-intensity moments.' },
            { kpi: 'Visibility Score', weight: '25%', icon: '👁️', color: '#10b981', desc: 'Static multiplier based on stand typology: island, corner, premium, standard. Reflects physical exposure regardless of traffic.' },
            { kpi: 'Dwell Time Score', weight: '15%', icon: '⏳', color: '#8b5cf6', desc: 'Estimated average minutes a visitor stays in the zone. Longer dwell = more engagement time per brand contact.' },
          ].map(item => (
            <div className="card" key={item.kpi} style={{ borderLeft: `4px solid ${item.color}`, display: 'flex', gap: 14 }}>
              <div style={{ fontSize: 32 }}>{item.icon}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h3>{item.kpi}</h3>
                  <span style={{ background: item.color, color: 'white', borderRadius: 20, padding: '1px 10px', fontSize: 11, fontWeight: 700 }}>{item.weight}</span>
                </div>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, background: '#1e293b', borderRadius: 10, padding: '12px 20px', color: 'white', fontSize: 13, fontFamily: 'monospace', textAlign: 'center' }}>
          Total Score = (Traffic × 0.35) + (Peak × 0.25) + (Visibility × 0.25) + (Dwell × 0.15)
        </div>
        <div className="slide-num">03 / 09</div>
      </Slide>

      {/* ── SLIDE 4: KPI 1 – Traffic Score ── */}
      <Slide bg="white">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <Tag color="#6366f1">KPI 01</Tag>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>weight 35%</span>
        </div>
        <h2 style={{ marginTop: 8 }}>Traffic Score — Average Footfall</h2>

        <div className="grid-2" style={{ marginTop: 16, flex: 1 }}>
          <div>
            <div style={{ background: '#f1f5f9', borderRadius: 10, padding: 16, marginBottom: 14, fontFamily: 'monospace', fontSize: 12, color: '#334155' }}>
              <div style={{ color: '#94a3b8', marginBottom: 6 }}>// Formula</div>
              Traffic Score = (zone_avg_devices / max_avg_devices) × 100
            </div>
            <p style={{ marginBottom: 12 }}>
              For each zone we compute the mean number of connected devices across all 15-min samples. This is then normalised to 0–100 relative to the highest-traffic zone.
            </p>
            <p><strong>Why the highest weight?</strong> Average traffic is the most reliable predictor of total brand exposure. A stand in a consistently busy zone accumulates impressions throughout the day, not just at peak moments.</p>

            <div style={{ marginTop: 14, border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
              <table>
                <thead><tr><th>Zone</th><th>Avg devices</th><th>Traffic Score</th></tr></thead>
                <tbody>
                  {[
                    ['Central Area', 318, 100],
                    ['North Entrance', 225, 71],
                    ['Food & Break', 210, 66],
                    ['South Exit', 148, 47],
                    ['East / West Wings', 115, 36],
                  ].map(([z, d, s]) => (
                    <tr key={z as string}><td>{z}</td><td>{d}</td><td><strong style={{ color: '#6366f1' }}>{s}</strong></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 style={{ marginBottom: 12 }}>Intraday profile — Central Area</h3>
            {/* Mini bar chart simulation */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 100, marginBottom: 8 }}>
              {[10,20,35,55,80,90,95,85,75,80,70,65,85,100,90,80,75,70,65,80,90,85,70,55,40,30,20,10,5,0].map((v, i) => (
                <div key={i} style={{ flex: 1, height: `${v}%`, background: v > 70 ? '#f59e0b' : '#c7d2fe', borderRadius: '2px 2px 0 0' }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8', marginBottom: 16 }}>
              <span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span>
            </div>

            <div style={{ background: '#eef2ff', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 700, marginBottom: 6 }}>Key observation</div>
              <p>The Central Area maintains elevated traffic from 09:30 to 18:00 with two distinct spikes: morning session arrival (09:45) and post-lunch networking (15:15). This sustained exposure justifies a premium score.</p>
            </div>
          </div>
        </div>
        <div className="slide-num">04 / 09</div>
      </Slide>

      {/* ── SLIDE 5: KPI 2 + 3 ── */}
      <Slide bg="#f8fafc">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, flex: 1 }}>
          {/* Peak Score */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Tag color="#f59e0b">KPI 02</Tag>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>weight 25%</span>
            </div>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>Peak Score</h2>
            <div style={{ background: '#f1f5f9', borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 11, color: '#334155', marginBottom: 12 }}>
              Peak Score = (zone_peak_devices / global_peak) × 100
            </div>
            <p style={{ marginBottom: 10 }}>Captures the maximum simultaneous presence observed in a zone. High peak = opportunity for high-impact activations (product launches, live demos).</p>
            <p style={{ marginBottom: 12 }}><strong>Peak events identified:</strong> registration surge 09:30–10:00 (North Entrance), lunch break 12:30 (Food & Break), networking aperitivo 17:30 (exit zones).</p>

            <div style={{ border: '1px solid #fde68a', background: '#fffbeb', borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#b45309', marginBottom: 4 }}>25% weight rationale</div>
              <p>Peak traffic matters for exhibitors with activation budgets (sampling, live events). A lower weight than average acknowledges that a single peak doesn't replace sustained presence.</p>
            </div>
          </div>

          {/* Visibility Score */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Tag color="#10b981">KPI 03</Tag>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>weight 25%</span>
            </div>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>Position Visibility Score</h2>
            <div style={{ background: '#f1f5f9', borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 11, color: '#334155', marginBottom: 12 }}>
              Visibility Score = BONUS[space.type]  // static lookup
            </div>
            <p style={{ marginBottom: 12 }}>Physical layout determines how many passersby can see the stand, independent of device count. An island in a low-traffic zone still outperforms a wall stand in a busy corridor.</p>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
              <table>
                <thead><tr><th>Stand type</th><th>Visibility bonus</th><th>Reason</th></tr></thead>
                <tbody>
                  {[
                    ['Anchor (island)', 100, '4-side frontage, max exposure'],
                    ['Corner', 80, '270° visibility, natural waypoint'],
                    ['Premium', 70, 'High-traffic placement, single front'],
                    ['Standard', 40, 'Wall/corridor, limited sightlines'],
                  ].map(([t, b, r]) => (
                    <tr key={t as string}>
                      <td><strong>{t}</strong></td>
                      <td><strong style={{ color: '#10b981' }}>{b}</strong></td>
                      <td style={{ fontSize: 11 }}>{r}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="slide-num">05 / 09</div>
      </Slide>

      {/* ── SLIDE 6: KPI 4 – Dwell Time ── */}
      <Slide bg="white">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <Tag color="#8b5cf6">KPI 04</Tag>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>weight 15%</span>
        </div>
        <h2 style={{ marginTop: 8, marginBottom: 16 }}>Dwell Time Score — Quality of Presence</h2>

        <div className="grid-2">
          <div>
            <div style={{ background: '#f1f5f9', borderRadius: 10, padding: 16, fontFamily: 'monospace', fontSize: 12, color: '#334155', marginBottom: 14 }}>
              <div style={{ color: '#94a3b8', marginBottom: 6 }}>// Estimation chain</div>
              passBy = devices × multiplier (1.2–1.8x by type)<br />
              dwellMinutes = (avgDevices / avgPassBy) × 15<br />
              Dwell Score = (dwellMinutes / maxDwellMinutes) × 100
            </div>
            <p style={{ marginBottom: 12 }}>
              Dwell time is inferred from the ratio between <em>connected devices</em> (people who stop) and <em>pass-by estimates</em> (probe requests from moving devices). A high ratio means more visitors are staying, not just walking past.
            </p>
            <p style={{ marginBottom: 12 }}>
              <strong>The 15-minute factor:</strong> since we sample every 15 min, a device present in consecutive windows contributes proportionally to the dwell estimate.
            </p>
            <div style={{ background: '#f5f3ff', borderRadius: 10, padding: 14, border: '1px solid #ddd6fe' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', marginBottom: 4 }}>Why only 15% weight?</div>
              <p>Dwell is the hardest signal to measure accurately from WiFi alone — devices that lock their screen or enable MAC randomisation are invisible. We include it because Food & Break zones have genuinely high engagement, but we discount it to avoid over-penalising high-traffic zones with fast-moving visitors.</p>
            </div>
          </div>
          <div>
            <h3 style={{ marginBottom: 12 }}>Dwell time by zone</h3>
            {[
              { zone: 'Food & Break', dwell: 22, score: 100, color: '#10b981' },
              { zone: 'Central Area', dwell: 14, score: 64, color: '#6366f1' },
              { zone: 'North Entrance', dwell: 10, score: 45, color: '#6366f1' },
              { zone: 'East / West Wings', dwell: 8, score: 36, color: '#3b82f6' },
              { zone: 'South Exit', dwell: 5, score: 23, color: '#8b5cf6' },
            ].map(item => (
              <div key={item.zone} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                  <span style={{ color: '#475569' }}>{item.zone}</span>
                  <span style={{ color: '#94a3b8' }}>{item.dwell} min avg · <strong style={{ color: item.color }}>score {item.score}</strong></span>
                </div>
                <div style={{ height: 10, background: '#e2e8f0', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.score}%`, background: item.color, borderRadius: 5 }} />
                </div>
              </div>
            ))}

            <div style={{ marginTop: 16, background: '#f8fafc', borderRadius: 10, padding: 14, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Food & Break advantage</div>
              <p>Visitors at catering areas are stationary for 10–25 min. Even if the zone is smaller, the captive attention window makes it commercially attractive for sampling and direct conversations.</p>
            </div>
          </div>
        </div>
        <div className="slide-num">06 / 09</div>
      </Slide>

      {/* ── SLIDE 7: Tier System ── */}
      <Slide bg="#0f172a">
        <Tag color="#a5b4fc">TIER SYSTEM</Tag>
        <h2 style={{ marginTop: 12, color: 'white', marginBottom: 6 }}>S / A / B / C — Space Classification</h2>
        <p style={{ color: '#94a3b8', marginBottom: 24 }}>Composite score thresholds map each space to a commercial tier, used to communicate value to prospective renters at a glance.</p>

        <div className="grid-4">
          {[
            { tier: 'S', label: 'Star', range: '≥ 80', color: '#f59e0b', bg: '#451a03', desc: 'Maximum traffic + visibility. Island or premium stands in peak-flow zones. Ideal for brand launches and headline sponsors.', spaces: 'C1, C2, N3' },
            { tier: 'A', label: 'Prime', range: '65 – 79', color: '#10b981', bg: '#052e16', desc: 'Strong sustained traffic with good visibility. Mix of central and entrance positions. Reliable ROI for mid-size campaigns.', spaces: 'C3, F1, F2, N1' },
            { tier: 'B', label: 'Standard', range: '45 – 64', color: '#3b82f6', bg: '#0c1a2e', desc: 'Moderate traffic, limited by position or zone. Suited for niche targeting or cost-sensitive advertisers.', spaces: 'E4, W4, N2, S1–S3' },
            { tier: 'C', label: 'Value', range: '< 45', color: '#94a3b8', bg: '#1e293b', desc: 'Lower footfall zones or wall stands. Budget option for long-event presence or specific audience targeting.', spaces: 'W1–W3, E1–E3, F3' },
          ].map(item => (
            <div key={item.tier} style={{ background: item.bg, borderRadius: 12, padding: 20, border: `1px solid ${item.color}33` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, background: item.color, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: 'white' }}>{item.tier}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: item.color }}>Score {item.range}</div>
                </div>
              </div>
              <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 10 }}>{item.desc}</p>
              <div style={{ fontSize: 11, color: item.color }}>Examples: {item.spaces}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '12px 20px', display: 'flex', gap: 40 }}>
          <div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Threshold rationale</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>S/A boundary at 80 captures top ~20% of spaces (commercial premium threshold). A/B at 65 separates consistently good from average. B/C at 45 identifies underperformers.</div>
          </div>
        </div>
        <div className="slide-num" style={{ color: '#334155' }}>07 / 09</div>
      </Slide>

      {/* ── SLIDE 8: Revenue Index & Impressions ── */}
      <Slide bg="white">
        <Tag color="#ec4899">PRICING MODEL</Tag>
        <h2 style={{ marginTop: 12, marginBottom: 16 }}>Revenue Index & Estimated Impressions</h2>

        <div className="grid-2">
          <div>
            <h3 style={{ color: '#ec4899', marginBottom: 10 }}>Revenue Index</h3>
            <div style={{ background: '#f1f5f9', borderRadius: 10, padding: 14, fontFamily: 'monospace', fontSize: 12, color: '#334155', marginBottom: 12 }}>
              revenueIndex = 0.5 + (totalScore / 100) × 1.5<br />
              suggestedPrice = round(basePrice × revenueIndex / 50) × 50
            </div>
            <p style={{ marginBottom: 10 }}>
              The revenue index scales from <strong>0.5× to 2.0×</strong> the base price. A space scoring 0/100 is priced at 50% of base (floor), while a perfect-score space reaches 2× (ceiling). Base prices are set per stand category.
            </p>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
              <table>
                <thead><tr><th>Tier</th><th>Typical score</th><th>Index range</th><th>Price multiplier</th></tr></thead>
                <tbody>
                  {[
                    ['S', '80–95', '1.7 – 1.92x', '~€4,800 – €6,000'],
                    ['A', '65–79', '1.48 – 1.68x', '~€3,200 – €4,400'],
                    ['B', '45–64', '1.17 – 1.46x', '~€1,800 – €2,800'],
                    ['C', '30–44', '0.95 – 1.16x', '~€1,000 – €1,600'],
                  ].map(([t, s, i, p]) => (
                    <tr key={t as string}><td><strong>{t}</strong></td><td>{s}</td><td>{i}</td><td style={{ color: '#10b981', fontWeight: 700 }}>{p}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 style={{ color: '#f59e0b', marginBottom: 10 }}>Estimated Impressions / Day</h3>
            <div style={{ background: '#f1f5f9', borderRadius: 10, padding: 14, fontFamily: 'monospace', fontSize: 12, color: '#334155', marginBottom: 12 }}>
              impressions = (zone_passBy / max_passBy)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;× 3,500 × (visibilityScore / 100)
            </div>
            <p style={{ marginBottom: 12 }}>
              Impressions estimate the total number of times a visitor is likely to be within visual range of the stand. The <strong>3,500 baseline</strong> represents total unique device appearances across all zones for a 1,500-person event. Visibility score adjusts for how many of those pass-bys result in actual visual contact.
            </p>
            <div style={{ background: '#fffbeb', borderRadius: 10, padding: 14, border: '1px solid #fde68a' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#92400e', marginBottom: 4 }}>Caveat & limitations</div>
              <p>Impressions from WiFi counting are a proxy, not an eyetracking measure. Actual visual attention depends on stand design, signage height, and competitor proximity — factors not modelled here. Use as a comparative index, not an absolute media metric.</p>
            </div>
          </div>
        </div>
        <div className="slide-num">08 / 09</div>
      </Slide>

      {/* ── SLIDE 9: Summary Table ── */}
      <Slide bg="#f8fafc">
        <Tag color="#1e293b">SUMMARY</Tag>
        <h2 style={{ marginTop: 12, marginBottom: 16 }}>All KPIs at a Glance</h2>

        <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
          <table>
            <thead>
              <tr>
                <th>KPI</th>
                <th>Weight</th>
                <th>Input data</th>
                <th>Formula</th>
                <th>Range</th>
                <th>Best zone</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Traffic Score', '35%', 'WiFi devices / 15 min', 'avg_devices / max_avg × 100', '0 – 100', 'Central Area'],
                ['Peak Score', '25%', 'WiFi devices / 15 min', 'peak_devices / global_peak × 100', '0 – 100', 'Central Area'],
                ['Visibility Score', '25%', 'Stand typology', 'Lookup: anchor=100, corner=80…', '40 – 100', 'Any island stand'],
                ['Dwell Time Score', '15%', 'WiFi ratio (devices/passBy)', '(avg/passBy) × 15 → normalised', '0 – 100', 'Food & Break'],
              ].map(row => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={i} style={{ fontFamily: i === 3 ? 'monospace' : 'inherit', fontSize: i === 3 ? 11 : 12 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid-3">
          {[
            {
              title: 'Composite Score',
              color: '#6366f1',
              items: ['Weighted sum of 4 KPIs', 'Range: 0 – 100', 'Higher = more commercial value'],
            },
            {
              title: 'Tier Classification',
              color: '#f59e0b',
              items: ['S ≥ 80 · A ≥ 65 · B ≥ 45 · C < 45', 'Used for client communication', 'Informs pricing tier selection'],
            },
            {
              title: 'Revenue Index',
              color: '#10b981',
              items: ['Range: 0.5× – 2.0× base price', 'Linear scaling on composite score', 'Prices rounded to nearest €50'],
            },
          ].map(card => (
            <div className="card" key={card.title} style={{ borderTop: `3px solid ${card.color}` }}>
              <h3 style={{ color: card.color, marginBottom: 8 }}>{card.title}</h3>
              {card.items.map(item => (
                <div key={item} style={{ fontSize: 12, color: '#475569', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: card.color }}>→</span> {item}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="slide-num">09 / 09</div>
      </Slide>

      {/* Print button */}
      <button className="print-btn" onClick={() => window.print()}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        Export PDF
      </button>
    </>
  );
}
