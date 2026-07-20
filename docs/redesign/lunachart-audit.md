# LunaChart -- UX, Design & FAM Pedagogy Audit

**Scope:** full review of the shipped app (`lunachart-v2.jsx`, mirrored in `index.html` and the iOS `WebAssets/index.html`), covering every screen, the visual system, interaction design, accessibility, and Justisse Method fidelity.
**Companion deliverable:** the "Lunar" redesign mockups. Each mockup caption cites the finding IDs it addresses (e.g., "Addresses P-1, U-3").

**Severity scheme**
- **S1 Critical** -- misleading pedagogy or safety-adjacent behavior in a fertility app
- **S2 Major** -- method-fidelity gap, broken promise, or task blocker
- **S3 Moderate** -- real friction or inconsistency
- **S4 Polish** -- refinement

Tags: `[Pedagogy]` `[Method]` `[UX]` `[IA]` `[Visual]` `[A11y]` `[Copy]` `[Tech]`

---

## Executive summary

LunaChart gets the hard part right: the content. The Justisse instruction is accurate, conservative, and honestly framed -- the 4-day Peak count, the double-check rule, BIP/Point of Change, the "record the most fertile observation" rule, the repeated push toward practitioner support, and a landing page that recommends competitors by name. That integrity is rare and is the product's moat.

The execution around that content undermines it in five ways:

1. **The app quietly breaks its own #1 promise.** The Today screen computes fertility verdicts ("Potentially Fertile", "Dry -- Observe BIP") -- the exact thing the landing page says it never does. The code is also broken, so the verdicts never actually display (P-1). Both problems should be resolved the same way: remove interpretation, reflect the user's own marks.
2. **The chart teaches with a lie.** The coverline is hardcoded to the sample cycle's value, so any real user's chart shows a meaningless line that contradicts the legend's own rule (P-2).
3. **The lessons don't practice what they teach.** All five modules are passive reading. A method whose thesis is "the user is the algorithm" should make the user *do* the algorithm -- on practice charts, with feedback (P-3).
4. **Trust promises have no UI.** "Change your goal anytime" (no settings exist), "your data is yours" (no export or delete), returning users are dumped back on the marketing page (U-1, U-2).
5. **Accessibility is effectively absent.** Zero ARIA, zoom disabled, color-only state, sub-44px targets, and pervasive low-contrast micro-text (A-1...A-6). For a health app with a body-literacy mission, this excludes the very users it wants to teach.

None of this requires abandoning the app's character. The redesign keeps the philosophy -- and makes the software finally live up to it.

---

## Findings

### Today / Tracker

**P-1 - S1 `[Pedagogy]` `[Method]` `[Tech]` -- The fertility banner computes verdicts, against the app's own philosophy (and it's broken)**
`lunachart-v2.jsx:1300-1306`. `getFertility()` derives statuses like "Mucus Observed -- Potentially Fertile" and "Dry -- Observe BIP" from the day's data. The landing page states: *"No automatic chart interpretation... You make those calls -- that's the point of body literacy."* This banner is automatic chart interpretation. It is also dead code -- it reads `e.mucusSensation`, but the tracker saves the field as `mucusSens` (`:1355`), so the mucus-driven branches can never fire; after logging, users see the generic "Record today's observations."
**Recommendation:** don't fix the field name -- remove the interpretation. Replace with an *observation summary* that mirrors back what the user recorded and marked ("You logged: wet sensation, egg-white. You marked nothing yet."). If a user marks Peak Day, say "You marked Peak Day -- day 1 of your 4-day count" (a count *they* initiated is coaching, not a verdict).

**U-3 - S3 `[UX]` -- Peak Day / Point of Change toggles have no guardrails or teaching moment**
`:1327-1330`. Both are free toggles: you can mark Peak on a bone-dry day, mark both at once, or mark multiple Peaks with no acknowledgment. These are the two highest-stakes interpretive acts in the method.
**Recommendation:** keep them user-driven, but make marking a small deliberate moment: a confirm sheet restating the definition ("Peak Day is the *last* day of peak-quality mucus -- you usually identify it the day after"), gentle notice when the day's own log seems inconsistent ("You logged dry today -- still mark Peak?"), and show the running Peak+1...+4 count on subsequent days.

**U-4 - S3 `[UX]` -- Accordion entry model fights the daily routine**
`:1292`. Only one section can be open at once (opening BBT collapses Mucus); the daily flow requires reopening sections every visit; there's no sense of "done for today."
**Recommendation:** grouped iOS cards that are all visible with summary rows ("Mucus -- wet - egg-white - 3+cm"), tap to open a focused bottom sheet per biomarker. A subtle per-day completeness indicator (not a streak-guilt mechanic) shows what's been observed.

**U-5 - S3 `[UX]` -- Instant-save with no undo**
`:801`. Every tap writes immediately; a mis-tap silently changes health data with no undo, no toast, no edit history.
**Recommendation:** keep instant save (it's right for mobile) but add a brief "Saved - Undo" affordance.

**A-6 - S3 `[A11y]` `[IA]` -- No heading, tiny date arrows**
The screen opens with a `<p>` date; section labels are styled `<p>`s, not headings (`:1311-1318`). Date arrows are ~38px targets.
**Recommendation:** real large-title heading ("Today"), semantic `<h2>` per section, 44px+ targets.

### Chart

**P-2 - S1 `[Method]` `[Tech]` -- Hardcoded coverline**
`:1479-1482`. The dashed coverline is drawn at a constant `36.38` -- correct only for the built-in sample cycle. Any real user sees a line that means nothing, while the legend asserts it is "drawn 0.05 degrees C above highest of 6 pre-shift temps." A misplaced coverline on a real chart can directly mislead an avoidance user.
**Recommendation:** in a no-algorithm app the honest options are (a) no coverline on user data, or better (b) **let the user draw their own coverline** -- a draggable line with the rule quoted beside it. That converts a bug into the app's best teaching interaction. On the sample chart, keep the pre-drawn line, labeled as part of the worked example.

**U-6 - S3 `[UX]` -- Single 34-day window, no cycle navigation**
`:1434`. `slice(-34)` shows one rolling window; earlier cycles become unreachable, and a long cycle truncates its own start.
**Recommendation:** paginate by cycle (the data model already detects cycle starts) with a cycle picker; horizontal scroll within a cycle.

**V-3 - S3 `[Visual]` `[Method]` -- The chart doesn't look like a FAM chart**
The BBT graph and the day strip are separated, and mucus appears only as small colored dots + code letters (`:1578-1581`). Students of the method learn on stamp-style paper charts where temperature and mucus rows align per column.
**Recommendation:** classic chart anatomy, digitized: aligned columns of cycle day -> bleeding -> mucus stamp -> BBT point, so the "double-check" is *visible* as vertical alignment. This is the single biggest teaching win available in the chart.

**A-5 - S2 `[A11y]` -- Chart is invisible to assistive tech**
The SVG has no `role`, `<title>`, or text alternative; the only tooltips are `title` attributes (`:1579`), unreliable on touch.
**Recommendation:** `role="img"` + generated summary, and make the day strip (real HTML) the accessible data table.

### Onboarding, navigation & app shell

**U-1 - S2 `[UX]` `[Copy]` -- Broken promises: no settings, goal is decorative, no returning-user resume**
Onboarding says *"You can change this anytime"* (`:1177`) -- but no settings screen exists anywhere; the stored `goal` is never read; `onboarded` is stored (`:795`) but never gates routing, so every launch lands on the marketing landing page. `showTip` state is declared and never used (`:790`).
**Recommendation:** returning users boot straight to Today. Add a Settings screen: change goal (and have goal actually tailor copy, e.g., conservative framing for avoidance), units, clear sample data, export, delete-all, theme.

**U-2 - S2 `[UX]` `[Tech]` -- Privacy-first positioning with no data controls**
The app's whole trust story is "your data stays on your device" -- yet there is no export, no delete, no way to clear the pre-loaded sample cycle, and localStorage can be silently wiped by the OS/browser with no backup path.
**Recommendation:** export (JSON + shareable chart image/PDF for practitioners -- see N-6), explicit delete-everything, and a "your data lives only on this device -- back it up" moment in onboarding and settings.

**IA-1 - S3 `[IA]` -- Marketing and app share one surface**
The landing page (hero, comparison tables, SEO articles) lives inside the app shell; the nav bar hides on landing/onboarding/wizard/article, so users bounce between "website mode" and "app mode" unpredictably.
**Recommendation:** treat landing as the website; the installed app opens to Today. Articles remain in-app as the Library.

### Learn / lessons

**P-3 - S2 `[Pedagogy]` -- Lessons are 100% passive reading**
`WIZARD_MODULES` (`:691-736`): every step is heading + paragraphs + tip; the only interaction is Next. The mucus module ends "Let's practice!" -- and then just points at the tracker. Nothing checks understanding of Peak Day retrospective identification, the most error-prone concept in the method.
**Recommendation:** add knowledge checks (1 question per lesson), sorting/flash-card interactions for the sensation/appearance vocabularies, and hands-on drills against the sample chart (see N-2). Completion should mean *demonstrated*, not *scrolled*.

**P-4 - S3 `[Pedagogy]` -- The excellent sample cycle is underused as a teaching object**
`SAMPLE` (`:739-775`) is a narrated, textbook cycle -- the app's best asset -- but it's only encountered passively as pre-filled chart data, and it can't be toggled or revisited as "the worked example" once cleared.
**Recommendation:** promote it to a first-class "Example cycle" viewable any time from Learn, with a guided walkthrough (step through Point of Change -> Peak -> shift -> double-check).

**P-5 - S3 `[Pedagogy]` `[Method]` -- No support for the method's counting work**
The method requires counting: Peak+4, three high temps, 6 pre-shift temps for the coverline, the 3-cycle learning commitment. The app supports none of these as user-driven tools -- users count in their heads.
**Recommendation:** user-initiated counters (started by *their* marks): mark Peak -> the chart annotates +1...+4; a "my BIP" note the user writes for themselves; a cycles-charted progress marker toward the 3-cycle commitment.

**U-7 - S4 `[UX]` -- Lesson completion is all-or-nothing per module**
Mid-module progress (`wizStep`) isn't persisted; leaving a 6-step module loses your place.
**Recommendation:** persist per-step progress; show it on the hub cards.

### Articles

**C-1 - S4 `[Copy]` `[IA]` -- Strong content, weak reading experience**
14 cited articles are a genuine asset, but the reader is a plain scroll with 24px titles, no reading progress, no in-article navigation for 10-minute pieces, and citations are non-interactive superscripts (`:1640-1645`, via `dangerouslySetInnerHTML` -- safe with static content, but flag if content ever becomes dynamic).
**Recommendation:** proper editorial reader (serif body is right -- keep it), tappable citations that reveal the source inline, related-lesson links.

### Cross-cutting: accessibility (weakest area)

**A-1 - S2 `[A11y]` -- Zoom disabled**
`index.html:5`: `maximum-scale=1.0, user-scalable=no`. WCAG 1.4.4 failure; particularly hostile in a text-dense health app.
**Recommendation:** remove both; use 16px inputs (already done) to prevent iOS auto-zoom.

**A-2 - S2 `[A11y]` -- Zero ARIA/semantic labeling**
No `aria-*`, `role`, `alt`, `<label>`, or `htmlFor` anywhere in ~1700 lines. Pills, toggles, and accordions expose no selected/expanded state to screen readers.
**Recommendation:** `aria-pressed` on toggles, `aria-expanded` on disclosure, labeled inputs, landmarks.

**A-3 - S2 `[A11y]` `[Visual]` -- Widespread contrast failures at tiny sizes**
Muted taupe on cream everywhere: `#B8A898` on `#FDFAF6` (~2.2:1) at 8-13px for labels, captions, axis text; gold `#C4A882` italic helpers are worse. Well below WCAG AA.
**Recommendation:** rebuild the palette with tokens that pass 4.5:1 for body/labels; reserve low-contrast only for truly decorative elements.

**A-4 - S3 `[A11y]` -- Sub-44px touch targets**
Option pills (8px vertical padding, 12-13px text), nav tabs, the Disturbed toggle, date arrows, blog filter pills.
**Recommendation:** 44px minimum hit areas (visual size can stay smaller with padding).

**A-7 - S3 `[A11y]` `[Visual]` -- No dark mode**
For an app meant to be used at 6 a.m. with a thermometer in hand, a bright cream screen is a real usability miss -- and dark mode is table stakes for a modern iOS app.
**Recommendation:** full dark theme (the redesign makes it the hero).

### Cross-cutting: visual system & tech

**V-1 - S3 `[Visual]` -- No design tokens; inline hex everywhere**
~40 hardcoded hex values scattered through inline styles; the `<style>` block defines 10 utility classes and everything else is per-element. Any systematic change (contrast, dark mode) is currently a 1700-line find-and-replace.
**Recommendation:** CSS custom properties for color/type/spacing/radius/elevation; components consume tokens only.

**V-2 - S4 `[Visual]` -- Unicode glyphs as iconography**
glyph icons (circle, grid, sparkle, paragraph, star, arrow, slashed-circle) render inconsistently across platforms and read as placeholder.
**Recommendation:** small inline SVG icon set (moon-phase motif fits the brand).

**T-1 - S2 `[Tech]` -- The app is hand-triplicated and already drifting**
`lunachart-v2.jsx` (154,295 B) vs `index.html` (153,946 B) vs the iOS copy -- three hand-synced copies of the same ~1700 lines. Every fix must be made three times; they already differ.
**Recommendation:** single source with a trivial build step (even a copy script) that stamps the JSX into both HTML shells; bump `sw.js` `CACHE_NAME` on release.

**T-2 - S4 `[Tech]` -- Runtime Babel + CDN dependencies**
In-browser transpilation on every load (slow first paint on older phones); React/Babel from unpkg are a network dependency the service worker only partially shields.
**Recommendation:** acceptable for a prototype; pre-transpile when convenient. Not urgent.

---

## What the app could become -- teaching & community recommendations

These extend the app's philosophy rather than bending it. The rule that keeps everything safe: **the app may check your answers on practice charts and count things you initiated -- it never interprets your real chart.**

**N-1 -- Interactive knowledge checks (in lessons)**
One question per lesson step-group, e.g. "It's Tuesday. Monday had egg-white 3+cm; today is tacky. When was Peak Day?" Completion = demonstrated understanding. *(Addresses P-3.)*

**N-2 -- Chart-reading practice drills**
A drill library of practice cycles -- textbook, delayed ovulation, double peak, disturbed temps, ambiguous cell slough. The learner marks Peak Day / Point of Change or places the coverline; the app checks against the taught rules and explains. This is where "the user is the algorithm" becomes trainable skill, on charts where being wrong is free. *(Addresses P-3, P-2.)*

**N-3 -- Guided first-cycle mode**
Day-by-day companionship for cycles 1-3: "this week you're just learning what dry feels like," micro-prompts tied to cycle phase, celebrating the first self-spotted Point of Change, progress toward the 3-cycle commitment. *(Addresses P-5.)*

**N-4 -- Cycle review ritual**
When a new cycle starts, a short guided reflection over the completed chart: Where was your Point of Change? Did your BIP hold? What do you want to ask your practitioner? Saves a per-cycle summary -- this becomes the multi-cycle story over time. *(Addresses P-4, P-5.)*

**N-5 -- Glossary**
Every method term (BIP, coverline, cell slough, double-check, luteal phase...) defined once, searchable, and tappable in context from lessons, tracker, and chart.

**N-6 -- Practitioner share/export**
One-tap export of a clean chart (image/PDF) + JSON backup, generated on-device, via the iOS share sheet. Directly serves the HRHP-centered community model the app already advocates -- the app becomes the bridge to practitioners, not a replacement. *(Addresses U-2.)*

**N-7 -- Questions-for-my-practitioner list**
Anywhere in the app, "flag this for my practitioner" -- collects day-stamped questions into a list that rides along with the export. Turns confusion into curriculum.

**Community positioning:** LunaChart can be the *on-ramp app of the FAM teaching community* -- the tool practitioners recommend for students' first three cycles precisely because it refuses to interpret. Practice drills double as teaching aids practitioners can assign; exported charts are the shared artifact of instruction; honest graduate-to-Read-Your-Body positioning stays.

---

## Traceability -- audit -> redesign mockups

| Finding | Addressed in mockup |
|---|---|
| P-1 verdict banner | Screen 1 (Today) -- observation-summary banner, user-mark framing |
| P-2 coverline | Screen 3 (Chart) -- user-drawn coverline concept; Screen 8 (Drill) |
| P-3 passive lessons | Screen 5 (Lesson + knowledge check), Screen 8 (Drills) |
| P-4 sample cycle underused | Screen 3 (worked-example chart), Screen 9 (Cycle review) |
| P-5 no counting support | Screen 1 (Peak+n count chip), Screen 7 (First-cycle mode) |
| U-1 no settings/resume | Screen 11 (Settings & export) |
| U-2 no data controls | Screen 11 (export, delete, sample-data clear) |
| U-3 unguarded Peak/PoC | Screen 1 + confirm-sheet pattern |
| U-4 accordion friction | Screen 1 (grouped cards + summary rows), Screen 2 (mucus sheet) |
| U-5 no undo | Screen 1 ("Saved - Undo" toast pattern, noted in caption) |
| U-6 single window | Screen 3 (cycle picker) |
| V-1/V-2/A-3/A-7 | Foundations strip -- token palette (AA-checked), SVG icon set, dark hero theme |
| A-1/A-2/A-4/A-5/A-6 | All screens -- 44px targets, semantic structure notes in captions |
| V-3 not-a-FAM-chart | Screen 3 -- aligned stamp-row chart anatomy |
| IA-1 marketing/app blend | Screen flow notes -- app boots to Today |
| N-1...N-7 | Screens 5, 7, 8, 9, 10, 11 (marked NEW) |

*(T-1/T-2 are build-phase items, not mockup items.)*

---

## Strengths to preserve (do not lose these in any redesign)

- Method content that is accurate, conservative, and honest about evidence limits, with real citations.
- The 4-day Justisse count and double-check taught correctly; Cycle Day 1 defined correctly and matched by `getCycleDay`.
- Teach-before-track flow and contextual lesson prompts inside the tracker.
- Honest competitive positioning ("graduating to Read Your Body is a success, not a failure").
- Repeated, well-placed disclaimers; practitioner-first framing.
- Local-only privacy architecture.
- The narrated sample cycle.
