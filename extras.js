/* Humana Academy — LinkedIn + pops motivacionales */
(function(){
  var MK='<svg viewBox="0 0 128 74" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block"><defs><linearGradient id="mvhg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#4733A6"/><stop offset="0.45" stop-color="#8E2E9E"/><stop offset="1" stop-color="#EC2E8E"/></linearGradient></defs><path fill="url(#mvhg)" d="M6 66 L40 18 L40 9 L48 9 L48 15 L50 12 Q53 8 56 13 L62 24 Q84 52 124 44 Q98 41 68 31 Q60 28 55 34 L34 66 Z"/></svg>';
  var st=document.createElement('style');
  st.textContent=".mpop{position:fixed;inset:0;z-index:350;background:rgba(10,7,19,.72);display:none;align-items:center;justify-content:center;padding:24px;backdrop-filter:blur(4px)}"
   +".mpop.on{display:flex}"
   +".mpop .box{background:#191024;border:1px solid #2C1F42;border-radius:22px;max-width:440px;width:100%;padding:32px 30px;text-align:center;animation:mpp .3s cubic-bezier(.2,.8,.2,1)}"
   +"@keyframes mpp{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}"
   +".mpop .mk{width:58px;height:36px;margin:0 auto 14px;display:block}"
   +".mpop h3{color:#EDE6F5;font-size:20px;margin:0;font-weight:800}"
   +".mpop .sub{color:#9E90B5;font-size:13.5px;margin:5px 0 0}"
   +".mpop .q{color:#efe3f7;font-style:italic;font-size:15px;line-height:1.55;margin:16px 0;padding:14px 16px;background:#1E1430;border-left:3px solid #EC2E8E;border-radius:0 12px 12px 0;text-align:left}"
   +".mpop .pr{color:#9E90B5;font-size:13px;margin:0 0 6px}"
   +".mpop .bar{height:8px;border-radius:5px;background:#2C1F42;overflow:hidden;margin:0 0 18px}"
   +".mpop .bar i{display:block;height:100%;background:linear-gradient(135deg,#4733A6,#8E2E9E 50%,#EC2E8E);transition:width .6s cubic-bezier(.2,.8,.2,1)}"
   +".mpop button{border:none;cursor:pointer;color:#fff;font-weight:700;font-size:15px;padding:12px 28px;border-radius:11px;background:linear-gradient(135deg,#4733A6,#8E2E9E 50%,#EC2E8E);font-family:inherit}"
   +".libtns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:14px}"
   +".libtn{display:inline-flex;align-items:center;gap:8px;background:#0A66C2;color:#fff;border:none;cursor:pointer;font-weight:700;font-size:14px;padding:11px 18px;border-radius:10px;font-family:inherit;text-decoration:none}"
   +".libtn.ghost{background:transparent;border:1.5px solid #0A66C2;color:#4aa3e6}"
   +".libtn svg{width:16px;height:16px;fill:currentColor}";
  document.head.appendChild(st);

  var LI='<svg viewBox="0 0 24 24"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>';

  var QUOTES=[
    "La continuidad no es seguir al paciente: es no perder el hilo de su historia.",
    "Los grandes eventos empiezan con microcambios.",
    "Nadie tiene la historia completa; todos tienen una parte.",
    "La pregunta no es «¿está bien?», sino «¿está igual que cuando estaba estable?».",
    "Toda observación debe cambiar el cuidado.",
    "El paciente vive una película; nuestro trabajo es no perder ningún fotograma."
  ];
  var DONE_MSGS=[
    "Un paso más cerca de cuidar mejor 👏",
    "Así se construye criterio: una idea a la vez.",
    "Ese módulo ya es parte de tu forma de observar.",
    "Sumaste una herramienta más para tus decisiones."
  ];
  function esc(s){return (''+s).replace(/[<>&]/g,function(x){return x==='<'?'&lt;':x==='>'?'&gt;':'&amp;';});}
  function completed(sc){return [1,2,3,4,5,6].filter(function(n){return sc[n]!=null&&sc[n]>=60;}).length;}
  function gname(){try{return (uname||'').split(' ')[0];}catch(e){return '';}}
  function gscores(){try{return scores||{};}catch(e){return {};}}

  var pop=document.createElement('div'); pop.className='mpop'; pop.id='mpop'; document.body.appendChild(pop);
  window._closeMotiv=function(){pop.classList.remove('on');};

  var welcomed=false;
  window.motivWelcome=function(){
    if(welcomed)return; welcomed=true;
    var _ob=false; try{_ob=STORE.get("ha_onboarded",false);}catch(e){} if(!_ob){ startOnboarding(); return; }
    var nm=gname(), sc=gscores(), c=completed(sc), pct=Math.round(c/6*100);
    var q=QUOTES[Math.floor(Math.random()*QUOTES.length)];
    var hi = nm ? ('Hola, '+esc(nm)+' 👋') : 'Bienvenido 👋';
    var sub = c===0 ? 'Empecemos. Una idea por módulo.' : (c>=6 ? '¡Completaste el programa! 🎓' : 'Seguí donde dejaste, vas muy bien.');
    pop.innerHTML='<div class="box"><span class="mk">'+MK+'</span><h3>'+hi+'</h3><p class="sub">'+sub+'</p>'
      +'<div class="q">“'+esc(q)+'”</div>'
      +'<div class="pr">Tu avance: '+c+'/6</div><div class="bar"><i style="width:'+pct+'%"></i></div>'
      +'<button onclick="_closeMotiv()">Continuar</button></div>';
    pop.classList.add('on');
  };

  window.motivComplete=function(sc){
    sc=sc||gscores(); var c=completed(sc);
    if(!window.toast)return;
    if(c>=6){ toast('¡Completaste el programa! Ya sos parte de la Medicina de Continuidad 🎓'); return; }
    if(c===3){ toast('Mitad de camino. Vas muy bien 💪'); return; }
    toast(DONE_MSGS[Math.floor(Math.random()*DONE_MSGS.length)]);
  };

  var ACAD='https://academy.humanahc.com.ar/';
  window.addToLinkedIn=function(){
    var d=new Date();
    var u='https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME'
      +'&name='+encodeURIComponent('Formación en Medicina de Continuidad')
      +'&organizationName='+encodeURIComponent('Humana Health & Care')
      +'&issueYear='+d.getFullYear()+'&issueMonth='+(d.getMonth()+1)
      +'&certUrl='+encodeURIComponent(ACAD);
    window.open(u,'_blank','noopener');
  };
  window.shareLinkedIn=function(){
    var pre=(typeof allDone==='function'&&allDone())?'Completé la formación en Medicina de Continuidad de Humana Academy 🎓':'Estoy formándome en Medicina de Continuidad con Humana Academy 🎓';
    var txt=pre+'\n\nGracias a Humana Health & Care | Argentina por estos espacios de formación y aprendizaje. 🙌\n\n'+ACAD;
    window.open('https://www.linkedin.com/feed/?shareActive=true&text='+encodeURIComponent(txt),'_blank','noopener');
  };
  if(window.HA_pendingWelcome){ window.HA_pendingWelcome=false; setTimeout(function(){ if(window.motivWelcome) window.motivWelcome(); },300); }
  // botones para inyectar en el certificado
  window.liButtonsHTML=function(earned){
    var share='<button class="libtn" onclick="shareLinkedIn()">'+LI+' Compartir en LinkedIn</button>';
    var add=earned?'<button class="libtn ghost" onclick="addToLinkedIn()">'+LI+' Agregar a mi perfil</button>':'';
    return '<div class="libtns">'+share+add+'</div>';
  };
  window.showQuizResult=function(id,pct){
    var pop=document.getElementById('mpop'); if(!pop)return;
    var passed=pct>=60, isCap=(id==='cap'), n=isCap?null:+id;
    var title,sub,primL,primA,secL;
    if(passed){
      title='¡Felicitaciones!';
      sub='Completaste '+(isCap?'el caso integrador':('el Módulo '+n))+' con '+pct+'%.';
      if(isCap){ primL='Volver al inicio'; primA='home()'; secL=null; }
      else if(typeof allDone==='function'&&allDone()){ primL='Ver mi certificado 🎓'; primA='openCert()'; secL='Seguir acá'; }
      else { var nx=(typeof MODULES!=='undefined')?MODULES.find(function(z){return z.n===n+1;}):null; if(nx){ primL='Continuar: Módulo '+nx.n+' →'; primA='openM('+nx.n+')'; secL='Seguir acá'; } else { primL='Volver al inicio'; primA='home()'; secL=null; } }
    } else {
      title='¡Casi!';
      sub='Sacaste '+pct+'%. Necesitás 60% para aprobar. Repasá y reintentá.';
      primL='Reintentar'; primA=isCap?'openCap()':'openM('+n+')'; secL='Seguir acá';
    }
    var compl=[1,2,3,4,5,6].filter(function(z){return scores[z]!=null&&scores[z]>=60;}).length, pp=Math.round(compl/6*100);
    var h='<div class="box"><div style="font-size:44px;line-height:1;margin-bottom:4px">'+(passed?'🎉':'💪')+'</div><h3>'+title+'</h3><p class="sub">'+sub+'</p>';
    if(passed&&!isCap){ h+='<div class="pr" style="margin-top:16px">Tu avance: '+compl+'/6</div><div class="bar"><i style="width:'+pp+'%"></i></div>'; }
    h+='<button style="width:100%;margin-top:16px" onclick="window._closeMotiv();'+primA+'">'+primL+'</button>';
    if(secL){ h+='<button style="width:100%;margin-top:10px;background:transparent;border:1.5px solid #2C1F42;color:#EDE6F5" onclick="window._closeMotiv()">'+secL+'</button>'; }
    h+='</div>'; pop.innerHTML=h; pop.classList.add('on');
  };

  // ---- Onboarding: carrusel + coach-marks ----
  var _obcss=false;
  function _obcssInject(){ if(_obcss)return; _obcss=true; var s2=document.createElement("style"); s2.textContent=".tourdots{display:flex;gap:6px;justify-content:center;margin:18px 0 2px}.tourdots i{width:7px;height:7px;border-radius:50%;background:#2C1F42;transition:.2s;display:inline-block}.tourdots i.on{background:#EC2E8E;width:20px;border-radius:4px}"+".tourbtns{display:flex;gap:10px;margin-top:16px}.tourbtns button{flex:1;border:none;cursor:pointer;font-weight:800;font-size:15px;padding:13px;border-radius:11px;font-family:inherit;color:#fff;background:linear-gradient(135deg,#4733A6,#8E2E9E 50%,#EC2E8E)}.tourbtns button.tsec{background:transparent;border:1.5px solid #2C1F42;color:#EDE6F5}"+".coach{position:fixed;inset:0;z-index:360;display:none}.coach.on{display:block}.coach-block{position:absolute;inset:0}"+".coach-ring{position:fixed;border-radius:12px;border:2px solid #EC2E8E;box-shadow:0 0 0 9999px rgba(8,5,15,.72);transition:all .3s;z-index:361;pointer-events:none}"+".coach-tip{position:fixed;max-width:262px;background:#191024;border:1px solid #2C1F42;border-radius:12px;padding:14px 16px;z-index:362;box-shadow:0 12px 30px rgba(0,0,0,.55)}"+".coach-tip p{margin:0 0 10px;color:#EDE6F5;font-size:14px;line-height:1.5}.coach-nav{display:flex;align-items:center;justify-content:space-between}.coach-nav span{color:#9E90B5;font-size:12px}"+".coach-nav button{color:#fff;border:none;font-weight:800;font-size:13px;padding:8px 16px;border-radius:9px;cursor:pointer;font-family:inherit;background:linear-gradient(135deg,#4733A6,#8E2E9E 50%,#EC2E8E)}"; document.head.appendChild(s2); }
  var _TOUR=[{ic:"🎓",t:"Bienvenido a Humana Academy",d:"Un programa de formación en Medicina de Continuidad. Lo hacés a tu ritmo, desde donde quieras."},{ic:"📚",t:"Cómo funciona",d:"Cada módulo tiene una lectura breve, audio y video, y una autoevaluación al final para fijar lo aprendido."},{ic:"💾",t:"Tu progreso se guarda solo",d:"Entrás con tu correo y seguís donde dejaste, desde la compu o el celular. No perdés nada."},{ic:"🏆",t:"Tu certificado",d:"Al completar los módulos obtenés tu certificado, que podés descargar y compartir en LinkedIn."}], _ts=0;
  function _renderTour(){ _obcssInject(); var s=_TOUR[_ts]; var d=_TOUR.map(function(_,i){return "<i class=\""+(i===_ts?"on":"")+"\"></i>";}).join("");
    var back=_ts>0?"<button class=\"tsec\" onclick=\"__tourPrev()\">Atrás</button>":"";
    pop.innerHTML="<div class=\"box\"><div style=\"font-size:46px;line-height:1;margin-bottom:6px\">"+s.ic+"</div><h3>"+s.t+"</h3><p class=\"sub\" style=\"margin-top:6px\">"+s.d+"</p><div class=\"tourdots\">"+d+"</div><div class=\"tourbtns\">"+back+"<button onclick=\"__tourNext()\">"+(_ts<_TOUR.length-1?"Siguiente":"Empezar")+"</button></div></div>";
    pop.classList.add("on"); }
  window.__tourNext=function(){ if(_ts<_TOUR.length-1){_ts++;_renderTour();}else{pop.classList.remove("on");_startCoach();} };
  window.__tourPrev=function(){ if(_ts>0){_ts--;_renderTour();} };
  function _coachTargets(){ var a=[]; var ub=document.getElementById("userbox"); if(ub)a.push({el:ub,t:"Acá ves tu avance en todo momento."}); var cd=document.querySelector(".mcard"); if(cd)a.push({el:cd,t:"Tocá acá para empezar a aprender."}); var ce=document.querySelector("nav.desk a[onclick*='openCert']"); if(ce)a.push({el:ce,t:"Tu certificado aparece acá al terminar."}); return a.filter(function(x){return x.el&&x.el.getBoundingClientRect().width>0;}); }
  function _startCoach(){ _obcssInject(); var tg=_coachTargets(); if(!tg.length){ _finishOb(); return; } var i=0; var ov=document.getElementById("coach"); if(!ov){ov=document.createElement("div");ov.id="coach";ov.className="coach";document.body.appendChild(ov);}
    function show(){ var el=tg[i].el; el.scrollIntoView({block:"center"}); setTimeout(function(){ var r=el.getBoundingClientRect(); var p=8; var below=r.bottom<window.innerHeight-150; var ty=below?(r.bottom+12):(r.top-12); var tx=Math.max(12,Math.min(window.innerWidth-274,r.left));
      ov.innerHTML="<div class=\"coach-block\"></div><div class=\"coach-ring\" style=\"left:"+(r.left-p)+"px;top:"+(r.top-p)+"px;width:"+(r.width+p*2)+"px;height:"+(r.height+p*2)+"px\"></div><div class=\"coach-tip\" style=\"left:"+tx+"px;top:"+ty+"px;"+(below?"":"transform:translateY(-100%)")+"\"><p>"+tg[i].t+"</p><div class=\"coach-nav\"><span>"+(i+1)+"/"+tg.length+"</span><button onclick=\"__coachNext()\">"+(i<tg.length-1?"Siguiente":"Listo")+"</button></div></div>";
      ov.classList.add("on"); },320); }
    window.__coachNext=function(){ i++; if(i>=tg.length){ ov.classList.remove("on"); _finishOb(); } else show(); }; show(); }
  function _finishOb(){ try{STORE.set("ha_onboarded",true);}catch(e){} }
  function startOnboarding(){ _ts=0; _renderTour(); }
})();
