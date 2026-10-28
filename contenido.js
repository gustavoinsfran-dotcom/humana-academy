/* Humana Academy — capa de contenido.
   Lee los módulos desde la base (colección «modulos»), los guarda en el equipo para que la próxima
   carga sea instantánea y arma los recursos (video, audio, documentos, enlaces).
   La usan la Academy (index.html) y el Estudio de contenidos (estudio.html). */
(function(){
  var KEY='ha_contenido_v1';

  function leerCache(){ try{ var v=localStorage.getItem(KEY); return v?JSON.parse(v):null; }catch(e){ return null; } }
  function guardarCache(c){ try{ localStorage.setItem(KEY, JSON.stringify(c)); }catch(e){} }
  function limpio(d){ // quita marcas de tiempo y campos internos antes de guardar en el equipo
    var o={}; ['id','n','orden','tipo','estado','t','etiqueta','lead','body','quiz','recursos'].forEach(function(k){ if(d[k]!==undefined)o[k]=d[k]; });
    return o;
  }

  /* De la lista completa de documentos, arma lo que ve la gente: solo lo publicado, en orden. */
  window.HA_armar=function(docs){
    var mods=docs.filter(function(d){ return d.tipo!=='caso' && d.estado==='publicado'; })
      .sort(function(a,b){ return (a.orden||0)-(b.orden||0) || (a.n||0)-(b.n||0); })
      .map(limpio);
    var caso=docs.filter(function(d){ return d.tipo==='caso' && d.estado==='publicado'; })[0]||null;
    return {modulos:mods, caso:caso?limpio(caso):null};
  };

  /* Lo que se muestra apenas abre la página: lo último que se leyó de la base, o el contenido base. */
  window.HA_contenidoInicial=function(){
    var c=leerCache();
    if(c && c.modulos && c.modulos.length) return c;
    return window.HA_BASE ? {modulos:HA_BASE.modulos.slice(), caso:HA_BASE.caso} : {modulos:[], caso:null};
  };

  /* Lee la base. Devuelve null si todavía no hay módulos cargados o si no hay conexión. */
  window.HA_cargarContenido=function(db){
    return db.collection('modulos').where('estado','==','publicado').get().then(function(qs){
      if(qs.empty) return null;
      var docs=[]; qs.forEach(function(d){ var x=d.data(); x.id=d.id; docs.push(x); });
      var c=HA_armar(docs);
      if(!c.modulos.length) return null;
      guardarCache(c);
      return c;
    }).catch(function(){ return null; });
  };

  /* ---------- Recursos ---------- */
  function esc(s){ return (''+(s==null?'':s)).replace(/[<>&"']/g,function(c){ return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function urlSegura(u){
    u=(u||'').trim();
    if(/^https?:\/\//i.test(u)) return u;
    if(/^[a-z0-9][a-z0-9_.\-\/]*$/i.test(u) && u.indexOf('..')<0) return u; // archivo del propio sitio
    return '';
  }
  window.HA_urlSegura=urlSegura;

  /* Reconoce de dónde viene el enlace y arma el reproductor que corresponde. */
  window.HA_incrustar=function(tipo,url){
    var u=urlSegura(url); if(!u) return null;
    var m;
    if((m=u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i)))
      return {html:'<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/'+m[1]+'?rel=0" title="Video" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>', ancho:true};
    if((m=u.match(/vimeo\.com\/(?:video\/)?(\d+)/i)))
      return {html:'<div class="vid"><iframe src="https://player.vimeo.com/video/'+m[1]+'" title="Video" loading="lazy" allow="fullscreen; picture-in-picture" allowfullscreen></iframe></div>', ancho:true};
    if((m=u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]{20,})/i))){
      var src='https://drive.google.com/file/d/'+m[1]+'/preview';
      if(tipo==='audio') return {html:'<iframe class="aud" src="'+src+'" title="Audio" loading="lazy" allow="autoplay"></iframe>', ancho:false};
      if(tipo==='video') return {html:'<div class="vid"><iframe src="'+src+'" title="Video" loading="lazy" allow="autoplay; fullscreen" allowfullscreen></iframe></div>', ancho:true};
      return null;
    }
    if(/soundcloud\.com\//i.test(u))
      return {html:'<iframe class="aud sc" src="https://w.soundcloud.com/player/?url='+encodeURIComponent(u)+'&color=%23ec2e8e&visual=false" title="Audio" loading="lazy"></iframe>', ancho:false};
    if(/spotify\.com\/(episode|track|show)\//i.test(u))
      return {html:'<iframe class="aud sp" src="'+esc(u.replace('open.spotify.com/','open.spotify.com/embed/'))+'" title="Audio" loading="lazy" allow="encrypted-media"></iframe>', ancho:false};
    if(/\.(mp4|webm|mov|m4v)(\?|$)/i.test(u))
      return {html:'<video class="player" controls preload="metadata" playsinline src="'+esc(u)+'"></video>', ancho:true};
    if(/\.(mp3|m4a|wav|ogg|aac)(\?|$)/i.test(u))
      return {html:'<audio class="player" controls preload="metadata" src="'+esc(u)+'"></audio>', ancho:false};
    return null;
  };

  var ICO={video:'🎬',audio:'🎧',documento:'📄',enlace:'🔗'};
  var NOMBRE={video:'Video',audio:'Audio',documento:'Documento',enlace:'Enlace'};
  window.HA_TIPOS=NOMBRE;

  window.HA_recursoHTML=function(r){
    var u=urlSegura(r.url); if(!u) return '';
    var tipo=ICO[r.tipo]?r.tipo:'enlace';
    var tit=esc(r.titulo||NOMBRE[tipo]);
    var inc=(tipo==='video'||tipo==='audio')?HA_incrustar(tipo,u):null;
    var ext=/^https?:/i.test(u);
    if(inc) return '<div class="rc'+(inc.ancho?' big':'')+'"><div class="rh"><span class="ico">'+ICO[tipo]+'</span><h4>'+tit+'</h4></div>'+inc.html+'</div>';
    var esPdf=/\.pdf(\?|$)/i.test(u);
    var btn=esPdf&&!ext?'Descargar PDF':(tipo==='video'?'Ver video':tipo==='audio'?'Escuchar':tipo==='documento'?'Abrir documento':'Abrir enlace');
    return '<div class="rc"><div class="rh"><span class="ico">'+ICO[tipo]+'</span><h4>'+tit+'</h4></div>'
      +'<a class="dl" href="'+esc(u)+'"'+(ext?' target="_blank" rel="noopener"':(esPdf?' download':''))+'>'+btn+(ext?' ↗':'')+'</a></div>';
  };

  window.HA_recursosPanel=function(lista){
    var h=(lista||[]).map(HA_recursoHTML).filter(Boolean).join('');
    if(!h) return '';
    return '<div class="panel"><h3 class="t">Recursos del módulo</h3><div class="res">'+h+'</div></div>';
  };

  /* ---------- Limpieza del texto que se escribe en el editor ---------- */
  var PERMITIDAS={H2:1,H3:1,P:1,STRONG:1,EM:1,U:1,UL:1,OL:1,LI:1,BR:1,A:1,DIV:1};
  window.HA_sanear=function(html){
    var doc=new DOMParser().parseFromString('<div id="r">'+(html||'')+'</div>','text/html');
    var raiz=doc.getElementById('r');
    function cambiar(el,tag){ var n=doc.createElement(tag); while(el.firstChild)n.appendChild(el.firstChild); el.parentNode.replaceChild(n,el); return n; }
    function pasar(nodo){
      Array.prototype.slice.call(nodo.childNodes).forEach(function(ch){
        if(ch.nodeType===8){ ch.remove(); return; }
        if(ch.nodeType!==1) return;
        var t=ch.tagName;
        if(t==='SCRIPT'||t==='STYLE'||t==='IFRAME'||t==='OBJECT'||t==='META'||t==='LINK'){ ch.remove(); return; }
        if(t==='B') ch=cambiar(ch,'strong'); else if(t==='I') ch=cambiar(ch,'em');
        else if(t==='H1') ch=cambiar(ch,'h2'); else if(t==='H4'||t==='H5'||t==='H6') ch=cambiar(ch,'h3');
        else if(t==='BLOCKQUOTE'){ ch=cambiar(ch,'div'); ch.className='quote'; }
        t=ch.tagName;
        if(!PERMITIDAS[t]){ pasar(ch); while(ch.firstChild)ch.parentNode.insertBefore(ch.firstChild,ch); ch.remove(); return; }
        var esQuote=t==='DIV'&&/(^|\s)quote(\s|$)/.test(ch.className||'');
        var href=t==='A'?(ch.getAttribute('href')||''):'';
        Array.prototype.slice.call(ch.attributes).forEach(function(a){ ch.removeAttribute(a.name); });
        if(t==='DIV'){ if(esQuote) ch.className='quote'; else { ch=cambiar(ch,'p'); } }
        if(t==='A'){ if(/^(https?:|mailto:)/i.test(href)){ ch.setAttribute('href',href); ch.setAttribute('target','_blank'); ch.setAttribute('rel','noopener'); } else { pasar(ch); while(ch.firstChild)ch.parentNode.insertBefore(ch.firstChild,ch); ch.remove(); return; } }
        pasar(ch);
      });
    }
    pasar(raiz);
    // párrafos vacíos fuera
    Array.prototype.slice.call(raiz.querySelectorAll('p,h2,h3')).forEach(function(p){ if(!p.textContent.trim() && !p.querySelector('br')) p.remove(); });
    return raiz.innerHTML.replace(/<p><br><\/p>/g,'').trim();
  };

  var NUM=['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve','veinte'];
  window.HA_enLetras=function(n){ return NUM[n]||(''+n); };
})();
