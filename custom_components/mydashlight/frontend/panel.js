var bo=Object.defineProperty;var fn=(s,t)=>()=>(s&&(t=s(s=0)),t);var vo=(s,t)=>{for(var e in t)bo(s,e,{get:t[e],enumerable:!0})};function nn(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function Jn(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function gr(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Di(s){return gr(s,t=>t.unicode)}function fr(s){function t(e,n,o){let i=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(o)for(let[r,[d,c]]of Object.entries(o))i.createIndex(r,d,{multiEntry:c});return i}t(it),t(Ge,lr,{[ji]:[ar,!0],[Ri]:[[dr,cr]],[Ii]:[pr,!0]}),t(ns,void 0,{[zi]:[""]})}function Bi(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function mr(s){let t=await new Promise((e,n)=>{let o=indexedDB.open(s,or);es[s]=o,o.onupgradeneeded=i=>{i.oldVersion<rr&&fr(o.result)},Bi(e,n,o)});return t.onclose=()=>is(s),t}function br(s){return on[s]||(on[s]=mr(s)),on[s]}function Me(s,t,e,n){return new Promise((o,i)=>{let r=s.transaction(t,e,{durability:"relaxed"}),d=typeof t=="string"?r.objectStore(t):t.map(a=>r.objectStore(a)),c;n(d,r,a=>{c=a}),r.oncomplete=()=>o(c),r.onerror=()=>i(r.error)})}function is(s){let t=es[s],e=t&&t.result;if(e){e.close();let n=an[s];if(n)for(let o of n)o()}delete es[s],delete on[s],delete an[s]}function vr(s){return new Promise((t,e)=>{is(s);let n=indexedDB.deleteDatabase(s);Bi(t,e,n)})}function xr(s,t){let e=an[s];e||(e=an[s]=[]),e.push(t)}function st(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||yr.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function Oi(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=wr)}function $r(s){return s.map(({annotation:e,emoticon:n,group:o,order:i,shortcodes:r,skins:d,tags:c,emoji:a,version:l})=>{let p=[...new Set(Oi([...(r||[]).map(st).flat(),...(c||[]).map(st).flat(),...st(e),n]))].sort(),m={annotation:e,group:o,order:i,tags:c,tokens:p,unicode:a,version:l};if(n&&(m.emoticon=n),r&&(m.shortcodes=r),d){m.skinTones=[],m.skinUnicodes=[],m.skinVersions=[];for(let{tone:b,emoji:E,version:v}of d)m.skinTones.push(b),m.skinUnicodes.push(E),m.skinVersions.push(v)}return m})}function Ni(s,t,e,n){s[t](e).onsuccess=o=>n&&n(o.target.result)}function Ve(s,t,e){Ni(s,"get",t,e)}function Ui(s,t,e){Ni(s,"getAll",t,e)}function os(s){s.commit&&s.commit()}function kr(s,t){let e=s[0];for(let n=1;n<s.length;n++){let o=s[n];t(e)>t(o)&&(e=o)}return e}function Hi(s,t){let e=kr(s,o=>o.length),n=[];for(let o of e)s.some(i=>i.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function Er(s){return!await rs(s,it,rn)}async function Tr(s,t,e){let[n,o]=await Promise.all([Qn,rn].map(i=>rs(s,it,i)));return n===e&&o===t}async function Cr(s,t){return Me(s,Ge,rt,(n,o,i)=>{let r,d=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let a=c.target.result;for(let l of a)if(r=l.unicode,t(l))return i(l);if(a.length<50)return i();d()}};d()})}async function Fi(s,t,e,n){try{let o=$r(t);await Me(s,[Ge,it],ss,([i,r],d)=>{let c,a,l=0;function p(){++l===2&&m()}function m(){if(!(c===n&&a===e)){i.clear();for(let b of o)i.put(b);r.put(n,Qn),r.put(e,rn),os(d)}}Ve(r,Qn,b=>{c=b,p()}),Ve(r,rn,b=>{a=b,p()})})}finally{}}async function _r(s,t){return Me(s,Ge,rt,(e,n,o)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);Ui(e.index(Ri),i,o)})}async function Wi(s,t){let e=Oi(st(t));return e.length?Me(s,Ge,rt,(n,o,i)=>{let r=[],d=()=>{r.length===e.length&&c()},c=()=>{let a=Hi(r,l=>l.unicode);i(a.sort((l,p)=>l.order<p.order?-1:1))};for(let a=0;a<e.length;a++){let l=e[a],p=a===e.length-1?IDBKeyRange.bound(l,l+"￿",!1,!0):IDBKeyRange.only(l);Ui(n.index(ji),p,m=>{r.push(m),d()})}}):[]}async function Sr(s,t){let e=await Wi(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(i=>i.toLowerCase()).includes(t.toLowerCase()))[0]||null:await Cr(s,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function Ar(s,t){return Me(s,Ge,rt,(e,n,o)=>Ve(e,t,i=>{if(i)return o(i);Ve(e.index(Ii),t,r=>o(r||null))}))}function rs(s,t,e){return Me(s,t,rt,(n,o,i)=>Ve(n,e,i))}function Pr(s,t,e,n){return Me(s,t,ss,(o,i)=>{o.put(n,e),os(i)})}function Mr(s,t){return Me(s,ns,ss,(e,n)=>Ve(e,t,o=>{e.put((o||0)+1,t),os(n)}))}function Dr(s,t,e){return e===0?[]:Me(s,[ns,Ge],rt,([n,o],i,r)=>{let d=[];n.index(zi).openCursor(void 0,"prev").onsuccess=c=>{let a=c.target.result;if(!a)return r(d);function l(b){if(d.push(b),d.length===e)return r(d);a.continue()}let p=a.primaryKey,m=t.byName(p);if(m)return l(m);Ve(o,p,b=>{if(b)return l(b);a.continue()})}})}function Lr(s,t){let e=new Map;for(let o of s){let i=t(o);for(let r of i){let d=e;for(let a=0;a<r.length;a++){let l=r.charAt(a),p=d.get(l);p||(p=new Map,d.set(l,p)),d=p}let c=d.get(sn);c||(c=[],d.set(sn,c)),c.push(o)}}return(o,i)=>{let r=e;for(let a=0;a<o.length;a++){let l=o.charAt(a),p=r.get(l);if(p)r=p;else return[]}if(i)return r.get(sn)||[];let d=[],c=[r];for(;c.length;){let l=[...c.shift().entries()].sort((p,m)=>p[0]<m[0]?-1:1);for(let[p,m]of l)p===sn?d.push(...m):c.push(m)}return d}}function zr(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||jr.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function Li(s){zr(s);let t=(m,b)=>m.name.toLowerCase()<b.name.toLowerCase()?-1:1,e=s.sort(t),o=Lr(s,m=>{let b=new Set;if(m.shortcodes)for(let E of m.shortcodes)for(let v of st(E))b.add(v);return b}),i=m=>o(m,!0),r=m=>o(m,!1),d=m=>{let b=st(m),E=b.map((v,x)=>(x<b.length-1?i:r)(v));return Hi(E,v=>v.name).sort(t)},c=new Map,a=new Map;for(let m of s){a.set(m.name.toLowerCase(),m);for(let b of m.shortcodes||[])c.set(b.toLowerCase(),m)}return{all:e,search:d,byShortcode:m=>c.get(m.toLowerCase()),byName:m=>a.get(m.toLowerCase())}}function kt(s){if(!s)return s;if(Rr&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function Ki(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function Br(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||Ir.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function Vi(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function Or(s){let t=await fetch(s,{method:"HEAD"});Vi(t,s);let e=t.headers.get("etag");return Ki(e),e}async function ts(s){let t=await fetch(s);Vi(t,s);let e=t.headers.get("etag");Ki(e);let n=await t.json();return Br(n),[e,n]}function Nr(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function Ur(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=s.charCodeAt(o);return e}async function Gi(s){let t=JSON.stringify(s),e=Ur(t),n=await crypto.subtle.digest("SHA-1",e),o=Nr(n);return btoa(o)}async function Hr(s,t){let e,n=await Or(t);if(!n){let o=await ts(t);n=o[0],e=o[1],n||(n=await Gi(e))}await Tr(s,t,n)||(e||(e=(await ts(t))[1]),await Fi(s,e,t,n))}async function Fr(s,t){let[e,n]=await ts(t);e||(e=await Gi(n)),await Fi(s,n,t,e)}async function Wr(s,t){try{await Hr(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var or,rr,Ge,it,ns,ar,ji,lr,zi,dr,cr,Ri,Qn,rn,Mi,rt,ss,Ii,pr,hr,ur,es,on,an,yr,wr,sn,jr,Rr,Ir,ot,as=fn(()=>{or=1,rr=1,Ge="emoji",it="keyvalue",ns="favorites",ar="tokens",ji="tokens",lr="unicode",zi="count",dr="group",cr="order",Ri="group-order",Qn="eTag",rn="url",Mi="skinTone",rt="readonly",ss="readwrite",Ii="skinUnicodes",pr="skinUnicodes",hr="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",ur="en";es={},on={},an={};yr=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);wr=2;sn="";jr=["name","url"];Rr=typeof wrappedJSObject<"u";Ir=["annotation","emoji","group","order","version"];ot=class{constructor({dataSource:t=hr,locale:e=ur,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=Li(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await br(this._dbName);xr(this._dbName,this._clear);let e=this.dataSource;await Er(t)?await Fr(t,e):this._lazyUpdate=Wr(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return Jn(t),await this.ready(),Di(await _r(this._db,t)).map(kt)}async getEmojiBySearchQuery(t){nn(t),await this.ready();let e=this._custom.search(t),n=Di(await Wi(this._db,t)).map(kt);return[...e,...n]}async getEmojiByShortcode(t){nn(t),await this.ready();let e=this._custom.byShortcode(t);return e||kt(await Sr(this._db,t))}async getEmojiByUnicodeOrName(t){nn(t),await this.ready();let e=this._custom.byName(t);return e||kt(await Ar(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await rs(this._db,it,Mi)||0}async setPreferredSkinTone(t){return Jn(t),await this.ready(),Pr(this._db,it,Mi,t)}async incrementFavoriteEmojiCount(t){return nn(t),await this.ready(),Mr(this._db,t)}async getTopFavoriteEmoji(t){return Jn(t),await this.ready(),(await Dr(this._db,this._custom,t)).map(kt)}set customEmoji(t){this._custom=Li(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await is(this._dbName)}async delete(){await this._shutdown(),await vr(this._dbName)}}});function Yi(s){return s.unicode.includes("‍")}function Qr(s){let t=Xi(s,"#000"),e=Xi(s,"#fff");return t&&e&&Jr(t,e)}function ea(){let s=Object.entries(Vr);try{for(let[t,e]of s)if(Qr(t))return e}catch{}finally{}return s[0][1]}function ra(s,t){if(t===0)return s;let e=s.indexOf(sa);return e!==-1?s.substring(0,e)+String.fromCodePoint(ia+t-1)+s.substring(e):(s.endsWith(ta)&&(s=s.substring(0,s.length-1)),s+na+String.fromCodePoint(oa+t-1))}function Ee(s){s.preventDefault(),s.stopPropagation()}function ps(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function oo(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function aa(s,t){let e=n=>{let o={};for(let i of n)typeof i.tone=="number"&&i.version<=t&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:n,skins:o,shortcodes:i,url:r,name:d,category:c,annotation:a})=>({unicode:n,name:d,shortcodes:i,url:r,category:c,annotation:a,id:n||d,skins:o&&e(o)}))}function da(s,t,e){let n;la?(n=new ResizeObserver(e),n.observe(s)):dn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function Zi(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function Ji(s,t,e){let n=Zi(t);if(!n){if(!qe){qe=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])qe.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(qe),qe.firstChild.nodeValue=s,Zi(qe)}finally{qe.remove()}}return n}function pa(s,t,e){let n=!0;for(let o of s){let i=e(o);if(!i)continue;typeof hs>"u"&&(hs=Ji(ca,t,t));let d=Ji(o.unicode,i,t)/1.8<hs;ms.set(o.unicode,d),d||(n=!1)}return n}function ha(s){return oo(s,t=>t)}function ua(s){s&&(s.scrollTop=0)}function Et(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function Qi(s){return""+s}function ga(s){let t=document.createElement("template");return t.innerHTML=s,t}function xa(s,t){va?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function ya(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function wa(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=ya(n,s):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&xa(n,s)}function $a(s,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:d,attributeValuePost:c}}=e,a=s[i];if(o!==a)if(e.currentExpression=a,r)if(a===null)n.removeAttribute(r);else{let l=d+Qi(a)+c;n.setAttribute(r,l)}else{let l;Array.isArray(a)?wa(a,e):a instanceof Element?(l=a,n.replaceWith(l)):n.nodeValue=Qi(a),l&&(e.targetNode=l)}}}function ka(s){let t="",e=!1,n=!1,o=-1,i=new Map,r=[],d=0;for(let a=0,l=s.length;a<l;a++){let p=s[a];if(t+=p.slice(d),a===l-1)break;for(let g=0;g<p.length;g++)switch(p.charAt(g)){case"<":{p.charAt(g+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let m=r[r.length-1],b=Et(i,m,()=>[]),E,v,x;if(n){let g=/(\S+)="?([^"=]*)$/.exec(p);E=g[1],v=g[2];let C=/^([^">]*)("?)/.exec(s[a+1]);x=C[1],t=t.slice(0,-1*g[0].length),d=C[0].length}else d=0;let k={attributeName:E,attributeValuePre:v,attributeValuePost:x,expressionIndex:a};b.push(k),!e&&!n&&(t+=" ")}return{template:ga(t),elementsToBindings:i}}function eo(s,t,e){for(let n=0;n<s.length;n++){let o=s[n],i=o.attributeName?t:t.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Ea(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))eo(n,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let d=t.get(++r);d&&eo(d,i,e)}while(i=o.nextNode())}return e}function Ta(s){let{template:t,elementsToBindings:e}=Et(fa,s,()=>ka(s)),n=t.cloneNode(!0).content.firstElementChild,o=Ea(n,e);return function(r){return $a(r,o),n}}function Ca(s){let t=Et(ma,s,()=>new Map),e=ba;function n(i,...r){let d=Et(t,i,()=>new Map);return Et(d,e,()=>Ta(i))(r)}function o(i,r,d){return i.map((c,a)=>{let l=e;e=d(c);try{return r(c,a)}finally{e=l}})}return{map:o,html:n}}function _a(s,t,e,n,o,i,r,d,c){let{labelWithSkin:a,titleForEmoji:l,unicodeWithSkin:p}=e,{html:m,map:b}=Ca(t);function E(g,C,z){return b(g,(W,te)=>m`<button role="${C?"option":"menuitem"}" aria-selected="${C?te===t.activeSearchItem:null}" aria-label="${a(W,t.currentSkinTone)}" title="${l(W)}" class="${"emoji"+(C&&te===t.activeSearchItem?" active":"")+(W.unicode?"":" custom-emoji")}" id="${`${z}-${W.id}`}" style="${W.unicode?null:`--custom-emoji-background: url(${JSON.stringify(W.url)})`}">${W.unicode?p(W,t.currentSkinTone):""}</button>`,W=>`${z}-${W.id}`)}let x=m`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${b(t.skinTones,(g,C)=>m`<div id="skintone-${C}" class="emoji ${C===t.activeSkinTone?"active":""}" aria-selected="${C===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[C]}" aria-label="${t.i18n.skinTones[C]}">${g}</div>`,g=>g)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${b(t.groups,g=>m`<button role="tab" class="nav-button" aria-controls="tab-${g.id}" aria-label="${t.i18n.categories[g.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===g.id}" title="${t.i18n.categories[g.name]}" data-group-id="${g.id}"><div class="nav-emoji emoji">${g.emoji}</div></button>`,g=>g.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${b(t.currentEmojisWithCategories,(g,C)=>m`<div><div id="menu-label-${C}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:g.category?g.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${C!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(g.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${C}" id="${t.searchMode?"search-results":null}">${E(g.emojis,t.searchMode,"emo")}</div></div>`,g=>g.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${E(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,k=(g,C)=>{for(let z of s.querySelectorAll(`[${g}]`))C(z,z.getAttribute(g))};if(c){s.appendChild(x);for(let g of["click","focusout","input","keydown","keyup"])k(`data-on-${g}`,(C,z)=>{C.addEventListener(g,n[z])});k("data-ref",(g,C)=>{i[C]=g}),r.addEventListener("abort",()=>{s.removeChild(x)})}k("data-action",(g,C)=>{let z=d.get(C);z||d.set(C,z=new WeakSet),z.has(g)||(z.add(g),o[C](g))})}function Sa(s){let t=!1,e,n=new Map,o=new Set,i,r=()=>{if(t)return;let a=[...o];o.clear();try{for(let l of a)l()}finally{i=!1,o.size&&(i=!0,cn(r))}},d=new Proxy({},{get(a,l){if(e){let p=n.get(l);p||(p=new Set,n.set(l,p)),p.add(e)}return a[l]},set(a,l,p){if(a[l]!==p){a[l]=p;let m=n.get(l);if(m){for(let b of m)o.add(b);i||(i=!0,cn(r))}}return!0}}),c=a=>{let l=()=>{let p=e;e=l;try{return a()}finally{e=p}};return l()};return s.addEventListener("abort",()=>{t=!0}),{state:d,createEffect:c}}function us(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function Aa(s,t,e){{let n=s.closest(".tabpanel"),o=to.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),to.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function Pa(s,t){let e={},n=new AbortController,o=n.signal,{state:i,createEffect:r}=Sa(o),d=new Map;ln(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),ln(i,t),ln(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:Yr,isRtl:!1,currentGroupIndex:0,groups:ls,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let c=u=>{s.getElementById(u).focus()},a=u=>s.getElementById(`emo-${u.id}`),l=(u,y)=>{e.rootElement.dispatchEvent(new CustomEvent(u,{detail:y,bubbles:!0,composed:!0}))},p=(u,y)=>u.id===y.id,m=(u,y)=>{let{category:S,emojis:D}=u,{category:R,emojis:K}=y;return S!==R?!1:us(D,K,p)},b=u=>{us(i.currentEmojis,u,p)||(i.currentEmojis=u)},E=u=>{i.searchMode!==u&&(i.searchMode=u)},v=u=>{us(i.currentEmojisWithCategories,u,m)||(i.currentEmojisWithCategories=u)},x=(u,y)=>y&&u.skins&&u.skins[y]||u.unicode,C={labelWithSkin:(u,y)=>ha([u.name||x(u,y),u.annotation,...u.shortcodes||gs].filter(Boolean)).join(", "),titleForEmoji:u=>u.annotation||(u.shortcodes||gs).join(", "),unicodeWithSkin:x},z={onClickSkinToneButton:_,onEmojiClick:be,onNavClick:M,onNavKeydown:Y,onSearchKeydown:De,onSkinToneOptionsClick:f,onSkinToneOptionsFocusOut:O,onSkinToneOptionsKeydown:j,onSkinToneOptionsKeyup:A,onSearchInput:se},W={calculateEmojiGridStyle:U,updateOnIntersection:pe},te=!0;r(()=>{_a(s,i,C,z,W,e,o,d,te),te=!1}),i.emojiVersion||cs().then(u=>{u||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function u(){let y=!1,S=setTimeout(()=>{y=!0,i.message=i.i18n.loadingMessage},Gr);try{await i.database.ready(),i.databaseLoaded=!0}catch(D){console.error(D),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(S),y&&(y=!1,i.message="")}}i.database&&u()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${qi};`}),r(()=>{i.customEmoji&&i.database&&G()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==fs&&(i.groups=fs):i.groups!==ls&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=ls)}),r(()=>{async function u(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}u()}),r(()=>{i.skinTones=Array(qi).fill().map((u,y)=>ra(i.skinToneEmoji,y))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function u(){let{database:y}=i,S=(await Promise.all(Xr.map(D=>y.getEmojiByUnicodeOrName(D)))).filter(Boolean);i.defaultFavoriteEmojis=S}i.databaseLoaded&&u()});function G(){let{customEmoji:u,database:y}=i,S=u||gs;y.customEmoji!==S&&(y.customEmoji=S)}r(()=>{async function u(){G();let{database:y,defaultFavoriteEmojis:S,numColumns:D}=i,R=await y.getTopFavoriteEmoji(D),K=await me(oo([...R,...S],V=>V.unicode||V.name).slice(0,D));i.currentFavorites=K}i.databaseLoaded&&i.defaultFavoriteEmojis&&u()});function U(u){da(u,o,()=>{{let y=getComputedStyle(e.rootElement),S=parseInt(y.getPropertyValue("--num-columns"),10),D=y.getPropertyValue("direction")==="rtl";i.numColumns=S,i.isRtl=D}})}function pe(u){Aa(u,o,y=>{for(let{target:S,isIntersecting:D}of y)S.classList.toggle("onscreen",D)})}r(()=>{async function u(){let{searchText:y,currentGroup:S,databaseLoaded:D,customEmoji:R}=i;if(!D)i.currentEmojis=[],i.searchMode=!1;else if(y.length>=Kr){let K=await Xe(y);i.searchText===y&&(b(K),E(!0))}else{let{id:K}=S;if(K!==-1||R&&R.length){let V=await Ce(K);i.currentGroup.id===K&&(b(V),E(!1))}}}u()});let Q=()=>{dn(()=>ua(e.tabpanelElement))};r(()=>{let{currentEmojis:u,emojiVersion:y}=i,S=u.filter(D=>D.unicode).filter(D=>Yi(D)&&!ms.has(D.unicode));if(!y&&S.length)b(u),dn(()=>ge(S));else{let D=y?u:u.filter(je);b(D),Q()}});function ge(u){pa(u,e.baselineEmoji,a)?Q():i.currentEmojis=[...i.currentEmojis]}function je(u){return!u.unicode||!Yi(u)||ms.get(u.unicode)}async function fe(u){let y=i.emojiVersion||await cs();return u.filter(({version:S})=>!S||S<=y)}async function me(u){return aa(u,i.emojiVersion||await cs())}async function Ce(u){let y=u===-1?i.customEmoji:await i.database.getEmojiByGroup(u);return me(await fe(y))}async function Xe(u){return me(await fe(await i.database.getEmojiBySearchQuery(u)))}r(()=>{}),r(()=>{function u(){let{searchMode:S,currentEmojis:D}=i;if(S)return[{category:"",emojis:D}];let R=new Map;for(let K of D){let V=K.category||"",T=R.get(V);T||(T=[],R.set(V,T)),T.push(K)}return[...R.entries()].map(([K,V])=>({category:K,emojis:V})).sort((K,V)=>i.customCategorySorting(K.category,V.category))}let y=u();v(y)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:u}=i;so(()=>{i.searchText=(u||"").trim(),i.activeSearchItem=-1})});function De(u){if(!i.searchMode||!i.currentEmojis.length)return;let y=S=>{Ee(u),i.activeSearchItem=ps(S,i.activeSearchItem,i.currentEmojis)};switch(u.key){case"ArrowDown":return y(!1);case"ArrowUp":return y(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return Ee(u),X(i.currentEmojis[i.activeSearchItem].id)}}function M(u){let{target:y}=u,S=y.closest(".nav-button");if(!S)return;let D=parseInt(S.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(R=>R.id===D)}function Y(u){let{target:y,key:S}=u,D=R=>{R&&(Ee(u),R.focus())};switch(S){case"ArrowLeft":return D(y.previousElementSibling);case"ArrowRight":return D(y.nextElementSibling);case"Home":return D(y.parentElement.firstElementChild);case"End":return D(y.parentElement.lastElementChild)}}async function N(u){let y=await i.database.getEmojiByUnicodeOrName(u),S=[...i.currentEmojis,...i.currentFavorites].find(R=>R.id===u),D=S.unicode&&x(S,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(u),{emoji:y,skinTone:i.currentSkinTone,...D&&{unicode:D},...S.name&&{name:S.name}}}async function X(u){let y=N(u);l("emoji-click-sync",y),l("emoji-click",await y)}function be(u){let{target:y}=u;if(!y.classList.contains("emoji"))return;Ee(u);let S=y.id.substring(4);X(S)}function le(u){i.currentSkinTone=u,i.skinTonePickerExpanded=!1,c("skintone-button"),l("skin-tone-change",{skinTone:u}),i.database.setPreferredSkinTone(u)}function f(u){let{target:{id:y}}=u,S=y&&y.match(/^skintone-(\d)/);if(!S)return;Ee(u);let D=parseInt(S[1],10);le(D)}function _(u){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(Ee(u),dn(()=>c("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function j(u){if(!i.skinTonePickerExpanded)return;let y=async S=>{Ee(u),i.activeSkinTone=S};switch(u.key){case"ArrowUp":return y(ps(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return y(ps(!1,i.activeSkinTone,i.skinTones));case"Home":return y(0);case"End":return y(i.skinTones.length-1);case"Enter":return Ee(u),le(i.activeSkinTone);case"Escape":return Ee(u),i.skinTonePickerExpanded=!1,c("skintone-button")}}function A(u){if(i.skinTonePickerExpanded)switch(u.key){case" ":return Ee(u),le(i.activeSkinTone)}}async function O(u){let{relatedTarget:y}=u;(!y||y.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function se(u){i.rawSearchText=u.target.value}return{$set(u){ln(i,u)},$destroy(){n.abort()}}}function no(s){s instanceof Ye||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var fs,ls,Kr,qi,so,Vr,Gr,qr,Yr,Xr,io,Zr,Xi,Jr,ds,cs,ms,ta,na,sa,ia,oa,dn,la,ca,hs,qe,fa,ma,ba,va,cn,to,gs,ln,Ma,Da,La,ja,ro,za,Ye,ao,lo=fn(()=>{as();fs=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),ls=fs.slice(1),Kr=2,qi=6,so=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;Vr={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},Gr=1e3,qr="🖐️",Yr=8,Xr=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],io='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',Zr=(s,t)=>s<t?-1:s>t?1:0,Xi=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${io}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},Jr=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};cs=()=>(ds||(ds=new Promise(s=>so(()=>s(ea())))),ds),ms=new Map,ta="️",na="\uD83C",sa="‍",ia=127995,oa=57339;dn=requestAnimationFrame,la=typeof ResizeObserver=="function";ca="😀";fa=new WeakMap,ma=new WeakMap,ba=Symbol("un-keyed"),va="replaceChildren"in Element.prototype;cn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);to=new WeakMap;gs=[],{assign:ln}=Object;Ma="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Da="en",La={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},ja=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',ro=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],za=`:host{--emoji-font-family:${io}}`,Ye=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=ja+za,this.shadowRoot.appendChild(e),this._ctx={locale:Da,dataSource:Ma,skinToneEmoji:qr,customCategorySorting:Zr,customEmoji:null,i18n:La,emojiVersion:null,...t};for(let n of ro)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){no(this),this._cmp||(this._cmp=Pa(this.shadowRoot,this._ctx))}disconnectedCallback(){no(this),cn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new ot({locale:t,dataSource:e}))}_dbFlush(){cn(()=>this._dbCreate())}},ao={};for(let s of ro)ao[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(Ye.prototype,ao);customElements.get("emoji-picker")||customElements.define("emoji-picker",Ye)});var co={};vo(co,{Database:()=>ot,Picker:()=>Ye});var po=fn(()=>{lo();as()});var Pt=globalThis,Mt=Pt.ShadowRoot&&(Pt.ShadyCSS===void 0||Pt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,mn=Symbol(),Es=new WeakMap,lt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==mn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Mt&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Es.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Es.set(e,t))}return t}toString(){return this.cssText}},Ts=s=>new lt(typeof s=="string"?s:s+"",void 0,mn),ze=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,o,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new lt(e,s,mn)},Cs=(s,t)=>{if(Mt)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=Pt.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}},bn=Mt?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Ts(e)})(s):s;var{is:xo,defineProperty:yo,getOwnPropertyDescriptor:wo,getOwnPropertyNames:$o,getOwnPropertySymbols:ko,getPrototypeOf:Eo}=Object,Dt=globalThis,_s=Dt.trustedTypes,To=_s?_s.emptyScript:"",Co=Dt.reactiveElementPolyfillSupport,dt=(s,t)=>s,vn={toAttribute(s,t){switch(t){case Boolean:s=s?To:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},As=(s,t)=>!xo(s,t),Ss={attribute:!0,type:String,converter:vn,reflect:!1,useDefault:!1,hasChanged:As};Symbol.metadata??=Symbol("metadata"),Dt.litPropertyMetadata??=new WeakMap;var _e=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ss){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&yo(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:i}=wo(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let d=o?.call(this);i?.call(this,r),this.requestUpdate(t,d,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ss}static _$Ei(){if(this.hasOwnProperty(dt("elementProperties")))return;let t=Eo(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(dt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(dt("properties"))){let e=this.properties,n=[...$o(e),...ko(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(bn(o))}else t!==void 0&&e.push(bn(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Cs(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:vn).toAttribute(e,n.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=n.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:vn;this._$Em=o;let d=r.fromAttribute(e,i.type);this[o]=d??this._$Ej?.get(o)??d,this._$Em=null}}requestUpdate(t,e,n,o=!1,i){if(t!==void 0){let r=this.constructor;if(o===!1&&(i=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??As)(i,e)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:i},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,i]of n){let{wrapped:r}=i,d=this[o];r!==!0||this._$AL.has(o)||d===void 0||this.C(o,void 0,i,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};_e.elementStyles=[],_e.shadowRootOptions={mode:"open"},_e[dt("elementProperties")]=new Map,_e[dt("finalized")]=new Map,Co?.({ReactiveElement:_e}),(Dt.reactiveElementVersions??=[]).push("2.1.2");var yn=globalThis,Ps=s=>s,Lt=yn.trustedTypes,Ms=Lt?Lt.createPolicy("lit-html",{createHTML:s=>s}):void 0,wn="$lit$",Se=`lit$${Math.random().toFixed(9).slice(2)}$`,$n="?"+Se,_o=`<${$n}>`,Be=document,pt=()=>Be.createComment(""),ht=s=>s===null||typeof s!="object"&&typeof s!="function",kn=Array.isArray,Is=s=>kn(s)||typeof s?.[Symbol.iterator]=="function",xn=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ds=/-->/g,Ls=/>/g,Re=RegExp(`>|${xn}(?:([^\\s"'>=/]+)(${xn}*=${xn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),js=/'/g,zs=/"/g,Bs=/^(?:script|style|textarea|title)$/i,En=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),h=En(1),ne=En(2),tl=En(3),Ae=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),Rs=new WeakMap,Ie=Be.createTreeWalker(Be,129);function Os(s,t){if(!kn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ms!==void 0?Ms.createHTML(t):t}var Ns=(s,t)=>{let e=s.length-1,n=[],o,i=t===2?"<svg>":t===3?"<math>":"",r=ct;for(let d=0;d<e;d++){let c=s[d],a,l,p=-1,m=0;for(;m<c.length&&(r.lastIndex=m,l=r.exec(c),l!==null);)m=r.lastIndex,r===ct?l[1]==="!--"?r=Ds:l[1]!==void 0?r=Ls:l[2]!==void 0?(Bs.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=Re):l[3]!==void 0&&(r=Re):r===Re?l[0]===">"?(r=o??ct,p=-1):l[1]===void 0?p=-2:(p=r.lastIndex-l[2].length,a=l[1],r=l[3]===void 0?Re:l[3]==='"'?zs:js):r===zs||r===js?r=Re:r===Ds||r===Ls?r=ct:(r=Re,o=void 0);let b=r===Re&&s[d+1].startsWith("/>")?" ":"";i+=r===ct?c+_o:p>=0?(n.push(a),c.slice(0,p)+wn+c.slice(p)+Se+b):c+Se+(p===-2?d:b)}return[Os(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},ut=class s{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let i=0,r=0,d=t.length-1,c=this.parts,[a,l]=Ns(t,e);if(this.el=s.createElement(a,n),Ie.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(o=Ie.nextNode())!==null&&c.length<d;){if(o.nodeType===1){if(o.hasAttributes())for(let p of o.getAttributeNames())if(p.endsWith(wn)){let m=l[r++],b=o.getAttribute(p).split(Se),E=/([.?@])?(.*)/.exec(m);c.push({type:1,index:i,name:E[2],strings:b,ctor:E[1]==="."?zt:E[1]==="?"?Rt:E[1]==="@"?It:Ne}),o.removeAttribute(p)}else p.startsWith(Se)&&(c.push({type:6,index:i}),o.removeAttribute(p));if(Bs.test(o.tagName)){let p=o.textContent.split(Se),m=p.length-1;if(m>0){o.textContent=Lt?Lt.emptyScript:"";for(let b=0;b<m;b++)o.append(p[b],pt()),Ie.nextNode(),c.push({type:2,index:++i});o.append(p[m],pt())}}}else if(o.nodeType===8)if(o.data===$n)c.push({type:2,index:i});else{let p=-1;for(;(p=o.data.indexOf(Se,p+1))!==-1;)c.push({type:7,index:i}),p+=Se.length-1}i++}}static createElement(t,e){let n=Be.createElement("template");return n.innerHTML=t,n}};function Oe(s,t,e=s,n){if(t===Ae)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,i=ht(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=Oe(s,o._$AS(s,t.values),o,n)),t}var jt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??Be).importNode(e,!0);Ie.currentNode=o;let i=Ie.nextNode(),r=0,d=0,c=n[0];for(;c!==void 0;){if(r===c.index){let a;c.type===2?a=new Ze(i,i.nextSibling,this,t):c.type===1?a=new c.ctor(i,c.name,c.strings,this,t):c.type===6&&(a=new Bt(i,this,t)),this._$AV.push(a),c=n[++d]}r!==c?.index&&(i=Ie.nextNode(),r++)}return Ie.currentNode=Be,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},Ze=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Oe(this,t,e),ht(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==Ae&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Is(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==w&&ht(this._$AH)?this._$AA.nextSibling.data=t:this.T(Be.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=ut.createElement(Os(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new jt(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=Rs.get(t.strings);return e===void 0&&Rs.set(t.strings,e=new ut(t)),e}k(t){kn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let i of t)o===e.length?e.push(n=new s(this.O(pt()),this.O(pt()),this,this.options)):n=e[o],n._$AI(i),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=Ps(t).nextSibling;Ps(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ne=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,i){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=w}_$AI(t,e=this,n,o){let i=this.strings,r=!1;if(i===void 0)t=Oe(this,t,e,0),r=!ht(t)||t!==this._$AH&&t!==Ae,r&&(this._$AH=t);else{let d=t,c,a;for(t=i[0],c=0;c<i.length-1;c++)a=Oe(this,d[n+c],e,c),a===Ae&&(a=this._$AH[c]),r||=!ht(a)||a!==this._$AH[c],a===w?t=w:t!==w&&(t+=(a??"")+i[c+1]),this._$AH[c]=a}r&&!o&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},zt=class extends Ne{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}},Rt=class extends Ne{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}},It=class extends Ne{constructor(t,e,n,o,i){super(t,e,n,o,i),this.type=5}_$AI(t,e=this){if((t=Oe(this,t,e,0)??w)===Ae)return;let n=this._$AH,o=t===w&&n!==w||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==w&&(n===w||o);o&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Bt=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Oe(this,t)}},Us={M:wn,P:Se,A:$n,C:1,L:Ns,R:jt,D:Is,V:Oe,I:Ze,H:Ne,N:Rt,U:It,B:zt,F:Bt},So=yn.litHtmlPolyfillSupport;So?.(ut,Ze),(yn.litHtmlVersions??=[]).push("3.3.3");var Hs=(s,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let i=e?.renderBefore??null;n._$litPart$=o=new Ze(t.insertBefore(pt(),i),i,void 0,e??{})}return o._$AI(s),o};var Tn=globalThis,he=class extends _e{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Hs(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Ae}};he._$litElement$=!0,he.finalized=!0,Tn.litElementHydrateSupport?.({LitElement:he});var Ao=Tn.litElementPolyfillSupport;Ao?.({LitElement:he});(Tn.litElementVersions??=[]).push("4.2.2");var Je="mydashlight",gl=`/api/${Je}/pair`,fl=`/api/${Je}/pair/poll`,ml=`/${Je}`,gt="pair";function Fs(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function Cn(s){return s.toUpperCase().replace(/[^A-Z0-9]/g,"")}function Ws(s){let t=new URLSearchParams(s);return t.has(gt)?Cn(t.get(gt)??""):null}function Po(s){if(s<60)return"just now";let t=Math.round(s/60);return`${t} minute${t===1?"":"s"} ago`}var ft=class extends he{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let n=await this.connection.sendMessagePromise({type:`${Je}/pair/check`,code:e});n.found?(this.waiting=n,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(n){this.error=this.message(n),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${Je}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let n=e?.code;return n==="unauthorized"?"Only a Home Assistant admin can pair a screen.":n==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":n==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return h`<form @submit=${o=>{o.preventDefault();let i=Cn(this.typed);i&&this.check(i)}}>
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
      <p class="code">${Fs(e.code??"")}</p>
      ${o?h`<p class="warning" role="alert">
            <b>This code came from outside your home network.</b> Only allow it if you can see this code on a
            screen of your own right now. If someone sent you this code or link, press Cancel.
          </p>`:w}
      <p>
        A screen at ${e.address} asked ${Po(e.age??0)}. Check the code matches the one on the screen. It will be
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
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Close</button></div>`,h`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${e}</div>`}};ft.styles=ze`
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
  `,ft.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",ft);function P(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function mt(s){let t=Math.floor(Math.round(s)/60)%24;return`${P(s)} ${t<12?"AM":"PM"}`}function Ks(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function vt(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function Vs(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Mo=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Do=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Lo=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Ot(s){return new Date(`${s}T12:00:00Z`)}function xe(s){let t=Ot(s);return`${Mo.format(t)}, ${Lo.format(t)}`}function oe(s){return Do.format(Ot(s))}function ye(s,t){return Math.round((Ot(t).getTime()-Ot(s).getTime())/864e5)}function bt(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return bt("UTC",t)}let n=o=>e.find(i=>i.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function Nt(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=bt(e,s),i=bt(e,t).date;return o.date===i?`at ${mt(o.minutes)}`:`on ${oe(o.date)} at ${mt(o.minutes)}`}var J=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},Ue="mydashlight",jo=7,Gs=3e4;function _n(s){if(s instanceof J)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new J(String(t.code??"error"),t.message)}return typeof s=="number"?new J("connection_lost","Lost the connection to Home Assistant."):new J("error",String(s))}var Ut=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new J("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},Gs),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new J("not_running","MyDashLight isn’t running right now."))},{type:`${Ue}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:Ue,service:"get_plan",service_data:{days:jo},return_response:!0});this.emit(t.response)}catch(t){this.fail(_n(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ue,service:t,service_data:e})}catch(n){throw _n(n)}this.pushing||await this.refresh()}setRide(t,e,n,o){return this.call("set_ride",{event:t,side:e,driver:n,scope:o})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:Vs(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}watchChores(t){let e=!1,n=null,o=null,i=async()=>{try{let r=await this.conn.sendMessagePromise({type:"call_service",domain:Ue,service:"get_chores",service_data:{},return_response:!0});e||t(r.response??null)}catch{e||t(null)}};return(async()=>{try{let r=await this.conn.subscribeMessage(d=>{e||t(d.chores)},{type:`${Ue}/chores/subscribe`},{resubscribe:!0});e?r().catch(()=>{}):n=r}catch{if(e)return;i(),o=setInterval(()=>void i(),Gs)}})(),()=>{e=!0,o&&clearInterval(o),n&&n().catch(()=>{})}}watchLunch(t){let e=!1,n=null;return(async()=>{try{let o=await this.conn.subscribeMessage(i=>{e||t(i.lunch)},{type:`${Ue}/lunch/subscribe`},{resubscribe:!0});e?o().catch(()=>{}):n=o}catch{e||t(null)}})(),()=>{e=!0,n&&n().catch(()=>{})}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ue,service:t,service_data:e})}catch(n){throw _n(n)}}};var qs={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ys=s=>(...t)=>({_$litDirective$:s,values:t}),Ht=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:zo}=Us,Xs=s=>s;var Zs=()=>document.createComment(""),Qe=(s,t,e)=>{let n=s._$AA.parentNode,o=t===void 0?s._$AB:t._$AA;if(e===void 0){let i=n.insertBefore(Zs(),o),r=n.insertBefore(Zs(),o);e=new zo(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,d=r!==s;if(d){let c;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(c=s._$AU)!==r._$AU&&e._$AP(c)}if(i!==o||d){let c=e._$AA;for(;c!==i;){let a=Xs(c).nextSibling;Xs(n).insertBefore(c,o),c=a}}}return e},Le=(s,t,e=s)=>(s._$AI(t,e),s),Ro={},Js=(s,t=Ro)=>s._$AH=t,Qs=s=>s._$AH,Ft=s=>{s._$AR(),s._$AA.remove()};var ei=(s,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(s[o],o);return n},Pe=Ys(class extends Ht{constructor(s){if(super(s),s.type!==qs.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],i=[],r=0;for(let d of s)o[r]=n?n(d,r):r,i[r]=e(d,r),r++;return{values:i,keys:o}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let o=Qs(s),{values:i,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,i;let d=this.ut??=[],c=[],a,l,p=0,m=o.length-1,b=0,E=i.length-1;for(;p<=m&&b<=E;)if(o[p]===null)p++;else if(o[m]===null)m--;else if(d[p]===r[b])c[b]=Le(o[p],i[b]),p++,b++;else if(d[m]===r[E])c[E]=Le(o[m],i[E]),m--,E--;else if(d[p]===r[E])c[E]=Le(o[p],i[E]),Qe(s,c[E+1],o[p]),p++,E--;else if(d[m]===r[b])c[b]=Le(o[m],i[b]),Qe(s,o[p],o[m]),m--,b++;else if(a===void 0&&(a=ei(r,b,E),l=ei(d,p,m)),a.has(d[p]))if(a.has(d[m])){let v=l.get(r[b]),x=v!==void 0?o[v]:null;if(x===null){let k=Qe(s,o[p]);Le(k,i[b]),c[b]=k}else c[b]=Le(x,i[b]),Qe(s,o[p],x),o[v]=null;b++}else Ft(o[m]),m--;else Ft(o[p]),p++;for(;b<=E;){let v=Qe(s,c[E+1]);Le(v,i[b]),c[b++]=v}for(;p<=m;){let v=o[p++];v!==null&&Ft(v)}return this.ut=r,Js(s,c),Ae}});var Wt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function ee(s){return Wt[(s%Wt.length+Wt.length)%Wt.length]}var Kt="#23272E",Sn="35,39,46";var Io=3,yt=36,An=12,ti=8,ni=30,we=16,xt=100,Fe=60,Pn=10,Gt=30,Mn=10,Bo=150,Oo=200,Yt=1.4,No=26,Dn=4;function jn(s,t){let e=Math.max(Bo,Oo/Yt);return Math.ceil(Fe+Math.max(0,s-1)*Pn+Gt+Math.max(0,t-1)*Mn+e*(s+Yt*t))}function $e(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function ue(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function ce(s){return new Map($e(s).map((t,e)=>[t,ee(e)]))}function re(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function ae(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function zn(s,t){return t==="none"?"Not needed":ue(s).includes(t)?ae(s,t):t}function Xt(s,t){return t.own?ae(s,t.own):re(s,t.kid)}var wt={color:Kt,rgb:Sn,ink:Kt};function ri(s,t){return t.own?wt:ce(s).get(t.kid)??ee(0)}function Uo(s,t){let e=$e(s);return t.along.map(n=>e.includes(n)?re(s,n):ae(s,n))}function Zt(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function Ho(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function qt(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function Vt(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(qt(t,n.from)),e.push(qt(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(qt(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Fo(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,d)=>r.s-d.s||d.en-r.en),e=[],n=[],o=-1/0,i=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(i(),o=-1/0);let d=n.findIndex(c=>c<=r.s);d<0?(d=n.length,n.push(r.en)):n[d]=r.en,r.col=d,e.push(r),o=Math.max(o,r.en)}return i(),t}function Wo(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return s[s.length-1].y}function Ko(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return s[s.length-1].t}function ai(s,t){return Wo(s.anchors,t)}function li(s,t){return Ko(s.anchors,t)}function Vo(s,t){let e=$e(s),n=ue(s),o=Math.max(t,jn(e.length,n.length)),r=(o-Fe-Math.max(0,e.length-1)*Pn-Gt-Math.max(0,n.length-1)*Mn)/(e.length+Yt*n.length||1),d=Math.floor(r),c=Math.floor(r*Yt),a=new Map;for(let E of s.days)for(let v of E.events)for(let x of v.own?v.along:[v.kid]){let k=a.get(x)??[];k.some(g=>g.event_id===v.event_id&&g.calendar_id===v.calendar_id)||k.push(v),a.set(x,k)}let l=ce(s),p=[],m=Fe;e.forEach((E,v)=>{let x=a.get(E)??[],k=s.days.some(g=>g.events.some(C=>C.kid===E&&(C.sides.includes("drop")&&C.drop===""||C.sides.includes("pick")&&C.pick==="")));p.push({id:E,kind:"kid",x:m,w:d,name:re(s,E),dot:l.get(E).color,rgb:l.get(E).rgb,sub:`${k?"Needs a ride · ":""}${x.length} this week`,subWarn:k}),m+=d+(v<e.length-1?Pn:0)});let b=m+Gt/2;return m+=Gt,n.forEach((E,v)=>{let x=0,k=0;for(let g of s.days){let C=g.drivers[E];C&&(x+=C.outings.length,k+=C.drive??0)}p.push({id:E,kind:"driver",x:m,w:c,name:ae(s,E),dot:Kt,rgb:Sn,sub:`${x} ${x===1?"trip":"trips"} this week · ${vt(k)} driving`,subWarn:!1}),m+=c+(v<n.length-1?Mn:0)}),{columns:p,sepX:b,width:o}}function Go(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function si(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${P(s.start)}`:e||!t?`${s.title} until ${P(s.end)}`:`${s.title} ${P(s.start)}–${P(s.end)}`}function Rn(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length+(s.unplaced?.length??0)}function In(s,t){let e=ye(t,s);return e===0?"Today":e===1?"Tomorrow":""}function ie(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Ln(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),o=1,i=0;for(let r of s.split(/\s+/).filter(Boolean)){let d=r.length;for(i===0?i=d:i+1+d<=n?i+=1+d:(o++,i=d);i>n;)o++,i-=n}return o}var di=25,ci=15,Bn=3;function ii(s){return Math.max(0,Math.min(Bn,Math.floor((s-di)/ci)))}function qo(s,t){let e=Math.min(Bn,Ln(s,t-19,6.6));return di+e*ci+2}function oi(s,t){let e=t-23,n=`${P(s.start)}–${P(s.end)}`+(s.arrive_by!=null?` · arrive ${P(s.arrive_by)}`:""),o=33+Ln(n,e,6.6)*16;for(let i of[s.lines.drop,s.lines.pick])i&&(o+=2+Ln(i.text,e,7)*16);return o+4}function pi(s,t,e,n){let o=t==="compact",{columns:i,sepX:r,width:d}=Vo(s,e),c=new Map(i.map(g=>[g.id,g])),a=$e(s),l=ue(s),p=[...a,...l],m=ce(s),b=Ho(s),E=g=>re(s,g),v=g=>ae(s,g),x={mode:t,width:d,height:0,columns:i,sepX:r,dayHeads:[],allDay:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},k=0;return s.days.forEach((g,C)=>{let z=C*1440,W=new Map(g.events.map(f=>[f.id,f])),te=f=>f&&W.has(f)?{day:g.date,event:f}:null,G=Rn(g),U=g.events.length,pe=In(g.date,n.date);x.dayHeads.push({date:g.date,y:k,label:xe(g.date),tag:pe,sub:(U?`${U} ${U===1?"activity":"activities"}`:"Nothing scheduled")+(G?` · ${G} to sort out`:""),warn:G>0}),x.anchors.push({t:z,y:k});let Q=Jo(s,g,m,d);Q&&x.allDay.push({...Q,y:k+yt+Dn});let ge=k+yt+An+(Q?Q.h+Dn:0),je=l.flatMap(f=>g.drivers[f]?.outings??[]);if(!U&&!je.length){x.empties.push({key:g.date,y:ge,text:"Nothing planned"}),k=ge+40,x.anchors.push({t:z+1439,y:k});return}let fe=(f,_,j,A,O,se,u,y=f.kid)=>{let S=!!f.own&&y===f.own,D=!!f.own&&y!==f.own,R=S?wt:m.get(y)??ee(0),K=S?v(y):E(y),V=D?{drop:{text:`With ${v(f.own)}`,tone:f.attending===!1?"muted":"normal"},pick:null}:f.lines,T=S?Uo(s,f):[],Z=(f.takes!=null?`${f.takes} min, any time ${P(f.start)}–${P(f.end)}`:`${P(f.start)}–${P(f.end)}`+(f.arrive_by!=null?` · arrive ${P(f.arrive_by)}`:""))+(T.length?` · with ${Zt(T)}`:"");return{key:`${g.date}|card|${f.id}`+(f.own?`|${y}`:""),x:_,y:j,w:A,h:O,target:{day:g.date,event:f.id},event:f,color:R,kidName:K,clash:se,stayed:!f.own&&f.stay&&l.includes(f.drop),skipped:f.attending===!1,title:Go(f.title,K),time:Z,drop:V.drop,pick:V.pick,showDrop:!!V.drop&&(u||O>=56),showPick:!!V.pick&&(u||O>=74),wrap:u,aria:`${K}, ${f.title} ${f.takes!=null?`any time from ${P(f.start)} to ${P(f.end)}`:`${P(f.start)} to ${P(f.end)}`}. `+(f.attending===!1&&!V.drop?"Not attending. ":"")+[V.drop,V.pick].filter($=>!!$).map($=>$.text).join(". ")}},me=f=>{let _=g.rides[f];return _?(g.drivers[_.driver]?.segments??[]).filter(A=>A.type!=="home"&&A.kids.includes(_.kid)&&ie(A.start)>=ie(_.start)&&ie(A.end)<=ie(_.end)):[]},Ce=f=>{let _=g.rides[f];if(!_)return null;let j=_.serves.find(A=>W.get(A)?.kid===_.kid);return te(j??_.serves[0])},Xe=(f,_)=>{if(_.event)return _;let j=g.events.find(A=>A.own&&A.own!==f&&A.along.includes(f)&&A.title===_.title);return j?{..._,title:`${_.title} with ${v(j.own)}`}:_},De=f=>{if(f.takes==null)return[f.start,f.end];let _=f.planned??f.start;return[_,_+f.takes]},M=new Map;for(let f of g.issues)f.level!=="problem"||!f.event||(f.kind==="late"&&M.set(f.event,`${Math.round(ie(f.minutes))} min late`),f.kind==="waiting"&&M.set(`${f.event}|pick`,`Waits ${Math.round(ie(f.minutes))} min`));if(!o){let f=1/0,_=-1/0;for(let u of g.events)u.start<=0&&u.end>=1440||(u.start>0?f=Math.min(f,u.start-20,u.arrive_by!=null?u.arrive_by-10:1/0):f=Math.min(f,u.end-30),u.end<1440?_=Math.max(_,u.end+20):_=Math.max(_,u.start+30));for(let u of je)u.start!=null&&(f=Math.min(f,u.start)),u.end!=null&&(_=Math.max(_,u.end));g.date===n.date&&Number.isFinite(f)&&n.minutes>f-60&&n.minutes<_&&(f=Math.min(f,n.minutes-15));let j=Number.isFinite(f)?Math.floor((f-5)/30)*30:900,A=Number.isFinite(_)?Math.ceil((_+5)/30)*30:960,O=u=>Math.round(ge+(Math.max(j,Math.min(A,u))-j)*Io);x.anchors.push({t:z+j,y:O(j)},{t:z+A,y:O(A)});for(let u of a){let y=c.get(u),S=m.get(u),D=(g.kids[u]?.items??[]).filter($=>$.start!=null&&$.end!=null).map($=>({item:$,s:ie($.start),en:ie($.end)})),R=[];for(let $ of Fo(D)){let L=y.w/$.cols,I=Math.round(y.x+$.col*L),H=Math.round(L-($.cols>1?4:0)),q=O($.s),F=$.item;if(F.type==="act"){let de=W.get(F.event??"");if(!de)continue;let St=Math.max(30,O($.en)-q),At=fe(de,I,q,H,St,F.clash,!1,u);if(At.layer=xt,x.cards.push(At),de.arrive_by!=null&&de.start-de.arrive_by>=5){let gn=O(de.arrive_by),ks={key:`${g.date}|prep|${de.id}`,x:I,y:gn,w:H,h:q-gn+we,color:S,label:`Arrive by ${P(de.arrive_by)}`,layer:xt-1};x.preps.push(ks),R.push({s:de.arrive_by,en:$.en,top:gn,bottom:q+St,x:I,w:H,prep:ks,card:At})}else R.push({s:$.s,en:$.en,top:q,bottom:q+St,x:I,w:H,card:At});let ws=M.get(de.id);ws&&x.marks.push({key:`${g.date}|late|${de.id}`,x:I+H-4,y:q+4,text:ws,right:!0});let $s=M.get(`${de.id}|pick`);$s&&x.marks.push({key:`${g.date}|wait|${de.id}`,x:I+4,y:q+St+2,text:$s,right:!1});continue}let B=g.rides[F.ride??-1];if(!B)continue;let ve=Math.max(22,O($.en)-q),at=Vt(me(B.index),b),vs=v(B.driver),xs={key:`${g.date}|ride|${B.index}`,x:I,y:q,w:H,h:ve,target:Ce(B.index),l1:`${B.own?"In":"Along in"} ${vs}’s car`,l2:at.join(" → "),show2:ii(ve)>0,lines2:ii(ve),dashed:!B.own,clash:F.clash,aria:`${E(u)} ${B.own?"in":"riding along in"} ${vs}’s car, ${P(ie(B.start))} to ${P(ie(B.end))}: ${at.join(" to ")}`};x.rides.push(xs);let ys=c.get(B.driver),un=null;ys&&(un={key:`${g.date}|band|${B.index}`,x:I+H,y:q,w:Math.max(0,ys.x+8-(I+H)),h:ve,color:S},x.bands.push(un)),R.push({s:$.s,en:$.en,top:q,bottom:q+ve,x:I,w:H,ride:xs,band:un})}let K=$=>$.ride?.layer??($.prep?xt-1:xt),V=($,L,I,H)=>{I>we&&x.links.push({key:`${$.key}|link`,x:$.x,y:L,w:$.w,h:I,color:S,layer:H})},T=($,L)=>{if(!(L.x<$.x||L.x+L.w>$.x+$.w)&&($.x=L.x,$.w=L.w,$.ride.x=L.x,$.ride.w=L.w,$.band)){let I=$.band.x+$.band.w;$.band.x=L.x+L.w,$.band.w=Math.max(0,I-$.band.x)}},Z=new Set;for(let $ of[...R].sort((L,I)=>I.s-L.s)){let L=$.ride;if(!L)continue;let I=R.filter(F=>F!==$&&F.s>=$.en&&F.s-$.en<=ni&&F.top>=$.bottom).sort((F,B)=>F.s-B.s||F.top-B.top)[0];if(!I)continue;Z.add($),T($,I);let H=K(I),q=I.top-$.bottom;V(L,$.bottom,q+we,H-1),L.layer=H-(q>0?2:1),L.h+=we,L.tuckBottom=we}for(let $ of[...R].sort((L,I)=>L.s-I.s)){let L=$.ride;if(!L||Z.has($))continue;let I=R.filter(F=>F!==$&&F.en<=$.s&&$.s-F.en<=ni&&F.bottom<=$.top&&(F.card||F.ride?.layer!=null)).sort((F,B)=>B.en-F.en||B.bottom-F.bottom)[0];if(!I)continue;T($,I);let H=I.ride?.layer??xt,q=$.top-I.bottom;V(L,I.bottom-we,q+we,H-1),L.layer=H-(q>0?2:1),L.y-=we,L.h+=we,L.tuckTop=we}}for(let u of l){let y=c.get(u),S=g.drivers[u];if(!S)continue;let D=[],R=null;for(let T of S.segments)if(!(T.start==null||T.end==null)){if(T.type==="home"){R=null;continue}if(T.type==="stay"){R=null,D.push({type:"stay",g:T,s:T.start,en:T.end});continue}R&&R.en===T.start?(R.en=T.end,R.legs.push(T)):(R={type:"trip",s:T.start,en:T.end,legs:[T]},D.push(R))}let K=new Set,V=(T,Z,$,L)=>{K.add(T.id);let I=O(Z),H=fe(T,y.x+8,I,y.w-16,Math.max(30,O($)-I),!1,!1,u);L&&H.drop?.tone==="normal"&&(H.drop=null,H.showDrop=!1),x.cards.push(H)};for(let T of D){let Z=O(T.s),$=Math.max(24,O(T.en)-Z);if(T.type==="stay"){let B=W.get(T.g.event??T.g.serves??"");if(B?.own===u){V(B,T.s,T.en,!0);continue}let ve=B?m.get(B.kid)??ee(0):ee(0),at=T.g.kids.map(E);x.stays.push({key:`${g.date}|stay|${u}|${T.s}`,x:y.x+8,y:Z,w:y.w-16,h:$,target:te(B?.id),color:ve,l1:B?`At ${B.title} with ${E(B.kid)}`:"Staying",l2:`until ${P(T.en)}`+(at.length?` · ${at.join(" and ")} too`:"")});continue}let L=T.legs[0],I=T.legs[T.legs.length-1],H=[];for(let B of T.legs)for(let ve of B.kids)H.includes(ve)||H.push(ve);let q=I.type==="drive"&&I.to==="home",F=Vt(T.legs,b);x.trips.push({key:`${g.date}|trip|${u}|${T.s}`,x:y.x+8,y:Z,w:y.w-16,h:$,target:te(T.legs.find(B=>B.serves)?.serves),l1:L.type==="drive"&&L.from==="home"?`Leave ${P(T.s)}`:`From ${qt(b,L.from??L.place)} ${P(T.s)}`,l2:F.join(" → "),show2:$>=36,l3:q?`Home ${P(T.en)}`:"",show3:q&&$>=62,stops:null,kids:H.map(B=>(m.get(B)??ee(0)).color),bad:T.legs.some(B=>B.overlaps_busy),aria:`${v(u)} drives ${F.join(" to ")}, ${P(T.s)} to ${P(T.en)}`})}for(let T of S.segments)if(!(!T.overlaps_busy||T.start==null||T.end==null))for(let Z of S.busy){let $=Math.max(T.start,Z.start),L=Math.min(T.end,Z.end);L<=$||x.overlaps.push({key:`${g.date}|overlap|${u}|${$}`,x:y.x+6,y:O($)-2,w:y.w-12,h:Math.max(8,O(L)-O($)+4)})}for(let T of g.events)if(T.own===u&&(K.has(T.id)||V(T,...De(T),!1),T.takes!=null&&T.attending!==!1)){let Z=O(T.start);x.windows.push({key:`${g.date}|window|${T.id}`,x:y.x+4,y:Z,w:y.w-8,h:Math.max(24,O(T.end)-Z),label:`${T.title} · any time ${P(T.start)}–${P(T.end)}`})}for(let T of S.busy){if(T.event||T.end<=j||T.start>=A)continue;let Z=Xe(u,T),$=O(Z.start),L=O(Z.end);x.busy.push({key:`${g.date}|busy|${u}|${Z.start}`,x:y.x+1,y:$,w:y.w-2,h:L-$,labelY:8,label:si(Z,!1)})}}let se=-1/0;for(let u=j;u<=A;u+=30)x.grid.push({key:`${g.date}|grid|${u}`,y:O(u),strong:u%60===0}),u%60===0&&O(u)-se>=22&&(x.hours.push({key:`${g.date}|hour|${u}`,y:O(u)-8,label:Ks(u)}),se=O(u));g.date===n.date&&n.minutes>j&&n.minutes<A&&(x.now={y:O(n.minutes),label:`Now ${P(n.minutes)}`}),k=O(A)+An;return}let Y=[];for(let f of a){let _=c.get(f);for(let j of g.kids[f]?.items??[])if(j.start!=null){if(j.type==="act"){let A=W.get(j.event??"");if(!A)continue;Y.push({col:f,s:j.start,h:oi(A,_.w),kind:"act",item:j})}else if(!g.rides[j.ride??-1]?.own){let A=g.rides[j.ride??-1],O=A?Vt(me(A.index),b).join(" → "):"";Y.push({col:f,s:j.start,h:qo(O,_.w),kind:"along",item:j})}}}for(let f of l){let _=g.drivers[f];if(!_)continue;for(let A of _.busy)A.event||Y.push({col:f,s:A.start,h:32,kind:"busy",busy:Xe(f,A)});let j=c.get(f).w;for(let A of g.events)A.own!==f||A.attending!==!1&&(A.takes==null||A.planned!=null)||Y.push({col:f,s:De(A)[0],h:oi(A,j),kind:"own",event:A});for(let A of _.outings)A.start!=null&&Y.push({col:f,s:A.start,h:30+A.lines.length*16+(A.warn?16:0),kind:"out",out:A})}Y.sort((f,_)=>f.s-_.s||p.indexOf(f.col)-p.indexOf(_.col));let N=new Map,X=[],be=ge;Y.forEach((f,_)=>{let j=N.get(f.col),A=Math.max(j!=null?j+ti:ge,be);N.set(f.col,A+f.h),be=A;let O=f.kind==="busy"?f.busy.end:f.kind==="act"?W.get(f.item.event??"")?.end??null:f.kind==="own"?De(f.event)[1]:null;X.push({col:f.col,s:f.s,end:O,y:A,h:f.h,box:null}),x.anchors.push({t:z+f.s,y:A});let se=c.get(f.col);if(f.kind==="busy"){let u={key:`${g.date}|busy|${f.col}|${_}`,x:se.x+1,y:A,w:se.w-2,h:f.h,labelY:8,label:si(f.busy,!0)};x.busy.push(u),X[X.length-1].box=u}else if(f.kind==="out"){let u=f.out;x.trips.push({key:`${g.date}|trip|${f.col}|${_}`,x:se.x+8,y:A,w:se.w-16,h:f.h,target:te(u.target),l1:u.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...u.lines.map(y=>({text:y,warn:!1})),...u.warn?[{text:u.warn,warn:!0}]:[]],kids:u.kids.map(y=>(m.get(y)??ee(0)).color),bad:!!u.warn,aria:`${v(f.col)}: ${u.lead}. ${u.lines.join(". ")}${u.warn?`. ${u.warn}`:""}`})}else if(f.kind==="own"){let u=fe(f.event,se.x+8,A,se.w-16,f.h,!1,!0,f.col);x.cards.push(u),X[X.length-1].box=u}else if(f.kind==="act"){let u=W.get(f.item.event??""),y=fe(u,se.x,A,se.w,f.h,f.item.clash,!0,f.col);x.cards.push(y),X[X.length-1].box=y}else{let u=g.rides[f.item.ride??-1],y=Vt(me(u.index),b),S=v(u.driver);x.rides.push({key:`${g.date}|ride|${u.index}`,x:se.x,y:A,w:se.w,h:f.h,target:Ce(u.index),l1:`Along with ${S} ${P(ie(u.start))}`,l2:y.join(" → "),show2:!0,lines2:Bn,dashed:!0,clash:f.item.clash,aria:`${E(f.col)} riding along with ${S}, ${P(ie(u.start))} to ${P(ie(u.end))}: ${y.join(" to ")}`})}});let le=ge;for(let f of N.values())le=Math.max(le,f);for(let f of X){if(!f.box||f.end==null)continue;let _=f.y+f.h;for(let j of X)j.col!==f.col&&j.s>=f.s&&j.s<f.end&&(_=Math.max(_,j.y+j.h));f.end>=1440&&(_=le);for(let j of X)j.col===f.col&&j.y>f.y&&(_=Math.min(_,j.y-ti));_=Math.min(_,le),_>f.y+f.h&&(f.box.h=_-f.y)}k=le+An+6,x.anchors.push({t:z+1439,y:k})}),x.height=k,x}var Yo=["","¼","½","¾"];function He(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return vt(n);let o=Math.round(n*4),i=Math.floor(o/4),r=Yo[o%4];return`${i||!r?i:""}${r} min`})}function hi(s){let t=e=>e?{...e,text:He(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(He),warn:i.warn==null?i.warn:He(i.warn)}))}])),issues:e.issues.map(n=>({...n,title:He(n.title),body:He(n.body),note:n.note==null?n.note:He(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:He(o.note)}))}:{}}))}))}}var Xo=2,Zo=48;function ui(s,t,e=Zo){let n=[],o=new Set(ue(s)),i=$e(s).map(m=>re(s,m)),r=i.length>1?i.slice(0,2):[i[0]??"Ava","Ben"],d=0,c=0,a=0,l=0,p=t.minutes+e*60;for(let m of s.days){let b=ye(t.date,m.date),E=b===0?"":`${oe(m.date)} · `,v=new Map(m.events.map(g=>[g.id,g])),x=g=>g&&v.has(g)?{day:m.date,event:g}:null,k=(g,C)=>b*1440+(g??v.get(C??"")?.start??0)<p;for(let g of m.issues)if(g.level==="problem"){if(!k(g.at,g.event)){a++,g.kind==="unassigned"&&l++;continue}d++,g.kind==="unassigned"&&c++,n.push({key:`${m.date}|${g.key}`,tone:g.kind==="unassigned"?"unassigned":"problem",title:E+g.title,body:g.body,target:x(g.event),suggestions:(g.suggestions??[]).map(C=>({id:C.id,label:C.label,note:C.note}))})}if(m.clashes.forEach((g,C)=>{if(!k(g.a.start,g.a.event)){a++;return}d++;let z=v.get(g.a.event??""),W=re(s,g.kid),te=(U,pe)=>{let Q=x(pe);return Q?{text:U,target:Q}:U},G=[];if(g.b.type==="act"){let U=v.get(g.b.event??"");z&&U&&(G=[te(z.title,z.id),` ${P(z.start)}–${P(z.end)} and `,te(U.title,U.id),` ${P(U.start)}–${P(U.end)} overlap.`])}else{let U=m.rides[g.b.ride??-1];z&&U&&(G=[`${W} is in `,te(`${ae(s,U.driver)}’s car`,U.serves[0]),` ${P(ie(g.b.start))}–${P(ie(g.b.end))}, during `,te(z.title,z.id),"."])}n.push({key:`${m.date}|clash|${C}`,tone:"problem",title:`${E}${W} is double-booked`,body:G.map(U=>typeof U=="string"?U:U.text).join(""),parts:G,target:null,suggestions:[]})}),b>=0&&b<Xo)for(let g of m.issues)g.level!=="heads_up"||!k(g.at,g.event)||n.push({key:`${m.date}|${g.key}`,tone:"heads_up",title:E+g.title,body:g.body,target:x(g.event),suggestions:[]});for(let g of m.unplaced??[]){if(!k(g.at)){a++;continue}d++;let C=g.people.map(z=>o.has(z)?ae(s,z):re(s,z));n.push({key:`${m.date}|unplaced|${g.id}`,tone:"problem",title:`${E}${P(g.at)} ${g.title}: ${gi(g).toLowerCase()}`,body:g.reason==="unknown"&&g.word?`“${g.word}” isn’t anyone in the family, so this is only in ${Zt(C)}’s lane. If it’s a misspelt name, fix the title in Google Calendar.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Start the title in Google Calendar with who it’s for, such as “${r[0]} Piano”, or “${r.join(" & ")} Piano” for both.`,target:null,suggestions:[]})}for(let g of m.events)!g.problems.length||!k(g.start)||n.push({key:`${m.date}|notes|${g.id}`,tone:"heads_up",title:`${E}Check the notes on ${Xt(s,g)}’s ${g.title}`,body:`These lines couldn’t be read: ${g.problems.join("; ")}`,target:x(g.id),suggestions:[]})}return{items:n,problems:d,unassigned:c,later:a,laterUnassigned:l}}function gi(s){return s.reason==="unknown"&&s.word?`Who is “${s.word}”?`:"Who is this for?"}function Jo(s,t,e,n){let o=new Set(ue(s)),i=l=>{let p=l[0];return p==null?null:o.has(p)?wt:e.get(p)??null},r=[...(t.all_day??[]).map(l=>({key:`${t.date}|allday|${l.id}`,title:l.title,note:l.days>1?`Day ${l.day_number} of ${l.days}`:"",color:i(l.people),cancelled:l.cancelled,warn:!1})),...(t.unplaced??[]).map(l=>({key:`${t.date}|unplaced|${l.id}`,title:`${P(l.at)} ${l.title}`,note:gi(l),color:null,cancelled:!1,warn:!0}))];if(!r.length)return null;let d=Math.max(120,n-Fe),c=1,a=0;for(let l of r){let p=Math.min(d,30+7*(l.title.length+(l.note?l.note.length+2:0)));a&&a+p>d&&(c++,a=0),a+=p}return{key:`${t.date}|allday`,h:c*No+(c-1)*Dn,chips:r}}function fi(s,t){let e=ce(s),n=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=ye(t.date,i.date);if(!(r<0))for(let d of ue(s))for(let c of i.drivers[d]?.outings??[]){if(c.start==null)continue;let a=r*1440+c.start;if(r*1440+ie(c.end,c.start)<=t.minutes)continue;let p=a-t.minutes,m={driver:d,name:ae(s,d),date:i.date,ahead:r,start:c.start,inMinutes:p,ongoing:p<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(b=>e.get(b)??ee(0)),warn:c.warn,target:c.target&&i.events.some(b=>b.id===c.target)?{day:i.date,event:c.target}:null};(!n||o(m)<o(n)||o(m)===o(n)&&m.inMinutes<n.inMinutes)&&(n=m)}}return n}function et(s){return s.state==="done"||s.state==="late"}var Qo=780;function er(s,t,e){return s.state==="open"&&!!s.for_day&&s.due===t&&e<Qo}function mi(s,t){return s.chores.map(e=>er(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function bi(s){return s.state==="open"||s.state==="overdue"}function Un(s,t,e){if(et(s)){let n=s.done_at?tr(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${On(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${On(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let o=ye(t,s.due);return`By ${o===1?"tomorrow":o<7?oe(s.due):Nn(s.due)}`}if(s.for_day&&s.due===t)return`Tonight · for ${On(s.for_day,t)}`;if(s.due&&s.due>t){let n=ye(t,s.due);return n===1?"By tomorrow":`By ${n<7?oe(s.due):Nn(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function On(s,t){let e=ye(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?oe(s):Nn(s)}function Nn(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function tr(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let i=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return i===t?r:`${oe(i)} ${r}`}function vi(s,t,e=1440){let n=mi(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=n.filter(l=>l.kid===o.id),d=new Map;for(let l of r){if(l.state!=="upcoming")continue;let p=l.shows_from??l.due??s.today;d.set(p,[...d.get(p)??[],l])}let c=r.filter(l=>l.state==="overdue"),a=r.filter(l=>l.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??ee(i),overdue:c,now:a,done:r.filter(et),later:[...d.entries()].sort(([l],[p])=>l.localeCompare(p)).map(([l,p])=>({date:l,chores:p})),left:c.length+a.length}})}function xi(s,t=1440){return mi(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function Hn(s){return!s.chores.length&&!s.templates.length}var We=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Fn(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,i]=n.split("-").map(r=>We.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function Wn(s){let t=[...new Set(s)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${We[n[0]]}-${We[n.at(-1)]}`]:n.map(o=>We[o])).join(", ")}var Ke="none";function Jt(s){return s==="daily"||s==="school"?"":"Any"}function yi(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function wi(s){let t=s.days??Jt(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function Kn(s){return s.title.trim()?s.who.length?s.days===Ke?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function $i(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function Vn(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function Gn(s,t,e=1,n=!1,o=!1){if(s==="school"){let l=t.trim().replace(/-/g,"–"),p=o?l?`${l} Bring lunch days`:"Bring lunch days":l?`${l} school days`:"Every school day";return n?`${p}, the night before`:p}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,d=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(d))return e>1?`Every day, every ${e} weeks`:"Every day";if(!d||d.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${d.replace(/-/g,"–")} ${r}`;let a=`${d.split(",").map(l=>{let p=l.trim();return p.toLowerCase()==="last"?"the last day":/^\d+$/.test(p)?`the ${Vn(Number(p))}`:`the ${p}`}).join(" and ")} ${r}`;return a[0].toUpperCase()+a.slice(1)}function qn(s,t,e=!1){let n=s.map(i=>t.find(r=>r.id===i)?.name??i);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function Yn(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function Qt(s,t){return`${s}|${t}`}function tt(s,t){let[e,n,o]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function en(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function ki(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function Ei(s,t){return en(t)<5&&!ki(s,t)}function $t(s,t,e=new Map){if(!Ei(s,t))return null;let n=Qt(s.id,t);if(e.has(n)){let i=e.get(n);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[t];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function nt(s,t){return Ei(s,t)?s.menus?.[t]??null:null}var nr="From the school's menu feed.";function sr(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==nr);return t.length?t.join(`
`):null}function ke(s){return s.slice(0,7)}function tn(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function Xn(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function Ti(s){let t=[];for(let e=ke(s.first);e<=ke(s.last);e=Xn(e))t.push(e);return t}function Ci(s,t,e,n=new Map){let o=`${e}-01`,i=tt(o,-en(o)),r=[];for(;ke(i)<=e;){let d=[];for(let c=0;c<5;c++){let a=tt(i,c),l=ke(a)!==e,p=l?null:ki(t,a),m=l?null:$t(t,a,n);d.push({date:a,day:Number(a.slice(8)),outside:l,off:p?p.title:null,lunch:m?.lunch??null,picked:m?.picked??!1,menu:l?null:nt(t,a)?.dish??null,sides:l?null:sr(nt(t,a)?.details??""),past:a<s.today,today:a===s.today})}d.some(c=>!c.outside)&&r.push(d),i=tt(i,7)}return r}function _i(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function Si(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function Ai(s,t,e,n=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=tt(t,i),d=$t(s,r,n);if(!d)continue;let c=ye(t,r);return{lunch:d.lunch,when:c===0?"today":c===1?"tomorrow":oe(r),date:r,menu:nt(s,r)?.dish??null}}return null}var ir={timeline:"timeline",full:"timeline",compact:"compact"};function Zn(s){let t=new URLSearchParams(s),e={},n=ir[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),e}var Pi=ze`
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
  /* All-day events across the top of a day, for nobody. */
  .allday {
    position: absolute;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 4px;
    overflow: hidden;
    pointer-events: none;
  }
  .ad-chip {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    max-width: 100%;
    height: 26px;
    padding: 0 10px;
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
`;var mo="mydashlight.rides.mode",Ra=1100,Ia=440,Ba=700,Oa=3*6e4,Na=1200;function Ua(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var pn=ne`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,ho=ne`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Ha=new URL("emoji.json",import.meta.url).href,uo=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],go=ne`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,fo=ne`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Fa=ne`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Wa=ne`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Tt={bring:"Bring",buy:"Buy"};function Ka(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function Te(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function bs(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Va(s,t){return In(s,t)||xe(s).split(",")[0]}function Ga(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function qa(){try{return localStorage.getItem(mo)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Ya(s){try{localStorage.setItem(mo,s)}catch{}}function hn(s){return s.days.every(t=>!t.events.length)}var Ct=class extends he{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Zn(location.search).view;this.urlPage=Zn(location.search).page;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,i=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(i)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}n.el.scrollTop=n.top-i,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Oa))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??qa(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,d]=o.split("|"),c=e.kids.find(a=>a.id===r);(!c||(c.picks[d]??null)===i||!$t(c,d))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&et(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(i=>i.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=hi(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Ra)return!1;let e=this.plan;return!e||this.width-Ia>=jn($e(e).length,ue(e).length)}today(){return bt(this.plan?.time_zone??Ua())}currentBoard(){let e=this.plan;if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;return(this.board==null||e!==this.boardPlan||o!==this.boardKey)&&(this.board=pi(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n){let o=this.scroller;if(!o||!this.board)return;let i=this.board.dayHeads.find(r=>r.date===n)?.y??0;o.scrollTop=Math.max(i,ai(this.board,e)-yt-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),n=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(n*1440+(this.mode==="timeline"&&n===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[n]?.date)}goToDay(e){let n=this.plan;if(!n)return;let o=this.today();if(e===o.date){this.scrollToNow();return}let i=this.dayIndexOf(e),r=n.days[i];if(!r)return;let d=1/0;if(this.mode==="timeline"){for(let c of r.events)d=Math.min(d,c.arrive_by??c.start);for(let c of Object.values(r.drivers))for(let a of c.outings)a.start!=null&&(d=Math.min(d,a.start))}this.scrollToTime(i*1440+(Number.isFinite(d)?Math.max(0,d-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let a of this.board.dayHeads)a.y<=n+1&&(o=a);let i=this.renderRoot,r=i.querySelector(".pinned .label"),d=i.querySelector(".pinned .tag"),c=i.querySelector(".pinned .sub");r&&r.textContent!==o.label&&(r.textContent=o.label),d&&(d.textContent!==o.tag&&(d.textContent=o.tag),d.hidden=!o.tag),c&&c.textContent!==o.sub&&(c.textContent=o.sub),c?.classList.toggle("warn",o.warn);for(let a of i.querySelectorAll(".day-tile"))a.classList.toggle("in-view",a.dataset.date===o.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,o),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let d=new Map(this.choreDraft);d.delete(e.id),this.choreDraft=d;let c=r instanceof J?r:new J("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??et(e)}editMenu(e,n){let o=this.lunch?.kids??[],i=nt(e,n),r=o.filter(d=>d.id===e.id||i&&nt(d,n)?.dish===i.dish).map(d=>d.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let i=o instanceof J?o:new J("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let i=new Map(this.lunchDraft);for(let r of n)i.set(Qt(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,n,o)}catch(r){let d=new Map(this.lunchDraft);for(let a of n)d.delete(Qt(e,a));this.lunchDraft=d;let c=r instanceof J?r:new J("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?wi(e):yi(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(po(),co))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||Kn(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate($i(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof J?n:new J("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof J?n:new J("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller;this.keepAt=n&&this.board?li(this.board,n.scrollTop+yt+4):null,this.mode=e,this.urlView||Ya(e)}findEvent(e){let n=this.plan?.days.find(i=>i.date===e.day),o=n?.events.find(i=>i.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(i){let r=i instanceof J?i:new J("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o){if(!this.backend)return;let i=this.backend;this.save(`${n}`,o,()=>i.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e){if(!this.backend)return;let n=this.backend;this.save("stay",!e.stay,()=>n.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,d=r.includes(n)?r.filter(c=>c!==n):[...r,n];this.save(`along-${o}`,d,()=>i.setTakeAlong(e.id,d,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,i;n<0?i=(o??e.start)-5:i=o==null||o+5>=e.start?null:o+5,this.arriveDraft=i,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Na)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,d=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,d)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=e?ui(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},i=this.wide,r=this.chores?xi(this.chores,this.today().minutes).filter(p=>!this.choreDone(p)):[],d=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,c=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",a=h`<aside class="panel" aria-label=${c}>
      ${d??(this.sel&&e?this.renderEditor(e):this.renderAttention(o,r))}
    </aside>`,l=this.page==="rides";return h`
      <div class="app ${i?"wide":this.width<Ba?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,o,r.length)} ${l&&e?this.renderWeek(e):w}
          ${l?this.renderBanner(e):w}
          <main>
            ${l?h`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?hn(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                </section>`:this.page==="lunch"?h`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:h`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!i&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?h`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${a}`:w}
          </main>
        </div>
        ${i?a:w}
        ${this.toast?h`<div class="toast" role="status">${this.toast}</div>`:w}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let i=n.problems+o;this.tick;let r=this.today(),d="";if(e){let m=e.time_zone,b=new Date(e.updated);this.error?d=h`<span class="bad">Can’t reach Home Assistant · showing the plan from ${Nt(b,new Date,m)}</span>`:e.status&&!e.status.ok?d=h`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Nt(b,new Date,m)}</span>`:this.backend?.live||(d=`Updated ${Nt(b,new Date,m)}`)}let c=(m,b,E,v)=>h`
      <button type="button" class="seg-btn" title=${v} aria-pressed=${this.mode===m?"true":"false"} @click=${()=>this.setMode(m)}>
        ${E}<span class="seg-label">${b}</span>
      </button>
    `,a=(m,b,E)=>h`
      <button type="button" class="seg-btn" aria-pressed=${this.page===m?"true":"false"} @click=${()=>this.setPage(m)}>
        ${E}<span class="seg-label">${b}</span>
      </button>
    `,l=mt(r.minutes),p=!!e&&hn(e);return h`
      <header>
        ${this.showMenu?h`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${ne`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:w}
        <div class="titles">
          <h1 class="clock" aria-label=${`${xe(r.date)}, ${l}`}>
            <span class="hm">${l.slice(0,-3)}</span><span class="ampm">${l.slice(-2)}</span>
          </h1>
          <p class="today-line">${xe(r.date)}</p>
          ${d?h`<p class="status">${d}</p>`:w}
        </div>
        ${e&&!p?this.renderNext(e,fi(e,r),n):w}
        <div class="controls">
          ${this.wide||p&&!o?w:h`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?w:h`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",ne`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",ne`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${a("rides","Rides",ne`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${a("chores","Chores",ne`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?w:a("lunch","Lunch",ne`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let a=this.today().date,l=o.unassigned,p=o.laterUnassigned;if(l){let b=h`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${l} ${l===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?h`<div class="next idle needs">${b}</div>`:h`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${b}</button>`}if(p)return h`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${p} ${p===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let m=e.days.some(b=>b.date>=a&&b.events.length);return h`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${m?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${m?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let i;n.ongoing?i="On the road now":n.ahead===0?i=n.inMinutes<180?`Next trip · in ${vt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${oe(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,d=h`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Te(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(a=>h`<span class="kid-dot" style="background:${a.color}"></span>`)}</span>
      </span>
      ${n.warn?h`<span class="next-stop warn">${n.warn}</span>`:n.stop?h`<span class="next-stop">${n.stop}</span>`:w}
    `,c=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?h`<button type="button" class=${c} @click=${()=>this.open(n.target)}>${d}</button>`:h`<div class=${c}>${d}</div>`}renderWeek(e){let n=this.today().date,o=ce(e);return h`<nav class="week" aria-label="Days">
      ${e.days.map(i=>{let r=Rn(i),d=i.events.length,c=i.events.slice(0,6).map(l=>l.own?wt.color:o.get(l.kid)?.color??ee(0).color),a=`${xe(i.date)}: ${d?`${d} ${d===1?"activity":"activities"}`:"nothing planned"}${r?`, ${r} to sort out`:""}`;return h`<button
          type="button"
          class="day-tile ${i.date===n?"today":""}"
          data-date=${i.date}
          aria-label=${a}
          @click=${()=>this.goToDay(i.date)}
        >
          <span class="dt-wd">${i.date===n?"Today":oe(i.date)}</span>
          <span class="dt-num">${Number(i.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${c.length?c.map(l=>h`<span class="dt-dot" style="background:${l}"></span>`):h`<span class="dt-free">free</span>`}
            ${d>6?h`<span class="dt-more">+${d-6}</span>`:w}
          </span>
          ${r?h`<span class="dt-badge" aria-hidden="true">${r}</span>`:w}
        </button>`})}
    </nav>`}renderQuiet(e){let n=$e(e),o=ue(e),i=ce(e),r=n.map(d=>re(e,d));return h`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((d,c)=>ne`<circle cx=${50+c*30} cy="80" r="11" fill=${i.get(d).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Ga(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(d=>{let c=i.get(d);return h`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${Te(re(e,d))}</span>
            <span class="qw-name">${re(e,d)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(d=>h`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Te(ae(e,d))}</span>
            <span class="qw-name">${ae(e,d)}</span>
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
      </div>`:h`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let n=this.sel,o=a=>!!a&&!!n&&a.day===n.day&&a.event===n.event,i=e.dayHeads[0],r=e.width,d=100,c=[...e.links.map(a=>({t:"link",x:a,z:a.layer??0})),...e.preps.map(a=>({t:"prep",x:a,z:a.layer??d-1})),...e.cards.map(a=>({t:"card",x:a,z:a.layer??d})),...e.rides.map(a=>({t:"ride",x:a,z:a.layer??d+1}))].sort((a,l)=>a.z-l.z);return h`
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
              <span class="avatar ${a.kind}" aria-hidden="true">${Te(a.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${a.name}</span>${a.kind==="kid"?this.renderLunchChip(a.id,!0):w}</span>
                <span class="sub ${a.subWarn?"warn":""}">${a.sub}</span>
              </span>
            </div>`)}
        </div>
        <div class="pinned" aria-hidden="true" style="width:${r}px">
          <span class="label">${i?.label??""}</span><span class="tag" ?hidden=${!i?.tag}>${i?.tag??""}</span
          ><span class="sub ${i?.warn?"warn":""}">${i?.sub??""}</span>
        </div>
        <div class="canvas" style="width:${r}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(a=>h`<div
                class="col-bg ${a.kind}"
                style="left:${a.x}px;width:${a.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${a.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(a=>h`<div class="day-head" style="top:${a.y}px;width:${r}px">
              <span class="label">${a.label}</span>${a.tag?h`<span class="tag">${a.tag}</span>`:w}<span
                class="sub ${a.warn?"warn":""}"
                >${a.sub}</span
              >
            </div>`)}
          ${e.allDay.map(a=>h`<div class="allday" style="top:${a.y}px;left:${Fe}px;width:${r-Fe}px;height:${a.h}px">
              ${a.chips.map(l=>h`<span
                    class="ad-chip ${l.warn?"warn":""} ${l.cancelled?"skipped":""} ${l.color?"":"plain"}"
                    style=${l.color?`--c:${l.color.color};--rgb:${l.color.rgb};--ink:${l.color.ink}`:""}
                    ><span class="ad-title">${l.title}</span>${l.note?h`<span class="ad-note">${l.note}</span>`:w}</span
                  >`)}
            </div>`)}
          ${e.empties.map(a=>h`<span class="empty" style="top:${a.y}px">${a.text}</span>`)}
          ${e.grid.map(a=>h`<div class="grid ${a.strong?"strong":""}" style="top:${a.y}px;width:${r-60}px"></div>`)}
          ${e.hours.map(a=>h`<span class="hour" style="top:${a.y}px">${a.label}</span>`)}
          ${Pe(e.bands,a=>a.key,a=>h`<div
                class="band"
                aria-hidden="true"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;background:rgba(${a.color.rgb},0.10);border-color:rgba(${a.color.rgb},0.45)"
              ></div>`)}
          ${Pe(e.busy,a=>a.key,a=>h`<div class="busy" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span style="top:${a.labelY}px">${a.label}</span>
              </div>`)}
          ${Pe(e.windows,a=>a.key,a=>h`<div class="window" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span>${a.label}</span>
              </div>`)}
          ${Pe(c,a=>a.x.key,a=>{if(a.t==="link"){let b=a.x;return h`<div
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
                </button>`}let l=a.x,p=l.color,m=l.skipped?`repeating-linear-gradient(135deg, rgba(${p.rgb},0.10) 0px, rgba(${p.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:l.stayed?`repeating-linear-gradient(135deg, rgba(${p.rgb},0.24) 0px, rgba(${p.rgb},0.24) 6px, rgba(${p.rgb},0.08) 6px, rgba(${p.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${p.rgb},0.15), rgba(${p.rgb},0.15)), var(--surface)`;return h`<button
                type="button"
                class="card ${l.wrap?"wrap":""} ${o(l.target)?"sel":""} ${l.clash?"clash":""} ${l.skipped?"skipped":""}"
                aria-label=${l.aria}
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;background:${m};border-color:${l.clash?"var(--bad)":`rgba(${p.rgb},0.45)`};--c:${p.color};--rgb:${p.rgb};--ring:${p.color}"
                @click=${()=>this.open(l.target)}
              >
                <span class="top">
                  <span class="title">${l.title}</span>
                  <span class="time">${l.time}</span>
                  ${l.showDrop&&l.drop?h`<span class="line tone-${l.drop.tone}">${l.drop.text}</span>`:w}
                </span>
                ${l.showPick&&l.pick?h`<span class="line tone-${l.pick.tone}">${l.pick.text}</span>`:w}
              </button>`})}
          ${Pe(e.stays,a=>a.key,a=>h`<button
                type="button"
                class="stay"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;border-color:${a.color.color};background:repeating-linear-gradient(135deg, rgba(${a.color.rgb},0.28) 0px, rgba(${a.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1" style="color:${a.color.ink}">${a.l1}</span><span class="l2">${a.l2}</span>
              </button>`)}
          ${Pe(e.trips,a=>a.key,a=>h`<button
                type="button"
                class="trip ${a.bad?"bad":""} ${a.stops?"list":""}"
                aria-label=${a.aria}
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1">${a.l1}${a.kids.map(l=>h`<span class="kid-dot" style="background:${l}"></span>`)}</span>
                ${a.show2?h`<span class="l2">${a.l2}</span>`:w}
                ${a.stops?a.stops.map(l=>h`<span class="stop ${l.warn?"warn":""}">${l.text}</span>`):w}
                ${a.show3?h`<span class="l3">${a.l3}</span>`:w}
              </button>`)}
          ${Pe(e.overlaps,a=>a.key,a=>h`<div class="overlap" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"></div>`)}
          ${Pe(e.marks,a=>a.key,a=>h`<span class="mark" style="left:${a.x}px;top:${a.y}px;${a.right?"transform:translateX(-100%)":""}">${a.text}</span>`)}
          ${e.now?h`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${r-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:w}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:i,later:r}=e,d=this.plan,c=i+n.length,a=this.chores,l=!!a&&!Hn(a);return h`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?w:h`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${l?h`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?h`<div class="attn-chores">${n.map(p=>this.renderChoreRow(p,!0))}</div>`:h`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:h`<p class="panel-sub">Rides in the next two days</p>`}
      ${d&&!i?h`<div class="all-clear">
            <span class="check" aria-hidden="true">${ne`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${hn(d)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:w}
      ${o.map(p=>h`<div class="issue ${p.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${p.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${p.target?h`<button type="button" class="issue-title" @click=${()=>this.open(p.target,!0)}>${p.title}</button>`:h`<strong class="issue-title">${p.title}</strong>`}
              <span class="issue-body"
                >${p.parts?p.parts.map(m=>typeof m=="string"?m:h`<button type="button" class="issue-link" @click=${()=>this.open(m.target,!0)}>${m.text}</button>`):p.body}</span
              >
            </div>
          </div>
          ${p.suggestions.length?h`<div class="fixes">
                ${p.suggestions.map(m=>h`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(m.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${m.id}`?"Saving…":m.label}</span>
                    <span class="fix-note">${m.note}</span>
                  </button>`)}
              </div>`:w}
        </div>`)}
      ${this.wide&&d&&!hn(d)&&this.page==="rides"?this.renderLegend():w}
    `}kidColorOf(e){let n=this.plan?ce(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return ee(Math.max(0,o))}renderLunchChip(e,n=!1){let o=this.lunch,i=o?.kids.find(a=>a.id===e);if(!o||!i)return w;this.tick;let r=this.today(),d=Ai(i,r.date,r.minutes,this.lunchDraft);if(!d)return w;let c=Tt[d.lunch];return h`<span class="lunch-chip ${d.lunch} ${n?"small":""}" title=${`${c} lunch ${d.when}${d.menu?`: ${d.menu}`:""}`}
      >${d.lunch==="bring"?go:fo}<span class="lunch-chip-text"
        >${c}${n?w:` ${d.when}`}${!n&&d.menu?h`<span class="lunch-chip-menu"> · ${d.menu}</span>`:w}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return h`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return h`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=Ti(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:ke(e.today),i=n.indexOf(o),r=l=>{let p=n[i+l];p&&(this.lunchMonth=p)},d=e.kids.some(l=>l.id===this.lunchKid)?this.lunchKid:null,c=d?e.kids.filter(l=>l.id===d):e.kids,a=e.status&&!e.status.ok?h`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:w;return h`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${ne`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${tn(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${i<0||i>=n.length-1} @click=${()=>r(1)}>
            ${ne`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":h`${ho} Edit menus`}
        </button>
      </div>
      ${a}
      <div class="chore-cols lunch-cols ${d?"wide":""}" style="--n:${c.length}">
        ${c.map(l=>this.renderLunchCard(e,l,o,d!==null))}
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
    </div>`}renderLunchCard(e,n,o,i){let r=this.kidColorOf(n.id),d=Ci(e,n,o,this.lunchDraft),c=Si(d),a=d.flat(),l=a.filter(v=>!v.outside&&!v.past&&v.lunch),p=n.days_off.filter(v=>ke(v.first)<=o&&o<=ke(v.last)),m=v=>l.filter(x=>en(x.date)===v),b=v=>{let x=m(v);if(!x.length)return;let k=x.every(g=>g.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,x.map(g=>g.date),k)},E=l.length?`${c.bring} Bring · ${c.buy} Buy${o===ke(e.today)?" left this month":""}`:"No school days left this month";return h`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Te(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${E}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Tt[n.default]} unless picked</span>
          ${e.kids.length<2?w:h`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:n.id}
              >
                ${i?Wa:Fa}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?h`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:w}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${tn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((v,x)=>h`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!m(x).length}
            aria-label=${`${m(x).every(k=>k.lunch==="bring")?"Buy":"Bring"} every ${v} left in ${tn(o)} for ${n.name}`}
            @click=${()=>b(x)}
          >
            ${v}
          </button>`)}
        ${a.map(v=>this.renderLunchCell(n,v,i))}
      </div>
      ${p.length?h`<p class="lunch-offs">
            No school:
            ${p.map(v=>{let x=v.first<`${o}-01`?`${o}-01`:v.first,k=ke(v.last)>o?tt(`${Xn(o)}-01`,-1):v.last;return`${x===k?bs(x):`${bs(x)}–${bs(k)}`} ${_i(v.title)}`}).join(" · ")}
          </p>`:w}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return h`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return h`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=n.lunch,r=i==="buy"?"bring":"buy",d=n.menu?`, ${n.menu}`:"",c=this.menuMode,a=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),l=c?`${e.name}, ${xe(n.date)}${d||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${xe(n.date)}: ${Tt[i]}${n.picked?"":" (not picked yet)"}${d}. Tap to ${Tt[r]}.`;return h`<button
      type="button"
      class="lunch-day ${i} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${c?"editing":""} ${a?"sel":""}"
      ?disabled=${n.past&&!c}
      aria-label=${l}
      @click=${()=>c?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${i==="bring"?go:fo}${Tt[i]}</span>
      ${n.menu?h`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?h`<span class="lunch-sides">${n.sides}</span>`:w}`:c?h`<span class="lunch-menu add">${pn} Menu</span>`:w}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex(k=>k.id===e.kid),d=(this.plan?ce(this.plan).get(e.kid):void 0)??ee(Math.max(0,r)),c=o.kids[r]?.name??"",a=i===et(e)?e:{...e,state:i?"done":"open",done_at:i?new Date().toISOString():null},l=i&&a.done_by&&a.done_by!==e.kid?o.people?.find(k=>k.id===a.done_by)?.name??a.done_by_name??null:null,p=`${Un(a,o.today,o.time_zone)}${l?` · by ${l}`:""}`,m=i||bi(e),b=`${n?`${c}: `:""}${e.title}. ${p?`${p}. `:""}${i?"Done. Tap to undo.":"Tap when it’s done."}`,E=h`<span class="box" aria-hidden="true"
        >${i?ne`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:w}</span
      >
      ${e.icon?h`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:w}
      <span class="chore-text">
        <span class="chore-title">${n?h`<span class="chore-kid">${c}</span> · `:w}${e.title}</span>
        ${p?h`<span class="chore-note">${p}</span>`:w}
      </span>`,v=`chore ${i?"done":""} ${e.state==="overdue"&&!i?"overdue":""} ${m?"":"later"}`,x=`--c:${d.color};--rgb:${d.rgb};--k:${d.ink}`;return m?h`<button type="button" class=${v} style=${x} aria-pressed=${i?"true":"false"} aria-label=${b} @click=${()=>this.tapChore(e)}>
          ${E}
        </button>`:h`<div class=${v} style=${x}>${E}</div>`}renderChores(){let e=this.chores;if(e===void 0)return h`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return h`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return h`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return h`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(Hn(e))return h`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${pn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?h`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:w;this.tick;let i=vi(e,this.plan?ce(this.plan):void 0,this.today().minutes);return h`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${pn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${ho} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${i.length}">
        ${i.map(r=>{let d=r.overdue.filter(c=>!this.choreDone(c)).length+r.now.filter(c=>!this.choreDone(c)).length;return h`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Te(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${d?`${d} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?h`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(c=>this.renderChoreRow(c))}`:w}
            ${r.now.length?h`<h3 class="chore-group">To do</h3>
                  ${r.now.map(c=>this.renderChoreRow(c))}`:w}
            ${r.done.length?h`<h3 class="chore-group">Done</h3>
                  ${r.done.map(c=>this.renderChoreRow(c))}`:w}
            ${r.later.map(c=>h`<h3 class="chore-group">${c.date===e.today?"Later today":Va(c.date,e.today)}</h3>
                ${c.chores.map(a=>this.renderChoreRow(a))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?h`<p class="chore-none">No chores this week.</p>`:w}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,i=this.plan?ce(this.plan):void 0,r=this.choreEdit?.template===e.id,d=e.problems.length?h`<span class="tmpl-note bad">${e.problems.map(Yn).join(" · ")} · tap to set up</span>`:h`<span class="tmpl-note">${qn(e.who,o,e.take_turns)} · ${Gn(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return h`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?h` <span class="tag-paused">Paused</span>`:w}</span>
        ${d}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let a=o.findIndex(p=>p.id===c),l=i?.get(c)??ee(Math.max(0,a));return h`<span class="kid-dot" style="background:${l.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return h`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${pn} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([o,i])=>{let r=e.templates.filter(d=>d.repeats===o);return r.length?h`<section class="manage-group" aria-label=${i}>
                  <h3 class="chore-group">${i}</h3>
                  <div class="tmpl-list">${r.map(d=>this.renderTemplateRow(d))}</div>
                </section>`:w}):h`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return h``;let o=n.kids,i=this.plan?ce(this.plan):void 0,r=this.choreBusy,d=e.template?n.templates.find(v=>v.id===e.template):void 0,c=Kn(e),a=(d?.problems??[]).filter(v=>v!=="who:"),l=(v,x,k,g=!1)=>h`<button type="button" class="choice ${g?"wide":""}" aria-pressed=${v?"true":"false"} ?disabled=${r} @click=${k}>${x}</button>`,p=(v,x,k,g)=>h`<button type="button" class="chip" aria-pressed=${v?"true":"false"} aria-label=${g??w} ?disabled=${r} @click=${k}>${x}</button>`,m=v=>{v!==e.repeats&&this.changeDraft({repeats:v,days:d&&d.repeats===v?d.days??Jt(v):Jt(v)})},b=v=>{let x=e.who.includes(v)?e.who.filter(k=>k!==v):o.filter(k=>k.id===v||e.who.includes(k.id)).map(k=>k.id);this.changeDraft({who:x})},E;if(e.repeats==="school"){let v=e.days===Ke?new Set:e.days===""?new Set([0,1,2,3,4]):Fn(e.days)??new Set,x=k=>{let g=new Set(v);g.has(k)?g.delete(k):g.add(k),this.changeDraft({days:g.size===5?"":g.size?Wn(g):Ke})};E=h`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${We.slice(0,5).map((k,g)=>p(v.has(g),k.slice(0,2),()=>x(g),k))}
          </div>
          <p class="field-hint">Weekdays with no “No School” event on the kid’s calendar.</p>
        </div>
        <div class="field">
          <span class="field-label">When</span>
          <div role="group" aria-label="When" class="choices" style="grid-template-columns:1fr 1fr">
            ${l(!e.night_before,"That morning",()=>this.changeDraft({night_before:!1}))}
            ${l(e.night_before,"The night before",()=>this.changeDraft({night_before:!0}))}
          </div>
          <p class="field-hint">${e.night_before?"Due the evening before each school day: Sunday for Monday.":"Due on the school day itself."}</p>
        </div>
        <div class="field">
          ${l(e.bring_only,e.bring_only?"Only on Bring lunch days":"Every school day, Bring or Buy",()=>this.changeDraft({bring_only:!e.bring_only}),!0)}
          <p class="field-hint">${e.bring_only?"Made only when the kid brings lunch, like Pack lunch.":"Tap to make it only on Bring lunch days, like Pack lunch."}</p>
        </div>`}else if(e.repeats==="monthly"){let v=e.days.trim(),x=/^\d+$/.test(v)?Number(v):null,k=v&&v.toLowerCase()!=="any"&&v.toLowerCase()!=="last"&&x===null;E=h`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${k?4:3}, minmax(0, 1fr))">
          ${l(v===""||v.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${l(x!==null,"On a date",()=>this.changeDraft({days:String(x??1)}))}
          ${l(v.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${k?l(!0,v,()=>{}):w}
        </div>
        ${x!==null?h`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||x<=1} @click=${()=>this.changeDraft({days:String(x-1)})}>−</button>
                <span class="arrive-value">${Vn(x)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||x>=31} @click=${()=>this.changeDraft({days:String(x+1)})}>+</button>
              </span>
            </div>`:h`<p class="field-hint">${v.toLowerCase()==="last"?"Due on the month’s last day.":k?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")E=h`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let v=e.days===""||e.days.toLowerCase()==="any",x=e.days===Ke?new Set:v?new Set:Fn(e.days)??new Set,k=g=>{let C=new Set(x);C.has(g)?C.delete(g):C.add(g),this.changeDraft({days:C.size?Wn(C)||"Mon-Sun":Ke})};E=h`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${l(v,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${l(!v,"On set days",()=>this.changeDraft({days:v?"Sat":e.days}))}
        </div>
        ${v?h`<p class="field-hint">Shows all week, due on Sunday.</p>`:h`<div role="group" aria-label="Days of the week" class="day-chips">
                ${We.map((g,C)=>p(x.has(C),g.slice(0,2),()=>k(C),g))}
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
          <span class="ed-meta">${e.who.length?qn(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===Ke?"No days picked":Gn(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${a.length?h`<p class="field-hint bad">${a.map(Yn).join(". ")}. Saving fixes it.</p>`:w}
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
          ${uo.map(v=>p(e.icon===v,v,()=>this.changeDraft({icon:e.icon===v?null:v}),`Picture ${v}`))}
          ${e.icon&&!uo.includes(e.icon)?p(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):w}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?h`<emoji-picker
              class="emoji-more"
              .dataSource=${Ha}
              @emoji-click=${v=>{let x=v.detail.unicode;x&&this.changeDraft({icon:x}),this.iconMore=!1}}
            ></emoji-picker>`:w}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((v,x)=>{let k=i?.get(v.id)??ee(x),g=e.who.includes(v.id);return h`<button type="button" class="who-chip" style="--c:${k.color};--rgb:${k.rgb}" aria-pressed=${g?"true":"false"} ?disabled=${r} @click=${()=>b(v.id)}>
              <span class="avatar" aria-hidden="true">${Te(v.name)}</span>${v.name}
            </button>`})}
        </div>
        ${e.who.length>1?h`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${l(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${l(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:w}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${l(e.repeats==="daily","Every day",()=>m("daily"))}
          ${l(e.repeats==="weekly","Every week",()=>m("weekly"))}
          ${l(e.repeats==="monthly","Every month",()=>m("monthly"))}
          ${l(e.repeats==="school","School days",()=>m("school"))}
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
        <span class="field-label every-unit">${Ka(e.repeats,e.every)}</span>
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
              ${l(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${r} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:w}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!c} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":c?c.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return h``;let o=e.busy,i=l=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...l})},r=l=>i({kids:e.kids.includes(l)?e.kids.filter(p=>p!==l):[...e.kids,l]}),d=n.kids.filter(l=>$t(l,e.date)),c=e.dish.trim(),a=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return h`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${xe(e.date)}</span>
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
          @input=${l=>i({dish:l.target.value})}
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
          @input=${l=>i({details:l.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${d.map(l=>{let p=this.kidColorOf(l.id),m=e.kids.includes(l.id);return h`<button type="button" class="who-chip" style="--c:${p.color};--rgb:${p.rgb}" aria-pressed=${m?"true":"false"} ?disabled=${o} @click=${()=>r(l.id)}>
              <span class="avatar" aria-hidden="true">${Te(l.name)}</span>${l.name}
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
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return h``;let o=n.people?.length?n.people:n.kids.map(p=>({...p,role:"kid"})),i=n.kids.findIndex(p=>p.id===e.kid),r=n.kids[i],d=this.plan?ce(this.plan):void 0,c=d?.get(e.kid)??ee(Math.max(0,i)),a=o.filter(p=>p.id!==e.kid),l=p=>{let m=n.kids.findIndex(b=>b.id===p.id);return m>=0?(d?.get(p.id)??ee(m)).color:"var(--dark)"};return h`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?h`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:w}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${Un(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${c.color};--rgb:${c.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${Te(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?h`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${a.map(p=>h`<button type="button" class="done-by" style="--c:${l(p)}" @click=${()=>void this.toggleChore(e,p.id)}>
                  <span class="avatar ${p.role==="parent"?"driver":""}" aria-hidden="true">${Te(p.name)}</span>
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
    </div>`}ownHint(e,n){let o=Xt(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${P(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${P(n.start)} to ${P(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=n.along.map(r=>ue(e).includes(r)?ae(e,r):re(e,r));return`${o} drives there and back${i.length?`, with ${Zt(i)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return h``;let{day:o,event:i}=n,r=ue(e),d=ri(e,i),c=Xt(e,i),a=!!this.pending,l=M=>this.pending?.key===M?this.pending.value:void 0,p=[...e.people?.carpools??[]];for(let M of e.days)for(let Y of M.events)for(let N of[Y.drop,Y.pick])N&&N!=="none"&&!r.includes(N)&&!p.some(X=>X.toLowerCase()===N.toLowerCase())&&p.push(N);let m=M=>{if(!i.sides.includes(M))return w;let Y=l(M),N=Y!==void 0?String(Y):M==="drop"?i.drop:i.pick,X=N&&N!=="none"&&!r.includes(N)?N:"",be=f=>this.setRide(i,M,N===f?"":f),le=[...r.map(f=>[f,zn(e,f)]),["none","Not needed"]];return h`<div class="field">
        <span class="field-label">${M==="drop"?"Drop-off":"Pick-up"} ${N===""?h`<span class="nobody">· nobody yet</span>`:w}</span>
        <div role="group" aria-label=${M==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${le.length}, minmax(0, 1fr))">
          ${le.map(([f,_])=>h`<button type="button" class="choice" aria-pressed=${N===f?"true":"false"} ?disabled=${a} @click=${()=>be(f)}>
                ${_}
              </button>`)}
        </div>
        ${p.length?h`<div role="group" aria-label=${M==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${p.map(f=>h`<button type="button" class="chip" aria-pressed=${N.toLowerCase()===f.toLowerCase()?"true":"false"} ?disabled=${a} @click=${()=>be(f)}>
                    ${f}
                  </button>`)}
            </div>`:w}
        <input
          type="text"
          .value=${X&&!p.some(f=>f.toLowerCase()===X.toLowerCase())?X:""}
          ?disabled=${a}
          aria-label=${M==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${f=>{let _=f.target.value.trim();_&&_!==N&&this.setRide(i,M,_)}}
          @keydown=${f=>{f.key==="Enter"&&f.target.blur()}}
        />
        ${!v&&N!==""&&N!=="none"?b(M,N):w}
      </div>`},b=(M,Y)=>{let N=l(`along-${M}`),X=N!==void 0?N:M==="pick"?i.pick_along??[]:i.along,be=[...$e(e).filter(f=>f!==i.kid),...r.filter(f=>f!==Y)];return be.length?h`<div class="field-sub">
        <span class="field-label">${M==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${M==="pick"?"They come for the pick-up":"They leave home in the same car"}</span></span>
        <div role="group" aria-label=${M==="drop"?"Riding along on the drop-off":M==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${be.map(f=>h`<button type="button" class="chip" aria-pressed=${X.includes(f)?"true":"false"} ?disabled=${a} @click=${()=>this.toggleAlong(i,f,M)}>
              ${r.includes(f)?ae(e,f):re(e,f)}
            </button>`)}
        </div>
      </div>`:w},E=l("stay"),v=E!==void 0?!!E:i.stay,x=i.drop===i.pick&&r.includes(i.drop),k=l("along"),g=k!==void 0?k:i.along,C=i.own?[...$e(e),...r.filter(M=>M!==i.own)]:[],z=i.own!=null&&i.takes!=null,W=i.own!=null&&!z,te=l("takes"),G=te!==void 0?te:i.takes??null,U=l("arrive"),pe=this.arriveDraft!==void 0?this.arriveDraft:U!==void 0?U:i.arrive_by,Q=[],ge=M=>M==="none"?"Not needed":zn(e,M),je=M=>r.includes(M)?ae(e,M):re(e,M),fe=(M,Y,N)=>{Y===""&&!N.length||Q.push(`${M}: ${[Y===""?"TBD":ge(Y),...N.map(je)].join(", ")}`)};i.own||fe("Drop-off",i.drop,i.along),i.own||fe("Pick-up",i.pick,i.pick_along??[]),!i.own&&i.stay&&Q.push("Stay: yes"),z&&Q.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&Q.push(`Take along: ${i.along.map(je).join(", ")}`),i.arrive_by!=null&&Q.push(`Arrive by: ${mt(i.arrive_by)}`);let me=l("attending"),Ce=me!==void 0?!!me:i.attending!==!1;i.attending===!1&&Q.splice(0,Q.length,"Attending: no");let Xe=o.date===this.today().date?"":`${oe(o.date)} · `,De=h`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${d.color}"></span>${c} · ${i.title}</span>
          <span class="ed-meta">${Xe}${z?"any time ":""}${P(i.start)}–${P(i.end)}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return i.where==="home"?h`${De}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:h`
      ${De}
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
          <button type="button" class="choice" aria-pressed=${Ce?"true":"false"} ?disabled=${a} @click=${()=>this.setAttending(i,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${Ce?"false":"true"} ?disabled=${a} @click=${()=>this.setAttending(i,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${Ce?h`${i.where==="anywhere"?h`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:w}
            ${i.own?h`<p class="field-hint">${this.ownHint(e,i)}</p>`:h`${m("drop")} ${m("pick")}
                  <div class="field">
                    <button type="button" class="choice wide" aria-pressed=${v?"true":"false"} ?disabled=${!x||a} @click=${()=>this.toggleStay(i)}>
                      ${x?v?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
                    </button>
                    ${v&&x?b("both",i.drop):w}
                  </div>`}
      ${i.own?h`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${G!=null?`Takes ${G} min, any time ${P(i.start)}–${P(i.end)}`:"At its set time"}</span>
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
      ${W&&C.length?h`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${C.map(M=>h`<button type="button" class="chip" aria-pressed=${g.includes(M)?"true":"false"} ?disabled=${a} @click=${()=>this.toggleAlong(i,M)}>
                  ${r.includes(M)?ae(e,M):re(e,M)}
                </button>`)}
            </div>
          </div>`:w}
      ${z?w:h`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${pe!=null?`${i.start-pe} min before it starts`:`Aims for a few minutes before ${P(i.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${a} @click=${()=>this.nudgeArrive(i,-5)}>−</button>
          <span class="arrive-value">${pe!=null?P(pe):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${a||pe==null} @click=${()=>this.nudgeArrive(i,5)}>+</button>
        </span>
      </div>
      ${pe!=null?h`<button type="button" class="chip clear" ?disabled=${a} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:w}`}
`:h`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${Q.length?Q.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${i.problems.length?h`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:w}
      ${Ce&&!i.own?h`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:w}
    `}};Ct.styles=Pi,Ct.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Ct);var _t=class extends he{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=Ws(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(gt);let n=e.toString();history.replaceState(history.state,"",`${location.pathname}${n?`?${n}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new Ut(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return h`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?h`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:w}`}};_t.styles=ze`
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
  `,_t.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0},pairing:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",_t);
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
