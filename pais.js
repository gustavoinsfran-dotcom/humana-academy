/* Humana Academy — capa por país (España / Argentina), para toda la Academy.
   Marcas en el contenido: [[España|Argentina]]. Se resuelven según el correo:
   @humanahc.com ve España (el texto de Karina tal cual); el resto ve Argentina.
   La persona puede ver la otra versión con el botón al pie; queda guardado en localStorage "ha_pais".
   La versión Argentina cambia solo léxico y datos locales, nunca contenido clínico. */
(function(){
  function leer(k){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):null; }catch(e){ return null; } }
  function guardar(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
  var RE=/\[\[([^|\]]*)\|([^\]]*)\]\]/g;

  var P={
    /* País por correo, salvo que la persona haya elegido otro. */
    de:function(email){
      var o=leer('ha_pais'); if(o==='es'||o==='ar') return o;
      var e=(email||leer('ha_email')||'').toLowerCase();
      return /@humanahc\.com$/.test(e)?'es':'ar';
    },
    actual:'ar',
    fijar:function(email){ P.actual=P.de(email); document.documentElement.lang=P.actual==='es'?'es-ES':'es-AR'; return P.actual; },
    /* Resuelve las marcas de un texto. */
    L:function(t,pais){ var p=pais||P.actual; return typeof t==='string'?t.replace(RE,function(m,es,ar){ return p==='es'?es:ar; }):t; },
    /* Resuelve las marcas en todo un objeto (copia). */
    todo:function(o,pais){ return JSON.parse(JSON.stringify(o),function(k,v){ return P.L(v,pais); }); },
    T:function(es,ar){ return P.actual==='es'?es:ar; },
    cambiar:function(){ guardar('ha_pais',P.actual==='es'?'ar':'es'); P.fijar(); return P.actual; },
    /* Texto del botón al pie */
    boton:function(){ return P.T('Ver versión Argentina','Ver versión España'); },
    tieneMarcas:function(t){ RE.lastIndex=0; return RE.test(t||''); },

    /* Glosario Argentina: sugerencias para el Estudio. No se aplica solo: la editora decide cada marca. */
    GLOSARIO:[
      {es:'hospitalización a domicilio', ar:'internación domiciliaria'},
      {es:'aseguradoras', ar:'prepagas, obras sociales e instituciones'},
      {es:'fisioterapia', ar:'kinesiología'},
      {es:'Fisioterapia', ar:'Kinesiología'},
      {es:'ingresos', ar:'internaciones'},
      {es:'ingreso', ar:'internación'},
      {es:'112', ar:'107 (SAME) o 911, según la jurisdicción'}
    ],
    /* Cuenta las apariciones del glosario que todavía no están dentro de una marca. */
    sugerencias:function(html){
      var limpio=(html||'').replace(RE,' ').replace(/<[^>]+>/g,' ');
      return P.GLOSARIO.map(function(g){
        var re=new RegExp('(^|[^\\wáéíóúñ])'+g.es.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![\\wáéíóúñ])','g');
        var n=(limpio.match(re)||[]).length; return n?{es:g.es,ar:g.ar,n:n}:null;
      }).filter(Boolean);
    },
    /* Envuelve en marca las apariciones de un término (fuera de etiquetas y de marcas existentes). */
    marcar:function(html,es,ar){
      var partes=(html||'').split(/(<[^>]+>|\[\[[^\]]*\]\])/);
      var re=new RegExp('(^|[^\\wáéíóúñ])('+es.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')(?![\\wáéíóúñ])','g');
      return partes.map(function(x){ return (x.charAt(0)==='<'||x.indexOf('[[')===0)?x:x.replace(re,function(m,a,b){ return a+'[['+b+'|'+ar+']]'; }); }).join('');
    }
  };
  window.HA_PAIS=P;
})();
