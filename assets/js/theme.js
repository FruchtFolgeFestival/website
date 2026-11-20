// Hell/Dunkel: Setzt die gespeicherte Wahl, bevor die Seite gezeichnet wird (kein Flackern).
// Ohne gespeicherte Wahl entscheidet die Einstellung des Geräts (CSS prefers-color-scheme).
(function () {
  var html = document.documentElement;
  html.classList.remove('no-js');
  html.classList.add('js');
  try {
    var wahl = localStorage.getItem('fff-theme');
    if (wahl === 'light' || wahl === 'dark') html.setAttribute('data-theme', wahl);
  } catch (e) { /* Speicher gesperrt: dann eben ohne */ }
})();
