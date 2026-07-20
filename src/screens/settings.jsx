/* ============================================================
   SETTINGS — the trust screen: goal, units, theme, sample data,
   export/share, delete. Everything stays on this device.
   ============================================================ */
const GOALS = [
  { id: "literacy", icon: "i-book",  label: "Body literacy",  sub: "Understand my cycle" },
  { id: "avoid",    icon: "i-lock",  label: "Avoid pregnancy", sub: "Learn with a practitioner — framing stays conservative" },
  { id: "achieve",  icon: "i-seed",  label: "Conceive",        sub: "Understand my fertile window" },
  { id: "health",   icon: "i-heart", label: "Cycle health",    sub: "Track my fifth vital sign" },
];
const THEMES = [
  { id: "system", label: "System" }, { id: "night", label: "Night" }, { id: "day", label: "Day" },
];

async function exportChartPNG(days, coverline, unit, title) {
  const { svg } = buildFamChart(days, { inline: true, coverline, unit, colW: 30, tempH: 220, stampH: 54, labelH: 24 });
  const head = `<svg xmlns="http://www.w3.org/2000/svg" width="${days.length*30}" height="330" style="background:#fff">` +
    `<text x="12" y="22" font-family="sans-serif" font-size="14" font-weight="700" fill="#23244A">${title}</text>` +
    `<text x="12" y="38" font-family="sans-serif" font-size="10" fill="#565A85">LunaChart — generated on device · marks and coverline are the charter's own</text>` +
    `<g transform="translate(0,44)">${svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")}</g></svg>`;
  const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(head);
  const img = new Image();
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
  const canvas = document.createElement("canvas");
  canvas.width = img.width * 2; canvas.height = img.height * 2;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(2, 2); ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/png");
}
async function shareChart(days, coverline, unit, title) {
  const dataUrl = await exportChartPNG(days, coverline, unit, title);
  const b64 = dataUrl.split(",")[1];
  if (PLATFORM === "ios" && iosShare("lunachart-cycle.png", "image/png", b64)) return "shared";
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], "lunachart-cycle.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file] }); return "shared"; }
  } catch {}
  const a = document.createElement("a");
  a.href = dataUrl; a.download = "lunachart-cycle.png"; document.body.appendChild(a); a.click(); a.remove();
  return "downloaded";
}

function SettingsScreen({ settings, saveSettings, entries, coverlines, reviews, practice, progress, cycles, onDeleteAll, showToast, goLanding }) {
  const [sheet, setSheet] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const goal = GOALS.find(g => g.id === settings.goal);
  const latest = cycles[cycles.length - 1];

  const backup = () => {
    const data = { app: "LunaChart", schema: 2, build: BUILD, exportedAt: new Date().toISOString(),
      settings, entries, coverlines, reviews, practice, progress };
    const r = downloadText(`lunachart-backup-${td()}.json`, JSON.stringify(data, null, 2), "application/json");
    showToast(r === "shared" ? "Backup ready to share" : "Backup downloaded");
  };
  const share = async () => {
    if (!latest) { showToast("No cycle to share yet"); return; }
    const days = latest.days.map(d => ({ date: d, cd: getCycleDay(d, cycles), e: entries[d] }));
    const r = await shareChart(days, coverlines[latest.start] ? coverlines[latest.start].temp : null,
      settings.tempUnit, `Cycle ${latest.number} · ${fmtD(latest.start)} – ${fmtD(latest.end)}`);
    showToast(r === "shared" ? "Chart ready to share" : "Chart image downloaded");
  };

  return <div className="page">
    <h1 className="ltitle">Settings</h1>
    <p className="lsub">Everything stays on this device</p>

    <KLabel style={{ marginTop: 18 }}>Charting</KLabel>
    <div className="set-group">
      <button className="set-row" onClick={() => setSheet("goal")}>
        <span className="ic" style={{ background: "var(--acc)" }}><Ic id="i-heart" size={17} /></span>
        <b>My goal</b><small>{goal ? goal.label : "Not set"}</small><Ic id="i-chev" size={16} style={{ color: "var(--ink3)" }} />
      </button>
      <button className="set-row" onClick={() => setSheet("units")}>
        <span className="ic" style={{ background: "var(--m-wet)" }}><Ic id="i-therm" size={17} /></span>
        <b>Temperature units</b><small>°{settings.tempUnit}</small><Ic id="i-chev" size={16} style={{ color: "var(--ink3)" }} />
      </button>
      <button className="set-row" onClick={() => setSheet("theme")}>
        <span className="ic" style={{ background: "var(--gold)" }}><Ic id="i-moon" size={17} /></span>
        <b>Appearance</b><small>{THEMES.find(t => t.id === settings.theme).label}</small><Ic id="i-chev" size={16} style={{ color: "var(--ink3)" }} />
      </button>
      <button className="set-row" onClick={() => { saveSettings({ showSample: !settings.showSample }); showToast(settings.showSample ? "Example cycle hidden" : "Example cycle shown"); }}>
        <span className="ic" style={{ background: "var(--m-peak)" }}><Ic id="i-chart" size={17} /></span>
        <b>Example cycle</b><small>{settings.showSample ? "Shown in Learn & Chart" : "Hidden"}</small>
      </button>
    </div>

    <KLabel style={{ marginTop: 18 }}>Your data</KLabel>
    <div className="set-group">
      <button className="set-row" onClick={share}>
        <span className="ic" style={{ background: "var(--coral)" }}><Ic id="i-share" size={17} /></span>
        <b>Share chart with practitioner</b><Ic id="i-chev" size={16} style={{ color: "var(--ink3)" }} />
      </button>
      <button className="set-row" onClick={backup}>
        <span className="ic" style={{ background: "var(--ok)" }}><Ic id="i-lock" size={17} /></span>
        <b>Back up (JSON)</b><small>On-device file</small><Ic id="i-chev" size={16} style={{ color: "var(--ink3)" }} />
      </button>
      <button className="set-row" onClick={() => setConfirmDelete(true)}>
        <span className="ic" style={{ background: "var(--bad)" }}><Ic id="i-flag" size={17} /></span>
        <b style={{ color: "var(--bad)" }}>Delete everything</b><Ic id="i-chev" size={16} style={{ color: "var(--ink3)" }} />
      </button>
    </div>
    <Note icon="i-lock"><strong>Generated on this device.</strong> Nothing is uploaded, ever. Sharing uses your device's share sheet — you choose where it goes.</Note>

    <KLabel style={{ marginTop: 18 }}>About</KLabel>
    <Card>
      <p style={{ fontSize: 12.5, color: "var(--ink2)", lineHeight: 1.55 }}>
        LunaChart is an educational charting notebook for the Justisse Method — not a medical device, contraceptive, or practitioner replacement. It never interprets your chart. Learning for pregnancy avoidance? Work with a trained HRHP — find one at <a href="https://justisse.ca" target="_blank" rel="noopener">justisse.ca</a>. Not affiliated with Justisse College International.
      </p>
      {PLATFORM === "web" && goLanding && <button className="btn-g" style={{ marginTop: 12 }} onClick={goLanding}>About LunaChart & how it compares</button>}
      <p style={{ fontSize: 10.5, color: "var(--ink3)", marginTop: 10 }} className="tabular">Build {BUILD}</p>
    </Card>

    {sheet === "goal" && <BottomSheet title="My goal" sub="Tailors the app's framing — change it anytime" onClose={() => setSheet(null)}>
      <div style={{ marginTop: 8 }}>
        {GOALS.map(g => <button key={g.id} className={"goal" + (settings.goal === g.id ? " on" : "")} aria-pressed={settings.goal === g.id}
          onClick={() => { saveSettings({ goal: g.id }); setSheet(null); showToast("Goal updated"); }}>
          <span className="ic"><Ic id={g.icon} size={20} /></span>
          <span><b>{g.label}</b><small>{g.sub}</small></span>
        </button>)}
      </div>
    </BottomSheet>}
    {sheet === "units" && <BottomSheet title="Temperature units" sub="Readings are stored in °C and converted for display" onClose={() => setSheet(null)}>
      <Seg options={[{ id: "C", label: "Celsius °C" }, { id: "F", label: "Fahrenheit °F" }]} value={settings.tempUnit}
        onChange={u => { saveSettings({ tempUnit: u }); setSheet(null); }} label="Temperature units" />
    </BottomSheet>}
    {sheet === "theme" && <BottomSheet title="Appearance" sub="Night is made for 6 a.m. charting" onClose={() => setSheet(null)}>
      <Seg options={THEMES} value={settings.theme} onChange={t => { saveSettings({ theme: t }); setSheet(null); }} label="Theme" />
    </BottomSheet>}
    {confirmDelete && <ConfirmDialog title="Delete everything?" onClose={() => setConfirmDelete(false)}
      body={<p>This permanently erases all entries, coverlines, reviews, progress, and settings from this device. There is no cloud copy — consider a backup first.</p>}
      actions={<>
        <button className="btn-a btn-coral" onClick={() => { setConfirmDelete(false); onDeleteAll(); }}>Delete it all</button>
        <button className="btn-g btn-quiet" onClick={backup}>Back up first</button>
        <button className="btn-g" onClick={() => setConfirmDelete(false)}>Cancel</button>
      </>} />}
  </div>;
}
