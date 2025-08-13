// frontend/js/weather.js
const OPENWEATHER_KEY = "59ad8c185d15aa2a4d8f0114e81380f6"; 
const LS_CITY_KEY = 'weather:city';

export function getSavedCity() {
  try { return localStorage.getItem(LS_CITY_KEY) || ''; } catch { return ''; }
}
export function saveCity(city) {
  try { localStorage.setItem(LS_CITY_KEY, city); } catch {}
}

export async function renderWeatherByCity(city, outSelector = '#weather-out') {
  const out = document.querySelector(outSelector);
  if (!out) return;
  if (!city) { out.textContent = 'Configura tu ciudad para ver el clima'; return; }

  out.textContent = 'Cargando clima...';
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_KEY}&units=metric&lang=es`;
    const r = await fetch(url);
    const data = await r.json();
    if (!r.ok) throw new Error(data?.message || 'Error de clima');

    const icon = `https://openweathermap.org/img/wn/${data.weather?.[0]?.icon}@2x.png`;
    out.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center">
        <img src="${icon}" alt="" width="64" height="64" loading="lazy">
        <div>
          <div><b>${data.name}</b></div>
          <div>${Math.round(data.main.temp)}°C — ${data.weather?.[0]?.description || ''}</div>
        </div>
      </div>`;
  } catch (e) {
    out.textContent = 'No se pudo obtener el clima';
  }
}

/* ---------- Detección automática de ciudad (GPS -> IP -> prompt) ---------- */
async function getCityByReverseGeocoding(lat, lon) {
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_KEY}`;
  const r = await fetch(url);
  const data = await r.json();
  if (!Array.isArray(data) || data.length === 0) throw new Error('Sin resultados');
  const place = data[0];
  const parts = [place.name, place.state, place.country].filter(Boolean);
  return parts.join(', ');
}

async function getCityByIP() {
  const r = await fetch('https://ipapi.co/json/');
  const j = await r.json();
  if (!j?.city) throw new Error('No se pudo detectar ciudad por IP');
  return [j.city, j.country].filter(Boolean).join(', ');
}

/** Detecta ciudad (GPS -> IP -> prompt), la guarda y renderiza */
export async function detectCityAndRender(outSelector = '#weather-out') {
  const out = document.querySelector(outSelector);
  if (!out) return;

  // 0) Si ya hay ciudad guardada, solo renderiza
  const saved = getSavedCity();
  if (saved) {
    await renderWeatherByCity(saved, outSelector);
    return;
  }

  out.textContent = 'Detectando tu ciudad...';

  // 1) Intento con GPS (requiere https o localhost)
  try {
    const { coords } = await new Promise((res, rej) => {
      if (!('geolocation' in navigator)) return rej(new Error('Sin geolocalización'));
      navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy:false, timeout:8000, maximumAge:300000 });
    });
    const city = await getCityByReverseGeocoding(coords.latitude, coords.longitude);
    saveCity(city);
    await renderWeatherByCity(city, outSelector);
    return;
  } catch {
    // sigue al fallback
  }

  // 2) Fallback IP
  try {
    const city = await getCityByIP();
    saveCity(city);
    await renderWeatherByCity(city, outSelector);
    return;
  } catch {
    // sigue al prompt
  }

  // 3) Último recurso: pedir al usuario
  const city = prompt('No pudimos detectar tu ciudad. Escríbela (ej. "Ciudad Juárez, MX"):');
  if (city) {
    const clean = city.trim();
    saveCity(clean);
    await renderWeatherByCity(clean, outSelector);
  } else {
    out.textContent = 'Configura tu ciudad para ver el clima';
  }
}
