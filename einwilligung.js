// Einwilligung für die Google-Ads-Messung (nur Startseite und Mein BoothDesigner – nie im Design-Studio der Kunden).
// Ohne Einwilligung wird nichts von Google geladen und kein Cookie gesetzt. Mit „Akzeptieren“ lädt gtag.js (Consent Mode v2,
// erst danach) und misst Abschlüsse: window.bdConversion('purchase', wert) nach dem Abo-Kauf, ('signup') nach der Registrierung.
// Einstellungen: window.STUDIO_CONFIG.googleAds = { id: 'AW-…', purchase: '<Label>', signup: '<Label>' } – fehlt die id,
// gibt es weder Banner noch Messung. Die Wahl steht im lokalen Speicher „bd-einwilligung“ ('ja' | 'nein'); ändern über
// window.bdCookieSettings() bzw. jeden Link mit data-cookie-settings.
(() => {
  'use strict';
  const G = (window.STUDIO_CONFIG || {}).googleAds, KEY = 'bd-einwilligung';
  const get = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const set = (v) => { try { localStorage.setItem(KEY, v); } catch (e) {} };
  window.bdConversion = () => {};
  window.bdCookieSettings = () => {};
  if (!G || !/^AW-\d+$/.test(G.id || '')) return;

  window.dataLayer = window.dataLayer || [];
  const gtag = function () { window.dataLayer.push(arguments); };
  window.gtag = gtag;
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
  let loaded = false;
  const load = () => {
    if (loaded) return; loaded = true;
    gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied' });
    const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(G.id);
    document.head.appendChild(s);
    gtag('js', new Date()); gtag('config', G.id);
  };
  const waiting = []; // Abschlüsse, die vor der Antwort auf das Banner kamen
  window.bdConversion = (kind, value) => {
    const label = G[kind]; if (!label) return;
    const send = () => gtag('event', 'conversion', { send_to: G.id + '/' + label, ...(value ? { value, currency: 'EUR' } : {}) });
    const c = get();
    if (c === 'ja') { load(); send(); } else if (!c) waiting.push(send);
  };

  // ---------- Banner (Betreiber 30.10.2026: „mach richtig gute Cookies“) ----------
  // Erste Ebene: „Nur notwendige“ und „Alle akzeptieren“ gleich groß nebeneinander (Ablehnen so einfach wie Zustimmen), dazu
  // „Einstellungen“ mit den beiden Kategorien als Schalter. Mehr Kategorien gibt es nicht – die Seite nutzt sonst keine Cookies.
  // Auf den Rechtsseiten (data-nur-einstellungen) erscheint kein Banner von selbst und Google wird nie geladen – dort lässt sich die
  // Wahl nur über „Cookie-Einstellungen“ ändern.
  const css = `.bd-consent{position:fixed;left:16px;bottom:16px;z-index:80;width:min(440px,calc(100vw - 32px));max-height:calc(100vh - 32px);overflow:auto;
    background:var(--paper,#fff);color:var(--ink,#1d1a14);border:1px solid var(--line,#e8e2d6);border-radius:20px;box-shadow:0 24px 60px rgba(0,0,0,.32);
    padding:20px;font-size:14px;line-height:1.5;animation:bdcIn .35s ease-out}
    @keyframes bdcIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
    @media (prefers-reduced-motion:reduce){.bd-consent{animation:none}}
    .bd-consent [hidden]{display:none!important}
    .bd-consent .bdc-top{display:flex;gap:12px;align-items:center;margin-bottom:8px}
    .bd-consent .bdc-ico{width:42px;height:42px;flex:none;border-radius:12px;display:grid;place-items:center;background:var(--gold-soft,#f6efe0);color:var(--gold,#b8892f)}
    .bd-consent .bdc-ico svg{width:26px;height:26px}
    .bd-consent h2{font:inherit;font-size:17px;font-weight:800;margin:0;line-height:1.25}
    .bd-consent p{margin:0 0 14px;color:var(--muted,#6b6253)}.bd-consent a{color:var(--gold,#b8892f);font-weight:600}
    .bd-consent .bdc-row{display:flex;gap:8px;flex-wrap:wrap}
    .bd-consent button{font:inherit;font-weight:700;border-radius:12px;padding:11px 14px;cursor:pointer;flex:1 1 140px;transition:filter .15s,background .15s}
    .bd-consent button:focus-visible,.bd-consent .bdc-sw input:focus-visible+span{outline:3px solid var(--gold,#b8892f);outline-offset:2px}
    .bd-consent .bdc-a{background:var(--gold,#b8892f);border:1px solid var(--gold,#b8892f);color:#fff}
    .bd-consent .bdc-b{background:var(--ink,#1d1a14);border:1px solid var(--ink,#1d1a14);color:var(--paper,#fff)}
    .bd-consent button:hover{filter:brightness(1.08)}
    .bd-consent .bdc-more{flex-basis:100%;background:none;border:0;padding:8px 0 0;color:var(--ink,#1d1a14);font-weight:600;text-decoration:underline;text-underline-offset:3px}
    .bd-consent .bdc-cats{display:grid;gap:8px;margin:0 0 14px}
    .bd-consent .bdc-cat{display:flex;gap:12px;align-items:flex-start;border:1px solid var(--line,#e8e2d6);border-radius:14px;padding:12px}
    .bd-consent .bdc-cat b{display:block;font-size:14.5px}.bd-consent .bdc-cat small{display:block;color:var(--muted,#6b6253);font-size:12.5px;line-height:1.45;margin-top:2px}
    .bd-consent .bdc-cat > div{flex:1}
    .bd-consent .bdc-always{font-size:11.5px;font-weight:700;white-space:nowrap;color:var(--gold,#b8892f);padding-top:2px}
    .bd-consent .bdc-sw{position:relative;flex:none;width:46px;height:26px;margin-top:2px}
    .bd-consent .bdc-sw input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}
    .bd-consent .bdc-sw span{position:absolute;inset:0;border-radius:999px;background:var(--line,#d9d2c4);transition:background .2s;pointer-events:none}
    .bd-consent .bdc-sw span::after{content:'';position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:transform .2s}
    .bd-consent .bdc-sw input:checked+span{background:var(--gold,#b8892f)}.bd-consent .bdc-sw input:checked+span::after{transform:translateX(20px)}
    .bd-consent .bdc-links{display:flex;gap:14px;margin-top:12px;font-size:12.5px}.bd-consent .bdc-links a{font-weight:500;color:var(--muted,#6b6253)}
    @media (max-width:560px){.bd-consent{left:8px;right:8px;bottom:8px;width:auto;border-radius:18px;padding:18px}}`;
  const base = document.currentScript && document.currentScript.src ? new URL('.', document.currentScript.src).href : '/';
  const onlySettings = !!(document.currentScript && document.currentScript.hasAttribute('data-nur-einstellungen'));
  const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M21 12.3A9 9 0 1 1 11.7 3a3 3 0 0 0 3.8 3.8 3 3 0 0 0 3.7 3.7 3 3 0 0 0 1.8 1.8z"/><circle cx="8.5" cy="10.5" r="1" fill="currentColor"/>'
    + '<circle cx="12" cy="15.5" r="1" fill="currentColor"/><circle cx="16" cy="13" r=".8" fill="currentColor"/><circle cx="8" cy="15" r=".6" fill="currentColor"/></svg>';
  const choose = (yes) => {
    const was = get() === 'ja';
    set(yes ? 'ja' : 'nein'); document.querySelectorAll('.bd-consent').forEach((b) => b.remove());
    if (yes) { if (!onlySettings) { load(); waiting.splice(0).forEach((f) => f()); } return; }
    waiting.length = 0;
    if (was) { // Zustimmung zurückgezogen: Google-Cookies dieser Seite löschen und neu laden, damit nichts mehr läuft
      document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => /^_gcl|^_ga|^_gac/.test(n))
        .forEach((n) => { document.cookie = n + '=; Max-Age=0; path=/'; document.cookie = n + '=; Max-Age=0; path=/; domain=.' + location.hostname.replace(/^www\./, ''); });
      if (!onlySettings) location.reload();
    }
  };
  function show(fromLink) {
    const old = document.querySelector('.bd-consent'); if (old) { old.querySelector('button').focus(); return; }
    if (!document.getElementById('bd-consent-css')) { const st = document.createElement('style'); st.id = 'bd-consent-css'; st.textContent = css; document.head.appendChild(st); }
    const box = document.createElement('div'); box.className = 'bd-consent';
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-labelledby', 'bdc-title'); box.setAttribute('aria-describedby', 'bdc-text');
    box.innerHTML = `<div class="bdc-top"><span class="bdc-ico">${ICON}</span><h2 id="bdc-title">Cookies? Nur, wenn du willst.</h2></div>`
      + '<p id="bdc-text">BoothDesigner funktioniert ohne Cookies. Mit deiner Zustimmung messen wir über Google Ads, ob unsere Werbung zu Anmeldungen und Abos führt – mehr nicht.</p>'
      + '<div class="bdc-cats" hidden>'
      + '<div class="bdc-cat"><div><b>Notwendig</b><small>Damit die Seite funktioniert: deine Anmeldung, die Sprache und diese Auswahl. Nur in deinem Browser gespeichert, ohne Cookies.</small></div><span class="bdc-always">Immer aktiv</span></div>'
      + '<label class="bdc-cat"><div><b>Werbung messen (Google Ads)</b><small>Zeigt uns, ob jemand über unsere Anzeige gekommen ist und sich danach registriert oder ein Abo bucht. Google setzt dafür Cookies (bis zu 90 Tage). Keine personalisierte Werbung.</small></div>'
      + '<span class="bdc-sw"><input type="checkbox" id="bdc-ads"><span></span></span></label></div>'
      + '<div class="bdc-row bdc-first"><button type="button" class="bdc-b" data-c="nein">Nur notwendige</button><button type="button" class="bdc-a" data-c="ja">Alle akzeptieren</button>'
      + '<button type="button" class="bdc-more">Einstellungen</button></div>'
      + '<div class="bdc-row bdc-second" hidden><button type="button" class="bdc-b" data-c="auswahl">Auswahl speichern</button><button type="button" class="bdc-a" data-c="ja">Alle akzeptieren</button></div>'
      + '<div class="bdc-links"><a data-l="datenschutz.html#cookies">Datenschutz</a><a data-l="impressum.html">Impressum</a></div>';
    box.querySelectorAll('[data-l]').forEach((a) => { a.href = base + a.dataset.l; });
    box.querySelector('#bdc-ads').checked = get() === 'ja';
    const details = (on) => {
      box.querySelector('.bdc-cats').hidden = !on; box.querySelector('.bdc-second').hidden = !on; box.querySelector('.bdc-first').hidden = on;
      if (on) box.querySelector('#bdc-ads').focus();
    };
    box.querySelector('.bdc-more').onclick = () => details(true);
    box.querySelectorAll('[data-c]').forEach((b) => { b.onclick = () => choose(b.dataset.c === 'auswahl' ? box.querySelector('#bdc-ads').checked : b.dataset.c === 'ja'); });
    document.body.appendChild(box);
    if (fromLink) details(true); // über „Cookie-Einstellungen“ geöffnet: gleich die Schalter zeigen
  }
  window.bdCookieSettings = () => show(true);
  document.addEventListener('click', (e) => { const l = e.target.closest && e.target.closest('[data-cookie-settings]'); if (l) { e.preventDefault(); show(true); } });
  const c = get();
  if (onlySettings) return;
  if (c === 'ja') load();
  else if (!c) (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', () => show()) : show());
})();
