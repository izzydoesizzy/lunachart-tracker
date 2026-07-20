/* ============================================================
   DRILLS — make the call on practice cycles. Wrong is free here.
   The app checks answers against taught rules on PRACTICE charts
   only; it never interprets the user's real chart.
   ============================================================ */
const DRILL_STAMPS = { D: ["m-new","var(--m-dry)"], MO: ["m-cres","var(--m-moist)"], W: ["m-half","var(--m-wet)"], P: ["m-full","var(--m-peak)"], B: ["i-drop","var(--blood)"] };

function DrillPlayer({ drill, result, onAnswer, onBack, index, total }) {
  const [pick, setPick] = useState(null);
  const picked = pick != null ? drill.days[pick] : null;
  return <>
    <div className="crow" style={{ marginBottom: 4 }}>
      <button className="chip chip-sm" onClick={onBack}><Ic id="i-back" size={16} />Drills</button>
      <span className="tabular" style={{ fontSize: 12, fontWeight: 700, color: "var(--ink2)" }}>Drill {index + 1} of {total}</span>
    </div>
    <h1 className="serif" style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-.2px", marginTop: 10 }}>{drill.title}</h1>
    <p style={{ fontSize: 13.5, color: "var(--ink2)", marginTop: 6, lineHeight: 1.5 }}>{drill.prompt}</p>
    <Card style={{ padding: "14px 10px" }} label="Practice cycle">
      <KLabel style={{ paddingLeft: 4 }}>{drill.sub}</KLabel>
      <div className="chart-scroll" style={{ margin: "0 -10px", padding: "0 10px" }}>
        <div style={{ display: "flex", gap: 2, marginTop: 10 }} role="group" aria-label="Practice cycle days">
          {drill.days.map((d, i) => {
            const [icon, color] = DRILL_STAMPS[d.stamp];
            return <button key={i} className={"drill-day" + (pick === i ? (d.key === "right" ? " good" : " badpick") : "")}
              onClick={() => { setPick(i); onAnswer(drill, d.key === "right"); }}
              aria-label={`Cycle day ${d.cd}: ${d.cap.replace("\n", ", ")}`}>
              <b>{d.cd}</b>
              <Ic id={icon} size={22} color={color} />
              <span>{d.cap.split("\n").map((l, k) => <React.Fragment key={k}>{l}<br /></React.Fragment>)}</span>
            </button>;
          })}
        </div>
      </div>
    </Card>
    {picked && <Note kind={picked.key === "right" ? "good" : "warn"} icon={picked.key === "right" ? "i-check" : "i-up"}>
      {drill.feedback[picked.key]}</Note>}
    {picked && picked.key === "right" && <button className="btn-a" style={{ marginTop: 14 }} onClick={onBack}>
      {result && result.correct ? "Back to drills" : "Nice — back to drills"}</button>}
  </>;
}

function DrillsScreen({ progress, saveDrill, go }) {
  const [openId, setOpenId] = useState(null);
  const drill = DRILLS.find(d => d.id === openId);
  const doneCount = DRILLS.filter(d => progress.drills[d.id]?.correct).length;
  return <div className="page">
    {drill
      ? <DrillPlayer drill={drill} result={progress.drills[drill.id]} index={DRILLS.indexOf(drill)} total={DRILLS.length}
          onAnswer={(d, correct) => saveDrill(d.id, correct)} onBack={() => setOpenId(null)} />
      : <>
        <div className="crow" style={{ marginBottom: 4 }}>
          <button className="chip chip-sm" onClick={() => go("learn")}><Ic id="i-back" size={16} />Learn</button>
        </div>
        <h1 className="ltitle serif">Chart-reading drills</h1>
        <p className="lsub">Practice cycles where being wrong is free</p>
        <Card label="Progress">
          <div className="crow"><h2>Drill progress</h2><span className="sum tabular">{doneCount} / {DRILLS.length} passed</span></div>
          <div style={{ display: "flex", gap: 5, marginTop: 10 }} aria-hidden="true">
            {DRILLS.map(d => <div key={d.id} style={{ flex: 1, height: 6, borderRadius: 3, background: progress.drills[d.id]?.correct ? "var(--ok)" : "var(--sur2)" }} />)}
          </div>
        </Card>
        {DRILLS.map((d, i) => {
          const st = progress.drills[d.id];
          return <button key={d.id} className="mod" onClick={() => setOpenId(d.id)}>
            <span className="ic" style={{ width: 46, height: 46, borderRadius: 14, background: st?.correct ? "var(--ok-soft)" : "var(--coral-soft)", color: st?.correct ? "var(--ok)" : "var(--coral)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic id={st?.correct ? "i-check" : "i-star"} size={20} /></span>
            <span style={{ flex: 1 }}>
              <b style={{ fontSize: 15, fontWeight: 700, display: "block" }}>{i + 1}. {d.title}</b>
              <small style={{ display: "block", fontSize: 12, color: "var(--ink2)" }}>{d.sub}{st ? ` · ${st.attempts} attempt${st.attempts > 1 ? "s" : ""}` : ""}</small>
            </span><Ic id="i-chev" size={18} color="var(--ink3)" />
          </button>;
        })}
        <Note icon="i-lock">These are practice charts. On your own chart the calls stay yours — the app never checks or corrects them.</Note>
      </>}
  </div>;
}
