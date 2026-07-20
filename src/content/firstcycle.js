// Guided first-cycle mode — phase-aware focus cards for cycles 1–3.
// Companionship, not verdicts: each card teaches what to practice now.
const FC_FOCUS = {
  menses: { title: "Learning your flow vocabulary",
    body: "This week is simple: log your bleeding each day — spotting, light, medium, heavy. Note that Cycle Day 1 is the first day of full flow, not spotting. Temperature can wait until the flow eases if mornings are hectic.",
    lesson: "intro", lessonLabel: "Revisit: the 3-cycle commitment · 2 min" },
  bip: { title: "Learning your Basic Infertile Pattern",
    body: "Consistency is the skill right now. Check at every bathroom visit and record the day's most fertile observation each evening. A run of same-looking days is exactly how a BIP shows itself — and the first day that feels different is worth noting carefully.",
    lesson: "charting", lessonLabel: "Revisit: what is a BIP? · 2 min" },
  watching: { title: "Something changed — watch closely",
    body: "You've logged an observation that differs from the days before it. This is the moment the method trains you for: keep observing every visit, record the most fertile sign of each day, and consider whether this is your Point of Change. Your call to mark — not ours.",
    lesson: "mucus", lessonLabel: "Revisit: sensation categories · 3 min" },
  peakCount: { title: "Your count is running",
    body: "You marked Peak Day, so you're counting: four full days, closing on the fourth evening. Keep taking your temperature — the double-check needs three readings above the coverline you drew. If mucus returns mid-count, the count restarts.",
    lesson: "mucus", lessonLabel: "Revisit: Peak Day · 2 min" },
  luteal: { title: "The quiet phase",
    body: "Temperatures high, mucus gone — the luteal phase is the easiest charting of the cycle. Keep the morning temperature habit; steady high readings are data too. Toward the end, watch for the gentle decline that precedes your period.",
    lesson: "bbt", lessonLabel: "Revisit: what BBT tells you · 2 min" },
};
const FC_CHECKLIST = [
  { id: "temp", label: "Temperature before rising" },
  { id: "checks", label: "Checked sensation at each bathroom visit" },
  { id: "evening", label: "Evening: record the day's most fertile sign" },
];
const REVIEW_QUESTIONS = [
  { id: "poc", q: "Where did you mark your Point of Change — and what changed?" },
  { id: "bip", q: "Did your BIP hold before it?" },
  { id: "check", q: "Did your Peak count and temperature shift agree this cycle?" },
];
