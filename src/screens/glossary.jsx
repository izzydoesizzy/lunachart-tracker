/* ─── GLOSSARY — searchable method vocabulary ─── */
function GlossaryScreen({ openLesson, go }) {
  const [q, setQ] = useState("");
  const list = GLOSSARY.filter(t => !q || (t.term + " " + t.def + " " + t.cat).toLowerCase().includes(q.toLowerCase()));
  return <div className="page">
    <div className="crow" style={{ marginBottom: 4 }}>
      <button className="chip chip-sm" onClick={() => go("learn")}><Ic id="i-back" size={16} />Learn</button>
    </div>
    <h1 className="ltitle serif">Glossary</h1>
    <p className="lsub">Every term, in plain language</p>
    <div style={{ position: "relative", marginTop: 14 }}>
      <Ic id="i-search" size={18} style={{ position: "absolute", left: 13, top: 13, color: "var(--ink3)" }} />
      <input className="pfield" style={{ paddingLeft: 40 }} placeholder="Search terms…" aria-label="Search glossary"
        value={q} onChange={e => setQ(e.target.value)} />
    </div>
    {list.map(t => <div key={t.id} className="term">
      <span className="klabel" style={{ color: "var(--acc)" }}>{t.cat}</span>
      <b style={{ display: "block", marginTop: 3 }}>{t.term}</b>
      <p>{t.def}</p>
      <button className="chip chip-sm" style={{ marginTop: 8 }} onClick={() => openLesson(t.lesson)}>
        <Ic id="i-book" size={14} />Lesson</button>
    </div>)}
    {!list.length && <p style={{ fontSize: 13, color: "var(--ink2)", textAlign: "center", marginTop: 20 }}>No terms match — try "peak" or "BIP".</p>}
  </div>;
}
