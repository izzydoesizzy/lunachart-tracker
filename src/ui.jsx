/* ============================================================
   UI PRIMITIVES & OVERLAYS
   ============================================================ */
function Ic({ id, size = 20, color, style }) {
  return <svg style={{ width: size, height: size, color, flexShrink: 0, ...style }} aria-hidden="true"><use href={"#" + id} /></svg>;
}
function MoonStamp({ entry, size = 22 }) {
  const s = dayStamp(entry);
  return <Ic id={s.icon} size={size} color={s.color} />;
}
function Card({ children, hero, style, as: Tag = "section", label }) {
  return <Tag className={"card" + (hero ? " hero-card" : "")} style={style} aria-label={label}>{children}</Tag>;
}
function KLabel({ children, color, style }) {
  return <p className="klabel" style={{ color, ...style }}>{children}</p>;
}
function ChipGroup({ options, value, onChange, label, small, withDots }) {
  return <div className="chips" role="group" aria-label={label}>
    {options.map(o => (
      <button key={o.id} className={"chip" + (small ? " chip-sm" : "")} aria-pressed={value === o.id}
        onClick={() => onChange(value === o.id && o.id !== "none" ? null : o.id)} title={o.desc || undefined}>
        {withDots && o.dots > 0 && <i className="dot" style={{ background: "var(--blood)", opacity: .35 + o.dots * .16 }} />}
        {o.label}
      </button>
    ))}
  </div>;
}
function Seg({ options, value, onChange, label, style }) {
  return <div className="seg" role="group" aria-label={label} style={style}>
    {options.map(o => (
      <button key={o.id} aria-pressed={value === o.id} onClick={() => onChange(o.id)}>{o.label}</button>
    ))}
  </div>;
}
function ToggleRow({ icon, iconColor, iconBg, title, sub, on, onPress }) {
  return <button className={"trow" + (on ? " on" : "")} role="switch" aria-checked={!!on} onClick={onPress}>
    <span className="ic" style={{ background: iconBg, color: iconColor }}><Ic id={icon} size={20} /></span>
    <span><b>{title}</b><small>{sub}</small></span>
    <span className="tog" aria-hidden="true" />
  </button>;
}
function MRow({ icon, iconColor, iconBg, title, sub, on, onPress, chev = true, right }) {
  return <button className={"mrow" + (on ? " on" : "")} onClick={onPress} aria-pressed={on === undefined ? undefined : !!on}>
    {icon && <span className="ic" style={{ background: iconBg || "var(--sur2)", color: iconColor }}><Ic id={icon} size={19} /></span>}
    <span style={{ flex: 1 }}><b>{title}</b>{sub && <small>{sub}</small>}</span>
    {right}
    {chev && <Ic id="i-chev" size={18} style={{ color: "var(--ink3)" }} />}
  </button>;
}
function Note({ kind, icon = "i-book", children, style }) {
  return <div className={"note" + (kind ? " " + kind : "")} style={style}><Ic id={icon} size={18} /><p>{children}</p></div>;
}
function MoonBadge({ cd, sub }) {
  return <div className="moonbadge">
    <Ic id={moonPhaseIcon(cd)} size={22} />
    <span><b>{cd ? `Cycle Day ${cd}` : "No cycle yet"}</b>{sub && <small>{sub}</small>}</span>
  </div>;
}
function ProgressRing({ frac = 0, glyph, color = "var(--acc)" }) {
  const C = 2 * Math.PI * 19;
  return <div className="ring" aria-hidden="true">
    <svg className="track" viewBox="0 0 46 46">
      <circle cx="23" cy="23" r="19" fill="none" stroke="var(--sur2)" strokeWidth="4" />
      {frac > 0 && <circle cx="23" cy="23" r="19" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
        strokeDasharray={C} strokeDashoffset={C * (1 - Math.min(1, frac))} />}
    </svg>
    <span className="glyph" style={{ color: frac >= 1 ? "var(--ok)" : "var(--acc)" }}>
      <Ic id={frac >= 1 ? "i-check" : glyph} size={20} />
    </span>
  </div>;
}
function Dots({ n, i }) {
  return <div className="dots" aria-hidden="true">{Array.from({ length: n }, (_, k) => <i key={k} className={k === i ? "on" : ""} />)}</div>;
}

/* overlays */
function BottomSheet({ title, sub, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    if (ref.current) { const f = ref.current.querySelector("button,input,textarea"); if (f) f.focus(); }
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return <>
    <div className="scrim" onClick={onClose} aria-hidden="true" />
    <div className="sheet" role="dialog" aria-modal="true" aria-label={title} ref={ref}>
      <div className="grab" aria-hidden="true" />
      <div className="crow">
        <div><h2 style={{ fontSize: 19, fontWeight: 800 }}>{title}</h2>
          {sub && <p style={{ fontSize: 12, color: "var(--ink2)" }}>{sub}</p>}</div>
        <button className="chip chip-sm" onClick={onClose} aria-label="Close"><Ic id="i-x" size={16} /></button>
      </div>
      {children}
    </div>
  </>;
}
function ConfirmDialog({ title, body, actions, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return <>
    <div className="scrim" onClick={onClose} aria-hidden="true" />
    <div className="dialog-wrap" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="dialog" role="alertdialog" aria-modal="true" aria-label={title}>
        <h2>{title}</h2>
        <div>{body}</div>
        <div className="acts">{actions}</div>
      </div>
    </div>
  </>;
}
function Toast({ toast, onUndo }) {
  if (!toast) return null;
  return <div className="toast" role="status">
    <span>{toast.msg}</span>
    {toast.undo && <button onClick={onUndo}>Undo</button>}
  </div>;
}
function TabBar({ page, go }) {
  const tabs = [
    { id: "today", icon: "i-moon", label: "Today" },
    { id: "chart", icon: "i-chart", label: "Chart" },
    { id: "learn", icon: "i-book", label: "Learn" },
    { id: "library", icon: "i-lib", label: "Library" },
    { id: "settings", icon: "i-gear", label: "Settings" },
  ];
  const groupFor = p => ({ lesson: "learn", drills: "learn", glossary: "learn", review: "chart", article: "library" }[p] || p);
  return <nav className="ptab" aria-label="Main">
    {tabs.map(t => (
      <button key={t.id} aria-current={groupFor(page) === t.id ? "true" : undefined} onClick={() => go(t.id)}>
        <Ic id={t.icon} size={23} />{t.label}
      </button>
    ))}
  </nav>;
}
