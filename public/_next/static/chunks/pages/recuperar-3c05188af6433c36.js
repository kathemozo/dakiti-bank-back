(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[949],{9523:function(e,n,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/recuperar",function(){return a(885)}])},4571:function(e,n){"use strict";var a=new String("#form-login{height:auto;\nwidth:70%;\nmargin:auto;\nmargin-top:20px}\n#form-login>div{background-color:#c4c4c4;\nheight:auto;\npadding:20px;\ntext-align:center!important;\nwidth:100%}\n#form-login .medium-button{margin:auto;\nmargin-top:20px;\nmargin-bottom:20px}");a.__hash="be6c79531cb95f03",n.Z=a},6455:function(e,n,a){"use strict";a.d(n,{qS:function(){return x},oi:function(){return f},lq:function(){return b},$3:function(){return m},$x:function(){return g}});var r=a(5893),t=a(5988),i=a(7294),o=a(2097),s=a(4714),l=a(7702),c=a(7827),u=a(4259),d=a(5916),p=a(381),h=a.n(p);a(5655);function x(e){var n=e.label,a=e.type,i=e.placeholder,s=e.name,l=e.error,c=e.disabled,u=e.defaultValue,d=e.handleFormChange,p=e.value;return(0,r.jsxs)("div",{className:"jsx-".concat(o.Z.__hash)+" input-contenedor-row",children:[(0,r.jsx)("label",{className:"jsx-".concat(o.Z.__hash)+" "+"label-input-row ".concat(l&&"error-tag"),children:n}),(0,r.jsx)("input",{disabled:c,type:a,placeholder:i,name:s,defaultValue:u,onChange:function(e){console.log("mew"),d(e)},style:c?{backgroundColor:"#d0d0d0"}:{},value:p,className:"jsx-".concat(o.Z.__hash)+" input-form-row"}),(0,r.jsx)(t.default,{id:o.Z.__hash,children:o.Z})]})}function f(e){var n=e.label,a=e.type,i=e.placeholder,s=e.name,l=e.error,c=e.disabled,u=e.defaultValue,d=e.onChange,p=e.white;return(0,r.jsxs)("div",{className:"jsx-".concat(o.Z.__hash)+" input-contenedor",children:[(0,r.jsx)("label",{className:"jsx-".concat(o.Z.__hash)+" "+"label-input ".concat(l&&"error-tag"),children:n}),(0,r.jsx)("input",{disabled:c,type:a,placeholder:i,name:s,defaultValue:u,onChange:d,style:c&&!p?{backgroundColor:"#d0d0d0"}:{},className:"jsx-".concat(o.Z.__hash)+" input-form"}),(0,r.jsx)(t.default,{id:o.Z.__hash,children:o.Z})]})}function b(e){var n=e.label,a=e.error,c=e.disabled,u=e.options,d=e.value,p=e.onChange,h=e.rightLabel,x=e.name,f=(0,i.useState)(d),b=f[0];f[1];return(0,r.jsxs)("div",{className:"jsx-".concat(o.Z.__hash)+" input-contenedor",children:[h?(0,r.jsx)("label",{style:{fontSize:"16px",paddingTop:"5px"},className:"jsx-".concat(o.Z.__hash)+" "+"label-input-row ".concat(a&&"error-tag"),children:n}):(0,r.jsx)("label",{className:"jsx-".concat(o.Z.__hash)+" "+"label-input ".concat(a&&"error-tag"),children:n}),(0,r.jsx)(s.Z,{className:"input-form ".concat(a&&"error-tag"),label:"Tipo",displayEmpty:!0,value:b,disabled:c,onChange:p,name:x,children:u.map((function(e){return(0,r.jsx)(l.Z,{value:e.value,children:e.label},e.value)}))}),(0,r.jsx)(t.default,{id:o.Z.__hash,children:o.Z})]})}function m(e){var n=e.label,a=e.error,i=e.disabled,s=e.options,l=e.value,c=e.onChange,u=e.name;return(0,r.jsxs)("div",{className:"jsx-".concat(o.Z.__hash)+" input-contenedor",children:[(0,r.jsx)("label",{className:"jsx-".concat(o.Z.__hash)+" "+"label-input ".concat(a&&"error-tag"),children:n}),(0,r.jsx)("select",{label:"Tipo",displayEmpty:!0,value:l,disabled:i,onChange:c,name:u,className:"jsx-".concat(o.Z.__hash)+" "+"input-form ".concat(a&&"error-tag"),children:s.map((function(e){return(0,r.jsx)("option",{value:e.value,className:"jsx-".concat(o.Z.__hash),children:e.label},e.value)}))}),(0,r.jsx)(t.default,{id:o.Z.__hash,children:o.Z})]})}var g=function(e){var n=e.label,a=e.error,i=e.value,s=e.onChange,l=e.name,p=e.disabled;return(0,r.jsxs)("div",{className:"jsx-".concat(o.Z.__hash)+" input-contenedor-row",children:[(0,r.jsx)("label",{className:"jsx-".concat(o.Z.__hash)+" "+"label-input-row ".concat(a&&"error-tag"),children:n}),(0,r.jsx)(c.M,{utils:d.Z,children:(0,r.jsx)(u.e,{disabled:p,onChange:function(e){s({target:{name:l,value:h()(e).format("MM/DD/YYYY")}})},value:i&&new Date(i)||new Date,name:l})}),(0,r.jsx)(t.default,{id:o.Z.__hash,children:o.Z})]})}},2097:function(e,n){"use strict";var a=new String(".input-form{width:100%;\noutline:none;\nborder-width:0px;\nbackground:#FFFFFF;\nheight:48px;\nborder:2px solid rgba(0, 0, 255, 0.4);\nbox-sizing:border-box;\nborder-radius:4px;\nfont-size:0.875rem}\n.label-input{display:block;\nfont-size:14px;\nposition:absolute;\ntop:-20px;\nleft:10px}\n.input-contenedor{position:relative;\nmargin-top:30px;\nwidth:95%;\ndisplay:-webkit-inline-box;\ndisplay:-webkit-inline-flex;\ndisplay:-ms-inline-flexbox;\ndisplay:inline-flex}\n.error-tag{color:red}\n.input-form-row{outline:none;\nborder-width:0px;\nbackground:#FFFFFF;\nheight:48px;\nborder:2px solid rgba(0, 0, 255, 0.4);\nbox-sizing:border-box;\nborder-radius:4px;\nfont-size:0.875rem;\nwidth:50%}\n.input-contenedor-row{display:-webkit-box;\ndisplay:-webkit-flex;\ndisplay:-ms-flexbox;\ndisplay:flex;\n-webkit-flex-direction:row;\n-ms-flex-direction:row;\nflex-direction:row;\nposition:relative;\nmargin-top:15px;\nwidth:95%;\ndisplay:-webkit-inline-box;\ndisplay:-webkit-inline-flex;\ndisplay:-ms-inline-flexbox;\ndisplay:inline-flex;\n-webkit-align-items:center;\n-webkit-box-align:center;\n-ms-flex-align:center;\nalign-items:center;\nmargin-bottom:1rem}\n.label-input-row{display:block;\nfont-size:14px;\nmargin-left:4rem;\nmargin-right:1rem}\n.text-form-row{font-size:0.875rem}\n.text-contenedor-row{display:-webkit-box;\ndisplay:-webkit-flex;\ndisplay:-ms-flexbox;\ndisplay:flex;\n-webkit-flex-direction:row;\n-ms-flex-direction:row;\nflex-direction:row;\nposition:relative;\nmargin-top:30px;\ndisplay:-webkit-inline-box;\ndisplay:-webkit-inline-flex;\ndisplay:-ms-inline-flexbox;\ndisplay:inline-flex;\n-webkit-align-items:center;\n-webkit-box-align:center;\n-ms-flex-align:center;\nalign-items:center;\nmargin-bottom:2rem}\n.label-text-row{display:block;\nfont-size:14px;\nmargin-left:4rem;\nmargin-right:1rem;\nfont-weight:bold}");a.__hash="bd9b49ec151b408d",n.Z=a},885:function(e,n,a){"use strict";a.r(n),a.d(n,{default:function(){return Z}});var r=a(5893),t=a(4416),i=a(3832),o=a(4051),s=a.n(o),l=a(5988),c=a(7294),u=a(1664),d=a(1749),p=a(5477),h=a(282),x=a(4571),f=a(6455),b=a(649),m=a(1163);function g(e,n,a,r,t,i,o){try{var s=e[i](o),l=s.value}catch(c){return void a(c)}s.done?n(l):Promise.resolve(l).then(r,t)}function j(e){return function(){var n=this,a=arguments;return new Promise((function(r,t){var i=e.apply(n,a);function o(e){g(i,r,t,o,s,"next",e)}function s(e){g(i,r,t,o,s,"throw",e)}o(void 0)}))}}function v(e,n,a){return n in e?Object.defineProperty(e,n,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[n]=a,e}function _(e){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{},r=Object.keys(a);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(a).filter((function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable})))),r.forEach((function(n){v(e,n,a[n])}))}return e}function w(e){e=null!==e?e:function(e){throw e}(new TypeError("Cannot destructure undefined"));var n=function(e){var n=!0;return V.test(e.password)||(n=!1),e.passwordRepit!==e.password&&(n=!1),n},a=(0,m.useRouter)(),t=(0,c.useState)(""),i=t[0],o=t[1],g=(0,c.useState)(""),v=g[0],w=g[1],y=(0,c.useState)(!1),Z=y[0],k=y[1],N=(0,c.useState)({}),C=N[0],S=N[1],F=(0,c.useState)({}),T=F[0],O=F[1],E=(0,c.useState)("0"),z=E[0],I=E[1],D=function(e){console.log(e);var n=e.target.name,a=_({},C);a[n]=e.target.value,S(a)},P=function(e){console.log(e);var n=e.target.name,a=_({},T);a[n]=e.target.value,O(a)},R={0:function(){var e=j(s().mark((function e(n){var a;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n.preventDefault(),k(!0),e.next=5,(0,b.SV)("/api/auth/recuperar-password",_({},C,{rol:"J"===C.identificadorTipo?"juridico":"natural"}));case 5:if(!(a=e.sent).ok){e.next=12;break}return k(!1),I("1"),o(""),w("Se ha enviado un codigo de confirmaci\xf3n a su correo electr\xf3nico"),e.abrupt("return");case 12:k(!1),o(a.error),e.next=21;break;case 16:e.prev=16,e.t0=e.catch(0),o("Ocurri\xf3n un error intentelo mas tarde"),k(!1),console.log(e.t0);case 21:case"end":return e.stop()}}),e,null,[[0,16]])})));return function(n){return e.apply(this,arguments)}}(),1:function(){var e=j(s().mark((function e(n){var a;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n.preventDefault(),k(!0),e.next=5,(0,b.SV)("/api/auth/confirmar-codigo",_({},C,{rol:"J"===C.identificadorTipo?"juridico":"natural"}));case 5:if(!(a=e.sent).ok){e.next=13;break}return k(!1),o(),w(),I("2"),localStorage.setItem("token_dakiti",a.data.token),e.abrupt("return");case 13:k(!1),o(a.error),e.next=22;break;case 17:e.prev=17,e.t0=e.catch(0),o("Ocurri\xf3n un error intentelo mas tarde"),k(!1),console.log(e.t0);case 22:case"end":return e.stop()}}),e,null,[[0,17]])})));return function(n){return e.apply(this,arguments)}}(),2:function(){var e=j(s().mark((function e(r){var t;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,r.preventDefault(),n(T)){e.next=5;break}return o("Error con contrase\xf1a nueva"),e.abrupt("return");case 5:return k(!0),e.next=8,(0,b.j0)("/api/app/recuperar-password",_({},T));case 8:if(!(t=e.sent).ok){e.next=16;break}return k(!1),o(),w(),localStorage.removeItem("token_dakiti"),a.push("/"),e.abrupt("return");case 16:k(!1),o(t.error),e.next=25;break;case 20:e.prev=20,e.t0=e.catch(0),o("Ocurri\xf3n un error intentelo mas tarde"),k(!1),console.log(e.t0);case 25:case"end":return e.stop()}}),e,null,[[0,20]])})));return function(n){return e.apply(this,arguments)}}()},V=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;return(0,r.jsxs)(d.Z,{container:!0,spacing:2,children:[(0,r.jsx)(d.Z,{item:!0,xs:12,children:(0,r.jsx)("form",{onSubmit:R[z],className:"jsx-".concat(x.Z.__hash),children:(0,r.jsxs)(d.Z,{style:{width:"40%"},id:"form-login",container:!0,children:[(0,r.jsx)("h1",{className:"jsx-".concat(x.Z.__hash),children:"Dakiti Recuperar Contrase\xf1a"}),"1"===z||"0"===z?(0,r.jsxs)("div",{className:"jsx-".concat(x.Z.__hash),children:[(0,r.jsx)(f.lq,{name:"identificadorTipo",label:"Tipo de documento para inicio de sesi\xf3n(*)",value:C.tipoIdentificacion,options:[{value:"V",label:"C\xe9dula Venezolana"},{value:"E",label:"C\xe9dula Extrangera"},{value:"J",label:"RIF"}],disabled:Z,onChange:function(e){D(e)}}),(0,r.jsx)(f.oi,{label:"J"===C.identificadorTipo?"RIF(*)":"C\xe9dula (*)",type:"text",placeholder:"Ingrese su c\xe9dula",name:"identificador",onChange:function(e){D(e)},disabled:Z}),"1"===z&&(0,r.jsx)(f.oi,{label:"C\xf3digo",type:"text",placeholder:"Ingrese c\xf3digo recibido",name:"codigo",disabled:Z,onChange:function(e){D(e)}}),(0,r.jsx)("p",{style:{color:"red"},className:"jsx-".concat(x.Z.__hash),children:i}),(0,r.jsx)("p",{style:{color:"green"},className:"jsx-".concat(x.Z.__hash),children:v}),(0,r.jsx)("div",{className:"jsx-".concat(x.Z.__hash),children:Z?(0,r.jsx)("div",{style:{marginTop:36},className:"jsx-".concat(x.Z.__hash),children:(0,r.jsx)(p.Z,{})}):(0,r.jsx)(h.Z,{type:"submit",className:"medium-button blue-background",variant:"contained",children:"Recuperar"})}),(0,r.jsx)(u.default,{href:"/",children:(0,r.jsx)("a",{className:"jsx-".concat(x.Z.__hash),children:"Inicio"})})]}):(0,r.jsxs)("div",{className:"jsx-".concat(x.Z.__hash),children:[(0,r.jsx)(f.oi,{label:"Contrase\xf1a",type:"password",placeholder:"Ingrese su nueva contrase\xf1a",name:"password",onChange:function(e){P(e)},disabled:Z}),(0,r.jsx)(f.oi,{label:"Repetir Contrase\xf1a",type:"password",placeholder:"Ingrese su nueva contrase\xf1a",name:"passwordRepit",onChange:function(e){P(e)},disabled:Z}),(0,r.jsx)("p",{style:{color:"red"},className:"jsx-".concat(x.Z.__hash),children:i}),(0,r.jsx)("p",{style:{color:"green"},className:"jsx-".concat(x.Z.__hash),children:v}),(0,r.jsx)("div",{className:"jsx-".concat(x.Z.__hash),children:Z?(0,r.jsx)("div",{style:{marginTop:36},className:"jsx-".concat(x.Z.__hash),children:(0,r.jsx)(p.Z,{})}):(0,r.jsx)(h.Z,{type:"submit",className:"medium-button blue-background",variant:"contained",children:"Cambiar"})}),(0,r.jsx)(u.default,{href:"/",children:(0,r.jsx)("a",{className:"jsx-".concat(x.Z.__hash),children:"Inicio"})})]})]})})}),(0,r.jsx)(l.default,{id:x.Z.__hash,children:x.Z})]})}function y(e){e.userType;return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(i.Z,{children:(0,r.jsx)(w,{})})})}y.layout="HomeLayout";var Z=(0,t.$j)((function(e){return{userType:e.userType}}))(y)}},function(e){e.O(0,[885,778,813,774,888,179],(function(){return n=9523,e(e.s=n);var n}));var n=e.O();_N_E=n}]);