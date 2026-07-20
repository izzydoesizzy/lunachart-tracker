// Knowledge checks — one per lesson module. Retryable, never a wall.
// The app checks answers against the rules it teaches; it still never
// interprets the user's own chart.
const QUIZZES = {
  intro: {
    q: "It's a peak-fertility day. What does LunaChart tell you?",
    options: [
      { t: "\"You're fertile today — be careful\"", correct: false,
        fb: "Not this app. LunaChart never issues fertility verdicts — it records what you observe and teaches you to make the call." },
      { t: "Nothing — it shows what I recorded and I make the call", correct: true,
        fb: "Exactly. The method's whole premise is that you are the algorithm. The app is your notebook and your teacher, never your interpreter." },
      { t: "A prediction for the next 6 days", correct: false,
        fb: "Predictions are calendar guessing — the rhythm method's mistake. This method observes today's biomarkers instead." },
    ],
  },
  mucus: {
    q: "Monday: egg-white, 3+ cm, slippery. Tuesday: tacky and dry-ish. When can you first identify Peak Day?",
    options: [
      { t: "Monday evening — it felt like peak", correct: false,
        fb: "On Monday you can't yet know it's the last peak-quality day. The identifying moment is the day after, when quality drops." },
      { t: "Tuesday — when quality visibly dropped", correct: true,
        fb: "Exactly. Peak Day is Monday — but you can only call it on Tuesday, once the change shows. Now the 4-day count begins." },
      { t: "Four days later, after the count", correct: false,
        fb: "The count starts from Peak Day — you identify Peak the day after it, then count four days from it." },
    ],
  },
  bbt: {
    q: "Your temperature shifts upward and stays high. What does that tell you?",
    options: [
      { t: "Ovulation is about to happen", correct: false,
        fb: "Other way around — temperature is the rearview mirror. Rising BBT means ovulation has already passed; mucus is the windshield." },
      { t: "Ovulation has already happened — the shift confirms, never predicts", correct: true,
        fb: "Right. Progesterone raises your resting temperature after ovulation. That's why the method pairs BBT with mucus in the double-check." },
      { t: "You're about to get your period", correct: false,
        fb: "A sustained rise marks the start of the luteal phase. The pre-period sign is temperature declining at the end of it." },
    ],
  },
  cervix: {
    q: "Where does cervical position fit in the method?",
    options: [
      { t: "It's required — no cervix checks, no method", correct: false,
        fb: "It's optional. Justisse works as a mucus-plus-temperature method; cervix checks are a bonus signal." },
      { t: "An optional cross-check — useful when mucus is ambiguous", correct: true,
        fb: "Exactly. Many charters use it as a tiebreaker: approaching ovulation the cervix rises, softens, and opens." },
      { t: "It replaces mucus observation", correct: false,
        fb: "Nothing replaces mucus — it's the primary biomarker and the only one that shows fertility approaching in real time." },
    ],
  },
  charting: {
    q: "Who draws the coverline on your chart — and where does it go?",
    options: [
      { t: "The app calculates it automatically", correct: false,
        fb: "Not here. Auto-drawn coverlines are outsourced interpretation. You draw it — the app just holds your pen." },
      { t: "I draw it: 0.05 °C above the highest of the 6 temps before my shift", correct: true,
        fb: "Exactly. You place it, the app keeps it. Three temps above your line — with the third at least 0.1 °C above — support the shift." },
      { t: "My practitioner draws it remotely", correct: false,
        fb: "A practitioner reviews and coaches — but the daily skill of drawing and reading the line is yours to learn." },
    ],
  },
};
