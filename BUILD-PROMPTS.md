# LunaChart — Build Prompts & Design Direction

**A record of every prompt used to design and build LunaChart, with context on what each prompt produced and how the project evolved.**

This document captures the full conversation arc that shaped LunaChart from initial concept to working prototype. Each prompt is quoted exactly as written, followed by what it triggered and what changed.

---

## Prompt 1 — The Initial Brief

> **"I'd like to do some deep research on a Justisse College guide to FAM and create a simple mobile first app that follows this exact process.**
>
> **Also built out a website for this tracker, some SEO, GEO optimized articles (with inline superscript numbered links to sources and footers at the bottom)**
>
> **Consider everything someone should know, why they should know it, who the target audiences are, why would make them want to switch and write out lots of blog articles specifically on that."**

### What this triggered
- Deep web research on the Justisse Method: the User's Guide, the 2023 Addendum, Justisse College's practitioner program, the charting process, cervical mucus categories, BBT rules, efficacy data
- Competitive landscape research: Natural Cycles, Clue, Flo, Read Your Body, Kindara, and the broader fertility app market
- Research into peer-reviewed sources: Duane et al. 2022, Peragallo Urrutia et al. 2018, Frank-Herrmann et al. 2007, Moglia et al. 2016, ACOG Committee Opinion No. 651
- Research into practitioner/educator perspectives: Fertility Awareness Project, Blue Poppy Health, Fertility Friday, Tempdrop, Leilani Navar, Pelvic Health & Wellness

### What was built (v1)
- Mobile-first React app with four tabs: Today (tracker), Chart, Learn, Articles
- Daily tracker recording cervical mucus (sensation, appearance, stretchiness), BBT, cervical position, bleeding, notes
- Simple BBT graph and day-by-day chart strip
- 12 blog articles with inline superscript references and source footers
- Landing page with feature cards and comparison table
- Persistent storage via `window.storage` API

---

## Prompt 2 — The Teaching Gap

> **"The main feedback is that the app should teach people skills as they use it. Also there should be lots of SEO/GEO friendly articles to drive traffic, and actually populate them with specific references inline superscript numbers and footers at the bottom.**
>
> **Do this throughout the website.**
>
> **Think about if anything is missing, walk people through a bit of a user guide teaching the quickly through a wizard how it all works."**

### What this identified as missing
- No onboarding — users were dropped into a blank tracker with no instruction
- No method education within the app itself — the articles existed but weren't integrated into the charting experience
- Articles had references but they were informal — needed proper `[1]` superscript format with numbered source footers
- No skill progression or learning pathway

### What was built (v2 — major rebuild)
- **Interactive Skills Wizard** — 5 modules with 20+ steps total, each with practitioner tips:
  - Welcome to Body Literacy (3 steps)
  - Cervical Mucus (6 steps — the most important and longest module)
  - Basal Body Temperature (4 steps)
  - Cervical Position (2 steps)
  - Reading Your Chart (4 steps)
- **Contextual education in the tracker** — if the mucus or BBT skill hasn't been completed, a tappable prompt appears inline: "New to mucus tracking? Take the 5-minute interactive lesson first →"
- **4-step onboarding flow** — goal selection (body literacy, avoidance, conception, health monitoring), method overview, daily practice walkthrough, practitioner recommendation
- **14 full-length articles** rewritten with proper `[1]` `[2]` `[3]` inline superscript citations rendered as `<sup>` tags, plus complete numbered source footers at the bottom of each article
- Articles expanded to cover: perimenopause, comparison of 4 competitor categories, data privacy post-Dobbs

---

## Prompt 3 — Honest Positioning

> **"What is this tool doing and not doing? How is it different from other apps?"**

### What this triggered
This wasn't a build prompt — it was a reflection prompt. The response was a candid assessment of the competitive landscape:

- **What LunaChart does:** Records three biomarkers, teaches the method via interactive modules, shows a visual chart, hosts educational articles
- **What it does NOT do:** No fertility predictions, no auto chart interpretation, no coverline calculation, no Peak Day auto-detection, no practitioner integration, no multi-cycle views, no notifications, no community features
- **The competitive reality:** Read Your Body already does most of what the tracker does — and does it better. Natural Cycles gives the daily verdict most people want. Flo/Clue have massive install bases and polished UX.
- **Where LunaChart is genuinely different:** It teaches the method (most apps don't), it's Justisse-specific (unique), and it's local-only for privacy (rare)

This analysis directly shaped the next prompt.

---

## Prompt 4 — Show the Honesty

> **"Can you show that on the site?"**

### What this triggered
A complete rebuild of the landing page with five new sections:

1. **"What LunaChart Does"** — 4 feature cards (skills-based learning, three-quality tracking, user control, privacy)

2. **"What LunaChart Does Not Do"** — 5 items with red ✗ marks, each with an explanation of WHY it doesn't do this (no predictions, no auto interpretation, no practitioner replacement, no multi-cycle analysis, no notifications)

3. **"Is LunaChart Right for You?"** — Two stacked cards: "Good fit if…" (6 items) and "You might prefer something else if…" (5 items that recommend competitors by name)

4. **17-feature comparison table** — LunaChart vs Read Your Body vs Natural Cycles vs Flo/Clue with honest ✓/✗/~ for each

5. **Expandable detailed breakdown** — Four competitor deep-dives, each with Strengths (green), Limitations (red), and "How LunaChart compares" (neutral). Ends with "Our honest recommendation" that says users should graduate to Read Your Body when ready.

Also added: "The Justisse Method in 60 Seconds" (6-step visual walkthrough) and a footer with clear disclaimers about not being FDA-cleared, not affiliated with Justisse College, not being a contraceptive device.

---

## Prompt 5 — Mobile Fix

> **"Make the good fit/not a good fit more mobile friendly"**

### What this fixed
The "Is LunaChart Right for You?" section had a two-column CSS grid (`gridTemplateColumns: "1fr 1fr"`) that squeezed text into ~150px columns on mobile — unreadable.

Replaced with stacked full-width cards. Each card now has:
- A colored circle header (green ✓ or coral →)
- Items with bold titles + description lines (instead of just long sentences)
- Subtle border dividers between items
- Full 480px width on mobile

---

## Prompt 6 — Sample Data & Interactivity

> **"Let's add some sample data to the chart. And allow the user to go back in and click on individual days."**

### What was built
- **Sample data generator** — 34 days of realistic Justisse cycle data: menstruation → dry BIP days → point of change → mucus buildup → Peak Day → post-peak drying with BBT shift → double-check confirmation → luteal phase → next cycle starts
- **Educational notes** on key days narrating the cycle in real time (e.g., "Peak+3. Third high temp — BBT SHIFT CONFIRMED!")
- **Clickable chart rows** — tapping any day reveals an inline detail panel with four tiles (mucus, BBT, bleeding, cervix) plus notes
- **Edit navigation** — "Edit →" button on detail panel navigates to Tracker with that date loaded
- **BBT graph enhancements** — tappable data points, Peak Day labels, Point of Change markers, dashed coverline, vertical selection indicator, color legend
- **Chart legend card** — explains every symbol and its Justisse Method meaning

---

## Prompt 7 — Hardcode the Data

> **"Hardcode in some data"**

### What this fixed
The sample data generator used `new Date()` at runtime and depended on the async `window.storage` API. If storage failed or was slow, the chart could render empty on first load.

Replaced with a flat `SAMPLE` constant object using fixed date strings (Feb 15 – Mar 21, 2026). State initializes directly: `useState(SAMPLE)`. The chart has data on the very first render with zero async dependency. The storage `useEffect` still loads any user-saved edits on top of the baseline.

---

## Prompt 8 — Documentation

> **"Build a readme, as well as a document with all the prompts I used to see the direction of building this app"**

### What was built
- `README.md` — Complete project documentation covering what it does, what it doesn't do, tech stack, file structure, design decisions, known limitations, and sources
- `BUILD-PROMPTS.md` (this document) — Every prompt from the conversation, what it triggered, and what changed

---

## Design Themes Across the Build

### Transparency over marketing
The most distinctive design decision was the honest competitive positioning. Most app landing pages hide limitations and exaggerate strengths. LunaChart's landing page explicitly lists what it doesn't do, recommends competitors by name, and says outright that Read Your Body is the more mature charting tool. This emerged from Prompt 3's honest self-assessment and Prompt 4's directive to show it on the site.

### Education before tracking
The Skills Wizard exists because of Prompt 2's feedback that "the app should teach people skills as they use it." Most fertility apps hand users a blank form. LunaChart's flow is: learn the method → practice on sample data → then start recording your own observations.

### The method is the product, not the app
A recurring theme is that the Justisse Method's value lives in the user's learned body literacy — not in any software. The app is explicitly positioned as a "notebook" and "teaching tool," with repeated encouragement to work with a trained practitioner. This philosophy drove the decision to never add algorithmic predictions.

### Privacy as architecture, not policy
Local-only storage wasn't added as a feature — it was the default architecture. No backend was ever considered. This reflects both the post-Dobbs sensitivity of fertility data and the Justisse philosophy that your data's primary value is to you.

### Progressive disclosure
Rather than overwhelming new users with every biomarker field at once, the app uses collapsible sections, contextual skill prompts, and a sequential learning pathway. The sample data provides a "this is what success looks like" reference that most onboarding flows lack.
