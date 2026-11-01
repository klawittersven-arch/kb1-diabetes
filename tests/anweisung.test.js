/* Fortschritt am Beamer: Anweisung für die Klasse ein- und ausblenden.
 * Läuft mit der Probeansicht (?demo=1, 24 erfundene Namen) – ohne Worker. */
'use strict';
const H = require('./hilfen');

// Liegen alle Karten vollständig im Kartenbereich und unter der Anweisung?
function kartenPassen(seite) {
  return seite.evaluate(() => {
    const mitte = document.querySelector('.tafel-mitte').getBoundingClientRect();
    const karten = [...document.querySelectorAll('.s-karte')].map((k) => k.getBoundingClientRect());
    const box = document.getElementById('anweisung');
    const unten = box.hidden ? 0 : box.getBoundingClientRect().bottom;
    return karten.length > 0 && karten.every((k) => k.top >= mitte.top - 0.5 && k.bottom <= mitte.bottom + 0.5 && k.top >= unten);
  });
}

(async () => {
  const { server, basis } = await H.serverStarten();
  const browser = await H.chromium.launch();
  const protokoll = { konsole: [], extern: [] };

  try {
    for (const [breite, hoehe] of [[1600, 900], [1280, 720]]) {
      console.log(`\n== Beamer ${breite} × ${hoehe}`);
      const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe } });
      const s = await ctx.newPage();
      H.beobachten(s, protokoll, `beamer${breite}`);
      await s.goto(basis + 'fortschritt.html?demo=1');
      await s.waitForSelector('#tafel:not([hidden])');
      const A = await s.evaluate(() => INHALTE.beamer.anweisungen);
      const knopf = (nr) => s.locator(`.anweisung-knopf[data-anweisung="${nr}"]`);
      const box = s.locator('#anweisung');

      H.pruefe(await s.locator('.anweisung-knopf').count() === A.length, `${A.length} Anweisungs-Knöpfe unten`);
      H.pruefe((await knopf(0).innerText()).trim() === A[0].knopf && (await knopf(1).innerText()).trim() === A[1].knopf, 'Beschriftung aus inhalte.js');
      H.pruefe(!(await box.isVisible()), 'Zu Beginn keine Anweisung eingeblendet');
      H.pruefe(await kartenPassen(s), 'Ohne Anweisung: alle 24 Karten passen');

      await knopf(0).click();
      H.pruefe(await box.isVisible() && (await box.innerText()).trim() === A[0].text, `Klick → „${A[0].text}“`);
      H.pruefe(await knopf(0).getAttribute('aria-pressed') === 'true', 'Knopf A ist als aktiv markiert');
      H.pruefe(await s.locator('.s-karte').count() === 24, 'Fortschritt bleibt sichtbar (24 Karten)');
      H.pruefe(await kartenPassen(s), 'Mit Anweisung: alle Karten passen unter die Anweisung');
      const unten = await s.evaluate(() => document.querySelector('.tafel-fuss').getBoundingClientRect().bottom);
      H.pruefe(unten <= hoehe, 'Knöpfe unten bleiben im Bild', unten);
      if (breite === 1600) { await s.waitForTimeout(600); await s.screenshot({ path: 'ergebnisse/fortschritt_anweisung.png' }); }

      await knopf(1).click();
      H.pruefe((await box.innerText()).trim() === A[1].text, `Klick auf B → „${A[1].text}“`);
      H.pruefe(await knopf(0).getAttribute('aria-pressed') === 'false' && await knopf(1).getAttribute('aria-pressed') === 'true', 'Nur Knopf B ist aktiv');

      await s.reload();
      await s.waitForSelector('#tafel:not([hidden])');
      H.pruefe(await box.isVisible() && (await box.innerText()).trim() === A[1].text, 'Nach Neuladen bleibt die Anweisung stehen');
      H.pruefe(await kartenPassen(s), 'Nach Neuladen passen alle Karten');

      await knopf(1).click();
      H.pruefe(!(await box.isVisible()), 'Noch ein Klick → Anweisung ausgeblendet');
      H.pruefe(await kartenPassen(s), 'Karten nutzen danach wieder den ganzen Platz');
      await ctx.close();
    }

    console.log('\n== Allgemein');
    H.pruefe(protokoll.konsole.length === 0, 'Keine Programmfehler in der Konsole', protokoll.konsole);
    H.pruefe(protokoll.extern.length === 0, 'Keine Anfragen an fremde Adressen', protokoll.extern);
  } finally {
    await browser.close();
    server.close();
  }
  process.exit(H.ergebnis() ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
