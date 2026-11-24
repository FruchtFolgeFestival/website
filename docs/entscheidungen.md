# Architektur-Entscheidungen

Kurze Entscheidungsprotokolle (ADR-Stil): **Kontext → Entscheidung → verworfene Alternativen → Folgen**. Neue Entscheidungen unten anhängen, alte nicht löschen, sondern als „ersetzt durch ADR-x“ markieren.

Stand: 20.11.2026

---

## ADR-1: Hugo als Seitengenerator

- **Kontext:** Die alte Seite (WordPress/Elementor bei Bluehost) war langsam, wartungsintensiv und voller Demo-Inhalte. Gesucht war etwas Schnelles, Sicheres und Wartungsarmes, das Nicht-Techniker über ein CMS bedienen können.
- **Entscheidung:** **Hugo (extended)**, Version fest gepinnt in `.hugo-version` (zurzeit 0.170.1). Eigenes, schlankes Theme direkt in `layouts/`, kein externes Theme, kein Git-Submodul. CSS ohne Build-Werkzeug (Plain CSS über Hugo Pipes).
- **Verworfen:**
  - **Astro:** sehr gut, braucht aber Node-Build, npm-Abhängigkeiten und regelmäßige Updates. Mehr bewegliche Teile für einen kleinen Verein.
  - **Eleventy/Jekyll:** ebenfalls möglich; Hugo hat aber eine eingebaute Bildverarbeitung (WebP, responsive Größen) und kommt als einzelne Datei ohne Abhängigkeiten.
- **Folgen:** Ein Binary, kein `node_modules` für die Seite selbst. Hugo-Updates können Template-Syntax veralten lassen. `--panicOnWarning` macht das sofort sichtbar (siehe [betrieb.md](betrieb.md#hugo-aktualisieren)).

## ADR-2: Cloudflare Workers (Static Assets) statt Cloudflare Pages

- **Kontext:** Hosting kostenlos, schnell, mit Vorschau pro Branch.
- **Entscheidung:** **Cloudflare Workers mit Static Assets**, verbunden über **Workers Builds** (Git-Integration im Dashboard). Kein Worker-Code, nur `wrangler.jsonc`. Vorschauen über **Worker Previews** (`npx wrangler preview`, seit Sept. 2026).
- **Verworfen:**
  - **Cloudflare Pages:** Cloudflare empfiehlt für neue Projekte ausdrücklich Workers. Pages bekommt keine neuen Funktionen mehr.
  - **Netlify:** Die Festival-App liegt dort schon. Für die Webseite wollten wir aber DNS, Hosting und CMS-Login an einer Stelle (Cloudflare) haben, und die Free-Kontingente von Netlify sind enger.
  - **Bluehost/klassischer Webspace:** kostet Geld, keine Vorschau, kein Git-Workflow.
- **Folgen:** Wrangler ist die einzige npm-Abhängigkeit (exakt gepinnt, ≥ 4.136.3; zurzeit 4.165.0). Routen/Domains werden **nur im Dashboard** gepflegt (keine `routes` in `wrangler.jsonc`, sonst überschreibt jedes Deploy das Dashboard).

## ADR-3: Sveltia CMS statt Decap CMS oder Pages CMS

- **Kontext:** Nicht-Techniker sollen Termine, Line-up, Fotos und Texte im Browser pflegen. Die Inhalte sollen im Git-Repo bleiben (Versionsgeschichte, kein Datenbank-Server).
- **Entscheidung:** **Sveltia CMS** unter `/admin`, Konfiguration in `static/admin/config.yml` (Decap-kompatibel), deutsche Oberfläche (automatisch nach Browsersprache).
- **Verworfen:**
  - **Decap CMS (ehem. Netlify CMS):** langsamer, viele offene Fehler, schwächere Bild- und Listenbearbeitung, große Abhängigkeit.
  - **Pages CMS:** angenehm, aber ein gehosteter Fremddienst mit eigener App-Berechtigung auf GitHub. Weniger Kontrolle über Felder und Validierung.
  - **Headless-CMS mit Datenbank (z. B. Strapi, Directus):** Server, Updates, Backups. Zu viel Betrieb für einen Verein.
- **Folgen:** Sveltia ist vor Version 1.0 und kann Breaking Changes haben. Deshalb **gepinnt** (siehe ADR-10).

## ADR-4: Redaktion schreibt auf `dev`, Admins veröffentlichen per Pull Request (statt Editorial Workflow)

- **Kontext:** Nur zwei Admins sollen veröffentlichen dürfen. Die Redaktion soll ihre Änderungen trotzdem sofort in einer echten Vorschau sehen.
- **Entscheidung:** Das CMS schreibt **direkt auf den Branch `dev`** (Vorschau). Veröffentlichen = Pull Request **`dev → main`** mit **Merge-Commit** (kein Squash, damit die Historie und spätere Merges von `main` zurück nach `dev` sauber bleiben). `main` ist geschützt, nur das Team `admins` darf mergen.
- **Verworfen:**
  - **Editorial Workflow** (`publish_mode: editorial_workflow`): Jede Änderung wird ein eigener Branch + PR. Das ist unübersichtlich bei vielen kleinen Änderungen, und die Vorschau pro Eintrag ist umständlicher. Außerdem würde die GitHub App PR-Schreibrechte brauchen.
  - **Direkt auf `main` schreiben:** keine Kontrolle vor der Veröffentlichung.
- **Folgen:** Mehrere Änderungen sammeln sich auf `dev` und gehen zusammen live. Hotfixes über einen Branch von `main` und anschließendes Zurückmergen nach `dev` (siehe [betrieb.md](betrieb.md#branch-regeln)).

## ADR-5: Keine externen Ressourcen auf der öffentlichen Seite

- **Kontext:** Datenschutz ohne Cookie-Banner. Jede eingebettete Ressource von Dritten (Google Fonts, YouTube, Maps, Spotify, CDN) überträgt die IP-Adresse der Besucher:innen an Dritte.
- **Entscheidung:** Alles wird **selbst ausgeliefert**: Schriften (SIL OFL) in `static/fonts/`, Skripte und Styles über Hugo. Videos, Karten und Musik werden nur **verlinkt**, nie eingebettet. Abgesichert durch eine strenge **Content-Security-Policy** in `static/_headers` und eine automatische Prüfung in der GitHub Action.
- **Ausnahme:** Das CMS unter `/admin` (nur für die Redaktion) lädt Übersetzungen, Schriften und einige Programmteile von unpkg.com und cdn.jsdelivr.net und spricht mit GitHub. Dafür hat `/admin/*` eine eigene CSP.
- **Verworfen:** Einbettungen mit „Zwei-Klick-Lösung“: mehr Code, mehr Pflege, trotzdem Hinweise in der Datenschutzerklärung nötig.
- **Folgen:** Kein Cookie-Banner nötig. Die Hell/Dunkel-Wahl wird nur lokal im Browser gespeichert (`localStorage`, keine Übertragung). Neue Einbettungen nur nach [datenschutz-checkliste.md](datenschutz-checkliste.md).

## ADR-6: Bilder in `assets/` mit Hugo-Bildverarbeitung

- **Kontext:** Fotos sollen schnell laden, aber die Redaktion soll Originale hochladen können.
- **Entscheidung:** Uploads landen in **`assets/images/uploads/`** (CMS: `media_folder`), Pfade in den Inhalten lauten `/images/uploads/…` (`public_folder`). Hugo erzeugt beim Build WebP in mehreren Größen mit `srcset`, `width`/`height` und `loading="lazy"`. Zusätzlich verkleinert Sveltia neue Fotos **schon beim Hochladen** auf max. 2500 px und speichert sie als WebP. Das hält das Repository klein.
- **Verworfen:** `static/images/uploads`: Dann würden Originale ungefiltert ausgeliefert, ohne Größenoptimierung.
- **Folgen:** Ein Bild, das im Inhalt eingetragen, aber nicht vorhanden ist, bricht den Produktions-Build ab (in der Vorschau erscheint ein roter Hinweis). Galerien wachsen im Repo; Grenzen und Ausweg stehen in [betrieb.md](betrieb.md#speicherplatz-und-große-galerien).

## ADR-7: Prüfung der Datenschutzerklärung in `build.sh` statt als Hugo-Warnung

- **Kontext:** Der Build soll bei jeder Hugo-Warnung abbrechen (`--panicOnWarning`). Gleichzeitig soll der Datenschutz-Entwurf in der **Vorschau nur eine Warnung**, in der **Produktion ein Abbruch** sein.
- **Entscheidung:** `build.sh` liest `entwurf:` aus `content/datenschutz.md`: Produktion → Abbruch mit klarer Meldung, Vorschau → gelbe Warnung im Log. Die Seite zeigt in der Vorschau zusätzlich einen Hinweis. Als zweites Sicherheitsnetz bricht ein Template (`datenschutz-pruefung.html`) die Produktion ebenfalls ab, falls jemand Hugo direkt startet.
- **Verworfen:** `warnf` im Template: würde mit `--panicOnWarning` auch die Vorschau abbrechen. `ignoreLogs` würde die Warnung ganz verschlucken.

## ADR-8: CMS-Login über GitHub App statt OAuth-App

- **Kontext:** Ursprünglich geplant war eine GitHub-OAuth-App für den Login-Worker `sveltia-cms-auth`. Seit Herbst 2026 dokumentiert der Login-Worker nur noch die Nutzung mit einer **GitHub App** (OAuth-Apps funktionieren weiter, sind aber nicht mehr dokumentiert).
- **Entscheidung:** **GitHub App** der Organisation, installiert **nur auf `website`**, Rechte: *Contents: Read & write*, *Metadata: Read*. Kurzlebige Tokens (8 h, automatische Erneuerung).
- **Vorteil:** Eine OAuth-App bekommt Zugriff auf **alle** Repos der angemeldeten Person; die GitHub App nur auf dieses eine Repo.
- **Folgen:** Einrichtung siehe [einrichtung.md](einrichtung.md#5-github-app-für-das-cms-login-anlegen). `ALLOWED_DOMAINS` im Worker enthält genau drei Hosts, **kein `*.workers.dev`**.

## ADR-9: Vorschau öffentlich mit noindex, kein Cloudflare Access

- **Kontext:** Redaktion und Vorstand sollen die Vorschau ohne zusätzliches Login sehen können. Sie soll aber nicht in Suchmaschinen landen.
- **Entscheidung:** Vorschau-Adressen auf workers.dev sind **öffentlich**. Cloudflare setzt dort automatisch `X-Robots-Tag: noindex`. Wir setzen zusätzlich `<meta name="robots" content="noindex">`, den Header in `public/_headers` und `Disallow: /` in `robots.txt`.
- **Später nachrüsten (falls nötig):**
  1. Zero Trust im Cloudflare-Konto einschalten (Free bis 50 Nutzer:innen).
  2. **Workers & Pages** → **fruchtfolge** → Reiter **Access** → **Protect this Worker behind Access** → **Previews only** (nur Vorschauen, die Produktion bleibt offen).
  3. Als Richtlinie z. B. Einmal-Code per E-Mail für eine Liste erlaubter Adressen oder Login über GitHub.
  4. Achtung: Wer das CMS über die Vorschau-Adresse öffnet, muss dann zuerst durch Access. Die Redaktion kann das CMS weiterhin über die Produktions-Adresse `/admin` öffnen; es speichert trotzdem auf `dev`.
  (Doku: <https://developers.cloudflare.com/workers/configuration/cloudflare-access/>)

## ADR-10: Sveltia CMS gepinnt und selbst gehostet

- **Kontext:** Sveltia empfiehlt, das Skript **ungepinnt vom CDN** zu laden (immer aktuell). Vor 1.0 können aber Breaking Changes kommen, und eine Redaktions-Oberfläche, die sich über Nacht ändert, verunsichert Nicht-Techniker.
- **Entscheidung:** Version **0.270.0**, Datei `static/admin/sveltia-cms.js` (+ `chunks/`) aus dem npm-Paket, im Repo. Aktualisierung bewusst und getestet (Anleitung in [betrieb.md](betrieb.md#sveltia-cms-aktualisieren)).
- **Folgen:** Sicherheitsupdates kommen **nicht** automatisch. Die Admins sollten die Releases von Sveltia beobachten. Auch die selbst gehostete Datei lädt Übersetzungen, Schriften und Programmteile von unpkg/jsDelivr (in der passenden, festen Version).
- **Hinweis:** Die Decap-Option `locale: de` wird von Sveltia ignoriert. Die Oberfläche folgt der Browsersprache und lässt sich in den CMS-Einstellungen umstellen. Deshalb steht `locale` nicht in der Konfiguration.

## ADR-11: Abweichungen von der ursprünglichen Planung (Recherche 20.11.2026)

| Plan | Tatsächlich | Grund |
|---|---|---|
| `languageCode = "de-DE"` in `hugo.toml` | `locale = "de-DE"` | `languageCode` ist seit Hugo 0.158 veraltet; mit `--panicOnWarning` würde der Build abbrechen. |
| `imaging.quality` | `imaging.webp.quality` / `imaging.jpeg.quality` | `imaging.quality` ist seit Hugo 0.163 veraltet. |
| `.Site.Data` | `hugo.Data` | `.Site.Data` ist seit Hugo 0.156 veraltet. |
| Vorschau-Builds „wenn möglich nur `dev`“ | alle Branches außer `main` | Workers Builds bietet keinen Branch-Filter für Vorschau-Builds. Alle Vorschauen sind `noindex`. |
| Wrangler ≥ 4.136.3 | 4.165.0 (exakt) | aktuelle Version am 20.11.2026; Previews brauchen laut Doku ≥ 4.135.0. |
| Hugo „aktuelle stabile Version“ | 0.170.1 (17.11.2026) | |
| GitHub-OAuth-App | GitHub App | siehe ADR-8 |
| Sveltia `locale: de` | weggelassen | siehe ADR-10 |
| `wrangler.jsonc` ohne `preview_urls` | `"preview_urls": true` | macht die Vorschau-Adressen auf workers.dev ausdrücklich an. |
| Redirect `/about/`, `/abc/`, `/contact/` → `/kontakt/` | `/about/` → `/ueber-uns/`, `/abc/` → `/festival-abc/`, `/contact/` → `/kontakt/` | Die Inhalte gibt es weiterhin unter neuen Adressen. Alles auf `/kontakt/` umzuleiten, würde Besucher:innen verwirren. |
| `/archiv/` als eigene Seite | `content/festivals/_index.md` mit `url: /archiv/` | Die Jahrgänge bleiben unter `/festivals/<jahr>/`, die Übersicht ist unter `/archiv/` erreichbar; `/festivals/` leitet dorthin um. |
| Hugo-Prüfung in Cloudflare über `HUGO_VERSION` | `HUGO_VERSION` muss zu `.hugo-version` passen | `.hugo-version` ist die maßgebliche Stelle; `build.sh` bricht ab, wenn Cloudflare eine andere Version installiert. |
| Ein einziger Datumsbereich auf der Startseite (2026 aktuell) | 2027 ist aktueller Jahrgang (3./4.9.2027, geplant) | Der Termin 2027 war bei der Umsetzung bekannt. Die Startseite zeigt den Termin von 2027 und den Rückblick auf 2026, bis es ein Line-up 2027 gibt. |
| 2025 nur bei echten Infos | 2025 als „Vorgeschichte“ (`art: vorgeschichte`) | 2025 war eine Geburtstagsfeier, noch kein Festival. Es gibt aber Aftermovie, Gästezahl und Fotos. |

## ADR-12: Design (freigegeben Nov. 2026)

- **Kontext:** Neues Design, nicht an die alte Seite angelehnt; nur das Klee-Logo bleibt. Passend zu einem kleinen Stoner-/Psych-/Punk-Festival auf dem Bauernhof.
- **Entscheidung** (nach drei Runden im interaktiven Mockup „Design-Werkstatt“):
  - Hell **„Klee & Acker“**: Strohpapier `#f4ecda`, Ackerboden `#231a12`, Kleeblüte `#a3286b`, Hopfengrün `#5f6f22`, Wurzelbraun, Neongrün aus der Logo-Kontur.
  - Dunkel **„Zwielicht“**: Mix aus „Nachtwiese“ und „Psych-Sonne“, Wiesengrün-Schwarz mit Orange, Pink und Lila.
  - Hell/Dunkel **folgt dem Gerät**, mit Umschalter (Wahl wird nur lokal gespeichert).
  - Schrift **„Psych 70s“**: Shrikhand (Überschriften) + Atkinson Hyperlegible Next (Text, besonders gut lesbar).
  - Startbereich **Foto-Duoton**, Trenner **Welle** (die Welle ist die Kante zwischen den Abschnitten), Ecken **„Lavalampe“** (organisch), Schatten **„Regenbogen-Stapel“**, Papier-Körnung, schräger Datums-Sticker.
  - Referenzen: Siebdruck-Gigposter der Desert-Rock-Szene, risografierte Dorffest-Flyer, Saatgut-Tüten (Sponsoring-Stufen Samen → Baum).
- **Folgen:** Alle Varianten bleiben in der Vorschau über die **Design-Werkstatt** ausprobierbar (nur Vorschau, siehe [betrieb.md](betrieb.md#design-werkstatt-nur-vorschau)).

## ADR-13: Handy-Menü unten, Design-Werkstatt im Vorschau-Banner (Nov. 2026)

- **Kontext:** Auf dem Handy war das Menü oben im Kopf, schlecht mit dem Daumen erreichbar. Der Knopf der Design-Werkstatt schwebte unten rechts über der Seite und hätte sich mit einem Menü-Knopf dort überschnitten.
- **Entscheidung** (nach Mockup, Nov. 2026):
  - **Handy (unter 960 px):** Unten rechts steht ein Knopf **„Menü“**. Sobald gescrollt wird, morpht er zu einem **runden Kreis mit Hamburger-Symbol**; ganz oben zeigt er wieder „Menü“. Antippen öffnet das Hauptmenü als **Blatt von unten**, der Knopf wird zum **X**. Schließen auch über den Schleier, Esc oder einen Link. Die Fußzeilen-Links (Impressum, Datenschutz …) stehen klein unter dem Menü.
  - **Desktop:** unverändert, Menü im Kopf.
  - **Design-Werkstatt:** Knopf im Vorschau-Banner, Leiste klappt darunter auf (Handy und Desktop).
- **Umsetzung:** `layouts/_partials/kopf.html` (Knopf und Schleier liegen im `<header>`, weil der Kopf eine eigene Stapel-Ebene bildet), CSS in `assets/css/main.css` (Abschnitt „Handy: Menü-Knopf …“), Verhalten in `assets/js/site.js` (Funktion `menue`).
- **Barrierefreiheit:** Der Knopf hat immer eine Beschriftung für Screenreader („Menü öffnen/schließen“) und `aria-expanded`, ist mindestens 56 px groß, der Fokus springt ins Menü und bleibt darin, bis es geschlossen wird. Ohne JavaScript steht das Menü normal im Kopf, und es gibt keinen schwebenden Knopf.
- **Verworfen:** Menü als ganzer Bildschirm (im Mockup ausprobierbar), Menü oben ausklappend (bisherige Lösung).

## ADR-14: Schalter „Seite wird überarbeitet“ statt Entwurf (Nov. 2026)

- **Kontext:** Die Redaktion will Seiten (z. B. das Festival-ABC vor einem neuen Jahrgang) zeitweise ausblenden, in Ruhe überarbeiten und dann wieder zeigen.
- **Entscheidung:** CMS-Feld `in_arbeit` (Schalter) plus optional `in_arbeit_text` bei den normalen Seiten (Sammlung *Seiten*, außer Startseite). Ausgewertet zentral in `layouts/_partials/abschnitte.html`:
  - **Produktion:** Statt der Abschnitte steht nur der Hinweis und ein Knopf „Zur Startseite“. Adresse, Menü und Sitemap bleiben.
  - **Vorschau:** voller Inhalt, darüber ein deutlicher Hinweis.
- **Verworfen:**
  - `draft: true`: Die Seite wäre in der Produktion eine 404, Menü und interne Links (z. B. Kontakt → ABC) würden ins Leere zeigen.
  - Einzelne ABC-Einträge ausblenden: feiner, aber mehr Klicks und leicht zu vergessen. Kann später ergänzt werden.
- **Nicht für Rechtstexte:** Impressum, Datenschutz usw. müssen immer erreichbar sein.

## ADR-15: Farben als Daten (`data/design.yaml`), im CMS änderbar, mit Kontrast-Prüfung (Nov. 2026)

- **Kontext:** Die Farben sollen ohne Code-Änderung anpassbar sein, in der Design-Werkstatt ausprobierbar und im CMS dauerhaft einstellbar. Gleichzeitig gilt: Kontrast ≥ 4,5 : 1 in beiden Farbschemata (AGENTS.md, Regel 11).
- **Entscheidung:**
  - Die 14 Farbwerte je Schema (hell/dunkel) stehen **nur** in `data/design.yaml` (CMS: *Design-Farben*, Farbwähler). `assets/css/farben.css` ist eine Hugo-Vorlage, die daraus CSS-Variablen macht. `head.html` hängt sie vor `main.css` (eine Datei, keine Inline-Styles, CSP bleibt streng). `main.css` enthält keine Farbwerte mehr, nur abgeleitete Tokens (`--line: var(--ink)` usw.).
  - Zuordnung Feld → CSS-Variable und die Kontrast-Paare stehen an **einer** Stelle: `layouts/_partials/farben/liste.html`. Template, Prüfung und Werkstatt lesen sie von dort.
  - **Prüfung** (`farben/pruefung.html`, Formel nach WCAG 2 in `farben/kontrast.html`): fehlende/ungültige Farben und zu wenig Kontrast. **Vorschau:** roter Kasten oben auf jeder Seite. **Produktion:** Build bricht mit Liste der Probleme ab (wie bei der Datenschutzerklärung). Der PR-Check „Produktion probebauen“ zeigt das schon vor dem Merge.
  - **Werkstatt:** Farbwähler für das gerade sichtbare Schema, setzt die Variablen per CSSOM an `<html>` (`style.setProperty`, von der CSP erlaubt), zeigt Kontrast live und schreibt geänderte Werte in den Kopiertext.
- **Folgen:** Wer eine neue Farbe einführt, ändert `farben/liste.html`, `data/design.yaml` (hell + dunkel) und `static/admin/config.yml` (Anker `&farbfelder`). Die dunklen Werkstatt-Mischungen (Glut, Aubergine) bleiben feste Vorlagen in `werkstatt.css`.

