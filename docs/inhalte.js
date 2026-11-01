/* ==========================================================================
   INHALTE – KB I Diabetes mellitus: Regelkreis & sicheres Handeln (3BFP2)
   ==========================================================================

   In dieser Datei stehen ALLE Texte der beiden Übungen (regelkreis, sicher).
   Sie können die Texte hier ändern, ohne etwas vom Programm zu verstehen.

   So ändern Sie einen Text sicher:
   - Ändern Sie nur, was ZWISCHEN den einfachen Hochkommas ' … ' steht.
   - Die Hochkommas selbst, die Kommas am Zeilenende und die Klammern
     { } [ ] müssen stehen bleiben.
   - Deutsche Anführungszeichen „ … “ dürfen Sie im Text frei verwenden.
     Ein einfaches Hochkomma (') im Text müssen Sie als \' schreiben.
   - **Wort** wird fett gedruckt, \n beginnt eine neue Zeile.
   - Nach dem Speichern die Seite im Browser neu laden und kurz prüfen.

   Aufbau einer Karte:
     nummer      – die Nummer auf der Karte (fortlaufend über alle Teile)
     text        – Frage bzw. Aussage
     richtig     – Kürzel der richtigen Antwort, z. B. 'W'
     erklaerung  – erscheint nach der richtigen Antwort
     tipp        – erscheint nach einer falschen Antwort
                   (die richtige Lösung wird nie direkt verraten)
     antworten   – (nur wenn nötig) eigene Antwortknöpfe nur für diese Karte;
                   sonst gelten die Antworten des Teils

   Reihenfolge-Aufgabe (art: 'reihenfolge'):
     schritte    – in der RICHTIGEN Reihenfolge eintragen; das Programm mischt
                   sie für die Anzeige. tipp = Hinweis, wenn statt dieses
                   Schritts ein falscher angetippt wird.
   ========================================================================== */

var INHALTE = {

  /* ------------------------------------------------------------------------
     Texte, die auf allen Seiten gleich sind
     ------------------------------------------------------------------------ */
  allgemein: {
    kopfzeile: 'KB I – Diabetes mellitus · 3BFP2',
    merksatzUeberschrift: 'Ihr Merksatz',
    // erscheint gut sichtbar über dem Merksatz; {kurz} = A1 bzw. B1 (aus start.links)
    merksatzHinweis: 'Jetzt aufs Arbeitsblatt: Ergänzen Sie mit diesem Merksatz die Lücken im Kasten „Merksatz {kurz}“!',
    // {x} und {y} werden automatisch durch Zahlen ersetzt.
    fortschritt: '{x} von {y} gelöst',
    ersterVersuch: 'Beim ersten Versuch richtig: {x} von {y}',
    nochEinmal: 'Noch einmal üben',
    richtigText: 'Richtig!',
    falschText: 'Noch nicht richtig – versuchen Sie es noch einmal.',
    tippVorwort: 'Tipp:',
    infoHinweis: 'Tippen Sie auf eine Infokarte, um sie zu öffnen.',
    reiheGelegt: 'Ihre Reihenfolge:',
    reiheNochLeer: '(noch leer – tippen Sie unten den ersten Schritt an)',
    reiheAuswahl: 'Tippen Sie den nächsten Schritt an:',
    reiheFalsch: 'Das ist noch nicht der nächste Schritt.',
    reiheFertig: 'Richtig! Der Regelkreis ist vollständig.',
    // Erscheint statt des Merksatzes, wenn zu wenige Aufgaben beim ersten Versuch richtig waren.
    // {x} = beim ersten Versuch richtig, {y} = Anzahl, {z} = nötige Mindestzahl
    durchklickenTitel: 'Hey, nicht einfach durchklicken!',
    durchklickenText: 'Beim ersten Versuch richtig: {x} von {y} – nötig sind mindestens {z}. Lesen Sie jede Aufgabe genau und überlegen Sie, bevor Sie tippen. Dann erhalten Sie auch Ihren Merksatz.',
    durchklickenKnopf: 'Aufgabe neu starten'
  },

  /* ------------------------------------------------------------------------
     STARTSEITE (index.html)
     ------------------------------------------------------------------------ */
  start: {
    titel: 'Regelkreis & sicheres Handeln – Übungen',
    einleitung: 'Scannen Sie den QR-Code bei der Aufgabe auf Ihrem Arbeitsblatt – oder wählen Sie hier die Übung aus.',
    // kurz = Spaltenbeschriftung auf der Beamer-Seite (fortschritt.html)
    links: [
      { seite: 'regelkreis', kurz: 'A1', text: 'A1 · Wortbaustein-Detektiv' },
      { seite: 'sicher', kurz: 'B1', text: 'B1 · Sicher entscheiden' }
    ]
  },

  /* ------------------------------------------------------------------------
     FORTSCHRITT AM BEAMER – Anmeldung auf dem Handy (oben in jeder Übung)
     {name} und {raum} werden automatisch ersetzt.
     ------------------------------------------------------------------------ */
  melden: {
    titel: '📺 Fortschritt am Beamer',
    text: 'Geben Sie Ihren Vornamen und den Raumcode vom Beamer ein. Dann sieht Ihre Lehrkraft, wie weit Sie sind – nur „x von y gelöst“, keine einzelnen Antworten.',
    nameLabel: 'Vorname',
    raumLabel: 'Raumcode (4 Ziffern, steht am Beamer)',
    mitmachen: 'Mitmachen',
    ohne: 'Ohne Anzeige weiter',
    dochMitmachen: '📺 Beim Beamer-Fortschritt mitmachen',
    angemeldet: 'Angemeldet als {name} · Raum {raum}',
    aendern: 'ändern',
    gesendet: '✓ Stand übertragen',
    sendet: 'Stand wird übertragen …',
    offline: 'Gerade keine Verbindung – der Stand wird nachgereicht.',
    fehlerNameLaenge: 'Bitte geben Sie Ihren Vornamen ein (2 bis 20 Zeichen).',
    fehlerNameZeichen: 'Bitte nur Buchstaben, Ziffern, Leerzeichen und Bindestrich verwenden.',
    fehlerNameWort: 'Bitte wählen Sie einen anderen Namen.',
    fehlerRaum: 'Der Raumcode hat genau 4 Ziffern.',
    fehlerUnbekannt: 'Diesen Raumcode gibt es nicht (mehr). Bitte schauen Sie am Beamer nach.',
    fehlerVoll: 'Der Raum ist voll. Bitte sagen Sie Ihrer Lehrkraft Bescheid.',
    fehlerEntfernt: 'Ihr Eintrag wurde von der Lehrkraft entfernt. Sie können sich neu anmelden.'
  },

  /* ------------------------------------------------------------------------
     FORTSCHRITT AM BEAMER – Seite für die Lehrkraft (fortschritt.html)
     ------------------------------------------------------------------------ */
  beamer: {
    titel: 'Fortschritt · Regelkreis & sicheres Handeln',
    startTitel: 'Fortschritt am Beamer',
    startText: 'Starten Sie einen Raum und zeigen Sie den Raumcode. Die Schülerinnen und Schüler geben in der Übung ihren Vornamen und den Code ein. Angezeigt wird nur „x von y gelöst“ je Übung – keine einzelnen Antworten. Nach 6 Stunden wird alles automatisch gelöscht.',
    starten: 'Neuen Raum starten',
    nichtEingerichtet: 'Die Fortschrittsanzeige ist noch nicht eingerichtet: In docs/config.js fehlt FORTSCHRITT_URL. Siehe README, Abschnitt „Fortschritt am Beamer“.',
    startFehler: 'Der Raum konnte nicht gestartet werden. Bitte prüfen Sie die Internetverbindung und versuchen Sie es noch einmal.',
    raumcode: 'Raumcode',
    raumHinweis: 'In der Übung: Vorname + Raumcode',
    warten: 'Warten auf die ersten Anmeldungen …',
    angemeldet: '{n} angemeldet',
    fertigZahl: '{kurz} fertig: {x}',
    legendeFertig: '✓ Merksatz erreicht',
    legendeDurch: '⚠ zu viel geraten',
    aktualisiert: 'aktualisiert {uhr} Uhr',
    getrennt: 'keine Verbindung – neuer Versuch läuft …',
    namenVerbergen: 'Namen verbergen',
    namenZeigen: 'Namen zeigen',
    person: 'Person {n}',
    vollbild: 'Vollbild',
    vollbildAus: 'Vollbild beenden',
    leeren: 'Liste leeren',
    leerenFrage: 'Alle Einträge entfernen? Handys, die weiterarbeiten, erscheinen beim nächsten gelösten Schritt wieder.',
    neuerRaum: 'Neuer Raum',
    neuerRaumFrage: 'Neuen Raum starten? Alle müssen dann den neuen Code eingeben.',
    entfernenFrage: '„{name}“ entfernen? Das Handy kann sich danach neu anmelden.',
    entfernen: 'Entfernen',
    abbrechen: 'Abbrechen',
    ja: 'Ja',
    abgelaufen: 'Der Raum ist abgelaufen. Bitte starten Sie einen neuen Raum.',
    demo: 'Probeansicht mit erfundenen Namen',

    // Anweisungen für die Klasse: Für jeden Eintrag gibt es unten einen Knopf.
    // Ein Klick blendet den Text groß über den Karten ein, noch ein Klick blendet ihn aus.
    // knopf = Beschriftung des Knopfs, text = was die Klasse am Beamer sieht.
    anweisungen: [
      { knopf: 'Anweisung A1 + A2', text: 'Bearbeiten Sie jetzt die Aufgaben A1 und A2!' },
      { knopf: 'Anweisung B1 + B2', text: 'Bearbeiten Sie jetzt die Aufgaben B1 und B2!' }
    ],
    anweisungTipp: 'Anweisung groß einblenden – noch einmal klicken blendet sie wieder aus'
  },

  /* ------------------------------------------------------------------------
     A1 – WORTBAUSTEIN-DETEKTIV (Seite regelkreis.html)
     ------------------------------------------------------------------------ */
  regelkreis: {
    titel: 'A1 · Wortbaustein-Detektiv',
    anweisung: 'Knacken Sie die Fachbegriffe des Blutzucker-Regelkreises. Der Detektiv-Schlüssel hilft Ihnen.',

    infokarten: [
      {
        titel: '🔍 Detektiv-Schlüssel (aus dem Griechischen)',
        offen: true,
        text: 'Fachbegriffe sind aus Bausteinen zusammengesetzt:',
        punkte: [
          '**glyk-** / **gluk-** = süß, Zucker',
          '**Glykogen** = Speicherform der Glukose (vor allem in Leber und Muskeln)',
          '**Genese** = Entstehung, Bildung',
          '**Lyse** = Lösung, Auflösung',
          '**neo-** = neu'
        ]
      }
    ],

    mindestensErsterVersuch: 11,

    abschnitte: [
      {
        ueberschrift: 'Teil 1 · Wortbausteine',
        anweisung: 'Was bedeuten die Bausteine?',
        antworten: [
          { kuerzel: 'A', text: 'aufbauen / bilden' },
          { kuerzel: 'B', text: 'abbauen / auflösen' },
          { kuerzel: 'N', text: 'neu' },
          { kuerzel: 'S', text: 'Speicherform der Glukose' }
        ],
        karten: [
          {
            nummer: 1,
            text: '„Glykogen“ ist die …',
            richtig: 'S',
            erklaerung: 'Glykogen ist die Speicherform der Glukose – vor allem in Leber und Muskeln.',
            tipp: 'Schauen Sie in den Detektiv-Schlüssel oben.'
          },
          {
            nummer: 2,
            text: 'Die Endung „-genese“ bedeutet …',
            richtig: 'A',
            erklaerung: 'Genese = Entstehung, Bildung: Etwas wird aufgebaut.',
            tipp: 'Genese = Entstehung. Entsteht hier etwas oder verschwindet etwas?'
          },
          {
            nummer: 3,
            text: 'Die Endung „-lyse“ bedeutet …',
            richtig: 'B',
            erklaerung: 'Lyse = Auflösung: Etwas wird abgebaut.',
            tipp: 'Lyse = Lösung, Auflösung. Schauen Sie in den Detektiv-Schlüssel.'
          },
          {
            nummer: 4,
            text: 'Die Vorsilbe „neo-“ bedeutet …',
            richtig: 'N',
            erklaerung: 'neo = neu (wie in „Neoprenanzug“ – ein neu entwickelter Kunststoff).',
            tipp: 'Schauen Sie in den Detektiv-Schlüssel oben.'
          }
        ]
      },
      {
        ueberschrift: 'Teil 2 · Welcher Vorgang ist gemeint?',
        anweisung: 'Alle drei Vorgänge finden vor allem in der Leber statt.',
        antworten: [
          { kuerzel: 'GG', text: 'Glykogenese' },
          { kuerzel: 'GL', text: 'Glykogenolyse' },
          { kuerzel: 'GN', text: 'Glukoneogenese' }
        ],
        karten: [
          {
            nummer: 5,
            text: 'Nach dem Essen baut die Leber aus Glukose ihren Speicher auf.',
            richtig: 'GG',
            erklaerung: 'Glykogen + Genese = Glykogen aufbauen. Insulin fördert die Glykogenese → der Blutzucker sinkt.',
            tipp: 'Wird hier etwas auf- oder abgebaut? Und was?'
          },
          {
            nummer: 6,
            text: 'Der Blutzucker sinkt. Die Leber baut ihren Speicher ab und gibt Glukose ins Blut.',
            richtig: 'GL',
            erklaerung: 'Glykogen + Lyse = Glykogen abbauen. Glukagon fördert die Glykogenolyse → der Blutzucker steigt.',
            tipp: 'Der Speicher wird abgebaut. Welcher Baustein bedeutet „abbauen“?'
          },
          {
            nummer: 7,
            text: 'Die Leber bildet neue Glukose aus Bausteinen, die keine Kohlenhydrate sind (z. B. aus Eiweißbausteinen).',
            richtig: 'GN',
            erklaerung: 'Gluko + neo + Genese = Glukose neu bilden. Glukagon, Adrenalin und Kortisol fördern die Glukoneogenese.',
            tipp: 'Hier entsteht etwas NEU. Welcher Begriff enthält „neo“?'
          },
          {
            nummer: 8,
            text: 'Welchen Vorgang fördert Insulin?',
            richtig: 'GG',
            erklaerung: 'Insulin senkt den Blutzucker: Die Leber speichert Glukose als Glykogen (Glykogenese).',
            tipp: 'Insulin senkt den Blutzucker. Welcher Vorgang nimmt Glukose aus dem Blut und speichert sie?'
          },
          {
            nummer: 9,
            text: 'Der Blutzucker sinkt. Welcher Vorgang liefert am schnellsten Glukose ins Blut?',
            richtig: 'GL',
            erklaerung: 'Der Glykogenspeicher ist sofort verfügbar. Die Glukoneogenese (Neubildung) dauert länger.',
            tipp: 'Was geht schneller: einen vorhandenen Speicher leeren oder Glukose ganz neu herstellen?'
          }
        ]
      },
      {
        ueberschrift: 'Teil 3 · Genau formulieren',
        anweisung: 'Hier kommt es auf die genaue Formulierung an.',
        karten: [
          {
            nummer: 10,
            text: 'Vereinfacht hieß es bisher: „Glukagon, Adrenalin und Kortisol erhöhen den Blutzucker. Diesen Prozess nennt man Glukoneogenese.“ Welche Formulierung ist fachlich genau?',
            antworten: [
              { kuerzel: 'X', text: 'Der Blutzucker steigt nur durch Glukoneogenese.' },
              { kuerzel: 'Y', text: 'Die Leber baut Glykogen ab (Glykogenolyse) und bildet zusätzlich neue Glukose (Glukoneogenese).' }
            ],
            richtig: 'Y',
            erklaerung: 'Genau! Schreiben Sie in Schritt 5 des Regelkreises beide Fachbegriffe: Glykogenolyse UND Glukoneogenese.',
            tipp: 'Ist der Abbau des Glykogenspeichers auch eine Neubildung? Schauen Sie auf die Wortbausteine.'
          }
        ]
      },
      {
        ueberschrift: 'Teil 4 · Typ 1 oder Typ 2?',
        anweisung: 'Was entscheidet über den Diabetestyp – die Ursache oder die Behandlung?',
        karten: [
          {
            nummer: 11,
            text: 'Frau Schneider hat seit 13 Jahren Diabetes mellitus Typ 2 und spritzt inzwischen Insulin. Ihre Tochter fragt: „Dann hat Mama jetzt also Typ 1?“ Was stimmt?',
            antworten: [
              { kuerzel: 'J', text: 'Ja – wer Insulin spritzt, hat Typ 1.' },
              { kuerzel: 'N', text: 'Nein – sie hat weiter Typ 2. Der Typ hängt von der Ursache ab, nicht von der Behandlung.' }
            ],
            richtig: 'N',
            erklaerung: 'Typ 1: Eine Autoimmunreaktion zerstört die β-Zellen → absoluter Insulinmangel. Typ 2: Die Zellen reagieren vermindert auf Insulin (Insulinresistenz); im Verlauf bildet der Körper oft immer weniger Insulin. Deshalb brauchen auch viele Menschen mit Typ 2 irgendwann Insulin – der Typ bleibt.',
            tipp: 'Wodurch entsteht Typ 1? Ändert eine Insulinspritze etwas an dieser Ursache?'
          },
          {
            nummer: 12,
            text: 'Warum brauchen viele Menschen mit Typ-2-Diabetes im Lauf der Jahre Insulin?',
            antworten: [
              { kuerzel: 'U', text: 'Weil sich ihr Diabetes in Typ 1 umwandelt.' },
              { kuerzel: 'W', text: 'Weil der Körper im Verlauf immer weniger eigenes Insulin bildet.' },
              { kuerzel: 'H', text: 'Weil Insulin die Insulinresistenz heilt.' }
            ],
            richtig: 'W',
            erklaerung: 'Bei Typ 2 lässt die Insulinbildung der β-Zellen im Verlauf nach – bis hin zum absoluten Insulinmangel. Der Diabetes bleibt trotzdem Typ 2.',
            tipp: 'Denken Sie an das AB „Vergleichen und Zusammenhänge erklären“: Was passiert bei Typ 2 im Verlauf mit der Insulinbildung?'
          }
        ]
      },
      {
        art: 'reihenfolge',
        ueberschrift: 'Teil 5 · Der Regelkreis in 5 Schritten',
        anweisung: 'Tippen Sie die Schritte in der richtigen Reihenfolge an – von der Mahlzeit bis zum erneuten Anstieg des Blutzuckers.',
        schritte: [
          { text: 'Kohlenhydratreiche Mahlzeit: Blutzucker ↑', tipp: 'Womit beginnt der Regelkreis?' },
          { text: 'β-Zellen: Insulin ↑', tipp: 'Der Blutzucker ist gestiegen. Welche Zellen der Bauchspeicheldrüse reagieren jetzt?' },
          { text: 'Muskeln nehmen Glukose auf, Leber: Glykogenese → Blutzucker ↓', tipp: 'Insulin wurde ausgeschüttet. Was bewirkt es an Muskeln und Leber?' },
          { text: 'β-Zellen: Insulin ↓ · α-Zellen: Glukagon ↑', tipp: 'Der Blutzucker ist gesunken. Welches Hormon steigt jetzt – und aus welchen Zellen?' },
          { text: 'Leber: Glykogenolyse + Glukoneogenese → Blutzucker ↑', tipp: 'Glukagon wirkt an der Leber. Was passiert dort?' }
        ],
        erklaerung: 'Diese fünf Schritte schreiben Sie gleich in A2 in ganzen Sätzen auf – mit allen Fachbegriffen.'
      }
    ],

    // fett = die Wörter, die auf dem Arbeitsblatt in die Lücken gehören
    merksatz: 'Glykogenese = **Glykogen aufbauen** (durch **Insulin**).\nGlykogenolyse = **Glykogen abbauen** (durch **Glukagon**).\nGlukoneogenese = **Glukose neu bilden**.'
  },

  /* ------------------------------------------------------------------------
     B1 – SICHER ENTSCHEIDEN (Seite sicher.html)
     ------------------------------------------------------------------------ */
  sicher: {
    titel: 'B1 · Sicher entscheiden',
    anweisung: 'Zwei Situationen, die in der Praxis schnell gefährlich werden: eine Unterzuckerung und eine Insulingabe ohne Mahlzeit.',

    mindestensErsterVersuch: 7,

    abschnitte: [
      {
        ueberschrift: 'Teil 1 · Hypoglykämie: Was tun – und warum?',
        anweisung: 'Bei einer Patientin wird eine Hypoglykämie festgestellt (BZ 60 mg/dl). Sie ist wach und kann schlucken. Wählen Sie zu jeder Maßnahme die passende Begründung.',
        antworten: [
          { kuerzel: 'S', text: '… weil sie sehr schnell ins Blut gelangen.' },
          { kuerzel: 'B', text: '… weil Bewegung zusätzlich Glukose verbraucht (und Sturzgefahr besteht).' },
          { kuerzel: 'K', text: '… weil ich prüfen muss, ob der Blutzucker wieder steigt.' },
          { kuerzel: 'L', text: '… weil das Insulin weiterwirkt und der Blutzucker sonst wieder fällt.' }
        ],
        karten: [
          {
            nummer: 1,
            text: 'Sofort schnell wirksame Kohlenhydrate geben (z. B. Traubenzucker, Saft) …',
            richtig: 'S',
            erklaerung: 'Traubenzucker oder Saft heben den Blutzucker innerhalb weniger Minuten.',
            tipp: 'Warum gerade Traubenzucker – und nicht Vollkornbrot?'
          },
          {
            nummer: 2,
            text: 'Aktivität sofort beenden, hinsetzen lassen, nicht allein lassen …',
            richtig: 'B',
            erklaerung: 'Jede Bewegung verbraucht weiter Glukose. Zittern und Schwäche erhöhen die Sturzgefahr.',
            tipp: 'Was verbraucht Glukose? Denken Sie an den Film „Es war einmal … das Leben“.'
          },
          {
            nummer: 3,
            text: 'Nach 15–30 Minuten den Blutzucker erneut messen …',
            richtig: 'K',
            erklaerung: 'Die Kontrolle zeigt, ob die Kohlenhydrate gewirkt haben. Ist der Wert noch zu niedrig: erneut schnelle Kohlenhydrate.',
            tipp: 'Woher wissen Sie, ob Ihre erste Maßnahme gewirkt hat?'
          },
          {
            nummer: 4,
            text: 'Danach langsam wirksame Kohlenhydrate geben (z. B. Brot) …',
            richtig: 'L',
            erklaerung: 'Das gespritzte Insulin wirkt noch Stunden. Langsame Kohlenhydrate verhindern einen erneuten Abfall.',
            tipp: 'Wie lange wirkt ein gespritztes Insulin noch?'
          }
        ]
      },
      {
        ueberschrift: 'Teil 2 · Kurz nachgedacht',
        anweisung: 'Zwei Fragen zur Sicherheit.',
        karten: [
          {
            nummer: 5,
            text: 'Wann darf ich Traubenzucker in den Mund geben?',
            antworten: [
              { kuerzel: 'J', text: 'nur, wenn die Person wach ist und schlucken kann' },
              { kuerzel: 'I', text: 'immer – auch bei Bewusstlosigkeit' }
            ],
            richtig: 'J',
            erklaerung: 'Bei Bewusstlosigkeit nichts in den Mund (Erstickungsgefahr): Notruf, stabile Seitenlage, ärztliche Hilfe.',
            tipp: 'Was passiert, wenn jemand nicht schlucken kann?'
          },
          {
            nummer: 6,
            text: '„Insulin reduzieren“ – darf ich als Pflegekraft die nächste Insulindosis nach einer Unterzuckerung selbst verringern?',
            antworten: [
              { kuerzel: 'J', text: 'ja, das ist meine Aufgabe' },
              { kuerzel: 'N', text: 'nein – das entscheidet die Ärztin / der Arzt' }
            ],
            richtig: 'N',
            erklaerung: 'Die Dosis ändert nur die Ärztin oder der Arzt. Ich informiere die Pflegefachkraft bzw. den ärztlichen Dienst, dokumentiere und lasse die Dosis überprüfen.',
            tipp: 'Wer ordnet Insulin und seine Dosis an? (STOPP-Punkt 2)'
          }
        ]
      },
      {
        ueberschrift: 'Teil 3 · STOPP: Und wenn keine Mahlzeit kommt?',
        anweisung: 'Entscheiden Sie mit der STOPP-Checkliste – vor allem Punkt 7 (Mahlzeit) und Punkt 8 (Besonderheiten des Präparats).',
        antworten: [
          { kuerzel: 'G', text: 'Gabe wie geplant' },
          { kuerzel: 'R', text: 'nicht wie geplant – Rücksprache' }
        ],
        karten: [
          {
            nummer: 7,
            text: 'Herrn Meier ist seit gestern übel, er kann nicht frühstücken. Angeordnet: Mischinsulin 30/70 vor dem Frühstück.',
            richtig: 'R',
            erklaerung: 'Mischinsulin enthält einen kurz wirksamen Anteil mit Mahlzeitenbezug. Ohne Frühstück droht eine Hypoglykämie (STOPP 7 + 8). Rücksprache mit der Ärztin, BZ engmaschig kontrollieren.',
            tipp: 'Mischinsulin 30/70 – welcher Anteil braucht eine Mahlzeit?'
          },
          {
            nummer: 8,
            text: 'Frau Kühn muss vor einer Untersuchung nüchtern bleiben. Angeordnet: Normalinsulin zum Frühstück.',
            richtig: 'R',
            erklaerung: 'Normalinsulin deckt den Bedarf zur Mahlzeit (Spritz-Ess-Abstand 20–30 Min.). Ohne Mahlzeit droht eine Hypoglykämie. Nicht eigenmächtig weglassen oder verschieben – Rücksprache mit dem ärztlichen Dienst.',
            tipp: 'Wofür ist Normalinsulin da? Denken Sie an das AB „Die Wirkprofile der Insulinarten“.'
          },
          {
            nummer: 9,
            text: 'Herr Meier hat zum Abendessen kaum etwas gegessen. Angeordnet: langwirksames Basalinsulin zur Nacht. BZ: 142 mg/dl.',
            richtig: 'G',
            erklaerung: 'Basalinsulin deckt den Grundbedarf – unabhängig von den Mahlzeiten. Wenig Essen allein ist kein Grund, es wegzulassen. Bei Unsicherheit trotzdem Rücksprache halten.',
            tipp: 'Basal oder Bolus? Wofür ist Basalinsulin da?'
          },
          {
            nummer: 10,
            text: 'Eine Insulingabe ist nicht wie geplant möglich. Was tun Sie?',
            antworten: [
              { kuerzel: 'D', text: 'die Dosis selbst anpassen' },
              { kuerzel: 'W', text: 'das Insulin einfach weglassen' },
              { kuerzel: 'K', text: 'Rücksprache halten, BZ kontrollieren, dokumentieren' }
            ],
            richtig: 'K',
            erklaerung: 'Nie eigenmächtig: Pflegefachkraft bzw. Ärztin informieren, Anordnung klären, Blutzucker engmaschig kontrollieren und alles dokumentieren.',
            tipp: 'Wer darf eine ärztliche Anordnung ändern?'
          }
        ]
      }
    ],

    // fett = die Wörter, die auf dem Arbeitsblatt in die Lücken gehören
    merksatz: 'Hypoglykämie: schnelle **KH** → Aktivität **stoppen** → nach 15–30 Min. **nachmessen** → langsame KH.\nKeine Mahlzeit: mahlzeitenbezogenes Insulin **nicht** wie geplant; Basalinsulin deckt den **Grundbedarf**. Nie selbst ändern – **Rücksprache**!'
  }
};
