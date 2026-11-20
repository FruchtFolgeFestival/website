// Design-Werkstatt – NUR in der Vorschau (dev) und lokal, nie in Produktion.
// Setzt Design-Varianten als Attribute an <html> (data-w-…), merkt sie sich im Browser
// und zeigt unten rechts eine Leiste zum Umschalten. Ohne Auswahl gilt das freigegebene Design.
(function () {
  var html = document.documentElement;
  var KEY = 'fff-werkstatt';

  // Optionen: [Wert, Beschriftung]. Der erste Wert ist jeweils das freigegebene Design (★).
  var OPTIONEN = [
    { name: 'dark', titel: 'Dunkles Design', hinweis: 'Gilt, wenn die Seite dunkel ist.', werte: [['zwielicht', 'Zwielicht'], ['glut', 'Glut'], ['aubergine', 'Aubergine']] },
    { name: 'font', titel: 'Schriftpaar', werte: [['psych', 'Psych 70s'], ['plakat', 'Plakat'], ['punk', 'Punk-Flyer'], ['hof', 'Hof-Groteske']] },
    { name: 'hero', titel: 'Startbereich', werte: [['foto', 'Foto-Duoton'], ['logo', 'Logo groß'], ['typo', 'Riesen-Typo']] },
    { name: 'divider', titel: 'Trenner', werte: [['welle', 'Welle'], ['doppel', 'Doppelwelle'], ['schichten', 'Psych-Schichten'], ['huegel', 'Hügel'], ['papier', 'Gerissenes Papier'], ['zacken', 'Zackenschere'], ['furchen', 'Ackerfurchen'], ['schlicht', 'Schlicht']] },
    { name: 'corners', titel: 'Ecken', werte: [['blob', 'Lavalampe'], ['eckig', 'Eckig'], ['rund', 'Rund'], ['bogen', '70er-Bogen']] },
    { name: 'shadow', titel: 'Schatten', werte: [['regenbogen', 'Regenbogen-Stapel'], ['flach', 'Flach'], ['versatz', 'Siebdruck-Versatz'], ['neon', 'Neon-Glühen']] },
    { name: 'photos', titel: 'Fotos', werte: [['original', 'Original'], ['duoton', 'Duoton']] },
    { name: 'grain', titel: 'Papier-Körnung', werte: [['an', 'An'], ['aus', 'Aus']] },
    { name: 'tilt', titel: 'Sticker', werte: [['schraeg', 'Schräg'], ['gerade', 'Gerade']] }
  ];

  function lesen() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function speichern(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }
  // Varianten anwenden: nur Abweichungen vom Standard werden als Attribut gesetzt.
  function anwenden(s) {
    OPTIONEN.forEach(function (o) {
      var wert = s[o.name];
      if (wert && wert !== o.werte[0][0]) html.setAttribute('data-w-' + o.name, wert);
      else html.removeAttribute('data-w-' + o.name);
    });
  }
  var stand = lesen();
  anwenden(stand); // sofort, damit nichts flackert

  function themeJetzt() {
    var t = html.getAttribute('data-theme');
    return t === 'dark' ? 'dunkel' : t === 'light' ? 'hell' : 'geraet';
  }
  function istDunkel() {
    var t = html.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function zusammenfassung() {
    var zeilen = ['Design-Auswahl Fruchtfolge (Vorschau)'];
    var themeNamen = { hell: 'Hell (Klee & Acker)', dunkel: 'Dunkel', geraet: 'Wie das Gerät' };
    zeilen.push('Hell/Dunkel: ' + themeNamen[themeJetzt()]);
    OPTIONEN.forEach(function (o) {
      var wert = stand[o.name] || o.werte[0][0];
      var paar = o.werte.filter(function (w) { return w[0] === wert; })[0] || o.werte[0];
      zeilen.push(o.titel + ': ' + paar[1] + (wert === o.werte[0][0] ? ' ★' : ''));
    });
    zeilen.push('Seite: ' + location.pathname);
    return zeilen.join('\n');
  }

  function chip(gruppe, wert, text, aktiv, stern) {
    var id = 'ws-' + gruppe + '-' + wert;
    return '<input type="radio" name="ws-' + gruppe + '" id="' + id + '" value="' + wert + '"' + (aktiv ? ' checked' : '') + '>' +
      '<label for="' + id + '">' + text + (stern ? ' <span class="ws-star">★</span>' : '') + '</label>';
  }

  function bauen() {
    var start = document.createElement('button');
    start.type = 'button';
    start.className = 'ws-start';
    start.textContent = 'Design-Werkstatt';
    start.setAttribute('aria-expanded', 'false');
    start.setAttribute('aria-controls', 'ws-panel');

    var panel = document.createElement('div');
    panel.className = 'ws-panel';
    panel.id = 'ws-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Design-Werkstatt');

    var teile = [];
    teile.push('<div class="ws-head"><strong>Design-Werkstatt</strong><button type="button" class="ws-btn" data-ws="zu">Schließen</button></div>');
    teile.push('<div class="ws-body">');
    teile.push('<p class="ws-intro">Nur in der Vorschau sichtbar. Deine Auswahl gilt nur in diesem Browser und ändert die echte Seite nicht. ★ = freigegebenes Design.</p>');
    teile.push('<form class="ws-form">');
    var th = themeJetzt();
    teile.push('<fieldset><legend>Hell oder dunkel</legend><div class="ws-chips">' +
      chip('theme', 'geraet', 'Wie das Gerät', th === 'geraet', true) +
      chip('theme', 'hell', 'Hell', th === 'hell', false) +
      chip('theme', 'dunkel', 'Dunkel', th === 'dunkel', false) + '</div></fieldset>');
    OPTIONEN.forEach(function (o) {
      var aktuell = stand[o.name] || o.werte[0][0];
      var chips = o.werte.map(function (w, i) { return chip(o.name, w[0], w[1], w[0] === aktuell, i === 0); }).join('');
      teile.push('<fieldset><legend>' + o.titel + '</legend><div class="ws-chips">' + chips + '</div></fieldset>');
    });
    teile.push('</form>');
    teile.push('<label class="ws-intro" for="ws-text">Deine Auswahl</label><textarea id="ws-text" readonly></textarea>');
    teile.push('<div class="ws-actions"><button type="button" class="ws-btn ws-primary" data-ws="kopieren">Auswahl kopieren</button><button type="button" class="ws-btn" data-ws="zurueck">Freigegebenes Design</button></div>');
    teile.push('<p class="ws-status" role="status"></p>');
    teile.push('</div>');
    panel.innerHTML = teile.join('');

    document.body.appendChild(start);
    document.body.appendChild(panel);

    var text = panel.querySelector('#ws-text');
    var status = panel.querySelector('.ws-status');
    var form = panel.querySelector('.ws-form');
    function aktualisieren() { text.value = zusammenfassung(); }
    aktualisieren();

    function oeffnen(auf) {
      panel.hidden = !auf;
      start.hidden = auf;
      start.setAttribute('aria-expanded', String(auf));
      if (auf) panel.querySelector('[data-ws="zu"]').focus(); else start.focus();
    }
    start.addEventListener('click', function () { oeffnen(true); });
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') oeffnen(false); });

    form.addEventListener('change', function (e) {
      var name = e.target.name.replace('ws-', '');
      var wert = e.target.value;
      if (name === 'theme') {
        if (window.fffSetzeTheme) window.fffSetzeTheme(wert === 'dunkel' ? 'dark' : wert === 'hell' ? 'light' : null);
      } else {
        stand[name] = wert;
        speichern(stand);
        anwenden(stand);
        // Wer eine dunkle Mischung wählt, will sie auch sehen
        if (name === 'dark' && !istDunkel() && window.fffSetzeTheme) {
          window.fffSetzeTheme('dark');
          var d = form.querySelector('#ws-theme-dunkel'); if (d) d.checked = true;
        }
      }
      status.textContent = '';
      aktualisieren();
    });
    document.addEventListener('fff-theme', function () {
      var el = form.querySelector('#ws-theme-' + themeJetzt()); if (el) el.checked = true;
      aktualisieren();
    });

    panel.addEventListener('click', function (e) {
      var aktion = e.target.getAttribute && e.target.getAttribute('data-ws');
      if (aktion === 'zu') oeffnen(false);
      if (aktion === 'zurueck') {
        stand = {}; speichern(stand); anwenden(stand);
        OPTIONEN.forEach(function (o) { var el = form.querySelector('#ws-' + o.name + '-' + o.werte[0][0]); if (el) el.checked = true; });
        status.textContent = 'Zurück auf dem freigegebenen Design.';
        aktualisieren();
      }
      if (aktion === 'kopieren') {
        var fallback = function () { text.focus(); text.select(); status.textContent = 'Text ist markiert: jetzt mit Strg+C bzw. ⌘+C kopieren.'; };
        try {
          navigator.clipboard.writeText(text.value).then(function () { status.textContent = 'Kopiert. Schick es einem Admin.'; }, fallback);
        } catch (err) { fallback(); }
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bauen); else bauen();
})();
