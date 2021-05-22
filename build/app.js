var app=function(){"use strict";function t(){}const e=t=>t;function n(t){return t()}function r(){return Object.create(null)}function l(t){t.forEach(n)}function i(t){return"function"==typeof t}function o(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function s(e,...n){if(null==e)return t;const r=e.subscribe(...n);return r.unsubscribe?()=>r.unsubscribe():r}function c(t,e,n){t.$$.on_destroy.push(s(e,n))}function a(t){return null==t?"":t}function u(t,e,n=e){return t.set(n),e}function d(e){return e&&i(e.destroy)?e.destroy:t}const f="undefined"!=typeof window;let m=f?()=>window.performance.now():()=>Date.now(),p=f?t=>requestAnimationFrame(t):t;const v=new Set;function g(t){v.forEach((e=>{e.c(t)||(v.delete(e),e.f())})),0!==v.size&&p(g)}function b(t){let e;return 0===v.size&&p(g),{promise:new Promise((n=>{v.add(e={c:t,f:n})})),abort(){v.delete(e)}}}function h(t,e){t.appendChild(e)}function $(t,e,n){t.insertBefore(e,n||null)}function y(t){t.parentNode.removeChild(t)}function x(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function w(t){return document.createElement(t)}function _(t){return document.createTextNode(t)}function k(){return _(" ")}function E(){return _("")}function T(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function L(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function z(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function S(t,e){t.value=null==e?"":e}function C(t,e,n,r){t.style.setProperty(e,n,r?"important":"")}function A(t,e,n){t.classList[n?"add":"remove"](e)}const D=new Set;let j,N=0;function q(t,e,n,r,l,i,o,s=0){const c=16.666/r;let a="{\n";for(let t=0;t<=1;t+=c){const r=e+(n-e)*i(t);a+=100*t+`%{${o(r,1-r)}}\n`}const u=a+`100% {${o(n,1-n)}}\n}`,d=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(u)}_${s}`,f=t.ownerDocument;D.add(f);const m=f.__svelte_stylesheet||(f.__svelte_stylesheet=f.head.appendChild(w("style")).sheet),p=f.__svelte_rules||(f.__svelte_rules={});p[d]||(p[d]=!0,m.insertRule(`@keyframes ${d} ${u}`,m.cssRules.length));const v=t.style.animation||"";return t.style.animation=`${v?`${v}, `:""}${d} ${r}ms linear ${l}ms 1 both`,N+=1,d}function M(t,e){const n=(t.style.animation||"").split(", "),r=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),l=n.length-r.length;l&&(t.style.animation=r.join(", "),N-=l,N||p((()=>{N||(D.forEach((t=>{const e=t.__svelte_stylesheet;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.__svelte_rules={}})),D.clear())})))}function H(t){j=t}const O=[],I=[],P=[],B=[],R=Promise.resolve();let U=!1;function Y(t){P.push(t)}let F=!1;const G=new Set;function W(){if(!F){F=!0;do{for(let t=0;t<O.length;t+=1){const e=O[t];H(e),J(e.$$)}for(H(null),O.length=0;I.length;)I.pop()();for(let t=0;t<P.length;t+=1){const e=P[t];G.has(e)||(G.add(e),e())}P.length=0}while(O.length);for(;B.length;)B.pop()();U=!1,F=!1,G.clear()}}function J(t){if(null!==t.fragment){t.update(),l(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(Y)}}let K;function Q(){return K||(K=Promise.resolve(),K.then((()=>{K=null}))),K}function V(t,e,n){t.dispatchEvent(function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(`${e?"intro":"outro"}${n}`))}const X=new Set;let Z;function tt(){Z={r:0,c:[],p:Z}}function et(){Z.r||l(Z.c),Z=Z.p}function nt(t,e){t&&t.i&&(X.delete(t),t.i(e))}function rt(t,e,n,r){if(t&&t.o){if(X.has(t))return;X.add(t),Z.c.push((()=>{X.delete(t),r&&(n&&t.d(1),r())})),t.o(e)}}const lt={duration:0};function it(n,r,l){let o,s,c=r(n,l),a=!1,u=0;function d(){o&&M(n,o)}function f(){const{delay:r=0,duration:l=300,easing:i=e,tick:f=t,css:p}=c||lt;p&&(o=q(n,0,1,l,r,i,p,u++)),f(0,1);const v=m()+r,g=v+l;s&&s.abort(),a=!0,Y((()=>V(n,!0,"start"))),s=b((t=>{if(a){if(t>=g)return f(1,0),V(n,!0,"end"),d(),a=!1;if(t>=v){const e=i((t-v)/l);f(e,1-e)}}return a}))}let p=!1;return{start(){p||(M(n),i(c)?(c=c(),Q().then(f)):f())},invalidate(){p=!1},end(){a&&(d(),a=!1)}}}function ot(n,r,o){let s,c=r(n,o),a=!0;const u=Z;function d(){const{delay:r=0,duration:i=300,easing:o=e,tick:d=t,css:f}=c||lt;f&&(s=q(n,1,0,i,r,o,f));const p=m()+r,v=p+i;Y((()=>V(n,!1,"start"))),b((t=>{if(a){if(t>=v)return d(0,1),V(n,!1,"end"),--u.r||l(u.c),!1;if(t>=p){const e=o((t-p)/i);d(1-e,e)}}return a}))}return u.r+=1,i(c)?Q().then((()=>{c=c(),d()})):d(),{end(t){t&&c.tick&&c.tick(1,0),a&&(s&&M(n,s),a=!1)}}}function st(n,r,o,s){let c=r(n,o),a=s?0:1,u=null,d=null,f=null;function p(){f&&M(n,f)}function v(t,e){const n=t.b-a;return e*=Math.abs(n),{a:a,b:t.b,d:n,duration:e,start:t.start,end:t.start+e,group:t.group}}function g(r){const{delay:i=0,duration:o=300,easing:s=e,tick:g=t,css:h}=c||lt,$={start:m()+i,b:r};r||($.group=Z,Z.r+=1),u||d?d=$:(h&&(p(),f=q(n,a,r,o,i,s,h)),r&&g(0,1),u=v($,o),Y((()=>V(n,r,"start"))),b((t=>{if(d&&t>d.start&&(u=v(d,o),d=null,V(n,u.b,"start"),h&&(p(),f=q(n,a,u.b,u.duration,0,s,c.css))),u)if(t>=u.end)g(a=u.b,1-a),V(n,u.b,"end"),d||(u.b?p():--u.group.r||l(u.group.c)),u=null;else if(t>=u.start){const e=t-u.start;a=u.a+u.d*s(e/u.duration),g(a,1-a)}return!(!u&&!d)})))}return{run(t){i(c)?Q().then((()=>{c=c(),g(t)})):g(t)},end(){p(),u=d=null}}}const ct="undefined"!=typeof window?window:"undefined"!=typeof globalThis?globalThis:global;function at(t){t&&t.c()}function ut(t,e,r){const{fragment:o,on_mount:s,on_destroy:c,after_update:a}=t.$$;o&&o.m(e,r),Y((()=>{const e=s.map(n).filter(i);c?c.push(...e):l(e),t.$$.on_mount=[]})),a.forEach(Y)}function dt(t,e){const n=t.$$;null!==n.fragment&&(l(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function ft(t,e){-1===t.$$.dirty[0]&&(O.push(t),U||(U=!0,R.then(W)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function mt(e,n,i,o,s,c,a=[-1]){const u=j;H(e);const d=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:s,bound:r(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:r(),dirty:a,skip_bound:!1};let f=!1;if(d.ctx=i?i(e,n.props||{},((t,n,...r)=>{const l=r.length?r[0]:n;return d.ctx&&s(d.ctx[t],d.ctx[t]=l)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](l),f&&ft(e,t)),n})):[],d.update(),f=!0,l(d.before_update),d.fragment=!!o&&o(d.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);d.fragment&&d.fragment.l(t),t.forEach(y)}else d.fragment&&d.fragment.c();n.intro&&nt(e.$$.fragment),ut(e,n.target,n.anchor),W()}H(u)}class pt{$destroy(){dt(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const vt=[];function gt(e,n=t){let r;const l=[];function i(t){if(o(e,t)&&(e=t,r)){const t=!vt.length;for(let t=0;t<l.length;t+=1){const n=l[t];n[1](),vt.push(n,e)}if(t){for(let t=0;t<vt.length;t+=2)vt[t][0](vt[t+1]);vt.length=0}}}return{set:i,update:function(t){i(t(e))},subscribe:function(o,s=t){const c=[o,s];return l.push(c),1===l.length&&(r=n(i)||t),o(e),()=>{const t=l.indexOf(c);-1!==t&&l.splice(t,1),0===l.length&&(r(),r=null)}}}}const bt=gt(1),ht=1,$t=2,yt=3;function xt(e){let n,r,i,o,s,c,a,u,d,f,m,p,v;return{c(){n=w("div"),r=w("div"),r.innerHTML='<a href="/" class="svelte-12zrox2"><i class="bi bi-layout-text-window-reverse svelte-12zrox2"></i></a>',i=k(),o=w("div"),s=w("div"),s.innerHTML='<i class="bi bi-front svelte-12zrox2"></i>',c=k(),a=w("div"),a.innerHTML='<i class="bi bi-layers svelte-12zrox2"></i>',u=k(),d=w("div"),d.innerHTML='<i class="bi bi-gear svelte-12zrox2"></i>',f=k(),m=w("div"),m.innerHTML='<div class="logo svelte-12zrox2"><i class="bi bi-person-circle svelte-12zrox2" title="About me"></i></div>',L(r,"class","logo circle tilted svelte-12zrox2"),L(s,"class","logo my-4 svelte-12zrox2"),L(s,"title","Elements"),A(s,"active",e[0]==ht),L(a,"class","logo my-4 svelte-12zrox2"),L(a,"title","Layers"),A(a,"active",e[0]==$t),L(d,"class","logo my-4 svelte-12zrox2"),L(d,"title","Settings"),A(d,"active",e[0]==yt),L(o,"class","drawer svelte-12zrox2"),L(m,"class","bottom-drawer svelte-12zrox2"),L(n,"class","activity-bar svelte-12zrox2")},m(t,l){$(t,n,l),h(n,r),h(n,i),h(n,o),h(o,s),h(o,c),h(o,a),h(o,u),h(o,d),h(n,f),h(n,m),p||(v=[T(s,"click",e[2]),T(a,"click",e[3]),T(d,"click",e[4])],p=!0)},p(t,[e]){1&e&&A(s,"active",t[0]==ht),1&e&&A(a,"active",t[0]==$t),1&e&&A(d,"active",t[0]==yt)},i:t,o:t,d(t){t&&y(n),p=!1,l(v)}}}function wt(t,e,n){let r;function l(t){u(bt,r=t,r)}c(t,bt,(t=>n(0,r=t)));return[r,l,()=>l(ht),()=>l($t),()=>l(yt)]}class _t extends pt{constructor(t){super(),mt(this,t,wt,xt,o,{})}}const{document:kt}=ct;function Et(t){let e,n,r;return{c(){e=w("input"),L(e,"type","text"),L(e,"class","project-title-input svelte-1bzbw03")},m(l,i){$(l,e,i),S(e,t[0]),n||(r=[T(e,"input",t[8]),T(e,"blur",t[7]),T(e,"keyup",t[6]),d(zt.call(null,e))],n=!0)},p(t,n){1&n&&e.value!==t[0]&&S(e,t[0])},d(t){t&&y(e),n=!1,l(r)}}}function Tt(t){let e,n,r,l;return{c(){e=w("span"),n=_(t[3]),L(e,"class","navbar-brand project-title-display svelte-1bzbw03"),L(e,"role","button")},m(i,o){$(i,e,o),h(e,n),r||(l=T(e,"click",t[5]),r=!0)},p(t,e){8&e&&z(n,t[3])},d(t){t&&y(e),r=!1,l()}}}function Lt(e){let n,r,l;function i(t,e){return t[2]?Et:Tt}kt.title=n="\r\n    "+(e[1].length&&"Untitled"!=e[1]?e[3]+" | ":"")+" "+e[4]+"\r\n  ";let o=i(e),s=o(e);return{c(){r=k(),s.c(),l=E()},m(t,e){$(t,r,e),s.m(t,e),$(t,l,e)},p(t,[e]){26&e&&n!==(n="\r\n    "+(t[1].length&&"Untitled"!=t[1]?t[3]+" | ":"")+" "+t[4]+"\r\n  ")&&(kt.title=n),o===(o=i(t))&&s?s.p(t,e):(s.d(1),s=o(t),s&&(s.c(),s.m(l.parentNode,l)))},i:t,o:t,d(t){t&&y(r),s.d(t),t&&y(l)}}}function zt(t){t.select(),t.focus()}function St(t,e,n){let r,l=document.title,i="Untitled",o=i,s=!1;function c(){n(2,s=!1),i.length||n(0,i="Untitled"),n(1,o=i)}return t.$$.update=()=>{1&t.$$.dirty&&n(3,r=i.length>18?i.substring(0,15)+"...":i)},[i,o,s,r,l,function(){n(2,s=!0)},function(t){if("Enter"==t.code)return t.preventDefault(),c()},c,function(){i=this.value,n(0,i)}]}class Ct extends pt{constructor(t){super(),mt(this,t,St,Lt,o,{})}}function At(e){let n,r,l,i,o,s,c,a;return l=new Ct({}),{c(){n=w("nav"),r=w("div"),at(l.$$.fragment),i=k(),o=w("button"),o.innerHTML='<span class="navbar-toggler-icon"></span>',s=k(),c=w("div"),c.innerHTML='<ul class="navbar-nav nav-left svelte-lu0ryt"><li class="nav-item"><button class="btn btn-main"><i class="bi bi-download"></i>  <span>Download</span></button> \n          <button class="btn btn-main"><i class="bi bi-eye"></i>  <span>Preview</span></button></li></ul>',L(o,"class","navbar-toggler"),L(o,"type","button"),L(o,"data-bs-toggle","collapse"),L(o,"data-bs-target","#navbarNav"),L(o,"aria-controls","navbarNav"),L(o,"aria-expanded","false"),L(o,"aria-label","Toggle navigation"),L(c,"class","collapse navbar-collapse"),L(c,"id","navbarNav"),L(r,"class","container-fluid"),L(n,"class","navbar navbar-expand-lg navbar-light svelte-lu0ryt")},m(t,e){$(t,n,e),h(n,r),ut(l,r,null),h(r,i),h(r,o),h(r,s),h(r,c),a=!0},p:t,i(t){a||(nt(l.$$.fragment,t),a=!0)},o(t){rt(l.$$.fragment,t),a=!1},d(t){t&&y(n),dt(l)}}}class Dt extends pt{constructor(t){super(),mt(this,t,null,At,o,{})}}function jt(t){const e=t-1;return e*e*e+1}function Nt(t,{delay:n=0,duration:r=400,easing:l=e}={}){const i=+getComputedStyle(t).opacity;return{delay:n,duration:r,easing:l,css:t=>"opacity: "+t*i}}function qt(t,{delay:e=0,duration:n=400,easing:r=jt,x:l=0,y:i=0,opacity:o=0}={}){const s=getComputedStyle(t),c=+s.opacity,a="none"===s.transform?"":s.transform,u=c*(1-o);return{delay:e,duration:n,easing:r,css:(t,e)=>`\n\t\t\ttransform: ${a} translate(${(1-t)*l}px, ${(1-t)*i}px);\n\t\t\topacity: ${c-u*e}`}}var Mt=gt(null);function Ht(t={}){return"BODY"==t.tagName}function Ot(t,e){const n=t.getBoundingClientRect(),r=e-n.top-n.height/2;let l="";return r<10&&r>-10?l="inside":r<-10?l="prepend":r>10&&(l="append"),l}function It(t){t.removeAttribute("editor-insert-preview")}function Pt(t){t.dataTransfer.setData("text/plain",t.target.dataset.elementId),t.currentTarget.style.opacity="0.5"}function Bt(t){const e=parseInt(t.dataTransfer.getData("text"));let n=t.target;It(n),console.log(n.tagName),t.dataTransfer.clearData();const r=Ht(n)?"inside":Ot(n,t.clientY);Mt.subscribe((t=>{!function(t,e,n="inside"){switch(n){case"inside":e.appendChild(t);break;case"prepend":e.parentElement.insertBefore(t,e);break;case"append":e.parentElement.insertBefore(t,e.nextElementSibling)}}(function(t){if(t)return(new DOMParser).parseFromString(t,"text/html").body.firstElementChild;return document.createElement("span")}(t.get(e)?.template),n,r)}))(),t.dataTransfer.clearData()}function Rt(t){t.target.style.removeProperty("opacity")}function Ut(t,e,n){const r=t.slice();return r[5]=e[n],r}function Yt(t){let e,n,r=t[1],l=[];for(let e=0;e<r.length;e+=1)l[e]=Ft(Ut(t,r,e));const i=t=>rt(l[t],1,1,(()=>{l[t]=null}));return{c(){e=w("div");for(let t=0;t<l.length;t+=1)l[t].c();L(e,"class","elements svelte-169vmu3")},m(t,r){$(t,e,r);for(let t=0;t<l.length;t+=1)l[t].m(e,null);n=!0},p(t,n){if(2&n){let o;for(r=t[1],o=0;o<r.length;o+=1){const i=Ut(t,r,o);l[o]?(l[o].p(i,n),nt(l[o],1)):(l[o]=Ft(i),l[o].c(),nt(l[o],1),l[o].m(e,null))}for(tt(),o=r.length;o<l.length;o+=1)i(o);et()}},i(t){if(!n){for(let t=0;t<r.length;t+=1)nt(l[t]);n=!0}},o(t){l=l.filter(Boolean);for(let t=0;t<l.length;t+=1)rt(l[t]);n=!1},d(t){t&&y(e),x(l,t)}}}function Ft(t){let e,n,r,i,o,s,c,u,d,f,m,p,v,g,b,x=t[5].display_name+"";return{c(){e=w("div"),n=w("div"),r=w("div"),i=w("i"),s=k(),c=w("div"),u=w("span"),d=_(x),f=k(),L(i,"class",o=a(t[5].icon)+" svelte-169vmu3"),L(r,"class","image mb-1 svelte-169vmu3"),L(c,"class","name svelte-169vmu3"),L(n,"class","text-center py-4"),L(e,"class","card col-6 svelte-169vmu3"),L(e,"draggable","true"),L(e,"data-element-id",m=t[5].id)},m(t,l){$(t,e,l),h(e,n),h(n,r),h(r,i),h(n,s),h(n,c),h(c,u),h(u,d),h(e,f),v=!0,g||(b=[T(e,"dragstart",Pt),T(e,"dragend",Rt)],g=!0)},p(t,n){(!v||2&n&&o!==(o=a(t[5].icon)+" svelte-169vmu3"))&&L(i,"class",o),(!v||2&n)&&x!==(x=t[5].display_name+"")&&z(d,x),(!v||2&n&&m!==(m=t[5].id))&&L(e,"data-element-id",m)},i(t){v||(Y((()=>{p||(p=st(e,Nt,{duration:100},!0)),p.run(1)})),v=!0)},o(t){p||(p=st(e,Nt,{duration:100},!1)),p.run(0),v=!1},d(t){t&&y(e),t&&p&&p.end(),g=!1,l(b)}}}function Gt(t){let e,n,r,l,i,o,s,c=t[1].length&&Yt(t);return{c(){e=w("div"),n=w("input"),r=k(),c&&c.c(),l=E(),L(n,"type","text"),L(n,"class","form-control search-bar svelte-169vmu3"),L(n,"placeholder","Search elements"),L(e,"class","search-holder svelte-169vmu3")},m(a,u){$(a,e,u),h(e,n),S(n,t[0]),$(a,r,u),c&&c.m(a,u),$(a,l,u),i=!0,o||(s=T(n,"input",t[2]),o=!0)},p(t,[e]){1&e&&n.value!==t[0]&&S(n,t[0]),t[1].length?c?(c.p(t,e),2&e&&nt(c,1)):(c=Yt(t),c.c(),nt(c,1),c.m(l.parentNode,l)):c&&(tt(),rt(c,1,1,(()=>{c=null})),et())},i(t){i||(nt(c),i=!0)},o(t){rt(c),i=!1},d(t){t&&y(e),t&&y(r),c&&c.d(t),t&&y(l),o=!1,s()}}}function Wt(t,e,n){let r;const l=[{id:1,name:"section",display_name:"Section",icon:"bi bi-square",template:"<section builder-section></section>"},{id:2,name:"heading",display_name:"Heading",icon:"bi bi-fonts",template:"<h1>Hello</h1>"},{id:3,name:"text",display_name:"Text",icon:"bi bi-paragraph",template:"<p>Text</p>"},{id:4,name:"grid",display_name:"Grid",icon:"bi bi-columns",template:"<div editor-grid></div>"}],i=new Map;l.forEach((t=>{i.set(t.id,t)})),Mt.set(i);let o="";return t.$$.update=()=>{1&t.$$.dirty&&n(1,r=l.filter((t=>t.display_name.toLowerCase().match(o.toLowerCase()))))},[o,r,function(){o=this.value,n(0,o)}]}class Jt extends pt{constructor(t){super(),mt(this,t,Wt,Gt,o,{})}}function Kt(e){let n;return{c(){n=w("div"),n.innerHTML='<div class="col-md-12"><h6 class="border-bottom pb-3 mb-3">General</h6> \n        <div class="form-group"><label for="text-input" class="mb-2">Text</label> \n            <input type="text" id="text-input" class="form-control text svelte-7j4jym"/></div></div>',L(n,"class","styling-tab svelte-7j4jym")},m(t,e){$(t,n,e)},p:t,i:t,o:t,d(t){t&&y(n)}}}class Qt extends pt{constructor(t){super(),mt(this,t,null,Kt,o,{})}}function Vt(t){let e,n,r,l,i;return n=new Qt({}),{c(){e=w("section"),at(n.$$.fragment),L(e,"class","h-100")},m(t,r){$(t,e,r),ut(n,e,null),i=!0},i(t){i||(nt(n.$$.fragment,t),Y((()=>{l&&l.end(1),r||(r=it(e,qt,{x:200})),r.start()})),i=!0)},o(t){rt(n.$$.fragment,t),r&&r.invalidate(),l=ot(e,qt,{x:200,duration:0}),i=!1},d(t){t&&y(e),dt(n),t&&l&&l.end()}}}function Xt(t){let e,n,r,l,i;return n=new Jt({}),{c(){e=w("section"),at(n.$$.fragment),L(e,"class","h-100")},m(t,r){$(t,e,r),ut(n,e,null),i=!0},i(t){i||(nt(n.$$.fragment,t),Y((()=>{l&&l.end(1),r||(r=it(e,qt,{x:-200})),r.start()})),i=!0)},o(t){rt(n.$$.fragment,t),r&&r.invalidate(),l=ot(e,qt,{x:-200,duration:0}),i=!1},d(t){t&&y(e),dt(n),t&&l&&l.end()}}}function Zt(t){let e,n,r,i,o,s,c,a,u,d,f,m,p,v;const g=[Xt,Vt],b=[];function x(t,e){return t[1]?0:1}return u=x(t),d=b[u]=g[u](t),{c(){e=w("div"),n=w("ul"),r=w("li"),i=w("span"),i.textContent="Design",o=k(),s=w("li"),c=w("span"),c.textContent="Styles",a=k(),d.c(),f=E(),L(i,"class","nav-link svelte-yvpr94"),A(i,"active",t[0]),L(r,"class","nav-item col-6"),L(c,"class","nav-link svelte-yvpr94"),A(c,"active",!t[0]),L(s,"class","nav-item col-6"),L(n,"class","nav nav-tabs svelte-yvpr94"),L(e,"class","tabs")},m(l,d){$(l,e,d),h(e,n),h(n,r),h(r,i),h(n,o),h(n,s),h(s,c),$(l,a,d),b[u].m(l,d),$(l,f,d),m=!0,p||(v=[T(r,"click",t[2]),T(s,"click",t[3])],p=!0)},p(t,[e]){1&e&&A(i,"active",t[0]),1&e&&A(c,"active",!t[0]);let n=u;u=x(t),u!==n&&(tt(),rt(b[n],1,1,(()=>{b[n]=null})),et(),d=b[u],d||(d=b[u]=g[u](t),d.c()),nt(d,1),d.m(f.parentNode,f))},i(t){m||(nt(d),m=!0)},o(t){rt(d),m=!1},d(t){t&&y(e),t&&y(a),b[u].d(t),t&&y(f),p=!1,l(v)}}}function te(t,e,n){let r,l=!0;return t.$$.update=()=>{1&t.$$.dirty&&n(1,r=l)},[l,r,function(){l||n(0,l=!0)},function(){l&&n(0,l=!1)}]}class ee extends pt{constructor(t){super(),mt(this,t,te,Zt,o,{})}}const ne=gt(null),re=gt(null),le=function(e,n,r){const o=!Array.isArray(e),c=o?[e]:e,a=n.length<2;return{subscribe:gt(r,(e=>{let r=!1;const u=[];let d=0,f=t;const m=()=>{if(d)return;f();const r=n(o?u[0]:u,e);a?e(r):f=i(r)?r:t},p=c.map(((t,e)=>s(t,(t=>{u[e]=t,d&=~(1<<e),r&&m()}),(()=>{d|=1<<e}))));return r=!0,m(),function(){l(p),f()}})).subscribe}}(ne,(t=>null!=t));function ie(t,e,n){const r=t.slice();return r[9]=e[n],r}function oe(t){let e,n=t[2],r=[];for(let e=0;e<n.length;e+=1)r[e]=se(ie(t,n,e));return{c(){for(let t=0;t<r.length;t+=1)r[t].c();e=E()},m(t,n){for(let e=0;e<r.length;e+=1)r[e].m(t,n);$(t,e,n)},p(t,l){if(14&l){let i;for(n=t[2],i=0;i<n.length;i+=1){const o=ie(t,n,i);r[i]?r[i].p(o,l):(r[i]=se(o),r[i].c(),r[i].m(e.parentNode,e))}for(;i<r.length;i+=1)r[i].d(1);r.length=n.length}},d(t){x(r,t),t&&y(e)}}}function se(t){let e,n,r,i,o,s,c=t[9].el.tagName+"";function a(){return t[4](t[9])}function u(){return t[5](t[9])}function d(){return t[6](t[9])}return{c(){e=w("div"),n=w("span"),r=_(c),i=k(),L(e,"class","div col-12 w-75 border element svelte-1nmg79i"),C(e,"cursor","pointer"),C(e,"padding","10px"),C(e,"margin","10px "+t[9].spacing+"px"),A(e,"active",t[1]==t[9].el)},m(t,l){$(t,e,l),h(e,n),h(n,r),h(e,i),o||(s=[T(e,"mouseenter",a),T(e,"click",u),T(e,"mouseleave",d)],o=!0)},p(n,r){t=n,6&r&&A(e,"active",t[1]==t[9].el)},d(t){t&&y(e),o=!1,l(s)}}}function ce(e){let n,r=e[0]&&oe(e);return{c(){n=w("div"),r&&r.c(),L(n,"class","layers-tab svelte-1nmg79i")},m(t,e){$(t,n,e),r&&r.m(n,null)},p(t,[e]){t[0]?r?r.p(t,e):(r=oe(t),r.c(),r.m(n,null)):r&&(r.d(1),r=null)},i:t,o:t,d(t){t&&y(n),r&&r.d()}}}function ae(t,e,n=""){if(!1===e(t,n))return;let r=t.firstElementChild;for(;r;)ae(r,e,n+"---"),r=r.nextElementSibling}function ue(t,e,n){let r,l,i;c(t,le,(t=>n(7,r=t))),c(t,ne,(t=>n(8,l=t))),c(t,re,(t=>n(1,i=t)));let o=!1;const s=[];function a(t){i&&i.removeAttribute("editor-selected"),i===t?u(re,i=null,i):(u(re,i=t,i),i.setAttribute("editor-selected",""))}r&&(ae(l.body,((t,e)=>{e&&s.push({el:t,spacing:e.length})})),o=!0);return[o,i,s,a,t=>{t.el.setAttribute("editor-outline","")},t=>a(t.el),t=>{t.el.removeAttribute("editor-outline")}]}class de extends pt{constructor(t){super(),mt(this,t,ue,ce,o,{})}}function fe(){return!!localStorage.getItem("dark-mode")}function me(){let t=document.querySelector("link[rel~='icon']");document.body.classList.add("dark-mode"),localStorage.setItem("dark-mode",!0),t.href="/favicons/favicon-dark.ico"}function pe(){let t=document.querySelector("link[rel~='icon']");document.body.classList.remove("dark-mode"),localStorage.removeItem("dark-mode"),t.href="/favicons/favicon.ico"}function ve(){fe()?pe():me()}function ge(e){let n,r,i,o,s,c,a,u,d,f,m;return{c(){n=w("section"),r=w("div"),i=w("div"),i.innerHTML='<label for="toggle">Dark mode</label>',o=k(),s=w("div"),c=w("div"),a=w("input"),u=k(),d=w("label"),L(i,"class","col-6"),L(a,"type","checkbox"),L(a,"id","toggle"),L(a,"class","svelte-2vqqjm"),L(d,"for","toggle"),L(d,"class","svelte-2vqqjm"),L(c,"class","toggle svelte-2vqqjm"),L(s,"class","col-6"),L(r,"class","form-group row"),L(n,"class","svelte-2vqqjm")},m(t,l){$(t,n,l),h(n,r),h(r,i),h(r,o),h(r,s),h(s,c),h(c,a),a.checked=e[0],h(c,u),h(c,d),f||(m=[T(a,"change",e[1]),T(a,"input",ve)],f=!0)},p(t,[e]){1&e&&(a.checked=t[0])},i:t,o:t,d(t){t&&y(n),f=!1,l(m)}}}function be(t,e,n){let r=fe();return[r,function(){r=this.checked,n(0,r)}]}class he extends pt{constructor(t){super(),mt(this,t,be,ge,o,{})}}function $e(e){let n,r,l;return r=new he({}),{c(){n=w("section"),at(r.$$.fragment),L(n,"class","setting-tab")},m(t,e){$(t,n,e),ut(r,n,null),l=!0},p:t,i(t){l||(nt(r.$$.fragment,t),l=!0)},o(t){rt(r.$$.fragment,t),l=!1},d(t){t&&y(n),dt(r)}}}class ye extends pt{constructor(t){super(),mt(this,t,null,$e,o,{})}}function xe(t){let e,n,r,l;return n=new ye({}),{c(){e=w("section"),at(n.$$.fragment),L(e,"class","h-100")},m(t,r){$(t,e,r),ut(n,e,null),l=!0},i(t){l||(nt(n.$$.fragment,t),r||Y((()=>{r=it(e,Nt,{duration:250}),r.start()})),l=!0)},o(t){rt(n.$$.fragment,t),l=!1},d(t){t&&y(e),dt(n)}}}function we(t){let e,n,r,l;return n=new de({}),{c(){e=w("section"),at(n.$$.fragment),L(e,"class","h-100")},m(t,r){$(t,e,r),ut(n,e,null),l=!0},i(t){l||(nt(n.$$.fragment,t),r||Y((()=>{r=it(e,Nt,{duration:250}),r.start()})),l=!0)},o(t){rt(n.$$.fragment,t),l=!1},d(t){t&&y(e),dt(n)}}}function _e(t){let e,n,r,l;return n=new ee({}),{c(){e=w("section"),at(n.$$.fragment),L(e,"class","h-100")},m(t,r){$(t,e,r),ut(n,e,null),l=!0},i(t){l||(nt(n.$$.fragment,t),r||Y((()=>{r=it(e,Nt,{duration:250}),r.start()})),l=!0)},o(t){rt(n.$$.fragment,t),l=!1},d(t){t&&y(e),dt(n)}}}function ke(t){let e,n,r,l;const i=[_e,we,xe],o=[];function s(t,e){return t[0]==ht?0:t[0]==$t?1:t[0]==yt?2:-1}return~(n=s(t))&&(r=o[n]=i[n](t)),{c(){e=w("div"),r&&r.c(),L(e,"class","sidenav svelte-1m7zlni")},m(t,r){$(t,e,r),~n&&o[n].m(e,null),l=!0},p(t,[l]){let c=n;n=s(t),n!==c&&(r&&(tt(),rt(o[c],1,1,(()=>{o[c]=null})),et()),~n?(r=o[n],r||(r=o[n]=i[n](t),r.c()),nt(r,1),r.m(e,null)):r=null)},i(t){l||(nt(r),l=!0)},o(t){rt(r),l=!1},d(t){t&&y(e),~n&&o[n].d()}}}function Ee(t,e,n){let r;return c(t,bt,(t=>n(0,r=t))),[r]}class Te extends pt{constructor(t){super(),mt(this,t,Ee,ke,o,{})}}function Le(e){let n,r,l,i,o,s;return{c(){n=w("div"),r=w("div"),l=w("iframe"),L(l,"title","editor-preview"),l.src!==(i="/preview/preview.html")&&L(l,"src","/preview/preview.html"),L(l,"frameborder","0"),L(l,"allowtransparency","true"),L(l,"class","preview-window svelte-23ti04"),L(r,"class","preview-main svelte-23ti04"),L(n,"class","col preview-holder svelte-23ti04")},m(t,i){$(t,n,i),h(n,r),h(r,l),o||(s=d(e[0].call(null,l)),o=!0)},p:t,i:t,o:t,d(t){t&&y(n),o=!1,s()}}}function ze(t,e,n){let r;return c(t,ne,(t=>n(1,r=t))),[function(t){let e=setInterval((function(){let n=t.contentDocument||t.contentWindow.document;["complete","interactive"].includes(n.readyState)&&(u(ne,r=t.contentDocument,r),r.body.addEventListener("dragover",(t=>function(t){t.preventDefault();let e=t.target;!function(t,e="inside"){t.setAttribute("editor-insert-preview",e)}(e,Ht(e)?"inside":Ot(e,t.clientY))}(t))),r.body.addEventListener("drop",(t=>Bt(t))),r.body.addEventListener("dragenter",(t=>function(t){t.target.tagName}(t))),r.body.addEventListener("dragleave",(t=>function(t){It(t.target)}(t))),clearInterval(e),setTimeout((()=>{var t;t="Hi There 😃...",console.log(`%c${t}`,"color: #df6b42;\n        font-family: system-ui;\n        font-size: 15px;\n        -webkit-text-stroke: 0.5px black;\n        font-weight: bold")}),1e3))}),2e3)}]}class Se extends pt{constructor(t){super(),mt(this,t,ze,Le,o,{})}}function Ce(e){let n,r,l,i,o,s,c,a,u,d,f,m;return l=new _t({}),s=new Dt({}),u=new Te({}),f=new Se({}),{c(){n=w("div"),r=w("div"),at(l.$$.fragment),i=k(),o=w("div"),at(s.$$.fragment),c=k(),a=w("div"),at(u.$$.fragment),d=k(),at(f.$$.fragment),L(a,"class","d-flex wrapper svelte-hrg01p"),L(o,"class","col"),L(r,"class","d-flex"),L(n,"class","main svelte-hrg01p")},m(t,e){$(t,n,e),h(n,r),ut(l,r,null),h(r,i),h(r,o),ut(s,o,null),h(o,c),h(o,a),ut(u,a,null),h(a,d),ut(f,a,null),m=!0},p:t,i(t){m||(nt(l.$$.fragment,t),nt(s.$$.fragment,t),nt(u.$$.fragment,t),nt(f.$$.fragment,t),m=!0)},o(t){rt(l.$$.fragment,t),rt(s.$$.fragment,t),rt(u.$$.fragment,t),rt(f.$$.fragment,t),m=!1},d(t){t&&y(n),dt(l),dt(s),dt(u),dt(f)}}}function Ae(t){return fe()?me():pe(),[]}class De extends pt{constructor(t){super(),mt(this,t,Ae,Ce,o,{})}}function je(e){let n,r;return n=new De({}),{c(){at(n.$$.fragment)},m(t,e){ut(n,t,e),r=!0},p:t,i(t){r||(nt(n.$$.fragment,t),r=!0)},o(t){rt(n.$$.fragment,t),r=!1},d(t){dt(n,t)}}}return new class extends pt{constructor(t){super(),mt(this,t,null,je,o,{})}}({target:document.body})}();
//# sourceMappingURL=app.js.map
