// Fruchtfolge Festival – kleine Helfer ohne externe Bibliotheken:
// 1. Hell/Dunkel-Knopf  2. Mobiles Menü  3. Lightbox für Galerien  4. Lade-Logo
(function () {
  var html = document.documentElement;
  var dunkelAbfrage = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  // ---------- 1. Hell/Dunkel ----------
  function istDunkel() {
    var t = html.getAttribute('data-theme');
    if (t === 'dark') return true;
    if (t === 'light') return false;
    return !!(dunkelAbfrage && dunkelAbfrage.matches);
  }
  function knopfAktualisieren() {
    var knopf = document.getElementById('theme-knopf');
    if (!knopf) return;
    var dunkel = istDunkel();
    var mond = knopf.querySelector('.ic-mond');
    var sonne = knopf.querySelector('.ic-sonne');
    if (mond) mond.hidden = dunkel;
    if (sonne) sonne.hidden = !dunkel;
    knopf.setAttribute('aria-label', dunkel ? 'Helles Design einschalten' : 'Dunkles Design einschalten');
  }
  function setzeTheme(wert) {
    if (wert) html.setAttribute('data-theme', wert); else html.removeAttribute('data-theme');
    try { if (wert) localStorage.setItem('fff-theme', wert); else localStorage.removeItem('fff-theme'); } catch (e) {}
    knopfAktualisieren();
    document.dispatchEvent(new CustomEvent('fff-theme'));
  }
  window.fffSetzeTheme = setzeTheme; // wird von der Design-Werkstatt (nur Vorschau) genutzt

  // ---------- 2. Menü (Handy) ----------
  // Knopf unten rechts: oben auf der Seite "Menü", nach dem Scrollen ein runder Hamburger
  // (Klasse .rund), ganz oben wieder "Menü". Öffnet das Hauptmenü als Blatt von unten.
  // Am Desktop ist der Knopf per CSS ausgeblendet und das Menü steht normal im Kopf.
  function menue() {
    var knopf = document.getElementById('menue-knopf');
    var nav = document.getElementById('hauptmenue');
    var schleier = document.getElementById('menue-schleier');
    if (!knopf || !nav) return;
    var handy = window.matchMedia ? window.matchMedia('(max-width: 959px)') : null;

    function istOffen() { return knopf.getAttribute('aria-expanded') === 'true'; }
    function setze(offen, fokusZurueck) {
      knopf.setAttribute('aria-expanded', String(offen));
      knopf.setAttribute('aria-label', offen ? 'Menü schließen' : 'Menü öffnen');
      nav.classList.toggle('offen', offen);
      if (schleier) schleier.classList.toggle('an', offen);
      html.classList.toggle('menue-offen', offen);
      if (offen) {
        var erster = nav.querySelector('a');
        if (erster) erster.focus({ preventScroll: true });
      } else if (fokusZurueck) {
        knopf.focus();
      }
    }
    knopf.addEventListener('click', function () { setze(!istOffen(), false); });
    if (schleier) schleier.addEventListener('click', function () { setze(false, true); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a') && istOffen()) setze(false, false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && istOffen()) setze(false, true);
      // Tab-Taste bleibt im offenen Menü (Menü-Links + Schließen-Knopf)
      if (e.key === 'Tab' && istOffen()) {
        var ziele = Array.prototype.slice.call(nav.querySelectorAll('a')).concat([knopf]);
        var i = ziele.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); ziele[ziele.length - 1].focus(); }
        else if (!e.shiftKey && i === ziele.length - 1) { e.preventDefault(); ziele[0].focus(); }
      }
    });
    // Wechsel auf Desktop-Breite: Menü schließen
    if (handy && handy.addEventListener) handy.addEventListener('change', function (ev) { if (!ev.matches && istOffen()) setze(false, false); });

    // Morphen beim Scrollen
    var geplant = false;
    function form() {
      geplant = false;
      knopf.classList.toggle('rund', window.scrollY > 40);
    }
    window.addEventListener('scroll', function () {
      if (!geplant) { geplant = true; window.requestAnimationFrame(form); }
    }, { passive: true });
    form();
  }

  // ---------- 3. Lightbox ----------
  function lightbox() {
    var links = Array.prototype.slice.call(document.querySelectorAll('a[data-lightbox]'));
    if (!links.length || typeof HTMLDialogElement === 'undefined') return;
    var dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', 'Bildansicht');
    dlg.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button type="button" class="lb-close" aria-label="Schließen">✕</button>' +
      '<button type="button" class="lb-prev" aria-label="Vorheriges Bild">←</button>' +
      '<button type="button" class="lb-next" aria-label="Nächstes Bild">→</button>';
    document.body.appendChild(dlg);
    var img = dlg.querySelector('img');
    var cap = dlg.querySelector('figcaption');
    var gruppe = [];
    var pos = 0;
    var ausloeser = null;
    function zeige(i) {
      pos = (i + gruppe.length) % gruppe.length;
      var a = gruppe[pos];
      var vorschau = a.querySelector('img');
      img.src = a.getAttribute('href');
      img.alt = vorschau ? vorschau.alt : '';
      var teile = [];
      if (img.alt) teile.push(img.alt);
      if (a.dataset.credit) teile.push(a.dataset.credit);
      teile.push((pos + 1) + ' / ' + gruppe.length);
      cap.textContent = teile.join(' · ');
    }
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        var liste = a.closest('[data-galerie]');
        gruppe = liste ? Array.prototype.slice.call(liste.querySelectorAll('a[data-lightbox]')) : [a];
        ausloeser = a;
        zeige(gruppe.indexOf(a));
        dlg.showModal();
      });
    });
    dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
    dlg.querySelector('.lb-prev').addEventListener('click', function () { zeige(pos - 1); });
    dlg.querySelector('.lb-next').addEventListener('click', function () { zeige(pos + 1); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.tagName === 'FIGURE') dlg.close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') zeige(pos - 1);
      if (e.key === 'ArrowRight') zeige(pos + 1);
    });
    dlg.addEventListener('close', function () { img.removeAttribute('src'); if (ausloeser) ausloeser.focus(); });
  }

  // ---------- 4. Lade-Logo ----------
  // Ob es läuft, entscheidet theme.js (Klasse lade-logo an <html>). Ablauf:
  // Logo wächst (Animation in der SVG-Datei, sichtbar fertig nach ANIMATION ms). Sind Animation
  // UND Seite fertig, fliegt es auf das Logo im Kopf (FLIP) und der Hintergrund blendet aus.
  // Dauert das Laden länger, pulsiert das fertige Logo leicht, höchstens bis HOECHSTENS.
  // Tippen, Klicken, Scrollen oder eine Taste überspringen. Kommt die SVG-Datei zu spät,
  // blendet nur der Hintergrund aus. Notbremse ohne JavaScript-Ablauf: CSS-Animation in main.css.
  function ladeLogo() {
    if (!html.classList.contains('lade-logo')) return;
    var ANIMATION = 1140, HOECHSTENS = 2500, BILD_BIS = 1200, FLUG = 700;
    var lader = document.getElementById('lader');
    var flug = lader && lader.querySelector('.lader-logo');
    var bild = flug && flug.querySelector('img');
    var ziel = document.querySelector('.top .brand img');
    var EREIGNISSE = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    var start = null, geladen = document.readyState === 'complete', los = false, uhren = [];

    function aufraeumen() {
      uhren.forEach(clearTimeout);
      EREIGNISSE.forEach(function (t) { window.removeEventListener(t, ueberspringen, true); });
      html.classList.remove('lade-logo');
    }
    if (!lader || !bild || !ziel || !lader.animate) { aufraeumen(); return; }

    function ausblenden() {
      if (los) return;
      los = true;
      lader.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }).onfinish = aufraeumen;
    }
    function andocken() {
      if (los) return;
      los = true;
      // Abgekürzt? Dann beim Fliegen ins fertige Logo überblenden.
      if (performance.now() < start + ANIMATION) {
        var ende = document.createElement('img');
        ende.className = 'lader-ende';
        ende.alt = '';
        ende.src = ziel.currentSrc || ziel.src;
        flug.appendChild(ende);
        ende.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, fill: 'forwards' });
      }
      var von = flug.getBoundingClientRect();
      var nach = ziel.getBoundingClientRect();
      var weg = 'translate(' + (nach.left - von.left) + 'px,' + (nach.top - von.top) + 'px) scale(' + (nach.width / von.width) + ')';
      lader.querySelector('.lader-grund').animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450, delay: 120, easing: 'ease-out', fill: 'forwards' });
      flug.animate([{ transform: 'none' }, { transform: weg }], { duration: FLUG, easing: 'cubic-bezier(.65,0,.25,1)', fill: 'forwards' }).onfinish = aufraeumen;
    }
    function pruefen() {
      if (los) return;
      var jetzt = performance.now();
      if (start === null) { if (jetzt >= BILD_BIS) ausblenden(); return; }
      var animationFertig = jetzt >= start + ANIMATION;
      if ((animationFertig && geladen) || jetzt >= HOECHSTENS) andocken();
      else if (animationFertig) flug.classList.add('atmet');
    }
    function spaeter(zeitpunkt) { uhren.push(setTimeout(pruefen, Math.max(0, zeitpunkt - performance.now()) + 5)); }
    function bildDa() {
      if (start !== null) return;
      // War die Datei schon da, bevor dieses Skript lief, läuft die Animation schon etwas.
      var eintrag = performance.getEntriesByName ? performance.getEntriesByName(bild.currentSrc || bild.src)[0] : null;
      start = eintrag && eintrag.responseEnd > 0 ? Math.min(eintrag.responseEnd, performance.now()) : performance.now();
      spaeter(start + ANIMATION);
      pruefen();
    }
    function ueberspringen() { if (start === null) ausblenden(); else andocken(); }

    EREIGNISSE.forEach(function (t) { window.addEventListener(t, ueberspringen, { capture: true, passive: true }); });
    if (bild.complete && bild.naturalWidth) bildDa(); else bild.addEventListener('load', bildDa);
    bild.addEventListener('error', ausblenden);
    if (!geladen) window.addEventListener('load', function () { geladen = true; pruefen(); });
    spaeter(BILD_BIS);
    spaeter(HOECHSTENS);
  }

  function start() {
    ladeLogo();
    var knopf = document.getElementById('theme-knopf');
    if (knopf) knopf.addEventListener('click', function () { setzeTheme(istDunkel() ? 'light' : 'dark'); });
    if (dunkelAbfrage && dunkelAbfrage.addEventListener) dunkelAbfrage.addEventListener('change', knopfAktualisieren);
    knopfAktualisieren();
    menue();
    lightbox();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
