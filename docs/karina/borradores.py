"""Arma docs/karina/borradores.json a partir del material de Karina (noviembre de 2026).

El texto se copia tal cual de los originales de esta carpeta. Solo se agrega:
- marcas [[España|Argentina]] para la capa por país (léxico y datos locales, nunca contenido clínico);
- "Humana Intelligence" donde la Doctrina escribe "Humana Intelligen" (decisión de la guía, sección 7).
La prueba pruebas/academia.pruebas.js verifica que cada frase exista en material-karina.md.

Uso: python3 docs/karina/borradores.py
Todo sale como borrador. Se importa desde el Estudio de la nueva Academy y lo publica Karina.
"""
import json, os

AQUI = os.path.dirname(os.path.abspath(__file__))
E112 = '[[112 en España|107 (SAME) o 911, según la jurisdicción]]'

def p(*xs): return ''.join('<p>' + x + '</p>' for x in xs)
def ul(*xs): return '<ul>' + ''.join('<li>' + x + '</li>' for x in xs) + '</ul>'
def ol(*xs): return '<ol>' + ''.join('<li>' + x + '</li>' for x in xs) + '</ol>'
def tabla(cab, filas):
    h = '<table>'
    if cab: h += '<thead><tr>' + ''.join('<th>' + c + '</th>' for c in cab) + '</tr></thead>'
    h += '<tbody>' + ''.join('<tr>' + ''.join('<td>' + c + '</td>' for c in f) + '</tr>' for f in filas) + '</tbody></table>'
    return h
def sec(id, t, body, **kw):
    d = {'id': id, 't': t, 'body': body}; d.update(kw); return d

ESCUELAS = ['medicos', 'enfermeria', 'kinesiologia', 'cuidadores', 'pacientes', 'coordinacion']

GOB_DOCTRINA = {'autor': 'Dirección Médica · Dra. Karina Ojanguren', 'revisor': '', 'version': 'Borrador v2',
                'fecha': '2026-11', 'referencias': 'Doctrina Humana, nueva edición, borrador v2 (noviembre de 2026)',
                'proximaRevision': '2027-05'}
def gob(ref, version='Versión de trabajo'):
    return {'autor': 'Dirección Médica · Dra. Karina Ojanguren', 'revisor': '', 'version': version,
            'fecha': '2026-11', 'referencias': ref, 'proximaRevision': ''}

docs = []

# ---------------------------------------------------------------- Módulo 0 · Doctrina Humana
doctrina = [
 sec('d01', '01 · Cómo leer esta doctrina · Un núcleo estable y criterios vivos', p(
  'Esta doctrina tiene dos capas. El núcleo recoge lo que no cambia aunque cambien el mercado, la tecnología o los servicios: la tesis, los principios y las líneas firmes. Los criterios recogen cómo aplicamos ese núcleo hoy, y se revisan cada seis meses.',
  'Trabajamos en un sector que cambia cada trimestre. Por eso la doctrina orienta decisiones y no las sustituye. Si algo nuevo aporta valor y no encaja en el texto, se aplica el test de coherencia antes de descartarlo.',
  'La doctrina es el Módulo 0 de Humana Academy: el tronco doctrinal obligatorio para todo el equipo. Tiene cuatro partes: el núcleo (principios, líneas firmes, test de coherencia y Carta Magna), los conceptos clave, cómo se organiza el conocimiento y la arquitectura de Humana Academy. El núcleo se lee en 15 minutos; el resto es de consulta.'), parte='intro'),
 sec('d02', '02 · Por qué existe Humana · Dirección clínica domiciliaria',
  '<div class="quote">Humana dirige la atención clínica del paciente complejo a lo largo de toda su trayectoria (en casa, en consulta y en las transiciones hospitalarias), con un criterio común que conecta a todos los que intervienen en su cuidado.</div>'
  + p('La medicina sabe tratar enfermedades. Lo que falta es alguien que organice el conjunto cuando una persona vive con varias enfermedades, varios profesionales y una familia que cuida. Esa organización es un acto clínico, y es lo que hacemos.',
      'Humana existe desde 2011. Nace de la práctica domiciliaria que la Dra. Karina Ojanguren inició en 2010. Hoy esa práctica está escrita como método Humana y se apoya en tecnología propia, Humana Intelligence.',
      '<strong>Pregunta central:</strong> ¿quién dirige el cuidado de esta persona entre una visita y la siguiente?'), parte='intro'),
 sec('d03', '03 · Principios · Ocho principios',
  p('Los cuatro primeros describen cómo cuidamos; los cuatro últimos, cómo funciona la organización que cuida.')
  + '<h3>01 · El paciente vive entre visitas</h3>' + p('<strong>Idea.</strong> La unidad de trabajo es la trayectoria del paciente, no la visita ni el [[ingreso|internación]].', '<strong>En la práctica.</strong> Cada decisión se toma pensando en lo que pasará en las semanas siguientes y queda conectada con la anterior.', '<strong>Cómo lo sabemos.</strong> Cualquier profesional que abre la historia entiende en dos minutos dónde está el paciente y hacia dónde va.')
  + '<h3>02 · La casa es un entorno clínico</h3>' + p('<strong>Idea.</strong> El domicilio tiene sus propios riesgos, recursos y reglas. Ahí se ve cómo vive de verdad una persona.', '<strong>En la práctica.</strong> El contexto social, la vivienda y el cuidador forman parte de la valoración clínica.', '<strong>Cómo lo sabemos.</strong> El plan de cada paciente recoge quién le cuida, con qué recursos y qué puede fallar en casa.')
  + '<h3>03 · Dirigir el cuidado es una función clínica</h3>' + p('<strong>Idea.</strong> La unidad de gobierno es la decisión registrada. Cada paciente tiene una dirección clínica identificada. Todos comparten el mismo itinerario, pero no las mismas atribuciones: cada perfil observa, valora o decide según su competencia.', '<strong>En la práctica.</strong> El trabajo sigue un mismo ciclo para todos: comprender, valorar, clasificar, planificar, observar, actuar, comunicar y comprobar. Ante un cambio, el circuito es observar › registrar › valorar › decidir › comprobar. La estratificación clínica (H1–H4) la asigna el equipo clínico; pacientes y cuidadores conocen sus implicaciones.', '<strong>Cómo lo sabemos.</strong> Toda decisión relevante tiene autor, fecha y motivo, y nadie decide fuera de su competencia.')
  + '<h3>04 · La familia forma parte del equipo</h3>' + p('<strong>Idea.</strong> El cuidador y el propio paciente ven lo que el profesional no ve. Una familia alineada evita crisis.', '<strong>En la práctica.</strong> Pacientes y cuidadores se forman en Humana Academy, igual que los profesionales, con su propio lenguaje. Aprenden qué vigilar, cómo avisar y qué no deben hacer: no diagnostican ni modifican la medicación por su cuenta.', '<strong>Cómo lo sabemos.</strong> El cuidador principal está identificado, sabe contar qué ha cambiado y desde cuándo, y tiene un canal directo con la dirección clínica.')
  + '<h3>05 · Los pequeños cambios avisan antes que las crisis</h3>' + p('<strong>Idea.</strong> Muchas descompensaciones empiezan como cambios pequeños en el día a día: come menos, duerme peor, se cansa antes. Un cambio solo tiene sentido comparado con la situación basal de cada paciente.', '<strong>En la práctica.</strong> Documentamos la situación basal y registramos los microcambios frente a ella. Los umbrales se personalizan; no hay un valor universal. Un cambio pide comunicación y valoración, pero no confirma por sí solo un diagnóstico.', '<strong>Cómo lo sabemos.</strong> Medimos cuántas señales terminan en una intervención que evita un traslado. Es nuestra hipótesis de trabajo más importante y la tratamos como tal hasta tener datos.')
  + '<h3>06 · El criterio se escribe para que no se pierda</h3>' + p('<strong>Idea.</strong> La experiencia es de una persona; el conocimiento escrito es de la organización.', '<strong>En la práctica.</strong> El criterio clínico de Humana se documenta en el Manual Maestro y se enseña en Humana Academy. Ese conocimiento pertenece a Humana.', '<strong>Cómo lo sabemos.</strong> Un profesional nuevo decide como decidiría la dirección médica en los casos frecuentes.')
  + '<h3>07 · La calidad se diseña</h3>' + p('<strong>Idea.</strong> Una organización no puede depender del esfuerzo heroico de unos pocos.', '<strong>En la práctica.</strong> Los procesos hacen fácil la decisión segura y difícil el error. Cada evento adverso o [[ingreso|internación]] evitable cambia un proceso.', '<strong>Cómo lo sabemos.</strong> Los resultados se mantienen cuando cambia el equipo.')
  + '<h3>08 · Solo prometemos lo que podemos demostrar</h3>' + p('<strong>Idea.</strong> La confianza de [[aseguradoras|prepagas, obras sociales e instituciones]], hospitales y familias es nuestro activo más frágil.', '<strong>En la práctica.</strong> Toda afirmación se clasifica de A a E (verificado, documentado, observado, aspiracional, no autorizado). Lo que no está demostrado se presenta como objetivo.', '<strong>Cómo lo sabemos.</strong> Ninguna pieza externa contiene afirmaciones de nivel D o E presentadas como resultado.'),
  parte='nucleo'),
 sec('d04', '04 · Inteligencia artificial · La IA propone; la dirección clínica decide',
  '<div class="quote">Usamos la IA para todo lo que la haga mejor que nosotros, y reservamos para las personas la decisión y la responsabilidad.</div>'
  + p('La IA ya lee, resume, relaciona antecedentes, detecta patrones, prioriza y explica, y lo hará cada año mejor. Separamos el trabajo por responsabilidad, no por capacidad.')
  + tabla(['Lo hace la tecnología', 'Exige responsabilidad clínica'], [
     ['Registrar y ordenar lo que pasa en casa', 'Escuchar al paciente y a su familia'],
     ['Detectar microcambios y emitir señales', 'Decidir si una señal requiere intervenir'],
     ['Proponer prioridades y siguientes pasos', 'Fijar el plan y firmarlo'],
     ['Preparar informes, resúmenes y documentación', 'Explicar la decisión y responder de ella'],
     ['Conservar y consultar el criterio escrito de Humana', 'Revisar y actualizar ese criterio']])
  + '<h3>Tres reglas de uso</h3>' + ol('<strong>Señalar sin diagnosticar.</strong> Humana Intelligence emite alertas y señales de cambio para vigilar, siempre sujetas a validación clínica. No diagnostica ni prescribe.',
     '<strong>Cada propuesta tiene un revisor con nombre.</strong> Lo que la IA propone y se aplica queda registrado con quien lo aprobó.',
     '<strong>Adoptamos rápido lo que mejora una decisión.</strong> Una herramienta nueva entra si reduce errores, ahorra tiempo clínico o mejora la anticipación. Se retira si no lo demuestra.'), parte='consulta'),
 sec('d05', '05 · Líneas firmes · Lo que no se negocia',
  p('Seis líneas se mantienen aunque un cliente, un socio o una oportunidad pidan otra cosa.')
  + ol('Toda decisión clínica y toda alerta tienen un responsable con nombre.',
       'Una emergencia activa el circuito urgente sin esperar a la revisión ordinaria.',
       'Todo servicio con la marca Humana declara su modelo: dirección clínica directa de Humana o supervisión metodológica y tecnológica. Esto incluye los servicios de cuidados y los socios que usan nuestro respaldo.',
       'Los datos del paciente se usan para cuidarle. Cualquier otro uso requiere su consentimiento y una base legal verificada.',
       'Ninguna afirmación sin soporte llega a un cliente. Si no hay dato, se dice que no lo hay.',
       'El conocimiento clínico de Humana es propiedad de Humana. Ningún acuerdo tecnológico o comercial lo cede.'), parte='nucleo'),
 sec('d06', '06 · Cuando algo nuevo no encaja · El test de coherencia',
  p('Un servicio, una herramienta o un acuerdo nuevo no necesita estar en la doctrina para seguir adelante. Necesita pasar estas cinco preguntas:')
  + ol('¿Mejora una decisión clínica sobre la trayectoria de un paciente?', '¿Queda registrado y con un responsable?', '¿Podemos medir si funciona?', '¿Lo podemos explicar sin afirmaciones de nivel D o E?', '¿Genera ingresos, protege la reputación o fortalece nuestra posición?')
  + tabla(['Si…', 'Entonces'], [['Choca con una línea firme', 'No se hace.'], ['Pasa las cinco preguntas', 'Se hace, aunque la doctrina no lo mencione.'], ['Choca con un principio pero aporta valor', 'Se prueba de forma acotada y se lleva a la siguiente revisión. Puede que el principio necesite cambiar.']]), parte='nucleo'),
 sec('d07', '07 · Conceptos clave · Diez conceptos para un mismo lenguaje',
  p('Desarrollan los principios y forman el vocabulario de trabajo de todo el equipo. Cada uno se explica con el mismo caso: Antonio, 82 años, insuficiencia cardíaca, fragilidad y dependencia parcial, que vive en casa con apoyo familiar.')
  + '<h3>01 · Trayectoria clínica</h3>' + p('La evolución del paciente a lo largo del tiempo, con sus periodos de estabilidad, sus crisis y sus transiciones. Es nuestra unidad de trabajo: cada visita, llamada o [[ingreso|internación]] es un punto dentro de ella.', '<strong>En la práctica.</strong> Antes de decidir, preguntamos de dónde viene el paciente y hacia dónde va, no solo qué le pasa hoy.', '<strong>Con Antonio.</strong> Dos [[ingresos|internaciones]] por descompensación en un año no son dos episodios aislados. Son una trayectoria que pide anticipar [[el tercero|la tercera]].')
  + '<h3>02 · Gestión clínica longitudinal</h3>' + p('Dirigimos la trayectoria completa: consulta, domicilio y transiciones hospitalarias. El domicilio es donde más tiempo pasa el paciente, pero el modelo integra también el antes y el después de cada [[ingreso|internación]].', '<strong>En la práctica.</strong> El alta es un cambio de escenario. El plan se revisa al salir del hospital y la información [[del ingreso|de la internación]] entra en la historia.', '<strong>Con Antonio.</strong> Tras el alta, su plan se ajusta en los primeros días con lo que cambió en el hospital.')
  + '<h3>03 · Unidad de cuidado distribuida</h3>' + p('El paciente, la familia, el cuidador profesional, los equipos sanitarios del territorio y la central de coordinación de Humana forman una misma estructura asistencial, con competencias y responsabilidades distintas.', '<strong>En la práctica.</strong> Todos comparten el mismo plan y el mismo circuito de comunicación. Nadie trabaja con información que los demás no tienen.', '<strong>Con Antonio.</strong> La cuidadora, la enfermera, el médico de Humana y su médico de atención primaria saben quién hace qué y a quién avisar.')
  + '<h3>04 · Situación basal</h3>' + p('El estado habitual del paciente cuando está estable: cómo respira, cuánto camina, cómo duerme, qué come, qué entiende. Todo cambio se interpreta frente a ella.', '<strong>En la práctica.</strong> Se documenta al inicio y se actualiza cuando cambia la situación del paciente.', '<strong>Con Antonio.</strong> Camina dentro de casa con ayuda, duerme con una almohada y no tiene disnea en reposo.')
  + '<h3>05 · Microcambio y señal</h3>' + p('Un microcambio es una variación pequeña respecto a la situación basal. Cuando se registra y la dirección clínica debe revisarlo, se convierte en señal. Detectarlos a tiempo es uno de los elementos diferenciales del método Humana.', '<strong>En la práctica.</strong> Los umbrales se personalizan por paciente. Un cambio pide comunicación y valoración, pero no confirma por sí solo un diagnóstico.', '<strong>Con Antonio.</strong> Durante tres días se cansa más, gana peso y necesita más almohadas. La cuidadora lo anota y avisa.')
  + '<h3>06 · Estratificación dinámica (H1–H4)</h3>' + p('No todos los pacientes necesitan la misma intensidad asistencial. La clasificación H1–H4 orienta el plan de salud, los recursos y la frecuencia de seguimiento. El nivel sube o baja cuando cambia la situación del paciente.', '<strong>En la práctica.</strong> El nivel lo asigna el equipo clínico. Pacientes y cuidadores conocen lo que implica, pero no lo asignan.', '<strong>Con Antonio.</strong> Si la señal se confirma como descompensación, su nivel puede subir durante semanas y volver a bajar al estabilizarse.')
  + '<h3>07 · Plan de salud y evaluación del resultado</h3>' + p('El plan fija objetivos, intervenciones y frecuencia de seguimiento. No basta con registrar lo que hacemos: tenemos que saber qué pasó después de cada intervención y decidir si el plan se mantiene, se modifica o se intensifica.', '<strong>En la práctica.</strong> Cada intervención relevante tiene un resultado registrado y una fecha de revisión. Una mejoría clínica no prueba por sí sola el diagnóstico inicial.', '<strong>Con Antonio.</strong> Tras el ajuste, se comprueba en los días siguientes si recupera su situación basal y se actualiza el plan.')
  + '<h3>08 · Autonomía del paciente</h3>' + p('Las preferencias del paciente, sus objetivos terapéuticos y su calidad de vida forman parte de cada decisión. El mejor plan es el que el paciente entiende y acepta.', '<strong>En la práctica.</strong> Los objetivos del paciente se registran en el plan y se revisan con él y con su familia.', '<strong>Con Antonio.</strong> Si prefiere evitar [[nuevos ingresos|nuevas internaciones]] aunque eso limite algunas pruebas, esa preferencia orienta las decisiones.')
  + '<h3>09 · Seguridad asistencial</h3>' + p('La seguridad depende de que estén claros las competencias, los límites de actuación, los horarios de cobertura y los circuitos de comunicación y escalado. La respuesta es escalonada.', '<strong>En la práctica.</strong> Los signos de gravedad de la tabla proceden del módulo de insuficiencia cardíaca de Humana Academy; cada módulo de patología define los suyos.')
  + tabla(['Situación', 'Respuesta'], [['Cambio leve', 'Registrar y comunicar por el circuito establecido'], ['Deterioro progresivo', 'Valoración clínica pronta'], ['Signos de gravedad (disnea intensa en reposo, dolor torácico persistente, síncope, confusión aguda grave)', 'Activar emergencias, ' + E112 + ', sin esperar a la revisión ordinaria']])
  + '<h3>10 · Dirección clínica directa y supervisión metodológica</h3>' + p('Humana puede intervenir de dos formas, y hay que distinguirlas, sobre todo al crecer y al firmar acuerdos con otros operadores sanitarios.', '<strong>En la práctica.</strong> Cada servicio con la marca Humana declara cuál de los dos modelos aplica (línea firme 3).')
  + tabla(['', 'Dirección clínica directa', 'Supervisión metodológica y tecnológica'], [['Quién decide sobre el paciente', 'El equipo clínico de Humana', 'El equipo clínico del operador'], ['Qué aporta Humana', 'Decisión, seguimiento y responsabilidad clínica', 'Método, formación, tecnología y auditoría'], ['Responsabilidad clínica', 'Humana', 'El operador']]), parte='consulta'),
 sec('d08', '08 · Cómo se organiza el conocimiento · Cuatro estructuras, un ciclo',
  p('El conocimiento de Humana vive en cuatro estructuras conectadas. Ninguna funciona por separado.')
  + ul('<strong>Doctrina Humana</strong> · Cómo pensamos', '<strong>Manual Maestro</strong> del método Humana · Cómo trabajamos', '<strong>Humana Academy</strong> · Cómo transmitimos y evaluamos', '<strong>Impacto Humana</strong> · Cómo medimos y validamos')
  + p('Los resultados que mide Impacto Humana actualizan el Manual Maestro y los contenidos de Humana Academy y, cuando corresponde, motivan una revisión de esta doctrina. Así se construye un sistema de aprendizaje continuo.'), parte='consulta', grafico=True),
 sec('d09', '09 · Humana Academy · Una misma lógica asistencial para todos',
  p('Humana Academy enseña a todos los perfiles a integrar lo que ya saben dentro de una misma lógica asistencial. Todos deben entender qué observamos, por qué, cómo lo comunicamos, quién toma cada decisión y cómo comprobamos el resultado.',
    'La estructura es común. Cambian el lenguaje, la profundidad y las competencias exigibles a cada perfil. Compartir el itinerario no significa compartir atribuciones clínicas.')
  + tabla(['Módulo', 'Contenido', 'Para quién'], [
     ['0 · Doctrina Humana', 'Principios, líneas firmes, conceptos clave y Carta Magna. Tronco doctrinal obligatorio', 'Todos'],
     ['1 · Tronco metodológico común', 'Cronicidad y complejidad · valoración integral · situación clínica y funcional basal · estratificación H1–H4 · plan de salud · microcambios · comunicación y coordinación · seguridad y evaluación de resultados', 'Todos, adaptado a cada perfil'],
     ['2 · Formación por perfil', 'Seis escuelas: médicos · enfermería · fisioterapia y kinesiología · cuidadores · pacientes y familiares · coordinadores y responsables de unidades asistenciales', 'Cada perfil, su escuela'],
     ['3 · Patologías', 'Cardiovascular, respiratoria, neurológica, metabólica, fragilidad, dependencia, heridas complejas, paliativos y otras. Prioridad: insuficiencia cardíaca, EPOC, demencias, diabetes y fragilidad', 'Todos, cada uno desde su responsabilidad'],
     ['4 · Herramientas tecnológicas', 'Historia clínica (Humana Uno) · Humana Intelligence · app del paciente y del cuidador · comunicación, alertas y coordinación · Impacto Humana', 'Según permisos de cada rol'],
     ['5 · Aplicación práctica y evaluación', 'Casos clínicos, detección de microcambios, simulación de situaciones asistenciales, uso de las herramientas y evaluación de competencias', 'Todos']])
  + '<h3>Cómo se construye cada patología</h3>' + p('Se parte de una ficha clínica maestra validada por la Dirección Médica, con un índice único de diez apartados: definición · causas y evolución · síntomas · valoración · tratamientos y cuidados · criterios de estabilidad · microcambios y signos de deterioro · actuaciones por perfil y límites · comunicación y escalado · registro y resultados. De esa ficha salen seis versiones, una por escuela.')
  + '<h3>Cómo se enseña</h3>' + p('Cada unidad sigue cinco pasos: aprender (explicación breve), comprender (un caso común contado con el lenguaje de cada perfil), aplicar (ejercicio dentro de las competencias), registrar y comunicar (con las herramientas reales) y comprobar (evaluación).')
  + '<h3>Cómo se evalúa</h3>' + p('Preguntas de conocimiento y una simulación del caso. Para aprobar no basta con la nota: no se puede cometer ningún error crítico de seguridad, como omitir una emergencia o recomendar un cambio de medicación sin habilitación.')
  + '<h3>Gobernanza</h3>' + p('Cada contenido identifica autor, revisor clínico, versión, fecha y referencias. Los umbrales de alerta y las recomendaciones terapéuticas se fijan en protocolos específicos, no en los materiales formativos.')
  + '<div class="quote">Humana Academy convierte el método Humana en conocimiento que se transmite, se evalúa, se actualiza y se reproduce en distintos territorios, sin depender de las personas que lo han desarrollado.</div>', parte='consulta'),
 sec('d10', '10 · Vocabulario y actualización · Cómo hablamos y cómo cambiamos',
  p('El vocabulario forma parte de los criterios: se revisa con la doctrina.')
  + tabla(['Usamos', 'Evitamos', 'Motivo'], [
     ['Dirección clínica domiciliaria', 'Humanización', 'Describe una función concreta, no una actitud'],
     ['Trayectoria, continuidad asistencial', 'Acompañamiento', 'Indica proceso clínico con responsable'],
     ['Paciente complejo, post-alta', 'Cercanía', 'Define el segmento que atendemos'],
     ['Gasto gestionado, trazabilidad', 'Ahorro garantizado', 'Solo prometemos lo demostrable'],
     ['método Humana', 'Método CASA', 'Nombre retirado en septiembre de 2026'],
     ['Humana, desde 2011', 'Más de 15 años', 'Mensaje de trayectoria vigente'],
     ['Internación domiciliaria (Argentina)', 'Hospitalización a domicilio (Argentina)', 'Uso local']])
  + '<h3>Cómo se actualiza la doctrina</h3>' + ol('Revisión de criterios cada seis meses. Primera revisión propuesta: mayo de 2027.', 'Los cambios en el núcleo requieren la aprobación de la Dirección Médica y de Dirección General.', 'Cualquier persona del equipo puede proponer un cambio por escrito, con el caso que lo motiva.', 'Cada versión lleva número y fecha. La anterior se archiva.'), parte='consulta'),
 sec('carta', 'Carta Magna · Dirigir el cuidado allí donde las personas viven',
  p('Creemos que el futuro de la medicina también se decide en la capacidad de dirigir el cuidado allí donde las personas viven. Por eso nos comprometemos a:')
  + ul('Dirigir cada trayectoria con un criterio común y un responsable con nombre.', 'Anticipar en lugar de reaccionar, leyendo los pequeños cambios antes de que sean crisis.', 'Incorporar a la familia como parte del equipo.', 'Usar la tecnología para ampliar el criterio clínico y para que el conocimiento no dependa de la memoria de una persona.', 'Diseñar la calidad en lugar de confiarla al esfuerzo individual.', 'Aprender de cada paciente para cuidar mejor al siguiente.', 'Prometer solo lo que podemos demostrar.')
  + p('Nuestro mayor patrimonio es el conocimiento que conservamos, compartimos y hacemos crecer. Y lo ponemos siempre al servicio de la persona, por encima del episodio.'), parte='nucleo'),
]
docs.append({'id': 'modulo-0', 'tipo': 'doctrina', 'modulo': 0, 'orden': 0, 't': 'Doctrina Humana',
  'sub': 'Cómo dirigimos el cuidado del paciente complejo en su casa', 'lead': 'Edición de trabajo para validación de la Dirección Médica',
  'secciones': doctrina, 'quiz': [], 'simulacion': None, 'reflexion': [], 'video': '', 'gobernanza': GOB_DOCTRINA,
  'fuente': 'Doctrina_Humana_nueva_edicion_borrador_v2.pdf'})

# ---------------------------------------------------------------- Módulo 1 · Programa Integral Visual
GOB_PIV = gob('Humana Academy · Programa Integral Visual · Documento de arquitectura docente (noviembre de 2026)')
docs.append({'id': 'programa-integral', 'tipo': 'programa', 'modulo': 1, 'orden': 0, 't': 'Programa integral',
  'sub': 'Documento de arquitectura docente', 'lead': 'Una misma doctrina asistencial, nueve troncos comunes y seis escuelas.',
  'secciones': [
   sec('principio', 'Principio rector', p('Una misma doctrina asistencial, nueve troncos comunes y seis escuelas. El vocabulario, la profundidad y las competencias se adaptan a cada destinatario. Compartir el itinerario no significa compartir atribuciones clínicas.')),
   sec('caso', 'Caso transversal: del microcambio al resultado',
     ol('<strong>Cuidador / paciente</strong> · Comunica una señal', '<strong>Enfermería</strong> · Valora y registra', '<strong>Médico</strong> · Decide y ajusta', '<strong>Coordinación</strong> · Organiza actuaciones', '<strong>Equipo</strong> · Comprueba evolución')
     + p('Ejemplo docente: cambio en disnea respecto al basal. La respuesta depende de la gravedad y de los protocolos de seguridad. En emergencias se activa el circuito urgente correspondiente, sin esperar a la revisión ordinaria.'), grafico=True),
   sec('metodo', 'Método de enseñanza y evaluación', ul('<strong>Aprender:</strong> Explicación breve adaptada al destinatario.', '<strong>Comprender:</strong> Caso clínico o cotidiano común, contado con distinto vocabulario.', '<strong>Aplicar:</strong> Ejercicio práctico delimitado por competencias.', '<strong>Registrar y comunicar:</strong> Uso de herramientas y circuitos cuando proceda.', '<strong>Comprobar:</strong> Evaluación de conocimientos y desempeño observable.')),
   sec('implantacion', 'Implantación propuesta', p('Fase 1: validar el índice maestro y las competencias de cada escuela. Fase 2: desarrollar las nueve unidades maestras. Fase 3: adaptar materiales, vídeos y casos a cada perfil. Fase 4: añadir módulos clínicos o técnicos especializados. Fase 5: pilotar, evaluar y revisar contenidos.')),
   sec('gobernanza', 'Nota de gobernanza', p('H1–H4 es una clasificación clínica interna. Pacientes y cuidadores conocen sus implicaciones prácticas, pero no asignan el nivel. La respuesta favorable a un tratamiento no confirma por sí sola un diagnóstico.')),
  ], 'quiz': [], 'simulacion': None, 'reflexion': [], 'video': '', 'gobernanza': GOB_PIV,
  'fuente': 'Humana_Academy_Programa_Integral_Visual.docx'})

TRONCOS = [
 ('Comprender', 'Persona y contexto', ['Abordaje integral del paciente crónico complejo', 'Conocer al paciente y sus necesidades', 'Comprender su situación funcional', 'Conocer a la persona que cuido', 'Comprender mi salud y mi entorno', 'Identificar necesidades asistenciales y organizativas'], 'comprender a la persona y su contexto.'),
 ('Valorar', 'Situación inicial', ['Valoración clínica multidimensional', 'Valoración enfermera y riesgos', 'Valoración funcional y movilidad', 'Reconocer necesidades y cambios habituales', 'Reconocer mi estado habitual', 'Recoger y verificar información'], 'identificar la situación basal y las necesidades.'),
 ('Clasificar', 'Complejidad y riesgo', ['Estratificación clínica H1–H4', 'Comprender intensidad y necesidades de seguimiento', 'Reconocer riesgo de deterioro funcional', 'Saber cuándo se necesita más ayuda', 'Comprender cambios en mi nivel de atención', 'Aplicar operativamente el nivel asignado'], 'interpretar estabilidad, complejidad y riesgo.'),
 ('Planificar', 'Objetivos y tareas', ['Plan individualizado y objetivos terapéuticos', 'Plan de cuidados y seguimiento', 'Objetivos de rehabilitación', 'Organizar cuidados diarios', 'Conocer mi plan y mis tareas', 'Programar tareas, agendas y recursos'], 'definir y organizar un plan individualizado.'),
 ('Observar', 'Microcambios', ['Interpretar microcambios y descompensación', 'Detectar signos de deterioro', 'Detectar cambios funcionales', 'Identificar pequeñas señales', 'Reconocer cambios en mi salud', 'Recibir y escalar alertas'], 'reconocer cambios respecto a la situación habitual.'),
 ('Actuar', 'Respuesta adecuada', ['Decisiones diagnósticas y terapéuticas', 'Intervenciones dentro de competencia', 'Adaptar intervención y derivar', 'Seguir instrucciones y pedir ayuda', 'Autocuidado y cuándo consultar', 'Activar circuitos y recursos'], 'responder dentro de las competencias y activar ayuda.'),
 ('Comunicar', 'Continuidad asistencial', ['Comunicación clínica interdisciplinar', 'Registro y transmisión estructurada', 'Comunicar evolución funcional', 'Explicar lo observado', 'Comunicar síntomas y dudas', 'Trazabilidad de comunicaciones'], 'transmitir información útil y a tiempo.'),
 ('Comprobar', 'Evolución y resultados', ['Evaluar respuesta y modificar tratamiento', 'Evaluar resultados de cuidados', 'Medir resultados funcionales', 'Observar si los cuidados ayudan', 'Reconocer avances y dificultades', 'Verificar ejecución y cerrar incidencias'], 'verificar resultados y actualizar el plan.'),
 ('Tecnología', 'Registro y coordinación', ['Humana Uno e Intelligence para decisiones', 'Registro, tareas y alertas', 'Registro funcional y resultados', 'App cuidador y tareas', 'App paciente y formación', 'Panel de coordinación y seguimiento'], 'utilizar las herramientas con seguridad y trazabilidad.'),
]
for i, (t, sub, vers, obj) in enumerate(TRONCOS, 1):
    docs.append({'id': 'tronco-%02d' % i, 'tipo': 'tronco', 'modulo': 1, 'orden': i, 'n': i, 't': t, 'sub': sub,
      'lead': 'Objetivo común: ' + obj, 'secciones': [],
      'versiones': {e: {'lead': vers[k], 'secciones': [], 'quiz': [], 'reflexion': []} for k, e in enumerate(ESCUELAS)},
      'quiz': [], 'simulacion': None, 'reflexion': [], 'video': '', 'gobernanza': GOB_PIV,
      'fuente': 'Humana_Academy_Programa_Integral_Visual.docx · 3. Adaptación de contenidos por perfil'})

# ---------------------------------------------------------------- Módulo 2 · Escuelas
GOB_PE = gob('Humana Academy · Programa por Enfermedades · Propuesta curricular para validación por Dirección Médica (noviembre de 2026)')
ESC = [
 ('medicos', 'Médicos', 'Decisiones clínicas', 'Diagnóstico diferencial, tratamiento, decisiones clínicas, seguimiento y derivación.'),
 ('enfermeria', 'Enfermería', 'Cuidados y seguimiento', 'Valoración enfermera, monitorización, educación, intervenciones y comunicación.'),
 ('kinesiologia', 'Fisioterapia / Kinesiología', 'Funcionalidad', 'Función, ejercicio seguro, tolerancia, rehabilitación y comunicación de incidencias.'),
 ('cuidadores', 'Cuidadores', 'Observación cotidiana', 'Rutinas de cuidado, señales observables, comunicación y límites de actuación.'),
 ('pacientes', 'Pacientes y familiares', 'Autocuidado', 'Comprensión de la enfermedad, autocuidado pactado, adherencia y solicitud de ayuda.'),
 ('coordinacion', 'Coordinación asistencial', 'Circuitos y recursos', 'Circuitos, agendas, seguimiento de tareas, trazabilidad y escalado de alertas.'),
]
for k, (id, t, eje, prof) in enumerate(ESC, 1):
    docs.append({'id': 'escuela-' + id, 'tipo': 'escuela', 'modulo': 2, 'orden': k, 'escuela': id, 't': t, 'sub': eje,
      'lead': eje, 'secciones': [sec('profundidad', 'Profundidad y responsabilidad en patologías', p(prof))],
      'unidades': [], 'quiz': [], 'simulacion': None, 'reflexion': [], 'video': '', 'gobernanza': gob('Programa Integral Visual (2. Las seis escuelas) · Programa por Enfermedades (4. Adaptación a las seis escuelas)'),
      'fuente': 'Programa Integral Visual · Programa por Enfermedades'})

# Índice de formación: ocho unidades por escuela (Coordinación asistencial todavía no tiene).
import re
INDICE = {'Médicos': 'medicos', 'Enfermería': 'enfermeria', 'Fisioterapia': 'kinesiologia', 'Cuidadores': 'cuidadores', 'Pacientes': 'pacientes'}
AR_FISIO = lambda x: x.replace('la fisioterapia', 'la [[fisioterapia|kinesiología]]').replace('Plan de fisioterapia', 'Plan de [[fisioterapia|kinesiología]]')
txt = open(os.path.join(AQUI, 'Indice_de_formacion.md'), encoding='utf-8').read()
intro = txt.split('## ')[0].strip().split('\n')[-1]
for bloque in txt.split('## Escuela de ')[1:]:
    lineas = bloque.strip().split('\n')
    esc = INDICE[lineas[0].strip()]
    for l in lineas[1:]:
        m = re.match(r'(\d)\. ([^.]+\.) (.*)$', l.strip())
        if not m: continue
        n, t, d = int(m.group(1)), m.group(2)[:-1], m.group(3)
        if esc == 'kinesiologia': t, d = AR_FISIO(t), AR_FISIO(d)
        docs.append({'id': 'unidad-%s-%02d' % (esc, n), 'tipo': 'unidad', 'modulo': 2, 'orden': n, 'n': n, 'escuela': esc,
          't': t, 'lead': d, 'secciones': [], 'quiz': [], 'simulacion': None, 'reflexion': [], 'video': '',
          'gobernanza': gob('Índice de formación (noviembre de 2026)'), 'fuente': 'Indice_de_formacion.md'})
for d in docs:
    if d['tipo'] == 'escuela' and d['escuela'] != 'coordinacion':
        d['secciones'].insert(0, sec('proceso', 'El proceso maestro de Humana', p(intro)))

# ---------------------------------------------------------------- Módulo 3 · Patologías
AREAS = [
 ('Cardiovascular', ['Insuficiencia cardíaca', 'hipertensión arterial', 'fibrilación auricular', 'cardiopatía isquémica']),
 ('Respiratoria', ['EPOC', 'asma', 'insuficiencia respiratoria', 'neumonía']),
 ('Neurológica', ['Demencias', 'enfermedad de Parkinson', 'ictus y secuelas']),
 ('Endocrina y metabólica', ['Diabetes mellitus', 'trastornos tiroideos', 'desnutrición', 'obesidad']),
 ('Renal y urinaria', ['Enfermedad renal crónica', 'infección urinaria', 'incontinencia', 'retención urinaria']),
 ('Digestiva y deglución', ['Estreñimiento', 'disfagia', 'reflujo', 'trastornos digestivos frecuentes']),
 ('Musculoesquelética y funcional', ['Artrosis', 'osteoporosis', 'sarcopenia', 'caídas']),
 ('Piel y heridas', ['Lesiones por presión', 'heridas crónicas', 'lesiones vasculares', 'pie diabético']),
 ('Salud mental y cognición', ['Depresión', 'ansiedad', 'insomnio', 'delirium']),
 ('Oncología y paliativos', ['Enfermedad oncológica avanzada', 'dolor', 'control de síntomas', 'final de vida']),
 ('Síndromes transversales', ['Fragilidad', 'pluripatología', 'polifarmacia', 'dependencia']),
]
docs.append({'id': 'programa-enfermedades', 'tipo': 'programa', 'modulo': 3, 'orden': 0, 't': 'Programa por enfermedades',
  'sub': 'Complemento al programa de nueve troncos transversales y seis escuelas', 'lead': 'Propuesta curricular para validación por Dirección Médica',
  'secciones': [
   sec('arquitectura', '1. Arquitectura formativa', p('El programa se organiza en tres niveles: (1) modelo asistencial Humana, con nueve troncos comunes; (2) conocimiento de enfermedades y situaciones clínicas; (3) aplicación práctica mediante casos, simulaciones y registro en las herramientas Humana. Cada enfermedad parte de una ficha clínica maestra validada y genera seis versiones pedagógicas, con responsabilidades delimitadas.')
     + ol('<strong>Nivel 1</strong> · 9 troncos comunes', '<strong>Nivel 2</strong> · Enfermedades', '<strong>Nivel 3</strong> · Casos y práctica'), grafico=True),
   sec('indice', '2. Índice de enfermedades y situaciones clínicas', tabla(['Área', 'Módulos'], [[a, '; '.join(m)] for a, m in AREAS])
     + p('Priorización de desarrollo: insuficiencia cardíaca, EPOC, demencias, diabetes y fragilidad. El catálogo es propuesto, no un listado cerrado de protocolos clínicos.')),
   sec('plantilla', '3. Índice único para cada enfermedad', ol('Definición y alcance', 'Causas y evolución habitual', 'Manifestaciones clínicas y síntomas', 'Valoración y diagnóstico (según competencias)', 'Tratamientos y cuidados habituales', 'Criterios de estabilidad individual', 'Microcambios y signos de deterioro', 'Actuaciones por perfil y límites competenciales', 'Comunicación, escalado y criterios de urgencia', 'Registro, evolución, resultados y reevaluación')),
   sec('escuelas', '4. Adaptación a las seis escuelas', tabla(['Escuela', 'Profundidad y responsabilidad'], [[t, prof] for _, t, _, prof in ESC]).replace('<td>Pacientes y familiares</td>', '<td>Pacientes</td>')),
   sec('piloto', '5. Módulo piloto: insuficiencia cardíaca',
     p('Caso longitudinal ficticio: Antonio, 82 años, insuficiencia cardíaca, fragilidad y dependencia parcial. Se parte de una situación basal documentada; los cambios se interpretan frente a esa línea de base y al plan individual.')
     + '<h3>Médicos</h3>' + p('Reconocer congestión y otros diagnósticos posibles; revisar tratamiento y función renal cuando proceda; decidir intensidad de seguimiento y derivación.')
     + '<h3>Enfermería</h3>' + p('Registrar síntomas, peso, tensión arterial, frecuencia cardíaca, edema, disnea y adherencia según plan; comunicar variaciones relevantes.')
     + '<h3>[[Fisioterapia|Kinesiología]]</h3>' + p('Evaluar tolerancia al esfuerzo y movilidad; adaptar actividad dentro de indicaciones clínicas; detener intervención ante signos de alarma.')
     + '<h3>Cuidadores</h3>' + p('Observar cambios en respiración, hinchazón, cansancio, peso si está pautado y capacidad habitual; avisar según instrucciones.')
     + '<h3>Pacientes</h3>' + p('Entender qué síntomas vigilar, cómo seguir el tratamiento prescrito y a quién contactar ante cambios.')
     + '<h3>Coordinación</h3>' + p('Verificar recepción de alertas, asignación de responsable, cumplimiento de tareas y cierre documentado.')
     + '<h3>Ejercicio compartido</h3>' + p('Antonio presenta mayor disnea al caminar y aumento de edema respecto a su situación habitual. Cada alumno debe identificar qué información necesita, qué puede hacer dentro de sus competencias, a quién comunica y qué debe quedar registrado. No se presume que el cambio confirme por sí solo una descompensación cardíaca.')),
   sec('tecnologia', '6. Integración tecnológica', p('Humana Uno: antecedentes, valoración, plan, intervenciones, evolución y resultado. Humana Intelligence: reglas, alertas, tareas y trazabilidad, sujetas a validación clínica y configuración operativa. App de paciente/cuidador: instrucciones, observaciones y comunicación. Humana Academy: contenidos y comprobación de competencias. Los permisos se asignan por rol y la tecnología no sustituye la decisión profesional.')),
   sec('unidad', '7. Diseño de cada unidad docente', ul('Objetivos medibles y conocimientos previos', 'Explicación en lenguaje apropiado al perfil', 'Caso aplicado con línea basal y microcambios', 'Actividad práctica y uso de herramientas', 'Evaluación de competencias y criterios de superación', 'Bibliografía, fecha de revisión y responsable clínico')),
   sec('seguridad', '8. Gobernanza y seguridad clínica', p('Cada ficha maestra debe identificar autor, revisor clínico, versión, fecha y referencias actualizadas. Los umbrales de alerta, los algoritmos y las recomendaciones terapéuticas se definirán en protocolos específicos, considerando situación basal, comorbilidades y objetivos de cuidado. Los cuidadores y pacientes no reciben formación para diagnosticar ni modificar medicación de forma autónoma. Los contenidos formativos no sustituyen la valoración individual ni los protocolos de emergencias.')),
   sec('fase', '9. Próxima fase de producción', p('Validar el catálogo y la plantilla única; elaborar la ficha maestra de insuficiencia cardíaca; producir seis versiones con recursos visuales y preguntas; probarlas con profesionales y cuidadores; ajustar y replicar en EPOC, demencias, diabetes y fragilidad.')),
  ], 'quiz': [], 'simulacion': None, 'reflexion': [], 'video': '', 'gobernanza': GOB_PE,
  'fuente': 'Humana_Academy_Programa_Por_Enfermedades.docx'})

GOB_IC = gob('Humana Academy · Módulo 01 Insuficiencia cardíaca · Unidad docente maestra y seis adaptaciones por perfil · Versión de trabajo (noviembre de 2026)')
IC_ESC = {
 'medicos': ('Interpretar el síndrome, diferenciar congestión de causas alternativas y asumir decisiones diagnósticas y terapéuticas.',
   'Evaluar síntomas, exploración, perfusión, función renal, electrolitos, medicación y pruebas según necesidad; definir criterios de seguimiento, derivación y objetivos de atención.',
   'En Antonio: determinar gravedad, hipótesis diferenciales, pruebas y actuación proporcional; documentar razonamiento y respuesta.',
   ['¿Qué datos faltan antes de atribuir la disnea a congestión?', '¿Qué hallazgos obligarían a derivar?'],
   'Humana Uno: diagnóstico/problema, estratificación, plan, órdenes, reevaluación y resultado clínico.'),
 'enfermeria': ('Valorar necesidades de cuidados, detectar deterioro y ejecutar intervenciones dentro de competencias y prescripciones.',
   'Registrar disnea, edemas, peso, constantes, adherencia, tolerancia y factores desencadenantes; educación, conciliación práctica y escalado.',
   'En Antonio: visita o contacto estructurado, contraste con basal, registro y aviso al médico según protocolo; no ajustar medicación autónomamente fuera de habilitación y protocolo aplicable.',
   ['¿Qué observaciones objetivas [[transmitirías|transmitirías]]?', '¿Cómo [[verificarías|verificarías]] comprensión del plan?'],
   'Humana Uno: valoración, actividades, microcambios, alertas y evolución enfermera.'),
 'kinesiologia': ('Reconocer cómo la insuficiencia cardíaca condiciona esfuerzo, movilidad y rehabilitación segura.',
   'Valorar marcha, fatiga, disnea de esfuerzo, equilibrio, sarcopenia y tolerancia; adaptar ejercicio al estado clínico y detenerlo ante signos de alarma.',
   'En Antonio: ante empeoramiento reciente, suspender incremento de carga y comunicar para valoración antes de continuar.',
   ['¿Qué cambio funcional es relevante?', '¿Cuándo suspenderías una sesión?'],
   'Registro de capacidad funcional, objetivos, tolerancia, incidencias y resultados.'),
 'cuidadores': ('Comprender la enfermedad en lenguaje cotidiano y observar sin asumir funciones sanitarias.',
   'Identificar respiración distinta de lo habitual, más almohadas, hinchazón, cansancio, cambios de peso si se ha indicado medirlo y dificultad para actividades habituales.',
   'En Antonio: anotar cambios con fecha, seguir tareas asignadas, informar por la app o teléfono indicado; ante emergencia llamar al [[112|107 (SAME) o 911, según la jurisdicción]].',
   ['¿Qué tres cambios contarías al equipo?', '¿Qué NO [[debes|debés]] hacer con la medicación?'],
   'App cuidador: tareas, observaciones, mensajes y avisos según circuito.'),
 'pacientes': ('Reconocer el estado habitual, participar en autocuidado y solicitar ayuda oportunamente.',
   'Comprender para qué sirven medicación y controles prescritos; identificar disnea nueva, hinchazón, empeoramiento del cansancio y dificultades de sueño.',
   'Antonio explica qué ha cambiado y desde cuándo, consulta el plan y pide ayuda; no modifica dosis sin instrucciones previas específicas.',
   ['¿Qué síntoma comunicarías hoy?', '¿A quién llamarías si [[empeoras|empeorás]] bruscamente?'],
   'App paciente: plan comprensible, recordatorios, información y contacto.'),
 'coordinacion': ('Asegurar recepción, trazabilidad, asignación y cierre de alertas, sin emitir diagnósticos ni tratamientos.',
   'Verificar identificación, prioridad conforme a protocolo, profesional responsable, plazos de respuesta y continuidad; comprobar cierre y pendientes.',
   'En Antonio: registrar aviso, activar circuito según gravedad, confirmar recepción por clínico y seguimiento de la incidencia.',
   ['¿Cómo [[evitas|evitás]] una alerta sin responsable?', '¿Qué evidencia demuestra que quedó cerrada?'],
   'Humana Intelligence: tareas, alertas, asignación, tiempos y trazabilidad.'),
}
IC_TIT = {'kinesiologia': 'Fisioterapia y kinesiología'}
versiones = {}
for e, (comp, cont, ej, preg, herr) in IC_ESC.items():
    versiones[e] = {'lead': '', 'titulo': IC_TIT.get(e, ''), 'secciones': [
      sec('competencia', 'Competencia esperada', p(comp)),
      sec('contenidos', 'Contenidos', p(cont)),
      sec('ejercicio', 'Ejercicio con Antonio', p(ej)),
      sec('herramienta', 'Herramienta tecnológica', p(herr))], 'reflexion': preg, 'quiz': []}
docs.append({'id': 'patologia-insuficiencia-cardiaca', 'tipo': 'patologia', 'modulo': 3, 'orden': 1,
  'area': 'Cardiovascular', 'piloto': True, 't': 'Insuficiencia cardíaca', 'sub': 'Módulo 01 · Unidad docente maestra y seis adaptaciones por perfil',
  'lead': 'Finalidad: reconocer la insuficiencia cardíaca como síndrome clínico, comprender el seguimiento longitudinal y delimitar qué debe observar, comunicar, valorar y decidir cada participante. Material educativo: no sustituye protocolos clínicos, prescripciones ni planes individualizados.',
  'secciones': [
   sec('objetivos', '1. Objetivos comunes', ul('Explicar qué es la insuficiencia cardíaca y su variabilidad clínica.', 'Reconocer situación basal, cambios significativos y señales de alarma.', 'Aplicar el circuito Humana: observar → registrar → valorar → decidir → comprobar.', 'Utilizar las herramientas digitales según permisos y responsabilidad profesional.')),
   sec('ficha', '2. Ficha clínica maestra',
     '<h3>Qué es</h3>' + p('Síndrome en el que alteraciones estructurales o funcionales cardíacas provocan síntomas y/o signos, habitualmente asociados a congestión o bajo gasto. No equivale a una sola enfermedad ni se diagnostica únicamente por disnea o edemas.')
     + '<h3>Causas y evolución</h3>' + p('Puede relacionarse con hipertensión, cardiopatía isquémica, valvulopatías, arritmias u otras causas. Puede alternar periodos de estabilidad y descompensación; debe conocerse el fenotipo, la función ventricular y los objetivos asistenciales.')
     + '<h3>Síntomas y signos</h3>' + p('Disnea, ortopnea, fatiga, intolerancia al esfuerzo, edemas, aumento de peso por retención de líquidos y, en algunos casos, confusión o disminución de la diuresis. Ningún hallazgo aislado confirma una descompensación.')
     + '<h3>Diagnóstico y valoración</h3>' + p('Historia y exploración, constantes, electrocardiograma, péptidos natriuréticos, ecocardiografía y pruebas adicionales según contexto. En domicilio se documentan situación basal, comorbilidad, función, fragilidad, tratamiento y recursos.')
     + '<h3>Tratamiento y cuidados</h3>' + p('El tratamiento depende del fenotipo, situación clínica, función renal, potasio, presión arterial y tolerancia. Incluye terapias farmacológicas indicadas, control de congestión, educación, actividad adaptada y seguimiento. Los cambios de medicación requieren prescripción o instrucciones individualizadas.')
     + '<h3>Qué es estar estable</h3>' + p('Síntomas y capacidad funcional próximos al basal, sin congestión progresiva, sin cambios relevantes de constantes y con un plan terapéutico tolerado. Estabilidad no significa ausencia de enfermedad.')
     + '<h3>Microcambios</h3>' + p('Peso respecto al basal, disnea habitual frente a nueva disnea, ortopnea, edemas, fatiga, tolerancia al esfuerzo, somnolencia, ingesta y adherencia. Los umbrales se personalizan; no aplicar un único valor universal.')
     + '<h3>Respuesta escalonada</h3>' + p('Cambios leves: registrar y comunicar por circuito establecido. Deterioro progresivo: valoración clínica pronta. Disnea intensa en reposo, dolor torácico persistente, síncope, confusión aguda grave o signos de hipoperfusión: activar emergencias ([[112 en España|107 (SAME) o 911, según la jurisdicción]]).')
     + '<h3>Comunicación</h3>' + p('Describir qué cambió, desde cuándo, comparación con basal, constantes disponibles, medicación tomada, síntomas acompañantes y acción ya realizada. Evitar conclusiones diagnósticas por personas no facultadas.')
     + '<h3>Resultados</h3>' + p('Registrar problema inicial, intervención, respuesta observada, pruebas, cambio de tratamiento, derivación/[[ingreso|internación]] y estado pendiente. Mejoría clínica no prueba por sí sola el diagnóstico inicial.')),
   sec('circuito', '3. Circuito de trabajo', ol('Paciente / cuidador', 'Observación y registro', 'Valoración profesional', 'Decisión y plan', 'Resultado y revisión'), grafico=True),
   sec('caso', '4. Caso docente longitudinal: Antonio', p('Antonio, 82 años, vive en casa con apoyo familiar. Tiene insuficiencia cardíaca conocida, fragilidad y dependencia parcial. Situación basal ficticia: camina dentro de casa con ayuda, duerme con una almohada y no presenta disnea en reposo. Durante tres días, su cuidadora observa mayor fatiga, aumento de peso respecto a su registro habitual y necesidad de más almohadas para dormir. No se aportan constantes ni exploración. Estos datos requieren comunicación y valoración; no bastan para confirmar la causa ni indicar por sí mismos un ajuste de diurético.',
      'Secuencia docente: 1) comparar con basal; 2) registrar datos y contexto; 3) comunicar al equipo; 4) valoración profesional y decisión; 5) documentar evolución y resultado; 6) revisar el plan.')),
   sec('evaluacion', '6. Evaluación común y criterios de superación', ul('Identifica al menos tres cambios respecto a la situación basal.', 'Distingue observación, valoración profesional y decisión terapéutica.', 'Selecciona correctamente el circuito de comunicación y urgencias.', 'Registra datos verificables y diferencia evolución de diagnóstico confirmado.', 'Demuestra el uso de la herramienta digital correspondiente a su perfil.')
     + p('Propuesta de evaluación: cinco preguntas de conocimiento y una simulación del caso. La aprobación exige además no cometer errores críticos de seguridad (p. ej., omitir emergencias o recomendar ajustes de medicación sin habilitación). Umbrales y rúbricas deberán validarse antes de implantación.')),
   sec('validacion', '7. Gobernanza y validación', p('Documento base para revisión por Dirección Médica. Antes de publicar: actualizar según guías clínicas vigentes, validar circuitos territoriales, verificar alcance legal de competencias, definir umbrales personalizados de alerta y configurar permisos reales de las aplicaciones. La tecnología apoya, pero no sustituye el juicio clínico.')),
  ], 'versiones': versiones, 'quiz': [], 'simulacion': None, 'reflexion': [], 'video': '', 'gobernanza': GOB_IC,
  'fuente': 'Humana_Academy_Modulo_01_Insuficiencia_Cardiaca.docx'})

# ---------------------------------------------------------------- Módulo 4 · Herramientas
docs.append({'id': 'herramientas', 'tipo': 'programa', 'modulo': 4, 'orden': 0, 't': 'Herramientas tecnológicas',
  'sub': 'Ecosistema tecnológico', 'lead': 'La tecnología es un medio de continuidad asistencial, no un sustituto de la valoración profesional. El acceso y las acciones se delimitan por rol y autorización.',
  'secciones': [
   sec('ecosistema', 'Ecosistema tecnológico', ul('<strong>Humana Uno</strong> · Historia clínica', '<strong>Humana Intelligence</strong> · Reglas, alertas y planes', '<strong>App paciente</strong> · Participación', '<strong>App cuidador</strong> · Tareas y señales', '<strong>Humana Academy</strong> · Formación')
     + p('La tecnología es un medio de continuidad asistencial, no un sustituto de la valoración profesional. El acceso y las acciones se delimitan por rol y autorización.'), grafico=True, fuente='Programa Integral Visual · 4. Ecosistema tecnológico'),
   sec('integracion', 'Integración tecnológica', p('Humana Uno: antecedentes, valoración, plan, intervenciones, evolución y resultado. Humana Intelligence: reglas, alertas, tareas y trazabilidad, sujetas a validación clínica y configuración operativa. App de paciente/cuidador: instrucciones, observaciones y comunicación. Humana Academy: contenidos y comprobación de competencias. Los permisos se asignan por rol y la tecnología no sustituye la decisión profesional.'), fuente='Programa por Enfermedades · 6. Integración tecnológica'),
   sec('doctrina', 'En la Doctrina Humana', p('Historia clínica (Humana Uno) · Humana Intelligence · app del paciente y del cuidador · comunicación, alertas y coordinación · Impacto Humana') + p('Los resultados que mide Impacto Humana actualizan el Manual Maestro y los contenidos de Humana Academy y, cuando corresponde, motivan una revisión de esta doctrina. Así se construye un sistema de aprendizaje continuo.'), fuente='Doctrina Humana · 08 y 09'),
  ], 'quiz': [], 'simulacion': None, 'reflexion': [], 'video': '', 'gobernanza': gob('Programa Integral Visual · Programa por Enfermedades · Doctrina Humana (noviembre de 2026)'),
  'fuente': 'Programa Integral Visual · Programa por Enfermedades · Doctrina Humana'})

# ---------------------------------------------------------------- Módulo 5 · Aplicación práctica
docs.append({'id': 'practica-antonio', 'tipo': 'practica', 'modulo': 5, 'orden': 1, 't': 'Caso transversal: del microcambio al resultado',
  'sub': 'Ejercicio compartido', 'lead': 'Caso longitudinal ficticio: Antonio, 82 años, insuficiencia cardíaca, fragilidad y dependencia parcial. Se parte de una situación basal documentada; los cambios se interpretan frente a esa línea de base y al plan individual.',
  'secciones': [
   sec('ejercicio', 'Ejercicio compartido', p('Antonio presenta mayor disnea al caminar y aumento de edema respecto a su situación habitual. Cada alumno debe identificar qué información necesita, qué puede hacer dentro de sus competencias, a quién comunica y qué debe quedar registrado. No se presume que el cambio confirme por sí solo una descompensación cardíaca.'), fuente='Programa por Enfermedades · 5'),
   sec('transversal', 'Caso transversal', p('Ejemplo docente: cambio en disnea respecto al basal. La respuesta depende de la gravedad y de los protocolos de seguridad. En emergencias se activa el circuito urgente correspondiente, sin esperar a la revisión ordinaria.'), fuente='Programa Integral Visual · 5'),
   sec('secuencia', 'Secuencia docente', p('Secuencia docente: 1) comparar con basal; 2) registrar datos y contexto; 3) comunicar al equipo; 4) valoración profesional y decisión; 5) documentar evolución y resultado; 6) revisar el plan.'), fuente='Módulo 01 IC · 4'),
  ], 'quiz': [], 'simulacion': None, 'reflexion': [], 'video': '', 'gobernanza': GOB_PE,
  'fuente': 'Programa por Enfermedades · Programa Integral Visual · Módulo 01 IC'})

for d in docs:
    d['estado'] = 'borrador'
    d.setdefault('umbral', 60)

with open(os.path.join(AQUI, 'borradores.json'), 'w', encoding='utf-8') as f:
    json.dump({'version': '2026-11-26', 'nota': 'Material de Karina (noviembre de 2026). Todo en borrador. Se importa desde el Estudio de la nueva Academy.', 'docs': docs}, f, ensure_ascii=False, indent=1)
print(len(docs), 'documentos')
