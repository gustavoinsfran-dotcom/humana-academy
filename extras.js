/* Humana Academy — mensajes de avance, LinkedIn y recorrido de bienvenida (método Humana) */
(function(){
  var LOGO='<span class="mh-logo" role="img" aria-label="método Humana"><i>m</i>étodo<b>Humana</b></span>';
  var st=document.createElement('style');
  st.textContent=".mpop{position:fixed;inset:0;z-index:350;background:rgba(23,15,30,.42);display:none;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}"
   +".mpop.on{display:flex}"
   +".mpop .box{background:#fff;border-radius:28px;max-width:440px;width:100%;padding:40px 32px 28px;text-align:center;box-shadow:0 30px 80px -20px rgba(23,15,30,.35);animation:mpp .45s cubic-bezier(.22,1,.36,1)}"
   +"@keyframes mpp{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}"
   +".mpop .mark{font-family:var(--mh-serif);font-style:italic;font-weight:500;color:var(--mh-accent);font-size:44px;line-height:1;display:block;margin:0 0 14px}"
   +".mpop h2{color:var(--mh-ink);font-size:26px;font-weight:400;letter-spacing:-.025em;margin:0;line-height:1.15}"
   +".mpop h2 b{font-weight:700}"
   +".mpop .sub{color:var(--mh-mut);font-size:15.5px;line-height:1.55;margin:10px 0 0}"
   +".mpop .cita{font-family:var(--mh-serif);font-style:italic;font-weight:500;color:var(--mh-ink);font-size:19px;line-height:1.45;margin:22px 0;padding:0 0 0 18px;border-left:1px solid var(--mh-accent);text-align:left}"
   +".mpop .pr{display:flex;justify-content:space-between;color:var(--mh-mut);font-size:13.5px;margin:22px 0 8px}"
   +".mpop .pr b{color:var(--mh-ink)}"
   +".mpop .bar{height:3px;border-radius:3px;background:var(--mh-line);overflow:hidden;margin:0 0 4px}"
   +".mpop .bar i{display:block;height:100%;background:var(--mh-accent);transition:width .6s cubic-bezier(.22,1,.36,1)}"
   +".mpop .acts{display:grid;gap:10px;margin-top:24px}"
   +".mpop .acts .mh-btn{width:100%}"
   +".mpop .lg{margin-top:22px;display:flex;justify-content:center}.mpop .lg .mh-logo{font-size:17px}"
   +".libtns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:16px}"
   +".libtn{display:inline-flex;align-items:center;gap:8px;min-height:44px;background:#0A66C2;color:#fff;border:1.5px solid #0A66C2;cursor:pointer;font:700 14px/1 var(--mh-sans);padding:0 18px;border-radius:999px;text-decoration:none}"
   +".libtn.ghost{background:#fff;color:#0A66C2}"
   +".libtn svg{width:16px;height:16px;fill:currentColor}"
   +".tourdots{display:flex;gap:6px;justify-content:center;margin:24px 0 0}.tourdots i{width:6px;height:6px;border-radius:6px;background:var(--mh-line-2);transition:.25s;display:inline-block}.tourdots i.on{background:var(--mh-accent);width:22px}"
   +".coach{position:fixed;inset:0;z-index:360;display:none}.coach.on{display:block}.coach-block{position:absolute;inset:0}"
   +".coach-ring{position:fixed;border-radius:16px;border:1.5px solid var(--mh-accent);box-shadow:0 0 0 9999px rgba(23,15,30,.5);transition:all .3s;z-index:361;pointer-events:none}"
   +".coach-tip{position:fixed;max-width:280px;background:#fff;border-radius:18px;padding:18px 18px 14px;z-index:362;box-shadow:0 20px 50px -10px rgba(23,15,30,.35)}"
   +".coach-tip p{margin:0 0 12px;color:var(--mh-ink);font-size:15px;line-height:1.5}.coach-nav{display:flex;align-items:center;justify-content:space-between}.coach-nav span{color:var(--mh-mut);font-size:13px}";
  document.head.appendChild(st);

  var LI='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>';

  var QUOTES=[
    "La continuidad no es seguir al paciente: es no perder el hilo de su historia.",
    "Los grandes eventos empiezan con microcambios.",
    "Nadie tiene la historia completa; todos tienen una parte.",
    "La pregunta no es «¿está bien?», sino «¿está igual que cuando estaba estable?».",
    "Toda observación debe cambiar el cuidado.",
    "El paciente vive una película; nuestro trabajo es no perder ningún fotograma."
  ];
  var DONE_MSGS=["Un paso más cerca de cuidar mejor.","Así se construye criterio: una idea a la vez.","Ese módulo ya es parte de tu forma de observar.","Sumaste una herramienta más para tus decisiones."];
  function esc(s){return (''+s).replace(/[<>&]/g,function(x){return x==='<'?'&lt;':x==='>'?'&gt;':'&amp;';});}
  function _ids(){try{return MODULES.map(function(m){return m.n;});}catch(e){return [];}}
  function total(){return _ids().length||1;}
  function completed(sc){return _ids().filter(function(n){return sc[n]!=null&&sc[n]>=60;}).length;}
  function gname(){try{return (uname||'').split(' ')[0];}catch(e){return '';}}
  function gscores(){try{return scores||{};}catch(e){return {};}}

  var pop=document.createElement('div'); pop.className='mpop'; pop.id='mpop'; pop.setAttribute('role','dialog'); pop.setAttribute('aria-modal','true'); pop.setAttribute('aria-labelledby','mpt'); document.body.appendChild(pop);
  var _prevFocus=null, _inertes=[];
  /* Mientras hay un mensaje abierto, el resto de la página queda inerte: el foco no se escapa por detrás. */
  function bloquearFondo(capa){ soltarFondo(); Array.prototype.forEach.call(document.body.children,function(el){ if(el!==capa && el.id!=='toast' && !/^(SCRIPT|STYLE|LINK)$/.test(el.tagName) && !el.inert){ el.inert=true; _inertes.push(el); } }); }
  function soltarFondo(){ _inertes.forEach(function(el){ el.inert=false; }); _inertes=[]; }
  function enfocables(c){ return Array.prototype.filter.call(c.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])'),function(x){ return x.offsetParent!==null; }); }
  function atrapar(e,c){ if(e.key!=='Tab') return; var f=enfocables(c); if(!f.length){ e.preventDefault(); return; } var a=f[0], z=f[f.length-1];
    if(!c.contains(document.activeElement)){ e.preventDefault(); a.focus(); }
    else if(e.shiftKey && document.activeElement===a){ e.preventDefault(); z.focus(); }
    else if(!e.shiftKey && document.activeElement===z){ e.preventDefault(); a.focus(); } }
  function abrir(html){ if(!pop.classList.contains('on')) _prevFocus=document.activeElement; pop.innerHTML='<div class="box">'+html+'</div>'; var sub=pop.querySelector('.sub'); if(sub){ sub.id='mpd'; pop.setAttribute('aria-describedby','mpd'); } else pop.removeAttribute('aria-describedby'); pop.classList.add('on'); bloquearFondo(pop); var b=pop.querySelector('.acts .mh-btn.pri')||pop.querySelector('button'); if(b)setTimeout(function(){b.focus();},60); }
  function cerrar(devolver){ var tenia=pop.contains(document.activeElement); pop.classList.remove('on'); soltarFondo(); if(devolver===false) return;
    var dest=(_prevFocus && _prevFocus!==document.body && _prevFocus.focus && document.contains(_prevFocus) && _prevFocus.getClientRects().length)?_prevFocus:null;
    if(!dest && tenia){ dest=document.querySelector('#app h1')||document.getElementById('app'); if(dest && dest.tagName==='H1') dest.setAttribute('tabindex','-1'); }
    if(dest) try{ dest.focus({preventScroll:true}); }catch(e){} }
  window._closeMotiv=function(){ cerrar(); };
  pop.addEventListener('click',function(e){ if(e.target!==pop) return; if(_enTour){ _enTour=false; cerrar(); _finishOb(); } else window._closeMotiv(); });
  document.addEventListener('keydown',function(e){
    if(pop.classList.contains('on')){ if(e.key==='Escape'){ e.preventDefault(); if(_enTour){ _enTour=false; cerrar(); _finishOb(); } else window._closeMotiv(); } else atrapar(e,pop); return; }
    var co=document.getElementById('coach'); if(co && co.classList.contains('on')){ if(e.key==='Escape'){ e.preventDefault(); if(window.__coachFin) window.__coachFin(); } else atrapar(e,co); }
  });

  var welcomed=false;
  window.motivWelcome=function(){
    if(welcomed)return; welcomed=true;
    var _ob=false; try{_ob=STORE.get("ha_onboarded",false);}catch(e){} if(!_ob){ startOnboarding(); return; }
    var nm=gname(), sc=gscores(), c=completed(sc), N=total(), pct=Math.round(c/N*100);
    var q=QUOTES[Math.floor(Math.random()*QUOTES.length)];
    abrir('<span class="mark" aria-hidden="true">m</span><h2 id="mpt">'+(nm?'Hola, <b>'+esc(nm)+'</b>':'<b>Bienvenida</b>')+'</h2>'
      +'<p class="sub">'+(c===0?'Empecemos. Una idea por módulo.':(c>=N?'Completaste el programa.':'Seguí donde dejaste, vas muy bien.'))+'</p>'
      +'<blockquote class="cita">'+esc(q)+'</blockquote>'
      +'<div class="pr"><span>Tu avance en Academy</span><b>'+c+' de '+N+'</b></div><div class="bar" aria-hidden="true"><i style="width:'+pct+'%"></i></div>'
      +'<div class="acts"><button class="mh-btn pri" onclick="_closeMotiv()">Continuar</button></div>');
  };

  window.motivComplete=function(sc){
    sc=sc||gscores(); var c=completed(sc);
    if(!window.toast)return;
    var N=total(); if(c>=N){ toast('Completaste el programa. Ya sos parte de la Medicina de Continuidad.'); return; }
    if(c===Math.ceil(N/2) && c<N){ toast('Mitad de camino. Vas muy bien.'); return; }
    toast(DONE_MSGS[Math.floor(Math.random()*DONE_MSGS.length)]);
  };

  var ACAD='https://academy.humanahc.com.ar/';
  window.addToLinkedIn=function(){
    var d=new Date();
    var u='https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME'
      +'&name='+encodeURIComponent('Formación en Medicina de Continuidad · método Humana')
      +'&organizationName='+encodeURIComponent('Humana Health & Care')
      +'&issueYear='+d.getFullYear()+'&issueMonth='+(d.getMonth()+1)
      +'&certUrl='+encodeURIComponent(ACAD);
    window.open(u,'_blank','noopener');
  };
  window.shareLinkedIn=function(){
    var pre=(typeof allDone==='function'&&allDone())?'Completé la formación en Medicina de Continuidad de Humana Academy.':'Estoy formándome en Medicina de Continuidad con Humana Academy.';
    var txt=pre+'\n\nGracias a Humana Health & Care | Argentina por estos espacios de formación y aprendizaje.\n\n'+ACAD;
    window.open('https://www.linkedin.com/feed/?shareActive=true&text='+encodeURIComponent(txt),'_blank','noopener');
  };
  if(window.HA_pendingWelcome){ window.HA_pendingWelcome=false; setTimeout(function(){ if(window.motivWelcome) window.motivWelcome(); },300); }
  window.liButtonsHTML=function(earned){
    var nueva='<span class="mh-sr"> (se abre en otra pestaña)</span>';
    var share='<button class="libtn" onclick="shareLinkedIn()">'+LI+' Compartir en LinkedIn'+nueva+'</button>';
    var add=earned?'<button class="libtn ghost" onclick="addToLinkedIn()">'+LI+' Agregar a mi perfil de LinkedIn'+nueva+'</button>':'';
    return '<div class="libtns">'+share+add+'</div>';
  };
  window.showQuizResult=function(id,pct){
    var passed=pct>=60, isCap=(id==='cap'), n=isCap?null:+id;
    var _i=isCap?-1:MODULES.findIndex(function(z){return z.n===n;});
    var title,sub,primL,primA,secL;
    if(passed){
      title='<b>Muy bien</b>';
      sub='Completaste '+(isCap?'el caso integrador':('el módulo '+(_i+1)))+' con '+pct+'%.';
      if(isCap){ primL='Volver al inicio'; primA='home()'; secL=null; }
      else if(typeof allDone==='function'&&allDone()){ primL='Ver mi certificado'; primA='openCert()'; secL='Seguir acá'; }
      else { var nx=MODULES[_i+1]||null; if(nx){ primL='Seguir con el módulo '+(_i+2); primA='openM('+nx.n+')'; secL='Quedarme acá'; } else { primL='Volver al inicio'; primA='home()'; secL=null; } }
    } else {
      title='<b>Casi</b>';
      sub='Sacaste '+pct+'%. Necesitás 60% para aprobar. Repasá y reintentá.';
      primL='Reintentar'; primA=isCap?'openCap()':'openM('+n+')'; secL='Revisar respuestas';
    }
    var compl=completed(scores), N=total(), pp=Math.round(compl/N*100);
    var h='<span class="mark" aria-hidden="true">'+(passed?'✓':'m')+'</span><h2 id="mpt">'+title+'</h2><p class="sub">'+sub+'</p>';
    if(passed&&!isCap){ h+='<div class="pr"><span>Tu avance</span><b>'+compl+' de '+N+'</b></div><div class="bar" aria-hidden="true"><i style="width:'+pp+'%"></i></div>'; }
    h+='<div class="acts"><button class="mh-btn pri" onclick="window._closeMotiv();'+primA+'">'+primL+' <span aria-hidden="true">→</span></button>';
    if(secL){ h+='<button class="mh-btn sec" onclick="window._closeMotiv()">'+secL+'</button>'; }
    h+='</div>'; abrir(h);
  };

  /* ---- Recorrido de bienvenida ---- */
  var _TOUR=[
    {t:'Bienvenida a <b>Humana Academy</b>',d:'La formación en Medicina de Continuidad del método Humana. La hacés a tu ritmo, desde donde quieras.',logo:true},
    {t:'Cómo <b>funciona</b>',d:'Cada módulo tiene una lectura breve y una autoevaluación para fijar lo aprendido. Se aprueba con 60%.'},
    {t:'Tu avance se <b>guarda solo</b>',d:'Entrás con tu correo y seguís donde dejaste, desde la compu o el celular.'},
    {t:'Tu <b>certificado</b>',d:'Al completar los módulos lo descargás y lo podés compartir en LinkedIn.'}
  ], _ts=0, _enTour=false;
  function _renderTour(){ var s=_TOUR[_ts]; var d=_TOUR.map(function(_,i){return '<i class="'+(i===_ts?'on':'')+'"></i>';}).join('');
    var back=_ts>0?'<button class="mh-btn sec" onclick="__tourPrev()">Atrás</button>':'';
    abrir((s.logo?'<div style="margin:0 0 18px">'+LOGO.replace('class="mh-logo"','class="mh-logo" style="font-size:32px"')+'</div>':'<span class="mark" aria-hidden="true">'+String(_ts+1).padStart(2,'0')+'</span>')
      +'<h2 id="mpt">'+s.t+'</h2><p class="sub">'+s.d+'</p><p class="mh-sr">Paso '+(_ts+1)+' de '+_TOUR.length+'.</p><div class="tourdots" aria-hidden="true">'+d+'</div>'
      +'<div class="acts" style="grid-template-columns:'+(back?'1fr 1fr':'1fr')+'">'+back+'<button class="mh-btn pri" onclick="__tourNext()">'+(_ts<_TOUR.length-1?'Siguiente':'Empezar')+'</button></div>'); }
  window.__tourNext=function(){ if(_ts<_TOUR.length-1){_ts++;_renderTour();}else{_enTour=false;cerrar(false);_startCoach();} };
  window.__tourPrev=function(){ if(_ts>0){_ts--;_renderTour();} };
  function _coachTargets(){ var a=[]; var nx=document.querySelector('.next'); if(nx)a.push({el:nx,t:'Desde acá seguís donde dejaste.'}); var ub=document.getElementById('userbox'); if(ub)a.push({el:ub,t:'Acá ves tu avance en todo momento.'}); var cd=document.querySelector('.mrow'); if(cd)a.push({el:cd,t:'Cada módulo es una idea. Tocá para entrar.'}); return a.filter(function(x){return x.el&&x.el.getBoundingClientRect().width>0;}); }
  function _startCoach(){ var tg=_coachTargets(); if(!tg.length){ _finishOb(); return; } var i=0; var ov=document.getElementById('coach'); if(!ov){ov=document.createElement('div');ov.id='coach';ov.className='coach';document.body.appendChild(ov);}
    var _mm=matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.__coachFin=function(){ ov.classList.remove('on'); ov.innerHTML=''; soltarFondo(); _finishOb(); var a=document.querySelector('#app h1'); if(a){ a.setAttribute('tabindex','-1'); a.focus(); } };
    function show(){ var el=tg[i].el; el.scrollIntoView({block:'center'}); setTimeout(function(){ var r=el.getBoundingClientRect(); var p=8; var below=r.bottom<window.innerHeight-170; var ty=below?(r.bottom+14):(r.top-14); var tx=Math.max(12,Math.min(window.innerWidth-292,r.left));
      ov.innerHTML='<div class="coach-block"></div><div class="coach-ring" style="left:'+(r.left-p)+'px;top:'+(r.top-p)+'px;width:'+(r.width+p*2)+'px;height:'+(r.height+p*2)+'px"></div><div class="coach-tip" role="dialog" aria-modal="true" aria-labelledby="coachp" style="left:'+tx+'px;top:'+ty+'px;'+(below?'':'transform:translateY(-100%)')+'"><p id="coachp">'+tg[i].t+'</p><div class="coach-nav"><span>'+(i+1)+' de '+tg.length+'</span><button class="mh-btn pri sm" onclick="__coachNext()">'+(i<tg.length-1?'Siguiente':'Listo')+'</button></div></div>';
      ov.classList.add('on'); bloquearFondo(ov); var b=ov.querySelector('button'); if(b)b.focus(); },_mm?0:320); }
    window.__coachNext=function(){ i++; if(i>=tg.length){ window.__coachFin(); } else show(); }; show(); }
  function _finishOb(){ try{STORE.set('ha_onboarded',true);}catch(e){} }
  function startOnboarding(){ _ts=0; _enTour=true; _renderTour(); }
})();
