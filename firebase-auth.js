/* Humana Academy — Login (enlace mágico) + progreso en la nube + panel admin */
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
  var MK='<svg viewBox="0 0 128 74" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block"><defs><linearGradient id="fbhg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#4733A6"/><stop offset="0.45" stop-color="#8E2E9E"/><stop offset="1" stop-color="#EC2E8E"/></linearGradient></defs><path fill="url(#fbhg)" d="M6 66 L40 18 L40 9 L48 9 L48 15 L50 12 Q53 8 56 13 L62 24 Q84 52 124 44 Q98 41 68 31 Q60 28 55 34 L34 66 Z"/></svg>';

  if(typeof firebase==='undefined'){console.warn('Firebase SDK no cargó');return;}
  try{ firebase.initializeApp(firebaseConfig); }catch(e){}
  var auth=firebase.auth(), db=firebase.firestore(), curUser=null;
  try{ auth.languageCode='es'; }catch(e){}
  try{ auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); }catch(e){}
  try{ STORE.set('ha_seen', true); }catch(e){} // desactiva el modal de identificación viejo

  /* estilos del gate */
  var st=document.createElement('style');
  st.textContent=".fbgate{position:fixed;inset:0;z-index:400;background:radial-gradient(1000px 500px at 50% -10%,#1b1030,#0C0713 60%);display:none;align-items:center;justify-content:center;padding:24px}"
   +".fbgate.on{display:flex}"
   +".fbgate .box{background:#191024;border:1px solid #2C1F42;border-radius:22px;max-width:430px;width:100%;padding:34px 30px;text-align:center;animation:fbpop .3s cubic-bezier(.2,.8,.2,1)}"
   +"@keyframes fbpop{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}"
   +".fbgate .mk{width:64px;height:40px;margin:0 auto 18px;display:block}"
   +".fbgate h3{color:#EDE6F5;font-size:21px;margin:0 0 6px;font-weight:800}"
   +".fbgate h3 b{background:linear-gradient(135deg,#8E2E9E,#EC2E8E);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}"
   +".fbgate p{color:#9E90B5;font-size:14px;line-height:1.55;margin:0 0 18px}"
   +".fbgate input{width:100%;padding:13px 15px;border:1.5px solid #2C1F42;border-radius:11px;background:#1E1430;color:#EDE6F5;font-size:15px;font-family:inherit;margin:0 0 12px}"
   +".fbgate input:focus{outline:none;border-color:#EC2E8E}"
   +".fbgate button{width:100%;border:none;cursor:pointer;color:#fff;font-weight:700;font-size:15px;padding:13px;border-radius:11px;background:linear-gradient(135deg,#4733A6,#8E2E9E 50%,#EC2E8E);font-family:inherit}"
   +".fbgate button:disabled{opacity:.6;cursor:default}"
   +".fbgate .msg{min-height:18px;color:#F0328C;font-size:13px;margin:10px 2px 0;line-height:1.5}"
   +".fbgate .msg.ok{color:#39d98a}"
   +".fbgate .foot{color:#6f6288;font-size:12px;margin-top:20px}"
   +".admt{width:100%;border-collapse:collapse;margin-top:12px}"
   +".admt th,.admt td{text-align:left;padding:11px 14px;border-bottom:1px solid #2C1F42;font-size:14px;color:#EDE6F5}"
   +".admt th{color:#9E90B5;font-weight:600;font-size:11.5px;text-transform:uppercase;letter-spacing:.5px}"
   +".admt tr:hover td{background:#1E1430}";
  document.head.appendChild(st);

  var gate=document.createElement('div'); gate.className='fbgate'; gate.id='fbgate';
  document.body.appendChild(gate);
  function esc(s){return (''+s).replace(/[<>&"]/g,function(c){return c==='<'?'&lt;':c==='>'?'&gt;':c==='&'?'&amp;':'&quot;';});}
  function showGate(){gate.classList.add('on');}
  function renderLoading(){ gate.innerHTML='<div class="box"><span class="mk">'+MK+'</span><h3>Humana <b>Academy</b></h3><p>Cargando tu sesión…</p></div>'; showGate(); }
  function hideGate(){gate.classList.remove('on');}
  function suppressOnb(){var o=document.getElementById('onb');if(o)o.classList.remove('show');}

  function renderLogin(){
    gate.innerHTML='<div class="box"><span class="mk">'+MK+'</span><h3>Humana <b>Academy</b></h3>'
      +'<p>Ingresá tu correo y te enviamos un <b>enlace de acceso</b>. Sin contraseñas.</p>'
      +'<input id="fbEmail" type="email" placeholder="tu-correo@ejemplo.com" autocomplete="email">'
      +'<button id="fbBtn">Enviar enlace de acceso</button>'
      +'<div class="msg" id="fbMsg"></div>'
      +'<div class="foot">Humana Health &amp; Care · Argentina</div></div>';
    var btn=document.getElementById('fbBtn');
    btn.onclick=function(){
      var em=(document.getElementById('fbEmail').value||'').trim().toLowerCase();
      var msg=document.getElementById('fbMsg');
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){msg.className='msg';msg.textContent='Ingresá un correo válido.';return;}
      btn.disabled=true; msg.className='msg'; msg.textContent='Enviando…';
      var acs={url:location.origin+location.pathname, handleCodeInApp:true};
      auth.sendSignInLinkToEmail(em,acs).then(function(){
        window.localStorage.setItem('ha_email_link',em);
        msg.className='msg ok';
        msg.innerHTML='¡Listo! Te enviamos un enlace a <b>'+esc(em)+'</b>.<br>Abrilo desde este mismo dispositivo para entrar.';
      }).catch(function(e){ btn.disabled=false; msg.className='msg'; msg.textContent='No se pudo enviar: '+e.message; });
    };
    showGate();
  }

  function renderNamePrompt(user){
    gate.innerHTML='<div class="box"><span class="mk">'+MK+'</span><h3>¡Bienvenido!</h3>'
      +'<p>Para personalizar tu certificado, decinos tu nombre y apellido.</p>'
      +'<input id="fbName" type="text" placeholder="Nombre y apellido" autocomplete="name">'
      +'<button id="fbNameBtn">Continuar</button>'
      +'<div class="msg" id="fbMsg"></div></div>';
    var btn=document.getElementById('fbNameBtn');
    btn.onclick=function(){
      var nm=(document.getElementById('fbName').value||'').trim();
      var msg=document.getElementById('fbMsg');
      if(nm.length<3){msg.className='msg';msg.textContent='Ingresá tu nombre y apellido.';return;}
      btn.disabled=true;
      try{ uname=nm; STORE.set('ha_name',nm); }catch(e){}
      db.collection('users').doc(user.uid).set({name:nm, email:user.email, updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).finally(function(){
        hideGate(); enter(user);
      });
    };
    showGate();
  }

  function loadProgress(user){
    return db.collection('users').doc(user.uid).get().then(function(doc){
      var d=doc.exists?doc.data():null, cloud=(d&&d.scores)||{}, local={};
      try{ local=STORE.get('ha_s',{})||{}; }catch(e){}
      var merged={};
      [1,2,3,4,5,6].forEach(function(n){ var v=Math.max(local[n]==null?-1:local[n], cloud[n]==null?-1:cloud[n]); if(v>=0)merged[n]=v; });
      try{ scores=merged; STORE.set('ha_s',merged); }catch(e){}
      if(d&&d.name){ try{ uname=d.name; STORE.set('ha_name',d.name); }catch(e){} }
      try{ uemail=user.email||''; STORE.set('ha_email',uemail); }catch(e){}
      return db.collection('users').doc(user.uid).set({email:user.email, scores:merged, name:(uname||(d&&d.name)||''), updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).catch(function(){});
    }).catch(function(){});
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
        if(!uname){ renderNamePrompt(user); }
        else { enter(user); }
      });
    } else {
      renderLogin();
    }
  });

  /* completar acceso si venimos del enlace */
  renderLoading();
  if(auth.isSignInWithEmailLink(location.href)){
    var em=window.localStorage.getItem('ha_email_link');
    if(!em){ em=window.prompt('Confirmá tu correo para completar el acceso:'); }
    if(em){
      auth.signInWithEmailLink(em.trim().toLowerCase(), location.href).then(function(){
        window.localStorage.removeItem('ha_email_link');
        history.replaceState(null,'',location.origin+location.pathname);
      }).catch(function(e){
        renderLogin(); var m=document.getElementById('fbMsg'); if(m){ m.className='msg'; m.textContent='El enlace expiró o no es válido. Pedí uno nuevo.'; }
      });
    }
  }

  /* sync de progreso (lo llama el sitio al aprobar un módulo) */
  window.HA_sync=function(sc){
    if(!curUser)return;
    db.collection('users').doc(curUser.uid).set({email:curUser.email, name:(uname||''), scores:sc, updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).catch(function(){});
  };
  window.HA_saveName=function(v){
    if(!curUser||!v)return;
    db.collection('users').doc(curUser.uid).set({name:v, updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).catch(function(){});
  };

  function isAdmin(u){ return u && ADMINS.indexOf((u.email||'').toLowerCase())>=0; }

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

  window.showAdmin=function(){
    var app=document.getElementById('app'); if(!app)return;
    app.innerHTML='<section class="blk"><div class="wrap"><a class="back" onclick="home()" style="cursor:pointer">← Volver</a><div class="eyebrow grad" style="margin-top:10px">Panel de administración</div><h2 class="sec">Progreso del equipo</h2><p class="sub" id="admStatus">Cargando…</p><div id="admtbl"></div></div></section>';
    window.scrollTo(0,0);
    db.collection('users').get().then(function(qs){
      var rows=[];
      qs.forEach(function(doc){ var d=doc.data()||{}, sc=d.scores||{}; var compl=[1,2,3,4,5,6].filter(function(n){return sc[n]!=null&&sc[n]>=60;}).length; var ns=(d.nexo&&d.nexo.scores)||{}; var nx=[1,2,3,4,5].filter(function(n){return ns[n]!=null&&ns[n]>=60;}).length; rows.push({name:d.name||'—', email:d.email||'—', compl:compl, cert:compl>=6, nexo:nx}); });
      rows.sort(function(a,b){ return b.compl-a.compl; });
      var h='<table class="admt"><thead><tr><th>Nombre</th><th>Correo</th><th>Módulos</th><th>Nexo</th><th>Certificado</th></tr></thead><tbody>';
      rows.forEach(function(r){ h+='<tr><td>'+esc(r.name)+'</td><td>'+esc(r.email)+'</td><td>'+r.compl+'/6</td><td>'+r.nexo+'/5'+(r.nexo>=5?' ✓':'')+'</td><td>'+(r.cert?'✓':'—')+'</td></tr>'; });
      h+='</tbody></table>';
      document.getElementById('admtbl').innerHTML=h;
      document.getElementById('admStatus').textContent=rows.length+' usuario(s) registrado(s).';
    }).catch(function(e){ document.getElementById('admStatus').innerHTML='No se pudo cargar. Verificá que las reglas de seguridad estén publicadas. ('+esc(e.message)+')'; });
  };
})();
