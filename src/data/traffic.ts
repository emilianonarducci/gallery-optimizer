// Dati sintetici WiFi counting – evento tipo IAB Forum @ MICO Milano
// Simulano access point per zona, campionamento ogni 15 minuti

export interface TrafficSample {
  time: string;       // "HH:MM"
  minuteOfDay: number;
  zone: string;
  devices: number;    // unique devices connessi all'AP
  passBy: number;     // stimato dal movimento (probe requests)
}

export interface ZoneTrafficSummary {
  zone: string;
  avgDevices: number;
  peakDevices: number;
  peakTime: string;
  totalPassBy: number;
  dwellMinutes: number; // tempo medio di sosta stimato
}

// Pattern giornata evento (8:00 - 20:00) – IAB Forum
// Flussi realistici: registrazione mattina, sessioni, lunch, pomeriggio, networking
const EVENT_PROFILE = [
  // [ora, minuto, moltiplicatore_ingresso, molt_centrale, molt_food, molt_uscita, molt_wings]
  [8,  0,  0.3, 0.1, 0.0, 0.0, 0.1],
  [8,  15, 0.5, 0.2, 0.0, 0.0, 0.2],
  [8,  30, 0.8, 0.3, 0.0, 0.0, 0.3],
  [8,  45, 1.0, 0.4, 0.1, 0.0, 0.4],
  [9,  0,  1.2, 0.7, 0.2, 0.1, 0.6], // apertura registrazione
  [9,  15, 1.5, 0.9, 0.3, 0.1, 0.7],
  [9,  30, 1.8, 1.1, 0.4, 0.2, 0.8],
  [9,  45, 2.0, 1.3, 0.5, 0.2, 0.9], // picco mattina
  [10, 0,  1.6, 1.4, 0.6, 0.3, 1.0],
  [10, 15, 1.2, 1.5, 0.7, 0.3, 1.1],
  [10, 30, 1.0, 1.6, 0.6, 0.3, 1.0], // sessioni in corso
  [10, 45, 0.9, 1.5, 0.6, 0.2, 0.9],
  [11, 0,  1.1, 1.6, 0.8, 0.3, 1.1], // coffee break
  [11, 15, 1.3, 1.8, 1.0, 0.3, 1.2],
  [11, 30, 1.0, 1.7, 0.8, 0.3, 1.1],
  [11, 45, 0.8, 1.5, 0.6, 0.2, 0.9],
  [12, 0,  0.9, 1.3, 1.8, 0.4, 0.8],
  [12, 15, 1.2, 1.1, 2.5, 0.5, 0.7], // lunch peak
  [12, 30, 1.0, 1.2, 3.0, 0.5, 0.6], // massimo dwell food
  [12, 45, 0.9, 1.3, 2.8, 0.5, 0.7],
  [13, 0,  0.8, 1.2, 2.5, 0.4, 0.8],
  [13, 15, 0.9, 1.3, 2.0, 0.4, 0.9],
  [13, 30, 1.0, 1.4, 1.5, 0.4, 1.0],
  [13, 45, 1.1, 1.5, 1.0, 0.3, 1.1],
  [14, 0,  1.2, 1.6, 0.7, 0.3, 1.2], // ripresa sessioni
  [14, 15, 1.0, 1.7, 0.6, 0.2, 1.1],
  [14, 30, 0.9, 1.7, 0.5, 0.2, 1.0],
  [14, 45, 0.8, 1.6, 0.5, 0.2, 0.9],
  [15, 0,  1.0, 1.5, 1.0, 0.3, 1.0], // coffee break pomeriggio
  [15, 15, 1.3, 1.8, 1.5, 0.4, 1.2],
  [15, 30, 1.1, 1.9, 1.2, 0.4, 1.1],
  [15, 45, 0.9, 1.8, 0.9, 0.3, 1.0],
  [16, 0,  0.8, 1.6, 0.7, 0.3, 0.9],
  [16, 15, 0.7, 1.5, 0.6, 0.3, 0.8],
  [16, 30, 0.8, 1.4, 0.6, 0.4, 0.8],
  [16, 45, 0.9, 1.3, 0.7, 0.5, 0.8],
  [17, 0,  1.2, 1.2, 1.2, 0.8, 0.9], // networking aperitivo
  [17, 15, 1.1, 1.3, 1.5, 1.0, 0.9],
  [17, 30, 0.9, 1.2, 1.8, 1.2, 0.8],
  [17, 45, 0.8, 1.0, 1.6, 1.5, 0.7], // deflusso inizio
  [18, 0,  0.7, 0.8, 1.0, 2.0, 0.6],
  [18, 15, 0.5, 0.6, 0.7, 2.5, 0.5], // picco uscita
  [18, 30, 0.4, 0.4, 0.5, 2.0, 0.4],
  [18, 45, 0.3, 0.3, 0.3, 1.5, 0.3],
  [19, 0,  0.2, 0.2, 0.2, 0.8, 0.2],
  [19, 30, 0.1, 0.1, 0.1, 0.3, 0.1],
  [20, 0,  0.0, 0.0, 0.0, 0.1, 0.0],
];

// Capacità base AP per zona (devices) – calibrata su evento ~1500 persone
const ZONE_BASE_CAPACITY: Record<string, number> = {
  north_entrance: 180,
  west_wing: 120,
  east_wing: 120,
  central: 250,
  food_area: 160,
  south_exit: 140,
};

// Indice colonna per zona in EVENT_PROFILE
const ZONE_COLUMN: Record<string, number> = {
  north_entrance: 2,
  central: 3,
  food_area: 4,
  south_exit: 5,
  west_wing: 6,
  east_wing: 6,
};

function noise(seed: number, amplitude: number): number {
  return (Math.sin(seed * 9301 + 49297) * 0.5 + 0.5) * amplitude * 2 - amplitude;
}

export function generateTrafficData(): TrafficSample[] {
  const samples: TrafficSample[] = [];
  const zones = Object.keys(ZONE_BASE_CAPACITY);

  EVENT_PROFILE.forEach(([h, m, ...multipliers], idx) => {
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const minuteOfDay = h * 60 + m;

    zones.forEach(zone => {
      const colIdx = ZONE_COLUMN[zone] - 2;
      const multiplier = multipliers[colIdx] ?? 0;
      const base = ZONE_BASE_CAPACITY[zone];
      const raw = Math.round(base * multiplier + noise(idx * zones.length + zones.indexOf(zone), base * 0.05));
      const devices = Math.max(0, raw);
      const passBy = Math.round(devices * (zone === 'central' ? 1.8 : zone === 'north_entrance' ? 1.4 : 1.2) + noise(idx + 100, 10));

      samples.push({ time: timeStr, minuteOfDay, zone, devices: Math.max(0, devices), passBy: Math.max(0, passBy) });
    });
  });

  return samples;
}

export function computeZoneSummaries(samples: TrafficSample[]): ZoneTrafficSummary[] {
  const zones = [...new Set(samples.map(s => s.zone))];

  return zones.map(zone => {
    const zs = samples.filter(s => s.zone === zone);
    const devices = zs.map(s => s.devices);
    const peak = Math.max(...devices);
    const peakSample = zs.find(s => s.devices === peak)!;
    const avg = Math.round(devices.reduce((a, b) => a + b, 0) / devices.length);
    const totalPassBy = zs.reduce((a, s) => a + s.passBy, 0);
    // dwell stimato: (devices connessi / passBy) * 15 min
    const avgPassBy = totalPassBy / zs.length;
    const dwell = avgPassBy > 0 ? Math.round((avg / avgPassBy) * 15) : 0;

    return { zone, avgDevices: avg, peakDevices: peak, peakTime: peakSample.time, totalPassBy, dwellMinutes: Math.min(dwell, 30) };
  });
}

export const TRAFFIC_DATA = generateTrafficData();
export const ZONE_SUMMARIES = computeZoneSummaries(TRAFFIC_DATA);
