# LunaChart

**A mobile-first fertility awareness tracker built on the Justisse Method**

LunaChart is an educational tool and daily charting app that teaches the Justisse Method of Fertility Awareness — a secular, science-based symptothermal method founded in 1987 by Geraldine Matus. The app combines interactive skill-building modules with a detailed biomarker tracker and an evidence-based article library.

> **Important:** LunaChart is an educational tool and observation recorder, not a medical device, contraceptive, or replacement for professional instruction. It is not FDA-cleared. It is not affiliated with Justisse College International. If you are charting for pregnancy avoidance, work with a trained Justisse HRHP (Holistic Reproductive Health Practitioner). Find one at [justisse.ca](https://justisse.ca/chart-your-cycle/).

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
- **Cervical mucus** — Three separate fields following the Justisse standard: sensation (dry/moist/wet/slippery), appearance (nothing/cell slough/tacky/creamy/clear/egg-white/watery), stretchiness (none/breaks/< 1cm/1–3cm/3+cm)
- **Basal body temperature** — Numeric entry with disturbed-temperature flagging
- **Cervical position** — Height, texture, and openness (optional)
- **Bleeding** — None/spotting/light/medium/heavy
- **Manual interpretive markers** — Peak Day (★) and Point of Change (⬆) buttons
- **Notes** — Freeform field for symptoms, energy, mood, medications

Contextual education prompts appear inline: if the mucus skill hasn't been completed, a tappable prompt links to the lesson. Each section includes reminder tips (e.g., "Record the most fertile observation from your entire day").

### Cycle Chart
- SVG-based BBT temperature graph with plotted data points, connecting lines, Peak Day labels, Point of Change markers, and a dashed coverline
- Tappable day-by-day strip — selecting any row reveals a detail panel showing all four biomarker categories, notes, and an "Edit →" button that navigates to the Tracker for that date
- Chart legend explaining all symbols and their Justisse Method significance

### Hardcoded Sample Data
35 days of pre-populated data (Feb 15 – Mar 21, 2026) showing a complete textbook Justisse cycle:
- Menstruation → dry BIP days → point of change → mucus buildup → Peak Day → post-peak drying with BBT shift → double-check confirmation → luteal phase → next cycle begins
- Each significant day includes educational notes explaining what's happening and why (e.g., "Peak+3. Third high temp — BBT SHIFT CONFIRMED!")

### Blog / Article Library
14 long-form SEO-optimized articles with inline superscript citation numbers and full source footers:

| # | Title | Category | Target Audience |
|---|-------|----------|-----------------|
| 1 | What Is the Justisse Method? | Method Education | Beginners |
| 2 | FAM Is NOT the Rhythm Method | Myth Busting | Skeptics, providers |
| 3 | Coming Off the Pill | Transition Guide | People leaving hormonal BC |
| 4 | Why Fertility Apps Get It Wrong | Technology | Frustrated app users |
| 5 | Cervical Mucus Complete Guide | How-To | New charters |
| 6 | BBT Tracking Guide | How-To | Data-oriented charters |
| 7 | Your Cycle as a Fifth Vital Sign | Health & Wellness | Wellness community |
| 8 | Charting with PCOS | Special Circumstances | PCOS / irregular cycles |
| 9 | Fertility Data Privacy | Privacy | Privacy-conscious users |
| 10 | Partner's Guide to FAM | Relationships | Couples |
| 11 | TTC with Justisse | Conception | Couples trying to conceive |
| 12 | Postpartum Charting | Life Stages | New parents |
| 13 | Justisse vs Apps Comparison | Comparison | App shoppers |
| 14 | Perimenopause Charting | Life Stages | People 40+ |

Sources include peer-reviewed research (Duane et al. 2022, Peragallo Urrutia et al. 2018, Frank-Herrmann et al. 2007, Moglia et al. 2016), ACOG Committee Opinions, FDA documents, official Justisse College content, and established practitioner/educator sites.

### Landing Page with Honest Positioning
- **What LunaChart Does** — Four feature cards
- **What LunaChart Does Not Do** — Five items with ✗ marks (no predictions, no auto-interpretation, no practitioner replacement, no multi-cycle analysis, no notifications)
- **Is LunaChart Right for You?** — Stacked "Good Fit" / "Not Ideal Fit" cards that recommend competitors by name where they're genuinely better
- **Competitive Comparison Table** — 17 features × 4 competitors (Read Your Body, Natural Cycles, Flo/Clue) with honest ✓/✗/~ ratings
- **Detailed Competitor Breakdown** — Expandable cards for each competitor category showing strengths, limitations, and honest "how LunaChart compares" commentary
- **The Justisse Method in 60 Seconds** — Six-step visual walkthrough

---

## What It Does NOT Do

Transparency matters, especially with health tools:

- **No fertile/infertile predictions.** The app never says "you're safe today." Interpretation is the user's skill to learn.
- **No automatic chart interpretation.** No auto-drawn coverlines, no auto-detected temperature shifts, no auto-identified Peak Day.
- **No practitioner replacement.** Educational foundations only — professional guidance is strongly recommended for pregnancy avoidance.
- **No multi-cycle analysis.** The chart shows a rolling view. No cycle-over-cycle comparison, exportable practitioner reports, or historical pattern analysis yet.
- **No notifications or reminders.** Building a daily habit is part of the learning process.
- **No FDA clearance.** This is an educational tool, not a regulated medical device or contraceptive.

---

## Tech Stack

- **React** (JSX, functional components with hooks)
- **Persistent storage** via the `window.storage` API (key-value, local to device)
- **No external dependencies** beyond React, Google Fonts (Libre Baskerville + DM Sans), and the storage API
- **No backend, no accounts, no cloud sync** — all data stays on the user's device
- **Mobile-first design** — 480px max-width, touch-optimized inputs, bottom tab navigation with safe area insets

---

## File Structure

```
lunachart-v2.jsx    # Single-file React application (~1,675 lines)
├── Constants       # Mucus categories, cervix options, bleeding types, etc.
├── SAMPLE          # Hardcoded 35-day sample cycle data
├── ARTICLES[]      # 14 full blog articles with sources
├── WIZARD_MODULES  # 5 interactive teaching modules
├── LunaChart()     # Main app component (routing, state, persistence)
├── Landing()       # Landing page with honest positioning
├── Onboard()       # 4-step onboarding flow
├── SkillsHub()     # Learning module hub with progress tracking
├── WizardPlayer()  # Step-by-step module player
├── Tracker()       # Daily biomarker entry form
├── Chart()         # Visual BBT graph + tappable day strips
├── Blog()          # Article hub with category filtering
└── Article()       # Full article view with citations
```

---

## Design Decisions

**Why no algorithm?** The Justisse Method's core philosophy is that the user IS the algorithm. Outsourcing fertility interpretation to software undermines body literacy — the primary value proposition. The app's role is to teach, record, and display, not to decide.

**Why hardcoded sample data?** New users need to see what a completed chart looks like to understand what they're working toward. The sample data doubles as a teaching tool — the notes narrate the cycle in real time.

**Why recommend competitors?** Trust. People exploring fertility awareness are making health decisions. Directing them to the right tool for their specific needs — even if that tool isn't ours — builds credibility and serves them better than feature-claiming.

**Why local-only storage?** Fertility data is sensitive, especially post-Dobbs. The simplest way to protect it is to never let it leave the device. No accounts means no email addresses to breach, no servers to subpoena, no privacy policies to change.

**Why Justisse specifically?** It's the gold standard for secular FAE training, has the most detailed mucus categorization system (three separate qualities vs. most methods' one or two), works as both symptothermal and mucus-only, and has strong practitioner infrastructure for guided learning.

---

## Known Limitations & Future Work

- Multi-cycle view with cycle-over-cycle BBT comparison
- Automatic coverline calculation (user-confirmable, not overriding)
- Chart export (PDF/image) for practitioner review
- Colored stamp system matching Justisse paper chart conventions
- Practitioner directory integration
- Localization (French, Spanish)
- Accessibility audit (screen reader support, high contrast mode)
- PWA wrapper for offline mobile use

---

## Sources & References

The article library cites from the following primary sources:

- Duane, M., Stanford, J.B., Porucznik, C.A., & Vigil, P. (2022). Fertility Awareness-Based Methods for Women's Health and Family Planning. *Frontiers in Medicine*, 9, 858977.
- Peragallo Urrutia, R., et al. (2018). Effectiveness of Fertility Awareness–Based Methods for Prevention of Pregnancy. *Obstetrics & Gynecology*, 132(3), 591–604.
- Frank-Herrmann, P., et al. (2007). The effectiveness of a fertility awareness based method to avoid pregnancy. *Human Reproduction*, 22(5), 1310–1319.
- Moglia, M.L., et al. (2016). Evaluation of Smartphone Cycle Tracking Applications. *Obstetrics & Gynecology*, 127(6), 1153–1160.
- ACOG Committee Opinion No. 651 (2015). Menstruation in Girls and Adolescents: Using the Menstrual Cycle as a Vital Sign.
- Matus, G. (2012). Justisse Method: Fertility Awareness and Body Literacy — A User's Guide.
- Justisse College International. Chart Your Cycle / College Program / User's Guide Addendum (2023).

---

## License

This is an independent educational project. The Justisse Method is a trademark of Justisse College International. LunaChart is not affiliated with, endorsed by, or officially connected to Justisse College International.
