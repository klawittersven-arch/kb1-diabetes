# KB I – Diabetes mellitus · Regelkreis & sicheres Handeln (3BFP2)

Arbeitsblatt mit zwei kleinen Smartphone-Übungen zur Vorbereitung auf die Klassenarbeit
(generalistische Pflegeausbildung, 2. Ausbildungsjahr, KB I).

Das Arbeitsblatt schließt die letzten Lücken vor der Klausur:

| Teil | Aufgabe | Wo? | Inhalt |
|---|---|---|---|
| A | A1 Wortbaustein-Detektiv | 📱 `regelkreis.html` | Glykogenese, Glykogenolyse, Glukoneogenese; Regelkreis in die richtige Reihenfolge tippen |
| A | A2 Regelkreis in 5 Schritten | ✍️ Papier | im Klausurformat mit allen Fachbegriffen |
| A | A3 Präzisieren | ✍️ Papier | Satz zur Glukoneogenese auf dem AB „So regelt Insulin den Blutzucker“ |
| B | B1 Sicher entscheiden | 📱 `sicher.html` | Hypoglykämie-Maßnahmen begründen; STOPP-Checkliste, wenn keine Mahlzeit kommt |
| B | B2 Maßnahmen begründen | ✍️ Papier | drei Sofortmaßnahmen bei Hypoglykämie mit „…, weil …“ |

Faustregel für die Aufteilung: **Papier**, wo die Klausur freies Schreiben verlangt (Fachbegriffe
abrufen, in Schritten beschreiben, begründen). **Smartphone**, wo zugeordnet, sortiert oder
entschieden wird – dort korrigiert die sofortige Rückmeldung Fehlvorstellungen schneller.
Jede Smartphone-Übung endet mit einem Merksatz, den die SuS als Lückentext auf dem AB ergänzen.

Spätfolgen sind **nicht** enthalten – sie wurden mit AB 01 (Gruppenpuzzle) und AB 02
(Körperlandkarte, Mythen) bereits bearbeitet.

## Dateien

```
arbeitsblatt/        ← Arbeitsblatt (AFG) und Lösung mit Lehrkraft-Hinweisen (LSG), je .docx und .pdf
docs/                ← alles, was GitHub Pages veröffentlicht (die Web-App)
  inhalte.js         ← ALLE Texte der Übungen (hier ändern Sie Aufgaben, Tipps, Merksätze …)
  index.html, regelkreis.html, sicher.html
  app.js, gemeinsam.js, style.css, sw.js   ← Programmlogik, Gestaltung, Offline-Speicher
qr/                  ← QR-Codes (PNG) für regelkreis.html und sicher.html
werkzeuge/
  qr_erzeugen.py     ← erzeugt und prüft die QR-Codes
  ab_erstellen.js    ← erzeugt Arbeitsblatt und Lösung als .docx (Bilder in werkzeuge/bilder/)
tests/               ← automatische Tests (Playwright), Ergebnisse in tests/ergebnisse/
```

## GitHub Pages einschalten (einmalig, ca. 2 Minuten)

1. Auf GitHub im Repository oben **Settings** öffnen.
2. Links **Pages** wählen.
3. Bei „Build and deployment“ → Source: **Deploy from a branch**.
4. Branch: **main**, Ordner: **/docs** → **Save**.
5. Nach etwa 1–5 Minuten sind die Seiten erreichbar:
   - https://klawittersven-arch.github.io/kb1-diabetes/regelkreis.html
   - https://klawittersven-arch.github.io/kb1-diabetes/sicher.html
   - https://klawittersven-arch.github.io/kb1-diabetes/ (Startseite)

Die QR-Codes im Arbeitsblatt zeigen bereits auf diese Adressen.

**Cloudflare Pages statt GitHub Pages?** Im Cloudflare-Dashboard „Workers & Pages“ → „Create“ →
„Pages“ → „Connect to Git“ → dieses Repository wählen, Build-Befehl leer lassen,
„Build output directory“: `docs`. Dann ändern sich allerdings die Adressen – QR-Codes und
Arbeitsblatt müssen neu erzeugt werden (siehe unten, Basisadresse in `werkzeuge/qr_erzeugen.py`
und `werkzeuge/ab_erstellen.js` anpassen).

## Texte ändern (`docs/inhalte.js`)

Öffnen Sie auf GitHub die Datei `docs/inhalte.js` und klicken Sie auf den Stift („Edit this file“).

- Ändern Sie nur den Text **zwischen den einfachen Hochkommas** `' … '`.
- Hochkommas, Kommas am Zeilenende und Klammern `{ } [ ]` bleiben stehen.
- Deutsche Anführungszeichen „ … “ dürfen Sie frei verwenden; ein einfaches Hochkomma im
  Text schreiben Sie als `\'`. `**Wort**` wird fett, `\n` beginnt eine neue Zeile.
- Unten auf „Commit changes“ klicken. Nach 1–2 Minuten ist die Änderung online.

Wenn Sie einen Merksatz ändern, passen Sie auch den Lückentext auf dem Arbeitsblatt an.

### Schutz gegen Durchklicken

Bei jeder Übung steht in `docs/inhalte.js` `mindestensErsterVersuch` (A1: 10 von 15, B1: 7 von 10).
Sind weniger Aufgaben beim ersten Versuch richtig, erscheint statt des Merksatzes
„Hey, nicht einfach durchklicken!“ mit dem Knopf „Aufgabe neu starten“. Mit `0` schalten Sie die
Prüfung ab.

## Datenschutz

Keine Anmeldung, keine Cookies, keine Analyse, keine fremden Schriften oder Skripte. Die
Übungen übertragen keine Daten; der Bearbeitungsstand liegt nur im Browser des Handys
(sessionStorage/localStorage). Nach dem ersten Aufruf funktionieren die Seiten auch offline
(Service Worker). Nach größeren Änderungen in `docs/sw.js` `var VERSION = 'v1';` erhöhen.

## QR-Codes und Arbeitsblatt neu erzeugen

Nur nötig, wenn sich Repository-Name, Besitzer oder Adresse ändern:

```
pip install segno zxing-cpp pillow
python werkzeuge/qr_erzeugen.py
npm install docx
node werkzeuge/ab_erstellen.js
```

Die PDF-Fassungen entstehen z. B. mit LibreOffice:
`soffice --headless --convert-to pdf --outdir arbeitsblatt arbeitsblatt/*.docx`

## Tests

```
cd tests
npm install            # installiert Playwright
npx playwright install chromium
node uebungen.test.js            # beide Übungen in Handygröße 390 × 844
node offline_datenschutz.test.js # Offline, externe Adressen, Cookies, Dateigrößen
```
