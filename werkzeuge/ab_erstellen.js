/* Erstellt das Arbeitsblatt (AFG) und die Lösung (LSG) als .docx.
   Aufruf (im Hauptverzeichnis): node werkzeuge/ab_erstellen.js
   Voraussetzung: npm install docx (einmalig) und die QR-Codes in qr/ (python werkzeuge/qr_erzeugen.py).
   Ergebnis: arbeitsblatt/KB1_Regelkreis_sicher_handeln_AFG.docx und …_LSG.docx */
'use strict';
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType,
  BorderStyle, ShadingType, AlignmentType, VerticalAlign, TabStopType, Header, Footer,
  PageNumber, Tab, TableLayoutType, HeightRule
} = require('docx');

const AUS = process.argv[2] || path.resolve(__dirname, '..', 'arbeitsblatt');
const BILD = (n) => fs.readFileSync(path.join(__dirname, 'bilder', n));
const WURZEL = path.resolve(__dirname, '..');
const QR = (s) => fs.readFileSync(path.join(WURZEL, 'qr', `qr_${s}.png`));
const LINK = (s) => `klawittersven-arch.github.io/kb1-diabetes/${s}.html`;

const PETROL_D = '25434B';
const PETROL = '3F6C72';
const HELL = 'EAF2F4';
const ROT = 'C00000';
const GRAU = '6B7B80';
const BREITE = 9906; // Satzspiegel A4 bei 1000 twips Rand links/rechts
const PX = (cm) => Math.round(cm * 37.795); // cm → Pixel (96 dpi) für ImageRun

const keinRand = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const ohneRaender = { top: keinRand, bottom: keinRand, left: keinRand, right: keinRand, insideHorizontal: keinRand, insideVertical: keinRand };
const duenn = { style: BorderStyle.SINGLE, size: 4, color: '7F8C8D' };
const rahmen = { top: duenn, bottom: duenn, left: duenn, right: duenn };
const linienRand = { style: BorderStyle.SINGLE, size: 4, color: '9AA7AA' };

function erstelle(lsg) {
  /* ---------- kleine Bausteine ---------- */
  const t = (text, o = {}) => new TextRun({ text, ...o });
  const b = (text, o = {}) => new TextRun({ text, bold: true, ...o });
  const rot = (text, o = {}) => new TextRun({ text, color: ROT, ...o });
  const p = (children, o = {}) => new Paragraph({ children: Array.isArray(children) ? children : [children], spacing: { after: 60 }, ...o });
  const bild = (daten, wCm, hCm) => new ImageRun({ type: 'png', data: daten, transformation: { width: PX(wCm), height: PX(hCm) } });

  // Schreiblinien als Tabelle (jede Zeile hat ihren eigenen Strich – auch in Word und LibreOffice).
  // zeilen: [[nummer, loesungstext], …]; in der Lösung steht der rote Text auf der Linie.
  const linien = (zeilen) => new Table({
    width: { size: BREITE, type: WidthType.DXA }, columnWidths: [420, BREITE - 420], layout: TableLayoutType.FIXED,
    borders: ohneRaender,
    rows: zeilen.map(([nr, loesung]) => new TableRow({
      height: { value: 470, rule: HeightRule.EXACT },
      children: [
        new TableCell({ width: { size: 420, type: WidthType.DXA }, borders: { top: keinRand, left: keinRand, right: keinRand, bottom: keinRand }, verticalAlign: VerticalAlign.BOTTOM,
          children: [new Paragraph({ spacing: { after: 0 }, children: nr ? [b(nr, { color: PETROL_D })] : [] })] }),
        new TableCell({ width: { size: BREITE - 420, type: WidthType.DXA }, borders: { top: keinRand, left: keinRand, right: keinRand, bottom: linienRand }, verticalAlign: VerticalAlign.BOTTOM,
          children: [new Paragraph({ spacing: { after: 0 }, children: lsg && loesung ? [rot(loesung, { size: 20 })] : [] })] })
      ]
    }))
  });

  // Teil-Überschrift als farbiger Balken
  const teil = (text, zeit) => new Paragraph({
    children: [b(text, { color: 'FFFFFF', size: 24 }), new TextRun({ children: [new Tab(), zeit], color: 'FFFFFF', size: 20 })],
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: PETROL_D },
    tabStops: [{ type: TabStopType.RIGHT, position: BREITE - 60 }],
    spacing: { before: 200, after: 80 },
    indent: { left: 60, right: 60 },
    keepNext: true
  });

  // Aufgabenkopf mit Symbol (Handy/Stift), Nummer, Titel und Zeit
  const aufgabe = (art, nr, titel, zeit) => new Paragraph({
    children: [
      bild(BILD(art === 'handy' ? 'icon_handy.png' : 'icon_stift.png'), 0.62, 0.62),
      b(`  ${nr} · ${titel}`, { color: PETROL_D, size: 23 }),
      new TextRun({ children: [new Tab(), (art === 'handy' ? 'Smartphone · ' : 'Papier · ') + zeit], color: GRAU, size: 19 })
    ],
    tabStops: [{ type: TabStopType.RIGHT, position: BREITE }],
    spacing: { before: 140, after: 40 },
    keepNext: true
  });

  // Text links, QR-Code rechts
  const mitQR = (seite, absaetze) => new Table({
    width: { size: BREITE, type: WidthType.DXA },
    columnWidths: [BREITE - 1800, 1800],
    layout: TableLayoutType.FIXED,
    borders: ohneRaender,
    rows: [new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: BREITE - 1800, type: WidthType.DXA }, borders: ohneRaender, verticalAlign: VerticalAlign.CENTER,
          children: [...absaetze, p([t('Link: ', { size: 17, color: GRAU }), t(LINK(seite), { size: 17, color: GRAU })], { spacing: { before: 40, after: 0 } })]
        }),
        new TableCell({
          width: { size: 1800, type: WidthType.DXA }, borders: ohneRaender, verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [bild(QR(seite), 2.7, 2.7)] })]
        })
      ]
    })]
  });

  // Kasten (eine Zelle, Rand, hell hinterlegt)
  const kasten = (absaetze, fill = 'FFFFFF', randFarbe = PETROL) => {
    const r = { style: BorderStyle.SINGLE, size: 12, color: randFarbe };
    return new Table({
      width: { size: BREITE, type: WidthType.DXA }, columnWidths: [BREITE], layout: TableLayoutType.FIXED,
      rows: [new TableRow({ cantSplit: true, children: [new TableCell({
        width: { size: BREITE, type: WidthType.DXA },
        borders: { top: r, bottom: r, left: r, right: r },
        shading: { type: ShadingType.CLEAR, color: 'auto', fill },
        margins: { top: 80, bottom: 80, left: 140, right: 140 },
        children: absaetze
      })] })]
    });
  };

  // Lücke im Merksatz: leer = Unterstrich, Lösung = rotes Wort
  const luecke = (wort, breite = 12) => lsg ? rot(wort, { bold: true, underline: {} }) : t('_'.repeat(breite));

  /* ---------- Kopf (wie Schulvorlage) ---------- */
  const zelle = (children, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: rahmen, margins: { left: 80, right: 80, top: 20, bottom: 20 }, verticalAlign: VerticalAlign.CENTER, children, ...o });
  const kt = (text, fett = false) => new Paragraph({ children: [new TextRun({ text, bold: fett, size: 18 })], spacing: { after: 0 } });
  const kopfTabelle = new Table({
    width: { size: BREITE, type: WidthType.DXA },
    columnWidths: [3000, 3453, 3453],
    layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({ children: [
        zelle([new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [bild(BILD('logo.png'), 4.6, 1.38)] })], 3000, { rowSpan: 3 }),
        zelle([kt('Name:')], 3453), zelle([kt('Datum:')], 3453)
      ] }),
      new TableRow({ children: [zelle([kt('Klasse | Fach | Lehrer*in: 3BFP2 | KB I | Lo / Kl')], 6906, { columnSpan: 2 })] }),
      new TableRow({ children: [zelle([kt('Themenblock I – Thema: Diabetes mellitus · Klausurvorbereitung', true)], 6906, { columnSpan: 2 })] })
    ]
  });

  /* ---------- Inhalt ---------- */
  const inhalt = [];

  inhalt.push(new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 60, after: 80 },
    children: [b('Regelkreis & sicheres Handeln – Feinschliff für die Klausur', { size: 30, color: PETROL_D }),
      ...(lsg ? [b('  [LSG]', { size: 30, color: ROT })] : [])]
  }));
  inhalt.push(p([b('Lernziel: '), t('Sie beschreiben den Regelkreis des Blutzuckers mit allen Fachbegriffen und begründen Ihr Handeln bei einer Hypoglykämie und bei einer Insulingabe ohne Mahlzeit.')], { spacing: { after: 40 } }));
  inhalt.push(p([b('Vorwissen: '), t('„So regelt Insulin den Blutzucker“ · „Es war einmal … das Leben“ · „Sicher entscheiden vor der Insulingabe“ · „Akutkomplikation: Hyperglykämie / Hypoglykämie“', { color: '3A5157' })], { spacing: { after: 40 } }));
  inhalt.push(p([
    bild(BILD('icon_handy.png'), 0.5, 0.5), t(' = am Smartphone (QR-Code scannen)      ', { size: 20 }),
    bild(BILD('icon_stift.png'), 0.5, 0.5), t(' = auf Papier – so wie in der Klausur', { size: 20 })
  ], { spacing: { after: 40 } }));

  // ---------- Teil A: Regelkreis ----------
  inhalt.push(teil('Teil A · Regelkreis – die fehlenden Fachbegriffe', '≈ 15 Min.'));
  inhalt.push(aufgabe('handy', 'A1', 'Wortbaustein-Detektiv', '5 Min.'));
  inhalt.push(mitQR('regelkreis', [
    p(t('Scannen Sie den QR-Code. Knacken Sie die Fachbegriffe Glykogenese, Glykogenolyse und Glukoneogenese und bringen Sie den Regelkreis in die richtige Reihenfolge. Bei einem Fehler bekommen Sie einen Tipp.')),
    p([b('Am Ende: '), t('Ergänzen Sie den Merksatz.')])
  ]));
  const msZeile = (begriff, bedeutung, hormon) => new Paragraph({
    spacing: { before: 70, after: 70 },
    children: [b(begriff, { color: PETROL_D }), t(' = '), luecke(bedeutung, 30), ...(hormon ? [t('  (durch '), luecke(hormon, 14), t(')')] : [])]
  });
  inhalt.push(kasten([
    p(b('Merksatz A1', { color: PETROL_D }), { spacing: { after: 0 } }),
    msZeile('Glykogenese', 'Glykogen aufbauen', 'Insulin'),
    msZeile('Glykogenolyse', 'Glykogen abbauen', 'Glukagon'),
    msZeile('Glukoneogenese', 'Glukose neu bilden', null)
  ]));

  inhalt.push(aufgabe('stift', 'A2', 'Der Regelkreis in 5 Schritten – im Klausurformat', '8 Min.'));
  inhalt.push(p([b('Handy weg! '), t('Beschreiben Sie den Regelkreis des Blutzuckers in fünf Schritten – von der kohlenhydratreichen Mahlzeit bis zum erneuten Anstieg des Blutzuckers. Verwenden Sie die Fachbegriffe: '),
    b('β-Zellen · α-Zellen · Insulin · Glukagon · Glykogenese · Glykogenolyse · Glukoneogenese'), t('.')]));
  inhalt.push(linien([
    ['1', 'Nach einer kohlenhydratreichen Mahlzeit steigt der Glukosegehalt im Blut.'],
    ['2', 'Die β-Zellen der Bauchspeicheldrüse geben mehr Insulin ab.'],
    ['3', 'Insulin wirkt: Die Muskelzellen nehmen Glukose auf, die Leber speichert Glukose als Glykogen'],
    ['', '(Glykogenese) → der Blutzucker sinkt.'],
    ['4', 'Sinkt der Blutzucker, geben die β-Zellen weniger Insulin und die α-Zellen mehr Glukagon ab.'],
    ['', ''],
    ['5', 'Die Leber baut Glykogen ab (Glykogenolyse) und bildet neue Glukose (Glukoneogenese)'],
    ['', '→ der Blutzucker steigt wieder.']
  ]));
  inhalt.push(p(t('Tipp: Prüfen Sie am Ende – stehen alle sieben Fachbegriffe in Ihrem Text? In der Klausur kostet jeder fehlende Fachbegriff Punkte.', { size: 19, color: GRAU }), { spacing: { before: 60 } }));

  inhalt.push(aufgabe('stift', 'A3', 'Präzisieren', '1 Min.'));
  inhalt.push(p([t('Streichen Sie auf dem AB „So regelt Insulin den Blutzucker“ im Infotext den Satz „Diesen Prozess nennt man Glukoneogenese.“ Schreiben Sie stattdessen: '),
    b('„Dabei baut die Leber Glykogen ab (Glykogenolyse) und bildet neue Glukose (Glukoneogenese).“')]));

  // ---------- Teil B: Sicher handeln ----------
  inhalt.push(teil('Teil B · Sicher handeln', '≈ 15 Min.'));
  inhalt.push(aufgabe('handy', 'B1', 'Sicher entscheiden', '6 Min.'));
  inhalt.push(mitQR('sicher', [
    p(t('Scannen Sie den QR-Code: Begründen Sie die Maßnahmen bei einer Hypoglykämie und entscheiden Sie mit der STOPP-Checkliste, was zu tun ist, wenn keine Mahlzeit kommt.')),
    p([b('Am Ende: '), t('Ergänzen Sie den Merksatz.')])
  ]));
  inhalt.push(kasten([
    p(b('Merksatz B1', { color: PETROL_D }), { spacing: { after: 0 } }),
    new Paragraph({ spacing: { before: 70, after: 70 }, children: [b('Hypoglykämie: ', { color: PETROL_D }), t('schnelle '), luecke('KH', 8), t(' → Aktivität '), luecke('stoppen', 10), t(' → nach 15–30 Min. '), luecke('nachmessen', 12), t(' → langsame KH.')] }),
    new Paragraph({ spacing: { before: 70, after: 70 }, children: [b('Keine Mahlzeit: ', { color: PETROL_D }), t('mahlzeitenbezogenes Insulin '), luecke('nicht', 8), t(' wie geplant; Basalinsulin deckt den '), luecke('Grundbedarf', 13), t('. Nie selbst ändern – '), luecke('Rücksprache', 13), t('!')] })
  ]));

  inhalt.push(aufgabe('stift', 'B2', 'Hypoglykämie – Maßnahmen begründen', '7 Min.'));
  inhalt.push(p([b('Handy weg! '), t('Frau Schneider ist nach dem Treppensteigen blass, zittrig und verschwitzt. Der Blutzucker beträgt 58 mg/dl. Sie ist wach und kann schlucken. '),
    t('Beschreiben Sie drei Sofortmaßnahmen und begründen Sie jede: ', {}), b('„Ich …, weil …“')]));
  inhalt.push(linien([
    ['1', 'Ich gebe sofort schnell wirksame Kohlenhydrate (Traubenzucker, Saft), weil sie rasch ins Blut'],
    ['', 'gelangen – sie ist wach und kann schlucken.'],
    ['2', 'Ich lasse sie hinsetzen, beende die Aktivität und lasse sie nicht allein, weil Bewegung'],
    ['', 'zusätzlich Glukose verbraucht und Sturzgefahr besteht.'],
    ['3', 'Ich messe nach 15–30 Min. erneut den BZ, weil ich prüfen muss, ob er steigt; danach gebe ich'],
    ['', 'langsame KH (z. B. Brot), weil das Insulin weiterwirkt. (Auch richtig: informieren, dokumentieren.)']
  ]));

  // ---------- Selbstcheck ----------
  inhalt.push(teil('Selbstcheck vor der Klausur', '2 Min.'));
  const sc = [
    '… den Regelkreis in 5 Schritten mit Glykogenese, Glykogenolyse und Glukoneogenese beschreiben (A1, A2).',
    '… Maßnahmen bei einer Hypoglykämie beschreiben und begründen (B1, B2).',
    '… mit der STOPP-Checkliste beurteilen, ob Insulin ohne Mahlzeit wie geplant gegeben werden kann (B1).'
  ];
  const sw = [6306, 1200, 1200, 1200];
  const scZelle = (children, w, fill) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: rahmen, margins: { left: 80, right: 80, top: 30, bottom: 30 }, verticalAlign: VerticalAlign.CENTER, shading: fill ? { type: ShadingType.CLEAR, color: 'auto', fill } : undefined, children });
  const mitte = (text, o = {}) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text, size: 20, ...o })] });
  inhalt.push(new Table({
    width: { size: BREITE, type: WidthType.DXA }, columnWidths: sw, layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: [scZelle([p(b('Ich kann …', { size: 20 }), { spacing: { after: 0 } })], sw[0], HELL), scZelle([mitte('sicher', { bold: true })], sw[1], HELL), scZelle([mitte('fast', { bold: true })], sw[2], HELL), scZelle([mitte('noch nicht', { bold: true })], sw[3], HELL)] }),
      ...sc.map((s) => new TableRow({ cantSplit: true, children: [scZelle([p(t(s, { size: 20 }), { spacing: { after: 0 } })], sw[0]), scZelle([mitte('☐', { size: 24 })], sw[1]), scZelle([mitte('☐', { size: 24 })], sw[2]), scZelle([mitte('☐', { size: 24 })], sw[3])] }))
    ]
  }));
  inhalt.push(p(t('Noch nicht sicher? Die QR-Übungen funktionieren auch zu Hause – so oft Sie wollen. Die Ich-kann-Liste hilft beim Wiederholen.', { size: 19, color: GRAU }), { spacing: { before: 60 } }));

  // ---------- Hinweise für die Lehrkraft (nur LSG) ----------
  if (lsg) {
    inhalt.push(new Paragraph({ pageBreakBefore: true, children: [b('Hinweise für die Lehrkraft', { size: 26, color: PETROL_D })], spacing: { after: 80 } }));
    const hw = [2700, 7206];
    const hz = (a, c, fill) => new TableRow({ cantSplit: true, children: [scZelle([p(a, { spacing: { after: 0 } })], hw[0], fill), scZelle([p(c, { spacing: { after: 0 } })], hw[1], fill)] });
    inhalt.push(new Table({
      width: { size: BREITE, type: WidthType.DXA }, columnWidths: hw, layout: TableLayoutType.FIXED,
      rows: [
        hz(b('Aufgabe / Zeit'), b('Bezug zur Klassenarbeit (KB 1, v4) und Begründung Papier/Smartphone'), HELL),
        hz(t('A1 Handy · A2, A3 Papier (≈ 15 Min.)'), t('Aufgabe 3 (Regelkreis in 5 Schritten; je fehlendem Fachbegriff 0,5 P. Abzug). Glykogen, Glykogenese und Glykogenolyse kamen auf den bisherigen AB nicht vor. A1 am Handy: Wortbausteine und Reihenfolge mit Sofort-Rückmeldung. A2 auf Papier, weil die Klausur das freie Aufschreiben mit allen Fachbegriffen verlangt. A3 präzisiert die vereinfachte Formulierung „Glukoneogenese“ im Infotext des AB „So regelt Insulin den Blutzucker“.')),
        hz(t('B1 Handy · B2 Papier (≈ 15 Min.)'), t('Aufgabe 5b (Notfallmaßnahmen beschreiben und begründen) und Aufgabe 4 (STOPP ohne Mahlzeit). B1 klärt außerdem „Insulin reduzieren“ aus der Hypo-Mindmap: Die Dosis ändert nur die Ärztin/der Arzt. B2 auf Papier, weil die Begründungen („…, weil …“) bisher nur als Stichworte in der Mindmap standen. Die Fälle weichen bewusst vom Klausurfall ab.')),
        hz(t('Nicht enthalten'), t('Spätfolgen (Aufgabe 7) – bereits mit AB 01 (Gruppenpuzzle) und AB 02 (Körperlandkarte, Mythen) bearbeitet.')),
        hz(t('Zeitpuffer'), t('Das AB dauert ca. 30–35 Min. Restzeit: Fragen klären oder die Ich-kann-Liste gemeinsam durchgehen. Wer nicht fertig wird, beendet B1/B2 zu Hause.')),
        hz(t('Material'), t('Handys mit Kamera (sonst Tandems oder den Link abtippen). Die App braucht keine Anmeldung, speichert nichts auf einem Server und funktioniert nach dem ersten Laden auch bei schlechtem WLAN.')),
        hz(t('Schutz gegen Durchklicken'), t('Den Merksatz gibt es nur, wenn genug Aufgaben beim ersten Versuch richtig sind (A1: 10 von 15, B1: 7 von 10); sonst muss die Übung neu gestartet werden.')),
        hz(t('Texte ändern'), t('Alle Texte der App stehen in docs/inhalte.js im Repository kb1-diabetes (auf GitHub mit dem Stift bearbeiten, „Commit changes“; nach 1–2 Min. online).'))
      ]
    }));
  }

  return new Document({
    creator: 'S. Klawitter',
    title: lsg ? 'KB I Regelkreis & sicheres Handeln – Lösung' : 'KB I Regelkreis & sicheres Handeln – Arbeitsblatt',
    styles: { default: { document: { run: { font: 'Calibri', size: 21 }, paragraph: { spacing: { line: 264, lineRule: 'auto' } } } } },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1950, right: 1000, bottom: 850, left: 1000, header: 420, footer: 380 } } },
      headers: { default: new Header({ children: [kopfTabelle] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: 'KB I · Regelkreis & sicheres Handeln' + (lsg ? ' · Lösung' : '') + ' · Seite ', size: 16, color: GRAU }),
        new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GRAU }),
        new TextRun({ text: ' von ', size: 16, color: GRAU }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: GRAU })
      ] })] }) },
      children: inhalt
    }]
  });
}

(async () => {
  fs.mkdirSync(AUS, { recursive: true });
  for (const [lsg, name] of [[false, 'KB1_Regelkreis_sicher_handeln_AFG.docx'], [true, 'KB1_Regelkreis_sicher_handeln_LSG.docx']]) {
    const buf = await Packer.toBuffer(erstelle(lsg));
    fs.writeFileSync(path.join(AUS, name), buf);
    console.log('geschrieben:', name, buf.length, 'Bytes');
  }
})();
