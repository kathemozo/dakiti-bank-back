(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[966],{3382:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/transferencias/terceros",function(){return t(3093)}])},5807:function(e,n){"use strict";var t=new String(".transaction-table-title{color:white;\npadding:0.75rem 0rem;\nfont-weight:bolder}\n.transaction-input{width:25%;\nmargin-top:10px}\n.select-input{background-color:'white';\nheight:'48px';\nborder:'solid';\nborder-color:'#AAA';\nborder-width:'1px';\nborder-radius:'3px';\nfont-size:'12px'}\n.monto-input{text-align:right}");t.__hash="bba266da1d2fd7e3",n.Z=t},3064:function(e,n){"use strict";n.Z=function(e){return new Date(e||new Date).toLocaleDateString("es-us",{weekday:"long",year:"numeric",month:"short",day:"numeric"})}},3093:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return T}});var a=t(4051),i=t.n(a),s=t(5893),o=t(4416),r=t(3832),c=t(7294),l=t(649),d=t(5988),u=t(7702),h=t(1749),f=t(4714),p=t(5161),x=t(282),m=t(5807),j=t(6455);function y(e){var n=e.loading,t=e.accounts,a=e.contacts,i=e.handleFormChange,o=e.formData,r=e.setStep,c=t.map((function(e,n){return(0,s.jsx)(u.Z,{style:{fontSize:"12px"},value:e.numero,children:"".concat(e.tipo,": ").concat(e.numero," Saldo: ").concat(e.monto)})}));console.log(a);var l=a.map((function(e,n){return(0,s.jsx)(u.Z,{style:{fontSize:"12px"},value:null===e||void 0===e?void 0:e.cuentaId,children:"".concat(null===e||void 0===e?void 0:e.nombre,":").concat(null===e||void 0===e?void 0:e.numero)},null===e||void 0===e?void 0:e.cuentaId)}));return(0,s.jsxs)(h.Z,{container:!0,spacing:2,style:{display:"flex",justifyContent:"center",alignItems:"center"},children:[(0,s.jsxs)(h.Z,{item:!0,xs:11,children:[(0,s.jsx)("div",{className:"jsx-".concat(m.Z.__hash),children:(0,s.jsx)(h.Z,{container:!0,justify:"center",children:(0,s.jsxs)("div",{style:{width:"90%",backgroundColor:"#eeeeef",border:"solid #aaaaaa 1px"},className:"jsx-".concat(m.Z.__hash),children:[(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",border:"solid black 1px",backgroundColor:"#074EE8"},className:"jsx-".concat(m.Z.__hash),children:[(0,s.jsx)("p",{style:{paddingLeft:"3.75rem"},className:"jsx-".concat(m.Z.__hash)+" transaction-table-title",children:"Cuenta origen"}),(0,s.jsx)("p",{style:{marginLeft:"-1.25rem"},className:"jsx-".concat(m.Z.__hash)+" transaction-table-title",children:"Cuenta destino"}),(0,s.jsx)("p",{style:{paddingRight:"5.25rem"},className:"jsx-".concat(m.Z.__hash)+" transaction-table-title",children:"Monto (Bs)"})]}),(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-evenly"},className:"jsx-".concat(m.Z.__hash),children:[(0,s.jsx)(f.Z,{className:"select-input transaction-input",style:{backgroundColor:"white",height:"48px",border:"solid",borderColor:"#AAA",borderWidth:"1px",borderRadius:"3px",fontSize:"12px"},name:"origin",placeholder:"Selecciona",value:o.origin||null,onChange:function(e){i(e)},children:c}),(0,s.jsx)(f.Z,{className:"select-input transaction-input",style:{backgroundColor:"white",height:"48px",border:"solid",borderColor:"#AAA",borderWidth:"1px",borderRadius:"3px",fontSize:"12px"},name:"destiny",placeholder:"Selecciona",value:o.destiny||null,onChange:function(e){i(e)},children:l}),(0,s.jsx)("input",{type:"number",placeholder:"Monto",name:"monto",onChange:function(e){i(e)},className:"jsx-".concat(m.Z.__hash)+" monto-input transaction-input"})]}),(0,s.jsx)(j.qS,{label:"Descripci\xf3n:",type:"text",placeholder:"motivo de la transacci\xf3n",name:"description",disabled:n,handleFormChange:i}),(0,s.jsx)("hr",{className:"jsx-".concat(m.Z.__hash)}),(0,s.jsx)(j.qS,{label:"N\xfamero de cuenta:",type:"text",placeholder:"numero de cuenta",name:"destinyNumber",disabled:n,handleFormChange:i,value:o.destinyNumber}),(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"center"},className:"jsx-".concat(m.Z.__hash),children:[(0,s.jsx)(p.Z,{style:{color:"black",marginTop:"1.5rem",marginLeft:"4rem",marginRight:"0.5rem",fontSize:"14px"},id:"demo-simple-select-label",children:"Tipo de documento:"}),(0,s.jsxs)(f.Z,{labelId:"demo-simple-select-label",className:"select-input transaction-input",style:{backgroundColor:"white",height:"48px",border:"solid",borderColor:"#AAA",borderWidth:"1px",borderRadius:"3px",marginTop:"1rem"},value:o.tipoIdentificacion||null,label:"Tipo",name:"tipoIdentificacion",displayEmpty:!0,onChange:function(e){i(e)},children:[(0,s.jsx)(u.Z,{value:"V",children:"V - Venezolano(a)"}),(0,s.jsx)(u.Z,{value:"E",children:"E - Extranjero(a)"})]}),(0,s.jsx)(j.qS,{label:"N\xfamero del documento:",type:"text",placeholder:"n\xfamero del documento",name:"identification",disabled:n,handleFormChange:i,value:o.identification})]}),(0,s.jsx)(j.qS,{label:"Nombre/Alias de la cuenta:",type:"text",placeholder:"Nombre de la cuenta",name:"destinyName",disabled:n,handleFormChange:i,value:o.destinyName})]})})}),(0,s.jsx)("div",{style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-evenly"},className:"jsx-".concat(m.Z.__hash),children:(0,s.jsx)(x.Z,{variant:"contained",style:{backgroundColor:"#074EE8",color:"white",fontWeight:"bold",marginTop:"1rem"},onClick:function(e){!function(e){e.preventDefault(),r("step2")}(e)},children:"Siguiente"})})]}),(0,s.jsx)(d.default,{id:m.Z.__hash,children:m.Z})]})}var v=t(5477),b=t(8723),g=t(3064),_=t(7733);function C(e,n,t,a,i,s,o){try{var r=e[s](o),c=r.value}catch(l){return void t(l)}r.done?n(c):Promise.resolve(c).then(a,i)}function Z(e){return function(){var n=this,t=arguments;return new Promise((function(a,i){var s=e.apply(n,t);function o(e){C(s,a,i,o,r,"next",e)}function r(e){C(s,a,i,o,r,"throw",e)}o(void 0)}))}}function N(e){var n=e.formData,t=e.setStep,a=e.setTransactionId,o=e.setIsContact,r=(0,c.useState)(!1),u=r[0],f=r[1],p=function(){var e=Z(i().mark((function e(s,r){var c,d;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return s.preventDefault(),f(!0),c={cuentaDestino:n.destinyNumber,cuentaOrigen:n.origin,monto:n.monto,descripcion:n.description,identificador:n.identification,identificadorTipo:n.tipoIdentificacion},e.prev=3,e.next=6,(0,l.j0)("/api/app/transferencia",c);case 6:(d=e.sent).ok&&(console.log(d.data),a(d.data.transferencia._id),o(d.data.contacto),f(!1)),t(r),e.next=15;break;case 11:e.prev=11,e.t0=e.catch(3),f(!1),console.log(e.t0);case 15:case"end":return e.stop()}}),e,null,[[3,11]])})));return function(n,t){return e.apply(this,arguments)}}(),j=function(){var e=Z(i().mark((function e(n,a){return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n.preventDefault(),t(a);case 2:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}();return(0,s.jsxs)(h.Z,{container:!0,spacing:2,style:{display:"flex",alignItems:"center",justifyContent:"center"},children:[(0,s.jsxs)(h.Z,{item:!0,xs:11,children:[(0,s.jsx)("div",{className:"jsx-".concat(m.Z.__hash),children:(0,s.jsx)(h.Z,{container:!0,justify:"center",children:(0,s.jsxs)("div",{style:{width:"90%",backgroundColor:"#eeeeef"},className:"jsx-".concat(m.Z.__hash),children:[(0,s.jsx)("div",{style:{display:"flex",justifyContent:"space-between",border:"solid black 1px",backgroundColor:"#074EE8"},className:"jsx-".concat(m.Z.__hash),children:(0,s.jsx)("p",{className:"jsx-".concat(m.Z.__hash)+" transaction-table-title",children:"Datos de la transferencia"})}),(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-evenly"},className:"jsx-".concat(m.Z.__hash),children:[(0,s.jsx)(b.P,{field:"Cuenta de origen",value:n.origin}),(0,s.jsx)(b.P,{field:"Cuenta de destino",value:n.destiny||n.destinyNumber})]}),(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-evenly"},className:"jsx-".concat(m.Z.__hash),children:[(0,s.jsx)(b.P,{field:"Monto",value:_.Z.new(n.monto,"Bs.")}),(0,s.jsx)(b.P,{field:"Destinatario",value:"".concat(n.tipoIdentificacion,"-").concat(n.identification)})]}),(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-evenly"},className:"jsx-".concat(m.Z.__hash),children:[(0,s.jsx)(b.P,{field:"Fecha",value:(0,g.Z)()}),(0,s.jsx)(b.P,{field:"Nombre del destinatario",value:n.destinyName})]}),(0,s.jsx)("div",{style:{display:"flex",justifyContent:"space-evenly"},className:"jsx-".concat(m.Z.__hash),children:(0,s.jsx)(b.P,{field:"Descripci\xf3n",value:n.description})})]})})}),u?(0,s.jsx)("div",{style:{marginTop:16},className:"jsx-".concat(m.Z.__hash),children:(0,s.jsx)(v.Z,{})}):(0,s.jsxs)("div",{style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-evenly"},className:"jsx-".concat(m.Z.__hash),children:[(0,s.jsx)(x.Z,{variant:"contained",style:{backgroundColor:"#074EE8",color:"white",fontWeight:"bold",marginTop:"1rem"},onClick:function(e){j(e,"step1")},children:"Volver"}),(0,s.jsx)(x.Z,{variant:"contained",style:{backgroundColor:"#074EE8",color:"white",fontWeight:"bold",marginTop:"1rem"},onClick:function(e){p(e,"step3")},children:"Confirmar"})]})]}),(0,s.jsx)(d.default,{id:m.Z.__hash,children:m.Z})]})}var w=t(1163);function k(e,n,t,a,i,s,o){try{var r=e[s](o),c=r.value}catch(l){return void t(l)}r.done?n(c):Promise.resolve(c).then(a,i)}function S(e){return function(){var n=this,t=arguments;return new Promise((function(a,i){var s=e.apply(n,t);function o(e){k(s,a,i,o,r,"next",e)}function r(e){k(s,a,i,o,r,"throw",e)}o(void 0)}))}}function P(e){var n=e.formData,t=(e.setStep,e.transactionId),a=e.isContact,o=e.setIsContact,r=(0,w.useRouter)(),u=(0,c.useState)(!1),f=u[0],p=u[1],j=function(){var e=S(i().mark((function e(n){return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r.push("/posicionglobal");case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),y=function(){var e=S(i().mark((function e(t){var a;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log(Headers),p(!0),e.prev=2,a={cuenta:n.destinyNumber,nombreAlias:n.destinyName,identificador:n.identification,identificadorTipo:n.tipoIdentificacion},e.next=6,(0,l.j0)("/api/app/contacto",a);case 6:e.sent.ok?(p(!1),o(!0)):p(!1),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(2),p(!1);case 13:case"end":return e.stop()}}),e,null,[[2,10]])})));return function(n){return e.apply(this,arguments)}}();return(0,s.jsxs)(h.Z,{container:!0,spacing:2,style:{display:"flex",alignItems:"center",justifyContent:"center"},children:[(0,s.jsxs)(h.Z,{item:!0,xs:11,children:[(0,s.jsx)("div",{className:"jsx-".concat(m.Z.__hash),children:(0,s.jsx)(h.Z,{container:!0,justify:"center",children:(0,s.jsxs)("div",{style:{width:"90%",backgroundColor:"#eeeeef"},className:"jsx-".concat(m.Z.__hash),children:[(0,s.jsx)("div",{style:{display:"flex",justifyContent:"space-between",border:"solid black 1px",backgroundColor:"#074EE8"},className:"jsx-".concat(m.Z.__hash),children:(0,s.jsx)("p",{className:"jsx-".concat(m.Z.__hash)+" transaction-table-title",children:"Datos de la transferencia finalizada"})}),(0,s.jsx)("div",{style:{display:"flex",justifyContent:"space-evenly"},className:"jsx-".concat(m.Z.__hash),children:(0,s.jsx)(b.P,{field:"N\xfamero de referencia de la operaci\xf3n",value:t})}),(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-evenly"},className:"jsx-".concat(m.Z.__hash),children:[(0,s.jsx)(b.P,{field:"Cuenta de origen",value:n.origin}),(0,s.jsx)(b.P,{field:"Cuenta de destino",value:n.destiny||n.destinyNumber})]}),(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-evenly"},className:"jsx-".concat(m.Z.__hash),children:[(0,s.jsx)(b.P,{field:"Monto",value:_.Z.new(n.monto,"Bs.")}),(0,s.jsx)(b.P,{field:"Destinatario",value:"".concat(n.tipoIdentificacion,"-").concat(n.identification)})]}),(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-evenly"},className:"jsx-".concat(m.Z.__hash),children:[(0,s.jsx)(b.P,{field:"Fecha",value:(0,g.Z)()}),(0,s.jsx)(b.P,{field:"Nombre del destinatario",value:n.destinyName})]}),(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-evenly"},className:"jsx-".concat(m.Z.__hash),children:[(0,s.jsx)(b.P,{field:"Descripci\xf3n",value:n.description}),(0,s.jsx)("div",{style:{display:"flex"},className:"jsx-".concat(m.Z.__hash),children:!a&&f?(0,s.jsx)(v.Z,{}):a||f?null:(0,s.jsx)(x.Z,{variant:"contained",style:{backgroundColor:"#074EE8",color:"white",fontWeight:"bold",marginTop:"1rem",height:"36px"},onClick:function(e){y(e)},children:"A\xf1adir a contactos"})})]})]})})}),(0,s.jsx)("div",{style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-evenly"},className:"jsx-".concat(m.Z.__hash),children:(0,s.jsx)(x.Z,{variant:"contained",style:{backgroundColor:"#074EE8",color:"white",fontWeight:"bold",marginTop:"1rem"},onClick:function(e){j(e)},children:"Continuar"})})]}),(0,s.jsx)(d.default,{id:m.Z.__hash,children:m.Z})]})}t(7590),t(1664);function E(e,n,t,a,i,s,o){try{var r=e[s](o),c=r.value}catch(l){return void t(l)}r.done?n(c):Promise.resolve(c).then(a,i)}function I(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function D(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{},a=Object.keys(t);"function"===typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(t).filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})))),a.forEach((function(n){I(e,n,t[n])}))}return e}var T=function(){(0,o.v9)((function(e){return e.user}));var e,n=(0,c.useState)("step1"),t=n[0],a=n[1],d=(0,c.useState)({}),u=d[0],h=d[1],f=(0,c.useState)(!0),p=f[0],x=f[1],m=(0,c.useState)(!0),j=m[0],b=m[1],g=(0,c.useState)(),_=g[0],C=g[1],Z=(0,c.useState)(),w=Z[0],k=Z[1],S=(0,c.useState)(),I=S[0],T=S[1],A={step1:(0,s.jsxs)("h2",{children:["Paso 1"," ",(0,s.jsx)("span",{style:{fontWeight:"10"},children:"Completa los datos para realizar la transferencia."})]}),step2:(0,s.jsxs)("h2",{children:["Paso 2"," ",(0,s.jsx)("span",{style:{fontWeight:"10"},children:"Verifica los datos de la transferencia y confirma para finalizarla"})]}),step3:(0,s.jsx)("h2",{children:"Transferencia finalizada exitosamente"})};(0,c.useEffect)((function(){console.log(u)}),[u]),(0,c.useEffect)((e=i().mark((function e(){var n,t,a;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,b(!0),e.next=4,(0,l.A_)("/api/app/cuentas");case 4:return n=e.sent,e.next=7,(0,l.A_)("/api/app/contacto");case 7:t=e.sent,n.ok&&t.ok&&(C(n.data.cuentas),T(null===(a=t.data)||void 0===a?void 0:a.libretaContactos),b(!1)),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),console.log(e.t0);case 14:case"end":return e.stop()}}),e,null,[[0,11]])})),function(){var n=this,t=arguments;return new Promise((function(a,i){var s=e.apply(n,t);function o(e){E(s,a,i,o,r,"next",e)}function r(e){E(s,a,i,o,r,"throw",e)}o(void 0)}))}),[]);var z={step1:(0,s.jsx)(y,{loading:j,accounts:_,contacts:I,formData:u,handleFormChange:function(e){var n=e.target.name,t=D({},u);if(t[n]=e.target.value,"destiny"===n){var a=I.find((function(n){return n.cuentaId===e.target.value}));h(D({},u,{destiny:e.target.value,destinyName:a.nombre,identification:a.identificador,tipoIdentificacion:a.identificadorTipo,destinyNumber:a.numero}))}else h(t)},setStep:a}),step2:(0,s.jsx)(N,{loading:j,accounts:_,formData:u,setStep:a,setTransactionId:k,setIsContact:x}),step3:(0,s.jsx)(P,{loading:j,accounts:_,formData:u,setStep:a,transactionId:w,isContact:p,setIsContact:x})};return(0,s.jsx)(s.Fragment,{children:(0,s.jsxs)(r.Z,{children:[(0,s.jsxs)("div",{className:"header-title-container",style:{display:"flex",flexDirection:"column"},children:[(0,s.jsx)("h2",{className:"title-section",children:"Transferencias a Terceros Dakiti"}),A[t]]}),j?(0,s.jsx)("div",{style:{textAlign:"center",width:"100%"},children:(0,s.jsx)(v.Z,{size:50})}):z[t]]})})}}},function(e){e.O(0,[885,778,813,426,20,774,888,179],(function(){return n=3382,e(e.s=n);var n}));var n=e.O();_N_E=n}]);