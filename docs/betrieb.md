# Betrieb der Webseite (für Admins)

Diese Seite beschreibt, **wie die Webseite läuft**, **wo was eingestellt ist** und **was bei Störungen zu tun ist**. Die einmalige Ersteinrichtung steht in [einrichtung.md](einrichtung.md).

> **Keine Geheimnisse in dieses Repository!** Passwörter, Tokens und Client-Secrets gehören in den Passwort-Manager des Vereins bzw. in die Secret-Felder bei Cloudflare. Hier steht nur, **wo** etwas liegt und **wer** Zugriff hat.

---

## Konten und Dienste

| Dienst | Zweck | Konto / Inhaber | Wer hat Zugriff | Wo liegt das Login | Kosten |
|---|---|---|---|---|---|
| **GitHub-Organisation** `FruchtFolgeFestival` | Repository `website`, Versionsgeschichte, Login fürs CMS | Organisation des Vereins | Owner: 2 Admins (Team `admins`); Team `redaktion` mit Schreibrecht | jede Person mit eigenem GitHub-Konto (2FA Pflicht) | 0 € (GitHub Free, öffentliches Repo) |
| **Cloudflare-Konto** | Hosting (Worker `fruchtfolge`), Workers Builds, DNS von `fruchtfolge.live`, Login-Worker | Vereins-E-Mail [BITTE ERGÄNZEN: z. B. technik@fruchtfolge.live] | 2 Admins als Mitglieder (Super Administrator) | Passwort-Manager des Vereins [BITTE ERGÄNZEN: welcher?] | 0 € (Workers Free: 100.000 Anfragen/Tag, 3.000 Build-Minuten/Monat) |
| **Worker `sveltia-cms-auth`** | Anmeldung im CMS über GitHub | im Cloudflare-Konto des Vereins | wie Cloudflare | Secrets nur im Cloudflare-Dashboard | 0 € |
| **GitHub App „Sveltia CMS Auth for Fruchtfolge“** | erlaubt dem CMS, im Namen der angemeldeten Person ins Repo zu schreiben | gehört der Organisation `FruchtFolgeFestival` | Owner der Organisation | Client-ID/Secret: Cloudflare-Secrets des Login-Workers; Kopie im Passwort-Manager | 0 € |
| **IONOS** | Registrar der Domain `fruchtfolge.live` (die Domain bleibt dort, nur die Nameserver zeigen auf Cloudflare) | [BITTE ERGÄNZEN: Kundennummer/Inhaber] | [BITTE ERGÄNZEN] | Passwort-Manager | [BITTE ERGÄNZEN: Domainkosten pro Jahr] |
| **Google Workspace** | E-Mail `@fruchtfolge.live` (info@, technik@ …) | [BITTE ERGÄNZEN] | [BITTE ERGÄNZEN] | Passwort-Manager | [BITTE ERGÄNZEN: z. B. Google for Nonprofits] |
| **Netlify** | Festival-App unter `app.fruchtfolge.live` (eigenes Projekt, nicht Teil dieses Repos) | [BITTE ERGÄNZEN] | [BITTE ERGÄNZEN] | Passwort-Manager | [BITTE ERGÄNZEN] |
| **Eventfrog** | Ticketverkauf | [BITTE ERGÄNZEN] | [BITTE ERGÄNZEN] | Passwort-Manager | Gebühren pro Ticket |
| **Bluehost** (alt) | alte WordPress-Seite. Nach 2–4 Wochen stabilem Betrieb kündigen (siehe [migration.md](migration.md#abschaltplan-für-bluehost)) | [BITTE ERGÄNZEN] | [BITTE ERGÄNZEN] | Passwort-Manager | [BITTE ERGÄNZEN] |

## Adressen

| | Adresse |
|---|---|
| Produktion | <https://fruchtfolge.live> (vor dem DNS-Umzug: <https://fruchtfolge.technik-7e1.workers.dev>) |
| Vorschau (Branch `dev`) | <https://dev-fruchtfolge.technik-7e1.workers.dev> |
| Vorschau anderer Branches | `https://<branch-name>-fruchtfolge.technik-7e1.workers.dev` |
| CMS | `/admin` auf allen drei Adressen (speichert immer auf `dev`) |
| Login-Worker | <https://sveltia-cms-auth.technik-7e1.workers.dev> |
| Repository | <https://github.com/FruchtFolgeFestival/website> |
| Veröffentlichen (PR `dev → main`) | <https://github.com/FruchtFolgeFestival/website/compare/main...dev?expand=1> |

---

## Workers-Builds-Einstellungen (Cloudflare)

**Wo:** Cloudflare-Dashboard → **Workers & Pages** → **fruchtfolge** → **Settings** → rechte Leiste **Builds**.
Der Bereich hat **zwei Reiter: „Production“ und „Previews Base“**. Einstellungen und Variablen gelten jeweils nur für den gewählten Reiter.

| Feld | Reiter | Wert |
|---|---|---|
| Git repository | beide | `FruchtFolgeFestival/website` |
| Production branch (Branch control) | Production | `main` |
| Build command | beide | `./build.sh` |
| Deploy command | Production | `npx wrangler deploy` |
| Preview command | Previews Base | `npx wrangler preview` |
| Root directory | beide | `/` |
| Builds for Preview branches | Previews Base | **an** (und „Preview URLs“ aktiviert) |
| Build watch paths | beide | Include `*`, Exclude leer (Standard) |

**Build-Variablen** (jeweils unter *Variables and secrets* im Reiter; **nicht** unter „Runtime variables and secrets“):

| Name | Reiter | Wert | Bemerkung |
|---|---|---|---|
| `HUGO_VERSION` | **Production und Previews Base** | `0.170.1` | muss genau dem Inhalt von `.hugo-version` entsprechen, sonst bricht `build.sh` mit klarer Meldung ab |
| `SITE_URL` | Production | bis zum DNS-Umzug: `https://fruchtfolge.technik-7e1.workers.dev/`, danach `https://fruchtfolge.live/` | Standard in `build.sh` ist `https://fruchtfolge.live/` |

Node.js: Das Build-Image liest `.node-version` (24). Eine Variable `NODE_VERSION` ist nicht nötig.

**Hinweis zu Vorschau-Builds:** Cloudflare kann Vorschau-Builds nicht auf einzelne Branches beschränken. **Jeder Branch außer `main` bekommt eine eigene Vorschau** (z. B. `claude-…-fruchtfolge.technik-7e1.workers.dev`). Alle Vorschauen sind `noindex`. Alte Vorschauen räumt Cloudflare automatisch auf (Free: max. 100 Vorschauen pro Worker), oder manuell: `npx wrangler preview delete --name <name>`.

## Was `build.sh` macht

1. Prüft, dass die installierte Hugo-Version zu `.hugo-version` passt.
2. Ermittelt den Branch (`WORKERS_CI_BRANCH` von Cloudflare, lokal `git` oder `BUILD_BRANCH=…`).
3. **`main`** → `HUGO_ENVIRONMENT=production`, `baseURL` = `SITE_URL`.
4. **Alle anderen** → `HUGO_ENVIRONMENT=preview`, `baseURL "/"`, Entwürfe sichtbar, Vorschau-Banner, Design-Werkstatt, `<meta name="robots" content="noindex">` und zusätzlich `X-Robots-Tag: noindex` in `public/_headers`.
5. Baut mit `hugo --gc --minify --panicOnWarning`: **Jede Hugo-Warnung bricht den Build ab** (z. B. veraltete Template-Syntax nach einem Hugo-Update).

**Sonderregel Datenschutzerklärung:** Solange in `content/datenschutz.md` `entwurf: true` steht, **bricht der Produktions-Build ab**. In der Vorschau gibt es nur eine Warnung im Log und einen Hinweis auf der Seite. So kann die Seite nicht versehentlich mit einer ungeprüften Datenschutzerklärung live gehen. **Zum Freischalten:** Vorstand prüft den Text und ersetzt alle `[BITTE …]`-Stellen; dann im CMS unter *Rechtliches → Datenschutz* den Schalter **„Entwurf“ ausschalten**; speichern, veröffentlichen.

## DNS-Einträge (Cloudflare, Zone `fruchtfolge.live`)

Nach dem Umzug verwaltet Cloudflare das DNS. Diese Einträge **müssen existieren** (Werte stammen aus der alten IONOS-Konfiguration; vor dem Umzug sichern, siehe [einrichtung.md](einrichtung.md#7-dns-umzug-von-ionos-zu-cloudflare)):

| Typ | Name | Inhalt | Proxy | Zweck |
|---|---|---|---|---|
| Custom Domain (am Worker) | `fruchtfolge.live` | Worker `fruchtfolge` | (automatisch) | Webseite |
| `CNAME` oder `AAAA` + Redirect Rule | `www` | → `fruchtfolge.live` (301) | an (orange) | www leitet auf die Hauptdomain um |
| `MX` | `@` | Google-Workspace-Mailserver [BITTE ERGÄNZEN: Werte aus IONOS-Export, z. B. `smtp.google.com` Priorität 1] | nur DNS | E-Mail-Empfang |
| `TXT` | `@` | SPF, z. B. `v=spf1 include:_spf.google.com ~all` [BITTE ERGÄNZEN: exakter Wert aus IONOS-Export] | nur DNS | E-Mail-Versand erlaubt |
| `TXT` | `google._domainkey` | DKIM-Schlüssel von Google [BITTE ERGÄNZEN] | nur DNS | E-Mail-Signatur |
| `TXT` | `_dmarc` | DMARC-Richtlinie [BITTE ERGÄNZEN] | nur DNS | E-Mail-Schutz |
| `TXT` | `@` | `google-site-verification=…` u. a. [BITTE ERGÄNZEN] | nur DNS | Nachweise für Google & Co. |
| `CNAME` | `app` | Netlify-Adresse der App [BITTE ERGÄNZEN: z. B. `<projekt>.netlify.app`] | **nur DNS (graue Wolke)** | Festival-App bei Netlify |

**Wichtig:** `app` muss **„nur DNS“** (graue Wolke) bleiben, sonst funktionieren Netlifys Zertifikate nicht.

## Branch-Regeln

| Branch | Zweck | Regeln |
|---|---|---|
| `main` | Produktion | geschützt: Änderungen nur per Pull Request, nur **Merge-Commits** (kein Squash/Rebase), nur Team `admins` darf mergen, Status-Check „Vorschau bauen und prüfen“ muss grün sein, kein Force-Push, nicht löschbar |
| `dev` | Vorschau, Ziel des CMS | Redaktion darf schreiben; kein Force-Push, nicht löschbar |
| andere | Experimente, KI-Agents | eigene Vorschau, werden per PR nach `dev` gebracht |

**Normaler Weg:** CMS/Feature-Branch → `dev` → Pull Request `dev → main` (Merge-Commit).

**Hotfix** (wenn auf `main` sofort etwas repariert werden muss, `dev` aber unfertige Änderungen enthält):

1. Branch `hotfix/kurze-beschreibung` von `main` erstellen, Fehler beheben.
2. Pull Request `hotfix/… → main`, mergen (Merge-Commit).
3. **Sofort danach `main` zurück nach `dev` mergen**, damit `dev` den Fix auch hat: Pull Request `main → dev` (<https://github.com/FruchtFolgeFestival/website/compare/dev...main?expand=1>) und mergen.

**Einen alten Stand zurückholen:** In GitHub die Datei öffnen → **History** → passenden Commit → **„…“ → View file** und Inhalt übernehmen, oder einen ganzen Commit mit **Revert** (im Pull Request bzw. per `git revert <commit>` auf einem Branch) rückgängig machen. Immer über `dev` und Pull Request.

## Neue Redakteur:innen hinzufügen und entfernen

**Hinzufügen:**

1. Person legt ein GitHub-Konto an und schaltet 2FA ein (Anleitung: [redaktion.md](redaktion.md#1-einmalig-github-konto-anlegen-und-einladung-annehmen)).
2. GitHub → Organisation `FruchtFolgeFestival` → **People** → **Invite member** → Benutzername → Rolle **Member** → Team **redaktion** auswählen.
3. Person nimmt die Einladung an und meldet sich unter `/admin` an. Mehr ist nicht nötig: Die GitHub App ist für das ganze Repo installiert, jede Person mit Schreibrecht kann sich anmelden.

**Entfernen:**

1. GitHub → Organisation → **People** → Person → **Remove from organization**.
2. Optional: Person widerruft unter *Settings → Applications → Authorized GitHub Apps* die Berechtigung. Ohne Schreibrecht im Repo kann das CMS ohnehin nicht mehr speichern.

**Neue Admins:** wie oben, aber Team **admins** und Rolle **Owner** in der Organisation; zusätzlich im Cloudflare-Konto als Mitglied einladen und Zugang zum Passwort-Manager geben.

---

## Aktualisieren (immer erst auf `dev` testen!)

Grundregel: Versionen ändern sich nur an den dokumentierten Stellen. Jede Aktualisierung kommt über einen Branch → `dev` (Vorschau prüfen) → Pull Request nach `main`.

### Hugo aktualisieren

1. Neue Version nachsehen: <https://github.com/gohugoio/hugo/releases> (Release Notes auf **Breaking Changes** und **Deprecations** lesen).
2. Branch `update/hugo-X.Y.Z` erstellen und `.hugo-version` auf die neue Version setzen.
3. Lokal mit der neuen Hugo-Version `./build.sh` und `BUILD_BRANCH=main ./build.sh` laufen lassen (Letzteres nur möglich, wenn die Datenschutzerklärung freigegeben ist). Wegen `--panicOnWarning` fallen veraltete Template-Funktionen sofort auf. Dann Templates anpassen.
4. Pushen, PR nach `dev`. **Gleichzeitig** in Cloudflare die Build-Variable `HUGO_VERSION` auf die neue Version setzen, und zwar in **beiden** Reitern (Production und Previews Base). Tipp: Erst die Variable ändern, wenn der PR bereit ist. Ein Build mit nicht passender Version bricht mit klarer Meldung ab und ändert nichts an der laufenden Seite.
5. Vorschau prüfen, dann `dev → main`.

### Wrangler aktualisieren

1. Branch `update/wrangler`, dann `npm install --save-dev --save-exact wrangler@<version>` (erzeugt neue `package-lock.json`).
2. In `wrangler.jsonc` `compatibility_date` auf ein aktuelles Datum setzen (nicht neuer als das Erscheinungsdatum der Wrangler-Version).
3. `./build.sh && npx wrangler dev` testen, PR nach `dev`, Vorschau prüfen, dann `main`.
4. Mindestversion für Worker Previews: Wrangler 4.135.0.

### Sveltia CMS aktualisieren

Sveltia CMS ist bewusst **gepinnt und selbst gehostet** (`static/admin/sveltia-cms.js`), weil es vor Version 1.0 noch Breaking Changes geben kann.

1. Release Notes lesen: <https://github.com/sveltia/sveltia-cms/releases> bzw. <https://sveltiacms.app/en/docs/releases>.
2. Branch `update/sveltia-X.Y.Z` und dann:
   ```bash
   cd "$(mktemp -d)"
   npm pack @sveltia/cms@X.Y.Z
   tar xzf sveltia-cms-X.Y.Z.tgz
   ```
3. `package/dist/sveltia-cms.js` nach `static/admin/` kopieren und den Ordner `static/admin/chunks/` durch `package/dist/chunks/` ersetzen (ohne `*.map`-Dateien). `package/LICENSE.txt` → `static/admin/sveltia-cms-LICENSE.txt`.
4. Versionsnummer im Kommentar in `static/admin/index.html` und in dieser Datei anpassen.
5. `static/admin/config.yml` gegen das neue Schema prüfen (`package/schema/sveltia-cms.json`, z. B. mit dem Editor-Plugin „YAML“ oder per Skript).
6. Auf der Vorschau unter `/admin` anmelden, einen Testeintrag speichern, prüfen, wieder löschen. Dann `dev → main`.
7. Sicherheitsupdates von Sveltia zügig einspielen (Hinweise im GitHub-Repo von Sveltia „Watch → Releases“ abonnieren).

**Aktuell:** Sveltia CMS **0.270.0**, Hugo **0.170.1**, Wrangler **4.165.0**, Node **24**.

---

## Speicherplatz und große Galerien

Fotos liegen im Repository unter `assets/images/uploads/` und werden beim Build von Hugo verkleinert. Das CMS verkleinert neue Fotos schon beim Hochladen auf max. 2500 px als WebP (ca. 300–800 KB pro Foto).

**Grenzen, die zählen:**

| Grenze | Wert | Stand jetzt |
|---|---|---|
| GitHub: empfohlene Repo-Größe | unter 1 GB (Warnung bei Dateien > 50 MB, hartes Limit 100 MB pro Datei) | ca. 20 MB |
| Cloudflare Static Assets (Free) | 20.000 Dateien pro Version, max. 25 MiB pro Datei | ca. 150 Dateien |
| Workers Builds (Free) | 20 Minuten pro Build, 3.000 Build-Minuten pro Monat | ca. 30 Sekunden pro Build |

Jedes Galerie-Foto erzeugt beim Build 3–4 Dateien (Vorschaubilder + Großansicht).

**Faustregel:** Bis etwa **1.000 Fotos bzw. 500 MB** im Repository ist alles entspannt. Danach (oder wenn ein Build länger als 10 Minuten dauert):

1. **Erst aufräumen:** doppelte oder unscharfe Fotos entfernen, pro Jahrgang eine Auswahl von 30–60 Fotos statt aller Fotos.
2. **Auslagern:** Ältere Galerien in einen Cloudflare-R2-Bucket (oder eine externe Galerie, die nur verlinkt wird) verschieben und nur noch eine Auswahl im Repo behalten. R2 würde eine Template-Anpassung brauchen (Bild-URLs statt Hugo-Bildverarbeitung) und gehört vorher in [entscheidungen.md](entscheidungen.md).
3. Große Dateien niemals mit Git LFS einchecken, ohne vorher Cloudflare Workers Builds getestet zu haben.

---

## Design-Werkstatt (nur Vorschau)

In allen Vorschau-Builds (und lokal) steht im gestreiften **Vorschau-Banner** oben der Knopf **„Design-Werkstatt“**. Die Leiste klappt direkt unter dem Banner auf und schwebt nicht über der Seite. Damit lassen sich Design-Varianten (dunkles Farbschema, Schrift, Startbereich, Trenner, Ecken, Schatten, Fotos, Körnung, Sticker) live auf allen Seiten ausprobieren. Die Auswahl gilt nur im eigenen Browser (`localStorage`).

- Dateien: `assets/css/werkstatt.css`, `assets/js/werkstatt.js`, `layouts/_partials/werkstatt-kopf.html`, der Knopf in `layouts/_partials/vorschau-banner.html`, Schriften in `static/fonts/werkstatt/`.
- In der Produktion wird nichts davon geladen (`if not hugo.IsProduction` in `layouts/_partials/head.html`).
- **Eine Variante dauerhaft übernehmen:** Die entsprechenden Tokens aus `werkstatt.css` in `assets/css/main.css` übertragen (der Standard steht dort in `:root`). In `werkstatt.js` den neuen Standard als ersten Wert der Option eintragen. Danach diese Datei und [entscheidungen.md](entscheidungen.md) aktualisieren.
- **Werkstatt ganz entfernen:** die Zeile mit `werkstatt-kopf.html` in `layouts/_partials/head.html` und den Knopf `ws-knopf` in `layouts/_partials/vorschau-banner.html` löschen, dazu die drei Dateien und `static/fonts/werkstatt/`.

---

## Troubleshooting

| Problem | Ursache / Lösung |
|---|---|
| **Build rot** in Cloudflare | Cloudflare → Workers & Pages → fruchtfolge → **Deployments** → fehlgeschlagener Build → **View build log**. Häufige Ursachen: <br>• „Falsche Hugo-Version“ → Build-Variable `HUGO_VERSION` an `.hugo-version` anpassen (in beiden Reitern, Production und Previews Base). <br>• Build läuft für den falschen Branch als Produktion → Production branch muss `main` sein (Settings → Builds → Reiter Production). <br>• „Datenschutzerklärung ist noch ein ENTWURF“ → nur auf `main`, siehe oben. <br>• „Bild nicht gefunden“ → ein Bild wurde gelöscht/umbenannt, das noch verwendet wird. Pfad im CMS korrigieren. <br>• Hugo-`WARN`/`ERROR` → durch `--panicOnWarning` ist jede Warnung ein Fehler. Meldung lesen, Template oder Inhalt korrigieren. <br>• YAML-Fehler („yaml: line …“) → meist ein Tippfehler in einer Datei, die außerhalb des CMS bearbeitet wurde. |
| **Vorschau zeigt alten Stand** | 1. Hart neu laden (`Strg+Umschalt+R`). 2. Stand im Vorschau-Banner ansehen. 3. In Cloudflare unter *Deployments* prüfen, ob der Build für `dev` gelaufen und grün ist. 4. Läuft ein anderer Build gerade? (Free: nur 1 gleichzeitig, Builds warten in der Schlange.) 5. Notfalls im Dashboard **Retry build**. |
| **CMS-Login schlägt fehl** | • Fenster geht auf und gleich wieder zu bzw. „Not allowed“ → Domain fehlt in `ALLOWED_DOMAINS` des Login-Workers (genau diese drei: `fruchtfolge.live`, `fruchtfolge.technik-7e1.workers.dev`, `dev-fruchtfolge.technik-7e1.workers.dev`). <br>• „redirect_uri mismatch“ → in der GitHub App muss die Callback-URL `https://sveltia-cms-auth.technik-7e1.workers.dev/callback` sein. <br>• „Bad credentials“ → `GITHUB_CLIENT_SECRET` im Login-Worker erneuern (GitHub App → *Generate a new client secret*). <br>• Login klappt, aber Speichern geht nicht → Person hat kein Schreibrecht (Team `redaktion`) oder die GitHub App ist nicht auf dem Repo installiert. <br>• CSP-Fehler in der Browser-Konsole unter `/admin` → `static/_headers` (Abschnitt `/admin/*`) anpassen, wenn sich die Adresse des Login-Workers geändert hat. |
| **Seite 404** | • Adresse falsch geschrieben? Alte WordPress-Adressen werden über `static/_redirects` umgeleitet. Fehlende Weiterleitung dort ergänzen. <br>• Seite ist ein Entwurf (`draft: true`) → erscheint nur in der Vorschau. <br>• Ganze Domain zeigt Cloudflare-Fehler → Custom Domain am Worker prüfen (Workers & Pages → fruchtfolge → Settings → Domains & Routes). |
| **E-Mail kommt nicht an** (nach DNS-Umzug) | MX-, SPF-, DKIM- und DMARC-Einträge in Cloudflare mit der IONOS-Sicherung vergleichen. Alle auf „nur DNS“. |
| **app.fruchtfolge.live geht nicht** | `app`-Eintrag muss „nur DNS“ (graue Wolke) sein und auf Netlify zeigen. |

---

## Offene Werte

Diese Punkte konnte bei der Einrichtung niemand aus dem Repo heraus festlegen. Bitte ergänzen und dann hier abhaken:

- [ ] Inhaber/Login-Ort von Cloudflare-Konto, IONOS, Google Workspace, Netlify, Eventfrog, Bluehost (Tabelle oben)
- [ ] Kosten pro Jahr für Domain (IONOS), Google Workspace, Netlify
- [ ] Exakte DNS-Werte (MX, SPF, DKIM, DMARC, Site-Verifications, `app`-Ziel) aus dem IONOS-Export
- [ ] Welcher Passwort-Manager wird genutzt, wer hat Zugriff?
- [ ] Namen der zwei Admins (Owner der GitHub-Organisation und Cloudflare-Mitglieder): [BITTE ERGÄNZEN]
- [ ] Datum des DNS-Umzugs und des Go-live; danach `SITE_URL` auf `https://fruchtfolge.live/`
- [ ] Freigabe der Datenschutzerklärung durch den Vorstand (`entwurf: false`)
- [ ] Inhaltliche Platzhalter aus [migration.md](migration.md#offene-inhalts-punkte)
