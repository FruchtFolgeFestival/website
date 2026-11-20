# Datenschutz-Checkliste

Welche Dienste berühren personenbezogene Daten, was muss in der Datenschutzerklärung stehen, und was ist vor neuen Einbettungen zu prüfen? Diese Liste ist **keine Rechtsberatung**. Sie hilft dem Vorstand, die Datenschutzerklärung (`content/datenschutz.md`) aktuell zu halten.

Stand der Technik: 20.11.2026

## Dienste, die Daten von Besucher:innen berühren

| Dienst | Was passiert | Wann | Daten | Muss in die Datenschutzerklärung | Vertrag/AVV |
|---|---|---|---|---|---|
| **Cloudflare** (Hosting, CDN, DNS) | liefert jede Seite aus, schützt vor Angriffen | bei jedem Seitenaufruf | IP-Adresse, Zeitpunkt, URL, User-Agent, Referrer (Server-Logs) | ja (Abschnitt 3) | Data Processing Addendum im Cloudflare-Konto akzeptieren; USA-Übermittlung (DPF/SCC) prüfen |
| **Browser-Speicher** (`localStorage`) | merkt sich die Hell/Dunkel-Wahl | nur, wenn jemand den Knopf benutzt | `fff-theme` = light/dark, bleibt auf dem Gerät | ja (Abschnitt 4) | – |
| **Google Workspace** (E-Mail) | E-Mails an @fruchtfolge.live | wenn jemand schreibt | Name, E-Mail, Inhalt | ja (Abschnitt 5) | AVV mit Google prüfen |
| **Eventfrog** | Ticketverkauf | nur nach Klick auf den Ticket-Link | alles, was beim Ticketkauf anfällt | ja, als externer Link (Abschnitt 6) | eigenes Verhältnis zu Eventfrog; welche Käuferdaten erhält der Verein? |
| **Instagram, Facebook, YouTube, Spotify, Google Maps** | nur verlinkt | nur nach Klick | beim jeweiligen Anbieter | ja, als externe Links (Abschnitt 6) | – |
| **Festival-App** `app.fruchtfolge.live` (Netlify) | eigenes Angebot | nur bei Aufruf der App | siehe App | Verweis auf eigene Datenschutzerklärung (Abschnitt 7) | eigener Vertrag mit Netlify |
| **GitHub + Login-Worker** | Anmeldung im CMS | nur Redaktion | GitHub-Konto der Redakteur:innen | optional (Abschnitt 8) | GitHub-Nutzungsbedingungen |

**Nicht** im Einsatz (und deshalb nicht in die Datenschutzerklärung): Cookies, Analyse/Tracking (Google Analytics, Matomo …), Werbung, Kontaktformular, Newsletter-Tool, eingebettete Videos/Karten/Player, Google Fonts, Social-Media-Plugins, CDN-Skripte.

**Die Design-Werkstatt** (nur auf der Vorschau-Adresse, `localStorage`-Schlüssel `fff-werkstatt`) betrifft nur das Team und nicht die öffentliche Seite.

## Fotos

- Fotos, auf denen Personen erkennbar sind: Rechtsgrundlage klären (Einwilligung, berechtigtes Interesse bei Veranstaltungsfotos, Hinweis in den AGB § 7). [BITTE vom Vorstand klären]
- Credits der Fotograf:innen sind im CMS Pflicht.
- Ein Weg zum Widerspruch („Ich will auf diesem Foto nicht zu sehen sein“) gehört auf die Galerie-Seite und in die Datenschutzerklärung.

## Bevor etwas Neues eingebaut wird

Prüfe **vor** dem Einbau jeder neuen Funktion:

1. **Lädt sie etwas von einem fremden Server** (Skript, Schrift, Bild, iframe, Video, Karte, Widget)?
   - Wenn ja: Geht es auch **als Link** oder **selbst gehostet**? Das ist fast immer die bessere Lösung.
   - Wenn es wirklich eingebettet werden muss: Dann braucht es vermutlich eine **Einwilligung vor dem Laden** (Zwei-Klick-Lösung oder Cookie-Banner), einen Abschnitt in der Datenschutzerklärung, die CSP in `static/_headers` muss erweitert werden, und die Prüfung in `.github/workflows/check.yml` schlägt sonst fehl. **Vorher mit dem Vorstand abstimmen.**
2. **Setzt sie Cookies oder speichert sie etwas im Browser?** Nur, wenn es für eine von den Besucher:innen gewünschte Funktion unbedingt nötig ist (wie Hell/Dunkel). Sonst Einwilligung nötig.
3. **Sammelt sie Daten** (Formular, Newsletter, Kommentar)? Dann: Zweck, Rechtsgrundlage, Speicherdauer, Auftragsverarbeiter, Löschkonzept klären. **Formulare** brauchen außerdem einen Server-Teil (z. B. Worker) und Spamschutz.
4. **Neuer Dienstleister?** Auftragsverarbeitungsvertrag (AVV) abschließen, Standort/Drittlandübermittlung prüfen.
5. **Datenschutzerklärung anpassen** und vom Vorstand freigeben lassen. Bis zur Freigabe kann `entwurf: true` gesetzt werden: Dann geht die Produktion nicht live.

## Vor dem Go-live

- [ ] Alle `[BITTE ERGÄNZEN]`/`[BITTE PRÜFEN]` in `content/datenschutz.md` erledigt
- [ ] Cloudflare-AVV akzeptiert
- [ ] Google-Workspace-AVV geprüft
- [ ] Eventfrog-Datenfluss geklärt
- [ ] Link zur Datenschutzerklärung der App ergänzt
- [ ] Vorstand hat freigegeben → `entwurf: false` (CMS: *Rechtliches → Datenschutz → Entwurf aus*)
