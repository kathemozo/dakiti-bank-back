(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[656],{7478:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/dashboard/clientes",function(){return n(2332)}])},2332:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return b}});var a=n(4051),r=n.n(a),c=n(5893),o=n(7294),i=n(2351),s=n(3369),u=n(7590),l=n(649),d=n(381),h=n.n(d),m=n(1242),f=n(282);function p(e,t,n,a,r,c,o){try{var i=e[c](o),s=i.value}catch(u){return void n(u)}i.done?t(s):Promise.resolve(s).then(a,r)}function g(e){return function(){var t=this,n=arguments;return new Promise((function(a,r){var c=e.apply(t,n);function o(e){p(c,a,r,o,i,"next",e)}function i(e){p(c,a,r,o,i,"throw",e)}o(void 0)}))}}function x(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var v=null;function b(e){e=null!==e?e:function(e){throw e}(new TypeError("Cannot destructure undefined"));var t=function(){for(var e="0123456789ABCDEF".split(""),t="#",n=0;n<6;n++)t+=e[Math.floor(16*Math.random())];return t},n=(0,o.useState)({fechaFrom:h()().format("MM/DD/YYYY"),fechaTo:h()().format("MM/DD/YYYY")}),a=n[0],d=n[1],p=(0,o.useState)([]),b=p[0],Y=p[1],w=(0,o.useState)(!1),y=w[0],D=w[1],_=(0,o.useState)([]),M=_[0],j=_[1],k=(0,o.useState)([]),P=k[0],C=k[1],F=function(){var e=g(r().mark((function e(){var n,c,o,i,s,u,d,m;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,C([]),j([]),Y([]),D(!0),e.next=8,(0,l.j0)("/api/admin/reporte-trasacciones",a);case 8:if((c=e.sent).ok){e.next=12;break}return D(!1),e.abrupt("return");case 12:for(m in o={},null===(n=c.data)||void 0===n||n.transacciones.forEach((function(e){var t=e.usuario.nombre?e.usuario.nombre+" "+e.usuario.apellido:"Pago con tarjeta";o.hasOwnProperty(t)?(o[t].transacciones+=1,o[t].primera_transaccion=h()(e.fecha).format("DD/MM/YYYY HH:mm")):(o[t]={},o[t].transacciones=1,o[t].primera_transaccion=h()(e.fecha).format("DD/MM/YYYY HH:mm"),o[t].ultima_transaccion=h()(e.fecha).format("DD/MM/YYYY HH:mm"))})),i=[],s=[],u=[],0,d=[],o)s.push(m),u.push(o[m].transacciones),o[m].transacciones,d.push(t()),i.push([m,o[m].primera_transaccion,o[m].ultima_transaccion,o[m].transacciones]);C(s),j([{label:["Transacciones"],data:u,backgroundColor:d,borderColor:[],borderWidth:1}]),Y(i),D(!1),e.next=30;break;case 26:e.prev=26,e.t0=e.catch(0),D(!1),console.log(e.t0);case 30:case"end":return e.stop()}}),e,null,[[0,26]])})));return function(){return e.apply(this,arguments)}}();function E(){return(E=g(r().mark((function e(t){var n,a,c,o,i,s,u,l;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(e.prev=0,(n=new v("landscape")).text(240,15,h()().format("DD/MM/YYYY - hh:mm")),n.setFontSize(40),n.text(75,15,"Dakiti Administradores",{align:"center"}),n.setFontSize(26),n.text(150,47,"Reporte de transacciones por clientes",{align:"center"}),n.setFontSize(14),n.text(25,60,"Nombre Cliente",{align:"center",maxWidth:85}),n.text(85,60,"Fecha primera transacci\xf3n de la consulta",{align:"center",maxWidth:85}),n.text(170,60,"Fecha ultima transacci\xf3n de la consulta",{align:"center",maxWidth:85}),n.text(255,60,"Cantidad de transacciones",{align:"center",maxWidth:85}),a=80,c=20,o=0,0,i=0;i<b.length;i++)n.text(25,a+c*(i-o),"".concat(b[i][0]),{align:"center",maxWidth:85}),n.text(85,a+c*(i-o),"".concat(b[i][1]),{align:"center",maxWidth:85}),n.text(170,a+c*(i-o),"".concat(b[i][2]),{align:"center",maxWidth:85}),n.text(255,a+c*(i-o),"".concat(b[i][3]),{align:"center",maxWidth:85}),a+c*(i-o)>180&&(n.addPage(),a=5,o=i),a+c*(i-o);return n.addPage(),s=document.getElementById("nodo-graficas"),e.next=21,domtoimage.toPng(s);case 21:u=e.sent,(l=new Image).src=u,n.setFontSize(40),n.text(60,15,"Gr\xe1ficas resumen",{align:"center"}),n.addImage(l,"JPEG",10,30),n.save("Reporte de transacciones por clientes_".concat(h()().format("DD/MM/YYYY-hh:mm"),".pdf")),e.next=33;break;case 30:e.prev=30,e.t0=e.catch(0),console.log(e.t0);case 33:case"end":return e.stop()}}),e,null,[[0,30]])})))).apply(this,arguments)}return(0,c.jsxs)(i.Z,{children:[(0,c.jsx)(s.Z,{filtersForm:a,handleFormChange:function(e){var t=e.target.name,n=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},a=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),a.forEach((function(t){x(e,t,n[t])}))}return e}({},a);n[t]=e.target.value,d(n)},submitConsulta:F}),(0,c.jsx)("div",{style:{textAlign:"right",marginTop:10},children:(0,c.jsx)(f.Z,{className:"medium-button blue-background",onClick:function(e){return E.apply(this,arguments)},children:"Descargar PDF"})}),(0,c.jsx)("div",{style:{height:"calc(100vh - 230px)",marginTop:10},children:(0,c.jsx)(u.Z,{headers:["Nombre Cliente","Fecha primera transacci\xf3n en la consulta","Fecha ultima transacci\xf3n en la consulta","Cantidad de transacciones"],data:b,loading:y,paginate:!0})}),(0,c.jsx)("div",{style:{height:"calc(100vh - 230px)",marginTop:10},children:(0,c.jsx)(m.Z,{labels:P,datasets:M})})]})}n.e(323).then(n.t.bind(n,2617,23)).then((function(e){v=e.default}))}},function(e){e.O(0,[885,570,778,813,426,254,617,774,888,179],(function(){return t=7478,e(e.s=t);var t}));var t=e.O();_N_E=t}]);