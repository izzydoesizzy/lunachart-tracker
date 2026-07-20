/* ============================================================
   TODAY — observations, never verdicts.
   ============================================================ */
function ObservationBanner({ entry, peakCount }) {
  const s = buildSummary(entry || {}, peakCount);
  return <Card hero label="Your observations">
    <KLabel color="var(--acc)">Your observations so far</KLabel>
    <p style={{ fontSize: 15, fontWeight: 600, marginTop: 6 }}>
      {s.obs ? s.obs[0].toUpperCase() + s.obs.slice(1) : "Nothing recorded yet today"}
    </p>
    <p style={{ fontSize: 12.5, color: "var(--ink2)", marginTop: 4 }}>
      {s.marks || "That's what you logged. What it means is your call — you haven't marked anything today."}
    </p>
  </Card>;
}

function MucusSheet({ entry, set, onClose, mucusLessonDone, openLesson }) {
  return <BottomSheet title="Cervical mucus" sub="Record the most fertile observation of your whole day" onClose={onClose}>
    <KLabel style={{ marginTop: 16 }}>Sensation — what you felt</KLabel>
    <div role="group" aria-label="Sensation">
      {SENS.map(o => <MRow key={o.id} icon={o.stamp} iconColor={o.color} title={o.label} sub={o.desc}
        on={entry.mucusSens === o.id} chev={false}
        right={entry.mucusSens === o.id ? <Ic id="i-check" size={18} color="var(--acc)" /> : null}
        onPress={() => set({ mucusSens: entry.mucusSens === o.id ? null : o.id })} />)}
    </div>
    <KLabel style={{ marginTop: 16 }}>Appearance — what you saw</KLabel>
    <ChipGroup options={APPEAR} value={entry.mucusApp} onChange={v => set({ mucusApp: v })} label="Appearance" />
    <KLabel style={{ marginTop: 16 }}>Stretch — finger test</KLabel>
    <ChipGroup options={STRETCH} value={entry.mucusStr} onChange={v => set({ mucusStr: v })} label="Stretch" />
    {!mucusLessonDone && <Note icon="i-book"><strong>New to mucus observation?</strong>{" "}
      <a onClick={openLesson} style={{ cursor: "pointer" }}>The 5-minute lesson</a> shows you exactly what each of these looks and feels like.</Note>}
    <Note icon="i-moon">Check every bathroom visit; chart the day's <strong>most fertile</strong> observation in the evening.</Note>
    <button className="btn-a" style={{ marginTop: 14 }} onClick={onClose}>Done</button>
  </BottomSheet>;
}

function TodayScreen({ entries, save, curDate, setCurDate, cycles, settings, progress, practice, togglePractice,
  firstCycle, dismissFirstCycle, openLesson, showToast }) {
  const e = entries[curDate] || {};
  const [sheet, setSheet] = useState(null);
  const [peakConfirm, setPeakConfirm] = useState(false);
  const cd = getCycleDay(curDate, cycles);
  const cyc = cycleFor(curDate, cycles);
  const peakCount = peakCountFor(curDate, entries, cycles);
  const set = patch => save(curDate, patch);
  const s = lookup(SENS, e.mucusSens), a = lookup(APPEAR, e.mucusApp), st = lookup(STRETCH, e.mucusStr);
  const mucusSum = [s && s.label, a && a.label, st && st.id !== "0" && st.label].filter(Boolean).join(" · ");
  const pr = practice[curDate] || {};
  const fcPhase = firstCycle && (
    (e.bleeding && e.bleeding !== "none") ? "menses"
    : (peakCount >= 1 && peakCount <= 5) ? "peakCount"
    : (peakCount > 5) ? "luteal"
    : (e.mucusSens && e.mucusSens !== "D0") || e.mucusApp && !["N", "CS"].includes(e.mucusApp) ? "watching"
    : "bip");
  const focus = fcPhase && FC_FOCUS[fcPhase];

  return <div className="page">
    <div className="crow">
      <div>
        <h1 className="ltitle">Today</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
          <button className="stepbtn" aria-label="Previous day" onClick={() => setCurDate(addDays(curDate, -1))}><Ic id="i-back" size={16} /></button>
          <p className="lsub" style={{ margin: 0, minWidth: 150, textAlign: "center" }}>{fmtDow(curDate)}</p>
          <button className="stepbtn" aria-label="Next day" disabled={curDate >= td()} onClick={() => setCurDate(addDays(curDate, 1))}><Ic id="i-chev" size={16} /></button>
        </div>
      </div>
      <MoonBadge cd={cd} sub={cyc ? `Cycle ${cyc.number}${firstCycle ? " · learning" : ""}` : "Log flow to start"} />
    </div>

    <ObservationBanner entry={e} peakCount={peakCount} />

    {firstCycle && focus && <Card hero label="First-cycle focus">
      <div className="crow">
        <KLabel color="var(--acc)">First cycle{cyc ? ` · cycle ${cyc.number} of 3` : ""} · focus</KLabel>
        <button className="chip chip-sm" onClick={dismissFirstCycle} aria-label="Hide guided mode">Hide</button>
      </div>
      <h2 className="serif" style={{ fontSize: 19, fontWeight: 700, marginTop: 6, lineHeight: 1.3 }}>{focus.title}</h2>
      <p style={{ fontSize: 13, color: "var(--ink2)", marginTop: 6, lineHeight: 1.5 }}>{focus.body}</p>
      <button className="btn-g" style={{ marginTop: 12, width: "auto", padding: "10px 16px" }} onClick={() => openLesson(focus.lesson)}>{focus.lessonLabel}</button>
    </Card>}

    <ToggleRow icon="i-star" iconBg="var(--coral-soft)" iconColor="var(--coral)" title="Peak Day"
      sub={e.peakDay ? "Marked — day 1 of your 4-day count" : "Last day of peak-quality mucus"}
      on={e.peakDay} onPress={() => { if (e.peakDay) { set({ peakDay: false }); } else setPeakConfirm(true); }} />
    <ToggleRow icon="i-up" iconBg="var(--acc-soft)" iconColor="var(--acc)" title="Point of Change"
      sub="First day different from your BIP" on={e.pointOfChange}
      onPress={() => set({ pointOfChange: !e.pointOfChange })} />

    <Card label="Bleeding">
      <div className="crow"><h2>Bleeding</h2><span className="sum">{(lookup(BLEED, e.bleeding) || BLEED[0]).label}</span></div>
      <ChipGroup options={BLEED} value={e.bleeding || "none"} onChange={v => set({ bleeding: v || "none" })} label="Bleeding" withDots />
    </Card>

    <Card label="Cervical mucus">
      <MRow icon={dayStamp(e).icon} iconColor={dayStamp(e).color} title="Cervical mucus"
        sub={mucusSum ? mucusSum + " — tap to review" : "Tap to record sensation · appearance · stretch"}
        onPress={() => setSheet("mucus")} />
    </Card>

    <Card label="Temperature">
      <div className="crow">
        <h2>Temperature</h2>
        <button className="chip chip-sm" aria-pressed={!!e.bbtDist} onClick={() => set({ bbtDist: !e.bbtDist })}>Disturbed</button>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "center" }}>
        <input className="pfield tabular" inputMode="decimal" placeholder={settings.tempUnit === "F" ? "97.45" : "36.45"}
          aria-label={`Basal body temperature in ${settings.tempUnit === "F" ? "Fahrenheit" : "Celsius"}`}
          value={e.bbt != null && e.bbt !== "" ? (settings.tempUnit === "F" ? cToF(parseFloat(e.bbt)).toFixed(2) : e.bbt) : ""}
          onChange={ev => {
            const raw = ev.target.value;
            if (raw === "") { set({ bbt: "" }); return; }
            const n = parseFloat(raw);
            if (isNaN(n)) return;
            set({ bbt: settings.tempUnit === "F" ? fToC(n).toFixed(2) : raw });
          }} style={{ flex: 1 }} />
        <span style={{ fontSize: 14, color: "var(--ink2)", fontWeight: 600 }}>°{settings.tempUnit}</span>
      </div>
      <p style={{ fontSize: 11.5, color: "var(--ink3)", marginTop: 8 }}>Before rising · same time daily · 3 min hold</p>
      {e.bbtDist && <Note kind="warn" icon="i-therm">Marked disturbed — you're excluding this reading from shift interpretation. Common causes: illness, alcohol, broken sleep, unusual wake time.</Note>}
      {!progress.lessons.bbt?.done && <Note icon="i-book"><strong>Haven't taken BBT before?</strong>{" "}
        <a onClick={() => openLesson("bbt")} style={{ cursor: "pointer" }}>The 4-minute lesson</a> covers exactly how to measure it.</Note>}
    </Card>

    <Card label="Cervix">
      <div className="crow"><h2>Cervix</h2><span className="sum">Optional</span></div>
      <KLabel style={{ marginTop: 12 }}>Height</KLabel>
      <Seg options={CERVPOS} value={e.cxPos} onChange={v => set({ cxPos: v })} label="Cervix height" />
      <KLabel style={{ marginTop: 12 }}>Texture</KLabel>
      <Seg options={CERVTEX} value={e.cxTex} onChange={v => set({ cxTex: v })} label="Cervix texture" />
      <KLabel style={{ marginTop: 12 }}>Opening</KLabel>
      <Seg options={CERVOP} value={e.cxOp} onChange={v => set({ cxOp: v })} label="Cervix opening" />
    </Card>

    <Card label="Notes">
      <h2>Notes</h2>
      <textarea className="pfield" style={{ marginTop: 10 }} aria-label="Notes"
        placeholder="Energy, mood, sleep, stress, medications…" value={e.notes || ""}
        onChange={ev => set({ notes: ev.target.value })} />
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
        <button className="chip" aria-pressed={!!e.flagged} onClick={() => set({ flagged: !e.flagged })}>
          <Ic id="i-flag" size={14} /> Flag for practitioner
        </button>
      </div>
      {e.flagged && <input className="pfield" style={{ marginTop: 8 }} aria-label="Question for your practitioner"
        placeholder="What do you want to ask about this day?" value={e.flagText || ""}
        onChange={ev => set({ flagText: ev.target.value })} />}
    </Card>

    {firstCycle && <Card label="Today's practice">
      <h2>Today's practice</h2>
      <div style={{ marginTop: 6 }} role="group" aria-label="Practice checklist">
        {FC_CHECKLIST.map(c => <button key={c.id} className={"fc-check" + (pr[c.id] ? " on" : "")}
          aria-pressed={!!pr[c.id]} onClick={() => togglePractice(curDate, c.id)}>
          <span className="box"><Ic id="i-check" size={14} /></span><span>{c.label}</span>
        </button>)}
      </div>
    </Card>}
    {firstCycle && <Card label="The 3-cycle commitment">
      <div className="crow"><h2>The 3-cycle commitment</h2><span className="sum tabular">{cyc ? `Day ${cd} · Cycle ${Math.min(cyc.number,3)}` : "Not started"}</span></div>
      <div style={{ display: "flex", gap: 6, marginTop: 12 }} aria-hidden="true">
        {[1, 2, 3].map(n => <div key={n} style={{ flex: 1, height: 8, borderRadius: 4, background: cyc && n <= cyc.number ? "var(--acc)" : "var(--sur2)" }} />)}
      </div>
      <p style={{ fontSize: 12, color: "var(--ink2)", marginTop: 8 }}>Charting practice builds pattern recognition. Most charters feel confident reading their own cycle after three.</p>
    </Card>}

    {sheet === "mucus" && <MucusSheet entry={e} set={set} onClose={() => setSheet(null)}
      mucusLessonDone={!!progress.lessons.mucus?.done} openLesson={() => { setSheet(null); openLesson("mucus"); }} />}

    {peakConfirm && <ConfirmDialog title="Mark today as Peak Day?" onClose={() => setPeakConfirm(false)}
      body={<>
        <p><strong style={{ color: "var(--ink)" }}>Peak Day is the <em>last</em> day of peak-quality mucus</strong> — you usually recognise it the day after, when quality drops. Marking it starts your own 4-day count.</p>
        {e.mucusSens === "D0" && <p style={{ color: "var(--coral)", marginTop: 8 }}>You logged a dry sensation today — still mark Peak?</p>}
      </>}
      actions={<>
        <button className="btn-a btn-coral" onClick={() => { save(curDate, { peakDay: true }); setPeakConfirm(false); }}>Mark Peak Day</button>
        <button className="btn-g btn-quiet" onClick={() => setPeakConfirm(false)}>Not yet</button>
      </>} />}
  </div>;
}
