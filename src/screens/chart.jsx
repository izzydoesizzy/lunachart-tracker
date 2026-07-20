/* ============================================================
   CHART SCREEN — per-cycle pages + the worked example.
   ============================================================ */
function ChartScreen({ entries, cycles, coverlines, saveCoverline, settings, reviews, setCurDate, go }) {
  const sampleCycles = useMemo(() => deriveCycles(SAMPLE_CYCLE, "2026-03-21"), []);
  const options = [];
  cycles.slice(-3).forEach(c => options.push({ id: c.start, label: `Cycle ${c.number}` }));
  if (settings.showSample) options.push({ id: "example", label: "Example" });
  const [selKey, setSelKey] = useState(null);
  const key = selKey && options.some(o => o.id === selKey) ? selKey
    : (options.length ? options[options.length - (settings.showSample && cycles.length ? 2 : 1)] ?.id ?? options[options.length-1].id : null);
  const isExample = key === "example";
  const cyc = isExample ? sampleCycles[0] : cycles.find(c => c.start === key);
  const data = isExample ? SAMPLE_CYCLE : entries;
  const allCycles = isExample ? sampleCycles : cycles;
  const [selIdx, setSelIdx] = useState(-1);
  const days = cyc ? cyc.days.map(d => ({ date: d, cd: getCycleDay(d, allCycles), e: data[d] })) : [];
  const cover = isExample ? SAMPLE_COVERLINE : (cyc && coverlines[cyc.start] ? coverlines[cyc.start].temp : null);
  const selDay = selIdx >= 0 && days[selIdx] ? days[selIdx] : null;
  // review prompt for the most recent completed, unreviewed cycle
  const completed = cycles.length >= 2 ? cycles[cycles.length - 2] : null;
  const needsReview = completed && !reviews[completed.start];

  return <div className="page">
    <h1 className="ltitle">Chart</h1>
    <p className="lsub">{cyc ? `${isExample ? "Worked example · " : `Cycle ${cyc.number} · `}${fmtD(cyc.start)} – ${fmtD(cyc.end)}` : "Your cycles will appear here"}</p>

    {options.length > 1 && <Seg options={options} value={key} onChange={k => { setSelKey(k); setSelIdx(-1); }} label="Cycle" style={{ maxWidth: 340 }} />}

    {!cyc && <Card style={{ textAlign: "center", padding: 36 }}>
      <Ic id="i-moon" size={40} color="var(--acc)" />
      <p style={{ fontSize: 15, fontWeight: 600, marginTop: 10 }}>No cycles charted yet</p>
      <p style={{ fontSize: 13, color: "var(--ink2)", marginTop: 6 }}>Your first cycle begins the first day you log full menstrual flow on the Today tab.</p>
    </Card>}

    {cyc && <>
      <Card style={{ padding: "14px 10px 10px" }} label="Cycle chart">
        <FamChart days={days} coverline={cover} unit={settings.tempUnit} selected={selIdx}
          onSelect={i => setSelIdx(i === selIdx ? -1 : i)}
          onCoverline={isExample ? null : (t => saveCoverline(cyc.start, t))}
          ariaLabel={`Cycle chart: temperatures, mucus stamps and bleeding per day. ${cover != null ? `Your coverline is at ${fmtTemp(cover, settings.tempUnit)}.` : "No coverline drawn yet."} Tap a day column for details.`} />
      </Card>
      {isExample
        ? <Note icon="i-book"><strong>A textbook cycle, narrated.</strong> Tap through the days — the notes tell the story from Point of Change to Peak to the temperature shift. The coverline here is part of the worked example.</Note>
        : <Note icon="i-up"><strong>Your coverline.</strong> Drag the handle 0.05 °C above the highest of the 6 temps before your shift (arrow keys work too). The app keeps your line — it never draws its own.</Note>}
      {selDay && <DayDetail date={selDay.date} entry={selDay.e} cd={selDay.cd} unit={settings.tempUnit}
        onEdit={isExample ? null : () => { setCurDate(selDay.date); go("today"); }} />}

      {needsReview && !isExample && <Card hero label="Cycle review">
        <KLabel color="var(--acc)">Cycle {completed.number} complete</KLabel>
        <p style={{ fontSize: 14.5, fontWeight: 600, marginTop: 6 }}>Five minutes of reflection before you move on?</p>
        <p style={{ fontSize: 12.5, color: "var(--ink2)", marginTop: 4 }}>Where was your Point of Change? Did your BIP hold? Your answers become your cycle history.</p>
        <button className="btn-a" style={{ marginTop: 12 }} onClick={() => go("review")}>Close the cycle</button>
      </Card>}

      <Card label="Reading this chart"><h2>Reading this chart</h2><ChartLegend /></Card>
    </>}
  </div>;
}
