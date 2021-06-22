var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function c(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function r(t,e){t.appendChild(e)}function i(t,e,n){t.insertBefore(e,n||null)}function l(t){t.parentNode.removeChild(t)}function u(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function a(t){return document.createElement(t)}function d(t){return document.createTextNode(t)}function f(){return d(" ")}function p(){return d("")}function m(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function g(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function b(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function h(t,e,n,o){t.style.setProperty(e,n,o?"important":"")}let v;function $(t){v=t}function y(){const t=function(){if(!v)throw new Error("Function called outside component initialization");return v}();return(e,n)=>{const o=t.$$.callbacks[e];if(o){const c=function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(e,n);o.slice().forEach((e=>{e.call(t,c)}))}}}const x=[],w=[],k=[],S=[],O=Promise.resolve();let N=!1;function _(t){k.push(t)}let C=!1;const j=new Set;function E(){if(!C){C=!0;do{for(let t=0;t<x.length;t+=1){const e=x[t];$(e),J(e.$$)}for($(null),x.length=0;w.length;)w.pop()();for(let t=0;t<k.length;t+=1){const e=k[t];j.has(e)||(j.add(e),e())}k.length=0}while(x.length);for(;S.length;)S.pop()();N=!1,C=!1,j.clear()}}function J(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(_)}}const L=new Set;let M;function z(){M={r:0,c:[],p:M}}function P(){M.r||o(M.c),M=M.p}function A(t,e){t&&t.i&&(L.delete(t),t.i(e))}function T(t,e,n,o){if(t&&t.o){if(L.has(t))return;L.add(t),M.c.push((()=>{L.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}function X(t){t&&t.c()}function I(t,n,s,r){const{fragment:i,on_mount:l,on_destroy:u,after_update:a}=t.$$;i&&i.m(n,s),r||_((()=>{const n=l.map(e).filter(c);u?u.push(...n):o(n),t.$$.on_mount=[]})),a.forEach(_)}function Q(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function B(t,e){-1===t.$$.dirty[0]&&(x.push(t),N||(N=!0,O.then(E)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function W(e,c,s,r,i,u,a=[-1]){const d=v;$(e);const f=e.$$={fragment:null,ctx:null,props:u,update:t,not_equal:i,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(d?d.$$.context:c.context||[]),callbacks:n(),dirty:a,skip_bound:!1};let p=!1;if(f.ctx=s?s(e,c.props||{},((t,n,...o)=>{const c=o.length?o[0]:n;return f.ctx&&i(f.ctx[t],f.ctx[t]=c)&&(!f.skip_bound&&f.bound[t]&&f.bound[t](c),p&&B(e,t)),n})):[],f.update(),p=!0,o(f.before_update),f.fragment=!!r&&r(f.ctx),c.target){if(c.hydrate){const t=function(t){return Array.from(t.childNodes)}(c.target);f.fragment&&f.fragment.l(t),t.forEach(l)}else f.fragment&&f.fragment.c();c.intro&&A(e.$$.fragment),I(e,c.target,c.anchor,c.customElement),E()}$(d)}class D{$destroy(){Q(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function H(t){let e,n;return{c(){e=a("p"),n=d(t[1]),h(e,"opacity",Math.max(t[1]>0?t[1]/t[0]*5:0,.1)),h(e,"font-size",Math.min(Math.max(1,t[1]/t[0]*3),3.5)+"em")},m(t,o){i(t,e,o),r(e,n)},p(t,o){2&o&&b(n,t[1]),3&o&&h(e,"opacity",Math.max(t[1]>0?t[1]/t[0]*5:0,.1)),3&o&&h(e,"font-size",Math.min(Math.max(1,t[1]/t[0]*3),3.5)+"em")},d(t){t&&l(e)}}}function R(t){let e;function n(t,e){return"x"==t[2]?G:U}let o=n(t),c=o(t);return{c(){c.c(),e=p()},m(t,n){c.m(t,n),i(t,e,n)},p(t,s){o!==(o=n(t))&&(c.d(1),c=o(t),c&&(c.c(),c.m(e.parentNode,e)))},d(t){c.d(t),t&&l(e)}}}function U(t){let e;return{c(){e=a("span"),e.textContent="circle",g(e,"class","material-icons-outlined icon o svelte-mrgfsf")},m(t,n){i(t,e,n)},d(t){t&&l(e)}}}function G(t){let e;return{c(){e=a("span"),e.textContent="close",g(e,"class","material-icons-round icon x svelte-mrgfsf")},m(t,n){i(t,e,n)},d(t){t&&l(e)}}}function K(e){let n,o,c,s,u;function d(t,e){return""!=t[2]?R:H}let f=d(e),p=f(e);return{c(){n=a("button"),o=a("div"),p.c(),g(o,"class","con svelte-mrgfsf"),g(n,"class","tile svelte-mrgfsf"),n.disabled=c=!e[3],h(n,"position","relative"),h(n,"background","rgba(0, 255, 149, "+(e[1]>0?e[1]/e[0]*.8:0).toPrecision(2)+")")},m(t,c){i(t,n,c),r(n,o),p.m(o,null),s||(u=m(n,"click",e[4]),s=!0)},p(t,[e]){f===(f=d(t))&&p?p.p(t,e):(p.d(1),p=f(t),p&&(p.c(),p.m(o,null))),8&e&&c!==(c=!t[3])&&(n.disabled=c),3&e&&h(n,"background","rgba(0, 255, 149, "+(t[1]>0?t[1]/t[0]*.8:0).toPrecision(2)+")")},i:t,o:t,d(t){t&&l(n),p.d(),s=!1,u()}}}function Z(t,e,n){let o,{total:c}=e,{votes:s}=e,{state:r}=e;const i=y();return t.$$set=t=>{"total"in t&&n(0,c=t.total),"votes"in t&&n(1,s=t.votes),"state"in t&&n(2,r=t.state)},t.$$.update=()=>{4&t.$$.dirty&&n(3,o=""==r)},[c,s,r,o,()=>{n(3,o=!1),setTimeout((()=>{n(3,o=!0)}),1e3),i("vote")}]}class q extends D{constructor(t){super(),W(this,t,Z,K,s,{total:0,votes:1,state:2})}}function F(e){let n,o,c,s;return{c(){n=a("script"),n.src!==(o="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.2/socket.io.js")&&g(n,"src","https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.2/socket.io.js"),g(n,"integrity","sha512-iZIBSs+gDyTH0ZhUem9eQ1t4DcEn2B9lHxfRMeGQhyNdSUz+rb+5A3ummX6DQTOIs1XK0gOteOg/LPtSo9VJ+w=="),g(n,"crossorigin","anonymous"),g(n,"referrerpolicy","no-referrer")},m(t,o){r(document.head,n),c||(s=m(n,"load",e[0]),c=!0)},p:t,i:t,o:t,d(t){l(n),c=!1,s()}}}function V(t,e,n){let{socketLoad:o}=e,c={},{connected:s=c.connected}=e;y();return t.$$set=t=>{"socketLoad"in t&&n(2,o=t.socketLoad),"connected"in t&&n(1,s=t.connected)},[()=>{const t=io("https://nc300cyberdemo.azurewebsites.net",{transports:["websocket"]}).connect();c=t,n(1,s=c.connected),t.on("connect",(()=>{n(1,s=c.connected)})),t.on("disconnect",(t=>{n(1,s=c.connected)})),console.log("sock"),o(t)},s,o]}class Y extends D{constructor(t){super(),W(this,t,V,F,s,{socketLoad:2,connected:1})}}function tt(t,e,n){const o=t.slice();return o[22]=e[n],o[23]=e,o[24]=n,o}function et(t,e,n){const o=t.slice();return o[25]=e[n],o[24]=n,o}function nt(e){let n;return{c(){n=a("p"),n.textContent="Connecting...",g(n,"class","")},m(t,e){i(t,n,e)},p:t,i:t,o:t,d(t){t&&l(n)}}}function ot(t){let e,n,o,c,s,r,d,m,b=!t[6]&&ct(t),h=t[5]>0&&it(t),v=!t[7]&&!t[10]&&!t[8]&&lt(),$=""!=t[8]&&ut(t),y=t[0],x=[];for(let e=0;e<y.length;e+=1)x[e]=vt(tt(t,y,e));const w=t=>T(x[t],1,1,(()=>{x[t]=null}));let k=t[6]&&t[10]&&$t(t);return{c(){b&&b.c(),e=f(),h&&h.c(),n=f(),v&&v.c(),o=f(),$&&$.c(),c=f(),s=a("div");for(let t=0;t<x.length;t+=1)x[t].c();r=f(),k&&k.c(),d=p(),g(s,"class","board svelte-bm01p3")},m(t,l){b&&b.m(t,l),i(t,e,l),h&&h.m(t,l),i(t,n,l),v&&v.m(t,l),i(t,o,l),$&&$.m(t,l),i(t,c,l),i(t,s,l);for(let t=0;t<x.length;t+=1)x[t].m(s,null);i(t,r,l),k&&k.m(t,l),i(t,d,l),m=!0},p(t,r){if(t[6]?b&&(b.d(1),b=null):b?b.p(t,r):(b=ct(t),b.c(),b.m(e.parentNode,e)),t[5]>0?h?h.p(t,r):(h=it(t),h.c(),h.m(n.parentNode,n)):h&&(h.d(1),h=null),t[7]||t[10]||t[8]?v&&(v.d(1),v=null):v||(v=lt(),v.c(),v.m(o.parentNode,o)),""!=t[8]?$?$.p(t,r):($=ut(t),$.c(),$.m(c.parentNode,c)):$&&($.d(1),$=null),1681&r){let e;for(y=t[0],e=0;e<y.length;e+=1){const n=tt(t,y,e);x[e]?(x[e].p(n,r),A(x[e],1)):(x[e]=vt(n),x[e].c(),A(x[e],1),x[e].m(s,null))}for(z(),e=y.length;e<x.length;e+=1)w(e);P()}t[6]&&t[10]?k?k.p(t,r):(k=$t(t),k.c(),k.m(d.parentNode,d)):k&&(k.d(1),k=null)},i(t){if(!m){for(let t=0;t<y.length;t+=1)A(x[t]);m=!0}},o(t){x=x.filter(Boolean);for(let t=0;t<x.length;t+=1)T(x[t]);m=!1},d(t){b&&b.d(t),t&&l(e),h&&h.d(t),t&&l(n),v&&v.d(t),t&&l(o),$&&$.d(t),t&&l(c),t&&l(s),u(x,t),t&&l(r),k&&k.d(t),t&&l(d)}}}function ct(t){let e;let n=function(t,e){return t[10]?st:rt}(t)(t);return{c(){n.c(),e=p()},m(t,o){n.m(t,o),i(t,e,o)},p(t,e){n.p(t,e)},d(t){n.d(t),t&&l(e)}}}function st(e){let n,o,c,s;return{c(){n=a("div"),o=a("button"),o.textContent="Start Game",g(o,"class","button-p svelte-bm01p3"),g(n,"class","noactive svelte-bm01p3")},m(t,l){i(t,n,l),r(n,o),c||(s=m(o,"click",e[11]),c=!0)},p:t,d(t){t&&l(n),c=!1,s()}}}function rt(e){let n;return{c(){n=a("div"),n.textContent="Waiting for game start...",g(n,"class","noactive svelte-bm01p3")},m(t,e){i(t,n,e)},p:t,d(t){t&&l(n)}}}function it(t){let e;return{c(){e=d(t[5])},m(t,n){i(t,e,n)},p(t,n){32&n&&b(e,t[5])},d(t){t&&l(e)}}}function lt(t){let e;return{c(){e=a("div"),e.textContent="Waiting for opponent's turn...",g(e,"class","noactive svelte-bm01p3")},m(t,n){i(t,e,n)},d(t){t&&l(e)}}}function ut(t){let e;let n=function(t,e){return t[10]?dt:at}(t)(t);return{c(){n.c(),e=p()},m(t,o){n.m(t,o),i(t,e,o)},p(t,e){n.p(t,e)},d(t){n.d(t),t&&l(e)}}}function at(t){let e,n,o="x"==t[8]?"X's win!":"o"==t[8]?"O's win!":"Stalemate!";return{c(){e=a("div"),n=d(o),g(e,"class","noactive svelte-bm01p3")},m(t,o){i(t,e,o),r(e,n)},p(t,e){256&e&&o!==(o="x"==t[8]?"X's win!":"o"==t[8]?"O's win!":"Stalemate!")&&b(n,o)},d(t){t&&l(e)}}}function dt(t){let e,n,o,c,s,u,p,v="x"==t[8]?"X's win!":"o"==t[8]?"O's win!":"Stalemate!";function $(t,e){return t[2]?pt:ft}let y=$(t),x=y(t);return{c(){e=a("div"),n=d(v),o=f(),c=a("button"),c.textContent="Restart",s=f(),x.c(),g(c,"class","button-p svelte-bm01p3"),h(c,"font-size","0.7em"),h(c,"margin-top","15px"),g(e,"class","noactive svelte-bm01p3"),h(e,"flex-direction","column")},m(l,a){i(l,e,a),r(e,n),r(e,o),r(e,c),r(e,s),x.m(e,null),u||(p=m(c,"click",t[14]),u=!0)},p(t,o){256&o&&v!==(v="x"==t[8]?"X's win!":"o"==t[8]?"O's win!":"Stalemate!")&&b(n,v),y===(y=$(t))&&x?x.p(t,o):(x.d(1),x=y(t),x&&(x.c(),x.m(e,null)))},d(t){t&&l(e),x.d(),u=!1,p()}}}function ft(e){let n,o,c;return{c(){n=a("button"),n.textContent="Show Info",g(n,"class","button-p svelte-bm01p3"),h(n,"font-size","0.7em"),h(n,"margin-top","15px")},m(t,s){i(t,n,s),o||(c=m(n,"click",e[16]),o=!0)},p:t,d(t){t&&l(n),o=!1,c()}}}function pt(t){let e,n,o,c,s,d,p,b=Object.values(t[1]),v=[];for(let e=0;e<b.length;e+=1)v[e]=ht(et(t,b,e));return{c(){e=a("button"),e.textContent="Clear Info",n=f(),o=a("table"),c=a("tr"),c.innerHTML="<th>IP</th> \n\t\t\t\t\t\t\t\t<th>OS</th> \n\t\t\t\t\t\t\t\t<th>Browser</th> \n\t\t\t\t\t\t\t\t<th>ISP</th> \n\t\t\t\t\t\t\t\t<th>Location</th>",s=f();for(let t=0;t<v.length;t+=1)v[t].c();g(e,"class","button-p svelte-bm01p3"),h(e,"font-size","0.7em"),h(e,"margin-top","15px"),g(o,"class","svelte-bm01p3")},m(l,u){i(l,e,u),i(l,n,u),i(l,o,u),r(o,c),r(o,s);for(let t=0;t<v.length;t+=1)v[t].m(o,null);d||(p=m(e,"click",t[15]),d=!0)},p(t,e){if(2&e){let n;for(b=Object.values(t[1]),n=0;n<b.length;n+=1){const c=et(t,b,n);v[n]?v[n].p(c,e):(v[n]=ht(c),v[n].c(),v[n].m(o,null))}for(;n<v.length;n+=1)v[n].d(1);v.length=b.length}},d(t){t&&l(e),t&&l(n),t&&l(o),u(v,t),d=!1,p()}}}function mt(t){let e,n,o,c,s,u,p,m,h,v,$,y,x,w,k,S,O=t[25].ip+"",N=t[25].os+"",_=t[25].browser+"",C=t[25].isp+"",j=t[25].location+"";return{c(){e=a("tr"),n=a("td"),o=d(O),c=f(),s=a("td"),u=d(N),p=f(),m=a("td"),h=d(_),v=f(),$=a("td"),y=d(C),x=f(),w=a("td"),k=d(j),S=f(),g(n,"class","svelte-bm01p3"),g(s,"class","svelte-bm01p3"),g(m,"class","svelte-bm01p3"),g($,"class","svelte-bm01p3"),g(w,"class","svelte-bm01p3")},m(t,l){i(t,e,l),r(e,n),r(n,o),r(e,c),r(e,s),r(s,u),r(e,p),r(e,m),r(m,h),r(e,v),r(e,$),r($,y),r(e,x),r(e,w),r(w,k),r(e,S)},p(t,e){2&e&&O!==(O=t[25].ip+"")&&b(o,O),2&e&&N!==(N=t[25].os+"")&&b(u,N),2&e&&_!==(_=t[25].browser+"")&&b(h,_),2&e&&C!==(C=t[25].isp+"")&&b(y,C),2&e&&j!==(j=t[25].location+"")&&b(k,j)},d(t){t&&l(e)}}}function gt(e){let n;return{c(){n=a("tr"),n.textContent="...\n\t\t\t\t\t\t\t\t\t"},m(t,e){i(t,n,e)},p:t,d(t){t&&l(n)}}}function bt(e){let n;return{c(){n=a("div")},m(t,e){i(t,n,e)},p:t,d(t){t&&l(n)}}}function ht(t){let e;let n=function(t,e){return t[24]>8?bt:8==t[24]?gt:mt}(t)(t);return{c(){n.c(),e=p()},m(t,o){n.m(t,o),i(t,e,o)},p(t,e){n.p(t,e)},d(t){n.d(t),t&&l(e)}}}function vt(t){let e,n;return e=new q({props:{votes:t[22].votes,total:t[9],state:t[22].state}}),e.$on("vote",(function(){return t[17](t[24],t[22],t[23])})),{c(){X(e.$$.fragment)},m(t,o){I(e,t,o),n=!0},p(n,o){t=n;const c={};1&o&&(c.votes=t[22].votes),512&o&&(c.total=t[9]),1&o&&(c.state=t[22].state),e.$set(c)},i(t){n||(A(e.$$.fragment,t),n=!0)},o(t){T(e.$$.fragment,t),n=!1},d(t){Q(e,t)}}}function $t(e){let n,c,s,u,d,p,b,h;return{c(){n=a("div"),c=a("button"),c.textContent="X Wins",s=f(),u=a("button"),u.textContent="O Wins",d=f(),p=a("button"),p.textContent="Stalemate",g(c,"class","button-w lb svelte-bm01p3"),g(u,"class","button-w mb svelte-bm01p3"),g(p,"class","button-w rb svelte-bm01p3"),g(n,"class","bc svelte-bm01p3")},m(t,o){i(t,n,o),r(n,c),r(n,s),r(n,u),r(n,d),r(n,p),b||(h=[m(c,"click",e[18]),m(u,"click",e[19]),m(p,"click",e[20])],b=!0)},p:t,d(t){t&&l(n),b=!1,o(h)}}}function yt(t){let e,n,o,c,s,u,d;function p(e){t[13](e)}let m={socketLoad:t[12]};void 0!==t[3]&&(m.connected=t[3]),n=new Y({props:m}),w.push((()=>function(t,e,n){const o=t.$$.props[e];void 0!==o&&(t.$$.bound[o]=n,n(t.$$.ctx[o]))}(n,"connected",p)));const b=[ot,nt],h=[];function v(t,e){return t[3]?0:1}return s=v(t),u=h[s]=b[s](t),{c(){e=a("main"),X(n.$$.fragment),c=f(),u.c(),g(e,"class","svelte-bm01p3")},m(t,o){i(t,e,o),I(n,e,null),r(e,c),h[s].m(e,null),d=!0},p(t,[c]){const r={};var i;!o&&8&c&&(o=!0,r.connected=t[3],i=()=>o=!1,S.push(i)),n.$set(r);let l=s;s=v(t),s===l?h[s].p(t,c):(z(),T(h[l],1,1,(()=>{h[l]=null})),P(),u=h[s],u?u.p(t,c):(u=h[s]=b[s](t),u.c()),A(u,1),u.m(e,null))},i(t){d||(A(n.$$.fragment,t),A(u),d=!0)},o(t){T(n.$$.fragment,t),T(u),d=!1},d(t){t&&l(e),Q(n),h[s].d()}}}function xt(t,e,n){let o;console.table(document);let c,s=[{votes:0,state:""},{votes:0,state:""},{votes:0,state:""},{votes:0,state:""},{votes:0,state:""},{votes:0,state:""},{votes:0,state:""},{votes:0,state:""},{votes:0,state:""}],r={},i=!1,l=!1,u=0,a="#admin"==window.location.hash,d=!1;var f=!0;let p="";return t.$$.update=()=>{1&t.$$.dirty&&n(9,o=s.map((t=>t.votes)).reduce(((t,e)=>t+e),0))},[s,r,i,l,c,u,d,f,p,o,a,()=>{a&&c.send(JSON.stringify({type:"start"}))},t=>{n(4,c=t),console.log("Socket loaded!"),jQuery.getJSON("https://api.ipify.org?format=json",(e=>{const n=e.ip;jQuery.getJSON(`https://ipapi.co/${n}/json`,(e=>{const o=e.city,c=e.country;var s=(new UAParser).getResult();jQuery.getJSON("https://api.ipgeolocation.io/ipgeo?apiKey=ceb5539b1a8e4670868cf6a0e0ff4509",(e=>{t.send(JSON.stringify({type:"entry",ip:n,os:`${s.os.name} ${s.os.version}`,browser:`${s.browser.name} ${s.browser.version}`,isp:e.isp,location:`${o}, ${c}`}))}))}))})),c.on(),c.on("error",(t=>{console.log("error"),n(3,l=!1)})),c.on("message",(t=>{const e=t;console.log(e),"board"==e.type&&n(0,s=e.board),"status"==e.type&&n(6,d=e.gameActive),"time"==e.type&&n(5,u=e.time),"turn"==e.type&&n(7,f=e.collectiveTurn),"ending"==e.type&&n(8,p=e.ending),"entries"==e.type&&a&&n(1,r=e.entries)}))},function(t){l=t,n(3,l)},()=>{c.send(JSON.stringify({type:"restart"})),n(2,i=!1),n(1,r={})},()=>{n(2,i=!1),c.send(JSON.stringify({type:"reset_entries"}))},()=>{n(2,i=!0)},(t,e,o)=>{a||(c.send(JSON.stringify({type:"vote",tile:t})),n(0,o[t].votes++,s)),a&&!f&&c.send(JSON.stringify({type:"admin_vote",tile:t}))},()=>{c.send(JSON.stringify({type:"ending",ending:"x"}))},()=>{c.send(JSON.stringify({type:"ending",ending:"o"}))},()=>{c.send(JSON.stringify({type:"ending",ending:"s"}))}]}return new class extends D{constructor(t){super(),W(this,t,xt,yt,s,{})}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map
