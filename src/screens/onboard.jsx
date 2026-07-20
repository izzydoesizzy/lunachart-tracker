/* ─── ONBOARDING — three honest pages ─── */
function OnboardScreen({ complete }) {
  const [i, setI] = useState(0);
  const [goal, setGoal] = useState("literacy");
  return <div className="ob-wrap">
    <div className="ob-clip">
      <div className="ob-pages" style={{ transform: `translateX(-${i * 100}%)` }}>
        <div className="ob-page" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Ic id="i-moon" size={64} color="var(--acc)" style={{ marginBottom: 20 }} />
          <h1 className="serif" style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-.3px", maxWidth: "13ch" }}>Your body keeps a calendar of its own.</h1>
          <p style={{ fontSize: 15, color: "var(--ink2)", marginTop: 14, lineHeight: 1.6 }}>Every cycle, it writes observable signs of fertility. The Justisse Method teaches you to read them — with precision, and without outsourcing the reading to an algorithm.</p>
        </div>
        <div className="ob-page">
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.5px", marginTop: 8 }}>What brings you here?</h1>
          <p style={{ fontSize: 13.5, color: "var(--ink2)", marginTop: 6 }}>This tailors your app — and you can change it anytime in Settings.</p>
          <div role="radiogroup" aria-label="Your goal">
            {GOALS.map(g => <button key={g.id} className={"goal" + (goal === g.id ? " on" : "")} role="radio" aria-checked={goal === g.id}
              onClick={() => setGoal(g.id)}>
              <span className="ic"><Ic id={g.icon} size={20} /></span>
              <span><b>{g.label}</b><small>{g.sub}</small></span>
            </button>)}
          </div>
        </div>
        <div className="ob-page">
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.5px", marginTop: 8 }}>What we'll never do</h1>
          <p style={{ fontSize: 13.5, color: "var(--ink2)", marginTop: 6 }}>These aren't missing features. They're the method.</p>
          <Card><b style={{ fontSize: 14.5, fontWeight: 700 }}>No fertility verdicts</b><p style={{ fontSize: 12.5, color: "var(--ink2)", marginTop: 3 }}>We never say "you're safe today." You learn to make that call.</p></Card>
          <Card><b style={{ fontSize: 14.5, fontWeight: 700 }}>No auto-interpretation</b><p style={{ fontSize: 12.5, color: "var(--ink2)", marginTop: 3 }}>You draw your coverline. You mark Peak Day. We keep the record.</p></Card>
          <Card><b style={{ fontSize: 14.5, fontWeight: 700 }}>No cloud, no account</b><p style={{ fontSize: 12.5, color: "var(--ink2)", marginTop: 3 }}>Your chart lives on this device only — export it whenever you like.</p></Card>
          <Note icon="i-heart"><strong>Learning to avoid pregnancy?</strong> Work with a trained practitioner — find one at justisse.ca. This app teaches foundations.</Note>
        </div>
      </div>
    </div>
    <Dots n={3} i={i} />
    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
      <button className="btn-g" style={{ flex: 1, display: i === 0 ? "none" : undefined }} onClick={() => setI(i - 1)}>Back</button>
      <button className="btn-a" style={{ flex: 2 }} onClick={() => { if (i < 2) setI(i + 1); else complete(goal); }}>
        {i === 2 ? "Begin learning" : "Continue"}</button>
    </div>
  </div>;
}
