// BoothDesigner – Sprache der Webseite und des Studios (Deutsch, Englisch, Türkisch, Französisch, Spanisch, Italienisch).
// Die Seiten sind auf Deutsch geschrieben; i18n.js übersetzt alles Sichtbare mit den Wörterbüchern lang/<sprache>.js.
// Wahl: ?lang=xx im Link, sonst die zuletzt gewählte (localStorage „bd-lang“), sonst die Sprache des Browsers (unbekannt → Englisch).
// Ein Element mit data-lang-picker bekommt den Umschalter. Einbinden nach i18n.js:
//   <script src="i18n.js"></script><script src="sprache.js" data-base=""></script>   (im Studio data-base="../")
(function () {
  'use strict';
  const I = window.I18N; if (!I) return;
  const me = document.currentScript, base = (me && me.dataset.base) || '';
  const KEY = 'bd-lang';
  const q = new URLSearchParams(location.search).get('lang');
  let saved = null; try { saved = localStorage.getItem(KEY); } catch (e) {}
  let lang = [q, saved].find((c) => c && I.CODES.includes(c)) || I.guess('en');
  window.I18N_V = '20261025-5'; // Version der Wörterbücher (lang/*.js?v=…) – bei Änderungen anheben

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
    btn.type = 'button'; btn.className = 'lang-btn'; btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-label', 'Sprache');
    btn.innerHTML = I.flag(cur.code, 16) + '<span>' + cur.code.toUpperCase() + '</span>';
    const list = document.createElement('div'); list.className = 'lang-list'; list.hidden = true; list.setAttribute('role', 'listbox');
    I.LANGS.forEach((l) => {
      const o = document.createElement('button'); o.type = 'button'; o.setAttribute('role', 'option');
      o.setAttribute('aria-selected', String(l.code === lang));
      o.innerHTML = I.flag(l.code, 16) + '<span></span>'; o.querySelector('span').textContent = l.name;
      o.onclick = () => { list.hidden = true; set(l.code); };
      list.appendChild(o);
    });
    btn.onclick = (e) => { e.stopPropagation(); list.hidden = !list.hidden; };
    document.addEventListener('click', () => { list.hidden = true; });
    box.append(btn, list);
  }
  async function set(code) {
    lang = code; try { localStorage.setItem(KEY, code); } catch (e) {}
    await I.load(code, base);
    apply();
  }
  if (!document.getElementById('lang-css')) {
    const st = document.createElement('style'); st.id = 'lang-css';
    st.textContent = '.lang-pick{position:relative;display:inline-flex}'
      + '.lang-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 10px;border-radius:9px;border:1px solid rgba(128,128,128,.35);background:transparent;color:inherit;font:inherit;font-size:13px;font-weight:600;cursor:pointer}'
      + '.lang-list{position:absolute;right:0;top:calc(100% + 6px);z-index:60;min-width:160px;display:grid;padding:6px;border-radius:10px;background:#fff;color:#1d1d24;border:1px solid #e3e1da;box-shadow:0 14px 40px rgba(0,0,0,.18)}'
      + '.lang-list[hidden]{display:none}'
      + '.lang-list button{display:flex;align-items:center;gap:9px;padding:8px 10px;border:0;background:none;border-radius:7px;font:inherit;font-size:14px;color:inherit;text-align:left;cursor:pointer}'
      + '.lang-list button:hover,.lang-list button[aria-selected="true"]{background:#f3f0e8}';
    document.head.appendChild(st);
  }
  window.BD_LANG = { get: () => lang, set };
  const start = async () => {
    await I.load(lang, base);
    I.watch(document.body, () => lang);
    apply();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
