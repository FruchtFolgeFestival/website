// Hell/Dunkel: Setzt die gespeicherte Wahl, bevor die Seite gezeichnet wird (kein Flackern).
// Ohne gespeicherte Wahl entscheidet die Einstellung des Geräts (CSS prefers-color-scheme).
// Außerdem: Entscheidung, ob das Lade-Logo gezeigt wird (muss ebenfalls vor dem ersten Zeichnen passieren).
(function () {
  var html = document.documentElement;
  html.classList.remove('no-js');
  html.classList.add('js');
  try {
    var wahl = localStorage.getItem('fff-theme');
    if (wahl === 'light' || wahl === 'dark') html.setAttribute('data-theme', wahl);
  } catch (e) { /* Speicher gesperrt: dann eben ohne */ }

  // Lade-Logo (layouts/_partials/lade-logo.html, Ablauf in site.js): nur beim Ankommen von außen
  // (Suchmaschine, Instagram, Lesezeichen), nicht bei Klicks innerhalb der Seite, Neuladen oder
  // Zurück, nie bei „Bewegung reduzieren“. Kommt ohne Speichern im Browser aus.
  // ?lade-logo in der Adresse zeigt es immer (zum Testen, Knopf in der Design-Werkstatt).
  try {
    if (html.hasAttribute('data-lade-logo')) {
      var ruhig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var nav = performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
      var neu = !nav || nav.type === 'navigate';
      var vonUns = document.referrer.indexOf(location.origin + '/') === 0;
      var test = /[?&]lade-logo(&|=|$)/.test(location.search);
      if (!ruhig && (test || (neu && !vonUns))) html.classList.add('lade-logo');
    }
  } catch (e) { /* dann eben ohne Lade-Logo */ }
})();
