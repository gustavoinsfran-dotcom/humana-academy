/* Pruebas de la portada, el menú y los entornos (rediseño, noviembre de 2026). Las llama regresion.js. */
const fs = require('fs');
const path = require('path');
const RAIZ = path.join(__dirname, '..');

const textoMenu = (page, donde) => page.$$eval(donde + ' a', as => as.filter(a => a.offsetParent !== null || a.closest('.drawer')).filter(a => a.id !== 'installBtn').map(a => a.textContent.trim()));
const leerDB = page => page.evaluate(() => JSON.parse(localStorage.getItem('__mock')).db);
const ARCH_COMPLETO = { 1: 80, 2: 80, 3: 80, 4: 80, 5: 80, 6: 80, 7: 80, 8: 80, 9: 80, 10: 80 };

module.exports = async function ({ prueba, abrir, listo, foto, axe, sinErrores, sinDesborde, esperar }) {

  /* ---------- Menú ---------- */
  await prueba('menú: una alumna ve Inicio, Mi escuela, Certificados y Salir', async () => {
    const { ctx, page } = await abrir('alumna', 'index.html');
    await listo(page, '#app .reco');
    const m = await textoMenu(page, '#navdesk');
    esperar(JSON.stringify(m) === JSON.stringify(['Inicio', 'Mi escuela', 'Certificados', 'Salir']), 'Menú de alumna: ' + m.join(', '));
    const body = await page.innerText('body');
    esperar(!/Estratificador|Estudio|Vista previa|Ver borradores|Ver como alumna|Nueva Academy/.test(body), 'Quedan ítems que no van en la vista general');
    esperar(await page.getAttribute('#m-inicio-d', 'aria-current') === 'page', 'Inicio no queda marcado');
    await axe(page, 'portada alumna');
    await sinErrores(page);
    await ctx.close();
  });
  await prueba('menú: un administrador ve una sola entrada de Administración', async () => {
    const { ctx, page } = await abrir('admin', 'index.html');
    await listo(page, '#app .reco');
    const m = await textoMenu(page, '#navdesk');
    esperar(JSON.stringify(m) === JSON.stringify(['Inicio', 'Mi escuela', 'Certificados', 'Administración', 'Salir']), 'Menú de admin: ' + m.join(', '));
    esperar(!/Ver borradores|Ver como alumna|Vista previa/.test(await page.textContent('#app')), 'La vista previa sigue en la portada');
    await page.click('#m-administracion-d');
    await listo(page, '#adm-estudio');
    esperar(await page.getAttribute('#adm-estudio', 'href') === 'estudio-academia.html', 'El Estudio no apunta al Estudio de la Academy');
    esperar((await page.$$('#app a[href="estudio-academia.html"]')).length === 1, 'Hay más de una entrada al Estudio');
    esperar(!!(await page.$('#adm-borradores')) && !!(await page.$('#adm-alumna')), 'Faltan Ver borradores y Ver como alumna');
    esperar(await page.getAttribute('#m-administracion-d', 'aria-current') === 'page', 'Administración no queda marcada');
    await foto(page, 'administracion');
    await axe(page, 'administración');
    await page.click('#adm-alumna');
    esperar(await page.evaluate(() => VISTA_ALUMNA === true && !previa()), 'Ver como alumna no cambia la vista');
    esperar(/Vista de alumna/.test(await page.textContent('#userbox')), 'No avisa que está viendo como alumna');
    await page.click('#adm-borradores');
    esperar(await page.evaluate(() => previa()), 'Ver borradores no vuelve a la vista previa');
    await page.click('#adm-personas');
    await listo(page, '#gadm .urow');
    await page.click('#app .back');
    await listo(page, '#adm-estudio');
    await sinErrores(page);
    await ctx.close();
  });
  await prueba('menú: en el celular se abre y se cierra con el botón y Escape', async () => {
    const { ctx, page } = await abrir('admin', 'index.html', 'celular');
    await listo(page, '#app .reco');
    esperar(!(await page.isVisible('#navdesk')), 'El menú de escritorio se ve en el celular');
    await page.click('#burger');
    await listo(page, '#drawer.open');
    const m = await page.$$eval('#drawer a', as => as.filter(a => a.style.display !== 'none').map(a => a.textContent.trim()));
    esperar(JSON.stringify(m) === JSON.stringify(['Inicio', 'Mi escuela', 'Certificados', 'Administración', 'Salir']), 'Menú del celular: ' + m.join(', '));
    await foto(page, 'menu-celular');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Escape');
    esperar(!(await page.$('#drawer.open')), 'Escape no cierra el menú');
    await page.click('#burger');
    await page.click('#m-certificados-m');
    await listo(page, '.cards2');
    esperar(!(await page.$('#drawer.open')), 'El menú queda abierto después de elegir');
    await sinDesborde(page);
    await sinErrores(page);
    await ctx.close();
  });

  /* ---------- Portada ---------- */
  for (const pantalla of ['escritorio', 'celular']) {
    await prueba(`portada: el recorrido de Karina y las formaciones específicas (${pantalla})`, async () => {
      const db = { 'users/medico': { academia: { ok: { 'modulo-0': true, 'tronco-01': true }, scores: {} } } };
      const { ctx, page } = await abrir('medico', 'index.html', pantalla, { db });
      await listo(page, '#app .reco');
      const pasos = await page.$$eval('.reco .paso', ps => ps.map(p => p.querySelector('.num').textContent.trim()));
      esperar(pasos.join(',') === '0,1,2,3,4,5', 'Los módulos no van del 0 al 5: ' + pasos);
      const t = await page.textContent('#app');
      esperar(/Formación por perfil · Médicos/.test(t), 'No muestra la escuela en el módulo 2');
      esperar(/1 de 9 completados/.test(t), 'No muestra el avance del tronco común');
      esperar(/Formaciones específicas/.test(t) && /Humana Nexo/.test(t) && /Cutaquig/.test(t), 'Falta el bloque de Nexo y Cutaquig');
      esperar(!/Comercial|comercial\.html/.test(await page.innerHTML('#app')), 'La formación comercial no va todavía');
      esperar(!/Doña Elena|Medicina de Continuidad|mapa del programa|Estratificador/i.test(t), 'Queda contenido archivado en la portada');
      esperar(!(await page.$('#app .mods, #app .mapwrap, a[href="estratificador.html"]')), 'Quedan módulos anteriores, el mapa o el Estratificador');
      esperar((await page.$$('.paso h3 button[aria-disabled=true]')).length === 0, 'Con el Módulo 0 hecho no debería haber bloqueos');
      esperar(!!(await page.$('.hola-esc .esc-ico svg')), 'Falta el ícono de la escuela');
      await foto(page, 'portada-' + pantalla);
      await sinDesborde(page);
      await axe(page, 'portada');
      await sinErrores(page);
      await ctx.close();
    });
  }
  await prueba('portada: marcar como leído suma al avance', async () => {
    const db = { 'users/medico': { academia: { ok: { 'modulo-0': true }, scores: {} } } };
    const { ctx, page } = await abrir('medico', 'index.html', 'escritorio', { db });
    await listo(page, '#app .reco');
    await page.evaluate(() => abrir('tronco-02'));
    await listo(page, '#btnLeido');
    await page.click('#btnLeido');
    await page.waitForTimeout(200);
    esperar(await page.isDisabled('#btnLeido'), 'El botón no queda marcado');
    esperar((await leerDB(page))['users/medico'].academia.ok['tronco-02'] === true, 'No se guardó la lectura');
    await page.evaluate(() => home());
    esperar(/1 de 9 completados/.test(await page.textContent('.reco')), 'El avance no se actualiza');
    await sinErrores(page);
    await ctx.close();
  });
  await prueba('portada: Mi escuela respeta el Módulo 0 y abre la escuela', async () => {
    let { ctx, page } = await abrir('medico', 'index.html');
    await listo(page, '#app .reco');
    await page.click('#m-escuela-d');
    await listo(page, '.mhead h1');
    esperar(/se abre al completar el Módulo 0/i.test(await page.textContent('#app')), 'No avisa que falta el Módulo 0');
    await ctx.close();
    const db = { 'users/medico': { academia: { ok: { 'modulo-0': true }, scores: {} } } };
    ({ ctx, page } = await abrir('medico', 'index.html', 'escritorio', { db }));
    await listo(page, '#app .reco');
    await page.click('#m-escuela-d');
    await listo(page, '.ac-lista');
    esperar(/Unidades/.test(await page.textContent('#app')) && !!(await page.$('.mhead h1 .esc-ico')), 'No abre la escuela con su ícono');
    esperar(await page.getAttribute('#m-escuela-d', 'aria-current') === 'page', 'Mi escuela no queda marcada');
    await sinErrores(page);
    await ctx.close();
  });
  await prueba('escuelas: cada una con su ícono', async () => {
    const { ctx, page } = await abrir('editora', 'index.html');
    await listo(page, '#app .reco');
    await page.evaluate(() => verModulo(2));
    await listo(page, '.ac-card');
    const n = await page.$$eval('.ac-card .esc-ico svg', s => s.map(x => x.innerHTML));
    esperar(n.length === 6 && new Set(n).size === 6, 'No hay seis íconos distintos: ' + n.length);
    await foto(page, 'escuelas');
    await sinErrores(page);
    await ctx.close();
  });

  /* ---------- Certificados y archivo ---------- */
  await prueba('certificados: se conservan los del programa anterior', async () => {
    const db = { 'users/alumna': { scores: ARCH_COMPLETO } };
    let { ctx, page } = await abrir('alumna', 'index.html', 'escritorio', { db });
    await listo(page, '#app .reco');
    await page.click('#m-certificados-d');
    await listo(page, '.cards2');
    const t = await page.textContent('#app');
    esperar(/Humana Nexo/.test(t) && /Medicina de Continuidad/.test(t) && /Obtenido/.test(t), 'No muestra el certificado del programa anterior');
    await foto(page, 'certificados');
    await axe(page, 'certificados');
    await page.click('a[href="archivo.html#certificado"]');
    await listo(page, '#cert .certcard');
    esperar(await page.isEnabled('.certtools .mh-btn.pri'), 'El certificado archivado no se puede descargar');
    await sinErrores(page);
    await ctx.close();
    ({ ctx, page } = await abrir('medico', 'index.html#certificados'));
    await listo(page, '.cards2');
    esperar(!/Medicina de Continuidad/.test(await page.textContent('#app')), 'Muestra el archivo a quien no lo hizo');
    await ctx.close();
  });
  await prueba('archivo: el programa anterior sigue entero, sin Estratificador', async () => {
    const { ctx, page } = await abrir('alumna', 'archivo.html');
    await listo(page, '#app .mods');
    const t = await page.textContent('body');
    esperar(/Programa anterior · Archivo/.test(t), 'No dice que es el archivo');
    esperar((await page.$$('#app .mrow')).length === 10, 'No están los diez módulos');
    esperar(/Doña Elena/.test(t) && !!(await page.$('.mapwrap')), 'Falta el caso o el mapa');
    esperar(!(await page.$('a[href="estratificador.html"], a[href="nexo.html"]')), 'Quedan enlaces al Estratificador o a Nexo');
    await sinErrores(page);
    await ctx.close();
  });
  await prueba('academia.html lleva al inicio', async () => {
    const { ctx, page } = await abrir('alumna', 'academia.html');
    await page.waitForURL(/index\.html/, { timeout: 6000 });
    await listo(page, '#app .reco');
    await ctx.close();
  });
  await prueba('Estratificador: fuera del menú y de la portada, el archivo sigue', async () => {
    esperar(fs.existsSync(path.join(RAIZ, 'estratificador.html')), 'Se borró el archivo');
    ['index.html', 'archivo.html', 'nexo.html', 'cutaquig.html', 'calculadora.html', 'firebase-auth.js', 'extras.js'].forEach(f => {
      esperar(!/estratificador\.html/.test(fs.readFileSync(path.join(RAIZ, f), 'utf8')), f + ' todavía enlaza el Estratificador');
    });
  });

  /* ---------- Entornos ---------- */
  await prueba('entornos: Academy, Nexo y Cutaquig con su color, ícono y etiqueta', async () => {
    const esperado = { 'index.html': ['rgb(212, 51, 128)', 'Formación', '#app .reco'], 'nexo.html': ['rgb(23, 15, 30)', 'Programa', '#app section'], 'cutaquig.html': ['rgb(40, 68, 155)', 'Producto', '#app section'] };
    const PALETA = ['rgb(23, 15, 30)', 'rgb(212, 51, 128)', 'rgb(40, 68, 155)', 'rgb(202, 202, 202)', 'rgb(255, 255, 255)'];
    for (const [url, [color, etiqueta, sel]] of Object.entries(esperado)) {
      const { ctx, page } = await abrir('alumna', url);
      await listo(page, sel);
      const r = await page.evaluate(() => { const h = document.querySelector('header.top'); return { bg: getComputedStyle(h).backgroundColor, tag: (h.querySelector('.ent-tag') || {}).textContent, ico: !!h.querySelector('.ent-ico svg') }; });
      esperar(r.bg === color, url + ': color de cabecera ' + r.bg);
      esperar(PALETA.includes(r.bg), url + ': fuera de la paleta');
      esperar(r.tag === etiqueta && r.ico, url + ': falta el ícono o la etiqueta');
      await foto(page, 'entorno-' + url.replace('.html', ''));
      await axe(page, 'cabecera ' + url);
      await sinErrores(page);
      await ctx.close();
    }
  });
};
