"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[941],{366:function(n,e,t){var a=t(5318),l=t(862);e.Z=void 0;var i=l(t(7294)),o=(0,a(t(2108)).default)(i.createElement("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Close");e.Z=o},6945:function(n,e,t){var a=t(7294),l=t(3786);e.Z=(0,l.Z)(a.createElement("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"}),"Delete")},2430:function(n,e,t){var a=t(7294),l=t(3786);e.Z=(0,l.Z)(a.createElement("path",{d:"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"}),"Edit")},2280:function(n,e,t){t.d(e,{Z:function(){return d}});var a=t(5893),l=t(5988),i=t(8243),o=t(5477),r=t(366),s=t(282),c=t(2994);function d(n){var e=n.open,t=n.handleClose,d=n.title,h=n.height,u=n.loading,x=n.children,p=n.handleSubmit;return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(i.Z,{open:e,onClose:t,style:{zIndex:9999999},disableBackdropClick:!0,children:(0,a.jsxs)("div",{className:"jsx-".concat(c.Z.__hash)+" NewModal",children:[(0,a.jsx)(r.Z,{onClick:t}),(0,a.jsx)("h3",{className:"jsx-".concat(c.Z.__hash),children:d}),(0,a.jsx)("div",{style:{height:h,position:"relative"},className:"jsx-".concat(c.Z.__hash)+" NewModal-container",children:u?(0,a.jsx)("div",{style:{textAlign:"center",paddingTop:30},className:"jsx-".concat(c.Z.__hash),children:(0,a.jsx)(o.Z,{size:50})}):(0,a.jsxs)(a.Fragment,{children:[x,(0,a.jsxs)("div",{className:"jsx-".concat(c.Z.__hash)+" NewModal-footer",children:[(0,a.jsx)(s.Z,{className:"small-button red-background",onClick:t,children:"Cerrar"}),p&&(0,a.jsx)(s.Z,{className:"small-button blue-background",onClick:p,children:"Continuar"})]})]})})]})}),(0,a.jsx)(l.default,{id:c.Z.__hash,children:c.Z})]})}},7590:function(n,e,t){t.d(e,{Z:function(){return f}});var a=t(5893),l=t(5988),i=t(7294),o=t(7394),r=t(8222),s=t(2302),c=t(3750),d=t(9613),h=t(3340),u=t(9039),x=new String(".table-dash thead tr th{background-color:#074EE8;\ncolor:#fff;\nfont-size:1.25em;\npadding:5px 10px;\nborder-left:2px solid #fff}\n.table-dash tbody tr td{padding:5px 10px;\nborder-left:2px solid #fff}\n.table-dash tbody tr:nth-child(even){background-color:#eeeeef}\n.ultimaFila{background-color:#aeaeae}\n.ultimaFila td{font-size:18px;\nfont-weight:4000}\n.HeadArrows{position:absolute;\ntop:0;\nright:0}\n.HeadArrows svg{display:block}\n.HeadArrows svg:nth-child(2){margin-top:-15px}\n.HeadCell{cursor:pointer}\n.contenedor-buttons{text-align:center}\n.contenedor-buttons button{border-top:#1a2f36 solid 2px;\nborder-bottom:#1a2f36 solid 2px;\nborder-left:#1a2f36 solid 2px;\nborder-right:none;\nbackground-color:white;\nheight:40px;\ncolor:#1a2f36;\npadding:0 10px;\ncursor:pointer;\n-webkit-transition:all ease .5s;\ntransition:all ease .5s;\nmargin:0}\n.contenedor-buttons button:focus{outline:0}\n.contenedor-buttons button:hover{background-color:#1a2f36;\ncolor:white}\n.contenedor-buttons button:last-child{border-right:#1a2f36 solid 2px;\nborder-radius:0 10px 10px 0;\npadding:0 15px}\n.contenedor-buttons button:first-child{border-radius:10px 0 0 10px;\npadding:0 15px}\n.contenedor-buttons button.active{background-color:#1a2f36;\ncolor:white}\nth, td{text-align:center!important}\n.doble-tabla tr{height:70px}");x.__hash="f9c2ae44767887f5";var p=x,b=t(5477);function f(n){var e=n.data,t=void 0===e?[]:e,x=n.paginate,f=n.ultimaFila,m=n.loading,g=void 0===m||m,j=n.headers,v=void 0===j?[]:j,_=(0,i.useState)({col:0,asc:!0}),w=_[0],Z=(_[1],(0,i.useState)(t.length)),k=Z[0],y=Z[1],N=(0,i.useState)(0),M=N[0],C=N[1],z=(0,i.useState)(!1),F=z[0],E=z[1],H=(0,i.useRef)(null),S=0;return t.sort((function(n,e){return n[w.col]<e[w.col]?1:n[w.col]>e[w.col]?-1:0})),(0,i.useEffect)((function(){C(0)}),[t]),(0,i.useEffect)((function(){if(x){var n=H.current.clientHeight,e=Math.trunc(n/35);y(e)}else y(t.length)}),[t,x,F]),(0,i.useEffect)((function(){window.onresize=function(){E(!F)}})),(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("div",{ref:H,style:x?{height:"calc(100% - 50px)",overflow:"hidden",position:"relative"}:{height:"100%",overflow:"auto",position:"relative",minHeight:"200px"},className:"jsx-".concat(p.__hash),children:[(0,a.jsxs)(s.Z,{stickyHeader:!0,className:"table-dash",children:[(0,a.jsx)(c.Z,{children:(0,a.jsx)(o.Z,{children:v.map((function(n){return(0,a.jsxs)(r.Z,{className:"HeadCell",col:S++,children:[n,(0,a.jsxs)("div",{className:"jsx-".concat(p.__hash)+" HeadArrows",children:[(0,a.jsx)(h.Z,{style:w.col===S-1&&w.asc?{color:"red"}:null}),(0,a.jsx)(u.Z,{style:w.col!==S-1||w.asc?null:{color:"red"}})]})]},n)}))})}),g?null:(0,a.jsx)(d.Z,{children:function(){var n=[],e=M<Math.ceil(t.length/k)-1?k*M+k:t.length;if(!(t.length>0))return null;for(S=k*M;S<e;S++)n.push((0,a.jsx)(o.Z,{children:t[S].map((function(n){return(0,a.jsx)(r.Z,{children:n},Math.round(1e8*Math.random()))}))},Math.round(1e8*Math.random())));return f&&n.push((0,a.jsx)(o.Z,{className:"ultimaFila",children:f.map((function(n){return(0,a.jsx)(r.Z,{children:n},Math.round(1e8*Math.random()))}))},Math.round(1e8*Math.random()))),n}()})]}),g?(0,a.jsx)("div",{style:{textAlign:"center",marginTop:"10px",position:"absolute",width:"100%"},className:"jsx-".concat(p.__hash),children:(0,a.jsx)(b.Z,{size:50})}):null,0!==t.length||g?null:(0,a.jsx)("p",{style:{textAlign:"center",width:"100%",position:"absolute"},className:"jsx-".concat(p.__hash),children:"No hay registros que mostrar."})]}),x?function(){var n=[];if(n.push((0,a.jsx)("button",{onClick:function(){M>0&&C(M-1)},children:"Anterior"},Math.round(1e4*Math.random()))),Math.ceil(t.length/k)>6)if(M<=2){for(S=0;S<3;S++)n.push((0,a.jsx)("button",{onClick:C.bind(this,S),className:M===S?"active":null,children:S+1}));n.push((0,a.jsx)("button",{children:"..."}))}else if(M>=Math.ceil(t.length/k)-3)for(n.push((0,a.jsx)("button",{children:"..."})),S=Math.ceil(t.length/k)-3;S<Math.ceil(t.length/k);S++)n.push((0,a.jsx)("button",{onClick:C.bind(this,S),className:M===S?"active":null,children:S+1}));else{for(n.push((0,a.jsx)("button",{children:"..."})),S=M-2;S<M+3;S++)n.push((0,a.jsx)("button",{onClick:C.bind(this,S),className:M===S?"active":null,children:S+1}));n.push((0,a.jsx)("button",{children:"..."}))}else for(S=0;S<Math.ceil(t.length/k);S++)n.push((0,a.jsx)("button",{onClick:C.bind(this,S),className:M===S?"active":null,children:S+1},Math.round(1e4*Math.random())));return n.push((0,a.jsx)("button",{onClick:function(){M<t.length/k-1&&C(M+1)},children:"Siguiente"},Math.round(1e4*Math.random()))),(0,a.jsx)("div",{className:"contenedor-buttons",style:{position:"relative",bottom:"10px"},children:n})}():null,(0,a.jsx)(l.default,{id:p.__hash,children:p})]})}},6455:function(n,e,t){t.d(e,{qS:function(){return p},oi:function(){return b},lq:function(){return f},$3:function(){return m},$x:function(){return g}});var a=t(5893),l=t(5988),i=t(7294),o=t(2097),r=t(4714),s=t(7702),c=t(7827),d=t(4259),h=t(5916),u=t(381),x=t.n(u);t(5655);function p(n){var e=n.label,t=n.type,i=n.placeholder,r=n.name,s=n.error,c=n.disabled,d=n.defaultValue,h=n.handleFormChange,u=n.value;return(0,a.jsxs)("div",{className:"jsx-".concat(o.Z.__hash)+" input-contenedor-row",children:[(0,a.jsx)("label",{className:"jsx-".concat(o.Z.__hash)+" "+"label-input-row ".concat(s&&"error-tag"),children:e}),(0,a.jsx)("input",{disabled:c,type:t,placeholder:i,name:r,defaultValue:d,onChange:function(n){console.log("mew"),h(n)},style:c?{backgroundColor:"#d0d0d0"}:{},value:u,className:"jsx-".concat(o.Z.__hash)+" input-form-row"}),(0,a.jsx)(l.default,{id:o.Z.__hash,children:o.Z})]})}function b(n){var e=n.label,t=n.type,i=n.placeholder,r=n.name,s=n.error,c=n.disabled,d=n.defaultValue,h=n.onChange,u=n.white;return(0,a.jsxs)("div",{className:"jsx-".concat(o.Z.__hash)+" input-contenedor",children:[(0,a.jsx)("label",{className:"jsx-".concat(o.Z.__hash)+" "+"label-input ".concat(s&&"error-tag"),children:e}),(0,a.jsx)("input",{disabled:c,type:t,placeholder:i,name:r,defaultValue:d,onChange:h,style:c&&!u?{backgroundColor:"#d0d0d0"}:{},className:"jsx-".concat(o.Z.__hash)+" input-form"}),(0,a.jsx)(l.default,{id:o.Z.__hash,children:o.Z})]})}function f(n){var e=n.label,t=n.error,c=n.disabled,d=n.options,h=n.value,u=n.onChange,x=n.rightLabel,p=n.name,b=(0,i.useState)(h),f=b[0];b[1];return(0,a.jsxs)("div",{className:"jsx-".concat(o.Z.__hash)+" input-contenedor",children:[x?(0,a.jsx)("label",{style:{fontSize:"16px",paddingTop:"5px"},className:"jsx-".concat(o.Z.__hash)+" "+"label-input-row ".concat(t&&"error-tag"),children:e}):(0,a.jsx)("label",{className:"jsx-".concat(o.Z.__hash)+" "+"label-input ".concat(t&&"error-tag"),children:e}),(0,a.jsx)(r.Z,{className:"input-form ".concat(t&&"error-tag"),label:"Tipo",displayEmpty:!0,value:f,disabled:c,onChange:u,name:p,children:d.map((function(n){return(0,a.jsx)(s.Z,{value:n.value,children:n.label},n.value)}))}),(0,a.jsx)(l.default,{id:o.Z.__hash,children:o.Z})]})}function m(n){var e=n.label,t=n.error,i=n.disabled,r=n.options,s=n.value,c=n.onChange,d=n.name;return(0,a.jsxs)("div",{className:"jsx-".concat(o.Z.__hash)+" input-contenedor",children:[(0,a.jsx)("label",{className:"jsx-".concat(o.Z.__hash)+" "+"label-input ".concat(t&&"error-tag"),children:e}),(0,a.jsx)("select",{label:"Tipo",displayEmpty:!0,value:s,disabled:i,onChange:c,name:d,className:"jsx-".concat(o.Z.__hash)+" "+"input-form ".concat(t&&"error-tag"),children:r.map((function(n){return(0,a.jsx)("option",{value:n.value,className:"jsx-".concat(o.Z.__hash),children:n.label},n.value)}))}),(0,a.jsx)(l.default,{id:o.Z.__hash,children:o.Z})]})}var g=function(n){var e=n.label,t=n.error,i=n.value,r=n.onChange,s=n.name,u=n.disabled;return(0,a.jsxs)("div",{className:"jsx-".concat(o.Z.__hash)+" input-contenedor-row",children:[(0,a.jsx)("label",{className:"jsx-".concat(o.Z.__hash)+" "+"label-input-row ".concat(t&&"error-tag"),children:e}),(0,a.jsx)(c.M,{utils:h.Z,children:(0,a.jsx)(d.e,{disabled:u,onChange:function(n){r({target:{name:s,value:x()(n).format("MM/DD/YYYY")}})},value:i&&new Date(i)||new Date,name:s})}),(0,a.jsx)(l.default,{id:o.Z.__hash,children:o.Z})]})}},2097:function(n,e){var t=new String(".input-form{width:100%;\noutline:none;\nborder-width:0px;\nbackground:#FFFFFF;\nheight:48px;\nborder:2px solid rgba(0, 0, 255, 0.4);\nbox-sizing:border-box;\nborder-radius:4px;\nfont-size:0.875rem}\n.label-input{display:block;\nfont-size:14px;\nposition:absolute;\ntop:-20px;\nleft:10px}\n.input-contenedor{position:relative;\nmargin-top:30px;\nwidth:95%;\ndisplay:-webkit-inline-box;\ndisplay:-webkit-inline-flex;\ndisplay:-ms-inline-flexbox;\ndisplay:inline-flex}\n.error-tag{color:red}\n.input-form-row{outline:none;\nborder-width:0px;\nbackground:#FFFFFF;\nheight:48px;\nborder:2px solid rgba(0, 0, 255, 0.4);\nbox-sizing:border-box;\nborder-radius:4px;\nfont-size:0.875rem;\nwidth:50%}\n.input-contenedor-row{display:-webkit-box;\ndisplay:-webkit-flex;\ndisplay:-ms-flexbox;\ndisplay:flex;\n-webkit-flex-direction:row;\n-ms-flex-direction:row;\nflex-direction:row;\nposition:relative;\nmargin-top:15px;\nwidth:95%;\ndisplay:-webkit-inline-box;\ndisplay:-webkit-inline-flex;\ndisplay:-ms-inline-flexbox;\ndisplay:inline-flex;\n-webkit-align-items:center;\n-webkit-box-align:center;\n-ms-flex-align:center;\nalign-items:center;\nmargin-bottom:1rem}\n.label-input-row{display:block;\nfont-size:14px;\nmargin-left:4rem;\nmargin-right:1rem}\n.text-form-row{font-size:0.875rem}\n.text-contenedor-row{display:-webkit-box;\ndisplay:-webkit-flex;\ndisplay:-ms-flexbox;\ndisplay:flex;\n-webkit-flex-direction:row;\n-ms-flex-direction:row;\nflex-direction:row;\nposition:relative;\nmargin-top:30px;\ndisplay:-webkit-inline-box;\ndisplay:-webkit-inline-flex;\ndisplay:-ms-inline-flexbox;\ndisplay:inline-flex;\n-webkit-align-items:center;\n-webkit-box-align:center;\n-ms-flex-align:center;\nalign-items:center;\nmargin-bottom:2rem}\n.label-text-row{display:block;\nfont-size:14px;\nmargin-left:4rem;\nmargin-right:1rem;\nfont-weight:bold}");t.__hash="bd9b49ec151b408d",e.Z=t}}]);