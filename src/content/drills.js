// Chart-reading drills — practice cycles where being wrong is free.
// Each day: cd, stamp (D=dry MO=moist/tacky W=wet/creamy P=peak B=bleed),
// caption lines, and an answer key with rule-quoting feedback.
// key: "right" | named wrong-buckets with specific feedback.
const DRILLS = [
  {
    id: "peak-textbook", title: "Find Peak Day", sub: "A textbook cycle",
    prompt: "Tap the day you'd identify as Peak Day — the last day of peak-quality mucus.",
    days: [
      { cd: 12, stamp: "W",  cap: "creamy\nwet",      key: "early" },
      { cd: 13, stamp: "W",  cap: "clear\n1–3 cm",    key: "early" },
      { cd: 14, stamp: "P",  cap: "EW\nslippery",     key: "early" },
      { cd: 15, stamp: "P",  cap: "EW\nslippery",     key: "right" },
      { cd: 16, stamp: "MO", cap: "tacky\nbreaks",    key: "late" },
      { cd: 17, stamp: "D",  cap: "dry\n—",           key: "late" },
      { cd: 18, stamp: "D",  cap: "dry\n—",           key: "late" },
    ],
    feedback: {
      right: "That's the one. CD 15 is the last day of egg-white and slippery sensation — quality drops to tacky on CD 16, which is when you'd recognise it. Peak + 4 runs to the evening of CD 19.",
      early: "Peak quality continues after this day. Peak Day is the last day of peak-quality mucus, not the first. Look for where slippery egg-white ends.",
      late:  "Quality has already dropped here. This day is after the peak — it's how you recognise Peak Day retrospectively, but the mark belongs on the last peak-quality day.",
    },
  },
  {
    id: "poc", title: "Find the Point of Change", sub: "A dry BIP, then something new",
    prompt: "This charter's BIP is consistently dry. Tap the day the fertile window opens.",
    days: [
      { cd: 6,  stamp: "D",  cap: "dry\n—",         key: "bip" },
      { cd: 7,  stamp: "D",  cap: "dry\n—",         key: "bip" },
      { cd: 8,  stamp: "D",  cap: "dry\n—",         key: "bip" },
      { cd: 9,  stamp: "MO", cap: "tacky\nmoist",   key: "right" },
      { cd: 10, stamp: "W",  cap: "creamy\nwet",    key: "late" },
      { cd: 11, stamp: "P",  cap: "EW\nslippery",   key: "late" },
    ],
    feedback: {
      right: "Yes — CD 9 is the first observation different from the BIP: tacky mucus and a moist sensation after days of dry. That's the Point of Change; the fertile window opens here.",
      bip:   "This day matches the established Basic Infertile Pattern — dry, same as the days before. The point of change is the first day that differs from the BIP.",
      late:  "The window is already open by now. The Point of Change is the first departure from the BIP — mucus had already appeared before this day.",
    },
  },
  {
    id: "delayed", title: "The delayed ovulation", sub: "Stress moved the peak",
    prompt: "A stressful month: a mucus patch, a return to dry, then a second patch. Tap the true Peak Day.",
    days: [
      { cd: 13, stamp: "W",  cap: "creamy\nwet",    key: "first" },
      { cd: 14, stamp: "P",  cap: "EW\nslippery",   key: "first" },
      { cd: 15, stamp: "D",  cap: "dry\n—",         key: "dry" },
      { cd: 16, stamp: "D",  cap: "dry\n—",         key: "dry" },
      { cd: 21, stamp: "W",  cap: "clear\nwet",     key: "second" },
      { cd: 22, stamp: "P",  cap: "EW\n3+ cm",      key: "right" },
      { cd: 23, stamp: "D",  cap: "dry\n—",         key: "after" },
    ],
    feedback: {
      right: "Correct — CD 22 ends the second patch, and the drop on CD 23 identifies it. When stress delays ovulation, the first patch is a false start: no temperature shift followed it. The double-check protects you here.",
      first: "Careful — this is the classic delayed-ovulation trap. Mucus dried up after CD 14 but no temperature shift followed, so ovulation hadn't happened. Expect another patch.",
      dry:   "A return to dryness without a confirmed shift isn't peak — it's a pause. Peak Day needs peak-quality mucus right before the drop.",
      second:"Close — but peak-quality mucus continues after this day. The Peak is the last such day of the patch.",
      after: "Quality has already dropped here — this is the day you'd recognise the Peak, not the Peak itself.",
    },
  },
  {
    id: "doublepeak", title: "The double peak", sub: "Two slippery patches, one Peak",
    prompt: "Slippery days, a brief pause, then slippery again. Tap the day you'd mark as Peak.",
    days: [
      { cd: 14, stamp: "P",  cap: "EW\nslippery",  key: "firstpatch" },
      { cd: 15, stamp: "MO", cap: "tacky\n—",      key: "pause" },
      { cd: 16, stamp: "P",  cap: "EW\nslippery",  key: "firstpatch" },
      { cd: 17, stamp: "P",  cap: "EW\n3+ cm",     key: "right" },
      { cd: 18, stamp: "MO", cap: "tacky\nbreaks", key: "after" },
      { cd: 19, stamp: "D",  cap: "dry\n—",        key: "after" },
    ],
    feedback: {
      right: "Yes. When peak-quality mucus returns within the count, the count restarts — Peak is the last peak-quality day overall, CD 17. The 4-day count runs from there.",
      firstpatch: "Peak-quality mucus returns after this day, so the count would restart. Keep looking for the final peak-quality day.",
      pause: "A tacky day between two slippery patches isn't the Peak — Peak Day must itself be a peak-quality day.",
      after: "Quality dropped before this day — the mark belongs on the last slippery/egg-white day, CD 17.",
    },
  },
  {
    id: "disturbed", title: "Spot the disturbed temp", sub: "Before you draw a coverline",
    prompt: "One of these six pre-shift temperatures shouldn't count. Tap the reading you'd exclude.",
    days: [
      { cd: 8,  stamp: "D", cap: "36.28\n7h sleep",     key: "fine" },
      { cd: 9,  stamp: "D", cap: "36.31\n7h sleep",     key: "fine" },
      { cd: 10, stamp: "D", cap: "36.26\n8h sleep",     key: "fine" },
      { cd: 11, stamp: "D", cap: "36.62\nfever + wine", key: "right" },
      { cd: 12, stamp: "D", cap: "36.30\n7h sleep",     key: "fine" },
      { cd: 13, stamp: "D", cap: "36.27\n6h sleep",     key: "fine" },
    ],
    feedback: {
      right: "Exactly — a fever plus alcohol makes CD 11 unreliable, and at 36.62 it would drag your coverline far too high. Circle it, exclude it, and use the remaining temps for the highest-of-six.",
      fine:  "This reading came from normal conditions — steady sleep, no illness. It belongs in your six. Look for the day whose circumstances would distort a resting temperature.",
    },
  },
  {
    id: "slough", title: "Cell slough or point of change?", sub: "The most common confusion",
    prompt: "This charter gets pasty cell slough on most cycles. Tap the day the fertile window actually opens.",
    days: [
      { cd: 7,  stamp: "D",  cap: "dry\n—",             key: "bip" },
      { cd: 8,  stamp: "D",  cap: "slough\n(habitual)", key: "slough" },
      { cd: 9,  stamp: "D",  cap: "dry\n—",             key: "bip" },
      { cd: 10, stamp: "MO", cap: "tacky\nmoist",       key: "right" },
      { cd: 11, stamp: "W",  cap: "creamy\nwet",        key: "late" },
    ],
    feedback: {
      right: "Yes — CD 10 brings genuinely new observations: tacky mucus with a moist sensation. That's the departure from this charter's BIP.",
      slough:"Tempting — but this charter's cell slough is habitual: it appears every cycle without changing. A recurring observation that's part of the BIP isn't a point of change. (Unsure about your own? Chart it and ask your practitioner.)",
      bip:   "Dry days matching the BIP don't open the window. Look for the first observation that differs from the established pattern.",
      late:  "The window opened before this — the first different observation came earlier.",
    },
  },
];
