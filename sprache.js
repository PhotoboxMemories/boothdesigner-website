// BoothDesigner – Sprache der Webseite und des Studios (Deutsch, Englisch, Türkisch, Französisch, Spanisch, Italienisch).
// Die Seiten sind auf Deutsch geschrieben; i18n.js übersetzt alles Sichtbare mit den Wörterbüchern lang/<sprache>.js.
// Seit 03.11.2026 baut website.py die Startseite zusätzlich fertig übersetzt unter /en/, /tr/, /fr/, /es/, /it/ (Suchmaschinen sehen
// jede Sprache unter einer eigenen Adresse, hreflang im <head>). Diese vorgebauten Seiten tragen data-seite="xx" am Skript:
// dort ist die Sprache fest, und der Umschalter führt zur Adresse der anderen Sprache (Wahl bleibt in localStorage „bd-lang“).
// Alle anderen Seiten (Rechtsseiten, Mein BoothDesigner, Studio) übersetzen wie bisher im Browser:
// ?lang=xx im Link, sonst die zuletzt gewählte Sprache, sonst die Sprache des Browsers (unbekannt → Englisch).
// Ein Element mit data-lang-picker bekommt den Umschalter. Einbinden nach i18n.js:
//   <script src="i18n.js"></script><script src="sprache.js" data-base=""></script>   (im Studio data-base="../")
(function () {
  'use strict';
  const I = window.I18N; if (!I) return;
  const me = document.currentScript, base = (me && me.dataset.base) || '';
  const fixed = me && me.dataset.seite && I.CODES.includes(me.dataset.seite) ? me.dataset.seite : ''; // vorgebaute Startseite
  const KEY = 'bd-lang';
  const q = new URLSearchParams(location.search).get('lang');
  let saved = null; try { saved = localStorage.getItem(KEY); } catch (e) {}
  const save = (code) => { saved = code; try { localStorage.setItem(KEY, code); } catch (e) {} };
  // Adresse der Startseite in einer Sprache (Deutsch ohne Unterordner)
  const home = (code) => (code === 'de' ? '/' : '/' + code + '/') + location.hash;
  let lang;
  if (fixed) {
    lang = fixed;
    if (q && I.CODES.includes(q) && q !== fixed) { save(q); location.replace(home(q)); return; } // alte Links mit ?lang=
    // Zuletzt gewählte Sprache: nur die deutsche Einstiegsseite leitet weiter, direkte Links auf /en/ usw. bleiben, wie sie sind
    if (!q && fixed === 'de' && saved && saved !== 'de' && I.CODES.includes(saved)) { location.replace(home(saved)); return; }
  } else {
    lang = [q, saved].find((c) => c && I.CODES.includes(c)) || I.guess('en');
  }
  window.I18N_V = '20261103-23'; // Version der Wörterbücher (lang/*.js?v=…) – bei Änderungen anheben

  let title0 = null; // Titel im Browser-Tab (steht nicht im <body>, den i18n.js beobachtet)
  function apply() {
    document.documentElement.lang = lang;
    if (title0 == null || document.title !== title0.out) title0 = { src: document.title, out: '' };
    title0.out = document.title = lang === 'de' ? title0.src : I.t(title0.src, lang);
    I.refresh();
    document.querySelectorAll('[data-lang-picker]').forEach(build);
  }
  function build(box) {
    const cur = I.info(lang);
    box.innerHTML = '';
    box.classList.add('lang-pick');
    box.setAttribute('translate', 'no');
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'lang-btn'; btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
    const WAHL = { de: 'Sprache wählen', en: 'Choose language', tr: 'Dil seç', fr: 'Choisir la langue', es: 'Elegir idioma', it: 'Scegli la lingua' };
    btn.innerHTML = I.flag(cur.code, 16) + '<span>' + cur.code.toUpperCase() + '</span><span class="sr-only"> – ' + (WAHL[lang] || WAHL.de) + '</span>';
    const list = document.createElement('div'); list.className = 'lang-list'; list.hidden = true; list.setAttribute('role', 'listbox'); list.setAttribute('aria-label', 'Sprache');
    const toggle = (on) => { list.hidden = !on; btn.setAttribute('aria-expanded', String(on)); };
    I.LANGS.forEach((l) => {
      const o = document.createElement('button'); o.type = 'button'; o.setAttribute('role', 'option'); o.lang = l.code;
      o.setAttribute('aria-selected', String(l.code === lang));
      o.innerHTML = I.flag(l.code, 16) + '<span></span>'; o.querySelector('span').textContent = l.name;
      o.onclick = () => { toggle(false); set(l.code); };
      list.appendChild(o);
    });
    btn.onclick = (e) => { e.stopPropagation(); toggle(list.hidden); if (!list.hidden) (list.querySelector('[aria-selected="true"]') || list.firstChild).focus(); };
    list.onkeydown = (e) => { if (e.key === 'Escape') { toggle(false); btn.focus(); } };
    document.addEventListener('click', () => toggle(false));
    box.append(btn, list);
  }
  async function set(code) {
    save(code);
    if (fixed) { location.href = home(code); return; } // vorgebaute Seite in der anderen Sprache
    lang = code;
    await I.load(code, base);
    apply();
  }
  // Sprach-Links im Fuß (<a data-lang="en" href="/en/">): die Wahl merken, der Link führt selbst zur Seite
  document.addEventListener('click', (e) => { const a = e.target.closest && e.target.closest('a[data-lang]'); if (a && I.CODES.includes(a.dataset.lang)) save(a.dataset.lang); });
  if (!document.getElementById('lang-css')) {
    const st = document.createElement('style'); st.id = 'lang-css';
    st.textContent = '.lang-pick{position:relative;display:inline-flex}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}'
      + '.lang-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 10px;border-radius:9px;border:1px solid rgba(128,128,128,.35);background:transparent;color:inherit;font:inherit;font-size:13px;font-weight:600;cursor:pointer}'
      + '.lang-list{position:absolute;right:0;top:calc(100% + 6px);z-index:60;min-width:160px;display:grid;padding:6px;border-radius:10px;background:#fff;color:#1d1d24;border:1px solid #e3e1da;box-shadow:0 14px 40px rgba(0,0,0,.18)}'
      + '.lang-list[hidden]{display:none}'
      + '.lang-list button{display:flex;align-items:center;gap:9px;padding:8px 10px;border:0;background:none;border-radius:7px;font:inherit;font-size:14px;color:inherit;text-align:left;cursor:pointer}'
      + '.lang-list button:hover,.lang-list button:focus-visible,.lang-list button[aria-selected="true"]{background:#f3f0e8}';
    document.head.appendChild(st);
  }
  // Hinweis auf die Seite in der Sprache des Browsers – nur auf den vorgebauten Startseiten und nur, solange keine Sprache gewählt
  // wurde. Keine automatische Weiterleitung: Besucher und Suchmaschinen sehen unter einer Adresse immer dieselbe Seite.
  const HINT = { de: 'Diese Seite gibt es auch auf Deutsch.', en: 'This page is also available in English.', tr: 'Bu sayfa Türkçe olarak da mevcut.',
    fr: 'Cette page existe aussi en français.', es: 'Esta página también está disponible en español.', it: 'Questa pagina è disponibile anche in italiano.' };
  function hint() {
    if (!fixed || saved) return;
    const g = I.guess(''); if (!g || g === fixed) return;
    try { if (localStorage.getItem('bd-lang-hinweis')) return; } catch (e) {}
    const bar = document.createElement('div'); bar.className = 'lang-hint'; bar.setAttribute('translate', 'no'); bar.lang = g; bar.setAttribute('role', 'status');
    const a = document.createElement('a'); a.href = home(g); a.hreflang = g; a.textContent = I.info(g).name + ' →'; a.onclick = () => save(g);
    const x = document.createElement('button'); x.type = 'button'; x.textContent = '×'; x.setAttribute('aria-label', { de: 'Schließen', en: 'Close', tr: 'Kapat', fr: 'Fermer', es: 'Cerrar', it: 'Chiudi' }[g]);
    x.onclick = () => { bar.remove(); try { localStorage.setItem('bd-lang-hinweis', '1'); } catch (e) {} };
    const t = document.createElement('span'); t.textContent = HINT[g];
    bar.append(t, a, x);
    document.body.appendChild(bar); // schwebend unter der Kopfzeile (position:fixed) – verschiebt nichts auf der Seite
  }
  window.BD_LANG = { get: () => lang, set };
  const start = async () => {
    await I.load(lang, base);
    I.watch(document.body, () => lang);
    apply(); hint();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
