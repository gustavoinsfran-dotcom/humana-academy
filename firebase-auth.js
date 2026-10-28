/* Humana Academy — Cuenta propia (mail + contraseña) + progreso en la nube + panel admin */
(function(){
  var firebaseConfig = {
    apiKey: "AIzaSyAuFD2_AQOhOJDp92GFEreOc_8Si39ki2o",
    authDomain: "humana-academy.firebaseapp.com",
    projectId: "humana-academy",
    storageBucket: "humana-academy.firebasestorage.app",
    messagingSenderId: "516938011921",
    appId: "1:516938011921:web:09feb7c8677faf7c77a8b0",
    measurementId: "G-94WNB5E0FK"
  };
  var ADMINS = ["gustavo.insfran@infinitypharma.com.ar","k.ojanguren@humanahc.com"];
  var DOMINIOS = ["humanahc.com","humanahc.com.ar","infinitypharma.com.ar"];
  var MK='<span class="mh-logo" role="img" aria-label="método Humana"><i>m</i>étodo<b>Humana</b></span>';
  function SIDE(){ return '<div class="side"><div><span class="mh-word" style="font-size:18px"><b>Humana</b> <span>Academy</span></span></div><div>'+MK+'<p>La formación en Medicina de Continuidad del equipo de Humana Health &amp; Care Argentina.</p><div class="steps" aria-hidden="true"><div><i>01</i>Evaluamos la situación</div><div><i>02</i>Ordenamos el caso</div><div><i>03</i>Activamos el seguimiento</div></div></div><div class="foot">Acceso para el equipo de Humana Health &amp; Care · Argentina</div></div>'; }

  if(typeof firebase==='undefined'){console.warn('Firebase SDK no cargó');return;}
  try{ firebase.initializeApp(firebaseConfig); }catch(e){}
  var auth=firebase.auth(), db=firebase.firestore(), curUser=null;
  try{ auth.languageCode='es'; }catch(e){}
  try{ auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); }catch(e){}
  try{ STORE.set('ha_seen', true); }catch(e){}

  var st=document.createElement('style');
  st.textContent=".fbgate{position:fixed;inset:0;z-index:400;background:var(--mh-bg,#FBF9FA);display:none;overflow-y:auto;font-family:var(--mh-sans,Arial,sans-serif)}"
   +".fbgate.on{display:flex}"
   +".fbgate .lay{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);width:100%;min-height:100%}"
   +".fbgate .side{background:#fff;border-right:1px solid var(--mh-line,#E8E2E6);display:flex;flex-direction:column;justify-content:space-between;padding:56px}"
   +".fbgate .side .mh-logo{font-size:clamp(40px,5vw,60px)}"
   +".fbgate .side p{max-width:34ch;color:var(--mh-mut,#686070);font-size:16px;line-height:1.6;margin:18px 0 0}"
   +".fbgate .steps{display:grid;grid-template-columns:repeat(3,1fr);margin-top:40px}"
   +".fbgate .steps div{position:relative;padding:62px 16px 0 0;color:var(--mh-ink,#170F1E);font-size:15px;line-height:1.35}"
   +".fbgate .steps div:before{content:'';position:absolute;left:0;top:0;width:1px;height:48px;background:linear-gradient(#CFA9BC,rgba(207,169,188,.12))}"
   +".fbgate .steps i{display:block;font-family:var(--mh-serif,Georgia,serif);font-style:italic;color:var(--mh-accent,#B8407A);font-size:22px;margin-bottom:6px}"
   +".fbgate .foot{color:var(--mh-mut,#686070);font-size:13px;line-height:1.5}"
   +".fbgate .main{display:flex;align-items:center;justify-content:center;padding:40px 24px}"
   +".fbgate .box{width:100%;max-width:400px;animation:fbin .5s cubic-bezier(.22,1,.36,1)}"
   +"@keyframes fbin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}"
   +".fbgate h1{font-size:34px;font-weight:400;letter-spacing:-.03em;color:var(--mh-ink,#170F1E);margin:12px 0 8px;line-height:1.1}"
   +".fbgate h1 b{font-weight:700}"
   +".fbgate .sub{color:var(--mh-mut,#686070);font-size:15.5px;line-height:1.55;margin:0 0 26px}"
   +".fbtabs{display:grid;grid-template-columns:1fr 1fr;background:var(--mh-surface-2,#F6F2F4);border-radius:999px;padding:4px;margin:0 0 24px}"
   +".fbtabs button{min-height:44px;background:transparent;border:0;border-radius:999px;color:var(--mh-ink-2,#433B48);font:700 14.5px/1 var(--mh-sans,Arial);cursor:pointer;transition:.2s}"
   +".fbtabs button[aria-selected=true]{background:#fff;color:var(--mh-ink,#170F1E);box-shadow:0 1px 3px rgba(23,15,30,.12)}"
   +".fbf{margin:0 0 16px}"
   +".pwrap{position:relative}.pwrap .mh-input{padding-right:84px}"
   +".pwrap .eye{position:absolute;right:4px;top:50%;transform:translateY(-50%);min-height:40px;min-width:44px;background:none;border:0;border-radius:999px;color:var(--mh-accent-ink,#9A2F63);font:700 13px/1 var(--mh-sans,Arial);cursor:pointer;padding:0 12px}"
   +".pwrap .eye:hover{background:var(--mh-accent-tint,#F8ECF2)}"
   +".fbgate .mh-btn.pri{width:100%;margin-top:6px}"
   +".fbgate .msg{min-height:20px;color:var(--mh-err,#AF2318);font-size:14px;margin:12px 2px 0;line-height:1.5}"
   +".fbgate .msg.ok{color:var(--mh-ok,#1C7550)}"
   +".fbgate .lnk{display:block;min-height:44px;margin:14px auto 0;background:none;border:0;color:var(--mh-accent-ink,#9A2F63);font:700 14.5px/1 var(--mh-sans,Arial);cursor:pointer;padding:12px 16px;border-radius:999px}"
   +".fbgate .lnk:hover{background:var(--mh-accent-tint,#F8ECF2)}"
   +".fbgate .small{margin-top:28px;color:var(--mh-mut,#686070);font-size:13px;text-align:center;line-height:1.5}"
   +".fbgate .load{display:flex;flex-direction:column;align-items:center;gap:18px;color:var(--mh-mut,#686070);font-size:15px}"
   +".fbgate .load .mh-logo{font-size:34px}"
   +".fbgate .dots{display:flex;gap:6px}.fbgate .dots i{width:6px;height:6px;border-radius:50%;background:#CFA9BC;animation:fbd 1.2s infinite}.fbgate .dots i:nth-child(2){animation-delay:.2s}.fbgate .dots i:nth-child(3){animation-delay:.4s}"
   +"@keyframes fbd{0%,100%{opacity:.3}50%{opacity:1}}"
   +"@media(max-width:860px){.fbgate .lay{grid-template-columns:1fr}.fbgate .side{border-right:0;border-bottom:1px solid var(--mh-line,#E8E2E6);padding:28px 22px}.fbgate .side .steps,.fbgate .side .foot{display:none}.fbgate .side p{display:none}.fbgate .side .mh-logo{font-size:34px}.fbgate .main{align-items:flex-start;padding:28px 20px 40px}}";
  document.head.appendChild(st);

  var gate=document.createElement('div'); gate.className='fbgate'; gate.id='fbgate'; gate.setAttribute('role','region'); gate.setAttribute('aria-label','Acceso a Humana Academy');
  document.body.appendChild(gate);
  /* Con la pantalla de acceso adelante, lo de atrás queda inerte (no se puede tabular a lo que no se ve). */
  var _detras=[];
  function bloquear(){ Array.prototype.forEach.call(document.body.children,function(el){ if(el!==gate && !/^(SCRIPT|STYLE|LINK)$/.test(el.tagName) && !el.inert){ el.inert=true; _detras.push(el); } }); }
  function soltar(){ _detras.forEach(function(el){ el.inert=false; }); _detras=[]; }
  function esc(s){return (''+s).replace(/[<>&"]/g,function(c){return c==='<'?'&lt;':c==='>'?'&gt;':c==='&'?'&amp;':'&quot;';});}
  function showGate(){gate.classList.add('on'); soltar(); bloquear();}
  function hideGate(){gate.classList.remove('on'); soltar();}
  function suppressOnb(){var o=document.getElementById('onb');if(o)o.classList.remove('show');}
  function renderLoading(){ gate.innerHTML='<div class="main" style="width:100%"><div class="load" role="status">'+MK+'<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span>Cargando tu sesión</span></div></div>'; showGate(); }
  function dominioOK(em){ var d=(em.split('@')[1]||'').toLowerCase(); return DOMINIOS.indexOf(d)>=0; }
  function emailOK(em){ return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em); }

  function traducir(e){
    var c=(e&&e.code)||'';
    if(c==='auth/email-already-in-use') return 'Ese correo ya tiene una cuenta. Entrá desde la pestaña «Entrar».<br>Si nunca creaste una contraseña, usá <b>«Olvidé mi contraseña»</b> para crearla ahora.';
    if(c==='auth/invalid-email') return 'El correo no es válido.';
    if(c==='auth/weak-password') return 'La contraseña necesita al menos 6 caracteres.';
    if(c==='auth/user-not-found'||c==='auth/wrong-password'||c==='auth/invalid-credential'||c==='auth/invalid-login-credentials') return 'Correo o contraseña incorrectos.<br><b>¿Entrabas con el enlace por correo?</b> Ahora se usa contraseña: tocá «Olvidé mi contraseña» acá abajo y creá la tuya. Tu progreso se mantiene.';
    if(c==='auth/too-many-requests') return 'Demasiados intentos. Esperá unos minutos y probá de nuevo.';
    if(c==='auth/network-request-failed') return 'Sin conexión. Revisá tu internet.';
    if(c==='auth/operation-not-allowed') return 'El acceso con contraseña todavía no está habilitado en Firebase.';
    return (e&&e.message)||'No se pudo completar. Probá de nuevo.';
  }
  function setMsg(t,ok){ var m=document.getElementById('fbMsg'); if(!m)return; m.className='msg'+(ok?' ok':''); m.innerHTML=t; }
  /* Marca el campo con error para lectores de pantalla y lleva el foco ahí. */
  function marcar(id){ var el=document.getElementById(id); if(!el)return; el.classList.add('bad'); el.setAttribute('aria-invalid','true'); el.setAttribute('aria-describedby','fbMsg'); el.focus(); }

  var modo='login'; // login | signup
  window.__fbTab=function(m,foco){ modo=m; renderAuth(true); if(foco!==false){ var t=document.getElementById(m==='login'?'tbIn':'tbUp'); if(t)t.focus(); } };
  /* Pestañas con flechas (patrón ARIA de tabs). */
  window.__fbTabKey=function(e){ if(['ArrowLeft','ArrowRight','Home','End'].indexOf(e.key)<0)return; e.preventDefault(); var sig=(e.key==='Home')?'login':(e.key==='End')?'signup':(modo==='login'?'signup':'login'); __fbTab(sig); };

  function renderAuth(sinFoco){
    var esLogin = modo==='login';
    document.title=(esLogin?'Entrar':'Crear cuenta')+' · Humana Academy';
    var h='<div class="lay">'+SIDE()+'<div class="main"><div class="box">'
      +'<span class="mh-kicker">Humana Academy</span>'
      +'<h1>'+(esLogin?'Hola de <b>nuevo</b>':'Creá tu <b>cuenta</b>')+'</h1>'
      +'<p class="sub">'+(esLogin?'Entrá con tu correo de trabajo y tu contraseña.':'Te lleva menos de un minuto. Usá tu correo de trabajo.')+'</p>'
      +'<div class="fbtabs" role="tablist" aria-label="Modo de acceso" onkeydown="__fbTabKey(event)"><button type="button" role="tab" id="tbIn" aria-controls="fbPanel" tabindex="'+(esLogin?0:-1)+'" aria-selected="'+esLogin+'" onclick="__fbTab(\'login\')">Entrar</button>'
      +'<button type="button" role="tab" id="tbUp" aria-controls="fbPanel" tabindex="'+(esLogin?-1:0)+'" aria-selected="'+(!esLogin)+'" onclick="__fbTab(\'signup\')">Crear cuenta</button></div>'
      +'<div id="fbPanel" role="tabpanel" aria-labelledby="'+(esLogin?'tbIn':'tbUp')+'"><form id="fbForm" novalidate>';
    if(!esLogin){
      h+='<div class="fbf"><label class="mh-label" for="fbName">Nombre y apellido</label><input class="mh-input" id="fbName" type="text" autocomplete="name" placeholder="Ana García" required></div>';
    }
    h+='<div class="fbf"><label class="mh-label" for="fbEmail">Correo de trabajo</label><input class="mh-input" id="fbEmail" type="email" inputmode="email" autocomplete="'+(esLogin?'username':'email')+'" placeholder="nombre@humanahc.com.ar" required></div>'
      +'<div class="fbf"><label class="mh-label" for="fbPass">Contraseña</label><div class="pwrap"><input class="mh-input" id="fbPass" type="password" autocomplete="'+(esLogin?'current-password':'new-password')+'" placeholder="'+(esLogin?'Tu contraseña':'Mínimo 6 caracteres')+'" required><button type="button" class="eye" onclick="__fbEye()" aria-label="Ver contraseña" aria-pressed="false">Ver</button></div></div>';
    h+='<button type="submit" class="mh-btn pri" id="fbBtn">'+(esLogin?'Entrar':'Crear mi cuenta')+'</button>'
      +'<div class="msg" id="fbMsg" role="alert" aria-live="assertive"></div></form></div>';
    h+='<button type="button" class="lnk" onclick="__fbReset()">'+(esLogin?'Olvidé mi contraseña':'Ya tengo cuenta pero no tengo contraseña')+'</button>';
    h+='<p class="small">Sirven los correos @humanahc.com, @humanahc.com.ar e @infinitypharma.com.ar.</p></div></div></div>';
    gate.innerHTML=h; showGate();

    var f=document.getElementById(esLogin?'fbEmail':'fbName'); if(f && !sinFoco && matchMedia('(min-width: 861px)').matches)setTimeout(function(){f.focus();},80);
    document.getElementById('fbForm').onsubmit=function(ev){ ev.preventDefault(); (esLogin?doLogin:doSignup)(); };
    ['fbName','fbEmail','fbPass'].forEach(function(id){ var el=document.getElementById(id); if(el)el.addEventListener('input',function(){ el.classList.remove('bad'); el.removeAttribute('aria-invalid'); }); });
  }

  window.__fbEye=function(){ var p=document.getElementById('fbPass'); if(!p)return;
    var v=p.type==='password'; p.type=v?'text':'password'; var b=p.parentNode.querySelector('.eye'); b.textContent=v?'Ocultar':'Ver'; b.setAttribute('aria-label',v?'Ocultar contraseña':'Ver contraseña'); b.setAttribute('aria-pressed',v?'true':'false'); };

  function doLogin(){
    var em=(document.getElementById('fbEmail').value||'').trim().toLowerCase();
    var pw=document.getElementById('fbPass').value||'';
    var btn=document.getElementById('fbBtn');
    if(!emailOK(em)){ setMsg('Ingresá un correo válido.'); marcar('fbEmail'); return; }
    if(!pw){ setMsg('Ingresá tu contraseña.'); marcar('fbPass'); return; }
    btn.disabled=true; setMsg('Entrando…',true);
    auth.signInWithEmailAndPassword(em,pw).catch(function(e){ btn.disabled=false; setMsg(traducir(e)); });
  }

  function doSignup(){
    var nm=(document.getElementById('fbName').value||'').trim();
    var em=(document.getElementById('fbEmail').value||'').trim().toLowerCase();
    var pw=document.getElementById('fbPass').value||'';
    var btn=document.getElementById('fbBtn');
    if(nm.length<3||nm.indexOf(' ')<0){ setMsg('Escribí tu nombre y apellido.'); marcar('fbName'); return; }
    if(!emailOK(em)){ setMsg('Ingresá un correo válido.'); marcar('fbEmail'); return; }
    if(!dominioOK(em)){ setMsg('Usá tu correo de trabajo: <b>@humanahc.com</b>, <b>@humanahc.com.ar</b> o <b>@infinitypharma.com.ar</b>. La plataforma es para el equipo.'); marcar('fbEmail'); return; }
    if(pw.length<6){ setMsg('La contraseña necesita al menos 6 caracteres.'); marcar('fbPass'); return; }
    btn.disabled=true; setMsg('Creando tu cuenta…',true);
    auth.createUserWithEmailAndPassword(em,pw).then(function(cred){
      try{ uname=nm; STORE.set('ha_name',nm); }catch(e){}
      return db.collection('users').doc(cred.user.uid).set({
        name:nm, email:em,
        createdAt:firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt:firebase.firestore.FieldValue.serverTimestamp()
      },{merge:true});
    }).catch(function(e){ btn.disabled=false; setMsg(traducir(e)); });
  }

  window.__fbReset=function(){
    var em=(document.getElementById('fbEmail').value||'').trim().toLowerCase();
    if(!emailOK(em)){ setMsg('Escribí tu correo arriba y volvé a tocar «Olvidé mi contraseña».'); marcar('fbEmail'); return; }
    setMsg('Enviando…',true);
    auth.sendPasswordResetEmail(em).then(function(){
      setMsg('Te enviamos un correo a <b>'+esc(em)+'</b> para crear una contraseña nueva.<br><b>Fijate en spam</b>: llega desde noreply@humana-academy.firebaseapp.com.',true);
    }).catch(function(e){ setMsg(traducir(e)); });
  };

  /* Si un admin reinició esta cuenta, se borra también el progreso guardado en este equipo. */
  function _aplicarReinicio(d){
    try{
      var r=(d&&d.resetAt&&d.resetAt.toMillis)?d.resetAt.toMillis():0;
      if(r && r>(STORE.get('ha_reset',0)||0)){
        STORE.set('ha_s',{}); STORE.set('hn_s',{}); STORE.set('cq_s',{}); STORE.set('ha_reset',r);
      }
    }catch(e){}
  }

  function loadProgress(user){
    return db.collection('users').doc(user.uid).get().then(function(doc){
      var d=doc.exists?doc.data():null, cloud=(d&&d.scores)||{}, local={};
      _aplicarReinicio(d);
      try{ local=STORE.get('ha_s',{})||{}; }catch(e){}
      var merged={}, claves={};
      Object.keys(local).concat(Object.keys(cloud)).forEach(function(k){ claves[k]=1; });
      Object.keys(claves).forEach(function(n){ var v=Math.max(local[n]==null?-1:local[n], cloud[n]==null?-1:cloud[n]); if(v>=0)merged[n]=v; });
      try{ scores=merged; STORE.set('ha_s',merged); }catch(e){}
      if(d&&d.name){ try{ uname=d.name; STORE.set('ha_name',d.name); }catch(e){} }
      window.HA_isAdmin=isAdmin(user);
      /* Acceso abierto: todo el equipo ve todos los recorridos. */
      window.HA_clinicoOK = true; window.HA_pendiente = false;
      /* Nexo y Cutaquig: mezclar nube + local para que el panel funcione en cualquier equipo */
      function mezcla(nube, clave, ids){ var loc={}; try{ loc=STORE.get(clave,{})||{}; }catch(e){}
        var out={}; ids.forEach(function(n){ var v=Math.max(loc[n]==null?-1:loc[n], nube[n]==null?-1:nube[n]); if(v>=0)out[n]=v; });
        try{ STORE.set(clave,out); }catch(e){} return out; }
      window.HA_nexo     = mezcla((d&&d.nexo&&d.nexo.scores)||{}, 'hn_s', [1,2,3,4,5]);
      window.HA_cutaquig = mezcla((d&&d.cutaquig&&d.cutaquig.scores)||{}, 'cq_s', [1,2,3,4,5,6,7,8,9]);
      try{ uemail=user.email||''; STORE.set('ha_email',uemail); }catch(e){}
      return db.collection('users').doc(user.uid).set({email:user.email, scores:merged, name:(uname||(d&&d.name)||''), updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).catch(function(){});
    }).catch(function(){});
  }

  function renderNamePrompt(user){
    document.title='Un último paso · Humana Academy';
    gate.innerHTML='<div class="lay">'+SIDE()+'<div class="main"><div class="box"><span class="mh-kicker">Bienvenida</span><h1>Un último <b>paso</b></h1>'
      +'<p class="sub">Contanos tu nombre y apellido. Así aparece en tu certificado.</p>'
      +'<form id="fbNameForm" novalidate><div class="fbf"><label class="mh-label" for="fbName">Nombre y apellido</label><input class="mh-input" id="fbName" type="text" placeholder="Ana García" autocomplete="name" required></div>'
      +'<button type="submit" class="mh-btn pri" id="fbNameBtn">Continuar</button><div class="msg" id="fbMsg" role="alert"></div></form></div></div></div>';
    showGate(); setTimeout(function(){var f=document.getElementById('fbName');if(f)f.focus();},80);
    document.getElementById('fbNameForm').onsubmit=function(ev){ ev.preventDefault(); var btn=document.getElementById('fbNameBtn');
      var nm=(document.getElementById('fbName').value||'').trim();
      if(nm.length<3||nm.indexOf(' ')<0){ setMsg('Escribí tu nombre y apellido.'); marcar('fbName'); return; }
      btn.disabled=true;
      try{ uname=nm; STORE.set('ha_name',nm); }catch(e){}
      db.collection('users').doc(user.uid).set({name:nm, email:user.email, updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).finally(function(){ enter(user); });
    };
  }

  function enter(user){
    /* Si vino de un enlace directo a otra pagina, lo devolvemos ahi. */
    try{
      var v=new URLSearchParams(location.search).get('volver');
      if(v && /^[a-z0-9_-]+\.html$/i.test(v)){ location.replace(v); return; }
    }catch(e){}
    hideGate(); suppressOnb();
    if(typeof home==='function')home();
    if(typeof renderUserbox==='function')renderUserbox();
    addAdminUI(user);
    if(window.motivWelcome){ setTimeout(window.motivWelcome,600); } else { window.HA_pendingWelcome=true; }
  }

  auth.onAuthStateChanged(function(user){
    curUser=user;
    if(user){
      suppressOnb();
      var contenido = (window.HA_cargarContenido ? HA_cargarContenido(db) : Promise.resolve(null))
        .then(function(c){ if(c && window.HA_aplicarContenido) HA_aplicarContenido(c); });
      Promise.all([loadProgress(user), contenido]).then(function(){
        if(!uname){ renderNamePrompt(user); }
        else { enter(user); }
      });
    } else { modo='login'; renderAuth(); }
  });

  renderLoading();

  window.HA_sync=function(sc){
    if(!curUser)return;
    db.collection('users').doc(curUser.uid).set({email:curUser.email, name:(uname||''), scores:sc, updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).catch(function(){});
  };
  window.HA_saveName=function(v){
    if(!curUser||!v)return;
    db.collection('users').doc(curUser.uid).set({name:v, updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).catch(function(){});
  };

  function isAdmin(u){ return !!(u && ADMINS.indexOf((u.email||'').toLowerCase())>=0); }

  function salir(){ if(confirm('¿Querés cerrar sesión?')){ auth.signOut().then(function(){ location.reload(); }); } }
  function addAdminUI(user){
    [['nav.desk','d'],['#drawer','m']].forEach(function(par){
      var nav=document.querySelector(par[0]); if(!nav || document.getElementById('logout'+par[1])) return;
      function link(id,txt,fn,cls,boton){ var a=document.createElement('a'); a.id=id+par[1]; a.textContent=txt; a.style.cursor='pointer'; if(cls)a.className=cls;
        if(typeof fn==='string') a.href=fn; else { a.href='#'+id; if(boton)a.setAttribute('role','button'); a.onclick=function(ev){ ev.preventDefault(); if(window.closeMenu)closeMenu(); fn(); }; } nav.appendChild(a); }
      if(isAdmin(user)){ link('estudio','Estudio','estudio.html','estudio'); link('admin','Admin',showAdmin,'adm'); }
      link('logout','Salir',salir,'',true);
    });
  }

  /* ====================== PANEL DE GESTIÓN DE ACCESOS ====================== */
  var _U=[], _filtro='', _verOcultas=false;

  var sadm=document.createElement('style');
  sadm.textContent=".gcard{background:#fff;border:1px solid var(--mh-line);border-radius:20px;padding:6px 22px}"
   +".gstats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin:0 0 20px}"
   +".gstat{background:#fff;border:1px solid var(--mh-line);border-radius:18px;padding:18px 20px}"
   +".gstat b{display:block;font-family:var(--mh-serif);font-style:italic;font-weight:500;font-size:34px;color:var(--mh-accent);line-height:1.1}"
   +".gstat span{font-size:13.5px;color:var(--mh-mut)}"
   +".gtools{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:0 0 16px}"
   +"#gq{flex:1;min-width:220px}"
   +".gchk{display:flex;align-items:center;gap:8px;color:var(--mh-ink-2);font-size:14.5px;cursor:pointer;white-space:nowrap;min-height:44px}"
   +".gchk input{width:18px;height:18px;accent-color:#B8407A}"
   +".urow{display:grid;grid-template-columns:minmax(0,2.4fr) auto auto;gap:14px;align-items:center;padding:16px 2px;border-bottom:1px solid var(--mh-line)}"
   +".urow:last-child{border-bottom:0}"
   +".urow.oculta{opacity:.5}"
   +".uname{font-weight:700;color:var(--mh-ink);font-size:15.5px;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"
   +".umail{color:var(--mh-mut);font-size:13.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"
   +".uprog{color:var(--mh-mut);font-size:13px;margin-top:4px}"
   +".uprog b{color:var(--mh-ink)}"
   +".ubtn{min-height:44px;border:1.5px solid var(--mh-line-2);background:#fff;color:var(--mh-ink);border-radius:999px;padding:0 14px;font:700 13px/1 var(--mh-sans);cursor:pointer;white-space:nowrap}"
   +".ubtn:hover{border-color:var(--mh-ink)}"
   +".ubadge{font:700 11.5px/1 var(--mh-sans);letter-spacing:.06em;text-transform:uppercase;padding:6px 10px;border-radius:999px;white-space:nowrap}"
   +".ub-ok{background:var(--mh-ok-tint);color:var(--mh-ok)}.ub-pend{background:var(--mh-accent-tint);color:var(--mh-accent-ink)}.ub-na{background:var(--mh-surface-2);color:var(--mh-mut)}.ub-adm{background:var(--mh-ink);color:#fff}"
   +"@media(max-width:760px){.urow{grid-template-columns:1fr!important;gap:10px}}";
  document.head.appendChild(sadm);

  function _idsAcademy(){ try{ return MODULES.map(function(m){return m.n;}); }catch(e){ return [1,2,3,4,5,6,7,8,9,10]; } }
  function _tot(){ return _idsAcademy().length+5+9; }
  function _prog(d){
    var sc=d.scores||{}, a=_idsAcademy().filter(function(n){return sc[n]>=60;}).length;
    var ns=(d.nexo&&d.nexo.scores)||{}, x=[1,2,3,4,5].filter(function(n){return ns[n]>=60;}).length;
    var cs=(d.cutaquig&&d.cutaquig.scores)||{}, c=[1,2,3,4,5,6,7,8,9].filter(function(n){return cs[n]>=60;}).length;
    return {a:a,x:x,c:c};
  }
  function _esAdminMail(m){ return ADMINS.indexOf((m||'').toLowerCase())>=0; }

  window.__ocultar=function(uid, ok){
    if(!isAdmin(curUser)) return;
    if(ok && !confirm('¿Ocultar esta cuenta del panel? No se borra nada: podés volver a mostrarla cuando quieras.')) return;
    db.collection('users').doc(uid).set({oculto:!!ok},{merge:true}).then(_recargar).catch(_errAdmin);
  };
  window.__reiniciar=function(uid, nombre){
    if(!isAdmin(curUser)) return;
    if(!confirm('¿Reiniciar el progreso de '+nombre+'?\n\nLa cuenta queda en cero en Academy, Nexo y Cutaquig. Lo que había hecho queda guardado como historial dentro del registro.')) return;
    var ref=db.collection('users').doc(uid);
    ref.get().then(function(doc){
      var d=doc.data()||{};
      var copia={name:d.name||'', scores:d.scores||{}, nexoScores:(d.nexo&&d.nexo.scores)||{}, cutaquigScores:(d.cutaquig&&d.cutaquig.scores)||{},
        archivadoEl:firebase.firestore.Timestamp.now(), archivadoPor:(curUser.email||'')};
      return ref.update({
        historial:firebase.firestore.FieldValue.arrayUnion(copia),
        scores:{}, 'nexo.scores':{}, 'cutaquig.scores':{},
        resetAt:firebase.firestore.FieldValue.serverTimestamp(),
        resetBy:(curUser.email||'')
      });
    }).then(_recargar).catch(_errAdmin);
  };
  window.__renombrar=function(uid, actual){
    if(!isAdmin(curUser)) return;
    var nm=prompt('Nombre y apellido de quien usa esta cuenta (sale en su certificado):', actual||'');
    if(nm===null) return; nm=nm.trim();
    if(nm.length<3){ alert('Escribí nombre y apellido.'); return; }
    db.collection('users').doc(uid).set({name:nm, updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).then(_recargar).catch(_errAdmin);
  };
  window.__verOcultas=function(v){ _verOcultas=v; _pintar(); var c=document.getElementById('gocu'); if(c)c.focus(); };
  window.__buscar=function(v){ _filtro=(v||'').toLowerCase(); _pintar(); };

  function _errAdmin(e){
    var falta = /permission|insufficient/i.test(e.message||'');
    var c=document.getElementById('gadm');
    if(falta && c){
      var b=document.getElementById('gwarn');
      if(!b){ b=document.createElement('div'); b.id='gwarn';
        b.style.cssText='background:var(--mh-warn-tint);border-radius:16px;padding:18px 20px;margin:0 0 16px';
        b.innerHTML='<b style="color:var(--mh-warn);font-size:15px">Falta un paso para que esto funcione</b>'
         +'<p style="color:var(--mh-ink-2);font-size:14px;margin:7px 0 0;line-height:1.6">Firestore no me deja guardar el cambio porque las reglas actuales solo permiten que cada uno escriba su propio registro. Para habilitar accesos desde acá hay que publicar las reglas nuevas:<br><br>'
         +'<b>Firebase Console → Firestore Database → Reglas</b> → borrá todo, pegá las reglas que te pasó Claude y tocá <b>Publicar</b>.<br><br>'
         +'Mientras tanto podés ver a todos, pero no cambiar nada.</p>';
        c.insertBefore(b, c.firstChild); window.scrollTo(0,0);
      }
      return;
    }
    alert('No se pudo guardar.\n\n'+e.message);
  }
  function _recargar(){ return _cargar().then(_pintar); }
  function _cargar(){
    return db.collection('users').get().then(function(qs){
      _U=[]; qs.forEach(function(doc){
        var d=doc.data()||{}; var p=_prog(d);
        _U.push({uid:doc.id, name:d.name||'(sin nombre)', email:d.email||'—',
          oculto:!!d.oculto || !!d.deleted, esAdmin:_esAdminMail(d.email),
          a:p.a, x:p.x, c:p.c, total:p.a+p.x+p.c});
      });
    });
  }

  function _pintar(){
    var cont=document.getElementById('gadm'); if(!cont)return;
    var vis=_U.filter(function(u){ return _verOcultas || !u.oculto; });
    var TOT=_tot(), NA=_idsAcademy().length;
    var completos=vis.filter(function(u){ return u.total>=TOT; });
    var activos=vis.filter(function(u){ return u.total>0; });
    var sinEmpezar=vis.filter(function(u){ return u.total===0; });

    var h='<div class="gstats">'
     +'<div class="gstat"><b>'+vis.length+'</b><span>usuarios</span></div>'
     +'<div class="gstat"><b>'+activos.length+'</b><span>empezaron</span></div>'
     +'<div class="gstat"><b>'+completos.length+'</b><span>completaron todo</span></div>'
     +'<div class="gstat"><b>'+sinEmpezar.length+'</b><span>sin empezar</span></div>'
     +'</div>';

    h+='<div class="gtools"><label class="mh-sr" for="gq">Buscar personas</label><input id="gq" class="mh-input" type="search" placeholder="Buscar por nombre o correo…" value="'+esc(_filtro)+'" oninput="__buscar(this.value)">'
     +'<label class="gchk"><input type="checkbox" id="gocu" '+(_verOcultas?'checked':'')+' onchange="__verOcultas(this.checked)"> Ver ocultas</label></div>';

    var lista=vis.filter(function(u){
      if(!_filtro) return true;
      return (u.name+' '+u.email).toLowerCase().indexOf(_filtro)>=0;
    });
    lista.sort(function(a,b){
      if(a.total!==b.total) return b.total-a.total;
      return (a.name||'').localeCompare(b.name||'');
    });

    if(!lista.length){ h+='<div class="gcard" style="text-align:center;color:var(--mh-mut);padding:28px">Nadie coincide con la búsqueda.</div>'; cont.innerHTML=h; return; }

    h+='<div class="gcard">';
    lista.forEach(function(u){
      var badge = u.esAdmin ? '<span class="ubadge ub-adm">Admin</span>'
        : (u.total>=TOT ? '<span class="ubadge ub-ok">Completó todo</span>'
        : (u.total>0 ? '<span class="ubadge ub-pend">En curso</span>'
        : '<span class="ubadge ub-na">Sin empezar</span>'));
      h+='<div class="urow'+(u.oculto?' oculta':'')+'" style="grid-template-columns:minmax(0,2.4fr) auto auto">';
      h+='<div><div class="uname">'+esc(u.name)+(u.oculto?' <span style="color:var(--mh-mut);font-size:12px;font-weight:400">(oculta)</span>':'')+'</div>'
        +'<div class="umail">'+esc(u.email)+'</div>'
        +'<div class="uprog">Academy '+u.a+'/'+NA+' · Nexo '+u.x+'/5 · Cutaquig '+u.c+'/9 · <b>'+u.total+' de '+TOT+'</b></div></div>';
      h+='<div>'+badge+'</div>';
      var nmq=esc(u.name).replace(/'/g,'').replace(/\\/g,'');
      h+='<div style="display:flex;gap:6px;flex-wrap:wrap">'+(u.esAdmin?'':'<button class="ubtn gh" onclick="__renombrar(\''+u.uid+'\',\''+nmq+'\')">Nombre</button>'+(u.total>0?'<button class="ubtn gh" onclick="__reiniciar(\''+u.uid+'\',\''+esc(u.name).replace(/'/g,'')+'\')">Reiniciar</button>':'')+'<button class="ubtn gh" onclick="__ocultar(\''+u.uid+'\','+(u.oculto?'false':'true')+')">'+(u.oculto?'Mostrar':'Ocultar')+'</button>')+'</div>';
      h+='</div>';
    });
    h+='</div>';
    h+='<p style="color:var(--mh-mut);font-size:13px;margin-top:16px;line-height:1.6">Todo el equipo ve los tres recorridos. El registro está limitado a los correos del grupo. Cutaquig® es un medicamento de venta bajo receta: su capacitación es de uso interno y no debe difundirse fuera de Humana.</p>';
    cont.innerHTML=h;
    var q=document.getElementById('gq'); if(q && _filtro){ q.focus(); q.setSelectionRange(q.value.length,q.value.length); }
  }

  window.showAdmin=function(){
    if(!isAdmin(curUser)) return;
    var app=document.getElementById('app'); if(!app)return;
    try{ vista='admin'; }catch(e){}
    app.innerHTML='<section class="blk"><div class="wrap"><button class="back" onclick="home()"><span aria-hidden="true">←</span> Inicio</button>'
      +'<div class="sh"><div><span class="mh-kicker">Administración</span><h1 tabindex="-1">Quién está <b>aprendiendo</b></h1></div><p>Todas las personas que entraron a la plataforma y cuánto avanzaron.</p></div>'
      +'<div id="gadm" aria-busy="true"><p class="sub">Cargando…</p></div></div></section>';
    document.title='Administración · Humana Academy'; window.scrollTo(0,0); try{ app.querySelector('h1').focus({preventScroll:true}); }catch(e){}
    _cargar().then(_pintar).then(function(){ var g=document.getElementById('gadm'); if(g)g.removeAttribute('aria-busy'); }).catch(function(e){
      document.getElementById('gadm').innerHTML='<div class="gcard" style="padding:22px"><b style="color:var(--mh-err)">No se pudo cargar</b><p style="color:var(--mh-mut);font-size:14px;margin-top:6px">'+esc(e.message)+'</p></div>';
    });
  };
})();
