# Ersteinrichtung (Checkliste)

Diese Checkliste beschreibt die **einmalige** Einrichtung von GitHub, Cloudflare, Login-Worker, DNS-Umzug und Domain. Sie ist so geschrieben, dass man sie bei einem kompletten Neuaufbau wiederholen kann. Abhaken, was erledigt ist.

> Den laufenden Betrieb (Updates, Störungen, neue Redakteur:innen) beschreibt [betrieb.md](betrieb.md).
> **Keine Passwörter, Tokens oder Secrets in dieses Repository schreiben.** Sie gehören in den Passwort-Manager des Vereins bzw. in die Secret-Felder bei Cloudflare.

**Werte, die in dieser Anleitung vorkommen:**

| Schlüssel | Wert |
|---|---|
| GitHub-Organisation | `FruchtFolgeFestival` |
| Repository | `FruchtFolgeFestival/website` |
| Name des Website-Workers | `fruchtfolge` |
| workers.dev-Subdomain des Cloudflare-Kontos | `technik-7e1.workers.dev` |
| Produktion bis zum DNS-Umzug | `https://fruchtfolge.technik-7e1.workers.dev` |
| Vorschau (Branch `dev`) | `https://dev-fruchtfolge.technik-7e1.workers.dev` |
| Login-Worker | `https://sveltia-cms-auth.technik-7e1.workers.dev` |
| Produktions-Domain | `https://fruchtfolge.live` |

---

## 1. GitHub-Organisation und Repository

- [ ] Organisation `FruchtFolgeFestival` existiert (Plan: Free).
- [ ] **2FA-Pflicht:** Organisation → **Settings** → **Authentication security** → **Require two-factor authentication for everyone**.
- [ ] Repository `website` ist **öffentlich** (Public), Inhalt aus diesem Ordner gepusht, Branches `main` und `dev` vorhanden.
- [ ] **Owner:** genau 2 Personen (Organisation → People → Rolle *Owner*).
- [ ] **Teams** anlegen (Organisation → Teams → New team):
  - [ ] `admins`: Repository `website` mit Rolle **Admin**
  - [ ] `redaktion`: Repository `website` mit Rolle **Write**
- [ ] **Merge-Einstellungen** (Repository → Settings → General → *Pull Requests*):
  - [ ] **Allow merge commits**: an
  - [ ] **Allow squash merging**: aus
  - [ ] **Allow rebase merging**: aus
  - [ ] **Automatically delete head branches**: aus (sonst wird `dev` nach dem Merge gelöscht)
- [ ] **Actions** erlaubt (Repository → Settings → Actions → General → *Allow all actions*). Die Prüfung `.github/workflows/check.yml` deployt nichts.

Der Branch-Schutz folgt in Schritt 9, wenn alles läuft.

## 2. Cloudflare-Konto des Vereins

- [ ] Konto mit einer **Vereins-E-Mail** anlegen (z. B. technik@fruchtfolge.live), nicht mit einer privaten Adresse.
- [ ] **2FA** einschalten (My Profile → Authentication).
- [ ] **Zweites Admin-Mitglied** einladen: Manage Account → **Members** → Invite → Rolle *Super Administrator – All Privileges*.
- [ ] Unter **Workers & Pages** einmalig die **workers.dev-Subdomain** festlegen: `technik-7e1` (ergibt `*.technik-7e1.workers.dev`).
- [ ] Zugangsdaten im Passwort-Manager des Vereins ablegen.

## 3. Website-Worker mit dem Repository verbinden (Workers Builds)

- [ ] Cloudflare-Dashboard → **Workers & Pages** → **Create** → **Import a repository**.
- [ ] **GitHub verbinden:** Bei der Installation der Cloudflare-GitHub-App **„Only select repositories“** wählen und nur `FruchtFolgeFestival/website` freigeben.
- [ ] Einstellungen:

| Feld | Wert |
|---|---|
| Project name / Worker-Name | `fruchtfolge` (muss zu `"name"` in `wrangler.jsonc` passen) |
| Production branch | `main` |
| Build command | `./build.sh` |
| Deploy command | `npx wrangler deploy` |
| Preview command (*Non-production branch deploy command*) | `npx wrangler preview` |
| Root directory | `/` |

- [ ] **Build-Variablen** (Advanced settings → Build variables):

| Name | Wert |
|---|---|
| `HUGO_VERSION` | `0.170.1` (genau der Inhalt von `.hugo-version`) |
| `SITE_URL` | `https://fruchtfolge.technik-7e1.workers.dev/` (bis zum DNS-Umzug, siehe Schritt 8) |

- [ ] **Deploy** starten.
- [ ] Danach: Worker → **Settings** → **Build** → **Branch control** → **Enable Preview Builds** einschalten. *(Hinweis: Cloudflare kann das nicht auf `dev` beschränken. Jeder Nicht-`main`-Branch bekommt eine Vorschau. Das ist harmlos, weil alle Vorschauen `noindex` sind.)*
- [ ] Falls der Worker schon vor September 2026 mit Builds verbunden war: Im Banner **„Set up Worker Previews“** einmalig auf **Set up** → **Switch to Worker Previews** klicken.

> **Achtung beim ersten Produktions-Build:** Solange die Datenschutzerklärung noch ein Entwurf ist (`entwurf: true` in `content/datenschutz.md`), **bricht der Build von `main` absichtlich ab**. Das ist gewollt: Die Seite geht erst live, wenn der Vorstand die Datenschutzerklärung freigegeben hat. Die Vorschau (`dev`) funktioniert trotzdem.

## 4. Prüfen: Produktion und Vorschau auf workers.dev

- [ ] Ein Push auf `dev` (oder **Retry build** im Dashboard) erzeugt die Vorschau: <https://dev-fruchtfolge.technik-7e1.workers.dev>.
  - [ ] Gestreiftes Banner „Vorschau – nicht die echte Seite“ ist zu sehen.
  - [ ] Antwort-Header enthält `X-Robots-Tag: noindex` (Browser → Entwicklertools → Netzwerk → Dokument).
- [ ] Nach der Freigabe der Datenschutzerklärung und einem Merge nach `main`: <https://fruchtfolge.technik-7e1.workers.dev>.
  - [ ] Kein Banner, keine Design-Werkstatt.
  - [ ] `/about/` leitet auf `/ueber-uns/` um (Weiterleitungen aus `static/_redirects`).
  - [ ] Eine unbekannte Adresse (z. B. `/gibtsnicht/`) zeigt die eigene 404-Seite.

## 5. GitHub App für das CMS-Login anlegen

*(Abweichung vom ursprünglichen Plan: Der Login-Worker arbeitet seit Herbst 2026 mit einer **GitHub App** statt einer OAuth-App. Vorteil: Die App bekommt nur Zugriff auf dieses eine Repository. Siehe [entscheidungen.md](entscheidungen.md#adr-8-cms-login-über-github-app-statt-oauth-app).)*

Reihenfolge: Erst Schritt 6a (Worker deployen, damit es die URL gibt), dann diesen Schritt, dann 6b. Die URL steht aber schon fest, deshalb kann man die App auch vorher anlegen.

- [ ] GitHub → Organisation **FruchtFolgeFestival** → **Settings** → **Developer settings** → **GitHub Apps** → **New GitHub App**.
  *(Direktlink: `https://github.com/organizations/FruchtFolgeFestival/settings/apps/new`)*
- [ ] Felder:

| Feld | Wert |
|---|---|
| GitHub App name | `Sveltia CMS Auth for Fruchtfolge` (max. 34 Zeichen, muss auf GitHub eindeutig sein) |
| Homepage URL | `https://fruchtfolge.live` |
| Callback URL (Redirect URI) | `https://sveltia-cms-auth.technik-7e1.workers.dev/callback` |
| Expire user authorization tokens | **an** (Token gilt 8 h und wird automatisch erneuert) |
| Request user authorization (OAuth) during installation | aus |
| Enable Device Flow | aus |
| Webhook → Active | **aus** |
| Repository permissions → **Contents** | **Read and write** |
| Repository permissions → Metadata | Read-only (automatisch) |
| Repository permissions → Pull requests | **No access** (wir nutzen keinen Editorial Workflow) |
| Repository permissions → Workflows | No access |
| Where can this GitHub App be installed? | **Only on this account** |

- [ ] **Create GitHub App** → die **Client ID** notieren.
- [ ] Links **General** → **Client secrets** → **Generate a new client secret** → Secret sofort in den Passwort-Manager kopieren (wird nur einmal angezeigt).
- [ ] Links **Install App** → **Install** bei `FruchtFolgeFestival` → **Only select repositories** → `website` → **Install**.

## 6. Login-Worker `sveltia-cms-auth` ausrollen

**6a. Deployen**

- [ ] Auf <https://github.com/sveltia/sveltia-cms-auth> den Knopf **„Deploy to Cloudflare“** nutzen und im Cloudflare-Konto des Vereins deployen. Worker-Name: **`sveltia-cms-auth`** (Standard).
- [ ] Prüfen: `https://sveltia-cms-auth.technik-7e1.workers.dev` ist erreichbar.
  *(Falls der Worker anders heißt: URL in `static/admin/config.yml` (`base_url`), `static/_headers` (CSP für `/admin/*`) und in dieser Doku anpassen.)*

**6b. Konfigurieren:** Cloudflare → Workers & Pages → `sveltia-cms-auth` → **Settings** → **Variables and Secrets**:

| Name | Typ | Wert |
|---|---|---|
| `GITHUB_CLIENT_ID` | Text oder Secret | Client ID der GitHub App aus Schritt 5 |
| `GITHUB_CLIENT_SECRET` | **Secret** | Client Secret der GitHub App aus Schritt 5 |
| `ALLOWED_DOMAINS` | Text | `fruchtfolge.live, fruchtfolge.technik-7e1.workers.dev, dev-fruchtfolge.technik-7e1.workers.dev` |

- [ ] **Kein** `*.workers.dev` und kein anderer Platzhalter in `ALLOWED_DOMAINS`: Sonst könnte jede beliebige workers.dev-Seite über unseren Worker Zugangstoken bekommen.
- [ ] **Deploy** (Speichern löst ein neues Deployment aus).
- [ ] Test: `https://dev-fruchtfolge.technik-7e1.workers.dev/admin` → **„Mit GitHub anmelden“** → GitHub fragt nach Autorisierung → CMS öffnet sich mit den Bereichen *Einstellungen, Festival-Jahrgänge, …*.

## 7. DNS-Umzug von IONOS zu Cloudflare

Die **Domain bleibt bei IONOS registriert**. Nur die **Nameserver** zeigen danach auf Cloudflare, und Cloudflare verwaltet das DNS.

**Vorher (bei IONOS):**

- [ ] **Alle DNS-Einträge sichern:** IONOS → Domains & SSL → `fruchtfolge.live` → **DNS** → Screenshot jeder Seite und, falls möglich, Export. Ablage im Passwort-Manager/Vereinsablage (enthält keine Geheimnisse, aber DKIM-Schlüssel).
- [ ] **DNSSEC bei IONOS deaktivieren** (sonst ist die Domain nach dem Nameserver-Wechsel nicht erreichbar). Etwa 24 h warten.

**In Cloudflare:**

- [ ] **Add a domain** → `fruchtfolge.live` → Plan **Free** → Cloudflare liest die vorhandenen Einträge ein.
- [ ] **Abgleichen** mit der IONOS-Sicherung, insbesondere:
  - [ ] **MX** für Google Workspace
  - [ ] **TXT**: SPF (`v=spf1 …`), **DKIM** (`google._domainkey`), **DMARC** (`_dmarc`), Site-Verifications (`google-site-verification=…` u. a.)
  - [ ] **`app`** → Netlify, auf **„DNS only“ (graue Wolke)** stellen
  - [ ] Alle Mail-Einträge auf „DNS only“
- [ ] Die alten Einträge für die Webseite (`A`/`AAAA`/`CNAME` für `fruchtfolge.live` und `www` → Bluehost) **noch nicht löschen**, damit die alte Seite bis zum Go-live erreichbar bleibt.

**Nameserver umstellen (bei IONOS):**

- [ ] IONOS → Domain → **Nameserver** → **eigene Nameserver** → die zwei von Cloudflare angezeigten Nameserver eintragen.
- [ ] Warten, bis Cloudflare die Zone als **„Active“** meldet (meist < 24 h). Cloudflare schickt eine Mail.
- [ ] **E-Mail testen:** Mail von außen an info@fruchtfolge.live senden und von dort eine Mail nach außen schicken. Beim Empfänger die Header prüfen: SPF, DKIM und DMARC sollen „pass“ sein.
- [ ] `app.fruchtfolge.live` öffnen und prüfen.
- [ ] Optional: **DNSSEC in Cloudflare** einschalten (DNS → Settings → DNSSEC) und den DS-Eintrag bei IONOS hinterlegen.

## 8. Go-live auf fruchtfolge.live

Voraussetzung: Datenschutzerklärung vom Vorstand freigegeben (`entwurf: false`), Produktion auf workers.dev geprüft (Schritt 4).

- [ ] Vorher die alte Seite sichern (siehe [migration.md](migration.md#abschaltplan-für-bluehost), mindestens WordPress-Export).
- [ ] In Cloudflare (DNS der Zone `fruchtfolge.live`) die alten **`A`/`AAAA`/`CNAME`-Einträge für `fruchtfolge.live` und `www` löschen** (Webseite bei Bluehost). **Mail-Einträge und `app` NICHT anfassen!**
- [ ] Worker `fruchtfolge` → **Settings** → **Domains & Routes** → **Add** → **Custom Domain** → `fruchtfolge.live`. Cloudflare legt DNS-Eintrag und Zertifikat automatisch an.
- [ ] **www → Hauptdomain:**
  - [ ] DNS: Eintrag `www` anlegen, z. B. `AAAA www 100::` mit **Proxy an** (orange). Das ist eine Platzhalter-Adresse, die Weiterleitung übernimmt die Regel.
  - [ ] **Rules** → **Redirect Rules** → **Create rule** → Vorlage „Redirect from WWW to root“ bzw.: *Wenn* Hostname gleich `www.fruchtfolge.live`, *dann* dynamische Weiterleitung auf `concat("https://fruchtfolge.live", http.request.uri.path)`, Status **301**, Query-String beibehalten.
- [ ] Workers Builds → Build-Variable **`SITE_URL` = `https://fruchtfolge.live/`**.
- [ ] **Neuen Build auslösen** (Deployments → Retry build für `main`, oder kleiner Merge `dev → main`).
- [ ] Prüfen: <https://fruchtfolge.live>, <https://www.fruchtfolge.live> (→ Umleitung), `/admin` (Anmeldung), alte Adressen (`/contact/` → `/kontakt/`), `https://fruchtfolge.live/robots.txt` (erlaubt Indexierung, verweist auf die Sitemap).
- [ ] **Google Search Console:** Domain-Property für `fruchtfolge.live` (falls vorhanden) → neue Sitemap `https://fruchtfolge.live/sitemap.xml` einreichen.

## 9. Branch-Schutz, Teams, Redaktion einladen

- [ ] **Branch-Schutz für `main`:** Repository → **Settings** → **Branches** → **Add classic branch protection rule**, *Branch name pattern:* `main`:
  - [ ] **Require a pull request before merging**: an. *Require approvals*: **aus** (damit ein Admin allein veröffentlichen kann; bei zwei Admins würde eine Pflicht-Freigabe sonst ständig blockieren).
  - [ ] **Require status checks to pass before merging**: an → Check **„Vorschau bauen und prüfen“** auswählen (erscheint erst, nachdem die GitHub Action einmal gelaufen ist).
  - [ ] **Restrict who can push to matching branches**: an → Team **`admins`**. Das regelt auch, wer Pull Requests nach `main` mergen darf: nur die Admins.
  - [ ] **Do not allow bypassing the above settings**: an.
  - [ ] **Allow force pushes**: aus. **Allow deletions**: aus.
  - [ ] Die Merge-Methode (nur Merge-Commit) ist schon in Schritt 1 eingestellt.
- [ ] **Branch-Schutz für `dev`:** zweite Regel mit *Branch name pattern* `dev`: nur **Allow force pushes: aus** und **Allow deletions: aus**. Keine PR-Pflicht, denn das CMS schreibt direkt auf `dev`.
- [ ] Redakteur:innen einladen (Anleitung: [betrieb.md](betrieb.md#neue-redakteurinnen-hinzufügen-und-entfernen)) und ihnen [redaktion.md](redaktion.md) schicken.

## 10. Bewusst kein Cloudflare Access für die Vorschau

Die Vorschau ist **öffentlich, aber nicht indexierbar** (`noindex` per Header und Meta-Tag). So können Redaktion und Vorstand sie ohne zusätzliches Login ansehen. Wie man später doch einen Zugriffsschutz nachrüstet, steht in [entscheidungen.md](entscheidungen.md#adr-9-vorschau-öffentlich-mit-noindex-kein-cloudflare-access).

## 11. Nach 2–4 Wochen stabilem Betrieb

- [ ] WordPress-Export und Medien-Sicherung von Bluehost ablegen (siehe [migration.md](migration.md#abschaltplan-für-bluehost)).
- [ ] **Bluehost kündigen.**
- [ ] Google Search Console: Abdeckung prüfen, 404-Fehler alter Adressen ggf. in `static/_redirects` ergänzen.
- [ ] In [betrieb.md](betrieb.md#offene-werte) die offenen Werte abhaken.
