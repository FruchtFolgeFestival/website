#!/usr/bin/env bash
# =============================================================================
# Build der Fruchtfolge-Webseite
# -----------------------------------------------------------------------------
# Wird von Cloudflare Workers Builds als "Build command" aufgerufen (./build.sh)
# und kann lokal genauso gestartet werden.
#
#   Branch main     -> Produktion: HUGO_ENVIRONMENT=production, baseURL = SITE_URL
#   alle anderen    -> Vorschau:   HUGO_ENVIRONMENT=preview, baseURL "/", noindex,
#                                  Entwürfe sichtbar, Vorschau-Banner, Design-Werkstatt
#
# Variablen (im Cloudflare-Dashboard unter "Build-Variablen" setzen):
#   HUGO_VERSION  Hugo-Version, die das Build-Image installiert (muss zu .hugo-version passen)
#   SITE_URL      Adresse der Produktion, Standard https://fruchtfolge.live/
# Lokal zum Testen eines anderen Branches:  BUILD_BRANCH=main ./build.sh
# =============================================================================
set -euo pipefail

cd "$(dirname "$0")"

rot()  { printf '\033[31m%s\033[0m\n' "$*" >&2; }
gelb() { printf '\033[33m%s\033[0m\n' "$*" >&2; }
info() { printf '==> %s\n' "$*"; }

# --- 1. Hugo-Version prüfen ---------------------------------------------------
SOLL="$(tr -d '[:space:]' < .hugo-version)"
if ! command -v hugo >/dev/null 2>&1; then
  rot "FEHLER: Hugo ist nicht installiert. Erwartet wird Hugo extended ${SOLL}."
  rot "In Cloudflare: Build-Variable HUGO_VERSION=${SOLL} setzen. Lokal: siehe README.md."
  exit 1
fi
IST="$(hugo version | sed -E 's/^hugo v([0-9]+\.[0-9]+\.[0-9]+).*/\1/')"
if [ "${IST}" != "${SOLL}" ]; then
  rot "FEHLER: Falsche Hugo-Version: installiert ist ${IST}, erwartet wird ${SOLL} (Datei .hugo-version)."
  rot "In Cloudflare: Build-Variable HUGO_VERSION auf ${SOLL} setzen und den Build neu starten."
  rot "Wer Hugo bewusst aktualisieren will: siehe docs/betrieb.md, Abschnitt 'Hugo aktualisieren'."
  exit 1
fi
info "Hugo ${IST} (passt zu .hugo-version)"

# --- 2. Branch ermitteln -------------------------------------------------------
# Workers Builds setzt WORKERS_CI_BRANCH. Lokal: BUILD_BRANCH oder der aktuelle Git-Branch.
BRANCH="${BUILD_BRANCH:-${WORKERS_CI_BRANCH:-}}"
if [ -z "${BRANCH}" ]; then
  BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unbekannt)"
fi
COMMIT="${WORKERS_CI_COMMIT_SHA:-$(git rev-parse HEAD 2>/dev/null || echo '')}"
COMMIT="${COMMIT:0:7}"
info "Branch: ${BRANCH}${COMMIT:+ (Commit ${COMMIT})}"

# Infos für das Vorschau-Banner (Hugo liest HUGO_PARAMS_* als site.Params)
export HUGO_PARAMS_BUILDBRANCH="${BRANCH}"
export HUGO_PARAMS_BUILDCOMMIT="${COMMIT}"
HUGO_PARAMS_BUILDZEIT="$(TZ=Europe/Berlin date '+%d.%m.%Y, %H:%M')"
export HUGO_PARAMS_BUILDZEIT

# --- 3./4. Umgebung festlegen -------------------------------------------------
HUGO_ARGS=(--gc --minify --panicOnWarning)
if [ "${BRANCH}" = "main" ]; then
  export HUGO_ENVIRONMENT=production
  SITE_URL="${SITE_URL:-https://fruchtfolge.live/}"
  case "${SITE_URL}" in */) ;; *) SITE_URL="${SITE_URL}/" ;; esac
  HUGO_ARGS+=(--baseURL "${SITE_URL}")
  info "Produktion: ${SITE_URL}"
else
  export HUGO_ENVIRONMENT=preview
  HUGO_ARGS+=(--baseURL "/" --buildDrafts)
  info "Vorschau (nicht indexierbar, Entwürfe sichtbar)"
fi

# --- Datenschutz-Entwurf prüfen ------------------------------------------------
# Solange content/datenschutz.md "entwurf: true" enthält:
#   Produktion -> Abbruch (die Seite darf so nicht live gehen)
#   Vorschau   -> nur Warnung im Log (und Hinweis auf der Seite)
# Bewusst hier im Skript statt als Hugo-Warnung, damit --panicOnWarning alle
# anderen Warnungen weiterhin hart behandeln kann (siehe docs/entscheidungen.md).
if grep -Eq '^entwurf:[[:space:]]*true' content/datenschutz.md; then
  if [ "${HUGO_ENVIRONMENT}" = "production" ]; then
    rot "FEHLER: Die Datenschutzerklärung ist noch ein ENTWURF (content/datenschutz.md: entwurf: true)."
    rot "Produktion wird erst gebaut, wenn der Vorstand den Text freigegeben hat und dort 'entwurf: false' steht."
    exit 1
  else
    gelb "WARNUNG: Datenschutzerklärung ist noch ein Entwurf (entwurf: true). In der Vorschau erlaubt, in Produktion nicht."
  fi
fi

# --- 5. Bauen ------------------------------------------------------------------
rm -rf public   # immer sauber bauen, damit keine alten Dateien mit ausgeliefert werden
info "hugo ${HUGO_ARGS[*]}"
hugo "${HUGO_ARGS[@]}"

# --- Zusätzliche Header für die Vorschau ---------------------------------------
# Cloudflare setzt auf workers.dev-Vorschauen schon "X-Robots-Tag: noindex".
# Wir setzen es zusätzlich selbst, falls die Vorschau einmal unter einer anderen Adresse läuft.
if [ "${HUGO_ENVIRONMENT}" != "production" ]; then
  {
    echo ""
    echo "# Nur Vorschau (von build.sh ergänzt): nicht indexieren"
    echo "/*"
    echo "  X-Robots-Tag: noindex, nofollow"
  } >> public/_headers
fi

info "Fertig: $(find public -type f | wc -l | tr -d ' ') Dateien in public/"
