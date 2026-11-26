/* Pruebas de la nueva Academy (reestructuración, noviembre de 2026). Las llama regresion.js. */
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const BORR = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/karina/borradores.json'), 'utf8')).docs;

/* Base simulada con el material de Karina. estado: 'borrador' | 'publicado'. cambios: {id: {...}} */
function base(estado, cambios) {
  const db = {};
  BORR.forEach(d => {
    const x = JSON.parse(JSON.stringify(d)); delete x.id;
    x.estado = estado || 'borrador';
    if (estado === 'publicado') x.gobernanza = Object.assign({}, x.gobernanza, { revisor: 'Revisión de prueba' });
    Object.assign(x, (cambios || {})[d.id] || {});
    db['academia/' + d.id] = x;
  });
  return db;
}
const leerDB = page => page.evaluate(() => JSON.parse(localStorage.getItem('__mock')).db);

/* Texto visible de un fragmento HTML, en la versión España (el texto de Karina tal cual). */
function textoES(h) {
  return (h || '').replace(/\[\[([^|\]]*)\|([^\]]*)\]\]/g, '$1').replace(/<[^>]+>/g, '\n').replace(/&amp;/g, '&');
}
/* Para tablas y gráficos del PDF, donde las columnas parten las frases: todas las palabras, en orden, dentro de una ventana corta. */
function enOrden(fuente, frase) {
  const pal = frase.split(' ').filter(Boolean);
  let desde = 0;
  while (true) {
    const ini = fuente.indexOf(pal[0], desde); if (ini < 0) return false;
    let pos = ini + pal[0].length, ok = true;
    for (let i = 1; i < pal.length; i++) { const j = fuente.indexOf(pal[i], pos); if (j < 0 || j - ini > frase.length * 4 + 200) { ok = false; break; } pos = j + pal[i].length; }
    if (ok) return true;
    desde = ini + 1;
  }
}
function normal(t) {
  return t.replace(/Humana Intelligen(?!ce)/g, 'Humana Intelligence').replace(/\*\*|\\|`/g, '').replace(/[·•—\-–|›→()]/g, ' ').replace(/\s+/g, ' ').toLowerCase().trim();
}

module.exports = async function ({ prueba, abrir, listo, foto, axe, sinErrores, sinDesborde, esperar }) {

  /* ---------- Fidelidad al material de Karina ---------- */
  await prueba('academia: cada frase cargada existe en el material de Karina', async () => {
    const fuente = normal(fs.readFileSync(path.join(RAIZ, 'docs/karina/material-karina.md'), 'utf8'));
    const faltan = [];
    const revisar = (t, donde) => textoES(t).split(/\n+/).forEach(linea => {
      linea.split(/(?<=[.:;?])\s+/).forEach(fr => {
        const n = normal(fr).replace(/^\d+\.\s*/, '');
        if (n.length < 12) return;
        if (fuente.indexOf(n) < 0 && !enOrden(fuente, n)) faltan.push(donde + ': ' + fr.slice(0, 90));
      });
    });
    BORR.forEach(d => {
      ['t', 'sub', 'lead'].forEach(k => revisar(d[k], d.id + '.' + k));
      (d.secciones || []).forEach(s => revisar(s.body, d.id + '/' + s.id));
      Object.entries(d.versiones || {}).forEach(([e, v]) => { revisar(v.lead, d.id + '/' + e); (v.secciones || []).forEach(s => revisar(s.body, d.id + '/' + e + '/' + s.id)); (v.reflexion || []).forEach(q => revisar(q, d.id + '/' + e + '/reflexion')); });
    });
    esperar(!faltan.length, faltan.length + ' frases no están en el original:\n  ' + faltan.slice(0, 12).join('\n  '));
  });
  await prueba('academia: todo el material entra como borrador y completo', async () => {
    esperar(BORR.every(d => d.estado === 'borrador'), 'Hay contenido que no es borrador');
    const tipo = t => BORR.filter(d => d.tipo === t).length;
    esperar(tipo('tronco') === 9, 'No están los nueve troncos');
    esperar(tipo('escuela') === 6, 'No están las seis escuelas');
    esperar(tipo('unidad') === 40, 'No están las 40 unidades del Índice: ' + tipo('unidad'));
    const t = BORR.find(d => d.id === 'tronco-01');
    esperar(Object.keys(t.versiones).length === 6, 'El tronco 01 no tiene seis versiones');
    const ic = BORR.find(d => d.id === 'patologia-insuficiencia-cardiaca');
    esperar(ic && Object.keys(ic.versiones).length === 6, 'El piloto IC no tiene seis versiones');
    const m0 = BORR.find(d => d.id === 'modulo-0');
    esperar(m0.secciones.length === 11, 'La Doctrina no tiene sus diez partes y la Carta Magna');
    esperar(BORR.every(d => d.gobernanza && d.gobernanza.autor), 'Falta la ficha de gobernanza');
  });

  /* ---------- Sin contenido publicado ---------- */
  await prueba('academia: alumna sin nada publicado ve "en preparación" y ningún borrador', async () => {
    const { ctx, page } = await abrir('alumna', 'academia.html', 'escritorio', { db: base('borrador') });
    await listo(page, '#app h1');
    const t = await page.textContent('#app');
    esperar(/preparación/i.test(t), 'No muestra "en preparación"');
    esperar(!/Pregunta central|Carta Magna/.test(await page.content()), 'Se filtró contenido en borrador');
    const negado = await page.evaluate(() => firebase.firestore().collection('academia').get().then(() => false, e => e.code === 'permission-denied'));
    esperar(negado, 'Una alumna pudo leer los borradores');
    await sinErrores(page);
    await ctx.close();
  });

  /* ---------- Vista previa de la editora ---------- */
  for (const pantalla of ['escritorio', 'celular']) {
    await prueba(`academia: la editora ve los borradores en vista previa (${pantalla})`, async () => {
      const { ctx, page } = await abrir('editora', 'academia.html', pantalla, { db: base('borrador') });
      await listo(page, '.ac-m0');
      esperar(/Vista previa/.test(await page.textContent('#pre')), 'Sin barra de vista previa');
      await foto(page, 'academia-inicio-editora-' + pantalla);
      await sinDesborde(page);
      await page.click('.ac-m0 .mh-btn');
      await listo(page, '.ac-sec');
      esperar(/Pregunta central/.test(await page.textContent('#app')), 'No se ve la Doctrina');
      await page.click('#f_nucleo');
      const secs = await page.$$eval('.ac-sec h2', hs => hs.map(h => h.textContent));
      esperar(secs.some(s => /Principios/.test(s)) && !secs.some(s => /Conceptos clave/.test(s)), 'El filtro del núcleo no funciona');
      await foto(page, 'academia-doctrina-' + pantalla);
      await sinDesborde(page);
      await axe(page, 'Doctrina');
      await page.click('#pre button');
      esperar(/preparación/i.test(await page.textContent('#app')), '"Ver como alumna" muestra borradores');
      await sinErrores(page);
      await ctx.close();
    });
  }
  await prueba('academia: la editora recorre los seis módulos sin errores', async () => {
    const { ctx, page } = await abrir('editora', 'academia.html', 'escritorio', { db: base('borrador') });
    await listo(page, '.ac-m0');
    for (const n of [1, 2, 3, 4, 5]) {
      await page.evaluate(n => verModulo(n), n);
      await listo(page, '.mhead h1');
      await foto(page, 'academia-modulo-' + n);
      await axe(page, 'módulo ' + n);
    }
    await page.evaluate(() => verModulo(3));
    const prox = await page.$$eval('.ac-card.prox', x => x.length);
    esperar(prox >= 40, 'El catálogo no muestra las patologías próximas: ' + prox);
    await page.evaluate(() => abrir('tronco-05'));
    await listo(page, '.ac-tabs');
    await page.click('#tab_cuidadores');
    esperar(/Identificar pequeñas señales/.test(await page.textContent('.ac-ver')), 'No cambia a la versión de cuidadores');
    await page.evaluate(() => abrir('escuela-enfermeria'));
    await listo(page, '.ac-lista');
    esperar((await page.$$('.ac-lista li')).length >= 8, 'La escuela no lista sus unidades');
    await page.evaluate(() => abrir('escuela-coordinacion'));
    await listo(page, '.ac-lista');
    esperar(/Recibir y escalar alertas/.test(await page.textContent('#app')), 'Coordinación no muestra sus troncos');
    await sinErrores(page);
    await ctx.close();
  });

  /* ---------- Publicado: alumna, Módulo 0 obligatorio, escuela ---------- */
  await prueba('academia: el Módulo 0 se completa antes que el resto', async () => {
    const { ctx, page } = await abrir('alumna', 'academia.html', 'celular', { db: base('publicado') });
    await listo(page, '.ac-m0');
    esperar(/Sin asignar/.test(await page.textContent('#app')), 'Sin escuela no lo indica');
    esperar((await page.$$('.ac-card[aria-disabled=true]')).length === 5, 'Los módulos 1 a 5 no están bloqueados');
    await foto(page, 'academia-inicio-alumna-celular');
    await sinDesborde(page);
    await page.click('.ac-m0 .mh-btn');
    await listo(page, '.ac-sec');
    await page.click('text=Leí el núcleo de la Doctrina');
    await page.waitForTimeout(300);
    const db = await leerDB(page);
    esperar(db['users/alumna'].academia && db['users/alumna'].academia.ok['modulo-0'], 'No se guardó el Módulo 0');
    await page.evaluate(() => home());
    esperar((await page.$$('.ac-card[aria-disabled=true]')).length === 0, 'Siguen bloqueados después del Módulo 0');
    await page.evaluate(() => verModulo(2));
    esperar(/no tenés escuela/i.test(await page.textContent('#app')), 'No explica que falta la escuela');
    await axe(page, 'módulo 2 sin escuela');
    await sinErrores(page);
    await ctx.close();
  });
  await prueba('academia: un médico ve su versión del piloto de insuficiencia cardíaca', async () => {
    const db = base('publicado');
    db['users/medico'] = { academia: { ok: { 'modulo-0': true }, scores: {} } };
    const { ctx, page } = await abrir('medico', 'academia.html', 'escritorio', { db });
    await listo(page, '.ac-m0');
    await page.evaluate(() => abrir('patologia-insuficiencia-cardiaca'));
    await listo(page, '.ac-ver');
    const t = await page.textContent('.ac-ver');
    esperar(/Para Médicos/.test(t) && /diagnósticas y terapéuticas/.test(t), 'No ve la versión de Médicos');
    esperar(/atribuir la disnea a congestión/.test(await page.textContent('.ac-refl')), 'Faltan las preguntas para pensar');
    esperar(!(await page.$('.ac-tabs')), 'Un alumno no debería ver las otras escuelas');
    await foto(page, 'academia-ic-medico');
    await axe(page, 'piloto IC');
    await page.evaluate(() => abrir('escuela-medicos'));
    await listo(page, '.ac-lista');
    esperar(/visión 360°/.test(await page.textContent('#app')), 'No están las unidades del Índice');
    await sinErrores(page);
    await ctx.close();
  });

  /* ---------- Evaluación con error crítico ---------- */
  await prueba('academia: una pregunta crítica fallada no aprueba aunque la nota alcance', async () => {
    const quiz = [
      { q: 'Pregunta de prueba A', o: ['Uno', 'Dos'], c: 0, e: 'Prueba', critica: false },
      { q: 'Pregunta de prueba B', o: ['Uno', 'Dos'], c: 0, e: 'Prueba', critica: true }
    ];
    const db = base('publicado', { 'patologia-insuficiencia-cardiaca': { quiz, umbral: 50 } });
    db['users/medico'] = { academia: { ok: { 'modulo-0': true }, scores: {} } };
    const { ctx, page } = await abrir('medico', 'academia.html', 'escritorio', { db });
    await listo(page, '.ac-m0');
    await page.evaluate(() => abrir('patologia-insuficiencia-cardiaca'));
    await listo(page, '#quiz .opt');
    await page.click('#o_0_0'); await page.click('#o_1_1');
    await page.click('#btnCorr');
    await listo(page, '#crit.show');
    esperar(/Error crítico/.test(await page.textContent('#crit')), 'No avisa el error crítico');
    esperar(/No aprobada/.test(await page.textContent('#score')), 'Aprobó con un error crítico');
    const u = (await leerDB(page))['users/medico'].academia;
    esperar(u.scores['patologia-insuficiencia-cardiaca'] === 50 && !u.ok['patologia-insuficiencia-cardiaca'], 'Guardó como aprobada: ' + JSON.stringify(u));
    const r = await page.evaluate(() => [HA_AC.corregir([{ c: 0, critica: true }, { c: 1 }], { 0: 0, 1: 1 }, 60).aprobado, HA_AC.corregir([{ c: 0 }], {}, 60).aprobado]);
    esperar(r[0] === true && r[1] === false, 'HA_AC.corregir falla: ' + r);
    await axe(page, 'evaluación');
    await sinErrores(page);
    await ctx.close();
  });

  /* ---------- Capa por país ---------- */
  await prueba('academia: España ve el texto de Karina y Argentina su léxico', async () => {
    const db = base('publicado');
    db['users/espana'] = { academia: { ok: { 'modulo-0': true }, scores: {} } };
    db['users/alumna'] = { academia: { ok: { 'modulo-0': true }, scores: {} } };
    let { ctx, page } = await abrir('espana', 'academia.html', 'escritorio', { db });
    await listo(page, '.ac-m0');
    await page.evaluate(() => abrir('patologia-insuficiencia-cardiaca'));
    await listo(page, '.ac-sec');
    let t = await page.textContent('#app');
    esperar(/112 en España/.test(t) && !/SAME/.test(t), 'España no ve el 112');
    esperar(await page.evaluate(() => document.documentElement.lang) === 'es-ES', 'lang no es es-ES');
    await ctx.close();
    ({ ctx, page } = await abrir('alumna', 'academia.html', 'escritorio', { db }));
    await listo(page, '.ac-m0');
    await page.evaluate(() => abrir('patologia-insuficiencia-cardiaca'));
    await listo(page, '.ac-sec');
    t = await page.textContent('#app');
    esperar(/107 \(SAME\) o 911/.test(t) && !/112/.test(t), 'Argentina no ve 107 (SAME) o 911');
    esperar(/internación/.test(t), 'Argentina no ve "internación"');
    await page.click('#paisbtn');
    await page.waitForTimeout(200);
    esperar(/112 en España/.test(await page.textContent('#app')), 'El botón no cambia a España');
    esperar(await page.evaluate(() => JSON.parse(localStorage.getItem('ha_pais'))) === 'es', 'No guarda ha_pais');
    await sinErrores(page);
    await ctx.close();
  });
  await prueba('pais.js: sugerencias y marcas del glosario', async () => {
    const { ctx, page } = await abrir('editora', '404.html');
    await page.addScriptTag({ url: 'pais.js' });
    const r = await page.evaluate(() => [
      HA_PAIS.marcar('<p>Requiere ingreso. Ver [[ingreso|internación]].</p>', 'ingreso', 'internación'),
      HA_PAIS.sugerencias('<p>Llamar al 112. Sin ingresos.</p>').map(s => s.es).join(','),
      HA_PAIS.L('a [[x|y]] b', 'ar')
    ]);
    esperar(r[0] === '<p>Requiere [[ingreso|internación]]. Ver [[ingreso|internación]].</p>', 'marcar: ' + r[0]);
    esperar(r[1] === 'ingresos,112', 'sugerencias: ' + r[1]);
    esperar(r[2] === 'a y b', 'L: ' + r[2]);
    await ctx.close();
  });

  /* ---------- Estudio de la nueva Academy ---------- */
  await prueba('estudio-academia: una alumna no entra', async () => {
    const { ctx, page } = await abrir('alumna', 'estudio-academia.html');
    await page.waitForURL(/index\.html/, { timeout: 6000 });
    await ctx.close();
  });
  for (const pantalla of ['escritorio', 'celular']) {
    await prueba(`estudio-academia: la editora importa, edita y publica con gobernanza (${pantalla})`, async () => {
      const { ctx, page } = await abrir('editora', 'estudio-academia.html', pantalla);
      await listo(page, '#principal');
      await foto(page, 'estudio-academia-vacio-' + pantalla);
      await page.click('aside >> text=Importar material de Karina');
      await page.waitForFunction(() => document.querySelectorAll('aside .it').length > 50, null, { timeout: 8000 });
      let db = await leerDB(page);
      const ac = Object.keys(db).filter(k => /^academia\/[^/]+$/.test(k));
      esperar(ac.length === 61, 'Importó ' + ac.length + ' documentos');
      esperar(ac.every(k => db[k].estado === 'borrador'), 'Importó algo que no es borrador');
      await page.evaluate(() => abrirDoc('patologia-insuficiencia-cardiaca'));
      await listo(page, '#fT');
      await foto(page, 'estudio-academia-ic-' + pantalla);
      await sinDesborde(page);
      await axe(page, 'Estudio nueva Academy');
      await page.click('text=Agregar pregunta');
      await page.fill('#q_quiz0', 'Pregunta de prueba');
      await page.fill('[data-r="quiz.0.o.0"]', 'Correcta');
      await page.fill('[data-r="quiz.0.o.1"]', 'Incorrecta');
      await page.check('#c_quiz0_0');
      await page.check('.q .chk input');
      await page.click('.bar >> text=Publicar');
      await listo(page, '.prob');
      esperar(/revisor clínico/.test(await page.textContent('.prob')), 'Publicó sin revisor clínico');
      await page.fill('#gR', 'Revisión de prueba');
      await page.click('.bar >> text=Publicar');
      await page.waitForFunction(() => /publicado/.test(document.querySelector('main h1').textContent), null, { timeout: 6000 });
      db = await leerDB(page);
      const ic = db['academia/patologia-insuficiencia-cardiaca'];
      esperar(ic.estado === 'publicado' && ic.quiz[0].critica === true && ic.quiz[0].c === 0, 'No guardó bien: ' + JSON.stringify(ic.quiz));
      esperar(Object.keys(db).some(k => k.startsWith('academia/patologia-insuficiencia-cardiaca/versiones/')), 'No dejó versión anterior');
      await page.click('.bar >> text=Volver a borrador');
      await page.waitForFunction(() => /borrador/.test(document.querySelector('main h1').textContent), null, { timeout: 6000 });
      await page.click('.bar >> text=Archivar');
      await page.waitForFunction(() => /archivado/.test(document.querySelector('main h1').textContent), null, { timeout: 6000 });
      db = await leerDB(page);
      esperar(db['academia/patologia-insuficiencia-cardiaca'], 'Se borró en lugar de archivarse');
      await sinErrores(page);
      await ctx.close();
    });
  }
  await prueba('estudio-academia: plantillas de unidad y de patología', async () => {
    const { ctx, page } = await abrir('editora', 'estudio-academia.html');
    await listo(page, '#principal');
    page.removeAllListeners('dialog');
    const respuestas = ['EPOC'];
    page.on('dialog', d => d.type() === 'prompt' ? d.accept(respuestas.shift()) : d.accept());
    await page.click('aside >> text=Nueva patología');
    await listo(page, '#fT');
    const secs = await page.$$eval('.sec input[data-r$=".t"]', x => x.map(i => i.value));
    esperar(secs.length === 10 && /Definición y alcance/.test(secs[0]) && /reevaluación/.test(secs[9]), 'La plantilla de patología no tiene los 10 apartados');
    const db = await leerDB(page);
    esperar(db['academia/patologia-epoc'] && db['academia/patologia-epoc'].area === 'Respiratoria', 'No usa la ficha del catálogo');
    respuestas.push('Unidad de prueba', 'coordinacion');
    await page.click('aside >> text=Nueva unidad');
    await page.waitForFunction(() => /Unidad de prueba/.test(document.querySelector('main h1').textContent), null, { timeout: 6000 });
    const pasos = await page.$$eval('.sec input[data-r$=".t"]', x => x.map(i => i.value).join('|'));
    esperar(/Aprender/.test(pasos) && /Comprobar/.test(pasos) && /Bibliografía/.test(pasos), 'La plantilla de unidad no tiene los cinco pasos');
    await sinErrores(page);
    await ctx.close();
  });

  /* ---------- Escuela por usuario ---------- */
  await prueba('admin: asigna la escuela y una alumna no puede cambiársela', async () => {
    let { ctx, page } = await abrir('admin', 'index.html');
    await listo(page, '#app .mods');
    esperar(await page.$('#nuevad'), 'Falta el enlace a la nueva Academy para administradores');
    await page.evaluate(() => showAdmin());
    await listo(page, '#esc_alumna');
    await page.selectOption('#esc_alumna', 'enfermeria');
    await page.waitForTimeout(300);
    const db = await leerDB(page);
    esperar(db['users/alumna'].escuela === 'enfermeria', 'No se guardó la escuela');
    await foto(page, 'admin-escuelas');
    await axe(page, 'panel con escuelas');
    await sinErrores(page);
    await ctx.close();
    ({ ctx, page } = await abrir('alumna', 'index.html'));
    await listo(page, '#app .mods');
    esperar(await page.$('#nuevad'), 'Una alumna no ve el enlace a la nueva Academy');
    esperar(!(await page.$('#estudiod')), 'Una alumna ve el enlace al Estudio');
    const negado = await page.evaluate(() => firebase.firestore().collection('users').doc('alumna').set({ escuela: 'medicos' }, { merge: true }).then(() => false, e => e.code === 'permission-denied'));
    esperar(negado, 'La alumna pudo asignarse una escuela');
    await sinErrores(page);
    await ctx.close();
  });
};
