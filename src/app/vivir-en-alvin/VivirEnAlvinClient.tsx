'use client';

import { useEffect } from 'react';

const PAGE_CSS = `
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
:root {
  --bg: #F4EEE4; --paper: #FBF7F0;
  --ink: #1A1815; --inkSoft: #5C5750;
  --primary: #1F3A2E; --accent: #B5703D;
  --line: rgba(26,24,21,0.12);
  --pad-x: 40px;
}
@media (max-width: 720px) { :root { --pad-x: 20px; } }

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--bg); color: var(--ink);
  -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.55;
}
a { color: inherit; }
::selection { background: var(--primary); color: var(--paper); }

.serif { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; }
.italic { font-style: italic; }
.eyebrow {
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--accent); font-weight: 600;
}

.topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px var(--pad-x); border-bottom: 1px solid var(--line);
  background: var(--paper);
}
.topbar .brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.topbar .brand-mark {
  width: 32px; height: 32px; background: var(--primary); color: var(--paper);
  display: grid; place-items: center;
  font-family: 'Instrument Serif', Georgia, serif; font-style: italic; font-size: 22px;
  line-height: 1;
}
.topbar .brand-name { font-family: 'Instrument Serif', Georgia, serif; font-size: 20px; }
.topbar nav { display: flex; gap: 28px; align-items: center; font-size: 14px; }
.topbar nav a { text-decoration: none; color: var(--inkSoft); }
.topbar nav a:hover { color: var(--ink); }
.topbar .back {
  display: inline-flex; align-items: center; gap: 6px;
  color: var(--primary); font-weight: 500;
}
@media (max-width: 720px) { .topbar nav .hide-sm { display: none; } }

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
.hero .lede { max-width: 60ch; font-size: 18px; color: var(--inkSoft); line-height: 1.55; }
.hero .lede strong { color: var(--ink); font-weight: 600; }

.stats-strip {
  max-width: 1200px; margin: 40px auto 0;
  padding: 36px var(--pad-x);
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
  border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
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

section.guide { max-width: 1200px; margin: 0 auto; padding: 80px var(--pad-x); }
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

.card-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
  background: var(--line); border: 1px solid var(--line);
}
.card-grid .card {
  background: var(--paper); padding: 32px 28px;
  display: flex; flex-direction: column; gap: 12px;
}
.card .ico { width: 36px; height: 36px; color: var(--primary); }
.card h3 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 26px; line-height: 1.2; font-weight: 400; margin: 6px 0 0;
}
.card p { margin: 0; color: var(--inkSoft); font-size: 14px; line-height: 1.6; }
.card .meta {
  margin-top: auto; padding-top: 16px;
  font-size: 12px; color: var(--accent); font-weight: 600;
  letter-spacing: 0.05em; text-transform: uppercase;
}
@media (max-width: 960px) { .card-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .card-grid { grid-template-columns: 1fr; } }

.commute { background: var(--paper); border: 1px solid var(--line); padding: 8px 0; }
.commute .row {
  display: grid; grid-template-columns: 2fr 1fr 1fr 2fr;
  padding: 22px 28px; align-items: baseline;
  border-bottom: 1px solid var(--line); gap: 16px;
}
.commute .row:last-child { border-bottom: none; }
.commute .row.head {
  font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--inkSoft); padding: 16px 28px;
}
.commute .dest { font-family: 'Instrument Serif', Georgia, serif; font-size: 22px; }
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

.schools-grid {
  display: grid; grid-template-columns: 1.2fr 1fr; gap: 60px; align-items: start;
}
.schools-grid .text p { color: var(--inkSoft); font-size: 15px; line-height: 1.65; }
.schools-grid .text p strong { color: var(--ink); font-weight: 600; }
.schools-list { background: var(--paper); border: 1px solid var(--line); padding: 8px 0; }
.schools-list .item {
  padding: 18px 24px; border-bottom: 1px solid var(--line);
  display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
}
.schools-list .item:last-child { border-bottom: none; }
.schools-list .name { font-family: 'Instrument Serif', Georgia, serif; font-size: 18px; }
.schools-list .grade {
  font-size: 12px; color: var(--inkSoft); letter-spacing: 0.05em; text-transform: uppercase;
}
@media (max-width: 720px) { .schools-grid { grid-template-columns: 1fr; gap: 24px; } }

.things {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px;
  background: var(--line); border: 1px solid var(--line);
}
.things .t {
  background: var(--paper); padding: 28px 24px;
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

.pull {
  background: var(--primary); color: var(--paper);
  padding: 80px var(--pad-x); margin: 60px 0;
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
  font-size: clamp(24px, 3vw, 36px); line-height: 1.3; font-weight: 400;
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

.faq-list { display: flex; flex-direction: column; border-top: 1px solid var(--line); }
.faq-item { border-bottom: 1px solid var(--line); padding: 28px 0; }
.faq-item h4 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 24px; font-weight: 400; margin: 0 0 8px; line-height: 1.25;
}
.faq-item p { margin: 0; color: var(--inkSoft); font-size: 15px; line-height: 1.6; }

.cta {
  background: var(--paper); border: 1px solid var(--line);
  padding: 60px;
  display: grid; grid-template-columns: 1.4fr 1fr; gap: 40px;
  align-items: center; margin-top: 40px;
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

footer.foot {
  padding: 40px var(--pad-x); border-top: 1px solid var(--line);
  display: flex; justify-content: space-between; align-items: center;
  color: var(--inkSoft); font-size: 13px; flex-wrap: wrap; gap: 16px;
}
footer.foot a { text-decoration: none; }

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
  <a class="brand" href="/es">
    <div class="brand-mark">Y</div>
    <div class="brand-name">Yellowstone</div>
  </a>
  <nav>
    <a href="/es#comunidades" class="hide-sm">Propiedades</a>
    <a href="/es#disponibilidad" class="hide-sm">Disponibilidad</a>
    <a href="/es#contacto" class="hide-sm">Contacto</a>

  </nav>
</header>

<section class="hero">
  <div class="eyebrow">Guía del vecindario</div>
  <h1>Vivir en <em>Alvin,</em> Texas — qué esperar.</h1>
  <p class="lede">
    Alvin es una pequeña ciudad a unos <strong>30 minutos al sur del centro de Houston</strong> — lo suficientemente grande para tener un HEB y un Target, lo suficientemente pequeña como para que salude a los mismos vecinos en su caminata matutina. Aquí va una mirada honesta a las escuelas, el viaje al trabajo, los mandados, y donde la gente realmente pasa los fines de semana.
  </p>
</section>

<div class="stats-strip">
  <div><div class="num">~26K</div><div class="lab">Habitantes</div></div>
  <div><div class="num">30 min</div><div class="lab">al centro de Houston</div></div>
  <div><div class="num">Calif. A</div><div class="lab">Escuelas Alvin ISD</div></div>
  <div><div class="num">1879</div><div class="lab">Año fundado</div></div>
</div>

<section class="guide">
  <div class="sec-head">
    <div>
      <div class="eyebrow">Lo esencial</div>
      <h2>Lo básico, <em>a cinco minutos.</em></h2>
    </div>
    <p>
      En cualquier propiedad de Yellowstone donde se mude, sus mandados semanales se concentran en TX-35 (el Bypass) y la Hwy 6. No tendrá que manejar a Houston para el supermercado, una visita al doctor, o una vuelta al Target.
    </p>
  </div>

  <div class="card-grid">
    <div class="card">
      <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-6 9 6v11a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9z"/></svg>
      <div class="eyebrow" style="color: var(--inkSoft);">Supermercados</div>
      <h3>HEB, Walmart Supercenter, Kroger</h3>
      <p>El HEB en la Hwy 6 es el favorito local. Walmart Supercenter para mandados nocturnos. Kroger cerca en Pearland para más variedad.</p>
      <div class="meta">5–10 min de cualquier propiedad</div>
    </div>
    <div class="card">
      <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
      <div class="eyebrow" style="color: var(--inkSoft);">Salud</div>
      <h3>HCA Houston Mainland · Clínica UTMB</h3>
      <p>Hospital de servicio completo en Texas City (15 min). Clínica de medicina familiar UTMB sobre S Bypass 35. Sala de emergencias pediátricas en Memorial Hermann Pearland (12 min).</p>
      <div class="meta">15 min de distancia</div>
    </div>
    <div class="card">
      <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7h18M5 7v13h14V7M9 11h6"/></svg>
      <div class="eyebrow" style="color: var(--inkSoft);">Tiendas grandes</div>
      <h3>Target · Lowe's · Home Depot</h3>
      <p>Target y Lowe's en Pearland Town Center (15 min). Home Depot sobre la Hwy 6. La zona de restaurantes de Pearland está a 15 minutos para una salida en pareja.</p>
      <div class="meta">~15 min</div>
    </div>
    <div class="card">
      <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 21v-7h16v7M8 14V8a4 4 0 0 1 8 0v6"/></svg>
      <div class="eyebrow" style="color: var(--inkSoft);">Café & locales</div>
      <h3>Texas Cafe · Joe's Barbeque · Smith Point Coffee</h3>
      <p>Joe's BBQ sobre la TX-6 es la institución local. Smith Point Coffee para la rutina matutina. Texas Cafe para un desayuno tradicional.</p>
      <div class="meta">En el centro</div>
    </div>
    <div class="card">
      <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12l9-9 9 9M5 10v10h14V10"/></svg>
      <div class="eyebrow" style="color: var(--inkSoft);">Parques & recreación</div>
      <h3>Briscoe Park · National Oak Park · Froberg's Farm</h3>
      <p>Briscoe Park tiene chapoteadero y senderos. La granja de fresas Froberg's sobre la Hwy 6 es la tradición familiar de los sábados. Disc golf en National Oak.</p>
      <div class="meta">Gratis, todo el año</div>
    </div>
    <div class="card">
      <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 6h16v12H4z"/><path d="M4 10h16M9 6v12"/></svg>
      <div class="eyebrow" style="color: var(--inkSoft);">Biblioteca & cívico</div>
      <h3>Biblioteca de Alvin · Alvin Community College</h3>
      <p>La biblioteca tiene programas gratuitos para niños los sábados. ACC ofrece cursos de educación continua, gimnasio abierto a residentes, y un pequeño teatro.</p>
      <div class="meta">A pie desde el centro de Alvin</div>
    </div>
  </div>
</section>

<section class="guide" style="padding-top: 0;">
  <div class="sec-head">
    <div>
      <div class="eyebrow">Viaje al trabajo</div>
      <h2>Dónde lo coloca <em>realmente Alvin.</em></h2>
    </div>
    <p>
      Alvin se ubica en la intersección de TX-35 y Hwy 6, lo que da acceso fácil al Beltway 8, Sam Houston Tollway, y la I-45. La mayoría de los residentes va a Pearland, el Texas Medical Center, NASA/Clear Lake, o el corredor petroquímico en Texas City.
    </p>
  </div>

  <div class="commute">
    <div class="row head">
      <div>Destino</div>
      <div>Distancia</div>
      <div>Tiempo</div>
      <div class="note">Notas</div>
    </div>
    <div class="row">
      <div class="dest">Pearland Town Center</div>
      <div class="miles">12 mi</div>
      <div class="time">15 min</div>
      <div class="note">Compras, restaurantes, cines AMC. La salida "a la ciudad" más cercana.</div>
    </div>
    <div class="row">
      <div class="dest">NASA / Johnson Space Center</div>
      <div class="miles">22 mi</div>
      <div class="time">28 min</div>
      <div class="note">Por TX-35 → Beltway 8 Este. Común para trabajadores aeroespaciales en Clear Lake.</div>
    </div>
    <div class="row">
      <div class="dest">Texas Medical Center</div>
      <div class="miles">26 mi</div>
      <div class="time">35 min</div>
      <div class="note">Hwy 288 N. Más lento en hora pico — 50 min en horas pico.</div>
    </div>
    <div class="row">
      <div class="dest">Centro de Houston</div>
      <div class="miles">28 mi</div>
      <div class="time">35–55 min</div>
      <div class="note">Hwy 288 o Beltway 8. Fuera de horas pico: fácil. En hora pico: hasta 55.</div>
    </div>
    <div class="row">
      <div class="dest">Playa de Galveston</div>
      <div class="miles">35 mi</div>
      <div class="time">45 min</div>
      <div class="note">I-45 Sur. Distancia ideal para un domingo de paseo.</div>
    </div>
    <div class="row">
      <div class="dest">Aeropuerto Bush (IAH)</div>
      <div class="miles">45 mi</div>
      <div class="time">55 min</div>
      <div class="note">El aeropuerto Hobby (HOU) está más cerca: 22 mi / 28 min.</div>
    </div>
  </div>
</section>

<section class="guide" style="padding-top: 0;">
  <div class="sec-head">
    <div>
      <div class="eyebrow">Escuelas</div>
      <h2>Alvin ISD — <em>y opciones cercanas.</em></h2>
    </div>
    <p>
      Las seis propiedades de Yellowstone están dentro del distrito escolar <strong>Alvin Independent School District</strong>, calificación "A" por la TEA, con más de 30,000 estudiantes. Abajo están los planteles más comunes para residentes de nuestras propiedades; el sitio de Alvin ISD tiene la búsqueda oficial por dirección.
    </p>
  </div>

  <div class="schools-grid">
    <div class="text">
      <p>
        <strong>Alvin ISD</strong> está consistentemente entre los mejores distritos del condado de Brazoria. Los estudiantes de las seis propiedades de Yellowstone típicamente asisten a <strong>Alvin Elementary, Harby Junior High, y Alvin High School</strong>, con opciones de programa magnet en <strong>Alvin Junior High Academy</strong> y el programa para estudiantes dotados <strong>Gifted &amp; Talented de Alvin ISD</strong>.
      </p>
      <p>
        Para educación superior, <strong>Alvin Community College</strong> es un colegio de 2 años con fuertes programas en enfermería, soldadura y aeroespacial. <strong>University of Houston-Clear Lake</strong> está a 25 minutos al este. <strong>Rice University</strong> y <strong>Texas Southern</strong> a 35 minutos por la 288.
      </p>
      <p>
        Opciones privadas cerca: <strong>St. Helen Catholic School</strong> (PK–8), <strong>Brazos Christian Academy</strong>, y <strong>Logos Preparatory Academy</strong> en Sugar Land para K–12.
      </p>
    </div>
    <div class="schools-list">
      <div class="item"><span class="name">Alvin Elementary</span><span class="grade">PK–4</span></div>
      <div class="item"><span class="name">Stevenson Primary</span><span class="grade">PK–2</span></div>
      <div class="item"><span class="name">Harby Junior High</span><span class="grade">5–8</span></div>
      <div class="item"><span class="name">Alvin Junior High Academy</span><span class="grade">5–8 · magnet</span></div>
      <div class="item"><span class="name">Alvin High School</span><span class="grade">9–12</span></div>
      <div class="item"><span class="name">Alvin Community College</span><span class="grade">2 años</span></div>
    </div>
  </div>
</section>

<section class="pull">
  <div class="inner">
    <div class="mark">"</div>
    <div>
      <blockquote>
        <em>Viví en The Heights diez años. Me mudé aquí por las escuelas y el precio — lo que me sorprendió fue cuánto disfruto tener un patio de verdad, conocer al cartero por su nombre, y poder ir en bici a una panadería el sábado por la mañana.</em>
      </blockquote>
      <cite>— Sara K., residente de Yellowstone desde 2022</cite>
    </div>
  </div>
</section>

<section class="guide" style="padding-top: 0;">
  <div class="sec-head">
    <div>
      <div class="eyebrow">Fines de semana</div>
      <h2>Cómo pasan <em>realmente</em> el sábado los residentes.</h2>
    </div>
    <p>
      Una lista corta de lo que hay todo el año. Alvin destaca por sus eventos de pueblo pequeño — el rodeo, el festival de la fresa, y el desfile de Navidad son los tres que más escuchará.
    </p>
  </div>

  <div class="things">
    <div class="t">
      <div class="num">01</div>
      <h4>Granja Froberg's</h4>
      <p>Recolección de fresas feb–abril, calabazas en octubre, helado de durazno todo el verano. El ritual de la Hwy 6.</p>
    </div>
    <div class="t">
      <div class="num">02</div>
      <h4>Rodeo de Alvin &amp; Frontier Days</h4>
      <p>A finales de mayo, cuatro noches de jineteo de toros, mutton bustin', y un desfile por el centro. Gratis para niños.</p>
    </div>
    <div class="t">
      <div class="num">03</div>
      <h4>Bayou Wildlife Zoo</h4>
      <p>Safari para manejar afueras de la ciudad. Las cabras meten la cabeza en su carro. A 12 minutos de cualquier propiedad.</p>
    </div>
    <div class="t">
      <div class="num">04</div>
      <h4>Día en Galveston</h4>
      <p>Pleasure Pier, Strand, playa. Salida a las 9, de regreso para la cena. Tradición dominical de marzo a octubre.</p>
    </div>
    <div class="t">
      <div class="num">05</div>
      <h4>Teatro Comunitario de Alvin</h4>
      <p>Teatro local en el campus de ACC. 6 producciones al año, boletos a $15. Sondheim sorprendentemente bueno.</p>
    </div>
    <div class="t">
      <div class="num">06</div>
      <h4>Chapoteadero de Briscoe Park</h4>
      <p>Gratis, estacionamiento gratis, sábados de verano desde las 10am. Donde termina toda familia de Yellowstone con hijos.</p>
    </div>
    <div class="t">
      <div class="num">07</div>
      <h4>Disc golf en National Oak</h4>
      <p>Cancha de 18 hoyos, gratis, iluminada hasta las 9pm. Lleve repelente en verano.</p>
    </div>
    <div class="t">
      <div class="num">08</div>
      <h4>Desfile de Navidad &amp; encendido del árbol</h4>
      <p>Primer sábado de diciembre. Cierran el centro, banda de la escuela, tractores iluminados. Lleve silla.</p>
    </div>
  </div>
</section>

<section class="guide" style="padding-top: 0;">
  <div class="sec-head">
    <div>
      <div class="eyebrow">Preguntas comunes</div>
      <h2><em>Respuestas honestas</em> para los recién llegados.</h2>
    </div>
    <p>
      Recibimos las mismas preguntas de cada nuevo residente que viene de Houston, Pearland, o de fuera del estado. Aquí están las más comunes — sin retórica de folleto.
    </p>
  </div>

  <div class="faq-list">
    <div class="faq-item">
      <h4>¿Es seguro Alvin?</h4>
      <p>Sí. Las tasas de delincuencia son menores que en Houston y Pearland. Las propiedades de Yellowstone están en cuadras residenciales establecidas al sur del centro — calles tranquilas, vecinos que se conocen. Monitoreamos cada propiedad y atendemos llamadas fuera de horario.</p>
    </div>
    <div class="faq-item">
      <h4>¿Y las inundaciones?</h4>
      <p>Esto es Texas — pregunta válida. Ninguna de nuestras seis propiedades está en zona de inundación de 100 años de FEMA, y ninguna se inundó durante Harvey (2017), Imelda (2019) ni Beryl (2024). Le compartimos el mapa de FEMA y nuestra lista de preparación para huracanes a solicitud.</p>
    </div>
    <div class="faq-item">
      <h4>¿Necesito carro?</h4>
      <p>Sí. Alvin es una ciudad para manejar — sin tren ligero, sin autobús Metro a Houston. Lo bueno: cada unidad de Yellowstone tiene al menos un espacio asignado, y todas las propiedades están a 5–10 minutos de supermercado, gasolinera y restaurantes.</p>
    </div>
    <div class="faq-item">
      <h4>¿Cómo es el clima?</h4>
      <p>Veranos calurosos (junio–septiembre: máximas 90–98°F, húmedo). Inviernos templados (diciembre–febrero: usualmente 50s–60s°F, congelaciones ocasionales). Primavera y otoño son hermosos. Temporada de huracanes junio–noviembre — mantenemos a los residentes informados y las propiedades preparadas.</p>
    </div>
    <div class="faq-item">
      <h4>¿Y el internet?</h4>
      <p>Comcast/Xfinity cubre las seis propiedades con fibra de gigabit. AT&amp;T fiber está disponible en la mayoría. T-Mobile 5G Home Internet es una tercera opción. Los residentes contratan su propio servicio; sin proveedor incluido.</p>
    </div>
    <div class="faq-item">
      <h4>¿Es bueno para niños?</h4>
      <p>Mucho. Alvin ISD está calificado "A", tres de nuestras seis propiedades están a pie de una escuela primaria, y Briscoe Park es el centro de reunión informal de fin de semana. Cerca del 60% de nuestros residentes tienen hijos.</p>
    </div>
  </div>
</section>

<section class="guide" style="padding-top: 0;">
  <div class="cta">
    <div>
      <h3>¿Listo para <em>ver lo disponible?</em></h3>
      <p>Tenemos unidades en las seis propiedades. Visite cualquiera con el equipo de Yellowstone — somos locales y respondemos el mismo día.</p>
    </div>
    <div class="btns">
      <a class="btn primary" href="/es#disponibilidad">Ver disponibilidad →</a>
      <a class="btn ghost" href="/es#contacto">Programar tour</a>
    </div>
  </div>
</section>

<footer class="foot">
  <div>© Yellowstone Asset Management · Alvin, TX</div>
  <div>
    <a href="/es">Inicio</a> ·
    <a href="/living-in-alvin">English</a> ·
    <a href="tel:+18322103968">(832) 210-3968</a> ·
    <a href="mailto:office@yellowstone-am.com">office@yellowstone-am.com</a>
  </div>
</footer>

<div class="ys-fab-stack" aria-label="Acciones rápidas">
  <a class="ys-fab-guide" href="/es">
    <em>Inicio</em>
    <span>&rarr;</span>
  </a>
  <div class="ys-fab-pill" role="group" aria-label="Idioma">
    <a href="/living-in-alvin" hreflang="en">EN</a>
    <span class="ys-fab-sep">·</span>
    <a href="/vivir-en-alvin" class="active" hreflang="es">ES</a>
  </div>
  <a class="ys-fab-text" href="sms:+18322103968?&amp;body=Hola%2C%20me%20interesa%20una%20unidad." aria-label="Envíenos un SMS">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
    <span>Mensaje</span>
  </a>
</div>
`;

export default function VivirEnAlvinClient() {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = 'es';
    }
    if (typeof IntersectionObserver === 'undefined') return;
    document.querySelectorAll('section:not(.hero)').forEach((el) => { el.classList.add('ys-reveal'); });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('ys-revealed'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.ys-reveal').forEach((el) => { obs.observe(el); });
    return () => {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = 'en';
      }
    };
  }, []);

  return (
    <>
      <style>{PAGE_CSS}</style>
      <noscript><style>{`.ys-reveal { opacity: 1 !important; transform: none !important; }`}</style></noscript>
      <div dangerouslySetInnerHTML={{ __html: BODY_HTML }} />
    </>
  );
}

