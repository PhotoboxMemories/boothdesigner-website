// Adresse der Serverfunktion „studio“ (Supabase, Frankfurt). Der Publishable Key darf öffentlich sein – die Daten schützen
// die Zugriffsregeln und die Serverfunktion. Bei einem neuen Supabase-Projekt beide Werte anpassen (wie dashboard/config.js).
window.STUDIO_CONFIG = {
  api: 'https://axagxuphhpgcanttiiuq.supabase.co/functions/v1/studio',
  anonKey: 'sb_publishable_ztqtUOzdJvwkwZ0a1Sy67w_tN5etwwm',
  supabaseUrl: 'https://axagxuphhpgcanttiiuq.supabase.co',
  // Foto-Speicher (öffentliche Adressen der Einsendungen; wie photoStore in dashboard/config.js)
  photoStore: 'https://photobox-memories-fotos.fsn1.your-objectstorage.com/p',
  // Eigener Bereich für Fotobox-Vermieter auf dieser Seite (Anmeldung, Einstellungen, Einsendungen)
  dashboard: 'konto/'
};
