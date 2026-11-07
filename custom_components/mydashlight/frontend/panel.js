var go=Object.defineProperty;var pn=(s,t)=>()=>(s&&(t=s(s=0)),t);var fo=(s,t)=>{for(var e in t)go(s,e,{get:t[e],enumerable:!0})};function Qt(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function Xn(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function dr(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Ai(s){return dr(s,t=>t.unicode)}function cr(s){function t(e,n,o){let i=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(o)for(let[r,[l,c]]of Object.entries(o))i.createIndex(r,l,{multiEntry:c});return i}t(tt),t(Fe,sr,{[Mi]:[nr,!0],[Li]:[[ir,or]],[ji]:[rr,!0]}),t(es,void 0,{[Di]:[""]})}function zi(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function hr(s){let t=await new Promise((e,n)=>{let o=indexedDB.open(s,er);Jn[s]=o,o.onupgradeneeded=i=>{i.oldVersion<tr&&cr(o.result)},zi(e,n,o)});return t.onclose=()=>ns(s),t}function pr(s){return tn[s]||(tn[s]=hr(s)),tn[s]}function Ae(s,t,e,n){return new Promise((o,i)=>{let r=s.transaction(t,e,{durability:"relaxed"}),l=typeof t=="string"?r.objectStore(t):t.map(a=>r.objectStore(a)),c;n(l,r,a=>{c=a}),r.oncomplete=()=>o(c),r.onerror=()=>i(r.error)})}function ns(s){let t=Jn[s],e=t&&t.result;if(e){e.close();let n=sn[s];if(n)for(let o of n)o()}delete Jn[s],delete tn[s],delete sn[s]}function ur(s){return new Promise((t,e)=>{ns(s);let n=indexedDB.deleteDatabase(s);zi(t,e,n)})}function gr(s,t){let e=sn[s];e||(e=sn[s]=[]),e.push(t)}function et(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||fr.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function Ii(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=mr)}function br(s){return s.map(({annotation:e,emoticon:n,group:o,order:i,shortcodes:r,skins:l,tags:c,emoji:a,version:d})=>{let h=[...new Set(Ii([...(r||[]).map(et).flat(),...(c||[]).map(et).flat(),...et(e),n]))].sort(),f={annotation:e,group:o,order:i,tags:c,tokens:h,unicode:a,version:d};if(n&&(f.emoticon=n),r&&(f.shortcodes=r),l){f.skinTones=[],f.skinUnicodes=[],f.skinVersions=[];for(let{tone:b,emoji:T,version:u}of l)f.skinTones.push(b),f.skinUnicodes.push(T),f.skinVersions.push(u)}return f})}function Ri(s,t,e,n){s[t](e).onsuccess=o=>n&&n(o.target.result)}function He(s,t,e){Ri(s,"get",t,e)}function Bi(s,t,e){Ri(s,"getAll",t,e)}function ss(s){s.commit&&s.commit()}function vr(s,t){let e=s[0];for(let n=1;n<s.length;n++){let o=s[n];t(e)>t(o)&&(e=o)}return e}function Oi(s,t){let e=vr(s,o=>o.length),n=[];for(let o of e)s.some(i=>i.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function xr(s){return!await is(s,tt,nn)}async function yr(s,t,e){let[n,o]=await Promise.all([Zn,nn].map(i=>is(s,tt,i)));return n===e&&o===t}async function wr(s,t){return Ae(s,Fe,st,(n,o,i)=>{let r,l=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let a=c.target.result;for(let d of a)if(r=d.unicode,t(d))return i(d);if(a.length<50)return i();l()}};l()})}async function Ni(s,t,e,n){try{let o=br(t);await Ae(s,[Fe,tt],ts,([i,r],l)=>{let c,a,d=0;function h(){++d===2&&f()}function f(){if(!(c===n&&a===e)){i.clear();for(let b of o)i.put(b);r.put(n,Zn),r.put(e,nn),ss(l)}}He(r,Zn,b=>{c=b,h()}),He(r,nn,b=>{a=b,h()})})}finally{}}async function $r(s,t){return Ae(s,Fe,st,(e,n,o)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);Bi(e.index(Li),i,o)})}async function Ui(s,t){let e=Ii(et(t));return e.length?Ae(s,Fe,st,(n,o,i)=>{let r=[],l=()=>{r.length===e.length&&c()},c=()=>{let a=Oi(r,d=>d.unicode);i(a.sort((d,h)=>d.order<h.order?-1:1))};for(let a=0;a<e.length;a++){let d=e[a],h=a===e.length-1?IDBKeyRange.bound(d,d+"￿",!1,!0):IDBKeyRange.only(d);Bi(n.index(Mi),h,f=>{r.push(f),l()})}}):[]}async function kr(s,t){let e=await Ui(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(i=>i.toLowerCase()).includes(t.toLowerCase()))[0]||null:await wr(s,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function Er(s,t){return Ae(s,Fe,st,(e,n,o)=>He(e,t,i=>{if(i)return o(i);He(e.index(ji),t,r=>o(r||null))}))}function is(s,t,e){return Ae(s,t,st,(n,o,i)=>He(n,e,i))}function Cr(s,t,e,n){return Ae(s,t,ts,(o,i)=>{o.put(n,e),ss(i)})}function Tr(s,t){return Ae(s,es,ts,(e,n)=>He(e,t,o=>{e.put((o||0)+1,t),ss(n)}))}function _r(s,t,e){return e===0?[]:Ae(s,[es,Fe],st,([n,o],i,r)=>{let l=[];n.index(Di).openCursor(void 0,"prev").onsuccess=c=>{let a=c.target.result;if(!a)return r(l);function d(b){if(l.push(b),l.length===e)return r(l);a.continue()}let h=a.primaryKey,f=t.byName(h);if(f)return d(f);He(o,h,b=>{if(b)return d(b);a.continue()})}})}function Sr(s,t){let e=new Map;for(let o of s){let i=t(o);for(let r of i){let l=e;for(let a=0;a<r.length;a++){let d=r.charAt(a),h=l.get(d);h||(h=new Map,l.set(d,h)),l=h}let c=l.get(en);c||(c=[],l.set(en,c)),c.push(o)}}return(o,i)=>{let r=e;for(let a=0;a<o.length;a++){let d=o.charAt(a),h=r.get(d);if(h)r=h;else return[]}if(i)return r.get(en)||[];let l=[],c=[r];for(;c.length;){let d=[...c.shift().entries()].sort((h,f)=>h[0]<f[0]?-1:1);for(let[h,f]of d)h===en?l.push(...f):c.push(f)}return l}}function Pr(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||Ar.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function Pi(s){Pr(s);let t=(f,b)=>f.name.toLowerCase()<b.name.toLowerCase()?-1:1,e=s.sort(t),o=Sr(s,f=>{let b=new Set;if(f.shortcodes)for(let T of f.shortcodes)for(let u of et(T))b.add(u);return b}),i=f=>o(f,!0),r=f=>o(f,!1),l=f=>{let b=et(f),T=b.map((u,x)=>(x<b.length-1?i:r)(u));return Oi(T,u=>u.name).sort(t)},c=new Map,a=new Map;for(let f of s){a.set(f.name.toLowerCase(),f);for(let b of f.shortcodes||[])c.set(b.toLowerCase(),f)}return{all:e,search:l,byShortcode:f=>c.get(f.toLowerCase()),byName:f=>a.get(f.toLowerCase())}}function xt(s){if(!s)return s;if(Mr&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function Hi(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function Lr(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||Dr.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function Fi(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function jr(s){let t=await fetch(s,{method:"HEAD"});Fi(t,s);let e=t.headers.get("etag");return Hi(e),e}async function Qn(s){let t=await fetch(s);Fi(t,s);let e=t.headers.get("etag");Hi(e);let n=await t.json();return Lr(n),[e,n]}function zr(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function Ir(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=s.charCodeAt(o);return e}async function Wi(s){let t=JSON.stringify(s),e=Ir(t),n=await crypto.subtle.digest("SHA-1",e),o=zr(n);return btoa(o)}async function Rr(s,t){let e,n=await jr(t);if(!n){let o=await Qn(t);n=o[0],e=o[1],n||(n=await Wi(e))}await yr(s,t,n)||(e||(e=(await Qn(t))[1]),await Ni(s,e,t,n))}async function Br(s,t){let[e,n]=await Qn(t);e||(e=await Wi(n)),await Ni(s,n,t,e)}async function Or(s,t){try{await Rr(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var er,tr,Fe,tt,es,nr,Mi,sr,Di,ir,or,Li,Zn,nn,Si,st,ts,ji,rr,ar,lr,Jn,tn,sn,fr,mr,en,Ar,Mr,Dr,nt,os=pn(()=>{er=1,tr=1,Fe="emoji",tt="keyvalue",es="favorites",nr="tokens",Mi="tokens",sr="unicode",Di="count",ir="group",or="order",Li="group-order",Zn="eTag",nn="url",Si="skinTone",st="readonly",ts="readwrite",ji="skinUnicodes",rr="skinUnicodes",ar="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",lr="en";Jn={},tn={},sn={};fr=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);mr=2;en="";Ar=["name","url"];Mr=typeof wrappedJSObject<"u";Dr=["annotation","emoji","group","order","version"];nt=class{constructor({dataSource:t=ar,locale:e=lr,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=Pi(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await pr(this._dbName);gr(this._dbName,this._clear);let e=this.dataSource;await xr(t)?await Br(t,e):this._lazyUpdate=Or(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return Xn(t),await this.ready(),Ai(await $r(this._db,t)).map(xt)}async getEmojiBySearchQuery(t){Qt(t),await this.ready();let e=this._custom.search(t),n=Ai(await Ui(this._db,t)).map(xt);return[...e,...n]}async getEmojiByShortcode(t){Qt(t),await this.ready();let e=this._custom.byShortcode(t);return e||xt(await kr(this._db,t))}async getEmojiByUnicodeOrName(t){Qt(t),await this.ready();let e=this._custom.byName(t);return e||xt(await Er(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await is(this._db,tt,Si)||0}async setPreferredSkinTone(t){return Xn(t),await this.ready(),Cr(this._db,tt,Si,t)}async incrementFavoriteEmojiCount(t){return Qt(t),await this.ready(),Tr(this._db,t)}async getTopFavoriteEmoji(t){return Xn(t),await this.ready(),(await _r(this._db,this._custom,t)).map(xt)}set customEmoji(t){this._custom=Pi(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await ns(this._dbName)}async delete(){await this._shutdown(),await ur(this._dbName)}}});function Vi(s){return s.unicode.includes("‍")}function Gr(s){let t=qi(s,"#000"),e=qi(s,"#fff");return t&&e&&qr(t,e)}function Yr(){let s=Object.entries(Ur);try{for(let[t,e]of s)if(Gr(t))return e}catch{}finally{}return s[0][1]}function ta(s,t){if(t===0)return s;let e=s.indexOf(Jr);return e!==-1?s.substring(0,e)+String.fromCodePoint(Qr+t-1)+s.substring(e):(s.endsWith(Xr)&&(s=s.substring(0,s.length-1)),s+Zr+String.fromCodePoint(ea+t-1))}function ve(s){s.preventDefault(),s.stopPropagation()}function ds(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function no(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function na(s,t){let e=n=>{let o={};for(let i of n)typeof i.tone=="number"&&i.version<=t&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:n,skins:o,shortcodes:i,url:r,name:l,category:c,annotation:a})=>({unicode:n,name:l,shortcodes:i,url:r,category:c,annotation:a,id:n||l,skins:o&&e(o)}))}function ia(s,t,e){let n;sa?(n=new ResizeObserver(e),n.observe(s)):rn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function Gi(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function Yi(s,t,e){let n=Gi(t);if(!n){if(!We){We=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])We.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(We),We.firstChild.nodeValue=s,Gi(We)}finally{We.remove()}}return n}function ra(s,t,e){let n=!0;for(let o of s){let i=e(o);if(!i)continue;typeof cs>"u"&&(cs=Yi(oa,t,t));let l=Yi(o.unicode,i,t)/1.8<cs;gs.set(o.unicode,l),l||(n=!1)}return n}function aa(s){return no(s,t=>t)}function la(s){s&&(s.scrollTop=0)}function yt(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function Xi(s){return""+s}function da(s){let t=document.createElement("template");return t.innerHTML=s,t}function ga(s,t){ua?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function fa(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function ma(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=fa(n,s):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&ga(n,s)}function ba(s,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:l,attributeValuePost:c}}=e,a=s[i];if(o!==a)if(e.currentExpression=a,r)if(a===null)n.removeAttribute(r);else{let d=l+Xi(a)+c;n.setAttribute(r,d)}else{let d;Array.isArray(a)?ma(a,e):a instanceof Element?(d=a,n.replaceWith(d)):n.nodeValue=Xi(a),d&&(e.targetNode=d)}}}function va(s){let t="",e=!1,n=!1,o=-1,i=new Map,r=[],l=0;for(let a=0,d=s.length;a<d;a++){let h=s[a];if(t+=h.slice(l),a===d-1)break;for(let v=0;v<h.length;v++)switch(h.charAt(v)){case"<":{h.charAt(v+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let f=r[r.length-1],b=yt(i,f,()=>[]),T,u,x;if(n){let v=/(\S+)="?([^"=]*)$/.exec(h);T=v[1],u=v[2];let _=/^([^">]*)("?)/.exec(s[a+1]);x=_[1],t=t.slice(0,-1*v[0].length),l=_[0].length}else l=0;let E={attributeName:T,attributeValuePre:u,attributeValuePost:x,expressionIndex:a};b.push(E),!e&&!n&&(t+=" ")}return{template:da(t),elementsToBindings:i}}function Zi(s,t,e){for(let n=0;n<s.length;n++){let o=s[n],i=o.attributeName?t:t.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function xa(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))Zi(n,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let l=t.get(++r);l&&Zi(l,i,e)}while(i=o.nextNode())}return e}function ya(s){let{template:t,elementsToBindings:e}=yt(ca,s,()=>va(s)),n=t.cloneNode(!0).content.firstElementChild,o=xa(n,e);return function(r){return ba(r,o),n}}function wa(s){let t=yt(ha,s,()=>new Map),e=pa;function n(i,...r){let l=yt(t,i,()=>new Map);return yt(l,e,()=>ya(i))(r)}function o(i,r,l){return i.map((c,a)=>{let d=e;e=l(c);try{return r(c,a)}finally{e=d}})}return{map:o,html:n}}function $a(s,t,e,n,o,i,r,l,c){let{labelWithSkin:a,titleForEmoji:d,unicodeWithSkin:h}=e,{html:f,map:b}=wa(t);function T(v,_,U){return b(v,(z,Z)=>f`<button role="${_?"option":"menuitem"}" aria-selected="${_?Z===t.activeSearchItem:null}" aria-label="${a(z,t.currentSkinTone)}" title="${d(z)}" class="${"emoji"+(_&&Z===t.activeSearchItem?" active":"")+(z.unicode?"":" custom-emoji")}" id="${`${U}-${z.id}`}" style="${z.unicode?null:`--custom-emoji-background: url(${JSON.stringify(z.url)})`}">${z.unicode?h(z,t.currentSkinTone):""}</button>`,z=>`${U}-${z.id}`)}let x=f`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${b(t.skinTones,(v,_)=>f`<div id="skintone-${_}" class="emoji ${_===t.activeSkinTone?"active":""}" aria-selected="${_===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[_]}" aria-label="${t.i18n.skinTones[_]}">${v}</div>`,v=>v)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${b(t.groups,v=>f`<button role="tab" class="nav-button" aria-controls="tab-${v.id}" aria-label="${t.i18n.categories[v.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===v.id}" title="${t.i18n.categories[v.name]}" data-group-id="${v.id}"><div class="nav-emoji emoji">${v.emoji}</div></button>`,v=>v.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${b(t.currentEmojisWithCategories,(v,_)=>f`<div><div id="menu-label-${_}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:v.category?v.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${_!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(v.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${_}" id="${t.searchMode?"search-results":null}">${T(v.emojis,t.searchMode,"emo")}</div></div>`,v=>v.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${T(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,E=(v,_)=>{for(let U of s.querySelectorAll(`[${v}]`))_(U,U.getAttribute(v))};if(c){s.appendChild(x);for(let v of["click","focusout","input","keydown","keyup"])E(`data-on-${v}`,(_,U)=>{_.addEventListener(v,n[U])});E("data-ref",(v,_)=>{i[_]=v}),r.addEventListener("abort",()=>{s.removeChild(x)})}E("data-action",(v,_)=>{let U=l.get(_);U||l.set(_,U=new WeakSet),U.has(v)||(U.add(v),o[_](v))})}function ka(s){let t=!1,e,n=new Map,o=new Set,i,r=()=>{if(t)return;let a=[...o];o.clear();try{for(let d of a)d()}finally{i=!1,o.size&&(i=!0,an(r))}},l=new Proxy({},{get(a,d){if(e){let h=n.get(d);h||(h=new Set,n.set(d,h)),h.add(e)}return a[d]},set(a,d,h){if(a[d]!==h){a[d]=h;let f=n.get(d);if(f){for(let b of f)o.add(b);i||(i=!0,an(r))}}return!0}}),c=a=>{let d=()=>{let h=e;e=d;try{return a()}finally{e=h}};return d()};return s.addEventListener("abort",()=>{t=!0}),{state:l,createEffect:c}}function hs(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function Ea(s,t,e){{let n=s.closest(".tabpanel"),o=Ji.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),Ji.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function Ca(s,t){let e={},n=new AbortController,o=n.signal,{state:i,createEffect:r}=ka(o),l=new Map;on(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),on(i,t),on(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:Wr,isRtl:!1,currentGroupIndex:0,groups:rs,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let c=m=>{s.getElementById(m).focus()},a=m=>s.getElementById(`emo-${m.id}`),d=(m,w)=>{e.rootElement.dispatchEvent(new CustomEvent(m,{detail:w,bubbles:!0,composed:!0}))},h=(m,w)=>m.id===w.id,f=(m,w)=>{let{category:M,emojis:P}=m,{category:H,emojis:N}=w;return M!==H?!1:hs(P,N,h)},b=m=>{hs(i.currentEmojis,m,h)||(i.currentEmojis=m)},T=m=>{i.searchMode!==m&&(i.searchMode=m)},u=m=>{hs(i.currentEmojisWithCategories,m,f)||(i.currentEmojisWithCategories=m)},x=(m,w)=>w&&m.skins&&m.skins[w]||m.unicode,_={labelWithSkin:(m,w)=>aa([m.name||x(m,w),m.annotation,...m.shortcodes||ps].filter(Boolean)).join(", "),titleForEmoji:m=>m.annotation||(m.shortcodes||ps).join(", "),unicodeWithSkin:x},U={onClickSkinToneButton:j,onEmojiClick:Me,onNavClick:de,onNavKeydown:V,onSearchKeydown:$e,onSkinToneOptionsClick:S,onSkinToneOptionsFocusOut:te,onSkinToneOptionsKeydown:A,onSkinToneOptionsKeyup:O,onSearchInput:k},z={calculateEmojiGridStyle:ye,updateOnIntersection:Ve},Z=!0;r(()=>{$a(s,i,_,U,z,e,o,l,Z),Z=!1}),i.emojiVersion||ls().then(m=>{m||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function m(){let w=!1,M=setTimeout(()=>{w=!0,i.message=i.i18n.loadingMessage},Hr);try{await i.database.ready(),i.databaseLoaded=!0}catch(P){console.error(P),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(M),w&&(w=!1,i.message="")}}i.database&&m()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${Ki};`}),r(()=>{i.customEmoji&&i.database&&Y()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==us&&(i.groups=us):i.groups!==rs&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=rs)}),r(()=>{async function m(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}m()}),r(()=>{i.skinTones=Array(Ki).fill().map((m,w)=>ta(i.skinToneEmoji,w))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function m(){let{database:w}=i,M=(await Promise.all(Kr.map(P=>w.getEmojiByUnicodeOrName(P)))).filter(Boolean);i.defaultFavoriteEmojis=M}i.databaseLoaded&&m()});function Y(){let{customEmoji:m,database:w}=i,M=m||ps;w.customEmoji!==M&&(w.customEmoji=M)}r(()=>{async function m(){Y();let{database:w,defaultFavoriteEmojis:M,numColumns:P}=i,H=await w.getTopFavoriteEmoji(P),N=await le(no([...H,...M],$=>$.unicode||$.name).slice(0,P));i.currentFavorites=N}i.databaseLoaded&&i.defaultFavoriteEmojis&&m()});function ye(m){ia(m,o,()=>{{let w=getComputedStyle(e.rootElement),M=parseInt(w.getPropertyValue("--num-columns"),10),P=w.getPropertyValue("direction")==="rtl";i.numColumns=M,i.isRtl=P}})}function Ve(m){Ea(m,o,w=>{for(let{target:M,isIntersecting:P}of w)M.classList.toggle("onscreen",P)})}r(()=>{async function m(){let{searchText:w,currentGroup:M,databaseLoaded:P,customEmoji:H}=i;if(!P)i.currentEmojis=[],i.searchMode=!1;else if(w.length>=Nr){let N=await pe(w);i.searchText===w&&(b(N),T(!0))}else{let{id:N}=M;if(N!==-1||H&&H.length){let $=await X(N);i.currentGroup.id===N&&(b($),T(!1))}}}m()});let ie=()=>{rn(()=>la(e.tabpanelElement))};r(()=>{let{currentEmojis:m,emojiVersion:w}=i,M=m.filter(P=>P.unicode).filter(P=>Vi(P)&&!gs.has(P.unicode));if(!w&&M.length)b(m),rn(()=>qe(M));else{let P=w?m:m.filter(we);b(P),ie()}});function qe(m){ra(m,e.baselineEmoji,a)?ie():i.currentEmojis=[...i.currentEmojis]}function we(m){return!m.unicode||!Vi(m)||gs.get(m.unicode)}async function I(m){let w=i.emojiVersion||await ls();return m.filter(({version:M})=>!M||M<=w)}async function le(m){return na(m,i.emojiVersion||await ls())}async function X(m){let w=m===-1?i.customEmoji:await i.database.getEmojiByGroup(m);return le(await I(w))}async function pe(m){return le(await I(await i.database.getEmojiBySearchQuery(m)))}r(()=>{}),r(()=>{function m(){let{searchMode:M,currentEmojis:P}=i;if(M)return[{category:"",emojis:P}];let H=new Map;for(let N of P){let $=N.category||"",F=H.get($);F||(F=[],H.set($,F)),F.push(N)}return[...H.entries()].map(([N,$])=>({category:N,emojis:$})).sort((N,$)=>i.customCategorySorting(N.category,$.category))}let w=m();u(w)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:m}=i;eo(()=>{i.searchText=(m||"").trim(),i.activeSearchItem=-1})});function $e(m){if(!i.searchMode||!i.currentEmojis.length)return;let w=M=>{ve(m),i.activeSearchItem=ds(M,i.activeSearchItem,i.currentEmojis)};switch(m.key){case"ArrowDown":return w(!1);case"ArrowUp":return w(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return ve(m),it(i.currentEmojis[i.activeSearchItem].id)}}function de(m){let{target:w}=m,M=w.closest(".nav-button");if(!M)return;let P=parseInt(M.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(H=>H.id===P)}function V(m){let{target:w,key:M}=m,P=H=>{H&&(ve(m),H.focus())};switch(M){case"ArrowLeft":return P(w.previousElementSibling);case"ArrowRight":return P(w.nextElementSibling);case"Home":return P(w.parentElement.firstElementChild);case"End":return P(w.parentElement.lastElementChild)}}async function Q(m){let w=await i.database.getEmojiByUnicodeOrName(m),M=[...i.currentEmojis,...i.currentFavorites].find(H=>H.id===m),P=M.unicode&&x(M,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(m),{emoji:w,skinTone:i.currentSkinTone,...P&&{unicode:P},...M.name&&{name:M.name}}}async function it(m){let w=Q(m);d("emoji-click-sync",w),d("emoji-click",await w)}function Me(m){let{target:w}=m;if(!w.classList.contains("emoji"))return;ve(m);let M=w.id.substring(4);it(M)}function g(m){i.currentSkinTone=m,i.skinTonePickerExpanded=!1,c("skintone-button"),d("skin-tone-change",{skinTone:m}),i.database.setPreferredSkinTone(m)}function S(m){let{target:{id:w}}=m,M=w&&w.match(/^skintone-(\d)/);if(!M)return;ve(m);let P=parseInt(M[1],10);g(P)}function j(m){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(ve(m),rn(()=>c("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function A(m){if(!i.skinTonePickerExpanded)return;let w=async M=>{ve(m),i.activeSkinTone=M};switch(m.key){case"ArrowUp":return w(ds(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return w(ds(!1,i.activeSkinTone,i.skinTones));case"Home":return w(0);case"End":return w(i.skinTones.length-1);case"Enter":return ve(m),g(i.activeSkinTone);case"Escape":return ve(m),i.skinTonePickerExpanded=!1,c("skintone-button")}}function O(m){if(i.skinTonePickerExpanded)switch(m.key){case" ":return ve(m),g(i.activeSkinTone)}}async function te(m){let{relatedTarget:w}=m;(!w||w.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function k(m){i.rawSearchText=m.target.value}return{$set(m){on(i,m)},$destroy(){n.abort()}}}function Qi(s){s instanceof Ke||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var us,rs,Nr,Ki,eo,Ur,Hr,Fr,Wr,Kr,to,Vr,qi,qr,as,ls,gs,Xr,Zr,Jr,Qr,ea,rn,sa,oa,cs,We,ca,ha,pa,ua,an,Ji,ps,on,Ta,_a,Sa,Aa,so,Pa,Ke,io,oo=pn(()=>{os();us=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),rs=us.slice(1),Nr=2,Ki=6,eo=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;Ur={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},Hr=1e3,Fr="🖐️",Wr=8,Kr=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],to='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',Vr=(s,t)=>s<t?-1:s>t?1:0,qi=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${to}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},qr=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};ls=()=>(as||(as=new Promise(s=>eo(()=>s(Yr())))),as),gs=new Map,Xr="️",Zr="\uD83C",Jr="‍",Qr=127995,ea=57339;rn=requestAnimationFrame,sa=typeof ResizeObserver=="function";oa="😀";ca=new WeakMap,ha=new WeakMap,pa=Symbol("un-keyed"),ua="replaceChildren"in Element.prototype;an=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);Ji=new WeakMap;ps=[],{assign:on}=Object;Ta="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",_a="en",Sa={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},Aa=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',so=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],Pa=`:host{--emoji-font-family:${to}}`,Ke=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Aa+Pa,this.shadowRoot.appendChild(e),this._ctx={locale:_a,dataSource:Ta,skinToneEmoji:Fr,customCategorySorting:Vr,customEmoji:null,i18n:Sa,emojiVersion:null,...t};for(let n of so)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){Qi(this),this._cmp||(this._cmp=Ca(this.shadowRoot,this._ctx))}disconnectedCallback(){Qi(this),an(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new nt({locale:t,dataSource:e}))}_dbFlush(){an(()=>this._dbCreate())}},io={};for(let s of so)io[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(Ke.prototype,io);customElements.get("emoji-picker")||customElements.define("emoji-picker",Ke)});var ro={};fo(ro,{Database:()=>nt,Picker:()=>Ke});var ao=pn(()=>{oo();os()});var Tt=globalThis,_t=Tt.ShadowRoot&&(Tt.ShadyCSS===void 0||Tt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,un=Symbol(),$s=new WeakMap,rt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==un)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(_t&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=$s.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&$s.set(e,t))}return t}toString(){return this.cssText}},ks=s=>new rt(typeof s=="string"?s:s+"",void 0,un),De=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,o,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new rt(e,s,un)},Es=(s,t)=>{if(_t)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=Tt.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}},gn=_t?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return ks(e)})(s):s;var{is:mo,defineProperty:bo,getOwnPropertyDescriptor:vo,getOwnPropertyNames:xo,getOwnPropertySymbols:yo,getPrototypeOf:wo}=Object,St=globalThis,Cs=St.trustedTypes,$o=Cs?Cs.emptyScript:"",ko=St.reactiveElementPolyfillSupport,at=(s,t)=>s,fn={toAttribute(s,t){switch(t){case Boolean:s=s?$o:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},_s=(s,t)=>!mo(s,t),Ts={attribute:!0,type:String,converter:fn,reflect:!1,useDefault:!1,hasChanged:_s};Symbol.metadata??=Symbol("metadata"),St.litPropertyMetadata??=new WeakMap;var ke=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ts){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&bo(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:i}=vo(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let l=o?.call(this);i?.call(this,r),this.requestUpdate(t,l,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ts}static _$Ei(){if(this.hasOwnProperty(at("elementProperties")))return;let t=wo(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(at("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(at("properties"))){let e=this.properties,n=[...xo(e),...yo(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(gn(o))}else t!==void 0&&e.push(gn(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Es(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:fn).toAttribute(e,n.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=n.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:fn;this._$Em=o;let l=r.fromAttribute(e,i.type);this[o]=l??this._$Ej?.get(o)??l,this._$Em=null}}requestUpdate(t,e,n,o=!1,i){if(t!==void 0){let r=this.constructor;if(o===!1&&(i=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??_s)(i,e)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:i},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,i]of n){let{wrapped:r}=i,l=this[o];r!==!0||this._$AL.has(o)||l===void 0||this.C(o,void 0,i,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};ke.elementStyles=[],ke.shadowRootOptions={mode:"open"},ke[at("elementProperties")]=new Map,ke[at("finalized")]=new Map,ko?.({ReactiveElement:ke}),(St.reactiveElementVersions??=[]).push("2.1.2");var bn=globalThis,Ss=s=>s,At=bn.trustedTypes,As=At?At.createPolicy("lit-html",{createHTML:s=>s}):void 0,vn="$lit$",Ee=`lit$${Math.random().toFixed(9).slice(2)}$`,xn="?"+Ee,Eo=`<${xn}>`,ze=document,dt=()=>ze.createComment(""),ct=s=>s===null||typeof s!="object"&&typeof s!="function",yn=Array.isArray,zs=s=>yn(s)||typeof s?.[Symbol.iterator]=="function",mn=`[ 	
\f\r]`,lt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ps=/-->/g,Ms=/>/g,Le=RegExp(`>|${mn}(?:([^\\s"'>=/]+)(${mn}*=${mn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ds=/'/g,Ls=/"/g,Is=/^(?:script|style|textarea|title)$/i,wn=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),p=wn(1),ee=wn(2),Xa=wn(3),Ce=Symbol.for("lit-noChange"),y=Symbol.for("lit-nothing"),js=new WeakMap,je=ze.createTreeWalker(ze,129);function Rs(s,t){if(!yn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return As!==void 0?As.createHTML(t):t}var Bs=(s,t)=>{let e=s.length-1,n=[],o,i=t===2?"<svg>":t===3?"<math>":"",r=lt;for(let l=0;l<e;l++){let c=s[l],a,d,h=-1,f=0;for(;f<c.length&&(r.lastIndex=f,d=r.exec(c),d!==null);)f=r.lastIndex,r===lt?d[1]==="!--"?r=Ps:d[1]!==void 0?r=Ms:d[2]!==void 0?(Is.test(d[2])&&(o=RegExp("</"+d[2],"g")),r=Le):d[3]!==void 0&&(r=Le):r===Le?d[0]===">"?(r=o??lt,h=-1):d[1]===void 0?h=-2:(h=r.lastIndex-d[2].length,a=d[1],r=d[3]===void 0?Le:d[3]==='"'?Ls:Ds):r===Ls||r===Ds?r=Le:r===Ps||r===Ms?r=lt:(r=Le,o=void 0);let b=r===Le&&s[l+1].startsWith("/>")?" ":"";i+=r===lt?c+Eo:h>=0?(n.push(a),c.slice(0,h)+vn+c.slice(h)+Ee+b):c+Ee+(h===-2?l:b)}return[Rs(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},ht=class s{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let i=0,r=0,l=t.length-1,c=this.parts,[a,d]=Bs(t,e);if(this.el=s.createElement(a,n),je.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(o=je.nextNode())!==null&&c.length<l;){if(o.nodeType===1){if(o.hasAttributes())for(let h of o.getAttributeNames())if(h.endsWith(vn)){let f=d[r++],b=o.getAttribute(h).split(Ee),T=/([.?@])?(.*)/.exec(f);c.push({type:1,index:i,name:T[2],strings:b,ctor:T[1]==="."?Mt:T[1]==="?"?Dt:T[1]==="@"?Lt:Re}),o.removeAttribute(h)}else h.startsWith(Ee)&&(c.push({type:6,index:i}),o.removeAttribute(h));if(Is.test(o.tagName)){let h=o.textContent.split(Ee),f=h.length-1;if(f>0){o.textContent=At?At.emptyScript:"";for(let b=0;b<f;b++)o.append(h[b],dt()),je.nextNode(),c.push({type:2,index:++i});o.append(h[f],dt())}}}else if(o.nodeType===8)if(o.data===xn)c.push({type:2,index:i});else{let h=-1;for(;(h=o.data.indexOf(Ee,h+1))!==-1;)c.push({type:7,index:i}),h+=Ee.length-1}i++}}static createElement(t,e){let n=ze.createElement("template");return n.innerHTML=t,n}};function Ie(s,t,e=s,n){if(t===Ce)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,i=ct(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=Ie(s,o._$AS(s,t.values),o,n)),t}var Pt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??ze).importNode(e,!0);je.currentNode=o;let i=je.nextNode(),r=0,l=0,c=n[0];for(;c!==void 0;){if(r===c.index){let a;c.type===2?a=new Ge(i,i.nextSibling,this,t):c.type===1?a=new c.ctor(i,c.name,c.strings,this,t):c.type===6&&(a=new jt(i,this,t)),this._$AV.push(a),c=n[++l]}r!==c?.index&&(i=je.nextNode(),r++)}return je.currentNode=ze,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},Ge=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=y,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Ie(this,t,e),ct(t)?t===y||t==null||t===""?(this._$AH!==y&&this._$AR(),this._$AH=y):t!==this._$AH&&t!==Ce&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):zs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==y&&ct(this._$AH)?this._$AA.nextSibling.data=t:this.T(ze.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=ht.createElement(Rs(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new Pt(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=js.get(t.strings);return e===void 0&&js.set(t.strings,e=new ht(t)),e}k(t){yn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let i of t)o===e.length?e.push(n=new s(this.O(dt()),this.O(dt()),this,this.options)):n=e[o],n._$AI(i),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=Ss(t).nextSibling;Ss(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Re=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,i){this.type=1,this._$AH=y,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=y}_$AI(t,e=this,n,o){let i=this.strings,r=!1;if(i===void 0)t=Ie(this,t,e,0),r=!ct(t)||t!==this._$AH&&t!==Ce,r&&(this._$AH=t);else{let l=t,c,a;for(t=i[0],c=0;c<i.length-1;c++)a=Ie(this,l[n+c],e,c),a===Ce&&(a=this._$AH[c]),r||=!ct(a)||a!==this._$AH[c],a===y?t=y:t!==y&&(t+=(a??"")+i[c+1]),this._$AH[c]=a}r&&!o&&this.j(t)}j(t){t===y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Mt=class extends Re{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===y?void 0:t}},Dt=class extends Re{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==y)}},Lt=class extends Re{constructor(t,e,n,o,i){super(t,e,n,o,i),this.type=5}_$AI(t,e=this){if((t=Ie(this,t,e,0)??y)===Ce)return;let n=this._$AH,o=t===y&&n!==y||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==y&&(n===y||o);o&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},jt=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Ie(this,t)}},Os={M:vn,P:Ee,A:xn,C:1,L:Bs,R:Pt,D:zs,V:Ie,I:Ge,H:Re,N:Dt,U:Lt,B:Mt,F:jt},Co=bn.litHtmlPolyfillSupport;Co?.(ht,Ge),(bn.litHtmlVersions??=[]).push("3.3.3");var Ns=(s,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let i=e?.renderBefore??null;n._$litPart$=o=new Ge(t.insertBefore(dt(),i),i,void 0,e??{})}return o._$AI(s),o};var $n=globalThis,ce=class extends ke{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ns(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Ce}};ce._$litElement$=!0,ce.finalized=!0,$n.litElementHydrateSupport?.({LitElement:ce});var To=$n.litElementPolyfillSupport;To?.({LitElement:ce});($n.litElementVersions??=[]).push("4.2.2");var Ye="mydashlight",dl=`/api/${Ye}/pair`,cl=`/api/${Ye}/pair/poll`,hl=`/${Ye}`,pt="pair";function Us(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function kn(s){return s.toUpperCase().replace(/[^A-Z0-9]/g,"")}function Hs(s){let t=new URLSearchParams(s);return t.has(pt)?kn(t.get(pt)??""):null}function _o(s){if(s<60)return"just now";let t=Math.round(s/60);return`${t} minute${t===1?"":"s"} ago`}var ut=class extends ce{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let n=await this.connection.sendMessagePromise({type:`${Ye}/pair/check`,code:e});n.found?(this.waiting=n,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(n){this.error=this.message(n),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${Ye}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let n=e?.code;return n==="unauthorized"?"Only a Home Assistant admin can pair a screen.":n==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":n==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return p`<form @submit=${o=>{o.preventDefault();let i=kn(this.typed);i&&this.check(i)}}>
      <h2>Pair a screen</h2>
      <p>Type the code the screen is showing.</p>
      ${this.error?p`<p class="error" role="alert">${this.error}</p>`:y}
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
      <p class="code">${Us(e.code??"")}</p>
      ${o?p`<p class="warning" role="alert">
            <b>This code came from outside your home network.</b> Only allow it if you can see this code on a
            screen of your own right now. If someone sent you this code or link, press Cancel.
          </p>`:y}
      <p>
        A screen at ${e.address} asked ${_o(e.age??0)}. Check the code matches the one on the screen. It will be
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
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Close</button></div>`,p`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${e}</div>`}};ut.styles=De`
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
  `,ut.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",ut);function D(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function gt(s){let t=Math.floor(Math.round(s)/60)%24;return`${D(s)} ${t<12?"AM":"PM"}`}function Fs(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function mt(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function Ws(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var So=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Ao=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Po=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function zt(s){return new Date(`${s}T12:00:00Z`)}function ge(s){let t=zt(s);return`${So.format(t)}, ${Po.format(t)}`}function se(s){return Ao.format(zt(s))}function fe(s,t){return Math.round((zt(t).getTime()-zt(s).getTime())/864e5)}function ft(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return ft("UTC",t)}let n=o=>e.find(i=>i.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function It(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=ft(e,s),i=ft(e,t).date;return o.date===i?`at ${gt(o.minutes)}`:`on ${se(o.date)} at ${gt(o.minutes)}`}var G=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},Be="mydashlight",Mo=7,Ks=3e4;function En(s){if(s instanceof G)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new G(String(t.code??"error"),t.message)}return typeof s=="number"?new G("connection_lost","Lost the connection to Home Assistant."):new G("error",String(s))}var Rt=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new G("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},Ks),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new G("not_running","MyDashLight isn’t running right now."))},{type:`${Be}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:Be,service:"get_plan",service_data:{days:Mo},return_response:!0});this.emit(t.response)}catch(t){this.fail(En(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Be,service:t,service_data:e})}catch(n){throw En(n)}this.pushing||await this.refresh()}setRide(t,e,n,o){return this.call("set_ride",{event:t,side:e,driver:n,scope:o})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:Ws(e),scope:n})}setTakeAlong(t,e,n){return this.call("set_take_along",{event:t,kids:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}watchChores(t){let e=!1,n=null,o=null,i=async()=>{try{let r=await this.conn.sendMessagePromise({type:"call_service",domain:Be,service:"get_chores",service_data:{},return_response:!0});e||t(r.response??null)}catch{e||t(null)}};return(async()=>{try{let r=await this.conn.subscribeMessage(l=>{e||t(l.chores)},{type:`${Be}/chores/subscribe`},{resubscribe:!0});e?r().catch(()=>{}):n=r}catch{if(e)return;i(),o=setInterval(()=>void i(),Ks)}})(),()=>{e=!0,o&&clearInterval(o),n&&n().catch(()=>{})}}watchLunch(t){let e=!1,n=null;return(async()=>{try{let o=await this.conn.subscribeMessage(i=>{e||t(i.lunch)},{type:`${Be}/lunch/subscribe`},{resubscribe:!0});e?o().catch(()=>{}):n=o}catch{e||t(null)}})(),()=>{e=!0,n&&n().catch(()=>{})}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Be,service:t,service_data:e})}catch(n){throw En(n)}}};var Vs={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},qs=s=>(...t)=>({_$litDirective$:s,values:t}),Bt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Do}=Os,Gs=s=>s;var Ys=()=>document.createComment(""),Xe=(s,t,e)=>{let n=s._$AA.parentNode,o=t===void 0?s._$AB:t._$AA;if(e===void 0){let i=n.insertBefore(Ys(),o),r=n.insertBefore(Ys(),o);e=new Do(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,l=r!==s;if(l){let c;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(c=s._$AU)!==r._$AU&&e._$AP(c)}if(i!==o||l){let c=e._$AA;for(;c!==i;){let a=Gs(c).nextSibling;Gs(n).insertBefore(c,o),c=a}}}return e},Pe=(s,t,e=s)=>(s._$AI(t,e),s),Lo={},Xs=(s,t=Lo)=>s._$AH=t,Zs=s=>s._$AH,Ot=s=>{s._$AR(),s._$AA.remove()};var Js=(s,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(s[o],o);return n},Te=qs(class extends Bt{constructor(s){if(super(s),s.type!==Vs.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],i=[],r=0;for(let l of s)o[r]=n?n(l,r):r,i[r]=e(l,r),r++;return{values:i,keys:o}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let o=Zs(s),{values:i,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,i;let l=this.ut??=[],c=[],a,d,h=0,f=o.length-1,b=0,T=i.length-1;for(;h<=f&&b<=T;)if(o[h]===null)h++;else if(o[f]===null)f--;else if(l[h]===r[b])c[b]=Pe(o[h],i[b]),h++,b++;else if(l[f]===r[T])c[T]=Pe(o[f],i[T]),f--,T--;else if(l[h]===r[T])c[T]=Pe(o[h],i[T]),Xe(s,c[T+1],o[h]),h++,T--;else if(l[f]===r[b])c[b]=Pe(o[f],i[b]),Xe(s,o[h],o[f]),f--,b++;else if(a===void 0&&(a=Js(r,b,T),d=Js(l,h,f)),a.has(l[h]))if(a.has(l[f])){let u=d.get(r[b]),x=u!==void 0?o[u]:null;if(x===null){let E=Xe(s,o[h]);Pe(E,i[b]),c[b]=E}else c[b]=Pe(x,i[b]),Xe(s,o[h],x),o[u]=null;b++}else Ot(o[f]),f--;else Ot(o[h]),h++;for(;b<=T;){let u=Xe(s,c[T+1]);Pe(u,i[b]),c[b++]=u}for(;h<=f;){let u=o[h++];u!==null&&Ot(u)}return this.ut=r,Xs(s,c),Ce}});var Nt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function J(s){return Nt[(s%Nt.length+Nt.length)%Nt.length]}var Ut="#23272E",Cn="35,39,46";var jo=3,Vt=36,Tn=12,Qs=8,ei=30,me=16,bt=100,_n=60,Sn=10,Ft=30,An=10,zo=150,Io=200,Kt=1.4;function Mn(s,t){let e=Math.max(zo,Io/Kt);return Math.ceil(_n+Math.max(0,s-1)*Sn+Ft+Math.max(0,t-1)*An+e*(s+Kt*t))}function _e(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function Se(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function re(s){return new Map(_e(s).map((t,e)=>[t,J(e)]))}function he(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function ae(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function Dn(s,t){return t==="none"?"Not needed":Se(s).includes(t)?ae(s,t):t}function qt(s,t){return t.own?ae(s,t.own):he(s,t.kid)}var Gt={color:Ut,rgb:Cn,ink:Ut};function ii(s,t){return t.own?Gt:re(s).get(t.kid)??J(0)}function Ro(s,t){let e=_e(s);return t.along.map(n=>e.includes(n)?he(s,n):ae(s,n))}function Ln(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function Bo(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function Wt(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function Ht(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(Wt(t,n.from)),e.push(Wt(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(Wt(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Oo(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,l)=>r.s-l.s||l.en-r.en),e=[],n=[],o=-1/0,i=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(i(),o=-1/0);let l=n.findIndex(c=>c<=r.s);l<0?(l=n.length,n.push(r.en)):n[l]=r.en,r.col=l,e.push(r),o=Math.max(o,r.en)}return i(),t}function No(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return s[s.length-1].y}function Uo(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return s[s.length-1].t}function oi(s,t){return No(s.anchors,t)}function ri(s,t){return Uo(s.anchors,t)}function Ho(s,t){let e=_e(s),n=Se(s),o=Math.max(t,Mn(e.length,n.length)),r=(o-_n-Math.max(0,e.length-1)*Sn-Ft-Math.max(0,n.length-1)*An)/(e.length+Kt*n.length||1),l=Math.floor(r),c=Math.floor(r*Kt),a=new Map;for(let T of s.days)for(let u of T.events)for(let x of u.own?u.along:[u.kid]){let E=a.get(x)??[];E.some(v=>v.event_id===u.event_id&&v.calendar_id===u.calendar_id)||E.push(u),a.set(x,E)}let d=re(s),h=[],f=_n;e.forEach((T,u)=>{let x=a.get(T)??[],E=s.days.some(v=>v.events.some(_=>_.kid===T&&(_.sides.includes("drop")&&_.drop===""||_.sides.includes("pick")&&_.pick==="")));h.push({id:T,kind:"kid",x:f,w:l,name:he(s,T),dot:d.get(T).color,rgb:d.get(T).rgb,sub:`${E?"Needs a ride · ":""}${x.length} this week`,subWarn:E}),f+=l+(u<e.length-1?Sn:0)});let b=f+Ft/2;return f+=Ft,n.forEach((T,u)=>{let x=0,E=0;for(let v of s.days){let _=v.drivers[T];_&&(x+=_.outings.length,E+=_.drive??0)}h.push({id:T,kind:"driver",x:f,w:c,name:ae(s,T),dot:Ut,rgb:Cn,sub:`${x} ${x===1?"trip":"trips"} this week · ${mt(E)} driving`,subWarn:!1}),f+=c+(u<n.length-1?An:0)}),{columns:h,sepX:b,width:o}}function Fo(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function ti(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${D(s.start)}`:e||!t?`${s.title} until ${D(s.end)}`:`${s.title} ${D(s.start)}–${D(s.end)}`}function jn(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length}function zn(s,t){let e=fe(t,s);return e===0?"Today":e===1?"Tomorrow":""}function ne(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Pn(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),o=1,i=0;for(let r of s.split(/\s+/).filter(Boolean)){let l=r.length;for(i===0?i=l:i+1+l<=n?i+=1+l:(o++,i=l);i>n;)o++,i-=n}return o}var ai=25,li=15,In=3;function ni(s){return Math.max(0,Math.min(In,Math.floor((s-ai)/li)))}function Wo(s,t){let e=Math.min(In,Pn(s,t-19,6.6));return ai+e*li+2}function si(s,t){let e=t-23,n=`${D(s.start)}–${D(s.end)}`+(s.arrive_by!=null?` · arrive ${D(s.arrive_by)}`:""),o=33+Pn(n,e,6.6)*16;for(let i of[s.lines.drop,s.lines.pick])i&&(o+=2+Pn(i.text,e,7)*16);return o+4}function di(s,t,e,n){let o=t==="compact",{columns:i,sepX:r,width:l}=Ho(s,e),c=new Map(i.map(v=>[v.id,v])),a=_e(s),d=Se(s),h=[...a,...d],f=re(s),b=Bo(s),T=v=>he(s,v),u=v=>ae(s,v),x={mode:t,width:l,height:0,columns:i,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},E=0;return s.days.forEach((v,_)=>{let U=_*1440,z=new Map(v.events.map(g=>[g.id,g])),Z=g=>g&&z.has(g)?{day:v.date,event:g}:null,Y=jn(v),ye=v.events.length,Ve=zn(v.date,n.date);x.dayHeads.push({date:v.date,y:E,label:ge(v.date),tag:Ve,sub:(ye?`${ye} ${ye===1?"activity":"activities"}`:"Nothing scheduled")+(Y?` · ${Y} to sort out`:""),warn:Y>0}),x.anchors.push({t:U,y:E});let ie=E+Vt+Tn,qe=d.flatMap(g=>v.drivers[g]?.outings??[]);if(!ye&&!qe.length){x.empties.push({key:v.date,y:ie,text:"Nothing planned"}),E=ie+40,x.anchors.push({t:U+1439,y:E});return}let we=(g,S,j,A,O,te,k,m=g.kid)=>{let w=!!g.own&&m===g.own,M=!!g.own&&m!==g.own,P=w?Gt:f.get(m)??J(0),H=w?u(m):T(m),N=M?{drop:{text:`With ${u(g.own)}`,tone:g.attending===!1?"muted":"normal"},pick:null}:g.lines,$=w?Ro(s,g):[],F=(g.takes!=null?`${g.takes} min, any time ${D(g.start)}–${D(g.end)}`:`${D(g.start)}–${D(g.end)}`+(g.arrive_by!=null?` · arrive ${D(g.arrive_by)}`:""))+($.length?` · with ${Ln($)}`:"");return{key:`${v.date}|card|${g.id}`+(g.own?`|${m}`:""),x:S,y:j,w:A,h:O,target:{day:v.date,event:g.id},event:g,color:P,kidName:H,clash:te,stayed:!g.own&&g.stay&&d.includes(g.drop),skipped:g.attending===!1,title:Fo(g.title,H),time:F,drop:N.drop,pick:N.pick,showDrop:!!N.drop&&(k||O>=56),showPick:!!N.pick&&(k||O>=74),wrap:k,aria:`${H}, ${g.title} ${g.takes!=null?`any time from ${D(g.start)} to ${D(g.end)}`:`${D(g.start)} to ${D(g.end)}`}. `+(g.attending===!1&&!N.drop?"Not attending. ":"")+[N.drop,N.pick].filter(C=>!!C).map(C=>C.text).join(". ")}},I=g=>{let S=v.rides[g];return S?(v.drivers[S.driver]?.segments??[]).filter(A=>A.type!=="home"&&A.kids.includes(S.kid)&&ne(A.start)>=ne(S.start)&&ne(A.end)<=ne(S.end)):[]},le=g=>{let S=v.rides[g];if(!S)return null;let j=S.serves.find(A=>z.get(A)?.kid===S.kid);return Z(j??S.serves[0])},X=(g,S)=>{if(S.event)return S;let j=v.events.find(A=>A.own&&A.own!==g&&A.along.includes(g)&&A.title===S.title);return j?{...S,title:`${S.title} with ${u(j.own)}`}:S},pe=g=>{if(g.takes==null)return[g.start,g.end];let S=g.planned??g.start;return[S,S+g.takes]},$e=new Map;for(let g of v.issues)g.level!=="problem"||!g.event||(g.kind==="late"&&$e.set(g.event,`${Math.round(ne(g.minutes))} min late`),g.kind==="waiting"&&$e.set(`${g.event}|pick`,`Waits ${Math.round(ne(g.minutes))} min`));if(!o){let g=1/0,S=-1/0;for(let k of v.events)k.start<=0&&k.end>=1440||(k.start>0?g=Math.min(g,k.start-20,k.arrive_by!=null?k.arrive_by-10:1/0):g=Math.min(g,k.end-30),k.end<1440?S=Math.max(S,k.end+20):S=Math.max(S,k.start+30));for(let k of qe)k.start!=null&&(g=Math.min(g,k.start)),k.end!=null&&(S=Math.max(S,k.end));v.date===n.date&&Number.isFinite(g)&&n.minutes>g-60&&n.minutes<S&&(g=Math.min(g,n.minutes-15));let j=Number.isFinite(g)?Math.floor((g-5)/30)*30:900,A=Number.isFinite(S)?Math.ceil((S+5)/30)*30:960,O=k=>Math.round(ie+(Math.max(j,Math.min(A,k))-j)*jo);x.anchors.push({t:U+j,y:O(j)},{t:U+A,y:O(A)});for(let k of a){let m=c.get(k),w=f.get(k),M=(v.kids[k]?.items??[]).filter(C=>C.start!=null&&C.end!=null).map(C=>({item:C,s:ne(C.start),en:ne(C.end)})),P=[];for(let C of Oo(M)){let L=m.w/C.cols,R=Math.round(m.x+C.col*L),W=Math.round(L-(C.cols>1?4:0)),q=O(C.s),K=C.item;if(K.type==="act"){let oe=z.get(K.event??"");if(!oe)continue;let Et=Math.max(30,O(C.en)-q),Ct=we(oe,R,q,W,Et,K.clash,!1,k);if(Ct.layer=bt,x.cards.push(Ct),oe.arrive_by!=null&&oe.start-oe.arrive_by>=5){let hn=O(oe.arrive_by),ws={key:`${v.date}|prep|${oe.id}`,x:R,y:hn,w:W,h:q-hn+me,color:w,label:`Arrive by ${D(oe.arrive_by)}`,layer:bt-1};x.preps.push(ws),P.push({s:oe.arrive_by,en:C.en,top:hn,bottom:q+Et,x:R,w:W,prep:ws,card:Ct})}else P.push({s:C.s,en:C.en,top:q,bottom:q+Et,x:R,w:W,card:Ct});let xs=$e.get(oe.id);xs&&x.marks.push({key:`${v.date}|late|${oe.id}`,x:R+W-4,y:q+4,text:xs,right:!0});let ys=$e.get(`${oe.id}|pick`);ys&&x.marks.push({key:`${v.date}|wait|${oe.id}`,x:R+4,y:q+Et+2,text:ys,right:!1});continue}let B=v.rides[K.ride??-1];if(!B)continue;let ue=Math.max(22,O(C.en)-q),ot=Ht(I(B.index),b),ms=u(B.driver),bs={key:`${v.date}|ride|${B.index}`,x:R,y:q,w:W,h:ue,target:le(B.index),l1:`${B.own?"In":"Along in"} ${ms}’s car`,l2:ot.join(" → "),show2:ni(ue)>0,lines2:ni(ue),dashed:!B.own,clash:K.clash,aria:`${T(k)} ${B.own?"in":"riding along in"} ${ms}’s car, ${D(ne(B.start))} to ${D(ne(B.end))}: ${ot.join(" to ")}`};x.rides.push(bs);let vs=c.get(B.driver),cn=null;vs&&(cn={key:`${v.date}|band|${B.index}`,x:R+W,y:q,w:Math.max(0,vs.x+8-(R+W)),h:ue,color:w},x.bands.push(cn)),P.push({s:C.s,en:C.en,top:q,bottom:q+ue,x:R,w:W,ride:bs,band:cn})}let H=C=>C.ride?.layer??(C.prep?bt-1:bt),N=(C,L,R,W)=>{R>me&&x.links.push({key:`${C.key}|link`,x:C.x,y:L,w:C.w,h:R,color:w,layer:W})},$=(C,L)=>{if(!(L.x<C.x||L.x+L.w>C.x+C.w)&&(C.x=L.x,C.w=L.w,C.ride.x=L.x,C.ride.w=L.w,C.band)){let R=C.band.x+C.band.w;C.band.x=L.x+L.w,C.band.w=Math.max(0,R-C.band.x)}},F=new Set;for(let C of[...P].sort((L,R)=>R.s-L.s)){let L=C.ride;if(!L)continue;let R=P.filter(K=>K!==C&&K.s>=C.en&&K.s-C.en<=ei&&K.top>=C.bottom).sort((K,B)=>K.s-B.s||K.top-B.top)[0];if(!R)continue;F.add(C),$(C,R);let W=H(R),q=R.top-C.bottom;N(L,C.bottom,q+me,W-1),L.layer=W-(q>0?2:1),L.h+=me,L.tuckBottom=me}for(let C of[...P].sort((L,R)=>L.s-R.s)){let L=C.ride;if(!L||F.has(C))continue;let R=P.filter(K=>K!==C&&K.en<=C.s&&C.s-K.en<=ei&&K.bottom<=C.top&&(K.card||K.ride?.layer!=null)).sort((K,B)=>B.en-K.en||B.bottom-K.bottom)[0];if(!R)continue;$(C,R);let W=R.ride?.layer??bt,q=C.top-R.bottom;N(L,R.bottom-me,q+me,W-1),L.layer=W-(q>0?2:1),L.y-=me,L.h+=me,L.tuckTop=me}}for(let k of d){let m=c.get(k),w=v.drivers[k];if(!w)continue;let M=[],P=null;for(let $ of w.segments)if(!($.start==null||$.end==null)){if($.type==="home"){P=null;continue}if($.type==="stay"){P=null,M.push({type:"stay",g:$,s:$.start,en:$.end});continue}P&&P.en===$.start?(P.en=$.end,P.legs.push($)):(P={type:"trip",s:$.start,en:$.end,legs:[$]},M.push(P))}let H=new Set,N=($,F,C,L)=>{H.add($.id);let R=O(F),W=we($,m.x+8,R,m.w-16,Math.max(30,O(C)-R),!1,!1,k);L&&W.drop?.tone==="normal"&&(W.drop=null,W.showDrop=!1),x.cards.push(W)};for(let $ of M){let F=O($.s),C=Math.max(24,O($.en)-F);if($.type==="stay"){let B=z.get($.g.event??$.g.serves??"");if(B?.own===k){N(B,$.s,$.en,!0);continue}let ue=B?f.get(B.kid)??J(0):J(0),ot=$.g.kids.map(T);x.stays.push({key:`${v.date}|stay|${k}|${$.s}`,x:m.x+8,y:F,w:m.w-16,h:C,target:Z(B?.id),color:ue,l1:B?`At ${B.title} with ${T(B.kid)}`:"Staying",l2:`until ${D($.en)}`+(ot.length?` · ${ot.join(" and ")} too`:"")});continue}let L=$.legs[0],R=$.legs[$.legs.length-1],W=[];for(let B of $.legs)for(let ue of B.kids)W.includes(ue)||W.push(ue);let q=R.type==="drive"&&R.to==="home",K=Ht($.legs,b);x.trips.push({key:`${v.date}|trip|${k}|${$.s}`,x:m.x+8,y:F,w:m.w-16,h:C,target:Z($.legs.find(B=>B.serves)?.serves),l1:L.type==="drive"&&L.from==="home"?`Leave ${D($.s)}`:`From ${Wt(b,L.from??L.place)} ${D($.s)}`,l2:K.join(" → "),show2:C>=36,l3:q?`Home ${D($.en)}`:"",show3:q&&C>=62,stops:null,kids:W.map(B=>(f.get(B)??J(0)).color),bad:$.legs.some(B=>B.overlaps_busy),aria:`${u(k)} drives ${K.join(" to ")}, ${D($.s)} to ${D($.en)}`})}for(let $ of w.segments)if(!(!$.overlaps_busy||$.start==null||$.end==null))for(let F of w.busy){let C=Math.max($.start,F.start),L=Math.min($.end,F.end);L<=C||x.overlaps.push({key:`${v.date}|overlap|${k}|${C}`,x:m.x+6,y:O(C)-2,w:m.w-12,h:Math.max(8,O(L)-O(C)+4)})}for(let $ of v.events)if($.own===k&&(H.has($.id)||N($,...pe($),!1),$.takes!=null&&$.attending!==!1)){let F=O($.start);x.windows.push({key:`${v.date}|window|${$.id}`,x:m.x+4,y:F,w:m.w-8,h:Math.max(24,O($.end)-F),label:`${$.title} · any time ${D($.start)}–${D($.end)}`})}for(let $ of w.busy){if($.event||$.end<=j||$.start>=A)continue;let F=X(k,$),C=O(F.start),L=O(F.end);x.busy.push({key:`${v.date}|busy|${k}|${F.start}`,x:m.x+1,y:C,w:m.w-2,h:L-C,labelY:8,label:ti(F,!1)})}}let te=-1/0;for(let k=j;k<=A;k+=30)x.grid.push({key:`${v.date}|grid|${k}`,y:O(k),strong:k%60===0}),k%60===0&&O(k)-te>=22&&(x.hours.push({key:`${v.date}|hour|${k}`,y:O(k)-8,label:Fs(k)}),te=O(k));v.date===n.date&&n.minutes>j&&n.minutes<A&&(x.now={y:O(n.minutes),label:`Now ${D(n.minutes)}`}),E=O(A)+Tn;return}let de=[];for(let g of a){let S=c.get(g);for(let j of v.kids[g]?.items??[])if(j.start!=null){if(j.type==="act"){let A=z.get(j.event??"");if(!A)continue;de.push({col:g,s:j.start,h:si(A,S.w),kind:"act",item:j})}else if(!v.rides[j.ride??-1]?.own){let A=v.rides[j.ride??-1],O=A?Ht(I(A.index),b).join(" → "):"";de.push({col:g,s:j.start,h:Wo(O,S.w),kind:"along",item:j})}}}for(let g of d){let S=v.drivers[g];if(!S)continue;for(let A of S.busy)A.event||de.push({col:g,s:A.start,h:32,kind:"busy",busy:X(g,A)});let j=c.get(g).w;for(let A of v.events)A.own!==g||A.attending!==!1&&(A.takes==null||A.planned!=null)||de.push({col:g,s:pe(A)[0],h:si(A,j),kind:"own",event:A});for(let A of S.outings)A.start!=null&&de.push({col:g,s:A.start,h:30+A.lines.length*16+(A.warn?16:0),kind:"out",out:A})}de.sort((g,S)=>g.s-S.s||h.indexOf(g.col)-h.indexOf(S.col));let V=new Map,Q=[],it=ie;de.forEach((g,S)=>{let j=V.get(g.col),A=Math.max(j!=null?j+Qs:ie,it);V.set(g.col,A+g.h),it=A;let O=g.kind==="busy"?g.busy.end:g.kind==="act"?z.get(g.item.event??"")?.end??null:g.kind==="own"?pe(g.event)[1]:null;Q.push({col:g.col,s:g.s,end:O,y:A,h:g.h,box:null}),x.anchors.push({t:U+g.s,y:A});let te=c.get(g.col);if(g.kind==="busy"){let k={key:`${v.date}|busy|${g.col}|${S}`,x:te.x+1,y:A,w:te.w-2,h:g.h,labelY:8,label:ti(g.busy,!0)};x.busy.push(k),Q[Q.length-1].box=k}else if(g.kind==="out"){let k=g.out;x.trips.push({key:`${v.date}|trip|${g.col}|${S}`,x:te.x+8,y:A,w:te.w-16,h:g.h,target:Z(k.target),l1:k.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...k.lines.map(m=>({text:m,warn:!1})),...k.warn?[{text:k.warn,warn:!0}]:[]],kids:k.kids.map(m=>(f.get(m)??J(0)).color),bad:!!k.warn,aria:`${u(g.col)}: ${k.lead}. ${k.lines.join(". ")}${k.warn?`. ${k.warn}`:""}`})}else if(g.kind==="own"){let k=we(g.event,te.x+8,A,te.w-16,g.h,!1,!0,g.col);x.cards.push(k),Q[Q.length-1].box=k}else if(g.kind==="act"){let k=z.get(g.item.event??""),m=we(k,te.x,A,te.w,g.h,g.item.clash,!0,g.col);x.cards.push(m),Q[Q.length-1].box=m}else{let k=v.rides[g.item.ride??-1],m=Ht(I(k.index),b),w=u(k.driver);x.rides.push({key:`${v.date}|ride|${k.index}`,x:te.x,y:A,w:te.w,h:g.h,target:le(k.index),l1:`Along with ${w} ${D(ne(k.start))}`,l2:m.join(" → "),show2:!0,lines2:In,dashed:!0,clash:g.item.clash,aria:`${T(g.col)} riding along with ${w}, ${D(ne(k.start))} to ${D(ne(k.end))}: ${m.join(" to ")}`})}});let Me=ie;for(let g of V.values())Me=Math.max(Me,g);for(let g of Q){if(!g.box||g.end==null)continue;let S=g.y+g.h;for(let j of Q)j.col!==g.col&&j.s>=g.s&&j.s<g.end&&(S=Math.max(S,j.y+j.h));g.end>=1440&&(S=Me);for(let j of Q)j.col===g.col&&j.y>g.y&&(S=Math.min(S,j.y-Qs));S=Math.min(S,Me),S>g.y+g.h&&(g.box.h=S-g.y)}E=Me+Tn+6,x.anchors.push({t:U+1439,y:E})}),x.height=E,x}var Ko=["","¼","½","¾"];function Oe(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return mt(n);let o=Math.round(n*4),i=Math.floor(o/4),r=Ko[o%4];return`${i||!r?i:""}${r} min`})}function ci(s){let t=e=>e?{...e,text:Oe(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(Oe),warn:i.warn==null?i.warn:Oe(i.warn)}))}])),issues:e.issues.map(n=>({...n,title:Oe(n.title),body:Oe(n.body),note:n.note==null?n.note:Oe(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:Oe(o.note)}))}:{}}))}))}}var Vo=2,qo=48;function hi(s,t,e=qo){let n=[],o=0,i=0,r=0,l=0,c=t.minutes+e*60;for(let a of s.days){let d=fe(t.date,a.date),h=d===0?"":`${se(a.date)} · `,f=new Map(a.events.map(u=>[u.id,u])),b=u=>u&&f.has(u)?{day:a.date,event:u}:null,T=(u,x)=>d*1440+(u??f.get(x??"")?.start??0)<c;for(let u of a.issues)if(u.level==="problem"){if(!T(u.at,u.event)){r++,u.kind==="unassigned"&&l++;continue}o++,u.kind==="unassigned"&&i++,n.push({key:`${a.date}|${u.key}`,tone:u.kind==="unassigned"?"unassigned":"problem",title:h+u.title,body:u.body,target:b(u.event),suggestions:(u.suggestions??[]).map(x=>({id:x.id,label:x.label,note:x.note}))})}if(a.clashes.forEach((u,x)=>{if(!T(u.a.start,u.a.event)){r++;return}o++;let E=f.get(u.a.event??""),v=he(s,u.kid),_=(z,Z)=>{let Y=b(Z);return Y?{text:z,target:Y}:z},U=[];if(u.b.type==="act"){let z=f.get(u.b.event??"");E&&z&&(U=[_(E.title,E.id),` ${D(E.start)}–${D(E.end)} and `,_(z.title,z.id),` ${D(z.start)}–${D(z.end)} overlap.`])}else{let z=a.rides[u.b.ride??-1];E&&z&&(U=[`${v} is in `,_(`${ae(s,z.driver)}’s car`,z.serves[0]),` ${D(ne(u.b.start))}–${D(ne(u.b.end))}, during `,_(E.title,E.id),"."])}n.push({key:`${a.date}|clash|${x}`,tone:"problem",title:`${h}${v} is double-booked`,body:U.map(z=>typeof z=="string"?z:z.text).join(""),parts:U,target:null,suggestions:[]})}),d>=0&&d<Vo)for(let u of a.issues)u.level!=="heads_up"||!T(u.at,u.event)||n.push({key:`${a.date}|${u.key}`,tone:"heads_up",title:h+u.title,body:u.body,target:b(u.event),suggestions:[]});for(let u of a.events)!u.problems.length||!T(u.start)||n.push({key:`${a.date}|notes|${u.id}`,tone:"heads_up",title:`${h}Check the notes on ${qt(s,u)}’s ${u.title}`,body:`These lines couldn’t be read: ${u.problems.join("; ")}`,target:b(u.id),suggestions:[]})}return{items:n,problems:o,unassigned:i,later:r,laterUnassigned:l}}function pi(s,t){let e=re(s),n=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=fe(t.date,i.date);if(!(r<0))for(let l of Se(s))for(let c of i.drivers[l]?.outings??[]){if(c.start==null)continue;let a=r*1440+c.start;if(r*1440+ne(c.end,c.start)<=t.minutes)continue;let h=a-t.minutes,f={driver:l,name:ae(s,l),date:i.date,ahead:r,start:c.start,inMinutes:h,ongoing:h<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(b=>e.get(b)??J(0)),warn:c.warn,target:c.target&&i.events.some(b=>b.id===c.target)?{day:i.date,event:c.target}:null};(!n||o(f)<o(n)||o(f)===o(n)&&f.inMinutes<n.inMinutes)&&(n=f)}}return n}function Ze(s){return s.state==="done"||s.state==="late"}var Go=780;function Yo(s,t,e){return s.state==="open"&&!!s.for_day&&s.due===t&&e<Go}function ui(s,t){return s.chores.map(e=>Yo(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function gi(s){return s.state==="open"||s.state==="overdue"}function On(s,t,e){if(Ze(s)){let n=s.done_at?Xo(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${Rn(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${Rn(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let o=fe(t,s.due);return`By ${o===1?"tomorrow":o<7?se(s.due):Bn(s.due)}`}if(s.for_day&&s.due===t)return`Tonight · for ${Rn(s.for_day,t)}`;if(s.due&&s.due>t){let n=fe(t,s.due);return n===1?"By tomorrow":`By ${n<7?se(s.due):Bn(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function Rn(s,t){let e=fe(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?se(s):Bn(s)}function Bn(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Xo(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let i=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return i===t?r:`${se(i)} ${r}`}function fi(s,t,e=1440){let n=ui(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=n.filter(d=>d.kid===o.id),l=new Map;for(let d of r){if(d.state!=="upcoming")continue;let h=d.shows_from??d.due??s.today;l.set(h,[...l.get(h)??[],d])}let c=r.filter(d=>d.state==="overdue"),a=r.filter(d=>d.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??J(i),overdue:c,now:a,done:r.filter(Ze),later:[...l.entries()].sort(([d],[h])=>d.localeCompare(h)).map(([d,h])=>({date:d,chores:h})),left:c.length+a.length}})}function mi(s,t=1440){return ui(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function Nn(s){return!s.chores.length&&!s.templates.length}var Ne=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Un(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,i]=n.split("-").map(r=>Ne.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function Hn(s){let t=[...new Set(s)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${Ne[n[0]]}-${Ne[n.at(-1)]}`]:n.map(o=>Ne[o])).join(", ")}var Ue="none";function Yt(s){return s==="daily"||s==="school"?"":"Any"}function bi(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function vi(s){let t=s.days??Yt(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function Fn(s){return s.title.trim()?s.who.length?s.days===Ue?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function xi(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function Wn(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function Kn(s,t,e=1,n=!1,o=!1){if(s==="school"){let d=t.trim().replace(/-/g,"–"),h=o?d?`${d} Bring lunch days`:"Bring lunch days":d?`${d} school days`:"Every school day";return n?`${h}, the night before`:h}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,l=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(l))return e>1?`Every day, every ${e} weeks`:"Every day";if(!l||l.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${l.replace(/-/g,"–")} ${r}`;let a=`${l.split(",").map(d=>{let h=d.trim();return h.toLowerCase()==="last"?"the last day":/^\d+$/.test(h)?`the ${Wn(Number(h))}`:`the ${h}`}).join(" and ")} ${r}`;return a[0].toUpperCase()+a.slice(1)}function Vn(s,t,e=!1){let n=s.map(i=>t.find(r=>r.id===i)?.name??i);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function qn(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function Xt(s,t){return`${s}|${t}`}function Je(s,t){let[e,n,o]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function Zt(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function yi(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function wi(s,t){return Zt(t)<5&&!yi(s,t)}function vt(s,t,e=new Map){if(!wi(s,t))return null;let n=Xt(s.id,t);if(e.has(n)){let i=e.get(n);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[t];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function Qe(s,t){return wi(s,t)?s.menus?.[t]??null:null}var Zo="From the school's menu feed.";function Jo(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==Zo);return t.length?t.join(`
`):null}function be(s){return s.slice(0,7)}function Jt(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function Gn(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function $i(s){let t=[];for(let e=be(s.first);e<=be(s.last);e=Gn(e))t.push(e);return t}function ki(s,t,e,n=new Map){let o=`${e}-01`,i=Je(o,-Zt(o)),r=[];for(;be(i)<=e;){let l=[];for(let c=0;c<5;c++){let a=Je(i,c),d=be(a)!==e,h=d?null:yi(t,a),f=d?null:vt(t,a,n);l.push({date:a,day:Number(a.slice(8)),outside:d,off:h?h.title:null,lunch:f?.lunch??null,picked:f?.picked??!1,menu:d?null:Qe(t,a)?.dish??null,sides:d?null:Jo(Qe(t,a)?.details??""),past:a<s.today,today:a===s.today})}l.some(c=>!c.outside)&&r.push(l),i=Je(i,7)}return r}function Ei(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function Ci(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function Ti(s,t,e,n=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=Je(t,i),l=vt(s,r,n);if(!l)continue;let c=fe(t,r);return{lunch:l.lunch,when:c===0?"today":c===1?"tomorrow":se(r),date:r,menu:Qe(s,r)?.dish??null}}return null}var Qo={timeline:"timeline",full:"timeline",compact:"compact"};function Yn(s){let t=new URLSearchParams(s),e={},n=Qo[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),e}var _i=De`
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
    height: 36px;
    padding: 0 4px;
    background: var(--bg);
    border-bottom: 1px solid var(--line);
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
`;var uo="mydashlight.rides.mode",Ma=1100,Da=440,La=700,ja=3*6e4,za=1200;function Ia(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var ln=ee`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,lo=ee`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Ra=new URL("emoji.json",import.meta.url).href,co=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],ho=ee`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,po=ee`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Ba=ee`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Oa=ee`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,wt={bring:"Bring",buy:"Buy"};function Na(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function xe(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function fs(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Ua(s,t){return zn(s,t)||ge(s).split(",")[0]}function Ha(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function Fa(){try{return localStorage.getItem(uo)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Wa(s){try{localStorage.setItem(uo,s)}catch{}}function dn(s){return s.days.every(t=>!t.events.length)}var $t=class extends ce{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Yn(location.search).view;this.urlPage=Yn(location.search).page;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,i=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(i)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}n.el.scrollTop=n.top-i,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},ja))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??Fa(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,l]=o.split("|"),c=e.kids.find(a=>a.id===r);(!c||(c.picks[l]??null)===i||!vt(c,l))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&Ze(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(i=>i.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=ci(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Ma)return!1;let e=this.plan;return!e||this.width-Da>=Mn(_e(e).length,Se(e).length)}today(){return ft(this.plan?.time_zone??Ia())}currentBoard(){let e=this.plan;if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;return(this.board==null||e!==this.boardPlan||o!==this.boardKey)&&(this.board=di(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n){let o=this.scroller;if(!o||!this.board)return;let i=this.board.dayHeads.find(r=>r.date===n)?.y??0;o.scrollTop=Math.max(i,oi(this.board,e)-Vt-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),n=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(n*1440+(this.mode==="timeline"&&n===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[n]?.date)}goToDay(e){let n=this.plan;if(!n)return;let o=this.today();if(e===o.date){this.scrollToNow();return}let i=this.dayIndexOf(e),r=n.days[i];if(!r)return;let l=1/0;if(this.mode==="timeline"){for(let c of r.events)l=Math.min(l,c.arrive_by??c.start);for(let c of Object.values(r.drivers))for(let a of c.outings)a.start!=null&&(l=Math.min(l,a.start))}this.scrollToTime(i*1440+(Number.isFinite(l)?Math.max(0,l-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let a of this.board.dayHeads)a.y<=n+1&&(o=a);let i=this.renderRoot,r=i.querySelector(".pinned .label"),l=i.querySelector(".pinned .tag"),c=i.querySelector(".pinned .sub");r&&r.textContent!==o.label&&(r.textContent=o.label),l&&(l.textContent!==o.tag&&(l.textContent=o.tag),l.hidden=!o.tag),c&&c.textContent!==o.sub&&(c.textContent=o.sub),c?.classList.toggle("warn",o.warn);for(let a of i.querySelectorAll(".day-tile"))a.classList.toggle("in-view",a.dataset.date===o.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,o),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let l=new Map(this.choreDraft);l.delete(e.id),this.choreDraft=l;let c=r instanceof G?r:new G("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??Ze(e)}editMenu(e,n){let o=this.lunch?.kids??[],i=Qe(e,n),r=o.filter(l=>l.id===e.id||i&&Qe(l,n)?.dish===i.dish).map(l=>l.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let i=o instanceof G?o:new G("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let i=new Map(this.lunchDraft);for(let r of n)i.set(Xt(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,n,o)}catch(r){let l=new Map(this.lunchDraft);for(let a of n)l.delete(Xt(e,a));this.lunchDraft=l;let c=r instanceof G?r:new G("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?vi(e):bi(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(ao(),ro))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||Fn(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(xi(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof G?n:new G("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof G?n:new G("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller;this.keepAt=n&&this.board?ri(this.board,n.scrollTop+Vt+4):null,this.mode=e,this.urlView||Wa(e)}findEvent(e){let n=this.plan?.days.find(i=>i.date===e.day),o=n?.events.find(i=>i.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(i){let r=i instanceof G?i:new G("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o){if(!this.backend)return;let i=this.backend;this.save(`${n}`,o,()=>i.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e){if(!this.backend)return;let n=this.backend;this.save("stay",!e.stay,()=>n.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,n){if(!this.backend)return;let o=this.backend,i=e.along.includes(n)?e.along.filter(r=>r!==n):[...e.along,n];this.save("along",i,()=>o.setTakeAlong(e.id,i,this.scope))}nudgeArrive(e,n){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,i;n<0?i=(o??e.start)-5:i=o==null||o+5>=e.start?null:o+5,this.arriveDraft=i,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),za)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,l=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,l)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=e?hi(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},i=this.wide,r=this.chores?mi(this.chores,this.today().minutes).filter(h=>!this.choreDone(h)):[],l=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,c=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",a=p`<aside class="panel" aria-label=${c}>
      ${l??(this.sel&&e?this.renderEditor(e):this.renderAttention(o,r))}
    </aside>`,d=this.page==="rides";return p`
      <div class="app ${i?"wide":this.width<La?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,o,r.length)} ${d&&e?this.renderWeek(e):y}
          ${d?this.renderBanner(e):y}
          <main>
            ${d?p`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?dn(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                </section>`:this.page==="lunch"?p`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:p`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!i&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?p`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${a}`:y}
          </main>
        </div>
        ${i?a:y}
        ${this.toast?p`<div class="toast" role="status">${this.toast}</div>`:y}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let i=n.problems+o;this.tick;let r=this.today(),l="";if(e){let f=e.time_zone,b=new Date(e.updated);this.error?l=p`<span class="bad">Can’t reach Home Assistant · showing the plan from ${It(b,new Date,f)}</span>`:e.status&&!e.status.ok?l=p`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${It(b,new Date,f)}</span>`:this.backend?.live||(l=`Updated ${It(b,new Date,f)}`)}let c=(f,b,T,u)=>p`
      <button type="button" class="seg-btn" title=${u} aria-pressed=${this.mode===f?"true":"false"} @click=${()=>this.setMode(f)}>
        ${T}<span class="seg-label">${b}</span>
      </button>
    `,a=(f,b,T)=>p`
      <button type="button" class="seg-btn" aria-pressed=${this.page===f?"true":"false"} @click=${()=>this.setPage(f)}>
        ${T}<span class="seg-label">${b}</span>
      </button>
    `,d=gt(r.minutes),h=!!e&&dn(e);return p`
      <header>
        ${this.showMenu?p`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${ee`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:y}
        <div class="titles">
          <h1 class="clock" aria-label=${`${ge(r.date)}, ${d}`}>
            <span class="hm">${d.slice(0,-3)}</span><span class="ampm">${d.slice(-2)}</span>
          </h1>
          <p class="today-line">${ge(r.date)}</p>
          ${l?p`<p class="status">${l}</p>`:y}
        </div>
        ${e&&!h?this.renderNext(e,pi(e,r),n):y}
        <div class="controls">
          ${this.wide||h&&!o?y:p`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?y:p`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",ee`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",ee`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${a("rides","Rides",ee`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${a("chores","Chores",ee`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?y:a("lunch","Lunch",ee`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let a=this.today().date,d=o.unassigned,h=o.laterUnassigned;if(d){let b=p`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${d} ${d===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?p`<div class="next idle needs">${b}</div>`:p`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${b}</button>`}if(h)return p`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${h} ${h===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let f=e.days.some(b=>b.date>=a&&b.events.length);return p`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${f?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${f?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let i;n.ongoing?i="On the road now":n.ahead===0?i=n.inMinutes<180?`Next trip · in ${mt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${se(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,l=p`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${xe(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(a=>p`<span class="kid-dot" style="background:${a.color}"></span>`)}</span>
      </span>
      ${n.warn?p`<span class="next-stop warn">${n.warn}</span>`:n.stop?p`<span class="next-stop">${n.stop}</span>`:y}
    `,c=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?p`<button type="button" class=${c} @click=${()=>this.open(n.target)}>${l}</button>`:p`<div class=${c}>${l}</div>`}renderWeek(e){let n=this.today().date,o=re(e);return p`<nav class="week" aria-label="Days">
      ${e.days.map(i=>{let r=jn(i),l=i.events.length,c=i.events.slice(0,6).map(d=>d.own?Gt.color:o.get(d.kid)?.color??J(0).color),a=`${ge(i.date)}: ${l?`${l} ${l===1?"activity":"activities"}`:"nothing planned"}${r?`, ${r} to sort out`:""}`;return p`<button
          type="button"
          class="day-tile ${i.date===n?"today":""}"
          data-date=${i.date}
          aria-label=${a}
          @click=${()=>this.goToDay(i.date)}
        >
          <span class="dt-wd">${i.date===n?"Today":se(i.date)}</span>
          <span class="dt-num">${Number(i.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${c.length?c.map(d=>p`<span class="dt-dot" style="background:${d}"></span>`):p`<span class="dt-free">free</span>`}
            ${l>6?p`<span class="dt-more">+${l-6}</span>`:y}
          </span>
          ${r?p`<span class="dt-badge" aria-hidden="true">${r}</span>`:y}
        </button>`})}
    </nav>`}renderQuiet(e){let n=_e(e),o=Se(e),i=re(e),r=n.map(l=>he(e,l));return p`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((l,c)=>ee`<circle cx=${50+c*30} cy="80" r="11" fill=${i.get(l).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Ha(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(l=>{let c=i.get(l);return p`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${xe(he(e,l))}</span>
            <span class="qw-name">${he(e,l)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(l=>p`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${xe(ae(e,l))}</span>
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
    </div>`}renderBanner(e){let n=e?.unavailable_calendars.length??0;return n?p`<div class="banner" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:y}renderEmpty(){return this.error?p`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:p`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let n=this.sel,o=a=>!!a&&!!n&&a.day===n.day&&a.event===n.event,i=e.dayHeads[0],r=e.width,l=100,c=[...e.links.map(a=>({t:"link",x:a,z:a.layer??0})),...e.preps.map(a=>({t:"prep",x:a,z:a.layer??l-1})),...e.cards.map(a=>({t:"card",x:a,z:a.layer??l})),...e.rides.map(a=>({t:"ride",x:a,z:a.layer??l+1}))].sort((a,d)=>a.z-d.z);return p`
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
          ${e.columns.map(a=>p`<div class="col-head ${a.kind}" style="left:${a.x}px;width:${a.w}px;--c:${a.dot};--rgb:${a.rgb}">
              <span class="avatar ${a.kind}" aria-hidden="true">${xe(a.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${a.name}</span>${a.kind==="kid"?this.renderLunchChip(a.id,!0):y}</span>
                <span class="sub ${a.subWarn?"warn":""}">${a.sub}</span>
              </span>
            </div>`)}
        </div>
        <div class="pinned" aria-hidden="true" style="width:${r}px">
          <span class="label">${i?.label??""}</span><span class="tag" ?hidden=${!i?.tag}>${i?.tag??""}</span
          ><span class="sub ${i?.warn?"warn":""}">${i?.sub??""}</span>
        </div>
        <div class="canvas" style="width:${r}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(a=>p`<div
                class="col-bg ${a.kind}"
                style="left:${a.x}px;width:${a.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${a.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(a=>p`<div class="day-head" style="top:${a.y}px;width:${r}px">
              <span class="label">${a.label}</span>${a.tag?p`<span class="tag">${a.tag}</span>`:y}<span
                class="sub ${a.warn?"warn":""}"
                >${a.sub}</span
              >
            </div>`)}
          ${e.empties.map(a=>p`<span class="empty" style="top:${a.y}px">${a.text}</span>`)}
          ${e.grid.map(a=>p`<div class="grid ${a.strong?"strong":""}" style="top:${a.y}px;width:${r-60}px"></div>`)}
          ${e.hours.map(a=>p`<span class="hour" style="top:${a.y}px">${a.label}</span>`)}
          ${Te(e.bands,a=>a.key,a=>p`<div
                class="band"
                aria-hidden="true"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;background:rgba(${a.color.rgb},0.10);border-color:rgba(${a.color.rgb},0.45)"
              ></div>`)}
          ${Te(e.busy,a=>a.key,a=>p`<div class="busy" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span style="top:${a.labelY}px">${a.label}</span>
              </div>`)}
          ${Te(e.windows,a=>a.key,a=>p`<div class="window" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span>${a.label}</span>
              </div>`)}
          ${Te(c,a=>a.x.key,a=>{if(a.t==="link"){let b=a.x;return p`<div
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
                  <span class="l1">${b.l1}</span>${b.show2?p`<span class="l2" style="-webkit-line-clamp:${b.lines2}">${b.l2}</span>`:y}
                </button>`}let d=a.x,h=d.color,f=d.skipped?`repeating-linear-gradient(135deg, rgba(${h.rgb},0.10) 0px, rgba(${h.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:d.stayed?`repeating-linear-gradient(135deg, rgba(${h.rgb},0.24) 0px, rgba(${h.rgb},0.24) 6px, rgba(${h.rgb},0.08) 6px, rgba(${h.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${h.rgb},0.15), rgba(${h.rgb},0.15)), var(--surface)`;return p`<button
                type="button"
                class="card ${d.wrap?"wrap":""} ${o(d.target)?"sel":""} ${d.clash?"clash":""} ${d.skipped?"skipped":""}"
                aria-label=${d.aria}
                style="left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;background:${f};border-color:${d.clash?"var(--bad)":`rgba(${h.rgb},0.45)`};--c:${h.color};--rgb:${h.rgb};--ring:${h.color}"
                @click=${()=>this.open(d.target)}
              >
                <span class="top">
                  <span class="title">${d.title}</span>
                  <span class="time">${d.time}</span>
                  ${d.showDrop&&d.drop?p`<span class="line tone-${d.drop.tone}">${d.drop.text}</span>`:y}
                </span>
                ${d.showPick&&d.pick?p`<span class="line tone-${d.pick.tone}">${d.pick.text}</span>`:y}
              </button>`})}
          ${Te(e.stays,a=>a.key,a=>p`<button
                type="button"
                class="stay"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;border-color:${a.color.color};background:repeating-linear-gradient(135deg, rgba(${a.color.rgb},0.28) 0px, rgba(${a.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1" style="color:${a.color.ink}">${a.l1}</span><span class="l2">${a.l2}</span>
              </button>`)}
          ${Te(e.trips,a=>a.key,a=>p`<button
                type="button"
                class="trip ${a.bad?"bad":""} ${a.stops?"list":""}"
                aria-label=${a.aria}
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1">${a.l1}${a.kids.map(d=>p`<span class="kid-dot" style="background:${d}"></span>`)}</span>
                ${a.show2?p`<span class="l2">${a.l2}</span>`:y}
                ${a.stops?a.stops.map(d=>p`<span class="stop ${d.warn?"warn":""}">${d.text}</span>`):y}
                ${a.show3?p`<span class="l3">${a.l3}</span>`:y}
              </button>`)}
          ${Te(e.overlaps,a=>a.key,a=>p`<div class="overlap" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"></div>`)}
          ${Te(e.marks,a=>a.key,a=>p`<span class="mark" style="left:${a.x}px;top:${a.y}px;${a.right?"transform:translateX(-100%)":""}">${a.text}</span>`)}
          ${e.now?p`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${r-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:y}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:i,later:r}=e,l=this.plan,c=i+n.length,a=this.chores,d=!!a&&!Nn(a);return p`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?y:p`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${d?p`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?p`<div class="attn-chores">${n.map(h=>this.renderChoreRow(h,!0))}</div>`:p`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:p`<p class="panel-sub">Rides in the next two days</p>`}
      ${l&&!i?p`<div class="all-clear">
            <span class="check" aria-hidden="true">${ee`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${dn(l)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:y}
      ${o.map(h=>p`<div class="issue ${h.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${h.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${h.target?p`<button type="button" class="issue-title" @click=${()=>this.open(h.target,!0)}>${h.title}</button>`:p`<strong class="issue-title">${h.title}</strong>`}
              <span class="issue-body"
                >${h.parts?h.parts.map(f=>typeof f=="string"?f:p`<button type="button" class="issue-link" @click=${()=>this.open(f.target,!0)}>${f.text}</button>`):h.body}</span
              >
            </div>
          </div>
          ${h.suggestions.length?p`<div class="fixes">
                ${h.suggestions.map(f=>p`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(f.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${f.id}`?"Saving…":f.label}</span>
                    <span class="fix-note">${f.note}</span>
                  </button>`)}
              </div>`:y}
        </div>`)}
      ${this.wide&&l&&!dn(l)&&this.page==="rides"?this.renderLegend():y}
    `}kidColorOf(e){let n=this.plan?re(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return J(Math.max(0,o))}renderLunchChip(e,n=!1){let o=this.lunch,i=o?.kids.find(a=>a.id===e);if(!o||!i)return y;this.tick;let r=this.today(),l=Ti(i,r.date,r.minutes,this.lunchDraft);if(!l)return y;let c=wt[l.lunch];return p`<span class="lunch-chip ${l.lunch} ${n?"small":""}" title=${`${c} lunch ${l.when}${l.menu?`: ${l.menu}`:""}`}
      >${l.lunch==="bring"?ho:po}<span class="lunch-chip-text"
        >${c}${n?y:` ${l.when}`}${!n&&l.menu?p`<span class="lunch-chip-menu"> · ${l.menu}</span>`:y}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return p`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=$i(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:be(e.today),i=n.indexOf(o),r=d=>{let h=n[i+d];h&&(this.lunchMonth=h)},l=e.kids.some(d=>d.id===this.lunchKid)?this.lunchKid:null,c=l?e.kids.filter(d=>d.id===l):e.kids,a=e.status&&!e.status.ok?p`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:y;return p`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${ee`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${Jt(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${i<0||i>=n.length-1} @click=${()=>r(1)}>
            ${ee`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":p`${lo} Edit menus`}
        </button>
      </div>
      ${a}
      <div class="chore-cols lunch-cols ${l?"wide":""}" style="--n:${c.length}">
        ${c.map(d=>this.renderLunchCard(e,d,o,l!==null))}
      </div>
      <p class="message-aside">
        Picks are saved as <strong>Bring Lunch</strong> and <strong>Buy Lunch</strong> all-day events on each kid’s calendar.
        Menus are <strong>Lunch: Pizza</strong> all-day events there, with the rest of the menu in the notes. They can
        come from the school’s menu feed (set in Home Assistant under MyDashLight’s options, Lunch), a calendar file
        imported once a month, or <strong>Edit menus</strong> here.
        Days off come from <strong>No School</strong> events there. A day nobody picked gets the kid’s default, set in
        Home Assistant under MyDashLight’s options. For a Pack lunch reminder, add a School days chore set to
        <strong>Only on Bring lunch days</strong>.
      </p>
    </div>`}renderLunchCard(e,n,o,i){let r=this.kidColorOf(n.id),l=ki(e,n,o,this.lunchDraft),c=Ci(l),a=l.flat(),d=a.filter(u=>!u.outside&&!u.past&&u.lunch),h=n.days_off.filter(u=>be(u.first)<=o&&o<=be(u.last)),f=u=>d.filter(x=>Zt(x.date)===u),b=u=>{let x=f(u);if(!x.length)return;let E=x.every(v=>v.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,x.map(v=>v.date),E)},T=d.length?`${c.bring} Bring · ${c.buy} Buy${o===be(e.today)?" left this month":""}`:"No school days left this month";return p`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${xe(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${T}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${wt[n.default]} unless picked</span>
          ${e.kids.length<2?y:p`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:n.id}
              >
                ${i?Oa:Ba}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?p`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:y}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${Jt(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((u,x)=>p`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!f(x).length}
            aria-label=${`${f(x).every(E=>E.lunch==="bring")?"Buy":"Bring"} every ${u} left in ${Jt(o)} for ${n.name}`}
            @click=${()=>b(x)}
          >
            ${u}
          </button>`)}
        ${a.map(u=>this.renderLunchCell(n,u,i))}
      </div>
      ${h.length?p`<p class="lunch-offs">
            No school:
            ${h.map(u=>{let x=u.first<`${o}-01`?`${o}-01`:u.first,E=be(u.last)>o?Je(`${Gn(o)}-01`,-1):u.last;return`${x===E?fs(x):`${fs(x)}–${fs(E)}`} ${Ei(u.title)}`}).join(" · ")}
          </p>`:y}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return p`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return p`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=n.lunch,r=i==="buy"?"bring":"buy",l=n.menu?`, ${n.menu}`:"",c=this.menuMode,a=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),d=c?`${e.name}, ${ge(n.date)}${l||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${ge(n.date)}: ${wt[i]}${n.picked?"":" (not picked yet)"}${l}. Tap to ${wt[r]}.`;return p`<button
      type="button"
      class="lunch-day ${i} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${c?"editing":""} ${a?"sel":""}"
      ?disabled=${n.past&&!c}
      aria-label=${d}
      @click=${()=>c?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${i==="bring"?ho:po}${wt[i]}</span>
      ${n.menu?p`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?p`<span class="lunch-sides">${n.sides}</span>`:y}`:c?p`<span class="lunch-menu add">${ln} Menu</span>`:y}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex(E=>E.id===e.kid),l=(this.plan?re(this.plan).get(e.kid):void 0)??J(Math.max(0,r)),c=o.kids[r]?.name??"",a=i===Ze(e)?e:{...e,state:i?"done":"open",done_at:i?new Date().toISOString():null},d=i&&a.done_by&&a.done_by!==e.kid?o.people?.find(E=>E.id===a.done_by)?.name??a.done_by_name??null:null,h=`${On(a,o.today,o.time_zone)}${d?` · by ${d}`:""}`,f=i||gi(e),b=`${n?`${c}: `:""}${e.title}. ${h?`${h}. `:""}${i?"Done. Tap to undo.":"Tap when it’s done."}`,T=p`<span class="box" aria-hidden="true"
        >${i?ee`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:y}</span
      >
      ${e.icon?p`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:y}
      <span class="chore-text">
        <span class="chore-title">${n?p`<span class="chore-kid">${c}</span> · `:y}${e.title}</span>
        ${h?p`<span class="chore-note">${h}</span>`:y}
      </span>`,u=`chore ${i?"done":""} ${e.state==="overdue"&&!i?"overdue":""} ${f?"":"later"}`,x=`--c:${l.color};--rgb:${l.rgb};--k:${l.ink}`;return f?p`<button type="button" class=${u} style=${x} aria-pressed=${i?"true":"false"} aria-label=${b} @click=${()=>this.tapChore(e)}>
          ${T}
        </button>`:p`<div class=${u} style=${x}>${T}</div>`}renderChores(){let e=this.chores;if(e===void 0)return p`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return p`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return p`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(Nn(e))return p`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${ln} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?p`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:y;this.tick;let i=fi(e,this.plan?re(this.plan):void 0,this.today().minutes);return p`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${ln} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${lo} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${i.length}">
        ${i.map(r=>{let l=r.overdue.filter(c=>!this.choreDone(c)).length+r.now.filter(c=>!this.choreDone(c)).length;return p`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${xe(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${l?`${l} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?p`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(c=>this.renderChoreRow(c))}`:y}
            ${r.now.length?p`<h3 class="chore-group">To do</h3>
                  ${r.now.map(c=>this.renderChoreRow(c))}`:y}
            ${r.done.length?p`<h3 class="chore-group">Done</h3>
                  ${r.done.map(c=>this.renderChoreRow(c))}`:y}
            ${r.later.map(c=>p`<h3 class="chore-group">${c.date===e.today?"Later today":Ua(c.date,e.today)}</h3>
                ${c.chores.map(a=>this.renderChoreRow(a))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?p`<p class="chore-none">No chores this week.</p>`:y}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,i=this.plan?re(this.plan):void 0,r=this.choreEdit?.template===e.id,l=e.problems.length?p`<span class="tmpl-note bad">${e.problems.map(qn).join(" · ")} · tap to set up</span>`:p`<span class="tmpl-note">${Vn(e.who,o,e.take_turns)} · ${Kn(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return p`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?p` <span class="tag-paused">Paused</span>`:y}</span>
        ${l}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let a=o.findIndex(h=>h.id===c),d=i?.get(c)??J(Math.max(0,a));return p`<span class="kid-dot" style="background:${d.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return p`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${ln} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([o,i])=>{let r=e.templates.filter(l=>l.repeats===o);return r.length?p`<section class="manage-group" aria-label=${i}>
                  <h3 class="chore-group">${i}</h3>
                  <div class="tmpl-list">${r.map(l=>this.renderTemplateRow(l))}</div>
                </section>`:y}):p`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return p``;let o=n.kids,i=this.plan?re(this.plan):void 0,r=this.choreBusy,l=e.template?n.templates.find(u=>u.id===e.template):void 0,c=Fn(e),a=(l?.problems??[]).filter(u=>u!=="who:"),d=(u,x,E,v=!1)=>p`<button type="button" class="choice ${v?"wide":""}" aria-pressed=${u?"true":"false"} ?disabled=${r} @click=${E}>${x}</button>`,h=(u,x,E,v)=>p`<button type="button" class="chip" aria-pressed=${u?"true":"false"} aria-label=${v??y} ?disabled=${r} @click=${E}>${x}</button>`,f=u=>{u!==e.repeats&&this.changeDraft({repeats:u,days:l&&l.repeats===u?l.days??Yt(u):Yt(u)})},b=u=>{let x=e.who.includes(u)?e.who.filter(E=>E!==u):o.filter(E=>E.id===u||e.who.includes(E.id)).map(E=>E.id);this.changeDraft({who:x})},T;if(e.repeats==="school"){let u=e.days===Ue?new Set:e.days===""?new Set([0,1,2,3,4]):Un(e.days)??new Set,x=E=>{let v=new Set(u);v.has(E)?v.delete(E):v.add(E),this.changeDraft({days:v.size===5?"":v.size?Hn(v):Ue})};T=p`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${Ne.slice(0,5).map((E,v)=>h(u.has(v),E.slice(0,2),()=>x(v),E))}
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
        </div>`}else if(e.repeats==="monthly"){let u=e.days.trim(),x=/^\d+$/.test(u)?Number(u):null,E=u&&u.toLowerCase()!=="any"&&u.toLowerCase()!=="last"&&x===null;T=p`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${E?4:3}, minmax(0, 1fr))">
          ${d(u===""||u.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${d(x!==null,"On a date",()=>this.changeDraft({days:String(x??1)}))}
          ${d(u.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${E?d(!0,u,()=>{}):y}
        </div>
        ${x!==null?p`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||x<=1} @click=${()=>this.changeDraft({days:String(x-1)})}>−</button>
                <span class="arrive-value">${Wn(x)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||x>=31} @click=${()=>this.changeDraft({days:String(x+1)})}>+</button>
              </span>
            </div>`:p`<p class="field-hint">${u.toLowerCase()==="last"?"Due on the month’s last day.":E?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")T=p`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let u=e.days===""||e.days.toLowerCase()==="any",x=e.days===Ue?new Set:u?new Set:Un(e.days)??new Set,E=v=>{let _=new Set(x);_.has(v)?_.delete(v):_.add(v),this.changeDraft({days:_.size?Hn(_)||"Mon-Sun":Ue})};T=p`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${d(u,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${d(!u,"On set days",()=>this.changeDraft({days:u?"Sat":e.days}))}
        </div>
        ${u?p`<p class="field-hint">Shows all week, due on Sunday.</p>`:p`<div role="group" aria-label="Days of the week" class="day-chips">
                ${Ne.map((v,_)=>h(x.has(_),v.slice(0,2),()=>E(_),v))}
              </div>
              <div class="chips">
                ${h(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${h(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:y}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?Vn(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===Ue?"No days picked":Kn(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${a.length?p`<p class="field-hint bad">${a.map(qn).join(". ")}. Saving fixes it.</p>`:y}
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
          @input=${u=>this.changeDraft({title:u.target.value})}
        />
        <div role="group" aria-label="Picture" class="icon-chips">
          ${co.map(u=>h(e.icon===u,u,()=>this.changeDraft({icon:e.icon===u?null:u}),`Picture ${u}`))}
          ${e.icon&&!co.includes(e.icon)?h(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):y}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?p`<emoji-picker
              class="emoji-more"
              .dataSource=${Ra}
              @emoji-click=${u=>{let x=u.detail.unicode;x&&this.changeDraft({icon:x}),this.iconMore=!1}}
            ></emoji-picker>`:y}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((u,x)=>{let E=i?.get(u.id)??J(x),v=e.who.includes(u.id);return p`<button type="button" class="who-chip" style="--c:${E.color};--rgb:${E.rgb}" aria-pressed=${v?"true":"false"} ?disabled=${r} @click=${()=>b(u.id)}>
              <span class="avatar" aria-hidden="true">${xe(u.name)}</span>${u.name}
            </button>`})}
        </div>
        ${e.who.length>1?p`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${d(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${d(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:y}
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
      ${T}
      ${e.repeats==="school"?y:p`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${Na(e.repeats,e.every)}</span>
      </div>`}
      <div class="field">
        <label class="field-label" for="chore-details">Notes <span class="field-hint">Optional, shown with the chore</span></label>
        <textarea
          id="chore-details"
          class="text-input"
          rows="2"
          .value=${e.details}
          ?disabled=${r}
          @input=${u=>this.changeDraft({details:u.target.value})}
        ></textarea>
      </div>
      ${e.template?p`<div class="field">
              ${d(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${r} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:y}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!c} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":c?c.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return p``;let o=e.busy,i=d=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...d})},r=d=>i({kids:e.kids.includes(d)?e.kids.filter(h=>h!==d):[...e.kids,d]}),l=n.kids.filter(d=>vt(d,e.date)),c=e.dish.trim(),a=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${ge(e.date)}</span>
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
          ${l.map(d=>{let h=this.kidColorOf(d.id),f=e.kids.includes(d.id);return p`<button type="button" class="who-chip" style="--c:${h.color};--rgb:${h.rgb}" aria-pressed=${f?"true":"false"} ?disabled=${o} @click=${()=>r(d.id)}>
              <span class="avatar" aria-hidden="true">${xe(d.name)}</span>${d.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${c||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?p`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:y}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!a} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":a??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return p``;let o=n.people?.length?n.people:n.kids.map(h=>({...h,role:"kid"})),i=n.kids.findIndex(h=>h.id===e.kid),r=n.kids[i],l=this.plan?re(this.plan):void 0,c=l?.get(e.kid)??J(Math.max(0,i)),a=o.filter(h=>h.id!==e.kid),d=h=>{let f=n.kids.findIndex(b=>b.id===h.id);return f>=0?(l?.get(h.id)??J(f)).color:"var(--dark)"};return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:y}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${On(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${c.color};--rgb:${c.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${xe(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?p`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${a.map(h=>p`<button type="button" class="done-by" style="--c:${d(h)}" @click=${()=>void this.toggleChore(e,h.id)}>
                  <span class="avatar ${h.role==="parent"?"driver":""}" aria-hidden="true">${xe(h.name)}</span>
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
    </div>`}ownHint(e,n){let o=qt(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${D(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${D(n.start)} to ${D(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=n.along.map(r=>Se(e).includes(r)?ae(e,r):he(e,r));return`${o} drives there and back${i.length?`, with ${Ln(i)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return p``;let{day:o,event:i}=n,r=Se(e),l=ii(e,i),c=qt(e,i),a=!!this.pending,d=I=>this.pending?.key===I?this.pending.value:void 0,h=[...e.people?.carpools??[]];for(let I of e.days)for(let le of I.events)for(let X of[le.drop,le.pick])X&&X!=="none"&&!r.includes(X)&&!h.some(pe=>pe.toLowerCase()===X.toLowerCase())&&h.push(X);let f=I=>{if(!i.sides.includes(I))return y;let le=d(I),X=le!==void 0?String(le):I==="drop"?i.drop:i.pick,pe=X&&X!=="none"&&!r.includes(X)?X:"",$e=V=>this.setRide(i,I,X===V?"":V),de=[...r.map(V=>[V,Dn(e,V)]),["none","Not needed"]];return p`<div class="field">
        <span class="field-label">${I==="drop"?"Drop-off":"Pick-up"} ${X===""?p`<span class="nobody">· nobody yet</span>`:y}</span>
        <div role="group" aria-label=${I==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${de.length}, minmax(0, 1fr))">
          ${de.map(([V,Q])=>p`<button type="button" class="choice" aria-pressed=${X===V?"true":"false"} ?disabled=${a} @click=${()=>$e(V)}>
                ${Q}
              </button>`)}
        </div>
        ${h.length?p`<div role="group" aria-label=${I==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${h.map(V=>p`<button type="button" class="chip" aria-pressed=${X.toLowerCase()===V.toLowerCase()?"true":"false"} ?disabled=${a} @click=${()=>$e(V)}>
                    ${V}
                  </button>`)}
            </div>`:y}
        <input
          type="text"
          .value=${pe&&!h.some(V=>V.toLowerCase()===pe.toLowerCase())?pe:""}
          ?disabled=${a}
          aria-label=${I==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${V=>{let Q=V.target.value.trim();Q&&Q!==X&&this.setRide(i,I,Q)}}
          @keydown=${V=>{V.key==="Enter"&&V.target.blur()}}
        />
      </div>`},b=d("stay"),T=b!==void 0?!!b:i.stay,u=i.drop===i.pick&&r.includes(i.drop),x=d("along"),E=x!==void 0?x:i.along,v=i.own?[..._e(e),...r.filter(I=>I!==i.own)]:_e(e).filter(I=>I!==i.kid),_=i.own!=null&&i.takes!=null,U=r.includes(i.drop)&&i.sides.includes("drop")&&!_,z=d("arrive"),Z=this.arriveDraft!==void 0?this.arriveDraft:z!==void 0?z:i.arrive_by,Y=[],ye=I=>I==="none"?"Not needed":Dn(e,I);!i.own&&i.drop!==""&&Y.push(`Drop-off: ${ye(i.drop)}`),!i.own&&i.pick!==""&&Y.push(`Pick-up: ${ye(i.pick)}`),!i.own&&i.stay&&Y.push("Stay: yes"),_&&Y.push(`Takes: ${i.takes} min`),i.along.length&&Y.push(`Take along: ${i.along.map(I=>r.includes(I)?ae(e,I):he(e,I)).join(", ")}`),i.arrive_by!=null&&Y.push(`Arrive by: ${gt(i.arrive_by)}`);let Ve=d("attending"),ie=Ve!==void 0?!!Ve:i.attending!==!1;i.attending===!1&&Y.splice(0,Y.length,"Attending: no");let qe=o.date===this.today().date?"":`${se(o.date)} · `,we=p`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${c} · ${i.title}</span>
          <span class="ed-meta">${qe}${_?"any time ":""}${D(i.start)}–${D(i.end)}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return i.where==="home"?p`${we}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:p`
      ${we}
      ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:y}
      ${i.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${se(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:y}
      <div class="field">
        <span class="field-label">${c} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${ie?"true":"false"} ?disabled=${a} @click=${()=>this.setAttending(i,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${ie?"false":"true"} ?disabled=${a} @click=${()=>this.setAttending(i,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${ie?p`${i.where==="anywhere"?p`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:y}
            ${i.own?p`<p class="field-hint">${this.ownHint(e,i)}</p>`:p`${f("drop")} ${f("pick")}
                  <div class="field">
                    <button type="button" class="choice wide" aria-pressed=${T?"true":"false"} ?disabled=${!u||a} @click=${()=>this.toggleStay(i)}>
                      ${u?T?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
                    </button>
                  </div>`}
      ${U&&v.length?p`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label=${i.own?"Who goes along":"Kids taken along"} class="chips">
              ${v.map(I=>p`<button type="button" class="chip" aria-pressed=${E.includes(I)?"true":"false"} ?disabled=${a} @click=${()=>this.toggleAlong(i,I)}>
                  ${r.includes(I)?ae(e,I):he(e,I)}
                </button>`)}
            </div>
          </div>`:y}
      ${_?y:p`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${Z!=null?`${i.start-Z} min before it starts`:`Aims for a few minutes before ${D(i.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${a} @click=${()=>this.nudgeArrive(i,-5)}>−</button>
          <span class="arrive-value">${Z!=null?D(Z):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${a||Z==null} @click=${()=>this.nudgeArrive(i,5)}>+</button>
        </span>
      </div>
      ${Z!=null?p`<button type="button" class="chip clear" ?disabled=${a} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:y}`}
`:p`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${Y.length?Y.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${i.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:y}
      ${ie&&!i.own?p`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:y}
    `}};$t.styles=_i,$t.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",$t);var kt=class extends ce{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=Hs(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(pt);let n=e.toString();history.replaceState(history.state,"",`${location.pathname}${n?`?${n}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new Rt(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return p`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?p`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:y}`}};kt.styles=De`
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
  `,kt.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0},pairing:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",kt);
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
