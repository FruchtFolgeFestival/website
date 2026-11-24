#!/usr/bin/env python3
"""Bereitet einen SVGator-Export (LOGO.svg) für das Lade-Logo der Webseite auf.

Aufruf (Python 3, keine Zusatzpakete):
    python3 werkzeuge/logo-animiert.py ~/Downloads/LOGO.svg assets/images/marke/logo-animiert.svg

Was passiert (an Grafik und Bewegung ändert sich nichts):
- Das eingebettete CSS (@import "data:text/css;base64,…") wird ausgepackt, weil unsere
  Sicherheitsregeln (CSP) keine data:-Stylesheets erlauben.
- Die Dauer wird von 3000ms auf DAUER_MS gesetzt (Tempo „schneller“).
- Inkscape-Metadaten werden entfernt.

Danach in assets/js/site.js (Funktion ladeLogo) ANIMATION anpassen, falls sich die sichtbare
Dauer ändert, und in assets/css/main.css den Ausschnitt (.lader-bild img), falls das Logo auf
der Zeichenfläche anders liegt. Siehe docs/betrieb.md, Abschnitt „Lade-Logo“.
"""
import base64
import re
import sys

DAUER_MS = 2000

quelle, ziel = sys.argv[1], sys.argv[2]
svg = open(quelle, encoding="utf-8").read()
m = re.search(r'@import "data:text/css;base64,([A-Za-z0-9+/=]+)";', svg)
if not m:
    sys.exit("Kein eingebettetes CSS gefunden. Ist das ein SVGator-Export?")
css = base64.b64decode(m.group(1)).decode("utf-8")
dauern = set(re.findall(r"(\d+)ms linear", css))
css = re.sub(r"\b%sms\b" % "3000", "%dms" % DAUER_MS, css)
svg = svg[: m.start()] + css + svg[m.end():]
svg = re.sub(r"<\?xml[^>]*\?>\s*", "", svg)
svg = re.sub(r"<sodipodi:namedview[^>]*/>\s*", "", svg, flags=re.S)
svg = re.sub(r'\s(?:sodipodi|inkscape):[\w-]+="[^"]*"', "", svg)
svg = re.sub(r'\sxmlns:(?:inkscape|sodipodi|svg)="[^"]*"', "", svg)
kopf = (
    "<!-- Animiertes Logo für das Lade-Logo (layouts/_partials/lade-logo.html).\n"
    "     Quelle: LOGO.svg (SVGator, bearbeitet in Inkscape). Für die Seite angepasst mit\n"
    "     werkzeuge/logo-animiert.py: eingebettetes CSS ausgepackt (CSP), Dauer 3000ms -> %dms,\n"
    "     Inkscape-Metadaten entfernt. Siehe docs/betrieb.md, Abschnitt „Lade-Logo“. -->\n" % DAUER_MS
)
open(ziel, "w", encoding="utf-8").write(kopf + svg)
print("Fertig:", ziel, "| Dauern in der Quelle (ms):", ", ".join(sorted(dauern)) or "-")
