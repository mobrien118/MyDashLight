var Nr=Object.defineProperty;var Rn=(s,n)=>()=>(s&&(n=s(s=0)),n);var jr=(s,n)=>{for(var e in n)Nr(s,e,{get:n[e],enumerable:!0})};function $n(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function xs(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function Ja(s,n){let e=new Set,t=[];for(let o of s){let i=n(o);e.has(i)||(e.add(i),t.push(o))}return t}function So(s){return Ja(s,n=>n.unicode)}function Xa(s){function n(e,t,o){let i=t?s.createObjectStore(e,{keyPath:t}):s.createObjectStore(e);if(o)for(let[r,[a,c]]of Object.entries(o))i.createIndex(r,a,{multiEntry:c});return i}n(vt),n(st,Ka,{[Do]:[Fa,!0],[Ro]:[[Wa,Va]],[Io]:[qa,!0]}),n(Es,void 0,{[Lo]:[""]})}function Bo(s,n,e){e.onerror=()=>n(e.error),e.onblocked=()=>n(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function Za(s){let n=await new Promise((e,t)=>{let o=indexedDB.open(s,Ua);ks[s]=o,o.onupgradeneeded=i=>{i.oldVersion<Ha&&Xa(o.result)},Bo(e,t,o)});return n.onclose=()=>_s(s),n}function Qa(s){return Tn[s]||(Tn[s]=Za(s)),Tn[s]}function je(s,n,e,t){return new Promise((o,i)=>{let r=s.transaction(n,e,{durability:"relaxed"}),a=typeof n=="string"?r.objectStore(n):n.map(l=>r.objectStore(l)),c;t(a,r,l=>{c=l}),r.oncomplete=()=>o(c),r.onerror=()=>i(r.error)})}function _s(s){let n=ks[s],e=n&&n.result;if(e){e.close();let t=Cn[s];if(t)for(let o of t)o()}delete ks[s],delete Tn[s],delete Cn[s]}function el(s){return new Promise((n,e)=>{_s(s);let t=indexedDB.deleteDatabase(s);Bo(n,e,t)})}function tl(s,n){let e=Cn[s];e||(e=Cn[s]=[]),e.push(n)}function yt(s){return s.split(/[\s_]+/).map(n=>!n.match(/\w/)||nl.has(n)?n.toLowerCase():n.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function Oo(s){return s.filter(Boolean).map(n=>n.toLowerCase()).filter(n=>n.length>=sl)}function il(s){return s.map(({annotation:e,emoticon:t,group:o,order:i,shortcodes:r,skins:a,tags:c,emoji:l,version:d})=>{let h=[...new Set(Oo([...(r||[]).map(yt).flat(),...(c||[]).map(yt).flat(),...yt(e),t]))].sort(),u={annotation:e,group:o,order:i,tags:c,tokens:h,unicode:l,version:d};if(t&&(u.emoticon=t),r&&(u.shortcodes=r),a){u.skinTones=[],u.skinUnicodes=[],u.skinVersions=[];for(let{tone:g,emoji:A,version:b}of a)u.skinTones.push(g),u.skinUnicodes.push(A),u.skinVersions.push(b)}return u})}function No(s,n,e,t){s[n](e).onsuccess=o=>t&&t(o.target.result)}function nt(s,n,e){No(s,"get",n,e)}function jo(s,n,e){No(s,"getAll",n,e)}function Cs(s){s.commit&&s.commit()}function ol(s,n){let e=s[0];for(let t=1;t<s.length;t++){let o=s[t];n(e)>n(o)&&(e=o)}return e}function zo(s,n){let e=ol(s,o=>o.length),t=[];for(let o of e)s.some(i=>i.findIndex(r=>n(r)===n(o))===-1)||t.push(o);return t}async function rl(s){return!await As(s,vt,_n)}async function al(s,n,e){let[t,o]=await Promise.all([ws,_n].map(i=>As(s,vt,i)));return t===e&&o===n}async function ll(s,n){return je(s,st,wt,(t,o,i)=>{let r,a=()=>{t.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let l=c.target.result;for(let d of l)if(r=d.unicode,n(d))return i(d);if(l.length<50)return i();a()}};a()})}async function Uo(s,n,e,t){try{let o=il(n);await je(s,[st,vt],Ts,([i,r],a)=>{let c,l,d=0;function h(){++d===2&&u()}function u(){if(!(c===t&&l===e)){i.clear();for(let g of o)i.put(g);r.put(t,ws),r.put(e,_n),Cs(a)}}nt(r,ws,g=>{c=g,h()}),nt(r,_n,g=>{l=g,h()})})}finally{}}async function cl(s,n){return je(s,st,wt,(e,t,o)=>{let i=IDBKeyRange.bound([n,0],[n+1,0],!1,!0);jo(e.index(Ro),i,o)})}async function Ho(s,n){let e=Oo(yt(n));return e.length?je(s,st,wt,(t,o,i)=>{let r=[],a=()=>{r.length===e.length&&c()},c=()=>{let l=zo(r,d=>d.unicode);i(l.sort((d,h)=>d.order<h.order?-1:1))};for(let l=0;l<e.length;l++){let d=e[l],h=l===e.length-1?IDBKeyRange.bound(d,d+"￿",!1,!0):IDBKeyRange.only(d);jo(t.index(Do),h,u=>{r.push(u),a()})}}):[]}async function dl(s,n){let e=await Ho(s,n);return e.length?e.filter(t=>(t.shortcodes||[]).map(i=>i.toLowerCase()).includes(n.toLowerCase()))[0]||null:await ll(s,o=>(o.shortcodes||[]).includes(n.toLowerCase()))||null}async function hl(s,n){return je(s,st,wt,(e,t,o)=>nt(e,n,i=>{if(i)return o(i);nt(e.index(Io),n,r=>o(r||null))}))}function As(s,n,e){return je(s,n,wt,(t,o,i)=>nt(t,e,i))}function ul(s,n,e,t){return je(s,n,Ts,(o,i)=>{o.put(t,e),Cs(i)})}function pl(s,n){return je(s,Es,Ts,(e,t)=>nt(e,n,o=>{e.put((o||0)+1,n),Cs(t)}))}function fl(s,n,e){return e===0?[]:je(s,[Es,st],wt,([t,o],i,r)=>{let a=[];t.index(Lo).openCursor(void 0,"prev").onsuccess=c=>{let l=c.target.result;if(!l)return r(a);function d(g){if(a.push(g),a.length===e)return r(a);l.continue()}let h=l.primaryKey,u=n.byName(h);if(u)return d(u);nt(o,h,g=>{if(g)return d(g);l.continue()})}})}function gl(s,n){let e=new Map;for(let o of s){let i=n(o);for(let r of i){let a=e;for(let l=0;l<r.length;l++){let d=r.charAt(l),h=a.get(d);h||(h=new Map,a.set(d,h)),a=h}let c=a.get(En);c||(c=[],a.set(En,c)),c.push(o)}}return(o,i)=>{let r=e;for(let l=0;l<o.length;l++){let d=o.charAt(l),h=r.get(d);if(h)r=h;else return[]}if(i)return r.get(En)||[];let a=[],c=[r];for(;c.length;){let d=[...c.shift().entries()].sort((h,u)=>h[0]<u[0]?-1:1);for(let[h,u]of d)h===En?a.push(...u):c.push(u)}return a}}function bl(s){let n=s&&Array.isArray(s),e=n&&s.length&&(!s[0]||ml.some(t=>!(t in s[0])));if(!n||e)throw new Error("Custom emojis are in the wrong format")}function Mo(s){bl(s);let n=(u,g)=>u.name.toLowerCase()<g.name.toLowerCase()?-1:1,e=s.sort(n),o=gl(s,u=>{let g=new Set;if(u.shortcodes)for(let A of u.shortcodes)for(let b of yt(A))g.add(b);return g}),i=u=>o(u,!0),r=u=>o(u,!1),a=u=>{let g=yt(u),A=g.map((b,k)=>(k<g.length-1?i:r)(b));return zo(A,b=>b.name).sort(n)},c=new Map,l=new Map;for(let u of s){l.set(u.name.toLowerCase(),u);for(let g of u.shortcodes||[])c.set(g.toLowerCase(),u)}return{all:e,search:a,byShortcode:u=>c.get(u.toLowerCase()),byName:u=>l.get(u.toLowerCase())}}function Ot(s){if(!s)return s;if(yl&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let n=s.skinTones.length;s.skins=Array(n);for(let e=0;e<n;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function Fo(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function xl(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||vl.some(n=>!(n in s[0])))throw new Error("Emoji data is in the wrong format")}function Ko(s,n){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+n+":  "+s.status)}async function wl(s){let n=await fetch(s,{method:"HEAD"});Ko(n,s);let e=n.headers.get("etag");return Fo(e),e}async function $s(s){let n=await fetch(s);Ko(n,s);let e=n.headers.get("etag");Fo(e);let t=await n.json();return xl(t),[e,t]}function kl(s){for(var n="",e=new Uint8Array(s),t=e.byteLength,o=-1;++o<t;)n+=String.fromCharCode(e[o]);return n}function $l(s){for(var n=s.length,e=new ArrayBuffer(n),t=new Uint8Array(e),o=-1;++o<n;)t[o]=s.charCodeAt(o);return e}async function Wo(s){let n=JSON.stringify(s),e=$l(n),t=await crypto.subtle.digest("SHA-1",e),o=kl(t);return btoa(o)}async function El(s,n){let e,t=await wl(n);if(!t){let o=await $s(n);t=o[0],e=o[1],t||(t=await Wo(e))}await al(s,n,t)||(e||(e=(await $s(n))[1]),await Uo(s,e,n,t))}async function Tl(s,n){let[e,t]=await $s(n);e||(e=await Wo(t)),await Uo(s,t,n,e)}async function _l(s,n){try{await El(s,n)}catch(e){if(e.name!=="InvalidStateError")throw e}}var Ua,Ha,st,vt,Es,Fa,Do,Ka,Lo,Wa,Va,Ro,ws,_n,Po,wt,Ts,Io,qa,Ga,Ya,ks,Tn,Cn,nl,sl,En,ml,yl,vl,xt,Ps=Rn(()=>{Ua=1,Ha=1,st="emoji",vt="keyvalue",Es="favorites",Fa="tokens",Do="tokens",Ka="unicode",Lo="count",Wa="group",Va="order",Ro="group-order",ws="eTag",_n="url",Po="skinTone",wt="readonly",Ts="readwrite",Io="skinUnicodes",qa="skinUnicodes",Ga="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Ya="en";ks={},Tn={},Cn={};nl=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);sl=2;En="";ml=["name","url"];yl=typeof wrappedJSObject<"u";vl=["annotation","emoji","group","order","version"];xt=class{constructor({dataSource:n=Ga,locale:e=Ya,customEmoji:t=[]}={}){this.dataSource=n,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=Mo(t),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let n=this._db=await Qa(this._dbName);tl(this._dbName,this._clear);let e=this.dataSource;await rl(n)?await Tl(n,e):this._lazyUpdate=_l(n,e)}async ready(){let n=async()=>(this._ready||(this._ready=this._init()),this._ready);await n(),this._db||await n()}async getEmojiByGroup(n){return xs(n),await this.ready(),So(await cl(this._db,n)).map(Ot)}async getEmojiBySearchQuery(n){$n(n),await this.ready();let e=this._custom.search(n),t=So(await Ho(this._db,n)).map(Ot);return[...e,...t]}async getEmojiByShortcode(n){$n(n),await this.ready();let e=this._custom.byShortcode(n);return e||Ot(await dl(this._db,n))}async getEmojiByUnicodeOrName(n){$n(n),await this.ready();let e=this._custom.byName(n);return e||Ot(await hl(this._db,n))}async getPreferredSkinTone(){return await this.ready(),await As(this._db,vt,Po)||0}async setPreferredSkinTone(n){return xs(n),await this.ready(),ul(this._db,vt,Po,n)}async incrementFavoriteEmojiCount(n){return $n(n),await this.ready(),pl(this._db,n)}async getTopFavoriteEmoji(n){return xs(n),await this.ready(),(await fl(this._db,this._custom,n)).map(Ot)}set customEmoji(n){this._custom=Mo(n)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await _s(this._dbName)}async delete(){await this._shutdown(),await el(this._dbName)}}});function qo(s){return s.unicode.includes("‍")}function Il(s){let n=Go(s,"#000"),e=Go(s,"#fff");return n&&e&&Rl(n,e)}function Bl(){let s=Object.entries(Al);try{for(let[n,e]of s)if(Il(n))return e}catch{}finally{}return s[0][1]}function Hl(s,n){if(n===0)return s;let e=s.indexOf(jl);return e!==-1?s.substring(0,e)+String.fromCodePoint(zl+n-1)+s.substring(e):(s.endsWith(Ol)&&(s=s.substring(0,s.length-1)),s+Nl+String.fromCodePoint(Ul+n-1))}function Le(s){s.preventDefault(),s.stopPropagation()}function Ls(s,n,e){return n+=s?-1:1,n<0?n=e.length-1:n>=e.length&&(n=0),n}function sr(s,n){let e=new Set,t=[];for(let o of s){let i=n(o);e.has(i)||(e.add(i),t.push(o))}return t}function Fl(s,n){let e=t=>{let o={};for(let i of t)typeof i.tone=="number"&&i.version<=n&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:t,skins:o,shortcodes:i,url:r,name:a,category:c,annotation:l})=>({unicode:t,name:a,shortcodes:i,url:r,category:c,annotation:l,id:t||a,skins:o&&e(o)}))}function Wl(s,n,e){let t;Kl?(t=new ResizeObserver(e),t.observe(s)):Pn(e),n.addEventListener("abort",()=>{t&&t.disconnect()})}function Yo(s){{let n=document.createRange();return n.selectNode(s.firstChild),n.getBoundingClientRect().width}}function Jo(s,n,e){let t=Yo(n);if(!t){if(!it){it=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])it.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(it),it.firstChild.nodeValue=s,Yo(it)}finally{it.remove()}}return t}function ql(s,n,e){let t=!0;for(let o of s){let i=e(o);if(!i)continue;typeof Rs>"u"&&(Rs=Jo(Vl,n,n));let a=Jo(o.unicode,i,n)/1.8<Rs;Ns.set(o.unicode,a),a||(t=!1)}return t}function Gl(s){return sr(s,n=>n)}function Yl(s){s&&(s.scrollTop=0)}function Nt(s,n,e){let t=s.get(n);return t||(t=e(),s.set(n,t)),t}function Xo(s){return""+s}function Jl(s){let n=document.createElement("template");return n.innerHTML=s,n}function tc(s,n){ec?s.replaceChildren(...n):(s.innerHTML="",s.append(...n))}function nc(s,n){let e=s.firstChild,t=0;for(;e;){if(n[t]!==e)return!0;e=e.nextSibling,t++}return t!==n.length}function sc(s,n){let{targetNode:e}=n,{targetParentNode:t}=n,o=!1;t?o=nc(t,s):(o=!0,n.targetNode=void 0,n.targetParentNode=t=e.parentNode),o&&tc(t,s)}function ic(s,n){for(let e of n){let{targetNode:t,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:a,attributeValuePost:c}}=e,l=s[i];if(o!==l)if(e.currentExpression=l,r)if(l===null)t.removeAttribute(r);else{let d=a+Xo(l)+c;t.setAttribute(r,d)}else{let d;Array.isArray(l)?sc(l,e):l instanceof Element?(d=l,t.replaceWith(d)):t.nodeValue=Xo(l),d&&(e.targetNode=d)}}}function oc(s){let n="",e=!1,t=!1,o=-1,i=new Map,r=[],a=0;for(let l=0,d=s.length;l<d;l++){let h=s[l];if(n+=h.slice(a),l===d-1)break;for(let p=0;p<h.length;p++)switch(h.charAt(p)){case"<":{h.charAt(p+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,t=!1;break}case"=":{t=!0;break}}let u=r[r.length-1],g=Nt(i,u,()=>[]),A,b,k;if(t){let p=/(\S+)="?([^"=]*)$/.exec(h);A=p[1],b=p[2];let O=/^([^">]*)("?)/.exec(s[l+1]);k=O[1],n=n.slice(0,-1*p[0].length),a=O[0].length}else a=0;let $={attributeName:A,attributeValuePre:b,attributeValuePost:k,expressionIndex:l};g.push($),!e&&!t&&(n+=" ")}return{template:Jl(n),elementsToBindings:i}}function Zo(s,n,e){for(let t=0;t<s.length;t++){let o=s[t],i=o.attributeName?n:n.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function rc(s,n){let e=[],t;if(n.size===1&&(t=n.get(0)))Zo(t,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let a=n.get(++r);a&&Zo(a,i,e)}while(i=o.nextNode())}return e}function ac(s){let{template:n,elementsToBindings:e}=Nt(Xl,s,()=>oc(s)),t=n.cloneNode(!0).content.firstElementChild,o=rc(t,e);return function(r){return ic(r,o),t}}function lc(s){let n=Nt(Zl,s,()=>new Map),e=Ql;function t(i,...r){let a=Nt(n,i,()=>new Map);return Nt(a,e,()=>ac(i))(r)}function o(i,r,a){return i.map((c,l)=>{let d=e;e=a(c);try{return r(c,l)}finally{e=d}})}return{map:o,html:t}}function cc(s,n,e,t,o,i,r,a,c){let{labelWithSkin:l,titleForEmoji:d,unicodeWithSkin:h}=e,{html:u,map:g}=lc(n);function A(p,O,H){return g(p,(q,ue)=>u`<button role="${O?"option":"menuitem"}" aria-selected="${O?ue===n.activeSearchItem:null}" aria-label="${l(q,n.currentSkinTone)}" title="${d(q)}" class="${"emoji"+(O&&ue===n.activeSearchItem?" active":"")+(q.unicode?"":" custom-emoji")}" id="${`${H}-${q.id}`}" style="${q.unicode?null:`--custom-emoji-background: url(${JSON.stringify(q.url)})`}">${q.unicode?h(q,n.currentSkinTone):""}</button>`,q=>`${H}-${q.id}`)}let k=u`<section data-ref="rootElement" class="picker" aria-label="${n.i18n.regionLabel}" style="${n.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${n.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(n.searchMode&&n.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${n.activeSearchItemId?`emo-${n.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${n.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${n.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${n.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${n.skinTonePickerExpanded?"hide-focus":""}" aria-label="${n.skinToneButtonLabel}" title="${n.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${n.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${n.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${n.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${n.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${n.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${n.i18n.skinTonesLabel}" aria-activedescendant="skintone-${n.activeSkinTone}" aria-hidden="${!n.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${g(n.skinTones,(p,O)=>u`<div id="skintone-${O}" class="emoji ${O===n.activeSkinTone?"active":""}" aria-selected="${O===n.activeSkinTone}" role="option" title="${n.i18n.skinTones[O]}" aria-label="${n.i18n.skinTones[O]}">${p}</div>`,p=>p)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${n.groups.length},1fr)" aria-label="${n.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${g(n.groups,p=>u`<button role="tab" class="nav-button" aria-controls="tab-${p.id}" aria-label="${n.i18n.categories[p.name]}" aria-selected="${!n.searchMode&&n.currentGroup.id===p.id}" title="${n.i18n.categories[p.name]}" data-group-id="${p.id}"><div class="nav-emoji emoji">${p.emoji}</div></button>`,p=>p.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(n.isRtl?-1:1)*n.currentGroupIndex*100}%)"></div></div><div class="message ${n.message?"":"gone"}" role="alert" aria-live="polite">${n.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!n.databaseLoaded||n.message?"gone":""}" role="${n.searchMode?"region":"tabpanel"}" aria-label="${n.searchMode?n.i18n.searchResultsLabel:n.i18n.categories[n.currentGroup.name]}" id="${n.searchMode?null:`tab-${n.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${g(n.currentEmojisWithCategories,(p,O)=>u`<div><div id="menu-label-${O}" class="category ${n.currentEmojisWithCategories.length===1&&n.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${n.searchMode?n.i18n.searchResultsLabel:p.category?p.category:n.currentEmojisWithCategories.length>1?n.i18n.categories.custom:n.i18n.categories[n.currentGroup.name]}</div><div class="emoji-menu ${O!==0&&!n.searchMode&&n.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(p.emojis.length/n.numColumns)}`}" data-action="updateOnIntersection" role="${n.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${O}" id="${n.searchMode?"search-results":null}">${A(p.emojis,n.searchMode,"emo")}</div></div>`,p=>p.category)}</div></div><div class="favorites onscreen emoji-menu ${n.message?"gone":""}" role="menu" aria-label="${n.i18n.favoritesLabel}" data-on-click="onEmojiClick">${A(n.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,$=(p,O)=>{for(let H of s.querySelectorAll(`[${p}]`))O(H,H.getAttribute(p))};if(c){s.appendChild(k);for(let p of["click","focusout","input","keydown","keyup"])$(`data-on-${p}`,(O,H)=>{O.addEventListener(p,t[H])});$("data-ref",(p,O)=>{i[O]=p}),r.addEventListener("abort",()=>{s.removeChild(k)})}$("data-action",(p,O)=>{let H=a.get(O);H||a.set(O,H=new WeakSet),H.has(p)||(H.add(p),o[O](p))})}function dc(s){let n=!1,e,t=new Map,o=new Set,i,r=()=>{if(n)return;let l=[...o];o.clear();try{for(let d of l)d()}finally{i=!1,o.size&&(i=!0,Sn(r))}},a=new Proxy({},{get(l,d){if(e){let h=t.get(d);h||(h=new Set,t.set(d,h)),h.add(e)}return l[d]},set(l,d,h){if(l[d]!==h){l[d]=h;let u=t.get(d);if(u){for(let g of u)o.add(g);i||(i=!0,Sn(r))}}return!0}}),c=l=>{let d=()=>{let h=e;e=d;try{return l()}finally{e=h}};return d()};return s.addEventListener("abort",()=>{n=!0}),{state:a,createEffect:c}}function Is(s,n,e){if(s.length!==n.length)return!1;for(let t=0;t<s.length;t++)if(!e(s[t],n[t]))return!1;return!0}function hc(s,n,e){{let t=s.closest(".tabpanel"),o=Qo.get(t);o||(o=new IntersectionObserver(e,{root:t,rootMargin:"50% 0px 50% 0px",threshold:0}),Qo.set(t,o),n.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function uc(s,n){let e={},t=new AbortController,o=t.signal,{state:i,createEffect:r}=dc(o),a=new Map;An(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),An(i,n),An(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:Ml,isRtl:!1,currentGroupIndex:0,groups:Ss,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let c=y=>{s.getElementById(y).focus()},l=y=>s.getElementById(`emo-${y.id}`),d=(y,C)=>{e.rootElement.dispatchEvent(new CustomEvent(y,{detail:C,bubbles:!0,composed:!0}))},h=(y,C)=>y.id===C.id,u=(y,C)=>{let{category:P,emojis:S}=y,{category:K,emojis:L}=C;return P!==K?!1:Is(S,L,h)},g=y=>{Is(i.currentEmojis,y,h)||(i.currentEmojis=y)},A=y=>{i.searchMode!==y&&(i.searchMode=y)},b=y=>{Is(i.currentEmojisWithCategories,y,u)||(i.currentEmojisWithCategories=y)},k=(y,C)=>C&&y.skins&&y.skins[C]||y.unicode,O={labelWithSkin:(y,C)=>Gl([y.name||k(y,C),y.annotation,...y.shortcodes||Bs].filter(Boolean)).join(", "),titleForEmoji:y=>y.annotation||(y.shortcodes||Bs).join(", "),unicodeWithSkin:k},H={onClickSkinToneButton:te,onEmojiClick:me,onNavClick:J,onNavKeydown:oe,onSearchKeydown:z,onSkinToneOptionsClick:j,onSkinToneOptionsFocusOut:U,onSkinToneOptionsKeydown:m,onSkinToneOptionsKeyup:D,onSearchInput:I},q={calculateEmojiGridStyle:w,updateOnIntersection:v},ue=!0;r(()=>{cc(s,i,O,H,q,e,o,a,ue),ue=!1}),i.emojiVersion||Ds().then(y=>{y||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function y(){let C=!1,P=setTimeout(()=>{C=!0,i.message=i.i18n.loadingMessage},Pl);try{await i.database.ready(),i.databaseLoaded=!0}catch(S){console.error(S),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(P),C&&(C=!1,i.message="")}}i.database&&y()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${Vo};`}),r(()=>{i.customEmoji&&i.database&&x()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==Os&&(i.groups=Os):i.groups!==Ss&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=Ss)}),r(()=>{async function y(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}y()}),r(()=>{i.skinTones=Array(Vo).fill().map((y,C)=>Hl(i.skinToneEmoji,C))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function y(){let{database:C}=i,P=(await Promise.all(Dl.map(S=>C.getEmojiByUnicodeOrName(S)))).filter(Boolean);i.defaultFavoriteEmojis=P}i.databaseLoaded&&y()});function x(){let{customEmoji:y,database:C}=i,P=y||Bs;C.customEmoji!==P&&(C.customEmoji=P)}r(()=>{async function y(){x();let{database:C,defaultFavoriteEmojis:P,numColumns:S}=i,K=await C.getTopFavoriteEmoji(S),L=await W(sr([...K,...P],ee=>ee.unicode||ee.name).slice(0,S));i.currentFavorites=L}i.databaseLoaded&&i.defaultFavoriteEmojis&&y()});function w(y){Wl(y,o,()=>{{let C=getComputedStyle(e.rootElement),P=parseInt(C.getPropertyValue("--num-columns"),10),S=C.getPropertyValue("direction")==="rtl";i.numColumns=P,i.isRtl=S}})}function v(y){hc(y,o,C=>{for(let{target:P,isIntersecting:S}of C)P.classList.toggle("onscreen",S)})}r(()=>{async function y(){let{searchText:C,currentGroup:P,databaseLoaded:S,customEmoji:K}=i;if(!S)i.currentEmojis=[],i.searchMode=!1;else if(C.length>=Cl){let L=await Q(C);i.searchText===C&&(g(L),A(!0))}else{let{id:L}=P;if(L!==-1||K&&K.length){let ee=await X(L);i.currentGroup.id===L&&(g(ee),A(!1))}}}y()});let E=()=>{Pn(()=>Yl(e.tabpanelElement))};r(()=>{let{currentEmojis:y,emojiVersion:C}=i,P=y.filter(S=>S.unicode).filter(S=>qo(S)&&!Ns.has(S.unicode));if(!C&&P.length)g(y),Pn(()=>_(P));else{let S=C?y:y.filter(M);g(S),E()}});function _(y){ql(y,e.baselineEmoji,l)?E():i.currentEmojis=[...i.currentEmojis]}function M(y){return!y.unicode||!qo(y)||Ns.get(y.unicode)}async function N(y){let C=i.emojiVersion||await Ds();return y.filter(({version:P})=>!P||P<=C)}async function W(y){return Fl(y,i.emojiVersion||await Ds())}async function X(y){let C=y===-1?i.customEmoji:await i.database.getEmojiByGroup(y);return W(await N(C))}async function Q(y){return W(await N(await i.database.getEmojiBySearchQuery(y)))}r(()=>{}),r(()=>{function y(){let{searchMode:P,currentEmojis:S}=i;if(P)return[{category:"",emojis:S}];let K=new Map;for(let L of S){let ee=L.category||"",fe=K.get(ee);fe||(fe=[],K.set(ee,fe)),fe.push(L)}return[...K.entries()].map(([L,ee])=>({category:L,emojis:ee})).sort((L,ee)=>i.customCategorySorting(L.category,ee.category))}let C=y();b(C)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:y}=i;tr(()=>{i.searchText=(y||"").trim(),i.activeSearchItem=-1})});function z(y){if(!i.searchMode||!i.currentEmojis.length)return;let C=P=>{Le(y),i.activeSearchItem=Ls(P,i.activeSearchItem,i.currentEmojis)};switch(y.key){case"ArrowDown":return C(!1);case"ArrowUp":return C(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return Le(y),ke(i.currentEmojis[i.activeSearchItem].id)}}function J(y){let{target:C}=y,P=C.closest(".nav-button");if(!P)return;let S=parseInt(P.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(K=>K.id===S)}function oe(y){let{target:C,key:P}=y,S=K=>{K&&(Le(y),K.focus())};switch(P){case"ArrowLeft":return S(C.previousElementSibling);case"ArrowRight":return S(C.nextElementSibling);case"Home":return S(C.parentElement.firstElementChild);case"End":return S(C.parentElement.lastElementChild)}}async function Z(y){let C=await i.database.getEmojiByUnicodeOrName(y),P=[...i.currentEmojis,...i.currentFavorites].find(K=>K.id===y),S=P.unicode&&k(P,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(y),{emoji:C,skinTone:i.currentSkinTone,...S&&{unicode:S},...P.name&&{name:P.name}}}async function ke(y){let C=Z(y);d("emoji-click-sync",C),d("emoji-click",await C)}function me(y){let{target:C}=y;if(!C.classList.contains("emoji"))return;Le(y);let P=C.id.substring(4);ke(P)}function le(y){i.currentSkinTone=y,i.skinTonePickerExpanded=!1,c("skintone-button"),d("skin-tone-change",{skinTone:y}),i.database.setPreferredSkinTone(y)}function j(y){let{target:{id:C}}=y,P=C&&C.match(/^skintone-(\d)/);if(!P)return;Le(y);let S=parseInt(P[1],10);le(S)}function te(y){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(Le(y),Pn(()=>c("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function m(y){if(!i.skinTonePickerExpanded)return;let C=async P=>{Le(y),i.activeSkinTone=P};switch(y.key){case"ArrowUp":return C(Ls(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return C(Ls(!1,i.activeSkinTone,i.skinTones));case"Home":return C(0);case"End":return C(i.skinTones.length-1);case"Enter":return Le(y),le(i.activeSkinTone);case"Escape":return Le(y),i.skinTonePickerExpanded=!1,c("skintone-button")}}function D(y){if(i.skinTonePickerExpanded)switch(y.key){case" ":return Le(y),le(i.activeSkinTone)}}async function U(y){let{relatedTarget:C}=y;(!C||C.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function I(y){i.rawSearchText=y.target.value}return{$set(y){An(i,y)},$destroy(){t.abort()}}}function er(s){s instanceof ot||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var Os,Ss,Cl,Vo,tr,Al,Pl,Sl,Ml,Dl,nr,Ll,Go,Rl,Ms,Ds,Ns,Ol,Nl,jl,zl,Ul,Pn,Kl,Vl,Rs,it,Xl,Zl,Ql,ec,Sn,Qo,Bs,An,pc,fc,gc,mc,ir,bc,ot,or,rr=Rn(()=>{Ps();Os=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,n,e])=>({id:s,emoji:n,name:e})),Ss=Os.slice(1),Cl=2,Vo=6,tr=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;Al={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},Pl=1e3,Sl="🖐️",Ml=8,Dl=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],nr='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',Ll=(s,n)=>s<n?-1:s>n?1:0,Go=(s,n)=>{let e=document.createElement("canvas");e.width=e.height=1;let t=e.getContext("2d",{willReadFrequently:!0});return t.textBaseline="top",t.font=`100px ${nr}`,t.fillStyle=n,t.scale(.01,.01),t.fillText(s,0,0),t.getImageData(0,0,1,1).data},Rl=(s,n)=>{let e=[...s].join(","),t=[...n].join(",");return e===t&&!e.startsWith("0,0,0,")};Ds=()=>(Ms||(Ms=new Promise(s=>tr(()=>s(Bl())))),Ms),Ns=new Map,Ol="️",Nl="\uD83C",jl="‍",zl=127995,Ul=57339;Pn=requestAnimationFrame,Kl=typeof ResizeObserver=="function";Vl="😀";Xl=new WeakMap,Zl=new WeakMap,Ql=Symbol("un-keyed"),ec="replaceChildren"in Element.prototype;Sn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);Qo=new WeakMap;Bs=[],{assign:An}=Object;pc="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",fc="en",gc={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},mc=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',ir=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],bc=`:host{--emoji-font-family:${nr}}`,ot=class extends HTMLElement{constructor(n){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=mc+bc,this.shadowRoot.appendChild(e),this._ctx={locale:fc,dataSource:pc,skinToneEmoji:Sl,customCategorySorting:Ll,customEmoji:null,i18n:gc,emojiVersion:null,...n};for(let t of ir)t!=="database"&&Object.prototype.hasOwnProperty.call(this,t)&&(this._ctx[t]=this[t],delete this[t]);this._dbFlush()}connectedCallback(){er(this),this._cmp||(this._cmp=uc(this.shadowRoot,this._ctx))}disconnectedCallback(){er(this),Sn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:n}=this._ctx;n.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(n,e,t){this._set(n.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),n==="emoji-version"?parseFloat(t):t)}_set(n,e){this._ctx[n]=e,this._cmp&&this._cmp.$set({[n]:e}),["locale","dataSource"].includes(n)&&this._dbFlush()}_dbCreate(){let{locale:n,dataSource:e,database:t}=this._ctx;(!t||t.locale!==n||t.dataSource!==e)&&this._set("database",new xt({locale:n,dataSource:e}))}_dbFlush(){Sn(()=>this._dbCreate())}},or={};for(let s of ir)or[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(n){if(s==="database")throw new Error("database is read-only");this._set(s,n)}};Object.defineProperties(ot.prototype,or);customElements.get("emoji-picker")||customElements.define("emoji-picker",ot)});var ar={};jr(ar,{Database:()=>xt,Picker:()=>ot});var lr=Rn(()=>{rr();Ps()});function ei(s){return{type:"auth",access_token:s}}function ti(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function ni(s){let n={type:"subscribe_events"};return s&&(n.event_type=s),n}function In(s){return{type:"unsubscribe_events",subscription:s}}function si(){return{type:"ping"}}function ii(s,n){return{type:"result",success:!1,error:{code:s,message:n}}}function ri(s){let n={},e=s.split("&");for(let t=0;t<e.length;t++){let o=e[t].split("="),i=decodeURIComponent(o[0]),r=o.length>1?decodeURIComponent(o[1]):void 0;n[i]=r}return n}var ai=(s,n,e,t)=>{let[o,i,r]=s.split(".",3);return Number(o)>n||Number(o)===n&&(t===void 0?Number(i)>=e:Number(i)>e)||t!==void 0&&Number(o)===n&&Number(i)===e&&Number(r)>=t};var qt=!1,Ur="auth_required",Hr="auth_invalid",Fr="auth_ok";function ci(s){if(!s.auth)throw 4;let n=s.auth,e=n.expired?n.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,t=n.wsUrl;qt&&console.log("[Auth phase] Initializing",t);function o(i,r,a){qt&&console.log("[Auth Phase] New connection",t);let c=new WebSocket(t),l=!1,d=()=>{if(c.removeEventListener("close",d),l){a(2);return}if(i===0){a(1);return}let g=i===-1?-1:i-1;setTimeout(()=>o(g,r,a),1e3)},h=async g=>{try{n.expired&&await(e||n.refreshAccessToken()),c.send(JSON.stringify(ei(n.accessToken)))}catch(A){l=A===2,c.close()}},u=async g=>{let A=JSON.parse(g.data);switch(qt&&console.log("[Auth phase] Received",A),A.type){case Hr:l=!0,c.close();break;case Fr:c.removeEventListener("open",h),c.removeEventListener("message",u),c.removeEventListener("close",d),c.removeEventListener("error",d),c.haVersion=A.ha_version,ai(c.haVersion,2022,9)&&c.send(JSON.stringify(ti())),r(c);break;default:qt&&A.type!==Ur&&console.warn("[Auth phase] Unhandled message",A)}};c.addEventListener("open",h),c.addEventListener("message",u),c.addEventListener("close",d),c.addEventListener("error",d)}return new Promise((i,r)=>o(s.setupRetry,i,r))}var Et=!1,Gt=class{constructor(n,e){this._handleMessage=t=>{let o=JSON.parse(t.data);Array.isArray(o)||(o=[o]),o.forEach(i=>{Et&&console.log("Received",i);let r=this.commands.get(i.id);switch(i.type){case"event":r?r.callback(i.event):(console.warn(`Received event for unknown subscription ${i.id}. Unsubscribing.`),this.sendMessagePromise(In(i.id)).catch(a=>{Et&&console.warn(` Error unsubsribing from unknown subscription ${i.id}`,a)}));break;case"result":r&&(i.success?(r.resolve(i.result),"subscribe"in r||this.commands.delete(i.id)):(r.reject(i.error),this.commands.delete(i.id)));break;case"pong":r?(r.resolve(),this.commands.delete(i.id)):console.warn(`Received unknown pong response ${i.id}`);break;default:Et&&console.warn("Unhandled message",i)}})},this._handleClose=async()=>{let t=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,t.forEach(r=>{"subscribe"in r||r.reject(ii(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let o=Object.assign(Object.assign({},this.options),{setupRetry:0}),i=r=>{setTimeout(async()=>{if(!this.closeRequested){Et&&console.log("Trying to reconnect");try{let a=await o.createSocket(o);this._setSocket(a)}catch(a){if(this._queuedMessages){let c=this._queuedMessages;this._queuedMessages=void 0;for(let l of c)l.reject&&l.reject(3)}a===2?this.fireEvent("reconnect-error",a):i(r+1)}}},Math.min(r,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),i(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(n)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(n){this.socket=n,this.haVersion=n.haVersion,n.addEventListener("message",this._handleMessage),n.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(o=>{"subscribe"in o&&o.subscribe&&o.subscribe().then(i=>{o.unsubscribe=i,o.resolve()})}));let t=this._queuedMessages;if(t){this._queuedMessages=void 0;for(let o of t)o.resolve()}this.fireEvent("ready")}addEventListener(n,e){let t=this.eventListeners.get(n);t||(t=[],this.eventListeners.set(n,t)),t.push(e)}removeEventListener(n,e){let t=this.eventListeners.get(n);if(!t)return;let o=t.indexOf(e);o!==-1&&t.splice(o,1)}fireEvent(n,e){(this.eventListeners.get(n)||[]).forEach(t=>t(this,e))}suspendReconnectUntil(n){this.suspendReconnectPromise=n}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(n=!1){if(this.socket){if(!n){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(n,e){return this.subscribeMessage(n,ni(e))}ping(){return this.sendMessagePromise(si())}sendMessage(n,e){if(!this.connected)throw 3;if(Et&&console.log("Sending",n),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(n)});return}e||(e=this._genCmdId()),n.id=e,this.socket.send(JSON.stringify(n))}sendMessagePromise(n){return new Promise((e,t)=>{if(this._queuedMessages){this._queuedMessages.push({reject:t,resolve:async()=>{try{e(await this.sendMessagePromise(n))}catch(i){t(i)}}});return}let o=this._genCmdId();this.commands.set(o,{resolve:e,reject:t}),this.sendMessage(n,o)})}async subscribeMessage(n,e,t){if(this._queuedMessages&&await new Promise((i,r)=>{this._queuedMessages.push({resolve:i,reject:r})}),t?.preCheck&&!await t.preCheck())throw new Error("Pre-check failed");let o;return await new Promise((i,r)=>{let a=this._genCmdId();o={resolve:i,reject:r,callback:n,subscribe:t?.resubscribe!==!1?()=>this.subscribeMessage(n,e,t):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(In(a)),this.commands.delete(a)}},this.commands.set(a,o);try{this.sendMessage(e,a)}catch{}}),()=>o.unsubscribe()}_genCmdId(){return++this.commandId}};var Kr=()=>`${location.protocol}//${location.host}/`,Wr=s=>s*1e3+Date.now();function Vr(){let{protocol:s,host:n,pathname:e,search:t}=location;return`${s}//${n}${e}${t}`}function qr(s,n,e,t){let o=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return n!==null&&(o+=`&client_id=${encodeURIComponent(n)}`),t&&(o+=`&state=${encodeURIComponent(t)}`),o}function Gr(s,n,e,t){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=qr(s,n,e,t)}async function ui(s,n,e){let t=typeof location<"u"&&location;if(t&&t.protocol==="https:"){let a=document.createElement("a");if(a.href=s,a.protocol==="http:"&&a.hostname!=="localhost")throw 5}let o=new FormData;n!==null&&o.append("client_id",n),Object.keys(e).forEach(a=>{o.append(a,e[a])});let i=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:o});if(!i.ok)throw i.status===400||i.status===403?2:new Error("Unable to fetch tokens");let r=await i.json();return r.hassUrl=s,r.clientId=n,r.expires=Wr(r.expires_in),r}function hi(s,n,e){return ui(s,n,{code:e,grant_type:"authorization_code"})}function Yr(s){return btoa(JSON.stringify(s))}function Jr(s){return JSON.parse(atob(s))}var Bn=class{constructor(n,e){this.data=n,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let n=await ui(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});n.refresh_token=this.data.refresh_token,this.data=n,this._saveTokens&&this._saveTokens(n)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let n=new FormData;n.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:n}),this._saveTokens&&this._saveTokens(null)}};async function pi(s={}){let n,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let t=s.clientId!==void 0?s.clientId:Kr(),o=s.limitHassInstance===!0;if(s.authCode&&e&&(n=await hi(e,t,s.authCode),s.saveTokens&&s.saveTokens(n)),!n){let i=ri(location.search.substr(1));if("auth_callback"in i){let r=Jr(i.state);if(o&&(r.hassUrl!==e||r.clientId!==t))throw 6;n=await hi(r.hassUrl,r.clientId,i.code),s.saveTokens&&s.saveTokens(n)}}if(!n&&s.loadTokens&&(n=await s.loadTokens()),n&&(e===void 0||n.hassUrl===e))return new Bn(n,s.saveTokens);if(e===void 0)throw 4;return Gr(e,t,s.redirectUrl||Vr(),Yr({hassUrl:e,clientId:t})),new Promise(()=>{})}async function fi(s){let n=Object.assign({setupRetry:0,createSocket:ci},s),e=await n.createSocket(n);return new Gt(e,n)}function F(s){let n=Math.round(s),e=Math.floor(n/60),t=(n%60+60)%60;return`${((e+11)%12+12)%12+1}:${t<10?"0":""}${t}`}function Ke(s){let n=Math.floor(Math.round(s)/60)%24;return`${F(s)} ${n<12?"AM":"PM"}`}function gi(s){let n=Math.floor(s/60)%24;return`${(n+11)%12+1} ${n<12?"AM":"PM"}`}function _t(s){let n=Math.max(0,Math.round(s)),e=Math.floor(n/60),t=n%60;return e?t?`${e} hr ${t} min`:`${e} hr`:`${t} min`}function mi(s){let n=Math.floor(s/60)%24,e=s%60;return`${String(n).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Xr=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Zr=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Qr=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Yt(s){return new Date(`${s}T12:00:00Z`)}function Ce(s){let n=Yt(s);return`${Xr.format(n)}, ${Qr.format(n)}`}function ye(s){return Zr.format(Yt(s))}function Se(s,n){return Math.round((Yt(n).getTime()-Yt(s).getTime())/864e5)}function Tt(s,n=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(n)}catch{return Tt("UTC",n)}let t=o=>e.find(i=>i.type===o)?.value??"0";return{date:`${t("year")}-${t("month")}-${t("day")}`,minutes:Number(t("hour"))*60+Number(t("minute"))}}function Jt(s,n,e){let t=Math.floor((n.getTime()-s.getTime())/6e4);if(t<1)return"just now";if(t<60)return`${t} min ago`;let o=Tt(e,s),i=Tt(e,n).date;return o.date===i?`at ${Ke(o.minutes)}`:`on ${ye(o.date)} at ${Ke(o.minutes)}`}var ie=class extends Error{constructor(n,e){super(e),this.code=n,this.name="BackendError"}};function vi(s){switch(s.code){case"connection_lost":case"timeout":return"Can’t reach Home Assistant";case"not_running":return"MyDashLight isn’t running";default:return"Couldn’t get the latest plan"}}var We="mydashlight",ea=7,On=3e4,bi=3e4;function Nn(s){if(s instanceof ie)return s;if(s&&typeof s=="object"){let n=s;if(typeof n.message=="string")return new ie(String(n.code??"error"),n.message)}return typeof s=="number"?new ie("connection_lost","Lost the connection to Home Assistant."):new ie("error",String(s))}function yi(s,n){return new Promise((e,t)=>{let o=setTimeout(()=>t(new ie("timeout","Home Assistant didn’t answer.")),n);s.then(i=>{clearTimeout(o),e(i)},i=>{clearTimeout(o),t(i)})})}var Ct=class{constructor(n,e,t,o){this.live=!1;this.unsub=null;this.opening=!1;this.gen=0;this.closed=!1;this.onReady=()=>this.open();this.onDisconnected=()=>this.dropped();this.conn=n,this.type=e,this.onMessage=t,this.onFailed=o,n.addEventListener?.("ready",this.onReady),n.addEventListener?.("disconnected",this.onDisconnected)}get isOpen(){return this.unsub!==null||this.opening}open(){if(this.closed||this.isOpen||this.conn.connected===!1)return;let n=++this.gen;this.opening=!0,this.conn.subscribeMessage(e=>{n===this.gen&&(this.live=!0,this.onMessage(e))},{type:this.type},{resubscribe:!1}).then(e=>{if(n!==this.gen){e().catch(()=>{});return}this.opening=!1,this.unsub=e},e=>{n===this.gen&&(this.opening=!1,this.live=!1,this.onFailed(e))})}dropped(){this.gen++,this.opening=!1,this.unsub=null,this.live=!1}close(){this.closed=!0,this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let n=this.unsub;this.dropped(),n&&n().catch(()=>{})}},Xt=class{constructor(n){this.saves=!0;this.listeners=new Set;this.timer=null;this.rides=null;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new ie("connection_lost","Lost the connection to Home Assistant."));this.conn=n}get live(){return this.rides?.live??!1}watch(n,e){let t={onPlan:n,onError:e};return this.listeners.add(t),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(t),this.listeners.size||this.stop()}}start(){this.refresh(),this.rides=new Ct(this.conn,`${We}/rides/subscribe`,n=>{n.plan?this.emit(n.plan):this.fail(new ie("not_running","MyDashLight isn’t running right now."))},()=>{}),this.rides.open(),this.timer=setInterval(()=>{this.live||(this.refresh(),this.rides?.open())},On),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected),this.rides?.close(),this.rides=null}fail(n){for(let e of this.listeners)e.onError(n)}emit(n){for(let e of this.listeners)e.onPlan(n)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let n=await yi(this.conn.sendMessagePromise({type:"call_service",domain:We,service:"get_plan",service_data:{days:ea},return_response:!0}),bi);this.emit(n.response)}catch(n){this.fail(Nn(n))}}async call(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:We,service:n,service_data:e})}catch(t){throw Nn(t)}this.live||await this.refresh()}setRide(n,e,t,o,i){return this.call("set_ride",i===void 0?{event:n,side:e,driver:t,scope:o}:{event:n,side:e,driver:t,scope:o,stay:i})}setStay(n,e,t){return this.call("set_stay",{event:n,stay:e,scope:t})}setAttending(n,e,t){return this.call("set_attending",{event:n,attending:e,scope:t})}setArriveBy(n,e,t){return this.call("set_arrive_by",e==null?{event:n,scope:t}:{event:n,time:mi(e),scope:t})}setTakeAlong(n,e,t,o="drop"){return this.call("set_take_along",{event:n,kids:e,scope:t,side:o})}setTakes(n,e,t){return this.call("set_takes",e==null?{event:n,scope:t}:{event:n,minutes:e,scope:t})}applySuggestion(n){return this.call("apply_suggestion",{suggestion:n})}setPeople(n,e,t){return this.call("set_people",{event:n,people:e,scope:t})}watchChores(n){let e=!1,t=!1,o=async()=>{try{let a=await yi(this.conn.sendMessagePromise({type:"call_service",domain:We,service:"get_chores",service_data:{},return_response:!0}),bi);if(e)return;t=!0,n(a.response??null)}catch{!e&&!t&&n(null)}},i=new Ct(this.conn,`${We}/chores/subscribe`,a=>{e||(t=!0,n(a.chores))},()=>void o());i.open();let r=setInterval(()=>{i.live||i.open()},On);return()=>{e=!0,clearInterval(r),i.close()}}watchLunch(n){let e=!1,t=!1,o=new Ct(this.conn,`${We}/lunch/subscribe`,r=>{e||(t=!0,n(r.lunch))},()=>{!e&&!t&&n(null)});o.open();let i=setInterval(()=>{o.live||o.open()},On);return()=>{e=!0,clearInterval(i),o.close()}}async setLunch(n,e,t){await this.choreCall("set_lunch",{kid:n,dates:e,lunch:t??"default"})}async setLunchMenu(n,e,t,o){await this.choreCall("set_lunch_menu",{kids:n,date:e,menu:t,details:o})}async setChoreDone(n,e,t){await this.choreCall("set_chore_done",{chore:n,done:e,...e&&t?{by:t}:{}})}async saveChoreTemplate(n){await this.choreCall("save_chore_template",{...n})}async removeChoreTemplate(n){await this.choreCall("remove_chore_template",{template:n})}async choreCall(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:We,service:n,service_data:e})}catch(t){throw Nn(t)}}};var Zt=globalThis,Qt=Zt.ShadowRoot&&(Zt.ShadyCSS===void 0||Zt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,jn=Symbol(),xi=new WeakMap,At=class{constructor(n,e,t){if(this._$cssResult$=!0,t!==jn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(Qt&&n===void 0){let t=e!==void 0&&e.length===1;t&&(n=xi.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),t&&xi.set(e,n))}return n}toString(){return this.cssText}},wi=s=>new At(typeof s=="string"?s:s+"",void 0,jn),Ve=(s,...n)=>{let e=s.length===1?s[0]:n.reduce((t,o,i)=>t+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new At(e,s,jn)},ki=(s,n)=>{if(Qt)s.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let t=document.createElement("style"),o=Zt.litNonce;o!==void 0&&t.setAttribute("nonce",o),t.textContent=e.cssText,s.appendChild(t)}},zn=Qt?s=>s:s=>s instanceof CSSStyleSheet?(n=>{let e="";for(let t of n.cssRules)e+=t.cssText;return wi(e)})(s):s;var{is:ta,defineProperty:na,getOwnPropertyDescriptor:sa,getOwnPropertyNames:ia,getOwnPropertySymbols:oa,getPrototypeOf:ra}=Object,en=globalThis,$i=en.trustedTypes,aa=$i?$i.emptyScript:"",la=en.reactiveElementPolyfillSupport,Pt=(s,n)=>s,Un={toAttribute(s,n){switch(n){case Boolean:s=s?aa:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,n){let e=s;switch(n){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Ti=(s,n)=>!ta(s,n),Ei={attribute:!0,type:String,converter:Un,reflect:!1,useDefault:!1,hasChanged:Ti};Symbol.metadata??=Symbol("metadata"),en.litPropertyMetadata??=new WeakMap;var Ie=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=Ei){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let t=Symbol(),o=this.getPropertyDescriptor(n,t,e);o!==void 0&&na(this.prototype,n,o)}}static getPropertyDescriptor(n,e,t){let{get:o,set:i}=sa(this.prototype,n)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let a=o?.call(this);i?.call(this,r),this.requestUpdate(n,a,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Ei}static _$Ei(){if(this.hasOwnProperty(Pt("elementProperties")))return;let n=ra(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Pt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Pt("properties"))){let e=this.properties,t=[...ia(e),...oa(e)];for(let o of t)this.createProperty(o,e[o])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[t,o]of e)this.elementProperties.set(t,o)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let o=this._$Eu(e,t);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let t=new Set(n.flat(1/0).reverse());for(let o of t)e.unshift(zn(o))}else n!==void 0&&e.push(zn(n));return e}static _$Eu(n,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(n.set(t,this[t]),delete this[t]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ki(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,t){this._$AK(n,t)}_$ET(n,e){let t=this.constructor.elementProperties.get(n),o=this.constructor._$Eu(n,t);if(o!==void 0&&t.reflect===!0){let i=(t.converter?.toAttribute!==void 0?t.converter:Un).toAttribute(e,t.type);this._$Em=n,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(n,e){let t=this.constructor,o=t._$Eh.get(n);if(o!==void 0&&this._$Em!==o){let i=t.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Un;this._$Em=o;let a=r.fromAttribute(e,i.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(n,e,t,o=!1,i){if(n!==void 0){let r=this.constructor;if(o===!1&&(i=this[n]),t??=r.getPropertyOptions(n),!((t.hasChanged??Ti)(i,e)||t.useDefault&&t.reflect&&i===this._$Ej?.get(n)&&!this.hasAttribute(r._$Eu(n,t))))return;this.C(n,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:t,reflect:o,wrapped:i},r){t&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,r??e??this[n]),i!==!0||r!==void 0)||(this._$AL.has(n)||(this.hasUpdated||t||(e=void 0),this._$AL.set(n,e)),o===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[o,i]of t){let{wrapped:r}=i,a=this[o];r!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,i,a)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw n=!1,this._$EM(),t}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};Ie.elementStyles=[],Ie.shadowRootOptions={mode:"open"},Ie[Pt("elementProperties")]=new Map,Ie[Pt("finalized")]=new Map,la?.({ReactiveElement:Ie}),(en.reactiveElementVersions??=[]).push("2.1.2");var Fn=globalThis,_i=s=>s,tn=Fn.trustedTypes,Ci=tn?tn.createPolicy("lit-html",{createHTML:s=>s}):void 0,Kn="$lit$",Be=`lit$${Math.random().toFixed(9).slice(2)}$`,Wn="?"+Be,ca=`<${Wn}>`,Ye=document,Mt=()=>Ye.createComment(""),Dt=s=>s===null||typeof s!="object"&&typeof s!="function",Vn=Array.isArray,Li=s=>Vn(s)||typeof s?.[Symbol.iterator]=="function",Hn=`[ 	
\f\r]`,St=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ai=/-->/g,Pi=/>/g,qe=RegExp(`>|${Hn}(?:([^\\s"'>=/]+)(${Hn}*=${Hn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Si=/'/g,Mi=/"/g,Ri=/^(?:script|style|textarea|title)$/i,qn=s=>(n,...e)=>({_$litType$:s,strings:n,values:e}),f=qn(1),ae=qn(2),Pd=qn(3),Oe=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),Di=new WeakMap,Ge=Ye.createTreeWalker(Ye,129);function Ii(s,n){if(!Vn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ci!==void 0?Ci.createHTML(n):n}var Bi=(s,n)=>{let e=s.length-1,t=[],o,i=n===2?"<svg>":n===3?"<math>":"",r=St;for(let a=0;a<e;a++){let c=s[a],l,d,h=-1,u=0;for(;u<c.length&&(r.lastIndex=u,d=r.exec(c),d!==null);)u=r.lastIndex,r===St?d[1]==="!--"?r=Ai:d[1]!==void 0?r=Pi:d[2]!==void 0?(Ri.test(d[2])&&(o=RegExp("</"+d[2],"g")),r=qe):d[3]!==void 0&&(r=qe):r===qe?d[0]===">"?(r=o??St,h=-1):d[1]===void 0?h=-2:(h=r.lastIndex-d[2].length,l=d[1],r=d[3]===void 0?qe:d[3]==='"'?Mi:Si):r===Mi||r===Si?r=qe:r===Ai||r===Pi?r=St:(r=qe,o=void 0);let g=r===qe&&s[a+1].startsWith("/>")?" ":"";i+=r===St?c+ca:h>=0?(t.push(l),c.slice(0,h)+Kn+c.slice(h)+Be+g):c+Be+(h===-2?a:g)}return[Ii(s,i+(s[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),t]},Lt=class s{constructor({strings:n,_$litType$:e},t){let o;this.parts=[];let i=0,r=0,a=n.length-1,c=this.parts,[l,d]=Bi(n,e);if(this.el=s.createElement(l,t),Ge.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(o=Ge.nextNode())!==null&&c.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(let h of o.getAttributeNames())if(h.endsWith(Kn)){let u=d[r++],g=o.getAttribute(h).split(Be),A=/([.?@])?(.*)/.exec(u);c.push({type:1,index:i,name:A[2],strings:g,ctor:A[1]==="."?sn:A[1]==="?"?on:A[1]==="@"?rn:Xe}),o.removeAttribute(h)}else h.startsWith(Be)&&(c.push({type:6,index:i}),o.removeAttribute(h));if(Ri.test(o.tagName)){let h=o.textContent.split(Be),u=h.length-1;if(u>0){o.textContent=tn?tn.emptyScript:"";for(let g=0;g<u;g++)o.append(h[g],Mt()),Ge.nextNode(),c.push({type:2,index:++i});o.append(h[u],Mt())}}}else if(o.nodeType===8)if(o.data===Wn)c.push({type:2,index:i});else{let h=-1;for(;(h=o.data.indexOf(Be,h+1))!==-1;)c.push({type:7,index:i}),h+=Be.length-1}i++}}static createElement(n,e){let t=Ye.createElement("template");return t.innerHTML=n,t}};function Je(s,n,e=s,t){if(n===Oe)return n;let o=t!==void 0?e._$Co?.[t]:e._$Cl,i=Dt(n)?void 0:n._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,t)),t!==void 0?(e._$Co??=[])[t]=o:e._$Cl=o),o!==void 0&&(n=Je(s,o._$AS(s,n.values),o,t)),n}var nn=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:t}=this._$AD,o=(n?.creationScope??Ye).importNode(e,!0);Ge.currentNode=o;let i=Ge.nextNode(),r=0,a=0,c=t[0];for(;c!==void 0;){if(r===c.index){let l;c.type===2?l=new dt(i,i.nextSibling,this,n):c.type===1?l=new c.ctor(i,c.name,c.strings,this,n):c.type===6&&(l=new an(i,this,n)),this._$AV.push(l),c=t[++a]}r!==c?.index&&(i=Ge.nextNode(),r++)}return Ge.currentNode=Ye,o}p(n){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(n,t,e),e+=t.strings.length-2):t._$AI(n[e])),e++}},dt=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,t,o){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=t,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=Je(this,n,e),Dt(n)?n===T||n==null||n===""?(this._$AH!==T&&this._$AR(),this._$AH=T):n!==this._$AH&&n!==Oe&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Li(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==T&&Dt(this._$AH)?this._$AA.nextSibling.data=n:this.T(Ye.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:t}=n,o=typeof t=="number"?this._$AC(n):(t.el===void 0&&(t.el=Lt.createElement(Ii(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new nn(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(n){let e=Di.get(n.strings);return e===void 0&&Di.set(n.strings,e=new Lt(n)),e}k(n){Vn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,o=0;for(let i of n)o===e.length?e.push(t=new s(this.O(Mt()),this.O(Mt()),this,this.options)):t=e[o],t._$AI(i),o++;o<e.length&&(this._$AR(t&&t._$AB.nextSibling,o),e.length=o)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let t=_i(n).nextSibling;_i(n).remove(),n=t}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Xe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,t,o,i){this.type=1,this._$AH=T,this._$AN=void 0,this.element=n,this.name=e,this._$AM=o,this.options=i,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=T}_$AI(n,e=this,t,o){let i=this.strings,r=!1;if(i===void 0)n=Je(this,n,e,0),r=!Dt(n)||n!==this._$AH&&n!==Oe,r&&(this._$AH=n);else{let a=n,c,l;for(n=i[0],c=0;c<i.length-1;c++)l=Je(this,a[t+c],e,c),l===Oe&&(l=this._$AH[c]),r||=!Dt(l)||l!==this._$AH[c],l===T?n=T:n!==T&&(n+=(l??"")+i[c+1]),this._$AH[c]=l}r&&!o&&this.j(n)}j(n){n===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},sn=class extends Xe{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===T?void 0:n}},on=class extends Xe{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==T)}},rn=class extends Xe{constructor(n,e,t,o,i){super(n,e,t,o,i),this.type=5}_$AI(n,e=this){if((n=Je(this,n,e,0)??T)===Oe)return;let t=this._$AH,o=n===T&&t!==T||n.capture!==t.capture||n.once!==t.once||n.passive!==t.passive,i=n!==T&&(t===T||o);o&&this.element.removeEventListener(this.name,this,t),i&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},an=class{constructor(n,e,t){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(n){Je(this,n)}},Oi={M:Kn,P:Be,A:Wn,C:1,L:Bi,R:nn,D:Li,V:Je,I:dt,H:Xe,N:on,U:rn,B:sn,F:an},da=Fn.litHtmlPolyfillSupport;da?.(Lt,dt),(Fn.litHtmlVersions??=[]).push("3.3.3");var Ni=(s,n,e)=>{let t=e?.renderBefore??n,o=t._$litPart$;if(o===void 0){let i=e?.renderBefore??null;t._$litPart$=o=new dt(n.insertBefore(Mt(),i),i,void 0,e??{})}return o._$AI(s),o};var Gn=globalThis,Te=class extends Ie{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=Ni(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Oe}};Te._$litElement$=!0,Te.finalized=!0,Gn.litElementHydrateSupport?.({LitElement:Te});var ha=Gn.litElementPolyfillSupport;ha?.({LitElement:Te});(Gn.litElementVersions??=[]).push("4.2.2");var ji={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},zi=s=>(...n)=>({_$litDirective$:s,values:n}),ln=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,t){this._$Ct=n,this._$AM=e,this._$Ci=t}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var{I:ua}=Oi,Ui=s=>s;var Hi=()=>document.createComment(""),ht=(s,n,e)=>{let t=s._$AA.parentNode,o=n===void 0?s._$AB:n._$AA;if(e===void 0){let i=t.insertBefore(Hi(),o),r=t.insertBefore(Hi(),o);e=new ua(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,a=r!==s;if(a){let c;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(c=s._$AU)!==r._$AU&&e._$AP(c)}if(i!==o||a){let c=e._$AA;for(;c!==i;){let l=Ui(c).nextSibling;Ui(t).insertBefore(c,o),c=l}}}return e},ze=(s,n,e=s)=>(s._$AI(n,e),s),pa={},Fi=(s,n=pa)=>s._$AH=n,Ki=s=>s._$AH,cn=s=>{s._$AR(),s._$AA.remove()};var Wi=(s,n,e)=>{let t=new Map;for(let o=n;o<=e;o++)t.set(s[o],o);return t},Ne=zi(class extends ln{constructor(s){if(super(s),s.type!==ji.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,n,e){let t;e===void 0?e=n:n!==void 0&&(t=n);let o=[],i=[],r=0;for(let a of s)o[r]=t?t(a,r):r,i[r]=e(a,r),r++;return{values:i,keys:o}}render(s,n,e){return this.dt(s,n,e).values}update(s,[n,e,t]){let o=Ki(s),{values:i,keys:r}=this.dt(n,e,t);if(!Array.isArray(o))return this.ut=r,i;let a=this.ut??=[],c=[],l,d,h=0,u=o.length-1,g=0,A=i.length-1;for(;h<=u&&g<=A;)if(o[h]===null)h++;else if(o[u]===null)u--;else if(a[h]===r[g])c[g]=ze(o[h],i[g]),h++,g++;else if(a[u]===r[A])c[A]=ze(o[u],i[A]),u--,A--;else if(a[h]===r[A])c[A]=ze(o[h],i[A]),ht(s,c[A+1],o[h]),h++,A--;else if(a[u]===r[g])c[g]=ze(o[u],i[g]),ht(s,o[h],o[u]),u--,g++;else if(l===void 0&&(l=Wi(r,g,A),d=Wi(a,h,u)),l.has(a[h]))if(l.has(a[u])){let b=d.get(r[g]),k=b!==void 0?o[b]:null;if(k===null){let $=ht(s,o[h]);ze($,i[g]),c[g]=$}else c[g]=ze(k,i[g]),ht(s,o[h],k),o[b]=null;g++}else cn(o[u]),u--;else cn(o[h]),h++;for(;g<=A;){let b=ht(s,c[A+1]);ze(b,i[g]),c[g++]=b}for(;h<=u;){let b=o[h++];b!==null&&cn(b)}return this.ut=r,Fi(s,c),Oe}});var dn=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function de(s){return dn[(s%dn.length+dn.length)%dn.length]}var hn="#23272E",Yn="35,39,46";var fa=3,It=36,Jn=12,un=8,Vi=30,Me=16,Rt=100,ut=60,Zn=10,pn=30,Qn=10,ga=150,ma=150,mn=1;function eo(s,n){return s.dayHeads[Math.max(0,Math.floor(n/1440))]?.h??It}var ba=26,to=4;function ts(s,n){let e=Math.max(ga,ma/mn);return Math.ceil(ut+Math.max(0,s-1)*Zn+pn+Math.max(0,n-1)*Qn+e*(s+mn*n))}function _e(s){return s.people?s.people.kids.map(n=>n.id):s.days.length?Object.keys(s.days[0].kids):[]}function xe(s){return s.people?s.people.drivers.map(n=>n.id):s.days.length?Object.keys(s.days[0].drivers):[]}function we(s){return new Map(_e(s).map((n,e)=>[n,de(e)]))}function be(s,n){let e=s.people?.kids.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.kids[n])return t.kids[n].name;return n}function ge(s,n){let e=s.people?.drivers.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.drivers[n])return t.drivers[n].name;return n}function ns(s,n){return n==="none"?"Not needed":xe(s).includes(n)?ge(s,n):n}function bn(s){if(s.busy_why==="days"){if(s.start<=0&&s.end>=1440)return"All day";if(s.start<=0)return`Until ${F(s.end)}`;if(s.end>=1440)return`From ${F(s.start)}`}return`${F(s.start)}–${F(s.end)}`}function yn(s,n){return n.own?ge(s,n.own):be(s,n.kid)}var pt={color:hn,rgb:Yn,ink:hn};function no(s,n){return n.own?pt:we(s).get(n.kid)??de(0)}function ya(s,n){let e=_e(s);return n.along.map(t=>e.includes(t)?be(s,t):ge(s,t))}function ft(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function va(s){let n=new Map([["home","Home"]]);for(let e of s.days)for(let t of e.events)n.set(t.place,t.short_place||t.place_name||t.place);return n}function fn(s,n){return n?s.get(n)??(n.split(",")[0]?.trim()||n):""}function Xn(s,n){let e=[];for(let t of s)t.type==="drive"?(e.length||e.push(fn(n,t.from)),e.push(fn(n,t.to))):(t.type==="wait"||t.type==="stay")&&(e.length||e.push(fn(n,t.place)),t.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function xa(s){let n=s.map(r=>({...r,col:0,cols:1})).sort((r,a)=>r.s-a.s||a.en-r.en),e=[],t=[],o=-1/0,i=()=>{for(let r of e)r.cols=t.length;e=[],t=[]};for(let r of n){r.s>=o&&(i(),o=-1/0);let a=t.findIndex(c=>c<=r.s);a<0?(a=t.length,t.push(r.en)):t[a]=r.en,r.col=a,e.push(r),o=Math.max(o,r.en)}return i(),n}function wa(s,n){if(!s.length)return 0;if(n<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let t=s[e],o=s[e+1];if(n<=o.t)return o.t===t.t?t.y:Math.round(t.y+(n-t.t)/(o.t-t.t)*(o.y-t.y))}return s[s.length-1].y}function ka(s,n){if(!s.length)return 0;if(n<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let t=s[e],o=s[e+1];if(n<=o.y)return o.y===t.y?t.t:t.t+(n-t.y)/(o.y-t.y)*(o.t-t.t)}return s[s.length-1].t}function so(s,n){return wa(s.anchors,n)}function ss(s,n){return ka(s.anchors,n)}function $a(s,n){let e=_e(s),t=xe(s),o=Math.max(n,ts(e.length,t.length)),r=(o-ut-Math.max(0,e.length-1)*Zn-pn-Math.max(0,t.length-1)*Qn)/(e.length+mn*t.length||1),a=Math.floor(r),c=Math.floor(r*mn),l=s.whole_week??s.days,d=new Map;for(let b of l)for(let k of b.events)for(let $ of k.own?k.along:[k.kid]){let p=d.get($)??[];p.some(O=>O.event_id===k.event_id&&O.calendar_id===k.calendar_id)||p.push(k),d.set($,p)}let h=we(s),u=[],g=ut;e.forEach((b,k)=>{let $=d.get(b)??[],p=s.days.some(O=>O.events.some(H=>H.kid===b&&(H.sides.includes("drop")&&H.drop===""||H.sides.includes("pick")&&H.pick==="")));u.push({id:b,kind:"kid",x:g,w:a,name:be(s,b),dot:h.get(b).color,rgb:h.get(b).rgb,sub:`${p?"Needs a ride · ":""}${$.length} this week`,subWarn:p}),g+=a+(k<e.length-1?Zn:0)});let A=g+pn/2;return g+=pn,t.forEach((b,k)=>{let $=0,p=0;for(let O of l){let H=O.drivers[b];H&&($+=H.outings.length,p+=H.drive??0)}u.push({id:b,kind:"driver",x:g,w:c,name:ge(s,b),dot:hn,rgb:Yn,sub:`${$} ${$===1?"trip":"trips"} this week · ${_t(p)} driving`,subWarn:!1}),g+=c+(k<t.length-1?Qn:0)}),{columns:u,sepX:A,width:o}}function Ea(s,n){let e=s.trim();if(!n||e.length<=n.length||e.slice(0,n.length).localeCompare(n,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(n.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function qi(s,n){let e=s.start<=0,t=s.end>=1440;return e&&t?`${s.title} · all day`:t?`${s.title} from ${F(s.start)}`:e||!n?`${s.title} until ${F(s.end)}`:`${s.title} ${F(s.start)}–${F(s.end)}`}function is(s){return s.issues.filter(n=>n.level==="problem").length+s.clashes.length+(s.unplaced?.length??0)}function os(s,n){let e=Se(n,s);return e===0?"Today":e===1?"Tomorrow":""}function he(s,n=0){return s==null||!Number.isFinite(s)?n:s}function es(s,n,e=7){let t=Math.max(8,Math.floor(n/e)),o=1,i=0;for(let r of s.split(/\s+/).filter(Boolean)){let a=r.length;for(i===0?i=a:i+1+a<=t?i+=1+a:(o++,i=a);i>t;)o++,i-=t}return o}var io=25,Ta=15,oo=3;function Gi(s){return Math.max(0,Math.min(oo,Math.floor((s-io)/Ta)))}var _a=io+2,Yi=20;function Ji(s){return/^(\d+:\d\d)\s+Home$/.exec(s.at(-1)??"")?.[1]??null}var gn="🚗";function Xi(s,n){if(s===(n==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,i,r,a=!1)=>({at:o,who:i,stays:a,extra:r?` ·${r.slice(1)}`:""}),t;if(n==="drop"){if(t=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(s))return e(t[1],t[2],t[3]);if(t=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(s))return e(t[2],t[1],t[3],!0);if(t=/^(?:Drop-off: |Goes with )(.+?)(, .+)?$/.exec(s))return e("",t[1],t[2])}else{if(t=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(s))return e(t[1]??t[2],t[3],t[4]);if(t=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(s))return e("",t[1],t[2])}return null}var Zi={muted:0,normal:1,pending:2,problem:3};function ro(s){let{drop:n,pick:e}=s,t=n?Xi(n.text,"drop"):null,o=e?Xi(e.text,"pick"):null;if(n&&!t||e&&!o||!t&&!o)return s;let i=[n,e].reduce((c,l)=>l&&(Zi[l.tone]??1)>(Zi[c]??1)?l.tone:c,(n??e).tone);if(t==="needed"&&o==="needed")return{drop:{text:`${gn} No rides yet`,tone:i},pick:null};if(t&&o&&t!=="needed"&&o!=="needed"&&t.who===o.who&&!t.extra&&!o.extra){let c=`${gn} ${t.who}${t.stays?" stays":""}`;return!t.at&&!o.at?{drop:{text:`${c} both ways`,tone:i},pick:null}:{drop:{text:`${c} ↓${t.at} ↑${o.at}`.trimEnd(),tone:i},pick:null}}let r=(c,l)=>c==="needed"?`${l} needed`:`${l}${c.at?`${c.at} `:" "}${c.who}${c.stays?" stays":""}${c.extra}`,a=[t?r(t,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${gn} ${a.join(" · ")}`,tone:i},pick:null}}function Qi(s,n){let e=n-23,t=`${F(s.start)}–${F(s.end)}`+(s.arrive_by!=null?` · arrive ${F(s.arrive_by)}`:""),o=33+es(t,e,6.6)*16,i=s.own?s.lines:ro(s.lines);for(let r of[i.drop,i.pick])r&&(o+=2+es(r.text,e,7)*16);return o+4}function ao(s,n,e,t){let o=n==="compact",{columns:i,sepX:r,width:a}=$a(s,e),c=new Map(i.map(p=>[p.id,p])),l=_e(s),d=xe(s),h=[...l,...d],u=we(s),g=va(s),A=p=>be(s,p),b=p=>ge(s,p),k={mode:n,width:a,height:0,columns:i,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},$=0;return s.days.forEach((p,O)=>{let H=O*1440,q=new Map(p.events.map(m=>[m.id,m])),ue=m=>m&&q.has(m)?{day:p.date,event:m}:null,x=is(p),w=p.events.length,v=os(p.date,t.date),E=Sa(s,p,u,a);k.dayHeads.push({date:p.date,y:$,label:Ce(p.date),tag:v,sub:(w?`${w} ${w===1?"activity":"activities"}${p.done?" left":""}`:p.done?"All done for today":"Nothing scheduled")+(x?` · ${x} to sort out`:""),warn:x>0,h:It+(E?E.h+to+2:0),allDay:E?.chips??[]}),k.anchors.push({t:H,y:$});let _=k.dayHeads[k.dayHeads.length-1],M=$+_.h+Jn,N=d.flatMap(m=>p.drivers[m]?.outings??[]);if(!w&&!N.length){k.empties.push({key:p.date,y:M,text:p.done?"Nothing else today":"Nothing planned"}),$=M+40,k.anchors.push({t:H+1439,y:$});return}let W=(m,D,U,I,y,C,P,S=m.kid)=>{let K=!!m.own&&S===m.own,L=!!m.own&&S!==m.own,ee=K?pt:u.get(S)??de(0),fe=K?b(S):A(S),$e=L?{drop:{text:`With ${b(m.own)}`,tone:m.attending===!1?"muted":"normal"},pick:null}:P&&!m.own?ro(m.lines):m.lines,pe=K?ya(s,m):[],at=(m.takes!=null?`${m.takes} min, any time ${F(m.start)}–${F(m.end)}`:bn(m)+(m.arrive_by!=null?` · arrive ${F(m.arrive_by)}`:""))+(pe.length?` · with ${ft(pe)}`:"");return{key:`${p.date}|card|${m.id}`+(m.own?`|${S}`:""),x:D,y:U,w:I,h:y,target:{day:p.date,event:m.id},event:m,color:ee,kidName:fe,clash:C,stayed:!m.own&&m.stay&&d.includes(m.drop),skipped:m.attending===!1,title:Ea(m.title,fe),time:at,drop:$e.drop,pick:$e.pick,showDrop:!!$e.drop&&(P||y>=56),showPick:!!$e.pick&&(P||y>=74),wrap:P,aria:`${fe}, ${m.title} ${m.takes!=null?`any time from ${F(m.start)} to ${F(m.end)}`:bn(m).replace("–"," to ")}. `+(m.attending===!1&&!$e.drop?"Not attending. ":"")+[$e.drop,$e.pick].filter(Re=>!!Re).map(Re=>Re.text).join(". ")}},X=m=>{let D=p.rides[m];return D?(p.drivers[D.driver]?.segments??[]).filter(I=>I.type!=="home"&&I.kids.includes(D.kid)&&he(I.start)>=he(D.start)&&he(I.end)<=he(D.end)):[]},Q=m=>{let D=p.rides[m];if(!D)return null;let U=D.serves.find(I=>q.get(I)?.kid===D.kid);return ue(U??D.serves[0])},z=(m,D)=>{if(D.event)return D;let U=p.events.find(I=>I.own&&I.own!==m&&I.along.includes(m)&&I.title===D.title);return U?{...D,title:`${D.title} with ${b(U.own)}`}:D},J=m=>{if(m.takes==null)return[m.start,m.end];let D=m.planned??m.start;return[D,D+m.takes]},oe=new Map;for(let m of p.issues)m.level!=="problem"||!m.event||(m.kind==="late"&&oe.set(m.event,`${Math.round(he(m.minutes))} min late`),m.kind==="waiting"&&oe.set(`${m.event}|pick`,`Waits ${Math.round(he(m.minutes))} min`));if(!o){let m=1/0,D=-1/0;for(let L of p.events)L.start<=0&&L.end>=1440||(L.start>0?m=Math.min(m,L.start-20,L.arrive_by!=null?L.arrive_by-10:1/0):m=Math.min(m,L.end-30),L.end<1440?D=Math.max(D,L.end+20):D=Math.max(D,L.start+30));for(let L of N)L.start!=null&&(m=Math.min(m,L.start)),L.end!=null&&(D=Math.max(D,L.end));let U=p.from;U!=null&&Number.isFinite(m)&&m<U+60?m=U-15:p.date===t.date&&Number.isFinite(m)&&t.minutes>m-60&&t.minutes<D&&(m=Math.min(m,t.minutes-15));let I=Number.isFinite(m)?Math.floor((m-5)/30)*30:900,y=Math.max(Number.isFinite(D)?Math.ceil((D+5)/30)*30:960,I+60),C=L=>U!=null&&he(L)<=I,P=L=>U!=null&&he(L)<I,S=L=>Math.round(M+(Math.max(I,Math.min(y,L))-I)*fa);k.anchors.push({t:H+I,y:S(I)},{t:H+y,y:S(y)});for(let L of l){let ee=c.get(L),fe=u.get(L),$e=(p.kids[L]?.items??[]).filter(R=>R.start!=null&&R.end!=null&&!C(R.end)).map(R=>({item:R,s:he(R.start),en:he(R.end)})),pe=[];for(let R of xa($e)){let V=ee.w/R.cols,G=Math.round(ee.x+R.col*V),ne=Math.round(V-(R.cols>1?4:0)),re=S(R.s),se=R.item;if(se.type==="act"){let Ee=q.get(se.event??"");if(!Ee)continue;let Vt=Math.max(30,S(R.en)-re),lt=W(Ee,G,re,ne,Vt,se.clash,!1,L);if(lt.layer=Rt,lt.cut=P(R.s),k.cards.push(lt),Ee.arrive_by!=null&&Ee.start-Ee.arrive_by>=5&&!lt.cut){let Ln=S(Ee.arrive_by),Qs={key:`${p.date}|prep|${Ee.id}`,x:G,y:Ln,w:ne,h:re-Ln+Me,color:fe,label:`Arrive by ${F(Ee.arrive_by)}`,layer:Rt-1};k.preps.push(Qs),pe.push({s:Ee.arrive_by,en:R.en,top:Ln,bottom:re+Vt,x:G,w:ne,prep:Qs,card:lt})}else pe.push({s:R.s,en:R.en,top:re,bottom:re+Vt,x:G,w:ne,card:lt});let Xs=oe.get(Ee.id);Xs&&k.marks.push({key:`${p.date}|late|${Ee.id}`,x:G+ne-4,y:re+4,text:Xs,right:!0});let Zs=oe.get(`${Ee.id}|pick`);Zs&&k.marks.push({key:`${p.date}|wait|${Ee.id}`,x:G+4,y:re+Vt+2,text:Zs,right:!1});continue}let Y=p.rides[se.ride??-1];if(!Y)continue;let Pe=Math.max(22,S(R.en)-re),$t=Xn(X(Y.index),g),Gs=b(Y.driver),Ys={key:`${p.date}|ride|${Y.index}`,x:G,y:re,w:ne,h:Pe,target:Q(Y.index),l1:`${Y.own?"In":"Along in"} ${Gs}’s car`,l2:$t.join(" → "),show2:Gi(Pe)>0,lines2:Gi(Pe),dashed:!Y.own,clash:se.clash,aria:`${A(L)} ${Y.own?"in":"riding along in"} ${Gs}’s car, ${F(he(Y.start))} to ${F(he(Y.end))}: ${$t.join(" to ")}`};k.rides.push(Ys);let Js=c.get(Y.driver),Dn=null;Js&&(Dn={key:`${p.date}|band|${Y.index}`,x:G+ne,y:re,w:Math.max(0,Js.x+8-(G+ne)),h:Pe,color:fe},k.bands.push(Dn)),pe.push({s:R.s,en:R.en,top:re,bottom:re+Pe,x:G,w:ne,ride:Ys,band:Dn})}let at=R=>R.ride?.layer??(R.prep?Rt-1:Rt),Re=(R,V,G,ne)=>{G>Me&&k.links.push({key:`${R.key}|link`,x:R.x,y:V,w:R.w,h:G,color:fe,layer:ne})},B=(R,V)=>{if(!(V.x<R.x||V.x+V.w>R.x+R.w)&&(R.x=V.x,R.w=V.w,R.ride.x=V.x,R.ride.w=V.w,R.band)){let G=R.band.x+R.band.w;R.band.x=V.x+V.w,R.band.w=Math.max(0,G-R.band.x)}},ce=new Set;for(let R of[...pe].sort((V,G)=>G.s-V.s)){let V=R.ride;if(!V)continue;let G=pe.filter(se=>se!==R&&se.s>=R.en&&se.s-R.en<=Vi&&se.top>=R.bottom).sort((se,Y)=>se.s-Y.s||se.top-Y.top)[0];if(!G)continue;ce.add(R),B(R,G);let ne=at(G),re=G.top-R.bottom;Re(V,R.bottom,re+Me,ne-1),V.layer=ne-(re>0?2:1),V.h+=Me,V.tuckBottom=Me}for(let R of[...pe].sort((V,G)=>V.s-G.s)){let V=R.ride;if(!V||ce.has(R))continue;let G=pe.filter(se=>se!==R&&se.en<=R.s&&R.s-se.en<=Vi&&se.bottom<=R.top&&(se.card||se.ride?.layer!=null)).sort((se,Y)=>Y.en-se.en||Y.bottom-se.bottom)[0];if(!G)continue;B(R,G);let ne=G.ride?.layer??Rt,re=R.top-G.bottom;Re(V,G.bottom-Me,re+Me,ne-1),V.layer=ne-(re>0?2:1),V.y-=Me,V.h+=Me,V.tuckTop=Me}}for(let L of d){let ee=c.get(L),fe=p.drivers[L];if(!fe)continue;let $e=[],pe=null;for(let B of fe.segments)if(!(B.start==null||B.end==null)){if(B.type==="home"){pe=null;continue}if(B.type==="stay"){pe=null,$e.push({type:"stay",g:B,s:B.start,en:B.end});continue}pe&&pe.en===B.start?(pe.en=B.end,pe.legs.push(B)):(pe={type:"trip",s:B.start,en:B.end,legs:[B]},$e.push(pe))}let at=new Set,Re=(B,ce,R,V)=>{at.add(B.id);let G=S(ce),ne=W(B,ee.x+8,G,ee.w-16,Math.max(30,S(R)-G),!1,!1,L);ne.cut=P(ce),V&&ne.drop?.tone==="normal"&&(ne.drop=null,ne.showDrop=!1),k.cards.push(ne)};for(let B of $e){if(C(B.en))continue;let ce=S(B.s),R=Math.max(24,S(B.en)-ce);if(B.type==="stay"){let Y=q.get(B.g.event??B.g.serves??"");if(Y?.own===L){Re(Y,B.s,B.en,!0);continue}let Pe=Y?u.get(Y.kid)??de(0):de(0),$t=B.g.kids.map(A);k.stays.push({cut:P(B.s),key:`${p.date}|stay|${L}|${B.s}`,x:ee.x+8,y:ce,w:ee.w-16,h:R,target:ue(Y?.id),color:Pe,l1:Y?`At ${Y.title} with ${A(Y.kid)}`:"Staying",l2:`until ${F(B.en)}`+($t.length?` · ${$t.join(" and ")} too`:"")});continue}let V=B.legs[0],G=B.legs[B.legs.length-1],ne=[];for(let Y of B.legs)for(let Pe of Y.kids)ne.includes(Pe)||ne.push(Pe);let re=G.type==="drive"&&G.to==="home",se=Xn(B.legs,g);k.trips.push({key:`${p.date}|trip|${L}|${B.s}`,x:ee.x+8,y:ce,w:ee.w-16,h:R,target:ue(B.legs.find(Y=>Y.serves)?.serves),l1:V.type==="drive"&&V.from==="home"?`Leave ${F(B.s)}`:`From ${fn(g,V.from??V.place)} ${F(B.s)}`,l2:se.join(" → "),show2:R>=36,l3:re?`Home ${F(B.en)}`:"",show3:re&&R>=62,stops:null,kids:ne.map(Y=>(u.get(Y)??de(0)).color),bad:B.legs.some(Y=>Y.overlaps_busy),aria:`${b(L)} drives ${se.join(" to ")}, ${F(B.s)} to ${F(B.en)}`})}for(let B of fe.segments)if(!(!B.overlaps_busy||B.start==null||B.end==null))for(let ce of fe.busy){let R=Math.max(B.start,ce.start),V=Math.min(B.end,ce.end);V<=R||C(V)||k.overlaps.push({key:`${p.date}|overlap|${L}|${R}`,x:ee.x+6,y:S(R)-2,w:ee.w-12,h:Math.max(8,S(V)-S(R)+4)})}for(let B of p.events)if(B.own===L&&(!at.has(B.id)&&!C(J(B)[1])&&Re(B,...J(B),!1),B.takes!=null&&B.attending!==!1&&!C(B.end))){let ce=S(B.start);k.windows.push({key:`${p.date}|window|${B.id}`,x:ee.x+4,y:ce,w:ee.w-8,h:Math.max(24,S(B.end)-ce),label:`${B.title} · any time ${F(B.start)}–${F(B.end)}`})}for(let B of fe.busy){if(B.event||B.end<=I||B.start>=y)continue;let ce=z(L,B),R=S(ce.start),V=S(ce.end);k.busy.push({key:`${p.date}|busy|${L}|${ce.start}`,x:ee.x+1,y:R,w:ee.w-2,h:V-R,labelY:8,label:qi(ce,!1)})}}let K=-1/0;for(let L=I;L<=y;L+=30)k.grid.push({key:`${p.date}|grid|${L}`,y:S(L),strong:L%60===0}),L%60===0&&S(L)-K>=22&&(k.hours.push({key:`${p.date}|hour|${L}`,y:S(L)-8,label:gi(L)}),K=S(L));p.date===t.date&&t.minutes>I&&t.minutes<y&&(k.now={y:S(t.minutes),label:`Now ${F(t.minutes)}`}),$=S(y)+Jn;return}let Z=[];for(let m of l){let D=c.get(m);for(let U of p.kids[m]?.items??[])if(U.start!=null){if(U.type==="act"){let I=q.get(U.event??"");if(!I)continue;Z.push({col:m,s:U.start,h:Qi(I,D.w),kind:"act",item:U})}else if(!p.rides[U.ride??-1]?.own){let I=p.rides[U.ride??-1],y=I?p.drivers[I.driver]?.outings.find(C=>C.start!=null&&C.start<=he(I.start)&&he(I.start)<=he(C.end,C.start)):void 0;Z.push({col:m,s:y?.start??U.start,h:_a,kind:"along",item:U})}}}for(let m of d){let D=p.drivers[m];if(!D)continue;for(let I of D.busy)I.event||Z.push({col:m,s:I.start,h:32,kind:"busy",busy:z(m,I)});let U=c.get(m).w;for(let I of p.events)I.own!==m||!I.busy_only&&I.attending!==!1&&(I.takes==null||I.planned!=null)||Z.push({col:m,s:J(I)[0],h:Qi(I,U),kind:"own",event:I});for(let I of D.outings){if(I.start==null)continue;let C=[...Ji(I.lines)?I.lines.slice(0,-1):I.lines,...I.warn?[I.warn]:[]].reduce((P,S)=>P+es(S,U-36,7),0);Z.push({col:m,s:I.start,h:30+C*16,kind:"out",out:I})}}Z.sort((m,D)=>m.s-D.s||h.indexOf(m.col)-h.indexOf(D.col));let ke=new Map,me=[],le=new Map,j=M-Yi;for(let m=0;m<Z.length;){let D=m,U=j+Yi;for(;D<Z.length&&Z[D].s===Z[m].s;D++){let y=ke.get(Z[D].col);y!=null&&(U=Math.max(U,y+un))}let I=new Set;for(let y=m;y<D;y++){let C=Z[y],P=I.has(C.col)?ke.get(C.col)+un:U;I.add(C.col),ke.set(C.col,P+C.h)}le.set(Z[m].s,U),Z[m].s>0&&k.hours.push({key:`${p.date}|hour|${Z[m].s}`,y:U+2,label:Ke(Z[m].s)}),j=U,m=D}ke.clear(),Z.forEach((m,D)=>{let U=ke.get(m.col),I=Math.max(U!=null?U+un:M,le.get(m.s));ke.set(m.col,I+m.h);let y=m.kind==="busy"?m.busy.end:m.kind==="act"?q.get(m.item.event??"")?.end??null:m.kind==="own"?J(m.event)[1]:null;me.push({col:m.col,s:m.s,end:y,y:I,h:m.h,box:null}),k.anchors.push({t:H+m.s,y:I});let C=c.get(m.col);if(m.kind==="busy"){let P={key:`${p.date}|busy|${m.col}|${D}`,x:C.x+1,y:I,w:C.w-2,h:m.h,labelY:8,label:qi(m.busy,!0)};k.busy.push(P),me[me.length-1].box=P}else if(m.kind==="out"){let P=m.out,S=Ji(P.lines),K=S?P.lines.slice(0,-1):P.lines;k.trips.push({key:`${p.date}|trip|${m.col}|${D}`,x:C.x+8,y:I,w:C.w-16,h:m.h,target:ue(P.target),l1:S?`${P.lead} · home ${S}`:P.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...K.map(L=>({text:L,warn:!1})),...P.warn?[{text:P.warn,warn:!0}]:[]],kids:P.kids.map(L=>(u.get(L)??de(0)).color),bad:!!P.warn,aria:`${b(m.col)}: ${P.lead}. ${P.lines.join(". ")}${P.warn?`. ${P.warn}`:""}`})}else if(m.kind==="own"){let P=W(m.event,C.x+8,I,C.w-16,m.h,!1,!0,m.col);k.cards.push(P),me[me.length-1].box=P}else if(m.kind==="act"){let P=q.get(m.item.event??""),S=W(P,C.x,I,C.w,m.h,m.item.clash,!0,m.col);k.cards.push(S),me[me.length-1].box=S}else{let P=p.rides[m.item.ride??-1],S=Xn(X(P.index),g),K=b(P.driver);k.rides.push({key:`${p.date}|ride|${P.index}`,x:C.x,y:I,w:C.w,h:m.h,target:Q(P.index),l1:`${gn} with ${K}`,l2:S.join(" → "),show2:!1,lines2:oo,dashed:!0,clash:m.item.clash,aria:`${A(m.col)} riding along with ${K}, ${F(he(P.start))} to ${F(he(P.end))}: ${S.join(" to ")}`})}});let te=M;for(let m of ke.values())te=Math.max(te,m);for(let m of me){if(!m.box||m.end==null)continue;let D=m.y+m.h;for(let U of me)U.col!==m.col&&U.s>=m.s&&U.s<m.end&&(D=Math.max(D,U.y+U.h));m.end>=1440&&(D=te);for(let U of me)U.col===m.col&&U.y>m.y&&(D=Math.min(D,U.y-un));D=Math.min(D,te),D>m.y+m.h&&(m.box.h=D-m.y)}$=te+Jn+6,k.anchors.push({t:H+1439,y:$})}),k.height=$,k}var Ca=["","¼","½","¾"];function Ze(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(n,e)=>{let t=Number(e);if(t>=59.5)return _t(t);let o=Math.round(t*4),i=Math.floor(o/4),r=Ca[o%4];return`${i||!r?i:""}${r} min`})}function lo(s){let n=e=>e?{...e,text:Ze(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(t=>({...t,lines:{drop:n(t.lines.drop),pick:n(t.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([t,o])=>[t,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(Ze),warn:i.warn==null?i.warn:Ze(i.warn)}))}])),issues:e.issues.map(t=>({...t,title:Ze(t.title),body:Ze(t.body),note:t.note==null?t.note:Ze(t.note),...t.suggestions?{suggestions:t.suggestions.map(o=>({...o,note:Ze(o.note)}))}:{}}))}))}}var Aa=2,Pa=48;function co(s,n,e=Pa){let t=[],o=new Set(xe(s)),i=_e(s).map(u=>be(s,u)),r=i.length>1?i.slice(0,2):[i[0]??"Ava","Ben"],a=0,c=0,l=0,d=0,h=n.minutes+e*60;for(let u of s.days){let g=Se(n.date,u.date),A=g===0?"":`${ye(u.date)} · `,b=new Map(u.events.map(p=>[p.id,p])),k=p=>p&&b.has(p)?{day:u.date,event:p}:null,$=(p,O)=>g*1440+(p??b.get(O??"")?.start??0)<h;for(let p of u.issues)if(p.level==="problem"){if(!$(p.at,p.event)){l++,p.kind==="unassigned"&&d++;continue}a++,p.kind==="unassigned"&&c++,t.push({key:`${u.date}|${p.key}`,tone:p.kind==="unassigned"?"unassigned":"problem",title:A+p.title,body:p.body,target:k(p.event),suggestions:(p.suggestions??[]).map(O=>({id:O.id,label:O.label,note:O.note}))})}if(u.clashes.forEach((p,O)=>{if(!$(p.a.start,p.a.event)){l++;return}a++;let H=b.get(p.a.event??""),q=be(s,p.kid),ue=(w,v)=>{let E=k(v);return E?{text:w,target:E}:w},x=[];if(p.b.type==="act"){let w=b.get(p.b.event??"");H&&w&&(x=[ue(H.title,H.id),` ${F(H.start)}–${F(H.end)} and `,ue(w.title,w.id),` ${F(w.start)}–${F(w.end)} overlap.`])}else{let w=u.rides[p.b.ride??-1];H&&w&&(x=[`${q} is in `,ue(`${ge(s,w.driver)}’s car`,w.serves[0]),` ${F(he(p.b.start))}–${F(he(p.b.end))}, during `,ue(H.title,H.id),"."])}t.push({key:`${u.date}|clash|${O}`,tone:"problem",title:`${A}${q} is double-booked`,body:x.map(w=>typeof w=="string"?w:w.text).join(""),parts:x,target:null,suggestions:[]})}),g>=0&&g<Aa)for(let p of u.issues)p.level!=="heads_up"||!$(p.at,p.event)||t.push({key:`${u.date}|${p.key}`,tone:"heads_up",title:A+p.title,body:p.body,target:k(p.event),suggestions:[]});for(let p of u.unplaced??[]){if(!$(p.at)){l++;continue}a++;let O=p.people.map(q=>o.has(q)?ge(s,q):be(s,q)),H=p.from_notes?"The For line in its notes":"Its title";t.push({key:`${u.date}|unplaced|${p.id}`,tone:"problem",title:`${A}${F(p.at)} ${p.title}: ${ho(p).toLowerCase()}`,body:p.reason==="unknown"&&p.word?`${H} names “${p.word}”, who isn’t anyone in the family, so ${O.length?`it’s only in ${ft(O)}’s lane`:"it isn’t on the board"}. Tap to pick who it’s for.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Tap to pick who it’s for, or start the title in Google Calendar with a name, such as “${r[0]} Piano”.`,target:null,suggestions:[],pick:{day:u.date,id:p.id}})}for(let p of u.events)!p.problems.length||!$(p.start)||t.push({key:`${u.date}|notes|${p.id}`,tone:"heads_up",title:`${A}Check the notes on ${yn(s,p)}’s ${p.title}`,body:`These lines couldn’t be read: ${p.problems.join("; ")}`,target:k(p.id),suggestions:[]})}return{items:t,problems:a,unassigned:c,later:l,laterUnassigned:d}}function ho(s){return s.reason==="unknown"&&s.word?`Who is “${s.word}”?`:"Who is this for?"}function Sa(s,n,e,t){let o=new Set(xe(s)),i=d=>{let h=d[0];return h==null?null:o.has(h)?pt:e.get(h)??null},r=[...(n.all_day??[]).map(d=>({key:`${n.date}|allday|${d.id}`,title:d.title,note:d.days>1?`Day ${d.day_number} of ${d.days}`:"",color:i(d.people),cancelled:d.cancelled,warn:!1,pick:null})),...(n.unplaced??[]).map(d=>({key:`${n.date}|unplaced|${d.id}`,title:`${F(d.at)} ${d.title}`,note:ho(d),color:null,cancelled:!1,warn:!0,pick:d.id}))];if(!r.length)return null;let a=Math.max(120,t-ut),c=1,l=0;for(let d of r){let h=Math.min(a,30+7*(d.title.length+(d.note?d.note.length+2:0)));l&&l+h>a&&(c++,l=0),l+=h}return{key:`${n.date}|allday`,h:c*ba+(c-1)*to,chips:r}}function uo(s,n){let e=we(s),t=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=Se(n.date,i.date);if(!(r<0))for(let a of xe(s))for(let c of i.drivers[a]?.outings??[]){if(c.start==null)continue;let l=r*1440+c.start;if(r*1440+he(c.end,c.start)<=n.minutes)continue;let h=l-n.minutes,u={driver:a,name:ge(s,a),date:i.date,ahead:r,start:c.start,inMinutes:h,ongoing:h<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(g=>e.get(g)??de(0)),warn:c.warn,target:c.target&&i.events.some(g=>g.id===c.target)?{day:i.date,event:c.target}:null};(!t||o(u)<o(t)||o(u)===o(t)&&u.inMinutes<t.inMinutes)&&(t=u)}}return t}function gt(s){return s.state==="done"||s.state==="late"}var Ma=780;function Da(s,n,e){return s.state==="open"&&!!s.for_day&&s.due===n&&e<Ma}function po(s,n){return s.chores.map(e=>Da(e,s.today,n)?{...e,state:"upcoming",shows_from:s.today}:e)}function fo(s){return s.state==="open"||s.state==="overdue"}function ls(s,n,e){if(gt(s)){let t=s.done_at?La(s.done_at,n,e):"";return s.state==="late"?`Done late${t?` · ${t}`:""}`:`Done${t?` ${t}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${rs(s.due,n)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${rs(s.for_day,n)}`;let t=s.shows_from??s.due;if(!s.due||!t||s.due<=t)return"";let o=Se(n,s.due);return`By ${o===1?"tomorrow":o<7?ye(s.due):as(s.due)}`}if(s.for_day&&s.due===n)return`Tonight · for ${rs(s.for_day,n)}`;if(s.due&&s.due>n){let t=Se(n,s.due);return t===1?"By tomorrow":`By ${t<7?ye(s.due):as(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function rs(s,n){let e=Se(n,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?ye(s):as(s)}function as(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function La(s,n,e){let t=new Date(s);if(Number.isNaN(t.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let i=t.toLocaleDateString("en-CA",{timeZone:o}),r=t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return i===n?r:`${ye(i)} ${r}`}function go(s,n,e=1440){let t=po(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=t.filter(d=>d.kid===o.id),a=new Map;for(let d of r){if(d.state!=="upcoming")continue;let h=d.shows_from??d.due??s.today;a.set(h,[...a.get(h)??[],d])}let c=r.filter(d=>d.state==="overdue"),l=r.filter(d=>d.state==="open");return{kid:o.id,name:o.name,color:n?.get(o.id)??de(i),overdue:c,now:l,done:r.filter(gt),later:[...a.entries()].sort(([d],[h])=>d.localeCompare(h)).map(([d,h])=>({date:d,chores:h})),left:c.length+l.length}})}function mo(s,n=1440){return po(s,n).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,t)=>e.state===t.state?e.order-t.order:e.state==="overdue"?-1:1)}function cs(s){return!s.chores.length&&!s.templates.length}var Qe=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function ds(s){let n=s.trim();if(!n)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let t of n.split(",")){let[o,i]=t.split("-").map(r=>Qe.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function hs(s){let n=[...new Set(s)].sort((t,o)=>t-o);if(n.length===0||n.length===7)return"";let e=[];for(let t of n){let o=e.at(-1);o&&o.at(-1)===t-1?o.push(t):e.push([t])}return e.flatMap(t=>t.length>=3?[`${Qe[t[0]]}-${Qe[t.at(-1)]}`]:t.map(o=>Qe[o])).join(", ")}var et="none";function vn(s){return s==="daily"||s==="school"?"":"Any"}function bo(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function yo(s){let n=s.days??vn(s.repeats),e=s.repeats==="daily"&&n!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:n,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function us(s){return s.title.trim()?s.who.length?s.days===et?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function vo(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function ps(s){let n=s%100;return n>=11&&n<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function fs(s,n,e=1,t=!1,o=!1){if(s==="school"){let d=n.trim().replace(/-/g,"–"),h=o?d?`${d} Bring lunch days`:"Bring lunch days":d?`${d} school days`:"Every school day";return t?`${h}, the night before`:h}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,a=n.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(a))return e>1?`Every day, every ${e} weeks`:"Every day";if(!a||a.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${a.replace(/-/g,"–")} ${r}`;let l=`${a.split(",").map(d=>{let h=d.trim();return h.toLowerCase()==="last"?"the last day":/^\d+$/.test(h)?`the ${ps(Number(h))}`:`the ${h}`}).join(" and ")} ${r}`;return l[0].toUpperCase()+l.slice(1)}function gs(s,n,e=!1){let t=s.map(i=>n.find(r=>r.id===i)?.name??i);if(!t.length)return"Nobody yet";let o=t.length===1?t[0]:`${t.slice(0,-1).join(", ")} and ${t.at(-1)}`;return e&&t.length>1?`${o} take turns`:o}function ms(s){let n=s.indexOf(":"),e=n<0?s:s.slice(0,n),t=n<0?"":s.slice(n+1);switch(e){case"who":return t?`“${t}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${t}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${t}” couldn’t be read`;case"take_turns":return`“Take turns: ${t}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${t}”) couldn’t be read`}}function xn(s,n){return`${s}|${n}`}function mt(s,n){let[e,t,o]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1,o+n)).toISOString().slice(0,10)}function wn(s){let[n,e,t]=s.split("-").map(Number);return(new Date(Date.UTC(n,e-1,t)).getUTCDay()+6)%7}function xo(s,n){return s.days_off.find(e=>e.first<=n&&n<=e.last)??null}function wo(s,n){return wn(n)<5&&!xo(s,n)}function Bt(s,n,e=new Map){if(!wo(s,n))return null;let t=xn(s.id,n);if(e.has(t)){let i=e.get(t);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[n];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function bt(s,n){return wo(s,n)?s.menus?.[n]??null:null}var Ra="From the school's menu feed.";function Ia(s){let n=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==Ra);return n.length?n.join(`
`):null}function De(s){return s.slice(0,7)}function kn(s){let[n,e]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function bs(s,n=1){let[e,t]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1+n,1)).toISOString().slice(0,7)}function ko(s){let n=[];for(let e=De(s.first);e<=De(s.last);e=bs(e))n.push(e);return n}function $o(s,n,e,t=new Map){let o=`${e}-01`,i=mt(o,-wn(o)),r=[];for(;De(i)<=e;){let a=[];for(let c=0;c<5;c++){let l=mt(i,c),d=De(l)!==e,h=d?null:xo(n,l),u=d?null:Bt(n,l,t);a.push({date:l,day:Number(l.slice(8)),outside:d,off:h?h.title:null,lunch:u?.lunch??null,picked:u?.picked??!1,menu:d?null:bt(n,l)?.dish??null,sides:d?null:Ia(bt(n,l)?.details??""),past:l<s.today,today:l===s.today})}a.some(c=>!c.outside)&&r.push(a),i=mt(i,7)}return r}function Eo(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function To(s){let n=0,e=0;for(let t of s.flat())t.outside||t.past||!t.lunch||(t.lunch==="bring"?n++:e++);return{bring:n,buy:e}}function _o(s,n,e,t=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=mt(n,i),a=Bt(s,r,t);if(!a)continue;let c=Se(n,r);return{lunch:a.lunch,when:c===0?"today":c===1?"tomorrow":ye(r),date:r,menu:bt(s,r)?.dish??null}}return null}var Ba={timeline:"timeline",full:"timeline",compact:"compact"};function tt(s){let n=new URLSearchParams(s),e={},t=Ba[(n.get("view")??"").trim().toLowerCase()];t&&(e.view=t),["off","no","false","0"].includes((n.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(n.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(n.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((n.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((n.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}var Oa=["auth_callback","code","state"];function ys(s){let n=new URLSearchParams(s);for(let t of Oa)n.delete(t);let e=n.toString();return e?`?${e}`:""}function vs(s,n=0){return s==null||!Number.isFinite(s)?n:s}function Na(s,n){let e=n.takes!=null&&n.planned!=null?n.planned+n.takes:n.end;if(n.attending===!1)return n.end;for(let t of s.rides)t.serves.includes(n.id)&&t.end!=null&&(e=Math.max(e,t.end));for(let t of Object.values(s.drivers))for(let o of t.segments)o.type==="home"||o.end==null||(o.serves===n.id||o.event===n.id)&&(e=Math.max(e,o.end));return e}function ja(s,n){let e=[],t=[],o=()=>{let i=t[t.length-1];i&&vs(i.end)>n&&e.push(...t),t=[]};for(let i of s){if(i.start==null||i.end==null)continue;if(i.type==="home"||i.type==="stay"){o(),i.end>n&&e.push(i);continue}let r=t[t.length-1];r&&r.end!==i.start&&o(),t.push(i)}return o(),e}function za(s,n){let e=new Set(s.events.filter(i=>Na(s,i)<=n).map(i=>i.id)),t=i=>vs(s.rides[i??-1]?.end,-1)<=n,o=i=>i.type==="act"?e.has(i.event??""):t(i.ride);return{...s,events:s.events.filter(i=>!e.has(i.id)),kids:Object.fromEntries(Object.entries(s.kids).map(([i,r])=>[i,{...r,items:r.items.filter(a=>!o(a))}])),drivers:Object.fromEntries(Object.entries(s.drivers).map(([i,r])=>[i,{...r,segments:ja(r.segments,n),outings:r.outings.filter(a=>a.start==null||vs(a.end,a.start)>n),busy:r.busy.filter(a=>a.end>n)}])),clashes:s.clashes.filter(i=>!o(i.a)&&!o(i.b)),issues:s.issues.filter(i=>!i.event||!e.has(i.event)),done:e.size,from:n}}function Co(s,n){return{...s,whole_week:s.whole_week??s.days,days:s.days.filter(e=>e.date>=n.date).map(e=>e.date===n.date?za(e,n.minutes):e)}}var Ao=Ve`
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
    --shadow: 0 1px 2px rgba(28, 30, 34, 0.06), 0 2px 8px rgba(28, 30, 34, 0.06);
    display: block;
    height: 100%;
    background: var(--bg);
    color: var(--ink);
    font-family: Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif;
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
    background: repeating-linear-gradient(90deg, var(--dark) 0 10px, transparent 10px 16px);
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
    background: linear-gradient(rgba(var(--rgb), 0.04), rgba(var(--rgb), 0.04)), var(--surface);
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
  /* All-day events, glued under the date line and floating with it. */
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
    box-shadow: inset 5px 0 0 var(--c), var(--shadow);
  }
  .card.clash {
    border-width: 2px;
  }
  .card.sel {
    box-shadow: inset 5px 0 0 var(--c), 0 0 0 3px var(--ring);
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
  .card.wrap .line {
    white-space: normal;
    font-size: 12px;
    line-height: 16px;
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
    background: linear-gradient(rgba(var(--rgb), 0.08), rgba(var(--rgb), 0.08)), var(--surface);
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
    background: repeating-linear-gradient(135deg, rgba(18, 135, 122, 0.35) 0px, rgba(18, 135, 122, 0.35) 4px, #fff 4px, #fff 8px);
  }
  .busy-sw {
    background: repeating-linear-gradient(135deg, rgba(90, 96, 105, 0.25) 0px, rgba(90, 96, 105, 0.25) 4px, rgba(90, 96, 105, 0.06) 4px, rgba(90, 96, 105, 0.06) 8px);
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
    transition: background-color 0.15s ease, opacity 0.15s ease;
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
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), var(--surface) 12px);
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
    transition: background-color 0.15s ease, opacity 0.15s ease;
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
    background: repeating-linear-gradient(135deg, var(--line-2) 0 6px, var(--surface-2) 6px 12px);
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
    box-shadow: 0 10px 30px rgba(28, 30, 34, 0.18), 0 2px 6px rgba(28, 30, 34, 0.08);
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
`;var hr="mydashlight.rides.view",yc=1100,vc=440,xc=700,wc=3*6e4,kc=1200;function $c(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var Mn=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,cr=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Ec=new URL("emoji.json",import.meta.url).href,dr=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],js=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,zs=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Tc=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,_c=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,jt={bring:"Bring",buy:"Buy"};function Cc(s,n){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return n<=1?e:`${e}s${s==="monthly"&&n===3?" (quarterly)":s==="monthly"&&n===12?" (yearly)":""}`}function Ae(s){let n=/\p{L}|\p{N}/u.exec(s);return n?n[0].toUpperCase():"?"}function Us(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Ac(s,n){return os(s,n)||Ce(s).split(",")[0]}function Pc(s){let n=s.map(e=>`${e}’s`);return n.length<2?n[0]??"":`${n.slice(0,-1).join(", ")} or ${n[n.length-1]}`}function Sc(){try{return localStorage.getItem(hr)==="timeline"?"timeline":"compact"}catch{return"compact"}}function Mc(s){try{localStorage.setItem(hr,s)}catch{}}function Hs(s,n){return xe(s).includes(n)?ge(s,n):be(s,n)}function zt(s){return s.days.every(n=>!n.events.length)}var Ut=class extends Te{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=tt(location.search).view;this.urlPage=tt(location.search).page;this.urlPast=tt(location.search).past;this.urlDayPicker=tt(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let t=e.currentTarget;this.drag={el:t,x:e.clientX,y:e.clientY,top:t.scrollTop,left:t.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let t=this.drag;if(!t)return;let o=e.clientX-t.x,i=e.clientY-t.y;if(!t.moved){if(Math.abs(o)+Math.abs(i)<6)return;t.moved=!0;try{t.el.setPointerCapture(t.id)}catch{}t.el.classList.add("dragging")}this.onTouched(),t.el.scrollTop=t.top-i,t.el.scrollLeft=t.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},wc))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor||this.forPick?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.mode=this.urlView??Sc(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null,this.forPick=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),t=`${e.date}|${e.minutes}`;t!==this.minuteKey&&(this.minuteKey=t,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.railTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let t=this.keepAt;this.keepAt=null,this.scrollToTime(t)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let t=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,a]=o.split("|"),c=e.kids.find(l=>l.id===r);(!c||(c.picks[a]??null)===i||!Bt(c,a))&&t.delete(o)}this.lunchDraft=t}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let t=new Map(this.choreDraft);for(let o of e.chores)t.has(o.id)&&gt(o)===t.get(o.id)&&t.delete(o.id);for(let o of t.keys())e.chores.some(i=>i.id===o)||t.delete(o);this.choreDraft=t}}),this.stopWatching=this.backend.watch(e=>{this.plan=lo(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<yc)return!1;let e=this.plan;return!e||this.width-vc>=ts(_e(e).length,xe(e).length)}today(){return Tt(this.plan?.time_zone??$c())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let t=this.today(),o=`${t.date}|${t.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:Co(e,t)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let t=this.today(),o=`${this.mode}|${this.boardWidth}|${t.date}|${t.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let i=this.board,r=this.boardPlan;this.board=ao(e,this.mode,this.boardWidth,t),this.boardPlan=e,this.boardKey=o,i&&r&&this.keepPlace(i,r,e)}return this.board}keepPlace(e,t,o){let i=this.scroller;if(!i||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||i.scrollTop<=0)return;let r=e.dayHeads.find(d=>d.date===this.pinDay)?.h??It,a=ss(e,i.scrollTop+r+4),c=t.days[Math.floor(a/1440)]?.date,l=c?o.days.findIndex(d=>d.date===c):-1;l>=0&&(this.keepAt=l*1440+(a-Math.floor(a/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(t=>t.date===e):-1}scrollToTime(e,t,o=!1){let i=this.scroller;if(!i||!this.board)return;let r=this.topFor(e,t);Math.abs(i.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?i.scrollTo({top:r,behavior:"smooth"}):i.scrollTop=r),this.syncDay()}topFor(e,t){let o=this.board,i=o.dayHeads.find(r=>r.date===t)?.y??0;return Math.max(i,so(o,e)-eo(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let t=this.today(),o=Math.max(0,this.dayIndexOf(t.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(t.date)?t.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let t=this.nowSpot();t&&this.scrollToTime(t.t,t.date,e)}goToDay(e,t=!1){let o=this.boardPlan;if(!o)return;let i=this.today();if(e===i.date){this.scrollToNow(t);return}let r=this.dayIndexOf(e),a=o.days[r];if(!a)return;let c=1/0;if(this.mode==="timeline"){for(let l of a.events)c=Math.min(c,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let d of l.outings)d.start!=null&&(c=Math.min(c,d.start))}this.scrollToTime(r*1440+(Number.isFinite(c)?Math.max(0,c-30):0),e,t)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let t=e.scrollTop,o=this.board.dayHeads[0];for(let c of this.board.dayHeads)c.y<=t+1&&(o=c);this.pinDay!==o.date&&(this.pinDay=o.date);let i=null,r=this.nowSpot(),a=this.today().date;if(r){let c=t-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),l=c>0?"up":"down";this.board.dayHeads.some(d=>d.date===a)&&o.date!==a?i=`${l}|Today`:this.mode==="timeline"&&Math.abs(c)>e.clientHeight*.6&&(i=`${l}|${o.date===a?"Now":"Today"}`)}this.away!==i&&(this.away=i)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,t){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,o),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,o,t&&t!==e.kid?t:void 0)}catch(r){let a=new Map(this.choreDraft);a.delete(e.id),this.choreDraft=a;let c=r instanceof ie?r:new ie("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??gt(e)}editMenu(e,t){let o=this.lunch?.kids??[],i=bt(e,t),r=o.filter(a=>a.id===e.id||i&&bt(a,t)?.dish===i.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:t,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let t=this.menuEdit;if(!(!t||!this.backend||!t.kids.length)){this.menuEdit={...t,busy:!0};try{await this.backend.setLunchMenu(t.kids,t.date,e?"":t.dish.trim(),e?"":t.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...t,busy:!1};let i=o instanceof ie?o:new ie("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,t,o){if(!this.backend||!t.length)return;let i=new Map(this.lunchDraft);for(let r of t)i.set(xn(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,t,o)}catch(r){let a=new Map(this.lunchDraft);for(let l of t)a.delete(xn(e,l));this.lunchDraft=a;let c=r instanceof ie?r:new ie("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let t=this.chores?.kids[0]?.id;this.choreEdit=e?yo(e):bo(this.chores?.kids.length===1&&t?[t]:[])}closeChorePanels(){this.forPick=null,this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(lr(),ar))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||us(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(vo(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(t){this.choreBusy=!1;let o=t instanceof ie?t:new ie("error",String(t));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(t){this.choreBusy=!1,this.removeArmed=!1;let o=t instanceof ie?t:new ie("error",String(t));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let t=this.scroller,o=this.board?.dayHeads.find(i=>i.date===this.pinDay)?.h??It;this.keepAt=t&&this.board?ss(this.board,t.scrollTop+o+4):null,this.mode=e,this.urlView||Mc(e)}findUnplaced(e,t){return this.plan?.days.find(o=>o.date===e)?.unplaced?.find(o=>o.id===t)??null}openForPick(e,t){let o=this.findUnplaced(e,t),i=this.plan;if(!o||!i)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([..._e(i),...xe(i)]);this.forPick={day:e,id:t,placed:!1,label:`${F(o.at)} ${o.title}`,recurring:!!o.recurring,word:o.reason==="unknown"?o.word:null,fromNotes:!!o.from_notes,people:o.people.filter(a=>r.has(a)),scope:"this",busy:!1}}changeForPick(e,t,o){let i=e.who?.[o.event_id],r=i?.people??[o.own??o.kid];this.closeEditor(),this.forPick={day:t.date,id:o.id,placed:!0,label:`${F(o.start)} ${o.title}`,recurring:o.recurring,word:null,fromNotes:!!i?.from_notes,people:r,scope:"this",busy:!1}}async saveForPick(e=!1){let t=this.forPick,o=this.plan;if(!t||!o||!this.backend||!e&&!t.people.length)return;let i=e?[]:t.people;this.forPick={...t,busy:!0};try{await this.backend.setPeople(t.id,i,t.scope),this.forPick=null;let r=t.label.replace(/^\S+ /,""),a=i.map(c=>Hs(o,c));this.showToast(e?`Saved. ${r} goes by the names in its title again.`:`Saved. ${r} is in ${ft(a)}’s ${a.length>1?"lanes":"lane"} now.`)}catch(r){this.forPick&&(this.forPick={...this.forPick,busy:!1});let a=r instanceof ie?r:new ie("error",String(r));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}}renderForPick(e){let t=this.plan,o=e.placed?t?.days.some($=>$.date===e.day&&$.events.some(p=>p.id===e.id)):!!this.findUnplaced(e.day,e.id),i=f`<button type="button" class="btn" ?disabled=${e.busy} @click=${()=>this.closeChorePanels()}>Cancel</button>`;if(!t||!o&&!e.busy)return f`<div class="ed-head">
          <div class="ed-titles"><span class="ed-title">Who is this for?</span></div>
          ${i}
        </div>
        <p class="field-hint">This event is sorted now: someone changed it in Google Calendar, or it’s over.</p>`;let r=e.busy,a=$=>{this.forPick&&(this.forPick={...this.forPick,...$})},c=$=>a({people:e.people.includes($)?e.people.filter(p=>p!==$):[...e.people,$]}),l=we(t),d=_e(t),h=d.length>1&&d.every($=>e.people.includes($)),g=[...d,...xe(t)].filter($=>e.people.includes($)),A=g.map($=>Hs(t,$)),b=A.length<2?A.join(""):`${A.slice(0,-1).join(", ")} & ${A[A.length-1]}`,k=($,p,O,H)=>f`<button
      type="button"
      class="who-chip"
      style="--c:${O.color};--rgb:${O.rgb}"
      aria-pressed=${e.people.includes($)?"true":"false"}
      ?disabled=${r}
      @click=${()=>c($)}
    >
      <span class="avatar ${H?"driver":""}" aria-hidden="true">${Ae(p)}</span>${p}
    </button>`;return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">Who is this for?</span>
          <span class="ed-meta">${Ce(e.day)} · ${e.label}</span>
        </div>
        ${i}
      </div>
      ${e.word?f`<p class="field-hint">“${e.word}” isn’t anyone in the family. Pick who it’s for instead.</p>`:T}
      ${e.recurring?f`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${e.scope==="this"?"true":"false"} ?disabled=${r} @click=${()=>a({scope:"this"})}>
                Just ${ye(e.day)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${e.scope==="series"?"true":"false"} ?disabled=${r} @click=${()=>a({scope:"series"})}>
                Every time
              </button>
            </div>
          </div>`:T}
      <div class="field">
        <span class="field-label">Kids</span>
        <div role="group" aria-label="Kids it’s for" class="who-chips">
          ${d.map($=>k($,be(t,$),l.get($)??de(0),!1))}
        </div>
        ${d.length>1?f`<button
              type="button"
              class="chip all-kids"
              aria-pressed=${h?"true":"false"}
              ?disabled=${r}
              @click=${()=>a({people:h?e.people.filter($=>!d.includes($)):[...d,...e.people.filter($=>!d.includes($))]})}
            >
              All the kids
            </button>`:T}
      </div>
      <div class="field">
        <span class="field-label">Parents</span>
        <div role="group" aria-label="Parents it’s for" class="who-chips">
          ${xe(t).map($=>k($,ge(t,$),pt,!0))}
        </div>
      </div>
      <p class="field-hint">
        ${g.length?f`Saved in the event’s notes as <strong>For: ${b}</strong>, so its title stays as it is. It shows in ${g.length>1?"their lanes":`${A[0]}’s lane`}${g.some($=>d.includes($))?", and rides are planned for the kids":""}.`:"Saved in the event’s notes, so its title stays as it is."}
      </p>
      ${e.fromNotes?f`<button type="button" class="chip clear" ?disabled=${r} @click=${()=>void this.saveForPick(!0)}>
            Go by the names in the title instead
          </button>`:T}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!g.length} @click=${()=>void this.saveForPick()}>
          ${r?"Saving to Google Calendar…":g.length?"Save":"Pick who it’s for"}
        </button>
      </div>
    `}renderForLine(e,t,o){let i=e.who?.[o.event_id];if(!i)return T;let r=i.people.map(a=>Hs(e,a));return f`<span class="ed-for"
      >For ${ft(r)}<button type="button" class="ed-for-change" @click=${()=>this.changeForPick(e,t,o)}>Change</button></span
    >`}findEvent(e){let t=this.plan?.days.find(i=>i.date===e.day),o=t?.events.find(i=>i.id===e.event);return t&&o?{day:t,event:o}:null}open(e,t=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,t&&this.reveal(e))}reveal(e){let t=this.findEvent(e),o=this.dayIndexOf(e.day);!t||o<0||this.scrollToTime(o*1440+Math.max(0,(t.event.arrive_by??t.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,t,o){if(!this.pending){this.pending={key:e,value:t};try{await o()}catch(i){let r=i instanceof ie?i:new ie("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,t,o,i){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&i.includes(e.drop)){i.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${t}`,o,()=>r.setRide(e.id,t,o,this.scope,!1));return}this.save(`${t}`,o,()=>r.setRide(e.id,t,o,this.scope))}setAttending(e,t){if(!this.backend||e.attending!==!1===t)return;let o=this.backend;this.save("attending",t,()=>o.setAttending(e.id,t,this.scope))}toggleStay(e,t,o){if(!this.backend)return;let i=this.backend;if(t&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>i.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",t,()=>i.setStay(e.id,t,this.scope))}toggleAlong(e,t,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,a=r.includes(t)?r.filter(c=>c!==t):[...r,t];this.save(`along-${o}`,a,()=>i.setTakeAlong(e.id,a,this.scope,o))}setTakes(e,t){if(!this.backend||(e.takes??null)===t)return;let o=this.backend;this.save("takes",t,()=>o.setTakes(e.id,t,this.scope))}nudgeArrive(e,t){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,i;t<0?i=(o??e.start)-5:i=o==null||o+5>=e.start?null:o+5,this.arriveDraft=i,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),kc)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,t=this.sel;if(e===void 0||!t||!this.backend)return;let o=this.findEvent(t);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,a)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let t=this.backend;this.save(`fix|${e}`,e,()=>t.applySuggestion(e))}render(){let e=this.plan,t=this.currentBoard(),o=this.shownPlan(),i=o?co(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?mo(this.chores,this.today().minutes).filter(u=>!this.choreDone(u)):[],c=this.forPick?this.renderForPick(this.forPick):this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,l=this.forPick?"Who is this for?":this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",d=f`<aside class="panel" aria-label=${l}>
      ${c??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,a))}
    </aside>`,h=this.page==="rides";return f`
      <div class="app ${r?"wide":this.width<xc?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${h?this.renderBanner(e):T}
          <main>
            ${h?f`<section class="board-area" aria-label="Everyone’s week">
                  ${t&&e?zt(e)?this.renderQuiet(e):this.renderBoard(t):this.renderEmpty()}
                  ${t&&o&&!zt(o)?this.renderDayRail(o):T}
                  ${t&&this.away?this.renderBackToToday(this.away):T}
                </section>`:this.page==="lunch"?f`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:f`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit||this.forPick)?f`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${d}`:T}
          </main>
        </div>
        ${r?d:T}
        ${this.toast?f`<div class="toast" role="status">${this.toast}</div>`:T}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,t,o){let i=t.problems+o;this.tick;let r=this.today(),a="";if(e){let u=e.time_zone,g=new Date(e.updated);this.error?a=f`<span class="bad">${vi(this.error)} · showing the plan from ${Jt(g,new Date,u)}</span>`:e.status&&!e.status.ok?a=f`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Jt(g,new Date,u)}</span>`:this.backend?.live||(a=`Updated ${Jt(g,new Date,u)}`)}let c=(u,g,A,b)=>f`
      <button type="button" class="seg-btn" title=${b} aria-pressed=${this.mode===u?"true":"false"} @click=${()=>this.setMode(u)}>
        ${A}<span class="seg-label">${g}</span>
      </button>
    `,l=(u,g,A)=>f`
      <button type="button" class="seg-btn" aria-pressed=${this.page===u?"true":"false"} @click=${()=>this.setPage(u)}>
        ${A}<span class="seg-label">${g}</span>
      </button>
    `,d=Ke(r.minutes),h=!!e&&zt(e);return f`
      <header>
        ${this.showMenu?f`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${ae`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:T}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Ce(r.date)}, ${d}`}>
            <span class="hm">${d.slice(0,-3)}</span><span class="ampm">${d.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${Ce(r.date)}${typeof a=="string"&&a?f`<span class="status"> · ${a}</span>`:T}
          </p>
          ${a&&typeof a!="string"?f`<p class="status">${a}</p>`:T}
        </div>
        ${e&&!h?this.renderNext(e,uo(e,r),t):T}
        <div class="controls">
          ${this.wide||h&&!o?T:f`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?T:f`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",ae`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",ae`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${l("rides","Rides",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${l("chores","Chores",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?T:l("lunch","Lunch",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,t,o){if(!t){let l=this.today().date,d=o.unassigned,h=o.laterUnassigned;if(d){let g=f`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${d} ${d===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?f`<div class="next idle needs">${g}</div>`:f`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${g}</button>`}if(h)return f`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${h} ${h===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let u=e.days.some(g=>g.date>=l&&g.events.length);return f`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${u?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${u?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let i;t.ongoing?i="On the road now":t.ahead===0?i=t.inMinutes<180?`Next trip · in ${_t(t.inMinutes)}`:"Next trip · later today":t.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${ye(t.date)}`;let r=!t.ongoing&&t.ahead===0&&t.inMinutes<=30,a=f`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Ae(t.name)}</span>
        <span class="next-lead">${t.name} · ${t.lead}</span>
        <span class="next-kids">${t.kids.map(l=>f`<span class="kid-dot" style="background:${l.color}"></span>`)}</span>
        ${t.warn?f`<span class="next-stop warn">${t.warn}</span>`:t.stop?f`<span class="next-stop">${t.stop}</span>`:T}
      </span>
    `,c=`next ${t.ongoing?"ongoing":r?"soon":""}`;return t.target?f`<button type="button" class=${c} @click=${()=>this.open(t.target)}>${a}</button>`:f`<div class=${c}>${a}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return T;let t=this.today().date,o=we(e),i=this.railShown;return f`<div
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
        ${e.days.map(r=>{let a=is(r),c=r.events.length,l=r.events.slice(0,4).map(h=>h.own?pt.color:o.get(h.kid)?.color??de(0).color),d=`${Ce(r.date)}: ${c?`${c} ${c===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return f`<button
            type="button"
            class="rail-day ${r.date===t?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${d}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===t?"Today":ye(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${l.length?l.map(h=>f`<span class="rd-dot" style="background:${h}"></span>`):f`<span class="rd-free">free</span>`}
            </span>
            ${a?f`<span class="rd-badge" aria-hidden="true">${a}</span>`:T}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[t,o]=e.split("|");return f`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${ae`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${t==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let t=_e(e),o=xe(e),i=we(e),r=t.map(a=>be(e,a));return f`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${t.slice(0,3).map((a,c)=>ae`<circle cx=${50+c*30} cy="80" r="11" fill=${i.get(a).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Pc(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${t.map(a=>{let c=i.get(a);return f`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${Ae(be(e,a))}</span>
            <span class="qw-name">${be(e,a)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(a=>f`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Ae(ge(e,a))}</span>
            <span class="qw-name">${ge(e,a)}</span>
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
      </div>`;let t=e?.unavailable_calendars.length??0;return t?f`<div class="notice-bar" role="status">
      Couldn’t read ${t===1?"one calendar":`${t} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:T}renderEmpty(){return this.error?f`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:f`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderHead(e,t=!1){return f`<div class="dh-line">
        <button
          type="button"
          class="dh-jump"
          tabindex=${t?-1:0}
          aria-label=${`${e.label}: go to this day`}
          @click=${()=>this.tapHead(e.date)}
        >
          <span class="label">${e.label}</span>${e.tag?f`<span class="tag">${e.tag}</span>`:T}
        </button>
        <span class="sub ${e.warn?"warn":""}">${e.sub}</span>
      </div>
      ${e.allDay.length?f`<div class="day-strip" style="padding-left:${ut}px">
            ${e.allDay.map(o=>{let i=f`<span class="strip-title">${o.title}</span>${o.note?f`<span class="strip-note">${o.note}</span>`:T}`,r=o.pick;return r?f`<button
                    type="button"
                    class="strip-chip warn plain pick"
                    tabindex=${t?-1:0}
                    aria-label=${`${o.title}: ${o.note} Pick who it’s for`}
                    @click=${()=>this.openForPick(e.date,r)}
                  >
                    ${i}
                  </button>`:f`<span
                    class="strip-chip ${o.warn?"warn":""} ${o.cancelled?"skipped":""} ${o.color?"":"plain"}"
                    style=${o.color?`--c:${o.color.color};--rgb:${o.color.rgb};--ink:${o.color.ink}`:""}
                    >${i}</span
                  >`})}
          </div>`:T}`}renderBoard(e){let t=this.sel,o=l=>!!l&&!!t&&l.day===t.day&&l.event===t.event,i=e.dayHeads.find(l=>l.date===this.pinDay)??e.dayHeads[0],r=e.width,a=100,c=[...e.links.map(l=>({t:"link",x:l,z:l.layer??0})),...e.preps.map(l=>({t:"prep",x:l,z:l.layer??a-1})),...e.cards.map(l=>({t:"card",x:l,z:l.layer??a})),...e.rides.map(l=>({t:"ride",x:l,z:l.layer??a+1}))].sort((l,d)=>l.z-d.z);return f`
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
        <div class="heads" style="width:${r}px">
          ${e.columns.map(l=>f`<div class="col-head ${l.kind}" style="left:${l.x}px;width:${l.w}px;--c:${l.dot};--rgb:${l.rgb}">
              <span class="avatar ${l.kind}" aria-hidden="true">${Ae(l.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${l.name}</span>${l.kind==="kid"?this.renderLunchChip(l.id,!0,l.w-58-l.name.length*10.6):T}</span>
                <span class="sub ${l.subWarn?"warn":""}">${l.sub}</span>
              </span>
            </div>`)}
        </div>
        ${i?f`<div class="pinned" aria-hidden="true" style="width:${r}px;height:${i.h}px;margin-bottom:${-i.h}px">
              ${this.renderHead(i,!0)}
            </div>`:T}
        <div class="canvas" style="width:${r}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(l=>f`<div
                class="col-bg ${l.kind}"
                style="left:${l.x}px;width:${l.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${l.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(l=>f`<div class="day-head" style="top:${l.y}px;width:${r}px;height:${l.h}px">${this.renderHead(l)}</div>`)}
          ${e.empties.map(l=>f`<span class="empty" style="top:${l.y}px">${l.text}</span>`)}
          ${e.grid.map(l=>f`<div class="grid ${l.strong?"strong":""}" style="top:${l.y}px;width:${r-60}px"></div>`)}
          ${e.hours.map(l=>f`<span class="hour" style="top:${l.y}px">${l.label}</span>`)}
          ${Ne(e.bands,l=>l.key,l=>f`<div
                class="band"
                aria-hidden="true"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;background:rgba(${l.color.rgb},0.10);border-color:rgba(${l.color.rgb},0.45)"
              ></div>`)}
          ${Ne(e.busy,l=>l.key,l=>f`<div class="busy" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span style="top:${l.labelY}px">${l.label}</span>
              </div>`)}
          ${Ne(e.windows,l=>l.key,l=>f`<div class="window" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span>${l.label}</span>
              </div>`)}
          ${Ne(c,l=>l.x.key,l=>{if(l.t==="link"){let g=l.x;return f`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;border-color:${g.color.color};background:linear-gradient(rgba(${g.color.rgb},0.11), rgba(${g.color.rgb},0.11)), var(--surface)"
                ></div>`}if(l.t==="prep"){let g=l.x;return f`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;border-color:${g.color.color};background:linear-gradient(rgba(${g.color.rgb},0.11), rgba(${g.color.rgb},0.11)), var(--surface);color:${g.color.ink}"
                >
                  ${g.label}
                </div>`}if(l.t==="ride"){let g=l.x;return f`<button
                  type="button"
                  class="ride ${g.dashed?"dashed":""} ${g.clash?"clash":""}"
                  aria-label=${g.aria}
                  style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;padding-top:${3+(g.tuckTop??0)}px;padding-bottom:${3+(g.tuckBottom??0)}px"
                  @click=${()=>this.open(g.target)}
                >
                  <span class="l1">${g.l1}</span>${g.show2?f`<span class="l2" style="-webkit-line-clamp:${g.lines2}">${g.l2}</span>`:T}
                </button>`}let d=l.x,h=d.color,u=d.skipped?`repeating-linear-gradient(135deg, rgba(${h.rgb},0.10) 0px, rgba(${h.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:d.stayed?`repeating-linear-gradient(135deg, rgba(${h.rgb},0.24) 0px, rgba(${h.rgb},0.24) 6px, rgba(${h.rgb},0.08) 6px, rgba(${h.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${h.rgb},0.15), rgba(${h.rgb},0.15)), var(--surface)`;return f`<button
                type="button"
                class="card ${d.wrap?"wrap":""} ${o(d.target)?"sel":""} ${d.clash?"clash":""} ${d.skipped?"skipped":""} ${d.cut?"cut":""}"
                aria-label=${d.aria}
                style="left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;background:${u};border-color:${d.clash?"var(--bad)":`rgba(${h.rgb},0.45)`};--c:${h.color};--rgb:${h.rgb};--ring:${h.color}"
                @click=${()=>this.open(d.target)}
              >
                <span class="top">
                  <span class="title">${d.title}</span>
                  <span class="time">${d.time}</span>
                  ${d.showDrop&&d.drop?f`<span class="line tone-${d.drop.tone}">${d.drop.text}</span>`:T}
                </span>
                ${d.showPick&&d.pick?f`<span class="line tone-${d.pick.tone}">${d.pick.text}</span>`:T}
              </button>`})}
          ${Ne(e.stays,l=>l.key,l=>f`<button
                type="button"
                class="stay ${l.cut?"cut":""}"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;border-color:${l.color.color};background:repeating-linear-gradient(135deg, rgba(${l.color.rgb},0.28) 0px, rgba(${l.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1" style="color:${l.color.ink}">${l.l1}</span><span class="l2">${l.l2}</span>
              </button>`)}
          ${Ne(e.trips,l=>l.key,l=>f`<button
                type="button"
                class="trip ${l.bad?"bad":""} ${l.stops?"list":""}"
                aria-label=${l.aria}
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1">${l.l1}${l.kids.map(d=>f`<span class="kid-dot" style="background:${d}"></span>`)}</span>
                ${l.show2?f`<span class="l2">${l.l2}</span>`:T}
                ${l.stops?l.stops.map(d=>f`<span class="stop ${d.warn?"warn":""}">${d.text}</span>`):T}
                ${l.show3?f`<span class="l3">${l.l3}</span>`:T}
              </button>`)}
          ${Ne(e.overlaps,l=>l.key,l=>f`<div class="overlap" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"></div>`)}
          ${Ne(e.marks,l=>l.key,l=>f`<span class="mark" style="left:${l.x}px;top:${l.y}px;${l.right?"transform:translateX(-100%)":""}">${l.text}</span>`)}
          ${e.now?f`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${r-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:T}
        </div>
      </div>
    `}renderAttention(e,t){let{items:o,problems:i,later:r}=e,a=this.plan,c=i+t.length,l=this.chores,d=!!l&&!cs(l);return f`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?T:f`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${d?f`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${t.length?f`<div class="attn-chores">${t.map(h=>this.renderChoreRow(h,!0))}</div>`:f`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:f`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!i?f`<div class="all-clear">
            <span class="check" aria-hidden="true">${ae`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${zt(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:T}
      ${o.map(h=>f`<div class="issue ${h.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${h.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${h.pick?f`<button type="button" class="issue-title" @click=${()=>h.pick&&this.openForPick(h.pick.day,h.pick.id)}>${h.title}</button>`:h.target?f`<button type="button" class="issue-title" @click=${()=>this.open(h.target,!0)}>${h.title}</button>`:f`<strong class="issue-title">${h.title}</strong>`}
              <span class="issue-body"
                >${h.parts?h.parts.map(u=>typeof u=="string"?u:f`<button type="button" class="issue-link" @click=${()=>this.open(u.target,!0)}>${u.text}</button>`):h.body}</span
              >
            </div>
          </div>
          ${h.suggestions.length?f`<div class="fixes">
                ${h.suggestions.map(u=>f`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(u.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${u.id}`?"Saving…":u.label}</span>
                    <span class="fix-note">${u.note}</span>
                  </button>`)}
              </div>`:T}
        </div>`)}
      ${this.wide&&a&&!zt(a)&&this.page==="rides"?this.renderLegend():T}
    `}kidColorOf(e){let t=this.plan?we(this.plan).get(e):void 0;if(t)return t;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return de(Math.max(0,o))}renderLunchChip(e,t=!1,o=1/0){let i=this.lunch,r=i?.kids.find(h=>h.id===e);if(!i||!r)return T;this.tick;let a=this.today(),c=_o(r,a.date,a.minutes,this.lunchDraft);if(!c)return T;let l=jt[c.lunch],d=`${l} lunch ${c.when}${c.menu?`: ${c.menu}`:""}`;return t&&o<36+l.length*7.4?f`<span class="lunch-chip ${c.lunch} small icon" role="img" aria-label=${d} title=${d}
        >${c.lunch==="bring"?js:zs}</span
      >`:f`<span class="lunch-chip ${c.lunch} ${t?"small":""}" title=${d}
      >${c.lunch==="bring"?js:zs}<span class="lunch-chip-text"
        >${l}${t?T:` ${c.when}`}${!t&&c.menu?f`<span class="lunch-chip-menu"> · ${c.menu}</span>`:T}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return f`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let t=ko(e),o=this.lunchMonth&&t.includes(this.lunchMonth)?this.lunchMonth:De(e.today),i=t.indexOf(o),r=d=>{let h=t[i+d];h&&(this.lunchMonth=h)},a=e.kids.some(d=>d.id===this.lunchKid)?this.lunchKid:null,c=a?e.kids.filter(d=>d.id===a):e.kids,l=e.status&&!e.status.ok?f`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:T;return f`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${ae`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${kn(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${i<0||i>=t.length-1} @click=${()=>r(1)}>
            ${ae`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":f`${cr} Edit menus`}
        </button>
      </div>
      ${l}
      <div class="chore-cols lunch-cols ${a?"wide":""}" style="--n:${c.length}">
        ${c.map(d=>this.renderLunchCard(e,d,o,a!==null))}
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
    </div>`}renderLunchCard(e,t,o,i){let r=this.kidColorOf(t.id),a=$o(e,t,o,this.lunchDraft),c=To(a),l=a.flat(),d=l.filter(b=>!b.outside&&!b.past&&b.lunch),h=t.days_off.filter(b=>De(b.first)<=o&&o<=De(b.last)),u=b=>d.filter(k=>wn(k.date)===b),g=b=>{let k=u(b);if(!k.length)return;let $=k.every(p=>p.lunch==="bring")?"buy":"bring";this.saveLunch(t.id,k.map(p=>p.date),$)},A=d.length?`${c.bring} Bring · ${c.buy} Buy${o===De(e.today)?" left this month":""}`:"No school days left this month";return f`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${t.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Ae(t.name)}</span>
        <span class="ch-text">
          <span class="name">${t.name}</span>
          <span class="sub">${A}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${jt[t.default]} unless picked</span>
          ${e.kids.length<2?T:f`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${t.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:t.id}
              >
                ${i?_c:Tc}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${t.menu_feed&&!t.menu_feed.ok?f`<p class="field-hint bad">Couldn’t read the school menu feed${t.menu_feed.error?`: ${t.menu_feed.error}`:""}.</p>`:T}
      <div class="lunch-grid" role="grid" aria-label=${`${t.name}, ${kn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((b,k)=>f`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!u(k).length}
            aria-label=${`${u(k).every($=>$.lunch==="bring")?"Buy":"Bring"} every ${b} left in ${kn(o)} for ${t.name}`}
            @click=${()=>g(k)}
          >
            ${b}
          </button>`)}
        ${l.map(b=>this.renderLunchCell(t,b,i))}
      </div>
      ${h.length?f`<p class="lunch-offs">
            No school:
            ${h.map(b=>{let k=b.first<`${o}-01`?`${o}-01`:b.first,$=De(b.last)>o?mt(`${bs(o)}-01`,-1):b.last;return`${k===$?Us(k):`${Us(k)}–${Us($)}`} ${Eo(b.title)}`}).join(" · ")}
          </p>`:T}
    </section>`}renderLunchCell(e,t,o=!1){if(t.outside)return f`<span class="lunch-day outside" aria-hidden="true"></span>`;if(t.off!==null||!t.lunch)return f`<span class="lunch-day off ${t.today?"today":""}" title=${t.off??""}>
        <span class="lunch-num">${t.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=t.lunch,r=i==="buy"?"bring":"buy",a=t.menu?`, ${t.menu}`:"",c=this.menuMode,l=this.menuEdit?.date===t.date&&this.menuEdit.kids.includes(e.id),d=c?`${e.name}, ${Ce(t.date)}${a||", no menu yet"}. Tap to ${t.menu?"change":"add"} the menu.`:`${e.name}, ${Ce(t.date)}: ${jt[i]}${t.picked?"":" (not picked yet)"}${a}. Tap to ${jt[r]}.`;return f`<button
      type="button"
      class="lunch-day ${i} ${t.picked?"picked":"unpicked"} ${t.past?"past":""} ${t.today?"today":""} ${c?"editing":""} ${l?"sel":""}"
      ?disabled=${t.past&&!c}
      aria-label=${d}
      @click=${()=>c?this.editMenu(e,t.date):void this.saveLunch(e.id,[t.date],r)}
    >
      <span class="lunch-num">${t.day}</span>
      <span class="lunch-word">${i==="bring"?js:zs}${jt[i]}</span>
      ${t.menu?f`<span class="lunch-menu">${t.menu}</span>${o&&t.sides?f`<span class="lunch-sides">${t.sides}</span>`:T}`:c?f`<span class="lunch-menu add">${Mn} Menu</span>`:T}
    </button>`}renderChoreRow(e,t=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex($=>$.id===e.kid),a=(this.plan?we(this.plan).get(e.kid):void 0)??de(Math.max(0,r)),c=o.kids[r]?.name??"",l=i===gt(e)?e:{...e,state:i?"done":"open",done_at:i?new Date().toISOString():null},d=i&&l.done_by&&l.done_by!==e.kid?o.people?.find($=>$.id===l.done_by)?.name??l.done_by_name??null:null,h=`${ls(l,o.today,o.time_zone)}${d?` · by ${d}`:""}`,u=i||fo(e),g=`${t?`${c}: `:""}${e.title}. ${h?`${h}. `:""}${i?"Done. Tap to undo.":"Tap when it’s done."}`,A=f`<span class="box" aria-hidden="true"
        >${i?ae`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:T}</span
      >
      ${e.icon?f`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:T}
      <span class="chore-text">
        <span class="chore-title">${t?f`<span class="chore-kid">${c}</span> · `:T}${e.title}</span>
        ${h?f`<span class="chore-note">${h}</span>`:T}
      </span>`,b=`chore ${i?"done":""} ${e.state==="overdue"&&!i?"overdue":""} ${u?"":"later"}`,k=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return u?f`<button type="button" class=${b} style=${k} aria-pressed=${i?"true":"false"} aria-label=${g} @click=${()=>this.tapChore(e)}>
          ${A}
        </button>`:f`<div class=${b} style=${k}>${A}</div>`}renderChores(){let e=this.chores;if(e===void 0)return f`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return f`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return f`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(cs(e))return f`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${Mn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let t=e.templates.filter(r=>r.problems.length),o=t.length?f`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${t.length===1?"1 chore needs setting up":`${t.length} chores need setting up`}</h3>
          <div class="setup-list">${t.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:T;this.tick;let i=go(e,this.plan?we(this.plan):void 0,this.today().minutes);return f`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Mn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${cr} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${i.length}">
        ${i.map(r=>{let a=r.overdue.filter(c=>!this.choreDone(c)).length+r.now.filter(c=>!this.choreDone(c)).length;return f`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Ae(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${a?`${a} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?f`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(c=>this.renderChoreRow(c))}`:T}
            ${r.now.length?f`<h3 class="chore-group">To do</h3>
                  ${r.now.map(c=>this.renderChoreRow(c))}`:T}
            ${r.done.length?f`<h3 class="chore-group">Done</h3>
                  ${r.done.map(c=>this.renderChoreRow(c))}`:T}
            ${r.later.map(c=>f`<h3 class="chore-group">${c.date===e.today?"Later today":Ac(c.date,e.today)}</h3>
                ${c.chores.map(l=>this.renderChoreRow(l))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?f`<p class="chore-none">No chores this week.</p>`:T}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,i=this.plan?we(this.plan):void 0,r=this.choreEdit?.template===e.id,a=e.problems.length?f`<span class="tmpl-note bad">${e.problems.map(ms).join(" · ")} · tap to set up</span>`:f`<span class="tmpl-note">${gs(e.who,o,e.take_turns)} · ${fs(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return f`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?f` <span class="tag-paused">Paused</span>`:T}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let l=o.findIndex(h=>h.id===c),d=i?.get(c)??de(Math.max(0,l));return f`<span class="kid-dot" style="background:${d.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let t=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return f`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Mn} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?t.map(([o,i])=>{let r=e.templates.filter(a=>a.repeats===o);return r.length?f`<section class="manage-group" aria-label=${i}>
                  <h3 class="chore-group">${i}</h3>
                  <div class="tmpl-list">${r.map(a=>this.renderTemplateRow(a))}</div>
                </section>`:T}):f`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let t=this.chores;if(!t)return f``;let o=t.kids,i=this.plan?we(this.plan):void 0,r=this.choreBusy,a=e.template?t.templates.find(b=>b.id===e.template):void 0,c=us(e),l=(a?.problems??[]).filter(b=>b!=="who:"),d=(b,k,$,p=!1)=>f`<button type="button" class="choice ${p?"wide":""}" aria-pressed=${b?"true":"false"} ?disabled=${r} @click=${$}>${k}</button>`,h=(b,k,$,p)=>f`<button type="button" class="chip" aria-pressed=${b?"true":"false"} aria-label=${p??T} ?disabled=${r} @click=${$}>${k}</button>`,u=b=>{b!==e.repeats&&this.changeDraft({repeats:b,days:a&&a.repeats===b?a.days??vn(b):vn(b)})},g=b=>{let k=e.who.includes(b)?e.who.filter($=>$!==b):o.filter($=>$.id===b||e.who.includes($.id)).map($=>$.id);this.changeDraft({who:k})},A;if(e.repeats==="school"){let b=e.days===et?new Set:e.days===""?new Set([0,1,2,3,4]):ds(e.days)??new Set,k=$=>{let p=new Set(b);p.has($)?p.delete($):p.add($),this.changeDraft({days:p.size===5?"":p.size?hs(p):et})};A=f`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${Qe.slice(0,5).map(($,p)=>h(b.has(p),$.slice(0,2),()=>k(p),$))}
          </div>
          <p class="field-hint">Weekdays with no “No School” event on the kid’s calendar.</p>
        </div>
        <div class="field">
          <span class="field-label">When</span>
          <div role="group" aria-label="When" class="choices" style="grid-template-columns:1fr 1fr">
            ${d(!e.night_before,"That morning",()=>this.changeDraft({night_before:!1}))}
            ${d(e.night_before,"The night before",()=>this.changeDraft({night_before:!0}))}
          </div>
          <p class="field-hint">${e.night_before?"Due the evening before each school day: Sunday for Monday.":"Due on the school day itself."}</p>
        </div>
        <div class="field">
          ${d(e.bring_only,e.bring_only?"Only on Bring lunch days":"Every school day, Bring or Buy",()=>this.changeDraft({bring_only:!e.bring_only}),!0)}
          <p class="field-hint">${e.bring_only?"Made only when the kid brings lunch, like Pack lunch.":"Tap to make it only on Bring lunch days, like Pack lunch."}</p>
        </div>`}else if(e.repeats==="monthly"){let b=e.days.trim(),k=/^\d+$/.test(b)?Number(b):null,$=b&&b.toLowerCase()!=="any"&&b.toLowerCase()!=="last"&&k===null;A=f`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${$?4:3}, minmax(0, 1fr))">
          ${d(b===""||b.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${d(k!==null,"On a date",()=>this.changeDraft({days:String(k??1)}))}
          ${d(b.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${$?d(!0,b,()=>{}):T}
        </div>
        ${k!==null?f`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||k<=1} @click=${()=>this.changeDraft({days:String(k-1)})}>−</button>
                <span class="arrive-value">${ps(k)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||k>=31} @click=${()=>this.changeDraft({days:String(k+1)})}>+</button>
              </span>
            </div>`:f`<p class="field-hint">${b.toLowerCase()==="last"?"Due on the month’s last day.":$?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")A=f`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let b=e.days===""||e.days.toLowerCase()==="any",k=e.days===et?new Set:b?new Set:ds(e.days)??new Set,$=p=>{let O=new Set(k);O.has(p)?O.delete(p):O.add(p),this.changeDraft({days:O.size?hs(O)||"Mon-Sun":et})};A=f`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${d(b,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${d(!b,"On set days",()=>this.changeDraft({days:b?"Sat":e.days}))}
        </div>
        ${b?f`<p class="field-hint">Shows all week, due on Sunday.</p>`:f`<div role="group" aria-label="Days of the week" class="day-chips">
                ${Qe.map((p,O)=>h(k.has(O),p.slice(0,2),()=>$(O),p))}
              </div>
              <div class="chips">
                ${h(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${h(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:T}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?gs(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===et?"No days picked":fs(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${l.length?f`<p class="field-hint bad">${l.map(ms).join(". ")}. Saving fixes it.</p>`:T}
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
          @input=${b=>this.changeDraft({title:b.target.value})}
        />
        <div role="group" aria-label="Picture" class="icon-chips">
          ${dr.map(b=>h(e.icon===b,b,()=>this.changeDraft({icon:e.icon===b?null:b}),`Picture ${b}`))}
          ${e.icon&&!dr.includes(e.icon)?h(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):T}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?f`<emoji-picker
              class="emoji-more"
              .dataSource=${Ec}
              @emoji-click=${b=>{let k=b.detail.unicode;k&&this.changeDraft({icon:k}),this.iconMore=!1}}
            ></emoji-picker>`:T}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((b,k)=>{let $=i?.get(b.id)??de(k),p=e.who.includes(b.id);return f`<button type="button" class="who-chip" style="--c:${$.color};--rgb:${$.rgb}" aria-pressed=${p?"true":"false"} ?disabled=${r} @click=${()=>g(b.id)}>
              <span class="avatar" aria-hidden="true">${Ae(b.name)}</span>${b.name}
            </button>`})}
        </div>
        ${e.who.length>1?f`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${d(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${d(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:T}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${d(e.repeats==="daily","Every day",()=>u("daily"))}
          ${d(e.repeats==="weekly","Every week",()=>u("weekly"))}
          ${d(e.repeats==="monthly","Every month",()=>u("monthly"))}
          ${d(e.repeats==="school","School days",()=>u("school"))}
        </div>
      </div>
      ${A}
      ${e.repeats==="school"?T:f`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${Cc(e.repeats,e.every)}</span>
      </div>`}
      <div class="field">
        <label class="field-label" for="chore-details">Notes <span class="field-hint">Optional, shown with the chore</span></label>
        <textarea
          id="chore-details"
          class="text-input"
          rows="2"
          .value=${e.details}
          ?disabled=${r}
          @input=${b=>this.changeDraft({details:b.target.value})}
        ></textarea>
      </div>
      ${e.template?f`<div class="field">
              ${d(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${r} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:T}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!c} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":c?c.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let t=this.lunch;if(!t)return f``;let o=e.busy,i=d=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...d})},r=d=>i({kids:e.kids.includes(d)?e.kids.filter(h=>h!==d):[...e.kids,d]}),a=t.kids.filter(d=>Bt(d,e.date)),c=e.dish.trim(),l=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${Ce(e.date)}</span>
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
          @input=${d=>i({dish:d.target.value})}
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
          @input=${d=>i({details:d.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${a.map(d=>{let h=this.kidColorOf(d.id),u=e.kids.includes(d.id);return f`<button type="button" class="who-chip" style="--c:${h.color};--rgb:${h.rgb}" aria-pressed=${u?"true":"false"} ?disabled=${o} @click=${()=>r(d.id)}>
              <span class="avatar" aria-hidden="true">${Ae(d.name)}</span>${d.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${c||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?f`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:T}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!l} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":l??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let t=this.chores;if(!t)return f``;let o=t.people?.length?t.people:t.kids.map(h=>({...h,role:"kid"})),i=t.kids.findIndex(h=>h.id===e.kid),r=t.kids[i],a=this.plan?we(this.plan):void 0,c=a?.get(e.kid)??de(Math.max(0,i)),l=o.filter(h=>h.id!==e.kid),d=h=>{let u=t.kids.findIndex(g=>g.id===h.id);return u>=0?(a?.get(h.id)??de(u)).color:"var(--dark)"};return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:T}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${ls(e,t.today,t.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${c.color};--rgb:${c.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${Ae(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?f`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${l.map(h=>f`<button type="button" class="done-by" style="--c:${d(h)}" @click=${()=>void this.toggleChore(e,h.id)}>
                  <span class="avatar ${h.role==="parent"?"driver":""}" aria-hidden="true">${Ae(h.name)}</span>
                  <span>${h.name}</span>
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
    </div>`}ownHint(e,t){let o=yn(e,t);if(t.takes!=null){let r=t.planned!=null?`It’s fitted in at ${F(t.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${t.takes} min any time from ${F(t.start)} to ${F(t.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=t.along.map(r=>xe(e).includes(r)?ge(e,r):be(e,r));return`${o} drives there and back${i.length?`, with ${ft(i)}`:""}.`}renderEditor(e){let t=this.findEvent(this.sel);if(!t)return f``;let{day:o,event:i}=t,r=xe(e),a=no(e,i),c=yn(e,i),l=!!this.pending,d=j=>this.pending?.key===j?this.pending.value:void 0,h=[...e.people?.carpools??[]];for(let j of e.days)for(let te of j.events)for(let m of[te.drop,te.pick])m&&m!=="none"&&!r.includes(m)&&!h.some(D=>D.toLowerCase()===m.toLowerCase())&&h.push(m);let u=j=>{if(!i.sides.includes(j))return T;let te=d(j)??d("both"),m=j==="drop"?i.drop:i.pick,D=te!==void 0?String(te):i.no_ride_unless_named&&m==="none"?"":m,U=D===""&&!(te===void 0&&i.no_ride_unless_named),I=D&&D!=="none"&&!r.includes(D)?D:"",y=K=>{this.otherOpen=null,this.setRide(i,j,D===K?"":K,r)},C=[...r.map(K=>[K,ns(e,K)]),["none","Not needed"]],P=`${i.id}|${j}`,S=this.otherOpen===P;return f`<div class="field ride-box">
        <span class="field-label">${j==="drop"?"Drop-off":"Pick-up"} ${U?f`<span class="nobody">· nobody yet</span>`:T}</span>
        <div role="group" aria-label=${j==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${C.length+1}, minmax(0, 1fr))">
          ${C.map(([K,L])=>f`<button type="button" class="choice" aria-pressed=${D===K?"true":"false"} ?disabled=${l} @click=${()=>y(K)}>
                ${L}
              </button>`)}
          <button
            type="button"
            class="choice"
            aria-pressed=${I?"true":"false"}
            aria-expanded=${S?"true":"false"}
            ?disabled=${l}
            @click=${()=>this.otherOpen=S?null:P}
          >
            ${I||"Other"}
          </button>
        </div>
        ${S?f`${h.length?f`<div role="group" aria-label=${j==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${h.map(K=>f`<button type="button" class="chip" aria-pressed=${D.toLowerCase()===K.toLowerCase()?"true":"false"} ?disabled=${l} @click=${()=>y(K)}>
                    ${K}
                  </button>`)}
            </div>`:T}
        <input
          type="text"
          .value=${I&&!h.some(K=>K.toLowerCase()===I.toLowerCase())?I:""}
          ?disabled=${l}
          aria-label=${j==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${K=>{let L=K.target.value.trim();L&&L!==D&&y(L)}}
          @keydown=${K=>{K.key==="Enter"&&K.target.blur()}}
        />`:T}
        ${!$&&D!==""&&D!=="none"?g(j,D):T}
      </div>`},g=(j,te)=>{let m=d(`along-${j}`),D=m!==void 0?m:j==="pick"?i.pick_along??[]:i.along,U=[..._e(e).filter(y=>y!==i.kid),...r.filter(y=>y!==te)];return U.length?f`<div class="field-sub">
        <span class="field-label">${j==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${j==="pick"?"Coming home too. Anyone already there just gets in.":j==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${j==="drop"?"Riding along on the drop-off":j==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${U.map(y=>f`<button type="button" class="chip" aria-pressed=${D.includes(y)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(i,y,j)}>
              ${r.includes(y)?ge(e,y):be(e,y)}
            </button>`)}
        </div>
      </div>`:T},A=r.includes(i.drop)?i.drop:r.includes(i.pick)?i.pick:"",b=i.drop===i.pick&&r.includes(i.drop),k=d("stay"),$=k!==void 0?!!k:i.stay&&b,p=d("along"),O=p!==void 0?p:i.along,H=i.own?[..._e(e),...r.filter(j=>j!==i.own)]:[],q=i.own!=null&&i.takes!=null,ue=i.own!=null&&!q,x=d("takes"),w=x!==void 0?x:i.takes??null,v=d("arrive"),E=this.arriveDraft!==void 0?this.arriveDraft:v!==void 0?v:i.arrive_by,_=i.sides.includes("drop")&&i.sides.includes("pick"),M=_&&($||this.stayDraft===i.id),N=()=>{let j=_?f`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${M?"false":"true"}
              ?disabled=${l}
              @click=${()=>{this.stayDraft=null,i.stay&&this.toggleStay(i,!1,A)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${M?"true":"false"}
              ?disabled=${l}
              @click=${()=>{A?this.toggleStay(i,!0,A):this.stayDraft=i.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:T;if(!M)return f`${j} ${u("drop")} ${u("pick")}`;let te=$&&b?i.drop:"";return f`${j}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${te?T:f`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(m=>f`<button
                type="button"
                class="choice"
                aria-pressed=${te===m?"true":"false"}
                ?disabled=${l}
                @click=${()=>{if(te===m||!this.backend)return;let D=this.backend;this.stayDraft=null,this.save("stay",!0,()=>D.setRide(i.id,"both",m,this.scope,!0))}}
              >
                ${ge(e,m)}
              </button>`)}
          </div>
          ${te?g("both",te):T}
        </div>`},W=[],X=j=>j==="none"?"Not needed":ns(e,j),Q=j=>r.includes(j)?ge(e,j):be(e,j),z=(j,te,m)=>{te===""&&!m.length||W.push(`${j}: ${[te===""?"TBD":X(te),...m.map(Q)].join(", ")}`)},J=j=>i.no_ride_unless_named&&j==="none"?"":j;i.own||z("Drop-off",J(i.drop),i.along),i.own||z("Pick-up",J(i.pick),i.pick_along??[]),!i.own&&i.stay&&W.push("Stay: yes"),q&&W.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&W.push(`Take along: ${i.along.map(Q).join(", ")}`),i.arrive_by!=null&&W.push(`Arrive by: ${Ke(i.arrive_by)}`);let oe=d("attending"),Z=oe!==void 0?!!oe:i.attending!==!1;i.attending===!1&&W.splice(0,W.length,"Attending: no");let ke=o.date===this.today().date?"":`${ye(o.date)} · `,me=bn(i),le=f`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${c} · ${i.title}</span>
          <span class="ed-meta">${ke}${q?"any time ":""}${me}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
          ${this.renderForLine(e,o,i)}
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;if(i.busy_only){let j=i.place_name&&i.place_name!==i.title?i.place_name:"",te=i.busy_why==="days"?"It runs over more than a day, so no drive is planned for it.":i.busy_why==="home"?"It’s at home, so no drive is planned for it.":"It has no address, so no drive is planned for it.";return f`${le}
        ${this.pending?f`<p class="saving" role="status">Saving to Google Calendar…</p>`:T}
        ${j?f`<div class="field"><span class="field-label">Where</span><span class="field-hint">${j}</span></div>`:T}
        <p class="field-hint">
          ${Z?`This blocks ${c}’s time: ${c} can’t drive then, so a ride that needs ${c} shows as a problem.`:`Not going, so it doesn’t block ${c}’s time, and ${c} can drive then.`}
          ${te}
        </p>
        <button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.setAttending(i,!Z)}>
          ${Z?`${c} isn’t going this time`:`${c} is going after all`}
        </button>
        ${i.problems.length?f`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:T}
        <details class="notes">
          <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
          <span class="notes-body">--- Rides ---\n${i.attending===!1?"Attending: no":"(nothing yet)"}</span>
        </details>`}return i.where==="home"?f`${le}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:f`
      ${le}
      ${this.pending?f`<p class="saving" role="status">Saving to Google Calendar…</p>`:T}
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
          </div>`:T}
      ${Z?f`${i.where==="anywhere"?f`<p class="field-hint">
                  ${i.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:T}
            ${i.own?f`<p class="field-hint">${this.ownHint(e,i)}</p>`:N()}
      ${i.own?f`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${w!=null?`Takes ${w} min, any time ${F(i.start)}–${F(i.end)}`:"At its set time"}</span>
            </span>
            ${w!=null?f`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${l||w<=5} @click=${()=>this.setTakes(i,Math.max(5,w-5))}>−</button>
                  <span class="arrive-value">${w} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${l||w+5>i.end-i.start} @click=${()=>this.setTakes(i,w+5)}>+</button>
                </span>`:T}
          </div>
          <button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.setTakes(i,w!=null?null:Math.min(10,Math.max(5,i.end-i.start)))}>
            ${w!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:T}
      ${ue&&H.length?f`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${H.map(j=>f`<button type="button" class="chip" aria-pressed=${O.includes(j)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(i,j)}>
                  ${r.includes(j)?ge(e,j):be(e,j)}
                </button>`)}
            </div>
          </div>`:T}
      ${q?T:f`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${E!=null?`${i.start-E} min before it starts`:`Aims for a few minutes before ${F(i.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${l} @click=${()=>this.nudgeArrive(i,-5)}>−</button>
          <span class="arrive-value">${E!=null?F(E):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${l||E==null} @click=${()=>this.nudgeArrive(i,5)}>+</button>
        </span>
      </div>
      ${E!=null?f`<button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:T}`}
`:f`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${c} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.setAttending(i,!Z)}>
        ${Z?`${c} isn’t going this time`:`${c} is going after all`}
      </button>
      ${i.problems.length?f`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:T}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${W.length?W.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${Z&&!i.own?f`<p class="field-hint">Tap a selected driver again to clear it.</p>`:T}
    `}};Ut.styles=Ao,Ut.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0},forPick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Ut);function Dc(){let s=[document];for(let n of document.querySelectorAll("*"))n.shadowRoot&&s.push(n.shadowRoot);return s}function ur(s=3e3){let n=new CSSStyleSheet;n.replaceSync("*, *::before, *::after { cursor: none !important; }"),n.disabled=!0;let e,t=i=>{if(i)for(let r of Dc())r.adoptedStyleSheets.includes(n)||(r.adoptedStyleSheets=[...r.adoptedStyleSheets,n]);n.disabled=!i},o=i=>{if(clearTimeout(e),i.pointerType==="touch"){t(!0);return}t(!1),e=setTimeout(()=>t(!0),s)};window.addEventListener("pointermove",o,{passive:!0}),window.addEventListener("pointerdown",o,{passive:!0}),e=setTimeout(()=>t(!0),s)}function pr(s){try{return new URL(s).searchParams.get("v")}catch{return null}}function fr(s,n,e){if(!n)return()=>{};let t=e.everyMs??6e5,o=e.retryMs??3e4,i=e.idleMs??12e4,r=null,a=null,c=0,l=!1,d=A=>{if(l||a)return;let b=e.idleFor();if(b>=i){e.reload(A);return}a=setTimeout(()=>{a=null,d(A)},i-b)},h=async()=>{try{let A=await s.sendMessagePromise({type:"mydashlight/app_version"});c=0;let b=A["kiosk.js"];!l&&b&&b!==n&&d(b)}catch{if(l||r||++c>20)return;r=setTimeout(()=>{r=null,h()},o)}},u=()=>{c=0,h()};s.addEventListener?.("ready",u);let g=setInterval(()=>void h(),t);return()=>{l=!0,clearInterval(g),r&&clearTimeout(r),a&&clearTimeout(a),s.removeEventListener?.("ready",u)}}function gr(s,n=6e4,e=15e3){let t=null,o=setInterval(()=>{if(!s.connected||t)return;let i=!1;t=setTimeout(()=>{t=null,!i&&s.connected&&s.reconnect(!0)},e);let r=()=>{i=!0,t&&clearTimeout(t),t=null};s.ping().then(r,r)},n);return()=>{clearInterval(o),t&&clearTimeout(t),t=null}}var mr=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],br=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function yr(s,n,e,t){let o=Math.max(0,Math.min(n,s.length)),i=Math.max(o,Math.min(e,s.length));return{value:s.slice(0,o)+t+s.slice(i),caret:o+t.length}}function vr(s,n,e){let t=Math.max(0,Math.min(n,s.length)),o=Math.max(t,Math.min(e,s.length));if(t!==o)return{value:s.slice(0,t)+s.slice(o),caret:t};if(t===0)return{value:s,caret:0};let i=Array.from(s.slice(0,t));i.pop();let r=i.join("");return{value:r+s.slice(t),caret:r.length}}function xr(s,n){return n===0||/\s$/.test(s.slice(0,n))}var Lc=new Set(["text","search","email","url","tel","number","password"]);function wr(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&Lc.has(s.type)&&!s.readOnly&&!s.disabled}var Rc={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},Ic={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},Ht=class extends Te{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=t=>t.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let t=e.selectionStart,o=e.selectionEnd;if(t!==null&&o!==null)return[t,o]}catch{}return[e.value.length,e.value.length]}apply(e,t,o){e.value=t;try{e.setSelectionRange(o,o)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=xr(this.field.value,e)}press(e){let t=this.field;if(t){switch(e){case"hide":t.blur();return;case"done":this.commit(),t.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),t.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[o,i]=this.selection(t),r=vr(t.value,o,i);this.apply(t,r.value,r.caret);break}default:{let o=e==="space"?" ":this.shift?e.toUpperCase():e,[i,r]=this.selection(t),a=yr(t.value,i,r,o);this.apply(t,a.value,a.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let t=e.length>1,o=e==="layout"?this.layout==="letters"?"123":"ABC":Rc[e]??(this.shift?e.toUpperCase():e);return f`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":t?"wide":""}
      aria-label=${Ic[e]??o}
      aria-pressed=${e==="shift"?String(this.shift):T}
      @click=${()=>this.press(e)}
    >
      ${o}
    </button>`}render(){let e=this.layout==="letters"?mr:br;return f`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(t=>f`<div class="row">${t.map(o=>this.key(o))}</div>`)}
      </div>`}};Ht.styles=Ve`
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
  `,Ht.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",Ht);function Bc(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function kr(s){let n=new WeakSet,e=r=>{let a=r.composedPath();i(a);let c=a[0];wr(c)&&s.attach(c)},t=()=>{setTimeout(()=>{let r=Bc();!s.target||r===s.target||(wr(r)?s.attach(r):s.detach())},0)},o=r=>{n.has(r)||(n.add(r),r.addEventListener("focusin",e),r.addEventListener("focusout",t))},i=r=>{for(let a of r)a instanceof ShadowRoot&&o(a)};o(document),document.addEventListener("pointerdown",r=>i(r.composedPath()),{capture:!0}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var Fs="mydashlight",Oc=`/api/${Fs}/pair`,Nc=`/api/${Fs}/pair/poll`,Ks=`/${Fs}`,Ws="pair";function $r(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function Er(s,n){return`${s}${Ks}?${Ws}=${encodeURIComponent(n)}`}function jc(s,n,e=Date.now()){return{hassUrl:s,clientId:n.client_id,access_token:n.access_token,refresh_token:n.refresh_token,expires_in:n.expires_in,expires:e+n.expires_in*1e3}}var rt=class extends Error{constructor(n,e=!1){super(n),this.busy=e}};async function Tr(s=fetch){let n=await s(Oc,{method:"POST",cache:"no-store"});if(n.status===429)throw new rt("Too many screens are asking to pair right now.",!0);if(!n.ok)throw new rt(`Home Assistant answered ${n.status}.`);return await n.json()}async function _r(s,n,e=fetch){let t=await e(Nc,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(t.status===404)return{status:"expired"};if(!t.ok)throw new rt(`Home Assistant answered ${t.status}.`);let o=await t.json();return o.status==="paired"&&o.auth?{status:"paired",auth:jc(n,o.auth)}:{status:"pending"}}var kt=function(s,n){let o=s,i=Ft[n],r=null,a=0,c=null,l=[],d={},h=function(x,w){a=o*4+17,r=(function(v){let E=new Array(v);for(let _=0;_<v;_+=1){E[_]=new Array(v);for(let M=0;M<v;M+=1)E[_][M]=null}return E})(a),u(0,0),u(a-7,0),u(0,a-7),b(),A(),$(x,w),o>=7&&k(x),c==null&&(c=H(o,i,l)),p(c,w)},u=function(x,w){for(let v=-1;v<=7;v+=1)if(!(x+v<=-1||a<=x+v))for(let E=-1;E<=7;E+=1)w+E<=-1||a<=w+E||(0<=v&&v<=6&&(E==0||E==6)||0<=E&&E<=6&&(v==0||v==6)||2<=v&&v<=4&&2<=E&&E<=4?r[x+v][w+E]=!0:r[x+v][w+E]=!1)},g=function(){let x=0,w=0;for(let v=0;v<8;v+=1){h(!0,v);let E=He.getLostPoint(d);(v==0||x>E)&&(x=E,w=v)}return w},A=function(){for(let x=8;x<a-8;x+=1)r[x][6]==null&&(r[x][6]=x%2==0);for(let x=8;x<a-8;x+=1)r[6][x]==null&&(r[6][x]=x%2==0)},b=function(){let x=He.getPatternPosition(o);for(let w=0;w<x.length;w+=1)for(let v=0;v<x.length;v+=1){let E=x[w],_=x[v];if(r[E][_]==null)for(let M=-2;M<=2;M+=1)for(let N=-2;N<=2;N+=1)M==-2||M==2||N==-2||N==2||M==0&&N==0?r[E+M][_+N]=!0:r[E+M][_+N]=!1}},k=function(x){let w=He.getBCHTypeNumber(o);for(let v=0;v<18;v+=1){let E=!x&&(w>>v&1)==1;r[Math.floor(v/3)][v%3+a-8-3]=E}for(let v=0;v<18;v+=1){let E=!x&&(w>>v&1)==1;r[v%3+a-8-3][Math.floor(v/3)]=E}},$=function(x,w){let v=i<<3|w,E=He.getBCHTypeInfo(v);for(let _=0;_<15;_+=1){let M=!x&&(E>>_&1)==1;_<6?r[_][8]=M:_<8?r[_+1][8]=M:r[a-15+_][8]=M}for(let _=0;_<15;_+=1){let M=!x&&(E>>_&1)==1;_<8?r[8][a-_-1]=M:_<9?r[8][15-_-1+1]=M:r[8][15-_-1]=M}r[a-8][8]=!x},p=function(x,w){let v=-1,E=a-1,_=7,M=0,N=He.getMaskFunction(w);for(let W=a-1;W>0;W-=2)for(W==6&&(W-=1);;){for(let X=0;X<2;X+=1)if(r[E][W-X]==null){let Q=!1;M<x.length&&(Q=(x[M]>>>_&1)==1),N(E,W-X)&&(Q=!Q),r[E][W-X]=Q,_-=1,_==-1&&(M+=1,_=7)}if(E+=v,E<0||a<=E){E-=v,v=-v;break}}},O=function(x,w){let v=0,E=0,_=0,M=new Array(w.length),N=new Array(w.length);for(let z=0;z<w.length;z+=1){let J=w[z].dataCount,oe=w[z].totalCount-J;E=Math.max(E,J),_=Math.max(_,oe),M[z]=new Array(J);for(let le=0;le<M[z].length;le+=1)M[z][le]=255&x.getBuffer()[le+v];v+=J;let Z=He.getErrorCorrectPolynomial(oe),me=Kt(M[z],Z.getLength()-1).mod(Z);N[z]=new Array(Z.getLength()-1);for(let le=0;le<N[z].length;le+=1){let j=le+me.getLength()-N[z].length;N[z][le]=j>=0?me.getAt(j):0}}let W=0;for(let z=0;z<w.length;z+=1)W+=w[z].totalCount;let X=new Array(W),Q=0;for(let z=0;z<E;z+=1)for(let J=0;J<w.length;J+=1)z<M[J].length&&(X[Q]=M[J][z],Q+=1);for(let z=0;z<_;z+=1)for(let J=0;J<w.length;J+=1)z<N[J].length&&(X[Q]=N[J][z],Q+=1);return X},H=function(x,w,v){let E=Cr.getRSBlocks(x,w),_=Ar();for(let N=0;N<v.length;N+=1){let W=v[N];_.put(W.getMode(),4),_.put(W.getLength(),He.getLengthInBits(W.getMode(),x)),W.write(_)}let M=0;for(let N=0;N<E.length;N+=1)M+=E[N].dataCount;if(_.getLengthInBits()>M*8)throw"code length overflow. ("+_.getLengthInBits()+">"+M*8+")";for(_.getLengthInBits()+4<=M*8&&_.put(0,4);_.getLengthInBits()%8!=0;)_.putBit(!1);for(;!(_.getLengthInBits()>=M*8||(_.put(236,8),_.getLengthInBits()>=M*8));)_.put(17,8);return O(_,E)};d.addData=function(x,w){w=w||"Byte";let v=null;switch(w){case"Numeric":v=zc(x);break;case"Alphanumeric":v=Uc(x);break;case"Byte":v=Hc(x);break;case"Kanji":v=Fc(x);break;default:throw"mode:"+w}l.push(v),c=null},d.isDark=function(x,w){if(x<0||a<=x||w<0||a<=w)throw x+","+w;return r[x][w]},d.getModuleCount=function(){return a},d.make=function(){if(o<1){let x=1;for(;x<40;x++){let w=Cr.getRSBlocks(x,i),v=Ar();for(let _=0;_<l.length;_++){let M=l[_];v.put(M.getMode(),4),v.put(M.getLength(),He.getLengthInBits(M.getMode(),x)),M.write(v)}let E=0;for(let _=0;_<w.length;_++)E+=w[_].dataCount;if(v.getLengthInBits()<=E*8)break}o=x}h(!1,g())},d.createTableTag=function(x,w){x=x||2,w=typeof w>"u"?x*4:w;let v="";v+='<table style="',v+=" border-width: 0px; border-style: none;",v+=" border-collapse: collapse;",v+=" padding: 0px; margin: "+w+"px;",v+='">',v+="<tbody>";for(let E=0;E<d.getModuleCount();E+=1){v+="<tr>";for(let _=0;_<d.getModuleCount();_+=1)v+='<td style="',v+=" border-width: 0px; border-style: none;",v+=" border-collapse: collapse;",v+=" padding: 0px; margin: 0px;",v+=" width: "+x+"px;",v+=" height: "+x+"px;",v+=" background-color: ",v+=d.isDark(E,_)?"#000000":"#ffffff",v+=";",v+='"/>';v+="</tr>"}return v+="</tbody>",v+="</table>",v},d.createSvgTag=function(x,w,v,E){let _={};typeof arguments[0]=="object"&&(_=arguments[0],x=_.cellSize,w=_.margin,v=_.alt,E=_.title),x=x||2,w=typeof w>"u"?x*4:w,v=typeof v=="string"?{text:v}:v||{},v.text=v.text||null,v.id=v.text?v.id||"qrcode-description":null,E=typeof E=="string"?{text:E}:E||{},E.text=E.text||null,E.id=E.text?E.id||"qrcode-title":null;let M=d.getModuleCount()*x+w*2,N,W,X,Q,z="",J;for(J="l"+x+",0 0,"+x+" -"+x+",0 0,-"+x+"z ",z+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',z+=_.scalable?"":' width="'+M+'px" height="'+M+'px"',z+=' viewBox="0 0 '+M+" "+M+'" ',z+=' preserveAspectRatio="xMinYMin meet"',z+=E.text||v.text?' role="img" aria-labelledby="'+q([E.id,v.id].join(" ").trim())+'"':"",z+=">",z+=E.text?'<title id="'+q(E.id)+'">'+q(E.text)+"</title>":"",z+=v.text?'<description id="'+q(v.id)+'">'+q(v.text)+"</description>":"",z+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',z+='<path d="',X=0;X<d.getModuleCount();X+=1)for(Q=X*x+w,N=0;N<d.getModuleCount();N+=1)d.isDark(X,N)&&(W=N*x+w,z+="M"+W+","+Q+J);return z+='" stroke="transparent" fill="black"/>',z+="</svg>",z},d.createDataURL=function(x,w){x=x||2,w=typeof w>"u"?x*4:w;let v=d.getModuleCount()*x+w*2,E=w,_=v-w;return qc(v,v,function(M,N){if(E<=M&&M<_&&E<=N&&N<_){let W=Math.floor((M-E)/x),X=Math.floor((N-E)/x);return d.isDark(X,W)?0:1}else return 1})},d.createImgTag=function(x,w,v){x=x||2,w=typeof w>"u"?x*4:w;let E=d.getModuleCount()*x+w*2,_="";return _+="<img",_+=' src="',_+=d.createDataURL(x,w),_+='"',_+=' width="',_+=E,_+='"',_+=' height="',_+=E,_+='"',v&&(_+=' alt="',_+=q(v),_+='"'),_+="/>",_};let q=function(x){let w="";for(let v=0;v<x.length;v+=1){let E=x.charAt(v);switch(E){case"<":w+="&lt;";break;case">":w+="&gt;";break;case"&":w+="&amp;";break;case'"':w+="&quot;";break;default:w+=E;break}}return w},ue=function(x){x=typeof x>"u"?2:x;let v=d.getModuleCount()*1+x*2,E=x,_=v-x,M,N,W,X,Q,z={"██":"█","█ ":"▀"," █":"▄","  ":" "},J={"██":"▀","█ ":"▀"," █":" ","  ":" "},oe="";for(M=0;M<v;M+=2){for(W=Math.floor((M-E)/1),X=Math.floor((M+1-E)/1),N=0;N<v;N+=1)Q="█",E<=N&&N<_&&E<=M&&M<_&&d.isDark(W,Math.floor((N-E)/1))&&(Q=" "),E<=N&&N<_&&E<=M+1&&M+1<_&&d.isDark(X,Math.floor((N-E)/1))?Q+=" ":Q+="█",oe+=x<1&&M+1>=_?J[Q]:z[Q];oe+=`
`}return v%2&&x>0?oe.substring(0,oe.length-v-1)+Array(v+1).join("▀"):oe.substring(0,oe.length-1)};return d.createASCII=function(x,w){if(x=x||1,x<2)return ue(w);x-=1,w=typeof w>"u"?x*2:w;let v=d.getModuleCount()*x+w*2,E=w,_=v-w,M,N,W,X,Q=Array(x+1).join("██"),z=Array(x+1).join("  "),J="",oe="";for(M=0;M<v;M+=1){for(W=Math.floor((M-E)/x),oe="",N=0;N<v;N+=1)X=1,E<=N&&N<_&&E<=M&&M<_&&d.isDark(W,Math.floor((N-E)/x))&&(X=0),oe+=X?Q:z;for(W=0;W<x;W+=1)J+=oe+`
`}return J.substring(0,J.length-1)},d.renderTo2dContext=function(x,w){w=w||2;let v=d.getModuleCount();for(let E=0;E<v;E++)for(let _=0;_<v;_++)x.fillStyle=d.isDark(E,_)?"black":"white",x.fillRect(_*w,E*w,w,w)},d};kt.stringToBytes=function(s){let n=[];for(let e=0;e<s.length;e+=1){let t=s.charCodeAt(e);n.push(t&255)}return n};kt.createStringToBytes=function(s,n){let e=(function(){let o=Wc(s),i=function(){let c=o.read();if(c==-1)throw"eof";return c},r=0,a={};for(;;){let c=o.read();if(c==-1)break;let l=i(),d=i(),h=i(),u=String.fromCharCode(c<<8|l),g=d<<8|h;a[u]=g,r+=1}if(r!=n)throw r+" != "+n;return a})(),t=63;return function(o){let i=[];for(let r=0;r<o.length;r+=1){let a=o.charCodeAt(r);if(a<128)i.push(a);else{let c=e[o.charAt(r)];typeof c=="number"?(c&255)==c?i.push(c):(i.push(c>>>8),i.push(c&255)):i.push(t)}}return i}};var ve={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},Ft={L:1,M:0,Q:3,H:2},Ue={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},He=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],n=1335,e=7973,t=21522,o={},i=function(r){let a=0;for(;r!=0;)a+=1,r>>>=1;return a};return o.getBCHTypeInfo=function(r){let a=r<<10;for(;i(a)-i(n)>=0;)a^=n<<i(a)-i(n);return(r<<10|a)^t},o.getBCHTypeNumber=function(r){let a=r<<12;for(;i(a)-i(e)>=0;)a^=e<<i(a)-i(e);return r<<12|a},o.getPatternPosition=function(r){return s[r-1]},o.getMaskFunction=function(r){switch(r){case Ue.PATTERN000:return function(a,c){return(a+c)%2==0};case Ue.PATTERN001:return function(a,c){return a%2==0};case Ue.PATTERN010:return function(a,c){return c%3==0};case Ue.PATTERN011:return function(a,c){return(a+c)%3==0};case Ue.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case Ue.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case Ue.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case Ue.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+r}},o.getErrorCorrectPolynomial=function(r){let a=Kt([1],0);for(let c=0;c<r;c+=1)a=a.multiply(Kt([1,Fe.gexp(c)],0));return a},o.getLengthInBits=function(r,a){if(1<=a&&a<10)switch(r){case ve.MODE_NUMBER:return 10;case ve.MODE_ALPHA_NUM:return 9;case ve.MODE_8BIT_BYTE:return 8;case ve.MODE_KANJI:return 8;default:throw"mode:"+r}else if(a<27)switch(r){case ve.MODE_NUMBER:return 12;case ve.MODE_ALPHA_NUM:return 11;case ve.MODE_8BIT_BYTE:return 16;case ve.MODE_KANJI:return 10;default:throw"mode:"+r}else if(a<41)switch(r){case ve.MODE_NUMBER:return 14;case ve.MODE_ALPHA_NUM:return 13;case ve.MODE_8BIT_BYTE:return 16;case ve.MODE_KANJI:return 12;default:throw"mode:"+r}else throw"type:"+a},o.getLostPoint=function(r){let a=r.getModuleCount(),c=0;for(let h=0;h<a;h+=1)for(let u=0;u<a;u+=1){let g=0,A=r.isDark(h,u);for(let b=-1;b<=1;b+=1)if(!(h+b<0||a<=h+b))for(let k=-1;k<=1;k+=1)u+k<0||a<=u+k||b==0&&k==0||A==r.isDark(h+b,u+k)&&(g+=1);g>5&&(c+=3+g-5)}for(let h=0;h<a-1;h+=1)for(let u=0;u<a-1;u+=1){let g=0;r.isDark(h,u)&&(g+=1),r.isDark(h+1,u)&&(g+=1),r.isDark(h,u+1)&&(g+=1),r.isDark(h+1,u+1)&&(g+=1),(g==0||g==4)&&(c+=3)}for(let h=0;h<a;h+=1)for(let u=0;u<a-6;u+=1)r.isDark(h,u)&&!r.isDark(h,u+1)&&r.isDark(h,u+2)&&r.isDark(h,u+3)&&r.isDark(h,u+4)&&!r.isDark(h,u+5)&&r.isDark(h,u+6)&&(c+=40);for(let h=0;h<a;h+=1)for(let u=0;u<a-6;u+=1)r.isDark(u,h)&&!r.isDark(u+1,h)&&r.isDark(u+2,h)&&r.isDark(u+3,h)&&r.isDark(u+4,h)&&!r.isDark(u+5,h)&&r.isDark(u+6,h)&&(c+=40);let l=0;for(let h=0;h<a;h+=1)for(let u=0;u<a;u+=1)r.isDark(u,h)&&(l+=1);let d=Math.abs(100*l/a/a-50)/5;return c+=d*10,c},o})(),Fe=(function(){let s=new Array(256),n=new Array(256);for(let t=0;t<8;t+=1)s[t]=1<<t;for(let t=8;t<256;t+=1)s[t]=s[t-4]^s[t-5]^s[t-6]^s[t-8];for(let t=0;t<255;t+=1)n[s[t]]=t;let e={};return e.glog=function(t){if(t<1)throw"glog("+t+")";return n[t]},e.gexp=function(t){for(;t<0;)t+=255;for(;t>=256;)t-=255;return s[t]},e})(),Kt=function(s,n){if(typeof s.length>"u")throw s.length+"/"+n;let e=(function(){let o=0;for(;o<s.length&&s[o]==0;)o+=1;let i=new Array(s.length-o+n);for(let r=0;r<s.length-o;r+=1)i[r]=s[r+o];return i})(),t={};return t.getAt=function(o){return e[o]},t.getLength=function(){return e.length},t.multiply=function(o){let i=new Array(t.getLength()+o.getLength()-1);for(let r=0;r<t.getLength();r+=1)for(let a=0;a<o.getLength();a+=1)i[r+a]^=Fe.gexp(Fe.glog(t.getAt(r))+Fe.glog(o.getAt(a)));return Kt(i,0)},t.mod=function(o){if(t.getLength()-o.getLength()<0)return t;let i=Fe.glog(t.getAt(0))-Fe.glog(o.getAt(0)),r=new Array(t.getLength());for(let a=0;a<t.getLength();a+=1)r[a]=t.getAt(a);for(let a=0;a<o.getLength();a+=1)r[a]^=Fe.gexp(Fe.glog(o.getAt(a))+i);return Kt(r,0).mod(o)},t},Cr=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],n=function(o,i){let r={};return r.totalCount=o,r.dataCount=i,r},e={},t=function(o,i){switch(i){case Ft.L:return s[(o-1)*4+0];case Ft.M:return s[(o-1)*4+1];case Ft.Q:return s[(o-1)*4+2];case Ft.H:return s[(o-1)*4+3];default:return}};return e.getRSBlocks=function(o,i){let r=t(o,i);if(typeof r>"u")throw"bad rs block @ typeNumber:"+o+"/errorCorrectionLevel:"+i;let a=r.length/3,c=[];for(let l=0;l<a;l+=1){let d=r[l*3+0],h=r[l*3+1],u=r[l*3+2];for(let g=0;g<d;g+=1)c.push(n(h,u))}return c},e})(),Ar=function(){let s=[],n=0,e={};return e.getBuffer=function(){return s},e.getAt=function(t){let o=Math.floor(t/8);return(s[o]>>>7-t%8&1)==1},e.put=function(t,o){for(let i=0;i<o;i+=1)e.putBit((t>>>o-i-1&1)==1)},e.getLengthInBits=function(){return n},e.putBit=function(t){let o=Math.floor(n/8);s.length<=o&&s.push(0),t&&(s[o]|=128>>>n%8),n+=1},e},zc=function(s){let n=ve.MODE_NUMBER,e=s,t={};t.getMode=function(){return n},t.getLength=function(r){return e.length},t.write=function(r){let a=e,c=0;for(;c+2<a.length;)r.put(o(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?r.put(o(a.substring(c,c+1)),4):a.length-c==2&&r.put(o(a.substring(c,c+2)),7))};let o=function(r){let a=0;for(let c=0;c<r.length;c+=1)a=a*10+i(r.charAt(c));return a},i=function(r){if("0"<=r&&r<="9")return r.charCodeAt(0)-48;throw"illegal char :"+r};return t},Uc=function(s){let n=ve.MODE_ALPHA_NUM,e=s,t={};t.getMode=function(){return n},t.getLength=function(i){return e.length},t.write=function(i){let r=e,a=0;for(;a+1<r.length;)i.put(o(r.charAt(a))*45+o(r.charAt(a+1)),11),a+=2;a<r.length&&i.put(o(r.charAt(a)),6)};let o=function(i){if("0"<=i&&i<="9")return i.charCodeAt(0)-48;if("A"<=i&&i<="Z")return i.charCodeAt(0)-65+10;switch(i){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+i}};return t},Hc=function(s){let n=ve.MODE_8BIT_BYTE,e=s,t=kt.stringToBytes(s),o={};return o.getMode=function(){return n},o.getLength=function(i){return t.length},o.write=function(i){for(let r=0;r<t.length;r+=1)i.put(t[r],8)},o},Fc=function(s){let n=ve.MODE_KANJI,e=s,t=kt.stringToBytes;(function(r,a){let c=t(r);if(c.length!=2||(c[0]<<8|c[1])!=a)throw"sjis not supported."})("友",38726);let o=t(s),i={};return i.getMode=function(){return n},i.getLength=function(r){return~~(o.length/2)},i.write=function(r){let a=o,c=0;for(;c+1<a.length;){let l=(255&a[c])<<8|255&a[c+1];if(33088<=l&&l<=40956)l-=33088;else if(57408<=l&&l<=60351)l-=49472;else throw"illegal char at "+(c+1)+"/"+l;l=(l>>>8&255)*192+(l&255),r.put(l,13),c+=2}if(c<a.length)throw"illegal char at "+(c+1)},i},Pr=function(){let s=[],n={};return n.writeByte=function(e){s.push(e&255)},n.writeShort=function(e){n.writeByte(e),n.writeByte(e>>>8)},n.writeBytes=function(e,t,o){t=t||0,o=o||e.length;for(let i=0;i<o;i+=1)n.writeByte(e[i+t])},n.writeString=function(e){for(let t=0;t<e.length;t+=1)n.writeByte(e.charCodeAt(t))},n.toByteArray=function(){return s},n.toString=function(){let e="";e+="[";for(let t=0;t<s.length;t+=1)t>0&&(e+=","),e+=s[t];return e+="]",e},n},Kc=function(){let s=0,n=0,e=0,t="",o={},i=function(a){t+=String.fromCharCode(r(a&63))},r=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return o.writeByte=function(a){for(s=s<<8|a&255,n+=8,e+=1;n>=6;)i(s>>>n-6),n-=6},o.flush=function(){if(n>0&&(i(s<<6-n),s=0,n=0),e%3!=0){let a=3-e%3;for(let c=0;c<a;c+=1)t+="="}},o.toString=function(){return t},o},Wc=function(s){let n=s,e=0,t=0,o=0,i={};i.read=function(){for(;o<8;){if(e>=n.length){if(o==0)return-1;throw"unexpected end of file./"+o}let c=n.charAt(e);if(e+=1,c=="=")return o=0,-1;if(c.match(/^\s$/))continue;t=t<<6|r(c.charCodeAt(0)),o+=6}let a=t>>>o-8&255;return o-=8,a};let r=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return i},Vc=function(s,n){let e=s,t=n,o=new Array(s*n),i={};i.setPixel=function(l,d,h){o[d*e+l]=h},i.write=function(l){l.writeString("GIF87a"),l.writeShort(e),l.writeShort(t),l.writeByte(128),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(255),l.writeByte(255),l.writeByte(255),l.writeString(","),l.writeShort(0),l.writeShort(0),l.writeShort(e),l.writeShort(t),l.writeByte(0);let d=2,h=a(d);l.writeByte(d);let u=0;for(;h.length-u>255;)l.writeByte(255),l.writeBytes(h,u,255),u+=255;l.writeByte(h.length-u),l.writeBytes(h,u,h.length-u),l.writeByte(0),l.writeString(";")};let r=function(l){let d=l,h=0,u=0,g={};return g.write=function(A,b){if(A>>>b)throw"length over";for(;h+b>=8;)d.writeByte(255&(A<<h|u)),b-=8-h,A>>>=8-h,u=0,h=0;u=A<<h|u,h=h+b},g.flush=function(){h>0&&d.writeByte(u)},g},a=function(l){let d=1<<l,h=(1<<l)+1,u=l+1,g=c();for(let p=0;p<d;p+=1)g.add(String.fromCharCode(p));g.add(String.fromCharCode(d)),g.add(String.fromCharCode(h));let A=Pr(),b=r(A);b.write(d,u);let k=0,$=String.fromCharCode(o[k]);for(k+=1;k<o.length;){let p=String.fromCharCode(o[k]);k+=1,g.contains($+p)?$=$+p:(b.write(g.indexOf($),u),g.size()<4095&&(g.size()==1<<u&&(u+=1),g.add($+p)),$=p)}return b.write(g.indexOf($),u),b.write(h,u),b.flush(),A.toByteArray()},c=function(){let l={},d=0,h={};return h.add=function(u){if(h.contains(u))throw"dup key:"+u;l[u]=d,d+=1},h.size=function(){return d},h.indexOf=function(u){return l[u]},h.contains=function(u){return typeof l[u]<"u"},h};return i},qc=function(s,n,e){let t=Vc(s,n);for(let a=0;a<n;a+=1)for(let c=0;c<s;c+=1)t.setPixel(c,a,e(c,a));let o=Pr();t.write(o);let i=Kc(),r=o.toByteArray();for(let a=0;a<r.length;a+=1)i.writeByte(r[a]);return i.flush(),"data:image/gif;base64,"+i},Sr=kt,Bh=kt.stringToBytes;function Mr(s){let n=Sr(0,"M");n.addData(s),n.make();let e=n.getModuleCount(),t="";for(let o=0;o<e;o++)for(let i=0;i<e;i++)n.isDark(o,i)&&(t+=`M${i} ${o}h1v1h-1z`);return{size:e,d:t}}var Gc=1e4,Wt=class extends Te{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,t){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,t))}async newCode(){try{let e=await Tr();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof rt&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),Gc)}}async poll(e){let t=this.secret;if(t)try{let o=await _r(t,location.origin);if(!this.running||t!==this.secret)return;if(this.problem=null,o.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:o.auth}));return}if(o.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return T;let{size:e,d:t}=Mr(Er(location.origin,this.code));return f`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${ae`<path d=${t} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return f`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?$r(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${Ks}?${Ws}</span> and type the code.
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
    </div>`}};Wt.styles=Ve`
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
  `,Wt.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",Wt);var Vs="hassTokens";function Dr(){try{let s=localStorage.getItem(Vs);return s?JSON.parse(s):null}catch{return null}}function qs(s){try{s?localStorage.setItem(Vs,JSON.stringify(s)):localStorage.removeItem(Vs)}catch{}}function Yc(s){let n=document.getElementById("problem");n&&(n.hidden=!1,n.querySelector("p").textContent=s)}function Jc(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(n=>{let e=t=>{s.stop(),s.hidden=!0,n(t)};s.addEventListener("paired",t=>e(t.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function Xc(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let n=location.search.includes("auth_callback");if(!n&&!Dr()){let e=await Jc();e&&qs(e)}try{let e=await pi({hassUrl:location.origin,loadTokens:async()=>Dr(),saveTokens:qs});n&&history.replaceState(null,"",location.pathname+ys(location.search));let t=await fi({auth:e});s.backend=new Xt(t),gr(t),fr(t,pr(import.meta.url),{reload:Zc,idleFor:()=>Date.now()-Br}),t.addEventListener("reconnect-error",(o,i)=>{i===2&&Rr()})}catch(e){if(e===2){Rr();return}Yc(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}var Br=Date.now();for(let s of["pointerdown","keydown","wheel"])document.addEventListener(s,()=>Br=Date.now(),{capture:!0,passive:!0});var Lr="mydashlight-reloaded-for";function Zc(s){try{if(sessionStorage.getItem(Lr)===s)return;sessionStorage.setItem(Lr,s)}catch{}location.reload()}function Rr(){qs(null),location.replace(location.pathname+ys(location.search))}var Or=tt(location.search),Ir=document.querySelector("mydashlight-keyboard");Ir&&Or.keyboard!==!1&&kr(Ir);Or.cursor!=="show"&&ur();Xc();
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
