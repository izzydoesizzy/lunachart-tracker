/* ============================================================
   FAM CHART — classic paper-chart anatomy, digitized.
   Temperature dots + moon-stamp mucus row + bleeding, aligned
   per column so the double-check is visible. The coverline is
   drawn by the USER (draggable + keyboard); the app never
   computes one.
   ============================================================ */

// Inline path data for export rendering (<use> doesn't survive serialization)
const ICON_PATHS = {
  "m-new":  '<circle cx="12" cy="12" r="8.6" fill="none" stroke="STROKE" stroke-width="2"/>',
  "m-cres": '<circle cx="12" cy="12" r="8.6" fill="none" stroke="STROKE" stroke-width="2"/><path fill="STROKE" d="M12 3.4a8.6 8.6 0 0 1 0 17.2 10.5 10.5 0 0 0 3.4-8.6A10.5 10.5 0 0 0 12 3.4z"/>',
  "m-half": '<circle cx="12" cy="12" r="8.6" fill="none" stroke="STROKE" stroke-width="2"/><path fill="STROKE" d="M12 3.4a8.6 8.6 0 0 1 0 17.2z"/>',
  "m-full": '<circle cx="12" cy="12" r="9.6" fill="STROKE"/>',
  "i-drop": '<path fill="STROKE" d="M12 2.7s6.8 7.3 6.8 12A6.8 6.8 0 0 1 5.2 14.7c0-4.7 6.8-12 6.8-12z"/>',
  "i-star": '<path fill="STROKE" d="m12 2.5 2.8 6.2 6.7.7-5 4.5 1.4 6.6L12 17l-5.9 3.5 1.4-6.6-5-4.5 6.7-.7z"/>',
  "i-up":   '<path fill="none" stroke="STROKE" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M12 20V5m0 0-6 6m6-6 6 6"/>',
};
const EXPORT_COLORS = {
  "var(--acc)":"#5A50C7","var(--coral)":"#D9604F","var(--m-dry)":"#8A8DA8","var(--m-moist)":"#5B93BD",
  "var(--m-wet)":"#2F7EB8","var(--m-peak)":"#188FAB","var(--blood)":"#C74A3C","var(--line)":"#D9DAEA",
  "var(--ink3)":"#767AA3","var(--bg)":"#FFFFFF","var(--sur2)":"#ECEDF8","var(--ink)":"#23244A","var(--ink2)":"#565A85",
};

function buildFamChart(days, opts) {
  const o = Object.assign({ colW: 26, tempH: 170, stampH: 46, labelH: 20, selected: -1, coverline: null, unit: "C", inline: false }, opts);
  const col = c => (o.inline ? (EXPORT_COLORS[c] || c) : c);
  const CW = o.colW, W = Math.max(days.length * CW, 1), H = o.tempH + o.stampH + o.labelH + 14;
  const temps = days.map(d => parseFloat(d.e && d.e.bbt)).filter(v => !isNaN(v));
  let tMin = temps.length ? Math.min(...temps) : 36.1, tMax = temps.length ? Math.max(...temps) : 36.7;
  if (o.coverline != null) { tMin = Math.min(tMin, o.coverline); tMax = Math.max(tMax, o.coverline); }
  tMin -= 0.1; tMax += 0.12;
  const y = v => 10 + (tMax - v) / (tMax - tMin) * (o.tempH - 20);
  const tempAt = py => tMax - (py - 10) / (o.tempH - 20) * (tMax - tMin);
  const showT = v => o.unit === "F" ? cToF(v).toFixed(1) : v.toFixed(2);
  const use = (id, x, yy, size, color) => o.inline
    ? `<g transform="translate(${x},${yy}) scale(${size/24})">${ICON_PATHS[id].replace(/STROKE/g, col(color))}</g>`
    : `<use href="#${id}" x="${x}" y="${yy}" width="${size}" height="${size}" style="color:${color}"/>`;

  let s = "";
  // gridlines every 0.1°C
  const gStart = Math.ceil(tMin * 10) / 10;
  for (let g = gStart; g < tMax; g = Math.round((g + 0.1) * 100) / 100) {
    s += `<line x1="0" y1="${y(g)}" x2="${W}" y2="${y(g)}" stroke="${col("var(--line)")}" stroke-width="1"/>`;
    s += `<text x="2" y="${y(g)-3}" font-size="8" fill="${col("var(--ink3)")}">${showT(g)}</text>`;
  }
  if (o.selected >= 0)
    s += `<rect x="${o.selected*CW}" y="0" width="${CW}" height="${o.tempH + o.stampH}" rx="6" fill="${col("var(--acc)")}" opacity=".14"/>`;
  if (o.coverline != null) {
    s += `<line x1="0" y1="${y(o.coverline)}" x2="${W}" y2="${y(o.coverline)}" stroke="${col("var(--coral)")}" stroke-width="1.6" stroke-dasharray="5,4"/>`;
    s += `<text x="${W-4}" y="${y(o.coverline)-4}" font-size="8.5" font-weight="700" fill="${col("var(--coral)")}" text-anchor="end">your coverline ${showT(o.coverline)}</text>`;
  }
  const pts = days.map((d, i) => { const v = parseFloat(d.e && d.e.bbt); return isNaN(v) ? null : `${i*CW+CW/2},${y(v)}`; }).filter(Boolean);
  if (pts.length > 1) s += `<polyline points="${pts.join(" ")}" fill="none" stroke="${col("var(--acc)")}" stroke-width="1.6" opacity=".55"/>`;
  days.forEach((d, i) => {
    const cx = i*CW + CW/2, e = d.e;
    const v = parseFloat(e && e.bbt);
    if (!isNaN(v)) {
      const cy = y(v);
      if (e.bbtDist) s += `<circle cx="${cx}" cy="${cy}" r="3.6" fill="${col("var(--bg)")}" stroke="${col("var(--ink3)")}" stroke-width="1.6"/>`;
      else s += `<circle cx="${cx}" cy="${cy}" r="3.6" fill="${col(e.peakDay ? "var(--coral)" : "var(--acc)")}"/>`;
      if (e.peakDay) s += use("i-star", cx-5.5, cy-19, 11, "var(--coral)");
    } else if (e && e.peakDay) {
      s += use("i-star", cx-5.5, 2, 11, "var(--coral)");
    }
    const st = dayStamp(e), sy = o.tempH + 8;
    s += use(st.icon, cx-8, sy, 16, st.color);
    if (e && e.pointOfChange) s += use("i-up", cx-5, sy+19, 10, "var(--acc)");
    if (d.cd && d.cd % 2 === 1) s += `<text x="${cx}" y="${o.tempH + o.stampH + o.labelH}" font-size="8" fill="${col("var(--ink3)")}" text-anchor="middle">${d.cd}</text>`;
    s += `<rect data-day="${i}" x="${i*CW}" y="0" width="${CW}" height="${H}" fill="transparent" style="cursor:pointer"/>`;
  });
  const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="sans-serif" ${o.inline ? `xmlns="http://www.w3.org/2000/svg" style="background:#fff"` : ""}>${s}</svg>`;
  return { svg, y, tempAt, W, H, tMin, tMax };
}

function FamChart({ days, coverline, onCoverline, unit, selected, onSelect, ariaLabel }) {
  const scrollRef = useRef(null);
  const [dragTemp, setDragTemp] = useState(null);
  const cover = dragTemp != null ? dragTemp : coverline;
  const chart = useMemo(() => buildFamChart(days, { coverline: cover, unit, selected }), [days, cover, unit, selected]);
  const step = TEMP_STEP.C;
  useEffect(() => { // start scrolled to the most recent days
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [days.length]);

  const clampTemp = t => Math.min(chart.tMax - 0.05, Math.max(chart.tMin + 0.05, Math.round(t / step) * step));
  const startDrag = e => {
    e.preventDefault();
    const handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);
    const startY = e.clientY, startT = cover;
    const pxPerC = (chart.y(36.2) - chart.y(36.3)) * 10; // px per 1 °C
    const move = ev => {
      const dy = ev.clientY - startY;
      setDragTemp(clampTemp(startT - dy / pxPerC));
    };
    const up = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      setDragTemp(t => { if (t != null) onCoverline(t); return null; });
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
  };
  const onKey = e => {
    if (e.key === "ArrowUp") { e.preventDefault(); onCoverline(clampTemp((cover ?? 36.4) + step)); }
    if (e.key === "ArrowDown") { e.preventDefault(); onCoverline(clampTemp((cover ?? 36.4) - step)); }
  };
  const click = e => {
    const r = e.target.closest("[data-day]");
    if (r) onSelect(+r.getAttribute("data-day"));
  };
  return <div style={{ position: "relative" }}>
    <div className="chart-scroll" ref={scrollRef} role="img" aria-label={ariaLabel} onClick={click}
      dangerouslySetInnerHTML={{ __html: chart.svg }} />
    {cover != null && onCoverline
      ? <button className="cover-handle" style={{ top: chart.y(cover) - 22 }} onPointerDown={startDrag} onKeyDown={onKey}
          role="slider" aria-label="Your coverline temperature" aria-valuenow={cover}
          aria-valuemin={chart.tMin} aria-valuemax={chart.tMax} aria-valuetext={fmtTemp(cover, unit)} />
      : onCoverline && <button className="chip chip-sm" style={{ position: "absolute", right: 8, top: 8 }}
          onClick={() => onCoverline(clampTemp((chart.tMin + chart.tMax) / 2))}>+ Draw your coverline</button>}
  </div>;
}

function ChartLegend() {
  return <div className="legend">
    <span><i style={{ background: "var(--acc)" }} />BBT</span>
    <span style={{ color: "var(--coral)" }}>┅ Your coverline</span>
    <span><Ic id="i-star" size={12} color="var(--coral)" />Peak (yours)</span>
    <span><Ic id="i-up" size={12} color="var(--acc)" />Point of Change</span>
    <span><i style={{ border: "2px solid var(--ink3)", background: "transparent" }} />Disturbed</span>
    <span><Ic id="m-full" size={12} color="var(--m-peak)" />Peak-quality mucus</span>
  </div>;
}

function DayDetail({ date, entry, cd, unit, onEdit }) {
  const s = lookup(SENS, entry && entry.mucusSens), a = lookup(APPEAR, entry && entry.mucusApp), st = lookup(STRETCH, entry && entry.mucusStr);
  const b = lookup(BLEED, entry && entry.bleeding);
  const mucus = [s && s.label, a && a.label, st && st.id !== "0" && st.label].filter(Boolean).join(" · ") || "Not recorded";
  const marks = entry && entry.peakDay ? { t: "★ You marked Peak Day", c: "var(--coral)" }
    : entry && entry.pointOfChange ? { t: "⬆ You marked Point of Change", c: "var(--acc)" }
    : entry && entry.bbtDist ? { t: "○ You excluded this temp", c: "var(--acc)" }
    : { t: "No marks — your call stands", c: "var(--ink2)" };
  return <Card label="Selected day">
    <div className="crow">
      <div>
        <KLabel color="var(--acc)">{fmtDow(date)}{cd ? ` · Cycle Day ${cd}` : ""}</KLabel>
        <b style={{ fontSize: 15, fontWeight: 700, color: marks.c }}>{marks.t}</b>
      </div>
      {onEdit && <button className="chip chip-sm" onClick={onEdit}>Edit</button>}
    </div>
    <div className="dd-grid">
      <div><span className="klabel">Mucus</span><b>{mucus}</b></div>
      <div><span className="klabel">Temperature</span><b className="tabular">{entry && entry.bbt ? fmtTemp(entry.bbt, unit) + (entry.bbtDist ? " · excluded" : "") : "—"}</b></div>
      <div><span className="klabel">Bleeding</span><b>{b && b.id !== "none" ? b.label : "None"}</b></div>
      <div><span className="klabel">Note</span><b style={{ fontWeight: 500, fontSize: 12 }}>{(entry && entry.notes) || "—"}</b></div>
    </div>
  </Card>;
}
