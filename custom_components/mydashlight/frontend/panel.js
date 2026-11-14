var zo=Object.defineProperty;var Tn=(s,t)=>()=>(s&&(t=s(s=0)),t);var Bo=(s,t)=>{for(var e in t)zo(s,e,{get:t[e],enumerable:!0})};function un(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function ds(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function Br(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Qi(s){return Br(s,t=>t.unicode)}function Or(s){function t(e,n,o){let i=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(o)for(let[r,[d,l]]of Object.entries(o))i.createIndex(r,d,{multiEntry:l});return i}t(ht),t(Ze,Dr,{[to]:[Mr,!0],[so]:[[Lr,Rr]],[io]:[jr,!0]}),t(us,void 0,{[no]:[""]})}function oo(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function Nr(s){let t=await new Promise((e,n)=>{let o=indexedDB.open(s,Ar);hs[s]=o,o.onupgradeneeded=i=>{i.oldVersion<Pr&&Or(o.result)},oo(e,n,o)});return t.onclose=()=>gs(s),t}function Hr(s){return gn[s]||(gn[s]=Nr(s)),gn[s]}function Me(s,t,e,n){return new Promise((o,i)=>{let r=s.transaction(t,e,{durability:"relaxed"}),d=typeof t=="string"?r.objectStore(t):t.map(a=>r.objectStore(a)),l;n(d,r,a=>{l=a}),r.oncomplete=()=>o(l),r.onerror=()=>i(r.error)})}function gs(s){let t=hs[s],e=t&&t.result;if(e){e.close();let n=bn[s];if(n)for(let o of n)o()}delete hs[s],delete gn[s],delete bn[s]}function Ur(s){return new Promise((t,e)=>{gs(s);let n=indexedDB.deleteDatabase(s);oo(t,e,n)})}function Fr(s,t){let e=bn[s];e||(e=bn[s]=[]),e.push(t)}function ct(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||Wr.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function ro(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=Kr)}function Vr(s){return s.map(({annotation:e,emoticon:n,group:o,order:i,shortcodes:r,skins:d,tags:l,emoji:a,version:c})=>{let h=[...new Set(ro([...(r||[]).map(ct).flat(),...(l||[]).map(ct).flat(),...ct(e),n]))].sort(),g={annotation:e,group:o,order:i,tags:l,tokens:h,unicode:a,version:c};if(n&&(g.emoticon=n),r&&(g.shortcodes=r),d){g.skinTones=[],g.skinUnicodes=[],g.skinVersions=[];for(let{tone:b,emoji:A,version:v}of d)g.skinTones.push(b),g.skinUnicodes.push(A),g.skinVersions.push(v)}return g})}function ao(s,t,e,n){s[t](e).onsuccess=o=>n&&n(o.target.result)}function Xe(s,t,e){ao(s,"get",t,e)}function lo(s,t,e){ao(s,"getAll",t,e)}function ms(s){s.commit&&s.commit()}function Gr(s,t){let e=s[0];for(let n=1;n<s.length;n++){let o=s[n];t(e)>t(o)&&(e=o)}return e}function co(s,t){let e=Gr(s,o=>o.length),n=[];for(let o of e)s.some(i=>i.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function qr(s){return!await bs(s,ht,mn)}async function Yr(s,t,e){let[n,o]=await Promise.all([cs,mn].map(i=>bs(s,ht,i)));return n===e&&o===t}async function Xr(s,t){return Me(s,Ze,ut,(n,o,i)=>{let r,d=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=l=>{let a=l.target.result;for(let c of a)if(r=c.unicode,t(c))return i(c);if(a.length<50)return i();d()}};d()})}async function ho(s,t,e,n){try{let o=Vr(t);await Me(s,[Ze,ht],fs,([i,r],d)=>{let l,a,c=0;function h(){++c===2&&g()}function g(){if(!(l===n&&a===e)){i.clear();for(let b of o)i.put(b);r.put(n,cs),r.put(e,mn),ms(d)}}Xe(r,cs,b=>{l=b,h()}),Xe(r,mn,b=>{a=b,h()})})}finally{}}async function Zr(s,t){return Me(s,Ze,ut,(e,n,o)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);lo(e.index(so),i,o)})}async function po(s,t){let e=ro(ct(t));return e.length?Me(s,Ze,ut,(n,o,i)=>{let r=[],d=()=>{r.length===e.length&&l()},l=()=>{let a=co(r,c=>c.unicode);i(a.sort((c,h)=>c.order<h.order?-1:1))};for(let a=0;a<e.length;a++){let c=e[a],h=a===e.length-1?IDBKeyRange.bound(c,c+"￿",!1,!0):IDBKeyRange.only(c);lo(n.index(to),h,g=>{r.push(g),d()})}}):[]}async function Jr(s,t){let e=await po(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(i=>i.toLowerCase()).includes(t.toLowerCase()))[0]||null:await Xr(s,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function Qr(s,t){return Me(s,Ze,ut,(e,n,o)=>Xe(e,t,i=>{if(i)return o(i);Xe(e.index(io),t,r=>o(r||null))}))}function bs(s,t,e){return Me(s,t,ut,(n,o,i)=>Xe(n,e,i))}function ea(s,t,e,n){return Me(s,t,fs,(o,i)=>{o.put(n,e),ms(i)})}function ta(s,t){return Me(s,us,fs,(e,n)=>Xe(e,t,o=>{e.put((o||0)+1,t),ms(n)}))}function na(s,t,e){return e===0?[]:Me(s,[us,Ze],ut,([n,o],i,r)=>{let d=[];n.index(no).openCursor(void 0,"prev").onsuccess=l=>{let a=l.target.result;if(!a)return r(d);function c(b){if(d.push(b),d.length===e)return r(d);a.continue()}let h=a.primaryKey,g=t.byName(h);if(g)return c(g);Xe(o,h,b=>{if(b)return c(b);a.continue()})}})}function sa(s,t){let e=new Map;for(let o of s){let i=t(o);for(let r of i){let d=e;for(let a=0;a<r.length;a++){let c=r.charAt(a),h=d.get(c);h||(h=new Map,d.set(c,h)),d=h}let l=d.get(fn);l||(l=[],d.set(fn,l)),l.push(o)}}return(o,i)=>{let r=e;for(let a=0;a<o.length;a++){let c=o.charAt(a),h=r.get(c);if(h)r=h;else return[]}if(i)return r.get(fn)||[];let d=[],l=[r];for(;l.length;){let c=[...l.shift().entries()].sort((h,g)=>h[0]<g[0]?-1:1);for(let[h,g]of c)h===fn?d.push(...g):l.push(g)}return d}}function oa(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||ia.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function eo(s){oa(s);let t=(g,b)=>g.name.toLowerCase()<b.name.toLowerCase()?-1:1,e=s.sort(t),o=sa(s,g=>{let b=new Set;if(g.shortcodes)for(let A of g.shortcodes)for(let v of ct(A))b.add(v);return b}),i=g=>o(g,!0),r=g=>o(g,!1),d=g=>{let b=ct(g),A=b.map((v,$)=>($<b.length-1?i:r)(v));return co(A,v=>v.name).sort(t)},l=new Map,a=new Map;for(let g of s){a.set(g.name.toLowerCase(),g);for(let b of g.shortcodes||[])l.set(b.toLowerCase(),g)}return{all:e,search:d,byShortcode:g=>l.get(g.toLowerCase()),byName:g=>a.get(g.toLowerCase())}}function Mt(s){if(!s)return s;if(ra&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function uo(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function la(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||aa.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function fo(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function da(s){let t=await fetch(s,{method:"HEAD"});fo(t,s);let e=t.headers.get("etag");return uo(e),e}async function ps(s){let t=await fetch(s);fo(t,s);let e=t.headers.get("etag");uo(e);let n=await t.json();return la(n),[e,n]}function ca(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function ha(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=s.charCodeAt(o);return e}async function go(s){let t=JSON.stringify(s),e=ha(t),n=await crypto.subtle.digest("SHA-1",e),o=ca(n);return btoa(o)}async function pa(s,t){let e,n=await da(t);if(!n){let o=await ps(t);n=o[0],e=o[1],n||(n=await go(e))}await Yr(s,t,n)||(e||(e=(await ps(t))[1]),await ho(s,e,t,n))}async function ua(s,t){let[e,n]=await ps(t);e||(e=await go(n)),await ho(s,n,t,e)}async function fa(s,t){try{await pa(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var Ar,Pr,Ze,ht,us,Mr,to,Dr,no,Lr,Rr,so,cs,mn,Ji,ut,fs,io,jr,Ir,zr,hs,gn,bn,Wr,Kr,fn,ia,ra,aa,pt,vs=Tn(()=>{Ar=1,Pr=1,Ze="emoji",ht="keyvalue",us="favorites",Mr="tokens",to="tokens",Dr="unicode",no="count",Lr="group",Rr="order",so="group-order",cs="eTag",mn="url",Ji="skinTone",ut="readonly",fs="readwrite",io="skinUnicodes",jr="skinUnicodes",Ir="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",zr="en";hs={},gn={},bn={};Wr=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);Kr=2;fn="";ia=["name","url"];ra=typeof wrappedJSObject<"u";aa=["annotation","emoji","group","order","version"];pt=class{constructor({dataSource:t=Ir,locale:e=zr,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=eo(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await Hr(this._dbName);Fr(this._dbName,this._clear);let e=this.dataSource;await qr(t)?await ua(t,e):this._lazyUpdate=fa(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return ds(t),await this.ready(),Qi(await Zr(this._db,t)).map(Mt)}async getEmojiBySearchQuery(t){un(t),await this.ready();let e=this._custom.search(t),n=Qi(await po(this._db,t)).map(Mt);return[...e,...n]}async getEmojiByShortcode(t){un(t),await this.ready();let e=this._custom.byShortcode(t);return e||Mt(await Jr(this._db,t))}async getEmojiByUnicodeOrName(t){un(t),await this.ready();let e=this._custom.byName(t);return e||Mt(await Qr(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await bs(this._db,ht,Ji)||0}async setPreferredSkinTone(t){return ds(t),await this.ready(),ea(this._db,ht,Ji,t)}async incrementFavoriteEmojiCount(t){return un(t),await this.ready(),ta(this._db,t)}async getTopFavoriteEmoji(t){return ds(t),await this.ready(),(await na(this._db,this._custom,t)).map(Mt)}set customEmoji(t){this._custom=eo(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await gs(this._dbName)}async delete(){await this._shutdown(),await Ur(this._dbName)}}});function bo(s){return s.unicode.includes("‍")}function ka(s){let t=vo(s,"#000"),e=vo(s,"#fff");return t&&e&&$a(t,e)}function Ta(){let s=Object.entries(ma);try{for(let[t,e]of s)if(ka(t))return e}catch{}finally{}return s[0][1]}function Pa(s,t){if(t===0)return s;let e=s.indexOf(Ca);return e!==-1?s.substring(0,e)+String.fromCodePoint(Sa+t-1)+s.substring(e):(s.endsWith(Ea)&&(s=s.substring(0,s.length-1)),s+_a+String.fromCodePoint(Aa+t-1))}function ke(s){s.preventDefault(),s.stopPropagation()}function $s(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function Co(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Ma(s,t){let e=n=>{let o={};for(let i of n)typeof i.tone=="number"&&i.version<=t&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:n,skins:o,shortcodes:i,url:r,name:d,category:l,annotation:a})=>({unicode:n,name:d,shortcodes:i,url:r,category:l,annotation:a,id:n||d,skins:o&&e(o)}))}function La(s,t,e){let n;Da?(n=new ResizeObserver(e),n.observe(s)):yn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function yo(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function xo(s,t,e){let n=yo(t);if(!n){if(!Je){Je=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])Je.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(Je),Je.firstChild.nodeValue=s,yo(Je)}finally{Je.remove()}}return n}function ja(s,t,e){let n=!0;for(let o of s){let i=e(o);if(!i)continue;typeof ks>"u"&&(ks=xo(Ra,t,t));let d=xo(o.unicode,i,t)/1.8<ks;Cs.set(o.unicode,d),d||(n=!1)}return n}function Ia(s){return Co(s,t=>t)}function za(s){s&&(s.scrollTop=0)}function Dt(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function wo(s){return""+s}function Ba(s){let t=document.createElement("template");return t.innerHTML=s,t}function Fa(s,t){Ua?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function Wa(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function Ka(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=Wa(n,s):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&Fa(n,s)}function Va(s,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:d,attributeValuePost:l}}=e,a=s[i];if(o!==a)if(e.currentExpression=a,r)if(a===null)n.removeAttribute(r);else{let c=d+wo(a)+l;n.setAttribute(r,c)}else{let c;Array.isArray(a)?Ka(a,e):a instanceof Element?(c=a,n.replaceWith(c)):n.nodeValue=wo(a),c&&(e.targetNode=c)}}}function Ga(s){let t="",e=!1,n=!1,o=-1,i=new Map,r=[],d=0;for(let a=0,c=s.length;a<c;a++){let h=s[a];if(t+=h.slice(d),a===c-1)break;for(let u=0;u<h.length;u++)switch(h.charAt(u)){case"<":{h.charAt(u+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let g=r[r.length-1],b=Dt(i,g,()=>[]),A,v,$;if(n){let u=/(\S+)="?([^"=]*)$/.exec(h);A=u[1],v=u[2];let M=/^([^">]*)("?)/.exec(s[a+1]);$=M[1],t=t.slice(0,-1*u[0].length),d=M[0].length}else d=0;let _={attributeName:A,attributeValuePre:v,attributeValuePost:$,expressionIndex:a};b.push(_),!e&&!n&&(t+=" ")}return{template:Ba(t),elementsToBindings:i}}function $o(s,t,e){for(let n=0;n<s.length;n++){let o=s[n],i=o.attributeName?t:t.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function qa(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))$o(n,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let d=t.get(++r);d&&$o(d,i,e)}while(i=o.nextNode())}return e}function Ya(s){let{template:t,elementsToBindings:e}=Dt(Oa,s,()=>Ga(s)),n=t.cloneNode(!0).content.firstElementChild,o=qa(n,e);return function(r){return Va(r,o),n}}function Xa(s){let t=Dt(Na,s,()=>new Map),e=Ha;function n(i,...r){let d=Dt(t,i,()=>new Map);return Dt(d,e,()=>Ya(i))(r)}function o(i,r,d){return i.map((l,a)=>{let c=e;e=d(l);try{return r(l,a)}finally{e=c}})}return{map:o,html:n}}function Za(s,t,e,n,o,i,r,d,l){let{labelWithSkin:a,titleForEmoji:c,unicodeWithSkin:h}=e,{html:g,map:b}=Xa(t);function A(u,M,R){return b(u,(U,Q)=>g`<button role="${M?"option":"menuitem"}" aria-selected="${M?Q===t.activeSearchItem:null}" aria-label="${a(U,t.currentSkinTone)}" title="${c(U)}" class="${"emoji"+(M&&Q===t.activeSearchItem?" active":"")+(U.unicode?"":" custom-emoji")}" id="${`${R}-${U.id}`}" style="${U.unicode?null:`--custom-emoji-background: url(${JSON.stringify(U.url)})`}">${U.unicode?h(U,t.currentSkinTone):""}</button>`,U=>`${R}-${U.id}`)}let $=g`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${b(t.skinTones,(u,M)=>g`<div id="skintone-${M}" class="emoji ${M===t.activeSkinTone?"active":""}" aria-selected="${M===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[M]}" aria-label="${t.i18n.skinTones[M]}">${u}</div>`,u=>u)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${b(t.groups,u=>g`<button role="tab" class="nav-button" aria-controls="tab-${u.id}" aria-label="${t.i18n.categories[u.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===u.id}" title="${t.i18n.categories[u.name]}" data-group-id="${u.id}"><div class="nav-emoji emoji">${u.emoji}</div></button>`,u=>u.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${b(t.currentEmojisWithCategories,(u,M)=>g`<div><div id="menu-label-${M}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:u.category?u.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${M!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(u.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${M}" id="${t.searchMode?"search-results":null}">${A(u.emojis,t.searchMode,"emo")}</div></div>`,u=>u.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${A(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,_=(u,M)=>{for(let R of s.querySelectorAll(`[${u}]`))M(R,R.getAttribute(u))};if(l){s.appendChild($);for(let u of["click","focusout","input","keydown","keyup"])_(`data-on-${u}`,(M,R)=>{M.addEventListener(u,n[R])});_("data-ref",(u,M)=>{i[M]=u}),r.addEventListener("abort",()=>{s.removeChild($)})}_("data-action",(u,M)=>{let R=d.get(M);R||d.set(M,R=new WeakSet),R.has(u)||(R.add(u),o[M](u))})}function Ja(s){let t=!1,e,n=new Map,o=new Set,i,r=()=>{if(t)return;let a=[...o];o.clear();try{for(let c of a)c()}finally{i=!1,o.size&&(i=!0,xn(r))}},d=new Proxy({},{get(a,c){if(e){let h=n.get(c);h||(h=new Set,n.set(c,h)),h.add(e)}return a[c]},set(a,c,h){if(a[c]!==h){a[c]=h;let g=n.get(c);if(g){for(let b of g)o.add(b);i||(i=!0,xn(r))}}return!0}}),l=a=>{let c=()=>{let h=e;e=c;try{return a()}finally{e=h}};return c()};return s.addEventListener("abort",()=>{t=!0}),{state:d,createEffect:l}}function Ts(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function Qa(s,t,e){{let n=s.closest(".tabpanel"),o=ko.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),ko.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function el(s,t){let e={},n=new AbortController,o=n.signal,{state:i,createEffect:r}=Ja(o),d=new Map;vn(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),vn(i,t),vn(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:ya,isRtl:!1,currentGroupIndex:0,groups:ys,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let l=m=>{s.getElementById(m).focus()},a=m=>s.getElementById(`emo-${m.id}`),c=(m,y)=>{e.rootElement.dispatchEvent(new CustomEvent(m,{detail:y,bubbles:!0,composed:!0}))},h=(m,y)=>m.id===y.id,g=(m,y)=>{let{category:k,emojis:T}=m,{category:I,emojis:E}=y;return k!==I?!1:Ts(T,E,h)},b=m=>{Ts(i.currentEmojis,m,h)||(i.currentEmojis=m)},A=m=>{i.searchMode!==m&&(i.searchMode=m)},v=m=>{Ts(i.currentEmojisWithCategories,m,g)||(i.currentEmojisWithCategories=m)},$=(m,y)=>y&&m.skins&&m.skins[y]||m.unicode,M={labelWithSkin:(m,y)=>Ia([m.name||$(m,y),m.annotation,...m.shortcodes||Es].filter(Boolean)).join(", "),titleForEmoji:m=>m.annotation||(m.shortcodes||Es).join(", "),unicodeWithSkin:$},R={onClickSkinToneButton:ie,onEmojiClick:se,onNavClick:je,onNavKeydown:ee,onSearchKeydown:Re,onSkinToneOptionsClick:Oe,onSkinToneOptionsFocusOut:D,onSkinToneOptionsKeydown:f,onSkinToneOptionsKeyup:P,onSearchInput:x},U={calculateEmojiGridStyle:H,updateOnIntersection:De},Q=!0;r(()=>{Za(s,i,M,R,U,e,o,d,Q),Q=!1}),i.emojiVersion||ws().then(m=>{m||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function m(){let y=!1,k=setTimeout(()=>{y=!0,i.message=i.i18n.loadingMessage},ba);try{await i.database.ready(),i.databaseLoaded=!0}catch(T){console.error(T),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(k),y&&(y=!1,i.message="")}}i.database&&m()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${mo};`}),r(()=>{i.customEmoji&&i.database&&ae()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==_s&&(i.groups=_s):i.groups!==ys&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=ys)}),r(()=>{async function m(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}m()}),r(()=>{i.skinTones=Array(mo).fill().map((m,y)=>Pa(i.skinToneEmoji,y))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function m(){let{database:y}=i,k=(await Promise.all(xa.map(T=>y.getEmojiByUnicodeOrName(T)))).filter(Boolean);i.defaultFavoriteEmojis=k}i.databaseLoaded&&m()});function ae(){let{customEmoji:m,database:y}=i,k=m||Es;y.customEmoji!==k&&(y.customEmoji=k)}r(()=>{async function m(){ae();let{database:y,defaultFavoriteEmojis:k,numColumns:T}=i,I=await y.getTopFavoriteEmoji(T),E=await ge(Co([...I,...k],L=>L.unicode||L.name).slice(0,T));i.currentFavorites=E}i.databaseLoaded&&i.defaultFavoriteEmojis&&m()});function H(m){La(m,o,()=>{{let y=getComputedStyle(e.rootElement),k=parseInt(y.getPropertyValue("--num-columns"),10),T=y.getPropertyValue("direction")==="rtl";i.numColumns=k,i.isRtl=T}})}function De(m){Qa(m,o,y=>{for(let{target:k,isIntersecting:T}of y)k.classList.toggle("onscreen",T)})}r(()=>{async function m(){let{searchText:y,currentGroup:k,databaseLoaded:T,customEmoji:I}=i;if(!T)i.currentEmojis=[],i.searchMode=!1;else if(y.length>=ga){let E=await Be(y);i.searchText===y&&(b(E),A(!0))}else{let{id:E}=k;if(E!==-1||I&&I.length){let L=await tt(E);i.currentGroup.id===E&&(b(L),A(!1))}}}m()});let le=()=>{yn(()=>za(e.tabpanelElement))};r(()=>{let{currentEmojis:m,emojiVersion:y}=i,k=m.filter(T=>T.unicode).filter(T=>bo(T)&&!Cs.has(T.unicode));if(!y&&k.length)b(m),yn(()=>et(k));else{let T=y?m:m.filter(de);b(T),le()}});function et(m){ja(m,e.baselineEmoji,a)?le():i.currentEmojis=[...i.currentEmojis]}function de(m){return!m.unicode||!bo(m)||Cs.get(m.unicode)}async function Le(m){let y=i.emojiVersion||await ws();return m.filter(({version:k})=>!k||k<=y)}async function ge(m){return Ma(m,i.emojiVersion||await ws())}async function tt(m){let y=m===-1?i.customEmoji:await i.database.getEmojiByGroup(m);return ge(await Le(y))}async function Be(m){return ge(await Le(await i.database.getEmojiBySearchQuery(m)))}r(()=>{}),r(()=>{function m(){let{searchMode:k,currentEmojis:T}=i;if(k)return[{category:"",emojis:T}];let I=new Map;for(let E of T){let L=E.category||"",K=I.get(L);K||(K=[],I.set(L,K)),K.push(E)}return[...I.entries()].map(([E,L])=>({category:E,emojis:L})).sort((E,L)=>i.customCategorySorting(E.category,L.category))}let y=m();v(y)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:m}=i;Eo(()=>{i.searchText=(m||"").trim(),i.activeSearchItem=-1})});function Re(m){if(!i.searchMode||!i.currentEmojis.length)return;let y=k=>{ke(m),i.activeSearchItem=$s(k,i.activeSearchItem,i.currentEmojis)};switch(m.key){case"ArrowDown":return y(!1);case"ArrowUp":return y(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return ke(m),ce(i.currentEmojis[i.activeSearchItem].id)}}function je(m){let{target:y}=m,k=y.closest(".nav-button");if(!k)return;let T=parseInt(k.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(I=>I.id===T)}function ee(m){let{target:y,key:k}=m,T=I=>{I&&(ke(m),I.focus())};switch(k){case"ArrowLeft":return T(y.previousElementSibling);case"ArrowRight":return T(y.nextElementSibling);case"Home":return T(y.parentElement.firstElementChild);case"End":return T(y.parentElement.lastElementChild)}}async function q(m){let y=await i.database.getEmojiByUnicodeOrName(m),k=[...i.currentEmojis,...i.currentFavorites].find(I=>I.id===m),T=k.unicode&&$(k,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(m),{emoji:y,skinTone:i.currentSkinTone,...T&&{unicode:T},...k.name&&{name:k.name}}}async function ce(m){let y=q(m);c("emoji-click-sync",y),c("emoji-click",await y)}function se(m){let{target:y}=m;if(!y.classList.contains("emoji"))return;ke(m);let k=y.id.substring(4);ce(k)}function Ee(m){i.currentSkinTone=m,i.skinTonePickerExpanded=!1,l("skintone-button"),c("skin-tone-change",{skinTone:m}),i.database.setPreferredSkinTone(m)}function Oe(m){let{target:{id:y}}=m,k=y&&y.match(/^skintone-(\d)/);if(!k)return;ke(m);let T=parseInt(k[1],10);Ee(T)}function ie(m){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(ke(m),yn(()=>l("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function f(m){if(!i.skinTonePickerExpanded)return;let y=async k=>{ke(m),i.activeSkinTone=k};switch(m.key){case"ArrowUp":return y($s(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return y($s(!1,i.activeSkinTone,i.skinTones));case"Home":return y(0);case"End":return y(i.skinTones.length-1);case"Enter":return ke(m),Ee(i.activeSkinTone);case"Escape":return ke(m),i.skinTonePickerExpanded=!1,l("skintone-button")}}function P(m){if(i.skinTonePickerExpanded)switch(m.key){case" ":return ke(m),Ee(i.activeSkinTone)}}async function D(m){let{relatedTarget:y}=m;(!y||y.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function x(m){i.rawSearchText=m.target.value}return{$set(m){vn(i,m)},$destroy(){n.abort()}}}function To(s){s instanceof Qe||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var _s,ys,ga,mo,Eo,ma,ba,va,ya,xa,_o,wa,vo,$a,xs,ws,Cs,Ea,_a,Ca,Sa,Aa,yn,Da,Ra,ks,Je,Oa,Na,Ha,Ua,xn,ko,Es,vn,tl,nl,sl,il,So,ol,Qe,Ao,Po=Tn(()=>{vs();_s=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),ys=_s.slice(1),ga=2,mo=6,Eo=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;ma={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},ba=1e3,va="🖐️",ya=8,xa=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],_o='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',wa=(s,t)=>s<t?-1:s>t?1:0,vo=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${_o}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},$a=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};ws=()=>(xs||(xs=new Promise(s=>Eo(()=>s(Ta())))),xs),Cs=new Map,Ea="️",_a="\uD83C",Ca="‍",Sa=127995,Aa=57339;yn=requestAnimationFrame,Da=typeof ResizeObserver=="function";Ra="😀";Oa=new WeakMap,Na=new WeakMap,Ha=Symbol("un-keyed"),Ua="replaceChildren"in Element.prototype;xn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);ko=new WeakMap;Es=[],{assign:vn}=Object;tl="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",nl="en",sl={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},il=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',So=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],ol=`:host{--emoji-font-family:${_o}}`,Qe=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=il+ol,this.shadowRoot.appendChild(e),this._ctx={locale:nl,dataSource:tl,skinToneEmoji:va,customCategorySorting:wa,customEmoji:null,i18n:sl,emojiVersion:null,...t};for(let n of So)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){To(this),this._cmp||(this._cmp=el(this.shadowRoot,this._ctx))}disconnectedCallback(){To(this),xn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new pt({locale:t,dataSource:e}))}_dbFlush(){xn(()=>this._dbCreate())}},Ao={};for(let s of So)Ao[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(Qe.prototype,Ao);customElements.get("emoji-picker")||customElements.define("emoji-picker",Qe)});var Mo={};Bo(Mo,{Database:()=>pt,Picker:()=>Qe});var Do=Tn(()=>{Po();vs()});var Bt=globalThis,Ot=Bt.ShadowRoot&&(Bt.ShadyCSS===void 0||Bt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,En=Symbol(),zs=new WeakMap,gt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==En)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Ot&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=zs.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&zs.set(e,t))}return t}toString(){return this.cssText}},Bs=s=>new gt(typeof s=="string"?s:s+"",void 0,En),Ne=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,o,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new gt(e,s,En)},Os=(s,t)=>{if(Ot)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=Bt.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}},_n=Ot?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Bs(e)})(s):s;var{is:Oo,defineProperty:No,getOwnPropertyDescriptor:Ho,getOwnPropertyNames:Uo,getOwnPropertySymbols:Fo,getPrototypeOf:Wo}=Object,Nt=globalThis,Ns=Nt.trustedTypes,Ko=Ns?Ns.emptyScript:"",Vo=Nt.reactiveElementPolyfillSupport,mt=(s,t)=>s,Cn={toAttribute(s,t){switch(t){case Boolean:s=s?Ko:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Us=(s,t)=>!Oo(s,t),Hs={attribute:!0,type:String,converter:Cn,reflect:!1,useDefault:!1,hasChanged:Us};Symbol.metadata??=Symbol("metadata"),Nt.litPropertyMetadata??=new WeakMap;var Ce=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Hs){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&No(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:i}=Ho(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let d=o?.call(this);i?.call(this,r),this.requestUpdate(t,d,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Hs}static _$Ei(){if(this.hasOwnProperty(mt("elementProperties")))return;let t=Wo(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(mt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(mt("properties"))){let e=this.properties,n=[...Uo(e),...Fo(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(_n(o))}else t!==void 0&&e.push(_n(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Os(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:Cn).toAttribute(e,n.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=n.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Cn;this._$Em=o;let d=r.fromAttribute(e,i.type);this[o]=d??this._$Ej?.get(o)??d,this._$Em=null}}requestUpdate(t,e,n,o=!1,i){if(t!==void 0){let r=this.constructor;if(o===!1&&(i=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??Us)(i,e)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:i},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,i]of n){let{wrapped:r}=i,d=this[o];r!==!0||this._$AL.has(o)||d===void 0||this.C(o,void 0,i,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Ce.elementStyles=[],Ce.shadowRootOptions={mode:"open"},Ce[mt("elementProperties")]=new Map,Ce[mt("finalized")]=new Map,Vo?.({ReactiveElement:Ce}),(Nt.reactiveElementVersions??=[]).push("2.1.2");var An=globalThis,Fs=s=>s,Ht=An.trustedTypes,Ws=Ht?Ht.createPolicy("lit-html",{createHTML:s=>s}):void 0,Pn="$lit$",Se=`lit$${Math.random().toFixed(9).slice(2)}$`,Mn="?"+Se,Go=`<${Mn}>`,Fe=document,vt=()=>Fe.createComment(""),yt=s=>s===null||typeof s!="object"&&typeof s!="function",Dn=Array.isArray,Xs=s=>Dn(s)||typeof s?.[Symbol.iterator]=="function",Sn=`[ 	
\f\r]`,bt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ks=/-->/g,Vs=/>/g,He=RegExp(`>|${Sn}(?:([^\\s"'>=/]+)(${Sn}*=${Sn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Gs=/'/g,qs=/"/g,Zs=/^(?:script|style|textarea|title)$/i,Ln=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),p=Ln(1),Z=Ln(2),_l=Ln(3),Ae=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),Ys=new WeakMap,Ue=Fe.createTreeWalker(Fe,129);function Js(s,t){if(!Dn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ws!==void 0?Ws.createHTML(t):t}var Qs=(s,t)=>{let e=s.length-1,n=[],o,i=t===2?"<svg>":t===3?"<math>":"",r=bt;for(let d=0;d<e;d++){let l=s[d],a,c,h=-1,g=0;for(;g<l.length&&(r.lastIndex=g,c=r.exec(l),c!==null);)g=r.lastIndex,r===bt?c[1]==="!--"?r=Ks:c[1]!==void 0?r=Vs:c[2]!==void 0?(Zs.test(c[2])&&(o=RegExp("</"+c[2],"g")),r=He):c[3]!==void 0&&(r=He):r===He?c[0]===">"?(r=o??bt,h=-1):c[1]===void 0?h=-2:(h=r.lastIndex-c[2].length,a=c[1],r=c[3]===void 0?He:c[3]==='"'?qs:Gs):r===qs||r===Gs?r=He:r===Ks||r===Vs?r=bt:(r=He,o=void 0);let b=r===He&&s[d+1].startsWith("/>")?" ":"";i+=r===bt?l+Go:h>=0?(n.push(a),l.slice(0,h)+Pn+l.slice(h)+Se+b):l+Se+(h===-2?d:b)}return[Js(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},xt=class s{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let i=0,r=0,d=t.length-1,l=this.parts,[a,c]=Qs(t,e);if(this.el=s.createElement(a,n),Ue.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(o=Ue.nextNode())!==null&&l.length<d;){if(o.nodeType===1){if(o.hasAttributes())for(let h of o.getAttributeNames())if(h.endsWith(Pn)){let g=c[r++],b=o.getAttribute(h).split(Se),A=/([.?@])?(.*)/.exec(g);l.push({type:1,index:i,name:A[2],strings:b,ctor:A[1]==="."?Ft:A[1]==="?"?Wt:A[1]==="@"?Kt:Ke}),o.removeAttribute(h)}else h.startsWith(Se)&&(l.push({type:6,index:i}),o.removeAttribute(h));if(Zs.test(o.tagName)){let h=o.textContent.split(Se),g=h.length-1;if(g>0){o.textContent=Ht?Ht.emptyScript:"";for(let b=0;b<g;b++)o.append(h[b],vt()),Ue.nextNode(),l.push({type:2,index:++i});o.append(h[g],vt())}}}else if(o.nodeType===8)if(o.data===Mn)l.push({type:2,index:i});else{let h=-1;for(;(h=o.data.indexOf(Se,h+1))!==-1;)l.push({type:7,index:i}),h+=Se.length-1}i++}}static createElement(t,e){let n=Fe.createElement("template");return n.innerHTML=t,n}};function We(s,t,e=s,n){if(t===Ae)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,i=yt(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=We(s,o._$AS(s,t.values),o,n)),t}var Ut=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??Fe).importNode(e,!0);Ue.currentNode=o;let i=Ue.nextNode(),r=0,d=0,l=n[0];for(;l!==void 0;){if(r===l.index){let a;l.type===2?a=new st(i,i.nextSibling,this,t):l.type===1?a=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(a=new Vt(i,this,t)),this._$AV.push(a),l=n[++d]}r!==l?.index&&(i=Ue.nextNode(),r++)}return Ue.currentNode=Fe,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},st=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=We(this,t,e),yt(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==Ae&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Xs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==w&&yt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Fe.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=xt.createElement(Js(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new Ut(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=Ys.get(t.strings);return e===void 0&&Ys.set(t.strings,e=new xt(t)),e}k(t){Dn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let i of t)o===e.length?e.push(n=new s(this.O(vt()),this.O(vt()),this,this.options)):n=e[o],n._$AI(i),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=Fs(t).nextSibling;Fs(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ke=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,i){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=w}_$AI(t,e=this,n,o){let i=this.strings,r=!1;if(i===void 0)t=We(this,t,e,0),r=!yt(t)||t!==this._$AH&&t!==Ae,r&&(this._$AH=t);else{let d=t,l,a;for(t=i[0],l=0;l<i.length-1;l++)a=We(this,d[n+l],e,l),a===Ae&&(a=this._$AH[l]),r||=!yt(a)||a!==this._$AH[l],a===w?t=w:t!==w&&(t+=(a??"")+i[l+1]),this._$AH[l]=a}r&&!o&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Ft=class extends Ke{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}},Wt=class extends Ke{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}},Kt=class extends Ke{constructor(t,e,n,o,i){super(t,e,n,o,i),this.type=5}_$AI(t,e=this){if((t=We(this,t,e,0)??w)===Ae)return;let n=this._$AH,o=t===w&&n!==w||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==w&&(n===w||o);o&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Vt=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){We(this,t)}},ei={M:Pn,P:Se,A:Mn,C:1,L:Qs,R:Ut,D:Xs,V:We,I:st,H:Ke,N:Wt,U:Kt,B:Ft,F:Vt},qo=An.litHtmlPolyfillSupport;qo?.(xt,st),(An.litHtmlVersions??=[]).push("3.3.3");var ti=(s,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let i=e?.renderBefore??null;n._$litPart$=o=new st(t.insertBefore(vt(),i),i,void 0,e??{})}return o._$AI(s),o};var Rn=globalThis,fe=class extends Ce{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ti(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Ae}};fe._$litElement$=!0,fe.finalized=!0,Rn.litElementHydrateSupport?.({LitElement:fe});var Yo=Rn.litElementPolyfillSupport;Yo?.({LitElement:fe});(Rn.litElementVersions??=[]).push("4.2.2");var it="mydashlight",Ol=`/api/${it}/pair`,Nl=`/api/${it}/pair/poll`,Hl=`/${it}`,wt="pair";function ni(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function jn(s){return s.toUpperCase().replace(/[^A-Z0-9]/g,"")}function si(s){let t=new URLSearchParams(s);return t.has(wt)?jn(t.get(wt)??""):null}function Xo(s){if(s<60)return"just now";let t=Math.round(s/60);return`${t} minute${t===1?"":"s"} ago`}var $t=class extends fe{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let n=await this.connection.sendMessagePromise({type:`${it}/pair/check`,code:e});n.found?(this.waiting=n,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(n){this.error=this.message(n),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${it}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let n=e?.code;return n==="unauthorized"?"Only a Home Assistant admin can pair a screen.":n==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":n==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return p`<form @submit=${o=>{o.preventDefault();let i=jn(this.typed);i&&this.check(i)}}>
      <h2>Pair a screen</h2>
      <p>Type the code the screen is showing.</p>
      ${this.error?p`<p class="error" role="alert">${this.error}</p>`:w}
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
    </form>`}confirm(){let e=this.waiting,n=this.step==="approving",o=e.home===!1;return p`<h2>Allow this screen?</h2>
      <p class="code">${ni(e.code??"")}</p>
      ${o?p`<p class="warning" role="alert">
            <b>This code came from outside your home network.</b> Only allow it if you can see this code on a
            screen of your own right now. If someone sent you this code or link, press Cancel.
          </p>`:w}
      <p>
        A screen at ${e.address} asked ${Xo(e.age??0)}. Check the code matches the one on the screen. It will be
        signed in to Home Assistant as <b>${this.userName||"you"}</b>.
      </p>
      <p>To sign it out later, delete its entry under Refresh tokens on your Home Assistant profile’s Security tab.</p>
      <div class="actions">
        <button type="button" @click=${()=>this.close()} ?disabled=${n}>Cancel</button>
        <button type="button" class="dark" @click=${()=>void this.approve()} ?disabled=${n}>
          ${n?"Allowing…":o?"Allow anyway":"Allow"}
        </button>
      </div>`}render(){let e;return this.isAdmin?this.step==="done"?e=p`<h2>Screen paired</h2>
        <p>It will open the board in a few seconds.</p>
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Done</button></div>`:this.step==="confirm"||this.step==="approving"?e=this.confirm():e=this.enter():e=p`<h2>Pair a screen</h2>
        <p>Only a Home Assistant admin can pair a screen. Ask an admin to scan the code instead.</p>
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Close</button></div>`,p`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${e}</div>`}};$t.styles=Ne`
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
  `,$t.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",$t);function j(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function Ie(s){let t=Math.floor(Math.round(s)/60)%24;return`${j(s)} ${t<12?"AM":"PM"}`}function ii(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function Tt(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function In(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Zo=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Jo=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Qo=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Gt(s){return new Date(`${s}T12:00:00Z`)}function ve(s){let t=Gt(s);return`${Zo.format(t)}, ${Qo.format(t)}`}function oe(s){return Jo.format(Gt(s))}function ye(s,t){return Math.round((Gt(t).getTime()-Gt(s).getTime())/864e5)}function kt(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return kt("UTC",t)}let n=o=>e.find(i=>i.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function qt(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=kt(e,s),i=kt(e,t).date;return o.date===i?`at ${Ie(o.minutes)}`:`on ${oe(o.date)} at ${Ie(o.minutes)}`}var G=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}};function ai(s){switch(s.code){case"connection_lost":case"timeout":return"Can’t reach Home Assistant";case"not_running":return"MyDashLight isn’t running";default:return"Couldn’t get the latest plan"}}var Ve="mydashlight",er=7,zn=3e4,oi=3e4;function Bn(s){if(s instanceof G)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new G(String(t.code??"error"),t.message)}return typeof s=="number"?new G("connection_lost","Lost the connection to Home Assistant."):new G("error",String(s))}function ri(s,t){return new Promise((e,n)=>{let o=setTimeout(()=>n(new G("timeout","Home Assistant didn’t answer.")),t);s.then(i=>{clearTimeout(o),e(i)},i=>{clearTimeout(o),n(i)})})}var Et=class{constructor(t,e,n,o){this.live=!1;this.unsub=null;this.opening=!1;this.gen=0;this.closed=!1;this.onReady=()=>this.open();this.onDisconnected=()=>this.dropped();this.conn=t,this.type=e,this.onMessage=n,this.onFailed=o,t.addEventListener?.("ready",this.onReady),t.addEventListener?.("disconnected",this.onDisconnected)}get isOpen(){return this.unsub!==null||this.opening}open(){if(this.closed||this.isOpen||this.conn.connected===!1)return;let t=++this.gen;this.opening=!0,this.conn.subscribeMessage(e=>{t===this.gen&&(this.live=!0,this.onMessage(e))},{type:this.type},{resubscribe:!1}).then(e=>{if(t!==this.gen){e().catch(()=>{});return}this.opening=!1,this.unsub=e},e=>{t===this.gen&&(this.opening=!1,this.live=!1,this.onFailed(e))})}dropped(){this.gen++,this.opening=!1,this.unsub=null,this.live=!1}close(){this.closed=!0,this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsub;this.dropped(),t&&t().catch(()=>{})}},Yt=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.rides=null;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new G("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.rides?.live??!1}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.rides=new Et(this.conn,`${Ve}/rides/subscribe`,t=>{t.plan?this.emit(t.plan):this.fail(new G("not_running","MyDashLight isn’t running right now."))},()=>{}),this.rides.open(),this.timer=setInterval(()=>{this.live||(this.refresh(),this.rides?.open())},zn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected),this.rides?.close(),this.rides=null}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await ri(this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:"get_plan",service_data:{days:er},return_response:!0}),oi);this.emit(t.response)}catch(t){this.fail(Bn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:t,service_data:e})}catch(n){throw Bn(n)}this.live||await this.refresh()}setRide(t,e,n,o,i){return this.call("set_ride",i===void 0?{event:t,side:e,driver:n,scope:o}:{event:t,side:e,driver:n,scope:o,stay:i})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:In(e),scope:n})}setLeaveBy(t,e,n){return this.call("set_leave_by",e==null?{event:t,scope:n}:{event:t,time:In(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}watchChores(t){let e=!1,n=!1,o=async()=>{try{let d=await ri(this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:"get_chores",service_data:{},return_response:!0}),oi);if(e)return;n=!0,t(d.response??null)}catch{!e&&!n&&t(null)}},i=new Et(this.conn,`${Ve}/chores/subscribe`,d=>{e||(n=!0,t(d.chores))},()=>void o());i.open();let r=setInterval(()=>{i.live||i.open()},zn);return()=>{e=!0,clearInterval(r),i.close()}}watchLunch(t){let e=!1,n=!1,o=new Et(this.conn,`${Ve}/lunch/subscribe`,r=>{e||(n=!0,t(r.lunch))},()=>{!e&&!n&&t(null)});o.open();let i=setInterval(()=>{o.live||o.open()},zn);return()=>{e=!0,clearInterval(i),o.close()}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:t,service_data:e})}catch(n){throw Bn(n)}}};var li={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},di=s=>(...t)=>({_$litDirective$:s,values:t}),Xt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:tr}=ei,ci=s=>s;var hi=()=>document.createComment(""),ot=(s,t,e)=>{let n=s._$AA.parentNode,o=t===void 0?s._$AB:t._$AA;if(e===void 0){let i=n.insertBefore(hi(),o),r=n.insertBefore(hi(),o);e=new tr(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,d=r!==s;if(d){let l;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(l=s._$AU)!==r._$AU&&e._$AP(l)}if(i!==o||d){let l=e._$AA;for(;l!==i;){let a=ci(l).nextSibling;ci(n).insertBefore(l,o),l=a}}}return e},ze=(s,t,e=s)=>(s._$AI(t,e),s),nr={},pi=(s,t=nr)=>s._$AH=t,ui=s=>s._$AH,Zt=s=>{s._$AR(),s._$AA.remove()};var fi=(s,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(s[o],o);return n},Pe=di(class extends Xt{constructor(s){if(super(s),s.type!==li.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],i=[],r=0;for(let d of s)o[r]=n?n(d,r):r,i[r]=e(d,r),r++;return{values:i,keys:o}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let o=ui(s),{values:i,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,i;let d=this.ut??=[],l=[],a,c,h=0,g=o.length-1,b=0,A=i.length-1;for(;h<=g&&b<=A;)if(o[h]===null)h++;else if(o[g]===null)g--;else if(d[h]===r[b])l[b]=ze(o[h],i[b]),h++,b++;else if(d[g]===r[A])l[A]=ze(o[g],i[A]),g--,A--;else if(d[h]===r[A])l[A]=ze(o[h],i[A]),ot(s,l[A+1],o[h]),h++,A--;else if(d[g]===r[b])l[b]=ze(o[g],i[b]),ot(s,o[h],o[g]),g--,b++;else if(a===void 0&&(a=fi(r,b,A),c=fi(d,h,g)),a.has(d[h]))if(a.has(d[g])){let v=c.get(r[b]),$=v!==void 0?o[v]:null;if($===null){let _=ot(s,o[h]);ze(_,i[b]),l[b]=_}else l[b]=ze($,i[b]),ot(s,o[h],$),o[v]=null;b++}else Zt(o[g]),g--;else Zt(o[h]),h++;for(;b<=A;){let v=ot(s,l[A+1]);ze(v,i[b]),l[b++]=v}for(;h<=g;){let v=o[h++];v!==null&&Zt(v)}return this.ut=r,pi(s,l),Ae}});var Jt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function J(s){return Jt[(s%Jt.length+Jt.length)%Jt.length]}var Qt="#23272E",On="35,39,46";var sr=3,Ct=36,Nn=12,en=8,gi=30,xe=16,_t=100,rt=60,Un=10,tn=30,Fn=10,ir=150,or=150,on=1;function ki(s,t){return s.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??Ct}var rr=26,Ti=4;function Kn(s,t){let e=Math.max(ir,or/on);return Math.ceil(rt+Math.max(0,s-1)*Un+tn+Math.max(0,t-1)*Fn+e*(s+on*t))}function we(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function me(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function pe(s){return new Map(we(s).map((t,e)=>[t,J(e)]))}function re(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function ne(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function Vn(s,t){return t==="none"?"Not needed":me(s).includes(t)?ne(s,t):t}function Ei(s){return s.leave_by!=null&&s.leave_by>s.start&&s.leave_by<s.end?` · leave ${j(s.leave_by)}`:""}function rn(s){if(s.busy_why==="days"){if(s.start<=0&&s.end>=1440)return"All day";if(s.start<=0)return`Until ${j(s.end)}`;if(s.end>=1440)return`From ${j(s.start)}`}return`${j(s.start)}–${j(s.end)}`}function an(s,t){return t.own?ne(s,t.own):re(s,t.kid)}var St={color:Qt,rgb:On,ink:Qt};function _i(s,t){return t.own?St:pe(s).get(t.kid)??J(0)}function ar(s,t){let e=we(s);return t.along.map(n=>e.includes(n)?re(s,n):ne(s,n))}function ln(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function lr(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function nn(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function Hn(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(nn(t,n.from)),e.push(nn(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(nn(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function dr(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,d)=>r.s-d.s||d.en-r.en),e=[],n=[],o=-1/0,i=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(i(),o=-1/0);let d=n.findIndex(l=>l<=r.s);d<0?(d=n.length,n.push(r.en)):n[d]=r.en,r.col=d,e.push(r),o=Math.max(o,r.en)}return i(),t}function cr(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return s[s.length-1].y}function hr(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return s[s.length-1].t}function Ci(s,t){return cr(s.anchors,t)}function Gn(s,t){return hr(s.anchors,t)}function pr(s,t){let e=we(s),n=me(s),o=Math.max(t,Kn(e.length,n.length)),r=(o-rt-Math.max(0,e.length-1)*Un-tn-Math.max(0,n.length-1)*Fn)/(e.length+on*n.length||1),d=Math.floor(r),l=Math.floor(r*on),a=s.whole_week??s.days,c=new Map;for(let v of a)for(let $ of v.events)for(let _ of $.own?$.along:[$.kid]){let u=c.get(_)??[];u.some(M=>M.event_id===$.event_id&&M.calendar_id===$.calendar_id)||u.push($),c.set(_,u)}let h=pe(s),g=[],b=rt;e.forEach((v,$)=>{let _=c.get(v)??[],u=s.days.some(M=>M.events.some(R=>R.kid===v&&(R.sides.includes("drop")&&R.drop===""||R.sides.includes("pick")&&R.pick==="")));g.push({id:v,kind:"kid",x:b,w:d,name:re(s,v),dot:h.get(v).color,rgb:h.get(v).rgb,sub:`${u?"Needs a ride · ":""}${_.length} this week`,subWarn:u}),b+=d+($<e.length-1?Un:0)});let A=b+tn/2;return b+=tn,n.forEach((v,$)=>{let _=0,u=0;for(let M of a){let R=M.drivers[v];R&&(_+=R.outings.length,u+=R.drive??0)}g.push({id:v,kind:"driver",x:b,w:l,name:ne(s,v),dot:Qt,rgb:On,sub:`${_} ${_===1?"trip":"trips"} this week · ${Tt(u)} driving`,subWarn:!1}),b+=l+($<n.length-1?Fn:0)}),{columns:g,sepX:A,width:o}}function ur(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function mi(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${j(s.start)}`:e||!t?`${s.title} until ${j(s.end)}`:`${s.title} ${j(s.start)}–${j(s.end)}`}function qn(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length+(s.unplaced?.length??0)}function Yn(s,t){let e=ye(t,s);return e===0?"Today":e===1?"Tomorrow":""}function X(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Wn(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),o=1,i=0;for(let r of s.split(/\s+/).filter(Boolean)){let d=r.length;for(i===0?i=d:i+1+d<=n?i+=1+d:(o++,i=d);i>n;)o++,i-=n}return o}var Si=25,fr=15,Ai=3;function bi(s){return Math.max(0,Math.min(Ai,Math.floor((s-Si)/fr)))}var gr=Si+2,vi=20;function yi(s){return/^(\d+:\d\d)\s+Home$/.exec(s.at(-1)??"")?.[1]??null}var sn="🚗";function xi(s,t){if(s===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,i,r,d=!1)=>({at:o,who:i,stays:d,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(s))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(s))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(s))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}return null}var wi={muted:0,normal:1,pending:2,problem:3};function Pi(s){let{drop:t,pick:e}=s,n=t?xi(t.text,"drop"):null,o=e?xi(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return s;let i=[t,e].reduce((l,a)=>a&&(wi[a.tone]??1)>(wi[l]??1)?a.tone:l,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${sn} No rides yet`,tone:i},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let l=`${sn} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${l} both ways`,tone:i},pick:null}:{drop:{text:`${l} ↓${n.at} ↑${o.at}`.trimEnd(),tone:i},pick:null}}let r=(l,a)=>l==="needed"?`${a} needed`:`${a}${l.at?`${l.at} `:" "}${l.who}${l.stays?" stays":""}${l.extra}`,d=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${sn} ${d.join(" · ")}`,tone:i},pick:null}}function $i(s,t){let e=t-23,n=`${j(s.start)}–${j(s.end)}`+(s.arrive_by!=null?` · arrive ${j(s.arrive_by)}`:"")+Ei(s),o=33+Wn(n,e,6.6)*16,i=s.own?s.lines:Pi(s.lines);for(let r of[i.drop,i.pick])r&&(o+=2+Wn(r.text,e,7)*16);return o+4}function Mi(s,t,e,n){let o=t==="compact",{columns:i,sepX:r,width:d}=pr(s,e),l=new Map(i.map(u=>[u.id,u])),a=we(s),c=me(s),h=[...a,...c],g=pe(s),b=lr(s),A=u=>re(s,u),v=u=>ne(s,u),$={mode:t,width:d,height:0,columns:i,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},_=0;return s.days.forEach((u,M)=>{let R=M*1440,U=new Map(u.events.map(f=>[f.id,f])),Q=f=>f&&U.has(f)?{day:u.date,event:f}:null,ae=qn(u),H=u.events.length,De=Yn(u.date,n.date),le=yr(s,u,g,d);$.dayHeads.push({date:u.date,y:_,label:ve(u.date),tag:De,sub:(H?`${H} ${H===1?"activity":"activities"}${u.done?" left":""}`:u.done?"All done for today":"Nothing scheduled")+(ae?` · ${ae} to sort out`:""),warn:ae>0,h:Ct+(le?le.h+Ti+2:0),allDay:le?.chips??[]}),$.anchors.push({t:R,y:_});let et=$.dayHeads[$.dayHeads.length-1],de=_+et.h+Nn,Le=c.flatMap(f=>u.drivers[f]?.outings??[]);if(!H&&!Le.length){$.empties.push({key:u.date,y:de,text:u.done?"Nothing else today":"Nothing planned"}),_=de+40,$.anchors.push({t:R+1439,y:_});return}let ge=(f,P,D,x,m,y,k,T=f.kid)=>{let I=!!f.own&&T===f.own,E=!!f.own&&T!==f.own,L=I?St:g.get(T)??J(0),K=I?v(T):A(T),te=E?{drop:{text:`With ${v(f.own)}`,tone:f.attending===!1?"muted":"normal"},pick:null}:k&&!f.own?Pi(f.lines):f.lines,B=I?ar(s,f):[],ue=(f.takes!=null?`${f.takes} min, any time ${j(f.start)}–${j(f.end)}`:rn(f)+(f.arrive_by!=null?` · arrive ${j(f.arrive_by)}`:"")+Ei(f))+(B.length?` · with ${ln(B)}`:"");return{key:`${u.date}|card|${f.id}`+(f.own?`|${T}`:""),x:P,y:D,w:x,h:m,target:{day:u.date,event:f.id},event:f,color:L,kidName:K,clash:y,stayed:!f.own&&f.stay&&c.includes(f.drop),skipped:f.attending===!1,title:ur(f.title,K),time:ue,drop:te.drop,pick:te.pick,showDrop:!!te.drop&&(k||m>=56),showPick:!!te.pick&&(k||m>=74),wrap:k,aria:`${K}, ${f.title} ${f.takes!=null?`any time from ${j(f.start)} to ${j(f.end)}`:rn(f).replace("–"," to ")}. `+(f.attending===!1&&!te.drop?"Not attending. ":"")+[te.drop,te.pick].filter(_e=>!!_e).map(_e=>_e.text).join(". ")}},tt=f=>{let P=u.rides[f];return P?(u.drivers[P.driver]?.segments??[]).filter(x=>x.type!=="home"&&x.kids.includes(P.kid)&&X(x.start)>=X(P.start)&&X(x.end)<=X(P.end)):[]},Be=f=>{let P=u.rides[f];if(!P)return null;let D=P.serves.find(x=>U.get(x)?.kid===P.kid);return Q(D??P.serves[0])},Re=(f,P)=>{if(P.event)return P;let D=u.events.find(x=>x.own&&x.own!==f&&x.along.includes(f)&&x.title===P.title);return D?{...P,title:`${P.title} with ${v(D.own)}`}:P},je=f=>{if(f.takes==null)return[f.start,f.end];let P=f.planned??f.start;return[P,P+f.takes]},ee=new Map;for(let f of u.issues)f.level!=="problem"||!f.event||(f.kind==="late"&&ee.set(f.event,`${Math.round(X(f.minutes))} min late`),f.kind==="waiting"&&ee.set(`${f.event}|pick`,`Waits ${Math.round(X(f.minutes))} min`));if(!o){let f=1/0,P=-1/0;for(let E of u.events)E.start<=0&&E.end>=1440||(E.start>0?f=Math.min(f,E.start-20,E.arrive_by!=null?E.arrive_by-10:1/0):f=Math.min(f,E.end-30),E.end<1440?P=Math.max(P,E.end+20):P=Math.max(P,E.start+30));for(let E of Le)E.start!=null&&(f=Math.min(f,E.start)),E.end!=null&&(P=Math.max(P,E.end));let D=u.from;D!=null&&Number.isFinite(f)&&f<D+60?f=D-15:u.date===n.date&&Number.isFinite(f)&&n.minutes>f-60&&n.minutes<P&&(f=Math.min(f,n.minutes-15));let x=Number.isFinite(f)?Math.floor((f-5)/30)*30:900,m=Math.max(Number.isFinite(P)?Math.ceil((P+5)/30)*30:960,x+60),y=E=>D!=null&&X(E)<=x,k=E=>D!=null&&X(E)<x,T=E=>Math.round(de+(Math.max(x,Math.min(m,E))-x)*sr);$.anchors.push({t:R+x,y:T(x)},{t:R+m,y:T(m)});for(let E of a){let L=l.get(E),K=g.get(E),te=(u.kids[E]?.items??[]).filter(C=>C.start!=null&&C.end!=null&&!y(C.end)).map(C=>({item:C,s:X(C.start),en:X(C.end)})),B=[];for(let C of dr(te)){let z=L.w/C.cols,O=Math.round(L.x+C.col*z),F=Math.round(z-(C.cols>1?4:0)),V=T(C.s),W=C.item;if(W.type==="act"){let he=U.get(W.event??"");if(!he)continue;let zt=Math.max(30,T(C.en)-V),nt=ge(he,O,V,F,zt,W.clash,!1,E);if(nt.layer=_t,nt.cut=k(C.s),$.cards.push(nt),he.arrive_by!=null&&he.start-he.arrive_by>=5&&!nt.cut){let kn=T(he.arrive_by),Is={key:`${u.date}|prep|${he.id}`,x:O,y:kn,w:F,h:V-kn+xe,color:K,label:`Arrive by ${j(he.arrive_by)}`,layer:_t-1};$.preps.push(Is),B.push({s:he.arrive_by,en:C.en,top:kn,bottom:V+zt,x:O,w:F,prep:Is,card:nt})}else B.push({s:C.s,en:C.en,top:V,bottom:V+zt,x:O,w:F,card:nt});let Rs=ee.get(he.id);Rs&&$.marks.push({key:`${u.date}|late|${he.id}`,x:O+F-4,y:V+4,text:Rs,right:!0});let js=ee.get(`${he.id}|pick`);js&&$.marks.push({key:`${u.date}|wait|${he.id}`,x:O+4,y:V+zt+2,text:js,right:!1});continue}let N=u.rides[W.ride??-1];if(!N)continue;let be=Math.max(22,T(C.en)-V),ft=Hn(tt(N.index),b),Ms=v(N.driver),Ds={key:`${u.date}|ride|${N.index}`,x:O,y:V,w:F,h:be,target:Be(N.index),l1:`${N.own?"In":"Along in"} ${Ms}’s car`,l2:ft.join(" → "),show2:bi(be)>0,lines2:bi(be),dashed:!N.own,clash:W.clash,aria:`${A(E)} ${N.own?"in":"riding along in"} ${Ms}’s car, ${j(X(N.start))} to ${j(X(N.end))}: ${ft.join(" to ")}`};$.rides.push(Ds);let Ls=l.get(N.driver),$n=null;Ls&&($n={key:`${u.date}|band|${N.index}`,x:O+F,y:V,w:Math.max(0,Ls.x+8-(O+F)),h:be,color:K},$.bands.push($n)),B.push({s:C.s,en:C.en,top:V,bottom:V+be,x:O,w:F,ride:Ds,band:$n})}let ue=C=>C.ride?.layer??(C.prep?_t-1:_t),_e=(C,z,O,F)=>{O>xe&&$.links.push({key:`${C.key}|link`,x:C.x,y:z,w:C.w,h:O,color:K,layer:F})},S=(C,z)=>{if(!(z.x<C.x||z.x+z.w>C.x+C.w)&&(C.x=z.x,C.w=z.w,C.ride.x=z.x,C.ride.w=z.w,C.band)){let O=C.band.x+C.band.w;C.band.x=z.x+z.w,C.band.w=Math.max(0,O-C.band.x)}},Y=new Set;for(let C of[...B].sort((z,O)=>O.s-z.s)){let z=C.ride;if(!z)continue;let O=B.filter(W=>W!==C&&W.s>=C.en&&W.s-C.en<=gi&&W.top>=C.bottom).sort((W,N)=>W.s-N.s||W.top-N.top)[0];if(!O)continue;Y.add(C),S(C,O);let F=ue(O),V=O.top-C.bottom;_e(z,C.bottom,V+xe,F-1),z.layer=F-(V>0?2:1),z.h+=xe,z.tuckBottom=xe}for(let C of[...B].sort((z,O)=>z.s-O.s)){let z=C.ride;if(!z||Y.has(C))continue;let O=B.filter(W=>W!==C&&W.en<=C.s&&C.s-W.en<=gi&&W.bottom<=C.top&&(W.card||W.ride?.layer!=null)).sort((W,N)=>N.en-W.en||N.bottom-W.bottom)[0];if(!O)continue;S(C,O);let F=O.ride?.layer??_t,V=C.top-O.bottom;_e(z,O.bottom-xe,V+xe,F-1),z.layer=F-(V>0?2:1),z.y-=xe,z.h+=xe,z.tuckTop=xe}}for(let E of c){let L=l.get(E),K=u.drivers[E];if(!K)continue;let te=[],B=null;for(let S of K.segments)if(!(S.start==null||S.end==null)){if(S.type==="home"){B=null;continue}if(S.type==="stay"){B=null,te.push({type:"stay",g:S,s:S.start,en:S.end});continue}B&&B.en===S.start?(B.en=S.end,B.legs.push(S)):(B={type:"trip",s:S.start,en:S.end,legs:[S]},te.push(B))}let ue=new Set,_e=(S,Y,C,z)=>{ue.add(S.id);let O=T(Y),F=ge(S,L.x+8,O,L.w-16,Math.max(30,T(C)-O),!1,!1,E);F.cut=k(Y),z&&F.drop?.tone==="normal"&&(F.drop=null,F.showDrop=!1),$.cards.push(F)};for(let S of te){if(y(S.en))continue;let Y=T(S.s),C=Math.max(24,T(S.en)-Y);if(S.type==="stay"){let N=U.get(S.g.event??S.g.serves??"");if(N?.own===E){_e(N,S.s,S.en,!0);continue}let be=N?g.get(N.kid)??J(0):J(0),ft=S.g.kids.map(A);$.stays.push({cut:k(S.s),key:`${u.date}|stay|${E}|${S.s}`,x:L.x+8,y:Y,w:L.w-16,h:C,target:Q(N?.id),color:be,l1:N?`At ${N.title} with ${A(N.kid)}`:"Staying",l2:`until ${j(S.en)}`+(ft.length?` · ${ft.join(" and ")} too`:"")});continue}let z=S.legs[0],O=S.legs[S.legs.length-1],F=[];for(let N of S.legs)for(let be of N.kids)F.includes(be)||F.push(be);let V=O.type==="drive"&&O.to==="home",W=Hn(S.legs,b);$.trips.push({key:`${u.date}|trip|${E}|${S.s}`,x:L.x+8,y:Y,w:L.w-16,h:C,target:Q(S.legs.find(N=>N.serves)?.serves),l1:z.type==="drive"&&z.from==="home"?`Leave ${j(S.s)}`:`From ${nn(b,z.from??z.place)} ${j(S.s)}`,l2:W.join(" → "),show2:C>=36,l3:V?`Home ${j(S.en)}`:"",show3:V&&C>=62,stops:null,kids:F.map(N=>(g.get(N)??J(0)).color),bad:S.legs.some(N=>N.overlaps_busy),aria:`${v(E)} drives ${W.join(" to ")}, ${j(S.s)} to ${j(S.en)}`})}for(let S of K.segments)if(!(!S.overlaps_busy||S.start==null||S.end==null))for(let Y of K.busy){let C=Math.max(S.start,Y.start),z=Math.min(S.end,Y.end);z<=C||y(z)||$.overlaps.push({key:`${u.date}|overlap|${E}|${C}`,x:L.x+6,y:T(C)-2,w:L.w-12,h:Math.max(8,T(z)-T(C)+4)})}for(let S of u.events)if(S.own===E&&(!ue.has(S.id)&&!y(je(S)[1])&&_e(S,...je(S),!1),S.takes!=null&&S.attending!==!1&&!y(S.end))){let Y=T(S.start);$.windows.push({key:`${u.date}|window|${S.id}`,x:L.x+4,y:Y,w:L.w-8,h:Math.max(24,T(S.end)-Y),label:`${S.title} · any time ${j(S.start)}–${j(S.end)}`})}for(let S of K.busy){if(S.event||S.end<=x||S.start>=m)continue;let Y=Re(E,S),C=T(Y.start),z=T(Y.end);$.busy.push({key:`${u.date}|busy|${E}|${Y.start}`,x:L.x+1,y:C,w:L.w-2,h:z-C,labelY:8,label:mi(Y,!1)})}}let I=-1/0;for(let E=x;E<=m;E+=30)$.grid.push({key:`${u.date}|grid|${E}`,y:T(E),strong:E%60===0}),E%60===0&&T(E)-I>=22&&($.hours.push({key:`${u.date}|hour|${E}`,y:T(E)-8,label:ii(E)}),I=T(E));u.date===n.date&&n.minutes>x&&n.minutes<m&&($.now={y:T(n.minutes),label:`Now ${j(n.minutes)}`}),_=T(m)+Nn;return}let q=[];for(let f of a){let P=l.get(f);for(let D of u.kids[f]?.items??[])if(D.start!=null){if(D.type==="act"){let x=U.get(D.event??"");if(!x)continue;q.push({col:f,s:D.start,h:$i(x,P.w),kind:"act",item:D})}else if(!u.rides[D.ride??-1]?.own){let x=u.rides[D.ride??-1],m=x?u.drivers[x.driver]?.outings.find(y=>y.start!=null&&y.start<=X(x.start)&&X(x.start)<=X(y.end,y.start)):void 0;q.push({col:f,s:m?.start??D.start,h:gr,kind:"along",item:D})}}}for(let f of c){let P=u.drivers[f];if(!P)continue;for(let x of P.busy)x.event||q.push({col:f,s:x.start,h:32,kind:"busy",busy:Re(f,x)});let D=l.get(f).w;for(let x of u.events)x.own!==f||!x.busy_only&&x.attending!==!1&&(x.takes==null||x.planned!=null)||q.push({col:f,s:je(x)[0],h:$i(x,D),kind:"own",event:x});for(let x of P.outings){if(x.start==null)continue;let y=[...yi(x.lines)?x.lines.slice(0,-1):x.lines,...x.warn?[x.warn]:[]].reduce((k,T)=>k+Wn(T,D-36,7),0);q.push({col:f,s:x.start,h:30+y*16,kind:"out",out:x})}}q.sort((f,P)=>f.s-P.s||h.indexOf(f.col)-h.indexOf(P.col));let ce=new Map,se=[],Ee=new Map,Oe=de-vi;for(let f=0;f<q.length;){let P=f,D=Oe+vi;for(;P<q.length&&q[P].s===q[f].s;P++){let m=ce.get(q[P].col);m!=null&&(D=Math.max(D,m+en))}let x=new Set;for(let m=f;m<P;m++){let y=q[m],k=x.has(y.col)?ce.get(y.col)+en:D;x.add(y.col),ce.set(y.col,k+y.h)}Ee.set(q[f].s,D),q[f].s>0&&$.hours.push({key:`${u.date}|hour|${q[f].s}`,y:D+2,label:Ie(q[f].s)}),Oe=D,f=P}ce.clear(),q.forEach((f,P)=>{let D=ce.get(f.col),x=Math.max(D!=null?D+en:de,Ee.get(f.s));ce.set(f.col,x+f.h);let m=f.kind==="busy"?f.busy.end:f.kind==="act"?U.get(f.item.event??"")?.end??null:f.kind==="own"?je(f.event)[1]:null;se.push({col:f.col,s:f.s,end:m,y:x,h:f.h,box:null}),$.anchors.push({t:R+f.s,y:x});let y=l.get(f.col);if(f.kind==="busy"){let k={key:`${u.date}|busy|${f.col}|${P}`,x:y.x+1,y:x,w:y.w-2,h:f.h,labelY:8,label:mi(f.busy,!0)};$.busy.push(k),se[se.length-1].box=k}else if(f.kind==="out"){let k=f.out,T=yi(k.lines),I=T?k.lines.slice(0,-1):k.lines;$.trips.push({key:`${u.date}|trip|${f.col}|${P}`,x:y.x+8,y:x,w:y.w-16,h:f.h,target:Q(k.target),l1:T?`${k.lead} · home ${T}`:k.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...I.map(E=>({text:E,warn:!1})),...k.warn?[{text:k.warn,warn:!0}]:[]],kids:k.kids.map(E=>(g.get(E)??J(0)).color),bad:!!k.warn,aria:`${v(f.col)}: ${k.lead}. ${k.lines.join(". ")}${k.warn?`. ${k.warn}`:""}`})}else if(f.kind==="own"){let k=ge(f.event,y.x+8,x,y.w-16,f.h,!1,!0,f.col);$.cards.push(k),se[se.length-1].box=k}else if(f.kind==="act"){let k=U.get(f.item.event??""),T=ge(k,y.x,x,y.w,f.h,f.item.clash,!0,f.col);$.cards.push(T),se[se.length-1].box=T}else{let k=u.rides[f.item.ride??-1],T=Hn(tt(k.index),b),I=v(k.driver);$.rides.push({key:`${u.date}|ride|${k.index}`,x:y.x,y:x,w:y.w,h:f.h,target:Be(k.index),l1:`${sn} with ${I}`,l2:T.join(" → "),show2:!1,lines2:Ai,dashed:!0,clash:f.item.clash,aria:`${A(f.col)} riding along with ${I}, ${j(X(k.start))} to ${j(X(k.end))}: ${T.join(" to ")}`})}});let ie=de;for(let f of ce.values())ie=Math.max(ie,f);for(let f of se){if(!f.box||f.end==null)continue;let P=f.y+f.h;for(let D of se)D.col!==f.col&&D.s>=f.s&&D.s<f.end&&(P=Math.max(P,D.y+D.h));f.end>=1440&&(P=ie);for(let D of se)D.col===f.col&&D.y>f.y&&(P=Math.min(P,D.y-en));P=Math.min(P,ie),P>f.y+f.h&&(f.box.h=P-f.y)}_=ie+Nn+6,$.anchors.push({t:R+1439,y:_})}),$.height=_,$}var mr=["","¼","½","¾"];function Ge(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return Tt(n);let o=Math.round(n*4),i=Math.floor(o/4),r=mr[o%4];return`${i||!r?i:""}${r} min`})}function Di(s){let t=e=>e?{...e,text:Ge(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(Ge),warn:i.warn==null?i.warn:Ge(i.warn)}))}])),issues:e.issues.map(n=>({...n,title:Ge(n.title),body:Ge(n.body),note:n.note==null?n.note:Ge(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:Ge(o.note)}))}:{}}))}))}}var br=2,vr=48;function Li(s,t,e=vr){let n=[],o=new Set(me(s)),i=we(s).map(g=>re(s,g)),r=i.length>1?i.slice(0,2):[i[0]??"Ava","Ben"],d=0,l=0,a=0,c=0,h=t.minutes+e*60;for(let g of s.days){let b=ye(t.date,g.date),A=b===0?"":`${oe(g.date)} · `,v=new Map(g.events.map(u=>[u.id,u])),$=u=>u&&v.has(u)?{day:g.date,event:u}:null,_=(u,M)=>b*1440+(u??v.get(M??"")?.start??0)<h;for(let u of g.issues)if(u.level==="problem"){if(!_(u.at,u.event)){a++,u.kind==="unassigned"&&c++;continue}d++,u.kind==="unassigned"&&l++,n.push({key:`${g.date}|${u.key}`,tone:u.kind==="unassigned"?"unassigned":"problem",title:A+u.title,body:u.body,target:$(u.event),suggestions:(u.suggestions??[]).map(M=>({id:M.id,label:M.label,note:M.note}))})}if(g.clashes.forEach((u,M)=>{if(!_(u.a.start,u.a.event)){a++;return}d++;let R=v.get(u.a.event??""),U=re(s,u.kid),Q=(H,De)=>{let le=$(De);return le?{text:H,target:le}:H},ae=[];if(u.b.type==="act"){let H=v.get(u.b.event??"");R&&H&&(ae=[Q(R.title,R.id),` ${j(R.start)}–${j(R.end)} and `,Q(H.title,H.id),` ${j(H.start)}–${j(H.end)} overlap.`])}else{let H=g.rides[u.b.ride??-1];R&&H&&(ae=[`${U} is in `,Q(`${ne(s,H.driver)}’s car`,H.serves[0]),` ${j(X(u.b.start))}–${j(X(u.b.end))}, during `,Q(R.title,R.id),"."])}n.push({key:`${g.date}|clash|${M}`,tone:"problem",title:`${A}${U} is double-booked`,body:ae.map(H=>typeof H=="string"?H:H.text).join(""),parts:ae,target:null,suggestions:[]})}),b>=0&&b<br)for(let u of g.issues)u.level!=="heads_up"||!_(u.at,u.event)||n.push({key:`${g.date}|${u.key}`,tone:"heads_up",title:A+u.title,body:u.body,target:$(u.event),suggestions:[]});for(let u of g.unplaced??[]){if(!_(u.at)){a++;continue}d++;let M=u.people.map(R=>o.has(R)?ne(s,R):re(s,R));n.push({key:`${g.date}|unplaced|${u.id}`,tone:"problem",title:`${A}${j(u.at)} ${u.title}: ${Ri(u).toLowerCase()}`,body:u.reason==="unknown"&&u.word?`“${u.word}” isn’t anyone in the family, so this is only in ${ln(M)}’s lane. If it’s a misspelt name, fix the title in Google Calendar.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Start the title in Google Calendar with who it’s for, such as “${r[0]} Piano”, or “${r.join(" & ")} Piano” for both.`,target:null,suggestions:[]})}for(let u of g.events)!u.problems.length||!_(u.start)||n.push({key:`${g.date}|notes|${u.id}`,tone:"heads_up",title:`${A}Check the notes on ${an(s,u)}’s ${u.title}`,body:`These lines couldn’t be read: ${u.problems.join("; ")}`,target:$(u.id),suggestions:[]})}return{items:n,problems:d,unassigned:l,later:a,laterUnassigned:c}}function Ri(s){return s.reason==="unknown"&&s.word?`Who is “${s.word}”?`:"Who is this for?"}function yr(s,t,e,n){let o=new Set(me(s)),i=c=>{let h=c[0];return h==null?null:o.has(h)?St:e.get(h)??null},r=[...(t.all_day??[]).map(c=>({key:`${t.date}|allday|${c.id}`,title:c.title,note:c.days>1?`Day ${c.day_number} of ${c.days}`:"",color:i(c.people),cancelled:c.cancelled,warn:!1})),...(t.unplaced??[]).map(c=>({key:`${t.date}|unplaced|${c.id}`,title:`${j(c.at)} ${c.title}`,note:Ri(c),color:null,cancelled:!1,warn:!0}))];if(!r.length)return null;let d=Math.max(120,n-rt),l=1,a=0;for(let c of r){let h=Math.min(d,30+7*(c.title.length+(c.note?c.note.length+2:0)));a&&a+h>d&&(l++,a=0),a+=h}return{key:`${t.date}|allday`,h:l*rr+(l-1)*Ti,chips:r}}function ji(s,t){let e=pe(s),n=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=ye(t.date,i.date);if(!(r<0))for(let d of me(s))for(let l of i.drivers[d]?.outings??[]){if(l.start==null)continue;let a=r*1440+l.start;if(r*1440+X(l.end,l.start)<=t.minutes)continue;let h=a-t.minutes,g={driver:d,name:ne(s,d),date:i.date,ahead:r,start:l.start,inMinutes:h,ongoing:h<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(b=>e.get(b)??J(0)),warn:l.warn,target:l.target&&i.events.some(b=>b.id===l.target)?{day:i.date,event:l.target}:null};(!n||o(g)<o(n)||o(g)===o(n)&&g.inMinutes<n.inMinutes)&&(n=g)}}return n}function at(s){return s.state==="done"||s.state==="late"}var xr=780;function wr(s,t,e){return s.state==="open"&&!!s.for_day&&s.due===t&&e<xr}function Ii(s,t){return s.chores.map(e=>wr(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function zi(s){return s.state==="open"||s.state==="overdue"}function Jn(s,t,e){if(at(s)){let n=s.done_at?$r(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${Xn(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${Xn(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let o=ye(t,s.due);return`By ${o===1?"tomorrow":o<7?oe(s.due):Zn(s.due)}`}if(s.for_day&&s.due===t)return`Tonight · for ${Xn(s.for_day,t)}`;if(s.due&&s.due>t){let n=ye(t,s.due);return n===1?"By tomorrow":`By ${n<7?oe(s.due):Zn(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function Xn(s,t){let e=ye(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?oe(s):Zn(s)}function Zn(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function $r(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let i=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return i===t?r:`${oe(i)} ${r}`}function Bi(s,t,e=1440){let n=Ii(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=n.filter(c=>c.kid===o.id),d=new Map;for(let c of r){if(c.state!=="upcoming")continue;let h=c.shows_from??c.due??s.today;d.set(h,[...d.get(h)??[],c])}let l=r.filter(c=>c.state==="overdue"),a=r.filter(c=>c.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??J(i),overdue:l,now:a,done:r.filter(at),later:[...d.entries()].sort(([c],[h])=>c.localeCompare(h)).map(([c,h])=>({date:c,chores:h})),left:l.length+a.length}})}function Oi(s,t=1440){return Ii(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function Qn(s){return!s.chores.length&&!s.templates.length}var qe=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function es(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,i]=n.split("-").map(r=>qe.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function ts(s){let t=[...new Set(s)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${qe[n[0]]}-${qe[n.at(-1)]}`]:n.map(o=>qe[o])).join(", ")}var Ye="none";function dn(s){return s==="daily"||s==="school"?"":"Any"}function Ni(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function Hi(s){let t=s.days??dn(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function ns(s){return s.title.trim()?s.who.length?s.days===Ye?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function Ui(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function ss(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function is(s,t,e=1,n=!1,o=!1){if(s==="school"){let c=t.trim().replace(/-/g,"–"),h=o?c?`${c} Bring lunch days`:"Bring lunch days":c?`${c} school days`:"Every school day";return n?`${h}, the night before`:h}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,d=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(d))return e>1?`Every day, every ${e} weeks`:"Every day";if(!d||d.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${d.replace(/-/g,"–")} ${r}`;let a=`${d.split(",").map(c=>{let h=c.trim();return h.toLowerCase()==="last"?"the last day":/^\d+$/.test(h)?`the ${ss(Number(h))}`:`the ${h}`}).join(" and ")} ${r}`;return a[0].toUpperCase()+a.slice(1)}function os(s,t,e=!1){let n=s.map(i=>t.find(r=>r.id===i)?.name??i);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function rs(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function cn(s,t){return`${s}|${t}`}function lt(s,t){let[e,n,o]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function hn(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function Fi(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function Wi(s,t){return hn(t)<5&&!Fi(s,t)}function At(s,t,e=new Map){if(!Wi(s,t))return null;let n=cn(s.id,t);if(e.has(n)){let i=e.get(n);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[t];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function dt(s,t){return Wi(s,t)?s.menus?.[t]??null:null}var kr="From the school's menu feed.";function Tr(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==kr);return t.length?t.join(`
`):null}function $e(s){return s.slice(0,7)}function pn(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function as(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function Ki(s){let t=[];for(let e=$e(s.first);e<=$e(s.last);e=as(e))t.push(e);return t}function Vi(s,t,e,n=new Map){let o=`${e}-01`,i=lt(o,-hn(o)),r=[];for(;$e(i)<=e;){let d=[];for(let l=0;l<5;l++){let a=lt(i,l),c=$e(a)!==e,h=c?null:Fi(t,a),g=c?null:At(t,a,n);d.push({date:a,day:Number(a.slice(8)),outside:c,off:h?h.title:null,lunch:g?.lunch??null,picked:g?.picked??!1,menu:c?null:dt(t,a)?.dish??null,sides:c?null:Tr(dt(t,a)?.details??""),past:a<s.today,today:a===s.today})}d.some(l=>!l.outside)&&r.push(d),i=lt(i,7)}return r}function Gi(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function qi(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function Yi(s,t,e,n=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=lt(t,i),d=At(s,r,n);if(!d)continue;let l=ye(t,r);return{lunch:d.lunch,when:l===0?"today":l===1?"tomorrow":oe(r),date:r,menu:dt(s,r)?.dish??null}}return null}var Er={timeline:"timeline",full:"timeline",compact:"compact"};function Pt(s){let t=new URLSearchParams(s),e={},n=Er[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((t.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((t.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}function ls(s,t=0){return s==null||!Number.isFinite(s)?t:s}function _r(s,t){let e=t.takes!=null&&t.planned!=null?t.planned+t.takes:t.end;if(t.attending===!1)return t.end;for(let n of s.rides)n.serves.includes(t.id)&&n.end!=null&&(e=Math.max(e,n.end));for(let n of Object.values(s.drivers))for(let o of n.segments)o.type==="home"||o.end==null||(o.serves===t.id||o.event===t.id)&&(e=Math.max(e,o.end));return e}function Cr(s,t){let e=[],n=[],o=()=>{let i=n[n.length-1];i&&ls(i.end)>t&&e.push(...n),n=[]};for(let i of s){if(i.start==null||i.end==null)continue;if(i.type==="home"||i.type==="stay"){o(),i.end>t&&e.push(i);continue}let r=n[n.length-1];r&&r.end!==i.start&&o(),n.push(i)}return o(),e}function Sr(s,t){let e=new Set(s.events.filter(i=>_r(s,i)<=t).map(i=>i.id)),n=i=>ls(s.rides[i??-1]?.end,-1)<=t,o=i=>i.type==="act"?e.has(i.event??""):n(i.ride);return{...s,events:s.events.filter(i=>!e.has(i.id)),kids:Object.fromEntries(Object.entries(s.kids).map(([i,r])=>[i,{...r,items:r.items.filter(d=>!o(d))}])),drivers:Object.fromEntries(Object.entries(s.drivers).map(([i,r])=>[i,{...r,segments:Cr(r.segments,t),outings:r.outings.filter(d=>d.start==null||ls(d.end,d.start)>t),busy:r.busy.filter(d=>d.end>t)}])),clashes:s.clashes.filter(i=>!o(i.a)&&!o(i.b)),issues:s.issues.filter(i=>!i.event||!e.has(i.event)),done:e.size,from:t}}function Xi(s,t){return{...s,whole_week:s.whole_week??s.days,days:s.days.filter(e=>e.date>=t.date).map(e=>e.date===t.date?Sr(e,t.minutes):e)}}var Zi=Ne`
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
`;var Io="mydashlight.rides.view",rl=1100,al=440,ll=700,dl=3*6e4,Lo=1200,cl=450,hl=110;function pl(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var wn=Z`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,Ro=Z`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,ul=new URL("emoji.json",import.meta.url).href,jo=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],Ss=Z`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,As=Z`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,fl=Z`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,gl=Z`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Lt={bring:"Bring",buy:"Buy"};function ml(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function Te(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function Ps(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function bl(s,t){return Yn(s,t)||ve(s).split(",")[0]}function vl(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function yl(){try{return localStorage.getItem(Io)==="timeline"?"timeline":"compact"}catch{return"compact"}}function xl(s){try{localStorage.setItem(Io,s)}catch{}}function Rt(s){return s.days.every(t=>!t.events.length)}var jt=class extends fe{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.leaveTimer=null;this.holdTimer=null;this.holdRepeat=null;this.held=!1;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Pt(location.search).view;this.urlPage=Pt(location.search).page;this.urlPast=Pt(location.search).past;this.urlDayPicker=Pt(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,i=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(i)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}this.onTouched(),n.el.scrollTop=n.top-i,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},dl))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.mode=this.urlView??yl(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.leaveTimer,this.railTimer])e&&clearTimeout(e);this.stopHold(),this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,d]=o.split("|"),l=e.kids.find(a=>a.id===r);(!l||(l.picks[d]??null)===i||!At(l,d))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&at(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(i=>i.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=Di(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<rl)return!1;let e=this.plan;return!e||this.width-al>=Kn(we(e).length,me(e).length)}today(){return kt(this.plan?.time_zone??pl())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let n=this.today(),o=`${n.date}|${n.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:Xi(e,n)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let i=this.board,r=this.boardPlan;this.board=Mi(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o,i&&r&&this.keepPlace(i,r,e)}return this.board}keepPlace(e,n,o){let i=this.scroller;if(!i||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||i.scrollTop<=0)return;let r=e.dayHeads.find(c=>c.date===this.pinDay)?.h??Ct,d=Gn(e,i.scrollTop+r+4),l=n.days[Math.floor(d/1440)]?.date,a=l?o.days.findIndex(c=>c.date===l):-1;a>=0&&(this.keepAt=a*1440+(d-Math.floor(d/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n,o=!1){let i=this.scroller;if(!i||!this.board)return;let r=this.topFor(e,n);Math.abs(i.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?i.scrollTo({top:r,behavior:"smooth"}):i.scrollTop=r),this.syncDay()}topFor(e,n){let o=this.board,i=o.dayHeads.find(r=>r.date===n)?.y??0;return Math.max(i,Ci(o,e)-ki(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let n=this.today(),o=Math.max(0,this.dayIndexOf(n.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(n.date)?n.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let n=this.nowSpot();n&&this.scrollToTime(n.t,n.date,e)}goToDay(e,n=!1){let o=this.boardPlan;if(!o)return;let i=this.today();if(e===i.date){this.scrollToNow(n);return}let r=this.dayIndexOf(e),d=o.days[r];if(!d)return;let l=1/0;if(this.mode==="timeline"){for(let a of d.events)l=Math.min(l,a.arrive_by??a.start);for(let a of Object.values(d.drivers))for(let c of a.outings)c.start!=null&&(l=Math.min(l,c.start))}this.scrollToTime(r*1440+(Number.isFinite(l)?Math.max(0,l-30):0),e,n)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let l of this.board.dayHeads)l.y<=n+1&&(o=l);this.pinDay!==o.date&&(this.pinDay=o.date);let i=null,r=this.nowSpot(),d=this.today().date;if(r){let l=n-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),a=l>0?"up":"down";this.board.dayHeads.some(c=>c.date===d)&&o.date!==d?i=`${a}|Today`:this.mode==="timeline"&&Math.abs(l)>e.clientHeight*.6&&(i=`${a}|${o.date===d?"Now":"Today"}`)}this.away!==i&&(this.away=i)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,o),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let d=new Map(this.choreDraft);d.delete(e.id),this.choreDraft=d;let l=r instanceof G?r:new G("error",String(r));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??at(e)}editMenu(e,n){let o=this.lunch?.kids??[],i=dt(e,n),r=o.filter(d=>d.id===e.id||i&&dt(d,n)?.dish===i.dish).map(d=>d.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let i=o instanceof G?o:new G("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let i=new Map(this.lunchDraft);for(let r of n)i.set(cn(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,n,o)}catch(r){let d=new Map(this.lunchDraft);for(let a of n)d.delete(cn(e,a));this.lunchDraft=d;let l=r instanceof G?r:new G("error",String(r));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?Hi(e):Ni(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(Do(),Mo))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||ns(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(Ui(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof G?n:new G("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof G?n:new G("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(i=>i.date===this.pinDay)?.h??Ct;this.keepAt=n&&this.board?Gn(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||xl(e)}findEvent(e){let n=this.plan?.days.find(i=>i.date===e.day),o=n?.events.find(i=>i.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.flushLeave(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.flushLeave(),this.sel=null,this.arriveDraft=void 0,this.leaveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(i){let r=i instanceof G?i:new G("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o,i){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&i.includes(e.drop)){i.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope,!1));return}this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e,n,o){if(!this.backend)return;let i=this.backend;if(n&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>i.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",n,()=>i.setStay(e.id,n,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,d=r.includes(n)?r.filter(l=>l!==n):[...r,n];this.save(`along-${o}`,d,()=>i.setTakeAlong(e.id,d,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,i;n<0?i=(o??e.start)-5:i=o==null||o+5>=e.start?null:o+5,this.arriveDraft=i,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Lo)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,d=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,d)).then(()=>{this.arriveDraft=void 0})}nudgeLeave(e,n){let o=this.leaveDraft!==void 0?this.leaveDraft:e.leave_by??null,i;o==null?i=n<0?Math.max(e.start+5,e.end-15):null:n<0?i=Math.max(e.start+5,o-5):i=o+5>=e.end?null:o+5,this.leaveDraft=i,this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=setTimeout(()=>this.flushLeave(),Lo)}clearLeave(){this.leaveDraft=null,this.flushLeave()}flushLeave(){this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=null;let e=this.leaveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||(o.event.leave_by??null)===e){this.leaveDraft=void 0;return}let i=this.backend,r=o.event.id,d=this.scope;this.save("leave",e,()=>i.setLeaveBy(r,e,d)).then(()=>{this.leaveDraft=void 0})}startHold(e){this.stopHold(),this.held=!1,this.holdTimer=setTimeout(()=>{this.held=!0,e(),this.holdRepeat=setInterval(e,hl)},cl)}stopHold(){this.holdTimer&&clearTimeout(this.holdTimer),this.holdRepeat&&clearInterval(this.holdRepeat),this.holdTimer=this.holdRepeat=null}tapStep(e){this.held?this.held=!1:e()}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=this.shownPlan(),i=o?Li(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,d=this.chores?Oi(this.chores,this.today().minutes).filter(g=>!this.choreDone(g)):[],l=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,a=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",c=p`<aside class="panel" aria-label=${a}>
      ${l??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,d))}
    </aside>`,h=this.page==="rides";return p`
      <div class="app ${r?"wide":this.width<ll?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,d.length)} ${h?this.renderBanner(e):w}
          <main>
            ${h?p`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?Rt(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                  ${n&&o&&!Rt(o)?this.renderDayRail(o):w}
                  ${n&&this.away?this.renderBackToToday(this.away):w}
                </section>`:this.page==="lunch"?p`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:p`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?p`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${c}`:w}
          </main>
        </div>
        ${r?c:w}
        ${this.toast?p`<div class="toast" role="status">${this.toast}</div>`:w}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let i=n.problems+o;this.tick;let r=this.today(),d="";if(e){let g=e.time_zone,b=new Date(e.updated);this.error?d=p`<span class="bad">${ai(this.error)} · showing the plan from ${qt(b,new Date,g)}</span>`:e.status&&!e.status.ok?d=p`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${qt(b,new Date,g)}</span>`:this.backend?.live||(d=`Updated ${qt(b,new Date,g)}`)}let l=(g,b,A,v)=>p`
      <button type="button" class="seg-btn" title=${v} aria-pressed=${this.mode===g?"true":"false"} @click=${()=>this.setMode(g)}>
        ${A}<span class="seg-label">${b}</span>
      </button>
    `,a=(g,b,A)=>p`
      <button type="button" class="seg-btn" aria-pressed=${this.page===g?"true":"false"} @click=${()=>this.setPage(g)}>
        ${A}<span class="seg-label">${b}</span>
      </button>
    `,c=Ie(r.minutes),h=!!e&&Rt(e);return p`
      <header>
        ${this.showMenu?p`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${Z`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:w}
        <div class="titles">
          <h1 class="clock" aria-label=${`${ve(r.date)}, ${c}`}>
            <span class="hm">${c.slice(0,-3)}</span><span class="ampm">${c.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${ve(r.date)}${typeof d=="string"&&d?p`<span class="status"> · ${d}</span>`:w}
          </p>
          ${d&&typeof d!="string"?p`<p class="status">${d}</p>`:w}
        </div>
        ${e&&!h?this.renderNext(e,ji(e,r),n):w}
        <div class="controls">
          ${this.wide||h&&!o?w:p`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?w:p`<div role="group" aria-label="View" class="seg">
            ${l("timeline","Timeline",Z`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${l("compact","Compact",Z`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${a("rides","Rides",Z`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${a("chores","Chores",Z`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?w:a("lunch","Lunch",Z`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let a=this.today().date,c=o.unassigned,h=o.laterUnassigned;if(c){let b=p`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${c} ${c===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?p`<div class="next idle needs">${b}</div>`:p`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${b}</button>`}if(h)return p`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${h} ${h===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let g=e.days.some(b=>b.date>=a&&b.events.length);return p`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${g?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${g?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let i;n.ongoing?i="On the road now":n.ahead===0?i=n.inMinutes<180?`Next trip · in ${Tt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${oe(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,d=p`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Te(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(a=>p`<span class="kid-dot" style="background:${a.color}"></span>`)}</span>
        ${n.warn?p`<span class="next-stop warn">${n.warn}</span>`:n.stop?p`<span class="next-stop">${n.stop}</span>`:w}
      </span>
    `,l=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?p`<button type="button" class=${l} @click=${()=>this.open(n.target)}>${d}</button>`:p`<div class=${l}>${d}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return w;let n=this.today().date,o=pe(e),i=this.railShown;return p`<div
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
        ${e.days.map(r=>{let d=qn(r),l=r.events.length,a=r.events.slice(0,4).map(h=>h.own?St.color:o.get(h.kid)?.color??J(0).color),c=`${ve(r.date)}: ${l?`${l} ${l===1?"activity":"activities"}`:"nothing planned"}${d?`, ${d} to sort out`:""}`;return p`<button
            type="button"
            class="rail-day ${r.date===n?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${c}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===n?"Today":oe(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${a.length?a.map(h=>p`<span class="rd-dot" style="background:${h}"></span>`):p`<span class="rd-free">free</span>`}
            </span>
            ${d?p`<span class="rd-badge" aria-hidden="true">${d}</span>`:w}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[n,o]=e.split("|");return p`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${Z`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${n==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let n=we(e),o=me(e),i=pe(e),r=n.map(d=>re(e,d));return p`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((d,l)=>Z`<circle cx=${50+l*30} cy="80" r="11" fill=${i.get(d).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${vl(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(d=>{let l=i.get(d);return p`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${Te(re(e,d))}</span>
            <span class="qw-name">${re(e,d)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(d=>p`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Te(ne(e,d))}</span>
            <span class="qw-name">${ne(e,d)}</span>
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
    </div>`}renderBanner(e){if(e?.needs_setup==="events_calendar")return p`<div class="notice-bar" role="status">
        Pick your family calendar to see the week: in Home Assistant, open Settings &gt; Devices &amp; services &gt; MyDashLight &gt;
        Configure &gt; Calendars.
      </div>`;let n=e?.unavailable_calendars.length??0;return n?p`<div class="notice-bar" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:w}renderEmpty(){return this.error?p`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:p`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderHead(e,n=!1){return p`<div class="dh-line">
        <button
          type="button"
          class="dh-jump"
          tabindex=${n?-1:0}
          aria-label=${`${e.label}: go to this day`}
          @click=${()=>this.tapHead(e.date)}
        >
          <span class="label">${e.label}</span>${e.tag?p`<span class="tag">${e.tag}</span>`:w}
        </button>
        <span class="sub ${e.warn?"warn":""}">${e.sub}</span>
      </div>
      ${e.allDay.length?p`<div class="day-strip" style="padding-left:${rt}px">
            ${e.allDay.map(o=>p`<span
                  class="strip-chip ${o.warn?"warn":""} ${o.cancelled?"skipped":""} ${o.color?"":"plain"}"
                  style=${o.color?`--c:${o.color.color};--rgb:${o.color.rgb};--ink:${o.color.ink}`:""}
                  ><span class="strip-title">${o.title}</span>${o.note?p`<span class="strip-note">${o.note}</span>`:w}</span
                >`)}
          </div>`:w}`}renderBoard(e){let n=this.sel,o=a=>!!a&&!!n&&a.day===n.day&&a.event===n.event,i=e.dayHeads.find(a=>a.date===this.pinDay)??e.dayHeads[0],r=e.width,d=100,l=[...e.links.map(a=>({t:"link",x:a,z:a.layer??0})),...e.preps.map(a=>({t:"prep",x:a,z:a.layer??d-1})),...e.cards.map(a=>({t:"card",x:a,z:a.layer??d})),...e.rides.map(a=>({t:"ride",x:a,z:a.layer??d+1}))].sort((a,c)=>a.z-c.z);return p`
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
          ${e.columns.map(a=>p`<div class="col-head ${a.kind}" style="left:${a.x}px;width:${a.w}px;--c:${a.dot};--rgb:${a.rgb}">
              <span class="avatar ${a.kind}" aria-hidden="true">${Te(a.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${a.name}</span>${a.kind==="kid"?this.renderLunchChip(a.id,!0,a.w-58-a.name.length*10.6):w}</span>
                <span class="sub ${a.subWarn?"warn":""}">${a.sub}</span>
              </span>
            </div>`)}
        </div>
        ${i?p`<div class="pinned" aria-hidden="true" style="width:${r}px;height:${i.h}px;margin-bottom:${-i.h}px">
              ${this.renderHead(i,!0)}
            </div>`:w}
        <div class="canvas" style="width:${r}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(a=>p`<div
                class="col-bg ${a.kind}"
                style="left:${a.x}px;width:${a.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${a.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(a=>p`<div class="day-head" style="top:${a.y}px;width:${r}px;height:${a.h}px">${this.renderHead(a)}</div>`)}
          ${e.empties.map(a=>p`<span class="empty" style="top:${a.y}px">${a.text}</span>`)}
          ${e.grid.map(a=>p`<div class="grid ${a.strong?"strong":""}" style="top:${a.y}px;width:${r-60}px"></div>`)}
          ${e.hours.map(a=>p`<span class="hour" style="top:${a.y}px">${a.label}</span>`)}
          ${Pe(e.bands,a=>a.key,a=>p`<div
                class="band"
                aria-hidden="true"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;background:rgba(${a.color.rgb},0.10);border-color:rgba(${a.color.rgb},0.45)"
              ></div>`)}
          ${Pe(e.busy,a=>a.key,a=>p`<div class="busy" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span style="top:${a.labelY}px">${a.label}</span>
              </div>`)}
          ${Pe(e.windows,a=>a.key,a=>p`<div class="window" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span>${a.label}</span>
              </div>`)}
          ${Pe(l,a=>a.x.key,a=>{if(a.t==="link"){let b=a.x;return p`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-color:${b.color.color};background:linear-gradient(rgba(${b.color.rgb},0.11), rgba(${b.color.rgb},0.11)), var(--surface)"
                ></div>`}if(a.t==="prep"){let b=a.x;return p`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-color:${b.color.color};background:linear-gradient(rgba(${b.color.rgb},0.11), rgba(${b.color.rgb},0.11)), var(--surface);color:${b.color.ink}"
                >
                  ${b.label}
                </div>`}if(a.t==="ride"){let b=a.x;return p`<button
                  type="button"
                  class="ride ${b.dashed?"dashed":""} ${b.clash?"clash":""}"
                  aria-label=${b.aria}
                  style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;padding-top:${3+(b.tuckTop??0)}px;padding-bottom:${3+(b.tuckBottom??0)}px"
                  @click=${()=>this.open(b.target)}
                >
                  <span class="l1">${b.l1}</span>${b.show2?p`<span class="l2" style="-webkit-line-clamp:${b.lines2}">${b.l2}</span>`:w}
                </button>`}let c=a.x,h=c.color,g=c.skipped?`repeating-linear-gradient(135deg, rgba(${h.rgb},0.10) 0px, rgba(${h.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:c.stayed?`repeating-linear-gradient(135deg, rgba(${h.rgb},0.24) 0px, rgba(${h.rgb},0.24) 6px, rgba(${h.rgb},0.08) 6px, rgba(${h.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${h.rgb},0.15), rgba(${h.rgb},0.15)), var(--surface)`;return p`<button
                type="button"
                class="card ${c.wrap?"wrap":""} ${o(c.target)?"sel":""} ${c.clash?"clash":""} ${c.skipped?"skipped":""} ${c.cut?"cut":""}"
                aria-label=${c.aria}
                style="left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px;background:${g};border-color:${c.clash?"var(--bad)":`rgba(${h.rgb},0.45)`};--c:${h.color};--rgb:${h.rgb};--ring:${h.color}"
                @click=${()=>this.open(c.target)}
              >
                <span class="top">
                  <span class="title">${c.title}</span>
                  <span class="time">${c.time}</span>
                  ${c.showDrop&&c.drop?p`<span class="line tone-${c.drop.tone}">${c.drop.text}</span>`:w}
                </span>
                ${c.showPick&&c.pick?p`<span class="line tone-${c.pick.tone}">${c.pick.text}</span>`:w}
              </button>`})}
          ${Pe(e.stays,a=>a.key,a=>p`<button
                type="button"
                class="stay ${a.cut?"cut":""}"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;border-color:${a.color.color};background:repeating-linear-gradient(135deg, rgba(${a.color.rgb},0.28) 0px, rgba(${a.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1" style="color:${a.color.ink}">${a.l1}</span><span class="l2">${a.l2}</span>
              </button>`)}
          ${Pe(e.trips,a=>a.key,a=>p`<button
                type="button"
                class="trip ${a.bad?"bad":""} ${a.stops?"list":""}"
                aria-label=${a.aria}
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1">${a.l1}${a.kids.map(c=>p`<span class="kid-dot" style="background:${c}"></span>`)}</span>
                ${a.show2?p`<span class="l2">${a.l2}</span>`:w}
                ${a.stops?a.stops.map(c=>p`<span class="stop ${c.warn?"warn":""}">${c.text}</span>`):w}
                ${a.show3?p`<span class="l3">${a.l3}</span>`:w}
              </button>`)}
          ${Pe(e.overlaps,a=>a.key,a=>p`<div class="overlap" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"></div>`)}
          ${Pe(e.marks,a=>a.key,a=>p`<span class="mark" style="left:${a.x}px;top:${a.y}px;${a.right?"transform:translateX(-100%)":""}">${a.text}</span>`)}
          ${e.now?p`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${r-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:w}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:i,later:r}=e,d=this.plan,l=i+n.length,a=this.chores,c=!!a&&!Qn(a);return p`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${l?"bad":"ok"}">${l}</span>
        ${this.wide?w:p`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${c?p`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?p`<div class="attn-chores">${n.map(h=>this.renderChoreRow(h,!0))}</div>`:p`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:p`<p class="panel-sub">Rides in the next two days</p>`}
      ${d&&!i?p`<div class="all-clear">
            <span class="check" aria-hidden="true">${Z`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Rt(d)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:w}
      ${o.map(h=>p`<div class="issue ${h.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${h.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${h.target?p`<button type="button" class="issue-title" @click=${()=>this.open(h.target,!0)}>${h.title}</button>`:p`<strong class="issue-title">${h.title}</strong>`}
              <span class="issue-body"
                >${h.parts?h.parts.map(g=>typeof g=="string"?g:p`<button type="button" class="issue-link" @click=${()=>this.open(g.target,!0)}>${g.text}</button>`):h.body}</span
              >
            </div>
          </div>
          ${h.suggestions.length?p`<div class="fixes">
                ${h.suggestions.map(g=>p`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(g.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${g.id}`?"Saving…":g.label}</span>
                    <span class="fix-note">${g.note}</span>
                  </button>`)}
              </div>`:w}
        </div>`)}
      ${this.wide&&d&&!Rt(d)&&this.page==="rides"?this.renderLegend():w}
    `}kidColorOf(e){let n=this.plan?pe(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return J(Math.max(0,o))}renderLunchChip(e,n=!1,o=1/0){let i=this.lunch,r=i?.kids.find(h=>h.id===e);if(!i||!r)return w;this.tick;let d=this.today(),l=Yi(r,d.date,d.minutes,this.lunchDraft);if(!l)return w;let a=Lt[l.lunch],c=`${a} lunch ${l.when}${l.menu?`: ${l.menu}`:""}`;return n&&o<36+a.length*7.4?p`<span class="lunch-chip ${l.lunch} small icon" role="img" aria-label=${c} title=${c}
        >${l.lunch==="bring"?Ss:As}</span
      >`:p`<span class="lunch-chip ${l.lunch} ${n?"small":""}" title=${c}
      >${l.lunch==="bring"?Ss:As}<span class="lunch-chip-text"
        >${a}${n?w:` ${l.when}`}${!n&&l.menu?p`<span class="lunch-chip-menu"> · ${l.menu}</span>`:w}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return p`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=Ki(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:$e(e.today),i=n.indexOf(o),r=c=>{let h=n[i+c];h&&(this.lunchMonth=h)},d=e.kids.some(c=>c.id===this.lunchKid)?this.lunchKid:null,l=d?e.kids.filter(c=>c.id===d):e.kids,a=e.status&&!e.status.ok?p`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:w;return p`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${Z`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${pn(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${i<0||i>=n.length-1} @click=${()=>r(1)}>
            ${Z`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":p`${Ro} Edit menus`}
        </button>
      </div>
      ${a}
      <div class="chore-cols lunch-cols ${d?"wide":""}" style="--n:${l.length}">
        ${l.map(c=>this.renderLunchCard(e,c,o,d!==null))}
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
    </div>`}renderLunchCard(e,n,o,i){let r=this.kidColorOf(n.id),d=Vi(e,n,o,this.lunchDraft),l=qi(d),a=d.flat(),c=a.filter(v=>!v.outside&&!v.past&&v.lunch),h=n.days_off.filter(v=>$e(v.first)<=o&&o<=$e(v.last)),g=v=>c.filter($=>hn($.date)===v),b=v=>{let $=g(v);if(!$.length)return;let _=$.every(u=>u.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,$.map(u=>u.date),_)},A=c.length?`${l.bring} Bring · ${l.buy} Buy${o===$e(e.today)?" left this month":""}`:"No school days left this month";return p`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Te(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${A}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Lt[n.default]} unless picked</span>
          ${e.kids.length<2?w:p`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:n.id}
              >
                ${i?gl:fl}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?p`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:w}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${pn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((v,$)=>p`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!g($).length}
            aria-label=${`${g($).every(_=>_.lunch==="bring")?"Buy":"Bring"} every ${v} left in ${pn(o)} for ${n.name}`}
            @click=${()=>b($)}
          >
            ${v}
          </button>`)}
        ${a.map(v=>this.renderLunchCell(n,v,i))}
      </div>
      ${h.length?p`<p class="lunch-offs">
            No school:
            ${h.map(v=>{let $=v.first<`${o}-01`?`${o}-01`:v.first,_=$e(v.last)>o?lt(`${as(o)}-01`,-1):v.last;return`${$===_?Ps($):`${Ps($)}–${Ps(_)}`} ${Gi(v.title)}`}).join(" · ")}
          </p>`:w}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return p`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return p`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=n.lunch,r=i==="buy"?"bring":"buy",d=n.menu?`, ${n.menu}`:"",l=this.menuMode,a=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),c=l?`${e.name}, ${ve(n.date)}${d||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${ve(n.date)}: ${Lt[i]}${n.picked?"":" (not picked yet)"}${d}. Tap to ${Lt[r]}.`;return p`<button
      type="button"
      class="lunch-day ${i} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${l?"editing":""} ${a?"sel":""}"
      ?disabled=${n.past&&!l}
      aria-label=${c}
      @click=${()=>l?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${i==="bring"?Ss:As}${Lt[i]}</span>
      ${n.menu?p`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?p`<span class="lunch-sides">${n.sides}</span>`:w}`:l?p`<span class="lunch-menu add">${wn} Menu</span>`:w}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex(_=>_.id===e.kid),d=(this.plan?pe(this.plan).get(e.kid):void 0)??J(Math.max(0,r)),l=o.kids[r]?.name??"",a=i===at(e)?e:{...e,state:i?"done":"open",done_at:i?new Date().toISOString():null},c=i&&a.done_by&&a.done_by!==e.kid?o.people?.find(_=>_.id===a.done_by)?.name??a.done_by_name??null:null,h=`${Jn(a,o.today,o.time_zone)}${c?` · by ${c}`:""}`,g=i||zi(e),b=`${n?`${l}: `:""}${e.title}. ${h?`${h}. `:""}${i?"Done. Tap to undo.":"Tap when it’s done."}`,A=p`<span class="box" aria-hidden="true"
        >${i?Z`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:w}</span
      >
      ${e.icon?p`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:w}
      <span class="chore-text">
        <span class="chore-title">${n?p`<span class="chore-kid">${l}</span> · `:w}${e.title}</span>
        ${h?p`<span class="chore-note">${h}</span>`:w}
      </span>`,v=`chore ${i?"done":""} ${e.state==="overdue"&&!i?"overdue":""} ${g?"":"later"}`,$=`--c:${d.color};--rgb:${d.rgb};--k:${d.ink}`;return g?p`<button type="button" class=${v} style=${$} aria-pressed=${i?"true":"false"} aria-label=${b} @click=${()=>this.tapChore(e)}>
          ${A}
        </button>`:p`<div class=${v} style=${$}>${A}</div>`}renderChores(){let e=this.chores;if(e===void 0)return p`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return p`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return p`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(Qn(e))return p`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${wn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?p`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:w;this.tick;let i=Bi(e,this.plan?pe(this.plan):void 0,this.today().minutes);return p`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${wn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${Ro} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${i.length}">
        ${i.map(r=>{let d=r.overdue.filter(l=>!this.choreDone(l)).length+r.now.filter(l=>!this.choreDone(l)).length;return p`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Te(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${d?`${d} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?p`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(l=>this.renderChoreRow(l))}`:w}
            ${r.now.length?p`<h3 class="chore-group">To do</h3>
                  ${r.now.map(l=>this.renderChoreRow(l))}`:w}
            ${r.done.length?p`<h3 class="chore-group">Done</h3>
                  ${r.done.map(l=>this.renderChoreRow(l))}`:w}
            ${r.later.map(l=>p`<h3 class="chore-group">${l.date===e.today?"Later today":bl(l.date,e.today)}</h3>
                ${l.chores.map(a=>this.renderChoreRow(a))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?p`<p class="chore-none">No chores this week.</p>`:w}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,i=this.plan?pe(this.plan):void 0,r=this.choreEdit?.template===e.id,d=e.problems.length?p`<span class="tmpl-note bad">${e.problems.map(rs).join(" · ")} · tap to set up</span>`:p`<span class="tmpl-note">${os(e.who,o,e.take_turns)} · ${is(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return p`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?p` <span class="tag-paused">Paused</span>`:w}</span>
        ${d}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(l=>{let a=o.findIndex(h=>h.id===l),c=i?.get(l)??J(Math.max(0,a));return p`<span class="kid-dot" style="background:${c.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return p`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${wn} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([o,i])=>{let r=e.templates.filter(d=>d.repeats===o);return r.length?p`<section class="manage-group" aria-label=${i}>
                  <h3 class="chore-group">${i}</h3>
                  <div class="tmpl-list">${r.map(d=>this.renderTemplateRow(d))}</div>
                </section>`:w}):p`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return p``;let o=n.kids,i=this.plan?pe(this.plan):void 0,r=this.choreBusy,d=e.template?n.templates.find(v=>v.id===e.template):void 0,l=ns(e),a=(d?.problems??[]).filter(v=>v!=="who:"),c=(v,$,_,u=!1)=>p`<button type="button" class="choice ${u?"wide":""}" aria-pressed=${v?"true":"false"} ?disabled=${r} @click=${_}>${$}</button>`,h=(v,$,_,u)=>p`<button type="button" class="chip" aria-pressed=${v?"true":"false"} aria-label=${u??w} ?disabled=${r} @click=${_}>${$}</button>`,g=v=>{v!==e.repeats&&this.changeDraft({repeats:v,days:d&&d.repeats===v?d.days??dn(v):dn(v)})},b=v=>{let $=e.who.includes(v)?e.who.filter(_=>_!==v):o.filter(_=>_.id===v||e.who.includes(_.id)).map(_=>_.id);this.changeDraft({who:$})},A;if(e.repeats==="school"){let v=e.days===Ye?new Set:e.days===""?new Set([0,1,2,3,4]):es(e.days)??new Set,$=_=>{let u=new Set(v);u.has(_)?u.delete(_):u.add(_),this.changeDraft({days:u.size===5?"":u.size?ts(u):Ye})};A=p`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${qe.slice(0,5).map((_,u)=>h(v.has(u),_.slice(0,2),()=>$(u),_))}
          </div>
          <p class="field-hint">Weekdays with no “No School” event on the kid’s calendar.</p>
        </div>
        <div class="field">
          <span class="field-label">When</span>
          <div role="group" aria-label="When" class="choices" style="grid-template-columns:1fr 1fr">
            ${c(!e.night_before,"That morning",()=>this.changeDraft({night_before:!1}))}
            ${c(e.night_before,"The night before",()=>this.changeDraft({night_before:!0}))}
          </div>
          <p class="field-hint">${e.night_before?"Due the evening before each school day: Sunday for Monday.":"Due on the school day itself."}</p>
        </div>
        <div class="field">
          ${c(e.bring_only,e.bring_only?"Only on Bring lunch days":"Every school day, Bring or Buy",()=>this.changeDraft({bring_only:!e.bring_only}),!0)}
          <p class="field-hint">${e.bring_only?"Made only when the kid brings lunch, like Pack lunch.":"Tap to make it only on Bring lunch days, like Pack lunch."}</p>
        </div>`}else if(e.repeats==="monthly"){let v=e.days.trim(),$=/^\d+$/.test(v)?Number(v):null,_=v&&v.toLowerCase()!=="any"&&v.toLowerCase()!=="last"&&$===null;A=p`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${_?4:3}, minmax(0, 1fr))">
          ${c(v===""||v.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${c($!==null,"On a date",()=>this.changeDraft({days:String($??1)}))}
          ${c(v.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${_?c(!0,v,()=>{}):w}
        </div>
        ${$!==null?p`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||$<=1} @click=${()=>this.changeDraft({days:String($-1)})}>−</button>
                <span class="arrive-value">${ss($)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||$>=31} @click=${()=>this.changeDraft({days:String($+1)})}>+</button>
              </span>
            </div>`:p`<p class="field-hint">${v.toLowerCase()==="last"?"Due on the month’s last day.":_?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")A=p`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let v=e.days===""||e.days.toLowerCase()==="any",$=e.days===Ye?new Set:v?new Set:es(e.days)??new Set,_=u=>{let M=new Set($);M.has(u)?M.delete(u):M.add(u),this.changeDraft({days:M.size?ts(M)||"Mon-Sun":Ye})};A=p`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${c(v,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${c(!v,"On set days",()=>this.changeDraft({days:v?"Sat":e.days}))}
        </div>
        ${v?p`<p class="field-hint">Shows all week, due on Sunday.</p>`:p`<div role="group" aria-label="Days of the week" class="day-chips">
                ${qe.map((u,M)=>h($.has(M),u.slice(0,2),()=>_(M),u))}
              </div>
              <div class="chips">
                ${h(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${h(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:w}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?os(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===Ye?"No days picked":is(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${a.length?p`<p class="field-hint bad">${a.map(rs).join(". ")}. Saving fixes it.</p>`:w}
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
          ${jo.map(v=>h(e.icon===v,v,()=>this.changeDraft({icon:e.icon===v?null:v}),`Picture ${v}`))}
          ${e.icon&&!jo.includes(e.icon)?h(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):w}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?p`<emoji-picker
              class="emoji-more"
              .dataSource=${ul}
              @emoji-click=${v=>{let $=v.detail.unicode;$&&this.changeDraft({icon:$}),this.iconMore=!1}}
            ></emoji-picker>`:w}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((v,$)=>{let _=i?.get(v.id)??J($),u=e.who.includes(v.id);return p`<button type="button" class="who-chip" style="--c:${_.color};--rgb:${_.rgb}" aria-pressed=${u?"true":"false"} ?disabled=${r} @click=${()=>b(v.id)}>
              <span class="avatar" aria-hidden="true">${Te(v.name)}</span>${v.name}
            </button>`})}
        </div>
        ${e.who.length>1?p`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${c(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${c(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:w}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${c(e.repeats==="daily","Every day",()=>g("daily"))}
          ${c(e.repeats==="weekly","Every week",()=>g("weekly"))}
          ${c(e.repeats==="monthly","Every month",()=>g("monthly"))}
          ${c(e.repeats==="school","School days",()=>g("school"))}
        </div>
      </div>
      ${A}
      ${e.repeats==="school"?w:p`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${ml(e.repeats,e.every)}</span>
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
      ${e.template?p`<div class="field">
              ${c(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${r} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:w}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!l} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":l?l.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return p``;let o=e.busy,i=c=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...c})},r=c=>i({kids:e.kids.includes(c)?e.kids.filter(h=>h!==c):[...e.kids,c]}),d=n.kids.filter(c=>At(c,e.date)),l=e.dish.trim(),a=e.kids.length?l?null:"Type what’s served":"Pick who gets this menu";return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${ve(e.date)}</span>
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
          @input=${c=>i({dish:c.target.value})}
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
          @input=${c=>i({details:c.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${d.map(c=>{let h=this.kidColorOf(c.id),g=e.kids.includes(c.id);return p`<button type="button" class="who-chip" style="--c:${h.color};--rgb:${h.rgb}" aria-pressed=${g?"true":"false"} ?disabled=${o} @click=${()=>r(c.id)}>
              <span class="avatar" aria-hidden="true">${Te(c.name)}</span>${c.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${l||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?p`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:w}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!a} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":a??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return p``;let o=n.people?.length?n.people:n.kids.map(h=>({...h,role:"kid"})),i=n.kids.findIndex(h=>h.id===e.kid),r=n.kids[i],d=this.plan?pe(this.plan):void 0,l=d?.get(e.kid)??J(Math.max(0,i)),a=o.filter(h=>h.id!==e.kid),c=h=>{let g=n.kids.findIndex(b=>b.id===h.id);return g>=0?(d?.get(h.id)??J(g)).color:"var(--dark)"};return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:w}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${Jn(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${l.color};--rgb:${l.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${Te(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?p`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${a.map(h=>p`<button type="button" class="done-by" style="--c:${c(h)}" @click=${()=>void this.toggleChore(e,h.id)}>
                  <span class="avatar ${h.role==="parent"?"driver":""}" aria-hidden="true">${Te(h.name)}</span>
                  <span>${h.name}</span>
                </button>`)}
            </div>`:p`<button type="button" class="choice wide" @click=${()=>this.whoOthers=!0}>Someone else did</button>`}
      </div>
    `}renderLegend(){return p`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}ownHint(e,n){let o=an(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${j(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${j(n.start)} to ${j(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=n.along.map(r=>me(e).includes(r)?ne(e,r):re(e,r));return`${o} drives there and back${i.length?`, with ${ln(i)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return p``;let{day:o,event:i}=n,r=me(e),d=_i(e,i),l=an(e,i),a=!!this.pending,c=x=>this.pending?.key===x?this.pending.value:void 0,h=[...e.people?.carpools??[]];for(let x of e.days)for(let m of x.events)for(let y of[m.drop,m.pick])y&&y!=="none"&&!r.includes(y)&&!h.some(k=>k.toLowerCase()===y.toLowerCase())&&h.push(y);let g=x=>{if(!i.sides.includes(x))return w;let m=c(x)??c("both"),y=x==="drop"?i.drop:i.pick,k=m!==void 0?String(m):i.no_ride_unless_named&&y==="none"?"":y,T=k===""&&!(m===void 0&&i.no_ride_unless_named),I=k&&k!=="none"&&!r.includes(k)?k:"",E=B=>{this.otherOpen=null,this.setRide(i,x,k===B?"":B,r)},L=[...r.map(B=>[B,Vn(e,B)]),["none","Not needed"]],K=`${i.id}|${x}`,te=this.otherOpen===K;return p`<div class="field ride-box">
        <span class="field-label">${x==="drop"?"Drop-off":"Pick-up"} ${T?p`<span class="nobody">· nobody yet</span>`:w}</span>
        <div role="group" aria-label=${x==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${L.length+1}, minmax(0, 1fr))">
          ${L.map(([B,ue])=>p`<button type="button" class="choice" aria-pressed=${k===B?"true":"false"} ?disabled=${a} @click=${()=>E(B)}>
                ${ue}
              </button>`)}
          <button
            type="button"
            class="choice"
            aria-pressed=${I?"true":"false"}
            aria-expanded=${te?"true":"false"}
            ?disabled=${a}
            @click=${()=>this.otherOpen=te?null:K}
          >
            ${I||"Other"}
          </button>
        </div>
        ${te?p`${h.length?p`<div role="group" aria-label=${x==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${h.map(B=>p`<button type="button" class="chip" aria-pressed=${k.toLowerCase()===B.toLowerCase()?"true":"false"} ?disabled=${a} @click=${()=>E(B)}>
                    ${B}
                  </button>`)}
            </div>`:w}
        <input
          type="text"
          .value=${I&&!h.some(B=>B.toLowerCase()===I.toLowerCase())?I:""}
          ?disabled=${a}
          aria-label=${x==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${B=>{let ue=B.target.value.trim();ue&&ue!==k&&E(ue)}}
          @keydown=${B=>{B.key==="Enter"&&B.target.blur()}}
        />`:w}
        ${!_&&k!==""&&k!=="none"?b(x,k):w}
      </div>`},b=(x,m)=>{let y=c(`along-${x}`),k=y!==void 0?y:x==="pick"?i.pick_along??[]:i.along,T=new Set(o.events.filter(L=>L.event_id===i.event_id&&!L.own).map(L=>L.kid)),I=[...we(e).filter(L=>L!==i.kid&&!T.has(L)),...r.filter(L=>L!==m)];return I.length?p`<div class="field-sub">
        <span class="field-label">${x==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${x==="pick"?"Coming home too. Anyone already there just gets in.":x==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${x==="drop"?"Riding along on the drop-off":x==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${I.map(L=>p`<button type="button" class="chip" aria-pressed=${k.includes(L)?"true":"false"} ?disabled=${a} @click=${()=>this.toggleAlong(i,L,x)}>
              ${r.includes(L)?ne(e,L):re(e,L)}
            </button>`)}
        </div>
      </div>`:w},A=r.includes(i.drop)?i.drop:r.includes(i.pick)?i.pick:"",v=i.drop===i.pick&&r.includes(i.drop),$=c("stay"),_=$!==void 0?!!$:i.stay&&v,u=c("along"),M=u!==void 0?u:i.along,R=i.own?[...we(e),...r.filter(x=>x!==i.own)]:[],U=i.own!=null&&i.takes!=null,Q=i.own!=null&&!U,ae=c("takes"),H=ae!==void 0?ae:i.takes??null,De=c("arrive"),le=this.arriveDraft!==void 0?this.arriveDraft:De!==void 0?De:i.arrive_by,et=c("leave"),de=this.leaveDraft!==void 0?this.leaveDraft:et!==void 0?et:i.leave_by??null,Le=(x,m)=>{let y=x==="arrive",k=I=>()=>y?this.nudgeArrive(i,I):this.nudgeLeave(i,I),T=(I,E,L,K)=>p`<button
          type="button"
          class="step"
          aria-label=${E}
          ?disabled=${a||K}
          @pointerdown=${()=>this.startHold(k(I))}
          @pointerup=${()=>this.stopHold()}
          @pointerleave=${()=>this.stopHold()}
          @pointercancel=${()=>this.stopHold()}
          @click=${()=>this.tapStep(k(I))}
        >
          ${L}
        </button>`;return p`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">${y?"Arrive by":"Leave by"}</span>
          <span class="field-hint">${y?`${i.start-m} min before it starts`:`${i.end-m} min before it ends`}</span>
        </span>
        <span class="stepper">
          ${T(-5,"Five minutes earlier","−",!y&&m-5<=i.start)}
          <span class="arrive-value">${j(m)}</span>
          ${T(5,"Five minutes later","+",!1)}
          <button
            type="button"
            class="step clear-time"
            aria-label=${y?"Clear arrive-by time":"Clear leave-by time"}
            ?disabled=${a}
            @click=${()=>y?this.clearArrive():this.clearLeave()}
          >
            ×
          </button>
        </span>
      </div>`},ge=i.sides.includes("pick")||i.own!=null,tt=()=>p`${le!=null?Le("arrive",le):w}
      ${de!=null?Le("leave",de):w}
      ${le==null||de==null&&ge?p`<div class="field time-chips">
            <div role="group" aria-label="Times" class="chips">
              ${le==null?p`<button type="button" class="chip" ?disabled=${a} @click=${()=>this.nudgeArrive(i,-5)}>Arrive early</button>`:w}
              ${de==null&&ge?p`<button type="button" class="chip" ?disabled=${a} @click=${()=>this.nudgeLeave(i,-5)}>Leave early</button>`:w}
            </div>
          </div>`:w}`,Be=i.sides.includes("drop")&&i.sides.includes("pick"),Re=Be&&(_||this.stayDraft===i.id),je=()=>{let x=Be?p`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${Re?"false":"true"}
              ?disabled=${a}
              @click=${()=>{this.stayDraft=null,i.stay&&this.toggleStay(i,!1,A)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${Re?"true":"false"}
              ?disabled=${a}
              @click=${()=>{A?this.toggleStay(i,!0,A):this.stayDraft=i.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:w;if(!Re)return p`${x} ${g("drop")} ${g("pick")}`;let m=_&&v?i.drop:"";return p`${x}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${m?w:p`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(y=>p`<button
                type="button"
                class="choice"
                aria-pressed=${m===y?"true":"false"}
                ?disabled=${a}
                @click=${()=>{if(m===y||!this.backend)return;let k=this.backend;this.stayDraft=null,this.save("stay",!0,()=>k.setRide(i.id,"both",y,this.scope,!0))}}
              >
                ${ne(e,y)}
              </button>`)}
          </div>
          ${m?b("both",m):w}
        </div>`},ee=[],q=x=>x==="none"?"Not needed":Vn(e,x),ce=x=>r.includes(x)?ne(e,x):re(e,x),se=(x,m,y)=>{m===""&&!y.length||ee.push(`${x}: ${[m===""?"TBD":q(m),...y.map(ce)].join(", ")}`)},Ee=x=>i.no_ride_unless_named&&x==="none"?"":x;i.own||se("Drop-off",Ee(i.drop),i.along),i.own||se("Pick-up",Ee(i.pick),i.pick_along??[]),!i.own&&i.stay&&ee.push("Stay: yes"),U&&ee.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&ee.push(`Take along: ${i.along.map(ce).join(", ")}`),i.arrive_by!=null&&ee.push(`Arrive by: ${Ie(i.arrive_by)}`),i.leave_by!=null&&ee.push(`Leave by: ${Ie(i.leave_by)}`);let Oe=c("attending"),ie=Oe!==void 0?!!Oe:i.attending!==!1;i.attending===!1&&ee.splice(0,ee.length,"Attending: no");let f=o.date===this.today().date?"":`${oe(o.date)} · `,P=rn(i),D=p`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${d.color}"></span>${l} · ${i.title}</span>
          <span class="ed-meta">${f}${U?"any time ":""}${P}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;if(i.busy_only){let x=i.place_name&&i.place_name!==i.title?i.place_name:"",m=i.busy_why==="days"?"It runs over more than a day, so no drive is planned for it.":i.busy_why==="home"?"It’s at home, so no drive is planned for it.":"It has no address, so no drive is planned for it.";return p`${D}
        ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:w}
        ${x?p`<div class="field"><span class="field-label">Where</span><span class="field-hint">${x}</span></div>`:w}
        <p class="field-hint">
          ${ie?`This blocks ${l}’s time: ${l} can’t drive then, so a ride that needs ${l} shows as a problem.`:`Not going, so it doesn’t block ${l}’s time, and ${l} can drive then.`}
          ${m}
        </p>
        <button type="button" class="chip clear" ?disabled=${a} @click=${()=>this.setAttending(i,!ie)}>
          ${ie?`${l} isn’t going this time`:`${l} is going after all`}
        </button>
        ${i.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:w}
        <details class="notes">
          <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
          <span class="notes-body">--- Rides ---\n${i.attending===!1?"Attending: no":"(nothing yet)"}</span>
        </details>`}return i.where==="home"?p`${D}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${l} can’t get home in time, the board shows it as a clash.</p>`:p`
      ${D}
      ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:w}
      ${i.recurring?p`<div class="field">
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
      ${ie?p`${i.where==="anywhere"?p`<p class="field-hint">
                  ${i.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:w}
            ${i.own?p`<p class="field-hint">${this.ownHint(e,i)}</p>`:je()}
      ${i.own?p`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${H!=null?`Takes ${H} min, any time ${j(i.start)}–${j(i.end)}`:"At its set time"}</span>
            </span>
            ${H!=null?p`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${a||H<=5} @click=${()=>this.setTakes(i,Math.max(5,H-5))}>−</button>
                  <span class="arrive-value">${H} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${a||H+5>i.end-i.start} @click=${()=>this.setTakes(i,H+5)}>+</button>
                </span>`:w}
          </div>
          <button type="button" class="chip clear" ?disabled=${a} @click=${()=>this.setTakes(i,H!=null?null:Math.min(10,Math.max(5,i.end-i.start)))}>
            ${H!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:w}
      ${Q&&R.length?p`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${R.map(x=>p`<button type="button" class="chip" aria-pressed=${M.includes(x)?"true":"false"} ?disabled=${a} @click=${()=>this.toggleAlong(i,x)}>
                  ${r.includes(x)?ne(e,x):re(e,x)}
                </button>`)}
            </div>
          </div>`:w}
      ${U?w:tt()}
`:p`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${l} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${a} @click=${()=>this.setAttending(i,!ie)}>
        ${ie?`${l} isn’t going this time`:`${l} is going after all`}
      </button>
      ${i.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:w}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${ee.length?ee.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${ie&&!i.own?p`<p class="field-hint">Tap a selected driver again to clear it.</p>`:w}
    `}};jt.styles=Zi,jt.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},leaveDraft:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",jt);var It=class extends fe{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=si(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(wt);let n=e.toString();history.replaceState(history.state,"",`${location.pathname}${n?`?${n}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new Yt(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return p`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?p`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:w}`}};It.styles=Ne`
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
  `,It.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0},pairing:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",It);
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
