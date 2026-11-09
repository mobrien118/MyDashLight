var To=Object.defineProperty;var vn=(s,t)=>()=>(s&&(t=s(s=0)),t);var Co=(s,t)=>{for(var e in t)To(s,e,{get:t[e],enumerable:!0})};function rn(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function Qn(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function kr(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Ni(s){return kr(s,t=>t.unicode)}function Er(s){function t(e,n,o){let i=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(o)for(let[r,[l,c]]of Object.entries(o))i.createIndex(r,l,{multiEntry:c});return i}t(rt),t(qe,br,{[Hi]:[mr,!0],[Wi]:[[vr,xr]],[Ki]:[yr,!0]}),t(ss,void 0,{[Fi]:[""]})}function Vi(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function Tr(s){let t=await new Promise((e,n)=>{let o=indexedDB.open(s,fr);ts[s]=o,o.onupgradeneeded=i=>{i.oldVersion<gr&&Er(o.result)},Vi(e,n,o)});return t.onclose=()=>os(s),t}function Cr(s){return ln[s]||(ln[s]=Tr(s)),ln[s]}function De(s,t,e,n){return new Promise((o,i)=>{let r=s.transaction(t,e,{durability:"relaxed"}),l=typeof t=="string"?r.objectStore(t):t.map(a=>r.objectStore(a)),c;n(l,r,a=>{c=a}),r.oncomplete=()=>o(c),r.onerror=()=>i(r.error)})}function os(s){let t=ts[s],e=t&&t.result;if(e){e.close();let n=cn[s];if(n)for(let o of n)o()}delete ts[s],delete ln[s],delete cn[s]}function _r(s){return new Promise((t,e)=>{os(s);let n=indexedDB.deleteDatabase(s);Vi(t,e,n)})}function Sr(s,t){let e=cn[s];e||(e=cn[s]=[]),e.push(t)}function ot(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||Ar.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function Gi(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=Pr)}function Mr(s){return s.map(({annotation:e,emoticon:n,group:o,order:i,shortcodes:r,skins:l,tags:c,emoji:a,version:d})=>{let p=[...new Set(Gi([...(r||[]).map(ot).flat(),...(c||[]).map(ot).flat(),...ot(e),n]))].sort(),f={annotation:e,group:o,order:i,tags:c,tokens:p,unicode:a,version:d};if(n&&(f.emoticon=n),r&&(f.shortcodes=r),l){f.skinTones=[],f.skinUnicodes=[],f.skinVersions=[];for(let{tone:b,emoji:E,version:v}of l)f.skinTones.push(b),f.skinUnicodes.push(E),f.skinVersions.push(v)}return f})}function qi(s,t,e,n){s[t](e).onsuccess=o=>n&&n(o.target.result)}function Ge(s,t,e){qi(s,"get",t,e)}function Yi(s,t,e){qi(s,"getAll",t,e)}function rs(s){s.commit&&s.commit()}function Dr(s,t){let e=s[0];for(let n=1;n<s.length;n++){let o=s[n];t(e)>t(o)&&(e=o)}return e}function Xi(s,t){let e=Dr(s,o=>o.length),n=[];for(let o of e)s.some(i=>i.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function Lr(s){return!await as(s,rt,dn)}async function jr(s,t,e){let[n,o]=await Promise.all([es,dn].map(i=>as(s,rt,i)));return n===e&&o===t}async function Rr(s,t){return De(s,qe,lt,(n,o,i)=>{let r,l=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let a=c.target.result;for(let d of a)if(r=d.unicode,t(d))return i(d);if(a.length<50)return i();l()}};l()})}async function Zi(s,t,e,n){try{let o=Mr(t);await De(s,[qe,rt],is,([i,r],l)=>{let c,a,d=0;function p(){++d===2&&f()}function f(){if(!(c===n&&a===e)){i.clear();for(let b of o)i.put(b);r.put(n,es),r.put(e,dn),rs(l)}}Ge(r,es,b=>{c=b,p()}),Ge(r,dn,b=>{a=b,p()})})}finally{}}async function zr(s,t){return De(s,qe,lt,(e,n,o)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);Yi(e.index(Wi),i,o)})}async function Ji(s,t){let e=Gi(ot(t));return e.length?De(s,qe,lt,(n,o,i)=>{let r=[],l=()=>{r.length===e.length&&c()},c=()=>{let a=Xi(r,d=>d.unicode);i(a.sort((d,p)=>d.order<p.order?-1:1))};for(let a=0;a<e.length;a++){let d=e[a],p=a===e.length-1?IDBKeyRange.bound(d,d+"￿",!1,!0):IDBKeyRange.only(d);Yi(n.index(Hi),p,f=>{r.push(f),l()})}}):[]}async function Ir(s,t){let e=await Ji(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(i=>i.toLowerCase()).includes(t.toLowerCase()))[0]||null:await Rr(s,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function Br(s,t){return De(s,qe,lt,(e,n,o)=>Ge(e,t,i=>{if(i)return o(i);Ge(e.index(Ki),t,r=>o(r||null))}))}function as(s,t,e){return De(s,t,lt,(n,o,i)=>Ge(n,e,i))}function Or(s,t,e,n){return De(s,t,is,(o,i)=>{o.put(n,e),rs(i)})}function Nr(s,t){return De(s,ss,is,(e,n)=>Ge(e,t,o=>{e.put((o||0)+1,t),rs(n)}))}function Ur(s,t,e){return e===0?[]:De(s,[ss,qe],lt,([n,o],i,r)=>{let l=[];n.index(Fi).openCursor(void 0,"prev").onsuccess=c=>{let a=c.target.result;if(!a)return r(l);function d(b){if(l.push(b),l.length===e)return r(l);a.continue()}let p=a.primaryKey,f=t.byName(p);if(f)return d(f);Ge(o,p,b=>{if(b)return d(b);a.continue()})}})}function Hr(s,t){let e=new Map;for(let o of s){let i=t(o);for(let r of i){let l=e;for(let a=0;a<r.length;a++){let d=r.charAt(a),p=l.get(d);p||(p=new Map,l.set(d,p)),l=p}let c=l.get(an);c||(c=[],l.set(an,c)),c.push(o)}}return(o,i)=>{let r=e;for(let a=0;a<o.length;a++){let d=o.charAt(a),p=r.get(d);if(p)r=p;else return[]}if(i)return r.get(an)||[];let l=[],c=[r];for(;c.length;){let d=[...c.shift().entries()].sort((p,f)=>p[0]<f[0]?-1:1);for(let[p,f]of d)p===an?l.push(...f):c.push(f)}return l}}function Wr(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||Fr.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function Ui(s){Wr(s);let t=(f,b)=>f.name.toLowerCase()<b.name.toLowerCase()?-1:1,e=s.sort(t),o=Hr(s,f=>{let b=new Set;if(f.shortcodes)for(let E of f.shortcodes)for(let v of ot(E))b.add(v);return b}),i=f=>o(f,!0),r=f=>o(f,!1),l=f=>{let b=ot(f),E=b.map((v,y)=>(y<b.length-1?i:r)(v));return Xi(E,v=>v.name).sort(t)},c=new Map,a=new Map;for(let f of s){a.set(f.name.toLowerCase(),f);for(let b of f.shortcodes||[])c.set(b.toLowerCase(),f)}return{all:e,search:l,byShortcode:f=>c.get(f.toLowerCase()),byName:f=>a.get(f.toLowerCase())}}function Et(s){if(!s)return s;if(Kr&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function Qi(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function Gr(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||Vr.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function eo(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function qr(s){let t=await fetch(s,{method:"HEAD"});eo(t,s);let e=t.headers.get("etag");return Qi(e),e}async function ns(s){let t=await fetch(s);eo(t,s);let e=t.headers.get("etag");Qi(e);let n=await t.json();return Gr(n),[e,n]}function Yr(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function Xr(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=s.charCodeAt(o);return e}async function to(s){let t=JSON.stringify(s),e=Xr(t),n=await crypto.subtle.digest("SHA-1",e),o=Yr(n);return btoa(o)}async function Zr(s,t){let e,n=await qr(t);if(!n){let o=await ns(t);n=o[0],e=o[1],n||(n=await to(e))}await jr(s,t,n)||(e||(e=(await ns(t))[1]),await Zi(s,e,t,n))}async function Jr(s,t){let[e,n]=await ns(t);e||(e=await to(n)),await Zi(s,n,t,e)}async function Qr(s,t){try{await Zr(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var fr,gr,qe,rt,ss,mr,Hi,br,Fi,vr,xr,Wi,es,dn,Oi,lt,is,Ki,yr,wr,$r,ts,ln,cn,Ar,Pr,an,Fr,Kr,Vr,at,ls=vn(()=>{fr=1,gr=1,qe="emoji",rt="keyvalue",ss="favorites",mr="tokens",Hi="tokens",br="unicode",Fi="count",vr="group",xr="order",Wi="group-order",es="eTag",dn="url",Oi="skinTone",lt="readonly",is="readwrite",Ki="skinUnicodes",yr="skinUnicodes",wr="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",$r="en";ts={},ln={},cn={};Ar=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);Pr=2;an="";Fr=["name","url"];Kr=typeof wrappedJSObject<"u";Vr=["annotation","emoji","group","order","version"];at=class{constructor({dataSource:t=wr,locale:e=$r,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=Ui(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await Cr(this._dbName);Sr(this._dbName,this._clear);let e=this.dataSource;await Lr(t)?await Jr(t,e):this._lazyUpdate=Qr(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return Qn(t),await this.ready(),Ni(await zr(this._db,t)).map(Et)}async getEmojiBySearchQuery(t){rn(t),await this.ready();let e=this._custom.search(t),n=Ni(await Ji(this._db,t)).map(Et);return[...e,...n]}async getEmojiByShortcode(t){rn(t),await this.ready();let e=this._custom.byShortcode(t);return e||Et(await Ir(this._db,t))}async getEmojiByUnicodeOrName(t){rn(t),await this.ready();let e=this._custom.byName(t);return e||Et(await Br(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await as(this._db,rt,Oi)||0}async setPreferredSkinTone(t){return Qn(t),await this.ready(),Or(this._db,rt,Oi,t)}async incrementFavoriteEmojiCount(t){return rn(t),await this.ready(),Nr(this._db,t)}async getTopFavoriteEmoji(t){return Qn(t),await this.ready(),(await Ur(this._db,this._custom,t)).map(Et)}set customEmoji(t){this._custom=Ui(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await os(this._dbName)}async delete(){await this._shutdown(),await _r(this._dbName)}}});function so(s){return s.unicode.includes("‍")}function la(s){let t=io(s,"#000"),e=io(s,"#fff");return t&&e&&aa(t,e)}function da(){let s=Object.entries(ta);try{for(let[t,e]of s)if(la(t))return e}catch{}finally{}return s[0][1]}function ga(s,t){if(t===0)return s;let e=s.indexOf(ha);return e!==-1?s.substring(0,e)+String.fromCodePoint(ua+t-1)+s.substring(e):(s.endsWith(ca)&&(s=s.substring(0,s.length-1)),s+pa+String.fromCodePoint(fa+t-1))}function Te(s){s.preventDefault(),s.stopPropagation()}function hs(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function fo(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function ma(s,t){let e=n=>{let o={};for(let i of n)typeof i.tone=="number"&&i.version<=t&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:n,skins:o,shortcodes:i,url:r,name:l,category:c,annotation:a})=>({unicode:n,name:l,shortcodes:i,url:r,category:c,annotation:a,id:n||l,skins:o&&e(o)}))}function va(s,t,e){let n;ba?(n=new ResizeObserver(e),n.observe(s)):hn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function oo(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function ro(s,t,e){let n=oo(t);if(!n){if(!Ye){Ye=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])Ye.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(Ye),Ye.firstChild.nodeValue=s,oo(Ye)}finally{Ye.remove()}}return n}function ya(s,t,e){let n=!0;for(let o of s){let i=e(o);if(!i)continue;typeof us>"u"&&(us=ro(xa,t,t));let l=ro(o.unicode,i,t)/1.8<us;bs.set(o.unicode,l),l||(n=!1)}return n}function wa(s){return fo(s,t=>t)}function $a(s){s&&(s.scrollTop=0)}function Tt(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function ao(s){return""+s}function ka(s){let t=document.createElement("template");return t.innerHTML=s,t}function Sa(s,t){_a?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function Aa(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function Pa(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=Aa(n,s):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&Sa(n,s)}function Ma(s,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:l,attributeValuePost:c}}=e,a=s[i];if(o!==a)if(e.currentExpression=a,r)if(a===null)n.removeAttribute(r);else{let d=l+ao(a)+c;n.setAttribute(r,d)}else{let d;Array.isArray(a)?Pa(a,e):a instanceof Element?(d=a,n.replaceWith(d)):n.nodeValue=ao(a),d&&(e.targetNode=d)}}}function Da(s){let t="",e=!1,n=!1,o=-1,i=new Map,r=[],l=0;for(let a=0,d=s.length;a<d;a++){let p=s[a];if(t+=p.slice(l),a===d-1)break;for(let u=0;u<p.length;u++)switch(p.charAt(u)){case"<":{p.charAt(u+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let f=r[r.length-1],b=Tt(i,f,()=>[]),E,v,y;if(n){let u=/(\S+)="?([^"=]*)$/.exec(p);E=u[1],v=u[2];let S=/^([^">]*)("?)/.exec(s[a+1]);y=S[1],t=t.slice(0,-1*u[0].length),l=S[0].length}else l=0;let T={attributeName:E,attributeValuePre:v,attributeValuePost:y,expressionIndex:a};b.push(T),!e&&!n&&(t+=" ")}return{template:ka(t),elementsToBindings:i}}function lo(s,t,e){for(let n=0;n<s.length;n++){let o=s[n],i=o.attributeName?t:t.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function La(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))lo(n,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let l=t.get(++r);l&&lo(l,i,e)}while(i=o.nextNode())}return e}function ja(s){let{template:t,elementsToBindings:e}=Tt(Ea,s,()=>Da(s)),n=t.cloneNode(!0).content.firstElementChild,o=La(n,e);return function(r){return Ma(r,o),n}}function Ra(s){let t=Tt(Ta,s,()=>new Map),e=Ca;function n(i,...r){let l=Tt(t,i,()=>new Map);return Tt(l,e,()=>ja(i))(r)}function o(i,r,l){return i.map((c,a)=>{let d=e;e=l(c);try{return r(c,a)}finally{e=d}})}return{map:o,html:n}}function za(s,t,e,n,o,i,r,l,c){let{labelWithSkin:a,titleForEmoji:d,unicodeWithSkin:p}=e,{html:f,map:b}=Ra(t);function E(u,S,z){return b(u,(V,Q)=>f`<button role="${S?"option":"menuitem"}" aria-selected="${S?Q===t.activeSearchItem:null}" aria-label="${a(V,t.currentSkinTone)}" title="${d(V)}" class="${"emoji"+(S&&Q===t.activeSearchItem?" active":"")+(V.unicode?"":" custom-emoji")}" id="${`${z}-${V.id}`}" style="${V.unicode?null:`--custom-emoji-background: url(${JSON.stringify(V.url)})`}">${V.unicode?p(V,t.currentSkinTone):""}</button>`,V=>`${z}-${V.id}`)}let y=f`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${b(t.skinTones,(u,S)=>f`<div id="skintone-${S}" class="emoji ${S===t.activeSkinTone?"active":""}" aria-selected="${S===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[S]}" aria-label="${t.i18n.skinTones[S]}">${u}</div>`,u=>u)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${b(t.groups,u=>f`<button role="tab" class="nav-button" aria-controls="tab-${u.id}" aria-label="${t.i18n.categories[u.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===u.id}" title="${t.i18n.categories[u.name]}" data-group-id="${u.id}"><div class="nav-emoji emoji">${u.emoji}</div></button>`,u=>u.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${b(t.currentEmojisWithCategories,(u,S)=>f`<div><div id="menu-label-${S}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:u.category?u.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${S!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(u.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${S}" id="${t.searchMode?"search-results":null}">${E(u.emojis,t.searchMode,"emo")}</div></div>`,u=>u.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${E(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,T=(u,S)=>{for(let z of s.querySelectorAll(`[${u}]`))S(z,z.getAttribute(u))};if(c){s.appendChild(y);for(let u of["click","focusout","input","keydown","keyup"])T(`data-on-${u}`,(S,z)=>{S.addEventListener(u,n[z])});T("data-ref",(u,S)=>{i[S]=u}),r.addEventListener("abort",()=>{s.removeChild(y)})}T("data-action",(u,S)=>{let z=l.get(S);z||l.set(S,z=new WeakSet),z.has(u)||(z.add(u),o[S](u))})}function Ia(s){let t=!1,e,n=new Map,o=new Set,i,r=()=>{if(t)return;let a=[...o];o.clear();try{for(let d of a)d()}finally{i=!1,o.size&&(i=!0,un(r))}},l=new Proxy({},{get(a,d){if(e){let p=n.get(d);p||(p=new Set,n.set(d,p)),p.add(e)}return a[d]},set(a,d,p){if(a[d]!==p){a[d]=p;let f=n.get(d);if(f){for(let b of f)o.add(b);i||(i=!0,un(r))}}return!0}}),c=a=>{let d=()=>{let p=e;e=d;try{return a()}finally{e=p}};return d()};return s.addEventListener("abort",()=>{t=!0}),{state:l,createEffect:c}}function fs(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function Ba(s,t,e){{let n=s.closest(".tabpanel"),o=co.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),co.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function Oa(s,t){let e={},n=new AbortController,o=n.signal,{state:i,createEffect:r}=Ia(o),l=new Map;pn(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),pn(i,t),pn(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:ia,isRtl:!1,currentGroupIndex:0,groups:ds,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let c=m=>{s.getElementById(m).focus()},a=m=>s.getElementById(`emo-${m.id}`),d=(m,$)=>{e.rootElement.dispatchEvent(new CustomEvent(m,{detail:$,bubbles:!0,composed:!0}))},p=(m,$)=>m.id===$.id,f=(m,$)=>{let{category:x,emojis:_}=m,{category:I,emojis:H}=$;return x!==I?!1:fs(_,H,p)},b=m=>{fs(i.currentEmojis,m,p)||(i.currentEmojis=m)},E=m=>{i.searchMode!==m&&(i.searchMode=m)},v=m=>{fs(i.currentEmojisWithCategories,m,f)||(i.currentEmojisWithCategories=m)},y=(m,$)=>$&&m.skins&&m.skins[$]||m.unicode,S={labelWithSkin:(m,$)=>wa([m.name||y(m,$),m.annotation,...m.shortcodes||gs].filter(Boolean)).join(", "),titleForEmoji:m=>m.annotation||(m.shortcodes||gs).join(", "),unicodeWithSkin:y},z={onClickSkinToneButton:le,onEmojiClick:ne,onNavClick:L,onNavKeydown:ee,onSearchKeydown:Re,onSkinToneOptionsClick:N,onSkinToneOptionsFocusOut:D,onSkinToneOptionsKeydown:g,onSkinToneOptionsKeyup:A,onSearchInput:P},V={calculateEmojiGridStyle:F,updateOnIntersection:ue},Q=!0;r(()=>{za(s,i,S,z,V,e,o,l,Q),Q=!1}),i.emojiVersion||ps().then(m=>{m||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function m(){let $=!1,x=setTimeout(()=>{$=!0,i.message=i.i18n.loadingMessage},na);try{await i.database.ready(),i.databaseLoaded=!0}catch(_){console.error(_),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(x),$&&($=!1,i.message="")}}i.database&&m()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${no};`}),r(()=>{i.customEmoji&&i.database&&G()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==ms&&(i.groups=ms):i.groups!==ds&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=ds)}),r(()=>{async function m(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}m()}),r(()=>{i.skinTones=Array(no).fill().map((m,$)=>ga(i.skinToneEmoji,$))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function m(){let{database:$}=i,x=(await Promise.all(oa.map(_=>$.getEmojiByUnicodeOrName(_)))).filter(Boolean);i.defaultFavoriteEmojis=x}i.databaseLoaded&&m()});function G(){let{customEmoji:m,database:$}=i,x=m||gs;$.customEmoji!==x&&($.customEmoji=x)}r(()=>{async function m(){G();let{database:$,defaultFavoriteEmojis:x,numColumns:_}=i,I=await $.getTopFavoriteEmoji(_),H=await me(fo([...I,...x],U=>U.unicode||U.name).slice(0,_));i.currentFavorites=H}i.databaseLoaded&&i.defaultFavoriteEmojis&&m()});function F(m){va(m,o,()=>{{let $=getComputedStyle(e.rootElement),x=parseInt($.getPropertyValue("--num-columns"),10),_=$.getPropertyValue("direction")==="rtl";i.numColumns=x,i.isRtl=_}})}function ue(m){Ba(m,o,$=>{for(let{target:x,isIntersecting:_}of $)x.classList.toggle("onscreen",_)})}r(()=>{async function m(){let{searchText:$,currentGroup:x,databaseLoaded:_,customEmoji:I}=i;if(!_)i.currentEmojis=[],i.searchMode=!1;else if($.length>=ea){let H=await Ze($);i.searchText===$&&(b(H),E(!0))}else{let{id:H}=x;if(H!==-1||I&&I.length){let U=await _e(H);i.currentGroup.id===H&&(b(U),E(!1))}}}m()});let Z=()=>{hn(()=>$a(e.tabpanelElement))};r(()=>{let{currentEmojis:m,emojiVersion:$}=i,x=m.filter(_=>_.unicode).filter(_=>so(_)&&!bs.has(_.unicode));if(!$&&x.length)b(m),hn(()=>dt(x));else{let _=$?m:m.filter(ge);b(_),Z()}});function dt(m){ya(m,e.baselineEmoji,a)?Z():i.currentEmojis=[...i.currentEmojis]}function ge(m){return!m.unicode||!so(m)||bs.get(m.unicode)}async function Le(m){let $=i.emojiVersion||await ps();return m.filter(({version:x})=>!x||x<=$)}async function me(m){return ma(m,i.emojiVersion||await ps())}async function _e(m){let $=m===-1?i.customEmoji:await i.database.getEmojiByGroup(m);return me(await Le($))}async function Ze(m){return me(await Le(await i.database.getEmojiBySearchQuery(m)))}r(()=>{}),r(()=>{function m(){let{searchMode:x,currentEmojis:_}=i;if(x)return[{category:"",emojis:_}];let I=new Map;for(let H of _){let U=H.category||"",de=I.get(U);de||(de=[],I.set(U,de)),de.push(H)}return[...I.entries()].map(([H,U])=>({category:H,emojis:U})).sort((H,U)=>i.customCategorySorting(H.category,U.category))}let $=m();v($)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:m}=i;ho(()=>{i.searchText=(m||"").trim(),i.activeSearchItem=-1})});function Re(m){if(!i.searchMode||!i.currentEmojis.length)return;let $=x=>{Te(m),i.activeSearchItem=hs(x,i.activeSearchItem,i.currentEmojis)};switch(m.key){case"ArrowDown":return $(!1);case"ArrowUp":return $(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return Te(m),te(i.currentEmojis[i.activeSearchItem].id)}}function L(m){let{target:$}=m,x=$.closest(".nav-button");if(!x)return;let _=parseInt(x.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(I=>I.id===_)}function ee(m){let{target:$,key:x}=m,_=I=>{I&&(Te(m),I.focus())};switch(x){case"ArrowLeft":return _($.previousElementSibling);case"ArrowRight":return _($.nextElementSibling);case"Home":return _($.parentElement.firstElementChild);case"End":return _($.parentElement.lastElementChild)}}async function j(m){let $=await i.database.getEmojiByUnicodeOrName(m),x=[...i.currentEmojis,...i.currentFavorites].find(I=>I.id===m),_=x.unicode&&y(x,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(m),{emoji:$,skinTone:i.currentSkinTone,..._&&{unicode:_},...x.name&&{name:x.name}}}async function te(m){let $=j(m);d("emoji-click-sync",$),d("emoji-click",await $)}function ne(m){let{target:$}=m;if(!$.classList.contains("emoji"))return;Te(m);let x=$.id.substring(4);te(x)}function ve(m){i.currentSkinTone=m,i.skinTonePickerExpanded=!1,c("skintone-button"),d("skin-tone-change",{skinTone:m}),i.database.setPreferredSkinTone(m)}function N(m){let{target:{id:$}}=m,x=$&&$.match(/^skintone-(\d)/);if(!x)return;Te(m);let _=parseInt(x[1],10);ve(_)}function le(m){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(Te(m),hn(()=>c("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function g(m){if(!i.skinTonePickerExpanded)return;let $=async x=>{Te(m),i.activeSkinTone=x};switch(m.key){case"ArrowUp":return $(hs(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return $(hs(!1,i.activeSkinTone,i.skinTones));case"Home":return $(0);case"End":return $(i.skinTones.length-1);case"Enter":return Te(m),ve(i.activeSkinTone);case"Escape":return Te(m),i.skinTonePickerExpanded=!1,c("skintone-button")}}function A(m){if(i.skinTonePickerExpanded)switch(m.key){case" ":return Te(m),ve(i.activeSkinTone)}}async function D(m){let{relatedTarget:$}=m;(!$||$.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function P(m){i.rawSearchText=m.target.value}return{$set(m){pn(i,m)},$destroy(){n.abort()}}}function po(s){s instanceof Xe||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var ms,ds,ea,no,ho,ta,na,sa,ia,oa,uo,ra,io,aa,cs,ps,bs,ca,pa,ha,ua,fa,hn,ba,xa,us,Ye,Ea,Ta,Ca,_a,un,co,gs,pn,Na,Ua,Ha,Fa,go,Wa,Xe,mo,bo=vn(()=>{ls();ms=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),ds=ms.slice(1),ea=2,no=6,ho=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;ta={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},na=1e3,sa="🖐️",ia=8,oa=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],uo='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',ra=(s,t)=>s<t?-1:s>t?1:0,io=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${uo}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},aa=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};ps=()=>(cs||(cs=new Promise(s=>ho(()=>s(da())))),cs),bs=new Map,ca="️",pa="\uD83C",ha="‍",ua=127995,fa=57339;hn=requestAnimationFrame,ba=typeof ResizeObserver=="function";xa="😀";Ea=new WeakMap,Ta=new WeakMap,Ca=Symbol("un-keyed"),_a="replaceChildren"in Element.prototype;un=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);co=new WeakMap;gs=[],{assign:pn}=Object;Na="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Ua="en",Ha={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},Fa=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',go=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],Wa=`:host{--emoji-font-family:${uo}}`,Xe=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Fa+Wa,this.shadowRoot.appendChild(e),this._ctx={locale:Ua,dataSource:Na,skinToneEmoji:sa,customCategorySorting:ra,customEmoji:null,i18n:Ha,emojiVersion:null,...t};for(let n of go)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){po(this),this._cmp||(this._cmp=Oa(this.shadowRoot,this._ctx))}disconnectedCallback(){po(this),un(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new at({locale:t,dataSource:e}))}_dbFlush(){un(()=>this._dbCreate())}},mo={};for(let s of go)mo[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(Xe.prototype,mo);customElements.get("emoji-picker")||customElements.define("emoji-picker",Xe)});var vo={};Co(vo,{Database:()=>at,Picker:()=>Xe});var xo=vn(()=>{bo();ls()});var Mt=globalThis,Dt=Mt.ShadowRoot&&(Mt.ShadyCSS===void 0||Mt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,xn=Symbol(),Ts=new WeakMap,pt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==xn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Dt&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Ts.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Ts.set(e,t))}return t}toString(){return this.cssText}},Cs=s=>new pt(typeof s=="string"?s:s+"",void 0,xn),ze=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,o,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new pt(e,s,xn)},_s=(s,t)=>{if(Dt)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=Mt.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}},yn=Dt?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Cs(e)})(s):s;var{is:_o,defineProperty:So,getOwnPropertyDescriptor:Ao,getOwnPropertyNames:Po,getOwnPropertySymbols:Mo,getPrototypeOf:Do}=Object,Lt=globalThis,Ss=Lt.trustedTypes,Lo=Ss?Ss.emptyScript:"",jo=Lt.reactiveElementPolyfillSupport,ht=(s,t)=>s,wn={toAttribute(s,t){switch(t){case Boolean:s=s?Lo:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Ps=(s,t)=>!_o(s,t),As={attribute:!0,type:String,converter:wn,reflect:!1,useDefault:!1,hasChanged:Ps};Symbol.metadata??=Symbol("metadata"),Lt.litPropertyMetadata??=new WeakMap;var Se=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=As){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&So(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:i}=Ao(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let l=o?.call(this);i?.call(this,r),this.requestUpdate(t,l,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??As}static _$Ei(){if(this.hasOwnProperty(ht("elementProperties")))return;let t=Do(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ht("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ht("properties"))){let e=this.properties,n=[...Po(e),...Mo(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(yn(o))}else t!==void 0&&e.push(yn(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _s(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:wn).toAttribute(e,n.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=n.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:wn;this._$Em=o;let l=r.fromAttribute(e,i.type);this[o]=l??this._$Ej?.get(o)??l,this._$Em=null}}requestUpdate(t,e,n,o=!1,i){if(t!==void 0){let r=this.constructor;if(o===!1&&(i=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??Ps)(i,e)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:i},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,i]of n){let{wrapped:r}=i,l=this[o];r!==!0||this._$AL.has(o)||l===void 0||this.C(o,void 0,i,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Se.elementStyles=[],Se.shadowRootOptions={mode:"open"},Se[ht("elementProperties")]=new Map,Se[ht("finalized")]=new Map,jo?.({ReactiveElement:Se}),(Lt.reactiveElementVersions??=[]).push("2.1.2");var kn=globalThis,Ms=s=>s,jt=kn.trustedTypes,Ds=jt?jt.createPolicy("lit-html",{createHTML:s=>s}):void 0,En="$lit$",Ae=`lit$${Math.random().toFixed(9).slice(2)}$`,Tn="?"+Ae,Ro=`<${Tn}>`,Oe=document,ft=()=>Oe.createComment(""),gt=s=>s===null||typeof s!="object"&&typeof s!="function",Cn=Array.isArray,Bs=s=>Cn(s)||typeof s?.[Symbol.iterator]=="function",$n=`[ 	
\f\r]`,ut=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ls=/-->/g,js=/>/g,Ie=RegExp(`>|${$n}(?:([^\\s"'>=/]+)(${$n}*=${$n}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Rs=/'/g,zs=/"/g,Os=/^(?:script|style|textarea|title)$/i,_n=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),h=_n(1),se=_n(2),cl=_n(3),Pe=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),Is=new WeakMap,Be=Oe.createTreeWalker(Oe,129);function Ns(s,t){if(!Cn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ds!==void 0?Ds.createHTML(t):t}var Us=(s,t)=>{let e=s.length-1,n=[],o,i=t===2?"<svg>":t===3?"<math>":"",r=ut;for(let l=0;l<e;l++){let c=s[l],a,d,p=-1,f=0;for(;f<c.length&&(r.lastIndex=f,d=r.exec(c),d!==null);)f=r.lastIndex,r===ut?d[1]==="!--"?r=Ls:d[1]!==void 0?r=js:d[2]!==void 0?(Os.test(d[2])&&(o=RegExp("</"+d[2],"g")),r=Ie):d[3]!==void 0&&(r=Ie):r===Ie?d[0]===">"?(r=o??ut,p=-1):d[1]===void 0?p=-2:(p=r.lastIndex-d[2].length,a=d[1],r=d[3]===void 0?Ie:d[3]==='"'?zs:Rs):r===zs||r===Rs?r=Ie:r===Ls||r===js?r=ut:(r=Ie,o=void 0);let b=r===Ie&&s[l+1].startsWith("/>")?" ":"";i+=r===ut?c+Ro:p>=0?(n.push(a),c.slice(0,p)+En+c.slice(p)+Ae+b):c+Ae+(p===-2?l:b)}return[Ns(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},mt=class s{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let i=0,r=0,l=t.length-1,c=this.parts,[a,d]=Us(t,e);if(this.el=s.createElement(a,n),Be.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(o=Be.nextNode())!==null&&c.length<l;){if(o.nodeType===1){if(o.hasAttributes())for(let p of o.getAttributeNames())if(p.endsWith(En)){let f=d[r++],b=o.getAttribute(p).split(Ae),E=/([.?@])?(.*)/.exec(f);c.push({type:1,index:i,name:E[2],strings:b,ctor:E[1]==="."?zt:E[1]==="?"?It:E[1]==="@"?Bt:Ue}),o.removeAttribute(p)}else p.startsWith(Ae)&&(c.push({type:6,index:i}),o.removeAttribute(p));if(Os.test(o.tagName)){let p=o.textContent.split(Ae),f=p.length-1;if(f>0){o.textContent=jt?jt.emptyScript:"";for(let b=0;b<f;b++)o.append(p[b],ft()),Be.nextNode(),c.push({type:2,index:++i});o.append(p[f],ft())}}}else if(o.nodeType===8)if(o.data===Tn)c.push({type:2,index:i});else{let p=-1;for(;(p=o.data.indexOf(Ae,p+1))!==-1;)c.push({type:7,index:i}),p+=Ae.length-1}i++}}static createElement(t,e){let n=Oe.createElement("template");return n.innerHTML=t,n}};function Ne(s,t,e=s,n){if(t===Pe)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,i=gt(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=Ne(s,o._$AS(s,t.values),o,n)),t}var Rt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??Oe).importNode(e,!0);Be.currentNode=o;let i=Be.nextNode(),r=0,l=0,c=n[0];for(;c!==void 0;){if(r===c.index){let a;c.type===2?a=new Je(i,i.nextSibling,this,t):c.type===1?a=new c.ctor(i,c.name,c.strings,this,t):c.type===6&&(a=new Ot(i,this,t)),this._$AV.push(a),c=n[++l]}r!==c?.index&&(i=Be.nextNode(),r++)}return Be.currentNode=Oe,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},Je=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Ne(this,t,e),gt(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==Pe&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Bs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==w&&gt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Oe.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=mt.createElement(Ns(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new Rt(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=Is.get(t.strings);return e===void 0&&Is.set(t.strings,e=new mt(t)),e}k(t){Cn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let i of t)o===e.length?e.push(n=new s(this.O(ft()),this.O(ft()),this,this.options)):n=e[o],n._$AI(i),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=Ms(t).nextSibling;Ms(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ue=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,i){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=w}_$AI(t,e=this,n,o){let i=this.strings,r=!1;if(i===void 0)t=Ne(this,t,e,0),r=!gt(t)||t!==this._$AH&&t!==Pe,r&&(this._$AH=t);else{let l=t,c,a;for(t=i[0],c=0;c<i.length-1;c++)a=Ne(this,l[n+c],e,c),a===Pe&&(a=this._$AH[c]),r||=!gt(a)||a!==this._$AH[c],a===w?t=w:t!==w&&(t+=(a??"")+i[c+1]),this._$AH[c]=a}r&&!o&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},zt=class extends Ue{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}},It=class extends Ue{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}},Bt=class extends Ue{constructor(t,e,n,o,i){super(t,e,n,o,i),this.type=5}_$AI(t,e=this){if((t=Ne(this,t,e,0)??w)===Pe)return;let n=this._$AH,o=t===w&&n!==w||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==w&&(n===w||o);o&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Ot=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Ne(this,t)}},Hs={M:En,P:Ae,A:Tn,C:1,L:Us,R:Rt,D:Bs,V:Ne,I:Je,H:Ue,N:It,U:Bt,B:zt,F:Ot},zo=kn.litHtmlPolyfillSupport;zo?.(mt,Je),(kn.litHtmlVersions??=[]).push("3.3.3");var Fs=(s,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let i=e?.renderBefore??null;n._$litPart$=o=new Je(t.insertBefore(ft(),i),i,void 0,e??{})}return o._$AI(s),o};var Sn=globalThis,fe=class extends Se{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Fs(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Pe}};fe._$litElement$=!0,fe.finalized=!0,Sn.litElementHydrateSupport?.({LitElement:fe});var Io=Sn.litElementPolyfillSupport;Io?.({LitElement:fe});(Sn.litElementVersions??=[]).push("4.2.2");var Qe="mydashlight",kl=`/api/${Qe}/pair`,El=`/api/${Qe}/pair/poll`,Tl=`/${Qe}`,bt="pair";function Ws(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function An(s){return s.toUpperCase().replace(/[^A-Z0-9]/g,"")}function Ks(s){let t=new URLSearchParams(s);return t.has(bt)?An(t.get(bt)??""):null}function Bo(s){if(s<60)return"just now";let t=Math.round(s/60);return`${t} minute${t===1?"":"s"} ago`}var vt=class extends fe{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let n=await this.connection.sendMessagePromise({type:`${Qe}/pair/check`,code:e});n.found?(this.waiting=n,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(n){this.error=this.message(n),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${Qe}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let n=e?.code;return n==="unauthorized"?"Only a Home Assistant admin can pair a screen.":n==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":n==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return h`<form @submit=${o=>{o.preventDefault();let i=An(this.typed);i&&this.check(i)}}>
      <h2>Pair a screen</h2>
      <p>Type the code the screen is showing.</p>
      ${this.error?h`<p class="error" role="alert">${this.error}</p>`:w}
      <input
        aria-label="Code"
        autocomplete="off"
        autocapitalize="characters"
        spellcheck="false"
        placeholder="ABCD-1234"
        .value=${this.typed}
        @input=${o=>this.typed=o.target.value}
        ?disabled=${e}
      />
      <div class="actions">
        <button type="button" @click=${()=>this.close()}>Cancel</button>
        <button type="submit" class="dark" ?disabled=${e}>${e?"Checking…":"Next"}</button>
      </div>
    </form>`}confirm(){let e=this.waiting,n=this.step==="approving",o=e.home===!1;return h`<h2>Allow this screen?</h2>
      <p class="code">${Ws(e.code??"")}</p>
      ${o?h`<p class="warning" role="alert">
            <b>This code came from outside your home network.</b> Only allow it if you can see this code on a
            screen of your own right now. If someone sent you this code or link, press Cancel.
          </p>`:w}
      <p>
        A screen at ${e.address} asked ${Bo(e.age??0)}. Check the code matches the one on the screen. It will be
        signed in to Home Assistant as <b>${this.userName||"you"}</b>.
      </p>
      <p>To sign it out later, delete its entry under Refresh tokens on your Home Assistant profile’s Security tab.</p>
      <div class="actions">
        <button type="button" @click=${()=>this.close()} ?disabled=${n}>Cancel</button>
        <button type="button" class="dark" @click=${()=>void this.approve()} ?disabled=${n}>
          ${n?"Allowing…":o?"Allow anyway":"Allow"}
        </button>
      </div>`}render(){let e;return this.isAdmin?this.step==="done"?e=h`<h2>Screen paired</h2>
        <p>It will open the board in a few seconds.</p>
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Done</button></div>`:this.step==="confirm"||this.step==="approving"?e=this.confirm():e=this.enter():e=h`<h2>Pair a screen</h2>
        <p>Only a Home Assistant admin can pair a screen. Ask an admin to scan the code instead.</p>
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Close</button></div>`,h`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${e}</div>`}};vt.styles=ze`
    :host {
      position: fixed;
      inset: 0;
      z-index: 30;
      display: grid;
      place-items: center;
      padding: 16px;
      background: rgba(28, 30, 34, 0.45);
      font-family: Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif;
      color: #1c1e22;
    }
    .card {
      width: min(440px, 100%);
      padding: 24px;
      border-radius: 18px;
      background: #fff;
      box-shadow: 0 12px 40px rgba(28, 30, 34, 0.25);
    }
    h2 {
      margin: 0 0 8px;
      font-size: 21px;
      line-height: 28px;
    }
    p {
      margin: 0 0 16px;
      font-size: 15px;
      line-height: 22px;
      color: #3d434b;
    }
    .code {
      font-size: 30px;
      line-height: 38px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: #1c1e22;
      font-variant-numeric: tabular-nums;
    }
    input {
      width: 100%;
      box-sizing: border-box;
      min-height: 52px;
      padding: 0 14px;
      margin-bottom: 16px;
      border: 1px solid #cfccc4;
      border-radius: 10px;
      font: inherit;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .error {
      color: #b42318;
      font-weight: 600;
    }
    .warning {
      padding: 12px 14px;
      border-radius: 10px;
      background: #fdecea;
      color: #8a1c12;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    button {
      min-height: 44px;
      padding: 0 18px;
      border-radius: 10px;
      border: 1px solid #cfccc4;
      background: #fff;
      font: inherit;
      font-size: 15px;
      font-weight: 600;
      color: inherit;
      cursor: pointer;
    }
    button.dark {
      border-color: #1c1e22;
      background: #1c1e22;
      color: #fff;
    }
    button:disabled {
      opacity: 0.55;
      cursor: default;
    }
    button:focus-visible,
    input:focus-visible {
      outline: 3px solid #2d5fc4;
      outline-offset: 2px;
    }
  `,vt.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",vt);function M(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function He(s){let t=Math.floor(Math.round(s)/60)%24;return`${M(s)} ${t<12?"AM":"PM"}`}function Vs(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function yt(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function Gs(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Oo=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),No=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Uo=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Nt(s){return new Date(`${s}T12:00:00Z`)}function ye(s){let t=Nt(s);return`${Oo.format(t)}, ${Uo.format(t)}`}function oe(s){return No.format(Nt(s))}function we(s,t){return Math.round((Nt(t).getTime()-Nt(s).getTime())/864e5)}function xt(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return xt("UTC",t)}let n=o=>e.find(i=>i.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function Ut(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=xt(e,s),i=xt(e,t).date;return o.date===i?`at ${He(o.minutes)}`:`on ${oe(o.date)} at ${He(o.minutes)}`}var X=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},Fe="mydashlight",Ho=7,qs=3e4;function Pn(s){if(s instanceof X)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new X(String(t.code??"error"),t.message)}return typeof s=="number"?new X("connection_lost","Lost the connection to Home Assistant."):new X("error",String(s))}var Ht=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new X("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},qs),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new X("not_running","MyDashLight isn’t running right now."))},{type:`${Fe}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:Fe,service:"get_plan",service_data:{days:Ho},return_response:!0});this.emit(t.response)}catch(t){this.fail(Pn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Fe,service:t,service_data:e})}catch(n){throw Pn(n)}this.pushing||await this.refresh()}setRide(t,e,n,o){return this.call("set_ride",{event:t,side:e,driver:n,scope:o})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:Gs(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}watchChores(t){let e=!1,n=null,o=null,i=async()=>{try{let r=await this.conn.sendMessagePromise({type:"call_service",domain:Fe,service:"get_chores",service_data:{},return_response:!0});e||t(r.response??null)}catch{e||t(null)}};return(async()=>{try{let r=await this.conn.subscribeMessage(l=>{e||t(l.chores)},{type:`${Fe}/chores/subscribe`},{resubscribe:!0});e?r().catch(()=>{}):n=r}catch{if(e)return;i(),o=setInterval(()=>void i(),qs)}})(),()=>{e=!0,o&&clearInterval(o),n&&n().catch(()=>{})}}watchLunch(t){let e=!1,n=null;return(async()=>{try{let o=await this.conn.subscribeMessage(i=>{e||t(i.lunch)},{type:`${Fe}/lunch/subscribe`},{resubscribe:!0});e?o().catch(()=>{}):n=o}catch{e||t(null)}})(),()=>{e=!0,n&&n().catch(()=>{})}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Fe,service:t,service_data:e})}catch(n){throw Pn(n)}}};var Ys={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Xs=s=>(...t)=>({_$litDirective$:s,values:t}),Ft=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Fo}=Hs,Zs=s=>s;var Js=()=>document.createComment(""),et=(s,t,e)=>{let n=s._$AA.parentNode,o=t===void 0?s._$AB:t._$AA;if(e===void 0){let i=n.insertBefore(Js(),o),r=n.insertBefore(Js(),o);e=new Fo(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,l=r!==s;if(l){let c;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(c=s._$AU)!==r._$AU&&e._$AP(c)}if(i!==o||l){let c=e._$AA;for(;c!==i;){let a=Zs(c).nextSibling;Zs(n).insertBefore(c,o),c=a}}}return e},je=(s,t,e=s)=>(s._$AI(t,e),s),Wo={},Qs=(s,t=Wo)=>s._$AH=t,ei=s=>s._$AH,Wt=s=>{s._$AR(),s._$AA.remove()};var ti=(s,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(s[o],o);return n},Me=Xs(class extends Ft{constructor(s){if(super(s),s.type!==Ys.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],i=[],r=0;for(let l of s)o[r]=n?n(l,r):r,i[r]=e(l,r),r++;return{values:i,keys:o}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let o=ei(s),{values:i,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,i;let l=this.ut??=[],c=[],a,d,p=0,f=o.length-1,b=0,E=i.length-1;for(;p<=f&&b<=E;)if(o[p]===null)p++;else if(o[f]===null)f--;else if(l[p]===r[b])c[b]=je(o[p],i[b]),p++,b++;else if(l[f]===r[E])c[E]=je(o[f],i[E]),f--,E--;else if(l[p]===r[E])c[E]=je(o[p],i[E]),et(s,c[E+1],o[p]),p++,E--;else if(l[f]===r[b])c[b]=je(o[f],i[b]),et(s,o[p],o[f]),f--,b++;else if(a===void 0&&(a=ti(r,b,E),d=ti(l,p,f)),a.has(l[p]))if(a.has(l[f])){let v=d.get(r[b]),y=v!==void 0?o[v]:null;if(y===null){let T=et(s,o[p]);je(T,i[b]),c[b]=T}else c[b]=je(y,i[b]),et(s,o[p],y),o[v]=null;b++}else Wt(o[f]),f--;else Wt(o[p]),p++;for(;b<=E;){let v=et(s,c[E+1]);je(v,i[b]),c[b++]=v}for(;p<=f;){let v=o[p++];v!==null&&Wt(v)}return this.ut=r,Qs(s,c),Pe}});var Kt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function J(s){return Kt[(s%Kt.length+Kt.length)%Kt.length]}var Vt="#23272E",Mn="35,39,46";var Ko=3,Jt=36,Dn=12,Gt=8,ni=30,$e=16,wt=100,tt=60,jn=10,qt=30,Rn=10,Vo=150,Go=200,Zt=1.4;function pi(s,t){return s.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??Jt}var qo=26,hi=4;function zn(s,t){let e=Math.max(Vo,Go/Zt);return Math.ceil(tt+Math.max(0,s-1)*jn+qt+Math.max(0,t-1)*Rn+e*(s+Zt*t))}function ke(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function be(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function he(s){return new Map(ke(s).map((t,e)=>[t,J(e)]))}function re(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function ae(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function In(s,t){return t==="none"?"Not needed":be(s).includes(t)?ae(s,t):t}function Qt(s,t){return t.own?ae(s,t.own):re(s,t.kid)}var $t={color:Vt,rgb:Mn,ink:Vt};function ui(s,t){return t.own?$t:he(s).get(t.kid)??J(0)}function Yo(s,t){let e=ke(s);return t.along.map(n=>e.includes(n)?re(s,n):ae(s,n))}function en(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function Xo(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function Yt(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function Ln(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(Yt(t,n.from)),e.push(Yt(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(Yt(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Zo(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,l)=>r.s-l.s||l.en-r.en),e=[],n=[],o=-1/0,i=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(i(),o=-1/0);let l=n.findIndex(c=>c<=r.s);l<0?(l=n.length,n.push(r.en)):n[l]=r.en,r.col=l,e.push(r),o=Math.max(o,r.en)}return i(),t}function Jo(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return s[s.length-1].y}function Qo(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return s[s.length-1].t}function fi(s,t){return Jo(s.anchors,t)}function gi(s,t){return Qo(s.anchors,t)}function er(s,t){let e=ke(s),n=be(s),o=Math.max(t,zn(e.length,n.length)),r=(o-tt-Math.max(0,e.length-1)*jn-qt-Math.max(0,n.length-1)*Rn)/(e.length+Zt*n.length||1),l=Math.floor(r),c=Math.floor(r*Zt),a=new Map;for(let E of s.days)for(let v of E.events)for(let y of v.own?v.along:[v.kid]){let T=a.get(y)??[];T.some(u=>u.event_id===v.event_id&&u.calendar_id===v.calendar_id)||T.push(v),a.set(y,T)}let d=he(s),p=[],f=tt;e.forEach((E,v)=>{let y=a.get(E)??[],T=s.days.some(u=>u.events.some(S=>S.kid===E&&(S.sides.includes("drop")&&S.drop===""||S.sides.includes("pick")&&S.pick==="")));p.push({id:E,kind:"kid",x:f,w:l,name:re(s,E),dot:d.get(E).color,rgb:d.get(E).rgb,sub:`${T?"Needs a ride · ":""}${y.length} this week`,subWarn:T}),f+=l+(v<e.length-1?jn:0)});let b=f+qt/2;return f+=qt,n.forEach((E,v)=>{let y=0,T=0;for(let u of s.days){let S=u.drivers[E];S&&(y+=S.outings.length,T+=S.drive??0)}p.push({id:E,kind:"driver",x:f,w:c,name:ae(s,E),dot:Vt,rgb:Mn,sub:`${y} ${y===1?"trip":"trips"} this week · ${yt(T)} driving`,subWarn:!1}),f+=c+(v<n.length-1?Rn:0)}),{columns:p,sepX:b,width:o}}function tr(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function si(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${M(s.start)}`:e||!t?`${s.title} until ${M(s.end)}`:`${s.title} ${M(s.start)}–${M(s.end)}`}function Bn(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length+(s.unplaced?.length??0)}function On(s,t){let e=we(t,s);return e===0?"Today":e===1?"Tomorrow":""}function ie(s,t=0){return s==null||!Number.isFinite(s)?t:s}function ii(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),o=1,i=0;for(let r of s.split(/\s+/).filter(Boolean)){let l=r.length;for(i===0?i=l:i+1+l<=n?i+=1+l:(o++,i=l);i>n;)o++,i-=n}return o}var mi=25,nr=15,bi=3;function oi(s){return Math.max(0,Math.min(bi,Math.floor((s-mi)/nr)))}var sr=mi+2,ri=20;function ai(s){return/^(\d+:\d\d)\s+Home$/.exec(s.at(-1)??"")?.[1]??null}var Xt="🚗";function li(s,t){if(s===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,i,r,l=!1)=>({at:o,who:i,stays:l,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(s))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(s))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(s))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}return null}var di={muted:0,normal:1,pending:2,problem:3};function vi(s){let{drop:t,pick:e}=s,n=t?li(t.text,"drop"):null,o=e?li(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return s;let i=[t,e].reduce((c,a)=>a&&(di[a.tone]??1)>(di[c]??1)?a.tone:c,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${Xt} No rides yet`,tone:i},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let c=`${Xt} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${c} both ways`,tone:i},pick:null}:{drop:{text:`${c} ↓${n.at} ↑${o.at}`.trimEnd(),tone:i},pick:null}}let r=(c,a)=>c==="needed"?`${a} needed`:`${a}${c.at?`${c.at} `:" "}${c.who}${c.stays?" stays":""}${c.extra}`,l=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${Xt} ${l.join(" · ")}`,tone:i},pick:null}}function ci(s,t){let e=t-23,n=`${M(s.start)}–${M(s.end)}`+(s.arrive_by!=null?` · arrive ${M(s.arrive_by)}`:""),o=33+ii(n,e,6.6)*16,i=s.own?s.lines:vi(s.lines);for(let r of[i.drop,i.pick])r&&(o+=2+ii(r.text,e,7)*16);return o+4}function xi(s,t,e,n){let o=t==="compact",{columns:i,sepX:r,width:l}=er(s,e),c=new Map(i.map(u=>[u.id,u])),a=ke(s),d=be(s),p=[...a,...d],f=he(s),b=Xo(s),E=u=>re(s,u),v=u=>ae(s,u),y={mode:t,width:l,height:0,columns:i,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},T=0;return s.days.forEach((u,S)=>{let z=S*1440,V=new Map(u.events.map(g=>[g.id,g])),Q=g=>g&&V.has(g)?{day:u.date,event:g}:null,G=Bn(u),F=u.events.length,ue=On(u.date,n.date),Z=ar(s,u,f,l);y.dayHeads.push({date:u.date,y:T,label:ye(u.date),tag:ue,sub:(F?`${F} ${F===1?"activity":"activities"}`:"Nothing scheduled")+(G?` · ${G} to sort out`:""),warn:G>0,h:Jt+(Z?Z.h+hi+2:0),allDay:Z?.chips??[]}),y.anchors.push({t:z,y:T});let dt=y.dayHeads[y.dayHeads.length-1],ge=T+dt.h+Dn,Le=d.flatMap(g=>u.drivers[g]?.outings??[]);if(!F&&!Le.length){y.empties.push({key:u.date,y:ge,text:"Nothing planned"}),T=ge+40,y.anchors.push({t:z+1439,y:T});return}let me=(g,A,D,P,m,$,x,_=g.kid)=>{let I=!!g.own&&_===g.own,H=!!g.own&&_!==g.own,U=I?$t:f.get(_)??J(0),de=I?v(_):E(_),ce=H?{drop:{text:`With ${v(g.own)}`,tone:g.attending===!1?"muted":"normal"},pick:null}:x&&!g.own?vi(g.lines):g.lines,C=I?Yo(s,g):[],Y=(g.takes!=null?`${g.takes} min, any time ${M(g.start)}–${M(g.end)}`:`${M(g.start)}–${M(g.end)}`+(g.arrive_by!=null?` · arrive ${M(g.arrive_by)}`:""))+(C.length?` · with ${en(C)}`:"");return{key:`${u.date}|card|${g.id}`+(g.own?`|${_}`:""),x:A,y:D,w:P,h:m,target:{day:u.date,event:g.id},event:g,color:U,kidName:de,clash:$,stayed:!g.own&&g.stay&&d.includes(g.drop),skipped:g.attending===!1,title:tr(g.title,de),time:Y,drop:ce.drop,pick:ce.pick,showDrop:!!ce.drop&&(x||m>=56),showPick:!!ce.pick&&(x||m>=74),wrap:x,aria:`${de}, ${g.title} ${g.takes!=null?`any time from ${M(g.start)} to ${M(g.end)}`:`${M(g.start)} to ${M(g.end)}`}. `+(g.attending===!1&&!ce.drop?"Not attending. ":"")+[ce.drop,ce.pick].filter(k=>!!k).map(k=>k.text).join(". ")}},_e=g=>{let A=u.rides[g];return A?(u.drivers[A.driver]?.segments??[]).filter(P=>P.type!=="home"&&P.kids.includes(A.kid)&&ie(P.start)>=ie(A.start)&&ie(P.end)<=ie(A.end)):[]},Ze=g=>{let A=u.rides[g];if(!A)return null;let D=A.serves.find(P=>V.get(P)?.kid===A.kid);return Q(D??A.serves[0])},Re=(g,A)=>{if(A.event)return A;let D=u.events.find(P=>P.own&&P.own!==g&&P.along.includes(g)&&P.title===A.title);return D?{...A,title:`${A.title} with ${v(D.own)}`}:A},L=g=>{if(g.takes==null)return[g.start,g.end];let A=g.planned??g.start;return[A,A+g.takes]},ee=new Map;for(let g of u.issues)g.level!=="problem"||!g.event||(g.kind==="late"&&ee.set(g.event,`${Math.round(ie(g.minutes))} min late`),g.kind==="waiting"&&ee.set(`${g.event}|pick`,`Waits ${Math.round(ie(g.minutes))} min`));if(!o){let g=1/0,A=-1/0;for(let x of u.events)x.start<=0&&x.end>=1440||(x.start>0?g=Math.min(g,x.start-20,x.arrive_by!=null?x.arrive_by-10:1/0):g=Math.min(g,x.end-30),x.end<1440?A=Math.max(A,x.end+20):A=Math.max(A,x.start+30));for(let x of Le)x.start!=null&&(g=Math.min(g,x.start)),x.end!=null&&(A=Math.max(A,x.end));u.date===n.date&&Number.isFinite(g)&&n.minutes>g-60&&n.minutes<A&&(g=Math.min(g,n.minutes-15));let D=Number.isFinite(g)?Math.floor((g-5)/30)*30:900,P=Number.isFinite(A)?Math.ceil((A+5)/30)*30:960,m=x=>Math.round(ge+(Math.max(D,Math.min(P,x))-D)*Ko);y.anchors.push({t:z+D,y:m(D)},{t:z+P,y:m(P)});for(let x of a){let _=c.get(x),I=f.get(x),H=(u.kids[x]?.items??[]).filter(k=>k.start!=null&&k.end!=null).map(k=>({item:k,s:ie(k.start),en:ie(k.end)})),U=[];for(let k of Zo(H)){let R=_.w/k.cols,B=Math.round(_.x+k.col*R),W=Math.round(R-(k.cols>1?4:0)),q=m(k.s),K=k.item;if(K.type==="act"){let pe=V.get(K.event??"");if(!pe)continue;let At=Math.max(30,m(k.en)-q),Pt=me(pe,B,q,W,At,K.clash,!1,x);if(Pt.layer=wt,y.cards.push(Pt),pe.arrive_by!=null&&pe.start-pe.arrive_by>=5){let bn=m(pe.arrive_by),Es={key:`${u.date}|prep|${pe.id}`,x:B,y:bn,w:W,h:q-bn+$e,color:I,label:`Arrive by ${M(pe.arrive_by)}`,layer:wt-1};y.preps.push(Es),U.push({s:pe.arrive_by,en:k.en,top:bn,bottom:q+At,x:B,w:W,prep:Es,card:Pt})}else U.push({s:k.s,en:k.en,top:q,bottom:q+At,x:B,w:W,card:Pt});let $s=ee.get(pe.id);$s&&y.marks.push({key:`${u.date}|late|${pe.id}`,x:B+W-4,y:q+4,text:$s,right:!0});let ks=ee.get(`${pe.id}|pick`);ks&&y.marks.push({key:`${u.date}|wait|${pe.id}`,x:B+4,y:q+At+2,text:ks,right:!1});continue}let O=u.rides[K.ride??-1];if(!O)continue;let xe=Math.max(22,m(k.en)-q),ct=Ln(_e(O.index),b),xs=v(O.driver),ys={key:`${u.date}|ride|${O.index}`,x:B,y:q,w:W,h:xe,target:Ze(O.index),l1:`${O.own?"In":"Along in"} ${xs}’s car`,l2:ct.join(" → "),show2:oi(xe)>0,lines2:oi(xe),dashed:!O.own,clash:K.clash,aria:`${E(x)} ${O.own?"in":"riding along in"} ${xs}’s car, ${M(ie(O.start))} to ${M(ie(O.end))}: ${ct.join(" to ")}`};y.rides.push(ys);let ws=c.get(O.driver),mn=null;ws&&(mn={key:`${u.date}|band|${O.index}`,x:B+W,y:q,w:Math.max(0,ws.x+8-(B+W)),h:xe,color:I},y.bands.push(mn)),U.push({s:k.s,en:k.en,top:q,bottom:q+xe,x:B,w:W,ride:ys,band:mn})}let de=k=>k.ride?.layer??(k.prep?wt-1:wt),ce=(k,R,B,W)=>{B>$e&&y.links.push({key:`${k.key}|link`,x:k.x,y:R,w:k.w,h:B,color:I,layer:W})},C=(k,R)=>{if(!(R.x<k.x||R.x+R.w>k.x+k.w)&&(k.x=R.x,k.w=R.w,k.ride.x=R.x,k.ride.w=R.w,k.band)){let B=k.band.x+k.band.w;k.band.x=R.x+R.w,k.band.w=Math.max(0,B-k.band.x)}},Y=new Set;for(let k of[...U].sort((R,B)=>B.s-R.s)){let R=k.ride;if(!R)continue;let B=U.filter(K=>K!==k&&K.s>=k.en&&K.s-k.en<=ni&&K.top>=k.bottom).sort((K,O)=>K.s-O.s||K.top-O.top)[0];if(!B)continue;Y.add(k),C(k,B);let W=de(B),q=B.top-k.bottom;ce(R,k.bottom,q+$e,W-1),R.layer=W-(q>0?2:1),R.h+=$e,R.tuckBottom=$e}for(let k of[...U].sort((R,B)=>R.s-B.s)){let R=k.ride;if(!R||Y.has(k))continue;let B=U.filter(K=>K!==k&&K.en<=k.s&&k.s-K.en<=ni&&K.bottom<=k.top&&(K.card||K.ride?.layer!=null)).sort((K,O)=>O.en-K.en||O.bottom-K.bottom)[0];if(!B)continue;C(k,B);let W=B.ride?.layer??wt,q=k.top-B.bottom;ce(R,B.bottom-$e,q+$e,W-1),R.layer=W-(q>0?2:1),R.y-=$e,R.h+=$e,R.tuckTop=$e}}for(let x of d){let _=c.get(x),I=u.drivers[x];if(!I)continue;let H=[],U=null;for(let C of I.segments)if(!(C.start==null||C.end==null)){if(C.type==="home"){U=null;continue}if(C.type==="stay"){U=null,H.push({type:"stay",g:C,s:C.start,en:C.end});continue}U&&U.en===C.start?(U.en=C.end,U.legs.push(C)):(U={type:"trip",s:C.start,en:C.end,legs:[C]},H.push(U))}let de=new Set,ce=(C,Y,k,R)=>{de.add(C.id);let B=m(Y),W=me(C,_.x+8,B,_.w-16,Math.max(30,m(k)-B),!1,!1,x);R&&W.drop?.tone==="normal"&&(W.drop=null,W.showDrop=!1),y.cards.push(W)};for(let C of H){let Y=m(C.s),k=Math.max(24,m(C.en)-Y);if(C.type==="stay"){let O=V.get(C.g.event??C.g.serves??"");if(O?.own===x){ce(O,C.s,C.en,!0);continue}let xe=O?f.get(O.kid)??J(0):J(0),ct=C.g.kids.map(E);y.stays.push({key:`${u.date}|stay|${x}|${C.s}`,x:_.x+8,y:Y,w:_.w-16,h:k,target:Q(O?.id),color:xe,l1:O?`At ${O.title} with ${E(O.kid)}`:"Staying",l2:`until ${M(C.en)}`+(ct.length?` · ${ct.join(" and ")} too`:"")});continue}let R=C.legs[0],B=C.legs[C.legs.length-1],W=[];for(let O of C.legs)for(let xe of O.kids)W.includes(xe)||W.push(xe);let q=B.type==="drive"&&B.to==="home",K=Ln(C.legs,b);y.trips.push({key:`${u.date}|trip|${x}|${C.s}`,x:_.x+8,y:Y,w:_.w-16,h:k,target:Q(C.legs.find(O=>O.serves)?.serves),l1:R.type==="drive"&&R.from==="home"?`Leave ${M(C.s)}`:`From ${Yt(b,R.from??R.place)} ${M(C.s)}`,l2:K.join(" → "),show2:k>=36,l3:q?`Home ${M(C.en)}`:"",show3:q&&k>=62,stops:null,kids:W.map(O=>(f.get(O)??J(0)).color),bad:C.legs.some(O=>O.overlaps_busy),aria:`${v(x)} drives ${K.join(" to ")}, ${M(C.s)} to ${M(C.en)}`})}for(let C of I.segments)if(!(!C.overlaps_busy||C.start==null||C.end==null))for(let Y of I.busy){let k=Math.max(C.start,Y.start),R=Math.min(C.end,Y.end);R<=k||y.overlaps.push({key:`${u.date}|overlap|${x}|${k}`,x:_.x+6,y:m(k)-2,w:_.w-12,h:Math.max(8,m(R)-m(k)+4)})}for(let C of u.events)if(C.own===x&&(de.has(C.id)||ce(C,...L(C),!1),C.takes!=null&&C.attending!==!1)){let Y=m(C.start);y.windows.push({key:`${u.date}|window|${C.id}`,x:_.x+4,y:Y,w:_.w-8,h:Math.max(24,m(C.end)-Y),label:`${C.title} · any time ${M(C.start)}–${M(C.end)}`})}for(let C of I.busy){if(C.event||C.end<=D||C.start>=P)continue;let Y=Re(x,C),k=m(Y.start),R=m(Y.end);y.busy.push({key:`${u.date}|busy|${x}|${Y.start}`,x:_.x+1,y:k,w:_.w-2,h:R-k,labelY:8,label:si(Y,!1)})}}let $=-1/0;for(let x=D;x<=P;x+=30)y.grid.push({key:`${u.date}|grid|${x}`,y:m(x),strong:x%60===0}),x%60===0&&m(x)-$>=22&&(y.hours.push({key:`${u.date}|hour|${x}`,y:m(x)-8,label:Vs(x)}),$=m(x));u.date===n.date&&n.minutes>D&&n.minutes<P&&(y.now={y:m(n.minutes),label:`Now ${M(n.minutes)}`}),T=m(P)+Dn;return}let j=[];for(let g of a){let A=c.get(g);for(let D of u.kids[g]?.items??[])if(D.start!=null){if(D.type==="act"){let P=V.get(D.event??"");if(!P)continue;j.push({col:g,s:D.start,h:ci(P,A.w),kind:"act",item:D})}else if(!u.rides[D.ride??-1]?.own){let P=u.rides[D.ride??-1],m=P?u.drivers[P.driver]?.outings.find($=>$.start!=null&&$.start<=ie(P.start)&&ie(P.start)<=ie($.end,$.start)):void 0;j.push({col:g,s:m?.start??D.start,h:sr,kind:"along",item:D})}}}for(let g of d){let A=u.drivers[g];if(!A)continue;for(let P of A.busy)P.event||j.push({col:g,s:P.start,h:32,kind:"busy",busy:Re(g,P)});let D=c.get(g).w;for(let P of u.events)P.own!==g||P.attending!==!1&&(P.takes==null||P.planned!=null)||j.push({col:g,s:L(P)[0],h:ci(P,D),kind:"own",event:P});for(let P of A.outings){if(P.start==null)continue;let m=P.lines.length-(ai(P.lines)?1:0);j.push({col:g,s:P.start,h:30+m*16+(P.warn?16:0),kind:"out",out:P})}}j.sort((g,A)=>g.s-A.s||p.indexOf(g.col)-p.indexOf(A.col));let te=new Map,ne=[],ve=new Map,N=ge-ri;for(let g=0;g<j.length;){let A=g,D=N+ri;for(;A<j.length&&j[A].s===j[g].s;A++){let m=te.get(j[A].col);m!=null&&(D=Math.max(D,m+Gt))}let P=new Set;for(let m=g;m<A;m++){let $=j[m],x=P.has($.col)?te.get($.col)+Gt:D;P.add($.col),te.set($.col,x+$.h)}ve.set(j[g].s,D),j[g].s>0&&y.hours.push({key:`${u.date}|hour|${j[g].s}`,y:D+2,label:He(j[g].s)}),N=D,g=A}te.clear(),j.forEach((g,A)=>{let D=te.get(g.col),P=Math.max(D!=null?D+Gt:ge,ve.get(g.s));te.set(g.col,P+g.h);let m=g.kind==="busy"?g.busy.end:g.kind==="act"?V.get(g.item.event??"")?.end??null:g.kind==="own"?L(g.event)[1]:null;ne.push({col:g.col,s:g.s,end:m,y:P,h:g.h,box:null}),y.anchors.push({t:z+g.s,y:P});let $=c.get(g.col);if(g.kind==="busy"){let x={key:`${u.date}|busy|${g.col}|${A}`,x:$.x+1,y:P,w:$.w-2,h:g.h,labelY:8,label:si(g.busy,!0)};y.busy.push(x),ne[ne.length-1].box=x}else if(g.kind==="out"){let x=g.out,_=ai(x.lines),I=_?x.lines.slice(0,-1):x.lines;y.trips.push({key:`${u.date}|trip|${g.col}|${A}`,x:$.x+8,y:P,w:$.w-16,h:g.h,target:Q(x.target),l1:_?`${x.lead} · home ${_}`:x.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...I.map(H=>({text:H,warn:!1})),...x.warn?[{text:x.warn,warn:!0}]:[]],kids:x.kids.map(H=>(f.get(H)??J(0)).color),bad:!!x.warn,aria:`${v(g.col)}: ${x.lead}. ${x.lines.join(". ")}${x.warn?`. ${x.warn}`:""}`})}else if(g.kind==="own"){let x=me(g.event,$.x+8,P,$.w-16,g.h,!1,!0,g.col);y.cards.push(x),ne[ne.length-1].box=x}else if(g.kind==="act"){let x=V.get(g.item.event??""),_=me(x,$.x,P,$.w,g.h,g.item.clash,!0,g.col);y.cards.push(_),ne[ne.length-1].box=_}else{let x=u.rides[g.item.ride??-1],_=Ln(_e(x.index),b),I=v(x.driver);y.rides.push({key:`${u.date}|ride|${x.index}`,x:$.x,y:P,w:$.w,h:g.h,target:Ze(x.index),l1:`${Xt} with ${I}`,l2:_.join(" → "),show2:!1,lines2:bi,dashed:!0,clash:g.item.clash,aria:`${E(g.col)} riding along with ${I}, ${M(ie(x.start))} to ${M(ie(x.end))}: ${_.join(" to ")}`})}});let le=ge;for(let g of te.values())le=Math.max(le,g);for(let g of ne){if(!g.box||g.end==null)continue;let A=g.y+g.h;for(let D of ne)D.col!==g.col&&D.s>=g.s&&D.s<g.end&&(A=Math.max(A,D.y+D.h));g.end>=1440&&(A=le);for(let D of ne)D.col===g.col&&D.y>g.y&&(A=Math.min(A,D.y-Gt));A=Math.min(A,le),A>g.y+g.h&&(g.box.h=A-g.y)}T=le+Dn+6,y.anchors.push({t:z+1439,y:T})}),y.height=T,y}var ir=["","¼","½","¾"];function We(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return yt(n);let o=Math.round(n*4),i=Math.floor(o/4),r=ir[o%4];return`${i||!r?i:""}${r} min`})}function yi(s){let t=e=>e?{...e,text:We(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(We),warn:i.warn==null?i.warn:We(i.warn)}))}])),issues:e.issues.map(n=>({...n,title:We(n.title),body:We(n.body),note:n.note==null?n.note:We(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:We(o.note)}))}:{}}))}))}}var or=2,rr=48;function wi(s,t,e=rr){let n=[],o=new Set(be(s)),i=ke(s).map(f=>re(s,f)),r=i.length>1?i.slice(0,2):[i[0]??"Ava","Ben"],l=0,c=0,a=0,d=0,p=t.minutes+e*60;for(let f of s.days){let b=we(t.date,f.date),E=b===0?"":`${oe(f.date)} · `,v=new Map(f.events.map(u=>[u.id,u])),y=u=>u&&v.has(u)?{day:f.date,event:u}:null,T=(u,S)=>b*1440+(u??v.get(S??"")?.start??0)<p;for(let u of f.issues)if(u.level==="problem"){if(!T(u.at,u.event)){a++,u.kind==="unassigned"&&d++;continue}l++,u.kind==="unassigned"&&c++,n.push({key:`${f.date}|${u.key}`,tone:u.kind==="unassigned"?"unassigned":"problem",title:E+u.title,body:u.body,target:y(u.event),suggestions:(u.suggestions??[]).map(S=>({id:S.id,label:S.label,note:S.note}))})}if(f.clashes.forEach((u,S)=>{if(!T(u.a.start,u.a.event)){a++;return}l++;let z=v.get(u.a.event??""),V=re(s,u.kid),Q=(F,ue)=>{let Z=y(ue);return Z?{text:F,target:Z}:F},G=[];if(u.b.type==="act"){let F=v.get(u.b.event??"");z&&F&&(G=[Q(z.title,z.id),` ${M(z.start)}–${M(z.end)} and `,Q(F.title,F.id),` ${M(F.start)}–${M(F.end)} overlap.`])}else{let F=f.rides[u.b.ride??-1];z&&F&&(G=[`${V} is in `,Q(`${ae(s,F.driver)}’s car`,F.serves[0]),` ${M(ie(u.b.start))}–${M(ie(u.b.end))}, during `,Q(z.title,z.id),"."])}n.push({key:`${f.date}|clash|${S}`,tone:"problem",title:`${E}${V} is double-booked`,body:G.map(F=>typeof F=="string"?F:F.text).join(""),parts:G,target:null,suggestions:[]})}),b>=0&&b<or)for(let u of f.issues)u.level!=="heads_up"||!T(u.at,u.event)||n.push({key:`${f.date}|${u.key}`,tone:"heads_up",title:E+u.title,body:u.body,target:y(u.event),suggestions:[]});for(let u of f.unplaced??[]){if(!T(u.at)){a++;continue}l++;let S=u.people.map(z=>o.has(z)?ae(s,z):re(s,z));n.push({key:`${f.date}|unplaced|${u.id}`,tone:"problem",title:`${E}${M(u.at)} ${u.title}: ${$i(u).toLowerCase()}`,body:u.reason==="unknown"&&u.word?`“${u.word}” isn’t anyone in the family, so this is only in ${en(S)}’s lane. If it’s a misspelt name, fix the title in Google Calendar.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Start the title in Google Calendar with who it’s for, such as “${r[0]} Piano”, or “${r.join(" & ")} Piano” for both.`,target:null,suggestions:[]})}for(let u of f.events)!u.problems.length||!T(u.start)||n.push({key:`${f.date}|notes|${u.id}`,tone:"heads_up",title:`${E}Check the notes on ${Qt(s,u)}’s ${u.title}`,body:`These lines couldn’t be read: ${u.problems.join("; ")}`,target:y(u.id),suggestions:[]})}return{items:n,problems:l,unassigned:c,later:a,laterUnassigned:d}}function $i(s){return s.reason==="unknown"&&s.word?`Who is “${s.word}”?`:"Who is this for?"}function ar(s,t,e,n){let o=new Set(be(s)),i=d=>{let p=d[0];return p==null?null:o.has(p)?$t:e.get(p)??null},r=[...(t.all_day??[]).map(d=>({key:`${t.date}|allday|${d.id}`,title:d.title,note:d.days>1?`Day ${d.day_number} of ${d.days}`:"",color:i(d.people),cancelled:d.cancelled,warn:!1})),...(t.unplaced??[]).map(d=>({key:`${t.date}|unplaced|${d.id}`,title:`${M(d.at)} ${d.title}`,note:$i(d),color:null,cancelled:!1,warn:!0}))];if(!r.length)return null;let l=Math.max(120,n-tt),c=1,a=0;for(let d of r){let p=Math.min(l,30+7*(d.title.length+(d.note?d.note.length+2:0)));a&&a+p>l&&(c++,a=0),a+=p}return{key:`${t.date}|allday`,h:c*qo+(c-1)*hi,chips:r}}function ki(s,t){let e=he(s),n=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=we(t.date,i.date);if(!(r<0))for(let l of be(s))for(let c of i.drivers[l]?.outings??[]){if(c.start==null)continue;let a=r*1440+c.start;if(r*1440+ie(c.end,c.start)<=t.minutes)continue;let p=a-t.minutes,f={driver:l,name:ae(s,l),date:i.date,ahead:r,start:c.start,inMinutes:p,ongoing:p<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(b=>e.get(b)??J(0)),warn:c.warn,target:c.target&&i.events.some(b=>b.id===c.target)?{day:i.date,event:c.target}:null};(!n||o(f)<o(n)||o(f)===o(n)&&f.inMinutes<n.inMinutes)&&(n=f)}}return n}function nt(s){return s.state==="done"||s.state==="late"}var lr=780;function dr(s,t,e){return s.state==="open"&&!!s.for_day&&s.due===t&&e<lr}function Ei(s,t){return s.chores.map(e=>dr(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function Ti(s){return s.state==="open"||s.state==="overdue"}function Hn(s,t,e){if(nt(s)){let n=s.done_at?cr(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${Nn(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${Nn(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let o=we(t,s.due);return`By ${o===1?"tomorrow":o<7?oe(s.due):Un(s.due)}`}if(s.for_day&&s.due===t)return`Tonight · for ${Nn(s.for_day,t)}`;if(s.due&&s.due>t){let n=we(t,s.due);return n===1?"By tomorrow":`By ${n<7?oe(s.due):Un(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function Nn(s,t){let e=we(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?oe(s):Un(s)}function Un(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function cr(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let i=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return i===t?r:`${oe(i)} ${r}`}function Ci(s,t,e=1440){let n=Ei(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=n.filter(d=>d.kid===o.id),l=new Map;for(let d of r){if(d.state!=="upcoming")continue;let p=d.shows_from??d.due??s.today;l.set(p,[...l.get(p)??[],d])}let c=r.filter(d=>d.state==="overdue"),a=r.filter(d=>d.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??J(i),overdue:c,now:a,done:r.filter(nt),later:[...l.entries()].sort(([d],[p])=>d.localeCompare(p)).map(([d,p])=>({date:d,chores:p})),left:c.length+a.length}})}function _i(s,t=1440){return Ei(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function Fn(s){return!s.chores.length&&!s.templates.length}var Ke=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Wn(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,i]=n.split("-").map(r=>Ke.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function Kn(s){let t=[...new Set(s)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${Ke[n[0]]}-${Ke[n.at(-1)]}`]:n.map(o=>Ke[o])).join(", ")}var Ve="none";function tn(s){return s==="daily"||s==="school"?"":"Any"}function Si(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function Ai(s){let t=s.days??tn(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function Vn(s){return s.title.trim()?s.who.length?s.days===Ve?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function Pi(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function Gn(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function qn(s,t,e=1,n=!1,o=!1){if(s==="school"){let d=t.trim().replace(/-/g,"–"),p=o?d?`${d} Bring lunch days`:"Bring lunch days":d?`${d} school days`:"Every school day";return n?`${p}, the night before`:p}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,l=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(l))return e>1?`Every day, every ${e} weeks`:"Every day";if(!l||l.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${l.replace(/-/g,"–")} ${r}`;let a=`${l.split(",").map(d=>{let p=d.trim();return p.toLowerCase()==="last"?"the last day":/^\d+$/.test(p)?`the ${Gn(Number(p))}`:`the ${p}`}).join(" and ")} ${r}`;return a[0].toUpperCase()+a.slice(1)}function Yn(s,t,e=!1){let n=s.map(i=>t.find(r=>r.id===i)?.name??i);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function Xn(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function nn(s,t){return`${s}|${t}`}function st(s,t){let[e,n,o]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function sn(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function Mi(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function Di(s,t){return sn(t)<5&&!Mi(s,t)}function kt(s,t,e=new Map){if(!Di(s,t))return null;let n=nn(s.id,t);if(e.has(n)){let i=e.get(n);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[t];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function it(s,t){return Di(s,t)?s.menus?.[t]??null:null}var pr="From the school's menu feed.";function hr(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==pr);return t.length?t.join(`
`):null}function Ee(s){return s.slice(0,7)}function on(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function Zn(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function Li(s){let t=[];for(let e=Ee(s.first);e<=Ee(s.last);e=Zn(e))t.push(e);return t}function ji(s,t,e,n=new Map){let o=`${e}-01`,i=st(o,-sn(o)),r=[];for(;Ee(i)<=e;){let l=[];for(let c=0;c<5;c++){let a=st(i,c),d=Ee(a)!==e,p=d?null:Mi(t,a),f=d?null:kt(t,a,n);l.push({date:a,day:Number(a.slice(8)),outside:d,off:p?p.title:null,lunch:f?.lunch??null,picked:f?.picked??!1,menu:d?null:it(t,a)?.dish??null,sides:d?null:hr(it(t,a)?.details??""),past:a<s.today,today:a===s.today})}l.some(c=>!c.outside)&&r.push(l),i=st(i,7)}return r}function Ri(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function zi(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function Ii(s,t,e,n=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=st(t,i),l=kt(s,r,n);if(!l)continue;let c=we(t,r);return{lunch:l.lunch,when:c===0?"today":c===1?"tomorrow":oe(r),date:r,menu:it(s,r)?.dish??null}}return null}var ur={timeline:"timeline",full:"timeline",compact:"compact"};function Jn(s){let t=new URLSearchParams(s),e={},n=ur[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),e}var Bi=ze`
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
    padding: 20px 28px 24px;
    gap: 16px;
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
    gap: 16px;
  }
  .narrow .col {
    gap: 10px;
  }

  header {
    flex: none;
    display: flex;
    align-items: center;
    gap: 24px;
    min-height: 64px;
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
    font-size: 52px;
    line-height: 52px;
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
    max-width: 560px;
    margin-right: auto;
    padding: 12px 18px 13px;
    border-radius: 18px;
    border: 0;
    background: linear-gradient(160deg, var(--night-2), var(--night));
    color: #fff;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 4px;
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
  .next-main {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
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

  .week {
    flex: none;
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 10px;
  }
  .narrow .week {
    gap: 6px;
  }
  .day-tile {
    position: relative;
    min-height: 68px;
    padding: 7px 6px 8px;
    border-radius: 14px;
    border: 1px solid var(--line);
    background: var(--surface);
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }
  .day-tile:active {
    transform: scale(0.97);
  }
  .day-tile.in-view:not(.today) {
    border-color: var(--ink-2);
    box-shadow: 0 0 0 1px var(--ink-2), var(--shadow);
  }
  .day-tile.today {
    background: linear-gradient(160deg, var(--night-2), var(--night));
    border-color: var(--night);
    color: #fff;
  }
  .dt-wd {
    font-size: 12px;
    line-height: 16px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .today .dt-wd {
    color: #f5a524;
  }
  .dt-num {
    font-size: 24px;
    line-height: 28px;
    font-weight: 800;
  }
  .dt-dots {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 4px;
    min-height: 14px;
  }
  .dt-dot {
    width: 9px;
    height: 9px;
    border-radius: 5px;
  }
  .today .dt-dot {
    box-shadow: 0 0 0 1.5px var(--night);
  }
  .dt-free,
  .dt-more {
    font-size: 11px;
    line-height: 14px;
    font-weight: 600;
    color: var(--faint);
  }
  .today .dt-free,
  .today .dt-more {
    color: #b7bdc7;
  }
  .dt-badge {
    position: absolute;
    top: -6px;
    right: -4px;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 11px;
    background: var(--bad);
    color: #fff;
    font-size: 12.5px;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 0 2px var(--bg);
  }
  .phone .day-tile {
    min-height: 58px;
    padding: 5px 2px 6px;
    border-radius: 11px;
  }
  .phone .dt-wd {
    font-size: 10px;
    line-height: 13px;
    letter-spacing: 0.02em;
  }
  .phone .dt-num {
    font-size: 18px;
    line-height: 22px;
  }
  .phone .dt-dot {
    width: 6px;
    height: 6px;
  }
  .phone .dt-dots {
    gap: 2px;
  }
  .phone .dt-free {
    display: none;
  }
  .phone .dt-badge {
    top: -5px;
    right: -3px;
    min-width: 17px;
    height: 17px;
    padding: 0 4px;
    font-size: 10.5px;
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

  .banner {
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
    height: 72px;
    background: var(--bg);
  }
  .col-head {
    position: absolute;
    top: 0;
    height: 66px;
    padding: 4px 8px 6px;
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
    height: 4px;
    border-radius: 2px;
    background: var(--c);
  }
  .col-head.driver::after {
    content: "";
    position: absolute;
    left: 6px;
    right: 6px;
    bottom: 0;
    height: 4px;
    border-radius: 2px;
    background: repeating-linear-gradient(90deg, var(--dark) 0 10px, transparent 10px 16px);
    opacity: 0.55;
  }
  .ch-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .col-head .name {
    font-size: 18px;
    line-height: 23px;
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
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
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
    top: 72px;
    z-index: 5;
    margin-bottom: -36px;
    pointer-events: none;
    border-radius: 12px 0 0 0;
    overflow: hidden;
  }
  .day-head {
    position: absolute;
    left: 0;
    z-index: 1;
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
  .allday {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 4px;
    padding-bottom: 4px;
  }
  .ad-chip {
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
  .ad-chip.plain {
    border-color: var(--border);
    border-left-color: var(--faint);
    background: var(--surface);
  }
  .ad-chip.warn {
    border: 1px dashed var(--warn-ink);
    border-left: 4px solid var(--warn-ink);
    background: #fff6e0;
  }
  .ad-chip.warn .ad-note {
    color: var(--warn-ink);
    font-weight: 700;
  }
  .ad-chip.skipped .ad-title {
    color: var(--muted);
    text-decoration: line-through;
    text-decoration-thickness: 2px;
  }
  .ad-title {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
  }
  .ad-note {
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
`;var Eo="mydashlight.rides.mode",Ka=1100,Va=440,Ga=700,qa=3*6e4,Ya=1200;function Xa(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var fn=se`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,yo=se`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Za=new URL("emoji.json",import.meta.url).href,wo=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],$o=se`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,ko=se`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Ja=se`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Qa=se`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Ct={bring:"Bring",buy:"Buy"};function el(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function Ce(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function vs(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function tl(s,t){return On(s,t)||ye(s).split(",")[0]}function nl(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function sl(){try{return localStorage.getItem(Eo)==="compact"?"compact":"timeline"}catch{return"timeline"}}function il(s){try{localStorage.setItem(Eo,s)}catch{}}function gn(s){return s.days.every(t=>!t.events.length)}var _t=class extends fe{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Jn(location.search).view;this.urlPage=Jn(location.search).page;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,i=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(i)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}n.el.scrollTop=n.top-i,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},qa))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.error=null,this.mode=this.urlView??sl(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,l]=o.split("|"),c=e.kids.find(a=>a.id===r);(!c||(c.picks[l]??null)===i||!kt(c,l))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&nt(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(i=>i.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=yi(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Ka)return!1;let e=this.plan;return!e||this.width-Va>=zn(ke(e).length,be(e).length)}today(){return xt(this.plan?.time_zone??Xa())}currentBoard(){let e=this.plan;if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;return(this.board==null||e!==this.boardPlan||o!==this.boardKey)&&(this.board=xi(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n){let o=this.scroller;if(!o||!this.board)return;let i=this.board.dayHeads.find(r=>r.date===n)?.y??0;o.scrollTop=Math.max(i,fi(this.board,e)-pi(this.board,e)-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),n=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(n*1440+(this.mode==="timeline"&&n===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[n]?.date)}goToDay(e){let n=this.plan;if(!n)return;let o=this.today();if(e===o.date){this.scrollToNow();return}let i=this.dayIndexOf(e),r=n.days[i];if(!r)return;let l=1/0;if(this.mode==="timeline"){for(let c of r.events)l=Math.min(l,c.arrive_by??c.start);for(let c of Object.values(r.drivers))for(let a of c.outings)a.start!=null&&(l=Math.min(l,a.start))}this.scrollToTime(i*1440+(Number.isFinite(l)?Math.max(0,l-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let r of this.board.dayHeads)r.y<=n+1&&(o=r);this.pinDay!==o.date&&(this.pinDay=o.date);let i=this.renderRoot;for(let r of i.querySelectorAll(".day-tile"))r.classList.toggle("in-view",r.dataset.date===o.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,o),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let l=new Map(this.choreDraft);l.delete(e.id),this.choreDraft=l;let c=r instanceof X?r:new X("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??nt(e)}editMenu(e,n){let o=this.lunch?.kids??[],i=it(e,n),r=o.filter(l=>l.id===e.id||i&&it(l,n)?.dish===i.dish).map(l=>l.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let i=o instanceof X?o:new X("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let i=new Map(this.lunchDraft);for(let r of n)i.set(nn(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,n,o)}catch(r){let l=new Map(this.lunchDraft);for(let a of n)l.delete(nn(e,a));this.lunchDraft=l;let c=r instanceof X?r:new X("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?Ai(e):Si(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(xo(),vo))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||Vn(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(Pi(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof X?n:new X("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof X?n:new X("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(i=>i.date===this.pinDay)?.h??Jt;this.keepAt=n&&this.board?gi(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||il(e)}findEvent(e){let n=this.plan?.days.find(i=>i.date===e.day),o=n?.events.find(i=>i.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(i){let r=i instanceof X?i:new X("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o){if(!this.backend)return;let i=this.backend;this.save(`${n}`,o,()=>i.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e){if(!this.backend)return;let n=this.backend;this.save("stay",!e.stay,()=>n.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,l=r.includes(n)?r.filter(c=>c!==n):[...r,n];this.save(`along-${o}`,l,()=>i.setTakeAlong(e.id,l,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,i;n<0?i=(o??e.start)-5:i=o==null||o+5>=e.start?null:o+5,this.arriveDraft=i,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Ya)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,l=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,l)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=e?wi(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},i=this.wide,r=this.chores?_i(this.chores,this.today().minutes).filter(p=>!this.choreDone(p)):[],l=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,c=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",a=h`<aside class="panel" aria-label=${c}>
      ${l??(this.sel&&e?this.renderEditor(e):this.renderAttention(o,r))}
    </aside>`,d=this.page==="rides";return h`
      <div class="app ${i?"wide":this.width<Ga?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,o,r.length)} ${d&&e?this.renderWeek(e):w}
          ${d?this.renderBanner(e):w}
          <main>
            ${d?h`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?gn(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                </section>`:this.page==="lunch"?h`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:h`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!i&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?h`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${a}`:w}
          </main>
        </div>
        ${i?a:w}
        ${this.toast?h`<div class="toast" role="status">${this.toast}</div>`:w}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let i=n.problems+o;this.tick;let r=this.today(),l="";if(e){let f=e.time_zone,b=new Date(e.updated);this.error?l=h`<span class="bad">Can’t reach Home Assistant · showing the plan from ${Ut(b,new Date,f)}</span>`:e.status&&!e.status.ok?l=h`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Ut(b,new Date,f)}</span>`:this.backend?.live||(l=`Updated ${Ut(b,new Date,f)}`)}let c=(f,b,E,v)=>h`
      <button type="button" class="seg-btn" title=${v} aria-pressed=${this.mode===f?"true":"false"} @click=${()=>this.setMode(f)}>
        ${E}<span class="seg-label">${b}</span>
      </button>
    `,a=(f,b,E)=>h`
      <button type="button" class="seg-btn" aria-pressed=${this.page===f?"true":"false"} @click=${()=>this.setPage(f)}>
        ${E}<span class="seg-label">${b}</span>
      </button>
    `,d=He(r.minutes),p=!!e&&gn(e);return h`
      <header>
        ${this.showMenu?h`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${se`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:w}
        <div class="titles">
          <h1 class="clock" aria-label=${`${ye(r.date)}, ${d}`}>
            <span class="hm">${d.slice(0,-3)}</span><span class="ampm">${d.slice(-2)}</span>
          </h1>
          <p class="today-line">${ye(r.date)}</p>
          ${l?h`<p class="status">${l}</p>`:w}
        </div>
        ${e&&!p?this.renderNext(e,ki(e,r),n):w}
        <div class="controls">
          ${this.wide||p&&!o?w:h`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?w:h`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",se`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",se`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${a("rides","Rides",se`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${a("chores","Chores",se`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?w:a("lunch","Lunch",se`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let a=this.today().date,d=o.unassigned,p=o.laterUnassigned;if(d){let b=h`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${d} ${d===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?h`<div class="next idle needs">${b}</div>`:h`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${b}</button>`}if(p)return h`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${p} ${p===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let f=e.days.some(b=>b.date>=a&&b.events.length);return h`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${f?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${f?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let i;n.ongoing?i="On the road now":n.ahead===0?i=n.inMinutes<180?`Next trip · in ${yt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${oe(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,l=h`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Ce(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(a=>h`<span class="kid-dot" style="background:${a.color}"></span>`)}</span>
      </span>
      ${n.warn?h`<span class="next-stop warn">${n.warn}</span>`:n.stop?h`<span class="next-stop">${n.stop}</span>`:w}
    `,c=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?h`<button type="button" class=${c} @click=${()=>this.open(n.target)}>${l}</button>`:h`<div class=${c}>${l}</div>`}renderWeek(e){let n=this.today().date,o=he(e);return h`<nav class="week" aria-label="Days">
      ${e.days.map(i=>{let r=Bn(i),l=i.events.length,c=i.events.slice(0,6).map(d=>d.own?$t.color:o.get(d.kid)?.color??J(0).color),a=`${ye(i.date)}: ${l?`${l} ${l===1?"activity":"activities"}`:"nothing planned"}${r?`, ${r} to sort out`:""}`;return h`<button
          type="button"
          class="day-tile ${i.date===n?"today":""}"
          data-date=${i.date}
          aria-label=${a}
          @click=${()=>this.goToDay(i.date)}
        >
          <span class="dt-wd">${i.date===n?"Today":oe(i.date)}</span>
          <span class="dt-num">${Number(i.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${c.length?c.map(d=>h`<span class="dt-dot" style="background:${d}"></span>`):h`<span class="dt-free">free</span>`}
            ${l>6?h`<span class="dt-more">+${l-6}</span>`:w}
          </span>
          ${r?h`<span class="dt-badge" aria-hidden="true">${r}</span>`:w}
        </button>`})}
    </nav>`}renderQuiet(e){let n=ke(e),o=be(e),i=he(e),r=n.map(l=>re(e,l));return h`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((l,c)=>se`<circle cx=${50+c*30} cy="80" r="11" fill=${i.get(l).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${nl(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(l=>{let c=i.get(l);return h`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${Ce(re(e,l))}</span>
            <span class="qw-name">${re(e,l)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(l=>h`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Ce(ae(e,l))}</span>
            <span class="qw-name">${ae(e,l)}</span>
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
    </div>`}renderBanner(e){if(e?.needs_setup==="events_calendar")return h`<div class="banner" role="status">
        Pick your family calendar to see the week: in Home Assistant, open Settings &gt; Devices &amp; services &gt; MyDashLight &gt;
        Configure &gt; Calendars.
      </div>`;let n=e?.unavailable_calendars.length??0;return n?h`<div class="banner" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:w}renderEmpty(){return this.error?h`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:h`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderHead(e){return h`<div class="dh-line">
        <span class="label">${e.label}</span>${e.tag?h`<span class="tag">${e.tag}</span>`:w}<span
          class="sub ${e.warn?"warn":""}"
          >${e.sub}</span
        >
      </div>
      ${e.allDay.length?h`<div class="allday" style="padding-left:${tt}px">
            ${e.allDay.map(n=>h`<span
                  class="ad-chip ${n.warn?"warn":""} ${n.cancelled?"skipped":""} ${n.color?"":"plain"}"
                  style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
                  ><span class="ad-title">${n.title}</span>${n.note?h`<span class="ad-note">${n.note}</span>`:w}</span
                >`)}
          </div>`:w}`}renderBoard(e){let n=this.sel,o=a=>!!a&&!!n&&a.day===n.day&&a.event===n.event,i=e.dayHeads.find(a=>a.date===this.pinDay)??e.dayHeads[0],r=e.width,l=100,c=[...e.links.map(a=>({t:"link",x:a,z:a.layer??0})),...e.preps.map(a=>({t:"prep",x:a,z:a.layer??l-1})),...e.cards.map(a=>({t:"card",x:a,z:a.layer??l})),...e.rides.map(a=>({t:"ride",x:a,z:a.layer??l+1}))].sort((a,d)=>a.z-d.z);return h`
      <div
        class="scroller"
        @pointerdown=${this.onDown}
        @pointermove=${this.onMove}
        @pointerup=${this.onUp}
        @pointercancel=${this.onUp}
        @click=${this.onClickCapture}
        @scroll=${()=>this.syncDay()}
      >
        <div class="heads" style="width:${r}px">
          ${e.columns.map(a=>h`<div class="col-head ${a.kind}" style="left:${a.x}px;width:${a.w}px;--c:${a.dot};--rgb:${a.rgb}">
              <span class="avatar ${a.kind}" aria-hidden="true">${Ce(a.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${a.name}</span>${a.kind==="kid"?this.renderLunchChip(a.id,!0):w}</span>
                <span class="sub ${a.subWarn?"warn":""}">${a.sub}</span>
              </span>
            </div>`)}
        </div>
        ${i?h`<div class="pinned" aria-hidden="true" style="width:${r}px;height:${i.h}px;margin-bottom:${-i.h}px">
              ${this.renderHead(i)}
            </div>`:w}
        <div class="canvas" style="width:${r}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(a=>h`<div
                class="col-bg ${a.kind}"
                style="left:${a.x}px;width:${a.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${a.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(a=>h`<div class="day-head" style="top:${a.y}px;width:${r}px;height:${a.h}px">${this.renderHead(a)}</div>`)}
          ${e.empties.map(a=>h`<span class="empty" style="top:${a.y}px">${a.text}</span>`)}
          ${e.grid.map(a=>h`<div class="grid ${a.strong?"strong":""}" style="top:${a.y}px;width:${r-60}px"></div>`)}
          ${e.hours.map(a=>h`<span class="hour" style="top:${a.y}px">${a.label}</span>`)}
          ${Me(e.bands,a=>a.key,a=>h`<div
                class="band"
                aria-hidden="true"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;background:rgba(${a.color.rgb},0.10);border-color:rgba(${a.color.rgb},0.45)"
              ></div>`)}
          ${Me(e.busy,a=>a.key,a=>h`<div class="busy" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span style="top:${a.labelY}px">${a.label}</span>
              </div>`)}
          ${Me(e.windows,a=>a.key,a=>h`<div class="window" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span>${a.label}</span>
              </div>`)}
          ${Me(c,a=>a.x.key,a=>{if(a.t==="link"){let b=a.x;return h`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-color:${b.color.color};background:linear-gradient(rgba(${b.color.rgb},0.11), rgba(${b.color.rgb},0.11)), var(--surface)"
                ></div>`}if(a.t==="prep"){let b=a.x;return h`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-color:${b.color.color};background:linear-gradient(rgba(${b.color.rgb},0.11), rgba(${b.color.rgb},0.11)), var(--surface);color:${b.color.ink}"
                >
                  ${b.label}
                </div>`}if(a.t==="ride"){let b=a.x;return h`<button
                  type="button"
                  class="ride ${b.dashed?"dashed":""} ${b.clash?"clash":""}"
                  aria-label=${b.aria}
                  style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;padding-top:${3+(b.tuckTop??0)}px;padding-bottom:${3+(b.tuckBottom??0)}px"
                  @click=${()=>this.open(b.target)}
                >
                  <span class="l1">${b.l1}</span>${b.show2?h`<span class="l2" style="-webkit-line-clamp:${b.lines2}">${b.l2}</span>`:w}
                </button>`}let d=a.x,p=d.color,f=d.skipped?`repeating-linear-gradient(135deg, rgba(${p.rgb},0.10) 0px, rgba(${p.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:d.stayed?`repeating-linear-gradient(135deg, rgba(${p.rgb},0.24) 0px, rgba(${p.rgb},0.24) 6px, rgba(${p.rgb},0.08) 6px, rgba(${p.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${p.rgb},0.15), rgba(${p.rgb},0.15)), var(--surface)`;return h`<button
                type="button"
                class="card ${d.wrap?"wrap":""} ${o(d.target)?"sel":""} ${d.clash?"clash":""} ${d.skipped?"skipped":""}"
                aria-label=${d.aria}
                style="left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;background:${f};border-color:${d.clash?"var(--bad)":`rgba(${p.rgb},0.45)`};--c:${p.color};--rgb:${p.rgb};--ring:${p.color}"
                @click=${()=>this.open(d.target)}
              >
                <span class="top">
                  <span class="title">${d.title}</span>
                  <span class="time">${d.time}</span>
                  ${d.showDrop&&d.drop?h`<span class="line tone-${d.drop.tone}">${d.drop.text}</span>`:w}
                </span>
                ${d.showPick&&d.pick?h`<span class="line tone-${d.pick.tone}">${d.pick.text}</span>`:w}
              </button>`})}
          ${Me(e.stays,a=>a.key,a=>h`<button
                type="button"
                class="stay"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;border-color:${a.color.color};background:repeating-linear-gradient(135deg, rgba(${a.color.rgb},0.28) 0px, rgba(${a.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1" style="color:${a.color.ink}">${a.l1}</span><span class="l2">${a.l2}</span>
              </button>`)}
          ${Me(e.trips,a=>a.key,a=>h`<button
                type="button"
                class="trip ${a.bad?"bad":""} ${a.stops?"list":""}"
                aria-label=${a.aria}
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1">${a.l1}${a.kids.map(d=>h`<span class="kid-dot" style="background:${d}"></span>`)}</span>
                ${a.show2?h`<span class="l2">${a.l2}</span>`:w}
                ${a.stops?a.stops.map(d=>h`<span class="stop ${d.warn?"warn":""}">${d.text}</span>`):w}
                ${a.show3?h`<span class="l3">${a.l3}</span>`:w}
              </button>`)}
          ${Me(e.overlaps,a=>a.key,a=>h`<div class="overlap" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"></div>`)}
          ${Me(e.marks,a=>a.key,a=>h`<span class="mark" style="left:${a.x}px;top:${a.y}px;${a.right?"transform:translateX(-100%)":""}">${a.text}</span>`)}
          ${e.now?h`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${r-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:w}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:i,later:r}=e,l=this.plan,c=i+n.length,a=this.chores,d=!!a&&!Fn(a);return h`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?w:h`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${d?h`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?h`<div class="attn-chores">${n.map(p=>this.renderChoreRow(p,!0))}</div>`:h`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:h`<p class="panel-sub">Rides in the next two days</p>`}
      ${l&&!i?h`<div class="all-clear">
            <span class="check" aria-hidden="true">${se`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${gn(l)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:w}
      ${o.map(p=>h`<div class="issue ${p.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${p.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${p.target?h`<button type="button" class="issue-title" @click=${()=>this.open(p.target,!0)}>${p.title}</button>`:h`<strong class="issue-title">${p.title}</strong>`}
              <span class="issue-body"
                >${p.parts?p.parts.map(f=>typeof f=="string"?f:h`<button type="button" class="issue-link" @click=${()=>this.open(f.target,!0)}>${f.text}</button>`):p.body}</span
              >
            </div>
          </div>
          ${p.suggestions.length?h`<div class="fixes">
                ${p.suggestions.map(f=>h`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(f.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${f.id}`?"Saving…":f.label}</span>
                    <span class="fix-note">${f.note}</span>
                  </button>`)}
              </div>`:w}
        </div>`)}
      ${this.wide&&l&&!gn(l)&&this.page==="rides"?this.renderLegend():w}
    `}kidColorOf(e){let n=this.plan?he(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return J(Math.max(0,o))}renderLunchChip(e,n=!1){let o=this.lunch,i=o?.kids.find(a=>a.id===e);if(!o||!i)return w;this.tick;let r=this.today(),l=Ii(i,r.date,r.minutes,this.lunchDraft);if(!l)return w;let c=Ct[l.lunch];return h`<span class="lunch-chip ${l.lunch} ${n?"small":""}" title=${`${c} lunch ${l.when}${l.menu?`: ${l.menu}`:""}`}
      >${l.lunch==="bring"?$o:ko}<span class="lunch-chip-text"
        >${c}${n?w:` ${l.when}`}${!n&&l.menu?h`<span class="lunch-chip-menu"> · ${l.menu}</span>`:w}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return h`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return h`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=Li(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:Ee(e.today),i=n.indexOf(o),r=d=>{let p=n[i+d];p&&(this.lunchMonth=p)},l=e.kids.some(d=>d.id===this.lunchKid)?this.lunchKid:null,c=l?e.kids.filter(d=>d.id===l):e.kids,a=e.status&&!e.status.ok?h`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:w;return h`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${se`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${on(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${i<0||i>=n.length-1} @click=${()=>r(1)}>
            ${se`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":h`${yo} Edit menus`}
        </button>
      </div>
      ${a}
      <div class="chore-cols lunch-cols ${l?"wide":""}" style="--n:${c.length}">
        ${c.map(d=>this.renderLunchCard(e,d,o,l!==null))}
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
    </div>`}renderLunchCard(e,n,o,i){let r=this.kidColorOf(n.id),l=ji(e,n,o,this.lunchDraft),c=zi(l),a=l.flat(),d=a.filter(v=>!v.outside&&!v.past&&v.lunch),p=n.days_off.filter(v=>Ee(v.first)<=o&&o<=Ee(v.last)),f=v=>d.filter(y=>sn(y.date)===v),b=v=>{let y=f(v);if(!y.length)return;let T=y.every(u=>u.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,y.map(u=>u.date),T)},E=d.length?`${c.bring} Bring · ${c.buy} Buy${o===Ee(e.today)?" left this month":""}`:"No school days left this month";return h`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Ce(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${E}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Ct[n.default]} unless picked</span>
          ${e.kids.length<2?w:h`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:n.id}
              >
                ${i?Qa:Ja}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?h`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:w}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${on(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((v,y)=>h`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!f(y).length}
            aria-label=${`${f(y).every(T=>T.lunch==="bring")?"Buy":"Bring"} every ${v} left in ${on(o)} for ${n.name}`}
            @click=${()=>b(y)}
          >
            ${v}
          </button>`)}
        ${a.map(v=>this.renderLunchCell(n,v,i))}
      </div>
      ${p.length?h`<p class="lunch-offs">
            No school:
            ${p.map(v=>{let y=v.first<`${o}-01`?`${o}-01`:v.first,T=Ee(v.last)>o?st(`${Zn(o)}-01`,-1):v.last;return`${y===T?vs(y):`${vs(y)}–${vs(T)}`} ${Ri(v.title)}`}).join(" · ")}
          </p>`:w}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return h`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return h`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=n.lunch,r=i==="buy"?"bring":"buy",l=n.menu?`, ${n.menu}`:"",c=this.menuMode,a=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),d=c?`${e.name}, ${ye(n.date)}${l||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${ye(n.date)}: ${Ct[i]}${n.picked?"":" (not picked yet)"}${l}. Tap to ${Ct[r]}.`;return h`<button
      type="button"
      class="lunch-day ${i} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${c?"editing":""} ${a?"sel":""}"
      ?disabled=${n.past&&!c}
      aria-label=${d}
      @click=${()=>c?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${i==="bring"?$o:ko}${Ct[i]}</span>
      ${n.menu?h`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?h`<span class="lunch-sides">${n.sides}</span>`:w}`:c?h`<span class="lunch-menu add">${fn} Menu</span>`:w}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex(T=>T.id===e.kid),l=(this.plan?he(this.plan).get(e.kid):void 0)??J(Math.max(0,r)),c=o.kids[r]?.name??"",a=i===nt(e)?e:{...e,state:i?"done":"open",done_at:i?new Date().toISOString():null},d=i&&a.done_by&&a.done_by!==e.kid?o.people?.find(T=>T.id===a.done_by)?.name??a.done_by_name??null:null,p=`${Hn(a,o.today,o.time_zone)}${d?` · by ${d}`:""}`,f=i||Ti(e),b=`${n?`${c}: `:""}${e.title}. ${p?`${p}. `:""}${i?"Done. Tap to undo.":"Tap when it’s done."}`,E=h`<span class="box" aria-hidden="true"
        >${i?se`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:w}</span
      >
      ${e.icon?h`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:w}
      <span class="chore-text">
        <span class="chore-title">${n?h`<span class="chore-kid">${c}</span> · `:w}${e.title}</span>
        ${p?h`<span class="chore-note">${p}</span>`:w}
      </span>`,v=`chore ${i?"done":""} ${e.state==="overdue"&&!i?"overdue":""} ${f?"":"later"}`,y=`--c:${l.color};--rgb:${l.rgb};--k:${l.ink}`;return f?h`<button type="button" class=${v} style=${y} aria-pressed=${i?"true":"false"} aria-label=${b} @click=${()=>this.tapChore(e)}>
          ${E}
        </button>`:h`<div class=${v} style=${y}>${E}</div>`}renderChores(){let e=this.chores;if(e===void 0)return h`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return h`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return h`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return h`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(Fn(e))return h`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${fn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?h`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:w;this.tick;let i=Ci(e,this.plan?he(this.plan):void 0,this.today().minutes);return h`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${fn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${yo} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${i.length}">
        ${i.map(r=>{let l=r.overdue.filter(c=>!this.choreDone(c)).length+r.now.filter(c=>!this.choreDone(c)).length;return h`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Ce(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${l?`${l} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?h`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(c=>this.renderChoreRow(c))}`:w}
            ${r.now.length?h`<h3 class="chore-group">To do</h3>
                  ${r.now.map(c=>this.renderChoreRow(c))}`:w}
            ${r.done.length?h`<h3 class="chore-group">Done</h3>
                  ${r.done.map(c=>this.renderChoreRow(c))}`:w}
            ${r.later.map(c=>h`<h3 class="chore-group">${c.date===e.today?"Later today":tl(c.date,e.today)}</h3>
                ${c.chores.map(a=>this.renderChoreRow(a))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?h`<p class="chore-none">No chores this week.</p>`:w}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,i=this.plan?he(this.plan):void 0,r=this.choreEdit?.template===e.id,l=e.problems.length?h`<span class="tmpl-note bad">${e.problems.map(Xn).join(" · ")} · tap to set up</span>`:h`<span class="tmpl-note">${Yn(e.who,o,e.take_turns)} · ${qn(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return h`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?h` <span class="tag-paused">Paused</span>`:w}</span>
        ${l}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let a=o.findIndex(p=>p.id===c),d=i?.get(c)??J(Math.max(0,a));return h`<span class="kid-dot" style="background:${d.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return h`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${fn} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([o,i])=>{let r=e.templates.filter(l=>l.repeats===o);return r.length?h`<section class="manage-group" aria-label=${i}>
                  <h3 class="chore-group">${i}</h3>
                  <div class="tmpl-list">${r.map(l=>this.renderTemplateRow(l))}</div>
                </section>`:w}):h`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return h``;let o=n.kids,i=this.plan?he(this.plan):void 0,r=this.choreBusy,l=e.template?n.templates.find(v=>v.id===e.template):void 0,c=Vn(e),a=(l?.problems??[]).filter(v=>v!=="who:"),d=(v,y,T,u=!1)=>h`<button type="button" class="choice ${u?"wide":""}" aria-pressed=${v?"true":"false"} ?disabled=${r} @click=${T}>${y}</button>`,p=(v,y,T,u)=>h`<button type="button" class="chip" aria-pressed=${v?"true":"false"} aria-label=${u??w} ?disabled=${r} @click=${T}>${y}</button>`,f=v=>{v!==e.repeats&&this.changeDraft({repeats:v,days:l&&l.repeats===v?l.days??tn(v):tn(v)})},b=v=>{let y=e.who.includes(v)?e.who.filter(T=>T!==v):o.filter(T=>T.id===v||e.who.includes(T.id)).map(T=>T.id);this.changeDraft({who:y})},E;if(e.repeats==="school"){let v=e.days===Ve?new Set:e.days===""?new Set([0,1,2,3,4]):Wn(e.days)??new Set,y=T=>{let u=new Set(v);u.has(T)?u.delete(T):u.add(T),this.changeDraft({days:u.size===5?"":u.size?Kn(u):Ve})};E=h`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${Ke.slice(0,5).map((T,u)=>p(v.has(u),T.slice(0,2),()=>y(u),T))}
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
        </div>`}else if(e.repeats==="monthly"){let v=e.days.trim(),y=/^\d+$/.test(v)?Number(v):null,T=v&&v.toLowerCase()!=="any"&&v.toLowerCase()!=="last"&&y===null;E=h`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${T?4:3}, minmax(0, 1fr))">
          ${d(v===""||v.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${d(y!==null,"On a date",()=>this.changeDraft({days:String(y??1)}))}
          ${d(v.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${T?d(!0,v,()=>{}):w}
        </div>
        ${y!==null?h`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||y<=1} @click=${()=>this.changeDraft({days:String(y-1)})}>−</button>
                <span class="arrive-value">${Gn(y)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||y>=31} @click=${()=>this.changeDraft({days:String(y+1)})}>+</button>
              </span>
            </div>`:h`<p class="field-hint">${v.toLowerCase()==="last"?"Due on the month’s last day.":T?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")E=h`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let v=e.days===""||e.days.toLowerCase()==="any",y=e.days===Ve?new Set:v?new Set:Wn(e.days)??new Set,T=u=>{let S=new Set(y);S.has(u)?S.delete(u):S.add(u),this.changeDraft({days:S.size?Kn(S)||"Mon-Sun":Ve})};E=h`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${d(v,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${d(!v,"On set days",()=>this.changeDraft({days:v?"Sat":e.days}))}
        </div>
        ${v?h`<p class="field-hint">Shows all week, due on Sunday.</p>`:h`<div role="group" aria-label="Days of the week" class="day-chips">
                ${Ke.map((u,S)=>p(y.has(S),u.slice(0,2),()=>T(S),u))}
              </div>
              <div class="chips">
                ${p(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${p(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return h`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?h`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:w}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?Yn(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===Ve?"No days picked":qn(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${a.length?h`<p class="field-hint bad">${a.map(Xn).join(". ")}. Saving fixes it.</p>`:w}
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
          @input=${v=>this.changeDraft({title:v.target.value})}
        />
        <div role="group" aria-label="Picture" class="icon-chips">
          ${wo.map(v=>p(e.icon===v,v,()=>this.changeDraft({icon:e.icon===v?null:v}),`Picture ${v}`))}
          ${e.icon&&!wo.includes(e.icon)?p(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):w}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?h`<emoji-picker
              class="emoji-more"
              .dataSource=${Za}
              @emoji-click=${v=>{let y=v.detail.unicode;y&&this.changeDraft({icon:y}),this.iconMore=!1}}
            ></emoji-picker>`:w}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((v,y)=>{let T=i?.get(v.id)??J(y),u=e.who.includes(v.id);return h`<button type="button" class="who-chip" style="--c:${T.color};--rgb:${T.rgb}" aria-pressed=${u?"true":"false"} ?disabled=${r} @click=${()=>b(v.id)}>
              <span class="avatar" aria-hidden="true">${Ce(v.name)}</span>${v.name}
            </button>`})}
        </div>
        ${e.who.length>1?h`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${d(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${d(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:w}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${d(e.repeats==="daily","Every day",()=>f("daily"))}
          ${d(e.repeats==="weekly","Every week",()=>f("weekly"))}
          ${d(e.repeats==="monthly","Every month",()=>f("monthly"))}
          ${d(e.repeats==="school","School days",()=>f("school"))}
        </div>
      </div>
      ${E}
      ${e.repeats==="school"?w:h`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${el(e.repeats,e.every)}</span>
      </div>`}
      <div class="field">
        <label class="field-label" for="chore-details">Notes <span class="field-hint">Optional, shown with the chore</span></label>
        <textarea
          id="chore-details"
          class="text-input"
          rows="2"
          .value=${e.details}
          ?disabled=${r}
          @input=${v=>this.changeDraft({details:v.target.value})}
        ></textarea>
      </div>
      ${e.template?h`<div class="field">
              ${d(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${r} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:w}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!c} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":c?c.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return h``;let o=e.busy,i=d=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...d})},r=d=>i({kids:e.kids.includes(d)?e.kids.filter(p=>p!==d):[...e.kids,d]}),l=n.kids.filter(d=>kt(d,e.date)),c=e.dish.trim(),a=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return h`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${ye(e.date)}</span>
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
          ${l.map(d=>{let p=this.kidColorOf(d.id),f=e.kids.includes(d.id);return h`<button type="button" class="who-chip" style="--c:${p.color};--rgb:${p.rgb}" aria-pressed=${f?"true":"false"} ?disabled=${o} @click=${()=>r(d.id)}>
              <span class="avatar" aria-hidden="true">${Ce(d.name)}</span>${d.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${c||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?h`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:w}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!a} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":a??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return h``;let o=n.people?.length?n.people:n.kids.map(p=>({...p,role:"kid"})),i=n.kids.findIndex(p=>p.id===e.kid),r=n.kids[i],l=this.plan?he(this.plan):void 0,c=l?.get(e.kid)??J(Math.max(0,i)),a=o.filter(p=>p.id!==e.kid),d=p=>{let f=n.kids.findIndex(b=>b.id===p.id);return f>=0?(l?.get(p.id)??J(f)).color:"var(--dark)"};return h`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?h`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:w}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${Hn(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${c.color};--rgb:${c.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${Ce(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?h`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${a.map(p=>h`<button type="button" class="done-by" style="--c:${d(p)}" @click=${()=>void this.toggleChore(e,p.id)}>
                  <span class="avatar ${p.role==="parent"?"driver":""}" aria-hidden="true">${Ce(p.name)}</span>
                  <span>${p.name}</span>
                </button>`)}
            </div>`:h`<button type="button" class="choice wide" @click=${()=>this.whoOthers=!0}>Someone else did</button>`}
      </div>
    `}renderLegend(){return h`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}ownHint(e,n){let o=Qt(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${M(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${M(n.start)} to ${M(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=n.along.map(r=>be(e).includes(r)?ae(e,r):re(e,r));return`${o} drives there and back${i.length?`, with ${en(i)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return h``;let{day:o,event:i}=n,r=be(e),l=ui(e,i),c=Qt(e,i),a=!!this.pending,d=L=>this.pending?.key===L?this.pending.value:void 0,p=[...e.people?.carpools??[]];for(let L of e.days)for(let ee of L.events)for(let j of[ee.drop,ee.pick])j&&j!=="none"&&!r.includes(j)&&!p.some(te=>te.toLowerCase()===j.toLowerCase())&&p.push(j);let f=L=>{if(!i.sides.includes(L))return w;let ee=d(L),j=ee!==void 0?String(ee):L==="drop"?i.drop:i.pick,te=j&&j!=="none"&&!r.includes(j)?j:"",ne=N=>this.setRide(i,L,j===N?"":N),ve=[...r.map(N=>[N,In(e,N)]),["none","Not needed"]];return h`<div class="field">
        <span class="field-label">${L==="drop"?"Drop-off":"Pick-up"} ${j===""?h`<span class="nobody">· nobody yet</span>`:w}</span>
        <div role="group" aria-label=${L==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${ve.length}, minmax(0, 1fr))">
          ${ve.map(([N,le])=>h`<button type="button" class="choice" aria-pressed=${j===N?"true":"false"} ?disabled=${a} @click=${()=>ne(N)}>
                ${le}
              </button>`)}
        </div>
        ${p.length?h`<div role="group" aria-label=${L==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${p.map(N=>h`<button type="button" class="chip" aria-pressed=${j.toLowerCase()===N.toLowerCase()?"true":"false"} ?disabled=${a} @click=${()=>ne(N)}>
                    ${N}
                  </button>`)}
            </div>`:w}
        <input
          type="text"
          .value=${te&&!p.some(N=>N.toLowerCase()===te.toLowerCase())?te:""}
          ?disabled=${a}
          aria-label=${L==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${N=>{let le=N.target.value.trim();le&&le!==j&&this.setRide(i,L,le)}}
          @keydown=${N=>{N.key==="Enter"&&N.target.blur()}}
        />
        ${!v&&j!==""&&j!=="none"?b(L,j):w}
      </div>`},b=(L,ee)=>{let j=d(`along-${L}`),te=j!==void 0?j:L==="pick"?i.pick_along??[]:i.along,ne=[...ke(e).filter(N=>N!==i.kid),...r.filter(N=>N!==ee)];return ne.length?h`<div class="field-sub">
        <span class="field-label">${L==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${L==="pick"?"They come for the pick-up":"They leave home in the same car"}</span></span>
        <div role="group" aria-label=${L==="drop"?"Riding along on the drop-off":L==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${ne.map(N=>h`<button type="button" class="chip" aria-pressed=${te.includes(N)?"true":"false"} ?disabled=${a} @click=${()=>this.toggleAlong(i,N,L)}>
              ${r.includes(N)?ae(e,N):re(e,N)}
            </button>`)}
        </div>
      </div>`:w},E=d("stay"),v=E!==void 0?!!E:i.stay,y=i.drop===i.pick&&r.includes(i.drop),T=d("along"),u=T!==void 0?T:i.along,S=i.own?[...ke(e),...r.filter(L=>L!==i.own)]:[],z=i.own!=null&&i.takes!=null,V=i.own!=null&&!z,Q=d("takes"),G=Q!==void 0?Q:i.takes??null,F=d("arrive"),ue=this.arriveDraft!==void 0?this.arriveDraft:F!==void 0?F:i.arrive_by,Z=[],dt=L=>L==="none"?"Not needed":In(e,L),ge=L=>r.includes(L)?ae(e,L):re(e,L),Le=(L,ee,j)=>{ee===""&&!j.length||Z.push(`${L}: ${[ee===""?"TBD":dt(ee),...j.map(ge)].join(", ")}`)};i.own||Le("Drop-off",i.drop,i.along),i.own||Le("Pick-up",i.pick,i.pick_along??[]),!i.own&&i.stay&&Z.push("Stay: yes"),z&&Z.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&Z.push(`Take along: ${i.along.map(ge).join(", ")}`),i.arrive_by!=null&&Z.push(`Arrive by: ${He(i.arrive_by)}`);let me=d("attending"),_e=me!==void 0?!!me:i.attending!==!1;i.attending===!1&&Z.splice(0,Z.length,"Attending: no");let Ze=o.date===this.today().date?"":`${oe(o.date)} · `,Re=h`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${c} · ${i.title}</span>
          <span class="ed-meta">${Ze}${z?"any time ":""}${M(i.start)}–${M(i.end)}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return i.where==="home"?h`${Re}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:h`
      ${Re}
      ${this.pending?h`<p class="saving" role="status">Saving to Google Calendar…</p>`:w}
      ${i.recurring?h`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${oe(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:w}
      <div class="field">
        <span class="field-label">${c} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${_e?"true":"false"} ?disabled=${a} @click=${()=>this.setAttending(i,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${_e?"false":"true"} ?disabled=${a} @click=${()=>this.setAttending(i,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${_e?h`${i.where==="anywhere"?h`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:w}
            ${i.own?h`<p class="field-hint">${this.ownHint(e,i)}</p>`:h`${f("drop")} ${f("pick")}
                  <div class="field">
                    <button type="button" class="choice wide" aria-pressed=${v?"true":"false"} ?disabled=${!y||a} @click=${()=>this.toggleStay(i)}>
                      ${y?v?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
                    </button>
                    ${v&&y?b("both",i.drop):w}
                  </div>`}
      ${i.own?h`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${G!=null?`Takes ${G} min, any time ${M(i.start)}–${M(i.end)}`:"At its set time"}</span>
            </span>
            ${G!=null?h`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${a||G<=5} @click=${()=>this.setTakes(i,Math.max(5,G-5))}>−</button>
                  <span class="arrive-value">${G} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${a||G+5>i.end-i.start} @click=${()=>this.setTakes(i,G+5)}>+</button>
                </span>`:w}
          </div>
          <button type="button" class="chip clear" ?disabled=${a} @click=${()=>this.setTakes(i,G!=null?null:Math.min(10,Math.max(5,i.end-i.start)))}>
            ${G!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:w}
      ${V&&S.length?h`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${S.map(L=>h`<button type="button" class="chip" aria-pressed=${u.includes(L)?"true":"false"} ?disabled=${a} @click=${()=>this.toggleAlong(i,L)}>
                  ${r.includes(L)?ae(e,L):re(e,L)}
                </button>`)}
            </div>
          </div>`:w}
      ${z?w:h`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${ue!=null?`${i.start-ue} min before it starts`:`Aims for a few minutes before ${M(i.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${a} @click=${()=>this.nudgeArrive(i,-5)}>−</button>
          <span class="arrive-value">${ue!=null?M(ue):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${a||ue==null} @click=${()=>this.nudgeArrive(i,5)}>+</button>
        </span>
      </div>
      ${ue!=null?h`<button type="button" class="chip clear" ?disabled=${a} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:w}`}
`:h`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${Z.length?Z.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${i.problems.length?h`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:w}
      ${_e&&!i.own?h`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:w}
    `}};_t.styles=Bi,_t.properties={backend:{attribute:!1},pinDay:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",_t);var St=class extends fe{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=Ks(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(bt);let n=e.toString();history.replaceState(history.state,"",`${location.pathname}${n?`?${n}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new Ht(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return h`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?h`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:w}`}};St.styles=ze`
    /* Home Assistant's panel container has no height of its own, so 100% would let the board grow
       as tall as its content and the whole page would scroll. Fill the screen instead, less the
       safe-area padding HA puts around the panel on phones. Then the board scrolls on its own,
       by finger, mouse drag and wheel, and the side panel scrolls separately. */
    :host {
      display: block;
      height: calc(100vh - var(--safe-area-inset-top, 0px) - var(--safe-area-inset-bottom, 0px));
      height: calc(100dvh - var(--safe-area-inset-top, 0px) - var(--safe-area-inset-bottom, 0px));
      overflow: hidden;
    }
    mydashlight-board {
      height: 100%;
    }
  `,St.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0},pairing:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",St);
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
