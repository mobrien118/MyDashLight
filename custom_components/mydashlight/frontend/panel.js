var Fo=Object.defineProperty;var Pn=(i,t)=>()=>(i&&(t=i(i=0)),t);var Wo=(i,t)=>{for(var e in t)Fo(i,e,{get:t[e],enumerable:!0})};function bn(i){if(typeof i!="string"||!i)throw new Error("expected a non-empty string, got: "+i)}function ui(i){if(typeof i!="number")throw new Error("expected a number, got: "+i)}function Vr(i,t){let e=new Set,n=[];for(let o of i){let s=t(o);e.has(s)||(e.add(s),n.push(o))}return n}function so(i){return Vr(i,t=>t.unicode)}function Gr(i){function t(e,n,o){let s=n?i.createObjectStore(e,{keyPath:n}):i.createObjectStore(e);if(o)for(let[r,[l,d]]of Object.entries(o))s.createIndex(r,l,{multiEntry:d});return s}t(gt),t(Ze,Nr,{[ro]:[Br,!0],[lo]:[[Hr,Ur]],[co]:[Fr,!0]}),t(bi,void 0,{[ao]:[""]})}function ho(i,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>i(e.result)}async function qr(i){let t=await new Promise((e,n)=>{let o=indexedDB.open(i,zr);gi[i]=o,o.onupgradeneeded=s=>{s.oldVersion<Or&&Gr(o.result)},ho(e,n,o)});return t.onclose=()=>yi(i),t}function Yr(i){return yn[i]||(yn[i]=qr(i)),yn[i]}function Le(i,t,e,n){return new Promise((o,s)=>{let r=i.transaction(t,e,{durability:"relaxed"}),l=typeof t=="string"?r.objectStore(t):t.map(h=>r.objectStore(h)),d;n(l,r,h=>{d=h}),r.oncomplete=()=>o(d),r.onerror=()=>s(r.error)})}function yi(i){let t=gi[i],e=t&&t.result;if(e){e.close();let n=wn[i];if(n)for(let o of n)o()}delete gi[i],delete yn[i],delete wn[i]}function Xr(i){return new Promise((t,e)=>{yi(i);let n=indexedDB.deleteDatabase(i);ho(t,e,n)})}function Zr(i,t){let e=wn[i];e||(e=wn[i]=[]),e.push(t)}function ft(i){return i.split(/[\s_]+/).map(t=>!t.match(/\w/)||Jr.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function po(i){return i.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=Qr)}function ea(i){return i.map(({annotation:e,emoticon:n,group:o,order:s,shortcodes:r,skins:l,tags:d,emoji:h,version:c})=>{let a=[...new Set(po([...(r||[]).map(ft).flat(),...(d||[]).map(ft).flat(),...ft(e),n]))].sort(),f={annotation:e,group:o,order:s,tags:d,tokens:a,unicode:h,version:c};if(n&&(f.emoticon=n),r&&(f.shortcodes=r),l){f.skinTones=[],f.skinUnicodes=[],f.skinVersions=[];for(let{tone:y,emoji:T,version:m}of l)f.skinTones.push(y),f.skinUnicodes.push(T),f.skinVersions.push(m)}return f})}function uo(i,t,e,n){i[t](e).onsuccess=o=>n&&n(o.target.result)}function Xe(i,t,e){uo(i,"get",t,e)}function fo(i,t,e){uo(i,"getAll",t,e)}function xi(i){i.commit&&i.commit()}function ta(i,t){let e=i[0];for(let n=1;n<i.length;n++){let o=i[n];t(e)>t(o)&&(e=o)}return e}function go(i,t){let e=ta(i,o=>o.length),n=[];for(let o of e)i.some(s=>s.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function na(i){return!await wi(i,gt,xn)}async function ia(i,t,e){let[n,o]=await Promise.all([fi,xn].map(s=>wi(i,gt,s)));return n===e&&o===t}async function sa(i,t){return Le(i,Ze,bt,(n,o,s)=>{let r,l=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=d=>{let h=d.target.result;for(let c of h)if(r=c.unicode,t(c))return s(c);if(h.length<50)return s();l()}};l()})}async function mo(i,t,e,n){try{let o=ea(t);await Le(i,[Ze,gt],vi,([s,r],l)=>{let d,h,c=0;function a(){++c===2&&f()}function f(){if(!(d===n&&h===e)){s.clear();for(let y of o)s.put(y);r.put(n,fi),r.put(e,xn),xi(l)}}Xe(r,fi,y=>{d=y,a()}),Xe(r,xn,y=>{h=y,a()})})}finally{}}async function oa(i,t){return Le(i,Ze,bt,(e,n,o)=>{let s=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);fo(e.index(lo),s,o)})}async function bo(i,t){let e=po(ft(t));return e.length?Le(i,Ze,bt,(n,o,s)=>{let r=[],l=()=>{r.length===e.length&&d()},d=()=>{let h=go(r,c=>c.unicode);s(h.sort((c,a)=>c.order<a.order?-1:1))};for(let h=0;h<e.length;h++){let c=e[h],a=h===e.length-1?IDBKeyRange.bound(c,c+"￿",!1,!0):IDBKeyRange.only(c);fo(n.index(ro),a,f=>{r.push(f),l()})}}):[]}async function ra(i,t){let e=await bo(i,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(s=>s.toLowerCase()).includes(t.toLowerCase()))[0]||null:await sa(i,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function aa(i,t){return Le(i,Ze,bt,(e,n,o)=>Xe(e,t,s=>{if(s)return o(s);Xe(e.index(co),t,r=>o(r||null))}))}function wi(i,t,e){return Le(i,t,bt,(n,o,s)=>Xe(n,e,s))}function la(i,t,e,n){return Le(i,t,vi,(o,s)=>{o.put(n,e),xi(s)})}function da(i,t){return Le(i,bi,vi,(e,n)=>Xe(e,t,o=>{e.put((o||0)+1,t),xi(n)}))}function ca(i,t,e){return e===0?[]:Le(i,[bi,Ze],bt,([n,o],s,r)=>{let l=[];n.index(ao).openCursor(void 0,"prev").onsuccess=d=>{let h=d.target.result;if(!h)return r(l);function c(y){if(l.push(y),l.length===e)return r(l);h.continue()}let a=h.primaryKey,f=t.byName(a);if(f)return c(f);Xe(o,a,y=>{if(y)return c(y);h.continue()})}})}function ha(i,t){let e=new Map;for(let o of i){let s=t(o);for(let r of s){let l=e;for(let h=0;h<r.length;h++){let c=r.charAt(h),a=l.get(c);a||(a=new Map,l.set(c,a)),l=a}let d=l.get(vn);d||(d=[],l.set(vn,d)),d.push(o)}}return(o,s)=>{let r=e;for(let h=0;h<o.length;h++){let c=o.charAt(h),a=r.get(c);if(a)r=a;else return[]}if(s)return r.get(vn)||[];let l=[],d=[r];for(;d.length;){let c=[...d.shift().entries()].sort((a,f)=>a[0]<f[0]?-1:1);for(let[a,f]of c)a===vn?l.push(...f):d.push(f)}return l}}function ua(i){let t=i&&Array.isArray(i),e=t&&i.length&&(!i[0]||pa.some(n=>!(n in i[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function oo(i){ua(i);let t=(f,y)=>f.name.toLowerCase()<y.name.toLowerCase()?-1:1,e=i.sort(t),o=ha(i,f=>{let y=new Set;if(f.shortcodes)for(let T of f.shortcodes)for(let m of ft(T))y.add(m);return y}),s=f=>o(f,!0),r=f=>o(f,!1),l=f=>{let y=ft(f),T=y.map((m,$)=>($<y.length-1?s:r)(m));return go(T,m=>m.name).sort(t)},d=new Map,h=new Map;for(let f of i){h.set(f.name.toLowerCase(),f);for(let y of f.shortcodes||[])d.set(y.toLowerCase(),f)}return{all:e,search:l,byShortcode:f=>d.get(f.toLowerCase()),byName:f=>h.get(f.toLowerCase())}}function It(i){if(!i)return i;if(fa&&(i=structuredClone(i)),delete i.tokens,i.skinTones){let t=i.skinTones.length;i.skins=Array(t);for(let e=0;e<t;e++)i.skins[e]={tone:i.skinTones[e],unicode:i.skinUnicodes[e],version:i.skinVersions[e]};delete i.skinTones,delete i.skinUnicodes,delete i.skinVersions}return i}function vo(i){i||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function ma(i){if(!i||!Array.isArray(i)||!i[0]||typeof i[0]!="object"||ga.some(t=>!(t in i[0])))throw new Error("Emoji data is in the wrong format")}function yo(i,t){if(Math.floor(i.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+i.status)}async function ba(i){let t=await fetch(i,{method:"HEAD"});yo(t,i);let e=t.headers.get("etag");return vo(e),e}async function mi(i){let t=await fetch(i);yo(t,i);let e=t.headers.get("etag");vo(e);let n=await t.json();return ma(n),[e,n]}function va(i){for(var t="",e=new Uint8Array(i),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function ya(i){for(var t=i.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=i.charCodeAt(o);return e}async function xo(i){let t=JSON.stringify(i),e=ya(t),n=await crypto.subtle.digest("SHA-1",e),o=va(n);return btoa(o)}async function xa(i,t){let e,n=await ba(t);if(!n){let o=await mi(t);n=o[0],e=o[1],n||(n=await xo(e))}await ia(i,t,n)||(e||(e=(await mi(t))[1]),await mo(i,e,t,n))}async function wa(i,t){let[e,n]=await mi(t);e||(e=await xo(n)),await mo(i,n,t,e)}async function $a(i,t){try{await xa(i,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var zr,Or,Ze,gt,bi,Br,ro,Nr,ao,Hr,Ur,lo,fi,xn,io,bt,vi,co,Fr,Wr,Kr,gi,yn,wn,Jr,Qr,vn,pa,fa,ga,mt,$i=Pn(()=>{zr=1,Or=1,Ze="emoji",gt="keyvalue",bi="favorites",Br="tokens",ro="tokens",Nr="unicode",ao="count",Hr="group",Ur="order",lo="group-order",fi="eTag",xn="url",io="skinTone",bt="readonly",vi="readwrite",co="skinUnicodes",Fr="skinUnicodes",Wr="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Kr="en";gi={},yn={},wn={};Jr=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);Qr=2;vn="";pa=["name","url"];fa=typeof wrappedJSObject<"u";ga=["annotation","emoji","group","order","version"];mt=class{constructor({dataSource:t=Wr,locale:e=Kr,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=oo(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await Yr(this._dbName);Zr(this._dbName,this._clear);let e=this.dataSource;await na(t)?await wa(t,e):this._lazyUpdate=$a(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return ui(t),await this.ready(),so(await oa(this._db,t)).map(It)}async getEmojiBySearchQuery(t){bn(t),await this.ready();let e=this._custom.search(t),n=so(await bo(this._db,t)).map(It);return[...e,...n]}async getEmojiByShortcode(t){bn(t),await this.ready();let e=this._custom.byShortcode(t);return e||It(await ra(this._db,t))}async getEmojiByUnicodeOrName(t){bn(t),await this.ready();let e=this._custom.byName(t);return e||It(await aa(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await wi(this._db,gt,io)||0}async setPreferredSkinTone(t){return ui(t),await this.ready(),la(this._db,gt,io,t)}async incrementFavoriteEmojiCount(t){return bn(t),await this.ready(),da(this._db,t)}async getTopFavoriteEmoji(t){return ui(t),await this.ready(),(await ca(this._db,this._custom,t)).map(It)}set customEmoji(t){this._custom=oo(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await yi(this._dbName)}async delete(){await this._shutdown(),await Xr(this._dbName)}}});function $o(i){return i.unicode.includes("‍")}function Ma(i){let t=ko(i,"#000"),e=ko(i,"#fff");return t&&e&&Aa(t,e)}function Da(){let i=Object.entries(Ta);try{for(let[t,e]of i)if(Ma(t))return e}catch{}finally{}return i[0][1]}function Oa(i,t){if(t===0)return i;let e=i.indexOf(ja);return e!==-1?i.substring(0,e)+String.fromCodePoint(Ia+t-1)+i.substring(e):(i.endsWith(La)&&(i=i.substring(0,i.length-1)),i+Ra+String.fromCodePoint(za+t-1))}function Te(i){i.preventDefault(),i.stopPropagation()}function Ci(i,t,e){return t+=i?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function Do(i,t){let e=new Set,n=[];for(let o of i){let s=t(o);e.has(s)||(e.add(s),n.push(o))}return n}function Ba(i,t){let e=n=>{let o={};for(let s of n)typeof s.tone=="number"&&s.version<=t&&(o[s.tone]=s.unicode);return o};return i.map(({unicode:n,skins:o,shortcodes:s,url:r,name:l,category:d,annotation:h})=>({unicode:n,name:l,shortcodes:s,url:r,category:d,annotation:h,id:n||l,skins:o&&e(o)}))}function Ha(i,t,e){let n;Na?(n=new ResizeObserver(e),n.observe(i)):kn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function To(i){{let t=document.createRange();return t.selectNode(i.firstChild),t.getBoundingClientRect().width}}function Eo(i,t,e){let n=To(t);if(!n){if(!Je){Je=e.cloneNode(!0);let o=getComputedStyle(e);for(let s of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])Je.style.setProperty(s,o.getPropertyValue(s),"important")}try{return document.body.appendChild(Je),Je.firstChild.nodeValue=i,To(Je)}finally{Je.remove()}}return n}function Fa(i,t,e){let n=!0;for(let o of i){let s=e(o);if(!s)continue;typeof _i>"u"&&(_i=Eo(Ua,t,t));let l=Eo(o.unicode,s,t)/1.8<_i;Mi.set(o.unicode,l),l||(n=!1)}return n}function Wa(i){return Do(i,t=>t)}function Ka(i){i&&(i.scrollTop=0)}function zt(i,t,e){let n=i.get(t);return n||(n=e(),i.set(t,n)),n}function Co(i){return""+i}function Va(i){let t=document.createElement("template");return t.innerHTML=i,t}function Za(i,t){Xa?i.replaceChildren(...t):(i.innerHTML="",i.append(...t))}function Ja(i,t){let e=i.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function Qa(i,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=Ja(n,i):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&Za(n,i)}function el(i,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:s,attributeName:r,attributeValuePre:l,attributeValuePost:d}}=e,h=i[s];if(o!==h)if(e.currentExpression=h,r)if(h===null)n.removeAttribute(r);else{let c=l+Co(h)+d;n.setAttribute(r,c)}else{let c;Array.isArray(h)?Qa(h,e):h instanceof Element?(c=h,n.replaceWith(c)):n.nodeValue=Co(h),c&&(e.targetNode=c)}}}function tl(i){let t="",e=!1,n=!1,o=-1,s=new Map,r=[],l=0;for(let h=0,c=i.length;h<c;h++){let a=i[h];if(t+=a.slice(l),h===c-1)break;for(let u=0;u<a.length;u++)switch(a.charAt(u)){case"<":{a.charAt(u+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let f=r[r.length-1],y=zt(s,f,()=>[]),T,m,$;if(n){let u=/(\S+)="?([^"=]*)$/.exec(a);T=u[1],m=u[2];let D=/^([^">]*)("?)/.exec(i[h+1]);$=D[1],t=t.slice(0,-1*u[0].length),l=D[0].length}else l=0;let k={attributeName:T,attributeValuePre:m,attributeValuePost:$,expressionIndex:h};y.push(k),!e&&!n&&(t+=" ")}return{template:Va(t),elementsToBindings:s}}function _o(i,t,e){for(let n=0;n<i.length;n++){let o=i[n],s=o.attributeName?t:t.firstChild,r={binding:o,targetNode:s,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function nl(i,t){let e=[],n;if(t.size===1&&(n=t.get(0)))_o(n,i,e);else{let o=document.createTreeWalker(i,NodeFilter.SHOW_ELEMENT),s=i,r=-1;do{let l=t.get(++r);l&&_o(l,s,e)}while(s=o.nextNode())}return e}function il(i){let{template:t,elementsToBindings:e}=zt(Ga,i,()=>tl(i)),n=t.cloneNode(!0).content.firstElementChild,o=nl(n,e);return function(r){return el(r,o),n}}function sl(i){let t=zt(qa,i,()=>new Map),e=Ya;function n(s,...r){let l=zt(t,s,()=>new Map);return zt(l,e,()=>il(s))(r)}function o(s,r,l){return s.map((d,h)=>{let c=e;e=l(d);try{return r(d,h)}finally{e=c}})}return{map:o,html:n}}function ol(i,t,e,n,o,s,r,l,d){let{labelWithSkin:h,titleForEmoji:c,unicodeWithSkin:a}=e,{html:f,map:y}=sl(t);function T(u,D,R){return y(u,(H,te)=>f`<button role="${D?"option":"menuitem"}" aria-selected="${D?te===t.activeSearchItem:null}" aria-label="${h(H,t.currentSkinTone)}" title="${c(H)}" class="${"emoji"+(D&&te===t.activeSearchItem?" active":"")+(H.unicode?"":" custom-emoji")}" id="${`${R}-${H.id}`}" style="${H.unicode?null:`--custom-emoji-background: url(${JSON.stringify(H.url)})`}">${H.unicode?a(H,t.currentSkinTone):""}</button>`,H=>`${R}-${H.id}`)}let $=f`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${y(t.skinTones,(u,D)=>f`<div id="skintone-${D}" class="emoji ${D===t.activeSkinTone?"active":""}" aria-selected="${D===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[D]}" aria-label="${t.i18n.skinTones[D]}">${u}</div>`,u=>u)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${y(t.groups,u=>f`<button role="tab" class="nav-button" aria-controls="tab-${u.id}" aria-label="${t.i18n.categories[u.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===u.id}" title="${t.i18n.categories[u.name]}" data-group-id="${u.id}"><div class="nav-emoji emoji">${u.emoji}</div></button>`,u=>u.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${y(t.currentEmojisWithCategories,(u,D)=>f`<div><div id="menu-label-${D}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:u.category?u.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${D!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(u.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${D}" id="${t.searchMode?"search-results":null}">${T(u.emojis,t.searchMode,"emo")}</div></div>`,u=>u.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${T(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,k=(u,D)=>{for(let R of i.querySelectorAll(`[${u}]`))D(R,R.getAttribute(u))};if(d){i.appendChild($);for(let u of["click","focusout","input","keydown","keyup"])k(`data-on-${u}`,(D,R)=>{D.addEventListener(u,n[R])});k("data-ref",(u,D)=>{s[D]=u}),r.addEventListener("abort",()=>{i.removeChild($)})}k("data-action",(u,D)=>{let R=l.get(D);R||l.set(D,R=new WeakSet),R.has(u)||(R.add(u),o[D](u))})}function rl(i){let t=!1,e,n=new Map,o=new Set,s,r=()=>{if(t)return;let h=[...o];o.clear();try{for(let c of h)c()}finally{s=!1,o.size&&(s=!0,Tn(r))}},l=new Proxy({},{get(h,c){if(e){let a=n.get(c);a||(a=new Set,n.set(c,a)),a.add(e)}return h[c]},set(h,c,a){if(h[c]!==a){h[c]=a;let f=n.get(c);if(f){for(let y of f)o.add(y);s||(s=!0,Tn(r))}}return!0}}),d=h=>{let c=()=>{let a=e;e=c;try{return h()}finally{e=a}};return c()};return i.addEventListener("abort",()=>{t=!0}),{state:l,createEffect:d}}function Pi(i,t,e){if(i.length!==t.length)return!1;for(let n=0;n<i.length;n++)if(!e(i[n],t[n]))return!1;return!0}function al(i,t,e){{let n=i.closest(".tabpanel"),o=Po.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),Po.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(i)}}function ll(i,t){let e={},n=new AbortController,o=n.signal,{state:s,createEffect:r}=rl(o),l=new Map;$n(s,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),$n(s,t),$n(s,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:_a,isRtl:!1,currentGroupIndex:0,groups:ki,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{s.currentGroup!==s.groups[s.currentGroupIndex]&&(s.currentGroup=s.groups[s.currentGroupIndex])});let d=g=>{i.getElementById(g).focus()},h=g=>i.getElementById(`emo-${g.id}`),c=(g,v)=>{e.rootElement.dispatchEvent(new CustomEvent(g,{detail:v,bubbles:!0,composed:!0}))},a=(g,v)=>g.id===v.id,f=(g,v)=>{let{category:E,emojis:P}=g,{category:C,emojis:M}=v;return E!==C?!1:Pi(P,M,a)},y=g=>{Pi(s.currentEmojis,g,a)||(s.currentEmojis=g)},T=g=>{s.searchMode!==g&&(s.searchMode=g)},m=g=>{Pi(s.currentEmojisWithCategories,g,f)||(s.currentEmojisWithCategories=g)},$=(g,v)=>v&&g.skins&&g.skins[v]||g.unicode,D={labelWithSkin:(g,v)=>Wa([g.name||$(g,v),g.annotation,...g.shortcodes||Si].filter(Boolean)).join(", "),titleForEmoji:g=>g.annotation||(g.shortcodes||Si).join(", "),unicodeWithSkin:$},R={onClickSkinToneButton:fe,onEmojiClick:K,onNavClick:tt,onNavKeydown:se,onSearchKeydown:Re,onSkinToneOptionsClick:oe,onSkinToneOptionsFocusOut:b,onSkinToneOptionsKeydown:nt,onSkinToneOptionsKeyup:_e,onSearchInput:w},H={calculateEmojiGridStyle:B,updateOnIntersection:Ee},te=!0;r(()=>{ol(i,s,D,R,H,e,o,l,te),te=!1}),s.emojiVersion||Ei().then(g=>{g||(s.message=s.i18n.emojiUnsupportedMessage)}),r(()=>{async function g(){let v=!1,E=setTimeout(()=>{v=!0,s.message=s.i18n.loadingMessage},Ea);try{await s.database.ready(),s.databaseLoaded=!0}catch(P){console.error(P),s.message=s.i18n.networkErrorMessage}finally{clearTimeout(E),v&&(v=!1,s.message="")}}s.database&&g()}),r(()=>{s.pickerStyle=`
      --num-groups: ${s.groups.length}; 
      --indicator-opacity: ${s.searchMode?0:1}; 
      --num-skintones: ${wo};`}),r(()=>{s.customEmoji&&s.database&&ae()}),r(()=>{s.customEmoji&&s.customEmoji.length?s.groups!==Ai&&(s.groups=Ai):s.groups!==ki&&(s.currentGroupIndex&&s.currentGroupIndex--,s.groups=ki)}),r(()=>{async function g(){s.databaseLoaded&&(s.currentSkinTone=await s.database.getPreferredSkinTone())}g()}),r(()=>{s.skinTones=Array(wo).fill().map((g,v)=>Oa(s.skinToneEmoji,v))}),r(()=>{s.skinToneButtonText=s.skinTones[s.currentSkinTone]}),r(()=>{s.skinToneButtonLabel=s.i18n.skinToneLabel.replace("{skinTone}",s.i18n.skinTones[s.currentSkinTone])}),r(()=>{async function g(){let{database:v}=s,E=(await Promise.all(Pa.map(P=>v.getEmojiByUnicodeOrName(P)))).filter(Boolean);s.defaultFavoriteEmojis=E}s.databaseLoaded&&g()});function ae(){let{customEmoji:g,database:v}=s,E=g||Si;v.customEmoji!==E&&(v.customEmoji=E)}r(()=>{async function g(){ae();let{database:v,defaultFavoriteEmojis:E,numColumns:P}=s,C=await v.getTopFavoriteEmoji(P),M=await he(Do([...C,...E],j=>j.unicode||j.name).slice(0,P));s.currentFavorites=M}s.databaseLoaded&&s.defaultFavoriteEmojis&&g()});function B(g){Ha(g,o,()=>{{let v=getComputedStyle(e.rootElement),E=parseInt(v.getPropertyValue("--num-columns"),10),P=v.getPropertyValue("direction")==="rtl";s.numColumns=E,s.isRtl=P}})}function Ee(g){al(g,o,v=>{for(let{target:E,isIntersecting:P}of v)E.classList.toggle("onscreen",P)})}r(()=>{async function g(){let{searchText:v,currentGroup:E,databaseLoaded:P,customEmoji:C}=s;if(!P)s.currentEmojis=[],s.searchMode=!1;else if(v.length>=ka){let M=await Ce(v);s.searchText===v&&(y(M),T(!0))}else{let{id:M}=E;if(M!==-1||C&&C.length){let j=await et(M);s.currentGroup.id===M&&(y(j),T(!1))}}}g()});let ce=()=>{kn(()=>Ka(e.tabpanelElement))};r(()=>{let{currentEmojis:g,emojiVersion:v}=s,E=g.filter(P=>P.unicode).filter(P=>$o(P)&&!Mi.has(P.unicode));if(!v&&E.length)y(g),kn(()=>Oe(E));else{let P=v?g:g.filter(ue);y(P),ce()}});function Oe(g){Fa(g,e.baselineEmoji,h)?ce():s.currentEmojis=[...s.currentEmojis]}function ue(g){return!g.unicode||!$o(g)||Mi.get(g.unicode)}async function Be(g){let v=s.emojiVersion||await Ei();return g.filter(({version:E})=>!E||E<=v)}async function he(g){return Ba(g,s.emojiVersion||await Ei())}async function et(g){let v=g===-1?s.customEmoji:await s.database.getEmojiByGroup(g);return he(await Be(v))}async function Ce(g){return he(await Be(await s.database.getEmojiBySearchQuery(g)))}r(()=>{}),r(()=>{function g(){let{searchMode:E,currentEmojis:P}=s;if(E)return[{category:"",emojis:P}];let C=new Map;for(let M of P){let j=M.category||"",A=C.get(j);A||(A=[],C.set(j,A)),A.push(M)}return[...C.entries()].map(([M,j])=>({category:M,emojis:j})).sort((M,j)=>s.customCategorySorting(M.category,j.category))}let v=g();m(v)}),r(()=>{s.activeSearchItemId=s.activeSearchItem!==-1&&s.currentEmojis[s.activeSearchItem].id}),r(()=>{let{rawSearchText:g}=s;Ao(()=>{s.searchText=(g||"").trim(),s.activeSearchItem=-1})});function Re(g){if(!s.searchMode||!s.currentEmojis.length)return;let v=E=>{Te(g),s.activeSearchItem=Ci(E,s.activeSearchItem,s.currentEmojis)};switch(g.key){case"ArrowDown":return v(!1);case"ArrowUp":return v(!0);case"Enter":if(s.activeSearchItem===-1)s.activeSearchItem=0;else return Te(g),ye(s.currentEmojis[s.activeSearchItem].id)}}function tt(g){let{target:v}=g,E=v.closest(".nav-button");if(!E)return;let P=parseInt(E.dataset.groupId,10);e.searchElement.value="",s.rawSearchText="",s.searchText="",s.activeSearchItem=-1,s.currentGroupIndex=s.groups.findIndex(C=>C.id===P)}function se(g){let{target:v,key:E}=g,P=C=>{C&&(Te(g),C.focus())};switch(E){case"ArrowLeft":return P(v.previousElementSibling);case"ArrowRight":return P(v.nextElementSibling);case"Home":return P(v.parentElement.firstElementChild);case"End":return P(v.parentElement.lastElementChild)}}async function je(g){let v=await s.database.getEmojiByUnicodeOrName(g),E=[...s.currentEmojis,...s.currentFavorites].find(C=>C.id===g),P=E.unicode&&$(E,s.currentSkinTone);return await s.database.incrementFavoriteEmojiCount(g),{emoji:v,skinTone:s.currentSkinTone,...P&&{unicode:P},...E.name&&{name:E.name}}}async function ye(g){let v=je(g);c("emoji-click-sync",v),c("emoji-click",await v)}function K(g){let{target:v}=g;if(!v.classList.contains("emoji"))return;Te(g);let E=v.id.substring(4);ye(E)}function le(g){s.currentSkinTone=g,s.skinTonePickerExpanded=!1,d("skintone-button"),c("skin-tone-change",{skinTone:g}),s.database.setPreferredSkinTone(g)}function oe(g){let{target:{id:v}}=g,E=v&&v.match(/^skintone-(\d)/);if(!E)return;Te(g);let P=parseInt(E[1],10);le(P)}function fe(g){s.skinTonePickerExpanded=!s.skinTonePickerExpanded,s.activeSkinTone=s.currentSkinTone,s.skinTonePickerExpanded&&(Te(g),kn(()=>d("skintone-list")))}r(()=>{s.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{s.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):s.skinTonePickerExpandedAfterAnimation=!1});function nt(g){if(!s.skinTonePickerExpanded)return;let v=async E=>{Te(g),s.activeSkinTone=E};switch(g.key){case"ArrowUp":return v(Ci(!0,s.activeSkinTone,s.skinTones));case"ArrowDown":return v(Ci(!1,s.activeSkinTone,s.skinTones));case"Home":return v(0);case"End":return v(s.skinTones.length-1);case"Enter":return Te(g),le(s.activeSkinTone);case"Escape":return Te(g),s.skinTonePickerExpanded=!1,d("skintone-button")}}function _e(g){if(s.skinTonePickerExpanded)switch(g.key){case" ":return Te(g),le(s.activeSkinTone)}}async function b(g){let{relatedTarget:v}=g;(!v||v.id!=="skintone-list")&&(s.skinTonePickerExpanded=!1)}function w(g){s.rawSearchText=g.target.value}return{$set(g){$n(s,g)},$destroy(){n.abort()}}}function So(i){i instanceof Qe||Object.setPrototypeOf(i,customElements.get(i.tagName.toLowerCase()).prototype)}var Ai,ki,ka,wo,Ao,Ta,Ea,Ca,_a,Pa,Mo,Sa,ko,Aa,Ti,Ei,Mi,La,Ra,ja,Ia,za,kn,Na,Ua,_i,Je,Ga,qa,Ya,Xa,Tn,Po,Si,$n,dl,cl,hl,pl,Lo,ul,Qe,Ro,jo=Pn(()=>{$i();Ai=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([i,t,e])=>({id:i,emoji:t,name:e})),ki=Ai.slice(1),ka=2,wo=6,Ao=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;Ta={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},Ea=1e3,Ca="🖐️",_a=8,Pa=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],Mo='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',Sa=(i,t)=>i<t?-1:i>t?1:0,ko=(i,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${Mo}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(i,0,0),n.getImageData(0,0,1,1).data},Aa=(i,t)=>{let e=[...i].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};Ei=()=>(Ti||(Ti=new Promise(i=>Ao(()=>i(Da())))),Ti),Mi=new Map,La="️",Ra="\uD83C",ja="‍",Ia=127995,za=57339;kn=requestAnimationFrame,Na=typeof ResizeObserver=="function";Ua="😀";Ga=new WeakMap,qa=new WeakMap,Ya=Symbol("un-keyed"),Xa="replaceChildren"in Element.prototype;Tn=typeof queueMicrotask=="function"?queueMicrotask:i=>Promise.resolve().then(i);Po=new WeakMap;Si=[],{assign:$n}=Object;dl="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",cl="en",hl={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},pl=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',Lo=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],ul=`:host{--emoji-font-family:${Mo}}`,Qe=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=pl+ul,this.shadowRoot.appendChild(e),this._ctx={locale:cl,dataSource:dl,skinToneEmoji:Ca,customCategorySorting:Sa,customEmoji:null,i18n:hl,emojiVersion:null,...t};for(let n of Lo)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){So(this),this._cmp||(this._cmp=ll(this.shadowRoot,this._ctx))}disconnectedCallback(){So(this),Tn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,s)=>s.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new mt({locale:t,dataSource:e}))}_dbFlush(){Tn(()=>this._dbCreate())}},Ro={};for(let i of Lo)Ro[i]={get(){return i==="database"&&this._dbCreate(),this._ctx[i]},set(t){if(i==="database")throw new Error("database is read-only");this._set(i,t)}};Object.defineProperties(Qe.prototype,Ro);customElements.get("emoji-picker")||customElements.define("emoji-picker",Qe)});var Io={};Wo(Io,{Database:()=>mt,Picker:()=>Qe});var zo=Pn(()=>{jo();$i()});var Ft=globalThis,Wt=Ft.ShadowRoot&&(Ft.ShadyCSS===void 0||Ft.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Sn=Symbol(),Ui=new WeakMap,yt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==Sn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Wt&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Ui.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Ui.set(e,t))}return t}toString(){return this.cssText}},Fi=i=>new yt(typeof i=="string"?i:i+"",void 0,Sn),Ne=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((n,o,s)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+i[s+1],i[0]);return new yt(e,i,Sn)},Wi=(i,t)=>{if(Wt)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=Ft.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,i.appendChild(n)}},An=Wt?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Fi(e)})(i):i;var{is:Ko,defineProperty:Vo,getOwnPropertyDescriptor:Go,getOwnPropertyNames:qo,getOwnPropertySymbols:Yo,getPrototypeOf:Xo}=Object,Kt=globalThis,Ki=Kt.trustedTypes,Zo=Ki?Ki.emptyScript:"",Jo=Kt.reactiveElementPolyfillSupport,xt=(i,t)=>i,Mn={toAttribute(i,t){switch(t){case Boolean:i=i?Zo:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Gi=(i,t)=>!Ko(i,t),Vi={attribute:!0,type:String,converter:Mn,reflect:!1,useDefault:!1,hasChanged:Gi};Symbol.metadata??=Symbol("metadata"),Kt.litPropertyMetadata??=new WeakMap;var Se=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Vi){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&Vo(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:s}=Go(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let l=o?.call(this);s?.call(this,r),this.requestUpdate(t,l,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Vi}static _$Ei(){if(this.hasOwnProperty(xt("elementProperties")))return;let t=Xo(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(xt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(xt("properties"))){let e=this.properties,n=[...qo(e),...Yo(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(An(o))}else t!==void 0&&e.push(An(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Wi(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let s=(n.converter?.toAttribute!==void 0?n.converter:Mn).toAttribute(e,n.type);this._$Em=t,s==null?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let s=n.getPropertyOptions(o),r=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Mn;this._$Em=o;let l=r.fromAttribute(e,s.type);this[o]=l??this._$Ej?.get(o)??l,this._$Em=null}}requestUpdate(t,e,n,o=!1,s){if(t!==void 0){let r=this.constructor;if(o===!1&&(s=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??Gi)(s,e)||n.useDefault&&n.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:s},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),s!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,s]of this._$Ep)this[o]=s;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,s]of n){let{wrapped:r}=s,l=this[o];r!==!0||this._$AL.has(o)||l===void 0||this.C(o,void 0,s,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Se.elementStyles=[],Se.shadowRootOptions={mode:"open"},Se[xt("elementProperties")]=new Map,Se[xt("finalized")]=new Map,Jo?.({ReactiveElement:Se}),(Kt.reactiveElementVersions??=[]).push("2.1.2");var Ln=globalThis,qi=i=>i,Vt=Ln.trustedTypes,Yi=Vt?Vt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Rn="$lit$",Ae=`lit$${Math.random().toFixed(9).slice(2)}$`,jn="?"+Ae,Qo=`<${jn}>`,Fe=document,$t=()=>Fe.createComment(""),kt=i=>i===null||typeof i!="object"&&typeof i!="function",In=Array.isArray,ts=i=>In(i)||typeof i?.[Symbol.iterator]=="function",Dn=`[ 	
\f\r]`,wt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Xi=/-->/g,Zi=/>/g,He=RegExp(`>|${Dn}(?:([^\\s"'>=/]+)(${Dn}*=${Dn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ji=/'/g,Qi=/"/g,ns=/^(?:script|style|textarea|title)$/i,zn=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),p=zn(1),Y=zn(2),Rl=zn(3),Me=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),es=new WeakMap,Ue=Fe.createTreeWalker(Fe,129);function is(i,t){if(!In(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Yi!==void 0?Yi.createHTML(t):t}var ss=(i,t)=>{let e=i.length-1,n=[],o,s=t===2?"<svg>":t===3?"<math>":"",r=wt;for(let l=0;l<e;l++){let d=i[l],h,c,a=-1,f=0;for(;f<d.length&&(r.lastIndex=f,c=r.exec(d),c!==null);)f=r.lastIndex,r===wt?c[1]==="!--"?r=Xi:c[1]!==void 0?r=Zi:c[2]!==void 0?(ns.test(c[2])&&(o=RegExp("</"+c[2],"g")),r=He):c[3]!==void 0&&(r=He):r===He?c[0]===">"?(r=o??wt,a=-1):c[1]===void 0?a=-2:(a=r.lastIndex-c[2].length,h=c[1],r=c[3]===void 0?He:c[3]==='"'?Qi:Ji):r===Qi||r===Ji?r=He:r===Xi||r===Zi?r=wt:(r=He,o=void 0);let y=r===He&&i[l+1].startsWith("/>")?" ":"";s+=r===wt?d+Qo:a>=0?(n.push(h),d.slice(0,a)+Rn+d.slice(a)+Ae+y):d+Ae+(a===-2?l:y)}return[is(i,s+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},Tt=class i{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let s=0,r=0,l=t.length-1,d=this.parts,[h,c]=ss(t,e);if(this.el=i.createElement(h,n),Ue.currentNode=this.el.content,e===2||e===3){let a=this.el.content.firstChild;a.replaceWith(...a.childNodes)}for(;(o=Ue.nextNode())!==null&&d.length<l;){if(o.nodeType===1){if(o.hasAttributes())for(let a of o.getAttributeNames())if(a.endsWith(Rn)){let f=c[r++],y=o.getAttribute(a).split(Ae),T=/([.?@])?(.*)/.exec(f);d.push({type:1,index:s,name:T[2],strings:y,ctor:T[1]==="."?qt:T[1]==="?"?Yt:T[1]==="@"?Xt:Ke}),o.removeAttribute(a)}else a.startsWith(Ae)&&(d.push({type:6,index:s}),o.removeAttribute(a));if(ns.test(o.tagName)){let a=o.textContent.split(Ae),f=a.length-1;if(f>0){o.textContent=Vt?Vt.emptyScript:"";for(let y=0;y<f;y++)o.append(a[y],$t()),Ue.nextNode(),d.push({type:2,index:++s});o.append(a[f],$t())}}}else if(o.nodeType===8)if(o.data===jn)d.push({type:2,index:s});else{let a=-1;for(;(a=o.data.indexOf(Ae,a+1))!==-1;)d.push({type:7,index:s}),a+=Ae.length-1}s++}}static createElement(t,e){let n=Fe.createElement("template");return n.innerHTML=t,n}};function We(i,t,e=i,n){if(t===Me)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,s=kt(t)?void 0:t._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),s===void 0?o=void 0:(o=new s(i),o._$AT(i,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=We(i,o._$AS(i,t.values),o,n)),t}var Gt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??Fe).importNode(e,!0);Ue.currentNode=o;let s=Ue.nextNode(),r=0,l=0,d=n[0];for(;d!==void 0;){if(r===d.index){let h;d.type===2?h=new ot(s,s.nextSibling,this,t):d.type===1?h=new d.ctor(s,d.name,d.strings,this,t):d.type===6&&(h=new Zt(s,this,t)),this._$AV.push(h),d=n[++l]}r!==d?.index&&(s=Ue.nextNode(),r++)}return Ue.currentNode=Fe,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},ot=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=We(this,t,e),kt(t)?t===x||t==null||t===""?(this._$AH!==x&&this._$AR(),this._$AH=x):t!==this._$AH&&t!==Me&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ts(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==x&&kt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Fe.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Tt.createElement(is(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let s=new Gt(o,this),r=s.u(this.options);s.p(e),this.T(r),this._$AH=s}}_$AC(t){let e=es.get(t.strings);return e===void 0&&es.set(t.strings,e=new Tt(t)),e}k(t){In(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let s of t)o===e.length?e.push(n=new i(this.O($t()),this.O($t()),this,this.options)):n=e[o],n._$AI(s),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=qi(t).nextSibling;qi(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ke=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,s){this.type=1,this._$AH=x,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=x}_$AI(t,e=this,n,o){let s=this.strings,r=!1;if(s===void 0)t=We(this,t,e,0),r=!kt(t)||t!==this._$AH&&t!==Me,r&&(this._$AH=t);else{let l=t,d,h;for(t=s[0],d=0;d<s.length-1;d++)h=We(this,l[n+d],e,d),h===Me&&(h=this._$AH[d]),r||=!kt(h)||h!==this._$AH[d],h===x?t=x:t!==x&&(t+=(h??"")+s[d+1]),this._$AH[d]=h}r&&!o&&this.j(t)}j(t){t===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},qt=class extends Ke{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===x?void 0:t}},Yt=class extends Ke{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==x)}},Xt=class extends Ke{constructor(t,e,n,o,s){super(t,e,n,o,s),this.type=5}_$AI(t,e=this){if((t=We(this,t,e,0)??x)===Me)return;let n=this._$AH,o=t===x&&n!==x||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,s=t!==x&&(n===x||o);o&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Zt=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){We(this,t)}},os={M:Rn,P:Ae,A:jn,C:1,L:ss,R:Gt,D:ts,V:We,I:ot,H:Ke,N:Yt,U:Xt,B:qt,F:Zt},er=Ln.litHtmlPolyfillSupport;er?.(Tt,ot),(Ln.litHtmlVersions??=[]).push("3.3.3");var rs=(i,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let s=e?.renderBefore??null;n._$litPart$=o=new ot(t.insertBefore($t(),s),s,void 0,e??{})}return o._$AI(i),o};var On=globalThis,ge=class extends Se{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=rs(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Me}};ge._$litElement$=!0,ge.finalized=!0,On.litElementHydrateSupport?.({LitElement:ge});var tr=On.litElementPolyfillSupport;tr?.({LitElement:ge});(On.litElementVersions??=[]).push("4.2.2");var rt="mydashlight",Gl=`/api/${rt}/pair`,ql=`/api/${rt}/pair/poll`,Yl=`/${rt}`,Et="pair";function as(i){return i.length>4?`${i.slice(0,4)}-${i.slice(4)}`:i}function Bn(i){return i.toUpperCase().replace(/[^A-Z0-9]/g,"")}function ls(i){let t=new URLSearchParams(i);return t.has(Et)?Bn(t.get(Et)??""):null}function nr(i){if(i<60)return"just now";let t=Math.round(i/60);return`${t} minute${t===1?"":"s"} ago`}var Ct=class extends ge{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let n=await this.connection.sendMessagePromise({type:`${rt}/pair/check`,code:e});n.found?(this.waiting=n,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(n){this.error=this.message(n),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${rt}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let n=e?.code;return n==="unauthorized"?"Only a Home Assistant admin can pair a screen.":n==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":n==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return p`<form @submit=${o=>{o.preventDefault();let s=Bn(this.typed);s&&this.check(s)}}>
      <h2>Pair a screen</h2>
      <p>Type the code the screen is showing.</p>
      ${this.error?p`<p class="error" role="alert">${this.error}</p>`:x}
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
      <p class="code">${as(e.code??"")}</p>
      ${o?p`<p class="warning" role="alert">
            <b>This code came from outside your home network.</b> Only allow it if you can see this code on a
            screen of your own right now. If someone sent you this code or link, press Cancel.
          </p>`:x}
      <p>
        A screen at ${e.address} asked ${nr(e.age??0)}. Check the code matches the one on the screen. It will be
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
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Close</button></div>`,p`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${e}</div>`}};Ct.styles=Ne`
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
  `,Ct.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",Ct);function L(i){let t=Math.round(i),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function Ie(i){let t=Math.floor(Math.round(i)/60)%24;return`${L(i)} ${t<12?"AM":"PM"}`}function ds(i){let t=Math.floor(i/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function Pt(i){let t=Math.max(0,Math.round(i)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function Nn(i){let t=Math.floor(i/60)%24,e=i%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var ir=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),sr=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),or=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Jt(i){return new Date(`${i}T12:00:00Z`)}function be(i){let t=Jt(i);return`${ir.format(t)}, ${or.format(t)}`}function ie(i){return sr.format(Jt(i))}function we(i,t){return Math.round((Jt(t).getTime()-Jt(i).getTime())/864e5)}function _t(i,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:i,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return _t("UTC",t)}let n=o=>e.find(s=>s.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function Qt(i,t,e){let n=Math.floor((t.getTime()-i.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=_t(e,i),s=_t(e,t).date;return o.date===s?`at ${Ie(o.minutes)}`:`on ${ie(o.date)} at ${Ie(o.minutes)}`}var W=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}};function ps(i){switch(i.code){case"connection_lost":case"timeout":return"Can’t reach Home Assistant";case"not_running":return"MyDashLight isn’t running";default:return"Couldn’t get the latest plan"}}var Ve="mydashlight",rr=7,Hn=3e4,cs=3e4;function Un(i){if(i instanceof W)return i;if(i&&typeof i=="object"){let t=i;if(typeof t.message=="string")return new W(String(t.code??"error"),t.message)}return typeof i=="number"?new W("connection_lost","Lost the connection to Home Assistant."):new W("error",String(i))}function hs(i,t){return new Promise((e,n)=>{let o=setTimeout(()=>n(new W("timeout","Home Assistant didn’t answer.")),t);i.then(s=>{clearTimeout(o),e(s)},s=>{clearTimeout(o),n(s)})})}var St=class{constructor(t,e,n,o){this.live=!1;this.unsub=null;this.opening=!1;this.gen=0;this.closed=!1;this.onReady=()=>this.open();this.onDisconnected=()=>this.dropped();this.conn=t,this.type=e,this.onMessage=n,this.onFailed=o,t.addEventListener?.("ready",this.onReady),t.addEventListener?.("disconnected",this.onDisconnected)}get isOpen(){return this.unsub!==null||this.opening}open(){if(this.closed||this.isOpen||this.conn.connected===!1)return;let t=++this.gen;this.opening=!0,this.conn.subscribeMessage(e=>{t===this.gen&&(this.live=!0,this.onMessage(e))},{type:this.type},{resubscribe:!1}).then(e=>{if(t!==this.gen){e().catch(()=>{});return}this.opening=!1,this.unsub=e},e=>{t===this.gen&&(this.opening=!1,this.live=!1,this.onFailed(e))})}dropped(){this.gen++,this.opening=!1,this.unsub=null,this.live=!1}close(){this.closed=!0,this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsub;this.dropped(),t&&t().catch(()=>{})}},en=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.rides=null;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new W("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.rides?.live??!1}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.rides=new St(this.conn,`${Ve}/rides/subscribe`,t=>{t.plan?this.emit(t.plan):this.fail(new W("not_running","MyDashLight isn’t running right now."))},()=>{}),this.rides.open(),this.timer=setInterval(()=>{this.live||(this.refresh(),this.rides?.open())},Hn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected),this.rides?.close(),this.rides=null}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await hs(this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:"get_plan",service_data:{days:rr},return_response:!0}),cs);this.emit(t.response)}catch(t){this.fail(Un(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:t,service_data:e})}catch(n){throw Un(n)}this.live||await this.refresh()}setRide(t,e,n,o,s){return this.call("set_ride",s===void 0?{event:t,side:e,driver:n,scope:o}:{event:t,side:e,driver:n,scope:o,stay:s})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:Nn(e),scope:n})}setLeaveBy(t,e,n){return this.call("set_leave_by",e==null?{event:t,scope:n}:{event:t,time:Nn(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}setPeople(t,e,n){return this.call("set_people",{event:t,people:e,scope:n})}watchChores(t){let e=!1,n=!1,o=async()=>{try{let l=await hs(this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:"get_chores",service_data:{},return_response:!0}),cs);if(e)return;n=!0,t(l.response??null)}catch{!e&&!n&&t(null)}},s=new St(this.conn,`${Ve}/chores/subscribe`,l=>{e||(n=!0,t(l.chores))},()=>void o());s.open();let r=setInterval(()=>{s.live||s.open()},Hn);return()=>{e=!0,clearInterval(r),s.close()}}watchLunch(t){let e=!1,n=!1,o=new St(this.conn,`${Ve}/lunch/subscribe`,r=>{e||(n=!0,t(r.lunch))},()=>{!e&&!n&&t(null)});o.open();let s=setInterval(()=>{o.live||o.open()},Hn);return()=>{e=!0,clearInterval(s),o.close()}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:t,service_data:e})}catch(n){throw Un(n)}}};var us={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},fs=i=>(...t)=>({_$litDirective$:i,values:t}),tn=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:ar}=os,gs=i=>i;var ms=()=>document.createComment(""),at=(i,t,e)=>{let n=i._$AA.parentNode,o=t===void 0?i._$AB:t._$AA;if(e===void 0){let s=n.insertBefore(ms(),o),r=n.insertBefore(ms(),o);e=new ar(s,r,i,i.options)}else{let s=e._$AB.nextSibling,r=e._$AM,l=r!==i;if(l){let d;e._$AQ?.(i),e._$AM=i,e._$AP!==void 0&&(d=i._$AU)!==r._$AU&&e._$AP(d)}if(s!==o||l){let d=e._$AA;for(;d!==s;){let h=gs(d).nextSibling;gs(n).insertBefore(d,o),d=h}}}return e},ze=(i,t,e=i)=>(i._$AI(t,e),i),lr={},bs=(i,t=lr)=>i._$AH=t,vs=i=>i._$AH,nn=i=>{i._$AR(),i._$AA.remove()};var ys=(i,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(i[o],o);return n},De=fs(class extends tn{constructor(i){if(super(i),i.type!==us.CHILD)throw Error("repeat() can only be used in text expressions")}dt(i,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],s=[],r=0;for(let l of i)o[r]=n?n(l,r):r,s[r]=e(l,r),r++;return{values:s,keys:o}}render(i,t,e){return this.dt(i,t,e).values}update(i,[t,e,n]){let o=vs(i),{values:s,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,s;let l=this.ut??=[],d=[],h,c,a=0,f=o.length-1,y=0,T=s.length-1;for(;a<=f&&y<=T;)if(o[a]===null)a++;else if(o[f]===null)f--;else if(l[a]===r[y])d[y]=ze(o[a],s[y]),a++,y++;else if(l[f]===r[T])d[T]=ze(o[f],s[T]),f--,T--;else if(l[a]===r[T])d[T]=ze(o[a],s[T]),at(i,d[T+1],o[a]),a++,T--;else if(l[f]===r[y])d[y]=ze(o[f],s[y]),at(i,o[a],o[f]),f--,y++;else if(h===void 0&&(h=ys(r,y,T),c=ys(l,a,f)),h.has(l[a]))if(h.has(l[f])){let m=c.get(r[y]),$=m!==void 0?o[m]:null;if($===null){let k=at(i,o[a]);ze(k,s[y]),d[y]=k}else d[y]=ze($,s[y]),at(i,o[a],$),o[m]=null;y++}else nn(o[f]),f--;else nn(o[a]),a++;for(;y<=T;){let m=at(i,d[T+1]);ze(m,s[y]),d[y++]=m}for(;a<=f;){let m=o[a++];m!==null&&nn(m)}return this.ut=r,bs(i,d),Me}});var sn=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function X(i){return sn[(i%sn.length+sn.length)%sn.length]}var on="#23272E",Fn="35,39,46";var dr=3,Dt=36,Wn=12,rn=8,xs=30,$e=16,At=100,lt=60,Vn=10,an=30,Gn=10,cr=150,hr=150,dn=1;function Ps(i,t){return i.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??Dt}function pr(i,t,e){return 10+10.2*i.length+(t?30+8*t.length:0)+8+12+6.8*e.length+12+4}var ur=26,Ss=4;function Yn(i,t){let e=Math.max(cr,hr/dn);return Math.ceil(lt+Math.max(0,i-1)*Vn+an+Math.max(0,t-1)*Gn+e*(i+dn*t))}function me(i){return i.people?i.people.kids.map(t=>t.id):i.days.length?Object.keys(i.days[0].kids):[]}function re(i){return i.people?i.people.drivers.map(t=>t.id):i.days.length?Object.keys(i.days[0].drivers):[]}function de(i){return new Map(me(i).map((t,e)=>[t,X(e)]))}function ne(i,t){let e=i.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of i.days)if(n.kids[t])return n.kids[t].name;return t}function ee(i,t){let e=i.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of i.days)if(n.drivers[t])return n.drivers[t].name;return t}function Xn(i,t){return t==="none"?"Not needed":re(i).includes(t)?ee(i,t):t}function As(i){return i.leave_by!=null&&i.leave_by>i.start&&i.leave_by<i.end?` · leave ${L(i.leave_by)}`:""}function cn(i){if(i.busy_why==="days"){if(i.start<=0&&i.end>=1440)return"All day";if(i.start<=0)return`Until ${L(i.end)}`;if(i.end>=1440)return`From ${L(i.start)}`}return`${L(i.start)}–${L(i.end)}`}function hn(i,t){return t.own?ee(i,t.own):ne(i,t.kid)}var dt={color:on,rgb:Fn,ink:on};function Ms(i,t){return t.own?dt:de(i).get(t.kid)??X(0)}function fr(i,t){let e=me(i);return t.along.map(n=>e.includes(n)?ne(i,n):ee(i,n))}function ct(i){return i.length<2?i.join(""):`${i.slice(0,-1).join(", ")} and ${i[i.length-1]}`}function gr(i){let t=new Map([["home","Home"]]);for(let e of i.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function ln(i,t){return t?i.get(t)??(t.split(",")[0]?.trim()||t):""}function Kn(i,t){let e=[];for(let n of i)n.type==="drive"?(e.length||e.push(ln(t,n.from)),e.push(ln(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(ln(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function mr(i){let t=i.map(r=>({...r,col:0,cols:1})).sort((r,l)=>r.s-l.s||l.en-r.en),e=[],n=[],o=-1/0,s=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(s(),o=-1/0);let l=n.findIndex(d=>d<=r.s);l<0?(l=n.length,n.push(r.en)):n[l]=r.en,r.col=l,e.push(r),o=Math.max(o,r.en)}return s(),t}function br(i,t){if(!i.length)return 0;if(t<=i[0].t)return i[0].y;for(let e=0;e<i.length-1;e++){let n=i[e],o=i[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return i[i.length-1].y}function vr(i,t){if(!i.length)return 0;if(t<=i[0].y)return i[0].t;for(let e=0;e<i.length-1;e++){let n=i[e],o=i[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return i[i.length-1].t}function Ds(i,t){return br(i.anchors,t)}function Zn(i,t){return vr(i.anchors,t)}function yr(i,t){let e=me(i),n=re(i),o=Math.max(t,Yn(e.length,n.length)),r=(o-lt-Math.max(0,e.length-1)*Vn-an-Math.max(0,n.length-1)*Gn)/(e.length+dn*n.length||1),l=Math.floor(r),d=Math.floor(r*dn),h=i.whole_week??i.days,c=new Map;for(let m of h)for(let $ of m.events)for(let k of $.own?$.along:[$.kid]){let u=c.get(k)??[];u.some(D=>D.event_id===$.event_id&&D.calendar_id===$.calendar_id)||u.push($),c.set(k,u)}let a=de(i),f=[],y=lt;e.forEach((m,$)=>{let k=c.get(m)??[],u=i.days.some(D=>D.events.some(R=>R.kid===m&&(R.sides.includes("drop")&&R.drop===""||R.sides.includes("pick")&&R.pick==="")));f.push({id:m,kind:"kid",x:y,w:l,name:ne(i,m),dot:a.get(m).color,rgb:a.get(m).rgb,sub:`${u?"Needs a ride · ":""}${k.length} this week`,subWarn:u}),y+=l+($<e.length-1?Vn:0)});let T=y+an/2;return y+=an,n.forEach((m,$)=>{let k=0,u=0;for(let D of h){let R=D.drivers[m];R&&(k+=R.outings.length,u+=R.drive??0)}f.push({id:m,kind:"driver",x:y,w:d,name:ee(i,m),dot:on,rgb:Fn,sub:`${k} ${k===1?"trip":"trips"} this week · ${Pt(u)} driving`,subWarn:!1}),y+=d+($<n.length-1?Gn:0)}),{columns:f,sepX:T,width:o}}function xr(i,t){let e=i.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),s=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!s)return e;let r=o.slice(s[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function ws(i,t){let e=i.start<=0,n=i.end>=1440;return e&&n?`${i.title} · all day`:n?`${i.title} from ${L(i.start)}`:e||!t?`${i.title} until ${L(i.end)}`:`${i.title} ${L(i.start)}–${L(i.end)}`}function Jn(i){return i.issues.filter(t=>t.level==="problem").length+i.clashes.length+(i.unplaced?.length??0)}function Qn(i,t){let e=we(t,i);return e===0?"Today":e===1?"Tomorrow":""}function Z(i,t=0){return i==null||!Number.isFinite(i)?t:i}function qn(i,t,e=7){let n=Math.max(8,Math.floor(t/e)),o=1,s=0;for(let r of i.split(/\s+/).filter(Boolean)){let l=r.length;for(s===0?s=l:s+1+l<=n?s+=1+l:(o++,s=l);s>n;)o++,s-=n}return o}var Ls=25,wr=15,Rs=3;function $s(i){return Math.max(0,Math.min(Rs,Math.floor((i-Ls)/wr)))}var $r=Ls+2,ks=20;function Ts(i){return/^(\d+:\d\d)\s+Home$/.exec(i.at(-1)??"")?.[1]??null}var Mt="🚗";function Es(i,t){if(i===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,s,r,l=!1)=>({at:o,who:s,stays:l,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(i))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(i))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with |With )(.+?)(, .+)?$/.exec(i))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(i))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(i))return e("",n[1],n[2])}return null}var Cs={muted:0,normal:1,pending:2,problem:3};function js(i){let{drop:t,pick:e}=i,n=t?Es(t.text,"drop"):null,o=e?Es(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return i;let s=[t,e].reduce((d,h)=>h&&(Cs[h.tone]??1)>(Cs[d]??1)?h.tone:d,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${Mt} No rides yet`,tone:s},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let d=`${Mt} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${d} both ways`,tone:s},pick:null}:!n.at||!o.at?{drop:{text:`${d} both ways · ${n.at?`↓${n.at}`:`↑${o.at}`}`,tone:s},pick:null}:{drop:{text:`${d} ↓${n.at} ↑${o.at}`.trimEnd(),tone:s},pick:null}}let r=(d,h)=>d==="needed"?`${h} needed`:`${h}${d.at?`${d.at} `:" "}${d.who}${d.stays?" stays":""}${d.extra}`,l=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${Mt} ${l.join(" · ")}`,tone:s},pick:null}}function _s(i,t){let e=t-23,n=`${L(i.start)}–${L(i.end)}`+(i.arrive_by!=null?` · arrive ${L(i.arrive_by)}`:"")+As(i),o=33+qn(n,e,6.6)*16,s=i.own?i.lines:js(i.lines);for(let r of[s.drop,s.pick])r&&(o+=2+qn(r.text,e,7)*16);return o+4}function Is(i,t,e,n){let o=t==="compact",{columns:s,sepX:r,width:l}=yr(i,e),d=new Map(s.map(u=>[u.id,u])),h=me(i),c=re(i),a=[...h,...c],f=de(i),y=gr(i),T=u=>ne(i,u),m=u=>ee(i,u),$={mode:t,width:l,height:0,columns:s,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},k=0;return i.days.forEach((u,D)=>{let R=D*1440,H=new Map(u.events.map(b=>[b.id,b])),te=b=>b&&H.has(b)?{day:u.date,event:b}:null,ae=Jn(u),B=u.events.length,Ee=Qn(u.date,n.date),ce=be(u.date),Oe=(B?`${B} ${B===1?"activity":"activities"}${u.done?" left":""}`:u.done?"All done for today":"Nothing scheduled")+(ae?` · ${ae} to sort out`:""),ue=Cr(i,u,f,l,l-pr(ce,Ee,Oe));$.dayHeads.push({date:u.date,y:k,label:ce,tag:Ee,sub:Oe,warn:ae>0,h:Dt+(ue&&ue.h?ue.h+Ss+2:0),allDay:ue?.chips??[],inline:ue?.inline??0}),$.anchors.push({t:R,y:k});let Be=$.dayHeads[$.dayHeads.length-1],he=k+Be.h+Wn,et=c.flatMap(b=>u.drivers[b]?.outings??[]);if(!B&&!et.length){$.empties.push({key:u.date,y:he,text:u.done?"Nothing else today":"Nothing planned"}),k=he+40,$.anchors.push({t:R+1439,y:k});return}let Ce=(b,w,g,v,E,P,C,M=b.kid)=>{let j=!!b.own&&M===b.own,A=!!b.own&&M!==b.own,G=j?dt:f.get(M)??X(0),N=j?m(M):T(M),J=A?{drop:{text:`${C?`${Mt} `:""}With ${m(b.own)}`,tone:b.attending===!1?"muted":"normal"},pick:null}:C&&!b.own?js(b.lines):b.lines,Q=j?fr(i,b):[],it=(b.takes!=null?`${b.takes} min, any time ${L(b.start)}–${L(b.end)}`:cn(b)+(b.arrive_by!=null?` · arrive ${L(b.arrive_by)}`:"")+As(b))+(Q.length?` · with ${ct(Q)}`:"");return{key:`${u.date}|card|${b.id}`+(b.own?`|${M}`:""),x:w,y:g,w:v,h:E,target:{day:u.date,event:b.id},event:b,color:G,kidName:N,clash:P,stayed:!b.own&&b.stay&&c.includes(b.drop),skipped:b.attending===!1,title:xr(b.title,N),time:it,drop:J.drop,pick:J.pick,showDrop:!!J.drop&&(C||E>=56),showPick:!!J.pick&&(C||E>=74),wrap:C,aria:`${N}, ${b.title} ${b.takes!=null?`any time from ${L(b.start)} to ${L(b.end)}`:cn(b).replace("–"," to ")}. `+(b.attending===!1&&!J.drop?"Not attending. ":"")+[J.drop,J.pick].filter(Pe=>!!Pe).map(Pe=>Pe.text).join(". ")}},Re=b=>{let w=u.rides[b];return w?(u.drivers[w.driver]?.segments??[]).filter(v=>v.type!=="home"&&v.kids.includes(w.kid)&&Z(v.start)>=Z(w.start)&&Z(v.end)<=Z(w.end)):[]},tt=b=>{let w=u.rides[b];if(!w)return null;let g=w.serves.find(v=>H.get(v)?.kid===w.kid);return te(g??w.serves[0])},se=(b,w)=>{if(w.event)return w;let g=u.events.find(v=>v.own&&v.own!==b&&v.along.includes(b)&&v.title===w.title);return g?{...w,title:`${w.title} with ${m(g.own)}`}:w},je=b=>{if(b.takes==null)return[b.start,b.end];let w=b.planned??b.start;return[w,w+b.takes]},ye=new Map;for(let b of u.issues)b.level!=="problem"||!b.event||(b.kind==="late"&&ye.set(b.event,`${Math.round(Z(b.minutes))} min late`),b.kind==="waiting"&&ye.set(`${b.event}|pick`,`Waits ${Math.round(Z(b.minutes))} min`));if(!o){let b=1/0,w=-1/0;for(let A of u.events)A.start<=0&&A.end>=1440||(A.start>0?b=Math.min(b,A.start-20,A.arrive_by!=null?A.arrive_by-10:1/0):b=Math.min(b,A.end-30),A.end<1440?w=Math.max(w,A.end+20):w=Math.max(w,A.start+30));for(let A of et)A.start!=null&&(b=Math.min(b,A.start)),A.end!=null&&(w=Math.max(w,A.end));let g=u.from;g!=null&&Number.isFinite(b)&&b<g+60?b=g-15:u.date===n.date&&Number.isFinite(b)&&n.minutes>b-60&&n.minutes<w&&(b=Math.min(b,n.minutes-15));let v=Number.isFinite(b)?Math.floor((b-5)/30)*30:900,E=Math.max(Number.isFinite(w)?Math.ceil((w+5)/30)*30:960,v+60),P=A=>g!=null&&Z(A)<=v,C=A=>g!=null&&Z(A)<v,M=A=>Math.round(he+(Math.max(v,Math.min(E,A))-v)*dr);$.anchors.push({t:R+v,y:M(v)},{t:R+E,y:M(E)});for(let A of h){let G=d.get(A),N=f.get(A),J=(u.kids[A]?.items??[]).filter(_=>_.start!=null&&_.end!=null&&!P(_.end)).map(_=>({item:_,s:Z(_.start),en:Z(_.end)})),Q=[];for(let _ of mr(J)){let I=G.w/_.cols,z=Math.round(G.x+_.col*I),U=Math.round(I-(_.cols>1?4:0)),V=M(_.s),F=_.item;if(F.type==="act"){let pe=H.get(F.event??"");if(!pe)continue;let Ut=Math.max(30,M(_.en)-V),st=Ce(pe,z,V,U,Ut,F.clash,!1,A);if(st.layer=At,st.cut=C(_.s),$.cards.push(st),pe.arrive_by!=null&&pe.start-pe.arrive_by>=5&&!st.cut){let _n=M(pe.arrive_by),Hi={key:`${u.date}|prep|${pe.id}`,x:z,y:_n,w:U,h:V-_n+$e,color:N,label:`Arrive by ${L(pe.arrive_by)}`,layer:At-1};$.preps.push(Hi),Q.push({s:pe.arrive_by,en:_.en,top:_n,bottom:V+Ut,x:z,w:U,prep:Hi,card:st})}else Q.push({s:_.s,en:_.en,top:V,bottom:V+Ut,x:z,w:U,card:st});let Bi=ye.get(pe.id);Bi&&$.marks.push({key:`${u.date}|late|${pe.id}`,x:z+U-4,y:V+4,text:Bi,right:!0});let Ni=ye.get(`${pe.id}|pick`);Ni&&$.marks.push({key:`${u.date}|wait|${pe.id}`,x:z+4,y:V+Ut+2,text:Ni,right:!1});continue}let O=u.rides[F.ride??-1];if(!O)continue;let xe=Math.max(22,M(_.en)-V),vt=Kn(Re(O.index),y),Ii=m(O.driver),zi={key:`${u.date}|ride|${O.index}`,x:z,y:V,w:U,h:xe,target:tt(O.index),l1:`${O.own?"In":"Along in"} ${Ii}’s car`,l2:vt.join(" → "),show2:$s(xe)>0,lines2:$s(xe),dashed:!O.own,clash:F.clash,aria:`${T(A)} ${O.own?"in":"riding along in"} ${Ii}’s car, ${L(Z(O.start))} to ${L(Z(O.end))}: ${vt.join(" to ")}`};$.rides.push(zi);let Oi=d.get(O.driver),Cn=null;Oi&&(Cn={key:`${u.date}|band|${O.index}`,x:z+U,y:V,w:Math.max(0,Oi.x+8-(z+U)),h:xe,color:N},$.bands.push(Cn)),Q.push({s:_.s,en:_.en,top:V,bottom:V+xe,x:z,w:U,ride:zi,band:Cn})}let it=_=>_.ride?.layer??(_.prep?At-1:At),Pe=(_,I,z,U)=>{z>$e&&$.links.push({key:`${_.key}|link`,x:_.x,y:I,w:_.w,h:z,color:N,layer:U})},S=(_,I)=>{if(!(I.x<_.x||I.x+I.w>_.x+_.w)&&(_.x=I.x,_.w=I.w,_.ride.x=I.x,_.ride.w=I.w,_.band)){let z=_.band.x+_.band.w;_.band.x=I.x+I.w,_.band.w=Math.max(0,z-_.band.x)}},q=new Set;for(let _ of[...Q].sort((I,z)=>z.s-I.s)){let I=_.ride;if(!I)continue;let z=Q.filter(F=>F!==_&&F.s>=_.en&&F.s-_.en<=xs&&F.top>=_.bottom).sort((F,O)=>F.s-O.s||F.top-O.top)[0];if(!z)continue;q.add(_),S(_,z);let U=it(z),V=z.top-_.bottom;Pe(I,_.bottom,V+$e,U-1),I.layer=U-(V>0?2:1),I.h+=$e,I.tuckBottom=$e}for(let _ of[...Q].sort((I,z)=>I.s-z.s)){let I=_.ride;if(!I||q.has(_))continue;let z=Q.filter(F=>F!==_&&F.en<=_.s&&_.s-F.en<=xs&&F.bottom<=_.top&&(F.card||F.ride?.layer!=null)).sort((F,O)=>O.en-F.en||O.bottom-F.bottom)[0];if(!z)continue;S(_,z);let U=z.ride?.layer??At,V=_.top-z.bottom;Pe(I,z.bottom-$e,V+$e,U-1),I.layer=U-(V>0?2:1),I.y-=$e,I.h+=$e,I.tuckTop=$e}}for(let A of c){let G=d.get(A),N=u.drivers[A];if(!N)continue;let J=[],Q=null;for(let S of N.segments)if(!(S.start==null||S.end==null)){if(S.type==="home"){Q=null;continue}if(S.type==="stay"){Q=null,J.push({type:"stay",g:S,s:S.start,en:S.end});continue}Q&&Q.en===S.start?(Q.en=S.end,Q.legs.push(S)):(Q={type:"trip",s:S.start,en:S.end,legs:[S]},J.push(Q))}let it=new Set,Pe=(S,q,_,I)=>{it.add(S.id);let z=M(q),U=Ce(S,G.x+8,z,G.w-16,Math.max(30,M(_)-z),!1,!1,A);U.cut=C(q),I&&U.drop?.tone==="normal"&&(U.drop=null,U.showDrop=!1),$.cards.push(U)};for(let S of J){if(P(S.en))continue;let q=M(S.s),_=Math.max(24,M(S.en)-q);if(S.type==="stay"){let O=H.get(S.g.event??S.g.serves??"");if(O?.own===A){Pe(O,S.s,S.en,!0);continue}let xe=O?f.get(O.kid)??X(0):X(0),vt=S.g.kids.map(T);$.stays.push({cut:C(S.s),key:`${u.date}|stay|${A}|${S.s}`,x:G.x+8,y:q,w:G.w-16,h:_,target:te(O?.id),color:xe,l1:O?`At ${O.title} with ${T(O.kid)}`:"Staying",l2:`until ${L(S.en)}`+(vt.length?` · ${vt.join(" and ")} too`:"")});continue}let I=S.legs[0],z=S.legs[S.legs.length-1],U=[];for(let O of S.legs)for(let xe of O.kids)U.includes(xe)||U.push(xe);let V=z.type==="drive"&&z.to==="home",F=Kn(S.legs,y);$.trips.push({key:`${u.date}|trip|${A}|${S.s}`,x:G.x+8,y:q,w:G.w-16,h:_,target:te(S.legs.find(O=>O.serves)?.serves),l1:I.type==="drive"&&I.from==="home"?`Leave ${L(S.s)}`:`From ${ln(y,I.from??I.place)} ${L(S.s)}`,l2:F.join(" → "),show2:_>=36,l3:V?`Home ${L(S.en)}`:"",show3:V&&_>=62,stops:null,kids:U.map(O=>(f.get(O)??X(0)).color),bad:S.legs.some(O=>O.overlaps_busy),aria:`${m(A)} drives ${F.join(" to ")}, ${L(S.s)} to ${L(S.en)}`})}for(let S of N.segments)if(!(!S.overlaps_busy||S.start==null||S.end==null))for(let q of N.busy){let _=Math.max(S.start,q.start),I=Math.min(S.end,q.end);I<=_||P(I)||$.overlaps.push({key:`${u.date}|overlap|${A}|${_}`,x:G.x+6,y:M(_)-2,w:G.w-12,h:Math.max(8,M(I)-M(_)+4)})}for(let S of u.events)if(S.own===A&&(!it.has(S.id)&&!P(je(S)[1])&&Pe(S,...je(S),!1),S.takes!=null&&S.attending!==!1&&!P(S.end))){let q=M(S.start);$.windows.push({key:`${u.date}|window|${S.id}`,x:G.x+4,y:q,w:G.w-8,h:Math.max(24,M(S.end)-q),label:`${S.title} · any time ${L(S.start)}–${L(S.end)}`})}for(let S of N.busy){if(S.event||S.end<=v||S.start>=E)continue;let q=se(A,S),_=M(q.start),I=M(q.end);$.busy.push({key:`${u.date}|busy|${A}|${q.start}`,x:G.x+1,y:_,w:G.w-2,h:I-_,labelY:8,label:ws(q,!1)})}}let j=-1/0;for(let A=v;A<=E;A+=30)$.grid.push({key:`${u.date}|grid|${A}`,y:M(A),strong:A%60===0}),A%60===0&&M(A)-j>=22&&($.hours.push({key:`${u.date}|hour|${A}`,y:M(A)-8,label:ds(A)}),j=M(A));u.date===n.date&&n.minutes>v&&n.minutes<E&&($.now={y:M(n.minutes),label:`Now ${L(n.minutes)}`}),k=M(E)+Wn;return}let K=[];for(let b of h){let w=d.get(b);for(let g of u.kids[b]?.items??[])if(g.start!=null){if(g.type==="act"){let v=H.get(g.event??"");if(!v)continue;K.push({col:b,s:g.start,h:_s(v,w.w),kind:"act",item:g})}else if(!u.rides[g.ride??-1]?.own){let v=u.rides[g.ride??-1],E=v?u.drivers[v.driver]?.outings.find(P=>P.start!=null&&P.start<=Z(v.start)&&Z(v.start)<=Z(P.end,P.start)):void 0;K.push({col:b,s:E?.start??g.start,h:$r,kind:"along",item:g})}}}for(let b of c){let w=u.drivers[b];if(!w)continue;for(let v of w.busy)v.event||K.push({col:b,s:v.start,h:32,kind:"busy",busy:se(b,v)});let g=d.get(b).w;for(let v of u.events)v.own!==b||!v.busy_only&&v.attending!==!1&&(v.takes==null||v.planned!=null)||K.push({col:b,s:je(v)[0],h:_s(v,g),kind:"own",event:v});for(let v of w.outings){if(v.start==null)continue;let P=[...Ts(v.lines)?v.lines.slice(0,-1):v.lines,...v.warn?[v.warn]:[]].reduce((C,M)=>C+qn(M,g-36,7),0);K.push({col:b,s:v.start,h:30+P*16,kind:"out",out:v})}}K.sort((b,w)=>b.s-w.s||a.indexOf(b.col)-a.indexOf(w.col));let le=new Map,oe=[],fe=new Map,nt=he-ks;for(let b=0;b<K.length;){let w=b,g=nt+ks;for(;w<K.length&&K[w].s===K[b].s;w++){let E=le.get(K[w].col);E!=null&&(g=Math.max(g,E+rn))}let v=new Set;for(let E=b;E<w;E++){let P=K[E],C=v.has(P.col)?le.get(P.col)+rn:g;v.add(P.col),le.set(P.col,C+P.h)}fe.set(K[b].s,g),K[b].s>0&&$.hours.push({key:`${u.date}|hour|${K[b].s}`,y:g+2,label:Ie(K[b].s)}),nt=g,b=w}le.clear(),K.forEach((b,w)=>{let g=le.get(b.col),v=Math.max(g!=null?g+rn:he,fe.get(b.s));le.set(b.col,v+b.h);let E=b.kind==="busy"?b.busy.end:b.kind==="act"?H.get(b.item.event??"")?.end??null:b.kind==="own"?je(b.event)[1]:null;oe.push({col:b.col,s:b.s,end:E,y:v,h:b.h,box:null}),$.anchors.push({t:R+b.s,y:v});let P=d.get(b.col);if(b.kind==="busy"){let C={key:`${u.date}|busy|${b.col}|${w}`,x:P.x+1,y:v,w:P.w-2,h:b.h,labelY:8,label:ws(b.busy,!0)};$.busy.push(C),oe[oe.length-1].box=C}else if(b.kind==="out"){let C=b.out,M=Ts(C.lines),j=M?C.lines.slice(0,-1):C.lines;$.trips.push({key:`${u.date}|trip|${b.col}|${w}`,x:P.x+8,y:v,w:P.w-16,h:b.h,target:te(C.target),l1:M?`${C.lead} · home ${M}`:C.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...j.map(A=>({text:A,warn:!1})),...C.warn?[{text:C.warn,warn:!0}]:[]],kids:C.kids.map(A=>(f.get(A)??X(0)).color),bad:!!C.warn,aria:`${m(b.col)}: ${C.lead}. ${C.lines.join(". ")}${C.warn?`. ${C.warn}`:""}`})}else if(b.kind==="own"){let C=Ce(b.event,P.x+8,v,P.w-16,b.h,!1,!0,b.col);$.cards.push(C),oe[oe.length-1].box=C}else if(b.kind==="act"){let C=H.get(b.item.event??""),M=Ce(C,P.x,v,P.w,b.h,b.item.clash,!0,b.col);$.cards.push(M),oe[oe.length-1].box=M}else{let C=u.rides[b.item.ride??-1],M=Kn(Re(C.index),y),j=m(C.driver);$.rides.push({key:`${u.date}|ride|${C.index}`,x:P.x,y:v,w:P.w,h:b.h,target:tt(C.index),l1:`${Mt} with ${j}`,l2:M.join(" → "),show2:!1,lines2:Rs,dashed:!0,clash:b.item.clash,aria:`${T(b.col)} riding along with ${j}, ${L(Z(C.start))} to ${L(Z(C.end))}: ${M.join(" to ")}`})}});let _e=he;for(let b of le.values())_e=Math.max(_e,b);for(let b of oe){if(!b.box||b.end==null)continue;let w=b.y+b.h;for(let g of oe)g.col!==b.col&&g.s>=b.s&&g.s<b.end&&(w=Math.max(w,g.y+g.h));b.end>=1440&&(w=_e);for(let g of oe)g.col===b.col&&g.y>b.y&&(w=Math.min(w,g.y-rn));w=Math.min(w,_e),w>b.y+b.h&&(b.box.h=w-b.y)}k=_e+Wn+6,$.anchors.push({t:R+1439,y:k})}),$.height=k,$}var kr=["","¼","½","¾"];function Ge(i){return i.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return Pt(n);let o=Math.round(n*4),s=Math.floor(o/4),r=kr[o%4];return`${s||!r?s:""}${r} min`})}function zs(i){let t=e=>e?{...e,text:Ge(e.text)}:null;return{...i,days:i.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(s=>({...s,lines:s.lines.map(Ge),warn:s.warn==null?s.warn:Ge(s.warn)}))}])),issues:e.issues.map(n=>({...n,title:Ge(n.title),body:Ge(n.body),note:n.note==null?n.note:Ge(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:Ge(o.note)}))}:{}}))}))}}var Tr=2,Er=48;function Os(i,t,e=Er){let n=[],o=new Set(re(i)),s=me(i).map(f=>ne(i,f)),r=s.length>1?s.slice(0,2):[s[0]??"Ava","Ben"],l=0,d=0,h=0,c=0,a=t.minutes+e*60;for(let f of i.days){let y=we(t.date,f.date),T=y===0?"":`${ie(f.date)} · `,m=new Map(f.events.map(u=>[u.id,u])),$=u=>u&&m.has(u)?{day:f.date,event:u}:null,k=(u,D)=>y*1440+(u??m.get(D??"")?.start??0)<a;for(let u of f.issues)if(u.level==="problem"){if(!k(u.at,u.event)){h++,u.kind==="unassigned"&&c++;continue}l++,u.kind==="unassigned"&&d++,n.push({key:`${f.date}|${u.key}`,tone:u.kind==="unassigned"?"unassigned":"problem",title:T+u.title,body:u.body,target:$(u.event),suggestions:(u.suggestions??[]).map(D=>({id:D.id,label:D.label,note:D.note}))})}if(f.clashes.forEach((u,D)=>{if(!k(u.a.start,u.a.event)){h++;return}l++;let R=m.get(u.a.event??""),H=ne(i,u.kid),te=(B,Ee)=>{let ce=$(Ee);return ce?{text:B,target:ce}:B},ae=[];if(u.b.type==="act"){let B=m.get(u.b.event??"");R&&B&&(ae=[te(R.title,R.id),` ${L(R.start)}–${L(R.end)} and `,te(B.title,B.id),` ${L(B.start)}–${L(B.end)} overlap.`])}else{let B=f.rides[u.b.ride??-1];R&&B&&(ae=[`${H} is in `,te(`${ee(i,B.driver)}’s car`,B.serves[0]),` ${L(Z(u.b.start))}–${L(Z(u.b.end))}, during `,te(R.title,R.id),"."])}n.push({key:`${f.date}|clash|${D}`,tone:"problem",title:`${T}${H} is double-booked`,body:ae.map(B=>typeof B=="string"?B:B.text).join(""),parts:ae,target:null,suggestions:[]})}),y>=0&&y<Tr)for(let u of f.issues)u.level!=="heads_up"||!k(u.at,u.event)||n.push({key:`${f.date}|${u.key}`,tone:"heads_up",title:T+u.title,body:u.body,target:$(u.event),suggestions:[]});for(let u of f.unplaced??[]){if(!k(u.at)){h++;continue}l++;let D=u.people.map(H=>o.has(H)?ee(i,H):ne(i,H)),R=u.from_notes?"The For line in its notes":"Its title";n.push({key:`${f.date}|unplaced|${u.id}`,tone:"problem",title:`${T}${L(u.at)} ${u.title}: ${Bs(u).toLowerCase()}`,body:u.reason==="unknown"&&u.word?`${R} names “${u.word}”, who isn’t anyone in the family, so ${D.length?`it’s only in ${ct(D)}’s lane`:"it isn’t on the board"}. Tap to pick who it’s for.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Tap to pick who it’s for, or start the title in Google Calendar with a name, such as “${r[0]} Piano”.`,target:null,suggestions:[],pick:{day:f.date,id:u.id}})}for(let u of f.events)!u.problems.length||!k(u.start)||n.push({key:`${f.date}|notes|${u.id}`,tone:"heads_up",title:`${T}Check the notes on ${hn(i,u)}’s ${u.title}`,body:`These lines couldn’t be read: ${u.problems.join("; ")}`,target:$(u.id),suggestions:[]})}return{items:n,problems:l,unassigned:d,later:h,laterUnassigned:c}}function Bs(i){return i.reason==="unknown"&&i.word?`Who is “${i.word}”?`:"Who is this for?"}function Cr(i,t,e,n,o=0){let s=new Set(re(i)),r=T=>{let m=T[0];return m==null?null:s.has(m)?dt:e.get(m)??null},l=[...(t.all_day??[]).map(T=>({key:`${t.date}|allday|${T.id}`,title:T.title,note:T.days>1?`Day ${T.day_number} of ${T.days}`:"",color:r(T.people),cancelled:T.cancelled,warn:!1,pick:null,notes:T.notes??""})),...(t.unplaced??[]).map(T=>({key:`${t.date}|unplaced|${T.id}`,title:`${L(T.at)} ${T.title}`,note:Bs(T),color:null,cancelled:!1,warn:!0,pick:T.id,notes:T.notes??""}))];if(!l.length)return null;let d=Math.max(120,n-lt),h=(T,m=7)=>30+m*T.title.length+(T.note?Math.min(m,5.6)*(T.note.length+2):0)+(T.notes?16:0),c=0,a=0;for(;c<l.length&&a+h(l[c],6.4)<=o;)a+=h(l[c++],6.4);let f=0;a=0;for(let T of l.slice(c)){let m=Math.min(d,h(T));(!f||a+m>d)&&(f++,a=0),a+=m}let y=f?f*ur+(f-1)*Ss:0;return{key:`${t.date}|allday`,h:y,chips:l,inline:c}}function Ns(i,t){let e=de(i),n=null,o=s=>s.ahead>0?2:s.ongoing?1:0;for(let s of i.days){let r=we(t.date,s.date);if(!(r<0))for(let l of re(i))for(let d of s.drivers[l]?.outings??[]){if(d.start==null)continue;let h=r*1440+d.start;if(r*1440+Z(d.end,d.start)<=t.minutes)continue;let a=h-t.minutes,f={driver:l,name:ee(i,l),date:s.date,ahead:r,start:d.start,inMinutes:a,ongoing:a<=0,lead:d.lead,stop:(d.lines[0]??"").replace(/\s+/g," ").trim(),kids:d.kids.map(y=>e.get(y)??X(0)),warn:d.warn,target:d.target&&s.events.some(y=>y.id===d.target)?{day:s.date,event:d.target}:null};(!n||o(f)<o(n)||o(f)===o(n)&&f.inMinutes<n.inMinutes)&&(n=f)}}return n}function ht(i){return i.state==="done"||i.state==="late"}var _r=780;function Pr(i,t,e){return i.state==="open"&&!!i.for_day&&i.due===t&&e<_r}function Hs(i,t){return i.chores.map(e=>Pr(e,i.today,t)?{...e,state:"upcoming",shows_from:i.today}:e)}function Us(i){return i.state==="open"||i.state==="overdue"}function ni(i,t,e){if(ht(i)){let n=i.done_at?Sr(i.done_at,t,e):"";return i.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(i.state==="overdue")return i.missed>1?`Missed ${i.missed} times`:i.due?`Missed ${ei(i.due,t)}`:"Missed";if(i.state==="upcoming"){if(i.for_day)return`From 1 PM · for ${ei(i.for_day,t)}`;let n=i.shows_from??i.due;if(!i.due||!n||i.due<=n)return"";let o=we(t,i.due);return`By ${o===1?"tomorrow":o<7?ie(i.due):ti(i.due)}`}if(i.for_day&&i.due===t)return`Tonight · for ${ei(i.for_day,t)}`;if(i.due&&i.due>t){let n=we(t,i.due);return n===1?"By tomorrow":`By ${n<7?ie(i.due):ti(i.due)}`}return i.missed?`Today · missed ${i.missed===1?"once":`${i.missed} times`} before`:"Today"}function ei(i,t){let e=we(t,i);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?ie(i):ti(i)}function ti(i){let[t,e,n]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Sr(i,t,e){let n=new Date(i);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let s=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return s===t?r:`${ie(s)} ${r}`}function Fs(i,t,e=1440){let n=Hs(i,e).sort((o,s)=>o.order-s.order);return i.kids.map((o,s)=>{let r=n.filter(c=>c.kid===o.id),l=new Map;for(let c of r){if(c.state!=="upcoming")continue;let a=c.shows_from??c.due??i.today;l.set(a,[...l.get(a)??[],c])}let d=r.filter(c=>c.state==="overdue"),h=r.filter(c=>c.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??X(s),overdue:d,now:h,done:r.filter(ht),later:[...l.entries()].sort(([c],[a])=>c.localeCompare(a)).map(([c,a])=>({date:c,chores:a})),left:d.length+h.length}})}function Ws(i,t=1440){return Hs(i,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=i.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function ii(i){return!i.chores.length&&!i.templates.length}var qe=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function si(i){let t=i.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,s]=n.split("-").map(r=>qe.indexOf(r.trim()));if(o===void 0||o<0||s!==void 0&&s<0)return null;if(s===void 0)e.add(o);else for(let r=0;r<=(s-o+7)%7;r++)e.add((o+r)%7)}return e}function oi(i){let t=[...new Set(i)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${qe[n[0]]}-${qe[n.at(-1)]}`]:n.map(o=>qe[o])).join(", ")}var Ye="none";function pn(i){return i==="daily"||i==="school"?"":"Any"}function Ks(i=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:i,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function Vs(i){let t=i.days??pn(i.repeats),e=i.repeats==="daily"&&t!=="";return{template:i.id,repeats:e?"weekly":i.repeats,title:i.title,icon:i.icon,details:i.details??"",who:[...i.who],take_turns:!!i.take_turns,days:t,every:!e&&i.every&&i.every>0?i.every:1,paused:i.paused,night_before:!!i.night_before,bring_only:!!i.bring_only}}function ri(i){return i.title.trim()?i.who.length?i.days===Ye?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function Gs(i){return{...i.template?{template:i.template}:{},repeats:i.repeats,title:i.title.trim(),icon:i.icon??"",details:i.details.trim(),who:i.who,take_turns:i.take_turns&&i.who.length>1,days:i.repeats==="daily"?"":i.days,every:i.repeats==="school"?1:i.every,paused:i.paused,...i.repeats==="school"?{night_before:i.night_before,bring_only:i.bring_only}:{}}}function ai(i){let t=i%100;return t>=11&&t<=13?`${i}th`:`${i}${{1:"st",2:"nd",3:"rd"}[i%10]??"th"}`}function li(i,t,e=1,n=!1,o=!1){if(i==="school"){let c=t.trim().replace(/-/g,"–"),a=o?c?`${c} Bring lunch days`:"Bring lunch days":c?`${c} school days`:"Every school day";return n?`${a}, the night before`:a}let s={daily:"day",weekly:"week",monthly:"month"}[i],r=e>1?`every ${e} ${s}s`:`each ${s}`,l=t.trim();if(i==="daily")return e>1?`Every ${e} days`:"Every day";if(i==="weekly"&&/^mon\s*-\s*sun$/i.test(l))return e>1?`Every day, every ${e} weeks`:"Every day";if(!l||l.toLowerCase()==="any")return`Sometime ${r}`;if(i==="weekly")return`${l.replace(/-/g,"–")} ${r}`;let h=`${l.split(",").map(c=>{let a=c.trim();return a.toLowerCase()==="last"?"the last day":/^\d+$/.test(a)?`the ${ai(Number(a))}`:`the ${a}`}).join(" and ")} ${r}`;return h[0].toUpperCase()+h.slice(1)}function di(i,t,e=!1){let n=i.map(s=>t.find(r=>r.id===s)?.name??s);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function ci(i){let t=i.indexOf(":"),e=t<0?i:i.slice(0,t),n=t<0?"":i.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function un(i,t){return`${i}|${t}`}function pt(i,t){let[e,n,o]=i.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function fn(i){let[t,e,n]=i.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function qs(i,t){return i.days_off.find(e=>e.first<=t&&t<=e.last)??null}function Ys(i,t){return fn(t)<5&&!qs(i,t)}function Lt(i,t,e=new Map){if(!Ys(i,t))return null;let n=un(i.id,t);if(e.has(n)){let s=e.get(n);return s?{lunch:s,picked:!0}:{lunch:i.default,picked:!1}}let o=i.picks[t];return o?{lunch:o,picked:!0}:{lunch:i.default,picked:!1}}function ut(i,t){return Ys(i,t)?i.menus?.[t]??null:null}var Ar="From the school's menu feed.";function Mr(i){let t=i.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==Ar);return t.length?t.join(`
`):null}function ke(i){return i.slice(0,7)}function gn(i){let[t,e]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function hi(i,t=1){let[e,n]=i.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function Xs(i){let t=[];for(let e=ke(i.first);e<=ke(i.last);e=hi(e))t.push(e);return t}function Zs(i,t,e,n=new Map){let o=`${e}-01`,s=pt(o,-fn(o)),r=[];for(;ke(s)<=e;){let l=[];for(let d=0;d<5;d++){let h=pt(s,d),c=ke(h)!==e,a=c?null:qs(t,h),f=c?null:Lt(t,h,n);l.push({date:h,day:Number(h.slice(8)),outside:c,off:a?a.title:null,lunch:f?.lunch??null,picked:f?.picked??!1,menu:c?null:ut(t,h)?.dish??null,sides:c?null:Mr(ut(t,h)?.details??""),past:h<i.today,today:h===i.today})}l.some(d=>!d.outside)&&r.push(l),s=pt(s,7)}return r}function Js(i){return i.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function Qs(i){let t=0,e=0;for(let n of i.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function eo(i,t,e,n=new Map){let o=e<780?0:1;for(let s=o;s<8;s++){let r=pt(t,s),l=Lt(i,r,n);if(!l)continue;let d=we(t,r);return{lunch:l.lunch,when:d===0?"today":d===1?"tomorrow":ie(r),date:r,menu:ut(i,r)?.dish??null}}return null}var Dr={timeline:"timeline",full:"timeline",compact:"compact"};function Rt(i){let t=new URLSearchParams(i),e={},n=Dr[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((t.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((t.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}function pi(i,t=0){return i==null||!Number.isFinite(i)?t:i}function Lr(i,t){let e=t.takes!=null&&t.planned!=null?t.planned+t.takes:t.end;if(t.attending===!1)return t.end;for(let n of i.rides)n.serves.includes(t.id)&&n.end!=null&&(e=Math.max(e,n.end));for(let n of Object.values(i.drivers))for(let o of n.segments)o.type==="home"||o.end==null||(o.serves===t.id||o.event===t.id)&&(e=Math.max(e,o.end));return e}function Rr(i,t){let e=[],n=[],o=()=>{let s=n[n.length-1];s&&pi(s.end)>t&&e.push(...n),n=[]};for(let s of i){if(s.start==null||s.end==null)continue;if(s.type==="home"||s.type==="stay"){o(),s.end>t&&e.push(s);continue}let r=n[n.length-1];r&&r.end!==s.start&&o(),n.push(s)}return o(),e}function jr(i,t){let e=new Set(i.events.filter(s=>Lr(i,s)<=t).map(s=>s.id)),n=s=>pi(i.rides[s??-1]?.end,-1)<=t,o=s=>s.type==="act"?e.has(s.event??""):n(s.ride);return{...i,events:i.events.filter(s=>!e.has(s.id)),kids:Object.fromEntries(Object.entries(i.kids).map(([s,r])=>[s,{...r,items:r.items.filter(l=>!o(l))}])),drivers:Object.fromEntries(Object.entries(i.drivers).map(([s,r])=>[s,{...r,segments:Rr(r.segments,t),outings:r.outings.filter(l=>l.start==null||pi(l.end,l.start)>t),busy:r.busy.filter(l=>l.end>t)}])),clashes:i.clashes.filter(s=>!o(s.a)&&!o(s.b)),issues:i.issues.filter(s=>!s.event||!e.has(s.event)),done:e.size,from:t}}function to(i,t){return{...i,whole_week:i.whole_week??i.days,days:i.days.filter(e=>e.date>=t.date).map(e=>e.date===t.date?jr(e,t.minutes):e)}}var no=Ne`
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
    box-shadow: inset 5px 0 0 var(--c), 0 0 0 2px rgba(var(--rgb), 0.6), var(--shadow);
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
  /* Compact: the lines follow one another, with no gap opening up when the card is taller. */
  .card.wrap {
    justify-content: flex-start;
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
`;function Ir(i,t,e,n,o=14){let s=i.top-o-8,r=e.h-i.bottom-o-8,l=t.h<=s,d=t.h<=r,h=n?l||!d&&s>r:!d&&(l||s>r),c=h?i.top-o-t.h:i.bottom+o,a=Math.max(8,Math.min(c,e.h-8-t.h)),f=Math.max(8,Math.min(i.x-t.w/2,e.w-8-t.w));return{left:Math.round(f),top:Math.round(a),above:h}}function jt(i,t){for(let e of i.composedPath()){if(e===t)break;if(e instanceof HTMLElement&&e.dataset.note)return e}return null}var mn=class{constructor(t,e){this.tip=null;this.anchor=null;this.held=!1;this.hoverTimer=null;this.hideTimer=null;this.hoverAt={x:0,y:0};this.hoverEl=null;this.press=null;this.eatUntil=0;this.hide=()=>{this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting")),this.anchor=null,this.held=!1,this.tip?.classList.remove("on")};this.onHover=t=>{if(t.pointerType==="touch"||t.buttons)return;let e=t.composedPath().includes(this.host)?jt(t,this.host):null;if(!e){this.clearHover(),this.laterHide();return}if(e===this.anchor){this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null;return}if(this.hoverAt={x:t.clientX,y:t.clientY},this.hoverEl!==e){if(this.anchor&&!this.held){this.show(e,this.pointAt(this.hoverAt),!1);return}this.clearHover(),this.hoverEl=e,this.hoverTimer=setTimeout(()=>{this.hoverTimer=null,this.hoverEl===e&&e.isConnected&&this.show(e,this.pointAt(this.hoverAt),!1)},400)}};this.onLeave=t=>{t.pointerType!=="touch"&&(this.clearHover(),this.held||this.hide())};this.onDown=t=>{if(this.eatUntil=0,this.endPress(),this.anchor&&this.hide(),this.clearHover(),t.pointerType!=="touch"||!t.isPrimary)return;let e=jt(t,this.host);if(!e)return;let n={x:t.clientX,y:t.clientY},o=setTimeout(()=>{let s=this.press;!s||s.el!==e||!e.isConnected||(s.done=!0,this.show(e,{x:n.x,top:n.y,bottom:n.y},!0,36),this.held=!0)},500);this.press={id:t.pointerId,x:n.x,y:n.y,el:e,timer:o,done:!1}};this.onMove=t=>{let e=this.press;e&&t.pointerId===e.id&&!e.done&&Math.hypot(t.clientX-e.x,t.clientY-e.y)>10&&this.endPress()};this.onUp=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done&&(this.eatUntil=performance.now()+700),this.endPress())};this.onCancel=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done?(this.endPress(),this.hide()):this.endPress())};this.onClick=t=>{if(!this.eatUntil)return;let e=performance.now()<this.eatUntil;this.eatUntil=0,e&&(t.stopPropagation(),t.preventDefault())};this.onContextMenu=t=>{let e=t.pointerType==="touch";(this.press||this.held&&this.anchor||e&&jt(t,this.host))&&t.preventDefault()};this.onFocusIn=t=>{let e=jt(t,this.host);if(!e||!e.matches(":focus-visible"))return;let n=e.getBoundingClientRect();this.show(e,{x:n.left+Math.min(n.width/2,120),top:n.top,bottom:n.bottom},!1,8)};this.onFocusOut=t=>{this.anchor&&jt(t,this.host)===this.anchor&&!this.held&&this.hide()};this.onKey=t=>{t.key!=="Escape"||!this.anchor||(this.hide(),t.stopImmediatePropagation())};this.host=t,this.root=e}connect(){let t=this.host;window.addEventListener("pointermove",this.onHover,{passive:!0}),document.documentElement.addEventListener("pointerleave",this.onLeave),t.addEventListener("pointerdown",this.onDown,{capture:!0}),t.addEventListener("pointermove",this.onMove,{capture:!0,passive:!0}),t.addEventListener("pointerup",this.onUp,{capture:!0}),t.addEventListener("pointercancel",this.onCancel,{capture:!0}),t.addEventListener("click",this.onClick,{capture:!0}),t.addEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.addEventListener("wheel",this.hide,{passive:!0}),t.addEventListener("focusin",this.onFocusIn),t.addEventListener("focusout",this.onFocusOut),t.addEventListener("keydown",this.onKey,{capture:!0}),window.addEventListener("resize",this.hide),window.addEventListener("blur",this.hide)}disconnect(){let t=this.host;window.removeEventListener("pointermove",this.onHover),document.documentElement.removeEventListener("pointerleave",this.onLeave),t.removeEventListener("pointerdown",this.onDown,{capture:!0}),t.removeEventListener("pointermove",this.onMove,{capture:!0}),t.removeEventListener("pointerup",this.onUp,{capture:!0}),t.removeEventListener("pointercancel",this.onCancel,{capture:!0}),t.removeEventListener("click",this.onClick,{capture:!0}),t.removeEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.removeEventListener("wheel",this.hide),t.removeEventListener("focusin",this.onFocusIn),t.removeEventListener("focusout",this.onFocusOut),t.removeEventListener("keydown",this.onKey,{capture:!0}),window.removeEventListener("resize",this.hide),window.removeEventListener("blur",this.hide),this.endPress(),this.hide()}get shown(){return this.anchor!==null}sync(){let t=this.anchor;t&&(!t.isConnected||!t.dataset.note?this.hide():this.tip&&this.tip.textContent!==t.dataset.note&&(this.tip.textContent=t.dataset.note))}ensureTip(){if(this.tip?.isConnected)return this.tip;let t=document.createElement("div");return t.className="note-tip",t.id="note-tip",t.setAttribute("role","tooltip"),this.root.appendChild(t),this.tip=t,t}show(t,e,n,o){let s=t.dataset.note;if(!s)return;this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&this.anchor!==t&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting"));let r=this.ensureTip();r.textContent=s,r.classList.remove("on"),r.style.left="0px",r.style.top="0px";let l={w:r.offsetWidth,h:r.offsetHeight},d={w:window.innerWidth,h:window.innerHeight},h=Ir(e,l,d,n,o);r.style.left=`${h.left}px`,r.style.top=`${h.top}px`,r.classList.toggle("above",h.above),r.classList.add("on"),t.setAttribute("aria-describedby",r.id),t.classList.add("noting"),this.anchor=t}clearHover(){this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=null,this.hoverEl=null}laterHide(){this.hideTimer||!this.anchor||this.held||(this.hideTimer=setTimeout(()=>{this.hideTimer=null,this.hide()},120))}pointAt(t){return{x:t.x,top:t.y-4,bottom:t.y+10}}endPress(){this.press&&clearTimeout(this.press.timer),this.press=null}};var Uo="mydashlight.rides.view",fl=1100,gl=440,ml=700,bl=3*6e4,Oo=1200,vl=450,yl=110;function xl(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var En=Y`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,Bo=Y`<svg class="note-mark" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M5 3h10l4 4v14H5zM9 11h6M9 15h6"/></svg>`,No=Y`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,wl=new URL("emoji.json",import.meta.url).href,Ho=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],Di=Y`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Li=Y`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,$l=Y`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,kl=Y`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Ot={bring:"Bring",buy:"Buy"};function Tl(i,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[i];return t<=1?e:`${e}s${i==="monthly"&&t===3?" (quarterly)":i==="monthly"&&t===12?" (yearly)":""}`}function ve(i){let t=/\p{L}|\p{N}/u.exec(i);return t?t[0].toUpperCase():"?"}function Ri(i){let[t,e,n]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function El(i,t){return Qn(i,t)||be(i).split(",")[0]}function Cl(i){let t=i.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function _l(){try{return localStorage.getItem(Uo)==="timeline"?"timeline":"compact"}catch{return"compact"}}function Pl(i){try{localStorage.setItem(Uo,i)}catch{}}function ji(i,t){return re(i).includes(t)?ee(i,t):ne(i,t)}function Bt(i){return i.days.every(t=>!t.events.length)}var Nt=class extends ge{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.leaveTimer=null;this.holdTimer=null;this.holdRepeat=null;this.held=!1;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.noteTip=null;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Rt(location.search).view;this.urlPage=Rt(location.search).page;this.urlPast=Rt(location.search).past;this.urlDayPicker=Rt(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.noteTip?.hide(),this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,s=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(s)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging"),this.noteTip?.hide()}this.onTouched(),n.el.scrollTop=n.top-s,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.noteTip?.hide(),this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},bl))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor||this.forPick?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.mode=this.urlView??_l(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null,this.forPick=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.noteTip??=new mn(this,this.renderRoot),this.noteTip.connect(),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.leaveTimer,this.railTimer])e&&clearTimeout(e);this.stopHold(),this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey),this.noteTip?.disconnect()}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){this.noteTip?.sync();let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,s]of this.lunchDraft){let[r,l]=o.split("|"),d=e.kids.find(h=>h.id===r);(!d||(d.picks[l]??null)===s||!Lt(d,l))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&ht(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(s=>s.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=zs(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<fl)return!1;let e=this.plan;return!e||this.width-gl>=Yn(me(e).length,re(e).length)}today(){return _t(this.plan?.time_zone??xl())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let n=this.today(),o=`${n.date}|${n.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:to(e,n)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let s=this.board,r=this.boardPlan;this.board=Is(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o,s&&r&&this.keepPlace(s,r,e)}return this.board}keepPlace(e,n,o){let s=this.scroller;if(!s||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||s.scrollTop<=0)return;let r=e.dayHeads.find(c=>c.date===this.pinDay)?.h??Dt,l=Zn(e,s.scrollTop+r+4),d=n.days[Math.floor(l/1440)]?.date,h=d?o.days.findIndex(c=>c.date===d):-1;h>=0&&(this.keepAt=h*1440+(l-Math.floor(l/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n,o=!1){let s=this.scroller;if(!s||!this.board)return;let r=this.topFor(e,n);Math.abs(s.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?s.scrollTo({top:r,behavior:"smooth"}):s.scrollTop=r),this.syncDay()}topFor(e,n){let o=this.board,s=o.dayHeads.find(r=>r.date===n)?.y??0;return Math.max(s,Ds(o,e)-Ps(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let n=this.today(),o=Math.max(0,this.dayIndexOf(n.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(n.date)?n.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let n=this.nowSpot();n&&this.scrollToTime(n.t,n.date,e)}goToDay(e,n=!1){let o=this.boardPlan;if(!o)return;let s=this.today();if(e===s.date){this.scrollToNow(n);return}let r=this.dayIndexOf(e),l=o.days[r];if(!l)return;let d=1/0;if(this.mode==="timeline"){for(let h of l.events)d=Math.min(d,h.arrive_by??h.start);for(let h of Object.values(l.drivers))for(let c of h.outings)c.start!=null&&(d=Math.min(d,c.start))}this.scrollToTime(r*1440+(Number.isFinite(d)?Math.max(0,d-30):0),e,n)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let d of this.board.dayHeads)d.y<=n+1&&(o=d);this.pinDay!==o.date&&(this.pinDay=o.date);let s=null,r=this.nowSpot(),l=this.today().date;if(r){let d=n-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),h=d>0?"up":"down";this.board.dayHeads.some(c=>c.date===l)&&o.date!==l?s=`${h}|Today`:this.mode==="timeline"&&Math.abs(d)>e.clientHeight*.6&&(s=`${h}|${o.date===l?"Now":"Today"}`)}this.away!==s&&(this.away=s)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),s=new Map(this.choreDraft);s.set(e.id,o),this.choreDraft=s;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let l=new Map(this.choreDraft);l.delete(e.id),this.choreDraft=l;let d=r instanceof W?r:new W("error",String(r));this.showToast(d.code==="preview"?d.message:`Couldn’t save that. ${d.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??ht(e)}editMenu(e,n){let o=this.lunch?.kids??[],s=ut(e,n),r=o.filter(l=>l.id===e.id||s&&ut(l,n)?.dish===s.dish).map(l=>l.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:s?.dish??"",details:s?.details??"",kids:r,had:!!s,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let s=o instanceof W?o:new W("error",String(o));this.showToast(s.code==="preview"?s.message:`Couldn’t save that. ${s.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let s=new Map(this.lunchDraft);for(let r of n)s.set(un(e,r),o);this.lunchDraft=s;try{await this.backend.setLunch(e,n,o)}catch(r){let l=new Map(this.lunchDraft);for(let h of n)l.delete(un(e,h));this.lunchDraft=l;let d=r instanceof W?r:new W("error",String(r));this.showToast(d.code==="preview"?d.message:`Couldn’t save that. ${d.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?Vs(e):Ks(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.forPick=null,this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(zo(),Io))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||ri(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(Gs(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof W?n:new W("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof W?n:new W("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(s=>s.date===this.pinDay)?.h??Dt;this.keepAt=n&&this.board?Zn(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||Pl(e)}findUnplaced(e,n){return this.plan?.days.find(o=>o.date===e)?.unplaced?.find(o=>o.id===n)??null}openForPick(e,n){let o=this.findUnplaced(e,n),s=this.plan;if(!o||!s)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...me(s),...re(s)]);this.forPick={day:e,id:n,placed:!1,label:`${L(o.at)} ${o.title}`,recurring:!!o.recurring,word:o.reason==="unknown"?o.word:null,fromNotes:!!o.from_notes,people:o.people.filter(l=>r.has(l)),scope:"this",busy:!1}}changeForPick(e,n,o){let s=e.who?.[o.event_id],r=s?.people??[o.own??o.kid];this.closeEditor(),this.forPick={day:n.date,id:o.id,placed:!0,label:`${L(o.start)} ${o.title}`,recurring:o.recurring,word:null,fromNotes:!!s?.from_notes,people:r,scope:"this",busy:!1}}async saveForPick(e=!1){let n=this.forPick,o=this.plan;if(!n||!o||!this.backend||!e&&!n.people.length)return;let s=e?[]:n.people;this.forPick={...n,busy:!0};try{await this.backend.setPeople(n.id,s,n.scope),this.forPick=null;let r=n.label.replace(/^\S+ /,""),l=s.map(d=>ji(o,d));this.showToast(e?`Saved. ${r} goes by the names in its title again.`:`Saved. ${r} is in ${ct(l)}’s ${l.length>1?"lanes":"lane"} now.`)}catch(r){this.forPick&&(this.forPick={...this.forPick,busy:!1});let l=r instanceof W?r:new W("error",String(r));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}renderForPick(e){let n=this.plan,o=e.placed?n?.days.some(k=>k.date===e.day&&k.events.some(u=>u.id===e.id)):!!this.findUnplaced(e.day,e.id),s=p`<button type="button" class="btn" ?disabled=${e.busy} @click=${()=>this.closeChorePanels()}>Cancel</button>`;if(!n||!o&&!e.busy)return p`<div class="ed-head">
          <div class="ed-titles"><span class="ed-title">Who is this for?</span></div>
          ${s}
        </div>
        <p class="field-hint">This event is sorted now: someone changed it in Google Calendar, or it’s over.</p>`;let r=e.busy,l=k=>{this.forPick&&(this.forPick={...this.forPick,...k})},d=k=>l({people:e.people.includes(k)?e.people.filter(u=>u!==k):[...e.people,k]}),h=de(n),c=me(n),a=c.length>1&&c.every(k=>e.people.includes(k)),y=[...c,...re(n)].filter(k=>e.people.includes(k)),T=y.map(k=>ji(n,k)),m=T.length<2?T.join(""):`${T.slice(0,-1).join(", ")} & ${T[T.length-1]}`,$=(k,u,D,R)=>p`<button
      type="button"
      class="who-chip"
      style="--c:${D.color};--rgb:${D.rgb}"
      aria-pressed=${e.people.includes(k)?"true":"false"}
      ?disabled=${r}
      @click=${()=>d(k)}
    >
      <span class="avatar ${R?"driver":""}" aria-hidden="true">${ve(u)}</span>${u}
    </button>`;return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">Who is this for?</span>
          <span class="ed-meta">${be(e.day)} · ${e.label}</span>
        </div>
        ${s}
      </div>
      ${e.word?p`<p class="field-hint">“${e.word}” isn’t anyone in the family. Pick who it’s for instead.</p>`:x}
      ${e.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${e.scope==="this"?"true":"false"} ?disabled=${r} @click=${()=>l({scope:"this"})}>
                Just ${ie(e.day)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${e.scope==="series"?"true":"false"} ?disabled=${r} @click=${()=>l({scope:"series"})}>
                Every time
              </button>
            </div>
          </div>`:x}
      <div class="field">
        <span class="field-label">Kids</span>
        <div role="group" aria-label="Kids it’s for" class="who-chips">
          ${c.map(k=>$(k,ne(n,k),h.get(k)??X(0),!1))}
        </div>
        ${c.length>1?p`<button
              type="button"
              class="chip all-kids"
              aria-pressed=${a?"true":"false"}
              ?disabled=${r}
              @click=${()=>l({people:a?e.people.filter(k=>!c.includes(k)):[...c,...e.people.filter(k=>!c.includes(k))]})}
            >
              All the kids
            </button>`:x}
      </div>
      <div class="field">
        <span class="field-label">Parents</span>
        <div role="group" aria-label="Parents it’s for" class="who-chips">
          ${re(n).map(k=>$(k,ee(n,k),dt,!0))}
        </div>
      </div>
      <p class="field-hint">
        ${y.length?p`Saved in the event’s notes as <strong>For: ${m}</strong>, so its title stays as it is. It shows in ${y.length>1?"their lanes":`${T[0]}’s lane`}${y.some(k=>c.includes(k))?", and rides are planned for the kids":""}.`:"Saved in the event’s notes, so its title stays as it is."}
      </p>
      ${e.fromNotes?p`<button type="button" class="chip clear" ?disabled=${r} @click=${()=>void this.saveForPick(!0)}>
            Go by the names in the title instead
          </button>`:x}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!y.length} @click=${()=>void this.saveForPick()}>
          ${r?"Saving to Google Calendar…":y.length?"Save":"Pick who it’s for"}
        </button>
      </div>
    `}renderForLine(e,n,o){let s=e.who?.[o.event_id];if(!s)return x;let r=s.people.map(l=>ji(e,l));return p`<span class="ed-for"
      >For ${ct(r)}<button type="button" class="ed-for-change" @click=${()=>this.changeForPick(e,n,o)}>Change</button></span
    >`}findEvent(e){let n=this.plan?.days.find(s=>s.date===e.day),o=n?.events.find(s=>s.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.flushLeave(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.flushLeave(),this.sel=null,this.arriveDraft=void 0,this.leaveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(s){let r=s instanceof W?s:new W("error",String(s));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o,s){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&s.includes(e.drop)){s.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope,!1));return}this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e,n,o){if(!this.backend)return;let s=this.backend;if(n&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>s.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",n,()=>s.setStay(e.id,n,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let s=this.backend,r=o==="pick"?e.pick_along??[]:e.along,l=r.includes(n)?r.filter(d=>d!==n):[...r,n];this.save(`along-${o}`,l,()=>s.setTakeAlong(e.id,l,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,s;n<0?s=(o??e.start)-5:s=o==null||o+5>=e.start?null:o+5,this.arriveDraft=s,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Oo)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let s=this.backend,r=o.event.id,l=this.scope;this.save("arrive",e,()=>s.setArriveBy(r,e,l)).then(()=>{this.arriveDraft=void 0})}nudgeLeave(e,n){let o=this.leaveDraft!==void 0?this.leaveDraft:e.leave_by??null,s;o==null?s=n<0?Math.max(e.start+5,e.end-15):null:n<0?s=Math.max(e.start+5,o-5):s=o+5>=e.end?null:o+5,this.leaveDraft=s,this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=setTimeout(()=>this.flushLeave(),Oo)}clearLeave(){this.leaveDraft=null,this.flushLeave()}flushLeave(){this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=null;let e=this.leaveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||(o.event.leave_by??null)===e){this.leaveDraft=void 0;return}let s=this.backend,r=o.event.id,l=this.scope;this.save("leave",e,()=>s.setLeaveBy(r,e,l)).then(()=>{this.leaveDraft=void 0})}startHold(e){this.stopHold(),this.held=!1,this.holdTimer=setTimeout(()=>{this.held=!0,e(),this.holdRepeat=setInterval(e,yl)},vl)}stopHold(){this.holdTimer&&clearTimeout(this.holdTimer),this.holdRepeat&&clearInterval(this.holdRepeat),this.holdTimer=this.holdRepeat=null}tapStep(e){this.held?this.held=!1:e()}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=this.shownPlan(),s=o?Os(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,l=this.chores?Ws(this.chores,this.today().minutes).filter(f=>!this.choreDone(f)):[],d=this.forPick?this.renderForPick(this.forPick):this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,h=this.forPick?"Who is this for?":this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",c=p`<aside class="panel" aria-label=${h}>
      ${d??(this.sel&&e?this.renderEditor(e):this.renderAttention(s,l))}
    </aside>`,a=this.page==="rides";return p`
      <div class="app ${r?"wide":this.width<ml?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,s,l.length)} ${a?this.renderBanner(e):x}
          <main>
            ${a?p`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?Bt(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                  ${n&&o&&!Bt(o)?this.renderDayRail(o):x}
                  ${n&&this.away?this.renderBackToToday(this.away):x}
                </section>`:this.page==="lunch"?p`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:p`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit||this.forPick)?p`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${c}`:x}
          </main>
        </div>
        ${r?c:x}
        ${this.toast?p`<div class="toast" role="status">${this.toast}</div>`:x}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let s=n.problems+o;this.tick;let r=this.today(),l="";if(e){let f=e.time_zone,y=new Date(e.updated);this.error?l=p`<span class="bad">${ps(this.error)} · showing the plan from ${Qt(y,new Date,f)}</span>`:e.status&&!e.status.ok?l=p`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Qt(y,new Date,f)}</span>`:this.backend?.live||(l=`Updated ${Qt(y,new Date,f)}`)}let d=(f,y,T,m)=>p`
      <button type="button" class="seg-btn" title=${m} aria-pressed=${this.mode===f?"true":"false"} @click=${()=>this.setMode(f)}>
        ${T}<span class="seg-label">${y}</span>
      </button>
    `,h=(f,y,T)=>p`
      <button type="button" class="seg-btn" aria-pressed=${this.page===f?"true":"false"} @click=${()=>this.setPage(f)}>
        ${T}<span class="seg-label">${y}</span>
      </button>
    `,c=Ie(r.minutes),a=!!e&&Bt(e);return p`
      <header>
        ${this.showMenu?p`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${Y`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:x}
        <div class="titles">
          <h1 class="clock" aria-label=${`${be(r.date)}, ${c}`}>
            <span class="hm">${c.slice(0,-3)}</span><span class="ampm">${c.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${be(r.date)}${typeof l=="string"&&l?p`<span class="status"> · ${l}</span>`:x}
          </p>
          ${l&&typeof l!="string"?p`<p class="status">${l}</p>`:x}
        </div>
        ${e&&!a?this.renderNext(e,Ns(e,r),n):x}
        <div class="controls">
          ${this.wide||a&&!o?x:p`<button type="button" class="attn-btn ${s?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${s}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?x:p`<div role="group" aria-label="View" class="seg">
            ${d("timeline","Timeline",Y`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${d("compact","Compact",Y`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${h("rides","Rides",Y`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${h("chores","Chores",Y`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?x:h("lunch","Lunch",Y`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let h=this.today().date,c=o.unassigned,a=o.laterUnassigned;if(c){let y=p`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${c} ${c===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?p`<div class="next idle needs">${y}</div>`:p`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${y}</button>`}if(a)return p`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${a} ${a===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let f=e.days.some(y=>y.date>=h&&y.events.length);return p`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${f?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${f?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let s;n.ongoing?s="On the road now":n.ahead===0?s=n.inMinutes<180?`Next trip · in ${Pt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?s="Next trip · tomorrow":s=`Next trip · ${ie(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,l=p`
      <span class="next-eyebrow">${s}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${ve(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(h=>p`<span class="kid-dot" style="background:${h.color}"></span>`)}</span>
        ${n.warn?p`<span class="next-stop warn">${n.warn}</span>`:n.stop?p`<span class="next-stop">${n.stop}</span>`:x}
      </span>
    `,d=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?p`<button type="button" class=${d} @click=${()=>this.open(n.target)}>${l}</button>`:p`<div class=${d}>${l}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return x;let n=this.today().date,o=de(e),s=this.railShown;return p`<div
      class="rail-wrap ${s?"out":""}"
      @pointerenter=${()=>{this.railHeld=!0}}
      @pointerleave=${()=>{this.railHeld=!1}}
    >
      <button
        type="button"
        class="rail-tab"
        aria-label="Show the days of the week"
        aria-expanded=${s?"true":"false"}
        tabindex=${s?-1:0}
        @click=${()=>this.showRail(4e3)}
      >
        <span aria-hidden="true"></span>
      </button>
      <nav class="rail" aria-label="Days" ?inert=${!s}>
        ${e.days.map(r=>{let l=Jn(r),d=r.events.length,h=r.events.slice(0,4).map(a=>a.own?dt.color:o.get(a.kid)?.color??X(0).color),c=`${be(r.date)}: ${d?`${d} ${d===1?"activity":"activities"}`:"nothing planned"}${l?`, ${l} to sort out`:""}`;return p`<button
            type="button"
            class="rail-day ${r.date===n?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${c}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===n?"Today":ie(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${h.length?h.map(a=>p`<span class="rd-dot" style="background:${a}"></span>`):p`<span class="rd-free">free</span>`}
            </span>
            ${l?p`<span class="rd-badge" aria-hidden="true">${l}</span>`:x}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[n,o]=e.split("|");return p`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${Y`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${n==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let n=me(e),o=re(e),s=de(e),r=n.map(l=>ne(e,l));return p`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((l,d)=>Y`<circle cx=${50+d*30} cy="80" r="11" fill=${s.get(l).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Cl(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(l=>{let d=s.get(l);return p`<div class="qw-person" style="--c:${d.color};--rgb:${d.rgb}">
            <span class="avatar" aria-hidden="true">${ve(ne(e,l))}</span>
            <span class="qw-name">${ne(e,l)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(l=>p`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${ve(ee(e,l))}</span>
            <span class="qw-name">${ee(e,l)}</span>
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
    </div>`:x}renderEmpty(){return this.error?p`<div class="empty-state">
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
          <span class="label">${e.label}</span>${e.tag?p`<span class="tag">${e.tag}</span>`:x}
        </button>
        <span class="sub ${e.warn?"warn":""}">${e.sub}</span>
        ${e.inline?p`<div class="dh-chips">${e.allDay.slice(0,e.inline).map(o=>this.renderStripChip(e,o,n))}</div>`:x}
      </div>
      ${e.allDay.length>e.inline?p`<div class="day-strip" style="padding-left:${lt}px">
            ${e.allDay.slice(e.inline).map(o=>this.renderStripChip(e,o,n))}
          </div>`:x}`}renderStripChip(e,n,o){let s=p`<span class="strip-title">${n.title}</span>${n.note?p`<span class="strip-note">${n.note}</span>`:x}${n.notes?Bo:x}`,r=n.pick;return r?p`<button
          type="button"
          class="strip-chip warn plain pick"
          tabindex=${o?-1:0}
          data-note=${n.notes||x}
          aria-label=${`${n.title}: ${n.note} Pick who it’s for`}
          @click=${()=>this.openForPick(e.date,r)}
        >
          ${s}
        </button>`:p`<span
          class="strip-chip ${n.warn?"warn":""} ${n.cancelled?"skipped":""} ${n.color?"":"plain"} ${n.notes?"noted":""}"
          style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
          tabindex=${n.notes&&!o?0:x}
          data-note=${n.notes||x}
          >${s}</span
        >`}renderBoard(e){let n=this.sel,o=n?this.findEvent(n):null,s=new Set(o?o.event.own?[o.event.id]:o.day.events.filter(a=>!a.own&&a.event_id===o.event.event_id).map(a=>a.id):[]),r=a=>!!a&&!!n&&a.day===n.day&&s.has(a.event),l=e.dayHeads.find(a=>a.date===this.pinDay)??e.dayHeads[0],d=e.width,h=100,c=[...e.links.map(a=>({t:"link",x:a,z:a.layer??0})),...e.preps.map(a=>({t:"prep",x:a,z:a.layer??h-1})),...e.cards.map(a=>({t:"card",x:a,z:a.layer??h})),...e.rides.map(a=>({t:"ride",x:a,z:a.layer??h+1}))].sort((a,f)=>a.z-f.z);return p`
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
        <div class="heads" style="width:${d}px">
          ${e.columns.map(a=>p`<div class="col-head ${a.kind}" style="left:${a.x}px;width:${a.w}px;--c:${a.dot};--rgb:${a.rgb}">
              <span class="avatar ${a.kind}" aria-hidden="true">${ve(a.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${a.name}</span>${a.kind==="kid"?this.renderLunchChip(a.id,!0,a.w-58-a.name.length*10.6):x}</span>
                <span class="sub ${a.subWarn?"warn":""}">${a.sub}</span>
              </span>
            </div>`)}
        </div>
        ${l?p`<div class="pinned" aria-hidden="true" style="width:${d}px;height:${l.h}px;margin-bottom:${-l.h}px">
              ${this.renderHead(l,!0)}
            </div>`:x}
        <div class="canvas" style="width:${d}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(a=>p`<div
                class="col-bg ${a.kind}"
                style="left:${a.x}px;width:${a.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${a.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(a=>p`<div class="day-head" style="top:${a.y}px;width:${d}px;height:${a.h}px">${this.renderHead(a)}</div>`)}
          ${e.empties.map(a=>p`<span class="empty" style="top:${a.y}px">${a.text}</span>`)}
          ${e.grid.map(a=>p`<div class="grid ${a.strong?"strong":""}" style="top:${a.y}px;width:${d-60}px"></div>`)}
          ${e.hours.map(a=>p`<span class="hour" style="top:${a.y}px">${a.label}</span>`)}
          ${De(e.bands,a=>a.key,a=>p`<div
                class="band"
                aria-hidden="true"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;background:rgba(${a.color.rgb},0.10);border-color:rgba(${a.color.rgb},0.45)"
              ></div>`)}
          ${De(e.busy,a=>a.key,a=>p`<div class="busy" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span style="top:${a.labelY}px">${a.label}</span>
              </div>`)}
          ${De(e.windows,a=>a.key,a=>p`<div class="window" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span>${a.label}</span>
              </div>`)}
          ${De(c,a=>a.x.key,a=>{if(a.t==="link"){let m=a.x;return p`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;border-color:${m.color.color};background:linear-gradient(rgba(${m.color.rgb},0.11), rgba(${m.color.rgb},0.11)), var(--surface)"
                ></div>`}if(a.t==="prep"){let m=a.x;return p`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;border-color:${m.color.color};background:linear-gradient(rgba(${m.color.rgb},0.11), rgba(${m.color.rgb},0.11)), var(--surface);color:${m.color.ink}"
                >
                  ${m.label}
                </div>`}if(a.t==="ride"){let m=a.x;return p`<button
                  type="button"
                  class="ride ${m.dashed?"dashed":""} ${m.clash?"clash":""}"
                  aria-label=${m.aria}
                  style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;padding-top:${3+(m.tuckTop??0)}px;padding-bottom:${3+(m.tuckBottom??0)}px"
                  @click=${()=>this.open(m.target)}
                >
                  <span class="l1">${m.l1}</span>${m.show2?p`<span class="l2" style="-webkit-line-clamp:${m.lines2}">${m.l2}</span>`:x}
                </button>`}let f=a.x,y=f.color,T=f.skipped?`repeating-linear-gradient(135deg, rgba(${y.rgb},0.10) 0px, rgba(${y.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:f.stayed?`repeating-linear-gradient(135deg, rgba(${y.rgb},0.24) 0px, rgba(${y.rgb},0.24) 6px, rgba(${y.rgb},0.08) 6px, rgba(${y.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${y.rgb},0.15), rgba(${y.rgb},0.15)), var(--surface)`;return p`<button
                type="button"
                class="card ${f.wrap?"wrap":""} ${r(f.target)?"sel":""} ${f.clash?"clash":""} ${f.skipped?"skipped":""} ${f.cut?"cut":""} ${f.event.notes?"noted":""}"
                aria-label=${f.aria}
                data-note=${f.event.notes||x}
                style="left:${f.x}px;top:${f.y}px;width:${f.w}px;height:${f.h}px;background:${T};border-color:${f.clash?"var(--bad)":`rgba(${y.rgb},0.45)`};--c:${y.color};--rgb:${y.rgb};--ring:${y.color}"
                @click=${()=>this.open(f.target)}
              >
                ${f.event.notes?Bo:x}
                <span class="top">
                  <span class="title">${f.title}</span>
                  <span class="time">${f.time}</span>
                  ${f.showDrop&&f.drop?p`<span class="line tone-${f.drop.tone}">${f.drop.text}</span>`:x}
                </span>
                ${f.showPick&&f.pick?p`<span class="line tone-${f.pick.tone}">${f.pick.text}</span>`:x}
              </button>`})}
          ${De(e.stays,a=>a.key,a=>p`<button
                type="button"
                class="stay ${a.cut?"cut":""}"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;border-color:${a.color.color};background:repeating-linear-gradient(135deg, rgba(${a.color.rgb},0.28) 0px, rgba(${a.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1" style="color:${a.color.ink}">${a.l1}</span><span class="l2">${a.l2}</span>
              </button>`)}
          ${De(e.trips,a=>a.key,a=>p`<button
                type="button"
                class="trip ${a.bad?"bad":""} ${a.stops?"list":""}"
                aria-label=${a.aria}
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1">${a.l1}${a.kids.map(f=>p`<span class="kid-dot" style="background:${f}"></span>`)}</span>
                ${a.show2?p`<span class="l2">${a.l2}</span>`:x}
                ${a.stops?a.stops.map(f=>p`<span class="stop ${f.warn?"warn":""}">${f.text}</span>`):x}
                ${a.show3?p`<span class="l3">${a.l3}</span>`:x}
              </button>`)}
          ${De(e.overlaps,a=>a.key,a=>p`<div class="overlap" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"></div>`)}
          ${De(e.marks,a=>a.key,a=>p`<span class="mark" style="left:${a.x}px;top:${a.y}px;${a.right?"transform:translateX(-100%)":""}">${a.text}</span>`)}
          ${e.now?p`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${d-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:x}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:s,later:r}=e,l=this.plan,d=s+n.length,h=this.chores,c=!!h&&!ii(h);return p`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${d?"bad":"ok"}">${d}</span>
        ${this.wide?x:p`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${c?p`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?p`<div class="attn-chores">${n.map(a=>this.renderChoreRow(a,!0))}</div>`:p`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:p`<p class="panel-sub">Rides in the next two days</p>`}
      ${l&&!s?p`<div class="all-clear">
            <span class="check" aria-hidden="true">${Y`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Bt(l)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:x}
      ${o.map(a=>p`<div class="issue ${a.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${a.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${a.pick?p`<button type="button" class="issue-title" @click=${()=>a.pick&&this.openForPick(a.pick.day,a.pick.id)}>${a.title}</button>`:a.target?p`<button type="button" class="issue-title" @click=${()=>this.open(a.target,!0)}>${a.title}</button>`:p`<strong class="issue-title">${a.title}</strong>`}
              <span class="issue-body"
                >${a.parts?a.parts.map(f=>typeof f=="string"?f:p`<button type="button" class="issue-link" @click=${()=>this.open(f.target,!0)}>${f.text}</button>`):a.body}</span
              >
            </div>
          </div>
          ${a.suggestions.length?p`<div class="fixes">
                ${a.suggestions.map(f=>p`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(f.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${f.id}`?"Saving…":f.label}</span>
                    <span class="fix-note">${f.note}</span>
                  </button>`)}
              </div>`:x}
        </div>`)}
      ${this.wide&&l&&!Bt(l)&&this.page==="rides"?this.renderLegend():x}
    `}kidColorOf(e){let n=this.plan?de(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(s=>s.id===e)??-1;return X(Math.max(0,o))}renderLunchChip(e,n=!1,o=1/0){let s=this.lunch,r=s?.kids.find(a=>a.id===e);if(!s||!r)return x;this.tick;let l=this.today(),d=eo(r,l.date,l.minutes,this.lunchDraft);if(!d)return x;let h=Ot[d.lunch],c=`${h} lunch ${d.when}${d.menu?`: ${d.menu}`:""}`;return n&&o<36+h.length*7.4?p`<span class="lunch-chip ${d.lunch} small icon" role="img" aria-label=${c} title=${c}
        >${d.lunch==="bring"?Di:Li}</span
      >`:p`<span class="lunch-chip ${d.lunch} ${n?"small":""}" title=${c}
      >${d.lunch==="bring"?Di:Li}<span class="lunch-chip-text"
        >${h}${n?x:` ${d.when}`}${!n&&d.menu?p`<span class="lunch-chip-menu"> · ${d.menu}</span>`:x}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return p`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=Xs(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:ke(e.today),s=n.indexOf(o),r=c=>{let a=n[s+c];a&&(this.lunchMonth=a)},l=e.kids.some(c=>c.id===this.lunchKid)?this.lunchKid:null,d=l?e.kids.filter(c=>c.id===l):e.kids,h=e.status&&!e.status.ok?p`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:x;return p`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${s<=0} @click=${()=>r(-1)}>
            ${Y`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${gn(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${s<0||s>=n.length-1} @click=${()=>r(1)}>
            ${Y`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":p`${No} Edit menus`}
        </button>
      </div>
      ${h}
      <div class="chore-cols lunch-cols ${l?"wide":""}" style="--n:${d.length}">
        ${d.map(c=>this.renderLunchCard(e,c,o,l!==null))}
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
    </div>`}renderLunchCard(e,n,o,s){let r=this.kidColorOf(n.id),l=Zs(e,n,o,this.lunchDraft),d=Qs(l),h=l.flat(),c=h.filter(m=>!m.outside&&!m.past&&m.lunch),a=n.days_off.filter(m=>ke(m.first)<=o&&o<=ke(m.last)),f=m=>c.filter($=>fn($.date)===m),y=m=>{let $=f(m);if(!$.length)return;let k=$.every(u=>u.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,$.map(u=>u.date),k)},T=c.length?`${d.bring} Bring · ${d.buy} Buy${o===ke(e.today)?" left this month":""}`:"No school days left this month";return p`<section class="chore-col lunch-card ${s?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${ve(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${T}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Ot[n.default]} unless picked</span>
          ${e.kids.length<2?x:p`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${s?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=s?null:n.id}
              >
                ${s?kl:$l}${s?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?p`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:x}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${gn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((m,$)=>p`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!f($).length}
            aria-label=${`${f($).every(k=>k.lunch==="bring")?"Buy":"Bring"} every ${m} left in ${gn(o)} for ${n.name}`}
            @click=${()=>y($)}
          >
            ${m}
          </button>`)}
        ${h.map(m=>this.renderLunchCell(n,m,s))}
      </div>
      ${a.length?p`<p class="lunch-offs">
            No school:
            ${a.map(m=>{let $=m.first<`${o}-01`?`${o}-01`:m.first,k=ke(m.last)>o?pt(`${hi(o)}-01`,-1):m.last;return`${$===k?Ri($):`${Ri($)}–${Ri(k)}`} ${Js(m.title)}`}).join(" · ")}
          </p>`:x}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return p`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return p`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let s=n.lunch,r=s==="buy"?"bring":"buy",l=n.menu?`, ${n.menu}`:"",d=this.menuMode,h=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),c=d?`${e.name}, ${be(n.date)}${l||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${be(n.date)}: ${Ot[s]}${n.picked?"":" (not picked yet)"}${l}. Tap to ${Ot[r]}.`;return p`<button
      type="button"
      class="lunch-day ${s} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${d?"editing":""} ${h?"sel":""}"
      ?disabled=${n.past&&!d}
      aria-label=${c}
      @click=${()=>d?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${s==="bring"?Di:Li}${Ot[s]}</span>
      ${n.menu?p`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?p`<span class="lunch-sides">${n.sides}</span>`:x}`:d?p`<span class="lunch-menu add">${En} Menu</span>`:x}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,s=this.choreDone(e),r=o.kids.findIndex(k=>k.id===e.kid),l=(this.plan?de(this.plan).get(e.kid):void 0)??X(Math.max(0,r)),d=o.kids[r]?.name??"",h=s===ht(e)?e:{...e,state:s?"done":"open",done_at:s?new Date().toISOString():null},c=s&&h.done_by&&h.done_by!==e.kid?o.people?.find(k=>k.id===h.done_by)?.name??h.done_by_name??null:null,a=`${ni(h,o.today,o.time_zone)}${c?` · by ${c}`:""}`,f=s||Us(e),y=`${n?`${d}: `:""}${e.title}. ${a?`${a}. `:""}${s?"Done. Tap to undo.":"Tap when it’s done."}`,T=p`<span class="box" aria-hidden="true"
        >${s?Y`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:x}</span
      >
      ${e.icon?p`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:x}
      <span class="chore-text">
        <span class="chore-title">${n?p`<span class="chore-kid">${d}</span> · `:x}${e.title}</span>
        ${a?p`<span class="chore-note">${a}</span>`:x}
      </span>`,m=`chore ${s?"done":""} ${e.state==="overdue"&&!s?"overdue":""} ${f?"":"later"}`,$=`--c:${l.color};--rgb:${l.rgb};--k:${l.ink}`;return f?p`<button type="button" class=${m} style=${$} aria-pressed=${s?"true":"false"} aria-label=${y} @click=${()=>this.tapChore(e)}>
          ${T}
        </button>`:p`<div class=${m} style=${$}>${T}</div>`}renderChores(){let e=this.chores;if(e===void 0)return p`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return p`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return p`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(ii(e))return p`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${En} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?p`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:x;this.tick;let s=Fs(e,this.plan?de(this.plan):void 0,this.today().minutes);return p`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${En} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${No} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${s.length}">
        ${s.map(r=>{let l=r.overdue.filter(d=>!this.choreDone(d)).length+r.now.filter(d=>!this.choreDone(d)).length;return p`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${ve(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${l?`${l} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?p`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(d=>this.renderChoreRow(d))}`:x}
            ${r.now.length?p`<h3 class="chore-group">To do</h3>
                  ${r.now.map(d=>this.renderChoreRow(d))}`:x}
            ${r.done.length?p`<h3 class="chore-group">Done</h3>
                  ${r.done.map(d=>this.renderChoreRow(d))}`:x}
            ${r.later.map(d=>p`<h3 class="chore-group">${d.date===e.today?"Later today":El(d.date,e.today)}</h3>
                ${d.chores.map(h=>this.renderChoreRow(h))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?p`<p class="chore-none">No chores this week.</p>`:x}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,s=this.plan?de(this.plan):void 0,r=this.choreEdit?.template===e.id,l=e.problems.length?p`<span class="tmpl-note bad">${e.problems.map(ci).join(" · ")} · tap to set up</span>`:p`<span class="tmpl-note">${di(e.who,o,e.take_turns)} · ${li(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return p`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?p` <span class="tag-paused">Paused</span>`:x}</span>
        ${l}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(d=>{let h=o.findIndex(a=>a.id===d),c=s?.get(d)??X(Math.max(0,h));return p`<span class="kid-dot" style="background:${c.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return p`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${En} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([o,s])=>{let r=e.templates.filter(l=>l.repeats===o);return r.length?p`<section class="manage-group" aria-label=${s}>
                  <h3 class="chore-group">${s}</h3>
                  <div class="tmpl-list">${r.map(l=>this.renderTemplateRow(l))}</div>
                </section>`:x}):p`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return p``;let o=n.kids,s=this.plan?de(this.plan):void 0,r=this.choreBusy,l=e.template?n.templates.find(m=>m.id===e.template):void 0,d=ri(e),h=(l?.problems??[]).filter(m=>m!=="who:"),c=(m,$,k,u=!1)=>p`<button type="button" class="choice ${u?"wide":""}" aria-pressed=${m?"true":"false"} ?disabled=${r} @click=${k}>${$}</button>`,a=(m,$,k,u)=>p`<button type="button" class="chip" aria-pressed=${m?"true":"false"} aria-label=${u??x} ?disabled=${r} @click=${k}>${$}</button>`,f=m=>{m!==e.repeats&&this.changeDraft({repeats:m,days:l&&l.repeats===m?l.days??pn(m):pn(m)})},y=m=>{let $=e.who.includes(m)?e.who.filter(k=>k!==m):o.filter(k=>k.id===m||e.who.includes(k.id)).map(k=>k.id);this.changeDraft({who:$})},T;if(e.repeats==="school"){let m=e.days===Ye?new Set:e.days===""?new Set([0,1,2,3,4]):si(e.days)??new Set,$=k=>{let u=new Set(m);u.has(k)?u.delete(k):u.add(k),this.changeDraft({days:u.size===5?"":u.size?oi(u):Ye})};T=p`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${qe.slice(0,5).map((k,u)=>a(m.has(u),k.slice(0,2),()=>$(u),k))}
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
        </div>`}else if(e.repeats==="monthly"){let m=e.days.trim(),$=/^\d+$/.test(m)?Number(m):null,k=m&&m.toLowerCase()!=="any"&&m.toLowerCase()!=="last"&&$===null;T=p`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${k?4:3}, minmax(0, 1fr))">
          ${c(m===""||m.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${c($!==null,"On a date",()=>this.changeDraft({days:String($??1)}))}
          ${c(m.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${k?c(!0,m,()=>{}):x}
        </div>
        ${$!==null?p`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||$<=1} @click=${()=>this.changeDraft({days:String($-1)})}>−</button>
                <span class="arrive-value">${ai($)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||$>=31} @click=${()=>this.changeDraft({days:String($+1)})}>+</button>
              </span>
            </div>`:p`<p class="field-hint">${m.toLowerCase()==="last"?"Due on the month’s last day.":k?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")T=p`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let m=e.days===""||e.days.toLowerCase()==="any",$=e.days===Ye?new Set:m?new Set:si(e.days)??new Set,k=u=>{let D=new Set($);D.has(u)?D.delete(u):D.add(u),this.changeDraft({days:D.size?oi(D)||"Mon-Sun":Ye})};T=p`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${c(m,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${c(!m,"On set days",()=>this.changeDraft({days:m?"Sat":e.days}))}
        </div>
        ${m?p`<p class="field-hint">Shows all week, due on Sunday.</p>`:p`<div role="group" aria-label="Days of the week" class="day-chips">
                ${qe.map((u,D)=>a($.has(D),u.slice(0,2),()=>k(D),u))}
              </div>
              <div class="chips">
                ${a(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${a(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:x}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?di(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===Ye?"No days picked":li(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${h.length?p`<p class="field-hint bad">${h.map(ci).join(". ")}. Saving fixes it.</p>`:x}
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
          ${Ho.map(m=>a(e.icon===m,m,()=>this.changeDraft({icon:e.icon===m?null:m}),`Picture ${m}`))}
          ${e.icon&&!Ho.includes(e.icon)?a(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):x}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?p`<emoji-picker
              class="emoji-more"
              .dataSource=${wl}
              @emoji-click=${m=>{let $=m.detail.unicode;$&&this.changeDraft({icon:$}),this.iconMore=!1}}
            ></emoji-picker>`:x}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((m,$)=>{let k=s?.get(m.id)??X($),u=e.who.includes(m.id);return p`<button type="button" class="who-chip" style="--c:${k.color};--rgb:${k.rgb}" aria-pressed=${u?"true":"false"} ?disabled=${r} @click=${()=>y(m.id)}>
              <span class="avatar" aria-hidden="true">${ve(m.name)}</span>${m.name}
            </button>`})}
        </div>
        ${e.who.length>1?p`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${c(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${c(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:x}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${c(e.repeats==="daily","Every day",()=>f("daily"))}
          ${c(e.repeats==="weekly","Every week",()=>f("weekly"))}
          ${c(e.repeats==="monthly","Every month",()=>f("monthly"))}
          ${c(e.repeats==="school","School days",()=>f("school"))}
        </div>
      </div>
      ${T}
      ${e.repeats==="school"?x:p`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${Tl(e.repeats,e.every)}</span>
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
      ${e.template?p`<div class="field">
              ${c(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${r} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:x}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!d} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":d?d.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return p``;let o=e.busy,s=c=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...c})},r=c=>s({kids:e.kids.includes(c)?e.kids.filter(a=>a!==c):[...e.kids,c]}),l=n.kids.filter(c=>Lt(c,e.date)),d=e.dish.trim(),h=e.kids.length?d?null:"Type what’s served":"Pick who gets this menu";return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${be(e.date)}</span>
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
          @input=${c=>s({dish:c.target.value})}
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
          @input=${c=>s({details:c.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${l.map(c=>{let a=this.kidColorOf(c.id),f=e.kids.includes(c.id);return p`<button type="button" class="who-chip" style="--c:${a.color};--rgb:${a.rgb}" aria-pressed=${f?"true":"false"} ?disabled=${o} @click=${()=>r(c.id)}>
              <span class="avatar" aria-hidden="true">${ve(c.name)}</span>${c.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${d||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?p`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:x}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!h} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":h??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return p``;let o=n.people?.length?n.people:n.kids.map(a=>({...a,role:"kid"})),s=n.kids.findIndex(a=>a.id===e.kid),r=n.kids[s],l=this.plan?de(this.plan):void 0,d=l?.get(e.kid)??X(Math.max(0,s)),h=o.filter(a=>a.id!==e.kid),c=a=>{let f=n.kids.findIndex(y=>y.id===a.id);return f>=0?(l?.get(a.id)??X(f)).color:"var(--dark)"};return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:x}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${ni(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${d.color};--rgb:${d.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${ve(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?p`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${h.map(a=>p`<button type="button" class="done-by" style="--c:${c(a)}" @click=${()=>void this.toggleChore(e,a.id)}>
                  <span class="avatar ${a.role==="parent"?"driver":""}" aria-hidden="true">${ve(a.name)}</span>
                  <span>${a.name}</span>
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
    </div>`}ownHint(e,n){let o=hn(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${L(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${L(n.start)} to ${L(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let s=n.along.map(r=>re(e).includes(r)?ee(e,r):ne(e,r));return`${o} drives there and back${s.length?`, with ${ct(s)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return p``;let{day:o,event:s}=n,r=re(e),l=Ms(e,s),d=hn(e,s),h=!!this.pending,c=w=>this.pending?.key===w?this.pending.value:void 0,a=[...e.people?.carpools??[]];for(let w of e.days)for(let g of w.events)for(let v of[g.drop,g.pick])v&&v!=="none"&&!r.includes(v)&&!a.some(E=>E.toLowerCase()===v.toLowerCase())&&a.push(v);let f=w=>{if(!s.sides.includes(w))return x;let g=c(w)??c("both"),v=w==="drop"?s.drop:s.pick,E=g!==void 0?String(g):s.no_ride_unless_named&&v==="none"?"":v,P=E===""&&!(g===void 0&&s.no_ride_unless_named),C=E&&E!=="none"&&!r.includes(E)?E:"",M=N=>{this.otherOpen=null,this.setRide(s,w,E===N?"":N,r)},j=[...r.map(N=>[N,Xn(e,N)]),["none","Not needed"]],A=`${s.id}|${w}`,G=this.otherOpen===A;return p`<div class="field ride-box">
        <span class="field-label">${w==="drop"?"Drop-off":"Pick-up"} ${P?p`<span class="nobody">· nobody yet</span>`:x}</span>
        <div role="group" aria-label=${w==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${j.length+1}, minmax(0, 1fr))">
          ${j.map(([N,J])=>p`<button type="button" class="choice" aria-pressed=${E===N?"true":"false"} ?disabled=${h} @click=${()=>M(N)}>
                ${J}
              </button>`)}
          <button
            type="button"
            class="choice"
            aria-pressed=${C?"true":"false"}
            aria-expanded=${G?"true":"false"}
            ?disabled=${h}
            @click=${()=>this.otherOpen=G?null:A}
          >
            ${C||"Other"}
          </button>
        </div>
        ${G?p`${a.length?p`<div role="group" aria-label=${w==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${a.map(N=>p`<button type="button" class="chip" aria-pressed=${E.toLowerCase()===N.toLowerCase()?"true":"false"} ?disabled=${h} @click=${()=>M(N)}>
                    ${N}
                  </button>`)}
            </div>`:x}
        <input
          type="text"
          .value=${C&&!a.some(N=>N.toLowerCase()===C.toLowerCase())?C:""}
          ?disabled=${h}
          aria-label=${w==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${N=>{let J=N.target.value.trim();J&&J!==E&&M(J)}}
          @keydown=${N=>{N.key==="Enter"&&N.target.blur()}}
        />`:x}
        ${!k&&E!==""&&E!=="none"?y(w,E):x}
      </div>`},y=(w,g)=>{let v=c(`along-${w}`),E=v!==void 0?v:w==="pick"?s.pick_along??[]:s.along,P=new Set(o.events.filter(j=>j.event_id===s.event_id&&!j.own).map(j=>j.kid)),C=[...me(e).filter(j=>j!==s.kid&&!P.has(j)),...r.filter(j=>j!==g)];return C.length?p`<div class="field-sub">
        <span class="field-label">${w==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${w==="pick"?"Coming home too. Anyone already there just gets in.":w==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${w==="drop"?"Riding along on the drop-off":w==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${C.map(j=>p`<button type="button" class="chip" aria-pressed=${E.includes(j)?"true":"false"} ?disabled=${h} @click=${()=>this.toggleAlong(s,j,w)}>
              ${r.includes(j)?ee(e,j):ne(e,j)}
            </button>`)}
        </div>
      </div>`:x},T=r.includes(s.drop)?s.drop:r.includes(s.pick)?s.pick:"",m=s.drop===s.pick&&r.includes(s.drop),$=c("stay"),k=$!==void 0?!!$:s.stay&&m,u=c("along"),D=u!==void 0?u:s.along,R=s.own?[...me(e),...r.filter(w=>w!==s.own)]:[],H=s.own!=null&&s.takes!=null,te=s.own!=null&&!H,ae=c("takes"),B=ae!==void 0?ae:s.takes??null,Ee=c("arrive"),ce=this.arriveDraft!==void 0?this.arriveDraft:Ee!==void 0?Ee:s.arrive_by,Oe=c("leave"),ue=this.leaveDraft!==void 0?this.leaveDraft:Oe!==void 0?Oe:s.leave_by??null,Be=(w,g)=>{let v=w==="arrive",E=C=>()=>v?this.nudgeArrive(s,C):this.nudgeLeave(s,C),P=(C,M,j,A)=>p`<button
          type="button"
          class="step"
          aria-label=${M}
          ?disabled=${h||A}
          @pointerdown=${()=>this.startHold(E(C))}
          @pointerup=${()=>this.stopHold()}
          @pointerleave=${()=>this.stopHold()}
          @pointercancel=${()=>this.stopHold()}
          @click=${()=>this.tapStep(E(C))}
        >
          ${j}
        </button>`;return p`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">${v?"Arrive by":"Leave by"}</span>
          <span class="field-hint">${v?`${s.start-g} min before it starts`:`${s.end-g} min before it ends`}</span>
        </span>
        <span class="stepper">
          ${P(-5,"Five minutes earlier","−",!v&&g-5<=s.start)}
          <span class="arrive-value">${L(g)}</span>
          ${P(5,"Five minutes later","+",!1)}
          <button
            type="button"
            class="step clear-time"
            aria-label=${v?"Clear arrive-by time":"Clear leave-by time"}
            ?disabled=${h}
            @click=${()=>v?this.clearArrive():this.clearLeave()}
          >
            ×
          </button>
        </span>
      </div>`},he=s.sides.includes("pick")||s.own!=null,et=()=>p`${ce!=null?Be("arrive",ce):x}
      ${ue!=null?Be("leave",ue):x}
      ${ce==null||ue==null&&he?p`<div class="field time-chips">
            <div role="group" aria-label="Times" class="chips">
              ${ce==null?p`<button type="button" class="chip" ?disabled=${h} @click=${()=>this.nudgeArrive(s,-5)}>Arrive early</button>`:x}
              ${ue==null&&he?p`<button type="button" class="chip" ?disabled=${h} @click=${()=>this.nudgeLeave(s,-5)}>Leave early</button>`:x}
            </div>
          </div>`:x}`,Ce=s.sides.includes("drop")&&s.sides.includes("pick"),Re=Ce&&(k||this.stayDraft===s.id),tt=()=>{let w=Ce?p`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${Re?"false":"true"}
              ?disabled=${h}
              @click=${()=>{this.stayDraft=null,s.stay&&this.toggleStay(s,!1,T)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${Re?"true":"false"}
              ?disabled=${h}
              @click=${()=>{T?this.toggleStay(s,!0,T):this.stayDraft=s.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:x;if(!Re)return p`${w} ${f("drop")} ${f("pick")}`;let g=k&&m?s.drop:"";return p`${w}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${g?x:p`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(v=>p`<button
                type="button"
                class="choice"
                aria-pressed=${g===v?"true":"false"}
                ?disabled=${h}
                @click=${()=>{if(g===v||!this.backend)return;let E=this.backend;this.stayDraft=null,this.save("stay",!0,()=>E.setRide(s.id,"both",v,this.scope,!0))}}
              >
                ${ee(e,v)}
              </button>`)}
          </div>
          ${g?y("both",g):x}
        </div>`},se=[],je=w=>w==="none"?"Not needed":Xn(e,w),ye=w=>r.includes(w)?ee(e,w):ne(e,w),K=(w,g,v)=>{g===""&&!v.length||se.push(`${w}: ${[g===""?"TBD":je(g),...v.map(ye)].join(", ")}`)},le=w=>s.no_ride_unless_named&&w==="none"?"":w;s.own||K("Drop-off",le(s.drop),s.along),s.own||K("Pick-up",le(s.pick),s.pick_along??[]),!s.own&&s.stay&&se.push("Stay: yes"),H&&se.push(`Takes: ${s.takes} min`),s.own&&s.along.length&&se.push(`Take along: ${s.along.map(ye).join(", ")}`),s.arrive_by!=null&&se.push(`Arrive by: ${Ie(s.arrive_by)}`),s.leave_by!=null&&se.push(`Leave by: ${Ie(s.leave_by)}`);let oe=c("attending"),fe=oe!==void 0?!!oe:s.attending!==!1;s.attending===!1&&se.splice(0,se.length,"Attending: no");let nt=o.date===this.today().date?"":`${ie(o.date)} · `,_e=cn(s),b=p`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${d} · ${s.title}</span>
          <span class="ed-meta">${nt}${H?"any time ":""}${_e}${s.place_name&&!s.place.startsWith("?")?` · ${s.place_name}`:""}</span>
          ${this.renderForLine(e,o,s)}
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;if(s.busy_only){let w=s.place_name&&s.place_name!==s.title?s.place_name:"",g=s.busy_why==="days"?"It runs over more than a day, so no drive is planned for it.":s.busy_why==="home"?"It’s at home, so no drive is planned for it.":"It has no address, so no drive is planned for it.";return p`${b}
        ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:x}
        ${w?p`<div class="field"><span class="field-label">Where</span><span class="field-hint">${w}</span></div>`:x}
        <p class="field-hint">
          ${fe?`This blocks ${d}’s time: ${d} can’t drive then, so a ride that needs ${d} shows as a problem.`:`Not going, so it doesn’t block ${d}’s time, and ${d} can drive then.`}
          ${g}
        </p>
        <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setAttending(s,!fe)}>
          ${fe?`${d} isn’t going this time`:`${d} is going after all`}
        </button>
        ${s.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${s.problems.join("; ")}</p>`:x}
        <details class="notes">
          <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
          <span class="notes-body">--- Rides ---\n${s.attending===!1?"Attending: no":"(nothing yet)"}</span>
        </details>`}return s.where==="home"?p`${b}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${d} can’t get home in time, the board shows it as a clash.</p>`:p`
      ${b}
      ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:x}
      ${s.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${ie(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:x}
      ${fe?p`${s.where==="anywhere"?p`<p class="field-hint">
                  ${s.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:x}
            ${s.own?p`<p class="field-hint">${this.ownHint(e,s)}</p>`:tt()}
      ${s.own?p`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${B!=null?`Takes ${B} min, any time ${L(s.start)}–${L(s.end)}`:"At its set time"}</span>
            </span>
            ${B!=null?p`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${h||B<=5} @click=${()=>this.setTakes(s,Math.max(5,B-5))}>−</button>
                  <span class="arrive-value">${B} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${h||B+5>s.end-s.start} @click=${()=>this.setTakes(s,B+5)}>+</button>
                </span>`:x}
          </div>
          <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setTakes(s,B!=null?null:Math.min(10,Math.max(5,s.end-s.start)))}>
            ${B!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:x}
      ${te&&R.length?p`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${R.map(w=>p`<button type="button" class="chip" aria-pressed=${D.includes(w)?"true":"false"} ?disabled=${h} @click=${()=>this.toggleAlong(s,w)}>
                  ${r.includes(w)?ee(e,w):ne(e,w)}
                </button>`)}
            </div>
          </div>`:x}
      ${H?x:et()}
`:p`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${d} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setAttending(s,!fe)}>
        ${fe?`${d} isn’t going this time`:`${d} is going after all`}
      </button>
      ${s.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${s.problems.join("; ")}</p>`:x}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${se.length?se.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${fe&&!s.own?p`<p class="field-hint">Tap a selected driver again to clear it.</p>`:x}
    `}};Nt.styles=no,Nt.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},leaveDraft:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0},forPick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Nt);var Ht=class extends ge{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=ls(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(Et);let n=e.toString();history.replaceState(history.state,"",`${location.pathname}${n?`?${n}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new en(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return p`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?p`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:x}`}};Ht.styles=Ne`
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
  `,Ht.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0},pairing:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",Ht);
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
