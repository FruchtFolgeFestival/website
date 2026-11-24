// Design-Werkstatt – NUR in der Vorschau (dev) und lokal, nie in Produktion.
// Setzt Design-Varianten als Attribute an <html> (data-w-…) und eigene Farben als CSS-Variablen
// (inline an <html>, das erlaubt die CSP) und merkt sich beides im Browser.
// Der Knopf sitzt im Vorschau-Banner (layouts/_partials/vorschau-banner.html), die Leiste
// klappt direkt darunter auf. Ohne Auswahl gilt das freigegebene Design.
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

  // ---------- Farben ----------
  // Liste aus layouts/_partials/farben/liste.html (im <head> als JSON). Eigene Farben gelten nur
  // für das gerade sichtbare Schema (hell/dunkel) und werden inline an <html> gesetzt.
  var FARBEN = null;
  try { FARBEN = JSON.parse(document.getElementById('ws-farben-daten').textContent); } catch (e) {}
  var HEX = /^#[0-9a-f]{6}$/;
  function schemaJetzt() { return istDunkel() ? 'dunkel' : 'hell'; }
  function eigeneFarben(schema) { return (stand.farben && stand.farben[schema]) || {}; }
  function farbenAnwenden() {
    if (!FARBEN) return;
    var eigene = eigeneFarben(schemaJetzt());
    FARBEN.farben.forEach(function (f) {
      if (eigene[f.feld]) html.style.setProperty(f.token, eigene[f.feld]);
      else html.style.removeProperty(f.token);
    });
  }
  // Aktueller Wert einer Farbe (eigene Wahl oder das, was das Stylesheet gerade setzt)
  function farbWert(f) {
    var v = (getComputedStyle(html).getPropertyValue(f.token) || '').trim().toLowerCase();
    if (/^#[0-9a-f]{3}$/.test(v)) v = '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3];
    return HEX.test(v) ? v : '#000000';
  }
  function helligkeit(hex) {
    return [1, 3, 5].reduce(function (summe, pos, i) {
      var c = parseInt(hex.substr(pos, 2), 16) / 255;
      c = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      return summe + c * [0.2126, 0.7152, 0.0722][i];
    }, 0);
  }
  function kontrast(a, b) {
    var la = helligkeit(a), lb = helligkeit(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }
  farbenAnwenden();

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
    if (FARBEN) {
      ['hell', 'dunkel'].forEach(function (schema) {
        var eigene = eigeneFarben(schema);
        var namen = Object.keys(eigene);
        if (!namen.length) return;
        zeilen.push('Farben ' + (schema === 'hell' ? 'Hell' : 'Dunkel') + ' (CMS → Design-Farben → ' + (schema === 'hell' ? 'Hell' : 'Dunkel') + '):');
        FARBEN.farben.forEach(function (f) { if (eigene[f.feld]) zeilen.push('  ' + f.label + ': ' + eigene[f.feld]); });
      });
    }
    zeilen.push('Seite: ' + location.pathname);
    return zeilen.join('\n');
  }

  function chip(gruppe, wert, text, aktiv, stern) {
    var id = 'ws-' + gruppe + '-' + wert;
    return '<input type="radio" name="ws-' + gruppe + '" id="' + id + '" value="' + wert + '"' + (aktiv ? ' checked' : '') + '>' +
      '<label for="' + id + '">' + text + (stern ? ' <span class="ws-star">★</span>' : '') + '</label>';
  }

  function bauen() {
    var start = document.getElementById('ws-knopf');
    var banner = document.querySelector('.preview-banner');
    if (!start || !banner) return;

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
    if (FARBEN) {
      teile.push('<div class="ws-farben" role="group" aria-labelledby="ws-farben-titel">');
      teile.push('<p class="ws-legend" id="ws-farben-titel">Farben – <span data-ws-schema></span></p>');
      teile.push('<p class="ws-intro">Ändert nur das gerade sichtbare Schema. Oben auf Hell oder Dunkel stellen, um das andere zu bearbeiten. Übernehmen: kopieren und im CMS unter „Design-Farben“ eintragen.</p>');
      teile.push('<div class="ws-farbliste">');
      FARBEN.farben.forEach(function (f) {
        teile.push('<label class="ws-farbe"><input type="color" data-feld="' + f.feld + '"><span>' + f.label + '</span><code data-ws-code="' + f.feld + '"></code></label>');
      });
      teile.push('</div>');
      teile.push('<ul class="ws-kontrast" aria-live="polite"></ul>');
      teile.push('<div class="ws-actions"><button type="button" class="ws-btn" data-ws="farben-zurueck">Farben zurücksetzen</button></div>');
      teile.push('</div>');
    }
    teile.push('<label class="ws-intro" for="ws-text">Deine Auswahl</label><textarea id="ws-text" readonly></textarea>');
    teile.push('<div class="ws-actions"><button type="button" class="ws-btn ws-primary" data-ws="kopieren">Auswahl kopieren</button><button type="button" class="ws-btn" data-ws="zurueck">Freigegebenes Design</button>' +
      (html.hasAttribute('data-lade-logo') ? '<button type="button" class="ws-btn" data-ws="lade-logo">Lade-Logo zeigen</button>' : '') + '</div>');
    teile.push('<p class="ws-status" role="status"></p>');
    teile.push('</div>');
    panel.innerHTML = teile.join('');

    (banner.querySelector('.pb-inner') || banner).appendChild(panel);

    var text = panel.querySelector('#ws-text');
    var status = panel.querySelector('.ws-status');
    var form = panel.querySelector('.ws-form');
    var farbBox = panel.querySelector('.ws-farben');
    function farbenZeigen() {
      if (!farbBox) return;
      var schema = schemaJetzt();
      var eigene = eigeneFarben(schema);
      farbBox.querySelector('[data-ws-schema]').textContent = schema === 'hell' ? 'Hell' : 'Dunkel';
      var werte = {};
      FARBEN.farben.forEach(function (f) {
        werte[f.feld] = farbWert(f);
        var input = farbBox.querySelector('input[data-feld="' + f.feld + '"]');
        input.value = werte[f.feld];
        var code = farbBox.querySelector('[data-ws-code="' + f.feld + '"]');
        code.textContent = werte[f.feld] + (eigene[f.feld] ? ' ✎' : '');
      });
      var namen = {};
      FARBEN.farben.forEach(function (f) { namen[f.feld] = f.label; });
      var probleme = FARBEN.paare.map(function (p) {
        var k = kontrast(werte[p[0]], werte[p[1]]);
        return k < FARBEN.minimum ? '<li class="ws-schlecht">✗ ' + namen[p[0]] + ' auf ' + namen[p[1]] + ': ' + k.toFixed(1).replace('.', ',') + ' : 1</li>' : '';
      }).join('');
      farbBox.querySelector('.ws-kontrast').innerHTML = probleme ||
        '<li class="ws-gut">✓ Alle Kontraste mindestens 4,5 : 1</li>';
    }
    function aktualisieren() { text.value = zusammenfassung(); farbenZeigen(); }
    aktualisieren();
    if (farbBox) {
      farbBox.addEventListener('input', function (e) {
        var feld = e.target.getAttribute('data-feld');
        if (!feld) return;
        var schema = schemaJetzt();
        stand.farben = stand.farben || {};
        stand.farben[schema] = stand.farben[schema] || {};
        stand.farben[schema][feld] = e.target.value.toLowerCase();
        speichern(stand);
        farbenAnwenden();
        status.textContent = '';
        aktualisieren();
      });
    }
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var beiWechsel = function () { farbenAnwenden(); aktualisieren(); };
      if (mq.addEventListener) mq.addEventListener('change', beiWechsel); else if (mq.addListener) mq.addListener(beiWechsel);
    }

    function oeffnen(auf, fokus) {
      panel.hidden = !auf;
      start.setAttribute('aria-expanded', String(auf));
      if (auf) panel.querySelector('[data-ws="zu"]').focus(); else if (fokus) start.focus();
    }
    start.addEventListener('click', function () { oeffnen(panel.hidden, false); });
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') oeffnen(false, true); });
    // Klick außerhalb schließt die Leiste
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !panel.contains(e.target) && !start.contains(e.target)) oeffnen(false, false);
    });

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
      farbenAnwenden();
      aktualisieren();
    });

    panel.addEventListener('click', function (e) {
      var aktion = e.target.getAttribute && e.target.getAttribute('data-ws');
      if (aktion === 'zu') oeffnen(false, true);
      if (aktion === 'lade-logo') {
        // Seite neu öffnen, als käme man von außen (theme.js wertet ?lade-logo aus)
        location.href = location.pathname + '?lade-logo';
      }
      if (aktion === 'farben-zurueck') {
        if (stand.farben) delete stand.farben[schemaJetzt()];
        speichern(stand); farbenAnwenden();
        status.textContent = 'Farben zurückgesetzt (' + (schemaJetzt() === 'hell' ? 'Hell' : 'Dunkel') + ').';
        aktualisieren();
      }
      if (aktion === 'zurueck') {
        stand = {}; speichern(stand); anwenden(stand); farbenAnwenden();
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
