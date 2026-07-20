/* ============================================================
   LEARN — course hub + lesson player + knowledge checks.
   ============================================================ */
const MODULE_ICONS = { intro: "i-moon", mucus: "m-full", bbt: "i-therm", cervix: "m-half", charting: "i-chart" };

function KnowledgeCheck({ quiz, passed, onPass }) {
  const [pick, setPick] = useState(null);
  const chosen = pick != null ? quiz.options[pick] : null;
  return <Card style={{ borderColor: "var(--acc)" }} label="Check your understanding">
    <KLabel color="var(--acc)">Check your understanding</KLabel>
    <p style={{ fontSize: 14.5, fontWeight: 600, marginTop: 8, lineHeight: 1.45 }}>{quiz.q}</p>
    <div role="group" aria-label="Answers">
      {quiz.options.map((o, i) => <button key={i}
        className={"quiz-opt" + (pick === i ? (o.correct ? " good" : " badpick") : (passed && o.correct ? " good" : ""))}
        onClick={() => { setPick(i); if (o.correct) onPass(); }}>{o.t}</button>)}
    </div>
    {chosen && <Note kind={chosen.correct ? "good" : "warn"} icon={chosen.correct ? "i-check" : "i-up"}>
      <strong>{chosen.correct ? "Exactly. " : "Not quite. "}</strong>{chosen.fb}{!chosen.correct && " Try again."}</Note>}
  </Card>;
}

function LessonPlayer({ mod, step, setStep, progress, saveLesson, onBack }) {
  const s = mod.steps[step];
  const total = mod.steps.length;
  const isLast = step === total - 1;
  const quiz = QUIZZES[mod.id];
  const lp = progress.lessons[mod.id] || {};
  const canComplete = !quiz || lp.quizPassed;
  return <div className="page">
    <div className="crow" style={{ marginBottom: 4 }}>
      <button className="chip chip-sm" onClick={onBack}><Ic id="i-back" size={16} />Learn</button>
      <span className="tabular" style={{ fontSize: 12, fontWeight: 700, color: "var(--ink2)" }}>Step {step + 1} of {total}</span>
    </div>
    <div className="dots" style={{ justifyContent: "flex-start", margin: "8px 0 18px" }} aria-hidden="true">
      {mod.steps.map((_, i) => <i key={i} className={i === step ? "on" : ""} style={i < step ? { opacity: 1, background: "var(--acc)" } : null} />)}
    </div>
    <h1 className="serif" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.25, letterSpacing: "-.2px" }}>{s.h}</h1>
    {s.p.split("\n").map((para, i) => <p key={i} className="serif" style={{ fontSize: 16, lineHeight: 1.7, marginTop: 12, whiteSpace: "pre-wrap" }}>{para}</p>)}
    {s.tip && <Note kind="tip" icon="i-heart"><strong>Practitioner tip.</strong> {s.tip}</Note>}
    {isLast && quiz && <KnowledgeCheck quiz={quiz} passed={!!lp.quizPassed}
      onPass={() => saveLesson(mod.id, { quizPassed: true })} />}
    <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
      {step > 0 && <button className="btn-g" style={{ flex: 1 }} onClick={() => setStep(step - 1)}>Previous</button>}
      <button className="btn-a" style={{ flex: 2, opacity: isLast && !canComplete ? .55 : 1 }}
        onClick={() => {
          if (!isLast) { setStep(step + 1); saveLesson(mod.id, { step: Math.max(lp.step || 0, step + 1) }); }
          else if (canComplete) { saveLesson(mod.id, { done: true }); onBack(); }
        }}>{isLast ? (canComplete ? "Complete module" : "Answer the check to complete") : "Next"}</button>
    </div>
  </div>;
}

function LearnScreen({ progress, settings, openLesson, go }) {
  const done = WIZARD_MODULES.filter(m => progress.lessons[m.id]?.done).length;
  const drillsDone = DRILLS.filter(d => progress.drills[d.id]?.correct).length;
  return <div className="page">
    <h1 className="ltitle serif">Learn the method</h1>
    <p className="lsub">Justisse foundations · your pace, your calls</p>

    <Card hero label="Your learning cycle">
      <div className="crow">
        <div>
          <KLabel color="var(--acc)">Your learning cycle</KLabel>
          <p style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{done} of {WIZARD_MODULES.length} modules complete</p>
          <p style={{ fontSize: 12, color: "var(--ink2)", marginTop: 2 }}>{drillsDone} of {DRILLS.length} drills passed</p>
        </div>
        <div className="moonbadge" style={{ borderColor: "var(--acc)" }}>
          <Ic id={done >= 5 ? "m-full" : done >= 3 ? "m-half" : done >= 1 ? "m-cres" : "m-new"} size={22} />
          <b className="tabular">{Math.round((done / WIZARD_MODULES.length) * 100)}%</b>
        </div>
      </div>
    </Card>

    {WIZARD_MODULES.map(m => {
      const lp = progress.lessons[m.id] || {};
      const frac = lp.done ? 1 : (lp.step || 0) / m.steps.length;
      return <button key={m.id} className="mod" style={frac > 0 && frac < 1 ? { borderColor: "var(--acc)" } : null}
        onClick={() => openLesson(m.id)}>
        <ProgressRing frac={frac} glyph={MODULE_ICONS[m.id]} />
        <span style={{ flex: 1 }}>
          <b style={{ fontSize: 15, fontWeight: 700, display: "block" }}>{m.title}</b>
          <small style={{ display: "block", fontSize: 12, color: "var(--ink2)" }}>
            {m.steps.length} steps · {m.duration}{lp.done ? " · completed" : lp.step ? ` · resume step ${(lp.step || 0) + 1}` : ""}
          </small>
        </span>
        {frac > 0 && frac < 1 ? <span className="chip chip-sm on">Resume</span> : <Ic id="i-chev" size={18} color="var(--ink3)" />}
      </button>;
    })}

    <KLabel style={{ marginTop: 22 }}>Practice</KLabel>
    <button className="mod" style={{ borderColor: "var(--coral)" }} onClick={() => go("drills")}>
      <span className="ic" style={{ width: 46, height: 46, borderRadius: 14, background: "var(--coral-soft)", color: "var(--coral)", display: "flex", alignItems: "center", justifyContent: "center" }}><Ic id="i-star" size={22} /></span>
      <span style={{ flex: 1 }}>
        <b style={{ fontSize: 15, fontWeight: 700, display: "block" }}>Chart-reading drills</b>
        <small style={{ display: "block", fontSize: 12, color: "var(--ink2)" }}>{drillsDone}/{DRILLS.length} · make the call on practice cycles</small>
      </span><Ic id="i-chev" size={18} color="var(--ink3)" />
    </button>
    {settings.showSample && <button className="mod" onClick={() => go("chart")}>
      <span className="ic" style={{ width: 46, height: 46, borderRadius: 14, background: "var(--acc-soft)", color: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center" }}><Ic id="i-chart" size={22} /></span>
      <span style={{ flex: 1 }}>
        <b style={{ fontSize: 15, fontWeight: 700, display: "block" }}>The worked example</b>
        <small style={{ display: "block", fontSize: 12, color: "var(--ink2)" }}>Walk through a narrated textbook cycle</small>
      </span><Ic id="i-chev" size={18} color="var(--ink3)" />
    </button>}
    <button className="mod" onClick={() => go("glossary")}>
      <span className="ic" style={{ width: 46, height: 46, borderRadius: 14, background: "var(--acc-soft)", color: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center" }}><Ic id="i-search" size={22} /></span>
      <span style={{ flex: 1 }}>
        <b style={{ fontSize: 15, fontWeight: 700, display: "block" }}>Glossary</b>
        <small style={{ display: "block", fontSize: 12, color: "var(--ink2)" }}>Every term, in plain language</small>
      </span><Ic id="i-chev" size={18} color="var(--ink3)" />
    </button>
  </div>;
}
