/* global React */
const { useState: useStateD, useEffect: useEffectD } = React;

/* ============================================================
   Sheet-synced availability data layer
   Reads a published Google Sheet (CSV) and falls back to a
   hardcoded list if the sheet is unreachable.

   To wire your own sheet:
   1. File > Share > Publish to web > select sheet > CSV > Publish
   2. Paste the resulting URL below as SHEET_CSV_URL
   3. Sheet columns (in this exact order, header row required):
      property,addr,type,sqft,price,ready,featured
      e.g. Kings Haven,410 S 2nd,2 Bed · 1 Bath,850,925,Available now,true
============================================================ */

const SHEET_CSV_URL = ""; // <-- paste your published-CSV URL here

const FALLBACK_AVAILABILITY = [
  { property: "Kings Haven",       addr: "410 S 2nd",        type: "2 Bed · 1 Bath",   sqft: 850,  price: 925,  ready: "Available now", featured: true },
  { property: "French Quarter",    addr: "2550 S Bypass 35", type: "2 Bed · 1 Bath",   sqft: 850,  price: 950,  ready: "Available now", featured: true },
  { property: "Royal Oaks",        addr: "418 S Jackson",    type: "2 Bed · 2 Bath",   sqft: 1150, price: 1395, ready: "Available now", featured: false },
  { property: "White House",       addr: "1606 W Sealy",     type: "2 Bed · 1 Bath",   sqft: 850,  price: 925,  ready: "Available now", featured: true },
  { property: "Kings Manor",       addr: "328 S 2nd",        type: "3 Bed · 2.5 Bath", sqft: 1250, price: 1595, ready: "Available now", featured: false },
  { property: "Kings Haven (100)", addr: "100 S 2nd",        type: "1 Bed · 1 Bath",   sqft: 600,  price: 850,  ready: "Available now", featured: false }
];

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map(line => {
    // basic CSV: split on commas not inside quotes
    const cells = [];
    let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') inQ = !inQ;
      else if (c === "," && !inQ) { cells.push(cur); cur = ""; }
      else cur += c;
    }
    cells.push(cur);
    const row = {};
    headers.forEach((h, i) => row[h] = (cells[i] || "").trim());
    if (row.sqft) row.sqft = Number(row.sqft);
    if (row.price) row.price = Number(row.price);
    if (row.featured) row.featured = /^(true|yes|1|y)$/i.test(row.featured);
    return row;
  }).filter(r => r.property);
}

function useAvailability() {
  const [data, setData] = useStateD(FALLBACK_AVAILABILITY);
  const [status, setStatus] = useStateD(SHEET_CSV_URL ? "loading" : "fallback");
  useEffectD(() => {
    if (!SHEET_CSV_URL) return;
    fetch(SHEET_CSV_URL)
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(text => {
        const rows = parseCSV(text);
        if (rows.length) { setData(rows); setStatus("live"); }
        else setStatus("fallback");
      })
      .catch(() => setStatus("fallback"));
  }, []);
  return { availability: data, status };
}

Object.assign(window, { useAvailability, FALLBACK_AVAILABILITY });
