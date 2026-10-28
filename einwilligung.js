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

  // ---------- Banner ----------
  const css = `.bd-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:80;max-width:560px;margin:0 auto;background:var(--paper,#fff);color:var(--ink,#1d1a14);
    border:1px solid var(--line,#e8e2d6);border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.25);padding:18px 18px 16px;font-size:14px;line-height:1.5}
    .bd-consent b{display:block;font-size:15px;margin-bottom:4px}.bd-consent p{margin:0 0 12px}.bd-consent a{color:var(--gold,#b8892f)}
    .bd-consent .row{display:flex;gap:10px;flex-wrap:wrap}.bd-consent button{font:inherit;font-weight:600;border-radius:10px;padding:10px 16px;cursor:pointer;flex:1;min-width:130px}
    .bd-consent .ok{background:var(--gold,#b8892f);border:1px solid var(--gold,#b8892f);color:#fff}.bd-consent .no{background:transparent;border:1px solid var(--line,#e8e2d6);color:var(--ink,#1d1a14)}`;
  const base = document.currentScript && document.currentScript.src ? new URL('.', document.currentScript.src).href : '/';
  function show() {
    if (document.querySelector('.bd-consent')) return;
    if (!document.getElementById('bd-consent-css')) { const st = document.createElement('style'); st.id = 'bd-consent-css'; st.textContent = css; document.head.appendChild(st); }
    const box = document.createElement('div'); box.className = 'bd-consent'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Cookie-Einstellungen');
    box.innerHTML = '<b>Darf Google unsere Werbung messen?</b><p><span>Mit deiner Zustimmung setzen wir Cookies von Google Ads, um zu sehen, ob unsere Anzeigen zu Anmeldungen und Abos führen. Ohne Zustimmung setzen wir keine Cookies. Du kannst das jederzeit ändern.</span> <a></a></p>'
      + '<div class="row"><button type="button" class="no">Ablehnen</button><button type="button" class="ok">Akzeptieren</button></div>';
    const a = box.querySelector('a'); a.href = base + 'datenschutz.html#google-ads'; a.textContent = 'Mehr dazu';
    box.querySelector('.ok').onclick = () => { set('ja'); box.remove(); load(); waiting.splice(0).forEach((f) => f()); };
    box.querySelector('.no').onclick = () => {
      const was = get() === 'ja'; set('nein'); box.remove(); waiting.length = 0;
      if (was) { // Zustimmung zurückgezogen: Google-Cookies dieser Seite löschen und neu laden, damit nichts mehr läuft
        document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => /^_gcl|^_ga|^_gac/.test(n))
          .forEach((n) => { document.cookie = n + '=; Max-Age=0; path=/'; document.cookie = n + '=; Max-Age=0; path=/; domain=.' + location.hostname.replace(/^www\./, ''); });
        location.reload();
      }
    };
    document.body.appendChild(box);
  }
  window.bdCookieSettings = show;
  document.addEventListener('click', (e) => { const l = e.target.closest && e.target.closest('[data-cookie-settings]'); if (l) { e.preventDefault(); show(); } });
  const c = get();
  if (c === 'ja') load();
  else if (!c) (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', show) : show());
})();
