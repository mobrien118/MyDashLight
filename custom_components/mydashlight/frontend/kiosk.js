var ga=Object.defineProperty;var Xn=(s,t)=>()=>(s&&(t=s(s=0)),t);var ma=(s,t)=>{for(var e in t)ga(s,e,{get:t[e],enumerable:!0})};function Nn(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function Hs(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function Kl(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function sr(s){return Kl(s,t=>t.unicode)}function Gl(s){function t(e,n,o){let i=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(o)for(let[r,[a,c]]of Object.entries(o))i.createIndex(r,a,{multiEntry:c});return i}t(Ct),t(dt,jl,{[or]:[Nl,!0],[ar]:[[zl,Hl]],[lr]:[Ul,!0]}),t(Ks,void 0,{[rr]:[""]})}function cr(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function Vl(s){let t=await new Promise((e,n)=>{let o=indexedDB.open(s,Ol);Fs[s]=o,o.onupgradeneeded=i=>{i.oldVersion<Bl&&Gl(o.result)},cr(e,n,o)});return t.onclose=()=>Vs(s),t}function ql(s){return zn[s]||(zn[s]=Vl(s)),zn[s]}function We(s,t,e,n){return new Promise((o,i)=>{let r=s.transaction(t,e,{durability:"relaxed"}),a=typeof t=="string"?r.objectStore(t):t.map(d=>r.objectStore(d)),c;n(a,r,d=>{c=d}),r.oncomplete=()=>o(c),r.onerror=()=>i(r.error)})}function Vs(s){let t=Fs[s],e=t&&t.result;if(e){e.close();let n=Un[s];if(n)for(let o of n)o()}delete Fs[s],delete zn[s],delete Un[s]}function Yl(s){return new Promise((t,e)=>{Vs(s);let n=indexedDB.deleteDatabase(s);cr(t,e,n)})}function Xl(s,t){let e=Un[s];e||(e=Un[s]=[]),e.push(t)}function _t(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||Jl.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function dr(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=Zl)}function Ql(s){return s.map(({annotation:e,emoticon:n,group:o,order:i,shortcodes:r,skins:a,tags:c,emoji:d,version:h})=>{let l=[...new Set(dr([...(r||[]).map(_t).flat(),...(c||[]).map(_t).flat(),..._t(e),n]))].sort(),u={annotation:e,group:o,order:i,tags:c,tokens:l,unicode:d,version:h};if(n&&(u.emoticon=n),r&&(u.shortcodes=r),a){u.skinTones=[],u.skinUnicodes=[],u.skinVersions=[];for(let{tone:b,emoji:y,version:m}of a)u.skinTones.push(b),u.skinUnicodes.push(y),u.skinVersions.push(m)}return u})}function hr(s,t,e,n){s[t](e).onsuccess=o=>n&&n(o.target.result)}function ct(s,t,e){hr(s,"get",t,e)}function ur(s,t,e){hr(s,"getAll",t,e)}function qs(s){s.commit&&s.commit()}function ec(s,t){let e=s[0];for(let n=1;n<s.length;n++){let o=s[n];t(e)>t(o)&&(e=o)}return e}function pr(s,t){let e=ec(s,o=>o.length),n=[];for(let o of e)s.some(i=>i.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function tc(s){return!await Ys(s,Ct,Hn)}async function nc(s,t,e){let[n,o]=await Promise.all([Us,Hn].map(i=>Ys(s,Ct,i)));return n===e&&o===t}async function sc(s,t){return We(s,dt,St,(n,o,i)=>{let r,a=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let d=c.target.result;for(let h of d)if(r=h.unicode,t(h))return i(h);if(d.length<50)return i();a()}};a()})}async function fr(s,t,e,n){try{let o=Ql(t);await We(s,[dt,Ct],Gs,([i,r],a)=>{let c,d,h=0;function l(){++h===2&&u()}function u(){if(!(c===n&&d===e)){i.clear();for(let b of o)i.put(b);r.put(n,Us),r.put(e,Hn),qs(a)}}ct(r,Us,b=>{c=b,l()}),ct(r,Hn,b=>{d=b,l()})})}finally{}}async function ic(s,t){return We(s,dt,St,(e,n,o)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);ur(e.index(ar),i,o)})}async function gr(s,t){let e=dr(_t(t));return e.length?We(s,dt,St,(n,o,i)=>{let r=[],a=()=>{r.length===e.length&&c()},c=()=>{let d=pr(r,h=>h.unicode);i(d.sort((h,l)=>h.order<l.order?-1:1))};for(let d=0;d<e.length;d++){let h=e[d],l=d===e.length-1?IDBKeyRange.bound(h,h+"￿",!1,!0):IDBKeyRange.only(h);ur(n.index(or),l,u=>{r.push(u),a()})}}):[]}async function oc(s,t){let e=await gr(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(i=>i.toLowerCase()).includes(t.toLowerCase()))[0]||null:await sc(s,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function rc(s,t){return We(s,dt,St,(e,n,o)=>ct(e,t,i=>{if(i)return o(i);ct(e.index(lr),t,r=>o(r||null))}))}function Ys(s,t,e){return We(s,t,St,(n,o,i)=>ct(n,e,i))}function ac(s,t,e,n){return We(s,t,Gs,(o,i)=>{o.put(n,e),qs(i)})}function lc(s,t){return We(s,Ks,Gs,(e,n)=>ct(e,t,o=>{e.put((o||0)+1,t),qs(n)}))}function cc(s,t,e){return e===0?[]:We(s,[Ks,dt],St,([n,o],i,r)=>{let a=[];n.index(rr).openCursor(void 0,"prev").onsuccess=c=>{let d=c.target.result;if(!d)return r(a);function h(b){if(a.push(b),a.length===e)return r(a);d.continue()}let l=d.primaryKey,u=t.byName(l);if(u)return h(u);ct(o,l,b=>{if(b)return h(b);d.continue()})}})}function dc(s,t){let e=new Map;for(let o of s){let i=t(o);for(let r of i){let a=e;for(let d=0;d<r.length;d++){let h=r.charAt(d),l=a.get(h);l||(l=new Map,a.set(h,l)),a=l}let c=a.get(jn);c||(c=[],a.set(jn,c)),c.push(o)}}return(o,i)=>{let r=e;for(let d=0;d<o.length;d++){let h=o.charAt(d),l=r.get(h);if(l)r=l;else return[]}if(i)return r.get(jn)||[];let a=[],c=[r];for(;c.length;){let h=[...c.shift().entries()].sort((l,u)=>l[0]<u[0]?-1:1);for(let[l,u]of h)l===jn?a.push(...u):c.push(u)}return a}}function uc(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||hc.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function ir(s){uc(s);let t=(u,b)=>u.name.toLowerCase()<b.name.toLowerCase()?-1:1,e=s.sort(t),o=dc(s,u=>{let b=new Set;if(u.shortcodes)for(let y of u.shortcodes)for(let m of _t(y))b.add(m);return b}),i=u=>o(u,!0),r=u=>o(u,!1),a=u=>{let b=_t(u),y=b.map((m,w)=>(w<b.length-1?i:r)(m));return pr(y,m=>m.name).sort(t)},c=new Map,d=new Map;for(let u of s){d.set(u.name.toLowerCase(),u);for(let b of u.shortcodes||[])c.set(b.toLowerCase(),u)}return{all:e,search:a,byShortcode:u=>c.get(u.toLowerCase()),byName:u=>d.get(u.toLowerCase())}}function Zt(s){if(!s)return s;if(pc&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function mr(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function gc(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||fc.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function br(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function mc(s){let t=await fetch(s,{method:"HEAD"});br(t,s);let e=t.headers.get("etag");return mr(e),e}async function Ws(s){let t=await fetch(s);br(t,s);let e=t.headers.get("etag");mr(e);let n=await t.json();return gc(n),[e,n]}function bc(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function vc(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=s.charCodeAt(o);return e}async function vr(s){let t=JSON.stringify(s),e=vc(t),n=await crypto.subtle.digest("SHA-1",e),o=bc(n);return btoa(o)}async function yc(s,t){let e,n=await mc(t);if(!n){let o=await Ws(t);n=o[0],e=o[1],n||(n=await vr(e))}await nc(s,t,n)||(e||(e=(await Ws(t))[1]),await fr(s,e,t,n))}async function xc(s,t){let[e,n]=await Ws(t);e||(e=await vr(n)),await fr(s,n,t,e)}async function wc(s,t){try{await yc(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var Ol,Bl,dt,Ct,Ks,Nl,or,jl,rr,zl,Hl,ar,Us,Hn,nr,St,Gs,lr,Ul,Fl,Wl,Fs,zn,Un,Jl,Zl,jn,hc,pc,fc,Pt,Xs=Xn(()=>{Ol=1,Bl=1,dt="emoji",Ct="keyvalue",Ks="favorites",Nl="tokens",or="tokens",jl="unicode",rr="count",zl="group",Hl="order",ar="group-order",Us="eTag",Hn="url",nr="skinTone",St="readonly",Gs="readwrite",lr="skinUnicodes",Ul="skinUnicodes",Fl="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Wl="en";Fs={},zn={},Un={};Jl=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);Zl=2;jn="";hc=["name","url"];pc=typeof wrappedJSObject<"u";fc=["annotation","emoji","group","order","version"];Pt=class{constructor({dataSource:t=Fl,locale:e=Wl,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=ir(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await ql(this._dbName);Xl(this._dbName,this._clear);let e=this.dataSource;await tc(t)?await xc(t,e):this._lazyUpdate=wc(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return Hs(t),await this.ready(),sr(await ic(this._db,t)).map(Zt)}async getEmojiBySearchQuery(t){Nn(t),await this.ready();let e=this._custom.search(t),n=sr(await gr(this._db,t)).map(Zt);return[...e,...n]}async getEmojiByShortcode(t){Nn(t),await this.ready();let e=this._custom.byShortcode(t);return e||Zt(await oc(this._db,t))}async getEmojiByUnicodeOrName(t){Nn(t),await this.ready();let e=this._custom.byName(t);return e||Zt(await rc(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await Ys(this._db,Ct,nr)||0}async setPreferredSkinTone(t){return Hs(t),await this.ready(),ac(this._db,Ct,nr,t)}async incrementFavoriteEmojiCount(t){return Nn(t),await this.ready(),lc(this._db,t)}async getTopFavoriteEmoji(t){return Hs(t),await this.ready(),(await cc(this._db,this._custom,t)).map(Zt)}set customEmoji(t){this._custom=ir(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await Vs(this._dbName)}async delete(){await this._shutdown(),await Yl(this._dbName)}}});function xr(s){return s.unicode.includes("‍")}function Mc(s){let t=wr(s,"#000"),e=wr(s,"#fff");return t&&e&&Sc(t,e)}function Ac(){let s=Object.entries($c);try{for(let[t,e]of s)if(Mc(t))return e}catch{}finally{}return s[0][1]}function Bc(s,t){if(t===0)return s;let e=s.indexOf(Rc);return e!==-1?s.substring(0,e)+String.fromCodePoint(Ic+t-1)+s.substring(e):(s.endsWith(Lc)&&(s=s.substring(0,s.length-1)),s+Dc+String.fromCodePoint(Oc+t-1))}function Ne(s){s.preventDefault(),s.stopPropagation()}function ei(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function Mr(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Nc(s,t){let e=n=>{let o={};for(let i of n)typeof i.tone=="number"&&i.version<=t&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:n,skins:o,shortcodes:i,url:r,name:a,category:c,annotation:d})=>({unicode:n,name:a,shortcodes:i,url:r,category:c,annotation:d,id:n||a,skins:o&&e(o)}))}function zc(s,t,e){let n;jc?(n=new ResizeObserver(e),n.observe(s)):Wn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function kr(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function $r(s,t,e){let n=kr(t);if(!n){if(!ht){ht=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])ht.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(ht),ht.firstChild.nodeValue=s,kr(ht)}finally{ht.remove()}}return n}function Uc(s,t,e){let n=!0;for(let o of s){let i=e(o);if(!i)continue;typeof ti>"u"&&(ti=$r(Hc,t,t));let a=$r(o.unicode,i,t)/1.8<ti;oi.set(o.unicode,a),a||(n=!1)}return n}function Fc(s){return Mr(s,t=>t)}function Wc(s){s&&(s.scrollTop=0)}function Qt(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function Tr(s){return""+s}function Kc(s){let t=document.createElement("template");return t.innerHTML=s,t}function Xc(s,t){Yc?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function Jc(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function Zc(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=Jc(n,s):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&Xc(n,s)}function Qc(s,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:a,attributeValuePost:c}}=e,d=s[i];if(o!==d)if(e.currentExpression=d,r)if(d===null)n.removeAttribute(r);else{let h=a+Tr(d)+c;n.setAttribute(r,h)}else{let h;Array.isArray(d)?Zc(d,e):d instanceof Element?(h=d,n.replaceWith(h)):n.nodeValue=Tr(d),h&&(e.targetNode=h)}}}function ed(s){let t="",e=!1,n=!1,o=-1,i=new Map,r=[],a=0;for(let d=0,h=s.length;d<h;d++){let l=s[d];if(t+=l.slice(a),d===h-1)break;for(let g=0;g<l.length;g++)switch(l.charAt(g)){case"<":{l.charAt(g+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let u=r[r.length-1],b=Qt(i,u,()=>[]),y,m,w;if(n){let g=/(\S+)="?([^"=]*)$/.exec(l);y=g[1],m=g[2];let P=/^([^">]*)("?)/.exec(s[d+1]);w=P[1],t=t.slice(0,-1*g[0].length),a=P[0].length}else a=0;let M={attributeName:y,attributeValuePre:m,attributeValuePost:w,expressionIndex:d};b.push(M),!e&&!n&&(t+=" ")}return{template:Kc(t),elementsToBindings:i}}function Er(s,t,e){for(let n=0;n<s.length;n++){let o=s[n],i=o.attributeName?t:t.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function td(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))Er(n,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let a=t.get(++r);a&&Er(a,i,e)}while(i=o.nextNode())}return e}function nd(s){let{template:t,elementsToBindings:e}=Qt(Gc,s,()=>ed(s)),n=t.cloneNode(!0).content.firstElementChild,o=td(n,e);return function(r){return Qc(r,o),n}}function sd(s){let t=Qt(Vc,s,()=>new Map),e=qc;function n(i,...r){let a=Qt(t,i,()=>new Map);return Qt(a,e,()=>nd(i))(r)}function o(i,r,a){return i.map((c,d)=>{let h=e;e=a(c);try{return r(c,d)}finally{e=h}})}return{map:o,html:n}}function id(s,t,e,n,o,i,r,a,c){let{labelWithSkin:d,titleForEmoji:h,unicodeWithSkin:l}=e,{html:u,map:b}=sd(t);function y(g,P,N){return b(g,(K,se)=>u`<button role="${P?"option":"menuitem"}" aria-selected="${P?se===t.activeSearchItem:null}" aria-label="${d(K,t.currentSkinTone)}" title="${h(K)}" class="${"emoji"+(P&&se===t.activeSearchItem?" active":"")+(K.unicode?"":" custom-emoji")}" id="${`${N}-${K.id}`}" style="${K.unicode?null:`--custom-emoji-background: url(${JSON.stringify(K.url)})`}">${K.unicode?l(K,t.currentSkinTone):""}</button>`,K=>`${N}-${K.id}`)}let w=u`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${b(t.skinTones,(g,P)=>u`<div id="skintone-${P}" class="emoji ${P===t.activeSkinTone?"active":""}" aria-selected="${P===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[P]}" aria-label="${t.i18n.skinTones[P]}">${g}</div>`,g=>g)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${b(t.groups,g=>u`<button role="tab" class="nav-button" aria-controls="tab-${g.id}" aria-label="${t.i18n.categories[g.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===g.id}" title="${t.i18n.categories[g.name]}" data-group-id="${g.id}"><div class="nav-emoji emoji">${g.emoji}</div></button>`,g=>g.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${b(t.currentEmojisWithCategories,(g,P)=>u`<div><div id="menu-label-${P}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:g.category?g.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${P!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(g.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${P}" id="${t.searchMode?"search-results":null}">${y(g.emojis,t.searchMode,"emo")}</div></div>`,g=>g.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${y(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,M=(g,P)=>{for(let N of s.querySelectorAll(`[${g}]`))P(N,N.getAttribute(g))};if(c){s.appendChild(w);for(let g of["click","focusout","input","keydown","keyup"])M(`data-on-${g}`,(P,N)=>{P.addEventListener(g,n[N])});M("data-ref",(g,P)=>{i[P]=g}),r.addEventListener("abort",()=>{s.removeChild(w)})}M("data-action",(g,P)=>{let N=a.get(P);N||a.set(P,N=new WeakSet),N.has(g)||(N.add(g),o[P](g))})}function od(s){let t=!1,e,n=new Map,o=new Set,i,r=()=>{if(t)return;let d=[...o];o.clear();try{for(let h of d)h()}finally{i=!1,o.size&&(i=!0,Kn(r))}},a=new Proxy({},{get(d,h){if(e){let l=n.get(h);l||(l=new Set,n.set(h,l)),l.add(e)}return d[h]},set(d,h,l){if(d[h]!==l){d[h]=l;let u=n.get(h);if(u){for(let b of u)o.add(b);i||(i=!0,Kn(r))}}return!0}}),c=d=>{let h=()=>{let l=e;e=h;try{return d()}finally{e=l}};return h()};return s.addEventListener("abort",()=>{t=!0}),{state:a,createEffect:c}}function ni(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function rd(s,t,e){{let n=s.closest(".tabpanel"),o=_r.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),_r.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function ad(s,t){let e={},n=new AbortController,o=n.signal,{state:i,createEffect:r}=od(o),a=new Map;Fn(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),Fn(i,t),Fn(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:_c,isRtl:!1,currentGroupIndex:0,groups:Js,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let c=p=>{s.getElementById(p).focus()},d=p=>s.getElementById(`emo-${p.id}`),h=(p,k)=>{e.rootElement.dispatchEvent(new CustomEvent(p,{detail:k,bubbles:!0,composed:!0}))},l=(p,k)=>p.id===k.id,u=(p,k)=>{let{category:S,emojis:v}=p,{category:I,emojis:R}=k;return S!==I?!1:ni(v,R,l)},b=p=>{ni(i.currentEmojis,p,l)||(i.currentEmojis=p)},y=p=>{i.searchMode!==p&&(i.searchMode=p)},m=p=>{ni(i.currentEmojisWithCategories,p,u)||(i.currentEmojisWithCategories=p)},w=(p,k)=>k&&p.skins&&p.skins[k]||p.unicode,P={labelWithSkin:(p,k)=>Fc([p.name||w(p,k),p.annotation,...p.shortcodes||si].filter(Boolean)).join(", "),titleForEmoji:p=>p.annotation||(p.shortcodes||si).join(", "),unicodeWithSkin:w},N={onClickSkinToneButton:Pe,onEmojiClick:Ce,onNavClick:Y,onNavKeydown:pe,onSearchKeydown:z,onSkinToneOptionsClick:ie,onSkinToneOptionsFocusOut:Xe,onSkinToneOptionsKeydown:$e,onSkinToneOptionsKeyup:Ye,onSearchInput:Te},K={calculateEmojiGridStyle:E,updateOnIntersection:x},se=!0;r(()=>{id(s,i,P,N,K,e,o,a,se),se=!1}),i.emojiVersion||Qs().then(p=>{p||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function p(){let k=!1,S=setTimeout(()=>{k=!0,i.message=i.i18n.loadingMessage},Tc);try{await i.database.ready(),i.databaseLoaded=!0}catch(v){console.error(v),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(S),k&&(k=!1,i.message="")}}i.database&&p()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${yr};`}),r(()=>{i.customEmoji&&i.database&&T()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==ii&&(i.groups=ii):i.groups!==Js&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=Js)}),r(()=>{async function p(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}p()}),r(()=>{i.skinTones=Array(yr).fill().map((p,k)=>Bc(i.skinToneEmoji,k))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function p(){let{database:k}=i,S=(await Promise.all(Cc.map(v=>k.getEmojiByUnicodeOrName(v)))).filter(Boolean);i.defaultFavoriteEmojis=S}i.databaseLoaded&&p()});function T(){let{customEmoji:p,database:k}=i,S=p||si;k.customEmoji!==S&&(k.customEmoji=S)}r(()=>{async function p(){T();let{database:k,defaultFavoriteEmojis:S,numColumns:v}=i,I=await k.getTopFavoriteEmoji(v),R=await W(Mr([...I,...S],L=>L.unicode||L.name).slice(0,v));i.currentFavorites=R}i.databaseLoaded&&i.defaultFavoriteEmojis&&p()});function E(p){zc(p,o,()=>{{let k=getComputedStyle(e.rootElement),S=parseInt(k.getPropertyValue("--num-columns"),10),v=k.getPropertyValue("direction")==="rtl";i.numColumns=S,i.isRtl=v}})}function x(p){rd(p,o,k=>{for(let{target:S,isIntersecting:v}of k)S.classList.toggle("onscreen",v)})}r(()=>{async function p(){let{searchText:k,currentGroup:S,databaseLoaded:v,customEmoji:I}=i;if(!v)i.currentEmojis=[],i.searchMode=!1;else if(k.length>=kc){let R=await Z(k);i.searchText===k&&(b(R),y(!0))}else{let{id:R}=S;if(R!==-1||I&&I.length){let L=await q(R);i.currentGroup.id===R&&(b(L),y(!1))}}}p()});let _=()=>{Wn(()=>Wc(e.tabpanelElement))};r(()=>{let{currentEmojis:p,emojiVersion:k}=i,S=p.filter(v=>v.unicode).filter(v=>xr(v)&&!oi.has(v.unicode));if(!k&&S.length)b(p),Wn(()=>C(S));else{let v=k?p:p.filter(D);b(v),_()}});function C(p){Uc(p,e.baselineEmoji,d)?_():i.currentEmojis=[...i.currentEmojis]}function D(p){return!p.unicode||!xr(p)||oi.get(p.unicode)}async function j(p){let k=i.emojiVersion||await Qs();return p.filter(({version:S})=>!S||S<=k)}async function W(p){return Nc(p,i.emojiVersion||await Qs())}async function q(p){let k=p===-1?i.customEmoji:await i.database.getEmojiByGroup(p);return W(await j(k))}async function Z(p){return W(await j(await i.database.getEmojiBySearchQuery(p)))}r(()=>{}),r(()=>{function p(){let{searchMode:S,currentEmojis:v}=i;if(S)return[{category:"",emojis:v}];let I=new Map;for(let R of v){let L=R.category||"",X=I.get(L);X||(X=[],I.set(L,X)),X.push(R)}return[...I.entries()].map(([R,L])=>({category:R,emojis:L})).sort((R,L)=>i.customCategorySorting(R.category,L.category))}let k=p();m(k)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:p}=i;Pr(()=>{i.searchText=(p||"").trim(),i.activeSearchItem=-1})});function z(p){if(!i.searchMode||!i.currentEmojis.length)return;let k=S=>{Ne(p),i.activeSearchItem=ei(S,i.activeSearchItem,i.currentEmojis)};switch(p.key){case"ArrowDown":return k(!1);case"ArrowUp":return k(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return Ne(p),De(i.currentEmojis[i.activeSearchItem].id)}}function Y(p){let{target:k}=p,S=k.closest(".nav-button");if(!S)return;let v=parseInt(S.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(I=>I.id===v)}function pe(p){let{target:k,key:S}=p,v=I=>{I&&(Ne(p),I.focus())};switch(S){case"ArrowLeft":return v(k.previousElementSibling);case"ArrowRight":return v(k.nextElementSibling);case"Home":return v(k.parentElement.firstElementChild);case"End":return v(k.parentElement.lastElementChild)}}async function Me(p){let k=await i.database.getEmojiByUnicodeOrName(p),S=[...i.currentEmojis,...i.currentFavorites].find(I=>I.id===p),v=S.unicode&&w(S,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(p),{emoji:k,skinTone:i.currentSkinTone,...v&&{unicode:v},...S.name&&{name:S.name}}}async function De(p){let k=Me(p);h("emoji-click-sync",k),h("emoji-click",await k)}function Ce(p){let{target:k}=p;if(!k.classList.contains("emoji"))return;Ne(p);let S=k.id.substring(4);De(S)}function Q(p){i.currentSkinTone=p,i.skinTonePickerExpanded=!1,c("skintone-button"),h("skin-tone-change",{skinTone:p}),i.database.setPreferredSkinTone(p)}function ie(p){let{target:{id:k}}=p,S=k&&k.match(/^skintone-(\d)/);if(!S)return;Ne(p);let v=parseInt(S[1],10);Q(v)}function Pe(p){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(Ne(p),Wn(()=>c("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function $e(p){if(!i.skinTonePickerExpanded)return;let k=async S=>{Ne(p),i.activeSkinTone=S};switch(p.key){case"ArrowUp":return k(ei(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return k(ei(!1,i.activeSkinTone,i.skinTones));case"Home":return k(0);case"End":return k(i.skinTones.length-1);case"Enter":return Ne(p),Q(i.activeSkinTone);case"Escape":return Ne(p),i.skinTonePickerExpanded=!1,c("skintone-button")}}function Ye(p){if(i.skinTonePickerExpanded)switch(p.key){case" ":return Ne(p),Q(i.activeSkinTone)}}async function Xe(p){let{relatedTarget:k}=p;(!k||k.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function Te(p){i.rawSearchText=p.target.value}return{$set(p){Fn(i,p)},$destroy(){n.abort()}}}function Cr(s){s instanceof ut||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var ii,Js,kc,yr,Pr,$c,Tc,Ec,_c,Cc,Sr,Pc,wr,Sc,Zs,Qs,oi,Lc,Dc,Rc,Ic,Oc,Wn,jc,Hc,ti,ht,Gc,Vc,qc,Yc,Kn,_r,si,Fn,ld,cd,dd,hd,Ar,ud,ut,Lr,Dr=Xn(()=>{Xs();ii=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),Js=ii.slice(1),kc=2,yr=6,Pr=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;$c={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},Tc=1e3,Ec="🖐️",_c=8,Cc=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],Sr='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',Pc=(s,t)=>s<t?-1:s>t?1:0,wr=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${Sr}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},Sc=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};Qs=()=>(Zs||(Zs=new Promise(s=>Pr(()=>s(Ac())))),Zs),oi=new Map,Lc="️",Dc="\uD83C",Rc="‍",Ic=127995,Oc=57339;Wn=requestAnimationFrame,jc=typeof ResizeObserver=="function";Hc="😀";Gc=new WeakMap,Vc=new WeakMap,qc=Symbol("un-keyed"),Yc="replaceChildren"in Element.prototype;Kn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);_r=new WeakMap;si=[],{assign:Fn}=Object;ld="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",cd="en",dd={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},hd=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',Ar=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],ud=`:host{--emoji-font-family:${Sr}}`,ut=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=hd+ud,this.shadowRoot.appendChild(e),this._ctx={locale:cd,dataSource:ld,skinToneEmoji:Ec,customCategorySorting:Pc,customEmoji:null,i18n:dd,emojiVersion:null,...t};for(let n of Ar)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){Cr(this),this._cmp||(this._cmp=ad(this.shadowRoot,this._ctx))}disconnectedCallback(){Cr(this),Kn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new Pt({locale:t,dataSource:e}))}_dbFlush(){Kn(()=>this._dbCreate())}},Lr={};for(let s of Ar)Lr[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(ut.prototype,Lr);customElements.get("emoji-picker")||customElements.define("emoji-picker",ut)});var Rr={};ma(Rr,{Database:()=>Pt,Picker:()=>ut});var Ir=Xn(()=>{Dr();Xs()});function yi(s){return{type:"auth",access_token:s}}function xi(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function wi(s){let t={type:"subscribe_events"};return s&&(t.event_type=s),t}function Jn(s){return{type:"unsubscribe_events",subscription:s}}function ki(){return{type:"ping"}}function $i(s,t){return{type:"result",success:!1,error:{code:s,message:t}}}function Ei(s){let t={},e=s.split("&");for(let n=0;n<e.length;n++){let o=e[n].split("="),i=decodeURIComponent(o[0]),r=o.length>1?decodeURIComponent(o[1]):void 0;t[i]=r}return t}var _i=(s,t,e,n)=>{let[o,i,r]=s.split(".",3);return Number(o)>t||Number(o)===t&&(n===void 0?Number(i)>=e:Number(i)>e)||n!==void 0&&Number(o)===t&&Number(i)===e&&Number(r)>=n};var dn=!1,va="auth_required",ya="auth_invalid",xa="auth_ok";function Pi(s){if(!s.auth)throw 4;let t=s.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,n=t.wsUrl;dn&&console.log("[Auth phase] Initializing",n);function o(i,r,a){dn&&console.log("[Auth Phase] New connection",n);let c=new WebSocket(n),d=!1,h=()=>{if(c.removeEventListener("close",h),d){a(2);return}if(i===0){a(1);return}let b=i===-1?-1:i-1;setTimeout(()=>o(b,r,a),1e3)},l=async b=>{try{t.expired&&await(e||t.refreshAccessToken()),c.send(JSON.stringify(yi(t.accessToken)))}catch(y){d=y===2,c.close()}},u=async b=>{let y=JSON.parse(b.data);switch(dn&&console.log("[Auth phase] Received",y),y.type){case ya:d=!0,c.close();break;case xa:c.removeEventListener("open",l),c.removeEventListener("message",u),c.removeEventListener("close",h),c.removeEventListener("error",h),c.haVersion=y.ha_version,_i(c.haVersion,2022,9)&&c.send(JSON.stringify(xi())),r(c);break;default:dn&&y.type!==va&&console.warn("[Auth phase] Unhandled message",y)}};c.addEventListener("open",l),c.addEventListener("message",u),c.addEventListener("close",h),c.addEventListener("error",h)}return new Promise((i,r)=>o(s.setupRetry,i,r))}var Dt=!1,hn=class{constructor(t,e){this._handleMessage=n=>{let o=JSON.parse(n.data);Array.isArray(o)||(o=[o]),o.forEach(i=>{Dt&&console.log("Received",i);let r=this.commands.get(i.id);switch(i.type){case"event":r?r.callback(i.event):(console.warn(`Received event for unknown subscription ${i.id}. Unsubscribing.`),this.sendMessagePromise(Jn(i.id)).catch(a=>{Dt&&console.warn(` Error unsubsribing from unknown subscription ${i.id}`,a)}));break;case"result":r&&(i.success?(r.resolve(i.result),"subscribe"in r||this.commands.delete(i.id)):(r.reject(i.error),this.commands.delete(i.id)));break;case"pong":r?(r.resolve(),this.commands.delete(i.id)):console.warn(`Received unknown pong response ${i.id}`);break;default:Dt&&console.warn("Unhandled message",i)}})},this._handleClose=async()=>{let n=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,n.forEach(r=>{"subscribe"in r||r.reject($i(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let o=Object.assign(Object.assign({},this.options),{setupRetry:0}),i=r=>{setTimeout(async()=>{if(!this.closeRequested){Dt&&console.log("Trying to reconnect");try{let a=await o.createSocket(o);this._setSocket(a)}catch(a){if(this._queuedMessages){let c=this._queuedMessages;this._queuedMessages=void 0;for(let d of c)d.reject&&d.reject(3)}a===2?this.fireEvent("reconnect-error",a):i(r+1)}}},Math.min(r,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),i(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(o=>{"subscribe"in o&&o.subscribe&&o.subscribe().then(i=>{o.unsubscribe=i,o.resolve()})}));let n=this._queuedMessages;if(n){this._queuedMessages=void 0;for(let o of n)o.resolve()}this.fireEvent("ready")}addEventListener(t,e){let n=this.eventListeners.get(t);n||(n=[],this.eventListeners.set(t,n)),n.push(e)}removeEventListener(t,e){let n=this.eventListeners.get(t);if(!n)return;let o=n.indexOf(e);o!==-1&&n.splice(o,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(n=>n(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,wi(e))}ping(){return this.sendMessagePromise(ki())}sendMessage(t,e){if(!this.connected)throw 3;if(Dt&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,n)=>{if(this._queuedMessages){this._queuedMessages.push({reject:n,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(i){n(i)}}});return}let o=this._genCmdId();this.commands.set(o,{resolve:e,reject:n}),this.sendMessage(t,o)})}async subscribeMessage(t,e,n){if(this._queuedMessages&&await new Promise((i,r)=>{this._queuedMessages.push({resolve:i,reject:r})}),n?.preCheck&&!await n.preCheck())throw new Error("Pre-check failed");let o;return await new Promise((i,r)=>{let a=this._genCmdId();o={resolve:i,reject:r,callback:t,subscribe:n?.resubscribe!==!1?()=>this.subscribeMessage(t,e,n):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(Jn(a)),this.commands.delete(a)}},this.commands.set(a,o);try{this.sendMessage(e,a)}catch{}}),()=>o.unsubscribe()}_genCmdId(){return++this.commandId}};var wa=()=>`${location.protocol}//${location.host}/`,ka=s=>s*1e3+Date.now();function $a(){let{protocol:s,host:t,pathname:e,search:n}=location;return`${s}//${t}${e}${n}`}function Ta(s,t,e,n){let o=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(o+=`&client_id=${encodeURIComponent(t)}`),n&&(o+=`&state=${encodeURIComponent(n)}`),o}function Ea(s,t,e,n){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=Ta(s,t,e,n)}async function Ai(s,t,e){let n=typeof location<"u"&&location;if(n&&n.protocol==="https:"){let a=document.createElement("a");if(a.href=s,a.protocol==="http:"&&a.hostname!=="localhost")throw 5}let o=new FormData;t!==null&&o.append("client_id",t),Object.keys(e).forEach(a=>{o.append(a,e[a])});let i=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:o});if(!i.ok)throw i.status===400||i.status===403?2:new Error("Unable to fetch tokens");let r=await i.json();return r.hassUrl=s,r.clientId=t,r.expires=ka(r.expires_in),r}function Mi(s,t,e){return Ai(s,t,{code:e,grant_type:"authorization_code"})}function _a(s){return btoa(JSON.stringify(s))}function Ca(s){return JSON.parse(atob(s))}var Zn=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await Ai(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function Li(s={}){let t,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let n=s.clientId!==void 0?s.clientId:wa(),o=s.limitHassInstance===!0;if(s.authCode&&e&&(t=await Mi(e,n,s.authCode),s.saveTokens&&s.saveTokens(t)),!t){let i=Ei(location.search.substr(1));if("auth_callback"in i){let r=Ca(i.state);if(o&&(r.hassUrl!==e||r.clientId!==n))throw 6;t=await Mi(r.hassUrl,r.clientId,i.code),s.saveTokens&&s.saveTokens(t)}}if(!t&&s.loadTokens&&(t=await s.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new Zn(t,s.saveTokens);if(e===void 0)throw 4;return Ea(e,n,s.redirectUrl||$a(),_a({hassUrl:e,clientId:n})),new Promise(()=>{})}async function Di(s){let t=Object.assign({setupRetry:0,createSocket:Pi},s),e=await t.createSocket(t);return new hn(e,t)}function U(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function je(s){let t=Math.floor(Math.round(s)/60)%24;return`${U(s)} ${t<12?"AM":"PM"}`}function Ri(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function mt(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function pn(s){return s?`${mt(Math.abs(s))} ${s<0?"early":"late"}`:"on time"}function Qn(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Pa=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Sa=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Ma=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function un(s){return new Date(`${s}T12:00:00Z`)}function Le(s){let t=un(s);return`${Pa.format(t)}, ${Ma.format(t)}`}function xe(s){return Sa.format(un(s))}function Re(s,t){return Math.round((un(t).getTime()-un(s).getTime())/864e5)}function Rt(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return Rt("UTC",t)}let n=o=>e.find(i=>i.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function es(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=Rt(e,s),i=Rt(e,t).date;return o.date===i?`at ${je(o.minutes)}`:`on ${xe(o.date)} at ${je(o.minutes)}`}var oe=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}};function Bi(s){switch(s.code){case"connection_lost":case"timeout":return"Can’t reach Home Assistant";case"not_running":return"MyDashLight isn’t running";default:return"Couldn’t get the latest plan"}}function Ni(s){let t=(s??"").trim(),e=o=>{let i=o.exec(t);return i?(t=t.slice(i[0].length).trim(),!0):!1};for(;e(/^Couldn['’]t read Google Calendar:?/i););return{short:e(/^Couldn['’]t reach Google Calendar:?/i)?"Can’t reach Google Calendar":"Couldn’t read Google Calendar",detail:t||null}}var Ze="mydashlight",Aa=7,ts=3e4,Ii=3e4;function ns(s){if(s instanceof oe)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new oe(String(t.code??"error"),t.message)}return typeof s=="number"?new oe("connection_lost","Lost the connection to Home Assistant."):new oe("error",String(s))}function Oi(s,t){return new Promise((e,n)=>{let o=setTimeout(()=>n(new oe("timeout","Home Assistant didn’t answer.")),t);s.then(i=>{clearTimeout(o),e(i)},i=>{clearTimeout(o),n(i)})})}var It=class{constructor(t,e,n,o){this.live=!1;this.unsub=null;this.opening=!1;this.gen=0;this.closed=!1;this.onReady=()=>this.open();this.onDisconnected=()=>this.dropped();this.conn=t,this.type=e,this.onMessage=n,this.onFailed=o,t.addEventListener?.("ready",this.onReady),t.addEventListener?.("disconnected",this.onDisconnected)}get isOpen(){return this.unsub!==null||this.opening}open(){if(this.closed||this.isOpen||this.conn.connected===!1)return;let t=++this.gen;this.opening=!0,this.conn.subscribeMessage(e=>{t===this.gen&&(this.live=!0,this.onMessage(e))},{type:this.type},{resubscribe:!1}).then(e=>{if(t!==this.gen){e().catch(()=>{});return}this.opening=!1,this.unsub=e},e=>{t===this.gen&&(this.opening=!1,this.live=!1,this.onFailed(e))})}dropped(){this.gen++,this.opening=!1,this.unsub=null,this.live=!1}close(){this.closed=!0,this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsub;this.dropped(),t&&t().catch(()=>{})}},fn=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.rides=null;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new oe("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.rides?.live??!1}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.rides=new It(this.conn,`${Ze}/rides/subscribe`,t=>{t.plan?this.emit(t.plan):this.fail(new oe("not_running","MyDashLight isn’t running right now."))},()=>{}),this.rides.open(),this.timer=setInterval(()=>{this.live||(this.refresh(),this.rides?.open())},ts),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected),this.rides?.close(),this.rides=null}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await Oi(this.conn.sendMessagePromise({type:"call_service",domain:Ze,service:"get_plan",service_data:{days:Aa},return_response:!0}),Ii);this.emit(t.response)}catch(t){this.fail(ns(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ze,service:t,service_data:e})}catch(n){throw ns(n)}this.live||await this.refresh()}setRide(t,e,n,o,i){return this.call("set_ride",i===void 0?{event:t,side:e,driver:n,scope:o}:{event:t,side:e,driver:n,scope:o,stay:i})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:Qn(e),scope:n})}setLeaveBy(t,e,n){return this.call("set_leave_by",e==null?{event:t,scope:n}:{event:t,time:Qn(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}setPeople(t,e,n,o,i){return this.call("set_people",{event:t,...e?{people:e}:{},...i!==void 0?{overnight:i}:{},scope:n,...o?{driver:o.driver,riders:o.riders,back_riders:o.backRiders}:{}})}watchChores(t){let e=!1,n=!1,o=async()=>{try{let a=await Oi(this.conn.sendMessagePromise({type:"call_service",domain:Ze,service:"get_chores",service_data:{},return_response:!0}),Ii);if(e)return;n=!0,t(a.response??null)}catch{!e&&!n&&t(null)}},i=new It(this.conn,`${Ze}/chores/subscribe`,a=>{e||(n=!0,t(a.chores))},()=>void o());i.open();let r=setInterval(()=>{i.live||i.open()},ts);return()=>{e=!0,clearInterval(r),i.close()}}watchLunch(t){let e=!1,n=!1,o=new It(this.conn,`${Ze}/lunch/subscribe`,r=>{e||(n=!0,t(r.lunch))},()=>{!e&&!n&&t(null)});o.open();let i=setInterval(()=>{o.live||o.open()},ts);return()=>{e=!0,clearInterval(i),o.close()}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n,o){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{},...e&&o?{skip:o}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ze,service:t,service_data:e})}catch(n){throw ns(n)}}};var gn=globalThis,mn=gn.ShadowRoot&&(gn.ShadyCSS===void 0||gn.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ss=Symbol(),ji=new WeakMap,Ot=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==ss)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(mn&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=ji.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&ji.set(e,t))}return t}toString(){return this.cssText}},zi=s=>new Ot(typeof s=="string"?s:s+"",void 0,ss),Qe=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,o,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new Ot(e,s,ss)},Hi=(s,t)=>{if(mn)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=gn.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}},is=mn?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return zi(e)})(s):s;var{is:La,defineProperty:Da,getOwnPropertyDescriptor:Ra,getOwnPropertyNames:Ia,getOwnPropertySymbols:Oa,getPrototypeOf:Ba}=Object,bn=globalThis,Ui=bn.trustedTypes,Na=Ui?Ui.emptyScript:"",ja=bn.reactiveElementPolyfillSupport,Bt=(s,t)=>s,os={toAttribute(s,t){switch(t){case Boolean:s=s?Na:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Wi=(s,t)=>!La(s,t),Fi={attribute:!0,type:String,converter:os,reflect:!1,useDefault:!1,hasChanged:Wi};Symbol.metadata??=Symbol("metadata"),bn.litPropertyMetadata??=new WeakMap;var ze=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Fi){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&Da(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:i}=Ra(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let a=o?.call(this);i?.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Fi}static _$Ei(){if(this.hasOwnProperty(Bt("elementProperties")))return;let t=Ba(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Bt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Bt("properties"))){let e=this.properties,n=[...Ia(e),...Oa(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(is(o))}else t!==void 0&&e.push(is(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Hi(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:os).toAttribute(e,n.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=n.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:os;this._$Em=o;let a=r.fromAttribute(e,i.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(t,e,n,o=!1,i){if(t!==void 0){let r=this.constructor;if(o===!1&&(i=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??Wi)(i,e)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:i},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,i]of n){let{wrapped:r}=i,a=this[o];r!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,i,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};ze.elementStyles=[],ze.shadowRootOptions={mode:"open"},ze[Bt("elementProperties")]=new Map,ze[Bt("finalized")]=new Map,ja?.({ReactiveElement:ze}),(bn.reactiveElementVersions??=[]).push("2.1.2");var as=globalThis,Ki=s=>s,vn=as.trustedTypes,Gi=vn?vn.createPolicy("lit-html",{createHTML:s=>s}):void 0,ls="$lit$",He=`lit$${Math.random().toFixed(9).slice(2)}$`,cs="?"+He,za=`<${cs}>`,nt=document,jt=()=>nt.createComment(""),zt=s=>s===null||typeof s!="object"&&typeof s!="function",ds=Array.isArray,Zi=s=>ds(s)||typeof s?.[Symbol.iterator]=="function",rs=`[ 	
\f\r]`,Nt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Vi=/-->/g,qi=/>/g,et=RegExp(`>|${rs}(?:([^\\s"'>=/]+)(${rs}*=${rs}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Yi=/'/g,Xi=/"/g,Qi=/^(?:script|style|textarea|title)$/i,hs=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),f=hs(1),le=hs(2),Ph=hs(3),Ue=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Ji=new WeakMap,tt=nt.createTreeWalker(nt,129);function eo(s,t){if(!ds(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Gi!==void 0?Gi.createHTML(t):t}var to=(s,t)=>{let e=s.length-1,n=[],o,i=t===2?"<svg>":t===3?"<math>":"",r=Nt;for(let a=0;a<e;a++){let c=s[a],d,h,l=-1,u=0;for(;u<c.length&&(r.lastIndex=u,h=r.exec(c),h!==null);)u=r.lastIndex,r===Nt?h[1]==="!--"?r=Vi:h[1]!==void 0?r=qi:h[2]!==void 0?(Qi.test(h[2])&&(o=RegExp("</"+h[2],"g")),r=et):h[3]!==void 0&&(r=et):r===et?h[0]===">"?(r=o??Nt,l=-1):h[1]===void 0?l=-2:(l=r.lastIndex-h[2].length,d=h[1],r=h[3]===void 0?et:h[3]==='"'?Xi:Yi):r===Xi||r===Yi?r=et:r===Vi||r===qi?r=Nt:(r=et,o=void 0);let b=r===et&&s[a+1].startsWith("/>")?" ":"";i+=r===Nt?c+za:l>=0?(n.push(d),c.slice(0,l)+ls+c.slice(l)+He+b):c+He+(l===-2?a:b)}return[eo(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},Ht=class s{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let i=0,r=0,a=t.length-1,c=this.parts,[d,h]=to(t,e);if(this.el=s.createElement(d,n),tt.currentNode=this.el.content,e===2||e===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(o=tt.nextNode())!==null&&c.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(let l of o.getAttributeNames())if(l.endsWith(ls)){let u=h[r++],b=o.getAttribute(l).split(He),y=/([.?@])?(.*)/.exec(u);c.push({type:1,index:i,name:y[2],strings:b,ctor:y[1]==="."?xn:y[1]==="?"?wn:y[1]==="@"?kn:it}),o.removeAttribute(l)}else l.startsWith(He)&&(c.push({type:6,index:i}),o.removeAttribute(l));if(Qi.test(o.tagName)){let l=o.textContent.split(He),u=l.length-1;if(u>0){o.textContent=vn?vn.emptyScript:"";for(let b=0;b<u;b++)o.append(l[b],jt()),tt.nextNode(),c.push({type:2,index:++i});o.append(l[u],jt())}}}else if(o.nodeType===8)if(o.data===cs)c.push({type:2,index:i});else{let l=-1;for(;(l=o.data.indexOf(He,l+1))!==-1;)c.push({type:7,index:i}),l+=He.length-1}i++}}static createElement(t,e){let n=nt.createElement("template");return n.innerHTML=t,n}};function st(s,t,e=s,n){if(t===Ue)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,i=zt(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=st(s,o._$AS(s,t.values),o,n)),t}var yn=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??nt).importNode(e,!0);tt.currentNode=o;let i=tt.nextNode(),r=0,a=0,c=n[0];for(;c!==void 0;){if(r===c.index){let d;c.type===2?d=new bt(i,i.nextSibling,this,t):c.type===1?d=new c.ctor(i,c.name,c.strings,this,t):c.type===6&&(d=new $n(i,this,t)),this._$AV.push(d),c=n[++a]}r!==c?.index&&(i=tt.nextNode(),r++)}return tt.currentNode=nt,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},bt=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=st(this,t,e),zt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==Ue&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Zi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&zt(this._$AH)?this._$AA.nextSibling.data=t:this.T(nt.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Ht.createElement(eo(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new yn(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=Ji.get(t.strings);return e===void 0&&Ji.set(t.strings,e=new Ht(t)),e}k(t){ds(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let i of t)o===e.length?e.push(n=new s(this.O(jt()),this.O(jt()),this,this.options)):n=e[o],n._$AI(i),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=Ki(t).nextSibling;Ki(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},it=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,i){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=$}_$AI(t,e=this,n,o){let i=this.strings,r=!1;if(i===void 0)t=st(this,t,e,0),r=!zt(t)||t!==this._$AH&&t!==Ue,r&&(this._$AH=t);else{let a=t,c,d;for(t=i[0],c=0;c<i.length-1;c++)d=st(this,a[n+c],e,c),d===Ue&&(d=this._$AH[c]),r||=!zt(d)||d!==this._$AH[c],d===$?t=$:t!==$&&(t+=(d??"")+i[c+1]),this._$AH[c]=d}r&&!o&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},xn=class extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}},wn=class extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}},kn=class extends it{constructor(t,e,n,o,i){super(t,e,n,o,i),this.type=5}_$AI(t,e=this){if((t=st(this,t,e,0)??$)===Ue)return;let n=this._$AH,o=t===$&&n!==$||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==$&&(n===$||o);o&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},$n=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){st(this,t)}},no={M:ls,P:He,A:cs,C:1,L:to,R:yn,D:Zi,V:st,I:bt,H:it,N:wn,U:kn,B:xn,F:$n},Ha=as.litHtmlPolyfillSupport;Ha?.(Ht,bt),(as.litHtmlVersions??=[]).push("3.3.3");var so=(s,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let i=e?.renderBefore??null;n._$litPart$=o=new bt(t.insertBefore(jt(),i),i,void 0,e??{})}return o._$AI(s),o};var us=globalThis,Se=class extends ze{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=so(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Ue}};Se._$litElement$=!0,Se.finalized=!0,us.litElementHydrateSupport?.({LitElement:Se});var Ua=us.litElementPolyfillSupport;Ua?.({LitElement:Se});(us.litElementVersions??=[]).push("4.2.2");var io={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},oo=s=>(...t)=>({_$litDirective$:s,values:t}),Tn=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Fa}=no,ro=s=>s;var ao=()=>document.createComment(""),vt=(s,t,e)=>{let n=s._$AA.parentNode,o=t===void 0?s._$AB:t._$AA;if(e===void 0){let i=n.insertBefore(ao(),o),r=n.insertBefore(ao(),o);e=new Fa(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,a=r!==s;if(a){let c;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(c=s._$AU)!==r._$AU&&e._$AP(c)}if(i!==o||a){let c=e._$AA;for(;c!==i;){let d=ro(c).nextSibling;ro(n).insertBefore(c,o),c=d}}}return e},Ke=(s,t,e=s)=>(s._$AI(t,e),s),Wa={},lo=(s,t=Wa)=>s._$AH=t,co=s=>s._$AH,En=s=>{s._$AR(),s._$AA.remove()};var ho=(s,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(s[o],o);return n},Ie=oo(class extends Tn{constructor(s){if(super(s),s.type!==io.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],i=[],r=0;for(let a of s)o[r]=n?n(a,r):r,i[r]=e(a,r),r++;return{values:i,keys:o}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let o=co(s),{values:i,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,i;let a=this.ut??=[],c=[],d,h,l=0,u=o.length-1,b=0,y=i.length-1;for(;l<=u&&b<=y;)if(o[l]===null)l++;else if(o[u]===null)u--;else if(a[l]===r[b])c[b]=Ke(o[l],i[b]),l++,b++;else if(a[u]===r[y])c[y]=Ke(o[u],i[y]),u--,y--;else if(a[l]===r[y])c[y]=Ke(o[l],i[y]),vt(s,c[y+1],o[l]),l++,y--;else if(a[u]===r[b])c[b]=Ke(o[u],i[b]),vt(s,o[l],o[u]),u--,b++;else if(d===void 0&&(d=ho(r,b,y),h=ho(a,l,u)),d.has(a[l]))if(d.has(a[u])){let m=h.get(r[b]),w=m!==void 0?o[m]:null;if(w===null){let M=vt(s,o[l]);Ke(M,i[b]),c[b]=M}else c[b]=Ke(w,i[b]),vt(s,o[l],w),o[m]=null;b++}else En(o[u]),u--;else En(o[l]),l++;for(;b<=y;){let m=vt(s,c[y+1]);Ke(m,i[b]),c[b++]=m}for(;l<=u;){let m=o[l++];m!==null&&En(m)}return this.ut=r,lo(s,c),Ue}});var _n=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function ce(s){return _n[(s%_n.length+_n.length)%_n.length]}var Cn="#23272E",ps="35,39,46";var fs=3,Kt=36,gs=12,Pn=8,uo=30,Oe=16,Ut=100,xt=60,Ka=120,po=44,fo=20,Ga=45,Va=30,go=20,vs=10,Mn=30,ys=10,qa=150,Ya=150,Ln=1;function $o(s,t){return s.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??Kt}function Xa(s,t,e){return 10+10.2*s.length+(t?30+8*t.length:0)+8+12+6.8*e.length+12+4}var Ja=26,To=4;function ws(s,t){let e=Math.max(qa,Ya/Ln);return Math.ceil(xt+Math.max(0,s-1)*vs+Mn+Math.max(0,t-1)*ys+e*(s+Ln*t))}function we(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function re(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function Eo(s,t){let e=s.who?.[t.event_id]?.people??[],n=t.own??t.kid;if(!e.includes(n))return null;let o=e.filter(r=>r!==n),i=we(s);return o.length&&(t.own!=null||o.some(r=>i.includes(r)))?o:null}function ve(s){return new Map(we(s).map((t,e)=>[t,ce(e)]))}function be(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function ue(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function ks(s,t){return t==="none"?"Not needed":re(s).includes(t)?ue(s,t):t}function Za(s){return s.leave_by!=null&&s.leave_by>s.start&&s.leave_by!==s.end?` · leave ${U(s.leave_by)}`:""}function Dn(s){if(s.busy_why==="days"){if(s.start<=0&&s.end>=1440)return"All day";if(s.start<=0)return`Until ${U(s.end)}`;if(s.end>=1440)return`From ${U(s.start)}`}return`${U(s.start)}–${U(s.end)}`}function Gt(s,t){return t.own?ue(s,t.own):be(s,t.kid)}var Fe={color:Cn,rgb:ps,ink:Cn};function _o(s,t){return t.own?Fe:ve(s).get(t.kid)??ce(0)}function Qa(s,t){let e=we(s);return t.along.map(n=>e.includes(n)?be(s,n):ue(s,n))}function wt(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function el(s,t){let e=we(s),n=re(s).filter(a=>t.includes(a)),o=e.filter(a=>t.includes(a)),i=e.length>1&&o.length===e.length;if(i&&n.length===re(s).length)return"Everyone";let r=[...n.map(a=>ue(s,a)),...i?["the kids"]:o.map(a=>be(s,a))];return r.length<2?r.join(""):`${r.slice(0,-1).join(", ")} & ${r[r.length-1]}`}function tl(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function An(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function ms(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(An(t,n.from)),e.push(An(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(An(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function nl(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,a)=>r.s-a.s||a.en-r.en),e=[],n=[],o=-1/0,i=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(i(),o=-1/0);let a=n.findIndex(c=>c<=r.s);a<0?(a=n.length,n.push(r.en)):n[a]=r.en,r.col=a,e.push(r),o=Math.max(o,r.en)}return i(),t}function sl(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return s[s.length-1].y}function il(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return s[s.length-1].t}function Co(s,t){return sl(s.anchors,t)}function $s(s,t){return il(s.anchors,t)}function ol(s,t){let e=we(s),n=re(s),o=Math.max(t,ws(e.length,n.length)),r=(o-xt-Math.max(0,e.length-1)*vs-Mn-Math.max(0,n.length-1)*ys)/(e.length+Ln*n.length||1),a=Math.floor(r),c=Math.floor(r*Ln),d=s.whole_week??s.days,h=new Map;for(let m of d)for(let w of m.events)for(let M of w.own?w.along:[w.kid]){let g=h.get(M)??[];g.some(P=>P.event_id===w.event_id&&P.calendar_id===w.calendar_id)||g.push(w),h.set(M,g)}let l=ve(s),u=[],b=xt;e.forEach((m,w)=>{let M=h.get(m)??[],g=s.days.some(P=>P.events.some(N=>N.kid===m&&(N.sides.includes("drop")&&N.drop===""||N.sides.includes("pick")&&N.pick==="")));u.push({id:m,kind:"kid",x:b,w:a,name:be(s,m),dot:l.get(m).color,rgb:l.get(m).rgb,sub:`${g?"Needs a ride · ":""}${M.length} this week`,subWarn:g}),b+=a+(w<e.length-1?vs:0)});let y=b+Mn/2;return b+=Mn,n.forEach((m,w)=>{let M=0,g=0;for(let P of d){let N=P.drivers[m];N&&(M+=N.outings.length,g+=N.drive??0)}u.push({id:m,kind:"driver",x:b,w:c,name:ue(s,m),dot:Cn,rgb:ps,sub:`${M} ${M===1?"trip":"trips"} this week · ${mt(g)} driving`,subWarn:!1}),b+=c+(w<n.length-1?ys:0)}),{columns:u,sepX:y,width:o}}function rl(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function mo(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${U(s.start)}`:e||!t?`${s.title} until ${U(s.end)}`:`${s.title} ${U(s.start)}–${U(s.end)}`}function Ts(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length+(s.unplaced?.length??0)}function Es(s,t){let e=Re(t,s);return e===0?"Today":e===1?"Tomorrow":""}function ge(s,t=0){return s==null||!Number.isFinite(s)?t:s}var xs=null;function Po(s){xs=s}var Sn='Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif',yt={title:`800 14.5px ${Sn}`,time:`400 12px ${Sn}`,line:`600 12px ${Sn}`,stop:`400 12px ${Sn}`};function al(s,t,e){let n=Math.max(8,Math.floor(t/e)),o=1,i=0;for(let r of s.split(/[ \t\n]+/).filter(Boolean)){let a=r.length;for(i===0?i=a:i+1+a<=n?i+=1+a:(o++,i=a);i>n;)o++,i-=n}return o}function ll(s,t,e,n){let o=s.split(/[ \t\n]+/).filter(Boolean),i=1,r="";for(let a of o){let c=r?`${r} ${a}`:a,d=n(c,e);if(d==null)return null;if(d<=t){r=c;continue}r&&i++;let h=n(a,e);if(h==null)return null;h>t&&(i+=Math.ceil(h/t)-1),r=a}return i}function Ft(s,t,e=7,n){if(n&&xs){let o=ll(s,t-.5,n,xs);if(o!=null)return o}return al(s,t,e)}var So=25,cl=15,Mo=3;function bo(s){return Math.max(0,Math.min(Mo,Math.floor((s-So)/cl)))}var dl=So+2,vo=20;function yo(s,t="Home"){let e=/^(\d+:\d\d)\s+(.+)$/.exec(s.at(-1)??"");return e&&e[2]===t?e[1]:null}function bs(s,t,e,n){let o=t.drivers[e],i=o?.home;if(!i)return s;let r=n==null?void 0:o.outings.find(a=>(a.start??1/0)<=n&&n<(a.end??-1/0));return new Map(s).set(i.place,i.name).set("home",r?.home??i.name)}var Wt="🚗";function xo(s,t){if(s===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,i,r,a=!1)=>({at:o,who:i,stays:a,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(s))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(s))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with |With )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(s))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}return null}var wo={muted:0,normal:1,pending:2,problem:3};function hl(s){let{drop:t,pick:e}=s,n=t?xo(t.text,"drop"):null,o=e?xo(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return s;let i=[t,e].reduce((c,d)=>d&&(wo[d.tone]??1)>(wo[c]??1)?d.tone:c,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${Wt} No rides yet`,tone:i},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let c=`${Wt} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${c} both ways`,tone:i},pick:null}:!n.at||!o.at?{drop:{text:`${c} both ways · ${n.at?`↓${n.at}`:`↑${o.at}`}`,tone:i},pick:null}:{drop:{text:`${c} ↓${n.at} ↑${o.at}`.trimEnd(),tone:i},pick:null}}let r=(c,d)=>c==="needed"?`${d} needed`:`${d}${c.at?`${c.at} `:" "}${c.who}${c.stays?" stays":""}${c.extra}`,a=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${Wt} ${a.join(" · ")}`,tone:i},pick:null}}function ul(s,t){return!t&&!!s.drop&&!s.pick&&s.drop.tone==="muted"}var pl=5,fl=13;function gl(s,t,e={}){let n=e.clash?4:2,o=t-n-13-9,i=n+2*pl;i+=Ft(s.title,o-(e.noted?fl:0),9,yt.title)*18;let r=s.inline&&s.drop?`${s.time} · ${s.drop.text}`:s.time;return i+=1+Ft(r,o,6.6,s.inline?yt.line:yt.time)*16,s.drop&&!s.inline&&(i+=1+Ft(s.drop.text,o,7,yt.line)*16),s.pick&&(i+=2+Ft(s.pick.text,o,7,yt.line)*16),Math.ceil(i)+1}function ko(s,t="Home"){let e=/^(\S+\s+)(.+?), get (.+)$/u.exec(s);return e&&e[2]===t?`${e[1]}${t} ↑ ${e[3]}`:s.replace(/, drop off (.+)$/u," ↓ $1").replace(/, pick up (.+)$/u," ↑ $1")}function ml(s,t){let e=s.reduce((n,o)=>n+Ft(o,t-20,7,yt.stop),0);return 28+s.length+e*16+1}function Ao(s,t,e,n){let o=t==="compact",{columns:i,sepX:r,width:a}=ol(s,e),c=new Map(i.map(g=>[g.id,g])),d=we(s),h=re(s),l=[...d,...h],u=ve(s),b=tl(s),y=g=>be(s,g),m=g=>ue(s,g),w={mode:t,width:a,height:0,columns:i,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],folds:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},M=0;return s.days.forEach((g,P)=>{let N=P*1440,K=new Map(g.events.map(p=>[p.id,p])),se=p=>p&&K.has(p)?{day:g.date,event:p}:null,T=Ts(g),E=g.events.length,x=Es(g.date,n.date),_=Le(g.date),C=(E?`${E} ${E===1?"activity":"activities"}${g.done?" left":""}`:g.done?"All done for today":"Nothing scheduled")+(T?` · ${T} to sort out`:""),D=Tl(s,g,u,a,a-Xa(_,x,C));w.dayHeads.push({date:g.date,y:M,label:_,tag:x,sub:C,warn:T>0,h:Kt+(D&&D.h?D.h+To+2:0),allDay:D?.chips??[],inline:D?.inline??0}),w.anchors.push({t:N,y:M});let j=w.dayHeads[w.dayHeads.length-1],W=M+j.h+gs,q=h.flatMap(p=>g.drivers[p]?.outings??[]);if(!E&&!q.length){w.empties.push({key:g.date,y:W,text:g.done?"Nothing else today":"Nothing planned"}),M=W+40,w.anchors.push({t:N+1439,y:M});return}let Z=(p,k,S=p.kid)=>{let v=!!p.own&&S===p.own,I=!!p.own&&S!==p.own,R=v?m(S):y(S),L=I?{drop:{text:`${k?`${Wt} `:""}With ${m(p.own)}`,tone:p.attending===!1?"muted":"normal"},pick:null}:k&&!p.own?hl(p.lines):p.lines,X=v?Qa(s,p):[],H=(p.takes!=null?`${p.takes} min, any time ${U(p.start)}–${U(p.end)}`:Dn(p)+(p.arrive_by!=null?` · arrive ${U(p.arrive_by)}`:"")+Za(p))+(X.length?` · with ${wt(X)}`:"");return{who:R,mine:v,title:rl(p.title,R),time:H,drop:L.drop,pick:L.pick,inline:k&&ul(L,p.attending===!1)}},z=(p,k,S,v)=>gl(Z(p,!0,S),k,{noted:!!p.notes,clash:v}),Y=(p,k,S,v,I,R,L,X=p.kid)=>{let H=Z(p,L,X),me=H.mine?Fe:u.get(X)??ce(0),ee=H.who,A={drop:H.drop,pick:H.pick};return{key:`${g.date}|card|${p.id}`+(p.own?`|${X}`:""),x:k,y:S,w:v,h:I,target:{day:g.date,event:p.id},event:p,color:me,kidName:ee,clash:R,stayed:!p.own&&p.stay&&h.includes(p.drop),skipped:p.attending===!1,title:H.title,time:H.time,drop:A.drop,pick:A.pick,showDrop:!!A.drop&&(L||I>=56),showPick:!!A.pick&&(L||I>=74),wrap:L,inline:H.inline,aria:`${ee}, ${p.title} ${p.takes!=null?`any time from ${U(p.start)} to ${U(p.end)}`:Dn(p).replace("–"," to ")}. `+(p.attending===!1&&!A.drop?"Not attending. ":"")+[A.drop,A.pick].filter(J=>!!J).map(J=>J.text).join(". ")}},pe=p=>{let k=g.rides[p];return k?(g.drivers[k.driver]?.segments??[]).filter(v=>v.type!=="home"&&v.kids.includes(k.kid)&&ge(v.start)>=ge(k.start)&&ge(v.end)<=ge(k.end)):[]},Me=p=>{let k=g.rides[p];if(!k)return null;let S=k.serves.find(v=>K.get(v)?.kid===k.kid);return se(S??k.serves[0])},De=(p,k)=>{if(k.event)return k;let S=g.events.find(v=>v.own&&v.own!==p&&v.along.includes(p)&&v.title===k.title);return S?{...k,title:`${k.title} with ${m(S.own)}`}:k},Ce=p=>{if(p.takes==null)return[p.start,p.end];let k=p.planned??p.start;return[k,k+p.takes]},Q=new Map;for(let p of g.issues)p.level!=="problem"||!p.event||(p.kind==="late"&&Q.set(p.event,`${Math.round(ge(p.minutes))} min late`),p.kind==="waiting"&&Q.set(`${p.event}|pick`,`Waits ${Math.round(ge(p.minutes))} min`));if(!o){let p=1/0,k=-1/0;for(let A of g.events)A.start<=0&&A.end>=1440||(A.start>0?p=Math.min(p,A.start-20,A.arrive_by!=null?A.arrive_by-10:1/0):p=Math.min(p,A.end-30),A.end<1440?k=Math.max(k,A.end+20):k=Math.max(k,A.start+30));for(let A of q)A.start!=null&&(p=Math.min(p,A.start)),A.end!=null&&(k=Math.max(k,A.end));let S=g.from;S!=null&&Number.isFinite(p)&&p<S+60?p=S-15:g.date===n.date&&Number.isFinite(p)&&n.minutes>p-60&&n.minutes<k&&(p=Math.min(p,n.minutes-15));let v=Number.isFinite(p)?Math.floor((p-5)/30)*30:900,I=Math.max(Number.isFinite(k)?Math.ceil((k+5)/30)*30:960,v+60),R=A=>S!=null&&ge(A)<=v,L=A=>S!=null&&ge(A)<v,X=vl(bl(g,h,Ce,g.date===n.date?n.minutes:null),v,I),H=A=>Math.round(W+yl(Math.max(v,Math.min(I,A))-v,X,v));w.anchors.push({t:N+v,y:H(v)});for(let A of X)w.anchors.push({t:N+A.from,y:H(A.from)},{t:N+A.to,y:H(A.to)}),w.folds.push({key:`${g.date}|fold|${A.from}`,y:H(A.from),h:H(A.to)-H(A.from),from:A.from,to:A.to,label:xl(A.to-A.from)});w.anchors.push({t:N+I,y:H(I)});let me=(A,J)=>X.some(G=>J?A>=G.from&&A<=G.to:A>G.from&&A<G.to);for(let A of d){let J=c.get(A),G=u.get(A),Ae=(g.kids[A]?.items??[]).filter(O=>O.start!=null&&O.end!=null&&!R(O.end)).map(O=>({item:O,s:ge(O.start),en:ge(O.end)})),ye=[];for(let O of nl(Ae)){let F=J.w/O.cols,V=Math.round(J.x+O.col*F),te=Math.round(F-(O.cols>1?4:0)),de=H(O.s),ne=O.item;if(ne.type==="act"){let _e=K.get(ne.event??"");if(!_e)continue;let cn=Math.max(30,H(O.en)-de),ft=Y(_e,V,de,te,cn,ne.clash,!1,A);if(ft.layer=Ut,ft.cut=L(O.s),w.cards.push(ft),_e.arrive_by!=null&&_e.start-_e.arrive_by>=5&&!ft.cut){let Yn=H(_e.arrive_by),vi={key:`${g.date}|prep|${_e.id}`,x:V,y:Yn,w:te,h:de-Yn+Oe,color:G,label:`Arrive by ${U(_e.arrive_by)}`,layer:Ut-1};w.preps.push(vi),ye.push({s:_e.arrive_by,en:O.en,top:Yn,bottom:de+cn,x:V,w:te,prep:vi,card:ft})}else ye.push({s:O.s,en:O.en,top:de,bottom:de+cn,x:V,w:te,card:ft});let mi=Q.get(_e.id);mi&&w.marks.push({key:`${g.date}|late|${_e.id}`,x:V+te-4,y:de+4,text:mi,right:!0});let bi=Q.get(`${_e.id}|pick`);bi&&w.marks.push({key:`${g.date}|wait|${_e.id}`,x:V+4,y:de+cn+2,text:bi,right:!1});continue}let ae=g.rides[ne.ride??-1];if(!ae)continue;let he=Math.max(22,H(O.en)-de),Je=ms(pe(ae.index),bs(b,g,ae.driver,ae.start??void 0)),Lt=m(ae.driver),fi={key:`${g.date}|ride|${ae.index}`,x:V,y:de,w:te,h:he,target:Me(ae.index),l1:`${ae.own?"In":"Along in"} ${Lt}’s car`,l2:Je.join(" → "),show2:bo(he)>0,lines2:bo(he),dashed:!ae.own,clash:ne.clash,aria:`${y(A)} ${ae.own?"in":"riding along in"} ${Lt}’s car, ${U(ge(ae.start))} to ${U(ge(ae.end))}: ${Je.join(" to ")}`};w.rides.push(fi);let gi=c.get(ae.driver),qn=null;gi&&(qn={key:`${g.date}|band|${ae.index}`,x:V+te,y:de,w:Math.max(0,gi.x+8-(V+te)),h:he,color:G},w.bands.push(qn)),ye.push({s:O.s,en:O.en,top:de,bottom:de+he,x:V,w:te,ride:fi,band:qn})}let ln=O=>O.ride?.layer??(O.prep?Ut-1:Ut),At=(O,F,V,te)=>{V>Oe&&w.links.push({key:`${O.key}|link`,x:O.x,y:F,w:O.w,h:V,color:G,layer:te})},B=(O,F)=>{if(!(F.x<O.x||F.x+F.w>O.x+O.w)&&(O.x=F.x,O.w=F.w,O.ride.x=F.x,O.ride.w=F.w,O.band)){let V=O.band.x+O.band.w;O.band.x=F.x+F.w,O.band.w=Math.max(0,V-O.band.x)}},fe=new Set;for(let O of[...ye].sort((F,V)=>V.s-F.s)){let F=O.ride;if(!F)continue;let V=ye.filter(ne=>ne!==O&&ne.s>=O.en&&ne.s-O.en<=uo&&ne.top>=O.bottom).sort((ne,ae)=>ne.s-ae.s||ne.top-ae.top)[0];if(!V)continue;fe.add(O),B(O,V);let te=ln(V),de=V.top-O.bottom;At(F,O.bottom,de+Oe,te-1),F.layer=te-(de>0?2:1),F.h+=Oe,F.tuckBottom=Oe}for(let O of[...ye].sort((F,V)=>F.s-V.s)){let F=O.ride;if(!F||fe.has(O))continue;let V=ye.filter(ne=>ne!==O&&ne.en<=O.s&&O.s-ne.en<=uo&&ne.bottom<=O.top&&(ne.card||ne.ride?.layer!=null)).sort((ne,ae)=>ae.en-ne.en||ae.bottom-ne.bottom)[0];if(!V)continue;B(O,V);let te=V.ride?.layer??Ut,de=O.top-V.bottom;At(F,V.bottom-Oe,de+Oe,te-1),F.layer=te-(de>0?2:1),F.y-=Oe,F.h+=Oe,F.tuckTop=Oe}}for(let A of h){let J=c.get(A),G=g.drivers[A];if(!G)continue;let Ae=[],ye=null;for(let B of G.segments)if(!(B.start==null||B.end==null)){if(B.type==="home"){ye=null;continue}if(B.type==="stay"){ye=null,Ae.push({type:"stay",g:B,s:B.start,en:B.end});continue}ye&&ye.en===B.start?(ye.en=B.end,ye.legs.push(B)):(ye={type:"trip",s:B.start,en:B.end,legs:[B]},Ae.push(ye))}let ln=new Set,At=(B,fe,O,F)=>{ln.add(B.id);let V=H(fe),te=Y(B,J.x+8,V,J.w-16,Math.max(30,H(O)-V),!1,!1,A);te.cut=L(fe),F&&te.drop?.tone==="normal"&&(te.drop=null,te.showDrop=!1),w.cards.push(te)};for(let B of Ae){if(R(B.en))continue;let fe=H(B.s),O=Math.max(24,H(B.en)-fe);if(B.type==="stay"){let he=K.get(B.g.event??B.g.serves??"");if(he?.own===A){At(he,B.s,B.en,!0);continue}let Je=he?u.get(he.kid)??ce(0):ce(0),Lt=B.g.kids.map(y);w.stays.push({cut:L(B.s),key:`${g.date}|stay|${A}|${B.s}`,x:J.x+8,y:fe,w:J.w-16,h:O,target:se(he?.id),color:Je,l1:he?`At ${he.title} with ${y(he.kid)}`:"Staying",l2:`until ${U(B.en)}`+(Lt.length?` · ${Lt.join(" and ")} too`:"")});continue}let F=B.legs[0],V=B.legs[B.legs.length-1],te=[];for(let he of B.legs)for(let Je of he.kids)te.includes(Je)||te.push(Je);let de=V.type==="drive"&&V.to==="home",ne=bs(b,g,A,B.s),ae=ms(B.legs,ne);w.trips.push({key:`${g.date}|trip|${A}|${B.s}`,x:J.x+8,y:fe,w:J.w-16,h:O,target:se(B.legs.find(he=>he.serves)?.serves),l1:F.type==="drive"&&F.from==="home"?`Leave ${U(B.s)}`:`From ${An(b,F.from??F.place)} ${U(B.s)}`,l2:ae.join(" → "),show2:O>=36,l3:de?`${ne.get("home")??"Home"} ${U(B.en)}`:"",show3:de&&O>=62,stops:null,kids:te.map(he=>(u.get(he)??ce(0)).color),bad:B.legs.some(he=>he.overlaps_busy),aria:`${m(A)} drives ${ae.join(" to ")}, ${U(B.s)} to ${U(B.en)}`})}for(let B of G.segments)if(!(!B.overlaps_busy||B.start==null||B.end==null))for(let fe of G.busy){let O=Math.max(B.start,fe.start),F=Math.min(B.end,fe.end);F<=O||R(F)||w.overlaps.push({key:`${g.date}|overlap|${A}|${O}`,x:J.x+6,y:H(O)-2,w:J.w-12,h:Math.max(8,H(F)-H(O)+4)})}for(let B of g.events)if(B.own===A&&(!ln.has(B.id)&&!R(Ce(B)[1])&&At(B,...Ce(B),!1),B.takes!=null&&B.attending!==!1&&!R(B.end))){let fe=H(B.start);w.windows.push({key:`${g.date}|window|${B.id}`,x:J.x+4,y:fe,w:J.w-8,h:Math.max(24,H(B.end)-fe),label:`${B.title} · any time ${U(B.start)}–${U(B.end)}`})}for(let B of G.busy){if(B.event||B.end<=v||B.start>=I)continue;let fe=De(A,B),O=H(fe.start),F=H(fe.end);w.busy.push({key:`${g.date}|busy|${A}|${fe.start}`,x:J.x+1,y:O,w:J.w-2,h:F-O,labelY:8,label:mo(fe,!1)})}}let ee=-1/0;for(let A=v;A<=I;A+=30)me(A,!0)||w.grid.push({key:`${g.date}|grid|${A}`,y:H(A),strong:A%60===0}),(X.some(G=>G.from===A||G.to===A)||A%60===0&&!me(A,!1))&&H(A)-ee>=22&&(w.hours.push({key:`${g.date}|hour|${A}`,y:H(A)-8,label:A%60===0?Ri(A):je(A)}),ee=H(A));g.date===n.date&&n.minutes>v&&n.minutes<I&&(w.now={y:H(n.minutes),label:`Now ${U(n.minutes)}`}),M=H(I)+gs;return}let ie=[];for(let p of d){let k=c.get(p);for(let S of g.kids[p]?.items??[])if(S.start!=null){if(S.type==="act"){let v=K.get(S.event??"");if(!v)continue;ie.push({col:p,s:S.start,h:z(v,k.w,p,S.clash),kind:"act",item:S})}else if(!g.rides[S.ride??-1]?.own){let v=g.rides[S.ride??-1],I=v?g.drivers[v.driver]?.outings.find(R=>R.start!=null&&R.start<=ge(v.start)&&ge(v.start)<=ge(R.end,R.start)):void 0;ie.push({col:p,s:I?.start??S.start,h:dl,kind:"along",item:S})}}}for(let p of h){let k=g.drivers[p];if(!k)continue;for(let v of k.busy)v.event||ie.push({col:p,s:v.start,h:32,kind:"busy",busy:De(p,v)});let S=c.get(p).w;for(let v of g.events)v.own!==p||!v.busy_only&&v.attending!==!1&&(v.takes==null||v.planned!=null)||ie.push({col:p,s:Ce(v)[0],h:z(v,S-16,p,!1),kind:"own",event:v});for(let v of k.outings){if(v.start==null)continue;let I=(yo(v.lines,v.home)?v.lines.slice(0,-1):v.lines).map(R=>ko(R,v.home));ie.push({col:p,s:v.start,h:ml([...I,...v.warn?[v.warn]:[]],S-16),kind:"out",out:v})}}ie.sort((p,k)=>p.s-k.s||l.indexOf(p.col)-l.indexOf(k.col));let Pe=new Map,$e=[],Ye=new Map,Xe=W-vo;for(let p=0;p<ie.length;){let k=p,S=Xe+vo;for(;k<ie.length&&ie[k].s===ie[p].s;k++){let I=Pe.get(ie[k].col);I!=null&&(S=Math.max(S,I+Pn))}let v=new Set;for(let I=p;I<k;I++){let R=ie[I],L=v.has(R.col)?Pe.get(R.col)+Pn:S;v.add(R.col),Pe.set(R.col,L+R.h)}Ye.set(ie[p].s,S),ie[p].s>0&&w.hours.push({key:`${g.date}|hour|${ie[p].s}`,y:S+2,label:je(ie[p].s)}),Xe=S,p=k}Pe.clear(),ie.forEach((p,k)=>{let S=Pe.get(p.col),v=Math.max(S!=null?S+Pn:W,Ye.get(p.s));Pe.set(p.col,v+p.h);let I=p.kind==="busy"?p.busy.end:p.kind==="act"?K.get(p.item.event??"")?.end??null:p.kind==="own"?Ce(p.event)[1]:null;$e.push({col:p.col,s:p.s,end:I,y:v,h:p.h,box:null}),w.anchors.push({t:N+p.s,y:v});let R=c.get(p.col);if(p.kind==="busy"){let L={key:`${g.date}|busy|${p.col}|${k}`,x:R.x+1,y:v,w:R.w-2,h:p.h,labelY:8,label:mo(p.busy,!0)};w.busy.push(L),$e[$e.length-1].box=L}else if(p.kind==="out"){let L=p.out,X=yo(L.lines,L.home),H=X?L.lines.slice(0,-1):L.lines;w.trips.push({key:`${g.date}|trip|${p.col}|${k}`,x:R.x+8,y:v,w:R.w-16,h:p.h,target:se(L.target),l1:X?`${L.lead} · ${L.home&&L.home!=="Home"?L.home:"home"} ${X}`:L.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...H.map(me=>({text:ko(me,L.home),warn:!1})),...L.warn?[{text:L.warn,warn:!0}]:[]],kids:L.kids.map(me=>(u.get(me)??ce(0)).color),bad:!!L.warn,aria:`${m(p.col)}: ${L.lead}. ${L.lines.join(". ")}${L.warn?`. ${L.warn}`:""}`})}else if(p.kind==="own"){let L=Y(p.event,R.x+8,v,R.w-16,p.h,!1,!0,p.col);w.cards.push(L),$e[$e.length-1].box=L}else if(p.kind==="act"){let L=K.get(p.item.event??""),X=Y(L,R.x,v,R.w,p.h,p.item.clash,!0,p.col);w.cards.push(X),$e[$e.length-1].box=X}else{let L=g.rides[p.item.ride??-1],X=ms(pe(L.index),bs(b,g,L.driver,L.start??void 0)),H=m(L.driver);w.rides.push({key:`${g.date}|ride|${L.index}`,x:R.x,y:v,w:R.w,h:p.h,target:Me(L.index),l1:`${Wt} with ${H}`,l2:X.join(" → "),show2:!1,lines2:Mo,dashed:!0,clash:p.item.clash,aria:`${y(p.col)} riding along with ${H}, ${U(ge(L.start))} to ${U(ge(L.end))}: ${X.join(" to ")}`})}});let Te=W;for(let p of Pe.values())Te=Math.max(Te,p);for(let p of $e){if(!p.box||p.end==null)continue;let k=p.y+p.h;for(let S of $e)S.col!==p.col&&S.s>=p.s&&S.s<p.end&&(k=Math.max(k,S.y+S.h));p.end>=1440&&(k=Te);for(let S of $e)S.col===p.col&&S.y>p.y&&(k=Math.min(k,S.y-Pn));k=Math.min(k,Te),k>p.y+p.h&&(p.box.h=k-p.y)}M=Te+gs+6,w.anchors.push({t:N+1439,y:M})}),w.height=M,w}function bl(s,t,e,n){let o=[],i=(r,a)=>{r==null||a==null||o.push([r-fo,Math.min(a,r+Ga)+go],[Math.max(r,a-Va)-fo,a+go])};for(let r of s.events)r.own?(i(...e(r)),r.takes!=null&&i(r.start,r.end)):i(r.arrive_by??r.start,r.end);for(let r of Object.values(s.kids))for(let a of r.items??[])i(a.start,a.end);for(let r of t){let a=s.drivers[r];if(a){for(let c of a.segments)c.type!=="home"&&i(c.start,c.end);for(let c of a.outings)i(c.start,c.end);for(let c of a.busy)i(c.start,c.end)}}return n!=null&&o.push([n-30,n+30]),o}function vl(s,t,e){let n=s.map(([c,d])=>[Math.max(t,c),Math.min(e,d)]).filter(([c,d])=>d>c).sort((c,d)=>c[0]-d[0]),o=[],i=t,r=(c,d)=>{let h=Math.ceil(c/30)*30,l=Math.floor(d/30)*30;l-h>=Ka&&o.push({from:h,to:l})},a=!1;for(let[c,d]of n)a&&c>i&&r(i,c),i=a?Math.max(i,d):d,a=!0;return o}function yl(s,t,e){let n=s*fs,o=e+s;for(let i of t){let r=i.to-i.from;o>=i.to?n-=r*fs-po:o>i.from&&(n-=(o-i.from)*fs-(o-i.from)/r*po)}return n}function xl(s){let t=Math.floor(s/60),e=s%60>=30;return`${t}${e?"½":""} hrs`}var wl=["","¼","½","¾"];function ot(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return mt(n);let o=Math.round(n*4),i=Math.floor(o/4),r=wl[o%4];return`${i||!r?i:""}${r} min`})}function Lo(s){let t=e=>e?{...e,text:ot(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(ot),warn:i.warn==null?i.warn:ot(i.warn)}))}])),issues:e.issues.map(n=>({...n,title:ot(n.title),body:ot(n.body),note:n.note==null?n.note:ot(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:ot(o.note)}))}:{}}))}))}}var kl=2,$l=48;function Do(s,t,e=$l){let n=[],o=new Set(re(s)),i=we(s).map(u=>be(s,u)),r=i.length>1?i.slice(0,2):[i[0]??"Ava","Ben"],a=0,c=0,d=0,h=0,l=t.minutes+e*60;for(let u of s.days){let b=Re(t.date,u.date),y=b===0?"":`${xe(u.date)} · `,m=new Map(u.events.map(g=>[g.id,g])),w=g=>g&&m.has(g)?{day:u.date,event:g}:null,M=(g,P)=>b*1440+(g??m.get(P??"")?.start??0)<l;for(let g of u.issues)if(g.level==="problem"){if(!M(g.at,g.event)){d++,g.kind==="unassigned"&&h++;continue}a++,g.kind==="unassigned"&&c++,n.push({key:`${u.date}|${g.key}`,tone:g.kind==="unassigned"?"unassigned":"problem",title:y+g.title,body:g.body,target:w(g.event),suggestions:(g.suggestions??[]).map(P=>({id:P.id,label:P.label,note:P.note}))})}if(u.clashes.forEach((g,P)=>{if(!M(g.a.start,g.a.event)){d++;return}a++;let N=m.get(g.a.event??""),K=be(s,g.kid),se=(E,x)=>{let _=w(x);return _?{text:E,target:_}:E},T=[];if(g.b.type==="act"){let E=m.get(g.b.event??"");N&&E&&(T=[se(N.title,N.id),` ${U(N.start)}–${U(N.end)} and `,se(E.title,E.id),` ${U(E.start)}–${U(E.end)} overlap.`])}else{let E=u.rides[g.b.ride??-1];N&&E&&(T=[`${K} is in `,se(`${ue(s,E.driver)}’s car`,E.serves[0]),` ${U(ge(g.b.start))}–${U(ge(g.b.end))}, during `,se(N.title,N.id),"."])}n.push({key:`${u.date}|clash|${P}`,tone:"problem",title:`${y}${K} is double-booked`,body:T.map(E=>typeof E=="string"?E:E.text).join(""),parts:T,target:null,suggestions:[]})}),b>=0&&b<kl)for(let g of u.issues)g.level!=="heads_up"||!M(g.at,g.event)||n.push({key:`${u.date}|${g.key}`,tone:"heads_up",title:y+g.title,body:g.body,target:w(g.event),suggestions:[]});for(let g of u.unplaced??[]){if(!M(g.at)){d++;continue}a++;let P=g.people.map(K=>o.has(K)?ue(s,K):be(s,K)),N=g.from_notes?"The For line in its notes":"Its title";n.push({key:`${u.date}|unplaced|${g.id}`,tone:"problem",title:`${y}${U(g.at)} ${g.title}: ${Ro(g).toLowerCase()}`,body:g.reason==="unknown"&&g.word?`${N} names “${g.word}”, who isn’t anyone in the family, so ${P.length?`it’s only in ${wt(P)}’s lane`:"it isn’t on the board"}. Tap to pick who it’s for.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Tap to pick who it’s for, or start the title in Google Calendar with a name, such as “${r[0]} Piano”.`,target:null,suggestions:[],pick:{day:u.date,id:g.id}})}for(let g of u.events)!g.problems.length||!M(g.start)||n.push({key:`${u.date}|notes|${g.id}`,tone:"heads_up",title:`${y}Check the notes on ${Gt(s,g)}’s ${g.title}`,body:`These lines couldn’t be read: ${g.problems.join("; ")}`,target:w(g.id),suggestions:[]})}return{items:n,problems:a,unassigned:c,later:d,laterUnassigned:h}}function Ro(s){return s.reason==="unknown"&&s.word?`Who is “${s.word}”?`:"Who is this for?"}function Tl(s,t,e,n,o=0){let i=new Set(re(s)),r=y=>{let m=y[0];return m==null?null:i.has(m)?Fe:e.get(m)??null},a=[...(t.all_day??[]).map(y=>{let m=y.days>1?`Day ${y.day_number} of ${y.days}`:"";return{key:`${t.date}|allday|${y.id}`,title:y.stay?`🏨 ${y.title}`:y.title,note:y.stay?[el(s,y.people),m].filter(Boolean).join(" · "):m,color:r(y.people),cancelled:y.cancelled,warn:!1,pick:null,stay:y.stay&&!y.cancelled?y.id:null,canStay:!y.stay&&y.can_stay?y.id:null,notes:y.notes??""}}),...(t.unplaced??[]).map(y=>({key:`${t.date}|unplaced|${y.id}`,title:`${U(y.at)} ${y.title}`,note:Ro(y),color:null,cancelled:!1,warn:!0,pick:y.id,stay:null,canStay:null,notes:y.notes??""}))];if(!a.length)return null;let c=Math.max(120,n-xt),d=(y,m=7)=>30+m*y.title.length+(y.note?Math.min(m,5.6)*(y.note.length+2):0)+(y.notes?16:0)+(y.stay?12:0),h=0,l=0;for(;h<a.length&&l+d(a[h],6.4)<=o;)l+=d(a[h++],6.4);let u=0;l=0;for(let y of a.slice(h)){let m=Math.min(c,d(y));(!u||l+m>c)&&(u++,l=0),l+=m}let b=u?u*Ja+(u-1)*To:0;return{key:`${t.date}|allday`,h:b,chips:a,inline:h}}function Io(s,t){let e=ve(s),n=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=Re(t.date,i.date);if(!(r<0))for(let a of re(s))for(let c of i.drivers[a]?.outings??[]){if(c.start==null)continue;let d=r*1440+c.start;if(r*1440+ge(c.end,c.start)<=t.minutes)continue;let l=d-t.minutes,u={driver:a,name:ue(s,a),date:i.date,ahead:r,start:c.start,inMinutes:l,ongoing:l<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(b=>e.get(b)??ce(0)),warn:c.warn,target:c.target&&i.events.some(b=>b.id===c.target)?{day:i.date,event:c.target}:null};(!n||o(u)<o(n)||o(u)===o(n)&&u.inMinutes<n.inMinutes)&&(n=u)}}return n}function kt(s){return s.state==="done"||s.state==="late"||qt(s.state)}function qt(s){return s==="skipped"||s==="excused"}var Oo=780;function Ps(s,t){return!!s.for_day&&(s.shows_from??s.due)===t&&!!s.due&&s.due>t}function El(s,t,e){return s.state==="open"&&Ps(s,t)&&e<Oo}function Bo(s,t){return s.state==="open"&&!!s.for_day&&s.for_day===t}function No(s,t){return s.chores.filter(e=>!(t>=Oo&&Bo(e,s.today))).map(e=>El(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function jo(s){return s.state==="open"||s.state==="overdue"}function Ss(s,t,e){if(s.state==="skipped")return"Skipped";if(s.state==="excused")return"Excused";if(kt(s)){let n=s.done_at?_l(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${_s(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${_s(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let o=Re(t,s.due);return`By ${o===1?"tomorrow":o<7?xe(s.due):Cs(s.due)}`}if(Ps(s,t))return`Tonight · for ${_s(s.for_day,t)}`;if(Bo(s,t))return"For school today";if(s.due&&s.due>t){let n=Re(t,s.due);return n===1?"By tomorrow":`By ${n<7?xe(s.due):Cs(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function _s(s,t){let e=Re(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?xe(s):Cs(s)}function Cs(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function _l(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let i=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return i===t?r:`${xe(i)} ${r}`}function zo(s,t,e=1440){let n=No(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=n.filter(h=>h.kid===o.id),a=new Map;for(let h of r){if(h.state!=="upcoming")continue;let l=h.shows_from??h.due??s.today;a.set(l,[...a.get(l)??[],h])}let c=r.filter(h=>h.state==="overdue"),d=r.filter(h=>h.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??ce(i),overdue:c,now:d,done:r.filter(kt),later:[...a.entries()].sort(([h],[l])=>h.localeCompare(l)).map(([h,l])=>({date:h,chores:l})),left:c.length+d.length}})}function Ho(s,t=1440){return No(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today||Ps(e,s.today))).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function Ms(s){return!s.chores.length&&!s.templates.length}var rt=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Vt(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,i]=n.split("-").map(r=>rt.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function As(s){let t=[...new Set(s)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${rt[n[0]]}-${rt[n.at(-1)]}`]:n.map(o=>rt[o])).join(", ")}var at="none";function Yt(s){return s==="daily"||s==="school"?"":"Any"}function Uo(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1,points:null}}function Fo(s){let t=s.days??Yt(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only,points:s.points??null}}function Ls(s){return s.title.trim()?s.who.length?s.days===at?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function Wo(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{},points:s.points}}function Ds(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function Rs(s,t,e=1,n=!1,o=!1){if(s==="school"){let h=t.trim().replace(/-/g,"–"),l=o?h?`${h} Bring lunch days`:"Bring lunch days":h?`${h} school days`:"Every school day";return n?`${l}, the night before`:l}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,a=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(a))return e>1?`Every day, every ${e} weeks`:"Every day";if(!a||a.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${a.replace(/-/g,"–")} ${r}`;let d=`${a.split(",").map(h=>{let l=h.trim();return l.toLowerCase()==="last"?"the last day":/^\d+$/.test(l)?`the ${Ds(Number(l))}`:`the ${l}`}).join(" and ")} ${r}`;return d[0].toUpperCase()+d.slice(1)}function Is(s,t,e=!1){let n=s.map(i=>t.find(r=>r.id===i)?.name??i);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function Os(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function $t(s){if(Number.isInteger(s))return String(s);let t=Math.trunc(s);return Math.abs(Math.abs(s-t)-.5)<1e-9?`${s<0?"-":""}${Math.abs(t)||""}½`:String(Math.round(s*10)/10)}function Bs(s,t){return!!s?.points?.leaders.includes(t)}function Ko(s){let t=/\d+/.exec(s)?.[0];return t?Math.min(1e3,Number(t.slice(0,5))):null}function Cl(s){let t=Math.max(1,s.every??1),e=(s.days??Yt(s.repeats)).trim(),n;return s.repeats==="daily"?n=7/t:s.repeats==="monthly"?n=12/52/t:s.repeats==="school"?n=e?Vt(e)?.size??5:5:n=e===""||e.toLowerCase()==="any"?1/t:(Vt(e)?.size??1)/t,s.take_turns&&s.who.length>1?n/s.who.length:n}function Go(s,t,e=1){let n=Object.fromEntries(t.map(o=>[o,0]));for(let o of s){if(o.paused||o.problems.length)continue;let i=(o.points??e)*Cl(o);for(let r of o.who)r in n&&(n[r]=n[r]+i)}for(let o of t)n[o]=Math.round(n[o]*2)/2;return n}function Rn(s,t){return`${s}|${t}`}function Tt(s,t){let[e,n,o]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function In(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function Vo(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function qo(s,t){return In(t)<5&&!Vo(s,t)}function Xt(s,t,e=new Map){if(!qo(s,t))return null;let n=Rn(s.id,t);if(e.has(n)){let i=e.get(n);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[t];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function Et(s,t){return qo(s,t)?s.menus?.[t]??null:null}var Pl="From the school's menu feed.";function Sl(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==Pl);return t.length?t.join(`
`):null}function Be(s){return s.slice(0,7)}function On(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function Ns(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function Yo(s){let t=[];for(let e=Be(s.first);e<=Be(s.last);e=Ns(e))t.push(e);return t}function Xo(s,t,e,n=new Map){let o=`${e}-01`,i=Tt(o,-In(o)),r=[];for(;Be(i)<=e;){let a=[];for(let c=0;c<5;c++){let d=Tt(i,c),h=Be(d)!==e,l=h?null:Vo(t,d),u=h?null:Xt(t,d,n);a.push({date:d,day:Number(d.slice(8)),outside:h,off:l?l.title:null,lunch:u?.lunch??null,picked:u?.picked??!1,menu:h?null:Et(t,d)?.dish??null,sides:h?null:Sl(Et(t,d)?.details??""),past:d<s.today,today:d===s.today})}a.some(c=>!c.outside)&&r.push(a),i=Tt(i,7)}return r}function Jo(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function Zo(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function Qo(s,t,e,n=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=Tt(t,i),a=Xt(s,r,n);if(!a)continue;let c=Re(t,r);return{lunch:a.lunch,when:c===0?"today":c===1?"tomorrow":xe(r),date:r,menu:Et(s,r)?.dish??null}}return null}var Ml={timeline:"timeline",full:"timeline",compact:"compact"};function lt(s){let t=new URLSearchParams(s),e={},n=Ml[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((t.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((t.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}var Al=["auth_callback","code","state"];function js(s){let t=new URLSearchParams(s);for(let n of Al)t.delete(n);let e=t.toString();return e?`?${e}`:""}function zs(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Ll(s,t){let e=t.takes!=null&&t.planned!=null?t.planned+t.takes:t.end;if(t.attending===!1)return t.end;for(let n of s.rides)n.serves.includes(t.id)&&n.end!=null&&(e=Math.max(e,n.end));for(let n of Object.values(s.drivers))for(let o of n.segments)o.type==="home"||o.end==null||(o.serves===t.id||o.event===t.id)&&(e=Math.max(e,o.end));return e}function Dl(s,t){let e=[],n=[],o=()=>{let i=n[n.length-1];i&&zs(i.end)>t&&e.push(...n),n=[]};for(let i of s){if(i.start==null||i.end==null)continue;if(i.type==="home"||i.type==="stay"){o(),i.end>t&&e.push(i);continue}let r=n[n.length-1];r&&r.end!==i.start&&o(),n.push(i)}return o(),e}function Rl(s,t){let e=new Set(s.events.filter(i=>Ll(s,i)<=t).map(i=>i.id)),n=i=>zs(s.rides[i??-1]?.end,-1)<=t,o=i=>i.type==="act"?e.has(i.event??""):n(i.ride);return{...s,events:s.events.filter(i=>!e.has(i.id)),kids:Object.fromEntries(Object.entries(s.kids).map(([i,r])=>[i,{...r,items:r.items.filter(a=>!o(a))}])),drivers:Object.fromEntries(Object.entries(s.drivers).map(([i,r])=>[i,{...r,segments:Dl(r.segments,t),outings:r.outings.filter(a=>a.start==null||zs(a.end,a.start)>t),busy:r.busy.filter(a=>a.end>t)}])),clashes:s.clashes.filter(i=>!o(i.a)&&!o(i.b)),issues:s.issues.filter(i=>!i.event||!e.has(i.event)),done:e.size,from:t}}function er(s,t){return{...s,whole_week:s.whole_week??s.days,days:s.days.filter(e=>e.date>=t.date).map(e=>e.date===t.date?Rl(e,t.minutes):e)}}var tr=Qe`
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
  /* What's wrong, on one line across the bottom of the header. */
  .problem-row {
    flex: none;
    margin: -6px 0 0;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    font-size: 13px;
    line-height: 18px;
    font-weight: 600;
    color: var(--bad-ink);
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  button.problem-row {
    cursor: pointer;
  }
  .problem-row.open {
    white-space: normal;
  }
  .problem-age,
  .problem-more {
    font-weight: 500;
  }
  .problem-link {
    text-decoration: underline;
  }
  .problem-detail {
    display: block;
    font-weight: 500;
    color: var(--ink-2);
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
  .col-head .ch-text {
    flex: 1;
  }
  /* The second line: this week's count, and a kid's lunch tucked at the right. */
  .sub-row {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }
  .sub-row .sub {
    min-width: 0;
  }
  .sub-row .lunch-chip.small {
    margin-left: auto;
    height: 18px;
    font-size: 11.5px;
  }
  .sub-row .lunch-chip.small.icon {
    width: 22px;
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
  /* Over days at an address: tap it to say who's staying there. */
  button.strip-chip.maybe:hover,
  button.strip-chip.maybe:focus-visible {
    background: rgba(0, 0, 0, 0.05);
  }
  button.strip-chip.maybe::after {
    content: "›";
    align-self: center;
    margin-left: -2px;
    opacity: 0.45;
    font-size: 16px;
    font-weight: 800;
    line-height: 1;
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
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .toast-undo {
    flex: none;
    min-height: 36px;
    padding: 0 12px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 18px;
    background: transparent;
    color: #fff;
    font-weight: 700;
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
  .chore.skipped .chore-note {
    color: var(--muted);
    font-weight: 600;
  }
  .pts-flash {
    margin-left: auto;
    flex: none;
    font-size: 17px;
    font-weight: 800;
    color: var(--ok);
    animation: pts-rise 2.6s ease-out forwards;
  }
  @keyframes pts-rise {
    0% {
      opacity: 0;
      transform: translateY(6px) scale(0.9);
    }
    12% {
      opacity: 1;
      transform: none;
    }
    75% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-6px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .pts-flash {
      animation: none;
    }
  }
  .score {
    flex: none;
    font-size: 12.5px;
    line-height: 18px;
    font-weight: 700;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .score.lead {
    padding: 0 6px;
    border-radius: 999px;
    color: #7a4b00;
    background: linear-gradient(135deg, #fff3c4, #f7d774);
    box-shadow: 0 0 0 1px rgba(183, 121, 31, 0.35);
  }
  /* The kid leading on points: a gold name, a gold ring and a little crown. */
  .leader .name {
    background: linear-gradient(100deg, #a8660a 0%, #e0a91c 35%, #fff1a8 50%, #e0a91c 65%, #a8660a 100%);
    background-size: 250% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: leader-shine 6s ease-in-out infinite;
  }
  .leader .avatar {
    position: relative;
    overflow: visible;
    box-shadow:
      0 0 0 2px #fff,
      0 0 0 4px #e0a91c,
      0 0 10px rgba(224, 169, 28, 0.55);
  }
  .leader .avatar::after {
    content: "👑";
    position: absolute;
    top: -13px;
    right: -9px;
    font-size: 15px;
    line-height: 1;
    transform: rotate(18deg);
  }
  /* The rides board's heads sit at the very top of the scroller: keep the crown inside. */
  .col-head.leader .avatar::after {
    top: -9px;
    right: -11px;
  }
  @keyframes leader-shine {
    0%,
    70% {
      background-position: 100% 0;
    }
    100% {
      background-position: 0 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .leader .name {
      animation: none;
      background-position: 50% 0;
    }
  }
  .points-input {
    max-width: 120px;
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
  .week-points {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 14px;
    padding: 10px 14px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--surface);
  }
  .week-points-label {
    font-size: 13px;
    font-weight: 700;
    color: var(--muted);
    margin-right: 4px;
  }
  .week-kid {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 650;
  }
  .week-kid .avatar {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
  .week-kid strong {
    font-variant-numeric: tabular-nums;
    color: var(--c);
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
  .ed-for {
    flex-wrap: wrap;
  }
  /* The driver picks stay quiet (outlined, not a solid black block) so the kids lead the eye. */
  .ride-box > .choices .choice {
    min-height: 40px;
    font-weight: 600;
    color: var(--ink-2);
  }
  .ride-box > .choices .choice[aria-pressed="true"] {
    background: var(--control);
    border-color: var(--ink);
    box-shadow: inset 0 0 0 1px var(--ink);
    color: var(--ink);
    font-weight: 800;
  }
  /* A kid picked to ride along is filled in their own color. */
  .field-sub .who-chip[aria-pressed="true"] {
    background: var(--c);
    color: #fff;
  }
  .field-sub .who-chip[aria-pressed="true"] .avatar {
    background: #fff;
    color: var(--c);
  }
  /* Riders: the same colored chips as everywhere else, a size down to fit the driver box. */
  .field-sub .who-chip {
    min-height: 40px;
    padding: 0 12px 0 4px;
    gap: 6px;
    font-size: 14px;
  }
  .field-sub .who-chip .avatar {
    width: 30px;
    height: 30px;
    font-size: 13px;
  }
  /* Who the event is for, in their colors, so the kids stand out as much as the drivers. */
  .for-who {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 12px 3px 3px;
    border-radius: 16px;
    background: rgba(var(--rgb), 0.14);
    box-shadow: inset 0 0 0 1px rgba(var(--rgb), 0.5);
    color: var(--ink);
    font-size: 15px;
    font-weight: 800;
  }
  .for-who .avatar {
    width: 26px;
    height: 26px;
    font-size: 12px;
  }
  .for-guess {
    font-size: 12px;
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
`;function Il(s,t,e,n,o=14){let i=s.top-o-8,r=e.h-s.bottom-o-8,a=t.h<=i,c=t.h<=r,d=n?a||!c&&i>r:!c&&(a||i>r),h=d?s.top-o-t.h:s.bottom+o,l=Math.max(8,Math.min(h,e.h-8-t.h)),u=Math.max(8,Math.min(s.x-t.w/2,e.w-8-t.w));return{left:Math.round(u),top:Math.round(l),above:d}}function Jt(s,t){for(let e of s.composedPath()){if(e===t)break;if(e instanceof HTMLElement&&e.dataset.note)return e}return null}var Bn=class{constructor(t,e){this.tip=null;this.anchor=null;this.held=!1;this.hoverTimer=null;this.hideTimer=null;this.hoverAt={x:0,y:0};this.hoverEl=null;this.press=null;this.eatUntil=0;this.hide=()=>{this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting")),this.anchor=null,this.held=!1,this.tip?.classList.remove("on")};this.onHover=t=>{if(t.pointerType==="touch"||t.buttons)return;let e=t.composedPath().includes(this.host)?Jt(t,this.host):null;if(!e){this.clearHover(),this.laterHide();return}if(e===this.anchor){this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null;return}if(this.hoverAt={x:t.clientX,y:t.clientY},this.hoverEl!==e){if(this.anchor&&!this.held){this.show(e,this.pointAt(this.hoverAt),!1);return}this.clearHover(),this.hoverEl=e,this.hoverTimer=setTimeout(()=>{this.hoverTimer=null,this.hoverEl===e&&e.isConnected&&this.show(e,this.pointAt(this.hoverAt),!1)},400)}};this.onLeave=t=>{t.pointerType!=="touch"&&(this.clearHover(),this.held||this.hide())};this.onDown=t=>{if(this.eatUntil=0,this.endPress(),this.anchor&&this.hide(),this.clearHover(),t.pointerType!=="touch"||!t.isPrimary)return;let e=Jt(t,this.host);if(!e)return;let n={x:t.clientX,y:t.clientY},o=setTimeout(()=>{let i=this.press;!i||i.el!==e||!e.isConnected||(i.done=!0,this.show(e,{x:n.x,top:n.y,bottom:n.y},!0,36),this.held=!0)},500);this.press={id:t.pointerId,x:n.x,y:n.y,el:e,timer:o,done:!1}};this.onMove=t=>{let e=this.press;e&&t.pointerId===e.id&&!e.done&&Math.hypot(t.clientX-e.x,t.clientY-e.y)>10&&this.endPress()};this.onUp=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done&&(this.eatUntil=performance.now()+700),this.endPress())};this.onCancel=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done?(this.endPress(),this.hide()):this.endPress())};this.onClick=t=>{if(!this.eatUntil)return;let e=performance.now()<this.eatUntil;this.eatUntil=0,e&&(t.stopPropagation(),t.preventDefault())};this.onContextMenu=t=>{let e=t.pointerType==="touch";(this.press||this.held&&this.anchor||e&&Jt(t,this.host))&&t.preventDefault()};this.onFocusIn=t=>{let e=Jt(t,this.host);if(!e||!e.matches(":focus-visible"))return;let n=e.getBoundingClientRect();this.show(e,{x:n.left+Math.min(n.width/2,120),top:n.top,bottom:n.bottom},!1,8)};this.onFocusOut=t=>{this.anchor&&Jt(t,this.host)===this.anchor&&!this.held&&this.hide()};this.onKey=t=>{t.key!=="Escape"||!this.anchor||(this.hide(),t.stopImmediatePropagation())};this.host=t,this.root=e}connect(){let t=this.host;window.addEventListener("pointermove",this.onHover,{passive:!0}),document.documentElement.addEventListener("pointerleave",this.onLeave),t.addEventListener("pointerdown",this.onDown,{capture:!0}),t.addEventListener("pointermove",this.onMove,{capture:!0,passive:!0}),t.addEventListener("pointerup",this.onUp,{capture:!0}),t.addEventListener("pointercancel",this.onCancel,{capture:!0}),t.addEventListener("click",this.onClick,{capture:!0}),t.addEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.addEventListener("wheel",this.hide,{passive:!0}),t.addEventListener("focusin",this.onFocusIn),t.addEventListener("focusout",this.onFocusOut),t.addEventListener("keydown",this.onKey,{capture:!0}),window.addEventListener("resize",this.hide),window.addEventListener("blur",this.hide)}disconnect(){let t=this.host;window.removeEventListener("pointermove",this.onHover),document.documentElement.removeEventListener("pointerleave",this.onLeave),t.removeEventListener("pointerdown",this.onDown,{capture:!0}),t.removeEventListener("pointermove",this.onMove,{capture:!0}),t.removeEventListener("pointerup",this.onUp,{capture:!0}),t.removeEventListener("pointercancel",this.onCancel,{capture:!0}),t.removeEventListener("click",this.onClick,{capture:!0}),t.removeEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.removeEventListener("wheel",this.hide),t.removeEventListener("focusin",this.onFocusIn),t.removeEventListener("focusout",this.onFocusOut),t.removeEventListener("keydown",this.onKey,{capture:!0}),window.removeEventListener("resize",this.hide),window.removeEventListener("blur",this.hide),this.endPress(),this.hide()}get shown(){return this.anchor!==null}sync(){let t=this.anchor;t&&(!t.isConnected||!t.dataset.note?this.hide():this.tip&&this.tip.textContent!==t.dataset.note&&(this.tip.textContent=t.dataset.note))}ensureTip(){if(this.tip?.isConnected)return this.tip;let t=document.createElement("div");return t.className="note-tip",t.id="note-tip",t.setAttribute("role","tooltip"),this.root.appendChild(t),this.tip=t,t}show(t,e,n,o){let i=t.dataset.note;if(!i)return;this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&this.anchor!==t&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting"));let r=this.ensureTip();r.textContent=i,r.classList.remove("on"),r.style.left="0px",r.style.top="0px";let a={w:r.offsetWidth,h:r.offsetHeight},c={w:window.innerWidth,h:window.innerHeight},d=Il(e,a,c,n,o);r.style.left=`${d.left}px`,r.style.top=`${d.top}px`,r.classList.toggle("above",d.above),r.classList.add("on"),t.setAttribute("aria-describedby",r.id),t.classList.add("noting"),this.anchor=t}clearHover(){this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=null,this.hoverEl=null}laterHide(){this.hideTimer||!this.anchor||this.held||(this.hideTimer=setTimeout(()=>{this.hideTimer=null,this.hide()},120))}pointAt(t){return{x:t.x,top:t.y-4,bottom:t.y+10}}endPress(){this.press&&clearTimeout(this.press.timer),this.press=null}};(()=>{if(typeof document>"u")return;let s=null,t=new Map;Po((e,n)=>{let o=`${n}|${e}`,i=t.get(o);if(i!==void 0)return i;if(!s){if(!document.body)return null;s=document.createElement("span"),s.setAttribute("aria-hidden","true"),s.style.cssText="position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none;white-space:pre;letter-spacing:normal;word-spacing:normal;text-transform:none;contain:layout style",document.body.appendChild(s)}return s.style.font=n,s.style.font?(s.style.fontVariantNumeric="tabular-nums",s.textContent=e,i=s.getBoundingClientRect().width,t.size>2e4&&t.clear(),t.set(o,i),i):null})})();var Hr="mydashlight.rides.view",pd=1100,fd=440,gd=700,md=3*6e4,Or=1200,bd=450,vd=110;function yd(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var Gn=le`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,Br=le`<svg class="note-mark" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M5 3h10l4 4v14H5zM9 11h6M9 15h6"/></svg>`,Nr=le`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,xd=new URL("emoji.json",import.meta.url).href,jr=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],ri=le`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,ai=le`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,wd=le`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,kd=le`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,en={bring:"Bring",buy:"Buy"};function $d(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function Ee(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function li(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Td(s,t){return Es(s,t)||Le(s).split(",")[0]}function Ed(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function _d(){try{return localStorage.getItem(Hr)==="timeline"?"timeline":"compact"}catch{return"compact"}}function Cd(s){try{localStorage.setItem(Hr,s)}catch{}}function Vn(s,t){return re(s).includes(t)?ue(s,t):be(s,t)}function Pd(s,t){if(t.driver==="none")return{driver:"none",riders:[],backRiders:[]};let e=Ur(s,t),n=c=>(c??[]).filter(d=>t.people.includes(d)&&d!==e),o=n(t.ownWay),i=n(t.ownBack),r=t.people.find(c=>re(s).includes(c));if(!e||e===r&&!o.length&&!i.length)return{driver:"",riders:[],backRiders:[]};let a=c=>t.people.filter(d=>d!==e&&!c.includes(d));return{driver:e,riders:a(o),backRiders:a(i)}}function Ur(s,t){if(t.driver==="none")return null;let e=re(s).filter(o=>t.people.includes(o)),n=t.people.filter(o=>e.includes(o));return t.driver&&n.includes(t.driver)?t.driver:n[0]??null}function tn(s){return s.days.every(t=>!t.events.length)}var nn=class extends Se{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.toastUndo=null;this.arriveTimer=null;this.leaveTimer=null;this.holdTimer=null;this.holdRepeat=null;this.held=!1;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.noteTip=null;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=lt(location.search).view;this.urlPage=lt(location.search).page;this.urlPast=lt(location.search).past;this.urlDayPicker=lt(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.noteTip?.hide(),this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,i=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(i)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging"),this.noteTip?.hide()}this.onTouched(),n.el.scrollTop=n.top-i,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.noteTip?.hide(),this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},md))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor||this.forPick?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.problemOpen=!1,this.mode=this.urlView??_d(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1},this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.pointsFlash=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null,this.forPick=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.noteTip??=new Bn(this,this.renderRoot),this.noteTip.connect(),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.leaveTimer,this.railTimer])e&&clearTimeout(e);this.stopHold(),this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey),this.noteTip?.disconnect()}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){this.noteTip?.sync();let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,a]=o.split("|"),c=e.kids.find(d=>d.id===r);(!c||(c.picks[a]??null)===i||!Xt(c,a))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores){let i=n.get(o.id);i===void 0||!zr(o,i)||(n.delete(o.id),i===!0&&o.earned&&this.flashPoints(o.id,o.earned))}for(let o of n.keys())e.chores.some(i=>i.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=Lo(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<pd)return!1;let e=this.plan;return!e||this.width-fd>=ws(we(e).length,re(e).length)}today(){return Rt(this.plan?.time_zone??yd())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let n=this.today(),o=`${n.date}|${n.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:er(e,n)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let i=this.board,r=this.boardPlan;this.board=Ao(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o,i&&r&&this.keepPlace(i,r,e)}return this.board}keepPlace(e,n,o){let i=this.scroller;if(!i||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||i.scrollTop<=0)return;let r=e.dayHeads.find(h=>h.date===this.pinDay)?.h??Kt,a=$s(e,i.scrollTop+r+4),c=n.days[Math.floor(a/1440)]?.date,d=c?o.days.findIndex(h=>h.date===c):-1;d>=0&&(this.keepAt=d*1440+(a-Math.floor(a/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n,o=!1){let i=this.scroller;if(!i||!this.board)return;let r=this.topFor(e,n);Math.abs(i.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?i.scrollTo({top:r,behavior:"smooth"}):i.scrollTop=r),this.syncDay()}topFor(e,n){let o=this.board,i=o.dayHeads.find(r=>r.date===n)?.y??0;return Math.max(i,Co(o,e)-$o(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let n=this.today(),o=Math.max(0,this.dayIndexOf(n.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(n.date)?n.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let n=this.nowSpot();n&&this.scrollToTime(n.t,n.date,e)}goToDay(e,n=!1){let o=this.boardPlan;if(!o)return;let i=this.today();if(e===i.date){this.scrollToNow(n);return}let r=this.dayIndexOf(e),a=o.days[r];if(!a)return;let c=1/0;if(this.mode==="timeline"){for(let d of a.events)c=Math.min(c,d.arrive_by??d.start);for(let d of Object.values(a.drivers))for(let h of d.outings)h.start!=null&&(c=Math.min(c,h.start))}this.scrollToTime(r*1440+(Number.isFinite(c)?Math.max(0,c-30):0),e,n)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let c of this.board.dayHeads)c.y<=n+1&&(o=c);this.pinDay!==o.date&&(this.pinDay=o.date);let i=null,r=this.nowSpot(),a=this.today().date;if(r){let c=n-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),d=c>0?"up":"down";this.board.dayHeads.some(h=>h.date===a)&&o.date!==a?i=`${d}|Today`:this.mode==="timeline"&&Math.abs(c)>e.clientHeight*.6&&(i=`${d}|${o.date===a?"Now":"Today"}`)}this.away!==i&&(this.away=i)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n,o){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let i=o!==void 0||!this.choreDone(e),r=new Map(this.choreDraft);r.set(e.id,o??i),this.choreDraft=r;try{await this.backend.setChoreDone(e.id,i,n&&n!==e.kid?n:void 0,o)}catch(a){let c=new Map(this.choreDraft);c.delete(e.id),this.choreDraft=c;let d=a instanceof oe?a:new oe("error",String(a));this.showToast(d.code==="preview"?d.message:`Couldn’t save that. ${d.message}`)}}flashPoints(e,n){this.pointsFlash=new Map(this.pointsFlash).set(e,n),window.setTimeout(()=>{if(this.pointsFlash.get(e)!==n)return;let o=new Map(this.pointsFlash);o.delete(e),this.pointsFlash=o},2600)}renderScore(e){let n=this.chores?.points,o=n?.scores[e];if(!n||o===void 0)return $;let i=n.leaders.includes(e),r=$t(o),a=`${r} ${o===1?"point":"points"} in the last ${n.days} days${i?", the most":""}`;return f`<span class="score ${i?"lead":""}" role="img" aria-label=${a} title=${a}>${i?"★ ":""}${r}</span>`}choreDone(e){let n=this.choreDraft.get(e.id);return n===void 0?kt(e):n!==!1}editMenu(e,n){let o=this.lunch?.kids??[],i=Et(e,n),r=o.filter(a=>a.id===e.id||i&&Et(a,n)?.dish===i.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let i=o instanceof oe?o:new oe("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let i=new Map(this.lunchDraft);for(let r of n)i.set(Rn(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,n,o)}catch(r){let a=new Map(this.lunchDraft);for(let d of n)a.delete(Rn(e,d));this.lunchDraft=a;let c=r instanceof oe?r:new oe("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?Fo(e):Uo(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.forPick=null,this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(Ir(),Rr))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||Ls(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(Wo(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof oe?n:new oe("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof oe?n:new oe("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(i=>i.date===this.pinDay)?.h??Kt;this.keepAt=n&&this.board?$s(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||Cd(e)}findUnplaced(e,n){return this.plan?.days.find(o=>o.date===e)?.unplaced?.find(o=>o.id===n)??null}openForPick(e,n){let o=this.findUnplaced(e,n),i=this.plan;if(!o||!i)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...we(i),...re(i)]);this.forPick={day:e,id:n,placed:!1,label:`${U(o.at)} ${o.title}`,recurring:!!o.recurring,word:o.reason==="unknown"?o.word:null,fromNotes:!!o.from_notes,people:o.people.filter(a=>r.has(a)),scope:"this",busy:!1}}openStayPick(e,n){let o=this.plan,i=o?.days.find(c=>c.date===e)?.all_day?.find(c=>c.id===n);if(!o||!i)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...we(o),...re(o)]),a=c=>i.driver&&i.driver!=="none"?i.people.filter(d=>r.has(d)&&d!==i.driver&&!(c??[]).includes(d)):[];this.forPick={day:e,id:n,placed:!1,label:`🏨 ${i.title}`,recurring:!1,word:null,fromNotes:!!i.from_notes,people:i.people.filter(c=>r.has(c)),scope:"this",busy:!1,stay:!0,timed:!!i.timed,driver:i.driver==="none"||re(o).includes(i.driver??"")?i.driver??"":"",ownWay:a(i.riders),ownBack:a(i.back_riders??i.riders),noAddress:!!i.no_address,maybe:!i.stay}}changeForPick(e,n,o){let i=e.who?.[o.event_id],r=i?.people??[o.own??o.kid];this.closeEditor(),this.forPick={day:n.date,id:o.id,placed:!0,label:`${U(o.start)} ${o.title}`,recurring:o.recurring,word:null,fromNotes:!!i?.from_notes,people:r,scope:"this",busy:!1}}async saveForPick(e="save"){let n=this.forPick,o=this.plan,i=this.backend;if(!n||!o||!i||e==="save"&&!n.people.length)return;let r=e==="clear"?[]:n.people;this.forPick={...n,busy:!0};try{e==="notStay"?await i.setPeople(n.id,null,"this",void 0,!1):await i.setPeople(n.id,r,n.scope,n.stay&&n.timed&&e==="save"?Pd(o,n):void 0,n.maybe&&e==="save"?!0:void 0),this.forPick=null;let a=n.label.replace(/^\S+ /,""),c=r.map(h=>Vn(o,h)),d=re(o).filter(h=>r.includes(h));this.showToast(e==="notStay"?`Saved. ${a} isn’t a stay now.`:e==="clear"?`Saved. ${a} goes by the names in its title again.`:n.stay?`Saved. ${wt(d.map(h=>ue(o,h)))}’s rides start from ${a} now.`:`Saved. ${a} is in ${wt(c)}’s ${c.length>1?"lanes":"lane"} now.`,e==="notStay"?()=>void i.setPeople(n.id,null,"this",void 0,null).catch(h=>this.showToast(`Couldn’t undo that. ${String(h)}`)):null)}catch(a){this.forPick&&(this.forPick={...this.forPick,busy:!1});let c=a instanceof oe?a:new oe("error",String(a));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}renderForPick(e){let n=this.plan,o=e.stay?n?.days.some(P=>P.date===e.day&&P.all_day?.some(N=>N.id===e.id&&(N.stay||N.can_stay))):e.placed?n?.days.some(P=>P.date===e.day&&P.events.some(N=>N.id===e.id)):!!this.findUnplaced(e.day,e.id),i=e.stay?"Who’s staying?":"Who is this for?",r=f`<button type="button" class="btn" ?disabled=${e.busy} @click=${()=>this.closeChorePanels()}>Cancel</button>`;if(!n||!o&&!e.busy)return f`<div class="ed-head">
          <div class="ed-titles"><span class="ed-title">${i}</span></div>
          ${r}
        </div>
        <p class="field-hint">This event is sorted now: someone changed it in Google Calendar, or it’s over.</p>`;let a=e.busy,c=P=>{this.forPick&&(this.forPick={...this.forPick,...P})},d=P=>c({people:e.people.includes(P)?e.people.filter(N=>N!==P):[...e.people,P]}),h=ve(n),l=we(n),u=l.length>1&&l.every(P=>e.people.includes(P)),y=[...l,...re(n)].filter(P=>e.people.includes(P)),m=y.map(P=>Vn(n,P)),w=!!e.stay&&!y.some(P=>re(n).includes(P)),M=m.length<2?m.join(""):`${m.slice(0,-1).join(", ")} & ${m[m.length-1]}`,g=(P,N,K,se)=>f`<button
      type="button"
      class="who-chip"
      style="--c:${K.color};--rgb:${K.rgb}"
      aria-pressed=${e.people.includes(P)?"true":"false"}
      ?disabled=${a}
      @click=${()=>d(P)}
    >
      <span class="avatar ${se?"driver":""}" aria-hidden="true">${Ee(N)}</span>${N}
    </button>`;return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${i}</span>
          <span class="ed-meta">${Le(e.day)} · ${e.label}</span>
        </div>
        ${r}
      </div>
      ${e.word?f`<p class="field-hint">“${e.word}” isn’t anyone in the family. Pick who it’s for instead.</p>`:!e.stay&&!e.fromNotes&&e.people.length?f`<p class="field-hint">Guessed from the names at the start of the title.</p>`:$}
      ${e.recurring?f`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${e.scope==="this"?"true":"false"} ?disabled=${a} @click=${()=>c({scope:"this"})}>
                Just ${xe(e.day)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${e.scope==="series"?"true":"false"} ?disabled=${a} @click=${()=>c({scope:"series"})}>
                Every time
              </button>
            </div>
          </div>`:$}
      <div class="field">
        <span class="field-label">Kids</span>
        <div role="group" aria-label="Kids it’s for" class="who-chips">
          ${l.map(P=>g(P,be(n,P),h.get(P)??ce(0),!1))}
        </div>
        ${l.length>1?f`<button
              type="button"
              class="chip all-kids"
              aria-pressed=${u?"true":"false"}
              ?disabled=${a}
              @click=${()=>c({people:u?e.people.filter(P=>!l.includes(P)):[...l,...e.people.filter(P=>!l.includes(P))]})}
            >
              All the kids
            </button>`:$}
      </div>
      <div class="field">
        <span class="field-label">Parents</span>
        <div role="group" aria-label="Parents it’s for" class="who-chips">
          ${re(n).map(P=>g(P,ue(n,P),Fe,!0))}
        </div>
      </div>
      ${e.stay&&e.timed&&!w?this.renderStayDrive(n,e,c):$}
      <p class="field-hint">
        ${e.stay?f`${e.timed?f`Rides for the parents you pick start and end at ${e.label.replace(/^\S+ /,"")} while they’re there. Pick the kids
                  going too, so they’re in the car on the drive.`:f`Rides for the parents you pick start and end at ${e.label.replace(/^\S+ /,"")} on every day of the stay. The kids
                  go wherever their driver goes, so picking just the parents is enough.`}${y.length?f` Saved in the event’s notes as <strong>For: ${M}</strong>.`:$}`:y.length?f`Saved in the event’s notes as <strong>For: ${M}</strong>, so its title stays as it is. It shows in ${y.length>1?"their lanes":`${m[0]}’s lane`}${y.some(P=>l.includes(P))?", and rides are planned for the kids":""}.`:"Saved in the event’s notes, so its title stays as it is."}
      </p>
      ${e.fromNotes?f`<button type="button" class="chip clear" ?disabled=${a} @click=${()=>void this.saveForPick("clear")}>
            Go by the names in the title instead
          </button>`:$}
      ${e.stay&&!e.maybe?f`<button type="button" class="chip clear" ?disabled=${a} @click=${()=>void this.saveForPick("notStay")}>Not a stay</button>`:$}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${a||!y.length||w} @click=${()=>void this.saveForPick()}>
          ${a?"Saving to Google Calendar…":w?"Pick a parent too":y.length?"Save":"Pick who it’s for"}
        </button>
      </div>
    `}renderStayDrive(e,n,o){let i=n.people.filter(l=>re(e).includes(l)),r=Ur(e,n),a=n.people.filter(l=>l!==r),c=ve(e),d=we(e),h=(l,u)=>{let b=n[u]??[],y=!d.includes(l),m=y?Fe:c.get(l)??ce(0),w=Vn(e,l);return f`<button
        type="button"
        class="who-chip"
        style="--c:${m.color};--rgb:${m.rgb}"
        aria-pressed=${b.includes(l)?"false":"true"}
        ?disabled=${n.busy}
        @click=${()=>o({[u]:b.includes(l)?b.filter(M=>M!==l):[...b,l]})}
      >
        <span class="avatar ${y?"driver":""}" aria-hidden="true">${Ee(w)}</span>${w}
      </button>`};return f`<div class="field">
        <span class="field-label">Drives there and back</span>
        <div role="group" aria-label="Who drives there and back" class="choices" style="grid-template-columns:repeat(${i.length+1},1fr)">
          ${i.map(l=>f`<button type="button" class="choice" aria-pressed=${r===l?"true":"false"} ?disabled=${n.busy} @click=${()=>o({driver:l})}>
              ${ue(e,l)}
            </button>`)}
          <button type="button" class="choice" aria-pressed=${r===null?"true":"false"} ?disabled=${n.busy} @click=${()=>o({driver:"none"})}>
            No drive
          </button>
        </div>
      </div>
      ${r&&a.length?f`<div class="field">
              <span class="field-label">In the car there with ${ue(e,r)}</span>
              <div role="group" aria-label="Who rides there" class="who-chips">${a.map(l=>h(l,"ownWay"))}</div>
            </div>
            <div class="field">
              <span class="field-label">In the car back home</span>
              <div role="group" aria-label="Who rides back" class="who-chips">${a.map(l=>h(l,"ownBack"))}</div>
              <p class="field-hint">Anyone not in the car makes their own way, and the hotel is home for them while it lasts.</p>
            </div>`:$}
      ${n.noAddress?f`<p class="field-hint">Add the hotel’s address to the event for exact drive times.</p>`:$}`}renderForLine(e,n,o){let i=e.who?.[o.event_id];if(!i)return $;let r=ve(e);return f`<span class="ed-for"
      >${i.people.map(a=>{let c=r.get(a)??Fe,d=Vn(e,a);return f`<span class="for-who" style="--c:${c.color};--rgb:${c.rgb}"
          ><span class="avatar ${r.has(a)?"":"driver"}" aria-hidden="true">${Ee(d)}</span>${d}</span
        >`})}${i.from_notes?"":f`<span class="for-guess">from the title</span>`}<button
        type="button"
        class="ed-for-change"
        @click=${()=>this.changeForPick(e,n,o)}
      >
        Change
      </button></span
    >`}findEvent(e){let n=this.plan?.days.find(i=>i.date===e.day),o=n?.events.find(i=>i.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.flushLeave(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1},n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.flushLeave(),this.sel=null,this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1}}showToast(e,n=null){this.toast=e,this.toastUndo=n,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null,this.toastUndo=null},n?1e4:7e3)}undoToast(){let e=this.toastUndo;this.toast=null,this.toastUndo=null,this.toastTimer&&clearTimeout(this.toastTimer),e?.()}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(i){let r=i instanceof oe?i:new oe("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o,i){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&i.includes(e.drop)){i.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope,!1));return}this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend,i=this.plan,r=!n&&i?Eo(i,e):null;if(r&&i){let a=Gt(i,e),c=i.who?.[e.event_id]?.people??[],d=this.findAnyCopy(e,r);this.save("attending",n,async()=>{await o.setPeople(e.id,r,"this"),this.closeEditor(),this.showToast(`Saved. ${a} is off ${e.title} now.`,d?()=>void this.save("attending",!0,()=>o.setPeople(d,c,"this")):null)});return}this.save("attending",n,()=>o.setAttending(e.id,n,"this"))}findAnyCopy(e,n){return this.plan?.days.find(r=>r.events.some(a=>a.id===e.id))?.events.find(r=>r.event_id===e.event_id&&r.id!==e.id&&n.includes(r.own??r.kid))?.id??null}toggleStay(e,n,o){if(!this.backend)return;let i=this.backend;if(n&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>i.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",n,()=>i.setStay(e.id,n,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,a=r.includes(n)?r.filter(c=>c!==n):[...r,n];this.save(`along-${o}`,a,()=>i.setTakeAlong(e.id,a,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let i=((this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by)??e.start)+n;this.arriveDraft=i===e.start?null:i,this.timesOpen={...this.timesOpen,arrive:!0},this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Or)}clearArrive(){this.arriveDraft=null,this.timesOpen={...this.timesOpen,arrive:!1},this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,a)).then(()=>{this.arriveDraft=void 0})}nudgeLeave(e,n){let o=this.leaveDraft!==void 0?this.leaveDraft:e.leave_by??null,i=Math.max(e.start+5,(o??e.end)+n);this.leaveDraft=i===e.end?null:i,this.timesOpen={...this.timesOpen,leave:!0},this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=setTimeout(()=>this.flushLeave(),Or)}clearLeave(){this.leaveDraft=null,this.timesOpen={...this.timesOpen,leave:!1},this.flushLeave()}flushLeave(){this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=null;let e=this.leaveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||(o.event.leave_by??null)===e){this.leaveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("leave",e,()=>i.setLeaveBy(r,e,a)).then(()=>{this.leaveDraft=void 0})}startHold(e){this.stopHold(),this.held=!1,this.holdTimer=setTimeout(()=>{this.held=!0,e(),this.holdRepeat=setInterval(e,vd)},bd)}stopHold(){this.holdTimer&&clearTimeout(this.holdTimer),this.holdRepeat&&clearInterval(this.holdRepeat),this.holdTimer=this.holdRepeat=null}tapStep(e){this.held?this.held=!1:e()}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=this.shownPlan(),i=o?Do(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?Ho(this.chores,this.today().minutes).filter(u=>!this.choreDone(u)):[],c=this.forPick?this.renderForPick(this.forPick):this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,d=this.forPick?"Who is this for?":this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",h=f`<aside class="panel" aria-label=${d}>
      ${c??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,a))}
    </aside>`,l=this.page==="rides";return f`
      <div class="app ${r?"wide":this.width<gd?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${l?this.renderBanner(e):$}
          <main>
            ${l?f`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?tn(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                  ${n&&o&&!tn(o)?this.renderDayRail(o):$}
                  ${n&&this.away?this.renderBackToToday(this.away):$}
                </section>`:this.page==="lunch"?f`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:f`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit||this.forPick)?f`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${h}`:$}
          </main>
        </div>
        ${r?h:$}
        ${this.toast?f`<div class="toast" role="status">
              ${this.toast}${this.toastUndo?f`<button type="button" class="toast-undo" @click=${()=>this.undoToast()}>Undo</button>`:$}
            </div>`:$}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let i=n.problems+o;this.tick;let r=this.today(),a="",c=null;if(e){let b=e.time_zone,y=`Plan from ${es(new Date(e.updated),new Date,b)}`;if(this.error){let m=["connection_lost","timeout","not_running"].includes(this.error.code);c={short:Bi(this.error),detail:m?null:this.error.message,age:y}}else e.status&&!e.status.ok?c={...Ni(e.status.error),age:y}:this.backend?.live||(a=`Updated ${es(new Date(e.updated),new Date,b)}`)}let d=(b,y,m,w)=>f`
      <button type="button" class="seg-btn" title=${w} aria-pressed=${this.mode===b?"true":"false"} @click=${()=>this.setMode(b)}>
        ${m}<span class="seg-label">${y}</span>
      </button>
    `,h=(b,y,m)=>f`
      <button type="button" class="seg-btn" aria-pressed=${this.page===b?"true":"false"} @click=${()=>this.setPage(b)}>
        ${m}<span class="seg-label">${y}</span>
      </button>
    `,l=je(r.minutes),u=!!e&&tn(e);return f`
      <header>
        ${this.showMenu?f`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${le`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:$}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Le(r.date)}, ${l}`}>
            <span class="hm">${l.slice(0,-3)}</span><span class="ampm">${l.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${Le(r.date)}${a?f`<span class="status"> · ${a}</span>`:$}
          </p>
        </div>
        ${e&&!u?this.renderNext(e,Io(e,r),n):$}
        <div class="controls">
          ${this.wide||u&&!o?$:f`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?$:f`<div role="group" aria-label="View" class="seg">
            ${d("timeline","Timeline",le`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${d("compact","Compact",le`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${h("rides","Rides",le`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${h("chores","Chores",le`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?$:h("lunch","Lunch",le`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
      ${c?this.renderProblem(c):$}
    `}renderProblem(e){let n=f`<span class="problem-what">${e.short}</span><span class="problem-age"> · ${e.age}</span>`;if(!e.detail)return f`<p class="problem-row" role="status">${n}</p>`;let o=this.problemOpen;return f`<button
      type="button"
      class="problem-row ${o?"open":""}"
      role="status"
      title=${e.detail}
      aria-expanded=${o?"true":"false"}
      @click=${()=>this.problemOpen=!o}
    >
      ${n}${o?f`<span class="problem-detail">${e.detail}</span>`:f`<span class="problem-more"> · <span class="problem-link">Details</span></span>`}
    </button>`}renderNext(e,n,o){if(!n){let d=this.today().date,h=o.unassigned,l=o.laterUnassigned;if(h){let b=f`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${h} ${h===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?f`<div class="next idle needs">${b}</div>`:f`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${b}</button>`}if(l)return f`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${l} ${l===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let u=e.days.some(b=>b.date>=d&&b.events.length);return f`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${u?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${u?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let i;n.ongoing?i="On the road now":n.ahead===0?i=n.inMinutes<180?`Next trip · in ${mt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${xe(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,a=f`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Ee(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(d=>f`<span class="kid-dot" style="background:${d.color}"></span>`)}</span>
        ${n.warn?f`<span class="next-stop warn">${n.warn}</span>`:n.stop?f`<span class="next-stop">${n.stop}</span>`:$}
      </span>
    `,c=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?f`<button type="button" class=${c} @click=${()=>this.open(n.target)}>${a}</button>`:f`<div class=${c}>${a}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return $;let n=this.today().date,o=ve(e),i=this.railShown;return f`<div
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
        ${e.days.map(r=>{let a=Ts(r),c=r.events.length,d=r.events.slice(0,4).map(l=>l.own?Fe.color:o.get(l.kid)?.color??ce(0).color),h=`${Le(r.date)}: ${c?`${c} ${c===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return f`<button
            type="button"
            class="rail-day ${r.date===n?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${h}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===n?"Today":xe(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${d.length?d.map(l=>f`<span class="rd-dot" style="background:${l}"></span>`):f`<span class="rd-free">free</span>`}
            </span>
            ${a?f`<span class="rd-badge" aria-hidden="true">${a}</span>`:$}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[n,o]=e.split("|");return f`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${le`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${n==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let n=we(e),o=re(e),i=ve(e),r=n.map(a=>be(e,a));return f`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((a,c)=>le`<circle cx=${50+c*30} cy="80" r="11" fill=${i.get(a).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Ed(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(a=>{let c=i.get(a);return f`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${Ee(be(e,a))}</span>
            <span class="qw-name">${be(e,a)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(a=>f`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Ee(ue(e,a))}</span>
            <span class="qw-name">${ue(e,a)}</span>
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
    </div>`:$}renderEmpty(){return this.error?f`<div class="empty-state">
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
          <span class="label">${e.label}</span>${e.tag?f`<span class="tag">${e.tag}</span>`:$}
        </button>
        <span class="sub ${e.warn?"warn":""}">${e.sub}</span>
        ${e.inline?f`<div class="dh-chips">${e.allDay.slice(0,e.inline).map(o=>this.renderStripChip(e,o,n))}</div>`:$}
      </div>
      ${e.allDay.length>e.inline?f`<div class="day-strip" style="padding-left:${xt}px">
            ${e.allDay.slice(e.inline).map(o=>this.renderStripChip(e,o,n))}
          </div>`:$}`}renderStripChip(e,n,o){let i=f`<span class="strip-title">${n.title}</span>${n.note?f`<span class="strip-note">${n.note}</span>`:$}${n.notes?Br:$}`,r=n.pick,a=n.stay??n.canStay;return a?f`<button
        type="button"
        class="strip-chip ${n.stay?"hotel":"maybe"} ${n.cancelled?"skipped":""} ${n.color?"":"plain"} ${n.notes?"noted":""}"
        style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
        tabindex=${o?-1:0}
        data-note=${n.notes||$}
        aria-label=${`${n.title}: ${n.note}. ${n.stay?"Pick who’s staying":"Staying here? Pick who"}`}
        @click=${()=>this.openStayPick(e.date,a)}
      >
        ${i}
      </button>`:r?f`<button
          type="button"
          class="strip-chip warn plain pick"
          tabindex=${o?-1:0}
          data-note=${n.notes||$}
          aria-label=${`${n.title}: ${n.note} Pick who it’s for`}
          @click=${()=>this.openForPick(e.date,r)}
        >
          ${i}
        </button>`:f`<span
          class="strip-chip ${n.warn?"warn":""} ${n.cancelled?"skipped":""} ${n.color?"":"plain"} ${n.notes?"noted":""}"
          style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
          tabindex=${n.notes&&!o?0:$}
          data-note=${n.notes||$}
          >${i}</span
        >`}renderBoard(e){let n=this.sel,o=n?this.findEvent(n):null,i=new Set(o?o.event.own?[o.event.id]:o.day.events.filter(l=>!l.own&&l.event_id===o.event.event_id).map(l=>l.id):[]),r=l=>!!l&&!!n&&l.day===n.day&&i.has(l.event),a=e.dayHeads.find(l=>l.date===this.pinDay)??e.dayHeads[0],c=e.width,d=100,h=[...e.links.map(l=>({t:"link",x:l,z:l.layer??0})),...e.preps.map(l=>({t:"prep",x:l,z:l.layer??d-1})),...e.cards.map(l=>({t:"card",x:l,z:l.layer??d})),...e.rides.map(l=>({t:"ride",x:l,z:l.layer??d+1}))].sort((l,u)=>l.z-u.z);return f`
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
          ${e.columns.map(l=>f`<div class="col-head ${l.kind} ${Bs(this.chores,l.id)?"leader":""}" style="left:${l.x}px;width:${l.w}px;--c:${l.dot};--rgb:${l.rgb}">
              <span class="avatar ${l.kind}" aria-hidden="true">${Ee(l.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${l.name}</span>${this.renderScore(l.id)}</span>
                <span class="sub-row"
                  ><span class="sub ${l.subWarn?"warn":""}">${l.sub}</span>${l.kind==="kid"?this.renderLunchChip(l.id,!0,l.w-64-Math.min(l.sub.length,12)*6.4):$}</span
                >
              </span>
            </div>`)}
        </div>
        ${a?f`<div class="pinned" aria-hidden="true" style="width:${c}px;height:${a.h}px;margin-bottom:${-a.h}px">
              ${this.renderHead(a,!0)}
            </div>`:$}
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
          ${Ie(e.bands,l=>l.key,l=>f`<div
                class="band"
                aria-hidden="true"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;background:rgba(${l.color.rgb},0.10);border-color:rgba(${l.color.rgb},0.45)"
              ></div>`)}
          ${Ie(e.busy,l=>l.key,l=>f`<div class="busy" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span style="top:${l.labelY}px">${l.label}</span>
              </div>`)}
          ${Ie(e.windows,l=>l.key,l=>f`<div class="window" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span>${l.label}</span>
              </div>`)}
          ${Ie(h,l=>l.x.key,l=>{if(l.t==="link"){let m=l.x;return f`<div
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
                  <span class="l1">${m.l1}</span>${m.show2?f`<span class="l2" style="-webkit-line-clamp:${m.lines2}">${m.l2}</span>`:$}
                </button>`}let u=l.x,b=u.color,y=u.skipped?`repeating-linear-gradient(135deg, rgba(${b.rgb},0.10) 0px, rgba(${b.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:u.stayed?`repeating-linear-gradient(135deg, rgba(${b.rgb},0.24) 0px, rgba(${b.rgb},0.24) 6px, rgba(${b.rgb},0.08) 6px, rgba(${b.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${b.rgb},0.15), rgba(${b.rgb},0.15)), var(--surface)`;return f`<button
                type="button"
                class="card ${u.wrap?"wrap":""} ${r(u.target)?"sel":""} ${u.clash?"clash":""} ${u.skipped?"skipped":""} ${u.cut?"cut":""} ${u.event.notes?"noted":""}"
                aria-label=${u.aria}
                data-note=${u.event.notes||$}
                style="left:${u.x}px;top:${u.y}px;width:${u.w}px;height:${u.h}px;background:${y};border-color:${u.clash?"var(--bad)":`rgba(${b.rgb},0.45)`};--c:${b.color};--rgb:${b.rgb};--ring:${b.color}"
                @click=${()=>this.open(u.target)}
              >
                ${u.event.notes?Br:$}
                <span class="top">
                  <span class="title">${u.title}</span>
                  <span class="time">${u.time}${u.inline&&u.drop?f`<span class="line tone-${u.drop.tone} inline"> · ${u.drop.text}</span>`:$}</span>
                  ${u.showDrop&&u.drop&&!u.inline?f`<span class="line tone-${u.drop.tone}">${u.drop.text}</span>`:$}
                </span>
                ${u.showPick&&u.pick?f`<span class="line tone-${u.pick.tone}">${u.pick.text}</span>`:$}
              </button>`})}
          ${Ie(e.stays,l=>l.key,l=>f`<button
                type="button"
                class="stay ${l.cut?"cut":""}"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;border-color:${l.color.color};background:repeating-linear-gradient(135deg, rgba(${l.color.rgb},0.28) 0px, rgba(${l.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1" style="color:${l.color.ink}">${l.l1}</span><span class="l2">${l.l2}</span>
              </button>`)}
          ${Ie(e.trips,l=>l.key,l=>f`<button
                type="button"
                class="trip ${l.bad?"bad":""} ${l.stops?"list":""} ${l.h>=120?"tall":""}"
                aria-label=${l.aria}
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1">${l.l1}${l.kids.map(u=>f`<span class="kid-dot" style="background:${u}"></span>`)}</span>
                ${l.show2?f`<span class="l2">${l.l2}</span>`:$}
                ${l.stops?l.stops.map(u=>f`<span class="stop ${u.warn?"warn":""}">${u.text}</span>`):$}
                ${l.show3?f`<span class="l3">${l.l3}</span>`:$}
              </button>`)}
          ${Ie(e.overlaps,l=>l.key,l=>f`<div class="overlap" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"></div>`)}
          ${Ie(e.marks,l=>l.key,l=>f`<span class="mark" style="left:${l.x}px;top:${l.y}px;${l.right?"transform:translateX(-100%)":""}">${l.text}</span>`)}
          ${Ie(e.folds,l=>l.key,l=>f`<div class="fold" style="top:${l.y}px;width:${c-60}px;height:${l.h}px" aria-hidden="true">
                ${Sd(c-60,l.h)}
              </div>
              <span class="fold-label" style="top:${l.y+l.h/2-9}px" title="${je(l.from)} to ${je(l.to)}">${l.label}</span>`)}
          ${e.now?f`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${c-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:$}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:i,later:r}=e,a=this.plan,c=i+n.length,d=this.chores,h=!!d&&!Ms(d);return f`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?$:f`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${h?f`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?f`<div class="attn-chores">${n.map(l=>this.renderChoreRow(l,!0))}</div>`:f`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:f`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!i?f`<div class="all-clear">
            <span class="check" aria-hidden="true">${le`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${tn(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:$}
      ${o.map(l=>f`<div class="issue ${l.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${l.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${l.pick?f`<button type="button" class="issue-title" @click=${()=>l.pick&&this.openForPick(l.pick.day,l.pick.id)}>${l.title}</button>`:l.target?f`<button type="button" class="issue-title" @click=${()=>this.open(l.target,!0)}>${l.title}</button>`:f`<strong class="issue-title">${l.title}</strong>`}
              <span class="issue-body"
                >${l.parts?l.parts.map(u=>typeof u=="string"?u:f`<button type="button" class="issue-link" @click=${()=>this.open(u.target,!0)}>${u.text}</button>`):l.body}</span
              >
            </div>
          </div>
          ${l.suggestions.length?f`<div class="fixes">
                ${l.suggestions.map(u=>f`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(u.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${u.id}`?"Saving…":u.label}</span>
                    <span class="fix-note">${u.note}</span>
                  </button>`)}
              </div>`:$}
        </div>`)}
      ${this.wide&&a&&!tn(a)&&this.page==="rides"?this.renderLegend():$}
    `}kidColorOf(e){let n=this.plan?ve(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return ce(Math.max(0,o))}renderLunchChip(e,n=!1,o=1/0){let i=this.lunch,r=i?.kids.find(l=>l.id===e);if(!i||!r)return $;this.tick;let a=this.today(),c=Qo(r,a.date,a.minutes,this.lunchDraft);if(!c)return $;let d=en[c.lunch],h=`${d} lunch ${c.when}${c.menu?`: ${c.menu}`:""}`;return n&&o<36+d.length*7.4?f`<span class="lunch-chip ${c.lunch} small icon" role="img" aria-label=${h} title=${h}
        >${c.lunch==="bring"?ri:ai}</span
      >`:f`<span class="lunch-chip ${c.lunch} ${n?"small":""}" title=${h}
      >${c.lunch==="bring"?ri:ai}<span class="lunch-chip-text"
        >${d}${n?$:` ${c.when}`}${!n&&c.menu?f`<span class="lunch-chip-menu"> · ${c.menu}</span>`:$}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return f`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=Yo(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:Be(e.today),i=n.indexOf(o),r=h=>{let l=n[i+h];l&&(this.lunchMonth=l)},a=e.kids.some(h=>h.id===this.lunchKid)?this.lunchKid:null,c=a?e.kids.filter(h=>h.id===a):e.kids,d=e.status&&!e.status.ok?f`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:$;return f`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${le`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${On(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${i<0||i>=n.length-1} @click=${()=>r(1)}>
            ${le`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":f`${Nr} Edit menus`}
        </button>
      </div>
      ${d}
      <div class="chore-cols lunch-cols ${a?"wide":""}" style="--n:${c.length}">
        ${c.map(h=>this.renderLunchCard(e,h,o,a!==null))}
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
    </div>`}renderLunchCard(e,n,o,i){let r=this.kidColorOf(n.id),a=Xo(e,n,o,this.lunchDraft),c=Zo(a),d=a.flat(),h=d.filter(m=>!m.outside&&!m.past&&m.lunch),l=n.days_off.filter(m=>Be(m.first)<=o&&o<=Be(m.last)),u=m=>h.filter(w=>In(w.date)===m),b=m=>{let w=u(m);if(!w.length)return;let M=w.every(g=>g.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,w.map(g=>g.date),M)},y=h.length?`${c.bring} Bring · ${c.buy} Buy${o===Be(e.today)?" left this month":""}`:"No school days left this month";return f`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Ee(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${y}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${en[n.default]} unless picked</span>
          ${e.kids.length<2?$:f`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:n.id}
              >
                ${i?kd:wd}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?f`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:$}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${On(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((m,w)=>f`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!u(w).length}
            aria-label=${`${u(w).every(M=>M.lunch==="bring")?"Buy":"Bring"} every ${m} left in ${On(o)} for ${n.name}`}
            @click=${()=>b(w)}
          >
            ${m}
          </button>`)}
        ${d.map(m=>this.renderLunchCell(n,m,i))}
      </div>
      ${l.length?f`<p class="lunch-offs">
            No school:
            ${l.map(m=>{let w=m.first<`${o}-01`?`${o}-01`:m.first,M=Be(m.last)>o?Tt(`${Ns(o)}-01`,-1):m.last;return`${w===M?li(w):`${li(w)}–${li(M)}`} ${Jo(m.title)}`}).join(" · ")}
          </p>`:$}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return f`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return f`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=n.lunch,r=i==="buy"?"bring":"buy",a=n.menu?`, ${n.menu}`:"",c=this.menuMode,d=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),h=c?`${e.name}, ${Le(n.date)}${a||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${Le(n.date)}: ${en[i]}${n.picked?"":" (not picked yet)"}${a}. Tap to ${en[r]}.`;return f`<button
      type="button"
      class="lunch-day ${i} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${c?"editing":""} ${d?"sel":""}"
      ?disabled=${n.past&&!c}
      aria-label=${h}
      @click=${()=>c?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${i==="bring"?ri:ai}${en[i]}</span>
      ${n.menu?f`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?f`<span class="lunch-sides">${n.sides}</span>`:$}`:c?f`<span class="lunch-menu add">${Gn} Menu</span>`:$}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex(P=>P.id===e.kid),a=(this.plan?ve(this.plan).get(e.kid):void 0)??ce(Math.max(0,r)),c=o.kids[r]?.name??"",d=this.choreDraft.get(e.id),h=d===void 0||zr(e,d)?e:{...e,state:d===!1?"open":d===!0?"done":d,done_at:d===!1?null:new Date().toISOString()},l=i&&h.done_by&&h.done_by!==e.kid?o.people?.find(P=>P.id===h.done_by)?.name??h.done_by_name??null:null,u=`${Ss(h,o.today,o.time_zone)}${l?` · by ${l}`:""}`,b=i||jo(e),y=i?this.pointsFlash.get(e.id):void 0,m=`${n?`${c}: `:""}${e.title}. ${u?`${u}. `:""}${y?`Earned ${$t(y)}. `:""}${i?"Done. Tap to undo.":"Tap when it’s done."}`,w=f`<span class="box" aria-hidden="true"
        >${i?le`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d=${qt(h.state)?"M6 12h12":"M5 12.5l4.5 4.5L19 7.5"}/></svg>`:$}</span
      >
      ${e.icon?f`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:$}
      <span class="chore-text">
        <span class="chore-title">${n?f`<span class="chore-kid">${c}</span> · `:$}${e.title}</span>
        ${u?f`<span class="chore-note">${u}</span>`:$}
      </span>
      ${y?f`<span class="pts-flash" aria-hidden="true">+${$t(y)}</span>`:$}`,M=`chore ${i?"done":""} ${qt(h.state)?"skipped":""} ${e.state==="overdue"&&!i?"overdue":""} ${b?"":"later"}`,g=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return b?f`<button type="button" class=${M} style=${g} aria-pressed=${i?"true":"false"} aria-label=${m} @click=${()=>this.tapChore(e)}>
          ${w}
        </button>`:f`<div class=${M} style=${g}>${w}</div>`}renderChores(){let e=this.chores;if(e===void 0)return f`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return f`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return f`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(Ms(e))return f`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${Gn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?f`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:$;this.tick;let i=zo(e,this.plan?ve(this.plan):void 0,this.today().minutes);return f`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Gn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${Nr} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${i.length}">
        ${i.map(r=>{let a=r.overdue.filter(c=>!this.choreDone(c)).length+r.now.filter(c=>!this.choreDone(c)).length;return f`<section class="chore-col ${Bs(e,r.kid)?"leader":""}" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Ee(r.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${r.name}</span>${this.renderScore(r.kid)}</span>
                <span class="sub">${a?`${a} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?f`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(c=>this.renderChoreRow(c))}`:$}
            ${r.now.length?f`<h3 class="chore-group">To do</h3>
                  ${r.now.map(c=>this.renderChoreRow(c))}`:$}
            ${r.done.length?f`<h3 class="chore-group">Done</h3>
                  ${r.done.map(c=>this.renderChoreRow(c))}`:$}
            ${r.later.map(c=>f`<h3 class="chore-group">${c.date===e.today?"Later today":Td(c.date,e.today)}</h3>
                ${c.chores.map(d=>this.renderChoreRow(d))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?f`<p class="chore-none">No chores this week.</p>`:$}
          </section>`})}
      </div>
    </div>`}renderWeeklyPoints(e){let n=Go(e.templates,e.kids.map(i=>i.id),e.points?.default??1),o=this.plan?ve(this.plan):void 0;return f`<section class="week-points" aria-label="Points a week">
      <span class="week-points-label">Points available per week</span>
      ${e.kids.map((i,r)=>{let a=o?.get(i.id)??ce(r);return f`<span class="week-kid" style="--c:${a.color};--rgb:${a.rgb}"
          ><span class="avatar" aria-hidden="true">${Ee(i.name)}</span>${i.name} <strong>${$t(n[i.id]??0)}</strong></span
        >`})}
    </section>`}renderTemplateRow(e){let n=this.chores,o=n.kids,i=this.plan?ve(this.plan):void 0,r=this.choreEdit?.template===e.id,a=e.problems.length?f`<span class="tmpl-note bad">${e.problems.map(Os).join(" · ")} · tap to set up</span>`:f`<span class="tmpl-note">${Is(e.who,o,e.take_turns)} · ${Rs(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}${n.points?` · ${Md(e.points??n.points.default)}`:""}</span>`;return f`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?f` <span class="tag-paused">Paused</span>`:$}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let d=o.findIndex(l=>l.id===c),h=i?.get(c)??ce(Math.max(0,d));return f`<span class="kid-dot" style="background:${h.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return f`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Gn} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.points&&e.templates.length?this.renderWeeklyPoints(e):$}
      ${e.templates.length?n.map(([o,i])=>{let r=e.templates.filter(a=>a.repeats===o);return r.length?f`<section class="manage-group" aria-label=${i}>
                  <h3 class="chore-group">${i}</h3>
                  <div class="tmpl-list">${r.map(a=>this.renderTemplateRow(a))}</div>
                </section>`:$}):f`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return f``;let o=n.kids,i=this.plan?ve(this.plan):void 0,r=this.choreBusy,a=e.template?n.templates.find(m=>m.id===e.template):void 0,c=Ls(e),d=(a?.problems??[]).filter(m=>m!=="who:"),h=(m,w,M,g=!1)=>f`<button type="button" class="choice ${g?"wide":""}" aria-pressed=${m?"true":"false"} ?disabled=${r} @click=${M}>${w}</button>`,l=(m,w,M,g)=>f`<button type="button" class="chip" aria-pressed=${m?"true":"false"} aria-label=${g??$} ?disabled=${r} @click=${M}>${w}</button>`,u=m=>{m!==e.repeats&&this.changeDraft({repeats:m,days:a&&a.repeats===m?a.days??Yt(m):Yt(m)})},b=m=>{let w=e.who.includes(m)?e.who.filter(M=>M!==m):o.filter(M=>M.id===m||e.who.includes(M.id)).map(M=>M.id);this.changeDraft({who:w})},y;if(e.repeats==="school"){let m=e.days===at?new Set:e.days===""?new Set([0,1,2,3,4]):Vt(e.days)??new Set,w=M=>{let g=new Set(m);g.has(M)?g.delete(M):g.add(M),this.changeDraft({days:g.size===5?"":g.size?As(g):at})};y=f`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${rt.slice(0,5).map((M,g)=>l(m.has(g),M.slice(0,2),()=>w(g),M))}
          </div>
          <p class="field-hint">Weekdays with no “No School” event on the kid’s calendar.</p>
        </div>
        <div class="field">
          <span class="field-label">When</span>
          <div role="group" aria-label="When" class="choices" style="grid-template-columns:1fr 1fr">
            ${h(!e.night_before,"That morning",()=>this.changeDraft({night_before:!1}))}
            ${h(e.night_before,"The night before",()=>this.changeDraft({night_before:!0}))}
          </div>
          <p class="field-hint">${e.night_before?"Shows from the evening before each school day. Still on time that morning.":"Due on the school day itself."}</p>
        </div>
        <div class="field">
          ${h(e.bring_only,e.bring_only?"Only on Bring lunch days":"Every school day, Bring or Buy",()=>this.changeDraft({bring_only:!e.bring_only}),!0)}
          <p class="field-hint">${e.bring_only?"Made only when the kid brings lunch, like Pack lunch.":"Tap to make it only on Bring lunch days, like Pack lunch."}</p>
        </div>`}else if(e.repeats==="monthly"){let m=e.days.trim(),w=/^\d+$/.test(m)?Number(m):null,M=m&&m.toLowerCase()!=="any"&&m.toLowerCase()!=="last"&&w===null;y=f`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${M?4:3}, minmax(0, 1fr))">
          ${h(m===""||m.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${h(w!==null,"On a date",()=>this.changeDraft({days:String(w??1)}))}
          ${h(m.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${M?h(!0,m,()=>{}):$}
        </div>
        ${w!==null?f`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||w<=1} @click=${()=>this.changeDraft({days:String(w-1)})}>−</button>
                <span class="arrive-value">${Ds(w)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||w>=31} @click=${()=>this.changeDraft({days:String(w+1)})}>+</button>
              </span>
            </div>`:f`<p class="field-hint">${m.toLowerCase()==="last"?"Due on the month’s last day.":M?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")y=f`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let m=e.days===""||e.days.toLowerCase()==="any",w=e.days===at?new Set:m?new Set:Vt(e.days)??new Set,M=g=>{let P=new Set(w);P.has(g)?P.delete(g):P.add(g),this.changeDraft({days:P.size?As(P)||"Mon-Sun":at})};y=f`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${h(m,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${h(!m,"On set days",()=>this.changeDraft({days:m?"Sat":e.days}))}
        </div>
        ${m?f`<p class="field-hint">Shows all week, due on Sunday.</p>`:f`<div role="group" aria-label="Days of the week" class="day-chips">
                ${rt.map((g,P)=>l(w.has(P),g.slice(0,2),()=>M(P),g))}
              </div>
              <div class="chips">
                ${l(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${l(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:$}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?Is(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===at?"No days picked":Rs(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${d.length?f`<p class="field-hint bad">${d.map(Os).join(". ")}. Saving fixes it.</p>`:$}
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
          ${jr.map(m=>l(e.icon===m,m,()=>this.changeDraft({icon:e.icon===m?null:m}),`Picture ${m}`))}
          ${e.icon&&!jr.includes(e.icon)?l(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):$}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?f`<emoji-picker
              class="emoji-more"
              .dataSource=${xd}
              @emoji-click=${m=>{let w=m.detail.unicode;w&&this.changeDraft({icon:w}),this.iconMore=!1}}
            ></emoji-picker>`:$}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((m,w)=>{let M=i?.get(m.id)??ce(w),g=e.who.includes(m.id);return f`<button type="button" class="who-chip" style="--c:${M.color};--rgb:${M.rgb}" aria-pressed=${g?"true":"false"} ?disabled=${r} @click=${()=>b(m.id)}>
              <span class="avatar" aria-hidden="true">${Ee(m.name)}</span>${m.name}
            </button>`})}
        </div>
        ${e.who.length>1?f`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${h(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${h(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:$}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${h(e.repeats==="daily","Every day",()=>u("daily"))}
          ${h(e.repeats==="weekly","Every week",()=>u("weekly"))}
          ${h(e.repeats==="monthly","Every month",()=>u("monthly"))}
          ${h(e.repeats==="school","School days",()=>u("school"))}
        </div>
      </div>
      ${y}
      ${e.repeats==="school"?$:f`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${$d(e.repeats,e.every)}</span>
      </div>`}
      <div class="field">
        <label class="field-label" for="chore-points">Points <span class="field-hint">For doing it on time</span></label>
        <input
          id="chore-points"
          class="text-input points-input"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          placeholder=${String(n.points?.default??1)}
          .value=${e.points===null?"":String(e.points)}
          ?disabled=${r}
          @input=${m=>{let w=m.target,M=Ko(w.value);w.value=M===null?"":String(M),this.changeDraft({points:M})}}
        />
        <p class="field-hint">Blank uses the default from Configure › Chore points.</p>
      </div>
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
              ${h(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${r} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:$}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!c} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":c?c.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return f``;let o=e.busy,i=h=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...h})},r=h=>i({kids:e.kids.includes(h)?e.kids.filter(l=>l!==h):[...e.kids,h]}),a=n.kids.filter(h=>Xt(h,e.date)),c=e.dish.trim(),d=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${Le(e.date)}</span>
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
          @input=${h=>i({dish:h.target.value})}
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
          @input=${h=>i({details:h.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${a.map(h=>{let l=this.kidColorOf(h.id),u=e.kids.includes(h.id);return f`<button type="button" class="who-chip" style="--c:${l.color};--rgb:${l.rgb}" aria-pressed=${u?"true":"false"} ?disabled=${o} @click=${()=>r(h.id)}>
              <span class="avatar" aria-hidden="true">${Ee(h.name)}</span>${h.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${c||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?f`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:$}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!d} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":d??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return f``;let o=n.people?.length?n.people:n.kids.map(l=>({...l,role:"kid"})),i=n.kids.findIndex(l=>l.id===e.kid),r=n.kids[i],a=this.plan?ve(this.plan):void 0,c=a?.get(e.kid)??ce(Math.max(0,i)),d=o.filter(l=>l.id!==e.kid),h=l=>{let u=n.kids.findIndex(b=>b.id===l.id);return u>=0?(a?.get(l.id)??ce(u)).color:"var(--dark)"};return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:$}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${Ss(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${c.color};--rgb:${c.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${Ee(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?f`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${d.map(l=>f`<button type="button" class="done-by" style="--c:${h(l)}" @click=${()=>void this.toggleChore(e,l.id)}>
                  <span class="avatar ${l.role==="parent"?"driver":""}" aria-hidden="true">${Ee(l.name)}</span>
                  <span>${l.name}</span>
                </button>`)}
            </div>`:f`<button type="button" class="choice wide" @click=${()=>this.whoOthers=!0}>Someone else did</button>`}
      </div>
      <div class="field">
        <span class="field-label">Not done?</span>
        <div role="group" aria-label="Not done" class="choices skip-choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" @click=${()=>void this.toggleChore(e,void 0,"skipped")}>Skipped</button>
          <button type="button" class="choice" @click=${()=>void this.toggleChore(e,void 0,"excused")}>Excused (sick, away)</button>
        </div>
        <p class="field-hint">Takes it off the list with no points. Skipped counts as missed; excused doesn’t.</p>
      </div>
    `}renderLegend(){return f`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}ownHint(e,n){let o=Gt(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${U(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${U(n.start)} to ${U(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=n.along.map(r=>re(e).includes(r)?ue(e,r):be(e,r));return`${o} drives there and back${i.length?`, with ${wt(i)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return f``;let{day:o,event:i}=n,r=re(e),a=_o(e,i),c=Gt(e,i),d=!!this.pending,h=v=>this.pending?.key===v?this.pending.value:void 0,l=[...e.people?.carpools??[]];for(let v of e.days)for(let I of v.events)for(let R of[I.drop,I.pick])R&&R!=="none"&&!r.includes(R)&&!l.some(L=>L.toLowerCase()===R.toLowerCase())&&l.push(R);let u=new Set(e.days.flatMap(v=>v.events.filter(I=>I.title===i.title).flatMap(I=>[I.drop,I.pick].map(R=>(R??"").toLowerCase()))));l.sort((v,I)=>Number(u.has(I.toLowerCase()))-Number(u.has(v.toLowerCase())));let b=v=>{if(!i.sides.includes(v))return $;let I=h(v)??h("both"),R=v==="drop"?i.drop:i.pick,L=I!==void 0?String(I):i.no_ride_unless_named&&R==="none"?"":R,X=L===""&&!(I===void 0&&i.no_ride_unless_named),H=L&&L!=="none"&&!r.includes(L)?L:"",me=G=>{this.otherOpen=null,this.setRide(i,v,L===G?"":G,r)},ee=[...r.map(G=>[G,ks(e,G)]),["none","Not needed"]],A=`${i.id}|${v}`,J=this.otherOpen===A;return f`<div class="field ride-box">
        <span class="field-label">${v==="drop"?"Drop-off":"Pick-up"} ${X?f`<span class="nobody">· nobody yet</span>`:$}</span>
        <div role="group" aria-label=${v==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${ee.length+1}, minmax(0, 1fr))">
          ${ee.map(([G,Ae])=>f`<button type="button" class="choice" aria-pressed=${L===G?"true":"false"} ?disabled=${d} @click=${()=>me(G)}>
                ${Ae}
              </button>`)}
          <button
            type="button"
            class="choice"
            aria-pressed=${H?"true":"false"}
            aria-expanded=${J?"true":"false"}
            ?disabled=${d}
            @click=${()=>this.otherOpen=J?null:A}
          >
            ${H||"Other"}
          </button>
        </div>
        ${J?f`${l.length?f`<div role="group" aria-label=${v==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${l.map(G=>f`<button type="button" class="chip" aria-pressed=${L.toLowerCase()===G.toLowerCase()?"true":"false"} ?disabled=${d} @click=${()=>me(G)}>
                    ${G}
                  </button>`)}
            </div>`:$}
        <input
          type="text"
          .value=${H&&!l.some(G=>G.toLowerCase()===H.toLowerCase())?H:""}
          ?disabled=${d}
          aria-label=${v==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${G=>{let Ae=G.target.value.trim();Ae&&Ae!==L&&me(Ae)}}
          @keydown=${G=>{G.key==="Enter"&&G.target.blur()}}
        />`:$}
        ${!g&&L!==""&&L!=="none"?y(v,L):$}
      </div>`},y=(v,I)=>{let R=h(`along-${v}`),L=R!==void 0?R:v==="pick"?i.pick_along??[]:i.along,X=new Set(o.events.filter(ee=>ee.event_id===i.event_id&&!ee.own).map(ee=>ee.kid)),H=[...we(e).filter(ee=>ee!==i.kid&&!X.has(ee)),...r.filter(ee=>ee!==I)];return H.length?f`<div class="field-sub">
        <span class="field-label">${v==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${v==="pick"?"Coming home too. Anyone already there just gets in.":v==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${v==="drop"?"Riding along on the drop-off":v==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="who-chips">
          ${H.map(ee=>{let A=r.includes(ee),J=A?ue(e,ee):be(e,ee),G=A?Fe:ve(e).get(ee)??ce(0);return f`<button
              type="button"
              class="who-chip"
              style="--c:${G.color};--rgb:${G.rgb}"
              aria-pressed=${L.includes(ee)?"true":"false"}
              ?disabled=${d}
              @click=${()=>this.toggleAlong(i,ee,v)}
            >
              <span class="avatar ${A?"driver":""}" aria-hidden="true">${Ee(J)}</span>${J}
            </button>`})}
        </div>
      </div>`:$},m=r.includes(i.drop)?i.drop:r.includes(i.pick)?i.pick:"",w=i.drop===i.pick&&r.includes(i.drop),M=h("stay"),g=M!==void 0?!!M:i.stay&&w,P=h("along"),N=P!==void 0?P:i.along,K=i.own?[...we(e),...r.filter(v=>v!==i.own)]:[],se=i.own!=null&&i.takes!=null,T=i.own!=null&&!se,E=h("takes"),x=E!==void 0?E:i.takes??null,_=h("arrive"),C=this.arriveDraft!==void 0?this.arriveDraft:_!==void 0?_:i.arrive_by,D=h("leave"),j=this.leaveDraft!==void 0?this.leaveDraft:D!==void 0?D:i.leave_by??null,W=(v,I)=>{let R=v==="arrive",L=R?i.start:i.end,X=me=>()=>R?this.nudgeArrive(i,me):this.nudgeLeave(i,me),H=(me,ee,A,J)=>f`<button
          type="button"
          class="step"
          aria-label=${ee}
          ?disabled=${d||J}
          @pointerdown=${()=>this.startHold(X(me))}
          @pointerup=${()=>this.stopHold()}
          @pointerleave=${()=>this.stopHold()}
          @pointercancel=${()=>this.stopHold()}
          @click=${()=>this.tapStep(X(me))}
        >
          ${A}
        </button>`;return f`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">${R?"Arrive":"Leave"}</span>
          <span class="field-hint">${pn(I-L)}</span>
        </span>
        <span class="stepper">
          ${H(-5,"Five minutes earlier","−",!R&&I-5<=i.start)}
          <span class="arrive-value">${U(I)}</span>
          ${H(5,"Five minutes later","+",!1)}
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
      </div>`},q=i.sides.includes("pick")||i.own!=null,Z=C!=null||this.timesOpen.arrive,z=q&&(j!=null||this.timesOpen.leave),Y=v=>()=>{this.timesOpen={...this.timesOpen,[v]:!0}},pe=()=>f`${Z?W("arrive",C??i.start):$}
      ${z?W("leave",j??i.end):$}
      ${!Z||!z&&q?f`<div class="field time-chips">
            <div role="group" aria-label="Times" class="chips">
              ${Z?$:f`<button type="button" class="chip" ?disabled=${d} @click=${Y("arrive")}>Arrive early or late</button>`}
              ${!z&&q?f`<button type="button" class="chip" ?disabled=${d} @click=${Y("leave")}>Leave early or late</button>`:$}
            </div>
          </div>`:$}`,Me=i.sides.includes("drop")&&i.sides.includes("pick"),De=Me&&(g||this.stayDraft===i.id),Ce=()=>{let v=Me?f`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${De?"false":"true"}
              ?disabled=${d}
              @click=${()=>{this.stayDraft=null,i.stay&&this.toggleStay(i,!1,m)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${De?"true":"false"}
              ?disabled=${d}
              @click=${()=>{m?this.toggleStay(i,!0,m):this.stayDraft=i.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:$;if(!De)return f`${v} ${b("drop")} ${b("pick")}`;let I=g&&w?i.drop:"";return f`${v}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${I?$:f`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(R=>f`<button
                type="button"
                class="choice"
                aria-pressed=${I===R?"true":"false"}
                ?disabled=${d}
                @click=${()=>{if(I===R||!this.backend)return;let L=this.backend;this.stayDraft=null,this.save("stay",!0,()=>L.setRide(i.id,"both",R,this.scope,!0))}}
              >
                ${ue(e,R)}
              </button>`)}
          </div>
          ${I?y("both",I):$}
        </div>`},Q=[],ie=v=>v==="none"?"Not needed":ks(e,v),Pe=v=>r.includes(v)?ue(e,v):be(e,v),$e=(v,I,R)=>{I===""&&!R.length||Q.push(`${v}: ${[I===""?"TBD":ie(I),...R.map(Pe)].join(", ")}`)},Ye=v=>i.no_ride_unless_named&&v==="none"?"":v;i.own||$e("Drop-off",Ye(i.drop),i.along),i.own||$e("Pick-up",Ye(i.pick),i.pick_along??[]),!i.own&&i.stay&&Q.push("Stay: yes"),se&&Q.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&Q.push(`Take along: ${i.along.map(Pe).join(", ")}`),i.arrive_by!=null&&i.arrive_by!==i.start&&Q.push(`Arrive: ${pn(i.arrive_by-i.start)}`),i.leave_by!=null&&i.leave_by!==i.end&&Q.push(`Leave: ${pn(i.leave_by-i.end)}`);let Xe=h("attending"),Te=Xe!==void 0?!!Xe:i.attending!==!1;i.attending===!1&&Q.splice(0,Q.length,"Attending: no");let p=o.date===this.today().date?"":`${xe(o.date)} · `,k=Dn(i),S=f`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${c} · ${i.title}</span>
          <span class="ed-meta">${p}${se?"any time ":""}${k}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
          ${this.renderForLine(e,o,i)}
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;if(i.busy_only){let v=i.place_name&&i.place_name!==i.title?i.place_name:"",I=i.busy_why==="days"?"It runs over more than a day, so no drive is planned for it.":i.busy_why==="home"?"It’s at home, so no drive is planned for it.":"It has no address, so no drive is planned for it.";return f`${S}
        ${this.pending?f`<p class="saving" role="status">Saving to Google Calendar…</p>`:$}
        ${v?f`<div class="field"><span class="field-label">Where</span><span class="field-hint">${v}</span></div>`:$}
        <p class="field-hint">
          ${Te?`This blocks ${c}’s time: ${c} can’t drive then, so a ride that needs ${c} shows as a problem.`:`Not going, so it doesn’t block ${c}’s time, and ${c} can drive then.`}
          ${I}
        </p>
        <button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.setAttending(i,!Te)}>
          ${Te?`${c} isn’t going this time`:`${c} is going after all`}
        </button>
        ${i.problems.length?f`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:$}
        <details class="notes">
          <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
          <span class="notes-body">--- Rides ---\n${i.attending===!1?"Attending: no":"(nothing yet)"}</span>
        </details>`}return i.where==="home"?f`${S}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:f`
      ${S}
      ${this.pending?f`<p class="saving" role="status">Saving to Google Calendar…</p>`:$}
      ${i.recurring?f`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${xe(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:$}
      ${Te?f`${i.where==="anywhere"?f`<p class="field-hint">
                  ${i.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:$}
            ${i.own?f`<p class="field-hint">${this.ownHint(e,i)}</p>`:Ce()}
      ${i.own?f`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${x!=null?`Takes ${x} min, any time ${U(i.start)}–${U(i.end)}`:"At its set time"}</span>
            </span>
            ${x!=null?f`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${d||x<=5} @click=${()=>this.setTakes(i,Math.max(5,x-5))}>−</button>
                  <span class="arrive-value">${x} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${d||x+5>i.end-i.start} @click=${()=>this.setTakes(i,x+5)}>+</button>
                </span>`:$}
          </div>
          <button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.setTakes(i,x!=null?null:Math.min(10,Math.max(5,i.end-i.start)))}>
            ${x!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:$}
      ${T&&K.length?f`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${K.map(v=>f`<button type="button" class="chip" aria-pressed=${N.includes(v)?"true":"false"} ?disabled=${d} @click=${()=>this.toggleAlong(i,v)}>
                  ${r.includes(v)?ue(e,v):be(e,v)}
                </button>`)}
            </div>
          </div>`:$}
      ${se?$:pe()}
`:f`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${c} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.setAttending(i,!Te)}>
        ${Te?`${c} isn’t going this time`:`${c} is going after all`}
      </button>
      ${i.problems.length?f`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:$}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${Q.length?Q.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${Te&&!i.own?f`<p class="field-hint">Tap a selected driver again to clear it.</p>`:$}
    `}};nn.styles=tr,nn.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},problemOpen:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},leaveDraft:{state:!0},timesOpen:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},pointsFlash:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0},forPick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",nn);function Sd(s,t){let o=Math.max(1,Math.round(s/14)),i=s/o,r=[],a=[];for(let d=0;d<=o;d++){let h=+(d*i).toFixed(1);r.push(`${h},${d%2?5:0}`),a.push(`${h},${t-(d%2?0:5)}`)}let c=`M${r.join(" L")} L${[...a].reverse().join(" L")} Z`;return f`<svg width=${s} height=${t} viewBox="0 0 ${s} ${t}">
    ${le`<path class="fold-fill" d=${c}></path>
      <path class="fold-edge" d=${`M${r.join(" L")}`}></path>
      <path class="fold-edge" d=${`M${a.join(" L")}`}></path>`}
  </svg>`}function zr(s,t){return t===!1?!kt(s):t===!0?kt(s)&&!qt(s.state):s.state===t}function Md(s){return`${$t(s)} ${s===1?"point":"points"}`}function Ad(){let s=[document];for(let t of document.querySelectorAll("*"))t.shadowRoot&&s.push(t.shadowRoot);return s}function Fr(s=3e3){let t=new CSSStyleSheet;t.replaceSync("*, *::before, *::after { cursor: none !important; }"),t.disabled=!0;let e,n=i=>{if(i)for(let r of Ad())r.adoptedStyleSheets.includes(t)||(r.adoptedStyleSheets=[...r.adoptedStyleSheets,t]);t.disabled=!i},o=i=>{if(clearTimeout(e),i.pointerType==="touch"){n(!0);return}n(!1),e=setTimeout(()=>n(!0),s)};window.addEventListener("pointermove",o,{passive:!0}),window.addEventListener("pointerdown",o,{passive:!0}),e=setTimeout(()=>n(!0),s)}function Wr(s){try{return new URL(s).searchParams.get("v")}catch{return null}}function Kr(s,t,e){if(!t)return()=>{};let n=e.everyMs??6e5,o=e.retryMs??3e4,i=e.idleMs??12e4,r=null,a=null,c=0,d=!1,h=y=>{if(d||a)return;let m=e.idleFor();if(m>=i){e.reload(y);return}a=setTimeout(()=>{a=null,h(y)},i-m)},l=async()=>{try{let y=await s.sendMessagePromise({type:"mydashlight/app_version"});c=0;let m=y["kiosk.js"];!d&&m&&m!==t&&h(m)}catch{if(d||r||++c>20)return;r=setTimeout(()=>{r=null,l()},o)}},u=()=>{c=0,l()};s.addEventListener?.("ready",u);let b=setInterval(()=>void l(),n);return()=>{d=!0,clearInterval(b),r&&clearTimeout(r),a&&clearTimeout(a),s.removeEventListener?.("ready",u)}}function Gr(s,t=6e4,e=15e3){let n=null,o=setInterval(()=>{if(!s.connected||n)return;let i=!1;n=setTimeout(()=>{n=null,!i&&s.connected&&s.reconnect(!0)},e);let r=()=>{i=!0,n&&clearTimeout(n),n=null};s.ping().then(r,r)},t);return()=>{clearInterval(o),n&&clearTimeout(n),n=null}}var Vr=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],qr=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function Yr(s,t,e,n){let o=Math.max(0,Math.min(t,s.length)),i=Math.max(o,Math.min(e,s.length));return{value:s.slice(0,o)+n+s.slice(i),caret:o+n.length}}function Xr(s,t,e){let n=Math.max(0,Math.min(t,s.length)),o=Math.max(n,Math.min(e,s.length));if(n!==o)return{value:s.slice(0,n)+s.slice(o),caret:n};if(n===0)return{value:s,caret:0};let i=Array.from(s.slice(0,n));i.pop();let r=i.join("");return{value:r+s.slice(n),caret:r.length}}function Jr(s,t){return t===0||/\s$/.test(s.slice(0,t))}var Ld=new Set(["text","search","email","url","tel","number","password"]);function Zr(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&Ld.has(s.type)&&!s.readOnly&&!s.disabled}var Dd={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},Rd={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},sn=class extends Se{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=n=>n.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let n=e.selectionStart,o=e.selectionEnd;if(n!==null&&o!==null)return[n,o]}catch{}return[e.value.length,e.value.length]}apply(e,n,o){e.value=n;try{e.setSelectionRange(o,o)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=Jr(this.field.value,e)}press(e){let n=this.field;if(n){switch(e){case"hide":n.blur();return;case"done":this.commit(),n.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),n.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[o,i]=this.selection(n),r=Xr(n.value,o,i);this.apply(n,r.value,r.caret);break}default:{let o=e==="space"?" ":this.shift?e.toUpperCase():e,[i,r]=this.selection(n),a=Yr(n.value,i,r,o);this.apply(n,a.value,a.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let n=e.length>1,o=e==="layout"?this.layout==="letters"?"123":"ABC":Dd[e]??(this.shift?e.toUpperCase():e);return f`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":n?"wide":""}
      aria-label=${Rd[e]??o}
      aria-pressed=${e==="shift"?String(this.shift):$}
      @click=${()=>this.press(e)}
    >
      ${o}
    </button>`}render(){let e=this.layout==="letters"?Vr:qr;return f`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(n=>f`<div class="row">${n.map(o=>this.key(o))}</div>`)}
      </div>`}};sn.styles=Qe`
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
  `,sn.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",sn);function Id(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function Qr(s){let t=new WeakSet,e=r=>{let a=r.composedPath();i(a);let c=a[0];Zr(c)&&s.attach(c)},n=()=>{setTimeout(()=>{let r=Id();!s.target||r===s.target||(Zr(r)?s.attach(r):s.detach())},0)},o=r=>{t.has(r)||(t.add(r),r.addEventListener("focusin",e),r.addEventListener("focusout",n))},i=r=>{for(let a of r)a instanceof ShadowRoot&&o(a)};o(document),document.addEventListener("pointerdown",r=>i(r.composedPath()),{capture:!0}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var ci="mydashlight",Od=`/api/${ci}/pair`,Bd=`/api/${ci}/pair/poll`,di=`/${ci}`,hi="pair";function ea(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function ta(s,t){return`${s}${di}?${hi}=${encodeURIComponent(t)}`}function Nd(s,t,e=Date.now()){return{hassUrl:s,clientId:t.client_id,access_token:t.access_token,refresh_token:t.refresh_token,expires_in:t.expires_in,expires:e+t.expires_in*1e3}}var pt=class extends Error{constructor(t,e=!1){super(t),this.busy=e}};async function na(s=fetch){let t=await s(Od,{method:"POST",cache:"no-store"});if(t.status===429)throw new pt("Too many screens are asking to pair right now.",!0);if(!t.ok)throw new pt(`Home Assistant answered ${t.status}.`);return await t.json()}async function sa(s,t,e=fetch){let n=await e(Bd,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(n.status===404)return{status:"expired"};if(!n.ok)throw new pt(`Home Assistant answered ${n.status}.`);let o=await n.json();return o.status==="paired"&&o.auth?{status:"paired",auth:Nd(t,o.auth)}:{status:"pending"}}var Mt=function(s,t){let o=s,i=on[t],r=null,a=0,c=null,d=[],h={},l=function(T,E){a=o*4+17,r=(function(x){let _=new Array(x);for(let C=0;C<x;C+=1){_[C]=new Array(x);for(let D=0;D<x;D+=1)_[C][D]=null}return _})(a),u(0,0),u(a-7,0),u(0,a-7),m(),y(),M(T,E),o>=7&&w(T),c==null&&(c=N(o,i,d)),g(c,E)},u=function(T,E){for(let x=-1;x<=7;x+=1)if(!(T+x<=-1||a<=T+x))for(let _=-1;_<=7;_+=1)E+_<=-1||a<=E+_||(0<=x&&x<=6&&(_==0||_==6)||0<=_&&_<=6&&(x==0||x==6)||2<=x&&x<=4&&2<=_&&_<=4?r[T+x][E+_]=!0:r[T+x][E+_]=!1)},b=function(){let T=0,E=0;for(let x=0;x<8;x+=1){l(!0,x);let _=Ve.getLostPoint(h);(x==0||T>_)&&(T=_,E=x)}return E},y=function(){for(let T=8;T<a-8;T+=1)r[T][6]==null&&(r[T][6]=T%2==0);for(let T=8;T<a-8;T+=1)r[6][T]==null&&(r[6][T]=T%2==0)},m=function(){let T=Ve.getPatternPosition(o);for(let E=0;E<T.length;E+=1)for(let x=0;x<T.length;x+=1){let _=T[E],C=T[x];if(r[_][C]==null)for(let D=-2;D<=2;D+=1)for(let j=-2;j<=2;j+=1)D==-2||D==2||j==-2||j==2||D==0&&j==0?r[_+D][C+j]=!0:r[_+D][C+j]=!1}},w=function(T){let E=Ve.getBCHTypeNumber(o);for(let x=0;x<18;x+=1){let _=!T&&(E>>x&1)==1;r[Math.floor(x/3)][x%3+a-8-3]=_}for(let x=0;x<18;x+=1){let _=!T&&(E>>x&1)==1;r[x%3+a-8-3][Math.floor(x/3)]=_}},M=function(T,E){let x=i<<3|E,_=Ve.getBCHTypeInfo(x);for(let C=0;C<15;C+=1){let D=!T&&(_>>C&1)==1;C<6?r[C][8]=D:C<8?r[C+1][8]=D:r[a-15+C][8]=D}for(let C=0;C<15;C+=1){let D=!T&&(_>>C&1)==1;C<8?r[8][a-C-1]=D:C<9?r[8][15-C-1+1]=D:r[8][15-C-1]=D}r[a-8][8]=!T},g=function(T,E){let x=-1,_=a-1,C=7,D=0,j=Ve.getMaskFunction(E);for(let W=a-1;W>0;W-=2)for(W==6&&(W-=1);;){for(let q=0;q<2;q+=1)if(r[_][W-q]==null){let Z=!1;D<T.length&&(Z=(T[D]>>>C&1)==1),j(_,W-q)&&(Z=!Z),r[_][W-q]=Z,C-=1,C==-1&&(D+=1,C=7)}if(_+=x,_<0||a<=_){_-=x,x=-x;break}}},P=function(T,E){let x=0,_=0,C=0,D=new Array(E.length),j=new Array(E.length);for(let z=0;z<E.length;z+=1){let Y=E[z].dataCount,pe=E[z].totalCount-Y;_=Math.max(_,Y),C=Math.max(C,pe),D[z]=new Array(Y);for(let Q=0;Q<D[z].length;Q+=1)D[z][Q]=255&T.getBuffer()[Q+x];x+=Y;let Me=Ve.getErrorCorrectPolynomial(pe),Ce=rn(D[z],Me.getLength()-1).mod(Me);j[z]=new Array(Me.getLength()-1);for(let Q=0;Q<j[z].length;Q+=1){let ie=Q+Ce.getLength()-j[z].length;j[z][Q]=ie>=0?Ce.getAt(ie):0}}let W=0;for(let z=0;z<E.length;z+=1)W+=E[z].totalCount;let q=new Array(W),Z=0;for(let z=0;z<_;z+=1)for(let Y=0;Y<E.length;Y+=1)z<D[Y].length&&(q[Z]=D[Y][z],Z+=1);for(let z=0;z<C;z+=1)for(let Y=0;Y<E.length;Y+=1)z<j[Y].length&&(q[Z]=j[Y][z],Z+=1);return q},N=function(T,E,x){let _=ia.getRSBlocks(T,E),C=oa();for(let j=0;j<x.length;j+=1){let W=x[j];C.put(W.getMode(),4),C.put(W.getLength(),Ve.getLengthInBits(W.getMode(),T)),W.write(C)}let D=0;for(let j=0;j<_.length;j+=1)D+=_[j].dataCount;if(C.getLengthInBits()>D*8)throw"code length overflow. ("+C.getLengthInBits()+">"+D*8+")";for(C.getLengthInBits()+4<=D*8&&C.put(0,4);C.getLengthInBits()%8!=0;)C.putBit(!1);for(;!(C.getLengthInBits()>=D*8||(C.put(236,8),C.getLengthInBits()>=D*8));)C.put(17,8);return P(C,_)};h.addData=function(T,E){E=E||"Byte";let x=null;switch(E){case"Numeric":x=jd(T);break;case"Alphanumeric":x=zd(T);break;case"Byte":x=Hd(T);break;case"Kanji":x=Ud(T);break;default:throw"mode:"+E}d.push(x),c=null},h.isDark=function(T,E){if(T<0||a<=T||E<0||a<=E)throw T+","+E;return r[T][E]},h.getModuleCount=function(){return a},h.make=function(){if(o<1){let T=1;for(;T<40;T++){let E=ia.getRSBlocks(T,i),x=oa();for(let C=0;C<d.length;C++){let D=d[C];x.put(D.getMode(),4),x.put(D.getLength(),Ve.getLengthInBits(D.getMode(),T)),D.write(x)}let _=0;for(let C=0;C<E.length;C++)_+=E[C].dataCount;if(x.getLengthInBits()<=_*8)break}o=T}l(!1,b())},h.createTableTag=function(T,E){T=T||2,E=typeof E>"u"?T*4:E;let x="";x+='<table style="',x+=" border-width: 0px; border-style: none;",x+=" border-collapse: collapse;",x+=" padding: 0px; margin: "+E+"px;",x+='">',x+="<tbody>";for(let _=0;_<h.getModuleCount();_+=1){x+="<tr>";for(let C=0;C<h.getModuleCount();C+=1)x+='<td style="',x+=" border-width: 0px; border-style: none;",x+=" border-collapse: collapse;",x+=" padding: 0px; margin: 0px;",x+=" width: "+T+"px;",x+=" height: "+T+"px;",x+=" background-color: ",x+=h.isDark(_,C)?"#000000":"#ffffff",x+=";",x+='"/>';x+="</tr>"}return x+="</tbody>",x+="</table>",x},h.createSvgTag=function(T,E,x,_){let C={};typeof arguments[0]=="object"&&(C=arguments[0],T=C.cellSize,E=C.margin,x=C.alt,_=C.title),T=T||2,E=typeof E>"u"?T*4:E,x=typeof x=="string"?{text:x}:x||{},x.text=x.text||null,x.id=x.text?x.id||"qrcode-description":null,_=typeof _=="string"?{text:_}:_||{},_.text=_.text||null,_.id=_.text?_.id||"qrcode-title":null;let D=h.getModuleCount()*T+E*2,j,W,q,Z,z="",Y;for(Y="l"+T+",0 0,"+T+" -"+T+",0 0,-"+T+"z ",z+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',z+=C.scalable?"":' width="'+D+'px" height="'+D+'px"',z+=' viewBox="0 0 '+D+" "+D+'" ',z+=' preserveAspectRatio="xMinYMin meet"',z+=_.text||x.text?' role="img" aria-labelledby="'+K([_.id,x.id].join(" ").trim())+'"':"",z+=">",z+=_.text?'<title id="'+K(_.id)+'">'+K(_.text)+"</title>":"",z+=x.text?'<description id="'+K(x.id)+'">'+K(x.text)+"</description>":"",z+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',z+='<path d="',q=0;q<h.getModuleCount();q+=1)for(Z=q*T+E,j=0;j<h.getModuleCount();j+=1)h.isDark(q,j)&&(W=j*T+E,z+="M"+W+","+Z+Y);return z+='" stroke="transparent" fill="black"/>',z+="</svg>",z},h.createDataURL=function(T,E){T=T||2,E=typeof E>"u"?T*4:E;let x=h.getModuleCount()*T+E*2,_=E,C=x-E;return Gd(x,x,function(D,j){if(_<=D&&D<C&&_<=j&&j<C){let W=Math.floor((D-_)/T),q=Math.floor((j-_)/T);return h.isDark(q,W)?0:1}else return 1})},h.createImgTag=function(T,E,x){T=T||2,E=typeof E>"u"?T*4:E;let _=h.getModuleCount()*T+E*2,C="";return C+="<img",C+=' src="',C+=h.createDataURL(T,E),C+='"',C+=' width="',C+=_,C+='"',C+=' height="',C+=_,C+='"',x&&(C+=' alt="',C+=K(x),C+='"'),C+="/>",C};let K=function(T){let E="";for(let x=0;x<T.length;x+=1){let _=T.charAt(x);switch(_){case"<":E+="&lt;";break;case">":E+="&gt;";break;case"&":E+="&amp;";break;case'"':E+="&quot;";break;default:E+=_;break}}return E},se=function(T){T=typeof T>"u"?2:T;let x=h.getModuleCount()*1+T*2,_=T,C=x-T,D,j,W,q,Z,z={"██":"█","█ ":"▀"," █":"▄","  ":" "},Y={"██":"▀","█ ":"▀"," █":" ","  ":" "},pe="";for(D=0;D<x;D+=2){for(W=Math.floor((D-_)/1),q=Math.floor((D+1-_)/1),j=0;j<x;j+=1)Z="█",_<=j&&j<C&&_<=D&&D<C&&h.isDark(W,Math.floor((j-_)/1))&&(Z=" "),_<=j&&j<C&&_<=D+1&&D+1<C&&h.isDark(q,Math.floor((j-_)/1))?Z+=" ":Z+="█",pe+=T<1&&D+1>=C?Y[Z]:z[Z];pe+=`
`}return x%2&&T>0?pe.substring(0,pe.length-x-1)+Array(x+1).join("▀"):pe.substring(0,pe.length-1)};return h.createASCII=function(T,E){if(T=T||1,T<2)return se(E);T-=1,E=typeof E>"u"?T*2:E;let x=h.getModuleCount()*T+E*2,_=E,C=x-E,D,j,W,q,Z=Array(T+1).join("██"),z=Array(T+1).join("  "),Y="",pe="";for(D=0;D<x;D+=1){for(W=Math.floor((D-_)/T),pe="",j=0;j<x;j+=1)q=1,_<=j&&j<C&&_<=D&&D<C&&h.isDark(W,Math.floor((j-_)/T))&&(q=0),pe+=q?Z:z;for(W=0;W<T;W+=1)Y+=pe+`
`}return Y.substring(0,Y.length-1)},h.renderTo2dContext=function(T,E){E=E||2;let x=h.getModuleCount();for(let _=0;_<x;_++)for(let C=0;C<x;C++)T.fillStyle=h.isDark(_,C)?"black":"white",T.fillRect(C*E,_*E,E,E)},h};Mt.stringToBytes=function(s){let t=[];for(let e=0;e<s.length;e+=1){let n=s.charCodeAt(e);t.push(n&255)}return t};Mt.createStringToBytes=function(s,t){let e=(function(){let o=Wd(s),i=function(){let c=o.read();if(c==-1)throw"eof";return c},r=0,a={};for(;;){let c=o.read();if(c==-1)break;let d=i(),h=i(),l=i(),u=String.fromCharCode(c<<8|d),b=h<<8|l;a[u]=b,r+=1}if(r!=t)throw r+" != "+t;return a})(),n=63;return function(o){let i=[];for(let r=0;r<o.length;r+=1){let a=o.charCodeAt(r);if(a<128)i.push(a);else{let c=e[o.charAt(r)];typeof c=="number"?(c&255)==c?i.push(c):(i.push(c>>>8),i.push(c&255)):i.push(n)}}return i}};var ke={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},on={L:1,M:0,Q:3,H:2},Ge={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},Ve=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,e=7973,n=21522,o={},i=function(r){let a=0;for(;r!=0;)a+=1,r>>>=1;return a};return o.getBCHTypeInfo=function(r){let a=r<<10;for(;i(a)-i(t)>=0;)a^=t<<i(a)-i(t);return(r<<10|a)^n},o.getBCHTypeNumber=function(r){let a=r<<12;for(;i(a)-i(e)>=0;)a^=e<<i(a)-i(e);return r<<12|a},o.getPatternPosition=function(r){return s[r-1]},o.getMaskFunction=function(r){switch(r){case Ge.PATTERN000:return function(a,c){return(a+c)%2==0};case Ge.PATTERN001:return function(a,c){return a%2==0};case Ge.PATTERN010:return function(a,c){return c%3==0};case Ge.PATTERN011:return function(a,c){return(a+c)%3==0};case Ge.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case Ge.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case Ge.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case Ge.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+r}},o.getErrorCorrectPolynomial=function(r){let a=rn([1],0);for(let c=0;c<r;c+=1)a=a.multiply(rn([1,qe.gexp(c)],0));return a},o.getLengthInBits=function(r,a){if(1<=a&&a<10)switch(r){case ke.MODE_NUMBER:return 10;case ke.MODE_ALPHA_NUM:return 9;case ke.MODE_8BIT_BYTE:return 8;case ke.MODE_KANJI:return 8;default:throw"mode:"+r}else if(a<27)switch(r){case ke.MODE_NUMBER:return 12;case ke.MODE_ALPHA_NUM:return 11;case ke.MODE_8BIT_BYTE:return 16;case ke.MODE_KANJI:return 10;default:throw"mode:"+r}else if(a<41)switch(r){case ke.MODE_NUMBER:return 14;case ke.MODE_ALPHA_NUM:return 13;case ke.MODE_8BIT_BYTE:return 16;case ke.MODE_KANJI:return 12;default:throw"mode:"+r}else throw"type:"+a},o.getLostPoint=function(r){let a=r.getModuleCount(),c=0;for(let l=0;l<a;l+=1)for(let u=0;u<a;u+=1){let b=0,y=r.isDark(l,u);for(let m=-1;m<=1;m+=1)if(!(l+m<0||a<=l+m))for(let w=-1;w<=1;w+=1)u+w<0||a<=u+w||m==0&&w==0||y==r.isDark(l+m,u+w)&&(b+=1);b>5&&(c+=3+b-5)}for(let l=0;l<a-1;l+=1)for(let u=0;u<a-1;u+=1){let b=0;r.isDark(l,u)&&(b+=1),r.isDark(l+1,u)&&(b+=1),r.isDark(l,u+1)&&(b+=1),r.isDark(l+1,u+1)&&(b+=1),(b==0||b==4)&&(c+=3)}for(let l=0;l<a;l+=1)for(let u=0;u<a-6;u+=1)r.isDark(l,u)&&!r.isDark(l,u+1)&&r.isDark(l,u+2)&&r.isDark(l,u+3)&&r.isDark(l,u+4)&&!r.isDark(l,u+5)&&r.isDark(l,u+6)&&(c+=40);for(let l=0;l<a;l+=1)for(let u=0;u<a-6;u+=1)r.isDark(u,l)&&!r.isDark(u+1,l)&&r.isDark(u+2,l)&&r.isDark(u+3,l)&&r.isDark(u+4,l)&&!r.isDark(u+5,l)&&r.isDark(u+6,l)&&(c+=40);let d=0;for(let l=0;l<a;l+=1)for(let u=0;u<a;u+=1)r.isDark(u,l)&&(d+=1);let h=Math.abs(100*d/a/a-50)/5;return c+=h*10,c},o})(),qe=(function(){let s=new Array(256),t=new Array(256);for(let n=0;n<8;n+=1)s[n]=1<<n;for(let n=8;n<256;n+=1)s[n]=s[n-4]^s[n-5]^s[n-6]^s[n-8];for(let n=0;n<255;n+=1)t[s[n]]=n;let e={};return e.glog=function(n){if(n<1)throw"glog("+n+")";return t[n]},e.gexp=function(n){for(;n<0;)n+=255;for(;n>=256;)n-=255;return s[n]},e})(),rn=function(s,t){if(typeof s.length>"u")throw s.length+"/"+t;let e=(function(){let o=0;for(;o<s.length&&s[o]==0;)o+=1;let i=new Array(s.length-o+t);for(let r=0;r<s.length-o;r+=1)i[r]=s[r+o];return i})(),n={};return n.getAt=function(o){return e[o]},n.getLength=function(){return e.length},n.multiply=function(o){let i=new Array(n.getLength()+o.getLength()-1);for(let r=0;r<n.getLength();r+=1)for(let a=0;a<o.getLength();a+=1)i[r+a]^=qe.gexp(qe.glog(n.getAt(r))+qe.glog(o.getAt(a)));return rn(i,0)},n.mod=function(o){if(n.getLength()-o.getLength()<0)return n;let i=qe.glog(n.getAt(0))-qe.glog(o.getAt(0)),r=new Array(n.getLength());for(let a=0;a<n.getLength();a+=1)r[a]=n.getAt(a);for(let a=0;a<o.getLength();a+=1)r[a]^=qe.gexp(qe.glog(o.getAt(a))+i);return rn(r,0).mod(o)},n},ia=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(o,i){let r={};return r.totalCount=o,r.dataCount=i,r},e={},n=function(o,i){switch(i){case on.L:return s[(o-1)*4+0];case on.M:return s[(o-1)*4+1];case on.Q:return s[(o-1)*4+2];case on.H:return s[(o-1)*4+3];default:return}};return e.getRSBlocks=function(o,i){let r=n(o,i);if(typeof r>"u")throw"bad rs block @ typeNumber:"+o+"/errorCorrectionLevel:"+i;let a=r.length/3,c=[];for(let d=0;d<a;d+=1){let h=r[d*3+0],l=r[d*3+1],u=r[d*3+2];for(let b=0;b<h;b+=1)c.push(t(l,u))}return c},e})(),oa=function(){let s=[],t=0,e={};return e.getBuffer=function(){return s},e.getAt=function(n){let o=Math.floor(n/8);return(s[o]>>>7-n%8&1)==1},e.put=function(n,o){for(let i=0;i<o;i+=1)e.putBit((n>>>o-i-1&1)==1)},e.getLengthInBits=function(){return t},e.putBit=function(n){let o=Math.floor(t/8);s.length<=o&&s.push(0),n&&(s[o]|=128>>>t%8),t+=1},e},jd=function(s){let t=ke.MODE_NUMBER,e=s,n={};n.getMode=function(){return t},n.getLength=function(r){return e.length},n.write=function(r){let a=e,c=0;for(;c+2<a.length;)r.put(o(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?r.put(o(a.substring(c,c+1)),4):a.length-c==2&&r.put(o(a.substring(c,c+2)),7))};let o=function(r){let a=0;for(let c=0;c<r.length;c+=1)a=a*10+i(r.charAt(c));return a},i=function(r){if("0"<=r&&r<="9")return r.charCodeAt(0)-48;throw"illegal char :"+r};return n},zd=function(s){let t=ke.MODE_ALPHA_NUM,e=s,n={};n.getMode=function(){return t},n.getLength=function(i){return e.length},n.write=function(i){let r=e,a=0;for(;a+1<r.length;)i.put(o(r.charAt(a))*45+o(r.charAt(a+1)),11),a+=2;a<r.length&&i.put(o(r.charAt(a)),6)};let o=function(i){if("0"<=i&&i<="9")return i.charCodeAt(0)-48;if("A"<=i&&i<="Z")return i.charCodeAt(0)-65+10;switch(i){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+i}};return n},Hd=function(s){let t=ke.MODE_8BIT_BYTE,e=s,n=Mt.stringToBytes(s),o={};return o.getMode=function(){return t},o.getLength=function(i){return n.length},o.write=function(i){for(let r=0;r<n.length;r+=1)i.put(n[r],8)},o},Ud=function(s){let t=ke.MODE_KANJI,e=s,n=Mt.stringToBytes;(function(r,a){let c=n(r);if(c.length!=2||(c[0]<<8|c[1])!=a)throw"sjis not supported."})("友",38726);let o=n(s),i={};return i.getMode=function(){return t},i.getLength=function(r){return~~(o.length/2)},i.write=function(r){let a=o,c=0;for(;c+1<a.length;){let d=(255&a[c])<<8|255&a[c+1];if(33088<=d&&d<=40956)d-=33088;else if(57408<=d&&d<=60351)d-=49472;else throw"illegal char at "+(c+1)+"/"+d;d=(d>>>8&255)*192+(d&255),r.put(d,13),c+=2}if(c<a.length)throw"illegal char at "+(c+1)},i},ra=function(){let s=[],t={};return t.writeByte=function(e){s.push(e&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,o){n=n||0,o=o||e.length;for(let i=0;i<o;i+=1)t.writeByte(e[i+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return s},t.toString=function(){let e="";e+="[";for(let n=0;n<s.length;n+=1)n>0&&(e+=","),e+=s[n];return e+="]",e},t},Fd=function(){let s=0,t=0,e=0,n="",o={},i=function(a){n+=String.fromCharCode(r(a&63))},r=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return o.writeByte=function(a){for(s=s<<8|a&255,t+=8,e+=1;t>=6;)i(s>>>t-6),t-=6},o.flush=function(){if(t>0&&(i(s<<6-t),s=0,t=0),e%3!=0){let a=3-e%3;for(let c=0;c<a;c+=1)n+="="}},o.toString=function(){return n},o},Wd=function(s){let t=s,e=0,n=0,o=0,i={};i.read=function(){for(;o<8;){if(e>=t.length){if(o==0)return-1;throw"unexpected end of file./"+o}let c=t.charAt(e);if(e+=1,c=="=")return o=0,-1;if(c.match(/^\s$/))continue;n=n<<6|r(c.charCodeAt(0)),o+=6}let a=n>>>o-8&255;return o-=8,a};let r=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return i},Kd=function(s,t){let e=s,n=t,o=new Array(s*t),i={};i.setPixel=function(d,h,l){o[h*e+d]=l},i.write=function(d){d.writeString("GIF87a"),d.writeShort(e),d.writeShort(n),d.writeByte(128),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(255),d.writeByte(255),d.writeByte(255),d.writeString(","),d.writeShort(0),d.writeShort(0),d.writeShort(e),d.writeShort(n),d.writeByte(0);let h=2,l=a(h);d.writeByte(h);let u=0;for(;l.length-u>255;)d.writeByte(255),d.writeBytes(l,u,255),u+=255;d.writeByte(l.length-u),d.writeBytes(l,u,l.length-u),d.writeByte(0),d.writeString(";")};let r=function(d){let h=d,l=0,u=0,b={};return b.write=function(y,m){if(y>>>m)throw"length over";for(;l+m>=8;)h.writeByte(255&(y<<l|u)),m-=8-l,y>>>=8-l,u=0,l=0;u=y<<l|u,l=l+m},b.flush=function(){l>0&&h.writeByte(u)},b},a=function(d){let h=1<<d,l=(1<<d)+1,u=d+1,b=c();for(let g=0;g<h;g+=1)b.add(String.fromCharCode(g));b.add(String.fromCharCode(h)),b.add(String.fromCharCode(l));let y=ra(),m=r(y);m.write(h,u);let w=0,M=String.fromCharCode(o[w]);for(w+=1;w<o.length;){let g=String.fromCharCode(o[w]);w+=1,b.contains(M+g)?M=M+g:(m.write(b.indexOf(M),u),b.size()<4095&&(b.size()==1<<u&&(u+=1),b.add(M+g)),M=g)}return m.write(b.indexOf(M),u),m.write(l,u),m.flush(),y.toByteArray()},c=function(){let d={},h=0,l={};return l.add=function(u){if(l.contains(u))throw"dup key:"+u;d[u]=h,h+=1},l.size=function(){return h},l.indexOf=function(u){return d[u]},l.contains=function(u){return typeof d[u]<"u"},l};return i},Gd=function(s,t,e){let n=Kd(s,t);for(let a=0;a<t;a+=1)for(let c=0;c<s;c+=1)n.setPixel(c,a,e(c,a));let o=ra();n.write(o);let i=Fd(),r=o.toByteArray();for(let a=0;a<r.length;a+=1)i.writeByte(r[a]);return i.flush(),"data:image/gif;base64,"+i},aa=Mt,Bu=Mt.stringToBytes;function la(s){let t=aa(0,"M");t.addData(s),t.make();let e=t.getModuleCount(),n="";for(let o=0;o<e;o++)for(let i=0;i<e;i++)t.isDark(o,i)&&(n+=`M${i} ${o}h1v1h-1z`);return{size:e,d:n}}var Vd=1e4,an=class extends Se{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,n){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,n))}async newCode(){try{let e=await na();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof pt&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),Vd)}}async poll(e){let n=this.secret;if(n)try{let o=await sa(n,location.origin);if(!this.running||n!==this.secret)return;if(this.problem=null,o.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:o.auth}));return}if(o.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return $;let{size:e,d:n}=la(ta(location.origin,this.code));return f`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${le`<path d=${n} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return f`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?ea(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${di}?${hi}</span> and type the code.
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
    </div>`}};an.styles=Qe`
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
  `,an.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",an);var ui="hassTokens";function ca(){try{let s=localStorage.getItem(ui);return s?JSON.parse(s):null}catch{return null}}function pi(s){try{s?localStorage.setItem(ui,JSON.stringify(s)):localStorage.removeItem(ui)}catch{}}function qd(s){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=s)}function Yd(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(t=>{let e=n=>{s.stop(),s.hidden=!0,t(n)};s.addEventListener("paired",n=>e(n.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function Xd(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let t=location.search.includes("auth_callback");if(!t&&!ca()){let e=await Yd();e&&pi(e)}try{let e=await Li({hassUrl:location.origin,loadTokens:async()=>ca(),saveTokens:pi});t&&history.replaceState(null,"",location.pathname+js(location.search));let n=await Di({auth:e});s.backend=new fn(n),Gr(n),Kr(n,Wr(import.meta.url),{reload:Jd,idleFor:()=>Date.now()-pa}),n.addEventListener("reconnect-error",(o,i)=>{i===2&&ha()})}catch(e){if(e===2){ha();return}qd(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}var pa=Date.now();for(let s of["pointerdown","keydown","wheel"])document.addEventListener(s,()=>pa=Date.now(),{capture:!0,passive:!0});var da="mydashlight-reloaded-for";function Jd(s){try{if(sessionStorage.getItem(da)===s)return;sessionStorage.setItem(da,s)}catch{}location.reload()}function ha(){pi(null),location.replace(location.pathname+js(location.search))}var fa=lt(location.search),ua=document.querySelector("mydashlight-keyboard");ua&&fa.keyboard!==!1&&Qr(ua);fa.cursor!=="show"&&Fr();Xd();
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
