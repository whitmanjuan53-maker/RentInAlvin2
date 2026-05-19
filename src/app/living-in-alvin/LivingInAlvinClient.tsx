'use client';

import { useEffect } from 'react';

const PAGE_CSS = `
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
:root {
  --bg: #F4EEE4;
  --paper: #FBF7F0;
  --ink: #1A1815;
  --inkSoft: #5C5750;
  --primary: #1F3A2E;
  --accent: #B5703D;
  --line: rgba(26,24,21,0.12);
  --pad-x: 40px;
}
@media (max-width: 720px) { :root { --pad-x: 20px; } }

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  font-size: 16px;
  line-height: 1.55;
}
a { color: inherit; }
::selection { background: var(--primary); color: var(--paper); }

.serif { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; }
.italic { font-style: italic; }
.eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--accent); font-weight: 600;
}

/* === Top bar === */
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px var(--pad-x); border-bottom: 1px solid var(--line);
  background: var(--paper);
}
.topbar .brand {
  display: flex; align-items: center; gap: 10px; text-decoration: none;
}
.topbar .brand-mark {
  width: 32px; height: 32px; background: var(--primary); color: var(--paper);
  display: grid; place-items: center;
  font-family: 'Instrument Serif', Georgia, serif; font-style: italic; font-size: 22px;
  line-height: 1;
}
.topbar .brand-name {
  font-family: 'Instrument Serif', Georgia, serif; font-size: 20px;
}
.topbar nav { display: flex; gap: 28px; align-items: center; font-size: 14px; }
.topbar nav a { text-decoration: none; color: var(--inkSoft); }
.topbar nav a:hover { color: var(--ink); }
.topbar .back {
  display: inline-flex; align-items: center; gap: 6px;
  color: var(--primary); font-weight: 500;
}
@media (max-width: 720px) {
  .topbar nav .hide-sm { display: none; }
}

/* === Hero === */
.hero {
  padding: 80px var(--pad-x) 60px;
  max-width: 1200px; margin: 0 auto;
}
.hero h1 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(42px, 7vw, 88px);
  line-height: 1.02; margin: 14px 0 24px;
  font-weight: 400; letter-spacing: -0.01em;
  max-width: 18ch;
}
.hero h1 em { font-style: italic; color: var(--primary); }
.hero .lede {
  max-width: 60ch; font-size: 18px; color: var(--inkSoft);
  line-height: 1.55;
}
.hero .lede strong { color: var(--ink); font-weight: 600; }

/* === Quick stats strip === */
.stats-strip {
  max-width: 1200px; margin: 40px auto 0;
  padding: 36px var(--pad-x);
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.stats-strip > div { padding: 0 24px; border-left: 1px solid var(--line); }
.stats-strip > div:first-child { border-left: none; padding-left: 0; }
.stats-strip .num {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 44px; line-height: 1; color: var(--primary);
}
.stats-strip .lab {
  font-size: 12px; color: var(--inkSoft); letter-spacing: 0.05em;
  margin-top: 8px; text-transform: uppercase;
}
@media (max-width: 720px) {
  .stats-strip { grid-template-columns: 1fr 1fr; gap: 24px 0; }
  .stats-strip > div:nth-child(3) { border-left: none; padding-left: 0; }
}

/* === Section === */
section.guide {
  max-width: 1200px; margin: 0 auto;
  padding: 80px var(--pad-x);
}
.sec-head {
  display: grid; grid-template-columns: 1fr 2fr; gap: 80px;
  margin-bottom: 48px; align-items: end;
}
.sec-head h2 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(34px, 4.5vw, 56px); line-height: 1.05;
  font-weight: 400; margin: 12px 0 0; letter-spacing: -0.005em;
}
.sec-head h2 em { font-style: italic; color: var(--primary); }
.sec-head p { color: var(--inkSoft); margin: 0; max-width: 60ch; }
@media (max-width: 720px) { .sec-head { grid-template-columns: 1fr; gap: 16px; } }

/* === Cards === */
.card-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
  background: var(--line);
  border: 1px solid var(--line);
}
.card-grid .card {
  background: var(--paper); padding: 32px 28px;
  display: flex; flex-direction: column; gap: 12px;
}
.card .ico {
  width: 36px; height: 36px;
  color: var(--primary);
}
.card h3 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 26px; line-height: 1.2; font-weight: 400;
  margin: 6px 0 0;
}
.card p { margin: 0; color: var(--inkSoft); font-size: 14px; line-height: 1.6; }
.card .meta {
  margin-top: auto; padding-top: 16px;
  font-size: 12px; color: var(--accent); font-weight: 600;
  letter-spacing: 0.05em; text-transform: uppercase;
}
@media (max-width: 960px) { .card-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .card-grid { grid-template-columns: 1fr; } }

/* === Commute table === */
.commute {
  background: var(--paper);
  border: 1px solid var(--line);
  padding: 8px 0;
}
.commute .row {
  display: grid; grid-template-columns: 2fr 1fr 1fr 2fr;
  padding: 22px 28px; align-items: baseline;
  border-bottom: 1px solid var(--line);
  gap: 16px;
}
.commute .row:last-child { border-bottom: none; }
.commute .row.head {
  background: transparent;
  font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--inkSoft);
  padding: 16px 28px;
}
.commute .dest {
  font-family: 'Instrument Serif', Georgia, serif; font-size: 22px;
}
.commute .miles, .commute .time {
  font-family: 'Instrument Serif', Georgia, serif; font-size: 22px;
  color: var(--primary);
}
.commute .note { color: var(--inkSoft); font-size: 13px; }
@media (max-width: 720px) {
  .commute .row { grid-template-columns: 1fr 1fr; }
  .commute .row .note { grid-column: 1 / -1; font-size: 12px; }
  .commute .row.head .note { display: none; }
}

/* === Schools list === */
.schools-grid {
  display: grid; grid-template-columns: 1.2fr 1fr; gap: 60px;
  align-items: start;
}
.schools-grid .text p { color: var(--inkSoft); font-size: 15px; line-height: 1.65; }
.schools-grid .text p strong { color: var(--ink); font-weight: 600; }
.schools-list { background: var(--paper); border: 1px solid var(--line); padding: 8px 0; }
.schools-list .item {
  padding: 18px 24px; border-bottom: 1px solid var(--line);
  display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
}
.schools-list .item:last-child { border-bottom: none; }
.schools-list .name {
  font-family: 'Instrument Serif', Georgia, serif; font-size: 18px;
}
.schools-list .grade {
  font-size: 12px; color: var(--inkSoft); letter-spacing: 0.05em;
  text-transform: uppercase;
}
@media (max-width: 720px) { .schools-grid { grid-template-columns: 1fr; gap: 24px; } }

/* === Things to do strip === */
.things {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px;
  background: var(--line); border: 1px solid var(--line);
}
.things .t {
  background: var(--paper);
  padding: 28px 24px;
  display: flex; flex-direction: column; gap: 8px;
}
.things .t .num {
  font-family: 'Instrument Serif', Georgia, serif; font-style: italic;
  font-size: 28px; color: var(--accent);
}
.things .t h4 {
  font-family: 'Instrument Serif', Georgia, serif; font-size: 22px;
  font-weight: 400; margin: 4px 0 0; line-height: 1.2;
}
.things .t p { font-size: 13px; color: var(--inkSoft); margin: 4px 0 0; line-height: 1.55; }
@media (max-width: 960px) { .things { grid-template-columns: 1fr 1fr; } }
@media (max-width: 540px) { .things { grid-template-columns: 1fr; } }

/* === Pull quote === */
.pull {
  background: var(--primary); color: var(--paper);
  padding: 80px var(--pad-x);
  margin: 60px 0;
}
.pull .inner {
  max-width: 980px; margin: 0 auto;
  display: grid; grid-template-columns: auto 1fr; gap: 40px; align-items: start;
}
.pull .mark {
  font-family: 'Instrument Serif', Georgia, serif; font-style: italic;
  font-size: 120px; line-height: 0.7; color: var(--accent);
}
.pull blockquote {
  margin: 0;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(24px, 3vw, 36px); line-height: 1.3;
  font-weight: 400;
}
.pull blockquote em { font-style: italic; }
.pull cite {
  display: block; margin-top: 24px; font-style: normal;
  font-family: 'Inter', sans-serif; font-size: 13px;
  letter-spacing: 0.05em; text-transform: uppercase;
  color: rgba(251,247,240,0.6);
}
@media (max-width: 720px) {
  .pull .inner { grid-template-columns: 1fr; gap: 12px; }
  .pull .mark { font-size: 80px; }
}

/* === FAQ === */
.faq-list { display: flex; flex-direction: column; gap: 0; border-top: 1px solid var(--line); }
.faq-item { border-bottom: 1px solid var(--line); padding: 28px 0; }
.faq-item h4 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 24px; font-weight: 400; margin: 0 0 8px; line-height: 1.25;
}
.faq-item p { margin: 0; color: var(--inkSoft); font-size: 15px; line-height: 1.6; }

/* === CTA === */
.cta {
  background: var(--paper);
  border: 1px solid var(--line);
  padding: 60px;
  display: grid; grid-template-columns: 1.4fr 1fr; gap: 40px;
  align-items: center;
  margin-top: 40px;
}
.cta h3 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(28px, 3.6vw, 44px); font-weight: 400;
  margin: 0 0 12px; line-height: 1.1;
}
.cta h3 em { font-style: italic; color: var(--primary); }
.cta p { margin: 0; color: var(--inkSoft); }
.cta .btns { display: flex; gap: 12px; justify-content: flex-end; flex-wrap: wrap; }
.cta a.btn {
  text-decoration: none; padding: 14px 22px;
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 600;
}
.cta a.btn.primary { background: var(--primary); color: var(--paper); }
.cta a.btn.ghost { border: 1px solid var(--ink); color: var(--ink); }
@media (max-width: 720px) {
  .cta { grid-template-columns: 1fr; padding: 32px; }
  .cta .btns { justify-content: flex-start; }
}

/* === Footer === */
footer.foot {
  padding: 40px var(--pad-x); border-top: 1px solid var(--line);
  display: flex; justify-content: space-between; align-items: center;
  color: var(--inkSoft); font-size: 13px;
  flex-wrap: wrap; gap: 16px;
}
footer.foot a { text-decoration: none; }

/* === Floating CTAs (matches main page) === */
.ys-fab-stack {
  position: fixed; right: 20px; bottom: 20px; z-index: 9999;
  display: flex; flex-direction: column; gap: 10px; align-items: flex-end;
  font-family: 'Inter', system-ui, sans-serif;
}
.ys-fab-stack > a,
.ys-fab-stack > button,
.ys-fab-stack > div {
  all: unset; cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 18px; border-radius: 999px;
  font-size: 14px; font-weight: 600; letter-spacing: 0.01em;
  box-shadow: 0 6px 24px rgba(26,24,21,0.18), 0 1px 2px rgba(26,24,21,0.08);
  border: 1px solid rgba(26,24,21,0.08);
  transition: transform 160ms ease, box-shadow 160ms ease;
}
.ys-fab-stack > a:hover,
.ys-fab-stack > button:hover,
.ys-fab-stack > div:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(26,24,21,0.22), 0 1px 2px rgba(26,24,21,0.08);
}
.ys-fab-text { background: var(--primary); color: var(--paper); }
.ys-fab-text svg { width: 16px; height: 16px; }
.ys-fab-pill { background: var(--paper); color: var(--ink); }
.ys-fab-pill .ys-fab-sep { opacity: 0.25; margin: 0 6px; }
.ys-fab-pill a.active { color: var(--primary); text-decoration: underline; text-underline-offset: 3px; }
.ys-fab-pill a:not(.active) { color: var(--inkSoft); }
.ys-fab-guide { background: var(--paper); color: var(--ink); text-decoration: none; }
.ys-fab-guide em { font-family: 'Instrument Serif', Georgia, serif; font-style: italic; }
@media (max-width: 540px) {
  .ys-fab-stack { right: 12px; bottom: 12px; gap: 8px; }
  .ys-fab-stack > a,
  .ys-fab-stack > button,
  .ys-fab-stack > div { padding: 10px 14px; font-size: 13px; }
}
@media print { .ys-fab-stack { display: none; } }

/* === Accessibility & polish === */
*:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
html { scroll-behavior: smooth; }
body { overflow-x: hidden; }
.card { border-radius: 6px; transition: transform 240ms ease, box-shadow 240ms ease; }
.card:hover { transform: translateY(-3px); box-shadow: 0 20px 40px -20px rgba(26,24,21,0.18); }
.topbar nav a { transition: color 180ms ease; padding: 4px 0; border-radius: 2px; }
footer.foot a { transition: color 160ms ease, transform 160ms ease; }
footer.foot a:hover { transform: translateX(2px); }
.ys-reveal { opacity: 0; transform: translateY(18px); transition: opacity 380ms ease-out, transform 380ms ease-out; }
.ys-reveal.ys-revealed { opacity: 1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  html { scroll-behavior: auto; }
  .ys-reveal { opacity: 1; transform: none; }
}
`;

const BODY_HTML = `
<header class="topbar">
  <a class="brand" href="/">
    <div class="brand-mark">Y</div>
    <div class="brand-name">Yellowstone</div>
  </a>
  <nav>
    <a href="/#communities" class="hide-sm">Properties</a>
    <a href="/#availability" class="hide-sm">Availability</a>
    <a href="/#contact" class="hide-sm">Contact</a>

  </nav>
</header>

<section class="hero">
  <div class="eyebrow">Neighborhood Guide</div>
  <h1>Living in <em>Alvin,</em> Texas — what to expect.</h1>
  <p class="lede">
    Alvin is a small city about <strong>30 minutes south of downtown Houston</strong>, big enough for an HEB and a Target, small enough that you'll wave at the same neighbors on your morning walk. Here's an honest look at the schools, the commute, the grocery runs, and where people actually spend their weekends.
  </p>
</section>

<div class="stats-strip">
  <div>
    <div class="num">~26K</div>
    <div class="lab">Residents</div>
  </div>
  <div>
    <div class="num">30 min</div>
    <div class="lab">to Downtown Houston</div>
  </div>
  <div>
    <div class="num">A-rated</div>
    <div class="lab">Alvin ISD schools</div>
  </div>
  <div>
    <div class="num">1879</div>
    <div class="lab">Year founded</div>
  </div>
</div>

<section class="guide">
  <div class="sec-head">
    <div>
      <div class="eyebrow">Daily essentials</div>
      <h2>The basics, <em>within five minutes.</em></h2>
    </div>
    <p>
      Whatever Yellowstone property you land at, your weekly errands cluster on TX-35 (the Bypass) and Hwy 6. You won't need to drive into Houston for groceries, a Costco run, a doctor's visit, or a Target trip.
    </p>
  </div>

  <div class="card-grid">
    <div class="card">
      <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-6 9 6v11a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9z"/></svg>
      <div class="eyebrow" style="color: var(--inkSoft);">Grocery</div>
      <h3>HEB, Walmart Supercenter, Kroger</h3>
      <p>HEB at Hwy 6 is the local favorite. Walmart Supercenter for late-night runs. Kroger nearby in Pearland for variety.</p>
      <div class="meta">5–10 min from any property</div>
    </div>
    <div class="card">
      <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
      <div class="eyebrow" style="color: var(--inkSoft);">Healthcare</div>
      <h3>HCA Houston Mainland · UTMB Clinic</h3>
      <p>Full-service hospital in Texas City (15 min). UTMB primary-care clinic on S Bypass 35. Pediatric ER at Memorial Hermann Pearland (12 min).</p>
      <div class="meta">15-min radius</div>
    </div>
    <div class="card">
      <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7h18M5 7v13h14V7M9 11h6"/></svg>
      <div class="eyebrow" style="color: var(--inkSoft);">Big-box & home</div>
      <h3>Target · Lowe's · Home Depot</h3>
      <p>Target and Lowe's at Pearland Town Center (15 min). Home Depot on Hwy 6. Pearland's restaurant row is a 15-minute drive for date nights.</p>
      <div class="meta">~15 min</div>
    </div>
    <div class="card">
      <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 21v-7h16v7M8 14V8a4 4 0 0 1 8 0v6"/></svg>
      <div class="eyebrow" style="color: var(--inkSoft);">Coffee & local</div>
      <h3>Texas Cafe · Joe's Barbeque · Smith Point Coffee</h3>
      <p>Joe's BBQ on TX-6 is the local institution. Smith Point Coffee for the morning routine. Texas Cafe for old-school breakfast.</p>
      <div class="meta">In town</div>
    </div>
    <div class="card">
      <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12l9-9 9 9M5 10v10h14V10"/></svg>
      <div class="eyebrow" style="color: var(--inkSoft);">Parks & rec</div>
      <h3>Briscoe Park · National Oak Park · Froberg's Farm</h3>
      <p>Briscoe Park has the splash pad and trails. Froberg's strawberry farm on Hwy 6 is the family Saturday tradition. Disc golf at National Oak.</p>
      <div class="meta">Free, year-round</div>
    </div>
    <div class="card">
      <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 6h16v12H4z"/><path d="M4 10h16M9 6v12"/></svg>
      <div class="eyebrow" style="color: var(--inkSoft);">Library & civic</div>
      <h3>Alvin Library · Alvin Community College</h3>
      <p>The library hosts free kids' programming Saturdays. ACC offers continuing-ed courses, a fitness center open to residents, and a small theatre.</p>
      <div class="meta">Walking distance from downtown units</div>
    </div>
  </div>
</section>

<section class="guide" style="padding-top: 0;">
  <div class="sec-head">
    <div>
      <div class="eyebrow">Commute</div>
      <h2>Where Alvin <em>actually puts you.</em></h2>
    </div>
    <p>
      Alvin sits at the intersection of TX-35 and Hwy 6, which means easy access to Beltway 8, the Sam Houston Tollway, and I-45. Most residents commute to Pearland, the Texas Medical Center, NASA/Clear Lake, or the petrochemical corridor in Texas City.
    </p>
  </div>

  <div class="commute">
    <div class="row head">
      <div>Destination</div>
      <div>Distance</div>
      <div>Drive time</div>
      <div class="note">Notes</div>
    </div>
    <div class="row">
      <div class="dest">Pearland Town Center</div>
      <div class="miles">12 mi</div>
      <div class="time">15 min</div>
      <div class="note">Shopping, restaurants, AMC theatre. The closest "city" trip.</div>
    </div>
    <div class="row">
      <div class="dest">NASA / Johnson Space Center</div>
      <div class="miles">22 mi</div>
      <div class="time">28 min</div>
      <div class="note">Via TX-35 → Beltway 8 East. Common for Clear Lake aerospace workers.</div>
    </div>
    <div class="row">
      <div class="dest">Texas Medical Center</div>
      <div class="miles">26 mi</div>
      <div class="time">35 min</div>
      <div class="note">Hwy 288 N. Slower at peak — 50 min in rush hour.</div>
    </div>
    <div class="row">
      <div class="dest">Downtown Houston</div>
      <div class="miles">28 mi</div>
      <div class="time">35–55 min</div>
      <div class="note">Hwy 288 or Beltway 8. Off-peak: easy. Rush hour: plan for 55.</div>
    </div>
    <div class="row">
      <div class="dest">Galveston Beach</div>
      <div class="miles">35 mi</div>
      <div class="time">45 min</div>
      <div class="note">I-45 South. Sunday day-trip distance.</div>
    </div>
    <div class="row">
      <div class="dest">Bush Intercontinental (IAH)</div>
      <div class="miles">45 mi</div>
      <div class="time">55 min</div>
      <div class="note">Hobby (HOU) is closer at 22 mi / 28 min.</div>
    </div>
  </div>
</section>

<section class="guide" style="padding-top: 0;">
  <div class="sec-head">
    <div>
      <div class="eyebrow">Schools</div>
      <h2>Alvin ISD — <em>and what's nearby.</em></h2>
    </div>
    <p>
      All six Yellowstone properties zone to <strong>Alvin Independent School District</strong>, a TEA "A"-rated district with 30,000+ students. Below are the campuses most residents zone to from our Alvin properties; Alvin ISD's site has the official boundary lookup.
    </p>
  </div>

  <div class="schools-grid">
    <div class="text">
      <p>
        <strong>Alvin ISD</strong> consistently ranks in the top tier of Brazoria County districts. Students at all six Yellowstone properties typically zone to <strong>Alvin Elementary, Harby Junior High, and Alvin High School</strong>, with magnet options at <strong>Alvin Junior High Academy</strong> and the <strong>Alvin ISD Gifted &amp; Talented program</strong>.
      </p>
      <p>
        For higher ed, <strong>Alvin Community College</strong> is a 2-year college with strong nursing, welding, and aerospace tracks. <strong>University of Houston-Clear Lake</strong> is 25 minutes east. <strong>Rice University</strong> and <strong>Texas Southern</strong> are 35 minutes via 288.
      </p>
      <p>
        Private options nearby: <strong>St. Helen Catholic School</strong> (PK–8), <strong>Brazos Christian Academy</strong>, and <strong>Logos Preparatory Academy</strong> in Sugar Land for K–12.
      </p>
    </div>
    <div class="schools-list">
      <div class="item">
        <span class="name">Alvin Elementary</span>
        <span class="grade">PK–4</span>
      </div>
      <div class="item">
        <span class="name">Stevenson Primary</span>
        <span class="grade">PK–2</span>
      </div>
      <div class="item">
        <span class="name">Harby Junior High</span>
        <span class="grade">5–8</span>
      </div>
      <div class="item">
        <span class="name">Alvin Junior High Academy</span>
        <span class="grade">5–8 · magnet</span>
      </div>
      <div class="item">
        <span class="name">Alvin High School</span>
        <span class="grade">9–12</span>
      </div>
      <div class="item">
        <span class="name">Alvin Community College</span>
        <span class="grade">2-year</span>
      </div>
    </div>
  </div>
</section>

<section class="pull">
  <div class="inner">
    <div class="mark">"</div>
    <div>
      <blockquote>
        <em>I lived in The Heights for ten years. Moved here for the schools and the price — what surprised me was how much I liked having an actual yard, knowing the postal worker's name, and being able to bike to a bakery on Saturday morning.</em>
      </blockquote>
      <cite>— Sara K., Yellowstone resident since 2022</cite>
    </div>
  </div>
</section>

<section class="guide" style="padding-top: 0;">
  <div class="sec-head">
    <div>
      <div class="eyebrow">Weekends</div>
      <h2>How residents <em>actually spend</em> Saturday.</h2>
    </div>
    <p>
      A short list of what's on the calendar, year-round. Alvin punches above its weight on small-town events — the rodeo, the strawberry festival, and the Christmas parade are the three you'll hear about most.
    </p>
  </div>

  <div class="things">
    <div class="t">
      <div class="num">01</div>
      <h4>Froberg's Farm</h4>
      <p>U-pick strawberries Feb–April, pumpkins in October, peach ice cream all summer. The Hwy 6 ritual.</p>
    </div>
    <div class="t">
      <div class="num">02</div>
      <h4>Alvin Rodeo &amp; Frontier Days</h4>
      <p>Late May, four nights of bull riding, mutton bustin', and a parade through downtown. Free for kids.</p>
    </div>
    <div class="t">
      <div class="num">03</div>
      <h4>Bayou Wildlife Zoo</h4>
      <p>Drive-through safari just outside town. Goats stick their heads in your car. 12 minutes from any property.</p>
    </div>
    <div class="t">
      <div class="num">04</div>
      <h4>Galveston day-trips</h4>
      <p>Pleasure Pier, Strand, beach. Leave at 9, home by dinner. Sunday tradition March through October.</p>
    </div>
    <div class="t">
      <div class="num">05</div>
      <h4>Alvin Community Theatre</h4>
      <p>Local theatre on the ACC campus. 6 productions a year, $15 tickets. Surprisingly good Sondheim.</p>
    </div>
    <div class="t">
      <div class="num">06</div>
      <h4>Briscoe Park splash pad</h4>
      <p>Free, free parking, summer Saturdays from 10am. Where every Yellowstone family with kids ends up.</p>
    </div>
    <div class="t">
      <div class="num">07</div>
      <h4>National Oak disc golf</h4>
      <p>18-hole course, free, lit until 9pm. Bring repellent in summer.</p>
    </div>
    <div class="t">
      <div class="num">08</div>
      <h4>Christmas parade &amp; tree lighting</h4>
      <p>First Saturday in December. Downtown closes, marching band, lit-up tractors. Bring a chair.</p>
    </div>
  </div>
</section>

<section class="guide" style="padding-top: 0;">
  <div class="sec-head">
    <div>
      <div class="eyebrow">Common questions</div>
      <h2><em>Honest answers</em> for new arrivals.</h2>
    </div>
    <p>
      We get the same questions from every new resident touring from Houston, Pearland, or out of state. Here are the most common — without the brochure spin.
    </p>
  </div>

  <div class="faq-list">
    <div class="faq-item">
      <h4>Is Alvin safe?</h4>
      <p>Yes. Crime rates are lower than Houston and Pearland. Yellowstone properties cluster in established residential blocks south of downtown — quiet streets, neighbors who know each other. We monitor each property and respond on-call after hours.</p>
    </div>
    <div class="faq-item">
      <h4>What about flooding?</h4>
      <p>This is Texas — a fair question. None of our six properties are in a 100-year FEMA flood zone, and none flooded during Harvey (2017), Imelda (2019), or Beryl (2024). We can share the FEMA flood map and our hurricane preparedness checklist on request.</p>
    </div>
    <div class="faq-item">
      <h4>Do I need a car?</h4>
      <p>Yes. Alvin is a driving town — no light rail, no Metro bus into Houston. The good news: every Yellowstone unit has at least one assigned spot, and all our properties are 5–10 minutes from grocery, gas, and restaurants.</p>
    </div>
    <div class="faq-item">
      <h4>How's the weather?</h4>
      <p>Hot summers (June–September: highs 90–98, humid). Mild winters (December–February: usually 50s–60s, occasional freezes). Spring and fall are gorgeous. Hurricane season is June–November — we keep residents informed and properties prepared.</p>
    </div>
    <div class="faq-item">
      <h4>What about internet?</h4>
      <p>Comcast/Xfinity covers all six properties with gigabit fiber. AT&amp;T fiber is available at most. T-Mobile 5G Home Internet is a third option. Residents arrange their own service; no bundled provider.</p>
    </div>
    <div class="faq-item">
      <h4>Is it kid-friendly?</h4>
      <p>Very. Alvin ISD is "A"-rated, three of our six properties are within walking distance of an elementary school, and Briscoe Park is the unofficial weekend hub. About 60% of our residents have kids.</p>
    </div>
  </div>
</section>

<section class="guide" style="padding-top: 0;">
  <div class="cta">
    <div>
      <h3>Ready to <em>see what's open?</em></h3>
      <p>We have units across all six properties. Tour any of them with the Yellowstone team — we're locally based and respond same-day.</p>
    </div>
    <div class="btns">
      <a class="btn primary" href="/#availability">View availability →</a>
      <a class="btn ghost" href="/#contact">Schedule a tour</a>
    </div>
  </div>
</section>

<footer class="foot">
  <div>© Yellowstone Asset Management · Alvin, TX</div>
  <div>
    <a href="/">Home</a> ·
    <a href="/es">Español</a> ·
    <a href="tel:+18322103968">(832) 210-3968</a> ·
    <a href="mailto:office@yellowstone-am.com">office@yellowstone-am.com</a>
  </div>
</footer>

<div class="ys-fab-stack" aria-label="Quick actions">
  <a class="ys-fab-guide" href="/">
    <em>Home</em>
    <span>→</span>
  </a>
  <div class="ys-fab-pill" role="group" aria-label="Language">
    <a href="/living-in-alvin" hreflang="en" class="active">EN</a>
    <span class="ys-fab-sep">·</span>
    <a href="/vivir-en-alvin" hreflang="es">ES</a>
  </div>
  <a class="ys-fab-text" href="sms:+18322103968?body=Hi%20Yellowstone%2C%20I%27m%20interested%20in%20a%20unit." aria-label="Text us">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
    <span>Text us</span>
  </a>
</div>
`;

export default function LivingInAlvinClient() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    document.querySelectorAll('section:not(.hero)').forEach((el) => { el.classList.add('ys-reveal'); });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('ys-revealed'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.ys-reveal').forEach((el) => { obs.observe(el); });
  }, []);

  return (
    <>
      <style>{PAGE_CSS}</style>
      <noscript><style>{`.ys-reveal { opacity: 1 !important; transform: none !important; }`}</style></noscript>
      <div dangerouslySetInnerHTML={{ __html: BODY_HTML }} />
    </>
  );
}
