/* Humana Academy · regresión completa con Playwright y Firebase simulado.
   Uso, desde la raíz del repo:
   (python3 -m http.server 8765 >/dev/null 2>&1 &) && sleep 1 && NODE_PATH=$(npm root -g) node pruebas/regresion.js
   Capturas en /tmp/humana-regresion. Sale con código 1 si alguna prueba falla. */
const fs = require('fs');
const path = require('path');
const { chromium, devices } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:8765/';
const OUT = '/tmp/humana-regresion';
const DIR = __dirname;
const MOCK = fs.readFileSync(path.join(DIR, 'mockfb.js'), 'utf8');
const AXE = fs.existsSync(path.join(DIR, 'axe.min.js')) ? fs.readFileSync(path.join(DIR, 'axe.min.js'), 'utf8') : null;
const SEMILLA = require('./semilla.js');
fs.mkdirSync(OUT, { recursive: true });

const PERSONAS = SEMILLA.PERSONAS;
const PANTALLAS = {
  escritorio: { viewport: { width: 1280, height: 860 } },
  celular: { ...devices['iPhone 13'] }
};

let browser;
const resultados = [];
const filtro = process.argv[2] ? new RegExp(process.argv[2], 'i') : null;

async function contexto(persona, pantalla, extra) {
  const ctx = await browser.newContext({ ...PANTALLAS[pantalla || 'escritorio'], serviceWorkers: 'block' });
  await ctx.route(/^https?:\/\/(?!localhost)/, route => {
    const u = route.request().url();
    if (/firebase-app-compat\.js/.test(u)) return route.fulfill({ contentType: 'application/javascript', body: MOCK });
    if (/firebase-(auth|firestore)-compat\.js/.test(u)) return route.fulfill({ contentType: 'application/javascript', body: '' });
    return route.abort();
  });
  const estado = SEMILLA.estado(persona, extra && extra.db);
  const ls = Object.assign({ ha_onboarded: 'true', hn_onboarded: 'true', hc_onboarded: 'true', ha_ac_onboarded: 'true' }, (extra && extra.ls) || {});
  await ctx.addInitScript(([estado, ls]) => {
    if (!sessionStorage.getItem('__sembrado')) {
      localStorage.clear();
      localStorage.setItem('__mock', JSON.stringify(estado));
      Object.keys(ls).forEach(k => localStorage.setItem(k, ls[k]));
      sessionStorage.setItem('__sembrado', '1');
    }
  }, [estado, ls]);
  return ctx;
}

async function pagina(ctx) {
  const page = await ctx.newPage();
  page.__errores = [];
  page.on('pageerror', e => page.__errores.push('pageerror: ' + e.message));
  page.on('console', m => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (/net::ERR_FAILED|ERR_BLOCKED|Failed to load resource/.test(t) && !/localhost/.test(m.location().url || '')) return;
    page.__errores.push('console: ' + t);
  });
  page.on('requestfailed', r => { if (/localhost/.test(r.url()) && !/sw\.js/.test(r.url())) page.__errores.push('request: ' + r.url()); });
  page.on('dialog', d => d.accept());
  return page;
}

function esperar(c, msg) { if (!c) throw new Error(msg); }
async function sinErrores(page) { esperar(!page.__errores.length, 'Errores en consola:\n  ' + page.__errores.join('\n  ')); }
async function sinDesborde(page) {
  const d = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  esperar(d <= 1, 'Desborde horizontal de ' + d + 'px');
}
async function axe(page, nombre) {
  if (!AXE) return;
  await page.addScriptTag({ content: AXE });
  const r = await page.evaluate(async () => {
    const res = await window.axe.run(document, { resultTypes: ['violations'], runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] });
    return res.violations.filter(v => v.impact === 'serious' || v.impact === 'critical')
      .map(v => v.id + ' (' + v.nodes.length + '): ' + v.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | '));
  });
  esperar(!r.length, 'Accesibilidad en ' + nombre + ':\n  ' + r.join('\n  '));
}
async function foto(page, nombre) { await page.screenshot({ path: path.join(OUT, nombre + '.png'), fullPage: false }); }
async function listo(page, sel, ms) { await page.waitForSelector(sel, { timeout: ms || 6000 }); await page.waitForTimeout(150); }

async function prueba(nombre, fn) {
  if (filtro && !filtro.test(nombre)) return;
  const t0 = Date.now();
  try { await fn(); resultados.push({ nombre, ok: true, ms: Date.now() - t0 }); process.stdout.write('  ✓ ' + nombre + '\n'); }
  catch (e) { resultados.push({ nombre, ok: false, error: e.message }); process.stdout.write('  ✗ ' + nombre + '\n    ' + e.message.split('\n').join('\n    ') + '\n'); }
}

/* Abre una página con una persona y devuelve {ctx,page}. */
async function abrir(persona, url, pantalla, extra) {
  const ctx = await contexto(persona, pantalla, extra);
  const page = await pagina(ctx);
  await page.goto(BASE + url, { waitUntil: 'load' });
  return { ctx, page };
}

const PAGINAS = [
  ['index.html', '#app .mods, #app section'],
  ['nexo.html', '#app section'],
  ['cutaquig.html', '#app section'],
  ['calculadora.html', 'main, #app'],
  ['comercial.html', '#app section'],
  ['estratificador.html', 'main, body'],
  ['404.html', 'body'],
  ['academia.html', '#app section']
];

(async () => {
  browser = await chromium.launch();
  console.log('Humana Academy · regresión\n');

  /* ---------- Cada página, cada pantalla ---------- */
  for (const pantalla of Object.keys(PANTALLAS)) {
    for (const [url, sel] of PAGINAS) {
      if (!fs.existsSync(url)) continue;
      await prueba(`${url} carga sin errores (${pantalla}, alumna)`, async () => {
        const { ctx, page } = await abrir('alumna', url, pantalla);
        await listo(page, sel);
        await page.waitForTimeout(400);
        await foto(page, url.replace('.html', '') + '-' + pantalla);
        await sinDesborde(page);
        await sinErrores(page);
        await ctx.close();
      });
    }
  }

  /* ---------- Acceso ---------- */
  await prueba('index.html sin sesión muestra el ingreso', async () => {
    const { ctx, page } = await abrir(null, 'index.html');
    await listo(page, '#fbgate.on input[type=email]');
    await axe(page, 'ingreso');
    await sinErrores(page);
    await ctx.close();
  });
  await prueba('Ingreso con correo del grupo', async () => {
    const { ctx, page } = await abrir(null, 'index.html', 'escritorio', { cuentas: true });
    await listo(page, '#fbgate.on input[type=email]');
    await page.fill('input[type=email]', PERSONAS.alumna.email);
    await page.fill('input[type=password]', 'clave-prueba');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => !document.querySelector('#fbgate.on'), null, { timeout: 6000 });
    await sinErrores(page);
    await ctx.close();
  });

  /* ---------- Ruta método Humana (index) ---------- */
  await prueba('index: alumna hace un módulo y se guarda el puntaje', async () => {
    const { ctx, page } = await abrir('alumna', 'index.html');
    await listo(page, '#app .mods');
    await page.evaluate(() => openM(MODULES[0].n));
    await listo(page, '#quiz .opt');
    const n = await page.evaluate(() => curQuiz.quiz.length);
    for (let i = 0; i < n; i++) { const c = await page.evaluate(i => curQuiz.quiz[i].c, i); await page.click(`#o_${i}_${c}`); }
    await page.click('#btnCorr');
    await page.waitForTimeout(400);
    const sc = await page.evaluate(() => JSON.parse(localStorage.getItem('__mock')).db['users/alumna'].scores);
    esperar(sc && Object.values(sc).some(v => v >= 60), 'No se guardó el puntaje: ' + JSON.stringify(sc));
    await axe(page, 'módulo');
    await sinErrores(page);
    await ctx.close();
  });
  await prueba('index: admin abre el panel de administración', async () => {
    const { ctx, page } = await abrir('admin', 'index.html');
    await listo(page, '#app .mods');
    await page.evaluate(() => showAdmin());
    await listo(page, '#gadm .urow');
    await foto(page, 'admin-panel');
    await axe(page, 'panel admin');
    await sinErrores(page);
    await ctx.close();
  });

  /* ---------- Estudio ---------- */
  await prueba('estudio: una alumna no entra', async () => {
    const { ctx, page } = await abrir('alumna', 'estudio.html');
    await page.waitForURL(/index\.html/, { timeout: 6000 });
    await sinErrores(page);
    await ctx.close();
  });
  await prueba('estudio: la editora ve los módulos', async () => {
    const { ctx, page } = await abrir('editora', 'estudio.html');
    await page.waitForTimeout(1200);
    await foto(page, 'estudio-editora');
    const txt = await page.textContent('body');
    esperar(/Estudio/i.test(txt), 'No cargó el Estudio');
    await sinErrores(page);
    await ctx.close();
  });

  /* ---------- Formación comercial: capa por país ---------- */
  await prueba('comercial: España con @humanahc.com y Argentina con el resto', async () => {
    let { ctx, page } = await abrir('espana', 'comercial.html');
    await listo(page, '#app section');
    let t = await page.textContent('#app');
    esperar(/aseguradoras/.test(t), 'España no ve "aseguradoras"');
    await ctx.close();
    ({ ctx, page } = await abrir('alumna', 'comercial.html'));
    await listo(page, '#app section');
    t = await page.textContent('#app');
    esperar(/prepagas/.test(t), 'Argentina no ve "prepagas"');
    await ctx.close();
  });

  /* ---------- Service worker ---------- */
  await prueba('sw.js: versión de caché ha-vN y estrategia red primero', async () => {
    const sw = fs.readFileSync('sw.js', 'utf8');
    esperar(/const C="ha-v\d+"/.test(sw), 'Sin versión ha-vN');
    esperar(/fetch\(e\.request\)/.test(sw), 'No es red primero');
  });
  await prueba('sw.js: se registra en index.html', async () => {
    const ctx = await browser.newContext();
    await ctx.route(/^https?:\/\/(?!localhost)/, r => /firebase-app/.test(r.request().url()) ? r.fulfill({ contentType: 'application/javascript', body: MOCK }) : /firebase-/.test(r.request().url()) ? r.fulfill({ contentType: 'application/javascript', body: '' }) : r.abort());
    const page = await ctx.newPage();
    await page.goto(BASE + 'index.html');
    const ok = await page.evaluate(() => navigator.serviceWorker.ready.then(r => !!r.active).catch(() => false));
    esperar(ok, 'El service worker no quedó activo');
    await ctx.close();
  });

  /* ---------- Nueva Academy (reestructuración) ---------- */
  const extra = path.join(DIR, 'academia.pruebas.js');
  if (fs.existsSync(extra)) await require(extra)({ prueba, abrir, listo, foto, axe, sinErrores, sinDesborde, esperar, PERSONAS, browser });

  await browser.close();
  const mal = resultados.filter(r => !r.ok);
  console.log(`\n${resultados.length - mal.length} de ${resultados.length} pruebas pasaron.` + (mal.length ? ` ${mal.length} fallaron:` : ''));
  mal.forEach(r => console.log('  ✗ ' + r.nombre));
  fs.writeFileSync(path.join(OUT, 'resultado.json'), JSON.stringify(resultados, null, 2));
  process.exit(mal.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
