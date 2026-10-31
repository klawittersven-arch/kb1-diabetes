"""Erzeugt die Lösung (LSG) aus dem Arbeitsblatt (AFG): Lücken und Schreiblinien werden rot
ausgefüllt, am Ende folgt eine Seite mit Hinweisen für die Lehrkraft.

Aufruf:  python werkzeuge/lsg_aus_afg.py arbeitsblatt/03_Regelkreis_sicher_handeln_AFG.docx \
                                          arbeitsblatt/03_Regelkreis_sicher_handeln_LSG.docx
Voraussetzung: pip install python-docx. Passt zum Aufbau des AFG (Merksätze A1/B1 mit Lücken,
Schreiblinien A2 als Tabelle mit 10 Zeilen, Schreiblinien B2 als ein Absatz aus Unterstrichen).
"""
import copy
import re
import sys
from docx import Document
from docx.enum.text import WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt, RGBColor, Cm

QUELLE, ZIEL = sys.argv[1], sys.argv[2]
ROT = RGBColor(0xC0, 0x00, 0x00)
PETROL = RGBColor(0x25, 0x43, 0x4B)

d = Document(QUELLE)


def eindeutige_zellen(tabelle):
    gesehen = []
    for zeile in tabelle.rows:
        for zelle in zeile.cells:
            if zelle._tc not in [z._tc for z in gesehen]:
                gesehen.append(zelle)
    return gesehen


def luecken_fuellen(absatz, antworten):
    """Ersetzt jede Folge von Unterstrichen (auch über mehrere Läufe) durch die nächste Antwort (rot, fett)."""
    laeufe = list(absatz.runs)
    voll = ''.join(r.text for r in laeufe)
    groesse = next((r.font.size for r in laeufe if r.text.strip() and '_' not in r.text and r.font.size), None)
    gruppen = [m.span() for m in re.finditer(r'_+', voll)]
    assert len(gruppen) == len(antworten), (absatz.text, len(gruppen), antworten)
    pos = 0
    for r in laeufe:
        text = r.text
        start, ende = pos, pos + len(text)
        pos = ende
        if '_' not in text:
            continue
        # Abschnitte dieses Laufs: (Text, Antwortnummer oder None)
        teile = []
        i = start
        while i < ende:
            g = next((k for k, (a, b) in enumerate(gruppen) if a <= i < b), None)
            if g is None:
                j = i
                while j < ende and not any(a <= j < b for a, b in gruppen):
                    j += 1
                teile.append((voll[i:j], None))
                i = j
            else:
                a, b = gruppen[g]
                j = min(b, ende)
                teile.append(('', g) if i != a else (antworten[g], g))
                i = j
        anker = r._r
        for text_teil, g in teile:
            if text_teil == '':
                continue
            neu = copy.deepcopy(r._r)
            for t in neu.findall(qn('w:t')):
                neu.remove(t)
            from docx.text.run import Run
            lauf = Run(neu, absatz)
            lauf.text = text_teil
            if g is not None:
                lauf.font.size = groesse
                lauf.font.color.rgb = ROT
                lauf.font.bold = True
                lauf.font.underline = True
            anker.addnext(neu)
            anker = neu
        r._r.getparent().remove(r._r)


# 1) Titel: „[LSG]“
titel = d.paragraphs[0]
vorlage = titel.runs[1]._r
lsg = copy.deepcopy(vorlage)
titel.runs[-1]._r.addprevious(lsg)
from docx.text.run import Run
lauf = Run(lsg, titel)
lauf.text = '  [LSG]'
lauf.font.color.rgb = ROT

# 2) Merksatz A1 und B1 (verbundene Zellen nur einmal bearbeiten)
tab_a1, tab_a2, tab_b1 = d.tables[0], d.tables[1], d.tables[2]
loesungen = {
    'Glykogenese =': ['Glykogen aufbauen', 'Insulin'],
    'Glykogenolyse =': ['Glykogen abbauen', 'Glukagon'],
    'Glukoneogenese =': ['Glukose neu bilden'],
    'Hypoglykämie: schnelle': ['KH', 'stoppen'],
    '→ nach 15–30 Min.': ['nachmessen'],
    'Keine Mahlzeit:': ['nicht', 'Grundbedarf', 'Rücksprache'],
}
gefuellt = set()
for tab in (tab_a1, tab_b1):
    for zelle in eindeutige_zellen(tab):
        for p in zelle.paragraphs:
            for anfang, antw in loesungen.items():
                if p.text.startswith(anfang) and '_' in p.text:
                    luecken_fuellen(p, antw)
                    gefuellt.add(anfang)
assert gefuellt == set(loesungen), gefuellt

# 3) A2: Regelkreis in den Schreiblinien (Spalte 2, zwei Zeilen je Schritt)
schritte = [
    'Nach einer kohlenhydratreichen Mahlzeit steigt der Glukosegehalt im Blut.', '',
    'Die β-Zellen der Bauchspeicheldrüse geben mehr Insulin ab.', '',
    'Insulin wirkt: Die Muskelzellen nehmen Glukose auf, die Leber speichert Glukose als Glykogen',
    '(Glykogenese) → der Blutzucker sinkt.',
    'Sinkt der Blutzucker, geben die β-Zellen weniger Insulin und die α-Zellen mehr Glukagon ab.', '',
    'Die Leber baut Glykogen ab (Glykogenolyse) und bildet neue Glukose (Glukoneogenese)',
    '→ der Blutzucker steigt wieder.',
]
assert len(tab_a2.rows) == len(schritte)
for zeile, text in zip(tab_a2.rows, schritte):
    if not text:
        continue
    p = zeile.cells[1].paragraphs[0]
    r = p.add_run(text)
    r.font.color.rgb = ROT
    r.font.size = Pt(10)

# 4) B2: statt der Schreiblinien die Musterlösung
b2 = [
    '1  Ich gebe sofort schnell wirksame Kohlenhydrate (Traubenzucker, Saft), weil sie rasch ins Blut gelangen – sie ist wach und kann schlucken.',
    '2  Ich lasse sie hinsetzen, beende die Aktivität und lasse sie nicht allein, weil Bewegung zusätzlich Glukose verbraucht und Sturzgefahr besteht.',
    '3  Ich messe nach 15–30 Min. erneut den Blutzucker, weil ich prüfen muss, ob er steigt; danach gebe ich langsame KH (z. B. Brot), weil das Insulin weiterwirkt.',
    'Ebenfalls richtig: Pflegefachkraft/Ärztin informieren und dokumentieren (Dosis nicht selbst ändern).',
]
linien = [p for p in d.paragraphs if p.text.strip() and set(p.text.strip()) == {'_'}]
assert len(linien) == 1, [p.text[:20] for p in linien]
linie = linien[0]
for r in list(linie.runs):
    r._r.getparent().remove(r._r)
r = linie.add_run(b2[0])
r.font.color.rgb = ROT
anker = linie
for text in b2[1:]:
    neu = copy.deepcopy(linie._p)
    anker._p.addnext(neu)
    from docx.text.paragraph import Paragraph
    anker = Paragraph(neu, linie._parent)
    for rr in list(anker.runs):
        rr._r.getparent().remove(rr._r)
    rr = anker.add_run(text)
    rr.font.color.rgb = ROT
    if text.startswith('Ebenfalls'):
        rr.font.italic = True

# 5) Fußzeile: „· Lösung“
for s in d.sections:
    for p in s.footer.paragraphs:
        for r in p.runs:
            if r.text.startswith('KB I · Regelkreis & sicheres Handeln'):
                r.text = r.text.replace('Handeln · Seite', 'Handeln · Lösung · Seite')

# 6) Hinweise für die Lehrkraft (neue Seite)
umbruch = d.add_paragraph()
umbruch.add_run().add_break(WD_BREAK.PAGE)
h = d.add_paragraph()
hr = h.add_run('Hinweise für die Lehrkraft')
hr.font.bold = True
hr.font.size = Pt(13)
hr.font.color.rgb = PETROL

zeilen = [
    ('Aufgabe / Zeit', 'Bezug zur Klassenarbeit (KB 1, v4) und Begründung Papier/Smartphone'),
    ('A1 Handy · A2 Papier (≈ 15 Min.)',
     'Aufgabe 3 (Regelkreis in 5 Schritten; je fehlendem Fachbegriff 0,5 P. Abzug). Glykogen, Glykogenese und Glykogenolyse kamen auf den bisherigen AB nicht vor. '
     'A1 am Handy: Wortbausteine und Reihenfolge mit Sofort-Rückmeldung. A2 auf Papier, weil die Klausur das freie Aufschreiben mit allen Fachbegriffen verlangt. '
     'Außerdem Aufgabe 2 (Typ 1/Typ 2): A1 Teil 4 klärt, dass eine Insulintherapie nicht Typ 1 bedeutet und warum viele Menschen mit Typ 2 im Verlauf Insulin brauchen.'),
    ('Achtung: AB „So regelt Insulin den Blutzucker“',
     'Im Infotext steht vereinfacht: „… Diesen Prozess nennt man Glukoneogenese.“ Fachlich genau: Die Leber baut Glykogen ab (Glykogenolyse) und bildet neue Glukose (Glukoneogenese). '
     'Die App (A1, Teil 3) und der Merksatz A1 stellen das richtig. Empfehlung: den Satz im Unterricht kurz auf dem alten AB korrigieren lassen (1 Min.).'),
    ('B1 Handy · B2 Papier (≈ 15 Min.)',
     'Aufgabe 5b (Notfallmaßnahmen beschreiben und begründen) und Aufgabe 4 (STOPP ohne Mahlzeit). B1 klärt außerdem „Insulin reduzieren“ aus der Hypo-Mindmap: '
     'Die Dosis ändert nur die Ärztin/der Arzt. B2 auf Papier, weil die Begründungen („…, weil …“) bisher nur als Stichworte in der Mindmap standen. Die Fälle weichen bewusst vom Klausurfall ab.'),
    ('Nicht enthalten', 'Spätfolgen (Aufgabe 7) – bereits mit AB 01 (Gruppenpuzzle) und AB 02 (Körperlandkarte, Mythen) bearbeitet.'),
    ('Zeitpuffer', 'Das AB dauert ca. 30 Min. Restzeit: Fragen klären oder die Ich-kann-Liste gemeinsam durchgehen. Wer nicht fertig wird, beendet B1/B2 zu Hause.'),
    ('Material', 'Handys mit Kamera (sonst Tandems oder den Link abtippen). Die Übungen funktionieren nach dem ersten Laden auch bei schlechtem WLAN. '
     'Gespeichert wird nur für die Beamer-Anzeige (Vorname + Stand, bei Cloudflare, Löschung nach 6 Std.); wer „Ohne Anzeige weiter“ wählt, sendet nichts.'),
    ('Schutz gegen Durchklicken', 'Den Merksatz gibt es nur, wenn genug Aufgaben beim ersten Versuch richtig sind (A1: 11 von 17, B1: 7 von 10); sonst muss die Übung neu gestartet werden.'),
    ('Fortschritt am Beamer', 'klawittersven-arch.github.io/kb1-diabetes/fortschritt.html öffnen → „Neuen Raum starten“ → Raumcode zeigen. Die SuS geben in der Übung Vorname + Raumcode ein; '
     'angezeigt wird je Person „x von y gelöst“ für A1 und B1 (Haken = Merksatz erreicht, Warndreieck = zu viel geraten). „Namen verbergen“ zeigt nur „Person 1, 2 …“. '
     'Alles wird nach 6 Stunden automatisch gelöscht. Probeansicht: …/fortschritt.html?demo=1'),
    ('Texte ändern', 'Alle Texte der App stehen in docs/inhalte.js im Repository kb1-diabetes (auf GitHub mit dem Stift bearbeiten, „Commit changes“; nach 1–2 Min. online).'),
]
tab = d.add_table(rows=len(zeilen), cols=2)
tab.autofit = False
breiten = [Cm(4.8), Cm(12.6)]
for j, b in enumerate(breiten):
    tab.columns[j].width = b
layout = OxmlElement('w:tblLayout'); layout.set(qn('w:type'), 'fixed')
tblPr = tab._tbl.tblPr
rand = OxmlElement('w:tblBorders')
for seite in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
    e = OxmlElement('w:' + seite)
    e.set(qn('w:val'), 'single'); e.set(qn('w:sz'), '4'); e.set(qn('w:color'), '7F8C8D'); e.set(qn('w:space'), '0')
    rand.append(e)
tblPr.append(rand)
tblPr.append(layout)
for i, (a, b) in enumerate(zeilen):
    for j, text in enumerate((a, b)):
        zelle = tab.rows[i].cells[j]
        zelle.width = breiten[j]
        p = zelle.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(text)
        r.font.size = Pt(9.5)
        if i == 0 or a.startswith('Achtung'):
            r.font.bold = True if (i == 0 or j == 0) else False
        if i == 0:
            schatten = OxmlElement('w:shd')
            schatten.set(qn('w:val'), 'clear'); schatten.set(qn('w:color'), 'auto'); schatten.set(qn('w:fill'), 'EAF2F4')
            zelle._tc.get_or_add_tcPr().append(schatten)

d.core_properties.title = 'Regelkreis & sicheres Handeln – Lösung'
d.save(ZIEL)
print('gespeichert:', ZIEL)
