/* ─── CYCLE REVIEW — close the cycle with 5 minutes of reflection ─── */
function ReviewScreen({ entries, cycles, reviews, saveReview, settings, go, showToast }) {
  const target = [...cycles].reverse().find((c, i) => i > 0 && !reviews[c.start]) || (cycles.length >= 2 ? cycles[cycles.length - 2] : null);
  const [answers, setAnswers] = useState({});
  if (!target) return <div className="page">
    <h1 className="ltitle serif">Close the cycle</h1>
    <Card><p style={{ fontSize: 13.5, color: "var(--ink2)" }}>No completed cycle awaits review. Once a new cycle begins, the finished one shows up here for reflection.</p></Card>
    <button className="btn-g" style={{ marginTop: 12 }} onClick={() => go("chart")}>Back to chart</button>
  </div>;
  const days = target.days.map(d => ({ date: d, cd: getCycleDay(d, cycles), e: entries[d] }));
  const flags = target.days.filter(d => entries[d] && entries[d].flagged);
  const existing = reviews[target.start];
  return <div className="page">
    <KLabel color="var(--acc)">Cycle {target.number} complete · {target.days.length} days</KLabel>
    <h1 className="ltitle serif" style={{ fontSize: 28, marginTop: 6 }}>Close the cycle</h1>
    <p className="lsub" style={{ marginTop: 6 }}>Five minutes of reflection before Cycle {target.number + 1}.</p>
    <Card style={{ padding: "14px 10px 10px" }} label="Completed cycle chart">
      <FamChart days={days} coverline={null} unit={settings.tempUnit} selected={-1} onSelect={() => {}}
        ariaLabel={`Completed cycle ${target.number} chart`} />
    </Card>
    {REVIEW_QUESTIONS.map(rq => <div key={rq.id} className="rev-q">
      <b>{rq.q}</b>
      <textarea aria-label={rq.q} value={answers[rq.id] || (existing && existing.answers && existing.answers[rq.id]) || ""}
        onChange={e => setAnswers({ ...answers, [rq.id]: e.target.value })} />
    </div>)}
    <div className="rev-q">
      <b>What do you want to ask your practitioner?</b>
      {flags.length
        ? <Note icon="i-flag" style={{ marginTop: 10 }}><strong>{flags.length} flagged this cycle:</strong>{" "}
            {flags.map(d => `"${entries[d].flagText || "CD " + getCycleDay(d, cycles)}"`).join(" · ")}</Note>
        : <p style={{ fontSize: 12.5, color: "var(--ink2)", marginTop: 8 }}>Nothing flagged this cycle. You can flag any day from its Notes card.</p>}
    </div>
    <button className="btn-a" style={{ marginTop: 14 }} onClick={() => {
      saveReview(target.start, { answers, flagsSnapshot: flags.map(d => ({ date: d, text: entries[d].flagText || "" })), savedAt: td() });
      showToast("Cycle review saved"); go("chart");
    }}>Save review</button>
    <button className="btn-g" style={{ marginTop: 8 }} onClick={() => { saveReview(target.start, { skipped: true, savedAt: td() }); go("chart"); }}>Skip this cycle</button>
  </div>;
}
