var fr=Object.defineProperty;var Tn=(s,t)=>()=>(s&&(t=s(s=0)),t);var gr=(s,t)=>{for(var e in t)fr(s,e,{get:t[e],enumerable:!0})};function fn(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function ds(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function ka(s,t){let e=new Set,n=[];for(let i of s){let o=t(i);e.has(o)||(e.add(o),n.push(i))}return n}function ci(s){return ka(s,t=>t.unicode)}function $a(s){function t(e,n,i){let o=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(i)for(let[r,[a,c]]of Object.entries(i))o.createIndex(r,a,{multiEntry:c});return o}t(ct),t(Ze,ma,{[ui]:[ga,!0],[pi]:[[ba,xa]],[fi]:[va,!0]}),t(fs,void 0,{[hi]:[""]})}function gi(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function Ea(s){let t=await new Promise((e,n)=>{let i=indexedDB.open(s,pa);hs[s]=i,i.onupgradeneeded=o=>{o.oldVersion<fa&&$a(i.result)},gi(e,n,i)});return t.onclose=()=>ms(s),t}function _a(s){return mn[s]||(mn[s]=Ea(s)),mn[s]}function Ie(s,t,e,n){return new Promise((i,o)=>{let r=s.transaction(t,e,{durability:"relaxed"}),a=typeof t=="string"?r.objectStore(t):t.map(l=>r.objectStore(l)),c;n(a,r,l=>{c=l}),r.oncomplete=()=>i(c),r.onerror=()=>o(r.error)})}function ms(s){let t=hs[s],e=t&&t.result;if(e){e.close();let n=xn[s];if(n)for(let i of n)i()}delete hs[s],delete mn[s],delete xn[s]}function Ta(s){return new Promise((t,e)=>{ms(s);let n=indexedDB.deleteDatabase(s);gi(t,e,n)})}function Ca(s,t){let e=xn[s];e||(e=xn[s]=[]),e.push(t)}function lt(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||Aa.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function mi(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=Sa)}function Ma(s){return s.map(({annotation:e,emoticon:n,group:i,order:o,shortcodes:r,skins:a,tags:c,emoji:l,version:d})=>{let u=[...new Set(mi([...(r||[]).map(lt).flat(),...(c||[]).map(lt).flat(),...lt(e),n]))].sort(),h={annotation:e,group:i,order:o,tags:c,tokens:u,unicode:l,version:d};if(n&&(h.emoticon=n),r&&(h.shortcodes=r),a){h.skinTones=[],h.skinUnicodes=[],h.skinVersions=[];for(let{tone:b,emoji:C,version:x}of a)h.skinTones.push(b),h.skinUnicodes.push(C),h.skinVersions.push(x)}return h})}function bi(s,t,e,n){s[t](e).onsuccess=i=>n&&n(i.target.result)}function Xe(s,t,e){bi(s,"get",t,e)}function xi(s,t,e){bi(s,"getAll",t,e)}function bs(s){s.commit&&s.commit()}function Pa(s,t){let e=s[0];for(let n=1;n<s.length;n++){let i=s[n];t(e)>t(i)&&(e=i)}return e}function vi(s,t){let e=Pa(s,i=>i.length),n=[];for(let i of e)s.some(o=>o.findIndex(r=>t(r)===t(i))===-1)||n.push(i);return n}async function Da(s){return!await xs(s,ct,bn)}async function La(s,t,e){let[n,i]=await Promise.all([us,bn].map(o=>xs(s,ct,o)));return n===e&&i===t}async function Ra(s,t){return Ie(s,Ze,ut,(n,i,o)=>{let r,a=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let l=c.target.result;for(let d of l)if(r=d.unicode,t(d))return o(d);if(l.length<50)return o();a()}};a()})}async function yi(s,t,e,n){try{let i=Ma(t);await Ie(s,[Ze,ct],gs,([o,r],a)=>{let c,l,d=0;function u(){++d===2&&h()}function h(){if(!(c===n&&l===e)){o.clear();for(let b of i)o.put(b);r.put(n,us),r.put(e,bn),bs(a)}}Xe(r,us,b=>{c=b,u()}),Xe(r,bn,b=>{l=b,u()})})}finally{}}async function Ia(s,t){return Ie(s,Ze,ut,(e,n,i)=>{let o=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);xi(e.index(pi),o,i)})}async function wi(s,t){let e=mi(lt(t));return e.length?Ie(s,Ze,ut,(n,i,o)=>{let r=[],a=()=>{r.length===e.length&&c()},c=()=>{let l=vi(r,d=>d.unicode);o(l.sort((d,u)=>d.order<u.order?-1:1))};for(let l=0;l<e.length;l++){let d=e[l],u=l===e.length-1?IDBKeyRange.bound(d,d+"￿",!1,!0):IDBKeyRange.only(d);xi(n.index(ui),u,h=>{r.push(h),a()})}}):[]}async function Ba(s,t){let e=await wi(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(o=>o.toLowerCase()).includes(t.toLowerCase()))[0]||null:await Ra(s,i=>(i.shortcodes||[]).includes(t.toLowerCase()))||null}async function Oa(s,t){return Ie(s,Ze,ut,(e,n,i)=>Xe(e,t,o=>{if(o)return i(o);Xe(e.index(fi),t,r=>i(r||null))}))}function xs(s,t,e){return Ie(s,t,ut,(n,i,o)=>Xe(n,e,o))}function ja(s,t,e,n){return Ie(s,t,gs,(i,o)=>{i.put(n,e),bs(o)})}function Na(s,t){return Ie(s,fs,gs,(e,n)=>Xe(e,t,i=>{e.put((i||0)+1,t),bs(n)}))}function za(s,t,e){return e===0?[]:Ie(s,[fs,Ze],ut,([n,i],o,r)=>{let a=[];n.index(hi).openCursor(void 0,"prev").onsuccess=c=>{let l=c.target.result;if(!l)return r(a);function d(b){if(a.push(b),a.length===e)return r(a);l.continue()}let u=l.primaryKey,h=t.byName(u);if(h)return d(h);Xe(i,u,b=>{if(b)return d(b);l.continue()})}})}function Ua(s,t){let e=new Map;for(let i of s){let o=t(i);for(let r of o){let a=e;for(let l=0;l<r.length;l++){let d=r.charAt(l),u=a.get(d);u||(u=new Map,a.set(d,u)),a=u}let c=a.get(gn);c||(c=[],a.set(gn,c)),c.push(i)}}return(i,o)=>{let r=e;for(let l=0;l<i.length;l++){let d=i.charAt(l),u=r.get(d);if(u)r=u;else return[]}if(o)return r.get(gn)||[];let a=[],c=[r];for(;c.length;){let d=[...c.shift().entries()].sort((u,h)=>u[0]<h[0]?-1:1);for(let[u,h]of d)u===gn?a.push(...h):c.push(h)}return a}}function Fa(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||Ha.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function di(s){Fa(s);let t=(h,b)=>h.name.toLowerCase()<b.name.toLowerCase()?-1:1,e=s.sort(t),i=Ua(s,h=>{let b=new Set;if(h.shortcodes)for(let C of h.shortcodes)for(let x of lt(C))b.add(x);return b}),o=h=>i(h,!0),r=h=>i(h,!1),a=h=>{let b=lt(h),C=b.map((x,w)=>(w<b.length-1?o:r)(x));return vi(C,x=>x.name).sort(t)},c=new Map,l=new Map;for(let h of s){l.set(h.name.toLowerCase(),h);for(let b of h.shortcodes||[])c.set(b.toLowerCase(),h)}return{all:e,search:a,byShortcode:h=>c.get(h.toLowerCase()),byName:h=>l.get(h.toLowerCase())}}function St(s){if(!s)return s;if(Ka&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function ki(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function qa(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||Wa.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function $i(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function Va(s){let t=await fetch(s,{method:"HEAD"});$i(t,s);let e=t.headers.get("etag");return ki(e),e}async function ps(s){let t=await fetch(s);$i(t,s);let e=t.headers.get("etag");ki(e);let n=await t.json();return qa(n),[e,n]}function Ga(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,i=-1;++i<n;)t+=String.fromCharCode(e[i]);return t}function Ya(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),i=-1;++i<t;)n[i]=s.charCodeAt(i);return e}async function Ei(s){let t=JSON.stringify(s),e=Ya(t),n=await crypto.subtle.digest("SHA-1",e),i=Ga(n);return btoa(i)}async function Ja(s,t){let e,n=await Va(t);if(!n){let i=await ps(t);n=i[0],e=i[1],n||(n=await Ei(e))}await La(s,t,n)||(e||(e=(await ps(t))[1]),await yi(s,e,t,n))}async function Xa(s,t){let[e,n]=await ps(t);e||(e=await Ei(n)),await yi(s,n,t,e)}async function Za(s,t){try{await Ja(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var pa,fa,Ze,ct,fs,ga,ui,ma,hi,ba,xa,pi,us,bn,li,ut,gs,fi,va,ya,wa,hs,mn,xn,Aa,Sa,gn,Ha,Ka,Wa,dt,vs=Tn(()=>{pa=1,fa=1,Ze="emoji",ct="keyvalue",fs="favorites",ga="tokens",ui="tokens",ma="unicode",hi="count",ba="group",xa="order",pi="group-order",us="eTag",bn="url",li="skinTone",ut="readonly",gs="readwrite",fi="skinUnicodes",va="skinUnicodes",ya="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",wa="en";hs={},mn={},xn={};Aa=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);Sa=2;gn="";Ha=["name","url"];Ka=typeof wrappedJSObject<"u";Wa=["annotation","emoji","group","order","version"];dt=class{constructor({dataSource:t=ya,locale:e=wa,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=di(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await _a(this._dbName);Ca(this._dbName,this._clear);let e=this.dataSource;await Da(t)?await Xa(t,e):this._lazyUpdate=Za(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return ds(t),await this.ready(),ci(await Ia(this._db,t)).map(St)}async getEmojiBySearchQuery(t){fn(t),await this.ready();let e=this._custom.search(t),n=ci(await wi(this._db,t)).map(St);return[...e,...n]}async getEmojiByShortcode(t){fn(t),await this.ready();let e=this._custom.byShortcode(t);return e||St(await Ba(this._db,t))}async getEmojiByUnicodeOrName(t){fn(t),await this.ready();let e=this._custom.byName(t);return e||St(await Oa(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await xs(this._db,ct,li)||0}async setPreferredSkinTone(t){return ds(t),await this.ready(),ja(this._db,ct,li,t)}async incrementFavoriteEmojiCount(t){return fn(t),await this.ready(),Na(this._db,t)}async getTopFavoriteEmoji(t){return ds(t),await this.ready(),(await za(this._db,this._custom,t)).map(St)}set customEmoji(t){this._custom=di(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await ms(this._dbName)}async delete(){await this._shutdown(),await Ta(this._dbName)}}});function Ti(s){return s.unicode.includes("‍")}function al(s){let t=Ci(s,"#000"),e=Ci(s,"#fff");return t&&e&&rl(t,e)}function ll(){let s=Object.entries(el);try{for(let[t,e]of s)if(al(t))return e}catch{}finally{}return s[0][1]}function fl(s,t){if(t===0)return s;let e=s.indexOf(ul);return e!==-1?s.substring(0,e)+String.fromCodePoint(hl+t-1)+s.substring(e):(s.endsWith(cl)&&(s=s.substring(0,s.length-1)),s+dl+String.fromCodePoint(pl+t-1))}function Se(s){s.preventDefault(),s.stopPropagation()}function $s(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function Bi(s,t){let e=new Set,n=[];for(let i of s){let o=t(i);e.has(o)||(e.add(o),n.push(i))}return n}function gl(s,t){let e=n=>{let i={};for(let o of n)typeof o.tone=="number"&&o.version<=t&&(i[o.tone]=o.unicode);return i};return s.map(({unicode:n,skins:i,shortcodes:o,url:r,name:a,category:c,annotation:l})=>({unicode:n,name:a,shortcodes:o,url:r,category:c,annotation:l,id:n||a,skins:i&&e(i)}))}function bl(s,t,e){let n;ml?(n=new ResizeObserver(e),n.observe(s)):yn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function Ai(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function Si(s,t,e){let n=Ai(t);if(!n){if(!Qe){Qe=e.cloneNode(!0);let i=getComputedStyle(e);for(let o of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])Qe.style.setProperty(o,i.getPropertyValue(o),"important")}try{return document.body.appendChild(Qe),Qe.firstChild.nodeValue=s,Ai(Qe)}finally{Qe.remove()}}return n}function vl(s,t,e){let n=!0;for(let i of s){let o=e(i);if(!o)continue;typeof Es>"u"&&(Es=Si(xl,t,t));let a=Si(i.unicode,o,t)/1.8<Es;As.set(i.unicode,a),a||(n=!1)}return n}function yl(s){return Bi(s,t=>t)}function wl(s){s&&(s.scrollTop=0)}function Mt(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function Mi(s){return""+s}function kl(s){let t=document.createElement("template");return t.innerHTML=s,t}function Cl(s,t){Tl?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function Al(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function Sl(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,i=!1;n?i=Al(n,s):(i=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),i&&Cl(n,s)}function Ml(s,t){for(let e of t){let{targetNode:n,currentExpression:i,binding:{expressionIndex:o,attributeName:r,attributeValuePre:a,attributeValuePost:c}}=e,l=s[o];if(i!==l)if(e.currentExpression=l,r)if(l===null)n.removeAttribute(r);else{let d=a+Mi(l)+c;n.setAttribute(r,d)}else{let d;Array.isArray(l)?Sl(l,e):l instanceof Element?(d=l,n.replaceWith(d)):n.nodeValue=Mi(l),d&&(e.targetNode=d)}}}function Pl(s){let t="",e=!1,n=!1,i=-1,o=new Map,r=[],a=0;for(let l=0,d=s.length;l<d;l++){let u=s[l];if(t+=u.slice(a),l===d-1)break;for(let p=0;p<u.length;p++)switch(u.charAt(p)){case"<":{u.charAt(p+1)==="/"?r.pop():(e=!0,r.push(++i));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let h=r[r.length-1],b=Mt(o,h,()=>[]),C,x,w;if(n){let p=/(\S+)="?([^"=]*)$/.exec(u);C=p[1],x=p[2];let L=/^([^">]*)("?)/.exec(s[l+1]);w=L[1],t=t.slice(0,-1*p[0].length),a=L[0].length}else a=0;let A={attributeName:C,attributeValuePre:x,attributeValuePost:w,expressionIndex:l};b.push(A),!e&&!n&&(t+=" ")}return{template:kl(t),elementsToBindings:o}}function Pi(s,t,e){for(let n=0;n<s.length;n++){let i=s[n],o=i.attributeName?t:t.firstChild,r={binding:i,targetNode:o,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Dl(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))Pi(n,s,e);else{let i=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),o=s,r=-1;do{let a=t.get(++r);a&&Pi(a,o,e)}while(o=i.nextNode())}return e}function Ll(s){let{template:t,elementsToBindings:e}=Mt($l,s,()=>Pl(s)),n=t.cloneNode(!0).content.firstElementChild,i=Dl(n,e);return function(r){return Ml(r,i),n}}function Rl(s){let t=Mt(El,s,()=>new Map),e=_l;function n(o,...r){let a=Mt(t,o,()=>new Map);return Mt(a,e,()=>Ll(o))(r)}function i(o,r,a){return o.map((c,l)=>{let d=e;e=a(c);try{return r(c,l)}finally{e=d}})}return{map:i,html:n}}function Il(s,t,e,n,i,o,r,a,c){let{labelWithSkin:l,titleForEmoji:d,unicodeWithSkin:u}=e,{html:h,map:b}=Rl(t);function C(p,L,H){return b(p,(Z,ce)=>h`<button role="${L?"option":"menuitem"}" aria-selected="${L?ce===t.activeSearchItem:null}" aria-label="${l(Z,t.currentSkinTone)}" title="${d(Z)}" class="${"emoji"+(L&&ce===t.activeSearchItem?" active":"")+(Z.unicode?"":" custom-emoji")}" id="${`${H}-${Z.id}`}" style="${Z.unicode?null:`--custom-emoji-background: url(${JSON.stringify(Z.url)})`}">${Z.unicode?u(Z,t.currentSkinTone):""}</button>`,Z=>`${H}-${Z.id}`)}let w=h`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${b(t.skinTones,(p,L)=>h`<div id="skintone-${L}" class="emoji ${L===t.activeSkinTone?"active":""}" aria-selected="${L===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[L]}" aria-label="${t.i18n.skinTones[L]}">${p}</div>`,p=>p)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${b(t.groups,p=>h`<button role="tab" class="nav-button" aria-controls="tab-${p.id}" aria-label="${t.i18n.categories[p.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===p.id}" title="${t.i18n.categories[p.name]}" data-group-id="${p.id}"><div class="nav-emoji emoji">${p.emoji}</div></button>`,p=>p.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${b(t.currentEmojisWithCategories,(p,L)=>h`<div><div id="menu-label-${L}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:p.category?p.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${L!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(p.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${L}" id="${t.searchMode?"search-results":null}">${C(p.emojis,t.searchMode,"emo")}</div></div>`,p=>p.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${C(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,A=(p,L)=>{for(let H of s.querySelectorAll(`[${p}]`))L(H,H.getAttribute(p))};if(c){s.appendChild(w);for(let p of["click","focusout","input","keydown","keyup"])A(`data-on-${p}`,(L,H)=>{L.addEventListener(p,n[H])});A("data-ref",(p,L)=>{o[L]=p}),r.addEventListener("abort",()=>{s.removeChild(w)})}A("data-action",(p,L)=>{let H=a.get(L);H||a.set(L,H=new WeakSet),H.has(p)||(H.add(p),i[L](p))})}function Bl(s){let t=!1,e,n=new Map,i=new Set,o,r=()=>{if(t)return;let l=[...i];i.clear();try{for(let d of l)d()}finally{o=!1,i.size&&(o=!0,wn(r))}},a=new Proxy({},{get(l,d){if(e){let u=n.get(d);u||(u=new Set,n.set(d,u)),u.add(e)}return l[d]},set(l,d,u){if(l[d]!==u){l[d]=u;let h=n.get(d);if(h){for(let b of h)i.add(b);o||(o=!0,wn(r))}}return!0}}),c=l=>{let d=()=>{let u=e;e=d;try{return l()}finally{e=u}};return d()};return s.addEventListener("abort",()=>{t=!0}),{state:a,createEffect:c}}function _s(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function Ol(s,t,e){{let n=s.closest(".tabpanel"),i=Di.get(n);i||(i=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),Di.set(n,i),t.addEventListener("abort",()=>{i.disconnect()})),i.observe(s)}}function jl(s,t){let e={},n=new AbortController,i=n.signal,{state:o,createEffect:r}=Bl(i),a=new Map;vn(o,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),vn(o,t),vn(o,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:sl,isRtl:!1,currentGroupIndex:0,groups:ys,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{o.currentGroup!==o.groups[o.currentGroupIndex]&&(o.currentGroup=o.groups[o.currentGroupIndex])});let c=f=>{s.getElementById(f).focus()},l=f=>s.getElementById(`emo-${f.id}`),d=(f,_)=>{e.rootElement.dispatchEvent(new CustomEvent(f,{detail:_,bubbles:!0,composed:!0}))},u=(f,_)=>f.id===_.id,h=(f,_)=>{let{category:B,emojis:z}=f,{category:W,emojis:ne}=_;return B!==W?!1:_s(z,ne,u)},b=f=>{_s(o.currentEmojis,f,u)||(o.currentEmojis=f)},C=f=>{o.searchMode!==f&&(o.searchMode=f)},x=f=>{_s(o.currentEmojisWithCategories,f,h)||(o.currentEmojisWithCategories=f)},w=(f,_)=>_&&f.skins&&f.skins[_]||f.unicode,L={labelWithSkin:(f,_)=>yl([f.name||w(f,_),f.annotation,...f.shortcodes||Ts].filter(Boolean)).join(", "),titleForEmoji:f=>f.annotation||(f.shortcodes||Ts).join(", "),unicodeWithSkin:w},H={onClickSkinToneButton:R,onEmojiClick:xe,onNavClick:D,onNavKeydown:V,onSearchKeydown:j,onSkinToneOptionsClick:m,onSkinToneOptionsFocusOut:X,onSkinToneOptionsKeydown:F,onSkinToneOptionsKeyup:O,onSearchInput:he},Z={calculateEmojiGridStyle:k,updateOnIntersection:y},ce=!0;r(()=>{Il(s,o,L,H,Z,e,i,a,ce),ce=!1}),o.emojiVersion||ks().then(f=>{f||(o.message=o.i18n.emojiUnsupportedMessage)}),r(()=>{async function f(){let _=!1,B=setTimeout(()=>{_=!0,o.message=o.i18n.loadingMessage},tl);try{await o.database.ready(),o.databaseLoaded=!0}catch(z){console.error(z),o.message=o.i18n.networkErrorMessage}finally{clearTimeout(B),_&&(_=!1,o.message="")}}o.database&&f()}),r(()=>{o.pickerStyle=`
      --num-groups: ${o.groups.length}; 
      --indicator-opacity: ${o.searchMode?0:1}; 
      --num-skintones: ${_i};`}),r(()=>{o.customEmoji&&o.database&&v()}),r(()=>{o.customEmoji&&o.customEmoji.length?o.groups!==Cs&&(o.groups=Cs):o.groups!==ys&&(o.currentGroupIndex&&o.currentGroupIndex--,o.groups=ys)}),r(()=>{async function f(){o.databaseLoaded&&(o.currentSkinTone=await o.database.getPreferredSkinTone())}f()}),r(()=>{o.skinTones=Array(_i).fill().map((f,_)=>fl(o.skinToneEmoji,_))}),r(()=>{o.skinToneButtonText=o.skinTones[o.currentSkinTone]}),r(()=>{o.skinToneButtonLabel=o.i18n.skinToneLabel.replace("{skinTone}",o.i18n.skinTones[o.currentSkinTone])}),r(()=>{async function f(){let{database:_}=o,B=(await Promise.all(ol.map(z=>_.getEmojiByUnicodeOrName(z)))).filter(Boolean);o.defaultFavoriteEmojis=B}o.databaseLoaded&&f()});function v(){let{customEmoji:f,database:_}=o,B=f||Ts;_.customEmoji!==B&&(_.customEmoji=B)}r(()=>{async function f(){v();let{database:_,defaultFavoriteEmojis:B,numColumns:z}=o,W=await _.getTopFavoriteEmoji(z),ne=await K(Bi([...W,...B],se=>se.unicode||se.name).slice(0,z));o.currentFavorites=ne}o.databaseLoaded&&o.defaultFavoriteEmojis&&f()});function k(f){bl(f,i,()=>{{let _=getComputedStyle(e.rootElement),B=parseInt(_.getPropertyValue("--num-columns"),10),z=_.getPropertyValue("direction")==="rtl";o.numColumns=B,o.isRtl=z}})}function y(f){Ol(f,i,_=>{for(let{target:B,isIntersecting:z}of _)B.classList.toggle("onscreen",z)})}r(()=>{async function f(){let{searchText:_,currentGroup:B,databaseLoaded:z,customEmoji:W}=o;if(!z)o.currentEmojis=[],o.searchMode=!1;else if(_.length>=Qa){let ne=await Q(_);o.searchText===_&&(b(ne),C(!0))}else{let{id:ne}=B;if(ne!==-1||W&&W.length){let se=await Y(ne);o.currentGroup.id===ne&&(b(se),C(!1))}}}f()});let $=()=>{yn(()=>wl(e.tabpanelElement))};r(()=>{let{currentEmojis:f,emojiVersion:_}=o,B=f.filter(z=>z.unicode).filter(z=>Ti(z)&&!As.has(z.unicode));if(!_&&B.length)b(f),yn(()=>E(B));else{let z=_?f:f.filter(M);b(z),$()}});function E(f){vl(f,e.baselineEmoji,l)?$():o.currentEmojis=[...o.currentEmojis]}function M(f){return!f.unicode||!Ti(f)||As.get(f.unicode)}async function I(f){let _=o.emojiVersion||await ks();return f.filter(({version:B})=>!B||B<=_)}async function K(f){return gl(f,o.emojiVersion||await ks())}async function Y(f){let _=f===-1?o.customEmoji:await o.database.getEmojiByGroup(f);return K(await I(_))}async function Q(f){return K(await I(await o.database.getEmojiBySearchQuery(f)))}r(()=>{}),r(()=>{function f(){let{searchMode:B,currentEmojis:z}=o;if(B)return[{category:"",emojis:z}];let W=new Map;for(let ne of z){let se=ne.category||"",P=W.get(se);P||(P=[],W.set(se,P)),P.push(ne)}return[...W.entries()].map(([ne,se])=>({category:ne,emojis:se})).sort((ne,se)=>o.customCategorySorting(ne.category,se.category))}let _=f();x(_)}),r(()=>{o.activeSearchItemId=o.activeSearchItem!==-1&&o.currentEmojis[o.activeSearchItem].id}),r(()=>{let{rawSearchText:f}=o;Ri(()=>{o.searchText=(f||"").trim(),o.activeSearchItem=-1})});function j(f){if(!o.searchMode||!o.currentEmojis.length)return;let _=B=>{Se(f),o.activeSearchItem=$s(B,o.activeSearchItem,o.currentEmojis)};switch(f.key){case"ArrowDown":return _(!1);case"ArrowUp":return _(!0);case"Enter":if(o.activeSearchItem===-1)o.activeSearchItem=0;else return Se(f),ie(o.currentEmojis[o.activeSearchItem].id)}}function D(f){let{target:_}=f,B=_.closest(".nav-button");if(!B)return;let z=parseInt(B.dataset.groupId,10);e.searchElement.value="",o.rawSearchText="",o.searchText="",o.activeSearchItem=-1,o.currentGroupIndex=o.groups.findIndex(W=>W.id===z)}function V(f){let{target:_,key:B}=f,z=W=>{W&&(Se(f),W.focus())};switch(B){case"ArrowLeft":return z(_.previousElementSibling);case"ArrowRight":return z(_.nextElementSibling);case"Home":return z(_.parentElement.firstElementChild);case"End":return z(_.parentElement.lastElementChild)}}async function J(f){let _=await o.database.getEmojiByUnicodeOrName(f),B=[...o.currentEmojis,...o.currentFavorites].find(W=>W.id===f),z=B.unicode&&w(B,o.currentSkinTone);return await o.database.incrementFavoriteEmojiCount(f),{emoji:_,skinTone:o.currentSkinTone,...z&&{unicode:z},...B.name&&{name:B.name}}}async function ie(f){let _=J(f);d("emoji-click-sync",_),d("emoji-click",await _)}function xe(f){let{target:_}=f;if(!_.classList.contains("emoji"))return;Se(f);let B=_.id.substring(4);ie(B)}function oe(f){o.currentSkinTone=f,o.skinTonePickerExpanded=!1,c("skintone-button"),d("skin-tone-change",{skinTone:f}),o.database.setPreferredSkinTone(f)}function m(f){let{target:{id:_}}=f,B=_&&_.match(/^skintone-(\d)/);if(!B)return;Se(f);let z=parseInt(B[1],10);oe(z)}function R(f){o.skinTonePickerExpanded=!o.skinTonePickerExpanded,o.activeSkinTone=o.currentSkinTone,o.skinTonePickerExpanded&&(Se(f),yn(()=>c("skintone-list")))}r(()=>{o.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{o.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):o.skinTonePickerExpandedAfterAnimation=!1});function F(f){if(!o.skinTonePickerExpanded)return;let _=async B=>{Se(f),o.activeSkinTone=B};switch(f.key){case"ArrowUp":return _($s(!0,o.activeSkinTone,o.skinTones));case"ArrowDown":return _($s(!1,o.activeSkinTone,o.skinTones));case"Home":return _(0);case"End":return _(o.skinTones.length-1);case"Enter":return Se(f),oe(o.activeSkinTone);case"Escape":return Se(f),o.skinTonePickerExpanded=!1,c("skintone-button")}}function O(f){if(o.skinTonePickerExpanded)switch(f.key){case" ":return Se(f),oe(o.activeSkinTone)}}async function X(f){let{relatedTarget:_}=f;(!_||_.id!=="skintone-list")&&(o.skinTonePickerExpanded=!1)}function he(f){o.rawSearchText=f.target.value}return{$set(f){vn(o,f)},$destroy(){n.abort()}}}function Li(s){s instanceof et||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var Cs,ys,Qa,_i,Ri,el,tl,nl,sl,ol,Ii,il,Ci,rl,ws,ks,As,cl,dl,ul,hl,pl,yn,ml,xl,Es,Qe,$l,El,_l,Tl,wn,Di,Ts,vn,Nl,zl,Ul,Hl,Oi,Fl,et,ji,Ni=Tn(()=>{vs();Cs=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),ys=Cs.slice(1),Qa=2,_i=6,Ri=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;el={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},tl=1e3,nl="🖐️",sl=8,ol=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],Ii='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',il=(s,t)=>s<t?-1:s>t?1:0,Ci=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${Ii}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},rl=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};ks=()=>(ws||(ws=new Promise(s=>Ri(()=>s(ll())))),ws),As=new Map,cl="️",dl="\uD83C",ul="‍",hl=127995,pl=57339;yn=requestAnimationFrame,ml=typeof ResizeObserver=="function";xl="😀";$l=new WeakMap,El=new WeakMap,_l=Symbol("un-keyed"),Tl="replaceChildren"in Element.prototype;wn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);Di=new WeakMap;Ts=[],{assign:vn}=Object;Nl="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",zl="en",Ul={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},Hl=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',Oi=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],Fl=`:host{--emoji-font-family:${Ii}}`,et=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Hl+Fl,this.shadowRoot.appendChild(e),this._ctx={locale:zl,dataSource:Nl,skinToneEmoji:nl,customCategorySorting:il,customEmoji:null,i18n:Ul,emojiVersion:null,...t};for(let n of Oi)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){Li(this),this._cmp||(this._cmp=jl(this.shadowRoot,this._ctx))}disconnectedCallback(){Li(this),wn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(i,o)=>o.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new dt({locale:t,dataSource:e}))}_dbFlush(){wn(()=>this._dbCreate())}},ji={};for(let s of Oi)ji[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(et.prototype,ji);customElements.get("emoji-picker")||customElements.define("emoji-picker",et)});var zi={};gr(zi,{Database:()=>dt,Picker:()=>et});var Ui=Tn(()=>{Ni();vs()});function Us(s){return{type:"auth",access_token:s}}function Hs(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function Fs(s){let t={type:"subscribe_events"};return s&&(t.event_type=s),t}function Cn(s){return{type:"unsubscribe_events",subscription:s}}function Ks(){return{type:"ping"}}function Ws(s,t){return{type:"result",success:!1,error:{code:s,message:t}}}function Vs(s){let t={},e=s.split("&");for(let n=0;n<e.length;n++){let i=e[n].split("="),o=decodeURIComponent(i[0]),r=i.length>1?decodeURIComponent(i[1]):void 0;t[o]=r}return t}var Gs=(s,t,e,n)=>{let[i,o,r]=s.split(".",3);return Number(i)>t||Number(i)===t&&(n===void 0?Number(o)>=e:Number(o)>e)||n!==void 0&&Number(i)===t&&Number(o)===e&&Number(r)>=n};var Nt=!1,br="auth_required",xr="auth_invalid",vr="auth_ok";function Js(s){if(!s.auth)throw 4;let t=s.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,n=t.wsUrl;Nt&&console.log("[Auth phase] Initializing",n);function i(o,r,a){Nt&&console.log("[Auth Phase] New connection",n);let c=new WebSocket(n),l=!1,d=()=>{if(c.removeEventListener("close",d),l){a(2);return}if(o===0){a(1);return}let b=o===-1?-1:o-1;setTimeout(()=>i(b,r,a),1e3)},u=async b=>{try{t.expired&&await(e||t.refreshAccessToken()),c.send(JSON.stringify(Us(t.accessToken)))}catch(C){l=C===2,c.close()}},h=async b=>{let C=JSON.parse(b.data);switch(Nt&&console.log("[Auth phase] Received",C),C.type){case xr:l=!0,c.close();break;case vr:c.removeEventListener("open",u),c.removeEventListener("message",h),c.removeEventListener("close",d),c.removeEventListener("error",d),c.haVersion=C.ha_version,Gs(c.haVersion,2022,9)&&c.send(JSON.stringify(Hs())),r(c);break;default:Nt&&C.type!==br&&console.warn("[Auth phase] Unhandled message",C)}};c.addEventListener("open",u),c.addEventListener("message",h),c.addEventListener("close",d),c.addEventListener("error",d)}return new Promise((o,r)=>i(s.setupRetry,o,r))}var ft=!1,zt=class{constructor(t,e){this._handleMessage=n=>{let i=JSON.parse(n.data);Array.isArray(i)||(i=[i]),i.forEach(o=>{ft&&console.log("Received",o);let r=this.commands.get(o.id);switch(o.type){case"event":r?r.callback(o.event):(console.warn(`Received event for unknown subscription ${o.id}. Unsubscribing.`),this.sendMessagePromise(Cn(o.id)).catch(a=>{ft&&console.warn(` Error unsubsribing from unknown subscription ${o.id}`,a)}));break;case"result":r&&(o.success?(r.resolve(o.result),"subscribe"in r||this.commands.delete(o.id)):(r.reject(o.error),this.commands.delete(o.id)));break;case"pong":r?(r.resolve(),this.commands.delete(o.id)):console.warn(`Received unknown pong response ${o.id}`);break;default:ft&&console.warn("Unhandled message",o)}})},this._handleClose=async()=>{let n=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,n.forEach(r=>{"subscribe"in r||r.reject(Ws(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let i=Object.assign(Object.assign({},this.options),{setupRetry:0}),o=r=>{setTimeout(async()=>{if(!this.closeRequested){ft&&console.log("Trying to reconnect");try{let a=await i.createSocket(i);this._setSocket(a)}catch(a){if(this._queuedMessages){let c=this._queuedMessages;this._queuedMessages=void 0;for(let l of c)l.reject&&l.reject(3)}a===2?this.fireEvent("reconnect-error",a):o(r+1)}}},Math.min(r,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),o(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(i=>{"subscribe"in i&&i.subscribe&&i.subscribe().then(o=>{i.unsubscribe=o,i.resolve()})}));let n=this._queuedMessages;if(n){this._queuedMessages=void 0;for(let i of n)i.resolve()}this.fireEvent("ready")}addEventListener(t,e){let n=this.eventListeners.get(t);n||(n=[],this.eventListeners.set(t,n)),n.push(e)}removeEventListener(t,e){let n=this.eventListeners.get(t);if(!n)return;let i=n.indexOf(e);i!==-1&&n.splice(i,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(n=>n(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,Fs(e))}ping(){return this.sendMessagePromise(Ks())}sendMessage(t,e){if(!this.connected)throw 3;if(ft&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,n)=>{if(this._queuedMessages){this._queuedMessages.push({reject:n,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(o){n(o)}}});return}let i=this._genCmdId();this.commands.set(i,{resolve:e,reject:n}),this.sendMessage(t,i)})}async subscribeMessage(t,e,n){if(this._queuedMessages&&await new Promise((o,r)=>{this._queuedMessages.push({resolve:o,reject:r})}),n?.preCheck&&!await n.preCheck())throw new Error("Pre-check failed");let i;return await new Promise((o,r)=>{let a=this._genCmdId();i={resolve:o,reject:r,callback:t,subscribe:n?.resubscribe!==!1?()=>this.subscribeMessage(t,e,n):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(Cn(a)),this.commands.delete(a)}},this.commands.set(a,i);try{this.sendMessage(e,a)}catch{}}),()=>i.unsubscribe()}_genCmdId(){return++this.commandId}};var yr=()=>`${location.protocol}//${location.host}/`,wr=s=>s*1e3+Date.now();function kr(){let{protocol:s,host:t,pathname:e,search:n}=location;return`${s}//${t}${e}${n}`}function $r(s,t,e,n){let i=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(i+=`&client_id=${encodeURIComponent(t)}`),n&&(i+=`&state=${encodeURIComponent(n)}`),i}function Er(s,t,e,n){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=$r(s,t,e,n)}async function Qs(s,t,e){let n=typeof location<"u"&&location;if(n&&n.protocol==="https:"){let a=document.createElement("a");if(a.href=s,a.protocol==="http:"&&a.hostname!=="localhost")throw 5}let i=new FormData;t!==null&&i.append("client_id",t),Object.keys(e).forEach(a=>{i.append(a,e[a])});let o=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:i});if(!o.ok)throw o.status===400||o.status===403?2:new Error("Unable to fetch tokens");let r=await o.json();return r.hassUrl=s,r.clientId=t,r.expires=wr(r.expires_in),r}function Zs(s,t,e){return Qs(s,t,{code:e,grant_type:"authorization_code"})}function _r(s){return btoa(JSON.stringify(s))}function Tr(s){return JSON.parse(atob(s))}var An=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await Qs(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function eo(s={}){let t,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let n=s.clientId!==void 0?s.clientId:yr(),i=s.limitHassInstance===!0;if(s.authCode&&e&&(t=await Zs(e,n,s.authCode),s.saveTokens&&s.saveTokens(t)),!t){let o=Vs(location.search.substr(1));if("auth_callback"in o){let r=Tr(o.state);if(i&&(r.hassUrl!==e||r.clientId!==n))throw 6;t=await Zs(r.hassUrl,r.clientId,o.code),s.saveTokens&&s.saveTokens(t)}}if(!t&&s.loadTokens&&(t=await s.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new An(t,s.saveTokens);if(e===void 0)throw 4;return Er(e,n,s.redirectUrl||kr(),_r({hassUrl:e,clientId:n})),new Promise(()=>{})}async function to(s){let t=Object.assign({setupRetry:0,createSocket:Js},s),e=await t.createSocket(t);return new zt(e,t)}function N(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function gt(s){let t=Math.floor(Math.round(s)/60)%24;return`${N(s)} ${t<12?"AM":"PM"}`}function no(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function bt(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function so(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Cr=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Ar=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Sr=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Ut(s){return new Date(`${s}T12:00:00Z`)}function Ee(s){let t=Ut(s);return`${Cr.format(t)}, ${Sr.format(t)}`}function ge(s){return Ar.format(Ut(s))}function _e(s,t){return Math.round((Ut(t).getTime()-Ut(s).getTime())/864e5)}function mt(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return mt("UTC",t)}let n=i=>e.find(o=>o.type===i)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function Ht(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let i=mt(e,s),o=mt(e,t).date;return i.date===o?`at ${gt(i.minutes)}`:`on ${ge(i.date)} at ${gt(i.minutes)}`}var le=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},ze="mydashlight",Mr=7,oo=3e4;function Sn(s){if(s instanceof le)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new le(String(t.code??"error"),t.message)}return typeof s=="number"?new le("connection_lost","Lost the connection to Home Assistant."):new le("error",String(s))}var Ft=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new le("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},oo),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new le("not_running","MyDashLight isn’t running right now."))},{type:`${ze}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:ze,service:"get_plan",service_data:{days:Mr},return_response:!0});this.emit(t.response)}catch(t){this.fail(Sn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:ze,service:t,service_data:e})}catch(n){throw Sn(n)}this.pushing||await this.refresh()}setRide(t,e,n,i){return this.call("set_ride",{event:t,side:e,driver:n,scope:i})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:so(e),scope:n})}setTakeAlong(t,e,n,i="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:i})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}watchChores(t){let e=!1,n=null,i=null,o=async()=>{try{let r=await this.conn.sendMessagePromise({type:"call_service",domain:ze,service:"get_chores",service_data:{},return_response:!0});e||t(r.response??null)}catch{e||t(null)}};return(async()=>{try{let r=await this.conn.subscribeMessage(a=>{e||t(a.chores)},{type:`${ze}/chores/subscribe`},{resubscribe:!0});e?r().catch(()=>{}):n=r}catch{if(e)return;o(),i=setInterval(()=>void o(),oo)}})(),()=>{e=!0,i&&clearInterval(i),n&&n().catch(()=>{})}}watchLunch(t){let e=!1,n=null;return(async()=>{try{let i=await this.conn.subscribeMessage(o=>{e||t(o.lunch)},{type:`${ze}/lunch/subscribe`},{resubscribe:!0});e?i().catch(()=>{}):n=i}catch{e||t(null)}})(),()=>{e=!0,n&&n().catch(()=>{})}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,i){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:i})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:ze,service:t,service_data:e})}catch(n){throw Sn(n)}}};var Kt=globalThis,Wt=Kt.ShadowRoot&&(Kt.ShadyCSS===void 0||Kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Mn=Symbol(),io=new WeakMap,xt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==Mn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Wt&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=io.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&io.set(e,t))}return t}toString(){return this.cssText}},ro=s=>new xt(typeof s=="string"?s:s+"",void 0,Mn),Ue=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,i,o)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[o+1],s[0]);return new xt(e,s,Mn)},ao=(s,t)=>{if(Wt)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),i=Kt.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=e.cssText,s.appendChild(n)}},Pn=Wt?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return ro(e)})(s):s;var{is:Pr,defineProperty:Dr,getOwnPropertyDescriptor:Lr,getOwnPropertyNames:Rr,getOwnPropertySymbols:Ir,getPrototypeOf:Br}=Object,qt=globalThis,lo=qt.trustedTypes,Or=lo?lo.emptyScript:"",jr=qt.reactiveElementPolyfillSupport,vt=(s,t)=>s,Dn={toAttribute(s,t){switch(t){case Boolean:s=s?Or:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},uo=(s,t)=>!Pr(s,t),co={attribute:!0,type:String,converter:Dn,reflect:!1,useDefault:!1,hasChanged:uo};Symbol.metadata??=Symbol("metadata"),qt.litPropertyMetadata??=new WeakMap;var Pe=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=co){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),i=this.getPropertyDescriptor(t,n,e);i!==void 0&&Dr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,n){let{get:i,set:o}=Lr(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:i,set(r){let a=i?.call(this);o?.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??co}static _$Ei(){if(this.hasOwnProperty(vt("elementProperties")))return;let t=Br(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(vt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(vt("properties"))){let e=this.properties,n=[...Rr(e),...Ir(e)];for(let i of n)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,i]of e)this.elementProperties.set(n,i)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let i=this._$Eu(e,n);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let i of n)e.unshift(Pn(i))}else t!==void 0&&e.push(Pn(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ao(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,n);if(i!==void 0&&n.reflect===!0){let o=(n.converter?.toAttribute!==void 0?n.converter:Dn).toAttribute(e,n.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){let n=this.constructor,i=n._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=n.getPropertyOptions(i),r=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:Dn;this._$Em=i;let a=r.fromAttribute(e,o.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(t,e,n,i=!1,o){if(t!==void 0){let r=this.constructor;if(i===!1&&(o=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??uo)(o,e)||n.useDefault&&n.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:i,wrapped:o},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),o!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[i,o]of n){let{wrapped:r}=o,a=this[i];r!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,o,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Pe.elementStyles=[],Pe.shadowRootOptions={mode:"open"},Pe[vt("elementProperties")]=new Map,Pe[vt("finalized")]=new Map,jr?.({ReactiveElement:Pe}),(qt.reactiveElementVersions??=[]).push("2.1.2");var Rn=globalThis,ho=s=>s,Vt=Rn.trustedTypes,po=Vt?Vt.createPolicy("lit-html",{createHTML:s=>s}):void 0,In="$lit$",De=`lit$${Math.random().toFixed(9).slice(2)}$`,Bn="?"+De,Nr=`<${Bn}>`,Ke=document,wt=()=>Ke.createComment(""),kt=s=>s===null||typeof s!="object"&&typeof s!="function",On=Array.isArray,vo=s=>On(s)||typeof s?.[Symbol.iterator]=="function",Ln=`[ 	
\f\r]`,yt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,fo=/-->/g,go=/>/g,He=RegExp(`>|${Ln}(?:([^\\s"'>=/]+)(${Ln}*=${Ln}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),mo=/'/g,bo=/"/g,yo=/^(?:script|style|textarea|title)$/i,jn=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),g=jn(1),de=jn(2),ed=jn(3),Le=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),xo=new WeakMap,Fe=Ke.createTreeWalker(Ke,129);function wo(s,t){if(!On(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return po!==void 0?po.createHTML(t):t}var ko=(s,t)=>{let e=s.length-1,n=[],i,o=t===2?"<svg>":t===3?"<math>":"",r=yt;for(let a=0;a<e;a++){let c=s[a],l,d,u=-1,h=0;for(;h<c.length&&(r.lastIndex=h,d=r.exec(c),d!==null);)h=r.lastIndex,r===yt?d[1]==="!--"?r=fo:d[1]!==void 0?r=go:d[2]!==void 0?(yo.test(d[2])&&(i=RegExp("</"+d[2],"g")),r=He):d[3]!==void 0&&(r=He):r===He?d[0]===">"?(r=i??yt,u=-1):d[1]===void 0?u=-2:(u=r.lastIndex-d[2].length,l=d[1],r=d[3]===void 0?He:d[3]==='"'?bo:mo):r===bo||r===mo?r=He:r===fo||r===go?r=yt:(r=He,i=void 0);let b=r===He&&s[a+1].startsWith("/>")?" ":"";o+=r===yt?c+Nr:u>=0?(n.push(l),c.slice(0,u)+In+c.slice(u)+De+b):c+De+(u===-2?a:b)}return[wo(s,o+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},$t=class s{constructor({strings:t,_$litType$:e},n){let i;this.parts=[];let o=0,r=0,a=t.length-1,c=this.parts,[l,d]=ko(t,e);if(this.el=s.createElement(l,n),Fe.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=Fe.nextNode())!==null&&c.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(In)){let h=d[r++],b=i.getAttribute(u).split(De),C=/([.?@])?(.*)/.exec(h);c.push({type:1,index:o,name:C[2],strings:b,ctor:C[1]==="."?Yt:C[1]==="?"?Jt:C[1]==="@"?Xt:qe}),i.removeAttribute(u)}else u.startsWith(De)&&(c.push({type:6,index:o}),i.removeAttribute(u));if(yo.test(i.tagName)){let u=i.textContent.split(De),h=u.length-1;if(h>0){i.textContent=Vt?Vt.emptyScript:"";for(let b=0;b<h;b++)i.append(u[b],wt()),Fe.nextNode(),c.push({type:2,index:++o});i.append(u[h],wt())}}}else if(i.nodeType===8)if(i.data===Bn)c.push({type:2,index:o});else{let u=-1;for(;(u=i.data.indexOf(De,u+1))!==-1;)c.push({type:7,index:o}),u+=De.length-1}o++}}static createElement(t,e){let n=Ke.createElement("template");return n.innerHTML=t,n}};function We(s,t,e=s,n){if(t===Le)return t;let i=n!==void 0?e._$Co?.[n]:e._$Cl,o=kt(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(s),i._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=i:e._$Cl=i),i!==void 0&&(t=We(s,i._$AS(s,t.values),i,n)),t}var Gt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,i=(t?.creationScope??Ke).importNode(e,!0);Fe.currentNode=i;let o=Fe.nextNode(),r=0,a=0,c=n[0];for(;c!==void 0;){if(r===c.index){let l;c.type===2?l=new st(o,o.nextSibling,this,t):c.type===1?l=new c.ctor(o,c.name,c.strings,this,t):c.type===6&&(l=new Zt(o,this,t)),this._$AV.push(l),c=n[++a]}r!==c?.index&&(o=Fe.nextNode(),r++)}return Fe.currentNode=Ke,i}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},st=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,i){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=We(this,t,e),kt(t)?t===T||t==null||t===""?(this._$AH!==T&&this._$AR(),this._$AH=T):t!==this._$AH&&t!==Le&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):vo(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==T&&kt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ke.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,i=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=$t.createElement(wo(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new Gt(i,this),r=o.u(this.options);o.p(e),this.T(r),this._$AH=o}}_$AC(t){let e=xo.get(t.strings);return e===void 0&&xo.set(t.strings,e=new $t(t)),e}k(t){On(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,i=0;for(let o of t)i===e.length?e.push(n=new s(this.O(wt()),this.O(wt()),this,this.options)):n=e[i],n._$AI(o),i++;i<e.length&&(this._$AR(n&&n._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=ho(t).nextSibling;ho(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},qe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,i,o){this.type=1,this._$AH=T,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=T}_$AI(t,e=this,n,i){let o=this.strings,r=!1;if(o===void 0)t=We(this,t,e,0),r=!kt(t)||t!==this._$AH&&t!==Le,r&&(this._$AH=t);else{let a=t,c,l;for(t=o[0],c=0;c<o.length-1;c++)l=We(this,a[n+c],e,c),l===Le&&(l=this._$AH[c]),r||=!kt(l)||l!==this._$AH[c],l===T?t=T:t!==T&&(t+=(l??"")+o[c+1]),this._$AH[c]=l}r&&!i&&this.j(t)}j(t){t===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Yt=class extends qe{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===T?void 0:t}},Jt=class extends qe{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==T)}},Xt=class extends qe{constructor(t,e,n,i,o){super(t,e,n,i,o),this.type=5}_$AI(t,e=this){if((t=We(this,t,e,0)??T)===Le)return;let n=this._$AH,i=t===T&&n!==T||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,o=t!==T&&(n===T||i);i&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Zt=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){We(this,t)}},$o={M:In,P:De,A:Bn,C:1,L:ko,R:Gt,D:vo,V:We,I:st,H:qe,N:Jt,U:Xt,B:Yt,F:Zt},zr=Rn.litHtmlPolyfillSupport;zr?.($t,st),(Rn.litHtmlVersions??=[]).push("3.3.3");var Eo=(s,t,e)=>{let n=e?.renderBefore??t,i=n._$litPart$;if(i===void 0){let o=e?.renderBefore??null;n._$litPart$=i=new st(t.insertBefore(wt(),o),o,void 0,e??{})}return i._$AI(s),i};var Nn=globalThis,we=class extends Pe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Eo(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Le}};we._$litElement$=!0,we.finalized=!0,Nn.litElementHydrateSupport?.({LitElement:we});var Ur=Nn.litElementPolyfillSupport;Ur?.({LitElement:we});(Nn.litElementVersions??=[]).push("4.2.2");var _o={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},To=s=>(...t)=>({_$litDirective$:s,values:t}),Qt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Hr}=$o,Co=s=>s;var Ao=()=>document.createComment(""),ot=(s,t,e)=>{let n=s._$AA.parentNode,i=t===void 0?s._$AB:t._$AA;if(e===void 0){let o=n.insertBefore(Ao(),i),r=n.insertBefore(Ao(),i);e=new Hr(o,r,s,s.options)}else{let o=e._$AB.nextSibling,r=e._$AM,a=r!==s;if(a){let c;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(c=s._$AU)!==r._$AU&&e._$AP(c)}if(o!==i||a){let c=e._$AA;for(;c!==o;){let l=Co(c).nextSibling;Co(n).insertBefore(c,i),c=l}}}return e},Be=(s,t,e=s)=>(s._$AI(t,e),s),Fr={},So=(s,t=Fr)=>s._$AH=t,Mo=s=>s._$AH,en=s=>{s._$AR(),s._$AA.remove()};var Po=(s,t,e)=>{let n=new Map;for(let i=t;i<=e;i++)n.set(s[i],i);return n},Re=To(class extends Qt{constructor(s){if(super(s),s.type!==_o.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let i=[],o=[],r=0;for(let a of s)i[r]=n?n(a,r):r,o[r]=e(a,r),r++;return{values:o,keys:i}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let i=Mo(s),{values:o,keys:r}=this.dt(t,e,n);if(!Array.isArray(i))return this.ut=r,o;let a=this.ut??=[],c=[],l,d,u=0,h=i.length-1,b=0,C=o.length-1;for(;u<=h&&b<=C;)if(i[u]===null)u++;else if(i[h]===null)h--;else if(a[u]===r[b])c[b]=Be(i[u],o[b]),u++,b++;else if(a[h]===r[C])c[C]=Be(i[h],o[C]),h--,C--;else if(a[u]===r[C])c[C]=Be(i[u],o[C]),ot(s,c[C+1],i[u]),u++,C--;else if(a[h]===r[b])c[b]=Be(i[h],o[b]),ot(s,i[u],i[h]),h--,b++;else if(l===void 0&&(l=Po(r,b,C),d=Po(a,u,h)),l.has(a[u]))if(l.has(a[h])){let x=d.get(r[b]),w=x!==void 0?i[x]:null;if(w===null){let A=ot(s,i[u]);Be(A,o[b]),c[b]=A}else c[b]=Be(w,o[b]),ot(s,i[u],w),i[x]=null;b++}else en(i[h]),h--;else en(i[u]),u++;for(;b<=C;){let x=ot(s,c[C+1]);Be(x,o[b]),c[b++]=x}for(;u<=h;){let x=i[u++];x!==null&&en(x)}return this.ut=r,So(s,c),Le}});var tn=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function ue(s){return tn[(s%tn.length+tn.length)%tn.length]}var nn="#23272E",zn="35,39,46";var Kr=3,_t=36,Un=12,Do=8,Lo=30,Te=16,Et=100,Ge=60,Hn=10,on=30,Fn=10,Wr=150,qr=200,an=1.4,Vr=26,Kn=4;function qn(s,t){let e=Math.max(Wr,qr/an);return Math.ceil(Ge+Math.max(0,s-1)*Hn+on+Math.max(0,t-1)*Fn+e*(s+an*t))}function Ce(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function ke(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function ye(s){return new Map(Ce(s).map((t,e)=>[t,ue(e)]))}function me(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function be(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function Vn(s,t){return t==="none"?"Not needed":ke(s).includes(t)?be(s,t):t}function ln(s,t){return t.own?be(s,t.own):me(s,t.kid)}var Tt={color:nn,rgb:zn,ink:nn};function Oo(s,t){return t.own?Tt:ye(s).get(t.kid)??ue(0)}function Gr(s,t){let e=Ce(s);return t.along.map(n=>e.includes(n)?me(s,n):be(s,n))}function cn(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function Yr(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function rn(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function sn(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(rn(t,n.from)),e.push(rn(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(rn(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Jr(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,a)=>r.s-a.s||a.en-r.en),e=[],n=[],i=-1/0,o=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=i&&(o(),i=-1/0);let a=n.findIndex(c=>c<=r.s);a<0?(a=n.length,n.push(r.en)):n[a]=r.en,r.col=a,e.push(r),i=Math.max(i,r.en)}return o(),t}function Xr(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],i=s[e+1];if(t<=i.t)return i.t===n.t?n.y:Math.round(n.y+(t-n.t)/(i.t-n.t)*(i.y-n.y))}return s[s.length-1].y}function Zr(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],i=s[e+1];if(t<=i.y)return i.y===n.y?n.t:n.t+(t-n.y)/(i.y-n.y)*(i.t-n.t)}return s[s.length-1].t}function jo(s,t){return Xr(s.anchors,t)}function No(s,t){return Zr(s.anchors,t)}function Qr(s,t){let e=Ce(s),n=ke(s),i=Math.max(t,qn(e.length,n.length)),r=(i-Ge-Math.max(0,e.length-1)*Hn-on-Math.max(0,n.length-1)*Fn)/(e.length+an*n.length||1),a=Math.floor(r),c=Math.floor(r*an),l=new Map;for(let C of s.days)for(let x of C.events)for(let w of x.own?x.along:[x.kid]){let A=l.get(w)??[];A.some(p=>p.event_id===x.event_id&&p.calendar_id===x.calendar_id)||A.push(x),l.set(w,A)}let d=ye(s),u=[],h=Ge;e.forEach((C,x)=>{let w=l.get(C)??[],A=s.days.some(p=>p.events.some(L=>L.kid===C&&(L.sides.includes("drop")&&L.drop===""||L.sides.includes("pick")&&L.pick==="")));u.push({id:C,kind:"kid",x:h,w:a,name:me(s,C),dot:d.get(C).color,rgb:d.get(C).rgb,sub:`${A?"Needs a ride · ":""}${w.length} this week`,subWarn:A}),h+=a+(x<e.length-1?Hn:0)});let b=h+on/2;return h+=on,n.forEach((C,x)=>{let w=0,A=0;for(let p of s.days){let L=p.drivers[C];L&&(w+=L.outings.length,A+=L.drive??0)}u.push({id:C,kind:"driver",x:h,w:c,name:be(s,C),dot:nn,rgb:zn,sub:`${w} ${w===1?"trip":"trips"} this week · ${bt(A)} driving`,subWarn:!1}),h+=c+(x<n.length-1?Fn:0)}),{columns:u,sepX:b,width:i}}function ea(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let i=e.slice(t.length),o=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(i);if(!o)return e;let r=i.slice(o[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function Ro(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${N(s.start)}`:e||!t?`${s.title} until ${N(s.end)}`:`${s.title} ${N(s.start)}–${N(s.end)}`}function Gn(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length+(s.unplaced?.length??0)}function Yn(s,t){let e=_e(t,s);return e===0?"Today":e===1?"Tomorrow":""}function pe(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Wn(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),i=1,o=0;for(let r of s.split(/\s+/).filter(Boolean)){let a=r.length;for(o===0?o=a:o+1+a<=n?o+=1+a:(i++,o=a);o>n;)i++,o-=n}return i}var zo=25,Uo=15,Jn=3;function Io(s){return Math.max(0,Math.min(Jn,Math.floor((s-zo)/Uo)))}function ta(s,t){let e=Math.min(Jn,Wn(s,t-19,6.6));return zo+e*Uo+2}function Bo(s,t){let e=t-23,n=`${N(s.start)}–${N(s.end)}`+(s.arrive_by!=null?` · arrive ${N(s.arrive_by)}`:""),i=33+Wn(n,e,6.6)*16;for(let o of[s.lines.drop,s.lines.pick])o&&(i+=2+Wn(o.text,e,7)*16);return i+4}function Ho(s,t,e,n){let i=t==="compact",{columns:o,sepX:r,width:a}=Qr(s,e),c=new Map(o.map(p=>[p.id,p])),l=Ce(s),d=ke(s),u=[...l,...d],h=ye(s),b=Yr(s),C=p=>me(s,p),x=p=>be(s,p),w={mode:t,width:a,height:0,columns:o,sepX:r,dayHeads:[],allDay:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},A=0;return s.days.forEach((p,L)=>{let H=L*1440,Z=new Map(p.events.map(m=>[m.id,m])),ce=m=>m&&Z.has(m)?{day:p.date,event:m}:null,v=Gn(p),k=p.events.length,y=Yn(p.date,n.date);w.dayHeads.push({date:p.date,y:A,label:Ee(p.date),tag:y,sub:(k?`${k} ${k===1?"activity":"activities"}`:"Nothing scheduled")+(v?` · ${v} to sort out`:""),warn:v>0}),w.anchors.push({t:H,y:A});let $=ia(s,p,h,a);$&&w.allDay.push({...$,y:A+_t+Kn});let E=A+_t+Un+($?$.h+Kn:0),M=d.flatMap(m=>p.drivers[m]?.outings??[]);if(!k&&!M.length){w.empties.push({key:p.date,y:E,text:"Nothing planned"}),A=E+40,w.anchors.push({t:H+1439,y:A});return}let I=(m,R,F,O,X,he,f,_=m.kid)=>{let B=!!m.own&&_===m.own,z=!!m.own&&_!==m.own,W=B?Tt:h.get(_)??ue(0),ne=B?x(_):C(_),se=z?{drop:{text:`With ${x(m.own)}`,tone:m.attending===!1?"muted":"normal"},pick:null}:m.lines,P=B?Gr(s,m):[],ae=(m.takes!=null?`${m.takes} min, any time ${N(m.start)}–${N(m.end)}`:`${N(m.start)}–${N(m.end)}`+(m.arrive_by!=null?` · arrive ${N(m.arrive_by)}`:""))+(P.length?` · with ${cn(P)}`:"");return{key:`${p.date}|card|${m.id}`+(m.own?`|${_}`:""),x:R,y:F,w:O,h:X,target:{day:p.date,event:m.id},event:m,color:W,kidName:ne,clash:he,stayed:!m.own&&m.stay&&d.includes(m.drop),skipped:m.attending===!1,title:ea(m.title,ne),time:ae,drop:se.drop,pick:se.pick,showDrop:!!se.drop&&(f||X>=56),showPick:!!se.pick&&(f||X>=74),wrap:f,aria:`${ne}, ${m.title} ${m.takes!=null?`any time from ${N(m.start)} to ${N(m.end)}`:`${N(m.start)} to ${N(m.end)}`}. `+(m.attending===!1&&!se.drop?"Not attending. ":"")+[se.drop,se.pick].filter(S=>!!S).map(S=>S.text).join(". ")}},K=m=>{let R=p.rides[m];return R?(p.drivers[R.driver]?.segments??[]).filter(O=>O.type!=="home"&&O.kids.includes(R.kid)&&pe(O.start)>=pe(R.start)&&pe(O.end)<=pe(R.end)):[]},Y=m=>{let R=p.rides[m];if(!R)return null;let F=R.serves.find(O=>Z.get(O)?.kid===R.kid);return ce(F??R.serves[0])},Q=(m,R)=>{if(R.event)return R;let F=p.events.find(O=>O.own&&O.own!==m&&O.along.includes(m)&&O.title===R.title);return F?{...R,title:`${R.title} with ${x(F.own)}`}:R},j=m=>{if(m.takes==null)return[m.start,m.end];let R=m.planned??m.start;return[R,R+m.takes]},D=new Map;for(let m of p.issues)m.level!=="problem"||!m.event||(m.kind==="late"&&D.set(m.event,`${Math.round(pe(m.minutes))} min late`),m.kind==="waiting"&&D.set(`${m.event}|pick`,`Waits ${Math.round(pe(m.minutes))} min`));if(!i){let m=1/0,R=-1/0;for(let f of p.events)f.start<=0&&f.end>=1440||(f.start>0?m=Math.min(m,f.start-20,f.arrive_by!=null?f.arrive_by-10:1/0):m=Math.min(m,f.end-30),f.end<1440?R=Math.max(R,f.end+20):R=Math.max(R,f.start+30));for(let f of M)f.start!=null&&(m=Math.min(m,f.start)),f.end!=null&&(R=Math.max(R,f.end));p.date===n.date&&Number.isFinite(m)&&n.minutes>m-60&&n.minutes<R&&(m=Math.min(m,n.minutes-15));let F=Number.isFinite(m)?Math.floor((m-5)/30)*30:900,O=Number.isFinite(R)?Math.ceil((R+5)/30)*30:960,X=f=>Math.round(E+(Math.max(F,Math.min(O,f))-F)*Kr);w.anchors.push({t:H+F,y:X(F)},{t:H+O,y:X(O)});for(let f of l){let _=c.get(f),B=h.get(f),z=(p.kids[f]?.items??[]).filter(S=>S.start!=null&&S.end!=null).map(S=>({item:S,s:pe(S.start),en:pe(S.end)})),W=[];for(let S of Jr(z)){let U=_.w/S.cols,q=Math.round(_.x+S.col*U),ee=Math.round(U-(S.cols>1?4:0)),re=X(S.s),te=S.item;if(te.type==="act"){let ve=Z.get(te.event??"");if(!ve)continue;let Ot=Math.max(30,X(S.en)-re),jt=I(ve,q,re,ee,Ot,te.clash,!1,f);if(jt.layer=Et,w.cards.push(jt),ve.arrive_by!=null&&ve.start-ve.arrive_by>=5){let _n=X(ve.arrive_by),zs={key:`${p.date}|prep|${ve.id}`,x:q,y:_n,w:ee,h:re-_n+Te,color:B,label:`Arrive by ${N(ve.arrive_by)}`,layer:Et-1};w.preps.push(zs),W.push({s:ve.arrive_by,en:S.en,top:_n,bottom:re+Ot,x:q,w:ee,prep:zs,card:jt})}else W.push({s:S.s,en:S.en,top:re,bottom:re+Ot,x:q,w:ee,card:jt});let js=D.get(ve.id);js&&w.marks.push({key:`${p.date}|late|${ve.id}`,x:q+ee-4,y:re+4,text:js,right:!0});let Ns=D.get(`${ve.id}|pick`);Ns&&w.marks.push({key:`${p.date}|wait|${ve.id}`,x:q+4,y:re+Ot+2,text:Ns,right:!1});continue}let G=p.rides[te.ride??-1];if(!G)continue;let $e=Math.max(22,X(S.en)-re),pt=sn(K(G.index),b),Is=x(G.driver),Bs={key:`${p.date}|ride|${G.index}`,x:q,y:re,w:ee,h:$e,target:Y(G.index),l1:`${G.own?"In":"Along in"} ${Is}’s car`,l2:pt.join(" → "),show2:Io($e)>0,lines2:Io($e),dashed:!G.own,clash:te.clash,aria:`${C(f)} ${G.own?"in":"riding along in"} ${Is}’s car, ${N(pe(G.start))} to ${N(pe(G.end))}: ${pt.join(" to ")}`};w.rides.push(Bs);let Os=c.get(G.driver),En=null;Os&&(En={key:`${p.date}|band|${G.index}`,x:q+ee,y:re,w:Math.max(0,Os.x+8-(q+ee)),h:$e,color:B},w.bands.push(En)),W.push({s:S.s,en:S.en,top:re,bottom:re+$e,x:q,w:ee,ride:Bs,band:En})}let ne=S=>S.ride?.layer??(S.prep?Et-1:Et),se=(S,U,q,ee)=>{q>Te&&w.links.push({key:`${S.key}|link`,x:S.x,y:U,w:S.w,h:q,color:B,layer:ee})},P=(S,U)=>{if(!(U.x<S.x||U.x+U.w>S.x+S.w)&&(S.x=U.x,S.w=U.w,S.ride.x=U.x,S.ride.w=U.w,S.band)){let q=S.band.x+S.band.w;S.band.x=U.x+U.w,S.band.w=Math.max(0,q-S.band.x)}},ae=new Set;for(let S of[...W].sort((U,q)=>q.s-U.s)){let U=S.ride;if(!U)continue;let q=W.filter(te=>te!==S&&te.s>=S.en&&te.s-S.en<=Lo&&te.top>=S.bottom).sort((te,G)=>te.s-G.s||te.top-G.top)[0];if(!q)continue;ae.add(S),P(S,q);let ee=ne(q),re=q.top-S.bottom;se(U,S.bottom,re+Te,ee-1),U.layer=ee-(re>0?2:1),U.h+=Te,U.tuckBottom=Te}for(let S of[...W].sort((U,q)=>U.s-q.s)){let U=S.ride;if(!U||ae.has(S))continue;let q=W.filter(te=>te!==S&&te.en<=S.s&&S.s-te.en<=Lo&&te.bottom<=S.top&&(te.card||te.ride?.layer!=null)).sort((te,G)=>G.en-te.en||G.bottom-te.bottom)[0];if(!q)continue;P(S,q);let ee=q.ride?.layer??Et,re=S.top-q.bottom;se(U,q.bottom-Te,re+Te,ee-1),U.layer=ee-(re>0?2:1),U.y-=Te,U.h+=Te,U.tuckTop=Te}}for(let f of d){let _=c.get(f),B=p.drivers[f];if(!B)continue;let z=[],W=null;for(let P of B.segments)if(!(P.start==null||P.end==null)){if(P.type==="home"){W=null;continue}if(P.type==="stay"){W=null,z.push({type:"stay",g:P,s:P.start,en:P.end});continue}W&&W.en===P.start?(W.en=P.end,W.legs.push(P)):(W={type:"trip",s:P.start,en:P.end,legs:[P]},z.push(W))}let ne=new Set,se=(P,ae,S,U)=>{ne.add(P.id);let q=X(ae),ee=I(P,_.x+8,q,_.w-16,Math.max(30,X(S)-q),!1,!1,f);U&&ee.drop?.tone==="normal"&&(ee.drop=null,ee.showDrop=!1),w.cards.push(ee)};for(let P of z){let ae=X(P.s),S=Math.max(24,X(P.en)-ae);if(P.type==="stay"){let G=Z.get(P.g.event??P.g.serves??"");if(G?.own===f){se(G,P.s,P.en,!0);continue}let $e=G?h.get(G.kid)??ue(0):ue(0),pt=P.g.kids.map(C);w.stays.push({key:`${p.date}|stay|${f}|${P.s}`,x:_.x+8,y:ae,w:_.w-16,h:S,target:ce(G?.id),color:$e,l1:G?`At ${G.title} with ${C(G.kid)}`:"Staying",l2:`until ${N(P.en)}`+(pt.length?` · ${pt.join(" and ")} too`:"")});continue}let U=P.legs[0],q=P.legs[P.legs.length-1],ee=[];for(let G of P.legs)for(let $e of G.kids)ee.includes($e)||ee.push($e);let re=q.type==="drive"&&q.to==="home",te=sn(P.legs,b);w.trips.push({key:`${p.date}|trip|${f}|${P.s}`,x:_.x+8,y:ae,w:_.w-16,h:S,target:ce(P.legs.find(G=>G.serves)?.serves),l1:U.type==="drive"&&U.from==="home"?`Leave ${N(P.s)}`:`From ${rn(b,U.from??U.place)} ${N(P.s)}`,l2:te.join(" → "),show2:S>=36,l3:re?`Home ${N(P.en)}`:"",show3:re&&S>=62,stops:null,kids:ee.map(G=>(h.get(G)??ue(0)).color),bad:P.legs.some(G=>G.overlaps_busy),aria:`${x(f)} drives ${te.join(" to ")}, ${N(P.s)} to ${N(P.en)}`})}for(let P of B.segments)if(!(!P.overlaps_busy||P.start==null||P.end==null))for(let ae of B.busy){let S=Math.max(P.start,ae.start),U=Math.min(P.end,ae.end);U<=S||w.overlaps.push({key:`${p.date}|overlap|${f}|${S}`,x:_.x+6,y:X(S)-2,w:_.w-12,h:Math.max(8,X(U)-X(S)+4)})}for(let P of p.events)if(P.own===f&&(ne.has(P.id)||se(P,...j(P),!1),P.takes!=null&&P.attending!==!1)){let ae=X(P.start);w.windows.push({key:`${p.date}|window|${P.id}`,x:_.x+4,y:ae,w:_.w-8,h:Math.max(24,X(P.end)-ae),label:`${P.title} · any time ${N(P.start)}–${N(P.end)}`})}for(let P of B.busy){if(P.event||P.end<=F||P.start>=O)continue;let ae=Q(f,P),S=X(ae.start),U=X(ae.end);w.busy.push({key:`${p.date}|busy|${f}|${ae.start}`,x:_.x+1,y:S,w:_.w-2,h:U-S,labelY:8,label:Ro(ae,!1)})}}let he=-1/0;for(let f=F;f<=O;f+=30)w.grid.push({key:`${p.date}|grid|${f}`,y:X(f),strong:f%60===0}),f%60===0&&X(f)-he>=22&&(w.hours.push({key:`${p.date}|hour|${f}`,y:X(f)-8,label:no(f)}),he=X(f));p.date===n.date&&n.minutes>F&&n.minutes<O&&(w.now={y:X(n.minutes),label:`Now ${N(n.minutes)}`}),A=X(O)+Un;return}let V=[];for(let m of l){let R=c.get(m);for(let F of p.kids[m]?.items??[])if(F.start!=null){if(F.type==="act"){let O=Z.get(F.event??"");if(!O)continue;V.push({col:m,s:F.start,h:Bo(O,R.w),kind:"act",item:F})}else if(!p.rides[F.ride??-1]?.own){let O=p.rides[F.ride??-1],X=O?sn(K(O.index),b).join(" → "):"";V.push({col:m,s:F.start,h:ta(X,R.w),kind:"along",item:F})}}}for(let m of d){let R=p.drivers[m];if(!R)continue;for(let O of R.busy)O.event||V.push({col:m,s:O.start,h:32,kind:"busy",busy:Q(m,O)});let F=c.get(m).w;for(let O of p.events)O.own!==m||O.attending!==!1&&(O.takes==null||O.planned!=null)||V.push({col:m,s:j(O)[0],h:Bo(O,F),kind:"own",event:O});for(let O of R.outings)O.start!=null&&V.push({col:m,s:O.start,h:30+O.lines.length*16+(O.warn?16:0),kind:"out",out:O})}V.sort((m,R)=>m.s-R.s||u.indexOf(m.col)-u.indexOf(R.col));let J=new Map,ie=[],xe=E;V.forEach((m,R)=>{let F=J.get(m.col),O=Math.max(F!=null?F+Do:E,xe);J.set(m.col,O+m.h),xe=O;let X=m.kind==="busy"?m.busy.end:m.kind==="act"?Z.get(m.item.event??"")?.end??null:m.kind==="own"?j(m.event)[1]:null;ie.push({col:m.col,s:m.s,end:X,y:O,h:m.h,box:null}),w.anchors.push({t:H+m.s,y:O});let he=c.get(m.col);if(m.kind==="busy"){let f={key:`${p.date}|busy|${m.col}|${R}`,x:he.x+1,y:O,w:he.w-2,h:m.h,labelY:8,label:Ro(m.busy,!0)};w.busy.push(f),ie[ie.length-1].box=f}else if(m.kind==="out"){let f=m.out;w.trips.push({key:`${p.date}|trip|${m.col}|${R}`,x:he.x+8,y:O,w:he.w-16,h:m.h,target:ce(f.target),l1:f.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...f.lines.map(_=>({text:_,warn:!1})),...f.warn?[{text:f.warn,warn:!0}]:[]],kids:f.kids.map(_=>(h.get(_)??ue(0)).color),bad:!!f.warn,aria:`${x(m.col)}: ${f.lead}. ${f.lines.join(". ")}${f.warn?`. ${f.warn}`:""}`})}else if(m.kind==="own"){let f=I(m.event,he.x+8,O,he.w-16,m.h,!1,!0,m.col);w.cards.push(f),ie[ie.length-1].box=f}else if(m.kind==="act"){let f=Z.get(m.item.event??""),_=I(f,he.x,O,he.w,m.h,m.item.clash,!0,m.col);w.cards.push(_),ie[ie.length-1].box=_}else{let f=p.rides[m.item.ride??-1],_=sn(K(f.index),b),B=x(f.driver);w.rides.push({key:`${p.date}|ride|${f.index}`,x:he.x,y:O,w:he.w,h:m.h,target:Y(f.index),l1:`Along with ${B} ${N(pe(f.start))}`,l2:_.join(" → "),show2:!0,lines2:Jn,dashed:!0,clash:m.item.clash,aria:`${C(m.col)} riding along with ${B}, ${N(pe(f.start))} to ${N(pe(f.end))}: ${_.join(" to ")}`})}});let oe=E;for(let m of J.values())oe=Math.max(oe,m);for(let m of ie){if(!m.box||m.end==null)continue;let R=m.y+m.h;for(let F of ie)F.col!==m.col&&F.s>=m.s&&F.s<m.end&&(R=Math.max(R,F.y+F.h));m.end>=1440&&(R=oe);for(let F of ie)F.col===m.col&&F.y>m.y&&(R=Math.min(R,F.y-Do));R=Math.min(R,oe),R>m.y+m.h&&(m.box.h=R-m.y)}A=oe+Un+6,w.anchors.push({t:H+1439,y:A})}),w.height=A,w}var na=["","¼","½","¾"];function Ve(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return bt(n);let i=Math.round(n*4),o=Math.floor(i/4),r=na[i%4];return`${o||!r?o:""}${r} min`})}function Fo(s){let t=e=>e?{...e,text:Ve(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,i])=>[n,{...i,outings:i.outings.map(o=>({...o,lines:o.lines.map(Ve),warn:o.warn==null?o.warn:Ve(o.warn)}))}])),issues:e.issues.map(n=>({...n,title:Ve(n.title),body:Ve(n.body),note:n.note==null?n.note:Ve(n.note),...n.suggestions?{suggestions:n.suggestions.map(i=>({...i,note:Ve(i.note)}))}:{}}))}))}}var sa=2,oa=48;function Ko(s,t,e=oa){let n=[],i=new Set(ke(s)),o=Ce(s).map(h=>me(s,h)),r=o.length>1?o.slice(0,2):[o[0]??"Ava","Ben"],a=0,c=0,l=0,d=0,u=t.minutes+e*60;for(let h of s.days){let b=_e(t.date,h.date),C=b===0?"":`${ge(h.date)} · `,x=new Map(h.events.map(p=>[p.id,p])),w=p=>p&&x.has(p)?{day:h.date,event:p}:null,A=(p,L)=>b*1440+(p??x.get(L??"")?.start??0)<u;for(let p of h.issues)if(p.level==="problem"){if(!A(p.at,p.event)){l++,p.kind==="unassigned"&&d++;continue}a++,p.kind==="unassigned"&&c++,n.push({key:`${h.date}|${p.key}`,tone:p.kind==="unassigned"?"unassigned":"problem",title:C+p.title,body:p.body,target:w(p.event),suggestions:(p.suggestions??[]).map(L=>({id:L.id,label:L.label,note:L.note}))})}if(h.clashes.forEach((p,L)=>{if(!A(p.a.start,p.a.event)){l++;return}a++;let H=x.get(p.a.event??""),Z=me(s,p.kid),ce=(k,y)=>{let $=w(y);return $?{text:k,target:$}:k},v=[];if(p.b.type==="act"){let k=x.get(p.b.event??"");H&&k&&(v=[ce(H.title,H.id),` ${N(H.start)}–${N(H.end)} and `,ce(k.title,k.id),` ${N(k.start)}–${N(k.end)} overlap.`])}else{let k=h.rides[p.b.ride??-1];H&&k&&(v=[`${Z} is in `,ce(`${be(s,k.driver)}’s car`,k.serves[0]),` ${N(pe(p.b.start))}–${N(pe(p.b.end))}, during `,ce(H.title,H.id),"."])}n.push({key:`${h.date}|clash|${L}`,tone:"problem",title:`${C}${Z} is double-booked`,body:v.map(k=>typeof k=="string"?k:k.text).join(""),parts:v,target:null,suggestions:[]})}),b>=0&&b<sa)for(let p of h.issues)p.level!=="heads_up"||!A(p.at,p.event)||n.push({key:`${h.date}|${p.key}`,tone:"heads_up",title:C+p.title,body:p.body,target:w(p.event),suggestions:[]});for(let p of h.unplaced??[]){if(!A(p.at)){l++;continue}a++;let L=p.people.map(H=>i.has(H)?be(s,H):me(s,H));n.push({key:`${h.date}|unplaced|${p.id}`,tone:"problem",title:`${C}${N(p.at)} ${p.title}: ${Wo(p).toLowerCase()}`,body:p.reason==="unknown"&&p.word?`“${p.word}” isn’t anyone in the family, so this is only in ${cn(L)}’s lane. If it’s a misspelt name, fix the title in Google Calendar.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Start the title in Google Calendar with who it’s for, such as “${r[0]} Piano”, or “${r.join(" & ")} Piano” for both.`,target:null,suggestions:[]})}for(let p of h.events)!p.problems.length||!A(p.start)||n.push({key:`${h.date}|notes|${p.id}`,tone:"heads_up",title:`${C}Check the notes on ${ln(s,p)}’s ${p.title}`,body:`These lines couldn’t be read: ${p.problems.join("; ")}`,target:w(p.id),suggestions:[]})}return{items:n,problems:a,unassigned:c,later:l,laterUnassigned:d}}function Wo(s){return s.reason==="unknown"&&s.word?`Who is “${s.word}”?`:"Who is this for?"}function ia(s,t,e,n){let i=new Set(ke(s)),o=d=>{let u=d[0];return u==null?null:i.has(u)?Tt:e.get(u)??null},r=[...(t.all_day??[]).map(d=>({key:`${t.date}|allday|${d.id}`,title:d.title,note:d.days>1?`Day ${d.day_number} of ${d.days}`:"",color:o(d.people),cancelled:d.cancelled,warn:!1})),...(t.unplaced??[]).map(d=>({key:`${t.date}|unplaced|${d.id}`,title:`${N(d.at)} ${d.title}`,note:Wo(d),color:null,cancelled:!1,warn:!0}))];if(!r.length)return null;let a=Math.max(120,n-Ge),c=1,l=0;for(let d of r){let u=Math.min(a,30+7*(d.title.length+(d.note?d.note.length+2:0)));l&&l+u>a&&(c++,l=0),l+=u}return{key:`${t.date}|allday`,h:c*Vr+(c-1)*Kn,chips:r}}function qo(s,t){let e=ye(s),n=null,i=o=>o.ahead>0?2:o.ongoing?1:0;for(let o of s.days){let r=_e(t.date,o.date);if(!(r<0))for(let a of ke(s))for(let c of o.drivers[a]?.outings??[]){if(c.start==null)continue;let l=r*1440+c.start;if(r*1440+pe(c.end,c.start)<=t.minutes)continue;let u=l-t.minutes,h={driver:a,name:be(s,a),date:o.date,ahead:r,start:c.start,inMinutes:u,ongoing:u<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(b=>e.get(b)??ue(0)),warn:c.warn,target:c.target&&o.events.some(b=>b.id===c.target)?{day:o.date,event:c.target}:null};(!n||i(h)<i(n)||i(h)===i(n)&&h.inMinutes<n.inMinutes)&&(n=h)}}return n}function it(s){return s.state==="done"||s.state==="late"}var ra=780;function aa(s,t,e){return s.state==="open"&&!!s.for_day&&s.due===t&&e<ra}function Vo(s,t){return s.chores.map(e=>aa(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function Go(s){return s.state==="open"||s.state==="overdue"}function Qn(s,t,e){if(it(s)){let n=s.done_at?la(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${Xn(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${Xn(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let i=_e(t,s.due);return`By ${i===1?"tomorrow":i<7?ge(s.due):Zn(s.due)}`}if(s.for_day&&s.due===t)return`Tonight · for ${Xn(s.for_day,t)}`;if(s.due&&s.due>t){let n=_e(t,s.due);return n===1?"By tomorrow":`By ${n<7?ge(s.due):Zn(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function Xn(s,t){let e=_e(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?ge(s):Zn(s)}function Zn(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function la(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let i=e;try{new Intl.DateTimeFormat("en-US",{timeZone:i})}catch{i=void 0}let o=n.toLocaleDateString("en-CA",{timeZone:i}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:i});return o===t?r:`${ge(o)} ${r}`}function Yo(s,t,e=1440){let n=Vo(s,e).sort((i,o)=>i.order-o.order);return s.kids.map((i,o)=>{let r=n.filter(d=>d.kid===i.id),a=new Map;for(let d of r){if(d.state!=="upcoming")continue;let u=d.shows_from??d.due??s.today;a.set(u,[...a.get(u)??[],d])}let c=r.filter(d=>d.state==="overdue"),l=r.filter(d=>d.state==="open");return{kid:i.id,name:i.name,color:t?.get(i.id)??ue(o),overdue:c,now:l,done:r.filter(it),later:[...a.entries()].sort(([d],[u])=>d.localeCompare(u)).map(([d,u])=>({date:d,chores:u})),left:c.length+l.length}})}function Jo(s,t=1440){return Vo(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function es(s){return!s.chores.length&&!s.templates.length}var Ye=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function ts(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[i,o]=n.split("-").map(r=>Ye.indexOf(r.trim()));if(i===void 0||i<0||o!==void 0&&o<0)return null;if(o===void 0)e.add(i);else for(let r=0;r<=(o-i+7)%7;r++)e.add((i+r)%7)}return e}function ns(s){let t=[...new Set(s)].sort((n,i)=>n-i);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let i=e.at(-1);i&&i.at(-1)===n-1?i.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${Ye[n[0]]}-${Ye[n.at(-1)]}`]:n.map(i=>Ye[i])).join(", ")}var Je="none";function dn(s){return s==="daily"||s==="school"?"":"Any"}function Xo(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function Zo(s){let t=s.days??dn(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function ss(s){return s.title.trim()?s.who.length?s.days===Je?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function Qo(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function os(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function is(s,t,e=1,n=!1,i=!1){if(s==="school"){let d=t.trim().replace(/-/g,"–"),u=i?d?`${d} Bring lunch days`:"Bring lunch days":d?`${d} school days`:"Every school day";return n?`${u}, the night before`:u}let o={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${o}s`:`each ${o}`,a=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(a))return e>1?`Every day, every ${e} weeks`:"Every day";if(!a||a.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${a.replace(/-/g,"–")} ${r}`;let l=`${a.split(",").map(d=>{let u=d.trim();return u.toLowerCase()==="last"?"the last day":/^\d+$/.test(u)?`the ${os(Number(u))}`:`the ${u}`}).join(" and ")} ${r}`;return l[0].toUpperCase()+l.slice(1)}function rs(s,t,e=!1){let n=s.map(o=>t.find(r=>r.id===o)?.name??o);if(!n.length)return"Nobody yet";let i=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${i} take turns`:i}function as(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function un(s,t){return`${s}|${t}`}function rt(s,t){let[e,n,i]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,i+t)).toISOString().slice(0,10)}function hn(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function ei(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function ti(s,t){return hn(t)<5&&!ei(s,t)}function Ct(s,t,e=new Map){if(!ti(s,t))return null;let n=un(s.id,t);if(e.has(n)){let o=e.get(n);return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}let i=s.picks[t];return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}function at(s,t){return ti(s,t)?s.menus?.[t]??null:null}var ca="From the school's menu feed.";function da(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==ca);return t.length?t.join(`
`):null}function Ae(s){return s.slice(0,7)}function pn(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function ls(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function ni(s){let t=[];for(let e=Ae(s.first);e<=Ae(s.last);e=ls(e))t.push(e);return t}function si(s,t,e,n=new Map){let i=`${e}-01`,o=rt(i,-hn(i)),r=[];for(;Ae(o)<=e;){let a=[];for(let c=0;c<5;c++){let l=rt(o,c),d=Ae(l)!==e,u=d?null:ei(t,l),h=d?null:Ct(t,l,n);a.push({date:l,day:Number(l.slice(8)),outside:d,off:u?u.title:null,lunch:h?.lunch??null,picked:h?.picked??!1,menu:d?null:at(t,l)?.dish??null,sides:d?null:da(at(t,l)?.details??""),past:l<s.today,today:l===s.today})}a.some(c=>!c.outside)&&r.push(a),o=rt(o,7)}return r}function oi(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function ii(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function ri(s,t,e,n=new Map){let i=e<780?0:1;for(let o=i;o<8;o++){let r=rt(t,o),a=Ct(s,r,n);if(!a)continue;let c=_e(t,r);return{lunch:a.lunch,when:c===0?"today":c===1?"tomorrow":ge(r),date:r,menu:at(s,r)?.dish??null}}return null}var ua={timeline:"timeline",full:"timeline",compact:"compact"};function At(s){let t=new URLSearchParams(s),e={},n=ua[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let i=(t.get("page")??"").trim().toLowerCase();return(i==="rides"||i==="chores"||i==="lunch")&&(e.page=i),e}var ha=["auth_callback","code","state"];function cs(s){let t=new URLSearchParams(s);for(let n of ha)t.delete(n);let e=t.toString();return e?`?${e}`:""}var ai=Ue`
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
`;var qi="mydashlight.rides.mode",Kl=1100,Wl=440,ql=700,Vl=3*6e4,Gl=1200;function Yl(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var kn=de`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,Hi=de`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Jl=new URL("emoji.json",import.meta.url).href,Fi=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],Ki=de`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Wi=de`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Xl=de`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Zl=de`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Pt={bring:"Bring",buy:"Buy"};function Ql(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function Me(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function Ss(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function ec(s,t){return Yn(s,t)||Ee(s).split(",")[0]}function tc(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function nc(){try{return localStorage.getItem(qi)==="compact"?"compact":"timeline"}catch{return"timeline"}}function sc(s){try{localStorage.setItem(qi,s)}catch{}}function $n(s){return s.days.every(t=>!t.events.length)}var Dt=class extends we{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=At(location.search).view;this.urlPage=At(location.search).page;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let i=e.clientX-n.x,o=e.clientY-n.y;if(!n.moved){if(Math.abs(i)+Math.abs(o)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}n.el.scrollTop=n.top-o,n.el.scrollLeft=n.left-i};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Vl))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??nc(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[i,o]of this.lunchDraft){let[r,a]=i.split("|"),c=e.kids.find(l=>l.id===r);(!c||(c.picks[a]??null)===o||!Ct(c,a))&&n.delete(i)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let i of e.chores)n.has(i.id)&&it(i)===n.get(i.id)&&n.delete(i.id);for(let i of n.keys())e.chores.some(o=>o.id===i)||n.delete(i);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=Fo(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Kl)return!1;let e=this.plan;return!e||this.width-Wl>=qn(Ce(e).length,ke(e).length)}today(){return mt(this.plan?.time_zone??Yl())}currentBoard(){let e=this.plan;if(!e)return null;let n=this.today(),i=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;return(this.board==null||e!==this.boardPlan||i!==this.boardKey)&&(this.board=Ho(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=i),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n){let i=this.scroller;if(!i||!this.board)return;let o=this.board.dayHeads.find(r=>r.date===n)?.y??0;i.scrollTop=Math.max(o,jo(this.board,e)-_t-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),n=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(n*1440+(this.mode==="timeline"&&n===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[n]?.date)}goToDay(e){let n=this.plan;if(!n)return;let i=this.today();if(e===i.date){this.scrollToNow();return}let o=this.dayIndexOf(e),r=n.days[o];if(!r)return;let a=1/0;if(this.mode==="timeline"){for(let c of r.events)a=Math.min(a,c.arrive_by??c.start);for(let c of Object.values(r.drivers))for(let l of c.outings)l.start!=null&&(a=Math.min(a,l.start))}this.scrollToTime(o*1440+(Number.isFinite(a)?Math.max(0,a-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,i=this.board.dayHeads[0];for(let l of this.board.dayHeads)l.y<=n+1&&(i=l);let o=this.renderRoot,r=o.querySelector(".pinned .label"),a=o.querySelector(".pinned .tag"),c=o.querySelector(".pinned .sub");r&&r.textContent!==i.label&&(r.textContent=i.label),a&&(a.textContent!==i.tag&&(a.textContent=i.tag),a.hidden=!i.tag),c&&c.textContent!==i.sub&&(c.textContent=i.sub),c?.classList.toggle("warn",i.warn);for(let l of o.querySelectorAll(".day-tile"))l.classList.toggle("in-view",l.dataset.date===i.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let i=!this.choreDone(e),o=new Map(this.choreDraft);o.set(e.id,i),this.choreDraft=o;try{await this.backend.setChoreDone(e.id,i,n&&n!==e.kid?n:void 0)}catch(r){let a=new Map(this.choreDraft);a.delete(e.id),this.choreDraft=a;let c=r instanceof le?r:new le("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??it(e)}editMenu(e,n){let i=this.lunch?.kids??[],o=at(e,n),r=i.filter(a=>a.id===e.id||o&&at(a,n)?.dish===o.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:o?.dish??"",details:o?.details??"",kids:r,had:!!o,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(i){this.menuEdit={...n,busy:!1};let o=i instanceof le?i:new le("error",String(i));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async saveLunch(e,n,i){if(!this.backend||!n.length)return;let o=new Map(this.lunchDraft);for(let r of n)o.set(un(e,r),i);this.lunchDraft=o;try{await this.backend.setLunch(e,n,i)}catch(r){let a=new Map(this.lunchDraft);for(let l of n)a.delete(un(e,l));this.lunchDraft=a;let c=r instanceof le?r:new le("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?Zo(e):Xo(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(Ui(),zi))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||ss(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(Qo(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let i=n instanceof le?n:new le("error",String(n));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let i=n instanceof le?n:new le("error",String(n));this.showToast(i.code==="preview"?i.message:`Couldn’t remove that. ${i.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller;this.keepAt=n&&this.board?No(this.board,n.scrollTop+_t+4):null,this.mode=e,this.urlView||sc(e)}findEvent(e){let n=this.plan?.days.find(o=>o.date===e.day),i=n?.events.find(o=>o.id===e.event);return n&&i?{day:n,event:i}:null}open(e,n=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),i=this.dayIndexOf(e.day);!n||i<0||this.scrollToTime(i*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,i){if(!this.pending){this.pending={key:e,value:n};try{await i()}catch(o){let r=o instanceof le?o:new le("error",String(o));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,i){if(!this.backend)return;let o=this.backend;this.save(`${n}`,i,()=>o.setRide(e.id,n,i,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let i=this.backend;this.save("attending",n,()=>i.setAttending(e.id,n,this.scope))}toggleStay(e){if(!this.backend)return;let n=this.backend;this.save("stay",!e.stay,()=>n.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,n,i="drop"){if(!this.backend)return;let o=this.backend,r=i==="pick"?e.pick_along??[]:e.along,a=r.includes(n)?r.filter(c=>c!==n):[...r,n];this.save(`along-${i}`,a,()=>o.setTakeAlong(e.id,a,this.scope,i))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let i=this.backend;this.save("takes",n,()=>i.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let i=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,o;n<0?o=(i??e.start)-5:o=i==null||i+5>=e.start?null:i+5,this.arriveDraft=o,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Gl)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let i=this.findEvent(n);if(!i||i.event.arrive_by===e){this.arriveDraft=void 0;return}let o=this.backend,r=i.event.id,a=this.scope;this.save("arrive",e,()=>o.setArriveBy(r,e,a)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),i=e?Ko(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},o=this.wide,r=this.chores?Jo(this.chores,this.today().minutes).filter(u=>!this.choreDone(u)):[],a=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,c=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",l=g`<aside class="panel" aria-label=${c}>
      ${a??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,r))}
    </aside>`,d=this.page==="rides";return g`
      <div class="app ${o?"wide":this.width<ql?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,r.length)} ${d&&e?this.renderWeek(e):T}
          ${d?this.renderBanner(e):T}
          <main>
            ${d?g`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?$n(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                </section>`:this.page==="lunch"?g`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:g`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!o&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?g`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${l}`:T}
          </main>
        </div>
        ${o?l:T}
        ${this.toast?g`<div class="toast" role="status">${this.toast}</div>`:T}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,i){let o=n.problems+i;this.tick;let r=this.today(),a="";if(e){let h=e.time_zone,b=new Date(e.updated);this.error?a=g`<span class="bad">Can’t reach Home Assistant · showing the plan from ${Ht(b,new Date,h)}</span>`:e.status&&!e.status.ok?a=g`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Ht(b,new Date,h)}</span>`:this.backend?.live||(a=`Updated ${Ht(b,new Date,h)}`)}let c=(h,b,C,x)=>g`
      <button type="button" class="seg-btn" title=${x} aria-pressed=${this.mode===h?"true":"false"} @click=${()=>this.setMode(h)}>
        ${C}<span class="seg-label">${b}</span>
      </button>
    `,l=(h,b,C)=>g`
      <button type="button" class="seg-btn" aria-pressed=${this.page===h?"true":"false"} @click=${()=>this.setPage(h)}>
        ${C}<span class="seg-label">${b}</span>
      </button>
    `,d=gt(r.minutes),u=!!e&&$n(e);return g`
      <header>
        ${this.showMenu?g`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${de`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:T}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Ee(r.date)}, ${d}`}>
            <span class="hm">${d.slice(0,-3)}</span><span class="ampm">${d.slice(-2)}</span>
          </h1>
          <p class="today-line">${Ee(r.date)}</p>
          ${a?g`<p class="status">${a}</p>`:T}
        </div>
        ${e&&!u?this.renderNext(e,qo(e,r),n):T}
        <div class="controls">
          ${this.wide||u&&!i?T:g`<button type="button" class="attn-btn ${o?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${o}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?T:g`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",de`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",de`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${l("rides","Rides",de`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${l("chores","Chores",de`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?T:l("lunch","Lunch",de`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,i){if(!n){let l=this.today().date,d=i.unassigned,u=i.laterUnassigned;if(d){let b=g`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${d} ${d===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?g`<div class="next idle needs">${b}</div>`:g`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${b}</button>`}if(u)return g`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${u} ${u===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let h=e.days.some(b=>b.date>=l&&b.events.length);return g`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${h?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${h?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let o;n.ongoing?o="On the road now":n.ahead===0?o=n.inMinutes<180?`Next trip · in ${bt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?o="Next trip · tomorrow":o=`Next trip · ${ge(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,a=g`
      <span class="next-eyebrow">${o}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Me(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(l=>g`<span class="kid-dot" style="background:${l.color}"></span>`)}</span>
      </span>
      ${n.warn?g`<span class="next-stop warn">${n.warn}</span>`:n.stop?g`<span class="next-stop">${n.stop}</span>`:T}
    `,c=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?g`<button type="button" class=${c} @click=${()=>this.open(n.target)}>${a}</button>`:g`<div class=${c}>${a}</div>`}renderWeek(e){let n=this.today().date,i=ye(e);return g`<nav class="week" aria-label="Days">
      ${e.days.map(o=>{let r=Gn(o),a=o.events.length,c=o.events.slice(0,6).map(d=>d.own?Tt.color:i.get(d.kid)?.color??ue(0).color),l=`${Ee(o.date)}: ${a?`${a} ${a===1?"activity":"activities"}`:"nothing planned"}${r?`, ${r} to sort out`:""}`;return g`<button
          type="button"
          class="day-tile ${o.date===n?"today":""}"
          data-date=${o.date}
          aria-label=${l}
          @click=${()=>this.goToDay(o.date)}
        >
          <span class="dt-wd">${o.date===n?"Today":ge(o.date)}</span>
          <span class="dt-num">${Number(o.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${c.length?c.map(d=>g`<span class="dt-dot" style="background:${d}"></span>`):g`<span class="dt-free">free</span>`}
            ${a>6?g`<span class="dt-more">+${a-6}</span>`:T}
          </span>
          ${r?g`<span class="dt-badge" aria-hidden="true">${r}</span>`:T}
        </button>`})}
    </nav>`}renderQuiet(e){let n=Ce(e),i=ke(e),o=ye(e),r=n.map(a=>me(e,a));return g`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((a,c)=>de`<circle cx=${50+c*30} cy="80" r="11" fill=${o.get(a).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${tc(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(a=>{let c=o.get(a);return g`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${Me(me(e,a))}</span>
            <span class="qw-name">${me(e,a)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${i.map(a=>g`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Me(be(e,a))}</span>
            <span class="qw-name">${be(e,a)}</span>
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
    </div>`}renderBanner(e){if(e?.needs_setup==="events_calendar")return g`<div class="banner" role="status">
        Pick your family calendar to see the week: in Home Assistant, open Settings &gt; Devices &amp; services &gt; MyDashLight &gt;
        Configure &gt; Calendars.
      </div>`;let n=e?.unavailable_calendars.length??0;return n?g`<div class="banner" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:T}renderEmpty(){return this.error?g`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:g`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let n=this.sel,i=l=>!!l&&!!n&&l.day===n.day&&l.event===n.event,o=e.dayHeads[0],r=e.width,a=100,c=[...e.links.map(l=>({t:"link",x:l,z:l.layer??0})),...e.preps.map(l=>({t:"prep",x:l,z:l.layer??a-1})),...e.cards.map(l=>({t:"card",x:l,z:l.layer??a})),...e.rides.map(l=>({t:"ride",x:l,z:l.layer??a+1}))].sort((l,d)=>l.z-d.z);return g`
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
          ${e.columns.map(l=>g`<div class="col-head ${l.kind}" style="left:${l.x}px;width:${l.w}px;--c:${l.dot};--rgb:${l.rgb}">
              <span class="avatar ${l.kind}" aria-hidden="true">${Me(l.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${l.name}</span>${l.kind==="kid"?this.renderLunchChip(l.id,!0):T}</span>
                <span class="sub ${l.subWarn?"warn":""}">${l.sub}</span>
              </span>
            </div>`)}
        </div>
        <div class="pinned" aria-hidden="true" style="width:${r}px">
          <span class="label">${o?.label??""}</span><span class="tag" ?hidden=${!o?.tag}>${o?.tag??""}</span
          ><span class="sub ${o?.warn?"warn":""}">${o?.sub??""}</span>
        </div>
        <div class="canvas" style="width:${r}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(l=>g`<div
                class="col-bg ${l.kind}"
                style="left:${l.x}px;width:${l.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${l.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(l=>g`<div class="day-head" style="top:${l.y}px;width:${r}px">
              <span class="label">${l.label}</span>${l.tag?g`<span class="tag">${l.tag}</span>`:T}<span
                class="sub ${l.warn?"warn":""}"
                >${l.sub}</span
              >
            </div>`)}
          ${e.allDay.map(l=>g`<div class="allday" style="top:${l.y}px;left:${Ge}px;width:${r-Ge}px;height:${l.h}px">
              ${l.chips.map(d=>g`<span
                    class="ad-chip ${d.warn?"warn":""} ${d.cancelled?"skipped":""} ${d.color?"":"plain"}"
                    style=${d.color?`--c:${d.color.color};--rgb:${d.color.rgb};--ink:${d.color.ink}`:""}
                    ><span class="ad-title">${d.title}</span>${d.note?g`<span class="ad-note">${d.note}</span>`:T}</span
                  >`)}
            </div>`)}
          ${e.empties.map(l=>g`<span class="empty" style="top:${l.y}px">${l.text}</span>`)}
          ${e.grid.map(l=>g`<div class="grid ${l.strong?"strong":""}" style="top:${l.y}px;width:${r-60}px"></div>`)}
          ${e.hours.map(l=>g`<span class="hour" style="top:${l.y}px">${l.label}</span>`)}
          ${Re(e.bands,l=>l.key,l=>g`<div
                class="band"
                aria-hidden="true"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;background:rgba(${l.color.rgb},0.10);border-color:rgba(${l.color.rgb},0.45)"
              ></div>`)}
          ${Re(e.busy,l=>l.key,l=>g`<div class="busy" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span style="top:${l.labelY}px">${l.label}</span>
              </div>`)}
          ${Re(e.windows,l=>l.key,l=>g`<div class="window" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span>${l.label}</span>
              </div>`)}
          ${Re(c,l=>l.x.key,l=>{if(l.t==="link"){let b=l.x;return g`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-color:${b.color.color};background:linear-gradient(rgba(${b.color.rgb},0.11), rgba(${b.color.rgb},0.11)), var(--surface)"
                ></div>`}if(l.t==="prep"){let b=l.x;return g`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-color:${b.color.color};background:linear-gradient(rgba(${b.color.rgb},0.11), rgba(${b.color.rgb},0.11)), var(--surface);color:${b.color.ink}"
                >
                  ${b.label}
                </div>`}if(l.t==="ride"){let b=l.x;return g`<button
                  type="button"
                  class="ride ${b.dashed?"dashed":""} ${b.clash?"clash":""}"
                  aria-label=${b.aria}
                  style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;padding-top:${3+(b.tuckTop??0)}px;padding-bottom:${3+(b.tuckBottom??0)}px"
                  @click=${()=>this.open(b.target)}
                >
                  <span class="l1">${b.l1}</span>${b.show2?g`<span class="l2" style="-webkit-line-clamp:${b.lines2}">${b.l2}</span>`:T}
                </button>`}let d=l.x,u=d.color,h=d.skipped?`repeating-linear-gradient(135deg, rgba(${u.rgb},0.10) 0px, rgba(${u.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:d.stayed?`repeating-linear-gradient(135deg, rgba(${u.rgb},0.24) 0px, rgba(${u.rgb},0.24) 6px, rgba(${u.rgb},0.08) 6px, rgba(${u.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${u.rgb},0.15), rgba(${u.rgb},0.15)), var(--surface)`;return g`<button
                type="button"
                class="card ${d.wrap?"wrap":""} ${i(d.target)?"sel":""} ${d.clash?"clash":""} ${d.skipped?"skipped":""}"
                aria-label=${d.aria}
                style="left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;background:${h};border-color:${d.clash?"var(--bad)":`rgba(${u.rgb},0.45)`};--c:${u.color};--rgb:${u.rgb};--ring:${u.color}"
                @click=${()=>this.open(d.target)}
              >
                <span class="top">
                  <span class="title">${d.title}</span>
                  <span class="time">${d.time}</span>
                  ${d.showDrop&&d.drop?g`<span class="line tone-${d.drop.tone}">${d.drop.text}</span>`:T}
                </span>
                ${d.showPick&&d.pick?g`<span class="line tone-${d.pick.tone}">${d.pick.text}</span>`:T}
              </button>`})}
          ${Re(e.stays,l=>l.key,l=>g`<button
                type="button"
                class="stay"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;border-color:${l.color.color};background:repeating-linear-gradient(135deg, rgba(${l.color.rgb},0.28) 0px, rgba(${l.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1" style="color:${l.color.ink}">${l.l1}</span><span class="l2">${l.l2}</span>
              </button>`)}
          ${Re(e.trips,l=>l.key,l=>g`<button
                type="button"
                class="trip ${l.bad?"bad":""} ${l.stops?"list":""}"
                aria-label=${l.aria}
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1">${l.l1}${l.kids.map(d=>g`<span class="kid-dot" style="background:${d}"></span>`)}</span>
                ${l.show2?g`<span class="l2">${l.l2}</span>`:T}
                ${l.stops?l.stops.map(d=>g`<span class="stop ${d.warn?"warn":""}">${d.text}</span>`):T}
                ${l.show3?g`<span class="l3">${l.l3}</span>`:T}
              </button>`)}
          ${Re(e.overlaps,l=>l.key,l=>g`<div class="overlap" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"></div>`)}
          ${Re(e.marks,l=>l.key,l=>g`<span class="mark" style="left:${l.x}px;top:${l.y}px;${l.right?"transform:translateX(-100%)":""}">${l.text}</span>`)}
          ${e.now?g`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${r-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:T}
        </div>
      </div>
    `}renderAttention(e,n){let{items:i,problems:o,later:r}=e,a=this.plan,c=o+n.length,l=this.chores,d=!!l&&!es(l);return g`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?T:g`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${d?g`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?g`<div class="attn-chores">${n.map(u=>this.renderChoreRow(u,!0))}</div>`:g`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:g`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!o?g`<div class="all-clear">
            <span class="check" aria-hidden="true">${de`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${$n(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:T}
      ${i.map(u=>g`<div class="issue ${u.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${u.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${u.target?g`<button type="button" class="issue-title" @click=${()=>this.open(u.target,!0)}>${u.title}</button>`:g`<strong class="issue-title">${u.title}</strong>`}
              <span class="issue-body"
                >${u.parts?u.parts.map(h=>typeof h=="string"?h:g`<button type="button" class="issue-link" @click=${()=>this.open(h.target,!0)}>${h.text}</button>`):u.body}</span
              >
            </div>
          </div>
          ${u.suggestions.length?g`<div class="fixes">
                ${u.suggestions.map(h=>g`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(h.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${h.id}`?"Saving…":h.label}</span>
                    <span class="fix-note">${h.note}</span>
                  </button>`)}
              </div>`:T}
        </div>`)}
      ${this.wide&&a&&!$n(a)&&this.page==="rides"?this.renderLegend():T}
    `}kidColorOf(e){let n=this.plan?ye(this.plan).get(e):void 0;if(n)return n;let i=this.lunch?.kids.findIndex(o=>o.id===e)??-1;return ue(Math.max(0,i))}renderLunchChip(e,n=!1){let i=this.lunch,o=i?.kids.find(l=>l.id===e);if(!i||!o)return T;this.tick;let r=this.today(),a=ri(o,r.date,r.minutes,this.lunchDraft);if(!a)return T;let c=Pt[a.lunch];return g`<span class="lunch-chip ${a.lunch} ${n?"small":""}" title=${`${c} lunch ${a.when}${a.menu?`: ${a.menu}`:""}`}
      >${a.lunch==="bring"?Ki:Wi}<span class="lunch-chip-text"
        >${c}${n?T:` ${a.when}`}${!n&&a.menu?g`<span class="lunch-chip-menu"> · ${a.menu}</span>`:T}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return g`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return g`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=ni(e),i=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:Ae(e.today),o=n.indexOf(i),r=d=>{let u=n[o+d];u&&(this.lunchMonth=u)},a=e.kids.some(d=>d.id===this.lunchKid)?this.lunchKid:null,c=a?e.kids.filter(d=>d.id===a):e.kids,l=e.status&&!e.status.ok?g`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:T;return g`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${o<=0} @click=${()=>r(-1)}>
            ${de`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${pn(i)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${o<0||o>=n.length-1} @click=${()=>r(1)}>
            ${de`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":g`${Hi} Edit menus`}
        </button>
      </div>
      ${l}
      <div class="chore-cols lunch-cols ${a?"wide":""}" style="--n:${c.length}">
        ${c.map(d=>this.renderLunchCard(e,d,i,a!==null))}
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
    </div>`}renderLunchCard(e,n,i,o){let r=this.kidColorOf(n.id),a=si(e,n,i,this.lunchDraft),c=ii(a),l=a.flat(),d=l.filter(x=>!x.outside&&!x.past&&x.lunch),u=n.days_off.filter(x=>Ae(x.first)<=i&&i<=Ae(x.last)),h=x=>d.filter(w=>hn(w.date)===x),b=x=>{let w=h(x);if(!w.length)return;let A=w.every(p=>p.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,w.map(p=>p.date),A)},C=d.length?`${c.bring} Bring · ${c.buy} Buy${i===Ae(e.today)?" left this month":""}`:"No school days left this month";return g`<section class="chore-col lunch-card ${o?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Me(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${C}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Pt[n.default]} unless picked</span>
          ${e.kids.length<2?T:g`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${o?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=o?null:n.id}
              >
                ${o?Zl:Xl}${o?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?g`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:T}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${pn(i)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((x,w)=>g`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!h(w).length}
            aria-label=${`${h(w).every(A=>A.lunch==="bring")?"Buy":"Bring"} every ${x} left in ${pn(i)} for ${n.name}`}
            @click=${()=>b(w)}
          >
            ${x}
          </button>`)}
        ${l.map(x=>this.renderLunchCell(n,x,o))}
      </div>
      ${u.length?g`<p class="lunch-offs">
            No school:
            ${u.map(x=>{let w=x.first<`${i}-01`?`${i}-01`:x.first,A=Ae(x.last)>i?rt(`${ls(i)}-01`,-1):x.last;return`${w===A?Ss(w):`${Ss(w)}–${Ss(A)}`} ${oi(x.title)}`}).join(" · ")}
          </p>`:T}
    </section>`}renderLunchCell(e,n,i=!1){if(n.outside)return g`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return g`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let o=n.lunch,r=o==="buy"?"bring":"buy",a=n.menu?`, ${n.menu}`:"",c=this.menuMode,l=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),d=c?`${e.name}, ${Ee(n.date)}${a||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${Ee(n.date)}: ${Pt[o]}${n.picked?"":" (not picked yet)"}${a}. Tap to ${Pt[r]}.`;return g`<button
      type="button"
      class="lunch-day ${o} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${c?"editing":""} ${l?"sel":""}"
      ?disabled=${n.past&&!c}
      aria-label=${d}
      @click=${()=>c?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${o==="bring"?Ki:Wi}${Pt[o]}</span>
      ${n.menu?g`<span class="lunch-menu">${n.menu}</span>${i&&n.sides?g`<span class="lunch-sides">${n.sides}</span>`:T}`:c?g`<span class="lunch-menu add">${kn} Menu</span>`:T}
    </button>`}renderChoreRow(e,n=!1){let i=this.chores,o=this.choreDone(e),r=i.kids.findIndex(A=>A.id===e.kid),a=(this.plan?ye(this.plan).get(e.kid):void 0)??ue(Math.max(0,r)),c=i.kids[r]?.name??"",l=o===it(e)?e:{...e,state:o?"done":"open",done_at:o?new Date().toISOString():null},d=o&&l.done_by&&l.done_by!==e.kid?i.people?.find(A=>A.id===l.done_by)?.name??l.done_by_name??null:null,u=`${Qn(l,i.today,i.time_zone)}${d?` · by ${d}`:""}`,h=o||Go(e),b=`${n?`${c}: `:""}${e.title}. ${u?`${u}. `:""}${o?"Done. Tap to undo.":"Tap when it’s done."}`,C=g`<span class="box" aria-hidden="true"
        >${o?de`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:T}</span
      >
      ${e.icon?g`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:T}
      <span class="chore-text">
        <span class="chore-title">${n?g`<span class="chore-kid">${c}</span> · `:T}${e.title}</span>
        ${u?g`<span class="chore-note">${u}</span>`:T}
      </span>`,x=`chore ${o?"done":""} ${e.state==="overdue"&&!o?"overdue":""} ${h?"":"later"}`,w=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return h?g`<button type="button" class=${x} style=${w} aria-pressed=${o?"true":"false"} aria-label=${b} @click=${()=>this.tapChore(e)}>
          ${C}
        </button>`:g`<div class=${x} style=${w}>${C}</div>`}renderChores(){let e=this.chores;if(e===void 0)return g`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return g`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return g`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return g`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(es(e))return g`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${kn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),i=n.length?g`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:T;this.tick;let o=Yo(e,this.plan?ye(this.plan):void 0,this.today().minutes);return g`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${kn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${Hi} Manage chores</button>
      </div>
      ${i}
      <div class="chore-cols" style="--n:${o.length}">
        ${o.map(r=>{let a=r.overdue.filter(c=>!this.choreDone(c)).length+r.now.filter(c=>!this.choreDone(c)).length;return g`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Me(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${a?`${a} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?g`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(c=>this.renderChoreRow(c))}`:T}
            ${r.now.length?g`<h3 class="chore-group">To do</h3>
                  ${r.now.map(c=>this.renderChoreRow(c))}`:T}
            ${r.done.length?g`<h3 class="chore-group">Done</h3>
                  ${r.done.map(c=>this.renderChoreRow(c))}`:T}
            ${r.later.map(c=>g`<h3 class="chore-group">${c.date===e.today?"Later today":ec(c.date,e.today)}</h3>
                ${c.chores.map(l=>this.renderChoreRow(l))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?g`<p class="chore-none">No chores this week.</p>`:T}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let i=this.chores.kids,o=this.plan?ye(this.plan):void 0,r=this.choreEdit?.template===e.id,a=e.problems.length?g`<span class="tmpl-note bad">${e.problems.map(as).join(" · ")} · tap to set up</span>`:g`<span class="tmpl-note">${rs(e.who,i,e.take_turns)} · ${is(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return g`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?g` <span class="tag-paused">Paused</span>`:T}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let l=i.findIndex(u=>u.id===c),d=o?.get(c)??ue(Math.max(0,l));return g`<span class="kid-dot" style="background:${d.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return g`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${kn} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([i,o])=>{let r=e.templates.filter(a=>a.repeats===i);return r.length?g`<section class="manage-group" aria-label=${o}>
                  <h3 class="chore-group">${o}</h3>
                  <div class="tmpl-list">${r.map(a=>this.renderTemplateRow(a))}</div>
                </section>`:T}):g`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return g``;let i=n.kids,o=this.plan?ye(this.plan):void 0,r=this.choreBusy,a=e.template?n.templates.find(x=>x.id===e.template):void 0,c=ss(e),l=(a?.problems??[]).filter(x=>x!=="who:"),d=(x,w,A,p=!1)=>g`<button type="button" class="choice ${p?"wide":""}" aria-pressed=${x?"true":"false"} ?disabled=${r} @click=${A}>${w}</button>`,u=(x,w,A,p)=>g`<button type="button" class="chip" aria-pressed=${x?"true":"false"} aria-label=${p??T} ?disabled=${r} @click=${A}>${w}</button>`,h=x=>{x!==e.repeats&&this.changeDraft({repeats:x,days:a&&a.repeats===x?a.days??dn(x):dn(x)})},b=x=>{let w=e.who.includes(x)?e.who.filter(A=>A!==x):i.filter(A=>A.id===x||e.who.includes(A.id)).map(A=>A.id);this.changeDraft({who:w})},C;if(e.repeats==="school"){let x=e.days===Je?new Set:e.days===""?new Set([0,1,2,3,4]):ts(e.days)??new Set,w=A=>{let p=new Set(x);p.has(A)?p.delete(A):p.add(A),this.changeDraft({days:p.size===5?"":p.size?ns(p):Je})};C=g`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${Ye.slice(0,5).map((A,p)=>u(x.has(p),A.slice(0,2),()=>w(p),A))}
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
        </div>`}else if(e.repeats==="monthly"){let x=e.days.trim(),w=/^\d+$/.test(x)?Number(x):null,A=x&&x.toLowerCase()!=="any"&&x.toLowerCase()!=="last"&&w===null;C=g`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${A?4:3}, minmax(0, 1fr))">
          ${d(x===""||x.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${d(w!==null,"On a date",()=>this.changeDraft({days:String(w??1)}))}
          ${d(x.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${A?d(!0,x,()=>{}):T}
        </div>
        ${w!==null?g`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||w<=1} @click=${()=>this.changeDraft({days:String(w-1)})}>−</button>
                <span class="arrive-value">${os(w)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||w>=31} @click=${()=>this.changeDraft({days:String(w+1)})}>+</button>
              </span>
            </div>`:g`<p class="field-hint">${x.toLowerCase()==="last"?"Due on the month’s last day.":A?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")C=g`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let x=e.days===""||e.days.toLowerCase()==="any",w=e.days===Je?new Set:x?new Set:ts(e.days)??new Set,A=p=>{let L=new Set(w);L.has(p)?L.delete(p):L.add(p),this.changeDraft({days:L.size?ns(L)||"Mon-Sun":Je})};C=g`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${d(x,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${d(!x,"On set days",()=>this.changeDraft({days:x?"Sat":e.days}))}
        </div>
        ${x?g`<p class="field-hint">Shows all week, due on Sunday.</p>`:g`<div role="group" aria-label="Days of the week" class="day-chips">
                ${Ye.map((p,L)=>u(w.has(L),p.slice(0,2),()=>A(L),p))}
              </div>
              <div class="chips">
                ${u(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${u(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return g`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?g`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:T}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?rs(e.who,i,e.take_turns):"Nobody yet"} · ${e.days===Je?"No days picked":is(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${l.length?g`<p class="field-hint bad">${l.map(as).join(". ")}. Saving fixes it.</p>`:T}
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
          @input=${x=>this.changeDraft({title:x.target.value})}
        />
        <div role="group" aria-label="Picture" class="icon-chips">
          ${Fi.map(x=>u(e.icon===x,x,()=>this.changeDraft({icon:e.icon===x?null:x}),`Picture ${x}`))}
          ${e.icon&&!Fi.includes(e.icon)?u(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):T}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?g`<emoji-picker
              class="emoji-more"
              .dataSource=${Jl}
              @emoji-click=${x=>{let w=x.detail.unicode;w&&this.changeDraft({icon:w}),this.iconMore=!1}}
            ></emoji-picker>`:T}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${i.map((x,w)=>{let A=o?.get(x.id)??ue(w),p=e.who.includes(x.id);return g`<button type="button" class="who-chip" style="--c:${A.color};--rgb:${A.rgb}" aria-pressed=${p?"true":"false"} ?disabled=${r} @click=${()=>b(x.id)}>
              <span class="avatar" aria-hidden="true">${Me(x.name)}</span>${x.name}
            </button>`})}
        </div>
        ${e.who.length>1?g`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${d(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${d(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:T}
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
      ${C}
      ${e.repeats==="school"?T:g`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${Ql(e.repeats,e.every)}</span>
      </div>`}
      <div class="field">
        <label class="field-label" for="chore-details">Notes <span class="field-hint">Optional, shown with the chore</span></label>
        <textarea
          id="chore-details"
          class="text-input"
          rows="2"
          .value=${e.details}
          ?disabled=${r}
          @input=${x=>this.changeDraft({details:x.target.value})}
        ></textarea>
      </div>
      ${e.template?g`<div class="field">
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
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return g``;let i=e.busy,o=d=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...d})},r=d=>o({kids:e.kids.includes(d)?e.kids.filter(u=>u!==d):[...e.kids,d]}),a=n.kids.filter(d=>Ct(d,e.date)),c=e.dish.trim(),l=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return g`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${Ee(e.date)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${i} @click=${()=>this.menuEdit=null}>Cancel</button>
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
          ?disabled=${i}
          @input=${d=>o({dish:d.target.value})}
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
          ?disabled=${i}
          @input=${d=>o({details:d.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${a.map(d=>{let u=this.kidColorOf(d.id),h=e.kids.includes(d.id);return g`<button type="button" class="who-chip" style="--c:${u.color};--rgb:${u.rgb}" aria-pressed=${h?"true":"false"} ?disabled=${i} @click=${()=>r(d.id)}>
              <span class="avatar" aria-hidden="true">${Me(d.name)}</span>${d.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${c||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?g`<button type="button" class="chip clear remove" ?disabled=${i||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:T}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${i||!!l} @click=${()=>void this.saveMenu()}>
          ${i?"Saving to Google Calendar…":l??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return g``;let i=n.people?.length?n.people:n.kids.map(u=>({...u,role:"kid"})),o=n.kids.findIndex(u=>u.id===e.kid),r=n.kids[o],a=this.plan?ye(this.plan):void 0,c=a?.get(e.kid)??ue(Math.max(0,o)),l=i.filter(u=>u.id!==e.kid),d=u=>{let h=n.kids.findIndex(b=>b.id===u.id);return h>=0?(a?.get(u.id)??ue(h)).color:"var(--dark)"};return g`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?g`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:T}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${Qn(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${c.color};--rgb:${c.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${Me(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?g`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${l.map(u=>g`<button type="button" class="done-by" style="--c:${d(u)}" @click=${()=>void this.toggleChore(e,u.id)}>
                  <span class="avatar ${u.role==="parent"?"driver":""}" aria-hidden="true">${Me(u.name)}</span>
                  <span>${u.name}</span>
                </button>`)}
            </div>`:g`<button type="button" class="choice wide" @click=${()=>this.whoOthers=!0}>Someone else did</button>`}
      </div>
    `}renderLegend(){return g`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}ownHint(e,n){let i=ln(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${N(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${N(n.start)} to ${N(n.end)}. ${r}, around ${i}’s other trips. Errands go alone.`}let o=n.along.map(r=>ke(e).includes(r)?be(e,r):me(e,r));return`${i} drives there and back${o.length?`, with ${cn(o)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return g``;let{day:i,event:o}=n,r=ke(e),a=Oo(e,o),c=ln(e,o),l=!!this.pending,d=D=>this.pending?.key===D?this.pending.value:void 0,u=[...e.people?.carpools??[]];for(let D of e.days)for(let V of D.events)for(let J of[V.drop,V.pick])J&&J!=="none"&&!r.includes(J)&&!u.some(ie=>ie.toLowerCase()===J.toLowerCase())&&u.push(J);let h=D=>{if(!o.sides.includes(D))return T;let V=d(D),J=V!==void 0?String(V):D==="drop"?o.drop:o.pick,ie=J&&J!=="none"&&!r.includes(J)?J:"",xe=m=>this.setRide(o,D,J===m?"":m),oe=[...r.map(m=>[m,Vn(e,m)]),["none","Not needed"]];return g`<div class="field">
        <span class="field-label">${D==="drop"?"Drop-off":"Pick-up"} ${J===""?g`<span class="nobody">· nobody yet</span>`:T}</span>
        <div role="group" aria-label=${D==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${oe.length}, minmax(0, 1fr))">
          ${oe.map(([m,R])=>g`<button type="button" class="choice" aria-pressed=${J===m?"true":"false"} ?disabled=${l} @click=${()=>xe(m)}>
                ${R}
              </button>`)}
        </div>
        ${u.length?g`<div role="group" aria-label=${D==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${u.map(m=>g`<button type="button" class="chip" aria-pressed=${J.toLowerCase()===m.toLowerCase()?"true":"false"} ?disabled=${l} @click=${()=>xe(m)}>
                    ${m}
                  </button>`)}
            </div>`:T}
        <input
          type="text"
          .value=${ie&&!u.some(m=>m.toLowerCase()===ie.toLowerCase())?ie:""}
          ?disabled=${l}
          aria-label=${D==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${m=>{let R=m.target.value.trim();R&&R!==J&&this.setRide(o,D,R)}}
          @keydown=${m=>{m.key==="Enter"&&m.target.blur()}}
        />
        ${!x&&J!==""&&J!=="none"?b(D,J):T}
      </div>`},b=(D,V)=>{let J=d(`along-${D}`),ie=J!==void 0?J:D==="pick"?o.pick_along??[]:o.along,xe=[...Ce(e).filter(m=>m!==o.kid),...r.filter(m=>m!==V)];return xe.length?g`<div class="field-sub">
        <span class="field-label">${D==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${D==="pick"?"They come for the pick-up":"They leave home in the same car"}</span></span>
        <div role="group" aria-label=${D==="drop"?"Riding along on the drop-off":D==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${xe.map(m=>g`<button type="button" class="chip" aria-pressed=${ie.includes(m)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(o,m,D)}>
              ${r.includes(m)?be(e,m):me(e,m)}
            </button>`)}
        </div>
      </div>`:T},C=d("stay"),x=C!==void 0?!!C:o.stay,w=o.drop===o.pick&&r.includes(o.drop),A=d("along"),p=A!==void 0?A:o.along,L=o.own?[...Ce(e),...r.filter(D=>D!==o.own)]:[],H=o.own!=null&&o.takes!=null,Z=o.own!=null&&!H,ce=d("takes"),v=ce!==void 0?ce:o.takes??null,k=d("arrive"),y=this.arriveDraft!==void 0?this.arriveDraft:k!==void 0?k:o.arrive_by,$=[],E=D=>D==="none"?"Not needed":Vn(e,D),M=D=>r.includes(D)?be(e,D):me(e,D),I=(D,V,J)=>{V===""&&!J.length||$.push(`${D}: ${[V===""?"TBD":E(V),...J.map(M)].join(", ")}`)};o.own||I("Drop-off",o.drop,o.along),o.own||I("Pick-up",o.pick,o.pick_along??[]),!o.own&&o.stay&&$.push("Stay: yes"),H&&$.push(`Takes: ${o.takes} min`),o.own&&o.along.length&&$.push(`Take along: ${o.along.map(M).join(", ")}`),o.arrive_by!=null&&$.push(`Arrive by: ${gt(o.arrive_by)}`);let K=d("attending"),Y=K!==void 0?!!K:o.attending!==!1;o.attending===!1&&$.splice(0,$.length,"Attending: no");let Q=i.date===this.today().date?"":`${ge(i.date)} · `,j=g`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${c} · ${o.title}</span>
          <span class="ed-meta">${Q}${H?"any time ":""}${N(o.start)}–${N(o.end)}${o.place_name&&!o.place.startsWith("?")?` · ${o.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return o.where==="home"?g`${j}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:g`
      ${j}
      ${this.pending?g`<p class="saving" role="status">Saving to Google Calendar…</p>`:T}
      ${o.recurring?g`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${ge(i.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:T}
      <div class="field">
        <span class="field-label">${c} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${Y?"true":"false"} ?disabled=${l} @click=${()=>this.setAttending(o,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${Y?"false":"true"} ?disabled=${l} @click=${()=>this.setAttending(o,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${Y?g`${o.where==="anywhere"?g`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:T}
            ${o.own?g`<p class="field-hint">${this.ownHint(e,o)}</p>`:g`${h("drop")} ${h("pick")}
                  <div class="field">
                    <button type="button" class="choice wide" aria-pressed=${x?"true":"false"} ?disabled=${!w||l} @click=${()=>this.toggleStay(o)}>
                      ${w?x?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
                    </button>
                    ${x&&w?b("both",o.drop):T}
                  </div>`}
      ${o.own?g`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${v!=null?`Takes ${v} min, any time ${N(o.start)}–${N(o.end)}`:"At its set time"}</span>
            </span>
            ${v!=null?g`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${l||v<=5} @click=${()=>this.setTakes(o,Math.max(5,v-5))}>−</button>
                  <span class="arrive-value">${v} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${l||v+5>o.end-o.start} @click=${()=>this.setTakes(o,v+5)}>+</button>
                </span>`:T}
          </div>
          <button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.setTakes(o,v!=null?null:Math.min(10,Math.max(5,o.end-o.start)))}>
            ${v!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:T}
      ${Z&&L.length?g`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${L.map(D=>g`<button type="button" class="chip" aria-pressed=${p.includes(D)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(o,D)}>
                  ${r.includes(D)?be(e,D):me(e,D)}
                </button>`)}
            </div>
          </div>`:T}
      ${H?T:g`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${y!=null?`${o.start-y} min before it starts`:`Aims for a few minutes before ${N(o.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${l} @click=${()=>this.nudgeArrive(o,-5)}>−</button>
          <span class="arrive-value">${y!=null?N(y):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${l||y==null} @click=${()=>this.nudgeArrive(o,5)}>+</button>
        </span>
      </div>
      ${y!=null?g`<button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:T}`}
`:g`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${$.length?$.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${o.problems.length?g`<p class="field-hint bad">These lines in the notes couldn’t be read: ${o.problems.join("; ")}</p>`:T}
      ${Y&&!o.own?g`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:T}
    `}};Dt.styles=ai,Dt.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Dt);function oc(){let s=[document];for(let t of document.querySelectorAll("*"))t.shadowRoot&&s.push(t.shadowRoot);return s}function Vi(s=3e3){let t=new CSSStyleSheet;t.replaceSync("*, *::before, *::after { cursor: none !important; }"),t.disabled=!0;let e,n=o=>{if(o)for(let r of oc())r.adoptedStyleSheets.includes(t)||(r.adoptedStyleSheets=[...r.adoptedStyleSheets,t]);t.disabled=!o},i=o=>{if(clearTimeout(e),o.pointerType==="touch"){n(!0);return}n(!1),e=setTimeout(()=>n(!0),s)};window.addEventListener("pointermove",i,{passive:!0}),window.addEventListener("pointerdown",i,{passive:!0}),e=setTimeout(()=>n(!0),s)}var Gi=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],Yi=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function Ji(s,t,e,n){let i=Math.max(0,Math.min(t,s.length)),o=Math.max(i,Math.min(e,s.length));return{value:s.slice(0,i)+n+s.slice(o),caret:i+n.length}}function Xi(s,t,e){let n=Math.max(0,Math.min(t,s.length)),i=Math.max(n,Math.min(e,s.length));if(n!==i)return{value:s.slice(0,n)+s.slice(i),caret:n};if(n===0)return{value:s,caret:0};let o=Array.from(s.slice(0,n));o.pop();let r=o.join("");return{value:r+s.slice(n),caret:r.length}}function Zi(s,t){return t===0||/\s$/.test(s.slice(0,t))}var ic=new Set(["text","search","email","url","tel","number","password"]);function Qi(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&ic.has(s.type)&&!s.readOnly&&!s.disabled}var rc={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},ac={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},Lt=class extends we{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=n=>n.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let n=e.selectionStart,i=e.selectionEnd;if(n!==null&&i!==null)return[n,i]}catch{}return[e.value.length,e.value.length]}apply(e,n,i){e.value=n;try{e.setSelectionRange(i,i)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=Zi(this.field.value,e)}press(e){let n=this.field;if(n){switch(e){case"hide":n.blur();return;case"done":this.commit(),n.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),n.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[i,o]=this.selection(n),r=Xi(n.value,i,o);this.apply(n,r.value,r.caret);break}default:{let i=e==="space"?" ":this.shift?e.toUpperCase():e,[o,r]=this.selection(n),a=Ji(n.value,o,r,i);this.apply(n,a.value,a.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let n=e.length>1,i=e==="layout"?this.layout==="letters"?"123":"ABC":rc[e]??(this.shift?e.toUpperCase():e);return g`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":n?"wide":""}
      aria-label=${ac[e]??i}
      aria-pressed=${e==="shift"?String(this.shift):T}
      @click=${()=>this.press(e)}
    >
      ${i}
    </button>`}render(){let e=this.layout==="letters"?Gi:Yi;return g`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(n=>g`<div class="row">${n.map(i=>this.key(i))}</div>`)}
      </div>`}};Lt.styles=Ue`
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
  `,Lt.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",Lt);function lc(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function er(s){let t=new WeakSet,e=r=>{let a=r.composedPath();o(a);let c=a[0];Qi(c)&&s.attach(c)},n=()=>{setTimeout(()=>{let r=lc();!s.target||r===s.target||(Qi(r)?s.attach(r):s.detach())},0)},i=r=>{t.has(r)||(t.add(r),r.addEventListener("focusin",e),r.addEventListener("focusout",n))},o=r=>{for(let a of r)a instanceof ShadowRoot&&i(a)};i(document),document.addEventListener("pointerdown",r=>o(r.composedPath()),{capture:!0}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var Ms="mydashlight",cc=`/api/${Ms}/pair`,dc=`/api/${Ms}/pair/poll`,Ps=`/${Ms}`,Ds="pair";function tr(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function nr(s,t){return`${s}${Ps}?${Ds}=${encodeURIComponent(t)}`}function uc(s,t,e=Date.now()){return{hassUrl:s,clientId:t.client_id,access_token:t.access_token,refresh_token:t.refresh_token,expires_in:t.expires_in,expires:e+t.expires_in*1e3}}var tt=class extends Error{constructor(t,e=!1){super(t),this.busy=e}};async function sr(s=fetch){let t=await s(cc,{method:"POST",cache:"no-store"});if(t.status===429)throw new tt("Too many screens are asking to pair right now.",!0);if(!t.ok)throw new tt(`Home Assistant answered ${t.status}.`);return await t.json()}async function or(s,t,e=fetch){let n=await e(dc,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(n.status===404)return{status:"expired"};if(!n.ok)throw new tt(`Home Assistant answered ${n.status}.`);let i=await n.json();return i.status==="paired"&&i.auth?{status:"paired",auth:uc(t,i.auth)}:{status:"pending"}}var ht=function(s,t){let i=s,o=Rt[t],r=null,a=0,c=null,l=[],d={},u=function(v,k){a=i*4+17,r=(function(y){let $=new Array(y);for(let E=0;E<y;E+=1){$[E]=new Array(y);for(let M=0;M<y;M+=1)$[E][M]=null}return $})(a),h(0,0),h(a-7,0),h(0,a-7),x(),C(),A(v,k),i>=7&&w(v),c==null&&(c=H(i,o,l)),p(c,k)},h=function(v,k){for(let y=-1;y<=7;y+=1)if(!(v+y<=-1||a<=v+y))for(let $=-1;$<=7;$+=1)k+$<=-1||a<=k+$||(0<=y&&y<=6&&($==0||$==6)||0<=$&&$<=6&&(y==0||y==6)||2<=y&&y<=4&&2<=$&&$<=4?r[v+y][k+$]=!0:r[v+y][k+$]=!1)},b=function(){let v=0,k=0;for(let y=0;y<8;y+=1){u(!0,y);let $=je.getLostPoint(d);(y==0||v>$)&&(v=$,k=y)}return k},C=function(){for(let v=8;v<a-8;v+=1)r[v][6]==null&&(r[v][6]=v%2==0);for(let v=8;v<a-8;v+=1)r[6][v]==null&&(r[6][v]=v%2==0)},x=function(){let v=je.getPatternPosition(i);for(let k=0;k<v.length;k+=1)for(let y=0;y<v.length;y+=1){let $=v[k],E=v[y];if(r[$][E]==null)for(let M=-2;M<=2;M+=1)for(let I=-2;I<=2;I+=1)M==-2||M==2||I==-2||I==2||M==0&&I==0?r[$+M][E+I]=!0:r[$+M][E+I]=!1}},w=function(v){let k=je.getBCHTypeNumber(i);for(let y=0;y<18;y+=1){let $=!v&&(k>>y&1)==1;r[Math.floor(y/3)][y%3+a-8-3]=$}for(let y=0;y<18;y+=1){let $=!v&&(k>>y&1)==1;r[y%3+a-8-3][Math.floor(y/3)]=$}},A=function(v,k){let y=o<<3|k,$=je.getBCHTypeInfo(y);for(let E=0;E<15;E+=1){let M=!v&&($>>E&1)==1;E<6?r[E][8]=M:E<8?r[E+1][8]=M:r[a-15+E][8]=M}for(let E=0;E<15;E+=1){let M=!v&&($>>E&1)==1;E<8?r[8][a-E-1]=M:E<9?r[8][15-E-1+1]=M:r[8][15-E-1]=M}r[a-8][8]=!v},p=function(v,k){let y=-1,$=a-1,E=7,M=0,I=je.getMaskFunction(k);for(let K=a-1;K>0;K-=2)for(K==6&&(K-=1);;){for(let Y=0;Y<2;Y+=1)if(r[$][K-Y]==null){let Q=!1;M<v.length&&(Q=(v[M]>>>E&1)==1),I($,K-Y)&&(Q=!Q),r[$][K-Y]=Q,E-=1,E==-1&&(M+=1,E=7)}if($+=y,$<0||a<=$){$-=y,y=-y;break}}},L=function(v,k){let y=0,$=0,E=0,M=new Array(k.length),I=new Array(k.length);for(let j=0;j<k.length;j+=1){let D=k[j].dataCount,V=k[j].totalCount-D;$=Math.max($,D),E=Math.max(E,V),M[j]=new Array(D);for(let oe=0;oe<M[j].length;oe+=1)M[j][oe]=255&v.getBuffer()[oe+y];y+=D;let J=je.getErrorCorrectPolynomial(V),xe=It(M[j],J.getLength()-1).mod(J);I[j]=new Array(J.getLength()-1);for(let oe=0;oe<I[j].length;oe+=1){let m=oe+xe.getLength()-I[j].length;I[j][oe]=m>=0?xe.getAt(m):0}}let K=0;for(let j=0;j<k.length;j+=1)K+=k[j].totalCount;let Y=new Array(K),Q=0;for(let j=0;j<$;j+=1)for(let D=0;D<k.length;D+=1)j<M[D].length&&(Y[Q]=M[D][j],Q+=1);for(let j=0;j<E;j+=1)for(let D=0;D<k.length;D+=1)j<I[D].length&&(Y[Q]=I[D][j],Q+=1);return Y},H=function(v,k,y){let $=ir.getRSBlocks(v,k),E=rr();for(let I=0;I<y.length;I+=1){let K=y[I];E.put(K.getMode(),4),E.put(K.getLength(),je.getLengthInBits(K.getMode(),v)),K.write(E)}let M=0;for(let I=0;I<$.length;I+=1)M+=$[I].dataCount;if(E.getLengthInBits()>M*8)throw"code length overflow. ("+E.getLengthInBits()+">"+M*8+")";for(E.getLengthInBits()+4<=M*8&&E.put(0,4);E.getLengthInBits()%8!=0;)E.putBit(!1);for(;!(E.getLengthInBits()>=M*8||(E.put(236,8),E.getLengthInBits()>=M*8));)E.put(17,8);return L(E,$)};d.addData=function(v,k){k=k||"Byte";let y=null;switch(k){case"Numeric":y=hc(v);break;case"Alphanumeric":y=pc(v);break;case"Byte":y=fc(v);break;case"Kanji":y=gc(v);break;default:throw"mode:"+k}l.push(y),c=null},d.isDark=function(v,k){if(v<0||a<=v||k<0||a<=k)throw v+","+k;return r[v][k]},d.getModuleCount=function(){return a},d.make=function(){if(i<1){let v=1;for(;v<40;v++){let k=ir.getRSBlocks(v,o),y=rr();for(let E=0;E<l.length;E++){let M=l[E];y.put(M.getMode(),4),y.put(M.getLength(),je.getLengthInBits(M.getMode(),v)),M.write(y)}let $=0;for(let E=0;E<k.length;E++)$+=k[E].dataCount;if(y.getLengthInBits()<=$*8)break}i=v}u(!1,b())},d.createTableTag=function(v,k){v=v||2,k=typeof k>"u"?v*4:k;let y="";y+='<table style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: "+k+"px;",y+='">',y+="<tbody>";for(let $=0;$<d.getModuleCount();$+=1){y+="<tr>";for(let E=0;E<d.getModuleCount();E+=1)y+='<td style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: 0px;",y+=" width: "+v+"px;",y+=" height: "+v+"px;",y+=" background-color: ",y+=d.isDark($,E)?"#000000":"#ffffff",y+=";",y+='"/>';y+="</tr>"}return y+="</tbody>",y+="</table>",y},d.createSvgTag=function(v,k,y,$){let E={};typeof arguments[0]=="object"&&(E=arguments[0],v=E.cellSize,k=E.margin,y=E.alt,$=E.title),v=v||2,k=typeof k>"u"?v*4:k,y=typeof y=="string"?{text:y}:y||{},y.text=y.text||null,y.id=y.text?y.id||"qrcode-description":null,$=typeof $=="string"?{text:$}:$||{},$.text=$.text||null,$.id=$.text?$.id||"qrcode-title":null;let M=d.getModuleCount()*v+k*2,I,K,Y,Q,j="",D;for(D="l"+v+",0 0,"+v+" -"+v+",0 0,-"+v+"z ",j+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',j+=E.scalable?"":' width="'+M+'px" height="'+M+'px"',j+=' viewBox="0 0 '+M+" "+M+'" ',j+=' preserveAspectRatio="xMinYMin meet"',j+=$.text||y.text?' role="img" aria-labelledby="'+Z([$.id,y.id].join(" ").trim())+'"':"",j+=">",j+=$.text?'<title id="'+Z($.id)+'">'+Z($.text)+"</title>":"",j+=y.text?'<description id="'+Z(y.id)+'">'+Z(y.text)+"</description>":"",j+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',j+='<path d="',Y=0;Y<d.getModuleCount();Y+=1)for(Q=Y*v+k,I=0;I<d.getModuleCount();I+=1)d.isDark(Y,I)&&(K=I*v+k,j+="M"+K+","+Q+D);return j+='" stroke="transparent" fill="black"/>',j+="</svg>",j},d.createDataURL=function(v,k){v=v||2,k=typeof k>"u"?v*4:k;let y=d.getModuleCount()*v+k*2,$=k,E=y-k;return vc(y,y,function(M,I){if($<=M&&M<E&&$<=I&&I<E){let K=Math.floor((M-$)/v),Y=Math.floor((I-$)/v);return d.isDark(Y,K)?0:1}else return 1})},d.createImgTag=function(v,k,y){v=v||2,k=typeof k>"u"?v*4:k;let $=d.getModuleCount()*v+k*2,E="";return E+="<img",E+=' src="',E+=d.createDataURL(v,k),E+='"',E+=' width="',E+=$,E+='"',E+=' height="',E+=$,E+='"',y&&(E+=' alt="',E+=Z(y),E+='"'),E+="/>",E};let Z=function(v){let k="";for(let y=0;y<v.length;y+=1){let $=v.charAt(y);switch($){case"<":k+="&lt;";break;case">":k+="&gt;";break;case"&":k+="&amp;";break;case'"':k+="&quot;";break;default:k+=$;break}}return k},ce=function(v){v=typeof v>"u"?2:v;let y=d.getModuleCount()*1+v*2,$=v,E=y-v,M,I,K,Y,Q,j={"██":"█","█ ":"▀"," █":"▄","  ":" "},D={"██":"▀","█ ":"▀"," █":" ","  ":" "},V="";for(M=0;M<y;M+=2){for(K=Math.floor((M-$)/1),Y=Math.floor((M+1-$)/1),I=0;I<y;I+=1)Q="█",$<=I&&I<E&&$<=M&&M<E&&d.isDark(K,Math.floor((I-$)/1))&&(Q=" "),$<=I&&I<E&&$<=M+1&&M+1<E&&d.isDark(Y,Math.floor((I-$)/1))?Q+=" ":Q+="█",V+=v<1&&M+1>=E?D[Q]:j[Q];V+=`
`}return y%2&&v>0?V.substring(0,V.length-y-1)+Array(y+1).join("▀"):V.substring(0,V.length-1)};return d.createASCII=function(v,k){if(v=v||1,v<2)return ce(k);v-=1,k=typeof k>"u"?v*2:k;let y=d.getModuleCount()*v+k*2,$=k,E=y-k,M,I,K,Y,Q=Array(v+1).join("██"),j=Array(v+1).join("  "),D="",V="";for(M=0;M<y;M+=1){for(K=Math.floor((M-$)/v),V="",I=0;I<y;I+=1)Y=1,$<=I&&I<E&&$<=M&&M<E&&d.isDark(K,Math.floor((I-$)/v))&&(Y=0),V+=Y?Q:j;for(K=0;K<v;K+=1)D+=V+`
`}return D.substring(0,D.length-1)},d.renderTo2dContext=function(v,k){k=k||2;let y=d.getModuleCount();for(let $=0;$<y;$++)for(let E=0;E<y;E++)v.fillStyle=d.isDark($,E)?"black":"white",v.fillRect(E*k,$*k,k,k)},d};ht.stringToBytes=function(s){let t=[];for(let e=0;e<s.length;e+=1){let n=s.charCodeAt(e);t.push(n&255)}return t};ht.createStringToBytes=function(s,t){let e=(function(){let i=bc(s),o=function(){let c=i.read();if(c==-1)throw"eof";return c},r=0,a={};for(;;){let c=i.read();if(c==-1)break;let l=o(),d=o(),u=o(),h=String.fromCharCode(c<<8|l),b=d<<8|u;a[h]=b,r+=1}if(r!=t)throw r+" != "+t;return a})(),n=63;return function(i){let o=[];for(let r=0;r<i.length;r+=1){let a=i.charCodeAt(r);if(a<128)o.push(a);else{let c=e[i.charAt(r)];typeof c=="number"?(c&255)==c?o.push(c):(o.push(c>>>8),o.push(c&255)):o.push(n)}}return o}};var fe={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},Rt={L:1,M:0,Q:3,H:2},Oe={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},je=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,e=7973,n=21522,i={},o=function(r){let a=0;for(;r!=0;)a+=1,r>>>=1;return a};return i.getBCHTypeInfo=function(r){let a=r<<10;for(;o(a)-o(t)>=0;)a^=t<<o(a)-o(t);return(r<<10|a)^n},i.getBCHTypeNumber=function(r){let a=r<<12;for(;o(a)-o(e)>=0;)a^=e<<o(a)-o(e);return r<<12|a},i.getPatternPosition=function(r){return s[r-1]},i.getMaskFunction=function(r){switch(r){case Oe.PATTERN000:return function(a,c){return(a+c)%2==0};case Oe.PATTERN001:return function(a,c){return a%2==0};case Oe.PATTERN010:return function(a,c){return c%3==0};case Oe.PATTERN011:return function(a,c){return(a+c)%3==0};case Oe.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case Oe.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case Oe.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case Oe.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+r}},i.getErrorCorrectPolynomial=function(r){let a=It([1],0);for(let c=0;c<r;c+=1)a=a.multiply(It([1,Ne.gexp(c)],0));return a},i.getLengthInBits=function(r,a){if(1<=a&&a<10)switch(r){case fe.MODE_NUMBER:return 10;case fe.MODE_ALPHA_NUM:return 9;case fe.MODE_8BIT_BYTE:return 8;case fe.MODE_KANJI:return 8;default:throw"mode:"+r}else if(a<27)switch(r){case fe.MODE_NUMBER:return 12;case fe.MODE_ALPHA_NUM:return 11;case fe.MODE_8BIT_BYTE:return 16;case fe.MODE_KANJI:return 10;default:throw"mode:"+r}else if(a<41)switch(r){case fe.MODE_NUMBER:return 14;case fe.MODE_ALPHA_NUM:return 13;case fe.MODE_8BIT_BYTE:return 16;case fe.MODE_KANJI:return 12;default:throw"mode:"+r}else throw"type:"+a},i.getLostPoint=function(r){let a=r.getModuleCount(),c=0;for(let u=0;u<a;u+=1)for(let h=0;h<a;h+=1){let b=0,C=r.isDark(u,h);for(let x=-1;x<=1;x+=1)if(!(u+x<0||a<=u+x))for(let w=-1;w<=1;w+=1)h+w<0||a<=h+w||x==0&&w==0||C==r.isDark(u+x,h+w)&&(b+=1);b>5&&(c+=3+b-5)}for(let u=0;u<a-1;u+=1)for(let h=0;h<a-1;h+=1){let b=0;r.isDark(u,h)&&(b+=1),r.isDark(u+1,h)&&(b+=1),r.isDark(u,h+1)&&(b+=1),r.isDark(u+1,h+1)&&(b+=1),(b==0||b==4)&&(c+=3)}for(let u=0;u<a;u+=1)for(let h=0;h<a-6;h+=1)r.isDark(u,h)&&!r.isDark(u,h+1)&&r.isDark(u,h+2)&&r.isDark(u,h+3)&&r.isDark(u,h+4)&&!r.isDark(u,h+5)&&r.isDark(u,h+6)&&(c+=40);for(let u=0;u<a;u+=1)for(let h=0;h<a-6;h+=1)r.isDark(h,u)&&!r.isDark(h+1,u)&&r.isDark(h+2,u)&&r.isDark(h+3,u)&&r.isDark(h+4,u)&&!r.isDark(h+5,u)&&r.isDark(h+6,u)&&(c+=40);let l=0;for(let u=0;u<a;u+=1)for(let h=0;h<a;h+=1)r.isDark(h,u)&&(l+=1);let d=Math.abs(100*l/a/a-50)/5;return c+=d*10,c},i})(),Ne=(function(){let s=new Array(256),t=new Array(256);for(let n=0;n<8;n+=1)s[n]=1<<n;for(let n=8;n<256;n+=1)s[n]=s[n-4]^s[n-5]^s[n-6]^s[n-8];for(let n=0;n<255;n+=1)t[s[n]]=n;let e={};return e.glog=function(n){if(n<1)throw"glog("+n+")";return t[n]},e.gexp=function(n){for(;n<0;)n+=255;for(;n>=256;)n-=255;return s[n]},e})(),It=function(s,t){if(typeof s.length>"u")throw s.length+"/"+t;let e=(function(){let i=0;for(;i<s.length&&s[i]==0;)i+=1;let o=new Array(s.length-i+t);for(let r=0;r<s.length-i;r+=1)o[r]=s[r+i];return o})(),n={};return n.getAt=function(i){return e[i]},n.getLength=function(){return e.length},n.multiply=function(i){let o=new Array(n.getLength()+i.getLength()-1);for(let r=0;r<n.getLength();r+=1)for(let a=0;a<i.getLength();a+=1)o[r+a]^=Ne.gexp(Ne.glog(n.getAt(r))+Ne.glog(i.getAt(a)));return It(o,0)},n.mod=function(i){if(n.getLength()-i.getLength()<0)return n;let o=Ne.glog(n.getAt(0))-Ne.glog(i.getAt(0)),r=new Array(n.getLength());for(let a=0;a<n.getLength();a+=1)r[a]=n.getAt(a);for(let a=0;a<i.getLength();a+=1)r[a]^=Ne.gexp(Ne.glog(i.getAt(a))+o);return It(r,0).mod(i)},n},ir=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(i,o){let r={};return r.totalCount=i,r.dataCount=o,r},e={},n=function(i,o){switch(o){case Rt.L:return s[(i-1)*4+0];case Rt.M:return s[(i-1)*4+1];case Rt.Q:return s[(i-1)*4+2];case Rt.H:return s[(i-1)*4+3];default:return}};return e.getRSBlocks=function(i,o){let r=n(i,o);if(typeof r>"u")throw"bad rs block @ typeNumber:"+i+"/errorCorrectionLevel:"+o;let a=r.length/3,c=[];for(let l=0;l<a;l+=1){let d=r[l*3+0],u=r[l*3+1],h=r[l*3+2];for(let b=0;b<d;b+=1)c.push(t(u,h))}return c},e})(),rr=function(){let s=[],t=0,e={};return e.getBuffer=function(){return s},e.getAt=function(n){let i=Math.floor(n/8);return(s[i]>>>7-n%8&1)==1},e.put=function(n,i){for(let o=0;o<i;o+=1)e.putBit((n>>>i-o-1&1)==1)},e.getLengthInBits=function(){return t},e.putBit=function(n){let i=Math.floor(t/8);s.length<=i&&s.push(0),n&&(s[i]|=128>>>t%8),t+=1},e},hc=function(s){let t=fe.MODE_NUMBER,e=s,n={};n.getMode=function(){return t},n.getLength=function(r){return e.length},n.write=function(r){let a=e,c=0;for(;c+2<a.length;)r.put(i(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?r.put(i(a.substring(c,c+1)),4):a.length-c==2&&r.put(i(a.substring(c,c+2)),7))};let i=function(r){let a=0;for(let c=0;c<r.length;c+=1)a=a*10+o(r.charAt(c));return a},o=function(r){if("0"<=r&&r<="9")return r.charCodeAt(0)-48;throw"illegal char :"+r};return n},pc=function(s){let t=fe.MODE_ALPHA_NUM,e=s,n={};n.getMode=function(){return t},n.getLength=function(o){return e.length},n.write=function(o){let r=e,a=0;for(;a+1<r.length;)o.put(i(r.charAt(a))*45+i(r.charAt(a+1)),11),a+=2;a<r.length&&o.put(i(r.charAt(a)),6)};let i=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;if("A"<=o&&o<="Z")return o.charCodeAt(0)-65+10;switch(o){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+o}};return n},fc=function(s){let t=fe.MODE_8BIT_BYTE,e=s,n=ht.stringToBytes(s),i={};return i.getMode=function(){return t},i.getLength=function(o){return n.length},i.write=function(o){for(let r=0;r<n.length;r+=1)o.put(n[r],8)},i},gc=function(s){let t=fe.MODE_KANJI,e=s,n=ht.stringToBytes;(function(r,a){let c=n(r);if(c.length!=2||(c[0]<<8|c[1])!=a)throw"sjis not supported."})("友",38726);let i=n(s),o={};return o.getMode=function(){return t},o.getLength=function(r){return~~(i.length/2)},o.write=function(r){let a=i,c=0;for(;c+1<a.length;){let l=(255&a[c])<<8|255&a[c+1];if(33088<=l&&l<=40956)l-=33088;else if(57408<=l&&l<=60351)l-=49472;else throw"illegal char at "+(c+1)+"/"+l;l=(l>>>8&255)*192+(l&255),r.put(l,13),c+=2}if(c<a.length)throw"illegal char at "+(c+1)},o},ar=function(){let s=[],t={};return t.writeByte=function(e){s.push(e&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,i){n=n||0,i=i||e.length;for(let o=0;o<i;o+=1)t.writeByte(e[o+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return s},t.toString=function(){let e="";e+="[";for(let n=0;n<s.length;n+=1)n>0&&(e+=","),e+=s[n];return e+="]",e},t},mc=function(){let s=0,t=0,e=0,n="",i={},o=function(a){n+=String.fromCharCode(r(a&63))},r=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return i.writeByte=function(a){for(s=s<<8|a&255,t+=8,e+=1;t>=6;)o(s>>>t-6),t-=6},i.flush=function(){if(t>0&&(o(s<<6-t),s=0,t=0),e%3!=0){let a=3-e%3;for(let c=0;c<a;c+=1)n+="="}},i.toString=function(){return n},i},bc=function(s){let t=s,e=0,n=0,i=0,o={};o.read=function(){for(;i<8;){if(e>=t.length){if(i==0)return-1;throw"unexpected end of file./"+i}let c=t.charAt(e);if(e+=1,c=="=")return i=0,-1;if(c.match(/^\s$/))continue;n=n<<6|r(c.charCodeAt(0)),i+=6}let a=n>>>i-8&255;return i-=8,a};let r=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return o},xc=function(s,t){let e=s,n=t,i=new Array(s*t),o={};o.setPixel=function(l,d,u){i[d*e+l]=u},o.write=function(l){l.writeString("GIF87a"),l.writeShort(e),l.writeShort(n),l.writeByte(128),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(255),l.writeByte(255),l.writeByte(255),l.writeString(","),l.writeShort(0),l.writeShort(0),l.writeShort(e),l.writeShort(n),l.writeByte(0);let d=2,u=a(d);l.writeByte(d);let h=0;for(;u.length-h>255;)l.writeByte(255),l.writeBytes(u,h,255),h+=255;l.writeByte(u.length-h),l.writeBytes(u,h,u.length-h),l.writeByte(0),l.writeString(";")};let r=function(l){let d=l,u=0,h=0,b={};return b.write=function(C,x){if(C>>>x)throw"length over";for(;u+x>=8;)d.writeByte(255&(C<<u|h)),x-=8-u,C>>>=8-u,h=0,u=0;h=C<<u|h,u=u+x},b.flush=function(){u>0&&d.writeByte(h)},b},a=function(l){let d=1<<l,u=(1<<l)+1,h=l+1,b=c();for(let p=0;p<d;p+=1)b.add(String.fromCharCode(p));b.add(String.fromCharCode(d)),b.add(String.fromCharCode(u));let C=ar(),x=r(C);x.write(d,h);let w=0,A=String.fromCharCode(i[w]);for(w+=1;w<i.length;){let p=String.fromCharCode(i[w]);w+=1,b.contains(A+p)?A=A+p:(x.write(b.indexOf(A),h),b.size()<4095&&(b.size()==1<<h&&(h+=1),b.add(A+p)),A=p)}return x.write(b.indexOf(A),h),x.write(u,h),x.flush(),C.toByteArray()},c=function(){let l={},d=0,u={};return u.add=function(h){if(u.contains(h))throw"dup key:"+h;l[h]=d,d+=1},u.size=function(){return d},u.indexOf=function(h){return l[h]},u.contains=function(h){return typeof l[h]<"u"},u};return o},vc=function(s,t,e){let n=xc(s,t);for(let a=0;a<t;a+=1)for(let c=0;c<s;c+=1)n.setPixel(c,a,e(c,a));let i=ar();n.write(i);let o=mc(),r=i.toByteArray();for(let a=0;a<r.length;a+=1)o.writeByte(r[a]);return o.flush(),"data:image/gif;base64,"+o},lr=ht,su=ht.stringToBytes;function cr(s){let t=lr(0,"M");t.addData(s),t.make();let e=t.getModuleCount(),n="";for(let i=0;i<e;i++)for(let o=0;o<e;o++)t.isDark(i,o)&&(n+=`M${o} ${i}h1v1h-1z`);return{size:e,d:n}}var yc=1e4,Bt=class extends we{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,n){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,n))}async newCode(){try{let e=await sr();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof tt&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),yc)}}async poll(e){let n=this.secret;if(n)try{let i=await or(n,location.origin);if(!this.running||n!==this.secret)return;if(this.problem=null,i.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:i.auth}));return}if(i.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return T;let{size:e,d:n}=cr(nr(location.origin,this.code));return g`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${de`<path d=${n} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return g`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?tr(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${Ps}?${Ds}</span> and type the code.
          </li>
          <li>You’ll need to be a Home Assistant admin. The screen signs in as you.</li>
        </ol>
      </div>
      <div class="qr">${this.qr()}</div>
      <div class="foot">
        ${this.problem?g`<span class="problem" role="alert">${this.problem}</span>`:g`<span>${this.code?`A new code appears in ${e} minute${e===1?"":"s"}.`:"Getting a code…"}</span>`}
        <button type="button" class="link" @click=${()=>this.dispatchEvent(new CustomEvent("password"))}>
          Sign in with a password instead
        </button>
      </div>
    </div>`}};Bt.styles=Ue`
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
  `,Bt.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",Bt);var Ls="hassTokens";function dr(){try{let s=localStorage.getItem(Ls);return s?JSON.parse(s):null}catch{return null}}function Rs(s){try{s?localStorage.setItem(Ls,JSON.stringify(s)):localStorage.removeItem(Ls)}catch{}}function wc(s){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=s)}function kc(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(t=>{let e=n=>{s.stop(),s.hidden=!0,t(n)};s.addEventListener("paired",n=>e(n.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function $c(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let t=location.search.includes("auth_callback");if(!t&&!dr()){let e=await kc();e&&Rs(e)}try{let e=await eo({hassUrl:location.origin,loadTokens:async()=>dr(),saveTokens:Rs});t&&history.replaceState(null,"",location.pathname+cs(location.search));let n=await to({auth:e});s.backend=new Ft(n),n.addEventListener("reconnect-error",(i,o)=>{o===2&&ur()})}catch(e){if(e===2){ur();return}wc(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}function ur(){Rs(null),location.replace(location.pathname+cs(location.search))}var pr=At(location.search),hr=document.querySelector("mydashlight-keyboard");hr&&pr.keyboard!==!1&&er(hr);pr.cursor!=="show"&&Vi();$c();
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
