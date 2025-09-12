const KEY = 'sim_state_v1';

const DEFAULT_STATE = {
  lights: true,
  leds: false,
  curtains: 1,
  tv: false,
  speakers: false,
  ac: { on: false, temp: 22 },
  heat: false,
  robot: false,
  alarm: false,
  cams: false
};

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const o = JSON.parse(raw);
    return { ...structuredClone(DEFAULT_STATE), ...o, ac: { ...DEFAULT_STATE.ac, ...(o.ac||{}) } };
  } catch { return structuredClone(DEFAULT_STATE); }
}

export function saveState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export function resetState() {
  const s = structuredClone(DEFAULT_STATE);
  saveState(s); return s;
}
