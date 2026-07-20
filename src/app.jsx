/* ============================================================
   APP ROOT — state, boot, routing, persistence.
   ============================================================ */
function App() {
  const [booted, setBooted] = useState(false);
  const [page, setPage] = useState("today");
  const [entries, setEntries] = useState({});
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [coverlines, setCoverlines] = useState({});
  const [progress, setProgress] = useState({ lessons: {}, drills: {} });
  const [reviews, setReviews] = useState({});
  const [practice, setPractice] = useState({});
  const [onboarded, setOnboarded] = useState(false);
  const [curDate, setCurDate] = useState(td());
  const [article, setArticle] = useState(null);
  const [lesson, setLesson] = useState(null); // {modId, step}
  const [toast, setToast] = useState(null);
  const undoRef = useRef(null);
  const toastTimer = useRef(null);

  // ── boot: migrate, load, route ──
  useEffect(() => { (async () => {
    await migrate();
    const [en, st, cv, pg, rv, pr, ob] = await Promise.all([
      STO.get(KEYS.entries), STO.get(KEYS.settings), STO.get(KEYS.coverlines),
      STO.get(KEYS.progress), STO.get(KEYS.reviews), STO.get(KEYS.practice), STO.get(KEYS.onboard),
    ]);
    if (en) setEntries(en);
    if (st) setSettings({ ...DEFAULT_SETTINGS, ...st });
    if (cv) setCoverlines(cv);
    if (pg) setProgress({ lessons: {}, drills: {}, ...pg });
    if (rv) setReviews(rv);
    if (pr) setPractice(pr);
    const hasOnboarded = !!ob;
    setOnboarded(hasOnboarded);
    // iOS never sees the landing page; web shows it only to new visitors.
    setPage(hasOnboarded ? "today" : (PLATFORM === "ios" ? "onboard" : "landing"));
    setBooted(true);
  })(); }, []);

  // ── theme ──
  useEffect(() => {
    const t = settings.theme;
    if (t === "night") document.documentElement.dataset.theme = "dark";
    else if (t === "day") document.documentElement.dataset.theme = "light";
    else delete document.documentElement.dataset.theme;
  }, [settings.theme]);

  // ── persistence helpers ──
  const showToast = (msg, undo) => {
    undoRef.current = undo || null;
    setToast({ msg, undo: !!undo });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => { setToast(null); undoRef.current = null; }, 2400);
  };
  const save = (date, patch) => {
    setEntries(prev => {
      const before = prev[date];
      const next = { ...prev, [date]: { ...prev[date], ...patch, date } };
      STO.set(KEYS.entries, next);
      showToast("Saved", () => {
        setEntries(p2 => {
          const restored = { ...p2 };
          if (before) restored[date] = before; else delete restored[date];
          STO.set(KEYS.entries, restored);
          return restored;
        });
      });
      return next;
    });
  };
  const undo = () => { if (undoRef.current) { undoRef.current(); undoRef.current = null; setToast(null); } };
  const saveSettings = patch => setSettings(prev => { const next = { ...prev, ...patch }; STO.set(KEYS.settings, next); return next; });
  const saveCoverline = (cycleStart, temp) => setCoverlines(prev => {
    const next = { ...prev, [cycleStart]: { temp: Math.round(temp * 100) / 100, setAt: td() } };
    STO.set(KEYS.coverlines, next); return next;
  });
  const saveLesson = (modId, patch) => setProgress(prev => {
    const next = { ...prev, lessons: { ...prev.lessons, [modId]: { ...prev.lessons[modId], ...patch } } };
    STO.set(KEYS.progress, next); return next;
  });
  const saveDrill = (drillId, correct) => setProgress(prev => {
    const d = prev.drills[drillId] || { attempts: 0, correct: false };
    const next = { ...prev, drills: { ...prev.drills, [drillId]: { attempts: d.attempts + 1, correct: d.correct || correct } } };
    STO.set(KEYS.progress, next); return next;
  });
  const saveReview = (cycleStart, data) => setReviews(prev => { const next = { ...prev, [cycleStart]: data }; STO.set(KEYS.reviews, next); return next; });
  const togglePractice = (date, id) => setPractice(prev => {
    const day = { ...(prev[date] || {}) }; day[id] = !day[id];
    const next = { ...prev, [date]: day }; STO.set(KEYS.practice, next); return next;
  });
  const completeOnboard = async goal => {
    await STO.set(KEYS.onboard, { goal, at: td() });
    saveSettings({ goal });
    setOnboarded(true);
    setPage("learn");
  };
  const deleteAll = async () => {
    for (const k of Object.values(KEYS)) await STO.remove(k);
    setEntries({}); setSettings(DEFAULT_SETTINGS); setCoverlines({}); setReviews({}); setPractice({});
    setProgress({ lessons: {}, drills: {} }); setOnboarded(false);
    await STO.set(KEYS.schema, 2);
    setPage(PLATFORM === "ios" ? "onboard" : "landing");
    showToast("Everything deleted");
  };

  const cycles = useMemo(() => deriveCycles(entries, td()), [entries]);
  const firstCycle = cycles.length > 0 && cycles.length <= 3 && !settings.dismissedFirstCycle;
  const openLesson = modId => {
    const lp = progress.lessons[modId];
    setLesson({ modId, step: lp && !lp.done ? (lp.step || 0) : 0 });
    setPage("lesson");
  };
  const go = p => { setPage(p); if (p !== "library") setArticle(null); window.scrollTo(0, 0); };

  if (!booted) return null;

  const mod = lesson && WIZARD_MODULES.find(m => m.id === lesson.modId);
  const showTabs = !["landing", "onboard"].includes(page);

  return <div className="app">
    {page === "landing" && <LandingScreen start={() => go("onboard")} openApp={() => go("today")} hasOnboarded={onboarded} />}
    {page === "onboard" && <OnboardScreen complete={completeOnboard} />}
    {page === "today" && <TodayScreen entries={entries} save={save} curDate={curDate} setCurDate={setCurDate}
      cycles={cycles} settings={settings} progress={progress} practice={practice} togglePractice={togglePractice}
      firstCycle={firstCycle} dismissFirstCycle={() => saveSettings({ dismissedFirstCycle: true })}
      openLesson={openLesson} showToast={showToast} />}
    {page === "chart" && <ChartScreen entries={entries} cycles={cycles} coverlines={coverlines}
      saveCoverline={saveCoverline} settings={settings} reviews={reviews} setCurDate={setCurDate} go={go} />}
    {page === "learn" && <LearnScreen progress={progress} settings={settings} openLesson={openLesson} go={go} />}
    {page === "lesson" && mod && <LessonPlayer mod={mod} step={lesson.step}
      setStep={s => setLesson({ ...lesson, step: s })} progress={progress} saveLesson={saveLesson}
      onBack={() => { setLesson(null); go("learn"); }} />}
    {page === "drills" && <DrillsScreen progress={progress} saveDrill={saveDrill} go={go} />}
    {page === "glossary" && <GlossaryScreen openLesson={openLesson} go={go} />}
    {page === "review" && <ReviewScreen entries={entries} cycles={cycles} reviews={reviews}
      saveReview={saveReview} settings={settings} go={go} showToast={showToast} />}
    {page === "library" && <LibraryScreen article={article} setArticle={setArticle} go={go} />}
    {page === "settings" && <SettingsScreen settings={settings} saveSettings={saveSettings} entries={entries}
      coverlines={coverlines} reviews={reviews} practice={practice} progress={progress} cycles={cycles}
      onDeleteAll={deleteAll} showToast={showToast} goLanding={PLATFORM === "web" ? () => go("landing") : null} />}
    {showTabs && <TabBar page={page} go={go} />}
    <Toast toast={toast} onUndo={undo} />
  </div>;
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
