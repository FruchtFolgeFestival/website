# Archiv der alten WordPress-Seite

Dieser Ordner wird **nicht** ausgeliefert. Er liegt außerhalb von `content/`, `static/` und `assets/`, deshalb nimmt Hugo ihn nicht in die Webseite auf.

Er enthält die Originaldaten der alten Seite <https://fruchtfolge.live/> (WordPress/Elementor bei Bluehost), abgerufen am 20.11.2026 über die WordPress-REST-API:

| Datei | Inhalt | Quelle |
|---|---|---|
| `pages.json` | alle 13 veröffentlichten Seiten inkl. HTML-Inhalt | `/wp-json/wp/v2/pages?per_page=100` |
| `media.json` | alle 91 Einträge der Mediathek (Bilder, PDF) | `/wp-json/wp/v2/media?per_page=100` |
| `posts.json` | die 7 Beiträge (nur Demo-Inhalte, nicht übernommen) | `/wp-json/wp/v2/posts?per_page=100` |

Die Ganzseiten-Screenshots der alten Startseite liegen als Bilder unter `assets/images/uploads/2026/alte-webseite-*.jpg` und sind auf der Seite `/festivals/2026/` eingebunden.

Was übernommen wurde und was nicht, steht in [`docs/migration.md`](../docs/migration.md).

**Wichtig:** Vor dem Abschalten von Bluehost zusätzlich einen vollständigen WordPress-Export (Werkzeuge → Daten exportieren) und eine Sicherung der Mediathek (`wp-content/uploads`) machen. Die REST-API-Daten hier enthalten nicht alles (z. B. keine Elementor-Einstellungen, keine Nutzerkonten, keine Formulardaten).
