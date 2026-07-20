/* ─── LIBRARY — the article reader, serif voice, tappable citations ─── */
function ArticleBody({ body, sources }) {
  const [openCite, setOpenCite] = useState(null);
  const render = (para, pi) => {
    const parts = [];
    let rest = para, k = 0;
    const rx = /\[(\d+)\]|\*\*(.+?)\*\*/;
    while (rest) {
      const m = rest.match(rx);
      if (!m) { parts.push(rest); break; }
      if (m.index > 0) parts.push(rest.slice(0, m.index));
      if (m[1]) {
        const n = +m[1];
        parts.push(<sup key={pi + "-" + k++} role="button" tabIndex={0} aria-label={`Source ${n}`}
          onClick={() => setOpenCite(openCite === pi + "-" + n ? null : pi + "-" + n)}
          onKeyDown={e => e.key === "Enter" && setOpenCite(openCite === pi + "-" + n ? null : pi + "-" + n)}>[{n}]</sup>);
      } else parts.push(<strong key={pi + "-" + k++}>{m[2]}</strong>);
      rest = rest.slice(m.index + m[0].length);
    }
    return parts;
  };
  return <div className="body">
    {body.split("\n\n").map((para, pi) => {
      const cites = [...para.matchAll(/\[(\d+)\]/g)].map(m => +m[1]);
      const openN = cites.find(n => openCite === pi + "-" + n);
      const src = openN && sources.find(s => s.n === openN);
      return <React.Fragment key={pi}>
        <p>{render(para, pi)}</p>
        {src && <div className="cite"><p><strong style={{ color: "var(--ink)" }}>[{src.n}]</strong> {src.t}{" "}
          <a href={src.u} target="_blank" rel="noopener">Open source</a></p></div>}
      </React.Fragment>;
    })}
  </div>;
}
function LibraryScreen({ article, setArticle, go }) {
  const [fil, setFil] = useState("All");
  if (article) {
    return <div className="page art">
      <div className="crow" style={{ marginBottom: 14 }}>
        <button className="chip chip-sm" onClick={() => setArticle(null)}><Ic id="i-back" size={16} />Library</button>
        <span className="chip chip-sm" style={{ pointerEvents: "none" }}>{article.cat} · {article.time}</span>
      </div>
      <h1>{article.title}</h1>
      <p style={{ fontSize: 12.5, color: "var(--ink2)", marginTop: 10, fontFamily: "var(--sans)" }}>For: {article.for}</p>
      <ArticleBody body={article.body} sources={article.sources} />
      <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
        <KLabel>Sources & references</KLabel>
        <div className="srclist">
          {article.sources.map(s => <a key={s.n} href={s.u} target="_blank" rel="noopener">[{s.n}] {s.t}</a>)}
        </div>
      </div>
    </div>;
  }
  const cats = ["All", ...new Set(ARTICLES.map(a => a.cat))];
  const list = fil === "All" ? ARTICLES : ARTICLES.filter(a => a.cat === fil);
  return <div className="page">
    <h1 className="ltitle serif">The Library</h1>
    <p className="lsub">Evidence-based articles with cited sources</p>
    <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "14px 0 6px", WebkitOverflowScrolling: "touch" }}>
      {cats.map(c => <button key={c} className="chip chip-sm" aria-pressed={fil === c} style={{ whiteSpace: "nowrap", flexShrink: 0 }}
        onClick={() => setFil(c)}>{c}</button>)}
    </div>
    {list.map(a => <button key={a.id} className="card" style={{ display: "block", width: "100%", textAlign: "left", cursor: "pointer" }} onClick={() => setArticle(a)}>
      <KLabel color="var(--acc)">{a.cat}</KLabel>
      <h2 className="serif" style={{ fontSize: 16.5, fontWeight: 700, marginTop: 5, lineHeight: 1.3 }}>{a.title}</h2>
      <p style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.5, marginTop: 5 }}>{a.excerpt}</p>
      <p style={{ fontSize: 11, color: "var(--ink3)", marginTop: 6 }}>{a.time} · {a.for}</p>
    </button>)}
  </div>;
}
