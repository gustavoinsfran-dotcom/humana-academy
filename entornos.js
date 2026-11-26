/* Humana Academy — entornos e íconos.
   Cada entorno (Academy, Nexo, Cutaquig) se reconoce por el color de su cabecera, su ícono y su etiqueta.
   La página declara su entorno en <body data-entorno="academy|nexo|cutaquig">.
   Colores, siempre dentro de la paleta: #170F1E, #D43380, #28449B, #CACACA y blanco (ver entornos.css). */
(function(){
  var T='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';
  var P={
    /* entornos */
    academy:'<path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v4.6c0 1.6 2.5 3 5.5 3s5.5-1.4 5.5-3V11"/><path d="M21.5 9v5.5"/>',
    nexo:'<circle cx="5.5" cy="12" r="2.6"/><circle cx="18.5" cy="5.5" r="2.6"/><circle cx="18.5" cy="18.5" r="2.6"/><path d="M7.9 10.8l8.2-4.1M7.9 13.2l8.2 4.1"/>',
    cutaquig:'<path d="M9 2.8h6"/><path d="M10 2.8v3h4v-3"/><path d="M8.3 5.8h7.4V19a2.2 2.2 0 0 1-2.2 2.2h-3A2.2 2.2 0 0 1 8.3 19z"/><path d="M8.3 11.5h7.4"/><path d="M11 15h2"/>',
    /* escuelas */
    medicos:'<path d="M5.5 3.5H4.5v5a4.5 4.5 0 0 0 9 0v-5h-1"/><path d="M9 13v1.8a5.2 5.2 0 0 0 10.4 0V12.4"/><circle cx="19.4" cy="10.2" r="2.1"/>',
    enfermeria:'<path d="M12 20.2s-7.5-4.6-7.5-10.4A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8c0 5.8-7.5 10.4-7.5 10.4z"/><path d="M7.6 12.3h2.6l1.4-2.4 2 4.2 1.3-1.8h1.6"/>',
    kinesiologia:'<circle cx="13.5" cy="4.3" r="1.9"/><path d="M9.5 21l2.7-6.2 3.1 2.8V21"/><path d="M12.2 14.8l-1-4.6 3.4-1.9 2.3 3.4 2.4.6"/><path d="M11.2 10.2 7.6 12v3.2"/>',
    cuidadores:'<path d="M12 11.6S8.4 9.6 8.4 7a2 2 0 0 1 3.6-1.2A2 2 0 0 1 15.6 7c0 2.6-3.6 4.6-3.6 4.6z"/><path d="M2.8 14.6l3.6-.6 4 2.4h3.2a1.5 1.5 0 0 1 0 3H9.4"/><path d="M13.8 19.2l5.4-2.6a1.6 1.6 0 0 1 1.8 2.6L15.2 22H8.6l-5.8-2.2"/>',
    pacientes:'<circle cx="9" cy="8" r="3.1"/><path d="M3.4 20.5a5.6 5.6 0 0 1 11.2 0"/><circle cx="17.2" cy="9.6" r="2.4"/><path d="M15.8 14.5a4.6 4.6 0 0 1 5.8 4.4"/>',
    coordinacion:'<rect x="3" y="3" width="6" height="6" rx="1.6"/><rect x="15" y="15" width="6" height="6" rx="1.6"/><path d="M9 6h4.2A2.8 2.8 0 0 1 16 8.8V15"/><circle cx="6" cy="18" r="2.5"/><path d="M8.5 18H15"/>',
    /* menú */
    inicio:'<path d="M3.5 11 12 4l8.5 7"/><path d="M5.8 9.4V20h12.4V9.4"/><path d="M10 20v-5.2h4V20"/>',
    certificado:'<rect x="3.5" y="4" width="17" height="12.5" rx="1.8"/><path d="M7.5 8.3h9M7.5 11.6h5.5"/><path d="M15.5 14.5l-1 6 2.5-1.4 2.5 1.4-1-6"/><circle cx="17" cy="13.2" r="1.9"/>',
    administracion:'<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3 5.5 5.5"/>',
    salir:'<path d="M14.5 4.5H18a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-3.5"/><path d="M10 8l-4 4 4 4M6 12h9.5"/>'
  };
  window.HA_icono=function(nombre, clase){
    var p=P[nombre]; if(!p) return '';
    return clase ? '<span class="'+clase+'">'+T+p+'</svg></span>' : T+p+'</svg>';
  };
  window.HA_ENTORNOS={
    academy:{t:'Humana Academy', etiqueta:'Formación'},
    nexo:{t:'Humana Nexo', etiqueta:'Programa'},
    cutaquig:{t:'Cutaquig®', etiqueta:'Producto'}
  };
  /* Ícono y etiqueta en la marca de la cabecera. */
  function marcar(){
    var b=document.body, ent=b && b.getAttribute('data-entorno'), e=window.HA_ENTORNOS[ent];
    if(!e) return;
    var brand=document.querySelector('header.top .brand');
    if(!brand || brand.querySelector('.ent-ico')) return;
    brand.insertAdjacentHTML('afterbegin', window.HA_icono(ent,'ent-ico'));
    var w=brand.querySelector('.mh-word');
    if(w) w.insertAdjacentHTML('afterend','<span class="ent-tag">'+e.etiqueta+'</span>');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', marcar); else marcar();
})();
