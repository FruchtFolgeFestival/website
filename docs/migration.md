# Migration von der alten WordPress-Seite

Die alte Seite <https://fruchtfolge.live/> lief mit WordPress/Elementor bei Bluehost. Am **20.11.2026** wurden die Inhalte über die WordPress-REST-API abgerufen und in die neue Struktur übertragen. Die Originaldaten liegen unter [`archiv-alt/`](../archiv-alt/) (wird nicht ausgeliefert).

## Was übernommen wurde

| Alte Seite | Neu | Wie |
|---|---|---|
| Startseite: Festival-Infos, Line-up (9 Acts mit Bild), Timetable (16 Acts + 3 Programmpunkte), Tickets, Presse-Links, Unterstützer-Logos | `content/festivals/2026.md` (Jahrgang 2026, Status „vorbei“), `data/presse.yaml` | Line-up und Timetable zu **einer** Liste zusammengeführt; Bilder in `assets/images/uploads/2026/` |
| Startseite: Aftermovie (Abschnitt „Aftermovie 2025“) | `content/festivals/2025.md` (Feld `aftermovie`) | YouTube-Link statt Einbettung |
| Startseite: Anfahrt (eingebettete Google-Karte mit `about:blank`-Link) | `data/festival.yaml` → `anfahrt` (Link zum Kartendienst) | kaputter Link korrigiert, keine Einbettung |
| Startseite selbst | Ganzseiten-Screenshots Desktop + Mobil auf `/festivals/2026/` | „So sah unsere Webseite 2026 aus“ |
| `/about/` | `/ueber-uns/` (`content/ueber-uns.md`) | Text unverändert, nur Formatierung (kaputte Fett-/Kursiv-Markierungen repariert, „isT BUNT!“ → „ist bunt!“) |
| `/abc/` (45 Einträge) | `/festival-abc/` (`content/festival-abc.md` + `data/abc.yaml`) | jeder Eintrag einzeln; „A wie …“ wird automatisch erzeugt |
| `/sponsoring/` (4 Pakete + „Anpassbar“ + PDF) | `/sponsoring/` (`content/sponsoring.md` + `data/sponsoring.yaml`), PDF unter `/dokumente/sponsoring-fruchtfolgefestival-2026.pdf` | Texte unverändert |
| `/contact/` | `/kontakt/` (`content/kontakt.md` + Kontaktdaten aus `data/festival.yaml`) | Tippfehler „ein par Zeilen“ → „ein paar Zeilen“ |
| `/impressum/` | `/impressum/` | Inhalt unverändert, nur Formatierung |
| `/terms-and-conditions/` (AGB, Stand Dez. 2025) | `/agb/` | Inhalt unverändert, nur Formatierung (auch Tippfehler wie „gesetlich“ bewusst nicht korrigiert) |
| `/elementor-seite-5802/` (Satzung) | `/satzung/` | Inhalt unverändert, nur Formatierung |
| Mediathek: 9 Fotos der Geburtstagsfeier 2025 (waren nicht auf den Seiten sichtbar) | Galerie 2025 (`content/festivals/2025.md`) | nach Rücksprache übernommen; Credits `[BITTE ERGÄNZEN]` |
| Logo (Klee mit „FFF“) | `assets/images/marke/logo.png`, Favicons in `static/` | |
| Menüpunkte englisch (Contact, Terms & Conditions …) | deutsche Menüs in `hugo.toml` | |
| Länderkürzel uneinheitlich (Wuolja „SP“, Skraeckoedlan „SW“) | ISO-Codes: Wuolja **ES**, Skraeckoedlan **SE**, Mad Mother **DE + AT** | |
| Facebook-Link zeigte nur auf facebook.com | `https://www.facebook.com/share/1EEioCVDHU/` | |
| Bluehost-`mailto:`-Link | normale `mailto:`-Links auf info@fruchtfolge.live | |
| Tracking-Parameter in Spotify-/YouTube-Links (`?si=…`) | entfernt | |

## Was bewusst nicht übernommen wurde

| Alte Seite | Grund |
|---|---|
| `/blog/`, `/faq/`, `/speakers/`, 7 Beiträge („hello-world“, „10-tips-for-higher-productivity“ …) | Demo-Inhalte des Themes (Lorem ipsum) |
| `/datenschutz-tools/` | kaputte Complianz-Seite; kein Cookie-Banner mehr nötig |
| `/datenschutzerklaerung/` | unfertige englische Vorlage mit TODOs. **Ersetzt durch einen deutschen Entwurf** (`content/datenschutz.md`, `entwurf: true`) |
| Newsletter-Bereich in der Fußzeile | Es gibt kein Newsletter-Tool und kein Formular mehr. Bei Bedarf neu planen (siehe [datenschutz-checkliste.md](datenschutz-checkliste.md)). |
| Eingebettetes YouTube-Video, eingebettete Google-Karte | Datenschutz (keine externen Ressourcen); jetzt Links |
| Theme-Bilder (`h1-img-…`, `bckg-img-…`, Platzhalter) | gehörten zum Theme, nicht zum Festival |
| Bandfotos `Einseinseins_…`, `Swedenrock_…`, `AKaRinde_print_…`, `meta_ey…` aus der Mediathek | waren auf keiner Seite sichtbar; Herkunft/Rechte unklar |

## Weiterleitungen (301)

Stehen in [`static/_redirects`](../static/_redirects), jeweils mit und ohne Schrägstrich am Ende.

| Alt | Neu |
|---|---|
| `/about/` | `/ueber-uns/` |
| `/abc/` | `/festival-abc/` |
| `/contact/` | `/kontakt/` |
| `/terms-and-conditions/` | `/agb/` |
| `/elementor-seite-5802/` | `/satzung/` |
| `/datenschutzerklaerung/` | `/datenschutz/` |
| `/datenschutz-tools/` | `/datenschutz/` |
| `/festivals/` | `/archiv/` |
| `/feed/` | `/news/index.xml` |
| `/wp-content/uploads/2026/06/Uebersicht-Sponsoringangebot-Fruchtfolgefestival-2026.pdf` | `/dokumente/sponsoring-fruchtfolgefestival-2026.pdf` |
| `/blog/`, `/faq/`, `/speakers/`, `/hello-world/`, Demo-Beiträge | `/` |
| `/wp-admin/…`, `/wp-login.php` | `/admin/` |

Unveränderte Adressen: `/`, `/sponsoring/`, `/impressum/`.

## Offene Inhalts-Punkte

Alle Platzhalter sind im Text mit **`[BITTE ERGÄNZEN: …]`** oder **`[BITTE PRÜFEN: …]`** markiert. Suche im Repo: `grep -rn "BITTE" content data`.

**Für die Redaktion** gibt es dieselben Punkte als Schritt-für-Schritt-Liste mit den genauen Stellen im CMS: [cms-aufgaben.md](cms-aufgaben.md).

**Muss vor dem Go-live erledigt sein:**

- [ ] **Datenschutzerklärung** (`content/datenschutz.md`): Platzhalter füllen, vom Vorstand freigeben, dann `entwurf: false`. Vorher geht die Produktion absichtlich nicht live.

**Sollte bald erledigt werden:**

- [ ] **Mitmachen** (`content/mitmachen.md`): Aufgaben für Helfer:innen, was Helfer:innen bekommen, Mitgliedsbeitrag/Aufnahmeantrag, Kurztext für die Startseite.
- [ ] **Galerie** (`content/galerie.md`): Hinweis, an wen man sich wendet, wenn man auf einem Foto nicht zu sehen sein möchte.
- [ ] **Jahrgang 2025** (`content/festivals/2025.md`): Datum der Geburtstagsfeier, wer gespielt hat, Fotograf:in der 9 Fotos (Credits).
- [ ] **Bildnachweise 2026**: Bei AKaRinde („JacQue Photography“) und Heckspoiler („@nicknofuture“) wurden die Namen **aus den Dateinamen abgeleitet**. Bitte prüfen. Bei den anderen Bandfotos ist kein Credit bekannt.
- [ ] **Presse** (`data/presse.yaml`): Die Titel der drei Artikel wurden **aus den Link-Adressen abgeleitet** (die alte Seite zeigte nur „Artikel: Merkur“ usw.). Erscheinungsdaten fehlen. Die Zuordnung zum Jahrgang 2026 ist eine Annahme (sie standen auf der Seite von 2026; der Merkur-Artikel könnte von 2025 sein).
- [ ] **Unterstützer 2026**: Links zu den Unterstützern fehlen. Der Name „VPBy“ steht so im Logo; ausgeschriebener Name bitte ergänzen.
- [ ] **7 Acts ohne Foto** (Fritz Sauerkraut, Powasser & Moskau78, DNVZ, Dessert Oracle, Orchid Tribe, Räckler, Fromage from Arsch): Fotos, Links und Kurzbeschreibungen fehlen. Sie stehen im Line-up unter „Außerdem dabei“.
- [ ] **Festival-ABC vor 2027 aktualisieren:** Einige Einträge beziehen sich auf 2026 und müssen für 2027 geprüft werden: *Line-up* (Bands 2026), *Tickets* (Preise, Vorverkaufsende 27.08.2026), *Anreise mit dem Auto* (Baustelle B471), *Anreise mit Bus & Bahn* (S4-Sperrung „an genau dem Wochenende“), *Einlass & Einlasszeiten*, *Awareness* („dieses Jahr“), *Was kostet ein Bier?*
- [ ] **„Fromage from Arsch“ oder „Fromage vom Arsch“?** Timetable und ABC der alten Seite widersprechen sich. Übernommen wurde „from“ (Timetable).
- [ ] **Widerspruch AGB ↔ ABC:** AGB § 9 sagt „ausschließlich Barzahlung, keine Kartenzahlung“. Das ABC (B wie Bargeld, K wie Kartenzahlung) sagt „Wir haben jetzt auch Kartenzahlung“. Die AGB wurden **nicht** geändert (Rechtstext). Bitte vom Vorstand klären.
- [ ] **Widerspruch Über uns ↔ 2025:** Auf „Über uns“ steht „2025 … starteten wir das erste Fruchtfolgefestival in FFB“. Laut Verein war 2025 eine Geburtstagsfeier und 2026 das erste offizielle Festival. Der Text wurde unverändert übernommen. Bitte bei Gelegenheit anpassen.
- [ ] **Lizenz Lade-Logo (SVGator):** siehe [cms-aufgaben.md, Abschnitt D](cms-aufgaben.md#d-zur-klärung-mit-dem-vorstand).
- [ ] **Jahrgang 2027**: Line-up, Tickets, Titelbild, Untertitel. Die Startseite zeigt bis dahin den Termin (3./4.9.2027) und den Rückblick auf 2026.
- [ ] **Startbereich der Startseite**: Hintergrundfoto ist ein Foto der Geburtstagsfeier 2025; bei Bedarf austauschen (*Einstellungen → Startbereich*).

## Abschaltplan für Bluehost

Erst **2–4 Wochen nach dem Go-live** und wenn alles stabil läuft:

1. **WordPress-Export** sichern: WordPress-Admin → *Werkzeuge* → *Daten exportieren* → *Alle Inhalte* → XML-Datei herunterladen.
2. **Mediathek sichern:** Ordner `wp-content/uploads` per Bluehost-Dateimanager oder FTP als ZIP herunterladen.
3. Optional: **Datenbank-Backup** über das Bluehost-Control-Panel (phpMyAdmin → Export) und ein vollständiges Bluehost-Backup.
4. Alles in der Vereinsablage speichern (nicht in dieses öffentliche Repository, weil Exporte Nutzerdaten enthalten können).
5. Prüfen, dass bei Bluehost **keine E-Mail-Postfächer** oder andere Dienste mehr genutzt werden (Mail läuft über Google Workspace).
6. **Bluehost kündigen.** Domain bleibt bei IONOS, DNS bei Cloudflare. Davon ist nichts betroffen.
7. In der **Google Search Console** die Sitemap `https://fruchtfolge.live/sitemap.xml` einreichen und nach einigen Wochen die 404-Fehler prüfen. Fehlende Weiterleitungen in `static/_redirects` ergänzen.
