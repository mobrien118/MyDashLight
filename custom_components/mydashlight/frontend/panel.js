var er=Object.defineProperty;var In=(i,t)=>()=>(i&&(t=i(i=0)),t);var tr=(i,t)=>{for(var e in t)er(i,e,{get:t[e],enumerable:!0})};function En(i){if(typeof i!="string"||!i)throw new Error("expected a non-empty string, got: "+i)}function $i(i){if(typeof i!="number")throw new Error("expected a number, got: "+i)}function va(i,t){let e=new Set,n=[];for(let o of i){let s=t(o);e.has(s)||(e.add(s),n.push(o))}return n}function mo(i){return va(i,t=>t.unicode)}function ya(i){function t(e,n,o){let s=n?i.createObjectStore(e,{keyPath:n}):i.createObjectStore(e);if(o)for(let[r,[l,d]]of Object.entries(o))s.createIndex(r,l,{multiEntry:d});return s}t(vt),t(nt,pa,{[vo]:[ha,!0],[xo]:[[ua,fa]],[wo]:[ga,!0]}),t(_i,void 0,{[yo]:[""]})}function $o(i,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>i(e.result)}async function xa(i){let t=await new Promise((e,n)=>{let o=indexedDB.open(i,da);Ti[i]=o,o.onupgradeneeded=s=>{s.oldVersion<ca&&ya(o.result)},$o(e,n,o)});return t.onclose=()=>Pi(i),t}function wa(i){return Cn[i]||(Cn[i]=xa(i)),Cn[i]}function De(i,t,e,n){return new Promise((o,s)=>{let r=i.transaction(t,e,{durability:"relaxed"}),l=typeof t=="string"?r.objectStore(t):t.map(h=>r.objectStore(h)),d;n(l,r,h=>{d=h}),r.oncomplete=()=>o(d),r.onerror=()=>s(r.error)})}function Pi(i){let t=Ti[i],e=t&&t.result;if(e){e.close();let n=Sn[i];if(n)for(let o of n)o()}delete Ti[i],delete Cn[i],delete Sn[i]}function $a(i){return new Promise((t,e)=>{Pi(i);let n=indexedDB.deleteDatabase(i);$o(t,e,n)})}function ka(i,t){let e=Sn[i];e||(e=Sn[i]=[]),e.push(t)}function bt(i){return i.split(/[\s_]+/).map(t=>!t.match(/\w/)||Ta.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function ko(i){return i.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=Ea)}function _a(i){return i.map(({annotation:e,emoticon:n,group:o,order:s,shortcodes:r,skins:l,tags:d,emoji:h,version:p})=>{let a=[...new Set(ko([...(r||[]).map(bt).flat(),...(d||[]).map(bt).flat(),...bt(e),n]))].sort(),f={annotation:e,group:o,order:s,tags:d,tokens:a,unicode:h,version:p};if(n&&(f.emoticon=n),r&&(f.shortcodes=r),l){f.skinTones=[],f.skinUnicodes=[],f.skinVersions=[];for(let{tone:x,emoji:T,version:m}of l)f.skinTones.push(x),f.skinUnicodes.push(T),f.skinVersions.push(m)}return f})}function To(i,t,e,n){i[t](e).onsuccess=o=>n&&n(o.target.result)}function tt(i,t,e){To(i,"get",t,e)}function Eo(i,t,e){To(i,"getAll",t,e)}function Si(i){i.commit&&i.commit()}function Ca(i,t){let e=i[0];for(let n=1;n<i.length;n++){let o=i[n];t(e)>t(o)&&(e=o)}return e}function _o(i,t){let e=Ca(i,o=>o.length),n=[];for(let o of e)i.some(s=>s.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function Pa(i){return!await Ai(i,vt,Pn)}async function Sa(i,t,e){let[n,o]=await Promise.all([ki,Pn].map(s=>Ai(i,vt,s)));return n===e&&o===t}async function Aa(i,t){return De(i,nt,xt,(n,o,s)=>{let r,l=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=d=>{let h=d.target.result;for(let p of h)if(r=p.unicode,t(p))return s(p);if(h.length<50)return s();l()}};l()})}async function Co(i,t,e,n){try{let o=_a(t);await De(i,[nt,vt],Ci,([s,r],l)=>{let d,h,p=0;function a(){++p===2&&f()}function f(){if(!(d===n&&h===e)){s.clear();for(let x of o)s.put(x);r.put(n,ki),r.put(e,Pn),Si(l)}}tt(r,ki,x=>{d=x,a()}),tt(r,Pn,x=>{h=x,a()})})}finally{}}async function Ma(i,t){return De(i,nt,xt,(e,n,o)=>{let s=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);Eo(e.index(xo),s,o)})}async function Po(i,t){let e=ko(bt(t));return e.length?De(i,nt,xt,(n,o,s)=>{let r=[],l=()=>{r.length===e.length&&d()},d=()=>{let h=_o(r,p=>p.unicode);s(h.sort((p,a)=>p.order<a.order?-1:1))};for(let h=0;h<e.length;h++){let p=e[h],a=h===e.length-1?IDBKeyRange.bound(p,p+"￿",!1,!0):IDBKeyRange.only(p);Eo(n.index(vo),a,f=>{r.push(f),l()})}}):[]}async function La(i,t){let e=await Po(i,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(s=>s.toLowerCase()).includes(t.toLowerCase()))[0]||null:await Aa(i,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function Da(i,t){return De(i,nt,xt,(e,n,o)=>tt(e,t,s=>{if(s)return o(s);tt(e.index(wo),t,r=>o(r||null))}))}function Ai(i,t,e){return De(i,t,xt,(n,o,s)=>tt(n,e,s))}function Ra(i,t,e,n){return De(i,t,Ci,(o,s)=>{o.put(n,e),Si(s)})}function ja(i,t){return De(i,_i,Ci,(e,n)=>tt(e,t,o=>{e.put((o||0)+1,t),Si(n)}))}function Ia(i,t,e){return e===0?[]:De(i,[_i,nt],xt,([n,o],s,r)=>{let l=[];n.index(yo).openCursor(void 0,"prev").onsuccess=d=>{let h=d.target.result;if(!h)return r(l);function p(x){if(l.push(x),l.length===e)return r(l);h.continue()}let a=h.primaryKey,f=t.byName(a);if(f)return p(f);tt(o,a,x=>{if(x)return p(x);h.continue()})}})}function za(i,t){let e=new Map;for(let o of i){let s=t(o);for(let r of s){let l=e;for(let h=0;h<r.length;h++){let p=r.charAt(h),a=l.get(p);a||(a=new Map,l.set(p,a)),l=a}let d=l.get(_n);d||(d=[],l.set(_n,d)),d.push(o)}}return(o,s)=>{let r=e;for(let h=0;h<o.length;h++){let p=o.charAt(h),a=r.get(p);if(a)r=a;else return[]}if(s)return r.get(_n)||[];let l=[],d=[r];for(;d.length;){let p=[...d.shift().entries()].sort((a,f)=>a[0]<f[0]?-1:1);for(let[a,f]of p)a===_n?l.push(...f):d.push(f)}return l}}function Ba(i){let t=i&&Array.isArray(i),e=t&&i.length&&(!i[0]||Oa.some(n=>!(n in i[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function bo(i){Ba(i);let t=(f,x)=>f.name.toLowerCase()<x.name.toLowerCase()?-1:1,e=i.sort(t),o=za(i,f=>{let x=new Set;if(f.shortcodes)for(let T of f.shortcodes)for(let m of bt(T))x.add(m);return x}),s=f=>o(f,!0),r=f=>o(f,!1),l=f=>{let x=bt(f),T=x.map((m,$)=>($<x.length-1?s:r)(m));return _o(T,m=>m.name).sort(t)},d=new Map,h=new Map;for(let f of i){h.set(f.name.toLowerCase(),f);for(let x of f.shortcodes||[])d.set(x.toLowerCase(),f)}return{all:e,search:l,byShortcode:f=>d.get(f.toLowerCase()),byName:f=>h.get(f.toLowerCase())}}function Ht(i){if(!i)return i;if(Na&&(i=structuredClone(i)),delete i.tokens,i.skinTones){let t=i.skinTones.length;i.skins=Array(t);for(let e=0;e<t;e++)i.skins[e]={tone:i.skinTones[e],unicode:i.skinUnicodes[e],version:i.skinVersions[e]};delete i.skinTones,delete i.skinUnicodes,delete i.skinVersions}return i}function So(i){i||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function Ua(i){if(!i||!Array.isArray(i)||!i[0]||typeof i[0]!="object"||Ha.some(t=>!(t in i[0])))throw new Error("Emoji data is in the wrong format")}function Ao(i,t){if(Math.floor(i.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+i.status)}async function Fa(i){let t=await fetch(i,{method:"HEAD"});Ao(t,i);let e=t.headers.get("etag");return So(e),e}async function Ei(i){let t=await fetch(i);Ao(t,i);let e=t.headers.get("etag");So(e);let n=await t.json();return Ua(n),[e,n]}function Wa(i){for(var t="",e=new Uint8Array(i),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function Ka(i){for(var t=i.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=i.charCodeAt(o);return e}async function Mo(i){let t=JSON.stringify(i),e=Ka(t),n=await crypto.subtle.digest("SHA-1",e),o=Wa(n);return btoa(o)}async function Va(i,t){let e,n=await Fa(t);if(!n){let o=await Ei(t);n=o[0],e=o[1],n||(n=await Mo(e))}await Sa(i,t,n)||(e||(e=(await Ei(t))[1]),await Co(i,e,t,n))}async function Ga(i,t){let[e,n]=await Ei(t);e||(e=await Mo(n)),await Co(i,n,t,e)}async function qa(i,t){try{await Va(i,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var da,ca,nt,vt,_i,ha,vo,pa,yo,ua,fa,xo,ki,Pn,go,xt,Ci,wo,ga,ma,ba,Ti,Cn,Sn,Ta,Ea,_n,Oa,Na,Ha,yt,Mi=In(()=>{da=1,ca=1,nt="emoji",vt="keyvalue",_i="favorites",ha="tokens",vo="tokens",pa="unicode",yo="count",ua="group",fa="order",xo="group-order",ki="eTag",Pn="url",go="skinTone",xt="readonly",Ci="readwrite",wo="skinUnicodes",ga="skinUnicodes",ma="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",ba="en";Ti={},Cn={},Sn={};Ta=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);Ea=2;_n="";Oa=["name","url"];Na=typeof wrappedJSObject<"u";Ha=["annotation","emoji","group","order","version"];yt=class{constructor({dataSource:t=ma,locale:e=ba,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=bo(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await wa(this._dbName);ka(this._dbName,this._clear);let e=this.dataSource;await Pa(t)?await Ga(t,e):this._lazyUpdate=qa(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return $i(t),await this.ready(),mo(await Ma(this._db,t)).map(Ht)}async getEmojiBySearchQuery(t){En(t),await this.ready();let e=this._custom.search(t),n=mo(await Po(this._db,t)).map(Ht);return[...e,...n]}async getEmojiByShortcode(t){En(t),await this.ready();let e=this._custom.byShortcode(t);return e||Ht(await La(this._db,t))}async getEmojiByUnicodeOrName(t){En(t),await this.ready();let e=this._custom.byName(t);return e||Ht(await Da(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await Ai(this._db,vt,go)||0}async setPreferredSkinTone(t){return $i(t),await this.ready(),Ra(this._db,vt,go,t)}async incrementFavoriteEmojiCount(t){return En(t),await this.ready(),ja(this._db,t)}async getTopFavoriteEmoji(t){return $i(t),await this.ready(),(await Ia(this._db,this._custom,t)).map(Ht)}set customEmoji(t){this._custom=bo(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await Pi(this._dbName)}async delete(){await this._shutdown(),await $a(this._dbName)}}});function Do(i){return i.unicode.includes("‍")}function il(i){let t=Ro(i,"#000"),e=Ro(i,"#fff");return t&&e&&nl(t,e)}function sl(){let i=Object.entries(Xa);try{for(let[t,e]of i)if(il(t))return e}catch{}finally{}return i[0][1]}function cl(i,t){if(t===0)return i;let e=i.indexOf(al);return e!==-1?i.substring(0,e)+String.fromCodePoint(ll+t-1)+i.substring(e):(i.endsWith(ol)&&(i=i.substring(0,i.length-1)),i+rl+String.fromCodePoint(dl+t-1))}function _e(i){i.preventDefault(),i.stopPropagation()}function ji(i,t,e){return t+=i?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function Fo(i,t){let e=new Set,n=[];for(let o of i){let s=t(o);e.has(s)||(e.add(s),n.push(o))}return n}function hl(i,t){let e=n=>{let o={};for(let s of n)typeof s.tone=="number"&&s.version<=t&&(o[s.tone]=s.unicode);return o};return i.map(({unicode:n,skins:o,shortcodes:s,url:r,name:l,category:d,annotation:h})=>({unicode:n,name:l,shortcodes:s,url:r,category:d,annotation:h,id:n||l,skins:o&&e(o)}))}function ul(i,t,e){let n;pl?(n=new ResizeObserver(e),n.observe(i)):Mn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function jo(i){{let t=document.createRange();return t.selectNode(i.firstChild),t.getBoundingClientRect().width}}function Io(i,t,e){let n=jo(t);if(!n){if(!it){it=e.cloneNode(!0);let o=getComputedStyle(e);for(let s of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])it.style.setProperty(s,o.getPropertyValue(s),"important")}try{return document.body.appendChild(it),it.firstChild.nodeValue=i,jo(it)}finally{it.remove()}}return n}function gl(i,t,e){let n=!0;for(let o of i){let s=e(o);if(!s)continue;typeof Ii>"u"&&(Ii=Io(fl,t,t));let l=Io(o.unicode,s,t)/1.8<Ii;Ni.set(o.unicode,l),l||(n=!1)}return n}function ml(i){return Fo(i,t=>t)}function bl(i){i&&(i.scrollTop=0)}function Ut(i,t,e){let n=i.get(t);return n||(n=e(),i.set(t,n)),n}function zo(i){return""+i}function vl(i){let t=document.createElement("template");return t.innerHTML=i,t}function kl(i,t){$l?i.replaceChildren(...t):(i.innerHTML="",i.append(...t))}function Tl(i,t){let e=i.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function El(i,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=Tl(n,i):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&kl(n,i)}function _l(i,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:s,attributeName:r,attributeValuePre:l,attributeValuePost:d}}=e,h=i[s];if(o!==h)if(e.currentExpression=h,r)if(h===null)n.removeAttribute(r);else{let p=l+zo(h)+d;n.setAttribute(r,p)}else{let p;Array.isArray(h)?El(h,e):h instanceof Element?(p=h,n.replaceWith(p)):n.nodeValue=zo(h),p&&(e.targetNode=p)}}}function Cl(i){let t="",e=!1,n=!1,o=-1,s=new Map,r=[],l=0;for(let h=0,p=i.length;h<p;h++){let a=i[h];if(t+=a.slice(l),h===p-1)break;for(let g=0;g<a.length;g++)switch(a.charAt(g)){case"<":{a.charAt(g+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let f=r[r.length-1],x=Ut(s,f,()=>[]),T,m,$;if(n){let g=/(\S+)="?([^"=]*)$/.exec(a);T=g[1],m=g[2];let A=/^([^">]*)("?)/.exec(i[h+1]);$=A[1],t=t.slice(0,-1*g[0].length),l=A[0].length}else l=0;let k={attributeName:T,attributeValuePre:m,attributeValuePost:$,expressionIndex:h};x.push(k),!e&&!n&&(t+=" ")}return{template:vl(t),elementsToBindings:s}}function Oo(i,t,e){for(let n=0;n<i.length;n++){let o=i[n],s=o.attributeName?t:t.firstChild,r={binding:o,targetNode:s,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Pl(i,t){let e=[],n;if(t.size===1&&(n=t.get(0)))Oo(n,i,e);else{let o=document.createTreeWalker(i,NodeFilter.SHOW_ELEMENT),s=i,r=-1;do{let l=t.get(++r);l&&Oo(l,s,e)}while(s=o.nextNode())}return e}function Sl(i){let{template:t,elementsToBindings:e}=Ut(yl,i,()=>Cl(i)),n=t.cloneNode(!0).content.firstElementChild,o=Pl(n,e);return function(r){return _l(r,o),n}}function Al(i){let t=Ut(xl,i,()=>new Map),e=wl;function n(s,...r){let l=Ut(t,s,()=>new Map);return Ut(l,e,()=>Sl(s))(r)}function o(s,r,l){return s.map((d,h)=>{let p=e;e=l(d);try{return r(d,h)}finally{e=p}})}return{map:o,html:n}}function Ml(i,t,e,n,o,s,r,l,d){let{labelWithSkin:h,titleForEmoji:p,unicodeWithSkin:a}=e,{html:f,map:x}=Al(t);function T(g,A,D){return x(g,(H,te)=>f`<button role="${A?"option":"menuitem"}" aria-selected="${A?te===t.activeSearchItem:null}" aria-label="${h(H,t.currentSkinTone)}" title="${p(H)}" class="${"emoji"+(A&&te===t.activeSearchItem?" active":"")+(H.unicode?"":" custom-emoji")}" id="${`${D}-${H.id}`}" style="${H.unicode?null:`--custom-emoji-background: url(${JSON.stringify(H.url)})`}">${H.unicode?a(H,t.currentSkinTone):""}</button>`,H=>`${D}-${H.id}`)}let $=f`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${x(t.skinTones,(g,A)=>f`<div id="skintone-${A}" class="emoji ${A===t.activeSkinTone?"active":""}" aria-selected="${A===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[A]}" aria-label="${t.i18n.skinTones[A]}">${g}</div>`,g=>g)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${x(t.groups,g=>f`<button role="tab" class="nav-button" aria-controls="tab-${g.id}" aria-label="${t.i18n.categories[g.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===g.id}" title="${t.i18n.categories[g.name]}" data-group-id="${g.id}"><div class="nav-emoji emoji">${g.emoji}</div></button>`,g=>g.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${x(t.currentEmojisWithCategories,(g,A)=>f`<div><div id="menu-label-${A}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:g.category?g.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${A!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(g.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${A}" id="${t.searchMode?"search-results":null}">${T(g.emojis,t.searchMode,"emo")}</div></div>`,g=>g.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${T(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,k=(g,A)=>{for(let D of i.querySelectorAll(`[${g}]`))A(D,D.getAttribute(g))};if(d){i.appendChild($);for(let g of["click","focusout","input","keydown","keyup"])k(`data-on-${g}`,(A,D)=>{A.addEventListener(g,n[D])});k("data-ref",(g,A)=>{s[A]=g}),r.addEventListener("abort",()=>{i.removeChild($)})}k("data-action",(g,A)=>{let D=l.get(A);D||l.set(A,D=new WeakSet),D.has(g)||(D.add(g),o[A](g))})}function Ll(i){let t=!1,e,n=new Map,o=new Set,s,r=()=>{if(t)return;let h=[...o];o.clear();try{for(let p of h)p()}finally{s=!1,o.size&&(s=!0,Ln(r))}},l=new Proxy({},{get(h,p){if(e){let a=n.get(p);a||(a=new Set,n.set(p,a)),a.add(e)}return h[p]},set(h,p,a){if(h[p]!==a){h[p]=a;let f=n.get(p);if(f){for(let x of f)o.add(x);s||(s=!0,Ln(r))}}return!0}}),d=h=>{let p=()=>{let a=e;e=p;try{return h()}finally{e=a}};return p()};return i.addEventListener("abort",()=>{t=!0}),{state:l,createEffect:d}}function zi(i,t,e){if(i.length!==t.length)return!1;for(let n=0;n<i.length;n++)if(!e(i[n],t[n]))return!1;return!0}function Dl(i,t,e){{let n=i.closest(".tabpanel"),o=Bo.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),Bo.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(i)}}function Rl(i,t){let e={},n=new AbortController,o=n.signal,{state:s,createEffect:r}=Ll(o),l=new Map;An(s,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),An(s,t),An(s,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:Qa,isRtl:!1,currentGroupIndex:0,groups:Li,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{s.currentGroup!==s.groups[s.currentGroupIndex]&&(s.currentGroup=s.groups[s.currentGroupIndex])});let d=c=>{i.getElementById(c).focus()},h=c=>i.getElementById(`emo-${c.id}`),p=(c,v)=>{e.rootElement.dispatchEvent(new CustomEvent(c,{detail:v,bubbles:!0,composed:!0}))},a=(c,v)=>c.id===v.id,f=(c,v)=>{let{category:b,emojis:y}=c,{category:C,emojis:S}=v;return b!==C?!1:zi(y,S,a)},x=c=>{zi(s.currentEmojis,c,a)||(s.currentEmojis=c)},T=c=>{s.searchMode!==c&&(s.searchMode=c)},m=c=>{zi(s.currentEmojisWithCategories,c,f)||(s.currentEmojisWithCategories=c)},$=(c,v)=>v&&c.skins&&c.skins[v]||c.unicode,A={labelWithSkin:(c,v)=>ml([c.name||$(c,v),c.annotation,...c.shortcodes||Oi].filter(Boolean)).join(", "),titleForEmoji:c=>c.annotation||(c.shortcodes||Oi).join(", "),unicodeWithSkin:$},D={onClickSkinToneButton:he,onEmojiClick:Q,onNavClick:Ie,onNavKeydown:Ue,onSearchKeydown:He,onSkinToneOptionsClick:G,onSkinToneOptionsFocusOut:pe,onSkinToneOptionsKeydown:oe,onSkinToneOptionsKeyup:We,onSearchInput:Pe},H={calculateEmojiGridStyle:N,updateOnIntersection:Ce},te=!0;r(()=>{Ml(i,s,A,D,H,e,o,l,te),te=!1}),s.emojiVersion||Ri().then(c=>{c||(s.message=s.i18n.emojiUnsupportedMessage)}),r(()=>{async function c(){let v=!1,b=setTimeout(()=>{v=!0,s.message=s.i18n.loadingMessage},Za);try{await s.database.ready(),s.databaseLoaded=!0}catch(y){console.error(y),s.message=s.i18n.networkErrorMessage}finally{clearTimeout(b),v&&(v=!1,s.message="")}}s.database&&c()}),r(()=>{s.pickerStyle=`
      --num-groups: ${s.groups.length}; 
      --indicator-opacity: ${s.searchMode?0:1}; 
      --num-skintones: ${Lo};`}),r(()=>{s.customEmoji&&s.database&&ae()}),r(()=>{s.customEmoji&&s.customEmoji.length?s.groups!==Bi&&(s.groups=Bi):s.groups!==Li&&(s.currentGroupIndex&&s.currentGroupIndex--,s.groups=Li)}),r(()=>{async function c(){s.databaseLoaded&&(s.currentSkinTone=await s.database.getPreferredSkinTone())}c()}),r(()=>{s.skinTones=Array(Lo).fill().map((c,v)=>cl(s.skinToneEmoji,v))}),r(()=>{s.skinToneButtonText=s.skinTones[s.currentSkinTone]}),r(()=>{s.skinToneButtonLabel=s.i18n.skinToneLabel.replace("{skinTone}",s.i18n.skinTones[s.currentSkinTone])}),r(()=>{async function c(){let{database:v}=s,b=(await Promise.all(el.map(y=>v.getEmojiByUnicodeOrName(y)))).filter(Boolean);s.defaultFavoriteEmojis=b}s.databaseLoaded&&c()});function ae(){let{customEmoji:c,database:v}=s,b=c||Oi;v.customEmoji!==b&&(v.customEmoji=b)}r(()=>{async function c(){ae();let{database:v,defaultFavoriteEmojis:b,numColumns:y}=s,C=await v.getTopFavoriteEmoji(y),S=await le(Fo([...C,...b],M=>M.unicode||M.name).slice(0,y));s.currentFavorites=S}s.databaseLoaded&&s.defaultFavoriteEmojis&&c()});function N(c){ul(c,o,()=>{{let v=getComputedStyle(e.rootElement),b=parseInt(v.getPropertyValue("--num-columns"),10),y=v.getPropertyValue("direction")==="rtl";s.numColumns=b,s.isRtl=y}})}function Ce(c){Dl(c,o,v=>{for(let{target:b,isIntersecting:y}of v)b.classList.toggle("onscreen",y)})}r(()=>{async function c(){let{searchText:v,currentGroup:b,databaseLoaded:y,customEmoji:C}=s;if(!y)s.currentEmojis=[],s.searchMode=!1;else if(v.length>=Ya){let S=await je(v);s.searchText===v&&(x(S),T(!0))}else{let{id:S}=b;if(S!==-1||C&&C.length){let M=await Re(S);s.currentGroup.id===S&&(x(M),T(!1))}}}c()});let ge=()=>{Mn(()=>bl(e.tabpanelElement))};r(()=>{let{currentEmojis:c,emojiVersion:v}=s,b=c.filter(y=>y.unicode).filter(y=>Do(y)&&!Ni.has(y.unicode));if(!v&&b.length)x(c),Mn(()=>Be(b));else{let y=v?c:c.filter(ve);x(y),ge()}});function Be(c){gl(c,e.baselineEmoji,h)?ge():s.currentEmojis=[...s.currentEmojis]}function ve(c){return!c.unicode||!Do(c)||Ni.get(c.unicode)}async function Ne(c){let v=s.emojiVersion||await Ri();return c.filter(({version:b})=>!b||b<=v)}async function le(c){return hl(c,s.emojiVersion||await Ri())}async function Re(c){let v=c===-1?s.customEmoji:await s.database.getEmojiByGroup(c);return le(await Ne(v))}async function je(c){return le(await Ne(await s.database.getEmojiBySearchQuery(c)))}r(()=>{}),r(()=>{function c(){let{searchMode:b,currentEmojis:y}=s;if(b)return[{category:"",emojis:y}];let C=new Map;for(let S of y){let M=S.category||"",z=C.get(M);z||(z=[],C.set(M,z)),z.push(S)}return[...C.entries()].map(([S,M])=>({category:S,emojis:M})).sort((S,M)=>s.customCategorySorting(S.category,M.category))}let v=c();m(v)}),r(()=>{s.activeSearchItemId=s.activeSearchItem!==-1&&s.currentEmojis[s.activeSearchItem].id}),r(()=>{let{rawSearchText:c}=s;Ho(()=>{s.searchText=(c||"").trim(),s.activeSearchItem=-1})});function He(c){if(!s.searchMode||!s.currentEmojis.length)return;let v=b=>{_e(c),s.activeSearchItem=ji(b,s.activeSearchItem,s.currentEmojis)};switch(c.key){case"ArrowDown":return v(!1);case"ArrowUp":return v(!0);case"Enter":if(s.activeSearchItem===-1)s.activeSearchItem=0;else return _e(c),Fe(s.currentEmojis[s.activeSearchItem].id)}}function Ie(c){let{target:v}=c,b=v.closest(".nav-button");if(!b)return;let y=parseInt(b.dataset.groupId,10);e.searchElement.value="",s.rawSearchText="",s.searchText="",s.activeSearchItem=-1,s.currentGroupIndex=s.groups.findIndex(C=>C.id===y)}function Ue(c){let{target:v,key:b}=c,y=C=>{C&&(_e(c),C.focus())};switch(b){case"ArrowLeft":return y(v.previousElementSibling);case"ArrowRight":return y(v.nextElementSibling);case"Home":return y(v.parentElement.firstElementChild);case"End":return y(v.parentElement.lastElementChild)}}async function ze(c){let v=await s.database.getEmojiByUnicodeOrName(c),b=[...s.currentEmojis,...s.currentFavorites].find(C=>C.id===c),y=b.unicode&&$(b,s.currentSkinTone);return await s.database.incrementFavoriteEmojiCount(c),{emoji:v,skinTone:s.currentSkinTone,...y&&{unicode:y},...b.name&&{name:b.name}}}async function Fe(c){let v=ze(c);p("emoji-click-sync",v),p("emoji-click",await v)}function Q(c){let{target:v}=c;if(!v.classList.contains("emoji"))return;_e(c);let b=v.id.substring(4);Fe(b)}function ye(c){s.currentSkinTone=c,s.skinTonePickerExpanded=!1,d("skintone-button"),p("skin-tone-change",{skinTone:c}),s.database.setPreferredSkinTone(c)}function G(c){let{target:{id:v}}=c,b=v&&v.match(/^skintone-(\d)/);if(!b)return;_e(c);let y=parseInt(b[1],10);ye(y)}function he(c){s.skinTonePickerExpanded=!s.skinTonePickerExpanded,s.activeSkinTone=s.currentSkinTone,s.skinTonePickerExpanded&&(_e(c),Mn(()=>d("skintone-list")))}r(()=>{s.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{s.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):s.skinTonePickerExpandedAfterAnimation=!1});function oe(c){if(!s.skinTonePickerExpanded)return;let v=async b=>{_e(c),s.activeSkinTone=b};switch(c.key){case"ArrowUp":return v(ji(!0,s.activeSkinTone,s.skinTones));case"ArrowDown":return v(ji(!1,s.activeSkinTone,s.skinTones));case"Home":return v(0);case"End":return v(s.skinTones.length-1);case"Enter":return _e(c),ye(s.activeSkinTone);case"Escape":return _e(c),s.skinTonePickerExpanded=!1,d("skintone-button")}}function We(c){if(s.skinTonePickerExpanded)switch(c.key){case" ":return _e(c),ye(s.activeSkinTone)}}async function pe(c){let{relatedTarget:v}=c;(!v||v.id!=="skintone-list")&&(s.skinTonePickerExpanded=!1)}function Pe(c){s.rawSearchText=c.target.value}return{$set(c){An(s,c)},$destroy(){n.abort()}}}function No(i){i instanceof st||Object.setPrototypeOf(i,customElements.get(i.tagName.toLowerCase()).prototype)}var Bi,Li,Ya,Lo,Ho,Xa,Za,Ja,Qa,el,Uo,tl,Ro,nl,Di,Ri,Ni,ol,rl,al,ll,dl,Mn,pl,fl,Ii,it,yl,xl,wl,$l,Ln,Bo,Oi,An,jl,Il,zl,Ol,Wo,Bl,st,Ko,Vo=In(()=>{Mi();Bi=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([i,t,e])=>({id:i,emoji:t,name:e})),Li=Bi.slice(1),Ya=2,Lo=6,Ho=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;Xa={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},Za=1e3,Ja="🖐️",Qa=8,el=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],Uo='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',tl=(i,t)=>i<t?-1:i>t?1:0,Ro=(i,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${Uo}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(i,0,0),n.getImageData(0,0,1,1).data},nl=(i,t)=>{let e=[...i].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};Ri=()=>(Di||(Di=new Promise(i=>Ho(()=>i(sl())))),Di),Ni=new Map,ol="️",rl="\uD83C",al="‍",ll=127995,dl=57339;Mn=requestAnimationFrame,pl=typeof ResizeObserver=="function";fl="😀";yl=new WeakMap,xl=new WeakMap,wl=Symbol("un-keyed"),$l="replaceChildren"in Element.prototype;Ln=typeof queueMicrotask=="function"?queueMicrotask:i=>Promise.resolve().then(i);Bo=new WeakMap;Oi=[],{assign:An}=Object;jl="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Il="en",zl={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},Ol=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',Wo=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],Bl=`:host{--emoji-font-family:${Uo}}`,st=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Ol+Bl,this.shadowRoot.appendChild(e),this._ctx={locale:Il,dataSource:jl,skinToneEmoji:Ja,customCategorySorting:tl,customEmoji:null,i18n:zl,emojiVersion:null,...t};for(let n of Wo)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){No(this),this._cmp||(this._cmp=Rl(this.shadowRoot,this._ctx))}disconnectedCallback(){No(this),Ln(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,s)=>s.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new yt({locale:t,dataSource:e}))}_dbFlush(){Ln(()=>this._dbCreate())}},Ko={};for(let i of Wo)Ko[i]={get(){return i==="database"&&this._dbCreate(),this._ctx[i]},set(t){if(i==="database")throw new Error("database is read-only");this._set(i,t)}};Object.defineProperties(st.prototype,Ko);customElements.get("emoji-picker")||customElements.define("emoji-picker",st)});var Go={};tr(Go,{Database:()=>yt,Picker:()=>st});var qo=In(()=>{Vo();Mi()});var Yt=globalThis,Xt=Yt.ShadowRoot&&(Yt.ShadyCSS===void 0||Yt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,zn=Symbol(),Zi=new WeakMap,Tt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==zn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Xt&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Zi.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Zi.set(e,t))}return t}toString(){return this.cssText}},Ji=i=>new Tt(typeof i=="string"?i:i+"",void 0,zn),Ke=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((n,o,s)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+i[s+1],i[0]);return new Tt(e,i,zn)},Qi=(i,t)=>{if(Xt)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=Yt.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,i.appendChild(n)}},On=Xt?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Ji(e)})(i):i;var{is:nr,defineProperty:ir,getOwnPropertyDescriptor:sr,getOwnPropertyNames:or,getOwnPropertySymbols:rr,getPrototypeOf:ar}=Object,Zt=globalThis,es=Zt.trustedTypes,lr=es?es.emptyScript:"",dr=Zt.reactiveElementPolyfillSupport,Et=(i,t)=>i,Bn={toAttribute(i,t){switch(t){case Boolean:i=i?lr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ns=(i,t)=>!nr(i,t),ts={attribute:!0,type:String,converter:Bn,reflect:!1,useDefault:!1,hasChanged:ns};Symbol.metadata??=Symbol("metadata"),Zt.litPropertyMetadata??=new WeakMap;var Se=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ts){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&ir(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:s}=sr(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let l=o?.call(this);s?.call(this,r),this.requestUpdate(t,l,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ts}static _$Ei(){if(this.hasOwnProperty(Et("elementProperties")))return;let t=ar(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Et("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Et("properties"))){let e=this.properties,n=[...or(e),...rr(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(On(o))}else t!==void 0&&e.push(On(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Qi(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let s=(n.converter?.toAttribute!==void 0?n.converter:Bn).toAttribute(e,n.type);this._$Em=t,s==null?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let s=n.getPropertyOptions(o),r=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Bn;this._$Em=o;let l=r.fromAttribute(e,s.type);this[o]=l??this._$Ej?.get(o)??l,this._$Em=null}}requestUpdate(t,e,n,o=!1,s){if(t!==void 0){let r=this.constructor;if(o===!1&&(s=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??ns)(s,e)||n.useDefault&&n.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:s},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),s!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,s]of this._$Ep)this[o]=s;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,s]of n){let{wrapped:r}=s,l=this[o];r!==!0||this._$AL.has(o)||l===void 0||this.C(o,void 0,s,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Se.elementStyles=[],Se.shadowRootOptions={mode:"open"},Se[Et("elementProperties")]=new Map,Se[Et("finalized")]=new Map,dr?.({ReactiveElement:Se}),(Zt.reactiveElementVersions??=[]).push("2.1.2");var Hn=globalThis,is=i=>i,Jt=Hn.trustedTypes,ss=Jt?Jt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Un="$lit$",Ae=`lit$${Math.random().toFixed(9).slice(2)}$`,Fn="?"+Ae,cr=`<${Fn}>`,qe=document,Ct=()=>qe.createComment(""),Pt=i=>i===null||typeof i!="object"&&typeof i!="function",Wn=Array.isArray,cs=i=>Wn(i)||typeof i?.[Symbol.iterator]=="function",Nn=`[ 	
\f\r]`,_t=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,os=/-->/g,rs=/>/g,Ve=RegExp(`>|${Nn}(?:([^\\s"'>=/]+)(${Nn}*=${Nn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),as=/'/g,ls=/"/g,hs=/^(?:script|style|textarea|title)$/i,Kn=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),u=Kn(1),Y=Kn(2),ad=Kn(3),Me=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),ds=new WeakMap,Ge=qe.createTreeWalker(qe,129);function ps(i,t){if(!Wn(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ss!==void 0?ss.createHTML(t):t}var us=(i,t)=>{let e=i.length-1,n=[],o,s=t===2?"<svg>":t===3?"<math>":"",r=_t;for(let l=0;l<e;l++){let d=i[l],h,p,a=-1,f=0;for(;f<d.length&&(r.lastIndex=f,p=r.exec(d),p!==null);)f=r.lastIndex,r===_t?p[1]==="!--"?r=os:p[1]!==void 0?r=rs:p[2]!==void 0?(hs.test(p[2])&&(o=RegExp("</"+p[2],"g")),r=Ve):p[3]!==void 0&&(r=Ve):r===Ve?p[0]===">"?(r=o??_t,a=-1):p[1]===void 0?a=-2:(a=r.lastIndex-p[2].length,h=p[1],r=p[3]===void 0?Ve:p[3]==='"'?ls:as):r===ls||r===as?r=Ve:r===os||r===rs?r=_t:(r=Ve,o=void 0);let x=r===Ve&&i[l+1].startsWith("/>")?" ":"";s+=r===_t?d+cr:a>=0?(n.push(h),d.slice(0,a)+Un+d.slice(a)+Ae+x):d+Ae+(a===-2?l:x)}return[ps(i,s+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},St=class i{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let s=0,r=0,l=t.length-1,d=this.parts,[h,p]=us(t,e);if(this.el=i.createElement(h,n),Ge.currentNode=this.el.content,e===2||e===3){let a=this.el.content.firstChild;a.replaceWith(...a.childNodes)}for(;(o=Ge.nextNode())!==null&&d.length<l;){if(o.nodeType===1){if(o.hasAttributes())for(let a of o.getAttributeNames())if(a.endsWith(Un)){let f=p[r++],x=o.getAttribute(a).split(Ae),T=/([.?@])?(.*)/.exec(f);d.push({type:1,index:s,name:T[2],strings:x,ctor:T[1]==="."?en:T[1]==="?"?tn:T[1]==="@"?nn:Xe}),o.removeAttribute(a)}else a.startsWith(Ae)&&(d.push({type:6,index:s}),o.removeAttribute(a));if(hs.test(o.tagName)){let a=o.textContent.split(Ae),f=a.length-1;if(f>0){o.textContent=Jt?Jt.emptyScript:"";for(let x=0;x<f;x++)o.append(a[x],Ct()),Ge.nextNode(),d.push({type:2,index:++s});o.append(a[f],Ct())}}}else if(o.nodeType===8)if(o.data===Fn)d.push({type:2,index:s});else{let a=-1;for(;(a=o.data.indexOf(Ae,a+1))!==-1;)d.push({type:7,index:s}),a+=Ae.length-1}s++}}static createElement(t,e){let n=qe.createElement("template");return n.innerHTML=t,n}};function Ye(i,t,e=i,n){if(t===Me)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,s=Pt(t)?void 0:t._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),s===void 0?o=void 0:(o=new s(i),o._$AT(i,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=Ye(i,o._$AS(i,t.values),o,n)),t}var Qt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??qe).importNode(e,!0);Ge.currentNode=o;let s=Ge.nextNode(),r=0,l=0,d=n[0];for(;d!==void 0;){if(r===d.index){let h;d.type===2?h=new rt(s,s.nextSibling,this,t):d.type===1?h=new d.ctor(s,d.name,d.strings,this,t):d.type===6&&(h=new sn(s,this,t)),this._$AV.push(h),d=n[++l]}r!==d?.index&&(s=Ge.nextNode(),r++)}return Ge.currentNode=qe,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},rt=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Ye(this,t,e),Pt(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==Me&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):cs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==w&&Pt(this._$AH)?this._$AA.nextSibling.data=t:this.T(qe.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=St.createElement(ps(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let s=new Qt(o,this),r=s.u(this.options);s.p(e),this.T(r),this._$AH=s}}_$AC(t){let e=ds.get(t.strings);return e===void 0&&ds.set(t.strings,e=new St(t)),e}k(t){Wn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let s of t)o===e.length?e.push(n=new i(this.O(Ct()),this.O(Ct()),this,this.options)):n=e[o],n._$AI(s),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=is(t).nextSibling;is(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Xe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,s){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=w}_$AI(t,e=this,n,o){let s=this.strings,r=!1;if(s===void 0)t=Ye(this,t,e,0),r=!Pt(t)||t!==this._$AH&&t!==Me,r&&(this._$AH=t);else{let l=t,d,h;for(t=s[0],d=0;d<s.length-1;d++)h=Ye(this,l[n+d],e,d),h===Me&&(h=this._$AH[d]),r||=!Pt(h)||h!==this._$AH[d],h===w?t=w:t!==w&&(t+=(h??"")+s[d+1]),this._$AH[d]=h}r&&!o&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},en=class extends Xe{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}},tn=class extends Xe{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}},nn=class extends Xe{constructor(t,e,n,o,s){super(t,e,n,o,s),this.type=5}_$AI(t,e=this){if((t=Ye(this,t,e,0)??w)===Me)return;let n=this._$AH,o=t===w&&n!==w||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,s=t!==w&&(n===w||o);o&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},sn=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Ye(this,t)}},fs={M:Un,P:Ae,A:Fn,C:1,L:us,R:Qt,D:cs,V:Ye,I:rt,H:Xe,N:tn,U:nn,B:en,F:sn},hr=Hn.litHtmlPolyfillSupport;hr?.(St,rt),(Hn.litHtmlVersions??=[]).push("3.3.3");var gs=(i,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let s=e?.renderBefore??null;n._$litPart$=o=new rt(t.insertBefore(Ct(),s),s,void 0,e??{})}return o._$AI(i),o};var Vn=globalThis,ue=class extends Se{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=gs(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Me}};ue._$litElement$=!0,ue.finalized=!0,Vn.litElementHydrateSupport?.({LitElement:ue});var pr=Vn.litElementPolyfillSupport;pr?.({LitElement:ue});(Vn.litElementVersions??=[]).push("4.2.2");var at="mydashlight",xd=`/api/${at}/pair`,wd=`/api/${at}/pair/poll`,$d=`/${at}`,At="pair";function ms(i){return i.length>4?`${i.slice(0,4)}-${i.slice(4)}`:i}function Gn(i){return i.toUpperCase().replace(/[^A-Z0-9]/g,"")}function bs(i){let t=new URLSearchParams(i);return t.has(At)?Gn(t.get(At)??""):null}function ur(i){if(i<60)return"just now";let t=Math.round(i/60);return`${t} minute${t===1?"":"s"} ago`}var Mt=class extends ue{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let n=await this.connection.sendMessagePromise({type:`${at}/pair/check`,code:e});n.found?(this.waiting=n,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(n){this.error=this.message(n),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${at}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let n=e?.code;return n==="unauthorized"?"Only a Home Assistant admin can pair a screen.":n==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":n==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return u`<form @submit=${o=>{o.preventDefault();let s=Gn(this.typed);s&&this.check(s)}}>
      <h2>Pair a screen</h2>
      <p>Type the code the screen is showing.</p>
      ${this.error?u`<p class="error" role="alert">${this.error}</p>`:w}
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
    </form>`}confirm(){let e=this.waiting,n=this.step==="approving",o=e.home===!1;return u`<h2>Allow this screen?</h2>
      <p class="code">${ms(e.code??"")}</p>
      ${o?u`<p class="warning" role="alert">
            <b>This code came from outside your home network.</b> Only allow it if you can see this code on a
            screen of your own right now. If someone sent you this code or link, press Cancel.
          </p>`:w}
      <p>
        A screen at ${e.address} asked ${ur(e.age??0)}. Check the code matches the one on the screen. It will be
        signed in to Home Assistant as <b>${this.userName||"you"}</b>.
      </p>
      <p>To sign it out later, delete its entry under Refresh tokens on your Home Assistant profile’s Security tab.</p>
      <div class="actions">
        <button type="button" @click=${()=>this.close()} ?disabled=${n}>Cancel</button>
        <button type="button" class="dark" @click=${()=>void this.approve()} ?disabled=${n}>
          ${n?"Allowing…":o?"Allow anyway":"Allow"}
        </button>
      </div>`}render(){let e;return this.isAdmin?this.step==="done"?e=u`<h2>Screen paired</h2>
        <p>It will open the board in a few seconds.</p>
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Done</button></div>`:this.step==="confirm"||this.step==="approving"?e=this.confirm():e=this.enter():e=u`<h2>Pair a screen</h2>
        <p>Only a Home Assistant admin can pair a screen. Ask an admin to scan the code instead.</p>
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Close</button></div>`,u`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${e}</div>`}};Mt.styles=Ke`
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
  `,Mt.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",Mt);function R(i){let t=Math.round(i),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function Le(i){let t=Math.floor(Math.round(i)/60)%24;return`${R(i)} ${t<12?"AM":"PM"}`}function vs(i){let t=Math.floor(i/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function lt(i){let t=Math.max(0,Math.round(i)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function rn(i){return i?`${lt(Math.abs(i))} ${i<0?"early":"late"}`:"on time"}function qn(i){let t=Math.floor(i/60)%24,e=i%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var fr=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),gr=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),mr=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function on(i){return new Date(`${i}T12:00:00Z`)}function me(i){let t=on(i);return`${fr.format(t)}, ${mr.format(t)}`}function se(i){return gr.format(on(i))}function $e(i,t){return Math.round((on(t).getTime()-on(i).getTime())/864e5)}function Lt(i,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:i,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return Lt("UTC",t)}let n=o=>e.find(s=>s.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function an(i,t,e){let n=Math.floor((t.getTime()-i.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=Lt(e,i),s=Lt(e,t).date;return o.date===s?`at ${Le(o.minutes)}`:`on ${se(o.date)} at ${Le(o.minutes)}`}var K=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}};function ws(i){switch(i.code){case"connection_lost":case"timeout":return"Can’t reach Home Assistant";case"not_running":return"MyDashLight isn’t running";default:return"Couldn’t get the latest plan"}}var Ze="mydashlight",br=7,Yn=3e4,ys=3e4;function Xn(i){if(i instanceof K)return i;if(i&&typeof i=="object"){let t=i;if(typeof t.message=="string")return new K(String(t.code??"error"),t.message)}return typeof i=="number"?new K("connection_lost","Lost the connection to Home Assistant."):new K("error",String(i))}function xs(i,t){return new Promise((e,n)=>{let o=setTimeout(()=>n(new K("timeout","Home Assistant didn’t answer.")),t);i.then(s=>{clearTimeout(o),e(s)},s=>{clearTimeout(o),n(s)})})}var Dt=class{constructor(t,e,n,o){this.live=!1;this.unsub=null;this.opening=!1;this.gen=0;this.closed=!1;this.onReady=()=>this.open();this.onDisconnected=()=>this.dropped();this.conn=t,this.type=e,this.onMessage=n,this.onFailed=o,t.addEventListener?.("ready",this.onReady),t.addEventListener?.("disconnected",this.onDisconnected)}get isOpen(){return this.unsub!==null||this.opening}open(){if(this.closed||this.isOpen||this.conn.connected===!1)return;let t=++this.gen;this.opening=!0,this.conn.subscribeMessage(e=>{t===this.gen&&(this.live=!0,this.onMessage(e))},{type:this.type},{resubscribe:!1}).then(e=>{if(t!==this.gen){e().catch(()=>{});return}this.opening=!1,this.unsub=e},e=>{t===this.gen&&(this.opening=!1,this.live=!1,this.onFailed(e))})}dropped(){this.gen++,this.opening=!1,this.unsub=null,this.live=!1}close(){this.closed=!0,this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsub;this.dropped(),t&&t().catch(()=>{})}},ln=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.rides=null;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new K("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.rides?.live??!1}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.rides=new Dt(this.conn,`${Ze}/rides/subscribe`,t=>{t.plan?this.emit(t.plan):this.fail(new K("not_running","MyDashLight isn’t running right now."))},()=>{}),this.rides.open(),this.timer=setInterval(()=>{this.live||(this.refresh(),this.rides?.open())},Yn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected),this.rides?.close(),this.rides=null}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await xs(this.conn.sendMessagePromise({type:"call_service",domain:Ze,service:"get_plan",service_data:{days:br},return_response:!0}),ys);this.emit(t.response)}catch(t){this.fail(Xn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ze,service:t,service_data:e})}catch(n){throw Xn(n)}this.live||await this.refresh()}setRide(t,e,n,o,s){return this.call("set_ride",s===void 0?{event:t,side:e,driver:n,scope:o}:{event:t,side:e,driver:n,scope:o,stay:s})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:qn(e),scope:n})}setLeaveBy(t,e,n){return this.call("set_leave_by",e==null?{event:t,scope:n}:{event:t,time:qn(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}setPeople(t,e,n){return this.call("set_people",{event:t,people:e,scope:n})}watchChores(t){let e=!1,n=!1,o=async()=>{try{let l=await xs(this.conn.sendMessagePromise({type:"call_service",domain:Ze,service:"get_chores",service_data:{},return_response:!0}),ys);if(e)return;n=!0,t(l.response??null)}catch{!e&&!n&&t(null)}},s=new Dt(this.conn,`${Ze}/chores/subscribe`,l=>{e||(n=!0,t(l.chores))},()=>void o());s.open();let r=setInterval(()=>{s.live||s.open()},Yn);return()=>{e=!0,clearInterval(r),s.close()}}watchLunch(t){let e=!1,n=!1,o=new Dt(this.conn,`${Ze}/lunch/subscribe`,r=>{e||(n=!0,t(r.lunch))},()=>{!e&&!n&&t(null)});o.open();let s=setInterval(()=>{o.live||o.open()},Yn);return()=>{e=!0,clearInterval(s),o.close()}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ze,service:t,service_data:e})}catch(n){throw Xn(n)}}};var $s={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ks=i=>(...t)=>({_$litDirective$:i,values:t}),dn=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:vr}=fs,Ts=i=>i;var Es=()=>document.createComment(""),dt=(i,t,e)=>{let n=i._$AA.parentNode,o=t===void 0?i._$AB:t._$AA;if(e===void 0){let s=n.insertBefore(Es(),o),r=n.insertBefore(Es(),o);e=new vr(s,r,i,i.options)}else{let s=e._$AB.nextSibling,r=e._$AM,l=r!==i;if(l){let d;e._$AQ?.(i),e._$AM=i,e._$AP!==void 0&&(d=i._$AU)!==r._$AU&&e._$AP(d)}if(s!==o||l){let d=e._$AA;for(;d!==s;){let h=Ts(d).nextSibling;Ts(n).insertBefore(d,o),d=h}}}return e},Oe=(i,t,e=i)=>(i._$AI(t,e),i),yr={},_s=(i,t=yr)=>i._$AH=t,Cs=i=>i._$AH,cn=i=>{i._$AR(),i._$AA.remove()};var Ps=(i,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(i[o],o);return n},ke=ks(class extends dn{constructor(i){if(super(i),i.type!==$s.CHILD)throw Error("repeat() can only be used in text expressions")}dt(i,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],s=[],r=0;for(let l of i)o[r]=n?n(l,r):r,s[r]=e(l,r),r++;return{values:s,keys:o}}render(i,t,e){return this.dt(i,t,e).values}update(i,[t,e,n]){let o=Cs(i),{values:s,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,s;let l=this.ut??=[],d=[],h,p,a=0,f=o.length-1,x=0,T=s.length-1;for(;a<=f&&x<=T;)if(o[a]===null)a++;else if(o[f]===null)f--;else if(l[a]===r[x])d[x]=Oe(o[a],s[x]),a++,x++;else if(l[f]===r[T])d[T]=Oe(o[f],s[T]),f--,T--;else if(l[a]===r[T])d[T]=Oe(o[a],s[T]),dt(i,d[T+1],o[a]),a++,T--;else if(l[f]===r[x])d[x]=Oe(o[f],s[x]),dt(i,o[a],o[f]),f--,x++;else if(h===void 0&&(h=Ps(r,x,T),p=Ps(l,a,f)),h.has(l[a]))if(h.has(l[f])){let m=p.get(r[x]),$=m!==void 0?o[m]:null;if($===null){let k=dt(i,o[a]);Oe(k,s[x]),d[x]=k}else d[x]=Oe($,s[x]),dt(i,o[a],$),o[m]=null;x++}else cn(o[f]),f--;else cn(o[a]),a++;for(;x<=T;){let m=dt(i,d[T+1]);Oe(m,s[x]),d[x++]=m}for(;a<=f;){let m=o[a++];m!==null&&cn(m)}return this.ut=r,_s(i,d),Me}});var hn=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function Z(i){return hn[(i%hn.length+hn.length)%hn.length]}var pn="#23272E",Zn="35,39,46";var Jn=3,zt=36,Qn=12,un=8,Ss=30,Te=16,Rt=100,ht=60,xr=120,As=44,Ms=20,wr=45,$r=30,Ls=20,ti=10,gn=30,ni=10,kr=150,Tr=150,bn=1;function Ns(i,t){return i.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??zt}function Er(i,t,e){return 10+10.2*i.length+(t?30+8*t.length:0)+8+12+6.8*e.length+12+4}var _r=26,Hs=4;function si(i,t){let e=Math.max(kr,Tr/bn);return Math.ceil(ht+Math.max(0,i-1)*ti+gn+Math.max(0,t-1)*ni+e*(i+bn*t))}function fe(i){return i.people?i.people.kids.map(t=>t.id):i.days.length?Object.keys(i.days[0].kids):[]}function re(i){return i.people?i.people.drivers.map(t=>t.id):i.days.length?Object.keys(i.days[0].drivers):[]}function de(i){return new Map(fe(i).map((t,e)=>[t,Z(e)]))}function ne(i,t){let e=i.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of i.days)if(n.kids[t])return n.kids[t].name;return t}function ee(i,t){let e=i.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of i.days)if(n.drivers[t])return n.drivers[t].name;return t}function oi(i,t){return t==="none"?"Not needed":re(i).includes(t)?ee(i,t):t}function Cr(i){return i.leave_by!=null&&i.leave_by>i.start&&i.leave_by!==i.end?` · leave ${R(i.leave_by)}`:""}function vn(i){if(i.busy_why==="days"){if(i.start<=0&&i.end>=1440)return"All day";if(i.start<=0)return`Until ${R(i.end)}`;if(i.end>=1440)return`From ${R(i.start)}`}return`${R(i.start)}–${R(i.end)}`}function yn(i,t){return t.own?ee(i,t.own):ne(i,t.kid)}var pt={color:pn,rgb:Zn,ink:pn};function Us(i,t){return t.own?pt:de(i).get(t.kid)??Z(0)}function Pr(i,t){let e=fe(i);return t.along.map(n=>e.includes(n)?ne(i,n):ee(i,n))}function ut(i){return i.length<2?i.join(""):`${i.slice(0,-1).join(", ")} and ${i[i.length-1]}`}function Sr(i){let t=new Map([["home","Home"]]);for(let e of i.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function mn(i,t){return t?i.get(t)??(t.split(",")[0]?.trim()||t):""}function ei(i,t){let e=[];for(let n of i)n.type==="drive"?(e.length||e.push(mn(t,n.from)),e.push(mn(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(mn(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Ar(i){let t=i.map(r=>({...r,col:0,cols:1})).sort((r,l)=>r.s-l.s||l.en-r.en),e=[],n=[],o=-1/0,s=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(s(),o=-1/0);let l=n.findIndex(d=>d<=r.s);l<0?(l=n.length,n.push(r.en)):n[l]=r.en,r.col=l,e.push(r),o=Math.max(o,r.en)}return s(),t}function Mr(i,t){if(!i.length)return 0;if(t<=i[0].t)return i[0].y;for(let e=0;e<i.length-1;e++){let n=i[e],o=i[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return i[i.length-1].y}function Lr(i,t){if(!i.length)return 0;if(t<=i[0].y)return i[0].t;for(let e=0;e<i.length-1;e++){let n=i[e],o=i[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return i[i.length-1].t}function Fs(i,t){return Mr(i.anchors,t)}function ri(i,t){return Lr(i.anchors,t)}function Dr(i,t){let e=fe(i),n=re(i),o=Math.max(t,si(e.length,n.length)),r=(o-ht-Math.max(0,e.length-1)*ti-gn-Math.max(0,n.length-1)*ni)/(e.length+bn*n.length||1),l=Math.floor(r),d=Math.floor(r*bn),h=i.whole_week??i.days,p=new Map;for(let m of h)for(let $ of m.events)for(let k of $.own?$.along:[$.kid]){let g=p.get(k)??[];g.some(A=>A.event_id===$.event_id&&A.calendar_id===$.calendar_id)||g.push($),p.set(k,g)}let a=de(i),f=[],x=ht;e.forEach((m,$)=>{let k=p.get(m)??[],g=i.days.some(A=>A.events.some(D=>D.kid===m&&(D.sides.includes("drop")&&D.drop===""||D.sides.includes("pick")&&D.pick==="")));f.push({id:m,kind:"kid",x,w:l,name:ne(i,m),dot:a.get(m).color,rgb:a.get(m).rgb,sub:`${g?"Needs a ride · ":""}${k.length} this week`,subWarn:g}),x+=l+($<e.length-1?ti:0)});let T=x+gn/2;return x+=gn,n.forEach((m,$)=>{let k=0,g=0;for(let A of h){let D=A.drivers[m];D&&(k+=D.outings.length,g+=D.drive??0)}f.push({id:m,kind:"driver",x,w:d,name:ee(i,m),dot:pn,rgb:Zn,sub:`${k} ${k===1?"trip":"trips"} this week · ${lt(g)} driving`,subWarn:!1}),x+=d+($<n.length-1?ni:0)}),{columns:f,sepX:T,width:o}}function Rr(i,t){let e=i.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),s=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!s)return e;let r=o.slice(s[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function Ds(i,t){let e=i.start<=0,n=i.end>=1440;return e&&n?`${i.title} · all day`:n?`${i.title} from ${R(i.start)}`:e||!t?`${i.title} until ${R(i.end)}`:`${i.title} ${R(i.start)}–${R(i.end)}`}function ai(i){return i.issues.filter(t=>t.level==="problem").length+i.clashes.length+(i.unplaced?.length??0)}function li(i,t){let e=$e(t,i);return e===0?"Today":e===1?"Tomorrow":""}function J(i,t=0){return i==null||!Number.isFinite(i)?t:i}var ii=null;function Ws(i){ii=i}var fn='Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif',ct={title:`800 14.5px ${fn}`,time:`400 12px ${fn}`,line:`600 12px ${fn}`,stop:`400 12px ${fn}`};function jr(i,t,e){let n=Math.max(8,Math.floor(t/e)),o=1,s=0;for(let r of i.split(/[ \t\n]+/).filter(Boolean)){let l=r.length;for(s===0?s=l:s+1+l<=n?s+=1+l:(o++,s=l);s>n;)o++,s-=n}return o}function Ir(i,t,e,n){let o=i.split(/[ \t\n]+/).filter(Boolean),s=1,r="";for(let l of o){let d=r?`${r} ${l}`:l,h=n(d,e);if(h==null)return null;if(h<=t){r=d;continue}r&&s++;let p=n(l,e);if(p==null)return null;p>t&&(s+=Math.ceil(p/t)-1),r=l}return s}function jt(i,t,e=7,n){if(n&&ii){let o=Ir(i,t-.5,n,ii);if(o!=null)return o}return jr(i,t,e)}var Ks=25,zr=15,Vs=3;function Rs(i){return Math.max(0,Math.min(Vs,Math.floor((i-Ks)/zr)))}var Or=Ks+2,js=20;function Is(i){return/^(\d+:\d\d)\s+Home$/.exec(i.at(-1)??"")?.[1]??null}var It="🚗";function zs(i,t){if(i===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,s,r,l=!1)=>({at:o,who:s,stays:l,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(i))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(i))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with |With )(.+?)(, .+)?$/.exec(i))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(i))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(i))return e("",n[1],n[2])}return null}var Os={muted:0,normal:1,pending:2,problem:3};function Br(i){let{drop:t,pick:e}=i,n=t?zs(t.text,"drop"):null,o=e?zs(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return i;let s=[t,e].reduce((d,h)=>h&&(Os[h.tone]??1)>(Os[d]??1)?h.tone:d,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${It} No rides yet`,tone:s},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let d=`${It} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${d} both ways`,tone:s},pick:null}:!n.at||!o.at?{drop:{text:`${d} both ways · ${n.at?`↓${n.at}`:`↑${o.at}`}`,tone:s},pick:null}:{drop:{text:`${d} ↓${n.at} ↑${o.at}`.trimEnd(),tone:s},pick:null}}let r=(d,h)=>d==="needed"?`${h} needed`:`${h}${d.at?`${d.at} `:" "}${d.who}${d.stays?" stays":""}${d.extra}`,l=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${It} ${l.join(" · ")}`,tone:s},pick:null}}function Nr(i,t){return!t&&!!i.drop&&!i.pick&&i.drop.tone==="muted"}var Hr=5,Ur=13;function Fr(i,t,e={}){let n=e.clash?4:2,o=t-n-13-9,s=n+2*Hr;s+=jt(i.title,o-(e.noted?Ur:0),9,ct.title)*18;let r=i.inline&&i.drop?`${i.time} · ${i.drop.text}`:i.time;return s+=1+jt(r,o,6.6,i.inline?ct.line:ct.time)*16,i.drop&&!i.inline&&(s+=1+jt(i.drop.text,o,7,ct.line)*16),i.pick&&(s+=2+jt(i.pick.text,o,7,ct.line)*16),Math.ceil(s)+1}function Bs(i){return i.replace(/^(\S+\s+Home), get (.+)$/u,"$1 ↑ $2").replace(/, drop off (.+)$/u," ↓ $1").replace(/, pick up (.+)$/u," ↑ $1")}function Wr(i,t){let e=i.reduce((n,o)=>n+jt(o,t-20,7,ct.stop),0);return 28+i.length+e*16+1}function Gs(i,t,e,n){let o=t==="compact",{columns:s,sepX:r,width:l}=Dr(i,e),d=new Map(s.map(g=>[g.id,g])),h=fe(i),p=re(i),a=[...h,...p],f=de(i),x=Sr(i),T=g=>ne(i,g),m=g=>ee(i,g),$={mode:t,width:l,height:0,columns:s,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],folds:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},k=0;return i.days.forEach((g,A)=>{let D=A*1440,H=new Map(g.events.map(c=>[c.id,c])),te=c=>c&&H.has(c)?{day:g.date,event:c}:null,ae=ai(g),N=g.events.length,Ce=li(g.date,n.date),ge=me(g.date),Be=(N?`${N} ${N===1?"activity":"activities"}${g.done?" left":""}`:g.done?"All done for today":"Nothing scheduled")+(ae?` · ${ae} to sort out`:""),ve=Jr(i,g,f,l,l-Er(ge,Ce,Be));$.dayHeads.push({date:g.date,y:k,label:ge,tag:Ce,sub:Be,warn:ae>0,h:zt+(ve&&ve.h?ve.h+Hs+2:0),allDay:ve?.chips??[],inline:ve?.inline??0}),$.anchors.push({t:D,y:k});let Ne=$.dayHeads[$.dayHeads.length-1],le=k+Ne.h+Qn,Re=p.flatMap(c=>g.drivers[c]?.outings??[]);if(!N&&!Re.length){$.empties.push({key:g.date,y:le,text:g.done?"Nothing else today":"Nothing planned"}),k=le+40,$.anchors.push({t:D+1439,y:k});return}let je=(c,v,b=c.kid)=>{let y=!!c.own&&b===c.own,C=!!c.own&&b!==c.own,S=y?m(b):T(b),M=C?{drop:{text:`${v?`${It} `:""}With ${m(c.own)}`,tone:c.attending===!1?"muted":"normal"},pick:null}:v&&!c.own?Br(c.lines):c.lines,z=y?Pr(i,c):[],L=(c.takes!=null?`${c.takes} min, any time ${R(c.start)}–${R(c.end)}`:vn(c)+(c.arrive_by!=null?` · arrive ${R(c.arrive_by)}`:"")+Cr(c))+(z.length?` · with ${ut(z)}`:"");return{who:S,mine:y,title:Rr(c.title,S),time:L,drop:M.drop,pick:M.pick,inline:v&&Nr(M,c.attending===!1)}},He=(c,v,b,y)=>Fr(je(c,!0,b),v,{noted:!!c.notes,clash:y}),Ie=(c,v,b,y,C,S,M,z=c.kid)=>{let L=je(c,M,z),U=L.mine?pt:f.get(z)??Z(0),xe=L.who,E={drop:L.drop,pick:L.pick};return{key:`${g.date}|card|${c.id}`+(c.own?`|${z}`:""),x:v,y:b,w:y,h:C,target:{day:g.date,event:c.id},event:c,color:U,kidName:xe,clash:S,stayed:!c.own&&c.stay&&p.includes(c.drop),skipped:c.attending===!1,title:L.title,time:L.time,drop:E.drop,pick:E.pick,showDrop:!!E.drop&&(M||C>=56),showPick:!!E.pick&&(M||C>=74),wrap:M,inline:L.inline,aria:`${xe}, ${c.title} ${c.takes!=null?`any time from ${R(c.start)} to ${R(c.end)}`:vn(c).replace("–"," to ")}. `+(c.attending===!1&&!E.drop?"Not attending. ":"")+[E.drop,E.pick].filter(I=>!!I).map(I=>I.text).join(". ")}},Ue=c=>{let v=g.rides[c];return v?(g.drivers[v.driver]?.segments??[]).filter(y=>y.type!=="home"&&y.kids.includes(v.kid)&&J(y.start)>=J(v.start)&&J(y.end)<=J(v.end)):[]},ze=c=>{let v=g.rides[c];if(!v)return null;let b=v.serves.find(y=>H.get(y)?.kid===v.kid);return te(b??v.serves[0])},Fe=(c,v)=>{if(v.event)return v;let b=g.events.find(y=>y.own&&y.own!==c&&y.along.includes(c)&&y.title===v.title);return b?{...v,title:`${v.title} with ${m(b.own)}`}:v},Q=c=>{if(c.takes==null)return[c.start,c.end];let v=c.planned??c.start;return[v,v+c.takes]},ye=new Map;for(let c of g.issues)c.level!=="problem"||!c.event||(c.kind==="late"&&ye.set(c.event,`${Math.round(J(c.minutes))} min late`),c.kind==="waiting"&&ye.set(`${c.event}|pick`,`Waits ${Math.round(J(c.minutes))} min`));if(!o){let c=1/0,v=-1/0;for(let E of g.events)E.start<=0&&E.end>=1440||(E.start>0?c=Math.min(c,E.start-20,E.arrive_by!=null?E.arrive_by-10:1/0):c=Math.min(c,E.end-30),E.end<1440?v=Math.max(v,E.end+20):v=Math.max(v,E.start+30));for(let E of Re)E.start!=null&&(c=Math.min(c,E.start)),E.end!=null&&(v=Math.max(v,E.end));let b=g.from;b!=null&&Number.isFinite(c)&&c<b+60?c=b-15:g.date===n.date&&Number.isFinite(c)&&n.minutes>c-60&&n.minutes<v&&(c=Math.min(c,n.minutes-15));let y=Number.isFinite(c)?Math.floor((c-5)/30)*30:900,C=Math.max(Number.isFinite(v)?Math.ceil((v+5)/30)*30:960,y+60),S=E=>b!=null&&J(E)<=y,M=E=>b!=null&&J(E)<y,z=Vr(Kr(g,p,Q,g.date===n.date?n.minutes:null),y,C),L=E=>Math.round(le+Gr(Math.max(y,Math.min(C,E))-y,z,y));$.anchors.push({t:D+y,y:L(y)});for(let E of z)$.anchors.push({t:D+E.from,y:L(E.from)},{t:D+E.to,y:L(E.to)}),$.folds.push({key:`${g.date}|fold|${E.from}`,y:L(E.from),h:L(E.to)-L(E.from),from:E.from,to:E.to,label:qr(E.to-E.from)});$.anchors.push({t:D+C,y:L(C)});let U=(E,I)=>z.some(V=>I?E>=V.from&&E<=V.to:E>V.from&&E<V.to);for(let E of h){let I=d.get(E),V=f.get(E),wt=(g.kids[E]?.items??[]).filter(_=>_.start!=null&&_.end!=null&&!S(_.end)).map(_=>({item:_,s:J(_.start),en:J(_.end)})),ie=[];for(let _ of Ar(wt)){let j=I.w/_.cols,O=Math.round(I.x+_.col*j),F=Math.round(j-(_.cols>1?4:0)),q=L(_.s),W=_.item;if(W.type==="act"){let ce=H.get(W.event??"");if(!ce)continue;let qt=Math.max(30,L(_.en)-q),ot=Ie(ce,O,q,F,qt,W.clash,!1,E);if(ot.layer=Rt,ot.cut=M(_.s),$.cards.push(ot),ce.arrive_by!=null&&ce.start-ce.arrive_by>=5&&!ot.cut){let jn=L(ce.arrive_by),Xi={key:`${g.date}|prep|${ce.id}`,x:O,y:jn,w:F,h:q-jn+Te,color:V,label:`Arrive by ${R(ce.arrive_by)}`,layer:Rt-1};$.preps.push(Xi),ie.push({s:ce.arrive_by,en:_.en,top:jn,bottom:q+qt,x:O,w:F,prep:Xi,card:ot})}else ie.push({s:_.s,en:_.en,top:q,bottom:q+qt,x:O,w:F,card:ot});let qi=ye.get(ce.id);qi&&$.marks.push({key:`${g.date}|late|${ce.id}`,x:O+F-4,y:q+4,text:qi,right:!0});let Yi=ye.get(`${ce.id}|pick`);Yi&&$.marks.push({key:`${g.date}|wait|${ce.id}`,x:O+4,y:q+qt+2,text:Yi,right:!1});continue}let B=g.rides[W.ride??-1];if(!B)continue;let we=Math.max(22,L(_.en)-q),kt=ei(Ue(B.index),x),Ki=m(B.driver),Vi={key:`${g.date}|ride|${B.index}`,x:O,y:q,w:F,h:we,target:ze(B.index),l1:`${B.own?"In":"Along in"} ${Ki}’s car`,l2:kt.join(" → "),show2:Rs(we)>0,lines2:Rs(we),dashed:!B.own,clash:W.clash,aria:`${T(E)} ${B.own?"in":"riding along in"} ${Ki}’s car, ${R(J(B.start))} to ${R(J(B.end))}: ${kt.join(" to ")}`};$.rides.push(Vi);let Gi=d.get(B.driver),Rn=null;Gi&&(Rn={key:`${g.date}|band|${B.index}`,x:O+F,y:q,w:Math.max(0,Gi.x+8-(O+F)),h:we,color:V},$.bands.push(Rn)),ie.push({s:_.s,en:_.en,top:q,bottom:q+we,x:O,w:F,ride:Vi,band:Rn})}let Gt=_=>_.ride?.layer??(_.prep?Rt-1:Rt),$t=(_,j,O,F)=>{O>Te&&$.links.push({key:`${_.key}|link`,x:_.x,y:j,w:_.w,h:O,color:V,layer:F})},P=(_,j)=>{if(!(j.x<_.x||j.x+j.w>_.x+_.w)&&(_.x=j.x,_.w=j.w,_.ride.x=j.x,_.ride.w=j.w,_.band)){let O=_.band.x+_.band.w;_.band.x=j.x+j.w,_.band.w=Math.max(0,O-_.band.x)}},X=new Set;for(let _ of[...ie].sort((j,O)=>O.s-j.s)){let j=_.ride;if(!j)continue;let O=ie.filter(W=>W!==_&&W.s>=_.en&&W.s-_.en<=Ss&&W.top>=_.bottom).sort((W,B)=>W.s-B.s||W.top-B.top)[0];if(!O)continue;X.add(_),P(_,O);let F=Gt(O),q=O.top-_.bottom;$t(j,_.bottom,q+Te,F-1),j.layer=F-(q>0?2:1),j.h+=Te,j.tuckBottom=Te}for(let _ of[...ie].sort((j,O)=>j.s-O.s)){let j=_.ride;if(!j||X.has(_))continue;let O=ie.filter(W=>W!==_&&W.en<=_.s&&_.s-W.en<=Ss&&W.bottom<=_.top&&(W.card||W.ride?.layer!=null)).sort((W,B)=>B.en-W.en||B.bottom-W.bottom)[0];if(!O)continue;P(_,O);let F=O.ride?.layer??Rt,q=_.top-O.bottom;$t(j,O.bottom-Te,q+Te,F-1),j.layer=F-(q>0?2:1),j.y-=Te,j.h+=Te,j.tuckTop=Te}}for(let E of p){let I=d.get(E),V=g.drivers[E];if(!V)continue;let wt=[],ie=null;for(let P of V.segments)if(!(P.start==null||P.end==null)){if(P.type==="home"){ie=null;continue}if(P.type==="stay"){ie=null,wt.push({type:"stay",g:P,s:P.start,en:P.end});continue}ie&&ie.en===P.start?(ie.en=P.end,ie.legs.push(P)):(ie={type:"trip",s:P.start,en:P.end,legs:[P]},wt.push(ie))}let Gt=new Set,$t=(P,X,_,j)=>{Gt.add(P.id);let O=L(X),F=Ie(P,I.x+8,O,I.w-16,Math.max(30,L(_)-O),!1,!1,E);F.cut=M(X),j&&F.drop?.tone==="normal"&&(F.drop=null,F.showDrop=!1),$.cards.push(F)};for(let P of wt){if(S(P.en))continue;let X=L(P.s),_=Math.max(24,L(P.en)-X);if(P.type==="stay"){let B=H.get(P.g.event??P.g.serves??"");if(B?.own===E){$t(B,P.s,P.en,!0);continue}let we=B?f.get(B.kid)??Z(0):Z(0),kt=P.g.kids.map(T);$.stays.push({cut:M(P.s),key:`${g.date}|stay|${E}|${P.s}`,x:I.x+8,y:X,w:I.w-16,h:_,target:te(B?.id),color:we,l1:B?`At ${B.title} with ${T(B.kid)}`:"Staying",l2:`until ${R(P.en)}`+(kt.length?` · ${kt.join(" and ")} too`:"")});continue}let j=P.legs[0],O=P.legs[P.legs.length-1],F=[];for(let B of P.legs)for(let we of B.kids)F.includes(we)||F.push(we);let q=O.type==="drive"&&O.to==="home",W=ei(P.legs,x);$.trips.push({key:`${g.date}|trip|${E}|${P.s}`,x:I.x+8,y:X,w:I.w-16,h:_,target:te(P.legs.find(B=>B.serves)?.serves),l1:j.type==="drive"&&j.from==="home"?`Leave ${R(P.s)}`:`From ${mn(x,j.from??j.place)} ${R(P.s)}`,l2:W.join(" → "),show2:_>=36,l3:q?`Home ${R(P.en)}`:"",show3:q&&_>=62,stops:null,kids:F.map(B=>(f.get(B)??Z(0)).color),bad:P.legs.some(B=>B.overlaps_busy),aria:`${m(E)} drives ${W.join(" to ")}, ${R(P.s)} to ${R(P.en)}`})}for(let P of V.segments)if(!(!P.overlaps_busy||P.start==null||P.end==null))for(let X of V.busy){let _=Math.max(P.start,X.start),j=Math.min(P.end,X.end);j<=_||S(j)||$.overlaps.push({key:`${g.date}|overlap|${E}|${_}`,x:I.x+6,y:L(_)-2,w:I.w-12,h:Math.max(8,L(j)-L(_)+4)})}for(let P of g.events)if(P.own===E&&(!Gt.has(P.id)&&!S(Q(P)[1])&&$t(P,...Q(P),!1),P.takes!=null&&P.attending!==!1&&!S(P.end))){let X=L(P.start);$.windows.push({key:`${g.date}|window|${P.id}`,x:I.x+4,y:X,w:I.w-8,h:Math.max(24,L(P.end)-X),label:`${P.title} · any time ${R(P.start)}–${R(P.end)}`})}for(let P of V.busy){if(P.event||P.end<=y||P.start>=C)continue;let X=Fe(E,P),_=L(X.start),j=L(X.end);$.busy.push({key:`${g.date}|busy|${E}|${X.start}`,x:I.x+1,y:_,w:I.w-2,h:j-_,labelY:8,label:Ds(X,!1)})}}let xe=-1/0;for(let E=y;E<=C;E+=30)U(E,!0)||$.grid.push({key:`${g.date}|grid|${E}`,y:L(E),strong:E%60===0}),(z.some(V=>V.from===E||V.to===E)||E%60===0&&!U(E,!1))&&L(E)-xe>=22&&($.hours.push({key:`${g.date}|hour|${E}`,y:L(E)-8,label:E%60===0?vs(E):Le(E)}),xe=L(E));g.date===n.date&&n.minutes>y&&n.minutes<C&&($.now={y:L(n.minutes),label:`Now ${R(n.minutes)}`}),k=L(C)+Qn;return}let G=[];for(let c of h){let v=d.get(c);for(let b of g.kids[c]?.items??[])if(b.start!=null){if(b.type==="act"){let y=H.get(b.event??"");if(!y)continue;G.push({col:c,s:b.start,h:He(y,v.w,c,b.clash),kind:"act",item:b})}else if(!g.rides[b.ride??-1]?.own){let y=g.rides[b.ride??-1],C=y?g.drivers[y.driver]?.outings.find(S=>S.start!=null&&S.start<=J(y.start)&&J(y.start)<=J(S.end,S.start)):void 0;G.push({col:c,s:C?.start??b.start,h:Or,kind:"along",item:b})}}}for(let c of p){let v=g.drivers[c];if(!v)continue;for(let y of v.busy)y.event||G.push({col:c,s:y.start,h:32,kind:"busy",busy:Fe(c,y)});let b=d.get(c).w;for(let y of g.events)y.own!==c||!y.busy_only&&y.attending!==!1&&(y.takes==null||y.planned!=null)||G.push({col:c,s:Q(y)[0],h:He(y,b-16,c,!1),kind:"own",event:y});for(let y of v.outings){if(y.start==null)continue;let C=(Is(y.lines)?y.lines.slice(0,-1):y.lines).map(Bs);G.push({col:c,s:y.start,h:Wr([...C,...y.warn?[y.warn]:[]],b-16),kind:"out",out:y})}}G.sort((c,v)=>c.s-v.s||a.indexOf(c.col)-a.indexOf(v.col));let he=new Map,oe=[],We=new Map,pe=le-js;for(let c=0;c<G.length;){let v=c,b=pe+js;for(;v<G.length&&G[v].s===G[c].s;v++){let C=he.get(G[v].col);C!=null&&(b=Math.max(b,C+un))}let y=new Set;for(let C=c;C<v;C++){let S=G[C],M=y.has(S.col)?he.get(S.col)+un:b;y.add(S.col),he.set(S.col,M+S.h)}We.set(G[c].s,b),G[c].s>0&&$.hours.push({key:`${g.date}|hour|${G[c].s}`,y:b+2,label:Le(G[c].s)}),pe=b,c=v}he.clear(),G.forEach((c,v)=>{let b=he.get(c.col),y=Math.max(b!=null?b+un:le,We.get(c.s));he.set(c.col,y+c.h);let C=c.kind==="busy"?c.busy.end:c.kind==="act"?H.get(c.item.event??"")?.end??null:c.kind==="own"?Q(c.event)[1]:null;oe.push({col:c.col,s:c.s,end:C,y,h:c.h,box:null}),$.anchors.push({t:D+c.s,y});let S=d.get(c.col);if(c.kind==="busy"){let M={key:`${g.date}|busy|${c.col}|${v}`,x:S.x+1,y,w:S.w-2,h:c.h,labelY:8,label:Ds(c.busy,!0)};$.busy.push(M),oe[oe.length-1].box=M}else if(c.kind==="out"){let M=c.out,z=Is(M.lines),L=z?M.lines.slice(0,-1):M.lines;$.trips.push({key:`${g.date}|trip|${c.col}|${v}`,x:S.x+8,y,w:S.w-16,h:c.h,target:te(M.target),l1:z?`${M.lead} · home ${z}`:M.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...L.map(U=>({text:Bs(U),warn:!1})),...M.warn?[{text:M.warn,warn:!0}]:[]],kids:M.kids.map(U=>(f.get(U)??Z(0)).color),bad:!!M.warn,aria:`${m(c.col)}: ${M.lead}. ${M.lines.join(". ")}${M.warn?`. ${M.warn}`:""}`})}else if(c.kind==="own"){let M=Ie(c.event,S.x+8,y,S.w-16,c.h,!1,!0,c.col);$.cards.push(M),oe[oe.length-1].box=M}else if(c.kind==="act"){let M=H.get(c.item.event??""),z=Ie(M,S.x,y,S.w,c.h,c.item.clash,!0,c.col);$.cards.push(z),oe[oe.length-1].box=z}else{let M=g.rides[c.item.ride??-1],z=ei(Ue(M.index),x),L=m(M.driver);$.rides.push({key:`${g.date}|ride|${M.index}`,x:S.x,y,w:S.w,h:c.h,target:ze(M.index),l1:`${It} with ${L}`,l2:z.join(" → "),show2:!1,lines2:Vs,dashed:!0,clash:c.item.clash,aria:`${T(c.col)} riding along with ${L}, ${R(J(M.start))} to ${R(J(M.end))}: ${z.join(" to ")}`})}});let Pe=le;for(let c of he.values())Pe=Math.max(Pe,c);for(let c of oe){if(!c.box||c.end==null)continue;let v=c.y+c.h;for(let b of oe)b.col!==c.col&&b.s>=c.s&&b.s<c.end&&(v=Math.max(v,b.y+b.h));c.end>=1440&&(v=Pe);for(let b of oe)b.col===c.col&&b.y>c.y&&(v=Math.min(v,b.y-un));v=Math.min(v,Pe),v>c.y+c.h&&(c.box.h=v-c.y)}k=Pe+Qn+6,$.anchors.push({t:D+1439,y:k})}),$.height=k,$}function Kr(i,t,e,n){let o=[],s=(r,l)=>{r==null||l==null||o.push([r-Ms,Math.min(l,r+wr)+Ls],[Math.max(r,l-$r)-Ms,l+Ls])};for(let r of i.events)r.own?(s(...e(r)),r.takes!=null&&s(r.start,r.end)):s(r.arrive_by??r.start,r.end);for(let r of Object.values(i.kids))for(let l of r.items??[])s(l.start,l.end);for(let r of t){let l=i.drivers[r];if(l){for(let d of l.segments)d.type!=="home"&&s(d.start,d.end);for(let d of l.outings)s(d.start,d.end);for(let d of l.busy)s(d.start,d.end)}}return n!=null&&o.push([n-30,n+30]),o}function Vr(i,t,e){let n=i.map(([d,h])=>[Math.max(t,d),Math.min(e,h)]).filter(([d,h])=>h>d).sort((d,h)=>d[0]-h[0]),o=[],s=t,r=(d,h)=>{let p=Math.ceil(d/30)*30,a=Math.floor(h/30)*30;a-p>=xr&&o.push({from:p,to:a})},l=!1;for(let[d,h]of n)l&&d>s&&r(s,d),s=l?Math.max(s,h):h,l=!0;return o}function Gr(i,t,e){let n=i*Jn,o=e+i;for(let s of t){let r=s.to-s.from;o>=s.to?n-=r*Jn-As:o>s.from&&(n-=(o-s.from)*Jn-(o-s.from)/r*As)}return n}function qr(i){let t=Math.floor(i/60),e=i%60>=30;return`${t}${e?"½":""} hrs`}var Yr=["","¼","½","¾"];function Je(i){return i.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return lt(n);let o=Math.round(n*4),s=Math.floor(o/4),r=Yr[o%4];return`${s||!r?s:""}${r} min`})}function qs(i){let t=e=>e?{...e,text:Je(e.text)}:null;return{...i,days:i.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(s=>({...s,lines:s.lines.map(Je),warn:s.warn==null?s.warn:Je(s.warn)}))}])),issues:e.issues.map(n=>({...n,title:Je(n.title),body:Je(n.body),note:n.note==null?n.note:Je(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:Je(o.note)}))}:{}}))}))}}var Xr=2,Zr=48;function Ys(i,t,e=Zr){let n=[],o=new Set(re(i)),s=fe(i).map(f=>ne(i,f)),r=s.length>1?s.slice(0,2):[s[0]??"Ava","Ben"],l=0,d=0,h=0,p=0,a=t.minutes+e*60;for(let f of i.days){let x=$e(t.date,f.date),T=x===0?"":`${se(f.date)} · `,m=new Map(f.events.map(g=>[g.id,g])),$=g=>g&&m.has(g)?{day:f.date,event:g}:null,k=(g,A)=>x*1440+(g??m.get(A??"")?.start??0)<a;for(let g of f.issues)if(g.level==="problem"){if(!k(g.at,g.event)){h++,g.kind==="unassigned"&&p++;continue}l++,g.kind==="unassigned"&&d++,n.push({key:`${f.date}|${g.key}`,tone:g.kind==="unassigned"?"unassigned":"problem",title:T+g.title,body:g.body,target:$(g.event),suggestions:(g.suggestions??[]).map(A=>({id:A.id,label:A.label,note:A.note}))})}if(f.clashes.forEach((g,A)=>{if(!k(g.a.start,g.a.event)){h++;return}l++;let D=m.get(g.a.event??""),H=ne(i,g.kid),te=(N,Ce)=>{let ge=$(Ce);return ge?{text:N,target:ge}:N},ae=[];if(g.b.type==="act"){let N=m.get(g.b.event??"");D&&N&&(ae=[te(D.title,D.id),` ${R(D.start)}–${R(D.end)} and `,te(N.title,N.id),` ${R(N.start)}–${R(N.end)} overlap.`])}else{let N=f.rides[g.b.ride??-1];D&&N&&(ae=[`${H} is in `,te(`${ee(i,N.driver)}’s car`,N.serves[0]),` ${R(J(g.b.start))}–${R(J(g.b.end))}, during `,te(D.title,D.id),"."])}n.push({key:`${f.date}|clash|${A}`,tone:"problem",title:`${T}${H} is double-booked`,body:ae.map(N=>typeof N=="string"?N:N.text).join(""),parts:ae,target:null,suggestions:[]})}),x>=0&&x<Xr)for(let g of f.issues)g.level!=="heads_up"||!k(g.at,g.event)||n.push({key:`${f.date}|${g.key}`,tone:"heads_up",title:T+g.title,body:g.body,target:$(g.event),suggestions:[]});for(let g of f.unplaced??[]){if(!k(g.at)){h++;continue}l++;let A=g.people.map(H=>o.has(H)?ee(i,H):ne(i,H)),D=g.from_notes?"The For line in its notes":"Its title";n.push({key:`${f.date}|unplaced|${g.id}`,tone:"problem",title:`${T}${R(g.at)} ${g.title}: ${Xs(g).toLowerCase()}`,body:g.reason==="unknown"&&g.word?`${D} names “${g.word}”, who isn’t anyone in the family, so ${A.length?`it’s only in ${ut(A)}’s lane`:"it isn’t on the board"}. Tap to pick who it’s for.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Tap to pick who it’s for, or start the title in Google Calendar with a name, such as “${r[0]} Piano”.`,target:null,suggestions:[],pick:{day:f.date,id:g.id}})}for(let g of f.events)!g.problems.length||!k(g.start)||n.push({key:`${f.date}|notes|${g.id}`,tone:"heads_up",title:`${T}Check the notes on ${yn(i,g)}’s ${g.title}`,body:`These lines couldn’t be read: ${g.problems.join("; ")}`,target:$(g.id),suggestions:[]})}return{items:n,problems:l,unassigned:d,later:h,laterUnassigned:p}}function Xs(i){return i.reason==="unknown"&&i.word?`Who is “${i.word}”?`:"Who is this for?"}function Jr(i,t,e,n,o=0){let s=new Set(re(i)),r=T=>{let m=T[0];return m==null?null:s.has(m)?pt:e.get(m)??null},l=[...(t.all_day??[]).map(T=>({key:`${t.date}|allday|${T.id}`,title:T.title,note:T.days>1?`Day ${T.day_number} of ${T.days}`:"",color:r(T.people),cancelled:T.cancelled,warn:!1,pick:null,notes:T.notes??""})),...(t.unplaced??[]).map(T=>({key:`${t.date}|unplaced|${T.id}`,title:`${R(T.at)} ${T.title}`,note:Xs(T),color:null,cancelled:!1,warn:!0,pick:T.id,notes:T.notes??""}))];if(!l.length)return null;let d=Math.max(120,n-ht),h=(T,m=7)=>30+m*T.title.length+(T.note?Math.min(m,5.6)*(T.note.length+2):0)+(T.notes?16:0),p=0,a=0;for(;p<l.length&&a+h(l[p],6.4)<=o;)a+=h(l[p++],6.4);let f=0;a=0;for(let T of l.slice(p)){let m=Math.min(d,h(T));(!f||a+m>d)&&(f++,a=0),a+=m}let x=f?f*_r+(f-1)*Hs:0;return{key:`${t.date}|allday`,h:x,chips:l,inline:p}}function Zs(i,t){let e=de(i),n=null,o=s=>s.ahead>0?2:s.ongoing?1:0;for(let s of i.days){let r=$e(t.date,s.date);if(!(r<0))for(let l of re(i))for(let d of s.drivers[l]?.outings??[]){if(d.start==null)continue;let h=r*1440+d.start;if(r*1440+J(d.end,d.start)<=t.minutes)continue;let a=h-t.minutes,f={driver:l,name:ee(i,l),date:s.date,ahead:r,start:d.start,inMinutes:a,ongoing:a<=0,lead:d.lead,stop:(d.lines[0]??"").replace(/\s+/g," ").trim(),kids:d.kids.map(x=>e.get(x)??Z(0)),warn:d.warn,target:d.target&&s.events.some(x=>x.id===d.target)?{day:s.date,event:d.target}:null};(!n||o(f)<o(n)||o(f)===o(n)&&f.inMinutes<n.inMinutes)&&(n=f)}}return n}function ft(i){return i.state==="done"||i.state==="late"}var Qr=780;function ea(i,t,e){return i.state==="open"&&!!i.for_day&&i.due===t&&e<Qr}function Js(i,t){return i.chores.map(e=>ea(e,i.today,t)?{...e,state:"upcoming",shows_from:i.today}:e)}function Qs(i){return i.state==="open"||i.state==="overdue"}function hi(i,t,e){if(ft(i)){let n=i.done_at?ta(i.done_at,t,e):"";return i.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(i.state==="overdue")return i.missed>1?`Missed ${i.missed} times`:i.due?`Missed ${di(i.due,t)}`:"Missed";if(i.state==="upcoming"){if(i.for_day)return`From 1 PM · for ${di(i.for_day,t)}`;let n=i.shows_from??i.due;if(!i.due||!n||i.due<=n)return"";let o=$e(t,i.due);return`By ${o===1?"tomorrow":o<7?se(i.due):ci(i.due)}`}if(i.for_day&&i.due===t)return`Tonight · for ${di(i.for_day,t)}`;if(i.due&&i.due>t){let n=$e(t,i.due);return n===1?"By tomorrow":`By ${n<7?se(i.due):ci(i.due)}`}return i.missed?`Today · missed ${i.missed===1?"once":`${i.missed} times`} before`:"Today"}function di(i,t){let e=$e(t,i);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?se(i):ci(i)}function ci(i){let[t,e,n]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function ta(i,t,e){let n=new Date(i);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let s=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return s===t?r:`${se(s)} ${r}`}function eo(i,t,e=1440){let n=Js(i,e).sort((o,s)=>o.order-s.order);return i.kids.map((o,s)=>{let r=n.filter(p=>p.kid===o.id),l=new Map;for(let p of r){if(p.state!=="upcoming")continue;let a=p.shows_from??p.due??i.today;l.set(a,[...l.get(a)??[],p])}let d=r.filter(p=>p.state==="overdue"),h=r.filter(p=>p.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??Z(s),overdue:d,now:h,done:r.filter(ft),later:[...l.entries()].sort(([p],[a])=>p.localeCompare(a)).map(([p,a])=>({date:p,chores:a})),left:d.length+h.length}})}function to(i,t=1440){return Js(i,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=i.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function pi(i){return!i.chores.length&&!i.templates.length}var Qe=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function ui(i){let t=i.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,s]=n.split("-").map(r=>Qe.indexOf(r.trim()));if(o===void 0||o<0||s!==void 0&&s<0)return null;if(s===void 0)e.add(o);else for(let r=0;r<=(s-o+7)%7;r++)e.add((o+r)%7)}return e}function fi(i){let t=[...new Set(i)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${Qe[n[0]]}-${Qe[n.at(-1)]}`]:n.map(o=>Qe[o])).join(", ")}var et="none";function xn(i){return i==="daily"||i==="school"?"":"Any"}function no(i=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:i,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function io(i){let t=i.days??xn(i.repeats),e=i.repeats==="daily"&&t!=="";return{template:i.id,repeats:e?"weekly":i.repeats,title:i.title,icon:i.icon,details:i.details??"",who:[...i.who],take_turns:!!i.take_turns,days:t,every:!e&&i.every&&i.every>0?i.every:1,paused:i.paused,night_before:!!i.night_before,bring_only:!!i.bring_only}}function gi(i){return i.title.trim()?i.who.length?i.days===et?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function so(i){return{...i.template?{template:i.template}:{},repeats:i.repeats,title:i.title.trim(),icon:i.icon??"",details:i.details.trim(),who:i.who,take_turns:i.take_turns&&i.who.length>1,days:i.repeats==="daily"?"":i.days,every:i.repeats==="school"?1:i.every,paused:i.paused,...i.repeats==="school"?{night_before:i.night_before,bring_only:i.bring_only}:{}}}function mi(i){let t=i%100;return t>=11&&t<=13?`${i}th`:`${i}${{1:"st",2:"nd",3:"rd"}[i%10]??"th"}`}function bi(i,t,e=1,n=!1,o=!1){if(i==="school"){let p=t.trim().replace(/-/g,"–"),a=o?p?`${p} Bring lunch days`:"Bring lunch days":p?`${p} school days`:"Every school day";return n?`${a}, the night before`:a}let s={daily:"day",weekly:"week",monthly:"month"}[i],r=e>1?`every ${e} ${s}s`:`each ${s}`,l=t.trim();if(i==="daily")return e>1?`Every ${e} days`:"Every day";if(i==="weekly"&&/^mon\s*-\s*sun$/i.test(l))return e>1?`Every day, every ${e} weeks`:"Every day";if(!l||l.toLowerCase()==="any")return`Sometime ${r}`;if(i==="weekly")return`${l.replace(/-/g,"–")} ${r}`;let h=`${l.split(",").map(p=>{let a=p.trim();return a.toLowerCase()==="last"?"the last day":/^\d+$/.test(a)?`the ${mi(Number(a))}`:`the ${a}`}).join(" and ")} ${r}`;return h[0].toUpperCase()+h.slice(1)}function vi(i,t,e=!1){let n=i.map(s=>t.find(r=>r.id===s)?.name??s);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function yi(i){let t=i.indexOf(":"),e=t<0?i:i.slice(0,t),n=t<0?"":i.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function wn(i,t){return`${i}|${t}`}function gt(i,t){let[e,n,o]=i.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function $n(i){let[t,e,n]=i.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function oo(i,t){return i.days_off.find(e=>e.first<=t&&t<=e.last)??null}function ro(i,t){return $n(t)<5&&!oo(i,t)}function Ot(i,t,e=new Map){if(!ro(i,t))return null;let n=wn(i.id,t);if(e.has(n)){let s=e.get(n);return s?{lunch:s,picked:!0}:{lunch:i.default,picked:!1}}let o=i.picks[t];return o?{lunch:o,picked:!0}:{lunch:i.default,picked:!1}}function mt(i,t){return ro(i,t)?i.menus?.[t]??null:null}var na="From the school's menu feed.";function ia(i){let t=i.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==na);return t.length?t.join(`
`):null}function Ee(i){return i.slice(0,7)}function kn(i){let[t,e]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function xi(i,t=1){let[e,n]=i.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function ao(i){let t=[];for(let e=Ee(i.first);e<=Ee(i.last);e=xi(e))t.push(e);return t}function lo(i,t,e,n=new Map){let o=`${e}-01`,s=gt(o,-$n(o)),r=[];for(;Ee(s)<=e;){let l=[];for(let d=0;d<5;d++){let h=gt(s,d),p=Ee(h)!==e,a=p?null:oo(t,h),f=p?null:Ot(t,h,n);l.push({date:h,day:Number(h.slice(8)),outside:p,off:a?a.title:null,lunch:f?.lunch??null,picked:f?.picked??!1,menu:p?null:mt(t,h)?.dish??null,sides:p?null:ia(mt(t,h)?.details??""),past:h<i.today,today:h===i.today})}l.some(d=>!d.outside)&&r.push(l),s=gt(s,7)}return r}function co(i){return i.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function ho(i){let t=0,e=0;for(let n of i.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function po(i,t,e,n=new Map){let o=e<780?0:1;for(let s=o;s<8;s++){let r=gt(t,s),l=Ot(i,r,n);if(!l)continue;let d=$e(t,r);return{lunch:l.lunch,when:d===0?"today":d===1?"tomorrow":se(r),date:r,menu:mt(i,r)?.dish??null}}return null}var sa={timeline:"timeline",full:"timeline",compact:"compact"};function Bt(i){let t=new URLSearchParams(i),e={},n=sa[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((t.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((t.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}function wi(i,t=0){return i==null||!Number.isFinite(i)?t:i}function oa(i,t){let e=t.takes!=null&&t.planned!=null?t.planned+t.takes:t.end;if(t.attending===!1)return t.end;for(let n of i.rides)n.serves.includes(t.id)&&n.end!=null&&(e=Math.max(e,n.end));for(let n of Object.values(i.drivers))for(let o of n.segments)o.type==="home"||o.end==null||(o.serves===t.id||o.event===t.id)&&(e=Math.max(e,o.end));return e}function ra(i,t){let e=[],n=[],o=()=>{let s=n[n.length-1];s&&wi(s.end)>t&&e.push(...n),n=[]};for(let s of i){if(s.start==null||s.end==null)continue;if(s.type==="home"||s.type==="stay"){o(),s.end>t&&e.push(s);continue}let r=n[n.length-1];r&&r.end!==s.start&&o(),n.push(s)}return o(),e}function aa(i,t){let e=new Set(i.events.filter(s=>oa(i,s)<=t).map(s=>s.id)),n=s=>wi(i.rides[s??-1]?.end,-1)<=t,o=s=>s.type==="act"?e.has(s.event??""):n(s.ride);return{...i,events:i.events.filter(s=>!e.has(s.id)),kids:Object.fromEntries(Object.entries(i.kids).map(([s,r])=>[s,{...r,items:r.items.filter(l=>!o(l))}])),drivers:Object.fromEntries(Object.entries(i.drivers).map(([s,r])=>[s,{...r,segments:ra(r.segments,t),outings:r.outings.filter(l=>l.start==null||wi(l.end,l.start)>t),busy:r.busy.filter(l=>l.end>t)}])),clashes:i.clashes.filter(s=>!o(s.a)&&!o(s.b)),issues:i.issues.filter(s=>!s.event||!e.has(s.event)),done:e.size,from:t}}function uo(i,t){return{...i,whole_week:i.whole_week??i.days,days:i.days.filter(e=>e.date>=t.date).map(e=>e.date===t.date?aa(e,t.minutes):e)}}var fo=Ke`
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
`;function la(i,t,e,n,o=14){let s=i.top-o-8,r=e.h-i.bottom-o-8,l=t.h<=s,d=t.h<=r,h=n?l||!d&&s>r:!d&&(l||s>r),p=h?i.top-o-t.h:i.bottom+o,a=Math.max(8,Math.min(p,e.h-8-t.h)),f=Math.max(8,Math.min(i.x-t.w/2,e.w-8-t.w));return{left:Math.round(f),top:Math.round(a),above:h}}function Nt(i,t){for(let e of i.composedPath()){if(e===t)break;if(e instanceof HTMLElement&&e.dataset.note)return e}return null}var Tn=class{constructor(t,e){this.tip=null;this.anchor=null;this.held=!1;this.hoverTimer=null;this.hideTimer=null;this.hoverAt={x:0,y:0};this.hoverEl=null;this.press=null;this.eatUntil=0;this.hide=()=>{this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting")),this.anchor=null,this.held=!1,this.tip?.classList.remove("on")};this.onHover=t=>{if(t.pointerType==="touch"||t.buttons)return;let e=t.composedPath().includes(this.host)?Nt(t,this.host):null;if(!e){this.clearHover(),this.laterHide();return}if(e===this.anchor){this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null;return}if(this.hoverAt={x:t.clientX,y:t.clientY},this.hoverEl!==e){if(this.anchor&&!this.held){this.show(e,this.pointAt(this.hoverAt),!1);return}this.clearHover(),this.hoverEl=e,this.hoverTimer=setTimeout(()=>{this.hoverTimer=null,this.hoverEl===e&&e.isConnected&&this.show(e,this.pointAt(this.hoverAt),!1)},400)}};this.onLeave=t=>{t.pointerType!=="touch"&&(this.clearHover(),this.held||this.hide())};this.onDown=t=>{if(this.eatUntil=0,this.endPress(),this.anchor&&this.hide(),this.clearHover(),t.pointerType!=="touch"||!t.isPrimary)return;let e=Nt(t,this.host);if(!e)return;let n={x:t.clientX,y:t.clientY},o=setTimeout(()=>{let s=this.press;!s||s.el!==e||!e.isConnected||(s.done=!0,this.show(e,{x:n.x,top:n.y,bottom:n.y},!0,36),this.held=!0)},500);this.press={id:t.pointerId,x:n.x,y:n.y,el:e,timer:o,done:!1}};this.onMove=t=>{let e=this.press;e&&t.pointerId===e.id&&!e.done&&Math.hypot(t.clientX-e.x,t.clientY-e.y)>10&&this.endPress()};this.onUp=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done&&(this.eatUntil=performance.now()+700),this.endPress())};this.onCancel=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done?(this.endPress(),this.hide()):this.endPress())};this.onClick=t=>{if(!this.eatUntil)return;let e=performance.now()<this.eatUntil;this.eatUntil=0,e&&(t.stopPropagation(),t.preventDefault())};this.onContextMenu=t=>{let e=t.pointerType==="touch";(this.press||this.held&&this.anchor||e&&Nt(t,this.host))&&t.preventDefault()};this.onFocusIn=t=>{let e=Nt(t,this.host);if(!e||!e.matches(":focus-visible"))return;let n=e.getBoundingClientRect();this.show(e,{x:n.left+Math.min(n.width/2,120),top:n.top,bottom:n.bottom},!1,8)};this.onFocusOut=t=>{this.anchor&&Nt(t,this.host)===this.anchor&&!this.held&&this.hide()};this.onKey=t=>{t.key!=="Escape"||!this.anchor||(this.hide(),t.stopImmediatePropagation())};this.host=t,this.root=e}connect(){let t=this.host;window.addEventListener("pointermove",this.onHover,{passive:!0}),document.documentElement.addEventListener("pointerleave",this.onLeave),t.addEventListener("pointerdown",this.onDown,{capture:!0}),t.addEventListener("pointermove",this.onMove,{capture:!0,passive:!0}),t.addEventListener("pointerup",this.onUp,{capture:!0}),t.addEventListener("pointercancel",this.onCancel,{capture:!0}),t.addEventListener("click",this.onClick,{capture:!0}),t.addEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.addEventListener("wheel",this.hide,{passive:!0}),t.addEventListener("focusin",this.onFocusIn),t.addEventListener("focusout",this.onFocusOut),t.addEventListener("keydown",this.onKey,{capture:!0}),window.addEventListener("resize",this.hide),window.addEventListener("blur",this.hide)}disconnect(){let t=this.host;window.removeEventListener("pointermove",this.onHover),document.documentElement.removeEventListener("pointerleave",this.onLeave),t.removeEventListener("pointerdown",this.onDown,{capture:!0}),t.removeEventListener("pointermove",this.onMove,{capture:!0}),t.removeEventListener("pointerup",this.onUp,{capture:!0}),t.removeEventListener("pointercancel",this.onCancel,{capture:!0}),t.removeEventListener("click",this.onClick,{capture:!0}),t.removeEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.removeEventListener("wheel",this.hide),t.removeEventListener("focusin",this.onFocusIn),t.removeEventListener("focusout",this.onFocusOut),t.removeEventListener("keydown",this.onKey,{capture:!0}),window.removeEventListener("resize",this.hide),window.removeEventListener("blur",this.hide),this.endPress(),this.hide()}get shown(){return this.anchor!==null}sync(){let t=this.anchor;t&&(!t.isConnected||!t.dataset.note?this.hide():this.tip&&this.tip.textContent!==t.dataset.note&&(this.tip.textContent=t.dataset.note))}ensureTip(){if(this.tip?.isConnected)return this.tip;let t=document.createElement("div");return t.className="note-tip",t.id="note-tip",t.setAttribute("role","tooltip"),this.root.appendChild(t),this.tip=t,t}show(t,e,n,o){let s=t.dataset.note;if(!s)return;this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&this.anchor!==t&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting"));let r=this.ensureTip();r.textContent=s,r.classList.remove("on"),r.style.left="0px",r.style.top="0px";let l={w:r.offsetWidth,h:r.offsetHeight},d={w:window.innerWidth,h:window.innerHeight},h=la(e,l,d,n,o);r.style.left=`${h.left}px`,r.style.top=`${h.top}px`,r.classList.toggle("above",h.above),r.classList.add("on"),t.setAttribute("aria-describedby",r.id),t.classList.add("noting"),this.anchor=t}clearHover(){this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=null,this.hoverEl=null}laterHide(){this.hideTimer||!this.anchor||this.held||(this.hideTimer=setTimeout(()=>{this.hideTimer=null,this.hide()},120))}pointAt(t){return{x:t.x,top:t.y-4,bottom:t.y+10}}endPress(){this.press&&clearTimeout(this.press.timer),this.press=null}};(()=>{if(typeof document>"u")return;let i=null,t=new Map;Ws((e,n)=>{let o=`${n}|${e}`,s=t.get(o);if(s!==void 0)return s;if(!i){if(!document.body)return null;i=document.createElement("span"),i.setAttribute("aria-hidden","true"),i.style.cssText="position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none;white-space:pre;letter-spacing:normal;word-spacing:normal;text-transform:none;contain:layout style",document.body.appendChild(i)}return i.style.font=n,i.style.font?(i.style.fontVariantNumeric="tabular-nums",i.textContent=e,s=i.getBoundingClientRect().width,t.size>2e4&&t.clear(),t.set(o,s),s):null})})();var Qo="mydashlight.rides.view",Nl=1100,Hl=440,Ul=700,Fl=3*6e4,Yo=1200,Wl=450,Kl=110;function Vl(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var Dn=Y`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,Xo=Y`<svg class="note-mark" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M5 3h10l4 4v14H5zM9 11h6M9 15h6"/></svg>`,Zo=Y`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Gl=new URL("emoji.json",import.meta.url).href,Jo=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],Hi=Y`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Ui=Y`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,ql=Y`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Yl=Y`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Ft={bring:"Bring",buy:"Buy"};function Xl(i,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[i];return t<=1?e:`${e}s${i==="monthly"&&t===3?" (quarterly)":i==="monthly"&&t===12?" (yearly)":""}`}function be(i){let t=/\p{L}|\p{N}/u.exec(i);return t?t[0].toUpperCase():"?"}function Fi(i){let[t,e,n]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Zl(i,t){return li(i,t)||me(i).split(",")[0]}function Jl(i){let t=i.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function Ql(){try{return localStorage.getItem(Qo)==="timeline"?"timeline":"compact"}catch{return"compact"}}function ed(i){try{localStorage.setItem(Qo,i)}catch{}}function Wi(i,t){return re(i).includes(t)?ee(i,t):ne(i,t)}function Wt(i){return i.days.every(t=>!t.events.length)}var Kt=class extends ue{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.leaveTimer=null;this.holdTimer=null;this.holdRepeat=null;this.held=!1;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.noteTip=null;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Bt(location.search).view;this.urlPage=Bt(location.search).page;this.urlPast=Bt(location.search).past;this.urlDayPicker=Bt(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.noteTip?.hide(),this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,s=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(s)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging"),this.noteTip?.hide()}this.onTouched(),n.el.scrollTop=n.top-s,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.noteTip?.hide(),this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Fl))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor||this.forPick?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.mode=this.urlView??Ql(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1},this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null,this.forPick=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.noteTip??=new Tn(this,this.renderRoot),this.noteTip.connect(),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.leaveTimer,this.railTimer])e&&clearTimeout(e);this.stopHold(),this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey),this.noteTip?.disconnect()}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){this.noteTip?.sync();let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,s]of this.lunchDraft){let[r,l]=o.split("|"),d=e.kids.find(h=>h.id===r);(!d||(d.picks[l]??null)===s||!Ot(d,l))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&ft(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(s=>s.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=qs(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Nl)return!1;let e=this.plan;return!e||this.width-Hl>=si(fe(e).length,re(e).length)}today(){return Lt(this.plan?.time_zone??Vl())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let n=this.today(),o=`${n.date}|${n.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:uo(e,n)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let s=this.board,r=this.boardPlan;this.board=Gs(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o,s&&r&&this.keepPlace(s,r,e)}return this.board}keepPlace(e,n,o){let s=this.scroller;if(!s||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||s.scrollTop<=0)return;let r=e.dayHeads.find(p=>p.date===this.pinDay)?.h??zt,l=ri(e,s.scrollTop+r+4),d=n.days[Math.floor(l/1440)]?.date,h=d?o.days.findIndex(p=>p.date===d):-1;h>=0&&(this.keepAt=h*1440+(l-Math.floor(l/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n,o=!1){let s=this.scroller;if(!s||!this.board)return;let r=this.topFor(e,n);Math.abs(s.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?s.scrollTo({top:r,behavior:"smooth"}):s.scrollTop=r),this.syncDay()}topFor(e,n){let o=this.board,s=o.dayHeads.find(r=>r.date===n)?.y??0;return Math.max(s,Fs(o,e)-Ns(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let n=this.today(),o=Math.max(0,this.dayIndexOf(n.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(n.date)?n.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let n=this.nowSpot();n&&this.scrollToTime(n.t,n.date,e)}goToDay(e,n=!1){let o=this.boardPlan;if(!o)return;let s=this.today();if(e===s.date){this.scrollToNow(n);return}let r=this.dayIndexOf(e),l=o.days[r];if(!l)return;let d=1/0;if(this.mode==="timeline"){for(let h of l.events)d=Math.min(d,h.arrive_by??h.start);for(let h of Object.values(l.drivers))for(let p of h.outings)p.start!=null&&(d=Math.min(d,p.start))}this.scrollToTime(r*1440+(Number.isFinite(d)?Math.max(0,d-30):0),e,n)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let d of this.board.dayHeads)d.y<=n+1&&(o=d);this.pinDay!==o.date&&(this.pinDay=o.date);let s=null,r=this.nowSpot(),l=this.today().date;if(r){let d=n-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),h=d>0?"up":"down";this.board.dayHeads.some(p=>p.date===l)&&o.date!==l?s=`${h}|Today`:this.mode==="timeline"&&Math.abs(d)>e.clientHeight*.6&&(s=`${h}|${o.date===l?"Now":"Today"}`)}this.away!==s&&(this.away=s)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),s=new Map(this.choreDraft);s.set(e.id,o),this.choreDraft=s;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let l=new Map(this.choreDraft);l.delete(e.id),this.choreDraft=l;let d=r instanceof K?r:new K("error",String(r));this.showToast(d.code==="preview"?d.message:`Couldn’t save that. ${d.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??ft(e)}editMenu(e,n){let o=this.lunch?.kids??[],s=mt(e,n),r=o.filter(l=>l.id===e.id||s&&mt(l,n)?.dish===s.dish).map(l=>l.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:s?.dish??"",details:s?.details??"",kids:r,had:!!s,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let s=o instanceof K?o:new K("error",String(o));this.showToast(s.code==="preview"?s.message:`Couldn’t save that. ${s.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let s=new Map(this.lunchDraft);for(let r of n)s.set(wn(e,r),o);this.lunchDraft=s;try{await this.backend.setLunch(e,n,o)}catch(r){let l=new Map(this.lunchDraft);for(let h of n)l.delete(wn(e,h));this.lunchDraft=l;let d=r instanceof K?r:new K("error",String(r));this.showToast(d.code==="preview"?d.message:`Couldn’t save that. ${d.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?io(e):no(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.forPick=null,this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(qo(),Go))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||gi(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(so(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof K?n:new K("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof K?n:new K("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(s=>s.date===this.pinDay)?.h??zt;this.keepAt=n&&this.board?ri(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||ed(e)}findUnplaced(e,n){return this.plan?.days.find(o=>o.date===e)?.unplaced?.find(o=>o.id===n)??null}openForPick(e,n){let o=this.findUnplaced(e,n),s=this.plan;if(!o||!s)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...fe(s),...re(s)]);this.forPick={day:e,id:n,placed:!1,label:`${R(o.at)} ${o.title}`,recurring:!!o.recurring,word:o.reason==="unknown"?o.word:null,fromNotes:!!o.from_notes,people:o.people.filter(l=>r.has(l)),scope:"this",busy:!1}}changeForPick(e,n,o){let s=e.who?.[o.event_id],r=s?.people??[o.own??o.kid];this.closeEditor(),this.forPick={day:n.date,id:o.id,placed:!0,label:`${R(o.start)} ${o.title}`,recurring:o.recurring,word:null,fromNotes:!!s?.from_notes,people:r,scope:"this",busy:!1}}async saveForPick(e=!1){let n=this.forPick,o=this.plan;if(!n||!o||!this.backend||!e&&!n.people.length)return;let s=e?[]:n.people;this.forPick={...n,busy:!0};try{await this.backend.setPeople(n.id,s,n.scope),this.forPick=null;let r=n.label.replace(/^\S+ /,""),l=s.map(d=>Wi(o,d));this.showToast(e?`Saved. ${r} goes by the names in its title again.`:`Saved. ${r} is in ${ut(l)}’s ${l.length>1?"lanes":"lane"} now.`)}catch(r){this.forPick&&(this.forPick={...this.forPick,busy:!1});let l=r instanceof K?r:new K("error",String(r));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}renderForPick(e){let n=this.plan,o=e.placed?n?.days.some(k=>k.date===e.day&&k.events.some(g=>g.id===e.id)):!!this.findUnplaced(e.day,e.id),s=u`<button type="button" class="btn" ?disabled=${e.busy} @click=${()=>this.closeChorePanels()}>Cancel</button>`;if(!n||!o&&!e.busy)return u`<div class="ed-head">
          <div class="ed-titles"><span class="ed-title">Who is this for?</span></div>
          ${s}
        </div>
        <p class="field-hint">This event is sorted now: someone changed it in Google Calendar, or it’s over.</p>`;let r=e.busy,l=k=>{this.forPick&&(this.forPick={...this.forPick,...k})},d=k=>l({people:e.people.includes(k)?e.people.filter(g=>g!==k):[...e.people,k]}),h=de(n),p=fe(n),a=p.length>1&&p.every(k=>e.people.includes(k)),x=[...p,...re(n)].filter(k=>e.people.includes(k)),T=x.map(k=>Wi(n,k)),m=T.length<2?T.join(""):`${T.slice(0,-1).join(", ")} & ${T[T.length-1]}`,$=(k,g,A,D)=>u`<button
      type="button"
      class="who-chip"
      style="--c:${A.color};--rgb:${A.rgb}"
      aria-pressed=${e.people.includes(k)?"true":"false"}
      ?disabled=${r}
      @click=${()=>d(k)}
    >
      <span class="avatar ${D?"driver":""}" aria-hidden="true">${be(g)}</span>${g}
    </button>`;return u`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">Who is this for?</span>
          <span class="ed-meta">${me(e.day)} · ${e.label}</span>
        </div>
        ${s}
      </div>
      ${e.word?u`<p class="field-hint">“${e.word}” isn’t anyone in the family. Pick who it’s for instead.</p>`:w}
      ${e.recurring?u`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${e.scope==="this"?"true":"false"} ?disabled=${r} @click=${()=>l({scope:"this"})}>
                Just ${se(e.day)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${e.scope==="series"?"true":"false"} ?disabled=${r} @click=${()=>l({scope:"series"})}>
                Every time
              </button>
            </div>
          </div>`:w}
      <div class="field">
        <span class="field-label">Kids</span>
        <div role="group" aria-label="Kids it’s for" class="who-chips">
          ${p.map(k=>$(k,ne(n,k),h.get(k)??Z(0),!1))}
        </div>
        ${p.length>1?u`<button
              type="button"
              class="chip all-kids"
              aria-pressed=${a?"true":"false"}
              ?disabled=${r}
              @click=${()=>l({people:a?e.people.filter(k=>!p.includes(k)):[...p,...e.people.filter(k=>!p.includes(k))]})}
            >
              All the kids
            </button>`:w}
      </div>
      <div class="field">
        <span class="field-label">Parents</span>
        <div role="group" aria-label="Parents it’s for" class="who-chips">
          ${re(n).map(k=>$(k,ee(n,k),pt,!0))}
        </div>
      </div>
      <p class="field-hint">
        ${x.length?u`Saved in the event’s notes as <strong>For: ${m}</strong>, so its title stays as it is. It shows in ${x.length>1?"their lanes":`${T[0]}’s lane`}${x.some(k=>p.includes(k))?", and rides are planned for the kids":""}.`:"Saved in the event’s notes, so its title stays as it is."}
      </p>
      ${e.fromNotes?u`<button type="button" class="chip clear" ?disabled=${r} @click=${()=>void this.saveForPick(!0)}>
            Go by the names in the title instead
          </button>`:w}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!x.length} @click=${()=>void this.saveForPick()}>
          ${r?"Saving to Google Calendar…":x.length?"Save":"Pick who it’s for"}
        </button>
      </div>
    `}renderForLine(e,n,o){let s=e.who?.[o.event_id];if(!s)return w;let r=s.people.map(l=>Wi(e,l));return u`<span class="ed-for"
      >For ${ut(r)}<button type="button" class="ed-for-change" @click=${()=>this.changeForPick(e,n,o)}>Change</button></span
    >`}findEvent(e){let n=this.plan?.days.find(s=>s.date===e.day),o=n?.events.find(s=>s.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.flushLeave(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1},n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.flushLeave(),this.sel=null,this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1}}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(s){let r=s instanceof K?s:new K("error",String(s));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o,s){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&s.includes(e.drop)){s.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope,!1));return}this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e,n,o){if(!this.backend)return;let s=this.backend;if(n&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>s.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",n,()=>s.setStay(e.id,n,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let s=this.backend,r=o==="pick"?e.pick_along??[]:e.along,l=r.includes(n)?r.filter(d=>d!==n):[...r,n];this.save(`along-${o}`,l,()=>s.setTakeAlong(e.id,l,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let s=((this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by)??e.start)+n;this.arriveDraft=s===e.start?null:s,this.timesOpen={...this.timesOpen,arrive:!0},this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Yo)}clearArrive(){this.arriveDraft=null,this.timesOpen={...this.timesOpen,arrive:!1},this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let s=this.backend,r=o.event.id,l=this.scope;this.save("arrive",e,()=>s.setArriveBy(r,e,l)).then(()=>{this.arriveDraft=void 0})}nudgeLeave(e,n){let o=this.leaveDraft!==void 0?this.leaveDraft:e.leave_by??null,s=Math.max(e.start+5,(o??e.end)+n);this.leaveDraft=s===e.end?null:s,this.timesOpen={...this.timesOpen,leave:!0},this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=setTimeout(()=>this.flushLeave(),Yo)}clearLeave(){this.leaveDraft=null,this.timesOpen={...this.timesOpen,leave:!1},this.flushLeave()}flushLeave(){this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=null;let e=this.leaveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||(o.event.leave_by??null)===e){this.leaveDraft=void 0;return}let s=this.backend,r=o.event.id,l=this.scope;this.save("leave",e,()=>s.setLeaveBy(r,e,l)).then(()=>{this.leaveDraft=void 0})}startHold(e){this.stopHold(),this.held=!1,this.holdTimer=setTimeout(()=>{this.held=!0,e(),this.holdRepeat=setInterval(e,Kl)},Wl)}stopHold(){this.holdTimer&&clearTimeout(this.holdTimer),this.holdRepeat&&clearInterval(this.holdRepeat),this.holdTimer=this.holdRepeat=null}tapStep(e){this.held?this.held=!1:e()}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=this.shownPlan(),s=o?Ys(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,l=this.chores?to(this.chores,this.today().minutes).filter(f=>!this.choreDone(f)):[],d=this.forPick?this.renderForPick(this.forPick):this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,h=this.forPick?"Who is this for?":this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",p=u`<aside class="panel" aria-label=${h}>
      ${d??(this.sel&&e?this.renderEditor(e):this.renderAttention(s,l))}
    </aside>`,a=this.page==="rides";return u`
      <div class="app ${r?"wide":this.width<Ul?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,s,l.length)} ${a?this.renderBanner(e):w}
          <main>
            ${a?u`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?Wt(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                  ${n&&o&&!Wt(o)?this.renderDayRail(o):w}
                  ${n&&this.away?this.renderBackToToday(this.away):w}
                </section>`:this.page==="lunch"?u`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:u`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit||this.forPick)?u`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${p}`:w}
          </main>
        </div>
        ${r?p:w}
        ${this.toast?u`<div class="toast" role="status">${this.toast}</div>`:w}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let s=n.problems+o;this.tick;let r=this.today(),l="";if(e){let f=e.time_zone,x=new Date(e.updated);this.error?l=u`<span class="bad">${ws(this.error)} · showing the plan from ${an(x,new Date,f)}</span>`:e.status&&!e.status.ok?l=u`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${an(x,new Date,f)}</span>`:this.backend?.live||(l=`Updated ${an(x,new Date,f)}`)}let d=(f,x,T,m)=>u`
      <button type="button" class="seg-btn" title=${m} aria-pressed=${this.mode===f?"true":"false"} @click=${()=>this.setMode(f)}>
        ${T}<span class="seg-label">${x}</span>
      </button>
    `,h=(f,x,T)=>u`
      <button type="button" class="seg-btn" aria-pressed=${this.page===f?"true":"false"} @click=${()=>this.setPage(f)}>
        ${T}<span class="seg-label">${x}</span>
      </button>
    `,p=Le(r.minutes),a=!!e&&Wt(e);return u`
      <header>
        ${this.showMenu?u`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${Y`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:w}
        <div class="titles">
          <h1 class="clock" aria-label=${`${me(r.date)}, ${p}`}>
            <span class="hm">${p.slice(0,-3)}</span><span class="ampm">${p.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${me(r.date)}${typeof l=="string"&&l?u`<span class="status"> · ${l}</span>`:w}
          </p>
          ${l&&typeof l!="string"?u`<p class="status">${l}</p>`:w}
        </div>
        ${e&&!a?this.renderNext(e,Zs(e,r),n):w}
        <div class="controls">
          ${this.wide||a&&!o?w:u`<button type="button" class="attn-btn ${s?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${s}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?w:u`<div role="group" aria-label="View" class="seg">
            ${d("timeline","Timeline",Y`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${d("compact","Compact",Y`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${h("rides","Rides",Y`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${h("chores","Chores",Y`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?w:h("lunch","Lunch",Y`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let h=this.today().date,p=o.unassigned,a=o.laterUnassigned;if(p){let x=u`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${p} ${p===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?u`<div class="next idle needs">${x}</div>`:u`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${x}</button>`}if(a)return u`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${a} ${a===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let f=e.days.some(x=>x.date>=h&&x.events.length);return u`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${f?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${f?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let s;n.ongoing?s="On the road now":n.ahead===0?s=n.inMinutes<180?`Next trip · in ${lt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?s="Next trip · tomorrow":s=`Next trip · ${se(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,l=u`
      <span class="next-eyebrow">${s}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${be(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(h=>u`<span class="kid-dot" style="background:${h.color}"></span>`)}</span>
        ${n.warn?u`<span class="next-stop warn">${n.warn}</span>`:n.stop?u`<span class="next-stop">${n.stop}</span>`:w}
      </span>
    `,d=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?u`<button type="button" class=${d} @click=${()=>this.open(n.target)}>${l}</button>`:u`<div class=${d}>${l}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return w;let n=this.today().date,o=de(e),s=this.railShown;return u`<div
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
        ${e.days.map(r=>{let l=ai(r),d=r.events.length,h=r.events.slice(0,4).map(a=>a.own?pt.color:o.get(a.kid)?.color??Z(0).color),p=`${me(r.date)}: ${d?`${d} ${d===1?"activity":"activities"}`:"nothing planned"}${l?`, ${l} to sort out`:""}`;return u`<button
            type="button"
            class="rail-day ${r.date===n?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${p}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===n?"Today":se(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${h.length?h.map(a=>u`<span class="rd-dot" style="background:${a}"></span>`):u`<span class="rd-free">free</span>`}
            </span>
            ${l?u`<span class="rd-badge" aria-hidden="true">${l}</span>`:w}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[n,o]=e.split("|");return u`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${Y`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${n==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let n=fe(e),o=re(e),s=de(e),r=n.map(l=>ne(e,l));return u`<div class="quiet-week">
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
          When something lands on ${Jl(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(l=>{let d=s.get(l);return u`<div class="qw-person" style="--c:${d.color};--rgb:${d.rgb}">
            <span class="avatar" aria-hidden="true">${be(ne(e,l))}</span>
            <span class="qw-name">${ne(e,l)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(l=>u`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${be(ee(e,l))}</span>
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
    </div>`}renderBanner(e){if(e?.needs_setup==="events_calendar")return u`<div class="notice-bar" role="status">
        Pick your family calendar to see the week: in Home Assistant, open Settings &gt; Devices &amp; services &gt; MyDashLight &gt;
        Configure &gt; Calendars.
      </div>`;let n=e?.unavailable_calendars.length??0;return n?u`<div class="notice-bar" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:w}renderEmpty(){return this.error?u`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:u`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderHead(e,n=!1){return u`<div class="dh-line">
        <button
          type="button"
          class="dh-jump"
          tabindex=${n?-1:0}
          aria-label=${`${e.label}: go to this day`}
          @click=${()=>this.tapHead(e.date)}
        >
          <span class="label">${e.label}</span>${e.tag?u`<span class="tag">${e.tag}</span>`:w}
        </button>
        <span class="sub ${e.warn?"warn":""}">${e.sub}</span>
        ${e.inline?u`<div class="dh-chips">${e.allDay.slice(0,e.inline).map(o=>this.renderStripChip(e,o,n))}</div>`:w}
      </div>
      ${e.allDay.length>e.inline?u`<div class="day-strip" style="padding-left:${ht}px">
            ${e.allDay.slice(e.inline).map(o=>this.renderStripChip(e,o,n))}
          </div>`:w}`}renderStripChip(e,n,o){let s=u`<span class="strip-title">${n.title}</span>${n.note?u`<span class="strip-note">${n.note}</span>`:w}${n.notes?Xo:w}`,r=n.pick;return r?u`<button
          type="button"
          class="strip-chip warn plain pick"
          tabindex=${o?-1:0}
          data-note=${n.notes||w}
          aria-label=${`${n.title}: ${n.note} Pick who it’s for`}
          @click=${()=>this.openForPick(e.date,r)}
        >
          ${s}
        </button>`:u`<span
          class="strip-chip ${n.warn?"warn":""} ${n.cancelled?"skipped":""} ${n.color?"":"plain"} ${n.notes?"noted":""}"
          style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
          tabindex=${n.notes&&!o?0:w}
          data-note=${n.notes||w}
          >${s}</span
        >`}renderBoard(e){let n=this.sel,o=n?this.findEvent(n):null,s=new Set(o?o.event.own?[o.event.id]:o.day.events.filter(a=>!a.own&&a.event_id===o.event.event_id).map(a=>a.id):[]),r=a=>!!a&&!!n&&a.day===n.day&&s.has(a.event),l=e.dayHeads.find(a=>a.date===this.pinDay)??e.dayHeads[0],d=e.width,h=100,p=[...e.links.map(a=>({t:"link",x:a,z:a.layer??0})),...e.preps.map(a=>({t:"prep",x:a,z:a.layer??h-1})),...e.cards.map(a=>({t:"card",x:a,z:a.layer??h})),...e.rides.map(a=>({t:"ride",x:a,z:a.layer??h+1}))].sort((a,f)=>a.z-f.z);return u`
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
          ${e.columns.map(a=>u`<div class="col-head ${a.kind}" style="left:${a.x}px;width:${a.w}px;--c:${a.dot};--rgb:${a.rgb}">
              <span class="avatar ${a.kind}" aria-hidden="true">${be(a.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${a.name}</span>${a.kind==="kid"?this.renderLunchChip(a.id,!0,a.w-58-a.name.length*10.6):w}</span>
                <span class="sub ${a.subWarn?"warn":""}">${a.sub}</span>
              </span>
            </div>`)}
        </div>
        ${l?u`<div class="pinned" aria-hidden="true" style="width:${d}px;height:${l.h}px;margin-bottom:${-l.h}px">
              ${this.renderHead(l,!0)}
            </div>`:w}
        <div class="canvas" style="width:${d}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(a=>u`<div
                class="col-bg ${a.kind}"
                style="left:${a.x}px;width:${a.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${a.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(a=>u`<div class="day-head" style="top:${a.y}px;width:${d}px;height:${a.h}px">${this.renderHead(a)}</div>`)}
          ${e.empties.map(a=>u`<span class="empty" style="top:${a.y}px">${a.text}</span>`)}
          ${e.grid.map(a=>u`<div class="grid ${a.strong?"strong":""}" style="top:${a.y}px;width:${d-60}px"></div>`)}
          ${e.hours.map(a=>u`<span class="hour" style="top:${a.y}px">${a.label}</span>`)}
          ${ke(e.bands,a=>a.key,a=>u`<div
                class="band"
                aria-hidden="true"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;background:rgba(${a.color.rgb},0.10);border-color:rgba(${a.color.rgb},0.45)"
              ></div>`)}
          ${ke(e.busy,a=>a.key,a=>u`<div class="busy" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span style="top:${a.labelY}px">${a.label}</span>
              </div>`)}
          ${ke(e.windows,a=>a.key,a=>u`<div class="window" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span>${a.label}</span>
              </div>`)}
          ${ke(p,a=>a.x.key,a=>{if(a.t==="link"){let m=a.x;return u`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;border-color:${m.color.color};background:linear-gradient(rgba(${m.color.rgb},0.11), rgba(${m.color.rgb},0.11)), var(--surface)"
                ></div>`}if(a.t==="prep"){let m=a.x;return u`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;border-color:${m.color.color};background:linear-gradient(rgba(${m.color.rgb},0.11), rgba(${m.color.rgb},0.11)), var(--surface);color:${m.color.ink}"
                >
                  ${m.label}
                </div>`}if(a.t==="ride"){let m=a.x;return u`<button
                  type="button"
                  class="ride ${m.dashed?"dashed":""} ${m.clash?"clash":""}"
                  aria-label=${m.aria}
                  style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;padding-top:${3+(m.tuckTop??0)}px;padding-bottom:${3+(m.tuckBottom??0)}px"
                  @click=${()=>this.open(m.target)}
                >
                  <span class="l1">${m.l1}</span>${m.show2?u`<span class="l2" style="-webkit-line-clamp:${m.lines2}">${m.l2}</span>`:w}
                </button>`}let f=a.x,x=f.color,T=f.skipped?`repeating-linear-gradient(135deg, rgba(${x.rgb},0.10) 0px, rgba(${x.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:f.stayed?`repeating-linear-gradient(135deg, rgba(${x.rgb},0.24) 0px, rgba(${x.rgb},0.24) 6px, rgba(${x.rgb},0.08) 6px, rgba(${x.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${x.rgb},0.15), rgba(${x.rgb},0.15)), var(--surface)`;return u`<button
                type="button"
                class="card ${f.wrap?"wrap":""} ${r(f.target)?"sel":""} ${f.clash?"clash":""} ${f.skipped?"skipped":""} ${f.cut?"cut":""} ${f.event.notes?"noted":""}"
                aria-label=${f.aria}
                data-note=${f.event.notes||w}
                style="left:${f.x}px;top:${f.y}px;width:${f.w}px;height:${f.h}px;background:${T};border-color:${f.clash?"var(--bad)":`rgba(${x.rgb},0.45)`};--c:${x.color};--rgb:${x.rgb};--ring:${x.color}"
                @click=${()=>this.open(f.target)}
              >
                ${f.event.notes?Xo:w}
                <span class="top">
                  <span class="title">${f.title}</span>
                  <span class="time">${f.time}${f.inline&&f.drop?u`<span class="line tone-${f.drop.tone} inline"> · ${f.drop.text}</span>`:w}</span>
                  ${f.showDrop&&f.drop&&!f.inline?u`<span class="line tone-${f.drop.tone}">${f.drop.text}</span>`:w}
                </span>
                ${f.showPick&&f.pick?u`<span class="line tone-${f.pick.tone}">${f.pick.text}</span>`:w}
              </button>`})}
          ${ke(e.stays,a=>a.key,a=>u`<button
                type="button"
                class="stay ${a.cut?"cut":""}"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;border-color:${a.color.color};background:repeating-linear-gradient(135deg, rgba(${a.color.rgb},0.28) 0px, rgba(${a.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1" style="color:${a.color.ink}">${a.l1}</span><span class="l2">${a.l2}</span>
              </button>`)}
          ${ke(e.trips,a=>a.key,a=>u`<button
                type="button"
                class="trip ${a.bad?"bad":""} ${a.stops?"list":""}"
                aria-label=${a.aria}
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1">${a.l1}${a.kids.map(f=>u`<span class="kid-dot" style="background:${f}"></span>`)}</span>
                ${a.show2?u`<span class="l2">${a.l2}</span>`:w}
                ${a.stops?a.stops.map(f=>u`<span class="stop ${f.warn?"warn":""}">${f.text}</span>`):w}
                ${a.show3?u`<span class="l3">${a.l3}</span>`:w}
              </button>`)}
          ${ke(e.overlaps,a=>a.key,a=>u`<div class="overlap" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"></div>`)}
          ${ke(e.marks,a=>a.key,a=>u`<span class="mark" style="left:${a.x}px;top:${a.y}px;${a.right?"transform:translateX(-100%)":""}">${a.text}</span>`)}
          ${ke(e.folds,a=>a.key,a=>u`<div class="fold" style="top:${a.y}px;width:${d-60}px;height:${a.h}px" aria-hidden="true">
                ${td(d-60,a.h)}
              </div>
              <span class="fold-label" style="top:${a.y+a.h/2-9}px" title="${Le(a.from)} to ${Le(a.to)}">${a.label}</span>`)}
          ${e.now?u`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${d-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:w}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:s,later:r}=e,l=this.plan,d=s+n.length,h=this.chores,p=!!h&&!pi(h);return u`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${d?"bad":"ok"}">${d}</span>
        ${this.wide?w:u`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${p?u`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?u`<div class="attn-chores">${n.map(a=>this.renderChoreRow(a,!0))}</div>`:u`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:u`<p class="panel-sub">Rides in the next two days</p>`}
      ${l&&!s?u`<div class="all-clear">
            <span class="check" aria-hidden="true">${Y`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Wt(l)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:w}
      ${o.map(a=>u`<div class="issue ${a.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${a.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${a.pick?u`<button type="button" class="issue-title" @click=${()=>a.pick&&this.openForPick(a.pick.day,a.pick.id)}>${a.title}</button>`:a.target?u`<button type="button" class="issue-title" @click=${()=>this.open(a.target,!0)}>${a.title}</button>`:u`<strong class="issue-title">${a.title}</strong>`}
              <span class="issue-body"
                >${a.parts?a.parts.map(f=>typeof f=="string"?f:u`<button type="button" class="issue-link" @click=${()=>this.open(f.target,!0)}>${f.text}</button>`):a.body}</span
              >
            </div>
          </div>
          ${a.suggestions.length?u`<div class="fixes">
                ${a.suggestions.map(f=>u`<button
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
      ${this.wide&&l&&!Wt(l)&&this.page==="rides"?this.renderLegend():w}
    `}kidColorOf(e){let n=this.plan?de(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(s=>s.id===e)??-1;return Z(Math.max(0,o))}renderLunchChip(e,n=!1,o=1/0){let s=this.lunch,r=s?.kids.find(a=>a.id===e);if(!s||!r)return w;this.tick;let l=this.today(),d=po(r,l.date,l.minutes,this.lunchDraft);if(!d)return w;let h=Ft[d.lunch],p=`${h} lunch ${d.when}${d.menu?`: ${d.menu}`:""}`;return n&&o<36+h.length*7.4?u`<span class="lunch-chip ${d.lunch} small icon" role="img" aria-label=${p} title=${p}
        >${d.lunch==="bring"?Hi:Ui}</span
      >`:u`<span class="lunch-chip ${d.lunch} ${n?"small":""}" title=${p}
      >${d.lunch==="bring"?Hi:Ui}<span class="lunch-chip-text"
        >${h}${n?w:` ${d.when}`}${!n&&d.menu?u`<span class="lunch-chip-menu"> · ${d.menu}</span>`:w}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return u`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return u`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=ao(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:Ee(e.today),s=n.indexOf(o),r=p=>{let a=n[s+p];a&&(this.lunchMonth=a)},l=e.kids.some(p=>p.id===this.lunchKid)?this.lunchKid:null,d=l?e.kids.filter(p=>p.id===l):e.kids,h=e.status&&!e.status.ok?u`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:w;return u`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${s<=0} @click=${()=>r(-1)}>
            ${Y`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${kn(o)}</h2>
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
          ${this.menuMode?"Done":u`${Zo} Edit menus`}
        </button>
      </div>
      ${h}
      <div class="chore-cols lunch-cols ${l?"wide":""}" style="--n:${d.length}">
        ${d.map(p=>this.renderLunchCard(e,p,o,l!==null))}
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
    </div>`}renderLunchCard(e,n,o,s){let r=this.kidColorOf(n.id),l=lo(e,n,o,this.lunchDraft),d=ho(l),h=l.flat(),p=h.filter(m=>!m.outside&&!m.past&&m.lunch),a=n.days_off.filter(m=>Ee(m.first)<=o&&o<=Ee(m.last)),f=m=>p.filter($=>$n($.date)===m),x=m=>{let $=f(m);if(!$.length)return;let k=$.every(g=>g.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,$.map(g=>g.date),k)},T=p.length?`${d.bring} Bring · ${d.buy} Buy${o===Ee(e.today)?" left this month":""}`:"No school days left this month";return u`<section class="chore-col lunch-card ${s?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${be(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${T}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Ft[n.default]} unless picked</span>
          ${e.kids.length<2?w:u`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${s?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=s?null:n.id}
              >
                ${s?Yl:ql}${s?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?u`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:w}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${kn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((m,$)=>u`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!f($).length}
            aria-label=${`${f($).every(k=>k.lunch==="bring")?"Buy":"Bring"} every ${m} left in ${kn(o)} for ${n.name}`}
            @click=${()=>x($)}
          >
            ${m}
          </button>`)}
        ${h.map(m=>this.renderLunchCell(n,m,s))}
      </div>
      ${a.length?u`<p class="lunch-offs">
            No school:
            ${a.map(m=>{let $=m.first<`${o}-01`?`${o}-01`:m.first,k=Ee(m.last)>o?gt(`${xi(o)}-01`,-1):m.last;return`${$===k?Fi($):`${Fi($)}–${Fi(k)}`} ${co(m.title)}`}).join(" · ")}
          </p>`:w}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return u`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return u`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let s=n.lunch,r=s==="buy"?"bring":"buy",l=n.menu?`, ${n.menu}`:"",d=this.menuMode,h=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),p=d?`${e.name}, ${me(n.date)}${l||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${me(n.date)}: ${Ft[s]}${n.picked?"":" (not picked yet)"}${l}. Tap to ${Ft[r]}.`;return u`<button
      type="button"
      class="lunch-day ${s} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${d?"editing":""} ${h?"sel":""}"
      ?disabled=${n.past&&!d}
      aria-label=${p}
      @click=${()=>d?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${s==="bring"?Hi:Ui}${Ft[s]}</span>
      ${n.menu?u`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?u`<span class="lunch-sides">${n.sides}</span>`:w}`:d?u`<span class="lunch-menu add">${Dn} Menu</span>`:w}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,s=this.choreDone(e),r=o.kids.findIndex(k=>k.id===e.kid),l=(this.plan?de(this.plan).get(e.kid):void 0)??Z(Math.max(0,r)),d=o.kids[r]?.name??"",h=s===ft(e)?e:{...e,state:s?"done":"open",done_at:s?new Date().toISOString():null},p=s&&h.done_by&&h.done_by!==e.kid?o.people?.find(k=>k.id===h.done_by)?.name??h.done_by_name??null:null,a=`${hi(h,o.today,o.time_zone)}${p?` · by ${p}`:""}`,f=s||Qs(e),x=`${n?`${d}: `:""}${e.title}. ${a?`${a}. `:""}${s?"Done. Tap to undo.":"Tap when it’s done."}`,T=u`<span class="box" aria-hidden="true"
        >${s?Y`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:w}</span
      >
      ${e.icon?u`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:w}
      <span class="chore-text">
        <span class="chore-title">${n?u`<span class="chore-kid">${d}</span> · `:w}${e.title}</span>
        ${a?u`<span class="chore-note">${a}</span>`:w}
      </span>`,m=`chore ${s?"done":""} ${e.state==="overdue"&&!s?"overdue":""} ${f?"":"later"}`,$=`--c:${l.color};--rgb:${l.rgb};--k:${l.ink}`;return f?u`<button type="button" class=${m} style=${$} aria-pressed=${s?"true":"false"} aria-label=${x} @click=${()=>this.tapChore(e)}>
          ${T}
        </button>`:u`<div class=${m} style=${$}>${T}</div>`}renderChores(){let e=this.chores;if(e===void 0)return u`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return u`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return u`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return u`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(pi(e))return u`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${Dn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?u`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:w;this.tick;let s=eo(e,this.plan?de(this.plan):void 0,this.today().minutes);return u`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Dn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${Zo} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${s.length}">
        ${s.map(r=>{let l=r.overdue.filter(d=>!this.choreDone(d)).length+r.now.filter(d=>!this.choreDone(d)).length;return u`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${be(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${l?`${l} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?u`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(d=>this.renderChoreRow(d))}`:w}
            ${r.now.length?u`<h3 class="chore-group">To do</h3>
                  ${r.now.map(d=>this.renderChoreRow(d))}`:w}
            ${r.done.length?u`<h3 class="chore-group">Done</h3>
                  ${r.done.map(d=>this.renderChoreRow(d))}`:w}
            ${r.later.map(d=>u`<h3 class="chore-group">${d.date===e.today?"Later today":Zl(d.date,e.today)}</h3>
                ${d.chores.map(h=>this.renderChoreRow(h))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?u`<p class="chore-none">No chores this week.</p>`:w}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,s=this.plan?de(this.plan):void 0,r=this.choreEdit?.template===e.id,l=e.problems.length?u`<span class="tmpl-note bad">${e.problems.map(yi).join(" · ")} · tap to set up</span>`:u`<span class="tmpl-note">${vi(e.who,o,e.take_turns)} · ${bi(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return u`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?u` <span class="tag-paused">Paused</span>`:w}</span>
        ${l}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(d=>{let h=o.findIndex(a=>a.id===d),p=s?.get(d)??Z(Math.max(0,h));return u`<span class="kid-dot" style="background:${p.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return u`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Dn} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([o,s])=>{let r=e.templates.filter(l=>l.repeats===o);return r.length?u`<section class="manage-group" aria-label=${s}>
                  <h3 class="chore-group">${s}</h3>
                  <div class="tmpl-list">${r.map(l=>this.renderTemplateRow(l))}</div>
                </section>`:w}):u`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return u``;let o=n.kids,s=this.plan?de(this.plan):void 0,r=this.choreBusy,l=e.template?n.templates.find(m=>m.id===e.template):void 0,d=gi(e),h=(l?.problems??[]).filter(m=>m!=="who:"),p=(m,$,k,g=!1)=>u`<button type="button" class="choice ${g?"wide":""}" aria-pressed=${m?"true":"false"} ?disabled=${r} @click=${k}>${$}</button>`,a=(m,$,k,g)=>u`<button type="button" class="chip" aria-pressed=${m?"true":"false"} aria-label=${g??w} ?disabled=${r} @click=${k}>${$}</button>`,f=m=>{m!==e.repeats&&this.changeDraft({repeats:m,days:l&&l.repeats===m?l.days??xn(m):xn(m)})},x=m=>{let $=e.who.includes(m)?e.who.filter(k=>k!==m):o.filter(k=>k.id===m||e.who.includes(k.id)).map(k=>k.id);this.changeDraft({who:$})},T;if(e.repeats==="school"){let m=e.days===et?new Set:e.days===""?new Set([0,1,2,3,4]):ui(e.days)??new Set,$=k=>{let g=new Set(m);g.has(k)?g.delete(k):g.add(k),this.changeDraft({days:g.size===5?"":g.size?fi(g):et})};T=u`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${Qe.slice(0,5).map((k,g)=>a(m.has(g),k.slice(0,2),()=>$(g),k))}
          </div>
          <p class="field-hint">Weekdays with no “No School” event on the kid’s calendar.</p>
        </div>
        <div class="field">
          <span class="field-label">When</span>
          <div role="group" aria-label="When" class="choices" style="grid-template-columns:1fr 1fr">
            ${p(!e.night_before,"That morning",()=>this.changeDraft({night_before:!1}))}
            ${p(e.night_before,"The night before",()=>this.changeDraft({night_before:!0}))}
          </div>
          <p class="field-hint">${e.night_before?"Due the evening before each school day: Sunday for Monday.":"Due on the school day itself."}</p>
        </div>
        <div class="field">
          ${p(e.bring_only,e.bring_only?"Only on Bring lunch days":"Every school day, Bring or Buy",()=>this.changeDraft({bring_only:!e.bring_only}),!0)}
          <p class="field-hint">${e.bring_only?"Made only when the kid brings lunch, like Pack lunch.":"Tap to make it only on Bring lunch days, like Pack lunch."}</p>
        </div>`}else if(e.repeats==="monthly"){let m=e.days.trim(),$=/^\d+$/.test(m)?Number(m):null,k=m&&m.toLowerCase()!=="any"&&m.toLowerCase()!=="last"&&$===null;T=u`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${k?4:3}, minmax(0, 1fr))">
          ${p(m===""||m.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${p($!==null,"On a date",()=>this.changeDraft({days:String($??1)}))}
          ${p(m.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${k?p(!0,m,()=>{}):w}
        </div>
        ${$!==null?u`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||$<=1} @click=${()=>this.changeDraft({days:String($-1)})}>−</button>
                <span class="arrive-value">${mi($)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||$>=31} @click=${()=>this.changeDraft({days:String($+1)})}>+</button>
              </span>
            </div>`:u`<p class="field-hint">${m.toLowerCase()==="last"?"Due on the month’s last day.":k?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")T=u`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let m=e.days===""||e.days.toLowerCase()==="any",$=e.days===et?new Set:m?new Set:ui(e.days)??new Set,k=g=>{let A=new Set($);A.has(g)?A.delete(g):A.add(g),this.changeDraft({days:A.size?fi(A)||"Mon-Sun":et})};T=u`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${p(m,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${p(!m,"On set days",()=>this.changeDraft({days:m?"Sat":e.days}))}
        </div>
        ${m?u`<p class="field-hint">Shows all week, due on Sunday.</p>`:u`<div role="group" aria-label="Days of the week" class="day-chips">
                ${Qe.map((g,A)=>a($.has(A),g.slice(0,2),()=>k(A),g))}
              </div>
              <div class="chips">
                ${a(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${a(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return u`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?u`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:w}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?vi(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===et?"No days picked":bi(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${h.length?u`<p class="field-hint bad">${h.map(yi).join(". ")}. Saving fixes it.</p>`:w}
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
          ${Jo.map(m=>a(e.icon===m,m,()=>this.changeDraft({icon:e.icon===m?null:m}),`Picture ${m}`))}
          ${e.icon&&!Jo.includes(e.icon)?a(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):w}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?u`<emoji-picker
              class="emoji-more"
              .dataSource=${Gl}
              @emoji-click=${m=>{let $=m.detail.unicode;$&&this.changeDraft({icon:$}),this.iconMore=!1}}
            ></emoji-picker>`:w}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((m,$)=>{let k=s?.get(m.id)??Z($),g=e.who.includes(m.id);return u`<button type="button" class="who-chip" style="--c:${k.color};--rgb:${k.rgb}" aria-pressed=${g?"true":"false"} ?disabled=${r} @click=${()=>x(m.id)}>
              <span class="avatar" aria-hidden="true">${be(m.name)}</span>${m.name}
            </button>`})}
        </div>
        ${e.who.length>1?u`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${p(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${p(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:w}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${p(e.repeats==="daily","Every day",()=>f("daily"))}
          ${p(e.repeats==="weekly","Every week",()=>f("weekly"))}
          ${p(e.repeats==="monthly","Every month",()=>f("monthly"))}
          ${p(e.repeats==="school","School days",()=>f("school"))}
        </div>
      </div>
      ${T}
      ${e.repeats==="school"?w:u`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${Xl(e.repeats,e.every)}</span>
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
      ${e.template?u`<div class="field">
              ${p(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${r} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:w}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!d} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":d?d.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return u``;let o=e.busy,s=p=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...p})},r=p=>s({kids:e.kids.includes(p)?e.kids.filter(a=>a!==p):[...e.kids,p]}),l=n.kids.filter(p=>Ot(p,e.date)),d=e.dish.trim(),h=e.kids.length?d?null:"Type what’s served":"Pick who gets this menu";return u`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${me(e.date)}</span>
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
          @input=${p=>s({dish:p.target.value})}
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
          @input=${p=>s({details:p.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${l.map(p=>{let a=this.kidColorOf(p.id),f=e.kids.includes(p.id);return u`<button type="button" class="who-chip" style="--c:${a.color};--rgb:${a.rgb}" aria-pressed=${f?"true":"false"} ?disabled=${o} @click=${()=>r(p.id)}>
              <span class="avatar" aria-hidden="true">${be(p.name)}</span>${p.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${d||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?u`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:w}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!h} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":h??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return u``;let o=n.people?.length?n.people:n.kids.map(a=>({...a,role:"kid"})),s=n.kids.findIndex(a=>a.id===e.kid),r=n.kids[s],l=this.plan?de(this.plan):void 0,d=l?.get(e.kid)??Z(Math.max(0,s)),h=o.filter(a=>a.id!==e.kid),p=a=>{let f=n.kids.findIndex(x=>x.id===a.id);return f>=0?(l?.get(a.id)??Z(f)).color:"var(--dark)"};return u`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?u`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:w}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${hi(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${d.color};--rgb:${d.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${be(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?u`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${h.map(a=>u`<button type="button" class="done-by" style="--c:${p(a)}" @click=${()=>void this.toggleChore(e,a.id)}>
                  <span class="avatar ${a.role==="parent"?"driver":""}" aria-hidden="true">${be(a.name)}</span>
                  <span>${a.name}</span>
                </button>`)}
            </div>`:u`<button type="button" class="choice wide" @click=${()=>this.whoOthers=!0}>Someone else did</button>`}
      </div>
    `}renderLegend(){return u`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}ownHint(e,n){let o=yn(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${R(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${R(n.start)} to ${R(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let s=n.along.map(r=>re(e).includes(r)?ee(e,r):ne(e,r));return`${o} drives there and back${s.length?`, with ${ut(s)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return u``;let{day:o,event:s}=n,r=re(e),l=Us(e,s),d=yn(e,s),h=!!this.pending,p=b=>this.pending?.key===b?this.pending.value:void 0,a=[...e.people?.carpools??[]];for(let b of e.days)for(let y of b.events)for(let C of[y.drop,y.pick])C&&C!=="none"&&!r.includes(C)&&!a.some(S=>S.toLowerCase()===C.toLowerCase())&&a.push(C);let f=b=>{if(!s.sides.includes(b))return w;let y=p(b)??p("both"),C=b==="drop"?s.drop:s.pick,S=y!==void 0?String(y):s.no_ride_unless_named&&C==="none"?"":C,M=S===""&&!(y===void 0&&s.no_ride_unless_named),z=S&&S!=="none"&&!r.includes(S)?S:"",L=I=>{this.otherOpen=null,this.setRide(s,b,S===I?"":I,r)},U=[...r.map(I=>[I,oi(e,I)]),["none","Not needed"]],xe=`${s.id}|${b}`,E=this.otherOpen===xe;return u`<div class="field ride-box">
        <span class="field-label">${b==="drop"?"Drop-off":"Pick-up"} ${M?u`<span class="nobody">· nobody yet</span>`:w}</span>
        <div role="group" aria-label=${b==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${U.length+1}, minmax(0, 1fr))">
          ${U.map(([I,V])=>u`<button type="button" class="choice" aria-pressed=${S===I?"true":"false"} ?disabled=${h} @click=${()=>L(I)}>
                ${V}
              </button>`)}
          <button
            type="button"
            class="choice"
            aria-pressed=${z?"true":"false"}
            aria-expanded=${E?"true":"false"}
            ?disabled=${h}
            @click=${()=>this.otherOpen=E?null:xe}
          >
            ${z||"Other"}
          </button>
        </div>
        ${E?u`${a.length?u`<div role="group" aria-label=${b==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${a.map(I=>u`<button type="button" class="chip" aria-pressed=${S.toLowerCase()===I.toLowerCase()?"true":"false"} ?disabled=${h} @click=${()=>L(I)}>
                    ${I}
                  </button>`)}
            </div>`:w}
        <input
          type="text"
          .value=${z&&!a.some(I=>I.toLowerCase()===z.toLowerCase())?z:""}
          ?disabled=${h}
          aria-label=${b==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${I=>{let V=I.target.value.trim();V&&V!==S&&L(V)}}
          @keydown=${I=>{I.key==="Enter"&&I.target.blur()}}
        />`:w}
        ${!k&&S!==""&&S!=="none"?x(b,S):w}
      </div>`},x=(b,y)=>{let C=p(`along-${b}`),S=C!==void 0?C:b==="pick"?s.pick_along??[]:s.along,M=new Set(o.events.filter(U=>U.event_id===s.event_id&&!U.own).map(U=>U.kid)),z=[...fe(e).filter(U=>U!==s.kid&&!M.has(U)),...r.filter(U=>U!==y)];return z.length?u`<div class="field-sub">
        <span class="field-label">${b==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${b==="pick"?"Coming home too. Anyone already there just gets in.":b==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${b==="drop"?"Riding along on the drop-off":b==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${z.map(U=>u`<button type="button" class="chip" aria-pressed=${S.includes(U)?"true":"false"} ?disabled=${h} @click=${()=>this.toggleAlong(s,U,b)}>
              ${r.includes(U)?ee(e,U):ne(e,U)}
            </button>`)}
        </div>
      </div>`:w},T=r.includes(s.drop)?s.drop:r.includes(s.pick)?s.pick:"",m=s.drop===s.pick&&r.includes(s.drop),$=p("stay"),k=$!==void 0?!!$:s.stay&&m,g=p("along"),A=g!==void 0?g:s.along,D=s.own?[...fe(e),...r.filter(b=>b!==s.own)]:[],H=s.own!=null&&s.takes!=null,te=s.own!=null&&!H,ae=p("takes"),N=ae!==void 0?ae:s.takes??null,Ce=p("arrive"),ge=this.arriveDraft!==void 0?this.arriveDraft:Ce!==void 0?Ce:s.arrive_by,Be=p("leave"),ve=this.leaveDraft!==void 0?this.leaveDraft:Be!==void 0?Be:s.leave_by??null,Ne=(b,y)=>{let C=b==="arrive",S=C?s.start:s.end,M=L=>()=>C?this.nudgeArrive(s,L):this.nudgeLeave(s,L),z=(L,U,xe,E)=>u`<button
          type="button"
          class="step"
          aria-label=${U}
          ?disabled=${h||E}
          @pointerdown=${()=>this.startHold(M(L))}
          @pointerup=${()=>this.stopHold()}
          @pointerleave=${()=>this.stopHold()}
          @pointercancel=${()=>this.stopHold()}
          @click=${()=>this.tapStep(M(L))}
        >
          ${xe}
        </button>`;return u`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">${C?"Arrive":"Leave"}</span>
          <span class="field-hint">${rn(y-S)}</span>
        </span>
        <span class="stepper">
          ${z(-5,"Five minutes earlier","−",!C&&y-5<=s.start)}
          <span class="arrive-value">${R(y)}</span>
          ${z(5,"Five minutes later","+",!1)}
          <button
            type="button"
            class="step clear-time"
            aria-label=${C?"Arrive on time":"Leave at the end"}
            ?disabled=${h}
            @click=${()=>C?this.clearArrive():this.clearLeave()}
          >
            ×
          </button>
        </span>
      </div>`},le=s.sides.includes("pick")||s.own!=null,Re=ge!=null||this.timesOpen.arrive,je=le&&(ve!=null||this.timesOpen.leave),He=b=>()=>{this.timesOpen={...this.timesOpen,[b]:!0}},Ie=()=>u`${Re?Ne("arrive",ge??s.start):w}
      ${je?Ne("leave",ve??s.end):w}
      ${!Re||!je&&le?u`<div class="field time-chips">
            <div role="group" aria-label="Times" class="chips">
              ${Re?w:u`<button type="button" class="chip" ?disabled=${h} @click=${He("arrive")}>Arrive early or late</button>`}
              ${!je&&le?u`<button type="button" class="chip" ?disabled=${h} @click=${He("leave")}>Leave early or late</button>`:w}
            </div>
          </div>`:w}`,Ue=s.sides.includes("drop")&&s.sides.includes("pick"),ze=Ue&&(k||this.stayDraft===s.id),Fe=()=>{let b=Ue?u`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${ze?"false":"true"}
              ?disabled=${h}
              @click=${()=>{this.stayDraft=null,s.stay&&this.toggleStay(s,!1,T)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${ze?"true":"false"}
              ?disabled=${h}
              @click=${()=>{T?this.toggleStay(s,!0,T):this.stayDraft=s.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:w;if(!ze)return u`${b} ${f("drop")} ${f("pick")}`;let y=k&&m?s.drop:"";return u`${b}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${y?w:u`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(C=>u`<button
                type="button"
                class="choice"
                aria-pressed=${y===C?"true":"false"}
                ?disabled=${h}
                @click=${()=>{if(y===C||!this.backend)return;let S=this.backend;this.stayDraft=null,this.save("stay",!0,()=>S.setRide(s.id,"both",C,this.scope,!0))}}
              >
                ${ee(e,C)}
              </button>`)}
          </div>
          ${y?x("both",y):w}
        </div>`},Q=[],ye=b=>b==="none"?"Not needed":oi(e,b),G=b=>r.includes(b)?ee(e,b):ne(e,b),he=(b,y,C)=>{y===""&&!C.length||Q.push(`${b}: ${[y===""?"TBD":ye(y),...C.map(G)].join(", ")}`)},oe=b=>s.no_ride_unless_named&&b==="none"?"":b;s.own||he("Drop-off",oe(s.drop),s.along),s.own||he("Pick-up",oe(s.pick),s.pick_along??[]),!s.own&&s.stay&&Q.push("Stay: yes"),H&&Q.push(`Takes: ${s.takes} min`),s.own&&s.along.length&&Q.push(`Take along: ${s.along.map(G).join(", ")}`),s.arrive_by!=null&&s.arrive_by!==s.start&&Q.push(`Arrive: ${rn(s.arrive_by-s.start)}`),s.leave_by!=null&&s.leave_by!==s.end&&Q.push(`Leave: ${rn(s.leave_by-s.end)}`);let We=p("attending"),pe=We!==void 0?!!We:s.attending!==!1;s.attending===!1&&Q.splice(0,Q.length,"Attending: no");let Pe=o.date===this.today().date?"":`${se(o.date)} · `,c=vn(s),v=u`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${d} · ${s.title}</span>
          <span class="ed-meta">${Pe}${H?"any time ":""}${c}${s.place_name&&!s.place.startsWith("?")?` · ${s.place_name}`:""}</span>
          ${this.renderForLine(e,o,s)}
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;if(s.busy_only){let b=s.place_name&&s.place_name!==s.title?s.place_name:"",y=s.busy_why==="days"?"It runs over more than a day, so no drive is planned for it.":s.busy_why==="home"?"It’s at home, so no drive is planned for it.":"It has no address, so no drive is planned for it.";return u`${v}
        ${this.pending?u`<p class="saving" role="status">Saving to Google Calendar…</p>`:w}
        ${b?u`<div class="field"><span class="field-label">Where</span><span class="field-hint">${b}</span></div>`:w}
        <p class="field-hint">
          ${pe?`This blocks ${d}’s time: ${d} can’t drive then, so a ride that needs ${d} shows as a problem.`:`Not going, so it doesn’t block ${d}’s time, and ${d} can drive then.`}
          ${y}
        </p>
        <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setAttending(s,!pe)}>
          ${pe?`${d} isn’t going this time`:`${d} is going after all`}
        </button>
        ${s.problems.length?u`<p class="field-hint bad">These lines in the notes couldn’t be read: ${s.problems.join("; ")}</p>`:w}
        <details class="notes">
          <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
          <span class="notes-body">--- Rides ---\n${s.attending===!1?"Attending: no":"(nothing yet)"}</span>
        </details>`}return s.where==="home"?u`${v}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${d} can’t get home in time, the board shows it as a clash.</p>`:u`
      ${v}
      ${this.pending?u`<p class="saving" role="status">Saving to Google Calendar…</p>`:w}
      ${s.recurring?u`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${se(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:w}
      ${pe?u`${s.where==="anywhere"?u`<p class="field-hint">
                  ${s.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:w}
            ${s.own?u`<p class="field-hint">${this.ownHint(e,s)}</p>`:Fe()}
      ${s.own?u`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${N!=null?`Takes ${N} min, any time ${R(s.start)}–${R(s.end)}`:"At its set time"}</span>
            </span>
            ${N!=null?u`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${h||N<=5} @click=${()=>this.setTakes(s,Math.max(5,N-5))}>−</button>
                  <span class="arrive-value">${N} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${h||N+5>s.end-s.start} @click=${()=>this.setTakes(s,N+5)}>+</button>
                </span>`:w}
          </div>
          <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setTakes(s,N!=null?null:Math.min(10,Math.max(5,s.end-s.start)))}>
            ${N!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:w}
      ${te&&D.length?u`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${D.map(b=>u`<button type="button" class="chip" aria-pressed=${A.includes(b)?"true":"false"} ?disabled=${h} @click=${()=>this.toggleAlong(s,b)}>
                  ${r.includes(b)?ee(e,b):ne(e,b)}
                </button>`)}
            </div>
          </div>`:w}
      ${H?w:Ie()}
`:u`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${d} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setAttending(s,!pe)}>
        ${pe?`${d} isn’t going this time`:`${d} is going after all`}
      </button>
      ${s.problems.length?u`<p class="field-hint bad">These lines in the notes couldn’t be read: ${s.problems.join("; ")}</p>`:w}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${Q.length?Q.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${pe&&!s.own?u`<p class="field-hint">Tap a selected driver again to clear it.</p>`:w}
    `}};Kt.styles=fo,Kt.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},leaveDraft:{state:!0},timesOpen:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0},forPick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Kt);function td(i,t){let o=Math.max(1,Math.round(i/14)),s=i/o,r=[],l=[];for(let h=0;h<=o;h++){let p=+(h*s).toFixed(1);r.push(`${p},${h%2?5:0}`),l.push(`${p},${t-(h%2?0:5)}`)}let d=`M${r.join(" L")} L${[...l].reverse().join(" L")} Z`;return u`<svg width=${i} height=${t} viewBox="0 0 ${i} ${t}">
    ${Y`<path class="fold-fill" d=${d}></path>
      <path class="fold-edge" d=${`M${r.join(" L")}`}></path>
      <path class="fold-edge" d=${`M${l.join(" L")}`}></path>`}
  </svg>`}var Vt=class extends ue{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=bs(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(At);let n=e.toString();history.replaceState(history.state,"",`${location.pathname}${n?`?${n}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new ln(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return u`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?u`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:w}`}};Vt.styles=Ke`
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
  `,Vt.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0},pairing:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",Vt);
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
