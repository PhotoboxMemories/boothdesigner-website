// Besucherzähler ohne Cookies (Betreiber 01.11.2026: „wird viel besucht?“). Meldet je Seitenaufruf nur Seite, Herkunft und ob ein
// neuer Besuch beginnt an studio_besuch (SQL 202611010001) – keine Kennung, nichts im Browser gespeichert, daher ohne Einwilligung
// (Datenschutzerklärung 5b). Zahlen sieht der Betreiber im Dashboard unter Verwaltung → Übersicht (admin-besucher.js).
// Nur auf boothdesigner.de (Startseite, Mein BoothDesigner, Rechtsseiten) – nie im Design-Studio der Kunden.
(() => {
  'use strict';
  const C = window.STUDIO_CONFIG || {};
  if (!C.supabaseUrl || !C.anonKey || !/(^|\.)boothdesigner\.de$/.test(location.hostname)) return;
  if (navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|preview/i.test(navigator.userAgent)) return;
  const p = location.pathname.replace(/index\.html$/, '');
  const seite = p.startsWith('/konto') ? '/konto/' : ['/', '/agb.html', '/impressum.html', '/datenschutz.html'].includes(p) ? p : null;
  if (!seite) return;

  const q = new URLSearchParams(location.search);
  let ref = ''; try { ref = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : ''; } catch (e) {}
  const quelle = q.has('gclid') || q.has('gbraid') || q.has('wbraid') || /^(cpc|ppc|paid)/i.test(q.get('utm_medium') || '') ? 'werbung'
    : ref === location.hostname.replace(/^www\./, '') ? 'intern'
    : !ref ? 'direkt'
    : /(^|\.)google\./.test(ref) ? 'google'
    : /(^|\.)(bing\.com|duckduckgo\.com|ecosia\.org|yahoo\.com|qwant\.com|startpage\.com)$/.test(ref) ? 'suche'
    : /(^|\.)(facebook\.com|instagram\.com|tiktok\.com|pinterest\.[a-z.]+|linkedin\.com|youtube\.com|t\.co|x\.com|twitter\.com|whatsapp\.com)$/.test(ref) ? 'social'
    : 'andere';
  const nav = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || {};
  const neu = quelle !== 'intern' && nav.type !== 'reload' && nav.type !== 'back_forward';

  const send = () => fetch(C.supabaseUrl + '/rest/v1/rpc/studio_besuch', {
    method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json', apikey: C.anonKey },
    body: JSON.stringify({ p_seite: seite, p_quelle: quelle, p_neu: neu })
  }).catch(() => {});
  if (document.prerendering) document.addEventListener('prerenderingchange', send, { once: true }); else send();
})();
