
# MMM-Stundenplan


Ein einfaches Stundenplan-Modul für MagicMirror. Konfiguration ausschließlich über `config.js`. Unterstützt iCal-Ferienkalender, mehrere Kinder, Farben, Zeiten und Räume.

Wichtig: Für die iCal-Integration wird das Node-Package `ical` benötigt (npm install ical im Modulordner).


## Kurzanleitung (Deutsch)

1. Ordne den Ordner `MMM-Stundenplan` in `~/MagicMirror/modules/` ein.
2. Installiere optionale Node-Abhängigkeiten (für iCal-Fetch):

```bash
cd ~/MagicMirror/modules/MMM-Stundenplan
npm install ical
```

3. Füge in deiner `config/config.js` folgenden Beispiel-Block in `modules: [...]` ein (siehe Datei `config-sample.js` weiter unten).
4. Starte MagicMirror neu.

---

## Was das Modul kann

- Mehrere Kinder/Profiles speichern (Name, Farbe, Stundenplan)
- Anzeige konfigurierbarer Anzahl an Tagen (z. B. 3, 5, 7)
- Öffentlichen iCal-Kalender (z. B. Ferienkalender) einbinden — während eines Ferien-Datums wird für den Tag nur "FERIEN" angezeigt
- Pro Unterrichtseintrag lassen sich Zeit und Raum angeben
- Pro Kind eigene Anzeige-Farbe (Hintergrund/Accent)
- Vollständig konfigurierbar über `config.js`

---

## Dateien in diesem Dokument

- `MMM-Stundenplan.js` — Hauptmodul (Front-end)
- `node_helper.js` — Node-Helper zum Laden und Parsen von iCal (Ferien)
- `MMM-Stundenplan.css` — Styles
- `config-sample.js` — Beispiel, wie die `config.js` aussehen sollte
- `README.md` — kurze Hinweise

---

## Beispiel-Konfiguration für config/config.js 
```
{
      module: "MMM-Stundenplan",
      position: "top_right",
      config: {
        daysToShow: 1,
        ferienCalendarUrl: "https://www.schulferien.org/iCal/Ferien/icals/Ferien_Bayern_2025.ics",
        kinder: [
        {
        name: "Marie",
        color: "#ff6666",
        bgcolor: "#ff666647",
        plan: {
        Montag: [
          { zeit: "07:50", fach: "Englisch", raum: "" },
          { zeit: "08:35", fach: "Englisch", raum: "" },
          { zeit: "09:35", fach: "Geo", raum: "" },
          { zeit: "10:20", fach: "Deutsch", raum: "" },
          { zeit: "11:20", fach: "NuT", raum: "146"},
          { zeit: "12:05", fach: "Musik", raum: "009" }
        ],
        Dienstag: [
          { zeit: "07:50", fach: "Englisch", raum: "" },
          { zeit: "08:35", fach: "Englisch", raum: "" },
          { zeit: "09:35", fach: "Sport", raum: "" }
        ],
        Mittwoch: [
          { zeit: "07:50", fach: "Deutsch", raum: "" },
          { zeit: "08:35", fach: "Deutsch", raum: "" },
          { zeit: "09:35", fach: "Sport", raum: "" }
        ],
        Donnerstag: [
          { zeit: "07:50", fach: "Deutsch", raum: "" },
          { zeit: "08:35", fach: "Reli", raum: "003" },
          { zeit: "09:35", fach: "Mathe", raum: "" },
          { zeit: "10:20", fach: "Deutsch", raum: "" }
        ],
        Freitag: [
          { zeit: "07:50", fach: "Mathe", raum: "" },
          { zeit: "08:35", fach: "Musik", raum: "" },
          { zeit: "09:35", fach: "Deutsch", raum: "" },
          { zeit: "10:20", fach: "Reli", raum: "003" },
          { zeit: "11:20", fach: "Kunst", raum: "208"},
          { zeit: "12:05", fach: "Kunst", raum: "208" }
        ]
        }
        },
        {
        name: "Daniel",
        color: "#66ccff",
        bgcolor: "#66ccff47",
        plan: {
          Montag: [
          { zeit: "07:50", fach: "Deutsch", raum: "" },
          { zeit: "08:35", fach: "Deutsch", raum: "" },
          { zeit: "09:35", fach: "Kunst", raum: "" },
          { zeit: "10:20", fach: "Mathe", raum: "" },
          { zeit: "11:20", fach: "Englisch", raum: ""},
          { zeit: "12:05", fach: "Englisch", raum: "" },
          { zeit: "13:35", fach: "Musik", raum: "009" }
          ],
          Dienstag: [
            { zeit: "07:50", fach: "Bio", raum: "144" },
            { zeit: "08:35", fach: "Physik", raum: "019" },
            { zeit: "09:35", fach: "Englisch", raum: "" },
            { zeit: "10:20", fach: "Französisch", raum: "" },
            { zeit: "11:20", fach: "PhÜ8/ChÜ", raum: "023/137"},
            { zeit: "12:05", fach: "PhÜ8/ChÜ", raum: "023/137" }
          ],
          Mittwoch: [
            { zeit: "07:50", fach: "Reli", raum: "" },
            { zeit: "08:35", fach: "Französisch", raum: "" },
            { zeit: "09:35", fach: "Bio", raum: "142" },
            { zeit: "10:20", fach: "Mathe", raum: "" },
            { zeit: "11:20", fach: "Geschichte", raum: ""},
            { zeit: "12:05", fach: "Chemie", raum: "144" }
          ],
          Donnerstag: [
            { zeit: "07:50", fach: "Sport", raum: "" },
            { zeit: "08:35", fach: "Sport", raum: "" },
            { zeit: "09:35", fach: "Chemie", raum: "141" },
            { zeit: "10:20", fach: "Geschichte", raum: "" },
            { zeit: "11:20", fach: "Englisch", raum: ""},
            { zeit: "12:05", fach: "Mathe", raum: "" }
          ],
          Freitag: [
            { zeit: "07:50", fach: "Mathe", raum: "" },
            { zeit: "08:35", fach: "Reli", raum: "" },
            { zeit: "09:35", fach: "Deutsch", raum: "" },
            { zeit: "10:20", fach: "Deutsch", raum: "" },
            { zeit: "11:20", fach: "Französisch", raum: ""},
            { zeit: "12:05", fach: "Französisch", raum: "" }
          ]
        }
        }
      ]     
      }
    },  
```
