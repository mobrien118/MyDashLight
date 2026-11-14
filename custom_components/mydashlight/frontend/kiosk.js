var Nr=Object.defineProperty;var Rn=(s,t)=>()=>(s&&(t=s(s=0)),t);var zr=(s,t)=>{for(var e in t)Nr(s,e,{get:t[e],enumerable:!0})};function $n(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function ws(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function Ja(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Mo(s){return Ja(s,t=>t.unicode)}function Za(s){function t(e,n,o){let i=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(o)for(let[r,[a,c]]of Object.entries(o))i.createIndex(r,a,{multiEntry:c});return i}t(bt),t(it,Wa,{[Do]:[Ka,!0],[Ro]:[[Va,qa]],[Io]:[Ga,!0]}),t(_s,void 0,{[Lo]:[""]})}function Bo(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function Qa(s){let t=await new Promise((e,n)=>{let o=indexedDB.open(s,Ha);$s[s]=o,o.onupgradeneeded=i=>{i.oldVersion<Fa&&Za(o.result)},Bo(e,n,o)});return t.onclose=()=>Cs(s),t}function el(s){return _n[s]||(_n[s]=Qa(s)),_n[s]}function ze(s,t,e,n){return new Promise((o,i)=>{let r=s.transaction(t,e,{durability:"relaxed"}),a=typeof t=="string"?r.objectStore(t):t.map(l=>r.objectStore(l)),c;n(a,r,l=>{c=l}),r.oncomplete=()=>o(c),r.onerror=()=>i(r.error)})}function Cs(s){let t=$s[s],e=t&&t.result;if(e){e.close();let n=Cn[s];if(n)for(let o of n)o()}delete $s[s],delete _n[s],delete Cn[s]}function tl(s){return new Promise((t,e)=>{Cs(s);let n=indexedDB.deleteDatabase(s);Bo(t,e,n)})}function nl(s,t){let e=Cn[s];e||(e=Cn[s]=[]),e.push(t)}function mt(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||sl.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function Oo(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=il)}function ol(s){return s.map(({annotation:e,emoticon:n,group:o,order:i,shortcodes:r,skins:a,tags:c,emoji:l,version:d})=>{let u=[...new Set(Oo([...(r||[]).map(mt).flat(),...(c||[]).map(mt).flat(),...mt(e),n]))].sort(),h={annotation:e,group:o,order:i,tags:c,tokens:u,unicode:l,version:d};if(n&&(h.emoticon=n),r&&(h.shortcodes=r),a){h.skinTones=[],h.skinUnicodes=[],h.skinVersions=[];for(let{tone:g,emoji:S,version:v}of a)h.skinTones.push(g),h.skinUnicodes.push(S),h.skinVersions.push(v)}return h})}function jo(s,t,e,n){s[t](e).onsuccess=o=>n&&n(o.target.result)}function st(s,t,e){jo(s,"get",t,e)}function No(s,t,e){jo(s,"getAll",t,e)}function As(s){s.commit&&s.commit()}function rl(s,t){let e=s[0];for(let n=1;n<s.length;n++){let o=s[n];t(e)>t(o)&&(e=o)}return e}function zo(s,t){let e=rl(s,o=>o.length),n=[];for(let o of e)s.some(i=>i.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function al(s){return!await Ss(s,bt,En)}async function ll(s,t,e){let[n,o]=await Promise.all([ks,En].map(i=>Ss(s,bt,i)));return n===e&&o===t}async function cl(s,t){return ze(s,it,yt,(n,o,i)=>{let r,a=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let l=c.target.result;for(let d of l)if(r=d.unicode,t(d))return i(d);if(l.length<50)return i();a()}};a()})}async function Uo(s,t,e,n){try{let o=ol(t);await ze(s,[it,bt],Es,([i,r],a)=>{let c,l,d=0;function u(){++d===2&&h()}function h(){if(!(c===n&&l===e)){i.clear();for(let g of o)i.put(g);r.put(n,ks),r.put(e,En),As(a)}}st(r,ks,g=>{c=g,u()}),st(r,En,g=>{l=g,u()})})}finally{}}async function dl(s,t){return ze(s,it,yt,(e,n,o)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);No(e.index(Ro),i,o)})}async function Ho(s,t){let e=Oo(mt(t));return e.length?ze(s,it,yt,(n,o,i)=>{let r=[],a=()=>{r.length===e.length&&c()},c=()=>{let l=zo(r,d=>d.unicode);i(l.sort((d,u)=>d.order<u.order?-1:1))};for(let l=0;l<e.length;l++){let d=e[l],u=l===e.length-1?IDBKeyRange.bound(d,d+"￿",!1,!0):IDBKeyRange.only(d);No(n.index(Do),u,h=>{r.push(h),a()})}}):[]}async function ul(s,t){let e=await Ho(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(i=>i.toLowerCase()).includes(t.toLowerCase()))[0]||null:await cl(s,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function hl(s,t){return ze(s,it,yt,(e,n,o)=>st(e,t,i=>{if(i)return o(i);st(e.index(Io),t,r=>o(r||null))}))}function Ss(s,t,e){return ze(s,t,yt,(n,o,i)=>st(n,e,i))}function pl(s,t,e,n){return ze(s,t,Es,(o,i)=>{o.put(n,e),As(i)})}function fl(s,t){return ze(s,_s,Es,(e,n)=>st(e,t,o=>{e.put((o||0)+1,t),As(n)}))}function gl(s,t,e){return e===0?[]:ze(s,[_s,it],yt,([n,o],i,r)=>{let a=[];n.index(Lo).openCursor(void 0,"prev").onsuccess=c=>{let l=c.target.result;if(!l)return r(a);function d(g){if(a.push(g),a.length===e)return r(a);l.continue()}let u=l.primaryKey,h=t.byName(u);if(h)return d(h);st(o,u,g=>{if(g)return d(g);l.continue()})}})}function ml(s,t){let e=new Map;for(let o of s){let i=t(o);for(let r of i){let a=e;for(let l=0;l<r.length;l++){let d=r.charAt(l),u=a.get(d);u||(u=new Map,a.set(d,u)),a=u}let c=a.get(Tn);c||(c=[],a.set(Tn,c)),c.push(o)}}return(o,i)=>{let r=e;for(let l=0;l<o.length;l++){let d=o.charAt(l),u=r.get(d);if(u)r=u;else return[]}if(i)return r.get(Tn)||[];let a=[],c=[r];for(;c.length;){let d=[...c.shift().entries()].sort((u,h)=>u[0]<h[0]?-1:1);for(let[u,h]of d)u===Tn?a.push(...h):c.push(h)}return a}}function vl(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||bl.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function Po(s){vl(s);let t=(h,g)=>h.name.toLowerCase()<g.name.toLowerCase()?-1:1,e=s.sort(t),o=ml(s,h=>{let g=new Set;if(h.shortcodes)for(let S of h.shortcodes)for(let v of mt(S))g.add(v);return g}),i=h=>o(h,!0),r=h=>o(h,!1),a=h=>{let g=mt(h),S=g.map((v,$)=>($<g.length-1?i:r)(v));return zo(S,v=>v.name).sort(t)},c=new Map,l=new Map;for(let h of s){l.set(h.name.toLowerCase(),h);for(let g of h.shortcodes||[])c.set(g.toLowerCase(),h)}return{all:e,search:a,byShortcode:h=>c.get(h.toLowerCase()),byName:h=>l.get(h.toLowerCase())}}function Bt(s){if(!s)return s;if(yl&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function Fo(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function wl(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||xl.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function Ko(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function kl(s){let t=await fetch(s,{method:"HEAD"});Ko(t,s);let e=t.headers.get("etag");return Fo(e),e}async function Ts(s){let t=await fetch(s);Ko(t,s);let e=t.headers.get("etag");Fo(e);let n=await t.json();return wl(n),[e,n]}function $l(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function Tl(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=s.charCodeAt(o);return e}async function Wo(s){let t=JSON.stringify(s),e=Tl(t),n=await crypto.subtle.digest("SHA-1",e),o=$l(n);return btoa(o)}async function _l(s,t){let e,n=await kl(t);if(!n){let o=await Ts(t);n=o[0],e=o[1],n||(n=await Wo(e))}await ll(s,t,n)||(e||(e=(await Ts(t))[1]),await Uo(s,e,t,n))}async function El(s,t){let[e,n]=await Ts(t);e||(e=await Wo(n)),await Uo(s,n,t,e)}async function Cl(s,t){try{await _l(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var Ha,Fa,it,bt,_s,Ka,Do,Wa,Lo,Va,qa,Ro,ks,En,So,yt,Es,Io,Ga,Ya,Xa,$s,_n,Cn,sl,il,Tn,bl,yl,xl,vt,Ms=Rn(()=>{Ha=1,Fa=1,it="emoji",bt="keyvalue",_s="favorites",Ka="tokens",Do="tokens",Wa="unicode",Lo="count",Va="group",qa="order",Ro="group-order",ks="eTag",En="url",So="skinTone",yt="readonly",Es="readwrite",Io="skinUnicodes",Ga="skinUnicodes",Ya="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Xa="en";$s={},_n={},Cn={};sl=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);il=2;Tn="";bl=["name","url"];yl=typeof wrappedJSObject<"u";xl=["annotation","emoji","group","order","version"];vt=class{constructor({dataSource:t=Ya,locale:e=Xa,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=Po(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await el(this._dbName);nl(this._dbName,this._clear);let e=this.dataSource;await al(t)?await El(t,e):this._lazyUpdate=Cl(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return ws(t),await this.ready(),Mo(await dl(this._db,t)).map(Bt)}async getEmojiBySearchQuery(t){$n(t),await this.ready();let e=this._custom.search(t),n=Mo(await Ho(this._db,t)).map(Bt);return[...e,...n]}async getEmojiByShortcode(t){$n(t),await this.ready();let e=this._custom.byShortcode(t);return e||Bt(await ul(this._db,t))}async getEmojiByUnicodeOrName(t){$n(t),await this.ready();let e=this._custom.byName(t);return e||Bt(await hl(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await Ss(this._db,bt,So)||0}async setPreferredSkinTone(t){return ws(t),await this.ready(),pl(this._db,bt,So,t)}async incrementFavoriteEmojiCount(t){return $n(t),await this.ready(),fl(this._db,t)}async getTopFavoriteEmoji(t){return ws(t),await this.ready(),(await gl(this._db,this._custom,t)).map(Bt)}set customEmoji(t){this._custom=Po(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await Cs(this._dbName)}async delete(){await this._shutdown(),await tl(this._dbName)}}});function qo(s){return s.unicode.includes("‍")}function Bl(s){let t=Go(s,"#000"),e=Go(s,"#fff");return t&&e&&Il(t,e)}function Ol(){let s=Object.entries(Sl);try{for(let[t,e]of s)if(Bl(t))return e}catch{}finally{}return s[0][1]}function Fl(s,t){if(t===0)return s;let e=s.indexOf(zl);return e!==-1?s.substring(0,e)+String.fromCodePoint(Ul+t-1)+s.substring(e):(s.endsWith(jl)&&(s=s.substring(0,s.length-1)),s+Nl+String.fromCodePoint(Hl+t-1))}function Le(s){s.preventDefault(),s.stopPropagation()}function Rs(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function sr(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Kl(s,t){let e=n=>{let o={};for(let i of n)typeof i.tone=="number"&&i.version<=t&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:n,skins:o,shortcodes:i,url:r,name:a,category:c,annotation:l})=>({unicode:n,name:a,shortcodes:i,url:r,category:c,annotation:l,id:n||a,skins:o&&e(o)}))}function Vl(s,t,e){let n;Wl?(n=new ResizeObserver(e),n.observe(s)):Sn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function Yo(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function Xo(s,t,e){let n=Yo(t);if(!n){if(!ot){ot=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])ot.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(ot),ot.firstChild.nodeValue=s,Yo(ot)}finally{ot.remove()}}return n}function Gl(s,t,e){let n=!0;for(let o of s){let i=e(o);if(!i)continue;typeof Is>"u"&&(Is=Xo(ql,t,t));let a=Xo(o.unicode,i,t)/1.8<Is;Ns.set(o.unicode,a),a||(n=!1)}return n}function Yl(s){return sr(s,t=>t)}function Xl(s){s&&(s.scrollTop=0)}function Ot(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function Jo(s){return""+s}function Jl(s){let t=document.createElement("template");return t.innerHTML=s,t}function nc(s,t){tc?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function sc(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function ic(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=sc(n,s):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&nc(n,s)}function oc(s,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:a,attributeValuePost:c}}=e,l=s[i];if(o!==l)if(e.currentExpression=l,r)if(l===null)n.removeAttribute(r);else{let d=a+Jo(l)+c;n.setAttribute(r,d)}else{let d;Array.isArray(l)?ic(l,e):l instanceof Element?(d=l,n.replaceWith(d)):n.nodeValue=Jo(l),d&&(e.targetNode=d)}}}function rc(s){let t="",e=!1,n=!1,o=-1,i=new Map,r=[],a=0;for(let l=0,d=s.length;l<d;l++){let u=s[l];if(t+=u.slice(a),l===d-1)break;for(let p=0;p<u.length;p++)switch(u.charAt(p)){case"<":{u.charAt(p+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let h=r[r.length-1],g=Ot(i,h,()=>[]),S,v,$;if(n){let p=/(\S+)="?([^"=]*)$/.exec(u);S=p[1],v=p[2];let O=/^([^">]*)("?)/.exec(s[l+1]);$=O[1],t=t.slice(0,-1*p[0].length),a=O[0].length}else a=0;let M={attributeName:S,attributeValuePre:v,attributeValuePost:$,expressionIndex:l};g.push(M),!e&&!n&&(t+=" ")}return{template:Jl(t),elementsToBindings:i}}function Zo(s,t,e){for(let n=0;n<s.length;n++){let o=s[n],i=o.attributeName?t:t.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function ac(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))Zo(n,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let a=t.get(++r);a&&Zo(a,i,e)}while(i=o.nextNode())}return e}function lc(s){let{template:t,elementsToBindings:e}=Ot(Zl,s,()=>rc(s)),n=t.cloneNode(!0).content.firstElementChild,o=ac(n,e);return function(r){return oc(r,o),n}}function cc(s){let t=Ot(Ql,s,()=>new Map),e=ec;function n(i,...r){let a=Ot(t,i,()=>new Map);return Ot(a,e,()=>lc(i))(r)}function o(i,r,a){return i.map((c,l)=>{let d=e;e=a(c);try{return r(c,l)}finally{e=d}})}return{map:o,html:n}}function dc(s,t,e,n,o,i,r,a,c){let{labelWithSkin:l,titleForEmoji:d,unicodeWithSkin:u}=e,{html:h,map:g}=cc(t);function S(p,O,U){return g(p,(Y,de)=>h`<button role="${O?"option":"menuitem"}" aria-selected="${O?de===t.activeSearchItem:null}" aria-label="${l(Y,t.currentSkinTone)}" title="${d(Y)}" class="${"emoji"+(O&&de===t.activeSearchItem?" active":"")+(Y.unicode?"":" custom-emoji")}" id="${`${U}-${Y.id}`}" style="${Y.unicode?null:`--custom-emoji-background: url(${JSON.stringify(Y.url)})`}">${Y.unicode?u(Y,t.currentSkinTone):""}</button>`,Y=>`${U}-${Y.id}`)}let $=h`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${g(t.skinTones,(p,O)=>h`<div id="skintone-${O}" class="emoji ${O===t.activeSkinTone?"active":""}" aria-selected="${O===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[O]}" aria-label="${t.i18n.skinTones[O]}">${p}</div>`,p=>p)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${g(t.groups,p=>h`<button role="tab" class="nav-button" aria-controls="tab-${p.id}" aria-label="${t.i18n.categories[p.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===p.id}" title="${t.i18n.categories[p.name]}" data-group-id="${p.id}"><div class="nav-emoji emoji">${p.emoji}</div></button>`,p=>p.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${g(t.currentEmojisWithCategories,(p,O)=>h`<div><div id="menu-label-${O}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:p.category?p.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${O!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(p.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${O}" id="${t.searchMode?"search-results":null}">${S(p.emojis,t.searchMode,"emo")}</div></div>`,p=>p.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${S(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,M=(p,O)=>{for(let U of s.querySelectorAll(`[${p}]`))O(U,U.getAttribute(p))};if(c){s.appendChild($);for(let p of["click","focusout","input","keydown","keyup"])M(`data-on-${p}`,(O,U)=>{O.addEventListener(p,n[U])});M("data-ref",(p,O)=>{i[O]=p}),r.addEventListener("abort",()=>{s.removeChild($)})}M("data-action",(p,O)=>{let U=a.get(O);U||a.set(O,U=new WeakSet),U.has(p)||(U.add(p),o[O](p))})}function uc(s){let t=!1,e,n=new Map,o=new Set,i,r=()=>{if(t)return;let l=[...o];o.clear();try{for(let d of l)d()}finally{i=!1,o.size&&(i=!0,Mn(r))}},a=new Proxy({},{get(l,d){if(e){let u=n.get(d);u||(u=new Set,n.set(d,u)),u.add(e)}return l[d]},set(l,d,u){if(l[d]!==u){l[d]=u;let h=n.get(d);if(h){for(let g of h)o.add(g);i||(i=!0,Mn(r))}}return!0}}),c=l=>{let d=()=>{let u=e;e=d;try{return l()}finally{e=u}};return d()};return s.addEventListener("abort",()=>{t=!0}),{state:a,createEffect:c}}function Bs(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function hc(s,t,e){{let n=s.closest(".tabpanel"),o=Qo.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),Qo.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function pc(s,t){let e={},n=new AbortController,o=n.signal,{state:i,createEffect:r}=uc(o),a=new Map;An(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),An(i,t),An(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:Dl,isRtl:!1,currentGroupIndex:0,groups:Ps,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let c=b=>{s.getElementById(b).focus()},l=b=>s.getElementById(`emo-${b.id}`),d=(b,k)=>{e.rootElement.dispatchEvent(new CustomEvent(b,{detail:k,bubbles:!0,composed:!0}))},u=(b,k)=>b.id===k.id,h=(b,k)=>{let{category:A,emojis:P}=b,{category:K,emojis:L}=k;return A!==K?!1:Bs(P,L,u)},g=b=>{Bs(i.currentEmojis,b,u)||(i.currentEmojis=b)},S=b=>{i.searchMode!==b&&(i.searchMode=b)},v=b=>{Bs(i.currentEmojisWithCategories,b,h)||(i.currentEmojisWithCategories=b)},$=(b,k)=>k&&b.skins&&b.skins[k]||b.unicode,O={labelWithSkin:(b,k)=>Yl([b.name||$(b,k),b.annotation,...b.shortcodes||Os].filter(Boolean)).join(", "),titleForEmoji:b=>b.annotation||(b.shortcodes||Os).join(", "),unicodeWithSkin:$},U={onClickSkinToneButton:be,onEmojiClick:pe,onNavClick:J,onNavKeydown:Q,onSearchKeydown:N,onSkinToneOptionsClick:Ee,onSkinToneOptionsFocusOut:z,onSkinToneOptionsKeydown:m,onSkinToneOptionsKeyup:B,onSearchInput:T},Y={calculateEmojiGridStyle:w,updateOnIntersection:y},de=!0;r(()=>{dc(s,i,O,U,Y,e,o,a,de),de=!1}),i.emojiVersion||Ls().then(b=>{b||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function b(){let k=!1,A=setTimeout(()=>{k=!0,i.message=i.i18n.loadingMessage},Ml);try{await i.database.ready(),i.databaseLoaded=!0}catch(P){console.error(P),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(A),k&&(k=!1,i.message="")}}i.database&&b()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${Vo};`}),r(()=>{i.customEmoji&&i.database&&x()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==js&&(i.groups=js):i.groups!==Ps&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=Ps)}),r(()=>{async function b(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}b()}),r(()=>{i.skinTones=Array(Vo).fill().map((b,k)=>Fl(i.skinToneEmoji,k))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function b(){let{database:k}=i,A=(await Promise.all(Ll.map(P=>k.getEmojiByUnicodeOrName(P)))).filter(Boolean);i.defaultFavoriteEmojis=A}i.databaseLoaded&&b()});function x(){let{customEmoji:b,database:k}=i,A=b||Os;k.customEmoji!==A&&(k.customEmoji=A)}r(()=>{async function b(){x();let{database:k,defaultFavoriteEmojis:A,numColumns:P}=i,K=await k.getTopFavoriteEmoji(P),L=await V(sr([...K,...A],H=>H.unicode||H.name).slice(0,P));i.currentFavorites=L}i.databaseLoaded&&i.defaultFavoriteEmojis&&b()});function w(b){Vl(b,o,()=>{{let k=getComputedStyle(e.rootElement),A=parseInt(k.getPropertyValue("--num-columns"),10),P=k.getPropertyValue("direction")==="rtl";i.numColumns=A,i.isRtl=P}})}function y(b){hc(b,o,k=>{for(let{target:A,isIntersecting:P}of k)A.classList.toggle("onscreen",P)})}r(()=>{async function b(){let{searchText:k,currentGroup:A,databaseLoaded:P,customEmoji:K}=i;if(!P)i.currentEmojis=[],i.searchMode=!1;else if(k.length>=Al){let L=await ee(k);i.searchText===k&&(g(L),S(!0))}else{let{id:L}=A;if(L!==-1||K&&K.length){let H=await Z(L);i.currentGroup.id===L&&(g(H),S(!1))}}}b()});let _=()=>{Sn(()=>Xl(e.tabpanelElement))};r(()=>{let{currentEmojis:b,emojiVersion:k}=i,A=b.filter(P=>P.unicode).filter(P=>qo(P)&&!Ns.has(P.unicode));if(!k&&A.length)g(b),Sn(()=>C(A));else{let P=k?b:b.filter(D);g(P),_()}});function C(b){Gl(b,e.baselineEmoji,l)?_():i.currentEmojis=[...i.currentEmojis]}function D(b){return!b.unicode||!qo(b)||Ns.get(b.unicode)}async function j(b){let k=i.emojiVersion||await Ls();return b.filter(({version:A})=>!A||A<=k)}async function V(b){return Kl(b,i.emojiVersion||await Ls())}async function Z(b){let k=b===-1?i.customEmoji:await i.database.getEmojiByGroup(b);return V(await j(k))}async function ee(b){return V(await j(await i.database.getEmojiBySearchQuery(b)))}r(()=>{}),r(()=>{function b(){let{searchMode:A,currentEmojis:P}=i;if(A)return[{category:"",emojis:P}];let K=new Map;for(let L of P){let H=L.category||"",ie=K.get(H);ie||(ie=[],K.set(H,ie)),ie.push(L)}return[...K.entries()].map(([L,H])=>({category:L,emojis:H})).sort((L,H)=>i.customCategorySorting(L.category,H.category))}let k=b();v(k)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:b}=i;tr(()=>{i.searchText=(b||"").trim(),i.activeSearchItem=-1})});function N(b){if(!i.searchMode||!i.currentEmojis.length)return;let k=A=>{Le(b),i.activeSearchItem=Rs(A,i.activeSearchItem,i.currentEmojis)};switch(b.key){case"ArrowDown":return k(!1);case"ArrowUp":return k(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return Le(b),xe(i.currentEmojis[i.activeSearchItem].id)}}function J(b){let{target:k}=b,A=k.closest(".nav-button");if(!A)return;let P=parseInt(A.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(K=>K.id===P)}function Q(b){let{target:k,key:A}=b,P=K=>{K&&(Le(b),K.focus())};switch(A){case"ArrowLeft":return P(k.previousElementSibling);case"ArrowRight":return P(k.nextElementSibling);case"Home":return P(k.parentElement.firstElementChild);case"End":return P(k.parentElement.lastElementChild)}}async function se(b){let k=await i.database.getEmojiByUnicodeOrName(b),A=[...i.currentEmojis,...i.currentFavorites].find(K=>K.id===b),P=A.unicode&&$(A,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(b),{emoji:k,skinTone:i.currentSkinTone,...P&&{unicode:P},...A.name&&{name:A.name}}}async function xe(b){let k=se(b);d("emoji-click-sync",k),d("emoji-click",await k)}function pe(b){let{target:k}=b;if(!k.classList.contains("emoji"))return;Le(b);let A=k.id.substring(4);xe(A)}function ue(b){i.currentSkinTone=b,i.skinTonePickerExpanded=!1,c("skintone-button"),d("skin-tone-change",{skinTone:b}),i.database.setPreferredSkinTone(b)}function Ee(b){let{target:{id:k}}=b,A=k&&k.match(/^skintone-(\d)/);if(!A)return;Le(b);let P=parseInt(A[1],10);ue(P)}function be(b){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(Le(b),Sn(()=>c("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function m(b){if(!i.skinTonePickerExpanded)return;let k=async A=>{Le(b),i.activeSkinTone=A};switch(b.key){case"ArrowUp":return k(Rs(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return k(Rs(!1,i.activeSkinTone,i.skinTones));case"Home":return k(0);case"End":return k(i.skinTones.length-1);case"Enter":return Le(b),ue(i.activeSkinTone);case"Escape":return Le(b),i.skinTonePickerExpanded=!1,c("skintone-button")}}function B(b){if(i.skinTonePickerExpanded)switch(b.key){case" ":return Le(b),ue(i.activeSkinTone)}}async function z(b){let{relatedTarget:k}=b;(!k||k.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function T(b){i.rawSearchText=b.target.value}return{$set(b){An(i,b)},$destroy(){n.abort()}}}function er(s){s instanceof rt||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var js,Ps,Al,Vo,tr,Sl,Ml,Pl,Dl,Ll,nr,Rl,Go,Il,Ds,Ls,Ns,jl,Nl,zl,Ul,Hl,Sn,Wl,ql,Is,ot,Zl,Ql,ec,tc,Mn,Qo,Os,An,fc,gc,mc,bc,ir,vc,rt,or,rr=Rn(()=>{Ms();js=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),Ps=js.slice(1),Al=2,Vo=6,tr=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;Sl={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},Ml=1e3,Pl="🖐️",Dl=8,Ll=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],nr='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',Rl=(s,t)=>s<t?-1:s>t?1:0,Go=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${nr}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},Il=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};Ls=()=>(Ds||(Ds=new Promise(s=>tr(()=>s(Ol())))),Ds),Ns=new Map,jl="️",Nl="\uD83C",zl="‍",Ul=127995,Hl=57339;Sn=requestAnimationFrame,Wl=typeof ResizeObserver=="function";ql="😀";Zl=new WeakMap,Ql=new WeakMap,ec=Symbol("un-keyed"),tc="replaceChildren"in Element.prototype;Mn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);Qo=new WeakMap;Os=[],{assign:An}=Object;fc="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",gc="en",mc={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},bc=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',ir=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],vc=`:host{--emoji-font-family:${nr}}`,rt=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=bc+vc,this.shadowRoot.appendChild(e),this._ctx={locale:gc,dataSource:fc,skinToneEmoji:Pl,customCategorySorting:Rl,customEmoji:null,i18n:mc,emojiVersion:null,...t};for(let n of ir)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){er(this),this._cmp||(this._cmp=pc(this.shadowRoot,this._ctx))}disconnectedCallback(){er(this),Mn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new vt({locale:t,dataSource:e}))}_dbFlush(){Mn(()=>this._dbCreate())}},or={};for(let s of ir)or[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(rt.prototype,or);customElements.get("emoji-picker")||customElements.define("emoji-picker",rt)});var ar={};zr(ar,{Database:()=>vt,Picker:()=>rt});var lr=Rn(()=>{rr();Ms()});function ei(s){return{type:"auth",access_token:s}}function ti(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function ni(s){let t={type:"subscribe_events"};return s&&(t.event_type=s),t}function In(s){return{type:"unsubscribe_events",subscription:s}}function si(){return{type:"ping"}}function ii(s,t){return{type:"result",success:!1,error:{code:s,message:t}}}function ri(s){let t={},e=s.split("&");for(let n=0;n<e.length;n++){let o=e[n].split("="),i=decodeURIComponent(o[0]),r=o.length>1?decodeURIComponent(o[1]):void 0;t[i]=r}return t}var ai=(s,t,e,n)=>{let[o,i,r]=s.split(".",3);return Number(o)>t||Number(o)===t&&(n===void 0?Number(i)>=e:Number(i)>e)||n!==void 0&&Number(o)===t&&Number(i)===e&&Number(r)>=n};var Vt=!1,Hr="auth_required",Fr="auth_invalid",Kr="auth_ok";function ci(s){if(!s.auth)throw 4;let t=s.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,n=t.wsUrl;Vt&&console.log("[Auth phase] Initializing",n);function o(i,r,a){Vt&&console.log("[Auth Phase] New connection",n);let c=new WebSocket(n),l=!1,d=()=>{if(c.removeEventListener("close",d),l){a(2);return}if(i===0){a(1);return}let g=i===-1?-1:i-1;setTimeout(()=>o(g,r,a),1e3)},u=async g=>{try{t.expired&&await(e||t.refreshAccessToken()),c.send(JSON.stringify(ei(t.accessToken)))}catch(S){l=S===2,c.close()}},h=async g=>{let S=JSON.parse(g.data);switch(Vt&&console.log("[Auth phase] Received",S),S.type){case Fr:l=!0,c.close();break;case Kr:c.removeEventListener("open",u),c.removeEventListener("message",h),c.removeEventListener("close",d),c.removeEventListener("error",d),c.haVersion=S.ha_version,ai(c.haVersion,2022,9)&&c.send(JSON.stringify(ti())),r(c);break;default:Vt&&S.type!==Hr&&console.warn("[Auth phase] Unhandled message",S)}};c.addEventListener("open",u),c.addEventListener("message",h),c.addEventListener("close",d),c.addEventListener("error",d)}return new Promise((i,r)=>o(s.setupRetry,i,r))}var kt=!1,qt=class{constructor(t,e){this._handleMessage=n=>{let o=JSON.parse(n.data);Array.isArray(o)||(o=[o]),o.forEach(i=>{kt&&console.log("Received",i);let r=this.commands.get(i.id);switch(i.type){case"event":r?r.callback(i.event):(console.warn(`Received event for unknown subscription ${i.id}. Unsubscribing.`),this.sendMessagePromise(In(i.id)).catch(a=>{kt&&console.warn(` Error unsubsribing from unknown subscription ${i.id}`,a)}));break;case"result":r&&(i.success?(r.resolve(i.result),"subscribe"in r||this.commands.delete(i.id)):(r.reject(i.error),this.commands.delete(i.id)));break;case"pong":r?(r.resolve(),this.commands.delete(i.id)):console.warn(`Received unknown pong response ${i.id}`);break;default:kt&&console.warn("Unhandled message",i)}})},this._handleClose=async()=>{let n=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,n.forEach(r=>{"subscribe"in r||r.reject(ii(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let o=Object.assign(Object.assign({},this.options),{setupRetry:0}),i=r=>{setTimeout(async()=>{if(!this.closeRequested){kt&&console.log("Trying to reconnect");try{let a=await o.createSocket(o);this._setSocket(a)}catch(a){if(this._queuedMessages){let c=this._queuedMessages;this._queuedMessages=void 0;for(let l of c)l.reject&&l.reject(3)}a===2?this.fireEvent("reconnect-error",a):i(r+1)}}},Math.min(r,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),i(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(o=>{"subscribe"in o&&o.subscribe&&o.subscribe().then(i=>{o.unsubscribe=i,o.resolve()})}));let n=this._queuedMessages;if(n){this._queuedMessages=void 0;for(let o of n)o.resolve()}this.fireEvent("ready")}addEventListener(t,e){let n=this.eventListeners.get(t);n||(n=[],this.eventListeners.set(t,n)),n.push(e)}removeEventListener(t,e){let n=this.eventListeners.get(t);if(!n)return;let o=n.indexOf(e);o!==-1&&n.splice(o,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(n=>n(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,ni(e))}ping(){return this.sendMessagePromise(si())}sendMessage(t,e){if(!this.connected)throw 3;if(kt&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,n)=>{if(this._queuedMessages){this._queuedMessages.push({reject:n,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(i){n(i)}}});return}let o=this._genCmdId();this.commands.set(o,{resolve:e,reject:n}),this.sendMessage(t,o)})}async subscribeMessage(t,e,n){if(this._queuedMessages&&await new Promise((i,r)=>{this._queuedMessages.push({resolve:i,reject:r})}),n?.preCheck&&!await n.preCheck())throw new Error("Pre-check failed");let o;return await new Promise((i,r)=>{let a=this._genCmdId();o={resolve:i,reject:r,callback:t,subscribe:n?.resubscribe!==!1?()=>this.subscribeMessage(t,e,n):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(In(a)),this.commands.delete(a)}},this.commands.set(a,o);try{this.sendMessage(e,a)}catch{}}),()=>o.unsubscribe()}_genCmdId(){return++this.commandId}};var Wr=()=>`${location.protocol}//${location.host}/`,Vr=s=>s*1e3+Date.now();function qr(){let{protocol:s,host:t,pathname:e,search:n}=location;return`${s}//${t}${e}${n}`}function Gr(s,t,e,n){let o=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(o+=`&client_id=${encodeURIComponent(t)}`),n&&(o+=`&state=${encodeURIComponent(n)}`),o}function Yr(s,t,e,n){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=Gr(s,t,e,n)}async function hi(s,t,e){let n=typeof location<"u"&&location;if(n&&n.protocol==="https:"){let a=document.createElement("a");if(a.href=s,a.protocol==="http:"&&a.hostname!=="localhost")throw 5}let o=new FormData;t!==null&&o.append("client_id",t),Object.keys(e).forEach(a=>{o.append(a,e[a])});let i=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:o});if(!i.ok)throw i.status===400||i.status===403?2:new Error("Unable to fetch tokens");let r=await i.json();return r.hassUrl=s,r.clientId=t,r.expires=Vr(r.expires_in),r}function ui(s,t,e){return hi(s,t,{code:e,grant_type:"authorization_code"})}function Xr(s){return btoa(JSON.stringify(s))}function Jr(s){return JSON.parse(atob(s))}var Bn=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await hi(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function pi(s={}){let t,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let n=s.clientId!==void 0?s.clientId:Wr(),o=s.limitHassInstance===!0;if(s.authCode&&e&&(t=await ui(e,n,s.authCode),s.saveTokens&&s.saveTokens(t)),!t){let i=ri(location.search.substr(1));if("auth_callback"in i){let r=Jr(i.state);if(o&&(r.hassUrl!==e||r.clientId!==n))throw 6;t=await ui(r.hassUrl,r.clientId,i.code),s.saveTokens&&s.saveTokens(t)}}if(!t&&s.loadTokens&&(t=await s.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new Bn(t,s.saveTokens);if(e===void 0)throw 4;return Yr(e,n,s.redirectUrl||qr(),Xr({hassUrl:e,clientId:n})),new Promise(()=>{})}async function fi(s){let t=Object.assign({setupRetry:0,createSocket:ci},s),e=await t.createSocket(t);return new qt(e,t)}function F(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function Ue(s){let t=Math.floor(Math.round(s)/60)%24;return`${F(s)} ${t<12?"AM":"PM"}`}function gi(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function Tt(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function On(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Zr=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Qr=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),ea=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Gt(s){return new Date(`${s}T12:00:00Z`)}function Ae(s){let t=Gt(s);return`${Zr.format(t)}, ${ea.format(t)}`}function ve(s){return Qr.format(Gt(s))}function Se(s,t){return Math.round((Gt(t).getTime()-Gt(s).getTime())/864e5)}function $t(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return $t("UTC",t)}let n=o=>e.find(i=>i.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function Yt(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=$t(e,s),i=$t(e,t).date;return o.date===i?`at ${Ue(o.minutes)}`:`on ${ve(o.date)} at ${Ue(o.minutes)}`}var re=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}};function vi(s){switch(s.code){case"connection_lost":case"timeout":return"Can’t reach Home Assistant";case"not_running":return"MyDashLight isn’t running";default:return"Couldn’t get the latest plan"}}var Ve="mydashlight",ta=7,jn=3e4,mi=3e4;function Nn(s){if(s instanceof re)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new re(String(t.code??"error"),t.message)}return typeof s=="number"?new re("connection_lost","Lost the connection to Home Assistant."):new re("error",String(s))}function bi(s,t){return new Promise((e,n)=>{let o=setTimeout(()=>n(new re("timeout","Home Assistant didn’t answer.")),t);s.then(i=>{clearTimeout(o),e(i)},i=>{clearTimeout(o),n(i)})})}var _t=class{constructor(t,e,n,o){this.live=!1;this.unsub=null;this.opening=!1;this.gen=0;this.closed=!1;this.onReady=()=>this.open();this.onDisconnected=()=>this.dropped();this.conn=t,this.type=e,this.onMessage=n,this.onFailed=o,t.addEventListener?.("ready",this.onReady),t.addEventListener?.("disconnected",this.onDisconnected)}get isOpen(){return this.unsub!==null||this.opening}open(){if(this.closed||this.isOpen||this.conn.connected===!1)return;let t=++this.gen;this.opening=!0,this.conn.subscribeMessage(e=>{t===this.gen&&(this.live=!0,this.onMessage(e))},{type:this.type},{resubscribe:!1}).then(e=>{if(t!==this.gen){e().catch(()=>{});return}this.opening=!1,this.unsub=e},e=>{t===this.gen&&(this.opening=!1,this.live=!1,this.onFailed(e))})}dropped(){this.gen++,this.opening=!1,this.unsub=null,this.live=!1}close(){this.closed=!0,this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsub;this.dropped(),t&&t().catch(()=>{})}},Xt=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.rides=null;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new re("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.rides?.live??!1}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.rides=new _t(this.conn,`${Ve}/rides/subscribe`,t=>{t.plan?this.emit(t.plan):this.fail(new re("not_running","MyDashLight isn’t running right now."))},()=>{}),this.rides.open(),this.timer=setInterval(()=>{this.live||(this.refresh(),this.rides?.open())},jn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected),this.rides?.close(),this.rides=null}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await bi(this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:"get_plan",service_data:{days:ta},return_response:!0}),mi);this.emit(t.response)}catch(t){this.fail(Nn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:t,service_data:e})}catch(n){throw Nn(n)}this.live||await this.refresh()}setRide(t,e,n,o,i){return this.call("set_ride",i===void 0?{event:t,side:e,driver:n,scope:o}:{event:t,side:e,driver:n,scope:o,stay:i})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:On(e),scope:n})}setLeaveBy(t,e,n){return this.call("set_leave_by",e==null?{event:t,scope:n}:{event:t,time:On(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}watchChores(t){let e=!1,n=!1,o=async()=>{try{let a=await bi(this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:"get_chores",service_data:{},return_response:!0}),mi);if(e)return;n=!0,t(a.response??null)}catch{!e&&!n&&t(null)}},i=new _t(this.conn,`${Ve}/chores/subscribe`,a=>{e||(n=!0,t(a.chores))},()=>void o());i.open();let r=setInterval(()=>{i.live||i.open()},jn);return()=>{e=!0,clearInterval(r),i.close()}}watchLunch(t){let e=!1,n=!1,o=new _t(this.conn,`${Ve}/lunch/subscribe`,r=>{e||(n=!0,t(r.lunch))},()=>{!e&&!n&&t(null)});o.open();let i=setInterval(()=>{o.live||o.open()},jn);return()=>{e=!0,clearInterval(i),o.close()}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:t,service_data:e})}catch(n){throw Nn(n)}}};var Jt=globalThis,Zt=Jt.ShadowRoot&&(Jt.ShadyCSS===void 0||Jt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,zn=Symbol(),yi=new WeakMap,Et=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==zn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Zt&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=yi.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&yi.set(e,t))}return t}toString(){return this.cssText}},xi=s=>new Et(typeof s=="string"?s:s+"",void 0,zn),qe=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,o,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new Et(e,s,zn)},wi=(s,t)=>{if(Zt)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=Jt.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}},Un=Zt?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return xi(e)})(s):s;var{is:na,defineProperty:sa,getOwnPropertyDescriptor:ia,getOwnPropertyNames:oa,getOwnPropertySymbols:ra,getPrototypeOf:aa}=Object,Qt=globalThis,ki=Qt.trustedTypes,la=ki?ki.emptyScript:"",ca=Qt.reactiveElementPolyfillSupport,Ct=(s,t)=>s,Hn={toAttribute(s,t){switch(t){case Boolean:s=s?la:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Ti=(s,t)=>!na(s,t),$i={attribute:!0,type:String,converter:Hn,reflect:!1,useDefault:!1,hasChanged:Ti};Symbol.metadata??=Symbol("metadata"),Qt.litPropertyMetadata??=new WeakMap;var Be=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$i){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&sa(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:i}=ia(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let a=o?.call(this);i?.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$i}static _$Ei(){if(this.hasOwnProperty(Ct("elementProperties")))return;let t=aa(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ct("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ct("properties"))){let e=this.properties,n=[...oa(e),...ra(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(Un(o))}else t!==void 0&&e.push(Un(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return wi(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:Hn).toAttribute(e,n.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=n.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Hn;this._$Em=o;let a=r.fromAttribute(e,i.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(t,e,n,o=!1,i){if(t!==void 0){let r=this.constructor;if(o===!1&&(i=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??Ti)(i,e)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:i},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,i]of n){let{wrapped:r}=i,a=this[o];r!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,i,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Be.elementStyles=[],Be.shadowRootOptions={mode:"open"},Be[Ct("elementProperties")]=new Map,Be[Ct("finalized")]=new Map,ca?.({ReactiveElement:Be}),(Qt.reactiveElementVersions??=[]).push("2.1.2");var Kn=globalThis,_i=s=>s,en=Kn.trustedTypes,Ei=en?en.createPolicy("lit-html",{createHTML:s=>s}):void 0,Wn="$lit$",Oe=`lit$${Math.random().toFixed(9).slice(2)}$`,Vn="?"+Oe,da=`<${Vn}>`,Xe=document,St=()=>Xe.createComment(""),Mt=s=>s===null||typeof s!="object"&&typeof s!="function",qn=Array.isArray,Di=s=>qn(s)||typeof s?.[Symbol.iterator]=="function",Fn=`[ 	
\f\r]`,At=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ci=/-->/g,Ai=/>/g,Ge=RegExp(`>|${Fn}(?:([^\\s"'>=/]+)(${Fn}*=${Fn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Si=/'/g,Mi=/"/g,Li=/^(?:script|style|textarea|title)$/i,Gn=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),f=Gn(1),ae=Gn(2),Pd=Gn(3),je=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),Pi=new WeakMap,Ye=Xe.createTreeWalker(Xe,129);function Ri(s,t){if(!qn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ei!==void 0?Ei.createHTML(t):t}var Ii=(s,t)=>{let e=s.length-1,n=[],o,i=t===2?"<svg>":t===3?"<math>":"",r=At;for(let a=0;a<e;a++){let c=s[a],l,d,u=-1,h=0;for(;h<c.length&&(r.lastIndex=h,d=r.exec(c),d!==null);)h=r.lastIndex,r===At?d[1]==="!--"?r=Ci:d[1]!==void 0?r=Ai:d[2]!==void 0?(Li.test(d[2])&&(o=RegExp("</"+d[2],"g")),r=Ge):d[3]!==void 0&&(r=Ge):r===Ge?d[0]===">"?(r=o??At,u=-1):d[1]===void 0?u=-2:(u=r.lastIndex-d[2].length,l=d[1],r=d[3]===void 0?Ge:d[3]==='"'?Mi:Si):r===Mi||r===Si?r=Ge:r===Ci||r===Ai?r=At:(r=Ge,o=void 0);let g=r===Ge&&s[a+1].startsWith("/>")?" ":"";i+=r===At?c+da:u>=0?(n.push(l),c.slice(0,u)+Wn+c.slice(u)+Oe+g):c+Oe+(u===-2?a:g)}return[Ri(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},Pt=class s{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let i=0,r=0,a=t.length-1,c=this.parts,[l,d]=Ii(t,e);if(this.el=s.createElement(l,n),Ye.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(o=Ye.nextNode())!==null&&c.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(let u of o.getAttributeNames())if(u.endsWith(Wn)){let h=d[r++],g=o.getAttribute(u).split(Oe),S=/([.?@])?(.*)/.exec(h);c.push({type:1,index:i,name:S[2],strings:g,ctor:S[1]==="."?nn:S[1]==="?"?sn:S[1]==="@"?on:Ze}),o.removeAttribute(u)}else u.startsWith(Oe)&&(c.push({type:6,index:i}),o.removeAttribute(u));if(Li.test(o.tagName)){let u=o.textContent.split(Oe),h=u.length-1;if(h>0){o.textContent=en?en.emptyScript:"";for(let g=0;g<h;g++)o.append(u[g],St()),Ye.nextNode(),c.push({type:2,index:++i});o.append(u[h],St())}}}else if(o.nodeType===8)if(o.data===Vn)c.push({type:2,index:i});else{let u=-1;for(;(u=o.data.indexOf(Oe,u+1))!==-1;)c.push({type:7,index:i}),u+=Oe.length-1}i++}}static createElement(t,e){let n=Xe.createElement("template");return n.innerHTML=t,n}};function Je(s,t,e=s,n){if(t===je)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,i=Mt(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=Je(s,o._$AS(s,t.values),o,n)),t}var tn=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??Xe).importNode(e,!0);Ye.currentNode=o;let i=Ye.nextNode(),r=0,a=0,c=n[0];for(;c!==void 0;){if(r===c.index){let l;c.type===2?l=new dt(i,i.nextSibling,this,t):c.type===1?l=new c.ctor(i,c.name,c.strings,this,t):c.type===6&&(l=new rn(i,this,t)),this._$AV.push(l),c=n[++a]}r!==c?.index&&(i=Ye.nextNode(),r++)}return Ye.currentNode=Xe,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},dt=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Je(this,t,e),Mt(t)?t===E||t==null||t===""?(this._$AH!==E&&this._$AR(),this._$AH=E):t!==this._$AH&&t!==je&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Di(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==E&&Mt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Xe.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Pt.createElement(Ri(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new tn(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=Pi.get(t.strings);return e===void 0&&Pi.set(t.strings,e=new Pt(t)),e}k(t){qn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let i of t)o===e.length?e.push(n=new s(this.O(St()),this.O(St()),this,this.options)):n=e[o],n._$AI(i),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=_i(t).nextSibling;_i(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ze=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,i){this.type=1,this._$AH=E,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=E}_$AI(t,e=this,n,o){let i=this.strings,r=!1;if(i===void 0)t=Je(this,t,e,0),r=!Mt(t)||t!==this._$AH&&t!==je,r&&(this._$AH=t);else{let a=t,c,l;for(t=i[0],c=0;c<i.length-1;c++)l=Je(this,a[n+c],e,c),l===je&&(l=this._$AH[c]),r||=!Mt(l)||l!==this._$AH[c],l===E?t=E:t!==E&&(t+=(l??"")+i[c+1]),this._$AH[c]=l}r&&!o&&this.j(t)}j(t){t===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},nn=class extends Ze{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===E?void 0:t}},sn=class extends Ze{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==E)}},on=class extends Ze{constructor(t,e,n,o,i){super(t,e,n,o,i),this.type=5}_$AI(t,e=this){if((t=Je(this,t,e,0)??E)===je)return;let n=this._$AH,o=t===E&&n!==E||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==E&&(n===E||o);o&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},rn=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Je(this,t)}},Bi={M:Wn,P:Oe,A:Vn,C:1,L:Ii,R:tn,D:Di,V:Je,I:dt,H:Ze,N:sn,U:on,B:nn,F:rn},ua=Kn.litHtmlPolyfillSupport;ua?.(Pt,dt),(Kn.litHtmlVersions??=[]).push("3.3.3");var Oi=(s,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let i=e?.renderBefore??null;n._$litPart$=o=new dt(t.insertBefore(St(),i),i,void 0,e??{})}return o._$AI(s),o};var Yn=globalThis,Te=class extends Be{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Oi(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return je}};Te._$litElement$=!0,Te.finalized=!0,Yn.litElementHydrateSupport?.({LitElement:Te});var ha=Yn.litElementPolyfillSupport;ha?.({LitElement:Te});(Yn.litElementVersions??=[]).push("4.2.2");var ji={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ni=s=>(...t)=>({_$litDirective$:s,values:t}),an=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:pa}=Bi,zi=s=>s;var Ui=()=>document.createComment(""),ut=(s,t,e)=>{let n=s._$AA.parentNode,o=t===void 0?s._$AB:t._$AA;if(e===void 0){let i=n.insertBefore(Ui(),o),r=n.insertBefore(Ui(),o);e=new pa(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,a=r!==s;if(a){let c;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(c=s._$AU)!==r._$AU&&e._$AP(c)}if(i!==o||a){let c=e._$AA;for(;c!==i;){let l=zi(c).nextSibling;zi(n).insertBefore(c,o),c=l}}}return e},He=(s,t,e=s)=>(s._$AI(t,e),s),fa={},Hi=(s,t=fa)=>s._$AH=t,Fi=s=>s._$AH,ln=s=>{s._$AR(),s._$AA.remove()};var Ki=(s,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(s[o],o);return n},Ne=Ni(class extends an{constructor(s){if(super(s),s.type!==ji.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],i=[],r=0;for(let a of s)o[r]=n?n(a,r):r,i[r]=e(a,r),r++;return{values:i,keys:o}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let o=Fi(s),{values:i,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,i;let a=this.ut??=[],c=[],l,d,u=0,h=o.length-1,g=0,S=i.length-1;for(;u<=h&&g<=S;)if(o[u]===null)u++;else if(o[h]===null)h--;else if(a[u]===r[g])c[g]=He(o[u],i[g]),u++,g++;else if(a[h]===r[S])c[S]=He(o[h],i[S]),h--,S--;else if(a[u]===r[S])c[S]=He(o[u],i[S]),ut(s,c[S+1],o[u]),u++,S--;else if(a[h]===r[g])c[g]=He(o[h],i[g]),ut(s,o[u],o[h]),h--,g++;else if(l===void 0&&(l=Ki(r,g,S),d=Ki(a,u,h)),l.has(a[u]))if(l.has(a[h])){let v=d.get(r[g]),$=v!==void 0?o[v]:null;if($===null){let M=ut(s,o[u]);He(M,i[g]),c[g]=M}else c[g]=He($,i[g]),ut(s,o[u],$),o[v]=null;g++}else ln(o[h]),h--;else ln(o[u]),u++;for(;g<=S;){let v=ut(s,c[S+1]);He(v,i[g]),c[g++]=v}for(;u<=h;){let v=o[u++];v!==null&&ln(v)}return this.ut=r,Hi(s,c),je}});var cn=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function he(s){return cn[(s%cn.length+cn.length)%cn.length]}var dn="#23272E",Xn="35,39,46";var ga=3,Lt=36,Jn=12,un=8,Wi=30,Me=16,Dt=100,ht=60,Qn=10,hn=30,es=10,ma=150,ba=150,gn=1;function Qi(s,t){return s.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??Lt}var va=26,eo=4;function ns(s,t){let e=Math.max(ma,ba/gn);return Math.ceil(ht+Math.max(0,s-1)*Qn+hn+Math.max(0,t-1)*es+e*(s+gn*t))}function Pe(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function _e(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function ke(s){return new Map(Pe(s).map((t,e)=>[t,he(e)]))}function ye(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function ge(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function ss(s,t){return t==="none"?"Not needed":_e(s).includes(t)?ge(s,t):t}function to(s){return s.leave_by!=null&&s.leave_by>s.start&&s.leave_by<s.end?` · leave ${F(s.leave_by)}`:""}function mn(s){if(s.busy_why==="days"){if(s.start<=0&&s.end>=1440)return"All day";if(s.start<=0)return`Until ${F(s.end)}`;if(s.end>=1440)return`From ${F(s.start)}`}return`${F(s.start)}–${F(s.end)}`}function bn(s,t){return t.own?ge(s,t.own):ye(s,t.kid)}var Rt={color:dn,rgb:Xn,ink:dn};function no(s,t){return t.own?Rt:ke(s).get(t.kid)??he(0)}function ya(s,t){let e=Pe(s);return t.along.map(n=>e.includes(n)?ye(s,n):ge(s,n))}function vn(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function xa(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function pn(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function Zn(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(pn(t,n.from)),e.push(pn(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(pn(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function wa(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,a)=>r.s-a.s||a.en-r.en),e=[],n=[],o=-1/0,i=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(i(),o=-1/0);let a=n.findIndex(c=>c<=r.s);a<0?(a=n.length,n.push(r.en)):n[a]=r.en,r.col=a,e.push(r),o=Math.max(o,r.en)}return i(),t}function ka(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return s[s.length-1].y}function $a(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return s[s.length-1].t}function so(s,t){return ka(s.anchors,t)}function is(s,t){return $a(s.anchors,t)}function Ta(s,t){let e=Pe(s),n=_e(s),o=Math.max(t,ns(e.length,n.length)),r=(o-ht-Math.max(0,e.length-1)*Qn-hn-Math.max(0,n.length-1)*es)/(e.length+gn*n.length||1),a=Math.floor(r),c=Math.floor(r*gn),l=s.whole_week??s.days,d=new Map;for(let v of l)for(let $ of v.events)for(let M of $.own?$.along:[$.kid]){let p=d.get(M)??[];p.some(O=>O.event_id===$.event_id&&O.calendar_id===$.calendar_id)||p.push($),d.set(M,p)}let u=ke(s),h=[],g=ht;e.forEach((v,$)=>{let M=d.get(v)??[],p=s.days.some(O=>O.events.some(U=>U.kid===v&&(U.sides.includes("drop")&&U.drop===""||U.sides.includes("pick")&&U.pick==="")));h.push({id:v,kind:"kid",x:g,w:a,name:ye(s,v),dot:u.get(v).color,rgb:u.get(v).rgb,sub:`${p?"Needs a ride · ":""}${M.length} this week`,subWarn:p}),g+=a+($<e.length-1?Qn:0)});let S=g+hn/2;return g+=hn,n.forEach((v,$)=>{let M=0,p=0;for(let O of l){let U=O.drivers[v];U&&(M+=U.outings.length,p+=U.drive??0)}h.push({id:v,kind:"driver",x:g,w:c,name:ge(s,v),dot:dn,rgb:Xn,sub:`${M} ${M===1?"trip":"trips"} this week · ${Tt(p)} driving`,subWarn:!1}),g+=c+($<n.length-1?es:0)}),{columns:h,sepX:S,width:o}}function _a(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function Vi(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${F(s.start)}`:e||!t?`${s.title} until ${F(s.end)}`:`${s.title} ${F(s.start)}–${F(s.end)}`}function os(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length+(s.unplaced?.length??0)}function rs(s,t){let e=Se(t,s);return e===0?"Today":e===1?"Tomorrow":""}function ce(s,t=0){return s==null||!Number.isFinite(s)?t:s}function ts(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),o=1,i=0;for(let r of s.split(/\s+/).filter(Boolean)){let a=r.length;for(i===0?i=a:i+1+a<=n?i+=1+a:(o++,i=a);i>n;)o++,i-=n}return o}var io=25,Ea=15,oo=3;function qi(s){return Math.max(0,Math.min(oo,Math.floor((s-io)/Ea)))}var Ca=io+2,Gi=20;function Yi(s){return/^(\d+:\d\d)\s+Home$/.exec(s.at(-1)??"")?.[1]??null}var fn="🚗";function Xi(s,t){if(s===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,i,r,a=!1)=>({at:o,who:i,stays:a,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(s))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(s))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(s))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}return null}var Ji={muted:0,normal:1,pending:2,problem:3};function ro(s){let{drop:t,pick:e}=s,n=t?Xi(t.text,"drop"):null,o=e?Xi(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return s;let i=[t,e].reduce((c,l)=>l&&(Ji[l.tone]??1)>(Ji[c]??1)?l.tone:c,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${fn} No rides yet`,tone:i},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let c=`${fn} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${c} both ways`,tone:i},pick:null}:{drop:{text:`${c} ↓${n.at} ↑${o.at}`.trimEnd(),tone:i},pick:null}}let r=(c,l)=>c==="needed"?`${l} needed`:`${l}${c.at?`${c.at} `:" "}${c.who}${c.stays?" stays":""}${c.extra}`,a=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${fn} ${a.join(" · ")}`,tone:i},pick:null}}function Zi(s,t){let e=t-23,n=`${F(s.start)}–${F(s.end)}`+(s.arrive_by!=null?` · arrive ${F(s.arrive_by)}`:"")+to(s),o=33+ts(n,e,6.6)*16,i=s.own?s.lines:ro(s.lines);for(let r of[i.drop,i.pick])r&&(o+=2+ts(r.text,e,7)*16);return o+4}function ao(s,t,e,n){let o=t==="compact",{columns:i,sepX:r,width:a}=Ta(s,e),c=new Map(i.map(p=>[p.id,p])),l=Pe(s),d=_e(s),u=[...l,...d],h=ke(s),g=xa(s),S=p=>ye(s,p),v=p=>ge(s,p),$={mode:t,width:a,height:0,columns:i,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},M=0;return s.days.forEach((p,O)=>{let U=O*1440,Y=new Map(p.events.map(m=>[m.id,m])),de=m=>m&&Y.has(m)?{day:p.date,event:m}:null,x=os(p),w=p.events.length,y=rs(p.date,n.date),_=Pa(s,p,h,a);$.dayHeads.push({date:p.date,y:M,label:Ae(p.date),tag:y,sub:(w?`${w} ${w===1?"activity":"activities"}${p.done?" left":""}`:p.done?"All done for today":"Nothing scheduled")+(x?` · ${x} to sort out`:""),warn:x>0,h:Lt+(_?_.h+eo+2:0),allDay:_?.chips??[]}),$.anchors.push({t:U,y:M});let C=$.dayHeads[$.dayHeads.length-1],D=M+C.h+Jn,j=d.flatMap(m=>p.drivers[m]?.outings??[]);if(!w&&!j.length){$.empties.push({key:p.date,y:D,text:p.done?"Nothing else today":"Nothing planned"}),M=D+40,$.anchors.push({t:U+1439,y:M});return}let V=(m,B,z,T,b,k,A,P=m.kid)=>{let K=!!m.own&&P===m.own,L=!!m.own&&P!==m.own,H=K?Rt:h.get(P)??he(0),ie=K?v(P):S(P),fe=L?{drop:{text:`With ${v(m.own)}`,tone:m.attending===!1?"muted":"normal"},pick:null}:A&&!m.own?ro(m.lines):m.lines,q=K?ya(s,m):[],$e=(m.takes!=null?`${m.takes} min, any time ${F(m.start)}–${F(m.end)}`:mn(m)+(m.arrive_by!=null?` · arrive ${F(m.arrive_by)}`:"")+to(m))+(q.length?` · with ${vn(q)}`:"");return{key:`${p.date}|card|${m.id}`+(m.own?`|${P}`:""),x:B,y:z,w:T,h:b,target:{day:p.date,event:m.id},event:m,color:H,kidName:ie,clash:k,stayed:!m.own&&m.stay&&d.includes(m.drop),skipped:m.attending===!1,title:_a(m.title,ie),time:$e,drop:fe.drop,pick:fe.pick,showDrop:!!fe.drop&&(A||b>=56),showPick:!!fe.pick&&(A||b>=74),wrap:A,aria:`${ie}, ${m.title} ${m.takes!=null?`any time from ${F(m.start)} to ${F(m.end)}`:mn(m).replace("–"," to ")}. `+(m.attending===!1&&!fe.drop?"Not attending. ":"")+[fe.drop,fe.pick].filter(Ie=>!!Ie).map(Ie=>Ie.text).join(". ")}},Z=m=>{let B=p.rides[m];return B?(p.drivers[B.driver]?.segments??[]).filter(T=>T.type!=="home"&&T.kids.includes(B.kid)&&ce(T.start)>=ce(B.start)&&ce(T.end)<=ce(B.end)):[]},ee=m=>{let B=p.rides[m];if(!B)return null;let z=B.serves.find(T=>Y.get(T)?.kid===B.kid);return de(z??B.serves[0])},N=(m,B)=>{if(B.event)return B;let z=p.events.find(T=>T.own&&T.own!==m&&T.along.includes(m)&&T.title===B.title);return z?{...B,title:`${B.title} with ${v(z.own)}`}:B},J=m=>{if(m.takes==null)return[m.start,m.end];let B=m.planned??m.start;return[B,B+m.takes]},Q=new Map;for(let m of p.issues)m.level!=="problem"||!m.event||(m.kind==="late"&&Q.set(m.event,`${Math.round(ce(m.minutes))} min late`),m.kind==="waiting"&&Q.set(`${m.event}|pick`,`Waits ${Math.round(ce(m.minutes))} min`));if(!o){let m=1/0,B=-1/0;for(let L of p.events)L.start<=0&&L.end>=1440||(L.start>0?m=Math.min(m,L.start-20,L.arrive_by!=null?L.arrive_by-10:1/0):m=Math.min(m,L.end-30),L.end<1440?B=Math.max(B,L.end+20):B=Math.max(B,L.start+30));for(let L of j)L.start!=null&&(m=Math.min(m,L.start)),L.end!=null&&(B=Math.max(B,L.end));let z=p.from;z!=null&&Number.isFinite(m)&&m<z+60?m=z-15:p.date===n.date&&Number.isFinite(m)&&n.minutes>m-60&&n.minutes<B&&(m=Math.min(m,n.minutes-15));let T=Number.isFinite(m)?Math.floor((m-5)/30)*30:900,b=Math.max(Number.isFinite(B)?Math.ceil((B+5)/30)*30:960,T+60),k=L=>z!=null&&ce(L)<=T,A=L=>z!=null&&ce(L)<T,P=L=>Math.round(D+(Math.max(T,Math.min(b,L))-T)*ga);$.anchors.push({t:U+T,y:P(T)},{t:U+b,y:P(b)});for(let L of l){let H=c.get(L),ie=h.get(L),fe=(p.kids[L]?.items??[]).filter(R=>R.start!=null&&R.end!=null&&!k(R.end)).map(R=>({item:R,s:ce(R.start),en:ce(R.end)})),q=[];for(let R of wa(fe)){let W=H.w/R.cols,G=Math.round(H.x+R.col*W),te=Math.round(W-(R.cols>1?4:0)),oe=P(R.s),ne=R.item;if(ne.type==="act"){let we=Y.get(ne.event??"");if(!we)continue;let Wt=Math.max(30,P(R.en)-oe),lt=V(we,G,oe,te,Wt,ne.clash,!1,L);if(lt.layer=Dt,lt.cut=A(R.s),$.cards.push(lt),we.arrive_by!=null&&we.start-we.arrive_by>=5&&!lt.cut){let Ln=P(we.arrive_by),Qs={key:`${p.date}|prep|${we.id}`,x:G,y:Ln,w:te,h:oe-Ln+Me,color:ie,label:`Arrive by ${F(we.arrive_by)}`,layer:Dt-1};$.preps.push(Qs),q.push({s:we.arrive_by,en:R.en,top:Ln,bottom:oe+Wt,x:G,w:te,prep:Qs,card:lt})}else q.push({s:R.s,en:R.en,top:oe,bottom:oe+Wt,x:G,w:te,card:lt});let Js=Q.get(we.id);Js&&$.marks.push({key:`${p.date}|late|${we.id}`,x:G+te-4,y:oe+4,text:Js,right:!0});let Zs=Q.get(`${we.id}|pick`);Zs&&$.marks.push({key:`${p.date}|wait|${we.id}`,x:G+4,y:oe+Wt+2,text:Zs,right:!1});continue}let X=p.rides[ne.ride??-1];if(!X)continue;let Ce=Math.max(22,P(R.en)-oe),wt=Zn(Z(X.index),g),Gs=v(X.driver),Ys={key:`${p.date}|ride|${X.index}`,x:G,y:oe,w:te,h:Ce,target:ee(X.index),l1:`${X.own?"In":"Along in"} ${Gs}’s car`,l2:wt.join(" → "),show2:qi(Ce)>0,lines2:qi(Ce),dashed:!X.own,clash:ne.clash,aria:`${S(L)} ${X.own?"in":"riding along in"} ${Gs}’s car, ${F(ce(X.start))} to ${F(ce(X.end))}: ${wt.join(" to ")}`};$.rides.push(Ys);let Xs=c.get(X.driver),Dn=null;Xs&&(Dn={key:`${p.date}|band|${X.index}`,x:G+te,y:oe,w:Math.max(0,Xs.x+8-(G+te)),h:Ce,color:ie},$.bands.push(Dn)),q.push({s:R.s,en:R.en,top:oe,bottom:oe+Ce,x:G,w:te,ride:Ys,band:Dn})}let $e=R=>R.ride?.layer??(R.prep?Dt-1:Dt),Ie=(R,W,G,te)=>{G>Me&&$.links.push({key:`${R.key}|link`,x:R.x,y:W,w:R.w,h:G,color:ie,layer:te})},I=(R,W)=>{if(!(W.x<R.x||W.x+W.w>R.x+R.w)&&(R.x=W.x,R.w=W.w,R.ride.x=W.x,R.ride.w=W.w,R.band)){let G=R.band.x+R.band.w;R.band.x=W.x+W.w,R.band.w=Math.max(0,G-R.band.x)}},le=new Set;for(let R of[...q].sort((W,G)=>G.s-W.s)){let W=R.ride;if(!W)continue;let G=q.filter(ne=>ne!==R&&ne.s>=R.en&&ne.s-R.en<=Wi&&ne.top>=R.bottom).sort((ne,X)=>ne.s-X.s||ne.top-X.top)[0];if(!G)continue;le.add(R),I(R,G);let te=$e(G),oe=G.top-R.bottom;Ie(W,R.bottom,oe+Me,te-1),W.layer=te-(oe>0?2:1),W.h+=Me,W.tuckBottom=Me}for(let R of[...q].sort((W,G)=>W.s-G.s)){let W=R.ride;if(!W||le.has(R))continue;let G=q.filter(ne=>ne!==R&&ne.en<=R.s&&R.s-ne.en<=Wi&&ne.bottom<=R.top&&(ne.card||ne.ride?.layer!=null)).sort((ne,X)=>X.en-ne.en||X.bottom-ne.bottom)[0];if(!G)continue;I(R,G);let te=G.ride?.layer??Dt,oe=R.top-G.bottom;Ie(W,G.bottom-Me,oe+Me,te-1),W.layer=te-(oe>0?2:1),W.y-=Me,W.h+=Me,W.tuckTop=Me}}for(let L of d){let H=c.get(L),ie=p.drivers[L];if(!ie)continue;let fe=[],q=null;for(let I of ie.segments)if(!(I.start==null||I.end==null)){if(I.type==="home"){q=null;continue}if(I.type==="stay"){q=null,fe.push({type:"stay",g:I,s:I.start,en:I.end});continue}q&&q.en===I.start?(q.en=I.end,q.legs.push(I)):(q={type:"trip",s:I.start,en:I.end,legs:[I]},fe.push(q))}let $e=new Set,Ie=(I,le,R,W)=>{$e.add(I.id);let G=P(le),te=V(I,H.x+8,G,H.w-16,Math.max(30,P(R)-G),!1,!1,L);te.cut=A(le),W&&te.drop?.tone==="normal"&&(te.drop=null,te.showDrop=!1),$.cards.push(te)};for(let I of fe){if(k(I.en))continue;let le=P(I.s),R=Math.max(24,P(I.en)-le);if(I.type==="stay"){let X=Y.get(I.g.event??I.g.serves??"");if(X?.own===L){Ie(X,I.s,I.en,!0);continue}let Ce=X?h.get(X.kid)??he(0):he(0),wt=I.g.kids.map(S);$.stays.push({cut:A(I.s),key:`${p.date}|stay|${L}|${I.s}`,x:H.x+8,y:le,w:H.w-16,h:R,target:de(X?.id),color:Ce,l1:X?`At ${X.title} with ${S(X.kid)}`:"Staying",l2:`until ${F(I.en)}`+(wt.length?` · ${wt.join(" and ")} too`:"")});continue}let W=I.legs[0],G=I.legs[I.legs.length-1],te=[];for(let X of I.legs)for(let Ce of X.kids)te.includes(Ce)||te.push(Ce);let oe=G.type==="drive"&&G.to==="home",ne=Zn(I.legs,g);$.trips.push({key:`${p.date}|trip|${L}|${I.s}`,x:H.x+8,y:le,w:H.w-16,h:R,target:de(I.legs.find(X=>X.serves)?.serves),l1:W.type==="drive"&&W.from==="home"?`Leave ${F(I.s)}`:`From ${pn(g,W.from??W.place)} ${F(I.s)}`,l2:ne.join(" → "),show2:R>=36,l3:oe?`Home ${F(I.en)}`:"",show3:oe&&R>=62,stops:null,kids:te.map(X=>(h.get(X)??he(0)).color),bad:I.legs.some(X=>X.overlaps_busy),aria:`${v(L)} drives ${ne.join(" to ")}, ${F(I.s)} to ${F(I.en)}`})}for(let I of ie.segments)if(!(!I.overlaps_busy||I.start==null||I.end==null))for(let le of ie.busy){let R=Math.max(I.start,le.start),W=Math.min(I.end,le.end);W<=R||k(W)||$.overlaps.push({key:`${p.date}|overlap|${L}|${R}`,x:H.x+6,y:P(R)-2,w:H.w-12,h:Math.max(8,P(W)-P(R)+4)})}for(let I of p.events)if(I.own===L&&(!$e.has(I.id)&&!k(J(I)[1])&&Ie(I,...J(I),!1),I.takes!=null&&I.attending!==!1&&!k(I.end))){let le=P(I.start);$.windows.push({key:`${p.date}|window|${I.id}`,x:H.x+4,y:le,w:H.w-8,h:Math.max(24,P(I.end)-le),label:`${I.title} · any time ${F(I.start)}–${F(I.end)}`})}for(let I of ie.busy){if(I.event||I.end<=T||I.start>=b)continue;let le=N(L,I),R=P(le.start),W=P(le.end);$.busy.push({key:`${p.date}|busy|${L}|${le.start}`,x:H.x+1,y:R,w:H.w-2,h:W-R,labelY:8,label:Vi(le,!1)})}}let K=-1/0;for(let L=T;L<=b;L+=30)$.grid.push({key:`${p.date}|grid|${L}`,y:P(L),strong:L%60===0}),L%60===0&&P(L)-K>=22&&($.hours.push({key:`${p.date}|hour|${L}`,y:P(L)-8,label:gi(L)}),K=P(L));p.date===n.date&&n.minutes>T&&n.minutes<b&&($.now={y:P(n.minutes),label:`Now ${F(n.minutes)}`}),M=P(b)+Jn;return}let se=[];for(let m of l){let B=c.get(m);for(let z of p.kids[m]?.items??[])if(z.start!=null){if(z.type==="act"){let T=Y.get(z.event??"");if(!T)continue;se.push({col:m,s:z.start,h:Zi(T,B.w),kind:"act",item:z})}else if(!p.rides[z.ride??-1]?.own){let T=p.rides[z.ride??-1],b=T?p.drivers[T.driver]?.outings.find(k=>k.start!=null&&k.start<=ce(T.start)&&ce(T.start)<=ce(k.end,k.start)):void 0;se.push({col:m,s:b?.start??z.start,h:Ca,kind:"along",item:z})}}}for(let m of d){let B=p.drivers[m];if(!B)continue;for(let T of B.busy)T.event||se.push({col:m,s:T.start,h:32,kind:"busy",busy:N(m,T)});let z=c.get(m).w;for(let T of p.events)T.own!==m||!T.busy_only&&T.attending!==!1&&(T.takes==null||T.planned!=null)||se.push({col:m,s:J(T)[0],h:Zi(T,z),kind:"own",event:T});for(let T of B.outings){if(T.start==null)continue;let k=[...Yi(T.lines)?T.lines.slice(0,-1):T.lines,...T.warn?[T.warn]:[]].reduce((A,P)=>A+ts(P,z-36,7),0);se.push({col:m,s:T.start,h:30+k*16,kind:"out",out:T})}}se.sort((m,B)=>m.s-B.s||u.indexOf(m.col)-u.indexOf(B.col));let xe=new Map,pe=[],ue=new Map,Ee=D-Gi;for(let m=0;m<se.length;){let B=m,z=Ee+Gi;for(;B<se.length&&se[B].s===se[m].s;B++){let b=xe.get(se[B].col);b!=null&&(z=Math.max(z,b+un))}let T=new Set;for(let b=m;b<B;b++){let k=se[b],A=T.has(k.col)?xe.get(k.col)+un:z;T.add(k.col),xe.set(k.col,A+k.h)}ue.set(se[m].s,z),se[m].s>0&&$.hours.push({key:`${p.date}|hour|${se[m].s}`,y:z+2,label:Ue(se[m].s)}),Ee=z,m=B}xe.clear(),se.forEach((m,B)=>{let z=xe.get(m.col),T=Math.max(z!=null?z+un:D,ue.get(m.s));xe.set(m.col,T+m.h);let b=m.kind==="busy"?m.busy.end:m.kind==="act"?Y.get(m.item.event??"")?.end??null:m.kind==="own"?J(m.event)[1]:null;pe.push({col:m.col,s:m.s,end:b,y:T,h:m.h,box:null}),$.anchors.push({t:U+m.s,y:T});let k=c.get(m.col);if(m.kind==="busy"){let A={key:`${p.date}|busy|${m.col}|${B}`,x:k.x+1,y:T,w:k.w-2,h:m.h,labelY:8,label:Vi(m.busy,!0)};$.busy.push(A),pe[pe.length-1].box=A}else if(m.kind==="out"){let A=m.out,P=Yi(A.lines),K=P?A.lines.slice(0,-1):A.lines;$.trips.push({key:`${p.date}|trip|${m.col}|${B}`,x:k.x+8,y:T,w:k.w-16,h:m.h,target:de(A.target),l1:P?`${A.lead} · home ${P}`:A.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...K.map(L=>({text:L,warn:!1})),...A.warn?[{text:A.warn,warn:!0}]:[]],kids:A.kids.map(L=>(h.get(L)??he(0)).color),bad:!!A.warn,aria:`${v(m.col)}: ${A.lead}. ${A.lines.join(". ")}${A.warn?`. ${A.warn}`:""}`})}else if(m.kind==="own"){let A=V(m.event,k.x+8,T,k.w-16,m.h,!1,!0,m.col);$.cards.push(A),pe[pe.length-1].box=A}else if(m.kind==="act"){let A=Y.get(m.item.event??""),P=V(A,k.x,T,k.w,m.h,m.item.clash,!0,m.col);$.cards.push(P),pe[pe.length-1].box=P}else{let A=p.rides[m.item.ride??-1],P=Zn(Z(A.index),g),K=v(A.driver);$.rides.push({key:`${p.date}|ride|${A.index}`,x:k.x,y:T,w:k.w,h:m.h,target:ee(A.index),l1:`${fn} with ${K}`,l2:P.join(" → "),show2:!1,lines2:oo,dashed:!0,clash:m.item.clash,aria:`${S(m.col)} riding along with ${K}, ${F(ce(A.start))} to ${F(ce(A.end))}: ${P.join(" to ")}`})}});let be=D;for(let m of xe.values())be=Math.max(be,m);for(let m of pe){if(!m.box||m.end==null)continue;let B=m.y+m.h;for(let z of pe)z.col!==m.col&&z.s>=m.s&&z.s<m.end&&(B=Math.max(B,z.y+z.h));m.end>=1440&&(B=be);for(let z of pe)z.col===m.col&&z.y>m.y&&(B=Math.min(B,z.y-un));B=Math.min(B,be),B>m.y+m.h&&(m.box.h=B-m.y)}M=be+Jn+6,$.anchors.push({t:U+1439,y:M})}),$.height=M,$}var Aa=["","¼","½","¾"];function Qe(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return Tt(n);let o=Math.round(n*4),i=Math.floor(o/4),r=Aa[o%4];return`${i||!r?i:""}${r} min`})}function lo(s){let t=e=>e?{...e,text:Qe(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(Qe),warn:i.warn==null?i.warn:Qe(i.warn)}))}])),issues:e.issues.map(n=>({...n,title:Qe(n.title),body:Qe(n.body),note:n.note==null?n.note:Qe(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:Qe(o.note)}))}:{}}))}))}}var Sa=2,Ma=48;function co(s,t,e=Ma){let n=[],o=new Set(_e(s)),i=Pe(s).map(h=>ye(s,h)),r=i.length>1?i.slice(0,2):[i[0]??"Ava","Ben"],a=0,c=0,l=0,d=0,u=t.minutes+e*60;for(let h of s.days){let g=Se(t.date,h.date),S=g===0?"":`${ve(h.date)} · `,v=new Map(h.events.map(p=>[p.id,p])),$=p=>p&&v.has(p)?{day:h.date,event:p}:null,M=(p,O)=>g*1440+(p??v.get(O??"")?.start??0)<u;for(let p of h.issues)if(p.level==="problem"){if(!M(p.at,p.event)){l++,p.kind==="unassigned"&&d++;continue}a++,p.kind==="unassigned"&&c++,n.push({key:`${h.date}|${p.key}`,tone:p.kind==="unassigned"?"unassigned":"problem",title:S+p.title,body:p.body,target:$(p.event),suggestions:(p.suggestions??[]).map(O=>({id:O.id,label:O.label,note:O.note}))})}if(h.clashes.forEach((p,O)=>{if(!M(p.a.start,p.a.event)){l++;return}a++;let U=v.get(p.a.event??""),Y=ye(s,p.kid),de=(w,y)=>{let _=$(y);return _?{text:w,target:_}:w},x=[];if(p.b.type==="act"){let w=v.get(p.b.event??"");U&&w&&(x=[de(U.title,U.id),` ${F(U.start)}–${F(U.end)} and `,de(w.title,w.id),` ${F(w.start)}–${F(w.end)} overlap.`])}else{let w=h.rides[p.b.ride??-1];U&&w&&(x=[`${Y} is in `,de(`${ge(s,w.driver)}’s car`,w.serves[0]),` ${F(ce(p.b.start))}–${F(ce(p.b.end))}, during `,de(U.title,U.id),"."])}n.push({key:`${h.date}|clash|${O}`,tone:"problem",title:`${S}${Y} is double-booked`,body:x.map(w=>typeof w=="string"?w:w.text).join(""),parts:x,target:null,suggestions:[]})}),g>=0&&g<Sa)for(let p of h.issues)p.level!=="heads_up"||!M(p.at,p.event)||n.push({key:`${h.date}|${p.key}`,tone:"heads_up",title:S+p.title,body:p.body,target:$(p.event),suggestions:[]});for(let p of h.unplaced??[]){if(!M(p.at)){l++;continue}a++;let O=p.people.map(U=>o.has(U)?ge(s,U):ye(s,U));n.push({key:`${h.date}|unplaced|${p.id}`,tone:"problem",title:`${S}${F(p.at)} ${p.title}: ${uo(p).toLowerCase()}`,body:p.reason==="unknown"&&p.word?`“${p.word}” isn’t anyone in the family, so this is only in ${vn(O)}’s lane. If it’s a misspelt name, fix the title in Google Calendar.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Start the title in Google Calendar with who it’s for, such as “${r[0]} Piano”, or “${r.join(" & ")} Piano” for both.`,target:null,suggestions:[]})}for(let p of h.events)!p.problems.length||!M(p.start)||n.push({key:`${h.date}|notes|${p.id}`,tone:"heads_up",title:`${S}Check the notes on ${bn(s,p)}’s ${p.title}`,body:`These lines couldn’t be read: ${p.problems.join("; ")}`,target:$(p.id),suggestions:[]})}return{items:n,problems:a,unassigned:c,later:l,laterUnassigned:d}}function uo(s){return s.reason==="unknown"&&s.word?`Who is “${s.word}”?`:"Who is this for?"}function Pa(s,t,e,n){let o=new Set(_e(s)),i=d=>{let u=d[0];return u==null?null:o.has(u)?Rt:e.get(u)??null},r=[...(t.all_day??[]).map(d=>({key:`${t.date}|allday|${d.id}`,title:d.title,note:d.days>1?`Day ${d.day_number} of ${d.days}`:"",color:i(d.people),cancelled:d.cancelled,warn:!1})),...(t.unplaced??[]).map(d=>({key:`${t.date}|unplaced|${d.id}`,title:`${F(d.at)} ${d.title}`,note:uo(d),color:null,cancelled:!1,warn:!0}))];if(!r.length)return null;let a=Math.max(120,n-ht),c=1,l=0;for(let d of r){let u=Math.min(a,30+7*(d.title.length+(d.note?d.note.length+2:0)));l&&l+u>a&&(c++,l=0),l+=u}return{key:`${t.date}|allday`,h:c*va+(c-1)*eo,chips:r}}function ho(s,t){let e=ke(s),n=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=Se(t.date,i.date);if(!(r<0))for(let a of _e(s))for(let c of i.drivers[a]?.outings??[]){if(c.start==null)continue;let l=r*1440+c.start;if(r*1440+ce(c.end,c.start)<=t.minutes)continue;let u=l-t.minutes,h={driver:a,name:ge(s,a),date:i.date,ahead:r,start:c.start,inMinutes:u,ongoing:u<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(g=>e.get(g)??he(0)),warn:c.warn,target:c.target&&i.events.some(g=>g.id===c.target)?{day:i.date,event:c.target}:null};(!n||o(h)<o(n)||o(h)===o(n)&&h.inMinutes<n.inMinutes)&&(n=h)}}return n}function pt(s){return s.state==="done"||s.state==="late"}var Da=780;function La(s,t,e){return s.state==="open"&&!!s.for_day&&s.due===t&&e<Da}function po(s,t){return s.chores.map(e=>La(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function fo(s){return s.state==="open"||s.state==="overdue"}function cs(s,t,e){if(pt(s)){let n=s.done_at?Ra(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${as(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${as(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let o=Se(t,s.due);return`By ${o===1?"tomorrow":o<7?ve(s.due):ls(s.due)}`}if(s.for_day&&s.due===t)return`Tonight · for ${as(s.for_day,t)}`;if(s.due&&s.due>t){let n=Se(t,s.due);return n===1?"By tomorrow":`By ${n<7?ve(s.due):ls(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function as(s,t){let e=Se(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?ve(s):ls(s)}function ls(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Ra(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let i=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return i===t?r:`${ve(i)} ${r}`}function go(s,t,e=1440){let n=po(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=n.filter(d=>d.kid===o.id),a=new Map;for(let d of r){if(d.state!=="upcoming")continue;let u=d.shows_from??d.due??s.today;a.set(u,[...a.get(u)??[],d])}let c=r.filter(d=>d.state==="overdue"),l=r.filter(d=>d.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??he(i),overdue:c,now:l,done:r.filter(pt),later:[...a.entries()].sort(([d],[u])=>d.localeCompare(u)).map(([d,u])=>({date:d,chores:u})),left:c.length+l.length}})}function mo(s,t=1440){return po(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function ds(s){return!s.chores.length&&!s.templates.length}var et=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function us(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,i]=n.split("-").map(r=>et.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function hs(s){let t=[...new Set(s)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${et[n[0]]}-${et[n.at(-1)]}`]:n.map(o=>et[o])).join(", ")}var tt="none";function yn(s){return s==="daily"||s==="school"?"":"Any"}function bo(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function vo(s){let t=s.days??yn(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function ps(s){return s.title.trim()?s.who.length?s.days===tt?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function yo(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function fs(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function gs(s,t,e=1,n=!1,o=!1){if(s==="school"){let d=t.trim().replace(/-/g,"–"),u=o?d?`${d} Bring lunch days`:"Bring lunch days":d?`${d} school days`:"Every school day";return n?`${u}, the night before`:u}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,a=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(a))return e>1?`Every day, every ${e} weeks`:"Every day";if(!a||a.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${a.replace(/-/g,"–")} ${r}`;let l=`${a.split(",").map(d=>{let u=d.trim();return u.toLowerCase()==="last"?"the last day":/^\d+$/.test(u)?`the ${fs(Number(u))}`:`the ${u}`}).join(" and ")} ${r}`;return l[0].toUpperCase()+l.slice(1)}function ms(s,t,e=!1){let n=s.map(i=>t.find(r=>r.id===i)?.name??i);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function bs(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function xn(s,t){return`${s}|${t}`}function ft(s,t){let[e,n,o]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function wn(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function xo(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function wo(s,t){return wn(t)<5&&!xo(s,t)}function It(s,t,e=new Map){if(!wo(s,t))return null;let n=xn(s.id,t);if(e.has(n)){let i=e.get(n);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[t];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function gt(s,t){return wo(s,t)?s.menus?.[t]??null:null}var Ia="From the school's menu feed.";function Ba(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==Ia);return t.length?t.join(`
`):null}function De(s){return s.slice(0,7)}function kn(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function vs(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function ko(s){let t=[];for(let e=De(s.first);e<=De(s.last);e=vs(e))t.push(e);return t}function $o(s,t,e,n=new Map){let o=`${e}-01`,i=ft(o,-wn(o)),r=[];for(;De(i)<=e;){let a=[];for(let c=0;c<5;c++){let l=ft(i,c),d=De(l)!==e,u=d?null:xo(t,l),h=d?null:It(t,l,n);a.push({date:l,day:Number(l.slice(8)),outside:d,off:u?u.title:null,lunch:h?.lunch??null,picked:h?.picked??!1,menu:d?null:gt(t,l)?.dish??null,sides:d?null:Ba(gt(t,l)?.details??""),past:l<s.today,today:l===s.today})}a.some(c=>!c.outside)&&r.push(a),i=ft(i,7)}return r}function To(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function _o(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function Eo(s,t,e,n=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=ft(t,i),a=It(s,r,n);if(!a)continue;let c=Se(t,r);return{lunch:a.lunch,when:c===0?"today":c===1?"tomorrow":ve(r),date:r,menu:gt(s,r)?.dish??null}}return null}var Oa={timeline:"timeline",full:"timeline",compact:"compact"};function nt(s){let t=new URLSearchParams(s),e={},n=Oa[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((t.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((t.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}var ja=["auth_callback","code","state"];function ys(s){let t=new URLSearchParams(s);for(let n of ja)t.delete(n);let e=t.toString();return e?`?${e}`:""}function xs(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Na(s,t){let e=t.takes!=null&&t.planned!=null?t.planned+t.takes:t.end;if(t.attending===!1)return t.end;for(let n of s.rides)n.serves.includes(t.id)&&n.end!=null&&(e=Math.max(e,n.end));for(let n of Object.values(s.drivers))for(let o of n.segments)o.type==="home"||o.end==null||(o.serves===t.id||o.event===t.id)&&(e=Math.max(e,o.end));return e}function za(s,t){let e=[],n=[],o=()=>{let i=n[n.length-1];i&&xs(i.end)>t&&e.push(...n),n=[]};for(let i of s){if(i.start==null||i.end==null)continue;if(i.type==="home"||i.type==="stay"){o(),i.end>t&&e.push(i);continue}let r=n[n.length-1];r&&r.end!==i.start&&o(),n.push(i)}return o(),e}function Ua(s,t){let e=new Set(s.events.filter(i=>Na(s,i)<=t).map(i=>i.id)),n=i=>xs(s.rides[i??-1]?.end,-1)<=t,o=i=>i.type==="act"?e.has(i.event??""):n(i.ride);return{...s,events:s.events.filter(i=>!e.has(i.id)),kids:Object.fromEntries(Object.entries(s.kids).map(([i,r])=>[i,{...r,items:r.items.filter(a=>!o(a))}])),drivers:Object.fromEntries(Object.entries(s.drivers).map(([i,r])=>[i,{...r,segments:za(r.segments,t),outings:r.outings.filter(a=>a.start==null||xs(a.end,a.start)>t),busy:r.busy.filter(a=>a.end>t)}])),clashes:s.clashes.filter(i=>!o(i.a)&&!o(i.b)),issues:s.issues.filter(i=>!i.event||!e.has(i.event)),done:e.size,from:t}}function Co(s,t){return{...s,whole_week:s.whole_week??s.days,days:s.days.filter(e=>e.date>=t.date).map(e=>e.date===t.date?Ua(e,t.minutes):e)}}var Ao=qe`
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
`;var hr="mydashlight.rides.view",yc=1100,xc=440,wc=700,kc=3*6e4,cr=1200,$c=450,Tc=110;function _c(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var Pn=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,dr=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Ec=new URL("emoji.json",import.meta.url).href,ur=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],zs=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Us=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Cc=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Ac=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,jt={bring:"Bring",buy:"Buy"};function Sc(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function Re(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function Hs(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Mc(s,t){return rs(s,t)||Ae(s).split(",")[0]}function Pc(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function Dc(){try{return localStorage.getItem(hr)==="timeline"?"timeline":"compact"}catch{return"compact"}}function Lc(s){try{localStorage.setItem(hr,s)}catch{}}function Nt(s){return s.days.every(t=>!t.events.length)}var zt=class extends Te{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.leaveTimer=null;this.holdTimer=null;this.holdRepeat=null;this.held=!1;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=nt(location.search).view;this.urlPage=nt(location.search).page;this.urlPast=nt(location.search).past;this.urlDayPicker=nt(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,i=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(i)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}this.onTouched(),n.el.scrollTop=n.top-i,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},kc))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.mode=this.urlView??Dc(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.leaveTimer,this.railTimer])e&&clearTimeout(e);this.stopHold(),this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,a]=o.split("|"),c=e.kids.find(l=>l.id===r);(!c||(c.picks[a]??null)===i||!It(c,a))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&pt(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(i=>i.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=lo(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<yc)return!1;let e=this.plan;return!e||this.width-xc>=ns(Pe(e).length,_e(e).length)}today(){return $t(this.plan?.time_zone??_c())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let n=this.today(),o=`${n.date}|${n.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:Co(e,n)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let i=this.board,r=this.boardPlan;this.board=ao(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o,i&&r&&this.keepPlace(i,r,e)}return this.board}keepPlace(e,n,o){let i=this.scroller;if(!i||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||i.scrollTop<=0)return;let r=e.dayHeads.find(d=>d.date===this.pinDay)?.h??Lt,a=is(e,i.scrollTop+r+4),c=n.days[Math.floor(a/1440)]?.date,l=c?o.days.findIndex(d=>d.date===c):-1;l>=0&&(this.keepAt=l*1440+(a-Math.floor(a/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n,o=!1){let i=this.scroller;if(!i||!this.board)return;let r=this.topFor(e,n);Math.abs(i.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?i.scrollTo({top:r,behavior:"smooth"}):i.scrollTop=r),this.syncDay()}topFor(e,n){let o=this.board,i=o.dayHeads.find(r=>r.date===n)?.y??0;return Math.max(i,so(o,e)-Qi(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let n=this.today(),o=Math.max(0,this.dayIndexOf(n.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(n.date)?n.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let n=this.nowSpot();n&&this.scrollToTime(n.t,n.date,e)}goToDay(e,n=!1){let o=this.boardPlan;if(!o)return;let i=this.today();if(e===i.date){this.scrollToNow(n);return}let r=this.dayIndexOf(e),a=o.days[r];if(!a)return;let c=1/0;if(this.mode==="timeline"){for(let l of a.events)c=Math.min(c,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let d of l.outings)d.start!=null&&(c=Math.min(c,d.start))}this.scrollToTime(r*1440+(Number.isFinite(c)?Math.max(0,c-30):0),e,n)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let c of this.board.dayHeads)c.y<=n+1&&(o=c);this.pinDay!==o.date&&(this.pinDay=o.date);let i=null,r=this.nowSpot(),a=this.today().date;if(r){let c=n-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),l=c>0?"up":"down";this.board.dayHeads.some(d=>d.date===a)&&o.date!==a?i=`${l}|Today`:this.mode==="timeline"&&Math.abs(c)>e.clientHeight*.6&&(i=`${l}|${o.date===a?"Now":"Today"}`)}this.away!==i&&(this.away=i)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,o),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let a=new Map(this.choreDraft);a.delete(e.id),this.choreDraft=a;let c=r instanceof re?r:new re("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??pt(e)}editMenu(e,n){let o=this.lunch?.kids??[],i=gt(e,n),r=o.filter(a=>a.id===e.id||i&&gt(a,n)?.dish===i.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let i=o instanceof re?o:new re("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let i=new Map(this.lunchDraft);for(let r of n)i.set(xn(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,n,o)}catch(r){let a=new Map(this.lunchDraft);for(let l of n)a.delete(xn(e,l));this.lunchDraft=a;let c=r instanceof re?r:new re("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?vo(e):bo(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(lr(),ar))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||ps(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(yo(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof re?n:new re("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof re?n:new re("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(i=>i.date===this.pinDay)?.h??Lt;this.keepAt=n&&this.board?is(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||Lc(e)}findEvent(e){let n=this.plan?.days.find(i=>i.date===e.day),o=n?.events.find(i=>i.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.flushLeave(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.flushLeave(),this.sel=null,this.arriveDraft=void 0,this.leaveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(i){let r=i instanceof re?i:new re("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o,i){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&i.includes(e.drop)){i.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope,!1));return}this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e,n,o){if(!this.backend)return;let i=this.backend;if(n&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>i.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",n,()=>i.setStay(e.id,n,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,a=r.includes(n)?r.filter(c=>c!==n):[...r,n];this.save(`along-${o}`,a,()=>i.setTakeAlong(e.id,a,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,i;n<0?i=(o??e.start)-5:i=o==null||o+5>=e.start?null:o+5,this.arriveDraft=i,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),cr)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,a)).then(()=>{this.arriveDraft=void 0})}nudgeLeave(e,n){let o=this.leaveDraft!==void 0?this.leaveDraft:e.leave_by??null,i;o==null?i=n<0?Math.max(e.start+5,e.end-15):null:n<0?i=Math.max(e.start+5,o-5):i=o+5>=e.end?null:o+5,this.leaveDraft=i,this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=setTimeout(()=>this.flushLeave(),cr)}clearLeave(){this.leaveDraft=null,this.flushLeave()}flushLeave(){this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=null;let e=this.leaveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||(o.event.leave_by??null)===e){this.leaveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("leave",e,()=>i.setLeaveBy(r,e,a)).then(()=>{this.leaveDraft=void 0})}startHold(e){this.stopHold(),this.held=!1,this.holdTimer=setTimeout(()=>{this.held=!0,e(),this.holdRepeat=setInterval(e,Tc)},$c)}stopHold(){this.holdTimer&&clearTimeout(this.holdTimer),this.holdRepeat&&clearInterval(this.holdRepeat),this.holdTimer=this.holdRepeat=null}tapStep(e){this.held?this.held=!1:e()}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=this.shownPlan(),i=o?co(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?mo(this.chores,this.today().minutes).filter(h=>!this.choreDone(h)):[],c=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,l=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",d=f`<aside class="panel" aria-label=${l}>
      ${c??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,a))}
    </aside>`,u=this.page==="rides";return f`
      <div class="app ${r?"wide":this.width<wc?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${u?this.renderBanner(e):E}
          <main>
            ${u?f`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?Nt(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                  ${n&&o&&!Nt(o)?this.renderDayRail(o):E}
                  ${n&&this.away?this.renderBackToToday(this.away):E}
                </section>`:this.page==="lunch"?f`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:f`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?f`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${d}`:E}
          </main>
        </div>
        ${r?d:E}
        ${this.toast?f`<div class="toast" role="status">${this.toast}</div>`:E}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let i=n.problems+o;this.tick;let r=this.today(),a="";if(e){let h=e.time_zone,g=new Date(e.updated);this.error?a=f`<span class="bad">${vi(this.error)} · showing the plan from ${Yt(g,new Date,h)}</span>`:e.status&&!e.status.ok?a=f`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Yt(g,new Date,h)}</span>`:this.backend?.live||(a=`Updated ${Yt(g,new Date,h)}`)}let c=(h,g,S,v)=>f`
      <button type="button" class="seg-btn" title=${v} aria-pressed=${this.mode===h?"true":"false"} @click=${()=>this.setMode(h)}>
        ${S}<span class="seg-label">${g}</span>
      </button>
    `,l=(h,g,S)=>f`
      <button type="button" class="seg-btn" aria-pressed=${this.page===h?"true":"false"} @click=${()=>this.setPage(h)}>
        ${S}<span class="seg-label">${g}</span>
      </button>
    `,d=Ue(r.minutes),u=!!e&&Nt(e);return f`
      <header>
        ${this.showMenu?f`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${ae`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:E}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Ae(r.date)}, ${d}`}>
            <span class="hm">${d.slice(0,-3)}</span><span class="ampm">${d.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${Ae(r.date)}${typeof a=="string"&&a?f`<span class="status"> · ${a}</span>`:E}
          </p>
          ${a&&typeof a!="string"?f`<p class="status">${a}</p>`:E}
        </div>
        ${e&&!u?this.renderNext(e,ho(e,r),n):E}
        <div class="controls">
          ${this.wide||u&&!o?E:f`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?E:f`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",ae`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",ae`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${l("rides","Rides",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${l("chores","Chores",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?E:l("lunch","Lunch",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let l=this.today().date,d=o.unassigned,u=o.laterUnassigned;if(d){let g=f`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${d} ${d===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?f`<div class="next idle needs">${g}</div>`:f`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${g}</button>`}if(u)return f`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${u} ${u===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let h=e.days.some(g=>g.date>=l&&g.events.length);return f`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${h?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${h?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let i;n.ongoing?i="On the road now":n.ahead===0?i=n.inMinutes<180?`Next trip · in ${Tt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${ve(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,a=f`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Re(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(l=>f`<span class="kid-dot" style="background:${l.color}"></span>`)}</span>
        ${n.warn?f`<span class="next-stop warn">${n.warn}</span>`:n.stop?f`<span class="next-stop">${n.stop}</span>`:E}
      </span>
    `,c=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?f`<button type="button" class=${c} @click=${()=>this.open(n.target)}>${a}</button>`:f`<div class=${c}>${a}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return E;let n=this.today().date,o=ke(e),i=this.railShown;return f`<div
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
        ${e.days.map(r=>{let a=os(r),c=r.events.length,l=r.events.slice(0,4).map(u=>u.own?Rt.color:o.get(u.kid)?.color??he(0).color),d=`${Ae(r.date)}: ${c?`${c} ${c===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return f`<button
            type="button"
            class="rail-day ${r.date===n?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${d}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===n?"Today":ve(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${l.length?l.map(u=>f`<span class="rd-dot" style="background:${u}"></span>`):f`<span class="rd-free">free</span>`}
            </span>
            ${a?f`<span class="rd-badge" aria-hidden="true">${a}</span>`:E}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[n,o]=e.split("|");return f`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${ae`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${n==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let n=Pe(e),o=_e(e),i=ke(e),r=n.map(a=>ye(e,a));return f`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((a,c)=>ae`<circle cx=${50+c*30} cy="80" r="11" fill=${i.get(a).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Pc(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(a=>{let c=i.get(a);return f`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${Re(ye(e,a))}</span>
            <span class="qw-name">${ye(e,a)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(a=>f`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Re(ge(e,a))}</span>
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
      </div>
      ${e.allDay.length?f`<div class="day-strip" style="padding-left:${ht}px">
            ${e.allDay.map(o=>f`<span
                  class="strip-chip ${o.warn?"warn":""} ${o.cancelled?"skipped":""} ${o.color?"":"plain"}"
                  style=${o.color?`--c:${o.color.color};--rgb:${o.color.rgb};--ink:${o.color.ink}`:""}
                  ><span class="strip-title">${o.title}</span>${o.note?f`<span class="strip-note">${o.note}</span>`:E}</span
                >`)}
          </div>`:E}`}renderBoard(e){let n=this.sel,o=l=>!!l&&!!n&&l.day===n.day&&l.event===n.event,i=e.dayHeads.find(l=>l.date===this.pinDay)??e.dayHeads[0],r=e.width,a=100,c=[...e.links.map(l=>({t:"link",x:l,z:l.layer??0})),...e.preps.map(l=>({t:"prep",x:l,z:l.layer??a-1})),...e.cards.map(l=>({t:"card",x:l,z:l.layer??a})),...e.rides.map(l=>({t:"ride",x:l,z:l.layer??a+1}))].sort((l,d)=>l.z-d.z);return f`
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
              <span class="avatar ${l.kind}" aria-hidden="true">${Re(l.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${l.name}</span>${l.kind==="kid"?this.renderLunchChip(l.id,!0,l.w-58-l.name.length*10.6):E}</span>
                <span class="sub ${l.subWarn?"warn":""}">${l.sub}</span>
              </span>
            </div>`)}
        </div>
        ${i?f`<div class="pinned" aria-hidden="true" style="width:${r}px;height:${i.h}px;margin-bottom:${-i.h}px">
              ${this.renderHead(i,!0)}
            </div>`:E}
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
                  <span class="l1">${g.l1}</span>${g.show2?f`<span class="l2" style="-webkit-line-clamp:${g.lines2}">${g.l2}</span>`:E}
                </button>`}let d=l.x,u=d.color,h=d.skipped?`repeating-linear-gradient(135deg, rgba(${u.rgb},0.10) 0px, rgba(${u.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:d.stayed?`repeating-linear-gradient(135deg, rgba(${u.rgb},0.24) 0px, rgba(${u.rgb},0.24) 6px, rgba(${u.rgb},0.08) 6px, rgba(${u.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${u.rgb},0.15), rgba(${u.rgb},0.15)), var(--surface)`;return f`<button
                type="button"
                class="card ${d.wrap?"wrap":""} ${o(d.target)?"sel":""} ${d.clash?"clash":""} ${d.skipped?"skipped":""} ${d.cut?"cut":""}"
                aria-label=${d.aria}
                style="left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;background:${h};border-color:${d.clash?"var(--bad)":`rgba(${u.rgb},0.45)`};--c:${u.color};--rgb:${u.rgb};--ring:${u.color}"
                @click=${()=>this.open(d.target)}
              >
                <span class="top">
                  <span class="title">${d.title}</span>
                  <span class="time">${d.time}</span>
                  ${d.showDrop&&d.drop?f`<span class="line tone-${d.drop.tone}">${d.drop.text}</span>`:E}
                </span>
                ${d.showPick&&d.pick?f`<span class="line tone-${d.pick.tone}">${d.pick.text}</span>`:E}
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
                ${l.show2?f`<span class="l2">${l.l2}</span>`:E}
                ${l.stops?l.stops.map(d=>f`<span class="stop ${d.warn?"warn":""}">${d.text}</span>`):E}
                ${l.show3?f`<span class="l3">${l.l3}</span>`:E}
              </button>`)}
          ${Ne(e.overlaps,l=>l.key,l=>f`<div class="overlap" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"></div>`)}
          ${Ne(e.marks,l=>l.key,l=>f`<span class="mark" style="left:${l.x}px;top:${l.y}px;${l.right?"transform:translateX(-100%)":""}">${l.text}</span>`)}
          ${e.now?f`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${r-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:E}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:i,later:r}=e,a=this.plan,c=i+n.length,l=this.chores,d=!!l&&!ds(l);return f`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?E:f`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${d?f`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?f`<div class="attn-chores">${n.map(u=>this.renderChoreRow(u,!0))}</div>`:f`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:f`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!i?f`<div class="all-clear">
            <span class="check" aria-hidden="true">${ae`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Nt(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:E}
      ${o.map(u=>f`<div class="issue ${u.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${u.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${u.target?f`<button type="button" class="issue-title" @click=${()=>this.open(u.target,!0)}>${u.title}</button>`:f`<strong class="issue-title">${u.title}</strong>`}
              <span class="issue-body"
                >${u.parts?u.parts.map(h=>typeof h=="string"?h:f`<button type="button" class="issue-link" @click=${()=>this.open(h.target,!0)}>${h.text}</button>`):u.body}</span
              >
            </div>
          </div>
          ${u.suggestions.length?f`<div class="fixes">
                ${u.suggestions.map(h=>f`<button
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
      ${this.wide&&a&&!Nt(a)&&this.page==="rides"?this.renderLegend():E}
    `}kidColorOf(e){let n=this.plan?ke(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return he(Math.max(0,o))}renderLunchChip(e,n=!1,o=1/0){let i=this.lunch,r=i?.kids.find(u=>u.id===e);if(!i||!r)return E;this.tick;let a=this.today(),c=Eo(r,a.date,a.minutes,this.lunchDraft);if(!c)return E;let l=jt[c.lunch],d=`${l} lunch ${c.when}${c.menu?`: ${c.menu}`:""}`;return n&&o<36+l.length*7.4?f`<span class="lunch-chip ${c.lunch} small icon" role="img" aria-label=${d} title=${d}
        >${c.lunch==="bring"?zs:Us}</span
      >`:f`<span class="lunch-chip ${c.lunch} ${n?"small":""}" title=${d}
      >${c.lunch==="bring"?zs:Us}<span class="lunch-chip-text"
        >${l}${n?E:` ${c.when}`}${!n&&c.menu?f`<span class="lunch-chip-menu"> · ${c.menu}</span>`:E}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return f`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=ko(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:De(e.today),i=n.indexOf(o),r=d=>{let u=n[i+d];u&&(this.lunchMonth=u)},a=e.kids.some(d=>d.id===this.lunchKid)?this.lunchKid:null,c=a?e.kids.filter(d=>d.id===a):e.kids,l=e.status&&!e.status.ok?f`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:E;return f`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${ae`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${kn(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${i<0||i>=n.length-1} @click=${()=>r(1)}>
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
          ${this.menuMode?"Done":f`${dr} Edit menus`}
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
    </div>`}renderLunchCard(e,n,o,i){let r=this.kidColorOf(n.id),a=$o(e,n,o,this.lunchDraft),c=_o(a),l=a.flat(),d=l.filter(v=>!v.outside&&!v.past&&v.lunch),u=n.days_off.filter(v=>De(v.first)<=o&&o<=De(v.last)),h=v=>d.filter($=>wn($.date)===v),g=v=>{let $=h(v);if(!$.length)return;let M=$.every(p=>p.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,$.map(p=>p.date),M)},S=d.length?`${c.bring} Bring · ${c.buy} Buy${o===De(e.today)?" left this month":""}`:"No school days left this month";return f`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Re(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${S}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${jt[n.default]} unless picked</span>
          ${e.kids.length<2?E:f`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:n.id}
              >
                ${i?Ac:Cc}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?f`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:E}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${kn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((v,$)=>f`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!h($).length}
            aria-label=${`${h($).every(M=>M.lunch==="bring")?"Buy":"Bring"} every ${v} left in ${kn(o)} for ${n.name}`}
            @click=${()=>g($)}
          >
            ${v}
          </button>`)}
        ${l.map(v=>this.renderLunchCell(n,v,i))}
      </div>
      ${u.length?f`<p class="lunch-offs">
            No school:
            ${u.map(v=>{let $=v.first<`${o}-01`?`${o}-01`:v.first,M=De(v.last)>o?ft(`${vs(o)}-01`,-1):v.last;return`${$===M?Hs($):`${Hs($)}–${Hs(M)}`} ${To(v.title)}`}).join(" · ")}
          </p>`:E}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return f`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return f`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=n.lunch,r=i==="buy"?"bring":"buy",a=n.menu?`, ${n.menu}`:"",c=this.menuMode,l=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),d=c?`${e.name}, ${Ae(n.date)}${a||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${Ae(n.date)}: ${jt[i]}${n.picked?"":" (not picked yet)"}${a}. Tap to ${jt[r]}.`;return f`<button
      type="button"
      class="lunch-day ${i} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${c?"editing":""} ${l?"sel":""}"
      ?disabled=${n.past&&!c}
      aria-label=${d}
      @click=${()=>c?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${i==="bring"?zs:Us}${jt[i]}</span>
      ${n.menu?f`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?f`<span class="lunch-sides">${n.sides}</span>`:E}`:c?f`<span class="lunch-menu add">${Pn} Menu</span>`:E}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex(M=>M.id===e.kid),a=(this.plan?ke(this.plan).get(e.kid):void 0)??he(Math.max(0,r)),c=o.kids[r]?.name??"",l=i===pt(e)?e:{...e,state:i?"done":"open",done_at:i?new Date().toISOString():null},d=i&&l.done_by&&l.done_by!==e.kid?o.people?.find(M=>M.id===l.done_by)?.name??l.done_by_name??null:null,u=`${cs(l,o.today,o.time_zone)}${d?` · by ${d}`:""}`,h=i||fo(e),g=`${n?`${c}: `:""}${e.title}. ${u?`${u}. `:""}${i?"Done. Tap to undo.":"Tap when it’s done."}`,S=f`<span class="box" aria-hidden="true"
        >${i?ae`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:E}</span
      >
      ${e.icon?f`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:E}
      <span class="chore-text">
        <span class="chore-title">${n?f`<span class="chore-kid">${c}</span> · `:E}${e.title}</span>
        ${u?f`<span class="chore-note">${u}</span>`:E}
      </span>`,v=`chore ${i?"done":""} ${e.state==="overdue"&&!i?"overdue":""} ${h?"":"later"}`,$=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return h?f`<button type="button" class=${v} style=${$} aria-pressed=${i?"true":"false"} aria-label=${g} @click=${()=>this.tapChore(e)}>
          ${S}
        </button>`:f`<div class=${v} style=${$}>${S}</div>`}renderChores(){let e=this.chores;if(e===void 0)return f`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return f`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return f`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(ds(e))return f`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${Pn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?f`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:E;this.tick;let i=go(e,this.plan?ke(this.plan):void 0,this.today().minutes);return f`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Pn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${dr} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${i.length}">
        ${i.map(r=>{let a=r.overdue.filter(c=>!this.choreDone(c)).length+r.now.filter(c=>!this.choreDone(c)).length;return f`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Re(r.name)}</span>
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
            ${r.later.map(c=>f`<h3 class="chore-group">${c.date===e.today?"Later today":Mc(c.date,e.today)}</h3>
                ${c.chores.map(l=>this.renderChoreRow(l))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?f`<p class="chore-none">No chores this week.</p>`:E}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,i=this.plan?ke(this.plan):void 0,r=this.choreEdit?.template===e.id,a=e.problems.length?f`<span class="tmpl-note bad">${e.problems.map(bs).join(" · ")} · tap to set up</span>`:f`<span class="tmpl-note">${ms(e.who,o,e.take_turns)} · ${gs(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return f`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?f` <span class="tag-paused">Paused</span>`:E}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let l=o.findIndex(u=>u.id===c),d=i?.get(c)??he(Math.max(0,l));return f`<span class="kid-dot" style="background:${d.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return f`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Pn} Add a chore</button>
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
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return f``;let o=n.kids,i=this.plan?ke(this.plan):void 0,r=this.choreBusy,a=e.template?n.templates.find(v=>v.id===e.template):void 0,c=ps(e),l=(a?.problems??[]).filter(v=>v!=="who:"),d=(v,$,M,p=!1)=>f`<button type="button" class="choice ${p?"wide":""}" aria-pressed=${v?"true":"false"} ?disabled=${r} @click=${M}>${$}</button>`,u=(v,$,M,p)=>f`<button type="button" class="chip" aria-pressed=${v?"true":"false"} aria-label=${p??E} ?disabled=${r} @click=${M}>${$}</button>`,h=v=>{v!==e.repeats&&this.changeDraft({repeats:v,days:a&&a.repeats===v?a.days??yn(v):yn(v)})},g=v=>{let $=e.who.includes(v)?e.who.filter(M=>M!==v):o.filter(M=>M.id===v||e.who.includes(M.id)).map(M=>M.id);this.changeDraft({who:$})},S;if(e.repeats==="school"){let v=e.days===tt?new Set:e.days===""?new Set([0,1,2,3,4]):us(e.days)??new Set,$=M=>{let p=new Set(v);p.has(M)?p.delete(M):p.add(M),this.changeDraft({days:p.size===5?"":p.size?hs(p):tt})};S=f`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${et.slice(0,5).map((M,p)=>u(v.has(p),M.slice(0,2),()=>$(p),M))}
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
        </div>`}else if(e.repeats==="monthly"){let v=e.days.trim(),$=/^\d+$/.test(v)?Number(v):null,M=v&&v.toLowerCase()!=="any"&&v.toLowerCase()!=="last"&&$===null;S=f`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${M?4:3}, minmax(0, 1fr))">
          ${d(v===""||v.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${d($!==null,"On a date",()=>this.changeDraft({days:String($??1)}))}
          ${d(v.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${M?d(!0,v,()=>{}):E}
        </div>
        ${$!==null?f`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||$<=1} @click=${()=>this.changeDraft({days:String($-1)})}>−</button>
                <span class="arrive-value">${fs($)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||$>=31} @click=${()=>this.changeDraft({days:String($+1)})}>+</button>
              </span>
            </div>`:f`<p class="field-hint">${v.toLowerCase()==="last"?"Due on the month’s last day.":M?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")S=f`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let v=e.days===""||e.days.toLowerCase()==="any",$=e.days===tt?new Set:v?new Set:us(e.days)??new Set,M=p=>{let O=new Set($);O.has(p)?O.delete(p):O.add(p),this.changeDraft({days:O.size?hs(O)||"Mon-Sun":tt})};S=f`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${d(v,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${d(!v,"On set days",()=>this.changeDraft({days:v?"Sat":e.days}))}
        </div>
        ${v?f`<p class="field-hint">Shows all week, due on Sunday.</p>`:f`<div role="group" aria-label="Days of the week" class="day-chips">
                ${et.map((p,O)=>u($.has(O),p.slice(0,2),()=>M(O),p))}
              </div>
              <div class="chips">
                ${u(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${u(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:E}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?ms(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===tt?"No days picked":gs(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${l.length?f`<p class="field-hint bad">${l.map(bs).join(". ")}. Saving fixes it.</p>`:E}
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
          ${ur.map(v=>u(e.icon===v,v,()=>this.changeDraft({icon:e.icon===v?null:v}),`Picture ${v}`))}
          ${e.icon&&!ur.includes(e.icon)?u(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):E}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?f`<emoji-picker
              class="emoji-more"
              .dataSource=${Ec}
              @emoji-click=${v=>{let $=v.detail.unicode;$&&this.changeDraft({icon:$}),this.iconMore=!1}}
            ></emoji-picker>`:E}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((v,$)=>{let M=i?.get(v.id)??he($),p=e.who.includes(v.id);return f`<button type="button" class="who-chip" style="--c:${M.color};--rgb:${M.rgb}" aria-pressed=${p?"true":"false"} ?disabled=${r} @click=${()=>g(v.id)}>
              <span class="avatar" aria-hidden="true">${Re(v.name)}</span>${v.name}
            </button>`})}
        </div>
        ${e.who.length>1?f`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${d(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${d(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:E}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${d(e.repeats==="daily","Every day",()=>h("daily"))}
          ${d(e.repeats==="weekly","Every week",()=>h("weekly"))}
          ${d(e.repeats==="monthly","Every month",()=>h("monthly"))}
          ${d(e.repeats==="school","School days",()=>h("school"))}
        </div>
      </div>
      ${S}
      ${e.repeats==="school"?E:f`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${Sc(e.repeats,e.every)}</span>
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
      ${e.template?f`<div class="field">
              ${d(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${r} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:E}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!c} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":c?c.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return f``;let o=e.busy,i=d=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...d})},r=d=>i({kids:e.kids.includes(d)?e.kids.filter(u=>u!==d):[...e.kids,d]}),a=n.kids.filter(d=>It(d,e.date)),c=e.dish.trim(),l=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return f`
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
          ${a.map(d=>{let u=this.kidColorOf(d.id),h=e.kids.includes(d.id);return f`<button type="button" class="who-chip" style="--c:${u.color};--rgb:${u.rgb}" aria-pressed=${h?"true":"false"} ?disabled=${o} @click=${()=>r(d.id)}>
              <span class="avatar" aria-hidden="true">${Re(d.name)}</span>${d.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${c||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?f`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:E}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!l} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":l??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return f``;let o=n.people?.length?n.people:n.kids.map(u=>({...u,role:"kid"})),i=n.kids.findIndex(u=>u.id===e.kid),r=n.kids[i],a=this.plan?ke(this.plan):void 0,c=a?.get(e.kid)??he(Math.max(0,i)),l=o.filter(u=>u.id!==e.kid),d=u=>{let h=n.kids.findIndex(g=>g.id===u.id);return h>=0?(a?.get(u.id)??he(h)).color:"var(--dark)"};return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:E}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${cs(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${c.color};--rgb:${c.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${Re(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?f`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${l.map(u=>f`<button type="button" class="done-by" style="--c:${d(u)}" @click=${()=>void this.toggleChore(e,u.id)}>
                  <span class="avatar ${u.role==="parent"?"driver":""}" aria-hidden="true">${Re(u.name)}</span>
                  <span>${u.name}</span>
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
    </div>`}ownHint(e,n){let o=bn(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${F(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${F(n.start)} to ${F(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=n.along.map(r=>_e(e).includes(r)?ge(e,r):ye(e,r));return`${o} drives there and back${i.length?`, with ${vn(i)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return f``;let{day:o,event:i}=n,r=_e(e),a=no(e,i),c=bn(e,i),l=!!this.pending,d=T=>this.pending?.key===T?this.pending.value:void 0,u=[...e.people?.carpools??[]];for(let T of e.days)for(let b of T.events)for(let k of[b.drop,b.pick])k&&k!=="none"&&!r.includes(k)&&!u.some(A=>A.toLowerCase()===k.toLowerCase())&&u.push(k);let h=T=>{if(!i.sides.includes(T))return E;let b=d(T)??d("both"),k=T==="drop"?i.drop:i.pick,A=b!==void 0?String(b):i.no_ride_unless_named&&k==="none"?"":k,P=A===""&&!(b===void 0&&i.no_ride_unless_named),K=A&&A!=="none"&&!r.includes(A)?A:"",L=q=>{this.otherOpen=null,this.setRide(i,T,A===q?"":q,r)},H=[...r.map(q=>[q,ss(e,q)]),["none","Not needed"]],ie=`${i.id}|${T}`,fe=this.otherOpen===ie;return f`<div class="field ride-box">
        <span class="field-label">${T==="drop"?"Drop-off":"Pick-up"} ${P?f`<span class="nobody">· nobody yet</span>`:E}</span>
        <div role="group" aria-label=${T==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${H.length+1}, minmax(0, 1fr))">
          ${H.map(([q,$e])=>f`<button type="button" class="choice" aria-pressed=${A===q?"true":"false"} ?disabled=${l} @click=${()=>L(q)}>
                ${$e}
              </button>`)}
          <button
            type="button"
            class="choice"
            aria-pressed=${K?"true":"false"}
            aria-expanded=${fe?"true":"false"}
            ?disabled=${l}
            @click=${()=>this.otherOpen=fe?null:ie}
          >
            ${K||"Other"}
          </button>
        </div>
        ${fe?f`${u.length?f`<div role="group" aria-label=${T==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${u.map(q=>f`<button type="button" class="chip" aria-pressed=${A.toLowerCase()===q.toLowerCase()?"true":"false"} ?disabled=${l} @click=${()=>L(q)}>
                    ${q}
                  </button>`)}
            </div>`:E}
        <input
          type="text"
          .value=${K&&!u.some(q=>q.toLowerCase()===K.toLowerCase())?K:""}
          ?disabled=${l}
          aria-label=${T==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${q=>{let $e=q.target.value.trim();$e&&$e!==A&&L($e)}}
          @keydown=${q=>{q.key==="Enter"&&q.target.blur()}}
        />`:E}
        ${!M&&A!==""&&A!=="none"?g(T,A):E}
      </div>`},g=(T,b)=>{let k=d(`along-${T}`),A=k!==void 0?k:T==="pick"?i.pick_along??[]:i.along,P=new Set(o.events.filter(H=>H.event_id===i.event_id&&!H.own).map(H=>H.kid)),K=[...Pe(e).filter(H=>H!==i.kid&&!P.has(H)),...r.filter(H=>H!==b)];return K.length?f`<div class="field-sub">
        <span class="field-label">${T==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${T==="pick"?"Coming home too. Anyone already there just gets in.":T==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${T==="drop"?"Riding along on the drop-off":T==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${K.map(H=>f`<button type="button" class="chip" aria-pressed=${A.includes(H)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(i,H,T)}>
              ${r.includes(H)?ge(e,H):ye(e,H)}
            </button>`)}
        </div>
      </div>`:E},S=r.includes(i.drop)?i.drop:r.includes(i.pick)?i.pick:"",v=i.drop===i.pick&&r.includes(i.drop),$=d("stay"),M=$!==void 0?!!$:i.stay&&v,p=d("along"),O=p!==void 0?p:i.along,U=i.own?[...Pe(e),...r.filter(T=>T!==i.own)]:[],Y=i.own!=null&&i.takes!=null,de=i.own!=null&&!Y,x=d("takes"),w=x!==void 0?x:i.takes??null,y=d("arrive"),_=this.arriveDraft!==void 0?this.arriveDraft:y!==void 0?y:i.arrive_by,C=d("leave"),D=this.leaveDraft!==void 0?this.leaveDraft:C!==void 0?C:i.leave_by??null,j=(T,b)=>{let k=T==="arrive",A=K=>()=>k?this.nudgeArrive(i,K):this.nudgeLeave(i,K),P=(K,L,H,ie)=>f`<button
          type="button"
          class="step"
          aria-label=${L}
          ?disabled=${l||ie}
          @pointerdown=${()=>this.startHold(A(K))}
          @pointerup=${()=>this.stopHold()}
          @pointerleave=${()=>this.stopHold()}
          @pointercancel=${()=>this.stopHold()}
          @click=${()=>this.tapStep(A(K))}
        >
          ${H}
        </button>`;return f`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">${k?"Arrive by":"Leave by"}</span>
          <span class="field-hint">${k?`${i.start-b} min before it starts`:`${i.end-b} min before it ends`}</span>
        </span>
        <span class="stepper">
          ${P(-5,"Five minutes earlier","−",!k&&b-5<=i.start)}
          <span class="arrive-value">${F(b)}</span>
          ${P(5,"Five minutes later","+",!1)}
          <button
            type="button"
            class="step clear-time"
            aria-label=${k?"Clear arrive-by time":"Clear leave-by time"}
            ?disabled=${l}
            @click=${()=>k?this.clearArrive():this.clearLeave()}
          >
            ×
          </button>
        </span>
      </div>`},V=i.sides.includes("pick")||i.own!=null,Z=()=>f`${_!=null?j("arrive",_):E}
      ${D!=null?j("leave",D):E}
      ${_==null||D==null&&V?f`<div class="field time-chips">
            <div role="group" aria-label="Times" class="chips">
              ${_==null?f`<button type="button" class="chip" ?disabled=${l} @click=${()=>this.nudgeArrive(i,-5)}>Arrive early</button>`:E}
              ${D==null&&V?f`<button type="button" class="chip" ?disabled=${l} @click=${()=>this.nudgeLeave(i,-5)}>Leave early</button>`:E}
            </div>
          </div>`:E}`,ee=i.sides.includes("drop")&&i.sides.includes("pick"),N=ee&&(M||this.stayDraft===i.id),J=()=>{let T=ee?f`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${N?"false":"true"}
              ?disabled=${l}
              @click=${()=>{this.stayDraft=null,i.stay&&this.toggleStay(i,!1,S)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${N?"true":"false"}
              ?disabled=${l}
              @click=${()=>{S?this.toggleStay(i,!0,S):this.stayDraft=i.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:E;if(!N)return f`${T} ${h("drop")} ${h("pick")}`;let b=M&&v?i.drop:"";return f`${T}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${b?E:f`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(k=>f`<button
                type="button"
                class="choice"
                aria-pressed=${b===k?"true":"false"}
                ?disabled=${l}
                @click=${()=>{if(b===k||!this.backend)return;let A=this.backend;this.stayDraft=null,this.save("stay",!0,()=>A.setRide(i.id,"both",k,this.scope,!0))}}
              >
                ${ge(e,k)}
              </button>`)}
          </div>
          ${b?g("both",b):E}
        </div>`},Q=[],se=T=>T==="none"?"Not needed":ss(e,T),xe=T=>r.includes(T)?ge(e,T):ye(e,T),pe=(T,b,k)=>{b===""&&!k.length||Q.push(`${T}: ${[b===""?"TBD":se(b),...k.map(xe)].join(", ")}`)},ue=T=>i.no_ride_unless_named&&T==="none"?"":T;i.own||pe("Drop-off",ue(i.drop),i.along),i.own||pe("Pick-up",ue(i.pick),i.pick_along??[]),!i.own&&i.stay&&Q.push("Stay: yes"),Y&&Q.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&Q.push(`Take along: ${i.along.map(xe).join(", ")}`),i.arrive_by!=null&&Q.push(`Arrive by: ${Ue(i.arrive_by)}`),i.leave_by!=null&&Q.push(`Leave by: ${Ue(i.leave_by)}`);let Ee=d("attending"),be=Ee!==void 0?!!Ee:i.attending!==!1;i.attending===!1&&Q.splice(0,Q.length,"Attending: no");let m=o.date===this.today().date?"":`${ve(o.date)} · `,B=mn(i),z=f`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${c} · ${i.title}</span>
          <span class="ed-meta">${m}${Y?"any time ":""}${B}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;if(i.busy_only){let T=i.place_name&&i.place_name!==i.title?i.place_name:"",b=i.busy_why==="days"?"It runs over more than a day, so no drive is planned for it.":i.busy_why==="home"?"It’s at home, so no drive is planned for it.":"It has no address, so no drive is planned for it.";return f`${z}
        ${this.pending?f`<p class="saving" role="status">Saving to Google Calendar…</p>`:E}
        ${T?f`<div class="field"><span class="field-label">Where</span><span class="field-hint">${T}</span></div>`:E}
        <p class="field-hint">
          ${be?`This blocks ${c}’s time: ${c} can’t drive then, so a ride that needs ${c} shows as a problem.`:`Not going, so it doesn’t block ${c}’s time, and ${c} can drive then.`}
          ${b}
        </p>
        <button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.setAttending(i,!be)}>
          ${be?`${c} isn’t going this time`:`${c} is going after all`}
        </button>
        ${i.problems.length?f`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:E}
        <details class="notes">
          <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
          <span class="notes-body">--- Rides ---\n${i.attending===!1?"Attending: no":"(nothing yet)"}</span>
        </details>`}return i.where==="home"?f`${z}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:f`
      ${z}
      ${this.pending?f`<p class="saving" role="status">Saving to Google Calendar…</p>`:E}
      ${i.recurring?f`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${ve(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:E}
      ${be?f`${i.where==="anywhere"?f`<p class="field-hint">
                  ${i.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:E}
            ${i.own?f`<p class="field-hint">${this.ownHint(e,i)}</p>`:J()}
      ${i.own?f`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${w!=null?`Takes ${w} min, any time ${F(i.start)}–${F(i.end)}`:"At its set time"}</span>
            </span>
            ${w!=null?f`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${l||w<=5} @click=${()=>this.setTakes(i,Math.max(5,w-5))}>−</button>
                  <span class="arrive-value">${w} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${l||w+5>i.end-i.start} @click=${()=>this.setTakes(i,w+5)}>+</button>
                </span>`:E}
          </div>
          <button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.setTakes(i,w!=null?null:Math.min(10,Math.max(5,i.end-i.start)))}>
            ${w!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:E}
      ${de&&U.length?f`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${U.map(T=>f`<button type="button" class="chip" aria-pressed=${O.includes(T)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(i,T)}>
                  ${r.includes(T)?ge(e,T):ye(e,T)}
                </button>`)}
            </div>
          </div>`:E}
      ${Y?E:Z()}
`:f`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${c} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.setAttending(i,!be)}>
        ${be?`${c} isn’t going this time`:`${c} is going after all`}
      </button>
      ${i.problems.length?f`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:E}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${Q.length?Q.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${be&&!i.own?f`<p class="field-hint">Tap a selected driver again to clear it.</p>`:E}
    `}};zt.styles=Ao,zt.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},leaveDraft:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",zt);function Rc(){let s=[document];for(let t of document.querySelectorAll("*"))t.shadowRoot&&s.push(t.shadowRoot);return s}function pr(s=3e3){let t=new CSSStyleSheet;t.replaceSync("*, *::before, *::after { cursor: none !important; }"),t.disabled=!0;let e,n=i=>{if(i)for(let r of Rc())r.adoptedStyleSheets.includes(t)||(r.adoptedStyleSheets=[...r.adoptedStyleSheets,t]);t.disabled=!i},o=i=>{if(clearTimeout(e),i.pointerType==="touch"){n(!0);return}n(!1),e=setTimeout(()=>n(!0),s)};window.addEventListener("pointermove",o,{passive:!0}),window.addEventListener("pointerdown",o,{passive:!0}),e=setTimeout(()=>n(!0),s)}function fr(s){try{return new URL(s).searchParams.get("v")}catch{return null}}function gr(s,t,e){if(!t)return()=>{};let n=e.everyMs??6e5,o=e.retryMs??3e4,i=e.idleMs??12e4,r=null,a=null,c=0,l=!1,d=S=>{if(l||a)return;let v=e.idleFor();if(v>=i){e.reload(S);return}a=setTimeout(()=>{a=null,d(S)},i-v)},u=async()=>{try{let S=await s.sendMessagePromise({type:"mydashlight/app_version"});c=0;let v=S["kiosk.js"];!l&&v&&v!==t&&d(v)}catch{if(l||r||++c>20)return;r=setTimeout(()=>{r=null,u()},o)}},h=()=>{c=0,u()};s.addEventListener?.("ready",h);let g=setInterval(()=>void u(),n);return()=>{l=!0,clearInterval(g),r&&clearTimeout(r),a&&clearTimeout(a),s.removeEventListener?.("ready",h)}}function mr(s,t=6e4,e=15e3){let n=null,o=setInterval(()=>{if(!s.connected||n)return;let i=!1;n=setTimeout(()=>{n=null,!i&&s.connected&&s.reconnect(!0)},e);let r=()=>{i=!0,n&&clearTimeout(n),n=null};s.ping().then(r,r)},t);return()=>{clearInterval(o),n&&clearTimeout(n),n=null}}var br=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],vr=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function yr(s,t,e,n){let o=Math.max(0,Math.min(t,s.length)),i=Math.max(o,Math.min(e,s.length));return{value:s.slice(0,o)+n+s.slice(i),caret:o+n.length}}function xr(s,t,e){let n=Math.max(0,Math.min(t,s.length)),o=Math.max(n,Math.min(e,s.length));if(n!==o)return{value:s.slice(0,n)+s.slice(o),caret:n};if(n===0)return{value:s,caret:0};let i=Array.from(s.slice(0,n));i.pop();let r=i.join("");return{value:r+s.slice(n),caret:r.length}}function wr(s,t){return t===0||/\s$/.test(s.slice(0,t))}var Ic=new Set(["text","search","email","url","tel","number","password"]);function kr(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&Ic.has(s.type)&&!s.readOnly&&!s.disabled}var Bc={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},Oc={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},Ut=class extends Te{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=n=>n.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let n=e.selectionStart,o=e.selectionEnd;if(n!==null&&o!==null)return[n,o]}catch{}return[e.value.length,e.value.length]}apply(e,n,o){e.value=n;try{e.setSelectionRange(o,o)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=wr(this.field.value,e)}press(e){let n=this.field;if(n){switch(e){case"hide":n.blur();return;case"done":this.commit(),n.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),n.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[o,i]=this.selection(n),r=xr(n.value,o,i);this.apply(n,r.value,r.caret);break}default:{let o=e==="space"?" ":this.shift?e.toUpperCase():e,[i,r]=this.selection(n),a=yr(n.value,i,r,o);this.apply(n,a.value,a.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let n=e.length>1,o=e==="layout"?this.layout==="letters"?"123":"ABC":Bc[e]??(this.shift?e.toUpperCase():e);return f`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":n?"wide":""}
      aria-label=${Oc[e]??o}
      aria-pressed=${e==="shift"?String(this.shift):E}
      @click=${()=>this.press(e)}
    >
      ${o}
    </button>`}render(){let e=this.layout==="letters"?br:vr;return f`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(n=>f`<div class="row">${n.map(o=>this.key(o))}</div>`)}
      </div>`}};Ut.styles=qe`
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
  `,Ut.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",Ut);function jc(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function $r(s){let t=new WeakSet,e=r=>{let a=r.composedPath();i(a);let c=a[0];kr(c)&&s.attach(c)},n=()=>{setTimeout(()=>{let r=jc();!s.target||r===s.target||(kr(r)?s.attach(r):s.detach())},0)},o=r=>{t.has(r)||(t.add(r),r.addEventListener("focusin",e),r.addEventListener("focusout",n))},i=r=>{for(let a of r)a instanceof ShadowRoot&&o(a)};o(document),document.addEventListener("pointerdown",r=>i(r.composedPath()),{capture:!0}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var Fs="mydashlight",Nc=`/api/${Fs}/pair`,zc=`/api/${Fs}/pair/poll`,Ks=`/${Fs}`,Ws="pair";function Tr(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function _r(s,t){return`${s}${Ks}?${Ws}=${encodeURIComponent(t)}`}function Uc(s,t,e=Date.now()){return{hassUrl:s,clientId:t.client_id,access_token:t.access_token,refresh_token:t.refresh_token,expires_in:t.expires_in,expires:e+t.expires_in*1e3}}var at=class extends Error{constructor(t,e=!1){super(t),this.busy=e}};async function Er(s=fetch){let t=await s(Nc,{method:"POST",cache:"no-store"});if(t.status===429)throw new at("Too many screens are asking to pair right now.",!0);if(!t.ok)throw new at(`Home Assistant answered ${t.status}.`);return await t.json()}async function Cr(s,t,e=fetch){let n=await e(zc,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(n.status===404)return{status:"expired"};if(!n.ok)throw new at(`Home Assistant answered ${n.status}.`);let o=await n.json();return o.status==="paired"&&o.auth?{status:"paired",auth:Uc(t,o.auth)}:{status:"pending"}}var xt=function(s,t){let o=s,i=Ht[t],r=null,a=0,c=null,l=[],d={},u=function(x,w){a=o*4+17,r=(function(y){let _=new Array(y);for(let C=0;C<y;C+=1){_[C]=new Array(y);for(let D=0;D<y;D+=1)_[C][D]=null}return _})(a),h(0,0),h(a-7,0),h(0,a-7),v(),S(),M(x,w),o>=7&&$(x),c==null&&(c=U(o,i,l)),p(c,w)},h=function(x,w){for(let y=-1;y<=7;y+=1)if(!(x+y<=-1||a<=x+y))for(let _=-1;_<=7;_+=1)w+_<=-1||a<=w+_||(0<=y&&y<=6&&(_==0||_==6)||0<=_&&_<=6&&(y==0||y==6)||2<=y&&y<=4&&2<=_&&_<=4?r[x+y][w+_]=!0:r[x+y][w+_]=!1)},g=function(){let x=0,w=0;for(let y=0;y<8;y+=1){u(!0,y);let _=Ke.getLostPoint(d);(y==0||x>_)&&(x=_,w=y)}return w},S=function(){for(let x=8;x<a-8;x+=1)r[x][6]==null&&(r[x][6]=x%2==0);for(let x=8;x<a-8;x+=1)r[6][x]==null&&(r[6][x]=x%2==0)},v=function(){let x=Ke.getPatternPosition(o);for(let w=0;w<x.length;w+=1)for(let y=0;y<x.length;y+=1){let _=x[w],C=x[y];if(r[_][C]==null)for(let D=-2;D<=2;D+=1)for(let j=-2;j<=2;j+=1)D==-2||D==2||j==-2||j==2||D==0&&j==0?r[_+D][C+j]=!0:r[_+D][C+j]=!1}},$=function(x){let w=Ke.getBCHTypeNumber(o);for(let y=0;y<18;y+=1){let _=!x&&(w>>y&1)==1;r[Math.floor(y/3)][y%3+a-8-3]=_}for(let y=0;y<18;y+=1){let _=!x&&(w>>y&1)==1;r[y%3+a-8-3][Math.floor(y/3)]=_}},M=function(x,w){let y=i<<3|w,_=Ke.getBCHTypeInfo(y);for(let C=0;C<15;C+=1){let D=!x&&(_>>C&1)==1;C<6?r[C][8]=D:C<8?r[C+1][8]=D:r[a-15+C][8]=D}for(let C=0;C<15;C+=1){let D=!x&&(_>>C&1)==1;C<8?r[8][a-C-1]=D:C<9?r[8][15-C-1+1]=D:r[8][15-C-1]=D}r[a-8][8]=!x},p=function(x,w){let y=-1,_=a-1,C=7,D=0,j=Ke.getMaskFunction(w);for(let V=a-1;V>0;V-=2)for(V==6&&(V-=1);;){for(let Z=0;Z<2;Z+=1)if(r[_][V-Z]==null){let ee=!1;D<x.length&&(ee=(x[D]>>>C&1)==1),j(_,V-Z)&&(ee=!ee),r[_][V-Z]=ee,C-=1,C==-1&&(D+=1,C=7)}if(_+=y,_<0||a<=_){_-=y,y=-y;break}}},O=function(x,w){let y=0,_=0,C=0,D=new Array(w.length),j=new Array(w.length);for(let N=0;N<w.length;N+=1){let J=w[N].dataCount,Q=w[N].totalCount-J;_=Math.max(_,J),C=Math.max(C,Q),D[N]=new Array(J);for(let ue=0;ue<D[N].length;ue+=1)D[N][ue]=255&x.getBuffer()[ue+y];y+=J;let se=Ke.getErrorCorrectPolynomial(Q),pe=Ft(D[N],se.getLength()-1).mod(se);j[N]=new Array(se.getLength()-1);for(let ue=0;ue<j[N].length;ue+=1){let Ee=ue+pe.getLength()-j[N].length;j[N][ue]=Ee>=0?pe.getAt(Ee):0}}let V=0;for(let N=0;N<w.length;N+=1)V+=w[N].totalCount;let Z=new Array(V),ee=0;for(let N=0;N<_;N+=1)for(let J=0;J<w.length;J+=1)N<D[J].length&&(Z[ee]=D[J][N],ee+=1);for(let N=0;N<C;N+=1)for(let J=0;J<w.length;J+=1)N<j[J].length&&(Z[ee]=j[J][N],ee+=1);return Z},U=function(x,w,y){let _=Ar.getRSBlocks(x,w),C=Sr();for(let j=0;j<y.length;j+=1){let V=y[j];C.put(V.getMode(),4),C.put(V.getLength(),Ke.getLengthInBits(V.getMode(),x)),V.write(C)}let D=0;for(let j=0;j<_.length;j+=1)D+=_[j].dataCount;if(C.getLengthInBits()>D*8)throw"code length overflow. ("+C.getLengthInBits()+">"+D*8+")";for(C.getLengthInBits()+4<=D*8&&C.put(0,4);C.getLengthInBits()%8!=0;)C.putBit(!1);for(;!(C.getLengthInBits()>=D*8||(C.put(236,8),C.getLengthInBits()>=D*8));)C.put(17,8);return O(C,_)};d.addData=function(x,w){w=w||"Byte";let y=null;switch(w){case"Numeric":y=Hc(x);break;case"Alphanumeric":y=Fc(x);break;case"Byte":y=Kc(x);break;case"Kanji":y=Wc(x);break;default:throw"mode:"+w}l.push(y),c=null},d.isDark=function(x,w){if(x<0||a<=x||w<0||a<=w)throw x+","+w;return r[x][w]},d.getModuleCount=function(){return a},d.make=function(){if(o<1){let x=1;for(;x<40;x++){let w=Ar.getRSBlocks(x,i),y=Sr();for(let C=0;C<l.length;C++){let D=l[C];y.put(D.getMode(),4),y.put(D.getLength(),Ke.getLengthInBits(D.getMode(),x)),D.write(y)}let _=0;for(let C=0;C<w.length;C++)_+=w[C].dataCount;if(y.getLengthInBits()<=_*8)break}o=x}u(!1,g())},d.createTableTag=function(x,w){x=x||2,w=typeof w>"u"?x*4:w;let y="";y+='<table style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: "+w+"px;",y+='">',y+="<tbody>";for(let _=0;_<d.getModuleCount();_+=1){y+="<tr>";for(let C=0;C<d.getModuleCount();C+=1)y+='<td style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: 0px;",y+=" width: "+x+"px;",y+=" height: "+x+"px;",y+=" background-color: ",y+=d.isDark(_,C)?"#000000":"#ffffff",y+=";",y+='"/>';y+="</tr>"}return y+="</tbody>",y+="</table>",y},d.createSvgTag=function(x,w,y,_){let C={};typeof arguments[0]=="object"&&(C=arguments[0],x=C.cellSize,w=C.margin,y=C.alt,_=C.title),x=x||2,w=typeof w>"u"?x*4:w,y=typeof y=="string"?{text:y}:y||{},y.text=y.text||null,y.id=y.text?y.id||"qrcode-description":null,_=typeof _=="string"?{text:_}:_||{},_.text=_.text||null,_.id=_.text?_.id||"qrcode-title":null;let D=d.getModuleCount()*x+w*2,j,V,Z,ee,N="",J;for(J="l"+x+",0 0,"+x+" -"+x+",0 0,-"+x+"z ",N+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',N+=C.scalable?"":' width="'+D+'px" height="'+D+'px"',N+=' viewBox="0 0 '+D+" "+D+'" ',N+=' preserveAspectRatio="xMinYMin meet"',N+=_.text||y.text?' role="img" aria-labelledby="'+Y([_.id,y.id].join(" ").trim())+'"':"",N+=">",N+=_.text?'<title id="'+Y(_.id)+'">'+Y(_.text)+"</title>":"",N+=y.text?'<description id="'+Y(y.id)+'">'+Y(y.text)+"</description>":"",N+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',N+='<path d="',Z=0;Z<d.getModuleCount();Z+=1)for(ee=Z*x+w,j=0;j<d.getModuleCount();j+=1)d.isDark(Z,j)&&(V=j*x+w,N+="M"+V+","+ee+J);return N+='" stroke="transparent" fill="black"/>',N+="</svg>",N},d.createDataURL=function(x,w){x=x||2,w=typeof w>"u"?x*4:w;let y=d.getModuleCount()*x+w*2,_=w,C=y-w;return Yc(y,y,function(D,j){if(_<=D&&D<C&&_<=j&&j<C){let V=Math.floor((D-_)/x),Z=Math.floor((j-_)/x);return d.isDark(Z,V)?0:1}else return 1})},d.createImgTag=function(x,w,y){x=x||2,w=typeof w>"u"?x*4:w;let _=d.getModuleCount()*x+w*2,C="";return C+="<img",C+=' src="',C+=d.createDataURL(x,w),C+='"',C+=' width="',C+=_,C+='"',C+=' height="',C+=_,C+='"',y&&(C+=' alt="',C+=Y(y),C+='"'),C+="/>",C};let Y=function(x){let w="";for(let y=0;y<x.length;y+=1){let _=x.charAt(y);switch(_){case"<":w+="&lt;";break;case">":w+="&gt;";break;case"&":w+="&amp;";break;case'"':w+="&quot;";break;default:w+=_;break}}return w},de=function(x){x=typeof x>"u"?2:x;let y=d.getModuleCount()*1+x*2,_=x,C=y-x,D,j,V,Z,ee,N={"██":"█","█ ":"▀"," █":"▄","  ":" "},J={"██":"▀","█ ":"▀"," █":" ","  ":" "},Q="";for(D=0;D<y;D+=2){for(V=Math.floor((D-_)/1),Z=Math.floor((D+1-_)/1),j=0;j<y;j+=1)ee="█",_<=j&&j<C&&_<=D&&D<C&&d.isDark(V,Math.floor((j-_)/1))&&(ee=" "),_<=j&&j<C&&_<=D+1&&D+1<C&&d.isDark(Z,Math.floor((j-_)/1))?ee+=" ":ee+="█",Q+=x<1&&D+1>=C?J[ee]:N[ee];Q+=`
`}return y%2&&x>0?Q.substring(0,Q.length-y-1)+Array(y+1).join("▀"):Q.substring(0,Q.length-1)};return d.createASCII=function(x,w){if(x=x||1,x<2)return de(w);x-=1,w=typeof w>"u"?x*2:w;let y=d.getModuleCount()*x+w*2,_=w,C=y-w,D,j,V,Z,ee=Array(x+1).join("██"),N=Array(x+1).join("  "),J="",Q="";for(D=0;D<y;D+=1){for(V=Math.floor((D-_)/x),Q="",j=0;j<y;j+=1)Z=1,_<=j&&j<C&&_<=D&&D<C&&d.isDark(V,Math.floor((j-_)/x))&&(Z=0),Q+=Z?ee:N;for(V=0;V<x;V+=1)J+=Q+`
`}return J.substring(0,J.length-1)},d.renderTo2dContext=function(x,w){w=w||2;let y=d.getModuleCount();for(let _=0;_<y;_++)for(let C=0;C<y;C++)x.fillStyle=d.isDark(_,C)?"black":"white",x.fillRect(C*w,_*w,w,w)},d};xt.stringToBytes=function(s){let t=[];for(let e=0;e<s.length;e+=1){let n=s.charCodeAt(e);t.push(n&255)}return t};xt.createStringToBytes=function(s,t){let e=(function(){let o=qc(s),i=function(){let c=o.read();if(c==-1)throw"eof";return c},r=0,a={};for(;;){let c=o.read();if(c==-1)break;let l=i(),d=i(),u=i(),h=String.fromCharCode(c<<8|l),g=d<<8|u;a[h]=g,r+=1}if(r!=t)throw r+" != "+t;return a})(),n=63;return function(o){let i=[];for(let r=0;r<o.length;r+=1){let a=o.charCodeAt(r);if(a<128)i.push(a);else{let c=e[o.charAt(r)];typeof c=="number"?(c&255)==c?i.push(c):(i.push(c>>>8),i.push(c&255)):i.push(n)}}return i}};var me={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},Ht={L:1,M:0,Q:3,H:2},Fe={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},Ke=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,e=7973,n=21522,o={},i=function(r){let a=0;for(;r!=0;)a+=1,r>>>=1;return a};return o.getBCHTypeInfo=function(r){let a=r<<10;for(;i(a)-i(t)>=0;)a^=t<<i(a)-i(t);return(r<<10|a)^n},o.getBCHTypeNumber=function(r){let a=r<<12;for(;i(a)-i(e)>=0;)a^=e<<i(a)-i(e);return r<<12|a},o.getPatternPosition=function(r){return s[r-1]},o.getMaskFunction=function(r){switch(r){case Fe.PATTERN000:return function(a,c){return(a+c)%2==0};case Fe.PATTERN001:return function(a,c){return a%2==0};case Fe.PATTERN010:return function(a,c){return c%3==0};case Fe.PATTERN011:return function(a,c){return(a+c)%3==0};case Fe.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case Fe.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case Fe.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case Fe.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+r}},o.getErrorCorrectPolynomial=function(r){let a=Ft([1],0);for(let c=0;c<r;c+=1)a=a.multiply(Ft([1,We.gexp(c)],0));return a},o.getLengthInBits=function(r,a){if(1<=a&&a<10)switch(r){case me.MODE_NUMBER:return 10;case me.MODE_ALPHA_NUM:return 9;case me.MODE_8BIT_BYTE:return 8;case me.MODE_KANJI:return 8;default:throw"mode:"+r}else if(a<27)switch(r){case me.MODE_NUMBER:return 12;case me.MODE_ALPHA_NUM:return 11;case me.MODE_8BIT_BYTE:return 16;case me.MODE_KANJI:return 10;default:throw"mode:"+r}else if(a<41)switch(r){case me.MODE_NUMBER:return 14;case me.MODE_ALPHA_NUM:return 13;case me.MODE_8BIT_BYTE:return 16;case me.MODE_KANJI:return 12;default:throw"mode:"+r}else throw"type:"+a},o.getLostPoint=function(r){let a=r.getModuleCount(),c=0;for(let u=0;u<a;u+=1)for(let h=0;h<a;h+=1){let g=0,S=r.isDark(u,h);for(let v=-1;v<=1;v+=1)if(!(u+v<0||a<=u+v))for(let $=-1;$<=1;$+=1)h+$<0||a<=h+$||v==0&&$==0||S==r.isDark(u+v,h+$)&&(g+=1);g>5&&(c+=3+g-5)}for(let u=0;u<a-1;u+=1)for(let h=0;h<a-1;h+=1){let g=0;r.isDark(u,h)&&(g+=1),r.isDark(u+1,h)&&(g+=1),r.isDark(u,h+1)&&(g+=1),r.isDark(u+1,h+1)&&(g+=1),(g==0||g==4)&&(c+=3)}for(let u=0;u<a;u+=1)for(let h=0;h<a-6;h+=1)r.isDark(u,h)&&!r.isDark(u,h+1)&&r.isDark(u,h+2)&&r.isDark(u,h+3)&&r.isDark(u,h+4)&&!r.isDark(u,h+5)&&r.isDark(u,h+6)&&(c+=40);for(let u=0;u<a;u+=1)for(let h=0;h<a-6;h+=1)r.isDark(h,u)&&!r.isDark(h+1,u)&&r.isDark(h+2,u)&&r.isDark(h+3,u)&&r.isDark(h+4,u)&&!r.isDark(h+5,u)&&r.isDark(h+6,u)&&(c+=40);let l=0;for(let u=0;u<a;u+=1)for(let h=0;h<a;h+=1)r.isDark(h,u)&&(l+=1);let d=Math.abs(100*l/a/a-50)/5;return c+=d*10,c},o})(),We=(function(){let s=new Array(256),t=new Array(256);for(let n=0;n<8;n+=1)s[n]=1<<n;for(let n=8;n<256;n+=1)s[n]=s[n-4]^s[n-5]^s[n-6]^s[n-8];for(let n=0;n<255;n+=1)t[s[n]]=n;let e={};return e.glog=function(n){if(n<1)throw"glog("+n+")";return t[n]},e.gexp=function(n){for(;n<0;)n+=255;for(;n>=256;)n-=255;return s[n]},e})(),Ft=function(s,t){if(typeof s.length>"u")throw s.length+"/"+t;let e=(function(){let o=0;for(;o<s.length&&s[o]==0;)o+=1;let i=new Array(s.length-o+t);for(let r=0;r<s.length-o;r+=1)i[r]=s[r+o];return i})(),n={};return n.getAt=function(o){return e[o]},n.getLength=function(){return e.length},n.multiply=function(o){let i=new Array(n.getLength()+o.getLength()-1);for(let r=0;r<n.getLength();r+=1)for(let a=0;a<o.getLength();a+=1)i[r+a]^=We.gexp(We.glog(n.getAt(r))+We.glog(o.getAt(a)));return Ft(i,0)},n.mod=function(o){if(n.getLength()-o.getLength()<0)return n;let i=We.glog(n.getAt(0))-We.glog(o.getAt(0)),r=new Array(n.getLength());for(let a=0;a<n.getLength();a+=1)r[a]=n.getAt(a);for(let a=0;a<o.getLength();a+=1)r[a]^=We.gexp(We.glog(o.getAt(a))+i);return Ft(r,0).mod(o)},n},Ar=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(o,i){let r={};return r.totalCount=o,r.dataCount=i,r},e={},n=function(o,i){switch(i){case Ht.L:return s[(o-1)*4+0];case Ht.M:return s[(o-1)*4+1];case Ht.Q:return s[(o-1)*4+2];case Ht.H:return s[(o-1)*4+3];default:return}};return e.getRSBlocks=function(o,i){let r=n(o,i);if(typeof r>"u")throw"bad rs block @ typeNumber:"+o+"/errorCorrectionLevel:"+i;let a=r.length/3,c=[];for(let l=0;l<a;l+=1){let d=r[l*3+0],u=r[l*3+1],h=r[l*3+2];for(let g=0;g<d;g+=1)c.push(t(u,h))}return c},e})(),Sr=function(){let s=[],t=0,e={};return e.getBuffer=function(){return s},e.getAt=function(n){let o=Math.floor(n/8);return(s[o]>>>7-n%8&1)==1},e.put=function(n,o){for(let i=0;i<o;i+=1)e.putBit((n>>>o-i-1&1)==1)},e.getLengthInBits=function(){return t},e.putBit=function(n){let o=Math.floor(t/8);s.length<=o&&s.push(0),n&&(s[o]|=128>>>t%8),t+=1},e},Hc=function(s){let t=me.MODE_NUMBER,e=s,n={};n.getMode=function(){return t},n.getLength=function(r){return e.length},n.write=function(r){let a=e,c=0;for(;c+2<a.length;)r.put(o(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?r.put(o(a.substring(c,c+1)),4):a.length-c==2&&r.put(o(a.substring(c,c+2)),7))};let o=function(r){let a=0;for(let c=0;c<r.length;c+=1)a=a*10+i(r.charAt(c));return a},i=function(r){if("0"<=r&&r<="9")return r.charCodeAt(0)-48;throw"illegal char :"+r};return n},Fc=function(s){let t=me.MODE_ALPHA_NUM,e=s,n={};n.getMode=function(){return t},n.getLength=function(i){return e.length},n.write=function(i){let r=e,a=0;for(;a+1<r.length;)i.put(o(r.charAt(a))*45+o(r.charAt(a+1)),11),a+=2;a<r.length&&i.put(o(r.charAt(a)),6)};let o=function(i){if("0"<=i&&i<="9")return i.charCodeAt(0)-48;if("A"<=i&&i<="Z")return i.charCodeAt(0)-65+10;switch(i){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+i}};return n},Kc=function(s){let t=me.MODE_8BIT_BYTE,e=s,n=xt.stringToBytes(s),o={};return o.getMode=function(){return t},o.getLength=function(i){return n.length},o.write=function(i){for(let r=0;r<n.length;r+=1)i.put(n[r],8)},o},Wc=function(s){let t=me.MODE_KANJI,e=s,n=xt.stringToBytes;(function(r,a){let c=n(r);if(c.length!=2||(c[0]<<8|c[1])!=a)throw"sjis not supported."})("友",38726);let o=n(s),i={};return i.getMode=function(){return t},i.getLength=function(r){return~~(o.length/2)},i.write=function(r){let a=o,c=0;for(;c+1<a.length;){let l=(255&a[c])<<8|255&a[c+1];if(33088<=l&&l<=40956)l-=33088;else if(57408<=l&&l<=60351)l-=49472;else throw"illegal char at "+(c+1)+"/"+l;l=(l>>>8&255)*192+(l&255),r.put(l,13),c+=2}if(c<a.length)throw"illegal char at "+(c+1)},i},Mr=function(){let s=[],t={};return t.writeByte=function(e){s.push(e&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,o){n=n||0,o=o||e.length;for(let i=0;i<o;i+=1)t.writeByte(e[i+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return s},t.toString=function(){let e="";e+="[";for(let n=0;n<s.length;n+=1)n>0&&(e+=","),e+=s[n];return e+="]",e},t},Vc=function(){let s=0,t=0,e=0,n="",o={},i=function(a){n+=String.fromCharCode(r(a&63))},r=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return o.writeByte=function(a){for(s=s<<8|a&255,t+=8,e+=1;t>=6;)i(s>>>t-6),t-=6},o.flush=function(){if(t>0&&(i(s<<6-t),s=0,t=0),e%3!=0){let a=3-e%3;for(let c=0;c<a;c+=1)n+="="}},o.toString=function(){return n},o},qc=function(s){let t=s,e=0,n=0,o=0,i={};i.read=function(){for(;o<8;){if(e>=t.length){if(o==0)return-1;throw"unexpected end of file./"+o}let c=t.charAt(e);if(e+=1,c=="=")return o=0,-1;if(c.match(/^\s$/))continue;n=n<<6|r(c.charCodeAt(0)),o+=6}let a=n>>>o-8&255;return o-=8,a};let r=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return i},Gc=function(s,t){let e=s,n=t,o=new Array(s*t),i={};i.setPixel=function(l,d,u){o[d*e+l]=u},i.write=function(l){l.writeString("GIF87a"),l.writeShort(e),l.writeShort(n),l.writeByte(128),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(255),l.writeByte(255),l.writeByte(255),l.writeString(","),l.writeShort(0),l.writeShort(0),l.writeShort(e),l.writeShort(n),l.writeByte(0);let d=2,u=a(d);l.writeByte(d);let h=0;for(;u.length-h>255;)l.writeByte(255),l.writeBytes(u,h,255),h+=255;l.writeByte(u.length-h),l.writeBytes(u,h,u.length-h),l.writeByte(0),l.writeString(";")};let r=function(l){let d=l,u=0,h=0,g={};return g.write=function(S,v){if(S>>>v)throw"length over";for(;u+v>=8;)d.writeByte(255&(S<<u|h)),v-=8-u,S>>>=8-u,h=0,u=0;h=S<<u|h,u=u+v},g.flush=function(){u>0&&d.writeByte(h)},g},a=function(l){let d=1<<l,u=(1<<l)+1,h=l+1,g=c();for(let p=0;p<d;p+=1)g.add(String.fromCharCode(p));g.add(String.fromCharCode(d)),g.add(String.fromCharCode(u));let S=Mr(),v=r(S);v.write(d,h);let $=0,M=String.fromCharCode(o[$]);for($+=1;$<o.length;){let p=String.fromCharCode(o[$]);$+=1,g.contains(M+p)?M=M+p:(v.write(g.indexOf(M),h),g.size()<4095&&(g.size()==1<<h&&(h+=1),g.add(M+p)),M=p)}return v.write(g.indexOf(M),h),v.write(u,h),v.flush(),S.toByteArray()},c=function(){let l={},d=0,u={};return u.add=function(h){if(u.contains(h))throw"dup key:"+h;l[h]=d,d+=1},u.size=function(){return d},u.indexOf=function(h){return l[h]},u.contains=function(h){return typeof l[h]<"u"},u};return i},Yc=function(s,t,e){let n=Gc(s,t);for(let a=0;a<t;a+=1)for(let c=0;c<s;c+=1)n.setPixel(c,a,e(c,a));let o=Mr();n.write(o);let i=Vc(),r=o.toByteArray();for(let a=0;a<r.length;a+=1)i.writeByte(r[a]);return i.flush(),"data:image/gif;base64,"+i},Pr=xt,ju=xt.stringToBytes;function Dr(s){let t=Pr(0,"M");t.addData(s),t.make();let e=t.getModuleCount(),n="";for(let o=0;o<e;o++)for(let i=0;i<e;i++)t.isDark(o,i)&&(n+=`M${i} ${o}h1v1h-1z`);return{size:e,d:n}}var Xc=1e4,Kt=class extends Te{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,n){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,n))}async newCode(){try{let e=await Er();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof at&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),Xc)}}async poll(e){let n=this.secret;if(n)try{let o=await Cr(n,location.origin);if(!this.running||n!==this.secret)return;if(this.problem=null,o.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:o.auth}));return}if(o.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return E;let{size:e,d:n}=Dr(_r(location.origin,this.code));return f`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${ae`<path d=${n} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return f`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?Tr(this.code):"····-····"}</p>
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
    </div>`}};Kt.styles=qe`
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
  `,Kt.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",Kt);var Vs="hassTokens";function Lr(){try{let s=localStorage.getItem(Vs);return s?JSON.parse(s):null}catch{return null}}function qs(s){try{s?localStorage.setItem(Vs,JSON.stringify(s)):localStorage.removeItem(Vs)}catch{}}function Jc(s){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=s)}function Zc(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(t=>{let e=n=>{s.stop(),s.hidden=!0,t(n)};s.addEventListener("paired",n=>e(n.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function Qc(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let t=location.search.includes("auth_callback");if(!t&&!Lr()){let e=await Zc();e&&qs(e)}try{let e=await pi({hassUrl:location.origin,loadTokens:async()=>Lr(),saveTokens:qs});t&&history.replaceState(null,"",location.pathname+ys(location.search));let n=await fi({auth:e});s.backend=new Xt(n),mr(n),gr(n,fr(import.meta.url),{reload:ed,idleFor:()=>Date.now()-Or}),n.addEventListener("reconnect-error",(o,i)=>{i===2&&Ir()})}catch(e){if(e===2){Ir();return}Jc(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}var Or=Date.now();for(let s of["pointerdown","keydown","wheel"])document.addEventListener(s,()=>Or=Date.now(),{capture:!0,passive:!0});var Rr="mydashlight-reloaded-for";function ed(s){try{if(sessionStorage.getItem(Rr)===s)return;sessionStorage.setItem(Rr,s)}catch{}location.reload()}function Ir(){qs(null),location.replace(location.pathname+ys(location.search))}var jr=nt(location.search),Br=document.querySelector("mydashlight-keyboard");Br&&jr.keyboard!==!1&&$r(Br);jr.cursor!=="show"&&pr();Qc();
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
