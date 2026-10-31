/* Gemeinsame Hilfen für die automatischen Tests (Playwright, Chromium).
 * Start: siehe tests/README.md */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DOCS = path.resolve(__dirname, '..', 'docs');
const TYPEN = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8'
};

function serverStarten() {
  return new Promise((ok) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (p.endsWith('/')) p += 'index.html';
      const datei = path.join(DOCS, p);
      if (!datei.startsWith(DOCS) || !fs.existsSync(datei) || fs.statSync(datei).isDirectory()) {
        res.writeHead(404); res.end('nicht gefunden'); return;
      }
      res.writeHead(200, { 'Content-Type': TYPEN[path.extname(datei)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      fs.createReadStream(datei).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => ok({ server, basis: `http://127.0.0.1:${server.address().port}/` }));
  });
}

let fehlerZahl = 0;
let pruefZahl = 0;
function pruefe(bedingung, text, details) {
  pruefZahl++;
  if (bedingung) console.log('  ✓ ' + text);
  else { fehlerZahl++; console.log('  ✗ ' + text + (details !== undefined ? '  → ' + JSON.stringify(details) : '')); }
}
function ergebnis() {
  console.log(`\n${pruefZahl - fehlerZahl} von ${pruefZahl} Prüfungen bestanden.`);
  return fehlerZahl === 0;
}

const MOBIL = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

/* Beobachtet Konsolenfehler und Anfragen an fremde Adressen */
function beobachten(seite, protokoll, name) {
  seite.on('console', (m) => { if (m.type() === 'error') protokoll.konsole.push(`[${name}] ${m.text()}`); });
  seite.on('pageerror', (e) => protokoll.konsole.push(`[${name}] ${e.message}`));
  seite.on('request', (r) => {
    const u = r.url();
    if (!u.startsWith('http://127.0.0.1') && !u.startsWith('data:') && !u.startsWith('blob:')) protokoll.extern.push(u);
  });
}

module.exports = { chromium, serverStarten, pruefe, ergebnis, MOBIL, beobachten, DOCS };
