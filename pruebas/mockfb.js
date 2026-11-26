/* Firebase simulado para las pruebas (compat 10.x, solo lo que usa la Academy).
   La prueba lo inyecta en lugar de los scripts de gstatic.com.
   Estado: localStorage "__mock" = {user:{uid,email}|null, db:{"col/id":{...}, "col/id/sub/id2":{...}}}
   Reglas: versión simplificada de firestore.rules, para probar que los borradores no se filtran. */
(function(){
  var ADMINS=['gustavo.insfran@infinitypharma.com.ar','k.ojanguren@humanahc.com'];
  var CAMPOS_ADMIN=['clinicoAprobado','aprobadoPor','escuela','escuelaPor','rol'];
  function leer(){ try{ return JSON.parse(localStorage.getItem('__mock'))||{user:null,db:{}}; }catch(e){ return {user:null,db:{}}; } }
  function guardar(s){ localStorage.setItem('__mock',JSON.stringify(s)); }
  function ahora(){ var t=Date.now(); return {__ts:t}; }
  function revivir(v){
    if(v&&typeof v==='object'){
      if(v.__ts){ var t=v.__ts; return {toMillis:function(){return t;},toDate:function(){return new Date(t);},seconds:Math.floor(t/1000)}; }
      if(Array.isArray(v)) return v.map(revivir);
      var o={}; Object.keys(v).forEach(function(k){ o[k]=revivir(v[k]); }); return o;
    }
    return v;
  }
  function err(code){ var e=new Error('Missing or insufficient permissions.'); e.code=code||'permission-denied'; return e; }
  function esAdmin(u){ return !!(u&&ADMINS.indexOf((u.email||'').toLowerCase())>=0); }
  function esEquipo(u){ return !!(u&&/@(humanahc\.com|humanahc\.com\.ar|infinitypharma\.com\.ar)$/i.test(u.email||'')); }
  function S(){ return {__sentinel:'ts'}; }
  function U(arr){ return {__sentinel:'union',v:arr}; }

  /* Aplica valores especiales (timestamps, arrayUnion) */
  function resolver(nuevo, viejo){
    if(nuevo&&nuevo.__sentinel==='ts') return ahora();
    if(nuevo&&nuevo.__sentinel==='union'){ var b=Array.isArray(viejo)?viejo.slice():[]; nuevo.v.forEach(function(x){ b.push(x); }); return b; }
    if(nuevo&&typeof nuevo==='object'&&!Array.isArray(nuevo)&&!nuevo.__ts){
      var o={}; Object.keys(nuevo).forEach(function(k){ o[k]=resolver(nuevo[k], viejo&&viejo[k]); }); return o;
    }
    if(Array.isArray(nuevo)) return nuevo.map(function(x){ return resolver(x); });
    return nuevo;
  }
  function fusionar(a,b){ // merge profundo (set con merge:true)
    var o=JSON.parse(JSON.stringify(a||{}));
    Object.keys(b).forEach(function(k){
      var v=b[k];
      if(v&&typeof v==='object'&&!Array.isArray(v)&&!v.__ts&&o[k]&&typeof o[k]==='object'&&!Array.isArray(o[k])) o[k]=fusionar(o[k],v);
      else o[k]=v;
    });
    return o;
  }
  function actualizar(a,b){ // update con rutas "a.b"
    var o=JSON.parse(JSON.stringify(a||{}));
    Object.keys(b).forEach(function(k){
      var p=k.split('.'), cur=o;
      for(var i=0;i<p.length-1;i++){ if(!cur[p[i]]||typeof cur[p[i]]!=='object') cur[p[i]]={}; cur=cur[p[i]]; }
      cur[p[p.length-1]]=b[k];
    });
    return o;
  }

  /* ---- Reglas ---- */
  function puedeLeerDoc(u,path,data){
    var p=path.split('/');
    if(p[0]==='users') return !!u && (u.uid===p[1]||esAdmin(u));
    if((p[0]==='modulos'||p[0]==='academia')&&p.length===2) return esAdmin(u) || (esEquipo(u)&&data&&data.estado==='publicado');
    if(p.length===4) return esAdmin(u);
    return false;
  }
  function puedeEscribir(u,path,antes,despues){
    var p=path.split('/');
    if(p[0]==='users'){
      if(esAdmin(u)) return true;
      if(!u||u.uid!==p[1]) return false;
      if(!antes) return esEquipo(u) && !despues.clinicoAprobado && despues.escuela==null && despues.rol==null;
      return CAMPOS_ADMIN.every(function(k){ return JSON.stringify(antes[k])===JSON.stringify(despues[k]); });
    }
    if(p[0]==='modulos'||p[0]==='academia'){
      if(!esAdmin(u)) return false;
      if(p.length===4) return !antes; // versiones: solo crear
      if(['publicado','borrador','archivado'].indexOf(despues.estado)<0) return false;
      if(p[0]==='academia' && despues.estado==='publicado'){ var g=despues.gobernanza||{}; if(!g.autor||!g.revisor) return false; }
      return true;
    }
    return false;
  }

  function Snap(path,data){ this.id=path.split('/').pop(); this.ref=new Ref(path); this.exists=data!=null; this._d=data; }
  Snap.prototype.data=function(){ return this._d==null?undefined:revivir(JSON.parse(JSON.stringify(this._d))); };
  Snap.prototype.get=function(k){ var d=this.data(); return d?d[k]:undefined; };

  function Ref(path){ this.path=path; this.id=path.split('/').pop(); }
  Ref.prototype.collection=function(c){ return new Col(this.path+'/'+c); };
  Ref.prototype.get=function(){ var path=this.path; return tarde(function(){ var s=leer(), d=s.db[path]; if(!puedeLeerDoc(s.user,path,d)) throw err(); return new Snap(path,d); }); };
  Ref.prototype._escribir=function(fn){ var path=this.path; return tarde(function(){ var s=leer(), antes=s.db[path]; var despues=fn(antes); if(!puedeEscribir(s.user,path,antes,despues)) throw err(); s.db[path]=despues; guardar(s); }); };
  Ref.prototype.set=function(d,opt){ return this._escribir(function(antes){ var r=resolver(d,antes); return (opt&&opt.merge)?fusionar(antes,r):r; }); };
  Ref.prototype.update=function(d){ return this._escribir(function(antes){ if(!antes) throw Object.assign(new Error('No document to update'),{code:'not-found'}); var r={}; Object.keys(d).forEach(function(k){ r[k]=resolver(d[k], k.split('.').reduce(function(o,x){ return o&&o[x]; },antes)); }); return actualizar(antes,r); }); };
  Ref.prototype.delete=function(){ return Promise.reject(err()); };

  function Col(path,filtros,orden,lim){ this.path=path; this.id=path.split('/').pop(); this._f=filtros||[]; this._o=orden||null; this._l=lim||0; }
  Col.prototype.doc=function(id){ return new Ref(this.path+'/'+(id||('auto'+Math.random().toString(36).slice(2,12)))); };
  Col.prototype.where=function(k,op,v){ return new Col(this.path,this._f.concat([[k,op,v]]),this._o,this._l); };
  Col.prototype.orderBy=function(k,dir){ return new Col(this.path,this._f,[k,dir||'asc'],this._l); };
  Col.prototype.limit=function(n){ return new Col(this.path,this._f,this._o,n); };
  Col.prototype.add=function(d){ var r=this.doc(); return r.set(d).then(function(){ return r; }); };
  Col.prototype.get=function(){
    var self=this;
    return tarde(function(){
      var s=leer(), pre=self.path+'/', prof=self.path.split('/').length+1;
      var docs=Object.keys(s.db).filter(function(k){ return k.indexOf(pre)===0 && k.split('/').length===prof; })
        .map(function(k){ return [k,s.db[k]]; })
        .filter(function(e){ return self._f.every(function(f){ var v=e[1][f[0]]; return f[1]==='=='?v===f[2]:f[1]==='in'?f[2].indexOf(v)>=0:true; }); });
      // Como en Firestore: una consulta falla entera si podría devolver algo que no se puede leer.
      var u=s.user, p0=self.path.split('/')[0];
      var aseguraPublicado=self._f.some(function(f){ return f[0]==='estado'&&f[1]==='=='&&f[2]==='publicado'; });
      if(p0==='users' && !esAdmin(u)) throw err();
      if((p0==='modulos'||p0==='academia') && prof===2 && !esAdmin(u) && !(esEquipo(u)&&aseguraPublicado)) throw err();
      if(prof===4 && !esAdmin(u)) throw err();
      if(self._o){ var k=self._o[0], dir=self._o[1]==='desc'?-1:1; docs.sort(function(a,b){ var x=a[1][k], y=b[1][k]; x=x&&x.__ts||x; y=y&&y.__ts||y; return (x>y?1:x<y?-1:0)*dir; }); }
      if(self._l) docs=docs.slice(0,self._l);
      var snaps=docs.map(function(e){ return new Snap(e[0],e[1]); });
      return {empty:!snaps.length, size:snaps.length, docs:snaps, forEach:function(fn){ snaps.forEach(fn); }};
    });
  };

  function tarde(fn){ return new Promise(function(ok,mal){ setTimeout(function(){ try{ ok(fn()); }catch(e){ mal(e); } },5); }); }

  function Batch(){ this.ops=[]; }
  Batch.prototype.set=function(r,d,o){ this.ops.push(function(){ return r.set(d,o); }); return this; };
  Batch.prototype.update=function(r,d){ this.ops.push(function(){ return r.update(d); }); return this; };
  Batch.prototype.commit=function(){ var copia=localStorage.getItem('__mock'); return this.ops.reduce(function(p,f){ return p.then(f); },Promise.resolve()).catch(function(e){ localStorage.setItem('__mock',copia); throw e; }); };

  var oyentes=[];
  function usuarioActual(){ var u=leer().user; return u?{uid:u.uid,email:u.email,displayName:u.name||null}:null; }
  var authObj={
    languageCode:'es',
    get currentUser(){ return usuarioActual(); },
    setPersistence:function(){ return Promise.resolve(); },
    onAuthStateChanged:function(fn){ oyentes.push(fn); setTimeout(function(){ fn(usuarioActual()); },10); return function(){}; },
    signInWithEmailAndPassword:function(email,pass){ return tarde(function(){ var s=leer(), c=(s.cuentas||{})[email.toLowerCase()]; if(!c||c.pass!==pass){ var e=new Error('bad'); e.code='auth/invalid-credential'; throw e; } s.user={uid:c.uid,email:email.toLowerCase()}; guardar(s); oyentes.forEach(function(f){ f(usuarioActual()); }); return {user:usuarioActual()}; }); },
    createUserWithEmailAndPassword:function(email,pass){ return tarde(function(){ var s=leer(); s.cuentas=s.cuentas||{}; if(s.cuentas[email.toLowerCase()]){ var e=new Error('x'); e.code='auth/email-already-in-use'; throw e; } var uid='u'+Math.random().toString(36).slice(2,9); s.cuentas[email.toLowerCase()]={uid:uid,pass:pass}; s.user={uid:uid,email:email.toLowerCase()}; guardar(s); setTimeout(function(){ oyentes.forEach(function(f){ f(usuarioActual()); }); },0); return {user:usuarioActual()}; }); },
    sendPasswordResetEmail:function(){ return Promise.resolve(); },
    signOut:function(){ var s=leer(); s.user=null; guardar(s); oyentes.forEach(function(f){ f(null); }); return Promise.resolve(); }
  };
  var dbObj={ collection:function(c){ return new Col(c); }, batch:function(){ return new Batch(); }, doc:function(p){ return new Ref(p); } };

  var fb={
    apps:[],
    initializeApp:function(){ if(fb.apps.length){ var e=new Error('dup'); e.code='app/duplicate-app'; throw e; } fb.apps.push({}); return {}; },
    auth:function(){ return authObj; },
    firestore:function(){ return dbObj; }
  };
  fb.auth.Auth={Persistence:{LOCAL:'local'}};
  fb.firestore.FieldValue={serverTimestamp:S, arrayUnion:function(){ return U([].slice.call(arguments)); }};
  fb.firestore.Timestamp={now:function(){ var t=Date.now(); return {__ts:t,toMillis:function(){return t;}}; }};
  window.firebase=fb;
  window.__mockLeer=leer;
})();
