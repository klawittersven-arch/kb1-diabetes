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
arbeitsblatt/        ← 03_…_AFG (Arbeitsblatt) und 03_…_LSG (Lösung mit Lehrkraft-Hinweisen), je .docx und .pdf
docs/                ← alles, was GitHub Pages veröffentlicht (die Web-App)
  inhalte.js         ← ALLE Texte (Übungen, Anmeldung am Handy, Beamer-Seite)
  config.js          ← Einstellungen der Fortschrittsanzeige (Worker-Adresse, Sperrwörter …)
  index.html, regelkreis.html, sicher.html
  fortschritt.html   ← Fortschritt am Beamer (für die Lehrkraft, nirgends verlinkt)
  app.js, melden.js, fortschritt.js, gemeinsam.js   ← Programmlogik
  style.css, fortschritt.css, sw.js                 ← Gestaltung, Offline-Speicher
worker/src/index.js  ← Cloudflare-Worker + Durable Object für die Fortschrittsanzeige
wrangler.jsonc       ← Cloudflare-Konfiguration (Projekt „kb1-diabetes“)
qr/                  ← QR-Codes (PNG) für regelkreis.html und sicher.html
werkzeuge/
  qr_erzeugen.py     ← erzeugt und prüft die QR-Codes
  ab_erstellen.js    ← erzeugte die erste Fassung von Arbeitsblatt und Lösung (Bilder in werkzeuge/bilder/)
  lsg_aus_afg.py     ← erzeugt die Lösung aus dem (von Hand überarbeiteten) Arbeitsblatt 03_…_AFG.docx
tests/               ← automatische Tests (Playwright, lokaler Worker), Ergebnisse in tests/ergebnisse/
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

## Fortschritt am Beamer

Die SuS geben oben in der Übung ihren **Vornamen** und den **Raumcode** ein. Auf
`https://klawittersven-arch.github.io/kb1-diabetes/fortschritt.html` sehen Sie live, wie weit
alle sind: je Person ein Balken für A1 und B1 („x von y gelöst“), ✓ = Merksatz erreicht,
⚠ = zu viel geraten (Übung musste neu gestartet werden). Einzelne Antworten werden **nicht**
übertragen. Wer „Ohne Anzeige weiter“ wählt, arbeitet ganz normal – es wird nichts gesendet.

### Einrichtung (einmalig, ca. 5 Minuten – wie bei Tetris)

Der Verbindungsdienst läuft als Cloudflare-Worker **`kb1-diabetes`** unter
**https://kb1-diabetes.klawittersven.workers.dev** (diese Adresse steht schon in `docs/config.js`).
Das Cloudflare-Projekt wird – genau wie „tetris“ – direkt mit diesem GitHub-Repository verknüpft;
ein API-Token oder GitHub-Secrets sind nicht nötig.

1. https://dash.cloudflare.com öffnen → links **Workers & Pages** → **Create** (bzw. „Create
   application“) → **Import a repository** / „Continue with GitHub“.
2. GitHub-Konto **klawittersven-arch** und das Repository **kb1-diabetes** wählen.
   (Fehlt es in der Liste: über „Configure GitHub App“ bzw. „+ Add“ der Cloudflare-App Zugriff
   auf `kb1-diabetes` geben.)
3. Einstellungen: **Project name `kb1-diabetes`** (muss genau so heißen), Build command leer
   lassen, Deploy command `npx wrangler deploy`, Root directory `/` → **Deploy**.
4. Nach ca. 1 Minute zeigt https://kb1-diabetes.klawittersven.workers.dev eine kurze Antwort
   `{"dienst":"KB1 Diabetes – Fortschrittsanzeige","ok":true}` – dann ist alles bereit.

Ab dann geht jede Änderung am Worker (`worker/src/index.js`, `wrangler.jsonc`) nach ca. einer
Minute automatisch online. Ob ein Update durchgelaufen ist, sieht man im Cloudflare-Dashboard unter
**Workers & Pages → kb1-diabetes → Deployments**.

### Im Unterricht

1. Am Laptop `…/kb1-diabetes/fortschritt.html` öffnen → **„Neuen Raum starten“**.
2. Der vierstellige **Raumcode** steht groß oben rechts. Die SuS tragen ihn mit ihrem Vornamen in
   der Übung ein (einmal genügt – das Handy merkt sich beides 3 Stunden, auch für die zweite
   Übung). Tipp: `…/regelkreis.html?raum=4821` füllt den Code schon aus.
3. **Vollbild** für den Beamer. **Namen verbergen** zeigt „Person 1, 2 …“ statt Namen – z. B.
   wenn die Klasse den Stand sehen soll, ohne dass Einzelne bloßgestellt werden.
4. **Anweisung A1 + A2** bzw. **Anweisung B1 + B2** (unten, gelb umrandet) blendet groß über den
   Karten ein: „Bearbeiten Sie jetzt die Aufgaben A1 und A2!“ bzw. „… B1 und B2!“. Der Fortschritt
   bleibt darunter sichtbar. Noch ein Klick auf denselben Knopf blendet die Anweisung wieder aus.
   Texte und Knöpfe stehen in `docs/inhalte.js` → `beamer.anweisungen`.
5. Klick auf einen Eintrag → **Entfernen** (z. B. Spaßnamen; das Handy kann sich neu anmelden).
   **Liste leeren** entfernt alle Einträge. **Neuer Raum** für die nächste Klasse.
6. Ein versehentliches Neuladen der Seite ist unproblematisch: Raum, Einträge und eine
   eingeblendete Anweisung bleiben.

**Probeansicht ohne Internet:** `…/fortschritt.html?demo=1` zeigt erfundene Namen – ideal, um vorab
das Aussehen am Beamer zu prüfen.

### Technik, Datenschutz und Kosten

- Das Handy schickt nach jeder Antwort `{ Raumcode, Zufalls-Geräte-ID, Vorname, Übung, x, y,
  Status }` per HTTPS an den Worker. Ohne Netz wird der letzte Stand nachgereicht.
- Der Worker speichert je Raum (ein „Durable Object“) nur diese Angaben. **Lesen kann nur Ihr
  Browser** (geheimer Schlüssel, der beim Starten des Raums entsteht). **Nach 6 Stunden wird der
  Raum samt allen Einträgen automatisch gelöscht** (`LEBENSDAUER_MINUTEN` in
  `wrangler.jsonc`). Cloudflare-Protokolle sind abgeschaltet.
- Bitte nur Vornamen verwenden (Hinweis an die Klasse). Ein Sperrwort-Filter (`SPERRWOERTER` in
  `docs/config.js`) lehnt grobe Namen ab.
- Der kostenlose Cloudflare-Tarif reicht aus (100 000 Anfragen am Tag; eine Stunde mit
  30 SuS braucht etwa 3 000).
- Ist `FORTSCHRITT_URL` leer oder Cloudflare nicht erreichbar, funktionieren die
  Übungen ganz normal – nur die Anzeige bleibt leer.

## Texte ändern (`docs/inhalte.js`)

Öffnen Sie auf GitHub die Datei `docs/inhalte.js` und klicken Sie auf den Stift („Edit this file“).

- Ändern Sie nur den Text **zwischen den einfachen Hochkommas** `' … '`.
- Hochkommas, Kommas am Zeilenende und Klammern `{ } [ ]` bleiben stehen.
- Deutsche Anführungszeichen „ … “ dürfen Sie frei verwenden; ein einfaches Hochkomma im
  Text schreiben Sie als `\'`. `**Wort**` wird fett, `\n` beginnt eine neue Zeile.
- Unten auf „Commit changes“ klicken. Nach 1–2 Minuten ist die Änderung online.

Wenn Sie einen Merksatz ändern, passen Sie auch den Lückentext auf dem Arbeitsblatt an.

### Schutz gegen Durchklicken

Bei jeder Übung steht in `docs/inhalte.js` `mindestensErsterVersuch` (A1: 11 von 17, B1: 7 von 10).
Sind weniger Aufgaben beim ersten Versuch richtig, erscheint statt des Merksatzes
„Hey, nicht einfach durchklicken!“ mit dem Knopf „Aufgabe neu starten“. Mit `0` schalten Sie die
Prüfung ab.

## Datenschutz

Keine Cookies, keine Analyse, keine fremden Schriften oder Skripte. Die Übungen übertragen nur
dann etwas, wenn sich jemand für die Fortschrittsanzeige anmeldet (siehe oben); der
Bearbeitungsstand selbst liegt im Browser des Handys (sessionStorage/localStorage). Nach dem ersten Aufruf funktionieren die Seiten auch offline
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
cd worker && npm install && cd ..   # Wrangler für den lokalen Worker
cd tests
npm install            # installiert Playwright
npx playwright install chromium
node uebungen.test.js            # beide Übungen in Handygröße 390 × 844
node offline_datenschutz.test.js # Offline, externe Adressen, Cookies, Dateigrößen
node fortschritt.test.js         # Beamer + mehrere Handys mit lokalem Worker (wrangler dev)
node anweisung.test.js           # Beamer: Anweisung ein-/ausblenden (Probeansicht, ohne Worker)
```
