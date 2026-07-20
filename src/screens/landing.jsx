/* ============================================================
   LANDING — web only. The honest marketing page, reskinned in
   Lunar tokens. iOS builds never route here.
   ============================================================ */
function LandingScreen({ start, openApp, hasOnboarded }) {
  return <div className="land" style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 60 }}>
    <div style={{ paddingTop: 56, paddingBottom: 36, textAlign: "center" }}>
      <Ic id="i-moon" size={56} color="var(--acc)" style={{ margin: "0 auto 18px", display: "block" }} />
      <h1 className="serif" style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-.5px", lineHeight: 1.1 }}>LunaChart</h1>
      <p style={{ fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--ink3)", marginTop: 8 }}>Justisse Method fertility tracker</p>
      <p className="serif" style={{ fontSize: 17, color: "var(--ink2)", lineHeight: 1.6, maxWidth: 340, margin: "20px auto 0" }}>Learn to read your body's fertility signals — the app never reads them for you.</p>
      <button className="btn-a" style={{ marginTop: 24 }} onClick={hasOnboarded ? openApp : start}>{hasOnboarded ? "Open the app" : "Start learning free"}</button>
      <p style={{ fontSize: 12, color: "var(--ink3)", marginTop: 10 }}>No account · No cloud · Your data stays yours</p>
    </div>

    <KLabel style={{ textAlign: "center", marginBottom: 4 }}>What LunaChart does</KLabel>
    {[
      { icon: "i-book", t: "Teaches you the method first", d: "Interactive skill modules, knowledge checks, and chart-reading drills walk you through cervical mucus, BBT, and chart interpretation before you record anything. Most apps hand you a blank form." },
      { icon: "m-full", t: "Records three biomarkers in detail", d: "Cervical mucus with Justisse's three-quality system (sensation + appearance + stretch), BBT with disturbed-temperature flagging, and cervical position." },
      { icon: "i-star", t: "Keeps you in control", d: "You mark your own Peak Day and Point of Change, and you draw your own coverline. No algorithm overrides your observations." },
      { icon: "i-lock", t: "Stores data on your device only", d: "No accounts, no cloud sync, no third-party access. Export or delete everything, any time." },
    ].map((f, i) => <div key={i} className="crd" style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <Ic id={f.icon} size={22} color="var(--acc)" style={{ marginTop: 2 }} />
      <div><h3 style={{ fontSize: 15, fontWeight: 700 }}>{f.t}</h3>
        <p style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.55, marginTop: 3 }}>{f.d}</p></div>
    </div>)}

    <KLabel style={{ textAlign: "center", margin: "28px 0 4px" }}>What LunaChart does not do</KLabel>
    <div className="crd">
      <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7, marginBottom: 12 }}>Transparency matters — especially in health tools. Here's what LunaChart <strong style={{ color: "var(--ink)" }}>doesn't</strong> do:</p>
      {[
        { t: "No fertile/infertile predictions", d: "We never tell you \"you're safe today\" or \"you're fertile today.\" That interpretation is your skill to learn, ideally with a trained practitioner." },
        { t: "No automatic chart interpretation", d: "We don't auto-draw coverlines, auto-detect temperature shifts, or auto-identify Peak Day. You make those calls — that's the point of body literacy." },
        { t: "No practitioner replacement", d: "This app teaches foundations and records observations. It is not a substitute for working with a Justisse HRHP, especially for pregnancy avoidance." },
        { t: "No notifications or nagging", d: "Building the daily habit is part of the learning — guided gently in your first three cycles, never with push notifications." },
      ].map((item, i) => <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < 3 ? "1px solid var(--line)" : "none" }}>
        <span style={{ color: "var(--coral)", fontWeight: 700, flexShrink: 0 }}>✕</span>
        <div><p style={{ fontSize: 13, fontWeight: 700 }}>{item.t}</p>
          <p style={{ fontSize: 12, color: "var(--ink2)", lineHeight: 1.5, marginTop: 2 }}>{item.d}</p></div>
      </div>)}
    </div>

    <KLabel style={{ textAlign: "center", margin: "28px 0 4px" }}>Is LunaChart right for you?</KLabel>
    <div className="crd">
      <p style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ok)" }}>A good fit if you…</p>
      <p style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.7, marginTop: 6 }}>want to learn the Justisse Method properly · value privacy above convenience · prefer understanding over automation · are starting your first charting cycles · want a free, honest teaching tool.</p>
    </div>
    <div className="crd">
      <p style={{ fontSize: 13.5, fontWeight: 700, color: "var(--coral)" }}>You might prefer something else if you…</p>
      <p style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.7, marginTop: 6 }}>
        want a daily fertile/not-fertile verdict — <strong style={{ color: "var(--ink)" }}>Natural Cycles</strong> does that (FDA-cleared) ·
        want the most mature customizable charting app — <strong style={{ color: "var(--ink)" }}>Read Your Body</strong> is it ·
        just want period predictions and community — <strong style={{ color: "var(--ink)" }}>Flo</strong> or <strong style={{ color: "var(--ink)" }}>Clue</strong> are polished.
      </p>
      <p style={{ fontSize: 12.5, color: "var(--ink2)", lineHeight: 1.6, marginTop: 10, fontStyle: "italic" }}>Many charters learn here, then graduate to Read Your Body — and that's a success, not a failure. The full comparison lives in the Library.</p>
    </div>

    <KLabel style={{ textAlign: "center", margin: "28px 0 4px" }}>The method in 60 seconds</KLabel>
    <div className="crd">
      {[
        ["m-new", "Observe", "Check cervical mucus at every bathroom visit; record the day's most fertile sign."],
        ["i-therm", "Measure", "Take your waking temperature before rising, same time daily."],
        ["i-up", "Spot the change", "The first day different from your infertile baseline opens the fertile window."],
        ["m-full", "Find Peak", "The last peak-quality mucus day — identified the day after."],
        ["i-star", "Count 4", "Four days after Peak, cross-checked against your temperature shift."],
        ["i-book", "Learn the skill", "Three cycles of practice, ideally with a practitioner."],
      ].map(([icon, t, d], i) => <div key={i} style={{ display: "flex", gap: 12, padding: "9px 0", alignItems: "flex-start", borderBottom: i < 5 ? "1px solid var(--line)" : "none" }}>
        <Ic id={icon} size={20} color="var(--acc)" style={{ marginTop: 1 }} />
        <div><p style={{ fontSize: 13.5, fontWeight: 700 }}>{t}</p>
          <p style={{ fontSize: 12.5, color: "var(--ink2)", lineHeight: 1.5 }}>{d}</p></div>
      </div>)}
    </div>

    <button className="btn-a" style={{ marginTop: 20 }} onClick={hasOnboarded ? openApp : start}>{hasOnboarded ? "Open the app" : "Start learning free"}</button>

    <p style={{ fontSize: 11.5, color: "var(--ink3)", lineHeight: 1.6, marginTop: 28, textAlign: "center" }}>
      Educational tool — not a medical device or contraceptive. Not FDA-cleared. Not a substitute for professional instruction.
      The Justisse Method is a trademark of Justisse College International; LunaChart is independent and unaffiliated.
      Charting to avoid pregnancy? Work with a trained HRHP — <a href="https://justisse.ca" target="_blank" rel="noopener">justisse.ca</a>.
    </p>
  </div>;
}
