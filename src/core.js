/* ============================================================
   CORE — storage, dates, constants, cycles, units, summary.
   Plain JS (no JSX): also runs under Node for tests.
   ============================================================ */

const STO = {
  get: async (k) => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } },
  set: async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} },
  remove: async (k) => { try { if (window.storage.remove) await window.storage.remove(k); else await window.storage.set(k, "null"); } catch {} },
};
const KEYS = {
  entries: "lc-entries", onboard: "lc-onboard", settings: "lc-settings",
  coverlines: "lc-coverlines", progress: "lc-progress", reviews: "lc-reviews",
  practice: "lc-practice", schema: "lc-schema", skills: "lc-skills",
};
const DEFAULT_SETTINGS = { theme: "system", tempUnit: "C", showSample: true, goal: null, dismissedFirstCycle: false };

// ─── dates ───
const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYNAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const td = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const fmtD = (s) => { if (!s) return ""; const [y,m,d] = s.split("-"); return `${MO[+m-1]} ${+d}`; };
const fmtFull = (s) => { if (!s) return ""; const [y,m,d] = s.split("-"); return `${MO[+m-1]} ${+d}, ${y}`; };
const fmtDow = (s) => { if (!s) return ""; const dt = new Date(s+"T12:00:00"); return `${DAYNAMES[dt.getDay()]}, ${MO[dt.getMonth()]} ${dt.getDate()}`; };
const diffD = (a,b) => Math.round((new Date(b+"T12:00:00") - new Date(a+"T12:00:00")) / 864e5);
const addDays = (s,n) => { const d = new Date(s+"T12:00:00"); d.setDate(d.getDate()+n); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };

// ─── biomarker vocabularies (colors are design tokens) ───
const SENS = [
  { id:"D0", label:"Dry",      desc:"No moisture; tissue drags",                              color:"var(--m-dry)",   stamp:"m-new" },
  { id:"M",  label:"Moist",    desc:"Slight dampness on tissue",                              color:"var(--m-moist)", stamp:"m-cres" },
  { id:"W",  label:"Wet",      desc:"Distinct wetness felt",                                  color:"var(--m-wet)",   stamp:"m-half" },
  { id:"SL", label:"Slippery", desc:"Lubricative — tissue glides. Peak-quality sensation",    color:"var(--m-peak)",  stamp:"m-full" },
];
const APPEAR = [
  { id:"N",  label:"Nothing",     desc:"No visible mucus",                          color:"var(--m-dry)" },
  { id:"CS", label:"Cell slough", desc:"Pasty, crumbly, white/yellow",              color:"var(--m-dry)" },
  { id:"TK", label:"Tacky",       desc:"Sticky, breaks when stretched",             color:"var(--m-moist)" },
  { id:"CR", label:"Creamy",      desc:"White, lotion-like consistency",            color:"var(--m-moist)" },
  { id:"CL", label:"Clear",       desc:"Translucent, see-through",                  color:"var(--m-wet)" },
  { id:"EW", label:"Egg-white",   desc:"Clear, stretchy, slippery",                 color:"var(--m-peak)" },
  { id:"WA", label:"Watery",      desc:"Thin, watery, transparent",                 color:"var(--m-wet)" },
];
const STRETCH = [
  { id:"0", label:"None" }, { id:"B", label:"Breaks" }, { id:"1", label:"< 1 cm" },
  { id:"3", label:"1–3 cm" }, { id:"3+", label:"3+ cm" },
];
const CERVPOS = [{id:"L",label:"Low"},{id:"M",label:"Mid"},{id:"H",label:"High"}];
const CERVTEX = [{id:"F",label:"Firm"},{id:"M",label:"Medium"},{id:"S",label:"Soft"}];
const CERVOP  = [{id:"C",label:"Closed"},{id:"P",label:"Partial"},{id:"O",label:"Open"}];
const BLEED = [
  { id:"none",  label:"None",     dots:0 },
  { id:"spot",  label:"Spotting", dots:1 },
  { id:"light", label:"Light",    dots:2 },
  { id:"med",   label:"Medium",   dots:3 },
  { id:"heavy", label:"Heavy",    dots:4 },
];
const lookup = (list, id) => list.find(o => o.id === id) || null;

// Moon-stamp encoding of a day's mucus quality (bleeding wins).
function dayStamp(e) {
  if (!e) return { icon:"m-new", color:"var(--line)", empty:true };
  if (e.bleeding && e.bleeding !== "none") return { icon:"i-drop", color:"var(--blood)", bleed:true };
  if (e.mucusApp === "EW" || e.mucusSens === "SL") return { icon:"m-full", color:"var(--m-peak)" };
  if (e.mucusSens === "W" || ["CL","WA"].includes(e.mucusApp)) return { icon:"m-half", color:"var(--m-wet)" };
  if (e.mucusSens === "M" || ["TK","CR"].includes(e.mucusApp)) return { icon:"m-cres", color:"var(--m-moist)" };
  if (e.mucusSens === "D0" || e.mucusApp) return { icon:"m-new", color:"var(--m-dry)" };
  return { icon:"m-new", color:"var(--line)", empty:true };
}

// ─── cycles ───
// A bleeding run = consecutive bleeding days (calendar gaps of ≤2 days bridge a run).
// Cycle Day 1 = the first FULL-FLOW day (light/med/heavy) of a run — spotting
// before full flow does not start a cycle (Justisse rule).
function deriveCycles(entries, todayISO) {
  const dates = Object.keys(entries).sort();
  if (!dates.length) return [];
  const isBleed = d => { const b = entries[d] && entries[d].bleeding; return b && b !== "none"; };
  const isFlow  = d => { const b = entries[d] && entries[d].bleeding; return ["light","med","heavy"].includes(b); };
  // group bleeding days into runs
  const runs = [];
  let run = null;
  for (const d of dates) {
    if (!isBleed(d)) continue;
    if (run && diffD(run[run.length-1], d) <= 2) run.push(d);
    else { run = [d]; runs.push(run); }
  }
  // a run starts a cycle at its first full-flow day
  const starts = [];
  for (const r of runs) {
    const s = r.find(isFlow);
    if (s) starts.push(s);
  }
  const last = todayISO && todayISO > dates[dates.length-1] ? todayISO : dates[dates.length-1];
  return starts.map((s, i) => {
    const end = i < starts.length-1 ? addDays(starts[i+1], -1) : last;
    const days = [];
    for (let d = s; d <= end && days.length < 90; d = addDays(d, 1)) days.push(d);
    return { start: s, end, days, number: i+1 };
  });
}
function cycleFor(dateISO, cycles) {
  return cycles.find(c => dateISO >= c.start && dateISO <= c.end) || null;
}
function getCycleDay(dateISO, cycles) {
  const c = cycleFor(dateISO, cycles);
  return c ? diffD(c.start, dateISO) + 1 : null;
}
// Moon-phase glyph for a cycle day (a full "moon month" mapped over ~29 days)
function moonPhaseIcon(cd) {
  if (!cd) return "i-moon";
  const f = ((cd-1) % 29) / 29;
  if (f < .125) return "m-new"; if (f < .375) return "m-cres";
  if (f < .5) return "m-half"; if (f < .75) return "m-gib";
  if (f < .875) return "m-full"; return "m-half";
}

// ─── units ───
const cToF = (c) => c * 9/5 + 32;
const fToC = (f) => (f - 32) * 5/9;
function fmtTemp(v, unit) {
  const n = parseFloat(v);
  if (isNaN(n)) return "—";
  return unit === "F" ? `${cToF(n).toFixed(2)} °F` : `${n.toFixed(2)} °C`;
}
const TEMP_STEP = { C: 0.05, F: 0.1 };

// ─── observation summary (P-1 fix: mirrors, never interprets) ───
function buildSummary(e, peakCount) {
  const parts = [];
  const s = lookup(SENS, e && e.mucusSens), a = lookup(APPEAR, e && e.mucusApp), st = lookup(STRETCH, e && e.mucusStr);
  if (s) parts.push(`${s.label.toLowerCase()} sensation`);
  if (a) parts.push(a.label.toLowerCase());
  if (st && st.id !== "0") parts.push(`${st.label} stretch`);
  const b = lookup(BLEED, e && e.bleeding);
  if (b && b.id !== "none") parts.unshift(`${b.label.toLowerCase()} bleeding`);
  if (e && e.bbt) parts.push("temperature");
  const obs = parts.length ? parts.join(" · ") : null;
  let marks = null;
  if (e && e.peakDay) marks = "You marked Peak Day — day 1 of your 4-day count.";
  else if (e && e.pointOfChange) marks = "You marked your Point of Change — the day you saw something different from your BIP.";
  else if (peakCount >= 2 && peakCount <= 4) marks = `Day ${peakCount} of the 4-day count you started at Peak.`;
  else if (peakCount === 5) marks = "Your 4-day count completed yesterday evening. Your chart, your call.";
  return { obs, marks };
}
// Days since the user's own Peak mark in this cycle (1 = Peak day itself)
function peakCountFor(dateISO, entries, cycles) {
  const c = cycleFor(dateISO, cycles);
  if (!c) return null;
  let peak = null;
  for (const d of c.days) { if (d > dateISO) break; if (entries[d] && entries[d].peakDay) peak = d; }
  if (!peak) return null;
  return diffD(peak, dateISO) + 1;
}

// ─── migration v1 → v2 ───
const normEntry = (o) => { const c = {}; Object.keys(o||{}).sort().forEach(k => { if (o[k] !== undefined && o[k] !== "" && o[k] !== false) c[k] = o[k]; }); return JSON.stringify(c); };
async function migrate() {
  const schema = await STO.get(KEYS.schema);
  if (schema >= 2) return;
  const entries = (await STO.get(KEYS.entries)) || {};
  // Remove untouched copies of the old pre-seeded sample cycle; the sample
  // now lives as a worked example only, never mixed into user data.
  let removed = 0;
  for (const d of Object.keys(SAMPLE_CYCLE)) {
    if (entries[d] && normEntry(entries[d]) === normEntry(SAMPLE_CYCLE[d])) { delete entries[d]; removed++; }
  }
  const onboard = await STO.get(KEYS.onboard);
  const settings = { ...DEFAULT_SETTINGS, goal: (onboard && onboard.goal) || null };
  // Grandfather completed skill modules into the new progress model.
  const skills = (await STO.get(KEYS.skills)) || [];
  const progress = { lessons: {}, drills: {} };
  for (const id of skills) progress.lessons[id] = { step: 0, done: true, quizPassed: true };
  await STO.set(KEYS.entries, entries);
  await STO.set(KEYS.settings, settings);
  await STO.set(KEYS.progress, progress);
  await STO.set(KEYS.schema, 2);
  return { removedSampleDays: removed };
}

// ─── export helpers ───
function iosShare(filename, mime, base64) {
  try {
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.share) {
      window.webkit.messageHandlers.share.postMessage({ filename, mime, base64 });
      return true;
    }
  } catch {}
  return false;
}
function downloadText(filename, text, mime) {
  const b64 = btoa(unescape(encodeURIComponent(text)));
  if (PLATFORM === "ios" && iosShare(filename, mime, b64)) return "shared";
  try {
    const url = URL.createObjectURL(new Blob([text], { type: mime }));
    const a = document.createElement("a");
    a.href = url; a.download = filename; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 500);
    return "downloaded";
  } catch { return null; }
}
