// WIZARD_MODULES - 5 Justisse lesson modules (carried over verbatim; quizzes in lessons-extra.js)
const WIZARD_MODULES = [
  {
    id:"intro", title:"Welcome to Body Literacy", icon:"◉", duration:"2 min",
    steps:[
      { h:"Your body speaks every day", p:"The Justisse Method teaches you to observe three biomarkers — cervical mucus, basal body temperature, and cervical position — that reveal your fertility status in real time. No algorithms needed.", tip:null },
      { h:"Founded in science, not ideology", p:"Created by Geraldine Matus in 1987, Justisse is entirely secular. It's used for body literacy, birth control, conception, and health monitoring — whatever your intention.", tip:"Justisse College International has trained practitioners since 1987 and is considered the gold standard for secular FAE training." },
      { h:"The 3-cycle commitment", p:"Plan to chart for at least 3 complete cycles before relying on the method. This learning period builds the skill and pattern recognition needed for confident charting.", tip:"Working with a Justisse HRHP (Holistic Reproductive Health Practitioner) during this phase dramatically improves accuracy and confidence." },
    ]
  },
  {
    id:"mucus", title:"Skill 1: Cervical Mucus", icon:"◐", duration:"5 min",
    steps:[
      { h:"Why mucus is #1", p:"Cervical mucus is your primary fertility biomarker. It's the ONLY sign that tells you fertility is approaching in real time — before ovulation happens. Temperature can only confirm ovulation after the fact.", tip:"The cervix produces different types of mucus under the influence of estrogen. Rising estrogen = more fluid, stretchy, alkaline mucus = sperm-friendly environment." },
      { h:"The observational routine", p:"Check every time you use the bathroom. Before and after urinating, wipe front to back with toilet paper. Pay attention to: 1) What you FELT (sensation), 2) What you SAW (appearance), 3) If collected: how far it STRETCHES.", tip:"At the end of the day, record the MOST fertile observation from the entire day. If morning was dry but afternoon was wet — chart wet." },
      { h:"Sensation categories", p:"DRY (D0): No moisture on tissue.\nMOIST (M): Slight dampness.\nWET (W): Distinct wetness.\nSLIPPERY (SL): Lubricative, paper glides — this is peak fertility sensation.", tip:"Sensation is sometimes the only detectable sign, especially when mucus volume is low. Pay attention even when you don't see anything on the tissue." },
      { h:"Appearance categories", p:"NOTHING: No visible mucus.\nCELL SLOUGH: Pasty, crumbly, white/yellow.\nTACKY: Sticky, opaque, breaks when stretched.\nCREAMY: White, lotion-like.\nCLEAR: Translucent.\nEGG-WHITE: Clear + stretchy.\nWATERY: Thin, transparent.", tip:"Cell slough is commonly confused with fertile mucus. If it's a habitual observation that doesn't change with cycle phase, it's likely NOT a fertile sign — but chart it and discuss with your practitioner." },
      { h:"Peak Day — the key concept", p:"Peak Day = the LAST day of peak-quality mucus (clear, stretchy, wet, slippery). You identify it the day AFTER, when quality changes or mucus disappears. In Justisse, count 4 days after Peak Day before declaring infertility.", tip:"You won't know it's Peak Day on the actual day. Be patient — this retrospective identification is how the method achieves its high accuracy." },
      { h:"Let's practice!", p:"In the tracker, you'll see three mucus fields: Sensation, Appearance, and Stretchiness. Each is important. Try recording today's observations using the categories you just learned.", tip:null },
    ]
  },
  {
    id:"bbt", title:"Skill 2: Temperature", icon:"☉", duration:"4 min",
    steps:[
      { h:"What BBT tells you", p:"Your Basal Body Temperature is your resting core temperature. After ovulation, progesterone raises it by 0.2–0.5°C. This sustained rise CONFIRMS that ovulation has already passed — it cannot predict it.", tip:"Think of BBT as a rearview mirror: it shows you what already happened, while cervical mucus is the windshield showing what's ahead." },
      { h:"How to take it correctly", p:"Use a basal body thermometer (reads to 0.01°C). Take at the same time every morning, BEFORE any activity — before sitting up, talking, drinking, or checking your phone. Hold for 3 full minutes (oral/vaginal) or 10 minutes (underarm).", tip:"Set your thermometer on your nightstand the night before. Many charters find it helpful to set a gentle alarm, take temperature while still lying down, then either go back to sleep or get up." },
      { h:"The temperature shift", p:"After ovulation, look for 3+ consecutive temperatures above your coverline (drawn 0.05°C above the highest of the 6 pre-shift temps). The third high temperature should be at least 0.1°C above the coverline.", tip:"Not every temperature is valid. Illness, alcohol, disrupted sleep, or taking it at a very different time can produce misleading readings. Circle these 'disturbed' temperatures and exclude them from interpretation." },
      { h:"The double-check", p:"The Justisse Method confirms ovulation when BOTH Peak Day count (4 days) AND BBT shift agree. This cross-referencing is what makes symptothermal methods the most effective FAMs available.", tip:"If mucus dries up but temperature doesn't shift — you likely haven't ovulated. Expect another mucus patch. The double-check protects you from false conclusions." },
    ]
  },
  {
    id:"cervix", title:"Skill 3: Cervical Position", icon:"◎", duration:"3 min",
    steps:[
      { h:"The optional third sign", p:"Cervical position is an optional but valuable biomarker. The cervix changes in height, texture, and openness throughout the cycle in response to the same hormones that drive mucus and temperature changes.", tip:"Many charters find cervical checks most useful as a 'tiebreaker' when mucus patterns are ambiguous." },
      { h:"What to observe", p:"Height: Low (easy to reach) → Mid → High (harder to reach).\nTexture: Firm (like nose tip) → Medium → Soft (like earlobe).\nOpening: Closed → Partially open → Open.\n\nApproaching ovulation: high, soft, open. After ovulation: low, firm, closed.", tip:"Check at the same time daily, in the same position (many prefer one foot on the toilet seat). Wash hands first. The changes are subtle at first but become obvious with practice." },
    ]
  },
  {
    id:"charting", title:"Skill 4: Reading Your Chart", icon:"▤", duration:"4 min",
    steps:[
      { h:"Your Basic Infertile Pattern (BIP)", p:"Over your first 3 cycles, you'll identify your personal baseline — what your body looks like on infertile days. Some people are consistently dry. Others have regular cell slough. ANY change from your BIP is your 'point of change' — the fertile window is opening.", tip:"BIP is unique to you. There's no universal 'infertile pattern.' This is why learning with a practitioner is so valuable — they help you identify YOUR baseline." },
      { h:"The fertile window on the chart", p:"OPENS at your point of change (first observation different from BIP).\nINCLUDES all days of observable mucus and the transition period.\nCLOSES on the evening of the 4th day after Peak Day, confirmed by BBT shift.", tip:"The Justisse count of 4 after Peak Day is more conservative than some methods that use 3. This extra day provides an additional margin of safety." },
      { h:"Cycle day vs. calendar day", p:"Cycle Day 1 = first day of full menstrual flow (needing a pad/tampon/cup). Spotting before full flow doesn't count. Each cycle begins fresh, and cycle length is measured from Day 1 to the day before the next Day 1.", tip:"Average cycles are 24–35 days, but 'normal' has a wide range. What matters is YOUR pattern and whether your observations align with method rules." },
      { h:"When to ask for help", p:"If you're unsure about any observation, chart it and flag it for your practitioner. Common questions: 'Is this cell slough or mucus?', 'Is my temperature shift valid?', 'Did I have a double peak?' These are normal learning questions, not failures.", tip:"Find a Justisse practitioner at justisse.ca. Most offer virtual consultations." },
    ]
  },
];
