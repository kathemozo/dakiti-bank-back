(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[102],{7270:function(t,e,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/dashboard/trafico",function(){return n(1473)}])},1473:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return D}});var r=n(4051),a=n.n(r),o=n(5893),c=n(7294),i=n(2351),u=n(3369),s=n(7590),f=n(649),d=n(381),l=n.n(d),h=n(1242),p=n(282),m=n(9306),v=n.n(m);function g(t,e,n,r,a,o,c){try{var i=t[o](c),u=i.value}catch(s){return void n(s)}i.done?e(u):Promise.resolve(u).then(r,a)}function b(t){return function(){var e=this,n=arguments;return new Promise((function(r,a){var o=t.apply(e,n);function c(t){g(o,r,a,c,i,"next",t)}function i(t){g(o,r,a,c,i,"throw",t)}c(void 0)}))}}function x(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var Y=null;function D(t){t=null!==t?t:function(t){throw t}(new TypeError("Cannot destructure undefined"));var e=function(){for(var t="0123456789ABCDEF".split(""),e="#",n=0;n<6;n++)e+=t[Math.floor(16*Math.random())];return e},n=(0,c.useState)({fechaFrom:l()().format("MM/DD/YYYY"),fechaTo:l()().format("MM/DD/YYYY"),tipo:"D\xedas"}),r=n[0],d=n[1],m=(0,c.useState)([]),g=m[0],D=m[1],w=(0,c.useState)(!1),M=w[0],y=w[1],k=(0,c.useState)([]),j=(k[0],k[1]),C=function(){var t=b(a().mark((function t(){var e;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,D([]),j([]),y(!0),t.next=6,(0,f.j0)("/api/admin/reporte-trasacciones",r);case 6:if((e=t.sent).ok){t.next=10;break}return y(!1),t.abrupt("return");case 10:D(e.data.transacciones),y(!1),t.next=18;break;case 14:t.prev=14,t.t0=t.catch(0),y(!1),console.log(t.t0);case 18:case"end":return t.stop()}}),t,null,[[0,14]])})));return function(){return t.apply(this,arguments)}}(),P=(0,c.useMemo)((function(){if("D\xedas"===r.tipo){var t=g.map((function(t){return l()(t.fecha).format("DD/MM/YYYY")})).reduce((function(t,e){return t[e]=t[e]+1||1,t}),{}),e=[];for(var n in t)e.push([n,t[n]]);return e}var a=g.map((function(t){return l()(t.fecha).format("HH")})).reduce((function(t,e){return t[e]=t[e]+1||1,t}),{}),o=[];for(var c in a)o.push([c,a[c]]);return o}),[r.tipo,g]),_=(0,c.useMemo)((function(){return"D\xedas"===r.tipo?["D\xeda","Cantidad Transacciones"]:["Hora","Cantidad Transacciones"]}),[r.tipo]),T=(0,c.useMemo)((function(){if("D\xedas"===r.tipo){var t=g.map((function(t){return l()(t.fecha).format("DD/MM/YYYY")})).reduce((function(t,e){return t[e]=t[e]+1||1,t}),{}),e=[];for(var n in t)e.push(n);return e}var a=g.map((function(t){return l()(t.fecha).format("HH")})).reduce((function(t,e){return t[e]=t[e]+1||1,t}),{}),o=[];for(var c in a)o.push(c);return o}),[r.tipo,g]),E=(0,c.useMemo)((function(){if("D\xedas"===r.tipo){var t=g.map((function(t){return l()(t.fecha).format("DD/MM/YYYY")})).reduce((function(t,e){return t[e]=t[e]+1||1,t}),{}),n=[],a=[],o=[];for(var c in t)n.push(c),a.push(t[c]),o.push(e());var i=[];return n.length>0&&(i=[{label:["Transacciones"],data:a,backgroundColor:o,borderColor:[],borderWidth:1}]),i}var u=g.map((function(t){return l()(t.fecha).format("HH")})).reduce((function(t,e){return t[e]=t[e]+1||1,t}),{}),s=[],f=[],d=[];for(var h in u)s.push(h),f.push(u[h]),d.push(e());var p=[];return s.length>0&&(p=[{label:["Transacciones"],data:f,backgroundColor:d,borderColor:[],borderWidth:1}]),p}),[r.tipo,g]);function F(){return(F=b(a().mark((function t(e){var n,o,c,i,u,s,f;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:for(t.prev=0,(n=new Y("landscape")).text(240,15,l()().format("DD/MM/YYYY - hh:mm")),n.setFontSize(40),n.text(75,15,"Dakiti Administradores",{align:"center"}),n.setFontSize(26),n.text(150,47,"Reporte de tr\xe1fico (".concat(r.tipo,")"),{align:"center"}),n.setFontSize(16),n.text(25,60,"Fecha u Hora",{align:"center",maxWidth:100}),n.text(100,60,"Cantidad",{align:"center",maxWidth:100}),o=70,20,c=0,0,i=0;i<P.length;i++)n.text(25,o+20*(i-c),"".concat(P[i][0]),{align:"center",maxWidth:100}),n.text(100,o+20*(i-c),"".concat(P[i][1]),{align:"center",maxWidth:100}),o+20*(i-c)>180&&(n.addPage(),o=5,c=i),o+20*(i-c);return n.addPage(),u=document.getElementById("nodo-graficas"),t.next=19,v().toPng(u);case 19:s=t.sent,(f=new Image).src=s,n.setFontSize(40),n.text(60,15,"Gr\xe1ficas resumen",{align:"center"}),n.addImage(f,"JPEG",10,30),n.save("Reporte de tr\xe1fico (".concat(r.tipo,")_").concat(l()().format("DD/MM/YYYY-hh:mm"),".pdf")),t.next=31;break;case 28:t.prev=28,t.t0=t.catch(0),console.log(t.t0);case 31:case"end":return t.stop()}}),t,null,[[0,28]])})))).apply(this,arguments)}return(0,o.jsxs)(i.Z,{children:[(0,o.jsx)(u.A,{filtersForm:r,handleFormChange:function(t){var e=t.target.name,n=function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},r=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable})))),r.forEach((function(e){x(t,e,n[e])}))}return t}({},r);n[e]=t.target.value,d(n)},submitConsulta:C}),(0,o.jsx)("div",{style:{textAlign:"right",marginTop:10},children:(0,o.jsx)(p.Z,{className:"medium-button blue-background",onClick:function(t){return F.apply(this,arguments)},children:"Descargar PDF"})}),(0,o.jsx)("div",{style:{height:"calc(100vh - 230px)",marginTop:10},children:(0,o.jsx)(s.Z,{headers:_,data:P,loading:M,paginate:!0})}),(0,o.jsx)("div",{style:{height:"calc(100vh - 230px)",marginTop:10},children:(0,o.jsx)(h.Z,{labels:T,datasets:E})})]})}n.e(323).then(n.t.bind(n,2617,23)).then((function(t){Y=t.default}))}},function(t){t.O(0,[885,570,778,813,426,463,617,774,888,179],(function(){return e=7270,t(t.s=e);var e}));var e=t.O();_N_E=e}]);