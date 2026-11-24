# Anleitung für die Redaktion

Diese Anleitung ist für alle, die Inhalte auf der Webseite ändern: Termine, Line-up, Fotos, News, Texte. Du brauchst **keine Technik-Kenntnisse**.

**So läuft es ab:**

1. Du änderst etwas im **CMS** (der Redaktionsoberfläche im Browser) und speicherst.
2. Nach **1–3 Minuten** siehst du die Änderung in der **Vorschau**.
3. Passt alles, gibst du **einem Admin Bescheid**. Der Admin **veröffentlicht** die Änderung auf der echten Seite.

> **Wichtig:** Speichern im CMS verändert **nie direkt** die echte Seite. Du kannst also nichts kaputt machen, was Besucher:innen sehen. Im schlimmsten Fall ist die Vorschau kurz falsch, und ein Admin repariert das.

---

## Inhalt

1. [Einmalig: GitHub-Konto anlegen und Einladung annehmen](#1-einmalig-github-konto-anlegen-und-einladung-annehmen)
2. [Im CMS anmelden](#2-im-cms-anmelden)
3. [Das CMS in 2 Minuten](#3-das-cms-in-2-minuten)
4. [Rezepte für typische Aufgaben](#4-rezepte-für-typische-aufgaben)
5. [Vorschau ansehen](#5-vorschau-ansehen)
6. [Veröffentlichen](#6-veröffentlichen)
7. [Wenn etwas schiefgeht](#7-wenn-etwas-schiefgeht)

---

## 1. Einmalig: GitHub-Konto anlegen und Einladung annehmen

Die Webseite liegt bei **GitHub**, einem Dienst zum Speichern von Dateien mit Versionsgeschichte. Damit du im CMS speichern darfst, brauchst du ein (kostenloses) GitHub-Konto.

1. Geh auf <https://github.com/signup> und leg ein Konto an. Nimm am besten eine E-Mail-Adresse, die du regelmäßig liest.
2. **Zwei-Faktor-Anmeldung einschalten** (Pflicht in unserer Organisation): Klick oben rechts auf dein Profilbild → **Settings** → **Password and authentication** → **Enable two-factor authentication**. Am einfachsten geht es mit einer Authenticator-App auf dem Handy (z. B. die App deines Passwort-Managers, Google Authenticator oder Microsoft Authenticator). Bewahr die **Recovery Codes** gut auf.
3. Schick einem Admin deinen **GitHub-Benutzernamen** (nicht dein Passwort!).
4. Du bekommst eine E-Mail „You've been invited to join the FruchtFolgeFestival organization“. Klick auf **Join FruchtFolgeFestival**.

`[Screenshot: Einladungs-Mail von GitHub mit dem Knopf "Join FruchtFolgeFestival"]`

## 2. Im CMS anmelden

1. Öffne **<https://fruchtfolge.live/admin>**.
   *(Solange die Domain noch nicht umgezogen ist: <https://fruchtfolge.technik-7e1.workers.dev/admin>. Das CMS funktioniert auch unter <https://dev-fruchtfolge.technik-7e1.workers.dev/admin>. Es ist überall dasselbe CMS und speichert immer in die Vorschau.)*
2. Klick auf **„Mit GitHub anmelden“**.
3. Beim allerersten Mal fragt GitHub, ob die App „Sveltia CMS Auth“ auf dein Konto zugreifen darf. Klick auf **Authorize**.
4. Fertig. Die Anmeldung hält mehrere Monate. Danach meldest du dich einfach neu an.

`[Screenshot: Anmeldeseite "Fruchtfolge · Redaktion" mit dem Knopf "Mit GitHub anmelden"]`

> Die Oberfläche ist automatisch auf Deutsch, wenn dein Browser auf Deutsch eingestellt ist. Du kannst die Sprache auch im CMS über dein Profilbild → **Einstellungen** ändern.

## 3. Das CMS in 2 Minuten

Links siehst du die **Bereiche**:

| Bereich | Was du dort änderst |
|---|---|
| **Einstellungen** | Text und Foto oben auf der Startseite, Ticket-Status und -Link, Anfahrt, Kontaktdaten, Social Media, welcher Jahrgang „aktuell“ ist |
| **Festival-Jahrgänge** | Ein Eintrag pro Jahr: Datum, Line-up und Timetable, Fotos, Unterstützer, Aftermovie |
| **Neuigkeiten** | News-Beiträge |
| **Festival-ABC** | Die Fragen und Antworten von A bis Z |
| **Presse** | Zeitungsartikel über das Festival |
| **Sponsoring** | Die Sponsoring-Pakete und das PDF |
| **Seiten** | Texte von Über uns, Kontakt, Mitmachen und die Einleitungen von ABC, Sponsoring, Galerie und Archiv |
| **Rechtliches** | Impressum, AGB, Satzung, Datenschutz. **Nur nach Absprache mit dem Vorstand ändern!** |

**Speichern:** Knopf **„Speichern“** oben rechts oder `Strg + S` (Mac: `⌘ + S`).

**Was gerade noch fehlt**, steht als Aufgabenliste in **[cms-aufgaben.md](cms-aufgaben.md)**.

**Pflichtfelder** sind markiert. Unter vielen Feldern steht ein grauer **Hinweis**, was hineingehört.

`[Screenshot: CMS-Übersicht mit den Bereichen links]`

## 4. Rezepte für typische Aufgaben

### Line-up eintragen

1. **Festival-Jahrgänge** → den Jahrgang öffnen (z. B. „Fruchtfolge Festival 2027“).
2. Runterscrollen zu **„Line-up und Timetable“** → **„Eintrag hinzufügen“**.
3. Ausfüllen:
   - **Name** (Pflicht)
   - **Art**: „Act“ für Bands, DJs und Künstler:innen. „Programmpunkt“ für Einlass, Campingplatz-Öffnung usw. (erscheint nur im Timetable)
   - **Herkunft**: ein oder mehrere Länder aus der Liste
   - **Genre**, **Kurzbeschreibung**
   - **Bild** mit **Bildbeschreibung** und **Foto von**. Nur Acts mit Bild bekommen eine große Karte, alle anderen stehen darunter als Liste.
   - **Links** (Spotify, YouTube, Website …)
   - **Tag**, **Beginn**, **Ende**: Sobald Tag und Beginn eingetragen sind, erscheint der Act im Timetable. Solange die Spielzeiten noch nicht feststehen, einfach leer lassen.
4. **Reihenfolge:** Die Einträge lassen sich mit den Pfeilen bzw. per Ziehen sortieren. **Die Reihenfolge der Liste ist die Reihenfolge im Line-up**, also Headliner nach oben. Der Timetable sortiert sich von selbst nach Tag und Uhrzeit.
5. **Speichern.**

### Termin, Ticket-Status und Ticket-Link ändern

- **Datum des Festivals:** Festival-Jahrgänge → Jahrgang öffnen → **Erster Tag** / **Letzter Tag**. Das Datum erscheint automatisch auf dem Sticker der Startseite.
- **Tickets:** **Einstellungen** → **Allgemeine Einstellungen** → **Tickets**:
  - **Ticket-Status** auf „Jetzt erhältlich“ stellen
  - **Ticket-Link** eintragen (z. B. von Eventfrog, beginnt mit `https://`)
  - Dann erscheint auf der Startseite der Knopf **„Tickets kaufen“**.
- **Text oben auf der Startseite:** **Einstellungen** → **Startbereich der Startseite** (Überzeile, Überschrift, Text, Hintergrundfoto).
  - Die **Überzeile** ist die kleine farbige Zeile über der Überschrift (z. B. „Fruchtfolge Festival · Lindach bei Fürstenfeldbruck“). Text ändern oder das Feld leeren, dann gibt es keine Zeile.
- **Lade-Logo:** **Einstellungen** → **„Lade-Logo beim Ankommen zeigen“**. Aus = die Seite erscheint ohne Animation. In der Vorschau zeigt der Knopf **„Lade-Logo zeigen“** in der Design-Werkstatt es jederzeit noch einmal.

### Eintrag im Festival-ABC hinzufügen oder ändern

1. **Festival-ABC** → **Festival-ABC (Einträge)**.
2. **„Eintrag hinzufügen“**. Bei **Begriff** nur das Wort eintragen, z. B. `Regenschirm`. „R wie …“ und die alphabetische Sortierung macht die Seite selbst.
3. Bei **Text** die Antwort schreiben. **Fett**, Listen und Links gehen über die Werkzeugleiste.
4. **Speichern.**

### Bild hochladen

- **Wo:** in jedem Bildfeld auf **„Auswählen“** bzw. **„Hochladen“** klicken.
- **Größe:** Große Fotos werden beim Hochladen **automatisch verkleinert** (max. 2500 Pixel) und in ein platzsparendes Format umgewandelt. Riesige Originale (über 20 MB) bitte vorher verkleinern.
- **Bildbeschreibung (Alt-Text):** Immer ausfüllen. Beschreib in einem Satz, was zu sehen ist, z. B. „Publikum vor der Bühne am Abend“. Das hilft Menschen, die das Bild nicht sehen können, und Suchmaschinen.
- **Foto von:** Name der Fotografin / des Fotografen. Bei Festivalfotos Pflicht.
- **Einverständnis:** Lade nur Fotos hoch, auf denen **erkennbare Personen einverstanden** sind und bei denen wir die **Rechte** haben (eigene Fotos oder mit Erlaubnis der Fotograf:innen).
- **Dateinamen:** Am besten sprechend, z. B. `poolhead-live-2027.jpg`. Umlaute werden automatisch umgeschrieben.

### Fotos in die Galerie bringen

Die Galerie sammelt automatisch die Fotos aller Jahrgänge.

1. **Festival-Jahrgänge** → Jahrgang öffnen → **Fotos** → **„Foto hinzufügen“**.
2. Foto hochladen, **Bildbeschreibung** und **Foto von** ausfüllen (beides Pflicht).
3. **Speichern.** Die Fotos erscheinen auf der Jahrgangsseite und unter **Galerie**.

### Eine Neuigkeit schreiben

1. **Neuigkeiten** → **„Neu“**.
2. **Titel**, **Datum**, **Teaserbild** mit **Bildbeschreibung**, **Kurztext** (1–2 Sätze für die Übersicht) und **Text**.
3. **Entwurf:** Steht der Schalter auf **an**, erscheint der Beitrag **nur in der Vorschau**. Zum Veröffentlichen ausschalten.
4. **Speichern.** Die Startseite zeigt immer die drei neuesten Beiträge.

### Eine Seite ändern (z. B. Über uns, Mitmachen)

1. **Seiten** → Seite öffnen.
2. Text ändern. Überschriften, Listen und Links gehen über die Werkzeugleiste.
3. **Speichern.**

> Auf der Seite **Mitmachen** stehen noch Platzhalter wie `[BITTE ERGÄNZEN: …]`. Ersetz sie durch echte Infos. Die Überschriften „Helfer:in werden“ und „Mitglied werden“ bitte nicht umbenennen, die Startseite verlinkt darauf.

**Rechtliches** (Impressum, AGB, Satzung, Datenschutz) bitte **nur nach Absprache mit dem Vorstand** ändern.

### Eine Seite vorübergehend ausblenden („Seite wird überarbeitet“)

Beispiel: Das Festival-ABC soll für 2027 überarbeitet werden, aber die alten Infos sollen solange nicht online stehen.

1. **Seiten** → Seite öffnen (z. B. **Festival-ABC**).
2. Schalter **„Seite wird überarbeitet“** anmachen.
3. Optional ein kurzer **„Hinweis während der Überarbeitung“**, z. B. „Das Festival-ABC für 2027 kommt bald.“ Leer lassen ergibt „Diese Seite wird gerade überarbeitet. Schau bald wieder vorbei!“.
4. **Speichern** und einem Admin Bescheid geben (damit es auch auf der echten Seite ankommt).

Was dann passiert:

- **Echte Seite:** Die Adresse bleibt erreichbar und im Menü. Statt des Inhalts steht nur der kurze Hinweis und ein Knopf „Zur Startseite“.
- **Vorschau:** Zeigt den **vollen** Inhalt, darüber einen grünen Hinweis „Wird überarbeitet“. So könnt ihr in Ruhe weiterarbeiten.
- **Fertig?** Schalter wieder **aus**, speichern, einem Admin Bescheid geben.

Den Schalter gibt es bei: Über uns, Kontakt, Mitmachen, Festival-ABC, Sponsoring, Galerie und Archiv. Nicht bei der Startseite und nicht bei den Rechtstexten.

### Farben der Seite ändern

1. **Ausprobieren** in der Vorschau: Knopf **Design-Werkstatt** im gestreiften Banner → Abschnitt **Farben**. Jede Farbe hat einen Farbwähler. Darunter steht, ob der **Kontrast** reicht (✓) oder nicht (✗). Bearbeitet wird immer das gerade sichtbare Schema; für das andere oben auf **Hell** bzw. **Dunkel** stellen.
2. Wenn es passt: **„Auswahl kopieren“**. Im kopierten Text steht unter „Farben Hell“ bzw. „Farben Dunkel“, welche Farbe welchen Wert bekommt.
3. **Übernehmen** im CMS: **Design-Farben** → **Farben** → bei **Hell** oder **Dunkel** die Werte eintragen (Feld anklicken, Farbe wählen oder den Wert wie `#a3286b` eintippen). **Speichern.**

> **Kontrast:** Text muss sich deutlich vom Hintergrund abheben (mindestens 4,5 : 1), damit alle ihn lesen können. Ist das nicht so, zeigt die Vorschau oben einen **roten Kasten** mit den betroffenen Farben, und die echte Seite lässt sich **nicht veröffentlichen**, bis es korrigiert ist.

### Presseartikel eintragen

1. **Presse** → **Presseberichte** → **„Artikel hinzufügen“**.
2. Titel, Zeitung/Medium, Erscheinungsdatum, **Jahrgang** (zu welchem Festival gehört der Artikel?) und Link.
3. **Speichern.** Der Artikel erscheint auf der Seite des Jahrgangs.

### Neues Festivaljahr anlegen

Beispiel: Das Festival 2027 ist vorbei, jetzt kommt 2028.

1. **Neuen Jahrgang anlegen:** **Festival-Jahrgänge** → **„Neu“**.
   - **Titel**: `Fruchtfolge Festival 2028`
   - **Jahr**: `2028` (wird auch der Dateiname)
   - **Art**: Festival
   - **Status**: **Geplant**
   - **Erster Tag** / **Letzter Tag**, sobald bekannt
   - Line-up, Fotos und Unterstützer bleiben erst einmal leer. Die Seite zeigt dann „Das Line-up wird bald bekanntgegeben“.
   - **Speichern.**
2. **Als aktuell setzen:** **Einstellungen** → **Allgemeine Einstellungen** → **Aktueller Jahrgang** → `Fruchtfolge Festival 2028` wählen. **Speichern.**
3. **Alten Jahrgang abschließen:** **Festival-Jahrgänge** → `Fruchtfolge Festival 2027` → **Status** auf **Vorbei** stellen. Jetzt gerne Aftermovie-Link, Fotos und Presse ergänzen. **Speichern.** Der Jahrgang erscheint im **Archiv**.
4. **Startseite anpassen:** **Einstellungen** → **Startbereich**: Überschrift und Text für die neue Saison, ggf. neues Hintergrundfoto. **Tickets**: Status auf „Bald erhältlich“.
5. **Festival-ABC prüfen:** Stimmen Preise, Einlasszeiten, Anreise-Hinweise (Baustellen!) und das Line-up noch?
6. In der **Vorschau** prüfen und einem Admin Bescheid geben.

> Solange der neue Jahrgang noch kein Line-up hat, zeigt die Startseite automatisch den **Rückblick** auf den letzten Jahrgang.

## 5. Vorschau ansehen

- Adresse: **<https://dev-fruchtfolge.technik-7e1.workers.dev>**
- Nach dem Speichern dauert es **etwa 1–3 Minuten**, bis die Änderung dort zu sehen ist. Lade die Seite dann neu (bei Bedarf mit `Strg + Umschalt + R` bzw. `⌘ + Umschalt + R`).
- Oben steht ein gestreiftes Banner **„Vorschau – nicht die echte Seite“** mit **Stand** (Datum und Uhrzeit des letzten Builds). Steht dort eine ältere Uhrzeit als dein Speichern, ist die Vorschau noch nicht fertig. Kurz warten.
- Die Vorschau zeigt auch **Entwürfe** (z. B. News mit „Entwurf an“). Die echte Seite zeigt sie nicht.
- Im gestreiften Banner oben gibt es den Knopf **Design-Werkstatt**: Dort kannst du Farben (mit Kontrast-Prüfung), Schriften und Formen ausprobieren. Das betrifft nur deinen Browser und ändert nichts an der echten Seite. Wenn ihr euch auf etwas einigt: **„Auswahl kopieren“** und an einen Admin schicken.
- Die Vorschau ist öffentlich erreichbar, wird aber nicht von Suchmaschinen erfasst. Bitte nicht als Link teilen.

## 6. Veröffentlichen

### Für die Redaktion

Wenn in der Vorschau alles passt: **Gib einem Admin Bescheid** (Signal, WhatsApp, Mail, wie ihr wollt). Schreib kurz dazu, was du geändert hast, z. B. „Line-up 2027: 5 neue Bands, bitte veröffentlichen“.

Mehr musst du nicht tun.

### Für Admins: Änderungen von dev nach main übernehmen

Veröffentlichen heißt: Ein **Pull Request** von `dev` nach `main` wird **gemergt**. Danach baut Cloudflare die echte Seite neu (1–3 Minuten).

1. Öffne den direkten Link: **<https://github.com/FruchtFolgeFestival/website/compare/main...dev?expand=1>**
2. Oben steht `base: main ← compare: dev`. Darunter siehst du alle Änderungen seit der letzten Veröffentlichung.
   `[Screenshot: GitHub "Open a pull request" mit base main und compare dev]`
   - Steht dort „There isn't anything to compare“, gibt es nichts Neues.
3. **Titel** eintragen, z. B. `Veröffentlichung: Line-up 2027`. Optional eine kurze Beschreibung.
4. Klick auf **„Create pull request“**.
5. Prüfen:
   - Im Reiter **„Files changed“** die Änderungen ansehen (Text in Grün = neu, Rot = entfernt).
   - Unten laufen automatische **Prüfungen** („Prüfen / Vorschau bauen und prüfen“, „Produktion probebauen“). Warte, bis sie **grün** sind.
   - Ist **„Produktion probebauen“ rot** und steht im Log „Datenschutzerklärung … ENTWURF“: Die Datenschutzerklärung ist noch nicht freigegeben. Dann kann noch nicht veröffentlicht werden (siehe [docs/betrieb.md](betrieb.md)).
   `[Screenshot: Pull Request mit grünen Prüfungen und dem Knopf "Merge pull request"]`
6. Klick auf **„Merge pull request“** → **„Confirm merge“**.
   **Wichtig:** Es muss **„Create a merge commit“** sein (kein „Squash“ und kein „Rebase“). Die Einstellungen der Organisation erlauben nur diese Variante.
7. Nach 1–3 Minuten ist die Änderung auf **<https://fruchtfolge.live>** zu sehen. Den Stand des Builds siehst du im Cloudflare-Dashboard unter **Workers & Pages → fruchtfolge → Deployments**.
8. Den Branch `dev` **nicht löschen** (GitHub bietet das nach dem Merge an). Wir brauchen ihn weiter.

## 7. Wenn etwas schiefgeht

| Problem | Was du tun kannst |
|---|---|
| Ich habe mich vertippt und noch **nicht gespeichert** | Im Eintrag oben über das Menü (⋮) **Änderungen verwerfen** bzw. einzelne Felder zurücksetzen. |
| Ich habe etwas Falsches **gespeichert** | Einfach korrigieren und erneut speichern. Alles ist versioniert: Jeder alte Stand bleibt bei GitHub erhalten. Ein Admin kann ältere Stände zurückholen. |
| Ich habe etwas **gelöscht** | Einem Admin Bescheid geben. Gelöschtes lässt sich über die Versionsgeschichte wiederherstellen. |
| Die **Vorschau** zeigt meine Änderung nach 5 Minuten noch nicht | Seite hart neu laden (`Strg + Umschalt + R`). Steht im Banner immer noch ein alter Stand, ist der Build wohl fehlgeschlagen. Einem Admin Bescheid geben. |
| In der Vorschau steht oben ein **roter Kasten „Design-Farben“** | Eine Farbe hat zu wenig Kontrast oder fehlt. Im Kasten steht, welche. Im CMS unter **Design-Farben** korrigieren (in der Design-Werkstatt kannst du vorher ausprobieren, welche Farbe passt). |
| In der Vorschau steht ein **rotes Feld „Bild fehlt“** | Ein Bild wurde gelöscht oder umbenannt, ist aber noch irgendwo eingetragen. Das Bild im betreffenden Feld neu auswählen. |
| Ich komme **nicht ins CMS** | Prüfen, ob du die Einladung in die GitHub-Organisation angenommen hast. Sonst einem Admin Bescheid geben. |
| Ich bin **unsicher** | Lieber fragen: technik@fruchtfolge.live |

**Wen fragen?** Die Admins (siehe Liste in [docs/betrieb.md](betrieb.md#konten-und-dienste)) oder per Mail an **technik@fruchtfolge.live**.
