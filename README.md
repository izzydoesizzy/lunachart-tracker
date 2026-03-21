# LunaChart

**A mobile-first fertility awareness tracker built on the Justisse Method**

[![GitHub Pages](https://img.shields.io/badge/demo-live-brightgreen)](https://izzydoesizzy.github.io/lunachart-tracker/)

LunaChart is an educational tool and daily charting app that teaches the Justisse Method of Fertility Awareness — a secular, science-based symptothermal method founded in 1987 by Geraldine Matus. The app combines interactive skill-building modules with a detailed biomarker tracker and an evidence-based article library.

> **Important:** LunaChart is an educational tool and observation recorder, not a medical device, contraceptive, or replacement for professional instruction. It is not FDA-cleared. It is not affiliated with Justisse College International. If you are charting for pregnancy avoidance, work with a trained Justisse HRHP (Holistic Reproductive Health Practitioner). Find one at [justisse.ca](https://justisse.ca/chart-your-cycle/).

---

## Live Demo

[https://izzydoesizzy.github.io/lunachart-tracker/](https://izzydoesizzy.github.io/lunachart-tracker/)

---

## What It Does

### Interactive Skills Wizard
Five sequential learning modules that teach the method *before* users start tracking:
1. **Welcome to Body Literacy** — What the Justisse Method is, its secular/science foundation, the 3-cycle commitment
2. **Skill 1: Cervical Mucus** (6 steps) — The observational routine, sensation/appearance/stretchiness categories, the "most fertile" recording rule, Peak Day identification
3. **Skill 2: Basal Body Temperature** (4 steps) — Measurement protocol, shift identification, the double-check rule
4. **Skill 3: Cervical Position** (2 steps) — Height, texture, openness changes across the cycle
5. **Skill 4: Reading Your Chart** (4 steps) — BIP identification, fertile window rules, cycle day counting, when to seek practitioner help

Each step includes a "Practitioner Tip" with contextual guidance. Progress persists across sessions.

### Daily Tracker
Records all Justisse-specific biomarkers:
- **Cervical mucus** — Three separate fields following the Justisse standard: sensation (dry/moist/wet/slippery), appearance (nothing/cell slough/tacky/creamy/clear/egg-white/watery), stretchiness (none/breaks/< 1cm/1-3cm/3+cm)
- **Basal body temperature** — Numeric entry with disturbed-temperature flagging
- **Cervical position** — Height, texture, and openness (optional)
- **Bleeding** — None/spotting/light/medium/heavy
- **Manual interpretive markers** — Peak Day and Point of Change buttons
- **Notes** — Freeform field for symptoms, energy, mood, medications

### Cycle Chart
- SVG-based BBT temperature graph with plotted data points, connecting lines, Peak Day labels, Point of Change markers, and a dashed coverline
- Tappable day-by-day strip with detail panels showing all four biomarker categories
- Chart legend explaining all symbols and their Justisse Method significance

### Blog / Article Library
14 long-form SEO-optimized articles with inline superscript citation numbers and full source footers covering method education, myth busting, transition guides, how-tos, special circumstances, privacy, relationships, and life stages.

### Landing Page with Honest Positioning
- **What LunaChart Does** and **Does Not Do** — transparent feature cards
- **Is LunaChart Right for You?** — recommends competitors by name where they're genuinely better
- **Competitive Comparison Table** — 17 features x 4 competitors with honest ratings
- **The Justisse Method in 60 Seconds** — six-step visual walkthrough

---

## What It Does NOT Do

- **No fertile/infertile predictions.** The app never says "you're safe today."
- **No automatic chart interpretation.** No auto-drawn coverlines or auto-detected temperature shifts.
- **No practitioner replacement.** Educational foundations only.
- **No multi-cycle analysis.** Single cycle rolling view for now.
- **No notifications or reminders.** Building a daily habit is part of the learning process.
- **No FDA clearance.** This is an educational tool, not a regulated medical device.

---

## Tech Stack

- **React 18** (JSX, functional components with hooks, loaded via CDN)
- **Babel standalone** for in-browser JSX transpilation
- **localStorage** for persistent on-device data storage
- **No external dependencies** beyond React, Google Fonts, and Babel
- **No backend, no accounts, no cloud sync** — all data stays on the user's device
- **Mobile-first design** — 480px max-width, touch-optimized inputs, bottom tab navigation

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/izzydoesizzy/lunachart-tracker.git
cd lunachart-tracker

# Open in browser
open index.html
```

---

## Design Decisions

**Why no algorithm?** The Justisse Method's core philosophy is that the user IS the algorithm. Outsourcing fertility interpretation to software undermines body literacy.

**Why hardcoded sample data?** New users need to see what a completed chart looks like. The sample data doubles as a teaching tool.

**Why recommend competitors?** Trust. Directing users to the right tool for their needs builds credibility.

**Why local-only storage?** Fertility data is sensitive. No accounts means no email addresses to breach, no servers to subpoena.

**Why Justisse specifically?** Gold standard for secular FAE training, most detailed mucus categorization, works as both symptothermal and mucus-only.

---

## Sources & References

- Duane, M., et al. (2022). Fertility Awareness-Based Methods for Women's Health. *Frontiers in Medicine*, 9, 858977.
- Peragallo Urrutia, R., et al. (2018). Effectiveness of FABMs for Prevention of Pregnancy. *Obstetrics & Gynecology*, 132(3), 591-604.
- Frank-Herrmann, P., et al. (2007). The effectiveness of a fertility awareness based method. *Human Reproduction*, 22(5), 1310-1319.
- ACOG Committee Opinion No. 651 (2015). Using the Menstrual Cycle as a Vital Sign.
- Matus, G. (2012). Justisse Method: Fertility Awareness and Body Literacy — A User's Guide.

---

## License

This is an independent educational project. The Justisse Method is a trademark of Justisse College International. LunaChart is not affiliated with, endorsed by, or officially connected to Justisse College International.
