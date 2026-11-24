# Anleitung für KI-Agents

Diese Datei gilt für alle KI-Agents (Claude Code, Codex, Copilot …), die an diesem Repository arbeiten. `CLAUDE.md` verweist hierher.

## Projekt in Kürze

- **Was:** Webseite des Fruchtfolgefestival Förderfreunde e.V. (kleines Stoner-/Psych-/Punk-Festival in Lindach bei Fürstenfeldbruck). Sprache von Seite, CMS und Doku: **Deutsch**.
- **Stack:** Hugo (extended, Version in `.hugo-version`) → statische Dateien in `public/` → Cloudflare Workers mit Static Assets (Workers Builds, `wrangler.jsonc`). Redaktion über **Sveltia CMS** unter `/admin` (`static/admin/config.yml`), das direkt auf den Branch `dev` schreibt.
- **Branches:** `main` = Produktion (<https://fruchtfolge.live>), `dev` = Vorschau (<https://dev-fruchtfolge.technik-7e1.workers.dev>). Veröffentlichen = Pull Request `dev → main` mit Merge-Commit, nur durch Menschen im Team `admins`.
- **Ausführliche Doku:** `README.md`, `docs/betrieb.md` (Betrieb, Updates, Troubleshooting), `docs/entscheidungen.md` (warum es so ist), `docs/redaktion.md` (Bedienung des CMS), `docs/cms-aufgaben.md` (offene Inhalts-Aufgaben für die Redaktion, bei Änderungen an Inhalten mitpflegen).

## Befehle

| Befehl | Zweck |
|---|---|
| `hugo server -D` | Entwicklungsserver mit Entwürfen, Vorschau-Banner und Design-Werkstatt, <http://localhost:1313> |
| `./build.sh` | Build wie Cloudflare (Vorschau, wenn der aktuelle Branch nicht `main` ist) |
| `BUILD_BRANCH=main ./build.sh` | Build wie Produktion. Bricht ab, solange `content/datenschutz.md` `entwurf: true` hat. Das ist gewollt. |
| `npm ci` und dann `npx wrangler dev` | `public/` lokal wie Cloudflare ausliefern (inkl. `_redirects`, `_headers`, 404) |

Hugo muss **genau** die Version aus `.hugo-version` haben, sonst bricht `build.sh` ab.

## Verzeichnisse und Inhaltsmodell

| Pfad | Inhalt | Im CMS als |
|---|---|---|
| `data/festival.yaml` | aktueller Jahrgang, Startbereich, Tickets, Anfahrt, Kontakt, Social Media, SEO-Beschreibung | Einstellungen |
| `content/festivals/<jahr>.md` | Jahrgang: `jahr`, `art` (festival/vorgeschichte), `status` (geplant/vorbei), `datum_von`, `datum_bis`, `ort`, `untertitel`, `titelbild(_alt)`, `aftermovie`, `lineup[]`, `galerie[]`, `unterstuetzer[]`, Markdown-Text = Einleitung | Festival-Jahrgänge |
| `lineup[]` | `name`, `art` (act/programmpunkt), `herkunft[]` (ISO-Codes, siehe `data/laender.yaml`), `genre`, `beschreibung`, `bild`, `bild_alt`, `bild_credit`, `links[]` (`typ`, `url`), `tag`, `von`, `bis`, `buehne`. **Eine** Liste für Line-up **und** Timetable. | |
| `content/festivals/_index.md` | Archiv-Übersicht, erreichbar unter `/archiv/` (`url: /archiv/`) | Seiten → Archiv |
| `content/news/*.md` | `title`, `date`, `draft`, `bild`, `bild_alt`, `kurztext`, Text. URL = Dateiname. | Neuigkeiten |
| `data/design.yaml` | Farben `hell`/`dunkel` (je 14 Felder, `#rrggbb`). Zuordnung Feld → CSS-Variable und Kontrast-Paare in `layouts/_partials/farben/liste.html`. Zu wenig Kontrast (< 4,5:1) = roter Kasten in der Vorschau, Abbruch in Produktion. | Design-Farben |
| `data/abc.yaml` | `eintraege[]`: `begriff`, `text` (Markdown) | Festival-ABC |
| `data/presse.yaml` | `artikel[]`: `titel`, `medium`, `datum`, `jahrgang`, `link` | Presse |
| `data/sponsoring.yaml` | `pakete[]` (`name`, `preis`, `symbol`, `kurz`, `leistungen[]`), `pdf`, `pdf_titel`, `mail_betreff` | Sponsoring |
| `data/laender.yaml` | ISO-Code → Ländername (Codes in Anführungszeichen, wegen `NO`) | (nur im Repo; Liste in `config.yml` synchron halten) |
| `content/*.md` | normale Seiten (`title`, `description`, optional `layout`; bei *Seiten* außerdem `in_arbeit` + `in_arbeit_text` = „Seite wird überarbeitet“, ausgewertet in `_partials/abschnitte.html`) | Seiten / Rechtliches |
| `assets/images/uploads/` | alle Bilder, Pfad in Inhalten `/images/uploads/…` | Medien |
| `layouts/` | eigenes Theme (Hugo ≥ 0.146-Struktur: `baseof.html`, `home.html`, `page.html`, `_partials/`, `_shortcodes/`, `_markup/`) | |
| `assets/css/main.css` | Design (Tokens in `:root`, dunkle Variante doppelt: Media-Query + `[data-theme="dark"]`). **Keine Farbwerte**, die kommen aus `data/design.yaml` über die Vorlage `assets/css/farben.css`. | |
| `assets/css/werkstatt.css`, `assets/js/werkstatt.js` | Design-Werkstatt, **nur** in Nicht-Produktion | |
| `static/_headers`, `static/_redirects` | Sicherheits-Header/CSP, 301-Weiterleitungen | |
| `archiv-alt/` | Originaldaten der alten WordPress-Seite, wird nicht ausgeliefert | |

## Regeln

1. **Nie direkt auf `main` arbeiten oder pushen.** Arbeite auf `dev` oder einem Feature-Branch und öffne einen Pull Request. Merges nach `main` macht ein Mensch.
2. **Keine externen Ressourcen** auf der öffentlichen Seite: keine CDNs, Google Fonts, Tracker, eingebetteten YouTube-/Maps-/Spotify-Player, keine iframes. Externe Dienste nur als normale Links. Ausnahme ist nur `/admin` (Sveltia CMS). Die CSP in `static/_headers` und die Prüfung in `.github/workflows/check.yml` erzwingen das. Neue Dienste: erst `docs/datenschutz-checkliste.md`.
3. **Datenstrukturen nur zusammen mit `static/admin/config.yml` ändern.** Jedes Feld, das ein Template liest, muss im CMS editierbar sein, und jedes CMS-Feld muss im Template ankommen. Felder umbenennen = Templates, `config.yml`, bestehende Inhalte und Doku gleichzeitig anpassen.
4. **Keine Rechtstexte inhaltlich ändern** (Impressum, AGB, Satzung, Datenschutz) ohne ausdrücklichen Auftrag. Formatierung ist erlaubt. `entwurf: true` in `content/datenschutz.md` nie eigenmächtig auf `false` setzen.
5. **Keine Inhalte erfinden.** Fehlendes als `[BITTE ERGÄNZEN: …]` markieren und in `docs/migration.md` (offene Punkte) aufnehmen.
6. **Versionen nur an den dokumentierten Stellen ändern:** Hugo → `.hugo-version` (+ Cloudflare-Variable `HUGO_VERSION`, macht ein Mensch), Wrangler → `package.json`/`package-lock.json` (exakt gepinnt) + ggf. `compatibility_date`, Sveltia → `static/admin/sveltia-cms.js` + `chunks/` + Kommentar in `static/admin/index.html`. Anleitung: `docs/betrieb.md`.
7. **Nach jeder Änderung bauen und auf Warnungen prüfen:** `./build.sh` muss ohne `WARN` durchlaufen (`--panicOnWarning`). Nur aktuelle, nicht veraltete Hugo-Syntax verwenden (z. B. `hugo.Data` statt `.Site.Data`, `.Title` statt `.Params.title`, `locale` statt `languageCode`).
8. **Doku bei jeder strukturellen Änderung mit aktualisieren** (`README.md`, `docs/*.md`, diese Datei). Neue Architektur-Entscheidungen als ADR in `docs/entscheidungen.md`.
9. **Keine Geheimnisse ins Repo** (Tokens, Passwörter, Client-Secrets). Nur dokumentieren, wo sie liegen.
10. **Nichts in Cloudflare, bei IONOS oder in den GitHub-Einstellungen ändern.** Das machen Menschen. Agents liefern Code, Doku und genaue Anleitungen.
11. **Barrierearm bleiben:** semantisches HTML, Alt-Texte, sichtbare Fokus-Stile, Kontrast ≥ 4,5:1 (beide Farbschemata), keine Information nur über Farbe.
12. **Einfach vor clever:** lieber ein klares Template mehr als ein generisches Mega-Template. Keine neuen Abhängigkeiten; Node/npm nur für Wrangler.

## Definition of Done

- [ ] Änderung liegt auf `dev` oder einem Feature-Branch (nicht `main`), Commit-Message auf Deutsch und aussagekräftig.
- [ ] `./build.sh` läuft ohne Warnungen; bei Template-Änderungen zusätzlich der Produktions-Build geprüft (ggf. mit vorübergehend `entwurf: false`, **nicht** committen).
- [ ] Keine externen Ressourcen in `public/` (außer `/admin`): `grep -rhoE '<(script|link|img|iframe)[^>]*>' public --include=*.html --exclude-dir=admin | grep -E '(src|href)=("|)?(https?:)?//' | grep -vE 'rel=("|)?(canonical|alternate)'` ist leer (canonical und der eigene RSS-Feed sind erlaubt).
- [ ] Datenstruktur geändert? → `static/admin/config.yml` angepasst und gegen das Sveltia-Schema geprüft.
- [ ] Seite auf Handy- (390 px) und Desktop-Breite angesehen, hell und dunkel, ohne horizontales Scrollen.
- [ ] Bilder haben Alt-Text; neue Fotos haben Credit.
- [ ] Alte Adressen geändert? → `static/_redirects` ergänzt.
- [ ] Doku aktualisiert (siehe Regel 8), offene Punkte in `docs/migration.md`.
