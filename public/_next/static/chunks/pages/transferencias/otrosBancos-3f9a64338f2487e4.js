(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[208],{4474:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/transferencias/otrosBancos",function(){return n(9152)}])},9152:function(e,t,n){"use strict";n.r(t);var a=n(4051),r=n.n(a),s=n(5893),o=n(4416),i=n(3832),c=n(7294),u=n(649),l=n(9221),f=n(6603),d=n(4174),p=n(2132),h=(n(7590),n(7733),n(1664),n(5477));function v(e,t,n,a,r,s,o){try{var i=e[s](o),c=i.value}catch(u){return void n(u)}i.done?t(c):Promise.resolve(c).then(a,r)}function x(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function m(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},a=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),a.forEach((function(t){x(e,t,n[t])}))}return e}t.default=function(){(0,o.v9)((function(e){return e.user}));var e,t=(0,c.useState)("step1"),n=t[0],a=t[1],x=(0,c.useState)({}),g=x[0],j=x[1],y=(0,c.useState)(!0),b=y[0],w=y[1],O=(0,c.useState)(!0),_=O[0],S=O[1],k=(0,c.useState)(),P=k[0],C=k[1],N=(0,c.useState)(),E=N[0],T=N[1],I=(0,c.useState)(),D=I[0],Z=I[1],z={step1:(0,s.jsxs)("h2",{children:["Paso 1"," ",(0,s.jsx)("span",{style:{fontWeight:"10"},children:"Completa los datos para realizar la transferencia."})]}),step2:(0,s.jsxs)("h2",{children:["Paso 2"," ",(0,s.jsx)("span",{style:{fontWeight:"10"},children:"Verifica los datos de la transferencia y confirma para finalizarla"})]}),step3:(0,s.jsx)("h2",{children:"Transferencia finalizada exitosamente"})};(0,c.useEffect)((function(){console.log(g)}),[g]),(0,c.useEffect)((e=r().mark((function e(){var t,n,a;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,S(!0),e.next=4,(0,u.A_)("/api/app/cuentas");case 4:return t=e.sent,e.next=7,(0,u.A_)("/api/app/contacto");case 7:n=e.sent,t.ok&&n.ok&&(C(t.data.cuentas),Z(null===(a=n.data)||void 0===a?void 0:a.libretaContactos),S(!1)),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),console.log(e.t0);case 14:case"end":return e.stop()}}),e,null,[[0,11]])})),function(){var t=this,n=arguments;return new Promise((function(a,r){var s=e.apply(t,n);function o(e){v(s,a,r,o,i,"next",e)}function i(e){v(s,a,r,o,i,"throw",e)}o(void 0)}))}),[]);var A={step1:(0,s.jsx)(l.Z,{loading:_,accounts:P,contacts:D,formData:g,handleFormChange:function(e){var t=e.target.name,n=m({},g);if(n[t]=e.target.value,"destiny"===t){var a=D.find((function(t){return t.cuentaId===e.target.value}));j(m({},g,{destiny:e.target.value,destinyName:a.nombre,identification:a.identificador,tipoIdentificacion:a.identificadorTipo,destinyNumber:a.numero}))}else j(n)},setStep:a}),step2:(0,s.jsx)(f.Z,{loading:_,accounts:P,formData:g,us:!1,setStep:a,toast:p.Am,setTransactionId:T,setIsContact:w}),step3:(0,s.jsx)(d.Z,{loading:_,accounts:P,formData:g,setStep:a,transactionId:E,isContact:b,setIsContact:w})};return(0,s.jsx)(s.Fragment,{children:(0,s.jsxs)(i.Z,{children:[(0,s.jsxs)("div",{className:"header-title-container",style:{display:"flex",flexDirection:"column"},children:[(0,s.jsx)("h2",{className:"title-section",children:"Transferencias a Terceros Dakiti"}),z[n]]}),_?(0,s.jsx)("div",{style:{textAlign:"center",width:"100%"},children:(0,s.jsx)(h.Z,{size:50})}):A[n],(0,s.jsx)(p.Ix,{position:"top-center",autoClose:5e3,hideProgressBar:!1,newestOnTop:!1,closeOnClick:!0,rtl:!1,pauseOnFocusLoss:!0,draggable:!0,pauseOnHover:!0})]})})}}},function(e){e.O(0,[885,778,813,426,100,202,390,642,774,888,179],(function(){return t=4474,e(e.s=t);var t}));var t=e.O();_N_E=t}]);