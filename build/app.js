var app=function(){"use strict";function t(){}const e=t=>t;function n(t){return t()}function r(){return Object.create(null)}function i(t){t.forEach(n)}function o(t){return"function"==typeof t}function l(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function s(e,...n){if(null==e)return t;const r=e.subscribe(...n);return r.unsubscribe?()=>r.unsubscribe():r}function c(t,e,n){t.$$.on_destroy.push(s(e,n))}function a(t){return null==t?"":t}function u(t,e,n=e){return t.set(n),e}function d(e){return e&&o(e.destroy)?e.destroy:t}const f="undefined"!=typeof window;let m=f?()=>window.performance.now():()=>Date.now(),p=f?t=>requestAnimationFrame(t):t;const v=new Set;function g(t){v.forEach((e=>{e.c(t)||(v.delete(e),e.f())})),0!==v.size&&p(g)}function b(t){let e;return 0===v.size&&p(g),{promise:new Promise((n=>{v.add(e={c:t,f:n})})),abort(){v.delete(e)}}}function h(t,e){t.appendChild(e)}function $(t,e,n){t.insertBefore(e,n||null)}function y(t){t.parentNode.removeChild(t)}function x(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function w(t){return document.createElement(t)}function _(t){return document.createTextNode(t)}function k(){return _(" ")}function E(){return _("")}function T(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function L(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function S(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function z(t,e){t.value=null==e?"":e}function A(t,e,n,r){t.style.setProperty(e,n,r?"important":"")}function C(t,e,n){t.classList[n?"add":"remove"](e)}const D=new Set;let N,H=0;function M(t,e,n,r,i,o,l,s=0){const c=16.666/r;let a="{\n";for(let t=0;t<=1;t+=c){const r=e+(n-e)*o(t);a+=100*t+`%{${l(r,1-r)}}\n`}const u=a+`100% {${l(n,1-n)}}\n}`,d=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(u)}_${s}`,f=t.ownerDocument;D.add(f);const m=f.__svelte_stylesheet||(f.__svelte_stylesheet=f.head.appendChild(w("style")).sheet),p=f.__svelte_rules||(f.__svelte_rules={});p[d]||(p[d]=!0,m.insertRule(`@keyframes ${d} ${u}`,m.cssRules.length));const v=t.style.animation||"";return t.style.animation=`${v?`${v}, `:""}${d} ${r}ms linear ${i}ms 1 both`,H+=1,d}function j(t,e){const n=(t.style.animation||"").split(", "),r=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),i=n.length-r.length;i&&(t.style.animation=r.join(", "),H-=i,H||p((()=>{H||(D.forEach((t=>{const e=t.__svelte_stylesheet;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.__svelte_rules={}})),D.clear())})))}function q(t){N=t}const I=[],P=[],O=[],R=[],B=Promise.resolve();let U=!1;function Y(t){O.push(t)}let F=!1;const G=new Set;function W(){if(!F){F=!0;do{for(let t=0;t<I.length;t+=1){const e=I[t];q(e),V(e.$$)}for(q(null),I.length=0;P.length;)P.pop()();for(let t=0;t<O.length;t+=1){const e=O[t];G.has(e)||(G.add(e),e())}O.length=0}while(I.length);for(;R.length;)R.pop()();U=!1,F=!1,G.clear()}}function V(t){if(null!==t.fragment){t.update(),i(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(Y)}}let J;function K(){return J||(J=Promise.resolve(),J.then((()=>{J=null}))),J}function Q(t,e,n){t.dispatchEvent(function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(`${e?"intro":"outro"}${n}`))}const X=new Set;let Z;function tt(){Z={r:0,c:[],p:Z}}function et(){Z.r||i(Z.c),Z=Z.p}function nt(t,e){t&&t.i&&(X.delete(t),t.i(e))}function rt(t,e,n,r){if(t&&t.o){if(X.has(t))return;X.add(t),Z.c.push((()=>{X.delete(t),r&&(n&&t.d(1),r())})),t.o(e)}}const it={duration:0};function ot(n,r,i){let l,s,c=r(n,i),a=!1,u=0;function d(){l&&j(n,l)}function f(){const{delay:r=0,duration:i=300,easing:o=e,tick:f=t,css:p}=c||it;p&&(l=M(n,0,1,i,r,o,p,u++)),f(0,1);const v=m()+r,g=v+i;s&&s.abort(),a=!0,Y((()=>Q(n,!0,"start"))),s=b((t=>{if(a){if(t>=g)return f(1,0),Q(n,!0,"end"),d(),a=!1;if(t>=v){const e=o((t-v)/i);f(e,1-e)}}return a}))}let p=!1;return{start(){p||(j(n),o(c)?(c=c(),K().then(f)):f())},invalidate(){p=!1},end(){a&&(d(),a=!1)}}}function lt(n,r,l){let s,c=r(n,l),a=!0;const u=Z;function d(){const{delay:r=0,duration:o=300,easing:l=e,tick:d=t,css:f}=c||it;f&&(s=M(n,1,0,o,r,l,f));const p=m()+r,v=p+o;Y((()=>Q(n,!1,"start"))),b((t=>{if(a){if(t>=v)return d(0,1),Q(n,!1,"end"),--u.r||i(u.c),!1;if(t>=p){const e=l((t-p)/o);d(1-e,e)}}return a}))}return u.r+=1,o(c)?K().then((()=>{c=c(),d()})):d(),{end(t){t&&c.tick&&c.tick(1,0),a&&(s&&j(n,s),a=!1)}}}function st(n,r,l,s){let c=r(n,l),a=s?0:1,u=null,d=null,f=null;function p(){f&&j(n,f)}function v(t,e){const n=t.b-a;return e*=Math.abs(n),{a:a,b:t.b,d:n,duration:e,start:t.start,end:t.start+e,group:t.group}}function g(r){const{delay:o=0,duration:l=300,easing:s=e,tick:g=t,css:h}=c||it,$={start:m()+o,b:r};r||($.group=Z,Z.r+=1),u||d?d=$:(h&&(p(),f=M(n,a,r,l,o,s,h)),r&&g(0,1),u=v($,l),Y((()=>Q(n,r,"start"))),b((t=>{if(d&&t>d.start&&(u=v(d,l),d=null,Q(n,u.b,"start"),h&&(p(),f=M(n,a,u.b,u.duration,0,s,c.css))),u)if(t>=u.end)g(a=u.b,1-a),Q(n,u.b,"end"),d||(u.b?p():--u.group.r||i(u.group.c)),u=null;else if(t>=u.start){const e=t-u.start;a=u.a+u.d*s(e/u.duration),g(a,1-a)}return!(!u&&!d)})))}return{run(t){o(c)?K().then((()=>{c=c(),g(t)})):g(t)},end(){p(),u=d=null}}}function ct(t){t&&t.c()}function at(t,e,r){const{fragment:l,on_mount:s,on_destroy:c,after_update:a}=t.$$;l&&l.m(e,r),Y((()=>{const e=s.map(n).filter(o);c?c.push(...e):i(e),t.$$.on_mount=[]})),a.forEach(Y)}function ut(t,e){const n=t.$$;null!==n.fragment&&(i(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function dt(t,e){-1===t.$$.dirty[0]&&(I.push(t),U||(U=!0,B.then(W)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function ft(e,n,o,l,s,c,a=[-1]){const u=N;q(e);const d=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:s,bound:r(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:r(),dirty:a,skip_bound:!1};let f=!1;if(d.ctx=o?o(e,n.props||{},((t,n,...r)=>{const i=r.length?r[0]:n;return d.ctx&&s(d.ctx[t],d.ctx[t]=i)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](i),f&&dt(e,t)),n})):[],d.update(),f=!0,i(d.before_update),d.fragment=!!l&&l(d.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);d.fragment&&d.fragment.l(t),t.forEach(y)}else d.fragment&&d.fragment.c();n.intro&&nt(e.$$.fragment),at(e,n.target,n.anchor),W()}q(u)}class mt{$destroy(){ut(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const pt=[];function vt(e,n=t){let r;const i=[];function o(t){if(l(e,t)&&(e=t,r)){const t=!pt.length;for(let t=0;t<i.length;t+=1){const n=i[t];n[1](),pt.push(n,e)}if(t){for(let t=0;t<pt.length;t+=2)pt[t][0](pt[t+1]);pt.length=0}}}return{set:o,update:function(t){o(t(e))},subscribe:function(l,s=t){const c=[l,s];return i.push(c),1===i.length&&(r=n(o)||t),l(e),()=>{const t=i.indexOf(c);-1!==t&&i.splice(t,1),0===i.length&&(r(),r=null)}}}}const gt=vt(1),bt=1,ht=2,$t=3;function yt(e){let n,r,o,l,s,c,a,u,d,f,m,p,v;return{c(){n=w("div"),r=w("div"),r.innerHTML='<a href="/" class="svelte-12zrox2"><i class="bi bi-layout-text-window-reverse svelte-12zrox2"></i></a>',o=k(),l=w("div"),s=w("div"),s.innerHTML='<i class="bi bi-front svelte-12zrox2"></i>',c=k(),a=w("div"),a.innerHTML='<i class="bi bi-layers svelte-12zrox2"></i>',u=k(),d=w("div"),d.innerHTML='<i class="bi bi-gear svelte-12zrox2"></i>',f=k(),m=w("div"),m.innerHTML='<div class="logo svelte-12zrox2"><i class="bi bi-person-circle svelte-12zrox2" title="About me"></i></div>',L(r,"class","logo circle tilted svelte-12zrox2"),L(s,"class","logo my-4 svelte-12zrox2"),L(s,"title","Elements"),C(s,"active",e[0]==bt),L(a,"class","logo my-4 svelte-12zrox2"),L(a,"title","Layers"),C(a,"active",e[0]==ht),L(d,"class","logo my-4 svelte-12zrox2"),L(d,"title","Settings"),C(d,"active",e[0]==$t),L(l,"class","drawer svelte-12zrox2"),L(m,"class","bottom-drawer svelte-12zrox2"),L(n,"class","activity-bar svelte-12zrox2")},m(t,i){$(t,n,i),h(n,r),h(n,o),h(n,l),h(l,s),h(l,c),h(l,a),h(l,u),h(l,d),h(n,f),h(n,m),p||(v=[T(s,"click",e[2]),T(a,"click",e[3]),T(d,"click",e[4])],p=!0)},p(t,[e]){1&e&&C(s,"active",t[0]==bt),1&e&&C(a,"active",t[0]==ht),1&e&&C(d,"active",t[0]==$t)},i:t,o:t,d(t){t&&y(n),p=!1,i(v)}}}function xt(t,e,n){let r;function i(t){u(gt,r=t,r)}c(t,gt,(t=>n(0,r=t)));return[r,i,()=>i(bt),()=>i(ht),()=>i($t)]}class wt extends mt{constructor(t){super(),ft(this,t,xt,yt,l,{})}}const _t=vt(null),kt=vt(null),Et=vt("Untitled"),Tt=function(e,n,r){const l=!Array.isArray(e),c=l?[e]:e,a=n.length<2;return{subscribe:vt(r,(e=>{let r=!1;const u=[];let d=0,f=t;const m=()=>{if(d)return;f();const r=n(l?u[0]:u,e);a?e(r):f=o(r)?r:t},p=c.map(((t,e)=>s(t,(t=>{u[e]=t,d&=~(1<<e),r&&m()}),(()=>{d|=1<<e}))));return r=!0,m(),function(){i(p),f()}})).subscribe}}(_t,(t=>null!=t));function Lt(){const t=new BroadcastChannel("editor-channel");t.addEventListener("message",(({data:t})=>{switch(t.action){case"INIT":St({action:"SETUP",payload:Ct()})}})),window._EDITOR_CHANNEL_=t}function St(t){window._EDITOR_CHANNEL_.postMessage(t)}function zt(){let t="";return Et.subscribe((e=>{t=e}))(),t}function At(){let t="";return _t.subscribe((e=>{t=e.body.innerHTML,t=t||""}))(),t}function Ct(){return{title:zt(),html:At()}}function Dt(){St({action:"UPDATE_PREVIEW",payload:{html:At()}})}function Nt(t){let e,n,r;return{c(){e=w("input"),L(e,"type","text"),L(e,"class","project-title-input svelte-1bzbw03")},m(i,o){$(i,e,o),z(e,t[0]),n||(r=[T(e,"input",t[6]),T(e,"blur",t[5]),T(e,"keyup",t[4]),d(jt.call(null,e))],n=!0)},p(t,n){1&n&&e.value!==t[0]&&z(e,t[0])},d(t){t&&y(e),n=!1,i(r)}}}function Ht(t){let e,n,r,i;return{c(){e=w("span"),n=_(t[2]),L(e,"class","navbar-brand project-title-display svelte-1bzbw03"),L(e,"role","button")},m(o,l){$(o,e,l),h(e,n),r||(i=T(e,"click",t[3]),r=!0)},p(t,e){4&e&&S(n,t[2])},d(t){t&&y(e),r=!1,i()}}}function Mt(e){let n;function r(t,e){return t[1]?Nt:Ht}let i=r(e),o=i(e);return{c(){o.c(),n=E()},m(t,e){o.m(t,e),$(t,n,e)},p(t,[e]){i===(i=r(t))&&o?o.p(t,e):(o.d(1),o=i(t),o&&(o.c(),o.m(n.parentNode,n)))},i:t,o:t,d(t){o.d(t),t&&y(n)}}}function jt(t){t.select(),t.focus()}function qt(t,e,n){let r,i;c(t,Et,(t=>n(8,i=t)));let o=document.title,l="Untitled",s=i,a=!1;function u(){n(1,a=!1),l.length||n(0,l="Untitled"),s=l.trim(),Et.set(s),function(){const t=s.length&&"Untitled"!=s?r+" | ":"";document.title=`${t} ${o}`.trim(),St({action:"UPDATE_TITLE",payload:{title:zt()}})}()}return t.$$.update=()=>{1&t.$$.dirty&&n(2,r=l.length>18?l.substring(0,15)+"...":l)},[l,a,r,function(){n(1,a=!0)},function(t){if("Enter"==t.code)return t.preventDefault(),u()},u,function(){l=this.value,n(0,l)}]}class It extends mt{constructor(t){super(),ft(this,t,qt,Mt,l,{})}}function Pt(e){let n,r,o,l,s,c,a,u,d,f,m,p,v,g,b,x,_;return o=new It({}),{c(){n=w("nav"),r=w("div"),ct(o.$$.fragment),l=k(),s=w("button"),s.innerHTML='<span class="navbar-toggler-icon"></span>',c=k(),a=w("div"),u=w("ul"),d=w("li"),f=w("button"),f.innerHTML='<i class="bi bi-save"></i>  <span>Save</span>',m=k(),p=w("button"),p.innerHTML='<i class="bi bi-download"></i>  <span>Download</span>',v=k(),g=w("button"),g.innerHTML='<i class="bi bi-eye"></i>  <span>Preview</span>',L(s,"class","navbar-toggler"),L(s,"type","button"),L(s,"data-bs-toggle","collapse"),L(s,"data-bs-target","#navbarNav"),L(s,"aria-controls","navbarNav"),L(s,"aria-expanded","false"),L(s,"aria-label","Toggle navigation"),L(f,"class","btn btn-main"),L(p,"class","btn btn-main"),L(g,"class","btn btn-main"),L(d,"class","nav-item"),L(u,"class","navbar-nav nav-left svelte-lu0ryt"),L(a,"class","collapse navbar-collapse"),L(a,"id","navbarNav"),L(r,"class","container-fluid"),L(n,"class","navbar navbar-expand-lg navbar-light svelte-lu0ryt")},m(t,i){$(t,n,i),h(n,r),at(o,r,null),h(r,l),h(r,s),h(r,c),h(r,a),h(a,u),h(u,d),h(d,f),h(d,m),h(d,p),h(d,v),h(d,g),b=!0,x||(_=[T(f,"click",e[1]),T(p,"click",Ot),T(g,"click",e[0])],x=!0)},p:t,i(t){b||(nt(o.$$.fragment,t),b=!0)},o(t){rt(o.$$.fragment,t),b=!1},d(t){t&&y(n),ut(o),x=!1,i(_)}}}function Ot(){}function Rt(t){let e=null;return[function(){e&&!e.closed?(Dt(),e.focus()):e=window.open("/preview")},function(){Dt()}]}class Bt extends mt{constructor(t){super(),ft(this,t,Rt,Pt,l,{})}}function Ut(t){const e=t-1;return e*e*e+1}function Yt(t,{delay:n=0,duration:r=400,easing:i=e}={}){const o=+getComputedStyle(t).opacity;return{delay:n,duration:r,easing:i,css:t=>"opacity: "+t*o}}function Ft(t,{delay:e=0,duration:n=400,easing:r=Ut,x:i=0,y:o=0,opacity:l=0}={}){const s=getComputedStyle(t),c=+s.opacity,a="none"===s.transform?"":s.transform,u=c*(1-l);return{delay:e,duration:n,easing:r,css:(t,e)=>`\n\t\t\ttransform: ${a} translate(${(1-t)*i}px, ${(1-t)*o}px);\n\t\t\topacity: ${c-u*e}`}}var Gt=vt(null);function Wt(t={}){return"BODY"==t.tagName}function Vt(t,e){const n=t.getBoundingClientRect(),r=e-n.top-n.height/2;let i="";return r<10&&r>-10?i="inside":r<-10?i="prepend":r>10&&(i="append"),i}function Jt(t){t.removeAttribute("editor-insert-preview")}function Kt(t){t.dataTransfer.setData("text/plain",t.target.dataset.elementId),t.currentTarget.style.opacity="0.5"}function Qt(t){const e=parseInt(t.dataTransfer.getData("text"));let n=t.target;Jt(n),console.log(n.tagName),t.dataTransfer.clearData();const r=Wt(n)?"inside":Vt(n,t.clientY);Gt.subscribe((t=>{!function(t,e,n="inside"){switch(n){case"inside":e.appendChild(t);break;case"prepend":e.parentElement.insertBefore(t,e);break;case"append":e.parentElement.insertBefore(t,e.nextElementSibling)}}(function(t){if(t)return(new DOMParser).parseFromString(t,"text/html").body.firstElementChild;return document.createElement("span")}(t.get(e)?.template),n,r)}))(),t.dataTransfer.clearData()}function Xt(t){t.target.style.removeProperty("opacity")}function Zt(t,e,n){const r=t.slice();return r[5]=e[n],r}function te(t){let e,n,r=t[1],i=[];for(let e=0;e<r.length;e+=1)i[e]=ee(Zt(t,r,e));const o=t=>rt(i[t],1,1,(()=>{i[t]=null}));return{c(){e=w("div");for(let t=0;t<i.length;t+=1)i[t].c();L(e,"class","elements svelte-169vmu3")},m(t,r){$(t,e,r);for(let t=0;t<i.length;t+=1)i[t].m(e,null);n=!0},p(t,n){if(2&n){let l;for(r=t[1],l=0;l<r.length;l+=1){const o=Zt(t,r,l);i[l]?(i[l].p(o,n),nt(i[l],1)):(i[l]=ee(o),i[l].c(),nt(i[l],1),i[l].m(e,null))}for(tt(),l=r.length;l<i.length;l+=1)o(l);et()}},i(t){if(!n){for(let t=0;t<r.length;t+=1)nt(i[t]);n=!0}},o(t){i=i.filter(Boolean);for(let t=0;t<i.length;t+=1)rt(i[t]);n=!1},d(t){t&&y(e),x(i,t)}}}function ee(t){let e,n,r,o,l,s,c,u,d,f,m,p,v,g,b,x=t[5].display_name+"";return{c(){e=w("div"),n=w("div"),r=w("div"),o=w("i"),s=k(),c=w("div"),u=w("span"),d=_(x),f=k(),L(o,"class",l=a(t[5].icon)+" svelte-169vmu3"),L(r,"class","image mb-1 svelte-169vmu3"),L(c,"class","name svelte-169vmu3"),L(n,"class","text-center py-4"),L(e,"class","card col-6 svelte-169vmu3"),L(e,"draggable","true"),L(e,"data-element-id",m=t[5].id)},m(t,i){$(t,e,i),h(e,n),h(n,r),h(r,o),h(n,s),h(n,c),h(c,u),h(u,d),h(e,f),v=!0,g||(b=[T(e,"dragstart",Kt),T(e,"dragend",Xt)],g=!0)},p(t,n){(!v||2&n&&l!==(l=a(t[5].icon)+" svelte-169vmu3"))&&L(o,"class",l),(!v||2&n)&&x!==(x=t[5].display_name+"")&&S(d,x),(!v||2&n&&m!==(m=t[5].id))&&L(e,"data-element-id",m)},i(t){v||(Y((()=>{p||(p=st(e,Yt,{duration:100},!0)),p.run(1)})),v=!0)},o(t){p||(p=st(e,Yt,{duration:100},!1)),p.run(0),v=!1},d(t){t&&y(e),t&&p&&p.end(),g=!1,i(b)}}}function ne(t){let e,n,r,i,o,l,s,c=t[1].length&&te(t);return{c(){e=w("div"),n=w("input"),r=k(),c&&c.c(),i=E(),L(n,"type","text"),L(n,"class","form-control search-bar svelte-169vmu3"),L(n,"placeholder","Search elements"),L(e,"class","search-holder svelte-169vmu3")},m(a,u){$(a,e,u),h(e,n),z(n,t[0]),$(a,r,u),c&&c.m(a,u),$(a,i,u),o=!0,l||(s=T(n,"input",t[2]),l=!0)},p(t,[e]){1&e&&n.value!==t[0]&&z(n,t[0]),t[1].length?c?(c.p(t,e),2&e&&nt(c,1)):(c=te(t),c.c(),nt(c,1),c.m(i.parentNode,i)):c&&(tt(),rt(c,1,1,(()=>{c=null})),et())},i(t){o||(nt(c),o=!0)},o(t){rt(c),o=!1},d(t){t&&y(e),t&&y(r),c&&c.d(t),t&&y(i),l=!1,s()}}}function re(t,e,n){let r;const i=[{id:1,name:"section",display_name:"Section",icon:"bi bi-square",template:"<section builder-section></section>"},{id:2,name:"heading",display_name:"Heading",icon:"bi bi-fonts",template:"<h1>Hello</h1>"},{id:3,name:"text",display_name:"Text",icon:"bi bi-paragraph",template:"<p>Text</p>"},{id:4,name:"grid",display_name:"Grid",icon:"bi bi-columns",template:"<div editor-grid></div>"}],o=new Map;i.forEach((t=>{o.set(t.id,t)})),Gt.set(o);let l="";return t.$$.update=()=>{1&t.$$.dirty&&n(1,r=i.filter((t=>t.display_name.toLowerCase().match(l.toLowerCase()))))},[l,r,function(){l=this.value,n(0,l)}]}class ie extends mt{constructor(t){super(),ft(this,t,re,ne,l,{})}}function oe(e){let n;return{c(){n=w("div"),n.innerHTML='<div class="col-md-12"><h6 class="border-bottom pb-3 mb-3">General</h6> \n        <div class="form-group"><label for="text-input" class="mb-2">Text</label> \n            <input type="text" id="text-input" class="form-control text svelte-7j4jym"/></div></div>',L(n,"class","styling-tab svelte-7j4jym")},m(t,e){$(t,n,e)},p:t,i:t,o:t,d(t){t&&y(n)}}}class le extends mt{constructor(t){super(),ft(this,t,null,oe,l,{})}}function se(t){let e,n,r,i,o;return n=new le({}),{c(){e=w("section"),ct(n.$$.fragment),L(e,"class","h-100")},m(t,r){$(t,e,r),at(n,e,null),o=!0},i(t){o||(nt(n.$$.fragment,t),Y((()=>{i&&i.end(1),r||(r=ot(e,Ft,{x:200})),r.start()})),o=!0)},o(t){rt(n.$$.fragment,t),r&&r.invalidate(),i=lt(e,Ft,{x:200,duration:0}),o=!1},d(t){t&&y(e),ut(n),t&&i&&i.end()}}}function ce(t){let e,n,r,i,o;return n=new ie({}),{c(){e=w("section"),ct(n.$$.fragment),L(e,"class","h-100")},m(t,r){$(t,e,r),at(n,e,null),o=!0},i(t){o||(nt(n.$$.fragment,t),Y((()=>{i&&i.end(1),r||(r=ot(e,Ft,{x:-200})),r.start()})),o=!0)},o(t){rt(n.$$.fragment,t),r&&r.invalidate(),i=lt(e,Ft,{x:-200,duration:0}),o=!1},d(t){t&&y(e),ut(n),t&&i&&i.end()}}}function ae(t){let e,n,r,o,l,s,c,a,u,d,f,m,p,v;const g=[ce,se],b=[];function x(t,e){return t[1]?0:1}return u=x(t),d=b[u]=g[u](t),{c(){e=w("div"),n=w("ul"),r=w("li"),o=w("span"),o.textContent="Design",l=k(),s=w("li"),c=w("span"),c.textContent="Styles",a=k(),d.c(),f=E(),L(o,"class","nav-link svelte-yvpr94"),C(o,"active",t[0]),L(r,"class","nav-item col-6"),L(c,"class","nav-link svelte-yvpr94"),C(c,"active",!t[0]),L(s,"class","nav-item col-6"),L(n,"class","nav nav-tabs svelte-yvpr94"),L(e,"class","tabs")},m(i,d){$(i,e,d),h(e,n),h(n,r),h(r,o),h(n,l),h(n,s),h(s,c),$(i,a,d),b[u].m(i,d),$(i,f,d),m=!0,p||(v=[T(r,"click",t[2]),T(s,"click",t[3])],p=!0)},p(t,[e]){1&e&&C(o,"active",t[0]),1&e&&C(c,"active",!t[0]);let n=u;u=x(t),u!==n&&(tt(),rt(b[n],1,1,(()=>{b[n]=null})),et(),d=b[u],d||(d=b[u]=g[u](t),d.c()),nt(d,1),d.m(f.parentNode,f))},i(t){m||(nt(d),m=!0)},o(t){rt(d),m=!1},d(t){t&&y(e),t&&y(a),b[u].d(t),t&&y(f),p=!1,i(v)}}}function ue(t,e,n){let r,i=!0;return t.$$.update=()=>{1&t.$$.dirty&&n(1,r=i)},[i,r,function(){i||n(0,i=!0)},function(){i&&n(0,i=!1)}]}class de extends mt{constructor(t){super(),ft(this,t,ue,ae,l,{})}}function fe(t,e,n){const r=t.slice();return r[9]=e[n],r}function me(t){let e,n=t[2],r=[];for(let e=0;e<n.length;e+=1)r[e]=pe(fe(t,n,e));return{c(){for(let t=0;t<r.length;t+=1)r[t].c();e=E()},m(t,n){for(let e=0;e<r.length;e+=1)r[e].m(t,n);$(t,e,n)},p(t,i){if(14&i){let o;for(n=t[2],o=0;o<n.length;o+=1){const l=fe(t,n,o);r[o]?r[o].p(l,i):(r[o]=pe(l),r[o].c(),r[o].m(e.parentNode,e))}for(;o<r.length;o+=1)r[o].d(1);r.length=n.length}},d(t){x(r,t),t&&y(e)}}}function pe(t){let e,n,r,o,l,s,c=t[9].el.tagName+"";function a(){return t[4](t[9])}function u(){return t[5](t[9])}function d(){return t[6](t[9])}return{c(){e=w("div"),n=w("span"),r=_(c),o=k(),L(e,"class","div col-12 w-75 border element svelte-1nmg79i"),A(e,"cursor","pointer"),A(e,"padding","10px"),A(e,"margin","10px "+t[9].spacing+"px"),C(e,"active",t[1]==t[9].el)},m(t,i){$(t,e,i),h(e,n),h(n,r),h(e,o),l||(s=[T(e,"mouseenter",a),T(e,"click",u),T(e,"mouseleave",d)],l=!0)},p(n,r){t=n,6&r&&C(e,"active",t[1]==t[9].el)},d(t){t&&y(e),l=!1,i(s)}}}function ve(e){let n,r=e[0]&&me(e);return{c(){n=w("div"),r&&r.c(),L(n,"class","layers-tab svelte-1nmg79i")},m(t,e){$(t,n,e),r&&r.m(n,null)},p(t,[e]){t[0]?r?r.p(t,e):(r=me(t),r.c(),r.m(n,null)):r&&(r.d(1),r=null)},i:t,o:t,d(t){t&&y(n),r&&r.d()}}}function ge(t,e,n=""){if(!1===e(t,n))return;let r=t.firstElementChild;for(;r;)ge(r,e,n+"---"),r=r.nextElementSibling}function be(t,e,n){let r,i,o;c(t,Tt,(t=>n(7,r=t))),c(t,_t,(t=>n(8,i=t))),c(t,kt,(t=>n(1,o=t)));let l=!1;const s=[];function a(t){o&&o.removeAttribute("editor-selected"),o===t?u(kt,o=null,o):(u(kt,o=t,o),o.setAttribute("editor-selected",""))}r&&(ge(i.body,((t,e)=>{e&&s.push({el:t,spacing:e.length})})),l=!0);return[l,o,s,a,t=>{t.el.setAttribute("editor-outline","")},t=>a(t.el),t=>{t.el.removeAttribute("editor-outline")}]}class he extends mt{constructor(t){super(),ft(this,t,be,ve,l,{})}}function $e(){return!!localStorage.getItem("dark-mode")}function ye(){let t=document.querySelector("link[rel~='icon']");document.body.classList.add("dark-mode"),localStorage.setItem("dark-mode",!0),t.href="/favicons/favicon-dark.ico"}function xe(){let t=document.querySelector("link[rel~='icon']");document.body.classList.remove("dark-mode"),localStorage.removeItem("dark-mode"),t.href="/favicons/favicon.ico"}function we(){$e()?xe():ye()}function _e(e){let n,r,o,l,s,c,a,u,d,f,m;return{c(){n=w("section"),r=w("div"),o=w("div"),o.innerHTML='<label for="toggle">Dark mode</label>',l=k(),s=w("div"),c=w("div"),a=w("input"),u=k(),d=w("label"),L(o,"class","col-6"),L(a,"type","checkbox"),L(a,"id","toggle"),L(a,"class","svelte-2vqqjm"),L(d,"for","toggle"),L(d,"class","svelte-2vqqjm"),L(c,"class","toggle svelte-2vqqjm"),L(s,"class","col-6"),L(r,"class","form-group row"),L(n,"class","svelte-2vqqjm")},m(t,i){$(t,n,i),h(n,r),h(r,o),h(r,l),h(r,s),h(s,c),h(c,a),a.checked=e[0],h(c,u),h(c,d),f||(m=[T(a,"change",e[1]),T(a,"input",we)],f=!0)},p(t,[e]){1&e&&(a.checked=t[0])},i:t,o:t,d(t){t&&y(n),f=!1,i(m)}}}function ke(t,e,n){let r=$e();return[r,function(){r=this.checked,n(0,r)}]}class Ee extends mt{constructor(t){super(),ft(this,t,ke,_e,l,{})}}function Te(e){let n,r,i;return r=new Ee({}),{c(){n=w("section"),ct(r.$$.fragment),L(n,"class","setting-tab")},m(t,e){$(t,n,e),at(r,n,null),i=!0},p:t,i(t){i||(nt(r.$$.fragment,t),i=!0)},o(t){rt(r.$$.fragment,t),i=!1},d(t){t&&y(n),ut(r)}}}class Le extends mt{constructor(t){super(),ft(this,t,null,Te,l,{})}}function Se(t){let e,n,r,i;return n=new Le({}),{c(){e=w("section"),ct(n.$$.fragment),L(e,"class","h-100")},m(t,r){$(t,e,r),at(n,e,null),i=!0},i(t){i||(nt(n.$$.fragment,t),r||Y((()=>{r=ot(e,Yt,{duration:250}),r.start()})),i=!0)},o(t){rt(n.$$.fragment,t),i=!1},d(t){t&&y(e),ut(n)}}}function ze(t){let e,n,r,i;return n=new he({}),{c(){e=w("section"),ct(n.$$.fragment),L(e,"class","h-100")},m(t,r){$(t,e,r),at(n,e,null),i=!0},i(t){i||(nt(n.$$.fragment,t),r||Y((()=>{r=ot(e,Yt,{duration:250}),r.start()})),i=!0)},o(t){rt(n.$$.fragment,t),i=!1},d(t){t&&y(e),ut(n)}}}function Ae(t){let e,n,r,i;return n=new de({}),{c(){e=w("section"),ct(n.$$.fragment),L(e,"class","h-100")},m(t,r){$(t,e,r),at(n,e,null),i=!0},i(t){i||(nt(n.$$.fragment,t),r||Y((()=>{r=ot(e,Yt,{duration:250}),r.start()})),i=!0)},o(t){rt(n.$$.fragment,t),i=!1},d(t){t&&y(e),ut(n)}}}function Ce(t){let e,n,r,i;const o=[Ae,ze,Se],l=[];function s(t,e){return t[0]==bt?0:t[0]==ht?1:t[0]==$t?2:-1}return~(n=s(t))&&(r=l[n]=o[n](t)),{c(){e=w("div"),r&&r.c(),L(e,"class","sidenav svelte-1m7zlni")},m(t,r){$(t,e,r),~n&&l[n].m(e,null),i=!0},p(t,[i]){let c=n;n=s(t),n!==c&&(r&&(tt(),rt(l[c],1,1,(()=>{l[c]=null})),et()),~n?(r=l[n],r||(r=l[n]=o[n](t),r.c()),nt(r,1),r.m(e,null)):r=null)},i(t){i||(nt(r),i=!0)},o(t){rt(r),i=!1},d(t){t&&y(e),~n&&l[n].d()}}}function De(t,e,n){let r;return c(t,gt,(t=>n(0,r=t))),[r]}class Ne extends mt{constructor(t){super(),ft(this,t,De,Ce,l,{})}}function He(e){let n,r,i,o,l,s;return{c(){n=w("div"),r=w("div"),i=w("iframe"),L(i,"title","editor-preview"),i.src!==(o="/preview/playground.html")&&L(i,"src","/preview/playground.html"),L(i,"frameborder","0"),L(i,"allowtransparency","true"),L(i,"class","preview-window svelte-23ti04"),L(r,"class","preview-main svelte-23ti04"),L(n,"class","col preview-holder svelte-23ti04")},m(t,o){$(t,n,o),h(n,r),h(r,i),l||(s=d(e[0].call(null,i)),l=!0)},p:t,i:t,o:t,d(t){t&&y(n),l=!1,s()}}}function Me(t,e,n){let r;return c(t,_t,(t=>n(1,r=t))),[function(t){let e=setInterval((function(){let n=t.contentDocument||t.contentWindow.document;["complete","interactive"].includes(n.readyState)&&(u(_t,r=t.contentDocument,r),r.body.addEventListener("dragover",(t=>function(t){t.preventDefault();let e=t.target;!function(t,e="inside"){t.setAttribute("editor-insert-preview",e)}(e,Wt(e)?"inside":Vt(e,t.clientY))}(t))),r.body.addEventListener("drop",(t=>Qt(t))),r.body.addEventListener("dragenter",(t=>function(t){t.target.tagName}(t))),r.body.addEventListener("dragleave",(t=>function(t){Jt(t.target)}(t))),clearInterval(e),setTimeout((()=>{var t;t="Hi There 😃...",console.log(`%c${t}`,"color: #df6b42;\n        font-family: system-ui;\n        font-size: 15px;\n        -webkit-text-stroke: 0.5px black;\n        font-weight: bold")}),1e3))}),2e3)}]}class je extends mt{constructor(t){super(),ft(this,t,Me,He,l,{})}}function qe(e){let n,r,i,o,l,s,c,a,u,d,f,m;return i=new wt({}),s=new Bt({}),u=new Ne({}),f=new je({}),{c(){n=w("div"),r=w("div"),ct(i.$$.fragment),o=k(),l=w("div"),ct(s.$$.fragment),c=k(),a=w("div"),ct(u.$$.fragment),d=k(),ct(f.$$.fragment),L(a,"class","d-flex wrapper svelte-hrg01p"),L(l,"class","col"),L(r,"class","d-flex"),L(n,"class","main svelte-hrg01p")},m(t,e){$(t,n,e),h(n,r),at(i,r,null),h(r,o),h(r,l),at(s,l,null),h(l,c),h(l,a),at(u,a,null),h(a,d),at(f,a,null),m=!0},p:t,i(t){m||(nt(i.$$.fragment,t),nt(s.$$.fragment,t),nt(u.$$.fragment,t),nt(f.$$.fragment,t),m=!0)},o(t){rt(i.$$.fragment,t),rt(s.$$.fragment,t),rt(u.$$.fragment,t),rt(f.$$.fragment,t),m=!1},d(t){t&&y(n),ut(i),ut(s),ut(u),ut(f)}}}function Ie(t){return $e()?ye():xe(),Lt(),[]}class Pe extends mt{constructor(t){super(),ft(this,t,Ie,qe,l,{})}}function Oe(e){let n,r;return n=new Pe({}),{c(){ct(n.$$.fragment)},m(t,e){at(n,t,e),r=!0},p:t,i(t){r||(nt(n.$$.fragment,t),r=!0)},o(t){rt(n.$$.fragment,t),r=!1},d(t){ut(n,t)}}}return new class extends mt{constructor(t){super(),ft(this,t,null,Oe,l,{})}}({target:document.body})}();
//# sourceMappingURL=app.js.map
