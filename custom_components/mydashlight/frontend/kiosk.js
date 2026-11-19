var ia=Object.defineProperty;var qn=(s,t)=>()=>(s&&(t=s(s=0)),t);var oa=(s,t)=>{for(var e in t)ia(s,e,{get:t[e],enumerable:!0})};function On(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function Bs(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function Rl(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Go(s){return Rl(s,t=>t.unicode)}function Il(s){function t(e,n,o){let i=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(o)for(let[r,[a,c]]of Object.entries(o))i.createIndex(r,a,{multiEntry:c});return i}t(Et),t(dt,Pl,{[Yo]:[Cl,!0],[Jo]:[[Ml,Al]],[Zo]:[Sl,!0]}),t(Hs,void 0,{[Xo]:[""]})}function Qo(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function Ol(s){let t=await new Promise((e,n)=>{let o=indexedDB.open(s,El);js[s]=o,o.onupgradeneeded=i=>{i.oldVersion<_l&&Il(o.result)},Qo(e,n,o)});return t.onclose=()=>Fs(s),t}function Bl(s){return Nn[s]||(Nn[s]=Ol(s)),Nn[s]}function Ue(s,t,e,n){return new Promise((o,i)=>{let r=s.transaction(t,e,{durability:"relaxed"}),a=typeof t=="string"?r.objectStore(t):t.map(d=>r.objectStore(d)),c;n(a,r,d=>{c=d}),r.oncomplete=()=>o(c),r.onerror=()=>i(r.error)})}function Fs(s){let t=js[s],e=t&&t.result;if(e){e.close();let n=zn[s];if(n)for(let o of n)o()}delete js[s],delete Nn[s],delete zn[s]}function Nl(s){return new Promise((t,e)=>{Fs(s);let n=indexedDB.deleteDatabase(s);Qo(t,e,n)})}function jl(s,t){let e=zn[s];e||(e=zn[s]=[]),e.push(t)}function Tt(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||zl.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function er(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=Hl)}function Ul(s){return s.map(({annotation:e,emoticon:n,group:o,order:i,shortcodes:r,skins:a,tags:c,emoji:d,version:u})=>{let l=[...new Set(er([...(r||[]).map(Tt).flat(),...(c||[]).map(Tt).flat(),...Tt(e),n]))].sort(),h={annotation:e,group:o,order:i,tags:c,tokens:l,unicode:d,version:u};if(n&&(h.emoticon=n),r&&(h.shortcodes=r),a){h.skinTones=[],h.skinUnicodes=[],h.skinVersions=[];for(let{tone:b,emoji:x,version:m}of a)h.skinTones.push(b),h.skinUnicodes.push(x),h.skinVersions.push(m)}return h})}function tr(s,t,e,n){s[t](e).onsuccess=o=>n&&n(o.target.result)}function ct(s,t,e){tr(s,"get",t,e)}function nr(s,t,e){tr(s,"getAll",t,e)}function Ks(s){s.commit&&s.commit()}function Fl(s,t){let e=s[0];for(let n=1;n<s.length;n++){let o=s[n];t(e)>t(o)&&(e=o)}return e}function sr(s,t){let e=Fl(s,o=>o.length),n=[];for(let o of e)s.some(i=>i.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function Kl(s){return!await Ws(s,Et,jn)}async function Wl(s,t,e){let[n,o]=await Promise.all([Ns,jn].map(i=>Ws(s,Et,i)));return n===e&&o===t}async function Vl(s,t){return Ue(s,dt,Ct,(n,o,i)=>{let r,a=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let d=c.target.result;for(let u of d)if(r=u.unicode,t(u))return i(u);if(d.length<50)return i();a()}};a()})}async function ir(s,t,e,n){try{let o=Ul(t);await Ue(s,[dt,Et],Us,([i,r],a)=>{let c,d,u=0;function l(){++u===2&&h()}function h(){if(!(c===n&&d===e)){i.clear();for(let b of o)i.put(b);r.put(n,Ns),r.put(e,jn),Ks(a)}}ct(r,Ns,b=>{c=b,l()}),ct(r,jn,b=>{d=b,l()})})}finally{}}async function Gl(s,t){return Ue(s,dt,Ct,(e,n,o)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);nr(e.index(Jo),i,o)})}async function or(s,t){let e=er(Tt(t));return e.length?Ue(s,dt,Ct,(n,o,i)=>{let r=[],a=()=>{r.length===e.length&&c()},c=()=>{let d=sr(r,u=>u.unicode);i(d.sort((u,l)=>u.order<l.order?-1:1))};for(let d=0;d<e.length;d++){let u=e[d],l=d===e.length-1?IDBKeyRange.bound(u,u+"￿",!1,!0):IDBKeyRange.only(u);nr(n.index(Yo),l,h=>{r.push(h),a()})}}):[]}async function ql(s,t){let e=await or(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(i=>i.toLowerCase()).includes(t.toLowerCase()))[0]||null:await Vl(s,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function Yl(s,t){return Ue(s,dt,Ct,(e,n,o)=>ct(e,t,i=>{if(i)return o(i);ct(e.index(Zo),t,r=>o(r||null))}))}function Ws(s,t,e){return Ue(s,t,Ct,(n,o,i)=>ct(n,e,i))}function Xl(s,t,e,n){return Ue(s,t,Us,(o,i)=>{o.put(n,e),Ks(i)})}function Jl(s,t){return Ue(s,Hs,Us,(e,n)=>ct(e,t,o=>{e.put((o||0)+1,t),Ks(n)}))}function Zl(s,t,e){return e===0?[]:Ue(s,[Hs,dt],Ct,([n,o],i,r)=>{let a=[];n.index(Xo).openCursor(void 0,"prev").onsuccess=c=>{let d=c.target.result;if(!d)return r(a);function u(b){if(a.push(b),a.length===e)return r(a);d.continue()}let l=d.primaryKey,h=t.byName(l);if(h)return u(h);ct(o,l,b=>{if(b)return u(b);d.continue()})}})}function Ql(s,t){let e=new Map;for(let o of s){let i=t(o);for(let r of i){let a=e;for(let d=0;d<r.length;d++){let u=r.charAt(d),l=a.get(u);l||(l=new Map,a.set(u,l)),a=l}let c=a.get(Bn);c||(c=[],a.set(Bn,c)),c.push(o)}}return(o,i)=>{let r=e;for(let d=0;d<o.length;d++){let u=o.charAt(d),l=r.get(u);if(l)r=l;else return[]}if(i)return r.get(Bn)||[];let a=[],c=[r];for(;c.length;){let u=[...c.shift().entries()].sort((l,h)=>l[0]<h[0]?-1:1);for(let[l,h]of u)l===Bn?a.push(...h):c.push(h)}return a}}function tc(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||ec.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function qo(s){tc(s);let t=(h,b)=>h.name.toLowerCase()<b.name.toLowerCase()?-1:1,e=s.sort(t),o=Ql(s,h=>{let b=new Set;if(h.shortcodes)for(let x of h.shortcodes)for(let m of Tt(x))b.add(m);return b}),i=h=>o(h,!0),r=h=>o(h,!1),a=h=>{let b=Tt(h),x=b.map((m,$)=>($<b.length-1?i:r)(m));return sr(x,m=>m.name).sort(t)},c=new Map,d=new Map;for(let h of s){d.set(h.name.toLowerCase(),h);for(let b of h.shortcodes||[])c.set(b.toLowerCase(),h)}return{all:e,search:a,byShortcode:h=>c.get(h.toLowerCase()),byName:h=>d.get(h.toLowerCase())}}function Gt(s){if(!s)return s;if(nc&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function rr(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function ic(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||sc.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function ar(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function oc(s){let t=await fetch(s,{method:"HEAD"});ar(t,s);let e=t.headers.get("etag");return rr(e),e}async function zs(s){let t=await fetch(s);ar(t,s);let e=t.headers.get("etag");rr(e);let n=await t.json();return ic(n),[e,n]}function rc(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function ac(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=s.charCodeAt(o);return e}async function lr(s){let t=JSON.stringify(s),e=ac(t),n=await crypto.subtle.digest("SHA-1",e),o=rc(n);return btoa(o)}async function lc(s,t){let e,n=await oc(t);if(!n){let o=await zs(t);n=o[0],e=o[1],n||(n=await lr(e))}await Wl(s,t,n)||(e||(e=(await zs(t))[1]),await ir(s,e,t,n))}async function cc(s,t){let[e,n]=await zs(t);e||(e=await lr(n)),await ir(s,n,t,e)}async function dc(s,t){try{await lc(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var El,_l,dt,Et,Hs,Cl,Yo,Pl,Xo,Ml,Al,Jo,Ns,jn,Vo,Ct,Us,Zo,Sl,Ll,Dl,js,Nn,zn,zl,Hl,Bn,ec,nc,sc,_t,Vs=qn(()=>{El=1,_l=1,dt="emoji",Et="keyvalue",Hs="favorites",Cl="tokens",Yo="tokens",Pl="unicode",Xo="count",Ml="group",Al="order",Jo="group-order",Ns="eTag",jn="url",Vo="skinTone",Ct="readonly",Us="readwrite",Zo="skinUnicodes",Sl="skinUnicodes",Ll="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Dl="en";js={},Nn={},zn={};zl=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);Hl=2;Bn="";ec=["name","url"];nc=typeof wrappedJSObject<"u";sc=["annotation","emoji","group","order","version"];_t=class{constructor({dataSource:t=Ll,locale:e=Dl,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=qo(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await Bl(this._dbName);jl(this._dbName,this._clear);let e=this.dataSource;await Kl(t)?await cc(t,e):this._lazyUpdate=dc(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return Bs(t),await this.ready(),Go(await Gl(this._db,t)).map(Gt)}async getEmojiBySearchQuery(t){On(t),await this.ready();let e=this._custom.search(t),n=Go(await or(this._db,t)).map(Gt);return[...e,...n]}async getEmojiByShortcode(t){On(t),await this.ready();let e=this._custom.byShortcode(t);return e||Gt(await ql(this._db,t))}async getEmojiByUnicodeOrName(t){On(t),await this.ready();let e=this._custom.byName(t);return e||Gt(await Yl(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await Ws(this._db,Et,Vo)||0}async setPreferredSkinTone(t){return Bs(t),await this.ready(),Xl(this._db,Et,Vo,t)}async incrementFavoriteEmojiCount(t){return On(t),await this.ready(),Jl(this._db,t)}async getTopFavoriteEmoji(t){return Bs(t),await this.ready(),(await Zl(this._db,this._custom,t)).map(Gt)}set customEmoji(t){this._custom=qo(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await Fs(this._dbName)}async delete(){await this._shutdown(),await Nl(this._dbName)}}});function dr(s){return s.unicode.includes("‍")}function yc(s){let t=hr(s,"#000"),e=hr(s,"#fff");return t&&e&&vc(t,e)}function xc(){let s=Object.entries(uc);try{for(let[t,e]of s)if(yc(t))return e}catch{}finally{}return s[0][1]}function _c(s,t){if(t===0)return s;let e=s.indexOf($c);return e!==-1?s.substring(0,e)+String.fromCodePoint(Tc+t-1)+s.substring(e):(s.endsWith(wc)&&(s=s.substring(0,s.length-1)),s+kc+String.fromCodePoint(Ec+t-1))}function Oe(s){s.preventDefault(),s.stopPropagation()}function Xs(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function xr(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Cc(s,t){let e=n=>{let o={};for(let i of n)typeof i.tone=="number"&&i.version<=t&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:n,skins:o,shortcodes:i,url:r,name:a,category:c,annotation:d})=>({unicode:n,name:a,shortcodes:i,url:r,category:c,annotation:d,id:n||a,skins:o&&e(o)}))}function Mc(s,t,e){let n;Pc?(n=new ResizeObserver(e),n.observe(s)):Un(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function ur(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function pr(s,t,e){let n=ur(t);if(!n){if(!ht){ht=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])ht.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(ht),ht.firstChild.nodeValue=s,ur(ht)}finally{ht.remove()}}return n}function Sc(s,t,e){let n=!0;for(let o of s){let i=e(o);if(!i)continue;typeof Js>"u"&&(Js=pr(Ac,t,t));let a=pr(o.unicode,i,t)/1.8<Js;ti.set(o.unicode,a),a||(n=!1)}return n}function Lc(s){return xr(s,t=>t)}function Dc(s){s&&(s.scrollTop=0)}function qt(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function fr(s){return""+s}function Rc(s){let t=document.createElement("template");return t.innerHTML=s,t}function jc(s,t){Nc?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function zc(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function Hc(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=zc(n,s):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&jc(n,s)}function Uc(s,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:a,attributeValuePost:c}}=e,d=s[i];if(o!==d)if(e.currentExpression=d,r)if(d===null)n.removeAttribute(r);else{let u=a+fr(d)+c;n.setAttribute(r,u)}else{let u;Array.isArray(d)?Hc(d,e):d instanceof Element?(u=d,n.replaceWith(u)):n.nodeValue=fr(d),u&&(e.targetNode=u)}}}function Fc(s){let t="",e=!1,n=!1,o=-1,i=new Map,r=[],a=0;for(let d=0,u=s.length;d<u;d++){let l=s[d];if(t+=l.slice(a),d===u-1)break;for(let g=0;g<l.length;g++)switch(l.charAt(g)){case"<":{l.charAt(g+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let h=r[r.length-1],b=qt(i,h,()=>[]),x,m,$;if(n){let g=/(\S+)="?([^"=]*)$/.exec(l);x=g[1],m=g[2];let M=/^([^">]*)("?)/.exec(s[d+1]);$=M[1],t=t.slice(0,-1*g[0].length),a=M[0].length}else a=0;let S={attributeName:x,attributeValuePre:m,attributeValuePost:$,expressionIndex:d};b.push(S),!e&&!n&&(t+=" ")}return{template:Rc(t),elementsToBindings:i}}function gr(s,t,e){for(let n=0;n<s.length;n++){let o=s[n],i=o.attributeName?t:t.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Kc(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))gr(n,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let a=t.get(++r);a&&gr(a,i,e)}while(i=o.nextNode())}return e}function Wc(s){let{template:t,elementsToBindings:e}=qt(Ic,s,()=>Fc(s)),n=t.cloneNode(!0).content.firstElementChild,o=Kc(n,e);return function(r){return Uc(r,o),n}}function Vc(s){let t=qt(Oc,s,()=>new Map),e=Bc;function n(i,...r){let a=qt(t,i,()=>new Map);return qt(a,e,()=>Wc(i))(r)}function o(i,r,a){return i.map((c,d)=>{let u=e;e=a(c);try{return r(c,d)}finally{e=u}})}return{map:o,html:n}}function Gc(s,t,e,n,o,i,r,a,c){let{labelWithSkin:d,titleForEmoji:u,unicodeWithSkin:l}=e,{html:h,map:b}=Vc(t);function x(g,M,N){return b(g,(W,de)=>h`<button role="${M?"option":"menuitem"}" aria-selected="${M?de===t.activeSearchItem:null}" aria-label="${d(W,t.currentSkinTone)}" title="${u(W)}" class="${"emoji"+(M&&de===t.activeSearchItem?" active":"")+(W.unicode?"":" custom-emoji")}" id="${`${N}-${W.id}`}" style="${W.unicode?null:`--custom-emoji-background: url(${JSON.stringify(W.url)})`}">${W.unicode?l(W,t.currentSkinTone):""}</button>`,W=>`${N}-${W.id}`)}let $=h`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${b(t.skinTones,(g,M)=>h`<div id="skintone-${M}" class="emoji ${M===t.activeSkinTone?"active":""}" aria-selected="${M===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[M]}" aria-label="${t.i18n.skinTones[M]}">${g}</div>`,g=>g)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${b(t.groups,g=>h`<button role="tab" class="nav-button" aria-controls="tab-${g.id}" aria-label="${t.i18n.categories[g.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===g.id}" title="${t.i18n.categories[g.name]}" data-group-id="${g.id}"><div class="nav-emoji emoji">${g.emoji}</div></button>`,g=>g.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${b(t.currentEmojisWithCategories,(g,M)=>h`<div><div id="menu-label-${M}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:g.category?g.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${M!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(g.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${M}" id="${t.searchMode?"search-results":null}">${x(g.emojis,t.searchMode,"emo")}</div></div>`,g=>g.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${x(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,S=(g,M)=>{for(let N of s.querySelectorAll(`[${g}]`))M(N,N.getAttribute(g))};if(c){s.appendChild($);for(let g of["click","focusout","input","keydown","keyup"])S(`data-on-${g}`,(M,N)=>{M.addEventListener(g,n[N])});S("data-ref",(g,M)=>{i[M]=g}),r.addEventListener("abort",()=>{s.removeChild($)})}S("data-action",(g,M)=>{let N=a.get(M);N||a.set(M,N=new WeakSet),N.has(g)||(N.add(g),o[M](g))})}function qc(s){let t=!1,e,n=new Map,o=new Set,i,r=()=>{if(t)return;let d=[...o];o.clear();try{for(let u of d)u()}finally{i=!1,o.size&&(i=!0,Fn(r))}},a=new Proxy({},{get(d,u){if(e){let l=n.get(u);l||(l=new Set,n.set(u,l)),l.add(e)}return d[u]},set(d,u,l){if(d[u]!==l){d[u]=l;let h=n.get(u);if(h){for(let b of h)o.add(b);i||(i=!0,Fn(r))}}return!0}}),c=d=>{let u=()=>{let l=e;e=u;try{return d()}finally{e=l}};return u()};return s.addEventListener("abort",()=>{t=!0}),{state:a,createEffect:c}}function Zs(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function Yc(s,t,e){{let n=s.closest(".tabpanel"),o=mr.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),mr.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function Xc(s,t){let e={},n=new AbortController,o=n.signal,{state:i,createEffect:r}=qc(o),a=new Map;Hn(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),Hn(i,t),Hn(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:gc,isRtl:!1,currentGroupIndex:0,groups:Gs,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let c=p=>{s.getElementById(p).focus()},d=p=>s.getElementById(`emo-${p.id}`),u=(p,y)=>{e.rootElement.dispatchEvent(new CustomEvent(p,{detail:y,bubbles:!0,composed:!0}))},l=(p,y)=>p.id===y.id,h=(p,y)=>{let{category:v,emojis:w}=p,{category:R,emojis:I}=y;return v!==R?!1:Zs(w,I,l)},b=p=>{Zs(i.currentEmojis,p,l)||(i.currentEmojis=p)},x=p=>{i.searchMode!==p&&(i.searchMode=p)},m=p=>{Zs(i.currentEmojisWithCategories,p,h)||(i.currentEmojisWithCategories=p)},$=(p,y)=>y&&p.skins&&p.skins[y]||p.unicode,M={labelWithSkin:(p,y)=>Lc([p.name||$(p,y),p.annotation,...p.shortcodes||Qs].filter(Boolean)).join(", "),titleForEmoji:p=>p.annotation||(p.shortcodes||Qs).join(", "),unicodeWithSkin:$},N={onClickSkinToneButton:_e,onEmojiClick:ue,onNavClick:X,onNavKeydown:he,onSearchKeydown:z,onSkinToneOptionsClick:te,onSkinToneOptionsFocusOut:Ce,onSkinToneOptionsKeydown:we,onSkinToneOptionsKeyup:qe,onSearchInput:Be},W={calculateEmojiGridStyle:_,updateOnIntersection:k},de=!0;r(()=>{Gc(s,i,M,N,W,e,o,a,de),de=!1}),i.emojiVersion||Ys().then(p=>{p||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function p(){let y=!1,v=setTimeout(()=>{y=!0,i.message=i.i18n.loadingMessage},pc);try{await i.database.ready(),i.databaseLoaded=!0}catch(w){console.error(w),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(v),y&&(y=!1,i.message="")}}i.database&&p()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${cr};`}),r(()=>{i.customEmoji&&i.database&&T()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==ei&&(i.groups=ei):i.groups!==Gs&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=Gs)}),r(()=>{async function p(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}p()}),r(()=>{i.skinTones=Array(cr).fill().map((p,y)=>_c(i.skinToneEmoji,y))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function p(){let{database:y}=i,v=(await Promise.all(mc.map(w=>y.getEmojiByUnicodeOrName(w)))).filter(Boolean);i.defaultFavoriteEmojis=v}i.databaseLoaded&&p()});function T(){let{customEmoji:p,database:y}=i,v=p||Qs;y.customEmoji!==v&&(y.customEmoji=v)}r(()=>{async function p(){T();let{database:y,defaultFavoriteEmojis:v,numColumns:w}=i,R=await y.getTopFavoriteEmoji(w),I=await F(xr([...R,...v],B=>B.unicode||B.name).slice(0,w));i.currentFavorites=I}i.databaseLoaded&&i.defaultFavoriteEmojis&&p()});function _(p){Mc(p,o,()=>{{let y=getComputedStyle(e.rootElement),v=parseInt(y.getPropertyValue("--num-columns"),10),w=y.getPropertyValue("direction")==="rtl";i.numColumns=v,i.isRtl=w}})}function k(p){Yc(p,o,y=>{for(let{target:v,isIntersecting:w}of y)v.classList.toggle("onscreen",w)})}r(()=>{async function p(){let{searchText:y,currentGroup:v,databaseLoaded:w,customEmoji:R}=i;if(!w)i.currentEmojis=[],i.searchMode=!1;else if(y.length>=hc){let I=await J(y);i.searchText===y&&(b(I),x(!0))}else{let{id:I}=v;if(I!==-1||R&&R.length){let B=await Y(I);i.currentGroup.id===I&&(b(B),x(!1))}}}p()});let C=()=>{Un(()=>Dc(e.tabpanelElement))};r(()=>{let{currentEmojis:p,emojiVersion:y}=i,v=p.filter(w=>w.unicode).filter(w=>dr(w)&&!ti.has(w.unicode));if(!y&&v.length)b(p),Un(()=>P(v));else{let w=y?p:p.filter(L);b(w),C()}});function P(p){Sc(p,e.baselineEmoji,d)?C():i.currentEmojis=[...i.currentEmojis]}function L(p){return!p.unicode||!dr(p)||ti.get(p.unicode)}async function j(p){let y=i.emojiVersion||await Ys();return p.filter(({version:v})=>!v||v<=y)}async function F(p){return Cc(p,i.emojiVersion||await Ys())}async function Y(p){let y=p===-1?i.customEmoji:await i.database.getEmojiByGroup(p);return F(await j(y))}async function J(p){return F(await j(await i.database.getEmojiBySearchQuery(p)))}r(()=>{}),r(()=>{function p(){let{searchMode:v,currentEmojis:w}=i;if(v)return[{category:"",emojis:w}];let R=new Map;for(let I of w){let B=I.category||"",G=R.get(B);G||(G=[],R.set(B,G)),G.push(I)}return[...R.entries()].map(([I,B])=>({category:I,emojis:B})).sort((I,B)=>i.customCategorySorting(I.category,B.category))}let y=p();m(y)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:p}=i;vr(()=>{i.searchText=(p||"").trim(),i.activeSearchItem=-1})});function z(p){if(!i.searchMode||!i.currentEmojis.length)return;let y=v=>{Oe(p),i.activeSearchItem=Xs(v,i.activeSearchItem,i.currentEmojis)};switch(p.key){case"ArrowDown":return y(!1);case"ArrowUp":return y(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return Oe(p),Fe(i.currentEmojis[i.activeSearchItem].id)}}function X(p){let{target:y}=p,v=y.closest(".nav-button");if(!v)return;let w=parseInt(v.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(R=>R.id===w)}function he(p){let{target:y,key:v}=p,w=R=>{R&&(Oe(p),R.focus())};switch(v){case"ArrowLeft":return w(y.previousElementSibling);case"ArrowRight":return w(y.nextElementSibling);case"Home":return w(y.parentElement.firstElementChild);case"End":return w(y.parentElement.lastElementChild)}}async function Ee(p){let y=await i.database.getEmojiByUnicodeOrName(p),v=[...i.currentEmojis,...i.currentFavorites].find(R=>R.id===p),w=v.unicode&&$(v,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(p),{emoji:y,skinTone:i.currentSkinTone,...w&&{unicode:w},...v.name&&{name:v.name}}}async function Fe(p){let y=Ee(p);u("emoji-click-sync",y),u("emoji-click",await y)}function ue(p){let{target:y}=p;if(!y.classList.contains("emoji"))return;Oe(p);let v=y.id.substring(4);Fe(v)}function fe(p){i.currentSkinTone=p,i.skinTonePickerExpanded=!1,c("skintone-button"),u("skin-tone-change",{skinTone:p}),i.database.setPreferredSkinTone(p)}function te(p){let{target:{id:y}}=p,v=y&&y.match(/^skintone-(\d)/);if(!v)return;Oe(p);let w=parseInt(v[1],10);fe(w)}function _e(p){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(Oe(p),Un(()=>c("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function we(p){if(!i.skinTonePickerExpanded)return;let y=async v=>{Oe(p),i.activeSkinTone=v};switch(p.key){case"ArrowUp":return y(Xs(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return y(Xs(!1,i.activeSkinTone,i.skinTones));case"Home":return y(0);case"End":return y(i.skinTones.length-1);case"Enter":return Oe(p),fe(i.activeSkinTone);case"Escape":return Oe(p),i.skinTonePickerExpanded=!1,c("skintone-button")}}function qe(p){if(i.skinTonePickerExpanded)switch(p.key){case" ":return Oe(p),fe(i.activeSkinTone)}}async function Ce(p){let{relatedTarget:y}=p;(!y||y.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function Be(p){i.rawSearchText=p.target.value}return{$set(p){Hn(i,p)},$destroy(){n.abort()}}}function br(s){s instanceof ut||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var ei,Gs,hc,cr,vr,uc,pc,fc,gc,mc,yr,bc,hr,vc,qs,Ys,ti,wc,kc,$c,Tc,Ec,Un,Pc,Ac,Js,ht,Ic,Oc,Bc,Nc,Fn,mr,Qs,Hn,Jc,Zc,Qc,ed,wr,td,ut,kr,$r=qn(()=>{Vs();ei=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),Gs=ei.slice(1),hc=2,cr=6,vr=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;uc={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},pc=1e3,fc="🖐️",gc=8,mc=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],yr='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',bc=(s,t)=>s<t?-1:s>t?1:0,hr=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${yr}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},vc=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};Ys=()=>(qs||(qs=new Promise(s=>vr(()=>s(xc())))),qs),ti=new Map,wc="️",kc="\uD83C",$c="‍",Tc=127995,Ec=57339;Un=requestAnimationFrame,Pc=typeof ResizeObserver=="function";Ac="😀";Ic=new WeakMap,Oc=new WeakMap,Bc=Symbol("un-keyed"),Nc="replaceChildren"in Element.prototype;Fn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);mr=new WeakMap;Qs=[],{assign:Hn}=Object;Jc="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Zc="en",Qc={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},ed=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',wr=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],td=`:host{--emoji-font-family:${yr}}`,ut=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=ed+td,this.shadowRoot.appendChild(e),this._ctx={locale:Zc,dataSource:Jc,skinToneEmoji:fc,customCategorySorting:bc,customEmoji:null,i18n:Qc,emojiVersion:null,...t};for(let n of wr)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){br(this),this._cmp||(this._cmp=Xc(this.shadowRoot,this._ctx))}disconnectedCallback(){br(this),Fn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new _t({locale:t,dataSource:e}))}_dbFlush(){Fn(()=>this._dbCreate())}},kr={};for(let s of wr)kr[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(ut.prototype,kr);customElements.get("emoji-picker")||customElements.define("emoji-picker",ut)});var Tr={};oa(Tr,{Database:()=>_t,Picker:()=>ut});var Er=qn(()=>{$r();Vs()});function gi(s){return{type:"auth",access_token:s}}function mi(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function bi(s){let t={type:"subscribe_events"};return s&&(t.event_type=s),t}function Yn(s){return{type:"unsubscribe_events",subscription:s}}function vi(){return{type:"ping"}}function yi(s,t){return{type:"result",success:!1,error:{code:s,message:t}}}function wi(s){let t={},e=s.split("&");for(let n=0;n<e.length;n++){let o=e[n].split("="),i=decodeURIComponent(o[0]),r=o.length>1?decodeURIComponent(o[1]):void 0;t[i]=r}return t}var ki=(s,t,e,n)=>{let[o,i,r]=s.split(".",3);return Number(o)>t||Number(o)===t&&(n===void 0?Number(i)>=e:Number(i)>e)||n!==void 0&&Number(o)===t&&Number(i)===e&&Number(r)>=n};var on=!1,aa="auth_required",la="auth_invalid",ca="auth_ok";function Ti(s){if(!s.auth)throw 4;let t=s.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,n=t.wsUrl;on&&console.log("[Auth phase] Initializing",n);function o(i,r,a){on&&console.log("[Auth Phase] New connection",n);let c=new WebSocket(n),d=!1,u=()=>{if(c.removeEventListener("close",u),d){a(2);return}if(i===0){a(1);return}let b=i===-1?-1:i-1;setTimeout(()=>o(b,r,a),1e3)},l=async b=>{try{t.expired&&await(e||t.refreshAccessToken()),c.send(JSON.stringify(gi(t.accessToken)))}catch(x){d=x===2,c.close()}},h=async b=>{let x=JSON.parse(b.data);switch(on&&console.log("[Auth phase] Received",x),x.type){case la:d=!0,c.close();break;case ca:c.removeEventListener("open",l),c.removeEventListener("message",h),c.removeEventListener("close",u),c.removeEventListener("error",u),c.haVersion=x.ha_version,ki(c.haVersion,2022,9)&&c.send(JSON.stringify(mi())),r(c);break;default:on&&x.type!==aa&&console.warn("[Auth phase] Unhandled message",x)}};c.addEventListener("open",l),c.addEventListener("message",h),c.addEventListener("close",u),c.addEventListener("error",u)}return new Promise((i,r)=>o(s.setupRetry,i,r))}var Lt=!1,rn=class{constructor(t,e){this._handleMessage=n=>{let o=JSON.parse(n.data);Array.isArray(o)||(o=[o]),o.forEach(i=>{Lt&&console.log("Received",i);let r=this.commands.get(i.id);switch(i.type){case"event":r?r.callback(i.event):(console.warn(`Received event for unknown subscription ${i.id}. Unsubscribing.`),this.sendMessagePromise(Yn(i.id)).catch(a=>{Lt&&console.warn(` Error unsubsribing from unknown subscription ${i.id}`,a)}));break;case"result":r&&(i.success?(r.resolve(i.result),"subscribe"in r||this.commands.delete(i.id)):(r.reject(i.error),this.commands.delete(i.id)));break;case"pong":r?(r.resolve(),this.commands.delete(i.id)):console.warn(`Received unknown pong response ${i.id}`);break;default:Lt&&console.warn("Unhandled message",i)}})},this._handleClose=async()=>{let n=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,n.forEach(r=>{"subscribe"in r||r.reject(yi(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let o=Object.assign(Object.assign({},this.options),{setupRetry:0}),i=r=>{setTimeout(async()=>{if(!this.closeRequested){Lt&&console.log("Trying to reconnect");try{let a=await o.createSocket(o);this._setSocket(a)}catch(a){if(this._queuedMessages){let c=this._queuedMessages;this._queuedMessages=void 0;for(let d of c)d.reject&&d.reject(3)}a===2?this.fireEvent("reconnect-error",a):i(r+1)}}},Math.min(r,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),i(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(o=>{"subscribe"in o&&o.subscribe&&o.subscribe().then(i=>{o.unsubscribe=i,o.resolve()})}));let n=this._queuedMessages;if(n){this._queuedMessages=void 0;for(let o of n)o.resolve()}this.fireEvent("ready")}addEventListener(t,e){let n=this.eventListeners.get(t);n||(n=[],this.eventListeners.set(t,n)),n.push(e)}removeEventListener(t,e){let n=this.eventListeners.get(t);if(!n)return;let o=n.indexOf(e);o!==-1&&n.splice(o,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(n=>n(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,bi(e))}ping(){return this.sendMessagePromise(vi())}sendMessage(t,e){if(!this.connected)throw 3;if(Lt&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,n)=>{if(this._queuedMessages){this._queuedMessages.push({reject:n,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(i){n(i)}}});return}let o=this._genCmdId();this.commands.set(o,{resolve:e,reject:n}),this.sendMessage(t,o)})}async subscribeMessage(t,e,n){if(this._queuedMessages&&await new Promise((i,r)=>{this._queuedMessages.push({resolve:i,reject:r})}),n?.preCheck&&!await n.preCheck())throw new Error("Pre-check failed");let o;return await new Promise((i,r)=>{let a=this._genCmdId();o={resolve:i,reject:r,callback:t,subscribe:n?.resubscribe!==!1?()=>this.subscribeMessage(t,e,n):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(Yn(a)),this.commands.delete(a)}},this.commands.set(a,o);try{this.sendMessage(e,a)}catch{}}),()=>o.unsubscribe()}_genCmdId(){return++this.commandId}};var da=()=>`${location.protocol}//${location.host}/`,ha=s=>s*1e3+Date.now();function ua(){let{protocol:s,host:t,pathname:e,search:n}=location;return`${s}//${t}${e}${n}`}function pa(s,t,e,n){let o=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(o+=`&client_id=${encodeURIComponent(t)}`),n&&(o+=`&state=${encodeURIComponent(n)}`),o}function fa(s,t,e,n){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=pa(s,t,e,n)}async function Ci(s,t,e){let n=typeof location<"u"&&location;if(n&&n.protocol==="https:"){let a=document.createElement("a");if(a.href=s,a.protocol==="http:"&&a.hostname!=="localhost")throw 5}let o=new FormData;t!==null&&o.append("client_id",t),Object.keys(e).forEach(a=>{o.append(a,e[a])});let i=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:o});if(!i.ok)throw i.status===400||i.status===403?2:new Error("Unable to fetch tokens");let r=await i.json();return r.hassUrl=s,r.clientId=t,r.expires=ha(r.expires_in),r}function _i(s,t,e){return Ci(s,t,{code:e,grant_type:"authorization_code"})}function ga(s){return btoa(JSON.stringify(s))}function ma(s){return JSON.parse(atob(s))}var Xn=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await Ci(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function Pi(s={}){let t,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let n=s.clientId!==void 0?s.clientId:da(),o=s.limitHassInstance===!0;if(s.authCode&&e&&(t=await _i(e,n,s.authCode),s.saveTokens&&s.saveTokens(t)),!t){let i=wi(location.search.substr(1));if("auth_callback"in i){let r=ma(i.state);if(o&&(r.hassUrl!==e||r.clientId!==n))throw 6;t=await _i(r.hassUrl,r.clientId,i.code),s.saveTokens&&s.saveTokens(t)}}if(!t&&s.loadTokens&&(t=await s.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new Xn(t,s.saveTokens);if(e===void 0)throw 4;return fa(e,n,s.redirectUrl||ua(),ga({hassUrl:e,clientId:n})),new Promise(()=>{})}async function Mi(s){let t=Object.assign({setupRetry:0,createSocket:Ti},s),e=await t.createSocket(t);return new rn(e,t)}function U(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function Ne(s){let t=Math.floor(Math.round(s)/60)%24;return`${U(s)} ${t<12?"AM":"PM"}`}function Ai(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function mt(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function ln(s){return s?`${mt(Math.abs(s))} ${s<0?"early":"late"}`:"on time"}function Jn(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var ba=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),va=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),ya=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function an(s){return new Date(`${s}T12:00:00Z`)}function Ae(s){let t=an(s);return`${ba.format(t)}, ${ya.format(t)}`}function ye(s){return va.format(an(s))}function Le(s,t){return Math.round((an(t).getTime()-an(s).getTime())/864e5)}function Dt(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return Dt("UTC",t)}let n=o=>e.find(i=>i.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function cn(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=Dt(e,s),i=Dt(e,t).date;return o.date===i?`at ${Ne(o.minutes)}`:`on ${ye(o.date)} at ${Ne(o.minutes)}`}var ne=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}};function Di(s){switch(s.code){case"connection_lost":case"timeout":return"Can’t reach Home Assistant";case"not_running":return"MyDashLight isn’t running";default:return"Couldn’t get the latest plan"}}var Xe="mydashlight",xa=7,Zn=3e4,Si=3e4;function Qn(s){if(s instanceof ne)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new ne(String(t.code??"error"),t.message)}return typeof s=="number"?new ne("connection_lost","Lost the connection to Home Assistant."):new ne("error",String(s))}function Li(s,t){return new Promise((e,n)=>{let o=setTimeout(()=>n(new ne("timeout","Home Assistant didn’t answer.")),t);s.then(i=>{clearTimeout(o),e(i)},i=>{clearTimeout(o),n(i)})})}var Rt=class{constructor(t,e,n,o){this.live=!1;this.unsub=null;this.opening=!1;this.gen=0;this.closed=!1;this.onReady=()=>this.open();this.onDisconnected=()=>this.dropped();this.conn=t,this.type=e,this.onMessage=n,this.onFailed=o,t.addEventListener?.("ready",this.onReady),t.addEventListener?.("disconnected",this.onDisconnected)}get isOpen(){return this.unsub!==null||this.opening}open(){if(this.closed||this.isOpen||this.conn.connected===!1)return;let t=++this.gen;this.opening=!0,this.conn.subscribeMessage(e=>{t===this.gen&&(this.live=!0,this.onMessage(e))},{type:this.type},{resubscribe:!1}).then(e=>{if(t!==this.gen){e().catch(()=>{});return}this.opening=!1,this.unsub=e},e=>{t===this.gen&&(this.opening=!1,this.live=!1,this.onFailed(e))})}dropped(){this.gen++,this.opening=!1,this.unsub=null,this.live=!1}close(){this.closed=!0,this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsub;this.dropped(),t&&t().catch(()=>{})}},dn=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.rides=null;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new ne("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.rides?.live??!1}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.rides=new Rt(this.conn,`${Xe}/rides/subscribe`,t=>{t.plan?this.emit(t.plan):this.fail(new ne("not_running","MyDashLight isn’t running right now."))},()=>{}),this.rides.open(),this.timer=setInterval(()=>{this.live||(this.refresh(),this.rides?.open())},Zn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected),this.rides?.close(),this.rides=null}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await Li(this.conn.sendMessagePromise({type:"call_service",domain:Xe,service:"get_plan",service_data:{days:xa},return_response:!0}),Si);this.emit(t.response)}catch(t){this.fail(Qn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Xe,service:t,service_data:e})}catch(n){throw Qn(n)}this.live||await this.refresh()}setRide(t,e,n,o,i){return this.call("set_ride",i===void 0?{event:t,side:e,driver:n,scope:o}:{event:t,side:e,driver:n,scope:o,stay:i})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:Jn(e),scope:n})}setLeaveBy(t,e,n){return this.call("set_leave_by",e==null?{event:t,scope:n}:{event:t,time:Jn(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}setPeople(t,e,n,o){return this.call("set_people",{event:t,people:e,scope:n,...o?{driver:o.driver,riders:o.riders}:{}})}watchChores(t){let e=!1,n=!1,o=async()=>{try{let a=await Li(this.conn.sendMessagePromise({type:"call_service",domain:Xe,service:"get_chores",service_data:{},return_response:!0}),Si);if(e)return;n=!0,t(a.response??null)}catch{!e&&!n&&t(null)}},i=new Rt(this.conn,`${Xe}/chores/subscribe`,a=>{e||(n=!0,t(a.chores))},()=>void o());i.open();let r=setInterval(()=>{i.live||i.open()},Zn);return()=>{e=!0,clearInterval(r),i.close()}}watchLunch(t){let e=!1,n=!1,o=new Rt(this.conn,`${Xe}/lunch/subscribe`,r=>{e||(n=!0,t(r.lunch))},()=>{!e&&!n&&t(null)});o.open();let i=setInterval(()=>{o.live||o.open()},Zn);return()=>{e=!0,clearInterval(i),o.close()}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Xe,service:t,service_data:e})}catch(n){throw Qn(n)}}};var hn=globalThis,un=hn.ShadowRoot&&(hn.ShadyCSS===void 0||hn.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,es=Symbol(),Ri=new WeakMap,It=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==es)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(un&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Ri.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Ri.set(e,t))}return t}toString(){return this.cssText}},Ii=s=>new It(typeof s=="string"?s:s+"",void 0,es),Je=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,o,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new It(e,s,es)},Oi=(s,t)=>{if(un)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=hn.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}},ts=un?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Ii(e)})(s):s;var{is:wa,defineProperty:ka,getOwnPropertyDescriptor:$a,getOwnPropertyNames:Ta,getOwnPropertySymbols:Ea,getPrototypeOf:_a}=Object,pn=globalThis,Bi=pn.trustedTypes,Ca=Bi?Bi.emptyScript:"",Pa=pn.reactiveElementPolyfillSupport,Ot=(s,t)=>s,ns={toAttribute(s,t){switch(t){case Boolean:s=s?Ca:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},ji=(s,t)=>!wa(s,t),Ni={attribute:!0,type:String,converter:ns,reflect:!1,useDefault:!1,hasChanged:ji};Symbol.metadata??=Symbol("metadata"),pn.litPropertyMetadata??=new WeakMap;var je=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ni){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&ka(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:i}=$a(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let a=o?.call(this);i?.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ni}static _$Ei(){if(this.hasOwnProperty(Ot("elementProperties")))return;let t=_a(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ot("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ot("properties"))){let e=this.properties,n=[...Ta(e),...Ea(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(ts(o))}else t!==void 0&&e.push(ts(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Oi(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:ns).toAttribute(e,n.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=n.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:ns;this._$Em=o;let a=r.fromAttribute(e,i.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(t,e,n,o=!1,i){if(t!==void 0){let r=this.constructor;if(o===!1&&(i=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??ji)(i,e)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:i},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,i]of n){let{wrapped:r}=i,a=this[o];r!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,i,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};je.elementStyles=[],je.shadowRootOptions={mode:"open"},je[Ot("elementProperties")]=new Map,je[Ot("finalized")]=new Map,Pa?.({ReactiveElement:je}),(pn.reactiveElementVersions??=[]).push("2.1.2");var is=globalThis,zi=s=>s,fn=is.trustedTypes,Hi=fn?fn.createPolicy("lit-html",{createHTML:s=>s}):void 0,os="$lit$",ze=`lit$${Math.random().toFixed(9).slice(2)}$`,rs="?"+ze,Ma=`<${rs}>`,et=document,Nt=()=>et.createComment(""),jt=s=>s===null||typeof s!="object"&&typeof s!="function",as=Array.isArray,Gi=s=>as(s)||typeof s?.[Symbol.iterator]=="function",ss=`[ 	
\f\r]`,Bt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ui=/-->/g,Fi=/>/g,Ze=RegExp(`>|${ss}(?:([^\\s"'>=/]+)(${ss}*=${ss}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ki=/'/g,Wi=/"/g,qi=/^(?:script|style|textarea|title)$/i,ls=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),f=ls(1),re=ls(2),mh=ls(3),He=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),Vi=new WeakMap,Qe=et.createTreeWalker(et,129);function Yi(s,t){if(!as(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Hi!==void 0?Hi.createHTML(t):t}var Xi=(s,t)=>{let e=s.length-1,n=[],o,i=t===2?"<svg>":t===3?"<math>":"",r=Bt;for(let a=0;a<e;a++){let c=s[a],d,u,l=-1,h=0;for(;h<c.length&&(r.lastIndex=h,u=r.exec(c),u!==null);)h=r.lastIndex,r===Bt?u[1]==="!--"?r=Ui:u[1]!==void 0?r=Fi:u[2]!==void 0?(qi.test(u[2])&&(o=RegExp("</"+u[2],"g")),r=Ze):u[3]!==void 0&&(r=Ze):r===Ze?u[0]===">"?(r=o??Bt,l=-1):u[1]===void 0?l=-2:(l=r.lastIndex-u[2].length,d=u[1],r=u[3]===void 0?Ze:u[3]==='"'?Wi:Ki):r===Wi||r===Ki?r=Ze:r===Ui||r===Fi?r=Bt:(r=Ze,o=void 0);let b=r===Ze&&s[a+1].startsWith("/>")?" ":"";i+=r===Bt?c+Ma:l>=0?(n.push(d),c.slice(0,l)+os+c.slice(l)+ze+b):c+ze+(l===-2?a:b)}return[Yi(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},zt=class s{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let i=0,r=0,a=t.length-1,c=this.parts,[d,u]=Xi(t,e);if(this.el=s.createElement(d,n),Qe.currentNode=this.el.content,e===2||e===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(o=Qe.nextNode())!==null&&c.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(let l of o.getAttributeNames())if(l.endsWith(os)){let h=u[r++],b=o.getAttribute(l).split(ze),x=/([.?@])?(.*)/.exec(h);c.push({type:1,index:i,name:x[2],strings:b,ctor:x[1]==="."?mn:x[1]==="?"?bn:x[1]==="@"?vn:nt}),o.removeAttribute(l)}else l.startsWith(ze)&&(c.push({type:6,index:i}),o.removeAttribute(l));if(qi.test(o.tagName)){let l=o.textContent.split(ze),h=l.length-1;if(h>0){o.textContent=fn?fn.emptyScript:"";for(let b=0;b<h;b++)o.append(l[b],Nt()),Qe.nextNode(),c.push({type:2,index:++i});o.append(l[h],Nt())}}}else if(o.nodeType===8)if(o.data===rs)c.push({type:2,index:i});else{let l=-1;for(;(l=o.data.indexOf(ze,l+1))!==-1;)c.push({type:7,index:i}),l+=ze.length-1}i++}}static createElement(t,e){let n=et.createElement("template");return n.innerHTML=t,n}};function tt(s,t,e=s,n){if(t===He)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,i=jt(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=tt(s,o._$AS(s,t.values),o,n)),t}var gn=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??et).importNode(e,!0);Qe.currentNode=o;let i=Qe.nextNode(),r=0,a=0,c=n[0];for(;c!==void 0;){if(r===c.index){let d;c.type===2?d=new bt(i,i.nextSibling,this,t):c.type===1?d=new c.ctor(i,c.name,c.strings,this,t):c.type===6&&(d=new yn(i,this,t)),this._$AV.push(d),c=n[++a]}r!==c?.index&&(i=Qe.nextNode(),r++)}return Qe.currentNode=et,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},bt=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),jt(t)?t===E||t==null||t===""?(this._$AH!==E&&this._$AR(),this._$AH=E):t!==this._$AH&&t!==He&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Gi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==E&&jt(this._$AH)?this._$AA.nextSibling.data=t:this.T(et.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=zt.createElement(Yi(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new gn(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=Vi.get(t.strings);return e===void 0&&Vi.set(t.strings,e=new zt(t)),e}k(t){as(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let i of t)o===e.length?e.push(n=new s(this.O(Nt()),this.O(Nt()),this,this.options)):n=e[o],n._$AI(i),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=zi(t).nextSibling;zi(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},nt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,i){this.type=1,this._$AH=E,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=E}_$AI(t,e=this,n,o){let i=this.strings,r=!1;if(i===void 0)t=tt(this,t,e,0),r=!jt(t)||t!==this._$AH&&t!==He,r&&(this._$AH=t);else{let a=t,c,d;for(t=i[0],c=0;c<i.length-1;c++)d=tt(this,a[n+c],e,c),d===He&&(d=this._$AH[c]),r||=!jt(d)||d!==this._$AH[c],d===E?t=E:t!==E&&(t+=(d??"")+i[c+1]),this._$AH[c]=d}r&&!o&&this.j(t)}j(t){t===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},mn=class extends nt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===E?void 0:t}},bn=class extends nt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==E)}},vn=class extends nt{constructor(t,e,n,o,i){super(t,e,n,o,i),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??E)===He)return;let n=this._$AH,o=t===E&&n!==E||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==E&&(n===E||o);o&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},yn=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}},Ji={M:os,P:ze,A:rs,C:1,L:Xi,R:gn,D:Gi,V:tt,I:bt,H:nt,N:bn,U:vn,B:mn,F:yn},Aa=is.litHtmlPolyfillSupport;Aa?.(zt,bt),(is.litHtmlVersions??=[]).push("3.3.3");var Zi=(s,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let i=e?.renderBefore??null;n._$litPart$=o=new bt(t.insertBefore(Nt(),i),i,void 0,e??{})}return o._$AI(s),o};var cs=globalThis,Pe=class extends je{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Zi(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return He}};Pe._$litElement$=!0,Pe.finalized=!0,cs.litElementHydrateSupport?.({LitElement:Pe});var Sa=cs.litElementPolyfillSupport;Sa?.({LitElement:Pe});(cs.litElementVersions??=[]).push("4.2.2");var Qi={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},eo=s=>(...t)=>({_$litDirective$:s,values:t}),xn=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:La}=Ji,to=s=>s;var no=()=>document.createComment(""),vt=(s,t,e)=>{let n=s._$AA.parentNode,o=t===void 0?s._$AB:t._$AA;if(e===void 0){let i=n.insertBefore(no(),o),r=n.insertBefore(no(),o);e=new La(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,a=r!==s;if(a){let c;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(c=s._$AU)!==r._$AU&&e._$AP(c)}if(i!==o||a){let c=e._$AA;for(;c!==i;){let d=to(c).nextSibling;to(n).insertBefore(c,o),c=d}}}return e},Ke=(s,t,e=s)=>(s._$AI(t,e),s),Da={},so=(s,t=Da)=>s._$AH=t,io=s=>s._$AH,wn=s=>{s._$AR(),s._$AA.remove()};var oo=(s,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(s[o],o);return n},De=eo(class extends xn{constructor(s){if(super(s),s.type!==Qi.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],i=[],r=0;for(let a of s)o[r]=n?n(a,r):r,i[r]=e(a,r),r++;return{values:i,keys:o}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let o=io(s),{values:i,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,i;let a=this.ut??=[],c=[],d,u,l=0,h=o.length-1,b=0,x=i.length-1;for(;l<=h&&b<=x;)if(o[l]===null)l++;else if(o[h]===null)h--;else if(a[l]===r[b])c[b]=Ke(o[l],i[b]),l++,b++;else if(a[h]===r[x])c[x]=Ke(o[h],i[x]),h--,x--;else if(a[l]===r[x])c[x]=Ke(o[l],i[x]),vt(s,c[x+1],o[l]),l++,x--;else if(a[h]===r[b])c[b]=Ke(o[h],i[b]),vt(s,o[l],o[h]),h--,b++;else if(d===void 0&&(d=oo(r,b,x),u=oo(a,l,h)),d.has(a[l]))if(d.has(a[h])){let m=u.get(r[b]),$=m!==void 0?o[m]:null;if($===null){let S=vt(s,o[l]);Ke(S,i[b]),c[b]=S}else c[b]=Ke($,i[b]),vt(s,o[l],$),o[m]=null;b++}else wn(o[h]),h--;else wn(o[l]),l++;for(;b<=x;){let m=vt(s,c[x+1]);Ke(m,i[b]),c[b++]=m}for(;l<=h;){let m=o[l++];m!==null&&wn(m)}return this.ut=r,so(s,c),He}});var kn=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function pe(s){return kn[(s%kn.length+kn.length)%kn.length]}var $n="#23272E",ds="35,39,46";var hs=3,Kt=36,us=12,Tn=8,ro=30,Re=16,Ht=100,xt=60,Ra=120,ao=44,lo=20,Ia=45,Oa=30,co=20,gs=10,_n=30,ms=10,Ba=150,Na=150,Pn=1;function vo(s,t){return s.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??Kt}function ja(s,t,e){return 10+10.2*s.length+(t?30+8*t.length:0)+8+12+6.8*e.length+12+4}var za=26,yo=4;function vs(s,t){let e=Math.max(Ba,Na/Pn);return Math.ceil(xt+Math.max(0,s-1)*gs+_n+Math.max(0,t-1)*ms+e*(s+Pn*t))}function ke(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function se(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function $e(s){return new Map(ke(s).map((t,e)=>[t,pe(e)]))}function be(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function ce(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function ys(s,t){return t==="none"?"Not needed":se(s).includes(t)?ce(s,t):t}function Ha(s){return s.leave_by!=null&&s.leave_by>s.start&&s.leave_by!==s.end?` · leave ${U(s.leave_by)}`:""}function Mn(s){if(s.busy_why==="days"){if(s.start<=0&&s.end>=1440)return"All day";if(s.start<=0)return`Until ${U(s.end)}`;if(s.end>=1440)return`From ${U(s.start)}`}return`${U(s.start)}–${U(s.end)}`}function An(s,t){return t.own?ce(s,t.own):be(s,t.kid)}var it={color:$n,rgb:ds,ink:$n};function xo(s,t){return t.own?it:$e(s).get(t.kid)??pe(0)}function Ua(s,t){let e=ke(s);return t.along.map(n=>e.includes(n)?be(s,n):ce(s,n))}function ot(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function Fa(s,t){let e=ke(s),n=se(s).filter(a=>t.includes(a)),o=e.filter(a=>t.includes(a)),i=e.length>1&&o.length===e.length;if(i&&n.length===se(s).length)return"Everyone";let r=[...n.map(a=>ce(s,a)),...i?["the kids"]:o.map(a=>be(s,a))];return r.length<2?r.join(""):`${r.slice(0,-1).join(", ")} & ${r[r.length-1]}`}function Ka(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function Cn(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function ps(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(Cn(t,n.from)),e.push(Cn(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(Cn(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Wa(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,a)=>r.s-a.s||a.en-r.en),e=[],n=[],o=-1/0,i=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(i(),o=-1/0);let a=n.findIndex(c=>c<=r.s);a<0?(a=n.length,n.push(r.en)):n[a]=r.en,r.col=a,e.push(r),o=Math.max(o,r.en)}return i(),t}function Va(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return s[s.length-1].y}function Ga(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return s[s.length-1].t}function wo(s,t){return Va(s.anchors,t)}function xs(s,t){return Ga(s.anchors,t)}function qa(s,t){let e=ke(s),n=se(s),o=Math.max(t,vs(e.length,n.length)),r=(o-xt-Math.max(0,e.length-1)*gs-_n-Math.max(0,n.length-1)*ms)/(e.length+Pn*n.length||1),a=Math.floor(r),c=Math.floor(r*Pn),d=s.whole_week??s.days,u=new Map;for(let m of d)for(let $ of m.events)for(let S of $.own?$.along:[$.kid]){let g=u.get(S)??[];g.some(M=>M.event_id===$.event_id&&M.calendar_id===$.calendar_id)||g.push($),u.set(S,g)}let l=$e(s),h=[],b=xt;e.forEach((m,$)=>{let S=u.get(m)??[],g=s.days.some(M=>M.events.some(N=>N.kid===m&&(N.sides.includes("drop")&&N.drop===""||N.sides.includes("pick")&&N.pick==="")));h.push({id:m,kind:"kid",x:b,w:a,name:be(s,m),dot:l.get(m).color,rgb:l.get(m).rgb,sub:`${g?"Needs a ride · ":""}${S.length} this week`,subWarn:g}),b+=a+($<e.length-1?gs:0)});let x=b+_n/2;return b+=_n,n.forEach((m,$)=>{let S=0,g=0;for(let M of d){let N=M.drivers[m];N&&(S+=N.outings.length,g+=N.drive??0)}h.push({id:m,kind:"driver",x:b,w:c,name:ce(s,m),dot:$n,rgb:ds,sub:`${S} ${S===1?"trip":"trips"} this week · ${mt(g)} driving`,subWarn:!1}),b+=c+($<n.length-1?ms:0)}),{columns:h,sepX:x,width:o}}function Ya(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function ho(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${U(s.start)}`:e||!t?`${s.title} until ${U(s.end)}`:`${s.title} ${U(s.start)}–${U(s.end)}`}function ws(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length+(s.unplaced?.length??0)}function ks(s,t){let e=Le(t,s);return e===0?"Today":e===1?"Tomorrow":""}function me(s,t=0){return s==null||!Number.isFinite(s)?t:s}var bs=null;function ko(s){bs=s}var En='Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif',yt={title:`800 14.5px ${En}`,time:`400 12px ${En}`,line:`600 12px ${En}`,stop:`400 12px ${En}`};function Xa(s,t,e){let n=Math.max(8,Math.floor(t/e)),o=1,i=0;for(let r of s.split(/[ \t\n]+/).filter(Boolean)){let a=r.length;for(i===0?i=a:i+1+a<=n?i+=1+a:(o++,i=a);i>n;)o++,i-=n}return o}function Ja(s,t,e,n){let o=s.split(/[ \t\n]+/).filter(Boolean),i=1,r="";for(let a of o){let c=r?`${r} ${a}`:a,d=n(c,e);if(d==null)return null;if(d<=t){r=c;continue}r&&i++;let u=n(a,e);if(u==null)return null;u>t&&(i+=Math.ceil(u/t)-1),r=a}return i}function Ut(s,t,e=7,n){if(n&&bs){let o=Ja(s,t-.5,n,bs);if(o!=null)return o}return Xa(s,t,e)}var $o=25,Za=15,To=3;function uo(s){return Math.max(0,Math.min(To,Math.floor((s-$o)/Za)))}var Qa=$o+2,po=20;function fo(s,t="Home"){let e=/^(\d+:\d\d)\s+(.+)$/.exec(s.at(-1)??"");return e&&e[2]===t?e[1]:null}function fs(s,t,e,n){let o=t.drivers[e],i=o?.home;if(!i)return s;let r=n==null?void 0:o.outings.find(a=>(a.start??1/0)<=n&&n<(a.end??-1/0));return new Map(s).set(i.place,i.name).set("home",r?.home??i.name)}var Ft="🚗";function go(s,t){if(s===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,i,r,a=!1)=>({at:o,who:i,stays:a,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(s))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(s))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with |With )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(s))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}return null}var mo={muted:0,normal:1,pending:2,problem:3};function el(s){let{drop:t,pick:e}=s,n=t?go(t.text,"drop"):null,o=e?go(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return s;let i=[t,e].reduce((c,d)=>d&&(mo[d.tone]??1)>(mo[c]??1)?d.tone:c,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${Ft} No rides yet`,tone:i},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let c=`${Ft} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${c} both ways`,tone:i},pick:null}:!n.at||!o.at?{drop:{text:`${c} both ways · ${n.at?`↓${n.at}`:`↑${o.at}`}`,tone:i},pick:null}:{drop:{text:`${c} ↓${n.at} ↑${o.at}`.trimEnd(),tone:i},pick:null}}let r=(c,d)=>c==="needed"?`${d} needed`:`${d}${c.at?`${c.at} `:" "}${c.who}${c.stays?" stays":""}${c.extra}`,a=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${Ft} ${a.join(" · ")}`,tone:i},pick:null}}function tl(s,t){return!t&&!!s.drop&&!s.pick&&s.drop.tone==="muted"}var nl=5,sl=13;function il(s,t,e={}){let n=e.clash?4:2,o=t-n-13-9,i=n+2*nl;i+=Ut(s.title,o-(e.noted?sl:0),9,yt.title)*18;let r=s.inline&&s.drop?`${s.time} · ${s.drop.text}`:s.time;return i+=1+Ut(r,o,6.6,s.inline?yt.line:yt.time)*16,s.drop&&!s.inline&&(i+=1+Ut(s.drop.text,o,7,yt.line)*16),s.pick&&(i+=2+Ut(s.pick.text,o,7,yt.line)*16),Math.ceil(i)+1}function bo(s,t="Home"){let e=/^(\S+\s+)(.+?), get (.+)$/u.exec(s);return e&&e[2]===t?`${e[1]}${t} ↑ ${e[3]}`:s.replace(/, drop off (.+)$/u," ↓ $1").replace(/, pick up (.+)$/u," ↑ $1")}function ol(s,t){let e=s.reduce((n,o)=>n+Ut(o,t-20,7,yt.stop),0);return 28+s.length+e*16+1}function Eo(s,t,e,n){let o=t==="compact",{columns:i,sepX:r,width:a}=qa(s,e),c=new Map(i.map(g=>[g.id,g])),d=ke(s),u=se(s),l=[...d,...u],h=$e(s),b=Ka(s),x=g=>be(s,g),m=g=>ce(s,g),$={mode:t,width:a,height:0,columns:i,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],folds:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},S=0;return s.days.forEach((g,M)=>{let N=M*1440,W=new Map(g.events.map(p=>[p.id,p])),de=p=>p&&W.has(p)?{day:g.date,event:p}:null,T=ws(g),_=g.events.length,k=ks(g.date,n.date),C=Ae(g.date),P=(_?`${_} ${_===1?"activity":"activities"}${g.done?" left":""}`:g.done?"All done for today":"Nothing scheduled")+(T?` · ${T} to sort out`:""),L=pl(s,g,h,a,a-ja(C,k,P));$.dayHeads.push({date:g.date,y:S,label:C,tag:k,sub:P,warn:T>0,h:Kt+(L&&L.h?L.h+yo+2:0),allDay:L?.chips??[],inline:L?.inline??0}),$.anchors.push({t:N,y:S});let j=$.dayHeads[$.dayHeads.length-1],F=S+j.h+us,Y=u.flatMap(p=>g.drivers[p]?.outings??[]);if(!_&&!Y.length){$.empties.push({key:g.date,y:F,text:g.done?"Nothing else today":"Nothing planned"}),S=F+40,$.anchors.push({t:N+1439,y:S});return}let J=(p,y,v=p.kid)=>{let w=!!p.own&&v===p.own,R=!!p.own&&v!==p.own,I=w?m(v):x(v),B=R?{drop:{text:`${y?`${Ft} `:""}With ${m(p.own)}`,tone:p.attending===!1?"muted":"normal"},pick:null}:y&&!p.own?el(p.lines):p.lines,G=w?Ua(s,p):[],H=(p.takes!=null?`${p.takes} min, any time ${U(p.start)}–${U(p.end)}`:Mn(p)+(p.arrive_by!=null?` · arrive ${U(p.arrive_by)}`:"")+Ha(p))+(G.length?` · with ${ot(G)}`:"");return{who:I,mine:w,title:Ya(p.title,I),time:H,drop:B.drop,pick:B.pick,inline:y&&tl(B,p.attending===!1)}},z=(p,y,v,w)=>il(J(p,!0,v),y,{noted:!!p.notes,clash:w}),X=(p,y,v,w,R,I,B,G=p.kid)=>{let H=J(p,B,G),Z=H.mine?it:h.get(G)??pe(0),Se=H.who,A={drop:H.drop,pick:H.pick};return{key:`${g.date}|card|${p.id}`+(p.own?`|${G}`:""),x:y,y:v,w,h:R,target:{day:g.date,event:p.id},event:p,color:Z,kidName:Se,clash:I,stayed:!p.own&&p.stay&&u.includes(p.drop),skipped:p.attending===!1,title:H.title,time:H.time,drop:A.drop,pick:A.pick,showDrop:!!A.drop&&(B||R>=56),showPick:!!A.pick&&(B||R>=74),wrap:B,inline:H.inline,aria:`${Se}, ${p.title} ${p.takes!=null?`any time from ${U(p.start)} to ${U(p.end)}`:Mn(p).replace("–"," to ")}. `+(p.attending===!1&&!A.drop?"Not attending. ":"")+[A.drop,A.pick].filter(V=>!!V).map(V=>V.text).join(". ")}},he=p=>{let y=g.rides[p];return y?(g.drivers[y.driver]?.segments??[]).filter(w=>w.type!=="home"&&w.kids.includes(y.kid)&&me(w.start)>=me(y.start)&&me(w.end)<=me(y.end)):[]},Ee=p=>{let y=g.rides[p];if(!y)return null;let v=y.serves.find(w=>W.get(w)?.kid===y.kid);return de(v??y.serves[0])},Fe=(p,y)=>{if(y.event)return y;let v=g.events.find(w=>w.own&&w.own!==p&&w.along.includes(p)&&w.title===y.title);return v?{...y,title:`${y.title} with ${m(v.own)}`}:y},ue=p=>{if(p.takes==null)return[p.start,p.end];let y=p.planned??p.start;return[y,y+p.takes]},fe=new Map;for(let p of g.issues)p.level!=="problem"||!p.event||(p.kind==="late"&&fe.set(p.event,`${Math.round(me(p.minutes))} min late`),p.kind==="waiting"&&fe.set(`${p.event}|pick`,`Waits ${Math.round(me(p.minutes))} min`));if(!o){let p=1/0,y=-1/0;for(let A of g.events)A.start<=0&&A.end>=1440||(A.start>0?p=Math.min(p,A.start-20,A.arrive_by!=null?A.arrive_by-10:1/0):p=Math.min(p,A.end-30),A.end<1440?y=Math.max(y,A.end+20):y=Math.max(y,A.start+30));for(let A of Y)A.start!=null&&(p=Math.min(p,A.start)),A.end!=null&&(y=Math.max(y,A.end));let v=g.from;v!=null&&Number.isFinite(p)&&p<v+60?p=v-15:g.date===n.date&&Number.isFinite(p)&&n.minutes>p-60&&n.minutes<y&&(p=Math.min(p,n.minutes-15));let w=Number.isFinite(p)?Math.floor((p-5)/30)*30:900,R=Math.max(Number.isFinite(y)?Math.ceil((y+5)/30)*30:960,w+60),I=A=>v!=null&&me(A)<=w,B=A=>v!=null&&me(A)<w,G=al(rl(g,u,ue,g.date===n.date?n.minutes:null),w,R),H=A=>Math.round(F+ll(Math.max(w,Math.min(R,A))-w,G,w));$.anchors.push({t:N+w,y:H(w)});for(let A of G)$.anchors.push({t:N+A.from,y:H(A.from)},{t:N+A.to,y:H(A.to)}),$.folds.push({key:`${g.date}|fold|${A.from}`,y:H(A.from),h:H(A.to)-H(A.from),from:A.from,to:A.to,label:cl(A.to-A.from)});$.anchors.push({t:N+R,y:H(R)});let Z=(A,V)=>G.some(ie=>V?A>=ie.from&&A<=ie.to:A>ie.from&&A<ie.to);for(let A of d){let V=c.get(A),ie=h.get(A),Mt=(g.kids[A]?.items??[]).filter(D=>D.start!=null&&D.end!=null&&!I(D.end)).map(D=>({item:D,s:me(D.start),en:me(D.end)})),ve=[];for(let D of Wa(Mt)){let K=V.w/D.cols,q=Math.round(V.x+D.col*K),Q=Math.round(K-(D.cols>1?4:0)),ae=H(D.s),ee=D.item;if(ee.type==="act"){let Te=W.get(ee.event??"");if(!Te)continue;let sn=Math.max(30,H(D.en)-ae),ft=X(Te,q,ae,Q,sn,ee.clash,!1,A);if(ft.layer=Ht,ft.cut=B(D.s),$.cards.push(ft),Te.arrive_by!=null&&Te.start-Te.arrive_by>=5&&!ft.cut){let Gn=H(Te.arrive_by),fi={key:`${g.date}|prep|${Te.id}`,x:q,y:Gn,w:Q,h:ae-Gn+Re,color:ie,label:`Arrive by ${U(Te.arrive_by)}`,layer:Ht-1};$.preps.push(fi),ve.push({s:Te.arrive_by,en:D.en,top:Gn,bottom:ae+sn,x:q,w:Q,prep:fi,card:ft})}else ve.push({s:D.s,en:D.en,top:ae,bottom:ae+sn,x:q,w:Q,card:ft});let ui=fe.get(Te.id);ui&&$.marks.push({key:`${g.date}|late|${Te.id}`,x:q+Q-4,y:ae+4,text:ui,right:!0});let pi=fe.get(`${Te.id}|pick`);pi&&$.marks.push({key:`${g.date}|wait|${Te.id}`,x:q+4,y:ae+sn+2,text:pi,right:!1});continue}let oe=g.rides[ee.ride??-1];if(!oe)continue;let le=Math.max(22,H(D.en)-ae),Ye=ps(he(oe.index),fs(b,g,oe.driver,oe.start??void 0)),St=m(oe.driver),di={key:`${g.date}|ride|${oe.index}`,x:q,y:ae,w:Q,h:le,target:Ee(oe.index),l1:`${oe.own?"In":"Along in"} ${St}’s car`,l2:Ye.join(" → "),show2:uo(le)>0,lines2:uo(le),dashed:!oe.own,clash:ee.clash,aria:`${x(A)} ${oe.own?"in":"riding along in"} ${St}’s car, ${U(me(oe.start))} to ${U(me(oe.end))}: ${Ye.join(" to ")}`};$.rides.push(di);let hi=c.get(oe.driver),Vn=null;hi&&(Vn={key:`${g.date}|band|${oe.index}`,x:q+Q,y:ae,w:Math.max(0,hi.x+8-(q+Q)),h:le,color:ie},$.bands.push(Vn)),ve.push({s:D.s,en:D.en,top:ae,bottom:ae+le,x:q,w:Q,ride:di,band:Vn})}let nn=D=>D.ride?.layer??(D.prep?Ht-1:Ht),At=(D,K,q,Q)=>{q>Re&&$.links.push({key:`${D.key}|link`,x:D.x,y:K,w:D.w,h:q,color:ie,layer:Q})},O=(D,K)=>{if(!(K.x<D.x||K.x+K.w>D.x+D.w)&&(D.x=K.x,D.w=K.w,D.ride.x=K.x,D.ride.w=K.w,D.band)){let q=D.band.x+D.band.w;D.band.x=K.x+K.w,D.band.w=Math.max(0,q-D.band.x)}},ge=new Set;for(let D of[...ve].sort((K,q)=>q.s-K.s)){let K=D.ride;if(!K)continue;let q=ve.filter(ee=>ee!==D&&ee.s>=D.en&&ee.s-D.en<=ro&&ee.top>=D.bottom).sort((ee,oe)=>ee.s-oe.s||ee.top-oe.top)[0];if(!q)continue;ge.add(D),O(D,q);let Q=nn(q),ae=q.top-D.bottom;At(K,D.bottom,ae+Re,Q-1),K.layer=Q-(ae>0?2:1),K.h+=Re,K.tuckBottom=Re}for(let D of[...ve].sort((K,q)=>K.s-q.s)){let K=D.ride;if(!K||ge.has(D))continue;let q=ve.filter(ee=>ee!==D&&ee.en<=D.s&&D.s-ee.en<=ro&&ee.bottom<=D.top&&(ee.card||ee.ride?.layer!=null)).sort((ee,oe)=>oe.en-ee.en||oe.bottom-ee.bottom)[0];if(!q)continue;O(D,q);let Q=q.ride?.layer??Ht,ae=D.top-q.bottom;At(K,q.bottom-Re,ae+Re,Q-1),K.layer=Q-(ae>0?2:1),K.y-=Re,K.h+=Re,K.tuckTop=Re}}for(let A of u){let V=c.get(A),ie=g.drivers[A];if(!ie)continue;let Mt=[],ve=null;for(let O of ie.segments)if(!(O.start==null||O.end==null)){if(O.type==="home"){ve=null;continue}if(O.type==="stay"){ve=null,Mt.push({type:"stay",g:O,s:O.start,en:O.end});continue}ve&&ve.en===O.start?(ve.en=O.end,ve.legs.push(O)):(ve={type:"trip",s:O.start,en:O.end,legs:[O]},Mt.push(ve))}let nn=new Set,At=(O,ge,D,K)=>{nn.add(O.id);let q=H(ge),Q=X(O,V.x+8,q,V.w-16,Math.max(30,H(D)-q),!1,!1,A);Q.cut=B(ge),K&&Q.drop?.tone==="normal"&&(Q.drop=null,Q.showDrop=!1),$.cards.push(Q)};for(let O of Mt){if(I(O.en))continue;let ge=H(O.s),D=Math.max(24,H(O.en)-ge);if(O.type==="stay"){let le=W.get(O.g.event??O.g.serves??"");if(le?.own===A){At(le,O.s,O.en,!0);continue}let Ye=le?h.get(le.kid)??pe(0):pe(0),St=O.g.kids.map(x);$.stays.push({cut:B(O.s),key:`${g.date}|stay|${A}|${O.s}`,x:V.x+8,y:ge,w:V.w-16,h:D,target:de(le?.id),color:Ye,l1:le?`At ${le.title} with ${x(le.kid)}`:"Staying",l2:`until ${U(O.en)}`+(St.length?` · ${St.join(" and ")} too`:"")});continue}let K=O.legs[0],q=O.legs[O.legs.length-1],Q=[];for(let le of O.legs)for(let Ye of le.kids)Q.includes(Ye)||Q.push(Ye);let ae=q.type==="drive"&&q.to==="home",ee=fs(b,g,A,O.s),oe=ps(O.legs,ee);$.trips.push({key:`${g.date}|trip|${A}|${O.s}`,x:V.x+8,y:ge,w:V.w-16,h:D,target:de(O.legs.find(le=>le.serves)?.serves),l1:K.type==="drive"&&K.from==="home"?`Leave ${U(O.s)}`:`From ${Cn(b,K.from??K.place)} ${U(O.s)}`,l2:oe.join(" → "),show2:D>=36,l3:ae?`${ee.get("home")??"Home"} ${U(O.en)}`:"",show3:ae&&D>=62,stops:null,kids:Q.map(le=>(h.get(le)??pe(0)).color),bad:O.legs.some(le=>le.overlaps_busy),aria:`${m(A)} drives ${oe.join(" to ")}, ${U(O.s)} to ${U(O.en)}`})}for(let O of ie.segments)if(!(!O.overlaps_busy||O.start==null||O.end==null))for(let ge of ie.busy){let D=Math.max(O.start,ge.start),K=Math.min(O.end,ge.end);K<=D||I(K)||$.overlaps.push({key:`${g.date}|overlap|${A}|${D}`,x:V.x+6,y:H(D)-2,w:V.w-12,h:Math.max(8,H(K)-H(D)+4)})}for(let O of g.events)if(O.own===A&&(!nn.has(O.id)&&!I(ue(O)[1])&&At(O,...ue(O),!1),O.takes!=null&&O.attending!==!1&&!I(O.end))){let ge=H(O.start);$.windows.push({key:`${g.date}|window|${O.id}`,x:V.x+4,y:ge,w:V.w-8,h:Math.max(24,H(O.end)-ge),label:`${O.title} · any time ${U(O.start)}–${U(O.end)}`})}for(let O of ie.busy){if(O.event||O.end<=w||O.start>=R)continue;let ge=Fe(A,O),D=H(ge.start),K=H(ge.end);$.busy.push({key:`${g.date}|busy|${A}|${ge.start}`,x:V.x+1,y:D,w:V.w-2,h:K-D,labelY:8,label:ho(ge,!1)})}}let Se=-1/0;for(let A=w;A<=R;A+=30)Z(A,!0)||$.grid.push({key:`${g.date}|grid|${A}`,y:H(A),strong:A%60===0}),(G.some(ie=>ie.from===A||ie.to===A)||A%60===0&&!Z(A,!1))&&H(A)-Se>=22&&($.hours.push({key:`${g.date}|hour|${A}`,y:H(A)-8,label:A%60===0?Ai(A):Ne(A)}),Se=H(A));g.date===n.date&&n.minutes>w&&n.minutes<R&&($.now={y:H(n.minutes),label:`Now ${U(n.minutes)}`}),S=H(R)+us;return}let te=[];for(let p of d){let y=c.get(p);for(let v of g.kids[p]?.items??[])if(v.start!=null){if(v.type==="act"){let w=W.get(v.event??"");if(!w)continue;te.push({col:p,s:v.start,h:z(w,y.w,p,v.clash),kind:"act",item:v})}else if(!g.rides[v.ride??-1]?.own){let w=g.rides[v.ride??-1],R=w?g.drivers[w.driver]?.outings.find(I=>I.start!=null&&I.start<=me(w.start)&&me(w.start)<=me(I.end,I.start)):void 0;te.push({col:p,s:R?.start??v.start,h:Qa,kind:"along",item:v})}}}for(let p of u){let y=g.drivers[p];if(!y)continue;for(let w of y.busy)w.event||te.push({col:p,s:w.start,h:32,kind:"busy",busy:Fe(p,w)});let v=c.get(p).w;for(let w of g.events)w.own!==p||!w.busy_only&&w.attending!==!1&&(w.takes==null||w.planned!=null)||te.push({col:p,s:ue(w)[0],h:z(w,v-16,p,!1),kind:"own",event:w});for(let w of y.outings){if(w.start==null)continue;let R=(fo(w.lines,w.home)?w.lines.slice(0,-1):w.lines).map(I=>bo(I,w.home));te.push({col:p,s:w.start,h:ol([...R,...w.warn?[w.warn]:[]],v-16),kind:"out",out:w})}}te.sort((p,y)=>p.s-y.s||l.indexOf(p.col)-l.indexOf(y.col));let _e=new Map,we=[],qe=new Map,Ce=F-po;for(let p=0;p<te.length;){let y=p,v=Ce+po;for(;y<te.length&&te[y].s===te[p].s;y++){let R=_e.get(te[y].col);R!=null&&(v=Math.max(v,R+Tn))}let w=new Set;for(let R=p;R<y;R++){let I=te[R],B=w.has(I.col)?_e.get(I.col)+Tn:v;w.add(I.col),_e.set(I.col,B+I.h)}qe.set(te[p].s,v),te[p].s>0&&$.hours.push({key:`${g.date}|hour|${te[p].s}`,y:v+2,label:Ne(te[p].s)}),Ce=v,p=y}_e.clear(),te.forEach((p,y)=>{let v=_e.get(p.col),w=Math.max(v!=null?v+Tn:F,qe.get(p.s));_e.set(p.col,w+p.h);let R=p.kind==="busy"?p.busy.end:p.kind==="act"?W.get(p.item.event??"")?.end??null:p.kind==="own"?ue(p.event)[1]:null;we.push({col:p.col,s:p.s,end:R,y:w,h:p.h,box:null}),$.anchors.push({t:N+p.s,y:w});let I=c.get(p.col);if(p.kind==="busy"){let B={key:`${g.date}|busy|${p.col}|${y}`,x:I.x+1,y:w,w:I.w-2,h:p.h,labelY:8,label:ho(p.busy,!0)};$.busy.push(B),we[we.length-1].box=B}else if(p.kind==="out"){let B=p.out,G=fo(B.lines,B.home),H=G?B.lines.slice(0,-1):B.lines;$.trips.push({key:`${g.date}|trip|${p.col}|${y}`,x:I.x+8,y:w,w:I.w-16,h:p.h,target:de(B.target),l1:G?`${B.lead} · ${B.home&&B.home!=="Home"?B.home:"home"} ${G}`:B.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...H.map(Z=>({text:bo(Z,B.home),warn:!1})),...B.warn?[{text:B.warn,warn:!0}]:[]],kids:B.kids.map(Z=>(h.get(Z)??pe(0)).color),bad:!!B.warn,aria:`${m(p.col)}: ${B.lead}. ${B.lines.join(". ")}${B.warn?`. ${B.warn}`:""}`})}else if(p.kind==="own"){let B=X(p.event,I.x+8,w,I.w-16,p.h,!1,!0,p.col);$.cards.push(B),we[we.length-1].box=B}else if(p.kind==="act"){let B=W.get(p.item.event??""),G=X(B,I.x,w,I.w,p.h,p.item.clash,!0,p.col);$.cards.push(G),we[we.length-1].box=G}else{let B=g.rides[p.item.ride??-1],G=ps(he(B.index),fs(b,g,B.driver,B.start??void 0)),H=m(B.driver);$.rides.push({key:`${g.date}|ride|${B.index}`,x:I.x,y:w,w:I.w,h:p.h,target:Ee(B.index),l1:`${Ft} with ${H}`,l2:G.join(" → "),show2:!1,lines2:To,dashed:!0,clash:p.item.clash,aria:`${x(p.col)} riding along with ${H}, ${U(me(B.start))} to ${U(me(B.end))}: ${G.join(" to ")}`})}});let Be=F;for(let p of _e.values())Be=Math.max(Be,p);for(let p of we){if(!p.box||p.end==null)continue;let y=p.y+p.h;for(let v of we)v.col!==p.col&&v.s>=p.s&&v.s<p.end&&(y=Math.max(y,v.y+v.h));p.end>=1440&&(y=Be);for(let v of we)v.col===p.col&&v.y>p.y&&(y=Math.min(y,v.y-Tn));y=Math.min(y,Be),y>p.y+p.h&&(p.box.h=y-p.y)}S=Be+us+6,$.anchors.push({t:N+1439,y:S})}),$.height=S,$}function rl(s,t,e,n){let o=[],i=(r,a)=>{r==null||a==null||o.push([r-lo,Math.min(a,r+Ia)+co],[Math.max(r,a-Oa)-lo,a+co])};for(let r of s.events)r.own?(i(...e(r)),r.takes!=null&&i(r.start,r.end)):i(r.arrive_by??r.start,r.end);for(let r of Object.values(s.kids))for(let a of r.items??[])i(a.start,a.end);for(let r of t){let a=s.drivers[r];if(a){for(let c of a.segments)c.type!=="home"&&i(c.start,c.end);for(let c of a.outings)i(c.start,c.end);for(let c of a.busy)i(c.start,c.end)}}return n!=null&&o.push([n-30,n+30]),o}function al(s,t,e){let n=s.map(([c,d])=>[Math.max(t,c),Math.min(e,d)]).filter(([c,d])=>d>c).sort((c,d)=>c[0]-d[0]),o=[],i=t,r=(c,d)=>{let u=Math.ceil(c/30)*30,l=Math.floor(d/30)*30;l-u>=Ra&&o.push({from:u,to:l})},a=!1;for(let[c,d]of n)a&&c>i&&r(i,c),i=a?Math.max(i,d):d,a=!0;return o}function ll(s,t,e){let n=s*hs,o=e+s;for(let i of t){let r=i.to-i.from;o>=i.to?n-=r*hs-ao:o>i.from&&(n-=(o-i.from)*hs-(o-i.from)/r*ao)}return n}function cl(s){let t=Math.floor(s/60),e=s%60>=30;return`${t}${e?"½":""} hrs`}var dl=["","¼","½","¾"];function st(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return mt(n);let o=Math.round(n*4),i=Math.floor(o/4),r=dl[o%4];return`${i||!r?i:""}${r} min`})}function _o(s){let t=e=>e?{...e,text:st(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(st),warn:i.warn==null?i.warn:st(i.warn)}))}])),issues:e.issues.map(n=>({...n,title:st(n.title),body:st(n.body),note:n.note==null?n.note:st(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:st(o.note)}))}:{}}))}))}}var hl=2,ul=48;function Co(s,t,e=ul){let n=[],o=new Set(se(s)),i=ke(s).map(h=>be(s,h)),r=i.length>1?i.slice(0,2):[i[0]??"Ava","Ben"],a=0,c=0,d=0,u=0,l=t.minutes+e*60;for(let h of s.days){let b=Le(t.date,h.date),x=b===0?"":`${ye(h.date)} · `,m=new Map(h.events.map(g=>[g.id,g])),$=g=>g&&m.has(g)?{day:h.date,event:g}:null,S=(g,M)=>b*1440+(g??m.get(M??"")?.start??0)<l;for(let g of h.issues)if(g.level==="problem"){if(!S(g.at,g.event)){d++,g.kind==="unassigned"&&u++;continue}a++,g.kind==="unassigned"&&c++,n.push({key:`${h.date}|${g.key}`,tone:g.kind==="unassigned"?"unassigned":"problem",title:x+g.title,body:g.body,target:$(g.event),suggestions:(g.suggestions??[]).map(M=>({id:M.id,label:M.label,note:M.note}))})}if(h.clashes.forEach((g,M)=>{if(!S(g.a.start,g.a.event)){d++;return}a++;let N=m.get(g.a.event??""),W=be(s,g.kid),de=(_,k)=>{let C=$(k);return C?{text:_,target:C}:_},T=[];if(g.b.type==="act"){let _=m.get(g.b.event??"");N&&_&&(T=[de(N.title,N.id),` ${U(N.start)}–${U(N.end)} and `,de(_.title,_.id),` ${U(_.start)}–${U(_.end)} overlap.`])}else{let _=h.rides[g.b.ride??-1];N&&_&&(T=[`${W} is in `,de(`${ce(s,_.driver)}’s car`,_.serves[0]),` ${U(me(g.b.start))}–${U(me(g.b.end))}, during `,de(N.title,N.id),"."])}n.push({key:`${h.date}|clash|${M}`,tone:"problem",title:`${x}${W} is double-booked`,body:T.map(_=>typeof _=="string"?_:_.text).join(""),parts:T,target:null,suggestions:[]})}),b>=0&&b<hl)for(let g of h.issues)g.level!=="heads_up"||!S(g.at,g.event)||n.push({key:`${h.date}|${g.key}`,tone:"heads_up",title:x+g.title,body:g.body,target:$(g.event),suggestions:[]});for(let g of h.unplaced??[]){if(!S(g.at)){d++;continue}a++;let M=g.people.map(W=>o.has(W)?ce(s,W):be(s,W)),N=g.from_notes?"The For line in its notes":"Its title";n.push({key:`${h.date}|unplaced|${g.id}`,tone:"problem",title:`${x}${U(g.at)} ${g.title}: ${Po(g).toLowerCase()}`,body:g.reason==="unknown"&&g.word?`${N} names “${g.word}”, who isn’t anyone in the family, so ${M.length?`it’s only in ${ot(M)}’s lane`:"it isn’t on the board"}. Tap to pick who it’s for.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Tap to pick who it’s for, or start the title in Google Calendar with a name, such as “${r[0]} Piano”.`,target:null,suggestions:[],pick:{day:h.date,id:g.id}})}for(let g of h.events)!g.problems.length||!S(g.start)||n.push({key:`${h.date}|notes|${g.id}`,tone:"heads_up",title:`${x}Check the notes on ${An(s,g)}’s ${g.title}`,body:`These lines couldn’t be read: ${g.problems.join("; ")}`,target:$(g.id),suggestions:[]})}return{items:n,problems:a,unassigned:c,later:d,laterUnassigned:u}}function Po(s){return s.reason==="unknown"&&s.word?`Who is “${s.word}”?`:"Who is this for?"}function pl(s,t,e,n,o=0){let i=new Set(se(s)),r=x=>{let m=x[0];return m==null?null:i.has(m)?it:e.get(m)??null},a=[...(t.all_day??[]).map(x=>{let m=x.days>1?`Day ${x.day_number} of ${x.days}`:"";return{key:`${t.date}|allday|${x.id}`,title:x.stay?`🏨 ${x.title}`:x.title,note:x.stay?[Fa(s,x.people),m].filter(Boolean).join(" · "):m,color:r(x.people),cancelled:x.cancelled,warn:!1,pick:null,stay:x.stay&&!x.cancelled?x.id:null,notes:x.notes??""}}),...(t.unplaced??[]).map(x=>({key:`${t.date}|unplaced|${x.id}`,title:`${U(x.at)} ${x.title}`,note:Po(x),color:null,cancelled:!1,warn:!0,pick:x.id,stay:null,notes:x.notes??""}))];if(!a.length)return null;let c=Math.max(120,n-xt),d=(x,m=7)=>30+m*x.title.length+(x.note?Math.min(m,5.6)*(x.note.length+2):0)+(x.notes?16:0)+(x.stay?12:0),u=0,l=0;for(;u<a.length&&l+d(a[u],6.4)<=o;)l+=d(a[u++],6.4);let h=0;l=0;for(let x of a.slice(u)){let m=Math.min(c,d(x));(!h||l+m>c)&&(h++,l=0),l+=m}let b=h?h*za+(h-1)*yo:0;return{key:`${t.date}|allday`,h:b,chips:a,inline:u}}function Mo(s,t){let e=$e(s),n=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=Le(t.date,i.date);if(!(r<0))for(let a of se(s))for(let c of i.drivers[a]?.outings??[]){if(c.start==null)continue;let d=r*1440+c.start;if(r*1440+me(c.end,c.start)<=t.minutes)continue;let l=d-t.minutes,h={driver:a,name:ce(s,a),date:i.date,ahead:r,start:c.start,inMinutes:l,ongoing:l<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(b=>e.get(b)??pe(0)),warn:c.warn,target:c.target&&i.events.some(b=>b.id===c.target)?{day:i.date,event:c.target}:null};(!n||o(h)<o(n)||o(h)===o(n)&&h.inMinutes<n.inMinutes)&&(n=h)}}return n}function wt(s){return s.state==="done"||s.state==="late"}var fl=780;function gl(s,t,e){return s.state==="open"&&!!s.for_day&&s.due===t&&e<fl}function Ao(s,t){return s.chores.map(e=>gl(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function So(s){return s.state==="open"||s.state==="overdue"}function Es(s,t,e){if(wt(s)){let n=s.done_at?ml(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${$s(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${$s(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let o=Le(t,s.due);return`By ${o===1?"tomorrow":o<7?ye(s.due):Ts(s.due)}`}if(s.for_day&&s.due===t)return`Tonight · for ${$s(s.for_day,t)}`;if(s.due&&s.due>t){let n=Le(t,s.due);return n===1?"By tomorrow":`By ${n<7?ye(s.due):Ts(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function $s(s,t){let e=Le(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?ye(s):Ts(s)}function Ts(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function ml(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let i=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return i===t?r:`${ye(i)} ${r}`}function Lo(s,t,e=1440){let n=Ao(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=n.filter(u=>u.kid===o.id),a=new Map;for(let u of r){if(u.state!=="upcoming")continue;let l=u.shows_from??u.due??s.today;a.set(l,[...a.get(l)??[],u])}let c=r.filter(u=>u.state==="overdue"),d=r.filter(u=>u.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??pe(i),overdue:c,now:d,done:r.filter(wt),later:[...a.entries()].sort(([u],[l])=>u.localeCompare(l)).map(([u,l])=>({date:u,chores:l})),left:c.length+d.length}})}function Do(s,t=1440){return Ao(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function _s(s){return!s.chores.length&&!s.templates.length}var rt=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Cs(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,i]=n.split("-").map(r=>rt.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function Ps(s){let t=[...new Set(s)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${rt[n[0]]}-${rt[n.at(-1)]}`]:n.map(o=>rt[o])).join(", ")}var at="none";function Sn(s){return s==="daily"||s==="school"?"":"Any"}function Ro(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function Io(s){let t=s.days??Sn(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function Ms(s){return s.title.trim()?s.who.length?s.days===at?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function Oo(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function As(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function Ss(s,t,e=1,n=!1,o=!1){if(s==="school"){let u=t.trim().replace(/-/g,"–"),l=o?u?`${u} Bring lunch days`:"Bring lunch days":u?`${u} school days`:"Every school day";return n?`${l}, the night before`:l}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,a=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(a))return e>1?`Every day, every ${e} weeks`:"Every day";if(!a||a.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${a.replace(/-/g,"–")} ${r}`;let d=`${a.split(",").map(u=>{let l=u.trim();return l.toLowerCase()==="last"?"the last day":/^\d+$/.test(l)?`the ${As(Number(l))}`:`the ${l}`}).join(" and ")} ${r}`;return d[0].toUpperCase()+d.slice(1)}function Ls(s,t,e=!1){let n=s.map(i=>t.find(r=>r.id===i)?.name??i);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function Ds(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function Ln(s,t){return`${s}|${t}`}function kt(s,t){let[e,n,o]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function Dn(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function Bo(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function No(s,t){return Dn(t)<5&&!Bo(s,t)}function Wt(s,t,e=new Map){if(!No(s,t))return null;let n=Ln(s.id,t);if(e.has(n)){let i=e.get(n);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[t];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function $t(s,t){return No(s,t)?s.menus?.[t]??null:null}var bl="From the school's menu feed.";function vl(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==bl);return t.length?t.join(`
`):null}function Ie(s){return s.slice(0,7)}function Rn(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function Rs(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function jo(s){let t=[];for(let e=Ie(s.first);e<=Ie(s.last);e=Rs(e))t.push(e);return t}function zo(s,t,e,n=new Map){let o=`${e}-01`,i=kt(o,-Dn(o)),r=[];for(;Ie(i)<=e;){let a=[];for(let c=0;c<5;c++){let d=kt(i,c),u=Ie(d)!==e,l=u?null:Bo(t,d),h=u?null:Wt(t,d,n);a.push({date:d,day:Number(d.slice(8)),outside:u,off:l?l.title:null,lunch:h?.lunch??null,picked:h?.picked??!1,menu:u?null:$t(t,d)?.dish??null,sides:u?null:vl($t(t,d)?.details??""),past:d<s.today,today:d===s.today})}a.some(c=>!c.outside)&&r.push(a),i=kt(i,7)}return r}function Ho(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function Uo(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function Fo(s,t,e,n=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=kt(t,i),a=Wt(s,r,n);if(!a)continue;let c=Le(t,r);return{lunch:a.lunch,when:c===0?"today":c===1?"tomorrow":ye(r),date:r,menu:$t(s,r)?.dish??null}}return null}var yl={timeline:"timeline",full:"timeline",compact:"compact"};function lt(s){let t=new URLSearchParams(s),e={},n=yl[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((t.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((t.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}var xl=["auth_callback","code","state"];function Is(s){let t=new URLSearchParams(s);for(let n of xl)t.delete(n);let e=t.toString();return e?`?${e}`:""}function Os(s,t=0){return s==null||!Number.isFinite(s)?t:s}function wl(s,t){let e=t.takes!=null&&t.planned!=null?t.planned+t.takes:t.end;if(t.attending===!1)return t.end;for(let n of s.rides)n.serves.includes(t.id)&&n.end!=null&&(e=Math.max(e,n.end));for(let n of Object.values(s.drivers))for(let o of n.segments)o.type==="home"||o.end==null||(o.serves===t.id||o.event===t.id)&&(e=Math.max(e,o.end));return e}function kl(s,t){let e=[],n=[],o=()=>{let i=n[n.length-1];i&&Os(i.end)>t&&e.push(...n),n=[]};for(let i of s){if(i.start==null||i.end==null)continue;if(i.type==="home"||i.type==="stay"){o(),i.end>t&&e.push(i);continue}let r=n[n.length-1];r&&r.end!==i.start&&o(),n.push(i)}return o(),e}function $l(s,t){let e=new Set(s.events.filter(i=>wl(s,i)<=t).map(i=>i.id)),n=i=>Os(s.rides[i??-1]?.end,-1)<=t,o=i=>i.type==="act"?e.has(i.event??""):n(i.ride);return{...s,events:s.events.filter(i=>!e.has(i.id)),kids:Object.fromEntries(Object.entries(s.kids).map(([i,r])=>[i,{...r,items:r.items.filter(a=>!o(a))}])),drivers:Object.fromEntries(Object.entries(s.drivers).map(([i,r])=>[i,{...r,segments:kl(r.segments,t),outings:r.outings.filter(a=>a.start==null||Os(a.end,a.start)>t),busy:r.busy.filter(a=>a.end>t)}])),clashes:s.clashes.filter(i=>!o(i.a)&&!o(i.b)),issues:s.issues.filter(i=>!i.event||!e.has(i.event)),done:e.size,from:t}}function Ko(s,t){return{...s,whole_week:s.whole_week??s.days,days:s.days.filter(e=>e.date>=t.date).map(e=>e.date===t.date?$l(e,t.minutes):e)}}var Wo=Je`
  :host {
    --bg: #f4f3ef;
    --surface: #ffffff;
    --surface-2: #f9f8f5;
    --ink: #1c1e22;
    --ink-2: #3d434b;
    --muted: #5a6069;
    --faint: #6b717a;
    --line: #e3e1db;
    --line-2: #efede8;
    --control: #e5e3dd;
    --border: #cfccc4;
    --dark: #23272e;
    --bad: #c42b2b;
    --bad-ink: #b42318;
    --warn-ink: #8a5a00;
    --ok: #1f6b3a;
    --now: #e5484d;
    --night: #1b1f26;
    --night-2: #2c323c;
    --shadow:
      0 1px 2px rgba(28, 30, 34, 0.06), 0 2px 8px rgba(28, 30, 34, 0.06);
    display: block;
    height: 100%;
    background: var(--bg);
    color: var(--ink);
    font-family:
      Inter,
      "Segoe UI",
      Roboto,
      system-ui,
      -apple-system,
      sans-serif;
    font-variant-numeric: tabular-nums;
    -webkit-tap-highlight-color: transparent;
    box-sizing: border-box;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  button {
    font: inherit;
    color: inherit;
    margin: 0;
    cursor: pointer;
  }
  button:disabled {
    cursor: default;
  }
  button:focus-visible,
  input:focus-visible {
    outline: 3px solid #2d5fc4;
    outline-offset: 2px;
  }

  .app {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 14px 28px 16px;
    gap: 12px;
    min-height: 0;
  }
  .app.narrow {
    padding: 12px 12px 12px;
  }
  .app.wide {
    flex-direction: row;
    gap: 24px;
  }
  .col {
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .narrow .col {
    gap: 10px;
  }

  header {
    flex: none;
    display: flex;
    align-items: center;
    gap: 20px;
    min-height: 60px;
  }
  .narrow header {
    flex-wrap: wrap;
    row-gap: 10px;
    column-gap: 12px;
  }
  .titles {
    flex: none;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .phone .titles {
    flex: 1 1 auto;
  }
  .narrow .controls {
    flex: none;
  }
  .clock {
    margin: 0;
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-size: 46px;
    line-height: 46px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }
  .clock .ampm {
    font-size: 20px;
    line-height: 20px;
    font-weight: 700;
    letter-spacing: 0;
    color: var(--muted);
  }
  .narrow .clock {
    font-size: 34px;
    line-height: 36px;
  }
  .narrow .clock .ampm {
    font-size: 15px;
  }
  .today-line {
    margin: 0;
    white-space: nowrap;
    font-size: 17px;
    line-height: 22px;
    font-weight: 600;
    color: var(--ink-2);
  }
  .narrow .today-line {
    font-size: 14px;
    line-height: 18px;
  }
  .status {
    margin: 0;
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    color: var(--muted);
  }
  .titles .bad {
    color: var(--bad-ink);
    font-weight: 600;
  }

  .next {
    flex: 1 1 auto;
    min-width: 0;
    max-width: 760px;
    margin-right: auto;
    padding: 9px 18px 10px;
    border-radius: 18px;
    border: 0;
    background: linear-gradient(160deg, var(--night-2), var(--night));
    color: #fff;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 3px;
    box-shadow: 0 6px 20px rgba(27, 31, 38, 0.22);
    position: relative;
    overflow: hidden;
  }
  .narrow .next {
    padding: 9px 14px 10px;
    border-radius: 14px;
    gap: 2px;
  }
  .phone .next {
    flex: 1 1 100%;
    max-width: none;
    order: 5;
  }
  .next::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 6px;
    background: #8b93a1;
  }
  .next.soon::before {
    background: #f5a524;
  }
  .next.ongoing::before {
    background: #3ecf8e;
  }
  .next.idle {
    background: var(--surface);
    color: var(--ink);
    box-shadow: var(--shadow);
    border: 1px solid var(--line);
  }
  .next.idle::before {
    background: var(--ok);
  }
  .next.needs::before {
    background: #e09a1a;
  }
  .next.idle.needs .next-eyebrow {
    color: var(--warn-ink);
  }
  .next-eyebrow {
    font-size: 12.5px;
    line-height: 16px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #b7bdc7;
  }
  .next.soon .next-eyebrow {
    color: #ffc768;
  }
  .next.ongoing .next-eyebrow {
    color: #7ee2b4;
  }
  .next.idle .next-eyebrow {
    color: var(--ok);
  }
  /* The trip and where it goes share a line, so the card is two lines tall. */
  .next-main {
    display: flex;
    align-items: baseline;
    gap: 10px;
    min-width: 0;
  }
  .next-main > .avatar,
  .next-main > .next-kids {
    align-self: center;
  }
  .next-main > .next-stop {
    flex: 1 1 0;
    min-width: 0;
    margin-left: 4px;
  }
  .narrow .next-main {
    flex-wrap: wrap;
    row-gap: 0;
  }
  .narrow .next-main > .next-stop {
    flex-basis: 100%;
    margin-left: 0;
  }
  .next-lead {
    font-size: 24px;
    line-height: 30px;
    font-weight: 800;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    flex: 0 1 auto;
  }
  .narrow .next-lead {
    font-size: 19px;
    line-height: 24px;
  }
  .narrow .next-stop {
    font-size: 13.5px;
    line-height: 18px;
  }
  .narrow .next-eyebrow {
    font-size: 11.5px;
  }
  .next-kids {
    display: inline-flex;
    gap: 5px;
    flex: none;
  }
  .next-kids .kid-dot {
    width: 13px;
    height: 13px;
    border-radius: 7px;
  }
  .next-stop {
    font-size: 15px;
    line-height: 20px;
    color: #d5d8dd;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .next.idle .next-stop {
    color: var(--muted);
  }
  .next-stop.warn {
    color: #ff9c94;
    font-weight: 600;
  }
  .next .avatar.driver {
    background: #fff;
    color: var(--night);
    width: 30px;
    height: 30px;
    font-size: 15px;
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--c, var(--dark));
    color: #fff;
    font-size: 17px;
    font-weight: 800;
    box-shadow: 0 0 0 3px rgba(var(--rgb, 35, 39, 46), 0.16);
  }
  .avatar.driver {
    background: var(--dark);
    box-shadow: none;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: none;
    /* Right-aligned, on its own line too, so the page switch keeps its place. */
    margin-left: auto;
  }
  .narrow .controls {
    gap: 8px;
  }
  .seg {
    display: inline-flex;
    padding: 4px;
    gap: 4px;
    border-radius: 14px;
    background: var(--control);
  }
  .seg-btn {
    min-height: 44px;
    padding: 0 18px 0 14px;
    border-radius: 10px;
    border: 0;
    background: transparent;
    font-size: 15px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 9px;
  }
  .narrow .seg-btn {
    padding: 0 12px;
    font-size: 14px;
  }
  .narrow .seg-btn svg {
    display: none;
  }
  .phone .seg-btn {
    padding: 0 12px;
  }
  .phone .seg-btn svg {
    display: block;
  }
  .phone .seg-btn .seg-label,
  .phone .attn-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
  .phone .attn-btn {
    padding: 0 8px;
  }
  .phone .clock {
    font-size: 30px;
    line-height: 32px;
  }
  .phone .today-line {
    font-size: 13px;
    line-height: 17px;
  }
  .phone .status {
    font-size: 12px;
    line-height: 16px;
  }
  .seg-btn[aria-pressed="true"] {
    background: var(--surface);
    color: var(--ink);
    box-shadow: 0 1px 3px rgba(28, 30, 34, 0.16);
  }
  .icon-btn {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    border: 0;
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
  }
  .attn-btn {
    min-height: 44px;
    padding: 0 8px 0 14px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--surface);
    font-size: 14px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .attn-btn .count,
  .count-pill {
    min-width: 28px;
    height: 28px;
    padding: 0 8px;
    border-radius: 14px;
    background: var(--ok);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .attn-btn.has .count,
  .count-pill.bad {
    background: var(--bad);
  }

  .notice-bar {
    flex: none;
    padding: 10px 14px;
    border-radius: 10px;
    background: #fff8e8;
    border: 1px solid #ebcb7e;
    color: #5c3d00;
    font-size: 14px;
  }

  main {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    gap: 24px;
    position: relative;
  }
  .board-area {
    flex: 1 1 auto;
    min-width: 0;
    position: relative;
    display: flex;
  }

  .scroller {
    flex: 1 1 auto;
    min-width: 0;
    overflow: auto;
    overscroll-behavior: contain;
    touch-action: pan-x pan-y;
    cursor: grab;
    scrollbar-width: thin;
    border-radius: 12px;
    position: relative;
  }
  .scroller.dragging {
    cursor: grabbing;
    user-select: none;
  }
  .heads {
    position: sticky;
    top: 0;
    z-index: 6;
    height: 56px;
    background: var(--bg);
  }
  .col-head {
    position: absolute;
    top: 0;
    height: 52px;
    padding: 2px 8px 6px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .col-head.kid::after {
    content: "";
    position: absolute;
    left: 6px;
    right: 6px;
    bottom: 0;
    height: 3px;
    border-radius: 2px;
    background: var(--c);
  }
  .col-head.driver::after {
    content: "";
    position: absolute;
    left: 6px;
    right: 6px;
    bottom: 0;
    height: 3px;
    border-radius: 2px;
    background: repeating-linear-gradient(
      90deg,
      var(--dark) 0 10px,
      transparent 10px 16px
    );
    opacity: 0.55;
  }
  .ch-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .col-head .avatar {
    width: 32px;
    height: 32px;
    font-size: 15px;
  }
  .col-head .name {
    font-size: 18px;
    line-height: 22px;
    font-weight: 800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .narrow .col-head .avatar {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 6px;
    flex: none;
    display: inline-block;
  }
  .col-head .sub {
    font-size: 12px;
    line-height: 16px;
    color: var(--muted);
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  /* Narrow columns get a second line, and the heading the room for it. */
  .narrow .heads {
    height: 70px;
  }
  .narrow .col-head {
    height: 66px;
  }
  .narrow .col-head .sub {
    -webkit-line-clamp: 2;
  }
  .narrow .pinned {
    top: 70px;
  }
  .col-head .sub.warn {
    color: var(--warn-ink);
  }
  .pinned,
  .day-head {
    box-sizing: border-box;
    padding: 0 4px;
    background: var(--bg);
    border-bottom: 1px solid var(--line);
  }
  .dh-line {
    height: 35px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .pinned {
    position: sticky;
    top: 56px;
    z-index: 5;
    margin-bottom: -36px;
    overflow: hidden;
  }
  .day-head {
    position: absolute;
    left: 0;
    z-index: 1;
  }
  /* The date is the way to a day now: tap it to go there and bring out the week. */
  .dh-jump {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    height: 32px;
    margin-left: -6px;
    padding: 0 8px 0 6px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: inherit;
  }
  .dh-jump:hover {
    background: rgba(28, 30, 34, 0.05);
  }
  .dh-jump:active {
    background: rgba(28, 30, 34, 0.1);
  }
  .pinned .label,
  .day-head .label {
    font-size: 17px;
    line-height: 20px;
    font-weight: 800;
    white-space: nowrap;
  }
  .tag {
    padding: 2px 9px;
    border-radius: 10px;
    background: var(--night);
    color: #fff;
    font-size: 12px;
    line-height: 16px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  .tag[hidden] {
    display: none;
  }
  .pinned .sub,
  .day-head .sub {
    font-size: 13px;
    line-height: 18px;
    font-weight: 600;
    color: var(--muted);
    white-space: nowrap;
  }
  .pinned .sub.warn,
  .day-head .sub.warn {
    color: var(--bad-ink);
  }
  .canvas {
    position: relative;
  }
  .canvas > * {
    position: absolute;
  }
  .col-bg {
    top: 0;
    background:
      linear-gradient(rgba(var(--rgb), 0.04), rgba(var(--rgb), 0.04)),
      var(--surface);
    border: 1px solid var(--line);
    border-radius: 12px;
  }
  .col-bg.driver {
    background: var(--surface-2);
  }
  .sep {
    top: 0;
    width: 1px;
    background: #d6d3cb;
  }
  /* All-day events up on the date line, while the layout found room for them. */
  .dh-chips {
    display: flex;
    gap: 4px;
    min-width: 0;
    overflow: hidden;
  }
  .dh-chips .strip-chip {
    flex: 0 1 auto;
    min-width: 0;
  }
  .dh-chips .strip-title {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* All-day events that didn't fit on the date line, glued under it and floating with it. */
  .day-strip {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 4px;
    padding-bottom: 4px;
  }
  .strip-chip {
    flex: none;
    box-sizing: border-box;
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    max-width: 100%;
    height: 26px;
    padding: 0 10px;
    overflow: hidden;
    border-radius: 6px;
    border: 1px solid rgba(var(--rgb), 0.45);
    border-left: 4px solid var(--c);
    background: rgba(var(--rgb), 0.1);
    color: var(--ink);
    font-size: 12px;
    line-height: 24px;
    white-space: nowrap;
  }
  .strip-chip.plain {
    border-color: var(--border);
    border-left-color: var(--faint);
    background: var(--surface);
  }
  .strip-chip.warn {
    border: 1px dashed var(--warn-ink);
    border-left: 4px solid var(--warn-ink);
    background: #fff6e0;
  }
  .strip-chip.warn .strip-note {
    color: var(--warn-ink);
    font-weight: 700;
  }
  /* An event for nobody: tap it to pick who it's for. */
  button.strip-chip {
    font: inherit;
    font-size: 12px;
    line-height: 24px;
    text-align: left;
    cursor: pointer;
  }
  button.strip-chip.pick:hover,
  button.strip-chip.pick:focus-visible {
    background: #ffeec2;
  }
  button.strip-chip.pick::after {
    content: "›";
    align-self: center;
    margin-left: -2px;
    color: var(--warn-ink);
    font-size: 16px;
    font-weight: 800;
    line-height: 1;
  }
  /* A hotel stay: tap it to pick who's staying. */
  button.strip-chip.hotel:hover,
  button.strip-chip.hotel:focus-visible {
    background: rgba(var(--rgb), 0.2);
  }
  button.strip-chip.hotel::after {
    content: "›";
    align-self: center;
    margin-left: -2px;
    color: var(--ink);
    font-size: 16px;
    font-weight: 800;
    line-height: 1;
  }
  .strip-chip.skipped .strip-title {
    color: var(--muted);
    text-decoration: line-through;
    text-decoration-thickness: 2px;
  }
  .strip-title {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
  }
  .strip-note {
    flex: none;
    color: var(--muted);
    font-size: 11px;
  }
  /* Notes people wrote in an event: a small mark on what has them. Hovering shows them, and so
     does holding a finger on it, so the browser's own long-press menu and text selection stay away. */
  .note-mark {
    flex: none;
    color: var(--ink-2);
    opacity: 0.55;
  }
  .strip-chip .note-mark {
    align-self: center;
  }
  .card .note-mark {
    position: absolute;
    top: 8px;
    right: 7px;
  }
  .card.noted .title {
    padding-right: 13px;
  }
  [data-note] {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }
  .card.noting {
    box-shadow:
      inset 5px 0 0 var(--c),
      0 0 0 2px rgba(var(--rgb), 0.6),
      var(--shadow);
  }
  .strip-chip.noting {
    box-shadow: 0 0 0 2px rgba(var(--rgb, 90, 96, 105), 0.45);
  }
  .empty {
    left: 72px;
    font-size: 13px;
    line-height: 18px;
    font-weight: 600;
    color: var(--faint);
  }
  .grid {
    left: 60px;
    height: 1px;
    background: var(--line-2);
  }
  .grid.strong {
    background: var(--line);
  }
  /* A folded stretch of Timeline: a torn strip over the quiet time, saying how long it hides. */
  .fold {
    left: 60px;
    z-index: 2;
    pointer-events: none;
  }
  .fold svg {
    display: block;
    overflow: visible;
  }
  .fold-fill {
    fill: var(--bg);
  }
  .fold-edge {
    fill: none;
    stroke: #cfccc4;
    stroke-width: 1.5;
    stroke-linejoin: round;
  }
  .fold-label {
    left: 0;
    padding: 1px 6px;
    border-radius: 9px;
    background: var(--surface);
    border: 1px solid var(--line);
    white-space: nowrap;
    font-size: 11.5px;
    line-height: 15px;
    font-weight: 700;
    color: var(--muted);
    z-index: 2;
  }
  .hour {
    left: 0;
    width: 52px;
    white-space: nowrap;
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    color: var(--muted);
  }
  .band {
    border-top: 1px solid;
    border-bottom: 1px solid;
    pointer-events: none;
  }
  .busy {
    border-radius: 10px;
    background: repeating-linear-gradient(
      135deg,
      rgba(90, 96, 105, 0.16) 0px,
      rgba(90, 96, 105, 0.16) 6px,
      rgba(90, 96, 105, 0.05) 6px,
      rgba(90, 96, 105, 0.05) 12px
    );
  }
  .busy span {
    position: absolute;
    left: 10px;
    right: 6px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    color: #4a5059;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .window {
    border: 1.5px dashed rgba(35, 39, 46, 0.22);
    border-radius: 10px;
    background: rgba(35, 39, 46, 0.035);
  }
  .window span {
    position: absolute;
    left: 10px;
    right: 6px;
    top: 6px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    color: #6a707a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .prep {
    border: 1.5px dashed;
    border-bottom: 0;
    border-radius: 10px 10px 0 0;
    padding: 2px 9px;
    overflow: hidden;
    font-size: 11.5px;
    line-height: 15px;
    font-weight: 700;
    white-space: nowrap;
  }
  /* The time between a car box and its activity: the arrive-by strip's look, no label. Like
     every add-on it sits behind the piece it's built onto, rounded corners showing. */
  .link {
    border: 1.5px dashed;
    border-radius: 10px;
  }
  .card {
    padding: 6px 9px 6px 13px;
    border-radius: 10px;
    border: 1px solid;
    text-align: left;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2px;
    box-shadow:
      inset 5px 0 0 var(--c),
      var(--shadow);
  }
  .card.clash {
    border-width: 2px;
  }
  .card.sel {
    box-shadow:
      inset 5px 0 0 var(--c),
      0 0 0 3px var(--ring);
    z-index: 2;
  }
  .card .top {
    display: flex;
    flex-direction: column;
    gap: 1px;
    max-width: 100%;
  }
  .card .title {
    font-size: 14.5px;
    line-height: 18px;
    font-weight: 800;
    color: var(--ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* Under way at the top of today: it runs in from the time that's over, so its top edge is open. */
  .card.cut,
  .stay.cut {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top-style: dashed;
  }
  .card.skipped {
    box-shadow: inset 5px 0 0 rgba(var(--rgb), 0.35);
    border-style: dashed;
  }
  .card.skipped .title,
  .card.skipped .time {
    color: var(--muted);
    text-decoration: line-through;
    text-decoration-thickness: 2px;
  }
  .card .time {
    font-size: 12px;
    line-height: 16px;
    color: var(--ink-2);
  }
  .card .line {
    font-size: 11.5px;
    line-height: 15px;
    font-weight: 600;
    color: var(--ink-2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  /* Compact: everything shows in full, wrapped, and the lines follow one another with no gap
     opening up when the card is taller. The layout measures these same fonts and sizes. */
  .card.wrap {
    justify-content: flex-start;
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .card.wrap .title {
    white-space: normal;
    text-overflow: clip;
    overflow-wrap: anywhere;
  }
  .card.wrap .time {
    overflow-wrap: anywhere;
  }
  .card.wrap .line {
    white-space: normal;
    font-size: 12px;
    line-height: 16px;
    overflow-wrap: anywhere;
  }
  /* "No ride needed" on the end of the time line. */
  .card.wrap .line.inline {
    display: inline;
    overflow: visible;
  }
  .card .tone-pending {
    color: var(--warn-ink);
  }
  .card .tone-problem {
    color: var(--bad-ink);
  }
  .card .tone-muted {
    color: var(--faint);
  }
  .ride {
    padding: 3px 8px;
    border-radius: 8px;
    background: var(--surface);
    border: 1.5px solid var(--dark);
    box-shadow: var(--shadow);
    text-align: left;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1px;
  }
  .ride.tall {
    justify-content: flex-start;
    padding-top: 6px;
  }
  .ride.dashed {
    border-style: dashed;
  }
  .ride.clash {
    box-shadow: 0 0 0 2px var(--bad);
  }
  .ride .l1 {
    font-size: 12px;
    line-height: 15px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  .ride .l2 {
    font-size: 11.5px;
    line-height: 15px;
    color: #4a5059;
    overflow: hidden;
    flex: none;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .stay {
    border-radius: 9px;
    border: 1.5px solid;
    padding: 6px 9px;
    text-align: left;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
  .stay .l1,
  .stay .l2 {
    background: #fff;
    padding: 0 3px;
    border-radius: 3px;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .stay .l1 {
    font-size: 12.5px;
    line-height: 16px;
    font-weight: 700;
  }
  .stay .l2 {
    font-size: 11.5px;
    line-height: 15px;
    color: var(--ink-2);
  }
  .trip {
    border-radius: 10px;
    border: 0;
    background: linear-gradient(160deg, var(--night-2), var(--night));
    color: #fff;
    box-shadow: 0 3px 10px rgba(27, 31, 38, 0.22);
    padding: 4px 10px;
    overflow: hidden;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1px;
  }
  /* A long drive, such as to a hotel hours away: its words at the top, not lost in a fold. */
  .trip.tall {
    justify-content: flex-start;
    padding-top: 8px;
  }
  .trip.list {
    padding: 6px 10px;
    justify-content: flex-start;
  }
  .trip.bad {
    box-shadow: 0 0 0 2px var(--bad);
  }
  .trip .l1 {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    line-height: 16px;
    font-weight: 700;
    white-space: nowrap;
  }
  .kid-dot {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    box-shadow: 0 0 0 1.5px #fff;
    flex: none;
  }
  .trip .l2 {
    font-size: 11.5px;
    line-height: 15px;
    color: #d5d8dd;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .trip .stop {
    font-size: 12px;
    line-height: 16px;
    color: #d5d8dd;
    overflow-wrap: anywhere;
    max-width: 100%;
  }
  .trip .stop.warn {
    color: #ff9c94;
  }
  .trip .l3 {
    font-size: 11.5px;
    line-height: 15px;
    color: #d5d8dd;
    white-space: nowrap;
  }
  .overlap {
    border: 2px solid var(--bad);
    border-radius: 6px;
    background: repeating-linear-gradient(
      135deg,
      rgba(196, 43, 43, 0.55) 0px,
      rgba(196, 43, 43, 0.55) 4px,
      rgba(196, 43, 43, 0.15) 4px,
      rgba(196, 43, 43, 0.15) 8px
    );
    pointer-events: none;
    z-index: 3;
  }
  .mark {
    padding: 1px 6px;
    border-radius: 6px;
    background: var(--bad);
    color: #fff;
    font-size: 11.5px;
    line-height: 16px;
    font-weight: 700;
    white-space: nowrap;
    pointer-events: none;
    z-index: 3;
  }
  .now-line {
    left: 56px;
    height: 3px;
    border-radius: 2px;
    background: var(--now);
    box-shadow: 0 0 8px rgba(229, 72, 77, 0.45);
    pointer-events: none;
    z-index: 4;
  }
  .now-line::before {
    content: "";
    position: absolute;
    left: 0;
    top: -4.5px;
    width: 12px;
    height: 12px;
    border-radius: 6px;
    background: var(--now);
    box-shadow: 0 0 0 3px rgba(229, 72, 77, 0.25);
  }
  .now-label {
    left: 0;
    padding: 1px 5px;
    border-radius: 5px;
    background: var(--now);
    color: #fff;
    font-size: 11.5px;
    line-height: 16px;
    font-weight: 700;
    pointer-events: none;
    z-index: 4;
  }

  .empty-state {
    margin: auto;
    max-width: 460px;
    text-align: center;
    color: var(--muted);
    font-size: 15px;
    line-height: 22px;
  }
  .quiet-week {
    flex: 1 1 auto;
    overflow-y: auto;
    border-radius: 18px;
    background: var(--surface);
    border: 1px solid var(--line);
    box-shadow: var(--shadow);
    padding: 40px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }
  .narrow .quiet-week {
    padding: 24px 16px;
    gap: 24px;
  }
  .qw-hero {
    max-width: 560px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .qw-art {
    width: 136px;
    height: 102px;
  }
  .qw-hero h2 {
    margin: 4px 0 0;
    font-size: 30px;
    line-height: 36px;
    font-weight: 800;
    letter-spacing: -0.01em;
  }
  .narrow .qw-hero h2 {
    font-size: 22px;
    line-height: 28px;
  }
  .qw-hero p {
    margin: 0;
    font-size: 17px;
    line-height: 26px;
    color: var(--ink-2);
  }
  .narrow .qw-hero p {
    font-size: 15px;
    line-height: 22px;
  }
  .qw-people {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  }
  .qw-person {
    width: 132px;
    padding: 16px 10px 14px;
    border-radius: 16px;
    background:
      linear-gradient(rgba(var(--rgb), 0.08), rgba(var(--rgb), 0.08)),
      var(--surface);
    border: 1px solid rgba(var(--rgb), 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .qw-person.driver {
    --rgb: 35, 39, 46;
    background: var(--surface-2);
    border-color: var(--line);
  }
  .qw-person .avatar {
    width: 48px;
    height: 48px;
    font-size: 22px;
    margin-bottom: 4px;
  }
  .narrow .qw-person {
    width: 104px;
    padding: 12px 6px;
  }
  .qw-name {
    font-size: 16px;
    font-weight: 800;
  }
  .qw-sub {
    font-size: 13px;
    color: var(--muted);
  }
  .qw-steps {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    max-width: 900px;
    width: 100%;
  }
  .phone .qw-steps {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .qw-steps li {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 16px;
    border-radius: 14px;
    background: var(--bg);
    font-size: 14px;
    line-height: 20px;
    color: var(--ink-2);
  }
  .qw-steps strong {
    display: block;
    font-size: 15px;
    color: var(--ink);
    margin-bottom: 2px;
  }
  .qw-num {
    width: 28px;
    height: 28px;
    border-radius: 14px;
    flex: none;
    background: var(--night);
    color: #fff;
    font-weight: 800;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .big {
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
    margin: 0 0 6px;
  }
  .empty-state p {
    margin: 0 0 12px;
  }

  .panel {
    width: 360px;
    flex: none;
    background: var(--surface);
    border: 1px solid var(--line);
    box-shadow: var(--shadow);
    border-radius: 18px;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
    overscroll-behavior: contain;
  }
  .narrow .panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(400px, 100%);
    border-radius: 16px 0 0 16px;
    z-index: 21;
    padding: 20px 18px calc(20px + env(safe-area-inset-bottom));
    box-shadow: -8px 0 30px rgba(0, 0, 0, 0.18);
  }
  .phone .panel {
    top: auto;
    left: 0;
    width: auto;
    max-height: 85%;
    border-radius: 18px 18px 0 0;
    padding: 18px 16px calc(18px + env(safe-area-inset-bottom));
    box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.18);
  }
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(28, 30, 34, 0.35);
    z-index: 20;
  }
  .panel-head {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .panel-head h2 {
    margin: 0;
    font-size: 20px;
    line-height: 26px;
    font-weight: 700;
    flex: 1 1 auto;
  }
  .panel-sub {
    display: block;
    font-size: 13px;
    line-height: 18px;
    font-weight: 500;
    color: var(--muted);
  }
  .all-clear {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 14px;
    border-radius: 14px;
    background: #ecf6ef;
    border: 1px solid #b9dcc4;
    font-size: 14px;
    line-height: 20px;
    color: var(--ink-2);
  }
  .all-clear strong {
    display: block;
    font-size: 16px;
    color: var(--ok);
  }
  .check {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    flex: none;
    background: var(--ok);
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .issue {
    border: 1px solid #f0c2be;
    background: #fdf1f0;
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .issue.unassigned {
    border-color: #ebcb7e;
    background: #fff8e8;
  }
  .issue.heads_up {
    border-color: #e1e4e8;
    background: #f6f7f9;
  }
  .issue-main {
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
  .glyph {
    width: 22px;
    height: 22px;
    border-radius: 11px;
    background: var(--bad);
    color: #fff;
    font-weight: 700;
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    margin-top: 1px;
  }
  .unassigned .glyph {
    background: #9a6700;
  }
  .heads_up .glyph {
    background: #4a5568;
  }
  .issue-text {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }
  .issue-title {
    font-size: 15px;
    line-height: 20px;
    font-weight: 700;
    text-align: left;
    padding: 0;
    border: 0;
    background: none;
  }
  button.issue-title {
    text-decoration: underline;
    text-decoration-color: rgba(28, 30, 34, 0.25);
    text-underline-offset: 3px;
  }
  .issue-body {
    font-size: 13px;
    line-height: 18px;
    color: var(--ink-2);
  }
  .issue-link {
    display: inline;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    font-weight: 700;
    color: var(--ink);
    text-decoration: underline;
    text-decoration-color: rgba(28, 30, 34, 0.35);
    text-underline-offset: 2px;
    cursor: pointer;
  }
  .fixes {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-left: 32px;
  }
  .fix {
    text-align: left;
    min-height: 44px;
    padding: 7px 12px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .fix:disabled {
    opacity: 0.6;
  }
  .fix-label {
    font-size: 14px;
    line-height: 18px;
    font-weight: 600;
  }
  .fix-note {
    font-size: 12px;
    line-height: 16px;
    color: var(--muted);
  }
  .legend {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 14px;
    border-top: 1px solid #eceae5;
  }
  .legend > span {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--ink-2);
  }
  .sw {
    width: 26px;
    height: 14px;
    border-radius: 4px;
    flex: none;
  }
  .trip-sw {
    background: var(--dark);
  }
  .ride-sw {
    border: 1.5px solid var(--dark);
    background: #fff;
  }
  .band-sw {
    border-radius: 0;
    border-top: 1px solid rgba(45, 95, 196, 0.45);
    border-bottom: 1px solid rgba(45, 95, 196, 0.45);
    background: rgba(45, 95, 196, 0.1);
  }
  .stay-sw {
    border: 1.5px solid #12877a;
    background: repeating-linear-gradient(
      135deg,
      rgba(18, 135, 122, 0.35) 0px,
      rgba(18, 135, 122, 0.35) 4px,
      #fff 4px,
      #fff 8px
    );
  }
  .busy-sw {
    background: repeating-linear-gradient(
      135deg,
      rgba(90, 96, 105, 0.25) 0px,
      rgba(90, 96, 105, 0.25) 4px,
      rgba(90, 96, 105, 0.06) 4px,
      rgba(90, 96, 105, 0.06) 8px
    );
  }
  .overlap-sw {
    border: 2px solid var(--bad);
    background: rgba(196, 43, 43, 0.35);
  }

  .ed-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  .ed-titles {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }
  .ed-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    line-height: 26px;
    font-weight: 700;
  }
  .ed-meta {
    font-size: 14px;
    color: var(--muted);
  }
  .btn {
    min-height: 44px;
    padding: 0 16px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: #fff;
    font-size: 14px;
    font-weight: 600;
    flex: none;
  }
  .btn.dark {
    border-color: var(--ink);
    background: var(--ink);
    color: #fff;
  }
  .saving {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--muted);
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  /* The drop-off and the pick-up each sit in their own box, so they read as two separate rides. */
  .ride-box {
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--bg);
  }
  .field-sub {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 4px;
  }
  .field-label {
    font-size: 14px;
    font-weight: 700;
  }
  .nobody {
    font-weight: 500;
    color: var(--warn-ink);
  }
  .field-hint {
    margin: 0;
    font-size: 12px;
    line-height: 17px;
    font-weight: 400;
    color: var(--muted);
  }
  .field-label .field-hint {
    margin-left: 6px;
  }
  .field-hint.bad {
    color: var(--bad-ink);
  }
  .choices {
    display: grid;
    gap: 8px;
  }
  .choice {
    min-height: 44px;
    padding: 0 8px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: #fff;
    font-size: 14px;
    font-weight: 600;
  }
  .choice.wide {
    width: 100%;
  }
  .choice[aria-pressed="true"],
  .chip[aria-pressed="true"] {
    background: var(--ink);
    border-color: var(--ink);
    color: #fff;
  }
  .choice:disabled:not([aria-pressed="true"]),
  .chip:disabled:not([aria-pressed="true"]),
  .step:disabled {
    color: var(--faint);
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chip {
    min-height: 36px;
    padding: 0 12px;
    border-radius: 18px;
    border: 1px solid var(--border);
    background: #fff;
    font-size: 13px;
    font-weight: 600;
  }
  .chip.clear {
    align-self: flex-end;
  }
  .chip.all-kids {
    align-self: flex-start;
  }
  input[type="text"] {
    min-height: 44px;
    padding: 0 12px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: #fff;
    font: inherit;
    font-size: 14px;
    color: var(--ink);
  }
  .arrive {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .every-row {
    justify-content: flex-start;
    gap: 12px;
  }
  .every-unit {
    flex: 1;
  }
  .arrive-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .stepper {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .step {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: #fff;
    font-size: 20px;
    font-weight: 600;
  }
  .step.clear-time {
    width: 36px;
    font-size: 18px;
    color: var(--muted);
  }
  .time-chips .chips {
    gap: 8px;
  }
  .arrive-value {
    min-width: 64px;
    text-align: center;
    font-size: 15px;
    font-weight: 600;
  }
  .notes {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px;
    border-radius: 10px;
    background: var(--bg);
  }
  .notes-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
  }
  /* A long label ("Not needed", a carpool's name) wraps onto a second line in a narrow button. */
  .choice {
    overflow: hidden;
    line-height: 16px;
    overflow-wrap: anywhere;
  }
  .notes-body {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 13px;
    line-height: 20px;
    white-space: pre-line;
  }

  .toast {
    position: fixed;
    left: 50%;
    bottom: 28px;
    transform: translateX(-50%);
    max-width: min(560px, calc(100% - 32px));
    padding: 12px 16px;
    border-radius: 12px;
    background: var(--ink);
    color: #fff;
    font-size: 14px;
    line-height: 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    z-index: 30;
  }
  /* The bubble with an event's notes. It never takes the pointer, so it can't flicker under it. */
  .note-tip {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 40;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 16;
    overflow: hidden;
    width: max-content;
    max-width: min(340px, calc(100vw - 16px));
    padding: 10px 13px;
    border-radius: 10px;
    background: var(--ink);
    color: #fff;
    font-size: 13.5px;
    line-height: 19px;
    font-weight: 500;
    white-space: pre-line;
    overflow-wrap: anywhere;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    transform: translateY(4px);
    transition:
      opacity 120ms ease,
      transform 120ms ease,
      visibility 0s linear 120ms;
  }
  .note-tip.above {
    transform: translateY(-4px);
  }
  .note-tip.on {
    opacity: 1;
    visibility: visible;
    transform: none;
    transition:
      opacity 120ms ease,
      transform 120ms ease;
  }
  @media (prefers-reduced-motion: reduce) {
    .note-tip,
    .note-tip.on {
      transform: none;
      transition: none;
    }
  }
  /* Chores */
  .chores-area {
    flex-direction: column;
  }
  .chores-scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 8px;
  }
  .chore-cols {
    display: grid;
    grid-template-columns: repeat(var(--n, 3), minmax(220px, 1fr));
    gap: 16px;
    align-items: start;
  }
  .phone .chore-cols {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
  .chore-col {
    background: var(--surface);
    border: 1px solid var(--line);
    border-top: 5px solid var(--c);
    border-radius: 16px;
    box-shadow: var(--shadow);
    padding: 14px 12px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }
  .chore-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 4px 4px;
  }
  .chore-head .name {
    font-size: 20px;
    line-height: 25px;
    font-weight: 800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .chore-head .sub {
    font-size: 13px;
    line-height: 18px;
    color: var(--muted);
  }
  .chore-group {
    margin: 8px 4px 0;
    font-size: 12px;
    line-height: 16px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .chore-group.overdue {
    color: var(--bad-ink);
  }
  .chore {
    width: 100%;
    min-height: 60px;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid var(--line);
    background: rgba(var(--rgb), 0.07);
    display: flex;
    align-items: center;
    gap: 12px;
    text-align: left;
    color: var(--ink);
    transition:
      background-color 0.15s ease,
      opacity 0.15s ease;
  }
  button.chore:active {
    background: rgba(var(--rgb), 0.16);
  }
  .chore.overdue {
    border-color: #f0c2be;
    background: #fdf1f0;
  }
  .chore.done {
    background: var(--surface-2);
    border-color: var(--line-2);
  }
  .chore.later {
    background: transparent;
    border-style: dashed;
    border-color: var(--border);
    min-height: 52px;
  }
  .box {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    flex: none;
    border: 2.5px solid var(--c);
    background: var(--surface);
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .chore.done .box {
    background: var(--c);
  }
  .chore.later .box {
    border-color: var(--border);
    border-style: dashed;
  }
  .chore-icon {
    font-size: 24px;
    line-height: 1;
    flex: none;
  }
  .chore.done .chore-icon,
  .chore.later .chore-icon {
    opacity: 0.55;
  }
  .chore-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .chore-title {
    font-size: 17px;
    line-height: 22px;
    font-weight: 650;
    overflow-wrap: anywhere;
  }
  .chore.done .chore-title {
    color: var(--muted);
    text-decoration: line-through;
    text-decoration-color: rgba(28, 30, 34, 0.35);
  }
  .chore.later .chore-title {
    color: var(--ink-2);
    font-weight: 600;
  }
  .chore-kid {
    font-weight: 800;
    color: var(--k, var(--ink));
  }
  .chore-note {
    font-size: 13px;
    line-height: 18px;
    color: var(--muted);
  }
  .chore.overdue .chore-note {
    color: var(--bad-ink);
    font-weight: 600;
  }
  .chore.done .chore-note {
    color: var(--ok);
  }
  .chore-none {
    margin: 4px;
    font-size: 14px;
    color: var(--muted);
  }
  .chores-message {
    margin: auto;
    max-width: 560px;
    padding: 28px 28px 24px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 18px;
    box-shadow: var(--shadow);
    font-size: 16px;
    line-height: 24px;
    color: var(--ink-2);
  }
  .chores-message h2 {
    margin: 0 0 10px;
    font-size: 24px;
    line-height: 30px;
    font-weight: 800;
    color: var(--ink);
  }
  .chores-message p {
    margin: 0 0 12px;
  }
  .chores-message p:last-child {
    margin-bottom: 0;
  }
  .chores-message ol {
    margin: 0 0 14px;
    padding-left: 22px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .chores-message code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 14px;
    padding: 1px 6px;
    border-radius: 6px;
    background: var(--control);
    color: var(--ink);
  }
  .phone .chores-message {
    padding: 20px 18px;
  }
  .panel-section {
    margin: 4px 0 0;
    font-size: 16px;
    line-height: 22px;
    font-weight: 800;
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .panel-section .panel-sub {
    display: inline;
  }
  .attn-chores {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .attn-chores .chore {
    min-height: 54px;
  }
  .attn-chores .chore-title {
    font-size: 15px;
    line-height: 20px;
  }
  .section-clear {
    margin: 0;
    font-size: 14px;
    color: var(--ok);
    font-weight: 600;
  }
  /* Managing chores */
  .chores-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .chores-bar .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .chores-hint {
    flex: 1 1 auto;
    font-size: 14px;
    color: var(--muted);
  }
  .manage-title {
    flex: 1 1 auto;
    margin: 0;
    font-size: 22px;
    line-height: 28px;
    font-weight: 800;
  }
  .setup {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border-radius: 16px;
    background: #fff8e8;
    border: 1px solid #ebcb7e;
  }
  .setup-head {
    margin: 0 4px;
    color: #5c3d00;
  }
  .setup-list,
  .tmpl-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 8px;
  }
  .phone .setup-list,
  .phone .tmpl-list {
    grid-template-columns: minmax(0, 1fr);
  }
  .manage-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .tmpl {
    min-height: 64px;
    padding: 10px 14px;
    border-radius: 12px;
    border: 1px solid var(--line);
    background: var(--surface);
    box-shadow: var(--shadow);
    display: flex;
    align-items: center;
    gap: 12px;
    text-align: left;
    color: var(--ink);
  }
  .tmpl.needs {
    border: 1px dashed #c9a24d;
    box-shadow: none;
  }
  .tmpl.paused {
    background: var(--surface-2);
  }
  .tmpl.paused .chore-title,
  .tmpl.paused .tmpl-icon {
    opacity: 0.6;
  }
  .tmpl.sel {
    outline: 3px solid var(--ink);
    outline-offset: 1px;
  }
  .tmpl-icon {
    width: 32px;
    flex: none;
    text-align: center;
    font-size: 24px;
    line-height: 1;
    color: var(--faint);
  }
  .tmpl .chore-text {
    flex: 1 1 auto;
  }
  .tmpl-note {
    font-size: 13px;
    line-height: 18px;
    color: var(--muted);
  }
  .tmpl-note.bad {
    color: var(--warn-ink);
    font-weight: 600;
  }
  .tmpl-dots {
    display: flex;
    gap: 4px;
    flex: none;
  }
  .tag-paused {
    display: inline-block;
    margin-left: 6px;
    padding: 1px 8px;
    border-radius: 10px;
    background: var(--control);
    color: var(--ink-2);
    font-size: 12px;
    font-weight: 700;
    vertical-align: 2px;
    text-decoration: none;
  }
  .message-aside {
    margin: 16px 0 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--muted);
  }
  .chores-message .big-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 52px;
    padding: 0 22px;
    font-size: 16px;
  }
  .text-input {
    width: 100%;
    min-height: 48px;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: #fff;
    font: inherit;
    font-size: 16px;
    color: var(--ink);
    resize: vertical;
  }
  .text-input:focus {
    outline: 3px solid #2d5fc4;
    outline-offset: 1px;
  }
  textarea.text-input {
    min-height: 64px;
  }
  .icon-chips {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
    gap: 6px;
  }
  .icon-chips .chip {
    min-height: 44px;
    padding: 0;
    border-radius: 10px;
    font-size: 22px;
  }
  .icon-chips .chip[aria-pressed="true"] {
    background: #e8eefb;
    border: 2px solid var(--ink);
    color: var(--ink);
  }
  .icon-chips .chip.more {
    font-size: 13px;
    font-weight: 700;
    grid-column: span 2;
  }
  .emoji-more {
    width: 100%;
    height: 360px;
    margin-top: 8px;
    --border-radius: 12px;
    --border-color: var(--line, #e3e5e8);
    --emoji-size: 1.5rem;
    --num-columns: 7;
  }
  .day-chips {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 6px;
  }
  .day-chips .chip {
    min-height: 44px;
    padding: 0;
    border-radius: 10px;
    font-size: 14px;
  }
  .who-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .who-chip {
    min-height: 48px;
    padding: 0 16px 0 6px;
    border-radius: 24px;
    border: 1px solid var(--border);
    background: #fff;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 700;
  }
  .who-chip .avatar {
    width: 34px;
    height: 34px;
    font-size: 15px;
    background: var(--control);
    color: var(--ink-2);
    box-shadow: none;
  }
  .who-chip[aria-pressed="true"] {
    border-color: var(--c);
    background: rgba(var(--rgb), 0.12);
    box-shadow: inset 0 0 0 1px var(--c);
  }
  .who-chip[aria-pressed="true"] .avatar {
    background: var(--c);
    color: #fff;
  }
  .ed-for {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 2px;
    color: var(--muted);
    font-size: 13px;
  }
  .ed-for-change {
    min-height: 28px;
    padding: 0 10px;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: #fff;
    color: var(--ink);
    font: inherit;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }
  .ed-icon {
    font-size: 24px;
    line-height: 1;
  }
  .ed-foot {
    position: sticky;
    bottom: -20px;
    margin: 4px -20px -20px;
    padding: 12px 20px 20px;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      var(--surface) 12px
    );
  }
  .narrow .ed-foot {
    margin: 4px -18px calc(-20px - env(safe-area-inset-bottom));
    padding: 12px 18px calc(20px + env(safe-area-inset-bottom));
    bottom: calc(-20px - env(safe-area-inset-bottom));
  }
  .ed-foot .save {
    width: 100%;
    min-height: 52px;
    font-size: 16px;
  }
  .ed-foot .save:disabled {
    background: var(--control);
    border-color: var(--control);
    color: var(--muted);
  }
  .chip.remove {
    align-self: flex-start;
    color: var(--bad-ink);
    border-color: #f0c2be;
  }
  .done-by {
    min-height: 56px;
    padding: 0 16px 0 8px;
    border-radius: 14px;
    border: 1px solid var(--border);
    background: #fff;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 16px;
    font-weight: 700;
    text-align: left;
  }
  .done-by.main {
    min-height: 76px;
    font-size: 20px;
    border: 2px solid var(--c);
    background: rgba(var(--rgb), 0.1);
  }
  .done-by.main .avatar {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
  .done-by-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .day-chips.five {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  /* Lunch */
  .name-row {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }
  .lunch-chip {
    flex: 0 1 auto;
    min-width: 0;
    max-width: 62%;
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 32px;
    padding: 0 11px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
  }
  .lunch-chip.buy {
    background: var(--c, var(--dark));
    color: #fff;
  }
  .lunch-chip.bring {
    background: rgba(var(--rgb, 35, 39, 46), 0.13);
    color: var(--k, var(--ink));
    box-shadow: inset 0 0 0 1px rgba(var(--rgb, 35, 39, 46), 0.3);
  }
  .lunch-chip.small {
    margin-left: 0;
    height: 22px;
    padding: 0 7px;
    gap: 3px;
    font-size: 12px;
  }
  .lunch-chip.small.icon {
    flex: none;
    width: 26px;
    padding: 0;
    justify-content: center;
  }
  .lunch-chip.small svg {
    width: 13px;
    height: 13px;
  }
  .col-head .lunch-chip.bring {
    color: var(--ink);
  }
  .month-nav {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .month-nav .icon-btn {
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--ink-2);
  }
  .month-nav .icon-btn:disabled {
    opacity: 0.35;
  }
  .month-title {
    margin: 0;
    min-width: 200px;
    text-align: center;
    font-size: 22px;
    line-height: 28px;
    font-weight: 800;
  }
  .lunch-default {
    flex: none;
    margin-left: auto;
    font-size: 12px;
    font-weight: 700;
    color: var(--muted);
    background: var(--surface-2);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 4px 9px;
    white-space: nowrap;
  }
  .lunch-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 6px;
  }
  .lunch-wd {
    height: 32px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .lunch-wd:not(:disabled):active {
    background: rgba(var(--rgb), 0.12);
  }
  .lunch-wd:disabled {
    opacity: 0.45;
  }
  .lunch-day {
    min-height: 64px;
    min-width: 0;
    border-radius: 10px;
    padding: 6px 7px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    text-align: left;
    border: 1px solid transparent;
    transition:
      background-color 0.15s ease,
      opacity 0.15s ease;
  }
  .lunch-num {
    font-size: 13px;
    line-height: 16px;
    font-weight: 800;
  }
  .lunch-word {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    line-height: 16px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
  }
  .lunch-day.buy {
    background: var(--c);
    border-color: var(--c);
    color: #fff;
  }
  .lunch-day.bring {
    background: rgba(var(--rgb), 0.1);
    border-color: rgba(var(--rgb), 0.35);
    color: var(--k);
  }
  .lunch-day.unpicked.buy {
    background: rgba(var(--rgb), 0.72);
    border-color: transparent;
  }
  .lunch-day.unpicked.bring {
    border-style: dashed;
  }
  .lunch-day.past {
    opacity: 0.4;
  }
  .lunch-day.today {
    box-shadow:
      0 0 0 2px var(--surface),
      0 0 0 4px var(--ink);
  }
  .lunch-day.off {
    background: repeating-linear-gradient(
      135deg,
      var(--line-2) 0 6px,
      var(--surface-2) 6px 12px
    );
    color: var(--muted);
  }
  .lunch-day.off .lunch-word {
    font-size: 11px;
  }
  .lunch-day.outside {
    background: transparent;
  }
  .lunch-menu {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    overflow-wrap: anywhere;
    margin-top: 3px;
    font-size: 11.5px;
    line-height: 14px;
    font-weight: 600;
    opacity: 0.92;
  }
  .lunch-menu.add {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    opacity: 0.75;
  }
  .lunch-menu.add svg {
    width: 11px;
    height: 11px;
  }
  .lunch-day.editing:not(.past) {
    cursor: pointer;
  }
  .lunch-day.sel {
    box-shadow:
      0 0 0 2px var(--surface),
      0 0 0 4px var(--c);
  }
  .lunch-card .chore-head {
    flex-wrap: wrap;
    row-gap: 8px;
  }
  .lunch-card .ch-text {
    flex: 1 1 150px;
    min-width: 0;
  }
  .lunch-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
  }
  .lunch-actions .lunch-default {
    margin-left: 0;
  }
  .lunch-expand {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 40px;
    padding: 0 12px;
    color: var(--k);
    border-color: rgba(var(--rgb), 0.45);
    white-space: nowrap;
  }
  .lunch-expand:active {
    background: rgba(var(--rgb), 0.1);
  }
  /* One kid's month filling the tab: room for each day's whole menu. */
  .lunch-card.wide {
    padding: 16px 16px 14px;
  }
  .lunch-card.wide .lunch-grid {
    gap: 8px;
  }
  .lunch-card.wide .lunch-wd {
    font-size: 14px;
  }
  .lunch-card.wide .lunch-day {
    min-height: 120px;
    padding: 10px 12px;
    justify-content: flex-start;
    gap: 4px;
  }
  .lunch-card.wide .lunch-num,
  .lunch-card.wide .lunch-word {
    font-size: 15px;
    line-height: 19px;
  }
  .lunch-card.wide .lunch-menu {
    display: block;
    margin-top: 4px;
    font-size: 17px;
    line-height: 22px;
    font-weight: 800;
    opacity: 1;
  }
  .lunch-card.wide .lunch-menu.add {
    display: inline-flex;
    font-size: 14px;
    font-weight: 600;
  }
  .lunch-sides {
    white-space: pre-line;
    overflow-wrap: anywhere;
    font-size: 14px;
    line-height: 19px;
    font-weight: 500;
    opacity: 0.9;
  }
  .lunch-chip-text {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .lunch-chip-menu {
    font-weight: 600;
  }
  .lunch-offs {
    margin: 2px 4px 0;
    font-size: 13px;
    line-height: 18px;
    color: var(--muted);
  }
  .narrow .month-title {
    min-width: 0;
    font-size: 19px;
  }

  /* The days down the board's edge: out while scrolling, tucked away to a small tab after. */
  .rail-wrap {
    position: absolute;
    top: 50%;
    right: 0;
    width: 0;
    height: 0;
    z-index: 20;
  }
  /* The tab sits in the gap beside the board, so it never covers anything. */
  .rail-tab {
    position: absolute;
    left: 0;
    top: -48px;
    width: 24px;
    height: 96px;
    padding: 0;
    border: 0;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;
  }
  .narrow .rail-tab {
    width: 12px;
  }
  .rail-tab span {
    width: 6px;
    height: 56px;
    border-radius: 3px;
    background: rgba(28, 30, 34, 0.24);
  }
  .rail-tab:hover span,
  .rail-tab:active span {
    background: rgba(28, 30, 34, 0.45);
  }
  .rail-wrap.out .rail-tab {
    opacity: 0;
    pointer-events: none;
  }
  .rail {
    position: absolute;
    right: 12px;
    top: 0;
    translate: 0 -50%;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 6px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid var(--line);
    box-shadow:
      0 10px 30px rgba(28, 30, 34, 0.18),
      0 2px 6px rgba(28, 30, 34, 0.08);
    opacity: 0;
    transform: translateX(24px);
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;
  }
  .rail-wrap.out .rail {
    opacity: 1;
    transform: none;
    pointer-events: auto;
  }
  .rail-day {
    position: relative;
    width: 64px;
    min-height: 56px;
    padding: 5px 4px 6px;
    border: 0;
    border-radius: 12px;
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
  }
  .rail-day:active {
    background: var(--line-2);
  }
  .rail-day.here {
    background: var(--night);
    color: #fff;
  }
  .rd-wd {
    font-size: 11px;
    line-height: 14px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .rail-day.today .rd-wd {
    color: #c26a00;
  }
  .rail-day.here .rd-wd {
    color: #c9ced6;
  }
  .rail-day.here.today .rd-wd {
    color: #ffc768;
  }
  .rd-num {
    font-size: 20px;
    line-height: 22px;
    font-weight: 800;
  }
  .rd-dots {
    display: flex;
    gap: 3px;
    height: 8px;
    align-items: center;
  }
  .rd-dot {
    width: 7px;
    height: 7px;
    border-radius: 4px;
  }
  .rail-day.here .rd-dot {
    box-shadow: 0 0 0 1.5px var(--night);
  }
  .rd-free {
    font-size: 10px;
    line-height: 8px;
    color: var(--faint);
  }
  .rail-day.here .rd-free {
    color: #9aa1ab;
  }
  .rd-badge {
    position: absolute;
    top: -3px;
    right: -3px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: var(--bad);
    color: #fff;
    font-size: 11px;
    line-height: 18px;
    font-weight: 700;
    text-align: center;
  }

  /* Back to today: a small pill at the bottom once the board has scrolled away. */
  .back-today {
    position: absolute;
    left: 50%;
    bottom: 16px;
    z-index: 20;
    transform: translateX(-50%);
    min-height: 44px;
    padding: 0 18px 0 14px;
    border: 0;
    border-radius: 22px;
    background: var(--night);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 6px 18px rgba(27, 31, 38, 0.28);
    animation: back-in 0.18s ease;
  }
  @keyframes back-in {
    from {
      opacity: 0;
      transform: translate(-50%, 8px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .rail,
    .rail-tab,
    .back-today {
      transition: none;
      animation: none;
    }
  }
`;function Tl(s,t,e,n,o=14){let i=s.top-o-8,r=e.h-s.bottom-o-8,a=t.h<=i,c=t.h<=r,d=n?a||!c&&i>r:!c&&(a||i>r),u=d?s.top-o-t.h:s.bottom+o,l=Math.max(8,Math.min(u,e.h-8-t.h)),h=Math.max(8,Math.min(s.x-t.w/2,e.w-8-t.w));return{left:Math.round(h),top:Math.round(l),above:d}}function Vt(s,t){for(let e of s.composedPath()){if(e===t)break;if(e instanceof HTMLElement&&e.dataset.note)return e}return null}var In=class{constructor(t,e){this.tip=null;this.anchor=null;this.held=!1;this.hoverTimer=null;this.hideTimer=null;this.hoverAt={x:0,y:0};this.hoverEl=null;this.press=null;this.eatUntil=0;this.hide=()=>{this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting")),this.anchor=null,this.held=!1,this.tip?.classList.remove("on")};this.onHover=t=>{if(t.pointerType==="touch"||t.buttons)return;let e=t.composedPath().includes(this.host)?Vt(t,this.host):null;if(!e){this.clearHover(),this.laterHide();return}if(e===this.anchor){this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null;return}if(this.hoverAt={x:t.clientX,y:t.clientY},this.hoverEl!==e){if(this.anchor&&!this.held){this.show(e,this.pointAt(this.hoverAt),!1);return}this.clearHover(),this.hoverEl=e,this.hoverTimer=setTimeout(()=>{this.hoverTimer=null,this.hoverEl===e&&e.isConnected&&this.show(e,this.pointAt(this.hoverAt),!1)},400)}};this.onLeave=t=>{t.pointerType!=="touch"&&(this.clearHover(),this.held||this.hide())};this.onDown=t=>{if(this.eatUntil=0,this.endPress(),this.anchor&&this.hide(),this.clearHover(),t.pointerType!=="touch"||!t.isPrimary)return;let e=Vt(t,this.host);if(!e)return;let n={x:t.clientX,y:t.clientY},o=setTimeout(()=>{let i=this.press;!i||i.el!==e||!e.isConnected||(i.done=!0,this.show(e,{x:n.x,top:n.y,bottom:n.y},!0,36),this.held=!0)},500);this.press={id:t.pointerId,x:n.x,y:n.y,el:e,timer:o,done:!1}};this.onMove=t=>{let e=this.press;e&&t.pointerId===e.id&&!e.done&&Math.hypot(t.clientX-e.x,t.clientY-e.y)>10&&this.endPress()};this.onUp=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done&&(this.eatUntil=performance.now()+700),this.endPress())};this.onCancel=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done?(this.endPress(),this.hide()):this.endPress())};this.onClick=t=>{if(!this.eatUntil)return;let e=performance.now()<this.eatUntil;this.eatUntil=0,e&&(t.stopPropagation(),t.preventDefault())};this.onContextMenu=t=>{let e=t.pointerType==="touch";(this.press||this.held&&this.anchor||e&&Vt(t,this.host))&&t.preventDefault()};this.onFocusIn=t=>{let e=Vt(t,this.host);if(!e||!e.matches(":focus-visible"))return;let n=e.getBoundingClientRect();this.show(e,{x:n.left+Math.min(n.width/2,120),top:n.top,bottom:n.bottom},!1,8)};this.onFocusOut=t=>{this.anchor&&Vt(t,this.host)===this.anchor&&!this.held&&this.hide()};this.onKey=t=>{t.key!=="Escape"||!this.anchor||(this.hide(),t.stopImmediatePropagation())};this.host=t,this.root=e}connect(){let t=this.host;window.addEventListener("pointermove",this.onHover,{passive:!0}),document.documentElement.addEventListener("pointerleave",this.onLeave),t.addEventListener("pointerdown",this.onDown,{capture:!0}),t.addEventListener("pointermove",this.onMove,{capture:!0,passive:!0}),t.addEventListener("pointerup",this.onUp,{capture:!0}),t.addEventListener("pointercancel",this.onCancel,{capture:!0}),t.addEventListener("click",this.onClick,{capture:!0}),t.addEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.addEventListener("wheel",this.hide,{passive:!0}),t.addEventListener("focusin",this.onFocusIn),t.addEventListener("focusout",this.onFocusOut),t.addEventListener("keydown",this.onKey,{capture:!0}),window.addEventListener("resize",this.hide),window.addEventListener("blur",this.hide)}disconnect(){let t=this.host;window.removeEventListener("pointermove",this.onHover),document.documentElement.removeEventListener("pointerleave",this.onLeave),t.removeEventListener("pointerdown",this.onDown,{capture:!0}),t.removeEventListener("pointermove",this.onMove,{capture:!0}),t.removeEventListener("pointerup",this.onUp,{capture:!0}),t.removeEventListener("pointercancel",this.onCancel,{capture:!0}),t.removeEventListener("click",this.onClick,{capture:!0}),t.removeEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.removeEventListener("wheel",this.hide),t.removeEventListener("focusin",this.onFocusIn),t.removeEventListener("focusout",this.onFocusOut),t.removeEventListener("keydown",this.onKey,{capture:!0}),window.removeEventListener("resize",this.hide),window.removeEventListener("blur",this.hide),this.endPress(),this.hide()}get shown(){return this.anchor!==null}sync(){let t=this.anchor;t&&(!t.isConnected||!t.dataset.note?this.hide():this.tip&&this.tip.textContent!==t.dataset.note&&(this.tip.textContent=t.dataset.note))}ensureTip(){if(this.tip?.isConnected)return this.tip;let t=document.createElement("div");return t.className="note-tip",t.id="note-tip",t.setAttribute("role","tooltip"),this.root.appendChild(t),this.tip=t,t}show(t,e,n,o){let i=t.dataset.note;if(!i)return;this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&this.anchor!==t&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting"));let r=this.ensureTip();r.textContent=i,r.classList.remove("on"),r.style.left="0px",r.style.top="0px";let a={w:r.offsetWidth,h:r.offsetHeight},c={w:window.innerWidth,h:window.innerHeight},d=Tl(e,a,c,n,o);r.style.left=`${d.left}px`,r.style.top=`${d.top}px`,r.classList.toggle("above",d.above),r.classList.add("on"),t.setAttribute("aria-describedby",r.id),t.classList.add("noting"),this.anchor=t}clearHover(){this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=null,this.hoverEl=null}laterHide(){this.hideTimer||!this.anchor||this.held||(this.hideTimer=setTimeout(()=>{this.hideTimer=null,this.hide()},120))}pointAt(t){return{x:t.x,top:t.y-4,bottom:t.y+10}}endPress(){this.press&&clearTimeout(this.press.timer),this.press=null}};(()=>{if(typeof document>"u")return;let s=null,t=new Map;ko((e,n)=>{let o=`${n}|${e}`,i=t.get(o);if(i!==void 0)return i;if(!s){if(!document.body)return null;s=document.createElement("span"),s.setAttribute("aria-hidden","true"),s.style.cssText="position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none;white-space:pre;letter-spacing:normal;word-spacing:normal;text-transform:none;contain:layout style",document.body.appendChild(s)}return s.style.font=n,s.style.font?(s.style.fontVariantNumeric="tabular-nums",s.textContent=e,i=s.getBoundingClientRect().width,t.size>2e4&&t.clear(),t.set(o,i),i):null})})();var Ar="mydashlight.rides.view",nd=1100,sd=440,id=700,od=3*6e4,_r=1200,rd=450,ad=110;function ld(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var Kn=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,Cr=re`<svg class="note-mark" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M5 3h10l4 4v14H5zM9 11h6M9 15h6"/></svg>`,Pr=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,cd=new URL("emoji.json",import.meta.url).href,Mr=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],ni=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,si=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,dd=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,hd=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Yt={bring:"Bring",buy:"Buy"};function ud(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function Me(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function ii(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function pd(s,t){return ks(s,t)||Ae(s).split(",")[0]}function fd(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function gd(){try{return localStorage.getItem(Ar)==="timeline"?"timeline":"compact"}catch{return"compact"}}function md(s){try{localStorage.setItem(Ar,s)}catch{}}function Wn(s,t){return se(s).includes(t)?ce(s,t):be(s,t)}function bd(s,t){if(t.driver==="none")return{driver:"none",riders:[]};let e=Sr(s,t),n=(t.ownWay??[]).filter(i=>t.people.includes(i)&&i!==e),o=t.people.find(i=>se(s).includes(i));return!e||e===o&&!n.length?{driver:"",riders:[]}:{driver:e,riders:t.people.filter(i=>i!==e&&!n.includes(i))}}function Sr(s,t){if(t.driver==="none")return null;let e=se(s).filter(o=>t.people.includes(o)),n=t.people.filter(o=>e.includes(o));return t.driver&&n.includes(t.driver)?t.driver:n[0]??null}function Xt(s){return s.days.every(t=>!t.events.length)}var Jt=class extends Pe{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.leaveTimer=null;this.holdTimer=null;this.holdRepeat=null;this.held=!1;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.noteTip=null;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=lt(location.search).view;this.urlPage=lt(location.search).page;this.urlPast=lt(location.search).past;this.urlDayPicker=lt(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.noteTip?.hide(),this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,i=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(i)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging"),this.noteTip?.hide()}this.onTouched(),n.el.scrollTop=n.top-i,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.noteTip?.hide(),this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},od))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor||this.forPick?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.mode=this.urlView??gd(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1},this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null,this.forPick=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.noteTip??=new In(this,this.renderRoot),this.noteTip.connect(),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.leaveTimer,this.railTimer])e&&clearTimeout(e);this.stopHold(),this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey),this.noteTip?.disconnect()}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){this.noteTip?.sync();let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,a]=o.split("|"),c=e.kids.find(d=>d.id===r);(!c||(c.picks[a]??null)===i||!Wt(c,a))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&wt(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(i=>i.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=_o(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<nd)return!1;let e=this.plan;return!e||this.width-sd>=vs(ke(e).length,se(e).length)}today(){return Dt(this.plan?.time_zone??ld())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let n=this.today(),o=`${n.date}|${n.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:Ko(e,n)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let i=this.board,r=this.boardPlan;this.board=Eo(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o,i&&r&&this.keepPlace(i,r,e)}return this.board}keepPlace(e,n,o){let i=this.scroller;if(!i||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||i.scrollTop<=0)return;let r=e.dayHeads.find(u=>u.date===this.pinDay)?.h??Kt,a=xs(e,i.scrollTop+r+4),c=n.days[Math.floor(a/1440)]?.date,d=c?o.days.findIndex(u=>u.date===c):-1;d>=0&&(this.keepAt=d*1440+(a-Math.floor(a/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n,o=!1){let i=this.scroller;if(!i||!this.board)return;let r=this.topFor(e,n);Math.abs(i.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?i.scrollTo({top:r,behavior:"smooth"}):i.scrollTop=r),this.syncDay()}topFor(e,n){let o=this.board,i=o.dayHeads.find(r=>r.date===n)?.y??0;return Math.max(i,wo(o,e)-vo(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let n=this.today(),o=Math.max(0,this.dayIndexOf(n.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(n.date)?n.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let n=this.nowSpot();n&&this.scrollToTime(n.t,n.date,e)}goToDay(e,n=!1){let o=this.boardPlan;if(!o)return;let i=this.today();if(e===i.date){this.scrollToNow(n);return}let r=this.dayIndexOf(e),a=o.days[r];if(!a)return;let c=1/0;if(this.mode==="timeline"){for(let d of a.events)c=Math.min(c,d.arrive_by??d.start);for(let d of Object.values(a.drivers))for(let u of d.outings)u.start!=null&&(c=Math.min(c,u.start))}this.scrollToTime(r*1440+(Number.isFinite(c)?Math.max(0,c-30):0),e,n)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let c of this.board.dayHeads)c.y<=n+1&&(o=c);this.pinDay!==o.date&&(this.pinDay=o.date);let i=null,r=this.nowSpot(),a=this.today().date;if(r){let c=n-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),d=c>0?"up":"down";this.board.dayHeads.some(u=>u.date===a)&&o.date!==a?i=`${d}|Today`:this.mode==="timeline"&&Math.abs(c)>e.clientHeight*.6&&(i=`${d}|${o.date===a?"Now":"Today"}`)}this.away!==i&&(this.away=i)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,o),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let a=new Map(this.choreDraft);a.delete(e.id),this.choreDraft=a;let c=r instanceof ne?r:new ne("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??wt(e)}editMenu(e,n){let o=this.lunch?.kids??[],i=$t(e,n),r=o.filter(a=>a.id===e.id||i&&$t(a,n)?.dish===i.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let i=o instanceof ne?o:new ne("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let i=new Map(this.lunchDraft);for(let r of n)i.set(Ln(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,n,o)}catch(r){let a=new Map(this.lunchDraft);for(let d of n)a.delete(Ln(e,d));this.lunchDraft=a;let c=r instanceof ne?r:new ne("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?Io(e):Ro(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.forPick=null,this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(Er(),Tr))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||Ms(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(Oo(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof ne?n:new ne("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof ne?n:new ne("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(i=>i.date===this.pinDay)?.h??Kt;this.keepAt=n&&this.board?xs(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||md(e)}findUnplaced(e,n){return this.plan?.days.find(o=>o.date===e)?.unplaced?.find(o=>o.id===n)??null}openForPick(e,n){let o=this.findUnplaced(e,n),i=this.plan;if(!o||!i)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...ke(i),...se(i)]);this.forPick={day:e,id:n,placed:!1,label:`${U(o.at)} ${o.title}`,recurring:!!o.recurring,word:o.reason==="unknown"?o.word:null,fromNotes:!!o.from_notes,people:o.people.filter(a=>r.has(a)),scope:"this",busy:!1}}openStayPick(e,n){let o=this.plan,i=o?.days.find(a=>a.date===e)?.all_day?.find(a=>a.id===n);if(!o||!i)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...ke(o),...se(o)]);this.forPick={day:e,id:n,placed:!1,label:`🏨 ${i.title}`,recurring:!1,word:null,fromNotes:!!i.from_notes,people:i.people.filter(a=>r.has(a)),scope:"this",busy:!1,stay:!0,timed:!!i.timed,driver:i.driver==="none"||se(o).includes(i.driver??"")?i.driver??"":"",ownWay:i.driver&&i.driver!=="none"?i.people.filter(a=>r.has(a)&&a!==i.driver&&!(i.riders??[]).includes(a)):[]}}changeForPick(e,n,o){let i=e.who?.[o.event_id],r=i?.people??[o.own??o.kid];this.closeEditor(),this.forPick={day:n.date,id:o.id,placed:!0,label:`${U(o.start)} ${o.title}`,recurring:o.recurring,word:null,fromNotes:!!i?.from_notes,people:r,scope:"this",busy:!1}}async saveForPick(e=!1){let n=this.forPick,o=this.plan;if(!n||!o||!this.backend||!e&&!n.people.length)return;let i=e?[]:n.people;this.forPick={...n,busy:!0};try{await this.backend.setPeople(n.id,i,n.scope,n.stay&&n.timed&&!e?bd(o,n):void 0),this.forPick=null;let r=n.label.replace(/^\S+ /,""),a=i.map(d=>Wn(o,d)),c=se(o).filter(d=>i.includes(d));this.showToast(e?`Saved. ${r} goes by the names in its title again.`:n.stay?`Saved. ${ot(c.map(d=>ce(o,d)))}’s rides start from ${r} now.`:`Saved. ${r} is in ${ot(a)}’s ${a.length>1?"lanes":"lane"} now.`)}catch(r){this.forPick&&(this.forPick={...this.forPick,busy:!1});let a=r instanceof ne?r:new ne("error",String(r));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}}renderForPick(e){let n=this.plan,o=e.stay?n?.days.some(M=>M.date===e.day&&M.all_day?.some(N=>N.id===e.id&&N.stay)):e.placed?n?.days.some(M=>M.date===e.day&&M.events.some(N=>N.id===e.id)):!!this.findUnplaced(e.day,e.id),i=e.stay?"Who’s staying?":"Who is this for?",r=f`<button type="button" class="btn" ?disabled=${e.busy} @click=${()=>this.closeChorePanels()}>Cancel</button>`;if(!n||!o&&!e.busy)return f`<div class="ed-head">
          <div class="ed-titles"><span class="ed-title">${i}</span></div>
          ${r}
        </div>
        <p class="field-hint">This event is sorted now: someone changed it in Google Calendar, or it’s over.</p>`;let a=e.busy,c=M=>{this.forPick&&(this.forPick={...this.forPick,...M})},d=M=>c({people:e.people.includes(M)?e.people.filter(N=>N!==M):[...e.people,M]}),u=$e(n),l=ke(n),h=l.length>1&&l.every(M=>e.people.includes(M)),x=[...l,...se(n)].filter(M=>e.people.includes(M)),m=x.map(M=>Wn(n,M)),$=!!e.stay&&!x.some(M=>se(n).includes(M)),S=m.length<2?m.join(""):`${m.slice(0,-1).join(", ")} & ${m[m.length-1]}`,g=(M,N,W,de)=>f`<button
      type="button"
      class="who-chip"
      style="--c:${W.color};--rgb:${W.rgb}"
      aria-pressed=${e.people.includes(M)?"true":"false"}
      ?disabled=${a}
      @click=${()=>d(M)}
    >
      <span class="avatar ${de?"driver":""}" aria-hidden="true">${Me(N)}</span>${N}
    </button>`;return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${i}</span>
          <span class="ed-meta">${Ae(e.day)} · ${e.label}</span>
        </div>
        ${r}
      </div>
      ${e.word?f`<p class="field-hint">“${e.word}” isn’t anyone in the family. Pick who it’s for instead.</p>`:E}
      ${e.recurring?f`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${e.scope==="this"?"true":"false"} ?disabled=${a} @click=${()=>c({scope:"this"})}>
                Just ${ye(e.day)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${e.scope==="series"?"true":"false"} ?disabled=${a} @click=${()=>c({scope:"series"})}>
                Every time
              </button>
            </div>
          </div>`:E}
      <div class="field">
        <span class="field-label">Kids</span>
        <div role="group" aria-label="Kids it’s for" class="who-chips">
          ${l.map(M=>g(M,be(n,M),u.get(M)??pe(0),!1))}
        </div>
        ${l.length>1?f`<button
              type="button"
              class="chip all-kids"
              aria-pressed=${h?"true":"false"}
              ?disabled=${a}
              @click=${()=>c({people:h?e.people.filter(M=>!l.includes(M)):[...l,...e.people.filter(M=>!l.includes(M))]})}
            >
              All the kids
            </button>`:E}
      </div>
      <div class="field">
        <span class="field-label">Parents</span>
        <div role="group" aria-label="Parents it’s for" class="who-chips">
          ${se(n).map(M=>g(M,ce(n,M),it,!0))}
        </div>
      </div>
      ${e.stay&&e.timed&&!$?this.renderStayDrive(n,e,c):E}
      <p class="field-hint">
        ${e.stay?f`${e.timed?f`Rides for the parents you pick start and end at ${e.label.replace(/^\S+ /,"")} while they’re there. Pick the kids
                  going too, so they’re in the car on the drive.`:f`Rides for the parents you pick start and end at ${e.label.replace(/^\S+ /,"")} on every day of the stay. The kids
                  go wherever their driver goes, so picking just the parents is enough.`}${x.length?f` Saved in the event’s notes as <strong>For: ${S}</strong>.`:E}`:x.length?f`Saved in the event’s notes as <strong>For: ${S}</strong>, so its title stays as it is. It shows in ${x.length>1?"their lanes":`${m[0]}’s lane`}${x.some(M=>l.includes(M))?", and rides are planned for the kids":""}.`:"Saved in the event’s notes, so its title stays as it is."}
      </p>
      ${e.fromNotes?f`<button type="button" class="chip clear" ?disabled=${a} @click=${()=>void this.saveForPick(!0)}>
            Go by the names in the title instead
          </button>`:E}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${a||!x.length||$} @click=${()=>void this.saveForPick()}>
          ${a?"Saving to Google Calendar…":$?"Pick a parent too":x.length?"Save":"Pick who it’s for"}
        </button>
      </div>
    `}renderStayDrive(e,n,o){let i=n.people.filter(h=>se(e).includes(h)),r=Sr(e,n),a=n.people.filter(h=>h!==r),c=n.ownWay??[],d=$e(e),u=ke(e),l=h=>{let b=!u.includes(h),x=b?it:d.get(h)??pe(0),m=Wn(e,h);return f`<button
        type="button"
        class="who-chip"
        style="--c:${x.color};--rgb:${x.rgb}"
        aria-pressed=${c.includes(h)?"false":"true"}
        ?disabled=${n.busy}
        @click=${()=>o({ownWay:c.includes(h)?c.filter($=>$!==h):[...c,h]})}
      >
        <span class="avatar ${b?"driver":""}" aria-hidden="true">${Me(m)}</span>${m}
      </button>`};return f`<div class="field">
        <span class="field-label">Drives there and back</span>
        <div role="group" aria-label="Who drives there and back" class="choices" style="grid-template-columns:repeat(${i.length+1},1fr)">
          ${i.map(h=>f`<button type="button" class="choice" aria-pressed=${r===h?"true":"false"} ?disabled=${n.busy} @click=${()=>o({driver:h})}>
              ${ce(e,h)}
            </button>`)}
          <button type="button" class="choice" aria-pressed=${r===null?"true":"false"} ?disabled=${n.busy} @click=${()=>o({driver:"none"})}>
            No drive
          </button>
        </div>
      </div>
      ${r&&a.length?f`<div class="field">
            <span class="field-label">In the car with ${ce(e,r)}</span>
            <div role="group" aria-label="Who rides along" class="who-chips">${a.map(l)}</div>
            <p class="field-hint">Anyone not in the car gets there on their own, and the hotel is home for them the whole time.</p>
          </div>`:E}`}renderForLine(e,n,o){let i=e.who?.[o.event_id];if(!i)return E;let r=i.people.map(a=>Wn(e,a));return f`<span class="ed-for"
      >For ${ot(r)}<button type="button" class="ed-for-change" @click=${()=>this.changeForPick(e,n,o)}>Change</button></span
    >`}findEvent(e){let n=this.plan?.days.find(i=>i.date===e.day),o=n?.events.find(i=>i.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.flushLeave(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1},n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.flushLeave(),this.sel=null,this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1}}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(i){let r=i instanceof ne?i:new ne("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o,i){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&i.includes(e.drop)){i.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope,!1));return}this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e,n,o){if(!this.backend)return;let i=this.backend;if(n&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>i.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",n,()=>i.setStay(e.id,n,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,a=r.includes(n)?r.filter(c=>c!==n):[...r,n];this.save(`along-${o}`,a,()=>i.setTakeAlong(e.id,a,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let i=((this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by)??e.start)+n;this.arriveDraft=i===e.start?null:i,this.timesOpen={...this.timesOpen,arrive:!0},this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),_r)}clearArrive(){this.arriveDraft=null,this.timesOpen={...this.timesOpen,arrive:!1},this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,a)).then(()=>{this.arriveDraft=void 0})}nudgeLeave(e,n){let o=this.leaveDraft!==void 0?this.leaveDraft:e.leave_by??null,i=Math.max(e.start+5,(o??e.end)+n);this.leaveDraft=i===e.end?null:i,this.timesOpen={...this.timesOpen,leave:!0},this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=setTimeout(()=>this.flushLeave(),_r)}clearLeave(){this.leaveDraft=null,this.timesOpen={...this.timesOpen,leave:!1},this.flushLeave()}flushLeave(){this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=null;let e=this.leaveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||(o.event.leave_by??null)===e){this.leaveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("leave",e,()=>i.setLeaveBy(r,e,a)).then(()=>{this.leaveDraft=void 0})}startHold(e){this.stopHold(),this.held=!1,this.holdTimer=setTimeout(()=>{this.held=!0,e(),this.holdRepeat=setInterval(e,ad)},rd)}stopHold(){this.holdTimer&&clearTimeout(this.holdTimer),this.holdRepeat&&clearInterval(this.holdRepeat),this.holdTimer=this.holdRepeat=null}tapStep(e){this.held?this.held=!1:e()}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=this.shownPlan(),i=o?Co(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?Do(this.chores,this.today().minutes).filter(h=>!this.choreDone(h)):[],c=this.forPick?this.renderForPick(this.forPick):this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,d=this.forPick?"Who is this for?":this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",u=f`<aside class="panel" aria-label=${d}>
      ${c??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,a))}
    </aside>`,l=this.page==="rides";return f`
      <div class="app ${r?"wide":this.width<id?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${l?this.renderBanner(e):E}
          <main>
            ${l?f`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?Xt(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                  ${n&&o&&!Xt(o)?this.renderDayRail(o):E}
                  ${n&&this.away?this.renderBackToToday(this.away):E}
                </section>`:this.page==="lunch"?f`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:f`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit||this.forPick)?f`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${u}`:E}
          </main>
        </div>
        ${r?u:E}
        ${this.toast?f`<div class="toast" role="status">${this.toast}</div>`:E}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let i=n.problems+o;this.tick;let r=this.today(),a="";if(e){let h=e.time_zone,b=new Date(e.updated);this.error?a=f`<span class="bad">${Di(this.error)} · showing the plan from ${cn(b,new Date,h)}</span>`:e.status&&!e.status.ok?a=f`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${cn(b,new Date,h)}</span>`:this.backend?.live||(a=`Updated ${cn(b,new Date,h)}`)}let c=(h,b,x,m)=>f`
      <button type="button" class="seg-btn" title=${m} aria-pressed=${this.mode===h?"true":"false"} @click=${()=>this.setMode(h)}>
        ${x}<span class="seg-label">${b}</span>
      </button>
    `,d=(h,b,x)=>f`
      <button type="button" class="seg-btn" aria-pressed=${this.page===h?"true":"false"} @click=${()=>this.setPage(h)}>
        ${x}<span class="seg-label">${b}</span>
      </button>
    `,u=Ne(r.minutes),l=!!e&&Xt(e);return f`
      <header>
        ${this.showMenu?f`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${re`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:E}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Ae(r.date)}, ${u}`}>
            <span class="hm">${u.slice(0,-3)}</span><span class="ampm">${u.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${Ae(r.date)}${typeof a=="string"&&a?f`<span class="status"> · ${a}</span>`:E}
          </p>
          ${a&&typeof a!="string"?f`<p class="status">${a}</p>`:E}
        </div>
        ${e&&!l?this.renderNext(e,Mo(e,r),n):E}
        <div class="controls">
          ${this.wide||l&&!o?E:f`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?E:f`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",re`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",re`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${d("rides","Rides",re`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${d("chores","Chores",re`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?E:d("lunch","Lunch",re`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let d=this.today().date,u=o.unassigned,l=o.laterUnassigned;if(u){let b=f`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${u} ${u===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?f`<div class="next idle needs">${b}</div>`:f`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${b}</button>`}if(l)return f`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${l} ${l===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let h=e.days.some(b=>b.date>=d&&b.events.length);return f`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${h?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${h?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let i;n.ongoing?i="On the road now":n.ahead===0?i=n.inMinutes<180?`Next trip · in ${mt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${ye(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,a=f`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Me(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(d=>f`<span class="kid-dot" style="background:${d.color}"></span>`)}</span>
        ${n.warn?f`<span class="next-stop warn">${n.warn}</span>`:n.stop?f`<span class="next-stop">${n.stop}</span>`:E}
      </span>
    `,c=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?f`<button type="button" class=${c} @click=${()=>this.open(n.target)}>${a}</button>`:f`<div class=${c}>${a}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return E;let n=this.today().date,o=$e(e),i=this.railShown;return f`<div
      class="rail-wrap ${i?"out":""}"
      @pointerenter=${()=>{this.railHeld=!0}}
      @pointerleave=${()=>{this.railHeld=!1}}
    >
      <button
        type="button"
        class="rail-tab"
        aria-label="Show the days of the week"
        aria-expanded=${i?"true":"false"}
        tabindex=${i?-1:0}
        @click=${()=>this.showRail(4e3)}
      >
        <span aria-hidden="true"></span>
      </button>
      <nav class="rail" aria-label="Days" ?inert=${!i}>
        ${e.days.map(r=>{let a=ws(r),c=r.events.length,d=r.events.slice(0,4).map(l=>l.own?it.color:o.get(l.kid)?.color??pe(0).color),u=`${Ae(r.date)}: ${c?`${c} ${c===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return f`<button
            type="button"
            class="rail-day ${r.date===n?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${u}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===n?"Today":ye(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${d.length?d.map(l=>f`<span class="rd-dot" style="background:${l}"></span>`):f`<span class="rd-free">free</span>`}
            </span>
            ${a?f`<span class="rd-badge" aria-hidden="true">${a}</span>`:E}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[n,o]=e.split("|");return f`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${re`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${n==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let n=ke(e),o=se(e),i=$e(e),r=n.map(a=>be(e,a));return f`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((a,c)=>re`<circle cx=${50+c*30} cy="80" r="11" fill=${i.get(a).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${fd(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(a=>{let c=i.get(a);return f`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${Me(be(e,a))}</span>
            <span class="qw-name">${be(e,a)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(a=>f`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Me(ce(e,a))}</span>
            <span class="qw-name">${ce(e,a)}</span>
            <span class="qw-sub">No trips</span>
          </div>`)}
      </div>
      <ol class="qw-steps">
        <li>
          <span class="qw-num">1</span>
          <span><strong>Add it to a kid’s calendar</strong>Put the address in the event’s location, so drive times come out right.</span>
        </li>
        <li>
          <span class="qw-num">2</span>
          <span><strong>MyDashLight plans the rides</strong>Leave times, clashes, and who’s free to drive, worked out for you.</span>
        </li>
        <li>
          <span class="qw-num">3</span>
          <span><strong>Tap a ride to change it</strong>Changes are saved in the event’s notes in Google Calendar.</span>
        </li>
      </ol>
    </div>`}renderBanner(e){if(e?.needs_setup==="events_calendar")return f`<div class="notice-bar" role="status">
        Pick your family calendar to see the week: in Home Assistant, open Settings &gt; Devices &amp; services &gt; MyDashLight &gt;
        Configure &gt; Calendars.
      </div>`;let n=e?.unavailable_calendars.length??0;return n?f`<div class="notice-bar" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:E}renderEmpty(){return this.error?f`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:f`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderHead(e,n=!1){return f`<div class="dh-line">
        <button
          type="button"
          class="dh-jump"
          tabindex=${n?-1:0}
          aria-label=${`${e.label}: go to this day`}
          @click=${()=>this.tapHead(e.date)}
        >
          <span class="label">${e.label}</span>${e.tag?f`<span class="tag">${e.tag}</span>`:E}
        </button>
        <span class="sub ${e.warn?"warn":""}">${e.sub}</span>
        ${e.inline?f`<div class="dh-chips">${e.allDay.slice(0,e.inline).map(o=>this.renderStripChip(e,o,n))}</div>`:E}
      </div>
      ${e.allDay.length>e.inline?f`<div class="day-strip" style="padding-left:${xt}px">
            ${e.allDay.slice(e.inline).map(o=>this.renderStripChip(e,o,n))}
          </div>`:E}`}renderStripChip(e,n,o){let i=f`<span class="strip-title">${n.title}</span>${n.note?f`<span class="strip-note">${n.note}</span>`:E}${n.notes?Cr:E}`,r=n.pick,a=n.stay;return a?f`<button
        type="button"
        class="strip-chip hotel ${n.color?"":"plain"} ${n.notes?"noted":""}"
        style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
        tabindex=${o?-1:0}
        data-note=${n.notes||E}
        aria-label=${`${n.title}: ${n.note}. Pick who’s staying`}
        @click=${()=>this.openStayPick(e.date,a)}
      >
        ${i}
      </button>`:r?f`<button
          type="button"
          class="strip-chip warn plain pick"
          tabindex=${o?-1:0}
          data-note=${n.notes||E}
          aria-label=${`${n.title}: ${n.note} Pick who it’s for`}
          @click=${()=>this.openForPick(e.date,r)}
        >
          ${i}
        </button>`:f`<span
          class="strip-chip ${n.warn?"warn":""} ${n.cancelled?"skipped":""} ${n.color?"":"plain"} ${n.notes?"noted":""}"
          style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
          tabindex=${n.notes&&!o?0:E}
          data-note=${n.notes||E}
          >${i}</span
        >`}renderBoard(e){let n=this.sel,o=n?this.findEvent(n):null,i=new Set(o?o.event.own?[o.event.id]:o.day.events.filter(l=>!l.own&&l.event_id===o.event.event_id).map(l=>l.id):[]),r=l=>!!l&&!!n&&l.day===n.day&&i.has(l.event),a=e.dayHeads.find(l=>l.date===this.pinDay)??e.dayHeads[0],c=e.width,d=100,u=[...e.links.map(l=>({t:"link",x:l,z:l.layer??0})),...e.preps.map(l=>({t:"prep",x:l,z:l.layer??d-1})),...e.cards.map(l=>({t:"card",x:l,z:l.layer??d})),...e.rides.map(l=>({t:"ride",x:l,z:l.layer??d+1}))].sort((l,h)=>l.z-h.z);return f`
      <div
        class="scroller"
        @pointerdown=${this.onDown}
        @pointermove=${this.onMove}
        @pointerup=${this.onUp}
        @pointercancel=${this.onUp}
        @click=${this.onClickCapture}
        @scroll=${this.onScroll}
        @wheel=${this.touchListener}
        @touchstart=${this.touchListener}
      >
        <div class="heads" style="width:${c}px">
          ${e.columns.map(l=>f`<div class="col-head ${l.kind}" style="left:${l.x}px;width:${l.w}px;--c:${l.dot};--rgb:${l.rgb}">
              <span class="avatar ${l.kind}" aria-hidden="true">${Me(l.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${l.name}</span>${l.kind==="kid"?this.renderLunchChip(l.id,!0,l.w-58-l.name.length*10.6):E}</span>
                <span class="sub ${l.subWarn?"warn":""}">${l.sub}</span>
              </span>
            </div>`)}
        </div>
        ${a?f`<div class="pinned" aria-hidden="true" style="width:${c}px;height:${a.h}px;margin-bottom:${-a.h}px">
              ${this.renderHead(a,!0)}
            </div>`:E}
        <div class="canvas" style="width:${c}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(l=>f`<div
                class="col-bg ${l.kind}"
                style="left:${l.x}px;width:${l.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${l.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(l=>f`<div class="day-head" style="top:${l.y}px;width:${c}px;height:${l.h}px">${this.renderHead(l)}</div>`)}
          ${e.empties.map(l=>f`<span class="empty" style="top:${l.y}px">${l.text}</span>`)}
          ${e.grid.map(l=>f`<div class="grid ${l.strong?"strong":""}" style="top:${l.y}px;width:${c-60}px"></div>`)}
          ${e.hours.map(l=>f`<span class="hour" style="top:${l.y}px">${l.label}</span>`)}
          ${De(e.bands,l=>l.key,l=>f`<div
                class="band"
                aria-hidden="true"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;background:rgba(${l.color.rgb},0.10);border-color:rgba(${l.color.rgb},0.45)"
              ></div>`)}
          ${De(e.busy,l=>l.key,l=>f`<div class="busy" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span style="top:${l.labelY}px">${l.label}</span>
              </div>`)}
          ${De(e.windows,l=>l.key,l=>f`<div class="window" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span>${l.label}</span>
              </div>`)}
          ${De(u,l=>l.x.key,l=>{if(l.t==="link"){let m=l.x;return f`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;border-color:${m.color.color};background:linear-gradient(rgba(${m.color.rgb},0.11), rgba(${m.color.rgb},0.11)), var(--surface)"
                ></div>`}if(l.t==="prep"){let m=l.x;return f`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;border-color:${m.color.color};background:linear-gradient(rgba(${m.color.rgb},0.11), rgba(${m.color.rgb},0.11)), var(--surface);color:${m.color.ink}"
                >
                  ${m.label}
                </div>`}if(l.t==="ride"){let m=l.x;return f`<button
                  type="button"
                  class="ride ${m.dashed?"dashed":""} ${m.clash?"clash":""} ${m.h>=120?"tall":""}"
                  aria-label=${m.aria}
                  style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;padding-top:${3+(m.tuckTop??0)}px;padding-bottom:${3+(m.tuckBottom??0)}px"
                  @click=${()=>this.open(m.target)}
                >
                  <span class="l1">${m.l1}</span>${m.show2?f`<span class="l2" style="-webkit-line-clamp:${m.lines2}">${m.l2}</span>`:E}
                </button>`}let h=l.x,b=h.color,x=h.skipped?`repeating-linear-gradient(135deg, rgba(${b.rgb},0.10) 0px, rgba(${b.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:h.stayed?`repeating-linear-gradient(135deg, rgba(${b.rgb},0.24) 0px, rgba(${b.rgb},0.24) 6px, rgba(${b.rgb},0.08) 6px, rgba(${b.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${b.rgb},0.15), rgba(${b.rgb},0.15)), var(--surface)`;return f`<button
                type="button"
                class="card ${h.wrap?"wrap":""} ${r(h.target)?"sel":""} ${h.clash?"clash":""} ${h.skipped?"skipped":""} ${h.cut?"cut":""} ${h.event.notes?"noted":""}"
                aria-label=${h.aria}
                data-note=${h.event.notes||E}
                style="left:${h.x}px;top:${h.y}px;width:${h.w}px;height:${h.h}px;background:${x};border-color:${h.clash?"var(--bad)":`rgba(${b.rgb},0.45)`};--c:${b.color};--rgb:${b.rgb};--ring:${b.color}"
                @click=${()=>this.open(h.target)}
              >
                ${h.event.notes?Cr:E}
                <span class="top">
                  <span class="title">${h.title}</span>
                  <span class="time">${h.time}${h.inline&&h.drop?f`<span class="line tone-${h.drop.tone} inline"> · ${h.drop.text}</span>`:E}</span>
                  ${h.showDrop&&h.drop&&!h.inline?f`<span class="line tone-${h.drop.tone}">${h.drop.text}</span>`:E}
                </span>
                ${h.showPick&&h.pick?f`<span class="line tone-${h.pick.tone}">${h.pick.text}</span>`:E}
              </button>`})}
          ${De(e.stays,l=>l.key,l=>f`<button
                type="button"
                class="stay ${l.cut?"cut":""}"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;border-color:${l.color.color};background:repeating-linear-gradient(135deg, rgba(${l.color.rgb},0.28) 0px, rgba(${l.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1" style="color:${l.color.ink}">${l.l1}</span><span class="l2">${l.l2}</span>
              </button>`)}
          ${De(e.trips,l=>l.key,l=>f`<button
                type="button"
                class="trip ${l.bad?"bad":""} ${l.stops?"list":""} ${l.h>=120?"tall":""}"
                aria-label=${l.aria}
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1">${l.l1}${l.kids.map(h=>f`<span class="kid-dot" style="background:${h}"></span>`)}</span>
                ${l.show2?f`<span class="l2">${l.l2}</span>`:E}
                ${l.stops?l.stops.map(h=>f`<span class="stop ${h.warn?"warn":""}">${h.text}</span>`):E}
                ${l.show3?f`<span class="l3">${l.l3}</span>`:E}
              </button>`)}
          ${De(e.overlaps,l=>l.key,l=>f`<div class="overlap" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"></div>`)}
          ${De(e.marks,l=>l.key,l=>f`<span class="mark" style="left:${l.x}px;top:${l.y}px;${l.right?"transform:translateX(-100%)":""}">${l.text}</span>`)}
          ${De(e.folds,l=>l.key,l=>f`<div class="fold" style="top:${l.y}px;width:${c-60}px;height:${l.h}px" aria-hidden="true">
                ${vd(c-60,l.h)}
              </div>
              <span class="fold-label" style="top:${l.y+l.h/2-9}px" title="${Ne(l.from)} to ${Ne(l.to)}">${l.label}</span>`)}
          ${e.now?f`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${c-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:E}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:i,later:r}=e,a=this.plan,c=i+n.length,d=this.chores,u=!!d&&!_s(d);return f`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?E:f`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${u?f`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?f`<div class="attn-chores">${n.map(l=>this.renderChoreRow(l,!0))}</div>`:f`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:f`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!i?f`<div class="all-clear">
            <span class="check" aria-hidden="true">${re`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Xt(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:E}
      ${o.map(l=>f`<div class="issue ${l.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${l.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${l.pick?f`<button type="button" class="issue-title" @click=${()=>l.pick&&this.openForPick(l.pick.day,l.pick.id)}>${l.title}</button>`:l.target?f`<button type="button" class="issue-title" @click=${()=>this.open(l.target,!0)}>${l.title}</button>`:f`<strong class="issue-title">${l.title}</strong>`}
              <span class="issue-body"
                >${l.parts?l.parts.map(h=>typeof h=="string"?h:f`<button type="button" class="issue-link" @click=${()=>this.open(h.target,!0)}>${h.text}</button>`):l.body}</span
              >
            </div>
          </div>
          ${l.suggestions.length?f`<div class="fixes">
                ${l.suggestions.map(h=>f`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(h.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${h.id}`?"Saving…":h.label}</span>
                    <span class="fix-note">${h.note}</span>
                  </button>`)}
              </div>`:E}
        </div>`)}
      ${this.wide&&a&&!Xt(a)&&this.page==="rides"?this.renderLegend():E}
    `}kidColorOf(e){let n=this.plan?$e(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return pe(Math.max(0,o))}renderLunchChip(e,n=!1,o=1/0){let i=this.lunch,r=i?.kids.find(l=>l.id===e);if(!i||!r)return E;this.tick;let a=this.today(),c=Fo(r,a.date,a.minutes,this.lunchDraft);if(!c)return E;let d=Yt[c.lunch],u=`${d} lunch ${c.when}${c.menu?`: ${c.menu}`:""}`;return n&&o<36+d.length*7.4?f`<span class="lunch-chip ${c.lunch} small icon" role="img" aria-label=${u} title=${u}
        >${c.lunch==="bring"?ni:si}</span
      >`:f`<span class="lunch-chip ${c.lunch} ${n?"small":""}" title=${u}
      >${c.lunch==="bring"?ni:si}<span class="lunch-chip-text"
        >${d}${n?E:` ${c.when}`}${!n&&c.menu?f`<span class="lunch-chip-menu"> · ${c.menu}</span>`:E}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return f`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=jo(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:Ie(e.today),i=n.indexOf(o),r=u=>{let l=n[i+u];l&&(this.lunchMonth=l)},a=e.kids.some(u=>u.id===this.lunchKid)?this.lunchKid:null,c=a?e.kids.filter(u=>u.id===a):e.kids,d=e.status&&!e.status.ok?f`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:E;return f`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${re`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${Rn(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${i<0||i>=n.length-1} @click=${()=>r(1)}>
            ${re`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
          </button>
        </div>
        <span class="chores-hint"
          >${this.menuMode?"Tap a day to add or change what’s served.":"Tap a day to switch between Buy and Bring. Tap a weekday to set the whole month."}</span
        >
        <button
          type="button"
          class="btn ${this.menuMode?"dark":""}"
          aria-pressed=${this.menuMode?"true":"false"}
          @click=${()=>{this.menuMode=!this.menuMode,this.menuEdit=null}}
        >
          ${this.menuMode?"Done":f`${Pr} Edit menus`}
        </button>
      </div>
      ${d}
      <div class="chore-cols lunch-cols ${a?"wide":""}" style="--n:${c.length}">
        ${c.map(u=>this.renderLunchCard(e,u,o,a!==null))}
      </div>
      <p class="message-aside">
        Each day’s lunch is a <strong>Lunch: Pizza</strong> all-day event on the kid’s calendar, with the rest of the
        menu in its notes and the Bring or Buy pick at the end. Menus can
        come from the school’s menu feed (set in Home Assistant under MyDashLight’s options, Lunch), a calendar file
        imported once a month, or <strong>Edit menus</strong> here.
        Days off come from <strong>No School</strong> events there. A day nobody picked gets the kid’s default, set in
        Home Assistant under MyDashLight’s options. For a Pack lunch reminder, add a School days chore set to
        <strong>Only on Bring lunch days</strong>.
      </p>
    </div>`}renderLunchCard(e,n,o,i){let r=this.kidColorOf(n.id),a=zo(e,n,o,this.lunchDraft),c=Uo(a),d=a.flat(),u=d.filter(m=>!m.outside&&!m.past&&m.lunch),l=n.days_off.filter(m=>Ie(m.first)<=o&&o<=Ie(m.last)),h=m=>u.filter($=>Dn($.date)===m),b=m=>{let $=h(m);if(!$.length)return;let S=$.every(g=>g.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,$.map(g=>g.date),S)},x=u.length?`${c.bring} Bring · ${c.buy} Buy${o===Ie(e.today)?" left this month":""}`:"No school days left this month";return f`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Me(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${x}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Yt[n.default]} unless picked</span>
          ${e.kids.length<2?E:f`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:n.id}
              >
                ${i?hd:dd}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?f`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:E}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${Rn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((m,$)=>f`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!h($).length}
            aria-label=${`${h($).every(S=>S.lunch==="bring")?"Buy":"Bring"} every ${m} left in ${Rn(o)} for ${n.name}`}
            @click=${()=>b($)}
          >
            ${m}
          </button>`)}
        ${d.map(m=>this.renderLunchCell(n,m,i))}
      </div>
      ${l.length?f`<p class="lunch-offs">
            No school:
            ${l.map(m=>{let $=m.first<`${o}-01`?`${o}-01`:m.first,S=Ie(m.last)>o?kt(`${Rs(o)}-01`,-1):m.last;return`${$===S?ii($):`${ii($)}–${ii(S)}`} ${Ho(m.title)}`}).join(" · ")}
          </p>`:E}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return f`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return f`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=n.lunch,r=i==="buy"?"bring":"buy",a=n.menu?`, ${n.menu}`:"",c=this.menuMode,d=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),u=c?`${e.name}, ${Ae(n.date)}${a||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${Ae(n.date)}: ${Yt[i]}${n.picked?"":" (not picked yet)"}${a}. Tap to ${Yt[r]}.`;return f`<button
      type="button"
      class="lunch-day ${i} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${c?"editing":""} ${d?"sel":""}"
      ?disabled=${n.past&&!c}
      aria-label=${u}
      @click=${()=>c?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${i==="bring"?ni:si}${Yt[i]}</span>
      ${n.menu?f`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?f`<span class="lunch-sides">${n.sides}</span>`:E}`:c?f`<span class="lunch-menu add">${Kn} Menu</span>`:E}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex(S=>S.id===e.kid),a=(this.plan?$e(this.plan).get(e.kid):void 0)??pe(Math.max(0,r)),c=o.kids[r]?.name??"",d=i===wt(e)?e:{...e,state:i?"done":"open",done_at:i?new Date().toISOString():null},u=i&&d.done_by&&d.done_by!==e.kid?o.people?.find(S=>S.id===d.done_by)?.name??d.done_by_name??null:null,l=`${Es(d,o.today,o.time_zone)}${u?` · by ${u}`:""}`,h=i||So(e),b=`${n?`${c}: `:""}${e.title}. ${l?`${l}. `:""}${i?"Done. Tap to undo.":"Tap when it’s done."}`,x=f`<span class="box" aria-hidden="true"
        >${i?re`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:E}</span
      >
      ${e.icon?f`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:E}
      <span class="chore-text">
        <span class="chore-title">${n?f`<span class="chore-kid">${c}</span> · `:E}${e.title}</span>
        ${l?f`<span class="chore-note">${l}</span>`:E}
      </span>`,m=`chore ${i?"done":""} ${e.state==="overdue"&&!i?"overdue":""} ${h?"":"later"}`,$=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return h?f`<button type="button" class=${m} style=${$} aria-pressed=${i?"true":"false"} aria-label=${b} @click=${()=>this.tapChore(e)}>
          ${x}
        </button>`:f`<div class=${m} style=${$}>${x}</div>`}renderChores(){let e=this.chores;if(e===void 0)return f`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return f`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return f`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(_s(e))return f`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${Kn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?f`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:E;this.tick;let i=Lo(e,this.plan?$e(this.plan):void 0,this.today().minutes);return f`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Kn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${Pr} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${i.length}">
        ${i.map(r=>{let a=r.overdue.filter(c=>!this.choreDone(c)).length+r.now.filter(c=>!this.choreDone(c)).length;return f`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Me(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${a?`${a} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?f`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(c=>this.renderChoreRow(c))}`:E}
            ${r.now.length?f`<h3 class="chore-group">To do</h3>
                  ${r.now.map(c=>this.renderChoreRow(c))}`:E}
            ${r.done.length?f`<h3 class="chore-group">Done</h3>
                  ${r.done.map(c=>this.renderChoreRow(c))}`:E}
            ${r.later.map(c=>f`<h3 class="chore-group">${c.date===e.today?"Later today":pd(c.date,e.today)}</h3>
                ${c.chores.map(d=>this.renderChoreRow(d))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?f`<p class="chore-none">No chores this week.</p>`:E}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,i=this.plan?$e(this.plan):void 0,r=this.choreEdit?.template===e.id,a=e.problems.length?f`<span class="tmpl-note bad">${e.problems.map(Ds).join(" · ")} · tap to set up</span>`:f`<span class="tmpl-note">${Ls(e.who,o,e.take_turns)} · ${Ss(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return f`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?f` <span class="tag-paused">Paused</span>`:E}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let d=o.findIndex(l=>l.id===c),u=i?.get(c)??pe(Math.max(0,d));return f`<span class="kid-dot" style="background:${u.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return f`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Kn} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([o,i])=>{let r=e.templates.filter(a=>a.repeats===o);return r.length?f`<section class="manage-group" aria-label=${i}>
                  <h3 class="chore-group">${i}</h3>
                  <div class="tmpl-list">${r.map(a=>this.renderTemplateRow(a))}</div>
                </section>`:E}):f`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return f``;let o=n.kids,i=this.plan?$e(this.plan):void 0,r=this.choreBusy,a=e.template?n.templates.find(m=>m.id===e.template):void 0,c=Ms(e),d=(a?.problems??[]).filter(m=>m!=="who:"),u=(m,$,S,g=!1)=>f`<button type="button" class="choice ${g?"wide":""}" aria-pressed=${m?"true":"false"} ?disabled=${r} @click=${S}>${$}</button>`,l=(m,$,S,g)=>f`<button type="button" class="chip" aria-pressed=${m?"true":"false"} aria-label=${g??E} ?disabled=${r} @click=${S}>${$}</button>`,h=m=>{m!==e.repeats&&this.changeDraft({repeats:m,days:a&&a.repeats===m?a.days??Sn(m):Sn(m)})},b=m=>{let $=e.who.includes(m)?e.who.filter(S=>S!==m):o.filter(S=>S.id===m||e.who.includes(S.id)).map(S=>S.id);this.changeDraft({who:$})},x;if(e.repeats==="school"){let m=e.days===at?new Set:e.days===""?new Set([0,1,2,3,4]):Cs(e.days)??new Set,$=S=>{let g=new Set(m);g.has(S)?g.delete(S):g.add(S),this.changeDraft({days:g.size===5?"":g.size?Ps(g):at})};x=f`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${rt.slice(0,5).map((S,g)=>l(m.has(g),S.slice(0,2),()=>$(g),S))}
          </div>
          <p class="field-hint">Weekdays with no “No School” event on the kid’s calendar.</p>
        </div>
        <div class="field">
          <span class="field-label">When</span>
          <div role="group" aria-label="When" class="choices" style="grid-template-columns:1fr 1fr">
            ${u(!e.night_before,"That morning",()=>this.changeDraft({night_before:!1}))}
            ${u(e.night_before,"The night before",()=>this.changeDraft({night_before:!0}))}
          </div>
          <p class="field-hint">${e.night_before?"Due the evening before each school day: Sunday for Monday.":"Due on the school day itself."}</p>
        </div>
        <div class="field">
          ${u(e.bring_only,e.bring_only?"Only on Bring lunch days":"Every school day, Bring or Buy",()=>this.changeDraft({bring_only:!e.bring_only}),!0)}
          <p class="field-hint">${e.bring_only?"Made only when the kid brings lunch, like Pack lunch.":"Tap to make it only on Bring lunch days, like Pack lunch."}</p>
        </div>`}else if(e.repeats==="monthly"){let m=e.days.trim(),$=/^\d+$/.test(m)?Number(m):null,S=m&&m.toLowerCase()!=="any"&&m.toLowerCase()!=="last"&&$===null;x=f`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${S?4:3}, minmax(0, 1fr))">
          ${u(m===""||m.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${u($!==null,"On a date",()=>this.changeDraft({days:String($??1)}))}
          ${u(m.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${S?u(!0,m,()=>{}):E}
        </div>
        ${$!==null?f`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||$<=1} @click=${()=>this.changeDraft({days:String($-1)})}>−</button>
                <span class="arrive-value">${As($)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||$>=31} @click=${()=>this.changeDraft({days:String($+1)})}>+</button>
              </span>
            </div>`:f`<p class="field-hint">${m.toLowerCase()==="last"?"Due on the month’s last day.":S?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")x=f`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let m=e.days===""||e.days.toLowerCase()==="any",$=e.days===at?new Set:m?new Set:Cs(e.days)??new Set,S=g=>{let M=new Set($);M.has(g)?M.delete(g):M.add(g),this.changeDraft({days:M.size?Ps(M)||"Mon-Sun":at})};x=f`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${u(m,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${u(!m,"On set days",()=>this.changeDraft({days:m?"Sat":e.days}))}
        </div>
        ${m?f`<p class="field-hint">Shows all week, due on Sunday.</p>`:f`<div role="group" aria-label="Days of the week" class="day-chips">
                ${rt.map((g,M)=>l($.has(M),g.slice(0,2),()=>S(M),g))}
              </div>
              <div class="chips">
                ${l(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${l(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:E}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?Ls(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===at?"No days picked":Ss(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${d.length?f`<p class="field-hint bad">${d.map(Ds).join(". ")}. Saving fixes it.</p>`:E}
      <div class="field">
        <label class="field-label" for="chore-name">Chore</label>
        <input
          id="chore-name"
          class="text-input"
          type="text"
          autocomplete="off"
          placeholder="Make bed"
          .value=${e.title}
          ?disabled=${r}
          @input=${m=>this.changeDraft({title:m.target.value})}
        />
        <div role="group" aria-label="Picture" class="icon-chips">
          ${Mr.map(m=>l(e.icon===m,m,()=>this.changeDraft({icon:e.icon===m?null:m}),`Picture ${m}`))}
          ${e.icon&&!Mr.includes(e.icon)?l(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):E}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?f`<emoji-picker
              class="emoji-more"
              .dataSource=${cd}
              @emoji-click=${m=>{let $=m.detail.unicode;$&&this.changeDraft({icon:$}),this.iconMore=!1}}
            ></emoji-picker>`:E}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((m,$)=>{let S=i?.get(m.id)??pe($),g=e.who.includes(m.id);return f`<button type="button" class="who-chip" style="--c:${S.color};--rgb:${S.rgb}" aria-pressed=${g?"true":"false"} ?disabled=${r} @click=${()=>b(m.id)}>
              <span class="avatar" aria-hidden="true">${Me(m.name)}</span>${m.name}
            </button>`})}
        </div>
        ${e.who.length>1?f`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${u(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${u(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:E}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${u(e.repeats==="daily","Every day",()=>h("daily"))}
          ${u(e.repeats==="weekly","Every week",()=>h("weekly"))}
          ${u(e.repeats==="monthly","Every month",()=>h("monthly"))}
          ${u(e.repeats==="school","School days",()=>h("school"))}
        </div>
      </div>
      ${x}
      ${e.repeats==="school"?E:f`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${ud(e.repeats,e.every)}</span>
      </div>`}
      <div class="field">
        <label class="field-label" for="chore-details">Notes <span class="field-hint">Optional, shown with the chore</span></label>
        <textarea
          id="chore-details"
          class="text-input"
          rows="2"
          .value=${e.details}
          ?disabled=${r}
          @input=${m=>this.changeDraft({details:m.target.value})}
        ></textarea>
      </div>
      ${e.template?f`<div class="field">
              ${u(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${r} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:E}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!c} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":c?c.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return f``;let o=e.busy,i=u=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...u})},r=u=>i({kids:e.kids.includes(u)?e.kids.filter(l=>l!==u):[...e.kids,u]}),a=n.kids.filter(u=>Wt(u,e.date)),c=e.dish.trim(),d=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${Ae(e.date)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${o} @click=${()=>this.menuEdit=null}>Cancel</button>
      </div>
      <div class="field">
        <label class="field-label" for="menu-dish">What’s served</label>
        <input
          id="menu-dish"
          class="text-input"
          type="text"
          autocomplete="off"
          placeholder="Pizza, side salad"
          .value=${e.dish}
          ?disabled=${o}
          @input=${u=>i({dish:u.target.value})}
        />
        <span class="field-hint">Shown on the Lunch tab and on each kid’s lunch tag.</span>
      </div>
      <div class="field">
        <label class="field-label" for="menu-details">More <span class="field-hint">Optional, like other choices or sides</span></label>
        <textarea
          id="menu-details"
          class="text-input"
          rows="3"
          .value=${e.details}
          ?disabled=${o}
          @input=${u=>i({details:u.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${a.map(u=>{let l=this.kidColorOf(u.id),h=e.kids.includes(u.id);return f`<button type="button" class="who-chip" style="--c:${l.color};--rgb:${l.rgb}" aria-pressed=${h?"true":"false"} ?disabled=${o} @click=${()=>r(u.id)}>
              <span class="avatar" aria-hidden="true">${Me(u.name)}</span>${u.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${c||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?f`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:E}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!d} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":d??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return f``;let o=n.people?.length?n.people:n.kids.map(l=>({...l,role:"kid"})),i=n.kids.findIndex(l=>l.id===e.kid),r=n.kids[i],a=this.plan?$e(this.plan):void 0,c=a?.get(e.kid)??pe(Math.max(0,i)),d=o.filter(l=>l.id!==e.kid),u=l=>{let h=n.kids.findIndex(b=>b.id===l.id);return h>=0?(a?.get(l.id)??pe(h)).color:"var(--dark)"};return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:E}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${Es(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${c.color};--rgb:${c.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${Me(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?f`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${d.map(l=>f`<button type="button" class="done-by" style="--c:${u(l)}" @click=${()=>void this.toggleChore(e,l.id)}>
                  <span class="avatar ${l.role==="parent"?"driver":""}" aria-hidden="true">${Me(l.name)}</span>
                  <span>${l.name}</span>
                </button>`)}
            </div>`:f`<button type="button" class="choice wide" @click=${()=>this.whoOthers=!0}>Someone else did</button>`}
      </div>
    `}renderLegend(){return f`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}ownHint(e,n){let o=An(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${U(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${U(n.start)} to ${U(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=n.along.map(r=>se(e).includes(r)?ce(e,r):be(e,r));return`${o} drives there and back${i.length?`, with ${ot(i)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return f``;let{day:o,event:i}=n,r=se(e),a=xo(e,i),c=An(e,i),d=!!this.pending,u=v=>this.pending?.key===v?this.pending.value:void 0,l=[...e.people?.carpools??[]];for(let v of e.days)for(let w of v.events)for(let R of[w.drop,w.pick])R&&R!=="none"&&!r.includes(R)&&!l.some(I=>I.toLowerCase()===R.toLowerCase())&&l.push(R);let h=v=>{if(!i.sides.includes(v))return E;let w=u(v)??u("both"),R=v==="drop"?i.drop:i.pick,I=w!==void 0?String(w):i.no_ride_unless_named&&R==="none"?"":R,B=I===""&&!(w===void 0&&i.no_ride_unless_named),G=I&&I!=="none"&&!r.includes(I)?I:"",H=V=>{this.otherOpen=null,this.setRide(i,v,I===V?"":V,r)},Z=[...r.map(V=>[V,ys(e,V)]),["none","Not needed"]],Se=`${i.id}|${v}`,A=this.otherOpen===Se;return f`<div class="field ride-box">
        <span class="field-label">${v==="drop"?"Drop-off":"Pick-up"} ${B?f`<span class="nobody">· nobody yet</span>`:E}</span>
        <div role="group" aria-label=${v==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${Z.length+1}, minmax(0, 1fr))">
          ${Z.map(([V,ie])=>f`<button type="button" class="choice" aria-pressed=${I===V?"true":"false"} ?disabled=${d} @click=${()=>H(V)}>
                ${ie}
              </button>`)}
          <button
            type="button"
            class="choice"
            aria-pressed=${G?"true":"false"}
            aria-expanded=${A?"true":"false"}
            ?disabled=${d}
            @click=${()=>this.otherOpen=A?null:Se}
          >
            ${G||"Other"}
          </button>
        </div>
        ${A?f`${l.length?f`<div role="group" aria-label=${v==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${l.map(V=>f`<button type="button" class="chip" aria-pressed=${I.toLowerCase()===V.toLowerCase()?"true":"false"} ?disabled=${d} @click=${()=>H(V)}>
                    ${V}
                  </button>`)}
            </div>`:E}
        <input
          type="text"
          .value=${G&&!l.some(V=>V.toLowerCase()===G.toLowerCase())?G:""}
          ?disabled=${d}
          aria-label=${v==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${V=>{let ie=V.target.value.trim();ie&&ie!==I&&H(ie)}}
          @keydown=${V=>{V.key==="Enter"&&V.target.blur()}}
        />`:E}
        ${!S&&I!==""&&I!=="none"?b(v,I):E}
      </div>`},b=(v,w)=>{let R=u(`along-${v}`),I=R!==void 0?R:v==="pick"?i.pick_along??[]:i.along,B=new Set(o.events.filter(Z=>Z.event_id===i.event_id&&!Z.own).map(Z=>Z.kid)),G=[...ke(e).filter(Z=>Z!==i.kid&&!B.has(Z)),...r.filter(Z=>Z!==w)];return G.length?f`<div class="field-sub">
        <span class="field-label">${v==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${v==="pick"?"Coming home too. Anyone already there just gets in.":v==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${v==="drop"?"Riding along on the drop-off":v==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${G.map(Z=>f`<button type="button" class="chip" aria-pressed=${I.includes(Z)?"true":"false"} ?disabled=${d} @click=${()=>this.toggleAlong(i,Z,v)}>
              ${r.includes(Z)?ce(e,Z):be(e,Z)}
            </button>`)}
        </div>
      </div>`:E},x=r.includes(i.drop)?i.drop:r.includes(i.pick)?i.pick:"",m=i.drop===i.pick&&r.includes(i.drop),$=u("stay"),S=$!==void 0?!!$:i.stay&&m,g=u("along"),M=g!==void 0?g:i.along,N=i.own?[...ke(e),...r.filter(v=>v!==i.own)]:[],W=i.own!=null&&i.takes!=null,de=i.own!=null&&!W,T=u("takes"),_=T!==void 0?T:i.takes??null,k=u("arrive"),C=this.arriveDraft!==void 0?this.arriveDraft:k!==void 0?k:i.arrive_by,P=u("leave"),L=this.leaveDraft!==void 0?this.leaveDraft:P!==void 0?P:i.leave_by??null,j=(v,w)=>{let R=v==="arrive",I=R?i.start:i.end,B=H=>()=>R?this.nudgeArrive(i,H):this.nudgeLeave(i,H),G=(H,Z,Se,A)=>f`<button
          type="button"
          class="step"
          aria-label=${Z}
          ?disabled=${d||A}
          @pointerdown=${()=>this.startHold(B(H))}
          @pointerup=${()=>this.stopHold()}
          @pointerleave=${()=>this.stopHold()}
          @pointercancel=${()=>this.stopHold()}
          @click=${()=>this.tapStep(B(H))}
        >
          ${Se}
        </button>`;return f`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">${R?"Arrive":"Leave"}</span>
          <span class="field-hint">${ln(w-I)}</span>
        </span>
        <span class="stepper">
          ${G(-5,"Five minutes earlier","−",!R&&w-5<=i.start)}
          <span class="arrive-value">${U(w)}</span>
          ${G(5,"Five minutes later","+",!1)}
          <button
            type="button"
            class="step clear-time"
            aria-label=${R?"Arrive on time":"Leave at the end"}
            ?disabled=${d}
            @click=${()=>R?this.clearArrive():this.clearLeave()}
          >
            ×
          </button>
        </span>
      </div>`},F=i.sides.includes("pick")||i.own!=null,Y=C!=null||this.timesOpen.arrive,J=F&&(L!=null||this.timesOpen.leave),z=v=>()=>{this.timesOpen={...this.timesOpen,[v]:!0}},X=()=>f`${Y?j("arrive",C??i.start):E}
      ${J?j("leave",L??i.end):E}
      ${!Y||!J&&F?f`<div class="field time-chips">
            <div role="group" aria-label="Times" class="chips">
              ${Y?E:f`<button type="button" class="chip" ?disabled=${d} @click=${z("arrive")}>Arrive early or late</button>`}
              ${!J&&F?f`<button type="button" class="chip" ?disabled=${d} @click=${z("leave")}>Leave early or late</button>`:E}
            </div>
          </div>`:E}`,he=i.sides.includes("drop")&&i.sides.includes("pick"),Ee=he&&(S||this.stayDraft===i.id),Fe=()=>{let v=he?f`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${Ee?"false":"true"}
              ?disabled=${d}
              @click=${()=>{this.stayDraft=null,i.stay&&this.toggleStay(i,!1,x)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${Ee?"true":"false"}
              ?disabled=${d}
              @click=${()=>{x?this.toggleStay(i,!0,x):this.stayDraft=i.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:E;if(!Ee)return f`${v} ${h("drop")} ${h("pick")}`;let w=S&&m?i.drop:"";return f`${v}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${w?E:f`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(R=>f`<button
                type="button"
                class="choice"
                aria-pressed=${w===R?"true":"false"}
                ?disabled=${d}
                @click=${()=>{if(w===R||!this.backend)return;let I=this.backend;this.stayDraft=null,this.save("stay",!0,()=>I.setRide(i.id,"both",R,this.scope,!0))}}
              >
                ${ce(e,R)}
              </button>`)}
          </div>
          ${w?b("both",w):E}
        </div>`},ue=[],fe=v=>v==="none"?"Not needed":ys(e,v),te=v=>r.includes(v)?ce(e,v):be(e,v),_e=(v,w,R)=>{w===""&&!R.length||ue.push(`${v}: ${[w===""?"TBD":fe(w),...R.map(te)].join(", ")}`)},we=v=>i.no_ride_unless_named&&v==="none"?"":v;i.own||_e("Drop-off",we(i.drop),i.along),i.own||_e("Pick-up",we(i.pick),i.pick_along??[]),!i.own&&i.stay&&ue.push("Stay: yes"),W&&ue.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&ue.push(`Take along: ${i.along.map(te).join(", ")}`),i.arrive_by!=null&&i.arrive_by!==i.start&&ue.push(`Arrive: ${ln(i.arrive_by-i.start)}`),i.leave_by!=null&&i.leave_by!==i.end&&ue.push(`Leave: ${ln(i.leave_by-i.end)}`);let qe=u("attending"),Ce=qe!==void 0?!!qe:i.attending!==!1;i.attending===!1&&ue.splice(0,ue.length,"Attending: no");let Be=o.date===this.today().date?"":`${ye(o.date)} · `,p=Mn(i),y=f`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${c} · ${i.title}</span>
          <span class="ed-meta">${Be}${W?"any time ":""}${p}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
          ${this.renderForLine(e,o,i)}
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;if(i.busy_only){let v=i.place_name&&i.place_name!==i.title?i.place_name:"",w=i.busy_why==="days"?"It runs over more than a day, so no drive is planned for it.":i.busy_why==="home"?"It’s at home, so no drive is planned for it.":"It has no address, so no drive is planned for it.";return f`${y}
        ${this.pending?f`<p class="saving" role="status">Saving to Google Calendar…</p>`:E}
        ${v?f`<div class="field"><span class="field-label">Where</span><span class="field-hint">${v}</span></div>`:E}
        <p class="field-hint">
          ${Ce?`This blocks ${c}’s time: ${c} can’t drive then, so a ride that needs ${c} shows as a problem.`:`Not going, so it doesn’t block ${c}’s time, and ${c} can drive then.`}
          ${w}
        </p>
        <button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.setAttending(i,!Ce)}>
          ${Ce?`${c} isn’t going this time`:`${c} is going after all`}
        </button>
        ${i.problems.length?f`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:E}
        <details class="notes">
          <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
          <span class="notes-body">--- Rides ---\n${i.attending===!1?"Attending: no":"(nothing yet)"}</span>
        </details>`}return i.where==="home"?f`${y}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:f`
      ${y}
      ${this.pending?f`<p class="saving" role="status">Saving to Google Calendar…</p>`:E}
      ${i.recurring?f`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${ye(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:E}
      ${Ce?f`${i.where==="anywhere"?f`<p class="field-hint">
                  ${i.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:E}
            ${i.own?f`<p class="field-hint">${this.ownHint(e,i)}</p>`:Fe()}
      ${i.own?f`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${_!=null?`Takes ${_} min, any time ${U(i.start)}–${U(i.end)}`:"At its set time"}</span>
            </span>
            ${_!=null?f`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${d||_<=5} @click=${()=>this.setTakes(i,Math.max(5,_-5))}>−</button>
                  <span class="arrive-value">${_} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${d||_+5>i.end-i.start} @click=${()=>this.setTakes(i,_+5)}>+</button>
                </span>`:E}
          </div>
          <button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.setTakes(i,_!=null?null:Math.min(10,Math.max(5,i.end-i.start)))}>
            ${_!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:E}
      ${de&&N.length?f`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${N.map(v=>f`<button type="button" class="chip" aria-pressed=${M.includes(v)?"true":"false"} ?disabled=${d} @click=${()=>this.toggleAlong(i,v)}>
                  ${r.includes(v)?ce(e,v):be(e,v)}
                </button>`)}
            </div>
          </div>`:E}
      ${W?E:X()}
`:f`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${c} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.setAttending(i,!Ce)}>
        ${Ce?`${c} isn’t going this time`:`${c} is going after all`}
      </button>
      ${i.problems.length?f`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:E}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${ue.length?ue.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${Ce&&!i.own?f`<p class="field-hint">Tap a selected driver again to clear it.</p>`:E}
    `}};Jt.styles=Wo,Jt.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},leaveDraft:{state:!0},timesOpen:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0},forPick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Jt);function vd(s,t){let o=Math.max(1,Math.round(s/14)),i=s/o,r=[],a=[];for(let d=0;d<=o;d++){let u=+(d*i).toFixed(1);r.push(`${u},${d%2?5:0}`),a.push(`${u},${t-(d%2?0:5)}`)}let c=`M${r.join(" L")} L${[...a].reverse().join(" L")} Z`;return f`<svg width=${s} height=${t} viewBox="0 0 ${s} ${t}">
    ${re`<path class="fold-fill" d=${c}></path>
      <path class="fold-edge" d=${`M${r.join(" L")}`}></path>
      <path class="fold-edge" d=${`M${a.join(" L")}`}></path>`}
  </svg>`}function yd(){let s=[document];for(let t of document.querySelectorAll("*"))t.shadowRoot&&s.push(t.shadowRoot);return s}function Lr(s=3e3){let t=new CSSStyleSheet;t.replaceSync("*, *::before, *::after { cursor: none !important; }"),t.disabled=!0;let e,n=i=>{if(i)for(let r of yd())r.adoptedStyleSheets.includes(t)||(r.adoptedStyleSheets=[...r.adoptedStyleSheets,t]);t.disabled=!i},o=i=>{if(clearTimeout(e),i.pointerType==="touch"){n(!0);return}n(!1),e=setTimeout(()=>n(!0),s)};window.addEventListener("pointermove",o,{passive:!0}),window.addEventListener("pointerdown",o,{passive:!0}),e=setTimeout(()=>n(!0),s)}function Dr(s){try{return new URL(s).searchParams.get("v")}catch{return null}}function Rr(s,t,e){if(!t)return()=>{};let n=e.everyMs??6e5,o=e.retryMs??3e4,i=e.idleMs??12e4,r=null,a=null,c=0,d=!1,u=x=>{if(d||a)return;let m=e.idleFor();if(m>=i){e.reload(x);return}a=setTimeout(()=>{a=null,u(x)},i-m)},l=async()=>{try{let x=await s.sendMessagePromise({type:"mydashlight/app_version"});c=0;let m=x["kiosk.js"];!d&&m&&m!==t&&u(m)}catch{if(d||r||++c>20)return;r=setTimeout(()=>{r=null,l()},o)}},h=()=>{c=0,l()};s.addEventListener?.("ready",h);let b=setInterval(()=>void l(),n);return()=>{d=!0,clearInterval(b),r&&clearTimeout(r),a&&clearTimeout(a),s.removeEventListener?.("ready",h)}}function Ir(s,t=6e4,e=15e3){let n=null,o=setInterval(()=>{if(!s.connected||n)return;let i=!1;n=setTimeout(()=>{n=null,!i&&s.connected&&s.reconnect(!0)},e);let r=()=>{i=!0,n&&clearTimeout(n),n=null};s.ping().then(r,r)},t);return()=>{clearInterval(o),n&&clearTimeout(n),n=null}}var Or=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],Br=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function Nr(s,t,e,n){let o=Math.max(0,Math.min(t,s.length)),i=Math.max(o,Math.min(e,s.length));return{value:s.slice(0,o)+n+s.slice(i),caret:o+n.length}}function jr(s,t,e){let n=Math.max(0,Math.min(t,s.length)),o=Math.max(n,Math.min(e,s.length));if(n!==o)return{value:s.slice(0,n)+s.slice(o),caret:n};if(n===0)return{value:s,caret:0};let i=Array.from(s.slice(0,n));i.pop();let r=i.join("");return{value:r+s.slice(n),caret:r.length}}function zr(s,t){return t===0||/\s$/.test(s.slice(0,t))}var xd=new Set(["text","search","email","url","tel","number","password"]);function Hr(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&xd.has(s.type)&&!s.readOnly&&!s.disabled}var wd={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},kd={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},Zt=class extends Pe{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=n=>n.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let n=e.selectionStart,o=e.selectionEnd;if(n!==null&&o!==null)return[n,o]}catch{}return[e.value.length,e.value.length]}apply(e,n,o){e.value=n;try{e.setSelectionRange(o,o)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=zr(this.field.value,e)}press(e){let n=this.field;if(n){switch(e){case"hide":n.blur();return;case"done":this.commit(),n.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),n.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[o,i]=this.selection(n),r=jr(n.value,o,i);this.apply(n,r.value,r.caret);break}default:{let o=e==="space"?" ":this.shift?e.toUpperCase():e,[i,r]=this.selection(n),a=Nr(n.value,i,r,o);this.apply(n,a.value,a.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let n=e.length>1,o=e==="layout"?this.layout==="letters"?"123":"ABC":wd[e]??(this.shift?e.toUpperCase():e);return f`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":n?"wide":""}
      aria-label=${kd[e]??o}
      aria-pressed=${e==="shift"?String(this.shift):E}
      @click=${()=>this.press(e)}
    >
      ${o}
    </button>`}render(){let e=this.layout==="letters"?Or:Br;return f`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(n=>f`<div class="row">${n.map(o=>this.key(o))}</div>`)}
      </div>`}};Zt.styles=Je`
    :host {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 60;
      display: block;
      padding: 10px 12px 14px;
      background: #d9d7d1;
      border-top: 1px solid #c8c5bd;
      box-shadow: 0 -6px 20px rgba(28, 30, 34, 0.12);
      font-family: Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      transform: translateY(0);
      transition: transform 160ms ease-out;
    }
    :host([hidden]) {
      display: none;
    }
    .rows {
      display: grid;
      gap: 8px;
      max-width: 1100px;
      margin: 0 auto;
    }
    .row {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
    button {
      flex: 1 1 0;
      max-width: 96px;
      height: 58px;
      border: 0;
      border-radius: 10px;
      background: #fff;
      color: #1c1e22;
      font: inherit;
      font-size: 22px;
      box-shadow: 0 1px 0 rgba(28, 30, 34, 0.25);
      cursor: pointer;
    }
    button:active,
    button[aria-pressed="true"] {
      background: #c4c1b9;
    }
    button.wide {
      flex-grow: 1.5;
      max-width: 144px;
      font-size: 17px;
      font-weight: 600;
      background: #eceae5;
    }
    button.space {
      flex-grow: 5;
      max-width: 520px;
      font-size: 16px;
      color: #5a6069;
    }
    button.done {
      flex-grow: 1.8;
      max-width: 170px;
      background: #23272e;
      color: #fff;
      font-size: 18px;
      font-weight: 600;
    }
    button.done:active {
      background: #000;
    }
    .top {
      display: flex;
      justify-content: flex-end;
      max-width: 1100px;
      margin: 0 auto 6px;
    }
    .top button {
      flex: none;
      width: auto;
      max-width: none;
      height: 36px;
      padding: 0 14px;
      font-size: 15px;
      font-weight: 600;
      background: transparent;
      box-shadow: none;
      color: #3d434b;
    }
  `,Zt.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",Zt);function $d(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function Ur(s){let t=new WeakSet,e=r=>{let a=r.composedPath();i(a);let c=a[0];Hr(c)&&s.attach(c)},n=()=>{setTimeout(()=>{let r=$d();!s.target||r===s.target||(Hr(r)?s.attach(r):s.detach())},0)},o=r=>{t.has(r)||(t.add(r),r.addEventListener("focusin",e),r.addEventListener("focusout",n))},i=r=>{for(let a of r)a instanceof ShadowRoot&&o(a)};o(document),document.addEventListener("pointerdown",r=>i(r.composedPath()),{capture:!0}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var oi="mydashlight",Td=`/api/${oi}/pair`,Ed=`/api/${oi}/pair/poll`,ri=`/${oi}`,ai="pair";function Fr(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function Kr(s,t){return`${s}${ri}?${ai}=${encodeURIComponent(t)}`}function _d(s,t,e=Date.now()){return{hassUrl:s,clientId:t.client_id,access_token:t.access_token,refresh_token:t.refresh_token,expires_in:t.expires_in,expires:e+t.expires_in*1e3}}var pt=class extends Error{constructor(t,e=!1){super(t),this.busy=e}};async function Wr(s=fetch){let t=await s(Td,{method:"POST",cache:"no-store"});if(t.status===429)throw new pt("Too many screens are asking to pair right now.",!0);if(!t.ok)throw new pt(`Home Assistant answered ${t.status}.`);return await t.json()}async function Vr(s,t,e=fetch){let n=await e(Ed,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(n.status===404)return{status:"expired"};if(!n.ok)throw new pt(`Home Assistant answered ${n.status}.`);let o=await n.json();return o.status==="paired"&&o.auth?{status:"paired",auth:_d(t,o.auth)}:{status:"pending"}}var Pt=function(s,t){let o=s,i=Qt[t],r=null,a=0,c=null,d=[],u={},l=function(T,_){a=o*4+17,r=(function(k){let C=new Array(k);for(let P=0;P<k;P+=1){C[P]=new Array(k);for(let L=0;L<k;L+=1)C[P][L]=null}return C})(a),h(0,0),h(a-7,0),h(0,a-7),m(),x(),S(T,_),o>=7&&$(T),c==null&&(c=N(o,i,d)),g(c,_)},h=function(T,_){for(let k=-1;k<=7;k+=1)if(!(T+k<=-1||a<=T+k))for(let C=-1;C<=7;C+=1)_+C<=-1||a<=_+C||(0<=k&&k<=6&&(C==0||C==6)||0<=C&&C<=6&&(k==0||k==6)||2<=k&&k<=4&&2<=C&&C<=4?r[T+k][_+C]=!0:r[T+k][_+C]=!1)},b=function(){let T=0,_=0;for(let k=0;k<8;k+=1){l(!0,k);let C=Ve.getLostPoint(u);(k==0||T>C)&&(T=C,_=k)}return _},x=function(){for(let T=8;T<a-8;T+=1)r[T][6]==null&&(r[T][6]=T%2==0);for(let T=8;T<a-8;T+=1)r[6][T]==null&&(r[6][T]=T%2==0)},m=function(){let T=Ve.getPatternPosition(o);for(let _=0;_<T.length;_+=1)for(let k=0;k<T.length;k+=1){let C=T[_],P=T[k];if(r[C][P]==null)for(let L=-2;L<=2;L+=1)for(let j=-2;j<=2;j+=1)L==-2||L==2||j==-2||j==2||L==0&&j==0?r[C+L][P+j]=!0:r[C+L][P+j]=!1}},$=function(T){let _=Ve.getBCHTypeNumber(o);for(let k=0;k<18;k+=1){let C=!T&&(_>>k&1)==1;r[Math.floor(k/3)][k%3+a-8-3]=C}for(let k=0;k<18;k+=1){let C=!T&&(_>>k&1)==1;r[k%3+a-8-3][Math.floor(k/3)]=C}},S=function(T,_){let k=i<<3|_,C=Ve.getBCHTypeInfo(k);for(let P=0;P<15;P+=1){let L=!T&&(C>>P&1)==1;P<6?r[P][8]=L:P<8?r[P+1][8]=L:r[a-15+P][8]=L}for(let P=0;P<15;P+=1){let L=!T&&(C>>P&1)==1;P<8?r[8][a-P-1]=L:P<9?r[8][15-P-1+1]=L:r[8][15-P-1]=L}r[a-8][8]=!T},g=function(T,_){let k=-1,C=a-1,P=7,L=0,j=Ve.getMaskFunction(_);for(let F=a-1;F>0;F-=2)for(F==6&&(F-=1);;){for(let Y=0;Y<2;Y+=1)if(r[C][F-Y]==null){let J=!1;L<T.length&&(J=(T[L]>>>P&1)==1),j(C,F-Y)&&(J=!J),r[C][F-Y]=J,P-=1,P==-1&&(L+=1,P=7)}if(C+=k,C<0||a<=C){C-=k,k=-k;break}}},M=function(T,_){let k=0,C=0,P=0,L=new Array(_.length),j=new Array(_.length);for(let z=0;z<_.length;z+=1){let X=_[z].dataCount,he=_[z].totalCount-X;C=Math.max(C,X),P=Math.max(P,he),L[z]=new Array(X);for(let fe=0;fe<L[z].length;fe+=1)L[z][fe]=255&T.getBuffer()[fe+k];k+=X;let Ee=Ve.getErrorCorrectPolynomial(he),ue=en(L[z],Ee.getLength()-1).mod(Ee);j[z]=new Array(Ee.getLength()-1);for(let fe=0;fe<j[z].length;fe+=1){let te=fe+ue.getLength()-j[z].length;j[z][fe]=te>=0?ue.getAt(te):0}}let F=0;for(let z=0;z<_.length;z+=1)F+=_[z].totalCount;let Y=new Array(F),J=0;for(let z=0;z<C;z+=1)for(let X=0;X<_.length;X+=1)z<L[X].length&&(Y[J]=L[X][z],J+=1);for(let z=0;z<P;z+=1)for(let X=0;X<_.length;X+=1)z<j[X].length&&(Y[J]=j[X][z],J+=1);return Y},N=function(T,_,k){let C=Gr.getRSBlocks(T,_),P=qr();for(let j=0;j<k.length;j+=1){let F=k[j];P.put(F.getMode(),4),P.put(F.getLength(),Ve.getLengthInBits(F.getMode(),T)),F.write(P)}let L=0;for(let j=0;j<C.length;j+=1)L+=C[j].dataCount;if(P.getLengthInBits()>L*8)throw"code length overflow. ("+P.getLengthInBits()+">"+L*8+")";for(P.getLengthInBits()+4<=L*8&&P.put(0,4);P.getLengthInBits()%8!=0;)P.putBit(!1);for(;!(P.getLengthInBits()>=L*8||(P.put(236,8),P.getLengthInBits()>=L*8));)P.put(17,8);return M(P,C)};u.addData=function(T,_){_=_||"Byte";let k=null;switch(_){case"Numeric":k=Cd(T);break;case"Alphanumeric":k=Pd(T);break;case"Byte":k=Md(T);break;case"Kanji":k=Ad(T);break;default:throw"mode:"+_}d.push(k),c=null},u.isDark=function(T,_){if(T<0||a<=T||_<0||a<=_)throw T+","+_;return r[T][_]},u.getModuleCount=function(){return a},u.make=function(){if(o<1){let T=1;for(;T<40;T++){let _=Gr.getRSBlocks(T,i),k=qr();for(let P=0;P<d.length;P++){let L=d[P];k.put(L.getMode(),4),k.put(L.getLength(),Ve.getLengthInBits(L.getMode(),T)),L.write(k)}let C=0;for(let P=0;P<_.length;P++)C+=_[P].dataCount;if(k.getLengthInBits()<=C*8)break}o=T}l(!1,b())},u.createTableTag=function(T,_){T=T||2,_=typeof _>"u"?T*4:_;let k="";k+='<table style="',k+=" border-width: 0px; border-style: none;",k+=" border-collapse: collapse;",k+=" padding: 0px; margin: "+_+"px;",k+='">',k+="<tbody>";for(let C=0;C<u.getModuleCount();C+=1){k+="<tr>";for(let P=0;P<u.getModuleCount();P+=1)k+='<td style="',k+=" border-width: 0px; border-style: none;",k+=" border-collapse: collapse;",k+=" padding: 0px; margin: 0px;",k+=" width: "+T+"px;",k+=" height: "+T+"px;",k+=" background-color: ",k+=u.isDark(C,P)?"#000000":"#ffffff",k+=";",k+='"/>';k+="</tr>"}return k+="</tbody>",k+="</table>",k},u.createSvgTag=function(T,_,k,C){let P={};typeof arguments[0]=="object"&&(P=arguments[0],T=P.cellSize,_=P.margin,k=P.alt,C=P.title),T=T||2,_=typeof _>"u"?T*4:_,k=typeof k=="string"?{text:k}:k||{},k.text=k.text||null,k.id=k.text?k.id||"qrcode-description":null,C=typeof C=="string"?{text:C}:C||{},C.text=C.text||null,C.id=C.text?C.id||"qrcode-title":null;let L=u.getModuleCount()*T+_*2,j,F,Y,J,z="",X;for(X="l"+T+",0 0,"+T+" -"+T+",0 0,-"+T+"z ",z+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',z+=P.scalable?"":' width="'+L+'px" height="'+L+'px"',z+=' viewBox="0 0 '+L+" "+L+'" ',z+=' preserveAspectRatio="xMinYMin meet"',z+=C.text||k.text?' role="img" aria-labelledby="'+W([C.id,k.id].join(" ").trim())+'"':"",z+=">",z+=C.text?'<title id="'+W(C.id)+'">'+W(C.text)+"</title>":"",z+=k.text?'<description id="'+W(k.id)+'">'+W(k.text)+"</description>":"",z+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',z+='<path d="',Y=0;Y<u.getModuleCount();Y+=1)for(J=Y*T+_,j=0;j<u.getModuleCount();j+=1)u.isDark(Y,j)&&(F=j*T+_,z+="M"+F+","+J+X);return z+='" stroke="transparent" fill="black"/>',z+="</svg>",z},u.createDataURL=function(T,_){T=T||2,_=typeof _>"u"?T*4:_;let k=u.getModuleCount()*T+_*2,C=_,P=k-_;return Rd(k,k,function(L,j){if(C<=L&&L<P&&C<=j&&j<P){let F=Math.floor((L-C)/T),Y=Math.floor((j-C)/T);return u.isDark(Y,F)?0:1}else return 1})},u.createImgTag=function(T,_,k){T=T||2,_=typeof _>"u"?T*4:_;let C=u.getModuleCount()*T+_*2,P="";return P+="<img",P+=' src="',P+=u.createDataURL(T,_),P+='"',P+=' width="',P+=C,P+='"',P+=' height="',P+=C,P+='"',k&&(P+=' alt="',P+=W(k),P+='"'),P+="/>",P};let W=function(T){let _="";for(let k=0;k<T.length;k+=1){let C=T.charAt(k);switch(C){case"<":_+="&lt;";break;case">":_+="&gt;";break;case"&":_+="&amp;";break;case'"':_+="&quot;";break;default:_+=C;break}}return _},de=function(T){T=typeof T>"u"?2:T;let k=u.getModuleCount()*1+T*2,C=T,P=k-T,L,j,F,Y,J,z={"██":"█","█ ":"▀"," █":"▄","  ":" "},X={"██":"▀","█ ":"▀"," █":" ","  ":" "},he="";for(L=0;L<k;L+=2){for(F=Math.floor((L-C)/1),Y=Math.floor((L+1-C)/1),j=0;j<k;j+=1)J="█",C<=j&&j<P&&C<=L&&L<P&&u.isDark(F,Math.floor((j-C)/1))&&(J=" "),C<=j&&j<P&&C<=L+1&&L+1<P&&u.isDark(Y,Math.floor((j-C)/1))?J+=" ":J+="█",he+=T<1&&L+1>=P?X[J]:z[J];he+=`
`}return k%2&&T>0?he.substring(0,he.length-k-1)+Array(k+1).join("▀"):he.substring(0,he.length-1)};return u.createASCII=function(T,_){if(T=T||1,T<2)return de(_);T-=1,_=typeof _>"u"?T*2:_;let k=u.getModuleCount()*T+_*2,C=_,P=k-_,L,j,F,Y,J=Array(T+1).join("██"),z=Array(T+1).join("  "),X="",he="";for(L=0;L<k;L+=1){for(F=Math.floor((L-C)/T),he="",j=0;j<k;j+=1)Y=1,C<=j&&j<P&&C<=L&&L<P&&u.isDark(F,Math.floor((j-C)/T))&&(Y=0),he+=Y?J:z;for(F=0;F<T;F+=1)X+=he+`
`}return X.substring(0,X.length-1)},u.renderTo2dContext=function(T,_){_=_||2;let k=u.getModuleCount();for(let C=0;C<k;C++)for(let P=0;P<k;P++)T.fillStyle=u.isDark(C,P)?"black":"white",T.fillRect(P*_,C*_,_,_)},u};Pt.stringToBytes=function(s){let t=[];for(let e=0;e<s.length;e+=1){let n=s.charCodeAt(e);t.push(n&255)}return t};Pt.createStringToBytes=function(s,t){let e=(function(){let o=Ld(s),i=function(){let c=o.read();if(c==-1)throw"eof";return c},r=0,a={};for(;;){let c=o.read();if(c==-1)break;let d=i(),u=i(),l=i(),h=String.fromCharCode(c<<8|d),b=u<<8|l;a[h]=b,r+=1}if(r!=t)throw r+" != "+t;return a})(),n=63;return function(o){let i=[];for(let r=0;r<o.length;r+=1){let a=o.charCodeAt(r);if(a<128)i.push(a);else{let c=e[o.charAt(r)];typeof c=="number"?(c&255)==c?i.push(c):(i.push(c>>>8),i.push(c&255)):i.push(n)}}return i}};var xe={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},Qt={L:1,M:0,Q:3,H:2},We={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},Ve=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,e=7973,n=21522,o={},i=function(r){let a=0;for(;r!=0;)a+=1,r>>>=1;return a};return o.getBCHTypeInfo=function(r){let a=r<<10;for(;i(a)-i(t)>=0;)a^=t<<i(a)-i(t);return(r<<10|a)^n},o.getBCHTypeNumber=function(r){let a=r<<12;for(;i(a)-i(e)>=0;)a^=e<<i(a)-i(e);return r<<12|a},o.getPatternPosition=function(r){return s[r-1]},o.getMaskFunction=function(r){switch(r){case We.PATTERN000:return function(a,c){return(a+c)%2==0};case We.PATTERN001:return function(a,c){return a%2==0};case We.PATTERN010:return function(a,c){return c%3==0};case We.PATTERN011:return function(a,c){return(a+c)%3==0};case We.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case We.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case We.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case We.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+r}},o.getErrorCorrectPolynomial=function(r){let a=en([1],0);for(let c=0;c<r;c+=1)a=a.multiply(en([1,Ge.gexp(c)],0));return a},o.getLengthInBits=function(r,a){if(1<=a&&a<10)switch(r){case xe.MODE_NUMBER:return 10;case xe.MODE_ALPHA_NUM:return 9;case xe.MODE_8BIT_BYTE:return 8;case xe.MODE_KANJI:return 8;default:throw"mode:"+r}else if(a<27)switch(r){case xe.MODE_NUMBER:return 12;case xe.MODE_ALPHA_NUM:return 11;case xe.MODE_8BIT_BYTE:return 16;case xe.MODE_KANJI:return 10;default:throw"mode:"+r}else if(a<41)switch(r){case xe.MODE_NUMBER:return 14;case xe.MODE_ALPHA_NUM:return 13;case xe.MODE_8BIT_BYTE:return 16;case xe.MODE_KANJI:return 12;default:throw"mode:"+r}else throw"type:"+a},o.getLostPoint=function(r){let a=r.getModuleCount(),c=0;for(let l=0;l<a;l+=1)for(let h=0;h<a;h+=1){let b=0,x=r.isDark(l,h);for(let m=-1;m<=1;m+=1)if(!(l+m<0||a<=l+m))for(let $=-1;$<=1;$+=1)h+$<0||a<=h+$||m==0&&$==0||x==r.isDark(l+m,h+$)&&(b+=1);b>5&&(c+=3+b-5)}for(let l=0;l<a-1;l+=1)for(let h=0;h<a-1;h+=1){let b=0;r.isDark(l,h)&&(b+=1),r.isDark(l+1,h)&&(b+=1),r.isDark(l,h+1)&&(b+=1),r.isDark(l+1,h+1)&&(b+=1),(b==0||b==4)&&(c+=3)}for(let l=0;l<a;l+=1)for(let h=0;h<a-6;h+=1)r.isDark(l,h)&&!r.isDark(l,h+1)&&r.isDark(l,h+2)&&r.isDark(l,h+3)&&r.isDark(l,h+4)&&!r.isDark(l,h+5)&&r.isDark(l,h+6)&&(c+=40);for(let l=0;l<a;l+=1)for(let h=0;h<a-6;h+=1)r.isDark(h,l)&&!r.isDark(h+1,l)&&r.isDark(h+2,l)&&r.isDark(h+3,l)&&r.isDark(h+4,l)&&!r.isDark(h+5,l)&&r.isDark(h+6,l)&&(c+=40);let d=0;for(let l=0;l<a;l+=1)for(let h=0;h<a;h+=1)r.isDark(h,l)&&(d+=1);let u=Math.abs(100*d/a/a-50)/5;return c+=u*10,c},o})(),Ge=(function(){let s=new Array(256),t=new Array(256);for(let n=0;n<8;n+=1)s[n]=1<<n;for(let n=8;n<256;n+=1)s[n]=s[n-4]^s[n-5]^s[n-6]^s[n-8];for(let n=0;n<255;n+=1)t[s[n]]=n;let e={};return e.glog=function(n){if(n<1)throw"glog("+n+")";return t[n]},e.gexp=function(n){for(;n<0;)n+=255;for(;n>=256;)n-=255;return s[n]},e})(),en=function(s,t){if(typeof s.length>"u")throw s.length+"/"+t;let e=(function(){let o=0;for(;o<s.length&&s[o]==0;)o+=1;let i=new Array(s.length-o+t);for(let r=0;r<s.length-o;r+=1)i[r]=s[r+o];return i})(),n={};return n.getAt=function(o){return e[o]},n.getLength=function(){return e.length},n.multiply=function(o){let i=new Array(n.getLength()+o.getLength()-1);for(let r=0;r<n.getLength();r+=1)for(let a=0;a<o.getLength();a+=1)i[r+a]^=Ge.gexp(Ge.glog(n.getAt(r))+Ge.glog(o.getAt(a)));return en(i,0)},n.mod=function(o){if(n.getLength()-o.getLength()<0)return n;let i=Ge.glog(n.getAt(0))-Ge.glog(o.getAt(0)),r=new Array(n.getLength());for(let a=0;a<n.getLength();a+=1)r[a]=n.getAt(a);for(let a=0;a<o.getLength();a+=1)r[a]^=Ge.gexp(Ge.glog(o.getAt(a))+i);return en(r,0).mod(o)},n},Gr=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(o,i){let r={};return r.totalCount=o,r.dataCount=i,r},e={},n=function(o,i){switch(i){case Qt.L:return s[(o-1)*4+0];case Qt.M:return s[(o-1)*4+1];case Qt.Q:return s[(o-1)*4+2];case Qt.H:return s[(o-1)*4+3];default:return}};return e.getRSBlocks=function(o,i){let r=n(o,i);if(typeof r>"u")throw"bad rs block @ typeNumber:"+o+"/errorCorrectionLevel:"+i;let a=r.length/3,c=[];for(let d=0;d<a;d+=1){let u=r[d*3+0],l=r[d*3+1],h=r[d*3+2];for(let b=0;b<u;b+=1)c.push(t(l,h))}return c},e})(),qr=function(){let s=[],t=0,e={};return e.getBuffer=function(){return s},e.getAt=function(n){let o=Math.floor(n/8);return(s[o]>>>7-n%8&1)==1},e.put=function(n,o){for(let i=0;i<o;i+=1)e.putBit((n>>>o-i-1&1)==1)},e.getLengthInBits=function(){return t},e.putBit=function(n){let o=Math.floor(t/8);s.length<=o&&s.push(0),n&&(s[o]|=128>>>t%8),t+=1},e},Cd=function(s){let t=xe.MODE_NUMBER,e=s,n={};n.getMode=function(){return t},n.getLength=function(r){return e.length},n.write=function(r){let a=e,c=0;for(;c+2<a.length;)r.put(o(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?r.put(o(a.substring(c,c+1)),4):a.length-c==2&&r.put(o(a.substring(c,c+2)),7))};let o=function(r){let a=0;for(let c=0;c<r.length;c+=1)a=a*10+i(r.charAt(c));return a},i=function(r){if("0"<=r&&r<="9")return r.charCodeAt(0)-48;throw"illegal char :"+r};return n},Pd=function(s){let t=xe.MODE_ALPHA_NUM,e=s,n={};n.getMode=function(){return t},n.getLength=function(i){return e.length},n.write=function(i){let r=e,a=0;for(;a+1<r.length;)i.put(o(r.charAt(a))*45+o(r.charAt(a+1)),11),a+=2;a<r.length&&i.put(o(r.charAt(a)),6)};let o=function(i){if("0"<=i&&i<="9")return i.charCodeAt(0)-48;if("A"<=i&&i<="Z")return i.charCodeAt(0)-65+10;switch(i){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+i}};return n},Md=function(s){let t=xe.MODE_8BIT_BYTE,e=s,n=Pt.stringToBytes(s),o={};return o.getMode=function(){return t},o.getLength=function(i){return n.length},o.write=function(i){for(let r=0;r<n.length;r+=1)i.put(n[r],8)},o},Ad=function(s){let t=xe.MODE_KANJI,e=s,n=Pt.stringToBytes;(function(r,a){let c=n(r);if(c.length!=2||(c[0]<<8|c[1])!=a)throw"sjis not supported."})("友",38726);let o=n(s),i={};return i.getMode=function(){return t},i.getLength=function(r){return~~(o.length/2)},i.write=function(r){let a=o,c=0;for(;c+1<a.length;){let d=(255&a[c])<<8|255&a[c+1];if(33088<=d&&d<=40956)d-=33088;else if(57408<=d&&d<=60351)d-=49472;else throw"illegal char at "+(c+1)+"/"+d;d=(d>>>8&255)*192+(d&255),r.put(d,13),c+=2}if(c<a.length)throw"illegal char at "+(c+1)},i},Yr=function(){let s=[],t={};return t.writeByte=function(e){s.push(e&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,o){n=n||0,o=o||e.length;for(let i=0;i<o;i+=1)t.writeByte(e[i+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return s},t.toString=function(){let e="";e+="[";for(let n=0;n<s.length;n+=1)n>0&&(e+=","),e+=s[n];return e+="]",e},t},Sd=function(){let s=0,t=0,e=0,n="",o={},i=function(a){n+=String.fromCharCode(r(a&63))},r=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return o.writeByte=function(a){for(s=s<<8|a&255,t+=8,e+=1;t>=6;)i(s>>>t-6),t-=6},o.flush=function(){if(t>0&&(i(s<<6-t),s=0,t=0),e%3!=0){let a=3-e%3;for(let c=0;c<a;c+=1)n+="="}},o.toString=function(){return n},o},Ld=function(s){let t=s,e=0,n=0,o=0,i={};i.read=function(){for(;o<8;){if(e>=t.length){if(o==0)return-1;throw"unexpected end of file./"+o}let c=t.charAt(e);if(e+=1,c=="=")return o=0,-1;if(c.match(/^\s$/))continue;n=n<<6|r(c.charCodeAt(0)),o+=6}let a=n>>>o-8&255;return o-=8,a};let r=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return i},Dd=function(s,t){let e=s,n=t,o=new Array(s*t),i={};i.setPixel=function(d,u,l){o[u*e+d]=l},i.write=function(d){d.writeString("GIF87a"),d.writeShort(e),d.writeShort(n),d.writeByte(128),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(255),d.writeByte(255),d.writeByte(255),d.writeString(","),d.writeShort(0),d.writeShort(0),d.writeShort(e),d.writeShort(n),d.writeByte(0);let u=2,l=a(u);d.writeByte(u);let h=0;for(;l.length-h>255;)d.writeByte(255),d.writeBytes(l,h,255),h+=255;d.writeByte(l.length-h),d.writeBytes(l,h,l.length-h),d.writeByte(0),d.writeString(";")};let r=function(d){let u=d,l=0,h=0,b={};return b.write=function(x,m){if(x>>>m)throw"length over";for(;l+m>=8;)u.writeByte(255&(x<<l|h)),m-=8-l,x>>>=8-l,h=0,l=0;h=x<<l|h,l=l+m},b.flush=function(){l>0&&u.writeByte(h)},b},a=function(d){let u=1<<d,l=(1<<d)+1,h=d+1,b=c();for(let g=0;g<u;g+=1)b.add(String.fromCharCode(g));b.add(String.fromCharCode(u)),b.add(String.fromCharCode(l));let x=Yr(),m=r(x);m.write(u,h);let $=0,S=String.fromCharCode(o[$]);for($+=1;$<o.length;){let g=String.fromCharCode(o[$]);$+=1,b.contains(S+g)?S=S+g:(m.write(b.indexOf(S),h),b.size()<4095&&(b.size()==1<<h&&(h+=1),b.add(S+g)),S=g)}return m.write(b.indexOf(S),h),m.write(l,h),m.flush(),x.toByteArray()},c=function(){let d={},u=0,l={};return l.add=function(h){if(l.contains(h))throw"dup key:"+h;d[h]=u,u+=1},l.size=function(){return u},l.indexOf=function(h){return d[h]},l.contains=function(h){return typeof d[h]<"u"},l};return i},Rd=function(s,t,e){let n=Dd(s,t);for(let a=0;a<t;a+=1)for(let c=0;c<s;c+=1)n.setPixel(c,a,e(c,a));let o=Yr();n.write(o);let i=Sd(),r=o.toByteArray();for(let a=0;a<r.length;a+=1)i.writeByte(r[a]);return i.flush(),"data:image/gif;base64,"+i},Xr=Pt,Eu=Pt.stringToBytes;function Jr(s){let t=Xr(0,"M");t.addData(s),t.make();let e=t.getModuleCount(),n="";for(let o=0;o<e;o++)for(let i=0;i<e;i++)t.isDark(o,i)&&(n+=`M${i} ${o}h1v1h-1z`);return{size:e,d:n}}var Id=1e4,tn=class extends Pe{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,n){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,n))}async newCode(){try{let e=await Wr();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof pt&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),Id)}}async poll(e){let n=this.secret;if(n)try{let o=await Vr(n,location.origin);if(!this.running||n!==this.secret)return;if(this.problem=null,o.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:o.auth}));return}if(o.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return E;let{size:e,d:n}=Jr(Kr(location.origin,this.code));return f`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${re`<path d=${n} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return f`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?Fr(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${ri}?${ai}</span> and type the code.
          </li>
          <li>You’ll need to be a Home Assistant admin. The screen signs in as you.</li>
        </ol>
      </div>
      <div class="qr">${this.qr()}</div>
      <div class="foot">
        ${this.problem?f`<span class="problem" role="alert">${this.problem}</span>`:f`<span>${this.code?`A new code appears in ${e} minute${e===1?"":"s"}.`:"Getting a code…"}</span>`}
        <button type="button" class="link" @click=${()=>this.dispatchEvent(new CustomEvent("password"))}>
          Sign in with a password instead
        </button>
      </div>
    </div>`}};tn.styles=Je`
    :host {
      position: fixed;
      inset: 0;
      z-index: 40;
      display: grid;
      place-items: center;
      padding: 24px;
      background: #f4f3ef;
      color: #1c1e22;
      font-family: Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    :host([hidden]) {
      display: none;
    }
    .card {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 48px;
      align-items: center;
      width: min(920px, 100%);
      padding: 44px 48px;
      border-radius: 24px;
      background: #fff;
      border: 1px solid #e3e1db;
      box-shadow: 0 1px 2px rgba(28, 30, 34, 0.06), 0 8px 24px rgba(28, 30, 34, 0.06);
    }
    h1 {
      margin: 0 0 8px;
      font-size: 30px;
      line-height: 38px;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
    .lead {
      margin: 0 0 28px;
      font-size: 18px;
      line-height: 27px;
      color: #3d434b;
    }
    .code {
      margin: 0;
      font-size: 64px;
      line-height: 72px;
      font-weight: 700;
      letter-spacing: 0.06em;
      font-variant-numeric: tabular-nums;
      font-feature-settings: "zero" 1;
    }
    .code.wait {
      color: #b8b5ad;
    }
    .steps {
      margin: 24px 0 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 10px;
      font-size: 16px;
      line-height: 24px;
      color: #3d434b;
    }
    .steps b {
      color: #1c1e22;
    }
    .addr {
      font-weight: 600;
      color: #1c1e22;
      overflow-wrap: anywhere;
    }
    .qr {
      width: 280px;
      height: 280px;
      padding: 24px;
      border-radius: 16px;
      border: 1px solid #e3e1db;
      background: #fff;
    }
    .qr svg {
      display: block;
      width: 100%;
      height: 100%;
    }
    .foot {
      grid-column: 1 / -1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding-top: 20px;
      border-top: 1px solid #efede8;
      font-size: 14px;
      line-height: 20px;
      color: #5a6069;
    }
    .problem {
      color: #b42318;
      font-weight: 600;
    }
    button.link {
      border: 0;
      padding: 8px 0;
      background: none;
      font: inherit;
      color: #2d5fc4;
      cursor: pointer;
    }
    @media (max-width: 760px) {
      .card {
        grid-template-columns: 1fr;
        gap: 28px;
        padding: 28px 24px;
      }
      .code {
        font-size: 44px;
        line-height: 52px;
      }
      .qr {
        width: 220px;
        height: 220px;
      }
    }
  `,tn.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",tn);var li="hassTokens";function Zr(){try{let s=localStorage.getItem(li);return s?JSON.parse(s):null}catch{return null}}function ci(s){try{s?localStorage.setItem(li,JSON.stringify(s)):localStorage.removeItem(li)}catch{}}function Od(s){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=s)}function Bd(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(t=>{let e=n=>{s.stop(),s.hidden=!0,t(n)};s.addEventListener("paired",n=>e(n.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function Nd(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let t=location.search.includes("auth_callback");if(!t&&!Zr()){let e=await Bd();e&&ci(e)}try{let e=await Pi({hassUrl:location.origin,loadTokens:async()=>Zr(),saveTokens:ci});t&&history.replaceState(null,"",location.pathname+Is(location.search));let n=await Mi({auth:e});s.backend=new dn(n),Ir(n),Rr(n,Dr(import.meta.url),{reload:jd,idleFor:()=>Date.now()-na}),n.addEventListener("reconnect-error",(o,i)=>{i===2&&ea()})}catch(e){if(e===2){ea();return}Od(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}var na=Date.now();for(let s of["pointerdown","keydown","wheel"])document.addEventListener(s,()=>na=Date.now(),{capture:!0,passive:!0});var Qr="mydashlight-reloaded-for";function jd(s){try{if(sessionStorage.getItem(Qr)===s)return;sessionStorage.setItem(Qr,s)}catch{}location.reload()}function ea(){ci(null),location.replace(location.pathname+Is(location.search))}var sa=lt(location.search),ta=document.querySelector("mydashlight-keyboard");ta&&sa.keyboard!==!1&&Ur(ta);sa.cursor!=="show"&&Lr();Nd();
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
lit-html/directive.js:
lit-html/directives/repeat.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
