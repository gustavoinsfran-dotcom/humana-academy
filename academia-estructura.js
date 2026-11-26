/* Humana Academy — estructura de la nueva Academy (reestructuración, noviembre de 2026).
   Solo nombres para navegar y plantillas. El contenido clínico vive en la base (colección "academia"),
   lo carga Karina desde el Estudio y se publica con su validación.
   Fuente: material de Karina en docs/karina/ (Doctrina v2, Programa Integral Visual, Programa por Enfermedades, Índice de formación). */
(function(){
  var A={};

  A.MODULOS=[
    {n:0, t:'Doctrina Humana', para:'Todos', d:'Principios, líneas firmes, test de coherencia, conceptos clave y Carta Magna. Obligatorio.'},
    {n:1, t:'Tronco metodológico común', para:'Todos, adaptado a cada perfil', d:'Los nueve troncos.'},
    {n:2, t:'Formación por perfil', para:'Cada perfil, su escuela', d:'Las seis escuelas.'},
    {n:3, t:'Patologías', para:'Todos, cada uno desde su responsabilidad', d:'Fichas por enfermedad.'},
    {n:4, t:'Herramientas tecnológicas', para:'Según permisos de cada rol', d:'Humana Uno, Humana Intelligence, app paciente, app cuidador, Impacto Humana.'},
    {n:5, t:'Aplicación práctica y evaluación', para:'Todos', d:'Casos, microcambios, simulación y competencias.'}
  ];

  /* id interno estable; el nombre visible es el del material. */
  A.ESCUELAS=[
    {id:'medicos',      t:'Médicos',                     eje:'Decisiones clínicas'},
    {id:'enfermeria',   t:'Enfermería',                  eje:'Cuidados y seguimiento'},
    {id:'kinesiologia', t:'Fisioterapia / Kinesiología', eje:'Funcionalidad'},
    {id:'cuidadores',   t:'Cuidadores',                  eje:'Observación cotidiana'},
    {id:'pacientes',    t:'Pacientes y familiares',      eje:'Autocuidado'},
    {id:'coordinacion', t:'Coordinación asistencial',    eje:'Circuitos y recursos'}
  ];
  A.escuela=function(id){ for(var i=0;i<A.ESCUELAS.length;i++) if(A.ESCUELAS[i].id===id) return A.ESCUELAS[i]; return null; };

  /* Roles de usuario. Hoy todos entran con correo del grupo ("equipo").
     Cuidadores y pacientes tendrán su "llave" de acceso más adelante: el rol ya existe. */
  A.ROLES=[
    {id:'equipo', t:'Equipo de Humana'},
    {id:'cuidador', t:'Cuidador o cuidadora', escuela:'cuidadores', pendiente:true},
    {id:'paciente', t:'Paciente o familiar', escuela:'pacientes', pendiente:true}
  ];

  A.TRONCOS=[
    ['Comprender','Persona y contexto'],['Valorar','Situación inicial'],['Clasificar','Complejidad y riesgo'],
    ['Planificar','Objetivos y tareas'],['Observar','Microcambios'],['Actuar','Respuesta adecuada'],
    ['Comunicar','Continuidad asistencial'],['Comprobar','Evolución y resultados'],['Tecnología','Registro y coordinación']
  ].map(function(x,i){ return {n:i+1, id:'tronco-'+(i<9?'0':'')+(i+1), t:x[0], sub:x[1]}; });

  /* Catálogo completo (Programa por Enfermedades). "prioridad" = orden de desarrollo. */
  var AREAS=[
    ['Cardiovascular',['Insuficiencia cardíaca','Hipertensión arterial','Fibrilación auricular','Cardiopatía isquémica']],
    ['Respiratoria',['EPOC','Asma','Insuficiencia respiratoria','Neumonía']],
    ['Neurológica',['Demencias','Enfermedad de Parkinson','Ictus y secuelas']],
    ['Endocrina y metabólica',['Diabetes mellitus','Trastornos tiroideos','Desnutrición','Obesidad']],
    ['Renal y urinaria',['Enfermedad renal crónica','Infección urinaria','Incontinencia','Retención urinaria']],
    ['Digestiva y deglución',['Estreñimiento','Disfagia','Reflujo','Trastornos digestivos frecuentes']],
    ['Musculoesquelética y funcional',['Artrosis','Osteoporosis','Sarcopenia','Caídas']],
    ['Piel y heridas',['Lesiones por presión','Heridas crónicas','Lesiones vasculares','Pie diabético']],
    ['Salud mental y cognición',['Depresión','Ansiedad','Insomnio','Delirium']],
    ['Oncología y paliativos',['Enfermedad oncológica avanzada','Dolor','Control de síntomas','Final de vida']],
    ['Síndromes transversales',['Fragilidad','Pluripatología','Polifarmacia','Dependencia']]
  ];
  var PRIORIDAD={'Insuficiencia cardíaca':1,'EPOC':2,'Demencias':3,'Diabetes mellitus':4,'Fragilidad':5};
  function slug(s){ return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
  A.slug=slug;
  A.AREAS=AREAS.map(function(a){ return {t:a[0], mods:a[1].map(function(m){ return {t:m, id:'patologia-'+slug(m), prioridad:PRIORIDAD[m]||0}; })}; });

  /* Plantilla única de patología: 10 apartados. */
  A.PLANTILLA_PATOLOGIA=['Definición y alcance','Causas y evolución habitual','Manifestaciones clínicas y síntomas',
    'Valoración y diagnóstico (según competencias)','Tratamientos y cuidados habituales','Criterios de estabilidad individual',
    'Microcambios y signos de deterioro','Actuaciones por perfil y límites competenciales',
    'Comunicación, escalado y criterios de urgencia','Registro, evolución, resultados y reevaluación'];

  /* Plantilla de unidad: cinco pasos + lo que debe incluir cada unidad. */
  A.PLANTILLA_UNIDAD=[
    ['objetivos','Objetivos medibles y conocimientos previos'],
    ['aprender','Aprender · explicación breve'],
    ['comprender','Comprender · caso con línea basal y microcambios'],
    ['aplicar','Aplicar · ejercicio dentro de las competencias'],
    ['registrar','Registrar y comunicar · uso de las herramientas'],
    ['comprobar','Comprobar · criterios de superación'],
    ['bibliografia','Bibliografía']
  ];

  A.TIPOS={doctrina:'Doctrina', programa:'Programa', tronco:'Tronco', escuela:'Escuela', unidad:'Unidad', patologia:'Patología', herramienta:'Herramienta', practica:'Práctica'};

  /* ---------- Evaluación ----------
     items: [{q, o:[...], c:índice correcto, e:explicación, critica:bool}]
     Aprueba con nota >= umbral y sin ningún error crítico de seguridad. */
  A.corregir=function(items, resp, umbral){
    var u=(typeof umbral==='number'&&umbral>0)?umbral:60, ok=0, criticos=[];
    (items||[]).forEach(function(it,i){
      var bien=resp&&resp[i]===it.c;
      if(bien) ok++; else if(it.critica) criticos.push(i);
    });
    var n=(items||[]).length, nota=n?Math.round(ok/n*100):0;
    return {nota:nota, correctas:ok, total:n, criticos:criticos, aprobado:n>0 && nota>=u && !criticos.length};
  };
  /* Todas las preguntas que se corrigen juntas: conocimiento + pasos de la simulación. */
  A.items=function(v){
    var q=(v.quiz||[]).slice();
    if(v.simulacion&&v.simulacion.pasos) v.simulacion.pasos.forEach(function(p){ q.push(Object.assign({sim:true},p)); });
    return q.filter(function(x){ return x&&x.q&&x.o&&x.o.length>1&&typeof x.c==='number'; });
  };

  /* Versión que ve cada persona: el contenido común más la de su escuela. */
  A.version=function(doc, escuela){
    var v=(doc.versiones&&escuela&&doc.versiones[escuela])||null;
    return {
      lead: v&&v.lead || '',
      titulo: v&&v.titulo || '',
      secciones: v&&v.secciones || [],
      quiz: (v&&v.quiz&&v.quiz.length)?v.quiz:(doc.quiz||[]),
      simulacion: (v&&v.simulacion)||doc.simulacion||null,
      reflexion: (v&&v.reflexion&&v.reflexion.length)?v.reflexion:(doc.reflexion||[])
    };
  };

  /* ---------- Limpieza del HTML de contenido (incluye tablas) ---------- */
  var PERMITIDAS={H2:1,H3:1,P:1,STRONG:1,EM:1,U:1,UL:1,OL:1,LI:1,BR:1,A:1,DIV:1,TABLE:1,THEAD:1,TBODY:1,TR:1,TH:1,TD:1};
  A.sanear=function(html){
    var doc=new DOMParser().parseFromString('<div id="r">'+(html||'')+'</div>','text/html');
    var raiz=doc.getElementById('r');
    function cambiar(el,tag){ var n=doc.createElement(tag); while(el.firstChild)n.appendChild(el.firstChild); el.parentNode.replaceChild(n,el); return n; }
    function pasar(nodo){
      Array.prototype.slice.call(nodo.childNodes).forEach(function(ch){
        if(ch.nodeType===8){ ch.remove(); return; }
        if(ch.nodeType!==1) return;
        var t=ch.tagName;
        if(/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|META|LINK|FORM|INPUT|SVG|MATH)$/.test(t)){ ch.remove(); return; }
        if(t==='B') ch=cambiar(ch,'strong'); else if(t==='I') ch=cambiar(ch,'em'); else if(t==='H1') ch=cambiar(ch,'h2'); else if(/^H[4-6]$/.test(t)) ch=cambiar(ch,'h3');
        t=ch.tagName;
        if(!PERMITIDAS[t]){ pasar(ch); while(ch.firstChild)ch.parentNode.insertBefore(ch.firstChild,ch); ch.remove(); return; }
        var quote=t==='DIV'&&/(^|\s)quote(\s|$)/.test(ch.className||''), href=t==='A'?(ch.getAttribute('href')||''):'';
        Array.prototype.slice.call(ch.attributes).forEach(function(a){ ch.removeAttribute(a.name); });
        if(t==='DIV'){ if(quote) ch.className='quote'; else ch=cambiar(ch,'p'); }
        if(t==='A'){ if(/^(https?:|mailto:)/i.test(href)){ ch.setAttribute('href',href); ch.setAttribute('target','_blank'); ch.setAttribute('rel','noopener'); } else { pasar(ch); while(ch.firstChild)ch.parentNode.insertBefore(ch.firstChild,ch); ch.remove(); return; } }
        pasar(ch);
      });
    }
    pasar(raiz);
    return raiz.innerHTML.trim();
  };

  A.esc=function(s){ return (''+(s==null?'':s)).replace(/[<>&"']/g,function(c){ return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]; }); };
  A.pad=function(n){ return (n<10?'0':'')+n; };

  window.HA_AC=A;
})();
