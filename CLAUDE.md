# Humana Academy · Guía del proyecto

Guía para trabajar la Academy en Claude Code. Leela entera antes de tocar nada.
Versión 2 · 26 de noviembre de 2026 · Responsable: Gus (Gustavo Insfran).

---

## 1. Qué es

Humana Academy es la plataforma de formación de Humana Health & Care.
Sitio: https://academy.humanahc.com.ar
La pensó, la estructuró y la construyó Gus desde cero. Humana España está por replicarla.

Costo cero, y la idea es mantenerla así.

---

## 2. Quiénes

| Persona | Rol en la Academy |
|---|---|
| Gus · gustavo.insfran@infinitypharma.com.ar | Dueño del proyecto. Administrador. Aprueba todo lo que se publica. |
| Karina Ojanguren · k.ojanguren@humanahc.com | Dirección Médica. Define y valida todo el contenido clínico. Administradora y editora en el Estudio. |
| David Gonzalez · d.gonzalez@humanahc.com | Responsable tecnológico de Humana España. |
| Alejandro Salz · alejandro.salz@humanahc.com.ar | Equipo comercial, Argentina. |
| Eduardo e Iñaki Carretero | Humana España. Iñaki administra la web humanahc.com. |

Regla: el contenido clínico lo define Karina. Claude no agrega, quita ni reinterpreta contenido clínico.

---

## 3. Decisiones tomadas

- **Repositorio público.** Confirmado por Gus. Todo el proyecto vive acá: código, guía, material de Karina y pruebas.
- **Material de Karina, al pie de la letra.** Se carga completo, tal cual: seis escuelas, nueve troncos, catálogo entero de patologías (incluida oncología y paliativos), evaluación y gobernanza. No se recorta nada.
- **Las seis escuelas se construyen todas**, incluidas Cuidadores y Pacientes.
- **Acceso de cuidadores y pacientes: más adelante.** Hoy el login es solo con correo del grupo. Más adelante se habilita una "llave" para cuidadores y pacientes (nueva ruta de usuario). La plataforma se arma preparada para eso, sin bloquear el resto.

---

## 4. Cómo está hecha

**Hosting.** Sitio estático en GitHub Pages.
- Repo: github.com/gustavoinsfran-dotcom/humana-academy.
- Rama main = lo publicado. Cada cambio en main sale en vivo en unos minutos.
- Dominio propio por el archivo CNAME.

**Acceso y datos.** Firebase, proyecto humana-academy, plan gratuito Spark.
- Login con correo y contraseña. Cada persona crea su cuenta.
- Hoy solo correos del grupo: @humanahc.com, @humanahc.com.ar, @infinitypharma.com.ar.
- Firestore, colección `users`: nombre, correo, puntajes por ruta (`scores`, `nexo.scores`, `cutaquig.scores`, `comercial.scores`).
- Firestore, colección `modulos`: el contenido que Karina edita en el Estudio, con historial en `versiones`.
- Reglas en `firestore.rules`. Los administradores están en `firebase-auth.js` (ADMINS) y en las reglas: tienen que coincidir. Las reglas se publican desde la consola de Firebase.

**Archivos principales**

| Archivo | Qué es |
|---|---|
| index.html | Inicio y ruta método Humana (módulos, quiz, certificado) |
| modulos-base.js | Contenido de respaldo del método Humana, si no hay conexión a la base |
| contenido.js | Lee los módulos de Firestore y los guarda en caché |
| estudio.html | Estudio de contenidos: solo Karina y Gus. Crear, editar, publicar y archivar módulos |
| firebase-auth.js | Login, registro, progreso, panel de administración |
| extras.js | Mensajes de avance, LinkedIn y recorrido de bienvenida |
| nexo.html | Ruta Humana Nexo (programa de asistencia al paciente) |
| cutaquig.html · calculadora.html | Capacitación de producto Cutaquig y calculadora de dosis |
| comercial.html | Formación comercial: 4 lecciones, con capa por país |
| estratificador.html | Estratificador comercial de instituciones (no es H1–H4) |
| metodo.css · metodo-pistas.css | Identidad método Humana y temas por ruta |
| sw.js | Service worker, red primero. Subir la versión de caché (ha-vN) en cada cambio |
| fonts/ | Arimo y Bodoni Moda, autoalojadas (licencia OFL) |
| pruebas/ | Regresión con Playwright y Firebase simulado |
| docs/karina/ | Material original de Karina (ver sección 8) |

**Identidad.** Toda la Academy usa la identidad método Humana. Paleta: #170F1E, #D43380, #28449B, #CACACA, blanco. No se modifica.

**Capa por país** (hoy en comercial.html; pasa a toda la Academy).
- Marcas `[[España|Argentina]]` en el contenido. Se resuelven según el correo.
- @humanahc.com ve España: el texto de Karina tal cual. Los demás ven Argentina.
- Un botón al pie permite ver la otra versión. Se guarda en localStorage `ha_pais`.
- La versión Argentina cambia solo el léxico y los datos locales, nunca el contenido clínico:
  - tuteo → voseo
  - fisioterapia → kinesiología (la escuela se llama "Fisioterapia / Kinesiología" en ambas)
  - ingreso → internación
  - aseguradoras → prepagas, obras sociales e instituciones
  - hospitalización a domicilio → internación domiciliaria
  - emergencias 112 → 107 (SAME) o 911, según la jurisdicción

---

## 5. Cómo se trabaja

1. Los cambios del sitio van en una rama, con un pull request que Gus aprueba. Nunca directo a main.
2. Antes de proponer un cambio, correr la regresión completa (sección 6). Cero fallas nuevas.
3. Contenido nuevo de Karina: se carga como borrador. Se publica con su validación.
4. Nada se borra: se archiva.
5. No inventar herramientas ni procesos que el equipo no usa.

**Pendiente hoy.** La rama `formacion-comercial` espera el OK de Karina. Suma la tarjeta en el inicio, el avance comercial en el panel, sw ha-v14 y metodo-pistas.css?v=2 en todas las páginas.

**Revisión automática.** Una tarea programada corre la regresión todos los días a las 7:43 (hora de Argentina). Si encuentra errores, abre un pull request y avisa a Gus.

---

## 6. Pruebas

Playwright con Firebase simulado (`pruebas/mockfb.js`).

```
(python3 -m http.server 8765 >/dev/null 2>&1 &) && sleep 1 && NODE_PATH=$(npm root -g) node pruebas/regresion.js
```

Correr desde la raíz del repo. El servidor y la prueba van en el mismo comando. Capturas en /tmp/humana-regresion.
Cubre escritorio y celular, alumna, editora, admin, cada ruta, accesibilidad, errores de consola y el service worker.
Cada función nueva suma sus pruebas.

---

## 7. Cómo escribir

- Frases cortas. En positivo. Sin relleno ni lenguaje corporativo.
- Nunca guion bajo en textos, títulos ni nombres de archivo visibles.
- Casos siempre ficticios o anonimizados (como Antonio, el caso de Karina).

**Vocabulario de la Doctrina Humana**

| Usar | Evitar |
|---|---|
| Dirección clínica domiciliaria | Humanización |
| Trayectoria, continuidad asistencial | Acompañamiento |
| Paciente complejo, post-alta | Cercanía |
| Gasto gestionado, trazabilidad | Ahorro garantizado |
| método Humana | Método CASA (retirado en septiembre de 2026) |
| Humana, desde 2011 | Más de 15 años |
| Internación domiciliaria (Argentina) | Hospitalización a domicilio (Argentina) |

**Herramientas Humana.** Humana Uno (historia clínica), Humana Intelligence (reglas, alertas, tareas y planes), app paciente, app cuidador, Impacto Humana. La Doctrina escribe "Humana Intelligen": en la interfaz se usa "Humana Intelligence", como en el resto del material.

**Regulatorio Argentina.** Ley 17.132, Ley 25.326, Res. 704/2000. Sin promesas de resultado ni claims terapéuticos.

---

## 8. La reestructuración (material de Karina, noviembre de 2026)

Archivos originales en `docs/karina/`:
- Doctrina Humana, nueva edición, borrador v2 (PDF, 14 páginas)
- Programa Integral Visual (nueve troncos y seis escuelas, con la tabla completa por perfil)
- Programa por Enfermedades
- Módulo 01 Insuficiencia cardíaca
- Índice de formación (ocho unidades por escuela)
- material-karina.md: el texto de todo lo anterior, para consulta rápida

Los documentos originales mandan. Este resumen es un mapa; ante cualquier diferencia, vale el original.

### 8.1 Principio rector

Una misma doctrina, nueve troncos comunes y seis escuelas.
Cambian el lenguaje, la profundidad y las competencias de cada perfil. Compartir el itinerario no significa compartir atribuciones clínicas.

### 8.2 Estructura de la nueva Academy

| Módulo | Contenido | Para quién |
|---|---|---|
| 0 · Doctrina Humana | Principios, líneas firmes, test de coherencia, conceptos clave, cómo se organiza el conocimiento, arquitectura de la Academy, vocabulario y Carta Magna. Obligatorio. El núcleo se lee en 15 minutos; el resto es de consulta | Todos |
| 1 · Tronco metodológico común | Los nueve troncos | Todos, adaptado a cada perfil |
| 2 · Formación por perfil | Las seis escuelas | Cada perfil, su escuela |
| 3 · Patologías | Fichas por enfermedad | Todos, cada uno desde su responsabilidad |
| 4 · Herramientas tecnológicas | Humana Uno, Humana Intelligence, app paciente, app cuidador, comunicación, alertas y coordinación, Impacto Humana | Según permisos de cada rol |
| 5 · Aplicación práctica y evaluación | Casos clínicos, microcambios, simulación, uso de herramientas, competencias | Todos |

Tres niveles: 1) nueve troncos comunes, 2) enfermedades, 3) casos y práctica.

### 8.3 Los nueve troncos

| # | Tronco | Subtítulo | Objetivo común |
|---|---|---|---|
| 01 | Comprender | Persona y contexto | Comprender a la persona y su contexto |
| 02 | Valorar | Situación inicial | Identificar la situación basal y las necesidades |
| 03 | Clasificar | Complejidad y riesgo | Interpretar estabilidad, complejidad y riesgo |
| 04 | Planificar | Objetivos y tareas | Definir y organizar un plan individualizado |
| 05 | Observar | Microcambios | Reconocer cambios respecto a la situación habitual |
| 06 | Actuar | Respuesta adecuada | Responder dentro de las competencias y activar ayuda |
| 07 | Comunicar | Continuidad asistencial | Transmitir información útil y a tiempo |
| 08 | Comprobar | Evolución y resultados | Verificar resultados y actualizar el plan |
| 09 | Tecnología | Registro y coordinación | Utilizar las herramientas con seguridad y trazabilidad |

Cada tronco tiene una versión por escuela (tabla completa en el Programa Integral Visual). Se carga tal cual.

### 8.4 Las seis escuelas

| Escuela | Eje |
|---|---|
| Médicos | Decisiones clínicas |
| Enfermería | Cuidados y seguimiento |
| Fisioterapia / Kinesiología | Funcionalidad |
| Cuidadores | Observación cotidiana |
| Pacientes y familiares | Autocuidado |
| Coordinación asistencial (coordinadores y responsables de unidades asistenciales) | Circuitos y recursos |

Unidades de cada escuela:
- Médicos, Enfermería, Fisioterapia, Cuidadores y Pacientes: las ocho unidades del Índice de formación, tal cual.
- Coordinación asistencial: se construye con lo que el material ya define para ese perfil (sus nueve troncos del Programa Integral Visual, su adaptación en el Programa por Enfermedades y en el Módulo 01). Cuando Karina mande su índice de ocho unidades, se reemplaza.

### 8.5 Patologías

Plantilla única de 10 apartados por enfermedad:
1. Definición y alcance
2. Causas y evolución habitual
3. Manifestaciones clínicas y síntomas
4. Valoración y diagnóstico (según competencias)
5. Tratamientos y cuidados habituales
6. Criterios de estabilidad individual
7. Microcambios y signos de deterioro
8. Actuaciones por perfil y límites competenciales
9. Comunicación, escalado y criterios de urgencia
10. Registro, evolución, resultados y reevaluación

De cada ficha clínica maestra salen seis versiones, una por escuela.

Catálogo completo (Programa por Enfermedades):

| Área | Módulos |
|---|---|
| Cardiovascular | Insuficiencia cardíaca; hipertensión arterial; fibrilación auricular; cardiopatía isquémica |
| Respiratoria | EPOC; asma; insuficiencia respiratoria; neumonía |
| Neurológica | Demencias; enfermedad de Parkinson; ictus y secuelas |
| Endocrina y metabólica | Diabetes mellitus; trastornos tiroideos; desnutrición; obesidad |
| Renal y urinaria | Enfermedad renal crónica; infección urinaria; incontinencia; retención urinaria |
| Digestiva y deglución | Estreñimiento; disfagia; reflujo; trastornos digestivos frecuentes |
| Musculoesquelética y funcional | Artrosis; osteoporosis; sarcopenia; caídas |
| Piel y heridas | Lesiones por presión; heridas crónicas; lesiones vasculares; pie diabético |
| Salud mental y cognición | Depresión; ansiedad; insomnio; delirium |
| Oncología y paliativos | Enfermedad oncológica avanzada; dolor; control de síntomas; final de vida |
| Síndromes transversales | Fragilidad; pluripatología; polifarmacia; dependencia |

Orden de desarrollo: insuficiencia cardíaca (piloto), EPOC, demencias, diabetes y fragilidad. Las demás aparecen en el catálogo como "próximamente" hasta que Karina mande su ficha.

**Piloto: Módulo 01 Insuficiencia cardíaca.** Ficha clínica maestra, circuito de trabajo (paciente/cuidador → observación y registro → valoración profesional → decisión y plan → resultado y revisión), caso longitudinal ficticio de Antonio (82 años) y seis adaptaciones. Cada adaptación trae competencia esperada, contenidos, ejercicio con Antonio, preguntas de evaluación y herramienta tecnológica. Evaluación común con cinco criterios de superación.

### 8.6 Cómo se enseña y cómo se evalúa

Cada unidad sigue cinco pasos: aprender (explicación breve), comprender (un caso común contado con el lenguaje de cada perfil), aplicar (ejercicio dentro de las competencias), registrar y comunicar (con las herramientas reales), comprobar (evaluación).

Cada unidad incluye objetivos medibles y conocimientos previos, explicación adaptada al perfil, caso con línea basal y microcambios, actividad práctica y uso de herramientas, evaluación con criterios de superación, y bibliografía con fecha de revisión y responsable clínico.

Evaluación: cinco preguntas de conocimiento y una simulación del caso.
**Error crítico de seguridad = no aprueba**, aunque la nota alcance. Por ejemplo, omitir una emergencia o recomendar un cambio de medicación sin habilitación.

### 8.7 Gobernanza

- Cada contenido muestra autor, revisor clínico, versión, fecha y referencias.
- Los umbrales de alerta y las recomendaciones terapéuticas van en protocolos, no en la formación.
- Cuidadores y pacientes no se forman para diagnosticar ni para modificar medicación.
- H1–H4 lo asigna el equipo clínico. Pacientes y cuidadores conocen sus implicaciones, no lo asignan.
- La respuesta favorable a un tratamiento no confirma por sí sola un diagnóstico.
- La tecnología no sustituye el juicio clínico. El acceso y las acciones se delimitan por rol.
- La doctrina revisa sus criterios cada seis meses (primera revisión: mayo de 2027). El núcleo cambia solo con aprobación de Dirección Médica y Dirección General. Cada versión lleva número y fecha; la anterior se archiva.
- Todo el material está en borrador para validación de la Dirección Médica: se carga como borrador y Karina lo publica.

### 8.8 Fases de implantación (Karina)

1. Validar el índice maestro y las competencias de cada escuela.
2. Desarrollar las nueve unidades maestras.
3. Adaptar materiales, videos y casos a cada perfil.
4. Sumar módulos clínicos o técnicos especializados.
5. Pilotar, evaluar y revisar.

### 8.9 Qué cambia en la plataforma

| Necesidad | Hoy | Cambio |
|---|---|---|
| Perfil por usuario (escuela) | No existe | Campo `escuela` en el usuario. Lo asignan los administradores desde el panel; mientras no tenga, ve el Módulo 0 y el tronco común |
| Acceso de cuidadores y pacientes | Solo correo del grupo | Se deja preparado el rol. La "llave" de acceso se habilita más adelante |
| Contenido por perfil | Una ruta igual para todos | Cada unidad con sus seis versiones |
| Módulo 0 obligatorio | No existe | Se completa antes del resto |
| Error crítico en la evaluación | Solo nota | Preguntas marcadas como críticas: si se fallan, no aprueba |
| Simulación del caso | Solo preguntas | Formato nuevo de ejercicio |
| Ficha de gobernanza | No existe | Autor, revisor, versión, fecha y referencias, editables en el Estudio |
| Plantilla de patologías | No existe | Plantilla de 10 apartados en el Estudio |
| España / Argentina | Solo comercial | Capa por país en toda la Academy |
| Videos | Sacados con el rebranding | Cada unidad con lugar para video. Los graba el equipo de Humana (tiene estudio de grabación) |

Las rutas actuales (Nexo, Cutaquig, Formación comercial) siguen. Los módulos actuales del método Humana se archivan cuando la nueva estructura esté publicada; no se borran.

---

## 9. Orden de trabajo

1. Rama `reestructuracion`.
2. Estructura nueva: módulos 0 a 5, nueve troncos, seis escuelas, campo escuela por usuario, catálogo de patologías.
3. Carga del Módulo 0 Doctrina Humana completo y del piloto Insuficiencia cardíaca con sus seis versiones, en borrador.
4. Estudio: plantillas de unidad y de patología, ficha de gobernanza, preguntas críticas.
5. Capa por país en toda la Academy.
6. Regresión completa con pruebas nuevas.
7. Pull request para Gus y revisión de Karina antes de publicar.
