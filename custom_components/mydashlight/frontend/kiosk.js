var br=Object.defineProperty;var _n=(s,t)=>()=>(s&&(t=s(s=0)),t);var xr=(s,t)=>{for(var e in t)br(s,e,{get:t[e],enumerable:!0})};function pn(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function cs(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function Ea(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function ho(s){return Ea(s,t=>t.unicode)}function _a(s){function t(e,n,o){let i=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(o)for(let[r,[a,c]]of Object.entries(o))i.createIndex(r,a,{multiEntry:c});return i}t(ct),t(Ze,xa,{[fo]:[ba,!0],[mo]:[[va,ya]],[bo]:[wa,!0]}),t(ps,void 0,{[go]:[""]})}function xo(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function Ta(s){let t=await new Promise((e,n)=>{let o=indexedDB.open(s,ga);us[s]=o,o.onupgradeneeded=i=>{i.oldVersion<ma&&_a(o.result)},xo(e,n,o)});return t.onclose=()=>gs(s),t}function Ca(s){return gn[s]||(gn[s]=Ta(s)),gn[s]}function Ie(s,t,e,n){return new Promise((o,i)=>{let r=s.transaction(t,e,{durability:"relaxed"}),a=typeof t=="string"?r.objectStore(t):t.map(l=>r.objectStore(l)),c;n(a,r,l=>{c=l}),r.oncomplete=()=>o(c),r.onerror=()=>i(r.error)})}function gs(s){let t=us[s],e=t&&t.result;if(e){e.close();let n=bn[s];if(n)for(let o of n)o()}delete us[s],delete gn[s],delete bn[s]}function Aa(s){return new Promise((t,e)=>{gs(s);let n=indexedDB.deleteDatabase(s);xo(t,e,n)})}function Sa(s,t){let e=bn[s];e||(e=bn[s]=[]),e.push(t)}function lt(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||Ma.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function vo(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=Pa)}function La(s){return s.map(({annotation:e,emoticon:n,group:o,order:i,shortcodes:r,skins:a,tags:c,emoji:l,version:d})=>{let u=[...new Set(vo([...(r||[]).map(lt).flat(),...(c||[]).map(lt).flat(),...lt(e),n]))].sort(),h={annotation:e,group:o,order:i,tags:c,tokens:u,unicode:l,version:d};if(n&&(h.emoticon=n),r&&(h.shortcodes=r),a){h.skinTones=[],h.skinUnicodes=[],h.skinVersions=[];for(let{tone:b,emoji:C,version:f}of a)h.skinTones.push(b),h.skinUnicodes.push(C),h.skinVersions.push(f)}return h})}function yo(s,t,e,n){s[t](e).onsuccess=o=>n&&n(o.target.result)}function Xe(s,t,e){yo(s,"get",t,e)}function wo(s,t,e){yo(s,"getAll",t,e)}function ms(s){s.commit&&s.commit()}function Da(s,t){let e=s[0];for(let n=1;n<s.length;n++){let o=s[n];t(e)>t(o)&&(e=o)}return e}function ko(s,t){let e=Da(s,o=>o.length),n=[];for(let o of e)s.some(i=>i.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function Ra(s){return!await bs(s,ct,mn)}async function Ia(s,t,e){let[n,o]=await Promise.all([ds,mn].map(i=>bs(s,ct,i)));return n===e&&o===t}async function Ba(s,t){return Ie(s,Ze,ut,(n,o,i)=>{let r,a=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let l=c.target.result;for(let d of l)if(r=d.unicode,t(d))return i(d);if(l.length<50)return i();a()}};a()})}async function $o(s,t,e,n){try{let o=La(t);await Ie(s,[Ze,ct],fs,([i,r],a)=>{let c,l,d=0;function u(){++d===2&&h()}function h(){if(!(c===n&&l===e)){i.clear();for(let b of o)i.put(b);r.put(n,ds),r.put(e,mn),ms(a)}}Xe(r,ds,b=>{c=b,u()}),Xe(r,mn,b=>{l=b,u()})})}finally{}}async function Oa(s,t){return Ie(s,Ze,ut,(e,n,o)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);wo(e.index(mo),i,o)})}async function Eo(s,t){let e=vo(lt(t));return e.length?Ie(s,Ze,ut,(n,o,i)=>{let r=[],a=()=>{r.length===e.length&&c()},c=()=>{let l=ko(r,d=>d.unicode);i(l.sort((d,u)=>d.order<u.order?-1:1))};for(let l=0;l<e.length;l++){let d=e[l],u=l===e.length-1?IDBKeyRange.bound(d,d+"￿",!1,!0):IDBKeyRange.only(d);wo(n.index(fo),u,h=>{r.push(h),a()})}}):[]}async function ja(s,t){let e=await Eo(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(i=>i.toLowerCase()).includes(t.toLowerCase()))[0]||null:await Ba(s,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function Na(s,t){return Ie(s,Ze,ut,(e,n,o)=>Xe(e,t,i=>{if(i)return o(i);Xe(e.index(bo),t,r=>o(r||null))}))}function bs(s,t,e){return Ie(s,t,ut,(n,o,i)=>Xe(n,e,i))}function za(s,t,e,n){return Ie(s,t,fs,(o,i)=>{o.put(n,e),ms(i)})}function Ua(s,t){return Ie(s,ps,fs,(e,n)=>Xe(e,t,o=>{e.put((o||0)+1,t),ms(n)}))}function Ha(s,t,e){return e===0?[]:Ie(s,[ps,Ze],ut,([n,o],i,r)=>{let a=[];n.index(go).openCursor(void 0,"prev").onsuccess=c=>{let l=c.target.result;if(!l)return r(a);function d(b){if(a.push(b),a.length===e)return r(a);l.continue()}let u=l.primaryKey,h=t.byName(u);if(h)return d(h);Xe(o,u,b=>{if(b)return d(b);l.continue()})}})}function Fa(s,t){let e=new Map;for(let o of s){let i=t(o);for(let r of i){let a=e;for(let l=0;l<r.length;l++){let d=r.charAt(l),u=a.get(d);u||(u=new Map,a.set(d,u)),a=u}let c=a.get(fn);c||(c=[],a.set(fn,c)),c.push(o)}}return(o,i)=>{let r=e;for(let l=0;l<o.length;l++){let d=o.charAt(l),u=r.get(d);if(u)r=u;else return[]}if(i)return r.get(fn)||[];let a=[],c=[r];for(;c.length;){let d=[...c.shift().entries()].sort((u,h)=>u[0]<h[0]?-1:1);for(let[u,h]of d)u===fn?a.push(...h):c.push(h)}return a}}function Wa(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||Ka.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function po(s){Wa(s);let t=(h,b)=>h.name.toLowerCase()<b.name.toLowerCase()?-1:1,e=s.sort(t),o=Fa(s,h=>{let b=new Set;if(h.shortcodes)for(let C of h.shortcodes)for(let f of lt(C))b.add(f);return b}),i=h=>o(h,!0),r=h=>o(h,!1),a=h=>{let b=lt(h),C=b.map((f,w)=>(w<b.length-1?i:r)(f));return ko(C,f=>f.name).sort(t)},c=new Map,l=new Map;for(let h of s){l.set(h.name.toLowerCase(),h);for(let b of h.shortcodes||[])c.set(b.toLowerCase(),h)}return{all:e,search:a,byShortcode:h=>c.get(h.toLowerCase()),byName:h=>l.get(h.toLowerCase())}}function Tt(s){if(!s)return s;if(qa&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function _o(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function Ga(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||Va.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function To(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function Ya(s){let t=await fetch(s,{method:"HEAD"});To(t,s);let e=t.headers.get("etag");return _o(e),e}async function hs(s){let t=await fetch(s);To(t,s);let e=t.headers.get("etag");_o(e);let n=await t.json();return Ga(n),[e,n]}function Ja(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function Xa(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=s.charCodeAt(o);return e}async function Co(s){let t=JSON.stringify(s),e=Xa(t),n=await crypto.subtle.digest("SHA-1",e),o=Ja(n);return btoa(o)}async function Za(s,t){let e,n=await Ya(t);if(!n){let o=await hs(t);n=o[0],e=o[1],n||(n=await Co(e))}await Ia(s,t,n)||(e||(e=(await hs(t))[1]),await $o(s,e,t,n))}async function Qa(s,t){let[e,n]=await hs(t);e||(e=await Co(n)),await $o(s,n,t,e)}async function el(s,t){try{await Za(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var ga,ma,Ze,ct,ps,ba,fo,xa,go,va,ya,mo,ds,mn,uo,ut,fs,bo,wa,ka,$a,us,gn,bn,Ma,Pa,fn,Ka,qa,Va,dt,xs=_n(()=>{ga=1,ma=1,Ze="emoji",ct="keyvalue",ps="favorites",ba="tokens",fo="tokens",xa="unicode",go="count",va="group",ya="order",mo="group-order",ds="eTag",mn="url",uo="skinTone",ut="readonly",fs="readwrite",bo="skinUnicodes",wa="skinUnicodes",ka="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",$a="en";us={},gn={},bn={};Ma=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);Pa=2;fn="";Ka=["name","url"];qa=typeof wrappedJSObject<"u";Va=["annotation","emoji","group","order","version"];dt=class{constructor({dataSource:t=ka,locale:e=$a,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=po(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await Ca(this._dbName);Sa(this._dbName,this._clear);let e=this.dataSource;await Ra(t)?await Qa(t,e):this._lazyUpdate=el(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return cs(t),await this.ready(),ho(await Oa(this._db,t)).map(Tt)}async getEmojiBySearchQuery(t){pn(t),await this.ready();let e=this._custom.search(t),n=ho(await Eo(this._db,t)).map(Tt);return[...e,...n]}async getEmojiByShortcode(t){pn(t),await this.ready();let e=this._custom.byShortcode(t);return e||Tt(await ja(this._db,t))}async getEmojiByUnicodeOrName(t){pn(t),await this.ready();let e=this._custom.byName(t);return e||Tt(await Na(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await bs(this._db,ct,uo)||0}async setPreferredSkinTone(t){return cs(t),await this.ready(),za(this._db,ct,uo,t)}async incrementFavoriteEmojiCount(t){return pn(t),await this.ready(),Ua(this._db,t)}async getTopFavoriteEmoji(t){return cs(t),await this.ready(),(await Ha(this._db,this._custom,t)).map(Tt)}set customEmoji(t){this._custom=po(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await gs(this._dbName)}async delete(){await this._shutdown(),await Aa(this._dbName)}}});function So(s){return s.unicode.includes("‍")}function cl(s){let t=Mo(s,"#000"),e=Mo(s,"#fff");return t&&e&&ll(t,e)}function dl(){let s=Object.entries(nl);try{for(let[t,e]of s)if(cl(t))return e}catch{}finally{}return s[0][1]}function ml(s,t){if(t===0)return s;let e=s.indexOf(pl);return e!==-1?s.substring(0,e)+String.fromCodePoint(fl+t-1)+s.substring(e):(s.endsWith(ul)&&(s=s.substring(0,s.length-1)),s+hl+String.fromCodePoint(gl+t-1))}function Ce(s){s.preventDefault(),s.stopPropagation()}function ks(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function No(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function bl(s,t){let e=n=>{let o={};for(let i of n)typeof i.tone=="number"&&i.version<=t&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:n,skins:o,shortcodes:i,url:r,name:a,category:c,annotation:l})=>({unicode:n,name:a,shortcodes:i,url:r,category:c,annotation:l,id:n||a,skins:o&&e(o)}))}function vl(s,t,e){let n;xl?(n=new ResizeObserver(e),n.observe(s)):vn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function Po(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function Lo(s,t,e){let n=Po(t);if(!n){if(!Qe){Qe=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])Qe.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(Qe),Qe.firstChild.nodeValue=s,Po(Qe)}finally{Qe.remove()}}return n}function wl(s,t,e){let n=!0;for(let o of s){let i=e(o);if(!i)continue;typeof $s>"u"&&($s=Lo(yl,t,t));let a=Lo(o.unicode,i,t)/1.8<$s;Cs.set(o.unicode,a),a||(n=!1)}return n}function kl(s){return No(s,t=>t)}function $l(s){s&&(s.scrollTop=0)}function Ct(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function Do(s){return""+s}function El(s){let t=document.createElement("template");return t.innerHTML=s,t}function Sl(s,t){Al?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function Ml(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function Pl(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=Ml(n,s):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&Sl(n,s)}function Ll(s,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:a,attributeValuePost:c}}=e,l=s[i];if(o!==l)if(e.currentExpression=l,r)if(l===null)n.removeAttribute(r);else{let d=a+Do(l)+c;n.setAttribute(r,d)}else{let d;Array.isArray(l)?Pl(l,e):l instanceof Element?(d=l,n.replaceWith(d)):n.nodeValue=Do(l),d&&(e.targetNode=d)}}}function Dl(s){let t="",e=!1,n=!1,o=-1,i=new Map,r=[],a=0;for(let l=0,d=s.length;l<d;l++){let u=s[l];if(t+=u.slice(a),l===d-1)break;for(let x=0;x<u.length;x++)switch(u.charAt(x)){case"<":{u.charAt(x+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let h=r[r.length-1],b=Ct(i,h,()=>[]),C,f,w;if(n){let x=/(\S+)="?([^"=]*)$/.exec(u);C=x[1],f=x[2];let B=/^([^">]*)("?)/.exec(s[l+1]);w=B[1],t=t.slice(0,-1*x[0].length),a=B[0].length}else a=0;let A={attributeName:C,attributeValuePre:f,attributeValuePost:w,expressionIndex:l};b.push(A),!e&&!n&&(t+=" ")}return{template:El(t),elementsToBindings:i}}function Ro(s,t,e){for(let n=0;n<s.length;n++){let o=s[n],i=o.attributeName?t:t.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Rl(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))Ro(n,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let a=t.get(++r);a&&Ro(a,i,e)}while(i=o.nextNode())}return e}function Il(s){let{template:t,elementsToBindings:e}=Ct(_l,s,()=>Dl(s)),n=t.cloneNode(!0).content.firstElementChild,o=Rl(n,e);return function(r){return Ll(r,o),n}}function Bl(s){let t=Ct(Tl,s,()=>new Map),e=Cl;function n(i,...r){let a=Ct(t,i,()=>new Map);return Ct(a,e,()=>Il(i))(r)}function o(i,r,a){return i.map((c,l)=>{let d=e;e=a(c);try{return r(c,l)}finally{e=d}})}return{map:o,html:n}}function Ol(s,t,e,n,o,i,r,a,c){let{labelWithSkin:l,titleForEmoji:d,unicodeWithSkin:u}=e,{html:h,map:b}=Bl(t);function C(x,B,X){return b(x,(H,he)=>h`<button role="${B?"option":"menuitem"}" aria-selected="${B?he===t.activeSearchItem:null}" aria-label="${l(H,t.currentSkinTone)}" title="${d(H)}" class="${"emoji"+(B&&he===t.activeSearchItem?" active":"")+(H.unicode?"":" custom-emoji")}" id="${`${X}-${H.id}`}" style="${H.unicode?null:`--custom-emoji-background: url(${JSON.stringify(H.url)})`}">${H.unicode?u(H,t.currentSkinTone):""}</button>`,H=>`${X}-${H.id}`)}let w=h`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${b(t.skinTones,(x,B)=>h`<div id="skintone-${B}" class="emoji ${B===t.activeSkinTone?"active":""}" aria-selected="${B===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[B]}" aria-label="${t.i18n.skinTones[B]}">${x}</div>`,x=>x)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${b(t.groups,x=>h`<button role="tab" class="nav-button" aria-controls="tab-${x.id}" aria-label="${t.i18n.categories[x.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===x.id}" title="${t.i18n.categories[x.name]}" data-group-id="${x.id}"><div class="nav-emoji emoji">${x.emoji}</div></button>`,x=>x.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${b(t.currentEmojisWithCategories,(x,B)=>h`<div><div id="menu-label-${B}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:x.category?x.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${B!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(x.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${B}" id="${t.searchMode?"search-results":null}">${C(x.emojis,t.searchMode,"emo")}</div></div>`,x=>x.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${C(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,A=(x,B)=>{for(let X of s.querySelectorAll(`[${x}]`))B(X,X.getAttribute(x))};if(c){s.appendChild(w);for(let x of["click","focusout","input","keydown","keyup"])A(`data-on-${x}`,(B,X)=>{B.addEventListener(x,n[X])});A("data-ref",(x,B)=>{i[B]=x}),r.addEventListener("abort",()=>{s.removeChild(w)})}A("data-action",(x,B)=>{let X=a.get(B);X||a.set(B,X=new WeakSet),X.has(x)||(X.add(x),o[B](x))})}function jl(s){let t=!1,e,n=new Map,o=new Set,i,r=()=>{if(t)return;let l=[...o];o.clear();try{for(let d of l)d()}finally{i=!1,o.size&&(i=!0,yn(r))}},a=new Proxy({},{get(l,d){if(e){let u=n.get(d);u||(u=new Set,n.set(d,u)),u.add(e)}return l[d]},set(l,d,u){if(l[d]!==u){l[d]=u;let h=n.get(d);if(h){for(let b of h)o.add(b);i||(i=!0,yn(r))}}return!0}}),c=l=>{let d=()=>{let u=e;e=d;try{return l()}finally{e=u}};return d()};return s.addEventListener("abort",()=>{t=!0}),{state:a,createEffect:c}}function Es(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function Nl(s,t,e){{let n=s.closest(".tabpanel"),o=Io.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),Io.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function zl(s,t){let e={},n=new AbortController,o=n.signal,{state:i,createEffect:r}=jl(o),a=new Map;xn(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),xn(i,t),xn(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:ol,isRtl:!1,currentGroupIndex:0,groups:vs,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let c=p=>{s.getElementById(p).focus()},l=p=>s.getElementById(`emo-${p.id}`),d=(p,_)=>{e.rootElement.dispatchEvent(new CustomEvent(p,{detail:_,bubbles:!0,composed:!0}))},u=(p,_)=>p.id===_.id,h=(p,_)=>{let{category:I,emojis:z}=p,{category:V,emojis:se}=_;return I!==V?!1:Es(z,se,u)},b=p=>{Es(i.currentEmojis,p,u)||(i.currentEmojis=p)},C=p=>{i.searchMode!==p&&(i.searchMode=p)},f=p=>{Es(i.currentEmojisWithCategories,p,h)||(i.currentEmojisWithCategories=p)},w=(p,_)=>_&&p.skins&&p.skins[_]||p.unicode,B={labelWithSkin:(p,_)=>kl([p.name||w(p,_),p.annotation,...p.shortcodes||_s].filter(Boolean)).join(", "),titleForEmoji:p=>p.annotation||(p.shortcodes||_s).join(", "),unicodeWithSkin:w},X={onClickSkinToneButton:D,onEmojiClick:be,onNavClick:S,onNavKeydown:Y,onSearchKeydown:j,onSkinToneOptionsClick:g,onSkinToneOptionsFocusOut:K,onSkinToneOptionsKeydown:N,onSkinToneOptionsKeyup:R,onSearchInput:ee},H={calculateEmojiGridStyle:E,updateOnIntersection:y},he=!0;r(()=>{Ol(s,i,B,X,H,e,o,a,he),he=!1}),i.emojiVersion||ws().then(p=>{p||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function p(){let _=!1,I=setTimeout(()=>{_=!0,i.message=i.i18n.loadingMessage},sl);try{await i.database.ready(),i.databaseLoaded=!0}catch(z){console.error(z),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(I),_&&(_=!1,i.message="")}}i.database&&p()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${Ao};`}),r(()=>{i.customEmoji&&i.database&&v()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==Ts&&(i.groups=Ts):i.groups!==vs&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=vs)}),r(()=>{async function p(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}p()}),r(()=>{i.skinTones=Array(Ao).fill().map((p,_)=>ml(i.skinToneEmoji,_))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function p(){let{database:_}=i,I=(await Promise.all(rl.map(z=>_.getEmojiByUnicodeOrName(z)))).filter(Boolean);i.defaultFavoriteEmojis=I}i.databaseLoaded&&p()});function v(){let{customEmoji:p,database:_}=i,I=p||_s;_.customEmoji!==I&&(_.customEmoji=I)}r(()=>{async function p(){v();let{database:_,defaultFavoriteEmojis:I,numColumns:z}=i,V=await _.getTopFavoriteEmoji(z),se=await q(No([...V,...I],ie=>ie.unicode||ie.name).slice(0,z));i.currentFavorites=se}i.databaseLoaded&&i.defaultFavoriteEmojis&&p()});function E(p){vl(p,o,()=>{{let _=getComputedStyle(e.rootElement),I=parseInt(_.getPropertyValue("--num-columns"),10),z=_.getPropertyValue("direction")==="rtl";i.numColumns=I,i.isRtl=z}})}function y(p){Nl(p,o,_=>{for(let{target:I,isIntersecting:z}of _)I.classList.toggle("onscreen",z)})}r(()=>{async function p(){let{searchText:_,currentGroup:I,databaseLoaded:z,customEmoji:V}=i;if(!z)i.currentEmojis=[],i.searchMode=!1;else if(_.length>=tl){let se=await Q(_);i.searchText===_&&(b(se),C(!0))}else{let{id:se}=I;if(se!==-1||V&&V.length){let ie=await Z(se);i.currentGroup.id===se&&(b(ie),C(!1))}}}p()});let k=()=>{vn(()=>$l(e.tabpanelElement))};r(()=>{let{currentEmojis:p,emojiVersion:_}=i,I=p.filter(z=>z.unicode).filter(z=>So(z)&&!Cs.has(z.unicode));if(!_&&I.length)b(p),vn(()=>$(I));else{let z=_?p:p.filter(M);b(z),k()}});function $(p){wl(p,e.baselineEmoji,l)?k():i.currentEmojis=[...i.currentEmojis]}function M(p){return!p.unicode||!So(p)||Cs.get(p.unicode)}async function O(p){let _=i.emojiVersion||await ws();return p.filter(({version:I})=>!I||I<=_)}async function q(p){return bl(p,i.emojiVersion||await ws())}async function Z(p){let _=p===-1?i.customEmoji:await i.database.getEmojiByGroup(p);return q(await O(_))}async function Q(p){return q(await O(await i.database.getEmojiBySearchQuery(p)))}r(()=>{}),r(()=>{function p(){let{searchMode:I,currentEmojis:z}=i;if(I)return[{category:"",emojis:z}];let V=new Map;for(let se of z){let ie=se.category||"",L=V.get(ie);L||(L=[],V.set(ie,L)),L.push(se)}return[...V.entries()].map(([se,ie])=>({category:se,emojis:ie})).sort((se,ie)=>i.customCategorySorting(se.category,ie.category))}let _=p();f(_)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:p}=i;Oo(()=>{i.searchText=(p||"").trim(),i.activeSearchItem=-1})});function j(p){if(!i.searchMode||!i.currentEmojis.length)return;let _=I=>{Ce(p),i.activeSearchItem=ks(I,i.activeSearchItem,i.currentEmojis)};switch(p.key){case"ArrowDown":return _(!1);case"ArrowUp":return _(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return Ce(p),ge(i.currentEmojis[i.activeSearchItem].id)}}function S(p){let{target:_}=p,I=_.closest(".nav-button");if(!I)return;let z=parseInt(I.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(V=>V.id===z)}function Y(p){let{target:_,key:I}=p,z=V=>{V&&(Ce(p),V.focus())};switch(I){case"ArrowLeft":return z(_.previousElementSibling);case"ArrowRight":return z(_.nextElementSibling);case"Home":return z(_.parentElement.firstElementChild);case"End":return z(_.parentElement.lastElementChild)}}async function W(p){let _=await i.database.getEmojiByUnicodeOrName(p),I=[...i.currentEmojis,...i.currentFavorites].find(V=>V.id===p),z=I.unicode&&w(I,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(p),{emoji:_,skinTone:i.currentSkinTone,...z&&{unicode:z},...I.name&&{name:I.name}}}async function ge(p){let _=W(p);d("emoji-click-sync",_),d("emoji-click",await _)}function be(p){let{target:_}=p;if(!_.classList.contains("emoji"))return;Ce(p);let I=_.id.substring(4);ge(I)}function oe(p){i.currentSkinTone=p,i.skinTonePickerExpanded=!1,c("skintone-button"),d("skin-tone-change",{skinTone:p}),i.database.setPreferredSkinTone(p)}function g(p){let{target:{id:_}}=p,I=_&&_.match(/^skintone-(\d)/);if(!I)return;Ce(p);let z=parseInt(I[1],10);oe(z)}function D(p){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(Ce(p),vn(()=>c("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function N(p){if(!i.skinTonePickerExpanded)return;let _=async I=>{Ce(p),i.activeSkinTone=I};switch(p.key){case"ArrowUp":return _(ks(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return _(ks(!1,i.activeSkinTone,i.skinTones));case"Home":return _(0);case"End":return _(i.skinTones.length-1);case"Enter":return Ce(p),oe(i.activeSkinTone);case"Escape":return Ce(p),i.skinTonePickerExpanded=!1,c("skintone-button")}}function R(p){if(i.skinTonePickerExpanded)switch(p.key){case" ":return Ce(p),oe(i.activeSkinTone)}}async function K(p){let{relatedTarget:_}=p;(!_||_.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function ee(p){i.rawSearchText=p.target.value}return{$set(p){xn(i,p)},$destroy(){n.abort()}}}function Bo(s){s instanceof et||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var Ts,vs,tl,Ao,Oo,nl,sl,il,ol,rl,jo,al,Mo,ll,ys,ws,Cs,ul,hl,pl,fl,gl,vn,xl,yl,$s,Qe,_l,Tl,Cl,Al,yn,Io,_s,xn,Ul,Hl,Fl,Kl,zo,Wl,et,Uo,Ho=_n(()=>{xs();Ts=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),vs=Ts.slice(1),tl=2,Ao=6,Oo=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;nl={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},sl=1e3,il="🖐️",ol=8,rl=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],jo='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',al=(s,t)=>s<t?-1:s>t?1:0,Mo=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${jo}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},ll=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};ws=()=>(ys||(ys=new Promise(s=>Oo(()=>s(dl())))),ys),Cs=new Map,ul="️",hl="\uD83C",pl="‍",fl=127995,gl=57339;vn=requestAnimationFrame,xl=typeof ResizeObserver=="function";yl="😀";_l=new WeakMap,Tl=new WeakMap,Cl=Symbol("un-keyed"),Al="replaceChildren"in Element.prototype;yn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);Io=new WeakMap;_s=[],{assign:xn}=Object;Ul="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Hl="en",Fl={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},Kl=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',zo=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],Wl=`:host{--emoji-font-family:${jo}}`,et=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Kl+Wl,this.shadowRoot.appendChild(e),this._ctx={locale:Hl,dataSource:Ul,skinToneEmoji:il,customCategorySorting:al,customEmoji:null,i18n:Fl,emojiVersion:null,...t};for(let n of zo)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){Bo(this),this._cmp||(this._cmp=zl(this.shadowRoot,this._ctx))}disconnectedCallback(){Bo(this),yn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new dt({locale:t,dataSource:e}))}_dbFlush(){yn(()=>this._dbCreate())}},Uo={};for(let s of zo)Uo[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(et.prototype,Uo);customElements.get("emoji-picker")||customElements.define("emoji-picker",et)});var Fo={};xr(Fo,{Database:()=>dt,Picker:()=>et});var Ko=_n(()=>{Ho();xs()});function zs(s){return{type:"auth",access_token:s}}function Us(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function Hs(s){let t={type:"subscribe_events"};return s&&(t.event_type=s),t}function Tn(s){return{type:"unsubscribe_events",subscription:s}}function Fs(){return{type:"ping"}}function Ks(s,t){return{type:"result",success:!1,error:{code:s,message:t}}}function qs(s){let t={},e=s.split("&");for(let n=0;n<e.length;n++){let o=e[n].split("="),i=decodeURIComponent(o[0]),r=o.length>1?decodeURIComponent(o[1]):void 0;t[i]=r}return t}var Vs=(s,t,e,n)=>{let[o,i,r]=s.split(".",3);return Number(o)>t||Number(o)===t&&(n===void 0?Number(i)>=e:Number(i)>e)||n!==void 0&&Number(o)===t&&Number(i)===e&&Number(r)>=n};var Bt=!1,yr="auth_required",wr="auth_invalid",kr="auth_ok";function Ys(s){if(!s.auth)throw 4;let t=s.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,n=t.wsUrl;Bt&&console.log("[Auth phase] Initializing",n);function o(i,r,a){Bt&&console.log("[Auth Phase] New connection",n);let c=new WebSocket(n),l=!1,d=()=>{if(c.removeEventListener("close",d),l){a(2);return}if(i===0){a(1);return}let b=i===-1?-1:i-1;setTimeout(()=>o(b,r,a),1e3)},u=async b=>{try{t.expired&&await(e||t.refreshAccessToken()),c.send(JSON.stringify(zs(t.accessToken)))}catch(C){l=C===2,c.close()}},h=async b=>{let C=JSON.parse(b.data);switch(Bt&&console.log("[Auth phase] Received",C),C.type){case wr:l=!0,c.close();break;case kr:c.removeEventListener("open",u),c.removeEventListener("message",h),c.removeEventListener("close",d),c.removeEventListener("error",d),c.haVersion=C.ha_version,Vs(c.haVersion,2022,9)&&c.send(JSON.stringify(Us())),r(c);break;default:Bt&&C.type!==yr&&console.warn("[Auth phase] Unhandled message",C)}};c.addEventListener("open",u),c.addEventListener("message",h),c.addEventListener("close",d),c.addEventListener("error",d)}return new Promise((i,r)=>o(s.setupRetry,i,r))}var ft=!1,Ot=class{constructor(t,e){this._handleMessage=n=>{let o=JSON.parse(n.data);Array.isArray(o)||(o=[o]),o.forEach(i=>{ft&&console.log("Received",i);let r=this.commands.get(i.id);switch(i.type){case"event":r?r.callback(i.event):(console.warn(`Received event for unknown subscription ${i.id}. Unsubscribing.`),this.sendMessagePromise(Tn(i.id)).catch(a=>{ft&&console.warn(` Error unsubsribing from unknown subscription ${i.id}`,a)}));break;case"result":r&&(i.success?(r.resolve(i.result),"subscribe"in r||this.commands.delete(i.id)):(r.reject(i.error),this.commands.delete(i.id)));break;case"pong":r?(r.resolve(),this.commands.delete(i.id)):console.warn(`Received unknown pong response ${i.id}`);break;default:ft&&console.warn("Unhandled message",i)}})},this._handleClose=async()=>{let n=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,n.forEach(r=>{"subscribe"in r||r.reject(Ks(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let o=Object.assign(Object.assign({},this.options),{setupRetry:0}),i=r=>{setTimeout(async()=>{if(!this.closeRequested){ft&&console.log("Trying to reconnect");try{let a=await o.createSocket(o);this._setSocket(a)}catch(a){if(this._queuedMessages){let c=this._queuedMessages;this._queuedMessages=void 0;for(let l of c)l.reject&&l.reject(3)}a===2?this.fireEvent("reconnect-error",a):i(r+1)}}},Math.min(r,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),i(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(o=>{"subscribe"in o&&o.subscribe&&o.subscribe().then(i=>{o.unsubscribe=i,o.resolve()})}));let n=this._queuedMessages;if(n){this._queuedMessages=void 0;for(let o of n)o.resolve()}this.fireEvent("ready")}addEventListener(t,e){let n=this.eventListeners.get(t);n||(n=[],this.eventListeners.set(t,n)),n.push(e)}removeEventListener(t,e){let n=this.eventListeners.get(t);if(!n)return;let o=n.indexOf(e);o!==-1&&n.splice(o,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(n=>n(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,Hs(e))}ping(){return this.sendMessagePromise(Fs())}sendMessage(t,e){if(!this.connected)throw 3;if(ft&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,n)=>{if(this._queuedMessages){this._queuedMessages.push({reject:n,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(i){n(i)}}});return}let o=this._genCmdId();this.commands.set(o,{resolve:e,reject:n}),this.sendMessage(t,o)})}async subscribeMessage(t,e,n){if(this._queuedMessages&&await new Promise((i,r)=>{this._queuedMessages.push({resolve:i,reject:r})}),n?.preCheck&&!await n.preCheck())throw new Error("Pre-check failed");let o;return await new Promise((i,r)=>{let a=this._genCmdId();o={resolve:i,reject:r,callback:t,subscribe:n?.resubscribe!==!1?()=>this.subscribeMessage(t,e,n):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(Tn(a)),this.commands.delete(a)}},this.commands.set(a,o);try{this.sendMessage(e,a)}catch{}}),()=>o.unsubscribe()}_genCmdId(){return++this.commandId}};var $r=()=>`${location.protocol}//${location.host}/`,Er=s=>s*1e3+Date.now();function _r(){let{protocol:s,host:t,pathname:e,search:n}=location;return`${s}//${t}${e}${n}`}function Tr(s,t,e,n){let o=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(o+=`&client_id=${encodeURIComponent(t)}`),n&&(o+=`&state=${encodeURIComponent(n)}`),o}function Cr(s,t,e,n){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=Tr(s,t,e,n)}async function Zs(s,t,e){let n=typeof location<"u"&&location;if(n&&n.protocol==="https:"){let a=document.createElement("a");if(a.href=s,a.protocol==="http:"&&a.hostname!=="localhost")throw 5}let o=new FormData;t!==null&&o.append("client_id",t),Object.keys(e).forEach(a=>{o.append(a,e[a])});let i=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:o});if(!i.ok)throw i.status===400||i.status===403?2:new Error("Unable to fetch tokens");let r=await i.json();return r.hassUrl=s,r.clientId=t,r.expires=Er(r.expires_in),r}function Xs(s,t,e){return Zs(s,t,{code:e,grant_type:"authorization_code"})}function Ar(s){return btoa(JSON.stringify(s))}function Sr(s){return JSON.parse(atob(s))}var Cn=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await Zs(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function Qs(s={}){let t,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let n=s.clientId!==void 0?s.clientId:$r(),o=s.limitHassInstance===!0;if(s.authCode&&e&&(t=await Xs(e,n,s.authCode),s.saveTokens&&s.saveTokens(t)),!t){let i=qs(location.search.substr(1));if("auth_callback"in i){let r=Sr(i.state);if(o&&(r.hassUrl!==e||r.clientId!==n))throw 6;t=await Xs(r.hassUrl,r.clientId,i.code),s.saveTokens&&s.saveTokens(t)}}if(!t&&s.loadTokens&&(t=await s.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new Cn(t,s.saveTokens);if(e===void 0)throw 4;return Cr(e,n,s.redirectUrl||_r(),Ar({hassUrl:e,clientId:n})),new Promise(()=>{})}async function ei(s){let t=Object.assign({setupRetry:0,createSocket:Ys},s),e=await t.createSocket(t);return new Ot(e,t)}function U(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function ze(s){let t=Math.floor(Math.round(s)/60)%24;return`${U(s)} ${t<12?"AM":"PM"}`}function ti(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function mt(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function ni(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Mr=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Pr=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Lr=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function jt(s){return new Date(`${s}T12:00:00Z`)}function $e(s){let t=jt(s);return`${Mr.format(t)}, ${Lr.format(t)}`}function fe(s){return Pr.format(jt(s))}function Ee(s,t){return Math.round((jt(t).getTime()-jt(s).getTime())/864e5)}function gt(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return gt("UTC",t)}let n=o=>e.find(i=>i.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function Nt(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=gt(e,s),i=gt(e,t).date;return o.date===i?`at ${ze(o.minutes)}`:`on ${fe(o.date)} at ${ze(o.minutes)}`}var le=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},Ue="mydashlight",Dr=7,si=3e4;function An(s){if(s instanceof le)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new le(String(t.code??"error"),t.message)}return typeof s=="number"?new le("connection_lost","Lost the connection to Home Assistant."):new le("error",String(s))}var zt=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new le("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},si),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new le("not_running","MyDashLight isn’t running right now."))},{type:`${Ue}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:Ue,service:"get_plan",service_data:{days:Dr},return_response:!0});this.emit(t.response)}catch(t){this.fail(An(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ue,service:t,service_data:e})}catch(n){throw An(n)}this.pushing||await this.refresh()}setRide(t,e,n,o){return this.call("set_ride",{event:t,side:e,driver:n,scope:o})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:ni(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}watchChores(t){let e=!1,n=null,o=null,i=async()=>{try{let r=await this.conn.sendMessagePromise({type:"call_service",domain:Ue,service:"get_chores",service_data:{},return_response:!0});e||t(r.response??null)}catch{e||t(null)}};return(async()=>{try{let r=await this.conn.subscribeMessage(a=>{e||t(a.chores)},{type:`${Ue}/chores/subscribe`},{resubscribe:!0});e?r().catch(()=>{}):n=r}catch{if(e)return;i(),o=setInterval(()=>void i(),si)}})(),()=>{e=!0,o&&clearInterval(o),n&&n().catch(()=>{})}}watchLunch(t){let e=!1,n=null;return(async()=>{try{let o=await this.conn.subscribeMessage(i=>{e||t(i.lunch)},{type:`${Ue}/lunch/subscribe`},{resubscribe:!0});e?o().catch(()=>{}):n=o}catch{e||t(null)}})(),()=>{e=!0,n&&n().catch(()=>{})}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ue,service:t,service_data:e})}catch(n){throw An(n)}}};var Ut=globalThis,Ht=Ut.ShadowRoot&&(Ut.ShadyCSS===void 0||Ut.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Sn=Symbol(),ii=new WeakMap,bt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==Sn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Ht&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=ii.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&ii.set(e,t))}return t}toString(){return this.cssText}},oi=s=>new bt(typeof s=="string"?s:s+"",void 0,Sn),He=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,o,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new bt(e,s,Sn)},ri=(s,t)=>{if(Ht)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=Ut.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}},Mn=Ht?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return oi(e)})(s):s;var{is:Rr,defineProperty:Ir,getOwnPropertyDescriptor:Br,getOwnPropertyNames:Or,getOwnPropertySymbols:jr,getPrototypeOf:Nr}=Object,Ft=globalThis,ai=Ft.trustedTypes,zr=ai?ai.emptyScript:"",Ur=Ft.reactiveElementPolyfillSupport,xt=(s,t)=>s,Pn={toAttribute(s,t){switch(t){case Boolean:s=s?zr:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},ci=(s,t)=>!Rr(s,t),li={attribute:!0,type:String,converter:Pn,reflect:!1,useDefault:!1,hasChanged:ci};Symbol.metadata??=Symbol("metadata"),Ft.litPropertyMetadata??=new WeakMap;var Se=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=li){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&Ir(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:i}=Br(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let a=o?.call(this);i?.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??li}static _$Ei(){if(this.hasOwnProperty(xt("elementProperties")))return;let t=Nr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(xt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(xt("properties"))){let e=this.properties,n=[...Or(e),...jr(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(Mn(o))}else t!==void 0&&e.push(Mn(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ri(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:Pn).toAttribute(e,n.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=n.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Pn;this._$Em=o;let a=r.fromAttribute(e,i.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(t,e,n,o=!1,i){if(t!==void 0){let r=this.constructor;if(o===!1&&(i=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??ci)(i,e)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:i},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,i]of n){let{wrapped:r}=i,a=this[o];r!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,i,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Se.elementStyles=[],Se.shadowRootOptions={mode:"open"},Se[xt("elementProperties")]=new Map,Se[xt("finalized")]=new Map,Ur?.({ReactiveElement:Se}),(Ft.reactiveElementVersions??=[]).push("2.1.2");var Dn=globalThis,di=s=>s,Kt=Dn.trustedTypes,ui=Kt?Kt.createPolicy("lit-html",{createHTML:s=>s}):void 0,Rn="$lit$",Me=`lit$${Math.random().toFixed(9).slice(2)}$`,In="?"+Me,Hr=`<${In}>`,We=document,yt=()=>We.createComment(""),wt=s=>s===null||typeof s!="object"&&typeof s!="function",Bn=Array.isArray,bi=s=>Bn(s)||typeof s?.[Symbol.iterator]=="function",Ln=`[ 	
\f\r]`,vt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,hi=/-->/g,pi=/>/g,Fe=RegExp(`>|${Ln}(?:([^\\s"'>=/]+)(${Ln}*=${Ln}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),fi=/'/g,gi=/"/g,xi=/^(?:script|style|textarea|title)$/i,On=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),m=On(1),ce=On(2),nd=On(3),Pe=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),mi=new WeakMap,Ke=We.createTreeWalker(We,129);function vi(s,t){if(!Bn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return ui!==void 0?ui.createHTML(t):t}var yi=(s,t)=>{let e=s.length-1,n=[],o,i=t===2?"<svg>":t===3?"<math>":"",r=vt;for(let a=0;a<e;a++){let c=s[a],l,d,u=-1,h=0;for(;h<c.length&&(r.lastIndex=h,d=r.exec(c),d!==null);)h=r.lastIndex,r===vt?d[1]==="!--"?r=hi:d[1]!==void 0?r=pi:d[2]!==void 0?(xi.test(d[2])&&(o=RegExp("</"+d[2],"g")),r=Fe):d[3]!==void 0&&(r=Fe):r===Fe?d[0]===">"?(r=o??vt,u=-1):d[1]===void 0?u=-2:(u=r.lastIndex-d[2].length,l=d[1],r=d[3]===void 0?Fe:d[3]==='"'?gi:fi):r===gi||r===fi?r=Fe:r===hi||r===pi?r=vt:(r=Fe,o=void 0);let b=r===Fe&&s[a+1].startsWith("/>")?" ":"";i+=r===vt?c+Hr:u>=0?(n.push(l),c.slice(0,u)+Rn+c.slice(u)+Me+b):c+Me+(u===-2?a:b)}return[vi(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},kt=class s{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let i=0,r=0,a=t.length-1,c=this.parts,[l,d]=yi(t,e);if(this.el=s.createElement(l,n),Ke.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(o=Ke.nextNode())!==null&&c.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(let u of o.getAttributeNames())if(u.endsWith(Rn)){let h=d[r++],b=o.getAttribute(u).split(Me),C=/([.?@])?(.*)/.exec(h);c.push({type:1,index:i,name:C[2],strings:b,ctor:C[1]==="."?qt:C[1]==="?"?Vt:C[1]==="@"?Gt:Ve}),o.removeAttribute(u)}else u.startsWith(Me)&&(c.push({type:6,index:i}),o.removeAttribute(u));if(xi.test(o.tagName)){let u=o.textContent.split(Me),h=u.length-1;if(h>0){o.textContent=Kt?Kt.emptyScript:"";for(let b=0;b<h;b++)o.append(u[b],yt()),Ke.nextNode(),c.push({type:2,index:++i});o.append(u[h],yt())}}}else if(o.nodeType===8)if(o.data===In)c.push({type:2,index:i});else{let u=-1;for(;(u=o.data.indexOf(Me,u+1))!==-1;)c.push({type:7,index:i}),u+=Me.length-1}i++}}static createElement(t,e){let n=We.createElement("template");return n.innerHTML=t,n}};function qe(s,t,e=s,n){if(t===Pe)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,i=wt(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=qe(s,o._$AS(s,t.values),o,n)),t}var Wt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??We).importNode(e,!0);Ke.currentNode=o;let i=Ke.nextNode(),r=0,a=0,c=n[0];for(;c!==void 0;){if(r===c.index){let l;c.type===2?l=new st(i,i.nextSibling,this,t):c.type===1?l=new c.ctor(i,c.name,c.strings,this,t):c.type===6&&(l=new Yt(i,this,t)),this._$AV.push(l),c=n[++a]}r!==c?.index&&(i=Ke.nextNode(),r++)}return Ke.currentNode=We,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},st=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=qe(this,t,e),wt(t)?t===T||t==null||t===""?(this._$AH!==T&&this._$AR(),this._$AH=T):t!==this._$AH&&t!==Pe&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):bi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==T&&wt(this._$AH)?this._$AA.nextSibling.data=t:this.T(We.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=kt.createElement(vi(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new Wt(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=mi.get(t.strings);return e===void 0&&mi.set(t.strings,e=new kt(t)),e}k(t){Bn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let i of t)o===e.length?e.push(n=new s(this.O(yt()),this.O(yt()),this,this.options)):n=e[o],n._$AI(i),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=di(t).nextSibling;di(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ve=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,i){this.type=1,this._$AH=T,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=T}_$AI(t,e=this,n,o){let i=this.strings,r=!1;if(i===void 0)t=qe(this,t,e,0),r=!wt(t)||t!==this._$AH&&t!==Pe,r&&(this._$AH=t);else{let a=t,c,l;for(t=i[0],c=0;c<i.length-1;c++)l=qe(this,a[n+c],e,c),l===Pe&&(l=this._$AH[c]),r||=!wt(l)||l!==this._$AH[c],l===T?t=T:t!==T&&(t+=(l??"")+i[c+1]),this._$AH[c]=l}r&&!o&&this.j(t)}j(t){t===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},qt=class extends Ve{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===T?void 0:t}},Vt=class extends Ve{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==T)}},Gt=class extends Ve{constructor(t,e,n,o,i){super(t,e,n,o,i),this.type=5}_$AI(t,e=this){if((t=qe(this,t,e,0)??T)===Pe)return;let n=this._$AH,o=t===T&&n!==T||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==T&&(n===T||o);o&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Yt=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){qe(this,t)}},wi={M:Rn,P:Me,A:In,C:1,L:yi,R:Wt,D:bi,V:qe,I:st,H:Ve,N:Vt,U:Gt,B:qt,F:Yt},Fr=Dn.litHtmlPolyfillSupport;Fr?.(kt,st),(Dn.litHtmlVersions??=[]).push("3.3.3");var ki=(s,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let i=e?.renderBefore??null;n._$litPart$=o=new st(t.insertBefore(yt(),i),i,void 0,e??{})}return o._$AI(s),o};var jn=globalThis,we=class extends Se{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ki(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Pe}};we._$litElement$=!0,we.finalized=!0,jn.litElementHydrateSupport?.({LitElement:we});var Kr=jn.litElementPolyfillSupport;Kr?.({LitElement:we});(jn.litElementVersions??=[]).push("4.2.2");var $i={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ei=s=>(...t)=>({_$litDirective$:s,values:t}),Jt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Wr}=wi,_i=s=>s;var Ti=()=>document.createComment(""),it=(s,t,e)=>{let n=s._$AA.parentNode,o=t===void 0?s._$AB:t._$AA;if(e===void 0){let i=n.insertBefore(Ti(),o),r=n.insertBefore(Ti(),o);e=new Wr(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,a=r!==s;if(a){let c;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(c=s._$AU)!==r._$AU&&e._$AP(c)}if(i!==o||a){let c=e._$AA;for(;c!==i;){let l=_i(c).nextSibling;_i(n).insertBefore(c,o),c=l}}}return e},Be=(s,t,e=s)=>(s._$AI(t,e),s),qr={},Ci=(s,t=qr)=>s._$AH=t,Ai=s=>s._$AH,Xt=s=>{s._$AR(),s._$AA.remove()};var Si=(s,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(s[o],o);return n},Le=Ei(class extends Jt{constructor(s){if(super(s),s.type!==$i.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],i=[],r=0;for(let a of s)o[r]=n?n(a,r):r,i[r]=e(a,r),r++;return{values:i,keys:o}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let o=Ai(s),{values:i,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,i;let a=this.ut??=[],c=[],l,d,u=0,h=o.length-1,b=0,C=i.length-1;for(;u<=h&&b<=C;)if(o[u]===null)u++;else if(o[h]===null)h--;else if(a[u]===r[b])c[b]=Be(o[u],i[b]),u++,b++;else if(a[h]===r[C])c[C]=Be(o[h],i[C]),h--,C--;else if(a[u]===r[C])c[C]=Be(o[u],i[C]),it(s,c[C+1],o[u]),u++,C--;else if(a[h]===r[b])c[b]=Be(o[h],i[b]),it(s,o[u],o[h]),h--,b++;else if(l===void 0&&(l=Si(r,b,C),d=Si(a,u,h)),l.has(a[u]))if(l.has(a[h])){let f=d.get(r[b]),w=f!==void 0?o[f]:null;if(w===null){let A=it(s,o[u]);Be(A,i[b]),c[b]=A}else c[b]=Be(w,i[b]),it(s,o[u],w),o[f]=null;b++}else Xt(o[h]),h--;else Xt(o[u]),u++;for(;b<=C;){let f=it(s,c[C+1]);Be(f,i[b]),c[b++]=f}for(;u<=h;){let f=o[u++];f!==null&&Xt(f)}return this.ut=r,Ci(s,c),Pe}});var Zt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function de(s){return Zt[(s%Zt.length+Zt.length)%Zt.length]}var Qt="#23272E",Nn="35,39,46";var Vr=3,rn=36,zn=12,en=8,Mi=30,_e=16,$t=100,Hn=60,Fn=10,tn=30,Kn=10,Gr=150,Yr=200,on=1.4;function Wn(s,t){let e=Math.max(Gr,Yr/on);return Math.ceil(Hn+Math.max(0,s-1)*Fn+tn+Math.max(0,t-1)*Kn+e*(s+on*t))}function De(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function Re(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function ve(s){return new Map(De(s).map((t,e)=>[t,de(e)]))}function ye(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function me(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function qn(s,t){return t==="none"?"Not needed":Re(s).includes(t)?me(s,t):t}function an(s,t){return t.own?me(s,t.own):ye(s,t.kid)}var ln={color:Qt,rgb:Nn,ink:Qt};function Ni(s,t){return t.own?ln:ve(s).get(t.kid)??de(0)}function Jr(s,t){let e=De(s);return t.along.map(n=>e.includes(n)?ye(s,n):me(s,n))}function Vn(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function Xr(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function nn(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function Un(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(nn(t,n.from)),e.push(nn(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(nn(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Zr(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,a)=>r.s-a.s||a.en-r.en),e=[],n=[],o=-1/0,i=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(i(),o=-1/0);let a=n.findIndex(c=>c<=r.s);a<0?(a=n.length,n.push(r.en)):n[a]=r.en,r.col=a,e.push(r),o=Math.max(o,r.en)}return i(),t}function Qr(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return s[s.length-1].y}function ea(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return s[s.length-1].t}function zi(s,t){return Qr(s.anchors,t)}function Ui(s,t){return ea(s.anchors,t)}function ta(s,t){let e=De(s),n=Re(s),o=Math.max(t,Wn(e.length,n.length)),r=(o-Hn-Math.max(0,e.length-1)*Fn-tn-Math.max(0,n.length-1)*Kn)/(e.length+on*n.length||1),a=Math.floor(r),c=Math.floor(r*on),l=new Map;for(let C of s.days)for(let f of C.events)for(let w of f.own?f.along:[f.kid]){let A=l.get(w)??[];A.some(x=>x.event_id===f.event_id&&x.calendar_id===f.calendar_id)||A.push(f),l.set(w,A)}let d=ve(s),u=[],h=Hn;e.forEach((C,f)=>{let w=l.get(C)??[],A=s.days.some(x=>x.events.some(B=>B.kid===C&&(B.sides.includes("drop")&&B.drop===""||B.sides.includes("pick")&&B.pick==="")));u.push({id:C,kind:"kid",x:h,w:a,name:ye(s,C),dot:d.get(C).color,rgb:d.get(C).rgb,sub:`${A?"Needs a ride · ":""}${w.length} this week`,subWarn:A}),h+=a+(f<e.length-1?Fn:0)});let b=h+tn/2;return h+=tn,n.forEach((C,f)=>{let w=0,A=0;for(let x of s.days){let B=x.drivers[C];B&&(w+=B.outings.length,A+=B.drive??0)}u.push({id:C,kind:"driver",x:h,w:c,name:me(s,C),dot:Qt,rgb:Nn,sub:`${w} ${w===1?"trip":"trips"} this week · ${mt(A)} driving`,subWarn:!1}),h+=c+(f<n.length-1?Kn:0)}),{columns:u,sepX:b,width:o}}function na(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function Pi(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${U(s.start)}`:e||!t?`${s.title} until ${U(s.end)}`:`${s.title} ${U(s.start)}–${U(s.end)}`}function Gn(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length}function Yn(s,t){let e=Ee(t,s);return e===0?"Today":e===1?"Tomorrow":""}function ue(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Li(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),o=1,i=0;for(let r of s.split(/\s+/).filter(Boolean)){let a=r.length;for(i===0?i=a:i+1+a<=n?i+=1+a:(o++,i=a);i>n;)o++,i-=n}return o}var Hi=25,sa=15,Fi=3;function Di(s){return Math.max(0,Math.min(Fi,Math.floor((s-Hi)/sa)))}var ia=Hi+2,Ri=20;function Ii(s){return/^(\d+:\d\d)\s+Home$/.exec(s.at(-1)??"")?.[1]??null}var sn="🚗";function Bi(s,t){if(s===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,i,r,a=!1)=>({at:o,who:i,stays:a,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(s))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(s))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(s))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}return null}var Oi={muted:0,normal:1,pending:2,problem:3};function Ki(s){let{drop:t,pick:e}=s,n=t?Bi(t.text,"drop"):null,o=e?Bi(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return s;let i=[t,e].reduce((c,l)=>l&&(Oi[l.tone]??1)>(Oi[c]??1)?l.tone:c,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${sn} No rides yet`,tone:i},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let c=`${sn} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${c} both ways`,tone:i},pick:null}:{drop:{text:`${c} ↓${n.at} ↑${o.at}`.trimEnd(),tone:i},pick:null}}let r=(c,l)=>c==="needed"?`${l} needed`:`${l}${c.at?`${c.at} `:" "}${c.who}${c.stays?" stays":""}${c.extra}`,a=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${sn} ${a.join(" · ")}`,tone:i},pick:null}}function ji(s,t){let e=t-23,n=`${U(s.start)}–${U(s.end)}`+(s.arrive_by!=null?` · arrive ${U(s.arrive_by)}`:""),o=33+Li(n,e,6.6)*16,i=s.own?s.lines:Ki(s.lines);for(let r of[i.drop,i.pick])r&&(o+=2+Li(r.text,e,7)*16);return o+4}function Wi(s,t,e,n){let o=t==="compact",{columns:i,sepX:r,width:a}=ta(s,e),c=new Map(i.map(x=>[x.id,x])),l=De(s),d=Re(s),u=[...l,...d],h=ve(s),b=Xr(s),C=x=>ye(s,x),f=x=>me(s,x),w={mode:t,width:a,height:0,columns:i,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},A=0;return s.days.forEach((x,B)=>{let X=B*1440,H=new Map(x.events.map(g=>[g.id,g])),he=g=>g&&H.has(g)?{day:x.date,event:g}:null,v=Gn(x),E=x.events.length,y=Yn(x.date,n.date);w.dayHeads.push({date:x.date,y:A,label:$e(x.date),tag:y,sub:(E?`${E} ${E===1?"activity":"activities"}`:"Nothing scheduled")+(v?` · ${v} to sort out`:""),warn:v>0}),w.anchors.push({t:X,y:A});let k=A+rn+zn,$=d.flatMap(g=>x.drivers[g]?.outings??[]);if(!E&&!$.length){w.empties.push({key:x.date,y:k,text:"Nothing planned"}),A=k+40,w.anchors.push({t:X+1439,y:A});return}let M=(g,D,N,R,K,ee,p,_=g.kid)=>{let I=!!g.own&&_===g.own,z=!!g.own&&_!==g.own,V=I?ln:h.get(_)??de(0),se=I?f(_):C(_),ie=z?{drop:{text:`With ${f(g.own)}`,tone:g.attending===!1?"muted":"normal"},pick:null}:p&&!g.own?Ki(g.lines):g.lines,L=I?Jr(s,g):[],ae=(g.takes!=null?`${g.takes} min, any time ${U(g.start)}–${U(g.end)}`:`${U(g.start)}–${U(g.end)}`+(g.arrive_by!=null?` · arrive ${U(g.arrive_by)}`:""))+(L.length?` · with ${Vn(L)}`:"");return{key:`${x.date}|card|${g.id}`+(g.own?`|${_}`:""),x:D,y:N,w:R,h:K,target:{day:x.date,event:g.id},event:g,color:V,kidName:se,clash:ee,stayed:!g.own&&g.stay&&d.includes(g.drop),skipped:g.attending===!1,title:na(g.title,se),time:ae,drop:ie.drop,pick:ie.pick,showDrop:!!ie.drop&&(p||K>=56),showPick:!!ie.pick&&(p||K>=74),wrap:p,aria:`${se}, ${g.title} ${g.takes!=null?`any time from ${U(g.start)} to ${U(g.end)}`:`${U(g.start)} to ${U(g.end)}`}. `+(g.attending===!1&&!ie.drop?"Not attending. ":"")+[ie.drop,ie.pick].filter(P=>!!P).map(P=>P.text).join(". ")}},O=g=>{let D=x.rides[g];return D?(x.drivers[D.driver]?.segments??[]).filter(R=>R.type!=="home"&&R.kids.includes(D.kid)&&ue(R.start)>=ue(D.start)&&ue(R.end)<=ue(D.end)):[]},q=g=>{let D=x.rides[g];if(!D)return null;let N=D.serves.find(R=>H.get(R)?.kid===D.kid);return he(N??D.serves[0])},Z=(g,D)=>{if(D.event)return D;let N=x.events.find(R=>R.own&&R.own!==g&&R.along.includes(g)&&R.title===D.title);return N?{...D,title:`${D.title} with ${f(N.own)}`}:D},Q=g=>{if(g.takes==null)return[g.start,g.end];let D=g.planned??g.start;return[D,D+g.takes]},j=new Map;for(let g of x.issues)g.level!=="problem"||!g.event||(g.kind==="late"&&j.set(g.event,`${Math.round(ue(g.minutes))} min late`),g.kind==="waiting"&&j.set(`${g.event}|pick`,`Waits ${Math.round(ue(g.minutes))} min`));if(!o){let g=1/0,D=-1/0;for(let p of x.events)p.start<=0&&p.end>=1440||(p.start>0?g=Math.min(g,p.start-20,p.arrive_by!=null?p.arrive_by-10:1/0):g=Math.min(g,p.end-30),p.end<1440?D=Math.max(D,p.end+20):D=Math.max(D,p.start+30));for(let p of $)p.start!=null&&(g=Math.min(g,p.start)),p.end!=null&&(D=Math.max(D,p.end));x.date===n.date&&Number.isFinite(g)&&n.minutes>g-60&&n.minutes<D&&(g=Math.min(g,n.minutes-15));let N=Number.isFinite(g)?Math.floor((g-5)/30)*30:900,R=Number.isFinite(D)?Math.ceil((D+5)/30)*30:960,K=p=>Math.round(k+(Math.max(N,Math.min(R,p))-N)*Vr);w.anchors.push({t:X+N,y:K(N)},{t:X+R,y:K(R)});for(let p of l){let _=c.get(p),I=h.get(p),z=(x.kids[p]?.items??[]).filter(P=>P.start!=null&&P.end!=null).map(P=>({item:P,s:ue(P.start),en:ue(P.end)})),V=[];for(let P of Zr(z)){let F=_.w/P.cols,G=Math.round(_.x+P.col*F),te=Math.round(F-(P.cols>1?4:0)),re=K(P.s),ne=P.item;if(ne.type==="act"){let xe=H.get(ne.event??"");if(!xe)continue;let Rt=Math.max(30,K(P.en)-re),It=M(xe,G,re,te,Rt,ne.clash,!1,p);if(It.layer=$t,w.cards.push(It),xe.arrive_by!=null&&xe.start-xe.arrive_by>=5){let En=K(xe.arrive_by),Ns={key:`${x.date}|prep|${xe.id}`,x:G,y:En,w:te,h:re-En+_e,color:I,label:`Arrive by ${U(xe.arrive_by)}`,layer:$t-1};w.preps.push(Ns),V.push({s:xe.arrive_by,en:P.en,top:En,bottom:re+Rt,x:G,w:te,prep:Ns,card:It})}else V.push({s:P.s,en:P.en,top:re,bottom:re+Rt,x:G,w:te,card:It});let Os=j.get(xe.id);Os&&w.marks.push({key:`${x.date}|late|${xe.id}`,x:G+te-4,y:re+4,text:Os,right:!0});let js=j.get(`${xe.id}|pick`);js&&w.marks.push({key:`${x.date}|wait|${xe.id}`,x:G+4,y:re+Rt+2,text:js,right:!1});continue}let J=x.rides[ne.ride??-1];if(!J)continue;let ke=Math.max(22,K(P.en)-re),pt=Un(O(J.index),b),Rs=f(J.driver),Is={key:`${x.date}|ride|${J.index}`,x:G,y:re,w:te,h:ke,target:q(J.index),l1:`${J.own?"In":"Along in"} ${Rs}’s car`,l2:pt.join(" → "),show2:Di(ke)>0,lines2:Di(ke),dashed:!J.own,clash:ne.clash,aria:`${C(p)} ${J.own?"in":"riding along in"} ${Rs}’s car, ${U(ue(J.start))} to ${U(ue(J.end))}: ${pt.join(" to ")}`};w.rides.push(Is);let Bs=c.get(J.driver),$n=null;Bs&&($n={key:`${x.date}|band|${J.index}`,x:G+te,y:re,w:Math.max(0,Bs.x+8-(G+te)),h:ke,color:I},w.bands.push($n)),V.push({s:P.s,en:P.en,top:re,bottom:re+ke,x:G,w:te,ride:Is,band:$n})}let se=P=>P.ride?.layer??(P.prep?$t-1:$t),ie=(P,F,G,te)=>{G>_e&&w.links.push({key:`${P.key}|link`,x:P.x,y:F,w:P.w,h:G,color:I,layer:te})},L=(P,F)=>{if(!(F.x<P.x||F.x+F.w>P.x+P.w)&&(P.x=F.x,P.w=F.w,P.ride.x=F.x,P.ride.w=F.w,P.band)){let G=P.band.x+P.band.w;P.band.x=F.x+F.w,P.band.w=Math.max(0,G-P.band.x)}},ae=new Set;for(let P of[...V].sort((F,G)=>G.s-F.s)){let F=P.ride;if(!F)continue;let G=V.filter(ne=>ne!==P&&ne.s>=P.en&&ne.s-P.en<=Mi&&ne.top>=P.bottom).sort((ne,J)=>ne.s-J.s||ne.top-J.top)[0];if(!G)continue;ae.add(P),L(P,G);let te=se(G),re=G.top-P.bottom;ie(F,P.bottom,re+_e,te-1),F.layer=te-(re>0?2:1),F.h+=_e,F.tuckBottom=_e}for(let P of[...V].sort((F,G)=>F.s-G.s)){let F=P.ride;if(!F||ae.has(P))continue;let G=V.filter(ne=>ne!==P&&ne.en<=P.s&&P.s-ne.en<=Mi&&ne.bottom<=P.top&&(ne.card||ne.ride?.layer!=null)).sort((ne,J)=>J.en-ne.en||J.bottom-ne.bottom)[0];if(!G)continue;L(P,G);let te=G.ride?.layer??$t,re=P.top-G.bottom;ie(F,G.bottom-_e,re+_e,te-1),F.layer=te-(re>0?2:1),F.y-=_e,F.h+=_e,F.tuckTop=_e}}for(let p of d){let _=c.get(p),I=x.drivers[p];if(!I)continue;let z=[],V=null;for(let L of I.segments)if(!(L.start==null||L.end==null)){if(L.type==="home"){V=null;continue}if(L.type==="stay"){V=null,z.push({type:"stay",g:L,s:L.start,en:L.end});continue}V&&V.en===L.start?(V.en=L.end,V.legs.push(L)):(V={type:"trip",s:L.start,en:L.end,legs:[L]},z.push(V))}let se=new Set,ie=(L,ae,P,F)=>{se.add(L.id);let G=K(ae),te=M(L,_.x+8,G,_.w-16,Math.max(30,K(P)-G),!1,!1,p);F&&te.drop?.tone==="normal"&&(te.drop=null,te.showDrop=!1),w.cards.push(te)};for(let L of z){let ae=K(L.s),P=Math.max(24,K(L.en)-ae);if(L.type==="stay"){let J=H.get(L.g.event??L.g.serves??"");if(J?.own===p){ie(J,L.s,L.en,!0);continue}let ke=J?h.get(J.kid)??de(0):de(0),pt=L.g.kids.map(C);w.stays.push({key:`${x.date}|stay|${p}|${L.s}`,x:_.x+8,y:ae,w:_.w-16,h:P,target:he(J?.id),color:ke,l1:J?`At ${J.title} with ${C(J.kid)}`:"Staying",l2:`until ${U(L.en)}`+(pt.length?` · ${pt.join(" and ")} too`:"")});continue}let F=L.legs[0],G=L.legs[L.legs.length-1],te=[];for(let J of L.legs)for(let ke of J.kids)te.includes(ke)||te.push(ke);let re=G.type==="drive"&&G.to==="home",ne=Un(L.legs,b);w.trips.push({key:`${x.date}|trip|${p}|${L.s}`,x:_.x+8,y:ae,w:_.w-16,h:P,target:he(L.legs.find(J=>J.serves)?.serves),l1:F.type==="drive"&&F.from==="home"?`Leave ${U(L.s)}`:`From ${nn(b,F.from??F.place)} ${U(L.s)}`,l2:ne.join(" → "),show2:P>=36,l3:re?`Home ${U(L.en)}`:"",show3:re&&P>=62,stops:null,kids:te.map(J=>(h.get(J)??de(0)).color),bad:L.legs.some(J=>J.overlaps_busy),aria:`${f(p)} drives ${ne.join(" to ")}, ${U(L.s)} to ${U(L.en)}`})}for(let L of I.segments)if(!(!L.overlaps_busy||L.start==null||L.end==null))for(let ae of I.busy){let P=Math.max(L.start,ae.start),F=Math.min(L.end,ae.end);F<=P||w.overlaps.push({key:`${x.date}|overlap|${p}|${P}`,x:_.x+6,y:K(P)-2,w:_.w-12,h:Math.max(8,K(F)-K(P)+4)})}for(let L of x.events)if(L.own===p&&(se.has(L.id)||ie(L,...Q(L),!1),L.takes!=null&&L.attending!==!1)){let ae=K(L.start);w.windows.push({key:`${x.date}|window|${L.id}`,x:_.x+4,y:ae,w:_.w-8,h:Math.max(24,K(L.end)-ae),label:`${L.title} · any time ${U(L.start)}–${U(L.end)}`})}for(let L of I.busy){if(L.event||L.end<=N||L.start>=R)continue;let ae=Z(p,L),P=K(ae.start),F=K(ae.end);w.busy.push({key:`${x.date}|busy|${p}|${ae.start}`,x:_.x+1,y:P,w:_.w-2,h:F-P,labelY:8,label:Pi(ae,!1)})}}let ee=-1/0;for(let p=N;p<=R;p+=30)w.grid.push({key:`${x.date}|grid|${p}`,y:K(p),strong:p%60===0}),p%60===0&&K(p)-ee>=22&&(w.hours.push({key:`${x.date}|hour|${p}`,y:K(p)-8,label:ti(p)}),ee=K(p));x.date===n.date&&n.minutes>N&&n.minutes<R&&(w.now={y:K(n.minutes),label:`Now ${U(n.minutes)}`}),A=K(R)+zn;return}let S=[];for(let g of l){let D=c.get(g);for(let N of x.kids[g]?.items??[])if(N.start!=null){if(N.type==="act"){let R=H.get(N.event??"");if(!R)continue;S.push({col:g,s:N.start,h:ji(R,D.w),kind:"act",item:N})}else if(!x.rides[N.ride??-1]?.own){let R=x.rides[N.ride??-1],K=R?x.drivers[R.driver]?.outings.find(ee=>ee.start!=null&&ee.start<=ue(R.start)&&ue(R.start)<=ue(ee.end,ee.start)):void 0;S.push({col:g,s:K?.start??N.start,h:ia,kind:"along",item:N})}}}for(let g of d){let D=x.drivers[g];if(!D)continue;for(let R of D.busy)R.event||S.push({col:g,s:R.start,h:32,kind:"busy",busy:Z(g,R)});let N=c.get(g).w;for(let R of x.events)R.own!==g||R.attending!==!1&&(R.takes==null||R.planned!=null)||S.push({col:g,s:Q(R)[0],h:ji(R,N),kind:"own",event:R});for(let R of D.outings){if(R.start==null)continue;let K=R.lines.length-(Ii(R.lines)?1:0);S.push({col:g,s:R.start,h:30+K*16+(R.warn?16:0),kind:"out",out:R})}}S.sort((g,D)=>g.s-D.s||u.indexOf(g.col)-u.indexOf(D.col));let Y=new Map,W=[],ge=new Map,be=k-Ri;for(let g=0;g<S.length;){let D=g,N=be+Ri;for(;D<S.length&&S[D].s===S[g].s;D++){let K=Y.get(S[D].col);K!=null&&(N=Math.max(N,K+en))}let R=new Set;for(let K=g;K<D;K++){let ee=S[K],p=R.has(ee.col)?Y.get(ee.col)+en:N;R.add(ee.col),Y.set(ee.col,p+ee.h)}ge.set(S[g].s,N),S[g].s>0&&w.hours.push({key:`${x.date}|hour|${S[g].s}`,y:N+2,label:ze(S[g].s)}),be=N,g=D}Y.clear(),S.forEach((g,D)=>{let N=Y.get(g.col),R=Math.max(N!=null?N+en:k,ge.get(g.s));Y.set(g.col,R+g.h);let K=g.kind==="busy"?g.busy.end:g.kind==="act"?H.get(g.item.event??"")?.end??null:g.kind==="own"?Q(g.event)[1]:null;W.push({col:g.col,s:g.s,end:K,y:R,h:g.h,box:null}),w.anchors.push({t:X+g.s,y:R});let ee=c.get(g.col);if(g.kind==="busy"){let p={key:`${x.date}|busy|${g.col}|${D}`,x:ee.x+1,y:R,w:ee.w-2,h:g.h,labelY:8,label:Pi(g.busy,!0)};w.busy.push(p),W[W.length-1].box=p}else if(g.kind==="out"){let p=g.out,_=Ii(p.lines),I=_?p.lines.slice(0,-1):p.lines;w.trips.push({key:`${x.date}|trip|${g.col}|${D}`,x:ee.x+8,y:R,w:ee.w-16,h:g.h,target:he(p.target),l1:_?`${p.lead} · home ${_}`:p.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...I.map(z=>({text:z,warn:!1})),...p.warn?[{text:p.warn,warn:!0}]:[]],kids:p.kids.map(z=>(h.get(z)??de(0)).color),bad:!!p.warn,aria:`${f(g.col)}: ${p.lead}. ${p.lines.join(". ")}${p.warn?`. ${p.warn}`:""}`})}else if(g.kind==="own"){let p=M(g.event,ee.x+8,R,ee.w-16,g.h,!1,!0,g.col);w.cards.push(p),W[W.length-1].box=p}else if(g.kind==="act"){let p=H.get(g.item.event??""),_=M(p,ee.x,R,ee.w,g.h,g.item.clash,!0,g.col);w.cards.push(_),W[W.length-1].box=_}else{let p=x.rides[g.item.ride??-1],_=Un(O(p.index),b),I=f(p.driver);w.rides.push({key:`${x.date}|ride|${p.index}`,x:ee.x,y:R,w:ee.w,h:g.h,target:q(p.index),l1:`${sn} with ${I}`,l2:_.join(" → "),show2:!1,lines2:Fi,dashed:!0,clash:g.item.clash,aria:`${C(g.col)} riding along with ${I}, ${U(ue(p.start))} to ${U(ue(p.end))}: ${_.join(" to ")}`})}});let oe=k;for(let g of Y.values())oe=Math.max(oe,g);for(let g of W){if(!g.box||g.end==null)continue;let D=g.y+g.h;for(let N of W)N.col!==g.col&&N.s>=g.s&&N.s<g.end&&(D=Math.max(D,N.y+N.h));g.end>=1440&&(D=oe);for(let N of W)N.col===g.col&&N.y>g.y&&(D=Math.min(D,N.y-en));D=Math.min(D,oe),D>g.y+g.h&&(g.box.h=D-g.y)}A=oe+zn+6,w.anchors.push({t:X+1439,y:A})}),w.height=A,w}var oa=["","¼","½","¾"];function Ge(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return mt(n);let o=Math.round(n*4),i=Math.floor(o/4),r=oa[o%4];return`${i||!r?i:""}${r} min`})}function qi(s){let t=e=>e?{...e,text:Ge(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(Ge),warn:i.warn==null?i.warn:Ge(i.warn)}))}])),issues:e.issues.map(n=>({...n,title:Ge(n.title),body:Ge(n.body),note:n.note==null?n.note:Ge(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:Ge(o.note)}))}:{}}))}))}}var ra=2,aa=48;function Vi(s,t,e=aa){let n=[],o=0,i=0,r=0,a=0,c=t.minutes+e*60;for(let l of s.days){let d=Ee(t.date,l.date),u=d===0?"":`${fe(l.date)} · `,h=new Map(l.events.map(f=>[f.id,f])),b=f=>f&&h.has(f)?{day:l.date,event:f}:null,C=(f,w)=>d*1440+(f??h.get(w??"")?.start??0)<c;for(let f of l.issues)if(f.level==="problem"){if(!C(f.at,f.event)){r++,f.kind==="unassigned"&&a++;continue}o++,f.kind==="unassigned"&&i++,n.push({key:`${l.date}|${f.key}`,tone:f.kind==="unassigned"?"unassigned":"problem",title:u+f.title,body:f.body,target:b(f.event),suggestions:(f.suggestions??[]).map(w=>({id:w.id,label:w.label,note:w.note}))})}if(l.clashes.forEach((f,w)=>{if(!C(f.a.start,f.a.event)){r++;return}o++;let A=h.get(f.a.event??""),x=ye(s,f.kid),B=(H,he)=>{let v=b(he);return v?{text:H,target:v}:H},X=[];if(f.b.type==="act"){let H=h.get(f.b.event??"");A&&H&&(X=[B(A.title,A.id),` ${U(A.start)}–${U(A.end)} and `,B(H.title,H.id),` ${U(H.start)}–${U(H.end)} overlap.`])}else{let H=l.rides[f.b.ride??-1];A&&H&&(X=[`${x} is in `,B(`${me(s,H.driver)}’s car`,H.serves[0]),` ${U(ue(f.b.start))}–${U(ue(f.b.end))}, during `,B(A.title,A.id),"."])}n.push({key:`${l.date}|clash|${w}`,tone:"problem",title:`${u}${x} is double-booked`,body:X.map(H=>typeof H=="string"?H:H.text).join(""),parts:X,target:null,suggestions:[]})}),d>=0&&d<ra)for(let f of l.issues)f.level!=="heads_up"||!C(f.at,f.event)||n.push({key:`${l.date}|${f.key}`,tone:"heads_up",title:u+f.title,body:f.body,target:b(f.event),suggestions:[]});for(let f of l.events)!f.problems.length||!C(f.start)||n.push({key:`${l.date}|notes|${f.id}`,tone:"heads_up",title:`${u}Check the notes on ${an(s,f)}’s ${f.title}`,body:`These lines couldn’t be read: ${f.problems.join("; ")}`,target:b(f.id),suggestions:[]})}return{items:n,problems:o,unassigned:i,later:r,laterUnassigned:a}}function Gi(s,t){let e=ve(s),n=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=Ee(t.date,i.date);if(!(r<0))for(let a of Re(s))for(let c of i.drivers[a]?.outings??[]){if(c.start==null)continue;let l=r*1440+c.start;if(r*1440+ue(c.end,c.start)<=t.minutes)continue;let u=l-t.minutes,h={driver:a,name:me(s,a),date:i.date,ahead:r,start:c.start,inMinutes:u,ongoing:u<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(b=>e.get(b)??de(0)),warn:c.warn,target:c.target&&i.events.some(b=>b.id===c.target)?{day:i.date,event:c.target}:null};(!n||o(h)<o(n)||o(h)===o(n)&&h.inMinutes<n.inMinutes)&&(n=h)}}return n}function ot(s){return s.state==="done"||s.state==="late"}var la=780;function ca(s,t,e){return s.state==="open"&&!!s.for_day&&s.due===t&&e<la}function Yi(s,t){return s.chores.map(e=>ca(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function Ji(s){return s.state==="open"||s.state==="overdue"}function Zn(s,t,e){if(ot(s)){let n=s.done_at?da(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${Jn(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${Jn(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let o=Ee(t,s.due);return`By ${o===1?"tomorrow":o<7?fe(s.due):Xn(s.due)}`}if(s.for_day&&s.due===t)return`Tonight · for ${Jn(s.for_day,t)}`;if(s.due&&s.due>t){let n=Ee(t,s.due);return n===1?"By tomorrow":`By ${n<7?fe(s.due):Xn(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function Jn(s,t){let e=Ee(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?fe(s):Xn(s)}function Xn(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function da(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let i=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return i===t?r:`${fe(i)} ${r}`}function Xi(s,t,e=1440){let n=Yi(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=n.filter(d=>d.kid===o.id),a=new Map;for(let d of r){if(d.state!=="upcoming")continue;let u=d.shows_from??d.due??s.today;a.set(u,[...a.get(u)??[],d])}let c=r.filter(d=>d.state==="overdue"),l=r.filter(d=>d.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??de(i),overdue:c,now:l,done:r.filter(ot),later:[...a.entries()].sort(([d],[u])=>d.localeCompare(u)).map(([d,u])=>({date:d,chores:u})),left:c.length+l.length}})}function Zi(s,t=1440){return Yi(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function Qn(s){return!s.chores.length&&!s.templates.length}var Ye=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function es(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,i]=n.split("-").map(r=>Ye.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function ts(s){let t=[...new Set(s)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${Ye[n[0]]}-${Ye[n.at(-1)]}`]:n.map(o=>Ye[o])).join(", ")}var Je="none";function cn(s){return s==="daily"||s==="school"?"":"Any"}function Qi(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function eo(s){let t=s.days??cn(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function ns(s){return s.title.trim()?s.who.length?s.days===Je?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function to(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function ss(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function is(s,t,e=1,n=!1,o=!1){if(s==="school"){let d=t.trim().replace(/-/g,"–"),u=o?d?`${d} Bring lunch days`:"Bring lunch days":d?`${d} school days`:"Every school day";return n?`${u}, the night before`:u}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,a=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(a))return e>1?`Every day, every ${e} weeks`:"Every day";if(!a||a.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${a.replace(/-/g,"–")} ${r}`;let l=`${a.split(",").map(d=>{let u=d.trim();return u.toLowerCase()==="last"?"the last day":/^\d+$/.test(u)?`the ${ss(Number(u))}`:`the ${u}`}).join(" and ")} ${r}`;return l[0].toUpperCase()+l.slice(1)}function os(s,t,e=!1){let n=s.map(i=>t.find(r=>r.id===i)?.name??i);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function rs(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function dn(s,t){return`${s}|${t}`}function rt(s,t){let[e,n,o]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function un(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function no(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function so(s,t){return un(t)<5&&!no(s,t)}function Et(s,t,e=new Map){if(!so(s,t))return null;let n=dn(s.id,t);if(e.has(n)){let i=e.get(n);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[t];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function at(s,t){return so(s,t)?s.menus?.[t]??null:null}var ua="From the school's menu feed.";function ha(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==ua);return t.length?t.join(`
`):null}function Te(s){return s.slice(0,7)}function hn(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function as(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function io(s){let t=[];for(let e=Te(s.first);e<=Te(s.last);e=as(e))t.push(e);return t}function oo(s,t,e,n=new Map){let o=`${e}-01`,i=rt(o,-un(o)),r=[];for(;Te(i)<=e;){let a=[];for(let c=0;c<5;c++){let l=rt(i,c),d=Te(l)!==e,u=d?null:no(t,l),h=d?null:Et(t,l,n);a.push({date:l,day:Number(l.slice(8)),outside:d,off:u?u.title:null,lunch:h?.lunch??null,picked:h?.picked??!1,menu:d?null:at(t,l)?.dish??null,sides:d?null:ha(at(t,l)?.details??""),past:l<s.today,today:l===s.today})}a.some(c=>!c.outside)&&r.push(a),i=rt(i,7)}return r}function ro(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function ao(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function lo(s,t,e,n=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=rt(t,i),a=Et(s,r,n);if(!a)continue;let c=Ee(t,r);return{lunch:a.lunch,when:c===0?"today":c===1?"tomorrow":fe(r),date:r,menu:at(s,r)?.dish??null}}return null}var pa={timeline:"timeline",full:"timeline",compact:"compact"};function _t(s){let t=new URLSearchParams(s),e={},n=pa[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),e}var fa=["auth_callback","code","state"];function ls(s){let t=new URLSearchParams(s);for(let n of fa)t.delete(n);let e=t.toString();return e?`?${e}`:""}var co=He`
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
`;var Yo="mydashlight.rides.mode",ql=1100,Vl=440,Gl=700,Yl=3*6e4,Jl=1200;function Xl(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var wn=ce`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,Wo=ce`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Zl=new URL("emoji.json",import.meta.url).href,qo=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],Vo=ce`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Go=ce`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Ql=ce`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,ec=ce`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,At={bring:"Bring",buy:"Buy"};function tc(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function Ae(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function As(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function nc(s,t){return Yn(s,t)||$e(s).split(",")[0]}function sc(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function ic(){try{return localStorage.getItem(Yo)==="compact"?"compact":"timeline"}catch{return"timeline"}}function oc(s){try{localStorage.setItem(Yo,s)}catch{}}function kn(s){return s.days.every(t=>!t.events.length)}var St=class extends we{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=_t(location.search).view;this.urlPage=_t(location.search).page;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,i=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(i)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}n.el.scrollTop=n.top-i,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Yl))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??ic(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,a]=o.split("|"),c=e.kids.find(l=>l.id===r);(!c||(c.picks[a]??null)===i||!Et(c,a))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&ot(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(i=>i.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=qi(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<ql)return!1;let e=this.plan;return!e||this.width-Vl>=Wn(De(e).length,Re(e).length)}today(){return gt(this.plan?.time_zone??Xl())}currentBoard(){let e=this.plan;if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;return(this.board==null||e!==this.boardPlan||o!==this.boardKey)&&(this.board=Wi(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n){let o=this.scroller;if(!o||!this.board)return;let i=this.board.dayHeads.find(r=>r.date===n)?.y??0;o.scrollTop=Math.max(i,zi(this.board,e)-rn-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),n=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(n*1440+(this.mode==="timeline"&&n===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[n]?.date)}goToDay(e){let n=this.plan;if(!n)return;let o=this.today();if(e===o.date){this.scrollToNow();return}let i=this.dayIndexOf(e),r=n.days[i];if(!r)return;let a=1/0;if(this.mode==="timeline"){for(let c of r.events)a=Math.min(a,c.arrive_by??c.start);for(let c of Object.values(r.drivers))for(let l of c.outings)l.start!=null&&(a=Math.min(a,l.start))}this.scrollToTime(i*1440+(Number.isFinite(a)?Math.max(0,a-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let l of this.board.dayHeads)l.y<=n+1&&(o=l);let i=this.renderRoot,r=i.querySelector(".pinned .label"),a=i.querySelector(".pinned .tag"),c=i.querySelector(".pinned .sub");r&&r.textContent!==o.label&&(r.textContent=o.label),a&&(a.textContent!==o.tag&&(a.textContent=o.tag),a.hidden=!o.tag),c&&c.textContent!==o.sub&&(c.textContent=o.sub),c?.classList.toggle("warn",o.warn);for(let l of i.querySelectorAll(".day-tile"))l.classList.toggle("in-view",l.dataset.date===o.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,o),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let a=new Map(this.choreDraft);a.delete(e.id),this.choreDraft=a;let c=r instanceof le?r:new le("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??ot(e)}editMenu(e,n){let o=this.lunch?.kids??[],i=at(e,n),r=o.filter(a=>a.id===e.id||i&&at(a,n)?.dish===i.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let i=o instanceof le?o:new le("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let i=new Map(this.lunchDraft);for(let r of n)i.set(dn(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,n,o)}catch(r){let a=new Map(this.lunchDraft);for(let l of n)a.delete(dn(e,l));this.lunchDraft=a;let c=r instanceof le?r:new le("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?eo(e):Qi(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(Ko(),Fo))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||ns(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(to(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof le?n:new le("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof le?n:new le("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller;this.keepAt=n&&this.board?Ui(this.board,n.scrollTop+rn+4):null,this.mode=e,this.urlView||oc(e)}findEvent(e){let n=this.plan?.days.find(i=>i.date===e.day),o=n?.events.find(i=>i.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(i){let r=i instanceof le?i:new le("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o){if(!this.backend)return;let i=this.backend;this.save(`${n}`,o,()=>i.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e){if(!this.backend)return;let n=this.backend;this.save("stay",!e.stay,()=>n.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,a=r.includes(n)?r.filter(c=>c!==n):[...r,n];this.save(`along-${o}`,a,()=>i.setTakeAlong(e.id,a,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,i;n<0?i=(o??e.start)-5:i=o==null||o+5>=e.start?null:o+5,this.arriveDraft=i,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Jl)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,a)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=e?Vi(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},i=this.wide,r=this.chores?Zi(this.chores,this.today().minutes).filter(u=>!this.choreDone(u)):[],a=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,c=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",l=m`<aside class="panel" aria-label=${c}>
      ${a??(this.sel&&e?this.renderEditor(e):this.renderAttention(o,r))}
    </aside>`,d=this.page==="rides";return m`
      <div class="app ${i?"wide":this.width<Gl?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,o,r.length)} ${d&&e?this.renderWeek(e):T}
          ${d?this.renderBanner(e):T}
          <main>
            ${d?m`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?kn(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                </section>`:this.page==="lunch"?m`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:m`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!i&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?m`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${l}`:T}
          </main>
        </div>
        ${i?l:T}
        ${this.toast?m`<div class="toast" role="status">${this.toast}</div>`:T}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let i=n.problems+o;this.tick;let r=this.today(),a="";if(e){let h=e.time_zone,b=new Date(e.updated);this.error?a=m`<span class="bad">Can’t reach Home Assistant · showing the plan from ${Nt(b,new Date,h)}</span>`:e.status&&!e.status.ok?a=m`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Nt(b,new Date,h)}</span>`:this.backend?.live||(a=`Updated ${Nt(b,new Date,h)}`)}let c=(h,b,C,f)=>m`
      <button type="button" class="seg-btn" title=${f} aria-pressed=${this.mode===h?"true":"false"} @click=${()=>this.setMode(h)}>
        ${C}<span class="seg-label">${b}</span>
      </button>
    `,l=(h,b,C)=>m`
      <button type="button" class="seg-btn" aria-pressed=${this.page===h?"true":"false"} @click=${()=>this.setPage(h)}>
        ${C}<span class="seg-label">${b}</span>
      </button>
    `,d=ze(r.minutes),u=!!e&&kn(e);return m`
      <header>
        ${this.showMenu?m`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${ce`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:T}
        <div class="titles">
          <h1 class="clock" aria-label=${`${$e(r.date)}, ${d}`}>
            <span class="hm">${d.slice(0,-3)}</span><span class="ampm">${d.slice(-2)}</span>
          </h1>
          <p class="today-line">${$e(r.date)}</p>
          ${a?m`<p class="status">${a}</p>`:T}
        </div>
        ${e&&!u?this.renderNext(e,Gi(e,r),n):T}
        <div class="controls">
          ${this.wide||u&&!o?T:m`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?T:m`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",ce`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",ce`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${l("rides","Rides",ce`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${l("chores","Chores",ce`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?T:l("lunch","Lunch",ce`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let l=this.today().date,d=o.unassigned,u=o.laterUnassigned;if(d){let b=m`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${d} ${d===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?m`<div class="next idle needs">${b}</div>`:m`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${b}</button>`}if(u)return m`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${u} ${u===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let h=e.days.some(b=>b.date>=l&&b.events.length);return m`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${h?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${h?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let i;n.ongoing?i="On the road now":n.ahead===0?i=n.inMinutes<180?`Next trip · in ${mt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${fe(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,a=m`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Ae(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(l=>m`<span class="kid-dot" style="background:${l.color}"></span>`)}</span>
      </span>
      ${n.warn?m`<span class="next-stop warn">${n.warn}</span>`:n.stop?m`<span class="next-stop">${n.stop}</span>`:T}
    `,c=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?m`<button type="button" class=${c} @click=${()=>this.open(n.target)}>${a}</button>`:m`<div class=${c}>${a}</div>`}renderWeek(e){let n=this.today().date,o=ve(e);return m`<nav class="week" aria-label="Days">
      ${e.days.map(i=>{let r=Gn(i),a=i.events.length,c=i.events.slice(0,6).map(d=>d.own?ln.color:o.get(d.kid)?.color??de(0).color),l=`${$e(i.date)}: ${a?`${a} ${a===1?"activity":"activities"}`:"nothing planned"}${r?`, ${r} to sort out`:""}`;return m`<button
          type="button"
          class="day-tile ${i.date===n?"today":""}"
          data-date=${i.date}
          aria-label=${l}
          @click=${()=>this.goToDay(i.date)}
        >
          <span class="dt-wd">${i.date===n?"Today":fe(i.date)}</span>
          <span class="dt-num">${Number(i.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${c.length?c.map(d=>m`<span class="dt-dot" style="background:${d}"></span>`):m`<span class="dt-free">free</span>`}
            ${a>6?m`<span class="dt-more">+${a-6}</span>`:T}
          </span>
          ${r?m`<span class="dt-badge" aria-hidden="true">${r}</span>`:T}
        </button>`})}
    </nav>`}renderQuiet(e){let n=De(e),o=Re(e),i=ve(e),r=n.map(a=>ye(e,a));return m`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((a,c)=>ce`<circle cx=${50+c*30} cy="80" r="11" fill=${i.get(a).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${sc(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(a=>{let c=i.get(a);return m`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${Ae(ye(e,a))}</span>
            <span class="qw-name">${ye(e,a)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(a=>m`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Ae(me(e,a))}</span>
            <span class="qw-name">${me(e,a)}</span>
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
    </div>`}renderBanner(e){let n=e?.unavailable_calendars.length??0;return n?m`<div class="banner" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:T}renderEmpty(){return this.error?m`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:m`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let n=this.sel,o=l=>!!l&&!!n&&l.day===n.day&&l.event===n.event,i=e.dayHeads[0],r=e.width,a=100,c=[...e.links.map(l=>({t:"link",x:l,z:l.layer??0})),...e.preps.map(l=>({t:"prep",x:l,z:l.layer??a-1})),...e.cards.map(l=>({t:"card",x:l,z:l.layer??a})),...e.rides.map(l=>({t:"ride",x:l,z:l.layer??a+1}))].sort((l,d)=>l.z-d.z);return m`
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
          ${e.columns.map(l=>m`<div class="col-head ${l.kind}" style="left:${l.x}px;width:${l.w}px;--c:${l.dot};--rgb:${l.rgb}">
              <span class="avatar ${l.kind}" aria-hidden="true">${Ae(l.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${l.name}</span>${l.kind==="kid"?this.renderLunchChip(l.id,!0):T}</span>
                <span class="sub ${l.subWarn?"warn":""}">${l.sub}</span>
              </span>
            </div>`)}
        </div>
        <div class="pinned" aria-hidden="true" style="width:${r}px">
          <span class="label">${i?.label??""}</span><span class="tag" ?hidden=${!i?.tag}>${i?.tag??""}</span
          ><span class="sub ${i?.warn?"warn":""}">${i?.sub??""}</span>
        </div>
        <div class="canvas" style="width:${r}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(l=>m`<div
                class="col-bg ${l.kind}"
                style="left:${l.x}px;width:${l.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${l.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(l=>m`<div class="day-head" style="top:${l.y}px;width:${r}px">
              <span class="label">${l.label}</span>${l.tag?m`<span class="tag">${l.tag}</span>`:T}<span
                class="sub ${l.warn?"warn":""}"
                >${l.sub}</span
              >
            </div>`)}
          ${e.empties.map(l=>m`<span class="empty" style="top:${l.y}px">${l.text}</span>`)}
          ${e.grid.map(l=>m`<div class="grid ${l.strong?"strong":""}" style="top:${l.y}px;width:${r-60}px"></div>`)}
          ${e.hours.map(l=>m`<span class="hour" style="top:${l.y}px">${l.label}</span>`)}
          ${Le(e.bands,l=>l.key,l=>m`<div
                class="band"
                aria-hidden="true"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;background:rgba(${l.color.rgb},0.10);border-color:rgba(${l.color.rgb},0.45)"
              ></div>`)}
          ${Le(e.busy,l=>l.key,l=>m`<div class="busy" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span style="top:${l.labelY}px">${l.label}</span>
              </div>`)}
          ${Le(e.windows,l=>l.key,l=>m`<div class="window" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span>${l.label}</span>
              </div>`)}
          ${Le(c,l=>l.x.key,l=>{if(l.t==="link"){let b=l.x;return m`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-color:${b.color.color};background:linear-gradient(rgba(${b.color.rgb},0.11), rgba(${b.color.rgb},0.11)), var(--surface)"
                ></div>`}if(l.t==="prep"){let b=l.x;return m`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-color:${b.color.color};background:linear-gradient(rgba(${b.color.rgb},0.11), rgba(${b.color.rgb},0.11)), var(--surface);color:${b.color.ink}"
                >
                  ${b.label}
                </div>`}if(l.t==="ride"){let b=l.x;return m`<button
                  type="button"
                  class="ride ${b.dashed?"dashed":""} ${b.clash?"clash":""}"
                  aria-label=${b.aria}
                  style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;padding-top:${3+(b.tuckTop??0)}px;padding-bottom:${3+(b.tuckBottom??0)}px"
                  @click=${()=>this.open(b.target)}
                >
                  <span class="l1">${b.l1}</span>${b.show2?m`<span class="l2" style="-webkit-line-clamp:${b.lines2}">${b.l2}</span>`:T}
                </button>`}let d=l.x,u=d.color,h=d.skipped?`repeating-linear-gradient(135deg, rgba(${u.rgb},0.10) 0px, rgba(${u.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:d.stayed?`repeating-linear-gradient(135deg, rgba(${u.rgb},0.24) 0px, rgba(${u.rgb},0.24) 6px, rgba(${u.rgb},0.08) 6px, rgba(${u.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${u.rgb},0.15), rgba(${u.rgb},0.15)), var(--surface)`;return m`<button
                type="button"
                class="card ${d.wrap?"wrap":""} ${o(d.target)?"sel":""} ${d.clash?"clash":""} ${d.skipped?"skipped":""}"
                aria-label=${d.aria}
                style="left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;background:${h};border-color:${d.clash?"var(--bad)":`rgba(${u.rgb},0.45)`};--c:${u.color};--rgb:${u.rgb};--ring:${u.color}"
                @click=${()=>this.open(d.target)}
              >
                <span class="top">
                  <span class="title">${d.title}</span>
                  <span class="time">${d.time}</span>
                  ${d.showDrop&&d.drop?m`<span class="line tone-${d.drop.tone}">${d.drop.text}</span>`:T}
                </span>
                ${d.showPick&&d.pick?m`<span class="line tone-${d.pick.tone}">${d.pick.text}</span>`:T}
              </button>`})}
          ${Le(e.stays,l=>l.key,l=>m`<button
                type="button"
                class="stay"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;border-color:${l.color.color};background:repeating-linear-gradient(135deg, rgba(${l.color.rgb},0.28) 0px, rgba(${l.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1" style="color:${l.color.ink}">${l.l1}</span><span class="l2">${l.l2}</span>
              </button>`)}
          ${Le(e.trips,l=>l.key,l=>m`<button
                type="button"
                class="trip ${l.bad?"bad":""} ${l.stops?"list":""}"
                aria-label=${l.aria}
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1">${l.l1}${l.kids.map(d=>m`<span class="kid-dot" style="background:${d}"></span>`)}</span>
                ${l.show2?m`<span class="l2">${l.l2}</span>`:T}
                ${l.stops?l.stops.map(d=>m`<span class="stop ${d.warn?"warn":""}">${d.text}</span>`):T}
                ${l.show3?m`<span class="l3">${l.l3}</span>`:T}
              </button>`)}
          ${Le(e.overlaps,l=>l.key,l=>m`<div class="overlap" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"></div>`)}
          ${Le(e.marks,l=>l.key,l=>m`<span class="mark" style="left:${l.x}px;top:${l.y}px;${l.right?"transform:translateX(-100%)":""}">${l.text}</span>`)}
          ${e.now?m`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${r-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:T}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:i,later:r}=e,a=this.plan,c=i+n.length,l=this.chores,d=!!l&&!Qn(l);return m`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?T:m`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${d?m`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?m`<div class="attn-chores">${n.map(u=>this.renderChoreRow(u,!0))}</div>`:m`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:m`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!i?m`<div class="all-clear">
            <span class="check" aria-hidden="true">${ce`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${kn(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:T}
      ${o.map(u=>m`<div class="issue ${u.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${u.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${u.target?m`<button type="button" class="issue-title" @click=${()=>this.open(u.target,!0)}>${u.title}</button>`:m`<strong class="issue-title">${u.title}</strong>`}
              <span class="issue-body"
                >${u.parts?u.parts.map(h=>typeof h=="string"?h:m`<button type="button" class="issue-link" @click=${()=>this.open(h.target,!0)}>${h.text}</button>`):u.body}</span
              >
            </div>
          </div>
          ${u.suggestions.length?m`<div class="fixes">
                ${u.suggestions.map(h=>m`<button
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
      ${this.wide&&a&&!kn(a)&&this.page==="rides"?this.renderLegend():T}
    `}kidColorOf(e){let n=this.plan?ve(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return de(Math.max(0,o))}renderLunchChip(e,n=!1){let o=this.lunch,i=o?.kids.find(l=>l.id===e);if(!o||!i)return T;this.tick;let r=this.today(),a=lo(i,r.date,r.minutes,this.lunchDraft);if(!a)return T;let c=At[a.lunch];return m`<span class="lunch-chip ${a.lunch} ${n?"small":""}" title=${`${c} lunch ${a.when}${a.menu?`: ${a.menu}`:""}`}
      >${a.lunch==="bring"?Vo:Go}<span class="lunch-chip-text"
        >${c}${n?T:` ${a.when}`}${!n&&a.menu?m`<span class="lunch-chip-menu"> · ${a.menu}</span>`:T}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return m`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return m`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=io(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:Te(e.today),i=n.indexOf(o),r=d=>{let u=n[i+d];u&&(this.lunchMonth=u)},a=e.kids.some(d=>d.id===this.lunchKid)?this.lunchKid:null,c=a?e.kids.filter(d=>d.id===a):e.kids,l=e.status&&!e.status.ok?m`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:T;return m`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${ce`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${hn(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${i<0||i>=n.length-1} @click=${()=>r(1)}>
            ${ce`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":m`${Wo} Edit menus`}
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
    </div>`}renderLunchCard(e,n,o,i){let r=this.kidColorOf(n.id),a=oo(e,n,o,this.lunchDraft),c=ao(a),l=a.flat(),d=l.filter(f=>!f.outside&&!f.past&&f.lunch),u=n.days_off.filter(f=>Te(f.first)<=o&&o<=Te(f.last)),h=f=>d.filter(w=>un(w.date)===f),b=f=>{let w=h(f);if(!w.length)return;let A=w.every(x=>x.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,w.map(x=>x.date),A)},C=d.length?`${c.bring} Bring · ${c.buy} Buy${o===Te(e.today)?" left this month":""}`:"No school days left this month";return m`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Ae(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${C}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${At[n.default]} unless picked</span>
          ${e.kids.length<2?T:m`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:n.id}
              >
                ${i?ec:Ql}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?m`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:T}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${hn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((f,w)=>m`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!h(w).length}
            aria-label=${`${h(w).every(A=>A.lunch==="bring")?"Buy":"Bring"} every ${f} left in ${hn(o)} for ${n.name}`}
            @click=${()=>b(w)}
          >
            ${f}
          </button>`)}
        ${l.map(f=>this.renderLunchCell(n,f,i))}
      </div>
      ${u.length?m`<p class="lunch-offs">
            No school:
            ${u.map(f=>{let w=f.first<`${o}-01`?`${o}-01`:f.first,A=Te(f.last)>o?rt(`${as(o)}-01`,-1):f.last;return`${w===A?As(w):`${As(w)}–${As(A)}`} ${ro(f.title)}`}).join(" · ")}
          </p>`:T}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return m`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return m`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=n.lunch,r=i==="buy"?"bring":"buy",a=n.menu?`, ${n.menu}`:"",c=this.menuMode,l=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),d=c?`${e.name}, ${$e(n.date)}${a||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${$e(n.date)}: ${At[i]}${n.picked?"":" (not picked yet)"}${a}. Tap to ${At[r]}.`;return m`<button
      type="button"
      class="lunch-day ${i} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${c?"editing":""} ${l?"sel":""}"
      ?disabled=${n.past&&!c}
      aria-label=${d}
      @click=${()=>c?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${i==="bring"?Vo:Go}${At[i]}</span>
      ${n.menu?m`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?m`<span class="lunch-sides">${n.sides}</span>`:T}`:c?m`<span class="lunch-menu add">${wn} Menu</span>`:T}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex(A=>A.id===e.kid),a=(this.plan?ve(this.plan).get(e.kid):void 0)??de(Math.max(0,r)),c=o.kids[r]?.name??"",l=i===ot(e)?e:{...e,state:i?"done":"open",done_at:i?new Date().toISOString():null},d=i&&l.done_by&&l.done_by!==e.kid?o.people?.find(A=>A.id===l.done_by)?.name??l.done_by_name??null:null,u=`${Zn(l,o.today,o.time_zone)}${d?` · by ${d}`:""}`,h=i||Ji(e),b=`${n?`${c}: `:""}${e.title}. ${u?`${u}. `:""}${i?"Done. Tap to undo.":"Tap when it’s done."}`,C=m`<span class="box" aria-hidden="true"
        >${i?ce`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:T}</span
      >
      ${e.icon?m`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:T}
      <span class="chore-text">
        <span class="chore-title">${n?m`<span class="chore-kid">${c}</span> · `:T}${e.title}</span>
        ${u?m`<span class="chore-note">${u}</span>`:T}
      </span>`,f=`chore ${i?"done":""} ${e.state==="overdue"&&!i?"overdue":""} ${h?"":"later"}`,w=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return h?m`<button type="button" class=${f} style=${w} aria-pressed=${i?"true":"false"} aria-label=${b} @click=${()=>this.tapChore(e)}>
          ${C}
        </button>`:m`<div class=${f} style=${w}>${C}</div>`}renderChores(){let e=this.chores;if(e===void 0)return m`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return m`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return m`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return m`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(Qn(e))return m`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${wn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?m`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:T;this.tick;let i=Xi(e,this.plan?ve(this.plan):void 0,this.today().minutes);return m`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${wn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${Wo} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${i.length}">
        ${i.map(r=>{let a=r.overdue.filter(c=>!this.choreDone(c)).length+r.now.filter(c=>!this.choreDone(c)).length;return m`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Ae(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${a?`${a} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?m`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(c=>this.renderChoreRow(c))}`:T}
            ${r.now.length?m`<h3 class="chore-group">To do</h3>
                  ${r.now.map(c=>this.renderChoreRow(c))}`:T}
            ${r.done.length?m`<h3 class="chore-group">Done</h3>
                  ${r.done.map(c=>this.renderChoreRow(c))}`:T}
            ${r.later.map(c=>m`<h3 class="chore-group">${c.date===e.today?"Later today":nc(c.date,e.today)}</h3>
                ${c.chores.map(l=>this.renderChoreRow(l))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?m`<p class="chore-none">No chores this week.</p>`:T}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,i=this.plan?ve(this.plan):void 0,r=this.choreEdit?.template===e.id,a=e.problems.length?m`<span class="tmpl-note bad">${e.problems.map(rs).join(" · ")} · tap to set up</span>`:m`<span class="tmpl-note">${os(e.who,o,e.take_turns)} · ${is(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return m`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?m` <span class="tag-paused">Paused</span>`:T}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let l=o.findIndex(u=>u.id===c),d=i?.get(c)??de(Math.max(0,l));return m`<span class="kid-dot" style="background:${d.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return m`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${wn} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([o,i])=>{let r=e.templates.filter(a=>a.repeats===o);return r.length?m`<section class="manage-group" aria-label=${i}>
                  <h3 class="chore-group">${i}</h3>
                  <div class="tmpl-list">${r.map(a=>this.renderTemplateRow(a))}</div>
                </section>`:T}):m`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return m``;let o=n.kids,i=this.plan?ve(this.plan):void 0,r=this.choreBusy,a=e.template?n.templates.find(f=>f.id===e.template):void 0,c=ns(e),l=(a?.problems??[]).filter(f=>f!=="who:"),d=(f,w,A,x=!1)=>m`<button type="button" class="choice ${x?"wide":""}" aria-pressed=${f?"true":"false"} ?disabled=${r} @click=${A}>${w}</button>`,u=(f,w,A,x)=>m`<button type="button" class="chip" aria-pressed=${f?"true":"false"} aria-label=${x??T} ?disabled=${r} @click=${A}>${w}</button>`,h=f=>{f!==e.repeats&&this.changeDraft({repeats:f,days:a&&a.repeats===f?a.days??cn(f):cn(f)})},b=f=>{let w=e.who.includes(f)?e.who.filter(A=>A!==f):o.filter(A=>A.id===f||e.who.includes(A.id)).map(A=>A.id);this.changeDraft({who:w})},C;if(e.repeats==="school"){let f=e.days===Je?new Set:e.days===""?new Set([0,1,2,3,4]):es(e.days)??new Set,w=A=>{let x=new Set(f);x.has(A)?x.delete(A):x.add(A),this.changeDraft({days:x.size===5?"":x.size?ts(x):Je})};C=m`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${Ye.slice(0,5).map((A,x)=>u(f.has(x),A.slice(0,2),()=>w(x),A))}
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
        </div>`}else if(e.repeats==="monthly"){let f=e.days.trim(),w=/^\d+$/.test(f)?Number(f):null,A=f&&f.toLowerCase()!=="any"&&f.toLowerCase()!=="last"&&w===null;C=m`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${A?4:3}, minmax(0, 1fr))">
          ${d(f===""||f.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${d(w!==null,"On a date",()=>this.changeDraft({days:String(w??1)}))}
          ${d(f.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${A?d(!0,f,()=>{}):T}
        </div>
        ${w!==null?m`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||w<=1} @click=${()=>this.changeDraft({days:String(w-1)})}>−</button>
                <span class="arrive-value">${ss(w)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||w>=31} @click=${()=>this.changeDraft({days:String(w+1)})}>+</button>
              </span>
            </div>`:m`<p class="field-hint">${f.toLowerCase()==="last"?"Due on the month’s last day.":A?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")C=m`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let f=e.days===""||e.days.toLowerCase()==="any",w=e.days===Je?new Set:f?new Set:es(e.days)??new Set,A=x=>{let B=new Set(w);B.has(x)?B.delete(x):B.add(x),this.changeDraft({days:B.size?ts(B)||"Mon-Sun":Je})};C=m`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${d(f,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${d(!f,"On set days",()=>this.changeDraft({days:f?"Sat":e.days}))}
        </div>
        ${f?m`<p class="field-hint">Shows all week, due on Sunday.</p>`:m`<div role="group" aria-label="Days of the week" class="day-chips">
                ${Ye.map((x,B)=>u(w.has(B),x.slice(0,2),()=>A(B),x))}
              </div>
              <div class="chips">
                ${u(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${u(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return m`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?m`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:T}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?os(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===Je?"No days picked":is(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${l.length?m`<p class="field-hint bad">${l.map(rs).join(". ")}. Saving fixes it.</p>`:T}
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
          @input=${f=>this.changeDraft({title:f.target.value})}
        />
        <div role="group" aria-label="Picture" class="icon-chips">
          ${qo.map(f=>u(e.icon===f,f,()=>this.changeDraft({icon:e.icon===f?null:f}),`Picture ${f}`))}
          ${e.icon&&!qo.includes(e.icon)?u(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):T}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?m`<emoji-picker
              class="emoji-more"
              .dataSource=${Zl}
              @emoji-click=${f=>{let w=f.detail.unicode;w&&this.changeDraft({icon:w}),this.iconMore=!1}}
            ></emoji-picker>`:T}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((f,w)=>{let A=i?.get(f.id)??de(w),x=e.who.includes(f.id);return m`<button type="button" class="who-chip" style="--c:${A.color};--rgb:${A.rgb}" aria-pressed=${x?"true":"false"} ?disabled=${r} @click=${()=>b(f.id)}>
              <span class="avatar" aria-hidden="true">${Ae(f.name)}</span>${f.name}
            </button>`})}
        </div>
        ${e.who.length>1?m`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
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
      ${e.repeats==="school"?T:m`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${tc(e.repeats,e.every)}</span>
      </div>`}
      <div class="field">
        <label class="field-label" for="chore-details">Notes <span class="field-hint">Optional, shown with the chore</span></label>
        <textarea
          id="chore-details"
          class="text-input"
          rows="2"
          .value=${e.details}
          ?disabled=${r}
          @input=${f=>this.changeDraft({details:f.target.value})}
        ></textarea>
      </div>
      ${e.template?m`<div class="field">
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
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return m``;let o=e.busy,i=d=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...d})},r=d=>i({kids:e.kids.includes(d)?e.kids.filter(u=>u!==d):[...e.kids,d]}),a=n.kids.filter(d=>Et(d,e.date)),c=e.dish.trim(),l=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return m`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${$e(e.date)}</span>
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
          ${a.map(d=>{let u=this.kidColorOf(d.id),h=e.kids.includes(d.id);return m`<button type="button" class="who-chip" style="--c:${u.color};--rgb:${u.rgb}" aria-pressed=${h?"true":"false"} ?disabled=${o} @click=${()=>r(d.id)}>
              <span class="avatar" aria-hidden="true">${Ae(d.name)}</span>${d.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${c||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?m`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:T}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!l} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":l??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return m``;let o=n.people?.length?n.people:n.kids.map(u=>({...u,role:"kid"})),i=n.kids.findIndex(u=>u.id===e.kid),r=n.kids[i],a=this.plan?ve(this.plan):void 0,c=a?.get(e.kid)??de(Math.max(0,i)),l=o.filter(u=>u.id!==e.kid),d=u=>{let h=n.kids.findIndex(b=>b.id===u.id);return h>=0?(a?.get(u.id)??de(h)).color:"var(--dark)"};return m`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?m`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:T}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${Zn(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${c.color};--rgb:${c.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${Ae(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?m`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${l.map(u=>m`<button type="button" class="done-by" style="--c:${d(u)}" @click=${()=>void this.toggleChore(e,u.id)}>
                  <span class="avatar ${u.role==="parent"?"driver":""}" aria-hidden="true">${Ae(u.name)}</span>
                  <span>${u.name}</span>
                </button>`)}
            </div>`:m`<button type="button" class="choice wide" @click=${()=>this.whoOthers=!0}>Someone else did</button>`}
      </div>
    `}renderLegend(){return m`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}ownHint(e,n){let o=an(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${U(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${U(n.start)} to ${U(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=n.along.map(r=>Re(e).includes(r)?me(e,r):ye(e,r));return`${o} drives there and back${i.length?`, with ${Vn(i)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return m``;let{day:o,event:i}=n,r=Re(e),a=Ni(e,i),c=an(e,i),l=!!this.pending,d=S=>this.pending?.key===S?this.pending.value:void 0,u=[...e.people?.carpools??[]];for(let S of e.days)for(let Y of S.events)for(let W of[Y.drop,Y.pick])W&&W!=="none"&&!r.includes(W)&&!u.some(ge=>ge.toLowerCase()===W.toLowerCase())&&u.push(W);let h=S=>{if(!i.sides.includes(S))return T;let Y=d(S),W=Y!==void 0?String(Y):S==="drop"?i.drop:i.pick,ge=W&&W!=="none"&&!r.includes(W)?W:"",be=g=>this.setRide(i,S,W===g?"":g),oe=[...r.map(g=>[g,qn(e,g)]),["none","Not needed"]];return m`<div class="field">
        <span class="field-label">${S==="drop"?"Drop-off":"Pick-up"} ${W===""?m`<span class="nobody">· nobody yet</span>`:T}</span>
        <div role="group" aria-label=${S==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${oe.length}, minmax(0, 1fr))">
          ${oe.map(([g,D])=>m`<button type="button" class="choice" aria-pressed=${W===g?"true":"false"} ?disabled=${l} @click=${()=>be(g)}>
                ${D}
              </button>`)}
        </div>
        ${u.length?m`<div role="group" aria-label=${S==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${u.map(g=>m`<button type="button" class="chip" aria-pressed=${W.toLowerCase()===g.toLowerCase()?"true":"false"} ?disabled=${l} @click=${()=>be(g)}>
                    ${g}
                  </button>`)}
            </div>`:T}
        <input
          type="text"
          .value=${ge&&!u.some(g=>g.toLowerCase()===ge.toLowerCase())?ge:""}
          ?disabled=${l}
          aria-label=${S==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${g=>{let D=g.target.value.trim();D&&D!==W&&this.setRide(i,S,D)}}
          @keydown=${g=>{g.key==="Enter"&&g.target.blur()}}
        />
        ${!f&&W!==""&&W!=="none"?b(S,W):T}
      </div>`},b=(S,Y)=>{let W=d(`along-${S}`),ge=W!==void 0?W:S==="pick"?i.pick_along??[]:i.along,be=[...De(e).filter(g=>g!==i.kid),...r.filter(g=>g!==Y)];return be.length?m`<div class="field-sub">
        <span class="field-label">${S==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${S==="pick"?"They come for the pick-up":"They leave home in the same car"}</span></span>
        <div role="group" aria-label=${S==="drop"?"Riding along on the drop-off":S==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${be.map(g=>m`<button type="button" class="chip" aria-pressed=${ge.includes(g)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(i,g,S)}>
              ${r.includes(g)?me(e,g):ye(e,g)}
            </button>`)}
        </div>
      </div>`:T},C=d("stay"),f=C!==void 0?!!C:i.stay,w=i.drop===i.pick&&r.includes(i.drop),A=d("along"),x=A!==void 0?A:i.along,B=i.own?[...De(e),...r.filter(S=>S!==i.own)]:[],X=i.own!=null&&i.takes!=null,H=i.own!=null&&!X,he=d("takes"),v=he!==void 0?he:i.takes??null,E=d("arrive"),y=this.arriveDraft!==void 0?this.arriveDraft:E!==void 0?E:i.arrive_by,k=[],$=S=>S==="none"?"Not needed":qn(e,S),M=S=>r.includes(S)?me(e,S):ye(e,S),O=(S,Y,W)=>{Y===""&&!W.length||k.push(`${S}: ${[Y===""?"TBD":$(Y),...W.map(M)].join(", ")}`)};i.own||O("Drop-off",i.drop,i.along),i.own||O("Pick-up",i.pick,i.pick_along??[]),!i.own&&i.stay&&k.push("Stay: yes"),X&&k.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&k.push(`Take along: ${i.along.map(M).join(", ")}`),i.arrive_by!=null&&k.push(`Arrive by: ${ze(i.arrive_by)}`);let q=d("attending"),Z=q!==void 0?!!q:i.attending!==!1;i.attending===!1&&k.splice(0,k.length,"Attending: no");let Q=o.date===this.today().date?"":`${fe(o.date)} · `,j=m`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${c} · ${i.title}</span>
          <span class="ed-meta">${Q}${X?"any time ":""}${U(i.start)}–${U(i.end)}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return i.where==="home"?m`${j}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:m`
      ${j}
      ${this.pending?m`<p class="saving" role="status">Saving to Google Calendar…</p>`:T}
      ${i.recurring?m`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${fe(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:T}
      <div class="field">
        <span class="field-label">${c} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${Z?"true":"false"} ?disabled=${l} @click=${()=>this.setAttending(i,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${Z?"false":"true"} ?disabled=${l} @click=${()=>this.setAttending(i,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${Z?m`${i.where==="anywhere"?m`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:T}
            ${i.own?m`<p class="field-hint">${this.ownHint(e,i)}</p>`:m`${h("drop")} ${h("pick")}
                  <div class="field">
                    <button type="button" class="choice wide" aria-pressed=${f?"true":"false"} ?disabled=${!w||l} @click=${()=>this.toggleStay(i)}>
                      ${w?f?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
                    </button>
                    ${f&&w?b("both",i.drop):T}
                  </div>`}
      ${i.own?m`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${v!=null?`Takes ${v} min, any time ${U(i.start)}–${U(i.end)}`:"At its set time"}</span>
            </span>
            ${v!=null?m`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${l||v<=5} @click=${()=>this.setTakes(i,Math.max(5,v-5))}>−</button>
                  <span class="arrive-value">${v} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${l||v+5>i.end-i.start} @click=${()=>this.setTakes(i,v+5)}>+</button>
                </span>`:T}
          </div>
          <button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.setTakes(i,v!=null?null:Math.min(10,Math.max(5,i.end-i.start)))}>
            ${v!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:T}
      ${H&&B.length?m`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${B.map(S=>m`<button type="button" class="chip" aria-pressed=${x.includes(S)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(i,S)}>
                  ${r.includes(S)?me(e,S):ye(e,S)}
                </button>`)}
            </div>
          </div>`:T}
      ${X?T:m`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${y!=null?`${i.start-y} min before it starts`:`Aims for a few minutes before ${U(i.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${l} @click=${()=>this.nudgeArrive(i,-5)}>−</button>
          <span class="arrive-value">${y!=null?U(y):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${l||y==null} @click=${()=>this.nudgeArrive(i,5)}>+</button>
        </span>
      </div>
      ${y!=null?m`<button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:T}`}
`:m`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${k.length?k.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${i.problems.length?m`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:T}
      ${Z&&!i.own?m`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:T}
    `}};St.styles=co,St.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",St);function rc(){let s=[document];for(let t of document.querySelectorAll("*"))t.shadowRoot&&s.push(t.shadowRoot);return s}function Jo(s=3e3){let t=new CSSStyleSheet;t.replaceSync("*, *::before, *::after { cursor: none !important; }"),t.disabled=!0;let e,n=i=>{if(i)for(let r of rc())r.adoptedStyleSheets.includes(t)||(r.adoptedStyleSheets=[...r.adoptedStyleSheets,t]);t.disabled=!i},o=i=>{if(clearTimeout(e),i.pointerType==="touch"){n(!0);return}n(!1),e=setTimeout(()=>n(!0),s)};window.addEventListener("pointermove",o,{passive:!0}),window.addEventListener("pointerdown",o,{passive:!0}),e=setTimeout(()=>n(!0),s)}var Xo=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],Zo=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function Qo(s,t,e,n){let o=Math.max(0,Math.min(t,s.length)),i=Math.max(o,Math.min(e,s.length));return{value:s.slice(0,o)+n+s.slice(i),caret:o+n.length}}function er(s,t,e){let n=Math.max(0,Math.min(t,s.length)),o=Math.max(n,Math.min(e,s.length));if(n!==o)return{value:s.slice(0,n)+s.slice(o),caret:n};if(n===0)return{value:s,caret:0};let i=Array.from(s.slice(0,n));i.pop();let r=i.join("");return{value:r+s.slice(n),caret:r.length}}function tr(s,t){return t===0||/\s$/.test(s.slice(0,t))}var ac=new Set(["text","search","email","url","tel","number","password"]);function nr(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&ac.has(s.type)&&!s.readOnly&&!s.disabled}var lc={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},cc={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},Mt=class extends we{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=n=>n.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let n=e.selectionStart,o=e.selectionEnd;if(n!==null&&o!==null)return[n,o]}catch{}return[e.value.length,e.value.length]}apply(e,n,o){e.value=n;try{e.setSelectionRange(o,o)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=tr(this.field.value,e)}press(e){let n=this.field;if(n){switch(e){case"hide":n.blur();return;case"done":this.commit(),n.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),n.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[o,i]=this.selection(n),r=er(n.value,o,i);this.apply(n,r.value,r.caret);break}default:{let o=e==="space"?" ":this.shift?e.toUpperCase():e,[i,r]=this.selection(n),a=Qo(n.value,i,r,o);this.apply(n,a.value,a.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let n=e.length>1,o=e==="layout"?this.layout==="letters"?"123":"ABC":lc[e]??(this.shift?e.toUpperCase():e);return m`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":n?"wide":""}
      aria-label=${cc[e]??o}
      aria-pressed=${e==="shift"?String(this.shift):T}
      @click=${()=>this.press(e)}
    >
      ${o}
    </button>`}render(){let e=this.layout==="letters"?Xo:Zo;return m`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(n=>m`<div class="row">${n.map(o=>this.key(o))}</div>`)}
      </div>`}};Mt.styles=He`
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
  `,Mt.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",Mt);function dc(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function sr(s){let t=new WeakSet,e=r=>{let a=r.composedPath();i(a);let c=a[0];nr(c)&&s.attach(c)},n=()=>{setTimeout(()=>{let r=dc();!s.target||r===s.target||(nr(r)?s.attach(r):s.detach())},0)},o=r=>{t.has(r)||(t.add(r),r.addEventListener("focusin",e),r.addEventListener("focusout",n))},i=r=>{for(let a of r)a instanceof ShadowRoot&&o(a)};o(document),document.addEventListener("pointerdown",r=>i(r.composedPath()),{capture:!0}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var Ss="mydashlight",uc=`/api/${Ss}/pair`,hc=`/api/${Ss}/pair/poll`,Ms=`/${Ss}`,Ps="pair";function ir(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function or(s,t){return`${s}${Ms}?${Ps}=${encodeURIComponent(t)}`}function pc(s,t,e=Date.now()){return{hassUrl:s,clientId:t.client_id,access_token:t.access_token,refresh_token:t.refresh_token,expires_in:t.expires_in,expires:e+t.expires_in*1e3}}var tt=class extends Error{constructor(t,e=!1){super(t),this.busy=e}};async function rr(s=fetch){let t=await s(uc,{method:"POST",cache:"no-store"});if(t.status===429)throw new tt("Too many screens are asking to pair right now.",!0);if(!t.ok)throw new tt(`Home Assistant answered ${t.status}.`);return await t.json()}async function ar(s,t,e=fetch){let n=await e(hc,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(n.status===404)return{status:"expired"};if(!n.ok)throw new tt(`Home Assistant answered ${n.status}.`);let o=await n.json();return o.status==="paired"&&o.auth?{status:"paired",auth:pc(t,o.auth)}:{status:"pending"}}var ht=function(s,t){let o=s,i=Pt[t],r=null,a=0,c=null,l=[],d={},u=function(v,E){a=o*4+17,r=(function(y){let k=new Array(y);for(let $=0;$<y;$+=1){k[$]=new Array(y);for(let M=0;M<y;M+=1)k[$][M]=null}return k})(a),h(0,0),h(a-7,0),h(0,a-7),f(),C(),A(v,E),o>=7&&w(v),c==null&&(c=X(o,i,l)),x(c,E)},h=function(v,E){for(let y=-1;y<=7;y+=1)if(!(v+y<=-1||a<=v+y))for(let k=-1;k<=7;k+=1)E+k<=-1||a<=E+k||(0<=y&&y<=6&&(k==0||k==6)||0<=k&&k<=6&&(y==0||y==6)||2<=y&&y<=4&&2<=k&&k<=4?r[v+y][E+k]=!0:r[v+y][E+k]=!1)},b=function(){let v=0,E=0;for(let y=0;y<8;y+=1){u(!0,y);let k=je.getLostPoint(d);(y==0||v>k)&&(v=k,E=y)}return E},C=function(){for(let v=8;v<a-8;v+=1)r[v][6]==null&&(r[v][6]=v%2==0);for(let v=8;v<a-8;v+=1)r[6][v]==null&&(r[6][v]=v%2==0)},f=function(){let v=je.getPatternPosition(o);for(let E=0;E<v.length;E+=1)for(let y=0;y<v.length;y+=1){let k=v[E],$=v[y];if(r[k][$]==null)for(let M=-2;M<=2;M+=1)for(let O=-2;O<=2;O+=1)M==-2||M==2||O==-2||O==2||M==0&&O==0?r[k+M][$+O]=!0:r[k+M][$+O]=!1}},w=function(v){let E=je.getBCHTypeNumber(o);for(let y=0;y<18;y+=1){let k=!v&&(E>>y&1)==1;r[Math.floor(y/3)][y%3+a-8-3]=k}for(let y=0;y<18;y+=1){let k=!v&&(E>>y&1)==1;r[y%3+a-8-3][Math.floor(y/3)]=k}},A=function(v,E){let y=i<<3|E,k=je.getBCHTypeInfo(y);for(let $=0;$<15;$+=1){let M=!v&&(k>>$&1)==1;$<6?r[$][8]=M:$<8?r[$+1][8]=M:r[a-15+$][8]=M}for(let $=0;$<15;$+=1){let M=!v&&(k>>$&1)==1;$<8?r[8][a-$-1]=M:$<9?r[8][15-$-1+1]=M:r[8][15-$-1]=M}r[a-8][8]=!v},x=function(v,E){let y=-1,k=a-1,$=7,M=0,O=je.getMaskFunction(E);for(let q=a-1;q>0;q-=2)for(q==6&&(q-=1);;){for(let Z=0;Z<2;Z+=1)if(r[k][q-Z]==null){let Q=!1;M<v.length&&(Q=(v[M]>>>$&1)==1),O(k,q-Z)&&(Q=!Q),r[k][q-Z]=Q,$-=1,$==-1&&(M+=1,$=7)}if(k+=y,k<0||a<=k){k-=y,y=-y;break}}},B=function(v,E){let y=0,k=0,$=0,M=new Array(E.length),O=new Array(E.length);for(let j=0;j<E.length;j+=1){let S=E[j].dataCount,Y=E[j].totalCount-S;k=Math.max(k,S),$=Math.max($,Y),M[j]=new Array(S);for(let oe=0;oe<M[j].length;oe+=1)M[j][oe]=255&v.getBuffer()[oe+y];y+=S;let W=je.getErrorCorrectPolynomial(Y),be=Lt(M[j],W.getLength()-1).mod(W);O[j]=new Array(W.getLength()-1);for(let oe=0;oe<O[j].length;oe+=1){let g=oe+be.getLength()-O[j].length;O[j][oe]=g>=0?be.getAt(g):0}}let q=0;for(let j=0;j<E.length;j+=1)q+=E[j].totalCount;let Z=new Array(q),Q=0;for(let j=0;j<k;j+=1)for(let S=0;S<E.length;S+=1)j<M[S].length&&(Z[Q]=M[S][j],Q+=1);for(let j=0;j<$;j+=1)for(let S=0;S<E.length;S+=1)j<O[S].length&&(Z[Q]=O[S][j],Q+=1);return Z},X=function(v,E,y){let k=lr.getRSBlocks(v,E),$=cr();for(let O=0;O<y.length;O+=1){let q=y[O];$.put(q.getMode(),4),$.put(q.getLength(),je.getLengthInBits(q.getMode(),v)),q.write($)}let M=0;for(let O=0;O<k.length;O+=1)M+=k[O].dataCount;if($.getLengthInBits()>M*8)throw"code length overflow. ("+$.getLengthInBits()+">"+M*8+")";for($.getLengthInBits()+4<=M*8&&$.put(0,4);$.getLengthInBits()%8!=0;)$.putBit(!1);for(;!($.getLengthInBits()>=M*8||($.put(236,8),$.getLengthInBits()>=M*8));)$.put(17,8);return B($,k)};d.addData=function(v,E){E=E||"Byte";let y=null;switch(E){case"Numeric":y=fc(v);break;case"Alphanumeric":y=gc(v);break;case"Byte":y=mc(v);break;case"Kanji":y=bc(v);break;default:throw"mode:"+E}l.push(y),c=null},d.isDark=function(v,E){if(v<0||a<=v||E<0||a<=E)throw v+","+E;return r[v][E]},d.getModuleCount=function(){return a},d.make=function(){if(o<1){let v=1;for(;v<40;v++){let E=lr.getRSBlocks(v,i),y=cr();for(let $=0;$<l.length;$++){let M=l[$];y.put(M.getMode(),4),y.put(M.getLength(),je.getLengthInBits(M.getMode(),v)),M.write(y)}let k=0;for(let $=0;$<E.length;$++)k+=E[$].dataCount;if(y.getLengthInBits()<=k*8)break}o=v}u(!1,b())},d.createTableTag=function(v,E){v=v||2,E=typeof E>"u"?v*4:E;let y="";y+='<table style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: "+E+"px;",y+='">',y+="<tbody>";for(let k=0;k<d.getModuleCount();k+=1){y+="<tr>";for(let $=0;$<d.getModuleCount();$+=1)y+='<td style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: 0px;",y+=" width: "+v+"px;",y+=" height: "+v+"px;",y+=" background-color: ",y+=d.isDark(k,$)?"#000000":"#ffffff",y+=";",y+='"/>';y+="</tr>"}return y+="</tbody>",y+="</table>",y},d.createSvgTag=function(v,E,y,k){let $={};typeof arguments[0]=="object"&&($=arguments[0],v=$.cellSize,E=$.margin,y=$.alt,k=$.title),v=v||2,E=typeof E>"u"?v*4:E,y=typeof y=="string"?{text:y}:y||{},y.text=y.text||null,y.id=y.text?y.id||"qrcode-description":null,k=typeof k=="string"?{text:k}:k||{},k.text=k.text||null,k.id=k.text?k.id||"qrcode-title":null;let M=d.getModuleCount()*v+E*2,O,q,Z,Q,j="",S;for(S="l"+v+",0 0,"+v+" -"+v+",0 0,-"+v+"z ",j+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',j+=$.scalable?"":' width="'+M+'px" height="'+M+'px"',j+=' viewBox="0 0 '+M+" "+M+'" ',j+=' preserveAspectRatio="xMinYMin meet"',j+=k.text||y.text?' role="img" aria-labelledby="'+H([k.id,y.id].join(" ").trim())+'"':"",j+=">",j+=k.text?'<title id="'+H(k.id)+'">'+H(k.text)+"</title>":"",j+=y.text?'<description id="'+H(y.id)+'">'+H(y.text)+"</description>":"",j+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',j+='<path d="',Z=0;Z<d.getModuleCount();Z+=1)for(Q=Z*v+E,O=0;O<d.getModuleCount();O+=1)d.isDark(Z,O)&&(q=O*v+E,j+="M"+q+","+Q+S);return j+='" stroke="transparent" fill="black"/>',j+="</svg>",j},d.createDataURL=function(v,E){v=v||2,E=typeof E>"u"?v*4:E;let y=d.getModuleCount()*v+E*2,k=E,$=y-E;return wc(y,y,function(M,O){if(k<=M&&M<$&&k<=O&&O<$){let q=Math.floor((M-k)/v),Z=Math.floor((O-k)/v);return d.isDark(Z,q)?0:1}else return 1})},d.createImgTag=function(v,E,y){v=v||2,E=typeof E>"u"?v*4:E;let k=d.getModuleCount()*v+E*2,$="";return $+="<img",$+=' src="',$+=d.createDataURL(v,E),$+='"',$+=' width="',$+=k,$+='"',$+=' height="',$+=k,$+='"',y&&($+=' alt="',$+=H(y),$+='"'),$+="/>",$};let H=function(v){let E="";for(let y=0;y<v.length;y+=1){let k=v.charAt(y);switch(k){case"<":E+="&lt;";break;case">":E+="&gt;";break;case"&":E+="&amp;";break;case'"':E+="&quot;";break;default:E+=k;break}}return E},he=function(v){v=typeof v>"u"?2:v;let y=d.getModuleCount()*1+v*2,k=v,$=y-v,M,O,q,Z,Q,j={"██":"█","█ ":"▀"," █":"▄","  ":" "},S={"██":"▀","█ ":"▀"," █":" ","  ":" "},Y="";for(M=0;M<y;M+=2){for(q=Math.floor((M-k)/1),Z=Math.floor((M+1-k)/1),O=0;O<y;O+=1)Q="█",k<=O&&O<$&&k<=M&&M<$&&d.isDark(q,Math.floor((O-k)/1))&&(Q=" "),k<=O&&O<$&&k<=M+1&&M+1<$&&d.isDark(Z,Math.floor((O-k)/1))?Q+=" ":Q+="█",Y+=v<1&&M+1>=$?S[Q]:j[Q];Y+=`
`}return y%2&&v>0?Y.substring(0,Y.length-y-1)+Array(y+1).join("▀"):Y.substring(0,Y.length-1)};return d.createASCII=function(v,E){if(v=v||1,v<2)return he(E);v-=1,E=typeof E>"u"?v*2:E;let y=d.getModuleCount()*v+E*2,k=E,$=y-E,M,O,q,Z,Q=Array(v+1).join("██"),j=Array(v+1).join("  "),S="",Y="";for(M=0;M<y;M+=1){for(q=Math.floor((M-k)/v),Y="",O=0;O<y;O+=1)Z=1,k<=O&&O<$&&k<=M&&M<$&&d.isDark(q,Math.floor((O-k)/v))&&(Z=0),Y+=Z?Q:j;for(q=0;q<v;q+=1)S+=Y+`
`}return S.substring(0,S.length-1)},d.renderTo2dContext=function(v,E){E=E||2;let y=d.getModuleCount();for(let k=0;k<y;k++)for(let $=0;$<y;$++)v.fillStyle=d.isDark(k,$)?"black":"white",v.fillRect($*E,k*E,E,E)},d};ht.stringToBytes=function(s){let t=[];for(let e=0;e<s.length;e+=1){let n=s.charCodeAt(e);t.push(n&255)}return t};ht.createStringToBytes=function(s,t){let e=(function(){let o=vc(s),i=function(){let c=o.read();if(c==-1)throw"eof";return c},r=0,a={};for(;;){let c=o.read();if(c==-1)break;let l=i(),d=i(),u=i(),h=String.fromCharCode(c<<8|l),b=d<<8|u;a[h]=b,r+=1}if(r!=t)throw r+" != "+t;return a})(),n=63;return function(o){let i=[];for(let r=0;r<o.length;r+=1){let a=o.charCodeAt(r);if(a<128)i.push(a);else{let c=e[o.charAt(r)];typeof c=="number"?(c&255)==c?i.push(c):(i.push(c>>>8),i.push(c&255)):i.push(n)}}return i}};var pe={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},Pt={L:1,M:0,Q:3,H:2},Oe={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},je=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,e=7973,n=21522,o={},i=function(r){let a=0;for(;r!=0;)a+=1,r>>>=1;return a};return o.getBCHTypeInfo=function(r){let a=r<<10;for(;i(a)-i(t)>=0;)a^=t<<i(a)-i(t);return(r<<10|a)^n},o.getBCHTypeNumber=function(r){let a=r<<12;for(;i(a)-i(e)>=0;)a^=e<<i(a)-i(e);return r<<12|a},o.getPatternPosition=function(r){return s[r-1]},o.getMaskFunction=function(r){switch(r){case Oe.PATTERN000:return function(a,c){return(a+c)%2==0};case Oe.PATTERN001:return function(a,c){return a%2==0};case Oe.PATTERN010:return function(a,c){return c%3==0};case Oe.PATTERN011:return function(a,c){return(a+c)%3==0};case Oe.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case Oe.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case Oe.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case Oe.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+r}},o.getErrorCorrectPolynomial=function(r){let a=Lt([1],0);for(let c=0;c<r;c+=1)a=a.multiply(Lt([1,Ne.gexp(c)],0));return a},o.getLengthInBits=function(r,a){if(1<=a&&a<10)switch(r){case pe.MODE_NUMBER:return 10;case pe.MODE_ALPHA_NUM:return 9;case pe.MODE_8BIT_BYTE:return 8;case pe.MODE_KANJI:return 8;default:throw"mode:"+r}else if(a<27)switch(r){case pe.MODE_NUMBER:return 12;case pe.MODE_ALPHA_NUM:return 11;case pe.MODE_8BIT_BYTE:return 16;case pe.MODE_KANJI:return 10;default:throw"mode:"+r}else if(a<41)switch(r){case pe.MODE_NUMBER:return 14;case pe.MODE_ALPHA_NUM:return 13;case pe.MODE_8BIT_BYTE:return 16;case pe.MODE_KANJI:return 12;default:throw"mode:"+r}else throw"type:"+a},o.getLostPoint=function(r){let a=r.getModuleCount(),c=0;for(let u=0;u<a;u+=1)for(let h=0;h<a;h+=1){let b=0,C=r.isDark(u,h);for(let f=-1;f<=1;f+=1)if(!(u+f<0||a<=u+f))for(let w=-1;w<=1;w+=1)h+w<0||a<=h+w||f==0&&w==0||C==r.isDark(u+f,h+w)&&(b+=1);b>5&&(c+=3+b-5)}for(let u=0;u<a-1;u+=1)for(let h=0;h<a-1;h+=1){let b=0;r.isDark(u,h)&&(b+=1),r.isDark(u+1,h)&&(b+=1),r.isDark(u,h+1)&&(b+=1),r.isDark(u+1,h+1)&&(b+=1),(b==0||b==4)&&(c+=3)}for(let u=0;u<a;u+=1)for(let h=0;h<a-6;h+=1)r.isDark(u,h)&&!r.isDark(u,h+1)&&r.isDark(u,h+2)&&r.isDark(u,h+3)&&r.isDark(u,h+4)&&!r.isDark(u,h+5)&&r.isDark(u,h+6)&&(c+=40);for(let u=0;u<a;u+=1)for(let h=0;h<a-6;h+=1)r.isDark(h,u)&&!r.isDark(h+1,u)&&r.isDark(h+2,u)&&r.isDark(h+3,u)&&r.isDark(h+4,u)&&!r.isDark(h+5,u)&&r.isDark(h+6,u)&&(c+=40);let l=0;for(let u=0;u<a;u+=1)for(let h=0;h<a;h+=1)r.isDark(h,u)&&(l+=1);let d=Math.abs(100*l/a/a-50)/5;return c+=d*10,c},o})(),Ne=(function(){let s=new Array(256),t=new Array(256);for(let n=0;n<8;n+=1)s[n]=1<<n;for(let n=8;n<256;n+=1)s[n]=s[n-4]^s[n-5]^s[n-6]^s[n-8];for(let n=0;n<255;n+=1)t[s[n]]=n;let e={};return e.glog=function(n){if(n<1)throw"glog("+n+")";return t[n]},e.gexp=function(n){for(;n<0;)n+=255;for(;n>=256;)n-=255;return s[n]},e})(),Lt=function(s,t){if(typeof s.length>"u")throw s.length+"/"+t;let e=(function(){let o=0;for(;o<s.length&&s[o]==0;)o+=1;let i=new Array(s.length-o+t);for(let r=0;r<s.length-o;r+=1)i[r]=s[r+o];return i})(),n={};return n.getAt=function(o){return e[o]},n.getLength=function(){return e.length},n.multiply=function(o){let i=new Array(n.getLength()+o.getLength()-1);for(let r=0;r<n.getLength();r+=1)for(let a=0;a<o.getLength();a+=1)i[r+a]^=Ne.gexp(Ne.glog(n.getAt(r))+Ne.glog(o.getAt(a)));return Lt(i,0)},n.mod=function(o){if(n.getLength()-o.getLength()<0)return n;let i=Ne.glog(n.getAt(0))-Ne.glog(o.getAt(0)),r=new Array(n.getLength());for(let a=0;a<n.getLength();a+=1)r[a]=n.getAt(a);for(let a=0;a<o.getLength();a+=1)r[a]^=Ne.gexp(Ne.glog(o.getAt(a))+i);return Lt(r,0).mod(o)},n},lr=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(o,i){let r={};return r.totalCount=o,r.dataCount=i,r},e={},n=function(o,i){switch(i){case Pt.L:return s[(o-1)*4+0];case Pt.M:return s[(o-1)*4+1];case Pt.Q:return s[(o-1)*4+2];case Pt.H:return s[(o-1)*4+3];default:return}};return e.getRSBlocks=function(o,i){let r=n(o,i);if(typeof r>"u")throw"bad rs block @ typeNumber:"+o+"/errorCorrectionLevel:"+i;let a=r.length/3,c=[];for(let l=0;l<a;l+=1){let d=r[l*3+0],u=r[l*3+1],h=r[l*3+2];for(let b=0;b<d;b+=1)c.push(t(u,h))}return c},e})(),cr=function(){let s=[],t=0,e={};return e.getBuffer=function(){return s},e.getAt=function(n){let o=Math.floor(n/8);return(s[o]>>>7-n%8&1)==1},e.put=function(n,o){for(let i=0;i<o;i+=1)e.putBit((n>>>o-i-1&1)==1)},e.getLengthInBits=function(){return t},e.putBit=function(n){let o=Math.floor(t/8);s.length<=o&&s.push(0),n&&(s[o]|=128>>>t%8),t+=1},e},fc=function(s){let t=pe.MODE_NUMBER,e=s,n={};n.getMode=function(){return t},n.getLength=function(r){return e.length},n.write=function(r){let a=e,c=0;for(;c+2<a.length;)r.put(o(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?r.put(o(a.substring(c,c+1)),4):a.length-c==2&&r.put(o(a.substring(c,c+2)),7))};let o=function(r){let a=0;for(let c=0;c<r.length;c+=1)a=a*10+i(r.charAt(c));return a},i=function(r){if("0"<=r&&r<="9")return r.charCodeAt(0)-48;throw"illegal char :"+r};return n},gc=function(s){let t=pe.MODE_ALPHA_NUM,e=s,n={};n.getMode=function(){return t},n.getLength=function(i){return e.length},n.write=function(i){let r=e,a=0;for(;a+1<r.length;)i.put(o(r.charAt(a))*45+o(r.charAt(a+1)),11),a+=2;a<r.length&&i.put(o(r.charAt(a)),6)};let o=function(i){if("0"<=i&&i<="9")return i.charCodeAt(0)-48;if("A"<=i&&i<="Z")return i.charCodeAt(0)-65+10;switch(i){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+i}};return n},mc=function(s){let t=pe.MODE_8BIT_BYTE,e=s,n=ht.stringToBytes(s),o={};return o.getMode=function(){return t},o.getLength=function(i){return n.length},o.write=function(i){for(let r=0;r<n.length;r+=1)i.put(n[r],8)},o},bc=function(s){let t=pe.MODE_KANJI,e=s,n=ht.stringToBytes;(function(r,a){let c=n(r);if(c.length!=2||(c[0]<<8|c[1])!=a)throw"sjis not supported."})("友",38726);let o=n(s),i={};return i.getMode=function(){return t},i.getLength=function(r){return~~(o.length/2)},i.write=function(r){let a=o,c=0;for(;c+1<a.length;){let l=(255&a[c])<<8|255&a[c+1];if(33088<=l&&l<=40956)l-=33088;else if(57408<=l&&l<=60351)l-=49472;else throw"illegal char at "+(c+1)+"/"+l;l=(l>>>8&255)*192+(l&255),r.put(l,13),c+=2}if(c<a.length)throw"illegal char at "+(c+1)},i},dr=function(){let s=[],t={};return t.writeByte=function(e){s.push(e&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,o){n=n||0,o=o||e.length;for(let i=0;i<o;i+=1)t.writeByte(e[i+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return s},t.toString=function(){let e="";e+="[";for(let n=0;n<s.length;n+=1)n>0&&(e+=","),e+=s[n];return e+="]",e},t},xc=function(){let s=0,t=0,e=0,n="",o={},i=function(a){n+=String.fromCharCode(r(a&63))},r=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return o.writeByte=function(a){for(s=s<<8|a&255,t+=8,e+=1;t>=6;)i(s>>>t-6),t-=6},o.flush=function(){if(t>0&&(i(s<<6-t),s=0,t=0),e%3!=0){let a=3-e%3;for(let c=0;c<a;c+=1)n+="="}},o.toString=function(){return n},o},vc=function(s){let t=s,e=0,n=0,o=0,i={};i.read=function(){for(;o<8;){if(e>=t.length){if(o==0)return-1;throw"unexpected end of file./"+o}let c=t.charAt(e);if(e+=1,c=="=")return o=0,-1;if(c.match(/^\s$/))continue;n=n<<6|r(c.charCodeAt(0)),o+=6}let a=n>>>o-8&255;return o-=8,a};let r=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return i},yc=function(s,t){let e=s,n=t,o=new Array(s*t),i={};i.setPixel=function(l,d,u){o[d*e+l]=u},i.write=function(l){l.writeString("GIF87a"),l.writeShort(e),l.writeShort(n),l.writeByte(128),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(255),l.writeByte(255),l.writeByte(255),l.writeString(","),l.writeShort(0),l.writeShort(0),l.writeShort(e),l.writeShort(n),l.writeByte(0);let d=2,u=a(d);l.writeByte(d);let h=0;for(;u.length-h>255;)l.writeByte(255),l.writeBytes(u,h,255),h+=255;l.writeByte(u.length-h),l.writeBytes(u,h,u.length-h),l.writeByte(0),l.writeString(";")};let r=function(l){let d=l,u=0,h=0,b={};return b.write=function(C,f){if(C>>>f)throw"length over";for(;u+f>=8;)d.writeByte(255&(C<<u|h)),f-=8-u,C>>>=8-u,h=0,u=0;h=C<<u|h,u=u+f},b.flush=function(){u>0&&d.writeByte(h)},b},a=function(l){let d=1<<l,u=(1<<l)+1,h=l+1,b=c();for(let x=0;x<d;x+=1)b.add(String.fromCharCode(x));b.add(String.fromCharCode(d)),b.add(String.fromCharCode(u));let C=dr(),f=r(C);f.write(d,h);let w=0,A=String.fromCharCode(o[w]);for(w+=1;w<o.length;){let x=String.fromCharCode(o[w]);w+=1,b.contains(A+x)?A=A+x:(f.write(b.indexOf(A),h),b.size()<4095&&(b.size()==1<<h&&(h+=1),b.add(A+x)),A=x)}return f.write(b.indexOf(A),h),f.write(u,h),f.flush(),C.toByteArray()},c=function(){let l={},d=0,u={};return u.add=function(h){if(u.contains(h))throw"dup key:"+h;l[h]=d,d+=1},u.size=function(){return d},u.indexOf=function(h){return l[h]},u.contains=function(h){return typeof l[h]<"u"},u};return i},wc=function(s,t,e){let n=yc(s,t);for(let a=0;a<t;a+=1)for(let c=0;c<s;c+=1)n.setPixel(c,a,e(c,a));let o=dr();n.write(o);let i=xc(),r=o.toByteArray();for(let a=0;a<r.length;a+=1)i.writeByte(r[a]);return i.flush(),"data:image/gif;base64,"+i},ur=ht,ou=ht.stringToBytes;function hr(s){let t=ur(0,"M");t.addData(s),t.make();let e=t.getModuleCount(),n="";for(let o=0;o<e;o++)for(let i=0;i<e;i++)t.isDark(o,i)&&(n+=`M${i} ${o}h1v1h-1z`);return{size:e,d:n}}var kc=1e4,Dt=class extends we{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,n){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,n))}async newCode(){try{let e=await rr();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof tt&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),kc)}}async poll(e){let n=this.secret;if(n)try{let o=await ar(n,location.origin);if(!this.running||n!==this.secret)return;if(this.problem=null,o.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:o.auth}));return}if(o.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return T;let{size:e,d:n}=hr(or(location.origin,this.code));return m`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${ce`<path d=${n} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return m`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?ir(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${Ms}?${Ps}</span> and type the code.
          </li>
          <li>You’ll need to be a Home Assistant admin. The screen signs in as you.</li>
        </ol>
      </div>
      <div class="qr">${this.qr()}</div>
      <div class="foot">
        ${this.problem?m`<span class="problem" role="alert">${this.problem}</span>`:m`<span>${this.code?`A new code appears in ${e} minute${e===1?"":"s"}.`:"Getting a code…"}</span>`}
        <button type="button" class="link" @click=${()=>this.dispatchEvent(new CustomEvent("password"))}>
          Sign in with a password instead
        </button>
      </div>
    </div>`}};Dt.styles=He`
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
  `,Dt.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",Dt);var Ls="hassTokens";function pr(){try{let s=localStorage.getItem(Ls);return s?JSON.parse(s):null}catch{return null}}function Ds(s){try{s?localStorage.setItem(Ls,JSON.stringify(s)):localStorage.removeItem(Ls)}catch{}}function $c(s){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=s)}function Ec(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(t=>{let e=n=>{s.stop(),s.hidden=!0,t(n)};s.addEventListener("paired",n=>e(n.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function _c(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let t=location.search.includes("auth_callback");if(!t&&!pr()){let e=await Ec();e&&Ds(e)}try{let e=await Qs({hassUrl:location.origin,loadTokens:async()=>pr(),saveTokens:Ds});t&&history.replaceState(null,"",location.pathname+ls(location.search));let n=await ei({auth:e});s.backend=new zt(n),n.addEventListener("reconnect-error",(o,i)=>{i===2&&fr()})}catch(e){if(e===2){fr();return}$c(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}function fr(){Ds(null),location.replace(location.pathname+ls(location.search))}var mr=_t(location.search),gr=document.querySelector("mydashlight-keyboard");gr&&mr.keyboard!==!1&&sr(gr);mr.cursor!=="show"&&Jo();_c();
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
