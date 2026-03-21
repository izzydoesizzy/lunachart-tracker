import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════
   LUNACHART — Justisse Method Fertility Tracker
   Skills-teaching · Mobile-first · Privacy-first
   ═══════════════════════════════════════════════ */

// ─── Storage ───
const STO = {
  get: async (k) => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } },
  set: async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} },
};

// ─── Constants ───
const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const td = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const fmtD = (s) => { if(!s)return""; const [y,m,d]=s.split("-"); return `${MO[+m-1]} ${+d}`; };
const fmtFull = (s) => { if(!s)return""; const [y,m,d]=s.split("-"); return `${MO[+m-1]} ${+d}, ${y}`; };
const diffD = (a,b) => Math.floor((new Date(b)-new Date(a))/864e5);

const SENS = [
  { id:"D0", label:"Dry", desc:"No moisture felt when wiping", color:"#B8A88A", fertile:false, icon:"○" },
  { id:"M", label:"Moist", desc:"Slight dampness on tissue", color:"#C9A96E", fertile:true, icon:"◔" },
  { id:"W", label:"Wet", desc:"Distinct wetness felt", color:"#6BA3B5", fertile:true, icon:"◑" },
  { id:"SL", label:"Slippery", desc:"Lubricative, paper glides", color:"#4A8FA0", fertile:true, icon:"●" },
];
const APPEAR = [
  { id:"N", label:"Nothing", desc:"No visible mucus", color:"#C4B89A" },
  { id:"CS", label:"Cell slough", desc:"Pasty, crumbly, white/yellow on underwear", color:"#D4C5A9" },
  { id:"TK", label:"Tacky", desc:"Sticky, breaks when stretched", color:"#C9A96E" },
  { id:"CR", label:"Creamy", desc:"White, lotion-like consistency", color:"#DDD0B8" },
  { id:"CL", label:"Clear", desc:"Translucent, see-through", color:"#6BA3B5" },
  { id:"EW", label:"Egg-white", desc:"Clear, stretchy, slippery", color:"#4A8FA0" },
  { id:"WA", label:"Watery", desc:"Thin, watery, transparent", color:"#5B98AA" },
];
const STRETCH = [
  { id:"0", label:"None" },
  { id:"B", label:"Breaks apart" },
  { id:"1", label:"< 1 cm" },
  { id:"3", label:"1–3 cm" },
  { id:"3+", label:"3+ cm" },
];
const CERVPOS = [{ id:"L",label:"Low" },{ id:"M",label:"Mid" },{ id:"H",label:"High" }];
const CERVTEX = [{ id:"F",label:"Firm" },{ id:"M",label:"Medium" },{ id:"S",label:"Soft" }];
const CERVOP = [{ id:"C",label:"Closed" },{ id:"P",label:"Partial" },{ id:"O",label:"Open" }];
const BLEED = [
  { id:"none",label:"None",color:"transparent",dots:0 },
  { id:"spot",label:"Spotting",color:"#D4756B",dots:1 },
  { id:"light",label:"Light",color:"#C25A50",dots:2 },
  { id:"med",label:"Medium",color:"#A63D3D",dots:3 },
  { id:"heavy",label:"Heavy",color:"#8B2525",dots:4 },
];

// ──────────────────────────────────────────────
// ARTICLES — Full SEO/GEO content with citations
// ──────────────────────────────────────────────
const ARTICLES = [
  {
    id:"what-is-justisse", cat:"Method Education", time:"12 min",
    for:"Beginners exploring natural fertility awareness",
    title:"What Is the Justisse Method? A Complete Guide to Science-Based Fertility Awareness",
    excerpt:"The Justisse Method teaches you to observe three biomarkers — cervical mucus, basal body temperature, and cervical position — to understand your fertility in real time, without hormones or algorithms.",
    kw:"justisse method, fertility awareness method, FAM, symptothermal method, body literacy, cervical mucus tracking, natural birth control",
    body:`The Justisse Method is a symptothermal fertility awareness method (FAM) founded in 1987 by Geraldine Matus, a Canadian practitioner whose work draws on midwifery, naturopathic medicine, and feminist health advocacy.[1] Unlike period prediction apps or the outdated rhythm method, Justisse teaches you to observe and interpret real-time biomarkers of fertility — primarily cervical mucus, basal body temperature (BBT), and optionally cervical position.[2]

**A Secular, Inclusive Approach**

One of Justisse's defining characteristics is that it is entirely secular.[1] While many fertility awareness methods have roots in religious natural family planning traditions, Justisse was developed specifically to serve all people regardless of ideology, offering reproductive health education grounded in science rather than doctrine.[3] The method can be used for four distinct purposes: body literacy (simply understanding your cycle), birth control, pregnancy achievement, or monitoring menstrual cycle health.[1]

**The Three Biomarkers**

Cervical mucus is the primary biomarker and the one Justisse places the most emphasis on. Produced by the cervix under the influence of rising estrogen, mucus changes in sensation, appearance, and stretchiness throughout the cycle — providing real-time, same-day information about fertility status.[2] The Justisse system uses a uniquely detailed categorization: you record sensation (dry, moist, wet, or slippery), appearance (nothing, cell slough, tacky, creamy, clear, egg-white, or watery), and stretchiness as three separate qualities.[4]

Basal body temperature (BBT) is your resting core temperature, taken each morning before any activity. After ovulation, progesterone causes a sustained temperature rise of roughly 0.2–0.5°C. This shift confirms that ovulation has already occurred — it cannot predict it in advance.[2]

Cervical position is an optional third biomarker. The cervix changes in height, texture, and openness throughout the cycle, moving higher, softer, and more open as ovulation approaches.[5]

**How the Fertile Window Is Identified**

In the Justisse system, your fertile window opens at your "point of change" — the first observation that differs from your Basic Infertile Pattern (BIP), your personal baseline of non-fertile observations.[4] The window closes on the evening of the fourth day after Peak Day (the last day of peak-quality mucus), provided the BBT shift has also been confirmed.[6] This "double-check" — requiring both mucus and temperature confirmation — is what makes symptothermal methods among the most effective forms of fertility awareness.[2]

**Effectiveness**

Research on symptothermal methods shows perfect-use effectiveness rates between 97.6% and 99.6%, with typical-use rates between 86.8% and 98.2%.[7][8] While no independent study has been conducted specifically on the Justisse Method, its guidelines are consistent with the symptothermal methods that have been evaluated, and its effectiveness is expected to fall within these ranges.[6]

**The Practitioner Model**

Justisse strongly recommends learning with a trained Holistic Reproductive Health Practitioner (HRHP), a graduate of Justisse College International.[3] These practitioners provide personalized chart reviews, one-on-one guidance, and support through the recommended minimum three-cycle learning period.[1] This practitioner-guided model is a key differentiator from self-taught approaches and algorithm-dependent apps.`,
    sources:[
      { n:1, t:"Matus, G. (2012). Justisse Method: Fertility Awareness and Body Literacy — A User's Guide. Justisse-Healthworks for Women.", u:"https://www.amazon.com/Justisse-Method-Fertility-Awareness-Literacy/dp/1469959267" },
      { n:2, t:"Duane, M., Stanford, J.B., Porucznik, C.A., & Vigil, P. (2022). Fertility Awareness-Based Methods for Women's Health and Family Planning. Frontiers in Medicine, 9, 858977.", u:"https://pmc.ncbi.nlm.nih.gov/articles/PMC9171018/" },
      { n:3, t:"Justisse College International. (2025). College Program — HRHP Training. justisse.ca.", u:"https://justisse.ca/college-program/" },
      { n:4, t:"Hartwig, C. (2024). Justisse Method Guide. Tempdrop Resources.", u:"https://www.tempdrop.com/blogs/resources/justisse-method-guide" },
      { n:5, t:"Choice Fertility. (2024). Fertility Awareness — The Justisse Method. choice-fertility.com.", u:"https://www.choice-fertility.com/fertility-awareness" },
      { n:6, t:"Justisse College International. (2023). Addendum to the User's Guide. justisse.ca.", u:"https://justisse.ca/wp-content/uploads/2023/08/2023-Addendum-to-the-Users-Guide.pdf" },
      { n:7, t:"Peragallo Urrutia, R., et al. (2018). Effectiveness of Fertility Awareness–Based Methods for Prevention of Pregnancy. Obstetrics & Gynecology, 132(3), 591–604.", u:"https://pubmed.ncbi.nlm.nih.gov/29995717/" },
      { n:8, t:"Frank-Herrmann, P., et al. (2007). The effectiveness of a fertility awareness based method to avoid pregnancy. Human Reproduction, 22(5), 1310–1319.", u:"https://pubmed.ncbi.nlm.nih.gov/17314078/" },
    ]
  },
  {
    id:"fam-not-rhythm", cat:"Myth Busting", time:"9 min",
    for:"Skeptics, healthcare providers, curious partners",
    title:"Fertility Awareness Is NOT the Rhythm Method — Here's the Science That Proves It",
    excerpt:"The rhythm method predicted ovulation from calendar math. Modern FAMs like Justisse track real-time biomarkers. The difference in accuracy is staggering.",
    kw:"rhythm method vs FAM, fertility awareness accuracy, natural family planning effectiveness, is FAM effective, FAM vs calendar method",
    body:`If you mention fertility awareness to most people — including many doctors — the immediate reaction is skepticism rooted in confusion with the rhythm method. This conflation is understandable historically but scientifically inaccurate, and it leaves millions of people without access to a legitimate, evidence-based contraceptive option.[1]

**The Rhythm Method: What It Actually Was**

The rhythm method (also called the Ogino-Knaus method) emerged in the 1930s from the observation that ovulation tends to occur approximately 14 days before menstruation.[2] Users calculated their predicted fertile window by subtracting fixed numbers from their shortest and longest recent cycle lengths. The critical flaw was assuming that past cycle regularity predicted future ovulation timing — which it often doesn't.[1]

Calendar-based methods carry a typical-use failure rate of approximately 12–25%, depending on the specific calculation used.[3] This poor performance gave natural methods a lasting reputation for unreliability.

**What Changed: Real-Time Biomarker Tracking**

Modern fertility awareness-based methods (FABMs) like the Justisse Method don't predict anything — they observe what is actually happening in the body on each given day.[4] Cervical mucus changes in response to rising estrogen days before ovulation, providing a real-time signal that fertility is approaching.[1] A sustained rise in BBT confirms after the fact that ovulation has passed.[2]

This observation-based approach adapts automatically to every cycle, regardless of length or regularity. Whether you ovulate on day 12, day 22, or day 40, the biomarkers tell you where you are.[4]

**The Numbers**

Symptothermal methods (combining mucus and temperature) show perfect-use effectiveness of 97.6–99.6% and typical-use effectiveness of 86.8–98.2%.[3][5] The strongest evidence comes from a German prospective study of the Sensiplan method, which found a perfect-use Pearl Index of 0.4 (99.6% effective) across 17,638 cycles.[5]

For context, combined oral contraceptives have a typical-use failure rate of approximately 7%, and condoms approximately 13%.[6] Well-taught symptothermal methods are competitive with — and in perfect use can exceed — hormonal contraception.

**Why Doctors Don't Know This**

Research shows that only 4% of physicians have received any formal training in FABMs, and only 6% have correct knowledge about their effectiveness.[1] Medical curricula overwhelmingly focus on pharmaceutical and device-based contraception, leaving a significant knowledge gap that perpetuates outdated misconceptions about fertility awareness.[2]

**The Vital Sign Recognition**

The American College of Obstetricians and Gynecologists has recognized the menstrual cycle as a "fifth vital sign" — an indicator of overall health that deserves monitoring and clinical attention, just like heart rate or blood pressure.[7] This recognition aligns with the FAM philosophy that understanding your cycle is a form of fundamental health literacy, not a fringe practice.`,
    sources:[
      { n:1, t:"Duane, M., Stanford, J.B., et al. (2022). Fertility Awareness-Based Methods for Women's Health and Family Planning. Frontiers in Medicine, 9, 858977.", u:"https://pmc.ncbi.nlm.nih.gov/articles/PMC9171018/" },
      { n:2, t:"FACTS About Fertility. (2025). Types of FABMs. factsaboutfertility.org.", u:"https://www.factsaboutfertility.org/what-is-charting/types-of-fabms/" },
      { n:3, t:"Peragallo Urrutia, R., et al. (2018). Effectiveness of Fertility Awareness–Based Methods. Obstetrics & Gynecology, 132(3), 591–604.", u:"https://pubmed.ncbi.nlm.nih.gov/29995717/" },
      { n:4, t:"Justisse College International. (2025). Chart Your Cycle. justisse.ca.", u:"https://justisse.ca/chart-your-cycle/" },
      { n:5, t:"Frank-Herrmann, P., et al. (2007). Effectiveness of a fertility awareness based method. Human Reproduction, 22(5), 1310–1319.", u:"https://pubmed.ncbi.nlm.nih.gov/17314078/" },
      { n:6, t:"Trussell, J. (2011). Contraceptive failure in the United States. Contraception, 83(5), 397–404.", u:"https://pubmed.ncbi.nlm.nih.gov/21477680/" },
      { n:7, t:"ACOG Committee Opinion No. 651 (2015). Menstruation in Girls and Adolescents: Using the Menstrual Cycle as a Vital Sign.", u:"https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2015/12/menstruation-in-girls-and-adolescents-using-the-menstrual-cycle-as-a-vital-sign" },
    ]
  },
  {
    id:"coming-off-pill", cat:"Transition Guide", time:"11 min",
    for:"People aged 20–35 leaving hormonal birth control",
    title:"Coming Off the Pill? Your Complete Guide to Charting After Hormonal Birth Control",
    excerpt:"Your first post-pill cycles can be confusing. Here's exactly what to expect, when to start charting, and why the Justisse Method handles this transition better than any app.",
    kw:"coming off birth control, post pill cycle, stopping hormonal contraception, FAM after pill, irregular cycles after birth control, Justisse postpill",
    body:`The decision to stop hormonal birth control is increasingly common — driven by concerns about side effects, a desire for body autonomy, or simply wanting to understand natural cycles. But the transition period can feel disorienting, and this is precisely when prediction-based apps are least reliable.[1]

**What Happens When You Stop**

Hormonal contraceptives work by suppressing the hypothalamic-pituitary-ovarian (HPO) axis — the communication pathway between your brain and ovaries that orchestrates ovulation.[2] When you stop, this axis needs time to re-establish normal signaling. Some people ovulate within the first cycle off hormones; others may take 3–6 months or longer, particularly after long-term use of injectable contraceptives like Depo-Provera.[2]

Your first bleed after stopping is typically a "withdrawal bleed" — caused by hormone withdrawal rather than by the natural progesterone drop that follows ovulation.[3] This means your first "period" isn't a true menstruation, and it tells you nothing about whether or when you'll ovulate.

**Why Apps Fail During This Phase**

Period prediction apps rely on historical cycle data to forecast future patterns. When you're coming off hormonal contraception, you have no recent natural cycle history — only artificially regular pill bleeds that bear no relationship to your body's natural rhythm.[1] An app that predicts "ovulation on day 14" based on your pill-bleed history could be dangerously wrong.

Even temperature-only apps like Natural Cycles assign many cautious "red days" during this transition because their algorithms lack sufficient data, which can be frustrating for users.[4]

**Why Justisse Excels Here**

The Justisse Method works from day one because it observes what is happening rather than predicting what should happen.[5] You can begin charting the day after your last active pill (or the day your patch/ring is removed) by taking your BBT and observing cervical mucus at each bathroom visit.

During the transition, a Justisse practitioner can help you distinguish between fertile cervical mucus (indicating approaching ovulation), non-fertile discharge (common during hormonal adjustment), and cell slough (which may be more prominent during this period).[3]

**What to Expect: A Realistic Timeline**

Cycles 1–2 after stopping may feature irregular bleeding, confusing mucus patterns, or anovulatory cycles (cycles where no ovulation occurs). Chart everything without judgment — this data is valuable even when the patterns don't yet look textbook.[3]

Cycles 3–6 typically show emerging patterns. Most people begin identifying their Basic Infertile Pattern and recognizing the point-of-change that signals fertility.[5]

Cycles 6+ with consistent charting and practitioner support, most users have sufficient skill and cycle data to chart confidently, whether for avoidance or achievement.[5]

**The Conservative Approach**

During the learning phase — and especially during the post-hormonal transition — the Justisse guidelines are deliberately conservative.[3] You may have more days categorized as "potentially fertile" than you will once patterns are established. This conservatism is a feature, not a bug: it protects you while your body (and your observational skills) are still calibrating.

**Specific Considerations by Contraceptive Type**

After combined pills, patches, or rings, most people see a return to ovulation within 1–3 cycles. After hormonal IUDs (like Mirena), the timeline is similar, though localized effects on cervical mucus may take slightly longer to resolve. After Depo-Provera injections, return to fertility can take 6–18 months, and charting during this extended transition requires particular patience and practitioner guidance.[2]`,
    sources:[
      { n:1, t:"Moglia, M.L., et al. (2016). Evaluation of Smartphone Cycle Tracking Applications. Obstetrics & Gynecology, 127(6), 1153–1160.", u:"https://pubmed.ncbi.nlm.nih.gov/27159760/" },
      { n:2, t:"Duane, M., Stanford, J.B., et al. (2022). Fertility Awareness-Based Methods for Women's Health and Family Planning. Frontiers in Medicine, 9, 858977.", u:"https://pmc.ncbi.nlm.nih.gov/articles/PMC9171018/" },
      { n:3, t:"Matus, G. (2012). Justisse Method: Fertility Awareness and Body Literacy — A User's Guide.", u:"https://www.amazon.com/Justisse-Method-Fertility-Awareness-Literacy/dp/1469959267" },
      { n:4, t:"Fertility Awareness Project. (2025). Choosing Apps and Thermometers. fertilityawarenessproject.ca.", u:"https://fertilityawarenessproject.ca/blog/choosing-apps-and-thermometers" },
      { n:5, t:"Justisse College International. (2025). Chart Your Cycle. justisse.ca.", u:"https://justisse.ca/chart-your-cycle/" },
    ]
  },
  {
    id:"apps-get-it-wrong", cat:"Technology", time:"10 min",
    for:"Current app users frustrated with inaccurate predictions",
    title:"Why Most Fertility Apps Get Your Fertile Window Wrong — and What Actually Works",
    excerpt:"A 2016 study found most fertility apps inaccurately predicted the fertile window. Here's why prediction fails, and how observation-based charting delivers real accuracy.",
    kw:"fertility app accuracy, best fertility app, Natural Cycles accuracy, period tracker accuracy, FAM app comparison, fertility prediction wrong",
    body:`The femtech industry has exploded — by 2016, over 200 million women were using menstrual tracking applications.[1] But a critical question often goes unasked: are these apps actually accurate?

**The Research Is Damning**

Two landmark 2016 studies evaluated dozens of fertility tracking apps and found that the vast majority were inaccurate at predicting the fertile window.[1][2] Most apps used calendar calculations — essentially digital rhythm methods dressed in modern interfaces. They predicted ovulation based on averages (typically assuming day 14 of a 28-day cycle) or on past cycle lengths, neither of which reliably indicates when ovulation actually occurs in any given cycle.[3]

A 2024 review from the American College of Obstetricians and Gynecologists (ACOG) examined popular cycle tracking apps and explicitly stated that the apps evaluated should not be used as primary tools for pregnancy prevention or achievement.[3]

**Temperature-Only Apps: Better but Incomplete**

Natural Cycles, the first FDA-cleared "digital contraceptive," uses a proprietary BBT algorithm to classify days as "red" (potentially fertile) or "green" (not fertile).[4] This is more scientifically grounded than calendar prediction, but temperature has a fundamental limitation: it can only confirm ovulation after it has already happened.[5] It cannot detect the approach of fertility in real time.

To compensate for this blind spot, the algorithm assigns conservative "red days" early in the cycle — often 10 or more per cycle.[6] This means fewer usable "green days" than many users expect. And for anyone with irregular cycles, disrupted sleep, or post-hormonal transitions, the algorithm's predictions become even less reliable.

**The Core Problem: Predictions vs. Observations**

The fundamental philosophical divide in fertility tracking is between prediction (what an algorithm thinks should happen based on past data) and observation (what your body is actually doing today).[7]

Cervical mucus provides real-time, same-day information about estrogen activity and approaching fertility. No algorithm can replicate this signal because it's unique to each cycle and responsive to factors (stress, illness, travel) that no app can measure.[5]

**What a Good Charting Tool Looks Like**

A genuine fertility charting app should record your observations without overriding them with predictions, support manual identification of peak day, coverline, and temperature shift, not claim to evaluate your fertility status for you, allow customizable categories for your chosen method, and not lock your data behind subscriptions.[6]

Apps like Read Your Body follow these principles — functioning as a recording and visualization tool rather than a prediction engine.[8] The Justisse Method can be charted with Read Your Body or with paper charts, because the intelligence lives in your observations and method knowledge, not in software.

**The Bottom Line**

An algorithm cannot replace awareness, just as an app cannot substitute an experienced teacher.[7] If you want genuine accuracy in fertility identification, you need to learn to observe your body's signals — and use technology as a convenient notebook, not a crystal ball.`,
    sources:[
      { n:1, t:"Moglia, M.L., et al. (2016). Evaluation of Smartphone Cycle Tracking Applications. Obstetrics & Gynecology, 127(6), 1153–1160.", u:"https://pubmed.ncbi.nlm.nih.gov/27159760/" },
      { n:2, t:"Duane, M., et al. (2016). Fertility Awareness-Based Methods for Natural Family Planning. J Am Board Fam Med, 29(4), 508–511.", u:"https://pubmed.ncbi.nlm.nih.gov/27256939/" },
      { n:3, t:"Natural Womanhood. (2024). New Cycle Tracking App Study Risks Misleading Many.", u:"https://naturalwomanhood.org/new-cycle-tracking-app-study-risks-misleading-many/" },
      { n:4, t:"FDA. (2018). De Novo Classification Request for Natural Cycles.", u:"https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN170052.pdf" },
      { n:5, t:"Duane, M., Stanford, J.B., et al. (2022). Fertility Awareness-Based Methods. Frontiers in Medicine, 9, 858977.", u:"https://pmc.ncbi.nlm.nih.gov/articles/PMC9171018/" },
      { n:6, t:"Fertility Awareness Project. (2025). Choosing Apps and Thermometers.", u:"https://fertilityawarenessproject.ca/blog/choosing-apps-and-thermometers" },
      { n:7, t:"Justisse College International. (2025). Chart Your Cycle.", u:"https://justisse.ca/chart-your-cycle/" },
      { n:8, t:"Read Your Body. (2024). Cervical Fluid Tracking.", u:"https://readyourbody.com/cervical-fluid/" },
    ]
  },
  {
    id:"cervical-mucus-guide", cat:"How-To", time:"14 min",
    for:"New charters learning to observe and record mucus",
    title:"The Complete Guide to Observing Cervical Mucus with the Justisse Method",
    excerpt:"Cervical mucus is the most important fertility biomarker. Here's exactly how to check it, what to look for, and how Justisse's three-quality system creates unmatched precision.",
    kw:"cervical mucus tracking, how to check cervical mucus, fertile mucus, egg white cervical mucus, cervical fluid charting, Justisse mucus categories",
    body:`Of all the biomarkers tracked in fertility awareness, cervical mucus is the most important. It's the only sign that provides real-time, same-day information about your fertility status — telling you that ovulation is approaching before it happens, something temperature cannot do.[1]

**Why Mucus Matters Biologically**

Cervical mucus is a hydrogel produced by glands in the cervix.[2] Under the influence of rising estrogen in the days before ovulation, the cervix produces increasingly fluid, stretchy, and alkaline mucus that performs three critical functions: it neutralizes the normally acidic vaginal environment (which would otherwise kill sperm within hours), it provides a transport medium that guides sperm toward the fallopian tubes, and it creates storage crypts where sperm can survive for up to five days.[1][2]

Without fertile-quality mucus, conception is extremely unlikely regardless of timing. This is why mucus quality is relevant for both avoidance and achievement of pregnancy.

**The Justisse Observational Routine**

In the Justisse Method, you check for mucus every time you use the bathroom throughout the day.[3] The technique involves wiping from front to back with toilet paper (before and after urinating) and paying attention to three distinct qualities:

Sensation — What did you feel as the paper crossed the perineal body? The options are dry (no moisture), moist (slight dampness), wet (distinct wetness), or slippery/lubricative (the paper glides with no friction). Sensation is particularly important because it's sometimes the only detectable sign when mucus volume is low.[3][4]

Appearance — What did you see on the paper? Categories include nothing, cell slough (pasty or crumbly white/yellow material), tacky (sticky, opaque), creamy (white, lotion-like), clear (translucent), egg-white (clear and notably stretchy), or watery (thin, transparent).[3]

Stretchiness — If you collected mucus between your fingers, does it stretch? Tacky mucus breaks immediately. Fertile mucus can stretch 1 cm or more. Peak-quality mucus often stretches 3+ cm before breaking.[3][4]

**Recording: The Most-Fertile Rule**

At the end of each day, you chart the single most fertile observation from the entire day. If you observed dry mucus in the morning, creamy mucus at noon, and clear stretchy mucus in the evening, you record clear/stretchy. This conservative rule ensures no fertile observation is missed.[3]

**Identifying Peak Day**

Peak Day is the last day you observe peak-quality cervical mucus — mucus that is clear, stretchy, wet, slippery, or lubricative.[3][5] Critically, you won't know it's Peak Day on that day. You'll identify it the following day when the quality changes or mucus disappears. In the Justisse Method, you then count four days after Peak Day before declaring the post-ovulatory infertile phase.[4]

**Your Basic Infertile Pattern (BIP)**

Over several cycles of charting, you'll identify your personal baseline — what your body looks and feels like on infertile days. Some people are consistently dry (BIP of "D0"). Others have a regular pattern of non-fertile discharge or cell slough. Any change from your BIP is your "point of change" and signals the opening of the fertile window.[3][6]

**Cell Slough vs. Fertile Mucus**

One of the trickiest distinctions for new charters is telling cell slough from fertile mucus. Cell slough appears as white or yellowish-white staining on underwear, feels pasty or crumbly, and typically cannot be finger-tested for stretchiness.[6] When this is a habitual observation, it is not considered a fertile sign — but the charter needs to establish through several cycles that this is their typical pattern and not cycle-phase-dependent.[6]

**Common Mistakes to Avoid**

Only checking once daily (check every bathroom visit and chart the most fertile), confusing arousal fluid with cervical mucus (arousal fluid dissipates quickly and doesn't sustain stretchiness), and skipping observations during bleeding (mucus can be present during menstruation, masked by blood).[3]`,
    sources:[
      { n:1, t:"Duane, M., Stanford, J.B., et al. (2022). Fertility Awareness-Based Methods. Frontiers in Medicine, 9, 858977.", u:"https://pmc.ncbi.nlm.nih.gov/articles/PMC9171018/" },
      { n:2, t:"Bigelow, J.L., et al. (2004). Mucus observations in the fertile window. Human Reproduction, 19(4), 889–892.", u:"https://pubmed.ncbi.nlm.nih.gov/14990542/" },
      { n:3, t:"Matus, G. (2012). Justisse Method: Fertility Awareness and Body Literacy — A User's Guide.", u:"https://www.amazon.com/Justisse-Method-Fertility-Awareness-Literacy/dp/1469959267" },
      { n:4, t:"Blue Poppy Health. (2016). What Is the Justisse Method?", u:"https://bluepoppyhealth.com/what-is-the-justisse-method/" },
      { n:5, t:"Fertility Friday. (2017). The 4 Rules for Using FAM for Birth Control.", u:"https://www.fertilityfriday.com/the-4-rules-for-using-the-fertility-awareness-method-for-birth-control/" },
      { n:6, t:"Justisse College International. (2023). Addendum to the User's Guide.", u:"https://justisse.ca/wp-content/uploads/2023/08/2023-Addendum-to-the-Users-Guide.pdf" },
    ]
  },
  {
    id:"bbt-guide", cat:"How-To", time:"10 min",
    for:"Charters learning temperature tracking technique",
    title:"BBT Tracking for the Justisse Method: How to Take, Chart, and Interpret Your Temperature",
    excerpt:"Basal body temperature confirms ovulation retroactively. Here's the exact technique, what constitutes a valid shift, and how the Justisse double-check works.",
    kw:"basal body temperature, BBT charting, how to take BBT, temperature shift ovulation, coverline fertility, Justisse BBT rules",
    body:`While cervical mucus opens the fertile window in real time, basal body temperature (BBT) closes it by confirming that ovulation has already occurred.[1] This complementary role makes BBT the essential second half of the symptothermal "double-check" that gives the Justisse Method its high effectiveness.

**The Biology**

Before ovulation, progesterone levels are low and your resting core temperature stays in a lower range. After the egg is released, the corpus luteum (the structure left on the ovary) produces progesterone, which acts on the hypothalamus to raise your body's thermostat by approximately 0.2–0.5°C (0.4–1.0°F).[1][2] This elevated temperature persists throughout the luteal phase until progesterone drops before your next period (or continues rising if pregnancy occurs).

**Taking Your Temperature: The Protocol**

Use a basal body thermometer that measures to two decimal places (36.45°C, not just 36.4°C).[3] Standard fever thermometers are not precise enough.

Take your temperature at the same time every morning, immediately upon waking — before sitting up, talking, drinking water, or checking your phone. Movement and activity raise your core temperature, invalidating the reading.[3]

For oral or vaginal measurement, hold the thermometer in place for a full 3 minutes. For underarm measurement, 10 minutes is required.[4] Temperature readings are rounded to the nearest 0.05°C (0.1°F) on the chart.[4]

Consistency matters. A variation of more than 30 minutes from your usual wake-up time can affect your reading. Many charters use a wearable device like Tempdrop for overnight continuous measurement, which eliminates the timing concern.[5]

**Identifying the Temperature Shift**

After ovulation, you should see your BBT rise and stay elevated for at least three consecutive days above a reference line called the coverline. The coverline is typically drawn 0.05°C above the highest of the six temperatures preceding the shift.[3]

When three consecutive temperatures appear above this line (and the third is at least 0.1°C above), the shift is confirmed.[3][4]

**Disturbed Temperatures**

Not every reading is reliable. Illness, fever, alcohol consumption the previous evening, significantly disrupted sleep, travel across time zones, or taking your temperature at an unusual time can all produce misleading readings.[3] In the Justisse system, disturbed temperatures are circled on the chart and excluded from the shift interpretation.[4]

**The Double-Check Rule**

The defining feature of symptothermal methods is the cross-referencing of mucus and temperature. In the Justisse Method, ovulation is confirmed only when both Peak Day + 4 (mucus count) and the BBT shift align.[4] This double-check means you can confirm ovulation even if one indicator is ambiguous — as long as both ultimately agree. If cervical mucus dries up but your temperature doesn't shift, you likely haven't ovulated yet and should expect another mucus patch.[6]

**What Your Temperature Pattern Reveals**

Beyond fertility identification, your BBT chart is a window into hormonal health. A consistently short luteal phase (fewer than 10 elevated days) may suggest insufficient progesterone.[1] An erratic, unstable pattern might point to thyroid dysfunction, poor sleep quality, or high stress. A temperature that never clearly shifts may indicate anovulation. Sharing these patterns with a healthcare provider gives them valuable diagnostic data.[2]`,
    sources:[
      { n:1, t:"Duane, M., Stanford, J.B., et al. (2022). Fertility Awareness-Based Methods. Frontiers in Medicine, 9, 858977.", u:"https://pmc.ncbi.nlm.nih.gov/articles/PMC9171018/" },
      { n:2, t:"ACOG Committee Opinion No. 651 (2015). Menstruation as a Vital Sign.", u:"https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2015/12/menstruation-in-girls-and-adolescents-using-the-menstrual-cycle-as-a-vital-sign" },
      { n:3, t:"Matus, G. (2012). Justisse Method: Fertility Awareness and Body Literacy — A User's Guide.", u:"https://www.amazon.com/Justisse-Method-Fertility-Awareness-Literacy/dp/1469959267" },
      { n:4, t:"Justisse College International. (2023). Addendum to the User's Guide.", u:"https://justisse.ca/wp-content/uploads/2023/08/2023-Addendum-to-the-Users-Guide.pdf" },
      { n:5, t:"Tempdrop. (2024). Justisse Method Guide.", u:"https://www.tempdrop.com/blogs/resources/justisse-method-guide" },
      { n:6, t:"Navar, L. (2023). When to Expect a Double Peak. leilaninavar.com.", u:"https://leilaninavar.com/when-to-expect-a-double-peak/" },
    ]
  },
  {
    id:"fifth-vital-sign", cat:"Health & Wellness", time:"9 min",
    for:"Health-conscious individuals, wellness community",
    title:"Your Menstrual Cycle Is Your Fifth Vital Sign — Here's What It Reveals About Your Health",
    excerpt:"ACOG recognizes the menstrual cycle as a vital sign. Charting reveals thyroid issues, stress responses, nutritional gaps, and hormonal imbalances that bloodwork alone can miss.",
    kw:"menstrual cycle vital sign, cycle as health indicator, hormonal health tracking, period health, what your period says about your health",
    body:`Most people know four vital signs: heart rate, blood pressure, respiratory rate, and body temperature. In 2015, the American College of Obstetricians and Gynecologists formally identified a fifth: the menstrual cycle.[1]

**Why This Recognition Matters**

Your menstrual cycle is a monthly readout from your endocrine system — an integrated report on the functioning of your hypothalamus, pituitary gland, ovaries, thyroid, and adrenal glands.[2] Variations in cycle length, ovulation timing, luteal phase duration, mucus quality, and temperature patterns can reveal health concerns before they become clinically obvious through standard blood tests.[3]

The ACOG committee opinion was explicit: clinicians should evaluate the menstrual cycle with the same attention given to other vital signs, and abnormal patterns in adolescents should prompt further investigation rather than automatic prescription of hormonal contraceptives to "regulate" cycles.[1]

**What Charting Reveals That Bloodwork Can Miss**

Thyroid dysfunction often manifests in cycle changes before TSH levels cross clinical thresholds. An erratic BBT pattern, consistently long cycles, or inadequate mucus production can all point to subclinical thyroid issues.[2][4]

Luteal phase deficiency — when the post-ovulatory phase is consistently shorter than 10 days — suggests insufficient progesterone production. Research indicates that approximately 20% of charted cycles show luteal phases shorter than the typical 12–14 days.[5] This affects both fertility and well-being, and is often invisible without charting because standard blood tests only capture hormone levels at a single point in time.

Hypothalamic amenorrhea (missing periods due to stress, under-eating, or overexercising) shows a distinctive charting pattern: absent or very sparse mucus, no temperature shift, and prolonged cycles. These patterns can appear before periods stop entirely, giving early warning.[2]

PCOS patterns are visible in charting as well: multiple mucus patches without temperature confirmation (indicating repeated failed ovulation attempts), long and irregular cycles, and sometimes persistent low-grade mucus that makes BIP identification challenging.[2][4]

**Cycle Charting as Preventive Medicine**

When you bring several months of detailed cycle charts to a healthcare appointment, you're giving your provider a rich longitudinal dataset that a single blood draw cannot match.[3] You can show exactly when (or whether) you ovulated, how long each phase lasted, how your body responded to dietary changes, supplements, or medications, and whether an intervention is working.

This data can differentiate between conditions that present similarly (for example, PCOS vs. hypothalamic amenorrhea), guide treatment decisions, and measure therapeutic response — all from observations you make yourself, at no cost, every day.[4]

**Beyond Diagnosis: Living with Your Cycle**

Even without pathology, charting builds an understanding of normal cyclical variation that improves daily life. Many charters report better understanding of energy fluctuations, mood patterns, exercise tolerance, and even creativity and social preferences across cycle phases.[3] This isn't pseudoscience — it's the natural consequence of understanding how fluctuating estrogen, progesterone, and testosterone levels affect cognition, metabolism, and emotional processing throughout each cycle.[2]`,
    sources:[
      { n:1, t:"ACOG Committee Opinion No. 651 (2015). Menstruation in Girls and Adolescents: Using the Menstrual Cycle as a Vital Sign.", u:"https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2015/12/menstruation-in-girls-and-adolescents-using-the-menstrual-cycle-as-a-vital-sign" },
      { n:2, t:"Duane, M., Stanford, J.B., et al. (2022). Fertility Awareness-Based Methods. Frontiers in Medicine, 9, 858977.", u:"https://pmc.ncbi.nlm.nih.gov/articles/PMC9171018/" },
      { n:3, t:"Pelvic Health & Wellness. (2025). Intro to Justisse Method of Fertility Awareness.", u:"https://www.pelvichealthandwellness.com/phw-blog/justisse-method-fertility" },
      { n:4, t:"International Association for Functional Hormone Health. (2022). Using Fertility Awareness to Support Hormone Health.", u:"https://iafhh.com/2022/11/16/using-fertility-awareness-to-support-hormone-health/" },
      { n:5, t:"Symul, L., et al. (2019). Assessment of menstrual health status from smartphone apps. npj Digital Medicine, 2, 64.", u:"https://pubmed.ncbi.nlm.nih.gov/31341953/" },
    ]
  },
  {
    id:"pcos-charting", cat:"Special Circumstances", time:"11 min",
    for:"People with PCOS, irregular cycles, hormonal conditions",
    title:"Charting with PCOS: Why the Justisse Method Works When Prediction Apps Can't",
    excerpt:"PCOS causes irregular ovulation and confusing mucus patterns. Observation-based charting adapts to your body's actual timeline — and doubles as a powerful diagnostic tool.",
    kw:"PCOS fertility tracking, irregular cycles FAM, charting with PCOS, fertility awareness PCOS, long cycles charting, anovulatory cycle tracking",
    body:`Polycystic ovary syndrome affects an estimated 6–12% of reproductive-age women, making it one of the most common endocrine disorders.[1] Its hallmark features — irregular cycles, anovulation, and hormonal imbalance — make prediction-based fertility apps functionally useless. And they make observation-based charting indispensable.

**Why Prediction Fails with PCOS**

When your cycles range from 28 to 90+ days, an app that predicts ovulation on day 14 isn't just inaccurate — it could lead to unintended pregnancy if used for avoidance, or missed fertile windows if used for conception.[2] The core issue is that PCOS disrupts the orderly hormonal cascade that produces predictable cycles. Your body may attempt to ovulate multiple times before succeeding, creating a pattern of rising and falling estrogen that generates confusing signals.[3]

**The "Double Peak" Pattern**

One of the most common PCOS charting patterns is the "double peak" (or multiple peak): your body builds toward ovulation, producing fertile mucus, but then fails to release an egg. Mucus dries up, mimicking post-ovulatory drying. Then, days or weeks later, another mucus patch appears as your body tries again.[3]

If you're following the Justisse observational routine and rules, double peaks don't cause problems — you'll see the mucus return and recognize that you haven't yet entered the confirmed infertile phase.[3] But if you rely on an app that declared you "safe" after the first mucus dry-up, you could be caught off guard.

**Temperature as the Tiebreaker**

This is where BBT becomes especially valuable for PCOS charters. If mucus dries up but your temperature doesn't shift, you know ovulation hasn't occurred and another fertile episode is likely coming.[4] The symptothermal double-check provides an objective confirmation that is immune to the mucus ambiguity that PCOS can create.

**Charting as a Diagnostic Tool**

For people with PCOS, detailed cycle charts become a powerful medical resource. They show your healthcare provider exactly how many times per year you ovulate, the duration of each cycle phase, how your body responds to dietary interventions (like reducing refined carbohydrates or adding inositol), whether medications like metformin or letrozole are restoring ovulatory function, and the quality and quantity of cervical mucus at each ovulation attempt.[1][2]

This longitudinal data is far more informative than a single blood draw, which captures hormones at only one moment and may miss the pattern entirely.

**Working with a Practitioner**

PCOS charting has a steeper learning curve than typical charting, and practitioner support is particularly valuable.[5] A Justisse HRHP can help you identify your BIP in the context of persistent low-grade mucus (common with PCOS), distinguish between a genuine point-of-change and background hormonal noise, navigate the emotional challenge of long cycles and repeated false starts, and set realistic expectations for the learning timeline.[5]

**The Empowerment Shift**

Many people with PCOS describe their pre-charting experience as one of confusion and helplessness — never knowing when their period will come, whether they're ovulating, or what's happening inside their body. Charting transforms this experience into one of informed awareness, even when the patterns are irregular. Knowing that your body attempted ovulation on day 25, didn't succeed, and is trying again on day 40 is profoundly different from simply wondering when something will happen.[5]`,
    sources:[
      { n:1, t:"Duane, M., Stanford, J.B., et al. (2022). Fertility Awareness-Based Methods. Frontiers in Medicine, 9, 858977.", u:"https://pmc.ncbi.nlm.nih.gov/articles/PMC9171018/" },
      { n:2, t:"International Association for Functional Hormone Health. (2022). Using Fertility Awareness to Support Hormone Health.", u:"https://iafhh.com/2022/11/16/using-fertility-awareness-to-support-hormone-health/" },
      { n:3, t:"Navar, L. (2023). When to Expect a Double Peak.", u:"https://leilaninavar.com/when-to-expect-a-double-peak/" },
      { n:4, t:"Tempdrop. (2024). Justisse Method Guide.", u:"https://www.tempdrop.com/blogs/resources/justisse-method-guide" },
      { n:5, t:"Justisse College International. (2025). Chart Your Cycle.", u:"https://justisse.ca/chart-your-cycle/" },
    ]
  },
  {
    id:"data-privacy", cat:"Privacy", time:"10 min",
    for:"Privacy-conscious users, especially US-based",
    title:"Fertility Data Privacy: What Period Tracking Apps Know About You and How to Protect Yourself",
    excerpt:"In a post-Dobbs world, fertility data carries legal risks. Here's what popular apps do with your information, which ones protect it, and why local-first tracking matters.",
    kw:"period tracker privacy, fertility data security, is my period app safe, Dobbs fertility data, period tracking legal risk, private cycle tracking",
    body:`The conversation about fertility data privacy shifted dramatically after the 2022 Dobbs v. Jackson decision. Reproductive health data that was once considered routine suddenly became potentially legally consequential — and the apps that collect it came under scrutiny.[1]

**What Most Apps Collect**

The majority of period tracking and fertility apps collect and store your data on cloud servers maintained by the app company or its infrastructure providers.[2] Many also collect location data, device identifiers, browsing behavior, and third-party tracking cookies. Some apps share "anonymized" data with research partners, advertisers, or data brokers — though research has repeatedly shown that anonymized health data can often be re-identified.[1]

A 2019 Privacy International investigation found that several popular period tracking apps were sharing intimate health data with Facebook's analytics platform, often without users' explicit knowledge.[3]

**The Legal Landscape**

In the United States, health data in consumer apps is generally not protected by HIPAA, which applies only to healthcare providers and health plans.[1] This means that period tracking data stored on a company's servers can potentially be subpoenaed by law enforcement, requested in civil litigation, or accessed through data breaches. Several cases since 2022 have involved digital evidence in reproductive rights prosecutions.[1]

Apps based in the European Union, like Clue (headquartered in Berlin), benefit from GDPR protections that are generally stronger than US privacy law.[4] However, data stored on US-based servers may still be accessible to US authorities under certain circumstances.

**The Privacy Spectrum**

At the most private end, apps like Euki store all data locally on your device with no cloud sync and no account creation required.[4] If you lose your phone, your data is gone — but it was never on anyone's server.

In the middle, some apps offer optional cloud sync with end-to-end encryption, where even the app company cannot read your data.

At the least private end, mainstream apps sync everything to cloud servers, require email accounts, and may share data with third parties under broadly worded privacy policies.[2]

**Paper Charts: The Analog Privacy Solution**

There's a reason many fertility awareness educators — including Justisse practitioners — still value paper charting.[5] A paper chart in your bedside drawer has no digital footprint, no server vulnerabilities, no privacy policy changes, and no subpoena pathway beyond physical access. For people in legally sensitive situations, paper remains the gold standard for privacy.

**Practical Protection Steps**

If you choose digital charting, select an app that stores data locally or offers end-to-end encryption, doesn't require real name or email to create an account, has a clear and readable privacy policy, doesn't share data with third parties, and allows you to export and delete your data completely.[4]

Consider using a VPN when accessing fertility-related websites or apps. Be cautious about what you post on social media regarding reproductive health. And remember that your cycle knowledge lives in your learned skills and body literacy — the Justisse Method's value is in your education, not in any app's database.[5]`,
    sources:[
      { n:1, t:"Electronic Frontier Foundation. (2022). Digital Privacy and Reproductive Rights After Dobbs.", u:"https://www.eff.org/deeplinks/2022/06/security-and-privacy-tips-people-seeking-abortion" },
      { n:2, t:"Lupton, D. (2015). Quantified sex: a critical analysis of sexual and reproductive self-tracking using apps. Culture, Health & Sexuality, 17(4), 440–453.", u:"https://www.tandfonline.com/doi/full/10.1080/13691058.2014.920528" },
      { n:3, t:"Privacy International. (2019). No Body's Business But Mine: How Menstruation Apps Share Your Data.", u:"https://privacyinternational.org/long-read/3196/no-bodys-business-mine-how-menstruation-apps-are-sharing-your-data" },
      { n:4, t:"Healthline. (2025). The 4 Best Fertility Apps.", u:"https://www.healthline.com/health/pregnancy/fertility-apps" },
      { n:5, t:"Justisse College International. (2025). Chart Your Cycle.", u:"https://justisse.ca/chart-your-cycle/" },
    ]
  },
  {
    id:"partner-guide", cat:"Relationships", time:"8 min",
    for:"Partners of FAM users, couples considering FAM",
    title:"A Partner's Guide to Fertility Awareness: How to Be Involved, Informed, and Supportive",
    excerpt:"FAM is a team practice. Whether you're the charting partner or the supporting one, here's what you need to know about shared responsibility, communication, and the fertile window.",
    kw:"partner support FAM, couples fertility awareness, FAM relationship guide, fertility awareness for men, natural family planning couples",
    body:`If your partner has started charting their cycle, you might wonder where you fit in. The answer: you're not a bystander. Fertility awareness works best as a shared practice, and research consistently shows that couples who learn the method together achieve better outcomes.[1]

**Understanding the Basics**

Your partner's cycle has three key phases. The pre-ovulatory phase begins with menstruation and lasts until fertility signs appear — this length varies and is what makes each cycle unique. The fertile window spans roughly 6–8 days centered around ovulation — identified by cervical mucus and closed by BBT confirmation. The post-ovulatory phase runs from confirmed ovulation to the next period — this phase is remarkably consistent (typically 10–16 days) for each individual.[1][2]

The biological reality is straightforward: sperm can survive up to five days in fertile cervical mucus, and the egg lives about 12–24 hours after release. The fertile window exists because of this overlap.[1]

**What the Method Asks of Both Partners**

During the fertile window, couples choosing to avoid pregnancy need to either abstain from intercourse or use a barrier method consistently. This requires communication, planning, and mutual commitment. The method's effectiveness data assumes that both partners follow the guidelines — unilateral rule-breaking invalidates the method's protection.[2][3]

For couples trying to conceive, the fertile window is when you want to be intimate. Understanding the mucus progression helps you identify the most fertile days — typically the 2–3 days leading up to and including Peak Day.[1]

**Practical Ways to Be Involved**

Attend practitioner sessions together when possible. Learning the method's logic helps you understand why certain days require caution and builds shared confidence in the system.[3]

Ask to see the chart periodically. You don't need to become an expert charter, but understanding the visual pattern of your partner's cycle — the mucus progression, the temperature shift, the fertile window markers — transforms abstract rules into concrete biology.[2]

Respect the fertile window boundaries without making your partner feel like the "gatekeeper." This is a shared decision, not one person restricting the other.[3]

Check in regularly about comfort levels, concerns, and whether intentions have changed. Open communication is the foundation that makes the method work in a real relationship.[2]

**The Intimacy Dividend**

Many couples who use FAM report that it deepens rather than diminishes their relationship. The required communication about fertility, desire, and intentions creates a framework for ongoing dialogue that many couples never otherwise develop. Understanding hormonal rhythms also helps both partners navigate mood and energy fluctuations with more empathy and less confusion.[3]`,
    sources:[
      { n:1, t:"Duane, M., Stanford, J.B., et al. (2022). Fertility Awareness-Based Methods. Frontiers in Medicine, 9, 858977.", u:"https://pmc.ncbi.nlm.nih.gov/articles/PMC9171018/" },
      { n:2, t:"Justisse College International. (2025). Chart Your Cycle.", u:"https://justisse.ca/chart-your-cycle/" },
      { n:3, t:"Justisse College International. (2025). College Program.", u:"https://justisse.ca/college-program/" },
    ]
  },
  {
    id:"ttc-charting", cat:"Conception", time:"9 min",
    for:"Couples actively trying to conceive",
    title:"Using the Justisse Method to Get Pregnant: How Charting Optimizes Your Conception Window",
    excerpt:"Timing intercourse to your actual fertile days — identified by cervical mucus and confirmed by temperature — dramatically improves conception rates. Here's the evidence-based approach.",
    kw:"trying to conceive charting, FAM for getting pregnant, cervical mucus conception, best days to conceive, fertility awareness TTC, optimize conception timing",
    body:`While much of the fertility awareness conversation focuses on avoidance, the same skills are equally powerful for achieving pregnancy. Research suggests that couples with normal fertility who chart their cycles are likely to conceive within 4–5 cycles — significantly faster than the 6–12 cycles often cited for the general population.[1]

**Why Timing Beats Frequency**

The fertile window is approximately six days long: the five days before ovulation and the day of ovulation itself.[2] Outside this window, conception is biologically impossible regardless of intercourse frequency. Inside it, the probability of conception per act of intercourse varies dramatically by day — with the highest probability occurring 1–2 days before ovulation, when peak-quality cervical mucus is present.[2]

This means that having intercourse every other day "just in case" is far less efficient than identifying your actual fertile days and timing intercourse accordingly.

**The Cervical Mucus Advantage**

Peak-quality cervical mucus (clear, stretchy, wet, slippery) creates the optimal environment for sperm survival and transport.[3] Without adequate mucus, sperm die within hours in the acidic vaginal environment. With peak mucus, they can survive up to five days in cervical crypts, waiting for the egg.[2]

The Justisse observational routine lets you identify not just whether mucus is present, but its quality — sensation, appearance, and stretchiness. The days of most fertile mucus are your highest-probability conception days.[3][4]

**BBT for Confirmation and Timing**

While BBT can't predict ovulation in advance (it only confirms it after the fact), it serves two critical functions for TTC charters. First, it confirms that ovulation actually occurred — important because having a period doesn't guarantee ovulation happened.[2] Second, over several cycles it helps you recognize your personal ovulation pattern, which can inform timing in subsequent cycles even though each cycle is unique.[1]

**When Your Charts Suggest a Problem**

Charting while trying to conceive also functions as an early warning system. Patterns to discuss with a reproductive health provider include consistently short luteal phases (fewer than 10 days from confirmed ovulation to menstruation), absent or minimal cervical mucus even during the expected fertile window, anovulatory cycles (no temperature shift despite regular bleeding), and very irregular cycle lengths with unpredictable ovulation timing.[2]

These patterns may indicate treatable hormonal imbalances — and catching them early through charting can save months of blind trying before seeking help.[1]

**Bringing Charts to Your Provider**

If you do consult a fertility specialist, several months of Justisse charts are extraordinarily valuable. They demonstrate exactly when you ovulated (or didn't), how your hormonal progression looked, and how your body responded cycle to cycle.[5] This information can streamline the diagnostic workup, potentially saving you from unnecessary and expensive testing.

**The Emotional Dimension**

The TTC journey is emotionally intense, and charting adds a layer of data that can be both empowering and anxiety-producing. Many practitioners encourage TTC charters to focus on the process of building body literacy rather than fixating on outcome each cycle. The skills you develop — reading your body's signals, understanding hormonal patterns — serve you regardless of how quickly conception occurs.[5]`,
    sources:[
      { n:1, t:"Tempdrop. (2024). Justisse Method Guide.", u:"https://www.tempdrop.com/blogs/resources/justisse-method-guide" },
      { n:2, t:"Duane, M., Stanford, J.B., et al. (2022). Fertility Awareness-Based Methods. Frontiers in Medicine, 9, 858977.", u:"https://pmc.ncbi.nlm.nih.gov/articles/PMC9171018/" },
      { n:3, t:"Fertility Friday. (2017). The 4 Rules for Using FAM for Birth Control.", u:"https://www.fertilityfriday.com/the-4-rules-for-using-the-fertility-awareness-method-for-birth-control/" },
      { n:4, t:"Bigelow, J.L., et al. (2004). Mucus observations in the fertile window. Human Reproduction, 19(4), 889–892.", u:"https://pubmed.ncbi.nlm.nih.gov/14990542/" },
      { n:5, t:"Justisse College International. (2025). Chart Your Cycle.", u:"https://justisse.ca/chart-your-cycle/" },
    ]
  },
  {
    id:"postpartum", cat:"Life Stages", time:"10 min",
    for:"New parents, breastfeeding, postpartum",
    title:"Fertility Awareness After Baby: Navigating Your Return to Fertility Postpartum",
    excerpt:"Your return to fertility after childbirth is gradual and unpredictable — especially while breastfeeding. Here's how Justisse's mucus-only option handles this unique phase.",
    kw:"postpartum fertility tracking, breastfeeding FAM, return to fertility after baby, LAM method, natural birth control postpartum, charting while breastfeeding",
    body:`The postpartum period is one of the most challenging and most important times to understand your fertility. Many new parents want reliable contraception but prefer to avoid hormonal methods while breastfeeding. The Justisse Method offers a practical, adaptable path.[1]

**Lactational Amenorrhea: The First Line**

The Lactational Amenorrhea Method (LAM) provides effective temporary contraception during the first six months if three conditions are all met: the baby is exclusively breastfeeding at the breast (no supplements, bottles, or pacifiers used in place of feedings), menstruation has not returned, and the baby is under six months old.[2] When all three criteria are met, LAM is approximately 98% effective.[2]

Once any condition is no longer met — supplementary feeding begins, bleeding returns, or the baby reaches six months — another method is needed.

**The Critical Warning: Ovulation Precedes Menstruation**

Fertility can return before your first postpartum period. Ovulation happens before menstruation — which means your first post-baby period is preceded by a fertile cycle.[1] This is why observation-based charting is essential: you can detect approaching fertility through cervical mucus changes before any bleeding occurs.

**Why Postpartum Charting Is Uniquely Challenging**

Sleep deprivation undermines BBT reliability — many new parents can't achieve the four consecutive hours of sleep recommended before taking temperature.[3] Breastfeeding hormones suppress ovulation inconsistently — some people don't ovulate for over a year while breastfeeding; others ovulate within weeks. Lochia (postpartum bleeding) and the gradual return of normal vaginal ecology create confusing observations for several weeks.[1]

**Justisse's Mucus-Only Advantage**

Because the Justisse Method can be used as a mucus-only method, it's well-suited to the postpartum period when BBT is unreliable.[1][3] During amenorrhea (no periods), you establish a postpartum BIP — your personal baseline of observations during this phase. Any change from this baseline signals potential approaching fertility and triggers conservative behavior.[1]

This mucus-only approach has its own evidence base: studies on mucus-only methods report perfect-use effectiveness rates between 96.6% and 98.9%.[4]

**Practitioner Support Is Especially Valuable**

Postpartum charting has a steeper learning curve, and the consequences of misinterpretation are significant for people wanting to space pregnancies. A Justisse HRHP can help interpret ambiguous patterns, adjust the charting approach as breastfeeding patterns change (night weaning, introduction of solids), and provide reassurance during the often-anxious transition back to cycling.[1][5]

**Setting Realistic Expectations**

Your postpartum cycles may not look "normal" for many months — irregular lengths, varied mucus patterns, and inconsistent ovulation are all typical during this phase, especially while breastfeeding.[5] Give yourself grace, chart conservatively, and lean on professional guidance. The skills you build during this challenging period will serve you through every subsequent reproductive phase.`,
    sources:[
      { n:1, t:"Justisse College International. (2025). Chart Your Cycle.", u:"https://justisse.ca/chart-your-cycle/" },
      { n:2, t:"Duane, M., Stanford, J.B., et al. (2022). Fertility Awareness-Based Methods. Frontiers in Medicine, 9, 858977.", u:"https://pmc.ncbi.nlm.nih.gov/articles/PMC9171018/" },
      { n:3, t:"Tempdrop. (2024). Justisse Method Guide.", u:"https://www.tempdrop.com/blogs/resources/justisse-method-guide" },
      { n:4, t:"Justisse College International. (2023). Addendum to the User's Guide.", u:"https://justisse.ca/wp-content/uploads/2023/08/2023-Addendum-to-the-Users-Guide.pdf" },
      { n:5, t:"Fertility Awareness Project. (2025). Starting FAM.", u:"https://fertilityawarenessproject.ca/blog/straighforward-guide-to-starting-fertility-awareness" },
    ]
  },
  {
    id:"justisse-vs-apps", cat:"Comparison", time:"11 min",
    for:"People comparing fertility tracking options",
    title:"Justisse vs. Natural Cycles vs. Clue vs. Flo: An Honest Comparison of Fertility Tracking Approaches",
    excerpt:"Algorithm-based apps and observation-based methods serve different needs. Here's a head-to-head on accuracy, autonomy, privacy, and who each approach works best for.",
    kw:"best fertility awareness method, Natural Cycles vs Justisse, Clue vs FAM, fertility app comparison 2026, which fertility method is best",
    body:`The fertility tracking landscape offers fundamentally different approaches. Understanding the philosophical and practical differences is essential for choosing the right path.

**Category 1: Prediction-Based Period Trackers (Flo, Clue Free, Ovia)**

These apps track your period dates and use historical averages to predict future periods and ovulation windows. They do not require you to take temperature or observe cervical mucus.[1]

Strengths: Easy to use, free or low-cost, good for tracking period dates and symptoms. Clue's free version offers solid cycle logging with strong EU-based privacy protections.[2]

Limitations: Fertile window predictions are based on averages and past patterns — essentially a digital calendar method. A 2016 study found most of these apps inaccurate at predicting the actual fertile window.[1] They should not be relied upon for pregnancy prevention or precise conception timing.

**Category 2: Algorithm-Based Contraceptive Apps (Natural Cycles, Clue Birth Control)**

Natural Cycles uses a proprietary BBT algorithm to classify days as fertile or infertile, and was the first app to receive FDA clearance as a "digital contraceptive."[3] Clue received similar clearance in 2021 using cycle-length-based calculations.[4]

Strengths: More scientifically grounded than pure prediction apps. Natural Cycles provides a simple user experience — just take temperature and the app does the interpretation.

Limitations: Natural Cycles relies solely on temperature, which cannot detect the opening of the fertile window in real time.[5] It compensates with many conservative "red days." For people with irregular cycles, disrupted sleep, or post-hormonal transitions, algorithm accuracy decreases. A Swedish report noted that Natural Cycles users accounted for a notable number of abortion clinic visits, though proportional to market share.[4]

**Category 3: Observation-Recording Apps (Read Your Body)**

These apps let you record your own observations (mucus, temperature, cervix) without overriding them with algorithmic predictions. They support manual marking of peak day, coverline, and interpretive stamps.[6]

Strengths: Faithful to the fertility awareness method philosophy. You maintain full interpretive control. Compatible with multiple FAM methods including Justisse.

Limitations: Requires you to learn a method. The app is a tool, not a teacher.

**Category 4: The Justisse Method (with any compatible charting tool)**

The Justisse Method is not an app — it's a comprehensive body literacy education system that can be charted on paper, in Read Your Body, or in any tool that allows manual observation recording.[7]

Strengths: Works in every reproductive scenario (irregular cycles, postpartum, PCOS, perimenopause, post-pill). Practitioner-supported learning builds genuine competency. The symptothermal double-check system provides the highest confidence available in non-device fertility awareness.[8] Builds lifelong skills rather than app dependency.

Limitations: Requires learning investment (minimum 3 cycles with practitioner guidance recommended). Daily commitment to observation and recording. Practitioner sessions have associated costs.[7]

**The Verdict**

If you want convenience above all: Natural Cycles or Clue offer the lowest-effort digital options, with the caveat that accuracy is limited.

If you want deep body knowledge and maximum reliability: The Justisse Method, charted in Read Your Body or on paper, offers the most comprehensive and adaptable approach. The investment in learning pays dividends for your entire reproductive life.[7]`,
    sources:[
      { n:1, t:"Moglia, M.L., et al. (2016). Evaluation of Smartphone Cycle Tracking Applications. Obstetrics & Gynecology, 127(6), 1153–1160.", u:"https://pubmed.ncbi.nlm.nih.gov/27159760/" },
      { n:2, t:"Healthline. (2025). The 4 Best Fertility Apps.", u:"https://www.healthline.com/health/pregnancy/fertility-apps" },
      { n:3, t:"FDA. (2018). De Novo Classification Request for Natural Cycles.", u:"https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN170052.pdf" },
      { n:4, t:"National Center for Health Research. (2021). Fertility Apps Review.", u:"https://www.center4research.org/trying-get-pregnant-trying-avoid-now-theres-app/" },
      { n:5, t:"Fertility Awareness Project. (2025). Choosing Apps and Thermometers.", u:"https://fertilityawarenessproject.ca/blog/choosing-apps-and-thermometers" },
      { n:6, t:"Read Your Body. (2024). Cervical Fluid Tracking.", u:"https://readyourbody.com/cervical-fluid/" },
      { n:7, t:"Justisse College International. (2025). Chart Your Cycle.", u:"https://justisse.ca/chart-your-cycle/" },
      { n:8, t:"Peragallo Urrutia, R., et al. (2018). Effectiveness of FABMs. Obstetrics & Gynecology, 132(3), 591–604.", u:"https://pubmed.ncbi.nlm.nih.gov/29995717/" },
    ]
  },
  {
    id:"perimenopause", cat:"Life Stages", time:"9 min",
    for:"People aged 40+ approaching menopause",
    title:"Charting Through Perimenopause: Using Fertility Awareness When Your Cycles Start Changing",
    excerpt:"Perimenopause brings cycle changes that confuse apps and surprise people who thought they were 'too old' to get pregnant. Observation-based charting keeps you informed.",
    kw:"perimenopause fertility tracking, charting perimenopause, can I get pregnant in perimenopause, FAM over 40, menopause transition charting",
    body:`Perimenopause — the transition leading to menopause — typically begins in the early to mid-40s and can last 4–10 years.[1] During this phase, cycles often become irregular, ovulation less predictable, and fertility fluctuates in ways that surprise many people. This is exactly when observation-based charting becomes essential.

**The Perimenopause Surprise**

Many people assume that irregular cycles mean declining fertility means "I can't get pregnant." This assumption leads to a notable number of unintended pregnancies in the 40+ demographic.[2] The reality is that you can still ovulate — just less predictably. A cycle might be 25 days one month and 50 the next. You might skip ovulation for two months and then have a perfectly normal ovulatory cycle.[1]

Prediction-based apps are useless here. Your historical patterns no longer apply, and no algorithm can predict when an aging but still-functional ovary will release an egg.

**What Charting Reveals During This Transition**

Cervical mucus tracking shows in real time whether your body is mounting an ovulatory attempt, regardless of how irregular the cycle length is.[3] BBT confirms (or doesn't) whether that attempt succeeded. Together, these biomarkers give you cycle-by-cycle clarity about your fertility status.

Common perimenopause charting patterns include longer follicular phases (more days before ovulation), shorter luteal phases (less progesterone support after ovulation), more frequent anovulatory cycles, and episodes of unexpected fertile mucus after long dry stretches.[1][2]

**The Health Monitoring Dimension**

Perimenopause charting isn't only about fertility management. It provides valuable data about hormonal changes that affect sleep, mood, bone density, and cardiovascular health. Declining progesterone (visible as shortening luteal phases) and fluctuating estrogen (visible in unpredictable mucus patterns) correlate with many perimenopause symptoms including hot flashes, sleep disruption, and mood changes.[2]

Sharing these charts with a healthcare provider gives them objective data for managing the transition — whether that involves lifestyle adjustments, supplements, or hormone therapy considerations.[1]

**Practical Tips for Perimenopause Charting**

Chart conservatively — when in doubt, consider yourself potentially fertile. Pay special attention to cervical mucus, as it remains the most reliable real-time indicator even when cycles are irregular.[3] Don't assume a long dry spell means you're past fertility — watch for any return of mucus. And consider working with a Justisse practitioner who has experience with perimenopausal charters, as the patterns can be more complex to interpret.[3]`,
    sources:[
      { n:1, t:"Duane, M., Stanford, J.B., et al. (2022). Fertility Awareness-Based Methods. Frontiers in Medicine, 9, 858977.", u:"https://pmc.ncbi.nlm.nih.gov/articles/PMC9171018/" },
      { n:2, t:"ACOG. (2021). The Menopause Transition (Perimenopause). acog.org.", u:"https://www.acog.org/womens-health/faqs/the-menopause-years" },
      { n:3, t:"Justisse College International. (2025). Chart Your Cycle.", u:"https://justisse.ca/chart-your-cycle/" },
    ]
  },
];

// ──────────────────────────────────────────────
// SKILLS WIZARD — Interactive teaching modules
// ──────────────────────────────────────────────
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

// ─── Hardcoded Sample Data — a textbook Justisse cycle ───
const SAMPLE = {
  "2026-02-15":{date:"2026-02-15",bleeding:"heavy",bbt:"36.28",mucusSens:"D0",mucusApp:"N",mucusStr:"0",notes:"Cycle Day 1 — first day of full flow"},
  "2026-02-16":{date:"2026-02-16",bleeding:"heavy",bbt:"36.31",mucusSens:"D0",mucusApp:"N",mucusStr:"0"},
  "2026-02-17":{date:"2026-02-17",bleeding:"med",bbt:"36.25",mucusSens:"D0",mucusApp:"N",mucusStr:"0"},
  "2026-02-18":{date:"2026-02-18",bleeding:"light",bbt:"36.30",mucusSens:"M",mucusApp:"N",mucusStr:"0",notes:"Flow tapering off"},
  "2026-02-19":{date:"2026-02-19",bleeding:"spot",bbt:"36.27",mucusSens:"D0",mucusApp:"N",mucusStr:"0"},
  "2026-02-20":{date:"2026-02-20",bleeding:"none",bbt:"36.32",mucusSens:"D0",mucusApp:"N",mucusStr:"0",notes:"First fully dry day post-period"},
  "2026-02-21":{date:"2026-02-21",bleeding:"none",bbt:"36.29",mucusSens:"D0",mucusApp:"N",mucusStr:"0",notes:"Dry — consistent with BIP (Basic Infertile Pattern)"},
  "2026-02-22":{date:"2026-02-22",bleeding:"none",bbt:"36.33",mucusSens:"D0",mucusApp:"N",mucusStr:"0"},
  "2026-02-23":{date:"2026-02-23",bleeding:"none",bbt:"36.28",mucusSens:"D0",mucusApp:"CS",mucusStr:"0",notes:"Cell slough on underwear — pasty, crumbly. Not a fertile sign for me (habitual observation)"},
  "2026-02-24":{date:"2026-02-24",bleeding:"none",bbt:"36.30",mucusSens:"M",mucusApp:"TK",mucusStr:"B",pointOfChange:true,notes:"⬆ POINT OF CHANGE — first tacky mucus, moist sensation. Fertile window opens!"},
  "2026-02-25":{date:"2026-02-25",bleeding:"none",bbt:"36.26",mucusSens:"M",mucusApp:"CR",mucusStr:"1",notes:"Creamy white mucus, slight stretch. Building toward ovulation."},
  "2026-02-26":{date:"2026-02-26",bleeding:"none",bbt:"36.31",mucusSens:"W",mucusApp:"CR",mucusStr:"1",notes:"Sensation shifted to wet today — estrogen rising"},
  "2026-02-27":{date:"2026-02-27",bleeding:"none",bbt:"36.28",mucusSens:"W",mucusApp:"CL",mucusStr:"3",notes:"Clear and stretchy! 2-3cm stretch. Getting close to peak."},
  "2026-02-28":{date:"2026-02-28",bleeding:"none",bbt:"36.25",mucusSens:"SL",mucusApp:"EW",mucusStr:"3+",notes:"Egg-white, very slippery, 3+ cm stretch. Peak quality mucus. Cervix high, soft, open.",cxPos:"H",cxTex:"S",cxOp:"O"},
  "2026-03-01":{date:"2026-03-01",bleeding:"none",bbt:"36.22",mucusSens:"SL",mucusApp:"EW",mucusStr:"3+",peakDay:true,notes:"★ PEAK DAY — last day of peak mucus (identified March 2 when quality dropped). Cervix still high/soft/open.",cxPos:"H",cxTex:"S",cxOp:"O"},
  "2026-03-02":{date:"2026-03-02",bleeding:"none",bbt:"36.48",mucusSens:"M",mucusApp:"TK",mucusStr:"B",notes:"Peak+1. Mucus quality dropped sharply — tacky, breaks apart. BBT jumped to 36.48! Cervix dropping.",cxPos:"M",cxTex:"M",cxOp:"P"},
  "2026-03-03":{date:"2026-03-03",bleeding:"none",bbt:"36.52",mucusSens:"D0",mucusApp:"N",mucusStr:"0",notes:"Peak+2. Dry. Second elevated temp above coverline (36.38). Cervix low/firm/closed.",cxPos:"L",cxTex:"F",cxOp:"C"},
  "2026-03-04":{date:"2026-03-04",bleeding:"none",bbt:"36.55",mucusSens:"D0",mucusApp:"N",mucusStr:"0",notes:"Peak+3. Third high temp (36.55) — BBT SHIFT CONFIRMED! 3 temps above coverline of 36.38.",cxPos:"L",cxTex:"F",cxOp:"C"},
  "2026-03-05":{date:"2026-03-05",bleeding:"none",bbt:"36.58",mucusSens:"D0",mucusApp:"N",mucusStr:"0",notes:"Peak+4 EVENING = DOUBLE CHECK CONFIRMED. Both Peak Day count (4 days) and BBT shift agree. Post-ovulatory infertile phase begins tonight."},
  "2026-03-06":{date:"2026-03-06",bleeding:"none",bbt:"36.54",mucusSens:"D0",mucusApp:"N",mucusStr:"0",notes:"Confirmed infertile. Relaxed luteal phase."},
  "2026-03-07":{date:"2026-03-07",bleeding:"none",bbt:"36.56",mucusSens:"D0",mucusApp:"N",mucusStr:"0"},
  "2026-03-08":{date:"2026-03-08",bleeding:"none",bbt:"36.52",mucusSens:"D0",mucusApp:"CS",mucusStr:"0",notes:"Cell slough — normal luteal phase observation for me"},
  "2026-03-09":{date:"2026-03-09",bleeding:"none",bbt:"36.58",mucusSens:"D0",mucusApp:"N",mucusStr:"0"},
  "2026-03-10":{date:"2026-03-10",bleeding:"none",bbt:"36.55",mucusSens:"D0",mucusApp:"N",mucusStr:"0",notes:"Steady luteal phase temps around 36.5–36.6"},
  "2026-03-11":{date:"2026-03-11",bleeding:"none",bbt:"36.51",mucusSens:"D0",mucusApp:"N",mucusStr:"0"},
  "2026-03-12":{date:"2026-03-12",bleeding:"none",bbt:"36.48",mucusSens:"D0",mucusApp:"N",mucusStr:"0"},
  "2026-03-13":{date:"2026-03-13",bleeding:"none",bbt:"36.45",mucusSens:"D0",mucusApp:"CS",mucusStr:"0",notes:"Temps starting to decline — progesterone dropping. Period likely in 2-3 days."},
  "2026-03-14":{date:"2026-03-14",bleeding:"none",bbt:"36.38",mucusSens:"D0",mucusApp:"N",mucusStr:"0"},
  "2026-03-15":{date:"2026-03-15",bleeding:"spot",bbt:"36.30",mucusSens:"D0",mucusApp:"N",mucusStr:"0",notes:"Spotting started late afternoon. Not yet CD1 — need full flow."},
  "2026-03-16":{date:"2026-03-16",bleeding:"heavy",bbt:"36.25",mucusSens:"D0",mucusApp:"N",mucusStr:"0",notes:"Cycle 2, Day 1 — full menstrual flow. New cycle begins!"},
  "2026-03-17":{date:"2026-03-17",bleeding:"heavy",bbt:"36.28",mucusSens:"D0",mucusApp:"N",mucusStr:"0"},
  "2026-03-18":{date:"2026-03-18",bleeding:"med",bbt:"36.22",mucusSens:"D0",mucusApp:"N",mucusStr:"0"},
  "2026-03-19":{date:"2026-03-19",bleeding:"light",bbt:"36.26",mucusSens:"M",mucusApp:"N",mucusStr:"0",notes:"Flow tapering. Slight moisture but no visible mucus."},
  "2026-03-20":{date:"2026-03-20",bleeding:"spot",bbt:"36.30",mucusSens:"D0",mucusApp:"N",mucusStr:"0"},
  "2026-03-21":{date:"2026-03-21",bleeding:"none",bbt:"36.29",mucusSens:"D0",mucusApp:"N",mucusStr:"0",notes:"First dry day of Cycle 2. Watching for BIP to re-establish."},
};

// ──────────────────────────────────────────────
// MAIN APP COMPONENT
// ──────────────────────────────────────────────
export default function LunaChart() {
  const [page, setPage] = useState("landing");
  const [entries, setEntries] = useState(SAMPLE);
  const [curDate, setCurDate] = useState(td());
  const [article, setArticle] = useState(null);
  const [wizModule, setWizModule] = useState(null);
  const [wizStep, setWizStep] = useState(0);
  const [onboarded, setOnboarded] = useState(false);
  const [goal, setGoal] = useState(null);
  const [skillsDone, setSkillsDone] = useState([]);
  const [showTip, setShowTip] = useState(null);

  useEffect(() => { (async()=>{
    const e=await STO.get("lc-entries");
    if(e && Object.keys(e).length > 0) setEntries(e);
    const o=await STO.get("lc-onboard"); if(o){setOnboarded(true);setGoal(o.goal);}
    const s=await STO.get("lc-skills"); if(s) setSkillsDone(s);
  })(); },[]);

  useEffect(()=>{ if(Object.keys(entries).length) STO.set("lc-entries",entries); },[entries]);

  const save = (d,data) => setEntries(p=>({...p,[d]:{...p[d],...data,date:d}}));

  const completeOnboard = (g) => {
    setGoal(g); setOnboarded(true);
    STO.set("lc-onboard",{goal:g,at:new Date().toISOString()});
    setPage("skills");
  };

  const completeSkill = (id) => {
    const next = [...new Set([...skillsDone, id])];
    setSkillsDone(next); STO.set("lc-skills", next);
    setWizModule(null); setWizStep(0);
  };

  const getCycleDay = (date) => {
    const bleeds = Object.values(entries).filter(e=>e.bleeding&&e.bleeding!=="none").map(e=>e.date).sort();
    for(let i=bleeds.length-1;i>=0;i--){
      if(bleeds[i]<=date){
        if(i===0||diffD(bleeds[i-1],bleeds[i])>2) return diffD(bleeds[i],date)+1;
      }
    }
    return null;
  };

  const showNav = ["tracker","chart","skills","blog"].includes(page);

  return (
    <div style={{fontFamily:"'Libre Baskerville',Georgia,serif",background:"#FDFAF6",minHeight:"100vh",maxWidth:480,margin:"0 auto",position:"relative"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#F0EBE3}
        .sf{font-family:'DM Sans',-apple-system,sans-serif}
        .btn{border:none;cursor:pointer;transition:all .25s;font-family:'DM Sans',sans-serif}
        .btn-p{background:#6B5244;color:#FDFAF6;padding:14px 28px;border-radius:28px;font-weight:500;font-size:15px;letter-spacing:.2px}
        .btn-p:hover{background:#5A4438;transform:translateY(-1px)}
        .btn-s{background:transparent;color:#6B5244;border:1.5px solid #6B5244;padding:12px 24px;border-radius:28px;font-weight:500;font-size:14px}
        .btn-s:hover{background:#6B5244;color:#FDFAF6}
        .pill{display:inline-flex;align-items:center;padding:8px 14px;border-radius:20px;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;transition:all .2s;border:1.5px solid #DDD4C8;background:transparent;color:#6B5B4E}
        .pill.on{background:#6B5244;color:#FDFAF6;border-color:#6B5244}
        .crd{background:#fff;border-radius:16px;padding:20px;margin-bottom:12px;box-shadow:0 1px 8px rgba(107,82,68,.04)}
        .ntab{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 4px;background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:10px;color:#B8A898;transition:.2s}
        .ntab.on{color:#6B5244}
        .lbl{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#B8A898;margin-bottom:10px}
        .fin{animation:fi .4s ease}
        @keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        input[type=number],textarea{font-family:'DM Sans',sans-serif;font-size:16px;padding:12px 16px;border:1.5px solid #DDD4C8;border-radius:12px;background:#FDFAF6;color:#4A3F35;width:100%;outline:none;transition:border .2s}
        input:focus,textarea:focus{border-color:#6B5244}
        textarea{font-size:14px;resize:vertical;min-height:56px}
        sup.ref{color:#6B5244;font-size:9px;cursor:help;font-weight:600;margin-left:1px}
        a.src{color:#6B5244;text-decoration:none;font-size:13px;line-height:1.5}
        a.src:hover{text-decoration:underline}
        .tipbox{background:rgba(196,168,130,.08);border-left:3px solid #C4A882;border-radius:0 10px 10px 0;padding:12px 16px;margin:12px 0}
        .tipbox p{font-family:'DM Sans',sans-serif;font-size:13px;color:#7A6B5E;line-height:1.55}
        .progress-ring{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600}
      `}</style>

      {page==="landing" && <Landing setPage={setPage}/>}
      {page==="onboard" && <Onboard completeOnboard={completeOnboard}/>}
      {page==="skills" && !wizModule && <SkillsHub modules={WIZARD_MODULES} skillsDone={skillsDone} setWizModule={setWizModule} setWizStep={setWizStep} setPage={setPage}/>}
      {page==="skills" && wizModule && <WizardPlayer mod={wizModule} step={wizStep} setStep={setWizStep} onComplete={completeSkill} onBack={()=>{setWizModule(null);setWizStep(0)}}/>}
      {page==="tracker" && <Tracker entries={entries} save={save} curDate={curDate} setCurDate={setCurDate} getCycleDay={getCycleDay} skillsDone={skillsDone} setPage={setPage} setWizModule={setWizModule} setWizStep={setWizStep}/>}
      {page==="chart" && <Chart entries={entries} getCycleDay={getCycleDay} setCurDate={setCurDate} setPage={setPage}/>}
      {page==="blog" && <Blog setArticle={setArticle} setPage={setPage}/>}
      {page==="article" && <Article a={article} setPage={setPage}/>}

      {showNav && <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"rgba(253,250,246,.95)",backdropFilter:"blur(20px)",borderTop:"1px solid #E8E0D4",display:"flex",padding:"6px 0 env(safe-area-inset-bottom,8px)",zIndex:100}}>
        {[{id:"tracker",icon:"◉",l:"Today"},{id:"chart",icon:"▤",l:"Chart"},{id:"skills",icon:"✦",l:"Learn"},{id:"blog",icon:"❡",l:"Articles"}].map(t=>
          <button key={t.id} className={`ntab ${page===t.id?"on":""}`} onClick={()=>{setPage(t.id);if(t.id==="skills"){setWizModule(null);setWizStep(0);}}}>
            <span style={{fontSize:18}}>{t.icon}</span><span>{t.l}</span>
            {page===t.id&&<span style={{width:4,height:4,borderRadius:"50%",background:"#6B5244"}}/>}
          </button>
        )}
      </nav>}
    </div>
  );
}

// ─── LANDING ───
function Landing({setPage}) {
  const [showCompare, setShowCompare] = useState(false);

  const Section = ({label,children,style:s}) => <div style={{marginBottom:36,...s}}>
    <p className="lbl" style={{textAlign:"center",marginBottom:14}}>{label}</p>
    {children}
  </div>;

  const Check = ({yes}) => <span style={{color:yes?"#6B8B6A":"#C4756B",fontSize:13,fontWeight:600}}>{yes?"✓":"✗"}</span>;
  const Dash = () => <span style={{color:"#C4A882",fontSize:13}}>~</span>;

  return <div className="fin" style={{padding:"0 24px 40px"}}>
    {/* ──── Hero ──── */}
    <div style={{paddingTop:56,paddingBottom:36,textAlign:"center"}}>
      <div style={{width:56,height:56,borderRadius:"50%",background:"linear-gradient(145deg,#C4A882 0%,#6B5244 100%)",margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:24,color:"#FDFAF6"}}>◉</span></div>
      <h1 style={{fontSize:34,fontWeight:400,color:"#3A3028",letterSpacing:"-.5px",lineHeight:1.1}}>Luna<span style={{fontWeight:700}}>Chart</span></h1>
      <p className="sf" style={{fontSize:12,letterSpacing:2.5,textTransform:"uppercase",color:"#B8A898",marginTop:8}}>Justisse Method Fertility Tracker</p>
      <p style={{fontSize:17,color:"#6B5B4E",lineHeight:1.6,maxWidth:320,margin:"20px auto 0",fontStyle:"italic"}}>Learn to read your body's fertility signals with the science-backed Justisse Method.</p>
    </div>

    {/* ──── What this tool does ──── */}
    <Section label="What LunaChart Does">
      {[
        {icon:"✦",t:"Teaches you the method first",d:"Interactive skill modules walk you through cervical mucus observation, BBT tracking, and chart interpretation before you record anything. Most apps hand you a blank form."},
        {icon:"◐",t:"Records three biomarkers in detail",d:"Cervical mucus with Justisse's three-quality system (sensation + appearance + stretchiness), BBT with disturbed-temperature flagging, and cervical position."},
        {icon:"◉",t:"Keeps you in control",d:"You mark your own Peak Day, point of change, and fertile/infertile interpretations. No algorithm overrides your observations or tells you what day it thinks you're on."},
        {icon:"⊘",t:"Stores data on your device only",d:"No accounts, no cloud sync, no third-party access, no data monetization. Your fertility data stays on your device."},
      ].map((f,i)=><div key={i} className="crd" style={{display:"flex",gap:14,alignItems:"flex-start"}}>
        <span style={{fontSize:22,color:"#6B5244",flexShrink:0,marginTop:2}}>{f.icon}</span>
        <div><h3 className="sf" style={{fontSize:15,fontWeight:600,color:"#3A3028",marginBottom:3}}>{f.t}</h3>
        <p className="sf" style={{fontSize:13,color:"#8B7B6E",lineHeight:1.55}}>{f.d}</p></div>
      </div>)}
    </Section>

    {/* ──── What this tool does NOT do — honest ──── */}
    <Section label="What LunaChart Does Not Do">
      <div className="crd" style={{background:"rgba(196,168,130,.04)",border:"1px solid #E8E0D4"}}>
        <p className="sf" style={{fontSize:14,color:"#5A4E42",lineHeight:1.7,marginBottom:12}}>
          We think transparency matters — especially with health tools. Here's what LunaChart <strong>doesn't</strong> do:
        </p>
        {[
          {t:"No fertile/infertile predictions",d:"We never tell you \"you're safe today\" or \"you're fertile today.\" That interpretation is your skill to learn, ideally with a trained practitioner."},
          {t:"No automatic chart interpretation",d:"We don't auto-draw coverlines, auto-detect temperature shifts, or auto-identify Peak Day. You make those calls — that's the point of body literacy."},
          {t:"No practitioner replacement",d:"This app teaches foundations and records observations. It is not a substitute for working with a Justisse HRHP, especially if charting for pregnancy avoidance."},
          {t:"No multi-cycle analysis (yet)",d:"Right now, the chart view shows a rolling 30-day window. We don't yet offer cycle-over-cycle comparison, exportable practitioner reports, or historical pattern analysis."},
          {t:"No notifications or reminders",d:"We don't send push notifications to take your temperature or check mucus. Building a daily habit is part of the learning process."},
        ].map((item,i) => <div key={i} style={{display:"flex",gap:10,marginBottom:i<4?12:0,paddingBottom:i<4?12:0,borderBottom:i<4?"1px solid #EDE7DD":"none"}}>
          <span style={{color:"#C4756B",fontSize:14,fontWeight:700,flexShrink:0,marginTop:1}}>✗</span>
          <div>
            <p className="sf" style={{fontSize:13,fontWeight:600,color:"#5A4E42",marginBottom:2}}>{item.t}</p>
            <p className="sf" style={{fontSize:12,color:"#8B7B6E",lineHeight:1.5}}>{item.d}</p>
          </div>
        </div>)}
      </div>
    </Section>

    {/* ──── CTA ──── */}
    <div style={{textAlign:"center",marginBottom:36}}>
      <button className="btn btn-p" style={{width:"100%",padding:16,fontSize:16}} onClick={()=>setPage("onboard")}>Start Learning Free</button>
      <p className="sf" style={{fontSize:12,color:"#B8A898",marginTop:10}}>No account · No cloud · Your data stays yours</p>
    </div>

    {/* ──── Who this is for / not for ──── */}
    <Section label="Is LunaChart Right for You?">
      {/* Good fit */}
      <div className="crd" style={{background:"rgba(107,139,106,.04)",border:"1px solid rgba(107,139,106,.15)",marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <span style={{width:28,height:28,borderRadius:"50%",background:"#6B8B6A",color:"#FDFAF6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>✓</span>
          <p className="sf" style={{fontSize:14,fontWeight:600,color:"#6B8B6A"}}>LunaChart is a good fit if…</p>
        </div>
        {[
          { t:"You want real understanding", d:"You'd rather learn to read your body's signals yourself than have an app guess for you." },
          { t:"You can commit 2–5 min/day", d:"Observing mucus, taking temperature, and recording takes a few minutes of daily attention." },
          { t:"You're transitioning off hormonal BC", d:"Post-pill cycles are unpredictable — observation-based charting works from day one, prediction apps don't." },
          { t:"You have irregular cycles or PCOS", d:"When cycles range from 25 to 60+ days, real-time biomarker tracking is the only approach that adapts." },
          { t:"You're curious about Justisse specifically", d:"This app teaches the Justisse Method's categories, rules, and philosophy — not a generic FAM overview." },
          { t:"Privacy matters to you", d:"Your data never leaves your device. No accounts, no cloud, no third-party sharing." },
        ].map((item,i) => <div key={i} style={{display:"flex",gap:10,marginBottom:i<5?10:0,paddingBottom:i<5?10:0,borderBottom:i<5?"1px solid rgba(107,139,106,.12)":"none"}}>
          <span style={{color:"#6B8B6A",fontSize:13,flexShrink:0,marginTop:1}}>✓</span>
          <div>
            <p className="sf" style={{fontSize:13,fontWeight:600,color:"#3A3028",marginBottom:1}}>{item.t}</p>
            <p className="sf" style={{fontSize:12,color:"#6B5B4E",lineHeight:1.5}}>{item.d}</p>
          </div>
        </div>)}
      </div>

      {/* Not ideal */}
      <div className="crd" style={{background:"rgba(196,117,107,.03)",border:"1px solid rgba(196,117,107,.12)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <span style={{width:28,height:28,borderRadius:"50%",background:"#C4756B",color:"#FDFAF6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>→</span>
          <p className="sf" style={{fontSize:14,fontWeight:600,color:"#C4756B"}}>You might prefer something else if…</p>
        </div>
        {[
          { t:"You want a daily \"safe/not safe\" answer", d:"Natural Cycles gives you a green or red day classification. We deliberately don't — the interpretation is yours to learn." },
          { t:"You want set-and-forget contraception", d:"FAM requires daily engagement. If that's not for you, IUDs, implants, or pills might be a better match." },
          { t:"You need a powerful multi-cycle charting tool now", d:"Read Your Body has cycle-over-cycle views, colored stamps, practitioner exports, and multi-method support. It's the more mature charting app." },
          { t:"You want community and social features", d:"Flo and Kindara offer forums and peer support. LunaChart is a solo learning and tracking tool." },
          { t:"You need to share charts with a practitioner", d:"We don't yet have chart export or practitioner integration. Read Your Body handles this well today." },
        ].map((item,i) => <div key={i} style={{display:"flex",gap:10,marginBottom:i<4?10:0,paddingBottom:i<4?10:0,borderBottom:i<4?"1px solid rgba(196,117,107,.08)":"none"}}>
          <span style={{color:"#C4756B",fontSize:13,flexShrink:0,marginTop:1}}>→</span>
          <div>
            <p className="sf" style={{fontSize:13,fontWeight:600,color:"#3A3028",marginBottom:1}}>{item.t}</p>
            <p className="sf" style={{fontSize:12,color:"#6B5B4E",lineHeight:1.5}}>{item.d}</p>
          </div>
        </div>)}
      </div>
    </Section>

    {/* ──── Competitive Comparison ──── */}
    <Section label="How LunaChart Compares">
      <p className="sf" style={{fontSize:13,color:"#6B5B4E",lineHeight:1.6,marginBottom:14,textAlign:"center"}}>
        Different tools serve different needs. Here's an honest look at where LunaChart fits in the landscape.
      </p>

      {/* Comparison table */}
      <div className="crd" style={{padding:0,overflow:"hidden"}}>
        <table className="sf" style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
          <thead>
            <tr style={{background:"#6B5244"}}>
              <th style={{padding:"8px 8px",textAlign:"left",color:"#FDFAF6",fontWeight:500,fontSize:10}}>Feature</th>
              <th style={{padding:"8px 4px",textAlign:"center",color:"#FDFAF6",fontWeight:600,fontSize:10}}>Luna-<br/>Chart</th>
              <th style={{padding:"8px 4px",textAlign:"center",color:"#FDFAF6",fontWeight:500,fontSize:10}}>Read<br/>Your Body</th>
              <th style={{padding:"8px 4px",textAlign:"center",color:"#FDFAF6",fontWeight:500,fontSize:10}}>Natural<br/>Cycles</th>
              <th style={{padding:"8px 4px",textAlign:"center",color:"#FDFAF6",fontWeight:500,fontSize:10}}>Flo /<br/>Clue</th>
            </tr>
          </thead>
          <tbody>
            {[
              { f:"Teaches the method", lc:true, ryb:false, nc:false, fc:false },
              { f:"Justisse-specific categories", lc:true, ryb:"~", nc:false, fc:false },
              { f:"3-quality mucus tracking", lc:true, ryb:true, nc:false, fc:false },
              { f:"BBT charting", lc:true, ryb:true, nc:true, fc:false },
              { f:"Manual Peak Day marking", lc:true, ryb:true, nc:false, fc:false },
              { f:"No algorithm overrides", lc:true, ryb:true, nc:false, fc:false },
              { f:"Works with irregular cycles", lc:true, ryb:true, nc:"~", fc:false },
              { f:"Local-only data storage", lc:true, ryb:false, nc:false, fc:false },
              { f:"Multi-cycle comparison", lc:false, ryb:true, nc:true, fc:true },
              { f:"Auto coverline/shift detection", lc:false, ryb:false, nc:true, fc:false },
              { f:"Daily fertile/infertile verdict", lc:false, ryb:false, nc:true, fc:"~" },
              { f:"Practitioner chart export", lc:false, ryb:true, nc:false, fc:false },
              { f:"Colored stamps system", lc:false, ryb:true, nc:false, fc:false },
              { f:"Multiple FAM method support", lc:false, ryb:true, nc:false, fc:false },
              { f:"FDA clearance", lc:false, ryb:false, nc:true, fc:"~" },
              { f:"Community/social features", lc:false, ryb:false, nc:false, fc:true },
              { f:"Free to use fully", lc:true, ryb:false, nc:false, fc:"~" },
            ].map((row,i) => <tr key={i} style={{borderBottom:"1px solid #F0EBE3",background:i%2===0?"#FDFAF6":"#fff"}}>
              <td style={{padding:"7px 8px",color:"#5A4E42",fontSize:11}}>{row.f}</td>
              {[row.lc,row.ryb,row.nc,row.fc].map((v,j) => <td key={j} style={{padding:"7px 4px",textAlign:"center"}}>
                {v===true?<Check yes/>:v===false?<Check yes={false}/>:<Dash/>}
              </td>)}
            </tr>)}
          </tbody>
        </table>
      </div>

      <p className="sf" style={{fontSize:10,color:"#B8A898",marginTop:8,textAlign:"center"}}>✓ = yes · ✗ = no · ~ = partial or varies. Last reviewed March 2026.</p>

      {/* Expand to detailed breakdowns */}
      <button className="btn btn-s" style={{width:"100%",marginTop:12}} onClick={()=>setShowCompare(!showCompare)}>
        {showCompare ? "Hide Detailed Breakdown" : "Show Detailed Breakdown ↓"}
      </button>

      {showCompare && <div className="fin" style={{marginTop:14}}>
        {[
          {
            name:"Flo / Clue (free tier) / Ovia",
            type:"Period prediction apps",
            icon:"📱",
            what:"Track period dates and predict future periods and fertile windows from historical averages.",
            good:"Easy to use, free, great for period date tracking and symptom logging. Clue has strong EU-based privacy protections.",
            bad:"Fertile window predictions are based on calendar math — essentially a digital rhythm method. A 2016 study found most of these apps inaccurately predicted the actual fertile window. Should not be relied upon for pregnancy prevention or precise conception timing.",
            vs:"LunaChart doesn't predict anything. This is philosophical: we believe observation beats prediction. But if you just want period date tracking with a polished UI, these apps do that better than we do.",
          },
          {
            name:"Natural Cycles",
            type:"Algorithm-based contraceptive app",
            icon:"🌡️",
            what:"Uses a proprietary BBT algorithm to classify each day as 'red' (fertile) or 'green' (not fertile). First FDA-cleared digital contraceptive.",
            good:"Simple to use — just take your temperature and the app does the interpretation. FDA-cleared. Strong clinical data for its specific approach. Good for people with regular cycles who want a low-effort daily routine.",
            bad:"Relies only on temperature, which cannot detect approaching fertility in real time. Compensates with many conservative 'red days' (often 10+ per cycle). Less reliable for irregular cycles, post-pill transitions, or disrupted sleep. No cervical mucus integration. Costs ~$100/year.",
            vs:"LunaChart takes the opposite approach: you learn to read all three biomarkers yourself, which works in every reproductive scenario. But we don't give you a daily green/red answer — if you want that simplicity, Natural Cycles delivers it.",
          },
          {
            name:"Read Your Body",
            type:"Method-faithful charting app",
            icon:"📊",
            what:"A flexible recording app that lets you chart observations for almost any FAM method (Justisse, Billings, Sensiplan, etc.) without algorithmic interference.",
            good:"Customizable mucus categories, colored stamps, manual peak day and coverline marking, multi-cycle views, chart export for practitioners. Supports multiple methods. The community's gold standard charting tool.",
            bad:"Doesn't teach you the method — assumes you already know what you're doing or are learning from a practitioner. Premium features require a paid subscription. No built-in educational content.",
            vs:"Read Your Body is the more mature, more capable charting tool. If you already know the Justisse Method (or are learning from a practitioner), RYB is probably the better choice for ongoing charting. LunaChart's advantage is that it teaches you the method from scratch — we fill the gap between 'I'm curious about FAM' and 'I'm ready to chart independently in RYB.'",
          },
          {
            name:"Clue Birth Control / NC° Birth Control",
            type:"FDA-cleared contraceptive mode",
            icon:"💊",
            what:"Clue uses cycle-length calculations; Natural Cycles uses BBT algorithms. Both have regulatory clearance as digital contraceptive devices.",
            good:"Regulatory clearance provides a baseline of clinical validation. Simpler than learning a full FAM method.",
            bad:"Clearance standards are less rigorous than FDA approval. Clue's contraceptive mode doesn't use BBT or mucus at all — it's cycle-length-based. Neither integrates real-time cervical mucus tracking. The 'typical use' gap between clinical trials and real-world use is significant for all fertility apps.",
            vs:"LunaChart doesn't have FDA clearance and doesn't claim to be a contraceptive device. It's an educational tool and observation recorder. For actual pregnancy prevention, the Justisse Method itself (learned from a practitioner) is the contraceptive — LunaChart is just the notebook.",
          },
        ].map((comp,i) => <div key={i} className="crd" style={{marginBottom:10}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:20}}>{comp.icon}</span>
            <div>
              <p className="sf" style={{fontSize:14,fontWeight:600,color:"#3A3028"}}>{comp.name}</p>
              <p className="sf" style={{fontSize:11,color:"#B8A898"}}>{comp.type}</p>
            </div>
          </div>
          <p className="sf" style={{fontSize:12,color:"#6B5B4E",lineHeight:1.55,marginBottom:8}}>{comp.what}</p>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <div style={{padding:"8px 10px",background:"rgba(107,139,106,.04)",borderRadius:8}}>
              <p className="sf" style={{fontSize:11,fontWeight:600,color:"#6B8B6A",marginBottom:2}}>Strengths</p>
              <p className="sf" style={{fontSize:12,color:"#5A4E42",lineHeight:1.5}}>{comp.good}</p>
            </div>
            <div style={{padding:"8px 10px",background:"rgba(196,117,107,.03)",borderRadius:8}}>
              <p className="sf" style={{fontSize:11,fontWeight:600,color:"#C4756B",marginBottom:2}}>Limitations</p>
              <p className="sf" style={{fontSize:12,color:"#5A4E42",lineHeight:1.5}}>{comp.bad}</p>
            </div>
            <div style={{padding:"8px 10px",background:"rgba(107,82,68,.03)",borderRadius:8}}>
              <p className="sf" style={{fontSize:11,fontWeight:600,color:"#6B5244",marginBottom:2}}>How LunaChart compares</p>
              <p className="sf" style={{fontSize:12,color:"#5A4E42",lineHeight:1.5}}>{comp.vs}</p>
            </div>
          </div>
        </div>)}

        <div className="tipbox" style={{marginTop:8}}>
          <p style={{fontWeight:600,marginBottom:4}}>Our honest recommendation</p>
          <p>If you're new to FAM and want to learn the Justisse Method from the ground up, LunaChart's skill-based approach is designed for you. Once you're confident in your observations (typically 3+ cycles), many charters graduate to Read Your Body for its more powerful charting features — and that's a success, not a failure. The method knowledge you build here goes with you to any tool.</p>
        </div>
      </div>}
    </Section>

    {/* ──── The Justisse Method in 60 seconds ──── */}
    <Section label="The Justisse Method in 60 Seconds">
      <div className="crd">
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {[
            {n:"1",t:"Observe daily",d:"Check cervical mucus every bathroom visit (sensation + appearance + stretchiness). Take BBT before getting out of bed."},
            {n:"2",t:"Record the most fertile sign",d:"At day's end, chart the single most fertile observation. Dry morning + wet afternoon = chart wet."},
            {n:"3",t:"Identify your pattern",d:"Over 3 cycles, learn your Basic Infertile Pattern (BIP) — your personal baseline. Any change signals fertility."},
            {n:"4",t:"Find Peak Day",d:"The last day of peak-quality mucus (clear, stretchy, slippery). You know it the day after, when quality drops."},
            {n:"5",t:"Confirm with temperature",d:"A sustained BBT shift (3+ days above coverline) confirms ovulation occurred. The 'double-check' with Peak Day count gives high confidence."},
            {n:"6",t:"Apply to your goal",d:"Avoiding? Abstain or use barriers during the fertile window. Conceiving? Focus intercourse on peak mucus days. Monitoring health? Watch for patterns across cycles."},
          ].map((step,i) => <div key={i} style={{display:"flex",gap:12}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"#6B5244",color:"#FDFAF6",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:13,fontWeight:600}} className="sf">{step.n}</div>
            <div>
              <p className="sf" style={{fontSize:14,fontWeight:600,color:"#3A3028",marginBottom:2}}>{step.t}</p>
              <p className="sf" style={{fontSize:12,color:"#8B7B6E",lineHeight:1.5}}>{step.d}</p>
            </div>
          </div>)}
        </div>
      </div>
      <p className="sf" style={{fontSize:12,color:"#B8A898",textAlign:"center",marginTop:8,fontStyle:"italic"}}>
        Source: Matus, G. (2012). Justisse Method User's Guide. Justisse-Healthworks for Women.
        <br/>Effectiveness data: Peragallo Urrutia et al. (2018); Frank-Herrmann et al. (2007).
      </p>
    </Section>

    {/* ──── CTA ──── */}
    <div style={{textAlign:"center",marginBottom:36}}>
      <button className="btn btn-p" style={{width:"100%",padding:16,fontSize:16}} onClick={()=>setPage("onboard")}>Start Learning Free</button>
      <p className="sf" style={{fontSize:12,color:"#B8A898",marginTop:10}}>No account · No cloud · Your data stays yours</p>
    </div>

    {/* ──── From the blog ──── */}
    <Section label="From the Blog">
      {ARTICLES.slice(0,3).map(a=><div key={a.id} className="crd" style={{cursor:"pointer"}} onClick={()=>setPage("blog")}>
        <span className="sf" style={{fontSize:10,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:"#C4A882"}}>{a.cat}</span>
        <h4 style={{fontSize:15,color:"#3A3028",marginTop:4,lineHeight:1.3,fontWeight:400}}>{a.title}</h4>
        <p className="sf" style={{fontSize:11,color:"#B8A898",marginTop:4}}>{a.time} · {a.for}</p>
      </div>)}
      <button className="btn btn-s" style={{width:"100%",marginTop:6}} onClick={()=>setPage("blog")}>Browse All Articles →</button>
    </Section>

    {/* ──── Footer ──── */}
    <footer style={{textAlign:"center",padding:"28px 0",borderTop:"1px solid #E8E0D4"}}>
      <p style={{fontSize:18,fontWeight:400,color:"#3A3028",marginBottom:8}}>Luna<span style={{fontWeight:700}}>Chart</span></p>
      <p className="sf" style={{fontSize:11,color:"#B8A898",lineHeight:1.7}}>
        Built on the Justisse Method of Fertility Awareness.<br/>
        Educational tool — not a medical device or contraceptive.<br/>
        Not FDA-cleared. Not a substitute for professional instruction.<br/>
        Work with a <a href="https://justisse.ca/chart-your-cycle/" target="_blank" rel="noopener" style={{color:"#6B5244"}}>Justisse HRHP</a> for personalized guidance.
      </p>
      <p className="sf" style={{fontSize:10,color:"#C4B8A0",marginTop:10}}>
        Justisse Method is a trademark of Justisse College International.<br/>
        LunaChart is an independent educational project and is not affiliated with Justisse College International.
      </p>
    </footer>
  </div>;
}

// ─── ONBOARDING ───
function Onboard({completeOnboard}) {
  const [s,setS]=useState(0);
  const [g,setG]=useState(null);
  const steps=[
    {t:"Your body has a language", d:"Every cycle, your body produces observable signs of fertility and infertility. The Justisse Method — founded in 1987, used by thousands worldwide — teaches you to read them with precision."},
    {t:"What brings you here?", d:"Your intention shapes your charting approach. You can change this anytime.", opts:[
      {id:"literacy",l:"Body literacy",d:"Understand my cycle"},
      {id:"avoid",l:"Pregnancy avoidance",d:"Natural birth control"},
      {id:"achieve",l:"Trying to conceive",d:"Optimize timing"},
      {id:"health",l:"Health monitoring",d:"Track hormonal health"},
    ]},
    {t:"How LunaChart teaches you", d:"Unlike other apps, we don't just give you blank forms. Our skills wizard walks you through each biomarker with interactive lessons before you start tracking.", items:[
      "✦  Skill 1 — Cervical mucus observation (the most important!)",
      "☉  Skill 2 — Basal body temperature technique",
      "◎  Skill 3 — Cervical position (optional)",
      "▤  Skill 4 — Reading and interpreting your chart",
    ]},
    {t:"One important note", d:"The Justisse Method is most effective when learned with a trained Holistic Reproductive Health Practitioner (HRHP). This app teaches the foundations and provides a charting tool — but professional guidance is strongly recommended, especially for pregnancy avoidance.", note:"Find a practitioner at justisse.ca — most offer virtual sessions worldwide."},
  ];
  const c=steps[s];
  return <div className="fin" style={{padding:"56px 24px 40px",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
    <div style={{display:"flex",gap:5,marginBottom:36}}>{steps.map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=s?"#6B5244":"#E8E0D4",transition:".3s"}}/>)}</div>
    <div style={{flex:1}}>
      <h2 style={{fontSize:26,fontWeight:400,color:"#3A3028",lineHeight:1.2,marginBottom:14}}>{c.t}</h2>
      <p className="sf" style={{fontSize:15,color:"#6B5B4E",lineHeight:1.65,marginBottom:20}}>{c.d}</p>
      {c.opts&&<div style={{display:"flex",flexDirection:"column",gap:8}}>{c.opts.map(o=>
        <button key={o.id} onClick={()=>setG(o.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:12,border:`1.5px solid ${g===o.id?"#6B5244":"#E8E0D4"}`,background:g===o.id?"rgba(107,82,68,.04)":"#fff",cursor:"pointer",textAlign:"left"}}>
          <span style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${g===o.id?"#6B5244":"#DDD4C8"}`,background:g===o.id?"#6B5244":"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>{g===o.id&&<span style={{width:7,height:7,borderRadius:"50%",background:"#FDFAF6"}}/>}</span>
          <div><p className="sf" style={{fontSize:15,fontWeight:500,color:"#3A3028"}}>{o.l}</p><p className="sf" style={{fontSize:12,color:"#B8A898"}}>{o.d}</p></div>
        </button>
      )}</div>}
      {c.items&&<div style={{display:"flex",flexDirection:"column",gap:10}}>{c.items.map((it,i)=><div key={i} className="crd" style={{margin:0}}><p className="sf" style={{fontSize:14,color:"#6B5B4E"}}>{it}</p></div>)}</div>}
      {c.note&&<div className="tipbox" style={{marginTop:20}}><p>{c.note}</p></div>}
    </div>
    <div style={{display:"flex",gap:10,marginTop:28}}>
      {s>0&&<button className="btn btn-s" onClick={()=>setS(s-1)} style={{flex:1}}>Back</button>}
      <button className="btn btn-p" style={{flex:1}} onClick={()=>{if(s<steps.length-1)setS(s+1);else completeOnboard(g||"literacy");}} disabled={s===1&&!g}>{s===steps.length-1?"Begin Learning":"Continue"}</button>
    </div>
  </div>;
}

// ─── SKILLS HUB ───
function SkillsHub({modules,skillsDone,setWizModule,setWizStep,setPage}) {
  const pct = Math.round(skillsDone.length/modules.length*100);
  return <div className="fin" style={{padding:"16px 20px 100px"}}>
    <div style={{textAlign:"center",marginBottom:20}}>
      <h2 style={{fontSize:24,fontWeight:400,color:"#3A3028",marginBottom:4}}>Learn the Method</h2>
      <p className="sf" style={{fontSize:13,color:"#B8A898"}}>Interactive skill modules · Complete at your pace</p>
      <div style={{marginTop:16,height:6,background:"#E8E0D4",borderRadius:3,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#C4A882,#6B5244)",borderRadius:3,transition:"width .5s"}}/>
      </div>
      <p className="sf" style={{fontSize:12,color:"#B8A898",marginTop:6}}>{skillsDone.length} of {modules.length} modules complete</p>
    </div>

    {modules.map((m,i)=>{
      const done=skillsDone.includes(m.id);
      return <div key={m.id} className="crd" style={{display:"flex",gap:14,alignItems:"center",cursor:"pointer",opacity:1}} onClick={()=>{setWizModule(m);setWizStep(0);}}>
        <div className="progress-ring" style={{background:done?"#6B5244":"#F0EBE3",color:done?"#FDFAF6":"#6B5244"}}>{done?"✓":m.icon}</div>
        <div style={{flex:1}}>
          <h3 className="sf" style={{fontSize:15,fontWeight:600,color:"#3A3028"}}>{m.title}</h3>
          <p className="sf" style={{fontSize:12,color:"#B8A898"}}>{m.steps.length} steps · {m.duration}{done?" · Completed":""}</p>
        </div>
        <span className="sf" style={{fontSize:18,color:"#C4B8A0"}}>›</span>
      </div>;
    })}

    {skillsDone.length>=2&&<div style={{marginTop:20,textAlign:"center"}}>
      <button className="btn btn-p" onClick={()=>setPage("tracker")}>Open Tracker →</button>
      <p className="sf" style={{fontSize:12,color:"#B8A898",marginTop:8}}>You can always come back to learn more</p>
    </div>}

    <div style={{marginTop:28}}>
      <p className="lbl" style={{textAlign:"center"}}>Recommended Reading</p>
      {ARTICLES.filter(a=>["Method Education","How-To"].includes(a.cat)).slice(0,2).map(a=><div key={a.id} className="crd" style={{cursor:"pointer"}} onClick={()=>{setPage("blog");}}>
        <span className="sf" style={{fontSize:10,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:"#C4A882"}}>{a.cat}</span>
        <h4 style={{fontSize:14,color:"#3A3028",marginTop:4,lineHeight:1.3}}>{a.title}</h4>
      </div>)}
    </div>
  </div>;
}

// ─── WIZARD PLAYER ───
function WizardPlayer({mod,step,setStep,onComplete,onBack}) {
  const s=mod.steps[step];
  const total=mod.steps.length;
  const isLast=step===total-1;

  return <div className="fin" style={{padding:"16px 24px 40px",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
      <button className="btn" style={{background:"none",fontSize:14,color:"#6B5244",padding:"8px 0"}} onClick={onBack}>← Back</button>
      <div style={{flex:1,textAlign:"center"}}>
        <p className="sf" style={{fontSize:11,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:"#C4A882"}}>{mod.title}</p>
      </div>
      <span className="sf" style={{fontSize:12,color:"#B8A898"}}>{step+1}/{total}</span>
    </div>

    <div style={{display:"flex",gap:4,marginBottom:28}}>{mod.steps.map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=step?"#6B5244":"#E8E0D4",transition:".3s"}}/>)}</div>

    <div style={{flex:1}} className="fin" key={step}>
      <h3 style={{fontSize:22,fontWeight:400,color:"#3A3028",lineHeight:1.25,marginBottom:14}}>{s.h}</h3>
      {s.p.split("\n").map((para,i)=><p key={i} className="sf" style={{fontSize:15,color:"#5A4E42",lineHeight:1.7,marginBottom:12,whiteSpace:"pre-wrap"}}>{para}</p>)}
      {s.tip&&<div className="tipbox" style={{marginTop:16}}>
        <p style={{fontWeight:600,marginBottom:4,fontSize:12,letterSpacing:.5,textTransform:"uppercase",color:"#8B7B6E"}}>💡 Practitioner tip</p>
        <p>{s.tip}</p>
      </div>}
    </div>

    <div style={{display:"flex",gap:10,marginTop:24}}>
      {step>0&&<button className="btn btn-s" onClick={()=>setStep(step-1)} style={{flex:1}}>Previous</button>}
      <button className="btn btn-p" style={{flex:1}} onClick={()=>{if(!isLast)setStep(step+1);else onComplete(mod.id);}}>
        {isLast?"Complete Module":"Next"}
      </button>
    </div>
  </div>;
}

// ─── TRACKER ───
function Tracker({entries,save,curDate,setCurDate,getCycleDay,skillsDone,setPage,setWizModule,setWizStep}) {
  const e=entries[curDate]||{};
  const cd=getCycleDay(curDate);
  const [open,setOpen]=useState("mucus");

  const nav=(dir)=>{const d=new Date(curDate);d.setDate(d.getDate()+dir);setCurDate(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`);};

  // Contextual education: show inline help based on which skills are completed
  const needsMucusSkill = !skillsDone.includes("mucus");
  const needsBBTSkill = !skillsDone.includes("bbt");

  const getFertility = () => {
    if(e.peakDay) return {l:"Peak Day",c:"#B85450",bg:"rgba(184,84,80,.06)"};
    if(e.pointOfChange) return {l:"Point of Change — Fertile Window Open",c:"#C4A882",bg:"rgba(196,168,130,.06)"};
    if(e.mucusSensation&&e.mucusSensation!=="D0") return {l:"Mucus Observed — Potentially Fertile",c:"#C4A882",bg:"rgba(196,168,130,.06)"};
    if(e.mucusSensation==="D0") return {l:"Dry — Observe BIP",c:"#6B8B6A",bg:"rgba(107,139,106,.06)"};
    return {l:"Record today's observations",c:"#B8A898",bg:"rgba(184,168,152,.04)"};
  };
  const fert=getFertility();

  return <div className="fin" style={{padding:"14px 20px 100px"}}>
    {/* Date nav */}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
      <button className="btn" style={{background:"none",fontSize:22,color:"#6B5244",padding:8}} onClick={()=>nav(-1)}>‹</button>
      <div style={{textAlign:"center"}}>
        <p style={{fontSize:20,fontWeight:400,color:"#3A3028"}}>{fmtFull(curDate)}</p>
        {cd&&<p className="sf" style={{fontSize:12,color:"#B8A898",marginTop:1}}>Cycle Day {cd}</p>}
      </div>
      <button className="btn" style={{background:"none",fontSize:22,color:curDate>=td()?"#E8E0D4":"#6B5244",padding:8}} onClick={()=>nav(1)} disabled={curDate>=td()}>›</button>
    </div>

    {/* Fertility banner */}
    <div style={{background:fert.bg,border:`1px solid ${fert.c}18`,borderRadius:12,padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:8,height:8,borderRadius:"50%",background:fert.c}}/>
      <p className="sf" style={{fontSize:13,fontWeight:500,color:fert.c}}>{fert.l}</p>
    </div>

    {/* Quick marks */}
    <div style={{display:"flex",gap:6,marginBottom:14}}>
      <button className={`pill ${e.peakDay?"on":""}`} onClick={()=>save(curDate,{peakDay:!e.peakDay})} style={{flex:1,justifyContent:"center",fontSize:12}}>★ Peak Day</button>
      <button className={`pill ${e.pointOfChange?"on":""}`} onClick={()=>save(curDate,{pointOfChange:!e.pointOfChange})} style={{flex:1,justifyContent:"center",fontSize:12}}>⬆ Point of Change</button>
    </div>

    {/* Bleeding */}
    <div className="crd">
      <p className="lbl">Bleeding</p>
      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
        {BLEED.map(b=><button key={b.id} className={`pill ${e.bleeding===b.id?"on":""}`} onClick={()=>save(curDate,{bleeding:b.id})} style={{fontSize:12}}>
          {b.dots>0&&<span style={{marginRight:4,color:e.bleeding===b.id?"#FDFAF6":b.color}}>{"●".repeat(b.dots)}</span>}{b.label}
        </button>)}
      </div>
    </div>

    {/* CERVICAL MUCUS with contextual education */}
    <div className="crd">
      <button className="btn" onClick={()=>setOpen(open==="mucus"?null:"mucus")} style={{background:"none",width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:0}}>
        <p className="lbl" style={{marginBottom:0}}>Cervical Mucus</p>
        <span className="sf" style={{fontSize:16,color:"#B8A898"}}>{open==="mucus"?"−":"+"}</span>
      </button>
      {open==="mucus"&&<div className="fin" style={{marginTop:12}}>
        {needsMucusSkill&&<div className="tipbox" style={{marginBottom:14,cursor:"pointer"}} onClick={()=>{setPage("skills");setWizModule(WIZARD_MODULES[1]);setWizStep(0);}}>
          <p>🎓 <strong>New to mucus tracking?</strong> Take the 5-minute interactive lesson first → it'll teach you exactly what to look for.</p>
        </div>}

        <p className="sf" style={{fontSize:12,color:"#B8A898",marginBottom:6}}>Sensation <span style={{fontStyle:"italic",color:"#C4A882"}}>(what you felt wiping)</span></p>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
          {SENS.map(s=><button key={s.id} className={`pill ${e.mucusSens===s.id?"on":""}`} onClick={()=>save(curDate,{mucusSens:s.id})} title={s.desc}>
            <span style={{marginRight:5,fontSize:14}}>{s.icon}</span>{s.label}
          </button>)}
        </div>
        {e.mucusSens&&<p className="sf" style={{fontSize:11,color:"#8B7B6E",marginBottom:12,fontStyle:"italic"}}>{SENS.find(s=>s.id===e.mucusSens)?.desc}</p>}

        <p className="sf" style={{fontSize:12,color:"#B8A898",marginBottom:6}}>Appearance <span style={{fontStyle:"italic",color:"#C4A882"}}>(what you saw on tissue)</span></p>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
          {APPEAR.map(a=><button key={a.id} className={`pill ${e.mucusApp===a.id?"on":""}`} onClick={()=>save(curDate,{mucusApp:a.id})} title={a.desc} style={{fontSize:12}}>
            {a.label}
          </button>)}
        </div>
        {e.mucusApp&&<p className="sf" style={{fontSize:11,color:"#8B7B6E",marginBottom:12,fontStyle:"italic"}}>{APPEAR.find(a=>a.id===e.mucusApp)?.desc}</p>}

        <p className="sf" style={{fontSize:12,color:"#B8A898",marginBottom:6}}>Stretchiness <span style={{fontStyle:"italic",color:"#C4A882"}}>(finger test)</span></p>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {STRETCH.map(s=><button key={s.id} className={`pill ${e.mucusStr===s.id?"on":""}`} onClick={()=>save(curDate,{mucusStr:s.id})} style={{fontSize:12}}>
            {s.label}
          </button>)}
        </div>

        <div className="tipbox" style={{marginTop:14}}>
          <p>💡 Record the <strong>most fertile</strong> observation from your entire day. Check every bathroom visit — chart the "winner" at day's end.</p>
        </div>
      </div>}
    </div>

    {/* BBT with contextual education */}
    <div className="crd">
      <button className="btn" onClick={()=>setOpen(open==="bbt"?null:"bbt")} style={{background:"none",width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:0}}>
        <p className="lbl" style={{marginBottom:0}}>Basal Body Temperature</p>
        <span className="sf" style={{fontSize:16,color:"#B8A898"}}>{open==="bbt"?"−":"+"}</span>
      </button>
      {open==="bbt"&&<div className="fin" style={{marginTop:12}}>
        {needsBBTSkill&&<div className="tipbox" style={{marginBottom:14,cursor:"pointer"}} onClick={()=>{setPage("skills");setWizModule(WIZARD_MODULES[2]);setWizStep(0);}}>
          <p>🎓 <strong>Haven't taken BBT before?</strong> The 4-minute temperature lesson covers exactly how to measure it correctly →</p>
        </div>}

        <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
          <div style={{flex:1}}>
            <p className="sf" style={{fontSize:12,color:"#B8A898",marginBottom:5}}>Temperature (°C)</p>
            <input type="number" step="0.01" min="35" max="38" placeholder="36.45" value={e.bbt||""} onChange={ev=>save(curDate,{bbt:ev.target.value})}/>
          </div>
          <button className={`pill ${e.bbtDist?"on":""}`} style={{fontSize:11,padding:"8px 12px",marginBottom:2}} onClick={()=>save(curDate,{bbtDist:!e.bbtDist})}>⊘ Disturbed</button>
        </div>
        <p className="sf" style={{fontSize:11,color:"#B8A898",marginTop:8}}>Take before any activity · Same time daily · Hold 3 min</p>
        {e.bbtDist&&<div className="tipbox" style={{marginTop:10}}>
          <p>Marked as disturbed — this reading will be excluded from shift interpretation. Common causes: illness, alcohol, disrupted sleep, unusual wake time.</p>
        </div>}
      </div>}
    </div>

    {/* Cervix */}
    <div className="crd">
      <button className="btn" onClick={()=>setOpen(open==="cx"?null:"cx")} style={{background:"none",width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:0}}>
        <p className="lbl" style={{marginBottom:0}}>Cervical Position <span style={{fontWeight:400,fontSize:10,color:"#C4A882"}}>(optional)</span></p>
        <span className="sf" style={{fontSize:16,color:"#B8A898"}}>{open==="cx"?"−":"+"}</span>
      </button>
      {open==="cx"&&<div className="fin" style={{marginTop:12}}>
        {[{l:"Height",opts:CERVPOS,k:"cxPos",tip:"Fertile: high · Infertile: low"},{l:"Texture",opts:CERVTEX,k:"cxTex",tip:"Fertile: soft · Infertile: firm"},{l:"Opening",opts:CERVOP,k:"cxOp",tip:"Fertile: open · Infertile: closed"}].map(g=>
          <div key={g.k} style={{marginBottom:10}}>
            <p className="sf" style={{fontSize:12,color:"#B8A898",marginBottom:5}}>{g.l} <span style={{fontStyle:"italic",color:"#C4A882",fontSize:11}}>{g.tip}</span></p>
            <div style={{display:"flex",gap:5}}>{g.opts.map(o=><button key={o.id} className={`pill ${e[g.k]===o.id?"on":""}`} onClick={()=>save(curDate,{[g.k]:o.id})} style={{flex:1,justifyContent:"center"}}>{o.label}</button>)}</div>
          </div>
        )}
      </div>}
    </div>

    {/* Notes */}
    <div className="crd">
      <p className="lbl">Notes & Symptoms</p>
      <textarea placeholder="Energy, mood, sleep, exercise, stress, medications..." value={e.notes||""} onChange={ev=>save(curDate,{notes:ev.target.value})}/>
    </div>
  </div>;
}

// ─── CHART ───
function Chart({entries,getCycleDay,setCurDate,setPage}) {
  const [selectedDay, setSelectedDay] = useState(null);
  const sorted=Object.keys(entries).sort().slice(-34);
  const bbts=sorted.map(d=>parseFloat(entries[d]?.bbt)).filter(v=>!isNaN(v));
  const mn=bbts.length?Math.min(...bbts)-.1:36;
  const mx=bbts.length?Math.max(...bbts)+.1:37;
  const rng=mx-mn||1;

  const goToDay = (d) => { setCurDate(d); setPage("tracker"); };

  const sel = selectedDay ? entries[selectedDay] : null;
  const selSens = sel ? SENS.find(s=>s.id===sel.mucusSens) : null;
  const selApp = sel ? APPEAR.find(a=>a.id===sel.mucusApp) : null;
  const selStr = sel ? STRETCH.find(s=>s.id===sel.mucusStr) : null;
  const selBl = sel ? BLEED.find(b=>b.id===sel.bleeding) : null;

  return <div className="fin" style={{padding:"16px 12px 100px"}}>
    <h2 style={{fontSize:22,fontWeight:400,color:"#3A3028",textAlign:"center",marginBottom:2}}>Cycle Chart</h2>
    <p className="sf" style={{fontSize:12,color:"#B8A898",textAlign:"center",marginBottom:18}}>Tap any day to see details · Tap again to edit</p>

    {!sorted.length?<div className="crd" style={{textAlign:"center",padding:40}}>
      <p style={{fontSize:44,marginBottom:12}}>◉</p>
      <p className="sf" style={{fontSize:15,color:"#6B5B4E"}}>No entries yet</p>
      <p className="sf" style={{fontSize:13,color:"#B8A898",marginTop:6}}>Start charting on the Today tab to see data here.</p>
    </div>:<>
      {/* BBT Graph */}
      <div className="crd" style={{padding:"14px 6px"}}>
        <p className="lbl" style={{paddingLeft:6}}>BBT Temperature</p>
        <div style={{height:140,position:"relative",marginTop:6,marginLeft:28}}>
          {[0,.25,.5,.75,1].map(p=><div key={p} style={{position:"absolute",left:-28,right:0,bottom:`${p*100}%`,borderBottom:"1px solid #F0EBE3"}}>
            <span className="sf" style={{fontSize:8,color:"#C4B8A0",position:"absolute",left:0,bottom:1}}>{(mn+rng*p).toFixed(2)}</span>
          </div>)}
          <svg width="100%" height="100%" viewBox={`0 0 ${sorted.length*13} 140`} style={{overflow:"visible",cursor:"pointer"}}>
            {sorted.map((d,i)=>{
              const v=parseFloat(entries[d]?.bbt);if(isNaN(v))return null;
              const y=140-((v-mn)/rng*130+5),x=i*13+6,dist=entries[d]?.bbtDist;
              const isPeak = entries[d]?.peakDay;
              const isSelected = d===selectedDay;
              return <g key={d} onClick={()=>setSelectedDay(selectedDay===d?null:d)} style={{cursor:"pointer"}}>
                {i>0&&(()=>{const pv=parseFloat(entries[sorted[i-1]]?.bbt);if(isNaN(pv))return null;const py=140-((pv-mn)/rng*130+5);return<line x1={(i-1)*13+6} y1={py} x2={x} y2={y} stroke={isPeak?"#B85450":"#C4A882"} strokeWidth="1.5" opacity=".4"/>})()}
                {isSelected && <line x1={x} y1={0} x2={x} y2={140} stroke="#6B5244" strokeWidth="1" opacity=".2" strokeDasharray="3,3"/>}
                <circle cx={x} cy={y} r={isSelected?5:dist?2.5:3.5} fill={dist?"transparent":isPeak?"#B85450":isSelected?"#6B5244":"#6B5244"} stroke={isSelected?"#6B5244":dist?"#B8A898":isPeak?"#B85450":"#6B5244"} strokeWidth={isSelected?2:1.5}/>
                {isPeak && <text x={x} y={y-8} textAnchor="middle" style={{fontSize:8,fill:"#B85450",fontFamily:"DM Sans",fontWeight:600}}>PK</text>}
                {entries[d]?.pointOfChange && <text x={x} y={y-8} textAnchor="middle" style={{fontSize:8,fill:"#C4A882",fontFamily:"DM Sans",fontWeight:600}}>⬆</text>}
              </g>;
            })}
            {/* Coverline — drawn at 36.38 (0.05 above highest pre-shift temp of 36.33) */}
            {(()=>{
              const coverY = 140-((36.38-mn)/rng*130+5);
              return <line x1={0} y1={coverY} x2={sorted.length*13} y2={coverY} stroke="#B85450" strokeWidth="1" strokeDasharray="4,4" opacity=".4"/>;
            })()}
          </svg>
        </div>
        <div className="sf" style={{display:"flex",gap:12,justifyContent:"center",marginTop:8,fontSize:10,color:"#B8A898"}}>
          <span>● BBT</span>
          <span style={{color:"#B85450"}}>● Peak Day</span>
          <span style={{color:"#B85450"}}>┅ Coverline</span>
          <span>○ Disturbed</span>
        </div>
      </div>

      {/* Selected Day Detail Panel */}
      {sel && <div className="crd fin" style={{background:"rgba(107,82,68,.02)",border:"1px solid #E8E0D4",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <p className="sf" style={{fontSize:16,fontWeight:600,color:"#3A3028"}}>{fmtFull(selectedDay)}</p>
            <p className="sf" style={{fontSize:12,color:"#B8A898"}}>
              Cycle Day {getCycleDay(selectedDay) || "–"}
              {sel.peakDay && <span style={{color:"#B85450",fontWeight:600}}> · ★ Peak Day</span>}
              {sel.pointOfChange && <span style={{color:"#C4A882",fontWeight:600}}> · ⬆ Point of Change</span>}
            </p>
          </div>
          <button className="btn btn-s" style={{padding:"6px 14px",fontSize:12}} onClick={()=>goToDay(selectedDay)}>Edit →</button>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {/* Mucus detail */}
          <div style={{background:"#fff",borderRadius:10,padding:"10px 12px"}}>
            <p className="sf" style={{fontSize:10,fontWeight:600,color:"#B8A898",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Cervical Mucus</p>
            {selSens ? <>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                <span style={{width:10,height:10,borderRadius:"50%",background:selSens.color}}/>
                <span className="sf" style={{fontSize:13,fontWeight:500,color:"#3A3028"}}>{selSens.label}</span>
              </div>
              {selApp && <p className="sf" style={{fontSize:12,color:"#6B5B4E"}}>{selApp.label}</p>}
              {selStr && selStr.id!=="0" && <p className="sf" style={{fontSize:11,color:"#8B7B6E"}}>Stretch: {selStr.label}</p>}
            </> : <p className="sf" style={{fontSize:12,color:"#B8A898"}}>Not recorded</p>}
          </div>

          {/* BBT detail */}
          <div style={{background:"#fff",borderRadius:10,padding:"10px 12px"}}>
            <p className="sf" style={{fontSize:10,fontWeight:600,color:"#B8A898",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Temperature</p>
            {sel.bbt ? <>
              <p className="sf" style={{fontSize:20,fontWeight:600,color:"#3A3028"}}>{sel.bbt}°C</p>
              {sel.bbtDist && <p className="sf" style={{fontSize:11,color:"#C4756B"}}>⊘ Disturbed</p>}
            </> : <p className="sf" style={{fontSize:12,color:"#B8A898"}}>Not recorded</p>}
          </div>

          {/* Bleeding detail */}
          <div style={{background:"#fff",borderRadius:10,padding:"10px 12px"}}>
            <p className="sf" style={{fontSize:10,fontWeight:600,color:"#B8A898",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Bleeding</p>
            {selBl && selBl.id!=="none" ? <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{color:selBl.color,fontSize:14}}>{"●".repeat(selBl.dots)}</span>
              <span className="sf" style={{fontSize:13,color:"#3A3028"}}>{selBl.label}</span>
            </div> : <p className="sf" style={{fontSize:12,color:"#B8A898"}}>None</p>}
          </div>

          {/* Cervix detail */}
          <div style={{background:"#fff",borderRadius:10,padding:"10px 12px"}}>
            <p className="sf" style={{fontSize:10,fontWeight:600,color:"#B8A898",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Cervix</p>
            {sel.cxPos ? <p className="sf" style={{fontSize:12,color:"#3A3028"}}>
              {CERVPOS.find(c=>c.id===sel.cxPos)?.label} · {CERVTEX.find(c=>c.id===sel.cxTex)?.label} · {CERVOP.find(c=>c.id===sel.cxOp)?.label}
            </p> : <p className="sf" style={{fontSize:12,color:"#B8A898"}}>Not recorded</p>}
          </div>
        </div>

        {sel.notes && <div style={{marginTop:10,padding:"8px 12px",background:"#fff",borderRadius:10}}>
          <p className="sf" style={{fontSize:10,fontWeight:600,color:"#B8A898",letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Notes</p>
          <p className="sf" style={{fontSize:13,color:"#5A4E42",lineHeight:1.5}}>{sel.notes}</p>
        </div>}
      </div>}

      {/* Day-by-day strip */}
      <div style={{display:"flex",flexDirection:"column",gap:1,marginTop:4}}>
        <div style={{display:"flex",padding:"0 6px",marginBottom:3}}>
          <span className="sf" style={{width:38,fontSize:9,color:"#B8A898"}}>Date</span>
          <span className="sf" style={{width:24,fontSize:9,color:"#B8A898",textAlign:"center"}}>CD</span>
          <span className="sf" style={{width:28,fontSize:9,color:"#B8A898",textAlign:"center"}}>Bleed</span>
          <span className="sf" style={{flex:1,fontSize:9,color:"#B8A898",textAlign:"center"}}>Mucus</span>
          <span className="sf" style={{width:40,fontSize:9,color:"#B8A898",textAlign:"center"}}>BBT</span>
          <span className="sf" style={{width:20,fontSize:9,color:"#B8A898",textAlign:"center"}}>Flag</span>
        </div>
        {sorted.map(d=>{
          const en=entries[d],cy=getCycleDay(d);
          const bl=BLEED.find(b=>b.id===en.bleeding);
          const sn=SENS.find(s=>s.id===en.mucusSens);
          const ap=APPEAR.find(a=>a.id===en.mucusApp);
          const isSelected = d===selectedDay;
          return <div key={d} onClick={()=>setSelectedDay(selectedDay===d?null:d)}
            style={{display:"flex",alignItems:"center",padding:"6px 6px",cursor:"pointer",
              background:isSelected?"rgba(107,82,68,.06)":en.peakDay?"rgba(184,84,80,.04)":"#fff",
              borderRadius:8,borderLeft:isSelected?"3px solid #6B5244":"3px solid transparent",
              transition:"all .15s"}}>
            <span className="sf" style={{width:38,fontSize:11,color:isSelected?"#3A3028":"#6B5B4E",fontWeight:isSelected?600:400}}>{d.slice(5)}</span>
            <span className="sf" style={{width:24,fontSize:11,color:"#B8A898",textAlign:"center"}}>{cy||"–"}</span>
            <span style={{width:28,textAlign:"center",fontSize:10,color:bl?.color||"#E8E0D4"}}>{"●".repeat(bl?.dots||0)||"·"}</span>
            <span style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
              {sn&&<span style={{width:12,height:12,borderRadius:"50%",background:sn.color,flexShrink:0}} title={sn.label}/>}
              {ap&&<span className="sf" style={{fontSize:9,color:"#8B7B6E"}}>{ap.id}</span>}
            </span>
            <span className="sf" style={{width:40,fontSize:10,color:en.bbtDist?"#B8A898":"#6B5B4E",textAlign:"center",textDecoration:en.bbtDist?"line-through":"none"}}>{en.bbt||"–"}</span>
            <span style={{width:20,textAlign:"center",fontSize:11,color:en.peakDay?"#B85450":en.pointOfChange?"#C4A882":"transparent"}}>
              {en.peakDay?"★":en.pointOfChange?"⬆":"·"}
            </span>
          </div>;
        })}
      </div>

      {/* Chart legend */}
      <div className="crd" style={{marginTop:12,padding:14}}>
        <p className="lbl">Reading This Chart</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[
            { icon:"★", color:"#B85450", text:"Peak Day — last day of peak-quality mucus. Count 4 after." },
            { icon:"⬆", color:"#C4A882", text:"Point of Change — first observation different from BIP. Fertile window opens." },
            { icon:"●", color:"#4A8FA0", text:"Slippery/wet sensation — peak-quality fertility indicator." },
            { icon:"●", color:"#B8A88A", text:"Dry sensation — Basic Infertile Pattern (if consistent)." },
            { icon:"○", color:"#B8A898", text:"Disturbed temperature — excluded from shift interpretation." },
            { icon:"┅", color:"#B85450", text:"Coverline — drawn 0.05°C above highest of 6 pre-shift temps." },
          ].map((item,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
            <span style={{color:item.color,fontSize:13,flexShrink:0,width:16,textAlign:"center"}}>{item.icon}</span>
            <p className="sf" style={{fontSize:12,color:"#6B5B4E",lineHeight:1.45}}>{item.text}</p>
          </div>)}
        </div>
      </div>
    </>}
  </div>;
}

// ─── BLOG HUB ───
function Blog({setArticle,setPage}) {
  const [fil,setFil]=useState("All");
  const cats=["All",...new Set(ARTICLES.map(a=>a.cat))];
  const list=fil==="All"?ARTICLES:ARTICLES.filter(a=>a.cat===fil);

  return <div className="fin" style={{padding:"16px 20px 100px"}}>
    <h2 style={{fontSize:22,fontWeight:400,color:"#3A3028",textAlign:"center",marginBottom:2}}>The Body Literacy Blog</h2>
    <p className="sf" style={{fontSize:12,color:"#B8A898",textAlign:"center",marginBottom:16}}>Evidence-based articles with cited sources</p>

    <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:6,marginBottom:14,WebkitOverflowScrolling:"touch"}}>
      {cats.map(c=><button key={c} className={`pill ${fil===c?"on":""}`} onClick={()=>setFil(c)} style={{whiteSpace:"nowrap",flexShrink:0,fontSize:12}}>{c}</button>)}
    </div>

    {list.map(a=><div key={a.id} className="crd" style={{cursor:"pointer"}} onClick={()=>{setArticle(a);setPage("article");}}>
      <span className="sf" style={{fontSize:10,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:"#C4A882"}}>{a.cat}</span>
      <h3 style={{fontSize:15,color:"#3A3028",marginTop:5,lineHeight:1.3,fontWeight:400}}>{a.title}</h3>
      <p className="sf" style={{fontSize:13,color:"#8B7B6E",lineHeight:1.5,marginTop:5}}>{a.excerpt}</p>
      <div className="sf" style={{display:"flex",gap:10,marginTop:6,fontSize:11,color:"#B8A898"}}>
        <span>{a.time}</span><span>·</span><span>{a.for}</span>
      </div>
    </div>)}
  </div>;
}

// ─── ARTICLE PAGE ───
function Article({a,setPage}) {
  if(!a) return null;

  const renderBody = (text) => text.split("\n\n").map((para,i) => {
    let html = para
      .replace(/\[(\d+)\]/g, '<sup class="ref">[$1]</sup>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#5A4E42">$1</strong>');
    return <p key={i} dangerouslySetInnerHTML={{__html:html}} style={{marginBottom:15,lineHeight:1.78,color:"#4A3F35",fontSize:16}}/>;
  });

  return <div className="fin" style={{padding:"16px 20px 100px"}}>
    <button className="btn sf" style={{background:"none",color:"#6B5244",fontSize:14,padding:"8px 0",marginBottom:14}} onClick={()=>setPage("blog")}>← Back to Articles</button>

    <span className="sf" style={{fontSize:10,fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",color:"#C4A882"}}>{a.cat}</span>
    <h1 style={{fontSize:24,fontWeight:400,color:"#3A3028",lineHeight:1.25,marginTop:6,marginBottom:6}}>{a.title}</h1>
    <div className="sf" style={{display:"flex",gap:10,fontSize:12,color:"#B8A898",marginBottom:20,paddingBottom:16,borderBottom:"1px solid #E8E0D4"}}>
      <span>{a.time}</span><span>·</span><span>For: {a.for}</span>
    </div>

    <div>{renderBody(a.body)}</div>

    {/* Sources footer */}
    <div style={{marginTop:28,paddingTop:20,borderTop:"1px solid #E8E0D4"}}>
      <p className="lbl">Sources & References</p>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {a.sources.map(s=><div key={s.n} style={{display:"flex",gap:8}}>
          <span className="sf" style={{fontSize:12,color:"#6B5244",fontWeight:600,flexShrink:0}}>[{s.n}]</span>
          <a href={s.u} target="_blank" rel="noopener" className="src sf">{s.t}</a>
        </div>)}
      </div>
    </div>

    <div style={{marginTop:28,padding:20,background:"linear-gradient(135deg,rgba(107,82,68,.04) 0%,rgba(196,168,130,.06) 100%)",borderRadius:14,textAlign:"center"}}>
      <p style={{fontSize:18,fontWeight:400,color:"#3A3028",marginBottom:6}}>Ready to start?</p>
      <p className="sf" style={{fontSize:13,color:"#8B7B6E",marginBottom:14}}>LunaChart teaches you the Justisse Method step by step.</p>
      <button className="btn btn-p" onClick={()=>setPage("tracker")}>Open Tracker →</button>
    </div>
  </div>;
}
