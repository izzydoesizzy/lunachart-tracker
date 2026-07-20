# LunaChart

**A mobile-first fertility awareness tracker built on the Justisse Method — redesigned in the "Lunar" design language.**

LunaChart is an educational tool and daily charting app that teaches the Justisse Method of Fertility Awareness — a secular, science-based symptothermal method founded in 1987 by Geraldine Matus. It combines interactive lessons, chart-reading practice drills, a detailed biomarker tracker, and an evidence-based article library.

> **Important:** LunaChart is an educational tool and observation recorder, not a medical device, contraceptive, or replacement for professional instruction. It is not FDA-cleared. It is not affiliated with Justisse College International. If you are charting for pregnancy avoidance, work with a trained Justisse HRHP — find one at [justisse.ca](https://justisse.ca/chart-your-cycle/).

## Live Demo

[https://izzydoesizzy.github.io/lunachart-tracker/](https://izzydoesizzy.github.io/lunachart-tracker/)

## What It Does

- **Teaches before it tracks** — 5 lesson modules with practitioner tips and knowledge checks, 6 chart-reading drills (find Peak Day, spot the Point of Change, delayed ovulation, double peak, disturbed temps, cell slough vs. change), a searchable glossary, and a narrated worked-example cycle.
- **Records three biomarkers** — cervical mucus (Justisse's sensation + appearance + stretch), BBT with disturbed-temperature flagging, cervical position — plus bleeding, notes, and per-day practitioner flags.
- **A real FAM chart** — temperature dots, moon-stamp mucus row, and bleeding aligned per column; per-cycle pagination; a **coverline you draw yourself** (drag or arrow keys). The app never draws one for you.
- **Mirrors, never interprets** — the Today banner restates what *you* recorded and marked. Marking Peak Day is a deliberate, confirmed act that starts *your* 4-day count. No fertility verdicts, ever.
- **Guided first cycle** — phase-aware focus cards, a daily practice checklist, and 3-cycle commitment progress during cycles 1–3.
- **Cycle review ritual** — when a cycle closes, five minutes of reflection plus your flagged questions, saved as your cycle history.
- **Your data, actually yours** — local-only storage, JSON backup, practitioner chart export (PNG, generated on device), and delete-everything. Night + Day themes, °C/°F, changeable goal.

## What It Does NOT Do

No fertile/infertile predictions. No automatic chart interpretation (no auto coverlines, no auto Peak detection). No practitioner replacement. No accounts, no cloud, no notifications.

## Architecture

React 18 (vendored, no CDN) + system fonts. **No network dependencies at all** — the app is fully offline on web (service worker) and iOS (WKWebView).

```
src/                  ← THE source of truth. Edit here only.
  styles/             tokens.css (Lunar design tokens) + app.css
  content/            articles, lessons + quizzes, drills, glossary,
                      first-cycle cards, the sample cycle
  core.js             storage, dates, cycle derivation, migration, units
  ui.jsx, chart.jsx   primitives, overlays, the FAM chart generator
  screens/            today, chart, learn, drills, glossary, review,
                      settings, onboard, library, landing
  app.jsx             root state, routing, persistence
shells/               web.html, ios.html, sw.js templates
vendor/               react, react-dom (UMD) + babel (build-time only)
build.mjs             zero-dependency build script
index.html            ← BUILD ARTIFACT (GitHub Pages entry). Never hand-edit.
ios/…/WebAssets/      ← BUILD ARTIFACT (iOS bundle). Never hand-edit.
```

### Building

```bash
node build.mjs   # transpiles src/ (build-time Babel, no npm install needed)
                 # → index.html, ios/…/WebAssets/index.html, sw.js
```

Commit the regenerated artifacts together with your `src/` changes. The service-worker cache key is a content hash, so deploys invalidate cleanly.

### iOS

`ios/LunaChart` is a SwiftUI WKWebView wrapper (xcodegen project). It loads the built `WebAssets/index.html` fully offline and adds a native share sheet for exports via a `share` message handler. Generate the project with `xcodegen` and build in Xcode.

## Data & migration

All data lives in `localStorage` under `lc-*` keys (schema v2). Upgrading from v1 removes the previously pre-seeded sample cycle from user data (any day you edited survives); the sample now lives as a worked example only. **Cycle Day 1 is the first full-flow day** — spotting no longer starts a cycle, matching the taught rule.

## Design decisions

- **Why no algorithm?** The Justisse Method's core philosophy is that the user IS the algorithm. The redesign enforces this in software: drills check your calls on practice charts; your real chart is never interpreted.
- **Why local-only?** Fertility data is sensitive. No accounts, no servers — and now with export/delete so the promise has a UI.
- **Why moon stamps?** Classic FAM paper charts use stamps. Moon phases (new = dry → full = peak) make the chart's story readable at a glance — and the moon was in the name all along.

## Sources & References

- Duane, M., et al. (2022). Fertility Awareness-Based Methods for Women's Health. *Frontiers in Medicine*, 9, 858977.
- Peragallo Urrutia, R., et al. (2018). Effectiveness of FABMs for Prevention of Pregnancy. *Obstetrics & Gynecology*, 132(3), 591-604.
- Frank-Herrmann, P., et al. (2007). The effectiveness of a fertility awareness based method. *Human Reproduction*, 22(5), 1310-1319.
- ACOG Committee Opinion No. 651 (2015). Using the Menstrual Cycle as a Vital Sign.
- Matus, G. (2012). Justisse Method: Fertility Awareness and Body Literacy — A User's Guide.

## License

Independent educational project. The Justisse Method is a trademark of Justisse College International; LunaChart is not affiliated with or endorsed by it.
