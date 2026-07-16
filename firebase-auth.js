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
  var DOMINIOS = ["humanahc.com","infinitypharma.com.ar"];
  var ROLES = [
    {id:"clinico",  n:"Médico / Enfermero",        d:"Infundís o supervisás tratamientos"},
    {id:"asistencia", n:"Administración / Recepción", d:"Acompañás al paciente desde la gestión"},
    {id:"comercial", n:"Comercial / Institucional",  d:"Trabajás con financiadores e instituciones"}
  ];
  var MK='<svg viewBox="0 0 128 74" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block"><defs><linearGradient id="fbhg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#4733A6"/><stop offset="0.45" stop-color="#8E2E9E"/><stop offset="1" stop-color="#EC2E8E"/></linearGradient></defs><path fill="url(#fbhg)" d="M6 66 L40 18 L40 9 L48 9 L48 15 L50 12 Q53 8 56 13 L62 24 Q84 52 124 44 Q98 41 68 31 Q60 28 55 34 L34 66 Z"/></svg>';

  if(typeof firebase==='undefined'){console.warn('Firebase SDK no cargó');return;}
  try{ firebase.initializeApp(firebaseConfig); }catch(e){}
  var auth=firebase.auth(), db=firebase.firestore(), curUser=null, curRole='';
  try{ auth.languageCode='es'; }catch(e){}
  try{ auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); }catch(e){}
  try{ STORE.set('ha_seen', true); }catch(e){}

  var st=document.createElement('style');
  st.textContent=".fbgate{position:fixed;inset:0;z-index:400;background:radial-gradient(1000px 500px at 50% -10%,#1b1030,#0C0713 60%);display:none;align-items:center;justify-content:center;padding:20px;overflow-y:auto}"
   +".fbgate.on{display:flex}"
   +".fbgate .box{background:#191024;border:1px solid #2C1F42;border-radius:22px;max-width:410px;width:100%;padding:30px 28px;text-align:center;animation:fbpop .3s cubic-bezier(.2,.8,.2,1);margin:auto}"
   +"@keyframes fbpop{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}"
   +".fbgate .mk{width:58px;height:36px;margin:0 auto 14px;display:block}"
   +".fbgate h3{color:#EDE6F5;font-size:20px;margin:0 0 5px;font-weight:800}"
   +".fbgate h3 b{background:linear-gradient(135deg,#8E2E9E,#EC2E8E);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}"
   +".fbgate p{color:#9E90B5;font-size:13.5px;line-height:1.5;margin:0 0 16px}"
   +".fbtabs{display:flex;background:#140D1F;border:1px solid #2C1F42;border-radius:11px;padding:4px;margin:0 0 18px}"
   +".fbtabs button{flex:1;background:transparent;border:none;color:#9E90B5;font-weight:700;font-size:13.5px;padding:9px;border-radius:8px;cursor:pointer;font-family:inherit;transition:.15s}"
   +".fbtabs button.on{background:linear-gradient(135deg,#4733A6,#8E2E9E 50%,#EC2E8E);color:#fff}"
   +".fbf{text-align:left;margin:0 0 11px}"
   +".fbf label{display:block;color:#9E90B5;font-size:12px;font-weight:600;margin:0 0 5px}"
   +".fbgate input,.fbgate select{width:100%;padding:12px 14px;border:1.5px solid #2C1F42;border-radius:10px;background:#1E1430;color:#EDE6F5;font-size:15px;font-family:inherit}"
   +".fbgate input:focus,.fbgate select:focus{outline:none;border-color:#EC2E8E}"
   +".fbgate input.bad{border-color:#F0328C}"
   +".pwrap{position:relative}.pwrap input{padding-right:52px}"
   +".pwrap .eye{position:absolute;right:6px;top:50%;transform:translateY(-50%);background:none;border:none;color:#9E90B5;font-size:11px;font-weight:700;cursor:pointer;padding:6px 8px;width:auto;font-family:inherit}"
   +".fbgate button.pri{width:100%;border:none;cursor:pointer;color:#fff;font-weight:700;font-size:15px;padding:13px;border-radius:11px;background:linear-gradient(135deg,#4733A6,#8E2E9E 50%,#EC2E8E);font-family:inherit;margin-top:6px}"
   +".fbgate button.pri:disabled{opacity:.55;cursor:default}"
   +".rolegrid{display:grid;gap:7px;margin:0 0 11px}"
   +".rolegrid .r{display:flex;align-items:center;gap:10px;text-align:left;border:1.5px solid #2C1F42;background:#1E1430;border-radius:10px;padding:10px 12px;cursor:pointer;transition:.15s}"
   +".rolegrid .r:hover{border-color:#8E2E9E}"
   +".rolegrid .r.on{border-color:#EC2E8E;background:#241736}"
   +".rolegrid .r i{width:15px;height:15px;border-radius:50%;border:2px solid #4a3a66;flex:0 0 auto;transition:.15s}"
   +".rolegrid .r.on i{border-color:#EC2E8E;background:#EC2E8E;box-shadow:inset 0 0 0 3px #241736}"
   +".rolegrid .r b{display:block;color:#EDE6F5;font-size:13.5px;font-weight:700}"
   +".rolegrid .r span{color:#8b7da3;font-size:11.5px}"
   +".fbgate .msg{min-height:16px;color:#F0328C;font-size:12.5px;margin:9px 2px 0;line-height:1.45;text-align:left}"
   +".fbgate .msg.ok{color:#39d98a}"
   +".fbgate .lnk{background:none;border:none;color:#9E90B5;font-size:12.5px;cursor:pointer;text-decoration:underline;font-family:inherit;padding:8px;width:auto;margin-top:4px}"
   +".fbgate .lnk:hover{color:#EC2E8E}"
   +".fbgate .foot{color:#6f6288;font-size:11.5px;margin-top:16px;line-height:1.5}"
   +".admt{width:100%;border-collapse:collapse;margin-top:12px}"
   +".admt th,.admt td{text-align:left;padding:11px 14px;border-bottom:1px solid #2C1F42;font-size:14px;color:#EDE6F5}"
   +".admt th{color:#9E90B5;font-weight:600;font-size:11.5px;text-transform:uppercase;letter-spacing:.5px}"
   +".admt tr:hover td{background:#1E1430}";
  document.head.appendChild(st);

  var gate=document.createElement('div'); gate.className='fbgate'; gate.id='fbgate';
  document.body.appendChild(gate);
  function esc(s){return (''+s).replace(/[<>&"]/g,function(c){return c==='<'?'&lt;':c==='>'?'&gt;':c==='&'?'&amp;':'&quot;';});}
  function showGate(){gate.classList.add('on');}
  function hideGate(){gate.classList.remove('on');}
  function suppressOnb(){var o=document.getElementById('onb');if(o)o.classList.remove('show');}
  function renderLoading(){ gate.innerHTML='<div class="box"><span class="mk">'+MK+'</span><h3>Humana <b>Academy</b></h3><p>Cargando tu sesión…</p></div>'; showGate(); }
  function dominioOK(em){ var d=(em.split('@')[1]||'').toLowerCase(); return DOMINIOS.indexOf(d)>=0; }
  function emailOK(em){ return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em); }

  function traducir(e){
    var c=(e&&e.code)||'';
    if(c==='auth/email-already-in-use') return 'Ese correo ya tiene una cuenta. Entrá con tu contraseña.';
    if(c==='auth/invalid-email') return 'El correo no es válido.';
    if(c==='auth/weak-password') return 'La contraseña necesita al menos 6 caracteres.';
    if(c==='auth/user-not-found'||c==='auth/wrong-password'||c==='auth/invalid-credential'||c==='auth/invalid-login-credentials') return 'Correo o contraseña incorrectos.';
    if(c==='auth/too-many-requests') return 'Demasiados intentos. Esperá unos minutos y probá de nuevo.';
    if(c==='auth/network-request-failed') return 'Sin conexión. Revisá tu internet.';
    if(c==='auth/operation-not-allowed') return 'El acceso con contraseña todavía no está habilitado en Firebase.';
    return (e&&e.message)||'No se pudo completar. Probá de nuevo.';
  }
  function setMsg(t,ok){ var m=document.getElementById('fbMsg'); if(!m)return; m.className='msg'+(ok?' ok':''); m.innerHTML=t; }

  var modo='login'; // login | signup
  window.__fbTab=function(m){ modo=m; renderAuth(); };

  function renderAuth(){
    var esLogin = modo==='login';
    var h='<div class="box"><span class="mk">'+MK+'</span>'
      +'<h3>Humana <b>Academy</b></h3>'
      +'<p>'+(esLogin?'Entrá con tu correo y contraseña.':'Creá tu cuenta. Te lleva menos de un minuto.')+'</p>'
      +'<div class="fbtabs"><button id="tbIn" class="'+(esLogin?'on':'')+'" onclick="__fbTab(\'login\')">Entrar</button>'
      +'<button id="tbUp" class="'+(esLogin?'':'on')+'" onclick="__fbTab(\'signup\')">Crear cuenta</button></div>';

    if(!esLogin){
      h+='<div class="fbf"><label for="fbName">Nombre y apellido</label><input id="fbName" type="text" autocomplete="name" placeholder="Ana García"></div>';
    }
    h+='<div class="fbf"><label for="fbEmail">Correo</label><input id="fbEmail" type="email" autocomplete="'+(esLogin?'username':'email')+'" placeholder="tu-correo@humanahc.com"></div>'
      +'<div class="fbf"><label for="fbPass">Contraseña</label><div class="pwrap"><input id="fbPass" type="password" autocomplete="'+(esLogin?'current-password':'new-password')+'" placeholder="'+(esLogin?'Tu contraseña':'Mínimo 6 caracteres')+'"><button type="button" class="eye" onclick="__fbEye()">VER</button></div></div>';

    if(!esLogin){
      h+='<div class="fbf"><label>¿Qué hacés en Humana?</label><div class="rolegrid" id="fbRoles">';
      ROLES.forEach(function(r,i){ h+='<div class="r'+(i===0?' on':'')+'" data-r="'+r.id+'" onclick="__fbRole(this)"><i></i><div><b>'+r.n+'</b><span>'+r.d+'</span></div></div>'; });
      h+='</div></div>';
    }
    h+='<button class="pri" id="fbBtn">'+(esLogin?'Entrar':'Crear mi cuenta')+'</button>'
      +'<div class="msg" id="fbMsg"></div>';
    if(esLogin) h+='<button class="lnk" onclick="__fbReset()">Olvidé mi contraseña</button>';
    h+='<div class="foot">Acceso para el equipo de Humana Health &amp; Care · Argentina</div></div>';
    gate.innerHTML=h; showGate();

    var f=document.getElementById(esLogin?'fbEmail':'fbName'); if(f)setTimeout(function(){f.focus();},80);
    ['fbName','fbEmail','fbPass'].forEach(function(id){ var el=document.getElementById(id);
      if(el)el.addEventListener('keydown',function(ev){ if(ev.key==='Enter'){ev.preventDefault();document.getElementById('fbBtn').click();} }); });
    document.getElementById('fbBtn').onclick = esLogin ? doLogin : doSignup;
  }

  window.__fbEye=function(){ var p=document.getElementById('fbPass'); if(!p)return;
    var v=p.type==='password'; p.type=v?'text':'password'; p.parentNode.querySelector('.eye').textContent=v?'OCULTAR':'VER'; p.focus(); };
  window.__fbRole=function(el){ [].forEach.call(el.parentNode.children,function(x){x.classList.remove('on');}); el.classList.add('on'); };
  function rolElegido(){ var e=document.querySelector('#fbRoles .r.on'); return e?e.getAttribute('data-r'):'asistencia'; }

  function doLogin(){
    var em=(document.getElementById('fbEmail').value||'').trim().toLowerCase();
    var pw=document.getElementById('fbPass').value||'';
    var btn=document.getElementById('fbBtn');
    if(!emailOK(em)){ setMsg('Ingresá un correo válido.'); document.getElementById('fbEmail').classList.add('bad'); return; }
    if(!pw){ setMsg('Ingresá tu contraseña.'); document.getElementById('fbPass').classList.add('bad'); return; }
    btn.disabled=true; setMsg('Entrando…',true);
    auth.signInWithEmailAndPassword(em,pw).catch(function(e){ btn.disabled=false; setMsg(traducir(e)); });
  }

  function doSignup(){
    var nm=(document.getElementById('fbName').value||'').trim();
    var em=(document.getElementById('fbEmail').value||'').trim().toLowerCase();
    var pw=document.getElementById('fbPass').value||'';
    var rol=rolElegido();
    var btn=document.getElementById('fbBtn');
    if(nm.length<3||nm.indexOf(' ')<0){ setMsg('Escribí tu nombre y apellido.'); document.getElementById('fbName').classList.add('bad'); return; }
    if(!emailOK(em)){ setMsg('Ingresá un correo válido.'); document.getElementById('fbEmail').classList.add('bad'); return; }
    if(!dominioOK(em)){ setMsg('Usá tu correo de trabajo (<b>@humanahc.com</b> o <b>@infinitypharma.com.ar</b>). La plataforma es para el equipo.'); document.getElementById('fbEmail').classList.add('bad'); return; }
    if(pw.length<6){ setMsg('La contraseña necesita al menos 6 caracteres.'); document.getElementById('fbPass').classList.add('bad'); return; }
    btn.disabled=true; setMsg('Creando tu cuenta…',true);
    auth.createUserWithEmailAndPassword(em,pw).then(function(cred){
      try{ uname=nm; STORE.set('ha_name',nm); }catch(e){}
      curRole=rol; try{ STORE.set('ha_role',rol); }catch(e){}
      return db.collection('users').doc(cred.user.uid).set({
        name:nm, email:em, role:rol,
        createdAt:firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt:firebase.firestore.FieldValue.serverTimestamp()
      },{merge:true});
    }).catch(function(e){ btn.disabled=false; setMsg(traducir(e)); });
  }

  window.__fbReset=function(){
    var em=(document.getElementById('fbEmail').value||'').trim().toLowerCase();
    if(!emailOK(em)){ setMsg('Escribí tu correo arriba y volvé a tocar «Olvidé mi contraseña».'); document.getElementById('fbEmail').focus(); return; }
    setMsg('Enviando…',true);
    auth.sendPasswordResetEmail(em).then(function(){
      setMsg('Te enviamos un correo a <b>'+esc(em)+'</b> para crear una contraseña nueva.<br><b>Fijate en spam</b>: llega desde noreply@humana-academy.firebaseapp.com.',true);
    }).catch(function(e){ setMsg(traducir(e)); });
  };

  function loadProgress(user){
    return db.collection('users').doc(user.uid).get().then(function(doc){
      var d=doc.exists?doc.data():null, cloud=(d&&d.scores)||{}, local={};
      try{ local=STORE.get('ha_s',{})||{}; }catch(e){}
      var merged={};
      [1,2,3,4,5,6].forEach(function(n){ var v=Math.max(local[n]==null?-1:local[n], cloud[n]==null?-1:cloud[n]); if(v>=0)merged[n]=v; });
      try{ scores=merged; STORE.set('ha_s',merged); }catch(e){}
      if(d&&d.name){ try{ uname=d.name; STORE.set('ha_name',d.name); }catch(e){} }
      curRole=(d&&d.role)||''; try{ if(curRole)STORE.set('ha_role',curRole); }catch(e){}
      window.HA_role=curRole; window.HA_isAdmin=isAdmin(user);
      try{ uemail=user.email||''; STORE.set('ha_email',uemail); }catch(e){}
      return db.collection('users').doc(user.uid).set({email:user.email, scores:merged, name:(uname||(d&&d.name)||''), updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).catch(function(){});
    }).catch(function(){});
  }

  function renderNamePrompt(user){
    gate.innerHTML='<div class="box"><span class="mk">'+MK+'</span><h3>¡Bienvenido!</h3>'
      +'<p>Decinos tu nombre y qué hacés, para armar tu entorno.</p>'
      +'<div class="fbf"><label for="fbName">Nombre y apellido</label><input id="fbName" type="text" placeholder="Ana García" autocomplete="name"></div>'
      +'<div class="fbf"><label>¿Qué hacés en Humana?</label><div class="rolegrid" id="fbRoles">'
      +ROLES.map(function(r,i){return '<div class="r'+(i===0?' on':'')+'" data-r="'+r.id+'" onclick="__fbRole(this)"><i></i><div><b>'+r.n+'</b><span>'+r.d+'</span></div></div>';}).join('')
      +'</div></div><button class="pri" id="fbNameBtn">Continuar</button><div class="msg" id="fbMsg"></div></div>';
    showGate(); setTimeout(function(){var f=document.getElementById('fbName');if(f)f.focus();},80);
    document.getElementById('fbName').addEventListener('keydown',function(ev){ if(ev.key==='Enter'){ev.preventDefault();document.getElementById('fbNameBtn').click();} });
    document.getElementById('fbNameBtn').onclick=function(){
      var nm=(document.getElementById('fbName').value||'').trim(); var rol=rolElegido();
      if(nm.length<3||nm.indexOf(' ')<0){ setMsg('Escribí tu nombre y apellido.'); return; }
      this.disabled=true;
      try{ uname=nm; STORE.set('ha_name',nm); }catch(e){}
      curRole=rol; window.HA_role=rol; try{ STORE.set('ha_role',rol); }catch(e){}
      db.collection('users').doc(user.uid).set({name:nm, role:rol, email:user.email, updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).finally(function(){ enter(user); });
    };
  }

  function enter(user){
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
      loadProgress(user).then(function(){
        if(!uname || !curRole){ renderNamePrompt(user); }
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

  function addAdminUI(user){
    var nav=document.querySelector('nav.desk');
    if(nav && !document.getElementById('logoutLink')){
      var lo=document.createElement('a'); lo.id='logoutLink'; lo.textContent='Salir'; lo.style.cursor='pointer';
      lo.onclick=function(){ if(confirm('¿Querés cerrar sesión?')){ auth.signOut().then(function(){ location.reload(); }); } }; nav.appendChild(lo);
    }
    if(isAdmin(user) && nav && !document.getElementById('adminLink')){
      var a=document.createElement('a'); a.id='adminLink'; a.textContent='Admin'; a.style.cursor='pointer'; a.onclick=showAdmin;
      nav.insertBefore(a, document.getElementById('logoutLink'));
    }
  }

  var ROLN={clinico:'Médico / Enfermero', asistencia:'Administración', comercial:'Comercial'};
  window.showAdmin=function(){
    if(!isAdmin(curUser)) return;
    var app=document.getElementById('app'); if(!app)return;
    app.innerHTML='<section class="blk"><div class="wrap"><a class="back" onclick="home()" style="cursor:pointer">← Volver</a><div class="eyebrow grad" style="margin-top:10px">Panel de administración</div><h2 class="sec">Progreso del equipo</h2><p class="sub" id="admStatus">Cargando…</p><div id="admtbl"></div></div></section>';
    window.scrollTo(0,0);
    db.collection('users').get().then(function(qs){
      var rows=[];
      qs.forEach(function(doc){ var d=doc.data()||{}, sc=d.scores||{};
        var compl=[1,2,3,4,5,6].filter(function(n){return sc[n]!=null&&sc[n]>=60;}).length;
        var ns=(d.nexo&&d.nexo.scores)||{}; var nx=[1,2,3,4,5].filter(function(n){return ns[n]!=null&&ns[n]>=60;}).length;
        var cs=(d.cutaquig&&d.cutaquig.scores)||{}; var cq=[1,2,3,4,5,6,7,8,9].filter(function(n){return cs[n]!=null&&cs[n]>=60;}).length;
        rows.push({name:d.name||'—', email:d.email||'—', rol:ROLN[d.role]||'—', compl:compl, cert:compl>=6, nexo:nx, cq:cq});
      });
      rows.sort(function(a,b){ return (b.compl+b.nexo+b.cq)-(a.compl+a.nexo+a.cq); });
      var h='<table class="admt"><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Academy</th><th>Nexo</th><th>Cutaquig</th><th>Cert.</th></tr></thead><tbody>';
      rows.forEach(function(r){ h+='<tr><td>'+esc(r.name)+'</td><td>'+esc(r.email)+'</td><td>'+esc(r.rol)+'</td><td>'+r.compl+'/6</td><td>'+r.nexo+'/5'+(r.nexo>=5?' ✓':'')+'</td><td>'+r.cq+'/9'+(r.cq>=9?' ✓':'')+'</td><td>'+(r.cert?'✓':'—')+'</td></tr>'; });
      h+='</tbody></table>';
      document.getElementById('admtbl').innerHTML=h;
      document.getElementById('admStatus').textContent=rows.length+' usuario(s) registrado(s).';
    }).catch(function(e){ document.getElementById('admStatus').innerHTML='No se pudo cargar. ('+esc(e.message)+')'; });
  };
})();
